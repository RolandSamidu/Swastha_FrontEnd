import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { Button } from "@material-ui/core";
import Npdrug from "./components/npdrug";
import PatientSelection from "./components/patientSelection";

const styleSheet = ((palette, ...theme) => ({

}));

class NPDrug extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<Fragment>
            <div className="pb-24 pt-7 px-8 ">
                <Npdrug />
            </div>
        </Fragment>)
    }
}

export default withStyles(styleSheet)(NPDrug);