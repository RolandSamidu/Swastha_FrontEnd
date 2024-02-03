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

class PrescriptionExtras extends Component {
    constructor(props) {
        super(props)
        this.state = {
            totalPrescribedDrugs: 152,
            orderingRequired: 50,
            inPharmacyStocks: 5,
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
                    name: 'quantity',
                    label: 'Quantity On Hand',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'orderingRequired',
                    label: 'Ordering Required',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'possibleOption',
                    label: 'Possible Option',
                    options: {
                        display: true,
                    },
                },
            ],
            data: [
                {
                    srNo: 1,
                    drugName: 'A0003',
                    dateTime: '2021-01-01',
                    quantity: 2,
                    orderingRequired: 3,
                    possibleOption: 'Unknown',
                },
            ]
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Widget title="Extras Might Needed for Prescriptions" id="pres_extras">
                <Fragment>
                    <MainContainer>
                        <Grid container spacing={2} className={classes.padded}>
                            <Grid item xs={4}>
                                <Summary title="Total Prescribed Drugs" value={this.state.totalPrescribedDrugs} />
                            </Grid>
                            <Grid item xs={4}>
                                <Summary title="In Pharmacy Stocks" value={this.state.inPharmacyStocks} />
                            </Grid>
                            <Grid item xs={4}>
                                <Summary title="Ordering Required" value={this.state.orderingRequired} />
                            </Grid>
                        </Grid>

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

export default withStyles(styleSheet)(PrescriptionExtras);