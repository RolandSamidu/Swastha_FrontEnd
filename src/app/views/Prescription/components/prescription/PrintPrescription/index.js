/*
Loons Lab Sub title component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import { Divider, Typography, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any, string } from "prop-types";
import defaultLetterHead from '../PrintPrescription/defaultLetterHead.jpg';
import defaultFooter from '../PrintPrescription/defaultFooter.jpg';
import { Button } from "app/components/LoonsLabComponents";
import Barcode from 'react-jsbarcode';
import UtilityServices from "app/services/UtilityServices";
import localStorageService from "app/services/localStorageService";
import moment from "moment";
class NewlineText extends Component {

}



class PrintPrescription extends Component {
    constructor(props) {
        super(props)
        this.state = {
            consultant: null
        }
    }

    static propTypes = {
        header: any,
        footer: any,
        ref: any,
        drugList: any,
        patientInfo: any,
        clinic: any,
        printFunction: Function,
        refferenceSection: Boolean,
        myNo: String,
        yourNo: String,
        date: String,
        address: String,
        title: String,
        letterBody: String,
        signature: String,
        letterTitle: String
    };

    static defaultProps = {
        header: defaultLetterHead,
        footer: defaultFooter,
        refferenceSection: false,
        myNo: null,
        yourNo: null,
        date: null,
        address: null,
        title: null,
        letterBody: null,
        signature: null,
        letterTitle: null
    };

    newlineText(text) {
        if (text) {
            return text.split('\n').map(str => <p>{str}</p>);
        } else {
            return ""
        }
    }

    printFunction() {
        // document.getElementById('print_presc_001').click();
        console.log("okkk")
    }
    async getConsultant() {
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        this.setState({ consultant: user })
    }

    componentDidMount() {
        this.getConsultant()
    }

    render() {
        const {
            header,
            footer,
            refferenceSection,
            myNo,
            yourNo,
            date,
            address,
            title,
            letterBody,
            signature,
            letterTitle,
            drugList,
            patientInfo,
            clinic
        } = this.props;
        /*  size: 297mm 420mm; */
        const pageStyle = `
 
 @page {
    
    margin-left:10mm;
    margin-right:5mm;
    margin-bottom:5mm;
    margin-top:8mm;
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
   
  }
`;


        return (
            <div className="hidden">
                <Grid className="w-full justify-end items-end flex pb-5">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_003" size="small" startIcon="print">Print</Button>}
                        pageStyle={pageStyle}
                        documentTitle={letterTitle}
                        //removeAfterPrint
                        content={() => this.componentRef}
                    />
                </Grid>
                <Grid className="bg-light-gray p-5 " style={{ borderStyle: 'double', borderColor: "#a5a4a4" }} >
                    <div className="bg-white p-5" >
                        <div>

                            <div ref={(el) => (this.componentRef = el)} >
                                <div class="header-space flex ">

                                    <div className="pl-10" style={{ width: "60%" }}>
                                        <img alt="A test image" src={header} style={{ width: '100%' }} />
                                    </div>
                                    <div className="pt-5 pl-5" style={{ width: "40%" }} >
                                        <Barcode value={patientInfo?.phn}
                                            options={{
                                                format: 'code128',
                                                width: 2,
                                                height: 25,
                                                displayValue: true,
                                                fontSize: 16
                                            }}
                                            renderer="svg" />
                                    </div>

                                </div>






                                <table className="w-full">
                                    <thead><tr><td>

                                    </td></tr></thead>
                                    <tbody><tr><td>
                                        <div className="content pl-10 pr-5">
                                            {/*  Letter refferences section */}


                                            <table className="w-full">
                                                <tbody>
                                                    <tr>
                                                        <td className="w-100 font-bold  text-12">Name</td>
                                                        <td className="w-1 text-14">:</td>
                                                        <td className="text-14">{patientInfo?.name}</td>{/**My No value */}

                                                        <td className="w-100 font-bold text-12">PHN</td>
                                                        <td className="w-1 text-14">:</td>
                                                        <td className="text-14">{patientInfo?.phn}</td>{/**Your No value */}

                                                    </tr>

                                                    <tr>
                                                        <td className="w-100 font-bold text-12">Address</td>
                                                        <td className="w-1 text-14">:</td>
                                                        <td className="text-14">{patientInfo?.address}</td>{/**My No value */}

                                                        <td className="w-100 font-bold text-12">Age</td>
                                                        <td className="w-1 text-14">:</td>
                                                        <td className="text-14">{patientInfo?.age}</td>{/**Your No value */}

                                                    </tr>

                                                    <tr>
                                                        <td className="w-100 font-bold text-12">Clinic</td>
                                                        <td className="w-1 text-14">:</td>
                                                        <td className="text-14">{clinic?.name}</td>{/**My No value */}

                                                    </tr>

                                                    <tr>
                                                        <td className="w-100 font-bold text-12">Consultant</td>
                                                        <td className="w-1 text-14">:</td>
                                                        <td className="text-14">{this.clinic?.consultant}</td>{/**My No value */}

                                                    </tr>


                                                </tbody>
                                            </table>





                                            <table className="w-full px-20 mt-20">
                                                <tbody className="w-full ">
                                                    <tr className="w-full pb-10" >
                                                        <td className="text-12 font-bold w-full" >Drug</td>

                                                        <td className="text-12 font-bold pr-10 ">Dosage</td>
                                                        <td className="text-12 font-bold pr-10">Frequency</td>
                                                        <td className="text-12 font-bold pr-10  ">Duration</td>
                                                        <td className="text-12 font-bold pr-10 "></td>
                                                    </tr>


                                                    {
                                                        // drugList?.filter((ele) => ele.availability==false).map((drug, index) =>
                                                        drugList?.map((drug, index) =>
                                                            drug.params.map((drugparam, index2) =>
                                                                <tr>
                                                                    <td className="text-12 w-full">{drug.drug}</td>
                                                                    <td className="text-12 w-120">{drugparam.dosage + " " + drug.uom}</td>
                                                                    <td className="text-12 w-120">{drugparam.frequency}</td>
                                                                    <td className="text-12 w-120">{drugparam.duration + "day/s"}</td>
                                                                    <td className="text-12 w-120">{drug.availability == false ? "OS" : ""}</td>

                                                                </tr>
                                                            )
                                                        )
                                                    }


                                                </tbody>
                                            </table>

                                            {/* Letter Address */}








                                        </div>
                                    </td></tr></tbody>
                                    <tfoot><tr><td>
                                        <div class="footer-space"> </div>
                                    </td></tr></tfoot>
                                </table>

                                <div class="footer">
                                    <table className="w-full pl-20">
                                        <tbody>
                                            <tr>
                                                <td className="w-100 font-bold  text-12">Prescribed Date</td>
                                                <td className="w-1 text-14">:</td>
                                                <td className="text-14">{moment(date).format('yyyy-MM-DD')}</td>{/**My No value */}

                                                <td className="w-100 font-bold text-12">Consultant</td>
                                                <td className="w-1 text-14">:</td>
                                                <td className="text-14">{this.state.consultant?.name}</td>{/**Your No value */}

                                            </tr>

                                        </tbody>
                                    </table>
                                    <img className="footerImage " alt="A test image" src={footer} style={{ width: '100%' }} />
                                </div>

                            </div>
                        </div>
                    </div>
                </Grid>
            </div>
        );
    }
}

export default PrintPrescription;