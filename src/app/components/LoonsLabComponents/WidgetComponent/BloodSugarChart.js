import React from 'react'
import ReactEcharts from 'echarts-for-react'
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
            xAxis: {
                type: 'category',
                data: data.date
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'FBS',
                    data: data.fbs,
                    type: 'line',
                    lineStyle: {
                        width: 2,
                        color: 'blue',
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                },
                {
                    name: 'PPBS',
                    data: data.ppbs,
                    type: 'line',
                    lineStyle: {
                        width: 2,
                        color: 'red',
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                },
                {
                    name: 'RBS',
                    data: data.rbs,
                    type: 'line',
                    lineStyle: {
                        width: 2,
                        color: '#1cf200',
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                }

            ]
        }

    }
    if (type == 'bar') {
        option = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'A',
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar',
                    lineStyle: {
                        width: 2,
                        color: 'blue',
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                },
                {
                    name: 'B',
                    data: [125, 200, 145, 30, 170, 10, 140],
                    type: 'bar',
                    lineStyle: {
                        width: 2,
                        color: 'red',
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                }

            ]
        }

    }


    return option;

}


const BloodSugarChart = ({ height, type, data, className }) => {
    let option = loadData(type, data)
    return (
        <ReactEcharts
            className={className}
            style={{ height: height }}
            option={merge({}, defaultOptionsFunction, option)}
        />
    )
}

export default BloodSugarChart
