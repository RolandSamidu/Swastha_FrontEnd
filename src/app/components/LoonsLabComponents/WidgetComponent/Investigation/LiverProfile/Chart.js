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
                data: ["AST","ALT","ALP","Total Bilirubin","Total Protein","Albumin","Globulin","GGT","PT/INR","APTT","BT/CT"],
                //itemStyle:{color:}, 
                textStyle: {
                   // color: "black"
                }
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
                    name: 'AST',
                    data: data.AST,
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
                        show: true,
                        position: 'top'
                    },
                },
                {
                    name: 'ALT',
                    data: data.ALT,
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
                        show: true,
                        position: 'top'
                    },
                },
                {
                    name: 'ALP',
                    data: data.ALP,
                    smooth: true,
                    type: 'line',
                    color: "#32a866",
                    lineStyle: {
                        width: 2,
                        color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
                        show: true,
                        position: 'top'
                    },
                },
                {
                    name: 'Total Bilirubin',
                    data: data.Total_Bilirubin,
                    smooth: true,
                    type: 'line',
                    color: "#ebcc34",
                    lineStyle: {
                        width: 2,
                        color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "#ebcc34"
                            },
                            {
                                offset: 0.5,
                                color: "#ebcc34"
                            },
                            {
                                offset: 1,
                                color: "#ebcc34"
                            }
                        ]),
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                },{
                    name: 'Total Protein',
                    data: data.Total_Protein,
                    smooth: true,
                    type: 'line',
                    color: "#03fce8",
                    lineStyle: {
                        width: 2,
                        color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "#03fce8"
                            },
                            {
                                offset: 0.5,
                                color: "#03fce8"
                            },
                            {
                                offset: 1,
                                color: "#03fce8"
                            }
                        ]),
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                },
                {
                    name: 'Albumin',
                    data: data.Albumin,
                    smooth: true,
                    type: 'line',
                    color: "#dceb7c",
                    lineStyle: {
                        width: 2,
                        color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "#dceb7c"
                            },
                            {
                                offset: 0.5,
                                color: "#dceb7c"
                            },
                            {
                                offset: 1,
                                color: "#dceb7c"
                            }
                        ]),
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                },
                  {
                    name: 'Globulin',
                    data: data.Globulin,
                    smooth: true,
                    type: 'line',
                    color: "#ba34eb",
                    lineStyle: {
                        width: 2,
                        color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "#ba34eb"
                            },
                            {
                                offset: 0.5,
                                color: "#ba34eb"
                            },
                            {
                                offset: 1,
                                color: "#ba34eb"
                            }
                        ]),
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                },
                {
                    name: 'GGT',
                    data: data.GGT,
                    smooth: true,
                    type: 'line',
                    color: "#6d6b6e",
                    lineStyle: {
                        width: 2,
                        color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "#6d6b6e"
                            },
                            {
                                offset: 0.5,
                                color: "#6d6b6e"
                            },
                            {
                                offset: 1,
                                color: "#6d6b6e"
                            }
                        ]),
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                },
                {
                    name: 'PT/INR',
                    data: data.PTINR,
                    smooth: true,
                    type: 'line',
                    color: "#fa960a",
                    lineStyle: {
                        width: 2,
                        color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "#fa960a"
                            },
                            {
                                offset: 0.5,
                                color: "#fa960a"
                            },
                            {
                                offset: 1,
                                color: "#fa960a"
                            }
                        ]),
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                },
                {
                    name: 'APTT',
                    data: data.APTT,
                    smooth: true,
                    type: 'line',
                    color: "#46fa0a",
                    lineStyle: {
                        width: 2,
                        color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "#46fa0a"
                            },
                            {
                                offset: 0.5,
                                color: "#46fa0a"
                            },
                            {
                                offset: 1,
                                color: "#46fa0a"
                            }
                        ]),
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                },
                {
                    name: 'BT/CT',
                    data: data.BTCT,
                    smooth: true,
                    type: 'line',
                    color: "#0a2afa",
                    lineStyle: {
                        width: 2,
                        color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "#0a2afa"
                            },
                            {
                                offset: 0.5,
                                color: "#0a2afa"
                            },
                            {
                                offset: 1,
                                color: "#0a2afa"
                            }
                        ]),
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


const Chart = ({ height, type, data, className }) => {
    let option = loadData(type, data)
    return (
        <ReactEcharts
            className={className}
            style={{ height: height }}
            option={merge({}, defaultOptionsFunction, option)}
        />
    )
}

export default Chart
