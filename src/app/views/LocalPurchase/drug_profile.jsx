import React, { Component, Fragment } from "react";
import {
    CardTitle,
    LoonsCard,
} from "app/components/LoonsLabComponents";
import { Grid, CircularProgress, Typography, Divider, } from '@material-ui/core'

import StockInquiryItemDetails from '../dashboard/DashboardComponents/StockInquaryComponents/StockInquiryItemDetails'
import MonthlyForecast from '../dashboard/DashboardComponents/StockInquaryComponents/MonthlyForecast'
import PriceChart from '../dashboard/DashboardComponents/StockInquaryComponents/PriceChart'
import OrdListReceived from '../dashboard/DashboardComponents/StockInquaryComponents/OrdListReceived'
import OrdListPending from '../dashboard/DashboardComponents/StockInquaryComponents/OrdListPending'
import StockInquiryRequirement from '../dashboard/DashboardComponents/StockInquaryComponents/Requirement'
import StockInquiryOrderList from '../dashboard/DashboardComponents/StockInquaryComponents/OrdList'
import StockInquiryEstimateAndIssue from '../dashboard/DashboardComponents/StockInquaryComponents/EstimateAndIssue'

class DrugProfileDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            alert: false,
            message: "",
            severity: 'success',
            visible: false,
            loading: false,
            selectedSR: null,
            data: [],
            item_list: [],


            formData: {
                sr_no: null,
                search: null,
                name: null
            }
        }
    }

    async dataLoad() {

        this.setState({
            loading: true,
            visible: true
        }, () => {
            this.render()
        })

    }

    componentDidMount() {
        if (this.props.item_id) {
            this.dataLoad()
        }

    }

    render() {
        return (
            <Fragment>

                <div style={{ flex: 1 }}>
                    <Typography variant="h6" className="font-semibold">Drug Profile</Typography>
                </div>
                <Divider />
                {this.state.visible ?
                    <>
                        {/* <Fragment> */}
                        <Grid container className="mt-5 w-full">
                            <Grid item sm={12}>
                                <LoonsCard>
                                    <CardTitle title={"Item"} />
                                    <br></br>
                                    {this.state.loading ?
                                        <StockInquiryItemDetails item_id={this.props.item_id}></StockInquiryItemDetails>
                                        :
                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30} />
                                        </Grid>}
                                </LoonsCard>
                            </Grid>
                        </Grid>

                        <Grid container className="mt-5 w-full">
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <LoonsCard>
                                    <CardTitle title={"Order Placed Details"} />
                                    <br></br>
                                    {this.state.loading ?
                                        <StockInquiryEstimateAndIssue item_id={this.props.item_id}></StockInquiryEstimateAndIssue>
                                        :
                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30} />
                                        </Grid>}
                                </LoonsCard>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} className="mt-5 w-full">
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                <LoonsCard>
                                    <CardTitle title={"Price Chart"} />
                                    {this.state.loading ?
                                        <PriceChart item_id={this.props.item_id}></PriceChart>
                                        :
                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30} />
                                        </Grid>}
                                </LoonsCard>
                            </Grid>

                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                <LoonsCard>
                                    <CardTitle title={"Monthly Forecast"} />
                                    {this.state.loading ?
                                        <MonthlyForecast item_id={this.props.item_id}></MonthlyForecast>
                                        :
                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30} />
                                        </Grid>}
                                </LoonsCard>
                            </Grid>

                        </Grid>

                        <Grid container className="mt-5 w-full">
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <LoonsCard>
                                    <CardTitle title={"Item Requirement"} />
                                    <br></br>
                                    {this.state.loading ?
                                        <StockInquiryRequirement item_id={this.props.item_id}></StockInquiryRequirement>
                                        :
                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30} />
                                        </Grid>}
                                </LoonsCard>
                            </Grid>
                        </Grid>

                        <Grid container className="mt-5 w-full">
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <LoonsCard>
                                    <CardTitle title={"Last Deliverd Orders 32"} />
                                    <br></br>
                                    {this.state.loading ?
                                        <OrdListReceived item_id={this.props.item_id}></OrdListReceived>
                                        :
                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30} />
                                        </Grid>}
                                </LoonsCard>
                            </Grid>
                        </Grid>

                        <Grid container className="mt-5 w-full">
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <LoonsCard>
                                    <CardTitle title={"Pending Orders"} />
                                    <br></br>
                                    {this.state.loading ?
                                        <OrdListPending item_id={this.props.item_id}></OrdListPending>
                                        :
                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30} />
                                        </Grid>}
                                </LoonsCard>
                            </Grid>
                        </Grid>

                        <Grid container className="mt-5 w-full">
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <LoonsCard>
                                    <CardTitle title={"Order Placed Details"} />
                                    <br></br>
                                    {this.state.loading ?
                                        <StockInquiryOrderList item_id={this.props.item_id}></StockInquiryOrderList>
                                        :
                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30} />
                                        </Grid>}
                                </LoonsCard>
                            </Grid>
                        </Grid>




                        {/* </Fragment> */}

                    </>
                    : <Grid className="justify-center text-center w-full pt-12">
                        <CircularProgress size={30} />
                    </Grid>}
            </Fragment>
        );
    }
}

export default DrugProfileDashboard
