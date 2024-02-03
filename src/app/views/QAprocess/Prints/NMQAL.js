/*
Loons Lab NMQAL
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import Button from 'app/components/LoonsLabComponents/Button'

import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import FinanceServices from "app/services/FinanceServices";
import { dateParse,dateTimeParse } from '../../../../utils'

class NMQAL extends Component {
    constructor(props) {
        super(props)
        this.state = {

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
        let data = this.props.data
        console.log('data60',data)

        this.setState({
            data:data
        })
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
                        trigger={() => <Button id="print_presc_011" color="primary" size="small" style={{ margin:'0', padding:'0'}}>Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray p-5 hidden" >
                        <div className="bg-white p-5" >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                    <Grid className="w-full" container>   
                                
                                    <Grid item sm={12}>
                                        <table className="w-full">
                                            <tr>
                                                <td style={{textAlign:"right", fontWeight:'bold'}}>DCN: {}</td>
                                            </tr>
                                            <tr>
                                                <td style={{textAlign:"right", fontWeight:'bold'}}>No of pages: {}</td>
                                            </tr>
                                        </table>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <table className="w-full">
                                            <tr>
                                                <td style={{width:'40%'}}>
                                                </td>
                                                <td style={{width:'60%'}}>
                                                    <p className="p-0 m-0">My No. NDL ........../........../........../..........</p>
                                                    <p className="p-0 m-0">National Medicines Quality Assurance Labotary</p>
                                                    <p className="p-0 m-0">National Medicines Regulatary Authority</p>
                                                    <p className="p-0 m-0">120, Norris Canal Road</p>
                                                    <p className="p-0 m-0">Colombo 10</p>
                                                    <p className="p-0 m-0">...................................</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </Grid>

                                    <Grid item sm={12}>
                                        <table className="w-full">
                                            <tr>
                                                <td style={{width:'100%'}}>
                                                    <p className="p-0 m-0">Director General/ National Medicines Regulatory Authority</p>
                                                    <p className="p-0 m-0">Deputy Director General/ Medical Supplies Division/ Minisstry of Health</p>
                                                    <p className="p-0 m-0">Director/ Medical Supplies Division/ Ministry of Health</p>
                                                    <p className="p-0 m-0">Chaireman/ State Pharmaceutical Corporation</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </Grid>

                                    <Grid item sm={12} className="mt-5">
                                        <p className="m-0 p-0" style={{textAlign:'center', fontWeight:'bold'}}>REPORT ON FAILINGSAMPLE</p>
                                    </Grid>

                                    <Grid item sm={12} className="mt-5">
                                        <table style={{width:'100%'}}>
                                            <tr>
                                                <td style={{width:'30%'}}><p>1.NAME OF THE PRODUCT</p></td>
                                                <td style={{width:'70%', fontWeight:'bold'}}><p>:{this.state.data?.ItemSnapBatch?.ItemSnap?.medium_description}</p></td>
                                            </tr>
                                            <tr>
                                                <td style={{width:'30%'}}><p>2.MANUFACTURER</p></td>
                                                <td style={{width:'70%', fontWeight:'bold'}}><p>:{}</p></td>
                                            </tr>
                                        </table>

                                        <p className="p-0 m-0">3.</p>
                                        <table style={{width:'100%', border:'1px solid black', borderCollapse:'collapse'}}>
                                            <tr>
                                                <td style={{width:'15%', border:'1px solid black', borderCollapse:'collapse'}}>L.R.Number</td>
                                                <td style={{width:'15%', border:'1px solid black', borderCollapse:'collapse'}}>Batch Number</td>
                                                <td style={{width:'15%', border:'1px solid black', borderCollapse:'collapse'}}>Date of Mfd.</td>
                                                <td style={{width:'15%', border:'1px solid black', borderCollapse:'collapse'}}>Date of Exp.</td>
                                                {/* <td style={{textAlign:'center', width:'40%', border:'1px solid black', borderCollapse:'collapse'}}>Source / Sender</td> */}
                                            </tr>
                                            <tr>
                                                <td style={{width:'15%', border:'1px solid black', borderCollapse:'collapse'}}>{this.state.data?.NMQALLogs[0]?.log_report_no}</td>
                                                <td style={{width:'15%', border:'1px solid black', borderCollapse:'collapse'}}>{this.state.data?.NMQALLogs[0]?.QualityIncident?.ItemSnapBatch?.batch_no}</td>
                                                <td style={{width:'15%', border:'1px solid black', borderCollapse:'collapse'}}>{dateParse(this.state.data?.NMQALLogs[0]?.QualityIncident?.ItemSnapBatch?.mfd)}</td>
                                                <td style={{width:'15%', border:'1px solid black', borderCollapse:'collapse'}}>{dateParse(this.state.data?.NMQALLogs[0]?.QualityIncident?.ItemSnapBatch?.exd)}</td>
                                                {/* <td style={{textAlign:'center', width:'40%', border:'1px solid black', borderCollapse:'collapse'}}>Source / Sender</td> */}
                                            </tr>
                                        {/* {this.state.data.NMQALLogs.map((element) => {
                                                <tr>
                                                <td style={{width:'15%', fontWeight:'bold', border:'1px solid black', borderCollapse:'collapse', textAlign:'center'}}>{element?.log_report_no}</td>
                                                <td style={{width:'15%', fontWeight:'bold', border:'1px solid black', borderCollapse:'collapse', textAlign:'center'}}>{element?.QualityIncident?.ItemSnapBatch?.batch_no}</td>
                                                <td style={{width:'15%', fontWeight:'bold', border:'1px solid black', borderCollapse:'collapse', textAlign:'center'}}>{dateParse(element?.QualityIncident?.ItemSnapBatch?.mfd)}</td>
                                                <td style={{width:'15%', fontWeight:'bold', border:'1px solid black', borderCollapse:'collapse', textAlign:'center'}}>{dateParse(element?.QualityIncident?.ItemSnapBatch?.exd)}</td>
                                                <td style={{textAlign:'center', width:'40%', fontWeight:'bold', border:'1px solid black', borderCollapse:'collapse'}}>{}</td>
                                                </tr>
                                        })} */}
                                          
                                        </table>

                                        <table style={{width:'100%'}}>
                                            <tr>
                                                <td style={{width:'30%'}}><p>4.REASON FOR SENDING</p></td>
                                                <td style={{width:'70%', fontWeight:'bold'}}><p>:{this.state.data?.reason_for_sending}</p></td>
                                            </tr>
                                            <tr>
                                                <td style={{width:'30%'}}><p>5.ANALYTICAL REPORT</p></td>
                                                <td style={{width:'70%', fontWeight:'bold'}}><p>:{this.state.data?.analytical_report}</p></td>
                                            </tr>
                                            <tr>
                                                <td style={{width:'30%'}}><p className="mb-0 pb-0">6.PREVIOUS COMPLAINT ON SAME PRODUCT & SAME MANUFACTURER</p></td>
                                                <td style={{width:'70%', fontWeight:'bold'}}><p className="mb-0 pb-0">:{}</p></td>
                                            </tr>
                                            <tr>
                                                <td style={{width:'30%'}}>batch Failed in</td>
                                                <td style={{width:'70%', fontWeight:'bold'}}>:{}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width:'30%'}}><p className="mb-0 pb-0">7.NMQAL RECOMMENDATIONS</p></td>
                                                <td style={{width:'70%', fontWeight:'bold'}}><p className="mb-0 pb-0">:{this.state.data?.nmqal_recommendations}</p></td>
                                            </tr>
                                            <tr>
                                                <td style={{width:'30%'}}><p className="mb-0 pb-0">8.NMQAL REQUESTS</p></td>
                                                <td style={{width:'70%', fontWeight:'bold'}}><p className="mb-0 pb-0">:{this.state.data?.nmqal_remarks}</p></td>
                                            </tr>
                                        </table>
                                    </Grid>

                                    <Grid item sm={12} className="mt-10">
                                        <p className="m-0 p-0">Director/National Medicines Quality Assurance Labotary</p>
                                        <table style={{width:'100%'}}>
                                            <tr>
                                                <td style={{width:'10%'}}>Copy to</td>
                                                <td style={{width:'90%'}}><spam style={{fontWeight:'bold'}}>Director, Medical Supplies Division</spam> with the original report</td>
                                            </tr>
                                            <tr>
                                                <td style={{width:'10%'}}>o.c.</td>
                                                <td style={{width:'90%'}}>:......................................................................................................................</td>
                                            </tr>
                                        </table>
                                    </Grid>

                                    <Grid item sm={12} className="mt-10">
                                        <p style={{fontWeight:'bold', textAlign:'center'}}><spam style={{fontStyle: 'italic'}}>National Medicines Quality Assurance Labotary,</spam> NMRA, Sri Lanka.</p>
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

export default NMQAL
;