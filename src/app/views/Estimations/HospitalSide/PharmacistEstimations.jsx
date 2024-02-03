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
    Dialog
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
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
    LoonsSwitch
} from 'app/components/LoonsLabComponents'

import SignEstimatedClass from './SignEstimatedClass'
import * as appConst from '../../../../appconst'
import EstimationService from 'app/services/EstimationService'
import WarehouseServices from 'app/services/WarehouseServices'
import EmployeeServices from 'app/services/EmployeeServices'
import localStorageService from 'app/services/localStorageService'


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
})

class PharmacistEstimations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            viewAccept: false,
            submitting: false,
            loaded: false,
            editLoad: false,
            alert: false,
            message: '',
            severity: 'success',

            all_warehouse_loaded: [],
            allPharmacist: [],

            loginUserRoles: [],
            filterData: {
                page: 0,
                limit: 20,

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
            selectedEstimation: null,

            columns: [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return <Grid className="flex items-center">


                                <Tooltip title="View/ Enter Forecast Estimation">
                                    <IconButton
                                        disabled={this.state.data[dataIndex].status == 'Rejected'}
                                        onClick={() => {
                                            window.location.href = `/estimation/estimation_items/${this.state.data[dataIndex].id}/${this.state.data[dataIndex]?.HosptialEstimation?.warehouse_id}`

                                        }}>
                                        <VisibilityIcon color='primary' />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Sign Estimation">
                                    <Button
                                        style={{ height: 'fitContent' }}
                                        size="small"
                                        disabled={this.state.data[dataIndex].status == 'Rejected'}
                                        onClick={() => { this.setState({ selectedEstimation: this.state.data[dataIndex], viewAccept: true }) }}>
                                        Sign Sheet Accept
                                    </Button>
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
                    name: 'Year',
                    label: 'Year',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].HosptialEstimation?.Estimation?.EstimationSetup?.year
                            return data
                        },
                    },
                },
                {
                    name: 'type',
                    label: 'Type',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].HosptialEstimation?.Estimation?.type
                            return data
                        },
                    },
                },
                {
                    name: 'type',
                    label: 'Item Type',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].HosptialEstimation?.Estimation?.consumables
                            return appConst.item_type.find(x => x.value == data)?.label
                        },
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].status
                            return data
                        },
                    },
                },
                {
                    name: 'status',
                    label: 'Change Status',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]
                            return <Tooltip title="Change Status">
                                <LoonsSwitch
                                    disabled={!this.state.loginUserRoles.includes('Chief Pharmacist')}
                                    value={data.status == "Rejected" ? false : true}
                                    checked={data.status == "Rejected" ? false : true}
                                    color="primary"
                                    onChange={() => {
                                        this.ChangeStatus(data)
                                    }}
                                />
                            </Tooltip>

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




    async componentDidMount() {
        console.log("selected data", this.props.selectedData)

        let owner_id = await localStorageService.getItem('owner_id')
        let user_info = await localStorageService.getItem('userInfo')
        let user_id = await localStorageService.getItem('userInfo').id

        let filterData = this.state.filterData
        filterData.owner_id = owner_id

        if (user_info.roles.includes('Chief Pharmacist')) {
            filterData.created_by = user_id
        } else {

            filterData.responsible_person_id = user_id
        }




        this.setState({ filterData, loginUserRoles: user_info.roles }, () => {
            this.loadData();
        })

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

    async ChangeStatus(row) {
        let newstatus
        if (row.status == 'Rejected') {
            newstatus = {
                "status": "Active"
            }
        } else {
            newstatus = {
                "status": "Rejected"
            }
        }

        let res = await EstimationService.changeSubHospitalEstimationStatus(row.id, newstatus)
        console.log('change status', res)
        if (res.status === 200) {
            this.setState({
                alert: true,
                severity: 'success',
                message: "Successfully Saved ",
            },
                () => {
                    this.loadData()
                    //window.location.reload()
                })
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Cannot Save ",
            })
        }


    }

    render() {
        const { classes } = this.props
        // let { theme } = this.props
        // const { classes } = this.props
        // const zeroPad = (num, places) => String(num).padStart(places, '0')
        return (
            < Fragment >
                <MainContainer>

                    <LoonsCard className="mt-3">

                        <Grid>

                            <CardTitle title="All Estimation Requests" />

                            <div className='mt-5 w-full'>
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
                            </div>
                        </Grid>




                        <Grid className="justify-center text-center w-full pt-12">
                            {/* <CircularProgress
                                size={30}
                            /> */}
                        </Grid>
                    </LoonsCard>

                </MainContainer>



                <Dialog fullWidth maxWidth="lg" open={this.state.viewAccept} onClose={() => { this.setState({ viewAccept: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                        <CardTitle title="Verify Estimation" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    viewAccept: false

                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>
                        <SignEstimatedClass selectedEstimation={this.state.selectedEstimation}></SignEstimatedClass>
                    </MainContainer>
                </Dialog>





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

export default withStyles(styleSheet)(PharmacistEstimations)