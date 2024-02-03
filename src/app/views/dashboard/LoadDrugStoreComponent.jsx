import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import { Grid, InputAdornment, Dialog } from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'

import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import {
    LoonsCard,
    Button,
    SubTitle,
    Widget,
    CardTitle,
    LoonsSnackbar,
} from 'app/components/LoonsLabComponents'
import fscreen from 'fscreen'
import localStorageService from 'app/services/localStorageService'
import ClinicService from 'app/services/ClinicService'
import WarehouseServices from 'app/services/WarehouseServices'

const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },

    root: {
        display: 'flex',
    },
})
class LoadDrugStoreComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            moreView: false,
            formData: { phn: null },
            patient_id: null,
            Loaded: false,
            clear: true,

            login_hospital: {},

            dialog_for_select_frontDesk: false,
            all_pharmacy: [],

            snackbar: false,
            snackbar_message: '',
            snackbar_severity: 'success',

            count: 0,
        }
    }

    async focus() {}

    async loadRelatedHospitals(value) {
        let params = { issuance_type: 'Hospital' }
        let res = await ClinicService.fetchAllClinicsNew(params, value.owner_id)
        if (res.status == 200) {
            console.log('hospital', res.data.view.data)
            if (res.data.view.data.length > 0) {
                this.saveDataInLocal({
                    hospital_id: res.data.view.data[0].id,
                    owner_id: value.owner_id,
                    pharmacy_drugs_stores_id: value.pharmacy_drugs_stores_id,
                    frontDesk_id: value.id,
                    name: value.name,
                })

                this.setState({ dialog_for_select_frontDesk: false })
            }
        }
    }
    async saveDataInLocal(data) {
        await localStorageService.setItem('Login_user_Hospital', data)
        this.setState({ login_hospital: data }, () => {})

        const { onChange } = this.props
        onChange && onChange()
    }

    async loadPharmacy() {
        var user = await localStorageService.getItem('userInfo')

        var id = user.id
        var all_pharmacy_dummy = []

        var frontDesk_id = await localStorageService.getItem(
            'Login_user_Hospital'
        )
        if (!frontDesk_id) {
            this.setState({
                dialog_for_select_frontDesk: true,
                userRoles: user.roles,
            })
        } else {
            this.setState(
                {
                    login_hospital: frontDesk_id,
                    userRoles: user.roles,
                },
                () => {}
            )
        }

        let params = { employee_id: id } //
        let res = await WarehouseServices.getWareHouseUsers(params)
        if (res.status == 200) {
            console.log('CPALLOders', res.data.view.data)

            res.data.view.data.forEach((element) => {
                all_pharmacy_dummy.push({
                    Pharmacy_drugs_store: element.Warehouse,
                    name: element.Warehouse.name,
                    id: element.warehouse_id,
                    owner_id: element.Warehouse.owner_id,
                    pharmacy_drugs_stores_id:
                        element.Warehouse.pharmacy_drugs_store_id,
                })
            })
            console.log('desk data', all_pharmacy_dummy)
            this.setState({ all_pharmacy: all_pharmacy_dummy })
        }
    }

    componentDidMount() {
        this.loadPharmacy()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        })
        let patient_id = this.state.patient_id

        return (
            <div>
                <Grid container>
                    <Grid item lg={10} md={10} sm={10} xs={10}>
                        <p style={{ color: 'black' }}>
                            <span className="font-bold text-14">
                                You're in {this.state.login_hospital.name}
                            </span>
                        </p>
                    </Grid>
                    <Grid item lg={2} md={2} sm={2} xs={2}>
                        <Button
                            className="mt-2"
                            progress={false}
                            scrollToTop={true}
                            //startIcon="save"
                            onClick={() => {
                                this.setState({
                                    dialog_for_select_frontDesk: true,
                                })
                            }}
                        >
                            <span className="capitalize"> Change</span>
                        </Button>
                    </Grid>
                </Grid>

                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={this.state.dialog_for_select_frontDesk}
                >
                    <MuiDialogTitle
                        disableTypography
                        className={classes.Dialogroot}
                    >
                        <CardTitle title="Select Your Warehouse" />
                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            //onSubmit={() => this.searchPatients()}
                            onError={() => null}
                            className="w-full"
                        >
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                // ref={elmRef}
                                options={this.state.all_pharmacy}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        this.loadRelatedHospitals(value)
                                        this.setState({
                                            frontDesk_id: value.id,
                                        })
                                    }
                                }}
                                value={{
                                    name: this.state.frontDesk_id
                                        ? this.state.all_pharmacy.find(
                                              (obj) =>
                                                  obj.id ==
                                                  this.state.frontDesk_id
                                          ).name
                                        : null,
                                    id: this.state.frontDesk_id,
                                }}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Pharmacy"
                                        //variant="outlined"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />
                        </ValidatorForm>
                    </div>
                </Dialog>

                <LoonsSnackbar
                    open={this.state.snackbar}
                    onClose={() => {
                        this.setState({ snackbar: false })
                    }}
                    message={this.state.snackbar_message}
                    autoHideDuration={3000}
                    severity={this.state.snackbar_severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
            </div>
        )
    }
}

export default withStyles(styleSheet)(LoadDrugStoreComponent)
