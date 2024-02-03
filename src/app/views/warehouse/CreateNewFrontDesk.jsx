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
    Stepper
} from '@material-ui/core';
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
import DepartmentTypeService from 'app/services/DepartmentTypeService'
import EmployeeServices from 'app/services/EmployeeServices'
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
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';


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


class CreateNewFrontDesk extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allDataStorePharmacy: [],
            allDepartments: [],
            alert: false,
            message: '',
            severity: 'success',
            totalItems: 0,
            totalPages: 0,
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
                levels: []
            },
            empType: [
                {
                    type: 'Front Desk'
                },
                {
                    type: 'Front Desk Admin'
                }
            ],
            owner_id: null,
            loaded: false,
            data: {},
            filterData: {
                page: 0,
                limit: 20,
                issuance_type: 'Front Desk'
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
                            return (<p>{this.state.empData[tableMeta.rowIndex].Employee.name}</p>)
                        },
                    },
                },
                {
                    name: 'designation', // field name in the row object
                    label: 'Designation', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p>{this.state.empData[tableMeta.rowIndex].Employee.designation}</p>)
                        },
                    },
                },
                {
                    name: 'type', // field name in the row object
                    label: 'Type', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p>{this.state.empData[tableMeta.rowIndex].Employee.type}</p>)
                        },
                    },
                },
                {
                    name: 'nic', // field name in the row object
                    label: 'NIC', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p>{this.state.empData[tableMeta.rowIndex].Employee.nic}</p>)
                        },
                    },
                },
                {
                    name: 'contact_no', // field name in the row object
                    label: 'Contact Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p>{this.state.empData[tableMeta.rowIndex].Employee.contact_no}</p>)
                        },
                    },
                },
                {
                    name: 'email', // field name in the row object
                    label: 'Email', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p>{this.state.empData[tableMeta.rowIndex].Employee.email}</p>)
                        },
                    },
                },
                // {
                //     name: 'address', // field name in the row object
                //     label: 'Address', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (<p>{this.state.empData[tableMeta.rowIndex].address}</p>)
                //         },
                //     },
                // },
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
            empData: [],
            conformingDialog: false,
            /* empType: [
                {
                    type: 'Front Desk'
                }
            ], */
            empFormData: {
                employee_id: null,
                pharmacy_drugs_stores_id: this.props.match.params.id,
                type: '',
                main: false,

                personal: false
            },
            allEmpData: []
        }
    }

    async createNewEmployee() {
        console.log(this.state.empFormData)
        let res = await EmployeeServices.createNewAssignEmployee(this.state.empFormData);
        if (res.status === 201) {
            this.setState({
                alert: true,
                message: 'Employee assigned successfully!',
                severity: 'success',
            },()=>{
                this.loadData()
            })
        } else {
            this.setState({
                alert: true,
                message: 'Employee assign was unsuccessful!',
                severity: 'error',
            })
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        const query = new URLSearchParams(this.props.location.search);
        const owner_id = query.get('owner_id')

        let allFrontDesks = await PharmacyService.getPharmacyById(this.props.match.params.id, owner_id, {
            limit: 20,
            page: 0,
            issuance_type: 'Clinic'
        })

        console.log("Front Desk: ", allFrontDesks);

        if (allFrontDesks.status == 200) {
            console.log(allFrontDesks)
            this.setState({
                loaded: true,
                data: allFrontDesks.data.view,
                totalPages: allFrontDesks.data.view.totalPages,
                totalItems: allFrontDesks.data.view.totalItems,
            })
            console.log(this.state.data);
        }

        let employees = await EmployeeServices.getAsignEmployees({ pharmacy_drugs_stores_id: this.props.match.params.id })
        console.log(employees)
        if (employees.status == 200) {
            this.setState({
                loaded: true,
                empData: employees.data.view.data
            })

            console.log(this.state.empData);
        }

     
    }

    async loadEmployees(type){


        let hospital = await localStorageService.getItem("login_user_pharmacy_drugs_stores")
        let created_location_id = hospital[0].pharmacy_drugs_stores_id;

           let allEmployees = await EmployeeServices.getEmployees({ type: type,created_location_id:created_location_id })
        if (allEmployees.status == 200) {
            this.setState({
                empLoaded: true,
                allEmpData: allEmployees.data.view.data
            })

            console.log(this.state.empData);
        }
    }

    clearFields() {
        this.setState({
            formData: {
                store_id: '',
                name: '',
                department_id: '',
                store_type: 'N/A',
                issuance_type: 'Front Desk',
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

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={this.state.data.name + "\tFront Desk"} />
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
                                            placeholder="Front Desk ID"
                                            name="store_id"
                                            InputLabelProps={{ shrink: false }}
                                            // value={this.state.data.store_id}
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

                                    <Grid
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
                            {this.state.loaded &&
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
                                                        this.setPage(tableState.page)
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
                                maxWidth={"md"} fullWidth={true}
                                open={this.state.conformingDialog}
                                onClose={() => {
                                    this.setState({ conformingDialog: false })
                                }}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                {/* <DialogTitle id="alert-dialog-title">{"Add Employee"}</DialogTitle> */}
                                  <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                                    <CardTitle title="Add Employee" />

                                    <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ conformingDialog: false }) }}>
                                        <CloseIcon />
                                    </IconButton>

                                </MuiDialogTitle>

                                <DialogContent>
                                    
                                <Grid className=" w-full" item lg={12} md={12} sm={12} xs={12}>
                                        <SubTitle title="Employee Type" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.empType}
                                            onChange={(e, value, r) => {
                                                if (null != value) {
                                                    let empFormData = this.state.empFormData
                                                    empFormData.type = value.type
                                                    this.setState({ empFormData })
                                                    this.loadEmployees(value.type)
                                                }
                                            }}
                                            getOptionLabel={
                                                (option) => option.type
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

                                <Grid className=" w-full" item lg={12} md={12} sm={12} xs={12}>
                                        <SubTitle title="Employee Name" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.allEmpData}
                                            onChange={(e, value, r) => {
                                                if (null != value) {
                                                    let empFormData = this.state.empFormData
                                                    empFormData.employee_id = value.id
                                                    this.setState({ empFormData })
                                                }
                                            }}
                                            getOptionLabel={
                                                (option) => option.name
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Employee"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.empFormData.employee_id}
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                />
                                            )}
                                        />
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
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(CreateNewFrontDesk)
