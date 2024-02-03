import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import { Autocomplete } from '@mui/material'
import {
    Card,
    TextField,
    InputBase,
    MenuItem,
    IconButton,
    Icon,
    Grid,
    Switch,
    Typography,
    Radio,
    RadioGroup,
    Divider,
    Tooltip,
    CircularProgress,
    TableCell,
    Table,
    TableBody,
    InputAdornment,
    TableRow,
    FormControlLabel,
} from '@material-ui/core'
import { themeColors } from 'app/components/MatxTheme/themeColors'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@material-ui/icons/Visibility'
import EditIcon from '@material-ui/icons/Edit'
import {
    LoonsTable,
    DatePicker,
    Button,
    FilePicker,
    ExcelToTable,
    LoonsSnackbar,
    LoonsDialogBox,
    LoonsSwitch,
    LoonsCard,
    CardTitle,
    SubTitle,
    Charts,
} from 'app/components/LoonsLabComponents'
// import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import Chart from './chart'
import { dateParse } from 'utils'
import PropTypes from 'prop-types'

import ExaminationServices from 'app/services/ExaminationServices'
import InventoryService from 'app/services/InventoryService'
import DistributionCenterServices from 'app/services/DistributionCenterServices'
import LoonsButton from '../../Button'
import LabeledInput from '../../LabeledInput'
import localStorageService from 'app/services/localStorageService'
import DashboardReportServices from 'app/services/DashboardReportServices'
// import BloodPressureChart from '../../BloodPressureChart'

const styleSheet = (theme) => ({})

class DrugConsumptionBarChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: 'Complications is added Successfull',
            severity: 'success',
            data: [],
            legendData: [],
            xData: [],
            drugName: [],
            from: '2022-01-01',
            to: '2022-12-31',
            item_id: [],

            filterData: {
                limit: 20,
                page: 0,
                drugName: '',
                item_id: '',
                'item_name[0]': ['updatedAt', 'DESC'],
            },

            formData: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",
                patient_id: window.dashboardVariables.patient_clinic_id,
                widget_id: this.props.widget_id,
                examination_data: [
                    {
                        widget_input_id: this.props.itemId,
                        question: 'inve_lipid_profile',
                        other_answers: {
                            'Total Cholesterol': {
                                test_name: 'Total Cholesterol',
                                value: null,
                                lower_range: 0,
                                upper_range: 200,
                                units: '|mg/dl',
                            },
                            TGL: {
                                test_name: 'TGL',
                                value: null,
                                lower_range: 50,
                                upper_range: 150,
                                units: '|mg/dl',
                            },
                            HDL: {
                                test_name: 'HDL',
                                value: null,
                                lower_range: 60,
                                upper_range: null,
                                units: '|mg/dl',
                            },
                            LDL: {
                                test_name: 'LDL',
                                value: null,
                                lower_range: 0,
                                upper_range: 100,
                                units: '|mg/dl',
                            },
                            VLDL: {
                                test_name: 'VLDL',
                                value: null,
                                lower_range: 10,
                                upper_range: 30,
                                units: '|mg/dl',
                            },
                            'Chol/HDL': {
                                test_name: 'Chol/HDL',
                                value: null,
                                lower_range: 2,
                                upper_range: 5,
                                units: '|mg/dl',
                            },
                        },
                    },
                ],
            },

            columns: [
                {
                    name: 'test_name', // field name in the row object
                    label: 'Test Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'value',
                    label: 'Value',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let rowValue = Object.values(
                                this.state.formData.examination_data[0]
                                    .other_answers
                            )[dataIndex]

                            return (
                                <TextValidator
                                    className="w-10 "
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers[rowValue.test_name]
                                            ?.value
                                    }
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers[
                                            rowValue.test_name
                                        ].value = e.target.value

                                        if (
                                            rowValue.test_name ==
                                                'Total Cholesterol' ||
                                            rowValue.test_name == 'HDL'
                                        ) {
                                            if (
                                                formData.examination_data[0]
                                                    .other_answers[
                                                    'Total Cholesterol'
                                                ].value != null &&
                                                formData.examination_data[0]
                                                    .other_answers['HDL']
                                                    .value != null
                                            ) {
                                                formData.examination_data[0].other_answers[
                                                    'Chol/HDL'
                                                ].value =
                                                    parseFloat(
                                                        formData
                                                            .examination_data[0]
                                                            .other_answers[
                                                            'Total Cholesterol'
                                                        ].value
                                                    ) /
                                                    parseFloat(
                                                        formData
                                                            .examination_data[0]
                                                            .other_answers[
                                                            'HDL'
                                                        ].value
                                                    )
                                            }
                                        }

                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <p className="px-2">
                                                    {
                                                        this.state.formData
                                                            .examination_data[0]
                                                            ?.other_answers[
                                                            rowValue.test_name
                                                        ]?.units
                                                    }
                                                </p>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )
                        },
                    },
                },
                {
                    name: 'lower_range', // field name in the row object
                    label: 'Lower Range', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let rowValue = Object.values(
                                this.state.formData.examination_data[0]
                                    .other_answers
                            )[dataIndex]

                            return (
                                <TextValidator
                                    className="w-10 "
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers[rowValue.test_name]
                                            ?.lower_range
                                    }
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers[
                                            rowValue.test_name
                                        ].lower_range = e.target.value
                                        this.setState({ formData })
                                    }}
                                    // validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            )
                        },
                    },
                },
                {
                    name: 'upper_range', // field name in the row object
                    label: 'Upper Range', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let rowValue = Object.values(
                                this.state.formData.examination_data[0]
                                    .other_answers
                            )[dataIndex]

                            return (
                                <TextValidator
                                    className="w-10 "
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers[rowValue.test_name]
                                            ?.upper_range
                                    }
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers[
                                            rowValue.test_name
                                        ].upper_range = e.target.value
                                        this.setState({ formData })
                                    }}
                                    //validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            )
                        },
                    },
                },
            ],
        }
    }

    static propTypes = {
        onReload: PropTypes.func,
    }

    async loadData() {
        this.setState({
            // loaded: false,
            // data: [],
        })
        let warehouse = await localStorageService.getItem('Login_user_Hospital')
        let params = {
            warehouse_id: warehouse.frontDesk_id,
            type: 'Monthly',
            from: this.state.from,
            to: this.state.to,
            item_id: this.state.filterData.item_id,
        }

        let res = await DashboardReportServices.getBatchConsumption(params)
        console.log('Examination Data ID ', res.config.params.warehouse_id)
        if (200 == res.status) {
            // console.log('Consumption Bar Chart Data', res.data.view)
            // this.setState({ data: [] })
            // let newData = []
            // let legendData = []
            // res.data.view.forEach((element) => {
            //     // if (element.month === 11) {
            //     //     legendData.push(['November'])
            //     // }
            //     newData.push([element.count])
            //     legendData.push([element.month])
            // })

            this.setState({
                // data: newData,
                // legendData: legendData,
                loaded: true,
            })
        }
        console.log('This is Load Data', this.state.data)
    }

    async getData() {
        if (this.state.filterData.item_id != '') {
            this.setState({
                dataLoaded: false,
                // data: [],
            })
            let warehouse_id = await localStorageService.getItem(
                'Login_user_Hospital'
            )
            let params = {
                warehouse_id: warehouse_id.frontDesk_id,
                type: 'Monthly',
                from: this.state.from,
                to: this.state.to,
                item_id: this.state.filterData.item_id,
                // item_id: 'a30cd110-9784-4177-aa35-206f19a00811',
            }

            let res = await DashboardReportServices.getBatchConsumption(params)
            console.log(
                'Examination Data ID Ne ',
                res.config.params.warehouse_id
            )
            if (200 == res.status) {
                console.log('Consumption Bar Chart Data', res.data)
                this.setState({ data: [] })
                let newData = []
                let legendData = []
                res.data.view.forEach((element) => {
                    // if (element.month === 11) {
                    //     legendData.push(['November'])
                    // }
                    newData.push([element.consumption])
                    legendData.push([element.month])
                })
                let xData = []
                let months = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                ]
                legendData.map((data) => {
                    let tempMonth = months[data - 1]
                    xData.push(tempMonth)
                })

                let yData = []
                newData.map((data) => {
                    let tempData
                    tempData = Math.abs(data)
                    yData.push(tempData)
                })

                this.setState({
                    data: yData,
                    legendData: xData,
                    dataLoaded: true,
                })
            }
            console.log('This is Load Data', this.state.data)
        } else {
            console.log('Consumption Bar Chart Data Empty')
        }
    }

    async loadAllItems(search) {
        // let params = { "search": search }
        let data = {
            search: search,
        }
        let filterData = this.state.filterData
        // this.setState({ loaded: false })
        let params = { limit: 10000, page: 0 }
        // let filterData = this.state.filterData
        let res = await InventoryService.fetchAllItems(data)
        console.log('all Con Items', res.data.view.data)

        if (res.status == 200) {
            this.setState({ item_id: res.data.view.data })
        }
        //   console.log('items', this.state.left)
    }

    // async loadAllItems(search) {
    //     // let params = { "search": search }
    //     let data = {
    //         search: search,
    //     }
    //     let filterData = this.state.filterData
    //     // this.setState({ loaded: false })
    //     let params = { limit: 10000, page: 0 }
    //     // let filterData = this.state.filterData
    //     let res = await InventoryService.fetchAllItems(data)
    //     console.log('all Items', res.data.view.data)

    //     if (res.status == 200) {
    //         this.setState({ drugName: res.data.view.data })
    //     }
    //     //   console.log('items', this.state.left)
    // }

    async submit() {
        console.log('formdata', this.state.formData)
        let formData = this.state.formData

        let res = await ExaminationServices.saveData(formData)
        console.log('Investigation Data added', res)
        if (201 == res.status) {
            this.setState(
                {
                    alert: true,
                    message: 'Investigation Data Added Successful',
                    severity: 'success',
                },
                () => {
                    this.loadData()
                    //this.onReload()
                }
            )
        }
    }

    async onReload() {
        const { onReload } = this.props

        onReload && onReload()
    }

    //set input value changes
    componentDidMount() {
        //console.log("item id", Object.values(this.state.formData.examination_data[0].other_answers))
        // this.loadData()
        //this.interval = setInterval(() => this.loadData(), 5000);
    }
    componentWillUnmount() {
        // clearInterval(this.interval);
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        let activeTheme = MatxLayoutSettings.activeTheme

        return (
            <Fragment>
                <div className="w-full">
                    <ValidatorForm
                        onSubmit={() => {
                            this.submit()
                        }}
                        className="w-full"
                    >
                        <Grid container spacing={0} className="my-0">
                            {/* <Grid item xs={12}>
                                <h4 className="w-full flex justify-center">
                                    Drug Consumption
                                </h4>
                            </Grid> */}

                            <Grid className="px-2 py-0" item xs={6}>
                                <LabeledInput
                                    label="From"
                                    name="from"
                                    inputType="date"
                                    onUpdate={
                                        (e) => this.setState({ from: e })
                                        // this.getData()
                                    }
                                    value={this.state.from}
                                />
                            </Grid>
                            <Grid className="px-2 py-0" item xs={6}>
                                <LabeledInput
                                    label="To"
                                    name="to"
                                    inputType="date"
                                    onUpdate={
                                        (e) => this.setState({ to: e })
                                        // this.getData()
                                    }
                                    value={this.state.to}
                                />
                            </Grid>
                            <Grid className="px-2 py-0" item xs={12}>
                                <SubTitle title="Item Name" />
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    // value={this.state.hsco.sr_no}
                                    // options={this.state.sr_no}
                                    options={this.state.item_id}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData =
                                                this.state.filterData
                                            filterData.item_id = value.id
                                            console.log('Item Name', filterData)
                                            this.setState({
                                                filterData,
                                                // srNo:true
                                            })
                                            this.getData()
                                            // let formData = this.state.formData;
                                            // formData.sr_no = value;
                                        }
                                        // else {
                                        //     let filterData = this.state.filterData;
                                        //     filterData.sr_no = null;
                                        //     this.setState({ filterData,
                                        //         srNo:false
                                        //     })
                                        // }
                                    }}
                                    getOptionLabel={
                                        (option) =>
                                            option.item_name !== ''
                                                ? option.long_description
                                                : null
                                        // let hsco =  this.state.hsco
                                        // if ( this.state.sr_no !== '' ) {

                                        // }
                                        // else{
                                        //    hsco.sr_no
                                        // }

                                        // this.state.hsco.sr_no === '' ? option.sr_no+'-'+option.long_description:this.state.hsco.sr_no
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please type Item Name"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                console.log(
                                                    'target value',
                                                    e.target.value
                                                )
                                                if (e.target.value.length > 2) {
                                                    this.loadAllItems(
                                                        e.target.value
                                                    )
                                                    // let hsco =this.state.hsco
                                                    // hsco.sr_no = e.target.value

                                                    //     this.setState({
                                                    //         hsco,
                                                    //        srNo:false
                                                    //    })
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* <Grid item xs={1}>
                                <div className="mt-6">
                                    <LoonsButton
                                        onClick={() => {
                                            let filterData =
                                                this.state.filterData
                                            filterData.item_id = ''
                                            // this.state.item_id = ''
                                            this.setState({
                                                filterData,
                                            })
                                        }}
                                    >
                                        Reset
                                    </LoonsButton>
                                </div>
                            </Grid> */}
                            {/* <Grid item lg={4} md={12} sm={12} xs={12}>
                                <div className="mt-6">
                                    <LoonsButton onClick={() => this.getData()}>
                                        Load Data
                                    </LoonsButton>
                                </div>
                            </Grid> */}
                            <Grid item xs={12}>
                                <div className="my-8">
                                    {this.state.dataLoaded ? (
                                        <Chart
                                            height="400px"
                                            className="mt--10"
                                            legendData={this.state.legendData}
                                            // data={this.state.data}
                                            data={this.state.data}
                                        ></Chart>
                                    ) : null}
                                </div>
                            </Grid>
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
                            variant="filled"
                        ></LoonsSnackbar>
                    </ValidatorForm>
                </div>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(DrugConsumptionBarChart)
