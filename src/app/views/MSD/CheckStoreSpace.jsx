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
    Dialog,
    FormGroup,
    TextField,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
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

import Tooltip from "@material-ui/core/Tooltip";
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
import EditIcon from '@material-ui/icons/Edit'
import * as appConst from '../../../appconst'
import { roundDecimal } from 'utils'

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

class CheckStoreSpace extends Component {
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
            selected_item_status: '',

            allCapacityLoadedForEdit: false,
            editWarehousePopup: false,
            allWarehousesForEdit: [],
            editSelectedData: {
                warehouse_id: null,
                quantity: null
            },
            allCapacityColumnsForEdit: [{
                name: 'Action', // field name in the row object
                label: 'Action', // column title that will be shown in table
                options: {
                    filter: true,
                    display: true,
                    customBodyRenderLite: (dataIndex) => {
                        return (
                            <Grid>
                                <FormControlLabel
                                    //label={field.placeholder}
                                    //name={field.}
                                    //value={val.value}

                                    onChange={() => {
                                        let allWarehousesForEdit = this.state.allWarehousesForEdit;

                                        let editSelectedData = this.state.editSelectedData
                                        editSelectedData.warehouse_id = allWarehousesForEdit[dataIndex].id


                                        const updatedallWarehousesForEdit = allWarehousesForEdit.map(item => {
                                            return { ...item, selected: false, no_of_pack: null }; // Update age for user with id 2

                                        });
                                        updatedallWarehousesForEdit[dataIndex].selected = true;
                                        updatedallWarehousesForEdit[dataIndex].no_of_pack = this.state.seleceted_item_allocation_row.no_of_pack

                                        this.setState({ allWarehousesForEdit: updatedallWarehousesForEdit, editSelectedData })
                                    }}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            checked={this.state.allWarehousesForEdit[dataIndex].selected == true}
                                            defaultChecked={this.state.allWarehousesForEdit[dataIndex].selected == true}
                                            size="small"
                                        />
                                    }
                                    display="inline"

                                />


                            </Grid>
                        );
                    },
                },
            },
            {
                name: 'name', // field name in the row object
                label: 'Store Name', // column title that will be shown in table
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
                    customBodyRenderLite: (dataIndex) => {
                        let totalValume = 0;
                        this.state.allWarehousesForEdit[dataIndex].WarehousesBins.forEach(element => {
                            totalValume = totalValume + parseFloat(element.volume);

                        });
                        return (
                            <p>
                                {isNaN(totalValume) ? 0 : totalValume}
                            </p>
                        )
                    }
                },
            },
            {
                name: 'Total Available Space',
                label: 'Total Available Space',
                options: {
                    filter: true,
                    display: true,
                    customBodyRenderLite: (dataIndex) => {
                        let totalValume = 0;

                        this.state.allWarehousesForEdit[dataIndex].WarehousesBins.forEach(element => {
                            totalValume = totalValume + parseFloat(element.volume);
                        });


                        let warehouseID = this.state.allWarehousesForEdit[dataIndex].id
                        let capacity = [];
                        capacity = this.state.allCapacityData.filter((item) => item.warehouse_id == warehouseID)
                        console.log("totoal", capacity)
                        if (capacity.length > 0) {
                            let data = parseFloat(totalValume) - parseFloat(capacity[0]?.allocations)
                            return <p>{isNaN(data) ? 0 : data}</p>
                        } else {
                            let data = parseFloat(totalValume)
                            return <p>{isNaN(data) ? 0 : data}</p>
                        }

                    },
                },
            },
            {
                name: 'quantity',
                label: 'Quantity',
                options: {
                    filter: true,
                    display: false,
                    customBodyRenderLite: (dataIndex) => {
                        let pack_qty = this.state.selected_item_data.pack_quantity;
                        let allWarehousesForEdit = this.state.allWarehousesForEdit;
                        ;
                        if (allWarehousesForEdit[dataIndex].no_of_pack) {
                            let data = parseFloat(allWarehousesForEdit[dataIndex].no_of_pack) * parseFloat(pack_qty)
                            return <p>{data}</p>
                        } else {
                            return <p>0</p>
                        }

                    },
                },
            },
            {
                name: 'total_volume',
                label: 'Package Volume',
                options: {
                    filter: true,
                    display: false,
                    customBodyRenderLite: (dataIndex) => {
                        let pack_volume = this.state.selected_item_data.pack_volume;
                        let allWarehousesForEdit = this.state.allWarehousesForEdit;
                        ;
                        if (allWarehousesForEdit[dataIndex].no_of_pack) {
                            let data = (parseFloat(allWarehousesForEdit[dataIndex].no_of_pack) * parseFloat(pack_volume)).toFixed(5)
                            return <p>{data}</p>
                        } else {
                            return <p>0</p>
                        }

                    },
                },
            },

            {
                name: 'no_of_pack',
                label: 'No of Pack',
                options: {
                    filter: true,
                    display: false,
                    customBodyRenderLite: (dataIndex) => {
                        return (
                            <ValidatorForm>
                                <TextValidator
                                    className=" w-full"
                                    placeholder="No of Pack"
                                    name="no_of_pack"
                                    disabled={true}
                                    InputLabelProps={{ shrink: false }}
                                    value={
                                        this.state.allWarehousesForEdit[dataIndex].no_of_pack
                                    }
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    /*    onFocus={() => {
                                         
                                           let allWarehouses = this.state.allWarehouses;
                                           allWarehouses[dataIndex].selected = !allWarehouses[dataIndex].selected;
                                           this.setState({ allWarehouses })
                                           console.log("okk",allWarehouses[dataIndex].selected)
                                       }
   
                                       } */
                                    /*  onBlur={(e) => {
                                         if (e.target.value == 0 || e.target.value == null) {
                                             let allWarehouses = this.state.allWarehouses;
                                             allWarehouses[dataIndex].selected = false;
                                             this.setState({ allWarehouses })
                                         }
                                     }} */
                                    onChange={(e) => {
                                        let allWarehousesForEdit = this.state.allWarehousesForEdit;
                                        allWarehousesForEdit[dataIndex].no_of_pack = e.target.value;
                                        let pack_qty = this.state.selected_item_data.pack_quantity;

                                        if (allWarehousesForEdit[dataIndex].no_of_pack) {
                                            let data = parseFloat(allWarehousesForEdit[dataIndex].no_of_pack) * parseFloat(pack_qty)
                                            allWarehousesForEdit[dataIndex].quantity = data
                                        }


                                        let volume = (this.state.selected_item_data.pack_volume * e.target.value).toFixed(5);

                                        let totalValume = 0;
                                        this.state.allWarehousesForEdit[dataIndex].WarehousesBins.forEach(element => {
                                            totalValume = totalValume + parseFloat(element.volume);
                                        });


                                        let warehouseID = this.state.allWarehousesForEdit[dataIndex].id
                                        let capacity = [];
                                        capacity = this.state.allCapacityData.filter((item) => item.warehouse_id == warehouseID)
                                        console.log("totoal", capacity)
                                        if (capacity.length > 0) {
                                            let data = parseFloat(totalValume) - parseFloat(capacity[0].allocations)
                                            if (volume > data) {
                                                this.setState({
                                                    alert: true,
                                                    message: 'Not Enough Space',
                                                    severity: 'error',
                                                })
                                            }
                                        } else {

                                        }

                                        /* if (e.target.value == 0 || e.target.value == null) {
                                            allWarehouses[dataIndex].selected = false;
                                        }else{
                                            allWarehouses[dataIndex].selected = true;
                                        } */



                                        this.setState({ allWarehousesForEdit })
                                    }}
                                    validators={['maxNumber:' + this.state.selected_item_data.no_of_pack]}
                                    errorMessages={[
                                        'Cannot Add More than Pack Size',
                                    ]}
                                />
                            </ValidatorForm>
                        )
                    },
                },
            },

            ],
            editwarehouseForm: {

            },
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
                                        let id = this.state.itemData[dataIndex]?.item_schedule?.Order_item?.item?.id
                                        let item_id = this.state.itemData[dataIndex]?.id

                                        let formData = this.state.formData;
                                        formData.sr_no = this.state.itemData[dataIndex]?.item_schedule?.Order_item?.item?.sr_no
                                        formData.description = this.state.itemData[dataIndex]?.item_schedule?.Order_item?.item?.name

                                        let data = this.state.itemData[dataIndex]
                                        let volume = parseFloat(data.width) * parseFloat(data.height) * parseFloat(data.depth) / 1000000;

                                        formData.volume = volume;

                                        let selected_item_data = this.state.selected_item_data;

                                        selected_item_data.quantity = data.quantity;



                                        let qty = 0;
                                        this.state.itemData[dataIndex].Batch.forEach(element => {
                                            qty = qty + parseFloat(element.no_of_pack);
                                        });



                                        selected_item_data.volume = volume * qty;
                                        selected_item_data.no_of_pack = qty;

                                        selected_item_data.pack_volume = parseFloat(volume);
                                        selected_item_data.pack_quantity = parseFloat(this.state.itemData[dataIndex].quantity) / qty;

                                        let selected_item_status = this.state.itemData[dataIndex]?.status;

                                        this.setState({ formData, selected_item_data, itemSelected: true, selected_item_status })
                                        this.loadWarehouseData(item_id, id)
                                        this.loadAllocatedItems(item_id)
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
                    label: 'Item Name',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex].item_schedule.Order_item.item.name
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'Specification',
                    label: 'Specification',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex].item_schedule.Order_item.item.specification
                            return <p>{data}</p>
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
                            let data = this.state.itemData[dataIndex].quantity
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'dimensions',
                    label: 'Pack Dimensions',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex]
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
                    name: 'Number of Pack',
                    label: 'Number of Pack',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex].item_schedule
                            //let qty = this.state.itemData[dataIndex].item_schedule.quantity;
                            let qty = 0;
                            this.state.itemData[dataIndex].Batch.forEach(element => {
                                qty = qty + parseFloat(element.no_of_pack);
                            });
                            if (qty === "" || qty === null || isNaN(qty)) {
                                return <p>{0} </p>
                            }

                            else {
                                return <p>{roundDecimal(qty, 2)} </p>
                            }



                        },
                    },
                },
                {
                    name: 'Volume',
                    label: 'Total Volume(CBM)',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.itemData[dataIndex]
                            //let qty = this.state.itemData[dataIndex].item_schedule.quantity;
                            let qty = 0;
                            this.state.itemData[dataIndex].Batch.forEach(element => {
                                qty = qty + parseFloat(element.no_of_pack);
                            });
                            let volume = parseFloat(data.width) * parseFloat(data.height) * parseFloat(data.depth) * parseFloat(qty) / 1000000
                            if (volume === "" || volume === null || isNaN(volume)) {
                                return <p>{0} </p>
                            }

                            else {
                                return <p>{roundDecimal(volume, 2)} </p>
                            }


                        },
                    },
                },

                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        filter: true,
                        display: true,

                    },
                },
            ],


            allWarehouses: [],
            allCapacityData: [],
            allCapacityColumns: [{
                name: 'Action', // field name in the row object
                label: 'Action', // column title that will be shown in table
                options: {
                    filter: true,
                    display: true,
                    customBodyRenderLite: (dataIndex) => {
                        return (
                            <Grid>
                                <FormControlLabel
                                    //label={field.placeholder}
                                    //name={field.}
                                    //value={val.value}
                                    //checked={this.state.allWarehouses[dataIndex].selected}
                                    onChange={() => {
                                        let allWarehouses = this.state.allWarehouses;
                                        allWarehouses[dataIndex].selected = !allWarehouses[dataIndex].selected;
                                        this.setState({ allWarehouses })
                                    }}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            defaultChecked={this.state.allWarehouses[dataIndex].selected}
                                            size="small"
                                        />
                                    }
                                    display="inline"

                                />


                            </Grid>
                        );
                    },
                },
            },
            {
                name: 'name', // field name in the row object
                label: 'Store Name', // column title that will be shown in table
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
                    customBodyRenderLite: (dataIndex) => {
                        let totalValume = 0;
                        this.state.allWarehouses[dataIndex].WarehousesBins.forEach(element => {
                            totalValume = totalValume + parseFloat(element.volume);

                        });
                        return (
                            <p>
                                {isNaN(totalValume) ? 0 : totalValume}
                            </p>
                        )
                    }
                },
            },
            {
                name: 'Total Available Space',
                label: 'Total Available Space',
                options: {
                    filter: true,
                    display: true,
                    customBodyRenderLite: (dataIndex) => {
                        let totalValume = 0;

                        this.state.allWarehouses[dataIndex].WarehousesBins.forEach(element => {
                            totalValume = totalValume + parseFloat(element.volume);
                        });


                        let warehouseID = this.state.allWarehouses[dataIndex].id
                        let capacity = [];
                        capacity = this.state.allCapacityData.filter((item) => item.warehouse_id == warehouseID)
                        console.log("totoal", capacity)
                        if (capacity.length > 0) {
                            let data = parseFloat(totalValume) - parseFloat(capacity[0]?.allocations)
                            return <p>{isNaN(data) ? 0 : data}</p>
                        } else {
                            let data = parseFloat(totalValume)
                            return <p>{isNaN(data) ? 0 : data}</p>
                        }

                    },
                },
            },
            {
                name: 'quantity',
                label: 'Quantity',
                options: {
                    filter: true,
                    display: true,
                    customBodyRenderLite: (dataIndex) => {
                        let pack_qty = this.state.selected_item_data.pack_quantity;
                        let allWarehouses = this.state.allWarehouses;
                        ;
                        if (allWarehouses[dataIndex].no_of_pack) {
                            let data = parseFloat(allWarehouses[dataIndex].no_of_pack) * parseFloat(pack_qty)
                            return <p>{data}</p>
                        } else {
                            return <p>0</p>
                        }

                    },
                },
            },
            {
                name: 'total_volume',
                label: 'Package Volume',
                options: {
                    filter: true,
                    display: true,
                    customBodyRenderLite: (dataIndex) => {
                        let pack_volume = this.state.selected_item_data.pack_volume;
                        let allWarehouses = this.state.allWarehouses;
                        ;
                        if (allWarehouses[dataIndex].no_of_pack) {
                            let data = (parseFloat(allWarehouses[dataIndex].no_of_pack) * parseFloat(pack_volume)).toFixed(5)
                            return <p>{data}</p>
                        } else {
                            return <p>0</p>
                        }

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
                        return (
                            <ValidatorForm>
                                <TextValidator
                                    className=" w-full"
                                    placeholder="No of Pack"
                                    name="no_of_pack"
                                    disabled={this.state.allWarehouses[dataIndex].selected != true}
                                    InputLabelProps={{ shrink: false }}
                                    value={
                                        this.state.allWarehouses[dataIndex].no_of_pack ? this.state.allWarehouses[dataIndex].no_of_pack : null
                                    }
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    /*    onFocus={() => {
                                         
                                           let allWarehouses = this.state.allWarehouses;
                                           allWarehouses[dataIndex].selected = !allWarehouses[dataIndex].selected;
                                           this.setState({ allWarehouses })
                                           console.log("okk",allWarehouses[dataIndex].selected)
                                       }
   
                                       } */
                                    /*  onBlur={(e) => {
                                         if (e.target.value == 0 || e.target.value == null) {
                                             let allWarehouses = this.state.allWarehouses;
                                             allWarehouses[dataIndex].selected = false;
                                             this.setState({ allWarehouses })
                                         }
                                     }} */
                                    onChange={(e) => {
                                        let allWarehouses = this.state.allWarehouses;
                                        allWarehouses[dataIndex].no_of_pack = e.target.value;
                                        let pack_qty = this.state.selected_item_data.pack_quantity;

                                        if (allWarehouses[dataIndex].no_of_pack) {
                                            let data = parseFloat(allWarehouses[dataIndex].no_of_pack) * parseFloat(pack_qty)
                                            allWarehouses[dataIndex].quantity = data
                                        }


                                        let volume = (this.state.selected_item_data.pack_volume * e.target.value).toFixed(5);

                                        let totalValume = 0;
                                        this.state.allWarehouses[dataIndex].WarehousesBins.forEach(element => {
                                            totalValume = totalValume + parseFloat(element.volume);
                                        });


                                        let warehouseID = this.state.allWarehouses[dataIndex].id
                                        let capacity = [];
                                        capacity = this.state.allCapacityData.filter((item) => item.warehouse_id == warehouseID)
                                        console.log("totoal", capacity)
                                        if (capacity.length > 0) {
                                            let data = parseFloat(totalValume) - parseFloat(capacity[0].allocations)
                                            if (volume > data) {
                                                this.setState({
                                                    alert: true,
                                                    message: 'Not Enough Space',
                                                    severity: 'error',
                                                })
                                            }
                                        } else {

                                        }

                                        /* if (e.target.value == 0 || e.target.value == null) {
                                            allWarehouses[dataIndex].selected = false;
                                        }else{
                                            allWarehouses[dataIndex].selected = true;
                                        } */



                                        this.setState({ allWarehouses })
                                    }}
                                    validators={['maxNumber:' + this.state.selected_item_data.no_of_pack]}
                                    errorMessages={[
                                        'Cannot Add More than Pack Size',
                                    ]}
                                />
                            </ValidatorForm>
                        )
                    },
                },
            },

            ],
            allCapacityLoaded: false,
            seleceted_item_allocation_row: null,


            allocated_items: null,
            allocated_items_loaded: false,

            allocated_items_columns: [

                {
                    name: 'SR Number', // field name in the row object
                    label: 'SR Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.allocated_items[dataIndex].ConsignmentItem?.item_schedule?.Order_item?.item?.sr_no
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'SR Description',
                    label: 'Item Name',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.allocated_items[dataIndex].ConsignmentItem?.item_schedule?.Order_item?.item?.name
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'quantity',
                    label: 'Quantity',
                    options: {
                        filter: true,
                        display: true,

                    },
                },
                {
                    name: 'no_of_pack',
                    label: 'No of Pack',
                    options: {
                        filter: true,
                        display: true,

                    },
                },
                {
                    name: 'ad_remark',
                    label: 'AD Remark',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.allocated_items[dataIndex].ConsignmentItem?.ad_remark
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'msa_status',
                    label: 'MSA Status',
                    options: {
                        filter: true,
                        display: true,

                    },
                },
                {
                    name: 'msa_remark',
                    label: 'MSA Remark',
                    options: {
                        filter: true,
                        display: true,

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
                    name: 'Warehouse',
                    label: 'Warehouse',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.allocated_items[dataIndex].Warehouse?.name
                            return <Grid container>
                                <Grid item><p>{data}</p></Grid>
                                <Grid className='mt-2' item >
                                    <Tooltip title="Edit">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                this.loadAllSpacesForEdit()
                                                this.setState({ editWarehousePopup: true, seleceted_item_allocation_row: this.state.allocated_items[dataIndex] })
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>



                        },
                    },
                },


                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        filter: true,
                        display: true,

                    },
                },
            ],
            consignmentStatus: null,

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
                consignmentStatus: res.data.view.status,
                loaded: true
            })
        }
    }

    async loadWarehoureDataSecond(wr_id) {
        let res = await WarehouseServices.getWarehoureById(wr_id)
        console.log("warehouse by id", res.data.view)
        let warehouseSpaceData = this.state.warehouseSpaceData;


        warehouseSpaceData.totalSpace = 0;
        if (200 == res.status) {


            res.data.view.WarehousesBins.forEach(element => {

                let warehouseSpaceData = this.state.warehouseSpaceData;
                warehouseSpaceData.totalSpace = warehouseSpaceData.totalSpace + parseFloat(element.volume);
                this.setState({ warehouseSpaceData }, () => {

                })
            });

            this.loadWarehouseSpaces(wr_id)
            this.setState({
                warehouseData: res.data.view
                //loaded: true
            })
        }
    }

    async loadWarehouseData(item_id, id) {

        // this.setState({ loaded: false })
        let params = {};
        let formData = this.state.formData;
        formData.item_id = item_id;

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
        }
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
            } else {
                warehouseSpaceData.availableSpace = warehouseSpaceData.totalSpace
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
        //let params = { limit: 9999 };
        let params = {};

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




    async loadAllSpacesForEdit() {
        let params = { load_type: 'warehouse_sum' };

        let res = await WarehouseServices.getWarehoure(params)
        console.log("all capacity data", res.data.view.data)
        if (200 == res.status) {
            this.setState({
                allCapacityData: res.data.view.data,

                //loaded: true
            }, () => {
                this.loadAllWarehouseForEdit();
            })
        }

    }

    async loadAllWarehouseForEdit() {
        //let params = { limit: 9999 };
        let params = {};

        let res = await WarehouseServices.getWarehoure(params)
        console.log("all warehouses", res.data.view.data)
        if (200 == res.status) {
            this.setState({
                allWarehousesForEdit: res.data.view.data,
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
            console.log("selected data", this.state.selected_item_data)
            warehouse_details.push({
                "warehouse_id": this.state.warehouseData.id,
                "quantity": this.state.selected_item_data.quantity,
                "volume": this.state.selected_item_data.volume,
                "no_of_pack": this.state.selected_item_data.no_of_pack,

            })
        } else {
            allWarehouses.forEach(element => {
                if (element.selected) {
                    console.log("selected data2", element)
                    warehouse_details.push({
                        "warehouse_id": element.id,
                        "quantity": element.quantity,
                        "volume": parseFloat(this.state.selected_item_data.pack_volume) * parseFloat(element.no_of_pack),
                        "no_of_pack": element.no_of_pack
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
            }, () => {
                window.location.reload()
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
            }, () => {
                window.location.reload()
            })
        } else {
            this.setState({
                alert: true,
                message: 'Space Allocation Reject Unsuccessful',
                severity: 'error',
            })
        }
    }


    async loadAllocatedItems(id) {
        let params = { item_id: id }
        console.log("allocated Items id", id)
        this.setState({
            allocated_items_loaded: false
        })
        let res = await WarehouseServices.getwarehoureItemAllocation(params);
        //Need To add table
        console.log("allocated Items", res.data.view.data)
        this.setState({
            allocated_items: res.data.view.data,
            allocated_items_loaded: true
        })
    }

    async conformByAd() {
        let id = this.props.match.params.id;

        let newstatus = {
            "status": "Confirmed By AD"
        }
        let res = await ConsignmentService.editStatusConsignmentById(id, newstatus)
        if (res.status === 200) {
            this.setState({
                alert: true,
                severity: 'success',
                message: "Successfully Saved ",
            },
                () => {
                    // window.location.reload()
                    window.history.back()
                })
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Cannot Save ",
            })
        }
    }


    async submitEditWarehouse(){
        let editSelectedData=this.state.editSelectedData
        console.log("changed warehouse",editSelectedData)
        console.log("selected warehouse",this.state.seleceted_item_allocation_row)
        let formData={
            warehouse_id:editSelectedData.warehouse_id
        }
        
        let res = await WarehouseServices.editWarehoureItemAllocation(formData, this.state.seleceted_item_allocation_row.id);
            if (res.status == 200) {
                this.setState({
                    alert: true,
                    severity: 'success',
                    message: 'Warehouse changed Successfull',
                }, () => {
                    //window.history.back()
                    this.setState({ allocated_items_loaded: false,editWarehousePopup:false})
                })
            } else {
                this.setState({
                    alert: true,
                    severity: 'error',
                    message: 'Unsuccessfull',
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
                                        pagination: false,
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

                                {this.state.itemSelected && this.state.selected_item_status == 'Active' ?
                                    <div className='mt-6'>
                                        <Grid container>
                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                <Grid container>
                                                    <Grid item>
                                                        <SubTitle title="SR Number :" />
                                                    </Grid>
                                                    <Grid className="ml-2 mt-1" item>
                                                        {this.state.formData.sr_no}
                                                    </Grid>
                                                </Grid>

                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                <Grid container>
                                                    <Grid item>
                                                        <SubTitle title="SR Name :" />
                                                    </Grid>
                                                    <Grid className="ml-2 mt-1" item>
                                                        {this.state.formData.description}
                                                    </Grid>
                                                </Grid>

                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                <Grid container>
                                                    <Grid item>
                                                        <SubTitle title="Store Name :" />
                                                    </Grid>
                                                    <Grid className="ml-2 mt-1" item>
                                                        {this.state.warehouseData.name}
                                                    </Grid>
                                                </Grid>

                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                <Grid container>
                                                    <Grid item>
                                                        <SubTitle title="Total Space(Cum) :" />
                                                    </Grid>
                                                    <Grid className="ml-2 mt-1" item>
                                                        {this.state.warehouseSpaceData.totalSpace}
                                                    </Grid>
                                                </Grid>

                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                                <Grid container>
                                                    <Grid item>
                                                        <SubTitle title="Total Available Space :" />
                                                    </Grid>
                                                    <Grid className="ml-2 mt-1" item>
                                                        {this.state.warehouseSpaceData.availableSpace}
                                                    </Grid>
                                                </Grid>

                                            </Grid>




                                        </Grid>

                                        <Grid item className="mt-5">
                                            <Button
                                                className="p-2 min-w-32"
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => { this.loadAllSpaces() }}
                                            >
                                                View All Capacity
                                            </Button>

                                            <Grid className="mt-5" style={{ backgroundColor: '#e1ecf5' }}>
                                                {this.state.allCapacityLoaded ? (

                                                    <LoonsTable
                                                        //title={"All Aptitute Tests"}
                                                        id={'allWarehouses'}
                                                        data={this.state.allWarehouses}
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



                                        <ValidatorForm onSubmit={() => { this.submit() }}>
                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
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
                                        </ValidatorForm>
                                    </div>
                                    :
                                    <div>
                                        {this.state.allocated_items_loaded ?
                                            <div>
                                                <LoonsTable
                                                    title="Allocated Details"
                                                    id={'allRegisteredStudents'}
                                                    data={this.state.allocated_items}
                                                    columns={this.state.allocated_items_columns}

                                                    options={{
                                                        pagination: false,
                                                        serverSide: true,
                                                        //rowsSelected: this.state.all_selected_rows,
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

                                                    }}
                                                ></LoonsTable>

                                            </div>
                                            : null}
                                    </div>


                                }


                                <Button
                                    className="p-2 mt-10"
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    disabled={this.state.itemData.filter(x => x.status != "AD Allocation Approved").length > 0}
                                    //type="submit"
                                    onClick={() => { this.conformByAd() }}
                                >
                                    {this.state.consignmentStatus == "Confirmed By AD" ? "Confirmed" : "Confirm"}
                                </Button>


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



                <Dialog fullWidth={true} maxWidth="md" open={this.state.editWarehousePopup} onClose={() => { this.setState({ editWarehousePopup: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Edit Warehouse" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    editWarehousePopup: false

                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>

                        <Grid container>

                            <LoonsTable
                                //title={"All Aptitute Tests"}
                                id={'allWarehousesEdit'}
                                data={this.state.allWarehousesForEdit}
                                columns={this.state.allCapacityColumnsForEdit}

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

                            <Button className="mt-5" onClick={() => { this.submitEditWarehouse() }}>
                               Edit Warehouse
                            </Button>
                        </Grid>


                    </MainContainer>
                </Dialog>




            </Fragment >
        )
    }
}

export default withStyles(styleSheet)(CheckStoreSpace)
