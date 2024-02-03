import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    IconButton,
    Icon,
    Tooltip,
    CircularProgress,
} from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import EditIcon from '@mui/icons-material/Edit';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import moment from 'moment';

import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import { yearMonthParse, dateParse, yearParse } from 'utils'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    LoonsTable,
    CardTitle,
    SubTitle,
    FilePicker,
    ImageView,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import EstimationService from 'app/services/EstimationService'
import WarehouseServices from 'app/services/WarehouseServices'
import EmployeeServices from 'app/services/EmployeeServices'
import localStorageService from 'app/services/localStorageService'


const styleSheet = (theme) => ({})

class AssignPharmacist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            submitting: false,
            loaded: false,
            editLoad: false,
            alert: false,
            message: '',
            severity: 'success',

            all_warehouse_loaded: [],
            allPharmacist: [],

            filterData: {
                page: 0,
                limit: 20,
                hospital_estimation_id: this.props.selectedData.id,
                'order[0]': ['createdAt', 'DESC']
            },
            edit: false,
            editEstimationId: null,
            formData: {
                warehouse_id: null,
                hospital_estimation_id: null,
                expected_date: null,
                responsible_person_id: null,
                owner_id: null
            },
            data: [],

            columns: [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return <Grid className="flex ">
                                {/* <Tooltip title="Create Estimation">
                                    <IconButton
                                        onClick={() => {

                                            window.location.href = `/estimation/estimation_create/${this.state.data[dataIndex].id}`

                                        }}>
                                        <CreateNewFolderIcon color='primary' />
                                    </IconButton>
                                </Tooltip> */}

                                <Tooltip title="Edit">
                                    <IconButton
                                        onClick={() => {
                                            this.setState({ editLoad: true })
                                            let formData = this.state.formData
                                            formData.warehouse_id = this.state.data[dataIndex].warehouse_id
                                            formData.hospital_estimation_id = this.state.data[dataIndex].hospital_estimation_id
                                            formData.expected_date = this.state.data[dataIndex].expected_date
                                            formData.responsible_person_id = this.state.data[dataIndex].responsible_person_id
                                            formData.owner_id = this.state.data[dataIndex].owner_id

                                            this.setState({ edit: true, editEstimationId: this.state.data[dataIndex].id, formData }, () => {
                                                this.loadEmployees()
                                            })
                                        }}>
                                        <EditIcon color='primary' />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        },
                    },
                },
                {
                    name: 'Employee',
                    label: 'Employee',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Employee?.name
                            return data
                        },
                    },
                }, {
                    name: 'Warehouse',
                    label: 'Warehouse',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Warehouse?.name
                            return data
                        },
                    },
                },
                {
                    name: 'expected_date',
                    label: 'Expected Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].expected_date
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'status',
                    label: 'Status Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].status
                            return data
                        },
                    },
                },

            ]
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let res = await EstimationService.getAllSubHospitalEstimation(this.state.filterData)
        if (res.status == 200) {
            console.log("sub estimation data", res.data.view.data)
            this.setState({
                data: res.data.view.data,
                loaded: true
            })
        }
    }


    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({ filterData }, () => { this.loadData() })
    }


    async loadWarehouse(owner_id) {
        this.setState({ loaded: false })
        let userInfo = await localStorageService.getItem('userInfo')
        let params = {issuance_type:'drug_store'}
        let res = await WarehouseServices.getAllWarehousewithOwner(params, owner_id)

        if (200 == res.status) {
            this.setState({
                all_warehouse_loaded: res.data.view.data,
            })
            console.log("warehouses", this.state.all_warehouse_loaded);
        }
    }


    async loadEmployees() {
        let filterData = {
            pharmacy_drugs_stores_id: this.state.formData.warehouse_id,
            //type: "Pharmacist"
        }
        let res = await EmployeeServices.getALLAsignEmployees(filterData)
        console.log('res', res)
        if (res.status == 200) {
            this.setState({
                allPharmacist: res.data.view.data,
                editLoad: false
            })
            console.log('all Pharmacist', res.data.view.data)
        }
    }

    async componentDidMount() {
        console.log("selected data", this.props.selectedData)

        let owner_id = await localStorageService.getItem('owner_id')
        let user_id = await localStorageService.getItem('userInfo').id

        let formData = this.state.formData
        formData.owner_id = owner_id
        formData.hospital_estimation_id = this.props.selectedData.id
        this.setState({ formData })

        this.loadWarehouse(owner_id)
        this.loadData();
        //let hosID = this.props.id;
        //this.loadItemById(hosID);
    }



    async submit() {
        this.setState({ submitting: true })

        let formData = this.state.formData;

        let res = await EstimationService.createSubHospitalEstimation(formData)
        console.log("Estimation Data added", res)
        if (res.status === 201) {
            this.setState({
                alert: true,
                message: 'Estimation added successfully!',
                severity: 'success',
                submitting: false
            }
                , () => {
                    this.setPage(0)
                }
            )
        } else {
            this.setState({
                alert: true,
                message: 'Estimation adding was unsuccessful!',
                severity: 'error',
                submitting: false
            })
        }

    }

    async editSubmit() {
        this.setState({ submitting: true })

        let formData = this.state.formData;

        let res = await EstimationService.EditSubHospitalEstimation(this.state.editEstimationId, formData)
        console.log("Estimation Data added", res)
        if (res.status === 200) {
            this.setState({
                alert: true,
                message: 'Estimation Edit Successfully!',
                severity: 'success',
                submitting: false
            }
                , () => {
                    this.setPage(0)
                }
            )
        } else {
            this.setState({
                alert: true,
                message: 'Estimation Edit Was Unsuccessful!',
                severity: 'error',
                submitting: false
            })
        }
    }

    render() {
        // let { theme } = this.props
        // const { classes } = this.props
        // const zeroPad = (num, places) => String(num).padStart(places, '0')
        return (
            < Fragment >
                <MainContainer>

                    {!this.state.editLoad &&
                        <ValidatorForm
                            className="mt--3"
                            onSubmit={() => { this.state.edit ? this.editSubmit() : this.submit() }}
                            onError={() => null}
                        >

                            <Grid className='mt-3' container spacing={2}>

                                <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                    <SubTitle title="Estimation Year" />
                                    <DatePicker
                                        value={this.props.selectedData?.Estimation?.EstimationSetup?.year}
                                        disabled={true}
                                        className="w-full"
                                        onChange={(date) => {

                                        }}
                                        format="yyyy"
                                        openTo='year'
                                        views={["year"]}
                                        placeholder="Year"
                                    />
                                </Grid>





                                <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12}>
                                    <SubTitle title="Warehouse" />
                                    <Autocomplete
                                        className="w-full"
                                        options={this.state.all_warehouse_loaded}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData = this.state.formData
                                                formData.warehouse_id = value.id
                                                formData.responsible_person_id = null
                                                this.setState({ formData }, () => {
                                                    this.loadEmployees()
                                                })
                                            } else {
                                                let formData = this.state.formData
                                                formData.warehouse_id = null
                                                formData.responsible_person_id = null
                                                this.setState({ formData, allPharmacist: [] })
                                            }
                                        }}
                                        value={this.state.all_warehouse_loaded.find(x => x.id == this.state.formData.warehouse_id)}
                                        getOptionLabel={(option) => option.name != null ? option.name : null}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Select Your Warehouse"
                                                value={this.state.all_warehouse_loaded.find(x => x.id == this.state.formData.warehouse_id)}
                                                fullWidth
                                                variant="outlined"
                                                size="small"
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


                                <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12}>
                                    <SubTitle title="Pharmacist" />
                                    <Autocomplete
                                        className="w-full"
                                        options={this.state.allPharmacist}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData = this.state.formData
                                                formData.responsible_person_id = value.employee_id
                                                this.setState({ formData })
                                            } else {
                                                let formData = this.state.formData
                                                formData.responsible_person_id = null
                                                this.setState({ formData })
                                            }
                                        }}
                                        value={this.state.allPharmacist.find(x => x.employee_id == this.state.formData.responsible_person_id)}
                                        getOptionLabel={(option) => option.Employee?.name}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Select Pharmacist"
                                                value={this.state.allPharmacist.find(x => x.employee_id == this.state.formData.responsible_person_id)}
                                                fullWidth
                                                variant="outlined"
                                                size="small"
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


                                <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12}
                                >
                                    <SubTitle title="Expected Date" />
                                    <DatePicker
                                        className="w-full "
                                        value={this.state.formData.expected_date}
                                        placeholder="Expected Date"

                                        minDate={new Date()}
                                        maxDate={new Date(this.props.selectedData.Estimation.end_date)}
                                        required={true}
                                        errorMessages="This Field is Required"
                                        //inputFormat="yyyy-MM"
                                        // format="MM/yyyy"
                                        onChange={date => {
                                            let formData = this.state.formData;
                                            formData.expected_date = dateParse(date);
                                            this.setState({ formData })
                                        }}
                                    />
                                </Grid>
                            </Grid>





                            <Button
                                className="mt-2 mr-2"
                                progress={this.state.submitting}
                                type="submit"
                                scrollToTop={true}
                                startIcon="save"
                            //onClick={this.handleChange}
                            >
                                <span className="capitalize">
                                    {this.state.edit ? "Edit" : "Save"}
                                </span>
                            </Button>

                        </ValidatorForm>

                    }




                    <Grid className='mt-10'>

                        <CardTitle title="Assigned Pharmacist" />

                        {this.state.loaded ?
                            <LoonsTable
                                className="mt-5"
                                //title={"All Aptitute Tests"}

                                id={'estimationStups'}
                                // title={'Active Prescription'}
                                data={this.state.data}
                                columns={this.state.columns}
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: this.state.totalItems,
                                    // count: 10,
                                    rowsPerPage: this.state.filterData.limit,
                                    page: this.state.filterData.page,
                                    print: false,
                                    viewColumns: false,
                                    download: false,
                                    onRowClick: this.onRowClick,
                                    onTableChange: (action, tableState) => {
                                        console.log(action, tableState)
                                        switch (action) {
                                            case 'changePage':
                                                this.setPage(tableState.page)
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
                            :
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress
                                    size={30}
                                />
                            </Grid>
                        }
                    </Grid>




                    <Grid className="justify-center text-center w-full pt-12">
                        {/* <CircularProgress
                                size={30}
                            /> */}
                    </Grid>

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
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(AssignPharmacist)

