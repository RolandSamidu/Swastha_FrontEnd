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
import { SimpleCard } from 'app/components'

const styleSheet = (theme) => ({})

class AvailabilityDataSetup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [
                {
                    code: 'P001',
                    type: 'Standard',
                    description: "Make Feel Better"
                },
                {
                    code: 'P002',
                    type: 'Medical',
                    description: "Make Feel Better"
                },
                {
                    code: 'P003',
                    type: 'Other',
                    description: "Make Feel Better"
                },
            ],
            columns: [
                {
                    name: 'code', // field name in the row object
                    label: 'Procurement Agent Code', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'type',
                    label: 'Type',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'description',
                    label: 'Description',
                    options: {
                        // filter: true,
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
            filterData: {
                seriesStartNumber: null,
                seriesEndNumber: null,
                itemGroupName: null,
                shortRef: null,
                description: null,
            },

            formData: {
                limit: 20,
                page: 0,
                code: null,
                type: null
            },

            code_items: [
                { id: "C001", name: "ADB" },
                { id: "C002", name: "APD" },
                { id: "C003", name: "DNS" },
                { id: "C004", name: "DON" },
                { id: "C005", name: "MSD" },
                { id: "C006", name: "SPC" },
                { id: "C007", name: "SPMC" },
                { id: "C008", name: "STC" },
                { id: "C009", name: "WHO" },
                { id: "C010", name: "WB1" },
                { id: "C011", name: "WB2" },
                { id: "C012", name: "WB3" },
            ],

            type_items: [
                { id: "T001", name: "SPC" },
                { id: "T002", name: "MSD" },
            ]
        }
    }

    async loadData() {
        //function for load initial data from backend or other resources

        // let district_res = await DivisionsServices.getAllDistrict({
        //     limit: 99999,
        // })
        // if (district_res.status == 200) {
        //     console.log('district', district_res.data.view.data)
        //     this.setState({
        //         all_district: district_res.data.view.data,
        //     })
        // }

        // let moh_res = await DivisionsServices.getAllMOH({ limit: 99999 })
        // if (moh_res.status == 200) {
        //     console.log('moh', moh_res.data.view.data)
        //     this.setState({
        //         all_moh: moh_res.data.view.data,
        //     })
        // }

        // let phm_res = await DivisionsServices.getAllPHM({ limit: 99999 })
        // if (phm_res.status == 200) {
        //     console.log('phm', phm_res.data.view.data)
        //     this.setState({
        //         all_phm: phm_res.data.view.data,
        //     })
        // }

        // let gn_res = await DivisionsServices.getAllGN({ limit: 99999 })
        // if (gn_res.status == 200) {
        //     console.log('gn', gn_res.data.view.data)
        //     this.setState({
        //         all_gn: gn_res.data.view.data,
        //     })
        // }
    }

    async saveStepOneSubmit() { }

    async SubmitAll() {
        // let formData = this.state.formData
        // formData.age =
        //     formData.age_all.years +
        //     '-' +
        //     formData.age_all.months +
        //     '-' +
        //     formData.age_all.days

        // let res = await PatientServices.createNewPatient(formData)
        // if (res.status == 201) {
        //     this.setState({
        //         alert: true,
        //         message: 'Patient Registration Successful',
        //         severity: 'success',
        //     })
        // } else {
        //     this.setState({
        //         alert: true,
        //         message: 'Patient Registration Unsuccessful',
        //         severity: 'error',
        //     })
        // }
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New formdata", this.state.formData)
            this.loadData()
        })
    }

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState({ files: files }, () => {
            console.log('files', this.state.files)
        })
    }

    componentDidMount() {
        this.loadData()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <CardTitle title="Fund Availability Data Setup" />
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.SubmitAll()}
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid container spacing={2} direction="row">
                                {/* Filter Section */}
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    {/* Item Series Definition */}
                                    <Grid container spacing={2}>
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
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Procurement Agent Code" />
                                                    <Autocomplete
                                        disableClearable className="w-full"
                                                        options={this.state.code_items}
                                                        onChange={(e, value) => {
                                                            let formData = this.state.formData
                                                            if (value != null) {
                                                                formData.code = value.name
                                                            } else {
                                                                formData.code = null
                                                            }
                                                            console.log(this.state.formData);
                                                            this.setState({ formData })
                                                        }}
                                                        /*  defaultValue={this.state.all_district.find(
                                                        (v) => v.id == this.state.formData.district_id
                                                        )} */
                                                        value={this.state.code_items.find((v) => v.name == this.state.formData.code)}
                                                        getOptionLabel={(option) => option.name ? option.name : ''}
                                                        renderInput={(params) => (
                                                            <TextValidator {...params} placeholder="Procurement Agent Code"
                                                                //variant="outlined"
                                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                                        )} />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* Request ID*/}
                                        <Grid
                                            style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        > <Grid container spacing={2}>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Type" />
                                                    <Autocomplete
                                        disableClearable className="w-full"
                                                        options={this.state.type_items}
                                                        onChange={(e, value) => {
                                                            let formData = this.state.formData
                                                            if (value != null) {
                                                                formData.type = value.name
                                                            } else {
                                                                formData.code = null
                                                            }
                                                            console.log(this.state.formData);
                                                            this.setState({ formData })
                                                        }}
                                                        /*  defaultValue={this.state.all_district.find(
                                                        (v) => v.id == this.state.formData.district_id
                                                        )} */
                                                        value={this.state.type_items.find((v) => v.name == this.state.formData.type)}
                                                        getOptionLabel={(option) => option.name ? option.name : ''}
                                                        renderInput={(params) => (
                                                            <TextValidator {...params} placeholder="Type"
                                                                //variant="outlined"
                                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                                        )} />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* Submit and Cancel Button */}
                                        <Grid
                                            style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
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
                                                        className="mt-2"
                                                        progress={false}
                                                        type="submit"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon="save"
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">
                                                            Add
                                                        </span>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* Table Section */}
                                <Grid container className="mt-3 pb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Divider className='mt-2' />
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                rowsPerPage: this.state.formData.limit,
                                                page: this.state.formData.page,
                                                rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                selectableRows: false,
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
                                                            this.setPage(tableState.page)
                                                            break
                                                        case 'changeRowsPerPage':
                                                            let formData = this.state.formData
                                                            formData.limit = tableState.rowsPerPage
                                                            this.setState({ formData })
                                                            this.setPage(0)
                                                            break;
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

export default withStyles(styleSheet)(AvailabilityDataSetup)
