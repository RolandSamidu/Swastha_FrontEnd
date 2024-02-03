import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import PrescriptionOverview from "./components/pharmacist/PrescriptionOverview";
import PrescriptionSnapshot from "./components/pharmacist/PrescriptionSnapshot";
import PrescriptionExtras from "./components/pharmacist/PrescriptionExtras";
import DrugsSnapshot from "./components/pharmacist/DrugsSnapshot";

const styleSheet = ((palette, ...theme) => ({

}));

class Pharmacy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            patient: localStorage.getItem("patient")
        }
    }

    render() {
        return (
            <>
                <Fragment>
                    <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Grid item xs={6}>
                            <PrescriptionExtras />
                        </Grid>
                        <Grid item xs={6}>
                            <DrugsSnapshot />
                        </Grid>
                    </Grid>
                    <div className="pb-24 pt-7 px-8 ">
                        <PrescriptionOverview />
                    </div>
                    <div className="pb-24 pt-7 px-8 ">
                        <PrescriptionSnapshot />
                    </div>
                </Fragment>
            </>
        );
    }
}

export default withStyles(styleSheet)(Pharmacy);