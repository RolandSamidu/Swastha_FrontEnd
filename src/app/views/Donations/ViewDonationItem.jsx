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

class ViewDonationItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sr_no: [],
            loading: true,
            is_editable: true,
            all_uoms: [],
            packetSize:null,
            packetLevel:null,
            volume_factor_index:null,
            packet_level_index:null,
            filterData: {
                manufacture_date: null,
            },
            backendItemData:[],
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
        let id = '8bd682e3-ab0a-400d-afb1-25fb606eebc9'
        console.log(id)
        let res = await ConsignmentService.getUoms(params)
        if (res.status) {
            console.log('all uoms', res.data.view.data)
            this.setState(
                {
                    all_uoms: res.data.view.data,
                }
                // ,
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
        let id = this.props.match.params.id
        console.log('NOTE ID', id)
        this.LoadDataByID(id)
        this.loadAllUoms()
    }

    async createDonationItems() {
        console.log(this.state.formData)
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
                delivery_person_contact_no:
                    res.data.view?.delivery_person_contact_no,
            }
            this.setState(
                {
                    backendData: backendData,
                    loaded: true,
                },
                () => console.log('resdata', this.state.donation)
            )
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
    // async LoadDonationItembyID(id) {
    //     this.setState({ loaded: false })
    //     // console.log("State 1:", this.state.data)
    //     let res = await DonarService.getDonationItembyID(id)
      
    //     if (res.status == 200) {
          
    //         this.setState({
    //                 backendItemData: res.data.view.data,
    //                 loaded: true,
    //             },() => console.log('resdata', this.state.donation)
    //         )
    //     }
    // }

    

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
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
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
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
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
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
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
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
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
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
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
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
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
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
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
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
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
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
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
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>
                                </Grid>
                                <br />
                                <hr />
                                                                {/* Disaply item Data */}
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

                                    {this.state.formData.batch_details.map(
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
                                                            'This field is required',
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
                                                            'This field is required',
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
                                                            'This field is required',
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
                                                            'This field is required',
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
                                                            'This field is required',
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
                                                            'This field is required',
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
                                                        title={'Length(CM)s'}
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
                                                            'This field is required',
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
                                                            'This field is required',
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
                                                            'This field is required',
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
                                                                                formData.batch_details[i].packaging_details.forEach((element,x) => {
                                                                                    formData.batch_details[i].packaging_details[x].packet_size = null
                                                                                    this.setState({
                                                                                        formData,
                                                                                    })
                                                                                });

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
                                    )}
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


                                {/* Add new item map */}
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

                                    {this.state.formData.batch_details.map(
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
                                                            'This field is required',
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
                                                            'This field is required',
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
                                                            'This field is required',
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
                                                            'This field is required',
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
                                                            'This field is required',
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
                                                            'This field is required',
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
                                                        title={'Length(CM)s'}
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
                                                            'This field is required',
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
                                                            'This field is required',
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
                                                            'This field is required',
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
                                                                                formData.batch_details[i].packaging_details.forEach((element,x) => {
                                                                                    formData.batch_details[i].packaging_details[x].packet_size = null
                                                                                    this.setState({
                                                                                        formData,
                                                                                    })
                                                                                });

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
                                    )}
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


                                <Grid
                                container
                                className="w-full flex justify-end my-12"
                            >
                                <Grid item>
                                <Fab size="small" color="primary" aria-label="add" onClick={() => { this.addNewBatch() }}>
                                                    <AddIcon />
                                                </Fab>
                                    {/* <AddCircleOutlineRoundedIcon
                                    onClick={()=>this.addNewBatch()}
                                    /> */}
                                </Grid>
                            </Grid>
                            <Grid item>
                            <Button
                                className="mr-2 mt-7"
                                progress={false}
                                type="submit"
                                scrollToTop={true}
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

export default withStyles(styleSheet)(ViewDonationItem)
