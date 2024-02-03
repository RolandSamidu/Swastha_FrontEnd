import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { MainContainer, SubTitle, Widget } from "app/components/LoonsLabComponents";
import { Chip, Grid } from "@material-ui/core";
import PrescriptionService from "app/services/PrescriptionService";
import PatientServices from "app/services/PatientServices";

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
            drugAllergies: [],
            clinics: [],
            patient: null
        }
    }

    fetchClinics = () => {
       /*  const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        }); */
        PrescriptionService.fetchPatientClinics({ 'type': 'Clinic', 'patient_id': this.props.patient_id }).then((obj) => {
            if (obj.data) {
                const clinics = obj.data.view.data.map((clinic) => ({
                    id: clinic.Pharmacy_drugs_store ? clinic.Pharmacy_drugs_store.short_reference : 'N/A',
                    name: clinic.Pharmacy_drugs_store ? clinic.Pharmacy_drugs_store.name : 'N/A',
                    clinic_id: clinic.Pharmacy_drugs_store ? clinic.Pharmacy_drugs_store.id : 'N/A',
                }));
                this.setState({
                    clinics: clinics
                });
            }
        });
    }

    fetchPatient() {
       /*  const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        }); */
        PatientServices.getPatientById(this.props.patient_id).then((obj)=>{
            if(obj.data && obj.data.view) {
                this.setState({
                    patient: obj.data.view
                })
            }
        });
    }

    componentDidMount() {
        this.fetchPatient();
        this.fetchClinics();
    }

    render() {
        const { classes } = this.props;
        return (
             <Fragment>
                    <MainContainer>
                        <div>
                            <h5 className={classes.title}>Basic Details</h5>
                            <Grid container spacing={2} className={classes.centered}>
                                <Grid item xs={5}>
                                    <div className={classes.detailRow}><SubTitle title="PHN Number :" /><SubTitle title={this.state.patient ? this.state.patient.phn : ""}/></div>
                                    <div className={classes.detailRow}><SubTitle title="NIC Number :" /><SubTitle title={this.state.patient ? this.state.patient.nic : ""}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Date of Birth :" /><SubTitle title={`${new Date(this.state.patient ? this.state.patient.date_of_birth : "").getFullYear()}-${(new Date(this.state.patient ? this.state.patient.date_of_birth : "").getMonth()+1).toString().padStart(2,'0')}-${new Date(this.state.patient ? this.state.patient.date_of_birth : "").getDate().toString().padStart(2,'0')}`}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Gender :" /><SubTitle title={this.state.patient ? this.state.patient.gender : ""}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Patient Age :" /><SubTitle title={this.state.patient ? this.state.patient.age : ""}/></div>
                                </Grid>
                                <Grid item xs={7}>
                                    <div className={classes.detailRow}><SubTitle title="Patient Name :" /><SubTitle title={this.state.patient ? this.state.patient.name : ""}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Origin/Hospital :" /><SubTitle title={""}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Address :" /><SubTitle title={this.state.patient ? this.state.patient.address : ""}/></div>
                                    <div className={classes.detailRow}><SubTitle title="Mobile Number :" /><SubTitle title={this.state.patient ? this.state.patient.mobile_no : ""}/></div>
                                </Grid>
                            </Grid>
                            <h5 className={classes.title}>Drug Allergies</h5>
                            {
                                this.state.drugAllergies.map((allergy)=><Chip className={classes.chip} label={allergy} variant="outlined" onDelete={()=>{}} />)
                            }
                            <h5 className={classes.title}>Registered Clinics</h5>
                            {
                                this.state.clinics.map((clinic)=><Chip className={classes.chip} style={{ backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`, color: clinic.color }} label={clinic.name} variant="outlined" onDelete={()=>{}} />)
                            }
                        </div>
                    </MainContainer>
                </Fragment>
        );
    }
}

export default withStyles(styleSheet)(PatientDetails);