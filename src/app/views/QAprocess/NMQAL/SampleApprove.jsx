import React, { Component, Fragment } from "react";
import MainContainer from "../../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../../components/LoonsLabComponents/CardTitle";
import LoonsCard from "../../../components/LoonsLabComponents/LoonsCard";
import {
    CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Tooltip, Typography, Dialog,
    DialogActions,
    DialogContent, Checkbox, FormControlLabel,
} from "@material-ui/core";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Button, DatePicker, LoonsTable, LoonsSnackbar } from "app/components/LoonsLabComponents";
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
import { dateParse } from "utils";
import * as appConst from '../../../../appconst'
import { withStyles } from '@material-ui/core/styles'
import QualityAssuranceService from 'app/services/QualityAssuranceService'
import MSDPrintLab from '../Prints/MSDPrintLab';
import Hidden from '@mui/material/Hidden';
import ClinicService from "app/services/ClinicService";
import ApartmentIcon from '@material-ui/icons/Apartment'; 

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

class SampleApprove extends Component {
    constructor(props) {
        super(props)
        this.state = {

            //snackbar
            alert: false,
            message: '',
            severity: 'success',

            dialog_for_select_warehouse : false,
            all_current_warehouse_loaded : [],
            

            classes: styleSheet,
            loading: true,
            sr_no: [],
            totalItems: 0,
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
                batch_no: null,
                item_name: null,
                recieved_qty: null,
                sample_quantity: 0,
                sample_location: null,
                same_manufacturer: true,
            },
            all_warehouse_loaded: null,
            sampleSubmitDialog: false,
            qualityissueApproveDialog: false,
            empData: [],
            allDonorData: [],
            donarName: [],
            hospitalData:[],
            userRole:null,
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
            pharmacy_list:[],

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
                            // console.log('cheking table data',this.state.data[tableMeta.rowIndex])
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
                // {
                //     name: 'action',
                //     label: 'Action',
                //     options: {
                //         customBodyRenderLite: (dataIndex) => {
                //             let id = this.state.data[dataIndex].id
                //             // let donar_id = this.state.data[dataIndex]?.Donor?.id
                //             // [dataIndex]?.Donor?.id
                //             return (
                //                 <Grid className="flex items-center">
                //                     <Tooltip title="Quality Issue Complain">
                //                     <IconButton
                //                         onClick={() => {
                //                            this.setState({
                //                             qaIncidentID:id,
                //                             qualityissueApproveDialog:true
                //                            })
                //                         }}
                //                         // className="px-2"
                //                         size="small"
                //                         aria-label="View Item"
                //                     >
                //                         <VisibilityIcon color='primary' />
                //                     </IconButton>

                //                     </Tooltip>

                //                 </Grid>
                //             )
                //         },
                //     },
                // },
                {
                    name: 'sample_receive_status', // field name in the row object
                    label: 'Sample receive status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,

                        customBodyRender: (value, tableMeta, updateValue) => {
                            let id = this.state.data[tableMeta.rowIndex].id
                            return (
                                <Grid container>
                                    <Grid item lg={1}>
                                        <Tooltip title="Recieved Sample">

                                            <IconButton size="small" aria-label="review"
                                                disabled={this.state.data[tableMeta.rowIndex].sample_status == 'Recieved' || this.state.data[tableMeta.rowIndex].sample_status == 'Sample Rejected' ? true : false}
                                                onClick={() => {
                                                    let sampleData = this.state.sampleData
                                                    sampleData.batch_no = this.state.data[tableMeta.rowIndex].ItemSnapBatch?.batch_no
                                                    sampleData.item_name = this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.medium_description + `(${this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.sr_no})`
                                                    sampleData.sample_quantity = this.state.data[tableMeta.rowIndex]?.sample_quantity
                                                    sampleData.recieved_qty = this.state.data[tableMeta.rowIndex]?.sample_quantity
                                                    //   sampleData.sample_location = this.state.data[tableMeta.rowIndex]?.SampleLocation?.name
                                                    this.setState({
                                                        sampleData,
                                                        qaIncidentID: id,
                                                        sampleSubmitDialog: true,
                                                    })
                                                }} >

                                                <VaccinesIcon color={this.state.data[tableMeta.rowIndex].sample_status == 'Recieved' || this.state.data[tableMeta.rowIndex].sample_status == 'Sample Rejected' ? "" : 'primary'} />
                                            </IconButton>

                                        </Tooltip>

                                    </Grid>
                                    <Grid item lg={8} className="mt-1 ml-5">
                                        <Typography>{this.state.data[tableMeta.rowIndex].sample_status}</Typography>
                                    </Grid>

                                </Grid>
                            )


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
            console.log("warehouses", this.state.all_warehouse_loaded);
        }
    }

    async loadWarehouses() {
        this.setState({ Loaded: false })
        var user = await localStorageService.getItem('userInfo');


        console.log('All orders', this.props.type)
        let type
        if (this.props.type) {
            type = this.props.type
        } else {
            const query = new URLSearchParams(this.props.location.search);
            type = query.get('type')
        }

        var id = user.id;
        var all_pharmacy_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        if (!selected_warehouse_cache) {
            this.setState({ dialog_for_select_warehouse: true })
        }
        else {

            this.setState({
                owner_id: selected_warehouse_cache.owner_id,
                selected_warehouse: selected_warehouse_cache.id,
                selected_warehouse_name: selected_warehouse_cache.name,
                dialog_for_select_warehouse: false,
                warehouseSelectDone: true,
                Loaded: true
            })


            console.log(this.state.selected_warehouse)
        }
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
            this.setState({ all_current_warehouse_loaded: all_pharmacy_dummy, })
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

    async componentDidMount() {
        let owner_id = await localStorageService.getItem('owner_id')
        let userInfo = await localStorageService.getItem('userInfo')
        this.setState({
            owner_id: owner_id,
            userRole: userInfo.roles[0]
        })
        this.loadDrugStoreData()
        // this.loadWarehouses()
        this.LoadData()

        if (userInfo.roles[0] == 'NMQAL Pharmacist'){
            this.loadWarehouses()
        }
        
    }
    async rejectSample() {
        let id = this.state.qaIncidentID
        let userInfo = await localStorageService.getItem('userInfo')
        let sampleData = this.state.sampleData
        // if ( userInfo.roles.includes('Chief Pharmacist') ) {
        let data = {
            sample_status: "Sample Rejected",
            same_manufacturer: sampleData.same_manufacturer,
            recieved_qty: sampleData.recieved_qty,
            manufacturer_remarks: sampleData.manufacturer_remarks,

        }
        console.log("data", data)
        let res = await QualityAssuranceService.approvalORejectionNMQL(data, id)
        console.log("res", res)
        if (res.status == 200) {
            console.log("res", res)
            this.setState({
                alert: true,
                severity: 'success',
                message: "Sample Rejected Successful ",
                // qualityissueApproveDialog:false,
            }
                , () => {
                    this.redirectSubmitSample()
                }
            )
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Sample Rejected unsuccessful"
            })
        }

        // } else {
        //     this.setState({
        //         alert: true,
        //         severity: 'error',
        //         message: "Sample Submission unsuccessful"
        //     })
        //     }
    }


