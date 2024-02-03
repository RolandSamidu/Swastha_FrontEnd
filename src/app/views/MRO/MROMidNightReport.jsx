import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { MainContainer, SubTitle,  CardTitle, Widget,DatePicker ,Button, LoonsCard, LoonsSnackbar,} from "app/components/LoonsLabComponents";
import { Chip, Grid } from "@material-ui/core";
import  PrintLetter  from "app/components/LoonsLabComponents/PrintLetters";
import ReactToPrint from "react-to-print";
import * as appConst from '../../../appconst'
import PatientServices from 'app/services/PatientServices'
import * as Util from '../../../utils'
import UtilityServices from 'app/services/UtilityServices'
import EmployeeServices from 'app/services/EmployeeServices'

import TableRow from "@material-ui/core/TableRow"
import DashboardServices from "app/services/DashboardServices";
import localStorageService from 'app/services/localStorageService';
import { dateParse } from 'utils'
import { parseInt } from "lodash";

  
const styleSheet = ((palette, ...theme) => ({
    detailRow: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '5px',
        paddingBottom: '5px',
    },
    chip: {
        margin: '5px'
    },
    title: {
        marginTop: '10px'
    }
}));
var tableStyle = {
      "border": "1px solid black"
//      "border-style": "dotted"
   };
class MROMidNightReport extends Component {
      static propTypes = {
            letterTitle: String
            };
 static defaultProps = {
                  letterTitle: null
                      };
    constructor(props) {
        super(props)
        this.state = {
            loaded:false,
            dischageMode:null,
            columns: [],
            date:null,
            data: [],
            formData:{
                  date:null,
                  ward_id:null,
            },
            basic: {
                  
                  direct:null,
                  inwardtranfer:null,
                  transferfromahospital:null,
                  transferfromaclinic:null,
                  referredbymedp:null,
                  totaladmissions:null,
                  alive:null,
                  inwardtranfer2:null,
                  outsidetranfer:null,
                  missing:null,
                  lama:null,
                  death:null,
                  totaldischarges:null,
                  previousdaytotal:null,
                  midnighttotal:null,
                  transfertoOtherhos:null,
                  sharedCare:null,
                  ward:null
            },
            drugAllergies: [
                'Paracetamol',
                'Insulin',
                'Insulin',
                'Insulin',
                'Insulin',
                'Insulin',
                'Insulin',
                'Insulin',
            ],
            clinics: [
                {name: 'Norris Clinic', color: 'white', background: 'blue'},
                {name: 'Avent Clinic', color: 'white', background: 'red'},
                {name: 'Second Clinic', color: 'white', background: 'green'},
            ],
            // previuous_Discharge_count:null,
            dischargeReport:[],
            admitReport:[],
            previuousAdmissioncount:[],
            previuousDischargecount:null,
            // newPreviuousAdmissioncount:[],
            // newAdmitReport:[],
            // newDischarge:[
            //       {label: '', count: ''}],
             sumDischarge:null,
             sumAdmission:null,
             midnighttotal:null
        }
    }
    componentDidMount(){
    //   this.loadData()
    //   this.getAllClinics()
      // this.loadingDischarge()
    this.addingArray()


      console.log('Patient',this.props.patient)
    }
    
    async addingArray(){
         const dischargeReport = [
            {
                count: 1,
                mode: "transfer to other hospital"
            },
            {
                count: 1,
                mode: "lama"
            },
            {
                count: 0,
                mode: "alive"
            },
            // {
            //     count: 0,
            //     mode: null
            // },
            {
                count: 1,
                mode: "death"
            }
        ]

        const sum = this.state.admitReport.reduce((accumulator, object) => {
            return accumulator + object.count;
          },0);
          const sum2 = this.state.dischargeReport.reduce((accumulator, object) => {
            return accumulator + object.count;
          },0);
          
          let midnightTotal = parseInt(sum) + parseInt(sum2)
          this.setState({
            sumAdmission: parseInt(sum),
            sumDischarge : parseInt(sum2),
            midnighttotal:midnightTotal

          })
    }
    async getWardID(){

        const userId = await localStorageService.getItem('userInfo').id

        let getAsignedEmployee = await EmployeeServices.getAsignEmployees({
            employee_id: userId,
            type: ['Hospital Admin','Super Admin','MRO']
        })
        let formData = this.state.formData
        let hospitals = []
        let owner_id = null
        if (200 == getAsignedEmployee.status) {
            hospitals = getAsignedEmployee.data.view.data
        }

        formData.ward_id = [hospitals[0].Pharmacy_drugs_store.name]
        console.log('ward id',formData.ward_id)
        this.setState({
            formData

        })
    }


