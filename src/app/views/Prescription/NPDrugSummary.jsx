import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { Grid, IconButton, Tooltip, Typography } from "@material-ui/core";
import Npdrug from "./components/npdrug";
import PatientSelection from "./components/patientSelection";
import PatientNPDrugSummary from "./components/npdrug/PatientNPDrugSummary";
import {
    LoonsTable,
    Button,
    MainContainer,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrescriptionService from "app/services/PrescriptionService";
import moment from "moment";
import { NPDrugApprovalStatus } from "appconst";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'

const styleSheet = ((palette, ...theme) => ({

}));

class NPDrugSummary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            data: [],
            columns: [
                {
                    name: 'ItemSnap',
                    label: 'SR No',
                    options: {
                        filter: true,
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
                        filter: true,
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
                                    {moment(value).format('yyyy-MM-DD')}
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
                        display: true,
                        // sort: false,
                        // empty: true,
                        // print: false,
                        // download: false,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <Grid className="w-full">
                                    <div className="flex">
                                        <Tooltip title="view">
                                            {/* <Link to={'/expense/reviewexpense/'+(this.state.expenseData[dataIndex].id)}> */}
                                            {/* <IconButton size="small" aria-label="review" onClick={() => window.location = `/item-mst/view-item-mst/${this.state.data[dataIndex].item_id}`}>
                                                <VisibilityIcon className="text-primary" />
                                            </IconButton> */}
                                            <IconButton size="small" aria-label="review" onClick={() => window.location = `/prescription/npdrug/${this.state.data[dataIndex].id}`}>
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

            page: 0,
            limit: 10,
            totalItems: 0,

            loaded3: false,
            availabePrescribe: 0,
            onOrder: 0,
            issued: 0,

            formData: {
                item_name: null,
                sr_no: null,
                search: null,
            }
        }
    }

    updateWidget = async () => {
        this.setState({ loaded3: false })
        // let availabePrescribe = 0
        // let onOrder = 0
        // let issued = 0

        let params = {
            search_type: "GroupByStatus",
            owner_id: "",
            hospital_id: "",
            clinic_id: "",
            status: [NPDrugApprovalStatus.Pending, NPDrugApprovalStatus.Director, NPDrugApprovalStatus.CP, NPDrugApprovalStatus.SCO, NPDrugApprovalStatus.AD_MSD, NPDrugApprovalStatus.D_MSD, NPDrugApprovalStatus.DDG_MSD, NPDrugApprovalStatus.DDHS, NPDrugApprovalStatus.Secretary],
            requested_by: "",
            item_id: "",
            sr_no: "",
            item_name: "",
            search: "",
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
        // if (res2.data.view[2].status = "Issued"){
        //     console.log("status3"+res2.data.view[2].status)
        //     this.setState({
        //         issued : res2.data.view[2].counts
        //     })
        // } 
        this.setState({
            // availabePrescribe : availabePrescribe,
            // onOrder:onOrder,
            // issued: issued,
            loaded3: true
        })
    }

    getData = async () => {
        this.setState({ loaded: false })

        let params = {
            agent_type: 'SPC',
            type: 'Name Patient Order',
            sr_no: this.state.formData.sr_no,
            item_name: this.state.formData.item_name,
            search: this.state.formData.search,
            limit: this.state.limit,
            page: this.state.page,
            'order[0]': ['createdAt', 'DESC'],
        }

        let res = await PrescriptionService.fetchNPRrequests(params)
        console.log("NP ORDERS", res)
        this.setState({
            data: res.data.view.data,
            totalItems: res.data.view.totalItems,
            loaded: true
        })
    }


    componentDidMount = async () => {
        this.getData()
        this.updateWidget()
    }
    

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <ValidatorForm
                        className="pt-2"
                        onSubmit={() => this.getData()}
                        onError={() => null}
                    >
                        <Grid
                            container
                            spacing={2}
                        >
                            <Grid
                                item
                                xs={12}
                            >
                                <Typography variant='h5'>NP DRUG Summary</Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={2}
                                lg={2}
                            >
                                <SubTitle title="SR Number" />
                                <TextValidator
                                    className=" w-full"
                                    placeholder="SR No"
                                    name="sr_no"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    value={
                                        this.state.formData.sr_no
                                    }
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.sr_no = e.target.value

                                        this.setState({ formData })
                                    }}
                                    // validators={[
                                    //     'required',
                                    // ]}
                                    // errorMessages={[
                                    //     'this field is required',
                                    // ]}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={2}
                                lg={2}
                            >
                                <SubTitle title="Name" />
                                <TextValidator
                                    className=" w-full"
                                    placeholder="Name"
                                    name="item_name"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={
                                        this.state.formData.item_name
                                    }
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.item_name = e.target.value

                                        this.setState({ formData })
                                    }}
                                    // validators={[
                                    //     'required',
                                    // ]}
                                    // errorMessages={[
                                    //     'this field is required',
                                    // ]}
                                />

                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={2}
                                lg={2}
                            >
                                <SubTitle title="Search" />
                                <TextValidator
                                    className=" w-full"
                                    placeholder="Search"
                                    name="search"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    // }}
                                    value={
                                        this.state.formData.search
                                    }
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        formData.search = e.target.value
                                        this.setState({ formData })
                                        console.log(this.state.formData)
                                    }}
                                    InputProps={{}}
                                    // validators={[
                                    //     'required',
                                    // ]}
                                    // errorMessages={[
                                    //     'this field is required',
                                    // ]}
                                />

                            </Grid>
                            <Grid
                                item
                                xs={6}
                                sm={6}
                                md={4}
                                lg={3}
                                className="ml-5"
                            >
                                <Button
                                    className="mt-6"
                                    startIcon="sort"
                                    type="submit"
                                    scrollToTop={
                                        true
                                    }
                                >
                                    Filter
                                </Button>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
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
                    <Grid>
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
                </MainContainer>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(NPDrugSummary);