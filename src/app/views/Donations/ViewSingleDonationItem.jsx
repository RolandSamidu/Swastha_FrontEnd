import React, { Component, Fragment, useState } from 'react'
import {
    CardTitle,
    LoonsCard,
    SubTitle,
    DatePicker,
    LoonsSnackbar,
} from 'app/components/LoonsLabComponents'
import MainContainer from 'app/components/LoonsLabComponents/MainContainer'
import { LoonsTable, Button } from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    CircularProgress,
    Grid,
    Icon,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Checkbox,
    Fab,
    Typography,
    DialogContentText,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete';
import * as appConst from '../../../appconst'
import { Autocomplete } from '@material-ui/lab'
import CloseIcon from '@material-ui/icons/Close'
import { withStyles } from '@material-ui/core/styles'
import InputAdornment from '@mui/material/InputAdornment'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import AddDetails from './AddDetails'
import ConsignmentService from 'app/services/ConsignmentService'

import DonarService from '../../services/DonarService'
import localStorageService from 'app/services/localStorageService'
import EmployeeServices from 'app/services/EmployeeServices'
import { dateParse, timeParse } from 'utils'
import InventoryService from 'app/services/InventoryService'
import HospitalConfigServices from 'app/services/HospitalConfigServices';
import { batch } from 'react-redux'

const drawerWidth = 270

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
        backgroundColor: '#bad4ec',
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

class ViewSingleDonationItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editBatch:false,
            //snackbar
            alert: false,
            message: '',
            severity: 'success',
            deleteConfirm:false,
            batchIndex:null,
            packageID:null,
            packageIndex:null,
            sr_no: [],
            requestDialog:false,
            loading: false,
            is_editable: true,
            all_uoms: [],
            packetSize:null,
            packetSize2:null,
            packetLevel:null,
            packetLevel2:null,
            volume_factor_index:null,
            packet_level_index:null,
            volume_factor_index2:null,
            packet_level_index2:null,
            hsco:{
                sr_no:null,
            },
            userInfo:[],
            filterData: {
                manufacture_date: null,
            },
            donation_item_id:null,
            packet_level:false,
            mapIndex:null,
            all_manufacturers:null,
            formData: {
                donation_id: this.props.match.params.id,
                name: null,
                manufacture_id:null,
                item_id:null,
                status:null,
                item_name:null,
                total_quantity: null,
                batch_count: null,
                approval: 'Pending',
                batch_details: [
                    {
                        batch_no: null,
                        Manufacture_date: null,
                        expiary_date: null,
                        received_quantity: null,
                        invoice_quantity: null,
                        short_excess_quantity: null,
                        damage_quantity: null,
                        unit_value: null,
                        value_usd: null,
                        uom_id: null,
                        width: null,
                        height: null,
                        length: null,
                        net_weight: null,
                        gross_weight: null,
                        packaging_details: [
                            {
                                package_uom_id: null,
                                packet_level: null,
                                packet_size: null,
                                package_qunatity: null,
                                conversion: null,
                                value_metrices: null,
                            },
                        ],
                    },
                ],
            },
            donation_his:{
                createdBy:{
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                sco_approve:{
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                ciu_approve:{
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                hsco_approve:{
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                ad_approve:{
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
            },
            itemBatches: [
                    // {
                    //     batch_no: null,
                    //     Manufacture_date: null,
                    //     expiary_date: null,
                    //     received_quantity: null,
                    //     invoice_quantity: null,
                    //     short_excess_quantity: null,
                    //     damage_quantity: null,
                    //     unit_value: null,
                    //     value_usd: null,
                    //     uom_id: null,
                    //     width: null,
                    //     height: null,
                    //     length: null,
                    //     net_weight: null,
                    //     gross_weight: null,
                    //     packaging_details: [
                    //         {
                    //             package_uom_id: null,
                    //             packet_level: null,
                    //             packet_size: null,
                    //             package_qunatity: null,
                    //             conversion: null,
                    //             value_metrices: null,
                    //         },
                    //     ],
                    // },
                ],
        

            backendData: {
                donation_id: null,
                address: null,
                donor_invoice_no: null,
                recevied_date: null,
                donation_reg_no: null,
                donors_invoice_date: null,
                donor_contact_no: null,
                donor_name: null,
                donor_country: null,
                description: null,
                delivery_person: null,
                delivery_person_contact_no: null,
                receiving_officer_name: null,
                security_officer_name: null,
                delivered_by: null,
                item_name: null,
                total_quantity_received: null,
            },
            columns: [
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            name="sr_no"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                this.state.data[dataIndex].sr_no
                                            }
                                            type="text"
                                            placeholder="SR No"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data
                                                data[dataIndex].sr_no =
                                                    e.target.value
                                                this.setState({
                                                    data,
                                                })
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'manufacture_date', // field name in the row object
                    label: 'Manufacture Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <DatePicker
                                        className="w-full"
                                        value={
                                            this.state.filterData
                                                .manufacture_date
                                        }
                                        //label="Date From"
                                        placeholder="Manufacture Date"
                                        // minDate={new Date()}
                                        //maxDate={new Date("2020-10-20")}
                                        required={true}
                                        errorMessages="this field is required"
                                        onChange={(date) => {
                                            let filterData =
                                                this.state.filterData
                                            filterData.manufacture_date = date
                                            this.setState({ filterData })
                                        }}
                                    />
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'expiry_date', // field name in the row object
                    label: 'Expiry Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <DatePicker
                                        className="w-full"
                                        value={
                                            this.state.filterData.expiry_date
                                        }
                                        //label="Date From"
                                        placeholder="Expiry Date"
                                        // minDate={new Date()}
                                        //maxDate={new Date("2020-10-20")}
                                        required={true}
                                        errorMessages="this field is required"
                                        onChange={(date) => {
                                            let filterData =
                                                this.state.filterData
                                            filterData.expiry_date = date
                                            this.setState({ filterData })
                                        }}
                                    />
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'received_quantity', // field name in the row object
                    label: 'Received Quantity', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            name="received_quantity"
                                            placeholder="Received Quantity"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                this.state.data[dataIndex]
                                                    .received_quantity
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data
                                                data[
                                                    dataIndex
                                                ].received_quantity =
                                                    e.target.value
                                                this.setState({
                                                    data,
                                                })
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'invoice_quantity', // field name in the row object
                    label: 'Invoice Quantity', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            name="invoice_quantity"
                                            placeholder="Invoie Quantity"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                this.state.data[dataIndex]
                                                    .invoice_quantity
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data
                                                data[
                                                    dataIndex
                                                ].invoice_quantity =
                                                    e.target.value
                                                this.setState({
                                                    data,
                                                })
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'short_excess', // field name in the row object
                    label: 'Short/ Excess', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            name="short_excess"
                                            placeholder="Short/ Excess"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                this.state.data[dataIndex]
                                                    .short_excess
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data
                                                data[dataIndex].short_excess =
                                                    e.target.value
                                                this.setState({
                                                    data,
                                                })
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'unit_value', // field name in the row object
                    label: 'Unit Value', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div style={{ width: 100 }}>
                                        <TextValidator
                                            //className=" w-full"

                                            name="unit_value"
                                            placeholder="0"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                this.state.data[dataIndex]
                                                    .unit_value
                                            }
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data
                                                data[dataIndex].unit_value =
                                                    e.target.value
                                                this.setState({
                                                    data,
                                                })
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'value', // field name in the row object
                    label: 'Value (USD)', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            name="value"
                                            placeholder="0"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                this.state.data[dataIndex].value
                                            }
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data
                                                data[dataIndex].value =
                                                    e.target.value
                                                this.setState({
                                                    data,
                                                })
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                },
                {
                    name: '', // field name in the row object
                    label: 'Add Packaging Details ', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div>
                                        <Button
                                            className="p-2 min-w-32"
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => {
                                                this.setState({
                                                    packagingDetails: true,
                                                    rowID: [dataIndex],
                                                })
                                            }}
                                        >
                                            <Icon fontSize="small">add</Icon>
                                        </Button>
                                    </div>
                                </>
                            )
                        },
                    },
                },
            ],

            // data: [
            //     {
            //         batch_no: '',
            //         manufacture_date: '',
            //         expiry_date: '',
            //         received_quantity: '',
            //         invoice_quantity: '',
            //         short_excess: '',
            //         unit_value: '',
            //         value: '',
            //     },
            //     {
            //         batch_no: '',
            //         manufacture_date: '',
            //         expiry_date: '',
            //         received_quantity: '',
            //         invoice_quantity: '',
            //         short_excess: '',
            //         unit_value: '',
            //         value: '',
            //     },
            // ],
            // itemBatches: [
            //     {
            //         data: [
            //             {
            //                 batch_no: '',
            //                 manufacture_date: '',
            //                 expiry_date: '',
            //                 received_quantity: '',
            //                 invoice_quantity: '',
            //                 short_excess: '',
            //                 unit_value: '',
            //                 value: '',
            //             },
            //         ],
            //         sr_no: null,
            //         item_name: null,
            //         item_description: null,
            //         packagingDetails: false,
            //         rowID: null,
            //     },
            // ],
        }
    }
    async RequestSR() {
        console.log("FormData",this.state.formData)
        console.log("FormData 2",this.state.itemBatches)

        let userInfo = await localStorageService.getItem('userInfo')
        let data={
                donation_item_id:this.props.match.params.id,
                requested_by: userInfo?.id,
                donation_reg_no:this.state.backendData.donation_reg_no,
                item_name:this.state.formData.name,
                type:"donation",
                status:"SR Requested"
            }
        console.log("data",data)
        let res = await DonarService.requestDonationItemSR(data);
        console.log("res",res)
        if (res.status === 201) {
            this.setState({
                alert: true,
                message: 'Item Sr Request Sent Succefully',
                severity: 'success',
            }, () => {
                window.location.reload()
            })
        } else {
            this.setState({
                alert: true,
                message: 'Item Sr Request was Unsuccessful!',
                severity: 'error',
            })
        }

    }

    async loadHistory(){
        this.setState({ loaded: true })
        // console.log("State 1:", this.state.data)
        let id = this.props.match.params.id
        let params= {
            search_type:'HISTORY',
            donation_item_id:this.props.match.params.id
        }
        // let id = '986ff19a-cbbb-4076-9258-eddfa5300419'
        let res = await DonarService.getDonationItembyID2(params)
        if (res.status == 200) {
            console.log('RES2',res.data?.view?.data)
            let donation_his = this.state.donation_his

            res.data.view.data.forEach(element => {
                if (element.type == "Created") {
                    donation_his.createdBy.name = element.actionby.name
                    donation_his.createdBy.designation = element.actionby.designation
                    donation_his.createdBy.date = element.createdAt
                    donation_his.createdBy.time = element.createdAt

                } else if(element.type == "Submitted to CIU"){
                    donation_his.sco_approve.name = element.actionby.name
                    donation_his.sco_approve.designation = element.actionby.designation
                    donation_his.sco_approve.date = element.createdAt
                    donation_his.sco_approve.time = element.createdAt
                }
                else if(element.type == "Submitted to HSCO"){
                    donation_his.ciu_approve.name = element.actionby.name
                    donation_his.ciu_approve.designation = element.actionby.designation
                    donation_his.ciu_approve.date = element.createdAt
                    donation_his.ciu_approve.time = element.createdAt
                }
                else if(element.type == "Submitted to AD"){
                    donation_his.hsco_approve.name = element.actionby.name
                    donation_his.hsco_approve.designation = element.actionby.designation
                    donation_his.hsco_approve.date = element.createdAt
                    donation_his.hsco_approve.time = element.createdAt
                }
                else if(element.type == "Approved by AD"){
                    donation_his.ad_approve.name = element.actionby.name
                    donation_his.ad_approve.designation = element.actionby.designation
                    donation_his.ad_approve.date = element.createdAt
                    donation_his.ad_approve.time = element.createdAt
                }
            });
            this.setState({
                donation_his:donation_his
            },
            // console.log('donation_his',donation_his)
            )
        }

    }

    async approvalProcess() {
        let id = this.props.match.params.id
        let donation_id = this.state.donation_item_id
        console.log("FormData",this.state.donation_item_id)
        console.log("FormData 2",this.state.itemBatches)
        let userInfo = await localStorageService.getItem('userInfo')
        
        if ( userInfo.roles.includes('Chief Pharmacist') ) {
            let data = {
                created_by:userInfo.id,
                status:"Submitted to Director",
                // status:" ",
                donation_item_id:this.props.match.params.id,
            }
            console.log("data",data)
            let res = await DonarService.editDonationItemDetails(id,data)
            console.log("res", res)
            if (res.status) {
                console.log("res", res)
                this.setState({
                    snackbar:true,
                    snackbar_severity: 'success',
                    snackbar_message: "Successfully Saved "
                }, () => {
                    window.location.href='/donation/view-donations'
                })
            } else {
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: "Cannot Save Data "
                })
            }

        }else{
            let data = {
                created_by:userInfo.id,
                status:"Submitted to CIU",
                // status:" ",
                donation_item_id:this.props.match.params.id,
            }
            console.log("data",data)
            let res = await DonarService.editDonationItemDetails(id,data)
            console.log("res", res)
            if (res.status) {
                console.log("res", res)
                this.setState({
                    snackbar:true,
                    snackbar_severity: 'success',
                    snackbar_message: "Successfully Saved "
                }, () => {
                    window.location.href='/donation/view-donations'
                })
            } else {
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: "Cannot Save Data "
                })
            }
        }
      

    }

    async loadAllUoms() {
       
        let params = { limit: 10000, page: 0 }
        // let id = '8bd682e3-ab0a-400d-afb1-25fb606eebc9'
        // console.log(id)
        let res = await ConsignmentService.getUoms(params)
        let id = this.props.match.params.id
        if (res.status) {
            console.log('all uoms', res.data.view.data)
            this.setState(
                {
                    all_uoms: res.data.view.data,
                },
               
            )
        }
    }
    addNewBatch() {
        let itemBatches = this.state.itemBatches;
        let batch_details = itemBatches;     
        itemBatches.push({
                        batch_no: null,
                        Manufacture_date: null,
                        expiary_date: null,
                        received_quantity: null,
                        invoice_quantity: null,
                        short_excess_quantity: null,
                        damage_quantity: null,
                        unit_value: null,
                        value_usd: null,
                        uom_id: null,
                        width: null,
                        height: null,
                        length: null,
                        net_weight: null,
                        gross_weight: null,
                        packaging_details: [
                            {
                                package_uom_id: null,
                                packet_level: null,
                                packet_size: null,
                                package_qunatity: null,
                                conversion: null,
                                value_metrices: null,
                            },
                        ]
        })
        itemBatches = batch_details;
        this.setState({ itemBatches })
    }
    async componentDidMount() {
        
        let donar_id =this.props.match.params.donar_id
        let id = this.props.match.params.id
        console.log('NOTE ID', id)
        console.log('NOTE ID2', donar_id)
        let userInfo = await localStorageService.getItem('userInfo')
        console.log('NOTE ID', userInfo)
        this.setState({
            userInfo : userInfo
        })
        this.loadHistory()
        this.LoadDataByID(donar_id)
        this.loadAllUoms()
        this.loadDonationItem()
    }
    async LoadAllManufacturers() {
        let params = {}

        let res = await HospitalConfigServices.getAllManufacturers(params)
        if (res.status) {
            console.log("all Manufacturers", res.data.view.data)
            this.setState({
                all_manufacturers: res.data.view?.data,
            },
           )
        }
    }delete_ItembatchRow

    
    async removeRow(i,value,id) {
        let itemBatches = this.state.itemBatches
        let index3 = itemBatches[i].packaging_details.indexOf(value)
        if(id === null || id === undefined) {
            itemBatches[i].packaging_details.splice(index3,1)
            this.setState({
                deleteConfirm:false
            })
        }
        else{
            let res = await DonarService.delete_ItembatchRow(id)
            console.log("res.data", res.data);
            if (res.status) {
                if (res.data.view == "data deleted successfully.") {
                    itemBatches[i].packaging_details.splice(index3,1)
                    this.setState({
                        Loaded: true,
                        alert: true,
                        message: res.data.view,
                        severity: 'success',
                        deleteConfirm:false
                    })
                }
                // window.location.reload()
                // this.loadOrderList(this.state.filterData)
            } else {
                this.setState(
                    { alert: true, message: "Order Could Not be Deleted. Please Try Again", severity: 'error',itemBatches }
                )
            }
        }
        console.log("row",i,value,id)
       
        
        // formData.batch_details[index].packaging_details[index2][name] = value.id
       
        // let formData = this.state.formData
        // formData.batch_details[i].packaging_details.delete(row)
      
    }
    async onChangeUomValueConversion(index, name, value, index2) {
        let itemBatches = this.state.itemBatches

        itemBatches[index].packaging_details[index2][name] = value
        // let all_uoms = this.state.all_uoms
                                                                            
        // if (name === 'package_qunatity') {
        //  itemBatches[index].packaging_details[index2].conversion = itemBatches[index].packaging_details[index2][name];
          
            // itemBatches[index].packaging_details[index2].forEach((element, index) => {
                if (index2 === 0) {
                    itemBatches[index].packaging_details[index2].conversion = itemBatches[index].packaging_details[index2][name];
                } else {
                    itemBatches[index].packaging_details[index2].conversion = itemBatches[index].packaging_details[index2-1].conversion 
                    + 'X' + itemBatches[index].packaging_details[index2][name] / itemBatches[index].packaging_details[index2-1][name]
                }
            // });

        // }

        this.setState({ itemBatches })
    }


    // async createDonationItems() {
    //     let id = this.props.match.params.id
    //     let donation_id = this.state.donation_item_id
    //     console.log("FormData",this.state.donation_item_id)
    //     console.log("FormData 2",this.state.itemBatches)
    //     // let res = await DonarService.createDonationItem(this.state.formData);
    //     // console.log("res",res)
    //     // if (res.status === 201) {
    //     //     this.setState({
    //     //         alert: true,
    //     //         message: 'Donation Item Created successfully!',
    //     //         severity: 'success',
    //     //     },()=> {
    //     //         window.location.reload()
    //     //     })
    //     // } else {
    //     //     this.setState({
    //     //         alert: true,
    //     //         message: 'Donation Item Creation was unsuccessful!',
    //     //         severity: 'error',
    //     //     })
    //     // }
    //     let userInfo = await localStorageService.getItem('userInfo')

    //     let itemBatches = this.state.itemBatches
    //     let formData =this.state.formData
    //     itemBatches.approval = 'Pending'
    //     // 'Submitted to HSCO'
    //     itemBatches.donation_id= this.props.match.params.id
    //     itemBatches.name= formData.name
    //     itemBatches.item_id=formData.item_id
    //     itemBatches.total_quantity= formData.total_quantity
    //     itemBatches.batch_count= formData.batch_count
    //     itemBatches.created_by=userInfo.id
    //     console.log("itemBatches",this.state.itemBatches)
    //     let res = await DonarService.editDonationItemDetails(id,itemBatches)
    //     console.log("res", res)
    //     if (res.status == 200) {
    //         console.log("res", res)
    //         this.setState({
    //             snackbar:true,
    //             snackbar_severity: 'success',
    //             snackbar_message: "Successfully Saved "
    //         }, () => {
    //             // window.location.reload()
    //         })
    //     } else {
    //         this.setState({
    //             snackbar: true,
    //             snackbar_severity: 'error',
    //             snackbar_message: "Cannot Save Data "
    //         })
    //     }

    // }

    addNewUom(i) {
        let formData = this.state.formData
        let packaging_details = formData.batch_details[i].packaging_details
        packaging_details.push(
            {
                package_uom_id: null,
                packet_level: null,
                packet_size: null,
                package_qunatity: null,
                conversion: null,
                value_metrices: null,
            },
        )
        formData.batch_details[i].packaging_details = packaging_details

        this.setState({ formData })
    }
    editNewUom(i) {
        let itemBatches = this.state.itemBatches
        let packaging_details = itemBatches[i].packaging_details
        packaging_details.push(
            {
                package_uom_id: null,
                packet_level: null,
                packet_size: null,
                package_qunatity: null,
                conversion: null,
                value_metrices: null,
            },
        )
        itemBatches[i].packaging_details = packaging_details

        this.setState({ itemBatches })
    }
    async editBatch(i) {
        // this.setState({
        //     editBatch:false
        // })
        console.log('editBatch',i)
        // let id = this.props.match.params.id
        let data = i
        data.created_by =JSON.parse(localStorage.getItem('userInfo')).id
        data.donation_item_id = this.state.donation_item_id
        console.log('editBatch2',data)
        if(data.id == null){
            let res = await DonarService.createNewDonationBatch(data)
            console.log("Data" , res)
            if (res.status == 201) {
                this.setState({
                    alert: true,
                    message: 'Item Batch has been Added Successfully.',
                    severity: 'success',
                    editBatch:true
                },()=> {
                    window.location.reload()
                    // this.loadDonationItem()

                })
            } else {
                this.setState({
                    alert: true,
                    message: 'Cannot Add Item Batch ',
                    severity: 'error',
                })
            }
            
        }else{
            let res = await DonarService.editDonationItemBatches(data.id, data)
            console.log("Data" , res)
            if (res.status == 200) {
                this.setState({
                    alert: true,
                    message: 'Item has been Edited Successfully.',
                    severity: 'success',
                },()=> {
                    window.location.reload()

                })
            } else {
                this.setState({
                    alert: true,
                    message: 'Cannot Edit Item ',
                    severity: 'error',
                })
            }
        } 
      }
    

    async onChangeBatchValue(index, name, value) {
        let formData = this.state.formData
        formData.batch_details[index][name] = value
        this.setState({ formData })
    }
    async onChangeUomValue(index, name, value, index2) {
        let formData = this.state.formData
        formData.batch_details[index].packaging_details[index2][name] = value

        if (name === 'package_qunatity') {
        //  formData.batch_details[index].packaging_details[index2].conversion = formData.batch_details[index].packaging_details[index2][name];
          
            // formData.batch_details[index].packaging_details[index2].forEach((element, index) => {
                if (index2 === 0) {
                    formData.batch_details[index].packaging_details[index2].conversion = formData.batch_details[index].packaging_details[index2][name];
                } else {
                    formData.batch_details[index].packaging_details[index2].conversion = formData.batch_details[index].packaging_details[index2-1].conversion + 'X' + formData.batch_details[index].packaging_details[index2][name] / formData.batch_details[index].packaging_details[index2-1][name]
                }
            // });

        }

        this.setState({ formData })
    }
    //Edit
    async onEditBatchValue(index, name, value) {
        let itemBatches = this.state.itemBatches
        itemBatches[index][name] = value
        this.setState({ itemBatches })
    }

    async onEditUomValue(index, name, value, index2) {
        let itemBatches = this.state.itemBatches
        let all_uoms = this.state.all_uoms

        if(value != null){
            let index3 = this.state.all_uoms.indexOf(value)
            all_uoms[index3].selected = true
            let selectedIndex = all_uoms[index3].selectedIndex? all_uoms[index3].selectedIndex : []
            selectedIndex.push(index)
            all_uoms[index3].selectedIndex = selectedIndex
            // all_uoms[index3].indexNew = index
            itemBatches[index].packaging_details[index2][name] = value.id
            console.log("all_uoms",all_uoms)
            // this.state.all_uoms.splice(index,1)
            this.setState({
                all_uoms
            })
        }   else{
           let selectedValue =this.state.all_uoms.filter((val)=> val.id == itemBatches[index].packaging_details[index2][name])
            let index3 = this.state.all_uoms.indexOf(selectedValue[0])
            all_uoms[index3].selected = false
            let selectedIndex = all_uoms[index3].selectedIndex? all_uoms[index3].selectedIndex : []
            selectedIndex.splice(selectedIndex.indexOf(index))
            all_uoms[index3].selectedIndex = selectedIndex
            itemBatches[index].packaging_details[index2][name] =null
            // this.state.all_uoms.splice(index,1)
            this.setState({
                all_uoms
            })
        }
        
//    if(value != null){
//     let index3 = this.state.all_uoms.indexOf(value)
//     all_uoms[index3].selected = true
//   itemBatches[index].packaging_details[index2][name] = value.id
//     // this.state.all_uoms.splice(index,1)
//     this.setState({
//         all_uoms
//     })
//   }else{
//    let selectedValue =this.state.all_uoms.filter((val)=> val.id ==itemBatches[index].packaging_details[index2][name])
//     let index3 = this.state.all_uoms.indexOf(selectedValue[0])
//     all_uoms[index3].selected = false
//   itemBatches[index].packaging_details[index2][name] =null
//     // this.state.all_uoms.splice(index,1)
//     this.setState({
//         all_uoms
//     })
// }

        this.setState({ itemBatches })
    }

    async LoadDataByID(id) {
        this.setState({ loaded: false })
        // console.log("State 1:", this.state.data)
        let res = await DonarService.getDonationbyID(id)
        if (res.status == 200) {
            let backendData = {
                donation_id: res.data.view?.Donor?.donor_gen_id,
                address: res.data.view?.Donor?.address,
                donor_invoice_no: res.data.view?.donors_invoice_no,
                recevied_date: res.data.view?.received_date,
                donation_reg_no: res.data.view?.donation_reg_no,
                donors_invoice_date: res.data.view?.donors_invoice_date,
                donor_contact_no: res.data.view?.Donor?.contact_no,
                donor_name: res.data.view?.Donor?.name,
                donor_country: res.data.view?.Donor?.country,
                description: res.data.view?.Donor?.description,
                delivery_person: res.data.view?.delivery_person,
                delivery_person_contact_no:res.data.view?.delivery_person_contact_no,
            }
            this.setState(
                {
                    backendData: backendData,
                    loaded: true,
                },
              
                () => console.log('resdata', this.state.donation),
               
            )
        }
    }
    async loadDonationItem(){
        this.setState({ loading: false })
        
        // console.log("State 1:", this.state.data)
        let id = this.props.match.params.id
        // let id = '986ff19a-cbbb-4076-9258-eddfa5300419'
        this.LoadAllManufacturers()
        let res = await DonarService.getDonationItembyID(id)
        if (res.status == 200) {
            console.log('RES',res.data?.view)
            // let itemBatches = {
            //     donation_itemBatches : res.data?.view?.DonationItemsBatches
            // }
            let formData = this.state.formData
            formData.name =res.data?.view?.name
            formData.sr_no=res.data?.view?.itemdata?.sr_no
            formData.item_id = res.data?.view?.item_id == ''? null: res.data?.view?.item_id
            // '8ceb442a-4203-4284-8b78-b8ed2b3b1464'
            formData.item_name = res.data?.view?.itemdata?.long_description
            formData.status = res.data?.view?.status
            formData.manufacture_id = res.data?.view?.DonationItemsBatches[0]?.manufacture_id
            formData.total_quantity =res.data?.view?.total_quantity
            let donation_item_id = res.data?.view?.id
            let itemBatch = this.state.itemBatches
            console.log('itemb',this.state.itemBatches)
            console.log('formData',formData)
            // let packageDetails = this.state.itemBatches.packaging_details

            res.data.view.DonationItemsBatches.forEach(element => {
                let backend = {}
                backend.id = element?.id
                backend.batch_no = element?.batch_no
                backend.Manufacture_date = element?.Manufacture_date
                backend.expiary_date= element?.expiary_date
                backend.received_quantity=element?.received_quantity
                backend.invoice_quantity=element?.invoice_quantity
                backend.short_excess_quantity=element?.short_excess_quantity
                backend.damage_quantity=element?.damage_quantity
                backend.unit_value=element?.unit_value
                backend.value_usd=element?.value_usd
                backend.currency= element?.currency   
                backend.uom_id= element?.uom_id
                backend.width=element?.width
                backend.height=element?.height
                backend.length=element?.length
                backend.net_weight=element?.net_weight
                backend.gross_weight=element?.gross_weight
                backend.packaging_details=element?.PackagingItemsUOMs
                // backend.packaging_details=element?.PackagingItemsUOMs?.forEach(element2 => {
                //     backend.packet_size= element2.packet_size
                //     console.log('PackagingItemsUOMs',element2)
                // });
                itemBatch.push(backend)
            });
            console.log('itemb',itemBatch)
            this.setState({
                donation_item_id :donation_item_id,
                formData,
                itemBatches:itemBatch,
               
            },() => {
                console.log('item_id',this.state.formData.item_id)
                if(this.state.formData.item_id != null){
                    this.loadAllItembyID(this.state.formData.item_id)
                    
                }
                else{
                    
                    this.setState({
                        loading:true
                    })
                }
            }
            // console.log('itemb',this.state.itemBatches)
            )
           
            // loadedData.forEach((element) => {
            //     let loadGroups = {}
            //     loadGroups.name = element.code + '-' + element.name
            //     loadGroups.id = element.id
            //     loadGroups.code = element.code
            //     loadGroups.status = element.status
            //     loadGroup.push(loadGroups)
            // })
            // {
            //     batch_no: null,
           
            //     : null,
            //  
            //     : [
            //         {
            //             package_uom_id: null,
            //             packet_level: null,
            //             packet_size: null,
            //             package_qunatity: null,
            //             conversion: null,
            //             value_metrices: null,
            //         },
            //     ],
            // },

            
        }

    }
    // handleChange = (val) => {
    //     this.setState({
    //         formData: {
    //             ...this.state.formData,
    //             [val.target.name]: val.target.checked,
    //         },
    //     })
    // }
    async loadAllItems(search) {
        let data = {
            search: search
        }
      let filterData = this.state.filterData
      // this.setState({ loaded: false })
      let params = { limit: 10000, page: 0 }
      // let filterData = this.state.filterData
      let res = await InventoryService.fetchAllItems(data)
      console.log('all Items', res.data.view.data)

      if (res.status == 200) {
          this.setState({ sr_no: res.data.view.data,
            loading:true
         })
      }
      
  }

  //loading Item name by ID
  async loadAllItembyID(id) {
  let params = { }
  // let filterData = this.state.filterData
  let res = await InventoryService.fetchItemById(params,id)
//   console.log('Single Items', res.data.view)
  if (res.status == 200) {
    let sr_no = this.state.sr_no
     sr_no.push(res.data.view)
    this.setState({
        sr_no: sr_no,
        loading:true
     })
  }
  
}

    render() {
        const { classes } = this.props
        return (
            <MainContainer>
                {this.state.loaded ? (
                    <div>
                        <LoonsCard>
                            
                            <CardTitle title="Donation Registration Continue - Donation Note" />
                            <div className="pt-7"></div>
                            <ValidatorForm
            className="pt-2"
            onSubmit={() => null
            }
            onError={() => null}
            >                                <Grid container spacing={2}>
                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle
                                            title={"Donor's Invoice No"}
                                        ></SubTitle>
                                        <TextValidator
                                            className="w-full"
                                            //placeholder="Enter Donor's Invoice No"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            disabled={true}
                                            value={
                                                this.state.backendData
                                                    .donor_invoice_no
                                            }
                                            onChange={(e, value) => {
                                                let backendData =
                                                    this.state.backendData
                                                backendData.donor_invoice_no =
                                                    e.target.value
                                                this.setState({ backendData })
                                            }}
                                          
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle
                                            title={'Donation Receiving Date'}
                                        ></SubTitle>
                                        <DatePicker
                                            className="w-full"
                                            value={
                                                this.state.backendData
                                                    .recevied_date
                                            }
                                            //label="Date From"
                                            //placeholder="Enter Donation Received Date"
                                            // minDate={new Date()}
                                            //maxDate={new Date("2020-10-20")}
                                            required={true}
                                             disabled={true}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let backendData =
                                                    this.state.backendData
                                                backendData.recevied_date = date
                                                this.setState({ backendData })
                                            }}
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle
                                            title={'Donation Reg No'}
                                        ></SubTitle>
                                        <TextValidator
                                            className="w-full"
                                            //placeholder="Enter Donation Reg No"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            disabled={true}
                                            value={
                                                this.state.backendData
                                                    .donation_reg_no
                                            }
                                            onChange={(e, value) => {
                                                let backendData =
                                                    this.state.backendData
                                                backendData.donation_reg_no =
                                                    e.target.value
                                                this.setState({ backendData })
                                            }}
                                          
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle
                                            title={"Donor's Invoice Date"}
                                        ></SubTitle>
                                        <DatePicker
                                            className="w-full"
                                            value={
                                                this.state.backendData
                                                    .donors_invoice_date
                                            }
                                            //label="Date From"
                                            //placeholder="Enter Donation Received Date"
                                            // minDate={new Date()}
                                            //maxDate={new Date("2020-10-20")}
                                            required={true}
                                            disabled={true}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let backendData =
                                                    this.state.backendData
                                                backendData.donors_invoice_date =
                                                    date
                                                this.setState({ backendData })
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <br />
                                <hr />

                                <h5>Details of Donor or Institute</h5>

                                <Grid container spacing={2}>
                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={'Donor ID'}></SubTitle>
                                        <TextValidator
                                            className="w-full"
                                            //placeholder="Donor ID"
                                            fullWidth
                                            disabled={true}
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.backendData
                                                    .donation_id
                                            }
                                            onChange={(e, value) => {
                                                let backendData =
                                                    this.state.backendData
                                                backendData.donation_id =
                                                    e.target.value
                                                this.setState({ backendData })
                                            }}
                                           
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={'Address'}></SubTitle>
                                        <TextValidator
                                            className="w-full"
                                            //placeholder="Address"
                                            fullWidth
                                            disabled={true}
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.backendData.address
                                            }
                                            onChange={(e, value) => {
                                                let backendData =
                                                    this.state.backendData
                                                backendData.address =
                                                    e.target.value
                                                this.setState({ backendData })
                                            }}
                                           
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle
                                            title={'Donor Contact No'}
                                        ></SubTitle>
                                        <TextValidator
                                            className="w-full"
                                            //placeholder="Donor Contact No"
                                            fullWidth
                                            disabled={true}
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.backendData
                                                    .donor_contact_no
                                            }
                                            onChange={(e, value) => {
                                                let backendData =
                                                    this.state.backendData
                                                backendData.donor_contact_no =
                                                    e.target.value
                                                this.setState({ backendData })
                                            }}
                                           
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle
                                            title={'Donor Name'}
                                        ></SubTitle>
                                        <TextValidator
                                            className="w-full"
                                            //placeholder="Donor Name"
                                            fullWidth
                                            disabled={true}
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.backendData
                                                    .donor_name
                                            }
                                            onChange={(e, value) => {
                                                let backendData =
                                                    this.state.backendData
                                                backendData.donor_name =
                                                    e.target.value
                                                this.setState({ backendData })
                                            }}
                                          
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle
                                            title={'Donor Country'}
                                        ></SubTitle>
                                        <TextValidator
                                            className="w-full"
                                            //placeholder="Donor Country"
                                            fullWidth
                                            disabled={true}
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.backendData
                                                    .donor_country
                                            }
                                            onChange={(e, value) => {
                                                let backendData =
                                                    this.state.backendData
                                                backendData.donor_country =
                                                    e.target.value
                                                this.setState({ backendData })
                                            }}
                                           
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle
                                            title={'Description'}
                                        ></SubTitle>
                                        <TextValidator
                                            className="w-full"
                                            //placeholder="Enter Description"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            disabled={true}
                                            value={
                                                this.state.backendData
                                                    .description
                                            }
                                            onChange={(e, value) => {
                                                let backendData =
                                                    this.state.backendData
                                                backendData.description =
                                                    e.target.value
                                                this.setState({ backendData })
                                            }}
                                           
                                        />
                                    </Grid>
                                </Grid>
                                <br />
                                <hr />

                                <h5>Details of Delivery Person</h5>

                                <Grid container spacing={2}>
                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle
                                            title={'Delivery Person'}
                                        ></SubTitle>
                                        <TextValidator
                                            className="w-full"
                                            //placeholder="Delivery Person"
                                            fullWidth
                                            disabled={true}
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.backendData
                                                    .delivery_person
                                            }
                                            onChange={(e, value) => {
                                                let backendData =
                                                    this.state.backendData
                                                backendData.delivery_person =
                                                    e.target.value
                                                this.setState({ backendData })
                                            }}
                                          
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle
                                            title={'Delivery Person Contact No'}
                                        ></SubTitle>
                                        <TextValidator
                                            className="w-full"
                                            //placeholder="Delivery Person Contact No"
                                            fullWidth
                                            disabled={true}
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.backendData
                                                    .delivery_person_contact_no
                                            }
                                            onChange={(e, value) => {
                                                let backendData =
                                                    this.state.backendData
                                                backendData.delivery_person_contact_no =
                                                    e.target.value
                                                this.setState({ backendData })
                                            }}
                                          
                                        />
                                    </Grid>
                                </Grid>
                                <br />
                                <hr />
                                <div
                                    className=" px-5 py-5 mt-4"
                                    style={{ backgroundColor: '#fef1e0' }}
                                >
                                    <Grid container className="mb-7">
                                        <Grid container spacing={2}>
                                            {/* <Grid
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle
                                                    title={'Item Name'}
                                                ></SubTitle>
                                                <TextValidator
                                                    className="w-full"
                                                    placeholder="Item Name"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state.formData
                                                            .name
                                                    }
                                                    onChange={(e, value) => {
                                                        let formData =
                                                            this.state.formData
                                                        formData.name =
                                                            e.target.value
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }}
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                />
                                            </Grid> */}
                                        {this.state.loading || this.state.formData.item_id ==null ? 
                                        <>
                               <Grid item lg={3} md={3} sm={12} xs={12}>
                                
                                <SubTitle title="SR No" />
                                <Autocomplete
                                    // disableClearable
                                    className="w-full"
                                    value={
                                        this.state.formData.name !=null ? {medium_description :this.state.formData.name ,sr_no:this.state.formData.sr_no }:null||
                                        this.state.sr_no.find((v) => v.id == this.state.formData.item_id) || this.state.formData.name
                                    }
                                    // options={this.state.sr_no}
                                    options={this.state.sr_no}
                                    onChange={(e, value) => {
                                        if (value != null) {
                                            let formData = this.state.formData;
                                            formData.sr_no = value.sr_no;
                                            // formData.name =value.medium_description;
                                            formData.item_id = value.id;
                                            console.log('SR no',formData)
                                            this.setState({ 
                                                formData,
                                                // srNo:true
                                            })
                                            // let formData = this.state.formData;
                                            // formData.sr_no = value;
                                           
                                        } else if(value == null) {
                                            let formData = this.state.formData;
                                            formData.name=null;
                                            formData.item_id = null;
                                            formData.sr_no = null;
                                            this.setState({
                                                 formData,
                                                // srNo:false
                                            })
                                        }
                                    }}
                                    getOptionLabel={(option) =>
                                        option.sr_no !== ''? option.sr_no: null
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
                                            placeholder="SR No"
                                            fullWidth
                                            value={
                                             this.state.formData.item_id == null ? {sr_no:this.state.formData?.sr_no}:null
                                            }
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                console.log("as", e.target.value)
                                                if (e.target.value.length > 4) {
                                                    this.loadAllItems(e.target.value)
                                                    let formData =this.state.formData
                                                    // formData.name = e.target.value

                                                    this.setState({
                                                        formData,
                                                       
                                                   })
                                                }
                                            }}
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

                               <Grid item lg={3} md={3} sm={12} xs={12}>
                                
                                <SubTitle title="Item Name" />
                                <Autocomplete
                                    // disableClearable
                                    className="w-full"
                                    value={
                                        this.state.formData.name !=null ? {medium_description :this.state.formData.name}:null||
                                        this.state.sr_no.find((v) => v.id == this.state.formData.item_id) || this.state.formData.name
                                    }
                                    // options={this.state.sr_no}
                                    options={this.state.sr_no}
                                    onChange={(e, value) => {
                                        if (value != null) {
                                            let formData = this.state.formData;
                                            // formData.sr_no = value.sr_no;
                                            formData.name =value.medium_description;
                                            formData.item_id = value.id;
                                            // console.log('SR no',formData)
                                            this.setState({ 
                                                formData,
                                                // srNo:true
                                            })
                                            // let formData = this.state.formData;
                                            // formData.sr_no = value;
                                           
                                        } else if(value == null) {
                                            let formData = this.state.formData;
                                            formData.name=null;
                                            formData.item_id = null;
                                            // formData.sr_no = null;
                                            this.setState({
                                                 formData,
                                                // srNo:false
                                            })
                                        }
                                    }}
                                    getOptionLabel={(option) =>
                                        option.medium_description !== ''? option.medium_description :null
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
                                            placeholder="Item Name"
                                            fullWidth
                                            value={
                                             this.state.formData.item_id == null||this.state.formData.name !=null ? {medium_description :this.state.formData.name ,sr_no:this.state.formData?.sr_no}:null
                                            }
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                console.log("as", e.target.value)
                                                if (e.target.value.length > 4) {
                                                    this.loadAllItems(e.target.value)
                                                   
                                                }
                                                let formData =this.state.formData
                                                formData.name = e.target.value

                                                this.setState({
                                                    formData,
                                                   
                                               })
                                            }}
                                            validators={[
                                                'required',
                                            ]}
                                            errorMessages={[
                                                'This field is required',                                                
                                            ]}
                                        />
                                    )}
                                />
                            </Grid>
                            {this.state.formData.item_id == null || this.state.formData.item_id === ''?
                                                                                                 <Grid item
                                                                                                 className="ml-2">
                                                                                                <Button
                                                                                                    className="mr-2 mt-6"
                                                                                                    // progress={true}
                                                                                                    disabled={this.state.formData.item_id == null ? false : true}
                                                                                                    type="submit"
                                                                                                    scrollToTop={true}
                                                                                                    onClick={() => {
                                                                                                        this.setState({
                                                                                                            requestDialog:true
                                                                                                        })
                                                                                                      console.log('Sr requested')
                                                                                                    }}
                                                                                                >
                                                                                                    <span className="capitalize">
                                                                                                        Request SR Number
                                                                                                    </span>
                                                                                                </Button>
                                                                                            </Grid>
                                               
                                                :null}

                            <Grid
                                                                    item
                                                                    lg={3}
                                                                    md={3}
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
                                                                               )}  */
                                                                        getOptionLabel={(
                                                                            option
                                                                        ) =>
                                                                        option.name ? option.name : ''
                                                                        }
                                                                        // value={
                                                                        //     this.state.formData.manufacture_id
                                                                        // }
                                                                        /*  getOptionSelected={(option, value) =>
                                                                                  console.log("ok")
                                                                              } */

                                                                        value={this.state.all_manufacturers?.find((v) =>v.id == this.state.formData.manufacture_id
                                                                                )}
                                                                        onChange={(event, value ) => {
                                                                            if (value != null) {
                                                                                let formData = this.state.formData;
                                                                                formData.manufacture_id =value.id;
                                                                                // formData.item_id = value.id;
                                                                                console.log('SR no',formData)
                                                                                this.setState({ 
                                                                                    formData,
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
                                                                                // value={this.state.all_manufacturers.find((v) => v.id == this.state.formData.manufacture_id
                                                                                // )}
                                                                                fullWidth
                                                                                value={
                                                                                    this.state.formData.item_id == null|| this.state.formData.manufacture_id !=null ? {name :this.state.formData.manufacture_id, sr_no:this.state.formData?.sr_no}:null
                                                                                }
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onChange={(e) => {
                                                                                    console.log("as", e.target.value)
                                                                                    if (e.target.value.length > 4) {
                                                                                        this.loadAllItems(e.target.value)
                                                                                        let formData =this.state.formData
                                                                                        formData.manufacture_id = e.target.value
                                    
                                                                                        this.setState({
                                                                                            formData,
                                                                                           
                                                                                       })
                                                                                    }
                                                                                }}
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

                                            {/* <Grid
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle
                                                    title={'Item Description'}
                                                ></SubTitle>
                                                <TextValidator
                                                    className="w-full"
                                                    placeholder="Item Description"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state.formData
                                                            .item_description
                                                    }
                                                    onChange={(e, value) => {
                                                        let formData =
                                                            this.state.formData
                                                        formData.item_description =
                                                            e.target.value
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }}
                                                    // validators={['required']}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                />
                                            </Grid> */}
                                        </>
                                        : null }
                                        </Grid>
                                    </Grid>
                                    {this.state.itemBatches.length !== 0 ?
                                    <div>
                                     {this.state.itemBatches.map(
                                        (items, i) => (
                                            <Grid container spacing={2}>
                                                <Grid
                                                    // className='mt-2'
                                                    item
                                                    lg={2}
                                                    md={2}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                  
                                                        <SubTitle
                                                            title={
                                                                'Batch Number'
                                                            }
                                                        ></SubTitle>
                                                  
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Batch Number"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.itemBatches[
                                                                i
                                                            ].batch_no
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onEditBatchValue(
                                                                i,
                                                                'batch_no',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            'required',
                                                          
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                            
                                                        ]}
                                                    />
                                                    <p>{items.level}</p>
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={2}
                                                    md={2}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                  
                                                        <SubTitle
                                                            title={'EXP'}
                                                        ></SubTitle>
                                                   

                                                    <DatePicker
                                                        className="w-full"
                                                        value={
                                                            this.state.itemBatches[
                                                                i
                                                            ].expiary_date
                                                        }
                                                        placeholder="EXP"
                                                        minDate={this.state.itemBatches[i].Manufacture_date}
                                                        //maxDate={new Date()}
                                                        errorMessages="This field is required"
                                                        onChange={(date) => {
                                                            this.onEditBatchValue(
                                                                i,
                                                                'expiary_date',
                                                                dateParse(date)
                                                            )
                                                        }}
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
                                                            title={'MFD'}
                                                        ></SubTitle>
                                                   

                                                    <DatePicker
                                                        className="w-full"
                                                        value={
                                                            this.state.itemBatches[
                                                                i
                                                            ].Manufacture_date
                                                        }
                                                        placeholder="MFD"
                                                        // minDate={new Date()}
                                                        //maxDate={new Date()}
                                                        errorMessages="This field is required"
                                                        onChange={(date) => {
                                                            this.onEditBatchValue(
                                                                i,
                                                                'Manufacture_date',
                                                                dateParse(date)
                                                            )
                                                        }}
                                                    />

                                                    {/* <TextValidator
                                    className='w-full'
                                    placeholder="MFD"
                                    //variant="outlined"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .batch_details[i].mfd
                                    }
                                    onChange={(e, value) => {
                                        this.onEditBatchValue(i, 'mfd', e.target.value)

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                /> */}
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
                                                                'Invoiced Quantity'
                                                            }
                                                        ></SubTitle>
                                                   
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Invoiced Quantity"
                                                        //variant="outlined"
                                                        fullWidth
                                                        type='number'
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.itemBatches[
                                                                i
                                                            ].invoice_quantity
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            let total_qantitiy =
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                )
                                                            this.state.itemBatches.forEach((element,index) => {
                                                                    if (index !=i) {
                                                                        total_qantitiy = parseFloat(total_qantitiy) + parseFloat( this.state.itemBatches[index].invoice_quantity)
                                                                    }
                                                                }
                                                            )

                                                            if (parseFloat(this.state.itemBatches[i].invoice_quantity) >= total_qantitiy) {
                                                                this.onEditBatchValue(i, 'invoice_quantity', e.target.value)

                                                                let itemBatches = this.state.itemBatches
                                                                itemBatches[i].no_of_pack = e.target.value / itemBatches.volume_factor

                                                            } else {
                                                                this.onEditBatchValue(i, 'invoice_quantity', e.target.value)
                                                                this.setState({
                                                                    snackbar: true,
                                                                    snackbar_severity: 'error',
                                                                    snackbar_message: "Cannot Over the Order Quantity"
                                                                })
                                                            }
                                                        }}
                                                        validators={[
                                                            'required',
                                                            'minNumber: 00',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                            'Quantity Should Greater-than: 01 ',
                                                        ]}
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
                                                                'Recieved Quantity'
                                                            }
                                                        ></SubTitle>
                                                   
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Recieved Quantity"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        type='number'
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
                                                        value={
                                                            this.state.itemBatches[i].received_quantity
                                                        }
                                                  
                                                        onChange={(e,value) => {
                                                            let total_quantity =parseFloat(e.target.value)
                                                            let itemBatches = this.state.itemBatches
                                                            console.log('short',e.target.value)
                                                        //calculation short/excess
                                                        this.state.itemBatches.forEach((element,index ) => {
                                                            let shortExcess2 = e.target.value - parseFloat(itemBatches[index].invoice_quantity)
                                                            itemBatches[index].short_excess_quantity = shortExcess2
                                                            console.log('short',e.target.value)
                                                                        this.setState({
                                                                            itemBatches
                                                                        })
                                                                    
                                                                }
                                                            )                                                                                                    
                                                           
                                                            //calculation total quanitity       
                                                            if( this.state.itemBatches.length <= 1){
                                                                this.state.formData.total_quantity = total_quantity
                                                            }else{
                                                                this.state.itemBatches.forEach((element,index ) => {
                                                                     if (index != i)
                                                                      {total_quantity =parseFloat(total_quantity) + parseFloat(element.received_quantity )
                                                                        this.state.formData.total_quantity = total_quantity
                                                                                    this.setState({
                                                                                        itemBatches
                                                                                    })
                                                                                }
                                                                            }
                                                                        )
                                                            }
                                                                // this.state.itemBatches.forEach(
                                                                //     (element,index ) => {
                                                                //         let formData = this.state.formData
    
                                                                //         if (index != i) {total_quantity =parseFloat(total_quantity) + parseFloat( this.state.itemBatches[index].received_quantity )
                                                                //             formData.total_quantity = total_quantity
                                                                //             this.setState({
                                                                //                 formData
                                                                //             })
                                                                //         }
                                                                //     }
                                                                // )     
                                                            // this.state.itemBatches.forEach(
                                                            //     (
                                                            //         element,
                                                            //         index
                                                            //     ) => {
                                                            //         if (index != i) {total_qantitiy =parseFloat(total_qantitiy) +
                                                            //                 parseFloat(
                                                            //                     this.state.itemBatches[index].received_quantity
                                                            //                 )
                                                            //         }
                                                            //     }
                                                            // )
                                                            this.onEditBatchValue(i, 'received_quantity', e.target.value)
                                                            this.onEditBatchValue(i, 'short_excess_quantity', (e.target.value - parseFloat(this.state.itemBatches[i].invoice_quantity)))

                                                            // if (parseFloat(this.state.itemBatches[i].received_quantity) >= total_quantity) {

                                                            //     let itemBatches = this.state.itemBatches
                                                            //     itemBatches.batch_details[i].no_of_pack = e.target.value / itemBatches.volume_factor

                                                            // } else {
                                                            //     this.onEditBatchValue(i, 'received_quantity', e.target.value)
                                                            //     this.setState({
                                                            //         snackbar: true,
                                                            //         snackbar_severity: 'error',
                                                            //         snackbar_message: "Cannot Over the Order Quantity"
                                                            //     })
                                                            // }
                                                        }}
                                                        validators={[
                                                            'required',
                                                            'minNumber: 00',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                            'Quantity Should Greater-than: 01 ',
                                                        ]}
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
                                                                'Short/Excess'
                                                            }
                                                        ></SubTitle>
                                                    
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Short/Excess"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        type='number'
                                                        disabled={true}
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
                                                         // value={this.state.itemBatches[i].received_quantity - this.state.itemBatches[i].invoice_quantity }

                                                         value={
                                                             this.state.itemBatches[i].short_excess_quantity
                                                         }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onEditBatchValue(
                                                                i,
                                                                'short_excess_quantity',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            // 'required',
                                                            
                                                        ]}
                                                        errorMessages={[
                                                            // 'This field is required',
                                                           
                                                        ]}
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
                                                            title={'Damage'}
                                                        ></SubTitle>
                                                  
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Damage"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        type='number'
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
                                                        value={
                                                            this.state.itemBatches[
                                                                i
                                                            ].damage_quantity
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onEditBatchValue(
                                                                i,
                                                                'damage_quantity',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            // 'required',
                                                            'minNumber: 00',
                                                        ]}
                                                        errorMessages={[
                                                            // 'This field is required',
                                                            'Quantity Should Greater-than: 01 ',
                                                        ]}
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
                                                            title={'Unit Value'}
                                                        ></SubTitle>
                                                   
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Unit Value"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        type='number'
                                                        value={
                                                            this.state.itemBatches[
                                                                i
                                                            ].unit_value
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            let unit_value = parseFloat( e.target.value )
                                                            let formData = this.state.formData
                                                            let itemBatches = this.state.itemBatches
                                                            itemBatches[i].value_usd = e.target.value * this.state.itemBatches[i].received_quantity
                                                            this.setState({
                                                                itemBatches
                                                            })

                                                            this.onEditBatchValue(
                                                                i,
                                                                'unit_value',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            'required',
                                                            'minNumber: 00',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                            'Quantity Should Greater-than: 01 ',
                                                        ]}
                                                    />
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={2}
                                                    md={2}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                   
                                                   <SubTitle title={"Value(Received x Unit Price)"}></SubTitle>
                                                    
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Value"
                                                        //variant="outlined"
                                                        fullWidth
                                                        disabled={true}
                                                        variant="outlined"
                                                        size="small"
                                                        type='number'
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
                                                        value={
                                                            this.state.itemBatches[
                                                                i
                                                            ].value_usd
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onEditBatchValue(
                                                                i,
                                                                'value_usd',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            'required',
                                                            'minNumber: 00',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                            'Quantity Should Greater-than: 01 ',
                                                        ]}
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
                                                                                'Currency'
                                                                            }
                                                                        ></SubTitle>                                                                 
                                                                    <Autocomplete
                                        disableClearable
                                                                        className="w-full"
                                                                        options={appConst.all_currencies
                                                                        }
                                                                        /*  defaultValue={this.setState.all_uoms.find(
                                                                                   (v) => v.value == ''
                                                                               )}  */
                                                                        getOptionLabel={(
                                                                            option
                                                                        ) =>
                                                                            option.cc +'-'+option.name
                                                                        }
                                                                        /*  getOptionSelected={(option, value) =>
                                                                                  console.log("ok")
                                                                              } */

                                                                              value={appConst.all_currencies.find(
                                                                                (
                                                                                    v
                                                                                ) =>
                                                                                    v.name === this.state.itemBatches[i].currency
                                                                            )}
                                                                        onChange={(
                                                                            event,
                                                                            value
                                                                        ) => {
                                                                            this.onEditBatchValue(
                                                                                i,
                                                                                'currency',
                                                                                value.name,
                                                                                
                                                                            )
                                                                        }}
                                                                      
                                                                        renderInput={(
                                                                            params
                                                                        ) => (
                                                                            <TextValidator
                                                                                {...params}
                                                                                placeholder="Currency"
                                                                                //variant="outlined"
                                                                                // value={
                                                                                // this.state.itemBatches[i].currency}
                                                                                value={appConst.all_currencies.find(
                                                                                    (
                                                                                        v
                                                                                    ) =>
                                                                                        v.name === this.state.itemBatches[i].currency
                                                                                )}
                                                                                fullWidth
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
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

                                                <Grid
                                                                    item
                                                                    lg={2}
                                                                    md={2}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                        <SubTitle
                                                                            title={
                                                                                'UOM'
                                                                            }
                                                                        ></SubTitle>                                                                 
                                                                    <Autocomplete
                                        disableClearable
                                                                        className="w-full"
                                                                        options={
                                                                            this
                                                                                .state
                                                                                .all_uoms
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

                                                                         value={this.state.all_uoms.find(
                                                                             (v) =>
                                                                                 v.id ==
                                                                                 this.state.itemBatches[i].uom_id
                                                                         )}
                                                                        onChange={(
                                                                            event,
                                                                            value
                                                                        ) => {
                                                                            this.onEditBatchValue(
                                                                                i,
                                                                                'uom_id',
                                                                                value.id,
                                                                                
                                                                            )
                                                                        }}
                                                                      
                                                                        renderInput={(
                                                                            params
                                                                        ) => (
                                                                            <TextValidator
                                                                                {...params}
                                                                                placeholder="UOM"
                                                                                //variant="outlined"
                                                                                //value={}
                                                                                value={this.state.all_uoms.find(
                                                                                    (
                                                                                        v
                                                                                    ) =>
                                                                                        v.id === this.state.itemBatches[i].uom_id
                                                                                )}
                                                                                fullWidth
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                variant="outlined"
                                                                                size="small"
                                                                                validators={[
                                                                                    'required',
                                                                                ]}
                                                                                errorMessages={[
                                                                                    'This field is required',
                                                                                ]}
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
                                                        title={'Height(CM)'}
                                                    ></SubTitle>
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Height(CM)"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        type='number'
                                                        
                                                        value={
                                                            this.state.itemBatches[
                                                                i
                                                            ].height
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onEditBatchValue(
                                                                i,
                                                                'height',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            // 'required',
                                                            'minNumber: 00',
                                                        ]}
                                                        errorMessages={[
                                                            // 'This field is required',
                                                            'Quantity Should Greater-than: 01 ',
                                                        ]}
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
                                                        title={'Width(CM)'}
                                                    ></SubTitle>
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Width(CM)"
                                                        fullWidth
                                                        type='number'
                                                        
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.itemBatches[
                                                                i
                                                            ].width
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onEditBatchValue(
                                                                i,
                                                                'width',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            // 'required',
                                                            'minNumber: 00',
                                                        ]}
                                                        errorMessages={[
                                                            // 'This field is required',
                                                            'Quantity Should Greater-than: 01 ',
                                                        ]}
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
                                                        title={'Length(CM)'}
                                                    ></SubTitle>
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Length(CM)"
                                                        fullWidth
                                                        type='number'
                                                        variant="outlined"
                                                        size="small"
                                                        
                                                        value={
                                                            this.state.itemBatches[
                                                                i
                                                            ].length
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onEditBatchValue(
                                                                i,
                                                                'length',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            // 'required',
                                                            'minNumber: 00',
                                                        ]}
                                                        errorMessages={[
                                                            // 'This field is required',
                                                            'Quantity Should Greater-than: 01 ',
                                                        ]}
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
                                                        title={'Net.Weight(Kg)'}
                                                    ></SubTitle>
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Net.Weight"
                                                        fullWidth
                                                        type='number'
                                                        variant="outlined"
                                                        size="small"
                                                        
                                                        value={
                                                            this.state.itemBatches[
                                                                i
                                                            ].net_weight
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onEditBatchValue(
                                                                i,
                                                                'net_weight',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            // 'required',
                                                            'minNumber: 00',
                                                        ]}
                                                        errorMessages={[
                                                            // 'This field is required',
                                                            'Quantity Should Greater-than: 01 ',
                                                        ]}
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
                                                        title={'Gross.Weight(Kg)'}
                                                    ></SubTitle>
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Gross.Weight"
                                                        fullWidth
                                                        type='number'
                                                        min="1"
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.itemBatches[
                                                                i
                                                            ].gross_weight
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onEditBatchValue(
                                                                i,
                                                                'gross_weight',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            // 'required',
                                                            'minNumber: 00',
                                                        ]}
                                                        errorMessages={[
                                                            // 'This field is required',
                                                            'Quantity Should Greater-than: 01 ',
                                                        ]}
                                                        
                                                    />
                                                </Grid>
                                                <br />
                                                <Grid container spacing={2}>
                                              
                                                    {/* second map */}
                                                    {items.packaging_details.map(
                                                        (item2, index2) => (
                                                            <>
                                                                                                                        <Grid
                                                                container
                                                                spacing={2}
                                                                className='mt-2 mt-1'
                                                                style={{ backgroundColor: '#90EE90' }}
                                                            >
                                                                  <Grid
                                                                    item
                                                                    lg={1}
                                                                    md={1}
                                                                    sm={12}
                                                                    xs={12}
                                                                    className='ml-4'
                                                                >
                                                                    {index2 == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Action'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) :   <IconButton size="small" color="primary" aria-label="view"
                                                                    disabled={this.state.formData.status === 'Submitted to HSCO' || this.state.formData.status === "Submitted to AD"|| this.state.formData.status === "Approved by AD" || this.state.formData.status === "GRN Request Sent"  || this.state.formData.status === "COMPLETED"?true :false}

                                                                    onClick={() => {
                                                                        this.setState({
                                                                            deleteConfirm:true,
                                                                            batchIndex:i,
                                                                            packageID:items.packaging_details[index2].id,
                                                                            packageIndex:index2
                                                                            
                                                                        })
                                                                        // this.removeRow(i,index2,items.packaging_details[index2].id)
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
                                                                    {index2 == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Pack Size'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}
                                                                   
                                                                        {'Level ' +
                                                                            (index2+1)}
                                                                    
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    lg={2}
                                                                    md={2}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    {index2 == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'UOM'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}
                                                                    <Autocomplete
                                        disableClearable
                                                                        className="w-full"
                                                                        options={
                                                                            this.state.all_uoms.filter((value) => (!value.selectedIndex?.includes(i))) 
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

                                                                         value={this.state.all_uoms.find(
                                                                             (v) =>
                                                                                 v.id ==
                                                                                 items.packaging_details[index2].package_uom_id
                                                                         )}
                                                                        onChange={(
                                                                            event,
                                                                            value
                                                                        ) => {
                                                                            this.onEditUomValue(
                                                                                i,
                                                                                'package_uom_id',
                                                                                value,
                                                                                index2
                                                                            )
                                                                        }}
                                                                        renderInput={(
                                                                            params
                                                                        ) => (
                                                                            <TextValidator
                                                                                {...params}
                                                                                placeholder="UOM"
                                                                                //variant="outlined"
                                                                                //value={}
                                                                                value={this.state.all_uoms.find(
                                                                                    (
                                                                                        v
                                                                                    ) =>
                                                                                        v.id ===
                                                                                        items.packaging_details[index2].package_uom_id
                                                                                )}
                                                                                fullWidth
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                variant="outlined"
                                                                                size="small"
                                                                                validators={[
                                                                                    'required',
                                                                                ]}
                                                                                errorMessages={[
                                                                                    'This field is required',
                                                                                ]}
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
                                                                    {index2 == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Qty'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}
                                                                    <TextValidator
                                                                        className="w-full"
                                                                        placeholder="Qty"
                                                                        //variant="outlined"
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        size="small"
                                                                        value={
                                                                            items
                                                                                .packaging_details[index2].package_qunatity
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.onChangeUomValueConversion( i,
                                                                                'package_qunatity',
                                                                                e.target.value,
                                                                                index2
                                                                            )
                                                                        }}
                                                                        validators={[
                                                                            'required',
                                                                            'minNumber: 00',
                                                                        ]}
                                                                        errorMessages={[
                                                                            'This field is required',
                                                                            'Quantity Should Greater-than: 01 ',
                                                                        ]}
                                                                    />
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    lg={2}
                                                                    md={2}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    {index2 == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Conversion'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}

                                                            <div className='pt-3'>{items.packaging_details[index2].conversion}</div>
                                                                </Grid>

                                                                <Grid
                                                                    item
                                                                    lg={2}
                                                                    md={2}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    {index2 == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Minimum pack Factor'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}

                                                                    <Checkbox
                                                                        size="small"
                                                                        color="primary"
                                                                        
                                                                        onChange={(e) => {

                                                                            let itemBatches =
                                                                                this.state.itemBatches
                                                                            if (
                                                                                items.packaging_details[index2].package_qunatity ==null ||items.packaging_details[index2].package_qunatity ==''
                                                                            ) {
                                                                                this.setState(
                                                                                    {
                                                                                        snackbar: true,
                                                                                        snackbar_severity:
                                                                                            'error',
                                                                                        snackbar_message:
                                                                                            'Please add Quantity Before',
                                                                                    }
                                                                                )
                                                                            } else {
                                                                                itemBatches[i].packaging_details.forEach((element,x) => {
                                                                                    itemBatches[i].packaging_details[x].packet_size = null
                                                                                    this.setState({
                                                                                        itemBatches,
                                                                                    })
                                                                                });
                                                                                itemBatches[i].packaging_details[index2].packet_size = items.packaging_details[index2].package_qunatity
                                                                                // this.handleChange()
                                                                                // itemBatches[i].packaging_details[index2].packet_size = e.target.value
                                                            
                                                                                this.setState(
                                                                                    {
                                                                                        itemBatches,
                                                                                        packetSize2:e.target.checked,
                                                                                        volume_factor_index2: index2,
                                                                                        mapIndex:i
                                                                                        // packet_size:index2,
                                                                                    }
                                                                                )
                                                                                console.log(
                                                                                    'formdata',
                                                                                    this.state.itemBatches
                                                                                )
                                                                            }
                                                                        }}
                                                                         
                                                                      checked={
                                                                         
                                                                             (this.state.packetSize2 === true && this.state.volume_factor_index2 === index2 && this.state.mapIndex === i)|| (this.state.itemBatches[i].packaging_details[index2].packet_size !=null) ? true :false 
                                                                            // 
                                                                            // items.packaging_details[index2].package_qunatity != null && (items.packaging_details[index2].package_qunatity === items.packaging_details[index2].packet_size)? true: false
                                                                        }
                                                                    />
                                                                </Grid>

                                                                <Grid
                                                                    item
                                                                    lg={1}
                                                                    md={1}
                                                                    sm={12}
                                                                    xs={12}
                                                                    
                                                                >
                                                                    {index2 == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Storing Level'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}

                                                                    <Checkbox
                                                                        size="small"
                                                                        color="primary"
                                                                        onChange={(e) => {
                                                                            let itemBatches =
                                                                                this.state.itemBatches
                                                                            if (
                                                                                items.packaging_details[index2].package_qunatity ==null ||items.packaging_details[index2].package_qunatity ==''
                                                                            ) {
                                                                                this.setState(
                                                                                    {
                                                                                        snackbar: true,
                                                                                        snackbar_severity:
                                                                                            'error',
                                                                                        snackbar_message:
                                                                                            'Please add Quantity Before',
                                                                                    }
                                                                                )
                                                                            } else {
                                                                                itemBatches[i].packaging_details.forEach((element,x) => {
                                                                                    itemBatches[i].packaging_details[x].packet_level = null
                                                                                    this.setState({
                                                                                        itemBatches,
                                                                                    })
                                                                                });

                                                                                itemBatches[i].packaging_details[index2].packet_level = items.packaging_details[index2].package_qunatity
                                                                                // formData.volume_factor = items.packaging_details[index2].packet_level
                                                                                this.setState(
                                                                                    {
                                                                                       
                                                                                        itemBatches,
                                                                                        mapIndex:i,
                                                                                        packetLevel2:index2,
                                                                                        packet_level_index2:e.target.checked
                                                                                        // packet_level:
                                                                                        // index2,
                                                                                    }
                                                                                )
                                                                                console.log(
                                                                                    'formdata',
                                                                                    this
                                                                                        .state
                                                                                        .itemBatches
                                                                                )
                                                                            }
                                                                        }}
                                                                        checked={
                                                                            // (        this.state.packetSize2 === true && this.state.volume_factor_index2 === index2 )|| (this.state.itemBatches[i].packaging_details[index2].packet_size !=null) ? true :false 

                                                                            (this.state.packetLevel2 === true && this.state.packet_level_index2 === index2 && this.state.mapIndex === i) || (this.state.itemBatches[i].packaging_details[index2].packet_level !=null) ? true :false
                                                                            // items.packaging_details[index2].package_qunatity != null && (items.packaging_details[index2].package_qunatity === items.packaging_details[index2].packet_level)? true: false
                                                                        }
                                                                    />
                                                                </Grid>
                                                            </Grid>

                                                            </>
                                                            
                                                        )
                                                    )}

                                                    {/* <Grid container>
                                            <Grid className='flex items-center mb-2' item lg={2} md={2} sm={12} xs={12}>
                                                <Fab size="small" color="primary" aria-label="add" onClick={() => { this.editNewUom(i) }}>
                                                    <AddIcon />
                                                </Fab>
                                                <Typography className=" text-gray font-semibold text-14 mx-2">Add New Size</Typography>
                                            </Grid>

                                        </Grid> */}
                                         {this.state.formData.status === 'Submitted to HSCO' || this.state.formData.status === "Submitted to AD"|| 
                                this.state.formData.status === "Approved by AD" || this.state.formData.status === "GRN Request Sent"  || 
                                this.state.formData.status === "COMPLETED" ? null : 
                                        <Grid container={2}>
                                       
                                            <Grid className='flex items-center mt-3' item>
                                                <Fab size="small" color="primary" aria-label="add" onClick={() => { this.editNewUom(i) }}>
                                                    <AddIcon />
                                                </Fab>
                                                <Typography className=" text-gray font-semibold text-14 mx-2">Add New Size</Typography>
                                            </Grid>
                              <Grid item className="w-full flex justify-end"
                            >
                              <Button
                                className="mr-2"
                                // progress={this.state.editBatch}
                                // type="submit"
                                disabled={this.state.formData.status === 'Submitted to HSCO' || this.state.formData.status === "Submitted to AD"|| this.state.formData.status === "Approved by AD" || this.state.formData.status === "GRN Request Sent"  || this.state.formData.status === "COMPLETED"?true :false}
                                scrollToTop={true}
                               onClick={    
                                    ()=>{
                                        this.editBatch(this.state.itemBatches[i])
                                        this.setState({
                                            
                                            editBatch:false
                                            // alert: true,
                                            // message: 'Submitted to HSCO!',
                                            // severity: 'success',
                                        })
                                    }
                                  
                                }
                            >
                                <span className="capitalize">
                                   {this.state.itemBatches[i].id != null? "Edit Batch" : "Add Batch"}
                                </span>
                            </Button>
                                </Grid>     
                                        </Grid>
    }

                                                    
                                                </Grid>
                                                
                                            </Grid>
                                        )
                                    )}
    

                                    </div>
                                    :null

                                    }

                                    {/* {this.state.formData.batch_details.map(
                                        (items, i) => (
                                            <Grid container spacing={2}>
                                                <Grid
                                                    item
                                                    lg={2}
                                                    md={2}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                  
                                                        <SubTitle
                                                            title={
                                                                'Batch Number'
                                                            }
                                                        ></SubTitle>
                                                  
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Batch Number"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.formData
                                                                .batch_details[
                                                                i
                                                            ].batch_no
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onChangeBatchValue(
                                                                i,
                                                                'batch_no',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    />
                                                    <p>{items.level}</p>
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={2}
                                                    md={2}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                  
                                                        <SubTitle
                                                            title={'EXD'}
                                                        ></SubTitle>
                                                   

                                                    <DatePicker
                                                        className="w-full"
                                                        value={
                                                            this.state.formData
                                                                .batch_details[
                                                                i
                                                            ].expiary_date
                                                        }
                                                        placeholder="EXD"
                                                        // minDate={new Date()}
                                                        //maxDate={new Date()}
                                                        errorMessages="this field is required"
                                                        onChange={(date) => {
                                                            this.onChangeBatchValue(
                                                                i,
                                                                'expiary_date',
                                                                dateParse(date)
                                                            )
                                                        }}
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
                                                            title={'MFD'}
                                                        ></SubTitle>
                                                   

                                                    <DatePicker
                                                        className="w-full"
                                                        value={
                                                            this.state.formData
                                                                .batch_details[
                                                                i
                                                            ].Manufacture_date
                                                        }
                                                        placeholder="MFD"
                                                        // minDate={new Date()}
                                                        //maxDate={new Date()}
                                                        errorMessages="this field is required"
                                                        onChange={(date) => {
                                                            this.onChangeBatchValue(
                                                                i,
                                                                'Manufacture_date',
                                                                dateParse(date)
                                                            )
                                                        }}
                                                    />

                                                    {/* <TextValidator
                                    className='w-full'
                                    placeholder="MFD"
                                    //variant="outlined"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .batch_details[i].mfd
                                    }
                                    onChange={(e, value) => {
                                        this.onChangeBatchValue(i, 'mfd', e.target.value)

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
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
                                                                'Recieved Quantity'
                                                            }
                                                        ></SubTitle>
                                                   
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Recieved Quantity"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        type='number'
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
                                                        value={
                                                            this.state.formData.batch_details[i].received_quantity
                                                        }
                                                        onChange={(e,value) => {
                                                            let total_qantitiy =
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                )
                                                            this.state.formData.batch_details.forEach(
                                                                (
                                                                    element,
                                                                    index
                                                                ) => {
                                                                    if (index != i) {total_qantitiy =parseFloat(total_qantitiy) +
                                                                            parseFloat(
                                                                                this.state.formData.batch_details[index].received_quantity
                                                                            )
                                                                    }
                                                                }
                                                            )

                                                            if (parseFloat(this.state.formData.batch_details[i].received_quantity) >= total_qantitiy) {
                                                                this.onChangeBatchValue(i, 'received_quantity', e.target.value)

                                                                let formData = this.state.formData
                                                                formData.batch_details[i].no_of_pack = e.target.value / formData.volume_factor

                                                            } else {
                                                                this.onChangeBatchValue(i, 'received_quantity', e.target.value)
                                                                this.setState({
                                                                    snackbar: true,
                                                                    snackbar_severity: 'error',
                                                                    snackbar_message: "Cannot Over the Order Quantity"
                                                                })
                                                            }
                                                        }}
                                                        // validators={[
                                                        //     'required',
                                                        // ]}
                                                        // errorMessages={[
                                                        //     'this field is required',
                                                        // ]}
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
                                                                'Invoiced Quantity'
                                                            }
                                                        ></SubTitle>
                                                   
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Invoiced Quantity"
                                                        //variant="outlined"
                                                        fullWidth
                                                        type='number'
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.formData
                                                                .batch_details[
                                                                i
                                                            ].invoice_quantity
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            let total_qantitiy =
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                )
                                                            this.state.formData.batch_details.forEach(
                                                                (
                                                                    element,
                                                                    index
                                                                ) => {
                                                                    if (
                                                                        index !=
                                                                        i
                                                                    ) {
                                                                        total_qantitiy =
                                                                            parseFloat(
                                                                                total_qantitiy
                                                                            ) +
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .formData
                                                                                    .batch_details[
                                                                                    index
                                                                                ]
                                                                                    .invoice_quantity
                                                                            )
                                                                    }
                                                                }
                                                            )

                                                            if (parseFloat(this.state.formData.batch_details[i].invoice_quantity) >= total_qantitiy) {
                                                                this.onChangeBatchValue(i, 'invoice_quantity', e.target.value)

                                                                let formData = this.state.formData
                                                                formData.batch_details[i].no_of_pack = e.target.value / formData.volume_factor

                                                            } else {
                                                                this.onChangeBatchValue(i, 'invoice_quantity', e.target.value)
                                                                this.setState({
                                                                    snackbar: true,
                                                                    snackbar_severity: 'error',
                                                                    snackbar_message: "Cannot Over the Order Quantity"
                                                                })
                                                            }
                                                        }}
                                                        // validators={[
                                                        //     'required',
                                                        // ]}
                                                        // errorMessages={[
                                                        //     'this field is required',
                                                        // ]}
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
                                                                'Short/Excess'
                                                            }
                                                        ></SubTitle>
                                                    
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Short/Excess"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.formData
                                                                .batch_details[
                                                                i
                                                            ]
                                                                .short_excess_quantity
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onChangeBatchValue(
                                                                i,
                                                                'short_excess_quantity',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
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
                                                            title={'Damage'}
                                                        ></SubTitle>
                                                  
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Damage"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.formData
                                                                .batch_details[
                                                                i
                                                            ].damage_quantity
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onChangeBatchValue(
                                                                i,
                                                                'damage_quantity',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
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
                                                            title={'Unit Value'}
                                                        ></SubTitle>
                                                   
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Unit Value"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.formData
                                                                .batch_details[
                                                                i
                                                            ].unit_value
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onChangeBatchValue(
                                                                i,
                                                                'unit_value',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
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
                                                            title={'Value(USD)'}
                                                        ></SubTitle>
                                                    
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Value(USD)"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.formData
                                                                .batch_details[
                                                                i
                                                            ].value_usd
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onChangeBatchValue(
                                                                i,
                                                                'value_usd',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
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
                                                                                'UOM'
                                                                            }
                                                                        ></SubTitle>                                                                 
                                                                    <Autocomplete
                                        disableClearable
                                                                        className="w-full"
                                                                        options={
                                                                            this
                                                                                .state
                                                                                .all_uoms
                                                                        }
                                                                        
                                                                        getOptionLabel={(
                                                                            option
                                                                        ) =>
                                                                            option.name
                                                                        }
                                                                        /*  getOptionSelected={(option, value) =>
                                                                                  console.log("ok")
                                                                              } 

                                                                        //  value={this.state.all_uoms.find(
                                                                        //      (v) =>
                                                                        //          v.id ==
                                                                        //          this.state.formData.packaging_details[i].package_uom_id
                                                                        //  )}
                                                                        onChange={(
                                                                            event,
                                                                            value
                                                                        ) => {
                                                                            this.onChangeBatchValue(
                                                                                i,
                                                                                'uom_id',
                                                                                value.id,
                                                                                
                                                                            )
                                                                        }}
                                                                      
                                                                        renderInput={(
                                                                            params
                                                                        ) => (
                                                                            <TextValidator
                                                                                {...params}
                                                                                placeholder="UOM"
                                                                                //variant="outlined"
                                                                                //value={}
                                                                                value={this.state.all_uoms.find(
                                                                                    (
                                                                                        v
                                                                                    ) =>
                                                                                        v.id === this.state.formData.batch_details[i].uom_id
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
                                                    item
                                                    lg={2}
                                                    md={2}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle
                                                        title={'Height(CM)'}
                                                    ></SubTitle>
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Height(CM)"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        type='number'
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
                                                        value={
                                                            this.state.formData
                                                                .batch_details[
                                                                i
                                                            ].height
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onChangeBatchValue(
                                                                i,
                                                                'height',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
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
                                                        title={'Width(CM)'}
                                                    ></SubTitle>
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Width(CM)"
                                                        fullWidth
                                                        type='number'
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.formData
                                                                .batch_details[
                                                                i
                                                            ].width
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onChangeBatchValue(
                                                                i,
                                                                'width',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
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
                                                        title={'Length(CM)'}
                                                    ></SubTitle>
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Length(CM)"
                                                        fullWidth
                                                        type='number'
                                                        variant="outlined"
                                                        size="small"
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
                                                        value={
                                                            this.state.formData
                                                                .batch_details[
                                                                i
                                                            ].length
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onChangeBatchValue(
                                                                i,
                                                                'length',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
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
                                                        title={'Net.Weight'}
                                                    ></SubTitle>
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Net.Weight"
                                                        fullWidth
                                                        type='number'
                                                        variant="outlined"
                                                        size="small"
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
                                                        value={
                                                            this.state.formData
                                                                .batch_details[
                                                                i
                                                            ].net_weight
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onChangeBatchValue(
                                                                i,
                                                                'net_weight',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
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
                                                        title={'Gross.Weight'}
                                                    ></SubTitle>
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Gross.Weight"
                                                        fullWidth
                                                        type='number'
                                                        min="1"
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.formData
                                                                .batch_details[
                                                                i
                                                            ].gross_weight
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onChangeBatchValue(
                                                                i,
                                                                'gross_weight',
                                                                e.target.value
                                                            )
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
                                                    />
                                                </Grid>
                                                <br />
                                                <Grid container spacing={2}>

                                                    {/* second map */}
                                                    {/* {items.packaging_details.map(
                                                        (item2, index2) => (
                                                            <Grid
                                                                container
                                                                spacing={2}
                                                            >
                                                                <Grid
                                                                    item
                                                                    lg={2}
                                                                    md={2}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    {index2 == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Pack Size'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}
                                                                    <p>
                                                                        {'Level ' +
                                                                            (index2+1)}
                                                                    </p>
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    lg={2}
                                                                    md={2}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    {index2 == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'UOM'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}
                                                                    <Autocomplete
                                        disableClearable
                                                                        className="w-full"
                                                                        options={
                                                                            this
                                                                                .state
                                                                                .all_uoms
                                                                        }
                                                                      
                                                                        getOptionLabel={(
                                                                            option
                                                                        ) =>
                                                                            option.name
                                                                        }
                                                                       
                                                                        //  value={this.state.all_uoms.find(
                                                                        //      (v) =>
                                                                        //          v.id ==
                                                                        //          this.state.formData.packaging_details[i].package_uom_id
                                                                        //  )}
                                                                        onChange={(
                                                                            event,
                                                                            value
                                                                        ) => {
                                                                            this.onChangeUomValue(
                                                                                i,
                                                                                'package_uom_id',
                                                                                value.id,
                                                                                index2
                                                                            )
                                                                        }}
                                                                        renderInput={(
                                                                            params
                                                                        ) => (
                                                                            <TextValidator
                                                                                {...params}
                                                                                placeholder="UOM"
                                                                                //variant="outlined"
                                                                                //value={}
                                                                                value={this.state.all_uoms.find(
                                                                                    (
                                                                                        v
                                                                                    ) =>
                                                                                        v.id ===
                                                                                        items.packaging_details[index2].package_uom_id
                                                                                )}
                                                                                fullWidth
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
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
                                                                <Grid
                                                                    item
                                                                    lg={2}
                                                                    md={2}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    {index2 == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Qty'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}
                                                                    <TextValidator
                                                                        className="w-full"
                                                                        placeholder="Qty"
                                                                        //variant="outlined"
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        size="small"
                                                                        value={
                                                                            items
                                                                                .packaging_details[
                                                                                    index2
                                                                            ]
                                                                                .package_qunatity
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.onChangeUomValue(
                                                                                i,
                                                                                'package_qunatity',
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                    index2
                                                                            )
                                                                        }}
                                                                        validators={[
                                                                            'required',
                                                                        ]}
                                                                        errorMessages={[
                                                                            'this field is required',
                                                                        ]}
                                                                    />
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    lg={2}
                                                                    md={2}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    {index2 == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Conversion'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}

                                                            <div className='pt-3'>{items.packaging_details[index2].conversion}</div>
                                                                </Grid>

                                                                <Grid
                                                                    item
                                                                    lg={2}
                                                                    md={2}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    {index2 == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Minimum pack Factor'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}

                                                                    <Checkbox
                                                                        size="small"
                                                                        color="primary"
                                                                        
                                                                        onChange={(e) => {

                                                                            let formData =
                                                                                this.state.formData
                                                                            if (
                                                                                items.packaging_details[index2].package_qunatity ==null ||items.packaging_details[index2].package_qunatity ==''
                                                                            ) {
                                                                                this.setState(
                                                                                    {
                                                                                        snackbar: true,
                                                                                        snackbar_severity:
                                                                                            'error',
                                                                                        snackbar_message:
                                                                                            'Please add Quantity Before',
                                                                                    }
                                                                                )
                                                                            } else {
                                                                                formData.batch_details[i].packaging_details.forEach((element,x) => {
                                                                                    formData.batch_details[i].packaging_details[x].packet_size = null
                                                                                    this.setState({
                                                                                        formData,
                                                                                    })
                                                                                });
                                                                                formData.batch_details[i].packaging_details[index2].packet_size = items.packaging_details[index2].package_qunatity
                                                                                // this.handleChange()
                                                                                // formData.batch_details[i].packaging_details[index2].packet_size = e.target.value
                                                            
                                                                                this.setState(
                                                                                    {
                                                                                        formData,
                                                                                        packetSize:e.target.checked,
                                                                                        volume_factor_index: index2,
                                                                                        // packet_size:index2,
                                                                                    }
                                                                                )
                                                                                console.log(
                                                                                    'formdata',
                                                                                    this.state.formData
                                                                                )
                                                                            }
                                                                        }}
                                                                         
                                                                      checked={
                                                                         
                                                                             this.state.packetSize === true && this.state.volume_factor_index === index2 ? true :false
                                                                            // items.packaging_details[index2].package_qunatity != null && (items.packaging_details[index2].package_qunatity === items.packaging_details[index2].packet_size)? true: false
                                                                        }
                                                                    />
                                                                </Grid>

                                                                <Grid
                                                                    item
                                                                    lg={2}
                                                                    md={2}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    {index2 == 0 ? (
                                                                        <SubTitle
                                                                            title={
                                                                                'Storing Level'
                                                                            }
                                                                        ></SubTitle>
                                                                    ) : null}

                                                                    <Checkbox
                                                                        size="small"
                                                                        color="primary"
                                                                        onChange={(e) => {
                                                                            let formData =
                                                                                this.state.formData
                                                                            if (
                                                                                items.packaging_details[index2].package_qunatity ==null ||items.packaging_details[index2].package_qunatity ==''
                                                                            ) {
                                                                                this.setState(
                                                                                    {
                                                                                        snackbar: true,
                                                                                        snackbar_severity:
                                                                                            'error',
                                                                                        snackbar_message:
                                                                                            'Please add Quantity Before',
                                                                                    }
                                                                                )
                                                                            } else {
                                                                                formData.batch_details[i].packaging_details[index2].packet_level = items.packaging_details[index2].package_qunatity
                                                                                // formData.volume_factor = items.packaging_details[index2].packet_level
                                                                                this.setState(
                                                                                    {
                                                                                        formData,
                                                                                        mapIndex:i,
                                                                                        packetLevel:index2,
                                                                                        packet_level_index:e.target.checked
                                                                                        // packet_level:
                                                                                        // index2,
                                                                                    }
                                                                                )
                                                                                console.log(
                                                                                    'formdata',
                                                                                    this
                                                                                        .state
                                                                                        .formData
                                                                                )
                                                                            }
                                                                        }}
                                                                        checked={
                                                                            this.state.packet_level_index === true && this.state.packetLevel === index2 ? true :false
                                                                            // items.packaging_details[index2].package_qunatity != null && (items.packaging_details[index2].package_qunatity === items.packaging_details[index2].packet_level)? true: false
                                                                        }
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            
                                                        )
                                                    )}

                                                    <Grid container>
                                            <Grid className='flex items-center' item lg={2} md={2} sm={12} xs={12}>
                                                <Fab size="small" color="primary" aria-label="add" onClick={() => { this.addNewUom(i) }}>
                                                    <AddIcon />
                                                </Fab>
                                                <Typography className=" text-gray font-semibold text-14 mx-2">Add New Size</Typography>
                                            </Grid>

                                        </Grid>

                                                    
                                                </Grid>
                                                
                                            </Grid>
                                        )
                                    )}  */}
                                         <Grid
                                            className='mt-8'
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle
                                                    title={'Total Quantity'}
                                                ></SubTitle>
                                                <TextValidator
                                                    className="w-full"
                                                    placeholder="Total Quantity"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    type='number'
                                                    InputProps={{
                                                        inputProps: { min: 0 }
                                                      }}
                                                    value={
                                                        this.state.formData
                                                            .total_quantity
                                                    }
                                                    onChange={(e, value) => {
                                                        let formData =
                                                            this.state.formData
                                                        formData.total_quantity =
                                                            e.target.value
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }}
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                />
                                            </Grid>

                                </div>
                                {this.state.formData.status === 'Submitted to HSCO' || this.state.formData.status === "Submitted to AD"|| 
                                this.state.formData.status === "Approved by AD" || this.state.formData.status === "GRN Request Sent"  || 
                                this.state.formData.status === "COMPLETED" ? null : 
                                <Grid
                                container
                                className="w-full flex justify-end my-12"
                            >
                                <Grid item>
                                <Fab size="small" color="primary" aria-label="add" onClick={() => { this.addNewBatch() }}>
                                                    <AddIcon
                                                    
                                                     />
                                                </Fab>
                                   
                                </Grid>
                            </Grid>
                            }
                              <ValidatorForm
            className="pt-2"
            onSubmit={() => this.approvalProcess()
            }
            onError={() => null}
            >
                            {this.state.userInfo?.roles.includes('Chief Pharmacist') ||this.state.userInfo?.roles.includes("MSD SCO") ||this.state.userInfo?.roles.includes("MSD SCO Supply")? 


                                                        <Grid item>
                                                        <Button
                                                            className="mr-2 mt-7"
                                                            progress={false}
                                                            type="submit"
                                                            disabled={this.state.formData.status === 'Submitted to HSCO' ||this.state.formData.status === 'Submitted to CIU' || this.state.formData.status === "Submitted to AD"|| this.state.formData.status === "Approved by AD" || this.state.formData.status === "GRN Request Sent"  || this.state.formData.status === "COMPLETED" 
                                                            //  || this.state.userInfo.roles.includes('Chief Pharmacist') ||this.state.userInfo.roles.includes("MSD SCO") ||this.state.userInfo.roles.includes("MSD SCO Supply") 
                                                             ? true : false}
                                                            scrollToTop={true}
                                                            onClick={() => {
                                                                // console.log('SR',this.state.hsco)
                                                                // this.approvalProcess()
                                                                // this.setState({
                                                                //     alert: true,
                                                                //     message: 'Submitted to HSCO!',
                                                                //     severity: 'success',
                                                                // })
                                                            }}
                                                        >
                                                            <span className="capitalize">
                                                                { this.state.userInfo.roles.includes('Chief Pharmacist') ?"Submit to Director" :'Submit to CIU' }
                                                                {/* Submit to HSCO */}
                                                            </span>
                                                        </Button>
                                                    </Grid>
                            
                            : null}
                                                    <Grid container className='mb-3 mt-5 px-3 py-3' style={{ backgroundColor: "#f7e5cc" }}>
                                <h4>History</h4>
                                <Grid container>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={"Created By"} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.donation_his.createdBy.name} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.donation_his.createdBy.designation} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={dateParse(this.state.donation_his.createdBy.date)} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={timeParse(this.state.donation_his.createdBy.time)} />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={"SCO Approve By"} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.donation_his.sco_approve.name} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.donation_his.sco_approve.designation} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={dateParse(this.state.donation_his.sco_approve.date)} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={timeParse(this.state.donation_his.sco_approve.time)} />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={"CIU Approve By"} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.donation_his.ciu_approve.name} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.donation_his.ciu_approve.designation} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={dateParse(this.state.donation_his.ciu_approve.date)} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={timeParse(this.state.donation_his.ciu_approve.time)} />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={"HSCO Approve By"} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.donation_his.hsco_approve.name} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.donation_his.hsco_approve.designation} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={dateParse(this.state.donation_his.hsco_approve.date)} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={timeParse(this.state.donation_his.hsco_approve.time)} />
                                    </Grid>
                                </Grid>

                                <Grid container>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={"AD Approve By"} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.donation_his.ad_approve.name} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.donation_his.ad_approve.designation} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={dateParse(this.state.donation_his.ad_approve.date)} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={timeParse(this.state.donation_his.ad_approve.time)} />
                                    </Grid>
                                </Grid>
                                {/* <Grid container>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={"Received By"} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.receivedBy.name} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.receivedBy.designation} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={dateParse(this.state.orderSummury.receivedBy.date)} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={timeParse(this.state.orderSummury.receivedBy.time)} />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={"Complele By"} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.compleleBy.name} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.compleleBy.designation} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={dateParse(this.state.orderSummury.compleleBy.date)} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={timeParse(this.state.orderSummury.compleleBy.time)} />
                                    </Grid>
                                </Grid> */}
                            </Grid>

                            </ValidatorForm>
                                                    <Dialog
                    open={this.state.deleteConfirm}
                    onClose={() => { this.setState({ deleteConfirm: false }) }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Delete Pack Size Row"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you Sure you want to Delete this Row
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="text" onClick={() => { this.setState({ deleteConfirm: false }) }} color="primary">
                            No
                        </Button>
                        <Button variant="text" onClick={() => {  
                            this.removeRow(this.state.batchIndex,this.state.packageIndex,this.state.packageID)
                             }} color="primary" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.requestDialog}
                    onClose={() => { this.setState({ requestDialog: false }) }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"SR Request Confirmation"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you Sure you want to Request SR for this Item?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="text" onClick={() => { this.setState({ requestDialog: false }) }} color="primary">
                            Disagree
                        </Button>
                        <Button variant="text" onClick={() => {  this.RequestSR() }} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
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
                            </ValidatorForm>
                        </LoonsCard>
                    </div>
                ) : (
                    <Grid className="justify-center text-center w-full pt-12">
                        <CircularProgress size={30} />
                    </Grid>
                )}
                
            </MainContainer>
        )
    }
}

export default withStyles(styleSheet)(ViewSingleDonationItem)
