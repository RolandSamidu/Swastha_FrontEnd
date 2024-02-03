import { AppBar, Card, Grid, IconButton, Tab, Tabs, TextField, Tooltip, Typography } from "@material-ui/core"
import moment from "moment"
import React,{ Component, Fragment } from "react"
import {
    LoonsTable,
    Button,
    SubTitle,
    DatePicker,
    LoonsSnackbar
} from 'app/components/LoonsLabComponents'
import DeleteIcon from '@material-ui/icons/Delete';
import { Autocomplete } from "@material-ui/lab";
import { NPDrugApprovalStatus2 } from "../../../appconst";
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import PrescriptionService from "app/services/PrescriptionService";
import localStorageService from "app/services/localStorageService";
import InventoryService from "app/services/InventoryService";
import DashboardServices from "app/services/DashboardServices";

class NPDrugPlacedOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert : false,
            severity : 'success',
            message : '',

            item : null,
            institute : null,
            request_id : null,
            all_hospitals:[],
            formData2: {},

            sr_no: [],
            formData: {},

            data : [],
            data2 : [],
            columns : [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        filter : false,
                        customBodyRenderLite: (dataIndex) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full flex">
                                        <Button
                                            startIcon = {<PlaylistAddCheckIcon/>}
                                            // variant=""
                                            onClick={()=>{
                                                this.handleApproval(dataIndex)
                                            }}
                                        >
                                            Place Order
                                        </Button>
                                    </Grid>
                                )
                        }
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
                                        {(value != null) ? value.name:null}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'request_id',
                    label: 'Request ID',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                        {(value != null) ? value.name:"-"}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'bht',
                    label: 'BHT/Clinic No',
                    options: {
                        filter : false,
                        customBodyRenderLite: (dataIndex) => {
                            let val = null
                            this.state.clinics.map((x)=>{
                                if(x.clinic_id == this.state.data[dataIndex].clinic_id){
                                    val = x.bht
                                }
                                
                            })
                            return (
                                <Grid
                                    className="flex justify-center"
                                >
                                    {(val != null) ? val : "-" }
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'SR',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                        {(value != null) ? value.sr_no:"-"}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'Description/Brand',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                        {(value != null) ? value.short_description:null}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'approved_quantity',
                    label: 'Qty Purchasing',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                        {(value != null) ? value:null}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'Unit Price',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                        {(value != null) ? value.standard_cost:"-"}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'Value (Rs)',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            {console.log('TABLEMETA',tableMeta)}
                                return(
                                    <Grid className="w-full">
                                        {(value != null) ?  
                                            (value.standard_cost != null&& this.state.data[tableMeta.rowIndex]?.approved_quantity != null ) ? parseInt(value.standard_cost)*parseInt(this.state.data[tableMeta.rowIndex].approved_quantity):null
                                        : null}
                                    </Grid>
                                )
                        }
                    }
                },
            ],
            columns2 : [
                // {
                //     name: 'Action',
                //     label: 'Action',
                //     options: {
                //         filter : false,
                //         customBodyRenderLite: (dataIndex) => {
                //             // {console.log(value)}
                //                 return(
                //                     <Grid className="w-full flex">
                //                         <Button
                //                             startIcon = {<PlaylistAddCheckIcon/>}
                //                             // variant=""
                //                             onClick={()=>{
                //                                 this.handleApproval(dataIndex)
                //                             }}
                //                         >
                //                             Place Order
                //                         </Button>
                //                     </Grid>
                //                 )
                //         }
                //     }
                // },
                {
                    name: 'Institute',
                    label: 'Institute',
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
                    name: 'request_id',
                    label: 'Request ID',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                        {(value != null) ? value.name:"-"}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'bht',
                    label: 'BHT/Clinic No',
                    options: {
                        filter : false,
                        customBodyRenderLite: (dataIndex) => {
                            let val = null
                            this.state.clinics.map((x)=>{
                                if(x.clinic_id == this.state.data[dataIndex].clinic_id){
                                    val = x.bht
                                }
                                
                            })
                            return (
                                <Grid
                                    className="flex justify-center"
                                >
                                    {(val != null) ? val : "-" }
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'SR',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                        {(value != null) ? value.sr_no:"-"}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'Description/Brand',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                        {(value != null) ? value.short_description:null}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'approved_quantity',
                    label: 'Qty Purchasing',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                        {(value != null) ? value:null}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'Unit Price',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                        {(value != null) ? value.standard_cost:"-"}
                                    </Grid>
                                )
                        }
                    }
                },
                // {
                //     name: 'ItemSnap',
                //     label: 'Value (Rs)',
                //     options: {
                //         filter : false,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             {console.log('TABLEMETA',tableMeta)}
                //                 return(
                //                     <Grid className="w-full">
                //                         {(value.standard_cost != null&& this.state.data[tableMeta.rowIndex].approved_quantity != null ) ? parseInt(value.standard_cost)*parseInt(this.state.data[tableMeta.rowIndex].approved_quantity):null}
                //                     </Grid>
                //                 )
                //         }
                //     }
                // },
            ],
            loaded : true,

            selectedRows: [],

            sr : null,
            description : null,
            instituteCode : null,
            requestId: null,
            clinics:[],

            activeTab: 0
        }
    }

    getData = async () => {
        let user = localStorageService.getItem("userInfo")
        // let hospitalID =  localStorageService.getItem("main_hospital_id") != undefined ? localStorageService.getItem("main_hospital_id") : ''
        
        let params = {
            status : ["Secretary Approve"],
            owner_id : this.state.formData2.hospital_id,
            item_id : this.state.formData.item_id,
            request_id : this.state.request_id
            // hospital_id : "02086072-f418-4da2-bb4a-51a66ba76d00",
            // requested_by : user.id
        }
        let res =  await PrescriptionService.fetchNPRrequests(params)
        console.log("RES1",res)
        this.setState({data: res.data.view.data, loaded: true})
        console.log("params",params)
    }

    getData2 = async () => {
        let user = localStorageService.getItem("userInfo")
        let hospitalID =  localStorageService.getItem("main_hospital_id") != undefined ? localStorageService.getItem("main_hospital_id") : ''
        
        let params = {
            status : ["Order Approval Pending"],
            hospital_id : hospitalID,
            // hospital_id : "02086072-f418-4da2-bb4a-51a66ba76d00",
            // requested_by : user.id
        }
        let res =  await PrescriptionService.fetchNPRrequests(params)
        console.log("RES2",res)
        this.setState({data2: res.data.view.data, loaded: true})
        console.log("params",params)
    }

    handleApproval = async(index) => {
        let user = localStorageService.getItem("userInfo")
        let res = await PrescriptionService.getAllAgents()
        console.log("RES",res.data.view.data)

        let tempAgent = null
        res.data.view.data.map((x)=>{
            if(x.type == 'SPC'){
                tempAgent = x
            }
        })
        
        let item = this.state.data[index]
        // console.log("item", item)


        let formData = {
            "created_by": user.id,
            "items": [
                {
                    "agent_id": tempAgent.id,
                    "agent": tempAgent.type,
                    "requirement_from": (new Date()).toISOString(),
                    "requirement_to": item.expected_treatment_date,
                    "total_calculated_cost": parseInt(item.ItemSnap.standard_cost)*parseInt(item.approved_quantity),
                    "np_request_id":item.id,
                    "item_id":item.ItemSnap.id,
                    "order_quantity":item.approved_quantity,
                    "standard_unit_cost":item.ItemSnap.standard_cost
                }
            ]
        }
        console.log(formData)

        let res2 = await PrescriptionService.BulkPlaceOrder(formData)
        if(res2.status == 200 || res2.status == 201){
            this.setState({
                message : "Data has been added successfully!",
                severity : 'success',
                alert : true
            })
        }else{
            this.setState({
                message : "Something went wrong",
                severity : 'error',
                alert : true
            })
        }

    }
    BulkOrder = async() => {
        let user = localStorageService.getItem("userInfo")
        let res = await PrescriptionService.getAllAgents()
        console.log("RES",res.data.view.data)

        let tempAgent = null
        res.data.view.data.map((x)=>{
            if(x.type == 'SPC'){
                tempAgent = x
            }
        })
        
        // let item = this.state.data[]
        // console.log("item", item)

        let tempItems = []
        if(this.state.selectedRows.length>0){
            this.state.selectedRows.map((x)=>{
                let temp2 = {
                    "agent_id": tempAgent.id,
                    "agent": tempAgent.type,
                    "requirement_from": (new Date()).toISOString(),
                    "requirement_to": x.expected_treatment_date,
                    "total_calculated_cost": parseInt(x.ItemSnap.standard_cost)*parseInt(x.approved_quantity),
                    "np_request_id":x.id,
                    "item_id":x.ItemSnap.id,
                    "order_quantity":x.approved_quantity,
                    "standard_unit_cost":x.ItemSnap.standard_cost
                }
                tempItems.push(temp2)
            })
            let formData = {
                "created_by": user.id,
                "items": tempItems
            }
            console.log(formData)
    
            let res2 = await PrescriptionService.BulkPlaceOrder(formData)
            if(res2.status == 200 || res2.status == 201){
                this.setState({
                    message : "Data has been added successfully!",
                    severity : 'success',
                    alert : true
                })
            }else{
                this.setState({
                    message : "Something went wrong",
                    severity : 'error',
                    alert : true
                })
            }
    
        }else{
            this.setState({
                message : "Select item first",
                severity : 'error',
                alert : true
            })
        }

        
    }

    getClinicBHTNo = async() => {
        // let params = {
        //     clinic_id : clinic_id,
        // }   
        let res = await PrescriptionService.getClinicBHTNo()
        this.setState({clinics : res.data.view.data})
        console.log("clinics",this.state.clinics)
    }

    getItems = async(value) => {

        let data = {
            search : value
        }
        let res = await InventoryService.fetchAllItems(data)
        console.log("ITEM",res)
        if (res.status == 200) {
            this.setState({ sr_no: res.data.view.data })
        }
    }

    async loadHospital(name_like) {
        let params_ward = { issuance_type: 'Hospital', department_type_name: ['Hospital', 'Training'], name_like: name_like }
        let hospitals = await DashboardServices.getAllHospitals(params_ward);
        if (hospitals.status == 200) {
            console.log("all_hospitals", hospitals.data.view.data)
            this.setState({ all_hospitals: hospitals.data.view.data })
        }
    }

    componentDidMount () {
        // this.getItems()
        this.getData()
        this.getData2()
    }
    render() { 
        return (
            <Fragment>
                
                <Grid className="pb-24 pt-7 px-8 ">
                    <Card className="pb-24 pt-7 px-8">
                        <Grid>
                            {this.state.loaded?
                                <LoonsTable
                                    id={"orderNewDrug"}
                                    data={this.state.data2}
                                    columns={this.state.columns2}
                                    options={{
                                        pagination: false,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        rowsPerPage: this.state.rowsPerPage,
                                        page: this.state.page,
                                        rowsPerPageOptions: [5,10,15,20,30,50,100],
                                        selectableRows:true,
                                        onTableChange: (action, tableSate) => {
                                            console.log(action,tableSate)
                                            switch(action){
                                                case 'rowSelectionChange':
                                                    let temp = []
                                                    let selectedRows = tableSate.selectedRows.data
                                                    // console.log("selected",selectedRows)
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
                            : null
                            }
                            <Grid
                                className="flex justify-end"
                            >
                                {/* <Button
                                    onClick={()=>{
                                        this.BulkOrder()
                                    }}
                                    startIcon = {<PlaylistAddCheckIcon/>}
                                >
                                    Place Order
                                </Button> */}
                            </Grid>
                        </Grid>
                    </Card>
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
        );
    }
}
 
export default NPDrugPlacedOrders;