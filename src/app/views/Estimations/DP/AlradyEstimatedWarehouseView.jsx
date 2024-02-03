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
import FiltersEstimation from '../FiltersEstimation'
import * as appConst from '../../../../appconst'

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
            isEditable: true,

            data: [],
            allEstimationsloaded: false,
            filterData: { page: 0, limit: 20,['order[0]'] : ['estimation', 'DESC'] },
            totalItems: 0,


        }
    }


    async loadHospitalsEstimations() {
        this.setState({ allEstimationsloaded: false })

        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')
        let params = this.state.filterData
        params.estimation_id = this.props.id;
        params.item_id = this.props.item_id;
        params.institute_type = 'Provincial';
        //search_type:'EstimationMonthly',
        //params.finnished_estimaion = true;
        params.hospital_estimation_status=['Pending Approvals','APPROVED','Active'];
        params.district = login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district



        let res = await EstimationService.getAllEstimationITEMS(params)

        if (res.status == 200) {
            console.log("all estimation data hospital wise", res);
            let estimatedData = res.data?.view?.data

            if (dateParse(estimatedData[0]?.HosptialEstimation?.Estimation?.end_date) > dateParse(new Date())) {
                this.setState({ isEditable: true })
            } else {
                this.setState({ isEditable: false })
            }
            this.setState({
                data: estimatedData,
                totalItems: res.data?.view?.totalItems,
                totalPages: res.data?.view?.totalPages,
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
            hospital_estimation_status:['Pending Approvals','APPROVED','Active'],
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



    async submit(data) {
        console.log("clicked data", data)
        var owner_id_temp = await localStorageService.getItem('owner_id');
        let owner_id = this.state.owner_id || owner_id_temp
        const user = await localStorageService.getItem('userInfo');
        this.setState({ submitting: true })
        let formData = {
            //status: 'Submited',
            owner_id: owner_id,
            created_by: user.id,
            //item_id: data.item_id,
            jan: data.jan,
            feb: data.feb,
            mar: data.mar,
            apr: data.apr,
            may: data.may,
            june: data.june,
            july: data.july,
            aug: data.aug,
            sep: data.sep,
            oct: data.oct,
            nov: data.nov,
            dec: data.dec,
            estimation: data.estimation,
            remark: data.remark,
            stock_position: data.stock_position

        }

        let res = await EstimationService.addEstimationToItems(data.id, formData)
        console.log("Estimation Data added", res)
        if (res.status === 200) {

            let data = this.state.data

            this.setState({
                alert: true,
                message: 'Estimation Submit successfully!',
                severity: 'success',
                submitting: false
            }
                , () => {
                    this.loadHospitalsEstimations()
                }
            )
        } else {
            this.setState({
                alert: true,
                message: 'Estimation Edit was Unsuccessful!',
                severity: 'error',
                submitting: false
            })
        }


    }



    componentDidMount() {
        this.loadHospitalsEstimations()

    }

    render() {
        const { classes } = this.props
        let data = this.state.data
        const { openRows } = this.state;
        return (
            < Fragment >


                <div>
                    <FiltersEstimation
                        disableInstitiute={false}
                        disableYear={true}
                        disableCategery={true}
                        disableSearch={true}
                        onSubmit={(data) => {
                            let filterData = this.state.filterData
                            filterData = { ...filterData, ...data }
                            // Object.assign(filterData, data)
                            this.setState({ filterData }, () => {
                                this.setPage(0)
                            })
                        }}
                    ></FiltersEstimation>
                    <ValidatorForm className="w-full">

                        {/*  {this.state.allEstimationsloaded ?
                            <LoonsTable
                                className="mt-10"
                                //title={"All Aptitute Tests"}

                                id={'estimationStups'}
                                // title={'Active Prescription'}
                                data={this.state.data}
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
                                            <TableCell>Total Estimation
                                            <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => {
                                                        let filterData = this.state.filterData
                                                        filterData.orderby_sr = null
                                                        if (filterData['order[0]'][1] == 'DESC') {
                                                            filterData['order[0]'] = ['estimation', 'ASC']

                                                        } else {
                                                            filterData['order[0]'] = ['estimation', 'DESC']
                                                        }
                                                        this.setState({ filterData }, () => {
                                                            this.setPage(0)
                                                        })
                                                    }
                                                    }
                                                >
                                                    {this.state.filterData['order[0]'][1] == 'DESC' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </IconButton>


                                            </TableCell>
                                            <TableCell>Total Cost</TableCell>

                                            <TableCell>Last Year Estimation</TableCell>
                                            <TableCell>Estimation Deviation</TableCell>

                                            <TableCell>Remark</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row, index) => {
                                            // let data = this.state.data[index]
                                            let validate = true
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

                                            if (
                                                data[index].jan >= 0 &&
                                                data[index].feb >= 0 &&
                                                data[index].mar >= 0 &&
                                                data[index].apr >= 0 &&
                                                data[index].may >= 0 &&
                                                data[index].june >= 0 &&
                                                data[index].july >= 0 &&
                                                data[index].aug >= 0 &&
                                                data[index].sep >= 0 &&
                                                data[index].oct >= 0 &&
                                                data[index].nov >= 0 &&
                                                data[index].dec >= 0

                                            ) { validate = true }

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
                                                    <TableCell>
                                                        <Tooltip title="After Click You Can See Last Year Estimation, Consuptions and Other Informations. " arrow>

                                                            <TextValidator
                                                                disabled={!this.state.isEditable}
                                                                //className=" w-full"
                                                                // placeholder="Received Qty"
                                                                name="estimation"
                                                                InputLabelProps={{ shrink: false }}
                                                                value={this.state.data[index]?.estimation}
                                                                type="number"
                                                                variant="outlined"
                                                                size="small"
                                                                onFocus={() => openRows[row.id] ? null : this.handleRowToggle(row.id)}
                                                                //onBlur={() => this.handleRowToggle(row.item_id)}
                                                                onChange={(e) => {

                                                                    let enteredVal = parseFloat(e.target.value);
                                                                    let divided_val = Math.floor(enteredVal / 12) * 12; // Round down to the nearest multiple of 12
                                                                    let val = divided_val;
                                                                    data[index].estimation = enteredVal
                                                                    data[index].jan = val / 12
                                                                    data[index].feb = val / 12
                                                                    data[index].mar = val / 12
                                                                    data[index].apr = val / 12
                                                                    data[index].may = val / 12
                                                                    data[index].june = val / 12
                                                                    data[index].july = val / 12
                                                                    data[index].aug = val / 12
                                                                    data[index].sep = val / 12
                                                                    data[index].oct = val / 12
                                                                    data[index].nov = val / 12
                                                                    data[index].dec = val / 12 + (enteredVal % 12)
                                                                    this.setState({
                                                                        data
                                                                    })



                                                                }}

                                                            />
                                                        </Tooltip>

                                                    </TableCell>
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
                                                            {(validate && this.state.isEditable) &&
                                                                <Button
                                                                    style={{ height: 'fitContent' }}
                                                                    progress={this.submitting}
                                                                    disabled={!this.state.isEditable}
                                                                    onClick={() => {
                                                                        this.submit(data[index])
                                                                        /*  if ((Number(data[index].estimation) > (Number(this.state.estimationData?.estimation || 0) + Number(this.state.estimationData?.estimation || 0) * 10 / 100)) && (data[index]?.remark == null || data[index]?.remark == "" || data[index]?.remark == undefined)) {
                                                                             this.setState({
                                                                                 alert: true,
                                                                                 message: 'Your Total Estimation was Over the Limit. Pleace Enter the Remark',
                                                                                 severity: 'error',
                                                                                 submitting: false
                                                                             })
     
                                                                         } else {
                                                                             this.submit(data[index])
                                                                         } */
                                                                    }}
                                                                    scrollToTop={true}

                                                                >
                                                                    <span className="capitalize">
                                                                        <span className="capitalize">
                                                                            Save
                                                                        </span>
                                                                    </span>
                                                                </Button>
                                                            }

                                                            <Tooltip title="Hospital Estimation Item View/Edit">
                                                                <IconButton
                                                                    onClick={() => {
                                                                        window.open(
                                                                            `/estimation/cp_estimation_items/${row.hospital_estimation_id}/${row.HosptialEstimation?.warehouse_id}?sr_no=${row?.ItemSnap?.sr_no}`,
                                                                            '_blank'
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