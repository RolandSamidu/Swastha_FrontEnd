import React, { Component, Fragment } from "react";
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle
} from "app/components/LoonsLabComponents";
import { CircularProgress, Grid, Tooltip, IconButton, Icon } from "@material-ui/core";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";
import * as appConst from "../../../appconst";
import Paper from "@material-ui/core/Paper";
import Buttons from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ReceiptIcon from '@material-ui/icons/Receipt';
import ConsignmentService from "app/services/ConsignmentService";
import localStorageService from "app/services/localStorageService";
import { dateParse } from "utils";

class AllConsignment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            totalConsignment: 0,
            formData: {
                delivery_date: '',
                agent: '',
                status: '',
                time_period: '',
                order_no: '',
            },
            totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
                delivery_date: null,
                agent: null,
                status: null,
                time_period: null,
                order_no: null,
                // msa_id: '',
                // confirmed_only: true,
                'order[0]': ['updatedAt', 'DESC'],
            },
            data: [],
            columns: [
                {
                    name: 'order_no', // field name in the row object
                    label: 'Order No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },
                {
                    name: 'indent_no', // field name in the row object
                    label: 'Indent No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },
                {
                    name: 'invoice_no', // field name in the row object
                    label: 'Invoice No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },
                {
                    name: 'value_in_lkr', // field name in the row object
                    label: 'Value (LKR)', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].values_in_lkr;

                            return <p>{data ? parseFloat(data).toLocaleString("en-US") : "Not Available"}</p>
                        }
                    },
                },
                {
                    name: 'createdAt', // field name in the row object
                    label: 'Date Created', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].createdAt;

                            return <p>{data ? dateParse(data) : "Not Available"}</p>
                        }
                    },
                },
                {
                    name: 'delivery_date', // field name in the row object
                    label: 'Delivery Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].delivery_date;
                            return data ? dateParse(data) : "Not Available"
                        }
                    },
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id;
                            return (
                                <Grid className="flex items-center">
                                    {/*  <Tooltip title="Edit">
                                        <Buttons
                                         color="primary" style={{ fontWeight: 'bold', marginTop: -3 }}>
                                            View
                                        </Buttons>
                                    </Tooltip> */}
                                    {/* <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/consignments/msdMSA/bin-allocate/${id}`
                                                }}>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid> */}
                                    <Grid className="px-2">
                                        <Tooltip title="View consigment and GRN">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/localpurchase/view_consignment/${id}`
                                                }}>
                                                <Icon color='primary'>visibility</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            );
                        }
                    }
                }
            ],
            alert: false,
            message: "",
            severity: 'success',
        }
    }


    async loadData() {
        this.setState({ loaded: false })
        let owner_id = await localStorageService.getItem('owner_id')

        let filterData = this.state.filterData;
        filterData.owner_id = owner_id
        filterData.type = "LP"
        filterData.allstatus = true
        // filterData.msa_id = user.id;
        //filterData.msa_id = 'de1edb22-6a9b-4ae8-889f-69cafa9bb777'

        this.setState({ filterData })

        let res = await ConsignmentService.getAllConsignments(this.state.filterData)
        if (res.status == 200) {
            this.setState(
                {
                    loaded: true,
                    data: res.data.view.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                }
            )
        }
        this.setState({
            totalConsignment: this.state.data.length
        })
    }

    componentDidMount() {
        this.loadData();
    }

    handleFilterSubmit = (val) => {
        this.loadData()
    }

    onSubmit = () => {
        this.handleFilterSubmit({
            order_no: this.state.order_no,
            status: this.state.status,
            delivery_date: this.state.delivery_date,
            agent: this.state.agent,
            time_period: this.state.time_period,
        })
    }


    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Recieving Data" />

                        <Grid item lg={12} className=" w-full mt-2">
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.onSubmit()}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex">
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Time Period" />
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={appConst.admission_mode}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.time_period;
                                                    filterData.status = e.target.value;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.time_period}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Delivery effective date range" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.filterData.delivery_date}
                                            placeholder="Date From"
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={date => {

                                                let filterData = this.state.filterData;
                                                filterData.delivery_date = date;
                                                this.setState({ filterData })

                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Agent" />
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={appConst.admission_mode}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.agent = e.target.value;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.agent}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Status" />
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={appConst.order_status}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.status = e.target.value;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.status}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Order List" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Please Enter"
                                            name="order_list"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.filterData.order_no}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let filterData = this.state.filterData;
                                                filterData.order_no = e.target.value;
                                                this.setState({ filterData })

                                            }}
                                            // validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid
                                            className=" flex " item lg={2} md={2} sm={12} xs={12}
                                        >
                                            <Grid
                                                style={{ marginTop: 17, marginLeft: 4 }}
                                            >
                                                <Button
                                                    className="mt-2"
                                                    progress={false}
                                                    type="submit"
                                                    scrollToTop={true}
                                                    style={{ margin: 4 }}
                                                >
                                                    <span className="capitalize">Search</span>
                                                </Button>
                                            </Grid>

                                            <Grid
                                                style={{ marginTop: 17, marginLeft: 4 }}
                                            >
                                                <Button
                                                    className="mt-2"
                                                    variant="outlined"
                                                    style={{ margin: 4 }}
                                                >
                                                    <span className="capitalize">Reset</span>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>

                            <Grid className=" w-full" style={{ marginTop: 20, backgroundColor: 'red' }}>
                                <Paper elevation={0} square
                                    style={{ backgroundColor: '#E6F6FE', border: '1px solid #DEECF3', height: 40 }}>
                                    <Grid item lg={12} className=" w-full mt-2">
                                        <Grid container spacing={1} className="flex">
                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                                // spacing={2}
                                                style={{ marginLeft: 10 }}
                                            >
                                                <SubTitle title={`Total Consignment: ${this.state.totalConsignment}`} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>


                        {/*Table*/}
                        <Grid lg={12} className=" w-full mt-2" spacing={2} style={{ marginTop: 20 }}>

                            {
                                this.state.loaded ?
                                    <div className="pt-0">
                                        <LoonsTable
                                            id={"DEFAULT_USER"}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: this.state.filterData.limit,
                                                page: this.state.filterData.page,
                                                rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                onTableChange: (action, tableState) => {
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
                                                            break;
                                                        default:
                                                            console.log('action not handled.');
                                                    }
                                                }

                                            }
                                            }
                                        >
                                        </LoonsTable>
                                    </div>
                                    :
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                            }
                        </Grid>
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        );
    }
}

export default AllConsignment
