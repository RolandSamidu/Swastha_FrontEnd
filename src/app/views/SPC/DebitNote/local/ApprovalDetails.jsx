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
import * as appConst from '../../../../../appconst'
import SearchIcon from '@mui/icons-material/Search';
import { convertTocommaSeparated, dateParse, roundDecimal } from 'utils'

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
import SPCServices from 'app/services/SPCServices'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import Item from '../item';
import FinanceDocumentServices from 'app/services/FinanceDocumentServices'
import ConsignmentService from 'app/services/ConsignmentService'
import { color } from '@material-ui/system'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';


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

const AddNumberInput = ({ type = 'number', onChange = (e) => e, val = "", text = "Add", tail = null }) => (
    <TextValidator
        className=" w-full"
        placeholder={`⊕ ${text}`}
        // name="issued_amount"
        InputLabelProps={{
            shrink: false,
        }}
        value={String(val)}
        type="number"
        variant="outlined"
        size="small"
        min={0}
        onChange={onChange}
    // validators={
    //     ['minNumber:' + 0, 'required:' + true]}
    // errorMessages={[
    //     'Value Should be > 0',
    //     'this field is required'
    // ]}
    />
)

const renderDetailCard = (label, value) => {
    return (
        <Grid container spacing={2}>
            <Grid item lg={4} md={4} sm={4} xs={4}>
                <Grid container spacing={2}>
                    <Grid item lg={10} md={10} sm={10} xs={10}>
                        <Typography variant="subtitle1">
                            {label}
                        </Typography>
                    </Grid>
                    <Grid item lg={2} md={2} sm={2} xs={2}>
                        <Typography variant="subtitle1">:</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item lg={8} md={8} sm={8} xs={8}>
                <Typography variant="subtitle1">
                    {value}
                </Typography>
            </Grid>
        </Grid>
    )
}

const AddInputDate = ({ onChange = (date) => date, val = null, text = "Add", tail = null }) => (
    <DatePicker
        className="w-full"
        value={val}
        //label="Date From"
        placeholder={`⊕ ${text}`}
        // minDate={new Date()}
        format='dd/MM/yyyy'
        //maxDate={new Date("2020-10-20")}
        // required={true}
        // errorMessages="this field is required"
        onChange={onChange}
    />
)

