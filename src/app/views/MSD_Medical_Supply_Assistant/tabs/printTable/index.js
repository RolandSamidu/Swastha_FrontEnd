import React, { Component } from 'react'
import { Grid} from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { Button} from "app/components/LoonsLabComponents";
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import { dateParse } from 'utils'

 class printTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data :[],
            filterData: {
                ven_id: null,
                group_id: null,
                category_id: null,
                class_id: null,
                order_exchange_id: null,
                // type: 'Order',
                // status:"ALLOCATED",
                search: null,
            },
        }
    }

    componentDidMount() {
        this.LoadOrderItemDetails()
    }


    async LoadOrderItemDetails() {
        // console.log("State 1:", this.state.data)
        // filterdata.from = '385face0-b8a1-48d8-a946-60504a070daa'
        let res = await PharmacyOrderService.getOrderBatchItems(this.state.filterData)
        if (res.status) {
            console.log("Order Item Data1", res.data.view.data)
            // console.log('hi',res.data.view.data[0].OrderItem.ItemSnap.sr_no)
            this.setState({
                data: res.data.view.data,
            })
            // console.log('path',path.ItemSnap.sr_no)
        }   

    
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
      <div>
        <Grid>
            <ReactToPrint
                trigger={() => <Button id="print_presc_004" size="small" startIcon="print">Print</Button>}
                pageStyle={pageStyle}
                // documentTitle={letterTitle}
                //removeAfterPrint
                content={() => this.componentRef}
            />
        </Grid>
        <Grid className="bg-light-gray p-5 ">
            <div className="bg-white p-5 ">
                <div ref={(el) => (this.componentRef = el)} >
                    
                    <div>
                        <Grid container>
                        
                            <table className='w-full'>
                                <thead>
                                    <tr>
                                        <th className='text-left' style={{width:'15%', textDecoration: 'underline'}}>SR No</th>
                                        <th className='text-left' style={{width:'40%', textDecoration: 'underline'}}>Item Name</th>
                                        <th className='text-left' style={{width:'15%', textDecoration: 'underline'}}>Batch</th>
                                        <th className='text-left' style={{width:'15%', textDecoration: 'underline'}}>Expiry Date</th>
                                        <th className='text-right' style={{width:'15%', textDecoration: 'underline'}}>Allocated Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                            {/* {this.state.data[0].OrderItem.ItemSnap.sr_no}  */}
                                  {this.state.data.map((item) => (
                                      <tr>
                                          <td className='text-left' style={{width:'15%'}}>{item.OrderItem.ItemSnap.sr_no}</td>
                                          <td className='text-left' style={{width:'40%'}}>{item.OrderItem.ItemSnap.medium_description}</td>
                                          <td className='text-left' style={{width:'15%'}}>{item.ItemSnapBatchBin.ItemSnapBatch.batch_no}</td>
                                          <td className='text-left' style={{width:'15%'}}>{dateParse(item.ItemSnapBatchBin.ItemSnapBatch.exd)}</td>
                                          <td className='text-right' style={{width:'15%'}}>{item.allocated_quantity}</td>
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
    )
  }
}

export default printTable;
