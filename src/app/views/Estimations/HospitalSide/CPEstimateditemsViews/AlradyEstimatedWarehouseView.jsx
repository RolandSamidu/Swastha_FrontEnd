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
    Dialog,
    InputAdornment
} from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import moment from 'moment';

import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import { yearMonthParse, dateParse, timeParse } from 'utils'
import SearchIcon from '@material-ui/icons/Search'

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
import EstimationService from 'app/services/EstimationService'
import InventoryService from 'app/services/InventoryService'
import WarehouseServices from 'app/services/WarehouseServices'
import CategoryService from 'app/services/datasetupServices/CategoryService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import localStorageService from 'app/services/localStorageService'

import HistoryIcon from '@mui/icons-material/History';
import EstimationItemHistory from './Estimation_item_History';


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

class AlradyEstimatedWarehouseView extends Component {
    constructor(props) {
        super(props)
        this.state = {

            
            selectedHistoryId: null,
            openItemHistory:false,
            

           
            data: this.props.data,

            columns: [
               
                {
                    name: 'Warehouse',
                    label: 'Warehouse',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.SubEstimation?.Warehouse?.name
                            return data
                        },
                    },
                },
                {
                    name: 'Employee',
                    label: 'Responsible Person',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.SubEstimation?.Employee?.name
                            return data
                        },
                    },
                },
                {
                    name: 'date',
                    label: 'Submitted Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = dateParse(this.state.data[dataIndex]?.createdAt)
                            return data
                        },
                    },
                },
                {
                    name: 'estimation',
                    label: 'Total',
                },
                {
                    name: 'jan',
                    label: 'Jan',
                },
                {
                    name: 'feb',
                    label: 'Feb',
                },
                {
                    name: 'mar',
                    label: 'Mar',
                },
                {
                    name: 'apr',
                    label: 'Apr',
                },
                {
                    name: 'may',
                    label: 'May',
                },
                {
                    name: 'june',
                    label: 'June',
                },
                {
                    name: 'july',
                    label: 'July',
                },
                {
                    name: 'aug',
                    label: 'Aug',
                },
                {
                    name: 'sep',
                    label: 'Sep',
                },
                {
                    name: 'oct',
                    label: 'Oct',
                },
                {
                    name: 'nov',
                    label: 'Nov',
                },
                {
                    name: 'dec',
                    label: 'Dec',
                },
                {
                    name: 'remark',
                    label: 'Remark',
                },
                   {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return (
                            <Tooltip title="Item History">
                                    <IconButton
                                    onClick={() => {
                                        // console.log('dhdhdhhdhdhddhdd', this.state.data[dataIndex])
                                        this.setState({ 
                                            selectedHistoryId: this.state.data[dataIndex]?.sub_estimation_id,
                                            openItemHistory:true,
                                            history_item_loading: true,
                                        })

                                    }}>
                                    <HistoryIcon color='primary' />
                                </IconButton>
                            </Tooltip>
                            )
                        },
                    },
                },
                


            ]
        }
    }





    render() {
        const { classes } = this.props
        return (
            < Fragment >
                

                <div>
                    
                        <ValidatorForm className="w-full">
                            <LoonsTable
                                className="mt-10"
                                //title={"All Aptitute Tests"}

                                id={'estimationStups'}
                                // title={'Active Prescription'}
                                data={this.state.data}
                                columns={this.state.columns}
                                options={{
                                    pagination: false,
                                    serverSide: false,
                                  
                                    print: false,
                                    viewColumns: false,
                                    download: false,
                                    onRowClick: this.onRowClick,
                                    
                                }}
                            ></LoonsTable>
                        </ValidatorForm>
                       

                </div>

                
                <Dialog fullWidth maxWidth="lg" open={this.state.openItemHistory} onClose={() => { this.setState({ openItemHistory: false, viewCompleteEstimations:true}) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                        <CardTitle title="Item Estimations History" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    openItemHistory: false,
                                    viewCompleteEstimations:true

                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>
                         {this.state.history_item_loading ?
                            <EstimationItemHistory data={this.state.selectedHistoryId}></EstimationItemHistory>
                            :
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress
                                    size={30}
                                />
                            </Grid>
                        }
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

export default withStyles(styleSheet)(AlradyEstimatedWarehouseView)