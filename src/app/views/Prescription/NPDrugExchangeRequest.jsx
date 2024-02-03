import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import {Card, Grid, Tooltip, Typography } from "@material-ui/core";
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
import {Link} from "react-router-dom"

const styleSheet = ((palette, ...theme) => ({

}));

class NPDrugOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded : false,
            data : [],
            remarks : [],
            owner_id : null,

            from : null,
            to:null,

            remarkforSelectedItem : '',
            selectedRows : [],
            columns : [
                // {
                //     name: 'id',
                //     label: 'Action',
                //     options: {
                //         filter : false,
                //         customBodyRenderLite: (dataIndex) => {  
                //             // {console.log(value)}
                //                 return(
                //                     <Grid className="w-full flex">
                //                             <Link to={"npdrug-order-view/" + (this.state.data[dataIndex].id)}>
                //                                 <Tooltip title="view">   
                //                                     <IconButton 
                //                                         aria-label="view" 
                //                                         // onClick={()=>this.handleApproval(dataIndex)}
                //                                     >
                //                                         <VisibilityIcon color="primary"/>
                //                                     </IconButton>
                //                                 </Tooltip>
                //                             </Link>
                //                     </Grid>
                //                 )
                //         }
                //     }
                // },
                {
                    name: 'sr_no',
                    label: 'SR No.',
                    options: {
                        filter : false,
                    }
                },
                {
                    name: 'Desc',
                    label: 'Desc',
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
                    name: 'no_of_items',
                    label: 'Strength',
                    options: {
                        filter : false,
                    }
                },
                {
                    name: 'order_date',
                    label: 'Frequency',
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
                    name: 'order_date_to',
                    label: 'Duration',
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
                    name: 'requestedBy',
                    label: 'Expected Treatment Date',
                    options: {
                        filter : false,
                    }
                },
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

            alert : false,
            severity : 'success',
            message : '',

        }
    }


    getData = async () => {
        // let params = {
        //     agent_type : 'SPC',
        //     type : 'Name Patient Order',
        //     from: this.state.from,
        //     to :this.state.to,
        //     'order[0]': ['createdAt', 'DESC'],
        // }

        // let res =  await PrescriptionService.NP_Orders(params)
        // console.log("NP ORDERS",res)
        this.setState({
            // data: res.data.view.data, 
            loaded: true
        })
    }

    componentDidMount = async() => {
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
                        className="flex justify-between"
                    >
                        <Grid
                            item
                            xs={12}
                            lg={4}
                        >
                            <ValidatorForm>
                                <Card
                                style={{padding:10}}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        sx={{pb:10}}
                                    >
                                        <Typography variant='h5'>Add Patient Detail</Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        className="pb-3"
                                    >
                                        <Typography>Patient ID</Typography>
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
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        className="pb-1"
                                    >
                                        <Typography>Clinic/BHT No</Typography>
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
                                </Card>
                            </ValidatorForm>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            lg={4}
                        >
                            <Card
                                className="p-5"
                                style={{background : '#bfcff0'}}
                            >
                                <Grid
                                    container
                                    spacing={1}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                    >
                                        <Typography>Name : U.A. Amarasiri</Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                    >
                                        <Typography>Age : 23 yrs</Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                    >
                                        <Typography>Sex : M</Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                    >
                                        <Typography>Contact No : 07123456789</Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                    >
                                        <Typography>Address : No. 123, Road, Col 4</Typography>
                                    </Grid>
                                </Grid>
                            </Card>
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
                                    className="flex justify-end pt-3 pr-5"
                                >
                                    <Button>
                                        Send for Director Approval
                                    </Button>
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

export default withStyles(styleSheet)(NPDrugOrders);