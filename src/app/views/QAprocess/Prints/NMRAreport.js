/*
Loons Lab Hospitaldirecter
Developed By Dinusha
Loons Lab
*/
import React, { Component } from "react";
import { Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PrintIcon from '@mui/icons-material/Print';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import {
    LoonsTable,
    DatePicker,
    Button,
    FilePicker,
    ExcelToTable,
    LoonsSnackbar,
    LoonsDialogBox,
    LoonsSwitch,
    LoonsCard,
    CardTitle,
    SubTitle,
    Charts,
}
    from "app/components/LoonsLabComponents";
import { dateParse, dateTimeParse } from '../../../../utils'

class NMRAreport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            itemData: [],
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


    componentDidMount() {
        let data = this.props.data

        let itemData = this.props.itemDetails
        console.log('data50', data)
        console.log('data50', itemData)
        this.setState({
            data: data,
            itemData: itemData
        })
    }

    render() {
        const {
            product,
            manufacturer,
            batchNumber,
            defect,
            tel,
            fax,
            web,
            mail,
            number,
            yourNumber,
            date
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
                        trigger={() => <Button id="print_presc_004" color="primary" >Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                <Grid className="bg-light-gray p-5" hidden >
                    <div className="bg-white p-5" >
                        <div>

                            <div ref={(el) => (this.componentRef = el)} >

                                <Grid className="w-full">

                                    <Grid container direction="column" alignItems="center" justifyContent="center">

                                        <Grid item sm={12}>
                                            <img style={{ width: '40px', justifyContent: "center" }} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE3VESCYOk9woC50uW6y8dDWaJsUia_AW6rBZ4zWx3eimXu91edE5w1qlzelphC2Ax-0c&usqp=CAU" alt="logo" />
                                        </Grid>

                                        <Grid item>
                                            <p className="m-0 p-0" style={{ fontSize: '12px', textAlign: "center" }}>ජාතික ඖෂධ නියාමන අධිකාරිය</p>
                                            <p className="m-0 p-0" style={{ fontSize: '12px', textAlign: "center" }}>National Medicines Regulatory Authority</p>
                                            <p className="m-0 p-0" style={{ fontSize: '12px', textAlign: "center" }}>தேசிய மருந்து ஒழுங்குமுறை ஆணையம்</p>
                                        </Grid>

                                    </Grid>

                                    <Grid container>
                                        <hr style={{ width: "100%" }} />
                                    </Grid>

                                    <Grid container>

                                        <Grid item sm={12}>
                                            <table style={{ width: '100%' }}>
                                                <tr>
                                                    <td style={{ width: '9%', borderRight: "1px solid black" }}>
                                                        <p className="m-0 p-0" style={{ fontSize: '12px', }}>අංකය :</p>
                                                        <p className="m-0 p-0" style={{ fontSize: '12px', }}>No. :</p>
                                                    </td>
                                                    <td style={{ width: '15%', fontSize: '12px', }}>{this.state.data?.nmra_no}</td>

                                                    <td style={{ fontSize: '12px', width: '16%', borderRight: "1px solid black" }}>
                                                        <p className="m-0 p-0" style={{ fontSize: '12px', }}>ඔබේ අංකය :</p>
                                                        <p className="m-0 p-0" style={{ fontSize: '12px', }}>Your No. :</p>
                                                        <p className="m-0 p-0" style={{ fontSize: '12px', }}>உங்கள் எண் :</p>
                                                    </td>
                                                    <td style={{ width: '38%', fontSize: '12px', }}>{ }</td>

                                                    <td style={{ fontSize: '12px', width: '7%', borderRight: "1px solid black" }}>
                                                        <p className="m-0 p-0" style={{ fontSize: '12px', }}>දිනය :</p>
                                                        <p className="m-0 p-0" style={{ fontSize: '12px', }}>Date :</p>
                                                        <p className="m-0 p-0" style={{ fontSize: '12px', }}>தேதி :</p>
                                                    </td>
                                                    <td style={{ fontSize: '12px', width: '15%' }}>{dateParse(this.state.data?.createdAt)}</td>
                                                </tr>
                                            </table>
                                        </Grid>

                                        <Grid item sm={12} className="mt-5 ml-15 mr-15">

                                            <table style={{ width: "100%" }}>
                                                <tr>
                                                    <td style={{ width: "50%" }}>
                                                        <p style={{ fontSize: '12px', }} className="m-0 p-0">The Manager</p>
                                                        <p style={{ fontSize: '12px', }} className="m-0 p-0">Nation Pharma Pvt Ltd</p>
                                                        <p style={{ fontSize: '12px', }} className="m-0 p-0">376-1/2</p>
                                                        <p style={{ fontSize: '12px', }} className="m-0 p-0">Dematagoda Rd</p>
                                                        <p style={{ fontSize: '12px', }} className="m-0 p-0">Colombo 09</p>
                                                    </td>
                                                    <td style={{ width: "50%", textAlign: "center" }}>
                                                        <p style={{ fontWeight: "bold", fontSize: '20px', border: "4px solid black", width: "150px", padding: "5px", textAlign: "center" }}>Very Urgent</p>
                                                    </td>
                                                </tr>
                                            </table>

                                        </Grid>

                                        <Grid item sm={12} className="mt-3 pl-15 pr-15">
                                            <p className="m-0 p-0" style={{ fontWeight: "bold", textDecoration: "underline", fontSize: '12px', }}>{this.state.data?.nmra_final_decision}</p>
                                            <p style={{ fontSize: '12px', }} className="m-0 p-0">With reference to NMQAL report on failing sample bearing NDL/B/DU/F5/90 dated</p>
                                            <p style={{ fontSize: '12px', }} className="m-0 p-0">23-03-2022</p>
                                        </Grid>

                                        <Grid item sm={12} className="mt-3 ml-15 mr-15">
                                            <table style={{ width: "100%", fontWeight: "bold", fontSize: '12px', }}>
                                                <tr>
                                                    <td className="m-0 p-0" style={{ width: "20%" }}>Product</td>
                                                    <td className="m-0 p-0" style={{ width: "80%" }}>:
                                                        <div dangerouslySetInnerHTML={{ __html: this.state.itemData?.QualityIncident?.ItemSnapBatch?.ItemSnap?.specification }} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="m-0 p-0" style={{ width: "20%" }}>Manufacturer</td>
                                                    <td className="m-0 p-0" style={{ width: "80%" }}>: {manufacturer}</td>
                                                </tr>
                                                <tr>
                                                    <td className="m-0 p-0" style={{ width: "20%" }}>Batch Number</td>
                                                    <td className="m-0 p-0" style={{ width: "80%" }}>: {this.state.itemData?.QualityIncident?.ItemSnapBatch?.batch_no}</td>
                                                </tr>
                                                <tr>
                                                    <td className="m-0 p-0" style={{ width: "20%" }}>Failure/Defect</td>
                                                    <td className="m-0 p-0" style={{ width: "80%" }}> : {this.state.itemData?.QualityIncident?.defects}</td>
                                                </tr>
                                            </table>
                                        </Grid>

                                        <Grid item sm={12} className="mt-2 pl-10 pr-10">
                                            <p className="p-3" style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "12px" }}>As the market authorization holder, you must ensure that the batch is withdrawn in the entier private sector immediately.</p>
                                        </Grid>

                                        <Grid item sm={12} className="mt-2 pl-15 pr-15">
                                            <p className="m-0 p-0" style={{ fontSize: '12px', fontWeight: "bold" }}>As such, you are hereby instructed to :</p>
                                            <p className="m-0 p-0 ml-3" style={{ fontSize: '12px', fontWeight: "bold" }}>a) Widthdraw above batch from use immediatly.</p>
                                            <p style={{ fontSize: '12px', }} className="m-0 p-0 ml-3">b) Furnish consignment details of the above batch under the following headings.</p>
                                            <p style={{ fontSize: '12px', }} className="m-0 p-0 ml-8"><em>Quantity imported/Batch No. / Date of manufacturer/Date of expiry/Quantity available/Distributed</em></p>
                                            <p className="m-0 p-0 ml-3">c) <spam style={{ fontSize: '12px', fontWeight: "bold" }}>Furnish explanation of the manufactirer withing 28 days</spam>of receving this letter to <spam style={{ fontSize: '12px', fontWeight: "bold" }}>D/NMQAL</spam> with a copy to me.</p>
                                        </Grid>

                                        <Grid item sm={12} className="mt-15 pl-15 pr-15">
                                            <p className="m-0 p-0">CEO-NMRA</p>
                                        </Grid>

                                        <Grid item sm={12} className="mt-3 pl-15 pr-15">
                                            <table style={{ width: "100%", fontSize: '12px', }}>
                                                <tr>
                                                    <td style={{ width: "33.33%" }} className="m-0 p-0">Copies:</td>
                                                    <td style={{ width: "33.33%" }} className="m-0 p-0"></td>
                                                    <td style={{ width: "33.33%" }} className="m-0 p-0"></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: "33.33%" }} className="m-0 p-0">1.Hon. Ministrer of Health</td>
                                                    <td style={{ width: "33.33%" }} className="m-0 p-0">2.Hon.State Minister</td>
                                                    <td style={{ width: "33.33%" }} className="m-0 p-0">3.Secretary/Health</td>
                                                </tr>
                                            </table>
                                            <tr>
                                                <td style={{ width: "33.33%" }} className="m-0 p-0">4.Secretary - State ministry</td>
                                                <td style={{ width: "33.33%" }} className="m-0 p-0">5.D.G.H.S</td>
                                                <td style={{ width: "33.33%" }} className="m-0 p-0">6.Asst. Secretary-Procurement</td>
                                            </tr>
                                            <tr>

                                                <td style={{ width: "33.33%" }} className="m-0 p-0">7.Chairemen/SPC-f.i & n.a.</td>
                                                <td style={{ width: "33.33%" }} className="m-0 p-0">8.DDG (MS)</td>
                                                <td style={{ width: "33.33%" }} className="m-0 p-0">9.D/MSD - f.i & n.a</td>
                                            </tr>
                                            <tr>

                                                <td style={{ width: "33.33%" }} className="m-0 p-0">10.D/NMQAL - f.i</td>
                                                <td style={{ width: "33.33%" }} className="m-0 p-0">11.All PDHSS & RDSS (MS)</td>
                                                <td style={{ width: "33.33%" }} className="m-0 p-0">12.D/PHSD - to inform all relevant private sector health institutions</td>
                                            </tr>
                                            <tr>

                                                <td style={{ width: "33.33%" }} className="m-0 p-0">13.C/F & DI (NMRA)</td>
                                                <td style={{ width: "33.33%" }} className="m-0 p-0">14.Chies Pharmacist(NMRA)</td>
                                                <td style={{ width: "33.33%" }} className="m-0 p-0">15.C/HMA (NMRA)- f.i & to be attached to the dossier</td>
                                            </tr>
                                            <tr>

                                                <td style={{ width: "33.33%" }} className="m-0 p-0">16.Web Manager (NMRA) - to publish in the web</td>
                                                <td style={{ width: "33.33%" }} className="m-0 p-0">17.NRA-India</td>
                                                <td style={{ width: "33.33%" }} className="m-0 p-0"></td>
                                            </tr>
                                        </Grid>

                                        <Grid item sm={12} className="mt-3">
                                            <table style={{ width: "100%", fontSize: '12px', }}>
                                                <tr>
                                                    <td style={{ width: "25%" }}>
                                                        <LocalPhoneIcon size="small" style={{ border: "1px solid black", borderRadius: "50px", padding: "2px" }} />
                                                        {tel}
                                                    </td>
                                                    <td style={{ width: "25%" }}>
                                                        <PrintIcon size="small" style={{ border: "1px solid black", borderRadius: "50px", padding: "2px" }} />
                                                        {fax}
                                                    </td>
                                                    <td style={{ width: "25%" }}>
                                                        <LanguageIcon size="small" style={{ border: "1px solid black", borderRadius: "50px", padding: "2px" }} />
                                                        {web}
                                                    </td>
                                                    <td style={{ width: "25%" }}>
                                                        <EmailIcon size="small" style={{ border: "1px solid black", borderRadius: "50px", padding: "2px" }} />
                                                        {mail}
                                                    </td>
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

export default NMRAreport
    ;