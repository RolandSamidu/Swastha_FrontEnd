import React, { Component, Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Grid, CircularProgress, Typography, Card, Icon, Dialog, DialogTitle, DialogActions, Divider } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import { dateParse, includesArrayElements, roundDecimal } from 'utils'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import localStorageService from 'app/services/localStorageService'
import SPCServices from 'app/services/SPCServices'
import { Alert, AlertTitle, Chip } from '@mui/material'
import HospitalConfigServices from 'app/services/HospitalConfigServices'
import ConsignmentService from 'app/services/ConsignmentService'
import CloseIcon from '@material-ui/icons/Close';
import { ConfirmationDialog } from 'app/components'
import FinanceDocumentServices from 'app/services/FinanceDocumentServices'
import moment from 'moment'
import UndoIcon from '@mui/icons-material/Undo';

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

const AddNumberInput = ({
    type = 'number',
    valueDefined = false,
    states,
    index,
    name = '',
    onChange,
    val = '',
    text = 'Add',
    tail = null,
    disabled = true
}) => {
    let value = '' // Define a variable for the value

    if (valueDefined) {
        switch (index) {
            case 0:
                value = String(states.other_percentage_value)

                break
            case 1:
                value = String(states.service_percentage_value)

                break
            case 2:
                value = String(states.vat_percentage_value)

                break
            case 3:
                value = String(states.ssl_percentage_value)
                break
            default:
                value = String(val)
        }
    } else {
        value = String(val)
    }

    return (
        <TextValidator
            disabled={disabled}
            className="w-full"
            placeholder={`⊕ ${text}`}
            name={name}
            InputLabelProps={{
                shrink: false,
            }}

            value={value} // Use the value here
            type="number"
            variant="outlined"
            size="small"
            min={0}
            onChange={onChange}
        // validators={['minNumber:' + 0, 'required:' + true]}
        // errorMessages={[
        //     'Value should be > 0',
        //     'This field is required'
        // ]}
        />
    )
}

const AddInputDate = ({
    onChange = (date) => date,
    disableStatus = true,
    val = null,
    text = 'Add',
    tail = null,
}) => (
    <DatePicker
        className="w-full"
        value={val}
        disabled={disableStatus}
        //label="Date From"
        placeholder={`⊕ ${text}`}
        // minDate={new Date()}
        format="dd/MM/yyyy"
        //maxDate={new Date("2020-10-20")}
        // required={true}
        // errorMessages="this field is required"
        onChange={onChange}
    />
)

const AddTextInput = ({
    type = 'text',
    onChange,
    textStatus = true,
    val = '',
    text = 'Add',
    name = null,
    tail = null,
    style = {},
}) => (
    <TextValidator
        className=" w-full"
        placeholder={`⊕ ${text}`}
        // name="sr_no"
        InputLabelProps={{
            shrink: false,
        }}
        name={name}
        style={style}
        value={val}
        type="text"
        variant="outlined"
        size="small"
        disabled={textStatus}
        onChange={onChange}
        validators={['required']}
        errorMessages={['this field is required']}
    />
)
const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", text = "Add", tail = null, disabled = true }) => {
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => {
        setIsFocused(true);
    };
    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <Autocomplete
            disabled={disabled}
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
                </div>
            )}
        />);
}


