import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { LoonsTable, MainContainer, Summary, Widget } from "app/components/LoonsLabComponents";
import { Grid, Button } from "@material-ui/core";
import LabeledInput from "app/components/LoonsLabComponents/LabeledInput";
import { ValidatorForm } from "react-material-ui-form-validator";

const styleSheet = ((palette, ...theme) => ({
    padded: {
        paddingTop: '20px',
        paddingBottom: '20px',
    },
    centered: {
        justifyContent: 'center'
    }
}));

class PrescriptionOverview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            totalPrescriptions: 207,
            activePrescriptions: 152,
            fulfilledPrescriptions: 54,
            notFulfilledPrescriptions: 50,
            rejected: 0,
            namePatient: 1,
            columns: [
                {
                    name: 'prescriptionNo',
                    label: 'Prescription No',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'dateTime',
                    label: 'Date and Time',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'phn',
                    label: 'PHN',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'nic',
                    label: 'NIC',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'mobile',
                    label: 'Mobile',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'patientName',
                    label: 'Patient Name',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'address',
                    label: 'Address',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'clinicNo',
                    label: 'Clinic No',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'clinic',
                    label: 'Clinic',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'issuedDoctor',
                    label: 'Issued Doctor',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'pharmacy',
                    label: 'Pharmacy',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'issuedPharmacist',
                    label: 'Issued Pharmacist',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'noOfDrugs',
                    label: 'No of Drugs',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (val)=><Button variant="contained" color="primary">{val}</Button>
                    },
                },
            ],
            data: [
                {
                    prescriptionNo: 1,
                    status: 0,
                    dateTime: '2021-01-01',
                    phn: 'A0003',
                    nic: '933631834V',
                    mobile: '0722893738',
                    patientName: "Name",
                    address: "address",
                    clinicNo: 32324,
                    clinic: 'Norris',
                    issuedDoctor: 'DOC',
                    pharmacy: 'pharmacy',
                    issuedPharmacist: 'Kapila',
                    noOfDrugs: 10,
                    actions: 'actions'
                },
            ]
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Widget title="Prescriptions Overview" id="pres_overview">
                <Fragment>
                    <MainContainer>
                        <Grid container spacing={2} className={classes.padded}>
                            <Grid item xs={2}>
                                <Summary title="Total Prescriptions Issued Today" value={this.state.totalPrescriptions} />
                            </Grid>
                            <Grid item xs={2}>
                                <Summary title="Active Prescriptions" value={this.state.activePrescriptions} />
                            </Grid>
                            <Grid item xs={2}>
                                <Summary title="Prescriptions Fulfilled" value={this.state.fulfilledPrescriptions} />
                            </Grid>
                            <Grid item xs={2}>
                                <Summary title="Prescriptions Not fulfilled from past" value={this.state.notFulfilledPrescriptions} />
                            </Grid>
                            <Grid item xs={2}>
                                <Summary title="Rejected by the Pharmacist" value={this.state.rejected} />
                            </Grid>
                            <Grid item xs={2}>
                                <Summary title="Name Patient" value={this.state.namePatient} />
                            </Grid>
                        </Grid>

                        <ValidatorForm className={classes.padded}>
                            <Grid container spacing={2} className={classes.centered}>
                                <Grid item xs={2}>
                                    <LabeledInput label="PHN/NIC/Mobile" inputType="text" />
                                    <LabeledInput label="Status" inputType="dropdown" data={[
                                        { label: "Active", value: "Active" },
                                        { label: "Pending", value: "Pending" },
                                        { label: "Issued", value: "Issued" },
                                        { label: "Rejected", value: "Rejected" },
                                        { label: "Returned", value: "Returned" },
                                    ]} />
                                </Grid>
                                <Grid item xs={1}>
                                </Grid>
                                <Grid item xs={2}>
                                    <LabeledInput label="Prescription No" inputType="text" />
                                    <LabeledInput label="Date of Issue" inputType="range" />
                                </Grid>
                                <Grid item xs={1}>
                                </Grid>
                                <Grid item xs={2}>
                                    <LabeledInput label="OPD/Clinic No" inputType="text" />
                                    <LabeledInput label="Point of Issue" inputType="dropdown" data={[
                                        { label: "Point1", value: "Point1" },
                                        { label: "Point2", value: "Point2" }
                                    ]} />
                                </Grid>
                                <Grid item xs={1}>
                                </Grid>
                                <Grid item xs={2}>
                                    <LabeledInput label="Consultant/Dr" inputType="dropdown" data={[
                                        { label: "Name1", value: "name1" },
                                        { label: "Name2", value: "name2" }
                                    ]} />
                                    <LabeledInput label="Drug Issuance Point" inputType="dropdown" data={[
                                        { label: "Point1", value: "Point1" },
                                        { label: "Point2", value: "Point2" }
                                    ]} />
                                </Grid>
                            </Grid>
                        </ValidatorForm>

                        <LoonsTable
                            id={'prescriptionOverview'}
                            data={this.state.data}
                            columns={this.state.columns}
                            options={{
                                pagination: true,
                                serverSide: true,
                                count: this.state.data.length,
                                rowsPerPage: 10,
                                page: 0,
                                onTableChange: (
                                    action,
                                    tableState
                                ) => {
                                    console.log(
                                        action,
                                        tableState
                                    );
                                },
                            }}
                        ></LoonsTable>
                    </MainContainer>
                </Fragment>
            </Widget>
        );
    }
}

export default withStyles(styleSheet)(PrescriptionOverview);