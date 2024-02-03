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
import EditIcon from '@mui/icons-material/Edit';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import * as appConst from '../../../../../appconst'
import EstimationService from 'app/services/EstimationService'
import InventoryService from 'app/services/InventoryService'
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

class Estimations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            estimationYear: null,
            submitting: false,
            loaded: false,
            EstimationWarehouses: false,
            selectedEstimation: null,
            alert: false,
            message: '',
            severity: 'success',
            filterData: {
                estimation_setup_id: this.props.match.params.id,
                institute_category:'Provincial',
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
                            return <Grid className="flex ">

                                <Tooltip title="View Submitted Estimations">
                                    <IconButton
                                        onClick={() => {
                                            window.location.href = `/estimation/msd_estimation_items/${this.state.data[dataIndex].id}`

                                        }}>
                                        <VisibilityIcon color='primary' />
                                    </IconButton>
                                </Tooltip>

                                
                                
                            </Grid >
                        },
                    },
                },
                {
                    name: 'type',
                    label: 'Type',
                },
                {
                    name: 'name',
                    label: 'Name',
                },
                {
                    name: 'itemtype',
                    label: 'Item Type',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].consumables

                            return appConst.item_type.find(x => x.value == data)?.label
                        },
                    },
                },

                {
                    name: 'institute_category',
                    label: 'Institute Category',
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
                {
                    name: 'start_date',
                    label: 'Submission Start Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].start_date
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'end_date',
                    label: 'Submission End Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].end_date
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'end_date',
                    label: 'Devisional Pharmacist Required Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].dp_required_date
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'massage',
                    label: 'Message',
                },
            ]
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let res = await EstimationService.getAllEstimations(this.state.filterData)
        if (res.status == 200) {
            console.log("estimation data", res.data.view.data)
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


        const query = new URLSearchParams(this.props.location.search);
        const year = query.get('year')
    
        this.setState({
           estimationYear: yearParse(year)
        })

        this.loadData();
        //let hosID = this.props.id;
        //this.loadItemById(hosID);
    }



 
    render() {
        const { classes } = this.props
        return (
            < Fragment >
                <MainContainer>
                    <LoonsCard className="mt-3">
                    
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

export default withStyles(styleSheet)(Estimations)

