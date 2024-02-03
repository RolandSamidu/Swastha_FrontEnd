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
import Pagination from '@material-ui/lab/Pagination';
import { Autocomplete } from '@material-ui/lab'
import DashboardServices from "app/services/DashboardServices";
import PatientServices from "app/services/PatientServices";
import { filter } from "lodash";

class NewlineText extends Component {

}



class EHRData extends Component {
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

            referral_all_wards: [],
            selected_referral_ward: null,

            all_consultant: [],
            selected_consultant: null,

            all_referral_consultant: [],
            selected_referral_consultant: null,

            reason: null,
            allData: null,
            filterData: {
                patient_id: this.props.match.params.patientId,
                hospital_id: null,//0d23d4c9-8b8c-4df4-8062-8ecfd00d4aa1
                reffered_hospital_id: null,
                type: "Summary",
                limit: 1,
                page: 0,
                'order[0]': [
                    'createdAt', 'DESC'
                ],
            },

        }
    }

    async loadData(page) {
        let login_hospital_id = await localStorageService.getItem('main_hospital_id');
        let filterData = this.state.filterData;
        filterData.page = page;


        if (filterData.type == "Reffered") {
            filterData.reffered_hospital_id = login_hospital_id;
            filterData.reffered_unit_id = this.state.selected_referral_ward?.id;
        } else {
            filterData.reffered_hospital_id = null;
            filterData.reffered_unit_id = null;
        }

        let res = await EHRServices.getData(filterData)
        console.log("ehr data", res.data.view)
        this.setState({ allData: res.data.view })


    }
    async loadHospitals() {
        let params_ward = { issuance_type: 'Hospital' }
        let hospitals = await DashboardServices.getAllHospitals(params_ward);
        if (hospitals.status == 200) {
            console.log("all_hospitals", hospitals.data.view.data)
            this.setState({ all_hospitals: hospitals.data.view.data })
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
    async loadReferralConsultant(clinic_id) {


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
                all_referral_consultant: all_consultant,
            })
        }

    }

    async getAllClinics(store_id) {

        let params_ward = { issuance_type: ['Ward', 'Clinic'] }
        let wards = await DashboardServices.getAllClinics(params_ward, store_id);
        if (wards.status == 200) {
            console.log("wards", wards.data.view.data)

            this.setState({ all_wards: wards.data.view.data })


        }
    }

    async getAllReferrelClinics(store_id) {

        let params_ward = { issuance_type: ['Ward', 'Clinic'] }
        let wards = await DashboardServices.getAllClinics(params_ward, store_id);
        if (wards.status == 200) {
            console.log("wards", wards.data.view.data)

            this.setState({ referral_all_wards: wards.data.view.data })
            let login_clinic = await localStorageService.getItem('Login_user_Clinic_prescription');
            let logined_unit = this.state.referral_all_wards.filter((ele) => ele.id == login_clinic.clinic_id)
            this.loadReferralConsultant(login_clinic.clinic_id)
            this.setState({ selected_referral_ward: logined_unit[0] })
        }
    }


    async componentDidMount() {
        /* let login_hospital_id = await localStorageService.getItem('main_hospital_id');
          let filterData = this.state.filterData;
          filterData.reffered_hospital_id = login_hospital_id;
          this.setState({ filterData }) */

        let owner_id = await localStorageService.getItem('owner_id')

        this.getAllReferrelClinics(owner_id)
        this.loadHospitals()
        this.loadData(0)
    }
    handleChange(event, value) {
        console.log("page", value)
    };

    render() {
        const {
            header,

        } = this.props;

        let patientInfo = this.state.allData?.data[0]?.data.patientInfo;
        let drugList = this.state.allData?.data[0]?.data.drugList
        let clinic = this.state.allData?.data[0]?.data.clinic
        let date = this.state.allData?.createdAt
        return (
            <div className="px-5 mt-5">


                <Grid container>
                    <Grid className="px-5" item lg={4} md={4} sm={12} xs={12}>
                        <Grid container>
                            <ValidatorForm
                                onSubmit={() => this.loadData()}
                                onError={() => null}
                                className="w-full"
                            >


                                <Grid
                                    className=" w-full"
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Type" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        // ref={elmRef}
                                        value={{ lable: this.state.filterData.type, value: this.state.filterData.type }}
                                        options={[{ lable: "Summary", value: 'Summary' }, { lable: "Reffered", value: 'Reffered' }]}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let filterData = this.state.filterData
                                                filterData.type = value.value
                                                this.setState({ filterData })
                                            } else {
                                                let filterData = this.state.filterData
                                                filterData.type = null
                                                this.setState({ filterData })
                                            }
                                        }}
                                        //value={this.state.selected_ward}
                                        getOptionLabel={(option) => option.lable}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Type"
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
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Hospital (From)" />

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
                                                let filterData = this.state.filterData
                                                filterData.hospital_id = value.id
                                                filterData.owner_id = value.owner_id

                                                this.setState({
                                                    selected_hospital: value,
                                                    filterData

                                                }, () => {
                                                    this.getAllClinics(value.store_id)
                                                })
                                            } else {
                                                let filterData = this.state.filterData
                                                filterData.hospital_id = null
                                                filterData.owner_id = null
                                                this.setState({
                                                    selected_hospital: null,
                                                    filterData
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
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Unit (From)" />

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
                                    lg={12}
                                    md={12}
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
                                                let filterData = this.state.filterData
                                                filterData.doctor_id = value.id
                                                this.setState({
                                                    selected_consultant: value,
                                                    filterData
                                                })
                                            } else {
                                                let filterData = this.state.filterData
                                                filterData.doctor_id = null
                                                this.setState({
                                                    selected_consultant: null,
                                                    filterData
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


                                {this.state.filterData.type == 'Reffered' ?
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Referral Unit" />

                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            // ref={elmRef}
                                            options={this.state.referral_all_wards.filter((ele) => ele.status == "Active")}
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let filterData = this.state.filterData
                                                    filterData.reffered_unit_id = value.id

                                                    this.setState({ selected_referral_ward: value, filterData })
                                                    this.loadReferralConsultant(value.id)
                                                } else {
                                                    let filterData = this.state.filterData
                                                    filterData.reffered_unit_id = null
                                                    this.setState({ selected_referral_ward: null, filterData })
                                                }
                                            }}
                                            value={this.state.selected_referral_ward}
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
                                    : null}

                                {this.state.filterData.type == 'Reffered' ?
                                    <Grid
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Referral Consultant" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={
                                                this.state.all_referral_consultant
                                            }
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData
                                                    filterData.reffered_doctor_id = value.id
                                                    this.setState({
                                                        selected_referral_consultant: value,
                                                        filterData
                                                    })
                                                } else {
                                                    let filterData = this.state.filterData
                                                    filterData.reffered_doctor_id = null
                                                    this.setState({
                                                        selected_referral_consultant: null,
                                                        filterData
                                                    })
                                                }
                                            }}

                                            value={this.state.selected_referral_consultant}
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

                                    : null}


                                <Button
                                    variant="outlined"
                                    className="mt-2 w-full"
                                    progress={false}
                                    color="primary"
                                    type="submit"
                                    scrollToTop={true}

                                >
                                    <span className="capitalize">Search</span>
                                </Button>

                            </ValidatorForm>
                        </Grid>
                    </Grid>

                    <Grid className="justify-center" item lg={8} md={8} sm={12} xs={12}>

                        {this.state.allData?.totalPages > 0 ?
                            <div>

                                <Grid className="bg-light-gray p-5 " style={{ borderStyle: 'double', borderColor: "#a5a4a4" }} >
                                    <div className="bg-white p-5" >
                                        <div>

                                            <div ref={(el) => (this.componentRef = el)} >

                                                <table className="w-full">
                                                    <thead><tr><td>

                                                    </td></tr></thead>
                                                    <tbody><tr><td>
                                                        <div className="content pl-10 pr-5">
                                                            {/*  Letter refferences section */}

                                                            <div className="w-full px-2 pt-1 pb-1 " style={{ backgroundColor: '#d3ebf3' }}>
                                                                <h5 className="mb-0">Patient Info</h5>
                                                            </div>
                                                            <table className="w-full px-2" style={{ backgroundColor: '#d3ebf3' }}>
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
                                                                        <td className="w-100 font-bold text-12">Hospital</td>
                                                                        <td className="w-1 text-14">:</td>
                                                                        <td className="text-14">{this.state.allData?.data[0]?.Hospital?.name}</td>{/**My No value */}

                                                                        <td className="w-100 font-bold text-12">Consultant</td>
                                                                        <td className="w-1 text-14">:</td>
                                                                        <td className="text-14">{this.state.consultant?.name}</td>{/**My No value */}

                                                                    </tr>


                                                                </tbody>

                                                            </table>


                                                            {this.state.allData?.data[0]?.type == "Reffered" ?
                                                                <Grid container className="mt-5">
                                                                    <div className="w-full bg-gray px-2 pt-1 pb-1 " >
                                                                        <h5 className="mb-0">Referral Info</h5>
                                                                    </div>
                                                                    <Grid container>

                                                                        <table className="w-full">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="w-100 font-bold  text-12">Hospital</td>
                                                                                    <td className="w-1 text-12">:</td>
                                                                                    <td className="text-12">{this.state.allData?.data[0]?.RefHospital?.name}</td>{/**My No value */}

                                                                                    <td className="w-100 font-bold text-12">Consultant</td>
                                                                                    <td className="w-1 text-12">:</td>
                                                                                    <td className="text-12">{this.state.allData?.data[0]?.RefDoctor?.name}</td>{/**My No value */}


                                                                                </tr>



                                                                            </tbody>

                                                                        </table>

                                                                    </Grid>
                                                                </Grid>
                                                                : null}

                                                            {this.state.allData?.data[0]?.type == "Reffered" ?
                                                                <Grid container>
                                                                    <div className="w-full bg-gray px-2 pt-1 pb-1 " >
                                                                        <h5 className="mb-0">Referral Reason</h5>
                                                                    </div>
                                                                    <Grid container>

                                                                        <div className='px-2  border-radius-8 text-12' >
                                                                            {this.state.allData?.data[0]?.data?.reason}</div>

                                                                    </Grid>
                                                                </Grid>
                                                                : null}

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
                                                                                {this.state.allData?.data[0]?.data.allergies?.map((item, key) => (
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
                                                                                {this.state.allData?.data[0]?.datacomplaints?.map((item, key) => (
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
                                                                    {this.state.allData?.data[0]?.data.problemList?.map((item, key) => (
                                                                        <Grid item lg={6} md={6} sm={6} xs={6} className='px-1 py-1'>
                                                                            <div className='px-2  border-radius-8 text-12' >
                                                                                - {item.problem}</div>
                                                                        </Grid>
                                                                    ))
                                                                    }
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
                                                            <td className="text-14">{dateParse(this.state.allData?.data[0]?.data.createdAt)}</td>{/**My No value */}

                                                            <td className="w-100 font-bold text-12"></td>
                                                            <td className="w-1 text-14"></td>
                                                            <td className="text-14">{this.state.allData?.data[0]?.data?.doctor}</td>{/**Your No value */}

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
                                <Pagination className="flex justify-center mt-5" variant="outlined" color="primary"
                                    count={this.state.allData?.totalPages}
                                    //count={10} 

                                    page={this.state.allData?.page}
                                    onChange={(event, value) => { this.loadData(value - 1) }}

                                />
                            </div>
                            :
                            <div className="flex justify-center" style={{marginTop:'130px'}}>
                                No Data Found
                            </div>
                        }
                    </Grid>

                </Grid>



            </div>
        );
    }

}
export default EHRData;
