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
    Card,
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
import EstimationService from 'app/services/EstimationService'
import InventoryService from 'app/services/InventoryService'
import localStorageService from 'app/services/localStorageService'
import PatientServices from 'app/services/PatientServices'


const styleSheet = (theme) => ({})
const statList = [
    {
        icon: 'colorize',
        amount: 48,
        title: 'New Admissions',
    },
    {
        icon: 'attachment',
        amount: 291,
        title: 'Total Clinic Attendance',
    },
    {
        icon: 'mode_comment',
        amount: 291,
        title: 'Total OPD attendance',
    },
    {
        icon: 'remove_red_eye',
        amount: 110,
        title: 'Total Deaths',
    },
    {
        icon: 'remove_red_eye',
        amount: 110,
        title: 'Transfers IN',
    },
    {
        icon: 'remove_red_eye',
        amount: 110,
        title: 'Transfers Out',
    },
]

class HospitalGeneralStatistics extends Component {
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

           
        }
    }

    async loadData(date) {
        let owner_id = await localStorageService.getItem('owner_id')
        let filterData = { issuance_type: 'Ward',owner_id:owner_id,search_type: 'Midnight Report',date:date}//date
        
        this.setState({ loaded: false })
        let res = await await PatientServices.getMidnightReports(filterData)
        if (res.status == 200) {
            console.log("midnight data", res.data)
            this.setState({
                data: res?.data?.view?.data,
                loaded: true
            })
        }
    }

   

    async componentDidMount() {
        let user_id = await localStorageService.getItem('userInfo').id

        this.loadData(dateParse(new Date()));
        //let hosID = this.props.id;
        //this.loadItemById(hosID);
    }




    render() {
        // let { theme } = this.props
        // const { classes } = this.props
        // const zeroPad = (num, places) => String(num).padStart(places, '0')
        return (
            < Fragment >
                <div className='w-full'>
                <Grid container spacing={2}>
                {statList.map((item, ind) => (
                    <Grid key={item.title} item md={2} xs={6}>
                        <Card
                            elevation={3}
                            className="p-5 flex-column justify-center items-center"
                        >
                            {/* <div className="mb-6px">
                                <IconButton className="p-3 bg-light-gray">
                                    <Icon className="text-muted">
                                        {item.icon}
                                    </Icon>
                                </IconButton>
                            </div> */}

                            <h3 className="mt-1 text-32">
                                {item.amount.toLocaleString()}
                            </h3>
                            <p className="m-0 text-muted">{item.title}</p>
                        </Card>
                    </Grid>
                ))}
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

export default withStyles(styleSheet)(HospitalGeneralStatistics)

