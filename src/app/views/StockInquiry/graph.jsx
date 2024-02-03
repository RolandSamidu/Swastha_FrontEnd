import React, { Component, Fragment } from "react";
import {
    LoonsTable,
    LoonsCard,
    MainContainer,
} from "app/components/LoonsLabComponents";
import { Grid, CircularProgress } from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import WarehouseServices from "app/services/WarehouseServices";
import moment from "moment";
import ReactApexChart from "react-apexcharts";


class StockInquiryGraph extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            totalItems:null,
            instituteQty:[],
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps?.singleOneOrderItemStatus) {

            let obj = this.state.ordertype.filter((data) => data.value === nextProps.singleOneOrderItemData?.order_type)[0];
            let obj2 = nextProps.agentData.filter((data) => data.id === nextProps.singleOneOrderItemData?.agent_id)[0];
            obj2 = {
                label: obj2?.name,
                value: obj2?.id
            }

            let distributionRemarks = nextProps.singleOneOrderItemData?.MSDOrderRequirementApproves.filter((data) => data.status === "Distribution Officer Checked") || []
            let hscoRemarks = nextProps.singleOneOrderItemData?.MSDOrderRequirementApproves.filter((data) => data.status === "HSCO Checked" || data.status === "HSCO Ammended") || []
            let adRemarks = nextProps.singleOneOrderItemData?.MSDOrderRequirementApproves.filter((data) => data.status === "AD Forecast Approved" || data.status === "AD Forecast Rejected") || []

            distributionRemarks = distributionRemarks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            hscoRemarks = hscoRemarks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            adRemarks = adRemarks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

            let selectedValue = {
                agent: obj2,
                orderType: obj,
                requirementTo: nextProps.singleOneOrderItemData?.requirement_to,
                requirementFrom: nextProps.singleOneOrderItemData?.requirement_from,
                forecastQuntity: nextProps.singleOneOrderItemData?.forecast_quantity,
                estimationNxtYear: nextProps.singleOneOrderItemData?.estimation_next_year || nextProps?.singleOneOrderItemData?.annual_estimation

            }

            console.log("needed status",nextProps.singleOneOrderItemData?.status)
            if ((nextProps.singleOneOrderItemData?.forecast_quantity!=null && nextProps.singleOneOrderItemData?.forecast_quantity > 0 )&& nextProps.singleOneOrderItemData?.status=="Active") {
                this.setState({bypassApprovalProcess:true})
                
            }else{
                this.setState({bypassApprovalProcess:false})
            }

            this.setState({
                singleOrderItem: nextProps.singleOneOrderItemData,
                distributionRemarks: distributionRemarks[0]?.remark || "",
                selectedValue,
                adRemarks: adRemarks[0]?.remark || "",
                hscoRemarks: hscoRemarks[0]?.remark || ""
            })

        }

        if (nextProps?.agentStatus && nextProps.agentData.length) {
            this.setState({
                agentData: nextProps.agentData.map((data) => { return { label: data.name, value: data.id } })
            })
        }
        if (nextProps.forecastStatus === true) {
            this.setState({
                alert: true,
                message: "Success",
                severity: "success"
            });




        }

        if (nextProps?.forecastStatus === false) {
            this.setState({
                alert: true,
                message: "Error",
                severity: "error"
            })


        }
        if (nextProps.strengthStatus) {
            this.setState({
                strengthList: nextProps.strengthList
            })
        }

        if (nextProps.estimationStatus === true) {
            let mappingAnnual = nextProps.estimationData;
            let currentYear = moment().year();
            //    const monthsOrder  =  ["January","February","March","April","May","June","July","August","September","October","November","December"]
            let count = 6;
            let arrayData = [];
            let arrayYear = [];
            if (mappingAnnual.length) {

                while (count != 0) {
                    arrayYear.push(currentYear)
                    const yr = mappingAnnual.find((data) => data.year === currentYear);
                    if (yr) {
                        arrayData.push(parseFloat(yr.estimation))
                    } else {
                        arrayData.push(0)
                    }


                    currentYear = currentYear - 1;
                    count = count - 1
                }
            } else {
                arrayData = [0, 0, 0, 0, 0, 0];
            }
            this.setState({ estimationAnnualMappingData: arrayData.reverse(), estimationAnnualMappingYear: arrayYear.reverse(), estimationloadedStatus: true })
        } else {
            this.setState({ estimationAnnualMapping: [], estimationloadedStatus: true })

        }
        if (nextProps.consumptionsStatus === true) {
            let currentYear = moment().year();
            //    const monthsOrder  =  ["January","February","March","April","May","June","July","August","September","October","November","December"]
            let count = 6;
            let arrayData = [];
            let arrayDataMsd = []


            if (nextProps.consumptionsData.length) {
                while (count != 0) {
                    const yr = nextProps.consumptionsData.find((data) => data.year === currentYear);
                    if (yr) {
                        arrayDataMsd.push(Math.abs(yr.msd_issuance))
                        arrayData.push(Math.abs(yr.consumption))
                    } else {
                        arrayDataMsd.push(0)
                        arrayData.push(0)
                    }

                    currentYear = currentYear - 1;
                    count = count - 1


                }



            } else {
                arrayData = [0, 0, 0, 0, 0, 0];
                arrayDataMsd = [0, 0, 0, 0, 0, 0];
            }
            this.setState({ msdAnnualMappingData: arrayDataMsd.reverse(), nationalConsumptionAnnualMappingData: arrayData.reverse(), consumptionLoaded: true });

        }

        if (nextProps.estimationStatusMonthly === true) {
            const monthsOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let dataValues = [];
            let monthlyEstimation = nextProps.estimationDataMonthly;
            monthlyEstimation = monthlyEstimation.length > 0 ? monthlyEstimation[0] : [];
            let monthlyEstimationKeys = Object.keys(monthlyEstimation);
            monthlyEstimationKeys = monthlyEstimationKeys.filter((data) => data !== "estimation");
            monthlyEstimationKeys = monthlyEstimationKeys.filter((data) => data !== "item_id");
            monthlyEstimationKeys = monthlyEstimationKeys.sort((a, b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b));
            for (const keyyy of monthlyEstimationKeys) {

                if (monthlyEstimation[`${keyyy}`]) {
                    dataValues.push(Math.abs(monthlyEstimation[`${keyyy}`]))
                }

            }
            this.setState({ estimationDataMonthly: dataValues, estimationMonthlyLoadedStatus: true })
        }

        if (nextProps.consumptionsStatusMonthly === true) {
            let count = 12;
            let monthlyEstimation = nextProps.consumptionsDataMonthly;
            monthlyEstimation = monthlyEstimation.length > 0 ? monthlyEstimation : [];
            monthlyEstimation = monthlyEstimation.sort((a, b) => a.month - b.month);
            let arrayDataMsd = [];
            let arrayData = [];
            while (count != 0) {
                const yr = nextProps.consumptionsDataMonthly.find((data) => data.month == count + 1);

                console.log(yr, "ddd>>>>", count)
                if (yr) {
                    arrayDataMsd.push(Math.abs(yr.msd_issuance))
                    arrayData.push(Math.abs(yr.consumption))
                } else {
                    arrayDataMsd.push(0)
                    arrayData.push(0)
                }
                count = count - 1


            }

            this.setState({ estimationMonthlyMaping: arrayData.reverse(), msdMonthlyMapping: arrayDataMsd.reverse(), consumptionMonthlyLoaded: true });
        }
        if (nextProps.historyStatus) {
            console.log(nextProps.historyData, "llll")
            this.setState({
                historyData: nextProps?.historyData?.data
            })
        }
    }




    componentDidMount() {
    //    this.getMsdStock()
    }

    render() {

        const series = [{
            name: 'Annual estimated',
            data: this.state.estimationAnnualMappingData
        },
        {
            name: 'MSD issued Qty',
            data: this.state.msdAnnualMappingData
        },
        {
            name: 'National Consumption',
            data: this.state.nationalConsumptionAnnualMappingData
        }
        ];


        const optionEchart = {
            title: {
                text: 'Monthly Forecast'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['Month']
            },
            xAxis: {
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', "Dec"]
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
            yAxis: {
                title: {
                    text: 'Qty'
                }
            },
            series: [{
                name: "Estimation",
                type: 'line',
                data: this.state.estimationDataMonthly,
            },
            {
                name: 'Consumption',
                type: 'line',
                data: this.state.estimationMonthlyMaping,
            }, {
                name: 'MSD issuance',
                type: 'line',
                data: this.state.msdMonthlyMapping,
            }],


        }
        const options = {
            chart: {
                type: 'bar',
                height: 350
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: this.state.estimationAnnualMappingYear,
            },
            yaxis: {
                title: {
                    text: 'Qty'
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val
                    }
                }
            }
        };
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                       {/* <fieldset style={{ borderWidth: 3, borderRadius: 5, borderColor: '#0000FF', borderStyle: 'solid', width:'100%', backgroundColor:'#D4F1F4', margin: 2, height:'350px', overflow:'auto'}}> */}
                            <legend style={{ alignSelf: 'center', fontWeight:'bold' }}>MSD Stock</legend>
                            <Grid container>
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    <ReactApexChart options={options} series={series} type="bar" height={350} />
                                </Grid>
                            </Grid>                         
                        {/* </fieldset> */}
                        {/* // </ValidatorForm> */}
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        );
    }
}

export default StockInquiryGraph
