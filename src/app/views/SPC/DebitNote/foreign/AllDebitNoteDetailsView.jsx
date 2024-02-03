import React, { Component, Fragment, useState } from 'react'
import { withStyles, styled } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Typography,
    Card
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import ConfirmationDialog from 'app/components/ConfirmationDialog/ConfirmationDialog'

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
import AutorenewIcon from '@mui/icons-material/Autorenew';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';

import BackupTableIcon from '@mui/icons-material/BackupTable';
import localStorageService from 'app/services/localStorageService'
import SPCServices from 'app/services/SPCServices'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Chip } from '@mui/material';


import Item from '../item';
import FinanceDocumentServices from 'app/services/FinanceDocumentServices'
import ConsignmentService from 'app/services/ConsignmentService'
import { color } from '@material-ui/system'
import { number } from 'prop-types'


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

const AddTextInput = ({ type = 'text', onChange = (e) => e, val= "", text = "Add", tail = null , style={}}) => (
    <TextValidator
        className=" w-full"
        placeholder={`⊕ ${text}`}
        // name="sr_no"
        InputLabelProps={{
            shrink: false,
        }}

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

class AllDebitNoteDetailsView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isEditable: true,
            activeStep: 1,
            checked: false,
            role: null,
            buttonDisable:false,

            itemList: [],
            // single_data:{},

            collapseButton: 0,
            userRoles: [],

            alert: false,
            message: '',
            severity: 'success',

            all_Suppliers: [],
            all_debit_note_type:[],
            all_debit_note_sub_type:[],
            transaction:[],
            isLoad: false,
            charges_value:null,

            additional_data :[],

            // loading: false,
            // single_loading: false,
            filterData: {
                // Shipping Details
                wharf_ref_no: null,
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
            service_val : [],
            vat_val : [],
            additional_val : [],

            SSL_pre  : {},
            Additional_pre  : {},
            Other_pre : {},

            dNType:[],

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
            },

            currency_types: [
                { label: "LKR" },
                { label: "INR" },
                { label: "USD" },
            ],

            reinstateOpen: false,
            isSave: false,
        }

    }

    // loadData = async () => {

    //     this.setState({ loading: false });
    //     console.log('debit ote id vise: ', this.props.data);
    //     let filterData = this.state.filterData

    //     // let res = await LocalPurchaseServices.getLPRequestItem({ ...formData, status: ['APPROVED'] }, this.props.selected_data)
    //     // let res = await SPCServices.getConsignmentbyId(this.state.formData, this.props.selected_data)

    //     if (this.props.data) {

    //             filterData.ldcn_ref_no = this.props.data?.ldcn_ref_no
    //             filterData.ldcn_no = this.props.data?.ldcn_no
    //             filterData.ldcn_date = this.props.data?.ldcn_date
    //             filterData.supplier_id = this.props.data?.Supplier?.id
    //             filterData.invoice_no = this.props.data?.invoice_no
    //             filterData.order_no = this.props.data?.order_no
    //             filterData.po_no = this.props.data?.po_no
    //             filterData.hs_code = this.props.data?.hs_code
    //             filterData.status = this.props.data?.status
    //             filterData.debit_note_no = this.props.data?.debit_note_number
    //             filterData.debit_note_date = this.props.data?.debit_note_date

    //             filterData.currency_type =  this.props.data?.currency
    //             filterData.currency_rate =  this.props.data?.currency_rate
    //             filterData.values_in_currency =  this.props.data?.values_in_currency
    //             filterData.invoice_amount =  this.props.data?.invoice_amount
    //             filterData.charges_amount =  this.props.data?.charges_amount
    //             filterData.total_amount =  this.props.data?.total_amount

    //         this.setState({ data: this.props.data, filterData})
            
    //     }
        
    //     this.setState({ loading: true })
    // }


    
    // async getDebitNoteType () {

    //     let res = await ConsignmentService.getDabitNoteTypes()

    //     if (res.status === 200) {
    //         console.log('debit note type: ', res);

    //         // let dn_type = res.data.view.data.filter((item)=>item.name === 'SPC Imports' || item.name === 'SPC Local')
    //         this.setState({
    //             all_debit_note_type:res.data.view.data
    //         })
    //     }
    // }

    // async getDebitNoteSubType () {

    //     let res = await ConsignmentService.getDabitNoteSubTypes()

    //     if (res.status === 200) {
    //         console.log('debit note type: ', res);
    //         this.setState({
    //             all_debit_note_sub_type:res.data.view.data
    //         })
    //     }
    // }


    // async getTransactionDet() {

    //     let params

    //     if (this.state.filterData.debit_note_type === 'Imports') {
    //         params = {
    //             document_type : 'SPC IM Debit Note',
    //             is_active: true,
    //         }
    //     } else {
    //         params = {
    //             document_type : 'SPC LC Debit Note',
    //             is_active: true,
    //         }
    //     }

    //     let res = await FinanceDocumentServices.getFinacneDocumentSetups(params)

    //     if (res.status === 200){

    //         console.log('filterdData---------', res)

    //         let service = res.data.view.data.filter((e)=>e?.TransactionType?.type === 'Service Charge')
    //         let vat = res.data.view.data.filter((e)=>e?.TransactionType?.type === 'VAT')

    //         let dropped = res.data.view.data.filter((e) => e?.TransactionType?.type !== 'VAT' && e?.TransactionType?.type !== 'Service Charge');
    //         const additionalData = [];
    //         const service_data = [];
    //         const vat_data = [];

            

    //         for (const item of dropped) {

    //             if (item?.is_percentage){
    //                 let newValue = roundDecimal((item?.value * this.state.filterData?.invoice_amount) / 100, 2)
    //                 additionalData.push({
    //                     transaction_type:item?.TransactionType?.type,
    //                     transaction_type_id: item?.TransactionType?.id || null,
    //                     percentage_or_value: item?.value || 0, 
    //                     value: newValue,
    //                     is_percentage:item?.is_percentage
    //                 });
    //             } else {
    //                 additionalData.push({
    //                     transaction_type:item?.TransactionType?.type,
    //                     transaction_type_id: item?.TransactionType?.id || null,
    //                     percentage_or_value: item?.value || 0, 
    //                     value: item?.value,
    //                     is_percentage:item?.is_percentage
    //                 });
    //             }
                
    //         }

    //         let service_charge

    //         for (const item of service) {

    //             service_charge = roundDecimal((item?.value * this.state.filterData?.invoice_amount) / 100 , 2)
    //             service_data.push({
    //                 transaction_type:item?.TransactionType?.type,
    //                 transaction_type_id: item?.TransactionType?.id || null,
    //                 percentage_or_value: item?.value || 0, 
    //                 value: service_charge,
    //                 is_percentage:item?.is_percentage
    //             });
    //         }

    //         for (const item of vat) {
    //             console.log('service_charge', service_charge)
    //             let newValue = roundDecimal(((Number(service_charge) + Number(this.state.filterData?.invoice_amount)) * item?.value ) / 100, 2)
                
    //             vat_data.push({
    //                 transaction_type:item?.TransactionType?.type,
    //                 transaction_type_id: item?.TransactionType?.id || null,
    //                 percentage_or_value: item?.value || 0, 
    //                 value: newValue,
    //                 is_percentage:item?.is_percentage
    //             });
    //         }

    //         console.log('additionalData',vat_data);

    //         this.setState({
    //             service_val : service_data,
    //             vat_val : vat_data,
    //             transaction : additionalData,
    //             isLoad: true
    //         })

    //     }
        

    // }

    // handleSaveCharges = (value) => {
        
    //     if (this.state.charges_value !== value) {
    //       console.log('final amount', value);
    //       this.setState({
    //         charges_value: value,
    //       });
    //     }
    //   }

    // async saveDebitNote () {

    //     var user = await localStorageService.getItem('userInfo')

    //     let newDataArray1 = this.state.transaction; 
    //     let newDataArray2 = this.state.service_val; 
    //     let newDataArray3 = this.state.vat_val; 

    //     const combinedObject = newDataArray1.concat(newDataArray2);
    //     const finalcombinedObject = combinedObject.concat(newDataArray3);

    //     console.log('user', user);

    //     const debit_note_charges = finalcombinedObject.map(item => {
    //         return {
    //             transaction_type_id: item.transaction_type_id,
    //             percentage_or_value: item.percentage_or_value,
    //             value: item.value
    //         };
    //     });

    //     // console.log('combinedObjectdebit_note_charges', debit_note_charges);

    //     let final_value = Number(this.state.charges_value) + Number(this.state.filterData.invoice_amount)
    //     console.log('this.state.charges_value', this.state.charges_value, this.state.filterData.invoice_amount);
    //     let data = {
    //         consignment_id: this.props.data.id,
    //         invoice_value: this.state.filterData.invoice_amount,
    //         total_charges: this.state.charges_value,
    //         final_value: final_value,
    //         prepared_by: user.id,
    //         status: "Pending",
    //         remark: this.state.filterData.remark,
    //         debit_note_type:this.state.filterData.debit_note_type,
    //         debit_note_sub_type: this.state.filterData.debit_note_sub_type,
    //         debit_note_charges:debit_note_charges
    //     }

    //     // console.log('cheking additional_data', this.state.transaction)
    //     // console.log('cheking posted data', data)


    //     let res = await SPCServices.createDebitNote(data)

    //     if (res.status == 200 || res.status == 201) {
    //         console.log('ok');
    //         this.setState({
    //             message: "Debit Note Create Successfully",
    //             severity: 'success',
    //             alert: true
    //         },()=>{
    //             console.log("setState callback executed")
    //             this.props.handleClose()
    //         })

    //     } else {
    //         console.log('no');
    //         this.setState({
    //             message: "Debit Note Create Unsuccessful",
    //             severity: 'error',
    //             alert: true
    //         })
    //     }
    // }

    async loadData() {

        let id = this.props.selected_data
        console.log('view incoming id', id)
        // let filterData = this.state.filterData

        let res = await SPCServices.getAllDebitNoteByID(id)

        if (res.status === 200){
            console.log('view incoming data', res)
            this.setState({
                data:res.data.view
            })
        }
    }

    async componentDidMount() {
        console.log('sequance', this.props.selected_data)
        let role = await localStorageService.getItem('userInfo')?.roles
        this.setState({
            userRoles: role
        })
        this.loadData()
        
    }
    async getTransactionDet() {

        let params

        if (this.state.filterData.debit_note_type === 'Imports') {
            params = {
                document_type : 'SPC IM Debit Note',
                is_active: true,
            }
        } else {
            params = {
                document_type : 'SPC LC Debit Note',
                is_active: true,
            }
        }
// change services file
        let res = await FinanceDocumentServices.getFinacneDocumentSetups(params)
        console.log("finance data", res)
        if (res.status === 200){

            // let additional = res.data.view.data.filter((e) => e?.TransactionType?.type === 'Additional Charges');
            let additional = res.data.view.data.filter((e) => e?.TransactionType?.type === 'additional');

            let dropped = res.data.view.data.filter((e) => e?.TransactionType?.type !== 'Service Charge');
            console.log("res", res.data.view.data)

            const myObject = this.state.transaction_data[0]
            const additionalData = [];
            const additional_data = [];
            // const vat_data = [];
            // const ssl_data = [];

            for (let index = 0; index < dropped.length; index++) {
                const element = dropped[index];

                let type = element.TransactionType.type.toLowerCase()
                console.log("type", type);
                    if (myObject.hasOwnProperty(type)) {
                        const foundValue = myObject[type];
                        console.log(`Value for ${type} is: ${foundValue}`);
                        
    
                            additionalData.push({
                                transaction_type:element.TransactionType.type,
                                transaction_type_id: element.TransactionType.id,
                                percentage_or_value: foundValue || 0,
                                value: foundValue,
                                is_percentage:false
                            });
    
                    } 
                
            }

            let additional_charge

            for (const addItem of additional) {

                additional_charge = roundDecimal((addItem?.value * this.state.filterData?.invoice_amount) / 100 , 2)
                additional_data.push({
                    transaction_type:addItem?.TransactionType?.type,
                    transaction_type_id: addItem?.TransactionType?.id || null,
                    percentage_or_value: addItem?.value || 0, 
                    value: additional_charge,
                    is_percentage:addItem?.is_percentage
                });
            }

            // let other_charge

            // for (const otherItem of other) {

            //     other_charge = roundDecimal((otherItem?.value * this.state.filterData?.invoice_amount) / 100 , 2)
            //     other_data.push({
            //         transaction_type:otherItem?.TransactionType?.type,
            //         transaction_type_id: otherItem?.TransactionType?.id || null,
            //         percentage_or_value: otherItem?.value || 0, 
            //         value: other_charge,
            //         is_percentage:otherItem?.is_percentage
            //     });
            // }

            // for (const item of vat) {
            //     // console.log('service_charge', service_charge)
            //     let newValue = roundDecimal(((Number(service_charge) + Number(this.state.filterData?.invoice_amount)) * item?.value ) / 100, 2)
                
            //     vat_data.push({
            //         transaction_type:item?.TransactionType?.type,
            //         transaction_type_id: item?.TransactionType?.id || null,
            //         percentage_or_value: item?.value || 0, 
            //         value: newValue,
            //         is_percentage:item?.is_percentage
            //     });
            // }

            
            // for (const item of ssl) {
            //     // console.log('service_charge', item?.value)
            //     // console.log('service_charge -1', this.state.filterData?.invoice_amount)
            //     // console.log('service_charge', service_charge)
            //     let newValue = roundDecimal((item?.value * this.state.filterData?.invoice_amount) / 100 , 2)
            //     // console.log('service_charge -2', item?.value)
            //     ssl_data.push({
            //         transaction_type:item?.TransactionType?.type,
            //         transaction_type_id: item?.TransactionType?.id || null,
            //         percentage_or_value: item?.value || 0, 
            //         value: newValue,
            //         is_percentage:item?.is_percentage
            //     });
            // }

            // console.log('additionalData',vat_data);

            this.setState({
                additional_val : additional_data,
                // vat_val : vat_data,
                // ssl_val:ssl_data,
                transaction : additionalData,
                isLoad: true
            })

        }
        

    }

    handleSaveCharges = (value) => {
        if(this.state.charges_value !== value){
            console.log('final amount', value);
            this.setState({
                charges_value: value,
            });
        }
    }

    errorHandle(){
        if (this.state.filterData.invoice_amount){
            this.saveApprovedDebitNote()
        } else {
            this.setState({
                errorMsg: true,
                conformation_dialog:false
            })
        }
    }

    async saveDebitNote () {

        this.setState({
            conformation_dialog: false
        })

        var user = await localStorageService.getItem('userInfo')
        // console.log('cheking vat', this.state.vat_val)

        let newDataArray1 = this.state.transaction;
        let newDataArray2 = this.state.other_val; 

        const finishObject = [...newDataArray1, ...newDataArray2]

        console.log('user', user);

        const debit_note_charges = finishObject.map(item => {
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
            debit_note_type:this.state.filterData.debit_note_type,
            // debit_note_sub_type: this.state.filterData.debit_note_sub_type,
            debit_note_charges:debit_note_charges,
        }

        // console.log('cheking additional_data', this.state.transaction)
        // console.log('cheking posted data', data)


        let res = await SPCServices.createDebitNote(data)
        console.log("res data", res.data.view.data)

        if (res.status == 200 || res.status == 201) {
            console.log('ok');
            this.setState({
                message: "Debit Note Create Successfully",
                severity: 'success',
                alert: true
            },()=>{
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

    onChangeStatus = async () => {
        const id = this.props.selected_data
        try {
            let data = {
                status: "REINSTATE",
            }
            let consignment_res = await SPCServices.changeDebitNoteStatus(data, id)
            if (consignment_res.status === 200) {
                this.setState({
                    severity: "success",
                    alert: true,
                    message: "SPC Debit Note was Reinstated",
                })

            } else {
                this.setState({
                    severity: "error",
                    alert: true,
                    message: "SPC Debit Note Reinstated was Unsuccessfull",
                })
            }
        } catch (error) {
            this.setState({
                severity: "error",
                alert: true,
                message: "An error occurred while processing the request",
            })
        }
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
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    {/* <Typography variant="h6" className="font-semibold">Shipping Details</Typography> */}
                                                </div>
                                                <div>
                                                    <Chip
                                                        size="small"
                                                        label={this.state.data?.status ? `Status: ${this.state.data?.status}` : "Status: N/A"}
                                                        color={this.state.data?.status === "REJECTED" ? "error" : "success"}
                                                        variant="outlined"
                                                    />
                                                </div>
                                            </div>
                                            {/* <Divider className='mt-2' /> */}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Wharf Ref. No" />
                                            <AddTextInput 
                                            // style={{color:'black'}}
                                            val={this.state.data?.Consignment?.wharf_ref_no} 
                                            text='Wharf Ref. No' 
                                            // type='text' 
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
                                            <SubTitle title="WDN Number" />
                                            <AddTextInput 
                                     
                                            val={this.state.data?.Consignment?.wdn_no} 
                                            text='WDN Number' type='text' />
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
                                            <AddInputDate 
                                
                                            val={dateParse(this.state.data?.Consignment?.wdn_date)} 
                                            text='WDN Date' />
                                        </Grid>
                                        {/* <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="WHARF ref Number" />
                                            <AddTextInput 
                                     
                                            val={this.state.data?.Consignment?.wharf_ref_no} 
                                            text='WHARF ref Number' type='text' />
                                        </Grid> */}
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Supplier" />
                                             <TextValidator 
                                                    placeholder="Supplier"
                                                    // value={this.state.data?.Consignment?.ldcn_date}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                           
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
                                            val={this.state.data?.Consignment?.invoice_no} 
                                            text='Invoice No' type='text' />
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
                                           
                                            val={this.state.data?.Consignment?.order_no} 
                                            text='Order List Number' type='text' />
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
                                            
                                            val={this.state.data?.Consignment?.po_no} 
                                            text='PO Number' type='text' />
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
                                           
                                            val={this.state.data?.Consignment?.hs_code} 
                                            text='HS Code' type='text' />
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
                                           
                                            // val={this.state.filterData?.grn_no} 
                                            text='GRN No' type='text' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Debit Note Number" />
                                            <AddTextInput 
                                           
                                            val={this.state.data?.debit_note_no} 
                                            text='Debit Note Number' 
                                            type='text' />
                                        </Grid>
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
                                            
                                 
                                            val={dateParse(this.state.data?.createdAt)} 
                                            text='Debit Note Date' />
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
                                            <AddTextInput                                      
                                                val={this.state.data?.type}
                                                text='Debit Note Type'

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
                                            <AddTextInput
                                                // options={this.state.all_debit_note_sub_type}
                                                // val={this.state.data?.type}
                                                // getOptionLabel={(option) => option.name}
                                                val={this.state.data?.debit_note_sub_type}
                                                text='Debit Note Sub Type'
                                                
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
                                            <SubTitle title="Status" />
                                            
                                            <TextValidator
                                       
                                                placeholder="Please choose"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={
                                                    this.state.data?.Consignment?.status
                                                }
                                            />
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <Card>
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
                                                            <TextValidator
                                                                placeholder="Currency Code"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={
                                                                    this.state.data?.Consignment?.currency_type
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
                                                       
                                                 
                                                        val={this.state.data?.Consignment?.currency_rate} 
                                                        text='Exchange Rate' type='number' />
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
                                                        <SubTitle title={"Amount in Currency ( "+ this.state.data?.Consignment?.currency_type +" )"} />
                                                        <AddNumberInput 
                                                        
                                                
                                                        val={roundDecimal(this.state.data?.Consignment?.values_in_currency,4)} 
                                                        text='Amount' type='number' />
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
                                              
                                                        val={roundDecimal(this.state.data?.Consignment?.values_in_lkr, 4)} 
                                                        text='Invoice Amount (LKR)' type='number' />
                                                    </Grid>
                                                   
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
                                                        
                                                        disabled
                                                        val={roundDecimal(Number(this.state.data?.total_charges), 4)} 
                                                        text='Charges Amount' type='number' />
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
                                                       
                                                       
                                                        val={roundDecimal(Number(this.state.data?.final_value) + Number(this.state.filterData?.total_charges), 4)}
                                                         text='Total Amount' type='number' />
                                                    </Grid>
                                                  
                                                </Grid>

                                            {/* {this.state.isLoad  ? ( */}


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
                                                {this.state.data?.DebitNoteCharges.map((item, index)=>(
                                                <Fragment key={index}>
                                                
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
                                                                    <SubTitle title={item?.TransactionType?.type} />
                                                                </div>
                                                                <div style={{ flex: 1 }} className='mx-2'>
                                                                    <AddNumberInput 
                                                            
                                                                    val={item?.percentage_or_value}
                                                                    text='Service Percentage' type='number' />
                                                                </div>
                                                                
                                                                <div style={{ flex: 1 }} className='mx-2'>
                                                                    <TextValidator 
                                                                    
                                                                    size="small"
                                                   
                                                                    value={roundDecimal(item?.amount, 4)} 
                                                                    text='Service Amount' 
                                                                    variant="outlined"
                                                                    type='number' />
                                                                    
                                                                </div>
                                                            
                                                            </div>

                                                        </Grid>
                                                    </Grid>
                                                </Fragment>
                                                ))}
                                                
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
                                                            value={roundDecimal(this.state.data?.total_charges, 4)} 
                                                            size="small"
                                                            text='Total Amount' 
                                                            type='number' 
                                                        />
                                                    </div>
                                                </div>

                                            </Grid>
                                            <Grid
                                                className='mt-5 pb-5'
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
                                                    placeholder="Remark"
                                                    name="remark"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.data?.remark
                                                    }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                 
                                                />
                                            </Grid>
                                            
                                      
                                                </Grid>
                                                </Fragment>
                                                {/* new Changes */}
                                        <Grid container="container" spacing={2}>
                                            <Grid container spacing={2}
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                                className=" w-full flex justify-end pb-5" 
                                                direction='row'>
                                                
                                                
                                                    <Button
                                                        className="mr-2 py-2 px-4"
                                                        progress={false}
                                                        // type="submit"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon={<CloseIcon />}
                                                        style={{ backgroundColor: "white", color: "black", border: "1px solid #3B71CA", borderRadius: "10px" }}
                                                        onClick={this.props.handleClose}
                                                    >
                                                        <span className="capitalize">
                                                            Cancel
                                                        </span>
                                                    </Button>
                                                {(this.state.data?.status === 'APPROVED') && this.state.userRoles.includes("SPC Manager") ?
                                                <Button
                                                    className="mr-2 py-2 px-4"
                                                    progress={false}
                                                    scrollToTop={
                                                        true
                                                    }
                                                    style={{ backgroundColor: "#4BB543", color: "white", borderRadius: "10px" }}
                                                    startIcon={<UndoIcon />}
                                                    onClick={() => this.setState({ reinstateOpen: true })}
                                                >
                                                    <span className="capitalize">
                                                        Reinstate
                                                    </span>
                                                </Button>
                                              : null
                                             } 

                                            </Grid>
                                        </Grid>
                                                {/* ) : null} */}
                                            </Card>
                                        </Grid>
    
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </ValidatorForm>
                <ConfirmationDialog
                    text="Are you sure to Reinstate?"
                    open={this.state.reinstateOpen}
                    onConfirmDialogClose={() => { this.setState({ reinstateOpen: false }) }}
                    onYesClick={() => {
                        this.setState({ reinstateOpen: false }, () => {
                            this.onChangeStatus()
                        })
                    }}
                />
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

export default withStyles(styleSheet)(AllDebitNoteDetailsView)
