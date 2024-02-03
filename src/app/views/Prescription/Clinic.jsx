import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { Button } from "@material-ui/core";
import Prescription from "./components/prescription";
import PatientSelection from "./components/patientSelection";

const styleSheet = ((palette, ...theme) => ({

}));

class Clinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            patient: localStorage.getItem("patient")
        }
    }

    render() {
        if (!this.state.patient) {
            return <PatientSelection />
        }
        return (
            <>

            
                <Button onClick={() => { localStorage.removeItem('patient'); window.location.reload(); }}>Reset Patient</Button>
                <Fragment>
                    <div className="pb-24 pt-7 px-8 ">
                        <Prescription />
                    </div>
                </Fragment>
            </>
        );
    }
}

export default withStyles(styleSheet)(Clinic);