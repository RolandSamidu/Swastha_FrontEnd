import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    InputAdornment,
    IconButton,
    Icon,
    Typography,
    colors,
    CircularProgress,
    Dialog
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import SearchIcon from '@mui/icons-material/Search';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    SwasthaFilePicker,
    ImageView,
    LoonsTable,
    PrintHandleBar
} from 'app/components/LoonsLabComponents'

import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import { convertTocommaSeparated, dateParse, dateTimeParse, includesArrayElements, roundDecimal } from 'utils'
import localStorageService from 'app/services/localStorageService'
import LocalPurchaseServices from 'app/services/LocalPurchaseServices'
import PharmacyService from 'app/services/PharmacyService'
import InventoryService from 'app/services/InventoryService'
// import AvailableDrug from './AvailableDrug'
import EstimationService from 'app/services/EstimationService'
import PrescriptionService from 'app/services/PrescriptionService'
import ConsignmentService from 'app/services/ConsignmentService'
import EmployeeServices from 'app/services/EmployeeServices'
import SPCServices from 'app/services/SPCServices'

import DebitNoteApproval from './Print/index'
import FinanceDocumentServices from 'app/services/FinanceDocumentServices'

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import moment from 'moment';

const styleSheet = (theme) => ({})

const renderSubsequentDetailCard = (label, value) => {
    return (
        <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={6} xs={6}>
                <SubTitle title={label} />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
                <Typography variant='body1' style={{ marginTop: '3px', textJustify: "justify" }}>{value}</Typography>
            </Grid>
        </Grid>

    )
}

const renderDetailCard = (label, value, style = {}) => {
    return (
        <Grid container spacing={2} style={style}>
            <Grid
                className=" w-full"
                item
                lg={8}
                md={8}
                sm={12}
                xs={12}
            >
                {renderSubsequentDetailCard(label, value)}
            </Grid>
        </Grid>
    )
}

const renderRadioCard = (label, values, selected) => {
    return (
        <Grid className=" w-full"
            item
            lg={6}
            md={6}
            sm={12}
            xs={12}>
            <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{ display: "flex", alignItems: "center" }}>
                    <SubTitle title={label} />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            name="yesno"
                            aria-disabled
                            value={selected}
                            // onChange={(e) => {
                            //     let formData = this.state.formData
                            //     formData.selected = e.target.value
                            //     this.setState({ formData })
                            // }}
                            style={{ display: "block", marginTop: "3px" }}
                        >
                            <FormControlLabel
                                disabled
                                value={values[0]}
                                control={<Radio />}
                                label={values[0].charAt(0).toUpperCase() + values[0].slice(1).toLowerCase()}
                            />
                            <FormControlLabel
                                disabled
                                value={values[1]}
                                control={<Radio />}
                                label={values[1].charAt(0).toUpperCase() + values[1].slice(1).toLowerCase()}
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
        </Grid>
    )
}

class ApprovalIndividualDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            selected: 'yes',
            estimation: 'yes',

            openApprove: false,
            openReject: false,

            id: null,
            role: null,
            data: {},
            addData: {},
            lp_config_data: {},
            owner_id: null,
            lp_request_id: null,
            hospital_approval_config_id: null,
            hospital: {},
            bht: null,
            estimationData: [],
            userRole: null,

            supplier: {},
            user: {},
            purchaseOrderData: {},
            ploaded: false,

            userRoles: [],

            alert: false,
            message: '',
            severity: 'success',

            loading: false,

            remark: null,
            userInfo: {},
            debitNoteView: false,



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
            }
        }
    }


    loadData = async () => {

        this.setState({ loading: false });

        let id = this.props.match.params.id

        let res = await SPCServices.getAllDebitNoteByID(id)

        if (res.status === 200) {
            console.log('cheking data inc', res)
            this.setState({ data: res.data.view, loading: true }, () => {
                this.loadAdditionalData()
            });
        }
    }

    loadAdditionalData = async () => {

        let id = this.props.match.params.uid

        let resp = await ConsignmentService.getDabitNoteApprovalIndividualRequest({}, id)

        if (resp.status === 200) {

            console.log('cheking data', resp)
            this.setState({
                addData: resp.data.view
            })

        }
    }

    handleApproved = async () => {

        let user = localStorageService.getItem("userInfo")

        let id = this.props.match.params.id
        let uid = this.props.match.params.uid

        let params = this.state.dataListApproval
        params.debit_note_id = id
        params.spc_approval_config_id = this.state.addData?.spc_approval_config_id
        params.approval_user_type = this.state.addData?.approval_user_type
        params.owner_id = this.state.addData?.owner_id
        params.sequence = this.state.addData?.sequence
        params.approved_by = user.id
        params.remark = this.state.remark

        let res = await ConsignmentService.createApproved(uid, params)

        if (res.status == 201 || res.status == 200) {
            this.setState({
                alert: true,
                message: 'Approval Process Successfull',
                severity: 'success',
                submitting: false,
                openApprove: false
            },
                () => {
                    setTimeout(() => {
                        window.location.href = `/spc/debit_note_approval`
                    }, 2000);
                })

        } else {
            // console.log("errorr", res.response.data.error)
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

        let id = this.props.match.params.id
        let uid = this.props.match.params.uid

        let params = this.state.dataListReject
        params.debit_note_id = id
        params.spc_approval_config_id = this.state.addData?.spc_approval_config_id
        params.approval_user_type = this.state.addData?.approval_user_type
        params.owner_id = this.state.addData?.owner_id
        params.sequence = this.state.addData?.sequence
        params.approved_by = user.id
        params.remark = this.state.remark

        let res = await ConsignmentService.createApproved(uid, params)

        if (res.status == 201 || res.status == 200) {
            this.setState({
                alert: true,
                message: 'Reject Process Successfull',
                severity: 'success',
                submitting: false,
                openReject: false
            }, () => {
                setTimeout(() => {
                    window.location.href = `/spc/debit_note_approval`
                }, 2000);
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
    }

    printData = async () => {

        let params = {
            refference_id: this.props.match.params.id,
            reference_type: ['SPC LC Debit Note'],
            is_active: true,
        }

        let res_data = await FinanceDocumentServices.getFinacneDocuments(params)
        // console.log("dabit note", res_data.data.view.data[0]?.template)
        console.log("Pdf", res_data.data.view.data[0]?.template)

        var searchString = 'catch_and_edit'
        var inputString = res_data.data.view.data[0]?.template;

        const currentTime = moment().format('YYYY-MM-DD hh:mm A')
        var outputString = inputString.replace(searchString, currentTime);
        console.log("Pdf 2", outputString)
        if (res_data.status === 200) {
            this.setState({
                dabitNote: outputString,
                debitNoteView: true
            })
        }

    }




    async componentDidMount() {
        // this.printData()
        let loginUser = await localStorageService.getItem('userInfo')
        this.setState({ userRoles: loginUser.roles })
        this.loadData()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <div style={{ flex: 1 }}>
                                <Typography variant="h6" className="font-semibold">Debit Note Request Details</Typography>
                            </div>
                        </div>
                        <Divider />
                        <Grid container className='mt-2' style={{ justifyContent: 'space-between' }}>
                            {/* <Grid item xs={12}> */}
                            <Link to="/spc/debit_note_approval">
                                <Button
                                // onClick={()=>{
                                //     window.location.href = `/spc/debit_note_approval`
                                // }}
                                >
                                    Back
                                </Button>
                            </Link>
                            <Button
                                onClick={() => {
                                    this.printData()
                                }}
                            >
                                Print
                            </Button>
                            {/* </Grid> */}
                        </Grid>
                        {/* Main Grid */}
                        <ValidatorForm className="pt-2"
                            onSubmit={() => null}
                            onError={() => null}>
                            <Grid container spacing={2} direction="row" style={{ marginLeft: "12px", marginTop: "6px" }}>
                                {/* Filter Section */}
                                <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginRight: "12px" }}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <SubTitle className="font-semibold" title="Debit Note Details" />
                                            <Divider className='mt-2' />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        {/* <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Debit Note Number :', this.state.loading ? this.state.data?.debit_note_no ? this.state.data?.debit_note_no : 'Not Available' : 'Loading')}
                                        </Grid> */}
                                        {/* Name*/}
                                        {/* <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Procurement No :', 'Not Available')}
                                        </Grid> */}
                                        {/* <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Debit Note Type :', this.state.loading ? this.state.data?.debit_note_type ? this.state.data?.debit_note_type : 'Not Available' : 'Loading')}
                                        </Grid> */}
                                        {/* Short Reference*/}
                                        {/* <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Debit Note Sub Type :', this.state.loading ? this.state.data?.debit_note_sub_type
                                                ? this.state.data?.debit_note_sub_type : 'Not Available' : 'Loading')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Type :', this.state.loading ? this.state.data?.type ? this.state.data?.type : 'Not Available' : 'Loading')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Status :', this.state.loading ? this.state.data?.status ? this.state.data?.status : 'Not Available' : 'Loading')}
                                        </Grid>

                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Remark :', this.state.loading ? this.state.data?.remark ? this.state.data?.remark : 'Not Available' : 'Loading')}
                                        </Grid> */}

                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Debit Note Number :', this.state.loading ? this.state.data?.debit_note_no ? this.state.data?.debit_note_no : 'Not Available' : 'Loading')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Debit Note Type :', this.state.loading ? this.state.data?.debit_note_type ? this.state.data?.debit_note_type : 'Not Available' : 'Loading')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Debit Note Sub Type :', this.state.loading ? this.state.data?.debit_note_sub_type ? this.state.data?.debit_note_sub_type : 'Not Available' : 'Loading')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Debit Note Date :', this.state.loading ? (this.state.data?.createdAt) ? dateParse(this.state.data?.createdAt) : 'Not Available' : 'Loading')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Supplier Name :', this.state.loading ? this.state.data?.supplier_name ? this.state.data?.supplier_name : 'Not Available' : 'Loading')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Order List No :', this.state.loading ? this.state.data?.Consignment?.order_no ? this.state.data?.Consignment?.order_no : 'Not Available' : 'Loading')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Indent No :', this.state.loading ? this.state.data?.Consignment?.indent_no ? this.state.data?.Consignment?.indent_no : 'Not Available' : 'Loading')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('PO No :', this.state.loading ? this.state.data?.Consignment?.po_no ? this.state.data?.Consignment?.po_no : 'Not Available' : 'Loading')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('LDCN No :', this.state.loading ? this.state.data?.Consignment?.wdn_no ? this.state.data?.Consignment?.wdn_no : 'Not Available' : 'Loading')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Shipment No :', this.state.loading ?
                                                this.state.data?.debit_note_type == "Local" ? (this.state.data?.Consignment?.ldcn_ref_no ?
                                                    this.state.data?.Consignment?.ldcn_ref_no : 'Not Available')
                                                    : (this.state.data?.Consignment?.wharf_ref_no ?
                                                        this.state.data?.Consignment?.wharf_ref_no : 'Not Available')
                                                : 'Loading')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('WHARF Ref No :', this.state.loading ? this.state.data?.Consignment?.shipment_no ? this.state.data?.Consignment?.shipment_no : 'Not Available' : 'Loading')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Invoice No :', this.state.loading ? this.state.data?.Consignment?.invoice_no ? this.state.data?.Consignment?.invoice_no : 'Not Available' : 'Loading')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('HS Code :', this.state.loading ? this.state.data?.Consignment?.hs_code ? this.state.data?.Consignment?.hs_code : 'Not Available' : 'Loading')}
                                        </Grid>
                                    </Grid>

                                    {
                                        this.state.loading &&
                                        <>
                                            <Grid container spacing={2}>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    lg={12}
                                                >
                                                    {/* <SubTitle title="Patient Details" /> */}
                                                    <Divider className='mt-2' />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                {/* <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    {renderSubsequentDetailCard('Invoice Value :', this.state.loading ? this.state.data?.invoice_value ? convertTocommaSeparated(this.state.data?.invoice_value,4) : 'Not Available' : 'Loading')}
                                                </Grid> */}

                                                {/* Name*/}
                                                {/* <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    {renderSubsequentDetailCard('Total Charges :', this.state.loading ? this.state.data?.total_charges ? convertTocommaSeparated(this.state.data?.total_charges, 4) : 'Not Available' : 'Loading')}
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    {renderSubsequentDetailCard('Final Value :', this.state.loading ? this.state.data?.final_value ? convertTocommaSeparated(this.state.data?.final_value, 4) : 'Not Available' : 'Loading')}
                                                </Grid> */}

                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    {renderSubsequentDetailCard('Currency :', this.state.loading ? this.state.data?.Consignment?.currency ? this.state.data?.Consignment?.currency : 'Not Available' : 'Loading')}
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    {renderSubsequentDetailCard('Exchange Rate :', this.state.loading ? this.state.data?.Consignment?.exchange_rate ? convertTocommaSeparated(this.state.data?.Consignment?.exchange_rate, 4) : 0 : 'Loading')}
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    {renderSubsequentDetailCard(`Value in ${this.state.loading ? this.state.data?.Consignment?.currency : "LKR"}`, this.state.loading ? this.state.data?.Consignment?.values_in_currency ? convertTocommaSeparated(this.state.data?.Consignment?.values_in_currency, 4) : 0 : 'Loading')}
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    {renderSubsequentDetailCard('Invoice Amount (LKR) :', this.state.loading ? this.state.data?.Consignment?.values_in_lkr ? convertTocommaSeparated(this.state.data?.Consignment?.values_in_lkr, 4) : 0 : 'Loading')}
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    {renderSubsequentDetailCard('Charges Amount :', this.state.loading ? this.state.data?.total_charges ? convertTocommaSeparated(this.state.data?.total_charges, 4) : 0 : 'Loading')}
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    {renderSubsequentDetailCard('Total Amount :', this.state.loading ? this.state.data?.final_value ? convertTocommaSeparated(this.state.data?.final_value, 4) : 0 : 'Loading')}
                                                </Grid>
                                            </Grid>
                                        </>


                                    }

                                    <Grid container spacing={2} className='mt-5'>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <SubTitle className="font-semibold" title="Debit Note Charges" />
                                            <Divider className='mt-2' />
                                        </Grid>

                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={6}
                                            lg={6}
                                        >
                                            <table style={{ width: '100%' }}>
                                                <tr>
                                                    <td style={{ fontWeight: 'bold', marginBottom: '1px solid black' }}>Type</td>
                                                    <td style={{ fontWeight: 'bold', marginBottom: '1px solid black' }}>Percentage Or Value</td>
                                                    <td style={{ fontWeight: 'bold', marginBottom: '1px solid black' }}>Amount</td>
                                                </tr>


                                                {console.log('cheking map', this.state.data)}
                                                {(this.state.data.type === 'SPC LC Debit Note') ?
                                                    this.state.data?.DebitNoteCharges && this.state.data.DebitNoteCharges
                                                        .filter(item => ['service charge 2', 'Service Charge', 'VAT', 'SSL', 'Other',].includes(item.TransactionType?.type))
                                                        .map((item, i) => (
                                                            // this.state.data?.DebitNoteCharges?.map((item, i)=>(
                                                            <tr key={i}>
                                                                <td style={{ width: '33.33%', marginTop: '2px' }}>{item?.TransactionType?.type}</td>
                                                                <td style={{ width: '33.33%', marginTop: '2px' }}>{item?.percentage_or_value}</td>
                                                                <td style={{ width: '33.33%', marginTop: '2px' }}>{item?.amount}</td>
                                                            </tr>
                                                        ))
                                                    :
                                                    this.state.data?.DebitNoteCharges && this.state.data.DebitNoteCharges
                                                        .filter(item => !['Tax', 'SSCL',].includes(item.TransactionType?.type))
                                                        .map((item, i) => (
                                                            <tr key={i}>
                                                                <td style={{ width: '33.33%', marginTop: '2px' }}>{item?.TransactionType?.type}</td>
                                                                <td style={{ width: '33.33%', marginTop: '2px' }}>{item?.percentage_or_value}</td>
                                                                <td style={{ width: '33.33%', marginTop: '2px' }}>{item?.amount}</td>
                                                            </tr>
                                                        ))
                                                }

                                            </table>

                                        </Grid>
                                    </Grid>

                                    {(this.state.data.status === 'Pending' || this.state.data?.status == "SUPERVISOR APPROVED") && this.state.addData?.approval_type !== "Approved" && this.state.userRoles.includes("SPC MA") !== true ?
                                        <>
                                            <Grid container spacing={2} className='mt-5'>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={12}
                                                    md={6}
                                                    lg={6}
                                                >
                                                    <TextValidator
                                                        multiline
                                                        rows={4}
                                                        className="w-full"
                                                        placeholder="Remark Enter Here"
                                                        name="remark"

                                                        value={this.state.remark}
                                                        type="text"

                                                        variant="outlined"
                                                        size="small"
                                                        // rowsMax={3}
                                                        onChange={(e) => {
                                                            this.setState({ remark: e.target.value })
                                                        }}

                                                        // validators={['required']}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}

                                                    />
                                                </Grid>
                                            </Grid>



                                            <Grid container spacing={2} className='mt-5 mb-5' style={{ alignItems: 'flex-end' }} >
                                                <Grid item className="mt-2">
                                                    {/* <Tooltip title="Reject"> */}
                                                    <Button
                                                        onClick={() =>
                                                            this.setState({
                                                                openApprove: true
                                                            })
                                                        }
                                                        // disabled={disbaleApprove}
                                                        //startIcon="thumb_down"
                                                        variant="contained"
                                                        color="primary"
                                                    >
                                                        Approve
                                                    </Button>
                                                    {/* </Tooltip> */}
                                                </Grid>

                                                <Grid item className="mt-2">
                                                    {/* <Tooltip title="Reject"> */}
                                                    <Button
                                                        onClick={() => this.setState({ openReject: true })}
                                                        // disabled={disbaleApprove}
                                                        //startIcon="thumb_down"
                                                        variant="contained"
                                                        color="secondary"
                                                    >
                                                        Reject
                                                    </Button>
                                                    {/* </Tooltip> */}
                                                </Grid>

                                            </Grid>
                                        </>
                                        : null}



                                </Grid>


                            </Grid>


                        </ValidatorForm>



                        {this.state.ploaded ?
                            <Grid>
                                <DebitNoteApproval data={this.state.data} user={this.state.userInfo?.name} />
                            </Grid>
                            : null
                        }



                    </LoonsCard>
                </MainContainer>

                <Dialog fullScreen maxWidth="lg " open={this.state.debitNoteView} onClose={() => { this.setState({ debitNoteView: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Debit Note" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    debitNoteView: false

                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>

                        <Grid container>

                            <PrintHandleBar buttonTitle={"Print"} content={this.state.dabitNote} title="Debit Note">

                            </PrintHandleBar>

                        </Grid>


                    </MainContainer>
                </Dialog>

                <Dialog fullWidth maxWidth="sm" open={this.state.openApprove} >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to Approve?
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => { this.handleApproved() }}>Yes</Button>
                        <Button style={{ backgroundColor: 'red' }} onClick={() => {
                            this.setState({
                                openApprove: false
                            })
                        }} autoFocus>
                            No
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog fullWidth maxWidth="sm" open={this.state.openReject} >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to Reject?
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button style={{ backgroundColor: 'red' }} onClick={() => { this.handleReject() }}>Yes</Button>
                        <Button primary onClick={() => {
                            this.setState({
                                openReject: false
                            })
                        }} autoFocus>
                            No
                        </Button>
                    </DialogActions>
                </Dialog>

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

export default withStyles(styleSheet)(ApprovalIndividualDetails)
