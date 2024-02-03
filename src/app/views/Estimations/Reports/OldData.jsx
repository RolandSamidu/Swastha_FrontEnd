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

class OldData extends Component {
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
                sr_no: this.props.sr_no,
                year: null,
                owner_id: this.props.owner_id,
                page: 0,
                limit: 20,
            },
            consumptionFilterData: {
                sr_no: this.props.sr_no,
                year: null,
                owner_id: this.props.owner_id,
                page: 0,
                limit: 20,
            },
            edit: false,
            editEstimationId: null,

            data: [],
            consumptionData: [],
            conTotalItems: 0,
            conLoaded: false,

            columns: [
                {
                    name: 'year',
                    label: 'Year',

                },
                {
                    name: 'warehouse',
                    label: 'Warehouse',

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
                    label: 'may',

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
                    name: 'estimation',
                    label: 'Total',

                },



            ],

            conColumns: [
                {
                    name: 'year',
                    label: 'Year',

                },
                {
                    name: 'warehouse',
                    label: 'Warehouse',

                },

                /*  {
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
                     label: 'may',
 
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
 
                 }, */
                {
                    name: 'consumption',
                    label: 'Total',

                },



            ]
        }
    }

    async loadData() {
        this.setState({ loaded: false })

        const userRoles = await localStorageService.getItem('userInfo').roles;
        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')
        let par = this.state.filterData
        if (includesArrayElements(userRoles, ['Devisional Pharmacist', 'RDHS']) && this.props.dpView) {
            par.owner_id = null
            par.district = login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district
        }
        let res = await EstimationService.getTempEstimations(par)
        if (res.status == 200) {
            console.log("estimation data", res.data.view.data)
            this.setState({
                data: res.data.view.data,
                totalItems: res.data.view.totalItems,
                loaded: true
            })
        }

    }

    async loadConsumptionData() {
        const { oldConsumptions } = this.props;
        this.setState({ conLoaded: false })


        const userRoles = await localStorageService.getItem('userInfo').roles;
        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')
        let par = this.state.consumptionFilterData
        if (includesArrayElements(userRoles, ['Devisional Pharmacist', 'RDHS']) && this.props.dpView) {
            par.owner_id = null
            par.district = login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district
        }


        let consupm_res = await EstimationService.getTempConsumption(par)
        if (consupm_res.status == 200) {
            console.log("consumption data", consupm_res.data.view.data)
            this.setState({
                consumptionData: consupm_res.data.view.data,
                conTotalItems: consupm_res.data.view.totalItems,
                conLoaded: true
            })

            oldConsumptions && oldConsumptions(consupm_res.data.view.data);
        }
    }

    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({ filterData }, () => { this.loadData() })
    }

    async setConPage(page) {
        let consumptionFilterData = this.state.consumptionFilterData
        consumptionFilterData.page = page
        this.setState({ consumptionFilterData }, () => { this.loadConsumptionData() })
    }




    async componentDidMount() {
        var owner_id = await localStorageService.getItem('owner_id');
        let filterData = this.state.filterData
        let consumptionFilterData = this.state.consumptionFilterData

        filterData.owner_id = owner_id
        consumptionFilterData.owner_id = owner_id

        this.setState({ filterData, consumptionFilterData }, () => { this.loadData(); this.loadConsumptionData() })


    }



    render() {
        const { classes } = this.props
        return (
            < Fragment >

                <Grid className='mt-10'>


                    {this.state.loaded ?
                        <LoonsTable
                            className="mt-5"
                            //title={"All Aptitute Tests"}

                            id={'oldestimation'}
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


                    <Grid className='w-full mt-5'>
                        <CardTitle title="Old Consumptions" />
                        {this.state.conLoaded ?
                            <LoonsTable
                                className="mt-5"
                                //title={"All Aptitute Tests"}

                                id={'oldconsumptions'}
                                // title={'Active Prescription'}
                                data={this.state.consumptionData}
                                columns={this.state.conColumns}
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: this.state.conTotalItems,
                                    // count: 10,
                                    rowsPerPage: this.state.consumptionFilterData.limit,
                                    page: this.state.consumptionFilterData.page,
                                    print: false,
                                    viewColumns: false,
                                    download: false,
                                    onRowClick: this.onRowClick,
                                    onTableChange: (action, tableState) => {
                                        console.log(action, tableState)
                                        switch (action) {
                                            case 'changePage':
                                                this.setConPage(tableState.page)
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

export default withStyles(styleSheet)(OldData)