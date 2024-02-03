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
import { SimpleCard } from 'app/components'
import HospitalConfigServices from 'app/services/HospitalConfigServices'
import SupplyChainModel from './SupplyChainModel'

const styleSheet = (theme) => ({})

class Supplier extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            formData: {
                limit: 20,
                page: 0,
                item_id: this.props.match.params.item_id
            },
            open: false,
            columns: [
                {
                    name: 'name', // field name in the row object
                    label: 'Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'contact_no',
                    label: 'Contact Number',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'email',
                    label: 'Email',
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
        }
        this.showSuccess = this.showSuccess.bind(this)
        this.showError = this.showError.bind(this)
    }

    async loadData() {
        this.setState({ loading: false })
        //function for load initial data from backend or other resources
        let formData = this.state.formData
        let res = await HospitalConfigServices.getAllSuppliers(formData)
        if (res.status == 200) {
            console.log('Suppliers: ', res.data.view.data)
            this.setState(
                { data: res.data.view.data, totalItems: res.data.view.totalItems }
            )
        }
        this.setState({ loading: true })

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

    showSuccess() {
        this.setState({ alert: true, message: 'Supplier added Successful', severity: "success" });
        this.loadData();
    }

    showError() {
        this.setState({ alert: true, message: 'Supplier added Unsuccessful', severity: "error" });
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
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                            className=" w-full flex justify-between"
                                        >
                                            <CardTitle title="Supplier" />
                                            <Button
                                                className='mt-2'
                                                progress={false}
                                                scrollToTop={
                                                    true
                                                }
                                                startIcon="add"
                                                onClick={() => this.setState({ open: true })}
                                            >Add
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Divider className="mt-2" />
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* Main Grid */}
                        <Grid container spacing={2} direction="row">
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
                                                    rowsPerPage: this.state.formData.limit,
                                                    page: this.state.formData.page,
                                                    count: this.state.totalItems,
                                                    print: true,
                                                    viewColumns: true,
                                                    download: true,
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
                                                                this.setPage(
                                                                    tableState.page
                                                                )
                                                                break
                                                            case 'changeRowsPerPage':
                                                                let formaData = this.state.formData;
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
                    </LoonsCard>
                </MainContainer>
                <SupplyChainModel open={this.state.open} setOpen={(res) => this.setState({ open: res })} title={"Supplier"} showError={this.showError} showSuccess={this.showSuccess} />
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

export default withStyles(styleSheet)(Supplier)
