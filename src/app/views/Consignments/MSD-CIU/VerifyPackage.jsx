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

import ConsignmentService from 'app/services/ConsignmentService'

import LoonsDatePicker from 'app/components/LoonsLabComponents/DatePicker'
import LoonsButton from 'app/components/LoonsLabComponents/Button'

const styleSheet = (theme) => ({

    edited: { backgroundColor: '#ffbd00' }

})

class VerifyPackage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,

            //snackbar
            snackbar: false,
            snackbar_message: '',
            snackbar_severity: 'success',
            validate: 'Pending',
            processing: false,

            min_pack_index: null,

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
                sr_no: null,
                height: null,
                width: null,
                depth: null,
                net_weight: null,
                gross_weight: null,
                pack_size: null,
                batches: [
                    {
                        batch_no: null,
                        exd: null,
                        mfd: null,
                        quantity: null,
                        unit_price: null,
                        no_of_pack: null,
                        volume_factor: null,
                        pack_size: null
                    },

                ],
                uoms: []

            },

            formDataOriginal: {

                height: null,
                width: null,
                depth: null,
                net_weight: null,
                gross_weight: null,
                pack_size: null,
                batches: [
                    {
                        batch_no: null,
                        exd: null,
                        mfd: null,
                        quantity: null,
                        unit_price: null,
                        no_of_pack: null,
                        volume_factor: null,
                        pack_size: null
                    },

                ],
                uoms: []

            },

            //approve - reject bulk
            all_selected_rows: [],

            orderListNo: null,
            data: null,
            editData: null

        }
    }






    async loadConsignmentData(id) {
        let res = await ConsignmentService.getAditionalDetails(id)
        let formData = this.state.formData;

        if (res.status) {
            console.log("res data", res)
            formData.sr_no = res.data.view.item_schedule?.Order_item?.item?.sr_no;
            formData.height = res.data.view.height;
            formData.width = res.data.view.width;
            formData.depth = res.data.view.depth;
            formData.net_weight = res.data.view.net_weight;
            formData.gross_weight = res.data.view.gross_weight;
            formData.no_of_pack = res.data.view.no_of_pack;
            formData.volume_factor = res.data.view.volume_factor;
            formData.pack_size = res.data.view.pack_size;
            formData.validating_status = "Not Verified";

            if (res.data.view.uom.length != 0) {
                formData.uoms = res.data.view.uom
                formData.uoms.forEach((element, index) => {
                    if (element.status == undefined) {
                        formData.uoms[index].status = "Not Verified"
                    }

                    delete formData.uoms[index].id;
                })


            } else {
                formData.uoms = [{
                    uom_id: null,
                    level: 1,
                    quantity: null,
                    conversation: "",
                    status: "Not Verified",
                },]
            }
            if (res.data.view.batch.length != 0) {
                formData.batches = res.data.view.batch
                formData.batches.forEach((element, index) => {
                    if (element.status == undefined) {
                        formData.batches[index].status = "Not Verified"
                    }
                    delete formData.batches[index].id;
                })

            }

            this.setState({
                data: res.data.view,
                formData
            })
        }

    }
    async loadAllUoms() {
        let params = { limit: 10000, page: 0 }
        let id = this.props.match.params.id;
        console.log(id);
        let res = await ConsignmentService.getUoms(params)
        if (res.status) {
            console.log("all uoms pending", res.data.view.data)
            this.setState({
                all_uoms: res.data.view.data,

            }, () => {
                this.loadConsignmentData(id);
            })
        }
    }

    async loadAllUomsForVerified() {
        let params = { limit: 10000, page: 0 }
        let id = this.props.match.params.id;
        console.log(id);
        let res = await ConsignmentService.getUoms(params)
        if (res.status) {
            console.log("all uoms verified", res.data.view.data)
            this.setState({
                all_uoms: res.data.view.data,

            }, () => {
                this.loadVerifiedItem();
                this.loadVerifiedItemEdited();
            })
        }
    }

    async loadVerifiedItem() {
        const query = new URLSearchParams(this.props.location.search);
        const id = query.get('ConsignmentItems_id')

        let formData = this.state.formData;
        let res = await ConsignmentService.getConsignmentItemsById(id)

        if (res.status) {
            console.log("consingment item", res.data.view)
            console.log("res data", res)
            formData.height = res.data.view.height;
            formData.width = res.data.view.width;
            formData.depth = res.data.view.depth;
            formData.net_weight = res.data.view.net_weight;
            formData.gross_weight = res.data.view.gross_weight;
            formData.validating_status = res.data.view.validating_status;
            formData.no_of_pack = res.data.view.no_of_pack;
            formData.volume_factor = res.data.view.volume_factor;
            formData.pack_size = res.data.view.pack_size;

            console.log("factor", formData.volume_factor)
            if (res.data.view.UOM.length != 0) {
                formData.uoms = res.data.view.UOM

                formData.uoms.forEach((element, index) => {
                    console.log("factor", formData.uoms[index].quantity)
                    if (element.status == undefined) {
                        formData.uoms[index].status = "Not Verified"
                    }


                })


            } else {
                formData.uoms = [{
                    uom_id: null,
                    level: 1,
                    quantity: null,
                    conversation: "",
                    status: "Not Verified",
                },]
            }
            if (res.data.view.Batch.length != 0) {
                formData.batches = res.data.view.Batch
                formData.batches.forEach((element, index) => {
                    if (element.status == undefined) {
                        formData.batches[index].status = "Not Verified"
                    }
                })

            }

            this.setState({
                data: res.data.view,
                formData
            })

        }
    }



    async loadVerifiedItemEdited() {
        const query = new URLSearchParams(this.props.location.search);
        const id = query.get('ConsignmentItems_id')

        let formDataOriginal = this.state.formDataOriginal;
        let params = { search_type: 'SPC' }
        let res = await ConsignmentService.getConsignmentItemsByIdWithParams(id, params)

        if (res.status) {
            console.log("consingment item edit", res.data.view)
            console.log("res data", res)
            formDataOriginal.height = res.data.view.height;
            formDataOriginal.width = res.data.view.width;
            formDataOriginal.depth = res.data.view.depth;
            formDataOriginal.net_weight = res.data.view.net_weight;
            formDataOriginal.gross_weight = res.data.view.gross_weight;
            formDataOriginal.validating_status = res.data.view.validating_status;
            formDataOriginal.no_of_pack = res.data.view.no_of_pack;
            formDataOriginal.volume_factor = res.data.view.volume_factor;
            formDataOriginal.pack_size = res.data.view.pack_size;

            console.log("factor", formDataOriginal.volume_factor)
            if (res.data.view.UOM.length != 0) {
                formDataOriginal.uoms = res.data.view.UOM

                formDataOriginal.uoms.forEach((element, index) => {
                    console.log("factor", formDataOriginal.uoms[index].quantity)
                    if (element.status == undefined) {
                        formDataOriginal.uoms[index].status = "Not Verified"
                    }


                })


            } else {
                formDataOriginal.uoms = [{
                    uom_id: null,
                    level: 1,
                    quantity: null,
                    conversation: "",
                    status: "Not Verified",
                },]
            }
            if (res.data.view.Batch.length != 0) {
                formDataOriginal.batches = res.data.view.Batch
                formDataOriginal.batches.forEach((element, index) => {
                    if (element.status == undefined) {
                        formDataOriginal.batches[index].status = "Not Verified"
                    }
                })

            }

            this.setState({
                editData: res.data.view,
                formDataOriginal
            })

        }
    }

    async componentDidMount() {
        let id = this.props.match.params.id;

        const query = new URLSearchParams(this.props.location.search);
        const validate = query.get('validate')
        this.setState({ validate: validate })

        if (validate == "Pending") {

            this.loadAllUomsForVerified();
        } else {
            this.loadAllUomsForVerified()
        }


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
            conversation: null,
            status: "Not Verified"
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
            unit_price: null,
            status: "Not Verified"

        })
        formData.batches = batches;
        this.setState({ formData })
    }

    async submitData() {
        this.setState({ processing: true })
        console.log("form data", this.state.formData)
        const query = new URLSearchParams(this.props.location.search);
        const id = query.get('ConsignmentItems_id')
        let formData = this.state.formData;
        formData.ciu_editing = true;


        let res = await ConsignmentService.patchConsignmentItem(id, formData)
        console.log("res", res)
        if (res.status == 200) {
            console.log("res", res)
            this.setState({
                snackbar: true,
                snackbar_severity: 'success',
                snackbar_message: "Successfully Saved ",
                processing: false
            }, () => {
                window.history.back()
            })
        } else {
            this.setState({
                snackbar: true,
                snackbar_severity: 'error',
                snackbar_message: "Cannot Verify ",
                processing: false
            })
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (

            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Item Details" />
                        <div className="pt-7">
                            <ValidatorForm
                                onSubmit={() => this.submitData()}
                                onError={() => null}
                            >

                                <Grid container spacing={2}>

                                    {/*    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        {this.state.data != null ?
                                            <SubTitle title={"Item No : " + this.state.data.Order_item.item.sr_no}></SubTitle>
                                            : null}
                                    </Grid>

                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        {this.state.data != null ?
                                            <SubTitle title={"Item Description : " + this.state.data.Order_item.item.long_description}></SubTitle>
                                            : null}
                                    </Grid> */}

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Height(cm)"}></SubTitle>
                                        <TextValidator
                                            className={['w-full', Number(this.state.formData.height) != Number(this.state.formDataOriginal.height) ? classes.edited : null]}
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
                                            className={['w-full', Number(this.state.formData.width) != Number( this.state.formDataOriginal.width )? classes.edited : null]}
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
                                            className={['w-full',  Number(this.state.formData.depth) !=  Number(this.state.formDataOriginal.depth) ? classes.edited : null]}

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
                                        <SubTitle title={"Net.Weight"}></SubTitle>
                                        <TextValidator
                                            className={['w-full',  Number(this.state.formData.net_weight) !=  Number(this.state.formDataOriginal.net_weight) ? classes.edited : null]}

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
                                            className={['w-full',  Number(this.state.formData.gross_weight) !=  Number(this.state.formDataOriginal.gross_weight) ? classes.edited : null]}
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



                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Validation"}></SubTitle>
                                        <Checkbox
                                            size="small"
                                            color='primary'
                                            onChange={() => {
                                                let formData = this.state.formData;
                                                if (formData.validating_status == "Verified") {
                                                    formData.validating_status = "Not Verified"

                                                } else {
                                                    formData.validating_status = "Verified"
                                                }
                                                this.setState({ formData })
                                                console.log("formdata", this.state.formData)


                                            }}
                                            checked={this.state.formData.validating_status ? (this.state.formData.validating_status == "Verified" ? true : false) : false}
                                        />
                                    </Grid>


                                </Grid>


                                <div className='mt-8 px-3 py-3' style={{ backgroundColor: "#fef1e0" }}>
                                    <Typography className=" text-gray font-semibold text-15">Packing Details</Typography>


                                    {
                                        this.state.formData.uoms.map((item, i) => (
                                            <Grid container spacing={2}>

                                                <Grid item lg={1} md={1} sm={12} xs={12}>
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
                                                        className={['w-full', this.state.formData.uoms[i].uom_id != this.state.formDataOriginal.uoms[i]?.uom_id ? classes.edited : null]}
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
                                                        className={['w-full', this.state.formData.uoms[i].quantity != this.state.formDataOriginal.uoms[i]?.quantity ? classes.edited : null]}
                                                        placeholder="Qty"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={this.state.formData
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
                                                    <p >
                                                        {this.state
                                                            .formData
                                                            .uoms[i].conversation}
                                                    </p>


                                                </Grid>

                                                <Grid item lg={1} md={1} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Minimum pack Factor"}></SubTitle>
                                                        : null}
                                                    {console.log('ggggggggggggggg', this.state.formData)}
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

                                                        checked={Number(this.state.formData.uoms[i].quantity) == Number(this.state.formData.pack_size) ? true : false}
                                                    />

                                                </Grid>

                                                <Grid item lg={1} md={1} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Storing Level"}></SubTitle>
                                                        : null}


                                                    <Checkbox
                                                        size="small"
                                                        color='primary'

                                                        checked={parseInt(this.state.formData.uoms[i].quantity) == parseInt(this.state.formData.volume_factor) ? true : false}
                                                    />

                                                </Grid>

                                                {/*  <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Minimum pack Factor"}></SubTitle>
                                                        : null}
                                                    <Radio
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

                                                </Grid> */}


                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Select"}></SubTitle>
                                                        : null}
                                                    <Checkbox
                                                        size="small"
                                                        color='primary'
                                                        onChange={() => {
                                                            let formData = this.state.formData;

                                                            if (formData.uoms[i].status == "Verified") {
                                                                formData.uoms[i].status = "Not Verified"

                                                            } else {
                                                                formData.uoms[i].status = "Verified"
                                                            }

                                                            this.setState({ formData })
                                                            console.log("formdata", this.state.formData)


                                                        }}

                                                        checked={
                                                            this.state.formData.uoms[i].status != undefined ? (this.state.formData.uoms[i].status == "Verified" ? true : false) : false
                                                        }

                                                    // checked={this.state.formData.uoms[i].status?(this.state.formData.uoms[i].status = "Verified" ? true : false):false}
                                                    />

                                                </Grid>



                                            </Grid>
                                        ))
                                    }
                                    <Grid container>
                                        <Grid className='flex items-center' item lg={2} md={2} sm={12} xs={12}>
                                            <Fab size="small" color="primary" aria-label="add" onClick={() => { this.addNewUom() }}>
                                                <AddIcon />
                                            </Fab>
                                            <Typography className=" text-gray font-semibold text-14 mx-2">Add New Size</Typography>
                                        </Grid>

                                    </Grid>

                                </div>
                                {/************************************************************* */}


                                <div className='mt-8 px-3 py-3' style={{ backgroundColor: "#deeaf5" }}>

                                    <Typography className=" text-gray font-semibold text-15">Batch Details</Typography>


                                    {
                                        this.state.formData.batches.map((item, i) => (
                                            <Grid container spacing={2}>

                                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Batch Number"}></SubTitle>
                                                        : null}
                                                    <TextValidator
                                                        className={['w-full', this.state.formData.batches[i].batch_no != this.state.formDataOriginal.batches[i]?.batch_no ? classes.edited : null]}
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
                                                        <SubTitle title={"Qty"}></SubTitle>
                                                        : null}
                                                    <TextValidator
                                                        className={['w-full', Number(this.state.formData.batches[i].quantity) != Number(this.state.formDataOriginal.batches[i]?.quantity) ? classes.edited : null]}
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
                                                            this.onChangeBatchValue(i, 'quantity', e.target.value)

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
                                                        <SubTitle title={"MFD"}></SubTitle>
                                                        : null}

                                                    <DatePicker
                                                        className={['w-full', this.state.formData.batches[i].mfd != this.state.formDataOriginal.batches[i]?.mfd ? classes.edited : null]}
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
                                                        <SubTitle title={"EXD"}></SubTitle>
                                                        : null}

                                                    <DatePicker
                                                        className={['w-full', this.state.formData.batches[i].exd != this.state.formDataOriginal.batches[i]?.exd ? classes.edited : null]}
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
                                                        <SubTitle title={"Unit Price(LKR)"}></SubTitle>
                                                        : null}
                                                    <TextValidator
                                                        className={['w-full', this.state.formData.batches[i].unit_price != this.state.formDataOriginal.batches[i]?.unit_price ? classes.edited : null]}
                                                        placeholder="Unit Price"
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


                                                <Grid item lg={1} md={1} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"No of Pack"}></SubTitle>
                                                        : null}
                                                    <TextValidator
                                                        className={['w-full',  Number(this.state.formData.batches[i].no_of_pack) !=  Number(this.state.formDataOriginal.batches[i]?.no_of_pack) ? classes.edited : null]}
                                                        placeholder="No of Pack"
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
                                                            this.onChangeBatchValue(i, 'no_of_pack', e.target.value)

                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    />
                                                </Grid>

                                                <Grid item lg={1} md={1} sm={12} xs={12}>
                                                    {i == 0 ?
                                                        <SubTitle title={"Select"}></SubTitle>
                                                        : null}
                                                    <Checkbox
                                                        size="small"
                                                        color='primary'
                                                        onChange={() => {
                                                            let formData = this.state.formData;

                                                            if (formData.batches[i].status == "Verified") {
                                                                formData.batches[i].status = "Not Verified"

                                                            } else {
                                                                formData.batches[i].status = "Verified"
                                                            }

                                                            this.setState({ formData })
                                                            console.log("formdata", this.state.formData)


                                                        }}
                                                        checked={this.state.formData.batches[i].status ? (this.state.formData.batches[i].status == "Verified" ? true : false) : false}

                                                    />

                                                </Grid>



                                            </Grid>
                                        ))
                                    }

                                    <Grid container>
                                        <Grid className='flex items-center' item lg={2} md={2} sm={12} xs={12}>
                                            <Fab size="small" color="primary" aria-label="add" onClick={() => { this.addNewBatch() }}>
                                                <AddIcon />
                                            </Fab>
                                            <Typography className=" text-gray font-semibold text-14 mx-2">Add New Batch</Typography>
                                        </Grid>

                                    </Grid>
                                </div>


                                {this.state.validate == 'Pending' ?
                                    <Button
                                        className="mt-4"
                                        progress={this.state.processing}
                                        type="submit"
                                        scrollToTop={true}
                                        startIcon="save"
                                    // onClick={this.onSubmit}
                                    >
                                        <span className="capitalize">Save</span>
                                    </Button>
                                    : null}

                            </ValidatorForm>
                        </div>


                    </LoonsCard>
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
export default withStyles(styleSheet)(VerifyPackage)

