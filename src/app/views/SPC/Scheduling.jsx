import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Card,
    Icon,
    IconButton,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    Fab,
    Tooltip,
    Typography,
    Divider,
    Link,
    InputAdornment
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import 'date-fns'
import VisibilityIcon from '@material-ui/icons/Visibility'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { themeColors } from 'app/components/MatxTheme/themeColors'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
    LoonsTable,
    DatePicker,
    FilePicker,
    Button,
    ExcelToTable,
    LoonsSnackbar,
    LoonsSwitch,
    MainContainer,
    LoonsDialogBox,
    LoonsCard,
    CardTitle,
    SubTitle
} from 'app/components/LoonsLabComponents'
import * as appconst from '../../../appconst'

import ConsignmentService from 'app/services/ConsignmentService'
import VehicleService from 'app/services/VehicleService'
import EmployeeServices from 'app/services/EmployeeServices'
import HospitalConfigServices from 'app/services/HospitalConfigServices'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import localStorageService from 'app/services/localStorageService'
import PrescriptionService from 'app/services/PrescriptionService'


import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

import { dateParse } from 'utils'
import SchedulesServices from 'app/services/SchedulesServices'

const styleSheet = (theme) => ({})

class Scheduling extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,

            //snackbar
            message: "Order Placed Successful",
            severity: 'success',
            alert: false,
            allVehicleTypes: [],
            all_containers: [],
            all_employee: [],

            currentPage: 0,
            totalItems: 0,
            totalPages: 0,
            filterData: {
                limit: 20,
                page: 0,
                order_no: null,
                'order[0]': ['updatedAt', 'DESC'],


            },
            collapseButton: 0,
            formData: {
                "order_no": null,
                "agent_id": null,
                supplier_id: null,
                manufacture_id: null,
                "order_date": null,
                "status": "Active",
                "type": "Normal Order",
                "created_by": null,
                "order_date_to": null,
                "no_of_items": null,
                "estimated_value": null,
                "order_for_year": null,
                vat: null,
                "order_items": []
            },

            //approve - reject bulk
            all_selected_rows: [],

            debit_note_types: [],
            debit_note_sub_types: [],
            all_Suppliers: [],
            all_manufacture: [],

            orderListNo: null,
            data: [],
            selectedData: [],
            columns: [
                {
                    name: 'Select', // field name in the row object
                    label: 'Select', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            let isadded = this.state.selectedData.filter((item) => item.id == this.state.data[dataIndex].id)
                            let difference = Number(this.state.data[dataIndex].quantity) - Number(this.state.data[dataIndex].allocated_quantity)
                            // console.log('cheking disable wty', difference)
                            let setDisable = true 
                            if (difference > 0) {
                                setDisable = false 
                            }
                            return <Grid>
                                <Checkbox
                                    defaultChecked={isadded.length == 1 ? true : false}
                                    checked={isadded.length == 1 ? true : false}
                                    onChange={() => {
                                        this.selectRow(this.state.data[dataIndex], dataIndex)

                                    }}
                                    disabled={setDisable}
                                    name="chkbox_confirm"
                                    color="primary"
                                />

                                {/*  <Button
                                    component="button"
                                    variant="body2"
                                    style={{ color: this.state.data[dataIndex].selected ? 'green' : 'red' }}
                                    onClick={() => {
                                        this.selectRow(this.state.data[dataIndex], dataIndex)
                                    }}
                                >
                                    {this.state.data[dataIndex].selected ? "SELECTED" : "CLICK TO SELECT"}
                                </Button> */}


                            </Grid>
                        },
                    },
                },
                /* {
                    name: 'Action', 
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            return <Link
                                 variant="body2"
                                onClick={() => {
                                    window.open(`/spc/consignment/addDetails/${this.state.data[dataIndex].id}`, '_blank');
                                    }}
                            >
                                Add Details
                            </Link>
                        },
                    },
                }, */
                {
                    name: 'SR Number', // field name in the row object
                    label: 'SR Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.OrderListItem?.ItemSnap?.sr_no
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
                            let data = this.state.data[dataIndex]?.OrderListItem?.ItemSnap?.medium_description
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
                            //let data = this.state.data[dataIndex].OrderListItem.ItemSnap.short_description
                            return <p></p>
                        },
                    },
                },
                {
                    name: 'Priority',
                    label: 'Priority',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            // let data = this.state.data[dataIndex].OrderListItem.ItemSnap.short_description
                            return <p></p>
                        },
                    },
                },
                {
                    name: 'Packing',
                    label: 'Packing',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            // let data = this.state.data[dataIndex].OrderListItem.ItemSnap.short_description
                            return <p></p>
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
                    name: 'Unit Price',
                    label: 'Unit Price',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            // let data = this.state.data[dataIndex].OrderListItem.ItemSnap.short_description
                            return <p></p>
                        },
                    },
                },
                {
                    name: 'Schedule Date',
                    label: 'Schedule Date',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.schedule_date
                            return <p>{dateParse(data)}</p>
                        },
                    },
                },
                {
                    name: 'Order Qunatity',
                    label: 'Order Qunatity',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].quantity
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'Allocated Qunatity',
                    label: 'Allocated Qunatity',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].allocated_quantity
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'Order Value',
                    label: 'Order Qty',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            // let data = this.state.data[dataIndex].quantity
                            // this.state.data[dataIndex].qty = this.state.data[dataIndex].quantity
                            //let data = this.state.data[dataIndex].qty
                            // return <p>{data}</p>
                            let isadded = this.state.selectedData.filter((item) => item.id == this.state.data[dataIndex].id)
                            return <ValidatorForm>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Order Qty"
                                    //variant="outlined"
                                    disabled={isadded.length == 1 ? false : true}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state.selectedData[this.state.selectedData.indexOf(isadded[0])]?.qty

                                    }
                                    onChange={(e, value) => {
                                        let selectedData = this.state.selectedData;
                                        selectedData[selectedData.indexOf(isadded[0])].qty = e.target.value
                                        this.setState({ selectedData })

                                    }}

                                    validators={[
                                        'required', 'minNumber: 00', 'maxNumber:' + parseInt(this.state.data[dataIndex].quantity - this.state.data[dataIndex].allocated_quantity) + ''
                                    ]}
                                    errorMessages={[
                                        'this field is required', 'Quantity Should Greater-than: 0 ', 'Over Quantity'
                                    ]}
                                />
                            </ValidatorForm>
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
                            let data = this.state.data[dataIndex].status
                            return <p>{data}</p>
                        },
                    },
                },
            ],

        }
    }

    //navigate to student profile



    // Setting up Filter Data
    async setFilterData(key, val) {
        //Set state filter data with user entered

        let filterData = this.state.filterData
        filterData[key] = val
        filterData.page = 0;
        this.setState({ filterData }, () => {
            console.log(this.state.filterData)
        })
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
                this.loadConsignmentList()
            }
        )
    }

    loadConsignmentList = async () => {
        this.setState({ loaded: false })
        let filterData = this.state.filterData;
        var user_info = await localStorageService.getItem('userInfo');

        if (user_info.roles.includes('SPC MA') || user_info.roles.includes('SPC MA')) {
            filterData.agent_type = "SPC"
        } else {
            filterData.agent_type = "MSD"
        }


        let res = await SchedulesServices.getScheduleOrderList(filterData)
        if (res.status == 200 && res.data.view.data.length > 0) {
            console.log("schedule res", res.data.view.data)
            this.setState({
                data: res.data.view.data,
                loaded: true,
                totalItems: res.data.view.totalItems
            })
        }

    }

    async selectRow(row, index) {
        let data = this.state.data;

        if (data[index].selected) {
            data[index].selected = false
        } else {
            data[index].selected = true
        }
        let selectedData = this.state.selectedData
        let isadded = selectedData.filter((item) => item.id == data[index].id)
        console.log("selected dataa", selectedData)
        if (isadded.length == 1) {
            let index = selectedData.indexOf(isadded[0])
            selectedData.splice(index, 1)

        } else {
            selectedData.push(data[index])
        }

        this.setState({ selectedData })


    }


    async loadEmployees() {
        let res1 = await EmployeeServices.getEmployees({ type: ["Helper", "Driver"], owner_id: '000' })
        if (res1.status) {
            console.log("emp", res1.data.view.data)
            this.setState({
                all_employee: res1.data.view.data,

            })
            console.log("employees", res1.data.view.data)
        }
    }


    async grouping() {
        console.log('grouped data selected', this.state.selectedData);
        const groupedData = [];

        this.state.selectedData.forEach(item => {
            const itemId = item.OrderListItem.item_id;

            let alradyIncluded = groupedData.filter((i) => i.item_id == itemId)

            if (alradyIncluded.length == 1) {
                let index = groupedData.indexOf(alradyIncluded[0])
                groupedData[index].quantity = Number(groupedData[index].quantity) + Number(item.qty)
                groupedData[index].order_quantity = Number(groupedData[index].order_quantity) + Number(item.quantity)
                groupedData[index].pending_quantity = Number(groupedData[index].pending_quantity) + Number(item.quantity) - Number(item.allocated_quantity)


            } else {

                groupedData.push(
                    {
                        item_id: itemId,
                        order_list_item_id: item.order_list_item_id,
                        status: "Active",
                        quantity: Number(item.qty),
                        standard_cost: item.standard_cost,
                        type: item.OrderListItem.type,
                        order_date: item.OrderListItem.order_date,
                        order_date_to: item.OrderListItem.order_date_to,
                        short_description: item.OrderListItem.ItemSnap.short_description,
                        sr_no: item.OrderListItem.ItemSnap.sr_no,
                        quantity: Number(item.qty),
                        order_quantity: Number(item.quantity),
                        pending_quantity: Number(item.quantity) - Number(item.allocated_quantity),
                        additional_condition: null,
                        schedule: [
                            {
                                schedule_date: null,
                                quantity: null,
                                allocated_quantity: null,
                                standard_cost: null
                            }
                        ]

                    }
                )
            }




        });

        let formData = this.state.formData

        formData.agent_id = this.state.selectedData[0].OrderListItem?.OrderList?.agent_id
        formData.category_id = this.state.selectedData[0].OrderListItem?.OrderList?.category_id
        formData.estimated_value = this.state.selectedData[0].OrderListItem?.OrderList?.estimated_value
        formData.order_for_year = this.state.selectedData[0].OrderListItem?.OrderList?.order_for_year
        formData.order_date = this.state.selectedData[0].OrderListItem?.order_date
        formData.order_date_to = this.state.selectedData[0].OrderListItem?.order_date_to
        formData.order_list_id = this.state.selectedData[0].OrderListItem?.order_list_id
        formData.type = this.state.selectedData[0].OrderListItem?.OrderList?.type
        formData.status = this.state.selectedData[0].OrderListItem?.OrderList?.status


        formData.order_items = groupedData
        this.setState({ formData })

        console.log('grouped data', groupedData);
    }




    async addNewSchedule(index) {
        let formData = this.state.formData
        formData.order_items[index].schedule.push(
            {
                schedule_date: null,
                quantity: null,
                allocated_quantity: null,
                standard_cost: null
            }
        )

        this.setState({ formData })
    }



    async loadAllSuppliers(search) {
        let params = { search: search }

        let res = await HospitalConfigServices.getAllSuppliers(params)
        if (res.status) {
            console.log("all Suppliers", res.data.view.data)
            this.setState({
                all_Suppliers: res.data.view.data,

            })
        }
    }

    async loadAllManufacture(search) {
        let params = { search: search }

        let res = await HospitalConfigServices.getAllManufacturers(params)
        if (res.status) {
            console.log("all Manufacturers", res.data.view.data)
            this.setState({
                all_manufacture: res.data.view.data,

            })
        }
    }

    async submitData() {

        let user_id = await localStorageService.getItem('userInfo').id

        let formData = this.state.formData;
        formData.order_no = this.state.filterData.order_no;
        formData.created_by = user_id;
        formData.no_of_items = this.state.formData.order_items.length;
        formData.order_schedule_data = this.state.selectedData

        this.setState({ formData })

        console.log("submitting data", this.state.formData)

        let res = await PrescriptionService.OrdersCreate(formData)

        if (res.status == 200 || res.status == 201) {
            this.setState({
                message: "Order Placed Successful",
                severity: 'success',
                alert: true
            })
            setTimeout(() => {
                window.location = '/purchase_order/order_list'
            }, 500);


        } else {
            this.setState({
                message: "Order Placed Unsuccessful",
                severity: 'error',
                alert: true
            })
        }

    }

    calculateTotalQty(data) {
        let sum = 0;

        // Iterate through the list of deliveries and add up the quantity
        for (let i = 0; i < data.schedule.length; i++) {
            sum += parseInt(data.schedule[i].quantity);
        }

        if (isNaN(sum)) {

        } else {
            return <Typography className=" text-gray font-semibold text-13 mt-2" style={{ lineHeight: '1', }}> Total:{sum} / {data.pending_quantity}</Typography>;
        }


    }

    async componentDidMount() {
        // this.loadAllSuppliers()
        const query = new URLSearchParams(this.props.location.search);
        const order_no = query.get('order_no')

        if (order_no) {
            console.log("order_no", order_no)

            let filterData = this.state.filterData
            filterData.order_no = order_no

            let formData = this.state.formData;
            formData.order_no = order_no;
            console.log(filterData, "filterData>>>")
            this.setState({ filterData, formData }, () => {
                this.loadConsignmentList()
            })


        }

    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        let dummy = [{ lable: "test1", value: "ads" }]

        return (

            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="New Scheduling" />
                        <div className="pt-7">


                            <Grid container spacing={2}>
                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                    <SubTitle title={"MSD Order List No"}></SubTitle>
                                    <ValidatorForm
                                        ref="form"
                                        onSubmit={this.loadConsignmentList}
                                        onError={errors => console.log(errors)}
                                    >
                                        <TextValidator
                                            className='w-full'
                                            placeholder="MSD Order List No"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .filterData.order_no || null
                                            }
                                            onChange={(e, value) => {
                                                let filterData = this.state.filterData
                                                filterData.order_no = e.target.value

                                                let formData = this.state.formData;
                                                formData.order_no = e.target.value;
                                                console.log(filterData, "filterData>>>")
                                                this.setState({ filterData, formData })

                                            }}
                                            validators={['required']}
                                            errorMessages={['this field is required']}

                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Button

                                                            progress={false}
                                                            type="submit"
                                                            scrollToTop={false}
                                                            startIcon="search"
                                                        >
                                                            <span className="capitalize">SEARCH</span>
                                                        </Button>
                                                    </InputAdornment>
                                                )
                                            }}


                                        />
                                    </ValidatorForm>



                                </Grid>


                            </Grid>




                            {this.state.loaded ? (
                                <div className="pt-10">
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allRegisteredStudents'}
                                        data={this.state.data}
                                        columns={this.state.columns}

                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            rowsSelected: this.state.all_selected_rows,
                                            // count:this.state.totalPages,
                                            count: this.state.totalItems,
                                            rowsPerPage: this.state.filterData.limit,
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
                                </div>
                            ) : (
                                <Grid className="justify-center text-center w-full pt-12">
                                    {/*  <CircularProgress size={30} /> */}
                                </Grid>
                            )}

                            {(this.state.data.filter((item) => item.selected == true && (item.qty != null)).length == this.state.data.filter((item) => item.selected == true).length && this.state.data.filter((item) => item.selected == true).length > 0) ?

                                <ValidatorForm
                                    ref="form"
                                    onSubmit={() => { this.grouping() }}
                                    onError={errors => console.log(errors)}
                                >
                                    <Grid container spacing={2}>


                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Supplier"}></SubTitle>
                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_Suppliers}
                                                getOptionLabel={(option) => option.name}
                                                value={this.state.all_Suppliers.find((v) => v.id == this.state.formData.supplier_id)}
                                                onChange={(event, value) => {
                                                    let formData = this.state.formData
                                                    if (value != null) {
                                                        formData.supplier_id = value.id
                                                    } else {
                                                        formData.supplier_id = null
                                                    }
                                                    this.setState({ formData })
                                                }

                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Supplier"
                                                        //variant="outlined"
                                                        //value={}
                                                        onChange={(e) => {
                                                            if (e.target.value.length > 2) {
                                                                this.loadAllSuppliers(e.target.value)

                                                            }
                                                        }}
                                                        value={this.state.all_Suppliers.find((v) => v.id == this.state.formData.supplier_id)}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        size="small"
                                                        validators={['required']}
                                                        errorMessages={['this field is required']}
                                                    />
                                                )}
                                            />

                                        </Grid>




                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Manufacture"}></SubTitle>
                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_manufacture}
                                                getOptionLabel={(option) => option.name}
                                                value={this.state.all_manufacture.find((v) => v.id == this.state.formData.manufacture_id)}
                                                onChange={(event, value) => {
                                                    let formData = this.state.formData
                                                    if (value != null) {
                                                        formData.manufacture_id = value.id
                                                    } else {
                                                        formData.manufacture_id = null
                                                    }
                                                    this.setState({ formData })
                                                }

                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Manufacture"
                                                        //variant="outlined"
                                                        //value={}
                                                        onChange={(e) => {
                                                            if (e.target.value.length > 2) {
                                                                this.loadAllManufacture(e.target.value)

                                                            }
                                                        }}
                                                        value={this.state.all_manufacture.find((v) => v.id == this.state.formData.manufacture_id)}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        size="small"
                                                        validators={['required']}
                                                        errorMessages={['this field is required']}
                                                    />
                                                )}
                                            />

                                        </Grid>

                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Indent No"}></SubTitle>
                                            <TextValidator
                                                className='w-full'
                                                placeholder="Indent No"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={
                                                    this.state
                                                        .formData
                                                        .indent_no
                                                }
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData;
                                                    formData.indent_no = e.target.value
                                                    this.setState({ formData })

                                                }}
                                                validators={[
                                                    'required',
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            />
                                        </Grid>



                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Currency"}></SubTitle>
                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={appconst.all_currencies}
                                                getOptionLabel={(option) => option.cc}
                                                value={appconst.all_currencies.find((value) => value.cc == this.state.formData.currency)}
                                                onChange={(event, value) => {
                                                    let formData = this.state.formData
                                                    formData.currency = value.cc

                                                    this.setState({ formData })
                                                }

                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Currency"
                                                        //variant="outlined"
                                                        value={this.state.formData.currency}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        size="small"
                                                        validators={['required']}
                                                        errorMessages={['this field is required']}
                                                    />
                                                )}
                                            />

                                        </Grid>

                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"VAT (%)"}></SubTitle>
                                            <TextValidator
                                                className='w-full'
                                                placeholder="VAT"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={
                                                    this.state
                                                        .formData
                                                        .vat
                                                }
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData;
                                                    formData.vat = e.target.value
                                                    this.setState({ formData })

                                                }}
                                                validators={[
                                                    'required',
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            />
                                        </Grid>


                                    </Grid>

                                    < Button
                                        className="mt-2 mr-2"
                                        progress={false}
                                        scrollToTop={false}
                                        //onClick={() => {  }}
                                        type="submit"

                                    >
                                        <span className="capitalize">Add Details</span>
                                    </Button>

                                </ValidatorForm>

                                : null}
                            {this.state.formData.order_items.length > 0 ?

                                < ValidatorForm
                                    ref="form"
                                    onSubmit={() => this.submitData()}
                                    onError={() => null}
                                >

                                    {this.state.formData.order_items.map((item, index) => (
                                        <Grid
                                            className="flex justify-around align-center mt-5 pb-5"
                                            style={{ backgroundColor: '#e8e8e8' }}
                                            container
                                        >
                                            <Grid item className="flex align-center" lg={11} md={11} sm={11} xs={11}>

                                                <Grid className="flex align-center px-10" item style={{ alignItems: 'center' }}>
                                                    <SubTitle title={item.short_description + " - " + item.sr_no} />
                                                    <div className='mx-5'></div>
                                                    {this.calculateTotalQty(item)}

                                                </Grid>


                                            </Grid>

                                            <Grid item className="flex align-center" lg={1} md={1} sm={1} xs={1}>
                                                <IconButton aria-label="collaps" className="mt-2" >
                                                    {this.state.collapseButton === index ?
                                                        <KeyboardArrowDownIcon onClick={() => this.setState({ collapseButton: -1 })}
                                                        /> :
                                                        <KeyboardArrowRightIcon onClick={() => this.setState({ collapseButton: index })}
                                                        />
                                                    }
                                                </IconButton>
                                            </Grid>


                                            <Collapse in={this.state.collapseButton === index} >
                                                <div>

                                                    <Grid container spacing={2}>
                                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                                            <SubTitle title={"Standard Cost"}></SubTitle>
                                                            <TextValidator
                                                                className='w-full'
                                                                placeholder="Standard Cost"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={this.state.formData.order_items[index].standard_cost}
                                                                onChange={(e, value) => {
                                                                    let formData = this.state.formData;
                                                                    formData.order_items[index].standard_cost = e.target.value
                                                                    this.setState({ formData })

                                                                }}
                                                                validators={[
                                                                    'required', 'minNumber: 00',
                                                                ]}
                                                                errorMessages={[
                                                                    'this field is required', 'Standard Cost Should Greater-than: 0 '
                                                                ]}
                                                            />
                                                        </Grid>


                                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                                            <SubTitle title={"Additional Condition"}></SubTitle>
                                                            <TextValidator
                                                                className='w-full'
                                                                placeholder="Additional Condition"
                                                                //variant="outlined"
                                                                multiline={true}
                                                                rows={4}
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={this.state.formData.order_items[index].additional_condition}
                                                                onChange={(e, value) => {
                                                                    let formData = this.state.formData;
                                                                    formData.order_items[index].additional_condition = e.target.value
                                                                    this.setState({ formData })

                                                                }}
                                                            /*  validators={[
                                                                 'required'
                                                             ]}
                                                             errorMessages={[
                                                                 'this field is required'
                                                             ]} */
                                                            />
                                                        </Grid>
                                                    </Grid>

                                                    {item.schedule.map((scheduleItem, scheduleIndex) => (
                                                        <Grid container spacing={2}>
                                                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                                                <DatePicker
                                                                    className="w-full"
                                                                    placeholder="Schedule Date"
                                                                    value={this.state.formData.order_items[index].schedule[scheduleIndex].schedule_date}
                                                                    onChange={(date) => {
                                                                        let formData = this.state.formData;
                                                                        formData.order_items[index].schedule[scheduleIndex].schedule_date = date
                                                                        formData.order_items[index].schedule[scheduleIndex].standard_cost = formData.order_items[index].standard_cost
                                                                        this.setState({ formData })
                                                                    }}
                                                                    minDate={scheduleIndex > 0 ? this.state.formData.order_items[index].schedule[scheduleIndex - 1].schedule_date : new Date()}
                                                                    required={true}
                                                                    errorMessages={'this field is required'}
                                                                />
                                                            </Grid>

                                                            <Grid item lg={5} md={5} sm={5} xs={5}>

                                                                <TextValidator
                                                                    className="w-10 "
                                                                    variant="outlined"
                                                                    placeholder="Quantity"
                                                                    size="small"
                                                                    value={this.state.formData.order_items[index].schedule[scheduleIndex].quantity}
                                                                    onChange={(e) => {
                                                                        let formData = this.state.formData;
                                                                        formData.order_items[index].schedule[scheduleIndex].quantity = e.target.value
                                                                        this.setState({ formData })

                                                                    }}
                                                                    validators={['required', 'minNumber: 00']}
                                                                    errorMessages={['this field is required', 'Quantity Should Greater-than: 0 ']}
                                                                />
                                                            </Grid>

                                                            <Grid item lg={1} md={1} sm={1} xs={1}>

                                                                {(this.state.formData.order_items[index].schedule.length - 1) == scheduleIndex ?



                                                                    <IconButton aria-label="add">
                                                                        <AddCircleOutlineIcon onClick={() => { this.addNewSchedule(index) }}
                                                                        />
                                                                    </IconButton>
                                                                    : null}
                                                            </Grid>

                                                        </Grid>

                                                    ))
                                                    }

                                                    {/*   <p>
                                                        {this.calculateTotalQty(this.state.formData.order_items[index].schedule)}
                                                    </p> */}
                                                </div>
                                            </Collapse>


                                        </Grid>
                                    ))

                                    }


                                    < Button
                                        className="mt-2 mr-2"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}


                                    >
                                        <span className="capitalize">Submit</span>
                                    </Button>
                                </ValidatorForm>
                                : null
                            }


                        </div>

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
            </Fragment >

        )
    }
}
export default withStyles(styleSheet)(Scheduling)

