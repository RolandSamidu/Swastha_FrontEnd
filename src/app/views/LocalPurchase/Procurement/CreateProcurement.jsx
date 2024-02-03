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
    Typography
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
import * as appConst from '../../../../appconst'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import SearchIcon from '@mui/icons-material/Search';
import { dateParse } from 'utils'

const styleSheet = (theme) => ({})

const renderSubsequentDetailCard = (label, value) => {
    return (
        <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={6} xs={6}>
                <SubTitle title={label} />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
                <Typography variant='body1' style={{ marginTop: '3px', textJustify: "justify" }}>{value}</Typography>
            </Grid>
        </Grid>

    )
}

const renderDetailCard = (label, value, style = {}) => {
    return (
        <Grid container spacing={2} style={style}>
            <Grid
                className=" w-full"
                item
                lg={8}
                md={8}
                sm={12}
                xs={12}
            >
                {renderSubsequentDetailCard(label, value)}
            </Grid>
        </Grid>
    )
}

class CreateProcurement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [
                {
                    sr_no: "S1001",
                    item_name: "Panadol",
                    required_date: dateParse(new Date()),
                    requested_quantity: "100",
                    estimated_value: "120"
                },
                {
                    sr_no: "S1002",
                    item_name: "Panadol",
                    required_date: dateParse(new Date()),
                    requested_quantity: "100",
                    estimated_value: "150"
                },
                {
                    sr_no: "S1003",
                    item_name: "Panadol",
                    required_date: dateParse(new Date()),
                    requested_quantity: "100",
                    estimated_value: "180"
                },
                {
                    sr_no: "S1004",
                    item_name: "Panadol",
                    required_date: dateParse(new Date()),
                    requested_quantity: "100",
                    estimated_value: "200"
                }
            ],
            columns: [
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'required_date',
                    label: 'Required Date',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'requested_quantity',
                    label: 'Requested Quantity',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'estimated_value',
                    label: 'Estimated Value',
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
                sr_no: null,
                item_name: null,
                item: null,
                request_id: null,
                consultant_id: null,
                item_id: null,
                status: null,
                description: null,
            },

            consultant: [
                { id: 1, label: '2022/SP/X/R/P/00306', item: [{ id: 1, label: '1205578 - Benzoyl Peroxide Gel' }, { id: 2, label: '1205578 - Benzoyl Peroxide Gel' }, { id: 3, label: '1205578 - Benzoyl Peroxide Gel' }, { id: 4, label: '1205578 - Benzoyl Peroxide Gel' }] },
                { id: 2, label: '2022/SP/X/R/P/00307', item: [{ id: 1, label: '1205578 - Benzoyl Peroxide Gel' }, { id: 2, label: '1205578 - Benzoyl Peroxide Gel' }, { id: 3, label: '1205578 - Benzoyl Peroxide Gel' }, { id: 4, label: '1205578 - Benzoyl Peroxide Gel' }] },
                { id: 3, label: '2022/SP/X/R/P/00308', item: [{ id: 1, label: '1205578 - Benzoyl Peroxide Gel' }, { id: 2, label: '1205578 - Benzoyl Peroxide Gel' }, { id: 3, label: '1205578 - Benzoyl Peroxide Gel' }, { id: 4, label: '1205578 - Benzoyl Peroxide Gel' }] },
                { id: 4, label: '2022/SP/X/R/P/00309', item: [{ id: 1, label: '1205578 - Benzoyl Peroxide Gel' }, { id: 2, label: '1205578 - Benzoyl Peroxide Gel' }, { id: 3, label: '1205578 - Benzoyl Peroxide Gel' }, { id: 4, label: '1205578 - Benzoyl Peroxide Gel' }] },
            ],

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
                        <CardTitle title="Create Procurement" />
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
                                                    lg={8}
                                                    md={8}
                                                    sm={8}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Request ID" />
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Request ID"
                                                        name="request_id"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.filterData
                                                                .request_id
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
                                                                    request_id:
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
                                                {/* Submit and Cancel Button */}
                                                <Grid
                                                    style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={4}
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
                                    <br />
                                    <Grid container className='mt-5 mb-5'>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Request ID :" />
                                                    <Autocomplete
                                                        className="w-full"
                                                        options={this.state.consultant}
                                                        onChange={(e, value) => {
                                                            if (null != value) {
                                                                let filterData =
                                                                    this.state.filterData
                                                                filterData.consultant_id =
                                                                    value.id
                                                                filterData.item = value.item
                                                                filterData.item_id = null
                                                                this.setState({
                                                                    filterData,
                                                                })
                                                            } else {
                                                                let filterData = this.state.filterData;
                                                                filterData.consultant_id =
                                                                    null
                                                                filterData.item = null
                                                                filterData.item_id = null
                                                                this.setState({
                                                                    filterData,
                                                                })
                                                            }
                                                        }}
                                                        value={this.state.consultant.find((consultant) => consultant.id == this.state.filterData.consultant_id)
                                                        }
                                                        getOptionLabel={(option) =>
                                                            option.label
                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Please choose"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={
                                                                    this.state.filterData
                                                                        .consultant_id
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                {this.state.filterData.item ? (<Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Item Name :" />
                                                    <Autocomplete
                                                        className="w-full"
                                                        options={this.state.filterData.item}
                                                        onChange={(e, value) => {
                                                            if (null != value) {
                                                                let filterData = this.state.filterData;
                                                                filterData.item_id = value.id;
                                                                this.setState({
                                                                    filterData,
                                                                });
                                                            } else {
                                                                let filterData = this.state.filterData;
                                                                filterData.item_id = null;
                                                                this.setState({
                                                                    filterData,
                                                                });
                                                            }
                                                        }}
                                                        value={this.state.filterData.item.find((item) => item.id === this.state.filterData.item_id) || null}
                                                        getOptionLabel={(option) => option.label}
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Please choose"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={this.state.filterData.item_id}
                                                            />
                                                        )}
                                                    />
                                                </Grid>) : null
                                                }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                            className=" w-full flex justify-end"
                                        >
                                            <Button
                                                className="mt-2"
                                                progress={false}
                                                // type="submit"
                                                scrollToTop={
                                                    true
                                                }
                                                startIcon="save"
                                            //onClick={this.handleChange}
                                            >
                                                <span className="capitalize">
                                                    Create
                                                </span>
                                            </Button>
                                        </Grid>
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

export default withStyles(styleSheet)(CreateProcurement)
