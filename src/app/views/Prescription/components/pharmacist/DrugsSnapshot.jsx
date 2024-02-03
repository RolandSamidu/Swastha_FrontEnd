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

class DrugsSnapshot extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drugsAboveOptimal: 20,
            drugsToExchange: 152,
            drugsToOrder: 75,
            columns: [
                {
                    name: 'snNo',
                    label: 'SN No',
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
                        customBodyRender: (val) => <Button style={{ width: '100%' }} variant="contained" color={val === 'Exchange' ? 'primary' : 'secondary'}>{val}</Button>
                    },
                },
            ],
            data: [
                {
                    snNo: 1,
                    drugName: 'A0003',
                    dateTime: '2021-01-01',
                    quantity: 2,
                    orderingRequired: 3,
                    possibleOption: 'Exchange',
                },
                {
                    snNo: 2,
                    drugName: 'A0004',
                    dateTime: '2021-01-01',
                    quantity: 2,
                    orderingRequired: 3,
                    possibleOption: 'Order',
                },
            ]
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Widget title="Drug Snapshot of Today" id="drug_snapshot">
                <Fragment>
                    <MainContainer>
                        <Grid container spacing={2} className={classes.padded}>
                            <Grid item xs={4}>
                                <Summary title="Drugs Above Optimal Qty" value={this.state.drugsAboveOptimal} />
                            </Grid>
                            <Grid item xs={4}>
                                <Summary title="Drugs to Exchange Today" value={this.state.drugsToExchange} />
                            </Grid>
                            <Grid item xs={4}>
                                <Summary title="Drugs to Order Today" value={this.state.drugsToOrder} />
                            </Grid>
                        </Grid>

                        <LoonsTable
                            id={'drugsSnapshot'}
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

export default withStyles(styleSheet)(DrugsSnapshot);