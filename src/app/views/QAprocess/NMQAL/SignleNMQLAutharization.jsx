import React, { Component, Fragment } from "react";
import MainContainer from "../../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../../components/LoonsLabComponents/CardTitle";
import LoonsCard from "../../../components/LoonsLabComponents/LoonsCard";
import { CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Tooltip, Typography,  Dialog,
    DialogActions,DialogContent,TextField, Fab,} from "@material-ui/core";
    import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
    import { Button,DatePicker,LoonsTable ,LoonsSnackbar} from "app/components/LoonsLabComponents";
import SubTitle from "../../../components/LoonsLabComponents/SubTitle";
import Paper from '@material-ui/core/Paper';
import { Autocomplete } from "@mui/material";
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import TaskIcon from '@mui/icons-material/Task';
import VisibilityIcon from '@material-ui/icons/Visibility'
import InventoryService from 'app/services/InventoryService'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AddIcon from '@material-ui/icons/Add';
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import { dateParse } from "utils";
import * as appConst from '../../../../appconst'
import { withStyles } from '@material-ui/core/styles'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import DeleteIcon from '@material-ui/icons/Delete';

import QualityAssuranceService from 'app/services/QualityAssuranceService'
import HospitalConfigServices from 'app/services/HospitalConfigServices';
import EmployeeServices from 'app/services/EmployeeServices'
import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from 'app/services/localStorageService'
import DonarService from '../../../services/DonarService'
import NMQAL from '../Prints/NMQAL'


const drawerWidth = 270;

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
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: "#bad4ec"
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

