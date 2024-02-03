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
    InputAdornment,
    IconButton,
    Icon,
} from '@material-ui/core'
import Rating from '@mui/material/Rating';
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
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import SearchIcon from '@mui/icons-material/Search';
import { dateParse } from 'utils'

const styleSheet = (theme) => ({})

class AllSupplierDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [
                {
                    supplierId: 'S001',
                    supplierName: 'Harish',
                    reg_hospital: "National Hospital",
                    regDate: dateParse(new Date()),
                    srNo: 'S001',
                    itemName: 'Panadol',
                    mqp: 'true',
                    status: "no",
                    rating: '5',
                },
                {
                    supplierId: 'S002',
                    supplierName: 'Nimal',
                    reg_hospital: "National Hospital",
                    regDate: dateParse(new Date()),
                    srNo: 'S002',
                    itemName: 'Panadol',
                    mqp: 'true',
                    status: "no",
                    rating: '3',
                },
                {
                    supplierId: 'S003',
                    supplierName: 'Perera',
                    reg_hospital: "National Hospital",
                    regDate: dateParse(new Date()),
                    srNo: 'S003',
                    itemName: 'Panadol',
                    mqp: 'true',
                    status: "yes",
                    rating: '4',
                },
            ],
            columns: [
                {
                    name: 'supplierId', // field name in the row object
                    label: 'Supplier ID', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'supplierName', // field name in the row object
                    label: 'Supplier Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'registeredInstitute', // field name in the row object
                    label: 'Registered Institute', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'regDate',
                    label: 'Reg Date',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'srNo',
                    label: 'SR No',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'itemName',
                    label: 'Item Name',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'mqp',
                    label: 'MQP',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'status',
                    label: 'Blacklisted Status',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'rating',
                    label: 'Rating',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Rating name="half-rating-read" defaultValue={parseFloat(this.state.data[tableMeta.rowIndex]?.rating)} precision={0.1} readOnly />
                                // <p>{this.state.itemData[tableMeta.rowIndex]?.ItemSnap.sr_no ? this.state.itemData[tableMeta.rowIndex]?.ItemSnap.sr_no : "Not Available"}</p>
                            )
                        },
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
                                <IconButton
                                    className="text-black mr-2"
                                    onClick={() => {
                                        window.location = `/localpurchase/supplier/123`
                                    }}
                                >
                                    <Icon>visibility</Icon>
                                </IconButton>
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
            filterData: {
                sr_no: null,
                reg_hospital: null,
                district: null,
                supplier_id: null,
                supplier_name: null,
                description: null,
            },

            formData: {
                limit: 20,
                page: 0,
                item_id: this.props.match.params.item_id
            },
        }
    }

    async loadData() {
        //function for load initial data from backend or other resources

        let district_res = await DivisionsServices.getAllDistrict({
            limit: 99999,
        })
        if (district_res.status == 200) {
            console.log('district', district_res.data.view.data)
            this.setState({
                all_district: district_res.data.view.data,
            })
        }

        let moh_res = await DivisionsServices.getAllMOH({ limit: 99999 })
        if (moh_res.status == 200) {
            console.log('moh', moh_res.data.view.data)
            this.setState({
                all_moh: moh_res.data.view.data,
            })
        }

        let phm_res = await DivisionsServices.getAllPHM({ limit: 99999 })
        if (phm_res.status == 200) {
            console.log('phm', phm_res.data.view.data)
            this.setState({
                all_phm: phm_res.data.view.data,
            })
        }

        let gn_res = await DivisionsServices.getAllGN({ limit: 99999 })
        if (gn_res.status == 200) {
            console.log('gn', gn_res.data.view.data)
            this.setState({
                all_gn: gn_res.data.view.data,
            })
        }
    }

    async saveStepOneSubmit() { }

    async SubmitAll() {
        let formData = this.state.formData
        formData.age =
            formData.age_all.years +
            '-' +
            formData.age_all.months +
            '-' +
            formData.age_all.days

        let res = await PatientServices.createNewPatient(formData)
        if (res.status == 201) {
            this.setState({
                alert: true,
                message: 'Patient Registration Successful',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Patient Registration Unsuccessful',
                severity: 'error',
            })
        }
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
                        <CardTitle title="All Suppliers" />
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.SubmitAll()}
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid container spacing={2} direction="row">
                                {/* Filter Section */}
                                <Grid item xs={12} className='mb-10' sm={12} md={12} lg={12}>
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
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="SR Number" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="SR Number"
                                                        name="sr_no"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.filterData
                                                                .sr_no
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    sr_no:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <SearchIcon></SearchIcon>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    // validators={[
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                    />
                                                </Grid>

                                                {/* Name*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="District" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="District"
                                                        name="district"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.filterData
                                                                .district
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    district:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <SearchIcon></SearchIcon>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    // validators={[
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                    />
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Reg Hospital" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Reg Hospital"
                                                        name="reg_hospital"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.filterData
                                                                .reg_hospital
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    reg_hospital:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <SearchIcon></SearchIcon>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    // validators={[
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                    />
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Supplier Name" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Supplier Name"
                                                        name="supplier_name"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.filterData
                                                                .supplier_name
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    supplier_name:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                    // InputProps={{
                                                    //     endAdornment: (
                                                    //         <InputAdornment position="end">
                                                    //             <SearchIcon></SearchIcon>
                                                    //         </InputAdornment>
                                                    //     ),
                                                    // }}
                                                    // validators={[
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                    />
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Supplier ID" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Supplier ID"
                                                        name="supplier_id"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.filterData
                                                                .supplier_id
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    supplier_id:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                    // InputProps={{
                                                    //     endAdornment: (
                                                    //         <InputAdornment position="end">
                                                    //             <SearchIcon></SearchIcon>
                                                    //         </InputAdornment>
                                                    //     ),
                                                    // }}
                                                    // validators={[
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                    />
                                                </Grid>
                                                <Grid className='w-full' item lg={4} md={4} sm={6} xs={12}>
                                                    <Grid container spacing={2}>
                                                        <Grid
                                                            className=" w-full"
                                                            item
                                                            lg={8}
                                                            md={8}
                                                            sm={8}
                                                            xs={8}
                                                        >
                                                            <SubTitle title="Keyword" />

                                                            <TextValidator
                                                                className=" w-full"
                                                                placeholder="Company/Name/Tel-No/Email"
                                                                name="keyword"
                                                                InputLabelProps={{
                                                                    shrink: false,
                                                                }}
                                                                value={
                                                                    this.state.filterData
                                                                        .description
                                                                }
                                                                type="text"
                                                                variant="outlined"
                                                                size="small"
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            description:
                                                                                e.target
                                                                                    .value,
                                                                        },
                                                                    })
                                                                }}
                                                            // validators={[
                                                            //     'required',
                                                            // ]}
                                                            // errorMessages={[
                                                            //     'this field is required',
                                                            // ]}
                                                            />
                                                        </Grid>

                                                        {/* Submit and Cancel Button */}
                                                        <Grid
                                                            style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                            item
                                                            lg={4}
                                                            md={4}
                                                            sm={4}
                                                            xs={4}
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
                                                                        startIcon="search"
                                                                    //onClick={this.handleChange}
                                                                    >
                                                                        <span className="capitalize">
                                                                            Search
                                                                        </span>
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>

                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <br />
                                {/* Table Section */}
                                <Grid container className="mt-5 pb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                rowsPerPage: this.state.formData.limit,
                                                page: this.state.formData.page,
                                                serverSide: true,
                                                print: false,
                                                viewColumns: false,
                                                download: false,
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

export default withStyles(styleSheet)(AllSupplierDetails)
