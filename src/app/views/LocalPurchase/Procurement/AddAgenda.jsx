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
class AddAgenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ward: [
                { id: 1, label: "W101" },
                { id: 2, label: "W102" },
                { id: 3, label: "W103" },
                { id: 4, label: "W104" },
                { id: 5, label: "W105" },
            ],
            loaded: false,
            formData: {
                description: null,
                ward_id: null
            }
        }
    }



    render() {
        return (
            <>
                {/* <CardTitle title={"Add to Agenda"} /> */}
                <ValidatorForm onSubmit={() => { }} className="w-full">
                    <Grid
                        className=" w-full"
                        item
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                    >
                        <SubTitle title="Ward Name" />

                        <Autocomplete
                            className="w-full"
                            options={this.state.ward}
                            onChange={(e, value) => {
                                if (null != value) {
                                    let formData =
                                        this.state.formData
                                    formData.ward_id =
                                        e.target.value
                                    this.setState({
                                        formData,
                                    })
                                }
                            }}
                            value={this.state.ward.find((ward) => ward.id == this.state.formData.ward_id)}
                            getOptionLabel={(option) =>
                                option.label
                            }
                            renderInput={(params) => (
                                <TextValidator
                                    {...params}
                                    placeholder="Please choose"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state.formData
                                            .ward_id
                                    }
                                />
                            )}
                        />
                    </Grid>
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
                                            Add to Agenda
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

export default AddAgenda