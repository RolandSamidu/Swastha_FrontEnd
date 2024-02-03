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
import localStorageService from 'app/services/localStorageService'
import * as appConst from '../../../../appconst'

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

class BinAllocate extends Component {
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
                action: "MSA Allocation Approved",
                remark: null,
                warehouse_allocation_id: "",
                warehouse_details: []

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
                                        //let id = this.state.itemData[dataIndex].item_schedule.Order_item.item.id
                                        let item_id = this.state.itemData[dataIndex].item_id
                                        let formData = this.state.formData;
                                        //formData.sr_no = this.state.itemData[dataIndex].item_schedule.Order_item.item.sr_no
                                        // formData.description = this.state.itemData[dataIndex].item_schedule.Order_item.item.short_description

                                        //let data = this.state.itemData[dataIndex].item_schedule
                                        //let volume = parseFloat(data.width) * parseFloat(data.height) * parseFloat(data.depth) / 1000000000;

                                        let volume = this.state.itemData[dataIndex].volume
                                        let quantity = this.state.itemData[dataIndex].quantity

                                        //formData.warehouse_details.volume = volume;
                                        formData.item_id = item_id;

                                        let selected_item_data = this.state.selected_item_data;

                                        let data = this.state.itemData[dataIndex]
                                        console.log("selected row", data)
                                        let pack_volume = parseFloat(volume) / parseFloat(this.state.itemData[dataIndex].no_of_pack);

                                        selected_item_data.volume = volume;
                                        selected_item_data.quantity = quantity;
                                        selected_item_data.pack_volume = pack_volume;
                                        selected_item_data.no_of_pack = this.state.itemData[dataIndex].no_of_pack;

                                        selected_item_data.pack_size = this.state.itemData[dataIndex].ConsignmentItem.pack_size ? this.state.itemData[dataIndex].ConsignmentItem.pack_size : data.pack_size;
                                        selected_item_data.msa_status = this.state.itemData[dataIndex].msa_status;
                                        selected_item_data.msa_remark = this.state.itemData[dataIndex].msa_remark;
                                        
                                        
                                        formData.warehouse_allocation_id = this.state.itemData[dataIndex].id;

