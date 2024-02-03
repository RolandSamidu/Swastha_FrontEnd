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
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    InputAdornment,
    IconButton,
    Icon,
    Typography,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import SearchIcon from '@mui/icons-material/Search';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    SwasthaFilePicker,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import { dateParse } from 'utils'

const styleSheet = (theme) => ({})

class BasicInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [
                {
                    position: "Chairman",
                    type: "Head",
                    no_of_positions: "1",
                    designation: "Chairman",
                },
                {
                    position: "Secretary",
                    type: "Authority",
                    no_of_positions: "1",
                    designation: "Procurement Officer",
                },
                {
                    position: "Member",
                    type: "Internal",
                    no_of_positions: "2",
                    designation: "Procurement Officer",
                },
            ],
            columns: [
                {
                    name: 'position', // field name in the row object
                    label: 'Position', // column title that will be shown in table
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
                    name: 'no_of_positions',
                    label: 'No of Positions',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'designation',
                    label: 'Designation',
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
            formData: {
                request_id: 458,
                institute: null,
                ward_id: null,
                committee: null,
                category: 'pharmaceutical',
                authority: null,
                purpose: null,
                from: null,
                committee: null,

                bht: null,
                patient_name: null,
                phn: null,
                item_name: null,
                sr_no: null,
                request_quantity: null,
                required_date: null,
                description: null,
                selected: 'yes'
            },

            committee: [
                { label: "Bid Opening Committee" },
                { label: "Should be Approved" },
                { label: "Procurement Committee" },
            ],

            authority: [
                { label: "All" },
                { label: "DPC-Minor" },
                { label: "Ministry" },
                { label: "Cabinet" },
            ],

            ward: [
                { id: 1, label: "W101" },
                { id: 2, label: "W102" },
                { id: 3, label: "W103" },
                { id: 4, label: "W104" },
                { id: 5, label: "W105" },
            ],

            bht: [
                { id: 1, label: "B101" },
                { id: 2, label: "B102" },
                { id: 3, label: "B103" },
                { id: 4, label: "B104" },
                { id: 5, label: "B105" },
            ]
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
                        <Grid container spacing={2} style={{ padding: "12px", backgroundColor: "#BBB", borderRadius: "12px", margin: "12px" }}>
                            {/* Item Series heading */}
                            <Grid
                                className=" w-full"
                                item
                                lg={8}
                                md={8}
                                sm={8}
                                xs={12}
                                style={{ marginTop: "12px" }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <Typography>Category : </Typography>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <Typography variant='body1'>Pharmaceutical</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid
                                className=" w-full"
                                item
                                lg={8}
                                md={8}
                                sm={8}
                                xs={12}
                            >
                                <Grid container spacing={2}>
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <Typography>Authority Level : </Typography>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <Typography variant='body1'>DPC - Minor</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid
                                className=" w-full"
                                item
                                lg={8}
                                md={8}
                                sm={8}
                                xs={12}
                            >
                                <Grid container spacing={2}>
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <Typography>Purpose : </Typography>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <TextValidator
                                            multiline
                                            rows={4}
                                            className=" w-full"
                                            placeholder="Description"
                                            name="purpose"
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            value={
                                                this.state.formData
                                                    .purpose
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
                                                        purpose:
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
                            </Grid>
                            <Grid
                                className=" w-full"
                                item
                                lg={8}
                                md={8}
                                sm={8}
                                xs={12}
                            >
                                <Grid container spacing={2}>
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <Typography>Attachments : </Typography>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <FileCopyIcon />
                                        <FileCopyIcon />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="Composition" />
                            <LoonsTable
                                id={"committeeDetails"}
                                data={this.state.data}
                                columns={this.state.columns}
                            // options={{
                            //     pagination: false,
                            //     serverSide: false,
                            //     count: this.state.data.length,
                            //     rowsPerPage: 10,
                            //     page: 0,

                            //     onTableChange: (action, tableState) => {
                            //         switch (action) {
                            //             case 'changePage':
                            //                 // this.setPage(tableState.page)
                            //                 break
                            //             case 'sort':
                            //                 break
                            //             default:
                            //                 console.log(
                            //                     'action not handled.'
                            //                 )
                            //         }
                            //     },
                            // }}
                            >

                            </LoonsTable>
                        </Grid>
                    </Grid>
                </Grid>
            </ValidatorForm>
        )
    }
}

export default withStyles(styleSheet)(BasicInfo)
