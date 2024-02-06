import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const ApexChart = () => {
    const [chartData, setChartData] = useState({
        series: [{
            name: 'Patients',
            type: 'column',
            data: [16, 20, 12, 14],

        }, {
            name: 'Income',
            type: 'line',
            data: [8, 5, 10, 15],
            
        },

        ],
        options: {
            chart: {
                curve: 'smooth'
            },

            stroke: {
                width: [0, 2]
            },
            title: {
                text: 'Average Performance',
                fontSize: '16px',
                align: 'left',
                style: {
                    color: '#666'
                }
            },
            colors: ['#3A86FF', '#FF5C5C'],
            grid: {
                borderColor: '#f1f1f1',
            },

            dataLabels: {
                enabled: true,
                enabledOnSeries: [1]
            },
            labels: ['Week1', 'Week2', 'Week3', 'Week4'],

            xaxis: {
                type: 'string'
            },
            yaxis: [{
                title: {

                },
            }, {
                opposite: true,
                title: {

                },
                labels: {
                    style: {
                        colors: '#f44336',
                    },
                    formatter: function (value) {
                        return value + "K"
                    }
                },

            }]
        },
    });

    return (
        <div className=''>
            <Chart options={chartData.options} series={chartData.series} type="line" height={280} />
        </div>
    );
};

export default ApexChart;