                                        this.setState({ formData, selected_item_data, itemSelected: true })
                                        this.loadBinData(data.warehouse_id)
                                        this.loadBinTypeAllocation(this.state.itemData[dataIndex].id)


                                    }} size="small" aria-label="delete">
                                        <VisibilityIcon className="text-green" />
                                    </IconButton>


                                </Grid>
                            );
                        },
                    },
                },
                {
                    name: 'name', // field name in the row object
                    label: 'Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex].ConsignmentItem.item_schedule.Order_item.item.name
                            return <p>{data}</p>
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
                            let data = this.state.itemData[dataIndex].ConsignmentItem.item_schedule.Order_item.item.sr_no
                            return <p>{data}</p>
                        },
                    },
                },
               /*  {
                    name: 'SR Description',
                    label: 'SR Description',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex].ConsignmentItem.item_schedule.Order_item.item.medium_description
                            return <p>{data}</p>
                        },
                    },
                }, */
                /* {
                    name: 'Specification',
                    label: 'Specification',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Order_item.item.short_description
                            return <p></p>
                        },
                    },
                }, */
                {
                    name: 'Invoice Qty',
                    label: 'Invoice Qty',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex].quantity
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'no_of_pack',
                    label: 'No of Pack',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex].no_of_pack
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
                            let data = this.state.itemData[dataIndex].ConsignmentItem
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
                            let data = this.state.itemData[dataIndex].volume
                            // let qty = this.state.itemData[dataIndex].item_schedule.quantity;
                            return <p>{data} </p>

                        },
                    },
                },
                {
                    name: 'ad_remark',
                    label: 'AD Remark',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex].ConsignmentItem.ad_remark
                            // let qty = this.state.itemData[dataIndex].item_schedule.quantity;
                            return <p>{data} </p>

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
                            let data = this.state.itemData[dataIndex].msa_status
                            // let qty = this.state.itemData[dataIndex].item_schedule.quantity;
                            return <p>{data} </p>
                        },
                    },
                },
            ],


            allWarehouses: [],
            allCapacityData: [],
            binDataColumn: [
                {
                    name: 'name', // field name in the row object
                    label: 'Bin Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,

                    },
                },
                {
                    name: 'total_volume',
                    label: 'Total Space(CuM)',
                    options: {
                        filter: true,
                        display: true,

                    },
                },
                {
                    name: 'bin_counts',
                    label: 'Bin Counts',
                    options: {
                        filter: true,
                        display: true,

                    },
                },
                {
                    name: 'total_stored_volume',
                    label: 'Stored Volume',
                    options: {
                        filter: true,
                        display: true,

                    },
                },
                {
                    name: 'total_allocated_volume',
                    label: 'Allocated Volume',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let item = this.state.binData[dataIndex];
                            let alocated_bin = this.state.binAllocationData.find((obj) => obj.bin_type_id == item.bin_type_id)

                            return alocated_bin?.total_volume;


                        }
                    },
                },
                {
                    name: 'available_volume',
                    label: 'Available Space(CuM)',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let item = this.state.binData[dataIndex];
                            let alocated_bin = this.state.binAllocationData.find((obj) => obj.bin_type_id == item.bin_type_id)
                            let allocated_total_volume = 0;
                            let total_volume = item.total_volume;
                            let total_stored_volume = item.total_stored_volume;
                            if (alocated_bin?.total_volume) {
                                allocated_total_volume = alocated_bin?.total_volume;
                            }
                            console.log("allocated total volume", allocated_total_volume)

                            let available_space = parseFloat(total_volume) - (parseFloat(total_stored_volume) + parseFloat(allocated_total_volume))
                            return available_space;


                        }
                    },
                },

                {
                    name: 'requ_volume',
                    label: 'Required Volume(CuM)',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let binData = this.state.binData;
                            console.log("pack vol", this.state.selected_item_data.pack_volume)
                            let vol = 0;



                            if (binData[dataIndex].no_of_pack) {
                                vol = parseFloat(this.state.selected_item_data.pack_volume) * parseFloat(binData[dataIndex].no_of_pack);
                            }

                            return vol.toFixed(5);


                        }
                    },
                },

                /*      {
                         name: 'space',
                         label: 'Allocated Pack Qty',
                         options: {
                             filter: true,
                             display: true,
                             customBodyRenderLite: (dataIndex) => {
                                 let item = this.state.binData[dataIndex];
                                 let allocated_item = this.state.binTypeAllocationData.find((obj) => obj.bin_type_id == item.bin_type_id)
                                 return allocated_item?.no_of_pack
                             }
     
                         }
                     }, */

                {
                    name: 'space',
                    label: 'Allocate No of Pack',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let item = this.state.binData[dataIndex];
                            let alocated_bin = this.state.binAllocationData.find((obj) => obj.bin_type_id == item.bin_type_id)

                            let allocated_total_volume = 0;
                            let total_volume = item.total_volume;
                            let total_stored_volume = item.total_stored_volume;
                            if (alocated_bin?.total_volume) {
                                allocated_total_volume = alocated_bin?.total_volume;
                            }

                            let available_space = parseFloat(total_volume) - (parseFloat(total_stored_volume) + parseFloat(allocated_total_volume))

                            let allocated_item_details = this.state.binTypeAllocationData.find((obj) => obj.bin_type_id == item.bin_type_id)
                            let editeble = allocated_item_details
                            console.log("editable", editeble)

                            return (
                                <ValidatorForm>
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Allocate No of Pack"
                                        name="no_of_pack"
                                        disabled={editeble != undefined}
                                        InputLabelProps={{ shrink: false }}
                                        value={
                                            editeble != undefined ? allocated_item_details?.no_of_pack : this.state.binData[dataIndex].no_of_pack
                                        }
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            /*  let formData = this.state.formData;
                                             formData.warehouse_details.quantity = e.target.value
                                             formData.warehouse_details.bin_type_id = item.bin_type_id;
                                             this.setState({ formData }) */

                                            let binData = this.state.binData;
                                            let vol = 0;
                                            vol = parseFloat(this.state.selected_item_data.pack_volume) * parseFloat(e.target.value);


                                            binData[dataIndex].no_of_pack = e.target.value;
                                            binData[dataIndex].quantity = parseFloat(e.target.value) * parseFloat(this.state.selected_item_data.pack_size);
                                            console.log(vol, "vol check")
                                            console.log(this.state.selected_item_data, "daata pack_size")
                                            console.log(binData, "binData")
                                            if (vol < available_space) {

                                                this.setState({ binData })
                                            } else {
                                                this.setState({
                                                    alert: true,
                                                    message: 'Not Enough Available Space',
                                                    severity: 'error',
                                                })
                                            }





                                        }}
                                        validators={['required', 'maxNumber:' + this.state.selected_item_data.no_of_pack + "'"]}
                                        errorMessages={[
                                            'this field is required', 'Cannot Allocate More than No of Pack'
                                        ]}
                                    />

                                </ValidatorForm>
                            )
                        },
                    },
                },

            ],
            allCapacityLoaded: false,

            binAllocationData: [],
            binData: [],
            loadedBinData: false,
            msa_id: null,
            warehouse_id: '',
            binTypeAllocationData: []
        }
    }


    async loadSPCData() {
        let id = this.props.match.params.id;
        var user = await localStorageService.getItem('userInfo');

        this.setState({ msa_id: user.id })
        this.setState({ loaded: false })
        let params = { consignment_id: id, msa_id: user.id }
        let res = await WarehouseServices.getwarehoureItemAllocation(params)
        console.log("item by id", res.data.view.data)
        let formData = this.state.formData;
        if (200 == res.status) {
            this.setState({
                itemData: res.data.view.data,
                loaded: true
            })
        }
    }



    async loadBinData(warehouse_id) {

        // this.setState({ loaded: false })
        let params = {
            msa_id: this.state.msa_id,
            warehouse_id: warehouse_id,
            load_type: 'bin_sum'
        };


        let res = await WarehouseServices.getBinTypes(params)



        if (200 == res.status) {
            this.loadBinAllocationData(warehouse_id);
            /* 
                        let tempData=[];
                        res.data.view.data.forEach(element => {
                            element.volume=0;
                            element.quantity=0;
                            tempData.push(element)
                        });
            
                        console.log("bin types",tempData) */
            console.log("bin data", res.data.view.data)
            this.setState({
                binData: res.data.view.data
                //loaded: true
            })
        }
    }

    async loadBinAllocationData(warehouse_id) {

        this.setState({ loadedBinData: false })
        let params = {
            warehouse_id: warehouse_id,
            load_type: 'bin_sum',
            status: 'allocated'
        };


        let res = await WarehouseServices.getBinAllocations(params)

        if (200 == res.status) {
            console.log("bin allocation", res.data.view.data)
            this.setState({
                binAllocationData: res.data.view.data,
                loadedBinData: true
            })
        }
    }

    async loadBinTypeAllocation(warehouse_allocation_id) {

        // this.setState({ loaded: false })
        let params = {
            warehouse_allocation_id: warehouse_allocation_id,

        };


        let res = await WarehouseServices.getBinAllocations(params)

        if (200 == res.status) {
            console.log("bin type allocation", res.data.view.data)
            this.setState({
                binTypeAllocationData: res.data.view.data,

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
        formData.msa_id = this.state.msa_id;

        formData.action = "MSA Allocation Approved";
        console.log(this.state.binData, "this.state.binData")
        console.log(formData, "formData")
        /*  if (formData.warehouse_details.quantity == null) {
             this.setState({
                 alert: true,
                 message: 'Please Enter Quantity',
                 severity: 'error',
             })
         } else {
             console.log("formdata", formData)
         } */
        this.state.binData.forEach(element => {
            console.log(element, "bin quantity")
            if (element.no_of_pack) {
                console.log(element.quantity, "bin quantity")
                let pack_quantity = parseFloat(this.state.selected_item_data.quantity) / parseFloat(this.state.selected_item_data.no_of_pack)

                formData.warehouse_details.push({
                    "bin_type_id": element.bin_type_id,
                    "volume": parseFloat(this.state.selected_item_data.pack_volume) * parseFloat(element.no_of_pack),
                    "quantity": pack_quantity * parseFloat(element.no_of_pack),
                    "no_of_pack": element.no_of_pack

                })
            }

        });
        console.log("formdata", formData)
        if (formData.warehouse_details.length > 0) {


            let res = await WarehouseServices.binAllocations(formData)
            console.log("allocated", res)
            if (res.status == 201) {
                this.setState({
                    alert: true,
                    message: 'BinType Allocation Success',
                    severity: 'success',
                }, () => {
                    window.location.reload()
                })
            } else {
                this.setState({
                    alert: true,
                    message: 'Cannot Allocate the Bin Type',
                    severity: 'error',
                })
            }
        }




    }

    async reject() {
        let formData = this.state.formData;
        formData.msa_id = this.state.msa_id;

        formData.action = "MSA Allocation Rejected";



        let res = await WarehouseServices.binAllocations(formData)
        console.log("allocated", res)
        if (res.status == 201) {
            this.setState({
                alert: true,
                message: 'BinType Allocation Rejected',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Cannot Reject Allocation',
                severity: 'error',
            })
        }


    }



    async componentDidMount() {
        this.loadSPCData()
        console.log(this.state.binData, "this.state.binData")
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
                                        pagination: false,
                                        serverSide: true,
                                        //rowsSelected: this.state.all_selected_rows,
                                        // count:this.state.totalPages,
                                        //count: this.state.totalItems,
                                        //rowsPerPage: 20,
                                        //page: this.state.filterData.page,
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
                                                {this.state.loadedBinData ? (

                                                    <LoonsTable
                                                        //title={"All Aptitute Tests"}
                                                        id={'allBinData'}
                                                        data={this.state.binData}
                                                        columns={this.state.binDataColumn}

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



                                        <ValidatorForm onSubmit={() => { this.submit() }}>
                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                <SubTitle title="Remark" />

                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Remark"
                                                    name="remark"
                                                    disabled={this.state.selected_item_data.msa_status!="Pending"?true:false}
                                                    InputLabelProps={{ shrink: false }}
                                                    value={this.state.selected_item_data.msa_status!="Pending"?this.state.selected_item_data.msa_remark:this.state.formData.remark}
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

                                            {this.state.selected_item_data.msa_status == "Pending" ?
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
                                                            Allocate & Accept
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
                                                            Not Accept
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                                : null}
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

export default withStyles(styleSheet)(BinAllocate)
