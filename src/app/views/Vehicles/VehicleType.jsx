import React, { Component, Fragment } from "react";
import {
    Button,
    CardTitle,
    LoonsCard,
    LoonsSnackbar, LoonsSwitch,
    LoonsTable,
    MainContainer,
    SubTitle,
} from "../../components/LoonsLabComponents";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Tooltip,
} from "@material-ui/core";

import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import VehicleService from "../../services/VehicleService";
import EditIcon from "@material-ui/icons/Edit";

class VehicleType extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            formData: {
                name: ''
            },

            totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
                name: ''
            },

            statusChangeRow: null,
            conformingDialog: false,

            buttonName: "Save",

            data: [],
            columns: [
                {
                    name: 'name', // field name in the row object
                    label: 'Vehicle Type', // column title that will be shown in table
                    options: {
                        filter: true,
                        //display: false
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
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="Edit">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                this.setDataToFields(tableMeta.tableData[tableMeta.rowIndex]);
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                    <Grid className="px-2" >
                                        <Tooltip title="Change Status" >
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
                                </Grid>
                            )
                        },
                    },
                },
            ],

            alert: false,
            message: "",
            severity: 'success',

            vehicleTypesTableFormData: [
                {
                    name: null
                }
            ]
        }
    }

    async toChangeStatus(row) {
        this.setState({
            statusChangeRow: row,
            conformingDialog: true
        })
    }

    // Change vehicle type status
    async changeStatus(row) {
        let data = this.state.data[row]
        let statusChange = {
            "status": data.status == "Deactive" ? "Active" : "Deactive"
        }
        let res = await VehicleService.changeVehicleTypeStatus(
            data.id,
            statusChange
        )
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
                }
            )
        }
    }

    async agreeToChangeStatus() {
        this.changeStatus(this.state.statusChangeRow)
        this.setState({ conformingDialog: false })
    }

    async saveVehicleType() {
        let formData = this.state.formData;
        let res = await VehicleService.createNewVehicleType(formData);
        if (res.status === 201) {
            this.setState({ alert: true, message: "Vehicle Registration Successful", severity: 'success' })
            this.loadData()
        } else {
            this.setState({ alert: true, message: "Vehicle Registration Unsuccessful", severity: 'error' })
        }
    }

    handleSubmit = () => {
        this.saveVehicleType()
    }

    // Load data onto table
    async loadData() {
        this.setState({ loaded: false })

        let res = await VehicleService.getAllVehicleTypes(this.state.filterData)
        console.log('res:', res)
        if (res.status == 200) {
            this.setState(
                {
                    loaded: true,
                    data: res.data.view.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                }
            )
        }
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

    //update vehicle user details
    async updateVehicleType() {
        let formData = this.state.formData;

        let res = await VehicleService.updateVehicleType(formData);
        if (res.status == 200) {
            this.setState({ alert: true, message: "Vehicle User Update Successful", severity: 'success', buttonName: "Save" })
            this.loadData();
        } else {
            this.setState({ alert: true, message: "Vehicle User Update Unsuccessful", severity: 'error' })
        }
    }

    componentDidMount() {
        this.loadData()
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Add Vehicle Type" />

                        <Grid className="6" item lg={6} md={2} sm={12} xs={12} style={{ marginTop: 20 }}>
                            <div style={{ fontWeight: 'bold', fontSize: 15 }}>Vehicle Type</div>
                        </Grid>

                        <ValidatorForm
                            className="pt-2"
                            onError={() => null}
                            ref="form"
                            onSubmit={() => { this.state.buttonName == "Save" ? this.saveVehicleType() : this.updateVehicleType() }}
                        >
                            <Grid container spacing={2}>
                                <Grid item lg={2} md={2} sm={12} xs={12} justifyContent="left" style={{ marginTop: 4.5 }}>
                                    <SubTitle title="Vehicle Type Name" />
                                </Grid>

                                <Grid item lg={2} md={2} sm={12} xs={12} justifyContent="left">
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Please Enter"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.name}
                                        onChange={(e) => {
                                            let formData = this.state.formData;
                                            formData.name = e.target.value;
                                            this.setState({ formData })
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                        justifyContent="left"
                                    />
                                </Grid>
                                <Grid item lg={2} md={2} sm={12} xs={12} style={{ marginTop: 4.5 }}>
                                    <Button
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                        startIcon="save"
                                    >
                                        <span className="capitalize">
                                            {this.state.buttonName}
                                        </span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>

                        {/*Vehicle Type Table*/}
                        <Grid style={{ marginTop: 20 }}>

                            {
                                this.state.loaded ?
                                    <LoonsTable
                                        id={"VEHICLE_TYPES"}
                                        data={this.state.data}
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
                                                        break;
                                                    case 'sort':
                                                        break;
                                                    default:
                                                        console.log('action not handled.');
                                                }
                                            }

                                        }
                                        }
                                    ></LoonsTable> : ' '
                            }

                        </Grid>
                    </LoonsCard>
                </MainContainer>
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
            </Fragment>
        );
    }
}

export default VehicleType
