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
    Tab, Tabs, Box,
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

import AssignMembers from './AssignMembers'
import BasicInfo from './BasicInfo'
import Members from './Members'

const styleSheet = (theme) => ({})

class PreviousMembers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            value: 0,
            data: [
                {
                    name: 'L. K. Perera',
                    position: "Chairman",
                    from: dateParse(new Date()),
                    to: dateParse(new Date()),
                },
                {
                    name: "T. K. Shan",
                    position: "Member",
                    from: dateParse(new Date()),
                    to: dateParse(new Date()),
                },
            ],
            columns: [
                {
                    name: 'name', // field name in the row object
                    label: 'Member Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'position',
                    label: 'Position',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'from',
                    label: 'From',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'to',
                    label: 'To',
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
                status: null,

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

    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    }

    componentDidMount() {
        this.loadData()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <ValidatorForm onSubmit={null} onError={null}>
                    <Grid container spacing={2} direction="row">
                        {/* Filter Section */}
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            {/* Item Series Definition */}
                            <Grid
                                container
                                spacing={2}
                                className="space-between "
                            >
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <SubTitle title="Date From" />
                                    <DatePicker
                                        className="w-full"
                                        placeholder="From"
                                    />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <SubTitle title="Date To" />
                                    <DatePicker
                                        className="w-full"
                                        placeholder="To"
                                    />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <SubTitle title="Status" />
                                    <Autocomplete
                                        className="w-half"
                                        value={
                                            this.state.formData
                                                .status
                                        }
                                        options={appConst.statusAllAgendas}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let formData =
                                                    this.state.formData
                                                formData.status =
                                                    value
                                                this.setState({ formData })
                                            } else {
                                                let formData =
                                                    this.state.formData
                                                formData.status = {
                                                    label: '',
                                                }
                                                this.setState({ formData })
                                            }
                                        }}
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="All"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={
                                                    this.state.formData
                                                        .status
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <label>Search</label>
                                    <TextValidator
                                        className=" w-full"
                                        name="to"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        placeholder="Ref No/Order List"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className="flex justify-end"
                                >
                                    {/* /* Submit Button */}
                                    <Button
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={
                                            true
                                        }
                                        startIcon="save"
                                        onClick={null}
                                    >
                                        <span className="capitalize">
                                            Search
                                        </span>
                                    </Button>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <LoonsTable
                                        id={'completed'}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                    ></LoonsTable>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
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
                </ValidatorForm>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(PreviousMembers)
