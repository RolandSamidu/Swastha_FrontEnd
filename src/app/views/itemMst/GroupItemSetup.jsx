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
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'

const styleSheet = (theme) => ({})

class GroupItemSetup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [
                {
                    seriesNumber: '1',
                    groupName: 'Group 1',
                    category: 'Category 1',
                    shortReference: 'SH1',
                },
                {
                    seriesNumber: '2',
                    groupName: 'Group 2',
                    category: 'Category 2',
                    shortReference: 'SH2',
                },
                {
                    seriesNumber: '3',
                    groupName: 'Group 3',
                    category: 'Category 3',
                    shortReference: 'SH3',
                },
            ],
            columns: [
                {
                    name: 'seriesNumber', // field name in the row object
                    label: 'Series Number', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'groupName',
                    label: 'Group Name',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'category',
                    label: 'Category Name',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'shortReference',
                    label: 'Short Reference',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'action',
                    label: 'Actions',
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
                groupSeries: null,
                category: null,
                groupNumber: null,
                groupName: null,
                shortRef: null,
                description: null,
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

    async saveStepOneSubmit() {}

    async SubmitAll() {
        let formData = this.state.formData
  
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
                        <CardTitle title="Group Item Setup" />

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
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <SubTitle title="Item Series Definition" />
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
                                                {/* Group Series */}
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={12}
                                                    md={6}
                                                    lg={6}
                                                >
                                                    <SubTitle title="Group Series" />
                                                    <Autocomplete
                                        disableClearable
                                                        className="w-full"
                                                        options={
                                                            this.state
                                                                .all_district
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            if (value != null) {
                                                                let formData =
                                                                    this.state
                                                                        .formData
                                                                formData.district_id =
                                                                    value.id
                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }
                                                        }}
                                                        /*  defaultValue={this.state.all_district.find(
                                                         (v) => v.id == this.state.formData.district_id
                                                     )} */
                                                        value={this.state.all_district.find(
                                                            (v) =>
                                                                v.id ==
                                                                this.state
                                                                    .formData
                                                                    .district_id
                                                        )}
                                                        getOptionLabel={(
                                                            option
                                                        ) =>
                                                            option.name
                                                                ? option.name
                                                                : ''
                                                        }
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Group Series"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                {/* Category */}
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={12}
                                                    md={6}
                                                    lg={6}
                                                >
                                                    <SubTitle title="Category" />
                                                    <Autocomplete
                                        disableClearable
                                                        className="w-full"
                                                        options={
                                                            this.state
                                                                .all_district
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            if (value != null) {
                                                                let formData =
                                                                    this.state
                                                                        .formData
                                                                formData.district_id =
                                                                    value.id
                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }
                                                        }}
                                                        /*  defaultValue={this.state.all_district.find(
                                                         (v) => v.id == this.state.formData.district_id
                                                     )} */
                                                        value={this.state.all_district.find(
                                                            (v) =>
                                                                v.id ==
                                                                this.state
                                                                    .formData
                                                                    .district_id
                                                        )}
                                                        getOptionLabel={(
                                                            option
                                                        ) =>
                                                            option.name
                                                                ? option.name
                                                                : ''
                                                        }
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Category"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                {/* Group Number*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Group Number" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Group Number"
                                                        name="phn"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .groupName
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
                                                                    groupNumber:
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

                                                {/* Group Name*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Group Name" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Group Name"
                                                        name="phn"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .groupName
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
                                                                    groupName:
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

                                                {/* Short Reference*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Short Reference" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Short Reference"
                                                        name="phn"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .shortRef
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
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Description" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Description"
                                                        name="phn"
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
                                                                scrollToTop={
                                                                    true
                                                                }
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
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                color="#cfd8dc"
                                                                onClick={
                                                                    this
                                                                        .clearField
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
                                </Grid>

                                {/* Table Section */}
                                <Grid container className="mt-3 pb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: false,
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

export default withStyles(styleSheet)(GroupItemSetup)
