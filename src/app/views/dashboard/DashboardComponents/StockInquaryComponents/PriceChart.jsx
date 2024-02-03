import React, { Component, Fragment } from "react";
import {
    ProgressbarWithColor
} from "app/components/LoonsLabComponents";
import { Grid, CircularProgress } from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import EstimationService from "app/services/EstimationService";
import InventoryService from "app/services/InventoryService";
import { convertTocommaSeparated, dateParse, yearParse } from "utils";
import WarehouseServices from "app/services/WarehouseServices";
import Card from '@mui/material/Card';
import ReactEcharts from 'echarts-for-react'
import echarts from "echarts/lib/echarts";
import ConsignmentService from "app/services/ConsignmentService";

class PriceChart extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            finalData: null,

        }
    }

    async dataLoad(year) {
        let price = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        let standed_cost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        let item_id = this.props.item_id
        let sr_no=this.props.sr_no
        const firstDay = new Date(year, 0, 1);

        // Create a new Date object for the last day of the year
        // To get the last day of the year, go to the first day of the next year (January 1 of next year)
        const lastDay = new Date(year + 1, 0, 0);

        let par = {
            item_id: item_id,
            estimation_from: dateParse(firstDay),
            estimation_to: dateParse(lastDay),
            estimation_type: 'Annual',
            search_type: "UNITCHART",
            type: "Monthly"
        }


        let res1 = await ConsignmentService.getConsignmentItems(par)

        console.log("price chart data", res1.data.view)
        if (res1.status == 200 && res1?.data?.view?.res.length > 0) {
            for (let month = 1; month < 13; month++) {
                const index = res1?.data?.view?.res?.findIndex(x => x.month == month)
                if (index != -1) {
                    price[month - 1] = Math.abs(res1?.data?.view?.res[index]?.price)
                } else if (price[month - 2]) {
                    price[month - 1] = price[month - 2]
                } else {
                    price[month - 1] = Math.abs(res1?.data?.view?.latest_details?.purchase_price)
                }
            }
        }


        let par_standerd_cost = {
            //id: item_id,
            sr_no:sr_no,
            from: dateParse(firstDay),
            to: dateParse(lastDay),
            SEARCH_TYPE: "Pricing",
            type: "Monthly"
        }


        const res_standerd = await InventoryService.fetchAllItems(par_standerd_cost)
        console.log('standerd cost loaddata', res_standerd.data.view)

        if (res_standerd.status == 200) {
            for (let month = 1; month < 13; month++) {
                const index = res_standerd?.data?.view?.res?.findIndex(x => x.month == month)
                if (index != -1) {
                    let st_cost=Math.abs(res_standerd?.data?.view?.res[index]?.standard_cost)
                    standed_cost[month - 1] = isNaN(st_cost)?0:st_cost
                } else if (standed_cost[month - 2]) {
                    standed_cost[month - 1] = standed_cost[month - 2]
                } else {
                    let latest_st_cost=Math.abs(res_standerd?.data?.view?.latest_details?.standard_cost)
                    standed_cost[month - 1] = isNaN(latest_st_cost)?0:latest_st_cost
                }
            }

        }




        let finalData = {
            lable: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            price: price,
            standed_cost:standed_cost
        }

        this.setState({
            finalData: finalData,
            loaded: true
        })

        console.log("final data cost",finalData)

        /* 
        
                let resp = await EstimationService.getAllEstimationITEMS(par)
        
                if (resp.status === 200) {
                    console.log("anual astimations", resp.data.view)
                    let allData = resp.data.view[0]
                    annualEstimation = [
                        Math.abs(allData?.January) || 0,
                        Math.abs(allData?.February) || 0,
                        Math.abs(allData?.March) || 0,
                        Math.abs(allData?.April) || 0,
                        Math.abs(allData?.May) || 0,
                        Math.abs(allData?.June) || 0,
                        Math.abs(allData?.July) || 0,
                        Math.abs(allData?.August) || 0,
                        Math.abs(allData?.September) || 0,
                        Math.abs(allData?.October) || 0,
                        Math.abs(allData?.November) || 0,
                        Math.abs(allData?.December) || 0
                    ]
                }
        
                let params = {
                    item_id: item_id,
                    from: dateParse(firstDay),
                    to: dateParse(lastDay),
                    type: 'Monthly',
                    search_type: 'Consumption'
        
                }
                let res = await WarehouseServices.getConsumptionDetails(params)
        
                if (res.status === 200) {
                    console.log("monthly consumtion", res.data.view)
        
                    for (let month = 1; month < 13; month++) {
                        const index = res?.data?.view?.findIndex(x => x.month == month)
                        if (index != -1) {
                            consumption[month] = Math.abs(res?.data?.view[index]?.consumption)
                            msdIssuance[month] = Math.abs(res?.data?.view[index]?.msd_issuance)
                        }
                    }
                }
        
                console.log("annualEstimation", annualEstimation)
                console.log("annualconsumpsion", consumption)
                console.log("annualmsdissuence", msdIssuance)
        
                let finalData = {
                    lable: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    annualEstimation: annualEstimation,
                    consumption: consumption,
                    msdIssuance: msdIssuance
                }
        
                this.setState({
                    finalData: finalData,
                    loaded: true
                }) */

    }



    componentDidMount() {
        const currentDate = new Date();
        this.dataLoad(currentDate.getFullYear())
    }


    render() {
        return (
            <Fragment>


                {this.state.loaded ?
                    <div className="w-full h-full">
                        <ReactEcharts
                            className='mt--10'
                            style={{ height: 300 }}
                            option={{
                                tooltip: {
                                    trigger: 'axis'
                                },
                                  legend: {
                                     icon: "circle",
                                     x: "center",
                                     y: "bottom",
                                     data: ["Price","Standed Cost"],
                                     //itemStyle:{color:}, 
                                     textStyle: {
                                         // color: "black"
                                     }
                                 }, 
                                xAxis: {
                                    type: 'category',
                                    data: this.state.finalData.lable,
                                    name: "Month " + yearParse(new Date()),
                                    nameLocation: 'center', // Set the location to 'center'
                                    nameGap: 30
                                },
                                yAxis: {
                                    type: 'value',
                                    name: 'Price(LKR)',
                                    nameLocation: 'center', // Set the location to 'center'
                                    nameGap: 30
                                },
                                series: [
                                    {
                                        name: 'Price',
                                        data: this.state.finalData.price,
                                        smooth: true,
                                        color: "#fc3560",
                                        type: 'line',
                                        lineStyle: {
                                            width: 2,
                                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: "#fc3560"
                                                },
                                                {
                                                    offset: 0.5,
                                                    color: "#fc3560"
                                                },
                                                {
                                                    offset: 1,
                                                    color: "#fc3560"
                                                }
                                            ]),
                                        },
                                        label: {
                                            show: false,
                                            position: 'top'
                                        },
                                    },
                                    {
                                        name: 'Standed Cost',
                                        data: this.state.finalData.standed_cost,
                                        smooth: true,
                                        color: "#0066ff",
                                        type: 'line',
                                        lineStyle: {
                                            width: 2,
                                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: "#0066ff"
                                                },
                                                {
                                                    offset: 0.5,
                                                    color: "#0066ff"
                                                },
                                                {
                                                    offset: 1,
                                                    color: "#0066ff"
                                                }
                                            ]),
                                        },
                                        label: {
                                            show: false,
                                            position: 'top'
                                        },
                                    },
                                ]
                            }}
                        />
                    </div>
                    :
                    <Grid className="justify-center text-center w-full pt-12">
                        <CircularProgress size={30} />
                    </Grid>
                }





            </Fragment>
        );
    }
}

export default PriceChart
