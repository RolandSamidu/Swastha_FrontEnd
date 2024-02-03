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
    Checkbox
} from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
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
import InventoryService from 'app/services/InventoryService'
import localStorageService from 'app/services/localStorageService'
import ClinicService from 'app/services/ClinicService'

const styleSheet = (theme) => ({})

class EstimationWarehousesAssign extends Component {
    constructor(props) {
        super(props)
        this.state = {
            submitting: false,
            deleting: false,
            adding: false,
            loadedLeftData: false,
            loadedRightData: false,
            leftTotalItems: 0,
            rightTotalItems: 0,
            alert: false,
            message: '',
            severity: 'success',
            leftFilterData: {
                page: 0,
                limit: 10,
                estimation_id: this.props.selectedEstimation.id,
                select_type: 'NOTESTIMATEDWAREHOUSES',
                institute_type: this.props.selectedEstimation.institute_category,
                search: null
            },
            rightFilterData: {
                page: 0,
                limit: 10,
                estimation_id: this.props.selectedEstimation.id,
                institute_category: this.props.selectedEstimation.institute_category,
                search: null
            },

            leftData: [],
            rightData: [],
            leftInstitutes: [],
            rightInstitutes: [],
            rightSideSelectedItems: [],
            leftSideSelectedItems: [],

            leftColumns: [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let selected = this.state.leftSideSelectedItems?.find(x => x.id == this.state.leftData[dataIndex].id)

                            return <Grid className="flex ">
                                <Checkbox

                                    onChange={() => {
                                        let selectedData = this.state.leftData[dataIndex]
                                        let leftSideSelectedItems = this.state.leftSideSelectedItems

                                        if (selected == undefined) {
                                            leftSideSelectedItems.push(selectedData)
                                            this.setState({
                                                leftSideSelectedItems
                                            })
                                        } else {
                                            let index = leftSideSelectedItems?.indexOf(x => x.id == selectedData.id)
                                            leftSideSelectedItems.splice(index, 1)
                                            this.setState({
                                                leftSideSelectedItems
                                            })
                                        }

                                    }}

                                    defaultChecked={selected != undefined ? true : false}
                                    checked={selected != undefined ? true : false}

                                />
                            </Grid>
                        },
                    },
                },