class PendingDebitNoteDetailsView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            checked: false,
            role: null,
            buttonDisable: false,

            //Are You Want Save
            saveConfirmDialogBox: false,



            //data fields edit states

            editedDataFields: [],

            //Amount Values

            service_amount_value: 0,
            ssl_amount_value: 0,
            vat_amount_value: 0,
            ssl_amount_value: 0,

            //percentage change area

            ssl_element_no: 0,
            service_element_no: 0,
            vat_element_no: 0,
            other_element_no: 0,

            service_percentage_value: 0,
            vat_percentage_value: 0,
            ssl_percentage_value: 0,
            other_percentage_value: 0,

            service_percentage_id: '',
            vat_percentage_id: '',
            ssl_percentage_id: '',
            other_percentage_id: '',

            //data fields start

            shipment_no: null,
            supplier_id: null,
            ldcn_ref_no: null,
            ldcn_no: null,
            ldcn_date: null,
            invoice_no: null,
            order_no: null,
            po_no: null,
            hs_code: null,
            debit_note_no: null,
            createdAt: null,
            type: null,
            debit_note_sub_type: null,
            status: null,
            currency_type: null,
            currency_rate: null,
            values_in_currency: null,
            values_in_lkr: 10000,
            total_charges: null,
            final_value: null,
            remark: null,

            //data fields end

            itemList: [],
            // single_data:{},

            collapseButton: 0,
            userRoles: [],

            alert: false,
            message: '',
            severity: 'success',
            loaded: false,

            all_Suppliers: [],
            all_debit_note_type: [],
            all_debit_note_sub_type: [],
            transaction: [],
            isLoad: false,
            charges_value: null,

            additional_data: [],
            printLoading: false,
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
                { label: 'LKR' },
                { label: 'INR' },
                { label: 'USD' },
            ],

            dataListApproval: {
                debit_note_id: null,
                spc_approval_config_id: null,
                type: "Approved",
                approval_type: "Approved",
                approved_by: null,
                approval_user_type: null,
                remark: null,
                owner_id: null,
                sequence: null,
                status: "APPROVED"
            },

            dataListReject: {
                debit_note_id: null,
                spc_approval_config_id: null,
                type: "REJECTED",
                approval_type: "REJECTED",
                approved_by: null,
                approval_user_type: null,
                remark: null,
                owner_id: null,
                sequence: null,
                status: "REJECTED"
            },
            approvalData2: []

        }
    }

    getApprovalUserType(approvalData, approvalType) {
        const rejectedApproval = approvalData.find((e) => e.approval_type === approvalType);
        return rejectedApproval ? rejectedApproval.approval_user_type : "Unknown";
    }
    getApprovalRemark(approvalData, approvalType) {
        console.log("rejectedApproval", approvalData, approvalType)

        const rejectedApproval = approvalData.find((e) => e.approval_type === approvalType);
        console.log("rejectedApproval", rejectedApproval)
        return rejectedApproval ? rejectedApproval.remark : "Not Provided";
    }
    //close add defect  DialogBox 
    closeSaveConfirmDialogBox() {
        this.setState({
            saveConfirmDialogBox: false,
        })
    }

    //Open add defect  DialogBox
    openSaveConfirmDialogBox() {
        this.setState({
            saveConfirmDialogBox: true,
        })
    }

    numberInputOnChange = (event, no) => {

        const newValue = (event.target.value == "" || event.target.value == null) ? 0.00 : event.target.value
        console.log("Values", newValue)
        if (!newValue || (newValue[newValue.length - 1].match('[0-9]') && newValue[0].match('[0-9]'))) {
            switch (no) {
                case 0:
                    this.setState({
                        other_percentage_value: newValue
                    })
                    if (!this.state.editedDataFields.includes('other_percentage_value')) {
                        this.setState((prevState) => ({
                            editedDataFields: [...prevState.editedDataFields, 'other_percentage_value'],
                        }))
                    }
                    break
                case 1:
                    this.setState({
                        service_percentage_value: newValue
                    })
                    if (!this.state.editedDataFields.includes('service_percentage_value')) {
                        this.setState((prevState) => ({
                            editedDataFields: [...prevState.editedDataFields, 'service_percentage_value'],
                        }))
                    }
                    break
                case 2:
                    this.setState({
                        vat_percentage_value: newValue
                    })
                    if (!this.state.editedDataFields.includes('vat_percentage_value')) {
                        this.setState((prevState) => ({
                            editedDataFields: [...prevState.editedDataFields, 'vat_percentage_value'],
                        }))
                    }
                    break
                case 3:
                    this.setState({
                        ssl_percentage_value: newValue
                    })
                    if (!this.state.editedDataFields.includes('ssl_percentage_value')) {
                        this.setState((prevState) => ({
                            editedDataFields: [...prevState.editedDataFields, 'ssl_percentage_value'],
                        }))
                    }
                    break
            }
        }




    }

    delayedContentDisplay = () => {
        setTimeout(() => {
            this.setState({ showContent: true });
        }, 5000); // 1000 milliseconds = 1 second
    }

    editData = async () => {

        if (this.state.service_percentage_value !== null && this.state.service_percentage_value.trim() !== ''
            && this.state.other_percentage_value !== null && this.state.other_percentage_value.trim() !== ''
            && this.state.ssl_percentage_value !== null && this.state.ssl_percentage_value.trim() !== ''
            && this.state.vat_percentage_value !== null && this.state.vat_percentage_value.trim() !== '') {
            const promises = this.state.editedDataFields.map(async (stateName) => {

                let DebitNoteChargesId;
                let trans_id;
                let amount;

                switch (stateName) {
                    case 'service_percentage_value':
                        amount = roundDecimal(parseFloat(this.state.values_in_lkr * this.state.service_percentage_value / 100), 2)
                        DebitNoteChargesId = this.state.service_percentage_id;
                        trans_id = this.state.service_percentage_trans_id;

                        break;
                    case 'vat_percentage_value':
                        amount = roundDecimal(((((parseFloat(this.state.values_in_lkr * this.state.service_percentage_value)) / 100) + parseFloat(this.state.values_in_lkr)) * (parseFloat(this.state.vat_percentage_value) / 100)), 4)
                        DebitNoteChargesId = this.state.vat_percentage_id;
                        trans_id = this.state.vat_percentage_trans_id;
                        break;
                    case 'ssl_percentage_value':
                        amount = roundDecimal(parseFloat((this.state.values_in_lkr * this.state.ssl_percentage_value) / 100), 2)

                        DebitNoteChargesId = this.state.ssl_percentage_id;
                        trans_id = this.state.ssl_percentage_trans_id;
                        break;
                    case 'other_percentage_value':
                        amount = roundDecimal(this.state.other_percentage_value, 2)
                        DebitNoteChargesId = this.state.other_percentage_id;
                        trans_id = this.state.other_percentage_trans_id
                        break;
                    // Add the relevant cases for other fields
                }
                let updateData = { percentage_or_value: parseFloat(this.state[stateName]), debit_note_id: this.props.selected_data, transaction_type_id: trans_id, amount: amount };
                console.log("updated data", updateData)

                return SPCServices.changeDebitNoteChargesByID(DebitNoteChargesId, updateData)
                    .then((res) => {
                        return res.status;
                    })
                    .catch((error) => {
                        console.error('API request error:', error);
                        return 500; // Simulate a failure status code (you can adjust this as needed)
                    });


            });

            let total_charges = parseFloat(this.state.values_in_lkr * this.state.service_percentage_value / 100) +
                parseFloat((this.state.values_in_lkr * this.state.ssl_percentage_value) / 100) +
                ((((parseFloat(this.state.values_in_lkr * this.state.service_percentage_value)) / 100) + parseFloat(this.state.values_in_lkr)) * (parseFloat(this.state.vat_percentage_value) / 100)) +
                parseFloat(this.state.other_percentage_value)


            let final_value = total_charges + parseFloat(this.state.values_in_lkr)



            let data = {
                total_charges: roundDecimal(total_charges, 4),
                final_value: roundDecimal(final_value, 4),
                remark: this.state.data?.remark,
                debit_note_sub_type: this.state.data?.debit_note_sub_type
            }
            console.log("ID", this.props.selected_data)
            let res = await SPCServices.fetchNewChargesDebitNote(this.props.selected_data, data)
            console.log("res", res)
            try {
                const results = await Promise.all(promises);

                // Check the results for success or error
                const successCount = results.filter((status) => status === 200).length;

                if (successCount === this.state.editedDataFields.length) {
                    // All requests were successful
                    this.setState({
                        alert: true,
                        message: 'Data Updated Successfully!',
                        severity: 'success',
                    }, () => {
                        if (this.state.userRoles.includes("SPC MA")) {
                            this.delayedContentDisplay();

                            setTimeout(() => {
                                this.props.handleClose()
                            }, 1000);

                        }
                    });




                } else {
                    // Some requests failed
                    this.setState({
                        alert: true,
                        message: 'Data Updated Failed!',
                        severity: 'error',
                    });

                    this.delayedContentDisplay();



                }


            } catch (error) {
                // Handle any errors that may occur during the API requests
                console.error('Promise.all error:', error);
            }
        } else {

            this.setState({
                alert: true,
                message: 'Values Are Empty Or No Changes!',
                severity: 'error',
            });
        }
    }






    async saveDebitNote() {
        this.setState({
            conformation_dialog: false,
        })

        var user = await localStorageService.getItem('userInfo')

        let newDataArray1 = this.state.transaction
        let newDataArray2 = this.state.service_val
        let newDataArray3 = this.state.vat_val

        const finalcombinedObject = [
            ...newDataArray1,
            ...newDataArray2,
            ...newDataArray3,
        ]

        console.log('user', user)

        const debit_note_charges = finalcombinedObject.map((item) => {
            return {
                transaction_type_id: item.transaction_type_id,
                percentage_or_value: item.percentage_or_value,
                value: item.value,
            }
        })

        let final_value =
            Number(this.state.charges_value) +
            Number(this.state.filterData.invoice_amount)
        console.log(
            'this.state.charges_value',
            this.state.charges_value,
            this.state.filterData.invoice_amount
        )
        let data = {
            consignment_id: this.props.data.id,
            invoice_value: this.state.filterData.invoice_amount,
            total_charges: this.state.charges_value,
            final_value: final_value,
            prepared_by: user.id,
            status: this.state.filterData.status, //"Pending",
            remark: this.state.filterData.remark,
            debit_note_type: this.state.filterData.debit_note_type,
            debit_note_sub_type: this.state.filterData.debit_note_sub_type,
            debit_note_charges: debit_note_charges,
        }

        let res = await SPCServices.createDebitNote(data)

        if (res.status == 200 || res.status == 201) {
            console.log('ok')
            this.setState(
                {
                    message: 'Debit Note Create Successfully',
                    severity: 'success',
                    alert: true,
                },
                window.location.reload()
                ,
                () => {
                    console.log('setState callback executed')
                    this.props.handleClose()
                }
            )
        } else {
            console.log('no')
            this.setState({
                message: 'Debit Note Update Unsuccessful',
                severity: 'error',
                alert: true,
            })
            window.location.reload()
        }
    }

    findArrayElementNumbers = (array, types) => {
        let elementNumbers;

        array.forEach((item, index) => {
            const transactionType = item.TransactionType ? item.TransactionType.type : null;

            if (transactionType && types.includes(transactionType)) {
                elementNumbers = index;
            }
        });

        return elementNumbers;
    };

    async loadData() {
        this.setState({
            loaded: false,
            approvalDaataLoad: false
        })



        let id = this.props.selected_data
        console.log('view incoming id', id)

        let res = await SPCServices.getAllDebitNoteByID(id)

        if (res.status === 200) {
            console.log('view incoming data', res.data.view)
            //set incoming data to states

            let name
            if (res.data.view.Consignment.supplier_id) {
                let SupRes = await HospitalConfigServices.getAllSupplierByID(res.data.view.Consignment.supplier_id)
                name = SupRes.data.view.name
            } else {
                name = ""
            }


            res.data.view = {

                ...res.data.view,
                Consignment: {
                    ...res.data.view.Consignment,
                    supplier_name: name
                },



            }
            if (res.data.view.status) {
                this.setState({
                    status: res.data.view.status,
                }, () => {
                    this.loadDebitNoteApprovalData(id)

                    this.getGRNDetails(res.data.view.Consignment.id)

                })
            }



            if (res.data.view.DebitNoteCharges) {

                this.setState({

                    ssl_element_no: this.findArrayElementNumbers(res.data.view.DebitNoteCharges, 'SSL'),
                    other_element_no: this.findArrayElementNumbers(res.data.view.DebitNoteCharges, 'Other'),
                    service_element_no: this.findArrayElementNumbers(res.data.view.DebitNoteCharges, 'Service Charge'),
                    vat_element_no: this.findArrayElementNumbers(res.data.view.DebitNoteCharges, 'VAT'),
                })


                this.setState({


                    other_percentage_value: res.data.view.DebitNoteCharges[this.state.other_element_no].percentage_or_value,
                    other_percentage_id: res.data.view.DebitNoteCharges[this.state.other_element_no].id,
                    other_percentage_trans_id: res.data.view.DebitNoteCharges[this.state.other_element_no].transaction_type_id,

                    service_percentage_value: res.data.view.DebitNoteCharges[this.state.service_element_no].percentage_or_value,
                    service_percentage_id: res.data.view.DebitNoteCharges[this.state.service_element_no].id,
                    service_percentage_trans_id: res.data.view.DebitNoteCharges[this.state.service_element_no].transaction_type_id,

                    vat_percentage_value: res.data.view.DebitNoteCharges[this.state.vat_element_no].percentage_or_value,
                    vat_percentage_id: res.data.view.DebitNoteCharges[this.state.vat_element_no].id,
                    vat_percentage_trans_id: res.data.view.DebitNoteCharges[this.state.vat_element_no].transaction_type_id,

                    ssl_percentage_value: res.data.view.DebitNoteCharges[this.state.ssl_element_no].percentage_or_value,
                    ssl_percentage_id: res.data.view.DebitNoteCharges[this.state.ssl_element_no].id,
                    ssl_percentage_trans_id: res.data.view.DebitNoteCharges[this.state.ssl_element_no].transaction_type_id,

                })
            }

            if (res.data.view.Consignment.shipment_no) {
                this.setState({
                    shipment_no: res.data.view.Consignment.shipment_no,
                })
            }
            if (res.data.view.Consignment.supplier_id) {
                this.setState({
                    supplier_id: res.data.view.Consignment.supplier_name,
                })
            }
            if (res.data.view.Consignment.ldcn_ref_no) {
                this.setState({
                    ldcn_ref_no: res.data.view.Consignment.ldcn_ref_no,
                })
            }
            if (res.data.view.Consignment.wdn_no) {
                this.setState({
                    ldcn_no: res.data.view.Consignment.wdn_no,
                })
            }
            if (res.data.view.Consignment.ldcn_date) {
                this.setState({
                    ldcn_date: dateParse(res.data.view.Consignment.ldcn_date),
                })
            }
            if (res.data.view.Consignment.invoice_no) {
                this.setState({
                    invoice_no: res.data.view.Consignment.invoice_no,
                })
            }
            if (res.data.view.Consignment.order_no) {
                this.setState({
                    order_no: res.data.view.Consignment.order_no,
                })
            }
            if (res.data.view.Consignment.po_no) {
                this.setState({
                    po_no: res.data.view.Consignment.po_no,
                })
            }
            if (res.data.view.Consignment.hs_code) {
                this.setState({
                    hs_code: res.data.view.Consignment.hs_code,
                })
            }
            if (res.data.view.debit_note_no) {
                this.setState({
                    debit_note_no: res.data.view.debit_note_no,
                })
            }
            if (res.data.view.Consignment.createdAt) {
                this.setState({
                    createdAt: res.data.view.Consignment.createdAt,
                })
            }
            if (res.data.view.Consignment.indent_no) {
                this.setState({
                    indent_no: res.data.view.Consignment.indent_no,
                })
            }
            if (res.data.view.Consignment.currency) {
                this.setState({
                    currency_type: res.data.view.Consignment.currency,
                })
            }
            if (res.data.view.Consignment.exchange_rate) {
                this.setState({
                    exchange_rate: res.data.view.Consignment.exchange_rate,
                })
            }
            if (res.data.view.Consignment.values_in_currency) {
                this.setState({
                    values_in_currency: res.data.view.Consignment.values_in_currency,
                })
            }

            if (res.data.view.Consignment.values_in_lkr) {
                this.setState({
                    values_in_lkr: res.data.view.Consignment.values_in_lkr,
                })
            }






            this.setState({
                data: res.data.view,
                loaded: true,
            })



        }
    }
    async loadDebitNoteApprovalData(note_no) {

        console.log("debit note approve calling", note_no)

        let params = {
            debit_note_id: note_no,
            // approval_user_type: this.state.userRoles[0]
        }
        let res = await ConsignmentService.getDabitNoteApproval(params)

        if (res.status === 200) {
            console.log('checking aprival data', res)
            let filterdData = []
            let filterData2 = []


            filterdData = res.data.view.data.filter((index) => this.state.userRoles[0] === index?.approval_user_type).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).filter(e => e.status == "Pending");
            filterData2 = res.data.view.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).filter(e => e.status == "APPROVED").sort((a, b) => b.sequence - a.sequence);

            this.setState({
                approvalData: filterdData,
                approvalData2: filterData2,
                filterDataforRejection: res.data?.view?.data,
                approvalDaataLoad: true
            })
            console.log('checking aprival filterdData', filterdData)
        }

    }

    async getGRNDetails(id) {

        let params = {
            consignment_id: [id],
            status: [
                "APPROVED PARTIALLY COMPLETED",
                "APPROVED COMPLETED"
            ]
        }

        let res = await ConsignmentService.getGRN(params)

        if (res.status == 200) {

            this.setState({
                grnDetails: res.data.view.data.length > 0 ? res.data.view.data : []
            })

        } else {
            this.setState({
                grnDetails: []
            })

        }

        console.log("GRN Respond", res)
    }

    async getDebitNoteSubType() {

        let res = await ConsignmentService.getDabitNoteSubTypes()

        if (res.status === 200) {
            console.log('debit note type: ', res);
            this.setState({
                all_debit_note_sub_type: res.data.view.data
            })
        }
    }

    async componentDidMount() {
        console.log('sequance', this.props.data)
        let role = await localStorageService.getItem('userInfo')?.roles
        this.setState({
            userRoles: role,
        })
        this.loadData()
        this.getDebitNoteSubType()
        console.log("User Roles", this.state.userRoles)
    }


    handleApproved = async () => {

        let user = localStorageService.getItem("userInfo")
        let data = this.state.approvalData[0]
        console.log('checking aprival data ---', data)


        let params = this.state.dataListApproval
        params.debit_note_id = data.debit_note_id
        params.spc_approval_config_id = data.spc_approval_config_id
        params.approval_user_type = data.approval_user_type
        params.owner_id = data.owner_id
        params.sequence = data.sequence
        params.approved_by = user.id
        params.remark = this.state.remark



        let res = await ConsignmentService.createApproved(data.id, params)

        if (res.status == 201 || res.status == 200) {
            this.setState({
                alert: true,
                message: 'Approval Process Successfull',
                severity: 'success',
                submitting: false,
                openApprove: false
            }, () => {

                setTimeout(() => {
                    this.props.handleClose()
                }, 1000);

            })


        } else {
            console.log("errorr", res.response.data.error)
            this.setState({
                alert: true,
                message: res?.response?.data?.error,
                severity: 'error',
                submitting: false,
                openApprove: false
            })
        }
    }

    handleReject = async () => {

        let user = localStorageService.getItem("userInfo")

        let data = this.state.approvalData[0]

        let params = this.state.dataListReject
        params.debit_note_id = data.debit_note_id
        params.spc_approval_config_id = data.spc_approval_config_id
        params.approval_user_type = data.approval_user_type
        params.owner_id = data.owner_id
        params.sequence = data.sequence
        params.approved_by = user.id
        params.remark = this.state.remark

        console.log('checking aprival filterdData', params)



        if (this.state.remark) {

            let res = await ConsignmentService.createApproved(data.id, params)
            if (res.status == 201 || res.status == 200) {
                this.setState({
                    alert: true,
                    message: 'Reject Process Successfull',
                    severity: 'success',
                    submitting: false,
                    openReject: false
                }, () => {
                    setTimeout(() => {
                        this.props.handleClose()
                    }, 1000);
                })

            } else {
                // console.log("errorr", res.response.data.error)
                this.setState({
                    alert: true,
                    message: res?.response?.data?.error,
                    severity: 'error',
                    submitting: false,
                    openReject: false
                })
            }
        } else {
            this.setState({
                alert: true,
                message: "Reject reason is required",
                severity: 'error',
                openReject: false
            })
        }


    }
    async handleResubmit() {

        var user = await localStorageService.getItem('userInfo')

        let formData = this.state.data

        console.log("formdata", formData)


        // console.log('combinedObjectdebit_note_charges', debit_note_charges);

        // let final_value = Number(this.state.charges_value) + Number(this.state.filterData.invoice_amount)
        console.log('this.state.charges_value', this.state.charges_value, this.state.filterData.invoice_amount);
        let data = {
            invoice_value: formData.invoice_amount,
            total_charges: formData.total_charges,
            final_value: formData.final_value,
            prepared_by: user.id,
            status: "REJECTED",

        }
        await SPCServices.fetchNewChargesDebitNote(this.props.selected_data, data)


        let res = await SPCServices.editDebitNoteApproval({ debit_note_id: formData.id })



        if (res.status == 200 || res.status == 201) {
            console.log('ok');
            this.setState({
                message: "Debit Note Resubmitted Successfully",
                severity: 'success',
                alert: true
            }, () => {
                console.log("setState callback executed")
                setTimeout(() => {
                    this.props.handleClose()
                }, 1000);

            })

        } else {
            console.log('no');
            this.setState({
                message: "Debit Note Resubmitt Unsuccessful",
                severity: 'error',
                alert: true
            })
        }

    }
    handleCancel = async () => {
        const id = this.props.selected_data
        try {
            let data = {
                status: "CANCELED",
            }
            let consignment_res = await SPCServices.changeDebitNoteStatus(data, id)
            if (consignment_res.status === 200) {
                this.setState({
                    severity: "success",
                    alert: true,
                    message: "SPC Debit Note was Cancelled",
                }, () => {
                    setTimeout(() => {
                        this.props.handleClose()
                    }, 1000);
                })

            } else {
                this.setState({
                    severity: "error",
                    alert: true,
                    message: "SPC Debit Note Cancelled was Unsuccessfull",
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


    printData = async () => {
        try {
            let params = {
                refference_id: this.props.selected_data,
                reference_type: ['SPC LC Debit Note'],
                is_active: true,
            };

            let res_data = await FinanceDocumentServices.getFinacneDocuments(params);
            console.log("Pdf", res_data.data.view.data[0]?.template);

            var searchString = 'catch_and_edit';
            var inputString = res_data.data.view.data[0]?.template;

            const currentTime = moment().format('YYYY-MM-DD hh:mm A');
            var outputString = inputString.replace(searchString, currentTime);

            // Create a new hidden iframe
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            // Write the modified template content to the iframe
            iframe.contentDocument.write(outputString);
            iframe.contentDocument.close();

            // Wait for the iframe to load and trigger the print
            iframe.onload = () => {
                setTimeout(() => {
                    iframe.contentWindow.print();
                    document.body.removeChild(iframe); // Remove the iframe after printing
                }, 1000); // Adjust the delay as needed
            };

            if (res_data.status === 200) {
                this.setState({
                    dabitNote: outputString,
                    debitNoteView: true,
                });
            }
        } catch (error) {
            console.error('Error fetching or printing:', error);
        }
    };

    async generateOriginal() {

        this.setState({
            printLoading: true
        })
        let allGrnData = []
        if (this.state.grnDetails.length > 0) {
            this.state.grnDetails.map(e => {

                let obj =
                {
                    "grn_no": e.grn_no,
                    "grn_date_time": e.createdAt
                }
                allGrnData.push(obj)


            })
        } else {
            allGrnData = []

        }



        let data = {
            grn_data: allGrnData,
            print_type: "Original"


        }

        let res = await SPCServices.fetchNewChargesDebitNote(this.props.selected_data, data)

        if (res.status == 200) {

            console.log("res oringi", res)
            this.setState({
                printLoading: false
            }, () => {
                this.printData()
            })
        }

    }


    render() {

        let editOptionEnable = (((this.state.data?.status === 'Pending' || this.state.data?.status === 'RESUBMITTED') && (this.state.userRoles.includes("SPC Supervisor") || this.state.userRoles.includes("SPC MA"))) ||
            ((this.state.data?.status === 'SUPERVISOR APPROVED' || this.state.data?.status === 'APPROVED') && this.state.userRoles.includes("SPC Manager"))
            || (this.state.data?.status === 'SUPERVISOR APPROVED' && (this.state.userRoles.includes("SPC Supervisor")))
            || ((this.state.data?.status === 'REJECTED' || this.state.data?.status === 'RESUBMITTED') && (this.state.userRoles.includes("SPC MA"))) ? true : false
        )


        return (
            <>
                {this.state.loaded ? (
                    <Fragment>
                        {/* Filtr Section */}
                        {/* <div className="pb-8 pt-2"> */}
                        {/* Filtr Section */}
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => {
                                this.editData()
                            }}
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid container spacing={2} direction="row">
                                {/* Filter Section */}
                                <Grid
                                    item
                                    xs={12}
                                    className="mb-5"
                                    sm={12}
                                    md={12}
                                    lg={12}
                                >
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
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection:
                                                                'row',
                                                        }}
                                                    >
                                                        <div
                                                            style={{ flex: 1 }}
                                                        >
                                                            {/* <Typography variant="h6" className="font-semibold">Shipping Details</Typography> */}
                                                        </div>
                                                        <div>
                                                            <Chip
                                                                size="small"
                                                                label={
                                                                    this.state
                                                                        .data
                                                                        ?.status
                                                                        ? `Status: ${this.state.data?.status}`
                                                                        : 'Status: N/A'
                                                                }
                                                                color={
                                                                    this.state
                                                                        .data
                                                                        ?.status ===
                                                                        'REJECTED'
                                                                        ? 'error'
                                                                        : 'success'
                                                                }
                                                                variant="outlined"
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* <Divider className='mt-2' /> */}
                                                </Grid>
                                                {
                                                    this.state.approvalDaataLoad ?

                                                        this.state.data?.status == "REJECTED" &&
                                                        <Grid
                                                            className=" w-full"
                                                            item
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            xs={12}
                                                        >

                                                            <Alert severity="warning">
                                                                <AlertTitle>
                                                                    {this.state.filterDataforRejection
                                                                        ? `This debit note was rejected by ${this.getApprovalUserType(this.state.filterDataforRejection, "REJECTED")}`
                                                                        : "Approval Data Not Available"}
                                                                </AlertTitle>
                                                                <SubTitle title="Reason for Reject" />
                                                                <Typography className="my-3 text-12 font-medium">
                                                                    {this.state.filterDataforRejection
                                                                        ? this.getApprovalRemark(this.state.filterDataforRejection, "REJECTED") || "No remarks provided"
                                                                        : "No approval data available"}
                                                                </Typography>

                                                            </Alert>

                                                        </Grid> :
                                                        <Grid item xs={12}>

                                                            <CircularProgress />

                                                        </Grid>

                                                }
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
                                                        onChange={
                                                            this
                                                                .dataFieldOnChange
                                                        }
                                                        val={
                                                            this.state
                                                                .shipment_no
                                                        }
                                                        name="shipment_no"
                                                        text="WHARF ref Number"
                                                        type="text"
                                                    />
                                                </Grid> */}

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
                                                        onChange={
                                                            this
                                                                .dataFieldOnChange
                                                        }
                                                        val={this.state.ldcn_no}
                                                        name="ldcn_no"
                                                        text="LDCN Number"
                                                        type="text"
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
                                                    <SubTitle title="LDCN Date" />
                                                    <AddInputDate
                                                        //val={dateParse(this.state.data?.Consignment?.ldcn_date)}
                                                        val={
                                                            this.state.ldcn_date
                                                        }
                                                        text="LDCN Date"
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
                                                    <SubTitle title="Indent No" />
                                                    <AddTextInput
                                                        onChange={
                                                            this
                                                                .dataFieldOnChange
                                                        }
                                                        // style={{color:'black'}}
                                                        val={
                                                            this.state
                                                                .indent_no
                                                        }
                                                        name="indent_no"
                                                        text="Indent No"
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
                                                    <SubTitle title="Shipment No" />
                                                    <AddTextInput
                                                        onChange={
                                                            this
                                                                .dataFieldOnChange
                                                        }
                                                        // style={{color:'black'}}
                                                        val={
                                                            this.state
                                                                .ldcn_ref_no
                                                        }
                                                        name="ldcn_ref_no"
                                                        text="LDCN Ref. No"
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
                                                    <SubTitle title="Supplier" />
                                                    <TextValidator
                                                        disabled={true}
                                                        placeholder="Supplier"
                                                        value={
                                                            this.state
                                                                .supplier_id
                                                        }
                                                        onChange={
                                                            this
                                                                .dataFieldOnChange
                                                        }
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
                                                        onChange={
                                                            this
                                                                .dataFieldOnChange
                                                        }
                                                        name="invoice_no"
                                                        val={
                                                            this.state
                                                                .invoice_no
                                                        }
                                                        text="Invoice No"
                                                        type="text"
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
                                                    <SubTitle title="Order List Number" />
                                                    <AddTextInput
                                                        onChange={
                                                            this
                                                                .dataFieldOnChange
                                                        }
                                                        val={
                                                            this.state.order_no
                                                        }
                                                        name="order_no"
                                                        text="Order List Number"
                                                        type="text"
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
                                                    <SubTitle title="PO Number" />
                                                    <AddTextInput
                                                        onChange={
                                                            this
                                                                .dataFieldOnChange
                                                        }
                                                        name="po_no"
                                                        val={this.state.po_no}
                                                        text="PO Number"
                                                        type="text"
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
                                                    <SubTitle title="HS Code" />
                                                    <AddTextInput
                                                        onChange={
                                                            this
                                                                .dataFieldOnChange
                                                        }
                                                        name="hs_code"
                                                        val={this.state.hs_code}
                                                        text="HS Code"
                                                        type="text"
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
                                                    <SubTitle title="GRN Number" />
                                                    <AddTextInput
                                                        name="grn_no"
                                                        val={
                                                            this.state
                                                                .filterData
                                                                ?.grn_no
                                                        }
                                                        text="GRN No"
                                                        type="text"
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
                                                    <SubTitle title="Debit Note Number" />
                                                    <AddTextInput
                                                        onChange={
                                                            this
                                                                .dataFieldOnChange
                                                        }
                                                        name="debit_note_no"
                                                        val={
                                                            this.state
                                                                .debit_note_no
                                                        }
                                                        text="Debit Note Number"
                                                        type="text"
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
                                                    <SubTitle title="Debit Note Date" />
                                                    <AddInputDate
                                                        val={dateParse(
                                                            this.state.createdAt
                                                        )}
                                                        text="Debit Note Date"
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
                                                    <SubTitle title="Debit Note Type" />
                                                    <AddTextInput
                                                        name="type"
                                                        onChange={
                                                            this
                                                                .dataFieldOnChange
                                                        }
                                                        val={this.state.data?.type ?? ""}
                                                        text="Debit Note Type"
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
                                                        disabled={!editOptionEnable}
                                                        options={this.state.all_debit_note_sub_type.filter(el => el.DebitNoteType.name == this.state.data?.debit_note_type)}
                                                        val={this.state.data?.debit_note_sub_type}
                                                        getOptionLabel={(option) => option.name}
                                                        text='Enter Debit Note Sub Type'
                                                        onChange={(e, value) => {
                                                            const newFormData = {
                                                                ...this.state.data,
                                                                debit_note_sub_type: value.name,
                                                                debit_note_subtype_id: value.id,
                                                            };
                                                            this.setState({ data: newFormData });
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
                                                    <AddTextInput
                                                        val={
                                                            this.state
                                                                .filterData
                                                                ?.sample_approved_by
                                                        }
                                                        text="Sample Approved By"
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
                                                        val={
                                                            this.state
                                                                .filterData
                                                                ?.sample_approved_date
                                                        }
                                                        text="Sample Approved Date"
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
                                                            this.state.status
                                                        }
                                                    />
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <Card>
                                                        <Grid
                                                            container
                                                            spacing={2}
                                                        >
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
                                                                    disabled
                                                                    variant="outlined"
                                                                    size="small"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .currency_type
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
                                                                    val={
                                                                        this
                                                                            .state
                                                                            .currency_rate
                                                                    }
                                                                    text="Exchange Rate"
                                                                    type="number"
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        <Grid
                                                            container
                                                            spacing={2}
                                                        >
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={3}
                                                                md={4}
                                                                sm={6}
                                                                xs={12}
                                                            >
                                                                <SubTitle
                                                                    title={
                                                                        'Amount in Currency ( ' +
                                                                        this
                                                                            .state
                                                                            .currency_type +
                                                                        ' )'
                                                                    }
                                                                />
                                                                <AddNumberInput
                                                                    //val={roundDecimal(this.state.data?.Consignment?.values_in_currency , 4)}
                                                                    val={
                                                                        this
                                                                            .state
                                                                            .values_in_currency
                                                                    }
                                                                    text="Amount"
                                                                    type="number"
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
                                                                <SubTitle title="Invoice Amount (LKR)" />
                                                                <AddNumberInput
                                                                    //val={roundDecimal(this.state.data?.Consignment?.values_in_lkr, 4)}

                                                                    val={roundDecimal(this
                                                                        .state
                                                                        .values_in_lkr, 2)

                                                                    }
                                                                    text="Enter Invoice Amount (LKR)"
                                                                    type="number"
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
                                                                <SubTitle title="Charges Amount" />
                                                                <AddNumberInput
                                                                    //val={roundDecimal(this.state.data?.total_charges, 4)}
                                                                    val={roundDecimal((parseFloat(this.state.values_in_lkr * this.state.service_percentage_value / 100) +
                                                                        parseFloat((this.state.values_in_lkr * this.state.ssl_percentage_value) / 100) +
                                                                        ((((parseFloat(this.state.values_in_lkr * this.state.service_percentage_value)) / 100) + parseFloat(this.state.values_in_lkr)) * (parseFloat(this.state.vat_percentage_value) / 100)) +
                                                                        parseFloat(this.state.other_percentage_value)), 2)


                                                                    }
                                                                    text="Enter Charges Amount"
                                                                    type="number"
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
                                                                <SubTitle title="Total Amount" />
                                                                <AddNumberInput
                                                                    val={

                                                                        roundDecimal((parseFloat(this.state.values_in_lkr * this.state.service_percentage_value / 100) +
                                                                            parseFloat((this.state.values_in_lkr * this.state.ssl_percentage_value) / 100) +
                                                                            ((((parseFloat(this.state.values_in_lkr * this.state.service_percentage_value)) / 100) + parseFloat(this.state.values_in_lkr)) * (parseFloat(this.state.vat_percentage_value) / 100)) +
                                                                            parseFloat(this.state.other_percentage_value) +
                                                                            parseFloat(this.state.values_in_lkr)), 2)



                                                                    }
                                                                    //val={roundDecimal(this.state.data?.final_value, 4)}
                                                                    text="Enter Total Amount"
                                                                    type="number"
                                                                />
                                                            </Grid>
                                                        </Grid>

                                                        <Fragment>
                                                            <Grid
                                                                container
                                                                spacing={2}
                                                                className="mt-5"
                                                            >
                                                                <Grid
                                                                    className=" w-full"
                                                                    item
                                                                    lg={6}
                                                                    md={8}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            display:
                                                                                'flex',
                                                                            flexDirection:
                                                                                'row',
                                                                            alignItems:
                                                                                'center',
                                                                            height: '40px',
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                flex: 1,
                                                                                textAlign:
                                                                                    'center',
                                                                            }}
                                                                        >
                                                                            <SubTitle title="Charges" />
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                flex: 1,
                                                                                textAlign:
                                                                                    'center',
                                                                            }}
                                                                        >
                                                                            <SubTitle title="Percentage Rate(%)" />
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                flex: 1,
                                                                                textAlign:
                                                                                    'center',
                                                                            }}
                                                                        >
                                                                            <SubTitle title="Amount (LKR)" />
                                                                        </div>
                                                                    </div>
                                                                </Grid>
                                                            </Grid>

                                                            <Fragment key={0}>
                                                                <Grid container spacing={2}>
                                                                    <Grid className="w-full" item lg={6} md={8} sm={12} xs={12}>
                                                                        <div style={{
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            alignItems: 'center',
                                                                            height: '40px',
                                                                        }}>
                                                                            <div style={{ flex: 1 }}>
                                                                                <SubTitle title="Service Charge" />
                                                                            </div>
                                                                            <div style={{ flex: 1 }} className="mx-2">
                                                                                <AddNumberInput
                                                                                    disabled={!editOptionEnable}
                                                                                    onChange={e => this.numberInputOnChange(e, 1)}
                                                                                    states={this.state}
                                                                                    val={this.state.service_percentage_value}
                                                                                    valueDefined={true}
                                                                                    index={1}
                                                                                    text="Service Percentage"
                                                                                    type="number"
                                                                                />
                                                                            </div>
                                                                            <div style={{ flex: 1 }} className="mx-2">
                                                                                <TextValidator
                                                                                    size="small"
                                                                                    disabled
                                                                                    value={roundDecimal(parseFloat(this.state.values_in_lkr * this.state.service_percentage_value / 100), 2)}
                                                                                    text="Service Amount"
                                                                                    variant="outlined"
                                                                                    type="number"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </Grid>
                                                                </Grid>
                                                            </Fragment>

                                                            <Fragment key={1}>
                                                                <Grid container spacing={2}>
                                                                    <Grid className="w-full" item lg={6} md={8} sm={12} xs={12}>
                                                                        <div style={{
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            alignItems: 'center',
                                                                            height: '40px',
                                                                        }}>
                                                                            <div style={{ flex: 1 }}>
                                                                                <SubTitle title="SSL" />
                                                                            </div>
                                                                            <div style={{ flex: 1 }} className="mx-2">
                                                                                <AddNumberInput
                                                                                    disabled={!editOptionEnable}
                                                                                    onChange={e => this.numberInputOnChange(e, 3)}
                                                                                    states={this.state}
                                                                                    val={parseFloat(this.state.ssl_percentage_value)}
                                                                                    valueDefined={true}
                                                                                    index={3}
                                                                                    text="Service Percentage"
                                                                                    type="number"
                                                                                />
                                                                            </div>
                                                                            <div style={{ flex: 1 }} className="mx-2">
                                                                                <TextValidator
                                                                                    size="small"
                                                                                    disabled
                                                                                    value={roundDecimal(parseFloat((this.state.values_in_lkr * this.state.ssl_percentage_value) / 100), 2)}
                                                                                    text="SSL Amount"
                                                                                    variant="outlined"
                                                                                    type="number"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </Grid>
                                                                </Grid>
                                                            </Fragment>

                                                            <Fragment key={2}>
                                                                <Grid container spacing={2}>
                                                                    <Grid className="w-full" item lg={6} md={8} sm={12} xs={12}>
                                                                        <div style={{
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            alignItems: 'center',
                                                                            height: '40px',
                                                                        }}>
                                                                            <div style={{ flex: 1 }}>
                                                                                <SubTitle title="VAT" />
                                                                            </div>
                                                                            <div style={{ flex: 1 }} className="mx-2">
                                                                                <AddNumberInput
                                                                                    disabled={!editOptionEnable}
                                                                                    onChange={e => this.numberInputOnChange(e, 2)}
                                                                                    states={this.state}
                                                                                    val={this.state.vat_percentage_value}
                                                                                    valueDefined={true}
                                                                                    index={2}
                                                                                    text="VAT Percentage"
                                                                                    type="number"
                                                                                />
                                                                            </div>
                                                                            {console.log(this.state.values_in_lkr, this.state.service_percentage_value, this.state.vat_percentage_value)}

                                                                            {/* ((((this.state.values_in_lkr * this.state.service_percentage_value) / 100) + this.state.values_in_lkr) * (this.state.vat_percentage_value) / 100) */}
                                                                            <div style={{ flex: 1 }} className="mx-2">
                                                                                <TextValidator
                                                                                    size="small"
                                                                                    disabled
                                                                                    value={roundDecimal(((((parseFloat(this.state.values_in_lkr * this.state.service_percentage_value)) / 100) + parseFloat(this.state.values_in_lkr)) * (parseFloat(this.state.vat_percentage_value) / 100)), 4)}
                                                                                    text="VAT Amount"
                                                                                    variant="outlined"
                                                                                    type="number"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </Grid>
                                                                </Grid>
                                                            </Fragment>

                                                            <Fragment key={3}>
                                                                <Grid container spacing={2}>
                                                                    <Grid className="w-full" item lg={6} md={8} sm={12} xs={12}>
                                                                        <div style={{
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            alignItems: 'center',
                                                                            height: '40px',
                                                                        }}>
                                                                            <div style={{ flex: 1 }} >
                                                                                <SubTitle title="Other" />
                                                                            </div>
                                                                            <div style={{ flex: 1 }} className='mx-2'>
                                                                                <TextValidator
                                                                                    style={{
                                                                                        display: 'none'
                                                                                    }}
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                />
                                                                            </div>
                                                                            <div style={{ flex: 1 }} className="mx-2 ">
                                                                                <TextValidator
                                                                                    disabled={!editOptionEnable}
                                                                                    onChange={e => this.numberInputOnChange(e, 0)}
                                                                                    size="small"
                                                                                    value={this.state.other_percentage_value}
                                                                                    text="Other Amount"
                                                                                    variant="outlined"
                                                                                    type="number"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </Grid>
                                                                </Grid>
                                                            </Fragment>

                                                            <Grid
                                                                container
                                                                spacing={2}
                                                            >
                                                                <Grid className=" w-full" item lg={6} md={8} sm={12} xs={12} >
                                                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '40px', }}
                                                                    >
                                                                        <div

                                                                            style={{
                                                                                flex: 1,
                                                                            }}
                                                                        >
                                                                            <SubTitle title="Total Charges" />
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                flex: 1,
                                                                            }}
                                                                            className="mx-2"
                                                                        ></div>
                                                                        <div
                                                                            style={{
                                                                                flex: 1,
                                                                            }}
                                                                            className="mx-2"
                                                                        >
                                                                            <TextValidator
                                                                                variant="outlined"

                                                                                value={
                                                                                    roundDecimal((parseFloat(this.state.values_in_lkr * this.state.service_percentage_value / 100) +
                                                                                        parseFloat((this.state.values_in_lkr * this.state.ssl_percentage_value) / 100) +
                                                                                        ((((parseFloat(this.state.values_in_lkr * this.state.service_percentage_value)) / 100) + parseFloat(this.state.values_in_lkr)) * (parseFloat(this.state.vat_percentage_value) / 100)) +
                                                                                        parseFloat(this.state.other_percentage_value)), 2)
                                                                                }
                                                                                size="small"
                                                                                text="Total Amount"
                                                                                type="number"
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </Grid>
                                                                <Grid
                                                                    className="mt-5"
                                                                    item
                                                                    lg={12}
                                                                    md={12}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    <SubTitle title="Remark" />
                                                                    <TextValidator
                                                                        disabled={((this.state.data?.status == "Pending" || this.state.data?.status == "REJECTED" || this.state.data?.status == "RESUBMITTED") && this.state.userRoles.includes("SPC MA")

                                                                        ) ? false : true}
                                                                        multiline={
                                                                            true
                                                                        }
                                                                        minRows={
                                                                            5
                                                                        }
                                                                        className=" w-full"
                                                                        placeholder="Remark"
                                                                        name="remark"
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                        }}
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .data
                                                                                ?.remark
                                                                        }
                                                                        type="text"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.setState(
                                                                                {
                                                                                    data:
                                                                                    {
                                                                                        ...this
                                                                                            .state
                                                                                            .data,
                                                                                        remark: e
                                                                                            .target
                                                                                            .value,
                                                                                    },
                                                                                }
                                                                            )
                                                                        }}
                                                                    />




                                                                </Grid>
                                                            </Grid>

                                                            {(((this.state.data?.status === 'Pending' || this.state.data?.status === 'RESUBMITTED') && this.state.userRoles.includes("SPC Supervisor")) ||
                                                                (this.state.data?.status === 'SUPERVISOR APPROVED' && this.state.userRoles.includes("SPC Manager"))) ?
                                                                <Grid item xs={12}>
                                                                    <Grid container spacing={2}>
                                                                        <Grid item xs={12}>
                                                                            <Divider />
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <SubTitle title="Approve /Reject Debit Note" />
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            sm={12}

                                                                        >
                                                                            <TextValidator
                                                                                multiline
                                                                                rows={4}
                                                                                className="w-full"
                                                                                placeholder="Approve/ Reject Reason Enter Here"
                                                                                name="remark"

                                                                                value={this.state.remark}
                                                                                type="text"

                                                                                variant="outlined"
                                                                                size="small"
                                                                                // rowsMax={3}
                                                                                onChange={(e) => {
                                                                                    this.setState({ showRejectError: false, remark: e.target.value })
                                                                                }}

                                                                                // validators={['required']}
                                                                                errorMessages={[
                                                                                    'this field is required',
                                                                                ]}

                                                                            />
                                                                        </Grid>
                                                                        {this.state.showRejectError &&
                                                                            <Grid item xs={12}>
                                                                                <Typography className='font-bold text-error text-18'>Please note that the Reject reason is required.</Typography>
                                                                            </Grid>
                                                                        }

                                                                    </Grid>

                                                                </Grid>
                                                                : null}

                                                            {
                                                                this.state.approvalDaataLoad ?

                                                                    (this.state.data?.status == "APPROVED" || this.state.data?.status == "SUPERVISOR APPROVED") &&
                                                                    <Grid
                                                                        className=" w-full my-3"
                                                                        item
                                                                        lg={12}
                                                                        md={12}
                                                                        sm={12}
                                                                        xs={12}
                                                                    >

                                                                        <Alert severity="info">

                                                                            <SubTitle title="Approval Remark" />
                                                                            <Typography className="my-3 text-12 font-medium">
                                                                                {this.state.approvalData2
                                                                                    ? this.getApprovalRemark(this.state.approvalData2, "Approved") || "No remarks provided"
                                                                                    : "No approval data available"}
                                                                            </Typography>

                                                                        </Alert>

                                                                    </Grid> :
                                                                    <Grid item xs={12}>

                                                                        <CircularProgress />

                                                                    </Grid>

                                                            }
                                                            <Grid className='my-3' item xs={12}>

                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <Grid container spacing={2}
                                                                    item
                                                                    lg={12}
                                                                    md={12}
                                                                    sm={12}
                                                                    xs={12}
                                                                    className=" w-full flex justify-end pb-5"
                                                                    direction='row'>

                                                                    {(((this.state.data?.status === 'Pending' || this.state.data?.status === 'RESUBMITTED') && this.state.userRoles.includes("SPC Supervisor")) ||
                                                                        (this.state.data?.status === 'SUPERVISOR APPROVED' && this.state.userRoles.includes("SPC Manager"))) ?
                                                                        <Button
                                                                            className="mr-2 py-2 px-4"
                                                                            progress={false}
                                                                            // type="submit"
                                                                            scrollToTop={
                                                                                true
                                                                            }
                                                                            // disabled={this.state.isSaveChangers}
                                                                            style={{ backgroundColor: "#3bca79", color: "white", borderRadius: "10px" }}
                                                                            startIcon={<Icon >done</Icon>}
                                                                            onClick={() => this.setState({ openApprove: true })}
                                                                        >
                                                                            <span className="capitalize">
                                                                                Approve
                                                                            </span>
                                                                        </Button>
                                                                        : null}
                                                                    {(((this.state.data?.status === 'Pending' || this.state.data?.status === 'RESUBMITTED') && this.state.userRoles.includes("SPC Supervisor")) ||
                                                                        (this.state.data?.status === 'SUPERVISOR APPROVED' && this.state.userRoles.includes("SPC Manager"))) ?
                                                                        <Button
                                                                            className="mr-2 py-2 px-4"
                                                                            progress={false}
                                                                            // type="submit"
                                                                            scrollToTop={
                                                                                true
                                                                            }
                                                                            // disabled={this.state.isSaveChangers}
                                                                            style={{ backgroundColor: "#f54b4b", color: "white", borderRadius: "10px" }}
                                                                            startIcon={<Icon>close</Icon>}
                                                                            onClick={() => {

                                                                                console.log("remark", this.state.remark)
                                                                                if (!this.state.remark) {
                                                                                    this.setState({
                                                                                        showRejectError: true
                                                                                    })
                                                                                } else {
                                                                                    this.setState({ openReject: true, showRejectError: false })
                                                                                }

                                                                            }}
                                                                        >
                                                                            <span className="capitalize">
                                                                                Reject
                                                                            </span>
                                                                        </Button>
                                                                        : null}

                                                                    {(this.state.data?.status === 'REJECTED') && this.state.userRoles.includes("SPC MA") ?
                                                                        <Button
                                                                            className="mr-2 py-2 px-4"
                                                                            progress={false}
                                                                            scrollToTop={
                                                                                true
                                                                            }
                                                                            style={{ backgroundColor: "#ff9239", color: "white", borderRadius: "10px" }}
                                                                            startIcon={<UndoIcon />}
                                                                            onClick={() => this.setState({ openResubmit: true })}
                                                                        >
                                                                            <span className="capitalize">
                                                                                Resubmit
                                                                            </span>
                                                                        </Button>
                                                                        : null
                                                                    }


                                                                    {((((this.state.data?.status === 'Pending' || this.state.data?.status === 'RESUBMITTED') && (this.state.userRoles.includes("SPC Supervisor") || this.state.userRoles.includes("SPC MA"))) ||
                                                                        ((this.state.data?.status === 'SUPERVISOR APPROVED' || this.state.data?.status === 'APPROVED') && this.state.userRoles.includes("SPC Manager"))
                                                                        || (this.state.data?.status === 'SUPERVISOR APPROVED' && (this.state.userRoles.includes("SPC Supervisor")))

                                                                    )) ?
                                                                        <Button
                                                                            className="mr-2 py-3 px-4"
                                                                            progress={false}
                                                                            // type="submit"
                                                                            scrollToTop={
                                                                                true
                                                                            }
                                                                            // disabled={this.state.isSaveChangers}
                                                                            style={{ backgroundColor: "#3B71CA", color: "white", borderRadius: "10px" }}
                                                                            startIcon={<Icon>vertical_align_bottom</Icon>}
                                                                            onClick={() => this.setState({ saveConfirmDialogBox: true })}
                                                                        >
                                                                            <span className="capitalize">
                                                                                Save
                                                                            </span>
                                                                        </Button>
                                                                        : null}
                                                                    {((this.state.data?.status === 'Pending' || this.state.data?.status === 'RESUBMITTED' || this.state.data?.status === 'SUPERVISOR APPROVED' || this.state.data?.status === 'APPROVED') && (this.state.userRoles.includes("SPC Manager")
                                                                    )) ?


                                                                        <Button
                                                                            className="mr-2 py-2 px-4"
                                                                            progress={false}
                                                                            // type="submit"
                                                                            scrollToTop={
                                                                                true
                                                                            }
                                                                            // disabled={this.state.isSaveChangers}
                                                                            style={{ backgroundColor: "#b5af1d", color: "white", borderRadius: "10px" }}
                                                                            startIcon={<Icon >block</Icon>}
                                                                            onClick={() => this.setState({ cancelOpen: true })}
                                                                        >
                                                                            <span className="capitalize">
                                                                                Cancel
                                                                            </span>
                                                                        </Button>
                                                                        : null}

                                                                    {
                                                                        (this.state.data?.status != "CANCELED" && this.state.data?.status != "REJECTED") &&
                                                                        <Button
                                                                            className="mr-2 py-3 px-5"
                                                                            progress={false}
                                                                            // type="submit"
                                                                            scrollToTop={
                                                                                true
                                                                            }
                                                                            // disabled={this.state.isSaveChangers}
                                                                            style={{ backgroundColor: "#9a5eed", color: "white", borderRadius: "10px" }}
                                                                            startIcon={<Icon>print</Icon>}
                                                                            onClick={() => this.printData()}
                                                                        >
                                                                            <span className="capitalize">
                                                                                Print
                                                                            </span>
                                                                        </Button>

                                                                    }

                                                                    {
                                                                        (this.state.data?.status == "APPROVED") &&
                                                                        <Button
                                                                            progress={this.state.printLoading}
                                                                            className="mr-2 py-2 px-4"

                                                                            // type="submit"
                                                                            scrollToTop={
                                                                                true
                                                                            }
                                                                            // disabled={this.state.isSaveChangers}
                                                                            style={{ backgroundColor: "#5ea6ed", color: "white", borderRadius: "10px" }}
                                                                            startIcon={<Icon >print</Icon>}
                                                                            onClick={() => {

                                                                                if (this.state.grnDetails.length == 0) {
                                                                                    this.setState({
                                                                                        alert: true,
                                                                                        message: "There is no GRN Details for this consignment",
                                                                                        severity: 'error',
                                                                                    })
                                                                                } else if (
                                                                                    (this.state.grnDetails.every(obj => obj.status === "APPROVED PARTIALLY COMPLETED"))
                                                                                ) {
                                                                                    this.setState({ printConfirmation: true })
                                                                                } else {
                                                                                    this.generateOriginal()
                                                                                }
                                                                            }}
                                                                        >
                                                                            <span className="capitalize">
                                                                                Print Original
                                                                            </span>
                                                                        </Button>

                                                                    }


                                                                    <Button
                                                                        // className="mr-2 py-2 px-4"
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
                                                                            Close
                                                                        </span>
                                                                    </Button>

                                                                </Grid>
                                                            </Grid>




                                                        </Fragment>
                                                        {/* ) : null} */}
                                                    </Card>
                                                </Grid>
                                                {/* Submit and Cancel Button */}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ValidatorForm>

                        <ConfirmationDialog
                            text="Are you sure to Save?"
                            open={this.state.saveConfirmDialogBox}
                            onConfirmDialogClose={() => { this.setState({ saveConfirmDialogBox: false }) }}
                            onYesClick={() => {
                                this.setState({ saveConfirmDialogBox: false }, () => {
                                    this.editData()
                                })
                            }}
                        />

                        <ConfirmationDialog
                            text="Are you sure you want to Approve?"
                            open={this.state.openApprove}
                            onConfirmDialogClose={() => { this.setState({ openApprove: false }) }}
                            onYesClick={() => {
                                this.setState({ openApprove: false }, () => {
                                    this.handleApproved()
                                    if (this.state.editedDataFields.length > 0) {
                                        this.editData()
                                    }


                                })
                            }}
                        />
                        <ConfirmationDialog
                            text="Are you sure you want to Reject?"
                            open={this.state.openReject}
                            onConfirmDialogClose={() => { this.setState({ openReject: false }) }}
                            onYesClick={() => {
                                this.setState({ openReject: false }, () => {
                                    this.handleReject()
                                    if (this.state.editedDataFields.length > 0) {
                                        this.editData()
                                    }

                                })
                            }}
                        />

                        <ConfirmationDialog
                            text="Are you sure you want to Resubmit?"
                            open={this.state.openResubmit}
                            onConfirmDialogClose={() => { this.setState({ openResubmit: false }) }}
                            onYesClick={() => {
                                this.setState({ openResubmit: false }, () => {
                                    this.handleResubmit()
                                    if (this.state.editedDataFields.length > 0) {
                                        this.editData()
                                    }


                                })
                            }}
                        />

                        <ConfirmationDialog
                            text="Are you sure to Cancel the Debit note?"
                            open={this.state.cancelOpen}
                            onConfirmDialogClose={() => { this.setState({ cancelOpen: false }) }}
                            onYesClick={() => {
                                this.setState({ cancelOpen: false }, () => {
                                    this.handleCancel()

                                })
                            }}
                        />
                        <ConfirmationDialog
                            text="GRN Details are Partialy completed. Are you sure to generate the Original report?"
                            open={this.state.printConfirmation}
                            onConfirmDialogClose={() => { this.setState({ printConfirmation: false }) }}
                            onYesClick={() => {
                                this.setState({ printConfirmation: false }, () => {
                                    this.generateOriginal()

                                })
                            }}
                        />

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
                ) : (
                    <CircularProgress size={24}></CircularProgress>
                )}
            </>
        )
    }
}

export default withStyles(styleSheet)(PendingDebitNoteDetailsView)