    async getAllClinics() {
        var user = await localStorageService.getItem('userInfo');
        let store_data = await localStorageService.getItem('Login_user_Hospital');

        let params_ward = { issuance_type: 'Ward', employee_id: user.id }//date
        let wards = await DashboardServices.getAllClinics(params_ward, store_data.owner_id);
        if (wards.status == 200) {
            console.log("wards", wards.data.view.data)
            let ward_id = wards.data.view.data[0].id;
            let formData = this.state.formData;
            formData.ward_id = ward_id
            this.setState({ all_wards: wards.data.view.data, formData }, () => {
                setTimeout(() => {
                }, 1000);

            })


        }
    }
    async loadingAdmitReport(){
    //     let admitReport = this.state.admitReport
    //     let newAdmitReport = []
    //    admitReport.forEach(element => {
    //            newAdmitReport.push({label:element.mode, count : element.count }
    //            )          
    //   }); 
    //    this.setState({
    //         newAdmitReport:newAdmitReport
    //    })
     }
     async loadingPreviousAdmissionCount(){
    //      const previuousAdmissioncountArry = [
    //         {
    //             count: "1",
    //             mode: "Direct"
    //         },
    //         {
    //             count: "1",
    //             mode: "Referral from Ward"
    //         },
    //         {
    //             count: "1",
    //             mode: "Transferred from Hospital"
    //         },
    //         {
    //             count: "0",
    //             mode: 'Referral from Clinic'
    //         },
    //         {
    //             count: "1",
    //             mode: "Transfer from Hospital"
    //         }
    //     ]
    //     let previuousAdmissioncount = this.state.previuousAdmissioncount
    //     let newPreviuousAdmissioncount = []
    //     console.log("previuousAdmissioncount",previuousAdmissioncount)
    //     previuousAdmissioncountArry.forEach(element => {
    //         let index = previuousAdmissioncount.map(object => object.mode).indexOf(element.value);
    //         console.log("index",index)
    //         if(index !== -1){
    //            newPreviuousAdmissioncount.push({label:element.label, count : previuousAdmissioncount[index].count }

    //            )   
    //         }
    //         else{
    //               newPreviuousAdmissioncount.push({label:element.label,count : 0 })
    //         }
    //   }); 
    //   console.log('admission ',newPreviuousAdmissioncount)

    //    this.setState({
    //         newPreviuousAdmissioncount:newPreviuousAdmissioncount
    //    })
     }

    
    async loadingDischarge(){
        // const dischargeReport = [
        //     {
        //         count: "1",
        //         mode: "transfer to other hospital"
        //     },
        //     {
        //         count: "1",
        //         mode: "lama"
        //     },
        //     {
        //         count: "1",
        //         mode: "alive"
        //     },
        //     {
        //         count: "0",
        //         mode: null
        //     },
        //     {
        //         count: "1",
        //         mode: "death"
        //     }
        // ]

        //  let dischargeReports = this.state.dischargeReport
        //  let newDischarge = []
        //  appConst.discharge_mode.forEach(element => {
        //       let index = dischargeReports.map(object => object.mode).indexOf(element.value);
        //       console.log("index",index)
        //       if(index !== -1){
        //          newDischarge.push({mode:element.mode, count : dischargeReports[index].count }
  
        //          )   
        //       }
        //       else{
        //             newDischarge.push({mode:element.mode,count : 0 })
        //       }
        // }); 
        // console.log('Discharge m',newDischarge)
        // this.setState({
        //       newDischarge:newDischarge
        // })
       
        // console.log("new d",this.state.newDischarge)
      }
  


