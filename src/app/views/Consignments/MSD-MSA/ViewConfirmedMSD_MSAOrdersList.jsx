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
import {
    CircularProgress, Grid, Tooltip, IconButton, Dialog,
    Typography
} from "@material-ui/core";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";
import * as appConst from "../../../../appconst";
import Paper from "@material-ui/core/Paper";
import Buttons from "@material-ui/core/Button";
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import ApartmentIcon from '@material-ui/icons/Apartment';
import VisibilityIcon from "@material-ui/icons/Visibility";
import ReceiptIcon from '@material-ui/icons/Receipt';
import ConsignmentService from "../../../services/ConsignmentService";
import localStorageService from "app/services/localStorageService";
import WarehouseServices from "app/services/WarehouseServices";
import { dateParse } from "utils";
import SPCServices from "app/services/SPCServices";

class ViewMSD_MSAOrdersList extends Component {
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
                agent: '',
                status: '',
                time_period: '',
                order_no: '',
                msa_id: '',
                invoice_no:null,
                confirmed_only: true,
                'order[0]': ['updatedAt', 'DESC'],
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
                    name: 'order_no', // field name in the row object
                    label: 'Order List No', // column title that will be shown in table
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
                    name: 'Shipment_no', // field name in the row object
                    label: 'Wharf ref No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        selectableRows: 'ht',
                        customBodyRenderLite: (dataIndex) => {
                            let dataId = this.state.data[dataIndex]?.id;
                            let consignmentToShipmentMap = {};

                            // Create a map consignment IDs to their debit notes
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
                        display: true
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
                                        <Tooltip title="View consigment And GRN">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/consignments/msdMSA/view-consignment/${id}`
                                                }}>
                                                <ReceiptIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            );
                        }
                    }
                }
            ],

            selected_warehouse: null,
            selected_warehouse_name: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],

            alert: false,
            message: "",
            severity: 'success',
        }
    }


    async loadData() {
        this.setState({ loaded: false })

        var user = await localStorageService.getItem('userInfo');
        let filterData = this.state.filterData;
        filterData.msa_id = user.id;
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

    componentDidMount() {
        this.loadData();
        this.loadWarehouses()
    }


    async loadWarehouses() {
        this.setState({ Loaded: false })
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        var all_pharmacy_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        if (!selected_warehouse_cache) {
            this.setState({ dialog_for_select_warehouse: true })
        }
        else {
            this.setState({
                owner_id: selected_warehouse_cache.owner_id, selected_warehouse: selected_warehouse_cache.id, dialog_for_select_warehouse: false, Loaded: true,
                selected_warehouse_name: selected_warehouse_cache.name
            })
        }
        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params);
        if (res.status == 200) {
            console.log("warehouseUsers", res.data.view.data)

            res.data.view.data.forEach(element => {
                all_pharmacy_dummy.push(
                    {
                        warehouse: element.Warehouse,
                        name: element.Warehouse.name,
                        main_or_personal: element.Warehouse.main_or_personal,
                        owner_id: element.Warehouse.owner_id,
                        id: element.warehouse_id,
                        pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
                    }

                )
            });
            console.log("warehouse", all_pharmacy_dummy)
            this.setState({ all_warehouse_loaded: all_pharmacy_dummy })
        }
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <Typography variant="h6" className="font-semibold">View Order - Consignments</Typography>
                            {/* {
                             this.state.login_user_info.includes('MSD SCO')||this.state.login_user_info.includes('MSD SCO Distribution')||
                             this.state.login_user_info.includes('MSD SCO QA')||this.state.login_user_info.includes('MSD SCO Supply')||
                             this.state.login_user_info.includes('MSD SCO Distribution') 
                            ? null :  */}
                            <div className='flex'>
                                <Grid className='pt-2 pr-3'
                                >
                                    <Typography>{this.state.selected_warehouse_name !== null ? "You're in " + this.state.selected_warehouse_name : null}</Typography>
                                </Grid>

                                
                                    <LoonsButton
                                        color='primary'
                                        onClick={() => {
                                            this.setState({ dialog_for_select_warehouse: true, Loaded: false })
                                        }}>
                                        <ApartmentIcon />
                                        Change Warehouse
                                    </LoonsButton>
                                


                            </div>
                            {/* } */}

                        </div>



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
                                        <SubTitle title="Invoice No" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Please Enter"
                                            name="invoice_no"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.filterData.invoice_no}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let filterData = this.state.filterData;
                                                filterData.invoice_no = e.target.value;
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
                                                rowsPerPage: 20,
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

                <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_warehouse} >

                    <MuiDialogTitle disableTypography>
                        <CardTitle title="Select Your Warehouse" />
                    </MuiDialogTitle>



                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            onError={() => null}
                            className="w-full">
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                options={this.state.all_warehouse_loaded.sort((a, b) => (a.name.localeCompare(b.name)))} // sort by name
                                onChange={(e, value) => {
                                    if (value != null) {
                                        localStorageService.setItem('Selected_Warehouse', value);
                                        this.setState({ dialog_for_select_warehouse: false, Loaded: true, selected_warehouse: value.id, selected_warehouse_name: value.name })
                                    }
                                }}
                                value={{
                                    name: this.state.selected_warehouse ? (this.state.all_warehouse_loaded.filter((obj) => obj.id == this.state.selected_warehouse).name) : null,
                                    id: this.state.selected_warehouse
                                }}
                                getOptionLabel={(option) => option.name != null ? option.name + " - " + option.main_or_personal : null}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Warehouse"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />

                        </ValidatorForm>
                    </div>
                </Dialog>
            </Fragment>
        );
    }
}

export default ViewMSD_MSAOrdersList
