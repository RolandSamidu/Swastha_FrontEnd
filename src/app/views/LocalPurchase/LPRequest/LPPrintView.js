import React, { Component, Fragment } from "react";
import { withStyles, styled } from "@material-ui/styles";
import { Button, Typography, Hidden, Paper, Divider } from "@material-ui/core";
import { CardTitle, MainContainer, SubTitle, Widget } from 'app/components/LoonsLabComponents'
// import Npdrug from "./components/npdrug";
// import PatientSelection from "./components/patientSelection";
import { Grid } from "@material-ui/core";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { tableCellClasses } from '@mui/material/TableCell';
import ReactToPrint from 'react-to-print'
import PrintIcon from '@mui/icons-material/Print';
import { MatxLayoutSettings } from "app/components/MatxLayout/settings";
import { themeColors } from "app/components/MatxTheme/themeColors";
import localStorageService from "app/services/localStorageService";
import ClinicService from "app/services/ClinicService";
import PatientServices from "app/services/PatientServices";
import PrescriptionService from "app/services/PrescriptionService";
import PharmacyService from "app/services/PharmacyService";
import LocalPurchaseServices from "app/services/LocalPurchaseServices";
import EmployeeServices from "app/services/EmployeeServices";
import { convertTocommaSeparated, dateParse, dateTimeParse, timeParse } from "utils";
import { identity } from "lodash";

