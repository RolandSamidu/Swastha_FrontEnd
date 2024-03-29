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
import { CircularProgress, Grid, Tooltip, IconButton } from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import * as appConst from '../../../appconst'
import Paper from '@material-ui/core/Paper'
import Buttons from '@material-ui/core/Button'
import VisibilityIcon from '@material-ui/icons/Visibility'
import AddIcon from '@mui/icons-material/Add';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import ConsignmentService from '../../services/ConsignmentService'
import { dateParse } from 'utils'
import moment from 'moment'
import SPCServices from 'app/services/SPCServices';

class ViewConfirmedOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            consinmentWarehouses:[],
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
                delivery_date: '',
                agent: '',
                confirmed_only: true,
                time_period: '',
                order_no: '',
                search: '',
                'order[0]': ['updatedAt', 'DESC'],
            },
            data: [],
            debitData: [],
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: false,

                        download: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]
                            //console.log("data row", data)
                            return (
                                <Grid className="flex items-center">
                                    <Grid >
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    /*    window.open(
                                                           `/consignments/msdAd/view-consignment/${data.id}`
                                                       ) */
                                                    window.location = `/consignments/msdAd/view-consignment/${data.id}`
                                                }}
                                            >
                                                <VisibilityIcon color="primary" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid >
                                        <Tooltip title="View Batch Allocation">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/msd/check-store-space/${data.id}`
                                                }}>
                                                <AccountTreeIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            )
                        },
                    },
                },
                {
                    name: 'agent', // field name in the row object
                    label: 'Agent', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'invoice_no', // field name in the row object
                    label: 'Invoice No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'order_no', // field name in the row object
                    label: 'Order List No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'wharf_ref_no', // field name in the row object
                    label: 'Wharf ref No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        selectableRows: 'ht',
                        customBodyRenderLite: (dataIndex) => {
                            let dataId = this.state.data[dataIndex]?.id;
                            let consignmentToShipmentMap = {};

                            // Create a map of consignment IDs to their debit shipment numbers
                            this.state.debitData.forEach(debitItem => {
                                let consignmentId = debitItem?.Consignment?.id;
                                if(consignmentId){
                                    consignmentToShipmentMap[consignmentId] = debitItem?.Consignment?.shipment_no;
                                }
                            });

                            let shipmentNo = consignmentToShipmentMap[dataId];
                            return <p>{shipmentNo}</p>
                        }
                    },
                },
                {
                    name: 'ldcn_ref_no', // field name in the row object
                    label: 'LDCN/WDN ref No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'warehouse', // field name in the row object
                    label: 'Warehouse', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data=this.state.consinmentWarehouses.find(x=>x.consignment_id==this.state.data[dataIndex].id)?.primary_warehouse_name
                            return (
                                <span>
                                    {data ? data : ''}
                                </span>
                            )
                        },
                    },
                },
                {
                    name: 'warehouse', // field name in the row object
                    label: 'Allocated Warehouse', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data=this.state.consinmentWarehouses.find(x=>x.consignment_id==this.state.data[dataIndex].id)?.allocated_warehouse_name
                            return (
                                <span>
                                    {data ? data : ''}
                                </span>
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
                    },
                },
                {
                    name: 'delivery_date', // field name in the row object
                    label: 'Updated Scheduled Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {value ? dateParse(moment(value)) : ''}
                                </span>
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

        let res = await ConsignmentService.getAllConsignments(
            this.state.filterData
        )
        if (res.status == 200) {
            this.setState(
                {
                    loaded: true,
                    data: res?.data?.view?.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                    this.loadWarehouseInCons()
                }
            )
        }

        let consignmentData = res?.data?.view?.data || []
        let consignmentID = consignmentData.map(a => a?.id)
        let params = {
            consignment_id: consignmentID,
            is_active: true
        }
        let wharfRes = await SPCServices.getAllDebitNotes(params);
        // let shipmentData = wharfRes?.data?.view?.data || [];
        // let shipmentId = shipmentData.map(a => a?.Consignment?.id)
        // console.log('shipmentId', shipmentId)
    
        if(wharfRes.status == 200){
            this.setState({
                loaded: true,
                debitData: wharfRes?.data?.view?.data || [],
            }, () => {
                this.render()
            })
        }
        this.setState({
            totalConsignment: this.state.data.length
        })
    }

    async loadWarehouseInCons(){
        let params={
            consignment_id:this.state.data.map(x=>x.id),
            searchType:'WAREHOUSE'
        }
        let res = await ConsignmentService.getAllConsignments(
            params
        )
        if (res.status == 200) {
            console.log("consingment warehouse",res.data.view)
            this.setState({
                consinmentWarehouses:res.data.view,
                loaded: true,
            })
        }else{
            this.setState({
               loaded: true,
            })
        }
    }

    componentDidMount() {
        this.loadData()
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

    handleFilterSubmit = (val) => {
        this.loadData()
    }

    onSubmit = () => {
        this.handleFilterSubmit({
            order_no: this.state.order_no,
            delivery_date: this.state.delivery_date,
            agent: this.state.agent,
        })
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title=" View Confirmed Order - Consignments " />

                        <Grid item lg={12} className=" w-full mt-2">
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.setPage(0)}
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
                                        <SubTitle title="Delivery Date Range" />
                                        <DatePicker
                                            className="w-full"
                                            value={
                                                this.state.filterData
                                                    .delevery_effective_date
                                            }
                                            placeholder="Date From"
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={(date) => {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.delevery_effective_date =
                                                    date
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
                                            className="w-full"
                                            options={appConst.admission_mode}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData
                                                    filterData.status = e.target.value

                                                    this.setState({
                                                        filterData,
                                                    })
                                                } else {
                                                    let filterData = this.state.filterData
                                                    filterData.status = null

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
                                        <SubTitle title="Order List" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Please Enter"
                                            name="order_list"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                this.state.filterData.order_no
                                            }
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
                                        <SubTitle title="Search" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Search"
                                            name="search"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                this.state.filterData.search
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.search =
                                                    e.target.value
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
                                                marginLeft: 4
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


                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>

                            <Grid
                                className=" w-full"
                                style={{
                                    marginTop: 20,
                                    backgroundColor: 'red',
                                }}
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
                                                // spacing={2}
                                                style={{ marginLeft: 10 }}
                                            >
                                                <SubTitle
                                                    title={`Total Consignment: ${this.state.totalConsignment}`}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/*Table*/}
                        <Grid
                            lg={12}
                            className=" w-full mt-2"
                            spacing={2}
                            style={{ marginTop: 20 }}
                        >
                            {this.state.loaded ? (
                                <div className="pt-0">
                                    <LoonsTable
                                        id={'DEFAULT_USER'}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: this.state.filterData.limit,
                                            page: this.state.filterData.page,

                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
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
                                </div>
                            ) : (
                                <Grid className="justify-center text-center w-full pt-12">
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

export default ViewConfirmedOrders
