import React, { Component } from 'react'
import { IconButton, Icon, Grid, CircularProgress, Tooltip, Dialog, Box, Typography, Tab, Tabs, Divider } from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import QueuePlayNextIcon from '@material-ui/icons/QueuePlayNext';
import CloseIcon from '@material-ui/icons/Close';

import PharmacyService from 'app/services/PharmacyService'
import { withStyles } from '@material-ui/core/styles'
import localStorageService from 'app/services/localStorageService';
import { LoonsTable, CardTitle, SubTitle, Button, LoonsCard } from '../../components/LoonsLabComponents'
import { convertTocommaSeparated, dateParse, roundDecimal, yearParse } from '../../../utils'
import VisibilityIcon from '@material-ui/icons/Visibility'
import FeedIcon from '@mui/icons-material/Feed';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ItemsBatchView from '../orders/ItemsBatchView'
import WarehouseServices from 'app/services/WarehouseServices';

import MyInstitute from './DrugComponent/MyInstitute';
import MSDDrug from './DrugComponent/MSDDrug'
import RMSDDrug from './DrugComponent/RMSDDrug'
import OtherInstitute from './DrugComponent/OtherInstitute'
import InventoryService from 'app/services/InventoryService';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import * as appConst from '../../../appconst'
import ListIcon from '@material-ui/icons/List';

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
})

