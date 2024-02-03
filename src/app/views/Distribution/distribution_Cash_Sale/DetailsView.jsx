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
import { dateParse, convertTocommaSeparated, roundDecimal } from 'utils'
import { caseSaleCharges } from 'appconst';
import EmployeeServices from 'app/services/EmployeeServices';
import InventoryService from 'app/services/InventoryService';
import EstimationService from 'app/services/EstimationService';
import ClinicService from 'app/services/ClinicService';
import moment from 'moment';
class DetailsView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            updateData: {
                noOfDays: 0,
            },
            submitting: false,
            total_cost: 0,
            service_charges: 0,
            dialog_for_select_employee: false,
            selected_coverUp_emp: null,
            selected_employee: [],
            isFilledPageNo: false,
            isFilledBookNo: false,
            openWarning: false,
            testing:false,

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
            itemBatch: null,
            estimationData: null,
            allocationData: null,
            disableAddButton: [],
            oneceTime:true,

            alert: false,
            message: '',
            severity: 'success',
            filterData: {
                page: 0,
                limit: 25,
                // warehouse_id: this.props.match.params.id,
                warehouse_id: null,
                exp_date_order: true,
                exp_date_grater_than_zero_search: true,
                quantity_grater_than_zero_search: true,
                search: null,
                item_status: ['Active', 'Pending', 'DC', 'Discontinued'],
                // orderby_drug: true,
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
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(cellData)
                            }
                        },
                    },
                },
                {
                    name: 'Warehouse', // field name in the row object
                    label: 'Warehouse', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex]
                                    .Warehouse?.name
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return cellData
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
                            console.log("anual estimation", data)
                            let annualEst = Number(data[0]?.estimation ? data[0]?.estimation : 0)
                            let annualEstimation = isNaN(annualEst) ? 0 : annualEst

                            let quantity = (isNaN(annualEstimation) ? 0 : annualEstimation)
                            return convertTocommaSeparated(quantity, 2);

                        },
                    },
                },
                // {
                //     name: 'quantity', // field name in the row object
                //     label: 'Monthly Estimation', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             // console.log("tableMeta", tableMeta);
                //             //let annualEstimation = Number(this.getAnnualEstimation(this.state.data[tableMeta.rowIndex].item_id))
                //             const month = ["jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sep", "oct", "nov", "dec"];

                //             const d = new Date();
                //             let name = month[d.getMonth()]

                //             let data = this.state.estimationData.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.item_id)
                //             // let monthlyEst = Number(data[0]?.[name] ? data[0]?.estimation : 0)
                //             //let monthlyEstimation = isNaN(monthlyEst) ? 0 : monthlyEst
                //             //return convertTocommaSeparated(monthlyEstimation );
                //             if (data.length > 0) {
                //                 return data[0][name]
                //             } else {
                //                 return 0
                //             }

                //         },
                //     },
                // },
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
                            let issued_data = this.state.itemBatch.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.item_id)

                            let annualEstimation = Number(data[0]?.estimation ? data[0]?.estimation : 0)
                            let issued_quantity = Number(issued_data[0]?.reserved_quantity ? issued_data[0]?.reserved_quantity : 0)

                            let remainingEstimation = (isNaN(annualEstimation) ? 0 : annualEstimation) - (isNaN(issued_quantity) ? 0 : issued_quantity)

                            return convertTocommaSeparated(remainingEstimation, 2);

                        },
                    },
                },

                // {
                //     name: 'quantity', // field name in the row object
                //     label: 'Remaining Monthly Estimation', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             // console.log("tableMeta", tableMeta);
                //             //let remainingEstimation = Number(this.getRemainingEstimation(this.state.data[tableMeta.rowIndex].item_id))

                //             let issued_data = this.state.allocationData.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.item_id)
                //             let issued_quantity = Number(issued_data[0]?.reserved_quantity ? issued_data[0]?.reserved_quantity : 0)

                           
                //             const month = ["jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sep", "oct", "nov", "dec"];

                //             const d = new Date();
                //             let name = month[d.getMonth()]

                //             let data = this.state.estimationData.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.item_id)
                //             // let monthlyEst = Number(data[0]?.[name] ? data[0]?.estimation : 0)
                //             //let monthlyEstimation = isNaN(monthlyEst) ? 0 : monthlyEst
                //             //return convertTocommaSeparated(monthlyEstimation );
                //             if (data.length > 0) {
                //                 return (isNaN(Number(data[0][name]))?Number(data[0][name]):0) - (isNaN(issued_quantity) ? 0 : issued_quantity)
                //             } else {
                //                 return 0 - (isNaN(issued_quantity) ? 0 : issued_quantity)

                //             }

                //         },
                //     },
                // },
                {
                    name: 'unit_price', // field name in the row object
                    label: 'Unit Price', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex]
                                    .ItemSnapBatch?.unit_price
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return cellData
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
                            // console.log("tableMeta", tableMeta);
                            console.log('cheling data', this.state.data[tableMeta.rowIndex])

                            let cellData = this.state.data[tableMeta.rowIndex].quantity

                            if (this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU') { 
                                if (cellData == null) {
                                    return 'N/A'
                                } else {
                                    return roundDecimal(Math.floor(cellData) * this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name
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
                    name: 'available_quantity', // field name in the row object
                    label: 'Available Qty', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            let qty =  this.state.itemBatch.find((e)=>e?.item_batch_bin_id === this.state.data[tableMeta.rowIndex]?.id)
                            let available_qty = Number(this.state.data[tableMeta.rowIndex]?.quantity) - Number(qty?.reserved_quantity)
                             console.log("tableMeta", this.state.data[tableMeta.rowIndex]?.quantity, qty );

                            //  if (this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU') {
                            //     return  qty ? roundDecimal(available_qty * this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom, 2) : roundDecimal(this.state.data[tableMeta.rowIndex]?.quantity * this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name
                            //  } else {
                                return  qty ? available_qty : this.state.data[tableMeta.rowIndex]?.quantity
                            //  }
                            
                        },
                    },
                },
                {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        display: true,

                        customBodyRender: (value, tableMeta, updateValue) => {

                            let data = this.state.estimationData.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.item_id)
                            let issued_data = this.state.itemBatch.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.item_id)

                            let annualEstimation = Number(data[0]?.estimation ? data[0]?.estimation : 0)
                            let issued_quantity = Number(issued_data[0]?.reserved_quantity ? issued_data[0]?.reserved_quantity : 0)

                            let remainingEstimation = issued_quantity
                            // let remainingEstimation = (isNaN(annualEstimation) ? 0 : annualEstimation) - (isNaN(issued_quantity) ? 0 : issued_quantity)

                            return (

                                //  (parseInt(this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity)) < (parseInt(this.state.data[tableMeta.rowIndex].allocated_quantity)) ?
                                //     (
                                <ValidatorForm onSubmit={() => { this.addBatch(this.state.data[tableMeta.rowIndex]) }}>
                                    {/* {(this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU' && this.state.data[tableMeta.rowIndex].qty > 0) &&
                                        <p className='pt-1 pb-1 pl-5 pr-5' style={{border:'1px solid #ffd600', backgroundColor:'#fff59d', borderRadius:'3px', textAlign:'center'}}>{roundDecimal(this.state.data[tableMeta.rowIndex].qty / this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.MeasuringUnit?.name}</p>
                                    } */}
                                    <TextValidator
                                        placeholder="Allocated Qty"
                                        name="allocate_qty"
                                        style={{ width: 150 }}
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
                                        value={this.state.data[tableMeta.rowIndex].qty}
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        min={0}
                                        onFocus={() =>
                                            this.setState({ disabledAddIconRowIndex: tableMeta.rowIndex })
                                        }
                                        onBlur={() => this.setState({ disabledAddIconRowIndex: -1 })}
                                        onChange={(e) => {

                                            let rowIndex = tableMeta.rowIndex;

                                            // desable button whrn without multiple of packsize
                                            let disableAddButtonCommand;
                                            if (e.target.value % this.state.data[tableMeta.rowIndex].ItemSnapBatch?.pack_size === 0) {
                                                disableAddButtonCommand = false;
                                            } else {
                                                disableAddButtonCommand = true;
                                                this.setState({
                                                    oneceTime:false
                                                })
                                                
                                            }

                                            if(this.state.oneceTime){
                                                this.setState({
                                                    alert: true,
                                                    message: 'The value can be entered only in pack size multiples !',
                                                    severity: 'error',
                                                })
                                            }

                                            const updatedDisableAddButton = [...this.state.disableAddButton];
                                            updatedDisableAddButton[tableMeta.rowIndex] = disableAddButtonCommand;

                                            this.setState({
                                                disableAddButton: updatedDisableAddButton,
                                            });

                                            // console.log('cheking estimation', Number(e.target.value), Number(remainingEstimation) )

                                            // open error dialog when enterd value exeed the remaining estimation
                                            if (e.target.value > remainingEstimation && !this.state.warningSet?.[rowIndex]) {
                                                // Set the warning for the specific row
                                                const updatedWarningSet = { ...this.state.warningSet };
                                                updatedWarningSet[rowIndex] = true;
                                        
                                                this.setState({
                                                    openWarning: true,
                                                    warningSet: updatedWarningSet,
                                                });
                                            }
                                            let data = this.state.data;
                                            data[tableMeta.rowIndex].qty = e.target.value;
                                            if (e.target.value < 0) {
                                                this.setState({
                                                    data,
                                                    disabledAddIconRowIndex: tableMeta.rowIndex,
                                                });
                                            } else {
                                                this.setState({ data });
                                            }
                                        }}

                                        validators={[
                                            "maxNumber:" + this.state.data[tableMeta.rowIndex].quantity,
                                            // `rules:${console.log('ceking validation value', this.state.data[tableMeta.rowIndex].qty, this.state.data[tableMeta.rowIndex].ItemSnapBatch?.pack_size)}`
                                            // `Numer:${console.log('cheing validato',Number(this.state.data[tableMeta.rowIndex].qty) % Number(this.state.data[tableMeta.rowIndex].ItemSnapBatch?.pack_size) == 0)}`
                                        ]}
                                        errorMessages={[
                                            "Cannot Allocate More than Available Qty",
                                            // "Quantity must be a multiple of pack size",
                                        ]}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        type="submit"
                                                        size="small"
                                                        color="primary"
                                                        disabled={this.state.disableAddButton[tableMeta.rowIndex]}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
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

                    },
                },

                {
                    name: 'unit_price',
                    label: 'Unit Price',
                    options: {
                        filter: true,
                        display: true,

                    },
                },
                {
                    name: 'cost',
                    label: 'Cost',
                    options: {
                        filter: true,
                        display: true,

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



    async loadOrderList() {
        this.setState({ loaded: false, cartStatus: [] })
        var user_info = await localStorageService.getItem('userInfo')

        let filterData = this.state.filterData
        let coverUpEmp = await localStorageService.getItem('coverUpInfo');
        if (coverUpEmp) {
            filterData.distribution_officer_id = coverUpEmp.id
        } else {
            filterData.distribution_officer_id = user_info.id
        }

        let res = await WarehouseServices.getSingleItemWarehouse(
            filterData
        )
        if (res.status) {
            console.log('data', res.data.view.data)



            this.setState(
                {
                    data: res.data.view.data.map(obj => ({
                        ...obj,
                        allocated_quantity: obj.quantity
                    })),
                    //loaded: true,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.loadItemEstimations()
                    this.render()
                    // this.getCartItems()
                }
            )
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
    async loadAssignedEmployees() {
        var user = await localStorageService.getItem('userInfo');
        var userId = user.id;
        var owner_id = await localStorageService.getItem('owner_id');
        var userRoles = user.roles;

        var all_employee_dummy = [];

        let res = await EmployeeServices.getEmployees({
            owner_id: owner_id,
            type: ['MSD Distribution Officer', 'MSD SCO', 'MSD SCO Supply']
        })
        if (res.status == 200) {
            console.log("Assigned Employees", res.data.view.data);
            all_employee_dummy = res.data.view.data;
        }
        this.setState({ selected_employee: all_employee_dummy })
    }

    async handleSubmit() {
        let formData = this.state.formData;
        formData.cover_up_employee_id = await localStorageService.getItem('userInfo').id;
        formData.covered_up_employee_id = this.state.selected_coverUp_emp.id;

        let res = await EmployeeServices.createEmployeeCoverUp(formData);
        if (res.status === 201) {
            await localStorageService.setItem('coverUpInfo', this.state.selected_coverUp_emp);
            this.setState({
                alert: true,
                message: 'Employee cover up history saved!',
                severity: 'success',
                processing: false
            }, () => {
                window.location.reload()
            })
        } else {
            this.setState({
                alert: true,
                message: 'Employee cover up history was unsaved!',
                severity: 'error',
                processing: false
            })
        }
        this.setState({ dialog_for_select_employee: false })
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

            })
        }
    }

    async loadItemEstimations() {

        let owner_id = this.state.selectedWarehouseData?.owner_id

        let data = this.state.data;
        const itemIdSet = new Set(data.map(item => item.ItemSnapBatch.item_id));

        // Converting the set to an array
        const itemIdArray = Array.from(itemIdSet);
        console.log("unique item ids array", owner_id);

        this.loadLastRecievedData(itemIdArray, this.props.match.params.id)

        let params = {
            warehouse_id: (owner_id == "NA0000" || owner_id == 'EC00001') ? this.props.match.params.id : null,
            owner_id: (owner_id == "NA0000" || owner_id == 'EC00001') ? null : owner_id,
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

        console.log('itemsnap', this.state.itemBatch)
    }

    async loadLastRecievedData(item_ids, from) {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(1);
        let owner_id = await localStorageService.getItem('owner_id')
        let params = {
            item_id: item_ids,
            status: 'Active',
            //order_status:['Active', 'Pending',  'APPROVED', 'ALLOCATED', 'ISSUE SUBMITTED','ISSUED', 'ORDERED','COMPLETED'],
            allocation_sum: true,
            group_by_warehouse_only: true,
            from: from,
            from_date: moment(new Date().setDate(1)).format('YYYY-MM-DD'),
            to_date: moment(currentDate).format('YYYY-MM-DD'),
            to_owner_id: owner_id
        }

        let batch_res = await PharmacyOrderService.getOrderBatchItems(params)
        if (batch_res.status == 200) {
            console.log("last allocation history", batch_res.data.view.data)


            /*   const sum = batch_res?.data?.view?.data?.reduce((accumulator, object) => {
                  return Number(accumulator) + Number(object.reserved_quantity);
              }, 0); */
            this.setState({
                allocationData: batch_res.data.view.data
            })

        }
    }

    async componentDidMount() {
        // var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse')
        var user_info = await localStorageService.getItem('userInfo')
        let filterData = this.state.filterData;
        let formData = this.state.formData;
        this.loadAssignedEmployees()

        formData.created_by = user_info.id
        formData.owner_id = '000'



        filterData.owner_id = '000'
        //filterData.warehouse_id = selected_warehouse_cache.id
        this.setState({ filterData, formData }, () => {
            this.loadWarehouseData()
        })

        // this.setDate()
    }


    addBatch(row) {
        console.log("allocating row", row)
        this.setState({ addedListloaded: false })
        let formData = this.state.formData;
        formData.to = row.Warehouse.id

        const index = formData.item_list.findIndex(object => {
            return object.item_id === row?.ItemSnapBatch?.item_id;
        });
        if (index == -1) {

            // if (row?.ItemSnapBatch?.ItemSnap?.converted_order_uom === "EU") {
            //     formData.item_list.push(
            //         {
            //             item_id: row?.ItemSnapBatch?.item_id,
            //             request_quantity: row.qty,
            //             batch_list: [
            //                 {
            //                     sr_no: row?.ItemSnapBatch?.ItemSnap?.sr_no,
            //                     item_name: row?.ItemSnapBatch?.ItemSnap?.short_description,
            //                     batch_no: row?.ItemSnapBatch?.batch_no,
            //                     item_batch_bin_id: row.id,
            //                     bin_id: row.bin_id,
            //                     unit_price: row?.ItemSnapBatch?.unit_price,
            //                     cost: Number(row?.ItemSnapBatch?.unit_price) * Number(row.qty),
            //                     allocated_quantity: Number(row.qty) / Number(row?.ItemSnapBatch?.ItemSnap?.item_unit_size),
            //                     allocated_volume: Number(row.quantity) / Number(row.volume) * Number(row.qty)
            //                 }
            //             ]
            //         }
            //     )
            // } else {
                formData.item_list.push(
                    {
                        item_id: row?.ItemSnapBatch?.item_id,
                        request_quantity: row.qty,
                        batch_list: [
                            {
                                sr_no: row?.ItemSnapBatch?.ItemSnap?.sr_no,
                                item_name: row?.ItemSnapBatch?.ItemSnap?.short_description,
                                batch_no: row?.ItemSnapBatch?.batch_no,
                                item_batch_bin_id: row.id,
                                bin_id: row.bin_id,
                                unit_price: row?.ItemSnapBatch?.unit_price,
                                cost: Number(row?.ItemSnapBatch?.unit_price) * Number(row.qty),
                                allocated_quantity: row.qty,
                                allocated_volume: Number(row.quantity) / Number(row.volume) * Number(row.qty)
                            }
                        ]
                    }
                )
            // }
            

        } else {

            const batch_index = formData.item_list[index].batch_list.findIndex(object => {
                return object.item_batch_bin_id === row.id;
            });


            console.log("batch index", batch_index)
            if (batch_index == -1) {

                formData.item_list[index].request_quantity = Number(formData.item_list[index].request_quantity) + Number(row.qty)

                // if (row?.ItemSnapBatch?.ItemSnap?.converted_order_uom === "EU") {
                //     formData.item_list[index].batch_list.push(
                //         {
                //             sr_no: row?.ItemSnapBatch?.ItemSnap?.sr_no,
                //             item_name: row?.ItemSnapBatch?.ItemSnap?.short_description,
                //             batch_no: row?.ItemSnapBatch?.batch_no,
                //             item_batch_bin_id: row.id,
                //             bin_id: row.bin_id,
                //             allocated_quantity: Number(row.qty) / Number(row?.ItemSnapBatch?.ItemSnap?.item_unit_size),
                //             unit_price: row?.ItemSnapBatch?.unit_price,
                //             cost: Number(row?.ItemSnapBatch?.unit_price) * Number(row.qty),
                //             allocated_volume: Number(row.quantity) / Number(row.volume) * Number(row.qty)
    
                //         }
                //     )
                // } else {
                    formData.item_list[index].batch_list.push(
                        {
                            sr_no: row?.ItemSnapBatch?.ItemSnap?.sr_no,
                            item_name: row?.ItemSnapBatch?.ItemSnap?.short_description,
                            batch_no: row?.ItemSnapBatch?.batch_no,
                            item_batch_bin_id: row.id,
                            bin_id: row.bin_id,
                            allocated_quantity: row.qty,
                            unit_price: row?.ItemSnapBatch?.unit_price,
                            cost: Number(row?.ItemSnapBatch?.unit_price) * Number(row.qty),
                            allocated_volume: Number(row.quantity) / Number(row.volume) * Number(row.qty)
    
                        }
                    )
                // }

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
        }, () => {
            this.calculateTotalCost()
        })

        console.log("allocating row after", formData)

    }

    async submitData() {
        let user_info = await localStorageService.getItem("userInfo")
        let formData = this.state.formData;
        formData.number_of_items = formData.item_list.length
        formData.distribution_officer_id = user_info.id
       

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
                window.location = `/distribution/order/${response_data.id
                    }/${response_data?.number_of_items
                    }/${response_data?.order_id
                    }/${user_info.name
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

    async calculateTotalCost() {
        let items = this.state.formData.item_list.map(obj => obj.batch_list.map(item => item)).flat();

        let total_cost = 0;

        for (let index = 0; index < items.length; index++) {
            total_cost = total_cost + items[index].cost

        }

        //adding 10% searvice charges
        let service_charges = (total_cost * caseSaleCharges) / 100

        this.setState({ total_cost: total_cost, service_charges })

    }



    render() {



        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <Typography variant="h6" className="font-semibold"> Direct Distribution</Typography>
                            <LoonsButton
                                color='primary'
                                onClick={() => {
                                    this.setState({ dialog_for_select_employee: true, Loaded: false })
                                }}>
                                <ApartmentIcon />
                                Cover Ups
                            </LoonsButton>
                        </div>


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

                            <Grid className='w-full'>
                                <LoonsCard className='mt-5'>
                                    <ValidatorForm
                                        className="pt-5"
                                        onSubmit={() => {
                                            let filterData = this.state.filterData;
                                            filterData.page = 0;
                                            this.setState({ filterData }, () => {
                                                this.loadOrderList()
                                            })
                                        }}
                                        onError={() => null}
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
                                                    item="item"
                                                    lg={12}
                                                    md={12}
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
                                                                        <SearchIcon></SearchIcon>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
                                                    </div>
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
                                </LoonsCard>
                            </Grid>

                            <Grid className=''>
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

                                    <Grid item>
                                        <table>
                                            <tr>
                                                <td>
                                                    <SubTitle title={"Cost"} />
                                                </td>
                                                <td>
                                                    <SubTitle title={":"} />
                                                </td>
                                                <td>
                                                    <SubTitle title={this.state.total_cost} />
                                                </td>
                                            </tr>

                                            {/* <tr>
                                                <td>
                                                    <SubTitle title={"Service Charges(10%)"} />
                                                </td>
                                                <td>
                                                    <SubTitle title={":"} />
                                                </td>
                                                <td>
                                                    <SubTitle title={this.state.service_charges} />
                                                </td>
                                            </tr> */}

                                            <tr>
                                                <td>
                                                    <SubTitle title={""} />
                                                </td>
                                                <td>
                                                    <SubTitle title={""} />
                                                </td>
                                                <td>
                                                    <SubTitle title={"-------------------"} />
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <SubTitle title={"Total"} />
                                                </td>
                                                <td>
                                                    <SubTitle title={":"} />
                                                </td>
                                                <td>
                                                    <SubTitle title={this.state.total_cost} />
                                                </td>
                                            </tr>
                                        </table>

                                    </Grid>

                                    <ValidatorForm className="mt-4" onSubmit={() => { this.submitData() }}>
                                        <Grid container spacing={2}>

                                            <Grid item>
                                                <SubTitle title="Send Date" />
                                                <LoonsDatePicker className="w-full"
                                                    selected={this.state.formData.required_date}
                                                    value={this.state.formData.required_date}
                                                    placeholder="Sales Date"
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







                                        </Grid>
                                        <Grid item>

                                            <Button
                                                className="mt-5 "
                                                progress={this.state.submitting}
                                                type="submit"
                                                scrollToTop={true}
                                                startIcon="save"
                                                disabled={this.state.formData.item_list.map(obj => obj.batch_list.map(item => item)).flat().length == 0}
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

                <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_employee} onClose={() => {
                    this.setState({ dialog_for_select_employee: false });
                    window.location.reload();
                }}>

                    <MuiDialogTitle disableTypography>
                        <CardTitle title="Select Your Employee" />
                        <br />
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <LoonsButton
                                color='primary'
                                onClick={() => {
                                    this.setState({ dialog_for_select_employee: false })
                                    localStorage.removeItem("coverUpInfo");
                                    window.location.reload()
                                }}>
                                <ApartmentIcon />
                                Change to me
                            </LoonsButton>
                        </div>
                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            onError={() => null}
                            onSubmit={() => this.handleSubmit()}
                            className="w-full">
                            <Grid className=" w-full" item="item">
                                <SubTitle title="Employee" />
                                <Autocomplete
                                    disableClearable
                                    className="w-full"
                                    options={this.state.selected_employee}
                                    onChange={(e, value) => {
                                        if (value != null) {
                                            this.setState({ selected_coverUp_emp: value })
                                            //localStorageService.setItem('coverUpInfo', value);
                                        }
                                    }}
                                    // value={this.state.selected_employee.find((v) => v.id == this.state.selected_coverUp_emp)}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Select Your Employee"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid className=" w-full" item="item">
                                <SubTitle title="Remark" />
                                <TextValidator className='' required={true} placeholder="Remark"
                                    //variant="outlined"
                                    fullWidth="fullWidth" variant="outlined" size="small" value={this.state.formData.remark} onChange={(e, value) => {
                                        let formData = this.state.formData
                                        if (e.target.value != '') {
                                            formData.remark = e.target.value;
                                        } else {
                                            formData.remark = null
                                        }
                                        this.setState({ formData })
                                    }}
                                /* validators={[
                                'required',
                                ]}
                                errorMessages={[
                                'this field is required',
                                ]} */
                                />
                            </Grid>
                            <Grid item="item">
                                {/* Submit Button */}
                                <LoonsButton className="mt-5 mr-2" progress={false} type='submit'>
                                    <span className="capitalize">Save</span>
                                </LoonsButton>
                            </Grid>
                        </ValidatorForm>
                    </div>
                </Dialog>

                <Dialog fullWidth maxWidth="sm" open={this.state.openWarning} 
                // onClose={() => {
                //     this.setState({ dialog_for_select_employee: false });
                //     window.location.reload();
                // }}
                >

                    <MuiDialogTitle disableTypography>
                        <h3>You entered value exceed from remaining !</h3>
                        <br />
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <LoonsButton
                                // color='primary'
                                style={{background:'red'}}
                                onClick={() => {
                                    this.setState({ openWarning: false })
             
                                }}>
                                {/* <ApartmentIcon /> */}
                                Ok
                            </LoonsButton>
                        </div>
                    </MuiDialogTitle>

                   
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

export default DetailsView
