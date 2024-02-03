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
    Dialog,
    Tooltip,
    Typography,
    Divider,
    Link,
    InputAdornment
} from '@material-ui/core'
import { compose } from "redux";
import { withRouter } from 'react-router-dom';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Alert } from '@material-ui/lab'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import 'date-fns'
import VisibilityIcon from '@material-ui/icons/Visibility'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { themeColors } from 'app/components/MatxTheme/themeColors'
import CircularProgress from '@material-ui/core/CircularProgress'
import DeleteIcon from '@material-ui/icons/Delete'
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
    SubTitle,
    SwasthaFilePicker
} from 'app/components/LoonsLabComponents'
import * as appconst from '../../../appconst'
import CloseIcon from '@material-ui/icons/Close';

import ConsignmentService from 'app/services/ConsignmentService'
import localStorageService from 'app/services/localStorageService';

import LoonsDatePicker from 'app/components/LoonsLabComponents/DatePicker'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import HospitalConfigServices from 'app/services/HospitalConfigServices';
import { convertTocommaSeparated, dateParse, includesArrayElements } from 'utils';
import { async } from 'q'
import WarehouseServices from 'app/services/WarehouseServices'
import { reverse } from 'lodash'

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

    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },

    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },


    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: -80,
    },
})

class AddDetails extends Component {
    constructor(props) {
        super(props)
        this.inputRef = React.createRef();
        this.state = {
            loaded: false,
            is_editable: false,
            poUnitPrice: null,

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
                sr_no: null,
                height: null,
                width: null,
                depth: null,
                net_weight: null,
                gross_weight: null,
                pack_size: null,
                volume_factor: null,
                local_agent_id: null,
                supplier_id: null,
                manufacturer_id: null,
                manufacturer: null,
                LocalAgent: null,
                Supplier: null,
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
            manufacturer: null,

            showBatchUpload: false,
            selectedBatchForUpload: null,
            all_manufacturers: [],
            all_Suppliers: [],
            all_LocalAgents: [],
            consignment_status:null,
        }
    }

    async getUnitPrice() {

        let formData = this.state.formData

        let id = this.state.data?.item_schedule?.Order_item?.id

        let params = {}

        let res = await WarehouseServices.getAllPurchaseOrderItemById(params, id)

        if (res.status === 200) {
            console.log('cheking unit peice data', res)
            formData.invoice_price = res.data?.view?.standard_cost;
            for (let index = 0; index < formData.batches.length; index++) {//added by roshan

                formData.batches[index].unit_price = res.data?.view?.standard_cost
            }
            this.setState({
                formData,
                poUnitPrice: res.data.view?.standard_cost
            })
        }
    }

