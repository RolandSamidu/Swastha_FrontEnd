import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    FormControlLabel,
    Checkbox,
    Hidden,
    FormGroup,
    TextField,
    Typography,
    Dialog,
    IconButton,
    CircularProgress,
    Divider,
    InputAdornment,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import ClinicService from 'app/services/ClinicService'
import PatientServices from 'app/services/PatientServices'
import PatientClinicService from 'app/services/PatientClinicService'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { DateTimePicker } from '@material-ui/pickers'
import localStorageService from 'app/services/localStorageService';
import EmployeeServices from 'app/services/EmployeeServices'
import {
    Button,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    DatePicker,
    CheckboxValidatorElement,
    LoonsSnackbar,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import { dateParse, timeParse, dateTimeParse } from "utils";
import VehicleService from "app/services/VehicleService";
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import { element } from 'prop-types'
import LoonsDatePicker from 'app/components/LoonsLabComponents/DatePicker'
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import SearchIcon from '@material-ui/icons/Search';
import MDSService from 'app/services/MDSService'


const drawerWidth = 270;

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
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: "#bad4ec"
        // backgroundColor: themeColors['whiteBlueTopBar'].palette.primary.main
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth - 80}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        //padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: -80,
    },
})

class MDS_AddPickUpPerson extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            order: {
                order_exchange_id: null,
                pickup_person_id: null,
                remarks: [],
                requested_date: null,
                delivery_mode: null,
                vehicle_details: []
            },
            loaded: false,
            loadData: {
                //type: ["Helper",'Health Service Assistant','Driver']
                type: ["Helper", 'Health Service Assistant', 'Driver', 'Drug Store Keeper','Chief MLT','Chief Radiographer', 'Pharmacist', 'RMSD MSA', 'RMSD OIC', 'RMSD Pharmacist']
            },
            vehicle_totalitems: 0,
            driver_totalitems: 0,
            helper_totalitems: 0,
            vehicle_filterData: {
                page: 0,
                limit: 10,
                storage_type: null,
                vehicle_type: null,
                search: null

            },
            remarks: null,
            delivery_modes: [
                {
                    label: 'Delivery'
                },
                {
                    label: 'Pick Up'
                }
            ],
            other_remark: '',
            employees: null,
            other_remark_check: false,
            alert: false,
            message: '',
            severity: 'success',
            pickUpDialogView: false,
            summaryView: false,
            driverView: false,
            tableDataLoaded: true,
            vehicletableDataLoaded: false,
            drivertableDataLoaded: false,
            helpertableDataLoaded: false,
            summaryDataLoaded: false,
            vehicle_data: [],
            driver_data: [],
            helper_data: [],
            columns: [
                {
                    name: 'storage_type',
                    label: 'Storage Type',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'No of Items',
                    options: {
                        display: true
                    }
                },
            ],
            vehicle_columns: [
                {
                    name: 'reg_no',
                    label: 'Vehicle Reg No',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'VehicleType',
                    label: 'Vehicle Type',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].name)
                            }
                        }
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Vehicle Storage Type',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'max_volume',
                    label: 'Max Volume',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', this.state.vehicle_data[tableMeta.rowIndex]);
                            return (
                                <>
                                    <div style={{ display: "flex", alignItems: 'center' }}>
                                        <LoonsButton
                                            // color="success"
                                            className="mt-2"
                                            progress={false}
                                            disabled={(this.state.vehicle_data[tableMeta.rowIndex].reserved || this.state.vehicleReserved)}
                                            scrollToTop={true}
                                            onClick={() => { this.handleReserve(this.state.vehicle_data[tableMeta.rowIndex], tableMeta.rowIndex) }}
                                        >
                                            <span className="capitalize">{this.state.vehicle_data[tableMeta.rowIndex].reserved ? 'Reserved' : 'Reserve'}</span>
                                        </LoonsButton>
                                    </div>

                                </>
                            )
                        },
                    },
                },
                {
                    name: 'no_of_items',
                    label: 'Reserved Date',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Time',
                    options: {
                        display: true
                    }
                },
            ],
            driver_columns: [
                {
                    name: 'vh',
                    label: 'Driver ID',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'Employee',
                    label: 'Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].name)
                            }
                        }
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Contact Number',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'DOB',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Address',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('data', this.state.driver_data[tableMeta.rowIndex]);
                            return (
                                <>
                                    <div style={{ display: "flex", alignItems: 'center' }}>
                                        <LoonsButton
                                            // color="success"
                                            className="mt-2"
                                            progress={false}
                                            disabled={(this.state.driver_data[tableMeta.rowIndex].assigned || this.state.driverReserved)}
                                            scrollToTop={true}
                                            onClick={() => { this.handleDriverAssign(this.state.driver_data[tableMeta.rowIndex], tableMeta.rowIndex) }}
                                        >
                                            <span className="capitalize">{this.state.driver_data[tableMeta.rowIndex].assigned ? 'Assigned' : 'Assign'}</span>
                                        </LoonsButton>
                                    </div>

                                </>
                            )
                        },
                    }
                },

            ],
            Helper_columns: [
                {
                    name: 'vh',
                    label: 'Helper ID',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'Employee',
                    label: 'Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].name)
                            }
                        }
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Contact Number',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'DOB',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Address',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', this.state.helper_data[tableMeta.rowIndex]);
                            return (
                                <>
                                    <div style={{ display: "flex", alignItems: 'center' }}>
                                        <LoonsButton
                                            // color="success"
                                            className="mt-2"
                                            progress={false}
                                            disabled={(this.state.helper_data[tableMeta.rowIndex].assigned || this.state.helperReserved)}
                                            scrollToTop={true}
                                            onClick={() => { this.handleHelperAssign(this.state.helper_data[tableMeta.rowIndex], tableMeta.rowIndex) }}
                                        >
                                            <span className="capitalize">{this.state.helper_data[tableMeta.rowIndex].assigned ? 'Assigned' : 'Assign'}</span>
                                        </LoonsButton>
                                    </div>

                                </>
                            )
                        },
                    }
                },

            ],
            summary_columns: [
                {
                    name: 'vehicle',
                    label: 'Vehicle Reg No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('vehicle', tableMeta);
                            if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].reg_no)
                            }
                        }
                    }
                },
                {
                    name: 'driver',
                    label: 'Driver Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('driver', tableMeta);
                            if (tableMeta.rowData[tableMeta.columnIndex].Employee == null || tableMeta.rowData[tableMeta.columnIndex].Employee == '') {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].Employee.name)
                            }
                        }
                    }
                },
                {
                    name: 'helper',
                    label: 'Helper Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('helper', tableMeta);
                            if (tableMeta.rowData[tableMeta.columnIndex].Employee == null || tableMeta.rowData[tableMeta.columnIndex].Employee == '') {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].Employee.name)
                            }
                        }
                    }
                },
            ],

            data: [
                {
                    storage_type: 'Cold Storage',
                    no_of_items: 10
                },
                {
                    storage_type: 'Room Temperature',
                    no_of_items: 20
                },
                {
                    storage_type: 'Humidity',
                    no_of_items: 30
                }
            ],
            storage_types: [
                { label: 'AC' },
                { label: 'Cool' },
                { label: 'Normal' }
            ],
            vehicle_types: [
                { label: 'Van' },
                { label: 'Ambulance' },
                { label: 'Light Truck' },
                { label: 'Medium Truck' },
                { label: 'Heavy Truck' }
            ],
            reserved_vehicle: null,
            owner_id: null,
            assigned_driver: null,
            assigned_helper: null,
            summary_data: [],
            vehicleReserved: false,
            driverReserved: false,
            helperReserved: false,
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let hospital = await localStorageService.getItem("login_user_pharmacy_drugs_stores")
        let loadData = this.state.loadData;
        loadData.created_location_id = hospital[0].pharmacy_drugs_stores_id;
        
        let user_res = await VehicleService.getVehicleUsers(loadData);
        if (user_res.status == 200) {
            console.log('data', user_res.data.view.data);
            this.setState({
                employees: user_res.data.view.data,
                totalPages: user_res.data.view.totalPages,
                totalItems: user_res.data.view.totalItems,
            })
        }

        let res = await PharmacyOrderService.getRemarks()
        if (res.status == 200) {
            let remarks = [...res.data.view.data, { remark: 'Other' }]
            this.setState({
                remarks: remarks,
                loaded: true
            },
                () => { console.log(this.state.remarks); this.render() })
            return;
        }

    }

    async handleDriverAssign(driver, index) {
        this.setState({
            drivertableDataLoaded: false,
        })

        let driver_data = this.state.driver_data;
        if (index != -1) {
            driver_data[index].assigned = 'true'
        }

        console.log('driver', driver);
        this.setState({
            driver_data,
            driverReserved: true,
            assigned_driver: driver,
            drivertableDataLoaded: true

        })
    }

    async handleHelperAssign(Helper, index) {
        this.setState({
            helpertableDataLoaded: false
        })

        let helper_data = this.state.helper_data;
        if (index != -1) {
            helper_data[index].assigned = 'true'
        }

        console.log('Helper', Helper);
        this.setState({
            helper_data,
            helperReserved: true,
            helpertableDataLoaded: true,
            assigned_helper: Helper,

        }, () => this.handleSummaryView())
    }

    async handleReserve(vehicle, index) {
        this.setState({
            vehicletableDataLoaded: false
        })

        let vehicle_data = this.state.vehicle_data;
        if (index != -1) {
            vehicle_data[index].reserved = 'true'
        }


        console.log('vehicle', vehicle);
        this.setState({
            vehicle_data,
            reserved_vehicle: vehicle,
            vehicleReserved: true,
            driverView: true,
            vehicletableDataLoaded: true,
            drivertableDataLoaded: false,
            helpertableDataLoaded: false,
        }, () => this.loadDataAfterReserve())
    }

    async handleSummaryView() {

        this.setState({
            summaryDataLoaded: false
        })
        let reservation = {
            vehicle: this.state.reserved_vehicle,
            driver: this.state.assigned_driver,
            helper: this.state.assigned_helper,
        }
        let summary_data = this.state.summary_data
        summary_data.push(reservation);
        this.setState({
            summary_data,
            summaryView: true,
            summaryDataLoaded: true,
        }, () => console.log('summary', this.state.summary_data))
    }

    async loadDataAfterReserve() {
        let drivers = [];
        let helpers = [];
        console.log('reserved_vehicle', this.state.reserved_vehicle)
        if (this.state.reserved_vehicle.VehicleUsers.length > 0) {
            this.state.reserved_vehicle.VehicleUsers.forEach(element => {
                if (element.type === 'Driver') {
                    drivers.push({ ...element, assigned: false })
                }
                else if (element.type === 'Helper') {
                    helpers.push({ ...element, assigned: false })
                }
            });
        } else {
            this.setState({
                alert: true,
                message: 'No drivers or Helpers Found',
                severity: 'error',

            })
        }
        this.setState({
            driver_data: drivers,
            helper_data: helpers,
            driver_totalitems: drivers.length,
            helper_totalitems: helpers.length,
            drivertableDataLoaded: true,
            helpertableDataLoaded: true,
        })
    }


    async loadOwnerID() {
        let value = await localStorageService.getItem('Selected_Warehouse')
        if (value) {
            this.setState({
                owner_id: value.owner_id
            })
        }
        else {
            this.setState({
                owner_id: null,
            })
        }
    }

    async loadVehicleData() {
        this.setState({ vehicletableDataLoaded: false })
        let res = await MDSService.getAllVehicles(this.state.vehicle_filterData, this.state.owner_id)
        if (res.status && res.status == 200) {
            let data = [];
            if (res.data.view.data.length > 0) {
                res.data.view.data.forEach((element) => {
                    data.push({ ...element, reserved: false })
                })
            }
            this.setState({
                vehicle_data: data,
                vehicle_totalitems: res.data.view.totalItems,
                vehicletableDataLoaded: true
            })
        }
        else {
            return;
        }


    }

    async handleCancel() {
        this.setState({
            vehicleReserved: false,
            driverReserved: false,
            helperReserved: false,
            driverView: false,
            summaryView: false,
        }, () => {
            this.loadVehicleData();
        })
    }


    async componentDidMount() {
        // let selectedObj = this.props.location.state
        this.loadOwnerID();
        let order = this.state.order;
        order.order_exchange_id = this.props.id.id

        this.setState({
            order
        }, () => console.log("patient", this.state.order))
        this.loadData();
    }




    /**
     * Function to retrieve required data sets to inputs
     */

    /**
     *
     * @param {} val
     * Update the status based on the check box selection
     */
    handleChange = (val) => {
        const formDataSet = this.state.formData
        formDataSet.stat = val == "true" ? true : false;
        this.setState({
            formData: formDataSet,
        })
    }

    async onSubmit() {
        // this.state.order.remarks=[...this.state.remarks,this.state.other_remark]
        // console.log(this.state.order);
        // console.log('other',this.state.other_remark)
        const { onSuccess } = this.props;
        let neww = [...this.state.order.remarks, { other_remarks: this.state.other_remark }]
        this.state.order.remarks = neww;

        if (this.state.reserved_vehicle) {
            let vehicle_data = {
                vehicle_id: this.state.reserved_vehicle.id,
                helper_id: this.state.assigned_helper.employee_id,
                driver_id: this.state.assigned_driver.employee_id
            }

            this.state.order.vehicle_details.push(vehicle_data)
        }

        console.log('req body', this.state.order);
        let res = await PharmacyOrderService.setUpDeliveries(this.state.order)

        if (res.status && res.status == 201) {
            this.setState({
                alert: true,
                message: 'Order Updated Successfully',
                severity: 'success',
            }, () => {
                onSuccess &&
                    onSuccess({

                    });
            })
            // window.location.reload();
        } else {
            this.setState({
                alert: true,
                message: 'Order Updated Unsuccessful',
                severity: 'error',
            })
        }
    }



    render() {
        // let { theme } = this.props
        const { classes } = this.props
        // console.log('reason value', this.state.patientObj.reason_id ? this.state.patientObj.reason_id : 'nah')
        return (
            <Fragment >
                {this.state.loaded ?
                    <div className="w-full">
                        <MainContainer>
                            <ValidatorForm
                                onSubmit={() => this.onSubmit()}
                            >
                                <div className='my-5'>
                                    <LoonsCard>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} lg={6} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant='h6' className="font-semibold"> Pick Up Person :</Typography>
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.employees
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let order = this.state.order;
                                                            order.pickup_person_id = value.id
                                                            this.setState({ order })
                                                        }
                                                    }}
                                                    // value={appConst.user_type.find(
                                                    //     (v) =>
                                                    //         v.type ===
                                                    //         this.state.formData
                                                    //             .type
                                                    // )}
                                                    getOptionLabel={(option) =>
                                                        option.name ? option.name : ''
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="User Type"
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant='h6' className="font-semibold"> Remarks :</Typography>
                                                <Autocomplete
                                        disableClearable
                                                    multiple={true}
                                                    className="w-full"
                                                    options={this.state.remarks
                                                    }
                                                    onChange={(e, value) => {
                                                        console.log('remarks', value);
                                                        if (null != value) {

                                                            let check = value.find((element, index) => {
                                                                if (element.remark == 'Other') {
                                                                    return true;
                                                                }
                                                                else {
                                                                    return false
                                                                }
                                                            })

                                                            if (check) {
                                                                console.log('insidedefefe');
                                                                let checkss = this.state.other_remark_check;
                                                                this.setState({
                                                                    other_remark_check: !checkss
                                                                }, () => console.log('other_remark_check', this.state.other_remark_check))
                                                            }

                                                            else {
                                                                let order = this.state.order;
                                                                order.remarks = []
                                                                value.forEach(element => { order.remarks.push({ 'remarks_id': element.id }) })
                                                                this.setState({ order })
                                                                this.setState({ other_remark_check: false })
                                                            }

                                                        }
                                                    }}
                                                    // value={appConst.user_type.find(
                                                    //     (v) =>
                                                    //         v.type ===
                                                    //         this.state.formData
                                                    //             .type
                                                    // )}
                                                    getOptionLabel={(option) =>
                                                        option.remark ? option.remark : ''
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Select remarks"
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant='h6' className="font-semibold"> Requested Date :</Typography>
                                                <LoonsDatePicker className="w-full"
                                                    value={this.state.order.requested_date}
                                                    placeholder="Requested Date"
                                                    // minDate={new Date()}
                                                    //maxDate={new Date()}
                                                    required={!this.state.date_selection}
                                                    disabled={this.state.date_selection}
                                                    errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let order = this.state.order
                                                        order.requested_date = date
                                                        this.setState({ order })
                                                    }} />
                                            </Grid>
                                            <Grid item xs={12} lg={6} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant='h6' className="font-semibold"> Delivery Mode :</Typography>
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.delivery_modes
                                                    }
                                                    onChange={(e, value) => {
                                                        console.log('remarks', value);
                                                        if (null != value) {
                                                            let order = this.state.order;
                                                            order.delivery_mode = value.label
                                                            if (value.label === 'Pick Up') {
                                                                this.setState({
                                                                    order,
                                                                    pickUpDialogView: true
                                                                }, () => this.loadVehicleData())
                                                                return;
                                                            } else {
                                                                this.setState({
                                                                    order,
                                                                    pickUpDialogView: false,
                                                                    driverView: false

                                                                })
                                                            }


                                                        }
                                                    }}
                                                    // value={appConst.user_type.find(
                                                    //     (v) =>
                                                    //         v.type ===
                                                    //         this.state.formData
                                                    //             .type
                                                    // )}
                                                    getOptionLabel={(option) =>
                                                        option.label ? option.label : ''
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Select Delivery Mode"
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            {
                                                this.state.other_remark_check &&
                                                <Grid item xs={12} lg={6} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography variant='h6' className="font-semibold"> Other Remarks :</Typography>
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Enter Remarks"
                                                        name="otherremark"
                                                        InputLabelProps={{
                                                            shrink: false
                                                        }}
                                                        value={this.state.other_remark}
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"

                                                        onChange={(e) => {
                                                            this.setState({
                                                                other_remark: e.target.value

                                                            })
                                                        }} />
                                                </Grid>
                                            }

                                            {
                                                !(this.state.pickUpDialogView) &&
                                                <Grid item lg={1} md={1} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <LoonsButton
                                                        className="mt-2"
                                                        progress={false}
                                                        type="submit"
                                                        scrollToTop={true}
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">Save</span>
                                                    </LoonsButton>
                                                </Grid>
                                            }

                                        </Grid>

                                    </LoonsCard>
                                </div>
                                {
                                    this.state.pickUpDialogView &&
                                    <div className='my-5'>
                                        <LoonsCard>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <CardTitle title={'Select Pick Up Details'} />
                                                </Grid>
                                                {/**Need to connect to backend */}
                                                {/*  <Grid item xs={12}>
                                                    <Typography variant='h6' className="font-semibold"> This order contains below transfer storage types</Typography>
                                                    <Divider />
                                                    {
                                                        this.state.tableDataLoaded
                                                            ? (
                                                                <LoonsTable
                                                                    //title={"All Aptitute Tests"}
                                                                    id={'allAptitute'}
                                                                    data={this.state.data}
                                                                    columns={this.state.columns} options={{
                                                                        pagination: true,
                                                                        serverSide: true,
                                                                        print: false,
                                                                        download: false,
                                                                        viewColumns: false
                                                                        // count: this.state.totalItems,
                                                                        // rowsPerPage: this.state.filterData.limit,
                                                                        // page: this.state.filterData.page,
                                                                        // onTableChange: (action, tableState) => {
                                                                        //     console.log('trigg', action, tableState)
                                                                        //     switch (action) {
                                                                        //         case 'changePage':
                                                                        //             this.setPage(tableState.page)
                                                                        //             break
                                                                        //         case 'sort':
                                                                        //             //this.sort(tableState.page, tableState.sortOrder);
                                                                        //             break
                                                                        //         default:
                                                                        //             console.log('action not handled.')
                                                                        //     }
                                                                        // }
                                                                    }}></LoonsTable>
                                                            )
                                                            : (
                                                                //load loading effect
                                                                <Grid className="justify-center text-center w-full pt-12">
                                                                    <CircularProgress size={30} />
                                                                </Grid>
                                                            )
                                                    }
                                                </Grid> */}
                                                <Grid item xs={12}>
                                                    <ValidatorForm>
                                                        <Grid item xs={12}>
                                                            <Typography variant='h6' className="font-semibold"> 1. Select Vehicle</Typography>

                                                        </Grid>
                                                        <Grid item xs={12} className='my-5'>
                                                            <Grid item xs={12}>
                                                                <Typography variant='subtitle1' className="font-semibold"> Filters</Typography>
                                                                <Divider />
                                                            </Grid>
                                                            <Grid item xs={12} style={{ display: 'flex' }}>
                                                                <Grid item xs={4} className='mx-2'>
                                                                    <SubTitle title="Storage type" />
                                                                    <Autocomplete
                                        disableClearable className="w-full"
                                                                        options={this.state.storage_types}
                                                                        onChange={(e, value) => {
                                                                            let vehicle_filterData = this.state.vehicle_filterData
                                                                            if (value != null) {
                                                                                vehicle_filterData.storage_type = value.label
                                                                            } else {
                                                                                vehicle_filterData.storage_type = null
                                                                            }

                                                                            this.setState({ vehicle_filterData })
                                                                        }}
                                                                        /*  defaultValue={this.state.all_district.find(
                                                                        (v) => v.id == this.state.formData.district_id
                                                                        )} */
                                                                        // value={this
                                                                        //     .state
                                                                        //     .all_ven
                                                                        //     .find((v) => v.id == this.state.formData.ven_id)}
                                                                        getOptionLabel={(
                                                                            option) => option.label
                                                                                ? option.label
                                                                                : ''}
                                                                        renderInput={(params) => (
                                                                            <TextValidator {...params} placeholder="Storage Type"
                                                                                //variant="outlined"
                                                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className='mx-2'>
                                                                    <SubTitle title="Storage type" />
                                                                    <Autocomplete
                                        disableClearable className="w-full"
                                                                        options={this.state.vehicle_types}
                                                                        onChange={(e, value) => {
                                                                            let vehicle_filterData = this.state.vehicle_filterData
                                                                            if (value != null) {
                                                                                vehicle_filterData.vehicle_type = value.label
                                                                            } else {
                                                                                vehicle_filterData.vehicle_type = null
                                                                            }

                                                                            this.setState({ vehicle_filterData })
                                                                        }}
                                                                        /*  defaultValue={this.state.all_district.find(
                                                                        (v) => v.id == this.state.formData.district_id
                                                                        )} */
                                                                        // value={this
                                                                        //     .state
                                                                        //     .all_ven
                                                                        //     .find((v) => v.id == this.state.formData.ven_id)}
                                                                        getOptionLabel={(
                                                                            option) => option.label
                                                                                ? option.label
                                                                                : ''}
                                                                        renderInput={(params) => (
                                                                            <TextValidator {...params} placeholder="Vehicle Type"
                                                                                //variant="outlined"
                                                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                                                    <LoonsButton
                                                                        className="mt-2"
                                                                        progress={false}
                                                                        scrollToTop={true}
                                                                    //onClick={this.handleChange}
                                                                    >
                                                                        <span className="capitalize">Filter</span>
                                                                    </LoonsButton>
                                                                </Grid>

                                                            </Grid>
                                                            <Grid item xs={12} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                                                <SubTitle title='Search' />
                                                                <TextValidator className='w-full' placeholder="Search" fullWidth="fullWidth" variant="outlined" size="small"
                                                                    //value={this.state.formData.search} 
                                                                    onChange={(e, value) => {
                                                                        let vehicle_filterData = this.state.vehicle_filterData
                                                                        if (e.target.value != '') {
                                                                            vehicle_filterData.search = e.target.value;
                                                                        } else {
                                                                            vehicle_filterData.search = null
                                                                        }
                                                                        this.setState({ vehicle_filterData })
                                                                        console.log("form dat", this.state.vehicle_filterData)
                                                                    }}

                                                                    onKeyPress={(e) => {
                                                                        if (e.key == "Enter") {
                                                                            // this.LoadOrderItemDetails()
                                                                        }

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
                                                                        )
                                                                    }} />
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={12} className='my-3'>
                                                            {
                                                                this.state.vehicletableDataLoaded
                                                                    ? (
                                                                        <LoonsTable
                                                                            //title={"All Aptitute Tests"}
                                                                            id={'allAptitute'}
                                                                            data={this.state.vehicle_data}
                                                                            columns={this.state.vehicle_columns}
                                                                            options={{
                                                                                pagination: true,
                                                                                serverSide: true,
                                                                                print: false,
                                                                                download: false,
                                                                                viewColumns: false,
                                                                                count: this.state.vehicle_totalitems,
                                                                                rowsPerPage: this.state.vehicle_filterData.limit,
                                                                                page: this.state.vehicle_filterData.page,
                                                                                // onTableChange: (action, tableState) => {
                                                                                //     console.log('trigg', action, tableState)
                                                                                //     switch (action) {
                                                                                //         case 'changePage':
                                                                                //             this.setPage(tableState.page)
                                                                                //             break
                                                                                //         case 'sort':
                                                                                //             //this.sort(tableState.page, tableState.sortOrder);
                                                                                //             break
                                                                                //         default:
                                                                                //             console.log('action not handled.')
                                                                                //     }
                                                                                // }
                                                                            }}></LoonsTable>
                                                                    )
                                                                    : (
                                                                        //load loading effect
                                                                        <Grid className="justify-center text-center w-full pt-12">
                                                                            <CircularProgress size={30} />
                                                                        </Grid>
                                                                    )
                                                            }
                                                        </Grid>
                                                    </ValidatorForm>

                                                </Grid>
                                                {this.state.driverView &&
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}>
                                                                <ValidatorForm>
                                                                    <Grid item xs={12}>
                                                                        <Typography variant='h6' className="font-semibold"> 2. Select Driver</Typography>

                                                                    </Grid>
                                                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <Grid item xs={4} >
                                                                            <SubTitle title='Search' />
                                                                            <TextValidator className='w-full' placeholder="Search" fullWidth="fullWidth" variant="outlined" size="small"
                                                                                //value={this.state.formData.search} 
                                                                                onChange={(e, value) => {
                                                                                    let vehicle_filterData = this.state.vehicle_filterData
                                                                                    if (e.target.value != '') {
                                                                                        vehicle_filterData.search = e.target.value;
                                                                                    } else {
                                                                                        vehicle_filterData.search = null
                                                                                    }
                                                                                    this.setState({ vehicle_filterData })
                                                                                    console.log("form dat", this.state.vehicle_filterData)
                                                                                }}

                                                                                onKeyPress={(e) => {
                                                                                    if (e.key == "Enter") {
                                                                                        // this.LoadOrderItemDetails()
                                                                                    }

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
                                                                                    )
                                                                                }} />
                                                                        </Grid>

                                                                    </Grid>
                                                                </ValidatorForm>
                                                                <Grid item xs={12}>
                                                                    {
                                                                        this.state.drivertableDataLoaded
                                                                            ? (
                                                                                <LoonsTable
                                                                                    //title={"All Aptitute Tests"}
                                                                                    id={'allAptitute'}
                                                                                    data={this.state.driver_data}
                                                                                    columns={this.state.driver_columns}
                                                                                    options={{
                                                                                        pagination: true,
                                                                                        serverSide: true,
                                                                                        print: false,
                                                                                        download: false,
                                                                                        viewColumns: false,
                                                                                        count: this.state.driver_totalitems,
                                                                                        rowsPerPage: 10,
                                                                                        page: 0,
                                                                                        // onTableChange: (action, tableState) => {
                                                                                        //     console.log('trigg', action, tableState)
                                                                                        //     switch (action) {
                                                                                        //         case 'changePage':
                                                                                        //             this.setPage(tableState.page)
                                                                                        //             break
                                                                                        //         case 'sort':
                                                                                        //             //this.sort(tableState.page, tableState.sortOrder);
                                                                                        //             break
                                                                                        //         default:
                                                                                        //             console.log('action not handled.')
                                                                                        //     }
                                                                                        // }
                                                                                    }}></LoonsTable>
                                                                            )
                                                                            : (
                                                                                //load loading effect
                                                                                <Grid className="justify-center text-center w-full pt-12">
                                                                                    <CircularProgress size={30} />
                                                                                </Grid>
                                                                            )
                                                                    }
                                                                </Grid>
                                                            </Grid>
                                                            {/* <Divider orientation="vertical" flexItem /> */}
                                                            <Grid item xs={6}>

                                                                <ValidatorForm>
                                                                    <Grid item xs={12}>
                                                                        <Typography variant='h6' className="font-semibold"> 3. Select Helper</Typography>

                                                                    </Grid>
                                                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <Grid item xs={4} >
                                                                            <SubTitle title='Search' />
                                                                            <TextValidator className='w-full' placeholder="Search" fullWidth="fullWidth" variant="outlined" size="small"
                                                                                //value={this.state.formData.search} 
                                                                                onChange={(e, value) => {
                                                                                    let vehicle_filterData = this.state.vehicle_filterData
                                                                                    if (e.target.value != '') {
                                                                                        vehicle_filterData.search = e.target.value;
                                                                                    } else {
                                                                                        vehicle_filterData.search = null
                                                                                    }
                                                                                    this.setState({ vehicle_filterData })
                                                                                    console.log("form dat", this.state.vehicle_filterData)
                                                                                }}

                                                                                onKeyPress={(e) => {
                                                                                    if (e.key == "Enter") {
                                                                                        // this.LoadOrderItemDetails()
                                                                                    }

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
                                                                                    )
                                                                                }} />
                                                                        </Grid>

                                                                    </Grid>
                                                                </ValidatorForm>
                                                                <Grid item xs={12}>
                                                                    {
                                                                        this.state.helpertableDataLoaded
                                                                            ? (
                                                                                <LoonsTable
                                                                                    //title={"All Aptitute Tests"}
                                                                                    id={'allAptitute'}
                                                                                    data={this.state.helper_data}
                                                                                    columns={this.state.Helper_columns}
                                                                                    options={{
                                                                                        pagination: true,
                                                                                        serverSide: true,
                                                                                        print: false,
                                                                                        download: false,
                                                                                        viewColumns: false,
                                                                                        count: this.state.helper_totalitems,
                                                                                        rowsPerPage: 10,
                                                                                        page: 0,
                                                                                        // onTableChange: (action, tableState) => {
                                                                                        //     console.log('trigg', action, tableState)
                                                                                        //     switch (action) {
                                                                                        //         case 'changePage':
                                                                                        //             this.setPage(tableState.page)
                                                                                        //             break
                                                                                        //         case 'sort':
                                                                                        //             //this.sort(tableState.page, tableState.sortOrder);
                                                                                        //             break
                                                                                        //         default:
                                                                                        //             console.log('action not handled.')
                                                                                        //     }
                                                                                        // }
                                                                                    }}></LoonsTable>
                                                                            )
                                                                            : (
                                                                                //load loading effect
                                                                                <Grid className="justify-center text-center w-full pt-12">
                                                                                    <CircularProgress size={30} />
                                                                                </Grid>
                                                                            )
                                                                    }
                                                                </Grid>
                                                            </Grid>
                                                            {
                                                                this.state.summaryView &&
                                                                <Grid item xs={12}>
                                                                    <Typography variant='h6' className="font-semibold"> Vehicle Summary</Typography>
                                                                    <Divider />
                                                                    {
                                                                        this.state.summaryDataLoaded
                                                                            ? (
                                                                                <LoonsTable
                                                                                    //title={"All Aptitute Tests"}
                                                                                    id={'allAptitute'}
                                                                                    data={this.state.summary_data}
                                                                                    columns={this.state.summary_columns}
                                                                                    options={{
                                                                                        pagination: false,
                                                                                        serverSide: true,
                                                                                        print: false,
                                                                                        download: false,
                                                                                        viewColumns: false
                                                                                        // count: this.state.totalItems,
                                                                                        // rowsPerPage: this.state.filterData.limit,
                                                                                        // page: this.state.filterData.page,
                                                                                        // onTableChange: (action, tableState) => {
                                                                                        //     console.log('trigg', action, tableState)
                                                                                        //     switch (action) {
                                                                                        //         case 'changePage':
                                                                                        //             this.setPage(tableState.page)
                                                                                        //             break
                                                                                        //         case 'sort':
                                                                                        //             //this.sort(tableState.page, tableState.sortOrder);
                                                                                        //             break
                                                                                        //         default:
                                                                                        //             console.log('action not handled.')
                                                                                        //     }
                                                                                        // }
                                                                                    }}></LoonsTable>
                                                                            )
                                                                            : (
                                                                                //load loading effect
                                                                                <Grid className="justify-center text-center w-full pt-12">
                                                                                    <CircularProgress size={30} />
                                                                                </Grid>
                                                                            )
                                                                    }
                                                                </Grid>
                                                            }
                                                            <Grid item xs={12}>
                                                                {
                                                                    this.state.pickUpDialogView &&
                                                                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                                                        <Grid item lg={1} md={1} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <LoonsButton
                                                                                // color="success"
                                                                                className="mt-2"
                                                                                progress={false}
                                                                                type="submit"
                                                                                scrollToTop={true}
                                                                            //onClick={this.handleChange}
                                                                            >
                                                                                <span className="capitalize">Save</span>
                                                                            </LoonsButton>
                                                                        </Grid>
                                                                        <Grid item lg={1} md={1} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <LoonsButton
                                                                                color="secondary"
                                                                                className="mt-2"
                                                                                progress={false}
                                                                                // type="submit"
                                                                                scrollToTop={true}
                                                                                onClick={() => this.handleCancel()}
                                                                            >
                                                                                <span className="capitalize">Cancel</span>
                                                                            </LoonsButton>
                                                                        </Grid>
                                                                    </div>

                                                                }



                                                            </Grid>
                                                        </Grid>

                                                    </>}

                                            </Grid>
                                        </LoonsCard>
                                    </div>
                                }
                            </ValidatorForm>
                        </MainContainer>
                    </div>
                    : null}
                {/* Content End */}

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

export default withStyles(styleSheet)(MDS_AddPickUpPerson)
