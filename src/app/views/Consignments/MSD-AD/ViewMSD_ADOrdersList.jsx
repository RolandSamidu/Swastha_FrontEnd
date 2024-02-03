import React, { Component, Fragment } from "react";
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle
} from "../../../components/LoonsLabComponents";
import { Grid, Tooltip, IconButton } from "@material-ui/core";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";
import * as appConst from "../../../../appconst";
import Paper from '@material-ui/core/Paper';
import Buttons from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from '@material-ui/icons/Add';
import ConsignmentService from "../../../services/ConsignmentService";
import { dateParse } from "utils";
import SPCServices from "app/services/SPCServices";

class ViewMSD_ADOrdersList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            consinmentWarehouses:[],
            loaded: false,
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
                agent: '',
                status: '',
                time_period: '',
                order_no: '',
                'order[0]': ['updatedAt', 'DESC'],
                status: ["Waiting For AD Approval", "Confirmed By AD"]
            },
            data: [],
            debitData: [],
            columns: [
                {
                    name: 'agent', // field name in the row object
                    label: 'Agent', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: false
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
                    name: 'order_no', // field name in the row object
                    label: 'Order List No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },
                {
                    name: 'Shipment_no', // field name in the row object
                    label: 'Wharf ref No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        selectableRows: 'ht',
                        customBodyRenderLite: (dataIndex) => {
                            let dataId = this.state.data[dataIndex]?.id;
                            let consignmentToShipmentMap = {};

                            // Create a map of consignment IDs to their debit note shipment numbers
                            this.state.debitData.forEach(debitItem => {
                                let consignmentId = debitItem?.Consignment?.id;
                                if(consignmentId){
                                    consignmentToShipmentMap[consignmentId] = debitItem?.Consignment?.shipment_no;
                                }
                            });

                            let shipmentNo = consignmentToShipmentMap[dataId];
                            return <p>{shipmentNo}</p>
                        }
                    }
                },
                {
                    name: 'ldcn_ref_no', // field name in the row object
                    label: 'LDCN/WDN ref No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true
                    },
                },

                {
                    name: 'delivery_date', // field name in the row object
                    label: 'Updated Scheduled Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].delivery_date;
                            return dateParse(data)
                        }
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
                        display: true
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: false,

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
                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton style={{ marginLeft: "-25px" }}
                                                onClick={() => {
                                                    window.location.href = `/consignments/msdAd/view-consignment/${id}`
                                                }}>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Allocate">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/msd/check-store-space/${id}`
                                                }}>
                                                <AddIcon color='primary' />
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

    reset = () => {

        this.setState({
            filterData: {
                limit: 20,
                page: 0,

                delivery_date: null,
                agent: { label: "" },
                status: ["Waiting For AD Approval", "Confirmed By AD"],
                time_period: { label: "" },
                order_no: '',
                'order[0]': ['updatedAt', 'DESC'],
                page: 0,
                limit: 20
            }
        }, () => this.loadData())


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

    async loadData() {
        this.setState({ loaded: false })

        let res = await ConsignmentService.getAllConsignments({ ...this.state.filterData, status: this.state.filterData?.status, time_period: this.state.filterData?.time_period?.label, agent: this.state.filterData?.status?.agent })
        if (res.status == 200) {
            this.setState(
                {
                   // loaded: true,
                    data: res.data.view.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.loadWarehouseInCons()
                    this.render()
                }
            )
        }
        let consignmentData = res?.data?.view?.data || []
        // console.log('consignmentData', consignmentData)
        // console.log('test1')
        let consignmentID = consignmentData.map(a => a?.id)
        // console.log("consignmentID", consignmentID)
        // console.log('test2')
        let params = {
            consignment_id: consignmentID,
            is_active: true
        }
        let wharfRes = await SPCServices.getAllDebitNotes(params);
        console.log('wharfRes', wharfRes)
        // console.log('test3')
        // let shipmentData = wharfRes?.data?.view?.data || [];
        // let shipmentId = shipmentData.map(a => a?.Consignment?.id)
        // console.log('shipmentId', shipmentId)
        // console.log("test4")

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

        window.addEventListener("pageshow", function (event) {
            var historyTraversal = event.persisted ||
                (typeof window.performance != "undefined" &&
                    window.performance.navigation.type === 2);
            if (historyTraversal) {
                // Handle page restore.
                window.location.reload();
            }
        });
        this.loadData()
    }

    


    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title=" View Order - Consignments " />
                        <Grid item lg={12} className=" w-full mt-2">
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.setPage(0)}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex">
                                    {/* <Grid
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
                                            value={this.state.filterData.time_period}
                                            options={appConst.admission_mode}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.time_period = value;
                                                    this.setState({ filterData })
                                                } else {
                                                    let filterData = this.state.filterData;
                                                    filterData.time_period = { label: "" };
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
                                    </Grid> */}
                                    {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Delivery effective date" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.filterData.delivery_date}
                                            placeholder="Date"
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
                                    </Grid> */}
                                    {/* <Grid
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
                                            value={this.state.filterData.agent}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.agent = value
                                                    this.setState({ filterData })
                                                } else {
                                                    let filterData = this.state.filterData;
                                                    filterData.agent = { label: "" }
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
                                    </Grid> */}
                                    {/* <Grid
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
                                            value={this.state.filterData.status}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.status = value;
                                                    this.setState({ filterData })
                                                } else {
                                                    let filterData = this.state.filterData;
                                                    filterData.status = { label: "" };
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
                                    </Grid> */}

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
                                        <SubTitle title="Search" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Please Enter"
                                            name="order_list"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.filterData.search}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let filterData = this.state.filterData;
                                                filterData.search = e.target.value;
                                                this.setState({ filterData })

                                            }}
                                            // validators={['required']}
                                            
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
                                        {/* <Grid
                                            className=" flex " item lg={2} md={2} sm={12} xs={12}
                                        > */}
                                        <Grid
                                            style={{ marginTop: 10 }}
                                        >
                                            <Button
                                                style={{ marginTop: "15px" }}
                                                // className="mt-2"
                                                progress={false}
                                                type="submit"
                                                scrollToTop={true}
                                            >
                                                <span className="capitalize">Search</span>
                                            </Button>&ensp;
                                            {/* </Grid> */}

                                            {/* <Grid
                                                style={{ marginTop: 17, marginLeft: 4 }}
                                            > */}
                                            <Button
                                                variant="outlined"
                                                onClick={this.reset}
                                                style={{ marginTop: "15px" }}
                                            >
                                                <span className="capitalize">Reset</span>
                                            </Button>
                                            {/* </Grid> */}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                        </Grid>

                        <Grid className=" w-full" spacing={1} style={{ marginTop: 20, backgroundColor: 'red' }}>
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
                                            spacing={2}
                                            style={{ marginLeft: 10 }}
                                        >
                                            <SubTitle title={`Total Consignments: ${this.state.totalConsignment}`} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/*Table*/}
                        <Grid style={{ marginTop: 20 }}>

                            {
                                this.state.loaded ?
                                    <LoonsTable
                                        id={"MSD_AD_ORDERS"}
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
                                                        this.setPage(tableState.page)
                                                        break;
                                                    case 'sort':
                                                        break;
                                                    default:
                                                        console.log('action not handled.');
                                                }
                                            }

                                        }
                                        }
                                    ></LoonsTable> : ' '
                            }

                        </Grid>
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )

    }
}

export default ViewMSD_ADOrdersList
