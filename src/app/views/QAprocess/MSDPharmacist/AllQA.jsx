import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Tooltip, Typography } from "@material-ui/core";
import { LoonsSnackbar, MainContainer, Widget } from 'app/components/LoonsLabComponents';
import {  Button, DatePicker, LoonsTable } from 'app/components/LoonsLabComponents';
import moment from "moment";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { IconButton } from "@mui/material";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { da } from "date-fns/locale";
import {Link} from "react-router-dom"
import AssignmentIcon from '@material-ui/icons/Assignment';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const styleSheet = ((palette, ...theme) => ({

}));

class AllQA extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded : false,
            data : [{}],
            remarks : [],
            owner_id : null,

            open : false,

            from : null,
            to:null,

            remarkforSelectedItem : '',
            selectedRows : [],
            columns : [
                
                {
                    name: 'sr_no',
                    label: 'Log No.',
                    options: {
                        filter : false,
                    }
                },
                {
                    name: 'sr_no',
                    label: 'SR No.',
                    options: {
                        filter : false,
                    }
                },
                {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        filter : false,
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
                    name: ' ',
                    label: 'Batch Details',
                    options: {
                        filter : false,
                    }
                },
                {
                    name: ' ',
                    label: 'Reported Date',
                    options: {
                        filter : false,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     // {console.log(value)}
                        //         return(
                        //             <Grid className="w-full">
                        //                     {(value != null) ? moment(value).format('yyyy-MM-DD'):"-"}
                        //             </Grid>
                        //         )
                        // }
                    }
                },
                {
                    name: '',
                    label: 'Consultant Initiated',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                            {(value != null) ? moment(value).format('yyyy-MM-DD'):"-"}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: ' ',
                    label: 'Reason',
                    options: {
                        filter : false,
                    }
                },
                {
                    name: ' ',
                    label: 'Status',
                    options: {
                        filter : false,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     // {console.log(value)}
                        //         return(
                        //             <Grid className="w-full">
                        //                     {(value != null) ? value.item_unit_size:null}
                        //             </Grid>
                        //         )
                        // }
                    }
                },
                {
                    name: ' ',
                    label: 'Action taken',
                    options: {
                        filter : false,
                        
                    }
                },
                {
                    name: 'id',
                    label: 'Action',
                    options: {
                        filter : false,
                        customBodyRenderLite: (dataIndex) => {  
                            // {console.log(value)}
                            return(
                                <Grid className="w-full flex ">
                                        {/* <Link to={"npdrug-order-view/" + (this.state.data[dataIndex].id)}> */}
                                            <Tooltip title="view">   
                                                <IconButton 
                                                    aria-label="view" 
                                                    
                                                >
                                                    <VisibilityIcon color="primary"/>
                                                </IconButton>
                                            </Tooltip>
                                        {/* </Link> */}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: ' ',
                    label: 'Certificate of Quality',
                    options: {
                        filter : false,
                        customBodyRenderLite: (dataIndex) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                        <AssignmentIcon color="primary"/>
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: ' ',
                    label: 'NMRA Report',
                    options: {
                        filter : false,
                        customBodyRenderLite: (dataIndex) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                        <AssignmentIcon color="primary"/>
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: ' ',
                    label: 'Circular Report',
                    options: {
                        filter : false,
                        customBodyRenderLite: (dataIndex) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                        <Tooltip title="view">   
                                                <IconButton 
                                                    aria-label="view" 
                                                    onClick={()=>this.setState({open: true})}
                                                >
                                                    <AddCircleIcon color="secondary"/>
                                                </IconButton>
                                            </Tooltip>
                                    </Grid>
                                )
                        }
                    }
                },
            ],

            alert : false,
            severity : 'success',
            message : '',

        }
    }

    // getData = async () => {
    //     let params = {
    //         agent_type : 'SPC',
    //         type : 'Name Patient Order',
    //         from: this.state.from,
    //         to :this.state.to,
    //         'order[0]': ['createdAt', 'DESC'],
    //     }

    //     let res =  await PrescriptionService.NP_Orders(params)
    //     console.log("NP ORDERS",res)
    //     this.setState({
    //         data: res.data.view.data, 
    //         loaded: true
    //     })
    // }

    handleClose = () => {
        this.setState({open : false})
    }

    componentDidMount = async() => {
        // this.getData()
        // console.log("params",params)
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <Grid>
                        <ValidatorForm>
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
                                    <Typography>SR No</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                >
                                    <Typography>Committee</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                >
                                    <Typography>NMRA Final Decision</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                >

                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                >
                                    <Typography>Report Date From</Typography>
                                    <DatePicker 
                                        className="w-full"
                                        // value={val}
                                        format='dd/MM/yyyy'
                                        // placeholder={`⊕ ${text}`}
                                        // errorMessages="this field is required"
                                        onChange={(date)=>{
                                            let temp = moment(date).format('yyyy-MM-DD')
                                            this.setState({
                                                from : temp
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
                                    <Typography>Report Date To</Typography>
                                    <DatePicker 
                                        className="w-full"
                                        // value={val}
                                        format='dd/MM/yyyy'
                                        // placeholder={`⊕ ${text}`}
                                        // errorMessages="this field is required"
                                        onChange={(date)=>{
                                            let temp = moment(date).format('yyyy-MM-DD')
                                            this.setState({
                                                to : temp
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
                                    className="mt-5"
                                >
                                    {/* <Typography>NMRA Final Decision</Typography> */}
                                    <TextValidator
                                        className="w-full"
                                        placeholder="search by keyword"
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    className="mt-6"
                                >
                                    <Button
                                        startIcon="search"
                                    >
                                        Search
                                    </Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                    </Grid>
                    <Grid
                        className="pt-5"
                    >
                        {/* //FIXME: */}
                        {1==1 ? 
                        // {this.state.loaded ? 
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
                              
                            </ValidatorForm>
                        :null}
                    </Grid>
                </MainContainer>
                <Grid>
                    <Dialog maxWidth="lg" open={this.state.open} onClose={this.handleClose} aria-describedby="alert-dialog-slide-description">
                        <DialogTitle>Circular Report</DialogTitle>
                        <Divider/>
                        <ValidatorForm>
                        <Grid 
                            container
                            style={{minWidth : '600px'}}
                            className="flex p-8"
                            spacing={2}
                        >
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={6}
                                    // className="p-8"
                                >
                                    <Typography>SR No</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Item Name</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Manufacture Code</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Manufacture Name</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Manufacture Address</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Batch No.</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Committee</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Committee Date</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Committee Decision</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>NMRA Final Decision</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Remarks</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        multiLine={true}
                                        rows={3}
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>

                        </Grid>
                        </ValidatorForm>
                        <Divider/>
                        <Grid container spacing={2} className="p-5">
                            <Grid item>
                                <Button onClick={this.handleClose} startIcon="report">Report ADR</Button>
                            </Grid>
                            <Grid item>
                                <Button onClick={this.handleClose} className="bg-error" startIcon="close">Close</Button>
                            </Grid>
                        </Grid>
                    </Dialog>
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
                    variant="filled">
                </LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(AllQA);