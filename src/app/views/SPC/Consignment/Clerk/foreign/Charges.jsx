import React, { Component, Fragment, useState } from 'react'
import { withStyles, styled } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Dialog,
    Divider,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    CircularProgress,
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    Collapse,
    Checkbox
} from '@material-ui/core'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../../../appconst'
import SearchIcon from '@mui/icons-material/Search';
import { dateParse, roundDecimal } from 'utils'

import LocalPurchaseServices from 'app/services/LocalPurchaseServices'
import HospitalConfigServices from 'app/services/HospitalConfigServices';
import PrescriptionService from 'app/services/PrescriptionService';
import InventoryService from 'app/services/InventoryService';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import BackupTableIcon from '@mui/icons-material/BackupTable';
import localStorageService from 'app/services/localStorageService'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';


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

const AddInputDate = ({ onChange = (date) => date, val = null, text = "Add", tail = null, require = false, disable = true }) => (
    <DatePicker
        className="w-full"
        value={val}
        //label="Date From"
        placeholder={`⊕ ${text}`}
        // minDate={new Date()}
        format='dd/MM/yyyy'
        disabled={disable}
        //maxDate={new Date("2020-10-20")}
        required={require}
        // errorMessages="this field is required"
        onChange={onChange}
    />
)

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
        disabled={disable}
        variant="outlined"
        size="small"
        onChange={onChange}
        validators={require ? [
            'required',
        ] : []}
        errorMessages={require ? [
            'this field is required',
        ] : []}
    />
)

const AddNumberInput = ({ type = 'number', onChange = (e) => e, val = "", text = "Add", tail = null, require = false, disable = true }) => (
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
            require ? ['minNumber:' + 0, 'required:' + true] : ['minNumber: 0']}
        errorMessages={require ? [
            'Value Should be > 0',
            'this field is required'
        ] : ['Value Should be > 0']}
    />
)

const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", text = "Add", tail = null, require = false, disable = true }) => {
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

