import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import {
    Card,
    TextField,
    MenuItem,
    IconButton,
    Icon,
    Grid,
} from '@material-ui/core'
import { themeColors } from 'app/components/MatxTheme/themeColors'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import DoughnutChart from './shared/Doughnut'
import ModifiedAreaChart from './shared/ModifiedAreaChart'
import StatCards from './shared/StatCards'
import TopSellingTable from './shared/TopSellingTable'
import RowCards from './shared/RowCards'
import StatCards2 from './shared/StatCards2'
import UpgradeCard from './shared/UpgradeCard'
import Campaigns from './shared/Campaigns'
import FacultyStatCards from './DashboardComponents/FacultyStatCards'
import UniversityStafCard from './DashboardComponents/UniversityStafCard'
import PieChart from 'app/components/LoonsLabComponents/DashboardComponent/PieChart'
import LineChart from 'app/components/LoonsLabComponents/DashboardComponent/LineChart'
import BarChart from 'app/components/LoonsLabComponents/DashboardComponent/BarChart'
import HorizontalBarChart from 'app/components/LoonsLabComponents/DashboardComponent/HorizontalBarChart'
import SpeedMeterChart from 'app/components/LoonsLabComponents/DashboardComponent/SpeedMeterChart'
import PendingExchangesFromOthers from 'app/components/LoonsLabComponents/DashboardComponent/PendingExchangesFromOthers'
import PendingExchangesByMe from 'app/components/LoonsLabComponents/DashboardComponent/PendingExchangesByMe'
import ExchangesToday from 'app/components/LoonsLabComponents/DashboardComponent/ExchangesToday'
import ActivePrescription from 'app/components/LoonsLabComponents/DashboardComponent/ActivePrescription'
import IssuedPrescription from 'app/components/LoonsLabComponents/DashboardComponent/IssuedPrescription'
import DrugAvailability from 'app/components/LoonsLabComponents/DashboardComponent/DrugAvailability'
import DrugConsumptionBarChart from 'app/components/LoonsLabComponents/DashboardComponent/DrugConsumptionBarChart'
import PrescriptionSummaryPieChart from 'app/components/LoonsLabComponents/DashboardComponent/PrescriptionSummaryPieChart'
import OrderSummaryPieChart from 'app/components/LoonsLabComponents/DashboardComponent/OrderSummaryPieChart'
import QualityFailedDrugs from 'app/components/LoonsLabComponents/DashboardComponent/Quality_Failed_Drugs'
import Short_Expiry_List from 'app/components/LoonsLabComponents/DashboardComponent/Short_Expiry_List'

const styleSheet = (palette, ...theme) => ({})

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        let { palette } = this.props
        let activeTheme = MatxLayoutSettings.activeTheme
        return (
            <Fragment>
                <div className="pb-24 pt-7 px-8 ">
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Short_Expiry_List />
                        </Grid>
                        {/* <Grid item xs={6}>
                            <QualityFailedDrugs />
                        </Grid>
                        <Grid item xs={6}>
                            <DrugConsumptionBarChart />
                        </Grid>
                        <Grid item xs={6}>
                            <PrescriptionSummaryPieChart />
                        </Grid>
                        <Grid item xs={6}>
                            <OrderSummaryPieChart />
                        </Grid> */}
                    </Grid>
                    {/* <IssuedPrescription />
                    <ActivePrescription />
                    <ExchangesToday />
                    <PendingExchangesByMe />
                    <PendingExchangesFromOthers /> */}

                    {/* <div className="card-title capitalize text-black my-12">
                        Hospital Order Fulfillment Rate
                    </div>
                    <SpeedMeterChart />

                    <div className="card-title capitalize text-black mb-12">
                        Short Expire Item Analysis
                    </div>

                    <PieChart height="280px" />

                    <div className="card-title capitalize text-black my-12">
                        Date wise Rejected Qty
                    </div>
                    <LineChart />

                    <div className="card-title capitalize text-black my-12">
                        Date wise Rejected Qty
                    </div>
                    <BarChart />

                    <div className="card-title capitalize text-black my-12">
                        Actual Expenses Against MSD Budget
                    </div>
                    <HorizontalBarChart /> */}

                    {/* <ModifiedAreaChart
                        height="280px"
                        option={{
                            series: [
                                {
                                    lineStyle: {
                                        width: 2,
                                        color: themeColors[activeTheme].palette
                                            .primary.main,
                                    },
                                    data: [
                                        540, 550, 542, 200, 420, 580, 470, 350,
                                        640, 760, 780, 710,
                                    ],
                                    type: 'line',
                                },
                            ],
                            xAxis: {
                                axisLabel: {
                                    color: themeColors[activeTheme].palette
                                        .primary.main,
                                    margin: 20,
                                },
                                data: [
                                    '2010',
                                    '2011',
                                    '2012',
                                    '2013',
                                    '2014',
                                    '2015',
                                    '2016',
                                    '2017',
                                    '2018',
                                    '2019',
                                    '2020',
                                    '2021',
                                ],
                            },
                            yAxis: {
                                type: 'value',
                                //min: 10,
                                //max: 1000,
                                axisLabel: {
                                    color: themeColors[activeTheme].palette
                                        .primary.main,
                                    margin: 0,
                                    fontSize: 13,
                                    fontFamily: 'roboto',
                                },
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: 'rgba(0, 0, 0, .1)',
                                    },
                                },
                            },
                            color: [
                                {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: themeColors[activeTheme]
                                                .palette.primary.main, // color at 0% position
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(255,255,255,0)', // color at 100% position
                                        },
                                    ],
                                    global: false, // false by default
                                },
                            ],
                        }}
                    /> */}
                </div>
                {/* <div className="analytics m-sm-30 mt--18 px-8 ">
                    <Grid container spacing={3}>
                        <Grid item lg={8} md={8} sm={12} xs={12}>
                            <FacultyStatCards />
                        </Grid>

                        <Grid item lg={4} md={4} sm={12} xs={12}>
                            <UniversityStafCard />
                        </Grid>
                    </Grid>
                </div> */}
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(Dashboard)