const styleSheet = ((palette, ...theme) => ({}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

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
        <Grid container style={{ minHeight: "120px" }}>
            <Grid item xs={12} sm={12} style={{ display: "flex", alignItems: "end", justifyContent: "flex-end", textAlign: "center" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="body1">.................................................</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="body1">{label}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

class LPPrintView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            patientInfo: [],
            diagnosis: [],
            drug: [],
            bht: null,
            clinicName: null,
            loading: false,
            hospital: {},
            user: {},
            suplier:[],
            

            id: null,
            formData: {
                delivery: null,
                closingDate: null,
                selected: null,
                sampleDate: null
            }
        }
    }

    componentDidMount() {
        console.log('checking inc', this.props.lpSupplierInfo)
    }


    render() {
        let activeTheme = MatxLayoutSettings.activeTheme;
        return (
            <Grid className='bg-light-gray p-5' >
                <div className="bg-white p-5">
                    <SubTitle title="Approved by MSD" />
                    {/* <Hidden smDown> */}
                    <Grid container>
                        <Grid item xs={12} sm={12} lg={12} md={12} style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{ flex: 1, justifyContent: 'center', alignItems: "center", display: "flex" }}>
                                <Typography variant="subtitle1" style={{ textAlign: "center" }}>Quotation Request Letter</Typography>
                            </div>
                            <div style={{ display: 'flex', flexDirection: "row" }}>
                                <div style={{ flex: 1 }}>
                                    <div><Typography variant="subtitle1">Date&nbsp;&nbsp;:</Typography></div>
                                    <div><Typography variant="subtitle1">Time&nbsp;&nbsp;:</Typography></div>
                                    {/* <div><Typography variant="subtitle1">User&nbsp;&nbsp;:</Typography></div>
                                    <div><Typography variant="subtitle1">Email&nbsp;:</Typography></div> */}
                                    <div><Typography variant="subtitle1">Page&nbsp;:</Typography></div>
                                </div>
                                <div>
                                    <div><Typography variant="subtitle1">{dateParse(new Date())}</Typography></div>
                                    <div><Typography variant="subtitle1">{timeParse(new Date())}</Typography></div>
                                    {/* <div><Typography variant="subtitle1">{this.state.user.name}</Typography></div>
                                    <div><Typography variant="subtitle1">{this.state.user.email}</Typography></div> */}
                                    <div><Typography variant="subtitle1">{'1'}</Typography></div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} md={12}>
                            <Typography variant="subtitle1" style={{ textAlign: "center" }}>
                                {`${this.props.hospital.name} - ${this.props.hospital.district}`}
                            </Typography>
                            <hr className="mt-2 mb-2" />
                        </Grid>
                        <Grid className="mt-5" item sm={12}>
                            <table style={{ width: "100%" }}>

                                <tr>
                                    <td style={{ fontWeight: "bold", width: "25%" }}>Supplire Name</td>
                                    <td style={{ width: "75%" }}>{this.props.lpSupplierInfo?.Supplier?.name}</td>
                                </tr>

                                <tr>
                                    <td style={{ fontWeight: "bold", width: "25%" }}>Request No</td>
                                    <td style={{ width: "75%" }}>{this.props.lpSupplierInfo?.LPRequest?.request_id}</td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: "bold", width: "25%" }}>Required Date</td>
                                    <td style={{ width: "75%" }}>{dateParse(this.props.lpSupplierInfo?.LPRequest?.required_date)}</td>
                                </tr>
                            </table>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} md={12}>
                            <TableContainer className="mt-5 mb-5">
                                <Table aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align='center'>No</StyledTableCell>
                                            <StyledTableCell align='center'>Item Code</StyledTableCell>
                                            <StyledTableCell align="center">Description</StyledTableCell>
                                            {/* <StyledTableCell align="center">UOM</StyledTableCell> */}
                                            <StyledTableCell align="center">Discount&nbsp;(%)</StyledTableCell>
                                            <StyledTableCell align="center">Quantity</StyledTableCell>
                                            <StyledTableCell align="center">Unit&nbsp;Price</StyledTableCell>
                                            <StyledTableCell align="center">Quote&nbsp;Qty</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    {/* {this.state.loading && */}
                                        <TableBody>
                                            <StyledTableRow key={this.state.data?.id}>
                                                <StyledTableCell component="th" scope="row">1</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">
                                                    {this.props.lpSupplierInfo?.LPRequest?.ItemSnap?.sr_no}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{this.props.lpSupplierInfo?.LPRequest?.ItemSnap?.medium_description}</StyledTableCell>
                                                {/* <StyledTableCell align="center">{}</StyledTableCell> */}
                                                <StyledTableCell align="center">0.00</StyledTableCell>
                                                <StyledTableCell align="center">{convertTocommaSeparated(this.props.lpSupplierInfo?.LPRequest?.approved_qty)}</StyledTableCell>
                                                <StyledTableCell align="center">..................</StyledTableCell>
                                                <StyledTableCell align="center">..................</StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    {/* } */}
                                </Table>
                            </TableContainer>
                        </Grid>
                        {/* <Grid item xs={12} sm={12} lg={12} md={12}>
                            <Typography variant="subtitle1" style={{ textAlign: "end" }}>NMR Registration : (YES / NO)</Typography>
                        </Grid> */}
                        <Grid item xs={12} sm={12} lg={12} md={12}>
                            <Typography variant="subtitle1">Medium Description :</Typography>
                            <Typography variant="subtitle1" style={{ marginLeft: "12px" }}>{this.props.lpSupplierInfo?.LPRequest?.ItemSnap?.medium_description}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} md={12} style={{ display: "flex", justifyContent: "space-between" }}>
                            <Grid container style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Grid item xs={6} sm={6} lg={6} md={6}></Grid>
                            </Grid>
                            <Grid container style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Grid item xs={6} sm={6} lg={6} md={6}>
                                    {renderSignatureCard('Signature and Seal of Supplier')}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} md={12} className="mb-5" style={{ display: "flex", flexDirection: "column" }}>
                            <hr className="mt-2 mb-2" />
                            <table style={{ width: "100%" }}>
                                <tr>
                                    <td style={{ fontWeight: "bold", width: "35%" }}>Closing Date & Time :</td>
                                    <td style={{ width: "65%" }}>{dateTimeParse(this.props.lpSupplierInfo?.closing_date)}</td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: "bold", width: "35%" }}>Delivery OK on or before :</td>
                                    <td style={{ width: "65%" }}>{dateTimeParse(this.props.lpSupplierInfo?.delivery_date)}</td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: "bold", width: "35%" }}>Sample Needed :</td>
                                    <td style={{ width: "65%" }}>{this.props.lpSupplierInfo?.is_sample_needed ? `Yes - ${dateTimeParse(this.props.lpSupplierInfo?.sample_required_date)}` : "NO"}</td>
                                </tr>
                            </table>
                            {/* {renderDetailCard('Closing Date & Time', this.state.formData.closingDate)}
                        {renderDetailCard('Delivery OK on or before', this.state.formData.delivery)}
                        {renderDetailCard('Sample Needed (YES / NO)', this.state.formData.selected ? `Date & Time: ${this.state.formData.delivery}` : "NO")} */}
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} md={12}>
                            <Typography variant="subtitle1" style={{ fontWeight: "bold", textDecoration: "underline", paddingBottom: "4px" }}>Remarks (Others) :</Typography>
                            <Typography variant="subtitle1">............................................................................................</Typography>
                            <Typography variant="subtitle1">............................................................................................</Typography>
                        </Grid>
                        
                        <Grid container >
                                <Grid item xs={4} sm={4} lg={4} md={4}>
                                    {renderSignatureCard(' Requested by Store Pharmacist')}
                                </Grid>
                                <Grid item xs={4} sm={4} lg={4} md={4}>
                                    {renderSignatureCard('Recommended by CP')}
                                </Grid>
                                <Grid item xs={4} sm={4} lg={4} md={4}>
                                    {renderSignatureCard('Approved By Head of Institution')}
                                </Grid>
                            </Grid>
                    </Grid>
                </div>
            </Grid>
        )
    }
}

export default withStyles(styleSheet)(LPPrintView);