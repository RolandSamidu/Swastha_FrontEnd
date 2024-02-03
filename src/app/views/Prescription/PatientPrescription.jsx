import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import { Grid, InputAdornment, Dialog } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import PharmacistPrescription from "./components/pharmacist/prescription";
import PatientClinicHistory from "./components/pharmacist/PatientClinicHistory";
import PatientDetails from "./components/pharmacist/PatientDetails";
import PatientPrescriptionHistory from "./components/pharmacist/PatientPrescriptionHistory";
import PatientServices from 'app/services/PatientServices';
import PatientSelection from "./components/patientSelection";
import Allergies from "./components/pharmacist/Allergies";
import Diagnosis from "./components/pharmacist/Diagnosis";
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { LoonsCard, Button, SubTitle, Widget, CardTitle,LoonsSnackbar } from "app/components/LoonsLabComponents";
import fscreen from 'fscreen';
import localStorageService from 'app/services/localStorageService';
import ClinicService from 'app/services/ClinicService';
import WarehouseServices from 'app/services/WarehouseServices';

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

    root: {
        display: 'flex',
    },
});
class PatientPrescription extends Component {
    constructor(props) {
        super(props)
        this.state = {
            moreView: false,
            formData: { phn: null },
            patient_id: null,
            Loaded: false,
            clear: true,

            login_hospital: {},

            dialog_for_select_frontDesk: false,
            all_front_desk: [],

            snackbar: false,
            snackbar_message: '',
            snackbar_severity: 'success',

            count:0,
        }

    }

