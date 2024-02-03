import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class UnservicerbleDrugs extends Component {
  render() {
    // Define your data
    const data = [
      { name: 'Batch withhold', value: 30 },
      { name: 'Batch withdraw', value: 20 },
      { name: 'Product withdraw', value: 25 },
      { name: 'Expired', value: 15 },
    ];

    const option = {
      title: {
        text: 'Unservisable Drugs',
        //subtext: 'Batch and Product Data',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        //orient: 'vertical',
        //left: 'left',
        icon: "circle",
        x: "center",
        y: "bottom",
        data: ['Batch withhold', 'Batch withdraw', 'Product withdraw', 'Expired'],
      },
      series: [
        {
          name: 'Data',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    return (
      <div className="w-full">
        <ReactEcharts option={option} style={{ height: '400px', width: '100%' }} />
      </div>
    );
  }
}

export default UnservicerbleDrugs;
