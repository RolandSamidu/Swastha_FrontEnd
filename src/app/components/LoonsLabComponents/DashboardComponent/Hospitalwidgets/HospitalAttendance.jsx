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

class HospitalAttendance extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            finalData: null,
            OPD: null,
            Admissions: null,
            annualEstimation: null,
            owner_id: this.props.owner_id,

        }
    }

    async dataLoad(year) {
        let annualEstimation = []
        let OPD = [12, 52, 23, 7, 10, 63, 55, 22,0, 10, 20, 15]
        let Clinic = [2, 5, 4, 7, 8, 20, 15, 12, 15, 13, 14, 8]
        let Admissions = [2, 4, 3, 9, 10, 22, 12, 11, 10, 14, 8, 9]


        let finalData = {
            lable: ["16/08/2023", "17/08/2023", "18/08/2023", "19/08/2023", "20/08/2023", "21/08/2023", "22/08/2023", "23/08/2023", "24/08/2023", "25/08/2023", "26/08/2023", "27/08/2023"],
            OPD: OPD,
            Admissions: Admissions,
             Clinic: Clinic
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
                                    data: ["OPD Attendence", "Admissions", "Clinic Attendence"],
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
                                        name: 'OPD Attendence',
                                        data: this.state.finalData.OPD,
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
                                        name: 'Admissions',
                                        data: this.state.finalData.Admissions,
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
                                    },
                                     {
                                        name: 'Clinic Attendence',
                                        data: this.state.finalData.Clinic,
                                        smooth: true,
                                        type: 'line',
                                        color: "#0040ff",
                                        lineStyle: {
                                            width: 2,
                                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: "#0040ff"
                                                },
                                                {
                                                    offset: 0.5,
                                                    color: "#0040ff"
                                                },
                                                {
                                                    offset: 1,
                                                    color: "#0040ff"
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

export default HospitalAttendance
