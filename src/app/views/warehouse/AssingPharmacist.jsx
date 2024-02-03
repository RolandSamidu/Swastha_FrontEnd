import {
    FormControlLabel,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Step,
    StepButton,
    StepLabel,
    Stepper,
    Tabs,
    Tab
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';

import { withStyles } from '@material-ui/core/styles'
import { Autocomplete } from '@material-ui/lab'
import {
    Button,
    CardTitle,
    CheckboxValidatorElement,
    LoonsCard,
    LoonsSnackbar,
    MainContainer,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import DepartmentService from 'app/services/DepartmentService'
import ChildWarehouse from '../warehouse/ChildWarehouse'
import EmployeeServices from 'app/services/EmployeeServices'
import ClinicService from 'app/services/ClinicService';
import localStorageService from 'app/services/localStorageService'
import PharmacyService from 'app/services/PharmacyService'
import 'date-fns'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import LoonsTable from "../../components/LoonsLabComponents/Table/LoonsTable";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from '@material-ui/icons/Visibility';
import LoonsDatePicker from 'app/components/LoonsLabComponents/DatePicker';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Moment from 'moment';


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

class AssingPharmacist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            counterPharmacist:false,
            activeTab:0,
            allDataStorePharmacy: [],
            allDepartments: [],
            alert: false,
            message: '',
            severity: 'success',
            totalItems: 0,
            totalPages: 0,
            owner_id:null,
            totalPagesClinicDays: 0,
            totalItemClinicDays: 0,

            allHigherLevels: [
                { name: 'level1', id: 1 },
                { name: 'lavel2', id: 2 },
                { name: 'lavel3', id: 3 },
            ],
            formData: {
                store_id: '',
                name: '',
                department_id: null,
                store_type: 'N/A',
                issuance_type: 'Clinic',
                location: '',
                is_clinic: true,
                short_reference: null,
                clinic_no_prefix: null,
                description: null,
                levels: [],

            },
            owner_id: null,
            loaded: false,
            data: {},
            employeeFilterData: {
                type: ['Admin Pharmacist', 'Counter Pharmacist', 'Cheif Pharmacist','Dispenser']
            },
            filterData: {
                page: 0,
                limit: 20,
                issuance_type: 'pharmacy'
            },
            columns: [
                {
                    name: 'id',
                    label: 'id',
                    options: {
                        //filter: true,
                        display: false,
                    },
                },
                {
                    name: 'name', // field name in the row object
                    label: 'Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p> {this.state.empData[tableMeta.rowIndex].Employee.name} </p>)
                        },
                    },
                },
                {
                    name: 'designation', // field name in the row object
                    label: 'Designation', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p> {this.state.empData[tableMeta.rowIndex].Employee.designation} </p>)
                        },
                    },
                },
                {
                    name: 'type', // field name in the row object
                    label: 'Type', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p> {this.state.empData[tableMeta.rowIndex].Employee.type} </p>)
                        },
                    },
                },
                {
                    name: 'nic', // field name in the row object
                    label: 'NIC', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p> {this.state.empData[tableMeta.rowIndex].Employee.nic} </p>)
                        },
                    },
                },
                {
                    name: 'contact_no', // field name in the row object
                    label: 'Contact Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p> {this.state.empData[tableMeta.rowIndex].Employee.contact_no} </p>)
                        },
                    },
                },
                {
                    name: 'email', // field name in the row object
                    label: 'Email', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p> {this.state.empData[tableMeta.rowIndex].Employee.email} </p>)
                        },
                    },
                },
                {
                    name: 'address', // field name in the row object
                    label: 'Address', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p> {this.state.empData[tableMeta.rowIndex].Employee.address} </p>)
                        },
                    },
                },
                // {
                //     name: "action",
                //     label: "Action",
                //     options: {
                //         filter: false,
                //         sort: false,
                //         empty: true,
                //         print: false,
                //         download: false,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <Grid className="flex items-center">
                //                     <Tooltip title="View">
                //                         <IconButton
                //                             className="px-2"
                //                             onClick={() => {
                //                                 // console.log(this.state.data[tableMeta.rowIndex])
                //                             }}
                //                             size="small"
                //                             aria-label="view"
                //                         >
                //                             <VisibilityIcon color='primary' />
                //                         </IconButton>
                //                     </Tooltip>
                //                 </Grid>
                //             );
                //         }

                //     }
                // }
            ],
            clinicDaysColumn: [
                {
                    name: 'id',
                    label: 'id',
                    options: {
                        //filter: true,
                        display: false,
                    },
                },
                {
                    name: 'day', // field name in the row object
                    label: 'Day', // column title that will be shown in table
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'from', // field name in the row object
                    label: 'From', // column title that will be shown in table
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'to', // field name in the row object
                    label: 'To', // column title that will be shown in table
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'first_visits', // field name in the row object
                    label: 'First Visits', // column title that will be shown in table
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'second_visits', // field name in the row object
                    label: 'Second Visits', // column title that will be shown in table
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'regular_visits', // field name in the row object
                    label: 'Regular visits', // column title that will be shown in table
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'total_visits', // field name in the row object
                    label: 'Total Visits', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            let total = parseInt(this.state.clinicDayData[tableMeta.rowIndex].first_visits) + parseInt(this.state.clinicDayData[tableMeta.rowIndex].second_visits) + parseInt(this.state.clinicDayData[tableMeta.rowIndex].regular_visits)
                            console.log('total', total)
                            if (total === 0 || total === ' ' || total === NaN) {
                                return 'N/A'
                            } else {
                                return total
                            }

                        },
                    },
                },

                {
                    name: "action",
                    label: "Action",
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        display: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="View">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                // console.log(this.state.data[tableMeta.rowIndex])
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            );
                        }

                    }
                }
            ],
            empData: [],
            conformingDialog: false,
            conformingClinicDialog: false,
            empType: [
                {
                    type: 'Admin Pharmacist'
                },
                {
                    type: 'Counter Pharmacist'
                },
                {
                    type: 'Dispenser'
                },
               /*  {
                    type: 'Cheif Pharmacist'
                } */

            ],
            empFormData: {
                employee_id: "",
                pharmacy_drugs_stores_id: this.props.match.params.id,
                type: '',
                main: true,
                personal: false
            },
            empLoaded: false,
            clinicDaysLoaded: false,
            fromTime: new Date(),
            toTime: new Date(),
            day: '',
            days: [
                {
                    name: 'Sunday'
                },
                {
                    name: 'Monday'
                },
                {
                    name: 'Tuesday'
                },
                {
                    name: 'Wednesday'
                },
                {
                    name: 'Thrusday'
                },
                {
                    name: 'Friday'
                },
                {
                    name: 'Saturday'
                },
            ],
            clinicDaysFormData: {
                day: '',
                from: new Date(),
                to: new Date(),
                pharmacy_drugs_stores_id: this.props.match.params.id,
                first_visits: 0,
                second_visits: 0,
                regular_visits: 0,
            },
            allEmpData: []
        }
    }
    async loadAllEmployees() {
        let hospital = await localStorageService.getItem("login_user_pharmacy_drugs_stores")
        let employeeFilterData = this.state.employeeFilterData
        employeeFilterData.created_location_id=hospital[0].pharmacy_drugs_stores_id;
        this.setState({ loaded: false })
        let res = await EmployeeServices.getEmployees(employeeFilterData)
        console.log('all pharmacist', res.data.view.data)
        if (200 == res.status) {
            this.setState({
                allEmpData: res.data.view.data,
                loaded: true,
            })
        }
    }

    async loadData() {
        this.setState({
            clinicDaysLoaded: false,
            empLoaded: false
        })
        console.log("id: " + this.props.match.params.id)
        let filterData = this.state.filterData;
        const query = new URLSearchParams(this.props.location.search);
        const owner_id = query.get('owner_id')

        let allClinics = await PharmacyService.getPharmacyById(this.props.match.params.id, owner_id, filterData)

        console.log("all clinic: ", allClinics);

        if (allClinics.status == 200) {
            console.log(allClinics)
            this.setState({
                loaded: true,
                data: allClinics.data.view,
                totalPages: allClinics.data.view.totalPages,
                totalItems: allClinics.data.view.totalItems,
            })
            console.log("Clinic", this.state.data);
        }



        const userId = await localStorageService.getItem('userInfo').id
        console.log('user id: ' + userId)
        let employees = await EmployeeServices.getAsignEmployees({ pharmacy_drugs_stores_id: this.props.match.params.id })
        console.log(employees)
        if (employees.status == 200) {
            this.setState({
                empLoaded: true,
                empData: employees.data.view.data
            })

            console.log(this.state.empData);
        }

        // let allEmployees = await EmployeeServices.getEmployees({ type: ['Consultant', 'Doctor'] })
        // if (allEmployees.status == 200) {
        //     this.setState({
        //         empLoaded: true,
        //         allEmpData: allEmployees.data.view.data
        //     })

        //     console.log(this.state.empData);
        // }

    }

    clearFields() {
        this.setState({
            formData: {
                store_id: '',
                name: '',
                department_id: '',
                store_type: 'N/A',
                issuance_type: 'Clinic',
                location: '',
                is_clinic: true,
                short_reference: '',
                clinic_no_prefix: null,
                description: '',
                levels: []
            },
        })
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        console.log("id: ", id);
        this.loadData()

        const qparams = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        this.setState({
            owner_id:qparams.owner_id
        })
    }

    //Change the state based on the checkbox change
    handleChange = (val) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [val.target.name]: val.target.checked,
            },
        })
    }

    async createNewEmployee() {
        console.log(this.state.empFormData)
        let res = await EmployeeServices.createNewAssignEmployee(this.state.empFormData);
        if (res.status === 201) {
            this.setState({
                alert: true,
                message: 'Employee assigned successfully!',
                severity: 'success',
            }, () => {
                window.location.reload()
            })
        } else {
            this.setState({
                alert: true,
                message: 'Employee assign was unsuccessful!',
                severity: 'error',
            })
        }
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        console.log(page)
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }


    handleFromTimeChange = (time) => {
        console.log(time);
        this.setState({
            fromTime: time
        })
    }

    handleToTimeChange = (time) => {
        console.log(Moment(time).format('H:mm'))

        // console.log(new Date(time).toISOString())
        this.setState({
            toTime: time
        })
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={this.state.data.name} />
                        <div className="w-full">
                            <ValidatorForm
                                className="pt-2"
                            >
                                <Grid container spacing={1} className="flex ">
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Hospitals" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Pharmacy ID"
                                            name="store_id"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data.name}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Category/ Type" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Category/ Type"
                                            name="store_id"
                                            value={this.state.data.issuance_type}
                                            InputLabelProps={{ shrink: false }}
                                            // value={this.state.data.store_id}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            // onChange={(e) => {
                                            //     let formData =
                                            //         this.state.formData
                                            //     formData.store_id =
                                            //         e.target.value
                                            //     this.setState({ formData })
                                            // }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>

                                    {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Clinic Name" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Clinic Name"
                                            name="store_name"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data.name}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            // onChange={(e) => {
                                            //     let formData =
                                            //         this.state.formData
                                            //     formData.name = e.target.value
                                            //     this.setState({ formData })
                                            // }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid> */}

                                    {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Clinic number suffix" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Clinic Name"
                                            name="store_name"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data.clinic_no_prefix}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            // onChange={(e) => {
                                            //     let formData =
                                            //         this.state.formData
                                            //     formData.name = e.target.value
                                            //     this.setState({ formData })
                                            // }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>
 */}
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Description" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Description"
                                            name="description"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data.description}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            // onChange={(e) => {
                                            //     let formData =
                                            //         this.state.formData
                                            //     formData.short_reference = e.target.value
                                            //     this.setState({ formData })
                                            // }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Short Reference" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Short Ref"
                                            name="short_reference"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data.short_reference}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        // onChange={(e) => {
                                        //     let formData =
                                        //         this.state.formData
                                        //     formData.location =
                                        //         e.target.value
                                        //     this.setState({ formData })
                                        // }}
                                        /*  validators={['required']}
                                     errorMessages={[
                                         'this field is required',
                                     ]} */
                                        />
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                        </div>
                    </LoonsCard>
                    <LoonsCard>
                      
                    
                      <AppBar position="static" color="default" className="mb-4">
                      <Grid item lg={12} md={12} xs={12}>
                          <Tabs
                              style={{ minHeight: 39, height: 26 }}
                              indicatorColor="primary"
                              textColor="primary"
                              variant="fullWidth"
                              value={this.state.activeTab}
                              onChange={(event, newValue) => {
                                  // console.log(newValue)
                                  this.setState({ activeTab: newValue })
                              }} >

                              <Tab label={<span className="font-bold text-12">Assign Employees</span>} />
                              <Tab label={<span className="font-bold text-12">Child Warehouse</span>} />

                          </Tabs>
                      </Grid>
                      </AppBar>
                      <main>

                                  <Fragment>
                                      {
                                          this.state.activeTab == 0 ?
                                              <div className='w-full'>
                                                                    <Grid style={{ marginTop: 20 }}>
                        < LoonsCard>
                            <Grid className=" w-full"
                                item
                                lg={6}
                                md={6}
                                sm={12}
                                xs={12}
                            >
                                <Button
                                    className="mt-6"
                                    progress={false}
                                    scrollToTop={true}
                                    startIcon="save"
                                    onClick={() => {
                                        console.log('press!')
                                        this.setState({ conformingDialog: true })
                                    }}
                                >
                                    <span className="capitalize">Assign employee</span>
                                </Button>
                            </Grid>
                            {this.state.empLoaded &&
                                <div className="mt-0">
                                    <LoonsTable
                                        id={"assignEmployees"}
                                        data={this.state.empData}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: 20,
                                            page: this.state.filterData.page,

                                            onTableChange: (action, tableState) => {
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setClinicDaysPage(tableState.page)
                                                        break
                                                    case 'sort':
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    >{ }</LoonsTable>
                                </div>
                            }
                        </LoonsCard>
                    </Grid>

                                              </div> : null
                                      }
                                     {
                                          this.state.activeTab == 1 ?
                                              <div className='w-full'>
                                                  <ChildWarehouse id ={this.props.match.params.id} owner_id={this.state.owner_id}/>
                                              </div> : null
                                      }
                                     
                                  </Fragment>

                      </main>

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
                <ValidatorForm
                    className="pt-2"
                >
                    <Grid container spacing={1} className="flex ">
                        <Grid
                            className=" w-full"
                            item
                            lg={6}
                            md={6}
                            sm={12}
                            xs={12}
                        >

                            <Dialog
                                maxWidth={"lg"} fullWidth={true}
                                open={this.state.conformingDialog}
                                onClose={() => {
                                    this.setState({ conformingDialog: false })
                                }}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >

                                <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                                    <CardTitle title="Add Employee" />

                                    <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ conformingDialog: false }) }}>
                                        <CloseIcon />
                                    </IconButton>

                                </MuiDialogTitle>
                                {/* <DialogTitle id="alert-dialog-title">{"Add Employee"}</DialogTitle>
                                <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ conformingDialog: false }) }}>
        <CloseIcon />
    </IconButton> */}
                                <DialogContent>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Employee Type" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.empType}
                                            onChange={(e, value, r) => {
                                                if (null != value) {
                                                    let empFormData = this.state.empFormData
                                                    empFormData.type =value.type
                                                    let employeeFilterData =this.state.employeeFilterData
                                                    employeeFilterData.type =value.type
                                                    if(value.type === 'Counter Pharmacist'||value.type === 'Dispenser'){
                                                        empFormData.main = false
                                                        empFormData.personal = true
                                                        this.setState({
                                                            empFormData,
                                                            counterPharmacist : true
                                                        })
                                                    }
                                                    else{
                                                        empFormData.main = true
                                                        empFormData.personal = false
                                                        this.setState({
                                                            empFormData,
                                                            counterPharmacist : false
                                                        })
                                                    }

                                                    this.setState(
                                                        {
                                                            employeeFilterData:employeeFilterData,
                                                            // empFormData,
                                                        },
                                                        () => {
                                                            this.loadAllEmployees()
                                                        }
                                                    )
                                                }
                                            }}
                                            getOptionLabel={(option) =>
                                                option.type
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Employee Type"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>
                                </DialogContent>
                                <DialogContent>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Employee Name" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={
                                                this.state.allEmpData
                                            }
                                            onChange={(e, value, r) => {
                                                console.log(
                                                    'value',
                                                    value
                                                )
                                                if (null != value) {
                                                    let empFormData =
                                                        this.state
                                                            .empFormData
                                                    empFormData.employee_id =
                                                        value.id
                                                    this.setState({
                                                        empFormData,
                                                    })
                                                }
                                            }}
                                            getOptionLabel={(option) =>
                                                option.name
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Employee"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>


                                    <Grid
                                        className=" w-full mt-2"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Accessible Warehouses" />

                                        <Grid
                                            container
                                            spacing={1}
                                            className="flex"
                                        >
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    disabled={this.state.counterPharmacist}
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={() => {
                                                                let empFormData = this.state.empFormData;
                                                                empFormData.main = !empFormData.main;
                                                                //empFormData.personal = false;
                                                                this.setState({ empFormData })
                                                            }

                                                            }
                                                            checked={this.state.empFormData.main}
                                                            name="main"
                                                            value="main"
                                                        />
                                                    }
                                                    label="Main Warehouse"
                                                />
                                            </Grid>

                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={() => {
                                                                let empFormData = this.state.empFormData;
                                                                //empFormData.main = false;
                                                                empFormData.personal = !empFormData.personal;
                                                                this.setState({ empFormData })
                                                            }
                                                            }
                                                            checked={this.state.empFormData.personal}
                                                            name="Personal"
                                                            value="personal"
                                                        />
                                                    }
                                                    label="Personal Warehouse"
                                                />
                                            </Grid>


                                        </Grid>
                                    </Grid>




                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                        onClick={() => {
                                            this.createNewEmployee()
                                        }}
                                    >
                                        <span className="capitalize">Save</span>
                                    </Button>

                                </DialogActions>

                            </Dialog>
                        </Grid>
                    </Grid>
                </ValidatorForm>
                <ValidatorForm
                    className="pt-2"
                >

                </ValidatorForm>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(AssingPharmacist)
