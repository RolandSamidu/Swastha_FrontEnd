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
import { dateParse } from 'utils'

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

const AddInputDate = ({ onChange = (date) => date, val = null, text = "Add", tail = null, disable = false, require = false }) => (
    <DatePicker
        className="w-full"
        value={val}
        //label="Date From"
        disabled={disable}
        placeholder={`⊕ ${text}`}
        // minDate={new Date()}
        format='dd/MM/yyyy'
        //maxDate={new Date("2020-10-20")}
        required={require}
        // errorMessages="this field is required"
        onChange={onChange}
    />
)

const AddTextInput = ({ type = 'text', onChange = (e) => e, val = "", text = "Add", tail = null, disable = false, require = false }) => (
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

const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", text = "Add", tail = null, disable = false, require = false }) => {
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
            role: null,

            itemList: [],
            // single_data:{},

            collapseButton: 0,
            userRoles: [],

            alert: false,
            message: '',
            severity: 'success',

            all_Suppliers: [],

            // loading: false,
            // single_loading: false,
            filterData: {},

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                // item_id: this.props.match.params.item_id
            },
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

    async loadAllSuppliers(search) {
        let params = { search: search }

        let res = await HospitalConfigServices.getAllSuppliers(params)
        if (res.status) {
            console.log("all Suppliers", res.data.view.data)
            this.setState({
                all_Suppliers: res.data.view.data,

            })
        }

    }

    onSubmit = () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleNext()
    };

    async loadSupplierByID(id) {
        let res = await HospitalConfigServices.getAllSupplierByID(id)
        if (res.status) {
            // console.log("all Suppliers", res.data.view)
            this.setState({
                all_Suppliers: [res.data.view],
            }, () => {
                console.log("Supplier: ", this.state.all_Suppliers)
            })
        }
    }

    componentDidMount() {
        const { data } = this.props;
        this.setState({ filterData: data }, () => {
            if (this.state.filterData.supplier_id) {
                this.loadSupplierByID(this.state.filterData.supplier_id)
            }
        })
    }

    getSupplierNameFromID = (supplierID) => {
        if (!this.state.all_Suppliers || !supplierID) {
            return ""; // or render a loading indicator, an error message, etc.
        }
        const foundPort = this.state.all_Suppliers.find((v) => v.id === supplierID);
        return foundPort ? foundPort.name : "";
    };

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
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Shipment No" />
                                                <AddTextInput onChange={(e) => null} disable={true} val={this.state.filterData.ldcn_ref_no} text='Shipment No: LC/XXXXX/2023' type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="LDCN Number" />
                                                <AddTextInput onChange={(e) => null} disable={true} val={this.state.filterData.ldcn_no} text='LDCN Number: LCXXXXX/2023' type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="LDCN Date" />
                                                <AddInputDate onChange={(date) => {
                                                    let filterData =
                                                        this.state.filterData
                                                    filterData.ldcn_date = date
                                                    this.setState({ filterData })
                                                }} disable={true} val={this.state.filterData.ldcn_date} text='Enter LDCN Date' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Supplier" />
                                                <AddTextInput
                                                    disable={true}
                                                    require={false}
                                                    onChange={(e) => null}
                                                    val={this.getSupplierNameFromID(this.state.filterData.supplier_id)} text='Enter Supplier Name' type='text' />
                                                {/* <AddInput
                                                    require={false}
                                                    disable={true}
                                                    options={this.state.all_Suppliers}
                                                    val={this.state.all_Suppliers.find((v) => v.id === this.state.filterData.supplier_id)?.name}
                                                    getOptionLabel={(option) => option.name || ""}
                                                    text='Supplier'
                                                    onChange={(event, value) => null}
                                                /> */}
                                                {/* <Autocomplete
                                                    // disableClearable
                                                    disabled={true}
                                                    className="w-full"
                                                    options={this.state.all_Suppliers}
                                                    getOptionLabel={(option) => option.name}
                                                    value={this.state.all_Suppliers.find((v) => v.id == this.state.filterData.supplier_id)}
                                                    onChange={(event, value) => {
                                                        let formData = this.state.filterData
                                                        if (value != null) {
                                                            formData.supplier_id = value.id
                                                        } else {
                                                            formData.supplier_id = null
                                                        }
                                                        this.setState({ formData })
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
                                                            value={this.state.all_Suppliers.find((v) => v.id == this.state.filterData.supplier_id)}
                                                            fullWidth
                                                            // InputLabelProps={{
                                                            //     shrink: true,
                                                            // }}
                                                            variant="outlined"
                                                            size="small"
                                                        // validators={['required']}
                                                        // errorMessages={['this field is required']}
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
                                                <Divider className='mt-2' />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={4}
                                                        md={4}
                                                        sm={6}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="LDCN Recieved" />
                                                        <AddInput
                                                            disable={true}
                                                            options={[{ name: "YES" }, { name: "NO" }]}
                                                            val={this.state.filterData.ldcn_received}
                                                            getOptionLabel={(option) => option.name || ""}
                                                            text='LDCN Recieved'
                                                            onChange={(e, value) => {
                                                                const newFormData = {
                                                                    ...this.state.filterData,
                                                                    ldcn_received: e.target.textContent ? e.target.textContent : e.target.value,
                                                                    // ldcn_received_id: value ? value.id : null,
                                                                };
                                                                this.setState({ filterData: newFormData });
                                                            }
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                                        <SubTitle title="Recieved Date" />
                                                        <AddInputDate
                                                            disable={true}
                                                            require={false}
                                                            onChange={(date) => {
                                                                let filterData =
                                                                    this.state.filterData
                                                                filterData.received_date = date
                                                                this.setState({ filterData })
                                                            }} val={this.state.filterData.received_date} text='Enter Received Date' />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                className=" w-full"
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
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                {/* DEV Note -> wharf_ref_no has been mapped to shipment_no */}
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
