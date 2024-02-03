import React, { Component, Fragment } from "react";
import {
    ProgressbarWithColor
} from "app/components/LoonsLabComponents";
import { Grid, CircularProgress } from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import EstimationService from "app/services/EstimationService";
import InventoryService from "app/services/InventoryService";
import { convertTocommaSeparated, dateParse, includesArrayElements, yearParse } from "utils";
import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
import Card from '@mui/material/Card';
import ReactEcharts from 'echarts-for-react'
import echarts from "echarts/lib/echarts";

class EstimationAndConsumptions extends Component {

    constructor(props) {
        super(props)
        this.state = {
            barchartShow: true,

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

        console.log("year props", this.props.year)
        console.log("dp view", this.props.dpView)

        const userRoles = await localStorageService.getItem('userInfo').roles;
        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')
        let par
        if (includesArrayElements(userRoles, ['Devisional Pharmacist', 'RDHS']) && this.props.dpView) {
            par = {
                item_id: item_id,
                district: login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district,
                //owner_id: this.state.owner_id,
                warehouse_id: this.props.estimationData.warehouse_id,
                estimation_from: dateParse(firstDay),
                estimation_to: dateParse(lastDay),
                estimation_type: 'Annual',
                provincial: this.props.estimationData.institute_category == "Provincial" ? true : null,
                search_type: 'EstimationMonthly'
            }
        } else {
            par = {
                item_id: item_id,
                //district: login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district,
                owner_id: this.state.owner_id,
                warehouse_id: this.props.estimationData.warehouse_id,
                estimation_from: dateParse(firstDay),
                estimation_to: dateParse(lastDay),
                estimation_type: 'Annual',
                provincial: this.props.estimationData.institute_category == "Provincial" ? true : null,
                search_type: 'EstimationMonthly'
            }
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

        let params


        if (includesArrayElements(userRoles, ['Devisional Pharmacist', 'RDHS']) && this.props.dpView) {
            params = {
                //owner_id: this.state.owner_id,
                district: login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district,
                item_id: item_id,
                from: dateParse(firstDay),
                to: dateParse(lastDay),
                type: 'Monthly',
                provincial: this.props.estimationData.institute_category == "Provincial" ? true : null,
                search_type: 'CONSUMPTION'

            }
        } else {
            params = {
                owner_id: this.state.owner_id,
                item_id: item_id,
                from: dateParse(firstDay),
                to: dateParse(lastDay),
                type: 'Monthly',
                provincial: this.props.estimationData.institute_category == "Provincial" ? true : null,
                search_type: 'CONSUMPTION'

            }
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

        let paramsRecieving

        if (includesArrayElements(userRoles, ['Devisional Pharmacist', 'RDHS']) && this.props.dpView) {
            paramsRecieving = {
                provincial: this.props.estimationData.institute_category == "Provincial" ? true : null,
                district: login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district,
                item_id: item_id,
                from: dateParse(firstDay),
                to: dateParse(lastDay),
                type: 'Monthly',
                search_type: 'CONSUMPTION',
                consumption_type: 'Recieving'

            }
        } else {
            paramsRecieving = {
                owner_id: this.state.owner_id,
                provincial: this.props.estimationData.institute_category == "Provincial" ? true : null,
                item_id: item_id,
                from: dateParse(firstDay),
                to: dateParse(lastDay),
                type: 'Monthly',
                search_type: 'CONSUMPTION',
                consumption_type: 'Recieving'

            }
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
                        {this.state.barchartShow &&
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
                                            type: 'bar',
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
                                            type: 'bar',
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
                                            type: 'bar',
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
                                            type: 'bar',
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
                        }

                        <table className="w-full" border="1" cellpadding="1" cellspacing="1" style={{ borderColor: 'white' }} >
                            <thead>
                                <tr style={{ width: '100%' }}>
                                    <td style={{ width: '16%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}></td>
                                    <td style={{ width: '7%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Jan</td>
                                    <td style={{ width: '7%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Fab</td>
                                    <td style={{ width: '7%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Mar</td>
                                    <td style={{ width: '7%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Apr</td>
                                    <td style={{ width: '7%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>May</td>
                                    <td style={{ width: '7%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Jun</td>
                                    <td style={{ width: '7%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Jul</td>
                                    <td style={{ width: '7%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Aug</td>
                                    <td style={{ width: '7%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Sep</td>
                                    <td style={{ width: '7%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Oct</td>
                                    <td style={{ width: '7%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Nov</td>
                                    <td style={{ width: '7%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Dec</td>
                                </tr>
                            </thead>
                            <tbody>



                                <tr style={{ width: '100%' }}>
                                    <td style={{ textAlign: 'center', backgroundColor: '#5d97ff' }}>Estimation</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.annualEstimation[0], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.annualEstimation[1], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.annualEstimation[2], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.annualEstimation[3], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.annualEstimation[4], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.annualEstimation[5], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.annualEstimation[6], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.annualEstimation[7], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.annualEstimation[8], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.annualEstimation[9], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.annualEstimation[10], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.annualEstimation[11], 2)}</td>
                                </tr>

                                <tr style={{ width: '100%' }}>
                                    <td style={{ textAlign: 'center', backgroundColor: '#5d97ff' }}>Consumption</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.consumption[0], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.consumption[1], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.consumption[2], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.consumption[3], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.consumption[4], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.consumption[5], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.consumption[6], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.consumption[7], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.consumption[8], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.consumption[9], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.consumption[10], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.consumption[11], 2)}</td>
                                </tr>

                                <tr style={{ width: '100%' }}>
                                    <td style={{ textAlign: 'center', backgroundColor: '#5d97ff' }}>Recieving</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.recieving[0], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.recieving[1], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.recieving[2], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.recieving[3], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.recieving[4], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.recieving[5], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.recieving[6], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.recieving[7], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.recieving[8], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.recieving[9], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.recieving[10], 2)}</td>
                                    <td style={{ width: '7%', textAlign: 'center' }}>{convertTocommaSeparated(this.state.finalData.recieving[11], 2)}</td>
                                </tr>





                            </tbody>
                        </table>








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
