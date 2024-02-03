import React, { Fragment, Component } from "react";
import { Button, Grid, Typography } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import PrescriptionService from "app/services/PrescriptionService";
import { convertTocommaSeparated, dateParse, timeParse } from "utils";
import PrintIcon from '@mui/icons-material/Print';

class LpPrint extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.purchaseOrderData,
        }
    }

    static propTypes = {
        header: any,
        footer: any,
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
        console.log("Data :", this.props.uom)
    }

    render() {
        const {
            hospital,
            supplier,
            umo,
            user
        } = this.props;
        /*  size: 297mm 420mm, */
        const pageStyle = `

        
 
 @page {
    
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
  }
`; 


        return (
            <div className="hidden">
                <Grid className="w-full justify-end items-end flex hidden ">
                    <ReactToPrint
                        trigger={() => <Button id="lp_print_view" color="primary" size="small" style={{ margin:'0', padding:'0'}}>Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray p-5 hidden" >
                        <div className="bg-white p-5" >
                            <div>
                                <div ref={(el) => (this.componentRef = el)} > 
                                    <Grid className="w-full" container>
                                        <Grid container>
                                            <Grid item xs={12} sm={12} lg={12} md={12} style={{ display: "flex", justifyContent: "center" }}>
                                                <div style={{ flex: 1, justifyContent: 'center', alignItems: "center", display: "flex" }}>
                                                    <Typography variant="subtitle1" style={{ textAlign: "center", fontWeight: 'bold'}}>Local Purchase Request</Typography>
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
                                                        <div><Typography variant="subtitle1">{user ? user.name : "Not Available"}</Typography></div>
                                                        <div><Typography variant="subtitle1">{'1'}</Typography></div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={12} lg={12} md={12}>
                                                <Typography variant="subtitle1" style={{ textAlign: "center" }}>
                                                    {hospital?.name ? `${hospital.name}  -  ${hospital.district}` : 'Not Available'}
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <hr/>
                                            </Grid>
                                            <Grid item sm={12} className="mt-5">
                                                <table style={{width:"100%"}}>
                                                    <tr> 
                                                        <td style={{width:"20%", fontWeight:"bold"}}>LP Request No</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.request_id? this.state.data?.request_id : "Not Available"}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Required Date</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.required_date ? dateParse(this.state.data?.required_date): "Not Available"}</td>
                                                    </tr>
                                                    {/* <Typography variant="body1" style={{fontWeight:"bold", marginTop:"8px", marginBottom:"8px"}}>Supplier Details</Typography>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>NIC</td>
                                                        <td style={{width:"30%"}}>:{supplier?.nic}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Name</td>
                                                        <td style={{width:"30%"}}>:{supplier?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Address</td>
                                                        <td style={{width:"30%"}}>:{supplier?.address}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Email</td>
                                                        <td style={{width:"30%"}}>:{supplier?.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Contact No</td>
                                                        <td style={{width:"30%"}}>:{supplier?.contact_no}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>GRN ID</td>
                                                        <td style={{width:"30%"}}>:{this.state.consignmentData?.grn_no}</td>
                                                    </tr>
                                                    <Typography variant="body1" style={{fontWeight:"bold", marginTop:"8px", marginBottom:"8px"}}>Delivery Details</Typography>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Delivery Address</td>
                                                        <td style={{width:"30%"}}>:{hospital?.name ? hospital?.name : 'Not Available'}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Ward Name</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.Pharmacy_drugs_store ? this.state.data?.Pharmacy_drugs_store?.short_reference: 'Not Available'}</td>
                                                    </tr> */}
                                                </table>
                                            </Grid>
                                            <React.Fragment>
                                            <Grid item sm={12} className="mt-5">
                                                <Typography variant="body1" style={{fontWeight:"bold", marginTop:"8px", marginBottom:"8px"}}>Item Details</Typography>
                                            <table style={{width:"100%"}}>
                                                <thead>
                                                <tr>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>Sr No</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"40%"}}>Description</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>UOM</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>Qty</td>
                                                    {/* <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"10%"}}>Strength</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"10%"}}>Unit Price</td> 
                                                    
                                                    {/* <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>Total</td> */}
                                                    {/* <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"25%"}}>Description</td> */}
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td style={{width:"20%"}}>{this.state.data?.ItemSnap?.sr_no ? this.state.data?.ItemSnap?.sr_no : 'New Item'}</td>
                                                    <td style={{width:"40%"}}>{this.state.data?.ItemSnap?.short_description ? this.state.data?.ItemSnap?.short_description : this.state.data?.item_name}</td>
                                                    {/* <td style={{width:"10%"}}>{this.state.data?.ItemSnap?.strength}</td> */}
                                                    {/* <td style={{width:"20%"}}>{umo ? umo : "NOS"}</td> */}
                                                    {/* <td style={{width:"10%"}}>{this.state.data?.unit_price}</td> */}
                                                    {console.log('checking uom data', this.props.uom)}
                                                    <td style={{width:"20%"}}>{this.props.uom?.UOM?.name}</td>
                                                    <td style={{width:"20%"}}>{this.state.data?.required_quantity}</td>
                                                    {/* <td style={{width:"20%"}}>{this.state.data?.cost}</td> */}
                                                    {/* <td style={{width:"25%"}}>{this.state.data?.ItemSnap?.Serial?.Group?.description}</td> */}
                                                </tr>
                                                </tbody>
                                            </table>
                                            </Grid>
                                            </React.Fragment>
                                        </Grid>

                                        <Grid item xs={12} sm={12} lg={12} md={12} className="mt-3">
                                            <Typography style={{fontWeight:"bold"}}>Medium Description :</Typography>
                                            <Typography style={{ marginLeft: "12px" }}>{this.state.data?.ItemSnap?.medium_description}</Typography>
                                        </Grid>
                                        {/* {this.state.data?.Patient &&  */}
                                        <Grid item sm={12} className="mt-5">
                                                <table style={{width:"100%"}}>
                                                    <Typography variant="body1" style={{fontWeight:"bold", marginTop:"8px", marginBottom:"8px"}}>Patient Details</Typography>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>PHN</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.Patient?.phn ? this.state.data?.Patient?.phn : this.state.data?.phn }</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>NIC</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.Patient?.nic ? this.state.data?.Patient?.nic : this.state.data?.nic }</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Name</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.Patient?.name ? this.state.data?.Patient?.title + " " + this.state.data?.Patient?.name : this.state.data?.patient_name }</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>DOB</td>
                                                        <td style={{width:"30%"}}>:{dateParse(this.state.data?.Patient?.date_of_birth)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Address</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.Patient?.address}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Contact No</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.Patient?.contact_no}</td>
                                                    </tr>
                                                </table>
                                            </Grid>
                                        {/* } */}
                                        <Grid container spacing={2}>
                                            <Grid className="mt-5" item sm={12}>
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{width:"20%"}}>Justification</td>
                                                        <td style={{width:"80%"}}>:{this.state.data?.justification}</td>
                                                    </tr>
                                                    {/* <tr className="mt-5">
                                                        <td style={{textAlign:"center", width:"50%", fontWeight:"bold"}}>{this.state.data?.required_quantity+" x "+ this.state.data?.unit_price +" = "+this.state.data?.cost}</td>
                                                        <td style={{textAlign:"center", width:"50%", fontWeight:"bold"}}>{this.state.data?.status}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign:"center", width:"50%", fontWeight:"bold"}}>Total Cost</td>
                                                        <td style={{textAlign:"center", width:"50%", fontWeight:"bold"}}>Status</td>
                                                    </tr> */}
                                                </table>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            {/* <Grid className="mt-5" item sm={12}>
                                                <Typography>Requested By : {user ? user?.name : "Not Available"}</Typography>
                                            </Grid> */}
                                            <Grid className="mt-5" item sm={12}>
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{textAlign:"center", width:"33.33%"}}>.................................................</td>
                                                        <td style={{textAlign:"center", width:"33.33%"}}>.................................................</td>
                                                        <td style={{textAlign:"center", width:"33.33%"}}>.................................................</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign:"center", width:"33.33%", fontWeight:"bold"}}><p className="m-0 p-0">Requested By </p> Drug Store Pharmacist/ Radiographer/MLT</td>
                                                        <td style={{textAlign:"center", width:"33.33%", fontWeight:"bold"}}><p className="m-0 p-0">Recommended by </p>SP/ CP/ SMLT/ S. Radiographer</td>
                                                        <td style={{textAlign:"center", width:"33.33%", fontWeight:"bold"}}><p className="m-0 p-0">Approved by </p>Head of the institution.</td>
                                                    </tr>
                                                </table>
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

export default LpPrint;