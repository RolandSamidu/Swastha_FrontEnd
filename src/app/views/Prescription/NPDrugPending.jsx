import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import {Grid, Tooltip, Typography } from "@material-ui/core";
import Npdrug from "./components/npdrug";
import PatientSelection from "./components/patientSelection";
import { LoonsSnackbar, MainContainer, Widget } from 'app/components/LoonsLabComponents';
import {  Button, DatePicker, LoonsTable } from 'app/components/LoonsLabComponents';
import localStorageService from "app/services/localStorageService";
import PrescriptionService from "app/services/PrescriptionService";
import moment from "moment";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { IconButton } from "@mui/material";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { da } from "date-fns/locale";

const styleSheet = ((palette, ...theme) => ({

}));

class NPDrugPending extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded : false,
            data : [],
            remarks : [],
            owner_id : null,
            remarkforSelectedItem : '',
            selectedRows : [],
            columns : [
                // {
                //     name: 'Action',
                //     label: 'Action',
                //     options: {
                //         filter : false,
                //         customBodyRenderLite: (dataIndex) => {
                //             // {console.log(value)}
                //                 return(
                //                     <Grid className="w-full flex">
                //                             <Tooltip title="approve">
                //                                 <IconButton 
                //                                     aria-label="approve" 
                //                                     onClick={()=>this.handleApproval(dataIndex)}
                //                                 >
                //                                     <ThumbUpIcon color="primary"/>
                //                                 </IconButton>
                //                             </Tooltip>
                //                             <Tooltip title="view">   
                //                                 <IconButton 
                //                                     aria-label="view" 
                //                                     onClick={()=>this.handleApproval(dataIndex)}
                //                                 >
                //                                     <VisibilityIcon color="primary"/>
                //                                 </IconButton>
                //                             </Tooltip>
                //                     </Grid>
                //                 )
                //         }
                //     }
                // },
                {
                    name: 'request_id',
                    label: 'Request ID',
                    options: {
                        filter : false,
                    }
                },
                {
                    name: 'sr',
                    label: 'SR',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                            {moment(value).format('yyyy-MM-DD')}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'srDec',
                    label: 'SR Desc',
                    options: {
                        filter : false,
                    }
                },
                {
                    name: 'uom',
                    label: 'UOM',
                    options: {
                        filter : false,
                    }
                },
                {
                    name: 'Qty',
                    label: 'Qty',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                            {(value != null) ? value.name:null}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'requestedBy',
                    label: 'Requested Consultant Name',
                    options: {
                        filter : false,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     // {console.log(value)}
                        //         return(
                        //             <Grid className="w-full">
                        //                     {(value != null) ? value.sr_no:null}
                        //             </Grid>
                        //         )
                        // }
                    }
                },
                {
                    name: 'Institute',
                    label: 'Institute',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                            {(value != null) ? value.item_unit_size:null}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'Status',
                    label: 'status',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                            {(value != null) ? value.sr_no:null}
                                    </Grid>
                                )
                        }
                    }
                },
                // {
                //     name: 'Remark',
                //     label: 'Remark',
                //     options: {
                //         filter : false,
                //         customBodyRenderLite: (dataIndex) => {
                //                 return(
                //                     <Grid className="w-full">
                //                         <TextValidator
                //                             placeholder="Remarks"
                //                             name="Comment"
                //                             InputLabelProps={{ shrink: false }}
                //                             value={this.state.remarks[dataIndex] ?this.state.remarks[dataIndex].remark : null}
                //                             type="text"
                //                             variant="outlined"
                //                             size="small"
                //                             onChange={(e) => {
                //                                 let obj = {
                //                                     id : this.state.data[dataIndex].id,
                //                                     remark : e.target.value
                //                                 }
                //                                 let tempRemark = this.state.remarks
                //                                 tempRemark[dataIndex] = obj
                //                                 this.setState({remarks : tempRemark})
                //                                 // console.log(this.state.remarks)
                //                             }}
                //                         />
                //                     </Grid>
                //                 )
                //         }
                //     }
                // },
            ],

            alert : false,
            severity : 'success',
            message : '',

        }
    }

    handleApproval = async (index) => {
        // FIXME:

        let id = this.state.data[index].id
        let data = {
            "type": "Approved",
            "remark":this.state.remarks[index]?.remark,
            "requested_by": this.state.data[index].requested_by ,
            "status":"Director Approve",       
            "owner_id": this.state.owner_id    
        }
        console.log("Approve Data",data)
        let res = await PrescriptionService.NPApproval(id,data)
        console.log("Approve Data Res",res)
        if(res.status == 200 || res.status == 201){
            this.setState({
                message : "Data status updated successfully.",
                severity : 'success',
                alert : true
            })
        }else {
            this.setState({
                message : "Something went wrong.",
                severity : 'error',
                alert : true
            })
        }
        // console.log("ApproveData",data)
    }

    approve = () => {
        console.log()
    }

    handleBulkApproval = async () => {
        let Ids = []
        this.state.selectedRows.map((x)=>{
            Ids.push(x.id)
        })
        console.log("Ids",Ids)
        if(Ids.length > 0){
            let data = {
                "id": Ids,
                "type":"Approved",
                "remark":this.state.remarkforSelectedItem,
                "requested_by":this.state.data[0].requested_by,
                // FIXME:
                "status":"Director Approve",       
                "owner_id":this.state.owner_id
            }
    
            let res = await PrescriptionService.BulkNPApproval(data)
            console.log("Np approve res",res)
            if(res.status == 200 || res.status == 201){
                this.setState({
                    message : "Record has been added successfully.",
                    severity : 'success',
                    alert : true
                })
            }else {
                this.setState({
                    message : "Something went wrong. Select at least 2 items.",
                    severity : 'error',
                    alert : true
                })
            }
        }else {
            this.setState({
                message : "Select at least 2 items first!",
                severity : 'error',
                alert : true
            })
        }

    }

    componentDidMount = async() => {
        // let user = localStorageService.getItem("userInfo")
        // let hospitalID =  localStorageService.getItem("main_hospital_id")
        // let loginUserHospital = localStorageService.getItem("Login_user_Hospital")
        // let tempOwnerId = localStorageService.getItem("owner_id")
        // this.setState({owner_id : tempOwnerId})
        // let params = {
        //     owner_id : this.state.owner_id,
        //     hospital_id:hospitalID,
        //     clinic_id: loginUserHospital.clinic_id,
        //     requested_by:user.id,
        //     // item_id:
        // }

        // let res =  await PrescriptionService.fetchNPRrequests(params)
        // console.log(res)
        this.setState({
            // data: res.data.view.data, 
            loaded: true
        })
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
                                // value={val}
                                format='dd/MM/yyyy'
                                // placeholder={`⊕ ${text}`}
                                // errorMessages="this field is required"
                                // onChange={} 
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
                                // value={val}
                                format='dd/MM/yyyy'
                                // placeholder={`⊕ ${text}`}
                                // errorMessages="this field is required"
                                // onChange={} 
                            />
                        </Grid> 
                        <Grid
                            item
                            xs={6}
                            sm={6}
                            md={4}
                            lg={3}
                        >
                            <Typography>Consult Name</Typography>
                            <DatePicker 
                                className="w-full"
                                // value={val}
                                format='dd/MM/yyyy'
                                // placeholder={`⊕ ${text}`}
                                // errorMessages="this field is required"
                                // onChange={} 
                            />
                        </Grid> 
                        <Grid
                            item
                            xs={6}
                            sm={6}
                            md={4}
                            lg={3}
                        >
                            <Typography>SR</Typography>
                            <DatePicker 
                                className="w-full"
                                // value={val}
                                format='dd/MM/yyyy'
                                // placeholder={`⊕ ${text}`}
                                // errorMessages="this field is required"
                                // onChange={} 
                            />
                        </Grid> 
                        <Grid
                            item
                            xs={6}
                            sm={6}
                            md={4}
                            lg={3}
                        >
                            <Typography>Description</Typography>
                            <DatePicker 
                                className="w-full"
                                // value={val}
                                format='dd/MM/yyyy'
                                // placeholder={`⊕ ${text}`}
                                // errorMessages="this field is required"
                                // onChange={} 
                            />
                        </Grid> 
                        <Grid
                            item
                            xs={6}
                            sm={6}
                            md={4}
                            lg={3}
                        >
                            <Typography>Status</Typography>
                            <DatePicker 
                                className="w-full"
                                // value={val}
                                format='dd/MM/yyyy'
                                // placeholder={`⊕ ${text}`}
                                // errorMessages="this field is required"
                                // onChange={} 
                            />
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
                                        pagination: false,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        rowsPerPage: this.state.rowsPerPage,
                                        page: this.state.page,
                                        rowsPerPageOptions: [5,10,15,20,30,50,100],
                                        selectableRows:true,
                                        onTableChange: (action, tableSate) => {
                                            console.log("tableState",action)
                                            console.log("tableState2",tableSate)
                                            switch(action){
                                                case 'rowSelectionChange':
                                                    let temp = []
                                                    let selectedRows = tableSate.selectedRows.data
                                                    console.log("selected",selectedRows)
                                                    selectedRows.map((x)=>{
                                                        // console.log(selectedRows)
                                                        temp.push(this.state.data[x.dataIndex])
                                                    })
                                                    console.log("selectedRows",temp)
                                                    this.setState({selectedRows : temp})
                                                    break;
                                                case 'changePage':
                                                    // this.setState({page:tableSate.page},()=>{
                                                    //     this.showTableData()
                                                    // })
                                                    // console.log('page',this.state.page);
                                                    break;
                                                    case 'changeRowsPerPage':
                                                        this.setState({
                                                            rowsPerPage:tableSate.rowsPerPage,
                                                            page:0,
                                                        },()=>{
                                                            // this.showTableData()
                                                        })
                                                    break;
                                                default:
                                                    console.log('action not handled');
                                            }
                                        }
                                    
                                    }}
                                ></LoonsTable>
                                <Grid
                                    container
                                    className="mt-5"
                                    spacing={2}
                                >
                                    <Grid
                                        item
                                        sx={12}
                                        md={6}
                                        lg={6}
                                    >
                                        <TextValidator
                                            className="w-full"
                                            placeholder="remark for selcted items"
                                            name="remark for all"

                                            value={this.state.remarkforSelectedItem}
                                            type="text"

                                            variant="outlined"
                                            size="small"
                                            onChange={(e)=>{
                                                this.setState({remarkforSelectedItem : e.target.value})
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        className="pt-3"
                                        sx={12}
                                        md={6}
                                        lg={6}
                                        item
                                    >
                                        <Button
                                            variant="contained"
                                            startIcon = 'thumb_up'
                                            onClick={this.handleBulkApproval}
                                        >
                                            Approve All
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                        :null}
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

export default withStyles(styleSheet)(NPDrugPending);