import React, { Fragment, Component } from "react";
import { Button, Grid, Typography } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import PrescriptionService from "app/services/PrescriptionService";
import { convertTocommaSeparated, dateParse, timeParse } from "utils";
import PrintIcon from '@mui/icons-material/Print';

class GRNPrintView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            consignmentData: this.props.consignmentData,
            data: this.props.grnData, 
            grnId:null
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
        console.log("Data :", this.props.grnData)
        console.log("consignmentDataconsignmentDataconsignmentData :", this.props.consignmentData)
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
            <div>
                <Grid className="w-full justify-end items-end flex hidden ">
                    <ReactToPrint
                        trigger={() => <Button id="grn_print_view" color="primary" size="small" style={{ margin:'0', padding:'0'}}>Print</Button>}
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
                                                    <Typography variant="subtitle1" style={{ textAlign: "center" }}>Good Receiving Note</Typography>
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
                                                    {hospital?.name ? `${hospital.name}, ${hospital.province} Province, ${hospital.district}` : 'Not Available'}
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <hr/>
                                            </Grid>
                                            <Grid item sm={12} className="mt-5">
                                                <table style={{width:"100%"}}>
                                                    <tr> 
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Order Date</td>
                                                        <td style={{width:"30%"}}>:{this.state.consignmentData?.Consignment?.delivery_date ? dateParse(this.state.consignmentData?.Consignment?.delivery_date): "Not Available"}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>LP ID</td>
                                                        <td style={{width:"30%"}}>:{this.state.consignmentData?.Consignment?.order_no ? this.state.consignmentData?.Consignment?.order_no : "Not Available"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>PO No</td>
                                                        <td style={{width:"30%"}}>:{this.state.data[0]?.GRN?.Consignment?.po ? this.state.data[0]?.GRN?.Consignment?.po : "Not Available"}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Invoice No</td>
                                                        <td style={{width:"30%"}}>:{this.state.data[0]?.GRN?.Consignment?.invoice_no ? this.state.data[0]?.GRN?.Consignment?.invoice_no : "Not Available"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Supplier Name</td>
                                                        <td style={{width:"30%"}}>:{supplier.name}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Delivery Address</td>
                                                        <td style={{width:"30%"}}>:{hospital?.name ? hospital.name : 'Not Available'}</td>
                                                    </tr>
                                                    
                                                    <tr>
                                                        {/* <td style={{width:"20%", fontWeight:"bold"}}>Supplier Reg No</td>
                                                        <td style={{width:"30%"}}>:{supplier.registartion_no}</td> */}
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Supplier Address</td>
                                                        <td style={{width:"30%"}}>:{supplier.address}</td>
                                                    </tr>
                                                    {/* <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Supplier Email</td>
                                                        <td style={{width:"30%"}}>:{supplier.email}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Supplier Contact No</td>
                                                        <td style={{width:"30%"}}>:{supplier.contact_no}</td>
                                                    </tr> */}
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>GRN ID</td>
                                                        <td style={{width:"30%"}}>:{this.state.consignmentData?.grn_no}</td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                </table>
                                            </Grid>

                                            {this.state.data?.map((element, id) => (
                                            <React.Fragment key={id}>
                                            <>
                                            <Grid item sm={12} className="mt-5">
                                            <table style={{width:"100%"}}>
                                            {id === 0 && (
                                                <tr>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"5%"}}>Seq No.</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>Item Code</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"30%"}}>Description</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"30%"}}>Strength</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>UOM</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"25%"}}>Receiving Qty</td>
                                                </tr>
                                            )}
                                                <tr>
                                                    <td style={{width:"5%"}}>{id+1}</td>
                                                    <td style={{width:"20%"}}>{element?.ItemSnapBatch?.ItemSnap?.sr_no}</td>
                                                    <td style={{width:"30%"}}>{element?.ItemSnapBatch?.ItemSnap?.medium_description}</td>
                                                    <td style={{width:"30%"}}>{element?.ItemSnapBatch?.ItemSnap?.strength}</td>
                                                    <td style={{width:"20%"}}>{element?.uom?.name ? element?.uom?.name : 'N/A'}</td>
                                                    <td style={{width:"25%"}}>{element?.quantity}</td>
                                                </tr>
                                                <tr>
                                                    
                                                    <td style={{width:"5%"}}></td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>Batch</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>Expiry Date</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>Qty</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Pack Size</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>Assu. Type</td>
                                                </tr>
                                                <tr>
                                                    
                                                    <td style={{width:"5%"}}></td>
                                                    <td style={{width:"20%"}}>{element?.ConsignmentItemBatch?.batch_no}</td>
                                                    <td style={{width:"20%"}}>{dateParse(element?.ItemSnapBatch?.exd)}</td>
                                                    <td style={{width:"20%"}}>{element?.ConsignmentItemBatch?.quantity}</td>
                                                    <td style={{width:"15%"}}>{element?.ItemSnapBatch?.pack_size}</td>
                                                    <td style={{width:"20%"}}></td>
                                                </tr>
                                            </table>
                                            </Grid>
                                            </>
                                            </React.Fragment>
                                            ))}
                                        </Grid>
                                        <Grid container>
                                            <Grid className="mt-15" item sm={12}>
                                                <Typography>Prepared By : {user ? user?.name : "Not Available"}</Typography>
                                            </Grid>
                                            <Grid className="mt-15" item sm={12}>
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{textAlign:"center", width:"50%"}}>.............................</td>
                                                        <td style={{textAlign:"center", width:"50%"}}>.............................</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign:"center", width:"50%", fontWeight:"bold"}}>Checked By</td>
                                                        <td style={{textAlign:"center", width:"50%", fontWeight:"bold"}}>Approved By</td>
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

export default GRNPrintView;