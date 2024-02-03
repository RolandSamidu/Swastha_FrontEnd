/*
Loons Lab Wdn
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import { Button, Grid, Typography } from '@material-ui/core'

import { convertTocommaSeparated, dateParse, timeParse } from "utils";


class Wdn extends Component {
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
        console.log('checking inc props wdn', this.props.data)
        console.log('this.state.data?.wdn_no', this.props.data?.wdn_no)
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
    

    .page-break { page-break-after: always, }
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
                        trigger={() => <Button id="print_presc_105" color="primary" size="small" style={{ margin:'0', padding:'0'}}>Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray p-5" >
                        <div className="bg-white p-5" >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                <Grid className="w-full" container>
                                        <Grid container>
                                            <Grid item xs={12} sm={12} lg={12} md={12} style={{ display: "flex", justifyContent: "center" }}>
                                                <div style={{ flex: 1, justifyContent: 'center', alignItems: "center", display: "flex" }}>
                                                    <Typography variant="subtitle1" style={{ textAlign: "center" }}>WHARF DISPATCH NOTE(WDN)</Typography>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: "row" }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div><Typography variant="subtitle1">Date&nbsp;&nbsp;: </Typography></div>
                                                        <div><Typography variant="subtitle1">Time&nbsp;&nbsp;: </Typography></div>
                                                        <div><Typography variant="subtitle1">User&nbsp;&nbsp;: </Typography></div>
                                                        <div><Typography variant="subtitle1">Page&nbsp;: </Typography></div>
                                                    </div>
                                                    <div>
                                                        <div><Typography variant="subtitle1">{dateParse(new Date())}</Typography></div>
                                                        <div><Typography variant="subtitle1">{timeParse(new Date())}</Typography></div>
                                                        <div><Typography variant="subtitle1">{this.props.user ? this.props.user : "Not Available"}</Typography></div>
                                                        <div><Typography variant="subtitle1">{'1'}</Typography></div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={12} lg={12} md={12}>
                                                {/* <Typography variant="subtitle1" style={{ textAlign: "center" }}>
                                                    {hospital?.name ? `${hospital.name}, ${hospital.province} Province, ${hospital.district}` : 'Not Available'}
                                                </Typography> */}
                                                <p style={{textAlign:"center"}}>STATE PHARMACEUTICALS CORPARATION OF SRI LANKA<br/>75, Sir Baron Jayathilaka Mawatha,<br/>P.O. Box 1757,<br/>Colombo 01, Sri Lanka(Ceylon).<br/>T.P. 0112326227,0112320356-09 </p>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <hr style={{borderTop:"1px dashed #000", borderBottom:"1px dashed #000"}} className="mt-2 mb-2"/>
                                            </Grid>
                                            <Grid item sm={12} className="mt-5">
                                                <table style={{width:"100%"}}>
                                                    <tr> 
                                                        <td style={{width:"20%", fontWeight:"bold"}}>WDN No</td>
                                                        {console.log('this.state.data?.wdn_no', this.props.data?.wdn_no)}
                                                        <td style={{width:"30%"}}>: {this.props.data?.wdn_no}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}></td>
                                                        <td style={{width:"30%"}}></td>
                                                    </tr>
                                                    <tr> 
                                                        <td style={{width:"20%", fontWeight:"bold"}}>WDN Date</td>
                                                        <td style={{width:"30%"}}>:{dateParse(this.props.data?.wdn_date)}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}></td>
                                                        <td style={{width:"30%"}}></td>
                                                    </tr>
                                                    <tr> 
                                                        <td style={{width:"20%", fontWeight:"bold"}}>WHARF Ref No</td>
                                                        <td style={{width:"30%"}}>:{this.props.data?.wharf_ref_no}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}></td>
                                                        <td style={{width:"30%"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Vessel/Carrier Name</td>
                                                        <td style={{width:"30%"}}>:{this.props.data?.vessel_no}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>TO</td>
                                                        <td style={{width:"30%"}}>:</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Voyage/Flight No</td>
                                                        <td style={{width:"30%"}}>:{}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}></td>
                                                        <td style={{width:"30%"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Supplier Name</td>
                                                        <td style={{width:"30%"}}>:{this.props.data?.Supplier?.name}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Supplier Address</td>
                                                        <td style={{width:"30%"}}>:{}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Invoice No</td>
                                                        <td style={{width:"30%"}}>:{this.props.data?.invoice_no}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Invoice Date</td>
                                                        <td style={{width:"30%"}}>:{dateParse(this.props.data?.invoice_date)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Indent/PA No</td>
                                                        <td style={{width:"30%"}}>:{this.props.data?.indent_no}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>PO No</td>
                                                        <td style={{width:"30%"}}>:{this.props.data?.po}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Indent/PA No</td>
                                                        <td style={{width:"30%"}}>:{this.props.data?.indent_no}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Volume (CBM)</td>
                                                        <td style={{width:"30%"}}>:{}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Mode of Dispatch</td>
                                                        <td style={{width:"30%"}}>:{}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>B/L or AWB No</td>
                                                        <td style={{width:"30%"}}>:{}</td>
                                                    </tr>
                                                </table>
                                            </Grid>
                                            {this.props.data.ConsignmentItems.map((item,e)=>(
                                            <React.Fragment key={e}>
                                            <Grid item sm={12} className="mt-5">
                                            <Typography variant="body1" style={{fontWeight:"bold", marginTop:"8px", marginBottom:"8px"}}>Item Details</Typography>
                                            <table style={{width:"100%"}}>
                                                <thead>
                                                <tr>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"10%"}}>Seq</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>Item Code</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"30%"}}>Description</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>Strength</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>Old Sr No</td>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td style={{width:"10%"}}>{e+1}</td>
                                                        <td style={{width:"20%"}}>{item?.item_schedule?.Order_item?.item?.sr_no}</td>
                                                        <td style={{width:"30%"}}>{item?.item_schedule?.Order_item?.item?.name}</td>
                                                        <td style={{width:"20%"}}>{}</td>
                                                        <td style={{width:"20%"}}>{}</td>
                                                    </tr>
                                                <tr>
                                                    <td style={{fontWeight:"bold", width:"10%"}}></td>
                                                    <td style={{fontWeight:"bold", width:"25%"}}>Order No</td>
                                                    <td style={{fontWeight:"bold", width:"10%"}}>UOM</td>
                                                    <td style={{fontWeight:"bold", width:"10%"}}>Invoice Qty</td>
                                                    <td style={{fontWeight:"bold", width:"10%"}}>Packing Details</td>
                                                </tr>
                                                    <tr>
                                                        <td style={{width:"10%"}}></td>
                                                        <td style={{width:"20%"}}>{item?.item_schedule?.Order_item?.purchase_order?.order}</td>
                                                        <td style={{width:"30%"}}>{}</td>
                                                        <td style={{width:"20%"}}>{item?.quantity}</td>
                                                        <td style={{width:"20%"}}>{}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            </Grid>
                                            </React.Fragment>
                                            ))}
                                        </Grid>
                                        <Grid item sm={12}>
                                            <hr style={{borderTop: "1px dashed #000", borderBottom:"1px dashed #000"}} className="mt-2 mb-2"/>
                                        </Grid>
                                        <Grid item sm={12} className="mt-2">
                                            <table style={{width:"100%"}}>
                                                <tr>
                                                    <td style={{width:"20%", fontWeight:"bold"}}>Remarks</td>
                                                    <td style={{width:"30%"}}>: {}</td>
                                                    <td style={{width:"20%", fontWeight:"bold"}}>Total Packages</td>
                                                    <td style={{width:"30%"}}>:{}</td>
                                                </tr>
                                            </table>
                                        </Grid>
                                        <Grid item sm={12} className="mt-2">
                                            <table style={{width:"100%"}}>
                                                <tr>
                                                    <td style={{width:"20%", fontWeight:"bold"}}>In Transit Condition</td>
                                                    <td style={{width:"80%"}}>: 2 &#8451; - 8 &#8451; {'/'} 15 &#8451; - 20 &#8451; {'/ <'} 25 &#8451; {'/'} Normal</td>
                                                </tr>
                                            </table>
                                        </Grid>
                                        <Grid item sm={12} className="mt-5">
                                                <Typography variant="body1" style={{fontWeight:"bold", marginTop:"8px", marginBottom:"8px"}}>Item Details</Typography>
                                            <table style={{width:"100%"}}>
                                                <thead>
                                                <tr>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"10%"}}>Vehicle No</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Date</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Time</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Packs Container No 1</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Packs Container No 2</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Damages</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Shortages</td>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td style={{width:"10%"}}>{}</td>
                                                    <td style={{width:"15%"}}>{}</td>
                                                    <td style={{width:"15%"}}>{}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            </Grid>
                                        <Grid item sm={12} className="mt-2">
                                            <div style={{display:"flex", flexDirection:"row"}}>
                                                <div style={{flex: 1}}>
                                                    <Typography variant="body1">Prepared By :</Typography>
                                                </div>
                                                <div style={{flex: 2}}>
                                                    <Typography variant="body1">Pradeepa</Typography>
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item sm={12} className="mt-2">
                                            <table style={{width:"100%"}}>
                                                <tr>
                                                    <td style={{width:"50%", textAlign:"center"}}>...........................</td>
                                                    <td style={{width:"50%", textAlign:"center"}}>...........................</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:"50%", textAlign:"center"}}>Lorry Cleaner</td>
                                                    <td style={{width:"50%", textAlign:"center"}}>WHARF Clerk</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:"50%", textAlign:"center"}}></td>
                                                    <td style={{width:"50%", textAlign:"center"}}>...........................</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:"50%", textAlign:"center"}}></td>
                                                    <td style={{width:"50%", textAlign:"center"}}>Name</td>
                                                </tr>
                                            </table>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <hr style={{borderTop: "1px dashed #000", borderBottom:"1px dashed #000"}} className="mt-2 mb-2"/>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <Typography variant="body1" align="center">For Stores Use Only</Typography>
                                            <Grid container spacing={2}>
                                                <Grid item sm={6}>
                                                    <p>Received the above goods in good order ............</p>
                                                    <p>...............................................................</p>
                                                    <p>...............................................................</p>
                                                    <p>..........................................................AM/PM</p>
                                                    <p>Name : ........................................................</p>
                                                    <p>Store No : ....................................................</p>
                                                    <p>Store Keeper : ................................................</p>
                                                </Grid>
                                                <Grid item sm={6}>
                                                    <Typography variant="body1" align="center">Following Details Are Certified</Typography>
                                                    <div style={{display:"flex", flexDirection:"row", border:"1px dashed #000"}}>
                                                        <div style={{flex: 1, borderRight:"1px dashed #000"}}>
                                                            <table style={{width:"100%"}}>
                                                                <thead>
                                                                <tr>
                                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"33.3%"}}>CTN No</td>
                                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"33.3%"}}>Shortage</td>
                                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"33.3%"}}>Damage</td>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                <tr>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                </tr>
                                                                <br/>
                                                                <tr>
                                                                    <td style={{width:"33.3%"}}>Total</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div style={{flex: 1}}>
                                                            <table style={{width:"100%"}}>
                                                                <thead>
                                                                <tr>
                                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"33.3%"}}>CTN No</td>
                                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"33.3%"}}>Shortage</td>
                                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"33.3%"}}>Damage</td>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                <tr>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                </tr>
                                                                <br/>
                                                                <tr>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                    <td style={{width:"33.3%"}}></td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>............</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>SK</td>
                                                                    <td style={{width:"33.3%"}}></td>
                                                                    <td style={{width:"33.3%", textAlign:"center"}}>WHARF Clerk</td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </Grid>
                                            </Grid>
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

export default Wdn
;