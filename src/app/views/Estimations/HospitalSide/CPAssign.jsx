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
import CloseIcon from '@material-ui/icons/Close';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EditIcon from '@mui/icons-material/Edit';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import * as appConst from '../../../../appconst'
import EstimationService from 'app/services/EstimationService'
import InventoryService from 'app/services/InventoryService'
import localStorageService from 'app/services/localStorageService'
import AssignPharmacist from './AssignPharmacist'
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

class CPAssign extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 0,
            submitting: false,
            gerarating: false,
            loaded: false,
            assignPharmacist: false,
            selectedEstimation: null,
            alert: false,
            message: '',
            severity: 'success',
            filterData: {
                year: null,
                owner_id: null,
                page: 0,
                limit: 20,
                status: ['Active', 'Pending', 'GENERATED'],
                'order[0]': ['createdAt', 'DESC']
            },
            edit: false,
            editEstimationId: null,

            data: [],
            estimationStageData:[],
            columns: [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return <Grid className="flex items-center" >

                                {(this.state.data[dataIndex]?.status == "Pending" || this.state.data[dataIndex]?.status == "Active") && (new Date(dateParse(new Date())) <= new Date(dateParse(this.state.data[dataIndex]?.Estimation?.end_date))) ?
                                    <Button
                                        className=""
                                        style={{ height: 'fitContent' }}
                                        progress={this.state.gerarating}
                                        size="small"
                                        scrollToTop={true}
                                        //startIcon="save"
                                        onClick={() => { this.genarateEstimation(this.state.data[dataIndex]) }}
                                    >
                                        <span className="capitalize">
                                            <span className="capitalize">
                                                Generate
                                            </span>
                                        </span>
                                    </Button>
                                    :
                                    <div className='flex row'>
                                        {
                                            this.state.data[dataIndex].status == "GENERATED" &&
                                            <Tooltip title="Assign Pharmacist">
                                                <IconButton
                                                    onClick={() => {
                                                        this.setState({ selectedEstimation: this.state.data[dataIndex], assignPharmacist: true })

                                                    }}>
                                                    <AssignmentIndIcon color='primary' />
                                                </IconButton>
                                            </Tooltip>
                                        }

                                        <Tooltip title="View All Forecasted Estimations">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/estimation/cp_estimation_items/${this.state.data[dataIndex].id}/${this.state.data[dataIndex].warehouse_id}`

                                                }}>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>

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
                            let data = this.state.data[dataIndex]?.Estimation?.EstimationSetup?.year
                            return data
                        },
                    },
                },
                {
                    name: 'name',
                    label: 'Name',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Estimation?.name
                            return data
                        },
                    },
                },

                {
                    name: 'type',
                    label: 'Type',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Estimation?.type
                            return data
                        },
                    },
                },
                {
                    name: 'itemtype',
                    label: 'Item Type',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Estimation?.consumables
                            return appConst.item_type.find(x => x.value == data)?.label
                        },
                    },
                },

                {
                    name: 'institute_category',
                    label: 'Institute Category',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Estimation?.institute_category
                            return data
                        },
                    },
                },
                {
                    name: 'warehouse',
                    label: 'Warehouse',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Warehouse?.name
                            return data
                        },
                    },
                },
                {
                    name: 'from',
                    label: 'From',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Estimation?.from
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'to',
                    label: 'To',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Estimation?.to
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'start_date',
                    label: 'Submission Start Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Estimation?.start_date
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'end_date',
                    label: 'Submission End Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Estimation?.end_date
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'end_date',
                    label: 'DP Required Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Estimation?.dp_required_date
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'massage',
                    label: 'Message',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Estimation?.massage
                            let truncatedText = null;
                            if ((data != null || data != "") && data?.length > 15) {
                                truncatedText = data?.slice(0, 15) + "...";
                            } else {
                                truncatedText = data
                            }
                            return (
                                <Tooltip title={data} arrow>
                                    <p>{truncatedText}</p>
                                </Tooltip>
                            )

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
                {
                    name: 'Approval Stage',
                    label: 'Approval Stage',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.id
                            let toWho=this.state.estimationStageData.filter((x)=>x.hospital_estimation_id==data)
                            return toWho[0]?.approval_user_type
                        },
                    }
                },
            ]
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let res = await EstimationService.getEstimations(this.state.filterData)
        if (res.status == 200) {
            console.log("estimation data", res.data.view.data)
            this.setState({
                data: res.data.view.data,
                totalItems: res.data.view.totalItems,
                loaded: true
            })

            if (res.data.view.data.length > 0) {
               let estimationIds = res.data.view.data.map(x => x.id)
                this.loadEstimationStage(estimationIds)
            }
        }
    }

    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({ filterData }, () => { this.loadData() })
    }



    async genarateEstimation(data) {
        console.log("clicked data", data)
        var owner_id = await localStorageService.getItem('owner_id');
        this.setState({ gerarating: true })

        let formData = {
            hospital_estimation_id: data.id,
            consumables: data.Estimation?.consumables,
            item_category: data.Estimation?.item_category,
            item_priority: data.Estimation?.item_priority,

            owner_id: owner_id,
            warehouse_id: data.warehouse_id
        }

         let res = await EstimationService.GenarateHospitalEstimation(formData)
        console.log("Estimation Data added", res)
        if (res.status === 201) {
            this.setState({
                alert: true,
                message: 'Estimation Genarate successfully!',
                severity: 'success',
                gerarating: false
            }
                , () => {
                    this.setPage(0)
                }
            )
        } else {
            this.setState({
                alert: true,
                message: 'Estimation Genarate was Unsuccessful!',
                severity: 'error',
                gerarating: false
            })
        } 

    }


    async loadEstimationStage(estimationIds) {
        //this.setState({ loaded: false })
        let params = {
            status: 'Pending',
            //districts: this.state.filterData.districts,
            //institute_type: this.state.filterData.institute_type,
            hospital_estimation_id: estimationIds
        }
        let res = await EstimationService.getEstimationsApprovals(params)
        if (res.status == 200) {
            console.log("estimation stage data", res.data.view.data)

            this.setState({
                estimationStageData: res.data.view.data
            })
        }



    }

    async componentDidMount() {
        var owner_id = await localStorageService.getItem('owner_id');
        let filterData = this.state.filterData
        filterData.owner_id = owner_id
        this.setState({ filterData }, () => { this.loadData(); })


    }

    handleTabChange = (event, newValue) => {
        let filterData = this.state.filterData
        if (newValue == 0) {
            filterData.status = ['Active', 'Pending', 'GENERATED']
        } else {
            filterData.status = ['Pending Approvals']
        }

        this.setState({ activeTab: newValue, filterData }, () => { this.setPage(0) });
    };

    render() {
        const { classes } = this.props
        return (
            < Fragment >
                <MainContainer>
                    <LoonsCard className="mt-3">
                        <CardTitle title="Estimation Details" />
                        <div>
                            <Tabs
                                value={this.state.activeTab}
                                onChange={this.handleTabChange}

                                style={{ minHeight: 39, height: 26 }}
                                indicatorColor="primary"
                                variant='fullWidth'
                                textColor="primary"
                            >
                                <Tooltip title="Need To Finish Estimations." arrow>

                                    <Tab label="ACTIVE" />
                                </Tooltip>
                                <Tooltip title="Finished Estimations." arrow>
                                    <Tab label="OTHER" />
                                </Tooltip>

                            </Tabs>
                        </div>

                         <FiltersEstimation

                            disableInstitiute={true}
                            onSubmit={(data) => {
                                let filterData = this.state.filterData
                                //filterData == { ...filterData, ...data }
                                Object.assign(filterData, data)
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

                    </LoonsCard>
                </MainContainer>


                <Dialog fullWidth maxWidth="lg" open={this.state.assignPharmacist} onClose={() => { this.setState({ assignPharmacist: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                        <CardTitle title="Assign Pharmacist" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    assignPharmacist: false

                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>
                        <AssignPharmacist selectedData={this.state.selectedEstimation}></AssignPharmacist>
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

export default withStyles(styleSheet)(CPAssign)