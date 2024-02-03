import {
    CircularProgress,
    Dialog,
    Divider,
    Grid,
    InputAdornment,
    Typography,
    FormControlLabel,
    Radio,
    Tooltip,
    Icon,
    IconButton,
} from '@material-ui/core'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { Autocomplete } from '@material-ui/lab'
import {
    Button,
    CardTitle,
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    MainContainer,
    SubTitle,
    PrintDataTable,
} from 'app/components/LoonsLabComponents'
import LoonsDatePicker from "app/components/LoonsLabComponents/DatePicker";
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import React, { Fragment } from 'react'
import { Component } from 'react'
import SearchIcon from '@material-ui/icons/Search'
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import CategoryService from 'app/services/datasetupServices/CategoryService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import WarehouseServices from 'app/services/WarehouseServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import ApartmentIcon from '@material-ui/icons/Apartment'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import localStorageService from 'app/services/localStorageService'
import { convertTocommaSeparated, dateParse, roundDecimal } from 'utils'
import ClinicService from 'app/services/ClinicService';
import EstimationService from 'app/services/EstimationService';
import InventoryService from 'app/services/InventoryService';

class DetailsView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            updateData: {
                noOfDays: 0,
            },
            processing: false,
            selectedWarehouseData: null,
            isFilledPageNo: false,
            isFilledBookNo: false,

            all_item_category: [],
            all_item_class: [],
            all_item_group: [],
            all_start_sr: [],
            all_end_sr: [],

            //return process
            returnDialog: false,
            returnQuantity: null,
            currentAvailableqty: null,
            drugStoreData: [],
            selected_ds: null,
            remarks: [],
            remarkID: null,
            otherRemark: null,
            currentStock: null,
            itemQuantity: null,

            alert: false,
            message: '',
            severity: 'success',
            filterData: {
                page: 0,
                limit: 25,
                //warehouse_id: this.props.match.params.id,
                warehouse_id: null,
                exp_date_order: true,
                exp_date_grater_than_zero_search: true,
                quantity_grater_than_zero_search: true,
                search: null,
                start_sr: null,
                end_sr: null,
                class_id: null,
                category_id: null,
                group_id: null,
                lessStock: null,
                moreStock: null,
                item_status: ['Active', 'Pending', 'DC', 'Discontinued'],
                orderby_drug: true,
                orderby_sr: true
            },

            formData: {
                type: "DIRECTDISTRIBUTION",
                from: this.props.match.params.id,
                to: null,
                required_date: new Date(),
                issued_date: null,
                allocated_date: null,
                number_of_items: 0,
                book_no: null,
                page_no: null,
                item_list: [],
                orderby_sr: true
            },

            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
            loaded: true,
            printLoaded: false,
            totalItems: 0,
            selectWarehouseView: false,
            warehouse_loaded: false,
            selectedWarehouse: null,
            allWarehouses: [],

            isConvert: false,


            estimationData: null,
            itemBatch: null,

            bookNoReq: true,
            columns: [
                {
                    name: 'ItemSnap', // field name in the row object
                    label: 'SR Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex]
                                    .ItemSnapBatch?.ItemSnap?.sr_no
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return cellData
                            }
                        },
                    },
                },
                // {
                //     name: 'item_id', // field name in the row object
                //     label: 'Item Code', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
                {
                    name: 'ItemSnap', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex]
                                    .ItemSnapBatch?.ItemSnap?.medium_description
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return cellData
                            }
                        },
                    },
                },
                {
                    name: 'batch_no', // field name in the row object
                    label: 'Batch No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex]
                                    .ItemSnapBatch?.batch_no
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return cellData
                            }
                        },
                    },
                },
                {
                    name: 'EXD', // field name in the row object
                    label: 'EXD', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex]
                                    .ItemSnapBatch?.exd
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return dateParse(cellData)
                            }
                        },
                    },
                },

                {
                    name: 'pack_size', // field name in the row object
                    label: 'Minimum Pack Size', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex].ItemSnapBatch?.pack_size

                            if (this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU') {
                                if (cellData == null) {
                                    return 'N/A'
                                } else {
                                    return Math.floor(this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size)
                                }
                            } else {
                                if (cellData == null) {
                                    return 'N/A'
                                } else {
                                    return Math.floor(cellData)
                                }
                            }


                        },
                    },
                },
                {
                    name: 'quantity', // field name in the row object
                    label: 'Quantity', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let cellData = this.state.data[tableMeta.rowIndex].quantity
                            if (this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU') {

                                if (cellData == null) {
                                    return 0
                                } else {
                                    return convertTocommaSeparated((Math.floor(cellData) * this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size), 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name
                                }

                            } else {

                                if (cellData == null) {
                                    return 0
                                } else {
                                    return convertTocommaSeparated(Math.floor(cellData), 2)
                                }

                            }

                        },
                    },
                },


                {
                    name: 'Available quantity', // field name in the row object
                    label: 'Available Quantitiy', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let totalQty = Number(this.state.data[tableMeta.rowIndex].quantity)
                            // let allocatedQuantitiy = this.getAllocatedQuantitiy(this.state.data[tableMeta.rowIndex].id)

                            let data = this.state.itemBatch.filter((data) => data.item_batch_bin_id == this.state.data[tableMeta.rowIndex].id)
                            let reserved_quantity = Number(data[0]?.reserved_quantity ? data[0]?.reserved_quantity : 0)
                            let allocatedQuantitiy = isNaN(reserved_quantity) ? 0 : reserved_quantity

                            let quantity = (isNaN(totalQty) ? 0 : totalQty) - allocatedQuantitiy

                            if (this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU') {
                                return convertTocommaSeparated(quantity < 0 ? 0 : (quantity * this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size)) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name
                            } else {
                                return convertTocommaSeparated(quantity < 0 ? 0 : quantity, 2);
                            }



                        },
                    },
                },

                {
                    name: 'quantity', // field name in the row object
                    label: 'Annual Estimation', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            //let annualEstimation = Number(this.getAnnualEstimation(this.state.data[tableMeta.rowIndex].item_id))


                            let data = this.state.estimationData.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.item_id)
                            console.log("anual estimation", this.state.estimationData)
                            let annualEst = Number(data[0]?.estimation ? data[0]?.estimation : 0)
                            let annualEstimation = isNaN(annualEst) ? 0 : annualEst

                            let quantity = (isNaN(annualEstimation) ? 0 : annualEstimation)
                            return convertTocommaSeparated(quantity, 2);

                        },
                    },
                },
                {
                    name: 'quantity', // field name in the row object
                    label: 'Monthly Estimation', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            //let annualEstimation = Number(this.getAnnualEstimation(this.state.data[tableMeta.rowIndex].item_id))


                            let data = this.state.estimationData.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.item_id)
                            let annualEst = Number(data[0]?.estimation ? data[0]?.estimation : 0)
                            let annualEstimation = isNaN(annualEst) ? 0 : annualEst

                            let quantity = (isNaN(annualEstimation) ? 0 : annualEstimation)
                            return convertTocommaSeparated(quantity / 12, 2);

                        },
                    },
                },
                {
                    name: 'quantity', // field name in the row object
                    label: 'Remaining Estimation', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            //let remainingEstimation = Number(this.getRemainingEstimation(this.state.data[tableMeta.rowIndex].item_id))

                            let data = this.state.estimationData.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.item_id)
                            let annualEstimation = Number(data[0]?.estimation ? data[0]?.estimation : 0)
                            let issued_quantity = Number(data[0]?.issued_quantity ? data[0]?.issued_quantity : 0)

                            let remainingEstimation = (isNaN(annualEstimation) ? 0 : annualEstimation) - (isNaN(issued_quantity) ? 0 : issued_quantity)

                            return convertTocommaSeparated(remainingEstimation, 2);

                        },
                    },
                },

                {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        display: true,

                        customBodyRender: (value, tableMeta, updateValue) => {

                            let totalQty = Number(this.state.data[tableMeta.rowIndex].quantity)
                            // let allocatedQuantitiy = this.getAllocatedQuantitiy(this.state.data[tableMeta.rowIndex].id)

                            let data = this.state.itemBatch.filter((data) => data.item_batch_bin_id == this.state.data[tableMeta.rowIndex].id)
                            let reserved_quantity = Number(data[0]?.reserved_quantity ? data[0]?.reserved_quantity : 0)
                            let allocatedQuantitiy = isNaN(reserved_quantity) ? 0 : reserved_quantity
                            let quantity
                            if (this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU') {
                                quantity = ((isNaN(totalQty) ? 0 : totalQty) - allocatedQuantitiy) * this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size
                            } else {
                                quantity = (isNaN(totalQty) ? 0 : totalQty) - allocatedQuantitiy
                            }


                            return (

                                //  (parseInt(this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity)) < (parseInt(this.state.data[tableMeta.rowIndex].allocated_quantity)) ?
                                //     (
                                <ValidatorForm onSubmit={() => { this.addBatch(this.state.data[tableMeta.rowIndex]) }}>
                                    {(this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU' && this.state.data[tableMeta.rowIndex].allocated_quantity > 0) &&
                                        <p className='pt-1 pb-1 pl-5 pr-5' style={{ border: '1px solid #ffd600', backgroundColor: '#fff59d', borderRadius: '3px', textAlign: 'center' }}>{roundDecimal(this.state.data[tableMeta.rowIndex].allocated_quantity / this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.MeasuringUnit?.name}</p>
                                    }
                                    <TextValidator
                                        placeholder="Allocated Qty"
                                        name="allocate_qty"
                                        style={{ width: '100%' }}
                                        disabled={
                                            this.state.formData.item_list
                                                .map((obj) =>
                                                    obj.batch_list.map(
                                                        (item) => item.item_batch_bin_id
                                                    )
                                                )
                                                .flat()
                                                .includes(this.state.data[tableMeta.rowIndex].id)
                                        }
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        // InputProps={{
                                        //     endAdornment: (
                                        //         this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU' ? (
                                        //             <InputAdornment position="end" className='mr-1'>
                                        //                 {this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.display_unit}
                                        //             </InputAdornment>
                                        //         ) : null // Render nothing when the condition is not met
                                        //     )
                                        // }}

                                        value={this.state.data[tableMeta.rowIndex].allocated_quantity}
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        min={0}
                                        onFocus={() =>
                                            this.setState({ disabledAddIconRowIndex: tableMeta.rowIndex })
                                        }
                                        onBlur={() => this.setState({ disabledAddIconRowIndex: -1 })}
                                        onChange={(e) => {
                                            let data = this.state.data;
                                            data[tableMeta.rowIndex].allocated_quantity = e.target.value;

                                            // if (this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU'){
                                            //     if (e.target.value < 0) {
                                            //         this.setState({
                                            //             data,
                                            //             disabledAddIconRowIndex: tableMeta.rowIndex,
                                            //             isConvert:true,
                                            //         });
                                            //     } else {
                                            //         this.setState({ 
                                            //             data,
                                            //             isConvert:true,
                                            //         });
                                            //     }
                                            // } else {
                                            if (e.target.value < 0) {
                                                this.setState({
                                                    data,
                                                    disabledAddIconRowIndex: tableMeta.rowIndex,
                                                });
                                            } else {
                                                this.setState({ data });
                                            }

                                            // }

                                        }}
                                        validators={[
                                            "maxNumber:" + quantity,
                                        ]}
                                        errorMessages={[
                                            "Cannot Allocate More than Available Qty",
                                        ]}
                                        // InputProps={{
                                        //     endAdornment: (
                                        //         <InputAdornment position="end">
                                        //             <IconButton
                                        //                 type="submit"
                                        //                 size="small"
                                        //                 color="primary"
                                        //             /*  disabled={
                                        //                  this.state.disabledAddIconRowIndex !== tableMeta.rowIndex ||
                                        //                  this.state.data[tableMeta.rowIndex].allocated_quantity < 0
                                        //              } */
                                        //             >
                                        //                 <AddIcon />
                                        //             </IconButton>
                                        //         </InputAdornment>
                                        //     ),
                                        // }}

                                        InputProps={{
                                            endAdornment: (
                                                <>

                                                    {this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU' ? (
                                                        <InputAdornment position="end" className='mr-1'>
                                                            {this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name}
                                                        </InputAdornment>
                                                    ) : null}
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            type="submit"
                                                            size="small"
                                                            color="primary"
                                                        /*  disabled={
                                                            this.state.disabledAddIconRowIndex !== tableMeta.rowIndex ||
                                                            this.state.data[tableMeta.rowIndex].allocated_quantity < 0
                                                        } */
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                    </InputAdornment>

                                                </>
                                            )
                                        }}
                                    />
                                </ValidatorForm>
                            )
                        },
                    },
                },

            ],
            data: [],
            printData: [],

            addedList: [],
            addedListloaded: true,
            addedListColumns: [
                {
                    name: 'item_batch_bin_id',
                    label: '',
                    options: {
                        filter: true,
                        display: false,

                    },
                },
                {
                    name: 'sr_no',
                    label: 'SR Number',
                    options: {
                        filter: true,
                        display: true,

                    },
                },
                {
                    name: 'batch_no',
                    label: 'Batch No',
                    options: {
                        filter: true,
                        display: true,

                    },
                },
                {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        filter: true,
                        display: true,

                    },
                }, {
                    name: 'allocated_quantity',
                    label: 'Allocated Qty',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let allData = this.state.formData.item_list.map(obj => obj.batch_list.map(item => item)).flat()
                            let data = allData.length > 0 ? allData[tableMeta.rowIndex] : null
                            console.log('dta', data)
                            if (data?.converted_order_uom === "EU") {
                                return (data?.allocated_quantity * data?.item_unit_size) + ' ' + data?.DisplayUnit
                            } else {
                                return data?.allocated_quantity
                            }
                        }

                    },
                },

                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <div className='flex'>
                                    <Tooltip title="Add ">
                                        <IconButton size="small" color="primary" aria-label="view"
                                            onClick={() => {
                                                this.removeItem(tableMeta)
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            )
                        }

                    },
                },
            ]

        }


    }

    // setDate() {
    //     // let date = required_date
    //     let newDate = dateParse(new Date())

    //     console.log('date',newDate)
    //     // let todaydate = this.state.formData.required_date
    //      this.setState({required_date : newDate})
    // }

    handleTextChangePage = (value, error) => {
        const { formData } = this.state;
        formData.page_no = value;

        this.setState({
            formData,
            isFilledPageNo: !error,
        });
    };

    handleTextChangeBook = (value, error) => {
        const { formData } = this.state;
        formData.page_no = value;

        this.setState({
            formData,
            isFilledBookNo: !error,
        });
    };









    async loadFilterData() {
        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
        let class_res = await ClassDataSetupService.fetchAllClass({
            limit: 99999,
        })
        if (class_res.status == 200) {
            console.log('Classes', class_res.data.view.data)
            this.setState({ all_item_class: class_res.data.view.data })
        }
        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        if (group_res.status == 200) {
            console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_group: group_res.data.view.data })
        }
        //commented by roshan
        // GET SR
        /* let start_sr = await WarehouseServices.getSingleItemWarehouse({})
        if (start_sr.status == 200) {
            console.log('start_sr', start_sr.data.view.data)
            this.setState({ all_start_sr: start_sr.data.view.data,all_end_sr: start_sr.data.view.data })
        } */
        /* let end_sr = await WarehouseServices.getSingleItemWarehouse({})
        if (end_sr.status == 200) {
            console.log('end_sr', end_sr.data.view.data)
            this.setState({ all_end_sr: end_sr.data.view.data })
        } */


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
                console.log('New filterData', this.state.filterData)
                this.loadOrderList()
            }
        )
    }

    async loadWarehouses() {
        this.setState({
            warehouse_loaded: false,
        })
        var user = await localStorageService.getItem('userInfo')
        console.log('user', user)
        var id = user.id
        var all_pharmacy_dummy = []
        var selected_warehouse_cache = await localStorageService.getItem(
            'Selected_Warehouse'
        )
        if (!selected_warehouse_cache) {
            this.setState({
                selectWarehouseView: true,
            })
        } else {
            this.state.filterData.warehouse_id = selected_warehouse_cache.id
            this.setState({
                selectWarehouseView: false,
                warehouse_loaded: true,
            })
        }
        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params)
        if (res.status == 200) {
            console.log('CPALLOders', res.data.view.data)

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
                allWarehouses: all_pharmacy_dummy,
            })
        }
    }

    async loadWarehouseData() {
        let params = {}
        let res = await ClinicService.fetchClinicsById(params, this.props.match.params.id);
        if (res.status == 200) {
            console.log("Clinic by id", res.data.view)
            this.setState({
                selectedWarehouseData: res.data.view
            }, () => {
                this.loadOrderList()
                this.loadFilterData()

            })
        }
    }


    loadOrderList = async () => {
        this.setState({ loaded: false, cartStatus: [] })
        let res = await WarehouseServices.getSingleItemWarehouse(
            this.state.filterData
        )
        if (res.status) {
            console.log('data', res.data.view.data)
            this.setState(
                {
                    data: res.data.view.data,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.loadItemEstimations()
                    // this.getCartItems()
                }
            )
        }

    }

    async loadItemEstimations() {

        let owner_id = this.state.selectedWarehouseData?.owner_id

        let data = this.state.data;
        const itemIdSet = new Set(data.map(item => item.ItemSnapBatch.item_id));

        // Converting the set to an array
        const itemIdArray = Array.from(itemIdSet);
        console.log("unique item ids array", itemIdArray);



        let params = {
            warehouse_id: owner_id == "NA0000" ? this.props.match.params.id : null,
            owner_id: owner_id == "NA0000" ? null : owner_id,
            item_id: itemIdArray,
            estimation_status: 'Active',
            available_estimation: 'Active',
            status: 'Active',
            hospital_estimation_status: 'Active',
            'order[0]': ['createdAt', 'DESC'],


        }

        let res = await EstimationService.getAllEstimationITEMS(params)
        if (res.status == 200) {
            console.log("loaded data estimation", res.data?.view?.data)
            this.setState({
                estimationData: res.data?.view?.data
            }, () => {
                this.orderBatchAllocation(itemIdArray)
            })
        }


    }

    async orderBatchAllocation(items) {
        let owner_id = await localStorageService.getItem('owner_id')
        let itemFilter = {
            item_id: items,
            // warehouse_id: this.state.allocate.warehouse_id,
            warehouse_id: this.state.formData.to,
            owner_id: owner_id,
            status: 'Active',
            from_date: null,
            to_date: null,
            allocation_sum: true
        }

        console.log("itemBtach", itemFilter)
        this.setState({ loaded: false })
        let posted = await InventoryService.getOrderItemAllocation(itemFilter)
        if (posted.status == 200) {
            console.log('Orders', posted.data)
            this.setState(
                {
                    itemBatch: posted?.data.view.data,
                    loaded: true,
                }
            )
        } else {
            this.setState({
                loaded: true
            })
        }

        console.log('itemsnap', this.state.itemsnap)
    }

    async componentDidMount() {
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse')
        var user_info = await localStorageService.getItem('userInfo')
        let filterData = this.state.filterData;
        let formData = this.state.formData;

        formData.to = selected_warehouse_cache.id;
        formData.created_by = user_info.id

        if (user_info.roles.includes('RMSD OIC') || user_info.roles.includes('RMSD MSA') || user_info.roles.includes('RMSD Pharmacist')) {
            this.setState({
                bookNoReq: false
            })
        }


        filterData.warehouse_id = selected_warehouse_cache.id
        // filterData.warehouse_id = selected_warehouse_cache.id
        this.setState({ filterData, formData }, () => {

            this.loadWarehouseData()
        })

        // this.setDate()
    }


    addBatch(row) {
        console.log("allocating row", row)

        this.setState({ addedListloaded: false })
        let formData = this.state.formData;

        const index = formData.item_list.findIndex(object => {
            return object.item_id === row?.ItemSnapBatch?.item_id;
        });

        let itemEstimationData = this.state.estimationData.find((data) => data.item_id == row?.ItemSnapBatch?.item_id)

        if (index == -1) {

            if (row?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU') {
                formData.item_list.push(
                    {
                        item_id: row?.ItemSnapBatch?.item_id,
                        request_quantity: row.allocated_quantity / row?.ItemSnapBatch?.ItemSnap?.item_unit_size,
                        estimation_id: itemEstimationData ? itemEstimationData.id : null,
                        batch_list: [
                            {
                                sr_no: row?.ItemSnapBatch?.ItemSnap?.sr_no,
                                item_name: row?.ItemSnapBatch?.ItemSnap?.medium_description,
                                batch_no: row?.ItemSnapBatch?.batch_no,
                                item_batch_bin_id: row.id,
                                bin_id: row.bin_id,
                                allocated_quantity: row.allocated_quantity / row?.ItemSnapBatch?.ItemSnap?.item_unit_size,
                                allocated_volume: Number(row.quantity) / Number(row.volume) * Number(row.allocated_quantity),
                                converted_order_uom: row?.ItemSnapBatch?.ItemSnap?.converted_order_uom,
                                item_unit_size: row?.ItemSnapBatch?.ItemSnap?.item_unit_size,
                                DisplayUnit: row?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name
                            }
                        ]
                    }
                )
            } else {
                formData.item_list.push(
                    {
                        item_id: row?.ItemSnapBatch?.item_id,
                        request_quantity: row.allocated_quantity,
                        estimation_id: itemEstimationData ? itemEstimationData.id : null,
                        batch_list: [
                            {
                                sr_no: row?.ItemSnapBatch?.ItemSnap?.sr_no,
                                item_name: row?.ItemSnapBatch?.ItemSnap?.medium_description,
                                batch_no: row?.ItemSnapBatch?.batch_no,
                                item_batch_bin_id: row.id,
                                bin_id: row.bin_id,
                                allocated_quantity: row.allocated_quantity,
                                allocated_volume: Number(row.quantity) / Number(row.volume) * Number(row.allocated_quantity)
                            }
                        ]
                    }
                )
            }


        } else {

            const batch_index = formData.item_list[index].batch_list.findIndex(object => {
                return object.item_batch_bin_id === row.id;
            });


            console.log("batch index", batch_index)
            if (batch_index == -1) {

                formData.item_list[index].request_quantity = Number(formData.item_list[index].request_quantity) + Number(row.allocated_quantity)

                if (row?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU') {
                    formData.item_list[index].batch_list.push(
                        {
                            sr_no: row?.ItemSnapBatch?.ItemSnap?.sr_no,
                            item_name: row?.ItemSnapBatch?.ItemSnap?.medium_description,
                            batch_no: row?.ItemSnapBatch?.batch_no,
                            item_batch_bin_id: row.id,
                            bin_id: row.bin_id,
                            allocated_quantity: row.allocated_quantity / row?.ItemSnapBatch?.ItemSnap?.item_unit_size,
                            allocated_volume: Number(row.quantity) / Number(row.volume) * Number(row.allocated_quantity),
                            converted_order_uom: row?.ItemSnapBatch?.ItemSnap?.converted_order_uom,
                            item_unit_size: row?.ItemSnapBatch?.ItemSnap?.item_unit_size,
                            DisplayUnit: row?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name

                        }
                    )
                } else {
                    formData.item_list[index].batch_list.push(
                        {
                            sr_no: row?.ItemSnapBatch?.ItemSnap?.sr_no,
                            item_name: row?.ItemSnapBatch?.ItemSnap?.medium_description,
                            batch_no: row?.ItemSnapBatch?.batch_no,
                            item_batch_bin_id: row.id,
                            bin_id: row.bin_id,
                            allocated_quantity: row.allocated_quantity,
                            allocated_volume: Number(row.quantity) / Number(row.volume) * Number(row.allocated_quantity)

                        }
                    )
                }

            } else {
                this.setState({
                    alert: true,
                    message: "This Batch Alrady Selected",
                    severity: 'error',
                    addedListloaded: true
                })
            }



        }
        this.setState({
            formData,
            addedListloaded: true
        })

        console.log("allocating row after", formData)

    }

    async submitData() {
        this.setState({ processing: true })
        let formData = this.state.formData;
        formData.number_of_items = formData.item_list.length
        let user_info = await localStorageService.getItem("userInfo")

        console.log("subbmitting", formData)

        let res = await WarehouseServices.requestDrugExchange(formData)
        if (res.status == 201) {
            console.log("Order Data res", res)
            this.setState({
                order: res.data.view,
                alert: true,
                message: 'Order Created Successful',
                severity: 'success',

            }, () => {

                let response_data = res.data.posted.res;
                window.location = `/msa_all_order/all-orders/order/${response_data.id
                    }/${response_data?.number_of_items
                    }/${response_data?.order_id
                    }/${user_info.name
                    }/${null
                    }/${response_data?.status
                    }/${response_data?.type
                    }`
                // this.render(),
                // this.updateStatus()
                // window.location.reload()
                // console.log("State ", this.state.order)
            })
        } else {
            this.setState({
                alert: true,
                message: 'Order Create Unsuccesful',
                severity: 'error',
                processing: false
            })
        }


    }

    removeItem(row) {
        console.log('remove item', row.rowData[0])
        let formData = this.state.formData


        // Use flatMap to get a flat array of all the nested children objects
        const flattenedArray = formData.item_list.map(obj => obj.batch_list.map(item => item)).flat()
        console.log("remove item array", flattenedArray);
        // Use findIndex to get the index of the element containing the ID
        var index = null
        var nestedIndex = null


        for (let i = 0; i < formData.item_list.length; i++) {
            const element = formData.item_list[i];
            for (let j = 0; j < formData.item_list[i].batch_list.length; j++) {
                if (formData.item_list[i].batch_list[j].item_batch_bin_id === row.rowData[0]) {
                    index = i
                    nestedIndex = j
                    break;
                }

            }

        }


        console.log("remove item index", index);
        console.log("remove item nested index", nestedIndex);

        let removeving_qty = formData.item_list[index].batch_list[nestedIndex].allocated_quantity

        formData.item_list[index].request_quantity = Number(formData.item_list[index].request_quantity) - Number(removeving_qty)
        formData.item_list[index].batch_list.splice(nestedIndex, 1)

        if (formData.item_list[index].batch_list.length == 0) {
            formData.item_list.splice(index, 1)
        }
        this.setState({
            formData
        })
        console.log('remove item after', formData)

    }




    async getAnnualEstimation(item_id) {
        let data = this.state.estimationData.filter((data) => data.item_id == item_id)
        let annualEstimation = Number(data[0]?.estimation ? data[0]?.estimation : 0)
        return isNaN(annualEstimation) ? 0 : annualEstimation

    }
    async getRemainingEstimation(item_id) {
        let data = this.state.estimationData.filter((data) => data.item_id == item_id)
        let annualEstimation = Number(data[0]?.estimation ? data[0]?.estimation : 0)
        let issued_quantity = Number(data[0]?.issued_quantity ? data[0]?.issued_quantity : 0)

        let remainingEstimation = (isNaN(annualEstimation) ? 0 : annualEstimation) - (isNaN(issued_quantity) ? 0 : issued_quantity)
        return remainingEstimation;
    }

    async getAllocatedQuantitiy(item_batch_bin_id) {

        let data = this.state.itemBatch.filter((data) => data.item_batch_bin_id == item_batch_bin_id)
        let reserved_quantity = Number(data[0]?.reserved_quantity ? data[0]?.reserved_quantity : 0)
        return isNaN(reserved_quantity) ? 0 : reserved_quantity

    }


    async getAvailableQuantitiy(row) {
        let totalQty = Number(row.quantity)
        let data = this.state.itemBatch.filter((data) => data.item_batch_bin_id == row.id)
        let reserved_quantity = Number(data[0]?.reserved_quantity ? data[0]?.reserved_quantity : 0)

        let quantity = (isNaN(totalQty) ? 0 : totalQty) - (isNaN(reserved_quantity) ? 0 : reserved_quantity)
        return convertTocommaSeparated(quantity, 2);
    }

    render() {



        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <Grid container spacing={2}>
                            <Grid
                                item
                                lg={12}
                                xs={12}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    className="font-semibold"
                                >
                                    {"Distribution To - " + this.state.selectedWarehouseData?.name}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                        </Grid>



                        <Grid
                            container="container"
                            spacing={2}
                            direction="row"
                            className='pb-5'
                        >
                            <Grid className='w-full mt-5'>
                                <ValidatorForm
                                    className="pt-5"
                                    onSubmit={() => { this.setPage(0) }}
                                //onError={() => null}
                                >
                                    {/* Main Grid */}
                                    <Grid
                                        item="item"
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <Grid container="container" spacing={2}>
                                            <Grid
                                                className=" w-full"
                                                item="item"
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Start SR" />
                                                <TextValidator
                                                    className="w-full"
                                                    placeholder="Start SR"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth"
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state.filterData.start_sr
                                                    }
                                                    onChange={(e) => {
                                                        let filterData = this.state.filterData;
                                                        filterData.start_sr = e.target.value;
                                                        this.setState({ filterData });
                                                    }}
                                                    validators={this.state.filterData.start_sr ? ['isNumber', 'minLength'] : null}
                                                    errorMessages={[
                                                        'Only numbers are allowed',
                                                        'Number must be at least 8 digits',
                                                    ]}

                                                />

                                            </Grid>

                                            <Grid
                                                className="w-full"
                                                item
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="End SR" />
                                                <TextValidator
                                                    className="w-full"
                                                    placeholder="End SR"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth"
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state.filterData.end_sr
                                                    }
                                                    onChange={(e) => {
                                                        let filterData = this.state.filterData;
                                                        filterData.end_sr = e.target.value;
                                                        this.setState({ filterData });
                                                    }}
                                                    validators={this.state.filterData.end_sr ? ['isNumber', 'minLength'] : null}
                                                    errorMessages={[
                                                        'Only numbers are allowed',
                                                        'Number must be at least 8 digits',
                                                    ]}
                                                />

                                            </Grid>


                                            {/* Serial/Family Number */}
                                            <Grid
                                                className="w-full"
                                                item="item"
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Item Class" />
                                                <Autocomplete
                                                    multiple  // Enable multiple selections
                                                    disableClearable
                                                    className="w-full"
                                                    options={this.state.all_item_class.sort((a, b) =>
                                                        a.description?.localeCompare(b.description)
                                                    )}
                                                    onChange={(e, values) => {
                                                        let selectedIds = values.map((value) => value.id);
                                                        let filterData = { ...this.state.filterData };

                                                        filterData.class_id = selectedIds;
                                                        this.setState({ filterData });
                                                    }}
                                                    value={this.state.all_item_class.filter((option) => this.state.filterData.class_id && this.state.filterData.class_id.includes(option.id))}

                                                    getOptionLabel={(option) => (option.description + ' - ' + option.code)}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Item Class"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            {/* Serial Family Name*/}
                                            <Grid
                                                className="w-full"
                                                item="item"
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Item Category" />
                                                <Autocomplete
                                                    multiple // enable multiple selecting
                                                    disableClearable
                                                    className="w-full"
                                                    options={this.state.all_item_category.sort((a, b) =>
                                                        a.description?.localeCompare(b.description)
                                                    )}
                                                    // set as multiple select
                                                    onChange={(e, values) => {
                                                        let selectedIds = values.map((value) => value.id);
                                                        let filterData = { ...this.state.filterData };

                                                        filterData.category_id = selectedIds;
                                                        this.setState({ filterData });
                                                    }}
                                                    value={this.state.all_item_category.filter((option) => this.state.filterData.category_id && this.state.filterData.category_id.includes(option.id))}
                                                    getOptionLabel={(option) => (option.description ? option.description : "")}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Item Category"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid>


                                            {/* Item Group*/}
                                            <Grid
                                                className="w-full"
                                                item="item"
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Item Group" />
                                                <Autocomplete
                                                    multiple
                                                    disableClearable
                                                    className="w-full"
                                                    options={this.state.all_item_group.sort((a, b) =>
                                                        a.code?.localeCompare(b.code)
                                                    )}

                                                    onChange={(e, values) => {
                                                        let selectedIds = values.map((value) => value.id);
                                                        let filterData = { ...this.state.filterData };

                                                        filterData.group_id = selectedIds;
                                                        this.setState({ filterData });
                                                    }}

                                                    value={this.state.all_item_group.filter((option) => this.state.filterData.group_id && this.state.filterData.group_id.includes(option.id))}


                                                    getOptionLabel={(option) => (option.code + "-" + option.name)}

                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Item Group"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            {/* Ven */}

                                            <Grid
                                                className=" w-full"
                                                item="item"
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Stock Qty >= More Than" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Stock Qty >= More Than"
                                                    name="stockMore"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.filterData
                                                            .moreStock
                                                    }
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                    min={0}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this.state
                                                                    .filterData,
                                                                moreStock:
                                                                    parseInt(e.target.value, 10),
                                                            },
                                                        })
                                                    }}
                                                />
                                            </Grid>

                                            {/* Stock Days 1 */}
                                            <Grid
                                                className=" w-full"
                                                item="item"
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Stock Qty <= Less Than" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Stock Qty <= Less Than"
                                                    name="lessStock"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.filterData
                                                            .lessStock
                                                    }
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this.state
                                                                    .filterData,
                                                                lessStock:
                                                                    parseInt(e.target.value, 10),
                                                            },
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item="item"
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Not Expired" />
                                                <FormControlLabel
                                                    //label={"Yes"}
                                                    name="probable"
                                                    //value={"true"}
                                                    onClick={() => {
                                                        let filterData =
                                                            this.state.filterData
                                                        if (
                                                            filterData.exp_date_grater_than_zero_search ==
                                                            'true'
                                                        ) {
                                                            filterData.exp_date_grater_than_zero_search =
                                                                'false'
                                                            this.setState({
                                                                filterData,
                                                            })
                                                        } else {
                                                            filterData.exp_date_grater_than_zero_search =
                                                                'true'
                                                            this.setState({
                                                                filterData,
                                                            })
                                                        }
                                                    }}
                                                    control={
                                                        <Radio
                                                            color="primary"
                                                            checked={
                                                                this.state.filterData
                                                                    .exp_date_grater_than_zero_search ===
                                                                    'true'
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                    }
                                                    display="inline"
                                                //checked={this.state.formData.exp_date_grater_than_zero_search=="true"?true:false}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                xs={4}
                                            >
                                                <div className="flex items-center">
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Search"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth"
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.filterData
                                                                .search
                                                        }
                                                        onChange={(e, value) => {
                                                            let filterData =
                                                                this.state.filterData
                                                            filterData.search =
                                                                e.target.value
                                                            this.setState({
                                                                filterData,
                                                            })
                                                            console.log(
                                                                'form data',
                                                                this.state.filterData
                                                            )
                                                        }}
                                                        /* validators={[
                                                        'required',
                                                        ]}
                                                        errorMessages={[
                                                        'this field is required',
                                                        ]} */
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton onClick={() => { this.setPage(0) }}>
                                                                        <SearchIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item="item"
                                                lg={6}
                                                md={6}
                                                xs={8}

                                            >
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        item
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        xs={12}
                                                        className=" w-full flex justify-end"
                                                    >
                                                        <LoonsButton
                                                            className="mt-2"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            type='submit'
                                                            startIcon="search"
                                                        // onClick={this.loadOrderList}
                                                        >
                                                            <span className="capitalize">
                                                                Filter
                                                            </span>
                                                        </LoonsButton>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>

                                {/* Table Section */}
                                <Grid
                                    container="container"
                                    className="mt-3 pb-5"
                                >
                                    <Grid
                                        item="item"
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        {this.state.loaded ? (
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'}
                                                data={this.state.data}
                                                columns={this.state.columns}
                                                options={{
                                                    filterType: 'textField',
                                                    pagination: true,
                                                    size: 'medium',
                                                    serverSide: true,
                                                    print: false,
                                                    viewColumns: true,
                                                    download: false,
                                                    count: this.state
                                                        .totalItems,
                                                    rowsPerPage:
                                                        this.state.filterData
                                                            .limit,
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
                                        ) : (
                                            //loading effect
                                            <Grid className="justify-center text-center w-full pt-12">
                                                <CircularProgress size={30} />
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid className='w-full mt-5'>
                                <LoonsCard>
                                    <Grid
                                        item="item"
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        {this.state.addedListloaded ? (
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'}
                                                data={this.state.formData.item_list.map(obj => obj.batch_list.map(item => item)).flat()}
                                                columns={this.state.addedListColumns}
                                                options={{
                                                    filterType: 'textField',
                                                    pagination: false,
                                                    size: 'medium',
                                                    serverSide: true,
                                                    print: false,
                                                    viewColumns: false,
                                                    download: false,


                                                }}
                                            ></LoonsTable>
                                        ) : (
                                            //loading effect
                                            <Grid className="justify-center text-center w-full pt-12">
                                                <CircularProgress size={30} />
                                            </Grid>
                                        )}
                                    </Grid>

                                    <ValidatorForm onSubmit={() => { this.submitData() }}>
                                        <Grid container spacing={2}>
                                            <Grid item>
                                                <SubTitle title="Allocated Date" />
                                                <LoonsDatePicker className="w-full"
                                                    selected={this.state.formData.required_date}
                                                    value={this.state.formData.required_date}
                                                    placeholder="Allocated Date"
                                                    // minDate={new Date()} 
                                                    // minDate={null}
                                                    //maxDate={new Date()}
                                                    required={true}
                                                    // disabled={this.state.date_selection}
                                                    // errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let formData = this.state.formData
                                                        formData.required_date = dateParse(date)
                                                        formData.issued_date = dateParse(date)
                                                        formData.allocated_date = dateParse(date)
                                                        this.setState({ formData })
                                                    }}
                                                    format='dd/MM/yyyy'
                                                />
                                            </Grid>

                                            <Grid item>
                                                <SubTitle title="Book No" />
                                                <TextValidator

                                                    className="w-full"
                                                    placeholder="Book No"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth"
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state.formData.book_no
                                                    }
                                                    onChange={(e, value) => {

                                                        this.handleTextChangePage()
                                                        let formData = this.state.formData
                                                        formData.book_no = e.target.value
                                                        this.setState({
                                                            formData,
                                                        })


                                                    }}
                                                    // validators={['required']},
                                                    // errorMessages={['This field is required']}
                                                    // validators={['required']}
                                                    // errorMessages={[
                                                    //     this.state.formData.page_no ? null : 'This field is required'
                                                    // ]}
                                                    validators={this.state.bookNoReq ? ['required'] : null}
                                                    errorMessages={[
                                                        this.state.bookNoReq ? 'This field is required' : null
                                                    ]}

                                                />

                                            </Grid>


                                            <Grid item>
                                                <SubTitle title="Page No" />
                                                <TextValidator

                                                    className="w-full"
                                                    placeholder="Page No"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth"
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state.formData.page_no
                                                    }
                                                    onChange={(e, value) => {
                                                        this.handleTextChangeBook()
                                                        let formData = this.state.formData
                                                        formData.page_no = e.target.value
                                                        this.setState({
                                                            formData,
                                                        })


                                                    }}
                                                    validators={this.state.bookNoReq ? ['required'] : null}
                                                    errorMessages={[
                                                        this.state.bookNoReq ? 'This field is required' : null
                                                    ]}
                                                /* validators={[
                                                    'required',
                                                ]}
                                                errorMessages={['this field is required',]}
                                                */

                                                />
                                            </Grid>


                                        </Grid>
                                        <Grid item>

                                            <Button
                                                className="mt-5 "
                                                progress={this.state.processing}
                                                type="submit"
                                                scrollToTop={true}
                                                startIcon="save"
                                                disabled={this.state.bookNoReq ? (!this.state.isFilledPageNo || !this.state.isFilledBookNo) : false}
                                            >
                                                <span className="capitalize">
                                                    Save
                                                </span>
                                            </Button>
                                        </Grid>

                                    </ValidatorForm>
                                </LoonsCard>
                            </Grid>






                        </Grid>


                    </LoonsCard>
                </MainContainer>


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

export default DetailsView