    async loadData() {
      this.setState({ loaded: false })
      console.log("aaaa", this.props.patient_id)
      //   let filterData = 'Midnight Report'
      let date = dateParse(this.state.formData.date)
      var user = await localStorageService.getItem('userInfo');
      let store_data = await localStorageService.getItem('Login_user_Hospital');
      let params_ward = { issuance_type: 'Ward', employee_id: user.id,search_type: 'Midnight Report',date:date}//date
        
        let patient = await PatientServices.getMidnightReports(params_ward)
        console.log("Midnight rep",patient)

      
        //     let params_clinic = { issuance_type: 'Clinic' }
        //     let clinics = await DashboardServices.getAllClinics(params_clinic, store_data.owner_id);
        //     if (clinics.status == 200) {
        //         console.log("clinics", clinics.data.view.data)
        //         this.setState({ 
        //             all_clinics: clinics.data.view.data 
        //         })
        //     }

            // let params_wards = { issuance_type: 'Ward', employee_id: user.id }
            // let wards = await DashboardServices.getAllClinics(params_wards, store_data.owner_id);
            // if (wards.status == 200) {
            //     console.log("wards", wards.data.view.data)
            //     // let ward_id = wards.data.view.data[0].id;
            //     // let formData = this.state.formData;
            //     // formData.ward_id = ward_id
            //     this.setState({ all_wards: wards.data.view.data }
            //     //     , () => {
            //     //     setTimeout(() => {
            //     //         this.searchPatients()
            //     //     }, 1000);

            //     // }
            //     )

            // }
       

        if (200 == patient.status) {
      
            //  let getAdmitrep = []
            //  patient.data.view.AdmitReport.map(patient => {
            //         if (patient !== -1) {
            //             getAdmitrep.push({ count: patient.count, mode: patient.mode })
            //         }
            //     })  
            // // let getdischarge = []
            // // .map(patient => {
            // //       if (patient !== -1) {
            // //             getdischarge.push({ count: patient.count, mode: patient.mode })
            // //       }
            // //   }) 
            // let getPrevAdmiss = []
            // patient.data.view.Previuous_Admission_count.map(patient => {
            //       if (patient !== -1) {
            //             getPrevAdmiss.push({ count: patient.count, mode: patient.mode })
            //       }
            //   })   


              this.setState({  
                formData:{
                    ward:user
                },
              
                loaded:true,
                admitReport: patient.data.view.AdmitReport,
                dischargeReport:patient.data.view.DischargeReport,
                previuousDischargecount:patient.data.view.Previuous_Discharge_count,
                previuousAdmissioncount:patient.data.view.Previuous_Admission_count
          },() =>{
            this.getWardID()
            this.loadingDischarge()
            this.addingArray()
            this.loadingAdmitReport()
            // this.loadingPreviousAdmissionCount()
          })  


            //     bht:patient.bht,
            //     patient_ward:patient.patient_ward,//ask
            // //     nic: patient.nic,
            //     name: patient.Patient.name,
            //     dob: Util.dateParse(patient.Patient.date_of_birth),
            //     address: patient.Patient.address,
            //     origin: patient.Patient.nearest_hospital,
            //     mobile: patient.Patient.mobile_no,
            //     gender: patient.Patient.gender,
            //     age:patient.Patient.age,

            //     admission_time:patient.admit_date_time,//ask
            //     admission_date:patient.Patient.admission_date,
            //     transfer_date:patient.transfer_date_time,
            //     transfer_time:patient.Patient.transfer_time,
            //     discharged_mode:patient.discharge_mode,
            //     icd_code:patient.Patient.icd_code,//ask
            //     additional_diagnosis:patient.Patient.additional_diagnosis,
            //     discharged_ward:patient.Patient.discharged_ward,
            //     ward_discharged_on:patient.Patient.ward_discharged_on,
            //     ward_discharged_at:patient.Patient.ward_discharged_at,
                //age: await UtilityServices.Patient.getAge(Util.dateParse(patient.data.view.date_of_birth))
            

            // this.setState({
            //       basic:basic,

            //     is_load: true,
            //     //patient_age:await UtilityServices.getAge('1974-04-11')
            // })
            console.log("dischargeReport",this.state.dischargeReport)
            
        }
    }

