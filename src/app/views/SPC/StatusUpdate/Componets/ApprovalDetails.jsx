import React, { Component, Fragment, useState } from 'react'
import { withStyles, styled } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
} from '@material-ui/core'
import 'date-fns'

import {
    DatePicker,
    LoonsSnackbar,
    LoonsCard,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../../appconst'
import SearchIcon from '@mui/icons-material/Search';
import { convertTocommaSeparated, dateParse, roundDecimal } from 'utils'

import localStorageService from 'app/services/localStorageService'
import SPCServices from 'app/services/SPCServices'


import { Chip } from '@mui/material'



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
        disabled
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



const AddInputDate = ({ onChange = (date) => date, val = null, text = "Add", tail = null }) => (
    <DatePicker
        className="w-full"
        value={val}
        disabled
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

const AddTextInput = ({ type = 'text', onChange = (e) => e, val = "", text = "Add", tail = null, style = {} }) => (
    <TextValidator
        className=" w-full"
        placeholder={`⊕ ${text}`}
        // name="sr_no"
        InputLabelProps={{
            shrink: false,
        }}

        disabled

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


class DelailsView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            checked: false,
            role: null,
            buttonDisable: false,

            itemList: [],
            // single_data:{},

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
                shipment_no: null,
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
            },

            currency_types: [
                { label: "LKR" },
                { label: "INR" },
                { label: "USD" },
            ]
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

        // const combinedObject = newDataArray1.concat(newDataArray2);
        // const finalcombinedObject = combinedObject.concat(newDataArray3);

        const finalcombinedObject = [...newDataArray1, ...newDataArray2, ...newDataArray3]

        console.log('user', user);

        const debit_note_charges = finalcombinedObject.map(item => {
            return {
                transaction_type_id: item.transaction_type_id,
                percentage_or_value: item.percentage_or_value,
                value: item.value
            };
        });

        // console.log('combinedObjectdebit_note_charges', debit_note_charges);

        let final_value = Number(this.state.charges_value) + Number(this.state.filterData.invoice_amount)
        console.log('this.state.charges_value', this.state.charges_value, this.state.filterData.invoice_amount);
        let data = {
            consignment_id: this.props.data.id,
            invoice_value: this.state.filterData.invoice_amount,
            total_charges: this.state.charges_value,
            final_value: final_value,
            prepared_by: user.id,
            status: this.state.filterData.status,                            //"Pending",
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

    async loadData() {

        let id = this.props.selected_data
        console.log('view incoming id', id)

        let res = await SPCServices.getAllDebitNoteByID(id)

        if (res.status === 200) {
            console.log('view incoming data', res)
            this.setState({
                data: res.data.view
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
                                                        label={this.state.data?.status ? `Debit Note Status: ${this.state.data?.status}` : "Debit Note Status: N/A"}
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
                                            <SubTitle title="Shipment No" />
                                            <AddTextInput
                                                // style={{color:'black'}}
                                                val={this.state.data?.Consignment?.ldcn_ref_no}
                                                text='LDCN Ref. No'
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
                                            <SubTitle title="LDCN Number" />
                                            <AddTextInput

                                                val={this.state.data?.Consignment?.wdn_no}
                                                text='LDCN Number' type='text' />
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

                                                val={dateParse(this.state.data?.Consignment?.ldcn_date)}
                                                text='LDCN Date' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="WHARF ref Number" />
                                            <AddTextInput

                                                val={this.state.data?.Consignment?.shipment_no}
                                                text='WHARF ref Number' type='text' />
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
                                            <SubTitle title="Indent Number" />
                                            <AddTextInput

                                                val={this.state.data?.Consignment?.indent_no}
                                                text='Indent Number' type='text' />
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
                                                val={this.state.data?.debit_note_sub_type}
                                                // getOptionLabel={(option) => option.name}
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
                                            <SubTitle title="Sample Approved By" />
                                            <AddTextInput
                                                // val={this.state.filterData?.sample_approved_by}

                                                text='Sample Approved By'

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
                                                // val={this.state.filterData?.sample_approved_date} 
                                                text='Sample Approved Date' />
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
                                                        <SubTitle title={"Amount in Currency ( " + this.state.data?.Consignment?.currency_type + " )"} />
                                                        <AddNumberInput


                                                            val={roundDecimal(this.state.data?.Consignment?.values_in_currency, 4)}
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
                                                            text='Enter Invoice Amount (LKR)' type='number' />
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


                                                            val={roundDecimal(this.state.data?.total_charges, 4)}
                                                            text='Enter Charges Amount' type='number' />
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


                                                            val={roundDecimal(this.state.data?.final_value, 4)}
                                                            text='Enter Total Amount' type='number' />
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
                                                    {this.state.data?.DebitNoteCharges
                                                        .filter(item => ['Service Charge', 'VAT', 'SSL', 'Other'].includes(item.TransactionType?.type))
                                                        .map((item, index) => (
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

                                                            />
                                                        </Grid>


                                                    </Grid>
                                                </Fragment>
                                                {/* ) : null} */}
                                            </LoonsCard>
                                        </Grid>
                                        {/* Submit and Cancel Button */}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </ValidatorForm>
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

export default withStyles(styleSheet)(DelailsView)
