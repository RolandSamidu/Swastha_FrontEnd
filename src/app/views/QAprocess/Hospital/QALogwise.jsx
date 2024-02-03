import React, { Component, Fragment } from "react";
import MainContainer from "../../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../../components/LoonsLabComponents/CardTitle";
import LoonsCard from "../../../components/LoonsLabComponents/LoonsCard";
import {
    CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Tooltip, Typography, Dialog,
    DialogActions,
    DialogContent,
} from "@material-ui/core";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Button, DatePicker, LoonsTable, LoonsSnackbar } from "app/components/LoonsLabComponents";
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import SubTitle from "../../../components/LoonsLabComponents/SubTitle";
import Paper from '@material-ui/core/Paper';
import { Autocomplete } from "@mui/material";
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DonarService from '../../../services/DonarService'
import TaskIcon from '@mui/icons-material/Task';
import VisibilityIcon from '@material-ui/icons/Visibility'
import localStorageService from 'app/services/localStorageService'
import EmployeeServices from 'app/services/EmployeeServices'
import WarehouseServices from "app/services/WarehouseServices";
import VaccinesIcon from '@mui/icons-material/Vaccines';
import InventoryService from 'app/services/InventoryService'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { dateParse, roundDecimal } from "utils";
import * as appConst from '../../../../appconst'
import { withStyles } from '@material-ui/core/styles'
import QualityAssuranceService from 'app/services/QualityAssuranceService'
import MSDPrintLab from '../Prints/MSDPrintLab';
// import MSD_Print from '../../MSD_Medical_Supply_Assistant/MSMIS_Print/MSD_Print';
import moment from 'moment';
import HospitalIssueNote from '../Prints/HospitalIssueNote'
import DistributionCenterServices from "app/services/DistributionCenterServices";
import { TimelineSeparator } from "@material-ui/lab";
import { times } from "lodash";
import ReplyIcon from '@mui/icons-material/Reply';
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

