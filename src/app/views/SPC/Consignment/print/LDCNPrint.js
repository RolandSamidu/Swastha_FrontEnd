import React, { Fragment, Component } from "react";
import { Button, Grid, Typography } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import PrescriptionService from "app/services/PrescriptionService";
import { convertTocommaSeparated, dateParse, timeParse } from "utils";
import PrintIcon from '@mui/icons-material/Print';

class LDCNPrint extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            POData: {},
            ItemData: {},
            loaded: false
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


    render() {


        const {
            purchaseOrderData, POData, ItemData,
            hospital,
            umo,
            user
        } = this.props;
        console.log("heel", purchaseOrderData)
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
            <div style={{ display: "none" }}>
                <Grid className="w-full justify-end items-end flex hidden ">
                    <ReactToPrint
                        trigger={() => <Button id="ldcn_print" color="primary" size="small" style={{ margin: '0', padding: '0' }}>Print</Button>}
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
                                            <div style={{ flex: 1, justifyContent: 'center', alignItems: "center", display: "flex" }}></div>
                                            <div style={{ display: 'flex', flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ margin: 0 }}><p style={{ margin: 0, fontSize: 10, fontWeight: "bold" }}>Date&nbsp;&nbsp;: </p></div>
                                                    <div style={{ margin: 0 }}><p style={{ margin: 0, fontSize: 10, fontWeight: "bold" }}>Time&nbsp;&nbsp;: </p></div>
                                                    <div style={{ margin: 0 }}><p style={{ margin: 0, fontSize: 10, fontWeight: "bold" }}>User&nbsp;&nbsp;: </p></div>
                                                    {/* <div style={{margin: 0}}><p style={{margin: 0, fontSize: 10, fontWeight: "bold"}}>Page&nbsp;: </p></div> */}
                                                </div>
                                                <div>
                                                    <div style={{ margin: 0 }}><p style={{ margin: 0, fontSize: 10 }}>{dateParse(new Date())}</p></div>
                                                    <div style={{ margin: 0 }}><p style={{ margin: 0, fontSize: 10 }}>{timeParse(new Date())}</p></div>
                                                    <div style={{ margin: 0 }}><p style={{ margin: 0, fontSize: 10 }}>{user ? user.name : "N/A"}</p></div>
                                                    {/* <div style={{margin: 0}}><p style={{margin: 0, fontSize: 10}}>{'1'}</p></div> */}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={12} lg={12} md={12}>
                                            <p style={{ textAlign: "center", fontSize: 10, fontWeight: "bold" }}>LOCAL DELIVERY CONFIRMATION NOTE (LDCN)</p>
                                        </Grid>
                                        <Grid item sm={12} className="mt-2">
                                            <Grid container spacing={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Grid item sm={4}>
                                                    <table style={{ width: "100%", fontSize: 10, }}>
                                                        <tr>
                                                            <td style={{ width: "40%", fontWeight: "bold" }}>LDCN No</td>
                                                            <td style={{ width: "60%" }}>:{purchaseOrderData?.wdn_no ? purchaseOrderData?.wdn_no : "N/A"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ width: "40%", fontWeight: "bold" }}>LDCN Date</td>
                                                            <td style={{ width: "60%" }}>:{purchaseOrderData?.ldcn_date ? dateParse(purchaseOrderData?.ldcn_date) : "N/A"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ width: "40%", fontWeight: "bold" }}>Shipment No</td>
                                                            <td style={{ width: "60%" }}>:{purchaseOrderData?.ldcn_ref_no ? purchaseOrderData?.ldcn_ref_no : "N/A"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ width: "40%", fontWeight: "bold", fontSize: 10, }}>WHARF REF No</td>
                                                            <td style={{ width: "60%", fontSize: 10, }}>:{purchaseOrderData?.shipment_no ? purchaseOrderData?.shipment_no : "N/A"}</td>
                                                        </tr>
                                                    </table>
                                                </Grid>
                                                <Grid item sm={8}>
                                                    <p style={{ textAlign: "center", fontSize: 10, }}>STATE PHARMACEUTICALS CORPARATION OF SRI LANKA<br />16th FLOOR, MEHEWARA PIYASA BUILDING,<br />NO. 41, KIRULA ROAD,<br />COLOMBO 05, SRI LANKA<br />T.P. +94-11-2335374, +94-11-2326227, +94-11-2320256-9</p>
                                                </Grid>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <table style={{ width: "100%", fontSize: 10, }}>
                                                    <tr>
                                                        <td style={{ width: "20%", fontWeight: "bold" }}>Vessel/Carrier Name</td>
                                                        <td style={{ width: "30%" }}>: {purchaseOrderData?.ConsigmentVesselData?.[0]?.flight_name ? purchaseOrderData?.ConsigmentVesselData?.[0]?.flight_name : ""}</td>
                                                        <td style={{ width: "20%", fontWeight: "bold" }}>TO</td>
                                                        <td style={{ width: "30%" }}>:</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "20%", fontWeight: "bold" }}>Voyage/Flight No</td>
                                                        <td style={{ width: "30%" }}>:{purchaseOrderData?.ConsigmentVesselData?.[0]?.flight_no ? purchaseOrderData?.ConsigmentVesselData?.[0]?.flight_no : ""}</td>
                                                        <td style={{ width: "20%", fontWeight: "bold" }}></td>
                                                        <td style={{ width: "30%" }}></td>
                                                    </tr>
                                                </table>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <hr style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000" }} className="mt-2 mb-2" />
                                            </Grid>
                                            <table style={{ width: "100%", fontSize: 10, }}>
                                                <tr>
                                                    <td style={{ width: "20%", fontWeight: "bold" }}>Supplier</td>
                                                    <td style={{ width: "30%" }}>:{purchaseOrderData?.Supplier?.name}</td>
                                                    <td style={{ width: "20%", fontWeight: "bold" }}></td>
                                                    <td style={{ width: "30%" }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: "20%", fontWeight: "bold" }}>Supplier Address</td>
                                                    <td style={{ width: "30%" }}>:{purchaseOrderData?.Supplier?.address ? purchaseOrderData?.Supplier?.address : ""}</td>
                                                    <td style={{ width: "20%", fontWeight: "bold" }}>Invoice No</td>
                                                    <td style={{ width: "30%" }}>:{purchaseOrderData?.invoice_no}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: "20%", fontWeight: "bold" }}>PO No</td>
                                                    <td style={{ width: "30%" }}>:{purchaseOrderData?.po_no}</td>
                                                    <td style={{ width: "20%", fontWeight: "bold" }}>Invoice Date</td>
                                                    <td style={{ width: "30%" }}>:{purchaseOrderData?.invoice_date ? dateParse(purchaseOrderData?.invoice_date) : "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: "20%", fontWeight: "bold" }}>Indent/PA No</td>
                                                    <td style={{ width: "30%" }}>:{POData?.indent_no}</td>
                                                    <td style={{ width: "20%", fontWeight: "bold" }}>Volume (CBM)</td>
                                                    <td style={{ width: "30%" }}>:{ }</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: "20%", fontWeight: "bold" }}>Mode of Dispatch</td>
                                                    <td style={{ width: "30%" }}>:{POData?.mode_of_dispatch ? POData?.mode_of_dispatch : ""}</td>
                                                    <td style={{ width: "20%", fontWeight: "bold" }}>B/L or AWB No</td>
                                                    <td style={{ width: "30%" }}>:{purchaseOrderData?.ConsigmentVesselData?.[0]?.bl_no ? purchaseOrderData?.ConsigmentVesselData?.[0]?.bl_no : ""}</td>
                                                </tr>
                                            </table>
                                        </Grid>
                                        <React.Fragment>
                                            <Grid item sm={12} className="mt-2">
                                                <table style={{ width: "100%", fontSize: 10, }}>
                                                    <thead>
                                                        <tr>
                                                            <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "10%" }}>Seq</td>
                                                            <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "25%" }}>Item Code</td>
                                                            <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "30%" }}>Description</td>
                                                            <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "10%" }}>Strength</td>
                                                            <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "25%" }}>Old Sr No</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(ItemData) && ItemData.filter(item => item.selected).map((item, i) => (
                                                            <>
                                                                <tr style={{ margin: 0 }}>
                                                                    <td style={{ width: "10%" }}>{i + 1}</td>
                                                                    <td style={{ width: "25%" }}>{item?.SPCPOItem?.ItemSnap?.sr_no}</td>
                                                                    <td style={{ width: "30%" }}>{item?.SPCPOItem?.ItemSnap?.medium_description}</td>
                                                                    <td style={{ width: "10%" }}>{item?.SPCPOItem?.ItemSnap?.strength}</td>
                                                                    <td style={{ width: "25%" }}>{item?.SPCPOItem?.previous_sr}</td>
                                                                </tr>
                                                                <tr style={{ margin: 0 }}>
                                                                    <td style={{ width: "10%" }}></td>
                                                                    <td style={{ width: "25%", fontWeight: "bold" }}>Order No</td>
                                                                    <td style={{ width: "30%", fontWeight: "bold" }}>Invoice Qty</td>
                                                                    <td style={{ width: "10%", fontWeight: "bold" }}>UOM</td>
                                                                    <td style={{ width: "25%", fontWeight: "bold" }}>Packing Details</td>
                                                                </tr>
                                                                <tr style={{ margin: 0 }}>
                                                                    <td style={{ width: "10%" }}></td>
                                                                    <td style={{ width: "25%" }}>{item?.SPCPOItem?.MSDPurchaseOrder?.order_no}</td>
                                                                    <td style={{ width: "10%" }}>{item?.transit_quantity}</td>
                                                                    <td style={{ width: "30%" }}>{item?.SPCPOItem?.unit_type}</td>
                                                                    <td style={{ width: "25%" }}>{`${POData?.SPCPOItems.filter(res => res?.id === item.spc_po_item_id).map(item => item?.SPCPOPackDetails.map(item => item?.pack_size).join(' X '))}`}</td>
                                                                </tr>
                                                            </>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </Grid>
                                        </React.Fragment>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <hr style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000" }} className="mt-2 mb-2" />
                                    </Grid>
                                    <Grid item sm={12} className="mt-2">
                                        <table style={{ width: "100%", fontSize: 10 }}>
                                            <tr>
                                                <td style={{ width: "20%", fontWeight: "bold" }}>Remarks</td>
                                                <td style={{ width: "30%" }}>:{purchaseOrderData?.remark}</td>
                                                <td style={{ width: "20%", fontWeight: "bold" }}>Total Packages</td>
                                                <td style={{ width: "30%" }}>:{purchaseOrderData?.ConsigmentVesselData?.[0]?.total_packages ? purchaseOrderData?.ConsigmentVesselData?.[0]?.total_packages : ""}</td>
                                            </tr>
                                        </table>
                                    </Grid>
                                    <Grid item sm={12} className="mt-2">
                                        <table style={{ width: "100%", fontSize: 10, }}>
                                            <tr>
                                                <td style={{ width: "20%", fontWeight: "bold" }}>In Transit Condition</td>
                                                <td style={{ width: "80%" }}>:{"2°C - 8°C / 15°C - 20°C / < 25°C / Normal"}</td>
                                            </tr>
                                        </table>
                                    </Grid>
                                    {/* <Grid item sm={12} className="mt-5">
                                                <Typography variant="body1" style={{fontWeight:"bold", marginTop:"8px", marginBottom:"8px"}}>Delivery Details</Typography>
                                            <table style={{width:"100%"}}>
                                                <thead>
                                                <tr>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"10%"}}>Vehicle No</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Date</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Time</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Container No</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Container Type</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Damages</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Shortages</td>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                            </table>
                                            </Grid> */}
                                    {purchaseOrderData?.status === "COMPLETED" &&
                                        <Grid item sm={12} className="mt-2">
                                            <table style={{ width: "100%", fontSize: 10, }}>
                                                <tr>
                                                    <td style={{ width: "30%", fontWeight: "bold" }}>Remark</td>
                                                    <td style={{ width: "70%" }}>:{purchaseOrderData?.ConsignmentContainers?.[0]?.remark ? purchaseOrderData?.ConsignmentContainers?.[0]?.remark : ""}</td>
                                                </tr>
                                            </table>
                                        </Grid>
                                    }
                                    <Grid item sm={12} className="mt-2" style={{ pageBreakInside: 'avoid' }}>
                                        <table style={{ width: "100%", fontSize: 10, }}>
                                            <tr>
                                                <td style={{ width: "33.3%", textAlign: "center" }}>..........................</td>
                                                <td style={{ width: "33.3%", textAlign: "center" }}>..........................</td>
                                                <td style={{ width: "33.3%", textAlign: "center" }}>..........................</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: "33.3%", textAlign: "center" }}>Date</td>
                                                <td style={{ width: "33.3%", textAlign: "center" }}>Delivery Person Name</td>
                                                <td style={{ width: "33.3%", textAlign: "center" }}>Signature</td>
                                            </tr>
                                        </table>
                                    </Grid>
                                    <Grid item sm={12} className="mt-2">
                                        <table style={{ width: "100%", fontSize: 10, }}>
                                            <tr style={{ fontSize: 10, }}>
                                                <td style={{ width: "20%", textAlign: "center", fontWeight: "bold" }}>Prepared By: </td>
                                                <td style={{ width: "30%", textAlign: "left" }}>{purchaseOrderData ? purchaseOrderData?.Create?.name : "N/A"}</td>
                                                <td style={{ width: "20%", textAlign: "center", fontWeight: "bold" }}>Approved By: </td>
                                                <td style={{ width: "30%", textAlign: "left" }}>{purchaseOrderData ? ((purchaseOrderData?.approvalData && ["Draft", "Pending", 'New'].includes(purchaseOrderData?.status) == false) ? (purchaseOrderData?.approvalData?.Employee ? purchaseOrderData?.approvalData?.Employee.name : "") : 'N/A') : "N/A"}</td>
                                            </tr>
                                        </table>
                                        {/* <div style={{display:"flex", flexDirection:"row"}}>
                                                <div style={{flex: 1}}>
                                                    <Typography variant="body1" style={{fontSize: 10,}}>Prepared By :</Typography>
                                                </div>
                                                <div style={{flex: 2}}>
                                                    <Typography variant="body1" style={{fontSize: 10,}}>{user?.name ? user?.name: "N/A"}</Typography>
                                                </div>
                                            </div> */}
                                    </Grid>
                                    <Grid item sm={12} style={{ pageBreakInside: 'avoid' }}>
                                        <table style={{ width: "100%", fontSize: 10, }}>
                                            <tr>
                                                <td style={{ width: "50%", textAlign: "center" }}>...........................</td>
                                                <td style={{ width: "50%", textAlign: "center" }}>...........................</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: "50%", textAlign: "center" }}>Name</td>
                                                <td style={{ width: "50%", textAlign: "center" }}>WHARF Clerk</td>
                                            </tr>
                                            {/* <tr>
                                                    <td style={{width:"50%", textAlign:"center"}}></td>
                                                    <td style={{width:"50%", textAlign:"center"}}>...........................</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:"50%", textAlign:"center"}}></td>
                                                    <td style={{width:"50%", textAlign:"center"}}>Name</td>
                                                </tr> */}
                                        </table>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <hr style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000" }} className="mt-2 mb-2" />
                                    </Grid>
                                    <Grid item sm={12} style={{ pageBreakInside: 'avoid', fontSize: 10, }}>
                                        <Typography variant="body1" align="center" style={{ fontSize: 10, }}>For Stores Use Only</Typography>
                                        <Grid container spacing={2} >
                                            <Grid item sm={5}>
                                                <p>Received the above goods in good order</p>
                                                <p>.......................................................................</p>
                                                <p>.......................................................................</p>
                                                <p>..........................................................AM/PM</p>
                                                <p>Name : ..........................................................</p>
                                                <p>Store No : .....................................................</p>
                                                <p>Store Keeper : ..............................................</p>
                                            </Grid>
                                            <Grid item sm={7}>
                                                <Typography variant="body1" align="center" style={{ fontSize: 10, }}>Following Details Are Certified</Typography>
                                                <div style={{ display: "flex", flexDirection: "row", border: "1px dashed #000" }}>
                                                    <div style={{ flex: 1, borderRight: "1px dashed #000" }}>
                                                        <table style={{ width: "100%", fontSize: 10, }}>
                                                            <thead>
                                                                <tr>
                                                                    <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "33.3%" }}>CTN No</td>
                                                                    <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "33.3%" }}>Shortage</td>
                                                                    <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "33.3%" }}>Damage</td>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr style={{ height: "2px" }}>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                </tr>
                                                                <tr style={{ height: "2px" }}>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                </tr>
                                                                <tr style={{ height: "2px" }}>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                </tr>
                                                                <tr style={{ height: "2px" }}>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                </tr>
                                                                <tr style={{ height: "2px" }}>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>Total</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <table style={{ width: "100%", fontSize: 10, }}>
                                                            <thead>
                                                                <tr>
                                                                    <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "33.3%" }}>CTN No</td>
                                                                    <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "33.3%" }}>Shortage</td>
                                                                    <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "33.3%" }}>Damage</td>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr style={{ height: "2px" }}>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                </tr>
                                                                <tr style={{ height: "2px" }}>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                </tr>
                                                                <tr style={{ height: "2px" }}>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                </tr>
                                                                <tr style={{ height: "2px" }}>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                </tr>
                                                                <tr style={{ height: "2px" }}>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                </tr>
                                                                <tr style={{ height: "2px" }}>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                    <td style={{ width: "33.3%" }}></td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>............</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>Receiving Officer</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}></td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>Delivery Person</td>
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

export default LDCNPrint;