import React, {Component, Fragment} from "react";
import {
    Button,
    CardTitle,
    LoonsCard,
    LoonsSnackbar,
    LoonsSwitch,
    LoonsTable,
    MainContainer,
    SubTitle
} from "../../components/LoonsLabComponents";
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    Tooltip,
} from "@material-ui/core";
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator'
import {Autocomplete} from "@material-ui/lab";
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from "@material-ui/icons/Edit";
import VehicleService from "../../services/VehicleService";
import localStorageService from "app/services/localStorageService";

const styleSheet = ((theme) => ({

}));

class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ownerId: '001',
            params: {
                limit: 20,
                page: 0
            },

            loaded: true,

            buttonName: "Save",

            formData: {
                vehicle_id: '',
                employees: [],
            },

            drivers: [
                {
                    employee_id: '',
                    type: ''
                }
            ],

            helpers: [
                {
                    employee_id: '',
                    type: ''
                }
            ],

            statusChangeRow: null,
            conformingDialog: false,

            driverData: [],
            totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
            },

            data: [],
            columns: [
                {
                    name: 'reg_no', // field name in the row object
                    label: 'Vehicle Registration Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true
                    },
                },
                {
                    name: 'name', // field name in the row object
                    label: 'Vehicle Type', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p> {this.state.data[tableMeta.rowIndex].VehicleType.name} </p>)
                        }
                    }
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Assigned Drivers(s)', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <div>
                                    {this.state.data[tableMeta.rowIndex].VehicleUsers.map(value1 => (
                                        value1.type === "Driver" && value1.Employee.name + ", "
                                    ))}
                                </div>
                            );
                        }
                    },
                },
                {
                    name: 'owner_id', // field name in the row object
                    label: 'Assigned Helpers(s)', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <div>
                                    <p>
                                        {this.state.data[tableMeta.rowIndex].VehicleUsers.map(value1 => (
                                            value1.type === "Helper" && value1.Employee.name + ", "
                                        ))}
                                    </p>
                                </div>
                            );
                        }
                    }
                },
                {
                    name: "Action",
                    label: 'Action',
                    options: {

                        customBodyRenderLite: (value, tableMeta,) => {
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
                                            <EditIcon color="primary"/>
                                        </IconButton>
                                    </Tooltip>
                                    <Grid className="px-2">
                                        <Tooltip title="Change Status">
                                            <LoonsSwitch
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

                            );
                        }
                    }
                },
            ],
            alert: false,
            message: "",
            severity: 'success',
            vehiclesData: [],
            personName: [],
            employeeData: [],
        }
    }

    async toChangeStatus(row) {
        this.setState({
            statusChangeRow: row,
            conformingDialog: true
        })
    }


