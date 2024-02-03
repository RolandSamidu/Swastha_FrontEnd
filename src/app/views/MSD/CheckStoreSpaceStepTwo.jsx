import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    FormControlLabel,
    Checkbox,
    Hidden,
    IconButton,
    FormGroup,
    TextField,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import VisibilityIcon from '@material-ui/icons/Visibility';
import ClinicService from 'app/services/ClinicService'
import PatientServices from 'app/services/PatientServices'
import PatientClinicService from 'app/services/PatientClinicService'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { DateTimePicker } from '@material-ui/pickers'
import TablePagination from '@material-ui/core/TablePagination';
import {
    Button,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    CheckBox,
    ImageView,
    DatePicker,
    LoonsTable,
    CheckboxValidatorElement,
    LoonsSnackbar,
} from 'app/components/LoonsLabComponents'


import List from "@material-ui/core/List";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
//import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import InventoryService from 'app/services/InventoryService'
import ConsignmentService from 'app/services/ConsignmentService'
import WarehouseServices from 'app/services/WarehouseServices'
import CriteriasService from 'app/services/CriteriasService'
import * as appConst from '../../../appconst'

const styleSheet = (theme) => ({

    root: {
        margin: 'auto',
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        width: 200,
        height: 230,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
})

class CheckStoreSpaceStepTwo extends Component {
    constructor(props) {
        super(props)
        this.state = {

            alert: false,
            message: '',
            severity: 'success',

            checked: [],

            loaded: false,
            totalItems: 0,
            totalPages: 0,
            filterData: { limit: 10, page: 0 },

            itemSelected: false,
            formData: {
                item_id: null,
                sr_no: null,
                description: null,
                remark: null,
            },
            itemData: null,
            selected_item_data: {
                volume: 0,
                quantity: 0
            },
            warehouseSpaceData: {
                totalSpace: 0,
                availableSpace: 0,
            },
            warehouseData: {
                sr_no: null,

            },

            itemAllocations: [],
            itemAllocationsLoaded: false,
            ConsignmentItemDetails:{},
            columns: [

                {
                    name: 'Action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <Grid>
                                    <IconButton onClick={() => {
                                        let id = this.state.itemData[dataIndex].item_schedule.Order_item.item.id
                                        let item_id = this.state.itemData[dataIndex].id
                                        let formData = this.state.formData;
                                        formData.sr_no = this.state.itemData[dataIndex].item_schedule.Order_item.item.sr_no
                                        formData.description = this.state.itemData[dataIndex].item_schedule.Order_item.item.short_description

                                        let data = this.state.itemData[dataIndex].item_schedule
                                        let volume = parseFloat(data.width) * parseFloat(data.height) * parseFloat(data.depth);

                                        formData.volume = volume;

                                        let selected_item_data = this.state.selected_item_data;
                                        selected_item_data.volume = volume;
                                        selected_item_data.quantity = data.quantity;

                                        this.setState({ formData, selected_item_data, itemSelected: true })
                                        this.loadWarehouseData(item_id, id)
                                    }} size="small" aria-label="delete">
                                        <VisibilityIcon className="text-green" />
                                    </IconButton>


                                </Grid>
                            );
                        },
                    },
                },
                {
                    name: 'SR Number', // field name in the row object
                    label: 'SR Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex].item_schedule.Order_item.item.sr_no
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'SR Description',
                    label: 'SR Description',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex].item_schedule.Order_item.item.medium_description
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'Specification',
                    label: 'Specification',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            //let data = this.state.data[dataIndex].Order_item.item.short_description
                            return <p></p>
                        },
                    },
                },
                {
                    name: 'Invoice Qty',
                    label: 'Invoice Qty',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex].item_schedule.quantity
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'dimensions',
                    label: 'Dimensions',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex].item_schedule
                            return <p>{data.width}X{data.height}X{data.depth}</p>
                        },
                    },
                },
                // Customizable Columns
                // {
                //     name: 'faculty',
                //     label: 'Faculty',
                // },
                // {
                //     name: 'degree program',
                //     label: 'Degree Program',

                // },
                {
                    name: 'Volume',
                    label: 'Volume',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex].item_schedule
                            let qty = this.state.itemData[dataIndex].item_schedule.quantity;
                            return <p>{parseFloat(data.width) * parseFloat(data.height) * parseFloat(data.depth) * parseFloat(qty) / 1000000000} </p>

                        },
                    },
                },

                {
                    name: 'Status',
                    label: 'Status',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                        },
                    },
                },
            ],


            allWarehouses: [],
            allCapacityData: [],
            allCapacityColumns: [
                {
                    name: 'name', // field name in the row object
                    label: 'Store Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemAllocations[dataIndex].Warehouse.name;
                            return (
                                <p>
                                    {data}
                                </p>
                            )
                        }
                    },
                },
                {
                    name: 'total_volume',
                    label: 'Total Space(CuM)',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemAllocations[dataIndex].volume;
                            return (
                                <p>
                                    {data}
                                </p>
                            )
                        }
                    },
                },

                {
                    name: 'quantity',
                    label: 'Quantity',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemAllocations[dataIndex].quantity;
                            return (
                                <p>
                                    {data}
                                </p>
                            )

                        },
                    },
                },

            ],
            allCapacityLoaded: false
        }
    }


    async loadSPCData() {
        let id = this.props.match.params.id;

        this.setState({ loaded: false })
        let res = await ConsignmentService.getConsignmentById(id)
        console.log("item by id", res.data.view.ConsignmentItems)
        let formData = this.state.formData;
        if (200 == res.status) {
            this.setState({
                itemData: res.data.view.ConsignmentItems,
                loaded: true
            })
        }
    }

    /*     async loadWarehoureDataSecond(wr_id) {
            let res = await WarehouseServices.getWarehoureById(wr_id)
            console.log("warehouse by id", res.data.view)
            let warehouseSpaceData = this.state.warehouseSpaceData;
    
    
            warehouseSpaceData.totalSpace = 0;
            if (200 == res.status) {
    
    
                res.data.view.WarehousesBins.forEach(element => {
    
                    let warehouseSpaceData = this.state.warehouseSpaceData;
                    warehouseSpaceData.totalSpace = warehouseSpaceData.totalSpace + parseFloat(element.volume);
                    this.setState({ warehouseSpaceData }, () => {
                        this.loadWarehouseSpaces(res.data.view.primary_wh)
                    })
                });
    
    
                this.setState({
                    warehouseData: res.data.view
                    //loaded: true
                })
            }
        } */


    async loadConsingmentItemData(id) {
        let res = await ConsignmentService.getConsignmentItemsById(id);
        if (200 == res.status) {
            console.log("consingment data", res.data.view)
            this.setState({

                ConsignmentItemDetails: res.data.view,

            })

        }
    }

    async loadWarehouseData(item_id, id) {

        this.setState({

            itemAllocationsLoaded: false
            //loaded: true
        })
        // this.setState({ loaded: false })
        let params = { item_id: item_id,limit:50,page:0 };
        let formData = this.state.formData;
        formData.item_id = item_id;
        this.loadConsingmentItemData(item_id)
        let res = await WarehouseServices.getwarehoureItemAllocation(params, id)
        console.log("aaasds", res.data.view.data)
        if (200 == res.status) {

            this.setState({
                formData,
                itemAllocations: res.data.view.data,
                itemAllocationsLoaded: res.data.view.data.length != 0 ? true : false
                //loaded: true
            })

        }
        /* 
                let res = await InventoryService.fetchItemById(params, id)
        
                if (200 == res.status) {
                    this.loadWarehoureDataSecond(res.data.view.primary_wh)
                    let warehouseData = this.state.warehouseData;
                    warehouseData.sr_no = res.data.view.sr_no;
        
        
                    this.setState({
                        formData,
                        warehouseData
                        //loaded: true
                    }) 
                }*/
    }

    async loadWarehouseSpaces(id) {
        let params = { load_type: 'warehouse_sum', warehouse_id: id };

        let res = await WarehouseServices.getWarehoure(params)
        console.log("warehouse capacity data", res.data.view.data)
        if (200 == res.status) {
            let warehouseSpaceData = this.state.warehouseSpaceData;
            // warehouseSpaceData.totalSpace = warehouseSpaceData.totalSpace + parseFloat(element.volume);
            if (res.data.view.data.length > 0) {
                let data = parseFloat(res.data.view.data[0].allocations)
                warehouseSpaceData.availableSpace = warehouseSpaceData.totalSpace - parseFloat(data)
            }

            this.setState({
                warehouseSpaceData

                //loaded: true
            })
        }

    }

    async loadAllSpaces() {
        let params = { load_type: 'warehouse_sum' };

        let res = await WarehouseServices.getWarehoure(params)
        console.log("all capacity data", res.data.view.data)
        if (200 == res.status) {
            this.setState({
                allCapacityData: res.data.view.data,

                //loaded: true
            }, () => {
                this.loadAllWarehouse();
            })
        }

    }

    async loadAllWarehouse() {
        let params = { limit: 9999 };

        let res = await WarehouseServices.getWarehoure(params)
        console.log("all warehouses", res.data.view.data)
        if (200 == res.status) {
            this.setState({
                allWarehouses: res.data.view.data,
                allCapacityLoaded: true
                //loaded: true
            })
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
                //this.loadConsignmentList()
            }
        )
    }



    async submit() {
        let formData = this.state.formData;
        let allWarehouses = this.state.allWarehouses;
        let warehouse_details = []


        if (allWarehouses.filter((item) => item.selected).length == 0) {

            warehouse_details.push({
                "warehouse_id": this.state.warehouseData.id,
                "quantity": this.state.selected_item_data.quantity,
                "volume": this.state.selected_item_data.volume
            })
        } else {
            allWarehouses.forEach(element => {
                if (element.selected) {
                    warehouse_details.push({
                        "warehouse_id": element.id,
                        "quantity": element.quantity,
                        "volume": formData.volume
                    })
                }
            });
        }

        formData.warehouse_details = warehouse_details;
        formData.action = "AD Allocation Approved";

        let res = await WarehouseServices.warehoureItemAllocation(formData)
        if (res.status == 201) {
            this.setState({
                alert: true,
                message: 'Space Allocation Success',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Space Allocation Unsuccessful',
                severity: 'error',
            })
        }
    }

    async reject() {
        let formData = this.state.formData;

        formData.action = "AD Allocation Rejected";

        let res = await WarehouseServices.warehoureItemAllocation(formData)
        if (res.status == 201) {
            this.setState({
                alert: true,
                message: 'Space Allocation Reject Success',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Space Allocation Reject Unsuccessful',
                severity: 'error',
            })
        }
    }


    async componentDidMount() {
        this.loadSPCData()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Manage store space" />
                        {/* Content start*/}
                        {this.state.loaded ? (
                            <div className="pt-10">
                                <LoonsTable
                                    //title={"All Aptitute Tests"}
                                    id={'allRegisteredStudents'}
                                    data={this.state.itemData}
                                    columns={this.state.columns}

                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        rowsSelected: this.state.all_selected_rows,
                                        // count:this.state.totalPages,
                                        count: this.state.totalItems,
                                        rowsPerPage: 20,
                                        page: this.state.filterData.page,
                                        selectableRows: false,
                                        onRowsSelect: (
                                            curRowSelected,
                                            allRowsSelected
                                        ) => {
                                            console.log('---RowSelect')
                                            console.log(
                                                'Row Selected: ',
                                                curRowSelected
                                            )
                                            console.log(
                                                'All Selected: ',
                                                allRowsSelected
                                            )

                                            // this.setState({
                                            //     all_selected_rows:
                                            //         allRowsSelected,
                                            // })
                                        },




                                        // rowsPerPageOptions: [10,20,30,40],
                                        onTableChange: (action, tableState) => {
                                            console.log(action, tableState)
                                            switch (action) {
                                                case 'changePage':
                                                    this.setPage(tableState.page)
                                                    //this.changePage(tableState.page, tableState.sortOrder);
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

                                {this.state.itemSelected ?
                                    <div className='mt-6'>
                                        <Grid container>
                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                <Grid container>
                                                    <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                        <SubTitle title="SR Number :" />
                                                    </Grid>
                                                    <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                        {this.state.formData.sr_no}
                                                    </Grid>
                                                </Grid>

                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                <Grid container>
                                                    <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                        <SubTitle title="SR Name :" />
                                                    </Grid>
                                                    <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                        {this.state.formData.description}
                                                    </Grid>
                                                </Grid>

                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                <Grid container>
                                                    <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                        <SubTitle title="Store Name :" />
                                                    </Grid>
                                                    <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                        {this.state.warehouseData.name}
                                                    </Grid>
                                                </Grid>

                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                <Grid container>
                                                    <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                        <SubTitle title="Total Space(Cum) :" />
                                                    </Grid>
                                                    <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                        {this.state.warehouseSpaceData.totalSpace}
                                                    </Grid>
                                                </Grid>

                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                <Grid container>
                                                    <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                        <SubTitle title="Total Available Space :" />
                                                    </Grid>
                                                    <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                        {this.state.warehouseSpaceData.availableSpace}
                                                    </Grid>
                                                </Grid>

                                            </Grid>




                                        </Grid>

                                        <Grid item className="mt-5">
                                           

                                            <Grid className="mt-5" style={{ backgroundColor: '#e1ecf5' }}>
                                                {this.state.itemAllocationsLoaded ? (

                                                    <LoonsTable
                                                        //title={"All Aptitute Tests"}
                                                        id={'allWarehouses'}
                                                        data={this.state.itemAllocations}
                                                        columns={this.state.allCapacityColumns}

                                                        options={{
                                                            download: false,
                                                            viewColumns: false,
                                                            print: false,
                                                            pagination: false,
                                                            serverSide: true,
                                                            rowsSelected: this.state.all_selected_rows,
                                                            // count:this.state.totalPages,
                                                            count: this.state.totalItems,
                                                            //rowsPerPage: 20,
                                                            page: this.state.filterData.page,
                                                            selectableRows: false,
                                                            onRowsSelect: (
                                                                curRowSelected,
                                                                allRowsSelected
                                                            ) => {
                                                                console.log('---RowSelect')
                                                                console.log(
                                                                    'Row Selected: ',
                                                                    curRowSelected
                                                                )
                                                                console.log(
                                                                    'All Selected: ',
                                                                    allRowsSelected
                                                                )

                                                                // this.setState({
                                                                //     all_selected_rows:
                                                                //         allRowsSelected,
                                                                // })
                                                            },




                                                            // rowsPerPageOptions: [10,20,30,40],
                                                            onTableChange: (action, tableState) => {
                                                                console.log(action, tableState)
                                                                switch (action) {
                                                                    case 'changePage':
                                                                        this.setPage(tableState.page)
                                                                        //this.changePage(tableState.page, tableState.sortOrder);
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
                                                ) : null}

                                            </Grid>





                                        </Grid>


                                        <Grid container className='mt-7'>
                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                <div>
                                                    <SubTitle title="AD Recommendation" />
                                                    <div className='mt-2'>
                                                        {this.state.ConsignmentItemDetails.status}
                                                    </div>
                                                </div>
                                                <div>
                                                    <SubTitle title="AD Remark" />
                                                    <div className='mt-2'>
                                                    {this.state.ConsignmentItemDetails.ad_remark}
                                                    </div>
                                                </div>


                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>

                                                <div>
                                                    <SubTitle title="MSA Remark" />
                                                    <div className='mt-2'>
                                                        {this.state.ConsignmentItemDetails.msa_remark}
                                                    </div>
                                                </div>


                                            </Grid>

                                        </Grid>



                                        <ValidatorForm onSubmit={() => { this.submit() }}>
                                            <Grid className=" w-full mt-5" item lg={6} md={6} sm={12} xs={12}>
                                                <SubTitle title="Remark" />

                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Remark"
                                                    name="remark"
                                                    InputLabelProps={{ shrink: false }}
                                                    value={this.state.formData.remark}
                                                    type="text"
                                                    multiline
                                                    rows={3}
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        let formData = this.state.formData;
                                                        formData.remark = e.target.value;
                                                        this.setState({ formData })
                                                    }}
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                />
                                            </Grid>

                                            <Grid container spacing={2} className="mt-2">


                                                <Grid item>
                                                    <Button
                                                        className="p-2 min-w-32"
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        type="submit"
                                                    //onClick={handleAmountDecrease}
                                                    >
                                                        Accept
                                                    </Button>
                                                </Grid>
                                                <Grid item >
                                                    <Button
                                                        className="p-2 min-w-32"
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        onClick={() => { this.reject() }}
                                                    >
                                                        Not Accept & Allocate Again
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </ValidatorForm>
                                    </div>
                                    : null}




                            </div>
                        ) : (
                            <Grid className="justify-center text-center w-full pt-12">
                                {/*  <CircularProgress size={30} /> */}
                            </Grid>
                        )}

                        {/* Content End */}
                    </LoonsCard>
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
                </MainContainer>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(CheckStoreSpaceStepTwo)
