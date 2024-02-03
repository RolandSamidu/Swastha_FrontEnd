import React, { Component, Fragment } from "react";
import MainContainer from "../../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../../components/LoonsLabComponents/CardTitle";
import LoonsCard from "../../../components/LoonsLabComponents/LoonsCard";
import { CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Tooltip, Typography, Dialog, DialogActions, DialogContent, TextField,
        Fab, 
        DialogContentText,
        DialogTitle,
    } from "@material-ui/core";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Button, DatePicker, LoonsTable, LoonsSnackbar } from "app/components/LoonsLabComponents";
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
import NMRAreport from '../Prints/NMRAreport';

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
            //snackbar
            alert: false,
            message: '',
            severity: 'success',
            manufature_list:[],

            classes: styleSheet,
            loading: true,
            sr_no: [],
            totalItems: 0,
            formData: {
                search: null
            },
            qualityIncidentID: null,
            changeTab: false,
            selectedRows: [],
            all_warehouse_loaded: null,
            sampleSubmitDialog: false,
            qualityissueApproveDialog: false,
            viewDailog: false,
            empData: [],
            // totalItems: 0,
            batchTable: false,
            batchArray: [],
            filterData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
            },
            qaIncidents: [],
            qaIncidentsLoaded: false,
            load_circular_det : false,
            circular_det:{},
            data: [],
            pending: 0,
            columns: [
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.ItemSnap?.sr_no
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
                            return this.state.data[tableMeta.rowIndex]?.ItemSnap?.medium_description
                        },
                    },
                },
                {
                    name: 'nmqal_no', // field name in the row object
                    label: 'NMQL No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     return this.state.data[tableMeta.rowIndex]?.log_no
                        // },
                    },
                },
                // {
                //     name: 'sr_no', // field name in the row object
                //     label: 'SR NO', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.sr_no
                //         },
                //     },
                // },
                // {
                //     name: 'item_name', // field name in the row object
                //     label: 'Item Name', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.medium_description
                //         },
                //     },
                // },
                {
                    name: 'mfd', // field name in the row object
                    label: 'NMQL Report Issued by', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.NmqalReportBy?.name
                        },
                    },
                },
                {
                    name: 'mfd', // field name in the row object
                    label: 'NMQL Report Issued date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(this.state.data[tableMeta.rowIndex]?.NmqalReportBy?.createdAt)
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
                            let data = this.state.data[tableMeta.rowIndex]?.complain_date
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     return this.state.data[tableMeta.rowIndex]?.Complaint_by?.name
                        // },
                    },
                },
                {
                    name: 'nmqal_recommendations', // field name in the row object
                    label: 'NMQL Recommendation', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     return this.state.data[tableMeta.rowIndex]?.Complaint_by?.name
                        // },
                    },
                },
                {
                    name: 'nmra_final_decision', // field name in the row object
                    label: 'NMRA Recommendation', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     return this.state.data[tableMeta.rowIndex]?.Complaint_by?.name
                        // },
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
                // {
                //     name: 'certificate of quality', // field name in the row object
                //     label: 'Certidicate of Quality', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <> 
                //                 <Grid container>
                //                 <Grid  className=" w-full"
                //                        item
                //                        lg={6}
                //                        md={6}
                //                        sm={12}
                //                        xs={12} >
                //                          <IconButton
                //                         // onClick={() => {
                //                         //     window.location.href = `/donation/view-donation-items/${id}/${donar_id}`
                //                         // }}
                //                         className="px-2"
                //                         size="small"
                //                         aria-label="View Item"
                //                     >
                //                         <NoteAddIcon />
                //                     </IconButton>



                //                 </Grid>
                //                 </Grid>

                //                 </>

                //             )


                //         },
                //     },
                // },
                // {
                //     name: 'circular_report', // field name in the row object
                //     label: 'Circular Report', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <> 
                //                 <Grid container>
                //                 <Grid  className=" w-full"
                //                        item
                //                        lg={6}
                //                        md={6}
                //                        sm={12}
                //                        xs={12} >
                //                            <IconButton
                //                         // onClick={() => {
                //                         //     window.location.href = `/donation/view-donation-items/${id}/${donar_id}`
                //                         // }}
                //                         className="px-2"
                //                         size="small"
                //                         aria-label="View Item"
                //                     >
                //                         <TaskIcon />
                //                     </IconButton>

                //                 </Grid>
                //                 </Grid>

                //                 </>

                //             )


                //         },
                //     },
                // },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id
                            // let donar_id = this.state.data[dataIndex]?.Donor?.id
                            // [dataIndex]?.Donor?.id
                            let rowIndexNew = dataIndex
                            return (
                                <Grid className="flex items-center">
                                    
                                    <Tooltip title="View Item">
                                        <IconButton
                                            // disabled={this.state.data[dataIndex].status == 'NMRA Final Decision Approval'}
                                            onClick={() => {
                                                this.LoadQualityIncident(id, this.state.data[dataIndex]?.status)
                                                console.log('data50', rowIndexNew)
                                                this.setState({
                                                    rowIndexNew: rowIndexNew
                                                })

                                                if (this.state.data[dataIndex]?.status !== 'Circular Generated') {
                                                    this.setState({
                                                        viewDailog: true,
                                                    })
    
                                                }
                                              
                                            }

                                            }
                                            color={this.state.data[dataIndex].status == 'NMRA Final Decision Approval' ? 'secondary' : 'primary'}

                                            // className="px-2"
                                            size="small"
                                            aria-label="View Item"
                                        >
                                            <VisibilityIcon />
                                        </IconButton>

                                    </Tooltip>

                                </Grid >
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
                            console.log("data22", this.state.qaIncidents[tableMeta.rowIndex]?.log_no)
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
                            let qaIncidents = this.state.qaIncidents[tableMeta.rowIndex]?.Complaint_by?.createdAt
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
                            return (
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

                                                let qaIncidents = this.state.qaIncidents;
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
                                                    let qaIncidents = this.state.qaIncidents
                                                    qaIncidents[tableMeta.rowIndex].lr_added = true
                                                    this.selectedRows(qaIncidents[tableMeta.rowIndex])
                                                    this.setState({
                                                        batchTable: true
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
                            return this.state.qaIncidents[tableMeta.rowIndex]?.QualityIncident?.ItemSnapBatch?.batch_no
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
                            return this.state.qaIncidents[tableMeta.rowIndex]?.QualityIncident?.log_no
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
                            return this.state.qaIncidents[tableMeta.rowIndex]?.QualityIncident?.ItemSnapBatch?.ItemSnap?.sr_no
                        },
                    },
                },
                {
                    name: 'lr_no', // field name in the row object
                    label: 'LR No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.qaIncidents[tableMeta.rowIndex]?.log_report_no
                        },
                    },
                },
            ],
            testArray: [
                {
                    test_id: null,
                    specification_id: null,
                    result_id: null,
                }
            ],
            log_details: [
                {
                    qualityincident_id: null,
                    log_report_no: null,
                    source: null,
                    lr_no: null,
                }
            ],
            batch_numbers: [],
            // totalItems: 0,

        }
    }
    async approve() {

        let formData = this.state.formData
        let id = formData.id
        let data = {
            nmqal_approve_by: JSON.parse(localStorage.getItem('userInfo')).id,
            status: 'NMRA Final Decision Approval',
            committee_decision: formData.committee_decision,
            committee: formData.committee,
            committee_date: formData.committee_date,
            nmra_remarks: formData.nmra_remarks,
            nmra_reportby: JSON.parse(localStorage.getItem('userInfo')).id,
            nmra_final_decision: formData.nmra_final_decision,
            // nmqal_remarks:this.state.formData.remarks        
            manufacture_ids : this.state.manufature_list.map((e)=>e?.manufacture_id) 
        }
        console.log('approve', data)
        let res = await QualityAssuranceService.approvalORejectionCP(data, id)
        console.log('Res===========>', res)
        if (200 == res.status) {
            this.setState({
                alert: true,
                message: 'Update Issue Successfully ',
                severity: 'success',
            }, () => {
                window.location.reload()
            })
            this.LoadData()
        } else {
            this.setState({
                alert: true,
                message: 'Update Issue was Unsuccessful',
                severity: 'error',
            })
        }
    }
    async submit() {
        console.log('selectableRows', this.state.selectedRows)
        let data = {
            // log_details:log_details,
            // tests:this.state.testArray,
            // reason_for_sending:formData.reason_for_sending,
            // analytical_report:formData.analytical_report,
            // nmqal_recommendations:formData.nmqal_recommendations,
            // nmqal_remarks:formData.nmqal_remarks,
            // created_by:JSON.parse(localStorage.getItem('userInfo')).id,
            // nmqal_reportby:JSON.parse(localStorage.getItem('userInfo')).id,

        }
        // let res = await QualityAssuranceService.AddingNQMLrecommendation(data)
        // console.log('Res===========>', res)
        // if (201 == res.status) {
        //     this.setState({
        //         alert: true,
        //         message: 'Create Issue Successfully ',
        //         severity: 'success',
        //     },() => {
        //         // window.location.reload()
        //     })
        //     this.LoadData()
        // } else {
        //     this.setState({
        //         alert: true,
        //         message: 'Create Issue was Unsuccessful',
        //         severity: 'error',
        //     })
        // }

        console.log("data", data)
        console.log('log_details', data)
    }
    async onChangeTestDataValue(index, name, value) {
        let testArray = this.state.testArray
        testArray[index][name] = value
        console.log("testArray", testArray)
        this.setState({ testArray })
    }
    async testDataGET() {
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
    removeRow(i, value) {
        console.log("row", i, value)
        let testArray = this.state.testArray

        let index3 = testArray.indexOf(value)

        // formData.batch_details[index].packaging_details[index2][name] = value.id
        testArray.splice(index3, 1)
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

    componentDidMount() {
        this.loadWarehouses()
        this.LoadData()
        this.LoadAllManufacturers()
        this.testDataGET()
    }
    async LoadData() {
        this.setState({ loading: false })
        // let params = {
        //     limit:20,
        //     page:0
        //     // status : 'Recommendation Approved'
        // }
        let filterData = this.state.filterData
        let res = await QualityAssuranceService.getAllNMQLRecommendations(filterData)
        if (res.status == 200) {

            console.log('ffffffffffffffffffff',res)
            this.setState({
                data: res.data.view.data,
                totalItems: res.data.view.totalItems,
                loading: true
            }, () =>
                console.log("State 1:", this.state.data)
            )
        }
    }
    async LoadQualityIncident(id, status) {
        let formData = this.state.formData
        formData.id = id
        this.setState({ qaIncidentsLoaded: false })
        console.log("State 1:", id)
        let params = {
            // item_batch_id:id,
            page: 0,
            limit: 10
        }
        let res = await QualityAssuranceService.getNMQLRecommendationByID(id, params)
        if (res.status == 200) {
            console.log("res", res)
            let batch_numbers = []
            let batch_no
            for (let index = 0; index < res.data.view.NMQALLogs.length; index++) {
                batch_no = res.data.view.NMQALLogs[index]?.QualityIncident?.ItemSnapBatch?.batch_no;
            }
            batch_numbers.push(batch_no)
            console.log("batch_numbers", batch_numbers)

            if (status === "Circular Generated") {
                this.setState({
                    formData,
                    batch_numbers: batch_numbers,
                    qaIncidents: res.data?.view?.NMQALLogs,
                    circular_det: res.data?.view,
                    // totalItems:res.data.view.totalItems,
                    load_circular_det : true
                })
            } else {
                this.setState({
                    formData,
                    batch_numbers: batch_numbers,
                    qaIncidents: res.data?.view?.NMQALLogs,
                    // totalItems:res.data.view.totalItems,
                    qaIncidentsLoaded: true,
                    circular_det: res.data?.view,
                }, () => {
                    console.log("qaIncidents", this.state.qaIncidents)
                }
                )
            }
           

        }
    }
    selectedRows(data) {
        let batchArray = this.state.batchArray
        batchArray.push(data)
        console.log("batch", batchArray)

        this.setState({
            batchArray
        })
        // let qaIncidents = this.state.qaIncidents
        // qaIncidents.filter((value) => value.lr_added == true)

        // for (let index = 0; index < data.length; index++) {
        //     batchArray = data.lr_no;

        // }
    }


    async getEmployees() {

        const userId = await localStorageService.getItem('userInfo').id

        let getAsignedEmployee = await EmployeeServices.getEmployees({
            // employee_id: userId,
            type: ['MSD SCO', 'MSD SCO Supply', 'MSD SCO QA'],
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

    async loadAllItems(search) {
        // let params = { "search": search }
        let data = {
          search: search
      }
    //   let filterData = this.state.filterData
      // this.setState({ loaded: false })
    //   let params = { limit: 10000, page: 0 }
      // let filterData = this.state.filterData
      let res = await InventoryService.fetchAllItems(data)
      console.log('all Items', res.data.view.data)

      if (res.status == 200) {
          this.setState({ sr_no: res.data.view.data })
      }
    //   console.log('items', this.state.left)
  }


async getManufactures (){
    

    let params = {
        search_type : 'MANUFACTURE',
        nmqal_recommandation_id : this.state.circular_det?.id
    }
   
    let res = await QualityAssuranceService.getAllNMQLRecommendations(params)

    if (res.status === 200){
        console.log('checking manuacture info', res)
        this.setState({
            manufature_list : res.data.view.data,
            // manufacture_loading: true
        })
        
    }
}

    async directApprove() {

        const userId = await localStorageService.getItem('userInfo').id
        let id = this.state.formData.id

        let params = {
            nmra_remarks: this.state.formData.remarks,
            nmra_final_decision: this.state.circular_det?.nmqal_recommendations,
            nmra_reportby : userId,
            status : 'NMRA Final Decision Approval'
        }

        let res = await QualityAssuranceService.approvalORejectionCP(params, id)
        console.log('Res===========>', res)
        if (200 == res.status) {
            this.setState({
                alert: true,
                message: 'Approved Successfully ',
                severity: 'success',
            }, () => {
                window.location.reload()
            })
            this.LoadData()
        } else {
            this.setState({
                alert: true,
                message: 'Approved was Unsuccessful',
                severity: 'error',
            })
        }
    }

    render() {
        const { classes } = this.props
        return (
            <LoonsCard>
                <MainContainer>

                    {/* <CardTitle title="Log Wise" /> */}

                    <Grid item lg={12} className=" w-full mt-2">
                        <ValidatorForm
                            className="pt-2"
                            ref={'outer-form'}
                            onSubmit={() => this.LoadData()}
                            onError={() => null}
                        >
                            <Grid container spacing={1} className="flex">
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
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
                                                filterData.item_id = value.id;
                                                console.log('SR no', filterData)
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
                                            option.sr_no !== '' ? option.sr_no + '-' + option.long_description : null
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
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Status" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={
                                            appConst.qa_nmqal_status
                                        }
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData = this.state.filterData
                                                filterData.status = value.label
                                                this.setState(
                                                    {
                                                        filterData
                                                    }
                                                )
                                            }
                                            
                                        }}
                                        getOptionLabel={(option) =>
                                            option.label
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

                                {/* <Grid
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
                                </Grid> */}
         

                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Reported Date From" />
                                    <DatePicker
                                        className="w-full"
                                        placeholder="Reported Date From"
                                        value={
                                            this.state.filterData.from
                                        }
                                        // views={['year']}
                                        // inputFormat="yyyy"
                                        // format="yyyy"
                                        onChange={(date) => {
                                            let filterData = this.state.filterData
                                            filterData.from = dateParse(date)
                                            this.setState({
                                                filterData,
                                            })
                                        }}
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
                                    <SubTitle title="Reported Date to" />
                                    <DatePicker
                                        className="w-full"
                                        placeholder="Reported Date to"
                                        value={
                                            this.state.filterData.to
                                        }
                                        // views={['year']}
                                        // inputFormat="yyyy"
                                        // format="yyyy"
                                        onChange={(date) => {
                                            let filterData = this.state.filterData
                                            filterData.to = dateParse(date)
                                            this.setState({
                                                filterData,
                                            })
                                        }}
                                    />
                                </Grid>

                                {/* <Grid
                                    className=" w-full flex-end mt-1"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <Button
                                        className="mt-5 flex-end"
                                        progress={false}
                                        // onClick={() => {
                                        //     window.open('/estimation/all-estimation-items');
                                        // }}
                                        color="primary" style={{ fontWeight: 'bold', marginTop: -3 }}
                                        type="submit"
                                        scrollToTop={true}
                                        startIcon="search"
                                    >
                                        <span className="capitalize">Filter</span>
                                    </Button>
                                </Grid> */}



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
                                        value={this.state.filterData.search}
                                        onChange={(e, value) => {
                                            let filterData = this.state.filterData
                                            filterData.search = e.target.value
                                            this.setState({ filterData })
                                            
                                        }}
                                        /* validators={[
                                                    'required',
                                                    ]}
                                                    errorMessages={[
                                                    'this field is required',
                                                    ]} */
                                        InputProps={{}}
                                    /*  validators={['required']}
                            errorMessages={[
                             'this field is required',
                            ]} */
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
                            </Grid>

                        </ValidatorForm>
                    </Grid>

                    <Grid className=" w-full" spacing={1} style={{ marginTop: 20, backgroundColor: 'red' }}>
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
                    </Grid>

                    <ValidatorForm>
                        {/* Table Section */}
                        <Grid container="container" className="mt-3 pb-5">
                            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                {this.state.loading ? (
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            filter: false,
                                            filterType: 'textField',
                                            responsive: 'standard',
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: this.state.filterData.limit,
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
                        </Grid>

                        <Dialog open={this.state.viewDailog} maxWidth="xl">
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Grid item>
                                    <IconButton aria-label="close" onClick={() => { this.setState({ viewDailog: false }) }}><CloseIcon /></IconButton>
                                </Grid>
                            </div>

                            {this.state.qaIncidentsLoaded ? (

                                <Grid className="m-5" style={{ width: 1200 }}>

                                    <Grid item="item" lg={6} md={6} sm={12} xs={12}>
                                        <p>NMQAL No : {this.state.circular_det?.nmqal_no}</p>
                                    </Grid>
                                    <Grid item="item" lg={6} md={6} sm={12} xs={12}>
                                        <p>NMQAL Recommendations : {this.state.circular_det?.nmqal_recommendations}</p>
                                    </Grid>
                                    <Grid item="item" lg={6} md={6} sm={12} xs={12}>
                                        <p>NMQAL Remarks : {this.state.circular_det?.nmqal_remarks}</p>
                                    </Grid>
                                    <Grid className="mt-3" item lg={12} md={12} sm={12} xs={12}>
                                        <table style={{width:'100%'}}>
                                            <tr>
                                                <td style={{width:'33.33%', textAlign:'center'}}>Test</td>
                                                <td style={{width:'33.33%', textAlign:'center'}}>Result</td>
                                                <td style={{width:'33.33%', textAlign:'center'}}>Specification</td>
                                            </tr>
                                            {this.state.circular_det.NMQALTests.map((item, index) => (
                                                <tr key={index}>
                                                    <td style={{ width: '33.33%', textAlign:'center'}}>{item?.Test?.name}</td>
                                                    <td style={{ width: '33.33%', textAlign:'center'}}>{item?.Result?.name}</td>
                                                    <td style={{ width: '33.33%', textAlign:'center'}}>{item?.Specification?.name}</td>
                                                </tr>
                                            ))}
                                        </table>
                                    </Grid>

                                    <Grid item="item" lg={12} md={12} sm={12} xs={12}>

                                        <LoonsTable
                                            id={"npdrug"}

                                            data={this.state.qaIncidents}
                                            columns={this.state.batchTable_coloums}
                                            options={{
                                                pagination: false,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: this.state.rowsPerPage,
                                                page: this.state.filterData.page,
                                                limit: this.state.filterData.limit,
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

                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
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

                                        <Grid item className="mt-4">
                                            {/* <NMRAreport/> */}
                                            {this.state.qaIncidentsLoaded == true ?
                                                <NMRAreport data={this.state.data[this.state.rowIndexNew]} itemDetails={this.state.qaIncidents[0]} />
                                                : null}
                                            {/* <Button
                               className="mt-6 mb-2"
                               progress={false}
                               // type="submit"
                               scrollToTop={true}
                               // startIcon="save"
                               color="secondary"
                               onClick={() => {window.location.href='/NMRA-report'}}
                           >
                               <span className="capitalize">
                                 Update
                               </span>
                           </Button>  */}
                                        </Grid>
                                        <Grid item className="mt-4">
                                            <Button
                                                className="mt-6 mb-2"
                                                progress={false}
                                                disabled={this.state.changeTab}
                                                // type="submit"
                                                scrollToTop={true}
                                                startIcon="save"
                                                onClick={() => this.setState({
                                                    changeTab: true
                                                },()=>{
                                                    this.getManufactures()
                                                })}
                                            >
                                                <span className="capitalize">
                                                    Change
                                                </span>
                                            </Button>
                                        </Grid>
                                        <Grid item className="mt-4">
                                            <Button
                                                className="mt-6 mb-2"
                                                progress={false}
                                                disabled={this.state.changeTab}
                                                // type="submit"
                                                scrollToTop={true}
                                                // startIcon="save"
                                                color="secondary"
                                                onClick={() => this.directApprove()}
                                            >
                                                <span className="capitalize">
                                                    Send for Approval
                                                </span>
                                            </Button>
                                        </Grid>


                                    </Grid>

                                </Grid>
                            ) : (
                                //loading effect
                                <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress size={30} />
                                </Grid>
                            )}
                            {this.state.changeTab ?
                                <>
                                    <Grid className="m-5">
                                        <Grid container spacing={2}>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <h7>SR No:-{this.state.qaIncidents[0]?.QualityIncident?.ItemSnapBatch?.ItemSnap?.sr_no}</h7>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <h7>Item Name:-{this.state.qaIncidents[0]?.QualityIncident?.ItemSnapBatch?.ItemSnap?.specification}</h7>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <h7>Manufacture Code:- {this.state.manufature_list.map((e)=>e?.Manufacturer?.registartion_no)}</h7>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <h7>Manufacture Name:- {this.state.manufature_list.map((e)=>e?.Manufacturer?.name)}</h7>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <h7>Batch No:-{this.state.batch_numbers.map((index, i) => index)}</h7>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle
                                                    title={
                                                        'Committee'
                                                    }
                                                ></SubTitle>
                                                <Autocomplete
                                                    disableClearable
                                                    className="w-full"
                                                    options={
                                                        appConst.commitee_qa
                                                    }
                                                    /*  defaultValue={this.setState.all_uoms.find(
                                                               (v) => v.value == ''
                                                           )}  */
                                                    getOptionLabel={(
                                                        option
                                                    ) =>
                                                        option.label
                                                    }
                                                    // value={
                                                    //     this.state.formData.manufacturer_id
                                                    // }
                                                    /*  getOptionSelected={(option, value) =>
                                                              console.log("ok")
                                                          } */

                                                    // value={this.state.all_manufacturers.find((v) =>v.id === this.state.formData.manufacturer_id
                                                    //         )}
                                                    onChange={(event, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.committee = value.label;
                                                            // formData.item_id = value.id;
                                                            console.log('SR no', formData)
                                                            this.setState({
                                                                formData
                                                                // srNo:true
                                                            })
                                                            // let formData = this.state.formData;
                                                            // formData.sr_no = value;

                                                        } else if (value == null) {
                                                            let formData = this.state.formData;
                                                            formData.committee = null;
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
                                                            placeholder="Committee"
                                                            //variant="outlined"
                                                            //value={}
                                                            value={appConst.commitee_qa.find((v) => v.label == this.state.formData.committee
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
                                                        //     'this field is required',
                                                        // ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Reported Date From" />
                                                <DatePicker
                                                    className="w-full"
                                                    placeholder="Reported Date From"
                                                    value={
                                                        this.state.formData.committee_date
                                                    }
                                                    // views={['year']}
                                                    // inputFormat="yyyy"
                                                    // format="yyyy"
                                                    onChange={(date) => {
                                                        let formData = this.state.formData
                                                        formData.committee_date = dateParse(date)
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }}
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
                                                <SubTitle title="Committee Decision" />
                                                <TextValidator
                                                    className="w-full"
                                                    placeholder="Committee Decision"

                                                    name="Committee Decision"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.formData
                                                            .committee_decision
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
                                                                committee_decision:
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
                                                    options={appConst.nmra_final_decision
                                                    }
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            // let formData = this.state.formData;
                                                            let formData = this.state.formData;
                                                            formData.nmra_final_decision = value.label
                                                            // formData.batch_no = []
                                                            // value.forEach(element => {
                                                            //     formData.batch_no.push(element.value)
                                                            // });
                                                            //formData.uoms = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}

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
                                                            value={appConst.nmra_final_decision.find((v) => v.label == this.state.formData.nmra_final_decision
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
                                                md={12}
                                                lg={12}
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
                                                            .nmra_remarks
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
                                                                nmra_remarks:
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


                                        </Grid>
                                        <Grid item className="mt-4">
                                            <Button
                                                className="mt-6 mb-2"
                                                progress={false}
                                                // type="submit"
                                                scrollToTop={true}
                                                // startIcon="save"
                                                color="secondary"
                                                onClick={() => { this.approve() }}
                                            >
                                                <span className="capitalize">
                                                    Save
                                                </span>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </>
                                : null}
                        </Dialog>

                    </ValidatorForm>


                        <Dialog
                            open={this.state.load_circular_det}
                            onClose={() => {
                                this.setState({ load_circular_det: false })
                            }}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            maxWidth="lg"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {'Circular Details'}

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Grid item>
                                        <IconButton aria-label="close" onClick={() => { this.setState({ load_circular_det: false }) }}><CloseIcon /></IconButton>
                                    </Grid>
                                </div>
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                <Grid container className="mr-5 ml-5">

                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <h7>NMRA No:- {this.state.circular_det?.nmra_no}</h7>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <h7>status:- {this.state.circular_det?.status}</h7>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <h7>NMQAL NO:- {this.state.circular_det?.nmqal_no} </h7>
                                    </Grid>

                                    <Grid className="mt-2" item lg={12} md={12} sm={12} xs={12}>
                                        <h7>NMQAL Recommendations:- {this.state.circular_det?.nmqal_recommendations} </h7>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <h7>NMRA Final Decision:- {this.state.circular_det?.nmra_final_decision} </h7>
                                    </Grid>

                                    <Grid item sm={12}>
                                        <hr></hr>
                                    </Grid>

                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <h7>SR No:- {this.state.circular_det?.ItemSnap?.sr_no}</h7>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <h7>Item Name:- {this.state.circular_det?.ItemSnap?.medium_description}</h7>
                                    </Grid>
                                    {/* <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <h7>Manufacture Code:- </h7>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <h7>Manufacture Name:-</h7>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <h7>Batch No:-</h7>
                                    </Grid>      */}

                                    <Grid item sm={12}>
                                        <hr></hr>
                                    </Grid>

                                    {this.state.load_circular_det &&
                                    <Grid className="mt-3" item lg={12} md={12} sm={12} xs={12}>
                                        <table style={{width:'100%'}}>
                                            <tr>
                                                <td style={{width:'33.33%', textAlign:'center'}}>Test</td>
                                                <td style={{width:'33.33%', textAlign:'center'}}>Result</td>
                                                <td style={{width:'33.33%', textAlign:'center'}}>Specification</td>
                                            </tr>
                                            {this.state.circular_det.NMQALTests.map((item, index) => (
                                                <tr key={index}>
                                                    <td style={{ width: '33.33%', textAlign:'center'}}>{item?.Test?.name}</td>
                                                    <td style={{ width: '33.33%', textAlign:'center'}}>{item?.Result?.name}</td>
                                                    <td style={{ width: '33.33%', textAlign:'center'}}>{item?.Specification?.name}</td>
                                                </tr>
                                            ))}
                                        </table>
                                    </Grid>
                                    }

                                </Grid>

                                </DialogContentText>
                            </DialogContent>
                            
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
                </MainContainer >

            </LoonsCard>
        )
    }
}

export default withStyles(styleSheet)(QACurrentRequests)
