import React, { Component, Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Divider,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    SubTitle,
} from 'app/components/LoonsLabComponents'

import HospitalConfigServices from 'app/services/HospitalConfigServices';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

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

const AddInputDate = ({ onChange = (date) => date, val = null, text = "Add", tail = null, disable = true, require = false }) => (
    <DatePicker
        disabled={disable}
        className="w-full"
        value={val}
        //label="Date From"
        placeholder={`⊕ ${text}`}
        // minDate={new Date()}
        format='dd/MM/yyyy'
        //maxDate={new Date("2020-10-20")}
        required={require}
        errorMessages="This field is required"
        onChange={onChange}
    />
)

const AddTextInput = ({ type = 'text', onChange = (e) => e, val = "", text = "Add", tail = null, disable = true, require = false }) => (
    <TextValidator
        disabled={disable}
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
        onChange={onChange}
        validators={require ? [
            'required',
        ] : []}
        errorMessages={require ? [
            'This field is required',
        ] : []}
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
            // disableClearable
            disabled={disable}
            onFocus={handleFocus}
            onBlur={handleBlur}
            options={options}
            getOptionLabel={getOptionLabel}
            // id="disable-clearable"
            onChange={onChange}
            value={val}
            size='small'
            renderInput={(params) => (
                <div ref={params.InputProps.ref} style={{ display: 'flex', position: 'relative' }}>
                    <input type="text" {...params.inputProps}
                        style={{ marginTop: '5px', padding: '6.2px 10px', border: '1px solid #e5e7eb', borderRadius: 4 }}
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

class ShippingDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,

            alert: false,
            message: '',
            severity: 'success',
            filterData: {},
        }
    }

    onSubmit = () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleNext();
    };

    async componentDidMount() {
        const { data } = this.props
        this.setState({ filterData: data })
    }

    componentDidUpdate(prevProps, prevState) {
        const { data } = this.props
        if (prevState.filterData !== this.state.filterData) {
            this.setState({ filterData: data })
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
                                                lg={3}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Shipment No" />
                                                <AddTextInput onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            wharf_no:
                                                                e.target
                                                                    .value,
                                                        },
                                                    })
                                                }} require={false} disable={true} val={this.state.filterData.wharf_no} text='Shipment No: IM/XXXXX/2023' type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={3}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="WDN Number" />
                                                <AddTextInput onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            wdn_no:
                                                                e.target
                                                                    .value,
                                                        },
                                                    })
                                                }} require={false} disable={true} val={this.state.filterData.wdn_no} text='WDN Number: IMXXXXX/2023' type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={3}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="WDN Date" />
                                                <AddInputDate onChange={(date) => {
                                                    let filterData =
                                                        this.state.filterData
                                                    filterData.wdn_date = date
                                                    this.setState({ filterData })
                                                }} val={this.state.filterData.wdn_date} text='Enter WDN Date' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={3}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Indent No" />
                                                <AddTextInput onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            indent_no:
                                                                e.target
                                                                    .value,
                                                        },
                                                    })
                                                }} val={this.state.filterData.indent_no} text='Enter Indent No' type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={3}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Supplier" />
                                                <AddTextInput
                                                    require={false}
                                                    disable={true}
                                                    val={this.state.filterData?.Supplier?.name}
                                                    text='Enter Supplier'
                                                    onChange={(event, value) => null}
                                                />
                                                {/* <Autocomplete
                                                    // disableClearable
                                                    className="w-full"
                                                    options={this.state.all_Suppliers}
                                                    getOptionLabel={(option) => option.name}
                                                    value={this.state.all_Suppliers.find((v) => v.id === this.state.filterData.supplier_id)}
                                                    onChange={(event, value) => {
                                                        let formData = this.state.filterData
                                                        if (value != null) {
                                                            formData.supplier_id = value.id
                                                        } else {
                                                            formData.supplier_id = null
                                                        }
                                                        this.setState({ filterData: formData })
                                                    }

                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Supplier"
                                                            //variant="outlined"
                                                            //value={}
                                                            onChange={(e) => {
                                                                if (e.target.value.length > 2) {
                                                                    this.loadAllSuppliers(e.target.value)
                                                                }
                                                            }}
                                                            value={this.state.all_Suppliers.find((v) => v.id === this.state.filterData.supplier_id)}
                                                            fullWidth
                                                            // InputLabelProps={{
                                                            //     shrink: true,
                                                            // }}
                                                            variant="outlined"
                                                            size="small"
                                                            validators={['required']}
                                                            errorMessages={['this field is required']}
                                                        />
                                                    )}
                                                /> */}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Divider className='mt-4 mb-4' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="WHARF Ref No" />
                                                <AddTextInput onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            shipment_no:
                                                                e.target
                                                                    .value,
                                                        },
                                                    })
                                                }} val={this.state.filterData.shipment_no} text='Enter WHARF Ref No' type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Invoice Number" />
                                                <AddTextInput onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            invoice_no:
                                                                e.target
                                                                    .value,
                                                        },
                                                    })
                                                }} val={this.state.filterData.invoice_no} text='Enter Invoice No' type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Invoice Date" />
                                                <AddInputDate onChange={(date) => {
                                                    let filterData =
                                                        this.state.filterData
                                                    filterData.invoice_date = date
                                                    this.setState({ filterData })
                                                }} val={this.state.filterData.invoice_date} text='Enter Invoice Date' />
                                            </Grid>
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={4}
                                                        md={4}
                                                        sm={6}
                                                        xs={6}
                                                    >
                                                        <SubTitle title="LC Number" />
                                                        <AddTextInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    lc_no:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }} val={this.state.filterData.lc_no} text='Enter LC Number' type='text' />
                                                    </Grid>
                                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                                        <SubTitle title="WDN Recieved" />
                                                        <AddInput
                                                            require={false}
                                                            disable={true}
                                                            options={[{ name: "YES" }, { name: "NO" }]}
                                                            val={this.state.filterData.wdn_recieved}
                                                            getOptionLabel={(option) => option.name || ""}
                                                            text='WDN Recieved: N/A'
                                                            onChange={(e, value) => {
                                                                const newFormData = {
                                                                    ...this.state.filterData,
                                                                    wdn_recieved: e.target.textContent ? e.target.textContent : e.target.value,
                                                                    // wdn_recieved_id: value ? value.id : null,
                                                                };

                                                                this.setState({ filterData: newFormData });
                                                            }
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                                        <SubTitle title="Recieved Date" />
                                                        <AddInputDate onChange={(date) => {
                                                            let filterData =
                                                                this.state.filterData
                                                            filterData.received_date = date
                                                            this.setState({ filterData })
                                                        }} disable={true} require={false} val={this.state.filterData.received_date} text='Received Date: N/A' />
                                                    </Grid>
                                                    {/* Removed As Requested By BA */}
                                                    {/* <Grid item lg={8} md={8} sm={6} xs={12} style={{ border: "1px solid black" }}>
                                                        <Grid container spacing={2} style={{ backgroundColor: "#FFB6C1" }} className='mb-5'>
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={4}
                                                                md={4}
                                                                sm={4}
                                                                xs={4}
                                                            >
                                                                <SubTitle title="WDN Number" />
                                                                <TextValidator
                                                                    className=" w-full"
                                                                    placeholder="Enter WDN Number"
                                                                    name="wdn_no"
                                                                    InputLabelProps={{
                                                                        shrink: false,
                                                                    }}
                                                                    value={
                                                                        this.state.filterData
                                                                            .wdn_table_no
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
                                                                                wdn_table_no:
                                                                                    e.target
                                                                                        .value,
                                                                            },
                                                                        })
                                                                    }}
                                                                    InputProps={{
                                                                        endAdornment: (
                                                                            <InputAdornment position="end">
                                                                                <IconButton onClick={() => { }}>
                                                                                    <SearchIcon />
                                                                                </IconButton>
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                // validators={[
                                                                //     'required',
                                                                // ]}
                                                                // errorMessages={[
                                                                //     'this field is required',
                                                                // ]}
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={4}
                                                                md={4}
                                                                sm={4}
                                                                xs={4}
                                                            >
                                                                <SubTitle title="Enter Shipment Number" />
                                                                <AddTextInput onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            shipment_table_no:
                                                                                e.target
                                                                                    .value,
                                                                        },
                                                                    })
                                                                }} val={this.state.filterData.shipment_table_no} text='Enter Shipment No' type='text' />
                                                            </Grid>
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={4}
                                                                md={4}
                                                                sm={4}
                                                                xs={4}
                                                            >
                                                                <SubTitle title="Enter Wharf Ref No." />
                                                                <AddTextInput onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            wharf_table_no:
                                                                                e.target
                                                                                    .value,
                                                                        },
                                                                    })
                                                                }} val={this.state.filterData.wharf_table_no} text='Enter Wharf Ref Number' type='text' />
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={2}>
                                                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                                                <SubTitle title="WDN Recieved" />
                                                                <AddInput
                                                                    options={[{ name: "YES" }, { name: "NO" }]}
                                                                    val={this.state.filterData.wdn_recieved}
                                                                    getOptionLabel={(option) => option.name || ""}
                                                                    text='Enter WDN Recieved'
                                                                    onChange={(e, value) => {
                                                                        const newFormData = {
                                                                            ...this.state.filterData,
                                                                            wdn_recieved: e.target.textContent ? e.target.textContent : e.target.value,
                                                                            // wdn_recieved_id: value ? value.id : null,
                                                                        };

                                                                        this.setState({ filterData: newFormData });
                                                                    }
                                                                    }
                                                                />
                                                            </Grid>
                                                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                                                <SubTitle title="Recieved Date" />
                                                                <AddInputDate onChange={(date) => {
                                                                    let filterData =
                                                                        this.state.filterData
                                                                    filterData.received_date = date
                                                                    this.setState({ filterData })
                                                                }} val={this.state.filterData.received_date} text='Enter Received Date' />
                                                            </Grid>
                                                        </Grid>
                                                    </Grid> */}
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Divider className='mt-2' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Subject Clerk Remark" />
                                                <TextValidator
                                                    multiline
                                                    rows={4}
                                                    disabled
                                                    className=" w-full"
                                                    placeholder="Subject Clerk Remarks"
                                                    name="description"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={this.state.filterData.remark ? this.state.filterData.remark : ""}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                remark: e.target.value,
                                                            },
                                                        })
                                                    }}
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                // errorMessages={[
                                                //     'this field is required',
                                                // ]}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Supervisor Remark" />
                                                <TextValidator
                                                    multiline
                                                    rows={4}
                                                    disabled
                                                    className=" w-full"
                                                    placeholder="Supervisor Remarks"
                                                    name="description"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={this.state.filterData?.supervisor_remark ? this.state.filterData.supervisor_remark : ""}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                sup_remark: e.target.value,
                                                            },
                                                        })
                                                    }}
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                // errorMessages={[
                                                //     'this field is required',
                                                // ]}
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
                                            {/* Submit and Cancel Button */}
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

export default withStyles(styleSheet)(ShippingDetails)
