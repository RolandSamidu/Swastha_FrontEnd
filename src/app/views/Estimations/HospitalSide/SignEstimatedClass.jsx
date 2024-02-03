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
import { yearMonthParse, dateParse, yearParse, convertTocommaSeparated, includesArrayElements } from 'utils'

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
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import localStorageService from 'app/services/localStorageService'


const styleSheet = (theme) => ({})

class SignEstimatedClass extends Component {
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
            employeesList: [],
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
            estimationsValues: [],

            columns: [

                {
                    name: 'class',
                    label: 'Class Name',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].description
                            return data
                        },
                    },
                },
                {
                    name: 'class',
                    label: 'Class Code',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].code
                            return data
                        },
                    },
                },
                {
                    name: 'Estimations',
                    label: 'Estimation',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let valueData = this.state.estimationsValues?.find(x => x.class_id == this.state.data[dataIndex].id)

                            return convertTocommaSeparated(valueData?.estimation || 0, 2)
                        },
                    },
                },
                {
                    name: 'value',
                    label: 'Value',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let valueData = this.state.estimationsValues?.find(x => x.class_id == this.state.data[dataIndex].id)
                            return convertTocommaSeparated(valueData?.total_value || 0, 2)
                        },
                    },
                }, {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return <Grid className="flex ">

                                <Tooltip title="View">
                                    <Button size="small"
                                    disabled={includesArrayElements(this.state.employeesList?.map(x=>x.class_id),[this.state.data[dataIndex].id])}

                                    onClick={() => {
                                        this.acceptEstimationValue(this.state.data[dataIndex].id)
                                    }}>
                                        Accept
                                    </Button>
                                </Tooltip>
                            </Grid>
                        },
                    },
                }

            ]
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let class_res = await ClassDataSetupService.fetchAllClass(this.state.filterData)
        if (class_res.status == 200) {
            console.log('Classes', class_res.data.view.data)
            let classIds = class_res?.data?.view?.data.map(x => x.id)
            await this.loadEmployeeList(classIds)
            this.loadEstimatedAmmount(classIds)

            this.setState({ data: class_res?.data?.view?.data })
        }
    }

    async loadEstimatedAmmount(classes) {

        let params = {
            search_type: "EstimationAmount",
            class_id: classes,
            hospital_estimation_id: this.props.selectedEstimation?.hospital_estimation_id
        }

        let res = await EstimationService.getAllEstimationITEMS(params)
        if (res.status == 200) {
            console.log("loaded data estimation", res.data?.view)
            this.setState({ estimationsValues: res.data?.view, loaded: true })

        }

    }

    async loadEmployeeList(classes) {

        let user_id = await localStorageService.getItem('userInfo').id
        let params = {
            employee_id:user_id,
            class_id: classes,
            hospital_estimation_id: this.props.selectedEstimation?.hospital_estimation_id

        }

        let res = await EstimationService.getEstimationsVerificationEmployees(params)

        if (res.status == 200) {
            
            let temp = []
            for (let index = 0; index < res?.data?.view?.data.length; index++) {
                const element = res?.data?.view?.data[index];

                temp.push({

                    id: element.id,
                    hospital_estimation_verify_id: element.hospital_estimation_verify_id,
                    class_id: element?.HospitalEstimateVerify?.class_id,
                    verified_date: element.createdAt,
                    employee: element?.Employee

                })
            }

            this.setState({ employeesList: temp })
            console.log("estimation verification data", temp);

            return true

        } else {
            return false
        }
    }


    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({ filterData }, () => { this.loadData() })
    }




    async componentDidMount() {
        console.log("selected estimation data", this.props.selectedEstimation)


        this.loadData();

    }



    async acceptEstimationValue(id) {
        this.setState({ submitting: true })

        let owner_id = await localStorageService.getItem('owner_id')
        //let user_info = await localStorageService.getItem('userInfo')
        let user_id = await localStorageService.getItem('userInfo').id

        let formData = {
            hospital_estimation_id: this.props.selectedEstimation?.hospital_estimation_id,
            employee_id: user_id,
            class_id: id,
            remarks: null,
            owner_id: owner_id
        }

        let res = await EstimationService.hospitalEstimationVerify(formData)
        console.log("Estimation Data added", res)
        if (res.status === 201) {
            this.setState({
                alert: true,
                message: 'Estimation Verification Successfully!',
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
                message: 'Estimation Verification was Unsuccessful!',
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
                <div className='w-full'>


                    <Grid>


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


                </div>

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

export default withStyles(styleSheet)(SignEstimatedClass)