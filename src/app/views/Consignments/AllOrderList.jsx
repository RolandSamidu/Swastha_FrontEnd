import React, { Component, Fragment } from 'react'
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle,
} from '../../components/LoonsLabComponents'
import { Grid, Tooltip, IconButton } from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import * as appConst from '../../../appconst'
import Paper from '@material-ui/core/Paper'
import Buttons from '@material-ui/core/Button'
import VisibilityIcon from '@material-ui/icons/Visibility'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import ConsignmentService from '../../services/ConsignmentService'
import SchedulesServices from '../../services/SchedulesServices'
import { CircularProgress } from '@material-ui/core'
import moment from 'moment'
import { convertTocommaSeparated, dateParse, roundDecimal } from 'utils'
import localStorageService from 'app/services/localStorageService'

class AllOrderList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            totalOrder: 0,
            formData: {
                delivery_date: '',
                agent: '',
                status: '',
                time_period: '',
                order_no: '',
            },
            totalItems: 0,

            filterData: {
                limit: 10,
                page: 0,
                delivery_date: null,
                agent: '',
                status: '',
                time_period: '',
                order_no: '',
                confirmed_only: true,
                type:null,
                'order[0]': ['updatedAt', 'DESC'],
            },
            data: [],
            columns: [
                {
                    name: 'order_no', // field name in the row object
                    label: 'Order No', // column title that will be shown in table
                    options: {
                        display: true,
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>{this.state.data[tableMeta.rowIndex]?.OrderList.order_no ? this.state.data[tableMeta.rowIndex]?.OrderList.order_no : "Not Available"}</span>
                            )
                        },
                    },
                },
                {
                    name: 'type', // field name in the row object
                    label: 'Type', // column title that will be shown in table
                    options: {
                        display: true,
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>{this.state.data[tableMeta.rowIndex]?.OrderList.type ? this.state.data[tableMeta.rowIndex]?.OrderList.type : "Not Available"}</span>
                            )
                        },
                    },
                },
                {
                    name: 'approved_user_type', // field name in the row object
                    label: 'Approved User', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>{this.state.data[tableMeta.rowIndex]?.approval_user_type ? this.state.data[tableMeta.rowIndex]?.approval_user_type : "Not Available"}</span>
                            )
                        },
                    },
                },
                {
                    name: 'approval_type', // field name in the row object
                    label: 'Approval', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>{this.state.data[tableMeta.rowIndex].approval_type ? this.state.data[tableMeta.rowIndex]?.approval_type : "Not Available"}</span>
                            )
                        },
                    },
                },
                {
                    name: 'no_of_items', // field name in the row object
                    label: 'No of Items', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>{this.state.data[tableMeta.rowIndex]?.OrderList.no_of_items ? this.state.data[tableMeta.rowIndex]?.OrderList.no_of_items : "Not Available"}</span>
                            )
                        },
                    },
                },
                {
                    name: 'order_date', // field name in the row object
                    label: 'Order Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>{this.state.data[tableMeta.rowIndex]?.OrderList.order_date ? dateParse(this.state.data[tableMeta.rowIndex]?.OrderList.order_date) : "Not Available"}</span>
                            )
                        },
                    },
                },
                {
                    name: 'estimated_value', // field name in the row object
                    label: 'Estimated Value', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>Rs. {this.state.data[tableMeta.rowIndex]?.OrderList.estimated_value ? convertTocommaSeparated(this.state.data[tableMeta.rowIndex]?.OrderList.estimated_value, 2) : "Not Available"}</span>
                            )
                        },
                    },
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>{this.state.data[tableMeta.rowIndex]?.status ? this.state.data[tableMeta.rowIndex]?.status : "Not Available"}</span>
                            )
                        },
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: false,
                        display: true,
                        // sort: false,
                        // empty: true,
                        // print: false,
                        // download: false,
                        customBodyRenderLite: (dataIndex) => {
                            let order_list_id = this.state.data[dataIndex]?.order_list_id
                            let sequence = this.state.data[dataIndex]?.sequence ? this.state.data[dataIndex]?.sequence : 1
                            let id = this.state.data[dataIndex]?.id
                            // let status = this.state.data[dataIndex].status;
                            return (
                                <Grid className="flex items-center">
                                    {/*  <Tooltip title="Edit">
                                        <Buttons
                                         color="primary" style={{ fontWeight: 'bold', marginTop: -3 }}>
                                            View
                                        </Buttons>
                                    </Tooltip> */}
                                    {/* {(status != "Confirmed By AD" && status != "Active" && status != "Waiting For AD Approval") ?
                                        <Tooltip title=" Collect Samples">
                                            <IconButton
                                                onClick={() => {
                                                    // window.location.href = `/consignments/takeSample/${id}`
                                                }}>
                                                <PlaylistAddIcon color='primary' />
                                            </IconButton>

                                        </Tooltip>
                                        : null
                                    } */}
                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/order/order-list/${order_list_id}?approve=true&table_id=${id}&sequence=${sequence}`
                                                }}
                                            >
                                                <VisibilityIcon color="primary" />
                                            </IconButton>
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

        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let user_roles = await localStorageService.getItem('userInfo').roles
        let formData = { 
            //order_list_id: "a554553a-89bf-442e-986d-3d964993a78c",
             status: "Pending", 
             approval_user_type: user_roles[0], 
             page: this.state.filterData.page, 
             limit: this.state.filterData.limit, 
             type: this.state.filterData.type, 
             'order[0]': ['updatedAt', 'DESC'] }

        let res = await SchedulesServices.getOrderListApprovals(formData)
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
            totalOrder: this.state.data.length,
        })
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.filterData
        formData.page = page
        console.log(page)
        this.setState(
            {
                formData,
            },
            () => {
                this.loadData()
            }
        )
    }

    componentDidMount() {
        this.loadData()
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

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title=" View All Order" />
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
                                                    let filterData =
                                                        this.state.time_period
                                                    filterData.status =
                                                        e.target.value
                                                    this.setState({
                                                        filterData,
                                                    })
                                                }
                                            }}
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
                                                            .time_period
                                                    }
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
                                            value={
                                                this.state.filterData
                                                    .delivery_date
                                            }
                                            placeholder="Date From"
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={(date) => {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.delivery_date = date
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
                                                    let filterData =
                                                        this.state.filterData
                                                    filterData.status =
                                                        e.target.value
                                                    this.setState({
                                                        filterData,
                                                    })
                                                }
                                            }}
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
                                                            .agent
                                                    }
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
                                                    let filterData =
                                                        this.state.filterData
                                                    filterData.status =
                                                        e.target.value
                                                    this.setState({
                                                        filterData,
                                                    })
                                                }
                                            }}
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
                                                            .status
                                                    }
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
                                            // value={
                                            //     this.state.filterData.order_no
                                            // }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.order_no =
                                                    e.target.value
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
                                        <SubTitle title="Type" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={appConst.pending_approval_type}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData =
                                                        this.state.filterData
                                                    filterData.type =
                                                        value.value
                                                    this.setState({
                                                        filterData,
                                                    })
                                                }
                                            }}
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
                                                            .time_period
                                                    }
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
                                        <Grid
                                            className=" flex "
                                            item
                                            lg={2}
                                            md={2}
                                            sm={12}
                                            xs={12}
                                        >
                                            <Grid style={{
                                                marginTop: 17,
                                                marginLeft: 4,
                                            }}>
                                                <Button
                                                    className="mt-2"
                                                    progress={false}
                                                    type="submit"
                                                    scrollToTop={true}
                                                >
                                                    <span className="capitalize">
                                                        Search
                                                    </span>
                                                </Button>
                                            </Grid>

                                            <Grid
                                                style={{
                                                    marginTop: 17,
                                                    marginLeft: 4,
                                                }}
                                            >
                                                <Button
                                                    className="mt-2"
                                                    variant="outlined"
                                                    style={{ margin: 4 }}
                                                >
                                                    <span className="capitalize">
                                                        Reset
                                                    </span>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                        </Grid>

                        <Grid
                            className=" w-full"
                            spacing={1}
                            style={{ marginTop: 20, backgroundColor: 'red' }}
                        >
                            <Paper
                                elevation={0}
                                square
                                style={{
                                    backgroundColor: '#E6F6FE',
                                    border: '1px solid #DEECF3',
                                    height: 40,
                                }}
                            >
                                <Grid item lg={12} className=" w-full mt-2">
                                    <Grid
                                        container
                                        spacing={1}
                                        className="flex"
                                    >
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                            spacing={2}
                                            style={{ marginLeft: 10 }}
                                        >
                                            <SubTitle
                                                title={`Total Consignment: ${this.state.totalOrder}`}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/*Table*/}
                        <Grid style={{ marginTop: 20 }}>
                            {this.state.loaded ? (
                                <LoonsTable
                                    id={'MSD_AD_ORDERS'}
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        rowsPerPage: this.state.filterData.limit,
                                        page: this.state.filterData.page,

                                        onTableChange: (action, tableState) => {
                                            switch (action) {
                                                case 'changePage':
                                                    this.setPage(
                                                        tableState.page
                                                    )
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
                            ) : (
                                <Grid className='justify-center text-center w-full pt-12'>
                                    <CircularProgress size={30} />
                                </Grid>
                            )}
                        </Grid>
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )
    }
}

export default AllOrderList
