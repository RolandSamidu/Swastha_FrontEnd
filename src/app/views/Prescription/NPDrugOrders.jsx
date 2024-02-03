import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { Grid, Tooltip, Typography } from "@material-ui/core";
import Npdrug from "./components/npdrug";
import PatientSelection from "./components/patientSelection";
import { LoonsSnackbar, MainContainer, Widget } from 'app/components/LoonsLabComponents';
import { Button, DatePicker, LoonsTable } from 'app/components/LoonsLabComponents';
import localStorageService from "app/services/localStorageService";
import PrescriptionService from "app/services/PrescriptionService";
import moment from "moment";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { IconButton } from "@mui/material";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { da } from "date-fns/locale";
import { Link } from "react-router-dom"

const styleSheet = ((palette, ...theme) => ({

}));

class NPDrugOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            data: [],
            remarks: [],
            owner_id: null,

            from: null,
            to: null,

            remarkforSelectedItem: '',
            selectedRows: [],
            columns: [
                {
                    name: 'id',
                    label: 'Action',
                    options: {
                        filter: false,
                        customBodyRenderLite: (dataIndex) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full flex">
                                    <Link to={"npdrug-order-view/" + (this.state.data[dataIndex].id)}>
                                        <Tooltip title="view">
                                            <IconButton
                                                aria-label="view"
                                            // onClick={()=>this.handleApproval(dataIndex)}
                                            >
                                                <VisibilityIcon color="primary" />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'order_no',
                    label: 'Order No.',
                    options: {
                        filter: false,
                    }
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        filter: false,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     // {console.log(value)}
                        //         return(
                        //             <Grid className="w-full">
                        //                     {moment(value).format('yyyy-MM-DD')}
                        //             </Grid>
                        //         )
                        // }
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'No. of items',
                    options: {
                        filter: false,
                    }
                },
                {
                    name: 'order_date',
                    label: 'Created Date',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? moment(value).format('yyyy-MM-DD') : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'order_date_to',
                    label: 'Required Date',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? moment(value).format('yyyy-MM-DD') : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                // {
                //     name: 'requestedBy',
                //     label: 'Requested Consultant Name',
                //     options: {
                //         filter : false,
                //     }
                // },
                // {
                //     name: 'Institute',
                //     label: 'Institute',
                //     options: {
                //         filter : false,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             // {console.log(value)}
                //                 return(
                //                     <Grid className="w-full">
                //                             {(value != null) ? value.item_unit_size:null}
                //                     </Grid>
                //                 )
                //         }
                //     }
                // },
                // {
                //     name: 'Status',
                //     label: 'status',
                //     options: {
                //         filter : false,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             // {console.log(value)}
                //                 return(
                //                     <Grid className="w-full">
                //                             {(value != null) ? value.sr_no:null}
                //                     </Grid>
                //                 )
                //         }
                //     }
                // },
            ],

            alert: false,
            severity: 'success',
            message: '',

            page: 0,
            limit: 10,
            totalItems: 0

        }
    }

    // handleApproval = async (index) => {
    //     // FIXME:

    //     let id = this.state.data[index].id
    //     let data = {
    //         "type": "Approved",
    //         "remark":this.state.remarks[index]?.remark,
    //         "requested_by": this.state.data[index].requested_by ,
    //         "status":"Director Approve",       
    //         "owner_id": this.state.owner_id    
    //     }
    //     console.log("Approve Data",data)
    //     let res = await PrescriptionService.NPApproval(id,data)
    //     console.log("Approve Data Res",res)
    //     if(res.status == 200 || res.status == 201){
    //         this.setState({
    //             message : "Data status updated successfully.",
    //             severity : 'success',
    //             alert : true
    //         })
    //     }else {
    //         this.setState({
    //             message : "Something went wrong.",
    //             severity : 'error',
    //             alert : true
    //         })
    //     }
    //     // console.log("ApproveData",data)
    // }

    // approve = () => {
    //     console.log()
    // }

    // handleBulkApproval = async () => {
    //     let Ids = []
    //     this.state.selectedRows.map((x)=>{
    //         Ids.push(x.id)
    //     })
    //     console.log("Ids",Ids)
    //     if(Ids.length > 0){
    //         let data = {
    //             "id": Ids,
    //             "type":"Approved",
    //             "remark":this.state.remarkforSelectedItem,
    //             "requested_by":this.state.data[0].requested_by,
    //             // FIXME:
    //             "status":"Director Approve",       
    //             "owner_id":this.state.owner_id
    //         }

    //         let res = await PrescriptionService.BulkNPApproval(data)
    //         console.log("Np approve res",res)
    //         if(res.status == 200 || res.status == 201){
    //             this.setState({
    //                 message : "Record has been added successfully.",
    //                 severity : 'success',
    //                 alert : true
    //             })
    //         }else {
    //             this.setState({
    //                 message : "Something went wrong. Select at least 2 items.",
    //                 severity : 'error',
    //                 alert : true
    //             })
    //         }
    //     }else {
    //         this.setState({
    //             message : "Select at least 2 items first!",
    //             severity : 'error',
    //             alert : true
    //         })
    //     }

    // }

    getData = async () => {
        this.setState({ loaded: false })

        let params = {
            agent_type: 'SPC',
            type: 'Name Patient Order',
            from: this.state.from,
            to: this.state.to,
            limit: this.state.limit,
            page: this.state.page,
            'order[0]': ['createdAt', 'DESC'],
        }

        let res = await PrescriptionService.NP_Orders(params)
        console.log("NP ORDERS", res)
        this.setState({
            data: res.data.view.data,
            totalItems: res.data.view.totalItems,
            loaded: true
        })
    }

    componentDidMount = async () => {
        this.getData()
        // console.log("params",params)
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid
                            item
                            xs={12}
                        >
                            <Typography variant='h5'>Overall NP Summary</Typography>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sm={6}
                            md={4}
                            lg={3}
                        >
                            <Typography>Start Date</Typography>
                            <DatePicker
                                className="w-full"
                                value={this.state.from}
                                format='dd/MM/yyyy'
                                // placeholder={`⊕ ${text}`}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let temp = moment(date).format('yyyy-MM-DD')
                                    this.setState({
                                        from: temp
                                    })
                                }}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sm={6}
                            md={4}
                            lg={3}
                        >
                            <Typography>To</Typography>
                            <DatePicker
                                className="w-full"
                                value={this.state.to}
                                format='dd/MM/yyyy'
                                // placeholder={`⊕ ${text}`}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let temp = moment(date).format('yyyy-MM-DD')
                                    this.setState({
                                        to: temp
                                    })
                                }}
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
                                onClick={() => this.getData()}
                            >
                                Filter
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid
                        className="pt-5"
                    >
                        {this.state.loaded ?
                            <ValidatorForm
                                onSubmit={this.approve}
                            >
                                <LoonsTable
                                    id={"npdrug"}
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        rowsPerPage: this.state.limit,
                                        page: this.state.page,
                                        rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                        selectableRows: true,
                                        onTableChange: (action, tableSate) => {
                                            console.log("tableState", action)
                                            console.log("tableState2", tableSate)
                                            switch (action) {
                                                case 'rowSelectionChange':
                                                    let temp = []
                                                    let selectedRows = tableSate.selectedRows.data
                                                    console.log("selected", selectedRows)
                                                    selectedRows.map((x) => {
                                                        // console.log(selectedRows)
                                                        temp.push(this.state.data[x.dataIndex])
                                                    })
                                                    console.log("selectedRows", temp)
                                                    this.setState({ selectedRows: temp })
                                                    break;
                                                case 'changePage':
                                                    this.setState({ page: tableSate.page }, () => {
                                                        this.getData()
                                                    })
                                                    console.log('page', this.state.page);
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

                            </ValidatorForm>
                            : null}
                    </Grid>
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
                    variant="filled">
                </LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(NPDrugOrders);