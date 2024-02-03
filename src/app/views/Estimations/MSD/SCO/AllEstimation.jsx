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
import * as appConst from '../../../../../appconst'
import EstimationService from 'app/services/EstimationService'
import InventoryService from 'app/services/InventoryService'
import localStorageService from 'app/services/localStorageService'


const styleSheet = (theme) => ({})

class EstimationSetup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            submitting: false,
            loaded: false,
            alert: false,
            message: '',
            severity: 'success',
            totalItems: 0,

            filterData: {
                page: 0,
                limit: 20,
                institute_type : 'Provincial',
                'order[0]': ['createdAt', 'DESC'] 
            },
            edit: false,
            editEstimationId: null,
            formData: {
                created_by: null,
                year: null,
                from: null,
                to: null
            },
            data: [],

            columns: [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return <Grid className="flex ">


                                


                                <Tooltip title="View Submitted Estimations">
                                    <IconButton
                                        onClick={() => {
                                            window.location.href = `/all_estimation_msd/${this.state.data[dataIndex].id}/'null'`

                                        }}>
                                        <VisibilityIcon color='primary' />
                                    </IconButton>
                                </Tooltip>


                            </Grid>
                        },
                    },
                },
                {
                    name: 'year',
                    label: 'Year',
                },
                {
                    name: 'from',
                    label: 'From',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].from
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'to',
                    label: 'To',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].to
                            return dateParse(data)
                        },
                    },
                },
            ]
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let res = await EstimationService.getEstimationsSetups(this.state.filterData)
        if (res.status == 200) {
            console.log("estimation data", res.data.view.data)
            this.setState({
                data: res?.data?.view?.data,
                totalItems: res?.data?.view?.totalItems,
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
        let user_id = await localStorageService.getItem('userInfo').id

        let formData = this.state.formData
        formData.created_by = user_id
        this.setState({ formData })
        this.loadData();
        //let hosID = this.props.id;
        //this.loadItemById(hosID);
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

    async editSubmit() {
        this.setState({ submitting: true })

        let formData = this.state.formData;

        let res = await EstimationService.EditEstimationSetup(this.state.editEstimationId, formData)
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
                    <LoonsCard className="mt-3">
                        <CardTitle title="Estimation Setup" />


                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => { this.state.edit ? this.editSubmit() : this.submit() }}
                            onError={() => null}
                        >

                            <Grid className='mt-3' container spacing={2}>

                                <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                    <SubTitle title="Estimation Year" />
                                    <DatePicker
                                        minDate={yearParse(new Date())}
                                        className="w-full"
                                        onChange={(date) => {
                                            let formData = this.state.formData
                                            formData.year = yearParse(date)
                                            formData.from = dateParse(new Date(yearParse(date), 0, 1));  // January 1st of the specified year
                                            formData.to = dateParse(new Date(yearParse(date), 11, 31)); // December 31st of the specified year

                                            this.setState({ formData })
                                            console.log(this.state.formData.year)
                                        }}
                                        format="yyyy"
                                        openTo='year'

                                        views={["year"]}
                                        value={this.state.formData.year}/* new Date(this.state.formData.year, 0, 1) */
                                        placeholder="Year"
                                        required={true}
                                        errorMessages="This Field is Required"
                                    />
                                </Grid>





                                <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12}
                                >
                                    <SubTitle title="From" />
                                    <DatePicker
                                        className="w-full"
                                        value={this.state.formData.from}
                                        disabled={this.state.formData.type === null || this.state.formData.type === ' ' ? true : false}
                                        placeholder="Date From"
                                        //views={['year', 'month']}
                                        // inputFormat="yyyy-MM"
                                        //format="MM/yyyy"

                                        // maxDate={new Date()}
                                        required={true}
                                        errorMessages="This Field is Required"
                                        onChange={date => {
                                            let formData = this.state.formData;
                                            formData.from = dateParse(date);
                                            this.setState({ formData })

                                        }}
                                    />
                                </Grid>
                                <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12}
                                >
                                    <SubTitle title="To" />
                                    <DatePicker
                                        className="w-full "
                                        value={this.state.formData.to}
                                        placeholder="Date To"
                                        disabled={this.state.formData.from == null || this.state.formData.from === " " ? true : false}
                                        //views={['year', 'month']}
                                        /*  minDate={ this.state.formData.type === "Annual"?
                                         moment(this.state.formData.from ).add(1, 'years'):  moment(this.state.formData.from ).add(1, 'months')
                                         }
                                         maxDate={ this.state.formData.type === "Annual"?
                                         moment(this.state.formData.from ).add(1, 'years'):  moment(this.state.formData.from ).add(12, 'months')
                                         } */
                                        minDate={this.state.formData.from}
                                        // maxDate={new Date()}
                                        required={true}
                                        errorMessages="This Field is Required"
                                        //inputFormat="yyyy-MM"
                                        // format="MM/yyyy"
                                        onChange={date => {
                                            let formData = this.state.formData;
                                            formData.to = dateParse(date);
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






                        <Grid className='mt-10'>

                            <CardTitle title="All Estimation" />

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

export default withStyles(styleSheet)(EstimationSetup)

