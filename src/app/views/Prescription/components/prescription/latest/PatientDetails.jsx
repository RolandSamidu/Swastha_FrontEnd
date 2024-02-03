import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { MainContainer, SubTitle, Widget } from "app/components/LoonsLabComponents";
import { Chip, Grid } from "@material-ui/core";

import PatientServices from 'app/services/PatientServices'
import * as Util from '../../../../../../utils'
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

class PatientDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            data: [],
            basic: {
                phn: '22323A',
                nic: '933928291V',
                name: 'A B C D Suraweera',
                dob: '1990-01-01',
                address: 'Avet Ferry road, Kotuwegoda',
                origin: 'Kandy 007',
                mobile: '0788892823',
                gender: 'Male',
                age: 42
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
            ]
        }
    }


    async loadData() {
        console.log("aaaa", this.props.patient_id)
        let patient = await PatientServices.getPatientById(this.props.patient_id, {})
        if (200 == patient.status) {

          let  basic= {
                phn: patient.data.view.phn,
                nic: patient.data.view.nic,
                name: patient.data.view.name,
                dob: Util.dateParse(patient.data.view.date_of_birth),
                address: patient.data.view.address,
                origin: patient.data.view.nearest_hospital,
                mobile: patient.data.view.mobile_no,
                gender: patient.data.view.gender,
                age:45
                //age: await UtilityServices.getAge(Util.dateParse(patient.data.view.date_of_birth))
            }



            this.setState({
                basic: basic,
                is_load: true,
                //patient_age:await UtilityServices.getAge('1974-04-11')
            })
            
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

        return (
            <Widget padded={false} title="Patient Details" id="patient_details">
                <Fragment>
                    <MainContainer>
                        <div>
                            <h5 className={classes.title}>Basic Details</h5>
                            <Grid container spacing={2} className={classes.centered}>
                                <Grid item xs={12}>
                                    <div className={classes.detailRow}><SubTitle title="PHN Number :" /><SubTitle title={this.state.basic.phn}/></div>
                                    <div className={classes.detailRow}><SubTitle title="NIC Number :" /><SubTitle title={this.state.basic.nic}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Date of Birth :" /><SubTitle title={this.state.basic.dob}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Gender :" /><SubTitle title={this.state.basic.gender}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Patient Age :" /><SubTitle title={this.state.basic.age}/></div>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className={classes.detailRow}><SubTitle title="Patient Name :" /><SubTitle title={this.state.basic.name}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Origin/Hospital :" /><SubTitle title={this.state.basic.origin}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Address :" /><SubTitle title={this.state.basic.address}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Mobile Number :" /><SubTitle title={this.state.basic.mobile}/></div>
                                </Grid>
                            </Grid>
                            <h5 className={classes.title}>Drug Allergies</h5>
                            {
                                this.state.drugAllergies.map((allergy)=><Chip className={classes.chip} label={allergy} variant="outlined" onDelete={()=>{}} />)
                            }
                            <h5 className={classes.title}>Registered Clinics</h5>
                            {
                                this.state.clinics.map((clinic)=><Chip className={classes.chip} style={{ backgroundColor: clinic.background, color: clinic.color }} label={clinic.name} variant="outlined" onDelete={()=>{}} />)
                            }
                        </div>
                    </MainContainer>
                </Fragment>
            </Widget>
        );
    }
}

export default withStyles(styleSheet)(PatientDetails);