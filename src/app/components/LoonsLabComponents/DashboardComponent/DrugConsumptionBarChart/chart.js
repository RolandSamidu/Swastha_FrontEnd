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
        option = {
            title: {
                // text: 'Consumptions'
              },
              tooltip : {
                trigger: 'axis'
              },
              legend: {
                // data:['Month']
              },
              xAxis: {
                data: legendData,
                // data: ['Jan', 'Feb', 'Mar'],
                name: 'Months',
                nameLocation: 'center',
                nameGap: 20
              },
              toolbox: {
                // feature: {
                //   saveAsImage: {}
                // }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              yAxis: { name: 'Consumptions', nameLocation: 'center', nameGap: 50},
              series: {
                // name: 'Consumptions',
                type: 'bar',
                data: data,
                barWidth: '8%',
                // data: [12,15, 8],
                barCategoryGap: '10%',
                barGap: '30%'
              }
            
        
        }

    
    


    return option;

}


const Chart = ({ height, type, data, className, legendData }) => {
    let option = loadData(type, data, legendData)
    return (
        <ReactEcharts
            className={className}
            style={{ height: height }}
            option={merge({}, defaultOptionsFunction, option)}
        />
    )
}

export default Chart
