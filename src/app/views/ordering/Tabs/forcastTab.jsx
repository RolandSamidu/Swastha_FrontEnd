import { Box, CircularProgress, Divider, Grid, Icon, IconButton, Input, InputAdornment, Select, TextField, Tooltip, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { LoonsCard, LoonsTable, MainContainer, SubTitle, Button, LoonsSnackbar } from "app/components/LoonsLabComponents";
import React from "react";
import { Component } from "react";
import SearchIcon from '@material-ui/icons/Search';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import moment from "moment";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import {
    DatePicker,
} from 'app/components/LoonsLabComponents';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import Changewarehouse from "../changeWareHouseComponent";
import localStorageService from "app/services/localStorageService";
import ReactApexChart from "react-apexcharts";
//import { CheckBox } from "@mui/icons-material";
// import { returnStatusOptions } from "../../../../../src/appconst";
import { createForeCast, getSingleOrderRequirementItem, revertErrorStatus, getAllAgents, getEstimations, getConsumptionData, approvalProcess, getHistory } from "../redux/action";
import { useParams } from "react-router-dom";
import LoonsButton from "app/components/LoonsLabComponents/Button";
import ReactEcharts from 'echarts-for-react'


class ReturnMode extends Component {

    constructor(props) {
        super(props)
        this.state = {
            historyData: [],
            alert: false,
            bypassApprovalProcess: false,
            distributionRoles: ['Distribution Officer', 'MSD Distribution Officer'],
            sendApprovalEligible: ['HSCO Ammended', 'AD Forecast Rejected', 'Active'],
            heirachialOrderStatus: [
                {
                    status: 'Active',
                    roles: ['MSD SCO', 'MSD SCO Supply', 'MSD SCO QA']
                }, {
                    status: 'Distribution Forecast Pending',
                    roles: ['MSD SCO', 'MSD SCO Supply', 'MSD SCO QA']
                }, {
                    status: 'Distribution Officer Checked',
                    roles: ['HSCO']
                }, {
                    status: 'HSCO Checked',
                    roles: ['MSD AD']

                }, {
                    status: 'HSCO Ammended',
                    roles: []
                }, {
                    status: 'AD Forecast Approved',
                    roles: []
                }, {
                    status: 'AD Forecast Rejected',
                    roles: []
                }],
            estimationloadedStatus: false,
            estimationMonthlyLoadedStatus: false,
            consumptionLoaded: false,
            consumptionMonthlyLoaded: false,
            adRemarks: "",
            distributionRemarks: "",
            hscoRemarks: "",
            checkedId: [],
            agentData: [],
            strengthList: [],
            message: "",
            singleOrderItem: null,
            data: [],
            loading: true,
            owner_id: "",
            loadingMonthly: true,
            status: "",
            drugStore: "",
            toDate: null,
            estimationAnnualMappingYear: [],
            estimationAnnualMappingData: [],
            msdAnnualMappingData: [],
            nationalConsumptionAnnualMappingData: [],
            estimationMonthlyMaping: [],
            msdMonthlyMapping: [],
            fromDate: null,
            drugStoreOptions: [],
            totalItems: 0,
            page: 0,
            limit: 20,
            selectedValue: {
                agent: "",
                orderType: "",
                requirementTo: "",
                requirementFrom: "",
                forecastQuntity: "",
                estimationNxtYear: ""
            },
            ordertype: [{
                label: "Normal Order", value: "Normal Order"
            }, {
                label: "Additional Order", value: "Additional Order"
            }, {
                label: "Emergency Order", value: "Emergency Order"
            }, {
                label: "Special Order", value: "Special Order"
            }, {
                label: "Indian Credit Line", value: "Indian Credit Line"
            }]






        }
    }

    handelApproval = (e, status) => {

        const payload = {
            "approved_by": localStorageService.getItem("userInfo").id,
            "remark": this.state.remark,
            "status": status,
            "role": localStorageService.getItem("userInfo").roles[0],
            "type": status
        }

        this.props.approvalProcess(payload, this.props.history.location.pathname.split("/")[3])
    }
    componentDidMount() {
        this.props.revertErrorStatus();
        let currentYear = moment().year();
        const requiredDate = moment([currentYear - 5]).format("YYYY-MM-DD");
        let params = {
            item_id: this.props.history.location.pathname.split("/")[4],
            estimation_from: requiredDate,
            estimation_to: moment().endOf("year").format("YYYY-MM-DD"),
            estimation_type: "Annual",
            search_type: "EstimationGroup"
        };

        this.props.getEstimations(params, "annual");
        params = {
            ...params,
            estimation_from: moment().startOf("year").format("YYYY-MM-DD"),
            estimation_to: moment().endOf("year").format("YYYY-MM-DD"),
            estimation_type: "Annual",
            search_type: "EstimationMonthly"

        }
        this.props.getEstimations(params, "monthly");
        this.props.getConsumptionData({
            item_id: this.props.history.location.pathname.split("/")[4],
            from: requiredDate,
            to: moment().endOf("year").format("YYYY-MM-DD"),
            type: "Yearly",
            search_type: "Consumption"
        }, "annual");


        this.props.getConsumptionData({
            item_id: this.props.history.location.pathname.split("/")[4],
            from: moment().startOf("year").format("YYYY-MM-DD"),
            to: moment().endOf("year").format("YYYY-MM-DD"),
            type: "Monthly",
            search_type: "Consumption"
        }, "monthly");
        let id = []
        id.push(this.props.history.location.pathname.split("/")[4]);
        this.setState({ checkedId: id });
        this.props.getHistory({
            msd_requirement_item_id: this.props.history.location.pathname.split("/")[3], type: "Forecast"
        })

    }

    // componentWillUnmount() {
    //     // use intervalId from the state to clear the interval
    //     clearInterval(this.state.intervalId);
    //  }      

    timer = () => {
        // setState method is used to update the state
        this.setState({ currentCount: this.state.currentCount - 1 });
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
            console.log('estimationDataMonthly',nextProps.estimationDataMonthly)
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
            let currentYear = moment().year();
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
                    if(currentYear==2023 && count+1==1){
                        arrayDataMsd.push(0)
                        arrayData.push(0)
                    }else{
                        arrayDataMsd.push(Math.abs(yr.msd_issuance))
                        arrayData.push(Math.abs(yr.consumption))
                    }
                    
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
    handlechange = (data, name) => {

        if (name === "order") {
            let obj = this.state.selectedValue;
            obj.orderType = data;
            this.setState(obj)
        } else if (name === "agent") {
            let obj = this.state.selectedValue;
            obj.agent = data;
            this.setState(obj)
        }



    }

    handleNext = () => {
        const id = this.props.history.location.pathname.split("/")[3];
        let payload = {
            "order_type": this.state.selectedValue.orderType.value,
            "requirement_from": null,
            "requirement_to": null,
            "forecast_quantity": parseInt(this.state.selectedValue.forecastQuntity),
            "estimation_next_year": parseInt(this.state.selectedValue.estimationNxtYear),
            "agent": this.state.selectedValue.agent.label,
            "agent_id": this.state.selectedValue.agent.value
        }

        this.props.createForeCast(payload, id);

    }

    handleUpdate = (save_or_update, payload2) => {

        const id = this.props.history.location.pathname.split("/")[3];
        let payload = {
            "order_type": this.state.selectedValue.orderType.value,
            "requirement_from": null,
            "requirement_to": null,
            "forecast_quantity": parseInt(this.state.selectedValue.forecastQuntity),
            "estimation_next_year": parseInt(this.state.selectedValue.estimationNxtYear),
            "agent": this.state.selectedValue.agent.label,
            "agent_id": this.state.selectedValue.agent.value,
        }

        this.props.createForeCast(payload, id, save_or_update, payload2);
    }



    approveOrReject = (e, approveOrReject, type) => {


        let status = null;
        let remarks = "";
        if (approveOrReject == "pending" && type == "SCO") {
            status = "Distribution Forecast Pending";
        }

        if (approveOrReject === "approve" && type === "distribution") {
            status = "Distribution Officer Checked";
            remarks = this.state.distributionRemarks;
        } else if (approveOrReject === "reject" && type === "ad") {
            status = "AD Forecast Rejected";
            remarks = this.state.adRemarks;

        } else if (approveOrReject === "approve" && type === "ad") {
            status = "AD Forecast Approved";
            remarks = this.state.adRemarks;

        } else if (approveOrReject === "reject" && type === "HSCO") {
            status = "HSCO Ammended";
            remarks = this.state.hscoRemarks;

        } else if (approveOrReject === "approve" && type === "HSCO") {
            status = "HSCO Checked";
            remarks = this.state.hscoRemarks;

        }else if (approveOrReject === "approve" && type === "Started") {
            status = "Started";
            remarks = null;

        }
        const payload = {
            "approved_by": localStorageService.getItem("userInfo").id,
            "remark": remarks,
            "status": status,
            "role": localStorageService.getItem("userInfo").roles[0],
            "type": status,
            "order_type": this.state.selectedValue.orderType.value,
            "requirement_from": null,
            "requirement_to": null,
            "forecast_quantity": parseInt(this.state.selectedValue.forecastQuntity),
            "estimation_next_year": parseInt(this.state.selectedValue.estimationNxtYear),
            "agent": this.state.selectedValue.agent.label,
            "agent_id": this.state.selectedValue.agent.value,
            "change_by": localStorageService.getItem("userInfo").id
        }

        this.props.approvalProcess(payload, this.props.history.location.pathname.split("/")[3])

    }



    handlePaginations = (page, limit) => {

    }

    handleCheckbox = (e) => {
        let data = [];
        data.push(e.target.value);
        this.setState({ checkedId: data });

        let params = {
            item_id: e.target.value,
            estimation_from: null,
            estimation_to: null,
            estimation_type: "Annual",
            search_type: "EstimationMonthly"

        }
        this.props.getEstimations(params, "monthly");
        this.props.getConsumptionData({
            item_id: e.target.value,
            from: moment().startOf("year").format("YYYY-MM-DD"),
            to: moment().endOf("year").format("YYYY-MM-DD"),
            type: "Monthly",
            search_type: "Consumption"
        }, "monthly");

    }

    handleRemarks = (e, type) => {


        this.setState({
            [type]: e.target.value
        })
    }






    render() {
        // const children = (
        //     <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
        //         <FormControlLabel
        //             label="Lotantham 1.26mg"
        //             control={<Checkbox />}
        //         />
        //         <FormControlLabel
        //             label="Lotantham 1.26mg"
        //             control={<Checkbox />}
        //         />
        //     </Box>
        // );

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


        // const series2 =  [{
        //     name: "Consumption",
        //     data: this.state.estimationDataMonthly,
        // }, {
        //     name: "Estimation",
        //     data: this.state.estimationMonthlyMaping
        // }, {
        //     name: "MSD Estimation",
        //     data: this.state.msdMonthlyMapping
        // }];
        // const options2 =  {
        //     chart: {
        //         height: 350,
        //         type: 'line',
        //         zoom: {
        //             enabled: false
        //         }
        //     },
        //     dataLabels: {
        //         enabled: false
        //     },
        //     stroke: {
        //         curve: 'straight'
        //     },
        //     title: {
        //         text: 'Forecasted Monthly Requirement',
        //         align: 'left'
        //     },
        //     grid: {
        //         row: {
        //             colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        //             opacity: 0.5
        //         },
        //     },
        //     xaxis: {
        //         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        //     }
        // };

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

        const children3 = (
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                <FormControlLabel
                    label="terimasten1.24 mg"
                    control={<Checkbox />}
                />
                <FormControlLabel
                    label="terimasten1.28 mg"
                    control={<Checkbox />}
                />
            </Box>
        );

        const children4 = (
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                <FormControlLabel
                    label="olimersatan1.24 mg"
                    control={<Checkbox />}
                />
                <FormControlLabel
                    label="olimersatan1.28 mg"
                    control={<Checkbox />}
                />
            </Box>
        );
        // const children2 = (
        //     <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>

        //         {this.state.strengthList.length && this.state.strengthList.map((data) =>
        //             <FormControlLabel
        //                 label={`${data?.short_description}` `${data?.strength}`}
        //                 control={<Checkbox />}
        //             />
        //         )}
        //         {/* <FormControlLabel
        //             label="olimersatan"
        //             control={<Checkbox />}
        //         />
        //         {children4} */}
        //         {/* <FormControlLabel
        //             label="terimasten"
        //             control={<Checkbox />}
        //         />
        //         {children3} */}
        //     </Box>
        // );

        return (
            <MainContainer>
                <LoonsCard>
                    <Typography variant="h7" className="font-semibold">Forecast Yearly Requirement</Typography>


                    <Grid container="container" className="mt-3 pb-5">
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <ReactApexChart options={options} series={series} type="bar" height={350} />
                        </Grid>
                        <Grid item="item" lg={12} md={12} sm={6} xs={6}>
                            <ValidatorForm
                                className=""
                                onSubmit={() => this.SubmitAll()}
                                onError={() => null}>
                                {/* <SubTitle title={"Estimation from 2022-02-3 to 2025-08-23"}></SubTitle> */}
                                {/* <table>
                                    <tr>
                                        <td>
                                            Accumulated Quantity from Institute
                                        </td>
                                        <td>
                                            <TextValidator
                                                className='w-full mt-5 pl-2'

                                                variant="outlined"
                                                size="small"


                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                        </InputAdornment>
                                                    )
                                                }} />

                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Yearly Eatimation for 2023
                                        </td>
                                        <td>
                                            <TextValidator
                                                className='w-full mt-5 pl-2'

                                                variant="outlined"
                                                size="small"


                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                        </InputAdornment>
                                                    )
                                                }} />

                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Forecast Qauntity
                                        </td>
                                        <td>
                                            <TextValidator
                                                className='w-full mt-5 pl-2'

                                                variant="outlined"
                                                size="small"


                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                        </InputAdornment>
                                                    )
                                                }} />

                                        </td>
                                    </tr>
                                </table> */}
                            </ValidatorForm>
                            <br />
                            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <th style={{ textAlign: 'left' }}>

                                        </th>

                                        {this.state.estimationAnnualMappingYear.map((data) => <th style={{ textAlign: 'left' }}>
                                            {data}
                                        </th>)}


                                    </tr>
                                    <tbody>
                                        <tr>
                                            <td>
                                                Annual Estimated quantity

                                            </td>
                                            {this.state.estimationAnnualMappingData.map((data) => <td>
                                                {data}
                                            </td>)}


                                        </tr>
                                        <tr>
                                            <td>
                                                MSD issued quantity

                                            </td>
                                            {this.state.msdAnnualMappingData.map((data) => <td>
                                                {data}
                                            </td>)}

                                        </tr>
                                        <tr>
                                            <td>
                                                National Consumption

                                            </td>
                                            {this.state.nationalConsumptionAnnualMappingData.map((data) => <td>
                                                {data}
                                            </td>)}

                                        </tr>
                                    </tbody>

                                </table>

                            </Grid>
                        </Grid>
                        <Grid container="container" spacing={2} style={{ height: '30px' }}>

                        </Grid>
                        <Grid container="container" spacing={2} direction="row">
                            <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                <Grid container="container" spacing={2}>


                                    {console.log(this.props?.estimationStatusMonthly && this.props?.consumptionsStatusMonthly, "    ")}
                                    {!(this.props?.estimationStatusMonthly && this.props?.consumptionsStatusMonthly) ? <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} /> </Grid> : <Grid className="justify-center text-center w-full pt-12"><Grid item="item" xs={12} sm={12} md={8} lg={8}>
                                            {this.state.consumptionMonthlyLoaded && this.state.estimationMonthlyLoadedStatus &&
                                                // <ReactApexChart options={options2} series={series2} type="line" height={350} />}


                                                <ReactEcharts
                                                    className="mt--10"
                                                    style={{ height: 350 }}
                                                    option={optionEchart}
                                                />}
                                        </Grid> </Grid>}

                                    <Grid item="item" xs={12} sm={12} md={4} lg={4}>
                                        {/* <table>
                                            <tr>
                                                <td><FormGroup>
                                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Consumption" />
                                                </FormGroup></td>
                                                <td>
                                                    <DatePicker
                                                        className="w-full"
                                                        value={
                                                            this.state.fromDate
                                                        }
                                                        placeholder="Date Range (From)"
                                                        maxDate={new Date()}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                this.setState({ fromDate: date })
                                                            } else {

                                                                this.setState({ fromDate: null })
                                                            }
                                                        }} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><FormGroup>
                                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Estimation" />
                                                </FormGroup></td>
                                                <td>
                                                    <DatePicker
                                                        className="w-full"
                                                        value={
                                                            this.state.fromDate
                                                        }
                                                        placeholder="Date Range (From)"
                                                        maxDate={new Date()}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                this.setState({ fromDate: date })
                                                            } else {

                                                                this.setState({ fromDate: null })
                                                            }
                                                        }} />
                                                </td>
                                            </tr>
                                        </table> */}
                                        <Divider />
                                        <FormControlLabel
                                            label="Strengths"
                                            control={
                                                <Checkbox disabled={true} style={{ visibility: "hidden" }}

                                                />
                                            }
                                        />
                                        {/* {children} */}

                                        {/* <FormControlLabel
                                            label="Alternative Drugs"
                                            control={
                                                <Checkbox

                                                />
                                            }
                                        /> */}
                                        {/* {children2} */}

                                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                                            {console.log(this.state.strengthList, "slkjlkjlk")}


                                            {this.state.strengthList.length && this.state.strengthList.map((data) =>


                                                <FormControlLabel
                                                    value={data.id}

                                                    label={`${data?.medium_description}(${data?.sr_no})`}
                                                    control={<Checkbox onChange={this.handleCheckbox} checked={this.state.checkedId.includes(data.id)} />}
                                                />

                                            )}
                                        </Box>


                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>


                    <ValidatorForm
                        className=""
                        onSubmit={() => this.SubmitAll()}
                        onError={() => null}>

                        <Grid container className='mt-5'>
                            <Grid item lg={3} md={3} sm={12} xs={12} className="px-2">
                                <SubTitle title={"Agent"}></SubTitle>
                                <Autocomplete
                                    disableClearable
                                    className="w-full"
                                    options={this.state.agentData}
                                    disabled={!(this.state.heirachialOrderStatus.filter((data) => data.status === this.state.singleOrderItem?.status)?.[0]?.roles.includes(localStorageService.getItem("userInfo").roles[0]))}


                                    getOptionLabel={(option) =>
                                        option.label ?
                                            (option.label)
                                            : ('')
                                    }

                                    onChange={(event, value) => this.handlechange(value, "agent")}
                                    value={this.state.selectedValue.agent}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Agent"

                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            size="small"

                                        />
                                    )}
                                />
                            </Grid>

                        </Grid>

                        <Grid container className='mt-5'>
                            <Grid item lg={3} md={3} sm={12} xs={12} className="px-2">
                                <SubTitle title={"Order Type"}></SubTitle>
                                <Autocomplete
                                    disableClearable
                                    className="w-full"
                                    options={this.state.ordertype}
                                    disabled={!(this.state.heirachialOrderStatus.filter((data) => data.status === this.state.singleOrderItem?.status)?.[0]?.roles.includes(localStorageService.getItem("userInfo").roles[0]))}

                                    getOptionLabel={(option) =>
                                        option.label ?
                                            (option.label)
                                            : ('')
                                    }

                                    onChange={(event, value) => this.handlechange(value, "order")}
                                    value={this.state.selectedValue.orderType}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Order Type"
                                            //variant="outlined"
                                            //value={}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            size="small"

                                        />
                                    )}
                                />
                            </Grid>

                        </Grid>
                        <Grid container className='mt-5'>
                            <Grid item lg={3} md={3} sm={12} xs={12} className="px-2">
                                <SubTitle title={"Annual Forecast Quantity"}></SubTitle>

                                <TextValidator
                                    // {...params}
                                    onChange={(e) => {
                                        let obj = this.state.selectedValue;
                                        obj.forecastQuntity = e.target.value;
                                        this.setState({ selectedValue: obj })

                                    }}

                                    disabled={!(this.state.heirachialOrderStatus.filter((data) => data.status === this.state.singleOrderItem?.status)?.[0]?.roles.includes(localStorageService.getItem("userInfo").roles[0]))}

                                    placeholder="Forecast Quantity"
                                    //variant="outlined"
                                    value={this.state.selectedValue.forecastQuntity || ""}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    size="small"

                                />

                            </Grid>
                        </Grid>

                        <Grid container className='mt-5'>
                            <Grid item lg={3} md={3} sm={12} xs={12} className="px-2">
                                <SubTitle title={`Yearly Estimation for ${new Date().getFullYear()}`}></SubTitle>
                                <TextValidator
                                    placeholder={`Yearly Estimation for ${new Date().getFullYear()}`}
                                    onChange={(e) => {
                                        let obj = this.state.selectedValue;
                                        obj.estimationNxtYear = e.target.value;
                                        this.setState({ selectedValue: obj });

                                    }}
                                    value={this.state.selectedValue.estimationNxtYear || ""}
                                    disabled

                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    size="small"

                                />
                                {/* )}
                                /> */}
                            </Grid>

                        </Grid>


                        <Grid container className='mt-5'>


                            {/* <Grid item lg={3} md={3} sm={12} xs={12} className="px-2">
                                <SubTitle title={"Requirement from"}></SubTitle>
                                <DatePicker
                                    className="w-full"
                                    value={
                                        this.state.selectedValue.requirementFrom
                                    }
                                    placeholder="Date Range (From)"
                                    onChange={(date) => {
                                        let obj = this.state.selectedValue;
                                        if (date) {

                                            obj.requirementFrom = date
                                            this.setState({ fromDate: date, selectedValue: obj })
                                        } else {
                                            obj.requirementFrom = null

                                            this.setState({ fromDate: null, selectedValue: obj })
                                        }
                                    }} />
                            </Grid> */}
                            {/* <Grid item lg={3} md={3} sm={12} xs={12} className="px-2">
                                <SubTitle title={"Requirement to"}></SubTitle>
                                <DatePicker
                                    className="w-full"
                                    value={
                                        this.state.selectedValue.requirementTo
                                    }
                                    placeholder="Date Range (to)"
                                    onChange={(date) => {
                                        let obj = this.state.selectedValue;
                                        if (date) {

                                            obj.requirementTo = date
                                            this.setState({ toDate: date, selectedValue: obj })
                                        } else {
                                            obj.requirementTo = null

                                            this.setState({ toDate: null, selectedValue: obj })
                                        }
                                    }} />
                            </Grid> */}




                            <br /><br />

                            {this.state.bypassApprovalProcess?
                            <Grid>
                                <LoonsButton disabled={!(Boolean(this.state.selectedValue.orderType && this.state.selectedValue.forecastQuntity))}  color="primary" onClick={(e) => this.approveOrReject(e, "approve", "Started")}>Save</LoonsButton>  
                            </Grid>
                            :
                            <Grid item="item" lg={6} md={6} xs={6}>

                                <Grid item lg={12} md={12} sm={12} xs={12} className="px-2">
                                    {(localStorageService.getItem("userInfo").roles.includes("MSD SCO")|| localStorageService.getItem("userInfo").roles.includes("MSD SCO Supply")  )&& <>
                                        {this.state.sendApprovalEligible.includes(this.state.singleOrderItem?.status) &&
                                            <Button
                                                className="text-right mt-6"
                                                progress={false}
                                                scrollToTop={false}
                                                disabled={!(Boolean(this.state.selectedValue.orderType && this.state.selectedValue.forecastQuntity))}
                                                onClick={(e) => this.approveOrReject(e, "pending", "SCO")}
                                            >
                                                <span className="capitalize"> Send For Approval</span>
                                            </Button>}</>}

                                    <Grid container="container" spacing={2} direction="row">
                                        <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                            <Grid container="container" spacing={2}>

                                                {/* <Grid item="item" xs={12} sm={8} md={12} lg={12}> */}

                                                {/* </Grid> */}
                                                {/* <Grid item="item" lg={6} md={6} xs={6}>
                                </Grid> */}

                                                {console.log(!this.state.distributionRoles.includes(localStorageService.getItem("userInfo").roles[0]), this.state.singleOrderItem, !(Boolean(this.state.selectedValue.orderType && this.state.selectedValue.forecastQuntity)), "hhhhh")}
                                                <Grid item="item" lg={6} md={6} xs={6}>
                                                    <Grid item="item" lg={6} md={6} xs={6}> Distribution Officer Remarks</Grid>
                                                    <Grid item="item" lg={10} md={12} xs={12}>
                                                        <textarea
                                                            value={this.state.distributionRemarks}
                                                            disabled={!this.state.distributionRoles.includes(localStorageService.getItem("userInfo").roles[0]) || this.state.singleOrderItem?.status !== "Distribution Forecast Pending" || !(Boolean(this.state.selectedValue.orderType && this.state.selectedValue.forecastQuntity))}


                                                            onChange={(e) => this.handleRemarks(e, "distributionRemarks")}
                                                            style={{
                                                                width: '100%'
                                                            }}
                                                            cols="2"
                                                            rows="5"></textarea>
                                                    </Grid>
                                                    <LoonsButton color="primary" onClick={(e) => this.approveOrReject(e, "approve", "distribution")} disabled={!this.state.distributionRoles.includes(localStorageService.getItem("userInfo").roles[0]) || this.state.singleOrderItem?.status !== "Distribution Forecast Pending" || !(Boolean(this.state.selectedValue.orderType && this.state.selectedValue.forecastQuntity))}
                                                    >Checked</LoonsButton>                                    </Grid>

                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container="container" spacing={2} direction="row">
                                        <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                            <Grid container="container" spacing={2}>

                                                {/* <Grid item="item" xs={12} sm={8} md={12} lg={12}> */}
                                                {/* {this.state.data.length > 0 ? <LoonsButton style={{ marginLeft: "90%" }} color="primary" onClick={() => this.props.putOrder(this.props.history.location.pathname.split("/")[3])}>Finish</LoonsButton>
                                    : <></>} */}
                                                {/* </Grid> */}
                                                {/* <Grid item="item" lg={6} md={6} xs={6}>
                                </Grid> */}
                                                <Grid item="item" lg={6} md={6} xs={6}>
                                                    <Grid item="item" lg={6} md={6} xs={6}> HSCO Remarks</Grid>
                                                    <Grid item="item" lg={10} md={12} xs={12}>
                                                        <textarea
                                                            //  disabled={ !acountantTypes.includes(localStorageService.getItem("userInfo").roles[0]) || this.state.singleOrderItem?.status !== "HSCO Approved"} 
                                                            // onChange={(e)=>{
                                                            //     this.state.allocate.other_remarks = e.target.value
                                                            // }}
                                                            disabled={localStorageService.getItem("userInfo").roles[0] !== 'HSCO' || this.state.singleOrderItem?.status !== "Distribution Officer Checked" || !(Boolean(this.state.selectedValue.orderType && this.state.selectedValue.forecastQuntity))} ß
                                                            value={this.state.hscoRemarks}

                                                            onChange={(e) => this.handleRemarks(e, "hscoRemarks")}

                                                            style={{
                                                                width: '100%'
                                                            }}
                                                            cols="2"
                                                            rows="5"></textarea>
                                                    </Grid>
                                                    <LoonsButton color="danger" onClick={(e) => this.approveOrReject(e, "reject", "HSCO")}
                                                        disabled={localStorageService.getItem("userInfo").roles[0] !== 'HSCO' || this.state.singleOrderItem?.status !== "Distribution Officer Checked" || !(Boolean(this.state.selectedValue.orderType && this.state.selectedValue.forecastQuntity))}
                                                    >Ammend</LoonsButton>      <LoonsButton color="primary" onClick={(e) => this.approveOrReject(e, "approve", "HSCO")}
                                                        disabled={localStorageService.getItem("userInfo").roles[0] !== 'HSCO' || this.state.singleOrderItem?.status !== "Distribution Officer Checked" || !(Boolean(this.state.selectedValue.orderType && this.state.selectedValue.forecastQuntity))}
                                                    >Checked</LoonsButton>                                    </Grid>

                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid container="container" spacing={2} direction="row">
                                        <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                            <Grid container="container" spacing={2}>

                                                {/* <Grid item="item" xs={12} sm={8} md={12} lg={12}> */}
                                                {/* {this.state.data.length > 0 ? <LoonsButton style={{ marginLeft: "90%" }} color="primary" onClick={() => this.props.putOrder(this.props.history.location.pathname.split("/")[3])}>Finish</LoonsButton>
                                    : <></>} */}
                                                {/* </Grid> */}
                                                {/* <Grid item="item" lg={6} md={6} xs={6}>
                                </Grid> */}
                                                <Grid item="item" lg={6} md={6} xs={6}>
                                                    <Grid item="item" lg={6} md={6} xs={6}> AD Remarks</Grid>
                                                    <Grid item="item" lg={10} md={12} xs={12}>
                                                        <textarea
                                                            value={this.state.adRemarks}

                                                            disabled={this.state.singleOrderItem?.status !== "HSCO Checked" || localStorageService.getItem("userInfo").roles[0] !== "MSD AD"}

                                                            // onChange={(e)=>{
                                                            //     this.state.allocate.other_remarks = e.target.value
                                                            // }}
                                                            onChange={(e) => this.handleRemarks(e, "adRemarks")}

                                                            style={{
                                                                width: '100%'
                                                            }}
                                                            cols="2"
                                                            rows="5"></textarea>
                                                    </Grid>
                                                    <LoonsButton color="danger" disabled={this.state.singleOrderItem?.status !== "HSCO Checked" || localStorageService.getItem("userInfo").roles[0] !== "MSD AD" || !(Boolean(this.state.selectedValue.orderType && this.state.selectedValue.forecastQuntity))} onClick={(e) => this.approveOrReject(e, "reject", "ad")} > Reject</LoonsButton>      <LoonsButton disabled={this.state.singleOrderItem?.status !== "HSCO Checked" || localStorageService.getItem("userInfo").roles[0] !== "MSD AD" || !(Boolean(this.state.selectedValue.orderType && this.state.selectedValue.forecastQuntity))} color="primary" onClick={(e) => this.approveOrReject(e, "approve", "ad")}>Approved</LoonsButton>                                    </Grid>

                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid>



                                    </Grid>





                                    {/* {!localStorageService.getItem("userInfo").roles.includes("MSD AD") && this.state.singleOrderItem?.status !== "Forecast Approved"&&this.state.singleOrderItem?.status !== "Distribution Forecast Pending"&& <>
                                <Button
                                    className="text-right mt-6"
                                    progress={false}
                                    scrollToTop={false}
                                    onClick={(e) => { this.handelApproval(e,"Distribution Forecast Pending") }}
                                >
                                    &ensp;<span className="capitalize">Send Approval</span>
                                </Button></>} */}







                                    {/* &ensp;<Button
                                    className="text-right mt-6"
                                    progress={false}
                                    scrollToTop={false}
                                    // type='submit'
                                    onClick={() => {
                                        this.setState({
                                            status: "", drugStore: "", fromDate: null, toDate: null, loading: true
                                        }, () => this.props.getAllReturnRequests({ page: this.state.page, limit: this.state.limit, owner_id: this.state.owner_id, status: "ADMIN_ACCEPT" }))
                                    }}
                                >
                                    <span className="capitalize">Reset</span>
                                </Button> */}
                                </Grid>
                                {/* <Grid item="item" lg={12} md={12} xs={12}> */}
                                {/* {localStorageService.getItem("userInfo").roles.includes("MSD AD") && (this.state.singleOrderItem?.status !== "Forecast Approved"|| this.state.singleOrderItem?.status !== "Forecast Rejected" )&& this.state.singleOrderItem?.status === "Distribution Forecast Pending"&&<>
                                        <LoonsButton color="danger" onClick={(e)=>this.handelApproval(e,"Forecast Rejected")}                                              disabled={ localStorageService.getItem("userInfo").roles[0] !== "MSD AD"} 
>Ammend</LoonsButton>      <LoonsButton color="primary"  onClick={(e)=>this.handelApproval(e,"Forecast Approved")}                                              disabled={ localStorageService.getItem("userInfo").roles[0] !== "MSD AD"} 
>Checked</LoonsButton>   </>}                                 </Grid>
{localStorageService.getItem("userInfo").roles.includes("MSD AD") && (this.state.singleOrderItem?.status === "Forecast Approved" || this.state.singleOrderItem?.status === "AD Forecast Approved " || this.state.singleOrderItem?.status === "AD Checked" || this.state.singleOrderItem?.status === "Accountant Approved"  ||  this.state.singleOrderItem?.status === "Pending Approval")&&<>
                                <Button
                                    className="text-right mt-6"
                                    progress={false}
                                    scrollToTop={false}
                                    disabled={ !(Boolean(this.state.selectedValue.orderType && this.state.selectedValue.forecastQuntity ))}
                                    onClick={() => { this.handleNext() }}
                                >
                                    <span className="capitalize">Next</span>
                                </Button></>} */}
                            </Grid>
    }


                            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                <table style={{ width: '100%' }}>

                                    <thead>
                                        <tr>
                                            <th>Name</th>


                                            <th> Role</th>


                                            <th>Forecast Quantity</th>

                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.historyData.map((dat) => {

                                                return (
                                                    <tr>
                                                        <td>
                                                            {dat?.Employee?.name || ""}
                                                        </td>
                                                        <td>
                                                            {dat?.Employee?.type || ""}
                                                        </td>
                                                        <td>
                                                            {dat?.data?.forecast_quantity || ""}
                                                        </td>
                                                        <td>
                                                            {dat?.createdAt ? moment(dat.createdAt).format("YYYY-MM-DD") : ""}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }

                                    </tbody>
                                </table>

                            </Grid>




                        </Grid>
                        <Grid container className='mt-5'>
                            <Grid item lg={12} md={12} sm={12} xs={12} className="px-2">
                            </Grid>

                        </Grid>


                    </ValidatorForm>
                </LoonsCard>
                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"></LoonsSnackbar>
                {/* <Changewarehouse isOpen={this.props.isOpen} type="myAllReturnRequests" /> */}
            </MainContainer >
        )
    }


}
const mapDispatchToProps = dispatch => {
    return {
        getSingleOrderRequirementItem: (id) => getSingleOrderRequirementItem(dispatch, id),
        createForeCast: (payload, id, save_or_update, payload2) => createForeCast(dispatch, payload, id, save_or_update, payload2),
        revertErrorStatus: () => revertErrorStatus(dispatch),
        getAllAgents: (id) => getAllAgents(dispatch, id),
        getEstimations: (params, type) => getEstimations(dispatch, params, type),
        getConsumptionData: (params, type) => getConsumptionData(dispatch, params, type),
        approvalProcess: (payload, id) => approvalProcess(dispatch, payload, id),
        getHistory: (params) => getHistory(dispatch, params)
    }
}

const mapStateToProps = ({ orderingReducer }) => {

    return {
        singleOneOrderItemStatus: orderingReducer?.singleOneOrderItemStatus,
        singleOneOrderItemData: orderingReducer?.singleOneOrderItemData,
        forecastStatus: orderingReducer?.forecastStatus,
        strengthStatus: orderingReducer?.strengthStatus,
        strengthList: orderingReducer?.strengthList,
        agentStatus: orderingReducer?.agentStatus,
        agentData: orderingReducer?.agentData,
        estimationStatus: orderingReducer?.estimationStatus,
        estimationData: orderingReducer?.estimationData,
        estimationStatusMonthly: orderingReducer?.estimationStatusMonthly,
        estimationDataMonthly: orderingReducer?.estimationDataMonthly,
        consumptionsStatusMonthly: orderingReducer?.consumptionsStatusMonthly,
        consumptionsDataMonthly: orderingReducer?.consumptionsDataMonthly,
        consumptionsStatus: orderingReducer?.consumptionsStatus,
        consumptionsData: orderingReducer?.consumptionsData,
        historyStatus: orderingReducer?.historyStatus,
        historyData: orderingReducer?.historyData
    }
}





export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReturnMode));