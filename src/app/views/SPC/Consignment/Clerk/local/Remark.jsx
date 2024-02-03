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
import SPCServices from 'app/services/SPCServices'
import LDCNPrint from '../../print/LDCNPrint'
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

const AddInputDate = ({ onChange = (date) => date, val = null, text = "Add", tail = null }) => (
    <DatePicker
        className="w-full"
        value={val}
        //label="Date From"
        placeholder={`⊕ ${text}`}
        minDate={new Date()}
        format='dd/MM/yyyy'
        //maxDate={new Date("2020-10-20")}
        required={true}
        // errorMessages="this field is required"
        onChange={onChange}
    />
)

const AddTextInput = ({ type = 'text', onChange = (e) => e, val = "", text = "Add", tail = null }) => (
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
        onChange={onChange}
        validators={[
            'required',
        ]}
        errorMessages={[
            'this field is required',
        ]}
    />
)

const AddNumberInput = ({ type = 'number', onChange = (e) => e, val = "", text = "Add", tail = null }) => (
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
        onChange={onChange}
        validators={
            ['minNumber:' + 0, 'required:' + true]}
        errorMessages={[
            'Value Should be > 0',
            'this field is required'
        ]}
    />
)

const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", text = "Add", tail = null }) => {
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
                        required
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

class Remark extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            role: null,

            itemList: [],

            ploaded: false,
            printLoaded: false,
            user: {},
            supplier: {},
            purchaseOrderData: {},
            hospital: {},
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
            ],

            isEdit: true
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

    onSubmit = async () => {
        const data = this.state.filterData;
        this.props.updateData(data);
        this.props.storeData(data);
        this.props.handleSubmit();
    }

    onBack = () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleBack();
    };

    componentDidMount() {
        const { data, isEdit } = this.props;
        this.setState({ filterData: data, isEdit: isEdit })
    }

    async getUser(id) {
        if (id) {
            let user_res = await EmployeeServices.getEmployeeByID(id)
            if (user_res.status == 200) {
                this.setState({ user: user_res?.data?.view })
            }
        }
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

    async printData() {
        let user_id = await localStorageService.getItem('userInfo')?.id
        const { data } = this.props;
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

            this.setState({
                ploaded: true,
                POData: po_res_single.data.view,
                purchaseOrderData: consignment_res.data.view,
                printLoaded: true,
            }, () => {
                document.getElementById('ldcn_print').click();
            });
        } catch (error) {
            console.error("An error occurred:", error);
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
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Remarks" />
                                                <TextValidator
                                                    multiline
                                                    rows={10}
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
                    <LDCNPrint purchaseOrderData={this.state.purchaseOrderData} POData={this.state.POData} ItemData={this.state.itemList} hospital={this.state.hospital} user={this.state.user} />
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

export default withStyles(styleSheet)(Remark)
