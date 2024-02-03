import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { Button, Typography, Hidden, Paper, Divider } from "@material-ui/core";
import { CardTitle, MainContainer, Widget, LoonsCard, SwasthaFilePicker } from '../../components/LoonsLabComponents'
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
import { roundDecimal } from "utils";

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
            patientDetails: {},
            diagnosis: [],
            contactNo: [],
            source_id: null,
            drug: [],
            bht: null,
            clinicName: null,
            loaded: false,
            hospital: {},
            unit: null,
            dataTale:{}
        }
    }

    loadData = async () => {
        let pres_res = await PrescriptionService.fetchNPRequestById(this.state.source_id)
        if (pres_res.status === 200) {
            console.log("Prescription :", pres_res.data.view)
            this.setState({ patientDetails: pres_res.data.view?.Patient, bht: pres_res.data.view?.bht_no, clinicName: pres_res.data.view?.Pharmacy_drugs_store?.short_reference, dataTale:pres_res.data.view, drug: [{ ...pres_res.data.view?.ItemSnap, quantity: pres_res.data.view?.suggested_quantity, frequency: pres_res.data.view?.DefaultFrequency }], hospital: pres_res.data.view?.Institute }, () => {
                this.getContactNo();
            })
        }

        this.setState({ loaded: true })
    }

    componentDidMount() {
        let source_id = this.props.match.params.id
        this.setState({
            source_id: source_id
        }, () => {
            this.loadData()
        })
    }

    getContactNo = () => {
        const mobileNo = this.state.patientDetails?.mobile_no ? this.state.patientDetails.mobile_no : "";
        const mobileNo2 = this.state.patientDetails?.mobile_no2 ? this.state.patientDetails.mobile_no2 : "";
        const contactNo = this.state.patientDetails?.contact_no ? this.state.patientDetails.contact_no : "";
        const contactNo2 = this.state.patientDetails?.contact_no2 ? this.state.patientDetails.contact_no2 : "";

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
    }

    render() {
        let activeTheme = MatxLayoutSettings.activeTheme;
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        {/* <MainContainer ref={(el) => (this.componentRef = el)}> */}
                        <CardTitle title="NP Drug Individual Summary" />
                        <br />
                        {renderDetailCard('01.  Name of the Patient', this.state.loaded ? `${this.state.patientDetails.title}. ${this.state.patientDetails?.name}` : 'Not Available')}
                        {renderDetailCard('02.  Age', this.state.loaded && this.state.patientDetails?.age && /^[0-9\-]+$/.test(this.state.patientDetails?.age) ? String(this.state.patientDetails?.age).split('-')[0] + " Y " + String(this.state.patientDetails?.age).split('-')[1] + " M " + String(this.state.patientDetails?.age).split("-")[2] + " D " : "Not Available")}
                        {renderDetailCard('03.  Gender', this.state.loaded && this.state.patientDetails?.gender ? String(this.state.patientDetails?.gender).toUpperCase() : "Not Available")}
                        {/* <Hidden smDown> */}
                        <Grid container spacing={2} className="px-4 my-4 w-full">
                            <Grid item xs={12} sm={12} style={{ border: "1px solid #000", borderRadius: "12px" }}>
                                {renderDetailCard('NIC No of Patient', this.state.loaded && this.state.patientDetails?.nic ? this.state.patientDetails?.nic : "Not Available")}
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
                        {renderDetailCard("04. Address", this.state.loaded && this.state.patientDetails?.address ? this.state.patientDetails?.address : 'Not Available')}
                        {renderDetailCard('05. Hospital', this.state.loaded && this.state.hospital?.name ? this.state.hospital?.name : 'Not Available')}

                        {renderDetailCard('06. Clinic', this.state.loaded && this.state.dataTale ? `${this.state.dataTale?.Pharmacy_drugs_store?.description}` : 'Not Available')}
                        {renderDetailCard('07. BHT', this.state.loaded && this.state.dataTale ? ` ${this.state.dataTale ? (this.state.dataTale?.bht_no) : ""}` : 'Not Available')}
                        {renderDetailCard('08. Diagnosis', this.state.loaded && this.state.diagnosis.length > 0 ? this.state.diagnosis.join(',') : 'Not Available')}
                        <br />
                        <Typography variant="h6" className="font-semibold">Drug Summary</Typography>
                        <hr className="mt-2" />
                        <Grid container xs={12} sm={12} className="my-5 px-4" spacing={2}>
                            <TableContainer component={Paper} style={{ border: "1px solid #000" }}>
                                <Table style={{ borderSpacing: 0, borderCollapse: "collapse" }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ border: '1px solid #000', borderCollapse: "collapse" }}>Name of the Drug</TableCell>
                                            <TableCell style={{ border: '1px solid #000', borderCollapse: "collapse" }}>Dose</TableCell>
                                            <TableCell style={{ border: '1px solid #000', borderCollapse: "collapse" }}>Frequency</TableCell>
                                            <TableCell style={{ border: '1px solid #000', borderCollapse: "collapse" }}>Duration</TableCell>
                                            <TableCell style={{ border: '1px solid #000', borderCollapse: "collapse" }}>Quantity</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.drug.length > 0 ?
                                            (
                                                this.state.drug.map((item, index) => ( 
                                                    <TableRow key={index}>

                                                        {console.log('ghgshdhgh sdghgshgd', item)}
                                                        <TableCell>
                                                            <span>{item?.medium_description ? item.medium_description : "Not Available"}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span>{this.state.dataTale?.dose ? this.state.dataTale?.dose : "Not Available"}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span>{item?.frequency ? `${roundDecimal(parseFloat(item?.frequency?.value), 2)} ${item?.frequency?.name}` : "Not Available"}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span>{this.state.dataTale?.duration ? this.state.dataTale?.duration : "Not Available"}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span>{item?.quantity ? item.quantity : "Not Available"}</span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
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
                                                    <TableCell style={{ border: '1px solid #000', borderCollapse: "collapse", textAlign: "center" }}>
                                                        <span>!</span>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Typography variant="h6" className="font-semibold">NP Drug Upload</Typography>
                        <hr className="mt-2" />
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

                                        source="np_drug_order"
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
                        {/* </Widget> */}
                        {/* <Npdrug /> */}
                        {/* </MainContainer> */}
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )
    }
}

export default compose(
    withStyles(styleSheet),
    withRouter
)(NPDrugView);