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
import { yearMonthParse, dateParse, yearParse, convertTocommaSeparated, roundDecimal } from 'utils'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HistoryIcon from '@mui/icons-material/History';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Pagination from '@material-ui/lab/Pagination';
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
import * as appConst from '../../../../../appconst'

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

            openRows: {},
            isEditable:false,

            EstimatedHospitalData: [],
            allEstimationsloaded: false,
            filterData: { page: 0, limit: 20 },
            totalItems: 0,


            columns: [

                {
                    name: 'Institiute',
                    label: 'Institiute',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.HosptialEstimation?.Warehouse?.name
                            return data
                        },
                    },
                },
                /* {
                    name: 'Employee',
                    label: 'Responsible Person',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.SubEstimation?.Employee?.name
                            return data
                        },
                    },
                }, */
                {
                    name: 'date',
                    label: 'Submitted Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = dateParse(this.state.EstimatedHospitalData[dataIndex]?.createdAt)
                            return data
                        },
                    },
                },

                {
                    name: 'jan',
                    label: 'Jan',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.jan
                            return convertTocommaSeparated(data, 2)
                        },
                    },
                },
                {
                    name: 'feb',
                    label: 'Feb',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.feb
                            return convertTocommaSeparated(data, 2)
                        },
                    },
                },
                {
                    name: 'mar',
                    label: 'Mar',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.mar
                            return convertTocommaSeparated(data, 2)
                        },
                    },
                },
                {
                    name: 'apr',
                    label: 'Apr',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.apr
                            return convertTocommaSeparated(data, 2)
                        },
                    },
                },
                {
                    name: 'may',
                    label: 'May',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.may
                            return convertTocommaSeparated(data, 2)
                        },
                    },
                },
                {
                    name: 'june',
                    label: 'June',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.june
                            return convertTocommaSeparated(data, 2)
                        },
                    },
                },
                {
                    name: 'july',
                    label: 'July',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.july
                            return convertTocommaSeparated(data, 2)
                        },
                    },
                },
                {
                    name: 'aug',
                    label: 'Aug',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.aug
                            return convertTocommaSeparated(data, 2)
                        },
                    },
                },
                {
                    name: 'sep',
                    label: 'Sep',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.sep
                            return convertTocommaSeparated(data, 2)
                        },
                    },
                },
                {
                    name: 'oct',
                    label: 'Oct',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.oct
                            return convertTocommaSeparated(data, 2)
                        },
                    },
                },
                {
                    name: 'nov',
                    label: 'Nov',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.nov
                            return convertTocommaSeparated(data, 2)
                        },
                    },
                },
                {
                    name: 'dec',
                    label: 'Dec',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.dec
                            return convertTocommaSeparated(data, 2)
                        },
                    },
                }, {
                    name: 'estimation',
                    label: 'Total',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.estimation
                            return convertTocommaSeparated(data, 2)
                        },
                    },
                },
                {
                    name: 'remark',
                    label: 'Remark',
                },
                {
                    name: 'standard_cost',
                    label: 'Sandard Cost',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.ItemSnap?.standard_cost
                            return convertTocommaSeparated(data, 2)
                        }
                    }
                },

                {
                    name: 'standard_cost',
                    label: 'Total Cost',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]?.ItemSnap?.standard_cost
                            let estimation = this.state.EstimatedHospitalData[dataIndex]?.estimation
                            return convertTocommaSeparated((Number(data) * Number(estimation)), 2)
                        }
                    }
                },

                {
                    name: 'Last Year Estimation',
                    label: 'Last Year Estimation',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let warehouse_id = this.state.EstimatedHospitalData[dataIndex]?.HosptialEstimation?.warehouse_id
                            let itemEstimation = this.state.estimationDataAll?.filter((x) => x.warehouse_id == warehouse_id)[0]?.estimation || null
                            return convertTocommaSeparated(itemEstimation, 2)
                        }
                    }
                },
                {
                    name: 'Estimation Deviation',
                    label: 'Estimation Deviation',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]
                            let warehouse_id = this.state.EstimatedHospitalData[dataIndex]?.HosptialEstimation?.warehouse_id
                            let estimation = this.state.EstimatedHospitalData[dataIndex]?.estimation

                            let itemEstimation = this.state.estimationDataAll?.filter((x) => x.warehouse_id == warehouse_id)[0]?.estimation || null
                            let deviation = roundDecimal(((Number(data.estimation) - Number(itemEstimation || 0)) / Number(itemEstimation == 0 ? 1 : itemEstimation || 1) * 100), 2)

                            let rowColor = ""
                            if (deviation > 10) {
                                rowColor = 'red'
                            } else if (deviation < -10) {
                                rowColor = '#fff145'
                            } else if (-10 <= deviation <= 10) {
                                rowColor = '#00e183'
                            }




                            return <div className='flex justify-center text-center items-center' style={{ width: 90, height: 25, borderRadius: 50, backgroundColor: rowColor }}>
                                {deviation} %
                            </div>
                        }
                    }
                },


                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.EstimatedHospitalData[dataIndex]
                            return <Tooltip title="Hospital Estimation Item View/Edit">
                                <IconButton
                                    onClick={() => {
                                        window.open(
                                            `/estimation/cp_estimation_items/${data.hospital_estimation_id}/${data.HosptialEstimation?.warehouse_id}?sr_no=${data?.ItemSnap?.sr_no}`,
                                            '_blank' // <- This is what makes it open in a new window.
                                        );
                                    }}>
                                    <VisibilityIcon color='primary' />
                                </IconButton>
                            </Tooltip>
                        },
                    },
                },


            ]
        }
    }


    async loadHospitalsEstimations() {
        this.setState({ allEstimationsloaded: false })

        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')

        let params = {
            estimation_id: this.props.id,
            item_id: this.props.item_id,
            institute_type: 'Provincial',
            limit: this.state.filterData.limit,
            page: this.state.filterData.page,
            //search_type:'EstimationMonthly',
            finnished_estimaion: true,
            district: login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district

        }

        let res = await EstimationService.getAllEstimationITEMS(params)

        if (res.status == 200) {
            console.log("all estimation data hospital wise", res);
            let estimatedData = res.data?.view?.data

            this.setState({
                EstimatedHospitalData: estimatedData,
                totalItems: res.data?.view?.totalItems,
                totalPages:res.data?.view?.totalPages

            })
            if (estimatedData.length > 0) {
                this.loadLastYearEstimations(estimatedData.map(x => x.HosptialEstimation?.warehouse_id))
            } else {
                this.setState({
                    allEstimationsloaded: true,

                })
            }

        } else {
            this.setState({ allEstimationsloaded: true })

        }
    }

    async loadLastYearEstimations(warehouse_id) {
        let owner_id = await localStorageService.getItem('owner_id')
        let estimationYear = Number(this.props.estimationData?.EstimationSetup?.year) - 1
        console.log("estimation year for DP", this.props.estimationData)
        const firstDay = new Date(estimationYear, 0, 1);

        // Create a new Date object for the last day of the year
        // To get the last day of the year, go to the first day of the next year (January 1 of next year)
        const lastDay = new Date(estimationYear, 0, 0);



        let par = {
            item_id: this.props.item_id,
            warehouse_id: warehouse_id,
            year: estimationYear,
            //estimation_from: dateParse(firstDay),
            //estimation_to: dateParse(lastDay),
            estimation_type: 'Annual',
            search_type: 'EstimationGroup'
        }


        let resp = await EstimationService.getAllEstimationITEMS(par)

        console.log("dp load last year estimations", resp)

        if (resp.status === 200) {
            let finalData = resp.data.view.filter(x => x.year == estimationYear)
            console.log('last year estimations', finalData)
            this.setState({
                estimationDataAll: finalData,
                allEstimationsloaded: true,
            })

        } else {
            this.setState({
                allEstimationsloaded: true,
            })
        }
    }

    handleRowToggle = (rowId) => {
        this.setState((prevState) => ({
            openRows: {
                //...prevState.openRows,
                [rowId]: !prevState.openRows[rowId]
            }
        }));
    };

    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({ filterData }, () => { this.loadHospitalsEstimations() })
    }


    componentDidMount() {
        this.loadHospitalsEstimations()

    }

    render() {
        const { classes } = this.props
        let data = this.state.EstimatedHospitalData
        const { openRows } = this.state;
        return (
            < Fragment >


                <div>

                    <ValidatorForm className="w-full">

                       {/*  {this.state.allEstimationsloaded ?
                            <LoonsTable
                                className="mt-10"
                                //title={"All Aptitute Tests"}

                                id={'estimationStups'}
                                // title={'Active Prescription'}
                                data={this.state.EstimatedHospitalData}
                                columns={this.state.columns}
                                options={{
                                    pagination: true,
                                    serverSide: false,

                                    print: false,
                                    viewColumns: false,
                                    download: false,
                                    onRowClick: this.onRowClick,
                                    count: this.state.totalItems,
                                    rowsPerPage: this.state.filterData.limit,
                                    page: this.state.filterData.page,
                                    onTableChange: (
                                        action,
                                        tableState
                                    ) => {
                                        console.log(action, tableState)
                                        switch (action) {
                                            case 'changePage':
                                                this.setPage(
                                                    tableState.page
                                                )
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
                            : <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress
                                    size={30}
                                />
                            </Grid>} */}


                        <div>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell>Institiute</TableCell>
                                            <TableCell>Level</TableCell>
                                            <TableCell>Submitted Date</TableCell>
                                            
                                            <TableCell>Standard Cost</TableCell>
                                            <TableCell>Total Estimation</TableCell>
                                            <TableCell>Total Cost</TableCell>
                                            
                                            <TableCell>Last Year Estimation</TableCell>
                                            <TableCell>Estimation Deviation</TableCell>

                                            <TableCell>Remark</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row, index) => {
                                            // let data = this.state.EstimatedHospitalData[index]
                                            let warehouse_id = row.HosptialEstimation?.warehouse_id
                                            let estimation = row?.estimation

                                            let itemEstimation = this.state.estimationDataAll?.filter((x) => x.warehouse_id == warehouse_id)[0]?.estimation || null
                                            let deviation = roundDecimal(((Number(row.estimation) - Number(itemEstimation || 0)) / Number(itemEstimation == 0 ? 1 : itemEstimation || 1) * 100), 2)

                                            let rowColor = ""
                                            if (deviation > 10) {
                                                rowColor = 'red'
                                            } else if (deviation < -10) {
                                                rowColor = '#fff145'
                                            } else if (-10 <= deviation <= 10) {
                                                rowColor = '#00e183'
                                            }

                                            let standard_cost = row?.ItemSnap?.standard_cost

                                            let total_cost = (Number(row.ItemSnap?.standard_cost) * Number(row.estimation))



                                            return (<React.Fragment key={row.id}>
                                                <TableRow >
                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="expand row"
                                                            size="small"
                                                            onClick={() => this.handleRowToggle(row.id)}
                                                        >
                                                            {openRows[row.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{row?.HosptialEstimation?.Warehouse?.name}</TableCell>
                                                    <TableCell>{row?.HosptialEstimation?.Warehouse?.Pharmacy_drugs_store?.institution_level}</TableCell>
                                                    <TableCell>{dateParse(row?.createdAt)}</TableCell>
                                                
                                                    <TableCell>{convertTocommaSeparated(row.ItemSnap?.standard_cost, 2)}</TableCell>
                                                    <TableCell>{convertTocommaSeparated(row.estimation, 2)}</TableCell>
                                                    <TableCell>{convertTocommaSeparated(total_cost, 2)}</TableCell>
                                                    
                                                    <TableCell>{convertTocommaSeparated(itemEstimation, 2)}</TableCell>
                                                    <TableCell>
                                                        <div className='flex justify-center text-center items-center' style={{ width: 90, height: 25, borderRadius: 50, backgroundColor: rowColor }}>
                                                            {deviation} %
                                                        </div>

                                                    </TableCell>
                                                    <TableCell>{row.remark}</TableCell>



                                                    <TableCell>
                                                        <div className='flex items-center' style={{ marginLeft: '-10px' }}>
                                                            <Tooltip title="Hospital Estimation Item View/Edit">
                                                                <IconButton
                                                                    onClick={() => {
                                                                        window.open(
                                                                            `/estimation/cp_estimation_items/${row.hospital_estimation_id}/${row.HosptialEstimation?.warehouse_id}?sr_no=${row?.ItemSnap?.sr_no}`,
                                                                            '_blank' // <- This is what makes it open in a new window.
                                                                        );
                                                                    }}>
                                                                    <VisibilityIcon color='primary' />
                                                                </IconButton>
                                                            </Tooltip>




                                                        </div>

                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className={classes.rootCell} colSpan={13}>
                                                        <Collapse style={{ backgroundColor: '#d7dffa' }} in={openRows[row.id]} timeout="auto" unmountOnExit>
                                                            {/* Content you want to show when row is expanded */}
                                                            <div className='w-full px-10 py-5'>
                                                                <Grid container spacing={2}>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Jan"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}
                                                                            // placeholder="Received Qty"
                                                                            name="jan"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={row?.jan}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                 

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Feb"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="feb"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={row?.feb}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Mar"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="mar"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={row?.mar}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                           

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Apr"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="apr"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={row?.apr}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="May"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="may"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={row?.may}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            
                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="June"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="june"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={row?.june}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                           

                                                                        />
                                                                    </Grid>

                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="July"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="July"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={row?.july}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            

                                                                        />
                                                                    </Grid>

                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Aug"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="aug"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={row?.aug}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                           
                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Sep"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="sep"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={row?.sep}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                           
                                                                        />
                                                                    </Grid>

                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Oct"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="oct"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={row?.oct}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Nov"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="nov"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={row?.nov}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Dec"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="dec"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={row?.dec}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            

                                                                        />
                                                                    </Grid>

                                                                </Grid>
                                                                


                                                            </div>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>)
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div className="flex justify-end mt-3">
                            <ValidatorForm onSubmit={() => { this.setPage(this.state.filterData.page) }}>
                                    <TextValidator
                                        className='mt--1 w-100'

                                        name="Page"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.filterData.page + 1}
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let filterData = this.state.filterData
                                            filterData.page = e.target.value - 1
                                            this.setState({ filterData })

                                        }}

                                    />
                                </ValidatorForm>
                                <Pagination count={this.state.totalPages} page={this.state.filterData.page + 1} onChange={(e, value) => { this.setPage(value - 1) }} />
                            </div>
                        </div>




                    </ValidatorForm>


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

export default withStyles(styleSheet)(AlradyEstimatedWarehouseView)