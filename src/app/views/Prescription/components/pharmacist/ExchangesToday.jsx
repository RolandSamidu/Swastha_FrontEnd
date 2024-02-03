import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { MainContainer, SubTitle, Widget } from "app/components/LoonsLabComponents";
import WarehouseServices from "app/services/WarehouseServices";
import { exec } from "apexcharts";

const styleSheet = ((palette, ...theme) => ({
    exchangeContainer: {
        display: 'flex',
    },
    dot: {
        width: '100%',
        border: '1px solid #bbb',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '100%',
        position: 'relative',
    },
    padded: {
        padding: '2%',
        textAlign: 'center',
        flex: 1
    },
    dotContainer: {
        position: 'absolute',
        top: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    dotTitle: {
        fontSize: '2vw'
    },
}));

class ExchangesToday extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            data: [],
            incoming: 0,
            outgoing: 0
        }
    }

    fetchExchanges() {
        WarehouseServices.getWareHouseUsers({
            'main_or_personal': 'Personal',
            'employee_id': JSON.parse(localStorage.getItem('userInfo')).id,
        }).then((user) => {
            if (user.data && user.data.view && user.data.view.data) {
                const warehouse = user.data.view.data[0].warehouse_id;
                WarehouseServices.getDrugExchanges({
                    "from": warehouse,
                    "exchange_type": "EXCHANGE"
                }).then((exc) => {
                    this.setState({ incoming: exc.data && exc.data.view ? exc.data.view.totalItems : 0 });
                });

                WarehouseServices.getDrugExchanges({
                    "to": warehouse,
                    "exchange_type": "EXCHANGE"
                }).then((exc) => {
                    this.setState({ outgoing: exc.data && exc.data.view ? exc.data.view.totalItems : 0 });
                });
            }
        })
    }

    componentDidMount() {
        this.fetchExchanges();
    }

    render() {
        const { classes } = this.props;
        return (
            <Widget padded={false} title="Exchange Requests Today" id="exchanges_todayc">
                <Fragment>
                    <MainContainer>
                        <div className={classes.exchangeContainer}>
                            <div className={classes.padded}>
                                <h4>By Others</h4>
                                <div className={classes.dot}>
                                    <div className={classes.dotContainer}>
                                        <h3 className={classes.dotTitle}>{this.state.outgoing}</h3>
                                        <SubTitle title="New Request"/>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.padded}>
                                <h4>By Me</h4>
                                <div className={classes.dot}>
                                    <div className={classes.dotContainer}>
                                        <h3 className={classes.dotTitle}>{this.state.incoming}</h3>
                                        <SubTitle title="New Receive"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MainContainer>
                </Fragment>
            </Widget>
        );
    }
}

export default withStyles(styleSheet)(ExchangesToday);