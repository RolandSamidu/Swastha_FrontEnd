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

class NPDrugOrderView extends Component {
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
                    name: 'Patient',
                    label: 'PHN',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid
                                    // className="flex justify-center"
                                >
                                    {(value != null) ? value.phn : "-" }
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
        console.log("ID",this.props.match.params.id)
        let params = {
            order_id : this.props.match.params.id
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
    Approve = async() => {
        let user = localStorageService.getItem("userInfo")
        let data = null
        if(user.roles.includes("MSD AD")){
            
            data = {
                "approved_by":user.id,
                "role":"MSD AD",
                "remark":"Remark",
                "status":"AD Checked",
                "type":"Approved"
            }
        }

        if(user.roles.includes("MSD SDA")){
            
            data = {
                "approved_by":user.id,
                "role":"MSD SDA",
                "remark":"Remark",
                "status":"SDA Approved",
                "type":"Approved"
            }
        }

        if(user.roles.includes("AD Approved")){
            
            data = {
                "approved_by":user.id,
                "role":"MSD SDA",
                "remark":"Remark",
                "status":"AD Approved",
                "type":"Approved"
            }
        }



        let res = await PrescriptionService.NP_Place_Orders(this.props.match.params.id,data)

        if(res.status == 200 || res.status == 201){
            this.setState({
                message : "Order Details Updated!",
                severity : 'success',
                alert : true
            })
        }else{
            this.setState({
                message : "Cannot complete action!",
                severity : 'error',
                alert : true
            })
        }

        
    }

    Reject = async() => {
        let user = localStorageService.getItem("userInfo")
        let data = null
        
        data = {
            "approved_by":user.id,
            "remark":"Remark",
            "status":"Rejected",
            "type":"Rejected"
        }

        let res = await PrescriptionService.NP_Place_Orders(this.props.match.params.id,data)

        if(res.status == 200 || res.status == 201){
            this.setState({
                message : "Order Rejected!",
                severity : 'Error',
                alert : true
            })
        }else{
            this.setState({
                message : "Cannot complete action!",
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
                {/* <Grid>
                    <AppBar position="static" color="default" className="mb-4 mt-2">
                        <Grid item lg={12} md={12} xs={12}>
                            <Tabs style={{ minHeight: 39, height: 26 }}
                                indicatorColor="primary"
                                variant='fullWidth'
                                textColor="primary"
                                value={this.state.activeTab}
                                onChange={(event, newValue) => {
                                    console.log(newValue)
                                    this.setState({ activeTab: newValue })
                                }} >

                                <Tab label={<span className="font-bold text-12">TO BE ORDERED</span>} />
                                <Tab label={<span className="font-bold text-12">ORDERED</span>} />
                            </Tabs>
                        </Grid>
                    </AppBar>
                </Grid> */}
                
                    <Grid className="pb-24 pt-7 px-8 ">
                        <Card className="pb-24 pt-7 px-8">
                            <ValidatorForm>
                                <Grid
                                    container
                                    spacing={2}
                                    className="pb-5"
                                >
                                    {/* <Grid
                                        // className="flex justify-content"
                                        item
                                        md={3}
                                    >
                                        <SubTitle title="SR"/>
                                        <TextValidator
                                            className="w-full"
                                            variant="outlined"
                                            size="small"
                                            value={this.state.sr}
                                            onChange={(e) => {
                                                this.setState({sr : e.target.value})
                                            }}
                                            //validators={['required']}
                                            // errorMessages={['this field is required']}
                                        />
                                    </Grid>
                                    <Grid
                                        // className="flex justify-content"
                                        item
                                        md={3}
                                    >
                                        <SubTitle title="Description"/>
                                        <TextValidator
                                            className="w-full"
                                            variant="outlined"
                                            size="small"
                                            value={this.state.description}
                                            onChange={(e) => {
                                                this.setState({description : e.target.value})
                                            }}
                                            //validators={['required']}
                                            // errorMessages={['this field is required']}
                                        />
                                    </Grid> */}
                                    {/* <Grid
                                        item
                                        md={3}
                                    >
                                        <SubTitle title="Item"/>
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            value={
                                                this.state.formData.name !=null ? {long_description :this.state.formData.name }:null
                                            }
                                            // options={this.state.sr_no}
                                            options={this.state.sr_no}
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData = this.state.formData;
                                                    formData.name =value.long_description;
                                                    formData.item_id = value.id;
                                                    console.log('SR no',formData)
                                                    this.setState({ 
                                                        formData,
                                                        // srNo:true
                                                    },console.log("ITEMF",this.state.formData))
                                                    // let formData = this.state.formData;
                                                    // formData.sr_no = value;
                                                
                                                } else if(value == null) {
                                                    let formData = this.state.formData;
                                                    formData.name=null;
                                                    formData.item_id = null;
                                                    this.setState({
                                                        formData,
                                                        // srNo:false
                                                    },console.log("ITEMF",this.state.formData))
                                                }
                                            }}
                                            getOptionLabel={(option) =>
                                                // {
                                                // let hsco =  this.state.hsco
                                                // if ( this.state.sr_no !== '' ) {
                                                //     option.sr_no+'-'+option.long_description
                                                // }
                                                // else{
                                                //    hsco.sr_no
                                                // }
                                                // }
                                                //  option.sr_no +'-'+
                                                option.long_description
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Item Name"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        console.log("as", e.target.value)
                                                        if (e.target.value.length > 2) {
                                                            this.getItems(e.target.value)
                                                            let formData =this.state.formData
                                                            formData.name = e.target.value

                                                            this.setState({
                                                                formData,
                                                            
                                                        })
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid> */}
                                    <Grid
                                        // className="flex justify-content"
                                        item
                                        md={3}
                                    >
                                        <SubTitle title="Institute"/>
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={
                                                    this.state.all_hospitals
                                                }

                                                onChange={(
                                                    e,
                                                    value
                                                ) => {
                                                    if (value != null) {
                                                        console.log("INST",value)
                                                        let formData2 = this.state.formData2
                                                        formData2.hospital_id = value.owner_id
                                                        this.setState({
                                                            formData2,
                                                        },console.log("INST",this.state.formData2))
                                                    }
                                                }}
                                                value={this.state.all_hospitals.find((v) => v.id == this.state.formData2.trasfered_from_hospital
                                                )}
                                                getOptionLabel={(
                                                    option
                                                ) =>
                                                    option.name
                                                        ? option.name
                                                        : ''
                                                }
                                                renderInput={(
                                                    params
                                                ) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Hospital"
                                                        //variant="outlined"
                                                        onChange={(e) => {
                                                            if (e.target.value.length >= 3) {
                                                                this.loadHospital(e.target.value)
                                                            }
                                                        }}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />
                                    </Grid>
                                    
                                    <Grid
                                        // className="flex justify-content"
                                        item
                                        md={3}
                                    >
                                        <SubTitle title="Request ID"/>
                                        <TextValidator
                                            className="w-full"
                                            variant="outlined"
                                            size="small"
                                            value={this.state.requestId}
                                            onChange={(e) => {
                                                this.setState({requestId : e.target.value})
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                    >
                                        <Button
                                            className='mt-6'
                                            startIcon='search'
                                            onClick={()=>{
                                                this.getData()
                                            }}
                                        >
                                            Search
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                            <Grid>
                                {this.state.loaded?
                                    <LoonsTable
                                        id={"orderNewDrug"}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: false,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: this.state.rowsPerPage,
                                            page: this.state.page,
                                            rowsPerPageOptions: [5,10,15,20,30,50,100],
                                            selectableRows:false,
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
                                    className="flex justify-end mt-5"
                                >
                                    <Grid>
                                        
                                    </Grid>
                                    <Grid 
                                        className="px-5"
                                    >
                                        <Button
                                            onClick={()=>{
                                                this.Approve()
                                            }}
                                            startIcon = "thumb_up"
                                        >
                                            Approve
                                        </Button>
                                    </Grid>
                                    <Grid>
                                        <Button
                                            onClick={()=>{
                                                this.Reject()
                                            }}
                                            className="bg-error"
                                            startIcon = "thumb_down"
                                        >
                                            Reject
                                        </Button>
                                    </Grid>
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
 
export default NPDrugOrderView;