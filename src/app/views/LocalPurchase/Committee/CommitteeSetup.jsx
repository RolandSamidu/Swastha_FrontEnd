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
import Committee from './committee'

const styleSheet = (theme) => ({})

class CommitteeSetup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [
                {
                    name: "Pharma Minor",
                    type: "Procurement",
                    validity: "12",
                    authority: "DPC-Minor",
                },
                {
                    name: "Bid Opening",
                    type: "Bid Opening",
                    validity: "12",
                    authority: "DPC-Major",
                },
            ],
            columns: [
                {
                    name: 'name', // field name in the row object
                    label: 'Committee Name', // column title that will be shown in table
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
                    name: 'validity',
                    label: 'Validity Period (Months)',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'authority',
                    label: 'Authority Level',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'attachments',
                    label: 'Authority Level',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <IconButton
                                    className="text-black"
                                    onClick={null}
                                >
                                    <FileCopyIcon />
                                </IconButton>
                            )
                        }
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
                                    className="text-black"
                                    onClick={() => window.location = '/localpurchase/committee/123'}
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
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <CardTitle title="Committee Setup" />
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
                                        {/* Item Series heading */}
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={8}
                                            xs={12}
                                        >
                                            <SubTitle title="Committee Type" />
                                            <Autocomplete
                                                className="w-full"
                                                options={this.state.committee}
                                                onChange={(e, value) => {
                                                    if (null != value) {
                                                        let formData =
                                                            this.state.formData
                                                        formData.committee =
                                                            value
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }
                                                }}
                                                // value={this.state.committee.find((committee) => committee.label == this.state.formData.committee)}
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
                                                            this.state.formData
                                                                .committee
                                                        }
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item lg={2} md={2} sm={2} xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                    <Typography className=" text-gray font-semibold text-13" style={{ lineHeight: '1', }}>Category :</Typography>
                                                </Grid>
                                                <Grid item lg={10} md={10} sm={10} xs={10}>
                                                    <FormControl component="fieldset">
                                                        <RadioGroup
                                                            name="category"
                                                            value={this.state.formData.category}
                                                            onChange={(e) => {
                                                                let formData = this.state.formData
                                                                formData.category = e.target.value
                                                                this.setState({ formData })
                                                            }}
                                                            style={{ display: "block" }}
                                                        >
                                                            <FormControlLabel
                                                                value="pharmaceutical"
                                                                control={<Radio />}
                                                                label="Pharmaceutical"
                                                            />
                                                            <FormControlLabel
                                                                value="surgical"
                                                                control={<Radio />}
                                                                label="Surgical"
                                                            />
                                                            <FormControlLabel
                                                                value="laboratory"
                                                                control={<Radio />}
                                                                label="Laboratory"
                                                            />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={8}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Authority" />
                                                    <Autocomplete
                                                        className="w-full"
                                                        options={this.state.authority}
                                                        onChange={(e, value) => {
                                                            if (null != value) {
                                                                let formData =
                                                                    this.state.formData
                                                                formData.authority =
                                                                    e.target.value
                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }
                                                        }}
                                                        // value={this.state.ward.find((ward) => ward.id == this.state.formData.ward_id)}
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
                                                                    this.state.formData
                                                                        .authority
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={8}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Committee" />
                                                    <Autocomplete
                                                        className="w-full"
                                                        options={this.state.ward}
                                                        onChange={(e, value) => {
                                                            if (null != value) {
                                                                let formData =
                                                                    this.state.formData
                                                                formData.committee =
                                                                    e.target.value
                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }
                                                        }}
                                                        value={this.state.ward.find((ward) => ward.id == this.state.formData.committee)}
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
                                                                    this.state.formData
                                                                        .committee
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={8}
                                                    md={8}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Purpose" />
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
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Attachments" />
                                            <br />
                                            <SwasthaFilePicker
                                                // uploadingSectionVisibility={this.state.loginUserRoles.includes('Hospital Admin')}
                                                id="file_public"
                                                singleFileEnable={true}
                                                multipleFileEnable={false}
                                                dragAndDropEnable={true}
                                                tableEnable={true}

                                                documentName={true}//document name enable
                                                documentNameValidation={['required']}
                                                documenterrorMessages={['this field is required']}
                                                documentNameDefaultValue={null}//document name default value. if not value set null

                                                type={false}
                                                types={null}
                                                typeValidation={null}
                                                typeErrorMessages={null}
                                                defaultType={null}// null

                                                description={true}
                                                descriptionValidation={null}
                                                descriptionErrorMessages={null}
                                                defaultDescription={null}//null

                                                onlyMeEnable={false}
                                                defaultOnlyMe={false}

                                                source="local_purchase"
                                                // source_id={this.state.loginUserHospital}



                                                //accept="image/png"
                                                // maxFileSize={1048576}
                                                // maxTotalFileSize={1048576}
                                                maxFilesCount={1}
                                                validators={[
                                                    'required',
                                                    // 'maxSize',
                                                    // 'maxTotalFileSize',
                                                    // 'maxFileCount',
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                    // 'file size too lage',
                                                    // 'Total file size is too lage',
                                                    // 'Too many files added',
                                                ]}
                                                /* selectedFileList={
                                                    this.state.data.fileList
                                                } */
                                                label="Select Attachment"
                                                singleFileButtonText="Upload Data"
                                            // multipleFileButtonText="Select Files"
                                            >
                                            </SwasthaFilePicker>
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={8}
                                            xs={12}
                                        >
                                            <SubTitle title="Covering Approval From" />
                                            <Autocomplete
                                                className="w-full"
                                                options={this.state.ward}
                                                onChange={(e, value) => {
                                                    if (null != value) {
                                                        let formData =
                                                            this.state.formData
                                                        formData.from =
                                                            e.target.value
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }
                                                }}
                                                value={this.state.ward.find((ward) => ward.id == this.state.formData.from)}
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
                                                            this.state.formData
                                                                .from
                                                        }
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <SubTitle title="Composition" />
                                            <br />
                                            <Committee />
                                        </Grid>
                                        {/* Submit and Cancel Button */}
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
                                                scrollToTop={
                                                    true
                                                }
                                                startIcon="save"
                                            //onClick={this.handleChange}
                                            >
                                                <span className="capitalize">
                                                    Save
                                                </span>
                                            </Button>
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <LoonsTable
                                                id={"committeeDetails"}
                                                data={this.state.data}
                                                columns={this.state.columns}
                                                options={{
                                                    pagination: true,
                                                    serverSide: true,
                                                    count: this.state.data.length,
                                                    rowsPerPage: 10,
                                                    page: 0,

                                                    onTableChange: (action, tableState) => {
                                                        switch (action) {
                                                            case 'changePage':
                                                                // this.setPage(tableState.page)
                                                                break
                                                            case 'sort':
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

export default withStyles(styleSheet)(CommitteeSetup)