    async loadConsignmentData(id) {
        //let res = await ConsignmentService.getAditionalDetails(id)
        this.setState({ loaded: false })
        let res = await ConsignmentService.getConsignmentItemsById(id)

        let formData = this.state.formData;

        if (res.status) {
            console.log("res", res.data.view)
            formData.sr_no = res.data.view.item_schedule?.Order_item?.item?.sr_no;
            formData.height = res.data.view.height;
            formData.width = res.data.view.width;
            formData.depth = res.data.view.depth;
            formData.net_weight = res.data.view.net_weight;
            formData.gross_weight = res.data.view.gross_weight;
            formData.quantity = res.data.view.quantity;
            formData.pack_size = res.data.view.pack_size;
            formData.volume_factor = res.data.view.volume_factor;
            formData.purchase_price = res.data.view.item_schedule?.cost;
            formData.invoice_price = res.data.view.invoice_price;
            formData.supplier_charges = res.data.view.supplier_charges;
            formData.local_agent_id = res.data.view.local_agent_id;
            formData.supplier_id = res?.data?.view?.Consignment?.Supplier?.id;
            formData.manufacturer_id = res.data.view.manufacturer_id;
            formData.manufacturer = res.data.view.manufacturer ? res.data.view.manufacturer : [];
            formData.Supplier = res?.data?.view?.Consignment?.Supplier ? res?.data?.view?.Consignment?.Supplier : [];
            formData.LocalAgent = res.data.view.LocalAgent ? res.data.view.LocalAgent : [];

            if (res.data.view.UOM.length != 0) {
                formData.uoms = res.data.view.UOM

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
            if (res.data.view.Batch.length != 0) {
                formData.batches = res.data.view.Batch
            }

            this.setState({
                data: res.data.view,
                formData,
                loaded: true
            }, () => {
                if (formData.invoice_price == null) {
                    this.getUnitPrice()
                }
            })
        }

    }
    async loadAllUoms() {
        let params = { limit: 10000, page: 0 }
        let id = this.props.match.params.id;
        console.log(id);
        let res = await ConsignmentService.getUoms(params)
        if (res.status) {
            console.log("all uoms", res.data.view.data)
            this.setState({
                all_uoms: res.data.view.data,

            }, () => {
                this.loadConsignmentData(id);
            })
        }
    }

    async LoadAllManufacturers(search) {
        let params = { search: search }

        let res = await HospitalConfigServices.getAllManufacturers(params)
        if (res.status) {
            console.log("all Manufacturers", res.data.view.data)
            this.setState({
                all_manufacturers: res.data.view.data,

            })
        }
    }

    async LoadAllSuppliers(search) {
        let params = { owner_id: '000', search: search }

        let res = await HospitalConfigServices.getAllSuppliers(params)
        if (res.status) {
            console.log("all Suppliers", res.data.view.data)
            this.setState({
                all_Suppliers: res.data.view.data,

            })
        }
    }
    async LoadAllLocalAgents() {
        let params = {}

        let res = await HospitalConfigServices.getAllLocalAgents(params)
        if (res.status) {
            console.log("all LocalAgents", res.data.view.data)
            this.setState({
                all_LocalAgents: res.data.view.data,

            })
        }
    }


    async componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
        let id = this.props.match.params.id;
        // this.LoadAllManufacturers();
        // this.LoadAllSuppliers(null);
        this.LoadAllLocalAgents();
        this.loadAllUoms();
        const query = new URLSearchParams(this.props.location?.search);
        const status = query.get('status')

       this.setState({
        consignment_status:status
       })
        




        var user = await localStorageService.getItem('userInfo');
        console.log('user', user.roles)
        if (includesArrayElements(user.roles, ["SPC MA", "Development Officer", "Drug Store Keeper", "Medical Laboratory Technologist", "Radiographer", "Local Manufacturer", "RMSD OIC"])) {
           
           if(includesArrayElements([status],['SYSTEM REJECTED','REJECTED','Canceled','Price Verified','COMPLETED'])){
            this.setState({ is_editable: false })
           }else{
            this.setState({ is_editable: true })
        }
        } else {
            this.setState({ is_editable: false })
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
    async onChangeBatchValueUnitPrice(index, name, value) {
        let formData = this.state.formData;
        formData.batches[index][name] = this.state.poUnitPrice;
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
            unit_price: this.state.formData.invoice_price

        })
        formData.batches = batches;
        this.setState({ formData })
    }