class QACurrentRequests extends Component {
    constructor(props) {
        super(props)
        this.state = {

            alert: false,
            message: '',
            severity: 'success',
            userRoles:null,

            classes: styleSheet,
            loading: true,
            sr_no: [],
            totalItems: 0,
          formData:{
            search:null
          },
            all_warehouse_loaded: null,
            sampleSubmitDialog:false,
            qualityissueApproveDialog:false,
            empData: [],
            // totalItems: 0,
            batchTable:false,
            batchArray:[],
            filterData: {
                limit: 10,
                page: 0,
                // 'sr_no[0]': ['updatedAt', 'DESC'],
            },
            qaIncidents:[],
            qaIncidentsLoaded:false,
            data:[],
            pending: 0,
            columns: [
                // {
                //     name: 'log_no', // field name in the row object
                //     label: 'Log No', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //         customBodyRenderLite: (dataIndex) => {
                //             // let id = this.state.data[dataIndex].id
                //             // let donar_id = this.state.data[dataIndex]?.Donor?.id
                //             // [dataIndex]?.Donor?.id
                //             return (
                //                 <Grid className="flex items-center">
                //                     <Tooltip title="Log Report">
                //                     <IconButton
                //                         onClick={() => {
                //                            this.setState({
                //                             logReportDialog:true
                //                            })
                //                         }}
                //                         // className="px-2"
                //                         size="small"
                //                         aria-label="View Item"
                //                     >
                //                         <VisibilityIcon />
                //                     </IconButton>
                                       
                //                     </Tooltip>
                                  
                //                 </Grid>
                //             )
                //         },
                //     },
                // },
                {
                    name: 'log_no', // field name in the row object
                    label: 'Log No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.log_no
                        },
                    },
                },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.sr_no
                        },
                    },
                },
                {
                    name: 'item_name', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.medium_description
                        },
                    },
                },
                {
                    name: 'mfd', // field name in the row object
                    label: 'Manufacture Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     return this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.batch_no
                        // },
                    },
                },
                {
                    name: 'mfd', // field name in the row object
                    label: 'Manufacture Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.mfd)
                        },
                    },
                },
                {
                    name: 'reported_date', // field name in the row object
                    label: 'Reported Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let data= this.state.data[tableMeta.rowIndex]?.complain_date
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'consultant_initiated', // field name in the row object
                    label: 'Consultant Initiated', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.Complaint_by?.name
                        },
                    },
                },
              
                // {
                //     name: 'sample_submit_status', // field name in the row object
                //     label: 'Sample submit status', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //           customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <> 
                //                 <Grid container>
                //                  <Button
                //                 color="secondary"
                //                 className="mr-1"
                //                 disabled={false}
                //                 onClick={() => {
                //                   this.setState({
                //                                 sampleSubmitDialog: true,
                //                             })
                //              }} 
                //             >
                //                 Sample Submitted
                //             </Button>


                                
                //                 </Grid>
                              
                //                 </>
                               
                //             )
                         

                //         },
                //     },
                // },
                {
                    name: 'certificate of quality', // field name in the row object
                    label: 'Certidicate of Quality', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: false,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <> 
                                <Grid container>
                                <Grid  className=" w-full"
                                       item
                                       lg={6}
                                       md={6}
                                       sm={12}
                                       xs={12} >
                                         <IconButton
                                        // onClick={() => {
                                        //     window.location.href = `/donation/view-donation-items/${id}/${donar_id}`
                                        // }}
                                        className="px-2"
                                        size="small"
                                        aria-label="View Item"
                                    >
                                        <NoteAddIcon />
                                    </IconButton>
                             


                                </Grid>
                                </Grid>
                              
                                </>
                               
                            )
                         

                        },
                    },
                },
                {
                    name: 'circular_report', // field name in the row object
                    label: 'Circular Report', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: false,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <> 
                                <Grid container>
                                <Grid  className=" w-full"
                                       item
                                       lg={6}
                                       md={6}
                                       sm={12}
                                       xs={12} >
                                           <IconButton
                                        // onClick={() => {
                                        //     window.location.href = `/donation/view-donation-items/${id}/${donar_id}`
                                        // }}
                                        className="px-2"
                                        size="small"
                                        aria-label="View Item"
                                    >
                                        <TaskIcon />
                                    </IconButton>

                                </Grid>
                                </Grid>
                              
                                </>
                               
                            )
                         

                        },
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].item_batch_id
                            // let donar_id = this.state.data[dataIndex]?.Donor?.id
                            // [dataIndex]?.Donor?.id
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="View Item">
                                    <IconButton
                                        onClick={() => {
                                            this.LoadQualityIncident(id)
                                        //    this.setState({
                                        //     qualityissueApproveDialog:true
                                        //    })
                                        }}
                                        // className="px-2"
                                        size="small"
                                        aria-label="View Item"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                       
                                    </Tooltip>
                                  
                                </Grid>
                            )
                        },
                    },
                },
            ],

            qaIncidentscolumns: [
                {
                    name: 'log_no', // field name in the row object
                    label: 'Log No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log("data22",this.state.qaIncidents[tableMeta.rowIndex]?.log_no)
                            return this.state.qaIncidents[tableMeta.rowIndex]?.log_no
                        },
                    },
                },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.qaIncidents[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.sr_no
                        },
                    },
                },
                {
                    name: 'item_name', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.qaIncidents[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.medium_description
                        },
                    },
                },
                {
                    name: 'mfd', // field name in the row object
                    label: 'Manufacture Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     return this.state.qaIncidents[tableMeta.rowIndex]?.ItemSnapBatch?.batch_no
                        // },
                    },
                },
                {
                    name: 'mfd', // field name in the row object
                    label: 'Manufacture Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(this.state.qaIncidents[tableMeta.rowIndex]?.ItemSnapBatch?.mfd)
                        },
                    },
                },
                {
                    name: 'reported_date', // field name in the row object
                    label: 'Reported Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let qaIncidents= this.state.qaIncidents[tableMeta.rowIndex]?.Complaint_by?.createdAt
                            return dateParse(qaIncidents)
                        },
                    },
                },
                {
                    name: 'consultant_initiated', // field name in the row object
                    label: 'Consultant Initiated', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.qaIncidents[tableMeta.rowIndex]?.Complaint_by?.name
                        },
                    },
                },
                {
                    name: 'sample_submit_status', // field name in the row object
                    label: 'Sample Submit Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                          customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <> 
                                <Grid container>
                                 <Button
                                color="secondary"
                                className="mr-1"
                                disabled={false}
                            //     onClick={() => {
                            //       this.setState({
                            //         sampleSubmitDialog: true,
                            //                 })
                            //  }} 
                            >
                                Sample Submitted
                            </Button>
                                </Grid>
                                </>
                            )
                         },
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            // let id = this.state.data[dataIndex].id
                            // let donar_id = this.state.data[dataIndex]?.Donor?.id
                            // [dataIndex]?.Donor?.id
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="View Item">
                                    <IconButton
                                        onClick={() => {
                                        
                                        //    this.setState({
                                        //     qualityissueApproveDialog:true
                                        //    })
                                        }}
                                        // className="px-2"
                                        size="small"
                                        aria-label="View Item"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                       
                                    </Tooltip>
                                  
                                </Grid>
                            )
                        },
                    },
                },
                {
                    name: 'mfd', // field name in the row object
                    label: 'LR NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 20,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return(
                                <Grid container>
                                <Grid className="mt-1" item lg={4}>
                                <TextValidator
                                    // id={'Hello' + this.state.qaIncidents[tableMeta.rowIndex].rowIndex}
                                    defaultValue={value != null ? value : 0}
                                    style={{
                                        width: 80
                                    }}
                                    variant="outlined"
                                    size="small"
                                    disabled={this.state.qaIncidents[tableMeta.rowIndex].lr_added == true ? true : false}
                                    onChange={(e) => {
                                        // this
                                        //     .state
                                        //     .cartStatus[tableMeta.rowIndex]
                                        //     .order_quantity = e.target.value

                                        let qaIncidents =  this.state.qaIncidents;
                                        qaIncidents[tableMeta.rowIndex].lr_no = e.target.value
                                        this.setState({ qaIncidents },
                                            console.log("cartStatus", qaIncidents[tableMeta.rowIndex].lr_no))
                                    }}></TextValidator>
                                
                            </Grid>
                            <Grid className="ml-1" item lg={3}>

                            </Grid>
                            <Grid className="ml-1" item lg={1}>
                            <Tooltip title="Allocate">
                                            <IconButton
                                            disabled={this.state.qaIncidents[tableMeta.rowIndex].lr_added == true ? true : false}
                                                onClick={() => {
                                                    let qaIncidents =  this.state.qaIncidents
                                                    qaIncidents[tableMeta.rowIndex].lr_added = true
                                                    this.selectedRows(qaIncidents[tableMeta.rowIndex])    
                                                     this.setState({
                                                        batchTable:true
                                                     })
                                                     
                                                    // window.location.href = `/msd/check-store-space/${id}`
                                                }}
                                                >
                                                <AddIcon color='primary' />
                                            </IconButton>
                                 </Tooltip>

                                </Grid>
                                </Grid>
                            
                            )
                        },
                    },
                },
            ],

            batchTable_coloums: [
                {
                    name: 'batch_no', // field name in the row object
                    label: 'Batch No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('batch',this.state.log_details)
                            return this.state.log_details[tableMeta.rowIndex]?.QualityIncident?.ItemSnapBatch?.batch_no
                        },
                    },
                },
                {
                    name: 'log_no', // field name in the row object
                    label: 'Log No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.log_details[tableMeta.rowIndex]?.QualityIncident?.log_no
                        },
                    },
                },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.log_details[tableMeta.rowIndex]?.QualityIncident?.ItemSnapBatch?.ItemSnap?.sr_no
                        },
                    },
                },
                {
                    name: 'log_no', // field name in the row object
                    label: 'LR No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.log_details[tableMeta.rowIndex]?.log_report_no
                         },
                    },
                },
               

            ],
            testArray:[
                {
                    test_id: null,
                    specification_id: null,
                    result_id: null,
                }
            ],
            log_details:[
                {
                    qualityincident_id: null,
                    log_report_no: null,
                    source: null,
                    lr_no: null,
                }
            ]
            // totalItems: 0,
         
        }
    }
    async approve() {
        let id = this.props.match.params.id
        let formData = this.state.formData
        let data ={
            nmqal_approve_by:JSON.parse(localStorage.getItem('userInfo')).id,
            status:'Recommendation Approved',
            nmqal_remarks:this.state.formData.remarks,
            reason_for_sending:formData.reason_for_sending,
            analytical_report:formData.analytical_report,
            nmqal_recommendations:formData.nmqal_recommendations,
            nmqal_remarks:formData.nmqal_remarks,
                
        }
        let res = await QualityAssuranceService.approvalORejectionCP(data,id)
        console.log('Res===========>', res)
        if (200 == res.status) {
            this.setState({
                alert: true,
                message: 'Create Issue Successfully ',
                severity: 'success',
            },() => {
                window.location.href='/qualityAssurance/NMQL_Authorization'
            })
            this.LoadData()
        } else {
            this.setState({
                alert: true,
                message: 'Create Issue was Unsuccessful',
                severity: 'error',
            })
        }
    }
    async reject() {
        let id = this.props.match.params.id
        let data ={
            nmqal_approve_by:JSON.parse(localStorage.getItem('userInfo')).id,
            status:'Recommendation Rejected',
            nmqal_remarks:this.state.formData.remarks            
        }

        console.log('checking data', data)
        let res = await QualityAssuranceService.approvalORejectionNMQL(data,id) 
        console.log('Res===========>', res)
        if (201 == res.status) {
            this.setState({
                ploaded: true,
                alert: true,
                message: 'Create Issue Successfully ',
                severity: 'success',
            },() => {
                document.getElementById('print_presc_011').click() 
            })
            this.LoadData()
        } else {
            this.setState({
                alert: true,
                message: 'Create Issue was Unsuccessful',
                severity: 'error',
            })
        }
        this.setState({ showLoading: true });

        setTimeout(() => {
         this.setState({ showLoading: false });
        }, 5000);
    }

    
    async submit(){
        let log_details= {}
        let formData = this.state.formData
        let batchArray = this.state.batchArray

        for (let index = 0; index < batchArray.length; index++) {
            log_details ={
                qualityincident_id : batchArray[index]?.id,
                log_report_no : batchArray[index]?.log_no,
                source : batchArray[index]?.source,
                lr_no : batchArray[index]?.lr_no,
            }
        }
        console.log('log_details',log_details)
        let data = {
        log_details:log_details,
        tests:this.state.testArray.length>0 ? [] : this.state.testArray,
        reason_for_sending:formData.reason_for_sending,
        analytical_report:formData.analytical_report,
        nmqal_recommendations:formData.nmqal_recommendations,
        nmqal_remarks:formData.nmqal_remarks,
        created_by:JSON.parse(localStorage.getItem('userInfo')).id,
        nmqal_reportby:JSON.parse(localStorage.getItem('userInfo')).id,
       
        }
        let res = await QualityAssuranceService.AddingNQMLrecommendation(data)
        console.log('Res===========>', res)
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Create Issue Successfully ',
                severity: 'success',
            },() => {
                // window.location.reload()
            })
            this.LoadData()
        } else {
            this.setState({
                alert: true,
                message: 'Create Issue was Unsuccessful',
                severity: 'error',
            })
        }

        console.log("data",data)
        console.log('log_details',data)
    }
    async onChangeTestDataValue(index, name, value) {
        let testArray = this.state.testArray
        testArray[index][name] = value
        console.log("testArray",testArray)
        this.setState({ testArray })
    }
    async testDataGET() {
        let id = this.props.match.params.id
        // let params 
        // params.type = 'Test'
        const res = await QualityAssuranceService.QAAssuranceSetup()
        // {type:'Test'}
        if (200 == res.status) {
            // filterData.page = res.data.view.currentPage
            this.setState(
                {
                    testData: res.data.view.data,
                    // totalPages: res.data.view.totalPages,
                    // totalItems: res.data.view.totalItems,
                    // tableDataLoaded: true,
                },() =>{
                    this.LoadData(id)
                },
            )
        }
    }
    addNewTest() {
        let testArray = this.state.testArray;
        let test_details = testArray;     
        testArray.push({
                        test_id: null,
                        specification_id: null,
                        result_id: null,
                     })
        testArray = test_details;
        this.setState({ testArray })
    }
    removeRow(i,value) {
        console.log("row",i,value)
        let testArray = this.state.testArray
       
        let index3 = testArray.indexOf(value)
        
        // formData.batch_details[index].packaging_details[index2][name] = value.id
        testArray.splice(index3,1)
        // let formData = this.state.formData
        // formData.batch_details[i].packaging_details.delete(row)
        this.setState({ testArray })
    }
    async LoadAllManufacturers() {
        let params = {}

        let res = await HospitalConfigServices.getAllManufacturers(params)
        if (res.status) {
            console.log("all Manufacturers", res.data.view.data)
            this.setState({
                all_manufacturers: res.data.view.data,

            })
        }
    }
    async loadWarehouses() {
        var user = await localStorageService.getItem('userInfo');
        var id = user.id;
        var all_pharmacy_dummy = [];

        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params);
        if (res.status == 200) {
            console.log("warehouseUsers", res.data.view.data)

            res.data.view.data.forEach(element => {
                all_pharmacy_dummy.push(
                    {
                        warehouse: element.Warehouse,
                        name: element.Warehouse.name,
                        main_or_personal: element.Warehouse.main_or_personal,
                        owner_id: element.Warehouse.owner_id,
                        id: element.warehouse_id,
                        pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
                    }

                )
            });
            console.log("warehouse", all_pharmacy_dummy)
            this.setState({ all_warehouse_loaded: all_pharmacy_dummy })
        }
    }
    async setPage(page) {
        let params = this.state.filterData
        params.page = page
        this.setState(
            {
                params,
            },
            () => {
                this.LoadData()
            }
        )
    }

    async componentDidMount() {

        var user = await localStorageService.getItem('userInfo');

        this.setState({
            userRoles:user.roles[0]
        })

        this.loadWarehouses()
        this.LoadAllManufacturers()
        this.testDataGET()
    }
    async LoadData(id) {
        this.setState({ loading: false })
        let filterData = this.state.filterData
        filterData.search_type = 'GROUP' 

        let res = await QualityAssuranceService.getNMQLRecommendationByID(id,this.state.filterData)
        console.log('res',res)
        if (res.status == 200) {
            let formData = this.state.formData
            let testArray = this.state.testArray
            let log_details = this.state.log_details
            log_details=res.data?.view?.NMQALLogs
            formData=res.data?.view

            console.log("log_details",formData)
            testArray = res.data?.view?.NMQALTests
            this.setState({
                formData,
                log_details,
                testArray,
                formData:res.data.view,
                totalItems:res.data.view.totalItems,
                loading: true,
                batchTable:true,
                qaIncidentsLoaded: true
            },() =>
            console.log("State 1:", this.state.testArray)
             )
        }   
     }  
     async LoadQualityIncident(id){
        this.setState({ qaIncidentsLoaded: false })
        console.log("State 1:", this.state.data)
        let params = {
            item_batch_id:id,
            page : 0,
            limit : 10
        }
        let res = await QualityAssuranceService.getAllQualityIncidents(params)
        if (res.status == 200) {
            console.log("res",res)
            this.setState({
                qaIncidents: res.data?.view?.data,
                // totalItems:res.data.view.totalItems,
                qaIncidentsLoaded: true
            },() => {
                console.log("qaIncidents",this.state.qaIncidents)
            }
             )
        
     } 
    }
    selectedRows(data){
        let batchArray = this.state.batchArray
        batchArray.push(data)
        console.log("batch",batchArray)

        this.setState({
            batchArray 
        })
        // let qaIncidents = this.state.qaIncidents
        // qaIncidents.filter((value) => value.lr_added == true)
        
        // for (let index = 0; index < data.length; index++) {
        //     batchArray = data.lr_no;
            
        // }
    }

  
    async getEmployees(){

        const userId = await localStorageService.getItem('userInfo').id

        let getAsignedEmployee = await EmployeeServices.getEmployees({
            // employee_id: userId,
            type: ['MSD SCO','MSD SCO Supply','MSD SCO QA'],
            // issuance_type: 'SCO' 
        })
        if (getAsignedEmployee.status == 200) {
            this.setState({
                // loaded: true,
                empData: getAsignedEmployee.data.view.data
            })

            console.log(this.state.empData);
        }
    }

    render() {
        const { classes } = this.props
        return (
            <LoonsCard>

           
            <MainContainer>
                
                    {/* <CardTitle title="Log Wise" /> */}
                    <CardTitle title="NMQAL Authorization" />
                    <Grid item lg={12} className=" w-full mt-2">
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.LoadData()}
                                onError={() => null}
                            >
                                {/* <Grid container spacing={1} className="flex"> */}
                                    {/* <Grid
                                       className=" w-full"
                                       item
                                       lg={2}
                                       md={2}
                                       sm={12}
                                       xs={12}
                        
                                    >
                                        <SubTitle title="SR No" />
                                        <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    // value={this.state.hsco.sr_no}
                                    // options={this.state.sr_no}
                                    options={this.state.sr_no}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData = this.state.filterData;
                                            filterData.sr_no = value.id;
                                            console.log('SR no',filterData)
                                            this.setState({ 
                                                filterData,
                                                // srNo:true
                                            })
                                            // let formData = this.state.formData;
                                            // formData.sr_no = value;
                                           
                                        } 
                                        // else {
                                        //     let filterData = this.state.filterData;
                                        //     filterData.sr_no = null;
                                        //     this.setState({ filterData,
                                        //         srNo:false
                                        //     })
                                        // }
                                    }}
                                    getOptionLabel={(option) =>
                                       option.sr_no !== '' ? option.sr_no+'-'+option.long_description :null
                                        // let hsco =  this.state.hsco
                                        // if ( this.state.sr_no !== '' ) {
                                           
                                        // }
                                        // else{
                                        //    hsco.sr_no
                                        // }
                                        
                                        // this.state.hsco.sr_no === '' ? option.sr_no+'-'+option.long_description:this.state.hsco.sr_no
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Type more than 4 letters"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                console.log("as", e.target.value)
                                                if (e.target.value.length > 4) {
                                                    this.loadAllItems(e.target.value)
                                                    // let hsco =this.state.hsco
                                                    // hsco.sr_no = e.target.value

                                                //     this.setState({
                                                //         hsco,
                                                //        srNo:false
                                                //    })
                                                }
                                            }}
                                        />
                                    )}
                                />
                                </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Status" />
                                        <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        this.state.allDonorData
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let filterData = this.state.filterData
                                                            filterData.donor_name = value.name
                                                            filterData.donor_id = value.id
                                                            this.setState(
                                                                {
                                                                    filterData
                                                                }
                                                            )
                                                        }
                                                        else{
                                                            let allDonorData = this.state.allDonorData
                                                            allDonorData.length = 0
                                                            console.log('allDonorData',allDonorData)
                                                            // let filterData = this.state.filterData
                                                            // filterData.donor_name =null
                                                            this.setState({
                                                                // filterData
                                                                allDonorData
                                                            })
                                                        }
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.name
                                                    }
                                                    // validators={[
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Type more than 3 letters"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            // value={
                                                            //     this.state
                                                            //         .formData
                                                            //         .donor_name
                                                            // }
                                                            onChange={(e) => {
                                                                if(e.target.value.length > 3){
                                                                    this.loadDonors(e.target.value)
                                                                }
                                                               
                                                              
                                                            }
                                                            }
                                                            // validators={[
                                                            //     'required',
                                                            // ]}
                                                            // errorMessages={[
                                                            //     'this field is required',
                                                            // ]}
                                                        />
                                                    )}
                                                />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Action" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={appConst.Country_list}
                                            clearOnBlur={true}
                                            clearText="clear"
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.donor_country = value.name;
                                                    this.setState({ filterData })
                                                }
                                            }} 
                                            
                                            getOptionLabel={(option) =>
                                                option.name ? option.name : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    // value={this.state.filterData.vehicle_type}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid
                                                                    item
                                                                    lg={2}
                                                                    md={2}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                        <SubTitle
                                                                            title={
                                                                                'Manufacturer'
                                                                            }
                                                                        ></SubTitle>                                                                 
                                                                    <Autocomplete
                                        disableClearable
                                                                        className="w-full"
                                                                        options={
                                                                            this.state.all_manufacturers
                                                                        }
                                                                        /*  defaultValue={this.setState.all_uoms.find(
                                                                                   (v) => v.value == ''
                                                                               )} 
                                                                        getOptionLabel={(
                                                                            option
                                                                        ) =>
                                                                            option.name
                                                                        }
                                                                        // value={
                                                                        //     this.state.formData.manufacturer_id
                                                                        // }
                                                                        /*  getOptionSelected={(option, value) =>
                                                                                  console.log("ok")
                                                                              } 

                                                                        // value={this.state.all_manufacturers.find((v) =>v.id === this.state.formData.manufacturer_id
                                                                        //         )}
                                                                        onChange={(event, value ) => {
                                                                            if (value != null) {
                                                                                let formData = this.state.formData;
                                                                                formData.manufacture_id =value.id;
                                                                                // formData.item_id = value.id;
                                                                                console.log('SR no',formData)
                                                                                this.setState({ 
                                                                                    formData
                                                                                    // srNo:true
                                                                                })
                                                                                // let formData = this.state.formData;
                                                                                // formData.sr_no = value;
                                                                               
                                                                            } else if(value == null) {
                                                                                let formData = this.state.formData;
                                                                                formData.manufacture_id =null;
                                                                                this.setState({
                                                                                     formData,
                                                                                    // srNo:false
                                                                                })
                                                                            }
                                                                        }}
                                                                      
                                                                        renderInput={(
                                                                            params
                                                                        ) => (
                                                                            <TextValidator
                                                                                {...params}
                                                                                placeholder="Manufacturer"
                                                                                //variant="outlined"
                                                                                //value={}
                                                                                // value={this.state.all_manufacturers.find((v) => v.id == this.state.formData.manufacturer_id
                                                                                // )}
                                                                                fullWidth
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                variant="outlined"
                                                                                size="small"
                                                                                // validators={[
                                                                                //     'required',
                                                                                // ]}
                                                                                // errorMessages={[
                                                                                //     'this field is required',
                                                                                // ]}
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Reported Date From" />
                            <DatePicker
                                className="w-full"
                                placeholder="Reported Date From"
                                value={
                                   this.state.filterData.delivery_date
                                }
                                // views={['year']}
                                // inputFormat="yyyy"
                                // format="yyyy"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    filterData.delivery_date = dateParse(date)
                                    this.setState({
                                        filterData,
                                    })
                                }}
                            />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Reported Date to" />
                                        <DatePicker
                                className="w-full"
                                placeholder="Reported Date to"
                                value={
                                   this.state.filterData.approved_date
                                }
                                // views={['year']}
                                // inputFormat="yyyy"
                                // format="yyyy"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    filterData.approved_date = dateParse(date)
                                    this.setState({
                                        filterData,
                                    })
                                }}
                            />
                                    </Grid>

                            


                                </Grid> 
                                <Grid container spacing={2}>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Search" />
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Search"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.search}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            formData.search = e.target.value
                                            this.setState({ formData })
                                            console.log(
                                                'form dat',
                                                this.state.formData
                                            )
                                        }}
                                        /* validators={[
                                                    'required',
                                                    ]}
                                                    errorMessages={[
                                                    'this field is required',
                                                    ]} 
                                        InputProps={{}}
                                        /*  validators={['required']}
                                errorMessages={[
                                 'this field is required',
                                ]}
                                    />
                                </Grid>

                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <Button
                                        className="mt-6 mr-2"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={false}
                                        startIcon="save"
                                        //onClick={this.handleChange}
                                    >
                                        <span className="capitalize">
                                            Search
                                        </span>
                                    </Button>
                                    <Button
                                        className="mt-6 mr-2"
                                        progress={false}
                                        scrollToTop={false}
                                        // startIcon=""
                                        onClick={() => {
                                            window.location.reload()
                                        }}
                                    >
                                        <span className="capitalize">
                                            Clear
                                        </span>
                                    </Button>
                                </Grid>
                            </Grid> */}
  
                            </ValidatorForm>
                        </Grid>

                        {/* <Grid className=" w-full" spacing={1} style={{ marginTop: 20, backgroundColor: 'red' }}>
                            <Paper elevation={0} square
                                style={{ backgroundColor: '#E6F6FE', border: '1px solid #DEECF3', height: 40 }}>
                                <Grid item lg={12} className=" w-full mt-2">
                                    <Grid container spacing={1} className="flex">
                                        <Grid className="flex"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                            spacing={2}
                                            justify="space-between"
                                            style={{ marginLeft: 10, paddingLeft: 30, paddingRight: 50 }}>

                                            <SubTitle title={`Total Items to be approved: ${this.state.totalItems}`} />
                                            <SubTitle title={`Pending: ${this.state.pending}`} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                           
                        </Paper>
                    </Grid> */}
                    <ValidatorForm>
                            <Grid item="item" lg={6} md={6} sm={12} xs={12}>
                                {this.state.batchTable ? (
                                            <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.log_details}
                                            columns={this.state.batchTable_coloums}
                                            options={{
                                                filter: false,
                                                filterType:'textField',
                                                responsive: 'standard',
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: 10,
                                                page: this.state.filterData.page,
                                                onTableChange: (
                                                    action,
                                                    tableState
                                                ) => {
                                                    console.log(
                                                        action,
                                                        tableState
                                                    )
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
                            ) : (
                                    //loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )}
                            </Grid>
                    </ValidatorForm>
                    {this.state.loading ? (
                  <ValidatorForm>
                  <Grid
                                         // className='mt-2'
                                         item
                                         lg={6}
                                         md={6}
                                         sm={12}
                                         xs={12}
                                     >
                                          <SubTitle title={"NMQL Ref No:"}></SubTitle>
                </Grid>
                  <Grid item="item" lg={10} md={10} sm={12} xs={12}>
                                {this.state.testArray?.map((index,i)=> (
                                     <Grid container spacing={2}>
                                     {/* <Grid
                                        
                                         item
                                         lg={1}
                                         md={1}
                                         sm={12}
                                         xs={12}
                                     >
                                        {i == 0 ? (
                                                <SubTitle
                                               title={
                                                    'Action'
                                                    }
                                                 ></SubTitle>
                                                ) :   <IconButton size="small" color="primary" aria-label="view"
                                                      onClick={() => {
                                                     this.removeRow(index,i)
                                                  }}
                                                 >
                                             <DeleteIcon />
                                       </IconButton>}
                                     </Grid> */}
                                     <Grid
                                                                    item
                                                                    lg={1}
                                                                    md={1}
                                                                    sm={12}
                                                                    xs={12}
                                                                    className='ml-4 mb-1 '
                                                                   
                                                                >
                                                                    {i == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Index'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}
                                                                   <Grid  className='mt-2'> 
                                                                   {(i+1)}
                                                                   </Grid>
                                                                        
                                                                    
                                                                </Grid>
                                     <Grid
                                                                    item
                                                                    lg={3}
                                                                    md={3}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    {i == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Test'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}
                                                                     <Autocomplete
                                        disableClearable
                                                                        className="w-full"
                                                                        disabled={true}
                                                                        options={
                                                                            this.state.testData?.filter((v)=> v.type == 'Test')
                                                                        }
                                                                        /*  defaultValue={this.setState.all_uoms.find(
                                                                                   (v) => v.value == ''
                                                                               )}  */
                                                                        getOptionLabel={(
                                                                            option
                                                                        ) =>
                                                                            option.name
                                                                        }
                                                                        /*  getOptionSelected={(option, value) =>
                                                                                  console.log("ok")
                                                                              } */

                                                                              value={this.state.testData?.find(
                                                                                (
                                                                                    v
                                                                                ) =>
                                                                                    v.id ===this.state.testArray[i]?.test_id
                                                                            )}
                                                                        onChange={(
                                                                            event,
                                                                            value
                                                                        ) => {
                                                                            if(value != null){
                                                                                this.onChangeTestDataValue(
                                                                                    i,
                                                                                    'test_id',
                                                                                    value.id,
                                                                                    
                                                                                )
                                                                            }else{
                                                                                this.onChangeTestDataValue(
                                                                                    i,
                                                                                    'test_id',
                                                                                    null,
                                                                                    
                                                                                )
                                                                            }
                                                                           
                                                                        }}
                                                                        renderInput={(
                                                                            params
                                                                        ) => (
                                                                            <TextValidator
                                                                                {...params}
                                                                                placeholder="Select Test"
                                                                                //variant="outlined"
                                                                                //value={}
                                                                                value={this.state.testData?.find(
                                                                                    (
                                                                                        v
                                                                                    ) =>
                                                                                        v.id ===this.state.testArray[i]?.test_id
                                                                                )}
                                                                                fullWidth
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                variant="outlined"
                                                                                size="small"
                                                                                // validators={[
                                                                                //     'required',
                                                                                // ]}
                                                                                // errorMessages={[
                                                                                //     'This field is required',
                                                                                // ]}
                                                                            />
                                                                        )}
                                                                    />
                                      </Grid>
                                      <Grid
                                                                    item
                                                                    lg={3}
                                                                    md={3}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    {i == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Specification'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}
                                                                     <Autocomplete
                                        disableClearable
                                                                        className="w-full"
                                                                        disabled={true}
                                                                        options={
                                                                            this.state.testData?.filter((v)=> v.type == 'Specification')
                                                                        }
                                                                        /*  defaultValue={this.setState.all_uoms.find(
                                                                                   (v) => v.value == ''
                                                                               )}  */
                                                                        getOptionLabel={(
                                                                            option
                                                                        ) =>
                                                                            option.name
                                                                        }
                                                                        /*  getOptionSelected={(option, value) =>
                                                                                  console.log("ok")
                                                                              } */

                                                                              value={this.state.testData?.find(
                                                                                (
                                                                                    v
                                                                                ) =>
                                                                                    v.id ===this.state.testArray[i]?.specification_id
                                                                            )}
                                                                        onChange={(
                                                                            event,
                                                                            value
                                                                        ) => {
                                                                            if(value != null){
                                                                                this.onChangeTestDataValue(
                                                                                    i,
                                                                                    'specification_id',
                                                                                    value.id,
                                                                                    
                                                                                )
                                                                            }else{
                                                                                this.onChangeTestDataValue(
                                                                                    i,
                                                                                    'specification_id',
                                                                                    null,
                                                                                    
                                                                                )
                                                                            }
                                                                           
                                                                        }}
                                                                        renderInput={(
                                                                            params
                                                                        ) => (
                                                                            <TextValidator
                                                                                {...params}
                                                                                placeholder="Select Specification"
                                                                                //variant="outlined"
                                                                                //value={}
                                                                                value={this.state.testData?.find(
                                                                                    (
                                                                                        v
                                                                                    ) =>
                                                                                        v.id ===this.state.testArray[i]?.specification_id
                                                                                )}
                                                                                fullWidth
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                variant="outlined"
                                                                                size="small"
                                                                                // validators={[
                                                                                //     'required',
                                                                                // ]}
                                                                                // errorMessages={[
                                                                                //     'This field is required',
                                                                                // ]}
                                                                            />
                                                                        )}
                                                                    />
                                      </Grid>
                                      <Grid
                                                                    item
                                                                    lg={3}
                                                                    md={3}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    {i == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Result'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}
                                                                     <Autocomplete
                                        disableClearable
                                                                        className="w-full"
                                                                        disabled={true}
                                                                        options={
                                                                            this.state.testData?.filter((v)=> v.type == 'Result')
                                                                        }
                                                                        /*  defaultValue={this.setState.all_uoms.find(
                                                                                   (v) => v.value == ''
                                                                               )}  */
                                                                        getOptionLabel={(
                                                                            option
                                                                        ) =>
                                                                            option.name
                                                                        }
                                                                        /*  getOptionSelected={(option, value) =>
                                                                                  console.log("ok")
                                                                              } */

                                                                              value={this.state.testData?.find(
                                                                                (
                                                                                    v
                                                                                ) =>
                                                                                    v.id ===this.state.testArray[i]?.result_id
                                                                            )}
                                                                        onChange={(
                                                                            event,
                                                                            value
                                                                        ) => {
                                                                            if(value != null){
                                                                                this.onChangeTestDataValue(
                                                                                    i,
                                                                                    'result_id',
                                                                                    value.id,
                                                                                    
                                                                                )
                                                                            }else{
                                                                                this.onChangeTestDataValue(
                                                                                    i,
                                                                                    'result_id',
                                                                                    null,
                                                                                    
                                                                                )
                                                                            }
                                                                           
                                                                        }}
                                                                        renderInput={(
                                                                            params
                                                                        ) => (
                                                                            <TextValidator
                                                                                {...params}
                                                                                placeholder="Select Result"
                                                                                //variant="outlined"
                                                                                //value={}
                                                                                value={this.state.testData?.find(
                                                                                    (
                                                                                        v
                                                                                    ) =>
                                                                                        v.id ===this.state.testArray[i]?.result_id
                                                                                )}
                                                                                fullWidth
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                variant="outlined"
                                                                                size="small"
                                                                                // validators={[
                                                                                //     'required',
                                                                                // ]}
                                                                                // errorMessages={[
                                                                                //     'This field is required',
                                                                                // ]}
                                                                            />
                                                                        )}
                                                                    />
                                      </Grid>
                                     </Grid>
                                ))}
                                  <Grid
                                container
                                className="w-full flex"
                            >
                                {/* <Grid item>
                                Add new 
                               <Fab size="small" color="primary" aria-label="add" onClick={() => { this.addNewTest() }}>
                                                    <AddIcon />
                                                </Fab> 
                                </Grid>  */}
                            </Grid>
                            </Grid>  
                            <Grid container spacing={2}>
                                     <Grid
                                         // className='mt-2'
                                         item
                                         lg={6}
                                         md={6}
                                         sm={12}
                                         xs={12}
                                     >
                                          <SubTitle title={"Reason for Sending Request"}></SubTitle>
                                                       
                                          <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={appConst.reason_for_sending
                                                    }
                                                    // disabled={true}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            // let formData = this.state.formData;
                                                            let formData = this.state.formData;
                                                            formData.reason_for_sending = value.label
                                                            // formData.batch_no = []
                                                            // value.forEach(element => {
                                                            //     formData.batch_no.push(element.value)
                                                            // });
                                                            //formData.uoms = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={appConst.reason_for_sending.find((v) => v.label == this.state.formData.reason_for_sending
                                                        )}
                                                    // multiple
                                                    getOptionLabel={(option) => option.label}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Select NMRA Final Decision"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={appConst.reason_for_sending.find((v) => v.label == this.state.formData.reason_for_sending
                                                                )}
                                                            validators={['required']}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />   

                                     </Grid>
                                     <Grid
                                         // className='mt-2'
                                         item
                                         lg={6}
                                         md={6}
                                         sm={12}
                                         xs={12}
                                     >
                                         <SubTitle title="Analytical Report" />
                                                    <TextValidator
                                                        className="w-full"
                                                        // disabled={true}
                                                        placeholder="Analytical Report"
                                                        name="Analytical Report"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .analytical_report
                                                        }
                                                        type="text"
                                                        multiline
                                                        rows={3}
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    analytical_report:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                        ]}
                                                    />

                                     </Grid>
                                     <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    // className="p-8"
                                >
                                   <SubTitle title={'NMRA Final Decision'}  ></SubTitle>          
                                   <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    // disabled={true}
                                                    options={appConst.nmra_final_decision
                                                    }
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            // let formData = this.state.formData;
                                                            let formData = this.state.formData;
                                                            formData.nmqal_recommendations = value.label
                                                            // formData.batch_no = []
                                                            // value.forEach(element => {
                                                            //     formData.batch_no.push(element.value)
                                                            // });
                                                            //formData.uoms = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={appConst.nmra_final_decision.find((v) => v.label == this.state.formData.nmqal_recommendations
                                                        )}
                                                    // multiple
                                                    getOptionLabel={(option) => option.label}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Select NMRA Final Decision"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={appConst.nmra_final_decision.find((v) => v.label == this.state.formData.nmqal_recommendations
                                                                )}
                                                            validators={['required']}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />   

                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    // className="p-8"
                                > 
                                    <SubTitle title="Remark" />
                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Remark"
                                                        disabled={true}
                                                        name="Remark"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .nmqal_remarks
                                                        }
                                                        type="text"
                                                        multiline
                                                        rows={3}
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                        nmqal_remarks:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                        ]}
                                                    />
                               

                                </Grid>
                                <Grid container spacing={2}>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={4}
                                    lg={4}
                                    // className="p-8"
                                > 
                                    <SubTitle title="Remark" />
                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Remark"
                                                        
                                                        name="Remark"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .remarks
                                                        }
                                                        type="text"
                                                        multiline
                                                        rows={3}
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                        remarks:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                        ]}
                                                    />
                               

                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={4}
                                    lg={4}
                                    // className="p-8"
                                >
                                
                                    
                                </Grid>
                                {this.state.userRoles !== 'NMQAL Pharmacist' &&
                                    <Grid item className="mt-4">
                                        <Button
                                        className="mt-6 mb-2"
                                        progress={false}
                                        // type="submit"
                                        scrollToTop={true}
                                        // startIcon="save"
                                        color="secondary"
                                        onClick={() => { this.reject() }}
                                    >
                                    <span className="capitalize"> 
                                      Send for Correction
                                    </span>
                                    </Button> 
                                        </Grid>
                                }
                                {this.state.userRoles !== 'NMQAL Pharmacist' &&
                                        <Grid item className="mt-4">
                                        <Button
                                        className="mt-6 mb-2"
                                        progress={false}
                                        // type="submit"
                                        scrollToTop={true}
                                        startIcon="save"
                                        onClick={() => { this.approve() }}


                                    >
                                        <span className="capitalize">
                                            Approve Recommendation
                                        </span>
                                    </Button> 
                                </Grid>
                                }


                                </Grid>
                                   


                                     </Grid>
                                     <Grid>
                                        {this.state.qaIncidentsLoaded?
                                         <NMQAL data={this.state.formData}/>
                                        :null}
                                     </Grid>

                  </ValidatorForm>
                  ) : (
                    //loading effect
                    <Grid className="justify-center text-center w-full pt-12">
                        <CircularProgress size={30} />
                    </Grid>
                )}
            </MainContainer >
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

            </LoonsCard>

        )
    }
}

export default withStyles(styleSheet)(QACurrentRequests)
