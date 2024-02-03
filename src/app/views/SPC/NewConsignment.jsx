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
import localStorageService from 'app/services/localStorageService'

import LoonsDatePicker from 'app/components/LoonsLabComponents/DatePicker'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import { dateParse, includesArrayElements, roundDecimal } from 'utils'
import PrescriptionService from 'app/services/PrescriptionService'
import { authRoles } from 'app/auth/authRoles'

const styleSheet = (theme) => ({})

class NewConsignment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            userRoles: [],
            submittingProcess: false,
            //snackbar
            snackbar: false,
            snackbar_message: '',
            snackbar_severity: 'success',
            allVehicleTypes: [],
            all_containers: [],
            all_employee: [],
            disableSubmit : true,

            id: null,
            lp_data: {},

            currentPage: 0,
            totalItems: 0,
            totalPages: 0,
            filterData: {
                limit: 20,
                page: 0,
                po_no: null,
                'order[0]': ['updatedAt', 'DESC'],
            },

            formData: {
                order_no: null,
                wharf_ref_no: null,
                wdn_no: null,
                ldcn_ref_no: null,
                indent_no: null,
                hs_code: null,
                invoice_no: null,
                invoice_date: null,
                pa_no: null,
                delivery_type: null,
                delivery_person_id: null,
                delivery_date: null,
                containers: [],
                items: [],

                wdn_date: null,
                debit_note_sub_type_id: null,
                vessel_no: null,
                supplier_id: null,
                currency: null,
                exchange_rate: null,
                values_in_currency: null,
                values_in_lkr: null,

                debit_note_type: null,
                debit_note_sub_type: null,
                supplier_name: null,
                supplier_address: null

            },

            //approve - reject bulk
            all_selected_rows: [],

            debit_note_types: [],
            debit_note_sub_types: [],
            all_Suppliers: [],

            orderListNo: null,

            selectedDataForm: [],

            data: [],
            columns: [
                {
                    name: 'Select', // field name in the row object
                    label: 'Select', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let difference = Number(this.state.data[dataIndex]?.quantity) - Number(this.state.data[dataIndex]?.allocated_quantity)

                            let setDisable = true 
                            if (difference > 0) {
                                setDisable = false 
                            }

                            return <Grid>
                                <Checkbox
                                    // defaultChecked={this.state.data[dataIndex].selected}
                                    //checked={this.state.data[dataIndex].selected}

                                    disabled={this.state.data[dataIndex].status=='REJECTED'?true:false || setDisable}
                                    checked={this.state.selectedDataForm.findIndex((x) => x.id == this.state.data[dataIndex].id) != -1}
                                    defaultChecked={this.state.selectedDataForm.findIndex((x) => x.id == this.state.data[dataIndex].id) != -1}

                                    onChange={() => {
                                        this.selectRow(this.state.data[dataIndex], dataIndex)
                                    }}
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
                            let data = this.state.data[dataIndex]?.Order_item.item?.sr_no
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
                            let data = this.state.data[dataIndex]?.Order_item?.item?.medium_description
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
                            //let data = this.state.data[dataIndex].Order_item.item.short_description
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
                            // let data = this.state.data[dataIndex].Order_item.item.short_description
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
                            // let data = this.state.data[dataIndex].Order_item.item.short_description
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
                            // let data = this.state.data[dataIndex].Order_item.item.short_description
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
                            let data = this.state.data[dataIndex]?.quantity
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'Pending Qunatity',
                    label: 'Pending Qunatity',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.quantity - this.state.data[dataIndex]?.allocated_quantity
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'Order Value',
                    label: 'Consingment Qty',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            // let data = this.state.data[dataIndex].quantity
                            // this.state.data[dataIndex].qty = this.state.data[dataIndex].quantity
                            //let data = this.state.data[dataIndex].qty
                            // return <p>{data}</p>
                            return <ValidatorForm>
                                <TextValidator
                                    className='w-full'
                                    placeholder={!(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) ? "Consingment Qty" : "Recieving Qty"}
                                    //variant="outlined"
                                    fullWidth
                                    //disabled={!this.state.data[dataIndex].selected}
                                    disabled={this.state.selectedDataForm.findIndex((x) => x.id == this.state.data[dataIndex].id) == -1}
                                    variant="outlined"
                                    size="small"
                                    type='number'
                                    min={0}
                                    /* value={
                                        this.state.data[dataIndex].qty
                                    } */
                                    value={this.state.selectedDataForm.find((x) => x.id == this.state.data[dataIndex].id)?.qty}
                                    /* onChange={(e, value) => {
                                        let data = this.state.data;
                                        data[dataIndex].qty = e.target.value
                                        this.setState({ data })

                                    }} */

                                    onChange={(e, value) => {

                                        let pending_qty = Number(this.state.data[dataIndex]?.quantity) - Number(this.state.data[dataIndex]?.allocated_quantity)

                                        if (e.target.value > pending_qty) {
                                            this.setState({
                                                disableSubmit : false 
                                            })
                                        } else {
                                            this.setState({
                                                disableSubmit : true 
                                            })
                                        }

                                        let selectedDataForm = this.state.selectedDataForm;
                                        let index = this.state.selectedDataForm.findIndex((x) => x.id == this.state.data[dataIndex].id)
                                        selectedDataForm[index].qty = e.target.value
                                        this.setState({ selectedDataForm })

                                    }}

                                    validators={[
                                        'required', 'maxNumber:' + parseInt(this.state.data[dataIndex].quantity) + ''
                                    ]}
                                    errorMessages={[
                                        'this field is required', 'Over Quantity'
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
        let owner_id = await localStorageService.getItem('owner_id')
        let filterData = this.state.filterData;
        filterData.owner_id=owner_id
        console.log('chekig ijnner qty', filterData)
        let res = await ConsignmentService.getConsignmentOrderList(filterData)
        console.log("chekig ijnner data for grn", res.data.view.data)
        if (res.status == 200 && res.data.view.data.length > 0) {
            

            let formData = this.state.formData;
            formData.order_no = res.data.view.data[0]?.Order_item?.purchase_order?.order_no;
            formData.currency = res.data.view.data[0]?.Order_item?.purchase_order?.currency;
            formData.indent_no = res.data.view.data[0]?.Order_item?.purchase_order?.indent_no;
            if (res.data.view.data[0]?.Order_item?.purchase_order?.currency == 'LKR') {
                formData.exchange_rate = 1
            }
            formData.currency = res.data.view.data[0]?.Order_item?.purchase_order?.currency;
            // console.log('chekig ijnner data for grn', filterData)
            this.setState({
                data: res.data.view.data,
                totalItems: res.data.view.totalItems,
                formData: formData,
                loaded: true
            })
        }

        if (includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) {//changed by roshan 
            this.loadLPData()
        }
    }

    loadLPData = async () => {
        let id = this.state.id
        let owner_id = await localStorageService.getItem('owner_id')
        let user = await localStorageService.getItem('userInfo')
        let res = await PrescriptionService.NP_Orders_By_Id({ limit: 1 }, id)
        if (res.status === 200) {
            console.log("LP Data :", res.data.view)
            this.setState({ lp_data: res.data.view }, () => {
                let formData = this.state.formData
                formData.currency = "LKR"
                formData.type = 'LP'
                formData.owner_id = owner_id
                formData.debit_note_type = 'Local'
                formData.delivery_person_id = user.id ? user.id : null
                formData.values_in_lkr = this.state.lp_data?.estimated_value ? this.state.lp_data?.estimated_value : 0
                formData.indent_no = this.state.lp_data?.indent_no ? this.state.lp_data?.indent_no : null

                this.setState({ formData })
            })
        }
    }

    async selectRow(row, index) {
        let data = this.state.data;


        let selectedDataForm = this.state.selectedDataForm;
        let addedIndex = selectedDataForm.findIndex((x) => x.id == data[index].id)

        if (addedIndex == -1) {
            selectedDataForm.push(data[index])
        } else {
            selectedDataForm.splice(addedIndex, 1)
        }

        if (data[index].selected) {
            data[index].selected = false
        } else {
            data[index].selected = true
        }
        /* if (data[index].selected) {
            data[index].selected = false
        } else {

            let id = data[index].id
            let res = await ConsignmentService.getAditionalDetails(id)

            if (res.status) {

                if (res.data.view.uom.length != 0 && res.data.view.batch.length != 0) {
                    data[index].selected = true

                } else {
                    data[index].selected = false
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'error',
                        snackbar_message: "Please Complete the Additional Information Before Select"
                    })
                }

            }

        } */

        this.setState({ data, selectedDataForm }, () => {
            this.render()
            console.log("data", this.state.selectedDataForm)
        })
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

    async loadContainers(type_id) {
        let params = { vehicle_type_id: type_id };
        let owner_id = '000';
        let res1 = await VehicleService.fetchAllVehicles(params, owner_id)
        if (res1.status) {
            console.log("res", res1.data.view.data)
            this.setState({
                all_containers: res1.data.view.data,

            })
        }
    }

    async loadContainerTypes() {
        let params = { limit: 99999, page: 0 };
        let res1 = await VehicleService.getAllVehicleTypes(params)
        if (res1.status) {
            console.log("res", res1.data.view.data)
            this.setState({
                allVehicleTypes: res1.data.view.data,
            })
        }
    }

    async crateConsignment() {
        this.setState({ submittingProcess: true })
        let formData = this.state.formData;
        let data = this.state.selectedDataForm;
        console.log("submitting data", this.state.selectedDataForm)


        if (data.filter((item) => (item.qty != null && item.qty > 0)).length == 0) {
            this.setState({
                snackbar: true,
                snackbar_message: 'Please Select Consingment And Add Quantity',
                snackbar_severity: 'error',
                submittingProcess: false
            })

        } else {
            formData.items = [];
            data.forEach(element => {
                if (element.qty > 0) {
                    formData.items.push({
                        item_id: element.id,
                        quantity: element.qty
                    })
                }
            });

            //console.log("form Data", formData)
            let res = await ConsignmentService.createConsignment(formData);
            console.log("ress", res)
            if (res.status == 201) {
                this.setState({
                    snackbar: true,
                    snackbar_message: 'Consignment Create Successful',
                    snackbar_severity: 'success',
                    submittingProcess: false
                }, () => {
                    //window.location.reload()
                    let consingment_id = res.data.posted.data.id;
                    if (includesArrayElements(this.state.userRoles,authRoles.lp_RequestList))  {
                        setTimeout(() => {
                            window.location = `/localpurchase/view_consignment/${consingment_id}`
                        }, 1200);
                    } else {
                        setTimeout(() => {
                            window.location = `/consignments/view-consignment/${consingment_id}`
                        }, 1200);
                    }
                })

            } else {


                this.setState({
                    snackbar: true,
                    snackbar_message: res.response.data.error ? res.response.data.error : 'Consignment Create Unsuccessful',
                    snackbar_severity: 'error',
                    submittingProcess: false
                })
            }
        }
    }


    async dabitNoteTypes() {

        let params = {};
        let res1 = await ConsignmentService.getDabitNoteTypes(params)
        if (res1.status) {
            console.log("res", res1.data.view.data)
            this.setState({
                debit_note_types: res1.data.view.data,
            })
        }
    }

    async dabitNoteSubTypes(type_id) {
        if (type_id) {
            let params = { type_id: type_id };
            let res1 = await ConsignmentService.getDabitNoteSubTypes(params)
            if (res1.status) {
                console.log("resdebitnote", res1.data.view.data)
                this.setState({
                    debit_note_sub_types: res1.data.view.data,
                })
            }
        } else {
            let formData = this.state.formData
            formData.debit_note_sub_type_id = null;
            formData.debit_note_sub_type = null;
            this.setState({
                debit_note_sub_types: [],
                formData
            })
        }
    }

    async loadAllSuppliers() {
        let params = {}

        let res = await HospitalConfigServices.getAllSuppliers(params)
        if (res.status) {
            console.log("all Suppliers", res.data.view.data)
            this.setState({
                all_Suppliers: res.data.view.data,
            })
        }
    }

    updateColumns = () => {
        const { userRoles, columns } = this.state;
        const label = (includesArrayElements(userRoles,authRoles.lp_RequestList)) ? 'Recieving Qty' : 'Consingment Qty';

        const updatedColumns = columns.map((column) => {
            if (column.name === 'Order Value') {
                return {
                    ...column,
                    label: label,
                };
            }
            return column;
        });
        this.setState({ columns: updatedColumns });
    }

    async componentDidMount() {
        var user = await localStorageService.getItem('userInfo');
        console.log('cheking kokokok', user)
        this.setState({
            userRoles: user.roles,
        }, () => {
            this.updateColumns();

            const query = new URLSearchParams(this.props.location.search);
            const po_no = query.get('po_no')
            const id = query.get('id') ? query.get('id') : null
            const supplier_id = query.get('supplier_id') ? query.get('supplier_id') : null
            console.log('checking po number', po_no)
            if (po_no) {
                let filterData = this.state.filterData
                filterData.po_id = id
                // filterData.po_no = po_no

                this.setState({ filterData, id: id, formData: { ...this.state.formData, po: po_no, supplier_id: supplier_id } }, () => {
                    this.loadConsignmentList()
                })
            }
        })

        await this.loadContainerTypes()
        await this.loadEmployees()
        await this.dabitNoteTypes()
        await this.loadAllSuppliers()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        let dummy = [{ lable: "test1", value: "ads" }]

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        {!(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) ?
                            <CardTitle title="New Consignment" />
                            :
                            <CardTitle title="LP Recieving" />
                        }
                        <div className="pt-3">
                            {/* <Grid container spacing={2}>
                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                    <SubTitle title={"Purchase Order No"}></SubTitle>
                                    <ValidatorForm
                                        ref="form"
                                        onSubmit={this.loadConsignmentList}
                                        onError={errors => console.log(errors)}
                                    >
                                        <TextValidator
                                            className='w-full'
                                            placeholder="Purchase Order No"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .filterData.po_no || null
                                            }
                                            onChange={(e, value) => {
                                                let filterData = this.state.filterData
                                                filterData.po_no = e.target.value

                                                let formData = this.state.formData;
                                                formData.po = e.target.value;
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
                            </Grid> */}
                            {this.state.loaded ? (
                                <div className="pt-5">
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
                            {(this.state.selectedDataForm.filter((item) => (item.qty != null && item.qty > 0)).length > 0) ?
                                <ValidatorForm
                                    ref="form"
                                    onSubmit={() => this.crateConsignment()}
                                    onError={() => null}
                                >
                                    <Grid container spacing={2}>
                                        {
                                            !(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&
                                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title={"Wharf Ref No"}></SubTitle>
                                                <TextValidator
                                                    className='w-full'
                                                    placeholder="Wharf Ref No"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state
                                                            .formData
                                                            .wharf_ref_no
                                                    }
                                                    onChange={(e, value) => {
                                                        let formData = this.state.formData;
                                                        formData.wharf_ref_no = e.target.value
                                                        this.setState({ formData })

                                                    }}
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                // errorMessages={[
                                                //     'this field is required',
                                                // ]}
                                                />
                                            </Grid>
                                        }
                                        {
                                            !(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&
                                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title={"WDN/LDCN No"}></SubTitle>
                                                <TextValidator
                                                    className='w-full'
                                                    placeholder="WDN/LDCN No"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state
                                                            .formData
                                                            .wdn_no
                                                    }
                                                    onChange={(e, value) => {
                                                        let formData = this.state.formData;
                                                        formData.wdn_no = e.target.value
                                                        this.setState({ formData })
                                                    }}
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                // errorMessages={[
                                                //     'this field is required',
                                                // ]}
                                                />
                                            </Grid>
                                        }
                                        {
                                            !(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&
                                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title={"WDN/LDCN Date"}></SubTitle>
                                                <DatePicker
                                                    className="w-full"
                                                    value={this.state.formData.wdn_date}
                                                    //label="Date From"
                                                    placeholder="WDN/LDCN Date"
                                                    // minDate={new Date()}
                                                    //maxDate={new Date("2020-10-20")}
                                                    // required={true}
                                                    // errorMessages="this field is required"
                                                    onChange={date => {
                                                        let formData = this.state.formData;
                                                        formData.wdn_date = date;
                                                        this.setState({ formData })
                                                    }}
                                                />
                                            </Grid>
                                        }



                                        {
                                            !(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&
                                            <>
                                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                                    <SubTitle title={"LDCN ref No"}></SubTitle>
                                                    <TextValidator
                                                        className='w-full'
                                                        placeholder="LDCN ref No"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state
                                                                .formData
                                                                .ldcn_ref_no
                                                        }
                                                        onChange={(e, value) => {
                                                            let formData = this.state.formData;
                                                            formData.ldcn_ref_no = e.target.value
                                                            this.setState({ formData })
                                                        }}
                                                    // validators={[
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                    />
                                                </Grid>
                                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                                    <SubTitle title={"Indent No"}></SubTitle>
                                                    <TextValidator
                                                        disabled={includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)}
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
                                                    // validators={[
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        {
                                            !(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) ?
                                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                                    <SubTitle title={"Invoice No"}></SubTitle>
                                                    <TextValidator
                                                        className='w-full'
                                                        placeholder="Invoice No"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state
                                                                .formData
                                                                .invoice_no
                                                        }
                                                        onChange={(e, value) => {
                                                            let formData = this.state.formData;
                                                            formData.invoice_no = e.target.value
                                                            this.setState({ formData })
                                                        }}
                                                    /*  validators={[
                                                         'required',
                                                     ]}
                                                     errorMessages={[
                                                         'this field is required',
                                                     ]} */
                                                    />
                                                </Grid>
                                                :
                                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                                    <SubTitle title={"Invoice No"}></SubTitle>
                                                    <TextValidator
                                                        className='w-full'
                                                        placeholder="Invoice No"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state
                                                                .formData
                                                                .invoice_no
                                                        }
                                                        onChange={(e, value) => {
                                                            let formData = this.state.formData;
                                                            formData.invoice_no = e.target.value
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
                                        }

                                        {
                                            !(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&
                                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title={"Invoice Date"}></SubTitle>
                                                <DatePicker
                                                    className="w-full"
                                                    value={this.state.formData.invoice_date}
                                                    //label="Date From"
                                                    placeholder="Invoice Date"
                                                    // minDate={new Date()}
                                                    //maxDate={new Date("2020-10-20")}
                                                    /* required={true}
                                                    errorMessages="this field is required" */
                                                    onChange={date => {
                                                        let formData = this.state.formData;
                                                        formData.invoice_date = date;
                                                        this.setState({ formData })
                                                    }}
                                                />
                                            </Grid>
                                        }

                                        {
                                            !(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&

                                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title={"PA No"}></SubTitle>
                                                <TextValidator
                                                    disabled={includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)}
                                                    className='w-full'
                                                    placeholder="PA No"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state
                                                            .formData
                                                            .pa_no
                                                    }
                                                    onChange={(e, value) => {
                                                        let formData = this.state.formData;
                                                        formData.pa_no = e.target.value
                                                        this.setState({ formData })
                                                    }}
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                // errorMessages={[
                                                //     'this field is required',
                                                // ]}
                                                />
                                            </Grid>
                                        }
                                        {
                                            !(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&
                                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title={"HS Code"}></SubTitle>
                                                <TextValidator
                                                    className='w-full'
                                                    placeholder="HS Code"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state
                                                            .formData
                                                            .hs_code
                                                    }
                                                    onChange={(e, value) => {
                                                        let formData = this.state.formData;
                                                        formData.hs_code = e.target.value
                                                        this.setState({ formData })
                                                    }}
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                // errorMessages={[
                                                //     'this field is required',
                                                // ]}
                                                />
                                            </Grid>
                                        }
                                        {
                                            !(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&
                                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title={"Delivery Type"}></SubTitle>
                                                <Autocomplete
                                                    disableClearable
                                                    className="w-full"
                                                    options={[{ value: "FCL" }, { value: "LCL" }, { value: "Airfreight" }]}
                                                    /*  defaultValue={dummy.find(
                                                         (v) => v.value == ''
                                                     )} */
                                                    getOptionLabel={(option) => option.value}
                                                    getOptionSelected={(option, value) =>
                                                        console.log("ok")
                                                    }
                                                    onChange={(event, value) => {
                                                        let formData = this.state.formData;
                                                        formData.delivery_type = value.value
                                                        this.setState({ formData })
                                                    }
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Delivery Type"
                                                            //variant="outlined"
                                                            //value={}
                                                            fullWidth
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .delivery_type
                                                            }
                                                            variant="outlined"
                                                            size="small"
                                                        // validators={[
                                                        //     'required',
                                                        // ]}
                                                        // errorMessages={[
                                                        //     'this field is required',
                                                        // ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        }
                                        {
                                            !(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&
                                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title={"Delivery Person"}></SubTitle>
                                                <Autocomplete
                                                    disableClearable
                                                    className="w-full"
                                                    options={this.state.all_employee}
                                                    /*  defaultValue={dummy.find(
                                                         (v) => v.value == ''
                                                     )} */
                                                    getOptionLabel={(option) => option.name ? option.name : ""}
                                                    getOptionSelected={(option, value) =>
                                                        console.log("ok")
                                                    }
                                                    onChange={(event, value) => {
                                                        let formData = this.state.formData;
                                                        formData.delivery_person_id = value.id
                                                        this.setState({ formData })
                                                    }
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Delivery Person"
                                                            //variant="outlined"
                                                            value={this.state.formData.delivery_person_id}
                                                            fullWidth
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            variant="outlined"
                                                            size="small"
                                                        // validators={[
                                                        //     'required',
                                                        // ]}
                                                        // errorMessages={[
                                                        //     'this field is required',
                                                        // ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        }
                                        {
                                            !(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) ?
                                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                                    <SubTitle title={"Delivery Date"}></SubTitle>
                                                    <DatePicker
                                                        className="w-full"
                                                        value={this.state.formData.delivery_date}
                                                        //label="Date From"
                                                        placeholder="Delivery Date"
                                                        // minDate={new Date()}
                                                        //maxDate={new Date("2020-10-20")}
                                                        // required={true}
                                                        // errorMessages="this field is required"
                                                        onChange={date => {
                                                            let formData = this.state.formData;
                                                            formData.delivery_date = date;
                                                            this.setState({ formData })

                                                        }}
                                                    />
                                                </Grid>
                                                :
                                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                                    <SubTitle title={"Delivery Date"}></SubTitle>
                                                    <DatePicker
                                                        className="w-full"
                                                        value={this.state.formData.delivery_date}
                                                        //label="Date From"
                                                        placeholder="Delivery Date"
                                                        minDate={new Date()}
                                                        //maxDate={new Date("2020-10-20")}
                                                        required={true}
                                                        errorMessages="This field is required"
                                                        onChange={date => {
                                                            let formData = this.state.formData;
                                                            formData.delivery_date = date;
                                                            this.setState({ formData })
                                                        }}
                                                    />
                                                </Grid>
                                        }
                                        {!(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&
                                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title={"Vehicle Type"}></SubTitle>
                                                <Autocomplete
                                                    disableClearable
                                                    className="w-full"
                                                    options={this.state.allVehicleTypes}
                                                    /*  defaultValue={dummy.find(
                                                         (v) => v.value == ''
                                                     )} */
                                                    getOptionLabel={(option) => option.name}
                                                    /* getOptionSelected={(option, value) =>
                                                        console.log("ok")
                                                    } */
                                                    onChange={(event, value) => {
                                                        if (value) {
                                                            this.loadContainers(value.id)
                                                        }
                                                    }
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Vehicle Type"
                                                            //variant="outlined"
                                                            //value={}
                                                            fullWidth
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            variant="outlined"
                                                            size="small"
                                                        /*  validators={[
                                                             'required',
                                                         ]}
                                                         errorMessages={[
                                                             'this field is required',
                                                         ]} */
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        }
                                        {!(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&
                                            <>
                                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                                    <SubTitle title={"Container Number(s)"}></SubTitle>
                                                    <Autocomplete
                                                        disableClearable
                                                        className="w-full"
                                                        options={this.state.all_containers}
                                                        /*  defaultValue={dummy.find(
                                                             (v) => v.value == ''
                                                         )} */
                                                        multiple
                                                        getOptionLabel={(option) => option.reg_no}
                                                        /*  getOptionSelected={(option, value) =>
                                                             console.log("ok")
                                                         } */
                                                        onChange={(event, value) => {
                                                            let formData = this.state.formData;
                                                            formData.containers = []
                                                            value.forEach(element => {
                                                                formData.containers.push({ vehicle_id: element.id })
                                                            });

                                                            this.setState({ formData })
                                                        }
                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Container Number(s)"
                                                                //variant="outlined"
                                                                value={this.state.formData.containers}
                                                                fullWidth
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                variant="outlined"
                                                                size="small"
                                                            // validators={[
                                                            //     'required',
                                                            // ]}
                                                            // errorMessages={[
                                                            //     'this field is required',
                                                            // ]}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                                    <SubTitle title={"Debit Note Type"}></SubTitle>
                                                    <Autocomplete
                                                        disableClearable
                                                        className="w-full"
                                                        disabled={includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)}
                                                        options={this.state.debit_note_types}
                                                        defaultValue={!(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) ? null : this.state.debit_note_types.find(
                                                            (v) => v.name === this.state.formData.debit_note_type
                                                        )}
                                                        getOptionLabel={(option) => option.name ? option.name : ""}
                                                        getOptionSelected={(option, value) =>
                                                            console.log("ok")
                                                        }
                                                        onChange={(event, value) => {
                                                            let formData = this.state.formData;
                                                            formData.debit_note_type_id = value.id
                                                            formData.debit_note_type = value.code + " - " + value.name
                                                            this.dabitNoteSubTypes(value.id)
                                                            this.setState({ formData })
                                                        }
                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Debit Note Type"
                                                                //variant="outlined"
                                                                value={this.state.formData.debit_note_type}
                                                                fullWidth
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                variant="outlined"
                                                                size="small"
                                                            // validators={[
                                                            //     'required',
                                                            // ]}
                                                            // errorMessages={[
                                                            //     'this field is required',
                                                            // ]}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        {!(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&
                                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title={"Debit Note Sub Type"}></SubTitle>
                                                <Autocomplete
                                                    disableClearable
                                                    className="w-full"
                                                    options={this.state.debit_note_sub_types}
                                                    /*  defaultValue={dummy.find(
                                                         (v) => v.value == ''
                                                     )} */
                                                    getOptionLabel={(option) => option.name ? option.name : ""}
                                                    getOptionSelected={(option, value) =>
                                                        console.log("ok")
                                                    }
                                                    onChange={(event, value) => {
                                                        let formData = this.state.formData;
                                                        formData.debit_note_sub_type_id = value.id
                                                        formData.debit_note_sub_type = value.code + " - " + value.name
                                                        this.setState({ formData })
                                                    }
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Debit Note Sub Type"
                                                            //variant="outlined"
                                                            value={this.state.formData.debit_note_sub_type_id}
                                                            fullWidth
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            variant="outlined"
                                                            size="small"
                                                        /* validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]} */
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        }
                                        {
                                            !(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&
                                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title={"Vessel No"}></SubTitle>
                                                <TextValidator
                                                    className='w-full'
                                                    placeholder="Vessel No"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state
                                                            .formData
                                                            .vessel_no
                                                    }
                                                    onChange={(e, value) => {
                                                        let formData = this.state.formData;
                                                        formData.vessel_no = e.target.value
                                                        this.setState({ formData })
                                                    }}
                                                //     validators={[
                                                //         'required',
                                                //     ]}
                                                //     errorMessages={[
                                                //         'this field is required',
                                                //     ]}
                                                />
                                            </Grid>
                                        }
                                        {this.state.all_Suppliers.find((v) => v.id == this.state.formData.supplier_id) &&
                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            {console.log('hfffhhfhfhfhfhfhfhfhfhf', this.state.all_Suppliers.find((v) => v.id == this.state.formData.supplier_id))}
                                            <SubTitle title={"Supplier"}></SubTitle>
                                            
                                            <Autocomplete
                                                disabled={includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)}
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_Suppliers}
                                                getOptionLabel={(option) => option.name}
                                                value={this.state.all_Suppliers.find((v) => v.id == this.state.formData.supplier_id)}
                                                onChange={(event, value) => {
                                                    let formData = this.state.formData
                                                    formData.supplier_id = value.id

                                                    formData.supplier_name = value.name
                                                    formData.supplier_address = value.address
                                                    this.setState({ formData })
                                                }
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Supplier"
                                                        //variant="outlined"
                                                        //value={}
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
                                         }
                                        {!(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&
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
                                                        if (value.cc == "LKR") {
                                                            formData.exchange_rate = 1
                                                        } else {
                                                            formData.exchange_rate = null
                                                        }
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
                                                        /* validators={['required']}
                                                        errorMessages={['this field is required']} */
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        }
                                        {!((includesArrayElements(this.state.userRoles,authRoles.lp_RequestList))) &&
                                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title={"Exchange Rate"}></SubTitle>
                                                <TextValidator
                                                    className='w-full'
                                                    placeholder="Exchange Rate"
                                                    disabled={this.state.formData.currency == "LKR" ? true : false}
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    type='number'
                                                    value={
                                                        this.state
                                                            .formData
                                                            .exchange_rate
                                                    }
                                                    onChange={(e, value) => {
                                                        let formData = this.state.formData;
                                                        formData.exchange_rate = e.target.value

                                                        if (formData.values_in_currency && formData.exchange_rate) {
                                                            formData.values_in_lkr = Number(formData.values_in_currency) * Number(formData.exchange_rate)
                                                        }

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
                                        }
                                        {!(includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)) &&
                                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title={"Price in Currency"}></SubTitle>
                                                <TextValidator
                                                    className='w-full'
                                                    placeholder="Price in Currency"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state
                                                            .formData
                                                            .values_in_currency
                                                    }
                                                    onChange={(e, value) => {
                                                        let formData = this.state.formData;
                                                        formData.values_in_currency = e.target.value
                                                        if (formData.values_in_currency && formData.exchange_rate) {
                                                            formData.values_in_lkr = Number(formData.values_in_currency) * Number(formData.exchange_rate)
                                                        }
                                                        this.setState({ formData })
                                                    }}
                                                    type='number'
                                                /* validators={[
                                                    'required',
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                ]} */
                                                />
                                            </Grid>
                                        }
                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Total Price (LKR)"}></SubTitle>
                                            <TextValidator
                                                disabled={includesArrayElements(this.state.userRoles,authRoles.lp_RequestList)}
                                                className='w-full'
                                                placeholder="Price in LKR"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={
                                                    String(roundDecimal(this.state
                                                        .formData
                                                        .values_in_lkr, 2).toLocaleString('en-US'))
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                    <Button
                                        className="mt-2 mr-2"
                                        progress={this.state.submittingProcess}
                                        type="submit"
                                        scrollToTop={true}
                                        disabled={!this.state.disableSubmit}
                                    >
                                        <span className="capitalize">Submit</span>
                                    </Button>
                                </ValidatorForm>
                                : null
                            }
                        </div>
                    </LoonsCard>
                    <LoonsSnackbar
                        open={this.state.snackbar}
                        onClose={() => {
                            this.setState({ snackbar: false })
                        }}
                        message={this.state.snackbar_message}
                        autoHideDuration={1200}
                        severity={this.state.snackbar_severity}
                        elevation={2}
                        variant="filled"
                    ></LoonsSnackbar>
                </MainContainer>
            </Fragment >
        )
    }
}
export default withStyles(styleSheet)(NewConsignment)

