import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import Favourite from "./components/favourites";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import PatientSelection from "./components/patientSelection";
import { Dialog, } from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import ClinicService from 'app/services/ClinicService';
import EmployeeServices from 'app/services/EmployeeServices'
import localStorageService from "app/services/localStorageService";
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
    LoonsDialogBox
} from 'app/components/LoonsLabComponents'
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

class Favourites extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialog_for_select_frontDesk: false,
            login_clinic: {},
            all_front_desk: [],
            loaded: false,
        }
    }


    async loadFrontDesk() {

        this.setState({ loaded: false })
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)

        var id = user.id;
        var all_front_desk_dummy = [];


        let emp_res = await EmployeeServices.getAsignEmployees({ employee_id: id, issuance_type: 'Clinic' });
        if (emp_res.status == 200) {
            emp_res.data.view.data.forEach(element => {
                all_front_desk_dummy.push({
                    name: element.Pharmacy_drugs_store.name,
                    clinic_id: element.Pharmacy_drugs_store.id,
                    clinic_doctor_id:element.id
                })
            });

            this.setState({
                all_front_desk: all_front_desk_dummy,

            })

            let store_data = await localStorageService.getItem('Login_user_Clinic_prescription');
            if (store_data == null) {

                this.setState({
                    dialog_for_select_frontDesk: true
                })
            } else {
                this.loadClinic(store_data.clinic_id)
                this.setState({
                    login_clinic: store_data,
                    loaded: true,

                }, () => {

                    //console.log("params list",this.state.formData)
                })
            }

            console.log("frontdesk", this.state.all_front_desk)

            //this.loadRelatedHospitals(emp_res.data.view.data[0])




            /*   this.setState({
                  login_hospital: frontDesk_id
              }) */
        }


    }

    async loadClinic(id) {
        let params = {}
        let res = await ClinicService.fetchClinicsById(params, id);
        if (res.status == 200) {
            console.log("Clinic by id", res.data.view)


            let data = {
                clinic_id: res.data.view?.id,
                owner_id: res.data.view?.owner_id,
                pharmacy_drugs_stores_id: res.data.view?.id,
                // frontDesk_id: value.id,
                name: res.data.view?.name
            }

            localStorageService.setItem('Login_user_Hospital', data);


        }

    }


    async selectFrontDesk(data) {
        console.log("selecting data", data)
        localStorageService.setItem('Login_user_Clinic_prescription', data);

        this.setState({
            login_clinic: data,
            loaded: true,
            dialog_for_select_frontDesk: false
        }, () => {
            this.loadClinic(data.clinic_id)

        })
    }

    async saveDataInLocal(data) {

        localStorageService.setItem('Login_user_Clinic_prescription', data);
        this.setState({ login_clinic: data, loaded: true }, () => {
            this.render()
        })
    }



    async componentDidMount() {

        this.loadFrontDesk()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (<Fragment>
            <div className='flex items-center justify-end'>

                <p className='px-2' style={{ color: 'black' }}><span className="font-bold text-14">You're in {this.state.login_clinic.name}</span></p>
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
            {this.state.loaded ?
                <div className="pb-24 pt-7 px-8 ">
                    <Favourite />
                </div>
                : null}


            <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_frontDesk} >

                <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                    <CardTitle title="Select Your Clinic" />

                    {/* <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ dialog_for_select_frontDesk: false }) }}>
        <CloseIcon />
    </IconButton>
*/}
                </MuiDialogTitle>



                <div className="w-full h-full px-5 py-5">
                    <ValidatorForm
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
                                    this.selectFrontDesk(value);
                                    // this.setState({ frontDesk_id: value.id })

                                }
                            }}
                            value={this.state.login_clinic}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextValidator
                                    {...params}
                                    placeholder="Select Your Clinic"
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

        </Fragment>)
    }
}

export default withStyles(styleSheet)(Favourites);