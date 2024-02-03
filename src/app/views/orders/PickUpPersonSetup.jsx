
import React, { Component, Fragment } from "react";
import { Button, CardTitle, LoonsCard, MainContainer, SubTitle, LoonsTable, LoonsSwitch, LoonsSnackbar } from "../../components/LoonsLabComponents";
import {
    Grid, Tooltip, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';

import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";

import VehicleService from "app/services/VehicleService";

import * as appConst from '../../../appconst';

class PickUpPersonSetup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            totalItems: 0,
            totalPages: 0,
            filterData: {
                page: 0,
                limit: 20,
                type: ["PickUp Person"]
            },

            alert: false,
            message: "",
            severity: 'success',

            statusChangeRow: null,
            conformingDialog: false,

            buttonName: "Save",

            data: [],
            columns: [
                {
                    name: 'employee_id',
                    label: 'User ID',
                    options: {
                        //filter: true,
                        display: true,
                    },
                },
                {
                    name: 'type',
                    label: 'User Type',
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
                    label: 'Phone Number',
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
                                    <Grid className="px-2">
                                        <Tooltip title="Change Status">
                                            <LoonsSwitch
                                                checked={this.state.data[tableMeta.rowIndex].status == 'Active'
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
                                </Grid>
                            )
                        },
                    },
                },
            ],
            formData: {
                name: "",
                designation: "",
                type: "PickUp Person",
                employee_id: "",
                nic: "",
                contact_no: "",
                email: "",
                address: "",
                status: ""
            }
        }
    }

    async componentDidMount() {
        this.loadData();
    }

    // vehicle user save api call
    async saveVehicleUser() {

        console.log('data',this.state.formData);
        let formData = this.state.formData;

        let res = await VehicleService.createNewVehicleUser(formData);
        if (res.status == 201) {
            this.setState({ alert: true, message: "User Save Successful", severity: 'success' })
            this.loadData();
            this.resetFields();
        } else {
            this.setState({ alert: true, message: "User Save Unsuccessful", severity: 'error' })
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
            this.setState(
                { alert: true, message: "User Update Successful", severity: 'success', buttonName: "Save" })
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
                status: ""
            },
            buttonName:"Save"
        })

    }


    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={"Add PickUp Person"} />

                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => { this.state.buttonName == "Save" ? this.saveVehicleUser() : this.updateVehicleUser() }}
                        >
                            <Grid container spacing={1} className="flex ">
                                <Grid
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
                                </Grid>
                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Phone Number" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Phone Number"
                                        name="phone_number"
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
                                            'this field is required', "Please enter a valid Phone Number(Eg:0712345678 or 712345678)"
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
                                            appConst.hospital_user_type
                                        }
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                this.setState({
                                                    formData: {
                                                        ...this.state
                                                            .formData,
                                                        type:
                                                            value.type,
                                                       

                                                    },
                                                })
                                            }
                                        }}
                                        value={appConst.user_type.find(
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
                                            />
                                        )}
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
                                            formData.nic =
                                                e.target.value.toUpperCase()
                                            this.setState({ formData })
                                        }}
                                        validators={['required', 'matchRegexp:^([0-9]{9}[x|X|v|V]|[0-9]{12})$']}
                                        errorMessages={[
                                            'this field is required', "Please enter a valid NIC Number(Eg:991234567v or 199981234567)"
                                        ]}
                                    />
                                </Grid>

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
                                    onClick={()=> {this.resetFields()}}
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
            </Fragment >
        );
    }
}

export default PickUpPersonSetup