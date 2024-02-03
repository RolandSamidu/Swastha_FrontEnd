import React, { Component, Fragment } from 'react'
import {
    Divider, Grid, IconButton, CircularProgress, Tooltip, Dialog,
    RadioGroup,

    FormControlLabel,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete } from '@material-ui/lab'
import {
    CardTitle,
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    Button,
    MainContainer,
    SubTitle,
    DatePicker
} from 'app/components/LoonsLabComponents'
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility'
import QueuePlayNextIcon from '@material-ui/icons/QueuePlayNext';
import FeedIcon from '@mui/icons-material/Feed';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import 'date-fns'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import WarehouseServices from 'app/services/WarehouseServices'
import ConsignmentService from 'app/services/ConsignmentService'
import InventoryService from 'app/services/InventoryService'
import localStorageService from "app/services/localStorageService";
import PharmacyOrderService from "app/services/PharmacyOrderService"
import CloseIcon from '@material-ui/icons/Close';
import ListIcon from '@material-ui/icons/List';
import PharmacyService from 'app/services/PharmacyService'
import { Tabs, Tab } from '@mui/material';
import DashboardReportServices from 'app/services/DashboardReportServices'
import { convertTocommaSeparated, dateParse, includesArrayElements, roundDecimal } from 'utils'
import ClinicService from 'app/services/ClinicService'
import ReactToPrint from "react-to-print";

import ReactEcharts from 'echarts-for-react'
import echarts from "echarts/lib/echarts";

import CategoryService from 'app/services/datasetupServices/CategoryService'
import DistributionCenterServices from 'app/services/DistributionCenterServices'

const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },

    tableHeadBorder: {
        border: '1px solid black',
        borderCollapse: 'collapse'
    },
})

class StockPositionChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            all_item_category: [],
            filterData: {
                search_type: 'StockPositionReport',
                category_id: null,
                priority: null
            },
            data: null,
            print: false,

            stockData: null,
            copyData: null,



        }
    }



    async loadCategory() {
        let cat_res = await CategoryService.fetchAllCategories({})
        if (cat_res.status == 200) {
            // console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
    }

    async loadData(type, institute, dateRange) {

        this.setState({ loaded: "processing" })
        let filterData = this.state.filterData

        let batch_res = await DistributionCenterServices.getBatchData(filterData)
        if (batch_res.status == 200) {
            let filterd_data = batch_res.data.view.stock_data

            this.setState({
                data: batch_res.data.view,
                loaded: true,
                stockData: filterd_data,
                copyData: filterd_data
            })

            console.log('res Data checking', this.state.stockData)
            console.log('copyData checking 1', this.state.copyData)

        }
    }


    reloadData(type, institute, dateRange) {


    }


    async componentDidMount() {
        let user = await localStorageService.getItem('userInfo')
        let owner_id = await localStorageService.getItem('owner_id')

        let login_user_info = await localStorageService.getItem("userInfo");
        this.setState({ user_role: login_user_info.roles })

        this.loadCategory()


    }





    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>


              
                <Divider className='mb-3' />

                <ValidatorForm
                    className="pt-2 w-full"
                    onSubmit={() => this.loadData()}
                    onError={() => null}
                >
                    <Grid container spacing={2}>

                        <Grid className=" w-full" item lg={4} md={3} sm={12} xs={12}>
                            <SubTitle title="Category" />
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                options={this.state.all_item_category}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        let filterData = this.state.filterData
                                        filterData.category_id = value.id
                                        this.setState({ filterData })
                                    }
                                    else {
                                        let filterData = this.state.filterData
                                        filterData.category_id = null

                                        this.setState({
                                            filterData,
                                        })
                                    }
                                }}
                                // value={this.state.allVENS.find(
                                //     (obj) =>
                                //         obj.id ==
                                //         this.state.formData.ven_id
                                // )}
                                getOptionLabel={(option) => option.description ? (option.description) : ('')
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Category"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid className=" w-full" item lg={3} md={3} sm={12} xs={12}>
                            <SubTitle title="Priority" />
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                options={[
                                    { value: 'yes', label: 'Yes' },
                                    { value: 'no', label: 'No' },
                                ]}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        let filterData = this.state.filterData
                                        filterData.priority = value.value
                                        this.setState({ filterData })
                                    }
                                    else {
                                        let filterData = this.state.filterData
                                        filterData.priority = null

                                        this.setState({
                                            filterData,
                                        })
                                    }
                                }}
                                // value={this.state.allVENS.find(
                                //     (obj) =>
                                //         obj.id ==
                                //         this.state.formData.ven_id
                                // )}
                                getOptionLabel={(option) => option.label
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Category"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid className=" w-full" item lg={3} md={3} sm={12} xs={12} style={{paddingTop:'33px'}}>
                            <Button
                                className="mr-2"
                                progress={false}
                                type="submit"
                                scrollToTop={false}
                            // startIcon="save"
                            >
                                <span className="capitalize">
                                    Load
                                </span>
                            </Button>

                        </Grid>


                    </Grid>
                </ValidatorForm>


                {/* content start here */}
                {/*  <ReactToPrint
                                trigger={() => <Button id="print_presc_001" size="small" startIcon="print">Print</Button>}
                                pageStyle={pageStyle}
                                documentTitle="Pharmaceutical Update - MSD"
                                //onAfterPrint={() => { this.onAfterPrint() }}
                                //removeAfterPrint
                                content={() => this.componentRef}
                            /> */}

                {this.state.loaded == true ?
                    <>
                        <Grid container className='mb-3 px-2 py-2' style={{borderStyle:'ridge'}}>
                            <Grid item lg={7} md={7} sm={12} xs={12}>
                                <SubTitle title="Vital Stocks"></SubTitle>
                                <ReactEcharts
                                    className='mt--10'
                                    option={

                                        {
                                            /* title: {
                                                text: "Vital Data",
                                                //subtext: "bar",
                                                x: 'center'
                                            }, */
                                            tooltip: {
                                                trigger: 'axis'
                                            },
                                            legend: {
                                                icon: "circle",
                                                x: "center",
                                                y: "bottom",
                                                data: ["MSD", "Institutes", "National"],
                                                //itemStyle:{color:}, 
                                                textStyle: {
                                                    // color: "black"
                                                }
                                            },
                                            xAxis: {
                                                type: 'category',
                                                axisLabel: {
                                                    interval: 0,
                                                    //rotate: 10,
                                                },
                                                data: [
                                                    "Out of Stocks",
                                                    "1 month",
                                                    "1 to 2 months",
                                                    "2 to 3 months",
                                                    "3 to 6 months",
                                                    "More than 6 months"]
                                            },
                                            yAxis: {
                                                type: 'value'
                                            },
                                            series: [
                                                {
                                                    name: 'MSD',
                                                    data: [
                                                        this.state.data?.os[0]?.msd?.V,
                                                        this.state.data?.one_months[0]?.msd?.V,
                                                        this.state.data?.one_to_two_months[0]?.msd?.V,
                                                        this.state.data?.two_to_three_months[0]?.msd?.V,
                                                        this.state.data?.three_to_six_months[0]?.msd?.V,
                                                        this.state.data?.six_months_more[0]?.msd?.V
                                                    ],
                                                    smooth: true,
                                                    color: "#0074e1",
                                                    type: 'bar',
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
                                                    name: 'Institutes',
                                                    data: [
                                                        this.state.data?.os[0]?.institute?.V,
                                                        this.state.data?.one_months[0]?.institute?.V,
                                                        this.state.data?.one_to_two_months[0]?.institute?.V,
                                                        this.state.data?.two_to_three_months[0]?.institute?.V,
                                                        this.state.data?.three_to_six_months[0]?.institute?.V,
                                                        this.state.data?.six_months_more[0]?.institute?.V
                                                    ],
                                                    smooth: true,
                                                    type: 'bar',
                                                    color: "#f542a1",
                                                    lineStyle: {
                                                        width: 2,
                                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
                                                    name: 'National',
                                                    data: [
                                                        this.state.data?.os[0]?.national?.V,
                                                        this.state.data?.one_months[0]?.national?.V,
                                                        this.state.data?.one_to_two_months[0]?.national?.V,
                                                        this.state.data?.two_to_three_months[0]?.national?.V,
                                                        this.state.data?.three_to_six_months[0]?.national?.V,
                                                        this.state.data?.six_months_more[0]?.national?.V
                                                    ],
                                                    smooth: true,
                                                    type: 'bar',
                                                    color: "#32a866",
                                                    lineStyle: {
                                                        width: 2,
                                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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



                                            ]
                                        }
                                    }
                                    style={{ height: "300px" }}
                                ></ReactEcharts>
                            </Grid>

                            <Grid item lg={3} md={3} sm={12} xs={12}>
                                <SubTitle title="Available Stocks"></SubTitle>
                                <ReactEcharts
                                    className='mt--10'
                                    option={

                                        {
                                            /* title: {
                                                text: "Available Stock",
                                                x: 'center'
                                            }, */
                                            tooltip: {
                                                trigger: 'axis'
                                            },
                                            legend: {
                                                icon: "circle",
                                                x: "center",
                                                y: "bottom",
                                                data: ["MSD", "Institutes", "National"],
                                                //itemStyle:{color:}, 
                                                textStyle: {
                                                    // color: "black"
                                                }
                                            },
                                            xAxis: {
                                                type: 'category',
                                                axisLabel: {
                                                    interval: 0,
                                                    //rotate: 10,
                                                },
                                                data: [
                                                    "Available Stocks"]
                                            },
                                            yAxis: {
                                                type: 'value'
                                            },
                                            series: [
                                                {
                                                    name: 'MSD',
                                                    data: [
                                                        this.state.data?.six_months_more[0]?.msd?.V + this.state.data?.three_to_six_months[0]?.msd?.V + this.state.data?.two_to_three_months[0]?.msd?.V + this.state.data?.one_to_two_months[0]?.msd?.V + this.state.data?.one_months[0]?.msd?.V,

                                                    ],
                                                    smooth: true,
                                                    color: "#0074e1",
                                                    type: 'bar',
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
                                                    name: 'Institutes',
                                                    data: [
                                                        this.state.data?.six_months_more[0]?.institute?.V + this.state.data?.three_to_six_months[0]?.institute?.V + this.state.data?.two_to_three_months[0]?.institute?.V + this.state.data?.one_to_two_months[0]?.institute?.V + this.state.data?.one_months[0]?.institute?.V,

                                                    ],
                                                    smooth: true,
                                                    type: 'bar',
                                                    color: "#f542a1",
                                                    lineStyle: {
                                                        width: 2,
                                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
                                                    name: 'National',
                                                    data: [
                                                        this.state.data?.six_months_more[0]?.national?.V + this.state.data?.three_to_six_months[0]?.national?.V + this.state.data?.two_to_three_months[0]?.national?.V + this.state.data?.one_to_two_months[0]?.national?.V + this.state.data?.one_months[0]?.national?.V,

                                                    ],
                                                    smooth: true,
                                                    type: 'bar',
                                                    color: "#32a866",
                                                    lineStyle: {
                                                        width: 2,
                                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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



                                            ]
                                        }
                                    }
                                    style={{ height: "300px" }}
                                ></ReactEcharts>
                            </Grid>
                            <Grid item lg={2} md={2} sm={12} xs={12}>
                                <SubTitle title="Available/ Out of Stock"></SubTitle>
                                <ReactEcharts
                                    className='mt--10'
                                    option={

                                        {
                                            /*  title: {
                                                 text: "Available/ Out of Stock",
                                                 x: 'center'
                                             }, */
                                            tooltip: {
                                                trigger: 'axis'
                                            },
                                            legend: {
                                                icon: "circle",
                                                x: "center",
                                                y: "bottom",
                                                data: ["Available", "Out of Stock"],
                                                //itemStyle:{color:}, 
                                                textStyle: {
                                                    // color: "black"
                                                }
                                            },
                                            xAxis: {
                                                type: 'category',
                                                axisLabel: {
                                                    interval: 0,
                                                    //rotate: 10,
                                                },
                                                data: ["MSD", "Institute", "national"]
                                            },
                                            yAxis: {
                                                type: 'value'
                                            },
                                            series: [
                                                {
                                                    name: 'Available',
                                                    data: [
                                                        (((this.state.data?.six_months_more[0]?.msd?.V + this.state.data?.three_to_six_months[0]?.msd?.V + this.state.data?.two_to_three_months[0]?.msd?.V + this.state.data?.one_to_two_months[0]?.msd?.V + this.state.data?.one_months[0]?.msd?.V) / (this.state.data?.v_stocks?.count) * 100)).toFixed(2),
                                                        (((this.state.data?.six_months_more[0]?.institute?.V + this.state.data?.three_to_six_months[0]?.institute?.V + this.state.data?.two_to_three_months[0]?.institute?.V + this.state.data?.one_to_two_months[0]?.institute?.V + this.state.data?.one_months[0]?.institute?.V) / (this.state.data?.v_stocks?.count) * 100)).toFixed(2),
                                                        (((this.state.data?.six_months_more[0]?.national?.V + this.state.data?.three_to_six_months[0]?.national?.V + this.state.data?.two_to_three_months[0]?.national?.V + this.state.data?.one_to_two_months[0]?.national?.V + this.state.data?.one_months[0]?.national?.V) / (this.state.data?.v_stocks?.count) * 100)).toFixed(2),

                                                    ],
                                                    smooth: true,
                                                    color: "#47ed7c",
                                                    type: 'bar',
                                                    stack: 'total',

                                                    label: {
                                                        show: false,
                                                        position: 'top'
                                                    },
                                                },
                                                {
                                                    name: 'Out of Stock',
                                                    data: [
                                                        100 - (((this.state.data?.six_months_more[0]?.msd?.V + this.state.data?.three_to_six_months[0]?.msd?.V + this.state.data?.two_to_three_months[0]?.msd?.V + this.state.data?.one_to_two_months[0]?.msd?.V + this.state.data?.one_months[0]?.msd?.V) / (this.state.data?.v_stocks?.count) * 100)).toFixed(2),
                                                        100 - (((this.state.data?.six_months_more[0]?.institute?.V + this.state.data?.three_to_six_months[0]?.institute?.V + this.state.data?.two_to_three_months[0]?.institute?.V + this.state.data?.one_to_two_months[0]?.institute?.V + this.state.data?.one_months[0]?.institute?.V) / (this.state.data?.v_stocks?.count) * 100)).toFixed(2),
                                                        100 - (((this.state.data?.six_months_more[0]?.national?.V + this.state.data?.three_to_six_months[0]?.national?.V + this.state.data?.two_to_three_months[0]?.national?.V + this.state.data?.one_to_two_months[0]?.national?.V + this.state.data?.one_months[0]?.national?.V) / (this.state.data?.v_stocks?.count) * 100)).toFixed(2),

                                                    ],
                                                    smooth: true,
                                                    type: 'bar',
                                                    stack: 'total',
                                                    color: "#ff6254",

                                                    label: {
                                                        show: false,
                                                        position: 'top'
                                                    },
                                                },




                                            ]
                                        }
                                    }
                                    style={{ height: "300px" }}
                                ></ReactEcharts>
                            </Grid>
                            {/* non vital */}
                        </Grid>
                        <Grid container className='mb-3 px-2 py-2' style={{borderStyle:'ridge'}}>

                            <Grid item lg={7} md={7} sm={12} xs={12}>
                                <SubTitle title="Non Vital Stock"></SubTitle>
                                <ReactEcharts
                                    className='mt--10'
                                    option={

                                        {
                                            /* title: {
                                                text: "Non Vital Data",
                                                x: 'center'
                                            }, */
                                            tooltip: {
                                                trigger: 'axis'
                                            },
                                            legend: {
                                                icon: "circle",
                                                x: "center",
                                                y: "bottom",
                                                data: ["MSD", "Institutes", "National"],
                                                //itemStyle:{color:}, 
                                                textStyle: {
                                                    // color: "black"
                                                }
                                            },
                                            xAxis: {
                                                type: 'category',
                                                axisLabel: {
                                                    interval: 0,
                                                    //rotate: 10,
                                                },
                                                data: [
                                                    "Out of Stocks",
                                                    "1 month",
                                                    "1 to 2 months",
                                                    "2 to 3 months",
                                                    "3 to 6 months",
                                                    "More than 6 months"]
                                            },
                                            yAxis: {
                                                type: 'value'
                                            },
                                            series: [
                                                {
                                                    name: 'MSD',
                                                    data: [
                                                        this.state.data?.os[0]?.msd?.N + this.state.data?.os[0]?.msd?.E,
                                                        this.state.data?.one_months[0]?.msd?.N + this.state.data?.one_months[0]?.msd?.E,
                                                        this.state.data?.one_to_two_months[0]?.msd?.N + this.state.data?.one_to_two_months[0]?.msd?.E,
                                                        this.state.data?.two_to_three_months[0]?.msd?.N + this.state.data?.two_to_three_months[0]?.msd?.E,
                                                        this.state.data?.three_to_six_months[0]?.msd?.N + this.state.data?.three_to_six_months[0]?.msd?.E,
                                                        this.state.data?.six_months_more[0]?.msd?.N + this.state.data?.six_months_more[0]?.msd?.E
                                                    ],
                                                    smooth: true,
                                                    color: "#0074e1",
                                                    type: 'bar',
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
                                                    name: 'Institutes',
                                                    data: [
                                                        this.state.data?.os[0]?.institute?.N + this.state.data?.os[0]?.institute?.E,
                                                        this.state.data?.one_months[0]?.institute?.N + this.state.data?.one_months[0]?.institute?.E,
                                                        this.state.data?.one_to_two_months[0]?.institute?.N + this.state.data?.one_to_two_months[0]?.institute?.E,
                                                        this.state.data?.two_to_three_months[0]?.institute?.N + this.state.data?.two_to_three_months[0]?.institute?.E,
                                                        this.state.data?.three_to_six_months[0]?.institute?.N + this.state.data?.three_to_six_months[0]?.institute?.E,
                                                        this.state.data?.six_months_more[0]?.institute?.N + this.state.data?.six_months_more[0]?.institute?.E
                                                    ],
                                                    smooth: true,
                                                    type: 'bar',
                                                    color: "#f542a1",
                                                    lineStyle: {
                                                        width: 2,
                                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
                                                    name: 'National',
                                                    data: [
                                                        this.state.data?.os[0]?.national?.N + this.state.data?.os[0]?.national?.E,
                                                        this.state.data?.one_months[0]?.national?.N + this.state.data?.one_months[0]?.national?.E,
                                                        this.state.data?.one_to_two_months[0]?.national?.N + this.state.data?.one_to_two_months[0]?.national?.E,
                                                        this.state.data?.two_to_three_months[0]?.national?.N + this.state.data?.two_to_three_months[0]?.national?.E,
                                                        this.state.data?.three_to_six_months[0]?.national?.N + this.state.data?.three_to_six_months[0]?.national?.E,
                                                        this.state.data?.six_months_more[0]?.national?.N + this.state.data?.six_months_more[0]?.national?.E
                                                    ],
                                                    smooth: true,
                                                    type: 'bar',
                                                    color: "#32a866",
                                                    lineStyle: {
                                                        width: 2,
                                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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



                                            ]
                                        }
                                    }
                                    style={{ height: "300px" }}
                                ></ReactEcharts>
                            </Grid>

                            <Grid item lg={3} md={3} sm={12} xs={12}>
                                <SubTitle title="Available Stock"></SubTitle>
                                <ReactEcharts
                                    className='mt--10'
                                    option={

                                        {
                                            /*  title: {
                                                 text: "Available Stock",
                                                 x: 'center'
                                             }, */
                                            tooltip: {
                                                trigger: 'axis'
                                            },
                                            legend: {
                                                icon: "circle",
                                                x: "center",
                                                y: "bottom",
                                                data: ["MSD", "Institutes", "National"],
                                                //itemStyle:{color:}, 
                                                textStyle: {
                                                    // color: "black"
                                                }
                                            },
                                            xAxis: {
                                                type: 'category',
                                                axisLabel: {
                                                    interval: 0,
                                                    //rotate: 10,
                                                },
                                                data: [
                                                    "Available Stocks"]
                                            },
                                            yAxis: {
                                                type: 'value'
                                            },
                                            series: [
                                                {
                                                    name: 'MSD',
                                                    data: [
                                                        this.state.data?.six_months_more[0]?.msd?.N + this.state.data?.three_to_six_months[0]?.msd?.N + this.state.data?.two_to_three_months[0]?.msd?.N + this.state.data?.one_to_two_months[0]?.msd?.N + this.state.data?.one_months[0]?.msd?.N
                                                        + this.state.data?.six_months_more[0]?.msd?.E + this.state.data?.three_to_six_months[0]?.msd?.E + this.state.data?.two_to_three_months[0]?.msd?.E + this.state.data?.one_to_two_months[0]?.msd?.E + this.state.data?.one_months[0]?.msd?.E,

                                                    ],
                                                    smooth: true,
                                                    color: "#0074e1",
                                                    type: 'bar',
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
                                                    name: 'Institutes',
                                                    data: [
                                                        this.state.data?.six_months_more[0]?.institute?.N + this.state.data?.three_to_six_months[0]?.institute?.N + this.state.data?.two_to_three_months[0]?.institute?.N + this.state.data?.one_to_two_months[0]?.institute?.N + this.state.data?.one_months[0]?.institute?.N
                                                        + this.state.data?.six_months_more[0]?.institute?.E + this.state.data?.three_to_six_months[0]?.institute?.E + this.state.data?.two_to_three_months[0]?.institute?.E + this.state.data?.one_to_two_months[0]?.institute?.E + this.state.data?.one_months[0]?.institute?.E,

                                                    ],
                                                    smooth: true,
                                                    type: 'bar',
                                                    color: "#f542a1",
                                                    lineStyle: {
                                                        width: 2,
                                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
                                                    name: 'National',
                                                    data: [
                                                        this.state.data?.six_months_more[0]?.national?.N + this.state.data?.three_to_six_months[0]?.national?.N + this.state.data?.two_to_three_months[0]?.national?.N + this.state.data?.one_to_two_months[0]?.national?.N + this.state.data?.one_months[0]?.national?.N
                                                        + this.state.data?.six_months_more[0]?.national?.E + this.state.data?.three_to_six_months[0]?.national?.E + this.state.data?.two_to_three_months[0]?.national?.E + this.state.data?.one_to_two_months[0]?.national?.E + this.state.data?.one_months[0]?.national?.E,

                                                    ],
                                                    smooth: true,
                                                    type: 'bar',
                                                    color: "#32a866",
                                                    lineStyle: {
                                                        width: 2,
                                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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



                                            ]
                                        }
                                    }
                                    style={{ height: "300px" }}
                                ></ReactEcharts>
                            </Grid>

                            <Grid item lg={2} md={2} sm={12} xs={12}>
                                <SubTitle title="Available/ Out of Stock"></SubTitle>
                                <ReactEcharts
                                    className='mt--10'
                                    option={

                                        {
                                            /*  title: {
                                                 text: "Available/ Out of Stock",
                                                 x: 'center'
                                             }, */
                                            tooltip: {
                                                trigger: 'axis'
                                            },
                                            legend: {
                                                icon: "circle",
                                                x: "center",
                                                y: "bottom",
                                                data: ["Available", "Out of Stock"],
                                                //itemStyle:{color:}, 
                                                textStyle: {
                                                    // color: "black"
                                                }
                                            },
                                            xAxis: {
                                                type: 'category',
                                                axisLabel: {
                                                    interval: 0,
                                                    //rotate: 10,
                                                },
                                                data: ["MSD", "Institute", "national"]
                                            },
                                            yAxis: {
                                                type: 'value'
                                            },
                                            series: [
                                                {
                                                    name: 'Available',
                                                    data: [
                                                        (((this.state.data?.six_months_more[0]?.msd?.E + this.state.data?.three_to_six_months[0]?.msd?.E + this.state.data?.two_to_three_months[0]?.msd?.E + this.state.data?.one_to_two_months[0]?.msd?.E + this.state.data?.one_months[0]?.msd?.E +
                                                            this.state.data?.six_months_more[0]?.msd?.N + this.state.data?.three_to_six_months[0]?.msd?.N + this.state.data?.two_to_three_months[0]?.msd?.N + this.state.data?.one_to_two_months[0]?.msd?.N + this.state.data?.one_months[0]?.msd?.N) / (this.state.data?.N_stocks?.count + this.state.data?.E_stocks?.count) * 100)).toFixed(2),
                                                        (((this.state.data?.six_months_more[0]?.institute?.E + this.state.data?.three_to_six_months[0]?.institute?.E + this.state.data?.two_to_three_months[0]?.institute?.E + this.state.data?.one_to_two_months[0]?.institute?.E + this.state.data?.one_months[0]?.institute?.E +
                                                            this.state.data?.six_months_more[0]?.institute?.N + this.state.data?.three_to_six_months[0]?.institute?.N + this.state.data?.two_to_three_months[0]?.institute?.N + this.state.data?.one_to_two_months[0]?.institute?.N + this.state.data?.one_months[0]?.institute?.N) / (this.state.data?.N_stocks?.count + this.state.data?.E_stocks?.count) * 100)).toFixed(2),
                                                        (((this.state.data?.six_months_more[0]?.national?.E + this.state.data?.three_to_six_months[0]?.national?.E + this.state.data?.two_to_three_months[0]?.national?.E + this.state.data?.one_to_two_months[0]?.national?.E + this.state.data?.one_months[0]?.national?.E +
                                                            this.state.data?.six_months_more[0]?.national?.N + this.state.data?.three_to_six_months[0]?.national?.N + this.state.data?.two_to_three_months[0]?.national?.N + this.state.data?.one_to_two_months[0]?.national?.N + this.state.data?.one_months[0]?.national?.N) / (this.state.data?.N_stocks?.count + this.state.data?.E_stocks?.count) * 100)).toFixed(2),

                                                    ],
                                                    smooth: true,
                                                    color: "#47ed7c",
                                                    type: 'bar',
                                                    stack: 'total',

                                                    label: {
                                                        show: false,
                                                        position: 'top'
                                                    },
                                                },
                                                {
                                                    name: 'Out of Stock',
                                                    data: [
                                                        100 - (((this.state.data?.six_months_more[0]?.msd?.E + this.state.data?.three_to_six_months[0]?.msd?.E + this.state.data?.two_to_three_months[0]?.msd?.E + this.state.data?.one_to_two_months[0]?.msd?.E + this.state.data?.one_months[0]?.msd?.E +
                                                            this.state.data?.six_months_more[0]?.msd?.N + this.state.data?.three_to_six_months[0]?.msd?.N + this.state.data?.two_to_three_months[0]?.msd?.N + this.state.data?.one_to_two_months[0]?.msd?.N + this.state.data?.one_months[0]?.msd?.N) / (this.state.data?.N_stocks?.count + this.state.data?.E_stocks?.count) * 100)).toFixed(2),
                                                        100 - (((this.state.data?.six_months_more[0]?.institute?.E + this.state.data?.three_to_six_months[0]?.institute?.E + this.state.data?.two_to_three_months[0]?.institute?.E + this.state.data?.one_to_two_months[0]?.institute?.E + this.state.data?.one_months[0]?.institute?.E +
                                                            this.state.data?.six_months_more[0]?.institute?.N + this.state.data?.three_to_six_months[0]?.institute?.N + this.state.data?.two_to_three_months[0]?.institute?.N + this.state.data?.one_to_two_months[0]?.institute?.N + this.state.data?.one_months[0]?.institute?.N) / (this.state.data?.N_stocks?.count + this.state.data?.E_stocks?.count) * 100)).toFixed(2),
                                                        100 - (((this.state.data?.six_months_more[0]?.national?.E + this.state.data?.three_to_six_months[0]?.national?.E + this.state.data?.two_to_three_months[0]?.national?.E + this.state.data?.one_to_two_months[0]?.national?.E + this.state.data?.one_months[0]?.national?.E +
                                                            this.state.data?.six_months_more[0]?.national?.N + this.state.data?.three_to_six_months[0]?.national?.N + this.state.data?.two_to_three_months[0]?.national?.N + this.state.data?.one_to_two_months[0]?.national?.N + this.state.data?.one_months[0]?.national?.N) / (this.state.data?.N_stocks?.count + this.state.data?.E_stocks?.count) * 100)).toFixed(2),

                                                    ],
                                                    smooth: true,
                                                    type: 'bar',
                                                    stack: 'total',
                                                    color: "#ff6254",

                                                    label: {
                                                        show: false,
                                                        position: 'top'
                                                    },
                                                },




                                            ]
                                        }
                                    }
                                    style={{ height: "300px" }}
                                ></ReactEcharts>
                            </Grid>

                        </Grid>


                    </>
                    : this.state.loaded == "processing" &&
                    <Grid className="justify-center text-center w-full pt-12">
                        <CircularProgress size={30} />
                        <Typography variant="h5">Please wait. Your report is being prepared...</Typography>
                    </Grid>
                }

                {/* content end here */}

            </Fragment >
        )
    }
}

export default withStyles(styleSheet)(StockPositionChart)
