import React, { Component, Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
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
    Tooltip,
    Typography
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    SwasthaFilePicker,
    LoonsSwitch,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import { SimpleCard } from 'app/components'
import { dateParse, roundDecimal } from 'utils'

import PatientServices from 'app/services/PatientServices'
import InventoryService from 'app/services/InventoryService';
import PrescriptionService from 'app/services/PrescriptionService'
import localStorageService from 'app/services/localStorageService'
import DashboardServices from 'app/services/DashboardServices'
import LocalPurchaseServices from 'app/services/LocalPurchaseServices'
import PharmacyService from 'app/services/PharmacyService'
import EstimationService from 'app/services/EstimationService'
import MomentUtils from '@date-io/moment'
import moment from 'moment';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import EmployeeServices from 'app/services/EmployeeServices'

// import LPPrintView from './LPRequest/LPPrintView'
import LpPrint from './LPRequest/LpPrint'
import ClinicService from 'app/services/ClinicService'

const styleSheet = (theme) => ({})

const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", solo = false, text = "Add", tail = null }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <Autocomplete
            onFocus={handleFocus}
            onBlur={handleBlur}
            options={options}
            getOptionLabel={getOptionLabel}
            id="disable-clearable"
            freeSolo={solo}
            onChange={onChange}
            value={val}
            size='small'
            renderInput={(params) => (
                < div ref={params.InputProps.ref} style={{ display: 'flex', position: 'relative' }}>
                    <input type="text" {...params.inputProps}
                        style={{ marginTop: '5.5px', padding: '6.5px 10px', border: '1px solid #e5e7eb', borderRadius: 4 }}
                        placeholder={`Enter ${text}`}
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



class LocalPurchaseRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            itemList: [],
            hospital: {
            },
            dpInst: {
                owner_id:null,
            },
            patientList: [],
            wardList: [],
            consultantList: [],
            dpInstitution: [],
            Uom_Data:[],

            user: {},
            purchaseOrderData: {},
            supplier: {},
            ploaded: false,
            printButtonEnabled:false,

            // consultant: [
            //     { id: 1, name: 'Haris' },
            //     { id: 2, name: 'Sadun' },
            //     { id: 3, name: 'Ishara' },
            //     { id: 4, name: 'Gayan' },
            // ],
            lpId:null,
            alert: false,
            message: '',
            severity: 'success',

            loading: false,
            source_id: null,
            currentUserRole:true,
            estimationData:[],

            formData: {
                // Switch -> (True/False)
                isNewItem: false,
                isNewPatient: false,

                consultant_id: null,
                consultant_name: null,

                institute: null,
                ward_id: null,

                // Item
                sr_no: null,
                item_id: null,
                item_name: null,
                warehouse: null,
                estimated_price: null,

                // Patient
                phn: null,
                nic: null,
                patient_id: null,
                patient_name: null,
                bht: null,
                bht_or_clinic_no: null,

                // LP
                required_quantity: null,
                required_date: null,
                justification: null,
                unit_price: null,
                is_patient_base: true
            },
        }

        this.loadItemData = this.loadItemData.bind(this);
        this.loadPatientData = this.loadPatientData.bind(this);
        this.loadClinicData = this.loadClinicData.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit = async () => {
        let owner_id = await localStorageService.getItem('owner_id');
        let user = await localStorageService.getItem('userInfo')

        console.log('sdffgksdfghk', this.state.formData)

        if (user && user.id) {
            if (this.state.formData.isNewItem) {
                const { isNewItem, isNewPatient, institute, estimated_price, item_id, consultant_name, sr_no, phn, patient_name, bht, nic, patient_id, ...other } = this.state.formData;

                const data = isNewPatient ? { patient_name: patient_name, phn: phn, bht: bht, nic: nic, ...other } : { patient_id: patient_id, ...other };

                let newFormData

                if (this.state.currentUserRole){
                    newFormData = {
                        ...data,
                        owner_id: owner_id,
                        requested_by: user.id,
                        status: 'Pending'
                    }

                } else {
                    newFormData = {
                        ...data,
                        owner_id: this.state.dpInst.owner_id,
                        requested_by: user.id,
                        status: 'Pending'
                    }
                }
                
                console.log('newFormData', newFormData)

                let res = await LocalPurchaseServices.createLPRequest(newFormData);
                if (res.status === 201) {
                    this.setState({
                        alert: true,
                        message: 'Adding Local Purchase was Successful',
                        severity: 'success',
                        source_id: res.data.posted.res.id
                    }, () => { this.setState({
                        lpId: res.data.posted.res.id,
                        printButtonEnabled:true
                    }) }
                    )

                } else {
                    this.setState({
                        alert: true,
                        message: 'Adding Local Purchase was Unsuccessful',
                        severity: 'error',
                    })
                }
            } else {
                const { isNewItem, isNewPatient, institute, estimated_price, sr_no, phn, patient_name, nic, bht, patient_id, ...other } = this.state.formData;

                const data = isNewPatient ? { patient_name: patient_name, phn: phn, bht: bht, nic: nic, ...other } : { patient_id: patient_id, ...other };

                let newFormData

                if (this.state.currentUserRole){
                    newFormData = {
                        ...data,
                        owner_id: owner_id,
                        requested_by: user.id,
                        status: 'Pending'
                    }

                } else {
                    newFormData = {
                        ...data,
                        owner_id: this.state.dpInst.owner_id,
                        requested_by: user.id,
                        status: 'Pending'
                    }
                }

                console.log('newFormData else', newFormData)

                let res = await LocalPurchaseServices.createLPRequest(newFormData);
                // console.log("resoponse", res)
                if (res.status === 201) {
                    this.setState({
                        alert: true,
                        message: 'Adding Local Purchase was Successful',
                        severity: 'success',
                        source_id: res.data.posted.res.id
                    }, 
                    () => { this.setState({
                        lpId: res.data.posted.res.id,
                        printButtonEnabled:true
                    }) }
                    )
                } else {
                    this.setState({
                        alert: true,
                        message: 'Adding Local Purchase was Unsuccessful',
                        severity: 'error',
                    })
                }
            }
        } else {
            this.setState({
                alert: true,
                message: 'User ID was not Found in the Application Storage',
                severity: 'error',
            })
        }
    }

    async loadAllConsultant() {
        let res = await EmployeeServices.getEmployees({ type: "Consultant" })
        if (res.status) {
            console.log("All Consultants", res.data.view.data)
            this.setState({
                consultantList: res.data.view.data,
            })
        }
    }

    async getHospital(owner_id) {
        let params = { issuance_type: 'Hospital' }
        if (owner_id) {
            let durgStore_res = await PharmacyService.fetchAllDataStorePharmacy(owner_id, params)
            if (durgStore_res.status == 200) {
                console.log('hospital', durgStore_res.data.view.data)
                this.setState({ hospital: durgStore_res?.data?.view?.data[0] })
            }
        }
    }

    async getUser() {
        let id = await localStorageService.getItem('userInfo').id
        if (id) {
            let user_res = await EmployeeServices.getEmployeeByID(id)
            if (user_res.status == 200) {
                console.log('User', user_res.data.view)
                this.setState({ user: user_res?.data?.view })
            }
        }
    }

    async printData(request_id) {
        this.setState({ printLoaded: false, ploaded: false })
        console.log('clicked', this.state.lpId)

        let res = await LocalPurchaseServices.getLPRequestByID(this.state.lpId)
        if (res.status === 200) {
            console.log("Data prit: ", res.data.view)
            await this.getHospital(res.data.view?.owner_id)
            await this.getUser();

            this.setState({
                ploaded: true,
                supplier: res.data.view?.Employee,
                purchaseOrderData: res.data.view,
                printLoaded: true,
            }, () => {
                this.getUOMFroPrint(res.data.view)
                
            })
        }
    }

    async getUOMFroPrint(data){

        console.log('cheking uom inc', data.item_id)
        let params={
            item_snap_id:data?.ItemSnap?.id
            // item_snap_id:'7b1f51d4-8ed9-4b19-a98a-003565de2a6f'
        }
        let res = await InventoryService.GetUomById(params)
        if (res.status === 200){
            console.log('cheking uom', res)

            let selected_umo = res.data.view.data.find((e)=>e?.ItemSnap?.id == data?.ItemSnap?.id)

            console.log('cheking selecterd uom', selected_umo)
            this.setState({
                Uom_Data:selected_umo
            }, ()=>{
                document.getElementById('lp_print_view').click()
            })
        }
    }

    // async printData() {
    //     this.setState({ printLoaded: false, ploaded: false })
    //     // console.log('clicked', request_id)

    //     let res = await LocalPurchaseServices.getLPRequestByID(this.state.lp_request_id)
    //     if (res.status === 200) {
    //         console.log("Data: ", res.data.view)
    //         // await this.getHospital(res.data.view?.owner_id)
    //         await this.getUser();

    //         this.setState({
    //             ploaded: true,
    //             supplier: res.data.view?.Employee,
    //             purchaseOrderData: res.data.view,
    //             printLoaded: true,
    //         }, () => {
    //             document.getElementById('lp_print_view').click()
    //         })
    //     }
    // }

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props 
        let files = event.target.files

        this.setState({ files: files }, () => {
            console.log('files', this.state.files)
        })
    }

    loadWardData = async () => {
        this.setState({ loading: false });
        // var user = await localStorageService.getItem('userInfo');
        let hospital_id = await localStorageService.getItem('main_hospital_id');
        let owner_id = await localStorageService.getItem('owner_id');

        // let params_ward = { issuance_type: 'Ward', employee_id: user.id }//date
        let params_ward = { issuance_type: ['Ward', 'Clinic', 'Unit', 'Lab'] }//date  Lab
        let res = await DashboardServices.getAllClinics(params_ward, owner_id);
        if (res.status == 200) {
            console.log("Wards: ", res.data.view.data)
            this.setState({
                wardList: res.data.view.data
            })
        }

        let hospital_res = await PharmacyService.fetchAllDataStorePharmacy(owner_id, { issuance_type: 'Hospital' })
        if (hospital_res.status == 200) {
            console.log('hospital', hospital_res.data.view.data)
            this.setState({ hospital: hospital_res?.data?.view?.data[0] })
        }

        this.setState({ loading: true })
    }

    async getHospitalEstimation() {
        let owner_id = await localStorageService.getItem('owner_id')
        let itemId = this.state.formData?.item_id
        // console.log("checking item id", this.state.data?.ItemSnap?.id)
        console.log("checking formData", this.state.formData?.item_id)

        if (itemId) {
        let params = {
            owner_id: owner_id,
            item_id: [itemId],
            estimation_status: 'Active',
            available_estimation: 'Active',
            status: 'Active',
            hospital_estimation_status: 'Active',
            //'order[0]': ['createdAt', 'DESC'],
            from: dateParse(moment().startOf('year')),
            to: dateParse(moment().endOf('year')),
            'order[0]': ['estimation', 'DESC'],
        }

        let res = await EstimationService.getAllEstimationITEMS(params)
        if (res.status == 200) {
            console.log("loaded data estimation", res)
            this.setState({
                estimationData: res.data?.view?.data
            }) 
        }

    }
    }

    loadItemData = async () => {
        let formData = this.state.formData
        if (formData.item_name && formData.item_name.length > 3) {
            let res = await InventoryService.fetchAllItems({ search: formData.item_name,/*  is_prescrible: "true", limit: 10, page: 0, */ 'order[0]': ['sr_no', 'ASC'] })
            if (res.status === 200) {
                this.setState({ itemList: res.data.view.data });
            }
        } else if (formData.sr_no && formData.sr_no.length > 3) {
            let res = await InventoryService.fetchAllItems({ search: formData.sr_no,/*  is_prescrible: "true", limit: 10, page: 0,  */'order[0]': ['sr_no', 'ASC'] })
            if (res.status === 200) {
                this.setState({ itemList: res.data.view.data });
            }
        }
    }

    loadClinicData = async (value) => {
        let res = await PrescriptionService.fetchPatientClinics({ 'type': 'Clinic', 'patient_id': value.id })
        if (res.status === 200) {
            const newFormData = {
                ...this.state.formData,
                patient_id: value.id,
                patient_name: value.name,
                phn: value.phn,
                nic: value.nic ? value.nic : null,
                bht: res.data.view.data[0]?.bht ? res.data.view.data[0]?.bht : null
            }
            this.setState({ formData: newFormData })
            console.log("Clinic Details: ", res.data.view.data)
            // console.log("Clinic Details: ", value)
        }
    }

    loadPatientData = async () => {
        let formData = this.state.formData
        if (formData.phn.length > 3) {
            let res = await PatientServices.fetchPatientsByAttribute({
                limit: 10, page: 0, 'order[0]': ['createdAt', 'DESC'], passport_no: null, driving_license: null,
                mobile_no: '', clinic_id: null, phn: formData.phn, nic: '', status: '', search: null
            })
            if (res.status === 200) {
                // console.log('Patient Data: ', res.data.view.data)
                this.setState({ patientList: res.data.view.data })
            }
        }
    }

    async getUserRole(){

        let user_role = await localStorageService.getItem('userInfo').roles[0]
        console.log('hjhjhjhjhjjh', user_role)

        if (user_role === 'Devisional Pharmacist') {
            this.setState({
                currentUserRole:false
            })
        } else {
            this.setState({
                currentUserRole:true
            })
        }  
    }

    async detDPInstitution (){

        var info = await localStorageService.getItem('login_user_pharmacy_drugs_stores');
        let login_user_district = info[0]?.Pharmacy_drugs_store?.district

        let params = {
            issuance_type: ["RMSD Main"],
            'order[0]': ['createdAt', 'ASC'],
            district: login_user_district,
            // limit:1,
        };

        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('cheking institjhjj', res)
            this.setState({
                dpInstitution:res.data.view.data
            })
            
        }
    }

    componentDidMount() {
        this.loadWardData();
        this.loadAllConsultant();
        this.getUserRole()
        this.detDPInstitution()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.formData.item_name !== this.state.formData.item_name || prevState.formData.sr_no !== this.state.formData.sr_no) {
            this.loadItemData();
        } else if (prevState.formData.phn !== this.state.formData.phn) {
            this.loadPatientData();
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <CardTitle title="New Local Purchase Request" />
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.onSubmit()}
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid container spacing={2} direction="row">
                                {/* Filter Section */}
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    {/* Item Series Definition */}
                                    <Grid container spacing={2}>
                                        {/* Item Series heading */}
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <SubTitle title="Local Purchase Initial Details" />
                                            <Divider className='mt-2' />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <Grid container spacing={2}>
                                                {/* Name*/}
                                                {!this.state.currentUserRole ?
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={8}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Institute" />
                                                    <Autocomplete
                                                        disableClearable
                                                        className="w-full"
                                                        options={this.state.dpInstitution}
                                                        onChange={(e, value) => {
                                                            if (value) {
                                                                let formData =
                                                                    this.state.dpInst
                                                                formData.owner_id =
                                                                    value.owner_id
                                                                // console.log("ID: ", value)
                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }
                                                        }}
                                                        // value={this.state.wardList.find((ward) => ward.id == this.state.formData.ward_id)}
                                                        getOptionLabel={(option) =>
                                                            option.name
                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Please choose"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                // value={
                                                                //     this.state.formData
                                                                //         .ward_id
                                                                // }
                                                            />
                                                        )}
                                                        
                                                    />
                                                </Grid>
                                                : 
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={8}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Institute" />
                                                    <TextValidator
                                                        //disabled
                                                        className=" w-full"
                                                        placeholder="Institute"
                                                        disabled
                                                        name="institute"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.loading ? this.state.hospital?.name ? this.state.hospital.name : 'Not Available' : 'Loading'
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                hospital: {
                                                                    ...this
                                                                        .state
                                                                        .hospital,
                                                                    name:
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
                                                }
                                                {/* Short Reference*/}
                                                {this.state.currentUserRole && 
                                                <>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={8}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Ward/Clinic/Lab" />
                                                    <Autocomplete
                                                        disableClearable
                                                        className="w-full"
                                                        options={this.state.wardList}
                                                        onChange={(e, value) => {
                                                            if (value) {
                                                                let formData =
                                                                    this.state.formData
                                                                formData.ward_id =
                                                                    value.id
                                                                // console.log("ID: ", value)
                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }
                                                        }}
                                                        value={this.state.wardList.find((ward) => ward.id == this.state.formData.ward_id)}
                                                        getOptionLabel={(option) =>
                                                            option.name
                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Please choose"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={
                                                                    this.state.formData
                                                                        .ward_id
                                                                }
                                                            />
                                                        )}
                                                        
                                                    />
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={8}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Consultant Name" />
                                                    <Autocomplete
                                                        disableClearable
                                                        className="w-full"
                                                        options={this.state.consultantList}
                                                        onChange={(e, value) => {
                                                            if (value) {
                                                                let formData =
                                                                    this.state.formData
                                                                formData.consultant_id =
                                                                    value.id
                                                                // console.log("ID: ", value)
                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }
                                                        }}
                                                        value={this.state.consultantList.find((consultant) => consultant.id == this.state.formData.consultant_id)}
                                                        getOptionLabel={(option) =>
                                                            option.name
                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Please choose"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={
                                                                    this.state.formData
                                                                        .consultant_id
                                                                }
                                                            />
                                                        )}
                                                    />
                                                    {/* <AddInput
                                                        options={this.state.consultantList}
                                                        val={this.state.formData.consultant_name}
                                                        getOptionLabel={(option) => option.name || ""}
                                                        text='Consultant Name'
                                                        onChange={(e, value) => {
                                                            console.log("selected value", value)
                                                            const newFormData = {
                                                                ...this.state.formData,
                                                                consultant_name: e.target.textContent ? e.target.textContent : e.target.value,
                                                                consultant_id: value ? value.id : null,
                                                            };

                                                            this.setState({ formData: newFormData });
                                                        }
                                                        }
                                                    /> */}
                                                </Grid>
                                                <Grid className=" w-full"
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}>
                                                    <SubTitle title="Patient Basis or Not" />
                                                    <FormControl component="fieldset">
                                                        <RadioGroup
                                                            name="truefalse"
                                                            value={this.state.formData.is_patient_base}
                                                            onChange={(e) => {
                                                                let formData = this.state.formData
                                                                formData.is_patient_base = e.target.value === 'true' ? true : false;
                                                                this.setState({ formData })
                                                            }}
                                                            style={{ display: "block" }}
                                                        >
                                                            <FormControlLabel
                                                                value={true}
                                                                control={<Radio />}
                                                                label="Yes"
                                                            />
                                                            <FormControlLabel
                                                                value={false}
                                                                control={<Radio />}
                                                                label="No"
                                                            />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid>
                                                </>
                                                }
                                            </Grid>
                                            {this.state.currentUserRole && 
                                            <>
                                            {this.state.formData.is_patient_base ?
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={12}
                                                        md={12}
                                                        lg={12}
                                                    >
                                                        <SubTitle title="Patient Details" />
                                                        <Divider className='mt-2' />
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "10px 0" }}>
                                                            <div style={{ marginRight: "12px" }}>
                                                                <Typography className=" text-gray font-semibold text-13" style={{ lineHeight: '1', }}>Add New</Typography>
                                                            </div>
                                                            <div>
                                                                <Tooltip title="Add New Patient">
                                                                    <LoonsSwitch
                                                                        value={this.state.formData.isNewPatient}
                                                                        color="primary"
                                                                        onChange={() => {
                                                                            let formData = this.state.formData;
                                                                            formData.patient_id = null;
                                                                            formData.phn = null;
                                                                            formData.patient_name = null;
                                                                            formData.bht_or_clinic_no = null;
                                                                            formData.nic = null;
                                                                            formData.isNewPatient = !formData.isNewPatient;
                                                                            this.setState({ formData });
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    {this.state.formData.isNewPatient ?
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            sm={12}
                                                            md={12}
                                                            lg={12}
                                                        >
                                                            <Grid container spacing={2}>
                                                                {/* Serial Number*/}
                                                                <Grid
                                                                    className=" w-full"
                                                                    item
                                                                    lg={4}
                                                                    md={4}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    <SubTitle title="PHN No" />
                                                                    <TextValidator
                                                                        key={this.state.key}
                                                                        className="w-full"
                                                                        placeholder="PHN No"
                                                                        name="phn"
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                        }}
                                                                        value={
                                                                            this.state.formData.phn ? this.state.formData.phn : ""
                                                                        }
                                                                        type="text"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                formData: {
                                                                                    ...this
                                                                                        .state
                                                                                        .formData,
                                                                                    phn:
                                                                                        e.target
                                                                                            .value,
                                                                                },
                                                                            })
                                                                        }}
                                                                        // validators={[
                                                                        //     'required', 'matchRegexp:^[0-9]{8}$'
                                                                        // ]}
                                                                        // errorMessages={[
                                                                        //     'this field is required', 'Invalid PHN'
                                                                        // ]}
                                                                    />
                                                                </Grid>
                                                                <Grid
                                                                    className=" w-full"
                                                                    item
                                                                    lg={4}
                                                                    md={4}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    <SubTitle title="Nic No" />
                                                                    <TextValidator
                                                                        key={this.state.key}
                                                                        className="w-full"
                                                                        placeholder="Nic No"
                                                                        name="nic"
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                        }}
                                                                        value={
                                                                            this.state.formData.nic ? this.state.formData.nic : ""
                                                                        }
                                                                        type="text"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                formData: {
                                                                                    ...this
                                                                                        .state
                                                                                        .formData,
                                                                                    nic:
                                                                                        e.target
                                                                                            .value.toUpperCase(),
                                                                                },
                                                                            })
                                                                        }}
                                                                        validators={[
                                                                            // 'required', 
                                                                            'matchRegexp:^([0-9]{9}[x|X|v|V]|[0-9]{12})$'
                                                                        ]}
                                                                        errorMessages={[
                                                                            // 'this field is required', 
                                                                            'Invalid NIC'
                                                                        ]}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container spacing={2}>
                                                                {/* Serial Number*/}
                                                                {/* Name*/}
                                                                <Grid
                                                                    className=" w-full"
                                                                    item
                                                                    lg={4}
                                                                    md={4}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    <SubTitle title="Patient Name" />
                                                                    <TextValidator
                                                                        key={this.state.key}
                                                                        className=" w-full"
                                                                        placeholder="Patient Name"
                                                                        name="patient_name"
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                        }}
                                                                        value={
                                                                            this.state.formData.patient_name ? this.state.formData.patient_name : ''
                                                                        }
                                                                        type="text"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                formData: {
                                                                                    ...this
                                                                                        .state
                                                                                        .formData,
                                                                                    patient_name:
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
                                                                    className=" w-full"
                                                                    item
                                                                    lg={4}
                                                                    md={4}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    <SubTitle title="BHT / Clinic No" />
                                                                    <TextValidator
                                                                        key={this.state.key}
                                                                        className="w-full"
                                                                        placeholder="BHT / Clinic No"
                                                                        name="bht"
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                        }}
                                                                        value={
                                                                            this.state.formData.bht_or_clinic_no ? this.state.formData.bht_or_clinic_no : ''
                                                                        }
                                                                        type="text"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                formData: {
                                                                                    ...this
                                                                                        .state
                                                                                        .formData,
                                                                                        bht_or_clinic_no:
                                                                                        e.target
                                                                                            .value,
                                                                                },
                                                                            })
                                                                        }}
                                                                        validators={[
                                                                            'required'
                                                                        ]}
                                                                        errorMessages={[
                                                                            'this field is required'
                                                                        ]}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid> :
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            sm={12}
                                                            md={12}
                                                            lg={12}
                                                        >
                                                            <Grid container spacing={2}>
                                                                {/* Serial Number*/}
                                                                <Grid
                                                                    className=" w-full"
                                                                    item
                                                                    lg={4}
                                                                    md={4}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    <SubTitle title="PHN No" />
                                                                    <AddInput
                                                                        key={this.state.key}
                                                                        options={this.state.patientList}
                                                                        val={this.state.formData.phn}
                                                                        text='PHN No'
                                                                        getOptionLabel={(option) => option.phn || ""}
                                                                        onChange={(e, value) => {
                                                                            const newFormData = {
                                                                                ...this.state.formData,
                                                                                phn: e.target.textContent ? e.target.textContent : e.target.value,
                                                                            };
                                                                            if (value) {
                                                                                this.loadClinicData(value)
                                                                            }
                                                                            this.setState({ formData: newFormData });
                                                                        }
                                                                        }
                                                                    />
                                                                    {/* <TextValidator
                                                                className=" w-full"
                                                                placeholder="PHN No"
                                                                name="phn"
                                                                InputLabelProps={{
                                                                    shrink: false,
                                                                }}
                                                                value={
                                                                    this.state.formData
                                                                        .phn
                                                                }
                                                                type="text"
                                                                variant="outlined"
                                                                size="small"
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        formData: {
                                                                            ...this
                                                                                .state
                                                                                .formData,
                                                                            phn:
                                                                                e.target
                                                                                    .value,
                                                                        },
                                                                    })
                                                                }}
                                                                validators={[
                                                                    'required', 'matchRegexp:^\s*([0-9a-zA-Z]*)\s*$'
                                                                ]}
                                                                errorMessages={[
                                                                    'this field is required',
                                                                    'Invalid Inputs'
                                                                ]}
                                                            /> */}
                                                                </Grid>
                                                                <Grid
                                                                    className=" w-full"
                                                                    item
                                                                    lg={4}
                                                                    md={4}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    <SubTitle title="Nic No" />
                                                                    <TextValidator
                                                                        disabled
                                                                        key={this.state.key}
                                                                        className="w-full"
                                                                        placeholder="Nic No"
                                                                        name="nic"
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                        }}
                                                                        value={
                                                                            this.state.formData.nic ? this.state.formData.nic : ""
                                                                        }
                                                                        type="text"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                formData: {
                                                                                    ...this
                                                                                        .state
                                                                                        .formData,
                                                                                    nic:
                                                                                        e.target
                                                                                            .value,
                                                                                },
                                                                            })
                                                                        }}
                                                                    // validators={[
                                                                    //     'required'
                                                                    // ]}
                                                                    // errorMessages={[
                                                                    //     'this field is required'
                                                                    // ]}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container spacing={2}>
                                                                {/* Serial Number*/}
                                                                {/* Name*/}
                                                                <Grid
                                                                    className=" w-full"
                                                                    item
                                                                    lg={4}
                                                                    md={4}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    <SubTitle title="Patient Name" />
                                                                    <TextValidator
                                                                        disabled
                                                                        key={this.state.key}
                                                                        className=" w-full"
                                                                        placeholder="Patient Name"
                                                                        name="patient_name"
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                        }}
                                                                        value={
                                                                            this.state.formData.patient_name ? this.state.formData.patient_name : ""
                                                                        }
                                                                        type="text"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                formData: {
                                                                                    ...this
                                                                                        .state
                                                                                        .formData,
                                                                                    patient_name:
                                                                                        e.target
                                                                                            .value,
                                                                                },
                                                                            })
                                                                        }}
                                                                    // validators={[
                                                                    //     'required',
                                                                    // ]}
                                                                    // errorMessages={[
                                                                    //     'this field is required',
                                                                    // ]}
                                                                    />
                                                                </Grid>
                                                                <Grid
                                                                    className=" w-full"
                                                                    item
                                                                    lg={4}
                                                                    md={4}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    <SubTitle title="BHT / Clinic No" />
                                                                    <TextValidator
                                                                        disabled
                                                                        key={this.state.key}
                                                                        className=" w-full"
                                                                        placeholder="BHT / Clinic No"
                                                                        name="bht"
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                        }}
                                                                        value={
                                                                            this.state.formData.bht ? this.state.formData.bht : ""
                                                                        }
                                                                        type="text"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                formData: {
                                                                                    ...this
                                                                                        .state
                                                                                        .formData,
                                                                                    bht:
                                                                                        e.target
                                                                                            .value,
                                                                                },
                                                                            })
                                                                        }}
                                                                    // validators={[
                                                                    //     'required'
                                                                    // ]}
                                                                    // errorMessages={[
                                                                    //     'this field is required'
                                                                    // ]}
                                                                    />
                                                                    {/* <Autocomplete
                                                                disableClearable
                                                                className="w-full"
                                                                options={this.state.bht}
                                                                onChange={(e, value) => {
                                                                    if (null != value) {
                                                                        let formData =
                                                                            this.state.formData
                                                                        formData.bht =
                                                                            e.target.value
                                                                        this.setState({
                                                                            formData,
                                                                        })
                                                                    }
                                                                }}
                                                                // value={this.state.bht.find((bht) => bht.id == this.state.formData.bht)}
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
                                                                            this.state.formData
                                                                                .status
                                                                        }
                                                                    />
                                                                )}
                                                            /> */}
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    }
                                                </Grid>
                                                : null}
                                            </>
                                            }
                                            {/* Patient Details*/}
                                            <Grid container spacing={2}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Grid container spacing={2} className='mt-2'>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            sm={12}
                                                            md={12}
                                                            lg={12}
                                                        >
                                                            <SubTitle title="Item Details" />
                                                            <Divider className='mt-2' />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={2} >
                                                        <Grid
                                                            className=" w-full"
                                                            item
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            xs={12}
                                                        >
                                                            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "10px 0" }}>
                                                                <div style={{ marginRight: "12px" }}>
                                                                    <Typography className=" text-gray font-semibold text-13" style={{ lineHeight: '1', }}>Add New</Typography>
                                                                </div>
                                                                <div>
                                                                    <Tooltip title="Add New Item">
                                                                        <LoonsSwitch
                                                                            value={this.state.formData.isNewItem}
                                                                            color="primary"
                                                                            onChange={() => {
                                                                                let formData = this.state.formData;
                                                                                formData.item_id = null;
                                                                                formData.item_name = null;
                                                                                formData.estimated_price = null;
                                                                                formData.unit_price = null;
                                                                                formData.sr_no = null;
                                                                                formData.warehouse = null;
                                                                                formData.isNewItem = !formData.isNewItem;
                                                                                this.setState({ formData });
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                    {this.state.formData.isNewItem ?
                                                        <Grid container spacing={2}>
                                                            {/* Serial Number*/}
                                                            {/* Name*/}
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={4}
                                                                md={4}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <SubTitle title='Item Name' />
                                                                <TextValidator
                                                                    className=" w-full"
                                                                    placeholder="Item Name"
                                                                    name="item_name"
                                                                    InputLabelProps={{
                                                                        shrink: false,
                                                                    }}
                                                                    value={this.state.formData.item_name ? this.state.formData.item_name : ""}
                                                                    type="text"
                                                                    variant="outlined"
                                                                    size="small"
                                                                    onChange={(e) => {
                                                                        this.setState({
                                                                            formData: {
                                                                                ...this
                                                                                    .state
                                                                                    .formData,
                                                                                item_name:
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
                                                            <Grid className='w-full' item lg={4} md={4} sm={12} xs={12}>
                                                                <SubTitle title="Unit Price" />
                                                                <TextValidator
                                                                    className=" w-full"
                                                                    placeholder="Unit Price"
                                                                    name="unit_price"
                                                                    InputLabelProps={{
                                                                        shrink: false,
                                                                    }}
                                                                    value={this.state.formData.unit_price}
                                                                    type="number"
                                                                    min={0}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    onChange={(e) => {
                                                                        this.setState({
                                                                            formData: {
                                                                                ...this
                                                                                    .state
                                                                                    .formData,
                                                                                unit_price:
                                                                                    e.target.value === "" ? 0 : parseFloat(e.target
                                                                                        .value),
                                                                            },
                                                                        })
                                                                    }}
                                                                    validators={
                                                                        ['minNumber:' + 0, 'required:' + true]}
                                                                    errorMessages={[
                                                                        'Unit Price Should be > 0',
                                                                        'this field is required'
                                                                    ]}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        :
                                                        <Grid container spacing={2}>
                                                            {/* Serial Number*/}
                                                            {/* Name*/}
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={4}
                                                                md={4}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <SubTitle title="Sr No" />
                                                                <AddInput
                                                                    options={this.state.itemList}
                                                                    val={this.state.formData.sr_no}
                                                                    getOptionLabel={(option) => option?.sr_no|| ""}
                                                                    text='Sr No'
                                                                    onChange={(e, value) => {
                                                                        console.log("selected value", value)
                                                                        const newFormData = {
                                                                            ...this.state.formData,
                                                                            sr_no: e.target.textContent ? e.target.textContent : e.target.value,
                                                                            item_name: value ? value.medium_description : null,
                                                                            item_id: value ? value.id : null,
                                                                            unit_price: value ? value.standard_cost : null,
                                                                            warehouse: value ? value?.Warehouse?.name : null
                                                                        };

                                                                        this.setState({ formData: newFormData },()=>{
                                                                            this.getHospitalEstimation()
                                                                        });
                                                                        // formData.item_id = value ? value.id : null;
                                                                        // if (e.target.value === '') {
                                                                        //     console.log("Value: ", e.target.value)
                                                                        //     // if (formData.item_id) {
                                                                        //     //     formData.item_name = value ? value.medium_description : null;
                                                                        //     // }
                                                                        // }
                                                                    }
                                                                    }
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={4}
                                                                md={4}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <SubTitle title="Item Name" />
                                                                <AddInput
                                                                    options={this.state.itemList}
                                                                    val={this.state.formData.item_name}
                                                                    getOptionLabel={(option) => option.medium_description || ""}
                                                                    text='Item Name'
                                                                    onChange={(e, value) => {
                                                                        const newFormData = {
                                                                            ...this.state.formData,
                                                                            item_name: e.target.textContent ? e.target.textContent : e.target.value,
                                                                            item_id: value ? value.id : null,
                                                                            sr_no: value ? value.sr_no : null,
                                                                            unit_price: value ? value.standard_cost : null,
                                                                            warehouse: value ? value?.Warehouse?.name : null
                                                                        };
                                                                        // formData.item_id = value ? value.id : null;
                                                                        this.setState({ formData: newFormData });

                                                                        // if (e.target.value === '') {
                                                                        //     let formData = this.state.formData;
                                                                        //     formData.sr_no = null;
                                                                        //     formData.item_id = null;
                                                                        //     console.log("Value: 0")

                                                                        //     this.setState({ formData })
                                                                        //     // if (formData.item_id) {
                                                                        //     //     formData.item_name = value ? value.medium_description : null;
                                                                        //     // }
                                                                        // }
                                                                    }
                                                                    }
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    }

                                                    {/* Serial Number*/}
                                                    <Grid container spacing={2}>
                                                        {!this.state.formData.isNewItem ?
                                                            <>
                                                                <Grid className='w-full' item lg={4} md={4} sm={12} xs={12}>
                                                                    <SubTitle title="Warehouse Code" />
                                                                    <TextValidator
                                                                        disabled
                                                                        className="w-full"
                                                                        placeholder="Warehouse Code"
                                                                        name="code"
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                        }}
                                                                        value={this.state.formData.warehouse ? this.state.formData.warehouse : ""}
                                                                        //type="number"
                                                                        //min={0}
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onChange={(e) => null}
                                                                    // validators={
                                                                    //     ['minNumber:' + 0, 'required:' + true]}
                                                                    // errorMessages={[
                                                                    //     'Budget Should be > 0',
                                                                    //     'this field is required'
                                                                    // ]}
                                                                    />
                                                                </Grid>
                                                                <Grid className='w-full' item lg={4} md={4} sm={12} xs={12}>
                                                                    <SubTitle title="Estimated Unit Price" />
                                                                    <TextValidator
                                                                        disabled
                                                                        className=" w-full"
                                                                        placeholder="Estimated Unit Price"
                                                                        name="unit_price"
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                        }}
                                                                        value={this.state.formData.unit_price ? 'LKR ' + String(this.state.formData.unit_price) : 'LKR 0.0'}
                                                                        //type="number"
                                                                        //min={0}
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onChange={(e) => null}
                                                                    // validators={
                                                                    //     ['minNumber:' + 0, 'required:' + true]}
                                                                    // errorMessages={[
                                                                    //     'Budget Should be > 0',
                                                                    //     'this field is required'
                                                                    // ]}
                                                                    />
                                                                </Grid>
                                                            </>
                                                            : null
                                                        }
                                                    </Grid>
                                                    <Grid container spacing={2}>
                                                        {!this.state.formData.isNewItem ?
                                                            <>
                                                                <Grid className='w-full' item lg={4} md={4} sm={12} xs={12}>
                                                                    <SubTitle title="Annual Estimation" />
                                                                    <TextValidator
                                                                        disabled
                                                                        className="w-full"
                                                                        placeholder="Annual Estimation"
                                                                        name="code"
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                        }}
                                                                        value={this.state?.estimationData[0]?.estimation ? this.state?.estimationData[0]?.estimation : ""}
                                                                        //type="number"
                                                                        //min={0}
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onChange={(e) => null}
                                                                    // validators={
                                                                    //     ['minNumber:' + 0, 'required:' + true]}
                                                                    // errorMessages={[
                                                                    //     'Budget Should be > 0',
                                                                    //     'this field is required'
                                                                    // ]}
                                                                    />
                                                                </Grid>
                                                                <Grid className='w-full' item lg={4} md={4} sm={12} xs={12}>
                                                                    <SubTitle title="Monthly Requirement" />
                                                                    <TextValidator
                                                                        disabled
                                                                        className=" w-full"
                                                                        placeholder="Monthly Requirement"
                                                                        name="Monthly Requirement"
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                        }}
                                                                        value={this.state?.estimationData[0] ? roundDecimal(parseInt(this.state?.estimationData[0]?.estimation, 10) / 12, 2) : ''}
                                                                        //type="number"
                                                                        //min={0}
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onChange={(e) => null}
                                                                    // validators={
                                                                    //     ['minNumber:' + 0, 'required:' + true]}
                                                                    // errorMessages={[
                                                                    //     'Budget Should be > 0',
                                                                    //     'this field is required'
                                                                    // ]}
                                                                    />
                                                                </Grid>
                                                            </>
                                                            : null
                                                        }
                                                    </Grid>
                                                    <Grid container spacing={2}>
                                                        <Grid
                                                            className=" w-full"
                                                            item
                                                            lg={4}
                                                            md={4}
                                                            sm={12}
                                                            xs={12}
                                                        >
                                                            <SubTitle title="Required Quantity" />
                                                            <TextValidator
                                                                className=" w-full"
                                                                placeholder="Required Quantity"
                                                                name="quantity"
                                                                required
                                                                InputLabelProps={{
                                                                    shrink: false,
                                                                }}
                                                                value={
                                                                    String(this.state.formData
                                                                        .required_quantity)
                                                                }
                                                                type="number"
                                                                min={0}
                                                                variant="outlined"
                                                                size="small"
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        formData: {
                                                                            ...this
                                                                                .state
                                                                                .formData,
                                                                            required_quantity:
                                                                                parseInt(e.target
                                                                                    .value, 10),
                                                                        },
                                                                    })
                                                                }}
                                                                // validators={
                                                                //     ['minNumber:' + 0, 'required:' + true]}
                                                                // errorMessages={[
                                                                //     'Quantity Should be > 0',
                                                                //     'this field is required'
                                                                // ]}
                                                                validators={
                                                                    ['minNumber:' + 0]}
                                                                errorMessages={[
                                                                    'Quantity Should be > 0'
                                                                ]}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            className=" w-full"
                                                            item
                                                            lg={4}
                                                            md={4}
                                                            sm={12}
                                                            xs={12}
                                                        >
                                                            <SubTitle title="Estimated Total Price" />
                                                            <TextValidator
                                                                disabled
                                                                className=" w-full"
                                                                placeholder="Estimated Total Price"
                                                                name="quantity"
                                                                InputLabelProps={{
                                                                    shrink: false,
                                                                }}
                                                                value={this.state.formData.unit_price && this.state.formData
                                                                    .required_quantity ? 'LKR ' + String(roundDecimal(parseFloat(this.state.formData.unit_price) * parseInt(this.state.formData.required_quantity), 2)) : "LKR 0.0"}
                                                                // type="number"
                                                                // min={0}
                                                                variant="outlined"
                                                                size="small"
                                                                onChange={(e) => null}
                                                            // validators={
                                                            //     ['minNumber:' + 0, 'required:' + true]}
                                                            // errorMessages={[
                                                            //     'Budget Should be > 0',
                                                            //     'this field is required'
                                                            // ]}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={2}>
                                                        <Grid
                                                            className=" w-full"
                                                            item
                                                            lg={4}
                                                            md={4}
                                                            sm={12}
                                                            xs={12}
                                                        >
                                                            <SubTitle title="Required Date" />
                                                            <DatePicker
                                                                style={{ border: '1px solid #e5e7eb', borderRadius: 5 }}
                                                                key={this.state.key}
                                                                required={true}
                                                                className="w-full"
                                                                onChange={(date) => {
                                                                    let formData = this.state.formData
                                                                    formData.required_date = dateParse(date)
                                                                    this.setState({ formData })
                                                                }}
                                                                // format="yyyy"
                                                                // openTo='year'
                                                                // views={["year"]}
                                                                value={this.state.formData.required_date}
                                                                placeholder="Required Date"
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={2}>
                                                        <Grid
                                                            className=" w-full"
                                                            item
                                                            lg={4}
                                                            md={4}
                                                            sm={12}
                                                            xs={12}
                                                        >
                                                            <SubTitle title="Justification" />
                                                            <TextValidator
                                                                multiline
                                                                rows={4}
                                                                className=" w-full"
                                                                placeholder="Justification"
                                                                name="description"
                                                                InputLabelProps={{
                                                                    shrink: false,
                                                                }}
                                                                value={
                                                                    this.state.formData
                                                                        .justification
                                                                }
                                                                type="text"
                                                                variant="outlined"
                                                                size="small"
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        formData: {
                                                                            ...this
                                                                                .state
                                                                                .formData,
                                                                            justification:
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
                                                    </Grid>

                                                </Grid>
                                                {/* Item Details */}
                                                {/* Submit and Cancel Button */}
                                                <Grid
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <Grid container spacing={2} className='my-5'>
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
                                                                className="mt-2 mr-2"
                                                                progress={false}
                                                                disabled={this.state.source_id ? true : false}
                                                                type="submit"
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                startIcon="save"
                                                            //onClick={this.handleChange}
                                                            >
                                                                <span className="capitalize">
                                                                    Request
                                                                </span>
                                                            </Button>
                                                            {this.state.printButtonEnabled ?
                                                            <Button
                                                                className="mt-2 mr-2"
                                                                progress={false}
                                                                // disabled={this.state.source_id ? true : false}
                                                                // type="submit"
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                startIcon="print"
                                                            onClick={()=>{
                                                                this.printData()
                                                            }}
                                                            >
                                                                <span className="capitalize">
                                                                    Print
                                                                </span>
                                                            </Button>
                                                            :null}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                        {this.state.ploaded ?
                            // <PurchaseOrderList />
                            <LpPrint purchaseOrderData={this.state.purchaseOrderData} hospital={this.state.hospital} supplier={this.state.supplier} user={this.state.user} uom={this.state.Uom_Data} />
                            // <LPPrintView purchaseOrderData={this.state.purchaseOrderData} hospital={this.state.hospital} supplier={this.state.supplier} user={this.state.user} />
                            :
                            <Grid className="justify-center text-center w-full pt-12">
                                {/* <CircularProgress size={30} /> */}
                            </Grid>
                        }
                        {this.state.source_id &&
                            <Grid container spacing={2}>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <br />
                                    <SwasthaFilePicker
                                        // uploadingSectionVisibility={this.state.loginUserRoles.includes('Hospital Admin')}
                                        id="file_public"
                                        singleFileEnable={true}
                                        multipleFileEnable={false}
                                        dragAndDropEnable={true}
                                        tableEnable={true}

                                        documentName={true}//document name enable
                                        documentNameValidation={['required']}
                                        documenterrorMessages={['this field is required']}
                                        documentNameDefaultValue={null}//document name default value. if not value set null

                                        type={false}
                                        types={null}
                                        typeValidation={null}
                                        typeErrorMessages={null}
                                        defaultType={null}// null

                                        description={true}
                                        descriptionValidation={null}
                                        descriptionErrorMessages={null}
                                        defaultDescription={null}//null

                                        onlyMeEnable={false}
                                        defaultOnlyMe={false}

                                        source="local_purchase"
                                        source_id={this.state.source_id}

                                        //accept="image/png"
                                        // maxFileSize={1048576}
                                        // maxTotalFileSize={1048576}
                                        maxFilesCount={1}
                                        validators={[
                                            'required',
                                            // 'maxSize',
                                            // 'maxTotalFileSize',
                                            // 'maxFileCount',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                            // 'file size too lage',
                                            // 'Total file size is too lage',
                                            // 'Too many files added',
                                        ]}
                                        /* selectedFileList={
                                            this.state.data.fileList
                                        } */
                                        label="Select Attachment"
                                        singleFileButtonText="Upload Data"
                                    // multipleFileButtonText="Select Files"
                                    >
                                    </SwasthaFilePicker>
                                </Grid>
                            </Grid>
                        }
                    </LoonsCard>
                </MainContainer>

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

export default withStyles(styleSheet)(LocalPurchaseRequest)
