import {
    CircularProgress, Grid, IconButton,
} from '@material-ui/core';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import localStorageService from 'app/services/localStorageService';
import WarehouseServices from 'app/services/WarehouseServices';
import 'date-fns'
import React, { Component, Fragment } from 'react'
// import FilterComponent from '../filterComponent';
import moment from 'moment';
import { dateParse, getDateDifference } from 'utils'
import ReactToPrint from "react-to-print";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from '@material-ui/icons/Edit';
import PrintIcon from '@mui/icons-material/Print';
import Checkbox from '@material-ui/core/Checkbox';
import OrderReturnView from './OrderReturnView';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import ReturningOrderServices from 'app/services/ReturningOrderServices';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';


import {
    MainContainer,
    LoonsCard,
    LoonsTable,
    Button
} from 'app/components/LoonsLabComponents'

class OrderReturn extends Component {

    constructor(props) {
        super(props)
        this.state = {
            rowEnabled: [],
            isChecked: false,
            isIssued: false,
            data: [],
            currentData: [],
            otherData: [],
            batch_edit_enable: false,
            today: dateParse(new Date()),
            remark: null,
            warehouse_id:null,
            loginUser:null,
            from_owner_id:null,
            to_owner_id:null,
            isConfirmationOpen: false,
            Order_Item:null,
            bookNo: null, 
            pageNo: null,
            owner_id: null,

            related_batches: [],
            batchChangeFormData: {
                order_item_allocationsId: null
            },
            
            columns: [
                // {
                //     name: 'id',
                //     label: 'id',
                //     options: {
                //         display: false,
                //     },
                // },
                {
                    name: '',
                    label: '',
                    options: {
                      display: true,
                      customBodyRender: (value, tableMeta, updateValue) => {
                        const rowIndex = tableMeta.rowIndex;
                        const rowData = this.state.data[rowIndex];
                        const rowEnabled = this.state.rowEnabled[rowData.id] || false;
                        const allocatedQuantity = parseInt(rowData.allocated_quantity);
                  
                        const initialValue = rowData.return_quantity || '';
                        const inputValue = rowEnabled
                          ? this.state.currentData[rowData.id] !== undefined
                            ? this.state.currentData[rowData.id]
                            : initialValue || allocatedQuantity.toString()
                          : '';
                  
                        const handleCheckboxChange = () => {
                          const updatedRowEnabled = { ...this.state.rowEnabled };
                          updatedRowEnabled[rowData.id] = !rowEnabled;
                  
                          const updatedCurrentData = { ...this.state.currentData };
                          if (!rowEnabled) {
                            // Set the initial value when the checkbox is selected
                            // updatedCurrentData[rowData.id] = initialValue || allocatedQuantity.toString();
                            updatedCurrentData[rowData.id]= {
                                    return_quantity:initialValue || allocatedQuantity.toString(),
                                    order_item_id:rowData.order_item_id,
                                    order_item_allocation_id:rowData.id,  
                                    item_batch_id:rowData.ItemSnapBatchBin.ItemSnapBatch.id,
                                    allocated_quantity:rowData.allocated_quantity,
                                    remark:"",
                                    item_snapbatch_bin_id:rowData.item_batch_bin_id,
                                    warehouse_bin_id:rowData.bin_id
                                  }
 
                          } else {
                            // Remove the currentData value when the checkbox is deselected
                            delete updatedCurrentData[rowData.id];
                          }
                  
                          this.setState({
                            rowEnabled: updatedRowEnabled,
                            currentData: updatedCurrentData,
                          });
                        };
                  
                        return (
                          <Tooltip title="Change Batch">
                            <IconButton size="small" aria-label="view">
                              <Checkbox
                                color="primary"
                                checked={rowEnabled}
                                onChange={handleCheckboxChange}
                                disabled={!(rowData.status === 'ISSUED')}
                              />
                            </IconButton>
                          </Tooltip>
                        );
                      },
                    },
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
                            // const today = moment();
                            const today = dateParse(new Date());
                            const expire_date = dateParse(this.state.data[tableMeta.rowIndex].ItemSnapBatchBin.ItemSnapBatch.exd);
                            // const expire_date = '2023-6-3';

                            const difference = getDateDifference(expire_date, today)
                          
                            if (difference[0] < 0) {
                                return (
                                    <p style={{ color: 'red' }}>
                                    {difference[1] > 0 && `${difference[1]}Y `}
                                    {difference[2] > 0 && `${difference[2]}M `}
                                    {difference[3]}D
                                  </p>
                                );
                              } else {
                                return (
                                    <p>
                                    {difference[1] > 0 && `${difference[1]}Y `}
                                    {difference[2] > 0 && `${difference[2]}M `}
                                    {difference[3]}D
                                  </p>
                                );
                              }
                          }

                    },
                },
                {
                    name: 'strength',
                    label: 'Strength',
                    options: {
                        display: false,
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
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].OrderItem.request_quantity ?
                                    parseInt(this.state.data[tableMeta.rowIndex].OrderItem.request_quantity) : 'N/A'
                            )
                        }
                    },
                },
                {
                    name: 'approved_quantity',
                    label: 'Approved Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].OrderItem.approved_quantity ?
                                    parseInt(this.state.data[tableMeta.rowIndex].OrderItem.approved_quantity) : 'N/A'
                            )
                        }
                    },
                },
                {
                    name: 'issued_quantity',
                    label: 'Allocated Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].allocated_quantity ?
                                    parseInt(this.state.data[tableMeta.rowIndex].allocated_quantity) : 'N/A'
                            )
                        }
                    },
                },
                

                {
                    name: 'return_quantity',
                    label: 'Return Quantity',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            const rowIndex = tableMeta.rowIndex;
                            const rowData = this.state.data[rowIndex];
                            const rowEnabled = this.state.rowEnabled[rowData.id] || false;
                            const allocatedQuantity = parseInt(rowData.allocated_quantity);

                            const initialValue = rowData.return_quantity || '';
                            const inputValue = rowEnabled
                            ? this.state.currentData[rowData.id] !== undefined
                                ? this.state.currentData[rowData.id].return_quantity.toString()
                                : initialValue || allocatedQuantity.toString()
                            : '';

                            // this.setState({
                            //     from_owner_id:rowData.from_owner_id,
                            //     to_owner_id:rowData.to_owner_id,
                            // })
                
                            const handleValueChange = (event) => {
                                let newValue = event.target.value;
                                if (newValue < 0) {
                                  newValue = '0';
                                }
                              
                                const updatedData = [...this.state.data];
                                updatedData[rowIndex].return_quantity = newValue;
                              
                                const currentData = {
                                  ...this.state.currentData,
                                  [rowData.id]:{
                                    order_item_id:rowData.order_item_id,
                                    order_item_allocation_id:rowData.id,  
                                    item_batch_id:rowData.ItemSnapBatchBin.ItemSnapBatch.id,
                                    allocated_quantity:rowData.allocated_quantity,
                                    return_quantity: newValue,
                                    remark:"",
                                    item_snapbatch_bin_id:rowData.item_batch_bin_id,
                                    warehouse_bin_id:rowData.bin_id
                                  }
                                };
                              
                                this.setState({
                                    data: updatedData, 
                                    currentData, 
                                    from_owner_id:rowData.from_owner_id, 
                                    to_owner_id:rowData.to_owner_id,
                                    warehouse_id:rowData.ItemSnapBatchBin?.warehouse_id,
                                    Order_Item:rowData.OrderItem?.order_exchange_id,
                                    // owner_id:rowData.OrderItem?.owner_id
                                });
                              };
                            
                
                            const validators = ['required'];
                            const errorMessages = ['Return quantity is required'];
                
                            if (rowEnabled) {
                                validators.push(`exceedsAllocatedQuantity${rowIndex}`);
                                errorMessages.push('Return quantity cannot exceed allocated quantity');
                            }
                
                            ValidatorForm.addValidationRule(`exceedsAllocatedQuantity${rowIndex}`, (value) => {
                                if (value === '' || value === null) {
                                    return true;
                                }
                                return parseInt(value) <= allocatedQuantity;
                            });
                
                            return (
                                <ValidatorForm>
                                    <TextValidator
                                    placeholder="Return Quantity"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    name={`returnQuantity${rowIndex}`}
                                    value={inputValue}
                                    onChange={handleValueChange}
                                    validators={validators}
                                    errorMessages={errorMessages}
                                    disabled={!rowEnabled}
                                    InputProps={{
                                        inputProps: {
                                        defaultValue: initialValue,
                                        },
                                    }}
                                    />
                                </ValidatorForm>
                            );
                        },
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
                page: 0
            },

            alert: false,
            message: "",
            severity: 'success',
        }
    }

    // Define a function to retrieve the selected data with return quantity
    getSelectedData = () => {
        const selectedData = [];
          
        for (const [id, value] of Object.entries(this.state.currentData)) {
          const { return_quantity, order_item_id, order_item_allocation_id, item_batch_id, allocated_quantity, remark, item_snapbatch_bin_id, warehouse_bin_id } = value;
          selectedData.push({ return_quantity, order_item_id, order_item_allocation_id, item_batch_id, allocated_quantity, remark, item_snapbatch_bin_id, warehouse_bin_id });
        }
      
        return selectedData;
      };
      


    handleCheckAll = () => {
        this.setState((prevState) => ({
          isChecked: !prevState.isChecked,
        }));
        // Additional logic for handling the checked state of all items
      };


    componentDidMount() {
        console.log('s', this.props);
        
        this.state.filterData.order_exchange_id = this.props.id
        this.LoadOrderItemDetails()
        // this.loadRelatedBatches()
        this.userLogonInfo()
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
                this.render()
                console.log("State 2:", this.state.data)
            })
        }
        // console.log("Order Item Data", this.props.id.match.params.id)
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

    // get login user info
    async userLogonInfo() {

        let login_user_info = await localStorageService.getItem("userInfo");
        let owner_id = await localStorageService.getItem("owner_id");
        // console.log('owner_id', owner_id)
        this.setState({loginUser:login_user_info.id, owner_id:owner_id})
    }


    async returnOrder () {
        const selectedData = this.getSelectedData();

        const returnData = {
            order_exchange_id:this.state.Order_Item,
            from_owner_id:this.state.from_owner_id,
            to_owner_id:this.state.to_owner_id, 
            number_of_items: selectedData.length,
            returned_by: this.state.loginUser, 
            status:"Return", 
            type: "Return",
            remark: this.state.remark,
            returned_date: this.state.today,
            warehouse_id: this.state.warehouse_id,
            returned_item_list: selectedData,
            page_no:this.state.pageNo,
            book_no:this.state.bookNo,
            owner_id:this.state.owner_id
        };

        console.log('returnData',returnData)

        this.openConfirmationDialog(); 

        let res = await ReturningOrderServices.returnOrderList(returnData)
        console.log("status", res);
        if (res.status) {
            this.setState({ msg: res.data.posted.msg })
                ? this.setState({ alert: true, message: this.state.msg, severity: 'success' },
                    () => { 
    
                    })
                : this.setState({
                    alert: true,
                    message: this.state.msg,
                    severity: 'error',
                })

        }
    }   

    openConfirmationDialog = () => {
        this.setState({ isConfirmationOpen: true });
      };

    handleConfirmationYes = () => {
        this.setState({ isConfirmationOpen: false }); 
        this.returnOrder(); 
        this.setState({ isConfirmationOpen: false});
        window.location.reload();
      };
      
      handleConfirmationNo = () => {
        this.setState({ isConfirmationOpen: false }); 
      };

    render() {

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

        const handleRemarkChange = (event) => {
            this.setState({ remark: event.target.value });
        };

        const handlePageNoChange = (event) => {
            this.setState({ pageNo: event.target.value });
        };

        const handleBookNoChange = (event) => {
            this.setState({ bookNo: event.target.value });
        };
        return (
                <><ValidatorForm   > 
                {/* < FilterComponent onSubmitFunc={this.updateFilters.bind(this)} /> */}
                {this.state.loaded ? 
                    <LoonsTable
                        options={{
                            viewColumns: false,
                            pagination: true,
                            serverSide: true,
                            count: this.state.totalItems,
                            rowsPerPage: this.state.filterData.limit,
                            page: this.state.filterData.page,
                            print: false,
                            customToolbar: () => (
                                <ReactToPrint
                                    trigger={() => <IconButton><PrintIcon id="print_presc_004" size="small" ></PrintIcon></IconButton>}
                                    pageStyle={pageStyle}
                                    // documentTitle={letterTitle}
                                    //removeAfterPrint
                                    content={() => this.componentRef}
                                />
                            ),
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
                     : 
                   
                      <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress size={30} />
                        </Grid>
    }

                <Grid container spacing={2}>

                    <Grid item  sm={3}>
                        <TextValidator
                            placeholder="Book No."
                            fullWidth
                            variant="outlined"
                            size="small"
                            name="BookNo"
                            value={this.state.bookNo}
                            onChange={handleBookNoChange}
                            /> 
                    </Grid>

                    <Grid item  sm={3}>
                        <TextValidator
                            placeholder="Page No."
                            fullWidth
                            variant="outlined"
                            size="small"
                            name="PageNo"
                            value={this.state.pageNo}
                            onChange={handlePageNoChange}
                            />
                    </Grid>

                    <Grid item sm={12}>
                        <TextValidator
                            placeholder="Remark"
                            fullWidth
                            variant="outlined"
                            size="large"
                            name="remark"
                            value={this.state.remark}
                            onChange={handleRemarkChange}
                            />
                    </Grid>

                    <Grid item sm={12}>
                        <Button className="mt-3" color='primary' type="submit" onClick={this.openConfirmationDialog}>Return</Button>
                    </Grid>

                    <Dialog open={this.state.isConfirmationOpen} onClose={this.handleConfirmationNo}>
                        <DialogTitle>Confirm Return</DialogTitle>
                        <DialogContent>
                        <DialogContentText>Are you sure you want to proceed with the return?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.handleConfirmationNo} color="primary">
                            No
                        </Button>
                        <Button onClick={this.handleConfirmationYes} color="primary" autoFocus>
                            Yes
                        </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </ValidatorForm>
            </>

        )
    }
}

export default OrderReturn