    async searchPatients() {

        this.setState({ Loaded: false })
        let formData = this.state.formData;
        //this.focus()

        const patientdata = await PatientServices.fetchClinicWardPatientsByAttribute(formData)


        if (200 == patientdata.status) {
            if (patientdata.data.view.data.length > 0) {
                this.setState({
                    patient_id: patientdata.data.view.data[0].Patient.id,
                    Loaded: true,
                })
            } else {
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: "No Patient Prescriptions Found"
                })
            }
        } 
    }

    async focus() {
        let formData = this.state.formData;
        formData.phn = null;


        document.getElementById('phn_search').focus();
        document.getElementById('phn_search').value = null;
        setTimeout(() => {
            this.setState({
                Loaded: false,
                formData:formData,
                count:this.state.count+1
            })
        }, 500);
        console.log("count",this.state.count)
        if(this.state.count==5){
            window.location.reload();
        }
        //window.location.reload();
    }

    async loadRelatedHospitals(value) {
        let params = { issuance_type: "Hospital" }
        let res = await ClinicService.fetchAllClinicsNew(params, value.owner_id);
        if (res.status == 200) {
            console.log("hospital", res.data.view.data)
            if (res.data.view.data.length > 0) {
                this.saveDataInLocal(
                    {
                        hospital_id: res.data.view.data[0].id,
                        owner_id: value.owner_id,
                        pharmacy_drugs_stores_id: value.pharmacy_drugs_stores_id,
                        frontDesk_id: value.id,
                        name: value.name
                    })

                this.setState({ dialog_for_select_frontDesk: false, })
            }

        }
    }
    async saveDataInLocal(data) {

        await localStorageService.setItem('Login_user_Hospital', data);
        this.setState({ login_hospital: data }, () => {
          
        })
    }

    async loadFrontDesk() {


        var user = await localStorageService.getItem('userInfo');
        //console.log('user', user)

        var id = user.id;
        var all_front_desk_dummy = [];


        var frontDesk_id = await localStorageService.getItem('Login_user_Hospital');
        if (!frontDesk_id) {
            this.setState({ dialog_for_select_frontDesk: true, userRoles: user.roles })


        } else {
            this.setState({
                login_hospital: frontDesk_id, userRoles: user.roles
            }, () => {

            })
        }



        let params = { employee_id: id, }
        let res = await WarehouseServices.getWareHouseUsers(params);
        let all_pharmacy_dummy = []
        if (res.status == 200) {
            console.log("CPALLOders", res.data.view.data)

            res.data.view.data.forEach(element => {
                /* all_pharmacy_dummy.push(
                    {
                        warehouse: element.Warehouse,
                        name: element.Warehouse.name,
                        main_or_personal: element.Warehouse.main_or_personal,
                        owner_id: element.Warehouse.owner_id,
                        id: element.warehouse_id,
                        pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
                    }
 
                ) */
                if (element.Warehouse.main_or_personal == "Personal") {
                    all_front_desk_dummy.push(
                        {
                            Pharmacy_drugs_store: element.Warehouse,
                            name: element.Warehouse.name,
                            id: element.id,
                            owner_id: element.Warehouse.owner_id,
                            pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
                        }

                    )
                }



            });
            console.log("desk data", all_front_desk_dummy)
            this.setState({ all_front_desk: all_front_desk_dummy })


        }



    }

    componentDidMount() {
        this.loadFrontDesk()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        let patient_id = this.state.patient_id;



        return (
            <div className="px-5 py-5">
                <Widget title="Patient Prescription" id="patient_pres">
                    <Fragment>
                        <Grid container className='px-2'>
                            <Grid
                                className=" w-full"
                                item
                                lg={8}
                                md={8}
                                sm={8}
                                xs={8}
                            >
                                <ValidatorForm
                                    onSubmit={() => this.searchPatients()}
                                    autoComplete="off"
                                    onError={() => null}
                                    className="w-full"
                                >



                                    <TextValidator
                                        className=" w-full"
                                        id="phn_search"
                                        placeholder="PHN"
                                        name="phn"
                                        autoFocus={true}
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        value={this.state.formData.phn}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.phn =
                                                e.target.value
                                            this.setState({ formData })
                                        }}
                                        validators={['matchRegexp:^([0-9]{11})$']}
                                        errorMessages={[
                                            'Invalid Inputs',
                                        ]}

                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <SearchIcon type="submit" /* onClick={() => { this.searchPatients() }} */></SearchIcon>
                                                </InputAdornment>
                                            )
                                        }}


                                    />

                                </ValidatorForm>
                            </Grid>
                            <Grid
                                className=" w-full"
                                item
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                            >

                                <div className='flex items-center justify-end'>
                                    <p className='px-2' style={{ color: 'black' }}><span className="font-bold text-14">You're in {this.state.login_hospital.name}</span></p>
                                    <Button
                                        className="mx-1 "
                                        progress={false}
                                        scrollToTop={false}
                                        //startIcon="search"
                                        onClick={() => {
                                            //window.open(`/patients/registration`, '_blank');
                                            this.setState({ dialog_for_select_frontDesk: true })
                                        }}
                                    >
                                        <span className="capitalize">Change</span>
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                        {this.state.Loaded ?
                            <div>
                                <div className="pt-7 px-8 ">
                                    <PharmacistPrescription patient_id={patient_id} onFocus={() => { this.focus() }} from="PatientPrescription" />
                                </div>

                                <div className="pt-1 px-8 ">
                                    <Button

                                        progress={false}
                                        //type="submit"
                                        // scrollToTop={true}
                                        //startIcon="save"
                                        onClick={() => {
                                            this.setState({ moreView: !this.state.moreView })
                                        }}
                                    >
                                        <span className="capitalize">{this.state.moreView ? "Hide Info" : "More Info"}</span>
                                    </Button>
                                </div>
                                {this.state.moreView ?
                                    <div className="w-full">
                                        <Grid className="px-8" container spacing={2} style={{ display: 'flex' }}>
                                            <Grid item xs={4}>
                                                <Widget padded={false} title="Patient Clinic History" id="patient_clinic_history">
                                                    <PatientClinicHistory patient_id={patient_id} />
                                                </Widget>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <Widget padded={false} title="Patient Details" id="patient_details">
                                                    <PatientDetails patient_id={patient_id} />
                                                </Widget>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Widget title="Allergies" id="patient_Allergies">
                                                    <Allergies patient_id={patient_id} />
                                                </Widget>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Widget title="Diagnosis" id="patient_Diagnosis">
                                                    <Diagnosis patient_id={patient_id} />
                                                </Widget>
                                            </Grid>
                                        </Grid>
                                        <div className="pb-24 pt-7 px-8 ">
                                            <Widget title="Patient Prescription History" id="patient_pres_history">
                                                <PatientPrescriptionHistory patient_id={patient_id} />
                                            </Widget>
                                        </div>
                                    </div>
                                    : null}

                            </div>
                            : null}
                    </Fragment>
                </Widget>
                <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_frontDesk} >

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Select Your Pharmacy" />

                        {/* <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ dialog_for_select_frontDesk: false }) }}>
        <CloseIcon />
    </IconButton>
*/}
                    </MuiDialogTitle>



                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            //onSubmit={() => this.searchPatients()}
                            onError={() => null}
                            className="w-full"
                        >
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                // ref={elmRef}
                                options={this.state.all_front_desk}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        this.loadRelatedHospitals(value);
                                        this.setState({ frontDesk_id: value.id })

                                    }
                                }}
                                value={{
                                    name: this.state.frontDesk_id ? (this.state.all_front_desk.find((obj) => obj.id == this.state.frontDesk_id).name) : null,
                                    id: this.state.frontDesk_id
                                }}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Pharmacy"
                                        //variant="outlined"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />

                        </ValidatorForm>
                    </div>
                </Dialog>

                <LoonsSnackbar
                        open={this.state.snackbar}
                        onClose={() => {
                            this.setState({ snackbar: false })
                        }}
                        message={this.state.snackbar_message}
                        autoHideDuration={3000}
                        severity={this.state.snackbar_severity}
                        elevation={2}
                        variant="filled"
                    ></LoonsSnackbar>
            </div>
        );
    }
}

export default withStyles(styleSheet)(PatientPrescription);