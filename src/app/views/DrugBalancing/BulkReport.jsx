import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import ApartmentIcon from '@material-ui/icons/Apartment'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import {
    Grid,
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
    Dialog,
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
import AppsIcon from '@mui/icons-material/Apps';

const styleSheet = (palette, ...theme) => ({})

class BulkReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            activeTab: 0,
            activeSecondaryTab: 0,
            Loaded: false,
            id_arrray:[],
            defaultItem:[],
            selected_warehouse: null,
            selected_warehouse_name: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            dateTime:dateTimeParse(new Date()),
            loginUser:null,
            filterData: {
                countable: false,
                from: null,
                to: null,
                limit: 20,
                page: 0,
                //warehouse_id: '97d5abd3-4c0a-4232-8b4e-76e739650412',
                warehouse_id: null,
                search_type: 'drug balancing',
                orderby_sr : true
            },
            totalItems: 0,

            data: [],
            printData: [],
            printLoaded: false,
            // data2: [],
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
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex].previous_balance
                                let min_level = (this.state.defaultItem.filter((data) => data?.item_id == this.state.data[dataIndex]?.item_id ))
                                let minimum_stock_level = min_level[0]?.minimum_stock_level
                                // && data.item_id == this.state.data[dataIndex].item_id )[0]?.quantity) - parseFloat(this.state.itemsnap.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex].item_id )[0]?.reserved_quantity)
                                
                                if(min_level[0] ){
                                    if(minimum_stock_level==0){
                                        console.log("mst")
                                        return <p>{data}</p>
                                    }
                                    else{
                                        let pb = this.state.data[dataIndex].previous_balance-(this.state.data[dataIndex].previous_balance)%(minimum_stock_level)
                                        console.log("solution",(this.state.data[dataIndex].previous_balance)%(minimum_stock_level))
                                        return<p>{pb}</p>
                                        
                                    }

                                    
                                   


                                }
                                else{
                                    
                                    return<p>{data}</p>
                                }
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
                        display: true,
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
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.data[dataIndex].Ward_manual
                        //     return <p>{data}</p>
                        // },
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

                //     <DataGrid columns ={[{ field: 'username', width: 200 }, { field: 'age' }]}
                //     rows={rows}
                //        />
                // },
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
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.data[dataIndex].Excess_manual
                        //     return <p>{data}</p>
                    },
                },
                {
                    name: 'balance_counted',
                    label: 'Balance',
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
                                )+
                                parseFloat(
                                    this.state.data[dataIndex]['Order issue']
                                        ? this.state.data[dataIndex][
                                        'Order issue'
                                        ]
                                        : 0
                                )  +
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
                                let min_level = (this.state.defaultItem.filter((data) => data?.item_id == this.state.data[dataIndex]?.item_id ))
                                let minimum_stock_level = min_level[0]?.minimum_stock_level
                                if(min_level[0] ){
                                    if(minimum_stock_level==0){
                                        console.log("mst")
                                        return <p>{data}</p>
                                    }
                                    else{
                                        let cb = data-(data)%(minimum_stock_level)
                                        console.log("solution",(data)%(minimum_stock_level))
                                        return<p>{cb}</p>
                                        
                                    }

                                    
                                   


                                }
                                else{
                                    
                                    return<p>{data}</p>
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
                                <Tooltip title="Detailed Report">
                                        <AddToPhotosIcon
                                            className="w-full"
                                            onClick={() => {
                                                window.location = `/drugbalancing/detailedview/${this
                                                    .state
                                                    .data[tableMeta.rowIndex]
                                                    .item_batch_id}?from=${this.state.filterData.from}&to=${this.state.filterData.to}&batch_id=${this
                                                        .state
                                                        .data[tableMeta.rowIndex]
                                                        .batch_id}`
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                          
                                        </AddToPhotosIcon>
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
                                            onChange={(e) => {}}
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
        }
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
            console.log("res",batch_res)
            var id_arrray = batch_res.data.view.data
            
                let consignmentList = batch_res.data.view.data.map(data => data.item_id);
                let uniqueconsignmentList = [...new Set(consignmentList)];

            
            
            this.setState({
                id_arrray: uniqueconsignmentList,
                data: batch_res.data.view.data,
                totalItems: batch_res.data.view.totalItems,
                totalPages: batch_res.data.view.totalPages,
                //data2: batch_res.data.view,
                loaded: true,
            
            }
            ,() =>{
                this.loadOrderList()
            }
            )
            console.log("arr1",this.state.id_arrray)
            console.log('Batch Data', this.state.data)
            //console.log('Batch data2', this.state.data2
        }
    }
    async loadOrderList() {
        //this.setState({ loaded: false, cartStatus: [] })
        
        let data = {
            item_id:this.state.id_arrray,
            warehouse_id: this.state.selected_warehouse

        
        }
        console.log("details",data.warehouse_id)
        let res = await PharmacyOrderService.getDefaultItems(data)
        let order_id = 0
        if (res.status) {
            // if (res.data.view.data.length != 0) {
            //     order_id = res
            //         .data
            //         .view
            //         .data[0]
            //         .pharmacy_order_id
            // }
            
           
            console.log("data", res.data.view.data);
            this.setState({
                defaultItem: res.data.view.data
                
               // data: res.data.view.data,
                // loaded: true,
                // totalItems: res.data.view.totalItems,
                // minStock: res.data.view.data.minimum_stock_level 
            }, () => {
                this.render()
                // this.getCartItems()
            })
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
                    //data2: batch_res.data.view,
                    printLoaded: true,
                },
                () => {
                    document.getElementById('print_button_001').click()
                }
            )
            console.log('Batch Data', this.state.data)
            //console.log('Batch data2', this.state.data2)
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
    async getUser (){
        var user = await localStorageService.getItem('userInfo')
        console.log('usloginUserer', user.name)
        this.setState({loginUser: user.name})
    }

    componentDidMount() {
        let today = moment()

        let tomorrow = moment().add(1, 'days')

        let yesterday = moment().add(-1, 'days')
        let filterData = this.state.filterData
        filterData.from = dateParse(new Date())
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

    render() {
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
                                Bulk Report
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
                        <Grid container
                        //  className="mt-4 pb-5"
                         >
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
                                            title="Bulk Report"
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
                                onSubmit={() => {}}
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
                                                    count: this.state
                                                        .totalItems,
                                                    rowsPerPage:
                                                        this.state.filterData
                                                            .limit,
                                                    page: this.state.filterData
                                                        .page,

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
                                        localStorageService.setItem(
                                            'Selected_Warehouse',
                                            value
                                        )
                                        this.state.owner_id = value.owner_id
                                        let filterData = this.state.filterData
                                        filterData.warehouse_id = value.id
                                        this.setState(
                                            {
                                                filterData,
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
            </Fragment>
        )
    }
}

export default BulkReport
