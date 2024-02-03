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
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { dateParse } from "utils";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Autocomplete } from '@material-ui/lab'
import DashboardServices from "app/services/DashboardServices";
import PatientServices from "app/services/PatientServices";
import EHRServices from "app/services/EHRServices";

class NewlineText extends Component {

}



class PatientReferral extends Component {
    constructor(props) {
        super(props)
        this.state = {
            consultant: null,
            allergies: [],
            problemList: [],
            complaints: [],
            note: "",
            loaded: false,

            all_hospitals: [],
            selected_hospital: null,

            all_wards: [],
            selected_ward: null,

            all_consultant: [],
            selected_consultant: null,

            reason: null,

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


        }

        let params_ward = { issuance_type: 'Hospital' }
        let hospitals = await DashboardServices.getAllHospitals(params_ward);
        if (hospitals.status == 200) {
            console.log("all_hospitals", hospitals.data.view.data)
            this.setState({ all_hospitals: hospitals.data.view.data })
        }

    }


    async submitForEMR() {
        var user = await localStorageService.getItem('userInfo');
        let hospital_id=await localStorageService.getItem('main_hospital_id');
        let formData = {
            clinic_id: this.props.clinic.clinic_id,
            doctor_id: user.id,
            patient_id: this.props.patientInfo.id,
            hospital_id: hospital_id,
            type: "Reffered",
            owner_id: this.props.clinic.owner_id,
            reffered_doctor_id:this.state.selected_consultant.id,
            reffered_hospital_id:this.state.selected_hospital.id,
            reffered_unit_id:this.state.selected_ward.id,
            data: {
                allergies: this.state.allergies,
                problemList: this.state.problemList,
                patientInfo: this.props.patientInfo,
                drugList: this.props.drugList,
                clinic: this.props.clinic,
                doctor: user.name,
                reason:this.state.note
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

    async getAllClinics(store_id) {

        let params_ward = { issuance_type: ['Ward','Clinic'] }
        let wards = await DashboardServices.getAllClinics(params_ward, store_id);
        if (wards.status == 200) {
            console.log("wards", wards.data.view.data)

            this.setState({ all_wards: wards.data.view.data })


        }
    }


    async loadConsultant(clinic_id) {


        let params = {
            type: 'Consultant',
            pharmacy_drugs_stores_id: clinic_id

        }

        let cunsultantData = await PatientServices.getAllFront_Desk(params)
        console.log("consultants", cunsultantData.data.view.data)
        let all_consultant = [];
        if (200 == cunsultantData.status) {

            cunsultantData.data.view.data.forEach(element => {
                console.log("single emplyee", element.Employee)
                all_consultant.push(element.Employee)
            });



            this.setState({
                all_consultant: all_consultant,
            })
        }

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

                    <Grid className="pt-12" item lg={6} md={6} sm={12} xs={12}>

                        <Grid container spacing={2}>

                            <Grid item xs={12} sm={12} md={12} lg={12}>

                                <LoonsCard className="mt-3">
                                    <div className="w-full pt-1 pb-1 " >
                                        <h5 className="mb-0">Referral Infomations</h5>
                                        <Divider></Divider>
                                    </div>

                                    <Grid className="mt-2" container spacing={2}>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Hospital" />

                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={
                                                    this.state.all_hospitals
                                                }
                                                onChange={(
                                                    e,
                                                    value
                                                ) => {
                                                    if (value != null) {

                                                        this.setState({
                                                            selected_hospital: value,
                                                        }, () => {
                                                            this.getAllClinics(value.store_id)
                                                        })
                                                    }
                                                }}
                                                value={this.state.selected_hospital}
                                                getOptionLabel={(
                                                    option
                                                ) =>
                                                    option.name
                                                        ? option.name
                                                        : ''
                                                }
                                                renderInput={(
                                                    params
                                                ) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Hospital"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        </Grid>


                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Unit" />

                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                // ref={elmRef}
                                                options={this.state.all_wards.filter((ele) => ele.status == "Active")}
                                                onChange={(e, value) => {
                                                    if (value != null) {

                                                        this.setState({ selected_ward: value })
                                                        this.loadConsultant(value.id)
                                                    }
                                                }}
                                                value={this.state.selected_ward}
                                                getOptionLabel={(option) => option.name}
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Unit"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Consultant" />
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={
                                                    this.state.all_consultant
                                                }
                                                onChange={(e, value) => {
                                                    if (null != value) {
                                                        this.setState({
                                                            selected_consultant: value
                                                        })
                                                    }
                                                }}

                                                value={this.state.selected_consultant}
                                                getOptionLabel={(option) =>
                                                    option.name
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Consultant"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"

                                                    /*   validators={[
                                                          'required',
                                                      ]}
                                                      errorMessages={[
                                                          'this field is required',
                                                      ]} */
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        {/* <Grid
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Reason" />
                                            <TextValidator
                                                className=" w-full"
                                                label="Reason"
                                                onChange={(e) => {
                                                    this.setState({ reason: e.target.value })
                                                }}
                                                multiline
                                                rowsMax={4}
                                                type="text"
                                                value={this.state.reason}
                                                name="reason"
                                                variant="outlined"
                                                size="small"
                                            //validators={documentNameValidation}
                                            //errorMessages={documenterrorMessages}
                                            />
                                        </Grid> */}


                                    </Grid>
                                </LoonsCard>
                            </Grid>

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
                                        <h5 className="mb-0">Reason</h5>
                                        <Divider></Divider>
                                    </div>
                                    <div className="mt-2">
                                        <ValidatorForm>
                                            <TextValidator
                                                className=" w-full"
                                                label="Reason"
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
                                //removeAfterPrint
                                onBeforePrint={()=>this.submitForEMR()}
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

                                                                <td className="w-100 font-bold text-12">Clinic</td>
                                                                <td className="w-1 text-14">:</td>
                                                                <td className="text-14">{clinic?.name}</td>{/**My No value */}

                                                            </tr>



                                                            <tr>
                                                                <td className="w-100 font-bold text-12">Consultant</td>
                                                                <td className="w-1 text-14">:</td>
                                                                <td className="text-14">{this.state.consultant?.name}</td>{/**My No value */}

                                                            </tr>


                                                        </tbody>

                                                    </table>

                                                    <Grid container>
                                                        <div className="w-full bg-gray px-2 pt-1 pb-1 " >
                                                            <h5 className="mb-0">Referral Info</h5>
                                                        </div>
                                                        <Grid container>

                                                            <table className="w-full">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="w-100 font-bold  text-12">Hospital</td>
                                                                        <td className="w-1 text-12">:</td>
                                                                        <td className="text-12">{this.state.selected_hospital?.name}</td>{/**My No value */}

                                                                        <td className="w-100 font-bold text-12">Unit</td>
                                                                        <td className="w-1 text-12">:</td>
                                                                        <td className="text-12">{this.state.selected_ward?.name}</td>{/**Your No value */}

                                                                    </tr>

                                                                    <tr>
                                                                        <td className="w-100 font-bold text-12">Consultant</td>
                                                                        <td className="w-1 text-12">:</td>
                                                                        <td className="text-12">{this.state.selected_consultant?.name}</td>{/**My No value */}

                                                                        <td className="w-100 font-bold text-12">Reason</td>
                                                                        <td className="w-1 text-12">:</td>
                                                                        <td className="text-12">{this.state.reason}</td>{/**My No value */}

                                                                    </tr>


                                                                </tbody>

                                                            </table>

                                                        </Grid>
                                                    </Grid>



                                                    <table className="w-full">
                                                        <tbody>
                                                            <tr>
                                                                <td className="w-100 font-bold  text-12">
                                                                    <div className="w-full bg-gray px-2 pt-1 pb-1 " >
                                                                        <h5 className="mb-0">Allergies</h5>
                                                                    </div>

                                                                </td>


                                                                <td className="w-100 font-bold text-12">
                                                                    <div className="w-full bg-gray px-2 pt-1 pb-1 " >
                                                                        <h5 className="mb-0">Complaints</h5>
                                                                    </div>
                                                                </td>

                                                            </tr>
                                                        </tbody>
                                                        <tfoot><tr><td>
                                                            <div class="footer-space"> </div>
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
                                                            <div class="footer-space"> </div>
                                                        </td></tr></tfoot>
                                                    </table>





                                                    <Grid container>
                                                        <div className="w-full bg-gray px-2 pt-1 pb-1 " >
                                                            <h5 className="mb-0">Problem List</h5>
                                                        </div>
                                                        <Grid container>
                                                            {this.state.problemList?.map((item, key) => (
                                                                <Grid item lg={6} md={6} sm={6} xs={6} className='px-1 py-1'>
                                                                    <div className='px-2  border-radius-8 text-12' >
                                                                        - {item.problem}</div>
                                                                </Grid>
                                                            ))
                                                            }
                                                        </Grid>
                                                    </Grid>


                                                    <Grid container>
                                                        <div className="w-full bg-gray px-2 pt-1 pb-1 " >
                                                            <h5 className="mb-2">Reason</h5>
                                                        </div>
                                                        <Grid container>

                                                            <div className='px-2  border-radius-8 text-12' >
                                                                {this.state.note}</div>

                                                        </Grid>
                                                    </Grid>





                                                    <div className="w-full bg-gray px-2 pt-1 pb-1 mt-5" >
                                                        <h5 className="mb-0">Prescription</h5>
                                                    </div>

                                                    <table className="w-full px-2 mt-2">
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
                                                                    <tr>
                                                                        <td className="text-12 w-full">{drug.drug}</td>
                                                                        <td className="text-12 w-120">{drug.params[0].dosage + " " + drug.uom}</td>

                                                                        <td className="text-12 w-120">{drug.params[0].frequency}</td>
                                                                        <td className="text-12 w-120">{drug.params[0].duration + "day/s"}</td>
                                                                        <td className="text-12 w-120">{drug.availability == false ? "OS" : ""}</td>


                                                                    </tr>

                                                                )
                                                            }


                                                        </tbody>
                                                        <tfoot><tr><td>
                                                            <div class="footer-space"> </div>
                                                        </td></tr></tfoot>
                                                    </table>

                                                    {/* Letter Address */}








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
                                                    <td className="text-14">{moment(date).format('yyyy-MM-DD')}</td>{/**My No value */}

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

                </Grid>



            </div>
        );
    }
}

export default PatientReferral;