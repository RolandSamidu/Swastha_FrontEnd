import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import {
    Card,
    TextField,
    MenuItem,
    IconButton,
    Icon,
    Grid,
    Switch,
    Typography,
    InputAdornment,
    Divider,
    Tooltip,
    CircularProgress,
    TableCell,
    Table,
    Paper,
    Radio,
    RadioGroup,
    FormGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    TableBody,
    TableRow,
    Chip
} from '@material-ui/core'
import { themeColors } from 'app/components/MatxTheme/themeColors'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import {
    LoonsTable,
    DatePicker,
    FilePicker,
    ExcelToTable,
    LoonsSnackbar,
    LoonsDialogBox,
    LoonsSwitch,
    LoonsCard,
    Button,
    CardTitle,
    MainContainer
}
    from "app/components/LoonsLabComponents";
// import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import ExaminationServices from 'app/services/ExaminationServices'
import InventoryService from 'app/services/InventoryService'
import PrescriptionService from "app/services/PrescriptionService";
import PatientNPDrugSummary from 'app/views/Prescription/components/npdrug/PatientNPDrugSummary'
import { NPDrugApprovalStatus } from "appconst";
import { dateParse } from 'utils'

import { Fab } from '@material-ui/core'
import AddIcon from '@mui/icons-material/Add';


const styleSheet = (theme) => ({})

const initial_form_data = {
    name: "",
    description: "",
}

const dialogBox_faculty_data = {
    id: "",
    name: "",
    description: "",
}