class ShipmentCharges extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            role: null,

            itemList: [],
            // single_data:{},

            collapseButton: 0,
            userRoles: [],

            alert: false,
            message: '',
            severity: 'success',

            // loading: false,
            // single_loading: false,
            filterData: {
                // order_amount: null,
                // currency_type: null,
                // currency_rate: null,
                // cid: null,
                // pal: null,
                // sscl: null,
                // cess: null,
                // sc: null,
                // vat: null,
                // scl: null,
                // com: null,
                // exm: null,
                // otc: null,
                // sel: null,
                // other: null,

                // transport: null,
                // storage: null,
                // detention: null,
                // type: null,
                // tax: null,
                // sub_total: null,
                // shipping_line_damage: null,
                // total: null
            },

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                // item_id: this.props.match.params.item_id
            },

            currency_types: [
                { label: "LKR" },
                { label: "INR" },
                { label: "USD" },
            ]
        }

    }

    loadData = async () => {
        //function for load initial data from backend or other resources
        this.setState({ loading: false });
        // let formData = this.state.filterData;
        const { sr_no, item_name, ...formData } = this.state.filterData

        let res = await LocalPurchaseServices.getLPRequest({ ...formData, status: ['APPROVED'] })

        if (res.status === 200) {
            console.log('LP Data: ', res.data.view.data);
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems })
        }

        this.setState({ loading: true })
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.filterData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New Form Data: ", this.state.formData)
            this.loadData()
        })
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

    componentDidMount() {
        const { data } = this.props
        this.setState({ filterData: data })
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
                                                <SubTitle title="Order Amount (Rs.)" />
                                                <AddNumberInput onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            order_amount: roundDecimal(parseFloat(e.target
                                                                .value), 2),
                                                        },
                                                    })
                                                }} val={this.state.filterData?.order_amount ? roundDecimal(this.state.filterData?.order_amount, 2) : 0} text='Enter Order Amount' type='number' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Currency Type" />
                                                <AddInput
                                                    options={appConst.all_currencies}
                                                    val={this.state.filterData?.currency_type ? this.state.filterData?.currency_type : ''}
                                                    getOptionLabel={(option) => option.cc || ''}
                                                    text='Currency Type'
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let updatedFilterData = {
                                                                ...this.state.filterData,
                                                                currency_type: value?.cc,
                                                            };
                                                            // Update the state with the modified filterData object
                                                            this.setState({
                                                                filterData: updatedFilterData,
                                                            });
                                                        }
                                                    }}
                                                />
                                                {/* <Autocomplete
                                                    // disableClearable
                                                    className="w-full"
                                                    options={appConst.all_currencies}
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let updatedFilterData = {
                                                                ...this.state.filterData,
                                                                currency_type: value?.cc,
                                                            };
                                                            // Update the state with the modified filterData object
                                                            this.setState({
                                                                filterData: updatedFilterData,
                                                            });
                                                        }
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.cc
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Please choose"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={this.state.filterData?.currency_type ? this.state.filterData?.currency_type : ''
                                                            }
                                                            required
                                                        />
                                                    )}
                                                /> */}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Enter Currency Rate" />
                                                <AddNumberInput onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            currency_rate: roundDecimal(parseFloat(e.target
                                                                .value), 2),
                                                        },
                                                    })
                                                }} val={this.state.filterData?.currency_rate ? this.state.filterData?.currency_rate : 0} text='Enter Currency Rate' type='number' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Total (LKR)" />
                                                <AddNumberInput
                                                    disable={true}
                                                    require={false}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            total: roundDecimal(parseFloat(e.target.value), 2),
                                                        })
                                                    }} val={parseFloat(this.state.filterData?.currency_rate ?? 1) * parseFloat(this.state.filterData?.order_amount ?? 0)} text='Enter Currency Rate' type='number' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Divider className='mt-2 mb-2' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Grid container spacing={2} direction='row'>
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="CID" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            cid:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.cid : 0} text='Enter CID' type='number' />
                                                    </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="PAL" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            pal:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.pal : 0} text='Enter PAL' type='number' />
                                                    </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="SSL" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            ssl:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.ssl : 0} text='Enter SSL' type='number' />
                                                    </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="CESS" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            cess:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.cess : 0} text='Enter CESS' type='number' />
                                                    </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="SC" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            sc:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.sc : 0} text='Enter SC' type='number' />
                                                    </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="VAT" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            vat:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.vat : 0} text='Enter SC' type='number' />
                                                    </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="SCL" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            scl:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.scl : 0} text='Enter SCL' type='number' />
                                                    </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="COM" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            com:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.com : 0} text='Enter COM' type='number' />
                                                    </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="EXM" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            exm:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.exm : 0} text='Enter EXM' type='number' />
                                                    </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="OTC" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            otc:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.otc : 0} text='Enter OTC' type='number' />
                                                    </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="SEL" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            sel:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.sel : 0} text='Enter SCL' type='number' />
                                                    </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="OTHER" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            other:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.other : 0} text='Enter Other' type='number' />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            {/* <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={6}
                                                xs={6}
                                            >
                                                <Grid container spacing={2}>
                                                    <Grid item lg={12} md={12} sm={12} xs={12} style={{ paddingTop: "30px", paddingBottom: "8px" }}>
                                                        <CardTitle title="Re Delivery Charges" />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                                        <SubTitle title="Transport" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            transport:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.transport : 0} text='Enter Transport' type='number' />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                                        <SubTitle title="Storage" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            storage:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.storage : 0} text='Enter Storage' type='number' />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                                        <SubTitle title="Detention" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            detention:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.detention : 0} text='Enter Detention' type='number' />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                                        <SubTitle title="Demounting/Mounting" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            type:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.type : 0} text='Enter Type' type='number' />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                                        <SubTitle title="Tax" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            tax:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.tax : 0} text='Enter Tax' type='number' />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                                        <SubTitle title="Sub Total" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            sub_total:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.sub_total : 0} text='Enter Sub Total' type='number' />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                                        <SubTitle title="Shipping Line Damage" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            shipping_line_damage:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData?.charges?.[0]?.shipping_line_damage : 0} text='Enter Shipping Line Damage' type='number' />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                                        <SubTitle title="Total" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    total: roundDecimal(parseFloat(e.target
                                                                        .value), 2),
                                                                },
                                                            })
                                                        }} val={0} text='Enter Total' type='number' />
                                                    </Grid>
                                                </Grid>
                                            </Grid> */}
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

export default withStyles(styleSheet)(ShipmentCharges)
