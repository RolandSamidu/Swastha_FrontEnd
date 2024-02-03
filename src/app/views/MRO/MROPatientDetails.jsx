import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { MainContainer, SubTitle, Widget } from "app/components/LoonsLabComponents";
import { Chip, Grid } from "@material-ui/core";

import PatientServices from 'app/services/PatientServices'
import * as Util from '../../../utils'
import UtilityServices from 'app/services/UtilityServices'

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

class MROPatientDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            data: [],
            age: {
                age_years: '',
                age_months: '',
                age_days: '',
            },
            basic: {
                phn: this.props.patient.Patient.phn,
                //     nic: '933928291V',
                name: this.props.patient.Patient.name,
                // dob: '1990-01-01',
                // address: 'Avet Ferry road, Kotuwegoda',
                // origin: 'Kandy 007',
                // mobile: '0788892823',
                gender: this.props.patient.Patient.gender,
                age: this.props.patient.Patient.date_of_birth,

                bht: this.props.patient.bht,
                patient_ward: this.props.patient?.Pharmacy_drugs_store.name,
                mro_request_type: this.props.patient?.mro_status,
                status: this.props.patient?.status,
                admission_time: this.props.patient?.admit_date_time ? Util.timeParse(this.props.patient?.admit_date_time) : 'N/A',
                admission_date: this.props.patient?.admit_date_time ? Util.dateParse(this.props.patient?.admit_date_time) : 'N/A',
                // admission_date:this.props.patient.,

                transfer_date: this.props.patient?.transfer_date_time ? Util.dateParse(this.props.patient?.transfer_date_time) : 'N/A',
                transfer_time: this.props.patient?.transfer_date_time ? Util.timeParse(this.props.patient?.transfer_date_time) : 'N/A',
                // transfer_time:this.props.patient.,
                discharged_mode: this.props.patient.discharge_mode,
                // icd_code:this.props.patient.,
                primary_diagnosis: this.props.patient.P_D?this.props.patient?.P_D?.icd_code + "-" + this.props.patient?.P_D?.type: "N/A",
                additional_diagnosis: this.props.patient.O_D?this.props.patient?.O_D?.icd_code + "-" + this.props.patient?.O_D?.type: "N/A",
                discharged_ward: this.props.patient.Pharmacy_drugs_store.name,
                ward_discharged_on: this.props.patient?.discharge_date_time ? Util.dateParse(this.props.patient?.discharge_date_time) : 'N/A',
                ward_discharged_at: this.props.patient?.discharge_date_time ? Util.timeParse(this.props.patient?.discharge_date_time) : 'N/A',

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
                { name: 'Norris Clinic', color: 'white', background: 'blue' },
                { name: 'Avent Clinic', color: 'white', background: 'red' },
                { name: 'Second Clinic', color: 'white', background: 'green' },
            ]
        }
    }
    async getAge() {
        let age = this.props.patient.Patient.date_of_birth
        let newAge = await UtilityServices.getAge(Util.dateParse(age))
        console.log('newage', newAge)
        let calAge = newAge.age_years + " Y " + newAge.age_months + " M " + newAge.age_days + " D "

        this.setState({

            age: newAge
        })
    }

    componentDidMount() {
        this.getAge()
        //   this.loadData()

        console.log('Patient', this.props.patient)
    }


    // async loadData() {
    //     console.log("aaaa", this.props.patient_id)
    //     let patient = await PatientServices.getPatientByIdClinic(this.props.id, {})
    //     console.log("data",patient)
    //     if (200 == patient.status) {
    //         // let basic={}
    //       let  basic= {
    //             phn: patient.Patient.phn,
    //             bht:patient.bht,
    //             patient_ward:patient.patient_ward,//ask
    //         //     nic: patient.nic,
    //             name: patient.Patient.name,
    //             dob: Util.dateParse(patient.Patient.date_of_birth),
    //             address: patient.Patient.address,
    //             origin: patient.Patient.nearest_hospital,
    //             mobile: patient.Patient.mobile_no,
    //             gender: patient.Patient.gender,
    //             age:patient.Patient.age,

    //             admission_time:patient.admit_date_time,//ask
    //             admission_date:patient.Patient.admission_date,
    //             transfer_date:patient.transfer_date_time,
    //             transfer_time:patient.Patient.transfer_time,
    //             discharged_mode:patient.discharge_mode,
    //             icd_code:patient.Patient.icd_code,//ask
    //             additional_diagnosis:patient.Patient.additional_diagnosis,
    //             discharged_ward:patient.Patient.discharged_ward,
    //             ward_discharged_on:patient.Patient.ward_discharged_on,
    //             ward_discharged_at:patient.Patient.ward_discharged_at,
    //             //age: await UtilityServices.Patient.getAge(Util.dateParse(patient.data.view.date_of_birth))
    //         }

    //         this.setState({
    //             basic: basic,
    //             is_load: true,
    //             //patient_age:await UtilityServices.getAge('1974-04-11')
    //         })

    //     }


    // }

    render() {
        const { classes } = this.props;
        let patient_id = this.state.patient_id
        if (patient_id != this.props.patient_id) {
            this.setState({
                patient_id: this.props.patient_id
            })
            this.loadData()
        }

        return (
            <Widget padded={false} title="Patient Details" id="patient_details">
                <Fragment>
                    <MainContainer>
                        <div>
                            <h5 className={classes.title}>Basic Details</h5>
                            <Grid container spacing={2} className={classes.centered}>
                                <Grid item xs={12}>
                                    <div className={classes.detailRow}><SubTitle title="PHN Number :" /><SubTitle title={this.state.basic.phn} /></div>
                                    <div className={classes.detailRow}><SubTitle title="BHT Number :" /><SubTitle title={this.state.basic.bht} /></div>
                                    <div className={classes.detailRow}><SubTitle title="Patient Ward :" /><SubTitle title={this.state.basic.patient_ward} /></div>
                                    <div className={classes.detailRow}><SubTitle title="Patient Name :" /><SubTitle title={this.state.basic.name} /></div>
                                    {/* <div className={classes.detailRow}><SubTitle title="Date of Birth :" /><SubTitle title={this.state.basic.dob}/></div> */}
                                    <div className={classes.detailRow}><SubTitle title="Gender :" /><SubTitle title={this.state.basic.gender} /></div>
                                    <div className={classes.detailRow}><SubTitle title="Patient Age :" /><SubTitle title={this.state.age.age_years + " Y " + this.state.age.age_months + " M " + this.state.age.age_days + " D "} /></div>
                                    <div className={classes.detailRow}><SubTitle title="Admission Time :" /><SubTitle title={this.state.basic.admission_time} /></div>
                                    <div className={classes.detailRow}><SubTitle title="Admission Date :" /><SubTitle title={this.state.basic.admission_date} /></div>
                                    <div className={classes.detailRow}><SubTitle title="MRO Status :" /><SubTitle title={this.state.basic.mro_request_type} /></div>
                                    <div className={classes.detailRow}><SubTitle title="Ward Status :" /><SubTitle title={this.state.basic.status} /></div>

                                </Grid>
                                <Grid item xs={12}>
                                    <div className={classes.detailRow}><SubTitle title="Transfer Date :" /><SubTitle title={this.state?.basic?.transfer_date} /></div>
                                    <div className={classes.detailRow}><SubTitle title="Transfer Time :" /><SubTitle title={this.state.basic.transfer_time} /></div>
                                    <div className={classes.detailRow}><SubTitle title="Discharged Ward :" /><SubTitle title={this.state.basic.discharged_ward} /></div>
                                    <div className={classes.detailRow}><SubTitle title="Primary Diagnosis :" /><SubTitle title={this.state.basic?.primary_diagnosis} /></div>
                                    <div className={classes.detailRow}><SubTitle title="Other Diagnosis :" /><SubTitle title={this.state.basic?.additional_diagnosis} /></div>
                                    <div className={classes.detailRow}><SubTitle title=" Ward Discharged On :" /><SubTitle title={this.state.basic.ward_discharged_on} /></div>
                                    <div className={classes.detailRow}><SubTitle title="Ward Discharged At :" /><SubTitle title={this.state.basic.ward_discharged_at} /></div>
                                    {/* <div className={classes.detailRow}><SubTitle title="Origin/Hospital :" /><SubTitle title={this.state.basic.origin}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Address :" /><SubTitle title={this.state.basic.address}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Mobile Number :" /><SubTitle title={this.state.basic.mobile}/></div> */}
                                </Grid>
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
                </Fragment>
            </Widget>
        );
    }
}

export default withStyles(styleSheet)(MROPatientDetails);


