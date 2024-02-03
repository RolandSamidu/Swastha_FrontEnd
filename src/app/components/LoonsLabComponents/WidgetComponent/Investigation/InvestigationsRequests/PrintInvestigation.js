/*
Loons Lab Sub title component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import { Divider, Typography, Grid, IconButton, Icon, } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any, string } from "prop-types";
import defaultLetterHead from '../InvestigationsRequests/defaultLetterHead.jpg';
import defaultFooter from '../InvestigationsRequests/defaultFooter.jpg';
import { Button, LoonsCard, SubTitle } from "app/components/LoonsLabComponents";
import Barcode from 'react-jsbarcode';
import UtilityServices from "app/services/UtilityServices";
import localStorageService from "app/services/localStorageService";
import moment from "moment";
import ExaminationServices from 'app/services/ExaminationServices'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { dateParse } from "utils";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

class NewlineText extends Component {

}



class PrintInvestigation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            consultant: null,
            allergies: [],
            problemList: [],
            complaints: [],
            note: "",
            loaded: false,
        }
    }

    static propTypes = {
        header: any,
        footer: any,
        ref: any,
        testList: any,
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
            testList,
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
            height: 40px;
          }

          .footerImage{
            height: 50px;
            bottom: 0;
          }
          .footer {
            position: fixed;
            bottom: 0;
          }
          .bg-gray {
            background: rgba(0, 0, 0, 0.15) !important;
        }
   
  }
`;


        return (
            <div >



                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid className="w-full justify-end items-end flex pb-5">
                        <ReactToPrint
                            trigger={() => <Button id="print_presc_001" size="small" /* startIcon="print" */>Send to Sample Collect</Button>}
                            pageStyle={pageStyle}
                            documentTitle={letterTitle}
                            //removeAfterPrint
                            content={() => this.componentRef}
                        />
                    </Grid>
                    <Grid className="bg-light-gray p-5 hidden" style={{ borderStyle: 'double', borderColor: "#a5a4a4" }} >
                        <div className="bg-white p-5" >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                    <div class="header-space flex ">

                                        <div className="pl-10" style={{ width: "60%" }}>
                                            <img alt="A test image" src={header} style={{ width: '100%' }} />
                                        </div>
                                        <div className="pt-5 pl-5" style={{ width: "40%" }} >
                                            <Barcode
                                                value={patientInfo?.phn}
                                                //value="15496344"
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

                                                <div className="w-full bg-gray px-2 pt-1 pb-1 " >
                                                    <h5 className="mb-0">Patient Info</h5>
                                                </div>
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr>
                                                            <td className="w-100 font-bold  text-12">Name</td>
                                                            <td className="w-1 text-14">:</td>
                                                            <td className="text-14">{patientInfo?.name}</td>{/**My No value */}

                                                            <td className="w-100 font-bold text-12">Age</td>
                                                            <td className="w-1 text-14">:</td>
                                                            <td className="text-14">{patientInfo?.age}</td>{/**Your No value */}

                                                        </tr>

                                                        <tr>
                                                            <td className="w-100 font-bold text-12">Address</td>
                                                            <td className="w-1 text-14">:</td>
                                                            <td className="text-14">{patientInfo?.address}</td>{/**My No value */}

                                                            {/*   <td className="w-100 font-bold text-12">Clinic</td>
                                                            <td className="w-1 text-14">:</td>
                                                            <td className="text-14">{clinic?.name}</td> */}

                                                        </tr>



                                                        <tr>
                                                            <td className="w-100 font-bold text-12">Consultant</td>
                                                            <td className="w-1 text-14">:</td>
                                                            <td className="text-14">{this.state.consultant?.name}</td>{/**My No value */}

                                                        </tr>


                                                    </tbody>

                                                </table>






                                                <div className="w-full bg-gray px-2 pt-1 pb-1 mt-5" >
                                                    <h5 className="mb-0">Investigations</h5>
                                                </div>

                                                <table className="w-full px-2 mt-2">
                                                    <tbody className="w-full ">
                                                        <tr className="w-full pb-10" >
                                                            <td className="text-12 font-bold w-full" ></td>

                                                        </tr>


                                                        {
                                                            //testList?.filter((ele) => ele.availability == false).map((drug, index) =>
                                                            testList?.map((item, index) =>
                                                                <tr>
                                                                    <td className="text-12 w-full">{item.test_name}</td>
                                                                </tr>

                                                            )
                                                        }


                                                    </tbody>
                                                    <tfoot><tr><td>
                                                        <div class="footer-space"> </div>
                                                    </td></tr></tfoot>
                                                </table>

                                                {/* Letter Address */}


                                                {/* <Grid container>
                                                    <div className="w-full bg-gray px-2 pt-1 pb-1 " >
                                                        <h5 className="mb-0">Note</h5>
                                                    </div>
                                                    <Grid container>

                                                        <div className='px-2  border-radius-8 text-12' >
                                                            {this.state.note}</div>

                                                    </Grid>
                                                </Grid> */}





                                            </div>
                                        </td></tr></tbody>
                                        <tfoot><tr><td>
                                            <div class="footer-space"> </div>
                                        </td></tr></tfoot>
                                    </table>


                                    <table className="w-full pl-20">
                                        <tbody>
                                            <tr>
                                                <td className="w-100 font-bold  text-12">Prescribed Date</td>
                                                <td className="w-1 text-14">:</td>
                                                <td className="text-14">{moment(new Date()).format('yyyy-MM-DD')}</td>{/**My No value */}

                                                <td className="w-100 font-bold text-12"></td>
                                                <td className="w-1 text-14"></td>
                                                <td className="text-14">{this.state.consultant?.name}</td>{/**Your No value */}

                                            </tr>

                                        </tbody>
                                        <tfoot><tr><td>
                                            <div class="footer-space"> </div>
                                        </td></tr></tfoot>
                                    </table>

                                    {/* <div class="footer">

                                            <img className="footerImage " alt="A test image" src={footer} style={{ width: '100%' }} />
                                        </div>
 */}
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>



            </div>
        );
    }
}

export default PrintInvestigation;