import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Stepper,
    Step,
    Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    CircularProgress,
    Divider,
    Badge,
    IconButton,
    Icon,
    Checkbox
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import FinanceServices from 'app/services/FinanceDocumentServices'

import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';


import {
    DatePicker,
    Button,
    LoonsSwitch,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import * as appConst from '../../../appconst'
import { SimpleCard } from 'app/components'

const styleSheet = (theme) => ({})
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

class DocumentSetup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            document_types: [],
            transaction_types: [],
            statusChangeRow: null,
            conformingDialog: false,
            columns: [
                {
                    name: 'document_type', // field name in the row object
                    label: 'Document Type', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (this.state.data[tableMeta.rowIndex]?.DocumentType.type)
                        }
                    },
                },
                {
                    name: 'transaction_type',
                    label: 'Transaction Type',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (this.state.data[tableMeta.rowIndex]?.TransactionType.type)
                        }
                    },
                },
                {
                    name: 'is_percentage',
                    label: 'Percentage',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (this.state.data[tableMeta.rowIndex].is_percentage.toString())
                        }
                    },
                },
                {
                    name: 'value',
                    label: 'Value',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'version',
                    label: 'Version',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'is_active',
                    label: 'Active',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (this.state.data[tableMeta.rowIndex].is_active.toString())
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
                                <Grid className="flex items-center">
                                    <IconButton
                                        className="text-black mr-2"
                                        onClick={null}
                                    >
                                        <Icon>mode_edit_outline</Icon>
                                    </IconButton>
                                    <Grid className="px-2">
                                        <Tooltip title="Change Status">
                                            <LoonsSwitch
                                                checked={
                                                    this.state.data[
                                                        tableMeta.rowIndex
                                                    ].status == 'Active'
                                                        ? true
                                                        : false
                                                }

                                                color="primary"
                                                onChange={() => {
                                                    this.toChangeStatus(
                                                        tableMeta.rowIndex
                                                    )
                                                }}
                                            />
                                        </Tooltip>
                                    </Grid>
                                </Grid>
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
                document_type_id: null,
                transaction_type_id: null,
                is_percentage: false,
                value: null,
                currency: "LKR",
            },

            filterData: {
                page: 0,
                limit: 10,
            },
            totalItems: 0
        }
    }

    async loadData() {
        //function for load initial data from backend or other resources
        this.setState({ loading: false })
        let formData = this.state.filterData

        let doc_types = await FinanceServices.getFinacneDocumentTypes({ limit: 99999 })
        if (doc_types.status == 200) {
            console.log('Document Types', doc_types.data.view.data)
            this.setState({ document_types: doc_types.data.view.data })
        }

        let trans_types = await FinanceServices.getFinacneTransactionTypes({ limit: 99999 })
        if (trans_types.status == 200) {
            console.log('Transaction Types', trans_types.data.view.data)
            this.setState({ transaction_types: trans_types.data.view.data })
        }

        //function for load initial data from backend or other resources
        let res = await FinanceServices.getFinacneDocumentSetups(formData)
        if (res.status == 200) {
            console.log('Document Setups', res.data.view.data)
            this.setState(
                { data: res.data.view.data, totalItems: res.data.view.totalItems }
            )
        }
        this.setState({ loading: true })
    }

    clearField = async () => {
        let formData = this.state.formData;
        formData.is_percentage = false;
        formData.value = null;
        formData.currency = "LKR";

        if (formData.document_type_id !== null && formData.transaction_type_id !== null) {
            formData.document_type_id = null;
            formData.transaction_type_id = null;

            this.setState({
                formData,
                key: Date.now(),
            })

            this.setState({ loading: false })

            let res = await FinanceServices.getFinacneDocumentSetups({ ...this.state.formData, document_type_id: this.state.formData?.document_type_id, transaction_type_id: this.state.formData?.transaction_type_id })
            if (res.status == 200) {
                console.log('Document Setups', res.data.view.data)
                this.setState(
                    { data: res.data.view.data, totalItems: res.data.view.totalItems }
                )
            }

            this.setState({ loading: true })
        } else {
            this.setState({
                // loading: false,
                alert: true,
                message: 'Filters have been cleared already',
                severity: 'info',
            })
        }

    }

    handleFilter = async () => {
        let formData = this.state.formData;
        if (formData.document_type_id !== null || formData.transaction_type_id !== null) {
            this.setState({ loading: false })

            let res = await FinanceServices.getFinacneDocumentSetups({ ...this.state.formData, document_type_id: this.state.formData?.document_type_id, transaction_type_id: this.state.formData?.transaction_type_id })
            if (res.status == 200) {
                console.log('Document Setups', res.data.view.data)
                this.setState(
                    { data: res.data.view.data, totalItems: res.data.view.totalItems }
                )
            }
            this.setState({ loading: true })
        } else {
            this.setState({
                // loading: false,
                alert: true,
                message: 'Filter by Document ID or Transaction ID to quickly find the information you need',
                severity: 'info',
            })
        }
    }

    async saveStepOneSubmit() { }

    async SubmitAll() {
        let formData = this.state.formData
        console.log("Data: ", formData)

        let res = await FinanceServices.createFinacneDocumentSetups(formData)
        if (res.status == 201) {
            this.setState({
                // loading: false,
                alert: true,
                message: 'Document Setup was Added Successfully',
                severity: 'success',
            }, () => {
                this.clearField()
                this.loadData()
            })
        } else {
            this.setState({
                alert: true,
                message: 'Failed to add Document Setup',
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

    // Change Document Type status
    async changeStatus(row) {
        let data = this.state.data[row]
        let statusChange = { "status": data.status == "Deactive" ? "Active" : "Deactive" }

        let res = await FinanceServices.changeFinacneDocumentSetupStatus(
            data.id,
            statusChange
        )
        if (res.status == 200) {
            this.setState(
                {
                    alert: true,
                    severity: 'success',
                    message: 'Successfully changed the status',
                },
                () => {
                    this.loadData()
                }
            )
        } else {
            this.setState(
                {
                    alert: true,
                    severity: 'error',
                    message: 'Cannot change the status',
                },
                () => {
                    console.log('ERROR UpDate')
                }
            )
        }
    }

    async toChangeStatus(row) {
        this.setState({
            statusChangeRow: row,
            conformingDialog: true
        })
    }

    async agreeToChangeStatus() {
        this.changeStatus(this.state.statusChangeRow)
        this.setState({ conformingDialog: false })
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
                        <CardTitle title="Document Setup" />
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
                                            <SubTitle title="Add, Delete, Edit Document Setup" />
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
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Document Type" />
                                                    <Autocomplete
                                        disableClearable className="w-full"
                                                        key={this.state.key}
                                                        options={this.state.document_types}
                                                        onChange={(e, value) => {
                                                            let formData = this.state.formData
                                                            if (value != null) {
                                                                formData.document_type_id = value.id
                                                            } else {
                                                                formData.document_type_id = null
                                                            }
                                                            this.setState({ formData })
                                                        }}
                                                        value={this
                                                            .state
                                                            .document_types
                                                            .find((v) => v.id == this.state.formData.document_type_id)} getOptionLabel={(
                                                                option) => option.type
                                                                    ? option.type
                                                                    : ''} renderInput={(params) => (
                                                                        <TextValidator {...params} placeholder="Document Type"
                                                                            //variant="outlined"
                                                                            fullWidth="fullWidth" variant="outlined" size="small"
                                                                            value={
                                                                                this.state.formData.document_type_id
                                                                            }
                                                                            validators={[
                                                                                'required',
                                                                            ]}
                                                                            errorMessages={[
                                                                                'this field is required',
                                                                            ]}
                                                                        />
                                                                    )} />
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Transaction Type" />
                                                    <Autocomplete
                                        disableClearable className="w-full"
                                                        key={this.state.key}
                                                        options={this.state.transaction_types}
                                                        onChange={(e, value) => {
                                                            let formData = this.state.formData
                                                            if (value != null) {
                                                                formData.transaction_type_id = value.id
                                                            } else {
                                                                formData.transaction_type_id = null
                                                            }
                                                            this.setState({ formData })
                                                        }}
                                                        value={this
                                                            .state
                                                            .transaction_types
                                                            .find((v) => v.id == this.state.formData.transaction_type_id)} getOptionLabel={(
                                                                option) => option.type
                                                                    ? option.type
                                                                    : ''} renderInput={(params) => (
                                                                        <TextValidator {...params} placeholder="Transaction Type"
                                                                            //variant="outlined"
                                                                            fullWidth="fullWidth" variant="outlined" size="small"
                                                                            value={
                                                                                this.state.formData.transaction_type_id
                                                                            }
                                                                            validators={[
                                                                                'required',
                                                                            ]}
                                                                            errorMessages={[
                                                                                'this field is required',
                                                                            ]}
                                                                        />
                                                                    )} />
                                                </Grid>
                                                <div style={{ display: 'flex', alignItems: "baseline", marginLeft: "10px" }}>
                                                    <Grid
                                                        className="w-full"
                                                        item
                                                    >
                                                        <SubTitle title="Percentage" />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                    >
                                                        <Checkbox
                                                            {...label}
                                                            icon={<RadioButtonUncheckedIcon />}
                                                            checkedIcon={<RadioButtonCheckedIcon />}
                                                            checked={this.state.formData.is_percentage}
                                                            onChange={(event) => {
                                                                let formData = this.state.formData
                                                                formData.is_percentage = event.target.checked
                                                                this.setState({ formData })
                                                            }}
                                                        />
                                                    </Grid>
                                                </div>
                                                <div style={{ display: "flex", flex: 1 }}></div>
                                                <Grid container>
                                                    <div style={{ display: "flex", marginLeft: "10px" }}>
                                                        <Grid
                                                            className=" w-full"
                                                            item
                                                        >
                                                            <SubTitle title="Value" />
                                                            <TextValidator
                                                                key={this.state.key}
                                                                className=" w-full"
                                                                placeholder="Value"
                                                                name="value"
                                                                InputLabelProps={{
                                                                    shrink: false,
                                                                }}
                                                                value={
                                                                    this.state.formData.value || null
                                                                }
                                                                type="number"
                                                                variant="outlined"
                                                                size="small"
                                                                onChange={(e) => {
                                                                    let formData = this.state.formData
                                                                    formData.value = e.target.value
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
                                                        <div className='w-full d-flex justify-end' style={{ display: "flex", alignSelf: "flex-end", height: "fit-content" }}>
                                                            <Grid
                                                                item
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
                                                        </div>
                                                    </div>
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
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                startIcon="sort"
                                                                onClick={this.handleFilter}
                                                            >
                                                                <span className="capitalize">
                                                                    Filter
                                                                </span>
                                                            </Button>
                                                            {/* Cancel Button */}
                                                            <Button
                                                                className="mt-2"
                                                                progress={false}
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                color="#d8e4bc"
                                                                startIcon="cached"
                                                                style={{ backgroundColor: '#2e8b57' }}
                                                                onClick={this.clearField}
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
                                                        print: true,
                                                        viewColumns: true,
                                                        download: true,
                                                        count: this.state.totalItems,
                                                        rowsPerPage: this.state.filterData.limit,
                                                        page: this.state.filterData.page,
                                                        rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
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
                                                                    break;
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
                <Dialog
                    open={this.state.conformingDialog}
                    onClose={() => { this.setState({ conformingDialog: false }) }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Conformation"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you Sure to change status of this Document Setup?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="text" onClick={() => { this.setState({ conformingDialog: false }) }} color="primary">
                            Disagree
                        </Button>
                        <Button variant="text" onClick={() => { this.agreeToChangeStatus() }} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(DocumentSetup)
