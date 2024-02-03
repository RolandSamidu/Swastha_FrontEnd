import { LoonsSnackbar } from "app/components/LoonsLabComponents";
import {
    Box,
    CircularProgress,
    Divider,
    Grid,
    Icon,
    IconButton,
    Input,
    InputAdornment,
    Select,
    TextareaAutosize,
    TextField,
    Tooltip,
    Typography,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle,
    Button,
} from 'app/components/LoonsLabComponents'
import React from 'react'
import { Component } from 'react'
import SearchIcon from '@material-ui/icons/Search'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import moment from 'moment'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { DatePicker } from 'app/components/LoonsLabComponents'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import Changewarehouse from "../changeWareHouseComponent";
import localStorageService from 'app/services/localStorageService'
import ReactEcharts from 'echarts-for-react'
import { convertTocommaSeparated, dateParse } from 'utils'
//import { CheckBox } from "@mui/icons-material";
// import { returnStatusOptions } from "../../../../../src/appconst";
import { getInstallments, addInstallment, getSingleOrderRequirementItem, updateInstallments, sendOrderQuantity, putOrder, putOrderRevert, getEstimations, approvalProcess, deleteInstallment, getHistory } from "../redux/action";
import LoonsButton from "app/components/LoonsLabComponents/Button";
import { acountantTypes, approvingRoles } from "../rolesEnums";
const statusCheck = ["Pending Approval", "HSCO Order Checked", "AD Order Approved", "Distribution Officer Order Checked"]
class ReturnMode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            adRemark: "",
            dateCheck: [],
            historyData: [],
            checkInstallmentStatus: false,
            adApproveRemark: "",
            accountantRemark: "",
            installmentQuantityData: [],
            estimationDataMonthly: [],
            singleOneOrderItemData: null,
            dateCheckersss: null,
            adCheckedRemarks: "",
            accountRemarks: "",
            adApproved: "",
            distributionRemarks: "",
            editInstallments: [],
            reqToDate: null,
            reqFromDate: null,
            alert: false,
            stockDetails: null,
            orderQuantity: null,
            forecast: null,
            stock: null,
            severity: "",
            message: "",
            data: [],
            loading: false,
            installmentDate: null,
            installmentQuantity: null,
            owner_id: "",
            status: "",
            drugStore: "",
            toDate: null,
            fromDate: null,
            drugStoreOptions: [],
            totalItems: 0,
            page: 0,
            limit: 20,

            columns: [
                {
                    name: "id",
                    label: "Installment",
                    options: {
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log(tableMeta, "tableMeta>>>>>")
                            return (
                                <>{((tableMeta.rowIndex) + 1)}</>

                            );
                        }

                    }
                },

                {
                    name: 'due_date', // field name in the row object
                    label: 'Date Scheduled', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>{value ? moment(value).format("DD-MM-YYYY") : "N/A"}</>
                            );
                        }

                    }
                },

                {
                    name: 'quantity', // field name in the row object
                    label: 'Order Quantity', // column title that will be shown in table
                    options: {
                        width: 30,
                        display: true,

                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>                                 {console.log(this.state.data, "api", this.state.editInstallments, tableMeta, "LLKK")}
                                    <TextField disabled={["Distribution Officer", "MSD Distribution Officer"].includes(localStorageService.getItem("userInfo")?.roles[0])} variant="outlined" value={this.state.editInstallments?.[tableMeta?.rowIndex]?.quantity || ""} onChange={(e) => this.handleEdit(e, tableMeta)}></TextField> &ensp;<LoonsButton disabled={this.state.data?.[tableMeta?.rowIndex]?.quantity == this.state.editInstallments?.[tableMeta?.rowIndex]?.quantity} onClick={(e) => this.updateInstallmentsData(e, tableMeta)} color="primary">
                                        Save</LoonsButton></>
                            );
                        }
                    },
                },
                {
                    name: 'RequiremntItem',
                    label: 'Unit cost', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>{value?.standard_unit_cost || "N/A"}</>
                            );
                        }
                    }
                },
                {
                    name: 'RequiremntItem', // field name in the row object
                    label: 'Cost', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log(tableMeta, "tableMet")
                            return (
                                <>{value?.standard_unit_cost && tableMeta?.rowData[2] ? parseInt(value?.standard_unit_cost) * parseInt(tableMeta?.rowData[2]) : "N/A"}</>
                            );
                        }
                    }
                },
                {
                    name: 'id', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <><LoonsButton disabled={["Distribution Officer", "MSD Distribution Officer"].includes(localStorageService.getItem("userInfo")?.roles[0])} onClick={() => this.props.deleteInstallment(value, {
                                    requirement_item_id: this.props.history.location.pathname.split("/")[3],
                                    'order[0][]': [
                                        'createdAt', 'ASC'
                                    ]
                                })} style={{ backgroundColor: "red" }}> Delete </LoonsButton></>
                            );
                        }
                    }
                }
                // {
                //     name: 'insitutional stock days ', // field name in the row object
                //     label: 'Action', // column title that will be shown in table
                //     options: {
                //         display: true,
                //         filter: true,
                //         width: 30,
                //         setCellProps: () => ({ style: { minWidth: "200px", maxWidth: "200px" } }),
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <>
                //                     {value ? (parseFloat(value)).toFixed(1) : ''}
                //                 </>
                //             );
                //         }

                //     }
                // },

            ],



            series: [
                {
                    name: 'Annual estimated',
                    data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
                },
            ],
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded',
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent'],
                },
                xaxis: {
                    categories: [
                        '2021',
                        '2022',
                        '2023',
                        '2024',
                        '2025',
                        '2026',
                        '2027',
                        '2028',
                        '2029',
                    ],
                },
                yaxis: {
                    title: {
                        text: 'Qty',
                    },
                },
                fill: {
                    opacity: 1,
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return '$ ' + val + ' thousands'
                        },
                    },
                },
            },
        }
    }

    handleEdit = (e, tableMeta) => {

        let arr = this.state.editInstallments;
        arr = arr.map((data, index) => {
            if (index === tableMeta.rowIndex) {
                return {
                    id: data.id,
                    quantity: e.target.value
                }
            } else {
                return data;
            }
        });
        this.setState({
            editInstallments: arr
        })

    }

    updateInstallmentsData = (e, tableMeta) => {
        const params = {
            requirement_item_id: this.props.history.location.pathname.split("/")[3],
            'order[0][]': [
                'createdAt', 'ASC'
            ]
        }
        let payload = this.state.editInstallments.filter((data, index) => index === tableMeta.rowIndex);


        this.props.updateInstallments(payload[0], payload[0]?.id, params)



    }
    componentDidMount() {

        const params = {
            requirement_item_id: this.props.history.location.pathname.split("/")[3],
            'order[0][]': [
                'createdAt', 'ASC'
            ]
        }

        this.props.getInstallments(params);
        this.props.getSingleOrderRequirementItem(this.props.history.location.pathname.split("/")[3]);
        const params2 = {
            item_id: this.props.history.location.pathname.split("/")[4],
            estimation_from: moment().startOf("year").format("YYYY-MM-DD"),
            estimation_to: moment().endOf("year").format("YYYY-MM-DD"),
            estimation_type: "Annual",
            search_type: "EstimationMonthly"
        }
        this.props.getEstimations(params2, "monthly");
        this.props.getHistory({
            msd_requirement_item_id: this.props.history.location.pathname.split("/")[3], type: "Order"
        })


    }


    handleRemarks = (e, type) => {

        if (type === "adApproved") {
            this.setState({
                adApproveRemark: e.target.value
            })
        }
        if (type === "adChecked") {
            this.setState({
                adCheckedRemarks: e.target.value
            })
        }

        if (type === "distributionOfficer") {
            this.setState({
                distributionRemarks: e.target.value
            })
        }

    }


    checkForStatus = () => {


        let statusQuantity = true;
        let dateStatus = false;

        if (this.state.singleOneOrderItemData?.order_quantity && (this.state.installmentQuantityData.reduce((partialSum, a) => partialSum + a, 0) + parseFloat(this.state.installmentQuantity)) <= this.state.singleOneOrderItemData?.order_quantity) {
            statusQuantity = false
        }
        if (this.state.dateCheck.length === 0 && this.state.installmentDate && new Date(this.state.installmentDate) >= new Date(this.state.reqToDate)) {
            dateStatus = true
        }
        if (this.state.dateCheck.length === 0 && this.state.installmentDate && new Date(this.state.installmentDate) <= new Date(this.state.reqFromDate)) {
            dateStatus = true
        }
        if (this.state.dateCheck.length && this.state.installmentDate && new Date(this.state.installmentDate) <= new Date(this.state.dateCheck[0].due_date)) {
            dateStatus = true;
        }
        if (this.state.dateCheck.length && this.state.installmentDate && new Date(this.state.installmentDate) <= new Date(this.state.dateCheck[0].due_date)) {
            dateStatus = true;
        }

        console.log({ dateStatus, statusQuantity })

        if (dateStatus || statusQuantity) {
            return true;
        } else {
            return false;
        }



    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.historyStatus) {
            console.log(nextProps.historyData, "llll")
            this.setState({
                historyData: nextProps?.historyData?.data
            })
        }

        if (nextProps?.installmentUpdateStatus === true) {
            this.setState({
                message: "installment has been successfully updated",
                severity: "success",
                alert: true
            })
        }

        if (nextProps?.installmentDeleteStatus === true) {
            this.setState({
                message: "installment has been successfully deleted",
                severity: "success",
                alert: true
            })
        }


        if (nextProps?.createInstallmentStatus) {
            this.setState({
                message: "installment details have been added successfully",
                severity: "success",
                alert: true
            })
        }

        if (nextProps?.installmentStatus === true) {

            this.setState({
                data: nextProps.installmentList.data,
                editInstallments: nextProps.installmentList.data,
                totalItems: nextProps.installmentList.totalItems,
                forecast: nextProps.singleOneOrderItemData,
                stockDetails: nextProps?.singleOneOrderItemData,
                orderQuantity: nextProps?.singleOneOrderItemData?.order_quantity,
                reqFromDate: nextProps?.singleOneOrderItemData?.requirement_from,
                reqToDate: nextProps?.singleOneOrderItemData?.requirement_to,
                installmentQuantityData: nextProps.installmentList.data.map((data) => parseFloat(data.quantity)),
                dateCheck: nextProps.installmentList.data.sort((a, b) => new Date(b.due_date) - new Date(a.due_date))
            });
        }



        if (nextProps?.putOrderStatus === true) {
            this.setState({
                alert: true,
                message: "success",
                severity: "success"
            })

            this.props.putOrderRevert()

            this.props.history.push("/ordering/placeOrder")
        }
        if (nextProps?.putOrderStatus === false) {
            this.setState({
                alert: true,
                message: "error",
                severity: "error"
            })
        }

        if (nextProps?.orderQuantityStatus === true) {
            this.setState({
                alert: true,
                message: "Sucess",
                severity: "success"
            })
        }
        if (nextProps?.orderQuantityStatus === false) {
            this.setState({
                alert: true,
                message: "error",
                severity: "error"
            })
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
                    dataValues.push(monthlyEstimation[`${keyyy}`])
                }

            }
            this.setState({ estimationDataMonthly: dataValues })
        }

        if (nextProps.singleOneOrderItemData) {

            console.log(nextProps.singleOneOrderItemData?.MSDOrderRequirementApproves.filter((data) => data.status === "AD Checked")[0], "akllkk")
            this.setState({
                singleOneOrderItemData: nextProps.singleOneOrderItemData,
                adCheckedRemarks: nextProps.singleOneOrderItemData?.MSDOrderRequirementApproves.filter((data) => data.status === "HSCO Order Checked").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.remark || "",
                adApproveRemark: nextProps.singleOneOrderItemData?.MSDOrderRequirementApproves.filter((data) => data.status === "AD Order Approved").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.remark || "",
                distributionRemarks: nextProps.singleOneOrderItemData?.MSDOrderRequirementApproves.filter((data) => data.status === "Distribution Officer Order Checked").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.remark || "",

            });
        }

    }

    approveOrReject = (e, approveOrReject, type) => {


        let status = null;
        let remarks = "";
        if (approveOrReject === "request_approval") {
            status = "Pending Approval";
        }
        if (approveOrReject === "approve" && type === "ad_check") {
            status = "HSCO Order Checked";
            remarks = this.state.adCheckedRemarks;
        } else if (approveOrReject === "reject" && type === "ad_check") {
            status = "HSCO Order Ammended";
            remarks = this.state.adCheckedRemarks;

        } else if (approveOrReject === "approve" && type === "distributionOfficer") {
            status = "Distribution Officer Order Checked";
            remarks = this.state.distributionRemarks;



        } else if (approveOrReject === "approve" && type === "ad_approve") {
            status = "AD Order Approved";
            remarks = this.state.adApproveRemark;

        } else if (approveOrReject === "reject" && type === "ad_approve") {
            status = "AD Order Rejected";
            remarks = this.state.adApproveRemark

        }
        const payload = {
            "approved_by": localStorageService.getItem("userInfo").id,
            "remark": remarks,
            "status": status,
            "role": localStorageService.getItem("userInfo").roles[0],
            "type": status,
            "change_by": localStorageService.getItem("userInfo").id,
            "total_calculated_cost": parseFloat(this.state.stockDetails?.standard_unit_cost || 0) * parseFloat(this.state.orderQuantity || 0),
            "order_quantity": parseFloat(this.state.orderQuantity),
        }

        this.props.approvalProcess(payload, this.props.history.location.pathname.split("/")[3])

    }


    addInstallment = () => {


        const id = this.props.history.location.pathname.split("/")[3]
        const payload = {
            due_date: moment(this.state.installmentDate).format("YYYY-MM-DD"),
            quantity: parseInt(this.state.installmentQuantity),
            requirement_item_id: id
        }


        this.props.addInstallment(payload)
        this.setState({
            installmentDate: null, installmentQuantity: null
        })

    }


    render() {


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
                name: `Estimation for ${new Date().getFullYear()}`,
                type: 'line',
                data: this.state.estimationDataMonthly,
            }],


        }


        const children = (
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                <FormControlLabel
                    label="Lotantham 1.26mg"
                    control={<Checkbox />}
                />
                <FormControlLabel
                    label="Lotantham 1.26mg"
                    control={<Checkbox />}
                />
            </Box>
        )

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
        )

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
        )
        const children2 = (
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                <FormControlLabel label="olimersatan" control={<Checkbox />} />
                {children4}
                <FormControlLabel label="terimasten" control={<Checkbox />} />
                {children3}
            </Box>
        )

        return (
            <MainContainer>
                <LoonsCard>
                    {/* <Typography variant="h7" className="font-semibold">
                        Forecast Yearly Requirement
                    </Typography> */}

                    <Grid
                        container="container"
                        style={{ height: '20px', width: '100%' }}
                    ></Grid>
                    <ValidatorForm
                        className=""
                        onSubmit={() => this.SubmitAll()}
                        onError={() => null}
                    >
                        <Grid container="container" spacing={2} direction="row">

                            <Grid item lg={12} md={12} sm={12} xs={12} className="px-2">
                                <span>
                                    <b>Annual Forecast Requirement</b>
                                </span>
                                <br /><br /><span style={{ fontSize: "20px", color: "green" }}


                                ><b>{this.state.stockDetails?.forecast_quantity}</b></span>
                            </Grid>

                            <Grid item lg={3} md={3} sm={12} xs={12} className="px-2">
                                <SubTitle title={"Requirement from"} style={{ color: "green", fontSize: "20px" }}></SubTitle>
                                <DatePicker
                                    className="w-full"
                                    value={
                                        this.state.reqFromDate
                                    }
                                    placeholder="Date Range (From)"
                                    onChange={(date) => {
                                        let obj = this.state.selectedValue;
                                        if (date) {


                                            this.setState({ reqFromDate: date })
                                        } else {
                                            obj.requirementFrom = null

                                            this.setState({ reqFromDate: null })
                                        }
                                    }} />
                            </Grid>
                            <Grid item lg={3} md={3} sm={12} xs={12} className="px-2">
                                <SubTitle title={"Requirement to"}></SubTitle>
                                <DatePicker
                                    style={{ color: "green", fontSize: "20px" }}
                                    className="w-full"
                                    value={
                                        this.state.reqToDate
                                    }
                                    placeholder="Date Range (to)"
                                    onChange={(date) => {
                                        let obj = this.state.selectedValue;
                                        if (date) {

                                            this.setState({ reqToDate: date })
                                        } else {


                                            this.setState({ reqToDate: null })
                                        }
                                    }} />
                                {this.state.reqFromDate && this.state.reqToDate && new Date(this.state.reqToDate) <= new Date(this.state.reqFromDate) && <span style={{ color: "red" }}>please select a date higher than {moment(this.state.reqFromDate).format("DD-MM-YYYY")}</span>}
                            </Grid>
                            <Grid item lg={3} md={3} sm={12} xs={12} className="px-2">
                                <SubTitle title={"Months"}></SubTitle><span style={{ fontSize: "20px", color: "green" }}><b>{isNaN(Math.ceil((moment(this.state.reqToDate).diff(moment(this.state.reqFromDate), 'months', true)))) ? "" : `${Math.ceil((moment(this.state.reqToDate).diff(moment(this.state.reqFromDate), 'months', true)))} Months`} &ensp;</b></span>

                            </Grid>
                            <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                <Grid container="container" spacing={2}>
                                    <Grid
                                        item="item"
                                        xs={12}
                                        sm={12}
                                        md={3}
                                        lg={3}
                                        style={{ border: '1px solid black' }}
                                    >
                                        <span>
                                            <b>Required Qty</b>
                                        </span>
                                        <table>
                                            <tr>
                                                <td>
                                                    Qty
                                                    <br />


                                                    <span>{isNaN((((this.state.stockDetails?.forecast_quantity / 12) * (Math.ceil((moment(this.state.reqToDate).diff(moment(this.state.reqFromDate), 'months', true))))).toFixed(2))) ? "" : (((this.state.stockDetails?.forecast_quantity / 12) * (Math.ceil(moment(this.state.reqToDate).diff(moment(this.state.reqFromDate), 'months', true)))).toFixed(2))}</span>
                                                </td>
                                                {/* <td>
                                                    Mts
                                                    <Input
                                                        value="2"
                                                        type="outlined"
                                                    ></Input>
                                                </td> */}
                                                {/* <td>
                                                    Days
                                                    <Input
                                                        value="90"
                                                        type="outlined"
                                                    ></Input>
                                                </td> */}
                                            </tr>
                                        </table>
                                    </Grid>
                                    <Grid
                                        item="item"
                                        xs={3}
                                        sm={3}
                                        md={1}
                                        lg={1}
                                    >
                                        <span style={{ fontSize: '20px' }}>
                                            {' '}
                                            -{' '}
                                        </span>
                                    </Grid>
                                    <Grid
                                        item="item"
                                        xs={12}
                                        sm={12}
                                        md={2}
                                        lg={2}
                                        style={{ border: '1px solid black' }}
                                    >
                                        <table>
                                            <span>
                                                <b>Expected Availability</b>
                                            </span>

                                            <tr>
                                                <td>
                                                    Qty
                                                    <br />

                                                    <TextValidator
                                                        disabled
                                                        value={this.state.stockDetails?.expected_availability}
                                                        variant="outlined"
                                                        type="number"
                                                        readOnly={true}

                                                    ></TextValidator>
                                                </td>
                                                {/* <td>
                                                    Mts
                                                    <Input
                                                        value="3.5"
                                                        type="outlined"
                                                    ></Input>
                                                </td> */}
                                                {/* <td>
                                                    Days
                                                    <Input
                                                        value="90"
                                                        type="outlined"
                                                    ></Input>
                                                </td> */}
                                            </tr>
                                        </table>
                                    </Grid>
                                    <Grid
                                        item="item"
                                        xs={12}
                                        sm={12}
                                        md={1}
                                        lg={1}
                                    >
                                        <span style={{ fontSize: '20px' }}>
                                            ={' '}
                                        </span>
                                    </Grid>
                                    <Grid
                                        item="item"
                                        xs={12}
                                        sm={12}
                                        md={2}
                                        lg={2}
                                        style={{ border: '1px solid black' }}
                                    >
                                        <table>
                                            <span>
                                                <b>Defecit</b>
                                            </span>
                                            <tr>
                                                <td>
                                                    Qty
                                                    <br />


                                                    <TextValidator
                                                        value={parseFloat(this.state.stockDetails?.forecast_quantity) - parseFloat((this.state.stockDetails?.expected_availability))}
                                                        disabled
                                                        variant="outlined"
                                                        type="number"
                                                        readOnly={true}

                                                    ></TextValidator>
                                                </td>
                                                {/* <td>
                                                    Mts
                                                    <Input
                                                        value="4.0"
                                                        type="outlined"
                                                    ></Input>
                                                </td> */}
                                                {/* <td>
                                                    Days
                                                    <Input
                                                        value="90"
                                                        type="outlined"
                                                    ></Input>
                                                </td> */}
                                            </tr>
                                        </table>
                                    </Grid>
                                    <Grid
                                        item="item"
                                        xs={12}
                                        sm={12}
                                        md={1}
                                        lg={1}
                                    ></Grid>
                                    <Grid
                                        item="item"
                                        xs={12}
                                        sm={12}
                                        md={2}
                                        lg={2}
                                        style={{ border: '1px solid black' }}
                                    >
                                        <span>
                                            <b>Order Quantity</b>
                                        </span>
                                        <table>
                                            <tr>
                                                <td>
                                                    Qty
                                                    <br />



                                                    <TextValidator value={this.state.orderQuantity}
                                                        variant="outlined"
                                                        onChange={(e) => this.setState({
                                                            orderQuantity: e.target.value
                                                        })}

                                                    ></TextValidator>
                                                </td>
                                                {/* <td>
                                                    Mts
                                                    <Input
                                                        value="3.00"
                                                        variant="outlined"
                                                    ></Input>
                                                </td> */}
                                                {/* <td>
                                                    Days
                                                    <Input
                                                        value="90"
                                                        variant="outlined"
                                                    ></Input>
                                                </td> */}
                                            </tr>
                                        </table>

                                    </Grid>
                                    <Grid container="container" spacing={2} direction="row" style={{ height: "20px" }}>
                                    </Grid>                                    <table style={{ marginLeft: "80%" }}>
                                        <tr>
                                            <td>
                                                Total Cost: {convertTocommaSeparated((parseFloat(this.state.stockDetails?.standard_unit_cost || 0) * parseFloat(this.state.orderQuantity || 0)).toFixed(2), 2)}
                                            </td>
                                        </tr>
                                    </table>
                                    <Grid className="w-full">
                                       
                                            {console.log((new Date(this.state.reqToDate)) <= (new Date(this.state.reqFromDate)), "tetetet")}
                                           
                                                    <LoonsButton color="primary" disabled={(this.state.reqFromDate && this.state.reqToDate) && (new Date(this.state.reqToDate)) <= (new Date(this.state.reqFromDate)) ? true : false} onClick={() => this.props.sendOrderQuantity({
                                                        "expected_availability": parseFloat(this.state.stockDetails?.expected_availability),
                                                        "deficit": parseFloat(this.state.stockDetails?.forecast_quantity) - parseFloat((this.state.stockDetails?.estimation_next_year || this.state.stockDetails?.annual_estimation)),
                                                        "total_calculated_cost": parseFloat(this.state.stockDetails?.standard_unit_cost || 0) * parseFloat(this.state.orderQuantity || 0),
                                                        "order_quantity": parseFloat(this.state.orderQuantity),
                                                        "requirement_from": moment(this.state.reqFromDate).format("YYYY-MM-DD"),
                                                        "requirement_to": moment(this.state.reqToDate).format("YYYY-MM-DD")

                                                    }, this.props.history.location.pathname.split("/")[3])}>Save</LoonsButton> 
                                        
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                    <Grid
                        className="mt-5"
                        container="container"
                        spacing={2}
                        style={{ height: '30px' }}
                    ></Grid>
                    <Grid container="container" spacing={2} direction="row">
                        <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                            <Grid container="container" spacing={2}>
                                <Grid item="item" xs={12} sm={12} md={6} lg={6}>
                                    {/* <ReactApexChart
                                        options={options2}
                                        series={series2}
                                        type="line"
                                        height={350}
                                    /> */}

                                    <ReactEcharts
                                        className="mt--10"
                                        style={{ height: 350 }}
                                        option={optionEchart}
                                    />
                                </Grid>
                                <Grid item="item" xs={12} sm={12} md={6} lg={6}>
                                    <Typography
                                        variant="h7"
                                        className="font-semibold"
                                    >
                                        Add installments
                                    </Typography>
                                    <table className="w-full">
                                        {/* <tr> <td>Total order quantity</td>
                                            <td>20,0000</td>
                                            <td></td>
                                            <td>Remain order qunatityt schedule</td>
                                            <td>10,0000</td></tr> */}
                                        <tr>
                                            <td>Due Date</td>
                                            <td></td>
                                            <td><DatePicker
                                                className="w-full"
                                                value={
                                                    this.state.installmentDate
                                                }
                                                placeholder="Date Range (From)"
                                                onChange={(date) => {
                                                    if (date) {

                                                        this.setState({ installmentDate: date })

                                                    } else {

                                                        this.setState({ installmentDate: null })
                                                    }
                                                }} />
                                                {this.state.dateCheck.length && this.state.installmentDate && new Date(this.state.installmentDate) <= new Date(this.state.dateCheck[0]?.due_date) ? <span style={{ color: "red" }}>{`Please select date higher than ${moment(this.state.dateCheck[0]?.due_date).format("YYYY-MM-DD")}`}</span> : ""}
                                                {this.state.dateCheck.length === 0 && this.state.installmentDate && new Date(this.state.reqFromDate) >= new Date(this.state.installmentDate) && < span>Please Select Date higer than `{moment(this.state.reqFromDate).format("DD-MM-YYYY")}`</span>}
                                                {this.state.dateCheck.length === 0 && this.state.installmentDate && new Date(this.state.reqToDate) <= new Date(this.state.installmentDate) && < span>Please Select Date less than  `{moment(this.state.reqToDate).format("DD-MM-YYYY")}`</span>}
                                                {this.state.dateCheck.length && this.state.installmentDate && new Date(this.state.installmentDate) >= new Date(this.state.reqToDate) ? <span style={{ color: "red" }}>{`Please select date less than ${moment(this.state.reqToDate).format("YYYY-MM-DD")}`}</span> : ""}





                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Quantity</td>
                                            <td></td>

                                            <td><ValidatorForm> <TextValidator
                                                className='w-full'
                                                placeholder="Quantity"
                                                onChange={(e) => {

                                                    this.setState({ installmentQuantity: e.target.value })

                                                }}
                                                value={this.state.installmentQuantity || ""}
                                                fullWidth
                                                variant="outlined"
                                                size="small"


                                            />

                                                {(this.state.installmentQuantityData.reduce((partialSum, a) => partialSum + a, 0) + parseFloat(this.state.installmentQuantity)) > (this.state.singleOneOrderItemData?.order_quantity) && <>
                                                    <span style={{ color: "red" }}>Total Installmentquantity can't exceed Order Quantity</span></>}
                                            </ValidatorForm>
                                            </td>
                                        </tr>
                                    </table>
                                    <br />
                                    <Button colr='primary' disabled={this.checkForStatus()} onClick={this.addInstallment}>Add Installment</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        container="container"
                        style={{ hwight: '20px', width: '100%' }}
                    ></Grid>

                    <Grid container="container" className="mt-3 pb-5">
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            {!this.state.loading ? (
                                <LoonsTable
                                    title={'Order installment Schedule'}
                                    id={'allAptitute'}
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        // rowsPerPage: this.state.rowsPerPage,
                                        count: this.state.totalItems,
                                        // rowsPerPageOptions: [20, 50, 100],
                                        page: this.state.page,
                                        onTableChange: (action, tableState) => {
                                            switch (action) {
                                                case 'changePage':
                                                    this.handlePaginations(
                                                        tableState.page,
                                                        tableState.rowsPerPage
                                                    )
                                                    break
                                                case 'changeRowsPerPage':
                                                    this.handlePaginations(
                                                        tableState.page,
                                                        tableState.rowsPerPage
                                                    )
                                                    break
                                                case 'sort':
                                                    //this.sort(tableState.page, tableState.sortOrder);
                                                    break
                                                default:
                                            }
                                        },
                                    }}
                                ></LoonsTable>
                            ) : (
                                //loading effect
                                <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress size={30} />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>

                    {console.log((this.state.installmentQuantityData.reduce((partialSum, a) => partialSum + a, 0)) === parseFloat(this.state.singleOneOrderItemData?.order_quantity), (this.state.installmentQuantityData.reduce((partialSum, a) => partialSum + a, 0)), this.state.singleOneOrderItemData?.order_quantity, "lkkk")}
                    {!statusCheck.includes(this.state.singleOneOrderItemData?.status) && <>

                        <LoonsButton color="primary" onClick={(e) => this.approveOrReject(e, "request_approval", "ad_check")} disabled={!((this.state.installmentQuantityData.reduce((partialSum, a) => partialSum + a, 0)) == parseFloat(this.state.singleOneOrderItemData?.order_quantity))} >Send Approval </LoonsButton></>}


                    <Grid container="container" spacing={2} direction="row">
                        <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                            <Grid container="container" spacing={2}>

                                {/* <Grid item="item" xs={12} sm={8} md={12} lg={12}> */}

                                {/* </Grid> */}
                                {/* <Grid item="item" lg={6} md={6} xs={6}>
                                </Grid> */}
                                <Grid item="item" lg={6} md={6} xs={6}>
                                    <Grid item="item" lg={2} md={1} xs={1}> HSCO Remarks</Grid>
                                    <Grid item="item" lg={10} md={12} xs={12}>
                                        <textarea
                                            value={this.state.adCheckedRemarks}
                                            disabled={localStorageService.getItem("userInfo").roles[0] !== "HSCO" || this.state.singleOneOrderItemData?.status !== "Pending Approval" || !((this.state.installmentQuantityData.reduce((partialSum, a) => partialSum + a, 0)) == parseFloat(this.state.singleOneOrderItemData?.order_quantity))}


                                            onChange={(e) => this.handleRemarks(e, "adChecked")}
                                            style={{
                                                width: '100%'
                                            }}
                                            cols="2"
                                            rows="5"></textarea>
                                    </Grid>
                                    <LoonsButton color="danger" onClick={(e) => this.approveOrReject(e, "reject", "ad_check")} disabled={localStorageService.getItem("userInfo").roles[0] !== "HSCO" || this.state.singleOneOrderItemData?.status !== "Pending Approval" || !((this.state.installmentQuantityData.reduce((partialSum, a) => partialSum + a, 0)) == parseFloat(this.state.singleOneOrderItemData?.order_quantity))}
                                    >Ammend</LoonsButton>      <LoonsButton color="primary" onClick={(e) => this.approveOrReject(e, "approve", "ad_check")} disabled={localStorageService.getItem("userInfo").roles[0] !== "HSCO" || this.state.singleOneOrderItemData?.status !== "Pending Approval" || !((this.state.installmentQuantityData.reduce((partialSum, a) => partialSum + a, 0)) == parseFloat(this.state.singleOneOrderItemData?.order_quantity))}
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

                                {console.log(localStorageService.getItem("userInfo").roles[0], "nnnn")}
                                <Grid item="item" lg={6} md={6} xs={6}>
                                    <Grid item="item" lg={4} md={1} xs={1}> Distribution Officer Remarks</Grid>
                                    <Grid item="item" lg={10} md={12} xs={12}>
                                        <textarea
                                            disabled={!approvingRoles.includes(localStorageService.getItem("userInfo").roles[0]) || this.state.singleOneOrderItemData?.status !== "HSCO Order Checked"}
                                            // onChange={(e)=>{
                                            //     this.state.allocate.other_remarks = e.target.value
                                            // }}
                                            value={this.state.distributionRemarks}

                                            onChange={(e) => this.handleRemarks(e, "distributionOfficer")}

                                            style={{
                                                width: '100%'
                                            }}
                                            cols="2"
                                            rows="5"></textarea>
                                    </Grid>
                                    <LoonsButton color="primary" onClick={(e) => this.approveOrReject(e, "approve", "distributionOfficer")} disabled={!approvingRoles.includes(localStorageService.getItem("userInfo").roles[0]) || this.state.singleOneOrderItemData?.status !== "HSCO Order Checked"}
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
                                    <Grid item="item" lg={2} md={1} xs={1}> AD Remarks</Grid>
                                    <Grid item="item" lg={10} md={12} xs={12}>
                                        <textarea
                                            value={this.state.adApproveRemark}

                                            disabled={this.state.singleOneOrderItemData?.status !== "Distribution Officer Order Checked" || localStorageService.getItem("userInfo").roles[0] !== "MSD AD" || !((this.state.installmentQuantityData.reduce((partialSum, a) => partialSum + a, 0)) == parseFloat(this.state.singleOneOrderItemData?.order_quantity))}

                                            // onChange={(e)=>{
                                            //     this.state.allocate.other_remarks = e.target.value
                                            // }}
                                            onChange={(e) => this.handleRemarks(e, "adApproved")}

                                            style={{
                                                width: '100%'
                                            }}
                                            cols="2"
                                            rows="5"></textarea>
                                    </Grid>
                                    <LoonsButton color="danger" disabled={this.state.singleOneOrderItemData?.status !== "Distribution Officer Order Checked" || localStorageService.getItem("userInfo").roles[0] !== "MSD AD" || !((this.state.installmentQuantityData.reduce((partialSum, a) => partialSum + a, 0)) == parseFloat(this.state.singleOneOrderItemData?.order_quantity))} > Reject</LoonsButton>      <LoonsButton disabled={this.state.singleOneOrderItemData?.status !== "Distribution Officer Order Checked" || localStorageService.getItem("userInfo").roles[0] !== "MSD AD" || !((this.state.installmentQuantityData.reduce((partialSum, a) => partialSum + a, 0)) == parseFloat(this.state.singleOneOrderItemData?.order_quantity))} color="primary" onClick={(e) => this.approveOrReject(e, "approve", "ad_approve")}>Approved</LoonsButton>                                    </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                        <table style={{ width: '100%' }}>

                            <thead>
                                <tr>
                                    <th>Name</th>


                                    <th> Role</th>


                                    <th> Order Quantity</th>

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
                                                    {dat?.data?.order_quantity || ""}
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
                    {(localStorageService.getItem("userInfo").roles[0] === "MSD SCO" || localStorageService.getItem("userInfo").roles[0] === "MSD SCO Supply" || localStorageService.getItem("userInfo").roles[0] === "MSD SCO QA") && (this.state.singleOneOrderItemData?.status === "AD Order Approved") ? <Grid container="container" spacing={2} direction="row">
                        <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                            <Grid container="container" spacing={2}></Grid><LoonsButton disabled={this.state.singleOneOrderItemData?.status !== "AD Order Approved"} style={{ marginLeft: "90%" }} color="primary" onClick={() => this.props.putOrder(this.props.history.location.pathname.split("/")[3])}>Finish</LoonsButton></Grid></Grid>
                        : <></>}
                    <Grid container="container" spacing={2} direction="row" style={{ height: "20px" }}>
                    </Grid>
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

                </LoonsCard>
                {/* <Changewarehouse isOpen={this.props.isOpen} type="myAllReturnRequests" /> */}
            </MainContainer>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getInstallments: (params) => getInstallments(dispatch, params),
        addInstallment: (payload) => addInstallment(dispatch, payload),
        getSingleOrderRequirementItem: (id) => getSingleOrderRequirementItem(dispatch, id),
        sendOrderQuantity: (payload, id) => sendOrderQuantity(dispatch, payload, id),
        putOrder: (id) => putOrder(dispatch, id),
        putOrderRevert: () => putOrderRevert(dispatch),
        getEstimations: (params, type) => getEstimations(dispatch, params, type),
        approvalProcess: (params, id) => approvalProcess(dispatch, params, id),
        updateInstallments: (payload, id, params) => updateInstallments(dispatch, payload, id, params),
        deleteInstallment: (id, params) => deleteInstallment(dispatch, id, params),
        getHistory: (params) => getHistory(dispatch, params)

    }
}





const mapStateToProps = ({ orderingReducer }) => {
    return {
        installmentStatus: orderingReducer.installmentStatus,
        singleOneOrderItemData: orderingReducer.singleOneOrderItemData,
        singleOneOrderItemStatus: orderingReducer.singleOneOrderItemStatus,
        installmentList: orderingReducer.installmentList,
        createInstallmentStatus: orderingReducer.createInstallmentStatus,
        singleOneOrderItemStatus: orderingReducer?.singleOneOrderItemStatus,
        singleOneOrderItemData: orderingReducer?.singleOneOrderItemData,
        putOrderStatus: orderingReducer?.putOrderStatus,
        orderQuantityStatus: orderingReducer?.orderQuantityStatus,
        estimationStatusMonthly: orderingReducer?.estimationStatusMonthly,
        estimationDataMonthly: orderingReducer?.estimationDataMonthly,
        installmentUpdateStatus: orderingReducer?.installmentUpdateStatus,
        installmentDeleteStatus: orderingReducer?.installmentDeleteStatus,
        historyStatus: orderingReducer?.historyStatus,
        historyData: orderingReducer?.historyData
    }
}




export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReturnMode));
