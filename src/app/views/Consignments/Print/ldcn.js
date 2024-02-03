/*
Loons Lab Ldcn
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";

import { convertTocommaSeparated, dateParse, timeParse } from "utils";


class Ldcn extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    static propTypes = {
    };

    static defaultProps = {
    };

    newlineText(text) {
        if (text) {
            return text.split('\n').map(str => <p>{str}</p>);
        } else {
            return ""
        }

    }


    componentDidMount() {
        console.log('checking inc props', this.props.data)
    }

    render() {
        const {
        } = this.props;
        /*  size: 297mm 420mm, */
        const pageStyle = `

        
 
 @page {
    size: letter portrait; /* auto is default portrait; */
    margin-left:10mm,
    margin-right:5mm,
    margin-bottom:5mm,
    margin-top:8mm,
    
  }
 
  @media all {
    .pagebreak {
      display: none,
    }
  }

  @media print {
    

    // .page-break { page-break-after: always, }
    .header, .header-space,
           {
            height: 2000px,
          }
.footer, .footer-space,{
            height: 100px,
          }

          .footerImage{
            height: 10px,
            bottom: 0,
            margin-bottom: 0px,
            padding-bottom: 0px,
            
          }
          .footer {
            position: fixed,
            bottom: 0,
            
          }
          .page-break {
            margin-top: 1rem,
            display: block,
            page-break-before: auto,
          }

          .downFooter {
            bottom: 0,
            margin-top: 0px,
            padding-top: 0px,
          }

          .fontTwl {
            font-size:12px
          }

        
  }
`; 


        return (    
            <div>
                <Grid className="w-full justify-end items-end flex ">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_104" color="primary" size="small" style={{ margin:'0', padding:'0'}}>Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray p-5" >
                        <div className="bg-white p-5" >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                    <Grid className="w-full" container>   
                                
                                        <Grid item xs={12}>
                                            <table className="w-full">
                                                <tr>
                                                    <td style={{width:'25%'}}></td>
                                                    <td className="fontTwl text-center" style={{width:'50%'}}>LOCAL DELIVERY CONFIRMATION NOTE (LDCN)</td>
                                                    <td style={{width:'7%'}}>
                                                        <p className="m-0 p-0 fontTwl">Date</p>
                                                        <p className="m-0 p-0 fontTwl">Time</p>
                                                        <p className="m-0 p-0 fontTwl">User</p>
                                                    </td>
                                                    <td style={{width:'18%'}}>
                                                        <p className="m-0 p-0 fontTwl">: {dateParse(new Date())}</p>
                                                        <p className="m-0 p-0 fontTwl">: {timeParse(new Date())}</p>
                                                        <p className="m-0 p-0 fontTwl">: {this.props.user}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </Grid>

                                        <Grid item xs={12} className="mt-5">
                                            <table className="w-full">
                                                <tr>
                                                    <td style={{width:'20%'}}></td>
                                                    <td style={{width:'20%'}}></td>
                                                    <td style={{width:'60%',}} className='text-left fontTwl'>STATE PHARMACEUTICALS CORPARATION OF SRI LANKA</td>
                                                </tr>
                                                
                                                <tr>
                                                    <td style={{width:'20%', className:'fontTwl'}}>WDN Number</td>  {/* LDCN Number */}
                                                    <td style={{width:'20%', className:'fontTwl'}}>: {this.props?.data?.wdn_no}</td>
                                                    <td style={{width:'60%',}} className='text-left fontTwl'>75, Sir Baron Jayathilaka Mawwatha,</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:'20%', className:'fontTwl'}}>WDN Date</td>    {/* LDCN Date */}
                                                    <td style={{width:'20%', className:'fontTwl'}}>: {dateParse(this.props?.data?.wdn_date)}</td>
                                                    <td style={{width:'60%',}} className='text-left fontTwl'>P.O. Box 1757,</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:'20%', className:'fontTwl'}}>LDCN Ref No</td>
                                                    <td style={{width:'20%', className:'fontTwl'}}>: {this.props?.data?.ldcn_ref_no}</td>
                                                    <td style={{width:'60%',}} className='text-left fontTwl'>Colombo 01, Sri Lanka(Ceylon).</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:'20%', className:'fontTwl'}}></td>
                                                    <td style={{width:'20%', className:'fontTwl'}}></td>
                                                    <td style={{width:'60%',}} className='text-left fontTwl'>T.P. 0112326227, 0112320356-09</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:'20%', className:'fontTwl'}}>Vessel/Carrier Name</td>
                                                    <td style={{width:'20%', className:'fontTwl'}}>: {this.props?.data?.vessel_no}</td>
                                                    <td style={{width:'60%'}}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:'20%', className:'fontTwl'}}>Voyege/Flight No</td>
                                                    <td style={{width:'20%', className:'fontTwl'}}>:</td>
                                                    <td style={{width:'60%',}} className='text-left fontTwl'>To :</td>
                                                </tr>
                                            </table>
                                        </Grid>

                                        <Grid item xs={12} className="mt-5">
                                            <hr></hr>
                                        </Grid>

                                        <Grid item xs={12} className="mt-5">
                                            <table style={{width:'100%'}}>
                                                <tr>
                                                    <td className='fontTwl' style={{width:'20%'}}>Supplier</td>
                                                    <td className='fontTwl' style={{width:'30%'}}>: {this.props?.data?.Supplier?.name}</td>
                                                    <td className='fontTwl' style={{width:'20%'}}></td>
                                                    <td className='fontTwl' style={{width:'30%'}}></td>
                                                </tr>
                                                <tr>
                                                    <td className='fontTwl' style={{width:'20%'}}>Sup. Address</td>
                                                    <td className='fontTwl' style={{width:'30%'}}>:</td>
                                                    <td className='fontTwl' style={{width:'20%'}}>Invoice No</td>
                                                    <td className='fontTwl' style={{width:'30%'}}>: {this.props?.data?.invoice_no}</td>
                                                </tr>
                                                <tr>
                                                    <td className='fontTwl' style={{width:'20%'}}>Po No</td>
                                                    <td className='fontTwl' style={{width:'30%'}}>: {this.props?.data?.po}</td>
                                                    <td className='fontTwl' style={{width:'20%'}}>Invoice Date</td>
                                                    <td className='fontTwl' style={{width:'30%'}}>: {dateParse(this.props?.data?.invoice_date)}</td>
                                                </tr>
                                                <tr>
                                                    <td className='fontTwl' style={{width:'20%'}}>Indent/PA No</td>
                                                    <td className='fontTwl' style={{width:'30%'}}>: {this.props?.data?.indent_no}</td>
                                                    <td className='fontTwl' style={{width:'20%'}}>Volume(CBM)</td>
                                                    <td className='fontTwl' style={{width:'30%'}}>:</td>
                                                </tr>
                                                <tr>
                                                    <td className='fontTwl' style={{width:'20%'}}>Model of Dispatch</td>
                                                    <td className='fontTwl' style={{width:'30%'}}>:</td>
                                                    <td className='fontTwl' style={{width:'20%'}}>B/L or AWB No </td>
                                                    <td className='fontTwl' style={{width:'30%'}}>:</td>
                                                </tr>
                                            </table>
                                        </Grid>

                                        {/* loop start */}
                                        {this.props.data.ConsignmentItems.map((item,index)=>(
                                        <Fragment key={index}>
                                             {console.log('gdggdgdggdg', item)}
                                            <Grid item xs={12} className="mt-2">
                                                <table style={{width:'100%'}}>
                                                    <tr>
                                                        <td className="fontTwl" style={{fontWeight:'bold', width:'5%'}}>Seq</td>
                                                        <td className="fontTwl" style={{fontWeight:'bold', width:'10%'}}>Item Code</td>
                                                        <td className="fontTwl" style={{fontWeight:'bold', width:'40%'}}>Description</td>
                                                        <td className="fontTwl text-right" style={{fontWeight:'bold', width:'45%'}}>Old SR</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fontTwl" style={{width:'5%'}}>{index+1}</td>
                                                        <td className="fontTwl" style={{width:'10%'}}>{item?.item_schedule?.Order_item?.item?.sr_no}</td>
                                                        <td className="fontTwl" style={{width:'40%'}}>{item?.item_schedule?.Order_item?.item?.name}</td>
                                                        <td className="fontTwl text-right" style={{width:'45%'}}></td>
                                                    </tr>
                                                </table>

                                                <table style={{width:'100%'}}>
                                                    <tr>
                                                        <td className="fontTwl" style={{fontWeight:'bold', width:'35%'}}>Order List No</td>
                                                        <td className="fontTwl" style={{fontWeight:'bold', width:'5%'}}>UOM</td>
                                                        <td className="fontTwl" style={{fontWeight:'bold', width:'20%'}}>Invoice Qty</td>
                                                        <td className="fontTwl" style={{fontWeight:'bold', width:'40%'}}>Packing Details</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fontTwl" style={{width:'35%'}}>{item?.item_schedule?.Order_item?.purchase_order?.order}</td>
                                                        <td className="fontTwl" style={{width:'5%'}}></td>
                                                        <td className="fontTwl" style={{width:'20%'}}>{convertTocommaSeparated(item?.quantity, 2)}</td>
                                                        <td className="fontTwl" style={{width:'40%'}}></td>
                                                    </tr>
                                                </table>

                                                <div>
                                                    <hr style={{border: 'none', borderTop: '1px dotted #000', width: '100%'}}/>
                                                </div>
                                            </Grid>
                                        </Fragment>
                                        ))}
                                        {/* loop end */}
                                        

                                        <Grid item xs={12} className="mt-5">
                                            <table style={{width:'100%'}}>
                                                <tr>
                                                    <td style={{width:'10%'}}>Remarks</td>
                                                    <td style={{width:'60%'}}>:</td>
                                                    <td style={{width:'15%'}}>Total Packages</td>
                                                    <td style={{width:'15%'}}>:</td>
                                                </tr>
                                            </table>
                                            <table style={{width:'100%'}}>
                                                <tr>
                                                    <td style={{width:'30%'}}>Intransist Storage Condition</td>
                                                    <td style={{width:'70%'}}>: 2 &#8451; - 8 &#8451; {'/'} 15 &#8451; - 20 &#8451; {'/ <'} 25 &#8451; {'/'} Normal </td>
                                                </tr>
                                            </table>
                                            {this.props.data.ConsignmentContainers.map((element, id)=>(
                                                <Fragment key={id}>
                                                    <table style={{width:'100%'}}>
                                                        <tr>
                                                            <td style={{width:'15%', fontWeight:'bold'}}>Vehicle No</td>
                                                            <td style={{width:'20%', fontWeight:'bold'}}>Arrival Date Time</td>
                                                            <td style={{width:'25%', fontWeight:'bold'}}>Packs Container No 1</td>
                                                            <td style={{width:'15%', fontWeight:'bold'}}>Container No 2</td>
                                                            <td style={{width:'15%', fontWeight:'bold'}}>Damages</td>
                                                            <td style={{width:'10%', fontWeight:'bold'}}>Shortage</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{width:'15%'}}>{element.Vehicle.reg_no}</td>
                                                            <td style={{width:'20%'}}></td>
                                                            <td style={{width:'25%'}}></td>
                                                            <td style={{width:'15%'}}></td>
                                                            <td style={{width:'15%'}}></td>
                                                            <td style={{width:'10%'}}></td>
                                                        </tr>
                                                    </table>
                                                </Fragment>
                                            ))}

                                            <p className="mt-2"><span style={{fontWeight:'bold'}}>Prepared by:</span> {}</p>
                                        </Grid>

                                        <Grid item xs={12} className="mt-5">
                                            <table style={{width:'100%'}}>
                                                <tr>
                                                    <td style={{width:'33.33%'}}>Date:................</td>
                                                    <td style={{width:'33.33%'}}>Dilivery Person : Name ...............</td>
                                                    <td style={{width:'33.33%'}}>Signature:...............</td>
                                                </tr>
                                            </table>
                                        </Grid>

                                        <Grid item xs={12} className="mt-5">
                                            <hr style={{border: 'none', borderTop: '1px dotted #000', width: '100%'}}/>
                                        </Grid>

                                        <Grid item xs={12} className="mt-5" style={{pageBreakBefore: 'always'}}>
                                            <p className="text-center">For stores use only</p>

                                            <table style={{width:'100%'}}>
                                                <tr>
                                                    <td style={{width:'50%'}}>Received the above goods in good order</td>
                                                    <td className="text-center" style={{width:'50%', borderTop:'1px dotted black',  borderRight:'1px dotted black', borderLeft:'1px dotted black', borderCollapse:'collapse'}}>Following Detaild Are Certified</td>
                                                </tr>
                                            </table>
                                            <table style={{width:'100%'}}>
                                                <tr>
                                                    <td className="fontTwl mt-2" style={{width:'50%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderLeft:'1px dotted black', borderCollapse:'collapse'}}>CTN. No.</td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%'}}>Short</td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderRight:'1px dotted black'}}>Damage</td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%'}}>CTN.No.</td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%'}}>Short</td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderRight:'1px dotted black', borderCollapse:'collapse'}}>Damage</td>
                                                </tr>
                                                <tr>
                                                    <td className="fontTwl mt-2" style={{width:'50%', borderBottom:'1px dotted black'}}>.</td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderLeft:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderRight:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderRight:'1px dotted black'}}></td>
                                                </tr>
                                                <tr>
                                                    <td className="fontTwl mt-2" style={{width:'50%', borderBottom:'1px dotted black'}}>.</td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderLeft:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderRight:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderRight:'1px dotted black'}}></td>
                                                </tr>
                                                <tr>
                                                    <td className="fontTwl mt-2" style={{width:'50%', borderBottom:'1px dotted black'}}>.</td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderLeft:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderRight:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderRight:'1px dotted black'}}></td>
                                                </tr>
                                                <tr>
                                                    <td className="fontTwl mt-2" style={{width:'50%'}}>Date:......................................................AM / PM</td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderLeft:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderRight:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderRight:'1px dotted black'}}></td>
                                                </tr>
                                                <tr>
                                                    <td className="fontTwl mt-2" style={{width:'50%'}}>Name:......................................................</td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderLeft:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderRight:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderRight:'1px dotted black'}}></td>
                                                </tr>
                                                <tr>
                                                    <td className="fontTwl mt-2" style={{width:'50%'}}>Stores No :......................................................</td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderLeft:'1px dotted black'}}>Total</td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderRight:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%'}}>Receiving Officer</td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderRight:'1px dotted black'}}>Delivery Person</td>
                                                </tr>
                                                <tr>
                                                    <td className="fontTwl mt-2" style={{width:'50%'}}>Storekeeper :......................................................</td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderLeft:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderRight:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black'}}></td>
                                                    <td className="fontTwl mt-2" style={{width:'8.33%', borderBottom:'1px dotted black', borderRight:'1px dotted black'}}></td>
                                                </tr>
                                            </table>
                                        </Grid>
                                    
                                    </Grid> 
                                </div>

                            </div>
                        </div>
                    </Grid>
            </div>
        );
    }
}

export default Ldcn
;