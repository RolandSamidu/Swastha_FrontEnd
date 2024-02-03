/*
Loons Lab Sub title component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import { Divider, Typography, Grid, IconButton, Icon, } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any, string } from "prop-types";
import defaultLetterHead from '../Summary/defaultLetterHead.jpg';
import defaultFooter from '../Summary/defaultFooter.jpg';
import { Button, LoonsCard, SubTitle } from "app/components/LoonsLabComponents";
import Barcode from 'react-jsbarcode';
import UtilityServices from "app/services/UtilityServices";
import localStorageService from "app/services/localStorageService";
import moment from "moment";
import ExaminationServices from 'app/services/ExaminationServices'
import EmployeeServices from "app/services/EmployeeServices";
import EHRServices from "app/services/EHRServices";
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { dateParse } from "utils";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

class NewlineText extends Component {

}



class PatientSummaryNew extends Component {
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
        let res = await EmployeeServices.getEmployeeByID(user.id)
        user.contact_no = res.data.view.contact_no

        this.setState({ consultant: user })
    }


    async loadData() {

        let params = {
            patient_id: window.dashboardVariables.patient_id,
            question: ['problems', 'diagnosis', 'complications', 'Drug Allergies', 'complaints'],
            //limit: 10
        }


        let res;
        if (this.props.loadFromCloud) {

            res = await ExaminationServices.getDataFromCloud(params)
        } else {

            res = await ExaminationServices.getData(params)
        }
        //console.log("Examination Data ", res)
        if (200 == res.status) {

            console.log("Examination Data Allergies", res.data.view.data)
            res.data.view.data.forEach(element => {
                if (element.question == 'Drug Allergies') {
                    this.state.allergies.push(element)
                    // this.setState({ allergies: res.data.view.data })
                } else if (element.question == 'problems') {
                    this.state.problemList.push(element.other_answers)
                } else if (element.question == "diagnosis") {
                    this.state.problemList.push({ problem: element.other_answers.diagnosis, duration: "" })
                } else if (element.question == "complications") {
                    this.state.problemList.push({ problem: element.other_answers.complication, duration: element.other_answers.duration })
                } else if (element.question == 'complaints') {
                    //this.state.complaints.push(element.other_answers)
                }

            });
            this.setState({ loaded: true })
            if (this.props.patientSubmitForEMR) {

                this.submitForEMR()
            }


        }



    }

    async submitForEMR() {
        var user = await localStorageService.getItem('userInfo');
        let hospital_id=await localStorageService.getItem('main_hospital_id');

        let formData = {
            clinic_id: this.props.clinic.clinic_id,
            "doctor_id": user.id,
            "patient_id": this.props.patientInfo.id,
            "hospital_id": hospital_id,
            "type": "Summary",
            "owner_id": this.props.clinic.owner_id,
            "data": {
                allergies: this.state.allergies,
                problemList: this.state.problemList,
                patientInfo: this.props.patientInfo,
                drugList: this.props.drugList,
                clinic: this.props.clinic,
                doctor: user.name,
            }
        }

        console.log("patient Data", formData)
        let res = await EHRServices.uploadData(formData);
        console.log("EHR res", res)
       
    }

    async loadComplaints() {

        let params = {
            patient_id: window.dashboardVariables.patient_id,
            question: 'complaints',
            createdAt: dateParse(new Date())
            //limit: 10
        }


        let res;
        if (this.props.loadFromCloud) {

            res = await ExaminationServices.getDataFromCloud(params)
        } else {

            res = await ExaminationServices.getData(params)
        }
        //console.log("Examination Data ", res)
        if (200 == res.status) {

            console.log("Examination Data Allergies", res.data.view.data)

            this.setState({ complaints: res.data.view.data, loaded: true })


        }



    }

    onAfterPrint() {
        const { onAfterPrint } = this.props;
        onAfterPrint &&
            onAfterPrint();
    }


    componentDidMount() {
        this.getConsultant()
        this.loadData()
        this.loadComplaints()
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


                <Grid container spacing={2}>

                    <Grid className="pt-3" item lg={6} md={6} sm={12} xs={12}>

                        <Grid container spacing={2}>

                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <LoonsCard className="mt-3">
                                    <div className="w-full pt-1 pb-1 " >
                                        <h5 className="mb-0">Problem List</h5>
                                        <Divider></Divider>
                                    </div>
                                    <div className="mt-2">
                                        <table className="w-full" >
                                            <tr className="font-bold" >
                                                <td>Problem</td>
                                                <td>Remove</td>
                                            </tr>
                                            {this.state.problemList?.map((item, index) => (
                                                <tr>
                                                    <td>{item.problem}</td>
                                                    <td>
                                                        <IconButton size="small" onClick={() => {
                                                            let problemList = this.state.problemList;
                                                            problemList.splice(index, 1)
                                                            this.setState({ problemList })
                                                        }}>
                                                            <RemoveCircleOutlineIcon size="small" ></RemoveCircleOutlineIcon>
                                                        </IconButton>
                                                    </td>
                                                </tr>
                                            ))}
                                        </table>
                                    </div>



                                </LoonsCard>
                            </Grid>




                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <LoonsCard className="mt-3">

                                    <div className="w-full pt-1 pb-1 " >
                                        <h5 className="mb-0">Complaints</h5>
                                        <Divider></Divider>
                                    </div>
                                    <div className="mt-2">
                                        <table className="w-full" >
                                            <tr className="font-bold" >
                                                <td>Complaint</td>
                                                <td>Remove</td>
                                            </tr>
                                            {this.state.complaints?.map((item, index) => (
                                                <tr>
                                                    <td>{item.other_answers?.complaint}</td>
                                                    <td>
                                                        <IconButton size="small" onClick={() => {
                                                            let complaints = this.state.complaints;
                                                            complaints.splice(index, 1)
                                                            this.setState({ complaints })
                                                        }}>
                                                            <RemoveCircleOutlineIcon size="small" ></RemoveCircleOutlineIcon>
                                                        </IconButton>
                                                    </td>
                                                </tr>
                                            ))}
                                        </table>
                                    </div>



                                </LoonsCard>
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <LoonsCard className="mt-3">

                                    <div className="w-full pt-1 pb-1 " >
                                        <h5 className="mb-0">Allergies</h5>
                                        <Divider></Divider>
                                    </div>
                                    <div className="mt-2">
                                        <table className="w-full" >
                                            <tr className="font-bold" >
                                                <td>Drug</td>
                                                <td>Remove</td>
                                            </tr>
                                            {this.state.allergies?.map((item, index) => (
                                                <tr>
                                                    <td>{item.other_answers?.short_description}</td>
                                                    <td>
                                                        <IconButton size="small" onClick={() => {
                                                            let allergies = this.state.allergies;
                                                            allergies.splice(index, 1)
                                                            this.setState({ allergies })
                                                        }}>
                                                            <RemoveCircleOutlineIcon size="small" ></RemoveCircleOutlineIcon>
                                                        </IconButton>
                                                    </td>
                                                </tr>
                                            ))}
                                        </table>
                                    </div>



                                </LoonsCard>
                            </Grid>


                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <LoonsCard className="mt-3">

                                    <div className="w-full pt-1 pb-1 " >
                                        <h5 className="mb-0">Note</h5>
                                        <Divider></Divider>
                                    </div>
                                    <div className="mt-2">
                                        <ValidatorForm>
                                            <TextValidator
                                                className=" w-full"
                                                label="Note"
                                                onChange={(e) => {
                                                    this.setState({ note: e.target.value })
                                                }}
                                                multiline
                                                rowsMax={4}
                                                type="text"
                                                value={this.state.note}
                                                name="note"
                                                variant="outlined"
                                                size="small"
                                            //validators={documentNameValidation}
                                            //errorMessages={documenterrorMessages}
                                            />
                                        </ValidatorForm>
                                    </div>



                                </LoonsCard>
                            </Grid>



                        </Grid>



                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Grid className="w-full justify-end items-end flex pb-5">
                            <ReactToPrint
                                trigger={() => <Button id="print_presc_001" size="small" startIcon="print">Print</Button>}
                                pageStyle={pageStyle}
                                documentTitle={letterTitle}
                                onAfterPrint={() => { this.onAfterPrint() }}
                                //removeAfterPrint
                                content={() => this.componentRef}
                            />
                        </Grid>
                        <Grid className="bg-light-gray p-5 " style={{ borderStyle: 'double', borderColor: "#a5a4a4" }} >
                            <div className="bg-white p-5" >
                                <div>

                                    <div ref={(el) => (this.componentRef = el)} >
                                        <div class="header-space flex ">

                                            <div className="pl-10" style={{ width: "50%" }}>
                                                <img alt="A test image" src={header} style={{ width: '100%' }} />
                                            </div>
                                            <div className="pt-5 pl-5" style={{ width: "50%" }} >
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

                                                    <div className="w-full bg-gray" >
                                                        <h5 className="mb-0 text-14">Patient Info</h5>
                                                    </div>
                                                    <table className="w-full">
                                                        <tbody>
                                                            <tr>
                                                                <td className="w-100 font-bold  text-12">Name</td>
                                                                <td className="w-1 text-12">:</td>
                                                                <td className="text-12">{patientInfo?.name}</td>{/**My No value */}

                                                                <td className="w-100 font-bold text-12">Age</td>
                                                                <td className="w-1 text-12">:</td>
                                                                <td className="text-12">{patientInfo?.age}</td>{/**Your No value */}

                                                            </tr>

                                                            <tr>
                                                                <td className="w-100 font-bold text-12">Address</td>
                                                                <td className="w-1 text-12">:</td>
                                                                <td className="text-12">{patientInfo?.address}</td>{/**My No value */}

                                                                <td className="w-100 font-bold text-12">Contact No</td>
                                                                <td className="w-1 text-12">:</td>
                                                                <td className="text-12">{patientInfo?.mobile_no}</td>{/**My No value */}



                                                            </tr>



                                                            <tr>
                                                                <td className="w-100 font-bold text-12">Clinic</td>
                                                                <td className="w-1 text-12">:</td>
                                                                <td className="text-12">{clinic?.name}</td>{/**My No value */}

                                                                <td className="w-100 font-bold text-12">Consultant</td>
                                                                <td className="w-1 text-12">:</td>
                                                                <td className="text-12">{clinic?.consultant}</td>{/**My No value */}

                                                            </tr>


                                                        </tbody>

                                                    </table>





                                                    <table className="w-full">
                                                        <tbody>
                                                            <tr>
                                                                <td className="w-100 font-bold  text-12">
                                                                    <div className="w-full bg-gray " >
                                                                        <h5 className="mb-0 text-14">Allergies</h5>
                                                                    </div>

                                                                </td>


                                                                <td className="w-100 font-bold text-12">
                                                                    <div className="w-full bg-gray  " >
                                                                        <h5 className="mb-0 text-14">Complaints</h5>
                                                                    </div>
                                                                </td>

                                                            </tr>
                                                        </tbody>
                                                        <tfoot><tr><td>

                                                        </td></tr></tfoot>
                                                    </table>



                                                    <table className="w-full">
                                                        <tbody>
                                                            <tr>
                                                                <td className="w-100   text-12">
                                                                    <Grid container>
                                                                        {this.state.allergies?.map((item, key) => (
                                                                            <Grid item className='px-1 py-1'>
                                                                                <div className='px-2  border-radius-8' >
                                                                                    {item.other_answers?.short_description}</div>
                                                                            </Grid>
                                                                        ))
                                                                        }
                                                                    </Grid>
                                                                </td>


                                                                <td className="w-100  text-12">
                                                                    <Grid container>
                                                                        {this.state.complaints?.map((item, key) => (
                                                                            <Grid item className='px-1 py-1'>
                                                                                <div className='px-2  border-radius-8' >
                                                                                    - {item.other_answers?.complaint}</div>
                                                                            </Grid>
                                                                        ))
                                                                        }
                                                                    </Grid>
                                                                </td>

                                                            </tr>
                                                        </tbody>
                                                        <tfoot><tr><td>

                                                        </td></tr></tfoot>
                                                    </table>





                                                    <Grid container>
                                                        <div className="w-full bg-gray  " >
                                                            <h5 className="mb-0 text-14">Problem List</h5>
                                                        </div>
                                                        <Grid container>
                                                            {this.state.problemList?.map((item, key) => (
                                                                <Grid item lg={6} md={6} sm={6} xs={6} className='px-1'>
                                                                    <div className='px-2  border-radius-8 text-12' >
                                                                        - {item.problem}</div>
                                                                </Grid>
                                                            ))
                                                            }
                                                        </Grid>
                                                    </Grid>






                                                    <div className="w-full bg-gra mt-5" >
                                                        <h5 className="mb-0 text-14">Prescription</h5>
                                                    </div>

                                                    <table className="w-full px-0 mt-2">
                                                        <tbody className="w-full ">
                                                            <tr className="w-full pb-10" >
                                                                <td className="text-12 font-bold w-full" >Drug</td>
                                                                <td className="text-12 font-bold pr-10 ">Dosage</td>
                                                                <td className="text-12 font-bold pr-10">Frequency</td>
                                                                <td className="text-12 font-bold pr-10  ">Duration</td>
                                                                <td className="text-12 font-bold pr-10 "></td>

                                                            </tr>


                                                            {
                                                                //drugList?.filter((ele) => ele.availability == false).map((drug, index) =>
                                                                drugList?.map((drug, index) =>
                                                                    drug.params.map((drugparam, index2) =>
                                                                        <tr>
                                                                            <td className="text-10 w-full">{drug.drug}</td>
                                                                            <td className="text-10 w-120">{drugparam.dosage + " " + drug.uom}</td>
                                                                            <td className="text-10 w-120">{drugparam.frequency}</td>
                                                                            <td className="text-10 w-120">{drugparam.duration + "day/s"}</td>
                                                                            <td className="text-10 w-120">{drug.availability == false ? "OS" : ""}</td>

                                                                        </tr>
                                                                    )
                                                                )
                                                            }


                                                        </tbody>
                                                        <tfoot><tr><td>
                                                            <div class="footer-space"> </div>
                                                        </td></tr></tfoot>
                                                    </table>
                                                    <div className="w-full">
                                                        <p className="font-bold  text-12">OS යනු ඔබට සපයා නොමැති ඖෂධ වේ. එම ඖෂධ රාජ්‍ය ඔසු සලෙන් හෝ පුද්ගලික ඖෂධහල් වලින් මුදලට ලබා ගන්න.</p>
                                                    </div>

                                                    {/* Letter Address */}


                                                    <Grid container>
                                                        <div className="w-full bg-gray pt-1 pb-1 " >
                                                            <h5 className="mb-0 text-14">Note</h5>
                                                        </div>
                                                        <Grid container>

                                                            <div className='px-2  border-radius-8 text-12' >
                                                                {this.state.note}</div>

                                                        </Grid>
                                                    </Grid>





                                                </div>
                                            </td></tr></tbody>
                                            <tfoot><tr><td>
                                                <div class="footer-space"> </div>
                                            </td></tr></tfoot>
                                        </table>


                                        <table className="w-full pl-20">
                                            <tbody>
                                                <tr>
                                                    <td className="w-100 font-bold  text-12">Prescribed Date & Time</td>
                                                    <td className="w-1 text-12">:</td>
                                                    <td className="text-12">{date}</td>{/**My No value */}

                                                    <td className="w-100 font-bold text-12"></td>
                                                    <td className="w-1 text-12"></td>
                                                    <td className="text-12">{this.state.consultant?.name}</td>{/**Your No value */}

                                                </tr>
                                                <tr>
                                                    <td className="w-100 font-bold  text-12"></td>
                                                    <td className="w-1 text-12"></td>
                                                    <td className="text-12"></td>{/**My No value */}

                                                    <td className="w-100 font-bold text-12"></td>
                                                    <td className="w-1 text-12"></td>
                                                    {/*  <td className="text-12">{this.state.consultant?.contact_no}</td>
 */}
                                                </tr>

                                            </tbody>
                                            <tfoot><tr><td>
                                                <div class="footer-space">
                                                </div>
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

                </Grid>



            </div>
        );
    }
}

export default PatientSummaryNew;