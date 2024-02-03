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
import localStorageService from "app/services/localStorageService";
import Card from '@mui/material/Card';
import ReactEcharts from 'echarts-for-react'
import echarts from "echarts/lib/echarts";

class EstimationAndConsumptions extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            finalData: null,
            consumption: null,
            recieving: null,
            annualEstimation: null,
            owner_id: this.props.owner_id,

        }
    }

    async dataLoad(year) {
        let annualEstimation = []
        let consumption = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let msdIssuance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let recieving = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]


        let item_id = this.props.item_id
        const firstDay = new Date(year, 0, 1);

        // Create a new Date object for the last day of the year
        // To get the last day of the year, go to the first day of the next year (January 1 of next year)
        const lastDay = new Date(year + 1, 0, 0);

        console.log("year props",this.props.year)

        let par = {
            item_id: item_id,
            owner_id: this.state.owner_id,
            warehouse_id:this.props.warehouse_id,
            estimation_from: dateParse(firstDay),
            estimation_to: dateParse(lastDay),
            estimation_type: 'Annual',
            search_type: 'EstimationMonthly'
        }

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
            owner_id: this.state.owner_id,
            warehouse_id:this.props.warehouse_id,
            item_id: item_id,
            from: dateParse(firstDay),
            to: dateParse(lastDay),
            type: 'Monthly',
            search_type: 'CONSUMPTION'

        }
        let res = await WarehouseServices.getWarehouseHistories(params)

        if (res.status === 200) {
            console.log("monthly consumtion", res.data.view)

            for (let month = 1; month < 13; month++) {
                const index = res?.data?.view?.findIndex(x => x.month == month)

                if (index != -1) {
                    /* 
                                        if (year == 2023 && month == 1) {
                                            msdIssuance[month - 1] = 0
                                            consumption[month - 1] = 0
                                        } else { */
                    //msdIssuance[month - 1] = Math.abs(res?.data?.view[index]?.msd_issuance)
                    consumption[month - 1] = Math.abs(res?.data?.view[index]?.quantity)
                    // }

                }
            }
        }




        let paramsRecieving = {
            owner_id: this.state.owner_id,
            warehouse_id:this.props.warehouse_id,
            item_id: item_id,
            from: dateParse(firstDay),
            to: dateParse(lastDay),
            type: 'Monthly',
            search_type: 'CONSUMPTION',
            consumption_type: 'Recieving'

        }
        let res2 = await WarehouseServices.getWarehouseHistories(paramsRecieving)

        if (res2.status === 200) {
            console.log("monthly Recieving", res.data.view)

            for (let month = 1; month < 13; month++) {
                const index = res2?.data?.view?.findIndex(x => x.month == month)

                if (index != -1) {
                    /* 
                                        if (year == 2023 && month == 1) {
                                            msdIssuance[month - 1] = 0
                                            consumption[month - 1] = 0
                                        } else { */
                    //msdIssuance[month - 1] = Math.abs(res?.data?.view[index]?.msd_issuance)
                    recieving[month - 1] = Math.abs(res2?.data?.view[index]?.quantity)
                    // }

                }
            }
        }

        console.log("annualEstimation", annualEstimation)
        console.log("annualconsumpsion", consumption)
        //console.log("annualmsdissuence", msdIssuance)

        let finalData = {
            lable: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            annualEstimation: annualEstimation,
            consumption: consumption,
            recieving: recieving
            /// msdIssuance: msdIssuance
        }

        this.setState({
            finalData: finalData,
            loaded: true
        })

    }



    componentDidMount() {
        const currentDate = new Date();
        this.dataLoad(this.props.year)
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
                                    data: ["Estimation", "Consumption", "Recievings"],
                                    //itemStyle:{color:}, 
                                    textStyle: {
                                        // color: "black"
                                    }
                                },
                                xAxis: {
                                    type: 'category',
                                    data: this.state.finalData.lable
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                series: [
                                    {
                                        name: 'Estimation',
                                        data: this.state.finalData.annualEstimation,
                                        smooth: true,
                                        color: "#0074e1",
                                        type: 'line',
                                        lineStyle: {
                                            width: 2,
                                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: "#0074e1"
                                                },
                                                {
                                                    offset: 0.5,
                                                    color: "#00a1e1"
                                                },
                                                {
                                                    offset: 1,
                                                    color: "#00bfe1"
                                                }
                                            ]),
                                        },
                                        label: {
                                            show: false,
                                            position: 'top'
                                        },
                                    },
                                    {
                                        name: 'Consumption',
                                        data: this.state.finalData.consumption,
                                        smooth: true,
                                        type: 'line',
                                        color: "#f542a1",
                                        lineStyle: {
                                            width: 2,
                                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: "#f542a1"
                                                },
                                                {
                                                    offset: 0.5,
                                                    color: "#f542a1"
                                                },
                                                {
                                                    offset: 1,
                                                    color: "#f542a1"
                                                }
                                            ]),
                                        },
                                        label: {
                                            show: false,
                                            position: 'top'
                                        },
                                    },
                                    {
                                        name: 'Recievings',
                                        data: this.state.finalData.recieving,
                                        smooth: true,
                                        type: 'line',
                                        color: "#32a866",
                                        lineStyle: {
                                            width: 2,
                                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: "#32a866"
                                                },
                                                {
                                                    offset: 0.5,
                                                    color: "#32a866"
                                                },
                                                {
                                                    offset: 1,
                                                    color: "#32a866"
                                                }
                                            ]),
                                        },
                                        label: {
                                            show: false,
                                            position: 'top'
                                        },
                                    }
                                    /* {
                                        name: 'MSD Issuance',
                                        data: this.state.finalData.msdIssuance,
                                        smooth: true,
                                        type: 'line',
                                        color: "#32a866",
                                        lineStyle: {
                                            width: 2,
                                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: "#32a866"
                                                },
                                                {
                                                    offset: 0.5,
                                                    color: "#32a866"
                                                },
                                                {
                                                    offset: 1,
                                                    color: "#32a866"
                                                }
                                            ]),
                                        },
                                        label: {
                                            show: false,
                                            position: 'top'
                                        },
                                    }, */




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

export default EstimationAndConsumptions
