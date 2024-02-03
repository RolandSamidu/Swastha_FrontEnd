import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import {
    LoonsTable,
    MainContainer,
    Summary,
    Widget,
    CardTitle,
} from 'app/components/LoonsLabComponents'
import { Button, Grid, Dialog, Icon, IconButton } from '@material-ui/core'
import LabeledInput from 'app/components/LoonsLabComponents/LabeledInput'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@material-ui/icons/Visibility'
import CloseIcon from '@material-ui/icons/Close'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import PrescriptionService from 'app/services/PrescriptionService'
import PatientServices from 'app/services/PatientServices'
import { dateParse, dateTimeParse } from 'utils'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import moment from 'moment'
import localStorageService from 'app/services/localStorageService'
const drawerWidth = 270

const styleSheet = (theme) => ({
    padded: {
        paddingTop: '20px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
    },
    centered: {
        justifyContent: 'center',
    },
    filled: {
        width: '100%',
    },
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
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: '#bad4ec',
        // backgroundColor: themeColors['whiteBlueTopBar'].palette.primary.main
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth - 80}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        //padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: -80,
    },
})

class PatientPrescriptionHistoryAll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            singleView: false,
            selected_prescription: [],
            columns: [
                {
                    name: 'prescription_no',
                    label: 'Prescription No',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'latest_update_date_time',
                    label: 'Date and Time',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateTimeParse(moment(value))
                        },
                    },
                },
                {
                    name: 'Patient',
                    label: 'PHN',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (
                                tableMeta.rowData[tableMeta.columnIndex].phn ==
                                null
                            ) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[tableMeta.columnIndex]
                                    .phn
                            }
                        },
                    },
                },
                {
                    name: 'Patient',
                    label: 'Patient Name',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (
                                tableMeta.rowData[tableMeta.columnIndex].name ==
                                null
                            ) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[tableMeta.columnIndex]
                                    .name
                            }
                        },
                    },
                },
                {
                    name: 'Patient',
                    label: 'Mobile Number',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (
                                tableMeta.rowData[tableMeta.columnIndex]
                                    .mobile_no == null
                            ) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[tableMeta.columnIndex]
                                    .mobile_no
                            }
                        },
                    },
                },
                {
                    name: 'Doctor',
                    label: 'Doctor',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (
                                tableMeta.rowData[tableMeta.columnIndex].name ==
                                null
                            ) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[tableMeta.columnIndex]
                                    .name
                            }
                        },
                    },
                },
                {
                    name: 'Clinic',
                    label: 'Clinic',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (
                                tableMeta.rowData[tableMeta.columnIndex].name ==
                                null
                            ) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[tableMeta.columnIndex]
                                    .name
                            }
                        },
                    },
                },
                // {
                //     name: 'noOfDrugsIn',
                //     label: '# of Drugs Inside Prescription',
                //     options: {
                //         display: true,
                //     },
                // },
                // {
                //     name: 'noOfDrugsOut',
                //     label: '# of Drugs Outside Prescription',
                //     options: {
                //         display: true,
                //     },
                // },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    {' '}
                                    <IconButton
                                        className="text-black"
                                        onClick={() => {
                                            console.log(
                                                'selecting data',
                                                this.state.data[dataIndex]
                                            )
                                            this.fetchSinglePrescriptions(
                                                this.state.data[dataIndex].id
                                            )
                                            // this.setState({ selected_prescription: this.state.data[dataIndex] })
                                            setTimeout(() => {
                                                // this.setState({ singleView: true })
                                            }, 1000)
                                        }}
                                    >
                                        {' '}
                                        <Icon color="primary">visibility</Icon>
                                    </IconButton>
                                </>
                            )
                        },
                    },
                },
            ],

            prescription_columns: [
                {
                    name: 'drug_name',
                    label: 'drug_name',
                    options: {
                        display: true,
                    },
                },
                // {
                //     name: 'quantity',
                //     label: 'Quantity',
                //     options: {
                //         display: true,
                //     },
                // },
                {
                    name: 'issued_quantity',
                    label: 'Issued Quantity',
                    options: {
                        display: true,
                    },
                },
            ],
            data: [],
            formData: this.props.filterData,
            patient: null,
            filterPrescriptionNo: null,
            filterPharmacist: null,
            filterDate: new Date(),
            filterStatus: null,
            page: 0,
            totalItems: 0,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.state.filterPrescriptionNo !==
                prevState.filterPrescriptionNo ||
            this.state.filterPharmacist !== prevState.filterPharmacist ||
            this.state.filterDate !== prevState.filterDate ||
            this.state.page !== prevState.page ||
            this.state.filterStatus !== prevState.filterStatus
        ) {
            this.fetchPrescriptions()
        }
    }

    async fetchPrescriptions() {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        })
        const body = {
            'order[0]': ['createdAt', 'DESC'],
            // 'patient_id': params.patient_id,
            no_druglist: true,
            limit: 10,
            issuer_required:true,
            page: this.state.page,
            status: 'ISSUED'
        }
        let user_info = await localStorageService.getItem('userInfo')
        let owner_id=await localStorageService.getItem('owner_id')
        let pharmacy_id=await localStorageService.getItem('login_user_pharmacy_drugs_stores')[0]?.pharmacy_drugs_stores_id;
        if ( user_info.roles.includes('Chief Pharmacist')) {
            body.owner_id = owner_id
        } else if(user_info.roles.includes("Admin Pharmacist")){
          body.my_clinics=true;
          body.pharmacy_id=pharmacy_id
        }

        if (this.state.filterPrescriptionNo)
            body.prescription_no = this.state.filterPrescriptionNo
        if (this.state.filterPharmacist)
            body.pharmacist = this.state.filterPrescriptionNo
        if (this.state.filterDate)
            body.issue_date = dateParse(this.state.filterDate)
        if (this.state.filterStatus) body.status = this.state.filterStatus
        PrescriptionService.fetchPrescriptions(body).then((obj) => {
            const prescriptions = obj.data ? obj.data.view.data : []
            this.setState(
                {
                    data: prescriptions,
                    totalItems: obj.data ? obj.data.view.totalItems : 0,
                },
                console.log('tot:', obj.data.view)
                // console.log("dataa:",prescriptions)
            )
        })
    }
    getPrescriptionsDetails = async () => {
        this.setState({ Loaded: false })
        let res = await PrescriptionService.fetchPrescriptions()
        console.log('respres:', res)
        this.setState({ data: res.data.view.data, Loaded: true })
        console.log('data', this.state.data)
    }

    fetchSinglePrescriptions(id) {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        })
        const body = {
            'order[0]': ['createdAt', 'DESC'],
            patient_id: params.patient_id,
            no_druglist: true,
            limit: 10,
            page: this.state.page,
        }
        if (this.state.filterPrescriptionNo)
            body.prescription_no = this.state.filterPrescriptionNo
        if (this.state.filterPharmacist)
            body.pharmacist = this.state.filterPrescriptionNo
        if (this.state.filterDate) body.pharmacist = this.state.filterDate
        if (this.state.filterStatus) body.pharmacist = this.state.filterStatus
        PrescriptionService.fetchPrescriptionById(body, id).then((obj) => {
            console.log('single drug history', obj)
            /*    const prescriptions = obj.data ? obj.data.view.data.map((pres) => {
                   return {
                        DrugAssign: pres.DrugAssign
                   };
               }) : []; */
            this.setState({
                selected_prescription: obj.data.view.DrugAssign,
                singleView: true,
            })
        })
    }

    // fetchPatient() {
    //     const params = new Proxy(new URLSearchParams(window.location.search), {
    //         get: (searchParams, prop) => searchParams.get(prop),
    //     });
    //     PatientServices.getPatientById(params.patient_id).then((obj) => {
    //         if (obj.data && obj.data.view) {
    //             this.setState({
    //                 patient: obj.data.view
    //             })
    //         }
    //     });
    // }

    componentDidMount() {
        // this.getPrescriptionsDetails();
        // this.fetchPatient();
        //this.fetchPrescriptions();
    }

    render() {
        const { classes } = this.props
        return (
            <Widget title="My Issued Precription" id="patient_pres_history">
                <Fragment>
                    <MainContainer>
                        {/* <Grid container spacing={2} className={classes.padded}>
                            <Grid item xs={3}>
                                <p>PHN Number : {this.state.patient ? this.state.patient.phn : ""}</p>
                                <p>NIC Number : {this.state.patient ? this.state.patient.nic : ""}</p>
                                <p>Date of Birth : {this.state.patient ? dateParse(this.state.patient.date_of_birth) : ""}</p>
                            </Grid>
                            <Grid item xs={1}>
                            </Grid>
                            <Grid item xs={3}>
                                <p>Patient Name : {this.state.patient ? this.state.patient.title : ""}. {this.state.patient ? this.state.patient.name : ""}</p>
                                <p>Patient Age : {this.state.patient ? this.state.patient.age : ""}</p>
                                <p>Gender : {this.state.patient ? this.state.patient.gender : ""}</p>
                            </Grid>
                            <Grid item xs={1}>
                            </Grid>
                            <Grid item xs={3}>
                                <p>Mobile Number : {this.state.patient ? this.state.patient.mobile_no : ""}</p>
                                <p>Address : {this.state.patient ? this.state.patient.address : ""}</p>
                            </Grid>
                        </Grid> */}

                        <ValidatorForm className={classes.padded}>
                            <Grid
                                container
                                spacing={2}
                                className={classes.centered}
                            >
                                <Grid item xs={2}>
                                    <LabeledInput
                                        label="Prescription No"
                                        inputType="text"
                                        onUpdate={(e) =>
                                            this.setState({
                                                filterPrescriptionNo:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={1}></Grid>
                                {/* <Grid item xs={2}>
                                    <LabeledInput label="Issued Pharmacist" inputType="dropdown" data={[
                                        { label: "Point1", value: "Point1" },
                                        { label: "Point2", value: "Point2" }
                                    ]} onUpdate={(e, val) => this.setState({ filterPharmacist: val })} />
                                </Grid> */}
                                <Grid item xs={1}></Grid>
                                <Grid item xs={2}>
                                    <LabeledInput
                                        label="Date of Issue"
                                        name="issue_date"
                                        inputType="date"
                                        onUpdate={(e) =>
                                            this.setState({ filterDate: e })
                                        }
                                        value={this.state.filterDate}
                                    />
                                </Grid>
                                <Grid item xs={1}></Grid>
                                {/* <Grid item xs={2}>
                                    <LabeledInput label="Status" inputType="dropdown" data={[
                                        { label: "Issued", value: 1 },
                                        { label: "Pending", value: 2 },
                                        { label: "Discarded", value: 3 },
                                    ]} onUpdate={(e, val) => this.setState({ filterStatus: val })} />
                                </Grid> */}
                            </Grid>
                        </ValidatorForm>
                        <LoonsButton onClick={() => this.fetchPrescriptions()}>
                            Load Data
                        </LoonsButton>
                        <LoonsTable
                            id={'prescriptionSnapshot'}
                            title={'Total Items: ' + this.state.totalItems}
                            data={this.state.data}
                            columns={this.state.columns}
                            options={{
                                pagination: true,
                                rowsPerPage: 10,
                                page: this.state.page,
                                count: this.state.totalItems,
                                serverSide: true,
                                onTableChange: (action, tableState) => {
                                    if (action === 'changePage') {
                                        this.setState({ page: tableState.page })
                                    }
                                },
                            }}
                        ></LoonsTable>
                    </MainContainer>
                    {this.state.singleView ? (
                        <Dialog
                            maxWidth={'md'}
                            fullWidth={true}
                            open={this.state.singleView}
                            onClose={() => {
                                this.setState({
                                    singleView: false,
                                    selected_vehicle_id: null,
                                })
                            }}
                        >
                            <MuiDialogTitle
                                disableTypography
                                className={classes.Dialogroot}
                            >
                                <CardTitle title="Prescription Details" />
                                <IconButton
                                    aria-label="close"
                                    className={classes.closeButton}
                                    onClick={() => {
                                        this.setState({
                                            singleView: false,
                                        })
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </MuiDialogTitle>
                            <div className="w-full h-full px-5 pb-5">
                                {this.state.singleView ? (
                                    <LoonsTable
                                        id={'prescriptionSingle'}
                                        data={this.state.selected_prescription}
                                        columns={
                                            this.state.prescription_columns
                                        }
                                        options={{
                                            pagination: false,
                                            serverSide: true,
                                            rowsPerPage: 50,
                                            page: 0,
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                console.log(action, tableState)
                                            },
                                        }}
                                    ></LoonsTable>
                                ) : null}
                            </div>
                        </Dialog>
                    ) : null}
                </Fragment>
            </Widget>
        )
    }
}

export default withStyles(styleSheet)(PatientPrescriptionHistoryAll)
