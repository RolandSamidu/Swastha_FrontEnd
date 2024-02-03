import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import PharmacistPrescription from "./components/pharmacist/prescription";
import PatientClinicHistory from "./components/pharmacist/PatientClinicHistory";
import PatientDetails from "./components/pharmacist/PatientDetails";
import PatientPrescriptionHistory from "./components/pharmacist/PatientPrescriptionHistory";
import PatientSelection from "./components/patientSelection";
import Allergies from "./components/pharmacist/Allergies";
import Diagnosis from "./components/pharmacist/Diagnosis";
import { LoonsCard, Button, Widget } from "app/components/LoonsLabComponents";
import fscreen from 'fscreen';

const styleSheet = ((palette, ...theme) => ({

}));

class Patient extends Component {
    constructor(props) {
        super(props)
        this.state = {
            patient: localStorage.getItem("patient"),
            moreView: false,
        }
    }

    render() {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        let patient_id = null
        if (!params.patient_id) {
            window.location.href = '/pharmacy/search/patients';
        } else {
            patient_id = params.patient_id
        }


        return (
            <>
                <Fragment>
                    <div className="pt-7 px-8 ">
                        <Widget padded={false} title="Prescription" id="prescription_clinic">
                            <PharmacistPrescription patient_id={patient_id} />
                        </Widget>
                    </div>

                    <div className="pt-7 px-8 ">
                        <Button

                            progress={false}
                            //type="submit"
                            // scrollToTop={true}
                            //startIcon="save"
                            onClick={() => {
                                this.setState({ moreView: true })
                            }}
                        >
                            <span className="capitalize">More Info</span>
                        </Button>
                    </div>
                    {this.state.moreView ?
                        <div className="w-full">
                            <Grid className="px-8" container spacing={2} style={{ display: 'flex' }}>
                                <Grid item xs={4}>
                                    <Widget padded={false} title="Patient Clinic History" id="patient_clinic_history">
                                        <PatientClinicHistory patient_id={patient_id} />
                                    </Widget>
                                </Grid>
                                <Grid item xs={5}>
                                    <Widget padded={false} title="Patient Details" id="patient_details">
                                        <PatientDetails patient_id={patient_id} />
                                    </Widget>
                                </Grid>
                                <Grid item xs={3}>
                                <Widget title="Allergies" id="patient_Allergies">
                                       <Allergies patient_id={patient_id} />
                                    </Widget>
                                </Grid>

                                <Grid item xs={6}>
                                    <Widget title="Diagnosis" id="patient_Diagnosis">
                                        <Diagnosis patient_id={patient_id} />
                                    </Widget>
                                </Grid>
                            </Grid>
                            <div className="pb-24 pt-7 px-8 ">
                                <Widget title="Patient Prescription History" id="patient_pres_history">
                                    <PatientPrescriptionHistory patient_id={patient_id} />
                                </Widget>
                            </div>
                        </div>
                        : null}
                </Fragment>
            </>
        );
    }
}

export default withStyles(styleSheet)(Patient);