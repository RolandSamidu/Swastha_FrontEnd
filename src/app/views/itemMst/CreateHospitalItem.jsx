import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    Typography,
    CircularProgress,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    FilePicker,
    ImageView,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import WarehouseServices from 'app/services/WarehouseServices'
import ConsignmentService from 'app/services/ConsignmentService'
import { SimpleCard } from 'app/components'
import InventoryService from 'app/services/InventoryService'


const styleSheet = (theme) => ({})

class CreateHospitalItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: '',
            severity: 'success',

            //dropdown Data
            allGroups: [],
            allSerials: [],
            allWH: [],
            allVENS: [],
            allUOMS: [],
            allStocks: [],
            allItemTypes: [],
            allInstitution: [],
            allConsumables: [],
            allItemUsageTypes: [],
            allItemStatus: [],
            allConditions: [],
            allStorages: [],
            allBatchTraces: [],
            allABCClasses: [],
            allCyclicCodes: [],
            allMovementTypes: [],

            allDosageForms:[],
            allMeasuringUnitCodes:[],
            allMeasuringUnit :[],
            allDisplayingUnit :[],
            allDefaultRoutes :[],
            allDefaultFrequency :[],

            files: { fileList: [] },

            group_code: '',
            item_serial_code: '',
            item_post_fix: '',
            group_class: '',
            ven: '',

            formData: {
                // sr_no: '',
                serial_id: '',
                short_description: '',
                medium_description: '',
                long_description: '',
                is_prescrible:true,
                note: '',
                group_id: null,
                stock_id: null,
                condition_id: null,
                abc_class_id: null,
                storage_id: null,
                batch_trace_id: null,
                cyclic_code_id: null,
                movement_type_id: null,
                shelf_life: '',
                standard_cost: '',
                standard_shelf_life: null,
                // uoms: [],
                conversion_facter: null,
                pack_quantity: null,
                cubic_size: null,
                pack_weight: null,
                common_name: null,
                primary_wh: null,
                item_type_id: null,
                institution_id: null,
                consumables: null,
                ven_id: null,
                used_for_estimates: 'Yes',
                item_usage_type_id: null,
                used_for_formulation: 'Yes',
                formulatory_approved: 'Yes',
                // file: null,

                critical: true,
                nearest_round_up_value: null,
                specification: null,
                source_of_creation: null,
                status: 'Active',
                primary_id: null,
                countable:true,
                reusable:true,
                isDosageCount:true,
                dosageForm:null,
                measuringUnitCode:null,
                measuringUnit:null,
                displayUnit:null,
                defaultRoute:null,
                defaultFrequency:null,
                unitSize:null,
                defaultDuration:null

            }
        }
    }

    // async loadGroups() {
    //     let params = { limit: 99999, page: 0 }
    //     const res = await GroupSetupService.fetchAllGroup(params)

    //     if (res.status == 200) {
    //         this.setState({ allGroups: res.data.view.data })
    //     }
    // }

    // async loadSerials() {
    //     let params = { limit: 99999, page: 0 }
    //     const res = await GroupSetupService.getAllSerial(params)

    //     if (res.status == 200) {
    //         this.setState({ allSerials: res.data.view.data })
    //     }
    // }

    // async loadWH() {
    //     let params = { limit: 99999, page: 0 }
    //     const res = await WarehouseServices.getWarehoure(params)

    //     if (res.status == 200) {
    //         this.setState({ allWH: res.data.view.data })
    //     }
    // }
    async loadVENS() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getVEN(params)

        if (res.status == 200) {
            this.setState({ allVENS: res.data.view.data })
        }
    }

    // async loadUOMS() {
    //     let params = { limit: 99999, page: 0 }
    //     const res = await ConsignmentService.getUoms(params)

    //     if (res.status == 200) {
    //         this.setState({ allUOMS: res.data.view.data })
    //     }
    // }

    // async loadStocks() {
    //     let params = { limit: 99999, page: 0 }
    //     const res = await WarehouseServices.getStocks(params)

    //     if (res.status == 200) {
    //         this.setState({ allStocks: res.data.view.data })
    //     }
    // }
    // async loadConditions() {
    //     let params = { limit: 99999, page: 0 }
    //     const res = await WarehouseServices.getConditions(params)

    //     if (res.status == 200) {
    //         this.setState({ allConditions: res.data.view.data })
    //     }
    // }

    // async loadStorages() {
    //     let params = { limit: 99999, page: 0 }
    //     const res = await WarehouseServices.getStorages(params)

    //     if (res.status == 200) {
    //         this.setState({ allStorages: res.data.view.data })
    //     }
    // }
    // async loadBatchTraces() {
    //     let params = { limit: 99999, page: 0 }
    //     const res = await WarehouseServices.getBatchTraces(params)

    //     if (res.status == 200) {
    //         this.setState({ allBatchTraces: res.data.view.data })
    //     }
    // }
    // async loadABCClasses() {
    //     let params = { limit: 99999, page: 0 }
    //     const res = await WarehouseServices.getABCClasses(params)

    //     if (res.status == 200) {
    //         this.setState({ allABCClasses: res.data.view.data })
    //     }
    // }

    // async loadCyclicCodes() {
    //     let params = { limit: 99999, page: 0 }
    //     const res = await WarehouseServices.getCyclicCodes(params)

    //     if (res.status == 200) {
    //         this.setState({ allCyclicCodes: res.data.view.data })
    //     }
    // }
    // async loadMovementTypes() {
    //     let params = { limit: 99999, page: 0 }
    //     const res = await WarehouseServices.getMovementTypes(params)

    //     if (res.status == 200) {
    //         this.setState({ allMovementTypes: res.data.view.data })
    //     }
    // }

    // async loadItemTypes() {
    //     let params = { limit: 99999, page: 0 }
    //     const res = await WarehouseServices.getItemTypes(params)

    //     if (res.status == 200) {
    //         this.setState({ allItemTypes: res.data.view.data })
    //     }
    // }

    // async loadInstitutions() {
    //     let params = { limit: 99999, page: 0 }
    //     const res = await WarehouseServices.getInstitutions(params)

    //     if (res.status == 200) {
    //         this.setState({ allInstitution: res.data.view.data })
    //     }
    // }

    // async loadItemUsageTypes() {
    //     let params = { limit: 99999, page: 0 }
    //     const res = await WarehouseServices.getItemUsageTypes(params)

    //     if (res.status == 200) {
    //         this.setState({ allItemUsageTypes: res.data.view.data })
           
    //     }
    // }
    async loadDosageForm() {
        let params = { limit: 99999, page: 0 }
        const res = await InventoryService.getDosageForm(params)
        if (res.status == 200) {
            this.setState({ allDosageForms: res.data.view.data })
            
        }
    }
    async loadMesuringUnitCodes() {
        console.log("loadMesuringUnitCodes")
        let params = { limit: 99999, page: 0 }
        const res = await InventoryService.getMeasuringUnitCodes(params)
        if (res.status == 200) {
            this.setState({ allMeasuringUnitCodes : res.data.view.data })
            console.log("loadMesuringUnitCodes",res )
        }
    }
    async loadMesuringUnit() {
        console.log("loadMesuringUnit")
        let params = { limit: 99999, page: 0 }
        const res = await InventoryService.getMeasuringUnit(params)
        if (res.status == 200) {
            this.setState({ allMeasuringUnit: res.data.view.data })
            console.log("loadMesuringUnit",this.state.allMeasuringUnit )
        }
    }
    
    async loadDisplyingUnit() {
        console.log("loadDisplyingUnit")
        let params = { limit: 99999, page: 0 }
        const res = await InventoryService.getDisplayingUnits(params)
        if (res.status == 200) {
            this.setState({ allDisplayingUnit: res.data.view.data })
            console.log("loadDisplyingUnit",this.state.allDisplayingUnit )
        }
    }
    async loadDefaultRoute() {
        console.log("loadDisplyingRoute")
        let params = { limit: 99999, page: 0 }
        const res = await InventoryService.getDefaultRoutes(params)
        if (res.status == 200) {
            this.setState({ allDefaultRoutes: res.data.view.data })
            console.log("loadDisplyingRoute",this.state.allDefaultRoutes )
        }
    }
    async loadDefaultFrequency() {
        console.log("loadDisplyingFrequency")
        let params = { limit: 99999, page: 0 }
        const res = await InventoryService.getDefaultFrequency(params)
        if (res.status == 200) {
            this.setState({ allDefaultFrequency: res.data.view.data })
            console.log("loadDisplyingFrequency",this.state.allDefaultFrequency )
        }
    }

    async loadItemById(id) {
        let params = {};
        const res = await InventoryService.fetchItemById(params, id)
        let uoms = [];
        if (res.status == 200) {
            console.log("item Data", res.data.view)

            // res.data.view.ItemUOMs.forEach(element => {
            //     uoms.push(element.uom_id)
            // });

            let formData = {
                // sr_no: res.data.view.sr_no,
                serial_id: res.data.view.serial_id,
                short_description: res.data.view.short_description,
                medium_description: res.data.view.medium_description,
                long_description: res.data.view.long_description,
                note: res.data.view.note,
                group_id: res.data.view.Serial.group_id,
                stock_id: res.data.view.stock_id,
                condition_id: res.data.view.condition_id,
                abc_class_id: res.data.view.abc_class_id,
                storage_id: res.data.view.storage_id,
                batch_trace_id: res.data.view.batch_trace_id,
                cyclic_code_id: res.data.view.cyclic_code_id,
                movement_type_id: res.data.view.movement_type_id,
                shelf_life: res.data.view.shelf_life,
                standard_cost: res.data.view.standard_cost,
                standard_shelf_life: res.data.view.standard_shelf_life,
                uoms: uoms,
                conversion_facter: res.data.view.conversion_facter,
                pack_quantity: res.data.view.pack_quantity,
                cubic_size: res.data.view.cubic_size,
                pack_weight: res.data.view.pack_weight,
                common_name: res.data.view.common_name,
                primary_wh: res.data.view.primary_wh,
                item_type_id: res.data.view.item_type_id,
                institution_id: res.data.view.institution_id,
                consumables: res.data.view.consumables,
                ven_id: res.data.view.ven_id,
                used_for_estimates: res.data.view.used_for_estimates,
                item_usage_type_id: res.data.view.item_usage_type_id,
                used_for_formulation: res.data.view.used_for_formulation,
                formulatory_approved: res.data.view.formulatory_approved,
                // file: res.data.view.file,
                critical: res.data.view.critical,
                nearest_round_up_value: res.data.view.nearest_round_up_value,
                specification: res.data.view.specification,
                source_of_creation: res.data.view.source_of_creation,
                status: res.data.view.status,
                primary_id: res.data.view.primary_id,
                // dosageForm: res.data.view.DosageForm,
                countable:res.data.view.countable,
                reusable:res.data.view.reusable,
                isDosageCount:res.data.view.is_dosage_count,
                dosageForm:res.data.view.DosageForm,
                measuringUnitCode:res.data.view.MeasuringUnitCode,
                measuringUnit:res.data.view.MeasuringUnit,
                displayUnit:res.data.view.DisplayUnit,
                defaultRoute:res.data.view.DefaultRoute,
                defaultFrequency:res.data.view.default_frequency_id,
                // unitSize:res.data.view.countable,
                defaultDuration:res.data.view.default_duration



            }

            this.setState({
                formData,
                loaded: true,
                group_class: res.data.view.Serial.Group.Class.code,
                ven: this.state.allVENS.filter((ele) => ele.id == res.data.view.ven_id)[0].name
            })

        }
    }


    async componentDidMount() {
        // this.loadGroups();
        // this.loadSerials();
        // this.loadWH();
        this.loadVENS();
        // this.loadUOMS();
        // this.loadStocks();
        // this.loadConditions();
        // this.loadStorages();
        // this.loadBatchTraces();
        // this.loadABCClasses();
        // this.loadCyclicCodes();
        // this.loadMovementTypes();
        // this.loadItemTypes();
        // this.loadInstitutions();
        // this.loadItemUsageTypes();

        this.loadDosageForm();
        this.loadMesuringUnitCodes();
        this.loadMesuringUnit();
        this.loadDisplyingUnit();
        this.loadDefaultRoute();
        this.loadDefaultFrequency();

        let hosID = this.props.id;
        this.loadItemById(hosID);
    }



    async submit() {
        console.log("Form date",this.state.formData)
        let hosID = this.props.id;

        var form_data2 = new FormData();
        // let nullCheck = Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
        // form_data2.append(`file`, this.state.files.fileList[0].file);
        // form_data2.append(`sr_no`, this.state.formData.sr_no)
        if(this.state.formData.serial_id != null ){
            form_data2.append(`serial_id`, this.state.formData.serial_id)
        }
        if(this.state.formData.stock_id != null ){
            form_data2.append(`stock_id`, this.state.formData.stock_id )//null
        }
        if(this.state.formData.condition_id != null ){
            form_data2.append(`condition_id`, this.state.formData.condition_id)
        }
        if(this.state.formData.abc_class_id != null ){
            form_data2.append(`abc_class_id`, this.state.formData.abc_class_id)
        }
        if(this.state.formData.storage_id != null ){
            form_data2.append(`storage_id`, this.state.formData.storage_id)
        }
        if(this.state.formData.batch_trace_id != null ){
            form_data2.append(`batch_trace_id`, this.state.formData.batch_trace_id)
        }
        if(this.state.formData.cyclic_code_id != null ){
            form_data2.append(`cyclic_code_id`, this.state.formData.cyclic_code_id)
        }
        if(this.state.formData.movement_type_id != null ){
            form_data2.append(`movement_type_id`, this.state.formData.movement_type_id)//to here null check
        }
        if(this.state.formData.shelf_life_id != null ){
            form_data2.append(`shelf_life_id`, this.state.formData.shelf_life_id)//null
        }
        if(this.state.formData.primary_wh != null ){
            form_data2.append(`primary_wh`, this.state.formData.primary_wh)//null
        }
        if(this.state.formData.item_type_id != null ){
            form_data2.append(`item_type_id`, this.state.formData.item_type_id)//null id
        }
        if(this.state.formData.institution_id != null ){
            form_data2.append(`institution_id`, this.state.formData.institution_id)//here
        }
        if(this.state.formData.ven_id != null ){
            form_data2.append(`ven_id`, this.state.formData.ven_id)//null
        }
        if(this.state.formData.item_usage_type_id != null ){
            form_data2.append(`item_usage_type_id`, this.state.formData.item_usage_type_id)//null
        }
        if(this.state.formData.critical != null ){
            form_data2.append(`critical`, this.state.formData.critical)//null
        }
        if(this.state.formData.nearest_round_up_value != null ){
            form_data2.append(`nearest_round_up_value`, this.state.formData.nearest_round_up_value)//null
        }
        form_data2.append(`short_description`, this.state.formData.short_description)
        form_data2.append(`medium_description`, this.state.formData.medium_description)
        form_data2.append(`long_description`, this.state.formData.long_description)
        form_data2.append(`note`, this.state.formData.note)
        // form_data2.append(`group_id`, this.state.formData.group_id)
        form_data2.append(`shelf_life`, this.state.formData.shelf_life)
        form_data2.append(`standard_cost`, this.state.formData.standard_cost)
        form_data2.append(`standard_shelf_life`, this.state.formData.standard_shelf_life)

        // this.state.formData.uoms.forEach((element, index) => {
        //     form_data2.append(`uoms[` + index + `]`, element)
        // });
        
        form_data2.append(`conversion_facter`, this.state.formData.conversion_facter)
        form_data2.append(`pack_quantity`, this.state.formData.pack_quantity)
        form_data2.append(`cubic_size`, this.state.formData.cubic_size)
        form_data2.append(`pack_weight`, this.state.formData.pack_weight)
        form_data2.append(`common_name`, this.state.formData.common_name)
        form_data2.append(`consumables`, this.state.formData.consumables)
        form_data2.append(`used_for_estimates`, this.state.formData.used_for_estimates)
        form_data2.append(`used_for_formulation`, this.state.formData.used_for_formulation)
        form_data2.append(`formulatory_approved`, this.state.formData.formulatory_approved)
        form_data2.append(`specification`, this.state.formData.specification)
        form_data2.append(`source_of_creation`, this.state.formData.source_of_creation)
        form_data2.append(`status`, this.state.formData.status)

        form_data2.append(`primary_id`, this.state.formData.primary_id)

        form_data2.append(`countable`, this.state.formData.countable)
        form_data2.append(`reusable`, this.state.formData.reusable)
        form_data2.append(`isDosageCount`, this.state.formData.isDosageCount)
        form_data2.append(`dosageForm`, this.state.formData.dosageForm)
        form_data2.append(`measuringUnitCode`, this.state.formData.measuringUnitCode)
        form_data2.append(`measuringUnit`, this.state.formData.measuringUnit)
        form_data2.append(`displayUnit`, this.state.formData.displayUnit)
        form_data2.append(`defaultRoute`, this.state.formData.defaultRoute)
        form_data2.append(`defaultFrequency`, this.state.formData.defaultFrequency)
        form_data2.append(`unitSize`, this.state.formData.unitSize)
        form_data2.append(`defaultDuration`, this.state.formData.defaultDuration)
        //form_data2.append(`is_prescrible`, true)
        
        console.log("Form data2",form_data2)
        let res = await InventoryService.editItem(form_data2, hosID)
        console.log("Data" , res)
        if (res.status == 200) {
            this.setState({
                alert: true,
                message: 'Item has been Edited Successfully.',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Cannot Edit Item ',
                severity: 'error',
            })
        }




    }

    getUOM() {
        let uoms = [];
        this.state.formData.uoms.forEach(element => {
            uoms.push(this.state.allUOMS.filter((ele) => ele.id == element)[0])
        });
        setTimeout(() => {
            console.log("uom", uoms)
        }, 2000);

        return uoms;
    }

    render() {
        // let { theme } = this.props
        // const { classes } = this.props
        // const zeroPad = (num, places) => String(num).padStart(places, '0')
        return (
            < Fragment >
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Edit Hospital Item" />

                        {this.state.loaded ?
                            <ValidatorForm
                                className="pt-2"
                                onSubmit={() => this.submit()}
                                onError={() => null}
                            >
                                    <LoonsCard className="mt-3">
                                        <Typography variant="p" className="font-semibold">Hospital</Typography>
                                        <Divider></Divider>
                                        <Grid className='mt-3' container spacing={2}>
                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Dosage Form" />

                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allDosageForms}
                                                    //options={this.state.allWH.filter((ele) => ele.status == "Active")}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.dosageForm = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={this.state.allDosageForms.find((obj) => obj.id == this.state.formData.dosageForm
                                                    )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Dosage Form"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={this.state.allDosageForms.find((obj) => obj.id == this.state.formData.dosageForm
                                                            )}
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

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                            <SubTitle title="Medium Description" />
                                            <Typography variant="h3">{this.state.formData.medium_description}</Typography>

                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Countable" />
                                                <RadioGroup row>
                                                    <FormControlLabel
                                                        label={'Yes'}
                                                        name="Countable"
                                                        value={1}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                               formData.countable = 1;

                                                                this.setState({
                                                                    formData,
                                                                })
                                                            
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={this.state.formData.countable == 1 ? true : false
                                                    }  
                                                    />

                                                    <FormControlLabel
                                                        label={'No'}
                                                        name="Countable"
                                                        value={false}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            formData.countable = 0;
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={this.state.formData.countable == 0 ? true : false
                                                    }                                                    
                                                    />
                                                </RadioGroup>
                                            </Grid>
                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Reusable" />
                                                <RadioGroup row>
                                                    <FormControlLabel
                                                        label={'Yes'}
                                                        name="Reusable"
                                                        value={'Yes'}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            formData.reusable = 'Yes';

                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={this.state.formData.reusable == 'Yes' ? true : false
                                                        }
                                                    />

                                                    <FormControlLabel
                                                        label={'No'}
                                                        name="Reusable"
                                                        value={'No'}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            formData.reusable = 'No'
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={
                                                            this.state.formData.reusable == 'No' ? true : false
                                                        }
                                                    />
                                                </RadioGroup>
                                            </Grid>
                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Is Dosage Count" />
                                                <RadioGroup row>
                                                    <FormControlLabel
                                                        label={'Yes'}
                                                        name="Is Dosage Count"
                                                        value={'Yes'}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            formData.isDosageCount = 'Yes';

                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={this.state.formData.isDosageCount == 'Yes' ? true : false
                                                        }
                                                    />

                                                    <FormControlLabel
                                                        label={'No'}
                                                        name="Is Dosage Count"
                                                        value={'No'}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            formData.isDosageCount = 'No'
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={
                                                            this.state.formData.isDosageCount == 'No' ? true : false
                                                        }
                                                    />
                                                </RadioGroup>
                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Measuring Unit Code" />

                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allMeasuringUnitCodes}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.measuringUnitCode = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={this.state.allMeasuringUnitCodes.find((obj) => obj.id == this.state.formData.measuringUnitCode
                                                    )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Dosage Form"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={this.state.allMeasuringUnitCodes.find((obj) => obj.id == this.state.formData.measuringUnitCode
                                                            )}
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


                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                            <SubTitle title="Measuring Unit" />

                                            <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allMeasuringUnit}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.measuringUnit = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={this.state.allMeasuringUnit.find((obj) => obj.id == this.state.formData.measuringUnit
                                                    )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Dosage Form"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={this.state.allMeasuringUnit.find((obj) => obj.id == this.state.formData.measuringUnit
                                                            )}
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


                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                            <SubTitle title="Displaying Unit" />

                                            <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allDisplayingUnit}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.displayUnit = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
                                                    )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Dosage Form"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
                                                            )}
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
                                            
                                        </Grid>
                                    </LoonsCard>
                                    <LoonsCard className="mt-3">
                                        <Typography variant="p" className="font-semibold">Prescribing Details</Typography>
                                        <Divider></Divider>
                                        <Grid className='mt-3' container spacing={2}>
                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                            <SubTitle title="Default Route" />

                                            <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allDefaultRoutes}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.defaultRoute = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={this.state.allDefaultRoutes.find((obj) => obj.id == this.state.formData.defaultRoute
                                                    )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Dosage Form"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={this.state.allDefaultRoutes.find((obj) => obj.id == this.state.formData.defaultRoute
                                                            )}
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
                                        <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                            <SubTitle title="Default Frequency" />

                                            <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allDefaultFrequency}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.defaultFrequency = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={this.state.allDefaultFrequency.find((obj) => obj.id == this.state.formData.defaultFrequency
                                                    )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Dosage Form"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={this.state.allDefaultFrequency.find((obj) => obj.id == this.state.formData.defaultFrequency
                                                            )}
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
                                        <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <SubTitle title="Default Duration" />
                                        <TextValidator
                                            className="w-full"
                                            placeholder="Default Duration"
                                            name="defaultDuration"
                                            InputLabelProps={{
                                                inputMode: 'numeric',
                                                pattern: '[0-9]*',
                                                shrink: false,
                                            }}
                                            value={this.state.formData.defaultDuration
                                            }
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData = this.state.formData
                                                formData.defaultDuration = e.target.value
                                                this.setState({ formData })
                                            }}
                                        /*  validators={['required']}
                                     errorMessages={[
                                         'this field is required',
                                     ]} */
                                        />
                                    </Grid>


                                            
                                        </Grid>
                                    </LoonsCard>


                                <Button
                                    className="mt-2 mr-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    startIcon="save"
                                //onClick={this.handleChange}
                                >
                                    <span className="capitalize">
                                        Save
                                    </span>
                                </Button>

                            </ValidatorForm>
                            : 
                            <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress
                                size={30}
                            />
                        </Grid>
                        }
                    </LoonsCard>
                </MainContainer>

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
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(CreateHospitalItem)

