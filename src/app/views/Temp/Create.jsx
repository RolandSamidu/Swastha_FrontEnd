import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Card,
    Icon,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
    Typography,
    TextField,
    Fab
} from '@material-ui/core'
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import 'date-fns'
import { Resizable } from 'react-resizable';
import { ResizableBox } from 'react-resizable';
import Test from "./Test";
import Diagnosis from "./Diagnosis";
import { LoonsTable, DatePicker, FilePicker, Button, ExcelToTable, Widget, WidgetComponent } from "app/components/LoonsLabComponents";
import List from "./List";
import SampleForm from "./SampleForm";
import HelthStatus from "./HelthStatus";

const styleSheet = ((theme) => ({

}));

class Create extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: 250,
            height: 200,
        }
    }


    // On top layout
    onResize = (event, { element, size, handle }) => {
        this.setState({ width: size.width, height: size.height });
    };


    render() {
        let { theme } = this.props;
        const { classes } = this.props


        return (
            <Fragment >
                <div className="px-2 py-2">
                    <Grid container spacing={1}>

                        <Grid item lg={3} md={6} sm={12} xs={12}>

                            <Grid container spacing={1}>
                                <Grid item className="w-full">
                                    <Widget id='diagnose1' title="Health Status">
                                        <HelthStatus />
                                    </Widget>
                                </Grid>
                                <Grid item className="w-full">
                                    <Widget id='diagnose2' title="Diagnosis">
                                        <Diagnosis />
                                    </Widget>
                                </Grid>
                                <Grid item className="w-full">
                                    <Widget id='diagnose3' title="Diagnosis">
                                        <Diagnosis />
                                    </Widget>
                                </Grid>
                            </Grid>

                        </Grid>

                        <Grid item lg={9} md={6} sm={12} xs={12}>

                            <Grid container spacing={1} >
                                <Grid className="w-full" item lg={12} md={12} sm={6} xs={6}>
                                    <Grid container spacing={1} >
                                        <Grid className="w-full" item lg={4} md={6} sm={1} xs={1}>
                                            <Widget id='test2' title="Allergies" height={152}>
                                                <List />
                                            </Widget>
                                        </Grid>
                                        <Grid className="w-full" item lg={8} md={6} sm={1} xs={1}>
                                            <Widget id='test3' title="Testing Widget2">
                                                <Test />
                                            </Widget>
                                        </Grid>

                                    </Grid>
                                </Grid>

                                <Grid className="w-full" item lg={12} md={12} sm={6} xs={6}>

                                    <Widget id='test4' title="Doctor Description">
                                        <SampleForm />
                                    </Widget>


                                </Grid>

                            </Grid>



                        </Grid>
                    </Grid>

                </div >
            </Fragment >

        );
    }
}

export default withStyles(styleSheet)(Create);
