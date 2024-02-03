import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { Button, Typography, Hidden, Paper, Divider } from "@material-ui/core";
import { CardTitle, MainContainer, Widget } from '../../components/LoonsLabComponents'
// import Npdrug from "./components/npdrug";
import PatientSelection from "./components/patientSelection";
import { Grid } from "@material-ui/core";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import ReactToPrint from 'react-to-print'
import PrintIcon from '@mui/icons-material/Print';
import { MatxLayoutSettings } from "app/components/MatxLayout/settings";
import { themeColors } from "app/components/MatxTheme/themeColors";
import localStorageService from "app/services/localStorageService";
import ClinicService from "app/services/ClinicService";
import PatientServices from "app/services/PatientServices";
import PrescriptionService from "app/services/PrescriptionService";
import PharmacyService from "app/services/PharmacyService";
import { compose } from "redux";
import { withRouter } from 'react-router-dom';

const styleSheet = ((palette, ...theme) => ({

}));

const pageStyle = `
    @page {
        margin-left:5mm;
        margin-right:5mm;
        margin-bottom:5mm;
        margin-top:8mm;
    }

    @table {
        tr {
            width: 5px,
        }
    }

    @media print {
        .print-table tr:not(:first-child):nth-of-type(22n+1) {
            page-break-before: always;
        }
        .print-table tbody {
            counter-reset: rowNumber;
        }
        .print-table tbody tr:not(:first-child) {
            counter-increment: rowNumber;
        }
        .print-table tbody tr:not(:first-child):before {
            content: counter(rowNumber) ".";
            display: inline-block;
            margin-right: 0.5em;
        }
        .page-break {
            page-break-before: always;
        }

        .bottom {
            position: fixed;
            bottom: 0;
        }
        .header, .header-space,
        {
            height: 2000px;
        }
        .footer, .footer-space {
            height: 55px;
        }
        .footer {
            position: fixed;
            bottom: 0;
        }
    }
    `

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

