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

import { Autocomplete, Alert } from '@material-ui/lab'
import 'date-fns'
import { yearMonthParse, dateParse, yearParse } from 'utils'
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

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Pagination from '@material-ui/lab/Pagination';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import EstimationService from 'app/services/EstimationService'
import InventoryService from 'app/services/InventoryService'
import WarehouseServices from 'app/services/WarehouseServices'
import CategoryService from 'app/services/datasetupServices/CategoryService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import localStorageService from 'app/services/localStorageService'
import Filters from '../Filters'


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
        '& > *': {
            borderBottom: 'unset',
        },
    },
    rootCell: {
        padding: '0px !important'
    }
})

class ViewAllEstimationsItemWise extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isEditable: false,
            rows: [
                { id: 1, name: 'John', age: 25 },
                { id: 2, name: 'Jane', age: 30 },
                // ... other rows
            ],
            openRows: {},

            submitting: false,
            loaded: false,
            alert: false,
            message: '',
            severity: 'success',
            totalItems: 0,
            totalPages: 0,

            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],

            filterData: {
                used_for_estimates: 'Y',
                institutes: [1, 2, 3, 4, 5, 6],
                page: 0,
                limit: 10,
                orderby_sr: true,
                'order[0]': ['updatedAt', 'DESC']
            },
            edit: false,
            editEstimationId: null,
            selected_view_data: null,
            viewCompleteEstimations: false,
            formData: {

            },
            data: [],


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





    async loadEstimationData(itemsData) {
        this.setState({ loaded: false })

        let item_ids = itemsData.map(x => x.id)

        let filterData = {
            search_type: 'EstimationMonthly',
            item_id: item_ids,
            no_rmsd: true,
            orderby_sr: true,
            estimation_id: this.props.match.params.id
        }

        let res = await EstimationService.getAllEstimationITEMS(filterData)


        let data = []

        if (res.status == 200) {
            console.log("all estimation data", res.data.view);

            for (let index = 0; index < itemsData.length; index++) {
                const element = itemsData[index];
                const EstimationItem = res?.data?.view?.find(x => x.item_id == element.id)
                data.push({
                    sr_no: element.sr_no,
                    medium_description: element.medium_description,
                    item_level: element.Institution?.name,
                    item_id: element.id,
                    jan: EstimationItem?.January || 0,
                    feb: EstimationItem?.February || 0,
                    mar: EstimationItem?.March || 0,
                    apr: EstimationItem?.April || 0,
                    may: EstimationItem?.May || 0,
                    june: EstimationItem?.June || 0,
                    july: EstimationItem?.July || 0,
                    aug: EstimationItem?.August || 0,
                    sep: EstimationItem?.September || 0,
                    oct: EstimationItem?.October || 0,
                    nov: EstimationItem?.November || 0,
                    dec: EstimationItem?.December || 0,
                    estimation: EstimationItem?.estimation || 0,
                    real_estimation: EstimationItem?.real_estimation || 0
                })
            }


            this.setState({
                data: data,
                loaded: true
            })

        } else {
            this.setState({ loaded: true })

        }
    }



    async loadData() {
        this.setState({ loaded: false })
        let owner_id = await localStorageService.getItem('owner_id')
        let filterData = this.state.filterData
        //filterData.owner_id = owner_id
        filterData.orderby_sr = true
        let res = await InventoryService.fetchAllItems(filterData);
        let data = []
        if (res.status == 200) {

            console.log("all item data", res.data?.view?.data);
            if (res.data?.view?.data?.length > 0) {
                this.loadEstimationData(res.data?.view?.data)
            } else {
                this.setState({ data: [], loaded: true })
            }


            this.setState({
                totalItems: res.data?.view?.totalItems,
                totalPages: res.data?.view?.totalPages,

            })


        } else {
            this.setState({ data: [], loaded: true })

        }
    }

    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({ filterData }, () => { this.loadData() })
    }







    async componentDidMount() {
        this.loadData()
        //this.loadFilterData()
    }





    render() {
        const { classes } = this.props
        const { data, openRows } = this.state;

        return (
            < Fragment >

                <MainContainer>
                    <LoonsCard className="mt-3">
                        <CardTitle title="Estimation Details" />

                        <Filters onSubmit={(data) => {
                            let filterData = this.state.filterData
                            //filterData == { ...filterData, ...data }
                            Object.assign(filterData, data)
                            this.setState({ filterData }, () => {
                                this.setPage(0)
                            })
                        }}></Filters>


                        <div>
                            {this.state.loaded ?
                                <ValidatorForm className="w-full mt-5">


                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell />
                                                    <TableCell>SR No</TableCell>
                                                    <TableCell>Item Name</TableCell>
                                                    <TableCell>Total Estimation</TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data.map((row, index) => {
                                                    let validate = false
                                                    if (
                                                        data[index].jan &&
                                                        data[index].feb &&
                                                        data[index].mar &&
                                                        data[index].apr &&
                                                        data[index].may &&
                                                        data[index].june &&
                                                        data[index].july &&
                                                        data[index].aug &&
                                                        data[index].sep &&
                                                        data[index].oct &&
                                                        data[index].nov &&
                                                        data[index].dec
                                                    ) { validate = true }
                                                    return (<React.Fragment key={row.item_id}>
                                                        <TableRow>
                                                            <TableCell>
                                                                <IconButton
                                                                    aria-label="expand row"
                                                                    size="small"
                                                                    onClick={() => this.handleRowToggle(row.item_id)}
                                                                >
                                                                    {openRows[row.item_id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                                </IconButton>
                                                            </TableCell>
                                                            <TableCell>{row.sr_no}</TableCell>
                                                            <TableCell>{row.medium_description}</TableCell>
                                                            <TableCell>
                                                                {this.state.data[index]?.estimation}
                                                            </TableCell>



                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className={classes.rootCell} colSpan={6}>
                                                                <Collapse style={{ backgroundColor: '#d7dffa' }} in={openRows[row.item_id]} timeout="auto" unmountOnExit>
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
                                                                                    value={this.state.data[index]?.jan}
                                                                                    type="number"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onChange={(e) => {

                                                                                        let data = this.state.data
                                                                                        data[index].jan = parseFloat(e.target.value)
                                                                                        data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                        this.setState({
                                                                                            data
                                                                                        })

                                                                                    }}

                                                                                />
                                                                            </Grid>
                                                                            <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                                <SubTitle title="Feb"></SubTitle>
                                                                                <TextValidator
                                                                                    disabled={!this.state.isEditable}

                                                                                    // placeholder="Received Qty"
                                                                                    name="feb"
                                                                                    InputLabelProps={{ shrink: false }}
                                                                                    value={this.state.data[index]?.feb}
                                                                                    type="number"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onChange={(e) => {

                                                                                        let data = this.state.data
                                                                                        data[index].feb = parseFloat(e.target.value)
                                                                                        data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                        this.setState({
                                                                                            data
                                                                                        })

                                                                                    }}

                                                                                />
                                                                            </Grid>
                                                                            <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                                <SubTitle title="Mar"></SubTitle>
                                                                                <TextValidator
                                                                                    disabled={!this.state.isEditable}

                                                                                    // placeholder="Received Qty"
                                                                                    name="mar"
                                                                                    InputLabelProps={{ shrink: false }}
                                                                                    value={this.state.data[index]?.mar}
                                                                                    type="number"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onChange={(e) => {

                                                                                        let data = this.state.data
                                                                                        data[index].mar = parseFloat(e.target.value)
                                                                                        data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                        this.setState({
                                                                                            data
                                                                                        })

                                                                                    }}

                                                                                />
                                                                            </Grid>
                                                                            <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                                <SubTitle title="Apr"></SubTitle>
                                                                                <TextValidator
                                                                                    disabled={!this.state.isEditable}

                                                                                    // placeholder="Received Qty"
                                                                                    name="apr"
                                                                                    InputLabelProps={{ shrink: false }}
                                                                                    value={this.state.data[index]?.apr}
                                                                                    type="number"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onChange={(e) => {

                                                                                        let data = this.state.data
                                                                                        data[index].apr = parseFloat(e.target.value)
                                                                                        data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                        this.setState({
                                                                                            data
                                                                                        })

                                                                                    }}

                                                                                />
                                                                            </Grid>
                                                                            <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                                <SubTitle title="May"></SubTitle>
                                                                                <TextValidator
                                                                                    disabled={!this.state.isEditable}

                                                                                    // placeholder="Received Qty"
                                                                                    name="may"
                                                                                    InputLabelProps={{ shrink: false }}
                                                                                    value={this.state.data[index]?.may}
                                                                                    type="number"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onChange={(e) => {

                                                                                        let data = this.state.data
                                                                                        data[index].may = parseFloat(e.target.value)
                                                                                        data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                        this.setState({
                                                                                            data
                                                                                        })

                                                                                    }}

                                                                                />
                                                                            </Grid>
                                                                            <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                                <SubTitle title="June"></SubTitle>
                                                                                <TextValidator
                                                                                    disabled={!this.state.isEditable}

                                                                                    // placeholder="Received Qty"
                                                                                    name="june"
                                                                                    InputLabelProps={{ shrink: false }}
                                                                                    value={this.state.data[index]?.june}
                                                                                    type="number"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onChange={(e) => {

                                                                                        let data = this.state.data
                                                                                        data[index].june = parseFloat(e.target.value)
                                                                                        data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                        this.setState({
                                                                                            data
                                                                                        })

                                                                                    }}

                                                                                />
                                                                            </Grid>

                                                                            <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                                <SubTitle title="July"></SubTitle>
                                                                                <TextValidator
                                                                                    disabled={!this.state.isEditable}

                                                                                    // placeholder="Received Qty"
                                                                                    name="July"
                                                                                    InputLabelProps={{ shrink: false }}
                                                                                    value={this.state.data[index]?.july}
                                                                                    type="number"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onChange={(e) => {

                                                                                        let data = this.state.data
                                                                                        data[index].july = parseFloat(e.target.value)
                                                                                        data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                        this.setState({
                                                                                            data
                                                                                        })

                                                                                    }}

                                                                                />
                                                                            </Grid>

                                                                            <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                                <SubTitle title="Aug"></SubTitle>
                                                                                <TextValidator
                                                                                    disabled={!this.state.isEditable}

                                                                                    // placeholder="Received Qty"
                                                                                    name="aug"
                                                                                    InputLabelProps={{ shrink: false }}
                                                                                    value={this.state.data[index]?.aug}
                                                                                    type="number"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onChange={(e) => {

                                                                                        let data = this.state.data
                                                                                        data[index].aug = parseFloat(e.target.value)
                                                                                        data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                        this.setState({
                                                                                            data
                                                                                        })

                                                                                    }}

                                                                                />
                                                                            </Grid>
                                                                            <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                                <SubTitle title="Sep"></SubTitle>
                                                                                <TextValidator
                                                                                    disabled={!this.state.isEditable}

                                                                                    // placeholder="Received Qty"
                                                                                    name="sep"
                                                                                    InputLabelProps={{ shrink: false }}
                                                                                    value={this.state.data[index]?.sep}
                                                                                    type="number"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onChange={(e) => {

                                                                                        let data = this.state.data
                                                                                        data[index].sep = parseFloat(e.target.value)
                                                                                        data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                        this.setState({
                                                                                            data
                                                                                        })

                                                                                    }}

                                                                                />
                                                                            </Grid>

                                                                            <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                                <SubTitle title="Oct"></SubTitle>
                                                                                <TextValidator
                                                                                    disabled={!this.state.isEditable}

                                                                                    // placeholder="Received Qty"
                                                                                    name="oct"
                                                                                    InputLabelProps={{ shrink: false }}
                                                                                    value={this.state.data[index]?.oct}
                                                                                    type="number"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onChange={(e) => {

                                                                                        let data = this.state.data
                                                                                        data[index].oct = parseFloat(e.target.value)
                                                                                        data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                        this.setState({
                                                                                            data
                                                                                        })

                                                                                    }}

                                                                                />
                                                                            </Grid>
                                                                            <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                                <SubTitle title="Nov"></SubTitle>
                                                                                <TextValidator
                                                                                    disabled={!this.state.isEditable}

                                                                                    // placeholder="Received Qty"
                                                                                    name="nov"
                                                                                    InputLabelProps={{ shrink: false }}
                                                                                    value={this.state.data[index]?.nov}
                                                                                    type="number"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onChange={(e) => {

                                                                                        let data = this.state.data
                                                                                        data[index].nov = parseFloat(e.target.value)
                                                                                        data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                        this.setState({
                                                                                            data
                                                                                        })

                                                                                    }}

                                                                                />
                                                                            </Grid>
                                                                            <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                                <SubTitle title="Dec"></SubTitle>
                                                                                <TextValidator
                                                                                    disabled={!this.state.isEditable}

                                                                                    // placeholder="Received Qty"
                                                                                    name="dec"
                                                                                    InputLabelProps={{ shrink: false }}
                                                                                    value={this.state.data[index]?.dec}
                                                                                    type="number"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onChange={(e) => {

                                                                                        let data = this.state.data
                                                                                        data[index].dec = parseFloat(e.target.value)
                                                                                        data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                        this.setState({
                                                                                            data
                                                                                        })

                                                                                    }}

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




                                </ValidatorForm>
                                :
                                <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress
                                        size={30}
                                    />
                                </Grid>
                            }

                        </div>
                    </LoonsCard>
                </MainContainer>


                <Dialog fullWidth maxWidth="lg" open={this.state.viewCompleteEstimations} onClose={() => { this.setState({ viewCompleteEstimations: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                        <CardTitle title="Submitted Estimations" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    viewCompleteEstimations: false

                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>

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

export default withStyles(styleSheet)(ViewAllEstimationsItemWise)