class QALogwise extends Component {
    constructor(props) {
        super(props)
        this.state = {

            //snackbar
            alert: false,
            message: '',
            severity: 'success',

            classes: styleSheet,
            loading: true,
            rowIndexNew: null,
            sr_no: [],
            totalItems: 0,
            keeper_warehouse_loaded:[],
            formData: {
                sr_no: '',
                donor_name: '',
                donor_country: '',
                delivery_date: '',
                approved_date: '',
            },
            complaint: {
                remark: null
            },
            sampleData: {
                sample_quantity: 0,
                sample_location: null
            },
            all_warehouse_loaded: [],
            sampleSubmitDialog: false,
            qualityissueApproveDialog: false,
            empData: [],
            allDonorData: [],
            donarName: [],
            // totalItems: 0,
            filterData: {
                limit: 10,
                page: 0,
                delivery_date: null,
                approved_date: null,
                donor_name: null,
                donor_country: null,
                description: null,
                sr_no: null,
                'order[0]': ['createdAt', 'DESC'],
            },

            login_user_role: null,
            selectedBatch_id: null,
            submitedQtyEnable: false,
            availableQty: [],
            activeIndex: -1,
            selectedBatchDet: {},

            data: [],
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
                            let data = this.state.data[tableMeta.rowIndex]?.complain_date
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
                                {this.state.login_user_role === 'Drug Store Keeper' || this.state.login_user_role === 'Medical Laboratory Technologist' || this.state.login_user_role === 'Radiographer' || this.state.login_user_role === 'RMSD Pharmacist' || this.state.login_user_role === 'RMSD MSA' ?
                                    
                                    <Tooltip title="Quality Issue Complain">
                                        
                                        <IconButton
                                            //    disabled={this.state.data[dataIndex].sample_status == 'Recieved' || this.state.data[dataIndex].sample_status == 'Sample Rejected' || this.state.data[dataIndex].sample_status == 'Submitted'? true : false}
                                            disabled
                                            onClick={() => {
                                                console.log('data23'.rowIndexNew)
                                                this.setState({
                                                    qaIncidentID: id,
                                                    rowIndexNew: rowIndexNew,
                                                    qualityissueApproveDialog: true
                                                })
                                            }}
                                            // className="px-2"
                                            size="small"
                                            aria-label="View Item"
                                        >
                                            <VisibilityIcon
                                                // color={'primary'}
                                            />
                                        </IconButton>

                                    </Tooltip>

                               
                                    :
                                     
                                            <Tooltip title="Quality Issue Complain">
                                                
                                                <IconButton
                                                    //    disabled={this.state.data[dataIndex].sample_status == 'Recieved' || this.state.data[dataIndex].sample_status == 'Sample Rejected' || this.state.data[dataIndex].sample_status == 'Submitted'? true : false}
                                                    disabled={this.state.data[dataIndex].status !== 'Pending' ? true : false}
                                                    onClick={() => {
                                                        console.log('data23'.rowIndexNew)
                                                        this.setState({
                                                            qaIncidentID: id,
                                                            rowIndexNew: rowIndexNew,
                                                            qualityissueApproveDialog: true
                                                        })
                                                    }}
                                                    // className="px-2"
                                                    size="small"
                                                    aria-label="View Item"
                                                >
                                                    <VisibilityIcon
                                                        color={this.state.data[dataIndex].status !== 'Pending' ? "" : 'primary'}
                                                    />
                                                </IconButton>

                                            </Tooltip>

                                      
                            
                                }
                                 </Grid>
                                
                            )
                        },
                    },
                },
                {
                    name: 'sample_submit_status', // field name in the row object
                    label: 'Sample Submit status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,

                        customBodyRender: (value, tableMeta, updateValue) => {
                            let id = this.state.data[tableMeta.rowIndex].id

                            return (
                                <>
                                    <Grid container>
                                        {/* {this.state.login_user_role !== 'Drug Store Keeper' && */}
                                        <Grid item lg={2} className="mt-2">
                                            <Tooltip title="Submit Sample">

                                                <IconButton size="small" aria-label="review"
                                                    disabled={this.state.data[tableMeta.rowIndex].sample_status == 'Submitted' ? true : false}
                                                    onClick={() => {

                                                        this.setState({
                                                            rowIndexNew2: tableMeta.rowIndex,
                                                            qaIncidentID: id,
                                                            sampleSubmitDialog: true,
                                                            selectedBatch_id: this.state.data[tableMeta.rowIndex]?.item_batch_id
                                                        })
                                                    }} >

                                                    <VaccinesIcon color={this.state.data[tableMeta.rowIndex].sample_status == 'Submitted' ? "" : 'primary'} />
                                                </IconButton>

                                            </Tooltip>
                                            <Grid item lg={2} className="mt-2">
                                                {this.state.data[tableMeta.rowIndex].sample_status == 'Submitted' &&
                                                    <Tooltip title="Redirect">

                                                        <IconButton size="small" aria-label="review"
                                                            //    disabled={this.state.data[tableMeta.rowIndex].sample_status == 'Submitted' ? true : false}
                                                            onClick={() => {
                                                                this.redirect(id)
                                                                //   this.setState({
                                                                //    rowIndexNew2:tableMeta.rowIndex,
                                                                //     qaIncidentID:id,
                                                                //     sampleSubmitDialog: true,
                                                                //     selectedBatch_id: this.state.data[tableMeta.rowIndex]?.item_batch_id
                                                                // })
                                                            }} >

                                                            <ReplyIcon color={'primary'} />
                                                        </IconButton>

                                                    </Tooltip>
                                                }
                                            </Grid>
                                        </Grid>
                                        {/* } */}
                                        <Grid item lg={8} className="ml-3">
                                            <p>{this.state.data[tableMeta.rowIndex].sample_status}</p>
                                        </Grid>
                                    </Grid>

                                    {/* <Button
                                color="secondary"
                                // className="mr-1"
                                disabled={this.state.data[tableMeta.rowIndex].sample_status == 'Submitted' ? true : false}
                                onClick={() => {
                                  this.setState({
                                    qaIncidentID:id,
                                    sampleSubmitDialog: true,
                                            })
                             }} 
                            >
                                {this.state.data[tableMeta.rowIndex].sample_status == 'Submitted'? "Sample Submitted":"Submit Sample"}
                               
                            </Button> */}

                                </>
                            )


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
                                        <Grid className=" w-full"
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
                                        <Grid className=" w-full"
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
            ],
            // totalItems: 0,
            pending: 0,
            qaIncidentID: null,
            drugStoreData: [],
        }
    }
    async loadDrugStoreData() {
        let owner_id = await localStorageService.getItem('owner_id')
        let userInfo = await localStorageService.getItem('userInfo')
        let params = {}
        let res = await WarehouseServices.getAllWarehousewithOwner(params, owner_id)

        console.log("warehouses", res)
        if (200 == res.status) {
            this.setState({
                all_warehouse_loaded: res.data.view.data,
            })
            // console.log("warehouses", this.state.all_warehouse_loaded);
        }
    }
    async loadSendingStoreData() {
        let owner_id = await localStorageService.getItem('owner_id')
        let userInfo = await localStorageService.getItem('userInfo')
        let data = {}
        let params = {
            department_id: '8e95c758-6612-4a1e-9449-53694896d48b'
        }
        let res = await WarehouseServices.getAllWarehousewithOwner(params, null)

        console.log("warehouses", res)
        if (200 == res.status) {
            this.setState({
                all_sending_warehouse_loaded: res.data.view.data,
            })
            // console.log("warehouses", this.state.all_warehouse_loaded);
        }
    }

    // async loadWarehouses() {
    //     var user = await localStorageService.getItem('userInfo');
    //     var id = user.id;
    //     var all_pharmacy_dummy = [];

    //     let params = { employee_id: id }
    //     let res = await WarehouseServices.getWareHouseUsers(params);
    //     if (res.status == 200) {
    //         console.log("warehouseUsers", res.data.view.data)

    //         res.data.view.data.forEach(element => {
    //             all_pharmacy_dummy.push(
    //                 {
    //                     warehouse: element.Warehouse,
    //                     name: element.Warehouse.name,
    //                     main_or_personal: element.Warehouse.main_or_personal,
    //                     owner_id: element.Warehouse.owner_id,
    //                     id: element.warehouse_id,
    //                     pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
    //                 }

    //             )
    //         });
    //         console.log("warehouse", all_pharmacy_dummy)
    //         this.setState({ all_warehouse_loaded: all_pharmacy_dummy })
    //     }
    // }
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

    async redirect(id) {
        let params = {
            quality_log_id: id
        }
        let userInfo = await localStorageService.getItem('userInfo')

        let res = await QualityAssuranceService.GetQASamples(params)

        if (res.status === 200) {
            console.log('cheking res qa', res)

            let data = res.data.view.data[0]

            window.location = `/msa_all_order/all-orders/order/${data?.OrderExchange?.id}/${data?.OrderExchange?.number_of_items}/${data?.OrderExchange?.order_id}/${userInfo?.name}/${' '}/${data?.OrderExchange?.status}/${data?.OrderExchange?.type}`
        }
    }

    async loadWarehouses() {
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        // var all_pharmacy_dummy = [];
        // var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        // if (!selected_warehouse_cache) {
        //     this.setState({ dialog_for_select_warehouse: true })
        // }
        // else {
        //     this.setState({
        //         owner_id: selected_warehouse_cache.owner_id, selected_warehouse: selected_warehouse_cache.id, dialog_for_select_warehouse: false, Loaded: true,
        //         selected_warehouse_name: selected_warehouse_cache.name
        //     })
        // }
        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params);
        if (res.status == 200) {
            console.log("warehouseUsers", res.data.view.data)

            // res.data.view.data.forEach(element => {
            //     all_pharmacy_dummy.push(
            //         {
            //             warehouse: element.Warehouse,
            //             name: element.Warehouse.name,
            //             main_or_personal: element.Warehouse.main_or_personal,
            //             owner_id: element.Warehouse.owner_id,
            //             id: element.warehouse_id,
            //             pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
            //         }

            //     )
            // });
            // console.log("warehouse", all_pharmacy_dummy)
            this.setState({ keeper_warehouse_loaded: res.data.view.data })
        }
    }

    async componentDidMount() {
        let owner_id = await localStorageService.getItem('owner_id')
        const user_role = await localStorageService.getItem('userInfo').roles[0]
        this.setState({
            owner_id: owner_id,
            login_user_role : user_role
        })
        this.loadWarehouses()
        this.loadDrugStoreData()
        this.loadSendingStoreData()
        // this.loadWarehouses()
        this.LoadData()
    }
    async submitSample() {
        let id = this.state.qaIncidentID
        let userInfo = await localStorageService.getItem('userInfo')
        let sampleData = this.state.sampleData
        if (userInfo.roles.includes('Chief Pharmacist') || 
        userInfo.roles.includes('Drug Store Keeper') || 
        userInfo.roles.includes('Chief Radiographer') || 
        userInfo.roles.includes('RMSD OIC') || 
        userInfo.roles.includes('Medical Laboratory Technologist') || 
        userInfo.roles.includes('Radiographer') || 
        userInfo.roles.includes('RMSD MSA') || 
        userInfo.roles.includes('RMSD Pharmacist') ||
        userInfo.roles.includes('Chief MLT')) {
            let data = {
                sample_status: "Submitted",
                sample_location: sampleData.sample_location,
                sample_quantity: sampleData.sample_quantity,
                item_batch_bin_id: this.state.selectedBatchDet?.id,
                bin_id: this.state.selectedBatchDet?.bin_id,
                item_id: this.state.selectedBatchDet?.ItemSnapBatch?.ItemSnap?.id,
                sample_location_to: sampleData.sample_location_to,
                sample_by: userInfo?.id,
                sample_date: dateParse(new Date()),
                owner_id: sampleData.owner_id,
                sample_location_to_owner_id: sampleData.sample_location_to_owner_id
            }
            // console.log("selectedBatchDet",this.state.selectedBatchDet)
            console.log("data", data)
            console.log("userInfo", userInfo)
            let res = await QualityAssuranceService.approvalORejectionNMQL(data, id)
            console.log("res", res)
            if (res.status == 200) {
                console.log("view return", res.data.patched.res.order_exchanges.res.id)
                console.log("view return all", res)
                this.setState({
                    alert: true,
                    severity: 'success',
                    message: "Sample Submission Successful ",
                    // qualityissueApproveDialog:false,
                }
                    , () => {
                        //  window.location.reload()
                        // /msa_all_order/all-orders/order/:id/:items/:order/:empname/:empcontact/:status/:type
                        window.location = `/msa_all_order/all-orders/order/${res?.data?.patched?.res?.order_exchanges?.res?.id}/${res?.data?.patched?.res?.order_exchanges?.res?.number_of_items}/${res?.data?.patched?.res?.order_exchanges?.res?.order_id}/${userInfo?.name}/${' '}/${res?.data?.patched?.res?.order_exchanges?.res?.status}/${res?.data?.patched?.res?.order_exchanges?.res?.type}`
                    }
                )
            } else {
                this.setState({
                    alert: true,
                    severity: 'error',
                    message: "Sample Submission unsuccessful"
                })
            }

        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Sample Submission unsuccessful"
            })
        }


    }
    async approvalProcess() {
        let id = this.state.qaIncidentID
        let userInfo = await localStorageService.getItem('userInfo')

        // if ( userInfo.roles.includes('Chief Pharmacist')||userInfo.roles.includes('MSD Director') ) {
        let data = {
            institue_head_action_by: userInfo.id,
            status: "Approved by Chief Pharmacist",
            institue_head_status: 'approved',
            institue_head_remark: this.state.complaint.remark
        }
        console.log("data", data)
        let res = await QualityAssuranceService.approvalORejectionNMQL(data, id)
        console.log("res", res)
        if (res.status == 200) {
            console.log("res", res)
            this.setState({
                alert: true,
                severity: 'success',
                message: "Successfully Saved ",
                // qualityissueApproveDialog:false,
            }
                , () => {
                    window.location.reload()
                }
            )
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Cannot Save Data "
            })
        }

        // } else {
        //         this.setState({
        //             alert: true,
        //             severity: 'error',
        //             message: "Cannot Save Data "
        //         })
        //     }



    }

    async LoadData() {
        this.setState({ loading: false })
        console.log("State 1:", this.state.data)
        let filterData = this.state.filterData
        filterData.owner_id = this.state.owner_id
        // filterData.status = 'Pending'
        let res = await QualityAssuranceService.getAllQualityIncidents(filterData)
        if (res.status == 200) {
            console.log('cheking table data', res.data.view.data)
            this.setState({
                data: res.data.view.data,
                totalItems: res.data.view.totalItems,
                loading: true
            }
            )
        }
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

    async getAvailableQty(id) {

        console.log('cheking atch numer', this.state?.selectedBatch_id)
        let params = {
            warehouse_id: id,
            item_batch_id: this.state?.selectedBatch_id,
            // item_batch_id : ['3f91b83b-e665-4f71-87dc-2ea8375e55d5','afb16218-e32d-45a3-bf35-34e9f7f2b7d2','42325819-a50c-44a7-aa15-7118fdbac942'],
            item_id: this.state.data[this.state.selectedItem]?.item_id,
            // item_id: '6dfde793-9b24-43ee-b7ee-fac9514d3fd4',
            exp_date_grater_than_zero: true,
            quantity_grater_than_zero: true,
            // 'order[0]': [
            //     'createdAt', 'DESC'
            // ],
        }
        let batch_res = await DistributionCenterServices.getBatchData(params)

        if (batch_res.status === 200) {
            console.log('cheking batch qty', batch_res)

            if (batch_res.data.view.data.length > 0) {

                this.setState({
                    submitedQtyEnable: true,
                    availableQty: batch_res.data.view.data
                })

            } else {
                this.setState({
                    alert: true,
                    severity: 'error',
                    message: "No Available Qty",
                    submitedQtyEnable: false
                })
            }
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

  async loadDonors(search) {
    console.log('donor',search)
    // let employeeFilterData = this.state.employeeFilterData
    let data = {
        search: search
    }
    this.setState({ loaded: false })
    let res = await DonarService.getDonors(data)
    console.log('all pharmacist', res.data.view.data)
    if (200 == res.status) {
        this.setState({
            allDonorData: res.data.view.data,
            // loaded: true,
        })
        // if(res.name == search){
            
        // }
       
    }
}

    render() {
        const { classes } = this.props
        return (
            <MainContainer>
                <CardTitle title="Log Wise" />

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
                                            // onChange={(e) => {
                                            //     if (e.target.value.length > 3) {
                                            //         this.loadDonors(e.target.value)
                                            //     }


                                            // }
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
                            <Grid
                                className=" w-full"
                                item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Log No" />
                               
                                        <TextValidator
                                    
                                            placeholder="Enter Log No here"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .filterData
                                                    .log_no
                                            }
                                            onChange={(e) => {
                                                let filterData = this.state.filterData
                                                filterData.log_no = e.target.value
                                                this.setState({
                                                    filterData,
                                                })


                                            }
                                            }
                                        // validators={[
                                        //     'required',
                                        // ]}
                                        // errorMessages={[
                                        //     'this field is required',
                                        // ]}
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
                </ValidatorForm>
                {/* sample Submit Dialog box */}
                <Dialog
                    maxWidth={'md'}
                    fullWidth={true}
                    open={this.state.sampleSubmitDialog}
                    onClose={() => {
                        this.setState({
                            sampleSubmitDialog: false,
                            availableQty: []
                        })
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <ValidatorForm
                        className="pt-2"
                        ref={'outer-form'}
                        onSubmit={() => this.submitSample()}
                        onError={() => null}>
                        <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                            <CardTitle title="Do you want to Submit Sample?" />
                            <IconButton aria-label="close" className={classes.closeButton}
                                onClick={() => {
                                    this.setState({
                                        sampleSubmitDialog: false,
                                        availableQty: []
                                    })
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </MuiDialogTitle>

                        {this.state.login_user_role == 'Drug Store Keeper' || this.state.login_user_role === 'Medical Laboratory Technologist' || this.state.login_user_role === 'Radiographer' || this.state.login_user_role === 'RMSD Pharmacist' || this.state.login_user_role === 'RMSD MSA' ?
                            <DialogContent>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Select My Warehouse" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.keeper_warehouse_loaded}
                                        onChange={(e, value) => {
                                            console.log('ownwer id chekinignig', value)
                                            if (value != null) {
                                                let sampleData = this.state.sampleData
                                                sampleData.sample_location = value.warehouse_id
                                                sampleData.owner_id = value?.Warehouse?.owner_id
                                                this.setState({ sampleData }, () => {
                                                    this.getAvailableQty(value.warehouse_id)
                                                })
                                            }
                                            else if (value == null) {
                                                let sampleData = this.state.sampleData
                                                sampleData.sample_location = null
                                                this.setState({ sampleData })
                                            }
                                        }}
                                        // value={
                                        //   this.state.sampleData.sample_location
                                        // }
                                        getOptionLabel={(option) => option?.Warehouse?.name != null ? option?.Warehouse?.name : null}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Select Your Warehouse"
                                                value={this.state.sampleData.sample_location}
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                validators={[
                                                    'required',
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            />
                                        )}
                                    />
                                </Grid>
                            </DialogContent>
                        :
                            <DialogContent>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Select My Warehouse" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.all_warehouse_loaded}
                                        onChange={(e, value) => {
                                            console.log('ownwer id chekinignig', value)
                                            if (value != null) {
                                                let sampleData = this.state.sampleData
                                                sampleData.sample_location = value.id
                                                sampleData.owner_id = value.owner_id
                                                this.setState({ sampleData }, () => {
                                                    this.getAvailableQty(value.id)
                                                })
                                            }
                                            else if (value == null) {
                                                let sampleData = this.state.sampleData
                                                sampleData.sample_location = null
                                                this.setState({ sampleData })
                                            }
                                        }}
                                        // value={
                                        //   this.state.sampleData.sample_location
                                        // }
                                        getOptionLabel={(option) => option.name != null ? option.name : null}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Select Your Warehouse"
                                                value={this.state.sampleData.sample_location}
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                validators={[
                                                    'required',
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            />
                                        )}
                                    />
                                </Grid>
                            </DialogContent>
                        }

                        {this.state.availableQty.length === 0 ? (

                            <DialogContent>
                                <Grid className="w-full" item lg={12} md={12} sm={12} xs={12}>
                                    <SubTitle title="Submitted Quantity" />
                                    <TextValidator
                                        className="w-full"
                                        disabled
                                        name="fbs"
                                        placeholder="Quantity"
                                        InputLabelProps={{ shrink: false }}
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                    //   onChange={(e) => {
                                    //     let sampleData = this.state.sampleData;
                                    //     this.setState({ sampleData });
                                    //   }}
                                    />
                                </Grid>
                            </DialogContent>

                        ) : (
                            this.state.availableQty.map((item, index) => (
                                <DialogContent key={index}>
                                    {this.state.submitedQtyEnable && (
                                        <p style={{ color: 'blue', fontSize: '12px', textAlign: 'right' }} className="p-0 m-0">
                                            Available qty: {roundDecimal(item?.quantity, 2)}
                                        </p>
                                    )}
                                    <Grid className="w-full" item lg={12} md={12} sm={12} xs={12}>
                                        <SubTitle title="Submitted Quantity" />
                                        <TextValidator
                                            className="w-full"
                                            disabled={this.state.activeIndex !== -1 && this.state.activeIndex !== index}
                                            name="fbs"
                                            placeholder="Quantity"
                                            InputLabelProps={{ shrink: false }}
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            // value={this.state.sampleData.sample_quantity}

                                            onChange={(e) => {
                                                if (e.target.value.length > 0 && this.state.activeIndex !== index) {
                                                    this.setState({ activeIndex: index });
                                                }
                                                let sampleData = this.state.sampleData;
                                                console.log('checking allocated qty', item?.quantity, e.target.value.length, index);
                                                if (Number(e.target.value) <= Number(item?.quantity)) {
                                                    sampleData.sample_quantity = e.target.value;
                                                } else {
                                                    // error msg
                                                    this.setState({
                                                        alert: true,
                                                        severity: 'error',
                                                        message: "Cannot Allocate More than Available Qty",
                                                    });
                                                }
                                                this.setState({ sampleData, activeIndex: index, selectedBatchDet: item });

                                            }}
                                        // validators={[
                                        //     'required',
                                        // ]}
                                        // errorMessages={[
                                        //     'this field is required',
                                        // ]}
                                        />
                                    </Grid>
                                </DialogContent>
                            ))
                        )}




                        {/* <DialogContent>
                                        {this.state.submitedQtyEnable &&
                                        <p style={{color: 'blue', fontSize:'12px', textAlign:"right"}} className="p-0 m-0">Avaliable qty : {roundDecimal(this.state.availableQty[0]?.quantity, 2)}</p>
                                         }
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                                <SubTitle title="Submitted Quantity" />
                                                <TextValidator
                                        className="w-full"
                                        disabled={!this.state.submitedQtyEnable}
                                        name="fbs"
                                        placeholder="Quantity"
                                        InputLabelProps={{ shrink: false }}
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let sampleData = this.state.sampleData
                                            sampleData.sample_quantity = e.target.value
                                            this.setState({sampleData})
                                        }}
                                        // value={this.state.formData.examination_data[0].other_answers.fbs}
                                        validators={['maxNumber:500']}
                                        errorMessages={[
                                            'Invalid Count'
                                        ]}
                                    />

                                            </Grid>
                                        </DialogContent> */}

                        <DialogContent>
                            <Grid
                                className=" w-full"
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Sending Warehouse    " />
                                <Autocomplete
                                    disableClearable
                                    className="w-full"
                                    options={this.state.all_sending_warehouse_loaded}
                                    onChange={(e, value) => {
                                        if (value != null) {
                                            let sampleData = this.state.sampleData
                                            sampleData.sample_location_to = value.id
                                            sampleData.sample_location_to_owner_id = value.owner_id
                                            this.setState({ sampleData })
                                        }
                                        else if (value == null) {
                                            let sampleData = this.state.sampleData
                                            sampleData.sample_location_to = null
                                            this.setState({ sampleData })
                                        }
                                    }}
                                    // value={
                                    //   this.state.sampleData.sample_location
                                    // }
                                    getOptionLabel={(option) => option.name != null ? option.name : null}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Sending Warehouse"
                                            value={this.state.sampleData.sample_location_to}
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            validators={[
                                                'required',
                                            ]}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    )}
                                />
                            </Grid>
                        </DialogContent>

                        <DialogActions>
                            <Grid container spacing={2}>

                                <Grid item>
                                    {/* <HospitalIssueNote  data={this.state.data[this.state.rowIndexNew2]} quantity={this.state.sampleData.sample_quantity} id={this.state.qaIncidentID} sampleData={this.state.sampleData}/> */}
                                    {/* <LoonsButton
                                            // className="mt-2"
                                            progress={false}
                                            type="submit"
                                            //startIcon="save"
                                            onClick={() => {
                                                // if (this.state.logined_user_roles.includes("RMSD MSA")) {
                                                    // document.getElementById('print_Rmsd_004').click()
                                                // } else if (this.state.logined_user_roles.includes("MSD MSA")) {
                                                    document.getElementById('print_msd_004').click()
                                                // } else {

                                                    // document.getElementById('print_presc_004').click()
                                                // }
                                            }
                                        }
                                        >
                                            <span className="capitalize">
                                                Print Issue Note
                                            </span>
                                        </LoonsButton> */}
                                </Grid>


                            </Grid>
                            <Button
                                className="mt-2"
                                progress={false}
                                type="submit"
                                scrollToTop={true}
                                onClick={() => {
                                    // this.createNewEmployee()
                                }}
                            >
                                <span className="capitalize">
                                    Submit
                                </span>
                            </Button>
                            <Button
                                className="mt-2"
                                progress={false}
                                // type="submit"
                                scrollToTop={true}
                                onClick={() => {
                                    this.setState({
                                        sampleSubmitDialog: false,
                                    })
                                }}
                            >
                                <span className="capitalize">
                                    Close
                                </span>
                            </Button>
                        </DialogActions>

                    </ValidatorForm>
                </Dialog>
                {/* quality issue approve complaint   */}


                <Dialog
                    maxWidth={'md'}
                    fullWidth={true}
                    open={this.state.qualityissueApproveDialog}
                    onClose={() => {
                        this.setState({
                            qualityissueApproveDialog: false,
                        })
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <ValidatorForm
                        className="pt-2"
                        ref={'outer-form'}
                        onSubmit={() => null}
                        onError={() => null}>
                        <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                            <CardTitle title="Submit Complaint" />
                            <IconButton aria-label="close" className={classes.closeButton}
                                onClick={() => {
                                    this.setState({
                                        qualityissueApproveDialog: false

                                    })
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </MuiDialogTitle>
                        <DialogContent>
                            <Grid
                                className=" w-full"
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Remark" />
                                <TextValidator
                                    className="w-full"
                                    // name="fbs"
                                    // rows={3}
                                    placeholder="Add Remarks"
                                    // InputLabelProps={{ shrink: false }}
                                    // type="number"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {
                                        let complaint = this.state.complaint;
                                        complaint.remark = e.target.value
                                        this.setState({ complaint })
                                    }}
                                    value={this.state.complaint.remark}
                                // validators={['maxNumber:500']}
                                // errorMessages={[
                                //     'Invalid Count'
                                // ]}
                                />

                            </Grid>
                        </DialogContent>
                        {/* <DialogContent>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Select Warehouse" />
                                                <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_warehouse_loaded}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        this.setState({ selected_warehouse: value.id })
                                    }
                                }}
                                value={
                                  this.state.selected_warehouse
                                }
                                getOptionLabel={(option) => option.name != null ? option.name : null}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Warehouse"
                                        value={this.state.selected_warehouse}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        validators={[
                                            'required',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                )}
                            />
                                            </Grid>
                                        </DialogContent> */}
                        <DialogActions>
                            <Button
                                className="mt-2"
                                progress={false}
                                type="submit"
                                scrollToTop={true}
                                onClick={() => {
                                    // this.createNewEmployee()
                                }}
                            >
                                <span className="capitalize">
                                    Approve Complaint
                                </span>
                            </Button>
                            <Button
                                className="mt-2"
                                progress={false}
                                // type="submit"
                                scrollToTop={true}
                                color='secondary'
                                onClick={() => {
                                    this.setState({
                                        qualityissueApproveDialog: false,
                                    })
                                }}
                            >
                                <span className="capitalize">
                                    Reject Complaint
                                </span>
                            </Button>
                        </DialogActions>

                    </ValidatorForm>
                </Dialog>
                {/* quality issue approve complaint                                 */}
                <Dialog
                    maxWidth={'md'}
                    fullWidth={true}
                    open={this.state.qualityissueApproveDialog}
                    onClose={() => {
                        this.setState({
                            qualityissueApproveDialog: false,
                        })
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <ValidatorForm
                        className="pt-2"
                        ref={'outer-form'}
                        onSubmit={() => this.approvalProcess()}
                        onError={() => null}>
                        <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                            <CardTitle title="Log report" />
                            <IconButton aria-label="close" className={classes.closeButton}
                                onClick={() => {
                                    this.setState({
                                        qualityissueApproveDialog: false

                                    })
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </MuiDialogTitle>
                        <DialogContent>
                            <Grid
                                className=" w-full"
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Remark" />
                                <TextValidator
                                    className="w-full"
                                    name="fbs"
                                    rows={3}
                                    placeholder="Add Remark"
                                    InputLabelProps={{ shrink: false }}
                                    // type="number"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {
                                        let complaint = this.state.complaint;
                                        complaint.remark = e.target.value
                                        this.setState({ complaint })
                                    }}
                                // value={this.state.formData.examination_data[0].other_answers.fbs}
                                // validators={['maxNumber:500']}
                                // errorMessages={[
                                //     'Invalid Count'
                                // ]}
                                />
                                {this.state.loading ?
                                    <MSDPrintLab data={this.state.data[this.state.rowIndexNew]} />
                                    : null}

                                {/* <HospitalDirecter/> */}

                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                className="mt-2"
                                progress={false}
                                // type="submit"
                                disbled={true}
                                scrollToTop={true}
                                color='secondary'
                                onClick={() => {
                                    this.setState({
                                        qualityissueApproveDialog: false,
                                    })
                                }}
                            >
                                <span className="capitalize">
                                    Reject Complaint
                                </span>
                            </Button>
                            <Button
                                className="mt-2"
                                progress={false}
                                type="submit"
                                scrollToTop={true}
                                onClick={() => {
                                    // this.createNewEmployee()
                                }}
                            >
                                <span className="capitalize">
                                    Approve Complaint
                                </span>
                            </Button>

                        </DialogActions>

                    </ValidatorForm>
                </Dialog>


                {/* {this.state.logined_user_roles.includes("MSD MSA") ? */}
                {/* <MSD_Print
                        letterTitle="Issue Note"
                        refferenceSection={false}
                        order_exchange_id={this.state.qaIncidentID}
                        //patientInfo={patientInfo}
                        //clinic={clinic}
                        //drugList={checkAvailability(drugList)}
                        date={moment(new Date()).format('yyyy/MM/DD')}
                        address={""}
                        title={"Issue Note"}
                        //letterBody={this.state.letterBody}
                        signature={""}
                    /> */}
                {/* : null */}
                {/* } */}

            </MainContainer >
        )
    }
}

export default withStyles(styleSheet)(QALogwise)
