import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import {
    MainContainer,
    SubTitle,
    Widget,
} from 'app/components/LoonsLabComponents'
import {
    Card,
    TextField,
    MenuItem,
    IconButton,
    Icon,
    Grid,
} from '@material-ui/core'
import WarehouseServices from 'app/services/WarehouseServices'
import { exec } from 'apexcharts'
import LoonsButton from '../../Button'
import LabeledInput from '../../LabeledInput'
import { dateParse } from 'utils'
import moment from 'moment'

const styleSheet = (palette, ...theme) => ({
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
        flex: 1,
    },
    dotContainer: {
        position: 'absolute',
        top: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    dotTitle: {
        fontSize: '2vw',
    },
})

class ExchangesToday extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            data: [],
            incoming: 0,
            outgoing: 0,
            from_date: new Date(),
            to_date: moment().add(1, 'days').toDate(),
        }
    }

    fetchExchanges() {
        WarehouseServices.getWareHouseUsers({
            main_or_personal: 'Personal',
            employee_id: JSON.parse(localStorage.getItem('userInfo')).id,
        }).then((user) => {
            if (user.data && user.data.view && user.data.view.data) {
                const warehouse = user.data.view.data[0].warehouse_id
                let paramsFrom = {
                    from: warehouse,
                    exchange_type: 'EXCHANGE',
                    from_date: this.state.from_date,
                    to_date: this.state.to_date,
                    date_type: 'REQUESTED DATE',
                }
                WarehouseServices.getDrugExchanges(paramsFrom).then((exc) => {
                    this.setState({
                        incoming:
                            exc.data && exc.data.view
                                ? exc.data.view.totalItems
                                : 0,
                    })
                })

                let paramsTo = {
                    from: warehouse,
                    exchange_type: 'EXCHANGE',
                    from_date: this.state.from_date,
                    to_date: this.state.to_date,
                    date_type: 'REQUESTED DATE',
                }
                WarehouseServices.getDrugExchanges(paramsTo).then((exc) => {
                    this.setState({
                        outgoing:
                            exc.data && exc.data.view
                                ? exc.data.view.totalItems
                                : 0,
                    })
                })
            }
        })
    }

    componentDidMount() {
        // this.fetchExchanges()
    }

    render() {
        const { classes } = this.props
        return (
            <Grid container>
                <Grid item xs={12}>
                    {/* <Widget
                        padded={false}
                        title="Exchange Requests Today"
                        id="exchanges_todayc"
                    > */}
                    <Fragment>
                        <MainContainer>
                            <Grid container spacing={0}>
                                <Grid className="px-2 py-0" item xs={6}>
                                    <LabeledInput
                                        label="From"
                                        name="from"
                                        inputType="date"
                                        onUpdate={(e) =>
                                            this.setState({
                                                from_date: dateParse(e),
                                            })
                                        }
                                        value={this.state.from_date}
                                    />
                                </Grid>
                                <Grid className="px-2 py-0" item xs={6}>
                                    <LabeledInput
                                        label="To"
                                        name="to"
                                        inputType="date"
                                        onUpdate={(e) =>
                                            this.setState({
                                                to_date: dateParse(e),
                                            })
                                        }
                                        value={this.state.to_date}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <div className="mx-2 mb-4">
                                        <LoonsButton
                                            onClick={() =>
                                                this.fetchExchanges()
                                            }
                                        >
                                            Load Data
                                        </LoonsButton>
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className={classes.exchangeContainer}>
                                        <div className={classes.padded}>
                                            <h4>By Others</h4>
                                            <div className={classes.dot}>
                                                <div
                                                    className={
                                                        classes.dotContainer
                                                    }
                                                >
                                                    <h3
                                                        className={
                                                            classes.dotTitle
                                                        }
                                                    >
                                                        {this.state.outgoing}
                                                    </h3>
                                                    <SubTitle title="New Request" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={classes.padded}>
                                            <h4>By Me</h4>
                                            <div className={classes.dot}>
                                                <div
                                                    className={
                                                        classes.dotContainer
                                                    }
                                                >
                                                    <h3
                                                        className={
                                                            classes.dotTitle
                                                        }
                                                    >
                                                        {this.state.incoming}
                                                    </h3>
                                                    <SubTitle title="New Receive" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </MainContainer>
                    </Fragment>
                    {/* </Widget> */}
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styleSheet)(ExchangesToday)
