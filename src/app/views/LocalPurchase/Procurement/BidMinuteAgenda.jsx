import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'

import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    CircularProgress,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    Typography,
    Box,
    Tabs,
    Tab
} from '@material-ui/core'
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,



} from 'app/components/LoonsLabComponents'

import LoonsButton from 'app/components/LoonsLabComponents/Button';
class CreateAgenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            formData: {
                description: null,
            }
        }
    }



    render() {
        return (
            <>
                <CardTitle title={" Bid Opening Committe No: BC/04/2021"} />
                <ValidatorForm onSubmit={() => { }} className="w-full">
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Grid container spacing={1} className="space-between ">
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <SubTitle title="Date" />
                                <DatePicker
                                    className="w-full"
                                    placeholder="From"
                                />
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <label>Time</label>
                                <TextValidator
                                    className=" w-full"
                                    name="excess"
                                    InputLabelProps={{ shrink: false }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                />
                                {/* <MuiPickersUtilsProvider>
                                    <TimePicker
                                        className="w-full"
                                        label="Select Time"
                                        inputVariant="outlined"
                                        // value={selectedTime}
                                        // onChange={handleTimeChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />
                                </MuiPickersUtilsProvider> */}
                            </Grid>
                        </Grid>
                    </div>
                    <div style={{
                        marginTop: '25',
                    }}>
                        <Grid container spacing={2}>
                            <Grid
                                className=" w-full"
                                item
                                lg={8}
                                md={8}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Remarks" />
                                <TextValidator
                                    multiline
                                    rows={4}
                                    className=" w-full"
                                    placeholder="Remarks"
                                    name="description"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    value={
                                        this.state.formData
                                            .description
                                    }
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {
                                        this.setState({
                                            formData: {
                                                ...this
                                                    .state
                                                    .formData,
                                                description:
                                                    e.target
                                                        .value,
                                            },
                                        })
                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'space-between',
                            marginTop: '29px'
                        }}
                    >
                        <Grid
                            className=" w-full"
                            item
                            style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                        >
                            <Grid container spacing={2}>
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className=" w-full flex justify-end"
                                >
                                    <Button
                                        className="mt-2 mr-2"
                                        progress={false}
                                        // type="submit"
                                        // color="#d8e4bc"
                                        // startIcon="checklist"
                                        // style={{ backgroundColor: '#F02020' }}
                                        scrollToTop={
                                            true
                                        }
                                    //onClick={this.handleChange}
                                    >
                                        <span className="capitalize">
                                            Save
                                        </span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </ValidatorForm>
            </>
        )
    }
}

export default CreateAgenda