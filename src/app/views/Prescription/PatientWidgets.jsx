import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { Button, Grid } from "@material-ui/core";
import PharmacistPrescription from "./components/pharmacist/prescription";
import PatientClinicHistory from "./components/pharmacist/PatientClinicHistory";
import PatientDetails from "./components/pharmacist/PatientDetails";
import PatientPrescriptionHistory from "./components/pharmacist/PatientPrescriptionHistory";
import PatientSelection from "./components/patientSelection";
import Allergies from "./components/pharmacist/Allergies";
import Diagnosis from "./components/pharmacist/Diagnosis";
import { LoonsCard } from "app/components/LoonsLabComponents";
import fscreen from 'fscreen';

const styleSheet = ((palette, ...theme) => ({

}));

class PatientWidgets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            patient: localStorage.getItem("patient")
        }
    }
    
    render() {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        if (!params.patient_id) {
            window.location.href = '/pharmacy/search/patients';
        }
        return (
            <>
                <Fragment>
                    <div className="pb-24 pt-7 px-8 ">
                        <PatientPrescriptionHistory />
                    </div>
                    <Grid className="px-8" container spacing={2} style={{ display: 'flex'}}>
                        <Grid item xs={4}>
                            <PatientClinicHistory />
                        </Grid>
                        <Grid item xs={5}>
                            <PatientDetails />
                        </Grid>
                        <Grid item xs={3}>
                            <LoonsCard>
                                <h5>Allergies</h5>
                                <Allergies />
                            </LoonsCard>
                        </Grid>

                        <Grid item xs={6}>
                            <LoonsCard>
                                <h5>Diagnosis</h5>
                                <Diagnosis />
                            </LoonsCard>
                        </Grid>
                    </Grid>
                </Fragment>
            </>
        );
    }
}

export default withStyles(styleSheet)(PatientWidgets);