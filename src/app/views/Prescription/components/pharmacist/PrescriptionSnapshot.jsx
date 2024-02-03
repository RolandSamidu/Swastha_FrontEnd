import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { LoonsTable, MainContainer, Summary, Widget } from "app/components/LoonsLabComponents";
import { Button, Grid } from "@material-ui/core";
import LabeledInput from "app/components/LoonsLabComponents/LabeledInput";
import { ValidatorForm } from "react-material-ui-form-validator";

const styleSheet = ((palette, ...theme) => ({
    padded: {
        paddingTop: '20px',
        paddingBottom: '20px',
    },
    centered: {
        justifyContent: 'center'
    },
    filled: {
        width: '100%'
    }
}));

class PrescriptionSnapshot extends Component {
    constructor(props) {
        super(props)
        this.state = {
            totalPrescriptions: 20,
            totalPrescribedDrugs: 152,
            fullStockAvailable: 75,
            partialOrderingRequired: 50,
            fullOrderingRequired: 25,
            namePatient: 2,
            columns: [
                {
                    name: 'srNo',
                    label: 'SR No',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'drugName',
                    label: 'Drug Name',
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
                    name: 'noOfPrescriptions',
                    label: 'No of Prescriptions',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'prescribedStock',
                    label: 'Prescribed Stock',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'pharmacyStockAvailability',
                    label: 'Pharmacy Stock Availability',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'shortage',
                    label: 'Shortage',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'availableToOrderPlace',
                    label: 'Available to Order Place(s)',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'contactDetails',
                    label: 'Contact Details',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'stockStatus',
                    label: 'Stock Status',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (val)=><Button style={{ width: '100%' }} variant="contained" color={val === 1 ? "default" : "secondary"}>{val == 1 ? 'Exchange' : 'Order'}</Button>
                    },
                }
            ],
            data: [
                {
                    srNo: 1,
                    drugName: 'A0003',
                    dateTime: '2021-01-01',
                    noOfPrescriptions: 2,
                    prescribedStock: 3,
                    pharmacyStockAvailability: 10,
                    shortage: 3,
                    availableToOrderPlace: 3,
                    contactDetails: "34543534",
                    stockStatus: "stat",
                    actions: 1
                },
                {
                    srNo: 2,
                    drugName: 'A0003',
                    dateTime: '2021-01-01',
                    noOfPrescriptions: 2,
                    prescribedStock: 3,
                    pharmacyStockAvailability: 10,
                    shortage: 3,
                    availableToOrderPlace: 3,
                    contactDetails: "34543534",
                    stockStatus: "stat",
                    actions: 2
                },
            ]
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Widget title="Prescriptions Snapshot" id="pres_overview">
                <Fragment>
                    <MainContainer>
                        <Grid container spacing={2} className={classes.padded}>
                            <Grid item xs={2}>
                                <Summary title="Total Prescriptions Issued" value={this.state.totalPrescriptions} />
                            </Grid>
                            <Grid item xs={2}>
                                <Summary title="Total Prescribed Drugs" value={this.state.totalPrescribedDrugs} />
                            </Grid>
                            <Grid item xs={2}>
                                <Summary title="Full Stocks Available in Pharmacy" value={this.state.fullStockAvailable} />
                            </Grid>
                            <Grid item xs={2}>
                                <Summary title="Partial Ordering Required" value={this.state.partialOrderingRequired} />
                            </Grid>
                            <Grid item xs={2}>
                                <Summary title="Full Ordering Required" value={this.state.fullOrderingRequired} />
                            </Grid>
                            <Grid item xs={2}>
                                <Summary title="Name Patient" value={this.state.namePatient} />
                            </Grid>
                        </Grid>
                        <ValidatorForm className={classes.padded}>
                            <Grid container spacing={2} className={classes.centered}>
                                <Grid item xs={2}>
                                    <LabeledInput label="SR No" inputType="text" />
                                </Grid>
                                <Grid item xs={1}>
                                </Grid>
                                <Grid item xs={2}>
                                    <LabeledInput label="Drug Name" inputType="dropdown"  data={[
                                        {label: "Name1", value: "Name1"},
                                        {label: "Name2", value: "Name2"}
                                    ]} />
                                </Grid>
                                <Grid item xs={1}>
                                </Grid>
                                <Grid item xs={2}>
                                    <LabeledInput label="Point of Available" inputType="dropdown"  data={[
                                        {label: "Point1", value: "Point1"},
                                        {label: "Point2", value: "Point2"}
                                    ]} />
                                </Grid>
                                <Grid item xs={1}>
                                </Grid>
                                <Grid item xs={2}>
                                    <LabeledInput label="Status" inputType="dropdown" data={[
                                        {label: "Stocks Available", value: 1},
                                        {label: "Partial Stocks Available", value: 2},
                                        {label: "Ordering Required", value: 3},
                                        {label: "Name patient Drugs", value: 4},
                                    ]} />
                                </Grid>
                            </Grid>
                        </ValidatorForm>

                        <LoonsTable
                            id={'prescriptionSnapshot'}
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

export default withStyles(styleSheet)(PrescriptionSnapshot);