function TabPanel(props) {
    const { children, value, index, ...other } = props
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ paddingBottom: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

class AvailableDrug extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 0,
            role: null,
            showWarehouseView: false,
            showItemBatch: false,
            warehouseData: [],
            warehouseSpecificData: {},
            selected_item_id: null,
            selected_warehouse_id: null,
            activeTab: 0,
            loadingSuggestedWarehoues: false,
            activeStep: 1,
            items: [],
            owner_id: null,

            otherQty: null,
            msdQty: null,
            instituteQty: null,

            batch_no: null,
            exd: null,

            suggestedWareHouses: {
                select_type: 'MY_REQUEST',
                other_wareouse_id: null,
                item_id: null,
                // warehouse_id: null,
                limit: 20,
                page: 0,
                my_owner_id: null,

                Clinic: null,
                pharmacy: null,
                Ward: null,
                Unit: null,
                issuance_type: null,
                drug_store: null,
                // my_owner_id: null
            },

            suggestedWareHouseColumn: [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return <Grid container spacing={1}>
                                <Grid item>
                                    <Tooltip title="Batch Details">
                                        <IconButton onClick={() => {

                                            this.setState({
                                                selected_item_id: this.state.rows2[dataIndex].items_id,
                                                item_warehouse_id: this.state.rows2[dataIndex].warehouse_id,
                                                showItemBatch: true
                                            })

                                        }}>
                                            <ListIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Tooltip title="Stock Movement">
                                        <IconButton
                                            onClick={() => {
                                                console.log('row data', this.state.rows2[dataIndex])
                                                window.location = `/drugbalancing/checkStock/detailedview/${this.state.rows2[dataIndex].items_id}`

                                                // /${this.state.data[tableMeta.rowIndex].item_batch_id}
                                                // ?from=${this.state.filterData.from}
                                                // &to=${this.state.filterData.to}
                                                // &batch_id=${this.state.data[tableMeta.rowIndex].batch_id}
                                            }}
                                        // size="small"
                                        // aria-label="View Item Stocks"
                                        >

                                            <FeedIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                {((this.state.activeTab == 3 || this.state.activeTab == 2) && this.state.canExchange) &&
                                    <Grid item>


                                        <Tooltip title="Request Exchange">
                                            <IconButton onClick={() => {

                                                // console.log('row data', this.state.rows2[dataIndex])
                                                let exchangeForm = this.state.exchangeForm
                                                exchangeForm.item_list[0].to = this.state.rows2[dataIndex].warehouse_id
                                                exchangeForm.item_list[0].item_id = this.state.rows2[dataIndex].items_id

                                                this.setState({ exchangeWindow: true, exchangeForm })
                                            }}>
                                                <QueuePlayNextIcon />
                                            </IconButton>
                                        </Tooltip>




                                    </Grid>
                                }

                            </Grid>
                        }
                    }
                },
                // {     name: 'uom',     label: 'UOM',     options: {} },
                {
                    name: 'Institute',
                    label: 'Institute',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            console.log('dataIndex', this.state.rows2[dataIndex]?.owner_id)
                            if (this.state.activeTab == 1) {
                                //let data = this.state.Institutions[dataIndex]?.warehouse_name + ' - ' + this.state.rows2[dataIndex]?.owner_id
                                return "MSD"
                            } else {
                                let data = this.state.Institutions?.find(x => x.owner_id == this.state.rows2[dataIndex]?.owner_id)
                                return data?.Department?.name ? data?.name + "(" + data?.Department?.name + ")" : data?.name
                            }

                        }
                    }
                },
                {
                    name: '	Drug Store',
                    label: 'Drug Store',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            console.log('dataIndex', this.state.rows2[dataIndex])
                            if (this.state.activeTab == 2) {
                                let data = this.state.rows2[dataIndex]?.warehouse_name + ' - ' + this.state.rows2[dataIndex]?.owner_id
                                return data
                            } else {
                                let data = this.state.rows2[dataIndex]?.warehouse_name
                                return data
                            }

                        }
                    }
                },


                {
                    name: 'store_id',
                    label: 'Store ID',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.rows2[dataIndex]?.store_id
                            return data
                        }
                    }
                },
                /*  {
                     name: 'Type',
                     label: 'Type',
                     options: {
                         customBodyRenderLite: (dataIndex) => {
                             let data = this.state.rows2[dataIndex].warehouse_main_or_personal
                             return data
                         }
                     }
                 }, */

                {
                    name: 'Stock Qty',
                    label: 'Stock Qty',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.rows2[dataIndex]?.total_quantity
                            return data
                        }
                    }
                },



            ],

            drug_data: [],
            drug_columns: [
                {
                    name: 'code', // field name in the row object
                    label: 'Item Code', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        sort: true, // enable sorting
                        customSort: (a, b) => {
                            return a.code - b.code; // sort by ascending code values
                        },
                    },
                },
                {
                    name: 'batch_no', // field name in the row object
                    label: 'Batch No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.drug_data[tableMeta.rowIndex]?.batch_no ? this.state.drug_data[tableMeta.rowIndex]?.batch_no : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'name', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: '',
                    label: 'MSD Stock',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            // calculate msd stock days

                            // get consumption
                            // let consumption = this.state.msdComptumption[dataIndex]?.avarage_consumption;
                            let consumption = this.state?.monthly_requiremnt?.find(x => x?.item_id == this.state.data?.[dataIndex]?.id)?.annual_quantity/12
                            let consumptionQty

                            if (consumption == null || consumption == undefined) {
                                consumptionQty = 0;
                            } else {
                                // when consumption is less than 0, it round up as 1
                                let consumptionValue = Math.abs(consumption / 30);

                                if (consumptionValue < 0) {
                                    consumptionQty = 1
                                } else {
                                    consumptionQty = consumptionValue
                                }
                            }

                            // msd stock
                            let data = this.state.msdqty[dataIndex]?.quantity

                            if (!data) {
                                data = 0
                            }
                            else {
                                data = this.state.msdqty[dataIndex]?.quantity
                            }


                            //  stock days
                            let stockDays = roundDecimal(data / consumptionQty);

                            if (stockDays === null || stockDays === undefined || stockDays === Infinity || isNaN(stockDays)) {
                                return <p>{convertTocommaSeparated(data, 2)}</p>;
                            } else {
                                var years = Math.floor(stockDays / 365);
                                var months = Math.floor((stockDays % 365) / 30);
                                // var weeks = Math.floor((stockDays % 365) % 30 / 7);
                                var days = (stockDays % 365) % 30 % 7;

                                return (
                                    <div>
                                        <p className='m-0 p-0'>{convertTocommaSeparated(data, 2)}</p>
                                        <p className='m-0 p-0' style={{ fontSize: '11px' }}>{'('}{years} {'Y'} {months} {'M'} {days} {'D'} {')'}</p>
                                    </div>
                                );

                            }



                        },
                    },
                },
                

                {
                    name: '',
                    label: 'My Institution Stock',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            // get consumption
                            //let consumption = this.state.myComptumption[dataIndex]?.avarage_consumption;
                            let consumption = this.state.monthly_requiremnt?.find(x => x.item_id == this.state.items[dataIndex]?.id)?.annual_quantity/12

                            let consumptionQty

                            if (consumption == null || consumption == undefined) {
                                consumptionQty = 0;
                            } else {
                                // when consumption is less than 0, it round up as 1
                                let consumptionValue = Math.abs(consumption / 30);

                                if (consumptionValue < 0) {
                                    consumptionQty = 1
                                } else {
                                    consumptionQty = consumptionValue
                                }
                            }

                            // my stock
                            let data = this.state.instituteQty[dataIndex]?.quantity

                            if (!data) {
                                data = 0
                            }
                            else {
                                data = this.state.instituteQty[dataIndex]?.quantity
                            }


                            //  stock days
                            let stockDays = roundDecimal(data / consumptionQty);

                            if (stockDays === null || stockDays === undefined || stockDays === Infinity || isNaN(stockDays)) {
                                return <p>{convertTocommaSeparated(data, 2)}</p>;
                            } else {
                                var years = Math.floor(stockDays / 365);
                                var months = Math.floor((stockDays % 365) / 30);
                                // var weeks = Math.floor((stockDays % 365) % 30 / 7);
                                var days = (stockDays % 365) % 30 % 7;

                                return (
                                    <div>
                                        <p className='m-0 p-0'>{convertTocommaSeparated(data, 2)}</p>
                                        <p className='m-0 p-0' style={{ fontSize: '11px' }}>{'('}{years} {'Y'} {months} {'M'} {days} {'D'} {')'}</p>
                                    </div>
                                );

                            }

                        },
                    },
                },
                {
                    name: '',
                    label: 'Other Institution Stock',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.otherQty[dataIndex]?.quantity
                            if (!data) {
                                return <p>0</p>
                            }
                            else {
                                return <p>{convertTocommaSeparated(data, 2)}</p>
                            }

                        },
                    },
                },
                {
                    name: '',
                    label: 'National Stock',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = 0;
                            if (this.state.suggestedWareHouses?.owner_id == '000') {
                                data = (
                                    (Number(this.state.otherQty[dataIndex]?.quantity) || 0) +
                                    (Number(this.state.msdqty[dataIndex]?.quantity) || 0)
                                );
                            } else {
                                data = (
                                    (Number(this.state.otherQty[dataIndex]?.quantity) || 0) +
                                    (Number(this.state.instituteQty[dataIndex]?.quantity) || 0) +
                                    (Number(this.state.msdqty[dataIndex]?.quantity) || 0)
                                );
                            }



                            if (!data) {
                                return <p>0</p>
                            }
                            else {
                                return <p>{convertTocommaSeparated(data, 2)}</p>
                            }

                        },
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let id = this.state.drug_data[tableMeta.rowIndex]?.item_id
                            return (
                                <Grid container={2}> 
                                    {/* {this.state.role == "Counter Pharmacist" || this.state.role == 'Drug Store Keeper' || this.state.role == 'Chief MLT' || this.state.role == 'Chief Radiographer' ||
                                        this.state.role == 'Admin Pharmacist' || this.state.role == 'RMSD MSA' ||
                                        this.state.role == 'RMSD OIC' || this.state.role == 'MSD MSA' || this.state.role == 'RMSD Pharmacist'
                                        ? */}
                                    <Grid item>
                                    <Tooltip title="Check Stock">
                                            <IconButton
                                                onClick={() => {
                                                    let suggestedWareHouses = this.state.suggestedWareHouses
                                                    suggestedWareHouses.item_id = id
                                                    this.setState({
                                                        suggestedWareHouses,
                                                        individualView: true,

                                                        // itemName: this.state.data[dataIndex]?.medium_description,
                                                        // msdStockQty: this.state.msdqty[dataIndex]?.quantity || 0,
                                                        // myStockQty: this.state.instituteQty[dataIndex]?.quantity || 0,
                                                        // otherStockQty: this.state.otherQty[dataIndex]?.quantity || 0,
                                                    }, () => {
                                                        this.suggestedWareHouse()
                                                    })
                                                }}
                                                className="px-2"
                                                size="small"
                                                aria-label="View Item Stocks"
                                            >
                                                <WarehouseIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    {/* :null} */}
                                    <Grid item>
                                        <Tooltip title="Stock Movement">
                                            <IconButton
                                                onClick={() => {
                                                    window.location = `/drugbalancing/checkStock/detailedview/${id}`
                                                    // /${this.state.data[tableMeta.rowIndex].item_batch_id}
                                                    // ?from=${this.state.filterData.from}
                                                    // &to=${this.state.filterData.to}
                                                    // &batch_id=${this.state.data[tableMeta.rowIndex].batch_id}
                                                }}
                                                className="px-2"
                                                size="small"
                                                aria-label="View Item Stocks"
                                            >
                                                <FeedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title="Item Description">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/item-mst/view-item-mst/${id}`
                                                }}
                                                className="px-2"
                                                size="small"
                                                aria-label="View Item"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            )
                        },
                    },
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            loading: false,

            formData: {
                limit: 10,
                page: 0,
            }
        }
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    }

    handleItemBatch = () => {
        this.setState({ showItemBatch: true })
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New formdata", this.state.formData)
            this.loadData()
        })
    }


    async suggestedWareHouse() {
        this.setState({ loadingSuggestedWarehoues: false })

        console.log('clicked', this.state.suggestedWareHouses)
        let res = await PharmacyOrderService.getSuggestedWareHouse(this.state.suggestedWareHouses)
        if (res.status) {
            console.log('suggested--------------????', res?.data?.view?.data)
            this.loadInstitutionsFromOwnerId(res?.data?.view?.data)
            this.setState({
                rows2: res.data.view.data,
                suggestedtotalItems: res.data.view.totalItems,

            }, () => {
                this.render()
                this.getWarehouseInfo()
            })
        }
    }

    async loadInstitutionsFromOwnerId(resData) {
        if (resData && resData.length > 0) {
            let owner_ids = resData.map(x => x.owner_id)
            console.log("owner_ids", owner_ids)

            let params = {
                issuance_type: ['Hospital', "RMSD Main"],
                'order[0]': ['createdAt', 'ASC'],
                selected_owner_id: [...new Set(owner_ids)]

            }

            let durgStore_res = await PharmacyService.fetchAllDataStorePharmacy(null, params)
            if (durgStore_res.status == 200) {
                console.log('hospital', durgStore_res.data.view.data)
                this.setState({ Institutions: durgStore_res?.data?.view?.data, loadingSuggestedWarehoues: true })
            }

        } else {
            this.setState({ loadingSuggestedWarehoues: true })

        }
    }

    async getWarehouseInfo() {
        let params = {
            owner_id: '000'
        }
        let res = await WarehouseServices.getWareHouseUsers(params);

        if (res.status) {
            console.log('MSDwARE', res.data.view.data)

            this.setState({
                filteredOptions: res.data.view.data
            })
        }
    }

    loadData = async () => {
        this.setState({ loading: false })
        // let drug_data = this.state.drug_data
        let params = {
            search_type: 'SUM',
            items: this.state.items.map(item => item.id),
            exp_date_grater_than_zero: true,
        }


        if (this.state.owner_id) {
            let msd_res = await PharmacyService.getDrugStocks({ ...params, owner_id: "000" })

            if (msd_res.status === 201) {
                let totalQty = []
                for (let i = 0; i < this.state.items.length; i++) {
                    if (msd_res.data.posted.data.length > 0) {
                        const totalqty = msd_res.data.posted.data.filter((x) => x.item_id === this.state.items[i].id);
                        totalQty.push(totalqty[0]);
                    } else {
                        totalQty.push({
                            quantity: '0',
                            item_id: this.state.items[i].id,
                            batch_no: null,
                            personal_warehouse_id: null,
                            exd: null,
                            batch_id: null,
                            pack_size: null,
                            main_warehouse_id: null,
                            main_warehouse_quantity: 0
                        })
                    }
                }
                // console.log('MSD: ', totalQty)
                this.setState({
                    msdQty: totalQty,
                })
            }
            let institute_res = await PharmacyService.getDrugStocks({
                ...params,
                all_institutes: true,
                institional_stock: true,
                other_warehouses: true
            })

            if (institute_res.status === 201) {
                let totalQty = []
                for (let i = 0; i < this.state.items.length; i++) {
                    if (institute_res.data.posted.data.length > 0) {
                        const totalqty = institute_res.data.posted.data.filter((x) => x.item_id === this.state.items[i].id);
                        totalQty.push(totalqty[0]);
                    } else {
                        totalQty.push({
                            quantity: '0',
                            item_id: this.state.items[i].id,
                            batch_no: null,
                            personal_warehouse_id: null,
                            exd: null,
                            batch_id: null,
                            pack_size: null,
                            main_warehouse_id: null,
                            main_warehouse_quantity: 0
                        })
                    }
                }
                // console.log('Institute: ', totalQty)
                this.setState({
                    instituteQty: totalQty,
                })
            }

            await this.loadValues()
        }

        // this.setState({ loading: true });

        this.loadTotalQTY()
        this.getRequement()
        this.getMyRequement()
    }

    loadValues = async () => {
        let drug_data = [];

        if (this.state.msdQty && this.state.instituteQty) {
            drug_data = this.state.items.map((item, index) => {
                return {
                    item_id: item.id,
                    code: item.code ? item.code : null,
                    name: item.name ? item.name : null,
                    exd: this.state.msdQty[index]?.exd ? this.state.msdQty[index]?.exd : this.state.instituteQty[index]?.exd ? this.state.instituteQty[index]?.exd : null,
                    batch_no: this.state.msdQty[index]?.batch_no ? this.state.msdQty[index]?.batch_no : this.state.instituteQty[index]?.batch_no ? this.state.instituteQty[index]?.batch_no : null,
                    msd_quantity: this.state.msdQty[index].quantity,
                    institute_quantity: this.state.instituteQty[index].quantity,
                }
            })
        }
        console.log('ckecking drug_data', drug_data)
        this.setState({ drug_data: drug_data })
    }

    async componentDidMount() {
        const { owner_id, items, role } = this.props

        let suggestedWareHouses = this.state.suggestedWareHouses
        suggestedWareHouses.owner_id = owner_id;
        suggestedWareHouses.all_warehouse = 'needed';

        this.setState({
            role: role,
            owner_id: owner_id,
            items: items,
            suggestedWareHouses,
        }, () => {
            this.loadData()
            // this.handleTabChange()
        })
    }



    // new addedd 

    async getRequement() {
        let params = {
            item_id: this.state.items.map(item => item.id),
            year: yearParse(new Date())
        }

        let res = await InventoryService.monthlyRequiremnt(params)
        if (res.status == 200) {
            this.setState({
                monthly_requiremnt: res.data.view.data
            })
        }
        console.log('data monthly req', res)
    }


    async getMyRequement() {
        let Logged_owner_id = await localStorageService.getItem("owner_id")
        let params = {
            item_id: this.state.items.map(item => item.id),
            year: yearParse(new Date()),
            owner_id: Logged_owner_id
        }

        let res = await InventoryService.monthlyRequiremnt(params)
        if (res.status == 200) {
            this.setState({
                my_monthly_requiremnt: res.data.view.data
            })
        }
        console.log('data monthly req my', res)
    }

    async loadTotalQTY() {
        this.setState({
            loaded: false,

        })
        let owner_id = await localStorageService.getItem("owner_id")
        let items = []

        console.log('checking data', this.state.items)
        for (let index = 0; index < this.state.items.length; index++) {
            let item_id = this.state.items[index]?.id;
            items.push(item_id)
        }
        let params = {
            search_type: 'SUM',
            // group_by:'Batch',
            owner_id: "000",
            exp_date_grater_than_zero: true,
            items: items

        }
        console.log('batches', params)
        let batch_res = await PharmacyService.getDrugStocks(params)

        if (batch_res.status == 201) {
            let totalQty = []
            for (let i = 0; i < this.state.items.length; i++) {
                const totalqty = batch_res.data.posted.data.filter((x) => x.item_id == this.state.items[i].id
                );

                totalQty.push(totalqty[0]);
            }

            this.setState({
                // data:totalQty,
                msdqty: totalQty,

            })

        }
        let params2 = {
            search_type: 'SUM',
            owner_id: owner_id,
            // group_by:'Batch',
            exp_date_grater_than_zero: true,
            items: items

        }
        if (owner_id != null) {
            let batch_res2 = await PharmacyService.getDrugStocks(params2)
            if (batch_res2.status == 201) {
                let totalQty = []
                //  totalQty = this.state.data.filter((x) =>x.data?.posted?.data?.item_id == element.id
                //   );
                for (let i = 0; i < this.state.items.length; i++) {
                    const totalqty = batch_res2.data.posted.data.filter((x) => x.item_id == this.state.items[i].id
                    );

                    totalQty.push(totalqty[0]);
                }
                console.log('sum22', totalQty)
                this.setState({
                    instituteQty: totalQty,
                })

            }
        }

        //  commented by roshan for merge conflict
        let params3 = {
            search_type: 'SUM',
            owner_id: owner_id,
            // group_by:'Batch',
            other_warehouses: true,
            exp_date_grater_than_zero: true,
            items: items

        }
        if (owner_id != null) {
            let batch_res2 = await PharmacyService.getDrugStocks(params3)
            if (batch_res2.status == 201) {
                let totalQty = []
                //  totalQty = this.state.data.filter((x) =>x.data?.posted?.data?.item_id == element.id
                //   );
                for (let i = 0; i < this.state.items.length; i++) {
                    const totalqty = batch_res2.data.posted.data.filter((x) => x.item_id == this.state.items[i].id
                    );

                    totalQty.push(totalqty[0]);
                }
                console.log('sum22', totalQty)
                this.setState({
                    otherQty: totalQty,
                })

            }
        }




        this.setState({
            loaded: true,
            loading: true
        })

    }


    handleTabChange = (event, newValue) => {


        let suggestedWareHouses = { ...this.state.suggestedWareHouses };

        if (newValue === 0) {
            suggestedWareHouses.select_type = "MY_REQUEST";
        } else if (newValue === 1) {
            suggestedWareHouses.select_type = "MSD_ONLY";
        } else if (newValue === 2) {
            suggestedWareHouses.select_type = "RMSD_ONLY";
        } else if (newValue === 3) {
            suggestedWareHouses.select_type = "OTHER_INSTITUTE";
        }

        this.setState({ suggestedWareHouses, rows2: [] });
        this.setState({ activeTab: newValue, suggestedWareHouses }, () => {
            this.suggestedWareHouse();
        });
    };



    componentDidUpdate(prevProps) {
        if (this.props.owner_id !== prevProps.owner_id) {
            this.setState({ owner_id: this.props.owner_id }, () => {
                this.loadData();
                
                // console.log("Owner ID: ", this.state.owner_id);
            });
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <>
                <Grid container spacing={2} style={{ marginTop: "12px", marginBottom: '25px', padding: "24px", background: "#B3ACAC", borderRadius: "12px" }}>
                    <CardTitle title='Drug Availability' style={{ marginLeft: "8px" }} />
                    <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: '12px', backgroundColor: "#fff", borderRadius: "12px" }}>
      
                        {
                            this.state.loading ?
                                <LoonsTable
                                    //title={"All Aptitute Tests"}
                                    id={'allDrugList'}
                                    data={this.state.drug_data}
                                    columns={this.state.drug_columns}
                                    options={{
                                        pagination: true,
                                        rowsPerPage: this.state.formData.limit,
                                        page: this.state.formData.page,
                                        count: this.state.items.length,
                                        serverSide: true,
                                        print: true,
                                        viewColumns: true,
                                        download: true,
                                        rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
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
                                                case 'changeRowsPerPage':
                                                    let formaData = this.state.formData;
                                                    formaData.limit = tableState.rowsPerPage;
                                                    this.setState({ formaData })
                                                    this.setPage(0)
                                                    break;
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
                                :
                                (
                                    <Grid className='justify-center text-center w-full pt-12'>
                                        <CircularProgress size={30} />
                                    </Grid>
                                )
                        }
                    </Grid>
                </Grid>
                <Dialog
                    fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.showWarehouseView}>
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                        <CardTitle title="Select Your Warehouse" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ showWarehouseView: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            onError={() => null} className="w-full">
                            <Autocomplete
                                disableClearable className="w-full"
                                // ref={elmRef}
                                options={this.state.warehouseData.sort((a, b) => (a.name.localeCompare(b.name)))}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        // localStorageService.setItem('Selected_Warehouse', value);
                                        let warehouseSpecificData = this.state.warehouseSpecificData;
                                        warehouseSpecificData.item_id = this.state.selected_item_id;
                                        warehouseSpecificData.warehouse_id = value.id;

                                        // suggestedWareHouses.warehouse_id = value.id
                                        // this.setState({ showWarehouseView: false, suggestedWareHouses, selectWarehouseViewName: value.name })
                                        this.setState({
                                            warehouseSpecificData, selected_warehouse_id: value.id, showWarehouseView: false, individualView: true
                                        })
                                    }
                                }}
                                /* value={{
                                    name: selectedWarehouse
                                        ? (
                                            allWarehouses.filter((obj) => obj.id == selectedWarehouse).name
                                        )
                                        : null,
                                    id: selectedWarehouse
                                }} */
                                getOptionLabel={(option) => option.name ? option.name + " - " + option.main_or_personal : null}
                                renderInput={(params) => (
                                    <TextValidator {...params} placeholder="Select Your Warehouse"
                                        //variant="outlined"
                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                )} />
                        </ValidatorForm>
                    </div>
                </Dialog>
                <Dialog fullWidth maxWidth="lg " open={this.state.showItemBatch}
                    onClose={() => {
                        this.setState({ showItemBatch: false })
                    }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Item Batch Info" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ showItemBatch: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        <ItemsBatchView id={this.state.selected_item_id} warehouse_id={this.state.selected_warehouse_id}></ItemsBatchView>
                    </div>
                </Dialog>
         

                <Dialog
                    style={{
                        padding: '10px'
                    }}
                    maxWidth="lg"
                    fullWidth={true}
                    open={this.state.individualView}
                    onClose={() => {
                        // this.setState({individualView: false})
                    }}>
                    <div className="w-full h-full px-5 py-5">
                        <Grid container="container">
                            <Grid item="item" lg={12} md={12} xs={12} className="mb-4">
                                <LoonsCard>
                                    <Grid item="item" lg={12} md={12} xs={12}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <CardTitle title="Check Stock"></CardTitle>
                                            <IconButton aria-label="close" onClick={() => { this.setState({ individualView: false }) }}><CloseIcon /></IconButton>
                                        </div>
                                        {/* msdStockQty:Number(this.state.msdqty[dataIndex]?.quantity) || 0,
                                                            myStockQty:Number(this.state.instituteQty[dataIndex]?.quantity) || 0,
                                                            otherStockQty */}

                                        <Grid container>

                                            {/* <Grid item xs={12}>
                                                <p style={{ fontSize: '12px' }} className='m-0 p-0'><spam style={{ fontWeight: 'bold' }}>Item Name : </spam>{this.state.itemName}</p>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <p style={{ fontSize: '12px' }} className='m-0 p-0'><spam style={{ fontWeight: 'bold' }}>MSD Stock : </spam>{convertTocommaSeparated(this.state.msdStockQty)}</p>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <p style={{ fontSize: '12px' }} className='m-0 p-0'><spam style={{ fontWeight: 'bold' }}>My Institution Stock : </spam>{convertTocommaSeparated(this.state.myStockQty)}</p>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <p style={{ fontSize: '12px' }} className='m-0 p-0'><spam style={{ fontWeight: 'bold' }}>Other Institution Stock : </spam>{convertTocommaSeparated(this.state.otherStockQty)}</p>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <p style={{ fontSize: '12px' }} className='m-0 p-0'><spam style={{ fontWeight: 'bold' }}>National Stock : </spam>{convertTocommaSeparated(Number(this.state.msdStockQty) + Number(this.state.myStockQty) + Number(this.state.otherStockQty))}</p>
                                            </Grid> */}
                                        </Grid>
                                    </Grid>

                                    {/* {this.state.Loaded ? */}
                                    <main>


                                        <Grid className='mt-3' item lg={12} md={12} xs={12} >
                                            <Tabs
                                                value={this.state.activeTab}
                                                onChange={this.handleTabChange}

                                                style={{ minHeight: 39, height: 26 }}
                                                indicatorColor="primary"
                                                variant='fullWidth'
                                                textColor="primary"
                                            >
                                                <Tab label="My Institute" />
                                                <Tab label="MSD" />
                                                <Tab label="RMSD" />
                                                <Tab label="Other Institute" />
                                            </Tabs>

                                            {this.state.activeTab == 0 ? <div>

                                                {console.log('this.state.loadingSuggestedWarehoues', this.state.loadingSuggestedWarehoues)}
                                                {/* My  institute */}
                                                <Grid item="item" lg={12} md={12} xs={12} className="mt-10">

                                                    

                                                    {this.state.loadingSuggestedWarehoues ?
                                                        <LoonsTable
                                                            //title={"All Aptitute Tests"}
                                                            id={'suggested'}
                                                            data={this.state.rows2}
                                                            columns={this.state.suggestedWareHouseColumn}
                                                            options={{
                                                                pagination: true,
                                                                serverSide: true,
                                                                count: this.state.suggestedtotalItems,
                                                                rowsPerPage: 20,
                                                                page: this.state.suggestedWareHouses.page,
                                                                onTableChange: (action, tableState) => {
                                                                    console.log(action, tableState)
                                                                    switch (action) {
                                                                        case 'changePage':
                                                                            this.setSuggestedPage(tableState.page)
                                                                            break
                                                                        case 'sort':
                                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                                            break
                                                                        default:
                                                                            console.log('action not handled.')
                                                                    }
                                                                }
                                                            }}></LoonsTable>
                                                        : null}
                                                </Grid>
                                            </div> : null}

                                            {this.state.activeTab == 1 ? <div>
                                                {/* MSD institute */}
                                                <Grid item="item" lg={12} md={12} xs={12} className="mt-10">
                                                 
                                                    {this.state.loadingSuggestedWarehoues ?
                                                        <LoonsTable
                                                            //title={"All Aptitute Tests"}
                                                            id={'suggested'} data={this.state.rows2}
                                                            columns={this.state.suggestedWareHouseColumn}
                                                            options={{
                                                                pagination: true,
                                                                serverSide: true,
                                                                count: this.state.suggestedtotalItems,
                                                                rowsPerPage: 20,
                                                                page: this.state.suggestedWareHouses.page,
                                                                onTableChange: (action, tableState) => {
                                                                    console.log(action, tableState)
                                                                    switch (action) {
                                                                        case 'changePage':
                                                                            this.setSuggestedPage(tableState.page)
                                                                            break
                                                                        case 'sort':
                                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                                            break
                                                                        default:
                                                                            console.log('action not handled.')
                                                                    }
                                                                }
                                                            }}></LoonsTable>
                                                        : null}
                                                </Grid>

                                            </div> : null}

                                            {this.state.activeTab == 2 ? <div>
                                                {/* RMSD institute */}
                                                <Grid item="item" lg={12} md={12} xs={12} className="mt-10">
                                                   
                                                    {this.state.loadingSuggestedWarehoues ?
                                                        <LoonsTable
                                                            //title={"All Aptitute Tests"}
                                                            id={'suggested'} data={this.state.rows2}
                                                            columns={this.state.suggestedWareHouseColumn}
                                                            options={{
                                                                pagination: true,
                                                                serverSide: true,
                                                                count: this.state.suggestedtotalItems,
                                                                rowsPerPage: 20,
                                                                page: this.state.suggestedWareHouses.page,
                                                                onTableChange: (action, tableState) => {
                                                                    console.log(action, tableState)
                                                                    switch (action) {
                                                                        case 'changePage':
                                                                            this.setSuggestedPage(tableState.page)
                                                                            break
                                                                        case 'sort':
                                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                                            break
                                                                        default:
                                                                            console.log('action not handled.')
                                                                    }
                                                                }
                                                            }}></LoonsTable>
                                                        : null}
                                                </Grid>
                                            </div> : null}

                                            {this.state.activeTab == 3 ? <div>
                                                {/* other institute */}
                                                <Grid item="item" lg={12} md={12} xs={12} className="mt-10">
                                                   
                                                    {this.state.loadingSuggestedWarehoues ?
                                                        <LoonsTable
                                                            //title={"All Aptitute Tests"}
                                                            id={'suggested'}
                                                            data={this.state.rows2}
                                                            columns={this.state.suggestedWareHouseColumn}
                                                            options={{
                                                                pagination: true,
                                                                serverSide: true,
                                                                count: this.state.suggestedtotalItems,
                                                                rowsPerPage: 20,
                                                                page: this.state.suggestedWareHouses.page,
                                                                onTableChange: (action, tableState) => {
                                                                    console.log(action, tableState)
                                                                    switch (action) {
                                                                        case 'changePage':
                                                                            this.setSuggestedPage(tableState.page)
                                                                            break
                                                                        case 'sort':
                                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                                            break
                                                                        default:
                                                                            console.log('action not handled.')
                                                                    }
                                                                }
                                                            }}></LoonsTable>
                                                        : null}
                                                </Grid>
                                            </div> : null}
                                        </Grid>

                                    </main>
                                  
                                </LoonsCard>
                            </Grid>
                            {/* {this.state.pload ? */}
                            {/* <Grid>
                                <DetailLedgerReports></DetailLedgerReports>
                            </Grid> */}
                            {/* :null} */}



                        </Grid>
                    </div>

                </Dialog>
            </>
        )
    }
}

export default withStyles(styleSheet)(AvailableDrug)