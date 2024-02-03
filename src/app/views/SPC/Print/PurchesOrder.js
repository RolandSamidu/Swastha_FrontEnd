/*
Loons Lab Purches Order Print
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any, number } from "prop-types";
import PrescriptionService from "app/services/PrescriptionService";
import { convertTocommaSeparated, dateParse, timeParse } from "utils";
import PrintIcon from '@mui/icons-material/Print';

class PurchaseOrderList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.purchaseOrderData,
            purchaseId: null,
            today: new Date(),
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.purchaseOrderData !== prevState.data) {
            return {
                data: nextProps.purchaseOrderData
            };
        }
        return null;
    }

    componentDidMount() {
        // this.getPurchaseOrderById()
        console.log('dadadadadad', this.props.purchaseOrderData)

        // const script = document.createElement('script');
        // script.src = 'https://unpkg.com/pagedjs/dist/paged.polyfill.js';
        // script.async = true;
        // document.head.appendChild(script);
    }


    render() {
        const {
            discount,
            taxAmount,
            totalAmount,
            storageType,
            purchesingUnit,
            deliveryAddress,
            umo,
            user,
            pageNo,
            manufacturer,
            country,
            packingDetails,
            condition,
            netTotal
        } = this.props;
        /*  size: 297mm 420mm, */
        const pageStyle = `

        
 
 @page {
    
    margin-left:10mm,
    margin-right:5mm,
    margin-bottom:5mm,
    margin-top:8mm,

    @bottom-left {
        content: counter(page) ' of ' counter(pages);
      }
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

          .normalFont {
            font-size:12px
          }
  }
`;

        const finalNetTotal = this.props.purchaseOrderData?.POItem?.reduce((total, element) => {
            console.log('element.quantity', element?.quantity, element?.standard_cost)
            const quantity = Number(element.quantity);
            const standardCost = Number(element.standard_cost);
            const taxCost = (quantity * standardCost * Number(this.state.data.vat || 0)) / 100
            return total + (quantity * standardCost) + taxCost;
        }, 0);


        return (
            <div className="hidden">
                <Grid className="w-full justify-end items-end flex hidden ">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_004" color="primary" size="small" style={{ margin: '0', padding: '0' }}>Print</Button>}
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

                                        <Grid item sm={12} style={{ textAlign: "center", fontWeight: "bold" }}>
                                            <table style={{ width: "100%" }}>
                                                <tr>
                                                    <td style={{ width: "70%" }}>
                                                        <p className="p-0 m-0">MEDICAL SUPPLIES DIVISION - MINISTRY OF HEALTH</p>
                                                        <p className="p-0 m-0">No:357, Rev. Baddegama Wimalawansha Thero Mawatha</p>
                                                        <p className="p-0 m-0">Colombo 10</p>
                                                        <p className="mt-5 p-0 m-0">Purchase Order Print - MSD </p>
                                                    </td>
                                                    <td style={{ width: "10%" }}>
                                                        <p style={{ textAlign: "right" }} className="p-0 m-0 normalFont">Date</p>
                                                        <p style={{ textAlign: "right" }} className="p-0 m-0 normalFont">Time</p>
                                                        <p style={{ textAlign: "right" }} className="p-0 m-0 normalFont">User</p>
                                                        <p style={{ textAlign: "right" }} className="p-0 m-0 normalFont"></p>
                                                    </td>
                                                    <td style={{ width: "20%" }}>
                                                        <p style={{ fontWeight: "normal", textAlign: "left" }} className="p-0 m-0 normalFont">:{dateParse(this.state.today)}</p>
                                                        <p style={{ fontWeight: "normal", textAlign: "left" }} className="p-0 m-0 normalFont">:{timeParse(this.state.today)}</p>
                                                        <p style={{ fontWeight: "normal", textAlign: "left" }} className="p-0 m-0 normalFont">:{this.props.userName}</p>
                                                        <p style={{ fontWeight: "normal", textAlign: "left" }} className="p-0 m-0 normalFont">{ }</p>
                                                    </td>
                                                </tr>
                                            </table>

                                        </Grid>

                                        <Grid item sm={12}>
                                            <hr />
                                        </Grid>

                                        <Grid item sm={12} className="mt-5">
                                            <table style={{ width: "100%" }}>
                                                <tr>
                                                    <td className="normalFont" style={{ width: "20%", fontWeight: "bold" }}>Request Date</td>
                                                    <td className="normalFont" style={{ width: "30%" }}>:{dateParse(this.state.data?.order_date_to)}</td>
                                                    <td className="normalFont" style={{ width: "20%", fontWeight: "bold" }}>PO No</td>
                                                    <td className="normalFont" style={{ width: "30%" }}>:{this.state.data?.po_no}</td>
                                                </tr>
                                                <tr>
                                                    <td className="normalFont" style={{ width: "20%", fontWeight: "bold", }}>Purchasing Unit</td>
                                                    <td className="normalFont" style={{ width: "30%", }}>:{this.state.data?.Supplier?.name}</td>
                                                    <td className="normalFont" style={{ width: "20%", fontWeight: "bold", }}>Delivery Address</td>
                                                    <td className="normalFont" style={{ width: "30%", }}>:{deliveryAddress}</td>
                                                </tr>
                                                <tr>
                                                    <td className="normalFont" style={{ width: "20%", fontWeight: "bold", }}>PA Order No</td>
                                                    <td className="normalFont" style={{ width: "30%", }}>:{this.state.data?.order_no}</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </table>
                                        </Grid>

                                        {this.state.data?.POItem?.map((element, id) => (



                                            <React.Fragment key={id}>
                                                <>
                                                    <Grid item sm={12} className="mt-5">
                                                        <table style={{ width: "100%" }}>
                                                            {id === 0 && (
                                                                <tr>
                                                                    <td className="normalFont" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "5%" }}>No.</td>
                                                                    <td className="normalFont" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "10%" }}>Item Code</td>
                                                                    <td className="normalFont" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "30%" }}>Description</td>
                                                                    <td className="normalFont" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "5%" }}>UOM</td>
                                                                    <td className="normalFont" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "20%" }}>Qty</td>
                                                                    <td className="normalFont" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "10%" }}>Unit Price</td>
                                                                    <td className="normalFont" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "20%" }}>Amount</td>
                                                                </tr>
                                                            )}
                                                            <tr>
                                                                <td className="normalFont" style={{ width: "5%" }}>{id + 1}</td>
                                                                <td className="normalFont" style={{ width: "10%" }}>{element.item?.sr_no}</td>
                                                                <td className="normalFont" style={{ width: "30%" }}>{element.item?.medium_description}</td>
                                                                <td className="normalFont" style={{ width: "5%" }}>{element?.uom}</td>
                                                                <td className="normalFont" style={{ width: "20%" }}>{element.quantity}</td>
                                                                <td className="normalFont" style={{ width: "10%" }}>{element?.standard_cost}</td>
                                                                <td className="normalFont" style={{ width: "20%", }}>{(this.props.purchaseOrderData?.currency || ' ') + ': ' + convertTocommaSeparated(element?.quantity * element?.standard_cost, 2)}</td>
                                                                {/* <td style={{width:"20%"}}>{element.quantity * element.item?.standard_cost}</td> */}
                                                            </tr>




                                                            <tr>
                                                                <td style={{ width: "5%" }}></td>
                                                                <td style={{ width: "10%" }}></td>
                                                                <td style={{ width: "30%" }}></td>
                                                                <td style={{ width: "5%" }}></td>
                                                                <td className="normalFont" style={{ fontWeight: "bold", width: "20%" }}>Discount</td>
                                                                <td className="normalFont" style={{ width: "10%" }}>:</td>
                                                                <td className="normalFont" style={{ width: "20%", }}>{0}</td>
                                                            </tr>

                                                            <tr>
                                                                <td style={{ width: "5%" }}></td>
                                                                <td style={{ width: "10%" }}></td>
                                                                <td style={{ width: "30%" }}></td>
                                                                <td style={{ width: "5%" }}></td>
                                                                <td className="normalFont" style={{ fontWeight: "bold", width: "20%" }}>Tax Amount</td>
                                                                <td className="normalFont" style={{ width: "10%" }}>:</td>
                                                                <td className="normalFont" style={{ width: "20%" }}>{convertTocommaSeparated(((element?.quantity * element?.standard_cost * Number(this.state.data.vat || 0) / 100)), 2)}</td>
                                                            </tr>

                                                            <tr>
                                                                <td style={{ width: "5%" }}></td>
                                                                <td style={{ width: "10%" }}></td>
                                                                <td style={{ width: "30%" }}></td>
                                                                <td style={{ width: "5%" }}></td>
                                                                <td className="normalFont" style={{ fontWeight: "bold", width: "20%" }}>Total Amount</td>
                                                                <td className="normalFont" style={{ width: "10%" }}>: </td>
                                                                <td className="normalFont" style={{ width: "20%", }}>{(this.props.purchaseOrderData?.currency || ' ') + ': ' + convertTocommaSeparated(((element?.quantity * element?.standard_cost) + (element?.quantity * element?.standard_cost * Number(this.state.data.vat || 0) / 100)), 2)}</td>
                                                            </tr>

                                                        </table>
                                                    </Grid>

                                                    <Grid item sm={12} className="mt-5">
                                                        <table style={{ width: "70%" }}>
                                                            <tr>
                                                                <td className="normalFont" style={{ fontWeight: "bold" }}>Order List</td>
                                                                <td className="normalFont" style={{ fontWeight: "bold" }}>Storage Type</td>
                                                                <td className="normalFont" style={{ fontWeight: "bold" }}>Standard Shelf Life</td>
                                                            </tr>

                                                            <tr>
                                                                <td className="normalFont">{this.state.data.order_no}</td>
                                                                <td className="normalFont">{storageType}</td>
                                                                <td className="normalFont">{element.item?.standard_shelf_life}</td>
                                                            </tr>
                                                        </table>
                                                    </Grid>

                                                    <Grid item sm={12} className="mt-5">
                                                        <table style={{ width: "100%" }}>
                                                            <tr>
                                                                <td className="normalFont" style={{ width: "30%", fontWeight: "bold" }}>Manufacturer</td>
                                                                <td className="normalFont" style={{ width: "70%" }}>:{this.props.purchaseOrderData?.Manufacturer?.name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="normalFont" style={{ width: "30%", fontWeight: "bold" }}>Country of Origin</td>
                                                                <td className="normalFont" style={{ width: "70%" }}>:{country}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="normalFont" style={{ width: "30%", fontWeight: "bold" }}>Packing Details</td>
                                                                <td className="normalFont" style={{ width: "70%" }}>:{packingDetails}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="normalFont" style={{ width: "30%", fontWeight: "bold" }}>Specification</td>
                                                                <td className="normalFont" style={{ width: "70%" }}>:
                                                                    <div dangerouslySetInnerHTML={{ __html: this.state.data.POItem?.[id]?.item?.specification }} />
                                                                </td>
                                                            </tr>

                                                            <tr className="mt-5">
                                                                <td className="mt-5 normalFont" style={{ width: "30%", fontWeight: "bold" }}>Additional Condition</td>
                                                                <td style={{ width: "70%" }}>{this.state.data.POItem?.[id]?.additional_condition}</td>
                                                            </tr>
                                                            {/* <tr>
                                                        <td className="normalFont" style={{width:"30%", fontWeight:"bold"}}>Condition</td>
                                                        <td className="normalFont" style={{width:"70%"}}>:{condition}</td>
                                                    </tr> */}
                                                        </table>
                                                    </Grid>

                                                    <Grid className="mt-5" item sm={12}>
                                                        <p className="normalFont" style={{ fontWeight: "bold" }}>Delivery Shedule</p>
                                                        <table style={{ width: "50%" }}>

                                                            <tr>
                                                                <td className="normalFont" style={{ fontWeight: "bold", width: "25%" }}>Date</td>
                                                                <td className="normalFont" style={{ fontWeight: "bold", width: "25%" }}>Qty</td>
                                                            </tr>
                                                            {element.schedule.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td className="normalFont">{dateParse(item.schedule_date)}</td>
                                                                    <td className="normalFont">{item.quantity}</td>
                                                                </tr>
                                                            ))}
                                                        </table>
                                                    </Grid>



                                                    <Grid className="mt-5" item sm={12} style={{ borderTop: "1px dotted black", margin: "20px 0" }}>

                                                    </Grid>

                                                </>
                                            </React.Fragment>
                                        ))}
                                        <Grid item sm={12}>

                                            <table style={{ width: "100%" }}>
                                                <tr>
                                                    <td style={{ width: "5%" }}></td>
                                                    <td style={{ width: "10%" }}></td>
                                                    <td style={{ width: "30%" }}></td>
                                                    <td style={{ width: "5%" }}></td>
                                                    <td className="normalFont" style={{ fontWeight: "bold", width: "20%" }}>Net Total</td>
                                                    <td className="normalFont" style={{ width: "10%" }}></td>
                                                    <td className="normalFont" style={{ fontWeight: "bold", width: "20%" }} >:{(this.props.purchaseOrderData?.currency || ' ') + ': ' + convertTocommaSeparated(finalNetTotal, 2)}</td>
                                                </tr>
                                            </table>

                                        </Grid>
                                    </Grid>


                                    <Grid container>

                                        <Grid className="mt-15" item sm={12}>
                                            <table style={{ width: "100%" }}>
                                                <tr>
                                                    <td className="normalFont" style={{ textAlign: "center", width: "33.33%" }}></td>
                                                    <td className="normalFont" style={{ textAlign: "center", width: "33.33%" }}>.............................</td>
                                                    <td className="normalFont" style={{ textAlign: "center", width: "33.33%" }}>.............................</td>
                                                </tr>
                                                <tr>
                                                    <td className="normalFont" style={{ textAlign: "center", width: "33.33%", fontWeight: "bold" }}>Prepared By: {this.props.userName}</td>
                                                    <td className="normalFont" style={{ textAlign: "center", width: "33.33%", fontWeight: "bold" }}>Checked by</td>
                                                    <td className="normalFont" style={{ textAlign: "center", width: "33.33%", fontWeight: "bold" }}>Approved By</td>
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

export default PurchaseOrderList
    ;