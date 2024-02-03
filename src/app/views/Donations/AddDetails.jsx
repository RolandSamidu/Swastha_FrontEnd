import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Card,
    Icon,
    IconButton,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    Fab,
    Tooltip,
    Typography,
    Divider,
    Link,
    InputAdornment
} from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add';
import { Alert } from '@material-ui/lab'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import 'date-fns'
import VisibilityIcon from '@material-ui/icons/Visibility'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { themeColors } from 'app/components/MatxTheme/themeColors'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
    LoonsTable,
    DatePicker,
    FilePicker,
    Button,
    ExcelToTable,
    LoonsSnackbar,
    LoonsSwitch,
    MainContainer,
    LoonsDialogBox,
    LoonsCard,
    CardTitle,
    SubTitle
} from 'app/components/LoonsLabComponents'
import * as appconst from '../../../appconst'

import ConsignmentService from 'app/services/ConsignmentService'
import localStorageService from 'app/services/localStorageService';

import LoonsDatePicker from 'app/components/LoonsLabComponents/DatePicker'
import LoonsButton from 'app/components/LoonsLabComponents/Button'

const styleSheet = (theme) => ({})

class AddDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            is_editable: true,

            //snackbar
            snackbar: false,
            snackbar_message: '',
            snackbar_severity: 'success',

            min_pack_index: null,
            volume_factor_index: null,
            allocated_quantity: null,

            currentPage: 0,
            totalItems: 0,
            totalPages: 0,
            filterData: {
                limit: 20,
                page: 0,
                orderListNo: null,

            },
            all_uoms: [],
            formData: {
                height: ' ',
                width: ' ',
                depth: ' ',
                net_weight: ' ',
                gross_weight: ' ',
                pack_size: ' ',
                volume_factor: ' ',
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
                uoms: []

            },

            //approve - reject bulk
            all_selected_rows: [],

            orderListNo: null,
            data: null,

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
                    if (this.state.formData.uoms[index].quantity == this.state.formData.pack_size) {
                        this.setState({ min_pack_index: index })
                    }
                    if (this.state.formData.uoms[index].quantity == this.state.formData.volume_factor) {
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

    async componentDidMount() {
        let id = '8bd682e3-ab0a-400d-afb1-25fb606eebc9';
        this.loadAllUoms();

        // var user = await localStorageService.getItem('userInfo');
        // console.log('user', user.roles)
        // if (user.roles.includes("SPC MA")) {
        //     this.setState({ is_editable: true })
        // } else {
        //     this.setState({ is_editable: false })
        // }


    }

    async onChangeUomValue(index, name, value) {
        let formData = this.state.formData;
        formData.uoms[index][name] = value;

        if (name = 'quantity') {

            formData.uoms.forEach((element, index) => {
                if (index == 0) {
                    formData.uoms[index].conversation = formData.uoms[index].quantity;
                } else {
                    formData.uoms[index].conversation = formData.uoms[index - 1].conversation + 'X' + formData.uoms[index].quantity / formData.uoms[index - 1].quantity
                }
            });

        }




        this.setState({ formData })
        console.log("formdata", this.state.formData)
    }
    async onChangeBatchValue(index, name, value) {
        let formData = this.state.formData;
        formData.batches[index][name] = value;
        this.setState({ formData })
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

    async submitData() {
        if (this.state.is_editable) {
            let id = this.props.match.params.id;
            if (this.state.formData.volume_factor == null) {
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: "Please Select Storing Level Befor Submit"
                })
            } else if (this.state.formData.pack_size == null) {
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: "Please Select Minimum pack Factor Befor Submit"
                })
            } else {
                let res = await ConsignmentService.editAditionalDetails(id, this.state.formData)
                console.log("res", res)
                if (res.status == 200) {
                    console.log("res", res)
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'success',
                        snackbar_message: "Successfully Saved "
                    }, () => {
                        window.location.reload()
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
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (

            <Fragment>
                <MainContainer>
                    {/* <LoonsCard> */}
                        {/* <CardTitle title="Item Details" /> */}
                        <div className="pt-2">
                            <ValidatorForm
                                onSubmit={() => this.submitData()}
                                onError={() => null}
                            >

                                {/* <Grid container spacing={2}>

                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        {this.state.data != null ?
                                            <SubTitle title={"Item No : " + this.state.data.Order_item.item.sr_no}></SubTitle>
                                            : null}
                                    </Grid>

                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        {this.state.data != null ?
                                            <SubTitle title={"Item Description : " + this.state.data.Order_item.item.long_description}></SubTitle>
                                            : null}
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        {this.state.data != null ?
                                            <SubTitle title={"Order Quantity : " + this.state.formData.quantity}></SubTitle>
                                            : null}
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Height(cm)"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="Height(cm)"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .formData
                                                    .height
                                            }
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.height = e.target.value
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

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"width(cm)"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="width(cm)"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .formData
                                                    .width
                                            }
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.width = e.target.value
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

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Depth(cm)"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="Depth(cm)"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .formData
                                                    .depth
                                            }
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.depth = e.target.value
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

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"CBM"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="CBM"
                                            //variant="outlined"
                                            disabled
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.formData.depth * this.state.formData.width * this.state.formData.height / 1000000
                                            }

                                        />

                                    </Grid>


                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Net.Weight"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="Net.Weight"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .formData
                                                    .net_weight
                                            }
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.net_weight = e.target.value
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

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Gross.Weight"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="Gross.Weight"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .formData
                                                    .gross_weight
                                            }
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.gross_weight = e.target.value
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

                                </Grid> */}


                                <div className=' px-3 py-3' style={{ backgroundColor: "#fef1e0" }}>
                                    {
                                        this.state.formData.batches.map((item, i) => (
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
                                                            'this field is required',
                                                        ]}
                                                    />
                                                    <p>{item.level}</p>
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
                                                            'this field is required',
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
                                                            'this field is required',
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
                                                            'this field is required',
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
                                                            'this field is required',
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
                                                            'this field is required',
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
                                                            'this field is required',
                                                        ]}
                                                    />
                                                </Grid>
                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Value(Received x Unit Price)"}></SubTitle>
                                                        : null}
                                                    <TextValidator
                                                        className='w-full'
                                                        placeholder="Value"
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
                                                            'this field is required',
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
                                                            'this field is required',
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
                                {/************************************************************* */}


                                {/* <div className='mt-8 px-3 py-3' style={{ backgroundColor: "#deeaf5" }}>

                                    <Typography className=" text-gray font-semibold text-15">Batch Details</Typography>



                                    {this.state.is_editable ?
                                        <Grid container>
                                            <Grid className='flex items-center' item lg={2} md={2} sm={12} xs={12}>
                                                <Fab size="small" color="primary" aria-label="add" onClick={() => { this.addNewBatch() }}>
                                                    <AddIcon />
                                                </Fab>
                                                <Typography className=" text-gray font-semibold text-14 mx-2">Add New Batch</Typography>
                                            </Grid>

                                        </Grid>
                                        : null}
                                </div> */}


                                {this.state.is_editable ?
                                    <Button
                                        className="mt-4"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                        startIcon="save"
                                    // onClick={this.onSubmit}
                                    >
                                        <span className="capitalize">Save</span>
                                    </Button>
                                    : null
                                }

                            </ValidatorForm>
                        </div>


                    {/* </LoonsCard> */}
                    <LoonsSnackbar
                        open={this.state.snackbar}
                        onClose={() => {
                            this.setState({ snackbar: false })
                        }}
                        message={this.state.snackbar_message}
                        autoHideDuration={3000}
                        severity={this.state.snackbar_severity}
                        elevation={2}
                        variant="filled"
                    ></LoonsSnackbar>

                </MainContainer>
            </Fragment>

        )
    }
}
export default withStyles(styleSheet)(AddDetails)

