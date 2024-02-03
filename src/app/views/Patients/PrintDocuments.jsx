import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Tooltip,
    Typography,
    IconButton,
} from '@material-ui/core'
import 'date-fns'

import localStorageService from 'app/services/localStorageService';
import {

    SubTitle,

    LoonsSnackbar,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import { dateParse, timeParse, dateTimeParse } from "utils";
import UtilityServices from 'app/services/UtilityServices'


const styleSheet = (theme) => ({})

class PrintDocuments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            patient_pic: null,
            //snackbar related
            alert: false,
            message: '',
            severity: 'success',
            phnSearch: null,
            clinicData: [],
            all_consultant: [],
            patientObj: {

            },

        }
    }



    async componentDidMount() {
        let data = this.props.patientDetails;
        let hospital_data = await localStorageService.getItem('Login_user_Hospital_front_desk')
        console.log("patient data", data)
        this.setState({
            patientObj: data,
            hospital_data: hospital_data
        })

    }

    async printPatientID() {

        let data = this.state.patientObj;

        console.log("data", data)
        var url = appConst.PRINT_URL + this.state.hospital_data.owner_id + "/patientId.html?";
        url = url + "institute=" + '';
        url = url + "&patientTitle=" + String(data.title == null ? '' : data.title);
        url = url + "&patientName=" + String(data.name == null ? '' : data.name);
        url = url + "&patientDOB=" + String(data.date_of_birth == null ? '' : data.date_of_birth);
        url = url + "&patientTeleNo01=" + String(data.mobile_no == null ? '' : data.mobile_no);
        url = url + "&patientTeleNo02=" + String(data.mobile_no2 == null ? '' : data.mobile_no2);
        url = url + "&patientMobile01=" + '';
        url = url + "&patientMobile02=" + '';
        url = url + "&patientID=" + String(data.phn == null ? '' : data.phn);
        console.log("url", url)

        let child = window.open(url, '_blank');

        //window.location.reload()
    }



    async printClinicCard() {
        let data = this.state.patientObj;
        console.log("patient data",data)
        let url = appConst.PRINT_URL + this.state.hospital_data.owner_id + '/patientClinicCard.html?';
        url = url + "institute=" + '';
        url = url + "&patientTitle=" + String(this.state.patientObj.title);
        url = url + "&patientName=" + String(this.state.patientObj.name);
        url = url + "&age=" + String(await UtilityServices.getAgeString(this.state.patientObj.date_of_birth));
        url = url + "&patientGender=" + String(this.state.patientObj.gender==null?"":this.state.patientObj.gender);
        url = url + "&patientMaritalstatus=" + String(this.state.patientObj.marital_status==null?"":this.state.patientObj.marital_status);
        url = url + "&patientNIC=" + String(this.state.patientObj.nic);
        url = url + "&patientAddress=" + String(this.state.patientObj.address);
        url = url + "&patientID=" + String(this.state.patientObj.phn);
        url = url + "&patientDOB=" + String(this.state.patientObj.date_of_birth == null ? "" : dateParse(this.state.patientObj.date_of_birth));

        url = url + "&clinicRegNo=" + String(data.bht);
        url = url + "&clinicNo=" + String(data.bht);
        url = url + "&clinicName=" + String(data.clinic);
        url = url + "&departmentTitle=" + String(data.Pharmacy_drugs_store?.name);
        url = url + "&consultantName=" + String(data.consultant);



        //window.open(url, '_blank'); 
        let child = window.open(url, '_blank');
        // let url2 = appConst.PRINT_URL + '/ClinicNo.html?clinicNo=' + data.bht;
        // let child2 = window.open(url2, '_blank');
        setTimeout(() => {
            // child.close()
            //child2.close()
        }, 2000);

        /*   let url2=appConst.PRINT_URL+'/ClinicNo.html?clinicNo='+data.bht;
         window.open(url2, '_blank');  */

        // window.location.reload()
    }


    async print267() {
        let data = this.state.patientObj;
        let url = appConst.PRINT_URL + this.state.hospital_data.owner_id + '/print267.html?';
        url = url + "institute=" + '';
        url = url + "&patientTitle=" + String(this.state.patientObj.title);
        url = url + "&patientName=" + String(this.state.patientObj.name);
        url = url + "&age=" + String(await UtilityServices.getAgeString(this.state.patientObj.date_of_birth));
        url = url + "&patientGender=" + String(this.state.patientObj.gender==null?"":this.state.patientObj.gender);
        url = url + "&patientMaritalstatus=" + String(this.state.patientObj.marital_status==null?"":this.state.patientObj.marital_status);
        url = url + "&patientNIC=" + String(this.state.patientObj.nic);
        url = url + "&patientAddress=" + String(this.state.patientObj.address == null ? "" : this.state.patientObj.address);
        url = url + "&patientID=" + String(this.state.patientObj.phn);
        url = url + "&patientTeleNo01=" + String(data.mobile_no == null ? '' : data.mobile_no);
        url = url + "&patientTeleNo02=" + String(data.mobile_no2 == null ? '' : data.mobile_no2);
        url = url + "&registeredDate=" + String(dateParse(data.createdAt));
        url = url + "&clinicRegNo=" + String(data.bht);
        url = url + "&clinicNo=" + String(data.bht);
        url = url + "&departmentTitle=" + String(data.clinic);
        url = url + "&consultantName=" + String(data.consultant);





        //window.open(url, '_blank'); 
        let child = window.open(url, '_blank');
        // let url2 = appConst.PRINT_URL + '/ClinicNo.html?clinicNo=' + data.bht;
        // let child2 = window.open(url2, '_blank');
        setTimeout(() => {
            // child.close()
            //child2.close()
        }, 2000);

        /*   let url2=appConst.PRINT_URL+'/ClinicNo.html?clinicNo='+data.bht;
         window.open(url2, '_blank');  */

        // window.location.reload()
    }



    async printClinicNo() {

        let data = this.state.patientObj;
        let url = appConst.PRINT_URL + this.state.hospital_data.owner_id + '/clinicNo.html?clinicNo=' + data.bht;

        //window.open(url, '_blank'); 
        let child = window.open(url, '_blank');

        setTimeout(() => {
            // child.close()
            //child2.close()
        }, 2000);

        // window.location.reload()

    }

    async printAdmission() {
        let data = this.state.patientObj;
        let url = appConst.PRINT_URL + this.state.hospital_data.owner_id + '/patientAdmission.html?';
        url = url + "institute=" + '';
        url = url + "&patientTitle=" + String(this.state.patientObj.title);
        url = url + "&patientName=" + String(this.state.patientObj.name);
        url = url + "&age=" + String(await UtilityServices.getAgeString(this.state.patientObj.date_of_birth));
        url = url + "&patientGender=" + String(this.state.patientObj.gender==null?"":this.state.patientObj.gender);
        url = url + "&patientMaritalstatus=" + String(this.state.patientObj.marital_status==null?"":this.state.patientObj.marital_status);
        url = url + "&patientNIC=" + String(this.state.patientObj.nic);
        url = url + "&patientAddress=" + String(this.state.patientObj.address == null ? "" : this.state.patientObj.address);
        url = url + "&patientID=" + String(this.state.patientObj.phn);

        url = url + "&bht=" + String(data.bht);
        url = url + "&nameOfGuardian=" + String(this.state.patientObj.guardian.name == null ? "" : this.state.patientObj.guardian.name);
        url = url + "&addressOfGuardian=" + String(this.state.patientObj.guardian.address == null ? "" : this.state.patientObj.guardian.address);
        url = url + "&telephonOfGuardian=" + String(this.state.patientObj.guardian.contact_no == null ? "" : this.state.patientObj.guardian.contact_no);
        url = url + "&admissionDate=" + String(dateParse(data.admit_date_time));
        url = url + "&admissionTime=" + String(timeParse(data.admit_date_time));
        url = url + "&wardName=" + String(this.state.patientObj.clinic);
        url = url + "&consultantName=" + String(this.state.patientObj.consultant);

        let child = window.open(url, '_blank');


        // window.location.reload()
    }



    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>

                {/* Content start*/}
                <div className="ml-2 w-full h-full">
                    <ValidatorForm
                        ref={'outer-form'}
                        onSubmit={() => this.onSubmit()}
                        onError={() => null}
                    > <Grid container={2}>

                            <Grid
                                className="my-auto"
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                            >
                                <Typography variant="h6">{null ==
                                    this.state.patientObj
                                    ? ''
                                    : this.state
                                        .patientObj
                                        .name}</Typography>

                            </Grid>
                        </Grid>

                        {/* <Grid container className="flex mb-4"> */}

                        <Grid className="flex w-full" item lg={12} md={12} sm={12} xs={12} >
                            <Grid
                                className=" w-full"
                                item
                                lg={6}
                                md={6}
                                sm={12}
                                xs={12}
                            >
                                <Grid container={2}>
                                    <Grid
                                        item
                                        lg={6}
                                        md={6}
                                        sm={5}
                                        xs={5}
                                    >
                                        <SubTitle title="PHN" />
                                    </Grid>
                                    <Grid
                                        item
                                        lg={6}
                                        md={6}
                                        sm={5}
                                        xs={5}
                                    >
                                        {/* <SubTitle title="121212324224324" /> */}
                                        <SubTitle
                                            title={
                                                null ==
                                                    this.state.patientObj
                                                    ? ''
                                                    : this.state
                                                        .patientObj
                                                        .phn
                                            }
                                        />
                                    </Grid>

                                    <Grid
                                        item
                                        lg={6}
                                        md={6}
                                        sm={5}
                                        xs={5}
                                    >
                                        <SubTitle title="NIC" />
                                    </Grid>
                                    <Grid
                                        item
                                        lg={6}
                                        md={6}
                                        sm={7}
                                        xs={7}
                                    >
                                        <SubTitle
                                            title={
                                                null ==
                                                    this.state.patientObj
                                                    ? ''
                                                    : this.state
                                                        .patientObj
                                                        .nic
                                            }
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        lg={6}
                                        md={6}
                                        sm={5}
                                        xs={5}
                                    >
                                        <SubTitle title="Date Of Birth" />
                                    </Grid>
                                    <Grid
                                        item
                                        lg={6}
                                        md={6}
                                        sm={7}
                                        xs={7}
                                    >
                                        <SubTitle
                                            title={
                                                null ==
                                                    this.state.patientObj
                                                    ? ''
                                                    : dateTimeParse(this.state.patientObj.date_of_birth)
                                            }
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        lg={6}
                                        md={6}
                                        sm={5}
                                        xs={5}
                                    >
                                        <SubTitle title="Age" />
                                    </Grid>
                                    <Grid
                                        item
                                        lg={6}
                                        md={6}
                                        sm={7}
                                        xs={7}
                                    >
                                        <SubTitle
                                            title={
                                                null ==
                                                    this.state.patientObj
                                                    ? ''
                                                    : this.state
                                                        .patientObj
                                                        .age ? this.state
                                                            .patientObj
                                                            .age.split("-")[0] + "Y-" + this.state
                                                                .patientObj
                                                                .age.split("-")[1] + "M-" + this.state
                                                                    .patientObj
                                                                    .age.split("-")[2] + "D" : ""
                                            }
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        lg={6}
                                        md={6}
                                        sm={5}
                                        xs={5}
                                    >
                                        <SubTitle title="Gender" />
                                    </Grid>
                                    <Grid
                                        item
                                        lg={6}
                                        md={6}
                                        sm={7}
                                        xs={7}
                                    >
                                        <SubTitle
                                            title={
                                                null ==
                                                    this.state.patientObj
                                                    ? ''
                                                    : this.state
                                                        .patientObj
                                                        .gender
                                            }
                                        />
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Grid container={2}>
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Address" />
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle
                                        title={
                                            null ==
                                                this.state.patientObj
                                                ? ''
                                                : this.state
                                                    .patientObj
                                                    .address
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Moh Division" />
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                >
                                    {/* To Do - Check Why this is null backend */}
                                    <SubTitle
                                        title={
                                            this.state.patientObj.Moh == null
                                                ? ''
                                                : this.state.patientObj.Moh.name

                                        }
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                >
                                    {/* To Do - Check Why this is null backend */}
                                    <SubTitle title="PHM Division" />
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle
                                        title={
                                            this.state.patientObj.PHM == null
                                                ? ''
                                                : this.state.patientObj.PHM.name

                                        }
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                >
                                    {/* To Do - Check Why this is null backend */}
                                    <SubTitle title="GN Divison" />
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle
                                        title={
                                            this.state.patientObj.GN == null
                                                ? ''
                                                : this.state.patientObj.GN.name

                                            // : this.state
                                            //       .patientObj.GN
                                            //       .name
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* </Grid> */}
                    </ValidatorForm>
                </div>
                <Grid className=" w-full pb-5" item lg={12} md={12} sm={12} xs={12} >
                    <Grid container spacing={2} className="flex ">
                        {this.props.tab == 'patients' || this.props.tab == 'clinic' ?
                            <Grid style={{ backgroundColor: '#d7f0fa' }} className="px-2 mt-6 py-2 mx-1 my-1 border-radius-4" item  >
                                <Tooltip title="Print Barcode">
                                    <IconButton
                                        className="px-2"
                                        onClick={() => {
                                            this.printPatientID()
                                        }}
                                        size="small"
                                        aria-label="view"
                                    >

                                        <img style={{ width: '1em', height: '1em', marginTop: -1 }} src="/assets/icons/file.svg" alt='Out of Stock' />
                                        <Typography className="font-medium ml-1" variant="h6" style={{ fontSize: 16, color: '#374151'/* themeColors[activeTheme].palette.primary.main */ }}>Print Barcode</Typography>

                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            : null
                        }

                        {this.props.tab == 'admissions' ?
                            <Grid style={{ backgroundColor: '#d7f0fa' }} className="px-2 mt-6 py-2 mx-1 my-1 border-radius-4" item  >
                                <Tooltip title="Print Admission">
                                    <IconButton
                                        className="px-2"
                                        onClick={() => {
                                            this.printAdmission()
                                        }}
                                        size="small"
                                        aria-label="view"
                                    >

                                        <img style={{ width: '1em', height: '1em', marginTop: -1 }} src="/assets/icons/file.svg" alt='Out of Stock' />
                                        <Typography className="font-medium ml-1" variant="h6" style={{ fontSize: 16, color: '#374151'/* themeColors[activeTheme].palette.primary.main */ }}>Print Admission</Typography>

                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            : null
                        }

                        {this.props.tab == 'clinic' ?
                            <Grid style={{ backgroundColor: '#d7f0fa' }} className="px-2 mt-6 py-2 mx-1 my-1 border-radius-4" item  >
                                <Tooltip title="Print Health 267">
                                    <IconButton
                                        className="px-2"
                                        onClick={() => {
                                            this.print267()
                                        }}
                                        size="small"
                                        aria-label="view"
                                    >

                                        <img style={{ width: '1em', height: '1em', marginTop: -1 }} src="/assets/icons/file.svg" alt='Out of Stock' />
                                        <Typography className="font-medium ml-1" variant="h6" style={{ fontSize: 16, color: '#374151'/* themeColors[activeTheme].palette.primary.main */ }}>Print Health 267</Typography>

                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            : null}

                        {this.props.tab == 'clinic' ?
                            <Grid style={{ backgroundColor: '#d7f0fa' }} className="px-2 mt-6 py-2 mx-1 my-1 border-radius-4" item  >
                                <Tooltip title="Print Health 633">
                                    <IconButton
                                        className="px-2"
                                        onClick={() => {
                                            this.printClinicCard()
                                        }}
                                        size="small"
                                        aria-label="view"
                                    >

                                        <img style={{ width: '1em', height: '1em', marginTop: -1 }} src="/assets/icons/file.svg" alt='Out of Stock' />
                                        <Typography className="font-medium ml-1" variant="h6" style={{ fontSize: 16, color: '#374151'/* themeColors[activeTheme].palette.primary.main */ }}>Print Health 633</Typography>

                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            : null}

                        {this.props.tab == 'clinic' ?
                            <Grid style={{ backgroundColor: '#d7f0fa' }} className="px-2 mt-6 py-2 mx-1 my-1 border-radius-4" item  >
                                <Tooltip title="Print Health 918">
                                    <IconButton
                                        className="px-2"
                                        onClick={() => {
                                            this.printClinicNo()
                                        }}
                                        size="small"
                                        aria-label="view"
                                    >

                                        <img style={{ width: '1em', height: '1em', marginTop: -1 }} src="/assets/icons/file.svg" alt='Out of Stock' />
                                        <Typography className="font-medium ml-1" variant="h6" style={{ fontSize: 16, color: '#374151'/* themeColors[activeTheme].palette.primary.main */ }}>Print Health 918</Typography>

                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            : null}

                    </Grid>
                </Grid>


                {/* Content End */}

                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>

            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(PrintDocuments)
