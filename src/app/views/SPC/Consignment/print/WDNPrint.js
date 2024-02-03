import React, { Fragment, Component } from "react";
import { Button, Grid, Typography } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import PrescriptionService from "app/services/PrescriptionService";
import { convertTocommaSeparated, dateParse, timeParse } from "utils";
import PrintIcon from '@mui/icons-material/Print';

class WDNPrint extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.purchaseOrderData,
            POData: this.props.POData,
            ItemData: this.props.ItemData,
            deliveryData: this.props.deliveryData
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
        const { purchaseOrderData, POData, ItemData, deliveryData } = this.props
        console.log("Consignment Data :", purchaseOrderData)
        console.log("PO Data :", POData)
        console.log("Item Data :", ItemData)
        console.log("Delivery Data :", deliveryData)
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
            <div style={{ display: "none" }}>
                <Grid className="w-full justify-end items-end flex hidden ">
                    <ReactToPrint
                        trigger={() => <Button id="wdn_print" color="primary" size="small" style={{ margin: '0', padding: '0' }}>Print</Button>}
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
                                                    <div style={{ margin: 0 }}><p style={{ margin: 0, fontSize: 10 }}>{this.state.POData?.Approved ? this.state.POData?.Approved?.name : 'N/A'}</p></div>       {/*{user ? user.name : "N/A"}*/}
                                                    {/* <div style={{margin: 0}}><p style={{margin: 0, fontSize: 10}}>{'1'}</p></div> */}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={12} lg={12} md={12}>
                                            <p style={{ textAlign: "center", fontSize: 10, fontWeight: "bold" }}>WHARF DISPATCH NOTE (WDN)</p>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <Grid container spacing={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Grid item sm={5}>
                                                    <table style={{ width: "100%" }}>
                                                        <tr>
                                                            <td style={{ width: "40%", fontWeight: "bold", fontSize: 10, }}>WDN No</td>
                                                            <td style={{ width: "60%", fontSize: 10, }}>:{this.state.data?.wdn_no ? this.state.data?.wdn_no : "N/A"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ width: "40%", fontWeight: "bold", fontSize: 10, }}>WDN Date</td>
                                                            <td style={{ width: "60%", fontSize: 10, }}>:{this.state.data?.wdn_date ? dateParse(this.state.data?.wdn_date) : "N/A"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ width: "40%", fontWeight: "bold", fontSize: 10, }}>Shipment No</td>
                                                            <td style={{ width: "60%", fontSize: 10, }}>:{this.state.data?.wharf_ref_no ? this.state.data?.wharf_ref_no : "N/A"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ width: "40%", fontWeight: "bold", fontSize: 10, }}>WHARF REF No</td>
                                                            <td style={{ width: "60%", fontSize: 10, }}>:{this.state.data?.shipment_no ? this.state.data?.shipment_no : "N/A"}</td>
                                                        </tr>
                                                    </table>
                                                </Grid>
                                                <Grid item sm={7}>
                                                    <p style={{ textAlign: "center", fontSize: 10, }}>STATE PHARMACEUTICALS CORPARATION OF SRI LANKA<br />16th FLOOR, MEHEWARA PIYASA BUILDING,<br />NO. 41, KIRULA ROAD,<br />COLOMBO 05, SRI LANKA<br />T.P. +94-11-2335374, +94-11-2326227, +94-11-2320256-9</p>
                                                </Grid>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <table style={{ width: "100%" }}>
                                                    <tr>
                                                        <td style={{ width: "20%", fontWeight: "bold", fontSize: 10, }}>Vessel/Carrier Name</td>
                                                        <td style={{ width: "30%", fontSize: 10, }}>: {this.state.data?.ConsigmentVesselData?.[0]?.flight_name ? this.state.data?.ConsigmentVesselData?.[0]?.flight_name : ""}</td>
                                                        <td style={{ width: "10%", fontWeight: "bold", fontSize: 10, }}>To</td>
                                                        <td style={{ width: "40%", fontSize: 10, }}>:{this.state.data?.ConsignmentContainers?.[0]?.delivery_point ? this.state.data?.ConsignmentContainers?.[0]?.delivery_point : ""}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "20%", fontWeight: "bold", fontSize: 10, }}>Voyage/Flight No</td>
                                                        <td style={{ width: "30%", fontSize: 10, }}>:{this.state.data?.ConsigmentVesselData?.[0]?.flight_no ? this.state.data?.ConsigmentVesselData?.[0]?.flight_no : ""}</td>
                                                        <td style={{ width: "10%", fontWeight: "bold", fontSize: 10, }}></td>
                                                        <td style={{ width: "40%", fontSize: 10, }}></td>
                                                    </tr>
                                                </table>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <hr style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000" }} className="mt-2 mb-2" />
                                                <table style={{ width: "100%" }}>
                                                    <tr>
                                                        <td style={{ width: "20%", fontWeight: "bold", fontSize: 10, }}>Supplier</td>
                                                        <td style={{ width: "80%", fontSize: 10, }}>:{this.state.data?.Supplier?.name}</td>
                                                    </tr>
                                                </table>
                                            </Grid>
                                            <table style={{ width: "100%" }}>
                                                <tr>
                                                    <td style={{ width: "20%", fontWeight: "bold", fontSize: 10, }}>Supplier Address</td>
                                                    <td style={{ width: "30%", fontSize: 10, }}>:{this.state.data?.Supplier?.address ? this.state.data?.Supplier?.address : ""}</td>
                                                    <td style={{ width: "20%", fontWeight: "bold", fontSize: 10, }}>Invoice No</td>
                                                    <td style={{ width: "30%", fontSize: 10, }}>:{this.state.data?.invoice_no}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: "20%", fontWeight: "bold", fontSize: 10, }}>PO No</td>
                                                    <td style={{ width: "30%", fontSize: 10, }}>:{this.state.data?.po_no}</td>
                                                    <td style={{ width: "20%", fontWeight: "bold", fontSize: 10, }}>Invoice Date</td>
                                                    <td style={{ width: "30%", fontSize: 10, }}>:{this.state.data?.invoice_date ? dateParse(this.state.data?.invoice_date) : "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: "20%", fontWeight: "bold", fontSize: 10, }}>Indent/PA No</td>
                                                    <td style={{ width: "30%", fontSize: 10, }}>:{this.state.POData?.indent_no}</td>
                                                    <td style={{ width: "20%", fontWeight: "bold", fontSize: 10, }}>Volume (CBM)</td>
                                                    <td style={{ width: "30%", fontSize: 10, }}>:{this.state.data?.ConsignmentContainers?.[0]?.volume ? (this.state.data?.ConsignmentContainers?.[0]?.volume + " " + this.state.data?.ConsignmentContainers?.[0]?.unit) : ""}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: "20%", fontWeight: "bold", fontSize: 10, }}>Mode of Dispatch</td>
                                                    <td style={{ width: "30%", fontSize: 10, }}>:{this.state.POData?.mode_of_dispatch ? this.state.POData?.mode_of_dispatch : ""}</td>
                                                    <td style={{ width: "20%", fontWeight: "bold", fontSize: 10, }}>B/L or AWB No</td>
                                                    <td style={{ width: "30%", fontSize: 10, }}>:{this.state.data?.ConsigmentVesselData?.[0]?.bl_no ? this.state.data?.ConsigmentVesselData?.[0]?.bl_no : ""}</td>
                                                </tr>
                                            </table>
                                        </Grid>
                                        <React.Fragment>
                                            <Grid item sm={12}>
                                                <table style={{ width: "100%", fontSize: 10, }}>
                                                    <thead>
                                                        <tr style={{ fontSize: 10, }}>
                                                            <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "10%" }}>Seq</td>
                                                            <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "25%" }}>Item Code</td>
                                                            <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "30%" }}>Description</td>
                                                            <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "10%" }}>Strength</td>
                                                            <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "25%" }}>Old Sr No</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(this.state.ItemData) && this.state.ItemData.filter(item => item.selected).map((item, i) => (
                                                            <>
                                                                <tr style={{ fontSize: 10, }}>
                                                                    <td style={{ width: "10%" }}>{i + 1}</td>
                                                                    <td style={{ width: "25%" }}>{item?.SPCPOItem?.ItemSnap?.sr_no}</td>
                                                                    <td style={{ width: "30%" }}>{item?.SPCPOItem?.ItemSnap?.short_description}</td>
                                                                    <td style={{ width: "10%" }}>{item?.SPCPOItem?.ItemSnap?.strength}</td>
                                                                    <td style={{ width: "25%" }}>{item?.SPCPOItem?.previous_sr}</td>
                                                                </tr>
                                                                <tr style={{ fontSize: 10, }}>
                                                                    <td style={{ width: "10%" }}></td>
                                                                    <td style={{ width: "25%", fontWeight: "bold" }}>Order No</td>
                                                                    <td style={{ width: "30%", fontWeight: "bold" }}>Invoice Qty</td>
                                                                    <td style={{ width: "10%", fontWeight: "bold" }}>UOM</td>
                                                                    <td style={{ width: "25%", fontWeight: "bold" }}>Packing Details</td>
                                                                </tr>
                                                                <tr style={{ fontSize: 10, }}>
                                                                    <td style={{ width: "10%" }}></td>
                                                                    <td style={{ width: "25%" }}>{item?.SPCPOItem?.MSDPurchaseOrder?.order_no}</td>
                                                                    <td style={{ width: "10%" }}>{item?.transit_quantity}</td>
                                                                    <td style={{ width: "30%" }}>{item?.SPCPOItem?.unit_type}</td>
                                                                    <td style={{ width: "25%" }}>{`${this.state.POData?.SPCPOItems.filter(res => res?.id === item.spc_po_item_id).map(item => item?.SPCPOPackDetails.map(item => item?.pack_size).join(' X '))}`}</td>
                                                                </tr>
                                                            </>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </Grid>
                                        </React.Fragment>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <hr style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000", fontSize: 10, }} className="mt-2 mb-2" />
                                    </Grid>
                                    <Grid item sm={12} className="mt-2">
                                        <table style={{ width: "100%", fontSize: 10, }}>
                                            <tr>
                                                <td style={{ width: "20%", fontWeight: "bold" }}>Remarks</td>
                                                <td style={{ width: "30%" }}>:{this.state.data?.remark}</td>
                                                <td style={{ width: "20%", fontWeight: "bold" }}>Total Packages</td>
                                                <td style={{ width: "30%" }}>:{this.state.data?.ConsigmentVesselData?.[0]?.total_packages ? this.state.data?.ConsigmentVesselData?.[0]?.total_packages : ""}</td>
                                            </tr>
                                        </table>
                                    </Grid>
                                    <Grid item sm={12} className="mt-2">
                                        <table style={{ width: "100%", fontSize: 10, }}>
                                            <tr style={{ fontSize: 10 }}>
                                                <td style={{ width: "20%", fontWeight: "bold" }}>In Transit Condition</td>
                                                <td style={{ width: "80%" }}>:{"2°C - 8°C / 15°C - 20°C / < 25°C / Normal"}</td>
                                            </tr>
                                        </table>
                                    </Grid>
                                    <Grid item sm={12} className="mt-5">
                                        <table style={{ width: "100%", fontSize: 10, }}>
                                            <thead>
                                                {this.state.data?.ConsigmentVesselData?.[0]?.vessel_type === "LCL" || this.state.data?.ConsigmentVesselData?.[0]?.vessel_type === "Air Freight" ? (     /*COMPLETED */
                                                    <tr style={{ fontSize: 10, }}>
                                                        <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "20%" }}>Vehicle No</td>
                                                        <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "15%" }}>Remark</td>
                                                        <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "15%" }}>Date</td>
                                                        <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "15%" }}>Time</td>
                                                        {/* <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Container No</td>
                                                            <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"15%"}}>Container Type</td> */}
                                                        <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "10%" }}>Damages</td>
                                                        <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "10%" }}>Shortages</td>
                                                    </tr>
                                                ) : (
                                                    <tr style={{ fontSize: 10, }}>
                                                        <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "20%" }}>Vehicle No</td>
                                                        <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "15%" }}>Remark</td>
                                                        <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "15%" }}>Date</td>
                                                        <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "15%" }}>Time</td>
                                                        <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "15%" }}>Container No</td>
                                                        <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "15%" }}>Container Type</td>
                                                        <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "10%" }}>Damages</td>
                                                        <td style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "10%" }}>Shortages</td>
                                                    </tr>
                                                )}
                                            </thead>
                                            {this.state.data?.status === "DELIVERED" ?       /*COMPLETED */
                                                <tbody>
                                                    {Array.isArray(this.state.deliveryData) && this.state.deliveryData.length > 0 && this.state.deliveryData.map((item, i) => (
                                                        <>
                                                            <tr style={{ fontSize: 10, }}>
                                                                <td style={{ width: "10%" }}>{item?.lorry_no || item?.vehicle_no}</td>
                                                                <td style={{ width: "10%" }}>{item?.remark}</td>
                                                                <td style={{ width: "15%" }}>{this.state.data?.ConsignmentContainers?.[0]?.delivery_date ? dateParse(this.state.data?.ConsignmentContainers?.[0]?.delivery_date) : ""}</td>
                                                                <td style={{ width: "15%" }}>{this.state.data?.ConsignmentContainers?.[0]?.delivery_date ? timeParse(this.state.data?.ConsignmentContainers?.[0]?.delivery_date) : ""}</td>
                                                                {this.state.data?.ConsigmentVesselData?.vessel_type === "LCL" || this.state.data?.ConsigmentVesselData?.vessel_type === "Air Freight" ? ("") : (<td style={{ width: "20%" }}>{item?.container_number}</td>)}
                                                                {this.state.data?.ConsigmentVesselData?.vessel_type === "LCL" || this.state.data?.ConsigmentVesselData?.vessel_type === "Air Freight" ? ("") : (<td style={{ width: "20%" }}>{item?.container_type}</td>)}
                                                                <td style={{ width: "20%" }}>{item?.container_type}</td>
                                                                <td style={{ width: "10%" }}></td>
                                                                <td style={{ width: "10%" }}></td>
                                                            </tr>
                                                        </>
                                                    ))
                                                    }
                                                </tbody>
                                                : <br />}
                                        </table>
                                    </Grid>
                                    {
                                        this.state.data?.status === "DELIVERED" &&       /*COMPLETED */
                                        <Grid item sm={12} className="mt-2">
                                            <table style={{ width: "100%", fontSize: 10, }}>
                                                <tr style={{ fontSize: 10, }}>
                                                    <td style={{ width: "30%", fontWeight: "bold" }}>Total Packs</td>
                                                    <td style={{ width: "70%" }}>:{this.state.data?.ConsignmentContainers?.[0]?.no_of_packages ? this.state.data?.ConsignmentContainers?.[0]?.no_of_packages : ""}</td>
                                                </tr>
                                                <tr style={{ fontSize: 10, }}>
                                                    <td style={{ width: "30%", fontWeight: "bold" }}>Condition of Goods</td>
                                                    <td style={{ width: "70%" }}>:{this.state.data?.ConsignmentContainers?.[0]?.goods_condition ? this.state.data?.ConsignmentContainers?.[0]?.goods_condition : ""}</td>
                                                </tr>
                                                <tr style={{ fontSize: 10, }}>
                                                    <td style={{ width: "30%", fontWeight: "bold" }}>Remark</td>
                                                    <td style={{ width: "70%" }}>:{this.state.data?.ConsignmentContainers?.[0]?.remark ? this.state.data?.ConsignmentContainers?.[0]?.remark : ""}</td>
                                                </tr>
                                            </table>
                                        </Grid>
                                    }
                                    <Grid item sm={12} className="mt-2">
                                        <table style={{ width: "100%", fontSize: 10, }}>
                                            <tr style={{ fontSize: 10, }}>
                                                <td style={{ width: "20%", textAlign: "center", fontWeight: "bold" }}>Prepared By: </td>
                                                <td style={{ width: "30%", textAlign: "left" }}>{this.state.data?.Create?.name ? this.state.data?.Create?.name : "N/A"}</td>
                                                <td style={{ width: "20%", textAlign: "center", fontWeight: "bold" }}>Approved By: </td>
                                                <td style={{ width: "30%", textAlign: "left" }}>{(this.state.data?.approvalData && ["Draft", "Pending", 'New'].includes(this.state.data?.status) == false) ? this.state.data?.approvalData?.Employee.name : 'N/A'}</td>
                                            </tr>
                                        </table>
                                        {/* <div style={{display:"flex", flexDirection:"row", fontSize: 10,}}>
                                                <div style={{flex: 1, fontSize: 10,}}>
                                                    <Typography variant="body1" style={{fontSize: 10}}>Prepared By :</Typography>
                                                </div>
                                                <div style={{flex: 2, fontSize: 10,}}>
                                                    <Typography variant="body1" style={{fontSize: 10,}}>{user?.name ? user?.name: "N/A"}</Typography>
                                                </div>
                                            </div> */}
                                    </Grid>
                                    <Grid item sm={12} className="mt-10" style={{ pageBreakInside: 'avoid' }}>
                                        <table style={{ width: "100%", fontSize: 10, }}>
                                            <tr style={{ fontSize: 10, }}>
                                                <td style={{ width: "50%", textAlign: "center" }}>...........................</td>
                                                <td style={{ width: "50%", textAlign: "center" }}>...........................</td>
                                            </tr>
                                            <tr style={{ fontSize: 10 }}>
                                                <td style={{ width: "50%", textAlign: "center" }}>Name</td>
                                                <td style={{ width: "50%", textAlign: "center" }}>WHARF Clerk</td>
                                            </tr>
                                            {/* <tr style={{fontSize: 10}}>
                                                    <td style={{width:"50%", textAlign:"center"}}></td>
                                                    <td style={{width:"50%", textAlign:"center"}}>...........................</td>
                                                </tr>
                                                <tr style={{fontSize: 10}}>
                                                    <td style={{width:"50%", textAlign:"center"}}></td>
                                                    <td style={{width:"50%", textAlign:"center"}}>Name</td>
                                                </tr> */}
                                        </table>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <hr style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000" }} className="mt-2 mb-2" />
                                    </Grid>
                                    <Grid item sm={12} style={{ pageBreakInside: 'avoid', fontSize: 10 }}>
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
                                                <Typography variant="body1" align="center" style={{ fontSize: 10 }}>Following Details Are Certified</Typography>
                                                <div style={{ display: "flex", flexDirection: "row", border: "1px dashed #000" }}>
                                                    <div style={{ flex: 1, borderRight: "1px dashed #000" }}>
                                                        <table style={{ width: "100%" }}>
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
                                                        <table style={{ width: "100%" }}>
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
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>SK</td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}></td>
                                                                    <td style={{ width: "33.3%", textAlign: "center" }}>WHARF CLERK</td>
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

export default WDNPrint;