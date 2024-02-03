import React, { Component } from 'react'
import { Box, Card, Grid, TextField } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { Button, SubTitle } from "app/components/LoonsLabComponents";
import { fontWeight } from '@mui/system';
import { GRN_ITEMS } from 'apiroutes';

class OrderControlForm extends Component {

    

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
                    {/* header */}
                    <div className='w-full'>
                        <div className="flex justify-between">
                            <p style={style.printHeader}>Medical Supplies Division</p>
                            <p style={style.printHeader}>ORDER CONTROL FORM - YEAR 2024</p>
                            <p>March 23, 2023</p>
                        </div>
                    </div>
                    <hr></hr>
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
                                <p className={'m-0 text-right'}>UOM : <span style={style.boldText}>TAB</span></p>
                                <TextField id="outlined-basic" label="Remarks" variant="outlined" className='w-full p-0' />
                            </Grid>
                        </Grid>
                    </div>
                    <hr></hr>
                    <div className='w-full'></div>
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
                                    <p>ABC :A</p>
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
                    <hr></hr>
                    
                    <div className='w-full'>
                        <Grid container>
                            <table className='w-full text-center'>
                                <thead>
                                    <tr>
                                        <th className='text-left' style={style.printHeader}>Year</th>
                                        <th className='text-right' style={style.printHeader}>2019</th>
                                        <th className='text-right' style={style.printHeader}>2020</th>
                                        <th className='text-right' style={style.printHeader}>2021</th>
                                        <th className='text-right' style={style.printHeader}>2022</th>
                                        <th className='text-right' style={style.printHeader}>2023</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='text-left' style={style.boldText} >Anu.Est./F.R</td>
                                        <td className='text-right'>591,960,100</td>
                                        <td className='text-right'>747,269,100</td>
                                        <td className='text-right'>747,269,100</td>
                                        <td className='text-right'>747,269,100</td>
                                        <td className='text-right'>747,269,100</td>
                                    </tr>
                                    <tr>
                                        <td className='text-left' style={style.boldText} >MSD Issues</td>
                                        <td className='text-right'>591,960,100</td>
                                        <td className='text-right'>747,269,100</td>
                                        <td className='text-right'>747,269,100</td>
                                        <td className='text-right'>747,269,100</td>
                                        <td className='text-right'>747,269,100</td>
                                    </tr>
                                    <tr>
                                        <td className='text-left' style={style.boldText} >Nat.Consump</td>
                                        <td className='text-right'>591,960,100</td>
                                        <td className='text-right'>747,269,100</td>
                                        <td className='text-right'>747,269,100</td>
                                        <td className='text-right'>747,269,100</td>
                                        <td className='text-right'>747,269,100</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                    </div>
                    
                    <hr></hr>  
                    <div className='w-full'>
                        <Grid container>
                            <p style={style.printHeader}>Forecast by MSD</p>
                            <table className='w-full text-center' style={style.tableOutline}>
                                <thead>
                                    <tr>
                                        <th style={style.tableRowOutline} align="left">Year</th>
                                        <th style={style.tableRowOutline}>2019/20</th>
                                        <th style={style.tableRowOutline}>2020/21</th>
                                        <th style={style.tableRowOutline}>2021/22</th>
                                        <th style={style.tableRowOutline}>2022/23</th>
                                        <th style={style.tableRowOutline}>2023/24</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={style.tableRowOutline} align="left">Forecast</td>
                                        <td style={style.tableRowOutline}></td>
                                        <td style={style.tableRowOutline}></td>
                                        <td style={style.tableRowOutline}></td>
                                        <td style={style.tableRowOutline}></td>
                                        <td style={style.tableRowOutline}></td>
                                    </tr>
                                </tbody>
                            </table>                                                                                                                
                        </Grid>
                    </div>

                    <hr></hr>

