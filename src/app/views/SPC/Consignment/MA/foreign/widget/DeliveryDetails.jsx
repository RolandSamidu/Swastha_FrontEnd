import React, { Component, Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    Button,
    LoonsSnackbar,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import { roundDecimal, dateTimeParse } from 'utils'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import MomentUtils from '@date-io/moment'
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import EmployeeServices from 'app/services/EmployeeServices'


const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
})

const AddTextInput = ({ type = 'text', onChange = (e) => e, val = "", text = "Add", tail = null, disable = true, require = false }) => (
    <TextValidator
        className=" w-full"
        placeholder={`⊕ ${text}`}
        // name="sr_no"
        InputLabelProps={{
            shrink: false,
        }}
        value={val}
        type="text"
        variant="outlined"
        size="small"
        disabled={disable}
        onChange={onChange}
        validators={require ? [
            'required',
        ] : []}
        errorMessages={require ? [
            'this field is required',
        ] : []}
    />
)

const AddNumberInput = ({ type = 'number', onChange = (e) => e, val = "", text = "Add", tail = null, disable = true, require = false }) => (
    <TextValidator
        className=" w-full"
        placeholder={`⊕ ${text}`}
        // name="issued_amount"
        InputLabelProps={{
            shrink: false,
        }}
        disabled={disable}
        value={val ? String(val) : String(0)}
        type="number"
        variant="outlined"
        size="small"
        min={0}
        onChange={onChange}
        validators={
            require ? ['minNumber:' + 0, 'required:' + true] : ['minNumber:' + 0]}
        errorMessages={require ? [
            'Value Should be > 0',
            'this field is required'
        ] : ['Value Should be > 0']}
    />
)

const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", text = "Add", tail = null, disable = true, require = false }) => {
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => {
        setIsFocused(true);
    };
    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <Autocomplete
            disableClearable
            onFocus={handleFocus}
            onBlur={handleBlur}
            options={options}
            getOptionLabel={getOptionLabel}
            // id="disable-clearable"
            disabled={disable}
            onChange={onChange}
            value={val}
            size='small'
            renderInput={(params) => (
                < div ref={params.InputProps.ref} style={{ display: 'flex', position: 'relative' }}>
                    <input type="text" {...params.inputProps}
                        style={{ marginTop: '5.5px', padding: '6.5px 10px', border: '1px solid #e5e7eb', borderRadius: 4 }}
                        placeholder={`⊕ ${text}`}
                        onChange={onChange}
                        value={val}
                        required={require}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '7.5px',
                            right: 8,
                        }}
                        onClick={null}
                    >
                        {isFocused ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </div>
                </div >
            )}
        />);
}

class DeliveryDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: '',
            severity: 'success',

            filterData: {},
            userName: null,
            isEdit: false,
        }

    }

    onSubmit = async () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleNext();
    }

    onBack = () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleBack();
    };

    async getUser(id) {
        if (id) {
            let user_res = await EmployeeServices.getEmployeeByID(id)
            if (user_res.status == 200) {
                this.setState({ userName: user_res?.data?.view?.name })
            }
        }
    }

    componentDidMount() {
        const { data } = this.props
        if (data) {
            this.setState({ filterData: data }, () => {
                if (this.state.filterData?.delivery_details[0]?.warf_clerk_id) {
                    this.getUser(this.state.filterData?.delivery_details[0]?.warf_clerk_id);
                }
            });
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <div className="pb-8 pt-2">
                    {/* Filtr Section */}
                    <ValidatorForm
                        className="pt-2"
                        onSubmit={this.onSubmit}
                        onError={() => null}
                    >
                        {/* Main Grid */}
                        <Grid container spacing={2} direction="row">
                            {/* Filter Section */}
                            <Grid item xs={12} className='mb-5' sm={12} md={12} lg={12}>
                                {/* Item Series Definition */}
                                <Grid container spacing={2}>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Wharf Clerk Name" />
                                                <AddTextInput
                                                    require={false}
                                                    disable={true}
                                                    val={this.state.userName || ''}
                                                    text='Wharf Clerk Name'
                                                    onChange={(event, value) => null}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            ></Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Delivery Point" />
                                                <AddTextInput disable={!this.state.isEdit} require={this.state.isEdit} onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            delivery_details: [
                                                                {
                                                                    ...this.state.filterData.delivery_details[0],
                                                                    delivery_point:
                                                                        e.target
                                                                            .value,
                                                                }]
                                                        },
                                                    })
                                                }} val={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details[0].delivery_point : ""} text='Enter Delivery Point' type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Store Number" />
                                                <AddTextInput disable={!this.state.isEdit} require={this.state.isEdit} onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            delivery_details: [
                                                                {
                                                                    ...this.state.filterData.delivery_details[0],
                                                                    store_no:
                                                                        e.target
                                                                            .value,
                                                                }]
                                                        },
                                                    })
                                                }} val={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details[0].store_no : ""} text='Enter Stores Number' type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Condition of the Goods" />
                                                <AddTextInput disable={!this.state.isEdit} require={this.state.isEdit} onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            delivery_details: [
                                                                {
                                                                    ...this.state.filterData.delivery_details[0],
                                                                    goods_condition:
                                                                        e.target
                                                                            .value,
                                                                }]
                                                        },
                                                    })
                                                }} val={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details[0].goods_condition : ""} text='Enter Good Condition' type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Delivery Date & Time" />
                                                <MuiPickersUtilsProvider
                                                    utils={MomentUtils}
                                                    className="w-full"
                                                >
                                                    <KeyboardDateTimePicker
                                                        className="w-full"
                                                        inputVariant="outlined"
                                                        clearable
                                                        value={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details?.[0].delivery_date : null}
                                                        placeholder='Enter Delivery Date & Time'
                                                        // minDate={new Date()}
                                                        autoOk={true}
                                                        size='small'
                                                        onChange={(date) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    delivery_details: [
                                                                        {
                                                                            ...this.state.filterData.delivery_details[0],
                                                                            delivery_date: dateTimeParse(date)
                                                                        }]
                                                                },
                                                            })
                                                        }}
                                                        disabled={!this.state.isEdit} required={this.state.isEdit}
                                                    />
                                                </MuiPickersUtilsProvider>
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={3}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Type of Delivery" />
                                                <FormControl component="fieldset">
                                                    <RadioGroup
                                                        name="category"
                                                        value={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details[0].type : ""}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    delivery_details: [
                                                                        {
                                                                            ...this.state.filterData.delivery_details[0],
                                                                            type:
                                                                                e.target
                                                                                    .value,
                                                                        }]
                                                                },
                                                            })
                                                        }
                                                        }
                                                        style={{ display: 'block' }}
                                                    >
                                                        <FormControlLabel
                                                            disabled={!this.state.isEdit}
                                                            value="LCL"
                                                            control={<Radio />}
                                                            label="LCL"
                                                        />
                                                        <FormControlLabel
                                                            disabled={!this.state.isEdit}
                                                            value="FCL"
                                                            control={<Radio />}
                                                            label="FCL"
                                                        />
                                                        <FormControlLabel
                                                            disabled={!this.state.isEdit}
                                                            value="Airport"
                                                            control={<Radio />}
                                                            label="Airport"
                                                        />
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Port Warehouse" />
                                                <AddTextInput
                                                    disable={!this.state.isEdit}
                                                    require={this.state.isEdit}
                                                    val={this.state.filterData?.delivery_details?.[0]?.Warehouse?.name}
                                                    getOptionLabel={(option) => option.name || ""}
                                                    text='Port Warehouse'
                                                    onChange={(e) => null}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Storage Condition" />
                                                <AddTextInput disable={!this.state.isEdit} require={this.state.isEdit} onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            delivery_details: [
                                                                {
                                                                    ...this.state.filterData.delivery_details[0],
                                                                    storage_conditions:
                                                                        e.target
                                                                            .value,
                                                                }]
                                                        },
                                                    })
                                                }} val={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details[0].storage_conditions : ""} text='Enter Storage Condition' type='text' />
                                            </Grid>
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <SubTitle title="No of Packages" />
                                                <AddNumberInput disable={!this.state.isEdit} require={this.state.isEdit} onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            delivery_details: [
                                                                {
                                                                    ...this.state.filterData.delivery_details[0],
                                                                    no_of_packages:
                                                                        roundDecimal(parseFloat(e.target
                                                                            .value), 2),
                                                                }]
                                                        },
                                                    })
                                                }} val={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details[0].no_of_packages : 0} text="Enter No of Packages" type='number' />
                                            </Grid>
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <SubTitle title="Volume" />
                                                <AddNumberInput disable={!this.state.isEdit} require={this.state.isEdit} onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            delivery_details: [
                                                                {
                                                                    ...this.state.filterData.delivery_details[0],
                                                                    volume:
                                                                        roundDecimal(parseFloat(e.target
                                                                            .value), 2),
                                                                }]
                                                        },
                                                    })
                                                }} val={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details[0].volume : 0} text="Enter Volume" type='number' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
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
                                                    disabled={!this.state.isEdit}
                                                    value={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details?.[0].remark : ""}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                delivery_details: [
                                                                    {
                                                                        ...this.state.filterData.delivery_details[0],
                                                                        remark:
                                                                            e.target
                                                                                .value,
                                                                    }]
                                                            },
                                                        })
                                                    }}
                                                    validators={this.state.isEdit ? [
                                                        'required',
                                                    ] : []}
                                                    errorMessages={this.state.isEdit ? [
                                                        'this field is required',
                                                    ] : []}
                                                />
                                            </Grid>
                                            <Grid
                                                className='mt-5'
                                                style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
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
                                                            className="mr-2 py-2 px-4"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            startIcon="chevron_left"
                                                            style={{ borderRadius: "10px" }}
                                                            onClick={this.onBack}
                                                        >
                                                            <span className="capitalize">
                                                                Previous
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            className="mr-2 py-2 px-4"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            startIcon="close"
                                                            style={{ backgroundColor: "white", color: "black", border: "1px solid #3B71CA", borderRadius: "10px" }}
                                                            onClick={this.props.handleClose}
                                                        >
                                                            <span className="capitalize">
                                                                Cancel
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            style={{ borderRadius: "10px" }}
                                                            className="py-2 px-4"
                                                            progress={false}
                                                            type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            endIcon="chevron_right"
                                                        // onClick={this.props.handleNext}
                                                        >
                                                            <span className="capitalize">
                                                                Next
                                                            </span>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </div>
                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={1200}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(DeliveryDetails)
