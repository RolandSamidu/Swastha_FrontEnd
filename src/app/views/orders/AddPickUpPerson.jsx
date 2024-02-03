import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    FormControlLabel,
    Checkbox,
    Hidden,
    FormGroup,
    TextField,
    Typography,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import ClinicService from 'app/services/ClinicService'
import PatientServices from 'app/services/PatientServices'
import PatientClinicService from 'app/services/PatientClinicService'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { DateTimePicker } from '@material-ui/pickers'
import localStorageService from 'app/services/localStorageService';
import EmployeeServices from 'app/services/EmployeeServices'
import {
    Button,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    DatePicker,
    CheckboxValidatorElement,
    LoonsSnackbar,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import { dateParse, timeParse, dateTimeParse } from "utils";
import VehicleService from "app/services/VehicleService";
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import { element } from 'prop-types'

const styleSheet = (theme) => ({})

class AddPickUpPerson extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            order: {
                order_exchange_id: null,
                pickup_person_id: null,
                remarks: [],
            },
            loaded: false,
            filterData: {
                //page: 0,
                //limit: 20,
                type: ["Helper", 'Health Service Assistant', 'Driver','Drug Store Keeper','Chief MLT','Chief Radiographer','Pharmacist','RMSD MSA','RMSD OIC','RMSD Pharmacist']
            },
            remarks: null,
            other_remark: '',
            employees: null,
            other_remark_check: false,
            alert: false,
            message: '',
            severity: 'success',
        }
    }

    async loadData() {
        let filterData = this.state.filterData;
        let hospital = await localStorageService.getItem("login_user_pharmacy_drugs_stores")
        filterData.created_location_id = hospital[0].pharmacy_drugs_stores_id;

        this.setState({ loaded: false })

        let user_res = await VehicleService.getVehicleUsers(filterData);
        if (user_res.status == 200) {
            console.log('data', user_res.data.view.data);
            this.setState({
                employees: user_res.data.view.data,
                totalPages: user_res.data.view.totalPages,
                totalItems: user_res.data.view.totalItems,
            })
        }

        let res = await PharmacyOrderService.getRemarks({type: 'Order Delivery Remark'})
        if (res.status == 200) {
            let remarks = [...res.data.view.data, { remark: 'Other' }]
            this.setState({
                remarks: remarks,
                loaded: true
            },
                () => { console.log(this.state.remarks); this.render() })
            return;
        }

    }

    async componentDidMount() {
        // let selectedObj = this.props.location.state
        let order = this.state.order;
        order.order_exchange_id = this.props.id.id
        this.setState({
            order
        }, () => console.log("patient", this.state.order))
        this.loadData();
    }




    /**
     * Function to retrieve required data sets to inputs
     */

    /**
     *
     * @param {} val
     * Update the status based on the check box selection
     */
    handleChange = (val) => {
        const formDataSet = this.state.formData

        formDataSet.stat = val == "true" ? true : false;
        this.setState({
            formData: formDataSet,
        })
    }

    async onSubmit() {
        const { onSuccess } = this.props;
        // this.state.order.remarks=[...this.state.remarks,this.state.other_remark]
        // console.log(this.state.order);
        // console.log('other',this.state.other_remark)
        let neww = [...this.state.order.remarks, { other_remarks: this.state.other_remark }]
        this.state.order.remarks = neww

        let res = await PharmacyOrderService.setUpDeliveries(this.state.order)

        if (res.status && res.status == 201) {
            this.setState({
                alert: true,
                message: 'Order Updated Successfully',
                severity: 'success',
            }, () => {
                onSuccess &&
                    onSuccess({

                    });
            })
            // window.location.reload();
        } else {
            this.setState({
                alert: true,
                message: 'Order Updated Unsuccessful',
                severity: 'error',
            })
        }
    }



    render() {
        // let { theme } = this.props
        // const { classes } = this.props
        // console.log('reason value', this.state.patientObj.reason_id ? this.state.patientObj.reason_id : 'nah')
        return (
            <Fragment >
                {this.state.loaded ?
                    <div className="w-full">
                        <MainContainer>
                            <ValidatorForm
                                onSubmit={() => this.onSubmit()}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} lg={12} >
                                        <Typography variant='h6' className="font-semibold"> Pick Up Person :</Typography>
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.employees
                                            }
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let order = this.state.order;
                                                    order.pickup_person_id = value.id
                                                    this.setState({ order })
                                                }
                                            }}
                                            // value={appConst.user_type.find(
                                            //     (v) =>
                                            //         v.type ===
                                            //         this.state.formData
                                            //             .type
                                            // )}
                                            getOptionLabel={(option) =>
                                                option.name ? option.name : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Person"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>
                                    {/* <Grid item xs={12} lg={12} style={{ display: 'flex', alignItems: 'center' }}>

                                </Grid> */}
                                    <Grid item xs={12} lg={12} >
                                        <Typography variant='h6' className="font-semibold"> Remarks :</Typography>
                                        <Autocomplete
                                        disableClearable
                                            multiple={true}
                                            className="w-full"
                                            options={this.state.remarks
                                            }
                                            onChange={(e, value) => {
                                                console.log('remarks', value);
                                                if (null != value) {

                                                    let check = value.find((element, index) => {
                                                        if (element.remark == 'Other') {
                                                            return true;
                                                        }
                                                        else {
                                                            return false
                                                        }
                                                    })

                                                    if (check) {
                                                        console.log('insidedefefe');
                                                        let checkss = this.state.other_remark_check;
                                                        this.setState({
                                                            other_remark_check: !checkss
                                                        }, () => console.log('other_remark_check', this.state.other_remark_check))
                                                    }

                                                    else {
                                                        let order = this.state.order;
                                                        order.remarks = []
                                                        value.forEach(element => { order.remarks.push({ 'remarks_id': element.id }) })
                                                        this.setState({ order })
                                                        this.setState({ other_remark_check: false })
                                                    }

                                                }
                                            }}
                                            // value={appConst.user_type.find(
                                            //     (v) =>
                                            //         v.type ===
                                            //         this.state.formData
                                            //             .type
                                            // )}
                                            getOptionLabel={(option) =>
                                                option.remark ? option.remark : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Select remarks"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>
                                    {
                                        this.state.other_remark_check &&
                                        <Grid item xs={12} lg={12} >
                                            <Typography variant='h6' className="font-semibold"> Other Remarks :</Typography>
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Enter Remarks"
                                                name="otherremark"
                                                InputLabelProps={{
                                                    shrink: false
                                                }}
                                                value={this.state.other_remark}
                                                type="text"
                                                variant="outlined"
                                                size="small"

                                                onChange={(e) => {
                                                    this.setState({
                                                        other_remark: e.target.value

                                                    })
                                                }} />
                                        </Grid>
                                    }
                                    <Grid item lg={1} md={1} sm={12} xs={12} >
                                        <LoonsButton
                                            className="mt-2"
                                            progress={false}
                                            type="submit"
                                            scrollToTop={true}
                                        //onClick={this.handleChange}
                                        >
                                            <span className="capitalize">Save</span>
                                        </LoonsButton>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                        </MainContainer>

                    </div>
                    : null}
                {/* Content End */}

                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>

            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(AddPickUpPerson)
