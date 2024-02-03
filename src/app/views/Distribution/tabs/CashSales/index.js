/*
Loons Lab CashSale
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import { convertTocommaSeparated, dateTimeParse } from "utils";
import { caseSaleCharges } from 'appconst';


class CashSale extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voucherId : null
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
        console.log('testprintdata',this.props.printData[0]?.OrderItem?.OrderExchange?.fromStore?.name)
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
    @page {
      size: auto;
   
    }
    body {
        counter-reset: page;
     
      }
    .page-number::after {
        counter-increment: page;
        content: counter(page);
      }
    .header {
        counter-reset: section;
        list-style-type: none;
      }
      
   
  
      .header, .header-space {
        height: 50px;
      }
     
      .footer, .footer-space {
        height: 50px;
      }
      .header {
        position: fixed;
        top: 0;
      }
      .footer {
        position: fixed;
        bottom: 0;
      }
     
    
  }

`; 


        return (
            <div>
                <Grid className="w-full justify-end items-end flex hidden">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_00415" color="primary" size="small" style={{ margin:'0', padding:'0'}}>Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray p-5" >
                        <div className="bg-white p-5" >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                    <Grid className="w-full" container>   
                                
                                    <table className="w-full">
                                        <thead><tr><td>
                                            <div className="header-space w-full"> </div>
                                        </td></tr></thead>
                                        <tbody><tr><td>
                                            <div className="content w-full">
                                                {/* content start */}
                                                    <table style={{width: '100%', margin: 0, padding: 0}}>
                                                        <tr>
                                                            <td style={{width: '10%'}}></td>
                                                            <td style={{width: '80%'}}>
                                                                <h1 style={{textAlign: 'center', fontSize: '16px', fontWeight: 'normal'}}>MEDICAL SUPPLIES DIVISION - MINISTRY OF HEALTH</h1>
                                                            </td>
                                                            <td style={{width: '10%'}}>
                                                                <p style={{float: 'right', border: '1px solid black', paddingLeft: '10px', paddingRight : '10px', paddingTop: '5px', paddingBottom: '5px'}}>ORIGINAL</p>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <div className="row">
                                                        <div className="col">
                                                            <p style={{textAlign: 'center', fontSize: '12px'}}>No: 357, Rev.Baddegama Wimalawansha Thero Mawatha,</p>
                                                            <p style={{textAlign: 'center', fontSize: '12px'}}>Colombo 10.</p>
                                                        </div>
                                                    </div>

                                                    <table style={{width: '100%'}}>
                                                        <tr>
                                                            <td style={{textAlign: 'left', width: '20%'}}>
                                                                <p style={{border: '1px solid black', paddingLeft: '10px', paddingRight : '10px', paddingTop: '5px', paddingBottom: '5px'}}>General 172</p>
                                                            </td>
                                                            <td style={{textAlign: 'center', width: '60%'}}>
                                                                <h1 style={{textAlign: 'center', fontSize: '16px', fontWeight: 'bold'}}>CASH RECEIPT</h1>
                                                            </td>
                                                            <td style={{textAlign: 'right', width: '20%'}}>
                                                                {/* <p style={{paddingLeft: '10px', paddingRight :' 10px', paddingTop: '5px', paddingbottom: '5px'}}>No: <span style={{color: 'red'}}>{}</span></p> */}
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <div className="row">
                                                        <div className="col"></div>
                                                    </div>

                                                    <div>
                                                        <table style={{width: '100%'}}>
                                                            <tr>
                                                                <td style={{width: '50%'}}><p style={{marginTop: '20px'}}>Order No:  {this.props.orderId}</p></td>
                                                                <td style={{width: '50%'}}></td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{width: '50%'}}><p style={{marginTop: '20px'}}>Receipt No:  {this.props.orderId}</p></td>
                                                                <td style={{width: '50%'}}><p style={{marginTop: '20px'}}>Date:{dateTimeParse(this.props.printData?.[0]?.createdAt)}</p></td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{width: '50%'}}><p style={{marginTop: '20px'}}>Received From:  {this.props.printData[0]?.OrderItem?.OrderExchange?.fromStore?.name}</p></td>
                                                                <td style={{width: '50%'}}></td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{width: '50%'}}><p style={{marginTop: '20px'}}>The Amount Received:  {}</p></td>
                                                                <td style={{width: '50%'}}></td>
                                                            </tr>
                                                        </table>
                                                    </div>

                                                    <div style={{marginTop: '20px'}}>
                                                            <table style={{width: '100%'}} ellspacing="0" border="0">
                                                            {/* <tr>
                                                                <td style={{width: '25%'}} align="right" valign='bottom' sdnum="1033;0;@"><b><u><font color="#000000">Type</font></u></b></td>
                                                                <td style={{width: '25%'}} align="right" valign='bottom' sdnum="1033;0;@"><b><u><font color="#000000">Credit Or Debit</font></u></b></td>
                                                                <td style={{width: '25%'}} align="right" valign='bottom' sdnum="1033;0;@"><b><u><font color="#000000">Value</font></u></b></td>
                                                                <td style={{width: '25%'}} align="right" valign='bottom' sdnum="1033;0;@"><b><u><font color="#000000">Rate</font></u></b></td>
                                                            </tr> */}

                                                            {/* {{#each transaction}} */}
                                                            {/* <tr>
                                                                <td style={{width: '25%'}} align="right" valign='bottom' sdnum="1033;0;@"><font color="#000000">{this.props.printData?.[0]?.OrderExchange?.type}</font></td>
                                                                <td style={{width: '25%'}} align="right" valign='bottom' sdnum="1033;0;@"><font color="#000000">{}</font></td>
                                                                <td style={{width: '25%'}} align="right" valign='bottom' sdnum="1033;0;@"><font color="#000000">{}</font></td>
                                                                <td style={{width: '25%'}} align="right" valign='bottom' sdnum="1033;0;@"><font color="#000000">{}</font></td>
                                                            </tr> */}
                                                        {/* {{/each}} */}

                                                        <tr>
                                                            <td style={{width: '25%'}} colspan='3' align="left" valign='bottom'><b><font color="#000000" style={{marginTop: '20px'}}>Total Charges</font></b></td>
                                                            <td style={{width: '25%'}} align="right" valign='bottom' sdnum="1033;0;@"><font color="#000000"></font></td>
                                                            <td style={{width: '25%'}} align="right" valign='bottom' sdnum="1033;0;@"><font color="#000000"></font></td>
                                                            <td style={{width: '25%'}} align="right" valign='bottom' sdnum="1033;0;@"><font color="#000000">{convertTocommaSeparated(this.props.Total, 2)}</font></td>
                                                        </tr>

                                                        <tr>
                                                            <td style={{width: '25%'}} colspan='3' align="left" valign='bottom'><b><font color="#000000" style={{marginTop: '20px'}}>Service Charges(10%)</font></b></td>
                                                            <td style={{width: '25%'}} align="right" valign='bottom' sdnum="1033;0;@"><font color="#000000"></font></td>
                                                            <td style={{width: '25%'}} align="right" valign='bottom' sdnum="1033;0;@"><font color="#000000"></font></td>
                                                            <td style={{width: '25%'}} align="right" valign='bottom' sdnum="1033;0;@"><font color="#000000">{convertTocommaSeparated(this.props.Total *caseSaleCharges/100 , 2)}</font></td>
                                                        </tr>
                                                            
                                                        </table>
                                                    </div>

                                                    <div style={{marginTop: '20px'}}>
                                                        <table style={{width: '100%'}}>
                                                            <tr>
                                                                <td style={{width: '50%'}}><p style={{marginTop: '20px'}}>Reason:  </p></td>
                                                                <td style={{width: '25%'}}><p style={{marginTop: '20px', fontWeight: 'bold'}}>Final Value :</p></td>
                                                                <td style={{width: '25%', textAlign:'right'}}><p style={{marginTop: '20px'}}>{convertTocommaSeparated(this.props.Total + (this.props.Total * 0.1), 2)}</p></td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                {/* content end */}
                                            </div>
                                        </td></tr></tbody>
                                        <tfoot><tr><td>
                                            <div className="footer-space"> </div>
                                        </td></tr></tfoot>
                                    </table>

                                    <div className="header w-full"></div>
                                    <div className="footer w-full"></div>
                                        
                                    
                                    </Grid> 
                                </div>

                            </div>
                        </div>
                    </Grid>
            </div>
        );
    }
}

export default CashSale
;