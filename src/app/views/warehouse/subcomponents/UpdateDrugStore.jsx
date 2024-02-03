import { FormControlLabel, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete } from '@material-ui/lab'
import FlowDiagramComp from 'app/components/FlowDiagramComp/FlowDiagramComp'
import {
    Button,
    CardTitle,
    CheckboxValidatorElement,
    LoonsCard,
    LoonsSnackbar,
    MainContainer,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import DepartmentService from 'app/services/DepartmentService'
import DepartmentTypeService from 'app/services/DepartmentTypeService'
import PharmacyService from 'app/services/PharmacyService'
import TransferList from 'app/views/common/TransferList'
import 'date-fns'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'

const styleSheet = (theme) => ({})

class UpdateDrugStore extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allDepartmentTypes: [],
            allDepartments: [],
            drugStoreData: [],
            selectedDrugStore: '',
            alert: false,
            message: '',
            severity: 'success',
            allHigherLevels: [
                { name: 'level1', id: 1 },
                { name: 'lavel2', id: 2 },
                { name: 'lavel3', id: 3 },
            ],

            formData: {
                store_id: '',
                name: '',
                department_type: null,
                department: null,
                store_type: null,
                location: '',
                higher_levels: null,
                admin: false,
                counter: false,
                designated: false,
            },
        }
    }

    componentDidMount() {
        // this.loadData()]

        console.log('Props=============>', this.props)
    }

    loadAllDataStoreData = async () => {
        let dataStoreData = await PharmacyService.fetchAllDataStorePharmacy('001', {})
        if (200 == dataStoreData.status) {
            this.setState({
                drugStoreData: dataStoreData.data.view.data,
            })
        }
    }

    //Change the state based on the checkbox change
    handleChange = (val) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [val.target.name]: val.target.checked,
            },
        })
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        const isUpdate = this.props.location.state != null
        let dataStoreObj = null

        if (isUpdate) {
            dataStoreObj = this.props.location.state
        }

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Drug Store Information" />

                        <div className="w-full">
                            <ValidatorForm
                                className="pt-2"
                                onSubmit={() => this.saveStepOne()}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex ">
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Drug Store Id" />

                                        {isUpdate ? (
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Store ID"
                                                name="store_id"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={dataStoreObj.id}
                                                disabled={true}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                            />
                                        ) : (
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={
                                                    this.state.drugStoreData
                                                }
                                                onChange={(e, value) => {
                                                    if (null != value) {
                                                        this.setState({
                                                            selectedDrugStore:
                                                                value.label,
                                                        })
                                                    }
                                                }}
                                                getOptionLabel={(option) =>
                                                    option.label
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Drug Store Id"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state
                                                                .selectedDrugStore
                                                        }
                                                    />
                                                )}
                                            />
                                        )}
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Name" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Name"
                                            name="store_name"
                                            InputLabelProps={{ shrink: false }}
                                            disabled={true}
                                            value={
                                                isUpdate
                                                    ? dataStoreObj.name
                                                    : ''
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        {/* TODO - Check what is this. This is not submitted to backend */}
                                        <SubTitle title="Department Type" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Department Type"
                                            disabled={true}
                                            name="Department Type"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                isUpdate
                                                    ? dataStoreObj.name
                                                    : ''
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Department" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Department"
                                            disabled={true}
                                            name="Department"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                isUpdate
                                                    ? dataStoreObj.name
                                                    : ''
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Store Type" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Store Type"
                                            disabled={true}
                                            name="storeType"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                isUpdate
                                                    ? dataStoreObj.name
                                                    : ''
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Location" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Location"
                                            disabled={true}
                                            name="storeType"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                isUpdate
                                                    ? dataStoreObj.location
                                                    : ''
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        {/* TODO - Check what is this. This is not submitted to backend */}
                                        <SubTitle title="Higher Levels" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Higgher Levels"
                                            disabled={true}
                                            name="storeType"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                isUpdate
                                                    ? dataStoreObj.location
                                                    : ''
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Pharmacists Types" />

                                        <Grid
                                            container
                                            spacing={1}
                                            className="flex"
                                        >
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    disabled={true}
                                                    checked={
                                                        isUpdate
                                                            ? dataStoreObj.is_admin
                                                            : false
                                                    }
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            name="admin"
                                                            value="admin"
                                                        />
                                                    }
                                                    label="Admin Pharmacist"
                                                />
                                            </Grid>

                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    disabled={true}
                                                    checked={
                                                        isUpdate
                                                            ? dataStoreObj.is_counter
                                                            : false
                                                    }
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            name="counter"
                                                            value="counter"
                                                        />
                                                    }
                                                    label="Counter Pharmacist"
                                                />
                                            </Grid>

                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    disabled={true}
                                                    checked={
                                                        isUpdate
                                                            ? dataStoreObj.is_drug_store
                                                            : false
                                                    }
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            name="designated"
                                                            value="designated"
                                                        />
                                                    }
                                                    label="Designated Pharmacist"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                        </div>
                        <TransferList />

                        <FlowDiagramComp id="9650ff7e-285f-412b-a3a6-f698e8f7ec0a" />
                    </LoonsCard>
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
                </MainContainer>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(AssignDrugs)
