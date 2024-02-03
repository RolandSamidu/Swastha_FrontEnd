import {
  CircularProgress, Grid, IconButton,
} from '@material-ui/core';
import localStorageService from 'app/services/localStorageService';
import 'date-fns'
import React, { Component, Fragment } from 'react'
// import FilterComponent from '../filterComponent';

import { dateParse } from 'utils'
import PrintIcon from '@mui/icons-material/Print';
import Checkbox from '@material-ui/core/Checkbox';
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import ReturningOrderServices from 'app/services/ReturningOrderServices';

import {
  LoonsTable,
} from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReturnOrderPrint from '../printTable/returnOrderPrint';

class OrderReturnView extends Component {

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
          dataForPrint:null,
          ploaded: false,

          related_batches: [],
          batchChangeFormData: {
              order_item_allocationsId: null
          },
          
          columns: [
              {
                  name: 'order_id',
                  label: 'Order ID',
                  options: {
                      display: true,
                  },
              },
              {
                  name: 'book_no',
                  label: 'Book No',
                  options: {
                      display: true,
                  },
              },
              {
                  name: 'page_no',
                  label: 'Page No',
                  options: {
                      display: true,
                  },
              },
              {
                  name: 'returned_date',
                  label: 'Returned Date',
                  options: {
                      display: true,
                      customBodyRender: (value, tableMeta, updateValue) => {
                          return (
                              dateParse(this.state.data[tableMeta.rowIndex]?.returned_date)
                          )
                      }

                  },
              },
              {
                  name: 'order_id',
                  label: 'Order Id',
                  options: {
                      display: false,
                      customBodyRender: (value, tableMeta, updateValue) => {
                          return (

                              this.state.data[tableMeta.rowIndex].OrderExchange?.order_id
                             
                          )
                      }
                  },
              },
              {
                  name: 'name',
                  label: 'From Store',
                  options: {
                      display: false,
                      customBodyRender: (value, tableMeta, updateValue) => {
                          return (
                              this.state.data[tableMeta.rowIndex]?.OrderExchange?.fromStore?.name
                                 
                          )
                      }
                  },
              },
              {
                  name: 'name',
                  label: 'Employee Name',
                  options: {
                      display: true,
                      customBodyRender: (value, tableMeta, updateValue) => {
                          return (
                              this.state.data[tableMeta.rowIndex].Employee?.name 
                          )
                      }
                  },
              },
              {
                name: 'name',
                label: 'Employee Name',
                options: {
                    display: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            this.state.data[tableMeta.rowIndex].Employee?.name 
                        )
                    }
                },
            },
              {
                name: '',
                label: 'Action',
                options: {
                    display: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <>
                                <IconButton
                                    onClick={() => this.printData(this.state.data[tableMeta.rowIndex].id)}
                                >
                                    <PrintIcon color='primary'/>
                                </IconButton>

                            </>
                        )
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
            //   owner_id:this.state.owner_id,
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


  async printData(id) {
    this.setState({ printLoaded: false })
    console.log('clicked', id)

    let res = await ReturningOrderServices.getreturnOrderListById(this.state.filterData, id)

    if (res.status === 200) { 
        console.log('pdata', res.data.view)
        this.setState(
            { 
                ploaded: true,
                dataForPrint:res.data.view,
                printLoaded: true,
                // totalItems: res.data.view.totalItems,
            },
            () => {
                // this.render()
                document.getElementById('print_presc_015').click() 
                // this.getCartItems()
            }
        )
        // console.log('Print Data', this.state.printData)
    }

    this.setState({ showLoading: true });

    setTimeout(() => {
     this.setState({ showLoading: false });
    }, 5000);
}

  componentDidMount() {
    this.LoadOrderItemDetails()
    this.userLogonInfo()
  }

  async LoadOrderItemDetails() {
      this.setState({ loaded: false })
      let res = await ReturningOrderServices.getreturnOrderList(this.state.filterData)
      if (res.status) {
          console.log("Order Item Data for testing", res.data.view.data)
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
    //  console.log('login_user_info', login_user_info.name)
    this.setState({loginUser:login_user_info.name, owner_id:owner_id})
}

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
                </ValidatorForm>

                <Grid>
                    {this.state.ploaded  ?
                        <ReturnOrderPrint dataForPrint={this.state.dataForPrint} loginUser={this.state.loginUser}/>
                        :
                        null
                    }
                </Grid>
                
          </>

      )
  }
}

export default OrderReturnView