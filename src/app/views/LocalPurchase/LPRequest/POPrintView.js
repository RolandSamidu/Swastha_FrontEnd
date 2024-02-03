import React, { Fragment, Component } from "react";
import { Button, Grid, Typography } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import PrescriptionService from "app/services/PrescriptionService";
import { convertTocommaSeparated, dateParse, timeParse } from "utils";
import PrintIcon from '@mui/icons-material/Print';

const renderSignatureCard = (label) => {
    return (
        <Grid container style={{ minHeight: "120px" }}>
            <Grid item xs={12} sm={12} style={{ display: "flex", alignItems: "end", justifyContent: "flex-end", textAlign: "center" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="body1">.................................................</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="body1">{label}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

class POPrintView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.purchaseOrderData,
            purchaseId:null,
            supplier: this.props.supplier[0]
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

    // async getPurchaseOrderById(){

    //     // let id = "0ce64050-7ccc-4f89-a7fa-338a1b6248ba"
    //     let res = await PrescriptionService.NP_Orders_By_Id({},this.props.purchaseId)

    //     if (res.status === 200) {
    //         console.log("purchesOrder", res.data.view)
    //         // console.log("po", res.data.view.POItem[0].item)
            
    //         this.setState({data:res.data.view})
    //     }
    // }

    componentDidMount() {
        // this.getPurchaseOrderById()
        console.log("Data :", this.props.supplier)

        // const estimatedValue = this.state.data?.POItem?.reduce((total, item) => {
        // return total + (item.estimatedValue || 0);
        // }, 0);
    }

    render() {
        const {
            discount,
            taxAmount,
            hospital,
            supplier,
            umo,
            user,
            pageNo,
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
let total_price = 0

        return (
            <div>
                <Grid className="w-full justify-end items-end flex hidden ">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_004" color="primary" size="small" style={{ margin:'0', padding:'0'}}>Print</Button>}
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
                                                    <Typography variant="subtitle1" style={{ textAlign: "center" }}>LP Purchase Order</Typography>
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
                                                    {hospital?.name ? `${hospital.name}, ${hospital.district}` : 'Not Available'}
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <hr/>
                                            </Grid>
                                            <Grid item sm={12} className="mt-5">
                                                <table style={{width:"100%"}}>
                                                    <tr> 
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Request Date</td>
                                                        <td style={{width:"30%"}}>:{dateParse(this.state.data?.order_date_to)}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>PO No</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.po_no}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Supplier Name</td>
                                                        <td style={{width:"30%"}}>:{this.props.supplier[0]?.Supplier?.name}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Delivery Address</td>
                                                        <td style={{width:"30%"}}>:{hospital?.name ? hospital.name : 'Not Available'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Supplier Reg No</td>
                                                        <td style={{width:"30%"}}>:{this.props.supplier[0]?.Supplier?.registartion_no}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Supplier Address</td>
                                                        <td style={{width:"30%"}}>:{this.props.supplier[0]?.Supplier?.address}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Supplier Email</td>
                                                        <td style={{width:"30%"}}>:{this.props.supplier[0]?.Supplier?.email}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Supplier Contact No</td>
                                                        <td style={{width:"30%"}}>:{this.props.supplier[0]?.Supplier?.contact_no}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Lp Request ID</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.order_no}</td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                </table>
                                            </Grid>

                                            {this.state.data?.POItem?.map((element, id) => (
                                            <React.Fragment key={id}>
                                            <>
                                            <Grid item sm={12} className="mt-5">
                                            <table style={{width:"100%"}}>
                                            
                                            {id === 0 && (
                                                <tr>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"5%"}}>No.</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"10%"}}>Item Code</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"30%"}}>Description</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"5%"}}>UOM</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>Qty</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"10%"}}>Unit Price</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"20%"}}>Amount</td>
                                                </tr>
                                            )}
                                                <tr>
                                                    {console.log('sups up sup',this.props.supplier )}
                                                    <td style={{width:"5%"}}>{id+1}</td>
                                                    <td style={{width:"10%"}}>{element?.item?.sr_no}</td>
                                                    <td style={{width:"30%"}}>{element?.item?.medium_description}</td>
                                                    <td style={{width:"5%"}}>{element?.uom?.name}</td>
                                                    <td style={{width:"20%"}}>{element?.quantity}</td>
                                                    <td style={{width:"10%"}}>{this.props.supplier[0]?.unit_price}</td>
                                                    {/* <td style={{width:"20%", fontSize:'12px'}}>{this.props.purchaseOrderData?.currency + ': ' + convertTocommaSeparated(this.props.purchaseOrderData?.estimated_value)}</td> */}
                                                    <td style={{width:"20%"}}>{convertTocommaSeparated(element?.quantity * this.props.supplier[0]?.unit_price, 2)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:"5%"}}></td>
                                                    <td style={{width:"10%"}}></td>
                                                    <td style={{width:"30%"}}></td>
                                                    <td style={{width:"5%"}}></td>
                                                    <td style={{fontWeight:"bold", width:"20%"}}>Discount</td>
                                                    <td style={{width:"10%"}}>:</td>
                                                    <td style={{width:"20%"}}>{discount ? discount : 0}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:"5%"}}></td>
                                                    <td style={{width:"10%"}}></td>
                                                    <td style={{width:"30%"}}></td>
                                                    <td style={{width:"5%"}}></td>
                                                    <td style={{fontWeight:"bold", width:"20%"}}>Tax Amount</td>
                                                    <td style={{width:"10%"}}>:</td>
                                                    <td style={{width:"20%"}}>{taxAmount ? taxAmount : 0}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:"5%"}}></td>
                                                    <td style={{width:"10%"}}></td>
                                                    <td style={{width:"30%"}}></td>
                                                    <td style={{width:"5%"}}></td>
                                                    <td style={{fontWeight:"bold", width:"20%"}}>Total Amount</td>
                                                    <td style={{width:"10%"}}>:</td>
                                                    {/* <td style={{width:"20%"}}>{this.props.purchaseOrderData?.currency + ': ' + convertTocommaSeparated(this.props.purchaseOrderData?.estimated_value)}</td> */}
                                                    {/* <td style={{width:"20%"}}>{this.props.purchaseOrderData?.currency + ': ' + convertTocommaSeparated(element?.quantity * element?.standard_cost)}</td> */}
                                                    {total_price = total_price + (element?.quantity * this.props.supplier[0]?.unit_price)}
                                                </tr>
                                            </table>
                                            </Grid>
                                            <Grid item sm={12} className="mt-5">
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{width:"30%", fontWeight:"bold"}}>Medium Description :</td>
                                                        <td style={{width:"70%"}}>{this.state.data.POItem?.[0]?.item?.medium_description}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"30%", fontWeight:"bold"}}>Specification :</td>
                                                        {/* <td style={{width:"70%"}}>{this.state.data.POItem?.[0]?.item?.specification}</td> */}
                                                        <td style={{ width: "70%" }}>
                                                        {(() => {
                                                            const specification = this.state.data.POItem?.[0]?.item?.specification;
                                                            if (specification) {
                                                            const parser = new DOMParser();
                                                            const parsedHtml = parser.parseFromString(specification, 'text/html');
                                                            return parsedHtml.body.textContent;
                                                            }
                                                            return null; // Handle the case when specification is empty
                                                        })()}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </Grid>

                                            <Grid className="mt-5" item sm={12}>
                                                <p style={{fontWeight:"bold"}}>Delivery Schedule</p>
                                                <table style={{width:"50%"}}>
                                                
                                                    <tr>
                                                        <td style={{fontWeight:"bold", width:"25%"}}>Date</td>
                                                        <td style={{fontWeight:"bold", width:"25%"}}>Qty</td>
                                                    </tr>
                                                {element.schedule.map((item, index)=> ( 
                                                    <tr key={index}>
                                                        <td>{dateParse(item.schedule_date)}</td>
                                                        <td>{item.quantity}</td>
                                                    </tr>
                                                 ))} 
                                                </table>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{width:"5%"}}></td>
                                                        <td style={{width:"10%"}}></td>
                                                        <td style={{width:"30%"}}></td>
                                                        <td style={{width:"5%"}}></td>
                                                        <td style={{fontWeight:"bold", width:"20%"}}>Net Total :</td>
                                                        <td style={{width:"10%"}}></td>
                                                        <td style={{fontWeight:"bold", width:"20%"}} >{this.props.purchaseOrderData?.currency + ': ' + convertTocommaSeparated(total_price)}</td>
                                                        {/* <td style={{fontWeight:"bold", width:"20%"}} >{this.props.purchaseOrderData?.currency + ': ' + convertTocommaSeparated(this.props.purchaseOrderData?.estimated_value)}</td> */}
                                                    </tr>
                                                </table>
                                            </Grid>
                                            <Grid className="mt-5" item sm={12} style={{borderTop: "1px dotted black", margin: "20px 0"}}>
                                            </Grid>
                                            </>
                                            </React.Fragment>
                                            ))}
                                        </Grid>
                                        <Grid container>
                                            <Grid className="mt-15" item sm={12}>
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{textAlign:"center", width:"50%"}}>{user ? user.name : "Not Available"}</td>
                                                        <td style={{textAlign:"center", width:"50%"}}>.............................</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign:"center", width:"50%", fontWeight:"bold"}}>Prepared By</td>
                                                        <td style={{textAlign:"center", width:"50%", fontWeight:"bold"}}>Expected Delivery Date</td>
                                                    </tr>

                                                </table>
                                            </Grid>
                                        </Grid>

                                        <Grid container style={{ display: "flex", alignItems: "end", justifyContent: "flex-end"}}>
                                            {/* <Grid item xs={4} sm={4} lg={4} md={4}>
                                                {renderSignatureCard(' Requested by Store Pharmacist')}
                                            </Grid> */}
                                            <Grid item xs={6} sm={6} lg={6} md={6}>
                                                {renderSignatureCard('Institution Accontant')}
                                            </Grid> 
                                            <Grid item xs={6} sm={6} lg={6} md={6}>
                                                {renderSignatureCard('Approved By Head of Institution')}
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

export default POPrintView;