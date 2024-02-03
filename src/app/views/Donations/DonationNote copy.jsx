import React, { Component, Fragment, useState } from 'react'
import {
    CardTitle,
    LoonsCard,
    SubTitle,
    DatePicker,
} from 'app/components/LoonsLabComponents'
import MainContainer from 'app/components/LoonsLabComponents/MainContainer'
import { LoonsTable, Button } from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { CircularProgress, Grid,Icon ,Dialog, DialogActions,
    DialogContent,
    DialogTitle,IconButton,Checkbox,Fab,Typography,
    } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import * as appConst from '../../../appconst'
import { Autocomplete } from '@material-ui/lab'
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles'
import InputAdornment from '@mui/material/InputAdornment'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import AddDetails from './AddDetails'
import ConsignmentService from 'app/services/ConsignmentService'

import DonarService from '../../services/DonarService'
import localStorageService from 'app/services/localStorageService'
import EmployeeServices from 'app/services/EmployeeServices'
import { dateParse, dateTimeParse } from "utils";

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

class DonationNote extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            sr_no: [],
            loading: true,
            is_editable: true,
            all_uoms:[],
            filterData: {
                manufacture_date: null,
            },
            formData: {
                uoms: [],
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
                batches: [
                    {
                        batch_no: null,
                        exd: null,
                        mfd: null,
                        quantity: null,
                        unit_price: null,
                        no_of_pack: null
                    },
                ],
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
                                packagingDetails:true,
                                rowID:[dataIndex]
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

            data: [
                {
                    batch_no: '',
                    manufacture_date: '',
                    expiry_date: '',
                    received_quantity: '',
                    invoice_quantity: '',
                    short_excess: '',
                    unit_value: '',
                    value: '',
                },
                {
                    batch_no: '',
                    manufacture_date: '',
                    expiry_date: '',
                    received_quantity: '',
                    invoice_quantity: '',
                    short_excess: '',
                    unit_value: '',
                    value: '',
                },
            ],
            itemBatches: [
                {
                    data: [
                        {
                            batch_no: '',
                            manufacture_date: '',
                            expiry_date: '',
                            received_quantity: '',
                            invoice_quantity: '',
                            short_excess: '',
                            unit_value: '',
                            value: '',
                        },
                        
                    ],
                    sr_no: null,
                    item_name: null,
                    item_description: null,
                    packagingDetails:false,
                    rowID:null
                },
            ],
        }
    }
    addNewBatch() {
        let formData = this.state.formData;
        let batches = formData.batches;
        batches.push({
            batch_no: null,
            exd: null,
            mfd: null,
            quantity: null,
            unit_price: null

        })
        formData.batches = batches;
        this.setState({ formData })
    }
    async loadAllUoms() {
        let params = { limit: 10000, page: 0 }
        let id = '8bd682e3-ab0a-400d-afb1-25fb606eebc9';
        console.log(id);
        let res = await ConsignmentService.getUoms(params)
        if (res.status) {
            console.log("all uoms", res.data.view.data)
            this.setState({
                all_uoms: res.data.view.data,

            }
            // , 
            // () => {
            //     this.loadConsignmentData(id);
            // }
            )
        }
    }
    async loadConsignmentData(id) {
        let res = await ConsignmentService.getAditionalDetails(id)
        let formData = this.state.formData;

        if (res.status) {
            console.log("res", res.data.view)
            formData.height = res.data.view.height;
            formData.width = res.data.view.width;
            formData.depth = res.data.view.depth;
            formData.net_weight = res.data.view.net_weight;
            formData.gross_weight = res.data.view.gross_weight;
            formData.quantity = res.data.view.quantity;
            formData.pack_size = res.data.view.pack_size;
            formData.volume_factor = res.data.view.volume_factor;

            if (res.data.view.uom.length != 0) {
                formData.uoms = res.data.view.uom

                formData.uoms.forEach((element, index) => {
                    if (parseInt(this.state.formData.uoms[index].quantity) == parseInt(this.state.formData.pack_size)) {
                        this.setState({ min_pack_index: index })
                    }
                    if (parseInt(this.state.formData.uoms[index].quantity) == parseInt(this.state.formData.volume_factor)) {
                        this.setState({ volume_factor_index: index })
                    }


                });




            } else {
                formData.uoms = [{
                    uom_id: null,
                    level: 1,
                    quantity: 1,
                    conversation: "1"
                },]
            }
            if (res.data.view.batch.length != 0) {
                formData.batches = res.data.view.batch
            }

            this.setState({
                data: res.data.view,
                formData
            })
        }

    }


    addNewBatch() {
        let itemBatches = this.state.itemBatches
        itemBatches.push({
            data: [
                {
                    batch_no: '',
                    manufacture_date: '',
                    expiry_date: '',
                    received_quantity: '',
                    invoice_quantity: '',
                    short_excess: '',
                    unit_value: '',
                    value: '',
                },
                {
                    batch_no: '',
                    manufacture_date: '',
                    expiry_date: '',
                    received_quantity: '',
                    invoice_quantity: '',
                    short_excess: '',
                    unit_value: '',
                    value: '',
                },
            ],
            sr_no: null,
            item_name: null,
            item_description: null,
            donation:null
        })
        this.setState({ itemBatches })
    }

    addNewRow(index) {
        this.setState({ loading: false })
        // let itemBatches = this.state.itemBatches
        let data = this.state.data
         data[index].push({
            batch_no: '',
            manufacture_date: '',
            expiry_date: '',
            received_quantity: '',
            invoice_quantity: '',
            short_excess: '',
            unit_value: '',
            value: '',
        })
        this.setState({ data, loading: true })
    }
    componentDidMount(){
        let id = this.props.match.params.id;
        console.log('NOTE ID',id )
        this.LoadDataByID(id)
        this.loadAllUoms();
    }
    addNewUom() {
        let formData = this.state.formData;
        let uoms = formData.uoms;
        uoms.push({
            uom_id: null,
            level: uoms.length + 1,
            quantity: null,
            conversation: null
        })
        formData.uoms = uoms;
        
        this.setState({ formData })
    }
    async onChangeBatchValue(index, name, value) {
        let formData = this.state.formData;
        formData.batches[index][name] = value;
        this.setState({ formData })
    }

    async LoadDataByID(id) {
        this.setState({ loaded: false })
        // console.log("State 1:", this.state.data)
        let res = await DonarService.getDonationbyID(id)
             if (res.status == 200) {
                let formData = {
                    donation_id: res.data.view?.Donor?.donor_gen_id,
                    address: res.data.view?.Donor?.address,
                    donor_invoice_no: res.data.view?.donors_invoice_no,
                    recevied_date: res.data.view?.received_date,
                    donation_reg_no: res.data.view?.donation_reg_no,
                    donors_invoice_date:res.data.view?.donors_invoice_date,
                    donor_contact_no:  res.data.view?.Donor?.contact_no,
                    donor_name: res.data.view?.Donor?.name,
                    donor_country: res.data.view?.Donor?.country,
                    description: res.data.view?.Donor?.description,
                    delivery_person: res.data.view?.delivery_person,
                    delivery_person_contact_no: res.data.view?.delivery_person_contact_no,
                   
                }
            this.setState({
                formData: formData,
                loaded: true
            }, () => console.log('resdata', this.state.donation))
        } 
       }

    render() {
        const { classes } = this.props
        return (
            <MainContainer>
                {this.state.loaded?<div>
                    <LoonsCard>
                    <CardTitle title="Donation Registration Continue - Donation Note" />
                    <div className="pt-7"></div>
                    <ValidatorForm>
                        <Grid container spacing={2}>
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
                                    value={this.state.formData.donor_invoice_no}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        formData.donor_invoice_no =
                                            e.target.value
                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle
                                    title={'Donation Receiving Date'}
                                ></SubTitle>
                                <DatePicker
                                    className="w-full"
                                    value={this.state.formData.recevied_date}
                                    //label="Date From"
                                    //placeholder="Enter Donation Received Date"
                                    // minDate={new Date()}
                                    //maxDate={new Date("2020-10-20")}
                                    required={true}
                                    errorMessages="this field is required"
                                    onChange={(date) => {
                                        let formData = this.state.formData
                                        formData.recevied_date = date
                                        this.setState({ formData })
                                    }}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={'Donation Reg No'}></SubTitle>
                                <TextValidator
                                    className="w-full"
                                    //placeholder="Enter Donation Reg No"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={this.state.formData.donation_reg_no}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        formData.donation_reg_no =
                                            e.target.value
                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                   
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle
                                    title={"Donor's Invoice Date"}
                                ></SubTitle>
                                <DatePicker
                                    className="w-full"
                                    value={
                                        this.state.formData.donors_invoice_date
                                    }
                                    //label="Date From"
                                    //placeholder="Enter Donation Received Date"
                                    // minDate={new Date()}
                                    //maxDate={new Date("2020-10-20")}
                                    required={true}
                                    errorMessages="this field is required"
                                    onChange={(date) => {
                                        let formData = this.state.formData
                                        formData.donors_invoice_date = date
                                        this.setState({ formData })
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
                                    variant="outlined"
                                    size="small"
                                    value={this.state.formData.donation_id}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        formData.donation_id = e.target.value
                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={'Address'}></SubTitle>
                                <TextValidator
                                    className="w-full"
                                    //placeholder="Address"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={this.state.formData.address}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        formData.address = e.target.value
                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={'Donor Contact No'}></SubTitle>
                                <TextValidator
                                    className="w-full"
                                    //placeholder="Donor Contact No"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={this.state.formData.donor_contact_no}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        formData.donor_contact_no =
                                            e.target.value
                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={'Donor Name'}></SubTitle>
                                <TextValidator
                                    className="w-full"
                                    //placeholder="Donor Name"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={this.state.formData.donor_name}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        formData.donor_name = e.target.value
                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={'Donor Country'}></SubTitle>
                                <TextValidator
                                    className="w-full"
                                    //placeholder="Donor Country"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={this.state.formData.donor_country}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        formData.donor_country = e.target.value
                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={'Description'}></SubTitle>
                                <TextValidator
                                    className="w-full"
                                    //placeholder="Enter Description"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={this.state.formData.description}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        formData.description = e.target.value
                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <hr />

                        <h5>Details of Delivery Person</h5>

                        <Grid container spacing={2}>
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={'Delivery Person'}></SubTitle>
                                <TextValidator
                                    className="w-full"
                                    //placeholder="Delivery Person"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={this.state.formData.delivery_person}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        formData.delivery_person =
                                            e.target.value
                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
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
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state.formData
                                            .delivery_person_contact_no
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        formData.delivery_person_contact_no =
                                            e.target.value
                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        {/* <hr /> */}
                        {/* <Grid container spacing={2}>
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle
                                    title={'Receiving Officer Name'}
                                ></SubTitle>
                                <TextValidator
                                    className="w-full"
                                    //placeholder="Receiving Officer Name"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state.formData
                                            .receiving_officer_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        formData.receiving_officer_name =
                                            e.target.value
                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle
                                    title={'Security Officer Name'}
                                ></SubTitle>
                                <TextValidator
                                    className="w-full"
                                    //placeholder="Security Officer Name"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state.formData
                                            .security_officer_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        formData.security_officer_name =
                                            e.target.value
                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={'Delivered By'}></SubTitle>
                                <TextValidator
                                    className="w-full"
                                    //placeholder="Delivered By"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={this.state.formData.delivered_by}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        formData.delivered_by = e.target.value
                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </Grid>
                        </Grid> */}

                        <br />
                        <hr />
                        {

                        this.state.itemBatches.map((item, index) => (
                        <Grid container className="mb-7">
                            <Grid container spacing={2}>
                                {/* <Grid item lg={4} md={4} sm={12} xs={12}>
                                    <SubTitle title={'SR No'}></SubTitle>
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.sr_no}
                                       
                                        getOptionLabel={(option) => option.name}
                                       
                                        onChange={(event, value) => {
                                            if (value) {
                                                this.loadContainers(value.id)
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Choose SR No"
                                                //variant="outlined"
                                                //value={}
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                size="small"
                                              
                                            />
                                        )}
                                    />
                                </Grid> */}

                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                    <SubTitle title={'Item Name'}></SubTitle>
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Item Name"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.item_name}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            formData.item_name = e.target.value
                                            this.setState({ formData })
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>

                                <Grid item lg={4} md={4} sm={12} xs={12}>
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
                                            this.state.formData.item_description
                                        }
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            formData.item_description =
                                                e.target.value
                                            this.setState({ formData })
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                            </Grid>

                            {/*  Table Section */}
                            {/* <Grid container="container" className="mt-3 pb-5">
                                <Grid
                                    item="item"
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                > */}
                                    {/* {this.state.loading ? (
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.itemBatches[index].data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: 10,
                                                page: this.state.page,
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
                                                            // this.setPage(     tableState.page )
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
                                    )} */}
                                {/* </Grid> */}
                            {/* </Grid>  */}
                            {/* <AddDetails ></AddDetails> */}
                            <div className=' px-3 py-3' style={{ backgroundColor: "#fef1e0" }}>
                                    {
                                        this.state.formData.batches.map((items, i) => (
                                            <Grid container spacing={2}>

                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Batch Number"}></SubTitle>
                                                        : null}
                                                    <TextValidator
                                                        className='w-full'
                                                        placeholder="Batch Number"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state
                                                                .formData
                                                                .batches[i].batch_no
                                                        }
                                                        onChange={(e, value) => {
                                                            this.onChangeBatchValue(i, 'batch_no', e.target.value)

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
                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"EXD"}></SubTitle>
                                                        : null}

                                                    <DatePicker
                                                        className="w-full"
                                                        value={
                                                            this.state
                                                                .formData
                                                                .batches[i].exd
                                                        }
                                                        placeholder="EXD"
                                                        // minDate={new Date()}
                                                        //maxDate={new Date()}
                                                        errorMessages="this field is required"
                                                        onChange={(date) => {
                                                            this.onChangeBatchValue(i, 'exd', date)

                                                        }}
                                                    />

                                                </Grid>
                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"MFD"}></SubTitle>
                                                        : null}

                                                    <DatePicker
                                                        className="w-full"
                                                        value={
                                                            this.state
                                                                .formData
                                                                .batches[i].mfd
                                                        }
                                                        placeholder="MFD"
                                                        // minDate={new Date()}
                                                        //maxDate={new Date()}
                                                        errorMessages="this field is required"
                                                        onChange={(date) => {
                                                            this.onChangeBatchValue(i, 'mfd', date)

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
                                                                .batches[i].mfd
                                                        }
                                                        onChange={(e, value) => {
                                                            this.onChangeBatchValue(i, 'mfd', e.target.value)

                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                        ]}
                                                    /> */}
                                                </Grid>
                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Recieved Quantity"}></SubTitle>
                                                        : null}
                                                    <TextValidator
                                                        className='w-full'
                                                        placeholder="Quantity"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state
                                                                .formData
                                                                .batches[i].quantity
                                                        }
                                                        onChange={(e, value) => {
                                                            let total_qantitiy = parseFloat(e.target.value)
                                                            this.state.formData.batches.forEach((element, index) => {
                                                                if (index != i) {
                                                                    total_qantitiy = parseFloat(total_qantitiy) + parseFloat(this.state.formData.batches[index].quantity);
                                                                }


                                                            });

                                                            if (parseFloat(this.state.formData.quantity) >= total_qantitiy) {
                                                                this.onChangeBatchValue(i, 'quantity', e.target.value)

                                                                let formData = this.state.formData
                                                                formData.batches[i].no_of_pack = e.target.value / formData.volume_factor

                                                            } else {
                                                                this.onChangeBatchValue(i, 'quantity', e.target.value)
                                                                this.setState({
                                                                    snackbar: true,
                                                                    snackbar_severity: 'error',
                                                                    snackbar_message: "Cannot Over the Order Quantity"
                                                                })
                                                            }

                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                        ]}
                                                    />

                                                </Grid>
                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                <SubTitle title={"Invoiced Quantity"}></SubTitle>
                                                        : null}
                                                    <TextValidator
                                                        className='w-full'
                                                        placeholder="Quantity"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state
                                                                .formData
                                                                .batches[i].quantity
                                                        }
                                                        onChange={(e, value) => {
                                                            let total_qantitiy = parseFloat(e.target.value)
                                                            this.state.formData.batches.forEach((element, index) => {
                                                                if (index != i) {
                                                                    total_qantitiy = parseFloat(total_qantitiy) + parseFloat(this.state.formData.batches[index].quantity);
                                                                }


                                                            });

                                                            if (parseFloat(this.state.formData.quantity) >= total_qantitiy) {
                                                                this.onChangeBatchValue(i, 'quantity', e.target.value)

                                                                let formData = this.state.formData
                                                                formData.batches[i].no_of_pack = e.target.value / formData.volume_factor

                                                            } else {
                                                                this.onChangeBatchValue(i, 'quantity', e.target.value)
                                                                this.setState({
                                                                    snackbar: true,
                                                                    snackbar_severity: 'error',
                                                                    snackbar_message: "Cannot Over the Order Quantity"
                                                                })
                                                            }

                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                        ]}
                                                    />

                                                </Grid>
                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Short/Excess"}></SubTitle>
                                                        : null}
                                                    <TextValidator
                                                        className='w-full'
                                                        placeholder="Short/Excess"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state
                                                                .formData
                                                                .batches[i].quantity
                                                        }
                                                        onChange={(e, value) => {
                                                            let total_qantitiy = parseFloat(e.target.value)
                                                            this.state.formData.batches.forEach((element, index) => {
                                                                if (index != i) {
                                                                    total_qantitiy = parseFloat(total_qantitiy) + parseFloat(this.state.formData.batches[index].quantity);
                                                                }


                                                            });

                                                            if (parseFloat(this.state.formData.quantity) >= total_qantitiy) {
                                                                this.onChangeBatchValue(i, 'quantity', e.target.value)

                                                                let formData = this.state.formData
                                                                formData.batches[i].no_of_pack = e.target.value / formData.volume_factor

                                                            } else {
                                                                this.onChangeBatchValue(i, 'quantity', e.target.value)
                                                                this.setState({
                                                                    snackbar: true,
                                                                    snackbar_severity: 'error',
                                                                    snackbar_message: "Cannot Over the Order Quantity"
                                                                })
                                                            }

                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                        ]}
                                                    />

                                                </Grid>
                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Damage"}></SubTitle>
                                                        : null}
                                                    <TextValidator
                                                        className='w-full'
                                                        placeholder="Damage"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state
                                                                .formData
                                                                .batches[i].quantity
                                                        }
                                                        onChange={(e, value) => {
                                                            let total_qantitiy = parseFloat(e.target.value)
                                                            this.state.formData.batches.forEach((element, index) => {
                                                                if (index != i) {
                                                                    total_qantitiy = parseFloat(total_qantitiy) + parseFloat(this.state.formData.batches[index].quantity);
                                                                }


                                                            });

                                                            if (parseFloat(this.state.formData.quantity) >= total_qantitiy) {
                                                                this.onChangeBatchValue(i, 'quantity', e.target.value)

                                                                let formData = this.state.formData
                                                                formData.batches[i].no_of_pack = e.target.value / formData.volume_factor

                                                            } else {
                                                                this.onChangeBatchValue(i, 'quantity', e.target.value)
                                                                this.setState({
                                                                    snackbar: true,
                                                                    snackbar_severity: 'error',
                                                                    snackbar_message: "Cannot Over the Order Quantity"
                                                                })
                                                            }

                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                        ]}
                                                    />

                                                </Grid>





                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Unit Value"}></SubTitle>
                                                        : null}
                                                    <TextValidator
                                                        className='w-full'
                                                        placeholder="Unit Value"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state
                                                                .formData
                                                                .batches[i].no_of_pack
                                                        }
                                                        onChange={(e, value) => {
                                                            //this.onChangeBatchValue(i, 'no_of_pack', e.target.value)

                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                        ]}
                                                    />
                                                </Grid>
                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                   <SubTitle title={"Value(Received x Unit Price)"}></SubTitle>
                                                   : null}
                                                    <TextValidator
                                                        className='w-full'
                                                        placeholder="Value "
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state
                                                                .formData
                                                                .batches[i].unit_price
                                                        }
                                                        onChange={(e, value) => {
                                                            this.onChangeBatchValue(i, 'unit_price', e.target.value)

                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                        ]}
                                                    />
                                                </Grid>
                                                <Grid item lg={2} md={2} sm={12} xs={12} >
                                <SubTitle title={"Height(CM)"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Height(CM)"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .delivered_by
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.delivered_by = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} sm={12} xs={12} >
                                <SubTitle title={"Width(CM)"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Width(CM)"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .delivered_by
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.delivered_by = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} sm={12} xs={12} >
                                <SubTitle title={"Length(CM)"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Length(CM)"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .delivered_by
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.delivered_by = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} sm={12} xs={12} >
                                <SubTitle title={'Net.Weight(Kg)'}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Net.Weight"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .delivered_by
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.delivered_by = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} sm={12} xs={12} >
                                <SubTitle title={"Gross.Weight"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Gross.Weight"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .delivered_by
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.delivered_by = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>


                                            </Grid>
                                        ))
                                    }
                                    <Typography className=" pt-2text-gray font-semibold text-15">Packing Details</Typography>
                                    {
                                        this.state.formData.uoms.map((item, i) => (
                                            <Grid container spacing={2}>

                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Pack Size"}></SubTitle>
                                                        : null}
                                                    <p>{"Level " + item.level}</p>
                                                </Grid>
                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"UOM"}></SubTitle>
                                                        : null}
                                                    <Autocomplete
                                        disableClearable
                                                        className="w-full"
                                                        options={this.state.all_uoms}
                                                        /*  defaultValue={this.setState.all_uoms.find(
                                                              (v) => v.value == ''
                                                          )}  */
                                                        getOptionLabel={(option) => option.name}
                                                        /*  getOptionSelected={(option, value) =>
                                                             console.log("ok")
                                                         } */

                                                        value={this.state.all_uoms.find(
                                                            (v) =>
                                                                v.id ==
                                                                this.state.formData.uoms[i].uom_id
                                                        )}
                                                        onChange={(event, value) => {
                                                            this.onChangeUomValue(i, 'uom_id', value.id)
                                                        }

                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="UOM"
                                                                //variant="outlined"
                                                                //value={}
                                                                value={this.state.all_uoms.find(
                                                                    (v) =>
                                                                        v.id ==
                                                                        this.state.formData.uoms[i].uom_id
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
                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Qty"}></SubTitle>
                                                        : null}
                                                    <TextValidator
                                                        className='w-full'
                                                        placeholder="Qty"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state
                                                                .formData
                                                                .uoms[i].quantity
                                                        }
                                                        onChange={(e) => {
                                                            this.onChangeUomValue(i, 'quantity', e.target.value)

                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                        ]}
                                                    />
                                                </Grid>
                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Conversion"}></SubTitle>
                                                        : null}

                                                    <div className='pt-3'>{this.state.formData.uoms[i].conversation}</div>

                                                </Grid>

                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Minimum pack Factor"}></SubTitle>
                                                        : null}

                                                    <Checkbox
                                                        size="small"
                                                        color='primary'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            if (this.state.formData.uoms[i].quantity == null || this.state.formData.uoms[i].quantity == '') {
                                                                this.setState({
                                                                    snackbar: true,
                                                                    snackbar_severity: 'error',
                                                                    snackbar_message: "Please add Quantity Before"
                                                                })
                                                            } else {
                                                                formData.pack_size = this.state.formData.uoms[i].quantity;
                                                                this.setState({ formData, min_pack_index: i })
                                                                console.log("formdata", this.state.formData)
                                                            }

                                                        }}
                                                        checked={this.state.min_pack_index == i ? true : false}
                                                    />

                                                </Grid>

                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Storing Level"}></SubTitle>
                                                        : null}


                                                    <Checkbox
                                                        size="small"
                                                        color='primary'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            if (this.state.formData.uoms[i].quantity == null || this.state.formData.uoms[i].quantity == '') {
                                                                this.setState({
                                                                    snackbar: true,
                                                                    snackbar_severity: 'error',
                                                                    snackbar_message: "Please add Quantity Before"
                                                                })
                                                            } else {
                                                                formData.volume_factor = this.state.formData.uoms[i].quantity;
                                                                this.setState({ formData, volume_factor_index: i })
                                                                console.log("formdata", this.state.formData)
                                                            }

                                                        }}
                                                        checked={this.state.volume_factor_index == i ? true : false}
                                                    />

                                                </Grid>

                                            </Grid>
                                        ))
                                    }
                                    {this.state.is_editable ?
                                        <Grid container>
                                            <Grid className='flex items-center' item lg={2} md={2} sm={12} xs={12}>
                                                <Fab size="small" color="primary" aria-label="add" onClick={() => { this.addNewUom() }}>
                                                    <AddIcon />
                                                </Fab>
                                                <Typography className=" text-gray font-semibold text-14 mx-2">Add New Size</Typography>
                                            </Grid>

                                        </Grid>
                                        : null}

                                </div>


                            <Grid container spacing={2}>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle
                                        title={'Total Quantity Received'}
                                    ></SubTitle>
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Total Quantity Received"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={
                                            this.state.formData
                                                .total_quantity_received
                                        }
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            formData.total_quantity_received =
                                                e.target.value
                                            this.setState({ formData })
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>

                                <Grid item>
                              
                                    <Button
                                        className="mr-2 mt-7"
                                        progress={false}
                                        //type="submit"
                                        scrollToTop={false}
                                        onClick={() => this.addNewRow(index)}
                                    >
                                        <span>Click to Add a Batch</span>
                                    </Button>
                                </Grid>
                            </Grid>
                            
                            
                        </Grid>))
                        
                        }

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
                    </ValidatorForm>
                    
                </LoonsCard>

                </div>
             :
             <Grid className="justify-center text-center w-full pt-12">
                 <CircularProgress size={30} />
             </Grid>    
            }
                
                <Dialog maxWidth="lg " open={this.state.packagingDetails} onClose={() => { this.setState({ packagingDetails: false }) }}  >
                <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Package Details" />
                        <IconButton aria-label="close" className={classes.closeButton}
                        onClick={() => {
                            this.setState({ 
                                packagingDetails: false
                               
                            })
                        }}
                           >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>
                    <ValidatorForm onSubmit={() => { this.submit() }} className='w-full'>


