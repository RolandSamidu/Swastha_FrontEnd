import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    CircularProgress,
    IconButton,
    Icon,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import CategoryService from 'app/services/datasetupServices/CategoryService'
import ClinicDataSetupService from 'app/services/datasetupServices/ClinicDataSetupService'

const styleSheet = (theme) => ({})

class ClinicDiagonosisSetup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            isUpdate: false,
            data: [],
            catId: null,
            isLoaded: false,
            columns: [
                {
                    name: 'id',
                    label: 'id',
                    options: {
                        display: false,
                    },
                },
                {
                    name: 'name',
                    label: 'Name',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'description',
                    label: 'Description',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'serial_no',
                    label: 'Serial No',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'short_reference',
                    label: 'Short Reference',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <IconButton
                                        className="text-black mr-2"
                                        onClick={() => {
                                            this.handleUpdate(
                                                this.state.data[
                                                    tableMeta.rowIndex
                                                ]
                                            )
                                        }}
                                    >
                                        <Icon>mode_edit_outline</Icon>
                                    </IconButton>
                                    <IconButton
                                        className="text-black"
                                        onClick={null}
                                    >
                                        <Icon>delete_sweep</Icon>
                                    </IconButton>
                                </>
                            )
                        },
                    },
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            patient_pic: null,
            all_district: [],
            all_moh: [],
            all_phm: [],
            all_gn: [],

            loading: false,
            formData: {
                serialNumber: null,
                name: null,
                shortRef: null,
                description: null,
            },
            filterData: {
                limit: 10,
                page: 0,
            },
            totalItems: 0,
            totalPages: 0,
            tableDataLoaded: false,
        }
    }

    handleUpdate = (val) => {
        this.setState({
            isUpdate: true,
            formData: {
                serialNumber: val.serial_no,
                name: val.name,
                shortRef: val.short_reference,
                description: val.description,
            },
            catId: val.id,
        })
    }

    clearField = () => {
        this.setState({
            formData: {
                serialNumber: '',
                name: '',
                shortRef: '',
                description: '',
            },
            catId: null,
            isUpdate: false,
        })
    }

    handleDataSubmit = async () => {
        let { serialNumber, name, shortRef, description } = this.state.formData

        const clinicDiagnosisDto = {
            serial_no: serialNumber,
            name,
            short_reference: shortRef,
            description,
        }

        console.log('ClinicData Dt===>', clinicDiagnosisDto)

        let res

        if (!this.state.isUpdate) {
            //save function
            res = await ClinicDataSetupService.createNewClinicDiagnosis(
                clinicDiagnosisDto
            )
        } else {
            res = await ClinicDataSetupService.updateClinicDiagnosis(
                this.state.catId,
                clinicDiagnosisDto
            )
        }

        if (200 == res.status) {
            this.setState({
                alert: true,
                message: 'Clinic Diagnosis Successfully Updated',
                severity: 'success',
            })
        } else if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Clinic Diagnosis Successfully Created',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Clinic Diagnosis action was Unsuccessful',
                severity: 'error',
            })
        }

        this.clearField()
        this.fetchDataSet()
    }

    componentDidMount() {
        this.fetchDataSet()
    }

    async fetchDataSet() {
        //Reset load
        this.setState({
            tableDataLoaded: false,
        })

        let filterData = this.state.filterData

        const res = await ClinicDataSetupService.fetchAllDiagnosis(filterData)

        if (200 == res.status) {
            filterData.page = res.data.view.currentPage
            this.setState(
                {
                    filterData,
                    data: res.data.view.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                    tableDataLoaded: true,
                },
                () => {
                    console.log('data', this.state)
                    this.render()
                }
            )
        }
    }

    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.fetchDataSet()
            }
        )
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Diagnosis Setup" />

                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.handleDataSubmit()}
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                className="mt-3"
                            >
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Grid container spacing={2}>
                                        {/* heading */}
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <SubTitle
                                                title={
                                                    this.state.isUpdate
                                                        ? 'Edit Diagnosis'
                                                        : 'Add,Edit Diagnosis'
                                                }
                                            />
                                            <Divider className="mt-2" />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <Grid container spacing={2}>
                                                {/* Serial Number*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Serial Start Number" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Serial Start Number"
                                                        name="phn"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .serialNumber
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    serialNumber:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    />
                                                </Grid>

                                                {/* Name*/}
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
                                                        name="phn"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .name
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    name: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    />
                                                </Grid>

                                                {/* Short Reference*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Short Reference" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Short Reference"
                                                        name="shortRef"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .shortRef
                                                        }
                                                        type="text"
                                                        disabled={
                                                            this.state.isUpdate
                                                        }
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    shortRef:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    />
                                                </Grid>

                                                {/* Description*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Description" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Description"
                                                        name="description"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .description
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    description:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    />
                                                </Grid>
                                            </Grid>

                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        item
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        xs={12}
                                                        className=" w-full flex justify-end"
                                                    >
                                                        {/* Submit Button */}
                                                        <Button
                                                            className="mt-2 mr-2"
                                                            progress={false}
                                                            type="submit"
                                                            scrollToTop={true}
                                                            startIcon="save"
                                                            //onClick={this.handleChange}
                                                        >
                                                            <span className="capitalize">
                                                                {this.state
                                                                    .isUpdate
                                                                    ? 'Update'
                                                                    : 'Submit'}
                                                            </span>
                                                        </Button>
                                                        {/* Cancel Button */}
                                                        <Button
                                                            className="mt-2"
                                                            progress={false}
                                                            scrollToTop={true}
                                                            color="#cfd8dc"
                                                            onClick={
                                                                this.clearField
                                                            }
                                                        >
                                                            <span className="capitalize">
                                                                Cancel
                                                            </span>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Table Section */}
                                <Grid container className="mt-3">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        {this.state.tableDataLoaded ? (
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'}
                                                data={this.state.data}
                                                columns={this.state.columns}
                                                options={{
                                                    pagination: true,
                                                    serverSide: true,
                                                    count: this.state
                                                        .totalItems,
                                                    rowsPerPage: 10,
                                                    page: this.state.filterData
                                                        .page,
                                                    onTableChange: (
                                                        action,
                                                        tableState
                                                    ) => {
                                                        console.log(
                                                            action,
                                                            tableState
                                                        )
                                                        switch (action) {
                                                            case 'changePage':
                                                                this.setPage(
                                                                    tableState.page
                                                                )
                                                                break
                                                            case 'sort':
                                                                //this.sort(tableState.page, tableState.sortOrder);
                                                                break
                                                            default:
                                                                console.log(
                                                                    'action not handled.'
                                                                )
                                                        }
                                                    },
                                                }}
                                            ></LoonsTable>
                                        ) : (
                                            //load loading effect
                                            <Grid className="justify-center text-center w-full pt-12">
                                                <CircularProgress size={30} />
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                    </LoonsCard>
                </MainContainer>

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

export default withStyles(styleSheet)(ClinicDiagonosisSetup)