    async submitData() {
        let user_info = await localStorageService.getItem('userInfo')
        if (this.state.is_editable) {
            let id = this.props.match.params.id;
            if (this.state.formData.volume_factor == null) {
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: "Please Select Storing Level Before Submit"
                })
            } else if (this.state.formData.pack_size == null) {
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: "Please Select Minimum pack Factor Before Submit"
                })
            } else {
                // console.log('hhecking save data', this.state.formData)
                let res = await ConsignmentService.patchConsignmentItem(id, this.state.formData)
                console.log("res", res)
                if (res.status == 200) {
                    console.log("res", res)
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'success',
                        snackbar_message: "Successfully Saved "
                    }, () => {
                        if (user_info.roles.includes('Drug Store Keeper') || user_info.roles.includes('Medical Laboratory Technologist') || user_info.roles.includes('Radiographer')) {
                            this.props.history.goBack()
                        } else {
                            window.location.reload()
                        }
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

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        const { key } = event;
        console.log('Focused ID:', document.activeElement.id);

        const selectedId = document.activeElement.id.split("_");
        console.log('Focused ID:', selectedId[1])
        console.log('Focused ID:', selectedId[2])


        if (key === 'ArrowLeft') {
            event.preventDefault();
            let nextElement = `${selectedId[0]}_${Number(selectedId[1])}_${Number(selectedId[2]) - 1}`
            if (document.getElementById(nextElement)) {
                document.getElementById(nextElement).focus()
                document.getElementById(nextElement).select()
            } else {
                let nextElementNextLine = `${selectedId[0]}_${Number(selectedId[1]) - 1}_5`
                if (document.getElementById(nextElementNextLine)) {
                    document.getElementById(nextElementNextLine).focus()
                    document.getElementById(nextElementNextLine).select()
                }
            }

        } else if (key === 'ArrowRight') {
            event.preventDefault();
            let nextElement = `${selectedId[0]}_${Number(selectedId[1])}_${Number(selectedId[2]) + 1}`
            if (document.getElementById(nextElement)) {
                document.getElementById(nextElement).focus()
                document.getElementById(nextElement).select()
            } else {
                let nextElementNextLine = `${selectedId[0]}_${Number(selectedId[1]) + 1}_1`
                if (document.getElementById(nextElementNextLine)) {
                    document.getElementById(nextElementNextLine).focus()
                    document.getElementById(nextElementNextLine).select()
                }
            }


        } else if (key === 'ArrowUp') {
            let nextElement = `${selectedId[0]}_${Number(selectedId[1]) - 1}_${Number(selectedId[2])}`
            if (document.getElementById(nextElement)) {
                document.getElementById(nextElement).focus()
                setTimeout(() => {
                    document.getElementById(nextElement).select()
                }, 100);

            } else {

            }
        } else if (key === 'ArrowDown') {
            let nextElement = `${selectedId[0]}_${Number(selectedId[1]) + 1}_${Number(selectedId[2])}`
            if (document.getElementById(nextElement)) {
                document.getElementById(nextElement).focus()
                setTimeout(() => {
                    document.getElementById(nextElement).select()
                }, 100);

            } else {
                this.addNewBatch()
            }
        }
    };



    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (

            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Item Details" />
                        <div className="pt-7">
                            {this.state.loaded ?
                                <ValidatorForm
                                    onSubmit={() => this.submitData()}
                                    onError={() => null}
                                >

                                    <Grid container spacing={2}>

                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            {this.state.data != null ?
                                                <SubTitle title={"SR No : " + this.state.data.item_schedule.Order_item.item.sr_no}></SubTitle>
                                                : null}
                                        </Grid>

                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            {this.state.data != null ?
                                                <SubTitle title={"Item Description : " + this.state.data.item_schedule.Order_item.item.name}></SubTitle>
                                                : null}
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            {this.state.data != null ?
                                                <SubTitle title={"Consignment Quantity : " + convertTocommaSeparated(this.state.formData.quantity)}></SubTitle>
                                                : null}
                                        </Grid>

                                        {/*  <Grid item lg={12} md={12} sm={12} xs={12}>
                                            {this.state.data != null ?
                                                <SubTitle title={"Purchese Order Unit Price : " + this.state.data.item_schedule?.cost}></SubTitle>
                                                : null}
                                        </Grid>
 */}
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
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            // errorMessages={[
                                            //     'this field is required',
                                            // ]}
                                            />

                                        </Grid>

                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Width(cm)"}></SubTitle>
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
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            // errorMessages={[
                                            //     'this field is required',
                                            // ]}
                                            />

                                        </Grid>

                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Length(cm)"}></SubTitle>
                                            {/* depth changed to length */}
                                            <TextValidator
                                                className='w-full'
                                                placeholder="Length(cm)"
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
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            // errorMessages={[
                                            //     'this field is required',
                                            // ]}
                                            />

                                        </Grid>

                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"CBM"}></SubTitle>

                                            <p>{this.state.formData.depth * this.state.formData.width * this.state.formData.height / 1000000
                                            }</p>
                                            {/* <TextValidator
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

                                        /> */}

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
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            // errorMessages={[
                                            //     'this field is required',
                                            // ]}
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
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            // errorMessages={[
                                            //     'this field is required',
                                            // ]}
                                            />

                                        </Grid>


                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Supply Chargers LKR"}></SubTitle>
                                            <TextValidator
                                                className='w-full'
                                                placeholder="Supply Chargers LKR"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                type="number"
                                                value={
                                                    this.state
                                                        .formData
                                                        .supplier_charges
                                                }
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData;
                                                    formData.supplier_charges = e.target.value
                                                    this.setState({ formData })

                                                }}
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            // errorMessages={[
                                            //     'this field is required',
                                            // ]}
                                            />

                                        </Grid>

                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Invoice Price(Per Unit) LKR"}></SubTitle>
                                            <TextValidator
                                                className='w-full'
                                                placeholder="Invoice Price(Per Unit) LKR"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                type="number"
                                                //disabled  //comment by roshan
                                                value={
                                                    this.state
                                                        .formData
                                                        .invoice_price
                                                }
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData;
                                                    formData.invoice_price = e.target.value
                                                    for (let index = 0; index < formData.batches.length; index++) {

                                                        formData.batches[index].unit_price = e.target.value
                                                    }


                                                    this.setState({ formData })

                                                }}
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            // errorMessages={[
                                            //     'this field is required',
                                            // ]}
                                            />

                                        </Grid>



                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Manufacturer"}></SubTitle>
                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_manufacturers}
                                                getOptionLabel={(option) => option.name}
                                                value={[...this.state.all_manufacturers, ...[this.state.formData.manufacturer]].find((v) => v.id == this.state.formData.manufacturer_id)}
                                                onChange={(event, value) => {
                                                    let formData = this.state.formData
                                                    formData.manufacturer_id = value.id
                                                    this.setState({ formData })
                                                }

                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Manufacturer"
                                                        //variant="outlined"
                                                        //value={}
                                                        value={[...this.state.all_manufacturers, ...[this.state.formData.manufacturer]].find((v) => v.id == this.state.formData.manufacturer_id)}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            if (e.target.value.length > 2) {
                                                                this.LoadAllManufacturers(e.target.value)

                                                            }
                                                        }}
                                                    // validators={['required']}
                                                    // errorMessages={['this field is required']}
                                                    />
                                                )}
                                            />

                                        </Grid>

                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Supplier"}></SubTitle>
                                            <Autocomplete
                                                disableClearable
                                                //disabled={true}
                                                className="w-full"
                                                options={this.state.all_Suppliers}
                                                getOptionLabel={(option) => option.name}
                                                value={[...this.state.all_Suppliers, ...[this.state.formData.Supplier]].find((v) => v.id == this.state.formData.supplier_id)}
                                                onChange={(event, value) => {
                                                    let formData = this.state.formData
                                                    formData.supplier_id = value.id
                                                    this.setState({ formData })
                                                }

                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Supplier"
                                                        //variant="outlined"
                                                        //value={}
                                                        value={[...this.state.all_Suppliers, ...[this.state.formData.Supplier]].find((v) => v.id == this.state.formData.supplier_id)}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}

                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            if (e.target.value.length > 2) {
                                                                this.LoadAllSuppliers(e.target.value)

                                                            }
                                                        }}
                                                    //validators={['required']}
                                                    //errorMessages={['this field is required']}
                                                    />
                                                )}
                                            />

                                        </Grid>

                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Local Agent"}></SubTitle>
                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_LocalAgents}
                                                getOptionLabel={(option) => option.name}
                                                value={[...this.state.all_LocalAgents, ...[this.state.formData.LocalAgent]].find((v) => v.id == this.state.formData.local_agent_id)}
                                                onChange={(event, value) => {
                                                    let formData = this.state.formData
                                                    formData.local_agent_id = value.id
                                                    this.setState({ formData })
                                                }

                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Local Agent"
                                                        //variant="outlined"
                                                        //value={}
                                                        value={this.state.all_LocalAgents.find((v) => v.id == this.state.formData.local_agent_id)}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        size="small"

                                                    // validators={['required']}
                                                    // errorMessages={['this field is required']}
                                                    />
                                                )}
                                            />
                                        </Grid>


                                    </Grid>


                                    <div className='mt-8 px-3 py-3' style={{ backgroundColor: "#fef1e0" }}>
                                        <Typography className=" text-gray font-semibold text-15">Packing Details</Typography>


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
                                                                'required','minNumber:1'
                                                            ]}
                                                            errorMessages={[
                                                                'This field is required','Should be greater than 0'
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
                                                            id={`focusId_${i + 1}_1`}
                                                            className='w-full arrowFocus'
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
                                                            id={`focusId_${i + 1}_2`}
                                                            className='w-full arrowFocus'
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
                                                                let formData = this.state.formData
                                                                if (formData.volume_factor != null) {
                                                                    let total_qantitiy = parseFloat(e.target.value)
                                                                    this.state.formData.batches.forEach((element, index) => {
                                                                        if (index != i) {
                                                                            total_qantitiy = parseFloat(total_qantitiy) + isNaN(parseFloat(this.state.formData.batches[index].quantity)) ? 0 : parseFloat(this.state.formData.batches[index].quantity);
                                                                        }


                                                                    });

                                                                    if (parseFloat(this.state.formData.quantity) >= total_qantitiy) {
                                                                        this.onChangeBatchValue(i, 'quantity', e.target.value)


                                                                        formData.batches[i].no_of_pack = e.target.value / formData.volume_factor

                                                                    } else {
                                                                        this.onChangeBatchValue(i, 'quantity', e.target.value)
                                                                        this.setState({
                                                                            snackbar: true,
                                                                            snackbar_severity: 'error',
                                                                            snackbar_message: "Cannot Over the Order Quantity"
                                                                        })
                                                                    }
                                                                } else {
                                                                    this.setState({
                                                                        snackbar: true,
                                                                        snackbar_severity: 'error',
                                                                        snackbar_message: "Pleace Select Storing Level Before Enter"
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
                                                            <SubTitle title={"MFD"}></SubTitle>
                                                            : null}

                                                        <DatePicker
                                                            className="w-full arrowFocus"
                                                            id={`focusId_${i + 1}_3`}
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .batches[i].mfd
                                                            }
                                                            placeholder="MFD"
                                                            // minDate={new Date()}
                                                            maxDate={new Date()}
                                                            errorMessages="this field is required"
                                                            onChange={(date) => {
                                                                this.onChangeBatchValue(i, 'mfd', dateParse(date))

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
                                                            className="w-full arrowFocus"
                                                            id={`focusId_${i + 1}_4`}
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .batches[i].exd
                                                            }
                                                            placeholder="EXD"
                                                            disabled={this.state.formData.batches[i].mfd === null || this.state.formData.batches[i].mfd === ''}
                                                            // minDate={this.state.formData.batches[i].mfd}
                                                            minDate={new Date(new Date()).setDate(new Date().getDate() + 1)}

                                                            errorMessages="this field is required"
                                                            onChange={(date) => {
                                                                this.onChangeBatchValue(i, 'exd', dateParse(date))

                                                            }}
                                                        />

                                                    </Grid>

                                                    <Grid item lg={2} md={2} sm={12} xs={12}>
                                                        {i == 0 ?
                                                            <SubTitle title={"Unit Price(LKR)"}></SubTitle>
                                                            : null}
                                                        <TextValidator
                                                            className='w-full arrowFocus'

                                                            placeholder="Unit Price"
                                                            //variant="outlined"
                                                            // disabled
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .batches[i].unit_price
                                                            }
                                                            onChange={(e, value) => {
                                                                this.onChangeBatchValueUnitPrice(i, 'unit_price', e.target.value)

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
                                                            className='w-full arrowFocus'
                                                            id={`focusId_${i + 1}_5`}
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

                                                    <Grid item lg={1} md={1} sm={12} xs={12}>
                                                        {i == 0 ?
                                                            <SubTitle title={"Attachments"}></SubTitle>
                                                            : null}


                                                        <IconButton
                                                            className='mt-1'
                                                            onClick={() => {
                                                                if (this.state.formData.batches[i].id == null) {
                                                                    this.setState({
                                                                        snackbar: true,
                                                                        snackbar_severity: 'error',
                                                                        snackbar_message: "Please Save Befor Adding Attachnemts"
                                                                    })
                                                                } else {
                                                                    console.log("selected batch", this.state.formData.batches[i])
                                                                    this.setState({
                                                                        showBatchUpload: true,
                                                                        selectedBatchForUpload: this.state.formData.batches[i]
                                                                    })
                                                                }
                                                            }}
                                                            size="small" aria-label="Upload">
                                                            <AssignmentIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            className='mt-1'
                                                            onClick={() => {
                                                                let formData = this.state.formData
                                                                formData.batches.splice(i, 1)
                                                                this.setState({ formData })
                                                            }}
                                                            size="small" aria-label="DeleteIcon">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            ))
                                        }

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
                                    </div>


                                    <Typography variant="h6">Total Quantity:{this.state.formData.batches.map(item => isNaN(Number(item.quantity)) ? 0 : Number(item.quantity)).reduce((prev, next) => prev + next)} </Typography>
                                    <Typography variant="h6">{"Consignment Quantity : " + convertTocommaSeparated(this.state.formData.quantity)}</Typography>

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
                                : null}
                            <Grid className='mt-5'>
                                <SwasthaFilePicker

                                    id="file"
                                    singleFileEnable={false}
                                    multipleFileEnable={true}
                                    dragAndDropEnable={true}
                                    tableEnable={true}

                                    documentName={true}//document name enable
                                    documentNameValidation={['required']}
                                    documenterrorMessages={['this field is required']}
                                    documentNameDefaultValue={null}//document name default value. if not value set null

                                    type={true}
                                    types={[{ label: "Insurance Document", value: "Insurance Document" }, { label: "Invoice", value: "Invoice " }, { label: "Item Photo", value: "Item Photo" }, { label: "Packing Photo", value: "Packing Photo" }, { label: "Other", value: "Other" }]}
                                    typeValidation={['required']}
                                    typeErrorMessages={['this field is required']}
                                    defaultType={null}// null

                                    description={true}
                                    //descriptionValidation={['required']}
                                    //descriptionErrorMessages={['this field is required']}
                                    defaultDescription={null}//null

                                    onlyMeEnable={true}
                                    defaultOnlyMe={false}

                                    source="ConsignmentItems"
                                    source_id={this.props.match.params.id}



                                    //accept="image/png"
                                    accept={null}

                                    // maxFileSize={1048576}
                                    // maxTotalFileSize={1048576}
                                    // maxFilesCount={1}
                                    validators={[
                                        'required',
                                        // 'maxSize',
                                        // 'maxTotalFileSize',
                                        // 'maxFileCount',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                        // 'file size too lage',
                                        // 'Total file size is too lage',
                                        // 'Too many files added',
                                    ]}

                                    // label="Select Attachment"
                                    singleFileButtonText="Upload Data"
                                // multipleFileButtonText="Select Files"



                                ></SwasthaFilePicker>
                            </Grid>


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


                <Dialog fullWidth maxWidth="lg " open={this.state.showBatchUpload} >

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Attachments" />

                        <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ showBatchUpload: false }) }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>


                    <SwasthaFilePicker

                        id="batchfile"
                        singleFileEnable={false}
                        multipleFileEnable={true}
                        dragAndDropEnable={true}
                        tableEnable={true}

                        documentName={true}//document name enable
                        documentNameValidation={['required']}
                        documenterrorMessages={['this field is required']}
                        documentNameDefaultValue={null}//document name default value. if not value set null

                        type={true}
                        types={[{ label: "Insurance Document", value: "Insurance Document" }, { label: "Invoice", value: "Invoice " }, { label: "Item Photo", value: "Item Photo" }, { label: "Packing Photo", value: "Packing Photo" }, { label: "Other", value: "Other" }]}
                        typeValidation={['required']}
                        typeErrorMessages={['this field is required']}
                        defaultType={null}// null

                        description={true}
                        //descriptionValidation={['required']}
                        //descriptionErrorMessages={['this field is required']}
                        defaultDescription={null}//null

                        onlyMeEnable={true}
                        defaultOnlyMe={false}

                        source="ConsignmentItemsBatch"
                        source_id={this.state.selectedBatchForUpload?.id}



                        //accept="image/png"
                        accept={null}

                        // maxFileSize={1048576}
                        // maxTotalFileSize={1048576}
                        // maxFilesCount={1}
                        validators={[
                            'required',
                            // 'maxSize',
                            // 'maxTotalFileSize',
                            // 'maxFileCount',
                        ]}
                        errorMessages={[
                            'this field is required',
                            // 'file size too lage',
                            // 'Total file size is too lage',
                            // 'Too many files added',
                        ]}

                        // label="Select Attachment"
                        singleFileButtonText="Upload Data"
                    // multipleFileButtonText="Select Files"



                    ></SwasthaFilePicker>





                </Dialog>
            </Fragment>

        )
    }
}
export default compose(
    withStyles(styleSheet),
    withRouter
)(AddDetails)

