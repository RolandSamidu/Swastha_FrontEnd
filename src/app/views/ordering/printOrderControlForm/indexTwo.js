import React, { Component } from 'react'
import { Box, Card, Grid, TextField } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { Button, SubTitle } from "app/components/LoonsLabComponents";

class OrderControlFormTwo extends Component {
  render() {

    const style = {
        printHeader : {
            textDecoration: 'underline',
            fontWeight: 'bold'
        },

        boldText : {
            fontWeight: 'bold'
        },
        
        contentRigtDirection : {
            display:"flex", 
            flexDirection:"row"
        },

        tableOutline : {
            borderCollapse: 'collapse',
            border: '1px solid black',
            fontWeight: 'normal'
        },

        tableRowOutline : {
            border: '1px solid black',
            fontWeight: 'normal'
        },

        tableNormalRow: {
            fontWeight:'normal', 
            textDecoration:'underline' 
        },
        textUnderline : {
            textDecoration: 'underline',
        },
        tableHeadUnderline : {
            textDecoration: 'underline',
            fontWeight:'normal', 
            borderLeft:'1px solid black',
            borderRight:'1px solid black'
        },
        lastTableRow :{
            fontWeight:'normal', 
            borderLeft:'1px solid black',
            borderRight:'1px solid black'
        }
    }

    const pageStyle = `
 
    @page {
       
       margin-left:10mm;
       margin-right:5mm;
       margin-bottom:5mm;
       margin-top:8mm;
     }
    
     @media all {
       .pagebreak {
         display: none;
       }
     }
   
     @media print {
       .header, .header-space,
              {
               height: 2000px;
             }
   .footer, .footer-space {
               height: 100px;
             }
   
             .footerImage{
               height: 50px;
               bottom: 0;
             }
             .footer {
               position: fixed;
               bottom: 0;
             }
             .page-break {
               margin-top: 1rem;
               display: block;
               page-break-before: auto;
             }
     }
   `; 
    return (
        <div>
            <Grid>
                <ReactToPrint
                    trigger={() => <Button id="print_presc_004" size="small" startIcon="print">Print</Button>}
                    pageStyle={pageStyle}
                    // documentTitle={letterTitle}
                    //removeAfterPrint
                    content={() => this.componentRef}
                />
            </Grid>
            <Grid className="bg-light-gray p-5 ">
                <div className="bg-white p-5 ">
                    <div ref={(el) => (this.componentRef = el)} >


                        <div className='w-full'>
                            <div className="flex justify-between">
                                <p style={style.printHeader}>Medical Supplies Division</p>
                                <p style={style.printHeader}>ORDER CONTROL FORM - YEAR 2024</p> 
                                <p>March 23, 2023</p>
                            </div>
                        </div>

                        <div className='w-full'>
                            <Grid container direction="row">
                                <Grid item xs={6}>
                                    
                                        <table className='w-full'>
                                            <thead>
                                                <tr>
                                                    <th className='text-left'>Srno</th>
                                                    <th className='text-center'>00700401 Metformin Tab. 500mg</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className='text-left'>Old sr</td>
                                                    <td className='text-center'>070607</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    
                                </Grid>
                                <Grid item xs={6}>
                                    <p className={'m-0 text-right'}><span style={style.boldText}>TAB</span></p>
                                </Grid>
                            </Grid>
                        </div>

                        <div className='w-full'>
                            <Grid container>
                                <Grid item sm={12} style={style.contentRigtDirection}>
                                    <Grid sm={3}>
                                        <p style={style.boldText}>VEN : E</p>
                                    </Grid>
                                    <Grid sm={3}>
                                        <p>Item Level : 1</p>
                                    </Grid>
                                    <Grid sm={3}>
                                        <p>Estimated Item : Y</p>
                                    </Grid>
                                    <Grid sm={3}>
                                        <p>Std Unit Cost (Rs.) : 1.38</p>
                                    </Grid>
                                </Grid>
                                <Grid item sm={12} style={style.contentRigtDirection}>
                                    <Grid sm={3}>
                                        <p>ABC : A</p>
                                    </Grid>
                                    <Grid sm={3}>
                                        <p>Cons. Item : Y</p>
                                    </Grid>
                                    <Grid sm={3}>
                                        <p style={style.boldText}>Comp/Regular : R</p>
                                    </Grid>
                                    <Grid sm={3}>
                                        <p>Formulary Approved : Y</p>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>

                        <div className='w-full'>
                            <Grid container>
                                <table className='w-full'>
                                    <thead>
                                        <tr>
                                            <th className='text-left' style={style.tableNormalRow}>Old Order List No</th>
                                            <th className='text-left' style={style.tableNormalRow}>Order List No</th>
                                            <th className='text-right' style={style.tableNormalRow}>Order Date</th>
                                            <th className='text-right' style={style.tableNormalRow}>Qty Ordered</th>
                                            <th className='text-right' style={style.tableNormalRow}>Qty Rcvd(GRN)</th>
                                            <th className='text-right' style={style.tableNormalRow}>Balance</th>
                                            <th className='text-right'></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='text-left'></td>
                                            <td className='text-left'>2021/DON/E/R/P/00038</td>
                                            <td className='text-right'>2021.09.30</td>
                                            <td className='text-right'>360,000</td>
                                            <td className='text-right'>360,000</td>
                                            <td className='text-right'>0</td>
                                            <td className='text-right' style={{ textDecoration: 'underline',}}>0.0</td>
                                        </tr>
                                    </tbody>
                                </table> 
                            </Grid>
                        </div>


                        <div className='w-full'>
                            <Grid container>
                                <p style={style.boldText}>Detail F/R and Estimates</p>
                                <table className='w-full' style={{borderCollapse: 'collapse'}}>
                                    <thead>
                                        <tr>
                                            <th className='text-left' style={style.tableNormalRow}>Year</th>
                                            <th className='text-left' style={style.tableNormalRow}>RMSD</th>
                                            <th className='text-left' style={style.tableNormalRow}>Inst Cod</th>
                                            <th className='text-left' style={style.tableNormalRow}>Stock Code</th>
                                            <th className='text-left' style={style.tableNormalRow}>Institution</th>
                                            <th className='text-right' style={style.tableNormalRow}>F.R /Anu.Estimate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{borderBottom: '1px solid black'}}>
                                            <td className='text-left'>2023</td>
                                            <td className='text-left'></td>
                                            <td className='text-left'>0090</td>
                                            <td className='text-left'>00700401</td>
                                            <td className='text-left'>T.H. Jaffna</td>
                                            <td className='text-right'>24,000,000</td>
                                        </tr>
                                    </tbody>
                                </table> 
                            </Grid>
                        </div>
                        <br></br>
                        <div className='w-full'>
                            <Grid container>
                                <Grid item sm={12}>
                                    <table className='w-full text-left' style={style.tableOutline}>
                                        <thead style={{borderCollapse: 'collapse',}}>
                                            <tr >
                                                <th style={style.tableHeadUnderline}>Order List Date</th>
                                                <th style={style.tableHeadUnderline}>Order List No:</th>
                                                <th style={style.tableHeadUnderline}>Order Quantity</th>
                                                <th style={style.tableHeadUnderline}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={style.lastTableRow}>.............................................</td>
                                                <td style={style.lastTableRow}>2024/SPC/N/........./........./.........</td>
                                                <td style={style.lastTableRow}>.............................................</td>
                                                <td style={style.lastTableRow}>.............................................</td>
                                            </tr>
                                            <tr>
                                                <td style={style.lastTableRow}></td>
                                                <td style={style.lastTableRow}>20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ </td>
                                                <td style={style.lastTableRow}></td>
                                                <td style={style.lastTableRow}></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Grid>
                            </Grid>
                        </div>

                        <br></br>
                        <div className='w-full'>
                            <Grid container>
                                <Grid item sm={12}>
                                    <table className='text-center w-full' >
                                        <thead>
                                            <tr>
                                                <th style={{fontWeight:'normal'}}>.............................................</th>
                                                <th style={{fontWeight:'normal'}}>.............................................</th>
                                                <th style={{fontWeight:'normal'}}>.............................................</th>
                                                <th style={{fontWeight:'normal'}}>.............................................</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={style.boldText}>1. Prepared By /SCO/........</td>
                                                <td style={style.boldText}>2. Checked by SCO/D</td>
                                                <td style={style.boldText}>3. Checked by HSCU/P/S/D</td>
                                                <td style={style.boldText}>4. Approved By AD/P/S</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Grid>
                            </Grid>
                        </div>




                    </div>
                </div>
            </Grid>
        </div>
    )
  }
}

export default OrderControlFormTwo;