const renderSignatureCard = (label) => {
    return (
        <Grid container spacing={2} style={{ minHeight: "80px" }}>
            <Grid item xs={6} sm={6} style={{ display: "flex", alignItems: "end", textAlign: "center" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="body1">.................................................</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="body1">Signature of {label}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6} sm={6} style={{ display: "flex", alignItems: "end", textAlign: "center" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="body1">.................................................</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="body1">Date</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

class NPDrugView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            patientInfo: [],
            contactNo: [],
            diagnosis: [],
            drug: [],
            bht: null,
            clinicName: null,
            loaded: false,
            redirect: false,
            hospital: {},
            unit: null
        }
    }

    loadData = async () => {
        const patient = await localStorageService.getItem("patientSummary")
        const clinic = await localStorageService.getItem('Login_user_Hospital')
        const owner_id = await localStorageService.getItem('owner_id')
        const hospital_id = await localStorageService.getItem('main_hospital_id')

        if (patient && clinic) {
            let patient_res = await PrescriptionService.fetchPatientClinics({ 'type': 'Clinic', 'patient_id': patient.patientDetails.id })
            if (patient_res.status === 200) {
                this.setState({ bht: patient_res.data.view.data[0]?.bht })
            }
            console.log('np info 1',patient?.patientDetails)

            this.setState({
                patientInfo: patient?.patientDetails, diagnosis: patient?.diagnosis, clinicName: clinic?.name
            })
        }

        let hospital_res = await PharmacyService.fetchAllDataStorePharmacy(owner_id, { issuance_type: 'Hospital' })
        if (hospital_res.status == 200) {
            console.log('hospital', hospital_res.data.view.data)
            this.setState({ hospital: hospital_res?.data?.view?.data[0] })
        }

        if (this.props.patient) {
            console.log('np info 2',this.props.patient)
            this.setState({
                patientInfo: this.props.patient, clinicName: this.props.unit
            })
        }


        this.setState({ loaded: true },()=>{
            this.getContactNo()
        })
        // let res1 = await PrescriptionService.fetchPrescription({
        //     // 'patient_id': patient?.patientDetails.id,
        //     'clinic_id': clinic?.clinic_id,
        //     'limit': 1,
        //     'page': 0,
        //     'order[0]': ['createdAt', 'DESC']
        // }, patient?.patientDetails.id)
        // console.log("Pres", res1.data.view.data)

        // console.log("Clinic", res.data.view.data)
        // console.log("Var:", window)
        // console.log("Patient: ", patient)
    }

    componentDidMount() {
        this.loadData()
    }

    getContactNo = () => {
        const mobileNo = this.state.patientInfo?.mobile_no ? this.state.patientInfo.mobile_no : "";
        const mobileNo2 = this.state.patientInfo?.mobile_no2 ? this.state.patientInfo.mobile_no2 : "";
        const contactNo = this.state.patientInfo?.contact_no ? this.state.patientInfo.contact_no : "";
        const contactNo2 = this.state.patientInfo?.contact_no2 ? this.state.patientInfo.contact_no2 : "";

        const sum = []
        if (mobileNo !== "") {
            sum.push(mobileNo);
        } if (mobileNo2 !== "") {
            sum.push(mobileNo2);
        } if (contactNo !== "") {
            sum.push(contactNo);
        } if (contactNo2 !== "") {
            sum.push(contactNo2);
        }

        this.setState({ contactNo: sum })
        console.log('np info 3',sum)
    }

    componentDidUpdate(prevProps) {
        if (this.props.drug !== prevProps.drug) {
            this.setState({ drug: this.props.drug });
        }
        if (this.props.unit !== prevProps.unit) {
            this.setState({ clinicName: this.props.unit })
        }
        if (this.props.patient !== prevProps.patient) {
            this.setState({
                patientInfo: this.props.patient, clinicName: this.props.unit
            })
        } if (this.props.bht !== prevProps.bht) {
            console.log('np info 4',this.props.bht)
            this.setState({
                bht: this.props.bht
            })
        } if (this.props.redirect !== prevProps.redirect) {
            this.setState({
                redirect: this.props.redirect
            })
        }
        console.log("props patient: ", this.props.patient)
        console.log("props patient clinic: ", this.state.clinicName)
    }

    render() {
        let activeTheme = MatxLayoutSettings.activeTheme;
        return (
            <div className=' my-5' >
                <div className='flex justify-end' >
                    <ReactToPrint
                        trigger={() => (
                            <Button
                                id={"print_button_002"}
                                variant="contained"
                                color="primary"
                                startIcon={<PrintIcon />}
                                style={{ marginLeft: "10px" }}
                            >
                                Print
                            </Button>
                        )
                        }
                        onBeforeGetContent={() => console.log("Clicked the Print")}
                        onAfterPrint={() => this.state.redirect ? window.location.href = `/prescription/npdrug-summary` : null}


                        // onBeforeGetContent={() => this.props.printFunction}
                        pageStyle={pageStyle}
                        // documentTitle={letterTitle}
                        content={() => this.componentRef}
                    />
                </div>
                <div className="hidden">
                    <div ref={(el) => (this.componentRef = el)}>
                        {/* <MainContainer ref={(el) => (this.componentRef = el)}> */}
                        <Typography style={{ textAlign: "center", color: themeColors[activeTheme].palette.primary.main }} id="NP Drug">FORM FOR REQUISITION OF SPECIAL DRUGS</Typography>
                        <br />
                        {renderDetailCard('01.  Name of the Patient', this.state.loaded ? this.state.patientInfo?.name : 'Not Available')}
                        {renderDetailCard('02.  Age', this.state.loaded && this.state.patientInfo?.age && /^[0-9\-]+$/.test(this.state.patientInfo?.age) ? String(this.state.patientInfo?.age).split('-')[0] + " Y " + String(this.state.patientInfo?.age).split('-')[1] + " M " + String(this.state.patientInfo?.age).split("-")[2] + " D " : "Not Available")}
                        {renderDetailCard('03.  Gender', this.state.loaded && this.state.patientInfo?.gender ? String(this.state.patientInfo?.gender).toUpperCase() : "Not Available")}
                        {/* <Hidden smDown> */}
                        <Grid container spacing={2} className="px-4 my-4 w-full">
                            <Grid item xs={12} sm={12} style={{ border: "1px solid #000", borderRadius: "12px" }}>
                                {renderDetailCard('NIC No of Patient', this.state.loaded && this.state.patientInfo?.nic ? this.state.patientInfo?.nic : "Not Available")}
                                {renderDetailCard('Contact No of Patient',
                                    this.state.loaded ? this.state.contactNo.length > 0 ?
                                        this.state.contactNo.map((contact, index) => (
                                            <React.Fragment key={index}>
                                                {contact}
                                                {index % 2 === 0 ? ', ' : <br />}

                                            </React.Fragment>
                                        )) : <React.Fragment>
                                            Not Available
                                        </React.Fragment> : "Loading"
                                )}
                                {/* <Typography variant="subtitle1">
                                    Contact No of Patient
                                </Typography>
                                <Typography variant="body1">
                                    {this.state.loaded &&
                                        this.getContactNo().map((contact, index) => (
                                            <React.Fragment key={index}>
                                                {contact}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                </Typography> */}
                            </Grid>
                        </Grid>
                        {/* </Hidden> */}
                        {/* <Hidden mdUp>
                                <ol start={2} style={{ listStyleType: "decimal-leading-zero", fontSize: "20px" }}>
                                    <li>
                                        {renderDetailCard("Age", "54 Years")}
                                    </li>
                                    <li>
                                        {renderDetailCard("Sex", 'Male')}
                                    </li>
                                </ol>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} style={{ border: "1px solid #000", borderRadius: "12px", margin: "8px" }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">NIC No of Patient (Important)</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">.............................</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1" >Contact No of Patient</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">.............................</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Hidden> */}
                        {renderDetailCard("04. Address", this.state.loaded && this.state.patientInfo?.address ? this.state.patientInfo?.address : 'Not Available')}
                        {renderDetailCard('05. Hospital', this.state.loaded && this.state.hospital?.name ? this.state.hospital?.name : 'Not Available')}

                        {renderDetailCard('06. Clinic/BHT', this.state.loaded && this.state.clinicName ? `${this.state.clinicName} ${this.state.bht ? ('/ ' + this.state.bht) : ""}` : 'Not Available')}
                        {renderDetailCard('07. Diagnosis', this.state.loaded && this.state.diagnosis.length > 0 ? this.state.diagnosis.join(',') : 'Not Available')}
                        <br />
                        <Typography variant="h6" className="font-semibold">Drug Summary</Typography>
                        <hr className="mt-2" />
                        <Grid container xs={12} sm={12} className="my-5 px-4" spacing={2}>
                            <TableContainer component={Paper} style={{ border: "1px solid #000" }}>
                                <Table style={{ borderSpacing: 0, borderCollapse: "collapse" }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ border: '1px solid #000', borderCollapse: "collapse" }}>Name of the Drug</TableCell>
                                            <TableCell style={{ border: '1px solid #000', borderCollapse: "collapse" }}>Strength</TableCell>
                                            <TableCell style={{ border: '1px solid #000', borderCollapse: "collapse" }}>Frequency</TableCell>
                                            <TableCell style={{ border: '1px solid #000', borderCollapse: "collapse" }}>Duration</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.drug.length > 0 ? (
                                            this.state.drug.reduce((acc, row, index) => {
                                                const params = row.params;
                                                const rows = params.map((item, pos) => (
                                                    <TableRow key={pos}>
                                                        {pos === 0 ? (
                                                            <TableCell rowSpan={params.length}>
                                                                <span>{row.drug ? row.drug : "Not Available"}</span>
                                                            </TableCell>
                                                        ) : null}
                                                        <TableCell>
                                                            <span>{item?.dosage ? `${item?.dosage} mg` : "Not Available"}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span>{item?.frequency ? item?.frequency : "Not Available"}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span>{item?.duration ? item.duration : "Not Available"}</span>
                                                        </TableCell>
                                                    </TableRow>
                                                ));
                                                return acc.concat(rows);
                                            }, [])
                                        ) : (
                                            <TableRow>
                                                <TableCell style={{ border: '1px solid #000', borderCollapse: "collapse", textAlign: "center" }}>
                                                    <span>No</span>
                                                </TableCell>
                                                <TableCell style={{ border: '1px solid #000', borderCollapse: "collapse", textAlign: "center" }}>
                                                    <span>Any</span>
                                                </TableCell>
                                                <TableCell style={{ border: '1px solid #000', borderCollapse: "collapse", textAlign: "center" }}>
                                                    <span>Drug</span>
                                                </TableCell>
                                                <TableCell style={{ border: '1px solid #000', borderCollapse: "collapse", textAlign: "center" }}>
                                                    <span>Selected</span>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid container spacing={2} style={{ marginTop: "20px", position: 'fixed', bottom: 0 }}>
                            <Grid item xs={12} sm={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant="subtitle1">08. Expected date of starting treatment / cycle</Typography>
                                    </Grid>
                                </Grid>
                                {renderSignatureCard('Consultant')}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant="subtitle1">09. Recommendation of head of the institution</Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                {renderSignatureCard("Head of Institution")}
                                <Grid container spacing={2} style={{ marginTop: "20px" }}>
                                    <Grid item xs={12} sm={12} style={{ border: "1px solid #000", borderRadius: "12px", marginLeft: "8px", marginRight: "8px" }}>
                                        <Typography variant="body2">If treatment with this drug is discontinued for a reason please inform Director MSD</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant="body2">For office use only</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* </Widget> */}
                        {/* <Npdrug /> */}
                        {/* </MainContainer> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default compose(
    withStyles(styleSheet),
    withRouter
)(NPDrugView);