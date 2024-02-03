import { AppBar, Card, Grid, IconButton, Tab, Tabs, TextField, Tooltip, Typography } from "@material-ui/core"
import moment from "moment"
import React, { Component, Fragment } from "react"
import {
    LoonsTable,
    Button,
    SubTitle,
    DatePicker,
    LoonsSnackbar,
    CardTitle,
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
import * as appconst from "../../../appconst";
import { Dialog, Checkbox } from '@material-ui/core'

class NPDrugOrdering extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            severity: 'success',
            message: '',

            bulkApproval: false,
            placeOrder: false,
            button_enable:true,


            item: null,
            institute: null,
            request_id: null,
            all_hospitals: [],
            formData2: {},
            is_Place_order:false,
            order_type:null,
            selectedSeq:[],
            finalSelectedSeq:[],

            sr_no: [],
            formData: {},

            data: [],
            selected_type: 'all',
            selectedRows: [],

            isClicked: false,
            totalItems2: 0,
            selectedItems2: 0,
            data2: [],
            columns: [
                // {
                //     name: 'action', // field name in the row object
                //     label: 'Action', // column title that will be shown in table
                //    options: {
                //         filter: false,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <>
                //                     <Checkbox 
                //                         onChange={(e) => this.handleCheckbox([tableMeta.rowIndex])} 
                //                         disabled={this.state.data[tableMeta.rowIndex].isDisable} 
                //                         color={"primary"}
                //                         // checked={}

                //                     />
                //                 </>
                //             )
                //         },
                    
                //     }
                // },
                {
                    name: 'id', // field name in the row object
                    label: '', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) =>
                        {
                            let selected_index = this.state.selectedRows.findIndex((x)=>x.id == this.state.data[tableMeta?.rowIndex].id)
                            return <Checkbox
                            disabled={this.state.selected_type == 'all' ? false :
                                ((this.state.selected_type == this.state.data[tableMeta?.rowIndex]?.item_id)
                                    ? false : true)}

                            checked={selected_index != -1 ? true : false}
                            onChange={(e, value) => {

                                console.log(tableMeta, "NNNN")

                                if (selected_index == -1) {

                                    let val = this.state.selectedRows;
                                    val.push(this.state.data[tableMeta?.rowIndex]);
                                    this.setState({
                                        selectedRows: val,
                                        selected_type: this.state.data[tableMeta?.rowIndex]?.item_id,
                                    })

                                                        
                                //     this.state.selectedSeq.forEach((x) => {
                                //         temp.push(this.state.data[x]);
                                //     });

                                // this.setState({ selectedRows: temp, selectedItems2:this.state.selectedSeq.length });


                                } else {
                                    let val = this.state.selectedRows.filter((data) => data.id !== this.state.data[tableMeta?.rowIndex]?.id);
                                    console.log("filtered data", val)

                                    if (val.length == 0) {
                                        this.setState({
                                            selected_type: 'all',
                                            selectedRows: val,
                                        })
                                    } else {
                                        this.setState({
                                            selectedRows: val,
                                        })
                                    }
                                }
                            }}>

                        </Checkbox>
                        }
                    },
                },
    
                {
                    name: 'Institute',
                    label: 'Institute',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value.name : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'request_id',
                    label: 'Request ID',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'bht_no',
                    label: 'BHT/Clinic No',
                    options: {
                        filter: false,
                       
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'SR',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value.sr_no : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'Description/Brand',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value.short_description : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'approved_quantity',
                    label: 'Qty Purchasing',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'Unit Price',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value.standard_cost : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'Value (Rs)',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            { console.log('TABLEMETA', tableMeta) }
                            return (
                                <Grid className="w-full">
                                    {(value != null) ?
                                        (value.standard_cost != null && this.state.data[tableMeta.rowIndex]?.approved_quantity != null) ? parseInt(value.standard_cost) * parseInt(this.state.data[tableMeta.rowIndex].approved_quantity) : null
                                        : null}
                                </Grid>
                            )
                        }
                    }
                },
            ],
            columns2: [
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
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value.name : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'request_id',
                    label: 'Request ID',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value.name : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'bht',
                    label: 'BHT/Clinic No',
                    options: {
                        filter: false,
                        customBodyRenderLite: (dataIndex) => {
                            let val = null
                            this.state.clinics.map((x) => {
                                if (x.clinic_id == this.state.data[dataIndex].clinic_id) {
                                    val = x.bht
                                }

                            })
                            return (
                                <Grid
                                    className="flex justify-center"
                                >
                                    {(val != null) ? val : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'SR',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value.sr_no : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'Description/Brand',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value.short_description : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'approved_quantity',
                    label: 'Qty Purchasing',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'Unit Price',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value.standard_cost : "-"}
                                </Grid>
                            )
                        }
                    }
                },

            ],
            loaded: true,

            selectedRows: [],

            sr: null,
            description: null,
            instituteCode: null,
            requestId: null,
            clinics: [],
            filterData:{
                status: ["SCO Approve"],
                'order[0]': ['createdAt', 'DESC'],
                limit:20,
                page:0
            },

            activeTab: 0
        }
    }

    getData = async () => {
        let user = await localStorageService.getItem("userInfo")
        this.setState({ loaded: true })
        // let hospitalID =  localStorageService.getItem("main_hospital_id") != undefined ? localStorageService.getItem("main_hospital_id") : ''
        console.log("AAAAA", this.state.formData.item_id)
        let params = {
            status: ["SCO Approve"],
            'order[0]': ['updatedAt', 'DESC'],
            // owner_id : this.state.formData2.hospital_id,
            //item_id : this.state.formData.item_id,
            //request_id : this.state.request_id
            // hospital_id : "02086072-f418-4da2-bb4a-51a66ba76d00",
            // requested_by : user.id
        }
        let res = await PrescriptionService.fetchNPRrequests(this.state.filterData)
        console.log("RES1", res)
        // if(res.data.view.data.length > 0){
        this.setState({ data: res.data.view.data, totalItems2: res.data.view.totalItems, loaded: true })
        // }else{
        //     this.setState({data: null, totalItems2: res.data.view.totalItems ,loaded: true})
        // }
        // this.setState({loaded : true})
        console.log("params", params)
    }




    handleApproval = async (index) => {
        this.setState({ placeOrder: false })
        let user = localStorageService.getItem("userInfo")
        let res = await PrescriptionService.getAllAgents()
        console.log("RES", res.data.view.data)

        let tempAgent = null
        res.data.view.data.map((x) => {
            if (x.type == 'SPC') {
                tempAgent = x
            }
        })

        let item = this.state.data[index]
        // // console.log("item", item)


        let formData = {
            "created_by": user.id,
            "items": [
                {
                    "agent_id": tempAgent.id,
                    "agent": tempAgent.type,
                    "requirement_from": (new Date()).toISOString(),
                    "requirement_to": item.expected_treatment_date,
                    "total_calculated_cost": parseInt(item.ItemSnap.standard_cost) * parseInt(item.approved_quantity),
                    "np_request_id": item.id,
                    "item_id": item.ItemSnap.id,
                    "order_quantity": item.approved_quantity,
                    "standard_unit_cost": item.ItemSnap.standard_cost
                }
            ]
        }
        console.log(formData)

        let res2 = await PrescriptionService.BulkPlaceOrder(formData)
        if (res2.status == 200 || res2.status == 201) {
            this.setState({
                message: "Data has been added successfully!",
                severity: 'success',
                alert: true
            })
        } else {
            // console.log('error', error)
            this.setState({
                message: "Something went wrong",
                severity: 'error',
                alert: true
            })
        }
        this.setState({ placeOrder: false })

    }
    BulkOrder = async () => {
        this.setState({ placeOrder: true })
        let user = localStorageService.getItem("userInfo")
        let res = await PrescriptionService.getAllAgents()
        console.log("RES", res.data.view.data)

        let tempAgent = null
        res.data.view.data.map((x) => {
            if (x.type == 'SPC') {
                tempAgent = x
            }
        })

        // // let item = this.state.data[]
        // // console.log("item", item)

        let tempItems = []
        console.log('selectedRows', this.state.selectedRows)
        if (this.state.selectedRows.length > 0) {
            this.state.selectedRows.map((x) => {
                let temp2 = {
                    "agent_id": tempAgent.id,
                    "agent": tempAgent.type,
                    "requirement_from": (new Date()).toISOString(),
                    "requirement_to": x.expected_treatment_date,
                    "total_calculated_cost": parseInt(x.ItemSnap.standard_cost) * parseInt(x.approved_quantity),
                    "np_request_id": x.id,
                    "item_id": x.ItemSnap.id,
                    // "order_quantity": null,
                    "order_quantity": x.approved_quantity,
                    "standard_unit_cost": x.ItemSnap.standard_cost
                    // "standard_unit_cost": 'nnnnnn'
                }
                tempItems.push(temp2)
            })
            let formData = {
                "created_by": user.id,
                "order_type":this.state.order_type,
                "items": tempItems
            }
            console.log(formData)

            let res2 = await PrescriptionService.BulkPlaceOrder(formData)
            if (res2.status == 200 || res2.status == 201) {
                this.setState({
                    message: "Data has been added successfully!",
                    severity: 'success',
                    alert: true
                }, ()=>{
                    window.location.reload()
                })
            } else {
                // console.log('checking error msg', this.Response)
                this.setState({
                    message: "Something went wrong",
                    severity: 'error',
                    alert: true
                })
            }

        } else {
            this.setState({
                message: "Select item first",
                severity: 'error',
                alert: true
            })
        }

        this.setState({ placeOrder: false })
    }

    getClinicBHTNo = async () => {
        // let params = {
        //     clinic_id : clinic_id,
        // }   
        let res = await PrescriptionService.getClinicBHTNo()
        this.setState({ clinics: res.data.view.data })
        console.log("clinics", this.state.clinics)
    }

    getItems = async (value) => {

        let data = {
            search: value
        }
        let res = await InventoryService.fetchAllItems(data)
        console.log("ITEM", res)
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

    componentDidMount() {
        // this.getItems()
        this.getData()
        // this.getData2()
    }


    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.getData()
            }
        )
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

                                <Grid
                                    item
                                    md={3}
                                >
                                    <SubTitle title="Item" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        /* value={
                                            this.state.formData.name != null ? { long_description: this.state.formData.name } : null
                                        } */
                                        // options={this.state.sr_no}
                                        options={this.state.sr_no}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let filterData = this.state.filterData;
                                                filterData.name = value.long_description;
                                                filterData.item_id = value.id;
                                                console.log('SR no', this.state.formData)
                                                this.setState({
                                                    filterData,
                                                    // srNo:true
                                                }, console.log("ITEMF", this.state.filterData))
                                                // let formData = this.state.formData;
                                                // formData.sr_no = value;

                                            } else if (value == null) {
                                                let filterData = this.state.filterData;
                                                filterData.name = null;
                                                filterData.item_id = null;
                                                this.setState({
                                                    filterData,
                                                    // srNo:false
                                                }, console.log("ITEMF", this.state.filterData))
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
                                                        let filterData = this.state.filterData
                                                        filterData.name = e.target.value

                                                        this.setState({
                                                            filterData,

                                                        }, console.log("FORMDATA", this.state.filterData))
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    // className="flex justify-content"
                                    item
                                    md={3}
                                >
                                    <SubTitle title="Institute" />
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
                                                console.log("INST", value)
                                                let filterData = this.state.filterData
                                                filterData.hospital_id = value.id
                                                this.setState({
                                                    filterData,
                                                }, console.log("INST", this.state.filterData))
                                            }
                                        }}
                                        value={this.state.all_hospitals.find((v) => v.id == this.state.filterData.hospital_id
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
                                    className=" w-full"
                                    item
                                    xs={6}
                                    sm={6}
                                    md={3}
                                    lg={3}
                                >
                                    <SubTitle title="Priority" /> 
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={[ {
                                            label: 'Yes',
                                            value: 'Yes',
                                        },
                                        {
                                            label: 'No',
                                            value: 'No',
                                        },]} 
                                        onChange={(e, value) => {
                                            console.log('ceking val', value)
                                            let filterData = this.state.filterData
                                            
                                            if (value != null) {
                                                filterData.priority = value.value
                                                this.setState({ filterData });
                                            } else {
                                                filterData.priority = null
                                                // let formData = this.state.formData;
                                                // formData.from_owner_id = null;
                                                this.setState({ filterData });
                                            }
                                        }}
                                        // value={
                                        //     this.state.all_pharmacy &&
                                        //     this.state.all_pharmacy.find((v) => v.owner_id === this.state.formData.from_owner_id)
                                        // }
                                        getOptionLabel={(option) => (option.label)}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Institution Name"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                // onChange={(e) => {
                                                //     if (e.target.value.length > 3) {
                                                //         this.getPharmacyDetails(e.target.value);
                                                //     }
                                                // }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid
                                    // className="flex justify-content"
                                    item
                                    md={3}
                                >
                                    <SubTitle title="Search" />
                                    <TextValidator
                                        className="w-full"
                                        variant="outlined"
                                        size="small"
                                        placeholder="Search"
                                        value={this.state.filterData.search}
                                        onChange={(e) => {
                                            let filterData=this.state.filterData;
                                            filterData.search=e.target.value;
                                            this.setState({ filterData })
                                        }}
                                    //validators={['required']}
                                    // errorMessages={['this field is required']}
                                    />
                                </Grid>
                                <Grid
                                    item
                                >
                                    <Button
                                        className='mt-6'
                                        startIcon='search'
                                        onClick={() => {
                                           // this.setState({ isClicked: true })
                                            this.setPage(0)
                                        }}
                                    >
                                        Search
                                    </Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                        <Grid>
                            {this.state.loaded && this.state.data ?
                                <Grid>
                                    <Grid
                                        container
                                        spacing={5}
                                    >
                                        <Grid item>
                                            <Typography variant="body1" className="text-primary">
                                                Total items : {this.state.totalItems2}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body1" className="text-primary">
                                                Total selected : {this.state.selectedItems2}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <LoonsTable
                                        id={"orderNewDrug"}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems2,
                                            rowsPerPage: this.state.filterData.limit,
                                            page: this.state.filterData.page,
                                            //rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                            // selectableRows: true,
                                            onTableChange: (action, tableSate) => {
                                                console.log("TableState", action, tableSate)
                                                switch (action) {
                                                    // case 'rowSelectionChange':
                                                    //     let temp = [];
                                                    //     let selectedRows = tableSate.selectedRows.data;
                                                    //     // this.setState({ selectedItems2: tableSate.selectedRows.data.length });
                                                    //     // console.log("selected", selectedRows);
                                                        
                                                    //     // selectedRows.forEach((x) => {
                                                    //     //     temp.push(this.state.data[x.dataIndex]);
                                                    //     // });
                                                        
                                                    //     // let filteredData;
                                                        
                                                    //     // const firstRow = temp[0]?.item_id;
                                                    //     // console.log("selected 1st row", firstRow);
                                                        
                                                    //     // filteredData = temp.filter((item) => item.item_id === firstRow);
                                                        
                                                    //     // if (filteredData.length === temp.length) {
                                                    //     //     console.log("selected matched", filteredData);
                                                    //     //     this.setState({ selectedRows: temp });
                                                    //     // } else {
                                                    //     //     this.setState({
                                                    //     //         message: "Please select the same item only!",
                                                    //     //         severity: 'error',
                                                    //     //         alert: true
                                                    //     //     });
                                                    //     // }
                                                        
                                                    //     // console.log("selectedRows final", this.state.selectedRows);
                                                        
                                                        
                                                    //     break;
                                                    case 'changePage':
                                                       
                                                        this.setPage(tableSate.page)


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
                                : null
                            }
                            <Grid
                                className="flex justify-end mt-5"
                            >
                                <Button
                                    progress={this.state.bulkApproval}
                                    onClick={() => {
                                        this.setState({
                                            is_Place_order:true
                                        })
                                    }}
                                    startIcon={<PlaylistAddCheckIcon />}
                                >
                                    Place Order
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                {/* pop up */}
                    <Dialog fullWidth maxWidth="md" open={this.state.is_Place_order} spacing={2}  className="p-5">

                    <div className="w-full h-full px-5 py-5">
                        <CardTitle title="Select Order Type" />
                    </div>
                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            onError={() => null}
                            className="w-full"
                        >
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                options={appconst.name_patient_type}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        this.setState({
                                            order_type : value.value,
                                            button_enable: false
                                        })
                                    }
                                }}
                                
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Order Type"
                                        value={this.state.order_type}
                                        //variant="outlined"
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
                             </ValidatorForm>
                            <Grid container className="mt-5" spacing={2}>
                                <Grid item >
                                    <Button type='submit' color='primary' disabled={this.state.button_enable} onClick={()=>{
                                        this.BulkOrder()
                                        this.setState({
                                            is_Place_order:false
                                        })
                                    }}>Submit</Button>
                                </Grid>
                                <Grid item >
                                    <Button type='submit' style={{background:'red'}} onClick={()=>{
                                        this.setState({
                                            is_Place_order : false
                                        })
                                    }}>Cancel</Button> 
                                </Grid>
                            </Grid>

                       
                    </div>
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
                    variant="filled">
                </LoonsSnackbar>
            </Fragment>
        );
    }
}

export default NPDrugOrdering;