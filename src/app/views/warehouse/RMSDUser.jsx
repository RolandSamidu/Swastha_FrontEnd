
import React, { Component, Fragment } from "react";
import { Button, CardTitle, LoonsCard, MainContainer, SubTitle, LoonsTable, LoonsSwitch, LoonsSnackbar } from "../../components/LoonsLabComponents";
import {
    Grid, Tooltip, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { MatxLayoutSettings } from "app/components/MatxLayout/settings";
import { withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";
import EmployeeServices from 'app/services/EmployeeServices'

import VehicleService from "app/services/VehicleService";

import * as appConst from '../../../appconst';
import localStorageService from "app/services/localStorageService";


const drawerWidth = 270;
let activeTheme = MatxLayoutSettings.activeTheme;

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
    }
})

class RMSDUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            processing: false,
            loaded: false,
            totalItems: 0,
            totalPages: 0,
            filterData: {
                page: 0,
                limit: 20,
                'order[0]': [
                    'createdAt', 'DESC'
                ],
                type: appConst.rmsd_user_type.map(a => a.type)
            },

            alert: false,
            message: "",
            severity: 'success',

            statusChangeRow: null,
            conformingDialog: false,

            otherTypes_formData: null,
            otherTypes_dialog: false,

            buttonName: "Save",

            data: [],
            columns: [
                {
                    name: 'employee_id',
                    label: 'User ID',
                    options: {
                        //filter: true,
                        display: false,
                    },
                },
                {
                    name: 'designation',
                    label: 'Designation',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'name',
                    label: 'Name',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'nic',
                    label: 'NIC',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'contact_no',
                    label: 'Contact Number',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'email',
                    label: 'Email',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'address',
                    label: 'Address',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'username',
                    label: 'User Name',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'id',
                    label: 'id',
                    options: {
                        //filter: true,
                        display: false,
                    },
                },
                {
                    name: 'designation',
                    label: 'designation',
                    options: {
                        //filter: true,
                        display: false,
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log(tableMeta);
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="Edit">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => { this.setDataToFields(tableMeta.tableData[tableMeta.rowIndex]); }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>

                                    {/* <Tooltip title="Add Additional Roles">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                console.log("seleced user", tableMeta.tableData[tableMeta.rowIndex])
                                                let selected_data = tableMeta.tableData[tableMeta.rowIndex];
                                                let otherTypes_formData = {
                                                    type: selected_data.type,
                                                    default_type: selected_data.type,
                                                    username: selected_data.username,
                                                    additional_type: true,
                                                    id:selected_data.id
                                                }

                                                this.setState({
                                                    otherTypes_formData: otherTypes_formData,
                                                    otherTypes_dialog: true
                                                },()=>{console.log("formData",this.state.otherTypes_formData)})
                                                
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <AssignmentIndIcon color="primary" />
                                        </IconButton>
                                    </Tooltip> */}


                                    <Grid className="px-2">
                                        <Tooltip title="Change Status">
                                            <LoonsSwitch
                                                checked={
                                                    this.state.data[
                                                        tableMeta.rowIndex
                                                    ].status == 'Active'
                                                        ? true
                                                        : false
                                                }

                                                color="primary"
                                                onChange={() => {
                                                    this.toChangeStatus(
                                                        tableMeta.rowIndex
                                                    )
                                                }}
                                            />
                                        </Tooltip>
                                    </Grid>
                                </Grid >
                            )
                        },
                    },
                },
            ],
            formData: {
                name: "",
                designation: "",
                type: "",
                employee_id: "",
                nic: "",
                contact_no: "",
                email: "",
                address: "",
                status: "",
                username: null,
                created_location_id: null
            },
            empFormData: {
                employee_id: "",
                pharmacy_drugs_stores_id: null,
                type: '',
                main: false,
                personal: false
            },
        }
    }

    async componentDidMount() {

        let hospital = await localStorageService.getItem("main_hospital_id")
        let filterData = this.state.filterData;
        filterData.created_location_id = hospital
        this.setState({
            filterData
        }, () => {
            this.loadData();
            this.getLoginedHospital()
        })
    }

    // vehicle user save api call
    async saveVehicleUser() {
        let formData = this.state.formData;
        this.setState({ processing: true })
        let res1 = await VehicleService.createNewVehicleUser(formData);
        if (res1.status == 201) {
            if (formData.type == 'RMSD OIC') {

                let empFormData = this.state.empFormData;
                empFormData.type = formData.type;
                console.log("res data", res1.data)
                empFormData.employee_id = res1.data.posted.data.id;
                empFormData.main = true;

                console.log(empFormData)
                let res = await EmployeeServices.createNewAssignEmployee(empFormData);
                if (res.status === 201) {
                    this.setState({
                        alert: true,
                        message: 'Employee assigned successfully!',
                        severity: 'success',
                        processing: false
                    }, () => {

                        this.loadData();
                        this.resetFields();
                    })
                } else {
                    this.setState({
                        alert: true,
                        message: 'Employee assign was unsuccessful!',
                        severity: 'error',
                        processing: false
                    })
                }

            }

            this.setState({ alert: true, message: "User Save Successful", severity: 'success', processing: false })
            this.loadData();
            this.resetFields();
        } else {
            this.setState({ alert: true, message: "User Save Unsuccessful", severity: 'error', processing: false })
        }
    }

    // vehicle user get api call
    async loadData() {
        this.setState({ loaded: false })
        let user_res = await VehicleService.getVehicleUsers(this.state.filterData);
        if (user_res.status == 200) {
            this.setState({
                loaded: true,
                data: user_res.data.view.data,
                totalPages: user_res.data.view.totalPages,
                totalItems: user_res.data.view.totalItems,
            },
                () => {
                    this.render()
                })
        }
    }

    //Change paginations
    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }

    // set table data to form when edit button
    setDataToFields(row) {
        this.setState({
            formData: row,
            buttonName: "Update"
        },
            () => {
                this.render()
            })
    }


    // Change user status
    async changeStatus(row) {
        console.log('comming data', this.state.data[row])
        let data = this.state.data[row]
        let statusChange = {
            "status": data.status == "Deactive" ? "Active" : "Deactive"
        }
        let res = await VehicleService.changeVehicleUserStatus(
            data.id,
            statusChange
        )
        console.log('res', res)
        if (res.status == 200) {
            this.setState(
                {
                    alert: true,
                    severity: 'success',
                    message: 'Successfully changed the status',
                },
                () => {
                    this.loadData()
                }
            )
        } else {
            this.setState(
                {
                    alert: true,
                    severity: 'error',
                    message: 'Cannot change the status',
                },
                () => {
                    console.log('ERROR UpDate')
                }
            )
        }
    }

    async toChangeStatus(row) {
        this.setState({
            statusChangeRow: row,
            conformingDialog: true
        })
    }

    async agreeToChangeStatus() {
        this.changeStatus(this.state.statusChangeRow)
        this.setState({ conformingDialog: false })
    }

    //update vehicle user details
    async updateVehicleUser() {
        let formData = this.state.formData;

        let res = await VehicleService.updateVehicleUser(formData);
        if (res.status == 200) {
            this.setState({ alert: true, message: "User Update Successful", severity: 'success', buttonName: "Save" })
            this.loadData();
            this.resetFields();
        } else {
            this.setState({ alert: true, message: "User Update Unsuccessful", severity: 'error' })
        }
    }

    resetFields() {
        this.setState({
            formData: {
                name: "",
                designation: "",
                type: "",
                employee_id: "",
                nic: "",
                contact_no: "",
                email: "",
                address: "",
                status: "",
                created_location_id: null
            },
            buttonName: "Save"
        }, () => {
            this.getLoginedHospital()
        })

    }

    async getLoginedHospital() {
        let hospital = await localStorageService.getItem("login_user_pharmacy_drugs_stores")
        let formData = this.state.formData;
        formData.created_location_id = hospital[0].pharmacy_drugs_stores_id;

        let empFormData = this.state.empFormData;
        empFormData.pharmacy_drugs_stores_id = hospital[0].pharmacy_drugs_stores_id;

        this.setState({ formData, empFormData })

    }

    async submitAnotherRoles() {
        console.log("form data", this.state.otherTypes_formData)
        let otherTypes_formData = this.state.otherTypes_formData;

        let res = await VehicleService.updateVehicleUser(otherTypes_formData);
        if (res.status == 200) {
            this.setState({ alert: true, message: "User Update Successful", severity: 'success', buttonName: "Save" })
            this.loadData();
            this.resetFields();
        } else {
            this.setState({ alert: true, message: "User Update Unsuccessful", severity: 'error' })
        }
    }

    render() {
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={"Add RMSD User"} />

                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => { this.state.buttonName == "Save" ? this.saveVehicleUser() : this.updateVehicleUser() }}
                        >
                            <Grid container spacing={1} className="flex ">
                                {/*  <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="User ID" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="User ID"
                                        name="user_id"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.employee_id}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.employee_id =
                                                e.target.value
                                            this.setState({ formData })
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid> */}


                                {/* <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Name" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Name"
                                        name="name"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.password}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.password =
                                                e.target.value
                                            this.setState({ formData })
                                        }}
                                        // validators={['required', "matchRegexp:^[A-z| |.]{1,}$"]}
                                        // errorMessages={[
                                        //     'this field is required', "Please Enter a valid Name (Eg:A.B.C Perera)"
                                        // ]}
                                    />
                                </Grid> */}
                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Name" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Name"
                                        name="name"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.name}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.name =
                                                e.target.value
                                            this.setState({ formData })
                                        }}
                                        validators={['required', "matchRegexp:^[A-z| |.]{1,}$"]}
                                        errorMessages={[
                                            'this field is required', "Please Enter a valid Name (Eg:A.B.C Perera)"
                                        ]}
                                    />
                                </Grid>

                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Contact Number" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Contact Number"
                                        name="contact_no"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.contact_no}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.contact_no =
                                                e.target.value
                                            this.setState({ formData })
                                        }}
                                        validators={['required', "matchRegexp:((^|, )((0)[0-9]{9}|(7)[0-9]{8}))+$"]}
                                        errorMessages={[
                                            'this field is required', "Please enter a valid Contact Number(Eg:0712345678 or 712345678)"
                                        ]}
                                    />
                                </Grid>


                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="User Type" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={
                                            appConst.rmsd_user_type
                                        }
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let formData = this.state.formData;
                                                formData.type = value.type;
                                                this.setState({
                                                    formData
                                                }, console.log("formdata", this.state.formData))
                                            }
                                        }}
                                        value={appConst.rmsd_user_type.find(
                                            (v) =>
                                                v.type ===
                                                this.state.formData
                                                    .type
                                        )}
                                        getOptionLabel={(option) =>
                                            option.lable ? option.lable : ''
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="User Type"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={appConst.rmsd_user_type.find(
                                                    (v) =>
                                                        v.type ===
                                                        this.state.formData
                                                            .type
                                                )}
                                                validators={[
                                                    'required',
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            />
                                        )}
                                    />
                                </Grid>



                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Designation" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Designation"
                                        name="designation"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.designation}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.designation =
                                                e.target.value
                                            this.setState({ formData })
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required'
                                        ]}
                                    />
                                </Grid>



                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="NIC" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="NIC"
                                        name="nic"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.nic}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.nic = e.target.value.toUpperCase()
                                            formData.username = this.state.buttonName != "Update" ?
                                                e.target.value.toUpperCase() : this.state.formData.username
                                            this.setState({ formData })
                                        }}
                                        validators={['required', 'matchRegexp:^([0-9]{9}[x|X|v|V]|[0-9]{12})$']}
                                        errorMessages={[
                                            'this field is required', "Please enter a valid NIC Number(Eg:991234567v or 199981234567)"
                                        ]}
                                    />
                                </Grid>

                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Email" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Email"
                                        name="email"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.email}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.email =
                                                e.target.value
                                            this.setState({ formData })
                                        }}
                                        validators={['required', 'isEmail']}
                                        errorMessages={[
                                            'this field is required',
                                            'Please enter a valid Email Address'
                                        ]}
                                    />
                                </Grid>

                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Username" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Username"
                                        name="username"
                                        disabled={true}
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.username}
                                        type="text"
                                        //disabled={this.state.buttonName == "Update"}
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.username =
                                                e.target.value
                                            this.setState({ formData })
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required'
                                        ]}
                                    />
                                </Grid>

                                {/* <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Password" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Password"
                                        name="password"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.password}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.password =
                                                e.target.value
                                            this.setState({ formData })
                                        }}
                                    // validators={['required', "matchRegexp:^[A-z| |.]{1,}$"]}
                                    // errorMessages={[
                                    //     'this field is required', "Please Enter a valid Name (Eg:A.B.C Perera)"
                                    // ]}
                                    />
                                </Grid> */}

                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <SubTitle title="Address" />
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Address"
                                        name="address"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.address}
                                        type="text"
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData = this.state.formData;
                                            formData.address = e.target.value;
                                            this.setState({ formData })

                                        }}
                                        validators={['required', "matchRegexp:^[A-z| |0-9|,|\/|\\n]{1,}$"]}
                                        errorMessages={[
                                            'this field is required', "Please enter a valid Address"
                                        ]}
                                    />
                                </Grid>

                            </Grid>
                            <Grid
                                className=" w-full flex justify-end" item lg={12} md={12} sm={12} xs={12}
                            >
                                <Button
                                    className="mt-2"
                                    progress={false}
                                    scrollToTop={true}
                                    startIcon="cancel"
                                    onClick={() => { this.resetFields() }}
                                >
                                    <span className="capitalize">Cancel</span>
                                </Button>

                                <Button
                                    className="mt-2 ml-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    startIcon="save"
                                >
                                    <span className="capitalize">{this.state.buttonName}</span>
                                </Button>
                            </Grid>
                        </ValidatorForm>
                    </LoonsCard>

                    <Grid style={{ marginTop: 20 }}>
                        < LoonsCard >
                            {this.state.loaded &&
                                <div className="mt-0" >
                                    <LoonsTable
                                        id={'allVehicleUsers'}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: 20,
                                            page: this.state.filterData.page,

                                            onTableChange: (action, tableState) => {
                                                console.log(action, tableState)
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
                                    ></LoonsTable>
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

                <Dialog
                    open={this.state.conformingDialog}
                    onClose={() => { this.setState({ conformingDialog: false }) }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Conformation"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you Sure to change status of this User?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="text" onClick={() => { this.setState({ conformingDialog: false }) }} color="primary">
                            Disagree
                        </Button>
                        <Button variant="text" onClick={() => { this.agreeToChangeStatus() }} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>




                <Dialog fullWidth maxWidth="lg" open={this.state.otherTypes_dialog} >

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Add Another Role/s to User" />

                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ otherTypes_dialog: false })

                            }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>



                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm onSubmit={() => { this.submitAnotherRoles() }}>
                            <Grid
                                className=" w-full" item lg={12} md={12} sm={12} xs={12}
                            >

                                <SubTitle title="User Type/s" />

                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={
                                        appConst.rmsd_user_type
                                    }
                                    multiple
                                    onChange={(e, value) => {
                                        let otherTypes_formData = this.state.otherTypes_formData;
                                        otherTypes_formData.additional_type = [];
                                        value.forEach(element => {
                                            otherTypes_formData.additional_type.push(element.type)
                                        });

                                        this.setState({ otherTypes_formData })
                                    }}

                                    getOptionLabel={(option) =>
                                        option.lable ? option.lable : ''
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="User Type/s"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />




                            </Grid>


                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                <Button
                                    progress={this.state.processing}
                                    type="submit"
                                    variant="contained"
                                >
                                    Save
                                </Button>
                            </Grid>
                        </ValidatorForm>

                    </div>
                </Dialog>



            </Fragment >
        );
    }
}
export default withStyles(styleSheet)(RMSDUser)
//export default HospitalUser
{/*<MainContainer>
                    <Grid container spacing={1}>
                        <LoonsCard>
                            <Grid container spacing={1} className="flex ">

                                <Grid item sm={12} xs={12} lg={12}>
                                    <ValidatorForm
                                        ref="form"
                                        className="pt-2"
                                        onSubmit={this.postDriverForm}
                                    >
                                        <Grid item xs={12} sm={12} md={12} lg={12} className=" w-full">

                                        </Grid>

                                        <Grid className=" w-full" item lg={6} md={6} xs={12} sm={6}>
                                            <SubTitle title="Vehicle Registration Number"/>
                                            <TextValidator
                                                id="outlined-basic"
                                                variant="outlined"
                                                size="small"
                                                className=" w-full"
                                                InputLabelProps={{shrink: false}}
                                                value={this.state.regNumber}
                                                onChange={(e) => {
                                                    this.setState({
                                                        regNumber: e.target.value
                                                    })
                                                }}
                                                validators={['required', 'matchRegexp:^([0-9]{1,3}[A-Z]{3}|[A-Z]{2,3})-[0-9]{3,4}$']}
                                                errorMessages={['This field should be required!']}
                                            />
                                        </Grid>
                                        <Grid className=" w-full" item lg={6} md={6} xs={12} sm={6}>
                                            <SubTitle title="Vehicle Type"/>
                                            <Autocomplete
                                        disableClearable
                                                className=" w-full"
                                                options={this.state.vehicleTypeName}
                                                onChange={(e, value) => {
                                                    if (value != null) {
                                                        let formData = this.state.formData;
                                                        formData.vehicle_type_id = value.vehicleTypeId;
                                                        this.setState({formData})
                                                        this.setState({
                                                            type: value.vehicleTypeId
                                                        })
                                                    }
                                                }}
                                                defaultValue={{label: this.state.vehicleTypeName.label}}
                                                value={{label: this.state.vehicleTypeName.label}}
                                                getOptionLabel={(option) => option.label}
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="None"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item lg={6} md={6} xs={12} sm={6}>
                                            <SubTitle title="Vehicle Make"/>
                                            <TextValidator
                                                id="outlined-basic"
                                                label=""
                                                variant="outlined"
                                                size="small"
                                                className=" w-full"
                                                InputLabelProps={{shrink: false}}
                                                value={this.state.make}
                                                onChange={(e) => {
                                                    this.setState({
                                                        make: e.target.value
                                                    })
                                                }}
                                                validators={['required', 'matchRegexp:^([a-zA-Z]{1,10})$']}
                                                errorMessages={['This field should be required!']}
                                            />
                                        </Grid>
                                        <Grid item lg={6} md={6} xs={12} sm={6}>
                                            <SubTitle title="Description"/>
                                            <TextValidator
                                                id="outlined-basic"
                                                label=""
                                                variant="outlined"
                                                size="small"
                                                className=" w-full"
                                                InputLabelProps={{shrink: false}}
                                                value={this.state.description}
                                                onChange={(e) => {
                                                    this.setState({
                                                        description: e.target.value
                                                    })
                                                }}
                                                validators={['required']}
                                                errorMessages={['This field should be required!']}
                                            />
                                        </Grid>
                                        <Grid item lg={6} md={6} xs={12} sm={6}>
                                            <SubTitle title="Max Volume (m3)"/>
                                            <TextValidator
                                                id="outlined-basic"
                                                variant="outlined"
                                                size="small"
                                                className=" w-full"
                                                InputLabelProps={{shrink: false}}
                                                value={this.state.maxVolume}
                                                onChange={(e) => {
                                                    this.setState({
                                                        maxVolume: e.target.value
                                                    })
                                                }}
                                                validators={['required', 'isFloat', 'isPositive']}
                                                errorMessages={['This field should be required!', 'Wrong input!', 'Value should positive!']}
                                            />
                                        </Grid>
                                        <Grid item lg={6} md={6} xs={12} sm={6}>
                                            <SubTitle title="Max Weight(kg)"/>
                                            <TextValidator
                                                id="outlined-basic"
                                                variant="outlined"
                                                size="small"
                                                className=" w-full"
                                                InputLabelProps={{shrink: false}}
                                                value={this.state.maxWeight}
                                                onChange={(e) => {
                                                    this.setState({
                                                        maxWeight: e.target.value
                                                    })
                                                }}
                                                validators={['required', 'isFloat', 'isPositive']}
                                                errorMessages={['This field should be required!', 'Wrong input!', 'Value should positive!']}
                                            />
                                        </Grid>
                                        <Grid item lg={6} md={6} xs={12} sm={6}>
                                            <SubTitle title="Average Loading Time"/>
                                            <TextValidator
                                                id="outlined-basic"
                                                variant="outlined"
                                                size="small"
                                                className=" w-full"
                                                InputLabelProps={{shrink: false}}
                                                value={this.state.averageLoadingTime}
                                                onChange={(e) => {
                                                    this.setState({
                                                        averageLoadingTime: e.target.value
                                                    })
                                                }}
                                                validators={['required', 'matchRegexp:^([0-9]{1,10}[a-zA-Z]{1,10})$']}
                                                errorMessages={['This field should be required!']}
                                            />
                                        </Grid>
                                        <Grid item xs={3} sm={3}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                            >
                                                Save
                                            </Button>
                                        </Grid>
                                    </ValidatorForm>
                                </Grid>

                            </Grid>
                        </LoonsCard>
                        <Grid
                            container
                            direction="column-reverse"
                            justifyContent="space-between"
                            alignItems="flex-end"
                            style={{marginTop: 10}}
                        >
                            <Grid
                                container
                                direction="column-reverse"
                                justifyContent="space-between"
                                alignItems="flex-end"
                                style={{marginTop: 10}}
                            >
                                <IconTextField label="" iconEnd={<SearchIcon/>}/>
                            </Grid>
                        </Grid>

                        <Grid className=" w-full"
                              style={{marginTop: 20}}>
                            {
                                this.state.loaded ?
                                    <LoonsTable
                                        id={"driverDetails"}
                                        data={this.state.driverTableFormData}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: 20,
                                            page: this.state.formData.page,

                                            onTableChange: (action, tableState) => {
                                                console.log(action, tableState);
                                                switch (action) {
                                                    case 'changePage':
                                                        console.log("okk", tableState.page)
                                                        this.setPage(tableState.page)
                                                        break;
                                                    case 'sort':
                                                        break;
                                                    default:
                                                        console.log('action not handled.');
                                                }
                                            }

                                        }
                                        }
                                    >{}</LoonsTable>
                                    : ' '
                            }

                        </Grid>


                    </Grid>
                    <LoonsSnackbar
                        open={this.state.alert}
                        onClose={() => {
                            this.setState({alert: false})
                        }}
                        message={this.state.message}
                        autoHideDuration={3000}
                        severity={this.state.severity}
                        elevation={2}
                        variant="filled"
                    >{}</LoonsSnackbar>

                </MainContainer>*/}