import React, { Component, Fragment } from "react";
import MainContainer from "../../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../../components/LoonsLabComponents/CardTitle";
import LoonsCard from "../../../components/LoonsLabComponents/LoonsCard";
import { CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Tooltip, Typography,  Dialog,
    DialogActions,DialogContent,TextField, Fab,} from "@material-ui/core";
    import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
    import { Button,DatePicker,LoonsTable,LoonsSnackbar,FilePicker } from "app/components/LoonsLabComponents";
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
import readXlsxFile from 'read-excel-file'

import QualityAssuranceService from 'app/services/QualityAssuranceService'
import HospitalConfigServices from 'app/services/HospitalConfigServices';
import EmployeeServices from 'app/services/EmployeeServices'
import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from 'app/services/localStorageService'
import DonarService from '../../../services/DonarService'
import ClinicService from "app/services/ClinicService";

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

        this.viewContentRef = React.createRef();
        this.viewSampleRef = React.createRef();
        this.state = {
            alert: false,
            message: '',
            severity: 'success',

            files: { fileList: [] },
            classes: styleSheet,
            loading: true,
            sr_no: [],
            totalItems: 0,
            itemName:null,  
            srNo2 :null,  
            itemId:null,
            formData:{
                search:null
            },

            pharmacy_list:[],

            hospitalData:[],
            loggedUser:null,
            isItem:null,
            isBatch:null,
            
            selectedManufacturesList:[],
            selected_id: null,
            selective_manufacture:null,
            totalqaIncidents:null,
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
                'order[0]': ['createdAt', 'DESC'],
                // sample_status: 'Recieved'
            },

            qaIncidentsData: {
                limit: 10,
                page: 0,
                // 'order[0]': ['createdAt', 'DESC'],
            },
            owner_id:null,
            qaIncidents: [
                {
                  active_button: true,
                },
              ],
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
                
                // {
                //     name: 'createdAt', // field name in the row object
                //     label: 'Created Date', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return dateParse(value)
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
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     return this.state.data[tableMeta.rowIndex]?.log_no
                        // },
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
                    name: 'medium_description', // field name in the row object
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
                    name: 'institute',
                    label: 'Institute',
                    options: {
                        
                        customBodyRender: (value, tableMeta, updateValue) => {


                            // console.log('incomming data', data)

                            let HospitalData = this.state.hospitalData.find((e)=>e?.owner_id === this.state.data[tableMeta.rowIndex]?.owner_id)
                            
                            return (
                                <p>{HospitalData?.name ? HospitalData?.name + '( ' + HospitalData?.Department?.name + ' )' : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'batch_no', // field name in the row object
                    label: 'Batch No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.batch_no
                        },
                    },
                },
                {
                    name: 'last', // field name in the row object
                    label: 'Last Complaint Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(this.state.data[tableMeta.rowIndex]?.complain_date)
                        },
                       
                    },
                },
                {
                    name: 'incident_count', // field name in the row object
                    label: 'Manufactuer', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return value
                            
                        },
                    },
                },
                {
                    name: 'incident_count', // field name in the row object
                    label: 'Total Log Count', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return value
                            
                        },
                    },
                },
                // {
                //     name: 'mfd', // field name in the row object
                //     label: 'Manufacturer', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.manufacture_id
                //         },
                //     },
                // },
                {
                    name: 'mfd', // field name in the row object
                    label: 'Expire Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(this.state.data[tableMeta.rowIndex].ItemSnapBatch?.exd)
                        },
                    },
                },
               
                {
                    name: 'defects', // field name in the row object
                    label: 'Defect', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return value
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
                //                 color="s"
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
                // {
                //     name: 'status', // field name in the row object
                //     label: 'Status', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //         // customBodyRender: (value, tableMeta, updateValue) => {
                //         //     return this.state.data[tableMeta.rowIndex]?.Complaint_by?.name
                //         // },
                //     },
                // },
                 {
                    name: 'sample_status', // field name in the row object
                    label: 'Sample Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let sample = this.state.data[tableMeta.rowIndex]?.sample_status
                            if (sample == null){
                                return 'Sample not Submitted'
                            }else{
                                return this.state.data[tableMeta.rowIndex]?.sample_status
                            }
                           
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
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.status
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
                                    {console.log('aaajajajahahjahjaj', this.state.loggedUser)}
                                    {this.state.loggedUser != 'MSD SCO QA' && this.state.loggedUser != 'MSD Director' ?
                                    <Tooltip title="View Item">
                                    <IconButton
                                        disabled={(this.state.data[dataIndex].sample_status == null ||this.state.data[dataIndex].sample_status == 'Submitted' ||this.state.data[dataIndex].sample_status == 'Sample Rejected'||this.state.data[dataIndex].sample_status == 'Unsatisfied' )&&( this.state.data[dataIndex].status !== 'Approved by Chief Pharmacist') ? true:false }
                                        onClick={() => {
                                            
                                            console.log('data------------->>>',this.state.data[dataIndex])
                                           this.setState({
                                            itemName:this.state.data[dataIndex]?.ItemSnapBatch?.ItemSnap?.medium_description,
                                            srNo2:this.state.data[dataIndex]?.ItemSnapBatch?.ItemSnap?.sr_no,
                                            itemId:this.state.data[dataIndex]?.ItemSnapBatch?.ItemSnap?.id,
                                            selective_manufacture:this.state.data[dataIndex]?.ItemSnapBatch?.Manufacturer?.id,
                                            selected_id: id
                                           }, ()=>{
                                            this.LoadQualityIncident()
                                           
                                           })
                                           
                                        }}
                                        // className="px-2"
                                        size="small"
                                        aria-label="View Item"
                                        color={this.state.data[dataIndex].sample_status == null ||this.state.data[dataIndex].sample_status == 'Submitted' ||this.state.data[dataIndex].sample_status == 'Sample Rejected' ? 'secondary' : 'primary'}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                       
                                    </Tooltip>
                                    :null}
                                </Grid>
                                
                            )
                        },
                    },
                },
            ],

            manufactureLoading: null,
            manufacture_list: [],
            manufacture_list_column: [
                {
                    name: '',
                    label: '',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            
                            if (this.state.manufacture_list) {
                                return <input
                                    type="checkbox"
                                    style={{
                                        width: "20px",
                                        height: "20px", outline: "none",
                                        cursor: "pointer"
                                    }}
                                    value={this.state.manufacture_list[dataIndex]?.manufacture_id
                                    }
                                    // defaultChecked={this.state.manufacture_list.includes(this.state.supplier_data[dataIndex]?.id)}
                                    // checked={this.state.selectedSuppliersList.includes(this.state.supplier_data[dataIndex]?.id)}
                                    
                                    onClick={()=>{
                                        this.clickingManufacture(this.state.manufacture_list[dataIndex]?.manufacture_id)
                                    }}
                                />
                            } else {
                                return "N/A"
                            }

                        }
                    }
                },
                // {
                //     name: 'manufacture_no',
                //     label: 'Manufacture ID',
                //     options: {
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             console.log("data22",this.state.qaIncidents[tableMeta.rowIndex])
                //             return this.state.manufacture_list[tableMeta.rowIndex]?.Manufacturer?.registartion_no
                //         },
                //     }
                // },
                {
                    name: 'name',
                    label: 'Manufacture Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.manufacture_list[tableMeta.rowIndex]?.Manufacture
                        },
                    }
                },
            ],

            manufacture_data:{
                page:0,
                limit:10
            },

            qaIncidentscolumns: [
                {
                    name: 'log_no', // field name in the row object
                    label: 'Log No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("data22",this.state.qaIncidents[tableMeta.rowIndex])
                            return this.state.qaIncidents[tableMeta.rowIndex]?.log_no
                        },
                    },
                },
                {
                    name: 'batch_no', // field name in the row object
                    label: 'Batch No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                       
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.qaIncidents[tableMeta.rowIndex]?.ItemSnapBatch?.batch_no
                        },
                    },
                },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.qaIncidents[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.sr_no
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
                    name: 'log', // field name in the row object
                    label: 'Log Initiated by', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.qaIncidents[tableMeta.rowIndex]?.Log_by?.name
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
                    name: 'manufacture', // field name in the row object
                    label: 'Manufacture', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.qaIncidents[tableMeta.rowIndex]?.ItemSnapBatch?.Manufacturer?.name
                        },
                    },
                },
                {
                    name: 'manufacture_reg_no', // field name in the row object
                    label: 'Manufacture Reg No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.qaIncidents[tableMeta.rowIndex]?.ItemSnapBatch?.Manufacturer?.registartion_no
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
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(this.state.qaIncidents[tableMeta.rowIndex]?.ItemSnapBatch?.mfd)
                        },
                    },
                },
               
                // {
                //     name: 'sample_submit_status', // field name in the row object
                //     label: 'Sample Submit Status', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //           customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <> 
                //                 <Grid container>
                //                  <Button
                //                 color="s"
                //                 className="mr-1"
                //                 disabled={false}
                //             //     onClick={() => {
                //             //       this.setState({
                //             //         sampleSubmitDialog: true,
                //             //                 })
                //             //  }} 
                //             >
                //                 Sample Submitted
                //             </Button>
                //                 </Grid>
                //                 </>
                //             )
                //          },
                //     },
                // },
              
                // {
                //     name: 'action',
                //     label: 'Action',
                //     options: {
                //         customBodyRenderLite: (dataIndex) => {
                //             // let id = this.state.data[dataIndex].id
                //             // let donar_id = this.state.data[dataIndex]?.Donor?.id
                //             // [dataIndex]?.Donor?.id
                //             return (
                //                 <Grid className="flex items-center">
                //                     <Tooltip title="View Item">
                //                     <IconButton
                //                         // disable={this.state.data}
                //                         onClick={() => {
                                        
                //                         //    this.setState({
                //                         //     qualityissueApproveDialog:true
                //                         //    })
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
                    name: 'mfd', // field name in the row object
                    label: 'LR NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width:10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return(
                                // <Grid>
                                <TextValidator
                                    // className="w-full"
                                    defaultValue={value != null ? value : 0}
                                    // style={{
                                    //     width: 80
                                    // }}
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

                                        if (e.target.value != null) {
                                            qaIncidents[tableMeta.rowIndex].active_button = false 
                                        } else {
                                            qaIncidents[tableMeta.rowIndex].active_button = true
                                        }

                                        
                                        this.setState({ qaIncidents },
                                            console.log("cartStatus", qaIncidents[tableMeta.rowIndex]))
                                    }}></TextValidator>
                                
                            // </Grid>                            
                            )
                        },
                    },
                },
               

                {
                    name: 'mfd', // field name in the row object
                    label: 'Sample Result', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 20,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('cheking button status', this.state.qaIncidents[tableMeta.rowIndex])
                            return(
                                <Grid container>
                                     <Grid item lg={10} className="mt-1">
                                <Autocomplete
                                            // className="w-full"
                                            disabled={this.state.qaIncidents[tableMeta.rowIndex].lr_added == true ? true : false}
                                            options={appConst.sample_result}
                                            clearOnBlur={true}
                                            clearText="clear"
                                            onChange={(e, value) => {
                                               console.log('sample',value.value)
                                                if (null != value.value) {
                                                  if(value.value == 'Satisfied'){
                                                    this.setState({
                                                       sample_status:'Satisfied'
                                                     })
                                                  }else if(value.value == 'Unsatisfied'){
                                                    this.setState({
                                                        sample_status:'Unsatisfied'
                                                     })
                                                  }
                                                  else if(value.value == 'Not Analysed'){
                                                    this.setState({
                                                        sample_status:'Not Analysed'
                                                     })
                                                  }
                                                  console.log('sample',this.state.sample_status)
                                                    // this.setState({ filterData })
                                                }
                                            }} 
                                            
                                            getOptionLabel={(option) =>
                                                option.label ? option.label : ''
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
                           
                                                        <Grid className=" mt-1" item lg={1}>
                                                           
                                                        <Tooltip title="Allocate">
                                                                        <IconButton
                                                                        disabled={this.state.qaIncidents[tableMeta.rowIndex].lr_added == true ? true : false || this.state.qaIncidents[tableMeta.rowIndex].active_button}
                                                                            onClick={() => {
                                                                                let qaIncidents =  this.state.qaIncidents

                                                                                qaIncidents[tableMeta.rowIndex].lr_added = true
                                                                                this.selectedRows(qaIncidents[tableMeta.rowIndex])    
                                                                                 this.setState({
                                                                                    qaID: qaIncidents[tableMeta.rowIndex].id,
                                                                                    batchTable:true,
                                                                                    loadTable:true
                                                                                 })
                                                                                 
                                                                                // window.location.href = `/msd/check-store-space/${id}`
                                                                            }}
                                                                            >
                                                                            <AddIcon color={this.state.qaIncidents[tableMeta.rowIndex].active_button ? 'disabled' : 'primary'} />
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
                        // width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('cheking sjshdhjshjsd', this.state.batchArray[tableMeta.rowIndex])
                            return this.state.batchArray[tableMeta.rowIndex]?.ItemSnapBatch?.batch_no
                        },
                    },
                },
                {
                    name: 'log_no', // field name in the row object
                    label: 'Log No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.batchArray[tableMeta.rowIndex]?.log_no
                        },
                    },
                },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.batchArray[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.medium_description
                        },
                    },
                },
                {
                    name: 'lr_no', // field name in the row object
                    label: 'LR No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.batchArray[tableMeta.rowIndex]?.lr_no
                        },
                    },
                },
                {
                    name: 'manufacture', // field name in the row object
                    label: 'Manufacture', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.batchArray[tableMeta.rowIndex]?.ItemSnapBatch?.Manufacturer?.name
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
    async submit(){
        let log_details= []
        let data
        let formData = this.state.formData
        let batchArray = this.state.batchArray

        const { selectedManufacturesList, selective_manufacture } = this.state;
        const updatedManufacturesList = [...selectedManufacturesList, selective_manufacture];
        let uniquManufactireList = [...new Set(updatedManufacturesList)]

        console.log('selective_manufacture',selective_manufacture)
        if(this.state.sample_status == 'Satisfied' || this.state.sample_status == 'Unsatisfied'){
            for (let index = 0; index < batchArray.length; index++) {
                let logData ={
                    qualityincident_id : batchArray[index]?.id,
                    log_report_no : batchArray[index]?.lr_no,
                    source : batchArray[index]?.source,
                    batch_no: batchArray[index]?.batch_no,
                    // lr_no : batchArray[index]?.lr_no,
                }
                log_details.push(logData)
            }
            console.log('log_details',log_details)

            if (this.state.isItem == true){
                data = {
                    log_details:log_details,
                    tests:this.state.testArray.length0 ? [] : this.state.testArray,
                    reason_for_sending:formData.reason_for_sending,
                    analytical_report:formData.analytical_report,
                    nmqal_recommendations:formData.nmqal_recommendations,
                    nmqal_remarks:formData.nmqal_remarks,
                    created_by:JSON.parse(localStorage.getItem('userInfo')).id,
                    nmqal_reportby:JSON.parse(localStorage.getItem('userInfo')).id,
                    sample_status : this.state.sample_status,
                    status:'NMQAL Sent for approval',
                    item_id: this.state.itemId,
                    manufacture_ids: uniquManufactireList
                    }
            } else if (this.state.isBatch == true) {
                data = {
                    log_details:log_details,
                    tests:this.state.testArray.length0 ? [] : this.state.testArray,
                    reason_for_sending:formData.reason_for_sending,
                    analytical_report:formData.analytical_report,
                    nmqal_recommendations:formData.nmqal_recommendations,
                    nmqal_remarks:formData.nmqal_remarks,
                    created_by:JSON.parse(localStorage.getItem('userInfo')).id,
                    nmqal_reportby:JSON.parse(localStorage.getItem('userInfo')).id,
                    sample_status : this.state.sample_status,
                    status:'NMQAL Sent for approval',
                    item_batch_id: this.state.selected_id,
                    item_id: this.state.itemId,
                    manufacture_ids:  uniquManufactireList // selective_manufacture
                    }
            } else {
                data = {
                    log_details:log_details,
                    tests:this.state.testArray.length0 ? [] : this.state.testArray,
                    reason_for_sending:formData.reason_for_sending,
                    analytical_report:formData.analytical_report,
                    nmqal_recommendations:formData.nmqal_recommendations,
                    nmqal_remarks:formData.nmqal_remarks,
                    created_by:JSON.parse(localStorage.getItem('userInfo')).id,
                    nmqal_reportby:JSON.parse(localStorage.getItem('userInfo')).id,
                    sample_status : this.state.sample_status,
                    status:'NMQAL Sent for approval',
                    item_id: this.state.itemId,
                    }
            }

        }else{
            if (this.state.isItem == true){
                data = {
                    log_details:log_details,
                    tests:[],
                    nmqal_remarks:formData.nmqal_remarks,
                    created_by:JSON.parse(localStorage.getItem('userInfo')).id,
                    nmqal_reportby:JSON.parse(localStorage.getItem('userInfo')).id,
                    sample_status : this.state.sample_status,
                    status:'NMQAL Sent for approval',
                    item_id: this.state.itemId,
                    manufacture_ids: uniquManufactireList
                    }
            } else if (this.state.isBatch == true) {
                data = {
                    log_details:log_details,
                    tests:[],
                    nmqal_remarks:formData.nmqal_remarks,
                    created_by:JSON.parse(localStorage.getItem('userInfo')).id,
                    nmqal_reportby:JSON.parse(localStorage.getItem('userInfo')).id,
                    sample_status : this.state.sample_status,
                    status:'NMQAL Sent for approval',
                    item_batch_id: this.state.selected_id,
                    item_id: this.state.itemId,
                    manufacture_ids: uniquManufactireList // selective_manufacture
                }
            } else {
                data = {
                    log_details:log_details,
                    tests:[],
                    nmqal_remarks:formData.nmqal_remarks,
                    created_by:JSON.parse(localStorage.getItem('userInfo')).id,
                    nmqal_reportby:JSON.parse(localStorage.getItem('userInfo')).id,
                    sample_status : this.state.sample_status,
                    item_id: this.state.itemId,
                    status:'NMQAL Sent for approval',
                }
            }
            
        }
        let params = {
            sample_status : this.state.sample_status,
        }
        console.log("data",data)
        console.log("data erroe checkig",this.state.qaID, params)


        if (uniquManufactireList.length > 0){

        await QualityAssuranceService.approvalORejectionNMQL(params, this.state.qaID)
        let res = await QualityAssuranceService.AddingNQMLrecommendation(data)
        console.log('Res===========>', res)
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Create Issue Successfully ',
                severity: 'success',
            },() => {
                window.location.reload()
            })
            this.LoadData()
        } else {
            this.setState({
                alert: true,
                message: 'Create Issue was Unsuccessful',
                severity: 'error',
            })
        }

    } else {
        this.setState({
            alert: true,
            message: 'Manufacture is not selected',
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


    clickingManufacture(id) {
        let selectedManufactures = this.state.selectedManufacturesList || []; // Initialize as an empty array if undefined
        let index = selectedManufactures.indexOf(id);
    
        if (index === -1) {
            selectedManufactures.push(id);
        } else {
            selectedManufactures.splice(index, 1);
        }
    
        this.setState({ selectedManufacturesList: selectedManufactures }, () => {
            console.log('hhhhhhhhhhjkjk', this.state.selectedManufacturesList);
        });
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

    async setManufacturePage(page) {
        let params = this.state.manufacture_data
        params.page = page
        this.setState(
            {
                params,
            },
            () => {
                this.selectManufactures()
            }
        )
    }

    async setqaIncidentsDataPage(page) {
        let params = this.state.qaIncidentsData
        params.page = page
        this.setState(
            {
                params,
            },
            () => {
                this.LoadQualityIncident()
            }
        )
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

   async componentDidMount() {
        let owner_id = await localStorageService.getItem('owner_id')
        let user_role = await localStorageService.getItem('userInfo')
        this.setState({
           owner_id:owner_id,
           loggedUser: user_role.roles[0]
        })
        this.loadWarehouses()
        this.LoadData()
        this.LoadAllManufacturers()
        this.testDataGET()
    }
    async LoadData() {
        this.setState({ loading: false })
        let filterData = this.state.filterData
        // filterData.owner_id = this.state.owner_id
        // filterData.status = 'Approved by Chief Pharmacist'
        // filterData.search_type = 'GROUP' 
        let res = await QualityAssuranceService.getAllQualityIncidents(filterData)
        if (res.status == 200) {
            this.setState({
                data: res.data.view.data,
                totalItems:res.data.view.totalItems,
                // loading: true
            },() =>
            this.loadHospitals(res.data.view.data)
             )
        }   
     }  
     async LoadQualityIncident(){
        this.setState({ qaIncidentsLoaded: false })
        console.log("State 1:---------------->>>", this.state.selected_id)
        let params = {
            item_batch_id:this.state.selected_id,
            status :'Approved by Chief Pharmacist',
            page : 0,
            limit : 10
        }
        let res = await QualityAssuranceService.getAllQualityIncidents(params)
        if (res.status == 200) {
            console.log("res23",res)
            this.setState({
                qaIncidents: res.data?.view?.data,
                totalqaIncidents:res.data.view.totalItems,
                qaIncidentsLoaded: true
            },() => {
                this.scrollToViewContent()
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
            batchArray ,
            totalBatchItems:batchArray.length
        }, ()=>{
            this.scrollContentSampleStatus()
        })
        // let qaIncidents = this.state.qaIncidents
        // qaIncidents.filter((value) => value.lr_added == true)
        
        // for (let index = 0; index < data.length; index++) {
        //     batchArray = data.lr_no;
            
        // }
    }

    async selectManufactures() {
        console.log('selected success')

        let params = {
            item_id: this.state.itemId,
            exp_date_grater_than_zero_search:true,
            search_type:'MANUFACTURE'
        }

        let res = await InventoryService.fetchItemBatchByItem_Id(params)

        if (res.status === 200){
            console.log('cheking manufactures', res)
            this.setState({
                manufacture_list: res.data.view,
                totalManufacture:res.data.view.totalItems,
                manufactureLoading: true
            })
        }
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
    async loadFile() {
        const schema = this.state.schema

        if (this.state.file.fileList.length > 0) {
            let file = this.state.file.fileList[0].file

            readXlsxFile(file, { schema }).then(({ rows, errors }) => {
                console.log('table data ', rows)
                console.log('error', errors)
                this.setState({ tableData: rows })
            })
        } else {
            this.setState({ tableData: [] })
        }
    }

    async selectedFiles(file) {
        this.setState({ file: file }, () => {
            this.loadFile()
        })
    }

    scrollToViewContent = () => {
        // Scroll to the element with id 'viewContent'
        if (this.viewContentRef.current) {
          this.viewContentRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start', 
          });
        }
      };

      scrollContentSampleStatus = () => {
        // Scroll to the element with id 'viewSample'
        if (this.viewSampleRef.current) {
          this.viewSampleRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      };


      async loadHospitals(mainData){
        console.log('checkinf min data' , mainData)
        let params = { 
            issuance_type: ["Hospital", 'RMSD Main'], 
            // limit: 1, 
            // page: 0,
            'order[0]': ['createdAt', 'ASC'],
            selected_owner_id: mainData?.map(x=>x?.owner_id)
        };
    
        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('ceking ospital', res.data.view.data)
            this.setState({
                hospitalData:res.data.view.data,
                loading:true
            })
        }

    }


    async getPharmacyDetails(search) {
        let params = {
            limit: 500,
            page: 0,
            issuance_type: ['Hospital', 'RMSD Main', 'MSD Main'],
            search: search
        };

        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('phar------------------>>>>> check', res);

            this.setState({
                pharmacy_list: res.data.view.data
            });
        }
    }
    


    render() {
        const { classes } = this.props
        return (
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

                            {/* <Grid item="item" className="px-2" lg={2} md={2} sm={12} xs={12}>
                            <SubTitle title="Institution" />
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                options={this.state.pharmacy_list} 
                                onChange={(e, value) => {
                                    let formData = this.state.filterData
                                    if (value != null) {                                      
                                        formData.owner_id = value.owner_id;
                                        this.setState({ formData });
                                    } else {
                                        formData.owner_id = null;
                                        this.setState({ formData });
                                    }
                                }}

                                value={
                                    this.state.all_pharmacy &&
                                    this.state.all_pharmacy.find((v) => v.owner_id === this.state.filterData.to_owner_id)
                                }
                                getOptionLabel={(option) => (option && option.name ? (option.name + ' - ' + option?.Department?.name) : '')}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Institution"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            if (e.target.value.length > 3) {
                                                this.getPharmacyDetails(e.target.value);
                                            }
                                        }}
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
                                <SubTitle title="Status" />
                                <Autocomplete
                                    className="w-full"
                                    options={
                                        appConst.qa_status
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
                                            placeholder="Select Status"
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
                                        let formData = this.state.filterData
                                        formData.search = e.target.value
                                        this.setState({ formData })
                                      
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

                    <ValidatorForm
                                // className="pt-2"
                                // ref={'outer-form'}
                                // onSubmit={() => this.submit()}
                                // onError={() => null}
                            >
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
                        </Grid>
                        <Grid ref={this.viewContentRef} id="viewContent" item="item" lg={12} md={12} sm={12} xs={12}>
                                {this.state.qaIncidentsLoaded ? (
                                            <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.qaIncidents}
                                            columns={this.state.qaIncidentscolumns}
                                            options={{
                                                // filter: false,
                                                // filterType:'textField',
                                                // responsive: 'standard',
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalqaIncidents,
                                                rowsPerPage: 10,
                                                page: this.state.qaIncidentsData.page,
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
                                null
                                    //loading effect
                                    // <Grid className="justify-center text-center w-full pt-12">
                                    //     <CircularProgress size={30} />
                                    // </Grid>
                                )}
                            </Grid>
                            </ValidatorForm>
                            <div ref={this.viewSampleRef} id="viewSample">
                            {this.state.loadTable && (this.state.sample_status == 'Satisfied' ||this.state.sample_status == 'Unsatisfied' )?
                            <>
                            <SubTitle  title={`Sample Status:-${this.state.sample_status}`}  ></SubTitle>          

                                <Grid    item="item" lg={6} md={6} sm={12} xs={12}>
                                {this.state.batchTable ? (
                                            <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.batchArray}
                                            columns={this.state.batchTable_coloums}
                                            options={{
                                                filter: false,
                                                filterType:'textField',
                                                responsive: 'standard',
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalBatchItems,
                                                rowsPerPage: 10,
                                                // page: this.state.batchData.page,
                                                // onTableChange: (
                                                //     action,
                                                //     tableState
                                                // ) => {
                                                //     console.log(
                                                //         action,
                                                //         tableState
                                                //     )
                                                //     switch (action) {
                                                //         case 'changePage':
                                                //             this.setPage(
                                                //                 tableState.page
                                                //             )
                                                //             break
                                                //         case 'sort':
                                                //             //this.sort(tableState.page, tableState.sortOrder);
                                                //             break
                                                //         default:
                                                //             console.log(
                                                //                 'action not handled.'
                                                //             )
                                                //     }
                                                // },
                                            }}
                                        ></LoonsTable>
                            ) : (
                                    //loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )}
                            </Grid>
                 
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.submit()}
                                onError={() => null}
                            >
                                
                  <Grid
                                         // className='mt-2'
                                         item
                                         lg={6}
                                         md={6}
                                         sm={12}
                                         xs={12}
                                     >
                </Grid>
                  <Grid item="item" lg={10} md={10} sm={12} xs={12}>
                                {this.state.testArray?.map((index,i)=> (
                                     <Grid container spacing={2}>
                                     <Grid
                                         // className='mt-2'
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
                                     </Grid>
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
                                                                                    v.id ===this.state.testArray[index]?.test_id
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
                                                                                        v.id ===this.state.testArray[index]?.test_id
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
                                                                                    v.id ===this.state.testArray[index]?.specification_id
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
                                                                                        v.id ===this.state.testArray[index]?.specification_id
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
                                                                                    v.id ===this.state.testArray[index]?.result_id
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
                                                                                        v.id ===this.state.testArray[index]?.result_id
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
                                <Grid item>
                                {/* Add new  */}
                               <Fab size="small" color="primary" aria-label="add" onClick={() => { this.addNewTest() }}>
                                                    <AddIcon />
                                                </Fab> 
                                     {/* <AddCircleOutlineRoundedIcon
                                    onClick={()=>this.addNewTest()}
                                    />  */}
                                </Grid> 
                            </Grid>
                            </Grid>  
                            <Grid container spacing={2}>
                                 <Grid
                                      item
                                      lg={6}
                                      md={6}
                                      sm={12}
                                      xs={12}>
                                        <h4>SR No:-{this.state.srNo2}</h4>
                                    </Grid>
                                    <Grid
                                      item
                                      lg={6}
                                      md={6}
                                      sm={12}
                                      xs={12}>
                                        <h4>Item Name:-{this.state.itemName}</h4>
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
                                                  
                                                    // multiple
                                                    getOptionLabel={(option) => option.label}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Select"
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
                                   <SubTitle title={'NMQAL Recommendation'}  ></SubTitle>          
                                   <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={appConst.nmra_final_decision
                                                    }
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            // let formData = this.state.formData;
                                                            let formData = this.state.formData;
                                                            formData.nmqal_recommendations = value.label


                                                            if (value.label === 'To Withhold the above Product as a preliminary precaution' || value.label === 'To Withdraw the above Product' || value.label === 'Revoke product') {
                                                                this.selectManufactures()
                                                                this.setState({
                                                                    isItem: true,
                                                                    isBatch : false
                                                                })
                                                            } else if (value.label === 'To Withhold the above Batch as a preliminary precaution' || value.label === 'To Withdraw the above Batch' || value.label === 'Revoke batch'
                                                            || value.label === 'To Withhold the above Batches as a preliminary precaution' || value.label === 'To Withdraw the above Batches' || value.label === 'Revoke batches') {
                                                                this.selectManufactures()
                                                                this.setState({
                                                                    manufactureLoading:true,
                                                                    isItem: false,
                                                                    isBatch : true
                                                                })
                                                            } else {
                                                                this.setState({
                                                                    manufactureLoading:false,
                                                                    isItem: false,
                                                                    isBatch : false
                                                                })
                                                            }
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
                                                            placeholder="Select NMQAL Recommendation"
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
                                {/* <Grid container="container" className="mt-3 pb-5"> */}
                                
                                    <Grid className="mt-5" item="item" lg={6} md={6} sm={6} xs={12}>
                                    
                                        {this.state.manufactureLoading === true ? (
                                            <>
                                                    <SubTitle title="Select Manufacture" />
                                                    <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    id={'allAptitute'}
                                                    data={this.state.manufacture_list}
                                                    columns={this.state.manufacture_list_column}
                                                    options={{
                                                        // filter: false,
                                                        // filterType:'textField',
                                                        // responsive: 'standard',
                                                        // pagination: true,
                                                        // serverSide: true,
                                                        count: this.state.totalManufacture,
                                                        rowsPerPage: 10,
                                                        page: this.state.manufacture_data.page,
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
                                                                    this.setManufacturePage(
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

                                            </> 
                                    ) : (
                                            //loading effect
                                            null
                                        )}
                                    </Grid>
                                {/* </Grid> */}
                                <Grid item xs={12} sm={12} md={8} lg={8}>
                                                <SubTitle title="Supporting Documents" />
                                                <FilePicker
                                                    className="w-full mt-2"
                                                    singleFileEnable={true}
                                                    id="supporting_image"
                                                    multipleFileEnable={false}
                                                    dragAndDropEnable={true}
                                                    //tableEnable={false}
                                                    documentName={false}
                                                    //documentNameValidation={['required']}
                                                    //documenterrorMessages={['this field is required']}
                                                    accept="image/png, image/gif, image/jpeg"
                                                    maxFileSize={512000}
                                                    maxTotalFileSize={512000}
                                                    maxFilesCount={1}
                                                    //validators={['required', 'maxSize', 'maxTotalFileSize', 'maxFileCount']}
                                                    // errorMessages={['this field is required', "file size too lage", "Total file size is too lage", "Too many files added"]}
                                                    // validators={['required', 'maxSize', 'maxTotalFileSize', 'maxFileCount']}
                                                    // errorMessages={['this field is required', "file size too lage", "Total file size is too lage", "Too many files added"]}
                                                    label=""
                                                    singleFileButtonText="Select File"
                                                    multipleFileButtonText="Select Files"
                                                    selectedFileList={this.state.files.fileList}
                                                    selectedFiles={(files) => {
                                                        this.setState({ files: files })
                                                    }}
                                                />
                                            </Grid>

                                     </Grid>
                                     <Grid item xs={12} sm={12} md={6} lg={6}>
                                            <Button
                                    className="mt-4 mb-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    startIcon="save"
                                    // onClick={() => { this.submit() }}


                                >
                                    <span className="capitalize">
                                        Save
                                    </span>
                                </Button> 
                                            </Grid>
                                     </ValidatorForm>
                            </>
                            :null}
                            </div>
                            {this.state.loadTable && this.state.sample_status == 'Not Analysed' ? 
                                                        <>
                                                        <SubTitle title={`Sample Status:-${this.state.sample_status}`}  ></SubTitle>          
                                             
                                                        <ValidatorForm
                                                            className="pt-2"
                                                            ref={'outer-form'}
                                                            onSubmit={() => this.submit()}
                                                            onError={() => null}
                                                        >
                                                            
                                              <Grid
                                                                     // className='mt-2'
                                                                     item
                                                                     lg={6}
                                                                     md={6}
                                                                     sm={12}
                                                                     xs={12}
                                                                 >
                                            </Grid>
                                                        <Grid container spacing={2}>
                                                             <Grid
                                                                  item
                                                                  lg={6}
                                                                  md={6}
                                                                  sm={12}
                                                                  xs={12}>
                                                                    <h4>SR No:-{this.state.srNo2}</h4>
                                                                </Grid>
                                                                <Grid
                                                                  item
                                                                  lg={6}
                                                                  md={6}
                                                                  sm={12}
                                                                  xs={12}>
                                                                    <h4>Item Name:-{this.state.itemName}</h4>
                                                                </Grid>
                                                              
                                                        </Grid>
                                                        <Grid container spacing={2}>
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
                                                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                                <SubTitle title="Supporting Documents" />
                                                <FilePicker
                                                    className="w-full mt-2"
                                                    singleFileEnable={true}
                                                    id="supporting_image"
                                                    multipleFileEnable={false}
                                                    dragAndDropEnable={true}
                                                    //tableEnable={false}
                                                    documentName={false}
                                                    //documentNameValidation={['required']}
                                                    //documenterrorMessages={['this field is required']}
                                                    accept="image/png, image/gif, image/jpeg"
                                                    maxFileSize={512000}
                                                    maxTotalFileSize={512000}
                                                    maxFilesCount={1}
                                                    //validators={['required', 'maxSize', 'maxTotalFileSize', 'maxFileCount']}
                                                    // errorMessages={['this field is required', "file size too lage", "Total file size is too lage", "Too many files added"]}
                                                    // validators={['required', 'maxSize', 'maxTotalFileSize', 'maxFileCount']}
                                                    // errorMessages={['this field is required', "file size too lage", "Total file size is too lage", "Too many files added"]}
                                                    label=""
                                                    singleFileButtonText="Select File"
                                                    multipleFileButtonText="Select Files"
                                                    selectedFileList={this.state.files.fileList}
                                                    selectedFiles={(files) => {
                                                        this.setState({ files: files })
                                                    }}
                                                />
                                            </Grid>

                                                                 </Grid>
                                                                 <Grid
                                                                item
                                                                xs={12}
                                                                sm={12}
                                                                md={6}
                                                                lg={6}
                                                                // className="p-8"
                                                            >
                                                               <Button
                                                                className="mt-4 mb-2"
                                                                progress={false}
                                                                type="submit"
                                                                scrollToTop={true}
                                                                startIcon="save"
                                                                // onClick={() => { this.submit() }}
                            
                            
                                                            >
                                                                <span className="capitalize">
                                                                    Save
                                                                </span>
                                                            </Button>   
                                                            </Grid>
                                                                 </ValidatorForm>
                                                        </>
                            
                            :null}
                  
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
        )
    }
}

export default withStyles(styleSheet)(QACurrentRequests)
