import { LoonsTable, LoonsSnackbar } from 'app/components/LoonsLabComponents';
import {
    CircularProgress, Grid, IconButton, Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    Typography
} from '@material-ui/core';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { Alert, AlertTitle } from '@material-ui/lab'
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import RemarkServices from 'app/services/RemarkServices';
import 'date-fns'
import React, { Component, Fragment } from 'react'
import FilterComponent from './filterComponent';
import moment from 'moment';
import ReactToPrint from "react-to-print";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from '@material-ui/icons/Edit';
import { Button } from "app/components/LoonsLabComponents";
import PrintIcon from '@mui/icons-material/Print';
import { makeStyles } from '@material-ui/core/styles';
import localStorageService from 'app/services/localStorageService';
import WarehouseServices from 'app/services/WarehouseServices';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import AllItemsDistribution from './allItems'
import { convertTocommaSeparated, dateParse, msdServiceChargesCal, msdTotalChagesCal, roundDecimal, timeParse } from 'utils'
import { getPackDetails } from 'app/services/GetPacksize'

class AllocatedItems extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isIssued: false,
            data: [],
            batch_edit_enable: false,
            epidContain : false,

            related_batches: [],
            batchChangeFormData: {
                order_item_allocationsId: null
            },
            batchColumns: [
                {
                    name: 'batchNo',
                    label: 'Batch No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.related_batches[tableMeta.rowIndex].ItemSnapBatch.batch_no

                            )
                        }
                    },
                },


                {
                    name: 'exd',
                    label: 'EXD',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                dateParse(this.state.related_batches[tableMeta.rowIndex].ItemSnapBatch.exd)

                            )
                        }
                    },
                },
                {
                    name: 'quantity',
                    label: 'Quantity',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('chjsjjsjsj jsjsjs jjjj' ,this.state.related_batches[tableMeta.rowIndex])
                            if (this.state.related_batches[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === "EU" && this.state.epidContain) {
                                return roundDecimal(this.state.related_batches[tableMeta.rowIndex].quantity * this.state.related_batches[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.related_batches[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name
                            } else {
                                return (this.state.related_batches[tableMeta.rowIndex].quantity)
                            }
                           
                        }
                    },
                },

                {
                    name: '',
                    label: '',
                    options: {
                        // filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Tooltip title="Select">
                                    <IconButton
                                        className="px-2"
                                        onClick={() => {
                                            this.changeBatch(this.state.related_batches[tableMeta.rowIndex])
                                        }}
                                        size="small"
                                        aria-label="view"
                                    >
                                        <PlaylistAddCheckIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            )
                        }
                    },
                },
            ],

            columns: [
                // {
                //     name: 'id',
                //     label: 'id',
                //     options: {
                //         display: false,
                //     },
                // },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        // filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].status == "ISSUED" ? null :

                                    <Tooltip title="Change Batch">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                this.loadRelatedBatches(this.state.data[tableMeta.rowIndex])
                                                this.setState({
                                                    batch_edit_enable: true
                                                })
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                            )
                        }
                    }

                },
                {
                    name: 'SRNumber',
                    label: 'SR No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].OrderItem.ItemSnap.sr_no

                            )
                        }
                    },
                },
                {
                    name: 'itemName',
                    label: 'Item Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].OrderItem.ItemSnap.medium_description

                            )
                        }
                    },
                },
                {
                    name: 'batch',
                    label: 'Batch',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].ItemSnapBatchBin.ItemSnapBatch.batch_no

                            )
                        }

                    },
                },
                {
                    name: 'expiry_date',
                    label: 'Expiry Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                dateParse(this.state.data[tableMeta.rowIndex]?.ItemSnapBatchBin?.ItemSnapBatch?.exd)
                                // this.state.data[tableMeta.rowIndex].ItemSnapBatchBin.ItemSnapBatch.exd 

                            )
                        }

                    },
                },
                {
                    name: 'remaining_dates',
                    label: 'Remaining Dates',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            const today = moment();
                            const expire_date = this.state.data[tableMeta.rowIndex].ItemSnapBatchBin.ItemSnapBatch.exd;
                            let remaining = today.diff(expire_date, "days");
                            let exact_value = Math.abs(remaining);
                            let weeks = Math.floor(exact_value / 7);
                            let days = exact_value % 7;

                            // check weather expire or not
                            if (expire_date > today) {
                                // if expire 
                                return (
                                    <p>{" - "}{weeks}{" W "}{days}{" D "}</p>
                                )
                            } else {
                                return (
                                    <p>{weeks}{" W "}{days}{" D "}</p>
                                )
                            }

                        }

                    },
                },
                {
                    name: 'strength',
                    label: 'Strength',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].OrderItem.ItemSnap.strength ?
                                    this.state.data[tableMeta.rowIndex].OrderItem.ItemSnap.strength : 'N/A'

                            )
                        }
                    },
                },
                {
                    name: 'request_quantity',
                    label: 'Order Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom === 'EU' && this.state.data[tableMeta.rowIndex]?.to_owner_id !== '000') { 

                                return (
                                    this.state.data[tableMeta.rowIndex].OrderItem.request_quantity ?
                                        roundDecimal(parseInt(this.state.data[tableMeta.rowIndex].OrderItem.request_quantity) * this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size, 2) + ' ' +  this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name : 'N/A'
                                )
                            } else {
                                return (
                                    this.state.data[tableMeta.rowIndex].OrderItem.request_quantity ?
                                        parseInt(this.state.data[tableMeta.rowIndex].OrderItem.request_quantity) : 'N/A'
                                )
                            }

                            }
                           
                    },
                },
                {
                    name: 'approved_quantity',
                    label: 'Approved Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom === 'EU' && this.state.data[tableMeta.rowIndex]?.to_owner_id !== '000') {
                                return (
                                    this.state.data[tableMeta.rowIndex].OrderItem.approved_quantity ?
                                        // parseInt(this.state.data[tableMeta.rowIndex].OrderItem.approved_quantity) : 'N/A'
                                        roundDecimal(parseInt(this.state.data[tableMeta.rowIndex].OrderItem.approved_quantity) * this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size, 2) + ' ' +  this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name : 'N/A'
                                )
                            } else {
                                return (
                                    this.state.data[tableMeta.rowIndex].OrderItem.approved_quantity ?
                                        parseInt(this.state.data[tableMeta.rowIndex].OrderItem.approved_quantity) : 'N/A'
                                )
                            }
                            
                        }
                    },
                },
                {
                    name: 'issued_quantity',
                    label: 'Allocated Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom === 'EU' && this.state.data[tableMeta.rowIndex]?.to_owner_id !== '000') {
                                return (
                                    this.state.data[tableMeta.rowIndex].allocated_quantity ?
                                        // parseInt(this.state.data[tableMeta.rowIndex].allocated_quantity) : 'N/A'
                                        roundDecimal(parseInt(this.state.data[tableMeta.rowIndex].allocated_quantity) * this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size, 2) + ' ' +  this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name : 'N/A'
                                )
                            } else {
                                return (
                                    this.state.data[tableMeta.rowIndex].allocated_quantity ?
                                        parseInt(this.state.data[tableMeta.rowIndex].allocated_quantity) : 'N/A'
                                )
                            }
                            
                        }
                    },
                },
                {
                    name: 'recieved_quantity',
                    label: 'Received Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom === 'EU' && this.state.data[tableMeta.rowIndex]?.to_owner_id !== '000') {
                                return (
                                    this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity ?
                                        // parseInt(this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity) : 'N/A'
                                        roundDecimal(parseInt(this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity) * this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size, 2) + ' ' +  this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name : 'N/A'
                                )
                            } else {
                                return (
                                    this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity ?
                                        parseInt(this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity) : 'N/A'
                                )
                            }
                            
                        }
                    },
                },

            ],
            filterData: {
                ven_id: null,
                group_id: null,
                category_id: null,
                class_id: null,
                order_exchange_id: null,
                // type: 'Order',
                // status:"ALLOCATED",
                search: null,
                limit: 20,
                page: 0,
                orderby_sr: true
            },

            alert: false,
            message: "",
            severity: 'success',
            login_user_roles: [],
            packData: null,
            printData:[]
        }
    }

    async getPacksizeDetails(data) {

        let items = data
        let packData = await getPackDetails(items)
        this.setState({
            packData,
            Loaded: true,
        })
        // console.log('checking item packData 2', packData)


    }


    async componentDidMount() {

        let owner_id= await localStorageService.getItem("owner_id")

        if (owner_id === '000') {
            this.setState({
                epidContain : false
            })
        } else {
            this.setState({
                epidContain : true
            })
        }
        console.log('props', this.props.id.match.params.id)
        // check status
        if (this.props.id.match.params.status === "ISSUED") {
            this.setState({ isIssued: true })
        } else {
            this.setState({ isIssued: false })
        }

        let user_info = await localStorageService.getItem("userInfo")


        let filterData = this.state.filterData
        filterData.order_exchange_id = decodeURIComponent(this.props.id.match.params.id)
        this.setState({ filterData, login_user_roles: user_info.roles })
        this.LoadOrderItemDetails()
        this.LoadPrintAllocatedList()
    }

    async LoadOrderItemDetails() {
        this.setState({ loaded: false })
        console.log("State 1:", this.state.data)
        let filterdata = this.state.filterData
        // filterdata.from = '385face0-b8a1-48d8-a946-60504a070daa'
        let res = await PharmacyOrderService.getOrderBatchItems(this.state.filterData)
        if (res.status) {
            console.log("Order Item Data", res.data.view.data)
            this.setState({
                data: res.data.view.data,
                totalItems: res.data.view.totalItems,
                loaded: true
            }, () => {
                //this.render()
                this.getPacksizeDetails(this.state.data)
                console.log("State 2:", this.state.data)
            })
        }
        console.log("Order Item Data", this.props.id.match.params.id)
    }

    async LoadPrintAllocatedList() {

        let params = {
            order_exchange_id : this.props.id.match.params.id
        }
        
        let res = await PharmacyOrderService.getOrderBatchItems(params)
        if (res.status) {
            console.log("Order print data", res.data.view.data)
            this.setState({
                printData: res.data.view.data,
            })
        }
   
    }


    updateFilters(ven, category, class_id, group, search) {
        let filterData = this.state.filterData
        filterData.ven_id = ven
        filterData.category_id = category
        filterData.class_id = class_id
        filterData.group_id = group
        filterData.search = search

        this.setState({ filterData })
        this.LoadOrderItemDetails()
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                console.log('New filterData', this.state.filterData)
                this.LoadOrderItemDetails()
            }
        )
    }


    async loadRelatedBatches(row) {
        console.log("selected row", row)
        var selected_warehouse_cache = await localStorageService.getItem(
            'Selected_Warehouse'
        )


        let batchChangeFormData = this.state.batchChangeFormData
        batchChangeFormData.order_item_allocationsId = row.id

        this.setState({
            batchChangeFormData
        })


        let params = {
            warehouse_id: selected_warehouse_cache.warehouse.id,
            item_id: row.OrderItem.item_id,
            quantity_grater_than_zero: true,
            'order[0]': ['quantity', 'DESC'],
            exd: dateParse(row.ItemSnapBatchBin.ItemSnapBatch.exd),
            //quantity:row.allocated_quantity
        }

        let res = await WarehouseServices.getSingleItemWarehouse(params)
        if (res.status) {
            console.log("stock Data", res.data.view.data)
            this.setState({
                related_batches: res.data.view.data
                // returnDialog: true,
            })
        }

    }


    async changeBatch(row) {

        let data = {
            item_batch_bin_id: row.id,
            bin_id: row.bin_id,
            "msa_batch_changing": true
        }

        let res = await PharmacyOrderService.editOrderBatchItems(this.state.batchChangeFormData.order_item_allocationsId, data)
        if (res.status == 200) {
            this.setState({
                // Loaded: true,
                alert: true,
                message: 'Batch Edit Succesfully',
                severity: 'success',
                batch_edit_enable: false

            }, () => {
                this.componentDidMount()
            })
        } else {
            this.setState({
                // Loaded: true,
                alert: true,
                message: 'Batch Edit Unsuccesful',
                severity: 'error',

            })
        }

    }

    render() {

        // const useStyles = makeStyles((theme) => ({
        //     iconButton: {
        //       '&:hover': {
        //         color: theme.palette.primary.main,
        //       },
        //     },
        //   }));


        const pageStyle = `
 
    @page {
       
       margin-left:10mm;
       margin-right:5mm;
       margin-bottom:5mm;
       margin-top:8mm;
     }
    
     @media all {
       .pagebreak {
         display: none;
       }
     }
   
     @media print {
       .header, .header-space,
              {
               height: 2000px;
             }
   .footer, .footer-space {
               height: 100px;
             }
   
             .footerImage{
               height: 50px;
               bottom: 0;
             }
             .footer {
               position: fixed;
               bottom: 0;
             }
             .page-break {
               margin-top: 1rem;
               display: block;
               page-break-before: auto;
             }
     }
   `;
        return (
            <> < FilterComponent onSubmitFunc={this.updateFilters.bind(this)} />
            
                
                {this.state.loaded ?
                <>
                    <Grid container justify="center" alignItems="center" className='mt-5'>
                        <Grid items><Alert severity="error">Please download the allocated details and check before issue and print the issue note.</Alert></Grid>
                    </Grid>
                    <Grid container justify="flex-end" className='mt-2 mb-3'>
                        
                        <Grid items>
                            <ReactToPrint
                                trigger={() => (
                                    <Button>
                                        <PrintIcon id="print_presc_004" size="small" className='mr-3'/>
                                        Print Allocated List
                                    </Button>
                                )}
                                content={() => this.componentRef}
                                pageStyle={pageStyle}
                            />
                            {/* <Button>
                                Print Allocated List
                            </Button> */}
                        </Grid>
                    </Grid>
                    <LoonsTable
                        options={{
                            viewColumns: false,
                            pagination: true,
                            serverSide: true,
                            count: this.state.totalItems,
                            rowsPerPage: this.state.filterData.limit,
                            page: this.state.filterData.page,
                            print: false,
                            download: false,
                            // customToolbar: () => (
                            //     <ReactToPrint
                            //         trigger={() => <IconButton><PrintIcon id="print_presc_004" size="small" ></PrintIcon></IconButton>}
                            //         pageStyle={pageStyle}
                            //         // documentTitle={letterTitle}
                            //         //removeAfterPrint
                            //         content={() => this.componentRef}
                            //     />
                            // ),
                            onTableChange: (action, tableState) => {
                                console.log(action, tableState)
                                switch (action) {
                                    case 'changePage':
                                        this.setPage(tableState.page)
                                        break
                                    case 'sort':
                                        // this.sort(tableState.page, tableState.sortOrder);
                                        break
                                    default:
                                        console.log('action not handled.')
                                }
                            }
                        }}
                        data={this.state.data}
                        columns={this.state.columns} />
                    </>
                    :
                    (
                        //loading effect
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress size={30} />
                        </Grid>
                    )

                }

                {/* return oder button  */}
                {this.state.isIssued && !this.state.login_user_roles.includes('MSD MSA') ?
                    <Grid sm={12}>
                        <Button color="primary" className="mt-3 ml-5"
                            onClick={() => {
                                const { id, items, order, empname, empcontact, status, type } = this.props.id.match.params;
                                const encodedId = encodeURIComponent(id);
                                const encodedItems = encodeURIComponent(items);
                                const encodedOrder = encodeURIComponent(order);
                                const encodedEmpname = encodeURIComponent(empname);
                                const encodedEmpcontact = encodeURIComponent(empcontact);
                                const encodedStatus = encodeURIComponent(status);
                                const encodedType = encodeURIComponent(type);

                                const url = `/msa_all_order/all-orders/orderReturn/${encodedId}/${encodedItems}/${encodedOrder}/${encodedEmpname}/${encodedEmpcontact}/${encodedStatus}/${encodedType}`;

                                window.location = url;
                            }}

                        >
                            Order Return
                        </Button>
                    </Grid>
                    :
                    null
                }


                {this.state.login_user_roles.includes('MSD MSA')?
                <AllItemsDistribution hideTables={true} id={this.props.id}></AllItemsDistribution>
                :null
                    
                }

                <div className="hidden">
                    {/* <Grid>
                <ReactToPrint
                    trigger={() => <Button id="print_presc_004" size="small" startIcon="print">Print</Button>}
                    pageStyle={pageStyle}
                    // documentTitle={letterTitle}
                    //removeAfterPrint
                    content={() => this.componentRef}
                />
            </Grid> */}
                    <Grid className="bg-light-gray p-5 ">
                        <div className="bg-white p-5 ">
                            <div ref={(el) => (this.componentRef = el)} >

                                <div>
                                    <Grid container>
                                        <div className='w-full'>
                                            <p className='text-center' style={{ fontWeight: 'bold', textDecoration: 'underline', }}>Allocated Item List</p>
                                        </div>

                                        <table className='w-full'>
                                            <thead>
                                                <tr>
                                                    <th className='text-left' style={{ width: '15%', textDecoration: 'underline', fontWeight: 'normal' }}>SR No</th>
                                                    <th className='text-left' style={{ width: '30%', textDecoration: 'underline', fontWeight: 'normal' }}>Item Name</th>
                                                    <th className='text-left' style={{ width: '10%', textDecoration: 'underline', fontWeight: 'normal' }}>Batch</th>
                                                    <th className='text-left' style={{ width: '15%', textDecoration: 'underline', fontWeight: 'normal' }}>Expiry Date</th>
                                                    <th className='text-right' style={{ width: '15%', textDecoration: 'underline', fontWeight: 'normal' }}>Allocated Qty</th>
                                                    <th className='text-right' style={{ width: '15%', textDecoration: 'underline', fontWeight: 'normal' }}>Pack size</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* {this.state.data[0].OrderItem.ItemSnap.sr_no}  */}
                                                {this.state.printData.map((item) => (
                                                    <tr>
                                                        <td className='text-left' style={{ width: '15%' }}>{item?.OrderItem?.ItemSnap?.sr_no}</td>
                                                        <td className='text-left' style={{ width: '30%' }}>{item?.OrderItem?.ItemSnap?.medium_description}</td>
                                                        <td className='text-left' style={{ width: '10%' }}>{item?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no}</td>
                                                        <td className='text-left' style={{ width: '15%' }}>{dateParse(item?.ItemSnapBatchBin?.ItemSnapBatch?.exd)}</td>
                                                        {/* {console.log('chekking printing info', item)} */}
                                                        <td className='text-right' style={{ width: '15%' }}>{(item?.OrderItem?.ItemSnap?.converted_order_uom === "EU" && this.state.epidContain) ? (item?.allocated_quantity * item?.OrderItem?.ItemSnap?.item_unit_size) + ' ' + item?.OrderItem?.ItemSnap?.DisplayUnit?.name + " (" + item?.allocated_quantity + ' ' + item?.OrderItem?.ItemSnap?.MeasuringUnit?.name + ' )'  : item?.allocated_quantity}</td>
                                                        <td className='text-right' style={{ width: '15%' }}>
                                                        {(this.state.packData?.find((x) => (x.item_id == item?.OrderItem.item_id && x.batch_no == item?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no && x.quantity == item?.allocated_quantity)))?.packingdetails.map((x, packIndex) => {
                                                                            
                                                                            return <div>{x}</div>;
                                                                        })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </div>



                <Dialog
                    maxWidth={'sm'}
                    fullWidth={true}
                    open={this.state.batch_edit_enable}
                    onClose={() => {
                        this.setState({ batch_edit_enable: false })
                    }}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogContent>
                        <Typography className="font-semibold text-15">
                            Change Batch
                        </Typography>
                        <Grid container>
                            <ValidatorForm
                                className='w-full'
                                id="newDashboard2"

                            >

                                <Alert severity="info" className="mt-1">
                                    <Typography className="mt-2">
                                        Please Select the Batch
                                    </Typography>
                                </Alert>

                                <LoonsTable
                                    options={{
                                        viewColumns: false,
                                        pagination: false,
                                        serverSide: true,
                                        print: false,
                                        download: false
                                    }}
                                    data={this.state.related_batches}
                                    columns={this.state.batchColumns} />

                            </ValidatorForm>
                        </Grid>
                    </DialogContent>
                </Dialog>

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
            </>
        )
    }
}

export default AllocatedItems