const AddTextInput = ({ type = 'text', onChange = (e) => e, val = "", text = "Add", tail = null, condition = {}, style = {} }) => (
    <TextValidator
        className=" w-full"
        placeholder={`⊕ ${text}`}
        // name="sr_no"
        InputLabelProps={{
            shrink: false,
        }}
        disabled={condition}
        style={style}
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
            // disableClearable
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

class IndividualDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            checked: false,
            role: null,
            buttonDisable: false,
            conformation_dialog: false,
            errorMsg: false,

            itemList: [],
            // single_data:{},
            transaction_data: {},

            collapseButton: 0,
            userRoles: [],

            alert: false,
            message: '',
            severity: 'success',

            all_Suppliers: [],
            all_debit_note_type: [],
            all_debit_note_sub_type: [],
            transaction: [],
            isLoad: false,
            charges_value: null,

            additional_data: [],

            // loading: false,
            // single_loading: false,
            filterData: {
                // Shipping Details
                ldcn_ref_no: null,
                ldcn_no: null,
                ldcn_date: null,
                supplier_id: null,
                invoice_no: null,
                order_no: null,
                po_no: null,
                hs_code: null,
                grn_no: null,
                status: null,
                debit_note_no: null,
                debit_note_date: null,
                debit_note_type: null,
                debit_note_type_id: null,
                debit_note_sub_type: null,
                debit_note_subtype_id: null,
                sample_approved_by: null,
                sample_approved_by_id: null,
                sample_approved_date: null,


                // Charges
                service_percentage: null,
                service_amount: null,
                service_vat_percentage: null,
                service_vat_amount: null,
                ssl_percentage: null,
                ssl_amount: null,
                pal_percentage: null,
                pal_amount: null,
                cid_percentage: null,
                cid_amount: null,
                cess_percentage: null,
                cess_amount: null,
                sc_percentage: null,
                sc_amount: null,
                vat_percentage: null,
                vat_amount: null,
                scl_percentage: null,
                scl_amount: null,
                com_percentage: null,
                com_amount: null,
                exm_percentage: null,
                exm_amount: null,
                otc_percentage: null,
                otc_amount: null,
                sel_percentage: null,
                sel_amount: null,
                additional_percentage: null,
                additional_amount: null,
                other_percentage: null,
                other_amount: null,
                total: null,

                currency_type: null,
                currency_rate: null,
                values_in_currency: null,
                invoice_amount: null,
                charges_amount: null,
                total_amount: null,

                remark: null,
            },

            rowServicePercentages: {},
            service_val: [],
            vat_val: [],

            SSL_pre: {},
            Additional_pre: {},
            Other_pre: {},

            dNType: [],

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

        this.setState({ loading: false });
        console.log('debit ote id vise: ', this.props.data);
        let filterData = this.state.filterData

        // let res = await LocalPurchaseServices.getLPRequestItem({ ...formData, status: ['APPROVED'] }, this.props.selected_data)
        // let res = await SPCServices.getConsignmentbyId(this.state.formData, this.props.selected_data)


        if (this.props.data) {

            filterData.ldcn_ref_no = this.props.data?.ldcn_ref_no
            filterData.ldcn_no = this.props.data?.ldcn_no
            filterData.ldcn_date = this.props.data?.ldcn_date
            filterData.supplier_id = this.props.data?.Supplier?.id
            filterData.invoice_no = this.props.data?.invoice_no
            filterData.order_no = this.props.data?.order_no
            filterData.po_no = this.props.data?.po_no
            filterData.hs_code = this.props.data?.hs_code
            filterData.status = this.props.data?.status
            // filterData.debit_note_no = this.props.data?.debit_note_number
            filterData.debit_note_date = dateParse(new Date())

            filterData.currency_type = this.props.data?.currency
            filterData.currency_rate = this.props.data?.currency_rate
            filterData.values_in_currency = this.props.data?.values_in_currency
            filterData.invoice_amount = this.props.data?.values_in_lkr
            filterData.charges_amount = this.props.data?.charges_amount
            filterData.total_amount = this.props.data?.total_amount
            filterData.shipment_no = this.props.data?.shipment_no
            filterData.indent_no = this.props.data?.indent_no


            this.setState({ data: this.props.data, filterData })

        }

        this.setState({ loading: true })

    }



    async getDebitNoteType() {

        let res = await ConsignmentService.getDabitNoteTypes()

        if (res.status === 200) {
            console.log('debit note type: ', res);

            // let dn_type = res.data.view.data.filter((item)=>item.name === 'SPC Imports' || item.name === 'SPC Local')
            this.setState({
                all_debit_note_type: res.data.view.data
            })
        }
    }

    async getDebitNoteSubType() {


        console.log('kgfaa', this.state.filterData.debit_note_type_id)

        let params = {
            type_id: this.state.filterData.debit_note_type_id
        }

        let res = await ConsignmentService.getDabitNoteSubTypes(params)

        if (res.status === 200) {
            console.log('debit note type: ', res);
            this.setState({
                all_debit_note_sub_type: res.data.view.data
            })
        }
    }




    async getTransactionDet() {

        let params

        if (this.state.filterData.debit_note_type === 'Imports') {
            params = {
                document_type: 'SPC IM Debit Note',
                is_active: true,
            }
        } else {
            params = {
                document_type: 'SPC LC Debit Note',
                is_active: true,
            }
        }

        let res = await FinanceDocumentServices.getFinacneDocumentSetups(params)

        if (res.status === 200) {

            console.log('filterdData---------', res)

            let service = res.data.view.data.filter((e) => e?.TransactionType?.type === 'Service Charge')
            let vat = res.data.view.data.filter((e) => e?.TransactionType?.type === 'VAT')

            let dropped = res.data.view.data.filter((e) => e?.TransactionType?.type === 'Other' || e?.TransactionType?.type === 'SSL');
            const additionalData = [];
            const service_data = [];
            const vat_data = [];

            for (const item of dropped) {

                if (item?.is_percentage) {
                    let newValue = roundDecimal((item?.value * this.state.filterData?.invoice_amount) / 100, 2)
                    additionalData.push({
                        transaction_type: item?.TransactionType?.type,
                        transaction_type_id: item?.TransactionType?.id || null,
                        percentage_or_value: item?.value || 0,
                        value: newValue,
                        is_percentage: item?.is_percentage
                    });
                } else {
                    additionalData.push({
                        transaction_type: item?.TransactionType?.type,
                        transaction_type_id: item?.TransactionType?.id || null,
                        percentage_or_value: item?.value || 0,
                        value: item?.value,
                        is_percentage: item?.is_percentage
                    });
                }

            }

            let service_charge

            for (const item of service) {

                service_charge = roundDecimal((item?.value * this.state.filterData?.invoice_amount) / 100, 2)
                service_data.push({
                    transaction_type: item?.TransactionType?.type,
                    transaction_type_id: item?.TransactionType?.id || null,
                    percentage_or_value: item?.value || 0,
                    value: service_charge,
                    is_percentage: item?.is_percentage
                });
            }

            for (const item of vat) {
                console.log('service_charge', service_charge)
                let newValue = roundDecimal(((Number(service_charge) + Number(this.state.filterData?.invoice_amount)) * item?.value) / 100, 2)

                vat_data.push({
                    transaction_type: item?.TransactionType?.type,
                    transaction_type_id: item?.TransactionType?.id || null,
                    percentage_or_value: item?.value || 0,
                    value: newValue,
                    is_percentage: item?.is_percentage
                });
            }

            console.log('additionalData', vat_data);

            this.setState({
                service_val: service_data,
                vat_val: vat_data,
                transaction: additionalData,
                isLoad: true
            })

        }


    }

    handleSaveCharges = (value) => {

        if (this.state.charges_value !== value) {
            console.log('final amount', value);
            this.setState({
                charges_value: value,
            });
        }
    }

    errorHandle() {
        if (this.state.filterData.invoice_amount) {
            this.saveDebitNote()
        } else {
            this.setState({
                errorMsg: true,
                conformation_dialog: false
            })
        }
    }


    async saveDebitNote() {

        this.setState({
            conformation_dialog: false
        })

        var user = await localStorageService.getItem('userInfo')

        let newDataArray1 = this.state.transaction;
        let newDataArray2 = this.state.service_val;
        let newDataArray3 = this.state.vat_val;

        const combinedObject = newDataArray1.concat(newDataArray2);
        const finalcombinedObject = combinedObject.concat(newDataArray3);

        console.log('user', user);

        const debit_note_charges = finalcombinedObject.map(item => {
            return {
                transaction_type_id: item.transaction_type_id,
                percentage_or_value: roundDecimal(item.percentage_or_value, 4),
                amount: roundDecimal(item.value, 4)
            };
        });

        // console.log('combinedObjectdebit_note_charges', debit_note_charges);

        let final_value = Number(this.state.charges_value) + Number(this.state.filterData.invoice_amount)
        console.log('this.state.charges_value', this.state.charges_value, this.state.filterData.invoice_amount);
        let data = {
            consignment_id: this.props.data.id,
            invoice_value: roundDecimal(this.state.filterData.invoice_amount, 4),
            total_charges: roundDecimal(this.state.charges_value, 4),
            final_value: roundDecimal(final_value, 4),
            prepared_by: user.id,
            status: "Pending",
            remark: this.state.filterData.remark,
            debit_note_type: this.state.filterData.debit_note_type,
            debit_note_sub_type: this.state.filterData.debit_note_sub_type,
            debit_note_charges: debit_note_charges
        }

        // console.log('cheking additional_data', this.state.transaction)
        // console.log('cheking posted data', data)


        let res = await SPCServices.createDebitNote(data)

        if (res.status == 200 || res.status == 201) {
            console.log('ok');
            this.setState({
                message: "Debit Note Create Successfully",
                severity: 'success',
                alert: true
            }, () => {
                console.log("setState callback executed")
                this.props.handleClose()
                window.location.reload()
            })

        } else {
            console.log('no');
            this.setState({
                message: "Debit Note Create Unsuccessful",
                severity: 'error',
                alert: true
            })
        }
    }

    async componentDidMount() {
        console.log('sequance', this.props.data)
        let role = await localStorageService.getItem('userInfo')?.roles
        this.setState({
            userRoles: role
        })
        this.loadData()
        this.getDebitNoteType()


    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        let total_value = 0



        return (
            <Fragment>
                {/* Filtr Section */}
                {/* <div className="pb-8 pt-2"> */}
                {/* Filtr Section */}
                <ValidatorForm
                    className="pt-2"
                    onSubmit={() => null}
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
                                            <AddTextInput
                                                // onChange={(e) => {
                                                //     this.setState({
                                                //         filterData: {
                                                //             ...this
                                                //                 .state
                                                //                 .filterData,
                                                //             ldcn_ref_no:
                                                //                 e.target
                                                //                     .value,
                                                //         },
                                                //     })
                                                // }} 
                                                style={{ color: 'black' }}

                                                val={this.state.filterData?.ldcn_ref_no}
                                                text='Enter LDCN Ref. No' type='text'
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
                                            <SubTitle title="LDCN Number" />
                                            <AddTextInput
                                                // onChange={(e) => {
                                                //     this.setState({
                                                //         filterData: {
                                                //             ...this
                                                //                 .state
                                                //                 .filterData,
                                                //             ldcn_no:
                                                //                 e.target
                                                //                     .value,
                                                //         },
                                                //     })
                                                // }} 

                                                disabled={true}
                                                val={this.state.filterData?.ldcn_no} text='Enter LDCN Number' type='text' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="WHARF Ref Number" />
                                            <AddTextInput
                                                // onChange={(e) => {
                                                //     this.setState({
                                                //         filterData: {
                                                //             ...this
                                                //                 .state
                                                //                 .filterData,
                                                //             ldcn_no:
                                                //                 e.target
                                                //                     .value,
                                                //         },
                                                //     })
                                                // }} 

                                                disabled={true}
                                                val={this.state.filterData?.shipment_no} text='Enter WHARF Number' type='text' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="LDCN Date" />
                                            <AddInputDate
                                                // onChange={(date) => {
                                                //     let filterData =
                                                //         this.state.filterData
                                                //     filterData.ldcn_date = date
                                                //     this.setState({ filterData })
                                                // }} 
                                                disabled
                                                val={dateParse(this.state.filterData?.ldcn_date)} text='Enter LDCN Date' />
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
                                            {/* <Autocomplete
                                                // disableClearable
                                                className="w-full"
                                                // options={this.state.all_Suppliers}
                                                getOptionLabel={(option) => option.name}
                                                // value={this.state.all_Suppliers.find((v) => v.id == this.state.filterData.supplier_id)}
                                                // onChange={(event, value) => {
                                                //     let formData = this.state.filterData
                                                //     if (value != null) {
                                                //         formData.supplier_id = value.id
                                                //     } else {
                                                //         formData.supplier_id = null
                                                //     }
                                                //     this.setState({ formData })
                                                // }

                                                // }
                                                renderInput={(params) => (
                                                   
                                                )}
                                            /> */}
                                            <TextValidator
                                                // {...params}
                                                placeholder="Supplier"
                                                //variant="outlined"
                                                //value={}
                                                onChange={(e) => {
                                                    if (e.target.value.length > 2) {
                                                        this.loadAllSuppliers(e.target.value)
                                                    }
                                                }}
                                                // value={this.state.all_Suppliers.find((v) => v.id == this.state.filterData.supplier_id)}
                                                value={this.state.data?.Supplier?.name}
                                                fullWidth
                                                // InputLabelProps={{
                                                //     shrink: true,
                                                // }}
                                                variant="outlined"
                                                size="small"
                                                disabled
                                            // validators={['required']}
                                            // errorMessages={['this field is required']}
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
                                            <SubTitle title="Invoice Number" />
                                            <AddTextInput
                                                // onChange={(e) => {
                                                //     this.setState({
                                                //         filterData: {
                                                //             ...this
                                                //                 .state
                                                //                 .filterData,
                                                //             invoice_no:
                                                //                 e.target
                                                //                     .value,
                                                //         },
                                                //     })
                                                // }} 
                                                val={this.state.filterData?.invoice_no}
                                                text='Enter Invoice No' type='text' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Order List Number" />
                                            <AddTextInput
                                                // onChange={(e) => {
                                                //     this.setState({
                                                //         filterData: {
                                                //             ...this
                                                //                 .state
                                                //                 .filterData,
                                                //             order_no:
                                                //                 e.target
                                                //                     .value,
                                                //         },
                                                //     })
                                                // }} 
                                                val={this.state.filterData?.order_no}
                                                text='Enter Order List Number' type='text' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="PO Number" />
                                            <AddTextInput
                                                // onChange={(e) => {
                                                //     this.setState({
                                                //         filterData: {
                                                //             ...this
                                                //                 .state
                                                //                 .filterData,
                                                //             po_no:
                                                //                 e.target
                                                //                     .value,
                                                //         },
                                                //     })
                                                // }} 
                                                val={this.state.filterData?.po_no}
                                                text='Enter PO Number' type='text' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Indent Number" />
                                            <AddTextInput
                                                // onChange={(e) => {
                                                //     this.setState({
                                                //         filterData: {
                                                //             ...this
                                                //                 .state
                                                //                 .filterData,
                                                //             po_no:
                                                //                 e.target
                                                //                     .value,
                                                //         },
                                                //     })
                                                // }} 
                                                val={this.state.filterData?.indent_no}
                                                text='Enter Indent Number' type='text' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="HS Code" />
                                            <AddTextInput
                                                // onChange={(e) => {
                                                //     this.setState({
                                                //         filterData: {
                                                //             ...this
                                                //                 .state
                                                //                 .filterData,
                                                //             hs_code:
                                                //                 e.target
                                                //                     .value,
                                                //         },
                                                //     })
                                                // }} 
                                                val={this.state.filterData?.hs_code}
                                                text='Enter HS Code' type='text' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="GRN Number" />
                                            <AddTextInput
                                                // onChange={(e) => {
                                                //     this.setState({
                                                //         filterData: {
                                                //             ...this
                                                //                 .state
                                                //                 .filterData,
                                                //             grn_no:
                                                //                 e.target
                                                //                     .value,
                                                //         },
                                                //     })
                                                // }} 
                                                val={this.state.filterData?.grn_no}
                                                text='Enter GRN No' type='text' />
                                        </Grid>
                                        {/* <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Debit Note Number" />
                                            <AddTextInput 
                                            // onChange={(e) => {
                                            //     this.setState({
                                            //         filterData: {
                                            //             ...this
                                            //                 .state
                                            //                 .filterData,
                                            //             debit_note_no:
                                            //                 e.target
                                            //                     .value,
                                            //         },
                                            //     })
                                            // }} 
                                            val={this.state.filterData?.debit_note_no} 
                                            text='Enter Debit Note Number' 
                                            type='text' />
                                        </Grid> */}
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Debit Note Date" />
                                            <AddInputDate
                                                // onChange={(date) => {
                                                //     let filterData =
                                                //         this.state.filterData
                                                //     filterData.debit_note_date = date
                                                //     this.setState({ filterData })
                                                // }} 
                                                disabled
                                                val={dateParse(this.state.filterData?.debit_note_date)}
                                                text='Enter Debit Note Date' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Debit Note Type" />
                                            <AddInput
                                                options={this.state.all_debit_note_type}
                                                val={this.state.filterData?.debit_note_type}
                                                getOptionLabel={(option) => option?.name}
                                                text='Select Debit Note Type'
                                                onChange={(e, value) => {
                                                    const newFormData = {
                                                        ...this.state.filterData,
                                                        debit_note_type: value.name,
                                                        debit_note_type_id: value.id,
                                                    };

                                                    this.setState({ filterData: newFormData }, () => {
                                                        this.getDebitNoteSubType()
                                                        this.getTransactionDet()
                                                    });
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
                                            <SubTitle title="Debit Note Sub Type" />
                                            <AddInput
                                                options={this.state.all_debit_note_sub_type}
                                                val={this.state.filterData?.debit_note_sub_type}
                                                getOptionLabel={(option) => option.name}
                                                text='Enter Debit Note Sub Type'
                                                onChange={(e, value) => {
                                                    const newFormData = {
                                                        ...this.state.filterData,
                                                        debit_note_sub_type: value.name,
                                                        debit_note_subtype_id: value.id,
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
                                            <SubTitle title="Sample Approved By" />
                                            <AddInput
                                                options={[]}
                                                val={this.state.filterData?.sample_approved_by}
                                                getOptionLabel={(option) => option.name || ""}
                                                text='Enter Sample Approved By'
                                            // onChange={(e, value) => {
                                            //     const newFormData = {
                                            //         ...this.state.filterData,
                                            //         sample_approved_by: e.target.textContent ? e.target.textContent : e.target.value,
                                            //         sample_approved_by_id: value ? value.id : null,
                                            //     };
                                            //     this.setState({ filterData: newFormData });
                                            // }
                                            // }
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
                                            <SubTitle title="Sample Approved Date" />
                                            <AddInputDate
                                                // onChange={(date) => {
                                                //     let filterData =
                                                //         this.state.filterData
                                                //     filterData.sample_approved_date = date
                                                //     this.setState({ filterData })
                                                // }} 
                                                val={this.state.filterData?.sample_approved_date}
                                                text='Enter Sample Approved Date' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Status" />
                                            {/* <Autocomplete
                                                className="w-full"
                                                options={appConst.lp_status}
                                                // onChange={(e, value) => {
                                                //     if (null != value) {
                                                //         let filterData =
                                                //             this.state.filterData
                                                //         filterData.status =
                                                //             e.target.value
                                                //         this.setState({
                                                //             filterData,
                                                //         })
                                                //     }
                                                // }}
                                                getOptionLabel={(option) =>
                                                    option.label
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Please choose"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.data?.status
                                                        }
                                                    />
                                                )}
                                            /> */}
                                            <TextValidator
                                                disabled
                                                placeholder="Please choose"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={
                                                    this.state.filterData?.status
                                                }
                                            />
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <LoonsCard>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={3}
                                                        md={4}
                                                        sm={6}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Currency Code" />
                                                        {/* <Autocomplete
                                                            // disableClearable
                                                            className="w-full"
                                                            options={this.state.currency_types}
                                                            onChange={(e, value) => {
                                                                if (null != value) {
                                                                    let filterData =
                                                                        this.state.filterData
                                                                    filterData.currency_type =
                                                                        e.target.value
                                                                    this.setState({
                                                                        filterData,
                                                                    })
                                                                }
                                                            }}
                                                            getOptionLabel={(option) =>
                                                                option.label
                                                            }
                                                            renderInput={(params) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="Please choose"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size="small"
                                                                    value={
                                                                        this.state.filterData
                                                                            .currency_type
                                                                    }
                                                                />
                                                            )}
                                                        /> */}

                                                        <TextValidator
                                                            placeholder="Please choose"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state.filterData
                                                                    ?.currency_type
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
                                                        <SubTitle title="Exchange Rate" />
                                                        <AddNumberInput
                                                            // onChange={(e) => {
                                                            //     this.setState({
                                                            //         filterData: {
                                                            //             ...this
                                                            //                 .state
                                                            //                 .filterData,
                                                            //             currency_rate:
                                                            //                 roundDecimal(parseFloat(e.target
                                                            //                     .value), 2),
                                                            //         },
                                                            //     })
                                                            // }} 
                                                            disabled
                                                            val={roundDecimal(this.state.filterData?.currency_rate, 4)} text='Enter Exchange Rate' type='number' />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={3}
                                                        md={4}
                                                        sm={6}
                                                        xs={12}
                                                    >
                                                        <SubTitle title={"Amount in Currency (" + this.state.filterData?.currency_type + ")"} />
                                                        <AddNumberInput
                                                            // onChange={(e) => {
                                                            //     this.setState({
                                                            //         filterData: {
                                                            //             ...this
                                                            //                 .state
                                                            //                 .filterData,
                                                            //             usd_amount:
                                                            //                 roundDecimal(parseFloat(e.target
                                                            //                     .value), 2),
                                                            //         },
                                                            //     })
                                                            // }} 
                                                            disabled
                                                            val={roundDecimal(this.state.filterData?.values_in_currency, 4)}
                                                            text='Enter USD Amount' type='number' />
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={3}
                                                        md={4}
                                                        sm={6}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Invoice Amount (LKR)" />
                                                        <AddNumberInput
                                                            //  onChange={(e) => {
                                                            //     this.setState({
                                                            //         filterData: {
                                                            //             ...this
                                                            //                 .state
                                                            //                 .filterData,
                                                            //             invoice_amount:
                                                            //                 roundDecimal(parseFloat(e.target
                                                            //                     .value), 2),
                                                            //         },
                                                            //     })
                                                            // }} 
                                                            disabled
                                                            val={roundDecimal(this.state.filterData?.invoice_amount, 4)} text='Enter Invoice Amount (LKR)' type='number' />
                                                    </Grid>
                                                    {this.state.isLoad ? (<>
                                                        <Grid
                                                            className=" w-full"
                                                            item
                                                            lg={3}
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <SubTitle title="Charges Amount" />
                                                            <AddNumberInput
                                                                // onChange={(e) => {
                                                                //     this.setState({
                                                                //         filterData: {
                                                                //             ...this
                                                                //                 .state
                                                                //                 .filterData,
                                                                //             charges_amount:
                                                                //                 roundDecimal(parseFloat(e.target
                                                                //                     .value), 2),
                                                                //         },
                                                                //     })
                                                                // }} 
                                                                disabled
                                                                val={roundDecimal(this.state.charges_value, 4)} text='Enter Charges Amount' type='number' />
                                                        </Grid>
                                                        <Grid
                                                            className=" w-full"
                                                            item
                                                            lg={3}
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <SubTitle title="Total Amount" />
                                                            <AddNumberInput
                                                                // onChange={(e) => {
                                                                //     this.setState({
                                                                //         filterData: {
                                                                //             ...this
                                                                //                 .state
                                                                //                 .filterData,
                                                                //             total_amount:
                                                                //                 roundDecimal(parseFloat(e.target
                                                                //                     .value), 2),
                                                                //         },
                                                                //     })
                                                                // }} 
                                                                disabled
                                                                val={roundDecimal(Number(this.state.charges_value) + Number(this.state.filterData?.invoice_amount), 4)} text='Enter Total Amount' type='number' />
                                                        </Grid>
                                                    </>) : null}
                                                </Grid>

                                                {this.state.isLoad ? (


                                                    <Fragment>

                                                        <Grid container spacing={2} className='mt-5'>
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={6}
                                                                md={8}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "40px" }}>
                                                                    <div style={{ flex: 1, textAlign: "center" }}>
                                                                        <SubTitle title='Charges' />
                                                                    </div>
                                                                    <div style={{ flex: 1, textAlign: "center" }}>
                                                                        <SubTitle title='Percentage Rate(%)' />
                                                                    </div>
                                                                    <div style={{ flex: 1, textAlign: "center" }}>
                                                                        <SubTitle title='Amount (LKR)' />
                                                                    </div>
                                                                </div>

                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={6}
                                                                md={8}
                                                                sm={12}
                                                                xs={12}
                                                            >

                                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "40px" }}>

                                                                    <div style={{ flex: 1 }}>
                                                                        <SubTitle title={this.state.service_val[0]?.transaction_type} />
                                                                    </div>
                                                                    <div style={{ flex: 1 }} className='mx-2'>
                                                                        <AddNumberInput
                                                                            onChange={(e) => {

                                                                                let cal = (this.state.filterData?.invoice_amount * e.target.value) / 100
                                                                                let cal2 = ((Number(this.state.filterData?.invoice_amount) + Number((this.state.filterData?.invoice_amount * e.target.value) / 100)) * this.state.vat_val[0]?.percentage_or_value) / 100

                                                                                let service_val = this.state.service_val
                                                                                service_val[0].percentage_or_value = e.target.value
                                                                                service_val[0].value = cal

                                                                                let vat_val = this.state.vat_val
                                                                                vat_val[0].percentage_or_value = this.state.vat_val[0]?.percentage_or_value
                                                                                vat_val[0].value = cal2

                                                                                this.setState({
                                                                                    service_val,
                                                                                    vat_val
                                                                                })
                                                                            }}
                                                                            val={this.state.service_val[0]?.percentage_or_value}
                                                                            text='Enter Service Percentage' type='number' />
                                                                    </div>
                                                                    { }
                                                                    <div style={{ flex: 1 }} className='mx-2'>
                                                                        <TextValidator
                                                                            onChange={(e) => {
                                                                                this.setState({
                                                                                    filterData: {
                                                                                        ...this
                                                                                            .state
                                                                                            .filterData,
                                                                                        service_amount:
                                                                                            roundDecimal(parseFloat(e.target
                                                                                                .value), 4),
                                                                                    },
                                                                                })
                                                                            }}
                                                                            size="small"
                                                                            disabled
                                                                            value={roundDecimal((this.state.filterData?.invoice_amount * this.state.service_val[0]?.percentage_or_value) / 100, 4)}
                                                                            text='Enter Service Amount'
                                                                            variant="outlined"
                                                                            type='number' />
                                                                        <p className='hidden'>{total_value = total_value + ((this.state.filterData?.invoice_amount * this.state.service_val[0]?.percentage_or_value) / 100)}</p>
                                                                    </div>

                                                                </div>

                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={6}
                                                                md={8}
                                                                sm={12}
                                                                xs={12}
                                                            >

                                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "40px" }}>

                                                                    <div style={{ flex: 1 }}>
                                                                        <SubTitle title={this.state.vat_val[0]?.transaction_type} />
                                                                    </div>
                                                                    <div style={{ flex: 1 }} className='mx-2'>
                                                                        <AddNumberInput
                                                                            onChange={(e) => {
                                                                                let cal = ((Number(this.state.filterData?.invoice_amount) + Number((this.state.filterData?.invoice_amount * this.state.service_val[0].percentage_or_value) / 100)) * e.target.value) / 100

                                                                                let vat_val = this.state.vat_val
                                                                                vat_val[0].percentage_or_value = e.target.value
                                                                                vat_val[0].value = cal

                                                                                this.setState({
                                                                                    vat_val
                                                                                })
                                                                            }}
                                                                            val={this.state.vat_val[0]?.percentage_or_value}
                                                                            text='Enter Service Percentage' type='number' />
                                                                    </div>
                                                                    <div style={{ flex: 1 }} className='mx-2'>
                                                                        <TextValidator
                                                                            onChange={(e) => {
                                                                                this.setState({
                                                                                    filterData: {
                                                                                        ...this
                                                                                            .state
                                                                                            .filterData,
                                                                                        service_amount:
                                                                                            roundDecimal(parseFloat(e.target
                                                                                                .value), 4),
                                                                                    },
                                                                                })
                                                                            }}
                                                                            size="small"
                                                                            value={roundDecimal(((Number(this.state.filterData?.invoice_amount) + Number((this.state.filterData?.invoice_amount * this.state.service_val[0]?.percentage_or_value) / 100)) * this.state.vat_val[0]?.percentage_or_value) / 100, 4)}
                                                                            text='Enter Service Amount'
                                                                            variant="outlined"
                                                                            // disabled
                                                                            type='number' />
                                                                        <p className='hidden'>{total_value = total_value + (((Number(this.state.filterData?.invoice_amount) + Number((this.state.filterData?.invoice_amount * this.state.service_val[0]?.percentage_or_value) / 100)) * this.state.vat_val[0]?.percentage_or_value) / 100)}</p>
                                                                    </div>

                                                                </div>

                                                            </Grid>
                                                        </Grid>

                                                        {
                                                            this.state.transaction.map((item, index) => {
                                                                const servicePercentage = this.state.rowServicePercentages[index] || item?.percentage_or_value;

                                                                if (item.is_percentage) {

                                                                    const serviceAmount = roundDecimal((this.state.filterData?.invoice_amount * servicePercentage) / 100, 4);

                                                                    total_value = total_value + serviceAmount

                                                                    let rowServicePercentages = item
                                                                    rowServicePercentages.value = serviceAmount

                                                                    return (
                                                                        <Grid key={index} container spacing={2}>
                                                                            <Grid className="w-full" item lg={6} md={8} sm={12} xs={12}>
                                                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "40px" }}>
                                                                                    <div style={{ flex: 1 }}>
                                                                                        <SubTitle title={item?.transaction_type} />
                                                                                    </div>
                                                                                    <div style={{ flex: 1 }} className="mx-2">
                                                                                        <AddNumberInput
                                                                                            onChange={(e) => {

                                                                                                const newServicePercentage = (e.target.value);

                                                                                                let rowServicePercentages = item
                                                                                                rowServicePercentages.percentage_or_value = newServicePercentage
                                                                                                // rowServicePercentages.value = serviceAmount

                                                                                                this.setState({
                                                                                                    rowServicePercentages
                                                                                                })


                                                                                            }}
                                                                                            val={item.percentage_or_value}
                                                                                            text="Enter Service Percentage"
                                                                                            type="number"
                                                                                        />
                                                                                    </div>
                                                                                    <div style={{ flex: 1 }} className="mx-2">
                                                                                        <TextValidator
                                                                                            size="small"
                                                                                            value={serviceAmount}
                                                                                            text="Enter Service Amount"
                                                                                            variant="outlined"
                                                                                            type="number"
                                                                                            disabled
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </Grid>
                                                                        </Grid>
                                                                    )

                                                                } else {
                                                                    const serviceAmount = roundDecimal((servicePercentage), 2);

                                                                    total_value = total_value + serviceAmount

                                                                    let rowServicePercentages = item
                                                                    rowServicePercentages.value = serviceAmount


                                                                    return (
                                                                        <Grid key={index} container spacing={2}>
                                                                            <Grid className="w-full" item lg={6} md={8} sm={12} xs={12}>
                                                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "40px" }}>
                                                                                    <div style={{ flex: 1 }}>
                                                                                        <SubTitle title={item?.transaction_type} />
                                                                                    </div>
                                                                                    <div style={{ flex: 1 }} className="mx-2">
                                                                                        {/* <TextValidator
                                                                                size="small"
                                                                                value={serviceAmount}
                                                                             
                                                                                text="Enter Service Amount"
                                                                                variant="outlined"
                                                                                type="number"
                                                                                disabled
                                                                            /> */}

                                                                                    </div>
                                                                                    <div style={{ flex: 1 }} className="mx-2">
                                                                                        <AddNumberInput
                                                                                            onChange={(e) => {
                                                                                                console.log('checkinf type', index, e.target.value)
                                                                                                const newValue = (e.target.value);

                                                                                                let rowServicePercentages = item
                                                                                                rowServicePercentages.percentage_or_value = newValue
                                                                                                //  rowServicePercentages.value = serviceAmount

                                                                                                this.setState({
                                                                                                    rowServicePercentages
                                                                                                })

                                                                                            }}
                                                                                            val={item.percentage_or_value}
                                                                                            text="Enter Service Amount"
                                                                                            type="number"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </Grid>
                                                                        </Grid>
                                                                    )

                                                                }


                                                            })
                                                        }



                                                        {
                                                            this.handleSaveCharges(total_value)
                                                        }

                                                        <Grid container spacing={2}>
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={6}
                                                                md={8}
                                                                sm={12}
                                                                xs={12}
                                                            >

                                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "40px" }}>
                                                                    <div style={{ flex: 1 }}>
                                                                        <SubTitle title='Total Charges' />
                                                                    </div>
                                                                    <div style={{ flex: 1 }} className='mx-2'></div>
                                                                    <div style={{ flex: 1 }} className='mx-2'>
                                                                        <TextValidator
                                                                            variant="outlined"
                                                                            // value={roundDecimal(total_value, 2)} 
                                                                            value={roundDecimal(this.state.charges_value, 4)}
                                                                            size="small"
                                                                            text='Enter Total Amount'
                                                                            type='number'
                                                                        />
                                                                    </div>
                                                                </div>

                                                            </Grid>
                                                            <Grid
                                                                className='mt-5'
                                                                item
                                                                lg={12}
                                                                md={12}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <SubTitle title="Remark" />
                                                                <TextValidator
                                                                    multiline
                                                                    rows={4}
                                                                    className=" w-full"
                                                                    placeholder="Enter Remark"
                                                                    name="remark"
                                                                    InputLabelProps={{
                                                                        shrink: false,
                                                                    }}
                                                                    value={
                                                                        this.state.filterData
                                                                            .remark
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
                                                                                remark:
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
                                                            <Grid
                                                                item
                                                                lg={12}
                                                                md={12}

                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                                    <div className='mx-2'>
                                                                        <Typography className=" text-gray font-semibold text-13" style={{ lineHeight: '1' }}>Checked</Typography>
                                                                    </div>
                                                                    <div>
                                                                        <Checkbox
                                                                            defaultChecked={this.state.checked ? this.state.checked : false}
                                                                            checked={this.state.checked ? this.state.checked : false}
                                                                            required
                                                                            onChange={() => {
                                                                                this.setState({ checked: !this.state.checked, buttonDisable: true })
                                                                            }}
                                                                            name="chkbox_confirm"
                                                                            color="primary"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                            <Grid
                                                                style={{ display: "flex", height: 'fit-content', justifyContent: "space-between" }}
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
                                                                        className=" w-full"
                                                                    >
                                                                        {/* {this.state.userRoles.includes('SPC Supervisor') &&
                                                            <Button
                                                                className="py-2 px-4"
                                                                progress={false}
                                                                // type="submit"
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                startIcon="keyboard_return"
                                                                style={{ backgroundColor: "#DC3545", color: "white", borderRadius: "10px" }}
                                                                onClick={this.props.handleReject}
                                                            >
                                                                <span className="capitalize">
                                                                    Reject
                                                                </span>
                                                            </Button>
                                                        } */}
                                                                    </Grid>
                                                                </Grid>
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
                                                                        {/* {this.state.userRoles.includes('SPC Supervisor') &&
                                                            <Button
                                                                className="mr-2 py-2 px-4"
                                                                progress={false}
                                                                style={{ borderRadius: "10px" }}
                                                                // type="submit"
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                startIcon="print"
                                                            // onClick={this.props.handleClose}
                                                            >
                                                                <span className="capitalize">
                                                                    Print
                                                                </span>
                                                            </Button>
                                                        } */}
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
                                                                        {this.state.buttonDisable &&
                                                                            <Button
                                                                                style={{ borderRadius: "10px" }}
                                                                                className="py-2 px-4"
                                                                                progress={false}
                                                                                type="submit"
                                                                                scrollToTop={
                                                                                    true
                                                                                }
                                                                                endIcon="chevron_right"
                                                                                onClick={() => {
                                                                                    this.setState({
                                                                                        conformation_dialog: true
                                                                                    })
                                                                                }}
                                                                            >
                                                                                <span className="capitalize">
                                                                                    {this.state.userRoles.includes('SPC Manager') ? "Approve" : "Submit"}
                                                                                </span>
                                                                            </Button>
                                                                        }
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Fragment>
                                                ) : null}
                                            </LoonsCard>
                                        </Grid>
                                        {/* Submit and Cancel Button */}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </ValidatorForm>

                <Dialog fullWidth maxWidth="sm" open={this.state.conformation_dialog} >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Confirm for submission ?
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => { this.errorHandle() }}>Yes</Button>
                        <Button style={{ backgroundColor: 'red' }} onClick={() => {
                            this.setState({
                                conformation_dialog: false

                            }, () => {
                                this.props.handleClose()
                                window.location.reload()
                            })
                        }} autoFocus>
                            No
                        </Button>
                    </DialogActions>

                </Dialog>
                <Dialog fullWidth maxWidth="sm" open={this.state.errorMsg} >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Invoice amount is null ! Cannot create Debbit Note.
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>

                        <Button style={{ backgroundColor: 'red' }}
                            onClick={() => {
                                this.setState({
                                    errorMsg: false

                                }, () => {
                                    this.props.handleClose()
                                    window.location.reload()
                                })
                            }} autoFocus>
                            ok
                        </Button>
                    </DialogActions>

                </Dialog>
                {/* </div> */}
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

export default withStyles(styleSheet)(IndividualDetails)
