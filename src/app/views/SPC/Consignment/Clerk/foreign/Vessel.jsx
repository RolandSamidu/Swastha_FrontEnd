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
import { isNull, isUndefined } from 'lodash'


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

const AddTextInput = ({ type = 'text', onChange = (e) => e, val = "", text = "Add", tail = null, require = false, disable = true }) => (
    <TextValidator
        className=" w-full"
        placeholder={`⊕ ${text}`}
        // name="sr_no"
        InputLabelProps={{
            shrink: false,
        }}
        disabled={disable}
        value={val}
        type="text"
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
        value={val ? String(val) : String(0)}
        type="number"
        variant="outlined"
        size="small"
        min={0}
        disabled={disable}
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
            disabled={disable}
            // id="disable-clearable"
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

class ShipmentVessel extends Component {
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
            filterData: {},
            isEdit: false,

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

    handleRowCountChange = (event) => {
        const { value } = event.target;
        const newRowCount = parseInt(value, 10);
        // console.log("Value: ", newRowCount)
        const { fcl_value, fcl_table_values } = this.state.filterData.vessel_details[0];


        if (!isNaN(newRowCount)) {
            if (newRowCount < fcl_value) {
                // const updatedValues = fcl_table_values.slice(0, newRowCount);
                this.setState(prevState => {
                    const updatedValues = prevState.filterData.vessel_details[0].fcl_table_values.slice(0, newRowCount);
                    const updatedFilterData = {
                        ...prevState.filterData,
                        vessel_details: [
                            {
                                ...this.state.filterData.vessel_details[0],
                                fcl_value: newRowCount,
                                fcl_table_values: updatedValues,
                            }]
                    };

                    return {
                        filterData: updatedFilterData,
                    };
                });
                // this.setState({
                //     fcl_value: newRowCount,
                //     fcl_table_values: updatedValues,
                // });
            } else {

                const emptyRow = { container_type: '', container_number: '', container_load: '' };
                const updatedValues = [...fcl_table_values];

                for (let i = fcl_value; i < newRowCount; i++) {
                    updatedValues.push(emptyRow);
                }

                this.setState(prevState => {
                    const updatedFilterData = {
                        ...prevState.filterData,
                        vessel_details: [
                            {
                                ...this.state.filterData.vessel_details[0],
                                fcl_value: newRowCount,
                                fcl_table_values: updatedValues,
                            }]
                    };

                    return {
                        filterData: updatedFilterData,
                    };
                });

                // this.setState({
                //     fcl_value: newRowCount,
                //     fcl_table_values: updatedValues,
                // });
            }
        } else {
            // this.setState({
            //     fcl_value: 0,
            //     fcl_table_values: [],
            // });
            this.setState(prevState => {
                const updatedFilterData = {
                    ...prevState.filterData,
                    vessel_details: [
                        {
                            ...this.state.filterData.vessel_details[0],
                            fcl_value: 0,
                            fcl_table_values: [],
                        }]
                };

                return {
                    filterData: updatedFilterData,
                };
            });
        }
    };

    handleInputChange = (e, val, rowIndex, columnName, type = 'text') => {
        const { value } = e.target;
        const { fcl_table_values } = this.state.filterData.vessel_details[0];
        const updatedValues = [...fcl_table_values];
        const updatedRow = { ...updatedValues[rowIndex] };
        if (isUndefined(val)) {
            if (type === 'number') {
                updatedRow[columnName] = parseInt(value, 10);
            } else {
                updatedRow[columnName] = value;
            }
        } else {
            if (columnName === "container_load" && val?.label === 'Full') {
                updatedRow['container_part'] = 0;
            }
            updatedRow[columnName] = val?.label;
        }

        updatedValues[rowIndex] = updatedRow;
        this.setState(prevState => {
            const updatedFilterData = {
                ...prevState.filterData,
                vessel_details: [
                    {
                        ...this.state.filterData.vessel_details[0],
                        fcl_table_values: updatedValues,
                    }]
            };

            return {
                filterData: updatedFilterData,
            };
        });
    };

    renderFCLTableRows = () => {
        const { fcl_value, fcl_table_values } = Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0] : { fcl_value: 0, fcl_table_values: [] };
        const rows = [];

        for (let i = 0; i < fcl_value; i++) {
            const row = fcl_table_values[i];
            rows.push(
                <tr key={i} style={{ border: "1px solid black", borderCollapse: "collapse", height: "40px" }}>
                    <td style={{ height: "40px", width: "20%" }}>
                        <AddInput options={[{ label: "20ft FCL" }, { label: "20ft FCL RF" }, { label: "40ft FCL" }, { label: "40ft FCL RF" }]} getOptionLabel={(option) => option.label || ""} disable={!this.state.isEdit} onChange={(e, val) => this.handleInputChange(e, val, i, 'container_type')} val={row.container_type || ""} text='Enter Container Type' type='text' />
                    </td>
                    <td style={{ height: "40px", width: "20%" }}>
                        <AddTextInput disable={!this.state.isEdit} onChange={(e, val) => this.handleInputChange(e, val, i, 'container_number')} val={row.container_number || ""} text='Enter Container Number' type='text' />
                    </td>
                    <td style={{ height: "40px", width: "20%" }}>
                        <AddInput disable={!this.state.isEdit} options={[{ label: "Full" }, { label: "Partial" }]} getOptionLabel={(option) => option.label || ""} onChange={(e, val) => this.handleInputChange(e, val, i, 'container_load')} val={row.container_load || ""} text='Enter Container Load' type='text' />
                    </td>
                    <td style={{ height: "40px", width: "20%" }}>
                        <AddNumberInput disable={!this.state.isEdit && row.container_type !== "Partial"} onChange={(e, val) => this.handleInputChange(e, val, i, 'container_part', 'number')} val={row.container_part || ""} text='Enter Container Parts' type='text' />
                    </td>
                    <td style={{ height: "40px", width: "20%" }}>
                        <AddTextInput disable={!this.state.isEdit} onChange={(e, val) => this.handleInputChange(e, val, i, 'vehicle_no')} val={row.vehicle_no || ""} text='Enter Vehicle No' type='text' />
                    </td>
                </tr>
            );
        }

        return rows;
    }

    renderNonFCLTableRows = () => {
        const { fcl_value, fcl_table_values } = Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0] : { fcl_value: 0, fcl_table_values: [] };
        const rows = [];

        for (let i = 0; i < fcl_value; i++) {
            const row = fcl_table_values[i];
            rows.push(
                <tr key={i} style={{ border: "1px solid black", borderCollapse: "collapse", height: "40px" }}>
                    <td style={{ height: "40px", width: "50%" }}>
                        <AddTextInput disable={!this.state.isEdit} onChange={(e, val) => this.handleInputChange(e, val, i, 'lorry_no')} val={row.lorry_no || ""} text='Enter Lorry No' type='text' />
                    </td>
                    <td style={{ height: "40px", width: "50%" }}>
                        <AddTextInput disable={!this.state.isEdit} onChange={(e, val) => this.handleInputChange(e, val, i, 'remark')} val={row.remark || ""} text='Enter Remark' type='text' />
                    </td>
                </tr>
            );
        }

        return rows;
    }

    onSubmit = () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleNext();
    };

    onBack = () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleBack();
    };

    componentDidMount() {
        const { data, isEdit } = this.props
        this.setState({
            filterData: data,
            isEdit: isEdit
        })
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
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title={this.state.filterData?.vessel_details?.[0]?.vessel_type === "Air Freight" ? "Flight Name" : "Vessel Name"} />
                                                <AddTextInput onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            vessel_details: [
                                                                {
                                                                    ...this.state.filterData.vessel_details[0],
                                                                    flight_name:
                                                                        e.target
                                                                            .value,
                                                                }]
                                                        },
                                                    })
                                                }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0].flight_name : ''} text={this.state.filterData?.vessel_details?.[0]?.vessel_type === "Air Freight" ? "Enter Flight Name" : 'Enter Vessel Name'} type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title={this.state.filterData?.vessel_details?.[0]?.vessel_type === "Air Freight" ? "Flight Number" : "Voyage Number"} />
                                                <AddTextInput onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            vessel_details: [
                                                                {
                                                                    ...this.state.filterData.vessel_details[0],
                                                                    flight_no:
                                                                        e.target
                                                                            .value,
                                                                }]
                                                        },
                                                    })
                                                }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0].flight_no : ""} text={this.state.filterData?.vessel_details?.[0]?.vessel_type === "Air Freight" ? "Enter Flight Number" : 'Enter Voyage Number'} type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Weight" />
                                                <AddNumberInput onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            vessel_details: [
                                                                {
                                                                    ...this.state.filterData.vessel_details[0],
                                                                    weight:
                                                                        roundDecimal(parseFloat(e.target
                                                                            .value), 2),
                                                                }]
                                                        },
                                                    })
                                                }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0].weight : 0} text='Enter Weight' type='number' />
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
                                                style={{ border: "1px solid #3B71CA", borderRadius: "10px" }}
                                                className="w-full py-4 mt-2 mb-2"
                                                item
                                                lg={6}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                {
                                                    this.state.filterData?.vessel_details?.[0]?.vessel_type === "FCL" ?
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid lg={4} md={4} xs={4} sm={4} style={{ padding: "8px" }}>
                                                                    <SubTitle title="No of FCL's" />
                                                                    <AddNumberInput disable={!this.state.isEdit} onChange={this.handleRowCountChange} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0]?.fcl_value : 0} text="Enter No of FCL's" type='number' />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container spacing={2}>
                                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                                    <table style={{ width: "100%" }}>
                                                                        <thead>
                                                                            <tr style={{ backgroundColor: "#626566", border: "1px solid black", borderCollapse: "collapse", height: "40px" }}>
                                                                                <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>Container Type</th>
                                                                                <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>Container Number</th>
                                                                                <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>Container Load</th>
                                                                                <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>Total Parts</th>
                                                                                <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>Vehicle No</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {Array.isArray(this.state.filterData.vessel_details) && (isNull(this.state.filterData.vessel_details[0].fcl_value) || (!isNaN(this.state.filterData.vessel_details[0].fcl_value)) && this.state.filterData.vessel_details[0].fcl_value === 0) ?
                                                                                <tr style={{ height: "40px" }}>
                                                                                    <td style={{ width: "20%", textAlign: "center" }}>!</td>
                                                                                    <td style={{ width: "20%", textAlign: "center" }}>No</td>
                                                                                    <td style={{ width: "20%", textAlign: "center" }}>Any</td>
                                                                                    <td style={{ width: "20%", textAlign: "center" }}>Data</td>
                                                                                    <td style={{ width: "20%", textAlign: "center" }}>!</td>
                                                                                </tr>
                                                                                : this.renderFCLTableRows()}
                                                                        </tbody>
                                                                    </table>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                        :
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid lg={4} md={4} xs={4} sm={4} style={{ padding: "8px" }}>
                                                                    <SubTitle title="No of Lorries" />
                                                                    <AddNumberInput disable={!this.state.isEdit} onChange={this.handleRowCountChange} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0]?.fcl_value : 0} text="Enter No of Lorries" type='number' />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container spacing={2}>
                                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                                    <table style={{ width: "100%" }}>
                                                                        <thead>
                                                                            <tr style={{ backgroundColor: "#626566", border: "1px solid black", borderCollapse: "collapse", height: "40px" }}>
                                                                                <th style={{ color: "white", fontWeight: "bold", width: "50%" }}>Lorry Number</th>
                                                                                <th style={{ color: "white", fontWeight: "bold", width: "50%" }}>Remark</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {Array.isArray(this.state.filterData.vessel_details) && (isNull(this.state.filterData.vessel_details[0].fcl_value) || (!isNaN(this.state.filterData.vessel_details[0].fcl_value)) && this.state.filterData.vessel_details[0].fcl_value === 0) ?
                                                                                <tr style={{ height: "40px" }}>
                                                                                    <td style={{ width: "50%", textAlign: "center" }}>No</td>
                                                                                    <td style={{ width: "50%", textAlign: "center" }}>Data</td>
                                                                                </tr>
                                                                                : this.renderNonFCLTableRows()}
                                                                        </tbody>
                                                                    </table>
                                                                </Grid>
                                                            </Grid>
                                                        </>

                                                }
                                            </Grid>
                                            <Grid className='w-full' item lg={6} md={12} sm={12} xs={12}>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                                        <SubTitle title="Total Packages" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    vessel_details: [
                                                                        {
                                                                            ...this.state.filterData.vessel_details[0],
                                                                            total_packages:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 2),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0].total_packages : 0} text="Enter No of Packages" type='number' />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Actual Dispatch Date" />
                                                        <AddInputDate onChange={(date) => {
                                                            let filterData =
                                                                this.state.filterData
                                                            filterData.vessel_details[0].dispatch_date = date
                                                            this.setState({ filterData })
                                                        }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0].dispatch_date : null} text='Enter Actual Dispatch Date' />
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Date of Clearance" />
                                                        <AddInputDate onChange={(date) => {
                                                            let filterData =
                                                                this.state.filterData
                                                            filterData.vessel_details[0].clearance_date = date
                                                            this.setState({ filterData })
                                                        }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0].clearance_date : null} text='Enter Date of Clearance' />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Departure Port" />
                                                        <AddTextInput
                                                            // options={[]}
                                                            val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0].departure_port : ""}
                                                            // getOptionLabel={(option) => option.name || ""}
                                                            text='Enter Departure Port'
                                                            onChange={(e, value) => {
                                                                const newFormData = {
                                                                    ...this.state.filterData,
                                                                    vessel_details: [
                                                                        {
                                                                            ...this.state.filterData.vessel_details[0],
                                                                            departure_port: e.target.textContent ? e.target.textContent : e.target.value,
                                                                            // departure_port_id: value ? value.id : null,
                                                                        }]
                                                                };

                                                                this.setState({ filterData: newFormData });
                                                            }
                                                            }
                                                        />
                                                    </Grid>
                                                    {/* <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Departure Date" />
                                                        <AddInputDate onChange={(date) => {
                                                            let filterData =
                                                                this.state.filterData
                                                            filterData.vessel_details[0].departure_date = date
                                                            this.setState({ filterData })
                                                        }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0].departure_date : null} text='Enter Departure Date' />
                                                    </Grid> */}
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Arrival Port" />
                                                        <AddTextInput
                                                            // options={[]}
                                                            val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0].arrival_port : ""}
                                                            // getOptionLabel={(option) => option.name || ""}
                                                            text='Enter Arrival Port'
                                                            onChange={(e, value) => {
                                                                const newFormData = {
                                                                    ...this.state.filterData,
                                                                    vessel_details: [
                                                                        {
                                                                            ...this.state.filterData.vessel_details[0],
                                                                            arrival_port: e.target.textContent ? e.target.textContent : e.target.value,
                                                                            // arrival_port_id: value ? value.id : null,
                                                                        }]
                                                                };

                                                                this.setState({ filterData: newFormData });
                                                            }
                                                            }
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
                                                        <SubTitle title="Arrival Date" />
                                                        <AddInputDate onChange={(date) => {
                                                            let filterData =
                                                                this.state.filterData
                                                            filterData.vessel_details[0].arrival_date = date
                                                            this.setState({ filterData })
                                                        }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0].arrival_date : null} text='Enter Arrival Date' />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            {/* <Grid
                                                className="w-full my-2"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Divider />
                                            </Grid> */}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title={this.state.filterData?.vessel_details?.[0]?.vessel_type === "Air Freight" ? "Airline Company" : "Shipping Company"} />
                                                <AddTextInput
                                                    // options={[]}
                                                    val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0].company : ''}
                                                    // getOptionLabel={(option) => option.name || ""}
                                                    text={this.state.filterData?.vessel_details?.[0]?.vessel_type === "Air Freight" ? "Enter Airline Company" : 'Enter Shipping Company'}
                                                    onChange={(e, value) => {
                                                        const newFormData = {
                                                            ...this.state.filterData,
                                                            vessel_details: [
                                                                {
                                                                    ...this.state.filterData.vessel_details[0],
                                                                    company: e.target.textContent ? e.target.textContent : e.target.value,
                                                                    // company_id: value ? value.id : null,
                                                                }]
                                                        };

                                                        this.setState({ filterData: newFormData });
                                                    }
                                                    }
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={3}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title={this.state.filterData?.vessel_details?.[0]?.vessel_type === "Air Freight" ? "AWB Number" : "B/L Number"} />
                                                <AddTextInput onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            vessel_details: [
                                                                {
                                                                    ...this.state.filterData.vessel_details[0],
                                                                    bl_no:
                                                                        e.target
                                                                            .value,
                                                                }]
                                                        },
                                                    })
                                                }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0].bl_no : ""} text={this.state.filterData?.vessel_details?.[0]?.vessel_type === "Air Freight" ? "Enter AWB Number" : 'Enter B/L Number'} type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={3}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title={this.state.filterData?.vessel_details?.[0]?.vessel_type === "Air Freight" ? "AWB Date" : "B/L Date"} />
                                                <AddInputDate onChange={(date) => {
                                                    let filterData =
                                                        this.state.filterData
                                                    filterData.vessel_details[0].bl_date = date
                                                    this.setState({ filterData })
                                                }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0].bl_date : null} text={this.state.filterData?.vessel_details?.[0]?.vessel_type === "Air Freight" ? "Enter AWB Date" : 'Enter B/L Date'} />
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
                                                            onClick={this.props.handleBack}
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
                                                            onClick={this.onBack}
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

export default withStyles(styleSheet)(ShipmentVessel)
