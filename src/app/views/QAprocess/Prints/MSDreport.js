/*
Loons Lab Hospitaldirecter
Developed By Dinusha
Loons Lab
*/
import React, { Component } from "react";
import { Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import { batch } from "react-redux";
import {Button} from '../../../components/LoonsLabComponents'
import { dateParse } from "utils";
class MSDreport extends Component {
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
        let data = this.props.data
        console.log('dataNew',data)
        this.setState({
            data:data[0]
        })
    }

    render() {
        const {
            myNo,
            circularNo,
            address,
            medicine,
            msdOderListNo,
            poOrderNo,
            sr,
            batchNo,
            manufacturer,
            manufacturerDate,
            expiryDate,
            nmqalNo,
            analyticalReport,
            nmqalRecom,
            ceoNmraInstruction
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
                <Grid className="w-full justify-end items-end flex mt-6 ">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_004" color="secondary" size="small" >Print Circular</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray p-5" hidden >
                        <div className="bg-white p-5" >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                    <Grid className="w-full">   

                                        <Grid container>

                                            <Grid item sm={12}>
                                                <table style={{width: "100%"}}>
                                                    <tr>
                                                        <td style={{width:"50%"}}>
                                                        <p className="m-0 p-0 mt-1m-0 p-0 0"> Circular No: <spam style={{fontWeight:"bold"}}>{circularNo}</spam></p>
                                                            <p className="mt-3">To:</p>
                                                            <p className="m-0 p-0 ml-3">{address}</p>
                                                        </td>
                                                        <td style={{width:"50%"}}>
                                                        <p className="m-0 p-0">My No: {myNo}</p>
                                                            <p className="m-0 p-0">Medical Supplies Division</p>
                                                            <p className="m-0 p-0">357, Ven. Baddegama Wimalawansa Thero Mawatha,</p>
                                                            <p className="m-0 p-0">Colombo 10</p>
                                                            <p className="m-0 p-0">Tel: (011)2694114/13</p>
                                                            <p className="m-0 p-0">30-03-2022</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </Grid>

                                            <Grid item sm={12}>
                                                <p className="m-0 p-0" style={{fontWeight: "bold", textDecoration:"underline"}}>REPORT ON FAILING SAMPLE - {medicine}</p>
                                                <p className="m-0 p-0" style={{fontWeight: "bold", textDecoration:"underline"}}>MSD ORDER LIST NO: {msdOderListNo} - PA Order No: {poOrderNo}</p>
                                            </Grid>

                                            <Grid item sm={12}>
                                                <p className="m-0 p-0">1. Re-above, details of the report received from Director / NMQAL (Quality log No: 3494) are given below for your information piease.</p>
                                            </Grid>

                                            <Grid item sm={12} className="ml-5">
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{width:"30%", textAlign:"left"}}><p className="m-0 p-0">1.1) Name of the product / item</p></td>
                                                        <td style={{width:"70%", textAlign:"left"}}>:
                                                        <div dangerouslySetInnerHTML={{ __html: this.state.data?.QualityIncident?.ItemSnapBatch?.ItemSnap?.specification}} />
                               </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"30%", textAlign:"left"}}><p className="m-0 p-0 ml-6">SR</p></td>
                                                        <td style={{width:"70%", textAlign:"left"}}><p className="m-0 p-0" style={{fontWeight:"bold"}}>:{this.state.data?.QualityIncident?.ItemSnapBatch?.ItemSnap?.sr_no}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"30%", textAlign:"left"}}><p className="m-0 p-0">1.2) Manufacturer</p></td>
                                                        <td style={{width:"70%", textAlign:"left"}}><p className="m-0 p-0">:{manufacturer}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"30%", textAlign:"left"}}><p className="m-0 p-0">1.3) Batch No</p></td>
                                                        <td style={{width:"70%", textAlign:"left"}}><p className="m-0 p-0">:{this.state.data?.QualityIncident?.ItemSnapBatch?.batch_no}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"30%", textAlign:"left"}}><p className="m-0 p-0">1.4) Date of Manufacturer</p></td>
                                                        <td style={{width:"70%", textAlign:"left"}}><p className="m-0 p-0">:{dateParse(this.state.data?.QualityIncident?.ItemSnapBatch?.mfd)}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"30%", textAlign:"left"}}><p className="m-0 p-0">1.5) Date of Expiry</p></td>
                                                        <td style={{width:"70%", textAlign:"left"}}><p className="m-0 p-0">:{dateParse(this.state.data?.QualityIncident?.ItemSnapBatch?.exd)}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"30%", textAlign:"left"}}><p className="m-0 p-0">1.6) NMQAL LR No</p></td>
                                                        <td style={{width:"70%", textAlign:"left"}}><p className="m-0 p-0">:{this.state.data?.log_report_no}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"30%", textAlign:"left"}}>1.7)<p className="m-0 p-0">Analytical Report</p> </td>
                                                        <td style={{width:"70%", textAlign:"left"}}><p className="m-0 p-0">:{analyticalReport}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"30%", textAlign:"left"}}>1.8)<p className="m-0 p-0"> NMQAL Recommendation</p></td>
                                                        <td style={{width:"70%", textAlign:"left"}}><p className="m-0 p-0">:{nmqalRecom}</p></td>
                                                    </tr>
                                                </table>
                                            </Grid>

                                            <Grid item sm={12}>
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{width:"30%"}}>
                                                            <p>2. CEO-NMRA instraction</p>
                                                        </td>
                                                        <td style={{width:"70%"}}>
                                                            <p>:{ceoNmraInstruction}</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </Grid>

                                            <Grid item sm={12}>
                                                <p>3. Considering above fgacts, you are requested the following.</p>
                                            </Grid>

                                            <Grid item sm={12} className="ml-5">
                                                <p className="m-0 p-0" style={{fontWeight:"bold"}}>3.1) To withdraw the above batch from use immediately.</p>
                                                <p className="m-0 p-0">3.2) To inform details of all datches available of this product to D/NMQAL, 120 Norris Canal Road, Colombo 10, to enable them to select samples for further testing and provide sample on request to NMQAL.</p>
                                            </Grid>

                                            <Grid item sm={12}>
                                                <p>4. Please note: it would be your responsibility.</p>
                                            </Grid>

                                            <Grid item sm={12} className="ml-5">
                                                <p className="m-0 p-0">4.1) To follow the instructions given by Secretary of Health, under the circular No: 01/2021 dated 08.12.2021</p>
                                            </Grid>

                                            <Grid item sm={12}>
                                                <p>5. 5.1) Please bring the contents of the circular to all concerned in your Province/ Region/ Institution</p>
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

export default MSDreport

;