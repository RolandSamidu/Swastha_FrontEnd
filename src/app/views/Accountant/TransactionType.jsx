import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
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
    LoonsSwitch,
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
import FinanceServices from 'app/services/FinanceDocumentServices'

const styleSheet = (theme) => ({})

class TransactionType extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            statusChangeRow: null,
            conformingDialog: false,
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
                    name: 'debit_or_credit',
                    label: 'Debit/Credit',
                    options: {
                        // filter: true,
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
                                <Grid className="flex items-center">
                                    <Tooltip title="Edit">
                                        <IconButton
                                            className="text-black mr-2"
                                            onClick={null}
                                        >
                                            <Icon>mode_edit_outline</Icon>
                                        </IconButton>
                                    </Tooltip>
                                    <Grid className="px-2">
                                        <Tooltip title="Change Status">
                                            <LoonsSwitch
                                                checked={
                                                    this.state.data[tableMeta.rowIndex].status == 'Active' ? true : false
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
                type: null,
                debit_or_credit: null
            },

            filterData: {
                page: 0,
                limit: 10
            }
        }
    }

    async loadData() {
        this.setState({ loading: false })
        let formData = this.state.filterData

        //function for load initial data from backend or other resources
        let res = await FinanceServices.getFinacneTransactionTypes(formData)
        if (res.status == 200) {
            console.log('Transaction Types', res.data.view.data)
            this.setState(
                { data: res.data.view.data, totalItems: res.data.view.totalItems }
            )
        }
        this.setState({ loading: true })
    }

    clearField = () => {
        let formData = this.state.formData;
        formData.debit_or_credit = null;
        formData.type = null;

        this.setState({
            formData,
            key: Date.now(),
        })
    }

    async saveStepOneSubmit() { }

    async SubmitAll() {
        let formData = this.state.formData

        let res = await FinanceServices.createFinacneTransactionTypes(formData)
        if (res.status == 201) {
            this.setState({
                alert: true,
                message: 'Transaction Type was added Successfully',
                severity: 'success',
            }, () => {
                this.clearField()
                this.loadData()
            })
        } else {
            this.setState({
                alert: true,
                message: 'Failed to add Transaction Type',
                severity: 'error',
            })
        }
    }

    // Change Transaction status
    async changeStatus(row) {
        let data = this.state.data[row]
        let statusChange = { "status": data.status == "Deactive" ? "Active" : "Deactive" }

        let res = await FinanceServices.changeFinacneTransactionStatus(
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
                        <CardTitle title="Transaction Type" />

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
                                            <SubTitle title="Add, Delete, Edit Transaction Type" />
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
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Type" />
                                                    <TextValidator
                                                        key={this.state.key}
                                                        className=" w-full"
                                                        placeholder="Transaction Type"
                                                        name="type"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData.type
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

                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Debit/Credit" />
                                                    <Autocomplete
                                        disableClearable
                                                        key={this.state.key}
                                                        className="w-full"
                                                        options={appConst.transactionTypes}
                                                        clearOnBlur={true}
                                                        clearText="clear"
                                                        onChange={(e, value) => {
                                                            let formData = this.state.formData
                                                            console.log(value)
                                                            if (value != null) {
                                                                formData.debit_or_credit = value.label
                                                            } else {
                                                                formData.debit_or_credit = null
                                                            }
                                                            this.setState({ formData })
                                                        }}
                                                        // value={{
                                                        //     name: this.state.filterData.vehicle_type ? (this.state.alltypes.find((obj) => obj.id == this.state.filterData.vehicle_type).name) : null,
                                                        //     id: this.state.filterData.vehicle_type
                                                        // }}
                                                        getOptionLabel={(option) =>
                                                            option.label ? option.label : ''
                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Please choose"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={
                                                                    this.state.formData.debit_or_credit
                                                                }
                                                                validators={[
                                                                    'required',
                                                                ]}
                                                                errorMessages={[
                                                                    'this field is required',
                                                                ]}
                                                            />
                                                        )}
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
                                                                    this.clearField
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
                <Dialog
                    open={this.state.conformingDialog}
                    onClose={() => { this.setState({ conformingDialog: false }) }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Conformation"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you Sure to change status of this Transaction Type?
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

export default withStyles(styleSheet)(TransactionType)
