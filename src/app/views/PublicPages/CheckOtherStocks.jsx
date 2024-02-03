import React, { Component, Fragment } from 'react'
import {
    Divider, Grid, IconButton, CircularProgress, Tooltip, Dialog,
    RadioGroup,
    FormControlLabel,
    InputAdornment
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
import EditIcon from '@material-ui/icons/Edit'
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import ApartmentIcon from '@material-ui/icons/Apartment';
import HealingIcon from '@mui/icons-material/Healing'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import VisibilityIcon from '@material-ui/icons/Visibility'
import QueuePlayNextIcon from '@material-ui/icons/QueuePlayNext';
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
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
import SearchIcon from '@material-ui/icons/Search'
import DashboardReportServices from 'app/services/DashboardReportServices'
import { convertTocommaSeparated, dateParse, includesArrayElements, roundDecimal, yearParse } from 'utils'
import ca from 'date-fns/locale/ca/index'
import ClinicService from 'app/services/ClinicService'

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

class CheckOtherStocks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            user_role: [],
            individualView: false,
            ReportViewDialog: false,
            selectWarehouseView: false,
            selectWarehouseViewName: null,
            loadingSuggestedWarehoues: false,
            msdComptumption: [],
            activeTab: 0,
            totalQty: [],
            filteredOptions: [],
            pharmacyList: [],
            wardList: [],
            ClinicList: [],
            drugStoreList: [],
            pload: false,
            userOwnidList: [],
            search_enable: false,
            province_selection: true,
            tempDataList: {
                district: null,
                province: null
            },
            exchangeWindow: false,
            submitingExchange: false,
            exchangeForm: {
                from: null,
                created_by: null,
                type: "EXCHANGE_HOSPITAL",
                required_date: null,
                item_list: [
                    {
                        request_quantity: null,
                        item_id: null,
                        to: null
                    }
                ]
            },

            resetFilters: true,
            myComptumption: [],
            Institutions: [],
            suggestedWareHouses: {
                select_type: 'MSD_ONLY',
                other_wareouse_id: null,
                item_id: null,
                all_warehouse: 'needed',
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
            all_pharmacy_dummy: [],

            canExchange: false,
            monthly_requiremnt: null,
            columns: [
                {
                    name: 'action',
                    label: 'Actions',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id
                            return (
                                <Grid container={2}>
                                    <Grid item>

                                        <Tooltip title="Check Stock">
                                            <IconButton
                                                onClick={() => {
                                                    let suggestedWareHouses = this.state.suggestedWareHouses
                                                    suggestedWareHouses.item_id = id
                                                    this.setState({
                                                        suggestedWareHouses,
                                                        individualView: true,

                                                        itemName: this.state.data[dataIndex]?.medium_description,
                                                        msdStockQty: this.state.msdqty[dataIndex]?.quantity || 0,
                                                       // myStockQty: this.state.instituteQty[dataIndex]?.quantity || 0,
                                                        otherStockQty: this.state.otherQty[dataIndex]?.quantity || 0,
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
                                    <Grid item>

                                    </Grid>
                                    {/* <Grid item>

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

                                    </Grid> */}
                                </Grid>
                            )
                        },
                    },
                },

                {
                    name: 'sr_no', // field name in the row object
                    label: 'Item Code', // column title that will be shown in table
                    options: {
                        sort: true, // enable sorting
                        customSort: (a, b) => {
                            return a.sr_no - b.sr_no; // sort by ascending sr_no values
                        },
                        filter: false,
                        display: true,
                    },
                },
                // {
                //     name: 'item_name', // field name in the row object
                //     label: 'Item Name', // column title that will be shown in table
                //     options: {
                //         filter: false,
                //         display: true,
                //     },
                // },

                // {
                //     name: 'category',
                //     label: 'Serial Name',
                //     options: {
                //         filter: true,
                //         display: true,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data = this.state.data[dataIndex].Serial.name;
                //             return <p>{data}</p>

                //         },
                //     },
                // },
                {
                    name: 'Item_Category',
                    label: 'Item Category',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex].Serial.Group.Category
                                    .description
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'ven',
                    label: 'VEN Name',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].VEN.name
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'medium_description',
                    label: 'Name',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                // {
                //     name: 'consumption', // field name in the row object
                //     label: 'MSD Consumption', // column title that will be shown in table
                //     // getConsumptionDet(id)
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,

                //         customBodyRenderLite: (dataIndex) => {
                //             console.log('msd com',this.state.msdComptumption[dataIndex])
                //             console.log('my com',this.state.myComptumption[dataIndex])
                //             // let consumption = this.state.data[dataIndex]?.consumption
                //             // if (consumption === null || consumption === undefined) {
                //             //     return 0;
                //             // } else {
                //             //     return roundDecimal(consumption / 30, 2)
                //             // }

                //         },
                //     },
                // },
                {
                    name: '',
                    label: 'MSD Stock',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            // calculate msd stock days

                            // get consumption
                            //let consumption = this.state.msdComptumption[dataIndex]?.avarage_consumption;
                            let consumption = this.state.monthly_requiremnt.find(x => x.item_id == this.state.data[dataIndex].id)?.annual_quantity / 12

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

                            // if (!data) {
                            //     return <p>0</p>
                            // }
                            // else {
                            //     return <p>{data}</p>
                            // }



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
                            if (this.state.suggestedWareHouses.owner_id == '000') {
                                data = (
                                    (Number(this.state.otherQty[dataIndex]?.quantity) || 0) +
                                    (Number(this.state.msdqty[dataIndex]?.quantity) || 0)
                                );
                            } else {
                                data = (
                                    (Number(this.state.otherQty[dataIndex]?.quantity) || 0) +
                                    /* (Number(this.state.instituteQty[dataIndex]?.quantity) || 0) + */
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
                //  {
                //     name: 'groupName',
                //     label: 'Group Name',
                //     options: {
                //         filter: true,
                //         display: true,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data =
                //                 this.state.data[dataIndex].Serial.Group.name
                //             return <p>{data}</p>
                //         },
                //     },
                // },
                // {
                //     name: 'default_frequency',
                //     label: 'Default Frequency',
                //     options: {
                //         filter: true,
                //         display: true,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data = this.state.data[dataIndex].DefaultRoute.name;
                //             return <p>{data}</p>

                //         },
                //     },
                // },
                // {
                //     name: 'default_route',
                //     label: 'Default Route',
                //     options: {
                //         filter: true,
                //         display: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data =
                //                 this.state.data[dataIndex].DefaultRoute.name
                //             return <p>{data}</p>
                //         },
                //     },
                // },
                // {
                //     name: 'default_unit',
                //     label: 'Display Unit',
                //     options: {
                //         filter: true,
                //         display: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data =
                //                 this.state.data[dataIndex].DisplayUnit.name
                //             return <p>{data}</p>
                //         },
                //     },
                // },
                // {
                //     name: 'dosage_form',
                //     label: 'Dosage Form',
                //     options: {
                //         filter: true,
                //         display: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data =
                //                 this.state.data[dataIndex].DosageForm.name
                //             return <p>{data}</p>
                //         },
                //     },
                // },
                // {
                //     name: 'measuring_unit',
                //     label: 'Measuring Unit',
                //     options: {
                //         filter: true,
                //         display: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data =
                //                 this.state.data[dataIndex].MeasuringUnit.name
                //             return <p>{data}</p>
                //         },
                //     },
                // },
                {
                    name: 'warehouse_name',
                    label: 'Warehouse Name',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Warehouse.name
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'serial',
                    label: 'Serial Code',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Serial.code
                            return <p>{data}</p>
                        },
                    },
                },

            ],
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
                                {/*  <Grid item>
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
                                </Grid> */}


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
                            if (this.state.activeTab == 0) {
                                //let data = this.state.Institutions[dataIndex]?.warehouse_name + ' - ' + this.state.rows2[dataIndex]?.owner_id
                                return "MSD"
                            } else {
                                let data = this.state.Institutions.find(x => x.owner_id == this.state.rows2[dataIndex]?.owner_id)
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
                            if (this.state.activeTab == 1) {
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

            alert: false,
            message: '',
            severity: 'success',
            user_role: null,
            allGroups: [],
            allSerials: [],
            allWH: [],
            allVENS: [],
            allUOMS: [],
            allStocks: [],
            allItemTypes: [],
            allInstitution: [],
            allConsumables: [],
            allItemUsageTypes: [],
            allItemStatus: [],
            allConditions: [],
            allStorages: [],
            allBatchTraces: [],
            allABCClasses: [],
            allCyclicCodes: [],
            allMovementTypes: [],

            loaded: false,
            totalItems: 0,
            totalPages: 0,
            formData: {
                page: 0,
                limit: 20,
                group_id: null,
                serial_id: null,
                primary_wh: null,
                stock_id: null,
                condition_id: null,
                storage_id: null,
                batch_trace_id: null,
                abc_class_id: null,
                movement_type_id: null,
                uom_id: null,
                institution_id: null,
                item_type_id: null,
                conversion_facter: null,
                consumables: null,
                ven_id: null,
                used_for_estimates: null,
                used_for_formulation: null,
                item_usage_type_id: null,
                search: null,
                sr_no: null,
                short_description: null,
                long_description: null,
                order: ['sr_no']
            },

            // this is creare for as params get warehouse
            wearehouseInfo: {
                my_owner_id: null,
                limit: 20,
                page: 0,
                Clinic: null,
                pharmacy: null,
                Ward: null,
                Unit: null,
                issuance_type: null,
                drug_store: null,
            },

            my_owner_id: null
        }
    }
    async loadTotalQTY() {
        this.setState({
            loaded: false,

        })
        // let owner_id = await localStorageService.getItem("owner_id")
        let owner_id = '000'
        let items = []
        for (let index = 0; index < this.state.data.length; index++) {
            let item_id = this.state.data[index]?.id;
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
            let totalQtyMsd = []
            for (let i = 0; i < this.state.data.length; i++) {
                const totalqtytemp = batch_res.data.posted.data.filter((x) => x.item_id == this.state.data[i].id
                );

                totalQtyMsd.push(totalqtytemp[0]);
            }

        console.log("grugs qty msd",totalQtyMsd)

            this.setState({
                // data:totalQty,
                msdqty: totalQtyMsd,

            })

        }
        let params2 = {
            search_type: 'SUM',
            owner_id: '000',
            // group_by:'Batch',
            exp_date_grater_than_zero: true,
            items: items

        }
        if (owner_id != null) {
            let batch_res2 = await PharmacyService.getDrugStocks(params2)
            if (batch_res2.status == 201) {
                let totalQtyInst = []
                //  totalQty = this.state.data.filter((x) =>x.data?.posted?.data?.item_id == element.id
                //   );
                for (let i = 0; i < this.state.data.length; i++) {
                    const totalqty = batch_res2.data.posted.data.filter((x) => x.item_id == this.state.data[i].id
                    );

                    totalQtyInst.push(totalqty[0]);
                }
                console.log('grugs qty inst', totalQtyInst)
                this.setState({
                    instituteQty: totalQtyInst,
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
                for (let i = 0; i < this.state.data.length; i++) {
                    const totalqty = batch_res2.data.posted.data.filter((x) => x.item_id == this.state.data[i].id
                    );

                    totalQty.push(totalqty[0]);
                }
                console.log('grugs qty other', totalQty)
                this.setState({
                    otherQty: totalQty,
                })

            }
        }




        this.setState({
            loaded: true,

        })

    }



    // get ward info
    async getWard() {
        let params = {
            // Ward : this.state.suggestedWareHouses?.Ward,
            issuance_type: ['Ward', 'Unit'],
        }
        // let res = await WarehouseServices.getWarehoureWithOwnerId(this.state.my_owner_id,params)
        let res = await PharmacyService.getPharmacy(this.state.my_owner_id, params)
        if (res.status) {
            console.log('ward', res.data.view.data)
            this.setState({
                wardList: res.data.view.data,
            }, () => {
                this.render()
            })
        }
    }

    // get Pharmacy info
    async getPharmacy() {

        let params = {
            // pharmacy : this.state.suggestedWareHouses?.pharmacy,
            issuance_type: 'pharmacy',
        }

        // let res = await WarehouseServices.getWarehoureWithOwnerId(this.state.my_owner_id,params)
        let res = await PharmacyService.getPharmacy(this.state.my_owner_id, params)
        if (res.status) {
            // console.log('weres', res.data.view.data)
            this.setState({
                pharmacyList: res.data.view.data,
            }, () => {
                this.render()
            })
        }
    }


    // get Clinic info
    async getClinic() {

        let params = {
            // Clinic : this.state.suggestedWareHouses?.Clinic,
            issuance_type: 'Clinic',

        }

        // let res = await WarehouseServices.getWarehoureWithOwnerId(this.state.my_owner_id,params)
        let res = await PharmacyService.getPharmacy(this.state.my_owner_id, params)
        if (res.status) {
            console.log('weres', res.data.view.data)
            this.setState({
                ClinicList: res.data.view.data,
            }, () => {
                this.render()
            })
        }
    }

    // get DrugStore info
    async getDrugStore() {

        let params = {
            // Clinic : this.state.suggestedWareHouses?.Clinic,
            issuance_type: 'drug_store',

        }

        // let res = await WarehouseServices.getWarehoureWithOwnerId(this.state.my_owner_id,params)
        let res = await PharmacyService.getPharmacy(this.state.my_owner_id, params)
        if (res.status) {
            console.log('weres', res.data.view.data)
            this.setState({
                drugStoreList: res.data.view.data,
            }, () => {
                this.render()
            })
        }
    }

    // get ward info
    //  async getWard() {

    //     let params = {
    //         my_owner_id: this.state.my_owner_id,
    //         page: this.state.wearehouseInfo?.page,
    //         limit: this.state.wearehouseInfo?.limit,
    //         Clinic : this.state.wearehouseInfo?.Clinic,
    //         pharmacy : this.state.wearehouseInfo?.pharmacy,
    //         Ward : this.state.wearehouseInfo?.Ward,
    //         Unit : this.state.wearehouseInfo?.Unit,
    //         issuance_type : this.state.wearehouseInfo?.issuance_type,
    //         drug_store : this.state.wearehouseInfo?.drug_store,
    //     }

    //     // getSuggestedWareHouse
    //     let res = await WarehouseServices.getWarehoureWithOwnerId(this.state.my_owner_id,params)
    //     if (res.status) {
    //         console.log('weres', res.data.view.data)
    //         this.setState({
    //             wearehouseInfo: res.data.view.data,
    //             // rows2: res.data.view.data,
    //             // suggestedtotalItems: res.data.view.totalItems,
    //             // loadingSuggestedWarehoues: true
    //         }, () => {
    //             this.render()
    //         })
    //     }
    // }


    async loadGroups() {
        let params = {}
        const res = await GroupSetupService.fetchAllGroup(params)

        if (res.status == 200) {
            this.setState({ allGroups: res.data.view.data })
        }
    }

    async loadSerials() {
        let params = {}
        const res = await GroupSetupService.getAllSerial(params)

        let loadSerial = this.state.allSerials
        if (res.status == 200) {
            var loadedData = res.data.view.data

            loadedData.forEach(element => {
                let loadSerials = {}
                loadSerials.name = element.code + "-" + element.name
                loadSerials.name2 = element.name
                loadSerials.id = element.id
                loadSerials.code = element.code
                loadSerials.status = element.status
                loadSerial.push(loadSerials)
            });
        }
        else {
            this.setState({
                alert: true,
                severity: 'error',
                message: res.data.error,
            })
        };
        this.setState({ allSerials: loadSerial })
    }

    async loadWH() {
        let params = {}
        const res = await WarehouseServices.getWarehoure(params)

        if (res.status == 200) {
            this.setState({ allWH: res.data.view.data })
        }
    }
    async loadVENS() {
        let params = {}
        const res = await WarehouseServices.getVEN(params)

        if (res.status == 200) {
            this.setState({ allVENS: res.data.view.data })
        }
    }

    async loadUOMS() {
        let params = {}
        const res = await ConsignmentService.getUoms(params)

        if (res.status == 200) {
            this.setState({ allUOMS: res.data.view.data })
        }
    }

    async loadStocks() {
        let params = {}
        const res = await WarehouseServices.getStocks(params)

        if (res.status == 200) {
            this.setState({ allStocks: res.data.view.data })
        }
    }
    async loadConditions() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getConditions(params)

        if (res.status == 200) {
            this.setState({ allConditions: res.data.view.data })
        }
    }

    async loadStorages() {
        let params = {}
        const res = await WarehouseServices.getStorages(params)

        if (res.status == 200) {
            this.setState({ allStorages: res.data.view.data })
        }
    }
    async loadBatchTraces() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getBatchTraces(params)

        if (res.status == 200) {
            this.setState({ allBatchTraces: res.data.view.data })
        }
    }
    async loadABCClasses() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getABCClasses(params)

        if (res.status == 200) {
            this.setState({ allABCClasses: res.data.view.data })
        }
    }

    async loadCyclicCodes() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getCyclicCodes(params)

        if (res.status == 200) {
            this.setState({ allCyclicCodes: res.data.view.data })
        }
    }
    async loadMovementTypes() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getMovementTypes(params)

        if (res.status == 200) {
            this.setState({ allMovementTypes: res.data.view.data })
        }
    }

    async loadItemTypes() {
        let params = {}
        const res = await WarehouseServices.getItemTypes(params)

        if (res.status == 200) {
            this.setState({ allItemTypes: res.data.view.data })
        }
    }

    async loadInstitutions() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getInstitutions(params)

        if (res.status == 200) {
            this.setState({ allInstitution: res.data.view.data })
        }
    }

    async loadItemUsageTypes() {
        let params = {}
        const res = await WarehouseServices.getItemUsageTypes(params)

        if (res.status == 200) {
            this.setState({ allItemUsageTypes: res.data.view.data })
        }
    }

    async getRequement(item_ids) {
        let params = {
            item_id: item_ids,
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


    async loadItem() {
        this.setState({ loaded: false })

        const res = await InventoryService.fetchAllItems(this.state.formData)
        console.log('loaddata', res.data.view.data)
        let group_id = 0
        if (res.status == 200) {
            if (res.data.view.data.length != 0) {
                group_id = res.data.view.data[0]

                let item_ids = res.data.view.data.map(x => x.id)
                this.getRequement(item_ids)
                // .pharmacy_order_id
            }
            // console.log('item Data', res.data.view.data[0].long_description)
            this.setState(
                {
                    data: res.data.view.data,
                    // loaded: true,
                    totalItems: res.data.view.totalItems,
                    totalPages: res.data.view.totalPages,
                    // long_description:res.data.view.data[0].long_description
                },
                () => {
                    this.render()
                    this.loadTotalQTY()
                    // this.getCartItems()
                }
            )

            let item_ids = res.data.view.data.map((el) => el.id)
            this.getConsumptionDet(item_ids, res.data.view.data)

        }
    }

    async getConsumptionDet(id, maindata) {

        console.log('dggdgdgsdasddd', maindata)


        //let Logged_owner_id = await localStorageService.getItem("owner_id")
        let Logged_owner_id = '000'
        console.log('warehouse1', Logged_owner_id)
        // let warehouse_id = selected_warehouse_cache?.id
        // console.log('warehouse2',warehouse_id)

        var today = new Date()
        var current_date = new Date()
        var preDay = current_date.setMonth(current_date.getMonth() - 1);   //  befour 1 month

        console.log('dates', dateParse(today), 'and', dateParse(preDay))

        let params1 = {
            to: dateParse(today),
            from: dateParse(preDay),
            item_id: id,
            avarage_consumption: true,
            owner_id: '000'
        }

        let res = await DashboardReportServices.getBatchConsumption(params1)
        console.log('res1', res)
        let updatedArray = []
        if (res.status) {

            for (let i = 0; i < maindata.length; i++) {
                const newArray = res.data.view.filter((x) => x.item_id == maindata[i].id
                );

                updatedArray.push(newArray[0]);
            }

            this.setState({
                msdComptumption: updatedArray,
            })

        }


        let params2 = {
            to: dateParse(today),
            from: dateParse(preDay),
            item_id: id,
            avarage_consumption: true,
            owner_id: Logged_owner_id
        }

        let res2 = await DashboardReportServices.getBatchConsumption(params2)
        console.log('res2', res2)
        let updatedArray2 = []
        if (res2.status) {

            for (let i = 0; i < maindata.length; i++) {
                // console.log('maindata',maindata[i])
                const newArray2 = res2.data.view.filter((x) => x.item_id == maindata[i].id
                );

                updatedArray2.push(newArray2[0]);
            }

            this.setState({
                myComptumption: updatedArray2,
            })

        }

        // if(owner_id != null){
        //     let batch_res2 = await PharmacyService.getDrugStocks(params3)
        //     if (batch_res2.status == 201) {
        //         let totalQty=[]
        //         //  totalQty = this.state.data.filter((x) =>x.data?.posted?.data?.item_id == element.id
        //         //   );
        //          for(let i=0; i<this.state.data.length; i++) {
        //             const totalqty = batch_res2.data.posted.data.filter((x) => x.item_id == this.state.data[i].id
        //               );

        //             totalQty.push(totalqty[0]);
        //       }
        //       console.log('sum22',totalQty)
        //       this.setState({
        //         otherQty:totalQty,
        //       })                  

        //     }
        // }


        // let params2 = {
        //     to : dateParse(today),
        //     from : dateParse(preDay),
        //     item_id : id,
        //     avarage_consumption:true,
        //     owner_id : Logged_owner_id
        // }

        // let res2 = await DashboardReportServices.getBatchConsumption(params2)
        // console.log('res2',res2)
        // if (res2.status) {
        //     updatedArray = maindata.map((obj1) => {
        //         const obj2 = res2.data.view.find((obj) => obj.item_id === obj1.id);

        //         if (obj2) {
        //           return { ...obj1, ...obj2 };
        //         }
        //         return obj1;
        //       });

        // }

        // this.setState(
        //     {
        //         data: updatedArray,
        //         //loaded: true,
        //         // totalItems: res.data.view.totalItems,
        //     },
        //     () => {
        //         this.render()
        //         // this.getCartItems()
        //     }
        // )

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

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState(
            {
                formData,
            },
            () => {
                this.loadItem()
            }
        )
    }

    // handle tab changes
    handleTabChange = (event, newValue) => {


        let suggestedWareHouses = { ...this.state.suggestedWareHouses };
        console.log("click tab", newValue)
        if (newValue == 0) {
            suggestedWareHouses.select_type = "MSD_ONLY";
            suggestedWareHouses.owner_id = '000';
        } else if (newValue == 1) {
            suggestedWareHouses.select_type = "RMSD_ONLY";
        } else if (newValue == 2) {
            suggestedWareHouses.select_type = "OTHER_INSTITUTE";
            suggestedWareHouses.owner_id = '000';
        }

        this.setState({ suggestedWareHouses, rows2: [] });
        this.setState({ activeTab: newValue, suggestedWareHouses }, () => {
            this.suggestedWareHouse();
        });
    };


    // suggestedWareHouse
    async getOtherInformation() {

        // tempDataList
        let params = {
            issuance_type: ["Hospital", "RMSD Main"],
            district: this.state.tempDataList.district //province
        };

        // get ownId list
        let res2 = await ClinicService.fetchAllClinicsNew(params, null);

        if (res2.status == 200) {
            console.log('information', res2)

            let dataSet = res2.data.view.data

            // // map ownid
            let itemslist = dataSet.map((index) => index.owner_id)
            let owenIdList = [...new Set(itemslist)]

            console.log('pack find', owenIdList)

            let suggestedWareHouses = this.state.suggestedWareHouses
            suggestedWareHouses.other_owner_id = owenIdList

            this.setState({
                suggestedWareHouses
            }, () => {
                this.suggestedWareHouse()
            })
        }

    }



    async suggestedWareHouse() {
        this.setState({ loadingSuggestedWarehoues: false })

        console.log('clicked', this.state.suggestedWareHouses)
        let res = await PharmacyOrderService.getSuggestedWareHouse(this.state.suggestedWareHouses)
        if (res.status) {
            console.log('suggested', res?.data?.view?.data)
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


    setSuggestedPage(page) {
        let suggestedWareHouses = this.state.suggestedWareHouses;
        suggestedWareHouses.page = page;
        this.setState({
            suggestedWareHouses
        }, () => {
            this.suggestedWareHouse()
        })
    }

    async componentDidMount() {

        // this.loadWarehousesForExchange()
        // this.loadGroups()
        // this.loadSerials()
        // this.loadWH()
        // this.loadVENS()
        // this.loadUOMS()
        // this.loadStocks()
        // this.loadConditions()
        // this.loadStorages()
        // this.loadBatchTraces()
        // this.loadABCClasses()
        // this.loadCyclicCodes()
        // this.loadMovementTypes()
        // this.loadItemTypes()
        // this.loadInstitutions()
        // this.loadItemUsageTypes()
        this.loadItem()
        // this.getUserOwnID()
    }















    async submitOrderExchange() {
        this.setState({ submitingExchange: true })
        let exchangeForm = this.state.exchangeForm
        console.log("exhange request", exchangeForm)
        let res = await WarehouseServices.requestDrugExchange(exchangeForm)
        if (res.status == 201) {
            console.log("Order Data res", res)

            let exchangeForm = this.state.exchangeForm;
            exchangeForm.required_date = null;
            exchangeForm.item_list[0].request_quantity = null;



            this.setState({
                exchangeForm,
                submitingExchange: false,
                exchangeWindow: false,
                alert: true,
                message: 'Order Created Successful',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                submitingExchange: false,
                message: 'Order Create Unsuccesful',
                severity: 'error',
            })
        }
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
                                    justifyContent: 'center'
                                }}>

                                <Grid item="item">
                                    <img
                                        style={{
                                            //width: '63px',
                                            height: '150px',
                                        }}
                                        src="/assets/images/swastha_logo _full_height.png"
                                        alt="swastha-logo"
                                    />

                                </Grid>
                            </Grid>
                        </div>



                        <ValidatorForm
                            onSubmit={() => this.setPage(0)}
                            onError={() => null}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>


                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    xs={12}
                                >
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

                                        }} InputProps={{
                                            endAdornment: (
                                                <IconButton type='submit' >

                                                    <SearchIcon ></SearchIcon>
                                                </IconButton>
                                            )
                                        }}



                                    />
                                </Grid>
                            </div>


                        </ValidatorForm>


                        <Divider className='mb-1 mt-1' />

                        {/* Table Section */}

                        {this.state.loaded ? (
                            <Grid container className="mt-5 pb-5">
                                {/* <Grid item lg={12} md={12} sm={12} xs={12} className='text-right'>
                                    <LoonsButton onClick={ ()=>this.printLoad() }>Print</LoonsButton>
                                </Grid> */}
                                <Grid item lg={12} md={12} sm={12} xs={12}>
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
                                            count: this.state.totalItems,
                                            rowsPerPage: 20,
                                            page: this.state.formData.page,
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                console.log(action, tableState)
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
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress size={30} />
                            </Grid>
                        )}
                    </LoonsCard>
                </MainContainer>



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
                    <div className="w-full h-full px-2 py-2">
                        <Grid container="container">
                            <Grid item="item" lg={12} md={12} xs={12} className="mb-4">
                                <div>
                                    <Grid item="item" lg={12} md={12} xs={12}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <CardTitle title=""></CardTitle>
                                            <IconButton aria-label="close" onClick={() => { this.setState({ individualView: false }) }}><CloseIcon /></IconButton>
                                        </div>
                                        {/* msdStockQty:Number(this.state.msdqty[dataIndex]?.quantity) || 0,
                                                            myStockQty:Number(this.state.instituteQty[dataIndex]?.quantity) || 0,
                                                            otherStockQty */}

                                        <Grid container>

                                            <Grid item xs={12}>
                                                <p style={{ fontSize: '12px' }} className='m-0 p-0'><spam style={{ fontWeight: 'bold' }}>Item Name : </spam>{this.state.itemName}</p>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <p style={{ fontSize: '12px' }} className='m-0 p-0'><spam style={{ fontWeight: 'bold' }}>MSD Stock : </spam>{convertTocommaSeparated(this.state.msdStockQty)}</p>
                                            </Grid>
                                            {/*   <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <p style={{ fontSize: '12px' }} className='m-0 p-0'><spam style={{ fontWeight: 'bold' }}>My Institution Stock : </spam>{convertTocommaSeparated(this.state.myStockQty)}</p>
                                            </Grid> */}
                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <p style={{ fontSize: '12px' }} className='m-0 p-0'><spam style={{ fontWeight: 'bold' }}>Other Institution Stock : </spam>{convertTocommaSeparated(this.state.otherStockQty)}</p>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <p style={{ fontSize: '12px' }} className='m-0 p-0'><spam style={{ fontWeight: 'bold' }}>National Stock : </spam>{convertTocommaSeparated(Number(this.state.msdStockQty) + Number(this.state.otherStockQty))}</p>
                                            </Grid>
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

                                                <Tab label="MSD" />
                                                <Tab label="RMSD" />
                                                <Tab label="Other Institute" />
                                            </Tabs>



                                            {this.state.activeTab == 0 ? <div>
                                                {/* MSD institute */}
                                                <Grid item="item" lg={12} md={12} xs={12} className="mt-10">
                                                    <ValidatorForm
                                                        className="pt-2"
                                                        onSubmit={() => this.suggestedWareHouse()}
                                                        onError={() => null}
                                                    >
                                                        {/*  <Grid container spacing={2}>


                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={4}
                                                                md={4}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <SubTitle title="Select Warehouse" />

                                                                <Autocomplete
                                                                    disableClearable
                                                                    className="w-full"
                                                                    options={this.state.filteredOptions.sort((a, b) => a.name?.localeCompare(b.name))}
                                                                    onChange={(e, value) => {
                                                                        if (value != null) {
                                                                            let suggestedWareHouses = this.state.suggestedWareHouses;
                                                                            suggestedWareHouses.other_warehouse_id = value.id;

                                                                            this.setState({
                                                                                suggestedWareHouses,
                                                                            });
                                                                        } else {
                                                                            let suggestedWareHouses = this.state.suggestedWareHouses;
                                                                            suggestedWareHouses.other_warehouse_id = null;

                                                                            this.setState({
                                                                                suggestedWareHouses,
                                                                            });
                                                                        }
                                                                    }}
                                                                    getOptionLabel={(option) => option.Warehouse?.name}
                                                                    renderInput={(params) => (
                                                                        <TextValidator
                                                                            {...params}
                                                                            placeholder="Select Warehouse"
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onInput={(e) => {
                                                                                const inputValue = e.target.value;
                                                                                let filteredOptions = [];

                                                                                if (this.state.allWH && inputValue.length >= 3) {
                                                                                    filteredOptions = this.state.allWH.filter((option) =>
                                                                                        option.name.toLowerCase().includes(inputValue.toLowerCase())
                                                                                    );
                                                                                }

                                                                                this.setState({ filteredOptions });
                                                                            }}
                                                                        />

                                                                    )}
                                                                />

                                                            </Grid> 
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={2}
                                                                md={2}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <Button
                                                                    className="mt-6 mr-2"
                                                                    progress={false}
                                                                    type="submit"
                                                                    scrollToTop={false}
                                                                    startIcon="save"
                                                                //onClick={this.handleChange}
                                                                >
                                                                    <span className="capitalize">
                                                                        Search
                                                                    </span>
                                                                </Button>

                                                            </Grid>



                                                        </Grid> */}

                                                    </ValidatorForm>
                                                    {this.state.loadingSuggestedWarehoues ?
                                                        <LoonsTable
                                                            //title={"All Aptitute Tests"}
                                                            id={'suggested'} data={this.state.rows2}
                                                            columns={this.state.suggestedWareHouseColumn}
                                                            options={{
                                                                pagination: true,
                                                                serverSide: true,
                                                                print: false,
                                                                viewColumns: false,
                                                                download: false,
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
                                                {/* RMSD institute */}
                                                <Grid item="item" lg={12} md={12} xs={12} className="mt-10">
                                                    <ValidatorForm
                                                        className="pt-2"
                                                        onSubmit={() => this.suggestedWareHouse()}
                                                        onError={() => null}
                                                    >
                                                        {/* <Grid container spacing={2}>


                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={4}
                                                                md={4}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <SubTitle title="Select Warehouse" />

                                                                <Autocomplete
                                                                    disableClearable
                                                                    className="w-full"
                                                                    options={this.state.filteredOptions.sort((a, b) => a.name?.localeCompare(b.name))}
                                                                    onChange={(e, value) => {
                                                                        if (value != null) {
                                                                            let suggestedWareHouses = this.state.suggestedWareHouses;
                                                                            suggestedWareHouses.other_warehouse_id = value.id;

                                                                            this.setState({
                                                                                suggestedWareHouses,
                                                                            });
                                                                        } else {
                                                                            let suggestedWareHouses = this.state.suggestedWareHouses;
                                                                            suggestedWareHouses.other_warehouse_id = null;

                                                                            this.setState({
                                                                                suggestedWareHouses,
                                                                            });
                                                                        }
                                                                    }}
                                                                    getOptionLabel={(option) => option.Warehouse?.name}
                                                                    renderInput={(params) => (
                                                                        <TextValidator
                                                                            {...params}
                                                                            placeholder="Select Warehouse"
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onInput={(e) => {
                                                                                const inputValue = e.target.value;
                                                                                let filteredOptions = [];

                                                                                if (this.state.allWH && inputValue.length >= 3) {
                                                                                    filteredOptions = this.state.allWH.filter((option) =>
                                                                                        option.name.toLowerCase().includes(inputValue.toLowerCase())
                                                                                    );
                                                                                }

                                                                                this.setState({ filteredOptions });
                                                                            }}
                                                                        />

                                                                    )}
                                                                />

                                                            </Grid>
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={2}
                                                                md={2}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <Button
                                                                    className="mt-6 mr-2"
                                                                    progress={false}
                                                                    type="submit"
                                                                    scrollToTop={false}
                                                                    startIcon="save"
                                                                //onClick={this.handleChange}
                                                                >
                                                                    <span className="capitalize">
                                                                        Search
                                                                    </span>
                                                                </Button>

                                                            </Grid>



                                                        </Grid>
 */}
                                                    </ValidatorForm>
                                                    {this.state.loadingSuggestedWarehoues ?
                                                        <LoonsTable
                                                            //title={"All Aptitute Tests"}
                                                            id={'suggested'} data={this.state.rows2}
                                                            columns={this.state.suggestedWareHouseColumn}
                                                            options={{
                                                                pagination: true,
                                                                serverSide: true,
                                                                print: false,
                                                                viewColumns: false,
                                                                download: false,
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
                                                {/* other institute */}
                                                <Grid item="item" lg={12} md={12} xs={12} className="mt-10">
                                                    <ValidatorForm
                                                        className="pt-2"
                                                        onSubmit={() => this.getOtherInformation()}
                                                        onError={() => null}
                                                    >

                                                        <Grid container spacing={2}>

                                                            {/* Province */}
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={4}
                                                                md={4}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <SubTitle title="Select Province" />

                                                                <Autocomplete
                                                                    disableClearable
                                                                    className="w-full"
                                                                    options={appConst.allProvince}
                                                                    // options={this.state.filteredOptions.sort((a, b) => a.name?.localeCompare(b.name))}
                                                                    onChange={(e, value) => {
                                                                        console.log('dropped value', e, value)
                                                                        if (value != null) {
                                                                            let tempDataList = this.state.tempDataList;
                                                                            tempDataList.province = value.value;

                                                                            this.setState({
                                                                                tempDataList,
                                                                                province_selection: false,
                                                                                search_enable: true
                                                                            });
                                                                        } else {
                                                                            let tempDataList = this.state.tempDataList;
                                                                            tempDataList.other_warehouse_id = null;

                                                                            this.setState({
                                                                                tempDataList,
                                                                                province_selection: true
                                                                            });
                                                                        }
                                                                    }}
                                                                    // getOptionLabel={(option) => option.Warehouse?.name}
                                                                    getOptionLabel={(option) => option.label}
                                                                    renderInput={(params) => (
                                                                        <TextValidator
                                                                            {...params}
                                                                            placeholder="Select Province"
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            size="small"
                                                                        // onInput={(e) => {
                                                                        //     const inputValue = e.target.value;
                                                                        //     let filteredOptions = [];

                                                                        //     if (this.state.allWH && inputValue.length >= 3) {
                                                                        //         filteredOptions = this.state.allWH.filter((option) =>
                                                                        //             option.name.toLowerCase().includes(inputValue.toLowerCase())
                                                                        //         );
                                                                        //     }

                                                                        //     this.setState({ filteredOptions });
                                                                        // }}
                                                                        />

                                                                    )}
                                                                />

                                                            </Grid>

                                                            {/* District */}
                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={4}
                                                                md={4}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <SubTitle title="Select District" />

                                                                <Autocomplete
                                                                    disableClearable
                                                                    className="w-full"
                                                                    disabled={this.state.province_selection}
                                                                    options={appConst.allDistrict.filter(
                                                                        (district) => district.province === this.state.tempDataList?.province)
                                                                    }
                                                                    // options={this.state.filteredOptions.sort((a, b) => a.name?.localeCompare(b.name))}
                                                                    onChange={(e, val) => {
                                                                        console.log('dropped value', e, val)
                                                                        if (val != null) {
                                                                            let tempDataList = this.state.tempDataList;
                                                                            tempDataList.district = val.value;

                                                                            this.setState({
                                                                                tempDataList,
                                                                                search_enable: false
                                                                            });
                                                                        } else {
                                                                            let tempDataList = this.state.tempDataList;
                                                                            tempDataList.other_warehouse_id = null;

                                                                            this.setState({
                                                                                tempDataList,
                                                                            });
                                                                        }
                                                                    }}

                                                                    // getOptionLabel={(option) => option.Warehouse?.name}
                                                                    getOptionLabel={(option) => option.label}
                                                                    renderInput={(params) => (
                                                                        <TextValidator
                                                                            {...params}
                                                                            placeholder="Select District"
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            size="small"
                                                                        />

                                                                    )}
                                                                />

                                                            </Grid>

                                                            {/* <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={4}
                                                                md={4}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <SubTitle title="Select Warehouse" />

                                                                <Autocomplete
                                                                    disableClearable
                                                                    className="w-full"
                                                                    options={this.state.filteredOptions.sort((a, b) => a.name?.localeCompare(b.name))}
                                                                    onChange={(e, value) => {
                                                                        if (value != null) {
                                                                            let suggestedWareHouses = this.state.suggestedWareHouses;
                                                                            suggestedWareHouses.other_warehouse_id = value.id;

                                                                            this.setState({
                                                                                suggestedWareHouses,
                                                                                
                                                                            });
                                                                        } else {
                                                                            let suggestedWareHouses = this.state.suggestedWareHouses;
                                                                            suggestedWareHouses.other_warehouse_id = null;

                                                                            this.setState({
                                                                                suggestedWareHouses,
                                                                                
                                                                            });
                                                                        }
                                                                    }}
                                                                    getOptionLabel={(option) => option.Warehouse?.name}
                                                                    renderInput={(params) => (
                                                                        <TextValidator
                                                                            {...params}
                                                                            placeholder="Select Warehouse"
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onInput={(e) => {
                                                                                const inputValue = e.target.value;
                                                                                let filteredOptions = [];

                                                                                if (this.state.allWH && inputValue.length >= 3) {
                                                                                    filteredOptions = this.state.allWH.filter((option) =>
                                                                                        option.name.toLowerCase().includes(inputValue.toLowerCase())
                                                                                    );
                                                                                }

                                                                                this.setState({ filteredOptions });
                                                                            }}
                                                                        />

                                                                    )}
                                                                />

                                                            </Grid> */}

                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={2}
                                                                md={2}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <Button
                                                                    className="mt-6 mr-2"
                                                                    progress={false}
                                                                    type="submit"
                                                                    scrollToTop={false}
                                                                    startIcon="save"
                                                                    disabled={this.state.search_enable}
                                                                //onClick={this.handleChange}
                                                                >
                                                                    <span className="Hcapitalize">
                                                                        Search
                                                                    </span>
                                                                </Button>

                                                            </Grid>



                                                        </Grid>

                                                    </ValidatorForm>
                                                    {this.state.loadingSuggestedWarehoues ?
                                                        <LoonsTable
                                                            //title={"All Aptitute Tests"}
                                                            id={'suggested'}
                                                            data={this.state.rows2}
                                                            columns={this.state.suggestedWareHouseColumn}
                                                            options={{
                                                                pagination: true,
                                                                serverSide: true,
                                                                print: false,
                                                                viewColumns: false,
                                                                download: false,
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
                                    {/* : null } */}
                                    {/* <Grid item="item" lg={12} md={12} xs={12} className="mt-10">
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
                                    </Grid> */}


                                </div>
                            </Grid>
                            {/* {this.state.pload ? */}
                            {/* <Grid>
                                <DetailLedgerReports></DetailLedgerReports>
                            </Grid> */}
                            {/* :null} */}



                        </Grid>
                    </div>

                </Dialog>







                <Dialog
                    style={{
                        padding: '10px'
                    }}
                    maxWidth="md"
                    fullWidth={true}
                    open={this.state.exchangeWindow}
                    onClose={() => {
                        // this.setState({individualView: false})
                    }}>

                    <LoonsCard>
                        <Grid item="item" lg={12} md={12} xs={12}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <CardTitle title="Exchange Request"></CardTitle>
                                <IconButton aria-label="close" onClick={() => { this.setState({ exchangeWindow: false }) }}><CloseIcon /></IconButton>
                            </div>
                        </Grid>


                        <div className="w-full h-full px-5 py-5">
                            <ValidatorForm onSubmit={() => { this.submitOrderExchange() }}>
                                <Grid container="container" spacing={2}>
                                    <Grid item="item" lg={4} md={4} xs={4} className="mb-4">
                                        <SubTitle title="Select Your Warehouse" />
                                        <Autocomplete
                                            disableClearable className="w-full"
                                            // ref={elmRef}
                                            value={this.state.all_pharmacy_dummy.find((x) => x.id == this.state.exchangeForm.from)}
                                            options={this.state.all_pharmacy_dummy.sort((a, b) => (a.name.localeCompare(b.name)))}
                                            onChange={(e, value) => {
                                                if (value != null) {

                                                    let exchangeForm = this.state.exchangeForm
                                                    exchangeForm.from = value.id
                                                    this.setState({ exchangeForm })

                                                } else {
                                                    let exchangeForm = this.state.exchangeForm
                                                    exchangeForm.from = null
                                                    this.setState({ exchangeForm })
                                                }
                                            }}

                                            getOptionLabel={(option) => option.name != null ? option.name + " - " + option.main_or_personal : null}
                                            renderInput={(params) => (
                                                <TextValidator {...params} placeholder="Select Your Warehouse"
                                                    //variant="outlined"
                                                    value={this.state.all_pharmacy_dummy.find((x) => x.id == this.state.exchangeForm.from)}

                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                    fullWidth="fullWidth" variant="outlined" size="small" />
                                            )} />
                                    </Grid>


                                    <Grid item="item" lg={4} md={4} xs={4} className="mb-4">
                                        <SubTitle title="Request Quantity" />
                                        <TextValidator
                                            className="w-full"
                                            placeholder="Request Quantity"
                                            //variant="outlined"
                                            fullWidth="fullWidth"
                                            variant="outlined"
                                            size="small"
                                            value={this.state.exchangeForm.item_list[0].request_quantity}
                                            onChange={(e, value) => {
                                                let exchangeForm = this.state.exchangeForm
                                                exchangeForm.item_list[0].request_quantity = e.target.value
                                                this.setState({ exchangeForm })

                                            }}
                                            validators={[
                                                'required',
                                            ]}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>


                                    <Grid item="item" lg={4} md={4} xs={4} className="mb-4">
                                        <SubTitle title="Required Date" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.exchangeForm?.required_date}
                                            //label="Date From"
                                            placeholder="Required Date"
                                            minDate={new Date()}
                                            //maxDate={new Date("2020-10-20")}
                                            required={true}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let exchangeForm = this.state.exchangeForm
                                                exchangeForm.required_date = date
                                                this.setState({ exchangeForm })
                                            }}
                                        />
                                    </Grid>

                                    <Grid item="item" lg={1} md={1} xs={1} >
                                        <Button
                                            className=""
                                            progress={this.state.submitingExchange}
                                            type="submit"
                                            scrollToTop={false}
                                            startIcon="save"
                                        >Request</Button>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>

                        </div>
                    </LoonsCard>
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
                        <ItemsBatchView id={this.state.selected_item_id} warehouse_id={this.state.item_warehouse_id}></ItemsBatchView>
                    </div>
                </Dialog>


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
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(CheckOtherStocks)
