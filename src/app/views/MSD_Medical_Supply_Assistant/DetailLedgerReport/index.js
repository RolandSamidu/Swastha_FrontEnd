/*
Loons Lab DetailLedgerReports
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";


class DetailLedgerReports extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voucherId : null
        }
    }

    static propTypes = {
        header: any,
        footer: any,
        voucherId : String,
        invoice_no :String,
        topic :String
    };

    static defaultProps = {
        voucherId : null,
        invoice_no : null,
        topic : null

    };

    newlineText(text) {
        if (text) {
            return text.split('\n').map(str => <p>{str}</p>);
        } else {
            return ""
        }

    }


    componentDidMount() {

    }

    render() {
        const {
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
                <Grid className="w-full justify-end items-end flex ">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_00414" size="small" startIcon="print">Print</Button>}
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
                                            <p style={{fontSize:'12px'}} className="m-0 p-0">Medical Supplies Division</p>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <table style={{width:'100%'}}>
                                                <tr>
                                                    <td style={{width:'70%'}}></td>
                                                    <td style={{width:'10%'}}>
                                                        <p style={{fontSize:'12px'}} className="m-0 p-0">Date</p>
                                                        <p style={{fontSize:'12px'}} className="m-0 p-0">Time</p>
                                                        <p style={{fontSize:'12px'}} className="m-0 p-0">User</p>
                                                        <p style={{fontSize:'12px'}} className="m-0 p-0">Page</p>
                                                    </td>
                                                    <td style={{width:'20%'}}>
                                                        <p style={{fontSize:'12px'}} className="m-0 p-0">: {}</p>
                                                        <p style={{fontSize:'12px'}} className="m-0 p-0">: {}</p>
                                                        <p style={{fontSize:'12px'}} className="m-0 p-0">: {}</p>
                                                        <p style={{fontSize:'12px'}} className="m-0 p-0">: {}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </Grid>

                                        <Grid className="mt-5" item xs={12}>
                                            <p className="m-0 p-0 text-center" style={{fontWeight:'bold', fontSize:'12px'}}>Details Ledger Report</p>
                                        </Grid>

                                        <Grid className="mt-3" item xs={12}>
                                            <hr></hr>
                                        </Grid>

                                        <Grid className="mt-1" item xs={12}>
                                            <table style={{width:'100%'}}>
                                                <tr>
                                                    <td style={{width:'20%', fontSize:'12px'}}>MSD Warehouse</td>
                                                    <td style={{width:'30%', fontSize:'12px'}}>: {}</td>
                                                    <td style={{width:'20%', fontSize:'12px'}}></td>
                                                    <td style={{width:'30%', fontSize:'12px'}}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:'20%', fontSize:'12px'}}>Item Code</td>
                                                    <td style={{width:'30%', fontSize:'12px'}}>: {}</td>
                                                    <td style={{width:'20%', fontSize:'12px'}}>UOM</td>
                                                    <td style={{width:'30%', fontSize:'12px'}}>:</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:'20%', fontSize:'12px'}}>Description</td>
                                                    <td style={{width:'30%', fontSize:'12px'}}>: {}</td>
                                                    <td style={{width:'20%', fontSize:'12px'}}></td>
                                                    <td style={{width:'30%', fontSize:'12px'}}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:'20%', fontSize:'12px'}}>Opening Balance</td>
                                                    <td style={{width:'30%', fontSize:'12px'}}>: {}</td>
                                                    <td style={{width:'20%', fontSize:'12px'}}></td>
                                                    <td style={{width:'30%', fontSize:'12px'}}></td>
                                                </tr>
                                            </table>
                                        </Grid>

                                        <Grid className="mt-2" item xs={12}>
                                        <table style={{width:'100%'}}>
                                                <tr>
                                                    <td style={{width:'30%', fontSize:'12px'}}>Serviceable Qty</td>
                                                    <td style={{width:'20%', fontSize:'12px'}}>: {}</td>
                                                    <td style={{width:'20%', fontSize:'12px'}}>On Hand</td>
                                                    <td style={{width:'30%', fontSize:'12px'}}>:</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:'30%', fontSize:'12px'}}>Unserviceable Qty</td>
                                                    <td style={{width:'20%', fontSize:'12px'}}>: {}</td>
                                                    <td style={{width:'20%', fontSize:'12px'}}></td>
                                                    <td style={{width:'30%', fontSize:'12px'}}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:'30%', fontSize:'12px'}}>National Monthly Requirement</td>
                                                    <td style={{width:'20%', fontSize:'12px'}}>: {}</td>
                                                    <td style={{width:'20%', fontSize:'12px'}}></td>
                                                    <td style={{width:'30%', fontSize:'12px'}}></td>
                                                </tr>
                                            </table>
                                        </Grid>

                                        <Grid className="mt-3" item xs={12}>
                                            <table style={{width:'100%'}}>
                                                <tr>
                                                    <td style={{width:'30%'}}>
                                                        <table style={{width:'100%', borderBottom:"1px dotted black"}}>
                                                            <tr>
                                                                <td style={{width:'40%',fontSize:'12px',}}>+ Receipt:</td>
                                                                <td style={{width:'60%',fontSize:'12px',}}> {}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td style={{width:'2%'}}></td>
                                                    <td style={{width:'98%'}}>
                                                        <table style={{width:'100%',  borderBottom:"1px dotted black"}}>
                                                            <tr>
                                                                <td style={{width:'30%',fontSize:'12px'}}>- Issues:</td>
                                                                <td style={{width:'70%',fontSize:'12px'}}> {}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:'30%'}}>
                                                        <table style={{width:'100%'}}>
                                                            <tr>
                                                                <td style={{width:'20%',fontSize:'12px', fontWeight:"bold", textDecoration:'underline'}}>Mth</td>
                                                                <td style={{width:'40%',fontSize:'12px', fontWeight:"bold", textDecoration:'underline'}}>Date</td>
                                                                <td style={{width:'20%',fontSize:'12px', fontWeight:"bold", textDecoration:'underline'}}>QRN/STV</td>
                                                                <td style={{width:'40%',fontSize:'12px', fontWeight:"bold", textDecoration:'underline'}}>Qty</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td style={{width:'2%'}}></td>
                                                    <td style={{width:'98%'}}>
                                                        <table style={{width:'100%'}}>
                                                            <tr>
                                                                <td style={{width:'10%',fontSize:'12px', fontWeight:"bold", textDecoration:'underline'}}>Mth:</td>
                                                                <td style={{width:'20%',fontSize:'12px', fontWeight:"bold", textDecoration:'underline'}}>Date</td>
                                                                <td style={{width:'20%',fontSize:'12px', fontWeight:"bold", textDecoration:'underline'}}>GRN/STV</td>
                                                                <td style={{width:'40%',fontSize:'12px', fontWeight:"bold", textDecoration:'underline'}}>Institution/Customer</td>
                                                                <td style={{width:'10%',fontSize:'12px', fontWeight:"bold", textDecoration:'underline'}}>Qty</td>
                                                            </tr>
                                                        </table>
                                                    </td>
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

export default DetailLedgerReports
;