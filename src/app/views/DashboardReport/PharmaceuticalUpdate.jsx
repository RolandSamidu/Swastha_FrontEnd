import React, { Component, Fragment } from 'react'
import {
    Divider, Grid, IconButton, CircularProgress, Tooltip, Dialog,
    RadioGroup,
    TextField,
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
import ItemsBatchView from '../orders/ItemsBatchView'
import PharmacyService from 'app/services/PharmacyService'
import * as appConst from '../../../appconst'
import { Tabs, Tab } from '@mui/material';
import DashboardReportServices from 'app/services/DashboardReportServices'
import { convertTocommaSeparated, dateParse, includesArrayElements, roundDecimal } from 'utils'
import ClinicService from 'app/services/ClinicService'
import ReactToPrint from "react-to-print";
import CategoryService from 'app/services/datasetupServices/CategoryService'
import DistributionCenterServices from 'app/services/DistributionCenterServices'
import StockPositionReport from './Print/stockPositionReport'

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

class PharmaceuticalUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            all_item_category: [],
            allItemUsageTypes: [],
            filterData: {
                search_type: 'StockPositionReport',
                category_id: null,
                priority: null,
                item_usage_type_id:null
            },
            data: null,
            print: false,

            stockData: null,
            copyData: null,

            columns: [
                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stockData[tableMeta.rowIndex]?.sr_no
                        },
                    },
                },
                {
                    name: 'sh_desc',
                    label: 'SH DESC',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stockData[tableMeta.rowIndex]?.medium_description
                        },
                    },
                },
                {
                    name: 'monthy_req',
                    label: 'MONTHY_REQ',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return convertTocommaSeparated(this.state.stockData[tableMeta.rowIndex]?.monthly_requirement, 2)
                        },
                    },
                },
                {
                    name: 'msd_qty',
                    label: 'MSD_QTY',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return convertTocommaSeparated(this.state.stockData[tableMeta.rowIndex]?.msd_quantity, 2)
                        },
                    },
                },
                {
                    name: 'ins_qty',
                    label: 'INS_QTY',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return convertTocommaSeparated(this.state.stockData[tableMeta.rowIndex]?.institute_quantity, 2)
                        },
                    },
                },
                {
                    name: 'national_qty',
                    label: 'NATIONAL_QTY',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return convertTocommaSeparated(this.state.stockData[tableMeta.rowIndex]?.national_quantity, 2)
                        },
                    },
                },
            ]


        }
    }



    async loadCategory() {
        let cat_res = await CategoryService.fetchAllCategories({})
        if (cat_res.status == 200) {
            // console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
    }


    async loadItemUsageTypes() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getItemUsageTypes(params)

        if (res.status == 200) {
            this.setState({ allItemUsageTypes: res.data.view.data })
        }
    }

    async loadData(type, institute, dateRange) {

        this.setState({ loaded: "processing" })
        let filterData = this.state.filterData

        let batch_res = await DistributionCenterServices.getBatchData(filterData)
        if (batch_res.status == 200) {
            let filterd_data = batch_res.data.view.stock_data

            console.log('res Data data', batch_res.data.view)
            this.setState({
                data: batch_res.data.view,
                loaded: true,
                stockData: filterd_data,
                copyData: filterd_data
            })

            console.log('res Data checking', this.state.stockData)
            console.log('copyData checking 1', this.state.copyData)
            
           
           
            console.log('change', this.state.data?.six_months_more[0]?.msd?.E)
            console.log('change', this.state.data?.six_months_more[0]?.msd?.N)


        }
    }


    reloadData(type, institute, dateRange) {

        console.log('select incomming', type, institute, dateRange)
        console.log('copyData checking 2', this.state.copyData)

        let filterd_data
        // this.setState({
        //     stockData:this.state.copyData
        // })
        let data = this.state.copyData
        console.log('copyData checking 3', this.state.copyData)
        if (type === 'E') {
            
            if (institute === 'msd') {
                if (dateRange === 'moreSix') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.msd_months >= 6)
                } else if (dateRange === 'threeSix') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.msd_months < 6 && ele.msd_months >= 3)
                } else if (dateRange === 'twoThree') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.msd_months < 3 && ele.msd_months >= 2)
                } else if (dateRange === 'oneTwo') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.msd_months < 2 && ele.msd_months >= 1)
                } else if (dateRange === 'one') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.msd_months < 1 && ele.msd_months > 0)       
                } else if (dateRange === 'os') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.msd_months == 0)
                }
            } else if (institute === 'ins') {
                if (dateRange === 'moreSix') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.institutuion_months >= 6)
                } else if (dateRange === 'threeSix') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.institutuion_months < 6 && ele.institutuion_months >= 3)
                } else if (dateRange === 'twoThree') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.institutuion_months < 3 && ele.institutuion_months >= 2)
                } else if (dateRange === 'oneTwo') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.institutuion_months < 2 && ele.institutuion_months >= 1)
                } else if (dateRange === 'one') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.institutuion_months < 1 && ele.institutuion_months > 0)
                } else if (dateRange === 'os') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.institutuion_months == 0)
                }
                // filterd_data = batch_res.data.view.stock_data.filter((ele) => ele.ven == type && ele.institutuion_months == 0)
            } else if (institute === 'nat') {
                if (dateRange === 'moreSix') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.national_stocks_moths >= 6)
                } else if (dateRange === 'threeSix') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.national_stocks_moths < 6 && ele.national_stocks_moths >= 3)
                } else if (dateRange === 'twoThree') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.national_stocks_moths < 3 && ele.national_stocks_moths >= 2)
                } else if (dateRange === 'oneTwo') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.national_stocks_moths < 2 && ele.national_stocks_moths >= 1)
                } else if (dateRange === 'one') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.national_stocks_moths < 1 && ele.national_stocks_moths > 0)
                } else if (dateRange === 'os') {
                    filterd_data = data.filter((ele) => (ele.ven == 'E' || ele.ven == 'N') && ele.national_stocks_moths == 0)
                }
                // filterd_data = batch_res.data.view.stock_data.filter((ele) => ele.ven == type && ele.national_stocks_moths == 0)
            }

        } else if (type === 'V' || type === 'N') {

            if (institute === 'msd') {
                if (dateRange === 'moreSix') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.msd_months >= 6)
                } else if (dateRange === 'threeSix') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.msd_months < 6 && ele.msd_months >= 3)
                } else if (dateRange === 'twoThree') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.msd_months < 3 && ele.msd_months >= 2)
                } else if (dateRange === 'oneTwo') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.msd_months < 2 && ele.msd_months >= 1)
                    console.log('hggggghghghhghhhh', data.filter((ele) => ele.ven == type && ele.msd_months < 2 && ele.msd_months >= 1))
                } else if (dateRange === 'one') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.msd_months < 1 && ele.msd_months > 0)
                    
                } else if (dateRange === 'os') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.msd_months == 0)
                }
            } else if (institute === 'ins') {
                if (dateRange === 'moreSix') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.institutuion_months >= 6)
                } else if (dateRange === 'threeSix') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.institutuion_months < 6 && ele.institutuion_months >= 3)
                } else if (dateRange === 'twoThree') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.institutuion_months < 3 && ele.institutuion_months >= 2)
                } else if (dateRange === 'oneTwo') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.institutuion_months < 2 && ele.institutuion_months >= 1)
                } else if (dateRange === 'one') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.institutuion_months < 1 && ele.institutuion_months > 0)
                } else if (dateRange === 'os') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.institutuion_months == 0)
                }
                // filterd_data = batch_res.data.view.stock_data.filter((ele) => ele.ven == type && ele.institutuion_months == 0)
            } else if (institute === 'nat') {
                if (dateRange === 'moreSix') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.national_stocks_moths >= 6)
                } else if (dateRange === 'threeSix') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.national_stocks_moths < 6 && ele.national_stocks_moths >= 3)
                } else if (dateRange === 'twoThree') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.national_stocks_moths < 3 && ele.national_stocks_moths >= 2)
                } else if (dateRange === 'oneTwo') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.national_stocks_moths < 2 && ele.national_stocks_moths >= 1)
                } else if (dateRange === 'one') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.national_stocks_moths < 1 && ele.national_stocks_moths > 0)
                } else if (dateRange === 'os') {
                    filterd_data = data.filter((ele) => ele.ven == type && ele.national_stocks_moths == 0)
                }
                // filterd_data = batch_res.data.view.stock_data.filter((ele) => ele.ven == type && ele.national_stocks_moths == 0)
            }

        } else {
            filterd_data = data
        }

        console.log('filterd_datafilterd_datafilterd_datafilterd_data', filterd_data)
        console.log('filterd_datafilterd_datafilterd', (this.state.data?.six_months_more[0]?.msd?.E),(this.state.data?.six_months_more[0]?.msd?.N))
        console.log('filterd_datafilterd', (this.state.data))

        this.setState({
            stockData: filterd_data
        })

        const mainTableElement = document.getElementById('mainTable');
        mainTableElement.scrollIntoView({ behavior: 'smooth' });

        console.log('copyData checking 4', this.state.copyData)

    }


    async componentDidMount() {
        let user = await localStorageService.getItem('userInfo')
        let owner_id = await localStorageService.getItem('owner_id')

        let login_user_info = await localStorageService.getItem("userInfo");
        this.setState({ user_role: login_user_info.roles })

        this.loadCategory()
        this.loadItemUsageTypes()

    }

    printData() {
        console.log('clicked')

        this.setState({
            print: true
        }, () => {
            this.render()
            document.getElementById('print_presc_00514').click()
        })

        setTimeout(() => {
            this.setState({ print: false });
        }, 5000);

    }



    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                            <Grid
                                container="container"
                                lg={12}
                                md={12}
                                xs={12}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                <Grid item="item">
                                    <Typography variant="h6" className="font-semibold">Stock Position Report</Typography>
                                </Grid>

                            </Grid>
                        </div>
                        <Divider className='mb-3' />

                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.loadData()}
                            onError={() => null}
                        >
                            <Grid container spacing={2}>

                                <Grid className=" w-full" item lg={3} md={3} sm={12} xs={12}>
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


                                <Grid className=" w-full" item lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle title="Item Usage Type" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allItemUsageTypes.filter(
                                            (ele) => ele.status == 'Active'
                                        )}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let filterData =this.state.filterData
                                                    filterData.item_usage_type_id =value.id
                                                this.setState({ filterData })
                                            }
                                            else{
                                                let filterData =this.state.filterData
                                                filterData.item_usage_type_id = null

                                            this.setState({
                                                filterData,
                                            })
                                            }
                                        }}
                                        value={this.state.allItemUsageTypes.find(
                                            (obj) =>obj.id ==this.state.filterData.item_usage_type_id )}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Item Usage Type"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid className=" w-full" item lg={3} md={3} sm={12} xs={12}>
                                    <Button
                                        className="mt-6 mr-2"
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
                                <Grid container className='mb-3' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Grid className=" w-full" item lg={3} md={3} sm={12} xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            onClick={() => this.printData()}
                                            className="mt-6 mr-2"
                                            progress={false}
                                            type="submit"
                                            scrollToTop={false}
                                        // startIcon="save"
                                        >
                                            <span className="capitalize">
                                                Print
                                            </span>
                                        </Button>

                                    </Grid>
                                </Grid>


                                <Grid container ref={(el) => (this.componentRef = el)}>
                                    <Grid item xs={12} >
                                        <table style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <td style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#006666', color: 'white' }}>Ven</td>
                                                    <td style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '25%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#006666', color: 'white' }}>Stock Position</td>
                                                    <td style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#006666', color: 'white' }}>MSD</td>
                                                    <td style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#006666', color: 'white' }}>Institutes</td>
                                                    <td style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#006666', color: 'white' }}>National</td>
                                                    <td style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '15%', fontSize: '14px', fontWeight: '600', textAlign: 'center', padding: '5px', background: '#006666', color: 'white' }}>% Stock availability at MSD</td>
                                                </tr>
                                            </thead>
                                        </table>

                                    </Grid>

                                    <Grid item xs={12} className='mt-5' >
                                        <table style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '100%' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ border: '1px solid black', borderBottom: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#00cc00' }}>Available Stock</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }} >{this.state.data?.six_months_more[0]?.msd?.V + this.state.data?.three_to_six_months[0]?.msd?.V + this.state.data?.two_to_three_months[0]?.msd?.V + this.state.data?.one_to_two_months[0]?.msd?.V + this.state.data?.one_months[0]?.msd?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }} >{this.state.data?.six_months_more[0]?.institute?.V + this.state.data?.three_to_six_months[0]?.institute?.V + this.state.data?.two_to_three_months[0]?.institute?.V + this.state.data?.one_to_two_months[0]?.institute?.V + this.state.data?.one_months[0]?.institute?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }} >{this.state.data?.six_months_more[0]?.national?.V + this.state.data?.three_to_six_months[0]?.national?.V + this.state.data?.two_to_three_months[0]?.national?.V + this.state.data?.one_to_two_months[0]?.national?.V + this.state.data?.one_months[0]?.national?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{(((this.state.data?.six_months_more[0]?.msd?.V + this.state.data?.three_to_six_months[0]?.msd?.V + this.state.data?.two_to_three_months[0]?.msd?.V + this.state.data?.one_to_two_months[0]?.msd?.V + this.state.data?.one_months[0]?.msd?.V) / (this.state.data?.v_stocks?.count) * 100)).toFixed(2)}%</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#66ff66' }}>More than 6 months</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('V', 'msd', 'moreSix')}>{this.state.data?.six_months_more[0]?.msd?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('V', 'ins', 'moreSix')}>{this.state.data?.six_months_more[0]?.institute?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('V', 'nat', 'moreSix')}>{this.state.data?.six_months_more[0]?.national?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>3 to 6 months</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'msd', 'threeSix')}>{this.state.data?.three_to_six_months[0]?.msd?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'ins', 'threeSix')}>{this.state.data?.three_to_six_months[0]?.institute?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'nat', 'threeSix')}>{this.state.data?.three_to_six_months[0]?.national?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}>Vital ({this.state.data?.v_stocks?.count})</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>2 to 3 months</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'msd', 'twoThree')}>{this.state.data?.two_to_three_months[0]?.msd?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'ins', 'twoThree')}>{this.state.data?.two_to_three_months[0]?.institute?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'nat', 'twoThree')}>{this.state.data?.two_to_three_months[0]?.national?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>1 to 2 months</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'msd', 'oneTwo')}>{this.state.data?.one_to_two_months[0]?.msd?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'ins', 'oneTwo')}>{this.state.data?.one_to_two_months[0]?.institute?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'nat', 'oneTwo')}>{this.state.data?.one_to_two_months[0]?.national?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffff66' }}>1 month</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('V', 'msd', 'one')}>{this.state.data?.one_months[0]?.msd?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('V', 'ins', 'one')}>{this.state.data?.one_months[0]?.institute?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('V', 'nat', 'one')}>{this.state.data?.one_months[0]?.national?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid black', borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', fontWeight: '600', padding: '5px', background: '#ff704d' }}>Out of Stocks</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('V', 'msd', 'os')}>{this.state.data?.os[0]?.msd?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('V', 'ins', 'os')}>{this.state.data?.os[0]?.institute?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('V', 'nat', 'os')}>{this.state.data?.os[0]?.national?.V}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }}>{(((this.state.data?.os[0]?.msd?.V) / (this.state.data?.v_stocks?.count) * 100)).toFixed(2)}%</td>
                                                </tr>

                                            </tbody>
                                        </table>

                                    </Grid>

                                    <Grid item xs={12} className='mt-5' >
                                        <table style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '100%' }}>
                                            <tbody>

                                                <tr>
                            
                                                    <td style={{ border: '1px solid black', borderBottom: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#00cc00' }}>Available Stock</td> 
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{(this.state.data?.six_months_more[0]?.msd?.E + this.state.data?.three_to_six_months[0]?.msd?.E + this.state.data?.two_to_three_months[0]?.msd?.E + this.state.data?.one_to_two_months[0]?.msd?.E + this.state.data?.one_months[0]?.msd?.E)+
                                                    (this.state.data?.six_months_more[0]?.msd?.N + this.state.data?.three_to_six_months[0]?.msd?.N + this.state.data?.two_to_three_months[0]?.msd?.N + this.state.data?.one_to_two_months[0]?.msd?.N + this.state.data?.one_months[0]?.msd?.N)}</td>

                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{(this.state.data?.six_months_more[0]?.institute?.E + this.state.data?.three_to_six_months[0]?.institute?.E + this.state.data?.two_to_three_months[0]?.institute?.E + this.state.data?.one_to_two_months[0]?.institute?.E + this.state.data?.one_months[0]?.institute?.E)+
                                                    (this.state.data?.six_months_more[0]?.institute?.N + this.state.data?.three_to_six_months[0]?.institute?.N + this.state.data?.two_to_three_months[0]?.institute?.N + this.state.data?.one_to_two_months[0]?.institute?.N + this.state.data?.one_months[0]?.institute?.N)}</td>

                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{(this.state.data?.six_months_more[0]?.national?.E + this.state.data?.three_to_six_months[0]?.national?.E + this.state.data?.two_to_three_months[0]?.national?.E + this.state.data?.one_to_two_months[0]?.national?.E + this.state.data?.one_months[0]?.national?.E)+
                                                    (this.state.data?.six_months_more[0]?.national?.N + this.state.data?.three_to_six_months[0]?.national?.N + this.state.data?.two_to_three_months[0]?.national?.N + this.state.data?.one_to_two_months[0]?.national?.N + this.state.data?.one_months[0]?.national?.N)}</td>
                                                    
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>
                                                        {((
                                                        (this.state.data?.six_months_more[0]?.msd?.E + this.state.data?.three_to_six_months[0]?.msd?.E + this.state.data?.two_to_three_months[0]?.msd?.E + this.state.data?.one_to_two_months[0]?.msd?.E + this.state.data?.one_months[0]?.msd?.E +this.state.data?.six_months_more[0]?.msd?.N + this.state.data?.three_to_six_months[0]?.msd?.N + this.state.data?.two_to_three_months[0]?.msd?.N + this.state.data?.one_to_two_months[0]?.msd?.N + this.state.data?.one_months[0]?.msd?.N ) 
                                                        /(this.state.data?.E_stocks?.count + this.state.data?.N_stocks?.count))* 100).toFixed(2)}%</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#66ff66' }}>More than 6 months</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('E', 'msd', 'moreSix')}>{(this.state.data?.six_months_more[0]?.msd?.E)+(this.state.data?.six_months_more[0]?.msd?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('E', 'ins', 'moreSix')}>{(this.state.data?.six_months_more[0]?.institute?.E)+(this.state.data?.six_months_more[0]?.institute?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('E', 'nat', 'moreSix')}>{(this.state.data?.six_months_more[0]?.national?.E)+(this.state.data?.six_months_more[0]?.national?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>3 to 6 months</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'msd', 'threeSix')}>{(this.state.data?.three_to_six_months[0]?.msd?.E)+(this.state.data?.three_to_six_months[0]?.msd?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'ins', 'threeSix')}>{(this.state.data?.three_to_six_months[0]?.institute?.E)+(this.state.data?.three_to_six_months[0]?.institute?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'nat', 'threeSix')}>{(this.state.data?.three_to_six_months[0]?.national?.E)+(this.state.data?.three_to_six_months[0]?.national?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}>{this.state.filterData.priority == 'yes' ? "Priority" : "Essential"} ({this.state.data?.E_stocks?.count})</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>2 to 3 months</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'msd', 'twoThree')}>{(this.state.data?.two_to_three_months[0]?.msd?.E)+(this.state.data?.two_to_three_months[0]?.msd?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'ins', 'twoThree')}>{(this.state.data?.two_to_three_months[0]?.institute?.E)+(this.state.data?.two_to_three_months[0]?.institute?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'nat', 'twoThree')}>{(this.state.data?.two_to_three_months[0]?.national?.E)+(this.state.data?.two_to_three_months[0]?.national?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>1 to 2 months</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'msd', 'oneTwo')}>{(this.state.data?.one_to_two_months[0]?.msd?.E)+(this.state.data?.one_to_two_months[0]?.msd?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'ins', 'oneTwo')}>{(this.state.data?.one_to_two_months[0]?.institute?.E)+(this.state.data?.one_to_two_months[0]?.institute?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'nat', 'oneTwo')}>{(this.state.data?.one_to_two_months[0]?.national?.E)+(this.state.data?.one_to_two_months[0]?.national?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffff66' }}>1 month</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('E', 'msd', 'one')}>{(this.state.data?.one_months[0]?.msd?.E)+(this.state.data?.one_months[0]?.msd?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('E', 'ins', 'one')}>{(this.state.data?.one_months[0]?.institute?.E)+(this.state.data?.one_months[0]?.institute?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('E', 'nat', 'one')}>{(this.state.data?.one_months[0]?.national?.E)+(this.state.data?.one_months[0]?.national?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid black', borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', fontWeight: '600', padding: '5px', background: '#ff704d' }}>Out of Stocks</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('E', 'msd', 'os')}>{(this.state.data?.os[0]?.msd?.E)+(this.state.data?.os[0]?.msd?.N)}</td> 
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('E', 'ins', 'os')}>{(this.state.data?.os[0]?.institute?.E)+(this.state.data?.os[0]?.institute?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('E', 'nat', 'os')}>{(this.state.data?.os[0]?.national?.E)+(this.state.data?.os[0]?.national?.N)}</td>
                                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }}>{(
                                                        (this.state.data?.os[0]?.msd?.E + this.state.data?.os[0]?.msd?.N)/(this.state.data?.E_stocks?.count + this.state.data?.N_stocks?.count)*100).toFixed(2)}%</td>
                                                </tr>

                                            </tbody>
                                        </table>

                                    </Grid>

                                    {this.state.filterData.priority != "yes" ?
                                        <Grid item xs={12} className='mt-5' >
                                            <table style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '100%' }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ border: '1px solid black', borderBottom: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffd066' }}></td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#00cc00' }}>Available Stock</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{this.state.data?.six_months_more[0]?.msd?.N + this.state.data?.three_to_six_months[0]?.msd?.N + this.state.data?.two_to_three_months[0]?.msd?.N + this.state.data?.one_to_two_months[0]?.msd?.N + this.state.data?.one_months[0]?.msd?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{this.state.data?.six_months_more[0]?.institute?.N + this.state.data?.three_to_six_months[0]?.institute?.N + this.state.data?.two_to_three_months[0]?.institute?.N + this.state.data?.one_to_two_months[0]?.institute?.N + this.state.data?.one_months[0]?.institute?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{this.state.data?.six_months_more[0]?.national?.N + this.state.data?.three_to_six_months[0]?.national?.N + this.state.data?.two_to_three_months[0]?.national?.N + this.state.data?.one_to_two_months[0]?.national?.N + this.state.data?.one_months[0]?.national?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{(((this.state.data?.six_months_more[0]?.msd?.N + this.state.data?.three_to_six_months[0]?.msd?.N + this.state.data?.two_to_three_months[0]?.msd?.N + this.state.data?.one_to_two_months[0]?.msd?.N + this.state.data?.one_months[0]?.msd?.N) / (this.state.data?.N_stocks?.count) * 100)).toFixed(2)}%</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffd066' }}></td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#66ff66' }}>More than 6 months</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('N', 'msd', 'moreSix')}>{this.state.data?.six_months_more[0]?.msd?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('N', 'ins', 'moreSix')}>{this.state.data?.six_months_more[0]?.institute?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('N', 'nat', 'moreSix')}>{this.state.data?.six_months_more[0]?.national?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffd066' }}></td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>3 to 6 months</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'msd', 'threeSix')}>{this.state.data?.three_to_six_months[0]?.msd?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'ins', 'threeSix')}>{this.state.data?.three_to_six_months[0]?.institute?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'nat', 'threeSix')}>{this.state.data?.three_to_six_months[0]?.national?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffd066' }}>Non-Essential ({this.state.data?.N_stocks?.count})</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>2 to 3 months</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'msd', 'twoThree')}>{this.state.data?.two_to_three_months[0]?.msd?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'ins', 'twoThree')}>{this.state.data?.two_to_three_months[0]?.institute?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'nat', 'twoThree')}>{this.state.data?.two_to_three_months[0]?.national?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffd066' }}></td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>1 to 2 months</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'msd', 'oneTwo')}>{this.state.data?.one_to_two_months[0]?.msd?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'ins', 'oneTwo')}>{this.state.data?.one_to_two_months[0]?.institute?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'nat', 'oneTwo')}>{this.state.data?.one_to_two_months[0]?.national?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffd066' }}></td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffff66' }}>1 month</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('N', 'msd', 'one')}>{this.state.data?.one_months[0]?.msd?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('N', 'ins', 'one')}>{this.state.data?.one_months[0]?.institute?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('N', 'nat', 'one')}>{this.state.data?.one_months[0]?.national?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ border: '1px solid black', borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffd066' }}></td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', fontWeight: '600', padding: '5px', background: '#ff704d' }}>Out of Stocks</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('N', 'msd', 'os')}>{this.state.data?.os[0]?.msd?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('N', 'ins', 'os')}>{this.state.data?.os[0]?.institute?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('N', 'nat', 'os')}>{this.state.data?.os[0]?.national?.N}</td>
                                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }}>{(((this.state.data?.os[0]?.msd?.N) / (this.state.data?.N_stocks?.count) * 100)).toFixed(2)}%</td>
                                                    </tr>

                                                </tbody>
                                            </table>

                                        </Grid>
                                        : null}



                                    {/* <Grid item xs={12} className='mt-5' >
                                        <table style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '100%' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}></td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ebebeb' }}>Item Lists</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}></td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', fontWeight: '600', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>MSD_QTY</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', fontWeight: '600', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>INS_QTY</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', fontWeight: '600', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>NATIONAL_QTY</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}>Catogory</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '25%', fontSize: '16px', fontWeight: '600', padding: '5px' }}>Essential</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}></td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}>{this.state.data?.E_stocks?.msd}</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}>{this.state.data?.E_stocks?.institute}</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}>{this.state.data?.E_stocks?.national}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>Stock Position </td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ebebeb' }}>3 to 6 months</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}></td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>{this.state.data?.three_to_six_months[0]?.msd?.E}</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>{this.state.data?.three_to_six_months[0]?.institute?.E}</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>{this.state.data?.three_to_six_months[0]?.national?.E}</td>

                                                </tr>


                                            </tbody>
                                        </table>

                                    </Grid>


                                    <Grid item xs={12} className='mt-5' >
                                        <table style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '100%' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}></td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ebebeb' }}>Item Lists</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}></td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', fontWeight: '600', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>MSD_QTY</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', fontWeight: '600', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>INS_QTY</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', fontWeight: '600', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>NATIONAL_QTY</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}>Catogory</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '25%', fontSize: '16px', fontWeight: '600', padding: '5px' }}>Vital</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}></td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}>{this.state.data?.v_stocks?.msd}</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}>{this.state.data?.v_stocks?.institute}</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}>{this.state.data?.v_stocks?.national}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>Stock Position </td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ebebeb' }}>3 to 6 months</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}></td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>{this.state.data?.three_to_six_months[0]?.msd?.V}</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>{this.state.data?.three_to_six_months[0]?.institute?.V}</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>{this.state.data?.three_to_six_months[0]?.national?.V}</td>

                                                </tr>


                                            </tbody>
                                        </table>

                                    </Grid>

                                    <Grid item xs={12} className='mt-5' >
                                        <table style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '100%' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}></td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ebebeb' }}>Item Lists</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}></td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', fontWeight: '600', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>MSD_QTY</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', fontWeight: '600', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>INS_QTY</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', fontWeight: '600', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>NATIONAL_QTY</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}>Catogory</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '25%', fontSize: '16px', fontWeight: '600', padding: '5px' }}>Non-Essential</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}></td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}>{this.state.data?.N_stocks?.msd}</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}>{this.state.data?.N_stocks?.institute}</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px' }}>{this.state.data?.N_stocks?.national}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>Stock Position </td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ebebeb' }}>3 to 6 months</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}></td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>{this.state.data?.three_to_six_months[0]?.msd?.N}</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>{this.state.data?.three_to_six_months[0]?.institute?.N}</td>
                                                    <td style={{ border: '1px solid #6a93d5', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ebebeb' }}>{this.state.data?.three_to_six_months[0]?.national?.N}</td>

                                                </tr>


                                            </tbody>
                                        </table>

                                    </Grid>
 */}
                                    {/* <Grid container>
                                        <ValidatorForm
                                            className="pt-2"
                                            ref={'outer-form'}
                                            ///onSubmit={() => this.setPage(0)}
                                            onError={() => null}
                                        >
                                            <Grid>
                                                <SubTitle title="Search" />
                                                <TextValidator
                                                    className="w-full"
                                                    placeholder="Search"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth"
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.formData.search}
                                                    onChange={(e, value) => {
                                                        let formData = this.state.formData
                                                        formData.search = e.target.value
                                                        this.setState({ formData })
                                                        console.log(
                                                            'form dat',
                                                            this.state.formData
                                                        )
                                                    }}
                                                    InputProps={{}}
                                             
                                                />
                                            </Grid>

                                        </ValidatorForm>
                                    </Grid> */}

                                    <Grid item xs={12} className='mt-5 mainTable' id='mainTable'>
                                        <LoonsTable
                                            options={{
                                                searchOpen: true,
                                                searchAlwaysOpen: true,
                                                searchPlaceholder: "Search keyword",
                                                customSearchRender: (searchText, handleSearch) => {
                                                    return (
                                                        <TextField
                                                            className='ml--5 w-400'
                                                            placeholder="Search"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={searchText}
                                                            onChange={(e) => {
                                                                console.log("as", e.target.value)
                                                                handleSearch(e.target.value)


                                                            }}

                                                        />

                                                    );
                                                },
                                                pagination: true,
                                                serverSide: false,
                                                // count: this.state.totalItems,
                                                rowsPerPage: 20,
                                                page: 0,
                                                print: true,
                                                viewColumns: true,
                                                // download: true,
                                                download: 'csv',
                                                downloadOptions: {
                                                    pageLimit: 0, // Set to 0 to include all pages
                                                },
                                                // onTableChange: (action, tableState) => {
                                                //     console.log(action, tableState)
                                                //     switch (action) {
                                                //         case 'changePage':
                                                //             this.setPage(tableState.page)
                                                //             break
                                                //         case 'sort':
                                                //             // this.sort(tableState.page, tableState.sortOrder);
                                                //             break
                                                //         default:
                                                //             console.log('action not handled.')
                                                //     }
                                                // }
                                            }}
                                            data={this.state.stockData}
                                            columns={this.state.columns} />
                                    </Grid>

                                    {this.state.print ?
                                        <Grid>
                                            <StockPositionReport data={this.state.data}></StockPositionReport>
                                        </Grid>
                                        : null}

                                </Grid>
                            </>
                            : this.state.loaded == "processing" &&
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress size={30} />
                                <Typography variant="h5">Please wait. Your report is being prepared...</Typography>
                            </Grid>
                        }

                        {/* content end here */}

                    </LoonsCard>
                </MainContainer>
            </Fragment >
        )
    }
}

export default withStyles(styleSheet)(PharmaceuticalUpdate)
