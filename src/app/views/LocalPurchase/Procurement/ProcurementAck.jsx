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
    Badge,
    CircularProgress,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    Typography,
    Chip,
    Box,
} from '@material-ui/core'
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
import * as appConst from '../../../../appconst'
import { dateTimeParse } from 'utils'
import VisibilityIcon from '@material-ui/icons/Visibility'
import ConsignmentService from 'app/services/ConsignmentService'
import DistributionCenterServices from 'app/services/DistributionCenterServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from 'app/services/WarehouseServices'
import { element } from 'prop-types'
import { dateParse } from 'utils'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import { Divider } from '@mui/material'

class ProcurementAck extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            filterData: {
                supervisor_description: null,
                officer_description: null,
            },

            data: [
                {
                    sr_no: "S1001",
                    item_name: "Panadol",
                    required_date: dateParse(new Date()),
                    requested_quantity: "100",
                    estimated_value: "120"
                },
                {
                    sr_no: "S1002",
                    item_name: "Panadol",
                    required_date: dateParse(new Date()),
                    requested_quantity: "100",
                    estimated_value: "150"
                },
                {
                    sr_no: "S1003",
                    item_name: "Panadol",
                    required_date: dateParse(new Date()),
                    requested_quantity: "100",
                    estimated_value: "180"
                },
                {
                    sr_no: "S1004",
                    item_name: "Panadol",
                    required_date: dateParse(new Date()),
                    requested_quantity: "100",
                    estimated_value: "200"
                }
            ],
            columns: [
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'required_date',
                    label: 'Required Date',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'requested_quantity',
                    label: 'Requested Quantity',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'estimated_value',
                    label: 'Estimated Value',
                    options: {
                        // filter: true,
                    },
                },
            ],
        }
    }

    render() {
        return (
            <MainContainer>
                <ValidatorForm>
                    <LoonsCard>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'left',
                                justifyContent: 'space-between',
                                marginTop: '15px',
                            }}
                        >
                            <CardTitle
                                title={'Procurement Ref No: 1245/S/2022'}
                            />
                            <div>
                                <Grid item lg={12} md={4} sm={6} xs={12}>
                                    <label style={{ marginTop: '30px' }}>
                                        Order List No:2022/SPC/X/R/P/0306
                                    </label>
                                </Grid>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'left',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Grid item lg={12} md={4} sm={6} xs={12} style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", alignItems: "center" }}>
                                        <label>Authority Level:</label>
                                        <Chip label="DPC-Minor" style={{ background: "#B90481", width: "fit-content" }} />
                                    </Grid>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginLeft: "24px", marginRight: "24px" }}>
                            <LoonsTable
                                id={'completed'}
                                style={{ border: "1px solid #000" }}
                                data={this.state.data}
                                columns={this.state.columns}
                            >
                            </LoonsTable>
                        </div>
                        <div style={{ textAlign: "end", marginTop: "12px" }}>
                            <Typography variant='h6' className='semi-bold'>
                                Total Procurement Value : LKR 333.33M
                            </Typography>
                        </div>
                        <Divider sx={{ mt: 4 }} />
                        <div
                            style={{
                                marginTop: '45px',
                                marginBottom: '45px'
                            }}
                        >
                            <Grid container spacing={2} className="flex ">
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={8}
                                    md={8}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Supervisor - Check" />
                                    <Grid container spacing={2} style={{ marginTop: "8px" }}>
                                        <Grid item lg={2} md={2} sm={2} xs={2}>
                                            <Typography variant='body1'>Note :</Typography>
                                        </Grid>
                                        <Grid item lg={10} md={10} sm={10} xs={10}>
                                            <TextValidator
                                                multiline
                                                rows={4}
                                                className=" w-full"
                                                placeholder="Description"
                                                name="description"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.filterData
                                                        .supervisor_description
                                                }
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            supervisor_description:
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
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                    lg={4}
                                    md={4}
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
                                                style={{ backgroundColor: '#18820D' }}
                                                scrollToTop={
                                                    true
                                                }
                                            //onClick={this.handleChange}
                                            >
                                                <span className="capitalize">
                                                    Suggestion
                                                </span>
                                            </Button>
                                            <Button
                                                className="mt-2"
                                                progress={false}
                                                // type="submit"
                                                // style={{ backgroundColor: "#e0e0e0", color: "black" }}
                                                scrollToTop={
                                                    true
                                                }
                                            // startIcon="save"
                                            //onClick={this.handleChange}
                                            >
                                                <span className="capitalize">
                                                    Approve
                                                </span>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'left',
                                        justifyContent: 'space-between',
                                        marginTop: '29px',
                                    }}
                                >
                                    <Grid item lg={12} md={4} sm={6} xs={12}>
                                        <LoonsButton className="w-full">
                                            Suggestion
                                        </LoonsButton>
                                    </Grid>
                                </div> */}
                                {/* <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'left',
                                        justifyContent: 'space-between',
                                        marginTop: '29px',
                                        marginLeft: '5px',
                                    }}
                                >
                                    <Grid item lg={12} md={4} sm={6} xs={12}>
                                        <LoonsButton
                                            className="w-full"
                                            color="error"
                                        >
                                            Forward
                                        </LoonsButton>
                                    </Grid>
                                </div> */}
                            </Grid>
                            <div
                                style={{
                                    marginTop: '25px',
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={8}
                                        md={8}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Procurement Officer - Approval" />
                                        <Grid container spacing={2} style={{ marginTop: "8px" }}>
                                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                                <Typography variant='body1'>Note :</Typography>
                                            </Grid>
                                            <Grid item lg={10} md={10} sm={10} xs={10}>
                                                <TextValidator
                                                    multiline
                                                    floatingLabelText={'Note: '}
                                                    rows={4}
                                                    className=" w-full"
                                                    placeholder="Description"
                                                    name="description"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.filterData
                                                            .officer_description
                                                    }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                officer_description:
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
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                        lg={4}
                                        md={4}
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
                                                    style={{ backgroundColor: "#18820D" }}
                                                    scrollToTop={
                                                        true
                                                    }
                                                //onClick={this.handleChange}
                                                >
                                                    <span className="capitalize">
                                                        Suggestion
                                                    </span>
                                                </Button>
                                                <Button
                                                    className="mt-2"
                                                    progress={false}
                                                    // type="submit"
                                                    scrollToTop={
                                                        true
                                                    }
                                                // startIcon="save"
                                                //onClick={this.handleChange}
                                                >
                                                    <span className="capitalize">
                                                        Approve
                                                    </span>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {/* <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'left',
                                            justifyContent: 'space-between',
                                            marginTop: '29px',
                                        }}
                                    >
                                        <Grid
                                            item
                                            lg={12}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <LoonsButton className="w-full">
                                                Suggestion
                                            </LoonsButton>
                                        </Grid>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'left',
                                            justifyContent: 'space-between',
                                            marginTop: '29px',
                                            marginLeft: '5px',
                                        }}
                                    >
                                        <Grid
                                            item
                                            lg={12}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <LoonsButton
                                                className="w-full"
                                                color="error"
                                            >
                                                Forward
                                            </LoonsButton>
                                        </Grid>
                                    </div> */}
                                </Grid>
                            </div>
                            {/* <div
                                style={{
                                    marginTop: '25px',
                                    display: 'flex',
                                    alignItems: 'left',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <container
                                    container
                                    spacing={1}
                                    className="flex "
                                >
                                    <h6>Manage Imports - Approval </h6>

                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <label>Note :</label>

                                        <TextValidator
                                            className=" w-full"
                                            value={this.state.textAreaValue}
                                            rows={20}
                                            name="excess"
                                            InputLabelProps={{ shrink: false }}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'left',
                                            justifyContent: 'space-between',
                                            marginTop: '29px',
                                        }}
                                    >
                                        <Grid
                                            item
                                            lg={12}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <LoonsButton className="w-full">
                                                Suggestion
                                            </LoonsButton>
                                        </Grid>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'left',
                                            justifyContent: 'space-between',
                                            marginTop: '29px',
                                            marginLeft: '5px',
                                        }}
                                    >
                                        <Grid
                                            item
                                            lg={12}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <LoonsButton
                                                className="w-full"
                                                color="error"
                                            >
                                                Forward
                                            </LoonsButton>
                                        </Grid>
                                    </div>
                                </container>
                            </div> */}
                        </div>
                    </LoonsCard>
                </ValidatorForm>
            </MainContainer>
        )
    }
}

export default ProcurementAck