class NPDrug extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: '',
            severity: 'success',

            patient_id: null,
            itemId: this.props.itemId,
            //form data
            formData: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",
                patient_id: window.dashboardVariables.patient_clinic_id,
                widget_id: this.props.widget_id,
                examination_data: [{
                    widget_input_id: this.props.itemId,
                    question: "",
                    answer: "",
                    other_answers: {
                        complaint: "",
                        duration: "",
                        remark: "",
                    }
                }

                ]
            },

            //snackbar
            snackbar: false,
            snackbar_severity: '',
            snackbar_message: '',

            //save button
            buttonProgress: false,

            //dialog box


            //dialog box - edit form
            buttonProgress_editForm: false,

            //all faculties
            all_faculties: [],

            //table data
            table_data_loading: true,
            data: [],
            totalItems: 0,
            totalPages: 0,
            filterData: { limit: 20, page: 0, name: '', description: '', status: '', search: '' },


            food: [],
            drugs: [],
            other: [],
            loaded: false,

            all_drugs: [],

            loaded: false,
            data: [],
            columns: [
                {
                    name: 'ItemSnap',
                    label: 'SR',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value.sr_no : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'item_name',
                    label: 'Name Description',
                    options: {
                        filter: false,
                    }
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        filter: false,
                    }
                },
                {
                    name: 'createdAt',
                    label: 'Ordered Date',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {dateParse(value)}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'hospital_recieve_date',
                    label: 'Received Date to Hospital',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'patient_recieve_date',
                    label: 'Issued Date to Patient',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'issued_quantity',
                    label: 'Issued Quantity',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'balanceAvailable',
                    label: 'Balance Available',
                    options: {
                        filter: false,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <Grid className="w-full">
                                    {
                                        (
                                            this.state.data.recieved_quantity != null &&
                                            this.state.data.issued_quantity != null
                                        )
                                            ?
                                            (parseInt(this.state.data.recieved_quantity) - parseInt(this.state.data.issued_quantity))
                                            : "-"
                                    }
                                </Grid>
                            );
                        }
                    }
                },
                {
                    name: 'viewDetails',
                    label: 'View Details',
                    options: {

                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <Grid className="w-full">
                                    <div className="flex">
                                        <Tooltip title="view">
                                            {/* <Link to={'/expense/reviewexpense/'+(this.state.expenseData[dataIndex].id)}> */}
                                            <IconButton size="small" aria-label="review" onClick={() => window.location = `/item-mst/view-item-mst/${this.state.data[dataIndex].item_id}`}>
                                                <VisibilityIcon className="text-primary" />
                                            </IconButton>
                                            {/* </Link> */}
                                        </Tooltip>
                                    </div>
                                </Grid>
                            );
                        }
                    }
                },

            ],

            loaded2: false,
            data2: [
                {
                    SR: 'sdf',
                    nameDescription: 'aaa',
                    status: 'On Order',
                    orderedDate: '2010-01-01',
                    receivedDate: '2010-01-01',
                    issuedDateToPatient: '2010-01-01',
                    issueQty: 100,
                    balanceAvailable: 50,
                }
            ],
            columns2: [
                {
                    name: 'SR',
                    label: 'SR',
                    options: {
                        filter: false,
                    }
                },
                {
                    name: 'drugName',
                    label: 'Drug Name',
                    options: {
                        filter: false,
                    }
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (value == 'On Order') {
                                return (
                                    <Grid className="w-full">
                                        <Typography className="bg-error">On Order</Typography>
                                    </Grid>
                                )
                            } else if (value == 'Issued') {
                                return (
                                    <Grid className="w-full">
                                        <Typography className="bg-primary">Issued</Typography>
                                    </Grid>
                                )
                            } else if (value == 'Available Prescribe') {
                                return (
                                    <Grid className="w-full">
                                        <Typography className="bg-green">Available Prescribe</Typography>
                                    </Grid>
                                )
                            }
                        }
                    }
                },
                {
                    name: 'stregnth',
                    label: 'Strength',
                    options: {
                        filter: false,
                    }
                },
                {
                    name: 'frequency',
                    label: 'Frequency',
                    options: {
                        filter: false,
                    }
                },
                {
                    name: 'duration',
                    label: 'Duration',
                    options: {
                        filter: false,
                    }
                },
                {
                    name: 'expectedTreatementDate',
                    label: 'Expected Treatement Date',
                    options: {
                        filter: false,
                    }
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="w-full">
                                    <div className="flex">
                                        <Tooltip title="edit">
                                            {/* <Link to={'/expense/reviewexpense/'+(this.state.expenseData[dataIndex].id)}> */}
                                            <IconButton size="small" aria-label="review">
                                                <VisibilityIcon className="text-secondary" />
                                            </IconButton>
                                            {/* </Link> */}
                                        </Tooltip>
                                    </div>
                                </Grid>
                            );
                        }
                    }
                },

            ],

            loaded3: false,
            availabePrescribe: 0,
            onOrder: 0,
            issued: 0,

        }
    }


    async loadData() {
        let params = {
            agent_type: 'SPC',
            type: 'np_drug',
            patient_id: window.dashboardVariables.patient_id,
            widget_input_id: this.props.itemId,
            limit: 10
        }

        this.setState({ loaded: false })

        // let params = {
        //     agent_type: 'SPC',
        //     type: 'Name Patient Order',
        //     sr_no: this.state.formData.sr_no,
        //     item_name: this.state.formData.item_name,
        //     limit: this.state.limit,
        //     page: this.state.page,
        //     'order[0]': ['createdAt', 'DESC'],
        // }

        let res = await PrescriptionService.fetchNPRrequests(params)
        console.log("NP ORDERS", res)
        this.setState({
            data: res.data.view.data,
            totalItems: res.data.view.totalItems,
            loaded: true
        })
    }

    async submit() {
        console.log("formdata", this.state.formData)
        let formData = this.state.formData;

        let res = await ExaminationServices.saveData(formData)
        console.log("Examination Data added", res)
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Examination Data Added Successful',
                severity: 'success',
            }, () => {
                this.loadData()
            })
        }
    }

    updateWidget = async () => {
        this.setState({ loaded3: false })
        // let availabePrescribe = 0
        // let onOrder = 0
        // let issued = 0

        let params = {
            type: 'np_drug',
            patient_id: window.dashboardVariables.patient_id,
            search_type: "GroupByStatus",
            owner_id: "",
            hospital_id: "",
            clinic_id: "",
            status: [NPDrugApprovalStatus.Pending, NPDrugApprovalStatus.Director, NPDrugApprovalStatus.CP, NPDrugApprovalStatus.SCO, NPDrugApprovalStatus.AD_MSD, NPDrugApprovalStatus.D_MSD, NPDrugApprovalStatus.DDG_MSD, NPDrugApprovalStatus.DDHS, NPDrugApprovalStatus.Secretary],
            requested_by: "",
            item_id: ""
        }
        let res2 = await PrescriptionService.fetchNPRrequests(params)
        console.log(res2)
        if (res2.data.view.length > 0) {
            if (res2.data.view[0].status = "Director Approve") {
                console.log("status1" + res2.data.view[0].status)
                this.setState({
                    availabePrescribe: res2.data.view[0].counts
                })
            }
        }
        if (res2.data.view.length > 1) {
            if (res2.data.view[1].status = "Pending") {
                console.log("status2" + res2.data.view[1].status)
                this.setState({
                    onOrder: res2.data.view[1].counts
                })
            }
        }
        if (res2.data.view.length > 2) {
            if (res2.data.view[2].status = "Issued") {
                console.log("status3" + res2.data.view[2].status)
                this.setState({
                    issued: res2.data.view[2].counts
                })
            }
        }

        this.setState({
            loaded3: true
        })
    }

    async componentDidMount() {
        console.log("dashboardVariables", window.dashboardVariables)

        this.loadData()
        this.updateWidget()
        // this.loadItems()
        //this.interval = setInterval(() => this.loadData(), 5000);
    }
    componentWillUnmount() {
        // clearInterval(this.interval);
    }

    render() {
        return (
            <Fragment>
                <Grid container className='px-2 mt-2' style={{ display: "block" }}>
                    {
                        this.state.loaded3 ?
                            <Grid item className='hide-on-fullScreen px-1 py-1'>
                                <Fab onClick={() => window.location = '/prescription/npdrug'} color="primary" aria-label="add" style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 999 }} size="small">
                                    <AddIcon />
                                </Fab>
                                <PatientNPDrugSummary
                                    availabe={this.state.availabePrescribe}
                                    onOrder={this.state.onOrder}
                                    issued={this.state.issued}
                                />
                            </Grid>
                            : null
                    }
                </Grid>
                <Grid className="py-4" container spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Paper className=" show-on-fullScreen border-radius-8 px-3 py-1 pb-4" elevation={12} style={{ backgroundColor: "#d2e3fc" }}
                        /// ---- Show Full Screen
                        //maxConstraints={[300, 300]}
                        // height={this.state.height} width={this.state.width} onResize={this.onResize} 
                        >
                            <div>
                                <Typography className="font-semibold" variant="h6" style={{ fontSize: 14, }}>BHT: Hello</Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Paper className="show-on-fullScreen border-radius-8 px-3 py-1  pb-4" elevation={12} style={{ backgroundColor: "#d2e3fc" }}
                        //maxConstraints={[300, 300]}
                        // height={this.state.height} width={this.state.width} onResize={this.onResize} 
                        >
                            <div>
                                <Typography className="font-semibold w-full" variant="h6" style={{ fontSize: 14, }}>Clinic No: </Typography>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container spacing={2} className='show-on-fullScreen mt-10'>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <div style={{ display: "contents" }}>
                            <Grid>
                                <Grid className="pb-24 pt-7 px-8 ">
                                    {
                                        this.state.loaded3 ?
                                            <PatientNPDrugSummary
                                                availabe={this.state.availabePrescribe}
                                                onOrder={this.state.onOrder}
                                                issued={this.state.issued}
                                            />
                                            : null
                                    }
                                </Grid>
                                {this.state.loaded ?
                                    <LoonsTable
                                        id={"orderNewDrug"}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: this.state.limit,
                                            page: this.state.page,
                                            rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                            selectableRows: false,
                                            onTableChange: (action, tableSate) => {
                                                console.log(action, tableSate)
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setState({ page: tableSate.page }, () => {
                                                            this.getData()
                                                        })
                                                        console.log('page', this.state.page);
                                                        break;
                                                    case 'changeRowsPerPage':
                                                        this.setState({
                                                            limit: tableSate.rowsPerPage,
                                                            page: 0,
                                                        }, () => {
                                                            this.getData()
                                                        })
                                                        break;
                                                    default:
                                                        console.log('action not handled');
                                                }
                                            }

                                        }}

                                    ></LoonsTable>
                                    : null
                                }
                            </Grid>
                            <Grid>
                                {this.state.loaded2 ?
                                    <LoonsTable
                                        id={"NPDrugDetail"}
                                        data={this.state.data2}
                                        columns={this.state.columns2}
                                        options={{
                                            pagination: false,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: this.state.rowsPerPage,
                                            page: this.state.page,
                                            rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                            selectableRows: true,
                                            onTableChange: (action, tableSate) => {
                                                console.log(action, tableSate)
                                                switch (action) {
                                                    case 'changePage':
                                                        // this.setState({page:tableSate.page},()=>{
                                                        //     this.showTableData()
                                                        // })
                                                        // console.log('page',this.state.page);
                                                        break;
                                                    case 'changeRowsPerPage':
                                                        this.setState({
                                                            rowsPerPage: tableSate.rowsPerPage,
                                                            page: 0,
                                                        }, () => {
                                                            // this.showTableData()
                                                        })
                                                        break;
                                                    default:
                                                        console.log('action not handled');
                                                }
                                            }

                                        }}

                                    ></LoonsTable>
                                    : null
                                }
                            </Grid>
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

            </Fragment >

        )
    }
}

export default withStyles(styleSheet)(NPDrug)