                    <div className='w-full'>
                        <Grid container>
                            <table className='w-full'>
                                <thead>
                                    <tr>
                                        <th style={{width : '75px'}} className='text-left'>MSD</th>
                                        <th className='text-left'><p>Stock<span style={{fontWeight: 'normal', width:'300px'}}>- without Us Whse</span></p></th>
                                        <th></th>
                                        <th className='text-right'>Institutional Stock</th>
                                        <th></th>
                                        <th className='text-right'>Bal. Due on orders</th>
                                        <th></th>
                                        <th className='text-right'>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{width : '75px', fontWeight:'bold'}}>Qty {'->'} </td>
                                        <td><TextField className='w-full' id="outlined-basic" variant="outlined" /> </td>
                                        <td className='text-center'>+</td>
                                        <td><TextField className='w-full' id="outlined-basic" variant="outlined" /></td>
                                        <td className='text-center'>+</td>
                                        <td><TextField className='w-full' id="outlined-basic" variant="outlined" /></td>
                                        <td className='text-center'>=</td>
                                        <td><TextField className='w-full' id="outlined-basic" variant="outlined" /></td>
                                    </tr>
                                    <tr>
                                        <td style={{width : '75px', fontWeight:'bold'}}>Mst {'->'} </td>
                                        <td><TextField className='w-full' id="outlined-basic" variant="outlined" /> </td>
                                        <td className='text-center'></td>
                                        <td><TextField className='w-full' id="outlined-basic" variant="outlined" /></td>
                                        <td className='text-center'></td>
                                        <td><TextField className='w-full' id="outlined-basic" variant="outlined" /></td>
                                        <td className='text-center'></td>
                                        <td><TextField className='w-full' id="outlined-basic" variant="outlined" /></td>
                                    </tr>
                                    <tr>
                                        <td style={{width : '75px', fontWeight:'bold'}}>F.Mst {'->'} </td>
                                        <td><TextField className='w-full' id="outlined-basic" variant="outlined" /> </td>
                                        <td className='text-center'></td>
                                        <td><TextField className='w-full' id="outlined-basic" variant="outlined" /></td>
                                        <td className='text-center'></td>
                                        <td><TextField className='w-full' id="outlined-basic" variant="outlined" /></td>
                                        <td className='text-center'></td>
                                        <td><TextField className='w-full' id="outlined-basic" variant="outlined" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                        <Grid>
                            <p>Addl. Order Qty :  ....................................&nbsp;&nbsp;&nbsp;....................................</p>
                            <p>Addl. Order for year 20.......; if required:  20..../....../..............  Date 20&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;/</p>
                        </Grid>
                    </div>

                    <hr></hr>

                    <div className='w-full'>
                        <Grid container>
                            <Grid sm={12} item style={style.contentRigtDirection} className="flex justify-between">
                                <p style={style.boldText}>Order For year 2024 :</p>
                                <p>Requirement from...........................to........................... :____________________________________</p>
                            </Grid>
                            <Grid sm={12} item className="flex justify-end">
                                <p>Expected Availability :____________________________________</p>
                            </Grid>
                            <Grid sm={12} item style={style.contentRigtDirection} className="flex justify-between">
                                <p style={style.printHeader}>Order Qty for Year 2024 :</p>
                                <TextField className='w-75' id="outlined-basic" variant="outlined" />
                                <p><span style={style.boldText}>Deficit:</span>____________________________________</p>
                            </Grid>
                            <Grid sm={12} style={style.contentRigtDirection} item className='flex justify-between'>
                                <Grid>
                                    <p style={style.boldText}>Installment / Qty</p>
                                </Grid>
                                <Grid>
                                    <p>1......................................</p>
                                </Grid>
                                <Grid>
                                    <p>2......................................</p>
                                </Grid>
                                <Grid>
                                    <p>3......................................</p>
                                </Grid>
                                <Grid>
                                    <p>4......................................</p>
                                </Grid>
                            </Grid>
                            <Grid sm={12} style={style.contentRigtDirection} item className='flex justify-between'>
                                <Grid>
                                    <p style={style.boldText}>Date &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;</p>
                                </Grid>
                                <Grid>
                                    <p>......................................</p>
                                </Grid>
                                <Grid>
                                    <p>......................................</p>
                                </Grid>
                                <Grid>
                                    <p>......................................</p>
                                </Grid>
                                <Grid>
                                    <p>......................................</p>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                    <hr></hr>

                    <div className='w-full'>
                        <Grid container spacing={2}>
                            <Grid sm={4} item>
                                <p style={style.printHeader}>MSD Stock as at Date</p>
                                <div style={{border : '1px solid black'}}>
                                    <table className='w-full text-center'>
                                        <thead>
                                            <tr>
                                                <th style={style.tableNormalRow}>Monthly Req.</th>
                                                <th style={style.tableNormalRow} className={'text-right'}>Cur.Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>69,529,958.33</td>
                                                <td className={'text-right'}>1,750,000</td>
                                            </tr>
                                            <tr>
                                                <td>In Months {"->"}</td>
                                                <td className={'text-right'}>0.03</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Grid>
                            <Grid sm={8} item>
                                <p style={style.printHeader}>National Stock as at date</p>
                                <div style={{border: "1px solid black"}}>
                                    <table className='text-center'>
                                        <thead>
                                            <tr>
                                                <th style={{fontWeight:'normal', width:'250px'}}>Note : Figures are subjected to</th>
                                                <th style={style.tableNormalRow} className={'text-right'}>National.Stock</th>
                                                <th style={style.tableNormalRow} className={'text-right'}>In Months</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{width:'250px'}}>stock take corrections</td>
                                                <td className='text-right'>10, 712, 450</td>
                                                <td className='text-right'>0.15</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Grid>
                            <Grid sm={12}>
                                <p className='text-center' style={style.boldText}>{'<'}-----------------------------------------------------MSD and Institutional stock details-----------------------------------------------------{'>'}</p>
                            </Grid>        
                        </Grid>
                    </div>
                    <hr></hr>

                    <div className='w-full' style={{border:'1px solid'}}>
                        <Grid container spacing={1}>
                            <Grid item sm={6}>
                                <table className='w-full' style={style.tableOutline}>
                                    <thead >
                                        <tr>
                                            <th style={style.tableNormalRow} className={'text-left'}>Expiry Date</th>
                                            <th style={style.tableNormalRow} className={'text-right'}>MSD Stock</th>
                                            <th style={style.tableNormalRow} className={'text-right'}>Inst. Stock</th>
                                            <th style={style.tableNormalRow} className={'text-right'}>National</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={style.tableRowOutline} className={'text-left'}>2023.08.31</td>
                                            <td style={style.tableRowOutline} className={'text-right'}></td>
                                            <td style={style.tableRowOutline} className={'text-right'}>93, 000</td>
                                            <td style={style.tableRowOutline} className={'text-right'}>93, 000</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Grid>
                            <Grid item sm={6}>
                                <table className='w-full' style={style.tableOutline}>
                                    <thead>
                                        <tr>
                                            <th style={style.tableNormalRow} className={'text-left'}>Exp Date</th>
                                            <th style={style.tableNormalRow} className={'text-right'}>MSD Stock</th>
                                            <th style={style.tableNormalRow} className={'text-right'}>Inst. Stock</th>
                                            <th style={style.tableNormalRow} className={'text-right'}>National</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={style.tableRowOutline} className={'text-left'}>2023.08.31</td>
                                            <td style={style.tableRowOutline} className={'text-right'}></td>
                                            <td style={style.tableRowOutline} className={'text-right'}>1,370</td>
                                            <td style={style.tableRowOutline} className={'text-right'}>1,370</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Grid>
                        </Grid>
                    </div>
                    <hr></hr>

                    <div className='w-full'>
                        <Grid container className='flex justify-between'>
                            <Grid item>
                                <p style={style.tableNormalRow}>Old Order List No</p>
                            </Grid>
                            <Grid item>
                                <p style={style.tableNormalRow}>Order List No</p>
                            </Grid>
                            <Grid item>
                                <p style={style.tableNormalRow}>Order Date</p>
                            </Grid>
                            <Grid item>
                                <p style={style.tableNormalRow}>Qty Ordered</p>
                            </Grid>
                            <Grid item>
                                <p style={style.tableNormalRow}>Qty Rcvd(GRN)</p>
                            </Grid>
                            <Grid item>
                                <p style={style.tableNormalRow}>Balance Mts</p>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item sm={12}>
                                <table className='w-full text-left' style={style.tableOutline}>
                                    <thead>
                                        <tr>
                                            <th style={style.tableOutline}>Order List Date</th>
                                            <th style={style.tableOutline}>Order List No:</th>
                                            <th style={style.tableOutline}>Order Quantity</th>
                                            <th style={style.tableOutline}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={style.tableRowOutline}>.............................................</td>
                                            <td style={style.tableRowOutline}>2024/SPC/N/........./........./.........</td>
                                            <td style={style.tableRowOutline}>.............................................</td>
                                            <td style={style.tableRowOutline}>.............................................</td>
                                        </tr>
                                        <tr>
                                            <td style={style.tableRowOutline}></td>
                                            <td style={style.tableRowOutline}>20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ </td>
                                            <td style={style.tableRowOutline}></td>
                                            <td style={style.tableRowOutline}></td>
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

export default OrderControlForm;
