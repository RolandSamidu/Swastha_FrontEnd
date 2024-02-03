import React, { Fragment, Component } from "react";
import { Button, Grid, Typography } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import PrescriptionService from "app/services/PrescriptionService";
import { convertTocommaSeparated, dateParse, dateTimeParse, roundDecimal, timeParse } from "utils";
import PrintIcon from '@mui/icons-material/Print';
import { themeColors } from "app/components/MatxTheme/themeColors";
import { MatxLayoutSettings } from "app/components/MatxLayout/settings";
import { CardTitle } from "app/components/LoonsLabComponents";
import LocalPurchaseServices from "../../../services/LocalPurchaseServices";

const renderDetailCard = (label, value) => {
    return (
        <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={6} xs={6}>
                <Grid container spacing={2}>
                    <Grid item lg={10} md={10} sm={10} xs={10}>
                        <Typography style={{fontSize:'13px'}} variant="subtitle1">
                            {label}
                        </Typography>
                    </Grid>
                    <Grid item lg={2} md={2} sm={2} xs={2}>
                        <Typography style={{fontSize:'13px'}} variant="subtitle1">:</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
                <Typography style={{fontSize:'13px'}} variant="subtitle1">
                    {value}
                </Typography>
            </Grid>
        </Grid>
    )
}

