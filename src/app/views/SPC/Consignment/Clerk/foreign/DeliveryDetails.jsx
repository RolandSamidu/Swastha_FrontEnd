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
import Moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';

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
import { dateParse, roundDecimal, dateTimeParse, convertM3ToOtherUnit } from 'utils'

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
import { isNull } from 'lodash'
import MomentUtils from '@date-io/moment'
import { KeyboardDateTimePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import WarehouseServices from 'app/services/WarehouseServices'
import EmployeeServices from 'app/services/EmployeeServices'
import WDNPrint from '../../print/WDNPrint'
import SPCServices from 'app/services/SPCServices'


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

const AddInputDate = ({ onChange = (date) => date, val = null, text = "Add", tail = null, disable = false, require = false, }) => (
    <DatePicker
        className="w-full"
        value={val}
        disabled={disable}
        //label="Date From"
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

const AddNumberInput = ({ type = 'number', onChange = (e) => e, val = "", text = "Add", tail = null, disable = false, require = false }) => (
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
            activeStep: 1,
            role: null,

            itemList: [],
            // single_data:{},

            collapseButton: 0,
            userRoles: [],
            userID: null,
            userName: null,

            ploaded: false,
            printLoaded: false,
            user: {},
            supplier: {},
            purchaseOrderData: {},
            deliveryData: [],
            hospital: {},

            alert: false,
            message: '',
            severity: 'success',

            all_Suppliers: [],
            all_Ports: [],

            // loading: false,
            // single_loading: false,
            filterData: {},
            isEdit: false,

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                // item_id: this.props.match.params.item_id
            },
            convertedValue: "0.00 m³"
        }

        this.printData = this.printData.bind(this);
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

    async loadItemData(data) {
        try {
            const spcConsignmentItems = data?.SPCConsignmentItems;

            if (Array.isArray(spcConsignmentItems)) {
                const consignmentItemIds = spcConsignmentItems.map(item => item.item_id);
                const itemResponse = await SPCServices.getAllSPCPODeliverySchedules({ spc_po_id: spcConsignmentItems[0].spc_po_id });

                const initialArray = itemResponse.data.view.data;
                const newArray = initialArray.map(item => {
                    const matchingIndex = consignmentItemIds.indexOf(item.id);

                    return {
                        ...item,
                        selected: matchingIndex !== -1,
                        transit_quantity: matchingIndex !== -1
                            ? spcConsignmentItems[matchingIndex]?.transit_quantity || '0'
                            : '0'
                    };
                });

                this.setState({ itemList: newArray });
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.setState({ alert: true, severity: "error", message: `Error: ${error}` });
        }
    }

    onSubmit = async () => {
        const data = this.state.filterData
        // Update Volumn Value with converted value(Backend always need volumn as m3)
        const updatedData = {
            ...data,

            delivery_details: [
                {
                    ...this.state.filterData.delivery_details[0],
                    volume:
                        roundDecimal(parseFloat(this.state.convertedValue), 2),

                }]
        }

        console.log("data", updatedData)
        // this.setState({
        //     filterData: {
        //         ...this
        //             .state
        //             .filterData,
        //         delivery_details: [
        //             {
        //                 ...this.state.filterData.delivery_details[0],
        //                 delivery_point:
        //                     e.target
        //                         .value,
        //             }]
        //     },
        // })


        this.props.updateData({
            ...data,
        });
        this.props.storeData({
            ...data,
        });
        this.props.handleSubmit();
    }

    onBack = () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleBack();
    };

    async loadAllPorts(search) {
        let params = { search: search, store_type: "Port" }
        let res = await WarehouseServices.getWarehoure(params)
        if (res.status) {
            console.log("all Ports", res.data.view.data)
            this.setState({
                all_Ports: res.data.view.data,
            })
        }
    }

    async loadPortByID(id) {
        let res = await WarehouseServices.getWarehoureById(id)
        if (res.status) {
            console.log("Port: ", res.data.view.data)
            this.setState({
                all_Ports: [res.data.view],
            }, () => {
                console.log("Port: ", this.state.all_Ports)
            })
        }
    }

    // Define a function to get the port name based on its ID
    getPortNameFromID = (portID) => {
        if (!this.state.all_Ports || !portID) {
            return ""; // or render a loading indicator, an error message, etc.
        }
        const foundPort = this.state.all_Ports.find((v) => v.id === portID);
        return foundPort ? foundPort.name : "";
    };

    async getUser(id) {
        if (id) {
            let user_res = await EmployeeServices.getEmployeeByID(id)
            if (user_res.status == 200) {
                this.setState({ userName: user_res?.data?.view?.name, user: user_res?.data?.view })
            }
        }
    }

    componentDidMount() {
        let userName = localStorageService.getItem('userInfo')?.name
        let userID = localStorageService.getItem('userInfo')?.id
        const { data, isEdit } = this.props
        let convertedVal = this.state.convertedValue
        console.log("incomin Data", data)
        if (data) {
            //    convertM3ToOtherUnit
            convertedVal = data.delivery_details[0]?.volume ?? 0.00
            let updatedData = {
                ...data,
                delivery_details: [
                    {
                        ...data.delivery_details[0],
                        volume: convertM3ToOtherUnit(data.delivery_details[0]?.volume ?? 0, data.delivery_details[0]?.unit ?? ""),
                    }]
            }
            this.setState({
                convertedValue: convertedVal,
                filterData: updatedData,

                isEdit: isEdit
            }, () => {
                if (this.state.filterData?.delivery_details[0]?.warf_clerk_id) {
                    this.getUser(this.state.filterData?.delivery_details[0]?.warf_clerk_id);
                } if (this.state.filterData?.delivery_details[0]?.port_warehouse_id) {
                    this.loadPortByID(this.state.filterData?.delivery_details[0]?.port_warehouse_id)
                }
            });
        } if (isEdit) {
            this.loadAllPorts('');
            this.setState({ userName: userName, userID: userID })
        }
    }

    async printData() {
        let user_id = await localStorageService.getItem('userInfo')?.id
        const { data } = this.props
        try {
            this.setState({ printLoaded: false, ploaded: false });

            const consignment_res = await SPCServices.getConsignmentByID(data?.id);

            if (consignment_res.status !== 200) {
                console.error("Error fetching consignment:", consignment_res);
                return;
            }

            const po_res = await SPCServices.getAllPurchaseOrders({ po_no: consignment_res.data.view?.po_no });
            const po_res_single = await SPCServices.getPurchaseOrderByID(po_res.data.view.data?.[0]?.id);

            // Add error handling for the po_res status
            if (po_res.status !== 200 && po_res_single.status !== 200) {
                console.error("Error fetching purchase orders:", po_res);
                return;
            }

            await this.getUser(user_id);
            await this.loadItemData(consignment_res.data.view);

            const vesselDetails = consignment_res.data.view?.ConsigmentVesselData || []
            const fcl_table_values = Array.isArray(vesselDetails?.[0]?.fcl_table_values)
                ? vesselDetails?.[0]?.fcl_table_values
                : JSON.parse(vesselDetails?.[0]?.fcl_table_values || '[]');

            this.setState({
                ploaded: true,
                POData: po_res_single.data.view,
                purchaseOrderData: consignment_res.data.view,
                deliveryData: fcl_table_values,
                printLoaded: true,
            }, () => {
                document.getElementById('wdn_print').click();
            });
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    convertToCubicMeters = (inputValue, selectedUnit) => {
        // Define conversion factors
        const conversionFactors = {
            m3: 1,
            cm3: 0.000001,
            mm3: 1e-9,
            // Add more units and conversion factors as needed
        };

        // Convert the value to m3
        const convertedVal = parseFloat(inputValue) * conversionFactors[selectedUnit];
        return `${convertedVal} m³`;
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
                                                <SubTitle title="Prepared By" />
                                                <AddTextInput disable={true} require={false} onChange={(e) => null} val={this.state.userName} text='Enter MSD Clerk Name' type='text' />
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
                                            {/* <Grid
                                                className=" w-full"
                                                item
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Delivery Date" />
                                                <AddInputDate disable={!this.state.isEdit} require={this.state.isEdit} onChange={(date) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            delivery_details: [
                                                                {
                                                                    ...this.state.filterData.delivery_details[0],
                                                                    delivery_date: date
                                                                }]
                                                        },
                                                    })
                                                }} val={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details?.[0].delivery_date : null} text='Delivery Date' />
                                            </Grid> */}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Delivery Time" />
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
                                                            // setModeOfDispatch(e.target.value)
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
                                                            value="Air Freight"
                                                            control={<Radio />}
                                                            label="Air Freight"
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
                                                {!this.state.isEdit ?
                                                    <AddInput
                                                        require={false}
                                                        disable={true}
                                                        options={this.state.all_Ports || []}
                                                        val={this.getPortNameFromID(this.state.filterData?.delivery_details?.[0]?.port_warehouse_id)}
                                                        getOptionLabel={(option) => option.name || ""}
                                                        text='Port Ware house'
                                                        onChange={(event, value) => null}
                                                    /> :
                                                    <Autocomplete
                                                        // disableClearable
                                                        className="w-full"
                                                        options={this.state.all_Ports || []}
                                                        getOptionLabel={(option) => option.name}
                                                        value={this.state.all_Ports.find((v) => v.id === this.state.filterData?.delivery_details?.[0]?.port_warehouse_id)}
                                                        onChange={(event, value) => {
                                                            let formData = this.state.filterData
                                                            if (value != null) {
                                                                formData.delivery_details[0].port_warehouse_id = value.id
                                                            } else {
                                                                formData.delivery_details[0].port_warehouse_id = null
                                                            }
                                                            this.setState({ filterData: formData })
                                                        }

                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Port Warehouse Name (Type 2 Letters)"
                                                                //variant="outlined"
                                                                //value={}
                                                                onChange={(e) => {
                                                                    if (e.target.value.length > 2) {
                                                                        this.loadAllPorts(e.target.value)
                                                                    }
                                                                }}
                                                                value={this.state.all_Ports.find((v) => v.id === this.state.filterData?.delivery_details?.[0]?.port_warehouse_id)}
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
                                                    />
                                                }
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
                                                <AddInput
                                                    disable={!this.state.isEdit}
                                                    require={this.state.isEdit}
                                                    options={[{ label: "2°C – 8°C" }, { label: "15°C - 20°C" }, { label: "< 25°C" }, { label: "Normal" }]}
                                                    val={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details[0].storage_conditions : ""}
                                                    getOptionLabel={(option) => option.label || ""}
                                                    text='Enter Storage Condition'
                                                    onChange={(e, value) => {
                                                        if (value !== null) {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    delivery_details: [
                                                                        {
                                                                            ...this.state.filterData.delivery_details[0],
                                                                            storage_conditions: value.label,
                                                                        }]
                                                                },
                                                            })
                                                        }
                                                    }
                                                    }
                                                />
                                                {/* <AddTextInput disable={!this.state.isEdit} require={this.state.isEdit} onChange={(e) => {
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
                                                }} val={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details[0].storage_conditions : ""} text='Enter Storage Condition' type='text' /> */}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                <SubTitle title="No of Packages" />
                                                <AddNumberInput
                                                    disable={!this.state.isEdit}
                                                    require={this.state.isEdit}
                                                    onChange={(e) => {
                                                        const inputValue = roundDecimal(parseFloat(e.target.value == null || e.target.value == "" ? 0 : e.target.value), 2);

                                                        this.setState((prevState) => ({
                                                            filterData: {
                                                                ...prevState.filterData,
                                                                delivery_details: [
                                                                    {
                                                                        ...prevState.filterData.delivery_details[0],
                                                                        no_of_packages: inputValue
                                                                    }
                                                                ]
                                                            },

                                                        }));
                                                    }}
                                                    val={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details[0].no_of_packages : 0}
                                                    text="Enter No of Packages"
                                                    type="number"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Grid container spacing={2}>
                                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                                <SubTitle title="Volume" />
                                                                <AddNumberInput disable={!this.state.isEdit} require={this.state.isEdit}
                                                                    onChange={(e) => {
                                                                        const inputValue = roundDecimal(parseFloat(e.target.value == null || e.target.value == "" ? 0 : e.target.value), 2);


                                                                        const selectedUnit = this.state.filterData?.delivery_details[0]?.unit ?? "m3";
                                                                        const convertedVal = this.convertToCubicMeters(inputValue ?? 0.0, selectedUnit);
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
                                                                            convertedValue: convertedVal
                                                                        })
                                                                    }}
                                                                    val={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details[0].volume : 0}
                                                                    text="Enter Volume"
                                                                    type='number'

                                                                />

                                                            </Grid>
                                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                                <SubTitle title="Unit of Measure" />
                                                                <Autocomplete
                                                                    disabled={!this.state.isEdit}
                                                                    defaultValue="m3"
                                                                    className="w-full"
                                                                    options={appConst.Volumn_Units}
                                                                    getOptionLabel={(option) => option}
                                                                    value={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details[0].unit : appConst.Volumn_Units[0]}
                                                                    onChange={(event, value) => {
                                                                        let formData = this.state.filterData;
                                                                        const selectedUnit = value || "m3";
                                                                        const convertedVal = this.convertToCubicMeters(this.state.filterData.delivery_details[0].volume, selectedUnit);

                                                                        formData.delivery_details[0].unit = selectedUnit;
                                                                        this.setState({ filterData: formData, convertedValue: convertedVal });
                                                                    }}
                                                                    renderInput={(params) => (
                                                                        <TextValidator
                                                                            disabled={!this.state.isEdit}
                                                                            value={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details[0].unit : appConst.Volumn_Units[0]}
                                                                            {...params}
                                                                            placeholder="Select measure unit"
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            size="small"
                                                                            // InputLabelProps={{ shrink: true }}
                                                                            validators={parseFloat(this.state.convertedValue) > 0.00 ? ['required'] : null}
                                                                            errorMessages={parseFloat(this.state.convertedValue) > 0.00 ? ['this field is required'] : null}
                                                                        />
                                                                    )}
                                                                />

                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4}>
                                                        <SubTitle title="Value in ( m3 )" />
                                                        <Typography variant="body1">
                                                            {this.state.convertedValue}
                                                        </Typography>


                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid item lg={12} md={12} sm={12} xs={12}>


                                            </Grid>
                                            {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <SubTitle title="Delivered Quantity" />
                                                <AddNumberInput disable={!this.state.isEdit} require={this.state.isEdit} onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            delivery_details: [
                                                                {
                                                                    ...this.state.filterData.delivery_details[0],
                                                                    delivered_quantity:
                                                                        roundDecimal(parseFloat(e.target
                                                                            .value), 2),
                                                                }]
                                                        },
                                                    })
                                                }} val={Array.isArray(this.state.filterData.delivery_details) ? this.state.filterData.delivery_details[0].delivered_quantity : 0} text="Enter Delivered Quantity" type='number' />
                                            </Grid> */}
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
                                                // validators={this.state.isEdit ? [
                                                //     'required',
                                                // ] : []}
                                                // errorMessages={this.state.isEdit ? [
                                                //     'this field is required',
                                                // ] : []}
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
                                                            className="mr-2 py-2 px-4"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            endIcon="print"
                                                            onClick={this.printData}
                                                        >
                                                            <span className="capitalize">
                                                                Print
                                                            </span>
                                                        </Button>
                                                        {this.state.isEdit &&
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
                                                                    Submit
                                                                </span>
                                                            </Button>
                                                        }
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
                {this.state.ploaded &&
                    <WDNPrint purchaseOrderData={this.state.purchaseOrderData} POData={this.state.POData} ItemData={this.state.itemList} hospital={this.state.hospital} user={this.state.user} deliveryData={this.state.deliveryData} />
                }
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
