import {
    CircularProgress,
    Dialog,
    Divider,
    Grid,
    InputAdornment,
    Typography,
    FormControlLabel,
    Radio,
} from '@material-ui/core'
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
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import React, { Fragment } from 'react'
import { Component } from 'react'
import SearchIcon from '@material-ui/icons/Search'
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
import { dateParse } from 'utils'
import moment from 'moment'

class DetailsView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            updateData: {
                noOfDays: 0,
            },
            alert: false,
            message: '',
            severity: 'success',
            formData: {
                item_id: null,
                description: null,
                store_quantity: null,
                lessStock: null,
                moreStock: null,
                page: 0,
                limit: 100,
                warehouse_id: this.props.warehouse_id,
                exp_date_order: true,
                exp_date_grater_than_zero_search: 'false',
                quantity_grater_than_zero_search: 'false',
                search: null,
                item_status: ['Active', 'Pending', 'DC', 'Discontinued'],
                orderby_drug: true,
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
                        width: '100px',
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
                    name: 'quantity', // field name in the row object
                    label: 'Quantity', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex].quantity
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(cellData)
                            }
                        },
                    },
                },
            ],
            data: [],
            printData: [],
        }
    }

    // async loadData() {
    //     //function for load initial data from backend or other resources
    //     let ven_res = await WarehouseServices.getVEN({ limit: 99999 })
    //     if (ven_res.status == 200) {
    //         console.log('Ven', ven_res.data.view.data)
    //         this.setState({ all_ven: ven_res.data.view.data })
    //     }
    //     let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
    //     if (cat_res.status == 200) {
    //         console.log('Categories', cat_res.data.view.data)
    //         this.setState({ all_item_category: cat_res.data.view.data })
    //     }
    //     let class_res = await ClassDataSetupService.fetchAllClass({
    //         limit: 99999,
    //     })
    //     if (class_res.status == 200) {
    //         console.log('Classes', class_res.data.view.data)
    //         this.setState({ all_item_class: class_res.data.view.data })
    //     }
    //     let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
    //     if (group_res.status == 200) {
    //         console.log('Groups', group_res.data.view.data)
    //         this.setState({ all_item_group: group_res.data.view.data })
    //     }
    // }

    // async printData() {
    //     this.setState({ printLoaded: false })
    //     let params = this.state.formData
    //     delete params.limit
    //     delete params.page
    //     let res = await WarehouseServices.getSingleItemWarehouse(
    //         this.state.formData
    //     )
    //     if (res.status) {
    //         console.log('data', res.data.view.data)
    //         this.setState(
    //             {
    //                 printData: res.data.view.data,
    //                 printLoaded: true,
    //                 totalItems: res.data.view.totalItems,
    //             },
    //             () => {
    //                 this.render()
    //                 document.getElementById('print_button_001').click()
    //                 // this.getCartItems()
    //             }
    //         )
    //         console.log('Print Data', this.state.printData)
    //     }
    // }

    async loadOrderList() {
        this.setState({ loaded: false, cartStatus: [] })
        let res = await WarehouseServices.getSingleItemWarehouse(
            this.state.formData
        )

        let params = {
            // warehouse_id: warehouse_id.frontDesk_id,
            // type: 'Monthly',
            // from: this.state.from,
            // to: this.state.to,
            // item_id: this.state.filterData.item_id,
            // item_id: 'a30cd110-9784-4177-aa35-206f19a00811',
        }

        if (res.status) {
            let data = res.data.view.data
            console.log('This is data', data)
            // data.map((data) => {
            //     let expDate = dateParse(data.ItemSnapBatch.exd)

            //     if (expDate > moment().add(6, 'months').toDate()) {
            //         console.log('This is data exp', expDate)
            //     }
            // })
            // data.filter((item) => {
            //     let expDate = dateParse(item.ItemSnapBatch.exd)
            //     let superExp = expDate > moment().add(6, 'months').toDate()
            //     return superExp
            // })
            // console.log('This is data exp', superExp)
            this.setState(
                {
                    data: res.data.view.data,
                    loaded: true,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                    // this.getCartItems()
                }
            )
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
                console.log('New formdata', this.state.formData)
                this.loadOrderList()
            }
        )
    }

    // async loadWarehouses() {
    //     this.setState({
    //         warehouse_loaded: false,
    //     })
    //     var user = await localStorageService.getItem('userInfo')
    //     console.log('user', user)
    //     var id = user.id
    //     var all_pharmacy_dummy = []
    //     var selected_warehouse_cache = await localStorageService.getItem(
    //         'Selected_Warehouse'
    //     )
    //     if (!selected_warehouse_cache) {
    //         this.setState({
    //             selectWarehouseView: true,
    //         })
    //     } else {
    //         this.state.formData.warehouse_id = selected_warehouse_cache.id
    //         this.setState({
    //             selectWarehouseView: false,
    //             warehouse_loaded: true,
    //         })
    //     }
    //     let params = { employee_id: id }
    //     let res = await WarehouseServices.getWareHouseUsers(params)
    //     if (res.status == 200) {
    //         console.log('CPALLOders', res.data.view.data)

    //         res.data.view.data.forEach((element) => {
    //             all_pharmacy_dummy.push({
    //                 warehouse: element.Warehouse,
    //                 name: element.Warehouse.name,
    //                 main_or_personal: element.Warehouse.main_or_personal,
    //                 owner_id: element.Warehouse.owner_id,
    //                 id: element.warehouse_id,
    //                 pharmacy_drugs_stores_id:
    //                     element.Warehouse.pharmacy_drugs_store_id,
    //             })
    //         })
    //         console.log('warehouse', all_pharmacy_dummy)
    //         this.setState({
    //             allWarehouses: all_pharmacy_dummy,
    //         })
    //     }
    // }

    componentDidMount() {
        // this.loadWarehouses();
        // this.load_days(31)
        //this.loadData()
        this.loadOrderList()
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <ValidatorForm
                        className="pt-2"
                        onSubmit={() => this.loadOrderList()}
                        onError={() => null}
                    >
                        {/* Main Grid */}
                        <Grid container="container" spacing={2} direction="row">
                            {/* Table Section */}
                            <Grid container="container" className="">
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
                                                count: this.state.totalItems,
                                                rowsPerPage:
                                                    this.state.formData.limit,
                                                page: this.state.formData.page,
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
                    </ValidatorForm>
                </MainContainer>
                {/* <Dialog
                    fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.selectWarehouseView}
                >
                    <Button variant="outlined" onClick={handleClickOpen}>
                <ArrowDropDownIcon />
            </Button>
                    <MuiDialogTitle disableTypography="disableTypography">
                        <CardTitle title="Select Your Warehouse" />
                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm onError={() => null} className="w-full">
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                // ref={elmRef}
                                options={this.state.allWarehouses}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        localStorageService.setItem(
                                            'Selected_Warehouse',
                                            value
                                        )
                                        this.setState({
                                            selectWarehouseView: false,
                                        })

                                        this.loadWarehouses()
                                        this.setState({
                                            warehouse_loaded: true,
                                            selectedWarehouse: value,
                                        })
                                        this.loadOrderList()
                                    }
                                }}
                                value={{
                                    name: this.state.selectedWarehouse
                                        ? this.state.allWarehouses.filter(
                                            (obj) =>
                                                obj.id ==
                                                this.state.selectedWarehouse
                                        ).name
                                        : null,
                                    id: this.state.selectedWarehouse,
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
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />
                        </ValidatorForm>
                    </div>
                </Dialog> */}
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
