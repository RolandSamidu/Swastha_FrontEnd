import React from 'react'
import ReactEcharts from 'echarts-for-react'
import echarts from "echarts/lib/echarts";
import { merge } from 'lodash'
import * as d3 from 'd3';

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


const loadData = (type, data, legendData) => {
    let option = null;
    if (type == 'pie') {
        var color = d3.scaleOrdinal().range(["#4169E1", "#228B22", "#8B4513", "#D2691E", "#8B008B"]);
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            legend: {
                icon: "circle",
                orient: 'vertical',
                left: 'left',
                // data: legendData,
                //itemStyle:{color:}, 
                textStyle: {
                   color: "black"
                }
            },
            series: [
                {
                    name: 'Short Expire Item Analysis',
                    // data: data.total,
                    data:[
                        {value:335, name:'Expire withing 1 year', itemStyle:{color: color(0)}},
                        {value:310, name:'Expire withing 1 month', itemStyle:{color: color(1)}},
                        {value:234, name:'Expire withing 3 months', itemStyle:{color: color(2)}},
                        {value:135, name:'Expire withing 6 months', itemStyle:{color: color(3)}},
                        {value:1548, name:'Long expirely more than 1 year', itemStyle:{color: color(4)}}
                      ],
                    smooth: true,
                    color: "#0074e1",
                   type: 'pie',
                    label: {
                        show: true,
                        position: 'top'
                    },
                    radius : '80%',
                    center: ['50%', '50%'],
                    itemStyle: {
                        emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                      }

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