    render() {
        const { classes } = this.props;
        let patient_id = this.state.patient_id
        if (patient_id != this.props.patient_id) {
            this.setState({
                patient_id: this.props.patient_id
            })
            this.loadData()
        }
        const {
            letterTitle,
                    } = this.props;

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
                   height: 55px;
                 }
       
                 
                 .footer {
                   position: fixed;
                   bottom: 0;
                 }
          
         }
       `;
        return (
            
                  
                <Fragment>
                  <LoonsCard>
                  <CardTitle title="Midnight Reports" />
                    <MainContainer>
                              <Grid container={2}>
                                          <Grid 
                                          className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}>
                                        <SubTitle title="Date" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.formData.date}
                                            placeholder="Date"
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={date => {
                                                let formData = this.state.formData;
                                                formData.date = date;
                                                this.setState({ formData })
                                               
                                            }}
                                        />
                                          </Grid>
                                           <Grid item>
                                          <Button
                                className="text-right  ml-1  mt-6"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                                startIcon="search"
                                onClick={() => { 
                                    this.loadData()
                                   
                                    console.log("FormData",this.state.formData)
                                   console.log("new sum",this.state.sumDischarge)
                                    console.log("new dis",this.state.dischargeReport)
                                    console.log("new a",this.state.admitReport)
                                    console.log("new p",this.state.previuousAdmissioncount)
                                    // this.handleSearchButton()
                               }}
                            >
                                <span className="capitalize">Search</span>
                            </Button> 
                            {/* <Button
                                className="text-right  ml-1  mt-6"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                              //   startIcon="search"
                                onClick={() => { this.handleSearchButton() }}
                            >
                                <span className="capitalize">Reset</span>
                            </Button>
                                         
                                          <Grid>
                                          <div className='w-full'><SubTitle title="Ward:" /><SubTitle title={this.state.basic.ward}/></div>

                                          </Grid> */}
                                           </Grid>
                                          <Grid>

                                          </Grid>

                                       
                                    </Grid>

                        <div className="w-full">
                            {/* <h5 className={classes.title}>Midnight Reports</h5> */}
                            <Grid container spacing={2} className={classes.centered}>

                                {/* <Grid item xs={6}>
                                    <div className={classes.detailRow}></div>
                                    <div className={classes.detailRow}></div>
                                    <div className={classes.detailRow}><SubTitle title="Transfer From a Hospital :" /><SubTitle title={this.state.basic.transferfromahospital}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Transfer From a Clinic :" /><SubTitle title={this.state.basic.transferfromaclinic}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Referd by Med.Practitioner:" /><SubTitle title={this.state.basic.referredbymedp}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Total Admissions :" /><SubTitle title={this.state.basic.totaladmissions}/></div>

                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.detailRow}><SubTitle title="Discharge Mode :" /><SubTitle title="No of Patients"/></div>
                                    <div className={classes.detailRow}><SubTitle title="Alive :" /><SubTitle title={this.state.basic.alive}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Inward Transfer :" /><SubTitle title={this.state.basic.inwardtranfer2}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Outisde Transfer :" /><SubTitle title={this.state.basic.outsidetranfer}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Missing :" /><SubTitle title={this.state.basic.missing}/></div>
                                    <div className={classes.detailRow}><SubTitle title="LAMA :" /><SubTitle title={this.state.basic.lama}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Death :" /><SubTitle title={this.state.basic.death}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Total Discharges :" /><SubTitle title={this.state.basic.totaldischarges}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Previous Day Total :" /><SubTitle title={this.state.basic.previousdaytotal}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Midnight Total :" /><SubTitle title={this.state.basic.midnighttotal}/></div>
                                </Grid> */}
                                {this.state.loaded === true ?
                                    <div className="w-full">
                                <Grid className="mt-5"
                                 container
                                 spacing={0}
                                 direction="column"
                                 alignItems="center"
                                 justifyContent="center"
                                 style={{ minHeight: '50vh' }}>
                                    <Grid className='w-full'
                                     item 
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}>

                                    <div ref={(el) => (this.componentRef = el)} >
                                  <SubTitle title="Date:" /><SubTitle title={dateParse(this.state.formData.date)}/>
                                  <SubTitle title="Ward:" /><SubTitle title={this.state.formData.ward_id}/>

                                    <table className="w-full">
                                    <tr >
                                    <th style={{borderBottom:'1px',borderBottomStyle:"solid"}} ><SubTitle title=" Admission Mode " /></th>
                                    <th style={{borderBottom:'1px',borderBottomStyle:"solid"}}><SubTitle title='.   No of Patients   .'/></th>
                                    </tr>
                                    <tr >
                                    <td className="w-full" ><SubTitle title='Direct'/></td>
                                    <td className="ml-10 w-full"><SubTitle title={this.state.admitReport.filter((ele) => ele.mode === "direct").length > 0 ?this.state.admitReport.filter((ele) => ele.mode === "direct")[0].count : 0 }/></td>
                                    </tr>
                                    <tr >
                                    <td className="w-full" ><SubTitle title=' Referral from Ward'/></td>
                                    <td className="ml-10 w-full"><SubTitle title={this.state.admitReport.filter((ele) => ele.mode === " referral from Ward").length > 0 ?this.state.admitReport.filter((ele) => ele.mode === " referral from Ward")[0].count : 0 }/></td>
                                    </tr>
                                    <tr >
                                    <td className="w-full" ><SubTitle title='Transferred from Hospital'/></td>
                                    <td className="ml-10 w-full"><SubTitle title={this.state.admitReport.filter((ele) => ele.mode === "   Transferred from Hospital").length > 0 ?this.state.admitReport.filter((ele) => ele.mode === " Transferred from Hospital")[0].count : 0 }/></td>
                                    </tr>
                                    <tr >
                                    <td className="w-full" ><SubTitle title='Referral from Clinic'/></td>
                                    <td className="ml-10 w-full"><SubTitle title={this.state.admitReport.filter((ele) => ele.mode === "Referral from Clinic").length > 0 ?this.state.admitReport.filter((ele) => ele.mode === "Referral from Clinic")[0].count : 0 }/></td>
                                    </tr>
                                    <tr >
                                    <td className="w-full" ><SubTitle title=' Transfer from Hospital'/></td>
                                    <td className="ml-10 w-full"><SubTitle title={this.state.admitReport.filter((ele) => ele.mode === " Transfer from Hospital").length > 0 ?this.state.admitReport.filter((ele) => ele.mode === " Transfer from Hospital")[0].count : 0 }/></td>
                                    </tr>
                                  


                                   
                                    {/* {this.state.loaded ?  this.state.newPreviuousAdmissioncount.map((value) => (
                                        <tr className="w-full">
                                          
                                            <td className="w-full"><SubTitle title={value.label}/></td>
                                            <td className="ml-10 w-full"><SubTitle title={value.count}/></td>
                                                            
                                                            {/* <TableRow key={value.no}>
                                                                <td className='px-4'>{value.label}</td>
                                                                <td className='px-4'>{value.count}</td>
                                                                
                                                            </TableRow>
                                                        */}
                                        {/* </tr>
                                    ))
                              
                                    :null} */}
                                    {/* <tr >
                                    <td><SubTitle title="Direct :" /></td>
                                    <td><SubTitle title={this.state.basic.direct}/></td>
                                    </tr>
                                    <tr>
                                    <td><SubTitle title="Inward Transfer :" /></td>
                                    <td><SubTitle title={this.state.basic.inwardtranfer}/></td>
                                    </tr>
                                    <tr>
                                    <td><SubTitle title="Transfer From a Hospital" /></td>
                                    <td><SubTitle title={this.state.basic.transferfromahospital}/></td>
                                    </tr>
                                    <tr>
                                    <td><SubTitle title="Transfer From a Clinic" /></td>
                                    <td><SubTitle title={this.state.basic.transferfromaclinic}/></td>
                                    </tr> */}
                                    {/* <tr>
                                    <td><SubTitle title="Referd by Med.Practitioner :" /></td>
                                    <td><SubTitle title={this.state.basic.referredbymedp}/></td>
                                    </tr> */}
                                    <tr>
                                    <td><SubTitle title="Total Admissions :" /></td>
                                    <td><SubTitle title={this.state.sumAdmission !== 0 ? this.state.sumAdmission : 0}/></td>
                                    </tr>
                                    <tr>
                                    {/* <td><SubTitle title="Discharge Mode " /></td>
                                    <td><SubTitle title={this.state.basic.dis}/></td> */}
                                    </tr>
                                    <tr>
                                    <th style={{borderBottom:'1px',borderBottomStyle:"solid"}}><SubTitle title="Discharge Mode " /></th>
                                    <th style={{borderBottom:'1px',borderBottomStyle:"solid"}}><SubTitle title="No of Patients"/></th>
                                    </tr>
                                    <tr >
                                    <td className="w-full" ><SubTitle title='Alive'/></td>
                                    <td className="ml-10 w-full"><SubTitle title={this.state.dischargeReport.filter((ele) => ele.mode === "alive").length > 0 ?this.state.dischargeReport.filter((ele) => ele.mode === "alive")[0].count : 0 }/></td>
                                    </tr>
                                    <tr >
                                    <td className="w-full" ><SubTitle title='Death'/></td>
                                    <td className="ml-10 w-full"><SubTitle title={this.state.dischargeReport.filter((ele) => ele.mode === "death").length > 0 ?this.state.dischargeReport.filter((ele) => ele.mode === "death")[0].count : 0 }/></td>
                                    </tr>
                                    <tr >
                                    <td className="w-full" ><SubTitle title='LAMA'/></td>
                                    <td className="ml-10 w-full"><SubTitle title={this.state.dischargeReport.filter((ele) => ele.mode === "lama").length > 0 ?this.state.dischargeReport.filter((ele) => ele.mode === "lama")[0].count : 0 }/></td>
                                    </tr>
                                    <tr >
                                    <td className="w-full" ><SubTitle title='Transfer to other hospital'/></td>
                                    <td className="ml-10 w-full"><SubTitle title={this.state.dischargeReport.filter((ele) => ele.mode === "transfer to other hospital'").length > 0 ?this.state.dischargeReport.filter((ele) => ele.mode === "transfer to other hospital'")[0].count : 0 }/></td>
                                    </tr> <tr >
                                    <td className="w-full" ><SubTitle title='Shared Care'/></td>
                                    <td className="ml-10 w-full"><SubTitle title={this.state.dischargeReport.filter((ele) => ele.mode === "shared care").length > 0 ?this.state.dischargeReport.filter((ele) => ele.mode === "shared care")[0].count : 0 }/></td>
                                    </tr>
                                    {/* {this.state.loaded ?  this.state.newDischarge.map((value) => (
                                        <tr className="w-full">
                                          
                                            <td className="w-full"><SubTitle title={value.mode}/></td>
                                            <td className="ml-10 w-full"><SubTitle title={value.count}/></td>
                                                            
                                                            {/* <TableRow key={value.no}>
                                                                <td className='px-4'>{value.label}</td>
                                                                <td className='px-4'>{value.count}</td>
                                                                
                                                            </TableRow>
                                                        */}
                                        {/* </tr>
                                    ))
                              
                                    :null} */}
                                  
                                    {/* <td><SubTitle title={this.state.basic.alive}/></td>
                                    <tr>
                                    <td><SubTitle title="Death :" /></td>
                                    <td><SubTitle title={this.state.basic.death}/></td>
                                    </tr>
                                    <tr>
                                    <td><SubTitle title="LAMA" /></td>
                                    <td><SubTitle title={this.state.basic.lama}/></td>
                                    </tr>
                                    <tr>
                                    <td><SubTitle title="Transfer to Other Hospital" /></td>
                                    <td><SubTitle title={this.state.basic.transfertoOtherhos}/></td>
                                    </tr>
                                    <tr>
                                    <td><SubTitle title="Shared Care :" /></td>
                                    <td><SubTitle title={this.state.basic.sharedCare}/></td>
                                    </tr> */}
                                    <tr>   
                                    <td ><SubTitle title="Total Discharges  :" /></td>
                                    <td><SubTitle title={this.state.sumDischarge !== 0 ? this.state.sumDischarge : 0}/></td>
                                    <br></br>       
                                    </tr>
                                    
                                    <td style={{borderTop:'1px',borderTopStyle:"solid"}}><SubTitle title="Previous Day Admission Total " /></td>
                                    <td style={{borderTop:'1px',borderTopStyle:"solid"}}><SubTitle title={this.state.previuousAdmissioncount.length > 0 ? this.state.previuousAdmissioncount : 0}/></td>
                                    <tr>
                                    <td style={{borderTop:'1px',borderTopStyle:"solid"}}><SubTitle title="Previous Day Discharge Total " /></td>
                                    <td style={{borderTop:'1px',borderTopStyle:"solid"}}><SubTitle title={this.state.previuousAdmissioncount.length > 0 ? this.state.previuousAdmissioncount : 0}/></td>
                                   
                                    <td style={{borderBottom:'1px',borderBottomStyle:"solid"}}><SubTitle title="Midnight Total " /></td>
                                    <td style={{borderBottom:'1px',borderBottomStyle:"solid"}}><SubTitle title={this.state.basic.midnighttotal !== 0 ? this.state.midnighttotal : 0}/></td>
                                    </tr>
                                    </table>

                              </div>

                                    </Grid>

                                </Grid>
                                <Grid container={3}>
                              <Grid item>
                               {/* <Button
                                className="text-right ml-1 mt-4"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                                startIcon="print"
                                onClick={() => { this.handleSearchButton() }}
                            >
                                <span className="capitalize">Print</span>
                            </Button> */}
                            <ReactToPrint
                             className="text-right ml-1 mt-8"
                        trigger={() => <Button size="small" startIcon="print">Print</Button>}
                        pageStyle={pageStyle}
                        documentTitle={letterTitle}
                        //removeAfterPrint
                        content={() => this.componentRef}
                    />
                            </Grid></Grid>

                                    </div>:() =>{
                                        this.setState({
                                            snackbar: true,
                                             snackbar_severity: 'success',
                                            message: "Successfully Saved ",
                                             alert: true
                                        })
                                    }
                                }
                            {/* <Grid item>
                            <Button
                                className="text-right ml-1 mt-4"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                              //   startIcon="search"
                                onClick={() => { this.handleSearchButton() }}
                            >
                                <span className="capitalize">Menu</span>
                            </Button>
                            </Grid>
                            <Grid item>
                            <Button
                                className="text-right ml-1 mt-4"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                                startIcon="logout"
                                onClick={() => { this.handleSearchButton() }}
                            >
                                <span className="capitalize">Logout</span>
                            </Button>
                            </Grid>           
                                        */}
                            </Grid>       
                          
                            {/* <h5 className={classes.title}>Drug Allergies</h5>
                            {
                                this.state.drugAllergies.map((allergy)=><Chip className={classes.chip} label={allergy} variant="outlined" onDelete={()=>{}} />)
                            }
                            <h5 className={classes.title}>Registered Clinics</h5>
                            {
                                this.state.clinics.map((clinic)=><Chip className={classes.chip} style={{ backgroundColor: clinic.background, color: clinic.color }} label={clinic.name} variant="outlined" onDelete={()=>{}} />)
                            } */}
                        </div>

                    </MainContainer>
                    <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({alert: false})
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    // elevation={2}
                    variant="filled"
                >
                </LoonsSnackbar>

                  </LoonsCard>
                </Fragment>
        );
    }
}

export default withStyles(styleSheet)(MROMidNightReport);