const renderSignatureCard = (label) => {
    return (
        <Grid container >
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

class TenderOpeningPrint extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            pdata:[],
            otherSelectedSuppier:[],
            // data: this.props.grnData,
            supplierData: [
                {
                name:"George St",
                price:"1200"
            },
                {
                name:"A. J. Mendis",
                price:"1500"
            },
            ],
            grnId: null
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

    async getPriceList(){

        let params  = {
            // status : ['Pending', 'Director Approve'],
            'order[0]': ['unit_price', 'ASC'],
            lp_request_id : this.props.id
        }

        let res = await LocalPurchaseServices.getLPSupplierDet(params)
        console.log("cheking oricing data:", res)
        if (res.status === 200){
            console.log("cheking oricing data:", res)
            const filteredData = res.data.view.data.filter(item => item.unit_price !== '0');
            const otherSelectedSuppier = res.data.view.data.filter(item => item.unit_price === '0' || item.unit_price == null || item.unit_price == undefined);
            this.setState({
                pdata:filteredData, 
                otherSelectedSuppier: otherSelectedSuppier
            })
        }
    }

    componentDidMount() {
        console.log("Data id:", this.props.data)
        this.getPriceList()
    }

    render() {
        let activeTheme = MatxLayoutSettings.activeTheme;
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
                <Grid className="w-full justify-end items-end flex hidden">
                    <ReactToPrint
                        trigger={() => <Button id="tender_print_view" color="primary" size="small" style={{ margin: '0', padding: '0' }}>Print</Button>}
                        pageStyle={pageStyle}
                        onAfterPrint={()=>{
                            this.props.handleOpen(true);
                        }}
                        content={() => this.componentRef}
                    />
                </Grid>
                <Grid className="bg-light-gray p-5 hidden" >
                    <div className="bg-white p-5" >
                        <div>
                            <div ref={(el) => (this.componentRef = el)} >
                                <Grid className="w-full" container>
                                    <Grid container className="mb-5">
                                        <Grid item xs={12} sm={12} lg={12} md={12} className="mb-5">
                                            <table style={{width:'100%'}}>
                                                <tr>
                                                    <td style={{width:'50%'}}></td>
                                                    <td style={{width:'20%'}}>
                                                        <p className="m-0 p-0">Date</p>
                                                        <p className="m-0 p-0">Time</p>
                                                        <p className="m-0 p-0">User</p>
                                                    </td>
                                                    <td style={{width:'30%'}}>
                                                        <p className="m-0 p-0">: {dateParse(new Date())}</p>
                                                        <p className="m-0 p-0">: {timeParse(new Date())}</p>
                                                        <p className="m-0 p-0">: {this.props.userInfo}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </Grid>
                                        <Grid item xs={12} sm={12} lg={12} md={12} className="mb-5">
                                            <div className="mt-2 mb-5">
                                                <Typography style={{ textAlign: "center", fontWeight:'bold', fontSize:'13px' }} id="NP Drug">TENDER OPENING REPORT & TENDER EVALUTION</Typography>
                                            </div>
                                            {renderDetailCard("Name of the Item", this.props.data?.ItemSnap ? this.props.data?.ItemSnap?.medium_description: "......................................................")}
                                            {renderDetailCard("Sr No", this.props.data?.ItemSnap ? this.props.data?.ItemSnap?.sr_no: "......................................................")}
                                            {renderDetailCard("Request ID", this.props.data?.request_id ? this.props.data?.request_id: "......................................................")}
                                            {renderDetailCard("File Number", "......................................................")}
                                            {renderDetailCard("Name of the Patient", this.props.data?.patient_name ? this.props.data?.patient_name: this.props.data?.Patient?.name)}
                                            {renderDetailCard("Date of Quotation Called", dateParse(new Date()))}
                                            {renderDetailCard("Date of Tender Opening", "......................................................")}
                                            {renderDetailCard("Date of Tender Closing", dateTimeParse(new Date()))}
                                            {/* <br></br>
                                            {renderDetailCard("Date of Tender Closing", dateTimeParse(new Date()))} */}
                                            <div className="mt-5">
                                                <CardTitle title="Recieved Traders" />
                                            </div>
                                        </Grid>
                                        {this.state.pdata.map((element, id) => (
                                            <React.Fragment key={id}>
                                                <>
                                                    <Grid item sm={12} className="mt-2 mb-2">
                                                        <table style={{ width: "100%" }}>
                                                            {id === 0 &&  (
                                                                <tr className="mb-2">
                                                                    <td className="mb-5" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "10%", marginBottom:'5px' }}>Seq No.</td>
                                                                    <td className="mb-5" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "20%", marginBottom:'5px' }}>Name of the Supplier</td>
                                                                    <td className="mb-5" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "15%", marginBottom:'5px' }}>Approved Qty</td>
                                                                    <td className="mb-5" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "20%", marginBottom:'5px' }}>Price (Rs)</td>
                                                                    <td className="mb-5" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "15%", marginBottom:'5px' }}>Total Price (Rs)</td>
                                                                    <td className="mb-5" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "20%", marginBottom:'5px' }}>Approved or Not /Reason</td>
                                                                </tr>
                                                            )}
                                                            <tr style={{height:"30px"}}>
                                                                <td style={{ width: "10%" }}>{id + 1}</td>
                                                                <td style={{ width: "20%" }}>{element?.Supplier?.name}</td>
                                                                <td style={{ width: "15%" }}>{element?.LPRequest?.approved_qty}</td>
                                                                <td style={{ width: "20%" }}>{element?.unit_price}</td>
                                                                <td style={{ width: "15%" }}>{roundDecimal(element?.unit_price * element?.LPRequest?.approved_qty, 2)}</td>
                                                                <td style={{ width: "20%" }}>................................</td>
                                                            </tr>
                                                        </table>
                                                    </Grid>
                                                </>
                                            </React.Fragment>
                                        ))}
                                        <Grid contaiter>
                                            <Grid item sm={12}>
                                                <CardTitle title="Other Traders" />
                                            </Grid>
                                        </Grid>
                                            {/* <Grid item sm={12}> */}
                                        {this.state.otherSelectedSuppier.map((element, id) => (
                                        <React.Fragment key={id}>
                                            <>
                                                <Grid item sm={12} className="mt-2 mb-2">
                                                    <table style={{ width: "100%" }}>
                                                        {id === 0 &&  (
                                                            <tr className="mb-2">
                                                                <td className="mb-5" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "10%", marginBottom:'5px' }}>Seq No.</td>
                                                                <td className="mb-5" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "40%", marginBottom:'5px' }}>Name of the Supplier</td>
                                                                <td className="mb-5" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "30%", marginBottom:'5px' }}>Approved Qty</td>
                                                                <td className="mb-5" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "20%", marginBottom:'5px' }}>Price (Rs)</td>
                                                                {/* <td className="mb-5" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "15%", marginBottom:'5px' }}>Total Price (Rs)</td>
                                                                <td className="mb-5" style={{ borderBottom: "1px dotted black", borderCollapse: "collapse", fontWeight: "bold", width: "20%", marginBottom:'5px' }}>Approved or Not /Reason</td> */}
                                                            </tr>
                                                        )}
                                                        <tr style={{height:"30px"}}>
                                                            <td style={{ width: "10%" }}>{id + 1}</td>
                                                            <td style={{ width: "40%" }}>{element?.Supplier?.name}</td>
                                                            <td style={{ width: "30%" }}>{element?.LPRequest?.approved_qty}</td>
                                                             <td style={{ width: "20%" }}>{element?.unit_price ? element?.unit_price : 'N\A'}</td>
                                                            {/*<td style={{ width: "15%" }}>{roundDecimal(element?.unit_price * element?.LPRequest?.approved_qty, 2)}</td>
                                                            <td style={{ width: "20%" }}>................................</td> */}
                                                        </tr>
                                                    </table>
                                                </Grid>
                                            </>
                                        </React.Fragment>
                                        ))}
                                            {/* </Grid> */}
                                        </Grid>
                                  
                                    <br/>
                                    <br/>
                                    <br className="mt-5"/>
                                    {renderDetailCard("Tender Evaluated By Consultant", '......................................................')}
                                    {renderDetailCard("", '......................................................')}
                                    {renderDetailCard("", '......................................................')}
                                    {renderDetailCard("", '......................................................')}
                                    <br/>
                                    <br/>
                                    <br className="mt-5"/>
                                    {renderDetailCard("Evaluated Supplier", '......................................................')}
                                    {renderDetailCard("", '......................................................')}
                                    {renderDetailCard("", '......................................................')}

                                    <Grid container className="mt-5">
                                        <Grid item xs={4} sm={4} lg={4} md={4}>
                                            {renderSignatureCard('Requested By Drug Store Pharmacist/ Radiographer/ MLT')}
                                        </Grid>
                                        <Grid item xs={4} sm={4} lg={4} md={4}>
                                            {renderSignatureCard('Recommended by SP/ CP/ SMLT/ S. Radiographer')}
                                        </Grid>
                                        <Grid item xs={4} sm={4} lg={4} md={4}>
                                            {renderSignatureCard('Approved by Head of the institution')}
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

export default TenderOpeningPrint;