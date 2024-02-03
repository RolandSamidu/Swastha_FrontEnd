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
import { dateParse, timeParse } from "utils";

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

class LPQuotationView extends Component {
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

            id: null,
            formData: {
                delivery: null,
                closingDate: null,
                selected: null,
                sampleDate: null
            }
        }
    }

    getUser = async () => {
        let id = await localStorageService.getItem('userInfo').id
        if (id) {
            let user_res = await EmployeeServices.getEmployeeByID(id)
            if (user_res.status == 200) {
                console.log('User', user_res.data.view)
                this.setState({ user: user_res?.data?.view })
            }
        }
    }

    loadData = async () => {
        //function for load initial data from backend or other resources
        this.setState({ loading: false });

        let id = this.state.id;
        let res = await LocalPurchaseServices.getLPRequestByID(id)

        if (res.status === 200) {
            this.setState({ data: res.data.view }, () => {
                this.getHospital(res.data.view.owner_id)
            });
        }

        this.setState({ loading: true })
    }

    async getHospital(owner_id) {
        let params = { issuance_type: 'Hospital' }
        let durgStore_res = await PharmacyService.fetchAllDataStorePharmacy(owner_id, params)
        if (durgStore_res.status == 200) {
            console.log('hospital', durgStore_res.data.view.data)
            this.setState({ hospital: durgStore_res?.data?.view?.data[0] })
        }
    }

    componentDidMount() {
        const { id } = this.props
        if (id) {
            this.setState({ id: id }, () => {
                this.loadData()
                this.getUser()
            })
        }
    }

    componentDidUpdate(prevProps) {
        const { delivery, closingDate, selected, sampleDate, id } = this.props;

        console.log("Print: ", { delivery, closingDate, selected, sampleDate, id })

        if (delivery !== prevProps.delivery) {
            this.setState((prevState) => ({
                formData: {
                    ...prevState.formData,
                    delivery: delivery,
                },
            }));
        }
        if (closingDate !== prevProps.closingDate) {
            this.setState((prevState) => ({
                formData: {
                    ...prevState.formData,
                    closingDate: closingDate,
                },
            }));
        }
        if (selected !== prevProps.selected) {
            this.setState((prevState) => ({
                formData: {
                    ...prevState.formData,
                    selected: selected,
                },
            }));
        }
        if (sampleDate !== prevProps.sampleDate) {
            this.setState((prevState) => ({
                formData: {
                    ...prevState.formData,
                    sampleDate: sampleDate,
                },
            }));
        }
        if (id !== prevProps.id) {
            this.setState({ id: id }, () => {
                this.loadData();
            });
        }
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
                                    <div><Typography variant="subtitle1">User&nbsp;&nbsp;:</Typography></div>
                                    <div><Typography variant="subtitle1">Email&nbsp;:</Typography></div>
                                    <div><Typography variant="subtitle1">Page&nbsp;:</Typography></div>
                                </div>
                                <div>
                                    <div><Typography variant="subtitle1">{dateParse(new Date())}</Typography></div>
                                    <div><Typography variant="subtitle1">{timeParse(new Date())}</Typography></div>
                                    <div><Typography variant="subtitle1">{this.state.user ? this.state.user.name : "Not Available"}</Typography></div>
                                    <div><Typography variant="subtitle1">{this.state.user ? this.state.user.email : "Not Available"}</Typography></div>
                                    <div><Typography variant="subtitle1">{'1'}</Typography></div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} md={12}>
                            <Typography variant="subtitle1" style={{ textAlign: "center" }}>
                                {this.state.loading ? this.state.hospital?.name ? `${this.state.hospital.name}, ${this.state.hospital.province} Province, ${this.state.hospital.district}` : 'Not Available' : 'Loading'}
                            </Typography>
                            <hr className="mt-2 mb-2" />
                        </Grid>
                        <Grid className="mt-5" item sm={12}>
                            <table style={{ width: "100%" }}>
                                <tr>
                                    <td style={{ fontWeight: "bold", width: "25%" }}>Request No</td>
                                    <td style={{ width: "75%" }}>{this.state.loading ? this.state.data?.request_id ? this.state.data.request_id : 'Not Available' : 'Loading'}</td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: "bold", width: "25%" }}>Required Date</td>
                                    <td style={{ width: "75%" }}>{this.state.loading ? this.state.data ? dateParse(this.state.data.required_date) : 'Not Available' : 'Loading'}</td>
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
                                            <StyledTableCell align="center">UOM</StyledTableCell>
                                            <StyledTableCell align="center">Discount&nbsp;(%)</StyledTableCell>
                                            <StyledTableCell align="center">Quantity</StyledTableCell>
                                            <StyledTableCell align="center">Unit&nbsp;Price</StyledTableCell>
                                            <StyledTableCell align="center">Quote&nbsp;Qty</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    {this.state.loading &&
                                        <TableBody>
                                            <StyledTableRow key={this.state.data?.id}>
                                                <StyledTableCell component="th" scope="row">1</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">
                                                    {this.state.loading ? this.state.data?.ItemSnap?.sr_no ? this.state.data?.ItemSnap?.sr_no : 'Not Available' : 'Loading'}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{this.state.data?.ItemSnap?.short_description ? this.state.data?.ItemSnap?.short_description : 'Not Available'}</StyledTableCell>
                                                <StyledTableCell align="center">{this.state.data?.ItemSnap?.strength ? this.state.data?.ItemSnap?.strength : 'Not Available'}</StyledTableCell>
                                                <StyledTableCell align="center">0.00</StyledTableCell>
                                                <StyledTableCell align="center">{this.state.data?.required_quantity ? parseInt(this.state.data?.required_quantity, 10) : 'Not Available'}</StyledTableCell>
                                                <StyledTableCell align="center">..........</StyledTableCell>
                                                <StyledTableCell align="center">..........</StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    }
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} md={12}>
                            <Typography variant="subtitle1" style={{ textAlign: "end" }}>NMR Registration : (YES / NO)</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} md={12}>
                            <Typography variant="subtitle1">Medium Description :</Typography>
                            <Typography variant="subtitle1" style={{ marginLeft: "12px" }}>{this.state.loading ? this.state.data?.ItemSnap?.medium_description ? this.state.data?.ItemSnap?.medium_description : 'Not Available' : 'Loading'}</Typography>
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
                                    <td style={{ width: "65%" }}>{this.state.formData.closingDate}</td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: "bold", width: "35%" }}>Delivery OK on or before :</td>
                                    <td style={{ width: "65%" }}>{this.state.formData.delivery}</td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: "bold", width: "35%" }}>Sample Needed (YES / NO) :</td>
                                    <td style={{ width: "65%" }}>{this.state.formData.selected ? `Date & Time: ${this.state.formData.delivery}` : "NO"}</td>
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
                        <Grid item xs={12} sm={12} lg={12} md={12} style={{ display: "flex", justifyContent: "space-between" }}>
                            <Grid container className='mt-5' style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Grid item xs={12} sm={12} lg={12} md={12}>
                                    <table style={{ width: "100%" }}>
                                        <tr>
                                            <td style={{ fontWeight: 'bold', width: "35%", fontWeight: "bold" }}>Prepared By :</td>
                                            <td style={{ width: "75%" }}>{this.state.user ? this.state.user.name : "Not Available"}</td>
                                        </tr>
                                    </table>
                                    {/* {renderDetailCard("Prepared By", this.state.user ? this.state.user.name : "Not Available")} */}
                                </Grid>
                            </Grid>
                            <Grid container style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Grid item xs={6} sm={6} lg={6} md={6}>
                                    {renderSignatureCard('Requested by Store Officer')}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        )
    }
}

export default withStyles(styleSheet)(LPQuotationView);