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
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
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
import { dateParse, dateTimeParse } from 'utils'

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

class ViewSingleSRDonationItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
             //snackbar
             alert: false,
             message: '',
             severity: 'success',
             
            sr_no: [],
            loading: true,
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
            filterData: {
                manufacture_date: null,
            },
            packet_level:false,
            mapIndex:null,
            formData: {
                donation_id: this.props.match.params.id,
                name: null,
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
                () =>{ this.loadDonationItem() }
                
                // () => {
                //     this.loadConsignmentData(id);
                // }
            )
        }
    }
    addNewBatch() {
        let formData = this.state.formData;
        let batch_details = formData.batch_details;     
        batch_details.push({
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
        formData.batch_details = batch_details;
        this.setState({ formData })
    }
    componentDidMount() {
        
        let donar_id =this.props.match.params.donar_id
        let id = this.props.match.params.id
        console.log('NOTE ID', id)
        console.log('NOTE ID2', donar_id)
        this.LoadDataByID(donar_id)
        this.loadAllUoms()
    }

    async createDonationItems() {
        console.log("FormData",this.state.formData)
        console.log("FormData 2",this.state.itemBatches)
        // let res = await DonarService.createDonationItem(this.state.formData);
        // console.log("res",res)
        // if (res.status === 201) {
        //     this.setState({
        //         alert: true,
        //         message: 'Donation Item Created successfully!',
        //         severity: 'success',
        //     })
        // } else {
        //     this.setState({
        //         alert: true,
        //         message: 'Donation Item Creation was unsuccessful!',
        //         severity: 'error',
        //     })
        // }

    }

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
        itemBatches[index].packaging_details[index2][name] = value

        if (name === 'package_qunatity') {
        //  itemBatches[index].packaging_details[index2].conversion = itemBatches[index].packaging_details[index2][name];
          
            // itemBatches[index].packaging_details[index2].forEach((element, index) => {
                if (index2 === 0) {
                    itemBatches[index].packaging_details[index2].conversion = itemBatches[index].packaging_details[index2][name];
                } else {
                    itemBatches[index].packaging_details[index2].conversion = itemBatches[index].packaging_details[index2-1].conversion + 'X' + itemBatches[index].packaging_details[index2][name] / itemBatches[index].packaging_details[index2-1][name]
                }
            // });

        }

        this.setState({ itemBatches })
    }

    async LoadDataByID(id) {
        this.setState({ loaded: true })
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
        this.setState({ loaded: true })
        // console.log("State 1:", this.state.data)
        let id = this.props.match.params.id
        // let id = '986ff19a-cbbb-4076-9258-eddfa5300419'
        let res = await DonarService.getDonationItembyID(id)
        if (res.status == 200) {
            console.log('RES',res.data?.view?.DonationItemsBatches)
            // let itemBatches = {
            //     donation_itemBatches : res.data?.view?.DonationItemsBatches
            // }
            let formData = this.state.formData
            formData.name =res.data?.view?.name
            formData.total_quantity =res.data?.view?.total_quantity
            let itemBatch = this.state.itemBatches
            console.log('itemb',this.state.itemBatches)
            // let packageDetails = this.state.itemBatches.packaging_details

            res.data.view.DonationItemsBatches.forEach(element => {
                let backend = {}

                backend.batch_no = element?.batch_no
                backend.Manufacture_date = element?.Manufacture_date
                backend.expiary_date= element?.expiary_date
                backend.received_quantity=element?.received_quantity
                backend.invoice_quantity=element?.invoice_quantity
                backend.short_excess_quantity=element?.short_excess_quantity
                backend.damage_quantity=element?.damage_quantity
                backend.unit_value=element?.unit_value
                backend.value_usd=element?.value_usd

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
            this.setState({
                formData,
                itemBatches:itemBatch
            },
            console.log('itemb',this.state.itemBatches))
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
    async submit() {
        console.log("Form date",this.state.formData)
        let hosID = this.props.match.params.id;

        // var form_data2 = new FormData();
        // // let nullCheck = Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
        // // form_data2.append(`file`, this.state.files.fileList[0].file);
        // // form_data2.append(`sr_no`, this.state.formData.sr_no)
        // if(this.state.formData.serial_id != null ){
        //     form_data2.append(`serial_id`, this.state.formData.serial_id)
        // }
        // if(this.state.formData.stock_id != null ){
        //     form_data2.append(`stock_id`, this.state.formData.stock_id )//null
        // }
        // if(this.state.formData.condition_id != null ){
        //     form_data2.append(`condition_id`, this.state.formData.condition_id)
        // }
        // if(this.state.formData.abc_class_id != null ){
        //     form_data2.append(`abc_class_id`, this.state.formData.abc_class_id)
        // }
        // if(this.state.formData.storage_id != null ){
        //     form_data2.append(`storage_id`, this.state.formData.storage_id)
        // }
        // if(this.state.formData.batch_trace_id != null ){
        //     form_data2.append(`batch_trace_id`, this.state.formData.batch_trace_id)
        // }
        // if(this.state.formData.cyclic_code_id != null ){
        //     form_data2.append(`cyclic_code_id`, this.state.formData.cyclic_code_id)
        // }
        // if(this.state.formData.movement_type_id != null ){
        //     form_data2.append(`movement_type_id`, this.state.formData.movement_type_id)//to here null check
        // }
        // if(this.state.formData.shelf_life_id != null ){
        //     form_data2.append(`shelf_life_id`, this.state.formData.shelf_life_id)//null
        // }
        // if(this.state.formData.primary_wh != null ){
        //     form_data2.append(`primary_wh`, this.state.formData.primary_wh)//null
        // }
        // if(this.state.formData.item_type_id != null ){
        //     form_data2.append(`item_type_id`, this.state.formData.item_type_id)//null id
        // }
        // if(this.state.formData.institution_id != null ){
        //     form_data2.append(`institution_id`, this.state.formData.institution_id)//here
        // }
        // if(this.state.formData.ven_id != null ){
        //     form_data2.append(`ven_id`, this.state.formData.ven_id)//null
        // }
        // if(this.state.formData.item_usage_type_id != null ){
        //     form_data2.append(`item_usage_type_id`, this.state.formData.item_usage_type_id)//null
        // }
        // if(this.state.formData.critical != null ){
        //     form_data2.append(`critical`, this.state.formData.critical)//null
        // }
        // if(this.state.formData.nearest_round_up_value != null ){
        //     form_data2.append(`nearest_round_up_value`, this.state.formData.nearest_round_up_value)//null
        // }

        // // form_data2.append(`short_description`, this.state.formData.short_description)
        // form_data2.append(`medium_description`, this.state.formData.medium_description)
        // // form_data2.append(`long_description`, this.state.formData.long_description)
        // // form_data2.append(`note`, this.state.formData.note)
        // // form_data2.append(`group_id`, this.state.formData.group_id)
        // // form_data2.append(`shelf_life`, this.state.formData.shelf_life)
        // // form_data2.append(`standard_cost`, this.state.formData.standard_cost)
        // // form_data2.append(`standard_shelf_life`, this.state.formData.standard_shelf_life)

        // this.state.formData.uoms.forEach((element, index) => {
        //     form_data2.append(`uoms[` + index + `]`, element)
        // });
        
        // // form_data2.append(`conversion_facter`, this.state.formData.conversion_facter)
        // // form_data2.append(`pack_quantity`, this.state.formData.pack_quantity)
        // // form_data2.append(`cubic_size`, this.state.formData.cubic_size)
        // // form_data2.append(`pack_weight`, this.state.formData.pack_weight)
        // // form_data2.append(`common_name`, this.state.formData.common_name)
        // // form_data2.append(`consumables`, this.state.formData.consumables)
        // // form_data2.append(`used_for_estimates`, this.state.formData.used_for_estimates)
        // // form_data2.append(`used_for_formulation`, this.state.formData.used_for_formulation)
        // // form_data2.append(`formulatory_approved`, this.state.formData.formulatory_approved)
        // // form_data2.append(`specification`, this.state.formData.specification)
        // // form_data2.append(`source_of_creation`, this.state.formData.source_of_creation)
        // // form_data2.append(`status`, this.state.formData.status)

        // form_data2.append(`primary_id`, this.state.formData.primary_id)
        
        // form_data2.append(`item_unit_size`, this.state.formData.item_unit_size)
        // form_data2.append(`countable`, this.state.formData.countable)
        // form_data2.append(`reusable`, this.state.formData.reusable)
        // form_data2.append(`is_dosage_count`, this.state.formData.is_dosage_count)
        // form_data2.append(`dosage_form_id`, this.state.formData.dosage_form_id)
        // form_data2.append(`measuring_unit_code_id`, this.state.formData.measuring_unit_code_id)
        // form_data2.append(`measuring_unit_id`, this.state.formData.measuring_unit_id)
        // form_data2.append(`display_unit_id`, this.state.formData.display_unit_id)
       
        // form_data2.append(`default_route_id`, this.state.formData.default_route_id)
        // form_data2.append(`default_frequency_id`, this.state.formData.defaultFrequency)
        // form_data2.append(`default_duration`, this.state.formData.defaultDuration)

       

        // console.log("Form data2",form_data2)
        // let res = await InventoryService.editItem(hosID,form_data2)
        // console.log("Data" , res)
        // if (res.status == 200) {
        //     this.setState({
        //         alert: true,
        //         message: 'Item has been Edited Successfully.',
        //         severity: 'success',
              
        //     })
        //     //   this.clearField()
        // } else {
        //     this.setState({
        //         alert: true,
        //         message: 'Cannot Edit Item ',
        //         severity: 'error',
        //     })
        // }

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
            onSubmit={() => this.createDonationItems()}
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
                                            <Grid
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
                                                    disabled={true}
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
                                            </Grid>

                                            <Grid
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
                                                    disabled={true}
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
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {this.state.itemBatches.length !== 0 ?
                                    <div>
                                     {this.state.itemBatches.map(
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
                                                        disabled={true}
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
                                                            this.state.itemBatches[
                                                                i
                                                            ].expiary_date
                                                        }
                                                        placeholder="EXD"
                                                        // minDate={new Date()}
                                                        //maxDate={new Date()}
                                                        errorMessages="this field is required"
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
                                                        errorMessages="this field is required"
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
                                                                'Recieved Quantity'
                                                            }
                                                        ></SubTitle>
                                                   
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Recieved Quantity"
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
                                                            this.state.itemBatches[i].received_quantity
                                                        }
                                                        onChange={(e,value) => {
                                                            let total_qantitiy =
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                )
                                                            this.state.itemBatches.forEach(
                                                                (
                                                                    element,
                                                                    index
                                                                ) => {
                                                                    if (index != i) {total_qantitiy =parseFloat(total_qantitiy) +
                                                                            parseFloat(
                                                                                this.state.itemBatches[index].received_quantity
                                                                            )
                                                                    }
                                                                }
                                                            )

                                                            if (parseFloat(this.state.itemBatches[i].received_quantity) >= total_qantitiy) {
                                                                this.onEditBatchValue(i, 'received_quantity', e.target.value)

                                                                let itemBatches = this.state.itemBatches
                                                                itemBatches.batch_details[i].no_of_pack = e.target.value / itemBatches.volume_factor

                                                            } else {
                                                                this.onEditBatchValue(i, 'received_quantity', e.target.value)
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
                                                        disabled={true}
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
                                                            this.state.itemBatches.forEach(
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
                                                                                    .itemBatches[
                                                                                    index
                                                                                ]
                                                                                    .invoice_quantity
                                                                            )
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
                                                        disabled={true}
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.itemBatches[
                                                                i
                                                            ]
                                                                .short_excess_quantity
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
                                                        disabled={true}
                                                        variant="outlined"
                                                        size="small"
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
                                                        disabled={true}
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.itemBatches[
                                                                i
                                                            ].unit_value
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            this.onEditBatchValue(
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
                                                   <SubTitle title={"Value(Received x Unit Price)"}></SubTitle>
                                                    
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Value"
                                                        //variant="outlined"
                                                        fullWidth
                                                        disabled={true}
                                                        variant="outlined"
                                                        size="small"
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
                                                                        disabled={true}
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
                                                        disabled={true}
                                                        type='number'
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
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
                                                        disabled={true}
                                                        type='number'
                                                        variant="outlined"
                                                        size="small"
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
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
                                                        title={'Net.Weight(Kg)'}
                                                    ></SubTitle>
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Net.Weight"
                                                        fullWidth
                                                        disabled={true}
                                                        type='number'
                                                        variant="outlined"
                                                        size="small"
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                          }}
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
                                                        title={'Gross.Weight(Kg)'}
                                                    ></SubTitle>
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Gross.Weight"
                                                        fullWidth
                                                        disabled={true}
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
                                                    {items.packaging_details.map(
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
                                                                        disabled={true}
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
                                                                                 items.packaging_details[index2].package_uom_id
                                                                         )}
                                                                        onChange={(
                                                                            event,
                                                                            value
                                                                        ) => {
                                                                            this.onEditUomValue(
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
                                                                        disabled={true}
                                                                        variant="outlined"
                                                                        size="small"
                                                                        value={
                                                                            items
                                                                                .packaging_details[index2].package_qunatity
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.onEditUomValue(
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
                                                                        disabled={true}
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
                                                                                // formData.batch_details[i].packaging_details[index2].packet_size = e.target.value
                                                            
                                                                                this.setState(
                                                                                    {
                                                                                        itemBatches,
                                                                                        packetSize2:e.target.checked,
                                                                                        volume_factor_index2: index2,
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
                                                                         
                                                                             (this.state.packetSize2 === true && this.state.volume_factor_index2 === index2 )|| (this.state.itemBatches[i].packaging_details[index2].packet_size !=null) ? true :false 
                                                                            // 
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
                                                                        disabled={true}
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
                                                                            (this.state.packet_level_index2 === true && this.state.packetLevel2 === index2) || (this.state.itemBatches[i].packaging_details[index2].packet_level !=null) ? true :false
                                                                            // items.packaging_details[index2].package_qunatity != null && (items.packaging_details[index2].package_qunatity === items.packaging_details[index2].packet_level)? true: false
                                                                        }
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            
                                                        )
                                                    )}

                                                    <Grid container>
                                            {/* <Grid className='flex items-center' item lg={2} md={2} sm={12} xs={12}>
                                                <Fab size="small" color="primary" aria-label="add" onClick={() => { this.editNewUom(i) }}>
                                                    <AddIcon />
                                                </Fab>
                                                <Typography className=" text-gray font-semibold text-14 mx-2">Add New Size</Typography>
                                            </Grid> */}

                                        </Grid>

                                                    
                                                </Grid>
                                                
                                            </Grid>
                                        )
                                    )}
    

                                    </div>
                                    :null

                                    }

                                         <Grid
                                            className='mt-6'
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
                                                    disabled={true}
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
                                {/* <Grid
                                container
                                className="w-full flex justify-end my-12"
                            >
                                <Grid item>
                                <Fab size="small" color="primary" aria-label="add" onClick={() => { this.addNewBatch() }}>
                                                    <AddIcon />
                                                </Fab>
                                    {/* <AddCircleOutlineRoundedIcon
                                    onClick={()=>this.addNewBatch()}
                                    /> 
                                </Grid>
                            </Grid> */}
                            <Grid item>
                            <Button
                                className="mr-2 mt-7"
                                progress={false}
                                type="submit"
                                scrollToTop={true}
                                onClick={                               
                                    ()=>
                                        this.setState({
                                            alert: true,
                                            message: 'Submitted to HSCO!',
                                            severity: 'success',
                                        })
                                }
                            >
                                <span className="capitalize">
                                    Submit to HSCO
                                </span>
                            </Button>
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

export default withStyles(styleSheet)(ViewSingleSRDonationItem)
