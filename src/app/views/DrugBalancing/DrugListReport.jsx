import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import {
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    CircularProgress,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    Typography,
    Box,
} from '@material-ui/core'
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
    PrintDataTable,
} from 'app/components/LoonsLabComponents'
import FeedIcon from '@mui/icons-material/Feed';
import CloseIcon from '@material-ui/icons/Close';
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import AppsIcon from '@mui/icons-material/Apps';
import { withStyles } from '@material-ui/core/styles'
import ApartmentIcon from '@material-ui/icons/Apartment'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import DistributionCenterServices from 'app/services/DistributionCenterServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from 'app/services/WarehouseServices'
import { element } from 'prop-types'
import { dateParse, dateTimeParse } from 'utils'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import { date } from 'yup/lib/locale'
import moment from 'moment'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import { tickStep } from 'd3'

const drawerWidth = 270;
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

    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: "#bad4ec"
        // backgroundColor: themeColors['whiteBlueTopBar'].palette.primary.main
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth - 80}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        //padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: -80,
    },
})

class DrugListReport extends Component {
    csvLink = React.createRef()
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            activeTab: 0,
            activeSecondaryTab: 0,
            selected_warehouse: null,
            selected_warehouse_name: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            loaded: false,
            loading:false,
            printLoaded: false,
            confirmingDialog: false,
            dateTime:dateTimeParse(new Date()),
            loginUser:null,
            filterData: {
                countable: true,
                from: null,
                to: null,
                limit: 20,
                page: 0,
                warehouse_id: null,
                search_type: 'drug balancing',
                orderby_sr: true
            },
            filterData2:{
                page:0,
                limit:20,
            },
            formData: {},
            totalItems: 0,
            totalItems2:0,
             data2:[],
             rowData:[],
             selected_item:[],
            data: [],
            printData: [],
            tableVisibility: false,
            columns: [
                {
                    name: 'name',
                    label: 'Name',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex].medium_description
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'code',
                    label: 'Code',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].sr_no
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'batch_number',
                    label: 'Batch No.',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].batch_no
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'pnb',
                    label: 'P/B',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex].previous_balance
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'dnt',
                    label: 'D/T',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Dataentering
                            if (data == null || data == '') {
                                return <p>{'-'}</p>
                            } else {
                                return <p>{data}</p>
                            }
                        },
                    },
                },
                {
                    name: 'orders',
                    label: 'Orders In',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]['Order Recieve']
                            if (data == null || data == '') {
                                return <p>{'-'}</p>
                            } else {
                                return <p>{data}</p>
                            }
                        },
                    },
                },
                {
                    name: 'orders',
                    label: 'Orders Out',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]['Order issue']
                            if (data == null || data == '') {
                                return <p>{'-'}</p>
                            } else {
                                return <p>{data}</p>
                            }
                        },
                    },
                },
                {
                    name: 'returns',
                    label: 'Returns',
                    options: {
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]['Order Recieve']
                            if (data == null || data == '') {
                                return <p>{'-'}</p>
                            } else {
                                return <p>{data}</p>
                            }
                        },
                    },
                },
                {
                    name: 'exchanges_in',
                    label: 'Exchanges In',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex].Exchange_Recieve
                            if (data == null || data == '') {
                                return <p>{'-'}</p>
                            } else {
                                return <p>{data}</p>
                            }
                        },
                    },
                },
                {
                    name: 'exchanges_out',
                    label: 'Exchanges Out',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex].Exchange_Issuance
                            if (data == null || data == '') {
                                return <p>{'-'}</p>
                            } else {
                                return <p>{data}</p>
                            }
                        },
                    },
                },
                {
                    name: 'system_dispences',
                    label: 'System Dispences',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Issuing
                            if (data == null || data == '') {
                                return <p>{'-'}</p>
                            } else {
                                return <p>{data}</p>
                            }
                        },
                    },
                },
                {
                    name: 'opd_md',
                    label: 'OPD(Manual) ',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].OPD_manual
                            if (data == null || data == '') {
                                return <p>{'-'}</p>
                            } else {
                                return <p>{data}</p>
                            }
                        },
                    },
                },

                {
                    name: 'clinic_md',
                    label: 'Clinic(Manual)',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Clinic_manual
                            if (data == null || data == '') {
                                return <p>{'-'}</p>
                            } else {
                                return <p>{data}</p>
                            }
                        },
                    },
                },
                {
                    name: 'ward_md',
                    label: 'Ward(Manual) ',
                    options: {
                        display: true,
                        
                        customBodyRenderLite: (dataIndex) => {
                        
                            let data = this.state.data[dataIndex].Ward_manual
                            if (data == null || data == '') {
                                return <p>{'-'}</p>
                            } else {
                                return <p>{data}</p>
                            }
                        },
                    },
                },
                {
                    name: 'waste',
                    label: 'Waste',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Waste
                            if (data == null || data == '') {
                                return <p>{'-'}</p>
                            } else {
                                return <p>{data}</p>
                            }
                        },
                    },
                },

                //     <DataGrid columns ={[{ field: 'username', width: 200 }, { field: 'age' }]}
                //     rows={rows}
                //        />
                // },
                {
                    name: 'excess',
                    label: 'Excess',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Excess_manual
                            if (data == null || data == '') {
                                return <p>{'-'}</p>
                            } else {
                                return <p>{data}</p>
                            }
                        },
                    },
                },
                {
                    name: 'balance_counted',
                    label: 'Balance(Counted)',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                parseFloat(
                                    this.state.data[dataIndex].Dataentering
                                        ? this.state.data[dataIndex]
                                            .Dataentering
                                        : 0
                                ) +
                                parseFloat(
                                    this.state.data[dataIndex].previous_balance
                                        ? this.state.data[dataIndex]
                                            .previous_balance
                                        : 0
                                ) +
                                parseFloat(
                                    this.state.data[dataIndex].Issuing
                                        ? this.state.data[dataIndex].Issuing
                                        : 0
                                ) + 
                                parseFloat(
                                    this.state.data[dataIndex]['Order Recieve']
                                        ? this.state.data[dataIndex][
                                        'Order Recieve'
                                        ]
                                        : 0
                                ) +
                                parseFloat(
                                    this.state.data[dataIndex]['Order issue']
                                        ? this.state.data[dataIndex][
                                        'Order issue'
                                        ]
                                        : 0
                                ) +
                                parseFloat(
                                    this.state.data[dataIndex].Exchange_Recieve
                                        ? this.state.data[dataIndex]
                                            .Exchange_Recieve
                                        : 0
                                ) +
                                parseFloat(
                                    this.state.data[dataIndex].Exchange_Issuance
                                        ? this.state.data[dataIndex]
                                            .Exchange_Issuance
                                        : 0
                                ) +
                                //parseFloat(this.state.data[dataIndex].Issuing ? this.state.data[dataIndex].Issuing : 0) +
                                parseFloat(
                                    this.state.data[dataIndex].OPD_manual
                                        ? this.state.data[dataIndex].OPD_manual
                                        : 0
                                ) +
                                parseFloat(
                                    this.state.data[dataIndex].Clinic_manual
                                        ? this.state.data[dataIndex]
                                            .Clinic_manual
                                        : 0
                                ) +
                                parseFloat(
                                    this.state.data[dataIndex].Ward_manual
                                        ? this.state.data[dataIndex].Ward_manual
                                        : 0
                                ) +
                                parseFloat(
                                    this.state.data[dataIndex].Waste
                                        ? this.state.data[dataIndex].Waste
                                        : 0
                                ) +
                                parseFloat(
                                    this.state.data[dataIndex].Excess_manual
                                        ? this.state.data[dataIndex]
                                            .Excess_manual
                                        : 0
                                )

                            if (data == null || data == '') {
                                return <p>{'-'}</p>
                            } else {
                                return <p>{data}</p>
                            }
                        },
                    },
                },
                {
                    name: 'status',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                <Tooltip title="Manually Changed Records">
                                <AppsIcon
                                
                                    // className="text-black"
                                    onClick={(selected_item) => {
                                        //let id=this.state.outgoing[tableMeta.rowIndex].order_exchange_id;
                                        // console.log(
                                        //     'aaaaaa',
                                        //     this.state.data[tableMeta.rowIndex]
                                        //         .batch_id
                                        // )
                                        // let id =
                                        //     this.state.data[tableMeta.rowIndex]
                                        //         .batch_id
                                        // window.location =
                                        //     '/drugbalancing/druglist/report/history/' +
                                        //     id
                                        
                                        this.loadDrugBalancingData(this.state.data[tableMeta.rowIndex])
                                        
                                        this.setState({
                                            confirmingDialog: true,
                                            selected_item:this.state.data[tableMeta.rowIndex]
                                             }
                                        
                                        )
                                        
                                        }}
                                >
                                    <Icon color="secondary">visibility</Icon>
                                </AppsIcon>
                                </Tooltip>
                                <Grid className="px-2">
                                <Tooltip title="Detailed View">
                                        <FeedIcon
                                            className="w-full"
                                            onClick={() => {
                                                window.location = `/drugbalancing/detailedview/
                                                ${this.state.data[tableMeta.rowIndex].item_batch_id}
                                                    ?from=${this.state.filterData.from}
                                                    &to=${this.state.filterData.to}
                                                    &batch_id=${this.state.data[tableMeta.rowIndex].batch_id}`
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                          
                                        </FeedIcon>
                                    </Tooltip>
                                </Grid>
                                </Grid>
                                
                            )
                        },
                    },
                },

                {
                    name: 'comments',
                    label: 'Comments',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <div style={{ width: 100 }}>
                                        <TextValidator
                                            //className=" w-full"
                                            placeholder="0"
                                            name="Comment"
                                            InputLabelProps={{ shrink: false }}
                                            //value={this.state.formData.phn}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => { }}
                                        /* validators={['matchRegexp:^\s*([0-9a-zA-Z]*)\s*$']}
                            errorMessages={[
                                'Invalid Inputs',
                            ]} */
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                },
            ],
            columns2: [
               
                {
                    name: 'opd_md',
                    label: 'OPD(Manual) ',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data2[dataIndex]?.opd
                           
                                return <p>{"-"+data}</p>
                            
                        },
                    },
                },

                {
                    name: 'clinic_md',
                    label: 'Clinic(Manual)',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data2[dataIndex]?.clinic
                            
                                return <p>{"-"+data}</p>
                            
                        },
                    },
                },
                {
                    name: 'ward_md',
                    label: 'Ward(Manual) ',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data2[dataIndex]?.ward
                           
                                return <p>{"-"+data}</p>
                            
                        },
                    },
                },
                {
                    name: 'waste',
                    label: 'Waste',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data2[dataIndex]?.waste
                           
                                return <p>{"-"+data}</p>
                            
                        },
                    },
                },


                {
                    name: 'excess',
                    label: 'Excess',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data2[dataIndex]?.excess
                            
                                return <p>{data}</p>
                            
                        },
                    },
                },
                
                {
                    name: 'remark',
                    label: 'Remark',
                    options: {
                        filter: true,
                        
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data2[dataIndex]?.remark
                            
                                return <p>{data}</p>
                            
                        },
                        },
                    },
                
               

                {
                    name: 'comments',
                    label: 'Comments',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <div style={{ width: 100 }}>
                                        <TextValidator
                                            //className=" w-full"
                                            placeholder="0"
                                            name="Comment"
                                            InputLabelProps={{ shrink: false }}
                                            //value={this.state.formData.phn}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => { }}
                                        /* validators={['matchRegexp:^\s*([0-9a-zA-Z]*)\s*$']}
                            errorMessages={[
                                'Invalid Inputs',
                            ]} */
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                },
            ],
            headers: [
                { label: 'First Name', key: 'firstname' },
                { label: 'Last Name', key: 'lastname' },
                { label: 'Email', key: 'email' },
            ],

            csv_data: [],
        }
    }

    async loadDrugBalancingData(rowData) {
        this.setState({ loading2: false })
        console.log("rowdata",rowData)
        var sw = await localStorageService.getItem('Selected_Warehouse')
       
        let params = {
            warehouse_id:sw.id,
            to:this.state.filterData.to,
            from:this.state.filterData.from,
            item_batch_id:rowData.batch_id,
            page:this.state.filterData2.page,
            limit:this.state.filterData2.limit

        }
        
        let batch_res = await WarehouseServices.getDrugBalancing(params)
        if (batch_res.status == 200) {
            let data2 = batch_res.data.view.data

            this.setState({
                data2: batch_res.data.view.data,
                totalItems2: batch_res.data.view.totalItems,
            })
            console.log('Batch Data3', this.state.data2)
            this.setState({loading: true })
        }
    }   

    async getUser (){
        var user = await localStorageService.getItem('userInfo')
        console.log('usloginUserer', user.name)
        this.setState({loginUser: user.name})
    }

    
    async loadWarehouses() {
        this.setState({ Loaded: false })
        var user = await localStorageService.getItem('userInfo')
        console.log('user', user)
        var id = user.id
        var all_pharmacy_dummy = []
        var selected_warehouse_cache = await localStorageService.getItem(
            'Selected_Warehouse'
        )
        if (!selected_warehouse_cache) {
            this.setState({ dialog_for_select_warehouse: true })
        } else {
            // this.state.genOrder.created_by = id
            // this.state.genOrder.warehouse_id = selected_warehouse_cache.id
            // this.state.getCartItems.warehouse_id = selected_warehouse_cache.id
            // this.state.suggestedWareHouses.warehouse_id = selected_warehouse_cache.id
            // this.state.formData.owner_id = selected_warehouse_cache.owner_id
            let filterData = this.state.filterData
            filterData.warehouse_id = selected_warehouse_cache.id
            this.setState(
                {
                    owner_id: selected_warehouse_cache.owner_id,
                    selected_warehouse: selected_warehouse_cache.id,
                    selected_warehouse_name: selected_warehouse_cache.name,
                    dialog_for_select_warehouse: false,
                    warehouseSelectDone: true,
                    filterData,
                },
                () => {
                    this.loadData()
                }
            )
            console.log(this.state.selected_warehouse)
        }
        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params)
        if (res.status == 200) {
            console.log('warehouseUsers', res.data.view.data)

            res.data.view.data.forEach((element) => {
                all_pharmacy_dummy.push({
                    warehouse: element.Warehouse,
                    name: element.Warehouse.name,
                    main_or_personal: element.Warehouse.main_or_personal,
                    owner_id: element.Warehouse.owner_id,
                    id: element.warehouse_id,
                    pharmacy_drugs_stores_id:
                        element.Warehouse.pharmacy_drugs_store_id,
                })
            })
            console.log('warehouse', all_pharmacy_dummy)
            this.setState({
                all_warehouse_loaded: all_pharmacy_dummy,
                Loaded: true,
            })
        }
    }
    async loadData() {
        this.setState({ loaded: false })

        console.log('filterdata', this.state.filterData)
        let params = this.state.filterData
        let batch_res = await WarehouseServices.getDrugReport(params)
        if (batch_res.status == 200) {
            this.setState({
                data: batch_res.data.view.data,
                totalItems: batch_res.data.view.totalItems,
                totalPages: batch_res.data.view.totalPages,
                loaded: true,
            })
            console.log('Batch Data Drug', this.state.data)
        }
    }
    async printData() {
        this.setState({ printLoaded: false })

        console.log('filterdata', this.state.filterData)
        let params = this.state.filterData
        delete params.limit
        delete params.page
        let batch_res = await WarehouseServices.getDrugReport(params)
        if (batch_res.status == 200) {
            this.setState(
                {
                    printData: batch_res.data.view.data,
                    totalItems: batch_res.data.view.totalItems,
                    totalPages: batch_res.data.view.totalPages,
                    printLoaded: true,
                },
                () => {
                    document.getElementById('print_button_001').click()
                }
            )
            console.log('Print Data', batch_res)
        }
    }
    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }

    async setPageTwo(page) {
        //Change paginations
        let filterData2 = this.state.filterData2
        filterData2.page = page
        this.setState(
            {
                filterData2,
            },
            () => {
                this.loadDrugBalancingData(this.state.selected_item)
                
            }
        )
    }

    componentDidMount() {
        let today = moment()

        let tomorrow = moment().add(1, 'days')

        let yesterday = moment().add(-1, 'days')
        let filterData = this.state.filterData
        filterData.from = dateParse(today)
        filterData.to = dateParse(tomorrow)
        this.setState(
            {
                filterData,
            },
            () => {
                // this.loadData()
            }
        )
        this.loadWarehouses()
        this.getUser()
        
    }

    async exportToCSV() {
        this.setState({ loaded: false })

        console.log('filterdata', this.state.filterData)
        let params = this.state.filterData
        params.limit = 500
        params.page = 0

        let batch_res = await WarehouseServices.getDrugReport(params)
        if (batch_res.status == 200) {
            this.setState(
                {
                    csv_data: batch_res.data.view.data,
                },
                () => {
                    this.csvLink.current.link.click()
                }
            )
            console.log('Batch Data', this.state.csv_data)
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        {/* <CardTitle title="My Orders" /> */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            {' '}
                            <Typography variant="h6" className="font-semibold">
                                Drug Report
                            </Typography>
                            <Grid
                                className='pt-3 pr-3'
                            >
                                <Typography>{this.state.selected_warehouse_name !== null ? "You're in "+ this.state.selected_warehouse_name : null}</Typography>
                            </Grid>
                            <Button
                                color="primary"
                                onClick={() => {
                                    this.setState({
                                        dialog_for_select_warehouse: true,
                                        Loaded: false,
                                    })
                                }}
                            >
                                <ApartmentIcon />
                                {/* {loaded ? selectedWarehouse.name : 'Chanage Warehouse'} */}
                                Change Warehouse
                            </Button>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'left',
                                justifyContent: 'space-between',
                            }}
                        >
                            <ValidatorForm
                                onSubmit={() => {
                                    this.loadData()
                                }}
                            >
                                <Grid
                                    container
                                    spacing={1}
                                    // className="space-between "
                                >
                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                        <SubTitle title="From" />

                                        <DatePicker
                                            className="w-full"
                                            value={this.state.filterData.from}
                                            placeholder="Date From"
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={(date) => {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.from = dateParse(date)
                                                this.setState({ filterData })
                                            }}
                                        />
                                    </Grid>
                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                        <SubTitle title="To" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.filterData.to}
                                            placeholder="To Date"
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={(date) => {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.to = dateParse(date)
                                                this.setState({ filterData })
                                            }}
                                        />
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                    <SubTitle title="Search" />
                                        <TextValidator
                                            className="w-full "
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.filterData.search
                                            }
                                            onChange={(e) => {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.search = e.target.value
                                                this.setState({ filterData })
                                            }}
                                            placeholder="Search by Item Name or SR"
                                        // validators={['required']}
                                        //errorMessages={['this field is required']}
                                        />       
                                    </Grid>
                                    <Grid item lg={1} md={1} sm={12} xs={12}>
                                            <LoonsButton  className="mt-6" type={'submit'}>
                                                Search{' '}
                                            </LoonsButton>
                                        </Grid>
                                        
                                    {/* <Grid item lg={6} md={6} sm={6} xs={12}>
                                      
                                    </Grid>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'left',
                                            justifyContent: 'space-between',
                                            marginTop: '30px',
                                        }}
                                    >
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <LoonsButton type={'submit'}>
                                                Search{' '}
                                            </LoonsButton>
                                        </Grid>
                                    </div> */}
                                </Grid>
                            </ValidatorForm>
                        </div>
                        <Grid container className="mt-4 pb-5">
                            <Grid item lg={9} md={8} sm={6} xs={6}></Grid>
                            <Grid
                                className="flex justify-end"
                                item
                                lg={3}
                                md={4}
                                sm={6}
                                xs={6}
                            >
                                <Button
                                    onClick={() => this.printData()}
                                    size="small"
                                    startIcon="print"
                                    progress={this.state.printLoaded}
                                >
                                    Print
                                </Button>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                {this.state.printLoaded ? (
                                    <div className="hidden">
                                        <PrintDataTable
                                            title="Drug Report"
                                            dateTime= {this.state.dateTime}
                                            loginUser= {this.state.loginUser}
                                            // printFunction={this.printData()}
                                            from={dateParse(
                                                this.state.filterData.from
                                            )}
                                            to={dateParse(
                                                this.state.filterData.to
                                            )}
                                            invisibleTable={true}
                                            data={this.state.printData}
                                            tableHeaders={[
                                                {
                                                    name: 'medium_description',
                                                    label: 'Name',
                                                },
                                                {
                                                    name: 'sr_no',
                                                    label: 'Code',
                                                },
                                                {
                                                    name: 'batch_no',
                                                    label: 'Batch No.',
                                                },
                                                {
                                                    name: 'previous_balance',
                                                    label: 'P/B',
                                                },
                                                {
                                                    name: 'Issuing',
                                                    label: 'D/T',
                                                },
                                                {
                                                    name: ['Order Recieve'],
                                                    label: 'Order',
                                                },
                                                {
                                                    name: ['Order Recieve'],
                                                    label: 'Returns',
                                                },
                                                {
                                                    name: 'Exchange_Recieve',
                                                    label: 'Exchanges In',
                                                },
                                                {
                                                    name: 'Exchange_Issuance',
                                                    label: 'Exchanges Out',
                                                },
                                                {
                                                    name: 'Issuing',
                                                    label: 'System Dispenses',
                                                },
                                                {
                                                    name: 'OPD_manual',
                                                    label: 'OPD(Manual)',
                                                },
                                                {
                                                    name: 'Clinic_manual',
                                                    label: 'Clinic(Manual)',
                                                },
                                                {
                                                    name: 'Ward_manual',
                                                    label: 'Ward(Manual)',
                                                },
                                                {
                                                    name: 'Waste',
                                                    label: 'Waste',
                                                },
                                                {
                                                    name: 'Excess_manual',
                                                    label: 'Excess',
                                                },
                                                {
                                                    name: 'balance_counted',
                                                    label: 'Balance Counted',
                                                },
                                                {
                                                    name: 'comments',
                                                    label: 'Comments',
                                                },
                                            ]}
                                            tableStructure={[
                                                {
                                                    name: 'medium_description',
                                                },
                                                {
                                                    name: 'sr_no',
                                                },
                                                {
                                                    name: 'batch_no',
                                                },
                                                {
                                                    name: 'previous_balance',
                                                },
                                                {
                                                    name: 'Issuing',
                                                },
                                                {
                                                    name: ['Order Recieve'],
                                                },
                                                {
                                                    name: ['Order Recieve'],
                                                },
                                                {
                                                    name: 'Exchange_Recieve',
                                                },
                                                {
                                                    name: 'Exchange_Issuance',
                                                },
                                                {
                                                    name: 'Issuing',
                                                },
                                                {
                                                    name: 'OPD_manual',
                                                },
                                                {
                                                    name: 'Clinic_manual',
                                                },
                                                {
                                                    name: 'Ward_manual',
                                                },
                                                {
                                                    name: 'Waste',
                                                },
                                                {
                                                    name: 'Excess_manual',
                                                },
                                                {
                                                    name: 'balance_counted',
                                                },
                                                {
                                                    name: 'comments',
                                                },
                                            ]}
                                        />
                                    </div>
                                ) : null}
                            </Grid>
                        </Grid>
                        <Grid container className="mt-4 pb-5">
                            <ValidatorForm
                                onSubmit={() => { }}
                                className="w-full"
                            >
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    {this.state.loaded ? (
                                        <>
                                            {/* <LoonsTable
                                            //title={"All Aptitute Tests"}

                                            id={'completed'}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                // rowsPerPage:
                                                //     this.state.filterData.limit,
                                                page: this.state.filterData
                                                    .page,
                                                    rowsPerPage: 20,

                                                print: true,
                                                viewColumns: true,
                                                download: true,
                                                onTableChange: (
                                                    action,
                                                    tableState
                                                ) => {
                                                    console.log(
                                                        action,
                                                        tableState
                                                    )
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage(
                                                                tableState.page
                                                            )
                                                            break
                                                        case 'sort':
                                                            // this.sort(tableState.page, tableState.sortOrder);
                                                            break
                                                        default:
                                                            console.log(
                                                                'action not handled.'
                                                            )
                                                    }
                                                },
                                            }}
                                        ></LoonsTable> */}
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'}
                                                data={this.state.data}
                                                columns={this.state.columns}
                                                options={{
                                                    pagination: true,
                                                    serverSide: true,
                                                    print: false,
                                                    viewColumns: false,
                                                    download: false,
                                                    count: this.state
                                                        .totalItems,
                                                    rowsPerPage: 20,
                                                    page: this.state.filterData
                                                        .page,
                                                    onDownload: (
                                                        buildHead,
                                                        buildBody,
                                                        columns,
                                                        data
                                                    ) => {
                                                        // dispatch(getServerSideData(searchText, filterList, sortOrder));
                                                        // this.exportToCSV()
                                                        return false
                                                    },
                                                    onTableChange: (
                                                        action,
                                                        tableState
                                                    ) => {
                                                        console.log(
                                                            action,
                                                            tableState
                                                        )
                                                        switch (action) {
                                                            case 'changePage':
                                                                this.setPage(
                                                                    tableState.page
                                                                )
                                                                break
                                                            case 'sort':
                                                                //this.sort(tableState.page, tableState.sortOrder);
                                                                break
                                                            default:
                                                                console.log(
                                                                    'action not handled.'
                                                                )
                                                        }
                                                    },
                                                }}
                                            ></LoonsTable>
                                        </>
                                    ) : (
                                        //load loading effect
                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30} />
                                        </Grid>
                                    )}
                                </Grid>
                            </ValidatorForm>
                        </Grid>
                    </LoonsCard>
                </MainContainer>
                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={this.state.dialog_for_select_warehouse}
                >
                    <MuiDialogTitle disableTypography>
                        <CardTitle title="Select Your Warehouse" />
                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm onError={() => null} className="w-full">
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_warehouse_loaded.sort((a,b)=> (a.name.localeCompare(b.name)))}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        this.state.owner_id = value.owner_id
                                        let filterData = this.state.filterData
                                        filterData.warehouse_id = value.id
                                        localStorageService.setItem(
                                            'Selected_Warehouse',
                                            value
                                        )
                                        this.setState(
                                            {
                                                owner_id: value.owner_id,
                                                selected_warehouse: value.id,
                                                selected_warehouse_name: value.name,
                                                dialog_for_select_warehouse: false,
                                                Loaded: true,
                                                filterData: filterData,
                                            },
                                            () => {
                                                this.loadData()
                                            }
                                        )
                                    }
                                }}
                                value={{
                                    name: this.state.selected_warehouse
                                        ? this.state.all_warehouse_loaded.filter(
                                            (obj) =>
                                                obj.id ==
                                                this.state.selected_warehouse
                                        ).name
                                        : null,
                                    id: this.state.selected_warehouse,
                                }}
                                getOptionLabel={(option) =>
                                    option.name != null
                                        ? option.name +
                                        ' - ' +
                                        option.main_or_personal
                                        : null
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Warehouse"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />
                             
                        </ValidatorForm>
                    </div>
                </Dialog>
                <ValidatorForm>
                <Dialog
                                        maxWidth={'md'}
                                        fullWidth={true}
                                        open={this.state.confirmingDialog}
                                        onClose={() => {
                                            this.setState({
                                                confirmingDialog: false,
                                            })
                                        }}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                                               
                                 <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                                <CardTitle title="Manual Data Change" />
                                 <IconButton aria-label="close" className={classes.closeButton}
                                  onClick={() => {
                                  this.setState({ 
                                   confirmingDialog: false
                               
                            })
                        }}
                           >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                                        <DialogContent>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                {this.state.loading ? (
                                        <>      
                                            
                                            <div> 
                                                 <div className="w-full" >
                                                  <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '90%', borderRadius: '5px' }} >
                                                    <div className="flex" >
                                                      <p className="text-12 my-0">Name :</p>
                                                         <p className="text-12 my-0 ml-2 ">{this.state.selected_item.medium_description}</p>
                                            </div>
                                            <div className="flex" >
                                                <p className="text-12 my-0">Code :</p>
                                                <p className="text-12 my-0 ml-2 ">{this.state.selected_item.sr_no}</p>
                                            </div>
                                            <div className="flex" >
                                                <p className="text-12 my-0">Batch No. :</p>
                                                <p className="text-12 my-0 ml-2 ">{this.state.selected_item.batch_no}</p>
                                                   
                                            </div>
                                            <div className="flex" >
                                                <p className="text-12 my-0">Expiry Date. :</p>
                                                <p className="text-12 my-0 ml-2 ">{this.state.selected_item.exd}</p>
                                                   
                                            </div>
                                        </div>
                                    </div></div>
                                                                               
                                        
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'}
                                                data={this.state.data2}
                                                columns={this.state.columns2}
                                                options={{
                                                    pagination: true,
                                                    serverSide: true,
                                                    print: false,
                                                    viewColumns: false,
                                                    download: false,
                                                    count: this.state
                                                        .totalItems2,
                                                    rowsPerPage: 1,
                                                    page: this.state.filterData2
                                                        .page,
                                                    onDownload: (
                                                        buildHead,
                                                        buildBody,
                                                        columns,
                                                        data
                                                    ) => {
                                                        // dispatch(getServerSideData(searchText, filterList, sortOrder));
                                                        // this.exportToCSV()
                                                        return false
                                                    },
                                                    onTableChange: (
                                                        action,
                                                        tableState
                                                    ) => {
                                                        console.log(
                                                            action,
                                                            tableState
                                                        )
                                                        switch (action) {
                                                            case 'changePage':
                                                                this.setPageTwo(
                                                                    tableState.page
                                                                )
                                                                break
                                                            case 'sort':
                                                                //this.sort(tableState.page, tableState.sortOrder);
                                                                break
                                                            default:
                                                                console.log(
                                                                    'action not handled.'
                                                                )
                                                        }
                                                    },
                                                }}
                                            ></LoonsTable>
                                        </>
                                    ) : (
                                        //load loading effect
                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30} />
                                        </Grid>
                                    )}
                                            </Grid>
                                        </DialogContent>
                                        
                                        
                                    </Dialog>
                                    </ValidatorForm>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(DrugListReport)
