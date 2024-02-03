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
import * as appConst from '../../../../../../../appconst'
import SearchIcon from '@mui/icons-material/Search';
import { dateParse, roundDecimal, dateTimeParse } from 'utils'

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
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import ConsignmentService from 'app/services/ConsignmentService'


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

const AddInputDate = ({ onChange = (date) => date, val = null, text = "Add", tail = null, require = true, disable = false }) => (
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

const AddTextInput = ({ type = 'text', onChange = (e) => e, val = "", text = "Add", tail = null, disable = false, require = true }) => (
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

const AddNumberInput = ({ type = 'number', onChange = (e) => e, val = "", text = "Add", tail = null, disable = false, require = true }) => (
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

const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", text = "Add", tail = null, disable = false, require = true }) => {
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

class GRNItems extends Component {
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
            grnData: {
                grn_no: null,
                grn_date: null
            },

            grnItems: [],

            columns: [
                {
                    name: 'sequence',
                    label: 'Sequence',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{tableMeta.rowIndex + 1}</p>
                            )
                        },
                    },
                },
                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.grnItems[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap ? this.state.grnItems[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.sr_no : "N/A"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'description',
                    label: 'Description',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.grnItems[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap ? this.state.grnItems[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.medium_description : "N/A"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'price',
                    label: 'Price',
                    options: {

                    },
                },
                {
                    name: 'quantity',
                    label: 'Ordered Quantity',
                    options: {
                    },

                },
                {
                    name: 'consignment_quantity',
                    label: 'Consignment Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.grnItems[tableMeta.rowIndex]?.ConsignmentItemBatch ? this.state.grnItems[tableMeta.rowIndex]?.ConsignmentItemBatch?.quantity : "N/A"}</p>
                            )
                        },
                    },

                },
                {
                    name: 'grn_quantity',
                    label: 'GRN Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.grnItems[tableMeta.rowIndex]?.ConsignmentItemBatch ? this.state.grnItems[tableMeta.rowIndex]?.ConsignmentItemBatch?.grn_quantity : "N/A"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'recieved_quantity',
                    label: 'Recieved Quantity',
                    options: {

                    },

                },
                {
                    name: 'damage',
                    label: 'Damage',
                    options: {

                    },
                },
                {
                    name: 'shortage',
                    label: 'Shortage',
                    options: {

                    },
                },
                {
                    name: 'excess',
                    label: 'Excess',
                    options: {

                    },
                },
            ],

            isEdit: false,
            totalItems: 0,
            formData: {
                limit: 20,
                // grn_no,
                // grn_date,
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
        const formData = this.state.formData

        let res = await ConsignmentService.getGRNItems({ ...formData, consignment_id: this.state.filterData?.id })

        if (res.status === 200) {
            console.log('GRN Data: ', res.data.view.data);
            this.setState({ grnItems: res.data.view.data, totalItems: res.data.view.totalItems })
        }

        this.setState({ loading: true })
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
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
        // this.props.handleSubmit();
        this.props.handleClose()
    }

    onBack = () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleBack();
    };

    componentDidMount() {
        const { data, isEdit } = this.props
        if (data) {
            this.setState({ filterData: data, isEdit: isEdit }, () => {
                this.loadData()
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
                                                lg={3}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="GRN No" />
                                                <AddTextInput
                                                    disable={false}
                                                    require={false}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            grnData: {
                                                                ...this
                                                                    .state
                                                                    .grnData,
                                                                grn_no: e.target.value,
                                                            },
                                                        })
                                                    }} val={this.state.grnData.grn_no} text='Enter GRN Number' type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={3}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="GRN Date" />
                                                <AddInputDate
                                                    disable={false}
                                                    require={false}
                                                    onChange={(date) => {
                                                        let filterData =
                                                            this.state.grnData
                                                        filterData.grn_date = date
                                                        this.setState({ grnData: filterData })
                                                    }} val={this.state.grnData.grn_date} text='Enter GRN Date' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                item
                                                lg={6}
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
                                                        {/* Submit Button */}
                                                        <Button
                                                            className="mx-2"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            startIcon="search"
                                                            style={{ borderRadius: "10px" }}
                                                        // onClick={this.onBack}
                                                        >
                                                            <span className="capitalize">
                                                                Search
                                                            </span>
                                                        </Button>
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
                                                <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    id={'allApprovedPO'}
                                                    data={this.state.grnItems}
                                                    columns={this.state.columns}
                                                    options={{
                                                        pagination: true,
                                                        rowsPerPage: this.state.formData.limit,
                                                        page: this.state.formData.page,
                                                        serverSide: true,
                                                        rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                        print: true,
                                                        count: this.state.grnItems.length,
                                                        viewColumns: true,
                                                        download: true,
                                                        onTableChange: (
                                                            action,
                                                            tableState
                                                        ) => {
                                                            console.log(
                                                                action,
                                                                tableState
                                                            )
                                                            switch (action) {
                                                                case 'changePage':
                                                                    this.setPage(
                                                                        tableState.page
                                                                    )
                                                                    break
                                                                case 'changeRowsPerPage':
                                                                    this.setState({
                                                                        formData: {
                                                                            limit: tableState.rowsPerPage,
                                                                            page: 0,
                                                                        },
                                                                    }, () => {
                                                                        this.loadData()
                                                                    })
                                                                    break;
                                                                case 'sort':
                                                                    //this.sort(tableState.page, tableState.sortOrder);
                                                                    break
                                                                default:
                                                                    console.log(
                                                                        'action not handled.'
                                                                    )
                                                            }
                                                        },
                                                    }}
                                                ></LoonsTable>
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
                                                                    Save
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

export default withStyles(styleSheet)(GRNItems)