    async submitSample(){
        let id = this.state.qaIncidentID
        let userInfo = await localStorageService.getItem('userInfo')
        let sampleData = this.state.sampleData
        if ( userInfo.roles.includes('Chief Pharmacist') || userInfo.roles.includes('NMQAL Pharmacist') ) {
            let data = {
                sample_status:"Recieved",
                same_manufacturer:sampleData.same_manufacturer,
                recieved_qty:sampleData.recieved_qty,
                manufacturer_remarks:sampleData.manufacturer_remarks,
              
            }
            console.log("data",data)
            let res = await QualityAssuranceService.approvalORejectionNMQL(data,id)
            console.log("res", res)
            if (res.status == 200) {
                console.log("res", res)
                this.setState({
                    alert:true,
                    severity: 'success',
                    message: "Sample Accepted Successful ",
                    // qualityissueApproveDialog:false,
                }
                , () => {
                    this.redirectSubmitSample()
                }
            )
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Sample Accepting unsuccessful"
            })
        }

        // } else {
        //     this.setState({
        //         alert: true,
        //         severity: 'error',
        //         message: "Sample Submission unsuccessful"
        //     })
        //     }

    }
    }

    async redirectSubmitSample(){

        let params = {
            quality_log_id : this.state.qaIncidentID
        }

        let res = await QualityAssuranceService.GetQASamples(params)

        if (res.status === 200){
            console.log('check res in retrn', res)
            let order_exchange_id = res.data.view.data.map((e)=>e?.OrderExchange?.id)
            // window.location = `/hospital-ordering/all-items/${order_exchange_id}?pickUpPersonID=${pickUpPersonID}`;
            window.location = `/hospital-ordering/all-items/${order_exchange_id}`;
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

    async LoadData() {
        this.setState({ loading: false })
        console.log("State 1:", this.state.data)
        let filterData = this.state.filterData
        // filterData.owner_id = this.state.owner_id
        filterData.sample_status = ["Submitted", 'Recieved', 'Sample Rejected', "Not Analysed", "Satisfied", 'Unsatisfied']
        let res = await QualityAssuranceService.getAllQualityIncidents(filterData)
        if (res.status == 200) {
            console.log('res', res)
            this.setState({
                data: res.data.view.data,
                totalItems: res.data.view.totalItems,
                // loading: true
            },()=>{
                this.loadHospitals(res.data.view.data)
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6" className="font-semibold">Sample Approve</Typography>

                            {this.state.userRole == 'NMQAL Pharmacist' ?
                            <div className='flex'>
                                <Grid
                                    className='pt-3 pr-3'
                                >
                                    <Typography>{this.state.selected_warehouse_name !== null ? "You're in " + this.state.selected_warehouse_name : null}</Typography>
                                </Grid>
                                <Button
                                    color='primary'
                                    onClick={() => {
                                        this.setState({ dialog_for_select_warehouse: true, Loaded: false })
                                    }}>
                                    <ApartmentIcon />
                                    {/* {loaded ? selectedWarehouse.name : 'Chanage Warehouse'} */}Change Warehouse
                                </Button>
                            </div>
                            : null}

                        </div>
                        <Divider className='mb-3 mt-3' />

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

                            <CardTitle title="Recieved Sample" />
                            <IconButton aria-label="close" className={classes.closeButton}
                                onClick={() => {
                                    this.setState({
                                        sampleSubmitDialog: false

                                                    })
                                                }}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </MuiDialogTitle>
                                        <DialogContent>
                                            <Grid container>
                                                <Grid item lg={6}>
                                                <Typography>Batch No:-{this.state.sampleData?.batch_no}</Typography>
                                                </Grid>
                                                <Grid item lg={6}>
                                                <Typography>Item Name:-{this.state.sampleData?.item_name}</Typography>
                                                </Grid>
                                                <Grid item lg={6}>
                                                <Typography>Recieved Quantity:-{this.state.sampleData?.sample_quantity}</Typography>
                                                </Grid>
                                                <Grid item lg={6}>
                                                <Typography>Manufactuer:-{this.state.sampleData?.Manufactuer?.name}</Typography>
                                                </Grid>
                                            </Grid>
                                      
                                            <Grid
                                                className="mt-2 w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Recieved Quantity" />
                                                <TextValidator
                                        className="w-full"
                                        disabled
                                        name="fbs"
                                        placeholder="Quantity"
                                        InputLabelProps={{ shrink: false }}
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let sampleData = this.state.sampleData
                                            sampleData.recieved_qty = e.target.value
                                            this.setState({sampleData})
                                        }}
                                       value={this.state.sampleData.recieved_qty}
                                        // validators={['maxNumber:500']}
                                        // errorMessages={[
                                        //     'Invalid Count'
                                        // ]}
                                    />
                                   <Grid
                                                className="mt-2 w-full"
                                                container spacing={2}
                                               
                                            >
                                                  <Grid item className="mt-2">
                                                 <Typography>Same Manufactuer</Typography>
                                                  </Grid>
                                                
                                             
                                        <Grid item>
                                        <FormControlLabel
                                            label="True"
                                            name=""
                                            value={false}
                                            onChange={() => {
                                                let sampleData = this.state.sampleData
                                                sampleData.same_manufacturer = true
                                                this.setState({ sampleData })
                                            }}
                                            //defaultValue = 'normal'
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    checked={this.state.sampleData.same_manufacturer == true ? true : false}
                                                    size="small"
                                                />
                                            }
                                            display="inline"
                                        />

                                    </Grid>
                                    <Grid item>
                                        <FormControlLabel
                                            label="False"
                                            name=""
                                            value={false}
                                            onChange={() => {
                                                let sampleData = this.state.sampleData
                                                sampleData.same_manufacturer = false
                                                this.setState({ sampleData })
                                            }}
                                            //defaultValue = 'normal'
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    checked={this.state.sampleData.same_manufacturer == false ? true : false}
                                                    size="small"

                                                />
                                            }
                                            display="inline"
                                        />
                                    </Grid>

                                    <Hidden xsUp={this.state.sampleData.same_manufacturer !== false ? true : false}>
                                        <Grid

                                            className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Correct Manufactuer" />
                                            <TextValidator
                                                className="w-full"
                                                // name="fbs"
                                                // rows={3}
                                                placeholder="Add Manufactuer Name"
                                                // InputLabelProps={{ shrink: false }}
                                                // type="number"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    let sampleData = this.state.sampleData;
                                                    sampleData.manufacturer_remarks = e.target.value
                                                    this.setState({ sampleData })
                                                }}
                                                value={this.state.sampleData.manufacturer_remarks}
                                            // validators={['maxNumber:500']}
                                            // errorMessages={[
                                            //     'Invalid Count'
                                            // ]}
                                            />

                                        </Grid>
                                    </Hidden>

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
                                                let sampleData = this.state.sampleData;
                                                sampleData.manufacturer_remarks = e.target.value
                                                this.setState({ sampleData })
                                            }}
                                            value={this.state.sampleData.manufacturer_remarks}
                                        // validators={['maxNumber:500']}
                                        // errorMessages={[
                                        //     'Invalid Count'
                                        // ]}
                                        />

                                    </Grid>



                                </Grid>

                                <DialogContent>
                                </DialogContent>

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
                                className="w-full"
                                options={this.state.all_warehouse_loaded}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        let sampleData = this.state.sampleData
                                        sampleData.sample_location = value.id
                                        this.setState({sampleData})
                                    }
                                    else if(value== null) {
                                        let sampleData = this.state.sampleData
                                        sampleData.sample_location = null
                                        this.setState({sampleData})
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
                                        </DialogContent> */}
                        <DialogActions>
                            <Button
                                className="mt-2"
                                progress={false}
                                // type="submit"
                                scrollToTop={true}
                                color='secondary'
                                onClick={() => {
                                    this.rejectSample()
                                    this.setState({
                                        sampleSubmitDialog: false,
                                    })
                                }}
                            >
                                <span className="capitalize">
                                    Reject Sample
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
                                    Accept Sample
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
                                <MSDPrintLab />
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

                <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_warehouse} >

            {/* <MuiDialogTitle disableTypography>
                <CardTitle title="Select Your Warehouse" />
            </MuiDialogTitle> */}
            <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                <CardTitle title="Select Your Warehouse" />

                <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ dialog_for_select_warehouse: false }) }}>
                    <CloseIcon />
                </IconButton>

            </MuiDialogTitle>



            <div className="w-full h-full px-5 py-5">
                <ValidatorForm
                    onError={() => null}
                    className="w-full"
                >
                    <Autocomplete
                        disableClearable
                        className="w-full"
                        options={this.state.all_current_warehouse_loaded.sort((a, b) => (a.name.localeCompare(b.name)))}
                        onChange={(e, value) => {
                            if (value != null) {
                                this.state.owner_id = value.owner_id
                                localStorageService.setItem('Selected_Warehouse', value);
                                this.setState({
                                    owner_id: value.owner_id, selected_warehouse: value.id, dialog_for_select_warehouse: false,
                                    selected_warehouse_name: value.name
                                })

                                // this.loadData()
                            }
                        }}
                        // value={{
                        //     name: this.state.selected_warehouse ? (this.state.all_current_warehouse_loaded.filter((obj) => obj.id == this.state.selected_warehouse).name) : '',
                        //     id: this.state.selected_warehouse
                        // }}
                        getOptionLabel={(option) => option.name != null ? option.name + " - " + option.main_or_personal : null}
                        renderInput={(params) => (
                            <TextValidator
                                {...params}
                                placeholder="Select Your Warehouse"
                                fullWidth
                                variant="outlined"
                                size="small"
                            />
                        )}
                    />

                </ValidatorForm>
            </div>
            </Dialog>


            </MainContainer >
        )
    }
}

export default withStyles(styleSheet)(SampleApprove)