                {
                    name: 'warehouse',
                    label: 'Warehouse',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.leftData[dataIndex]?.name
                            return data
                        },
                    },
                },
                {
                    name: 'Institute',
                    label: 'Institute',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let item = this.state.leftInstitutes?.filter((x) => x.owner_id == this.state.leftData[dataIndex]?.owner_id)

                            return item[0]?.name + '(' + item[0]?.Department?.name + ')'
                        },
                    },
                },

            ],
            rightColumns: [
                {
                    name: 'Action',
                    label: 'Select',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let selected = this.state.rightSideSelectedItems?.find(x => x.id == this.state.rightData[dataIndex].id)

                            return <Grid className="flex ">
                                <Checkbox

                                    onChange={() => {
                                        let selectedData = this.state.rightData[dataIndex]
                                        let rightSideSelectedItems = this.state.rightSideSelectedItems

                                        if (selected == undefined) {
                                            rightSideSelectedItems.push(selectedData)
                                            this.setState({
                                                rightSideSelectedItems
                                            })
                                        } else {
                                            let index = rightSideSelectedItems?.indexOf(x => x.id == selectedData.id)
                                            rightSideSelectedItems.splice(index, 1)
                                            this.setState({
                                                rightSideSelectedItems
                                            })
                                        }

                                    }}

                                    defaultChecked={selected != undefined ? true : false}
                                    checked={selected != undefined ? true : false}

                                />
                            </Grid>
                        },
                    },
                },

                {
                    name: 'warehouse',
                    label: 'Warehouse',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.rightData[dataIndex]?.Warehouse?.name
                            return data
                        },
                    },
                },
                {
                    name: 'Institute',
                    label: 'Institute',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let item = this.state.rightInstitutes?.filter((x) => x.owner_id == this.state.rightData[dataIndex]?.Warehouse?.owner_id)

                            return item[0]?.name + '(' + item[0]?.Department?.name + ')'
                        },
                    },
                },

            ]
        }
    }


    async loadRightData() {
        this.setState({ loaded: false })
        let res = await EstimationService.getEstimations(this.state.rightFilterData)
        if (res.status == 200) {
            //console.log("estimation warehouse data", res.data.view.data)
            let ownerIds=[]
            if(res.data?.view?.data.length>0){
                 ownerIds = res.data?.view?.data?.map(x => x.Warehouse?.owner_id)
            }
            
            let rightInstitutes = []
            if (ownerIds.length > 0) {
                rightInstitutes =await this.getPharmacyDet(ownerIds)
            }
            this.setState({
                rightData: res.data.view.data,
                rightTotalItems: res.data.view.totalItems,
                rightInstitutes:rightInstitutes,
                loadedRightData: true
            })
        }
    }

    async loadLeftData() {
        this.setState({ loaded: false })
        let res = await EstimationService.getEstimations(this.state.leftFilterData)
        if (res.status == 200) {
            console.log("estimation warehouse data", res.data.view.data)
            let ownerIds = res.data?.view?.data?.map(x => x.owner_id)
            let leftInstitutes = []
            if (ownerIds.length > 0) {
                leftInstitutes =await this.getPharmacyDet(ownerIds)
            }

            this.setState({
                leftData: res.data?.view?.data,
                leftTotalItems: res.data.view.totalItems,
                leftInstitutes: leftInstitutes,
                loadedLeftData: true
            })
        }
    }

    async setLeftPage(page) {
        let leftFilterData = this.state.leftFilterData
        leftFilterData.page = page
        this.setState({ leftFilterData }, () => { this.loadLeftData() })
    }
    async setRightPage(page) {
        let rightFilterData = this.state.rightFilterData
        rightFilterData.page = page
        this.setState({ rightFilterData }, () => { this.loadRightData() })
    }




    async getPharmacyDet(ownerIds) {

        let params = {
            issuance_type: ["Hospital", "RMSD Main"],
            // limit: 1, 
            // page: 0,
            'order[0]': ['createdAt', 'ASC'],
            selected_owner_id: ownerIds
        };

        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status == 200) {
            console.log('last data institutes', res.data?.view?.data)
            return res.data?.view?.data;

        } else {
            return []
        }


    }






    async componentDidMount() {

        this.loadRightData();
        this.loadLeftData();
        //let hosID = this.props.id;
        //this.loadItemById(hosID);
    }


    async unAssignWarehouse() {

        let rightSideSelectedItems = this.state.rightSideSelectedItems

        rightSideSelectedItems.map(async (x) => {
            this.setState({ deleting: true })
            let res = await EstimationService.deleteEstimation(x.id)
            if (res.status == 200) {
                console.log("estimation delete", res)
                let afterdelete = rightSideSelectedItems.filter((item) => item.id != x.id)
                this.setState({ deleting: false, rightSideSelectedItems: afterdelete }, () => {
                    this.loadRightData()
                    this.loadLeftData()
                })
            }
        })


    }

    async reAssignWarehouse() {

        let leftSideSelectedItems = this.state.leftSideSelectedItems

        leftSideSelectedItems.map(async (x) => {
            this.setState({ adding: true })
            let data = {
                estimation_id: this.props.selectedEstimation.id,
                warehouse_id: x.pharmacy_drugs_store_id,
                start_date: this.props.selectedEstimation.start_date,
                end_date: this.props.selectedEstimation.end_date,
                status:'Pending'
            }
            let res = await EstimationService.createHospitalItem(data)
            if (res.status == 201) {
                console.log("estimation added", res)
                let afterdelete = leftSideSelectedItems.filter((item) => item.id != x.id)
                this.setState({ adding: false, leftSideSelectedItems: afterdelete }, () => {
                    this.loadRightData()
                    this.loadLeftData()
                })
            }
        })


    }


    async submit() {
        this.setState({ submitting: true })

        let formData = this.state.formData;

        let res = await EstimationService.createEstimationSetup(formData)
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

    render() {
        // let { theme } = this.props
        // const { classes } = this.props
        // const zeroPad = (num, places) => String(num).padStart(places, '0')
        return (
            < Fragment >

                <Grid container spacing={1}>
                    {/*  left section */}
                    <Grid item lg={5} md={5} sm={12} xs={12} >
                        <CardTitle title="To be Assign Warehouses" />
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.setLeftPage(0)}
                            onError={() => null}
                        >
                            <Grid container spacing={1}>
                                <Grid item lg={10} md={10} sm={10} xs={10} >
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Search"
                                        name="left Search"

                                        value={this.state.leftFilterData.search}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let leftFilterData = this.state.leftFilterData
                                            leftFilterData.search = e.target.value
                                            this.setState({ leftFilterData })
                                        }}
                                       /*  validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]} */
                                    />
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2} >
                                    <Button
                                        className="mt-1 mr-2"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                    >
                                        <span className="capitalize">
                                            Filter
                                        </span>
                                    </Button>
                                </Grid>

                            </Grid>
                        </ValidatorForm>

                        <div className='w-full'>
                            {this.state.loadedLeftData ?
                                <LoonsTable
                                    className="mt-5"
                                    //title={"All Aptitute Tests"}

                                    id={'estimationStups'}
                                    // title={'Active Prescription'}
                                    data={this.state.leftData}
                                    columns={this.state.leftColumns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.leftTotalItems,
                                        // count: 10,
                                        rowsPerPage: this.state.leftFilterData.limit,
                                        page: this.state.leftFilterData.page,
                                        print: false,
                                        viewColumns: false,
                                        download: false,
                                        onTableChange: (action, tableState) => {
                                            console.log(action, tableState)
                                            switch (action) {
                                                case 'changePage':
                                                    this.setLeftPage(tableState.page)
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

                    {/*  Middle section */}
                    <Grid className='w-full h-full flex px-20' style={{ flexDirection: 'column', paddingTop: 100, paddingBottom: 100 }} item lg={2} md={2} sm={12} xs={12} >
                        <Button
                            className="mt-1 mr-2"
                            progress={this.state.adding}
                            variant="outlined"
                            onClick={() => { this.reAssignWarehouse() }}
                            scrollToTop={true}
                        >
                            <ArrowForwardIosIcon></ArrowForwardIosIcon>
                        </Button>

                        <Button
                            variant="outlined"
                            className="mt-1 mr-2"
                            progress={this.state.deleting}
                            onClick={() => { this.unAssignWarehouse() }}
                            scrollToTop={true}
                        >
                            <ArrowBackIosIcon></ArrowBackIosIcon>
                        </Button>

                    </Grid>

                    {/* Right section */}
                    <Grid item lg={5} md={5} sm={12} xs={12} >
                        <CardTitle title="Assigned Warehouses" />

                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.setRightPage(0)}
                            onError={() => null}
                        >
                            <Grid container spacing={1}>
                                <Grid item lg={10} md={10} sm={10} xs={10} >
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Search"
                                        name="left Search"

                                        value={this.state.rightFilterData.search}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let rightFilterData = this.state.rightFilterData
                                            rightFilterData.search = e.target.value
                                            this.setState({ rightFilterData })
                                        }}
                                        /* validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]} */
                                    />
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2} >
                                    <Button
                                        className="mt-1 mr-2"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                    >
                                        <span className="capitalize">
                                            Filter
                                        </span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>

                        <div className='w-full'>
                            {this.state.loadedRightData ?
                                <LoonsTable
                                    className="mt-5"
                                    //title={"All Aptitute Tests"}

                                    id={'estimationStups'}
                                    // title={'Active Prescription'}
                                    data={this.state.rightData}
                                    columns={this.state.rightColumns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.rightTotalItems,
                                        // count: 10,
                                        rowsPerPage: this.state.rightFilterData.limit,
                                        page: this.state.rightFilterData.page,
                                        print: false,
                                        viewColumns: false,
                                        download: false,
                                        onTableChange: (action, tableState) => {
                                            console.log(action, tableState)
                                            switch (action) {
                                                case 'changePage':
                                                    this.setRightPage(tableState.page)
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

export default withStyles(styleSheet)(EstimationWarehousesAssign)