<Grid
    container="container"
    lg={12}
    md={12}
    xs={12}
    className="font-semibold"
    style={{
        alignItems: 'center',
        display: 'flex'
    }}>
<Grid container="container" lg={11} md={12} xs={12} style={{alignItems: 'center'}}>

<Grid container spacing={2}>

{/* <Grid item lg={2} md={2} sm={12} xs={12}>
    
        <SubTitle title={"Pack Size"}></SubTitle>
       
  
</Grid> */}
<Grid item lg={2} md={2} sm={12} xs={12}>
   
        <SubTitle title={"UOM"}></SubTitle>
       
    <Autocomplete
                                        disableClearable
        className="w-full"
        options={this.state.all_uoms}
        /*  defaultValue={this.setState.all_uoms.find(
              (v) => v.value == ''
          )}  */
        getOptionLabel={(option) => option.name}
        /*  getOptionSelected={(option, value) =>
             console.log("ok")
         } */

        // value={this.state.all_uoms.find(
        //     (v) =>
        //         v.id ==
        //         this.state.formData.uoms[i].uom_id
        // )}
        // onChange={(event, value) => {
        //     this.onChangeUomValue(i, 'uom_id', value.id)
        // }

        // }
        renderInput={(params) => (
            <TextValidator
                {...params}
                placeholder="UOM"
                //variant="outlined"
                //value={}
                // value={this.state.all_uoms.find(
                //     (v) =>
                //         v.id ==
                //         this.state.formData.uoms[i].uom_id
                // )}
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
<Grid item lg={2} md={2} sm={12} xs={12}>
   
        <SubTitle title={"Qty"}></SubTitle>
       
    <TextValidator
        className='w-full'
        placeholder="Qty"
        //variant="outlined"
        fullWidth
        variant="outlined"
        size="small"
        // value={
        //     this.state
        //         .formData
        //         .uoms[i].quantity
        // }
        // onChange={(e) => {
        //     this.onChangeUomValue(i, 'quantity', e.target.value)

        // }}
        validators={[
            'required',
        ]}
        errorMessages={[
            'this field is required',
        ]}
    />
</Grid>
<Grid item lg={2} md={2} sm={12} xs={12}>
   
        <SubTitle title={"Conversion"}></SubTitle>
        

    {/* <div className='pt-3'>{this.state.formData.uoms[i].conversation}</div> */}

</Grid>

<Grid item lg={2} md={2} sm={12} xs={12}>
  
        <SubTitle title={"Minimum pack Factor"}></SubTitle>
       

    <Checkbox
        size="small"
        color='primary'
        // onChange={() => {
        //     let formData = this.state.formData;
        //     if (this.state.formData.uoms[i].quantity == null || this.state.formData.uoms[i].quantity == '') {
        //         this.setState({
        //             snackbar: true,
        //             snackbar_severity: 'error',
        //             snackbar_message: "Please add Quantity Before"
        //         })
        //     } else {
        //         formData.pack_size = this.state.formData.uoms[i].quantity;
        //         this.setState({ formData, min_pack_index: i })
        //         console.log("formdata", this.state.formData)
        //     }

        // }}
        // checked={this.state.min_pack_index == i ? true : false}
    />

</Grid>

<Grid item lg={2} md={2} sm={12} xs={12}>
   
        <SubTitle title={"Storing Level"}></SubTitle>
        


    <Checkbox
        size="small"
        color='primary'
        // onChange={() => {
        //     let formData = this.state.formData;
        //     if (this.state.formData.uoms[i].quantity == null || this.state.formData.uoms[i].quantity == '') {
        //         this.setState({
        //             snackbar: true,
        //             snackbar_severity: 'error',
        //             snackbar_message: "Please add Quantity Before"
        //         })
        //     } else {
        //         formData.volume_factor = this.state.formData.uoms[i].quantity;
        //         this.setState({ formData, volume_factor_index: i })
        //         console.log("formdata", this.state.formData)
        //     }

        // }}
        // checked={this.state.volume_factor_index == i ? true : false}
    />

</Grid>

</Grid>

  
</Grid>
{/* <Grid item lg={2} md={2} sm={12} xs={12}>
    
        <SubTitle title={"Pack Size"}></SubTitle>
       
  
</Grid> */}
<Grid item lg={2} md={2} sm={12} xs={12} >
                                <SubTitle title={"Height(CM)"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Height(CM)"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .delivered_by
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.delivered_by = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} sm={12} xs={12} className='ml-2'>
                                <SubTitle title={"Width(CM)"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Width(CM)"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .delivered_by
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.delivered_by = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} sm={12} xs={12} className='ml-2'>
                                <SubTitle title={"Length(CM)"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Length(CM)"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .delivered_by
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.delivered_by = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} sm={12} xs={12} className='ml-2'>
                                <SubTitle title={"Net.Weight"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Net.Weight"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .delivered_by
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.delivered_by = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} sm={12} xs={12} className='ml-2'>
                                <SubTitle title={"Gross.Weight"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Gross.Weight"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .delivered_by
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.delivered_by = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>


                       

        </Grid>
               </ValidatorForm>
</MainContainer>
                </Dialog>


            </MainContainer>
        )
    }
}

export default withStyles(styleSheet)(DonationNote)
