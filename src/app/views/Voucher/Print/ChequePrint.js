/*
Loons Lab Cheque_Print
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import PrintIcon from '@mui/icons-material/Print';
import { dateParse } from "utils";


class ChequePrint extends Component {
    constructor(props) {
        super(props)
        this.state = {
            today : dateParse(new Date()),
            chequeNo: null,
            amount: null,
            payer: null,
            address: null,
            createdBy: null,
            approvedBy: null,
            printedBy:null
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
                        trigger={() => <PrintIcon id="print_presc_004" color="primary" size="small" style={{ margin:'0', padding:'0'}}></PrintIcon>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray p-5 hidden" >
                        <div className="bg-white p-5" >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                    <Grid className="w-full">   
                                
                                        <Grid contailer>

                                            <Grid item sm={12}>
                                                <table className="w-full">
                                                    <tr>
                                                        <td className="w-50">
                                                            <p className="p-0 m-0">Medical Suplies Divivsion.</p>
                                                            <p className="p-0 m-0">Ministry of Health - Sri Lanka</p>
                                                            <p className="p-0 m-0">375. Ven Baddegama Wimalawansha Thero Mawatha,</p>
                                                            <p className="p-0 m-0">Colombo 10.</p>
                                                        </td>
                                                        <td className="w-50" style={{textAlign:"right"}}>
                                                            <p className="p-0 m-0">Date: <span className="px-10 py-3" style={{border:"1px solid black"}}>{this.state.today}</span></p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </Grid>

                                            <Grid item sm={12}>
                                                <hr></hr>
                                            </Grid>

                                            <Grid item sm={12} className="mt-5">
                                                <table className="w-full">
                                                    <tr>
                                                        <td className="my-2" style={{width:"20%", fontWeight:"bold"}}><p>Cheque No</p></td>
                                                        <td className="my-2" style={{width:"40%"}}><p>:{this.props.chequeNo}</p></td>
                                                        <td className="my-2" style={{width:"30%"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="my-2" style={{width:"20%", fontWeight:"bold"}}><p>Supplier</p></td>
                                                        <td className="my-2" style={{width:"40%"}}><p>:{this.props.payer}</p></td>
                                                        <td className="my-2 px-10 py-3" style={{width:"30%", border:"1px solid black"}}><span style={{color:"#525252"}}>Rs.&nbsp;&nbsp;</span>{this.props.amount}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="my-2" style={{width:"20%", fontWeight:"bold"}}><p>Address</p></td>
                                                        <td className="my-2" style={{width:"40%"}}><p>:{this.props.address}</p></td>
                                                        <td className="my-2" style={{width:"30%"}}></td>
                                                    </tr>
                                                    
                                                    <tr>
                                                        <td className="my-2" style={{width:"20%", fontWeight:"bold"}}><p>Approved By</p></td>
                                                        <td className="my-2" style={{width:"40%"}}><p>:{this.props.approvedBy}</p></td>
                                                        <td className="my-2" style={{width:"30%"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="my-2" style={{width:"20%", fontWeight:"bold"}}><p>Created By</p></td>
                                                        <td className="my-2" style={{width:"40%"}}><p>:{this.props.createdBy}</p></td>
                                                        <td className="my-2" style={{width:"30%"}}></td> 
                                                    </tr>
                                                </table>
                                            </Grid>

                                        </Grid>

                                        <Grid container style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                                            <Grid item sm={12} className="mt-2" style={{ marginTop: '0px', paddingTop: '0px' }}>
                                                <hr />
                                                <p style={{textAlign:"right"}}>Printed By {this.props.printedBy} {this.state.today}</p>
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

export default ChequePrint
;