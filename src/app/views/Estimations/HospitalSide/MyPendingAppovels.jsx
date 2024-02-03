import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    IconButton,
    Icon,
    Tabs,
    Tab,
    Tooltip,
    CircularProgress,
    Dialog
} from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import moment from 'moment';

import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import { yearMonthParse, dateParse, yearParse, includesArrayElements } from 'utils'

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
import CloseIcon from '@material-ui/icons/Close';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EditIcon from '@mui/icons-material/Edit';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import * as appConst from '../../../../appconst'
import EstimationService from 'app/services/EstimationService'
import InventoryService from 'app/services/InventoryService'
import ClinicService from 'app/services/ClinicService'
import localStorageService from 'app/services/localStorageService'
import AssignPharmacist from './AssignPharmacist'
import AddRoadIcon from '@mui/icons-material/AddRoad';

import FiltersEstimation from '../FiltersEstimation'

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

class MyPendingAppovels extends Component {
    constructor(props) {
        super(props)
        this.state = {
            disableInstitiute:false,
            activeTab: 0,
            submitting: false,
            gerarating: false,
            loaded: false,
            assignPharmacist: false,
            selectedEstimation: null,
            alert: false,
            message: '',
            severity: 'success',
            userRoles: [],
            filterData: {
                status: 'Pending',
                page: 0,
                limit: 20,
                'order[0]': ['createdAt', 'DESC']
            },
            edit: false,
            editEstimationId: null,

            data: [],

            columns: [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return <Grid className="flex items-center" >
                                {
                                    <div className='flex row'>

                                        <Tooltip title="View All Estimations">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/estimation/director_estimation_items/${this.state.data[dataIndex]?.HosptialEstimation.id}/${this.state.data[dataIndex]?.HosptialEstimation?.warehouse_id}`

                                                }}>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>

                                        {includesArrayElements(this.state.userRoles, ['MSD AD']) &&
                                            <Tooltip title="Add New items">
                                                <IconButton
                                                    onClick={() => {
                                                        window.location.href = `/estimation/cp_estimation_items/${this.state.data[dataIndex]?.HosptialEstimation?.id}/${this.state.data[dataIndex]?.HosptialEstimation?.warehouse_id}`

                                                    }}>
                                                    <AddRoadIcon color='primary' />
                                                </IconButton>
                                            </Tooltip>
                                        }

                                        {!includesArrayElements(this.state.userRoles, ['MSD AD']) &&
                                            <Tooltip title="View Items">
                                                <IconButton
                                                    onClick={() => {
                                                        window.location.href = `/estimation/cp_estimation_items/${this.state.data[dataIndex]?.HosptialEstimation?.id}/${this.state.data[dataIndex]?.HosptialEstimation?.warehouse_id}`

                                                    }}>
                                                    <AddRoadIcon color='primary' />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    </div>
                                }

                            </Grid >
                        },
                    },
                },
                {
                    name: 'Year',
                    label: 'Year',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.HosptialEstimation?.Estimation?.EstimationSetup?.year
                            return data
                        },
                    },
                },
                {
                    name: 'name',
                    label: 'Name',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.HosptialEstimation?.Estimation?.name
                            return data
                        },
                    },
                },

                {
                    name: 'type',
                    label: 'Type',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.HosptialEstimation?.Estimation?.type
                            return data
                        },
                    },
                },

                {
                    name: 'institute_category',
                    label: 'Institute Category',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.HosptialEstimation?.Estimation?.institute_category
                            return data
                        },
                    },
                },
                {
                    name: 'institute',
                    label: 'Institution',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (this.state.data[dataIndex]?.institute + ' (' + this.state.data[dataIndex]?.Department?.name + ')')
                        }
                    }
                },
                {
                    name: 'warehouse',
                    label: 'Warehouse',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.HosptialEstimation?.Warehouse?.name
                            return data
                        },
                    },
                },
                {
                    name: 'from',
                    label: 'From',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.HosptialEstimation?.Estimation?.from
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'to',
                    label: 'To',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.HosptialEstimation?.Estimation?.to
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'start_date',
                    label: 'Submission Start Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.HosptialEstimation?.Estimation?.start_date
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'end_date',
                    label: 'Submission End Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.HosptialEstimation?.Estimation?.end_date
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'massage',
                    label: 'Message',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.HosptialEstimation?.Estimation?.massage
                            return data
                        },
                    },

                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.status
                            return data
                        },
                    }
                },
            ]
        }
    }

    async loadData() {
        this.setState({ loaded: false })

        let user_info = await localStorageService.getItem('userInfo')

        let filterData = this.state.filterData
        filterData.approval_user_type = user_info.roles[0]

        let res = await EstimationService.getEstimationsApprovals(filterData)


        if (res.status == 200) {
            console.log("estimation approval data", res.data.view.data)
            if (res.data.view.data.length > 0) {
                this.getPharmacyDet(res.data.view.data)
            } else {
                this.setState({
                    loaded: true,
                    data: []
                })
            }

            this.setState({
                //data: res.data.view.data,
                totalItems: res.data.view.totalItems,

            })
        }
    }

    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({ filterData }, () => { this.loadData() })
    }






    async getPharmacyDet(mainData) {

        let params = {
            issuance_type: ["Hospital", "RMSD Main"],
            // limit: 1, 
            // page: 0,
            'order[0]': ['createdAt', 'ASC'],
            selected_owner_id: mainData?.map(x => x.HosptialEstimation.Warehouse?.owner_id)
        };

        let res = await ClinicService.fetchAllClinicsNew(params, null);


        let updatedArray = []
        if (res.status == 200) {


            updatedArray = mainData.map((obj1) => {
                const obj2 = res.data?.view?.data?.find((obj) => obj.owner_id === obj1.HosptialEstimation.Warehouse?.owner_id);

                obj1.institute = obj2?.name
                obj1.Department = obj2?.Department

                return obj1;
            });

        }
        console.log('last data estimations', updatedArray)
        this.setState(
            { data: updatedArray, loaded: true }

        )

    }

    async componentDidMount() {
        var owner_id = await localStorageService.getItem('owner_id');
        let user_info = await localStorageService.getItem('userInfo')
        let district = await localStorageService.getItem('login_user_pharmacy_drugs_stores')[0]?.Pharmacy_drugs_store?.district

        this.setState({ userRoles: user_info.roles })

        let filterData = this.state.filterData
        if (owner_id != '000') {
            if (includesArrayElements(user_info.roles, ['Devisional Pharmacist', 'RDHS'])) {
                filterData.districts = district
                filterData.institute_type = 'Provincial'
                this.setState({disableInstitiute:false})
            } else {

                filterData.owner_id = owner_id
                this.setState({disableInstitiute:true})
            }
        }

        this.setState({ filterData }, () => { this.loadData(); })


    }



    render() {
        const { classes } = this.props
        return (
            < Fragment >

                <FiltersEstimation
                disableInstitiute={this.state.disableInstitiute}
                    onSubmit={(data) => {
                        let filterData = this.state.filterData
                        filterData = { ...filterData, ...data }
                        //Object.assign(filterData, data)
                        this.setState({ filterData }, () => {
                            this.setPage(0)
                        })
                    }}
                ></FiltersEstimation>








                <Grid className='mt-10'>


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

export default withStyles(styleSheet)(MyPendingAppovels)