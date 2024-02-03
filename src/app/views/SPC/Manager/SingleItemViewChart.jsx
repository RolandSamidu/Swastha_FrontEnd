import React, { useEffect, useState } from 'react'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import { yearParse } from 'utils'
import PreProcumentService from 'app/services/PreProcumentService'
import { CircularProgress } from '@material-ui/core'

const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
        type: 'category',
        data: [],
    },
    yAxis: {
        type: 'value',
    },
    series: [
        {
            data: [],
            type: 'bar',
            smooth: true,
        },
    ],
    tooltip: {
        trigger: 'axis',
    },
}

const ViewChart = ({ chartData }) => {
    const isDataAvailable = chartData.xAxis.data.length !== 0 ? true : false

    if (isDataAvailable) {
        return (
            <ReactEChartsCore
                echarts={echarts}
                option={chartData}
                notMerge={true}
                lazyUpdate={true}
                theme={'theme_name'}
            />
        )
    } else {
        return <p>Data is not available</p>
    }
}

const SingleItemViewChart = ({ singleOrderId }) => {
    const [chartData, setChartData] = useState(options)
    const [dataIsLoading, setDataIsLoading] = useState(true)

    useEffect(() => {
        if (singleOrderId) {
            let currentDate = new Date()
            let fiveYearsAgo = new Date(
                currentDate.getFullYear() - 5,
                currentDate.getMonth(),
                currentDate.getDate()
            )

            const params = {
                group_by_order_year: true,
                from_year: yearParse(fiveYearsAgo),
                to_year: yearParse(currentDate),
                item_id: singleOrderId,
            }



            PreProcumentService.getHistoryChart(params)
                .then((result) => {
                    const list = result.data.view
                    console.log("🚀 ~ file: SingleItemViewChart.jsx:75 ~ .then ~ list:", list)

                    const yAxisData = []
                    const xAxisData = []

                    for (let value of list) {
                        yAxisData.push(value.total_value)
                        xAxisData.push(value.order_for_year)
                    }

                    options.xAxis.data = xAxisData
                    options.series = [
                        {
                            data: yAxisData,
                            type: 'bar',
                            smooth: true,
                        },
                    ]

                    setChartData({ ...options })
                })
                .catch((err) => {
                    console.log(
                        '🚀 ~ file: SingleItemViewChart.jsx:56 ~ PreProcumentService.getHistoryChart ~ err:',
                        err
                    )
                })
                .finally(() => {
                    setDataIsLoading(false)
                })
        }
    }, [singleOrderId])

    return (
        <div>
            {!dataIsLoading && <ViewChart chartData={chartData} />}

            {dataIsLoading && (
                <div
                    className="justify-center text-center w-full pt-12"
                    style={{ height: '40vh' }}
                >
                    <CircularProgress size={30} />
                </div>
            )}
        </div>
    )
}

export default SingleItemViewChart
