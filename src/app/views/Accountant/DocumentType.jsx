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
    CircularProgress,
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
import DivisionsServices from 'app/services/DivisionsServices'
import FinanceServices from 'app/services/FinanceDocumentServices'
import { SimpleCard } from 'app/components'

const styleSheet = (theme) => ({})

class DocumentType extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            columns: [
                {
                    name: 'type', // field name in the row object
                    label: 'Type', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        // filter: true,
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
                                        onClick={null}
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

            loading: false,
            formData: {
                type: null
            },
            filterData: {
                page: 0,
                limit: 10
            },
            totalItems: 0
        }
    }

    async loadData() {
        this.setState({ loading: false })
        let formData = this.state.filterData
        //function for load initial data from backend or other resources
        let res = await FinanceServices.getFinacneDocumentTypes(formData)
        if (res.status == 200) {
            console.log('Document Types', res.data.view.data)
            this.setState(
                { data: res.data.view.data, totalItems: res.data.view.totalItems }
            )
        }
        this.setState({ loading: true })

    }

    clearField = () => {
        let formData = this.state.formData;
        formData.type = null;

        this.setState({
            formData,
            key: Date.now(),
        })
    }

    async saveStepOneSubmit() { }

    async SubmitAll() {
        let formData = this.state.formData

        let res = await FinanceServices.createFinacneDocumentTypes(formData)
        if (res.status == 201) {
            this.setState({
                alert: true,
                message: 'Document Type was added Successfully',
                severity: 'success',
            }, () => {
                this.clearField()
                this.loadData()
            })
        } else {
            this.setState({
                alert: true,
                message: 'Failed to add Document Type',
                severity: 'error',
            })
        }
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.filterData
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
                        <CardTitle title="Document Type" />

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
                                            <SubTitle title="Add, Delete, Edit Document Type" />
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
                                                    <SubTitle title="Type" />

                                                    <TextValidator
                                                        key={this.state.key}
                                                        className=" w-full"
                                                        placeholder="Document Type"
                                                        name="type"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .type
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            let formData = this.state.formData
                                                            formData.type = e.target.value

                                                            this.setState({ formData })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    />
                                                </Grid>

                                                {/* Submit and Cancel Button */}
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
                                                                    Save
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
                                                                    Reset
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
                                        {
                                            this.state.loading
                                                ?
                                                <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    id={'allAptitute'}
                                                    data={this.state.data}
                                                    columns={this.state.columns}
                                                    options={{
                                                        pagination: true,
                                                        serverSide: true,
                                                        count: this.state.totalItems,
                                                        print: true,
                                                        viewColumns: true,
                                                        download: true,
                                                        rowsPerPage: this.state.filterData.limit,
                                                        rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                        page: this.state.filterData.page,
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
                                                                case 'changeRowsPerPage':
                                                                    let formaData = this.state.filterData;
                                                                    formaData.limit = tableState.rowsPerPage;
                                                                    this.setState({ formaData })
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
                                                ></LoonsTable> : (
                                                    //loading effect
                                                    <Grid className="justify-center text-center w-full pt-12">
                                                        <CircularProgress size={30} />
                                                    </Grid>
                                                )
                                        }
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

export default withStyles(styleSheet)(DocumentType)