// set table data to form when edit button
    setDataToFields(row) {
        this.setState({
                formData: row
            },
            () => {
                this.render()
            })
    }


    // Change user status
    async changeStatus(row) {
        console.log('coming data', this.state.data[row])
    }

    async toChangeStatus(row) {
        this.setState({
            statusChangeRow: row,
            conformingDialog: true
        })
    }

    async agreeToChangeStatus() {
        this.changeStatus(this.state.statusChangeRow)
        this.setState({conformingDialog: false})
    }

    handleChange = (event) => {
        const {
            target: {value}
        } = event;
        this.personName(
            // On autofill we get a the stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    // Load data onto table
    async loadData() {
        this.setState({loaded: false})
        var ownerId = await localStorageService.getItem('owner_id');
        let res = await VehicleService.fetchAllVehicles(this.state.filterData, ownerId)
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

    async fetchVehicles() {
         var ownerId = await localStorageService.getItem('owner_id');
        let vehicles = await VehicleService.fetchAllVehicles(this.params, ownerId);
        if (vehicles.status === 200) {
            this.setState({
                vehiclesData: vehicles.data.view.data
            })
        }
    }

    async fetchEmployee() {
        let employees = await VehicleService.getEmployees(this.params);

        if (employees.status === 200) {
            this.setState({
                employeeData: employees.data.view.data
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
                this.loadData()
            }
        )
    }

    handleDropDownChange(event) {
        this.setState({
            type: event.target.value
        })
    };

    loadEmployeesOrHelpers(value) {
        if (value[0].type === 'Driver') {
            this.setState({
                drivers: value.map((val) => ({
                    employee_id: val.id,
                    type: val.type
                }))
            })
        } else if (value[0].type === 'Helper') {
            this.setState({
                helpers: value.map((val) => ({
                    employee_id: val.id,
                    type: val.type
                }))
            })
        }
    }

    concatArrays() {
        this.setState({
            formData: {
                vehicle_id: this.state.formData.vehicle_id,
                employees: this.state.drivers.concat(this.state.helpers)
            }
        })
    }

    onSubmit = async () => {
        this.concatArrays()
        if (this.state.buttonName === 'Save') {
            let formData = this.state.formData
            let res = await VehicleService.createVehicleUsers(formData);
            if (res.status === 201) {
                this.setState({
                    alert: true,
                    message: 'Vehicle User Created Successfully!',
                    severity: 'success',
                })
                this.loadData()
            } else {
                this.setState({
                    alert: true,
                    message: 'Vehicle User creation was Unsuccessful!',
                    severity: 'error',
                })
            }
        } else {
            // this.updateDriver();
        }
    }

    componentDidMount() {
        this.loadData()
        this.fetchVehicles();
        this.fetchEmployee()
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <Grid container spacing={1} className="flex">
                            <Grid item xs={12} sm={12} md={12} lg={12} className=" w-full">
                                <CardTitle title="Assign Default Users to Vehicles"/>
                            </Grid>
                            <Grid item lg={12} className=" w-full mt-2">
                                <ValidatorForm
                                    className="pt-2"
                                    ref={'outer-form'}
                                    onSubmit={() => this.onSubmit()}
                                    onError={() => null}
                                >
                                    <Grid container spacing={1} className="flex">
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Vehicle Registration Number"/>
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={this.state.vehiclesData}
                                                onChange={(e, value) => {
                                                    if (null != value) {
                                                        let formData = this.state.formData
                                                        formData.vehicle_id = value.id
                                                        this.setState({formData})
                                                    }
                                                }}
                                                getOptionLabel={
                                                    (option) => option.reg_no
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Please select"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        // value={this.state.registrationNo}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Add Driver(s)"/>
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={this.state.employeeData}
                                                multiple
                                                onChange={(e, value) => {
                                                    if (null != value) {
                                                        this.loadEmployeesOrHelpers(value)
                                                    }
                                                }}
                                                getOptionLabel={
                                                    (option) => option.type === 'Driver' && option.type != null ? option.name : ''
                                                }

                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Please select..."
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        // value={this.state.registrationNo}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Add Helper(s)"/>
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={this.state.employeeData}
                                                multiple
                                                onChange={(e, value) => {
                                                    if (null != value) {
                                                        this.loadEmployeesOrHelpers(value)
                                                    }
                                                }}
                                                getOptionLabel={
                                                    (option) => option.type === 'Helper' && option.name != null ? option.name : ''
                                                }

                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Please select"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        // value={this.state.registrationNo}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={1}
                                            md={1}
                                            sm={12}
                                            xs={12}
                                            style={{marginTop: 11.5}}
                                        >
                                            <Button
                                                className="mt-2"
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

                                        <Grid container spacing={2}>
                                            <Grid lg={2} className=" w-full mt-2" spacing={2}
                                                  style={{marginTop: 500, marginLeft: 1100}}>
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Search"
                                                    name="search"
                                                    InputLabelProps={{shrink: false}}
                                                    value={this.state.name}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end" disablePointerEvents="true">
                                                                <Tooltip title="Search">
                                                                    <IconButton size="small" aria-label="delete">
                                                                        <SearchIcon className="text-primary"
                                                                                    alt="search"/>
                                                                    </IconButton>
                                                                </Tooltip>

                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            name: e.target.value,
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
                            </Grid>

                            {/*Table*/}
                            <Grid lg={12} className=" w-full mt-2" spacing={2} style={{marginTop: 20}}>

                                {
                                    this.state.loaded ?
                                        <div className="pt-0">
                                            <LoonsTable
                                                id={"DEFAULT_USER"}
                                                data={this.state.data}
                                                columns={this.state.columns}
                                                options={{
                                                    pagination: true,
                                                    serverSide: true,
                                                    count: this.state.totalItems,
                                                    rowsPerPage: 20,
                                                    page: this.state.formData.page,

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
                                            >
                                            </LoonsTable>
                                        </div>
                                        :
                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30}/>
                                        </Grid>
                                }
                            </Grid>
                        </Grid>
                    </LoonsCard>
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
                </MainContainer>
                <Dialog
                    open={this.state.conformingDialog}
                    onClose={() => {
                        this.setState({conformingDialog: false})
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Conformation"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you Sure to change status of this Driver?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="text" onClick={() => {
                            this.setState({conformingDialog: false})
                        }} color="primary">
                            Disagree
                        </Button>
                        <Button variant="text" onClick={() => {
                            this.agreeToChangeStatus()
                        }} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

export default User
