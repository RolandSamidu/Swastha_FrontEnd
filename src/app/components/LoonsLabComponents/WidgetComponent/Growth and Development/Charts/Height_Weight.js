import React from 'react'
import ReactEcharts from 'echarts-for-react'
import echarts from "echarts/lib/echarts";
import { merge } from 'lodash'

const defaultOptionLineChart = {
    grid: {
        top: 16,
        left: 36,
        right: 16,
        bottom: 32,
    },
    legend: {},
    tooltip: {
        trigger: 'axis'
    },
    series: [
        {
            //areaStyle: {},
            label: {
                show: true,
                position: 'top'
            },
            smooth: true,
            lineStyle: {
                width: 2,
                color: 'blue',
            },
        },
    ],
    xAxis: {
        show: true,
        type: 'category',
        showGrid: true,
        boundaryGap: false,
        axisLabel: {
            color: 'black',
            margin: 20,
        },
        axisLine: {
            show: true,
        },
        axisTick: {
            show: true,
        },
    },
    yAxis: {
        // type: 'value',
        //min: 10,
        //max: 60,
        axisLabel: {
            color: 'black',
            margin: 20,
            fontSize: 13,
            fontFamily: 'roboto',
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: 'rgba(255, 255, 255, .1)',
            },
        },

        axisLine: {
            show: true,
        },
        axisTick: {
            show: true,
        },
    },
    /*  color: [
         {
             type: 'linear',
             x: 0,
             y: 0,
             x2: 0,
             y2: 1,
             colorStops: [
                 {
                     offset: 0,
                     color: 'red', // color at 0% position
                 },
                 {
                     offset: 1,
                     color: 'red', // color at 100% position
                 },
             ],
             global: false, // false by default
         },
     ], */
}


const defaultOptionsFunction = (type) => {
    let defaultOptions = null;

    return defaultOptionLineChart;
}


const loadData = (type, data) => {
    let option = null;
    if (type == 'line') {
        option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                icon: "circle",
                x: "center",
                y: "bottom",
                data: ["height","weight"],
                //itemStyle:{color:}, 
                textStyle: {
                   // color: "black"
                }
            },
            xAxis: {
                type: 'category',
                data: data.height,
            },
            yAxis: {
                type: 'category',
                data: data.weight
            },
            series: [
                {
                    name: 'Height',
                    data: data.height,
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
                            // {
                            //     offset: 0.5,
                            //     color: "#00a1e1"
                            // },
                            // {
                            //     offset: 1,
                            //     color: "#00bfe1"
                            // }
                        ]),
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                },
                {
                    name: 'Weight',
                    data: data.weight,
                    smooth: true,
                    type: 'line',
                    color: "#f542a1",
                    lineStyle: {
                        width: 2,
                        color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "#f542a1"
                            },
                            // {
                            //     offset: 0.5,
                            //     color: "#f542a1"
                            // },
                            // {
                            //     offset: 1,
                            //     color: "#f542a1"
                            // }
                        ]),
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                },

            ]
        }
        // console.log('try to find age', data.patient_age)
    }
    


    return option;

}


const Height_Weight = ({ height, type, data, className }) => {
    let option = loadData(type, data)
    return (
        <ReactEcharts
            className={className}
            style={{ height: height }}
            option={merge({}, defaultOptionsFunction, option)}
        />
    )
}

export default Height_Weight
