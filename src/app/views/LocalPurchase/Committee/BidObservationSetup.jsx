import React, { Component, Fragment } from 'react'
import {
    CardTitle,
    LoonsCard,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import MainContainer from 'app/components/LoonsLabComponents/MainContainer'
import { LoonsTable, Button, DatePicker, SwasthaFilePicker } from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { CircularProgress, Grid, Divider, InputAdornment, Typography } from '@material-ui/core'
import * as appConst from '../../../../appconst'
import { Autocomplete } from '@material-ui/lab'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import { dateParse } from 'utils'

import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditIcon from '@mui/icons-material/Edit';

class BidObservationSetup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            filterData: {
                limit: 20,
                page: 0,
                bid_value_presentage_from: '',
            },
            columns: [
                {
                    name: 'bid_value', // field name in the row object
                    label: 'Bid Value', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'bid_validity_period', // field name in the row object
                    label: 'Bid Validity Period', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'offer_validity_period', // field name in the row object
                    label: 'Offer Validity Period', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
            ],

            formData: {
                category: null,
                method: null,
                section: null,
                criteria: null,
                patient_name: null,
                phn: null
            }
        }
    }
    render() {
        return (
            <MainContainer>
                <LoonsCard>
                    <CardTitle title="Bid Observation Setup" />
                    <ValidatorForm className="pt-2">
                        <Grid container spacing={2} direction="row" style={{ marginBottom: "24px" }}>
                            {/* Filter Section */}
                            {/* Patient Details*/}
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                            >
                                <Grid container spacing={2}>
                                    {/* Serial Number*/}
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Category" />
                                        <Autocomplete
                                            className="w-full"
                                            value={
                                                this.state.formData
                                                    .category
                                            }
                                            options={appConst.bid_value_presentage_from}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let formData =
                                                        this.state.formData
                                                    formData.category =
                                                        value
                                                    this.setState({ formData })
                                                } else {
                                                    let formData =
                                                        this.state.formData
                                                    formData.category =
                                                        { label: '' }
                                                    this.setState({ formData })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state.formData
                                                            .category
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    {/* Serial Number*/}
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Procurement Method" />
                                        <Autocomplete
                                            className="w-full"
                                            value={
                                                this.state.formData
                                                    .method
                                            }
                                            options={appConst.bid_value_presentage_from}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let formData =
                                                        this.state.formData
                                                    formData.method =
                                                        value
                                                    this.setState({ formData })
                                                } else {
                                                    let formData =
                                                        this.state.formData
                                                    formData.method =
                                                        { label: '' }
                                                    this.setState({ formData })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state.formData
                                                            .method
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    {/* Serial Number*/}
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Section" />
                                        <Autocomplete
                                            className="w-full"
                                            value={
                                                this.state.formData
                                                    .section
                                            }
                                            options={appConst.bid_value_presentage_from}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let formData =
                                                        this.state.formData
                                                    formData.section =
                                                        value
                                                    this.setState({ formData })
                                                } else {
                                                    let formData =
                                                        this.state.formData
                                                    formData.section =
                                                        { label: '' }
                                                    this.setState({ formData })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state.formData
                                                            .section
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    {/* Serial Number*/}
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Criteria" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Criteria"
                                            name="criteria"
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            value={
                                                this.state.formData
                                                    .criteria
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
                                                        criteria:
                                                            e.target
                                                                .value,
                                                    },
                                                })
                                            }}
                                            validators={[
                                                'required'
                                            ]}
                                            errorMessages={[
                                                'this field is required'
                                            ]}
                                        />
                                    </Grid>
                                </Grid>
                                {/* Item Details */}
                            </Grid>
                            {/* Submit and Cancel Button */}
                            <Grid
                                item
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
                                        {/* Submit Button */}
                                        <Button
                                            className="mt-2 mr-2"
                                            progress={false}
                                            type="submit"
                                            scrollToTop={
                                                true
                                            }
                                            startIcon="save"
                                        //onClick={this.handleChange}
                                        >
                                            <span className="capitalize">
                                                Add
                                            </span>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12} style={{ backgroundColor: "#D7B2B2", padding: "8px", borderRadius: "12px" }}>
                                <div style={{ display: "flex" }}>
                                    <div style={{ flex: 1 }}>
                                        <Typography variant="h6" style={{ marginLeft: "12px" }} className="font-semibold">ICB</Typography>
                                    </div>
                                    <div>
                                        <ArrowDropDownIcon />
                                        <EditIcon />
                                    </div>
                                </div>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <SubTitle title='Bidding Information' />
                                <ol style={{ listStyleType: "decimal-leading-zero", fontSize: "16px", lineHeight: 1.5 }}>
                                    <li>Sample Parameter Here  Sample Parameter Here  Sample Parameter Here</li>
                                    <li>Sample Parameter Here  Sample Parameter Here  Sample Parameter Here</li>
                                </ol>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <SubTitle title='Financial Information' />
                                <ol style={{ listStyleType: "decimal-leading-zero", fontSize: "16px" }}>
                                    <li>Sample Parameter Here  Sample Parameter Here  Sample Parameter Here</li>
                                    <li>Sample Parameter Here  Sample Parameter Here  Sample Parameter Here</li>
                                    <li>Sample Parameter Here  Sample Parameter Here  Sample Parameter Here</li>
                                    <li>Sample Parameter Here  Sample Parameter Here  Sample Parameter Here</li>
                                </ol>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12} style={{ backgroundColor: "#D7B2B2", padding: "8px", borderRadius: "12px" }}>
                                <div style={{ display: "flex" }}>
                                    <div style={{ flex: 1 }}>
                                        <Typography variant="h6" style={{ marginLeft: "12px" }} className="font-semibold">NCB</Typography>
                                    </div>
                                    <div>
                                        <ArrowDropDownIcon />
                                        <EditIcon />
                                    </div>
                                </div>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <SubTitle title='Bidding Information' />
                                <ol style={{ listStyleType: "decimal-leading-zero", fontSize: "16px", lineHeight: 1.5 }}>
                                    <li>Sample Parameter Here  Sample Parameter Here  Sample Parameter Here</li>
                                    <li>Sample Parameter Here  Sample Parameter Here  Sample Parameter Here</li>
                                </ol>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <SubTitle title='Financial Information' />
                                <ol style={{ listStyleType: "decimal-leading-zero", fontSize: "16px" }}>
                                    <li>Sample Parameter Here  Sample Parameter Here  Sample Parameter Here</li>
                                    <li>Sample Parameter Here  Sample Parameter Here  Sample Parameter Here</li>
                                    <li>Sample Parameter Here  Sample Parameter Here  Sample Parameter Here</li>
                                    <li>Sample Parameter Here  Sample Parameter Here  Sample Parameter Here</li>
                                </ol>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default BidObservationSetup
