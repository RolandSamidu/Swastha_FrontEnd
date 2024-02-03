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
import RichTextEditor from 'react-rte';
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    SwasthaFilePicker,
    FilePicker,
    ImageView,
    DocumentLoader
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import WarehouseServices from 'app/services/WarehouseServices'
import ConsignmentService from 'app/services/ConsignmentService'
import { SimpleCard } from 'app/components'
import InventoryService from 'app/services/InventoryService'
import localStorageService from 'app/services/localStorageService'


const styleSheet = (theme) => ({})

class EditItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: RichTextEditor.createValueFromString('', 'html'),
            loaded: false,
            shelfLife: true,
            alert: false,
            message: '',
            severity: 'success',
            editable: true,

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

            allDosageForms: [],
            allMeasuringUnitCodes: [],
            allMeasuringUnit: [],
            allDisplayingUnit: [],
            allDefaultRoutes: [],
            allDefaultFrequency: [],

            files: { fileList: [] },

            group_code: '',
            item_serial_code: '',
            item_post_fix: '',
            group_class: '',
            ven: '',


            formData: {
                sr_no: null,
                serial_id: null,
                short_description: null,
                medium_description: null,
                // long_description: null,
                strength: null,
                item_unit_size: null,
                note: null,
                // stock_id: null,
                // condition_id: null,
                // abc_class_id: null,
                storage_id: null,
                // batch_trace_id: null,
                // cyclic_code_id: null,
                // movement_type_id: null,
                shelf_life: null,
                // standard_cost: null,
                // standard_shelf_life: null,
                uoms: null,

                common_name: null,
                primary_wh: null,
                item_type_id: null,
                institution_id: null,
                consumables: 'Yes',
                ven_id: null,
                used_for_estimates: 'Yes',
                item_usage_type_id: null,
                used_for_formulation: 'Yes',
                formulatory_approved: 'Yes',
                file: null,
                extension: null,
                path: null,
                previous_system_sr: null,
                previous_sr: null,
                specification: null,
                dosageForm: null,
                unitSize: null,
                dosage_code: null,
                status: 'Active',

                // conversion_facter: null,
                // pack_quantity: null,
                // cubic_size: null,
                // pack_weight: null,
                // critical: true,
                // nearest_round_up_value: null,
                // source_of_creation: null,
                // primary_id: null,
                // countable:true,
                // reusable:true,
                // isDosageCount:true,
                // measuringUnitCode:null,
                // measuringUnit:null,
                // displayUnit:null,
                // defaultRoute:null,
                // defaultFrequency:null,
                // defaultDuration:null,

            }
        }
    }

    async loadGroups() {
        let params = { limit: 99999, page: 0 }
        const res = await GroupSetupService.fetchAllGroup(params)

        let loadGroup = this.state.allGroups
        if (res.status == 200) {
            var loadedData = res.data.view.data
            loadedData.forEach(element => {
                let loadGroups = {}
                loadGroups.name = element.code + "-" + element.name
                loadGroups.id = element.id
                loadGroups.code = element.code
                loadGroups.status = element.status
                loadGroup.push(loadGroups)
            });
        }
        else {
            this.setState({
                alert: true,
                severity: 'error',
                message: res.data.error,
            })
        };
        this.setState({ allGroups: loadGroup })
    }

    async loadSerials() {
        let params = { limit: 99999, page: 0 }
        const res = await GroupSetupService.getAllSerial(params)

        let loadSerial = this.state.allSerials
        if (res.status == 200) {
            var loadedData = res.data.view.data
            loadedData.forEach(element => {
                let loadSerials = {}
                loadSerials.name = element.code + "-" + element.name
                loadSerials.name2 = element.name
                loadSerials.id = element.id
                loadSerials.code = element.code
                loadSerials.status = element.status
                loadSerial.push(loadSerials)
            });
        }
        else {
            this.setState({
                alert: true,
                severity: 'error',
                message: res.data.error,
            })
        };
        this.setState({ allSerials: loadSerial })
    }
    async loadWH() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getWarehoure(params)

        if (res.status == 200) {
            this.setState({ allWH: res.data.view.data })
        }
    }
    async loadVENS() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getVEN(params)

        if (res.status == 200) {
            this.setState({ allVENS: res.data.view.data })
        }
    }

    async loadUOMS() {
        let params = { limit: 99999, page: 0 }
        const res = await ConsignmentService.getUoms(params)

        if (res.status == 200) {
            this.setState({ allUOMS: res.data.view.data })
        }
    }

    async loadStocks() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getStocks(params)

        if (res.status == 200) {
            this.setState({ allStocks: res.data.view.data })
        }
    }
    async loadConditions() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getConditions(params)

        if (res.status == 200) {
            this.setState({ allConditions: res.data.view.data })
        }
    }

    async loadStorages() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getStorages(params)

        if (res.status == 200) {
            this.setState({ allStorages: res.data.view.data })
        }
    }
    async loadBatchTraces() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getBatchTraces(params)

        let loadBatchTrace = this.state.allBatchTraces
        if (res.status == 200) {
            var loadedData = res.data.view.data
            loadedData.forEach(element => {
                let loadBatch = {}
                loadBatch.name = element.name
                loadBatch.id = element.id
                loadBatch.code = element.code
                loadBatch.status = element.status
                loadBatchTrace.push(loadBatch)
            });
        }
        else {
            this.setState({
                alert: true,
                severity: 'error',
                message: res.data.error,
            })
        };
        this.setState({
            allBatchTraces: loadBatchTrace
        })
        console.log("batch trace", this.state.allBatchTraces)
    }


    async loadABCClasses() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getABCClasses(params)

        if (res.status == 200) {
            this.setState({ allABCClasses: res.data.view.data })
        }
    }

    async loadCyclicCodes() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getCyclicCodes(params)

        if (res.status == 200) {
            this.setState({ allCyclicCodes: res.data.view.data })
        }
    }
    async loadMovementTypes() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getMovementTypes(params)

        if (res.status == 200) {
            this.setState({ allMovementTypes: res.data.view.data })
        }
    }

    async loadItemTypes() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getItemTypes(params)

        if (res.status == 200) {
            this.setState({ allItemTypes: res.data.view.data })
        }
    }

    async loadInstitutions() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getInstitutions(params)

        if (res.status == 200) {
            this.setState({ allInstitution: res.data.view.data })
        }
    }
    //hospital Item
    async loadDosageForm() {
        let params = { limit: 99999, page: 0 }
        const res = await InventoryService.getDosageForm(params)
        if (res.status == 200) {
            this.setState({ allDosageForms: res.data.view.data })

        }
    }
    async loadMesuringUnitCodes() {
        let params = { limit: 99999, page: 0 }
        const res = await InventoryService.getMeasuringUnitCodes(params)
        if (res.status == 200) {
            this.setState({ allMeasuringUnitCodes: res.data.view.data })
        }
    }
    async loadMesuringUnit() {
        let params = { limit: 99999, page: 0 }
        const res = await InventoryService.getMeasuringUnit(params)
        if (res.status == 200) {
            this.setState({ allMeasuringUnit: res.data.view.data })
        }
    }

    async loadDisplyingUnit() {
        let params = { limit: 99999, page: 0 }
        const res = await InventoryService.getDisplayingUnits(params)
        if (res.status == 200) {
            this.setState({ allDisplayingUnit: res.data.view.data })
        }
    }
    async loadDefaultRoute() {
        let params = { limit: 99999, page: 0 }
        const res = await InventoryService.getDefaultRoutes(params)
        if (res.status == 200) {
            this.setState({ allDefaultRoutes: res.data.view.data })
        }
    }
    async loadDefaultFrequency() {
        let params = { limit: 99999, page: 0 }
        const res = await InventoryService.getDefaultFrequency(params)
        if (res.status == 200) {
            this.setState({ allDefaultFrequency: res.data.view.data })
        }
    }

    async loadItemUsageTypes() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getItemUsageTypes(params)

        if (res.status == 200) {
            this.setState({ allItemUsageTypes: res.data.view.data })
        }
    }




    async componentDidMount() {

        let user_info = await localStorageService.getItem('userInfo')
        if (user_info.roles.includes('MSD SDA')) {
            this.setState({ editable: false })
        }
        this.loadGroups();
        this.loadSerials();
        this.loadWH();
        this.loadVENS();
        this.loadUOMS();
        this.loadStocks();
        this.loadConditions();
        this.loadStorages();
        this.loadBatchTraces();
        this.loadABCClasses();
        this.loadCyclicCodes();
        this.loadMovementTypes();
        this.loadItemTypes();
        this.loadInstitutions();
        this.loadItemUsageTypes()

        this.loadDosageForm();
        this.loadMesuringUnitCodes();
        this.loadMesuringUnit();
        this.loadDisplyingUnit();
        this.loadDefaultRoute();
        this.loadDefaultFrequency();

        let itemId = this.props.match.params.id;
        this.loadItemById(itemId);
    }
    fileformat(file, extension, path) {

        var file_array = [];

        file_array.push(
            {
                url: path,
                extension: extension,
                filename: file
            }
        )


        return file_array;


    }


    async loadItemById(id) {
        let params = {};
        const res = await InventoryService.fetchItemById(params, id)
        let uoms = [];

        if (res.status == 200) {
            console.log("item Data", res.data.view)

            res.data.view.ItemUOM.forEach(element => {
                uoms.push(element.UOM)
                console.log('UOMSS', element.UOM)
            });

            let formData = {
                sr_no: res.data.view.sr_no,
                serial_id: res.data.view.Serial?.id,
                short_description: res.data.view.short_description,
                medium_description: res.data.view.medium_description,
                long_description: res.data.view.long_description,
                note: res.data.view.note,
                group_id: res.data.view.Serial.group_id,
                stock_id: res.data.view.stock_id,
                item_unit_size: parseInt(res.data.view.item_unit_size),
                condition_id: res.data.view.condition_id,
                abc_class_id: res.data.view.abc_class_id,
                storage_id: res.data.view.storage_id,
                batch_trace_id: res.data.view.batch_trace_id,
                cyclic_code_id: res.data.view.cyclic_code_id,
                movement_type_id: res.data.view.movement_type_id,
                shelf_life: res.data.view.shelf_life,
                standard_cost: res.data.view.standard_cost,
                standard_shelf_life: res.data.view.standard_shelf_life,
                dosage_code: res.data.view.dosage_code,
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
                priority: res.data.view.priority,
                used_for_estimates: res.data.view.used_for_estimates,
                item_usage_type_id: res.data.view.item_usage_type_id,
                used_for_formulation: res.data.view.used_for_formulation,
                formulatory_approved: res.data.view.formulatory_approved,
                file: res.data.view.file_name,
                extension: res.data.view.extension,
                path: res.data.view.path,
                critical: res.data.view.critical,
                nearest_round_up_value: res.data.view.nearest_round_up_value,
                specification: res.data.view.specification,
                source_of_creation: res.data.view.source_of_creation,
                status: res.data.view.status,
                primary_id: res.data.view.primary_id,
                strength: res.data.view?.strength,
                previous_sr: res.data.view?.previous_sr,
                previous_system_sr: res.data.view?.previous_system_sr
            }
            if (res.data.view.consumables === "N") {
                // let formData =  this.state.formData
                // formData.shelf_life ="No Shelf Life"
                this.setState({
                    // formData,
                    shelfLife: false
                })
            }
            this.setState({
                formData,
                loaded: true,
                value: RichTextEditor.createValueFromString(res.data.view.specification, 'html'),
                group_class: res.data.view.Serial.Group.Class.code,
                ven: this.state.allVENS.filter((ele) => ele.id == res.data.view.ven_id)[0].name
            })

        }
    }




    async submit() {
        let itemId = this.props.match.params.id;
        console.log("fromdata", this.state.formData)
        var form_data2 = new FormData();
        if (this.state.files.fileList.length > 0) {
            form_data2.append(`file`, this.state.files.fileList[0].file);
            console.log("File", this.state.files.fileList[0].file)
        }

        // form_data2.append(`sr_no`, this.state.formData.sr_no)
        if (this.state.formData.storage_id != null) {
            form_data2.append(`storage_id`, this.state.formData.storage_id)
        }
        if (this.state.formData.serial_id != null) {
            form_data2.append(`serial_id`, this.state.formData.serial_id)
        }
        if (this.state.formData.stock_id != null) {
            form_data2.append(`stock_id`, this.state.formData.stock_id)//null
        }
        form_data2.append(`short_description`, this.state.formData.short_description)
        form_data2.append(`strength`, this.state.formData.strength)
        form_data2.append(`item_unit_size`, this.state.formData.item_unit_size)
        form_data2.append(`medium_description`, this.state.formData.medium_description)
        // form_data2.append(`long_description`, this.state.formData.long_description)
        form_data2.append(`note`, this.state.formData.note)
        // form_data2.append(`stock_id`, this.state.formData.stock_id)
        // form_data2.append(`condition_id`, this.state.formData.condition_id)
        // form_data2.append(`abc_class_id`, this.state.formData.abc_class_id)
        // form_data2.append(`storage_id`, this.state.formData.storage_id)
        // form_data2.append(`batch_trace_id`, this.state.formData.batch_trace_id)
        // form_data2.append(`cyclic_code_id`, this.state.formData.cyclic_code_id)
        // // form_data2.append(`movement_type_id`, this.state.formData.movement_type_id)
        form_data2.append(`shelf_life`, this.state.formData.shelf_life)
        form_data2.append(`standard_cost`, this.state.formData.standard_cost)
        // form_data2.append(`standard_shelf_life`, this.state.formData.standard_shelf_life )

        if (this.state.formData.uoms != null) {
            this.state.formData.uoms.forEach((element, index) => {
                form_data2.append(`uoms[` + index + `]`, element.id)
            });


            // form_data2.append(`uoms[0]`,this.state.formData.uoms)

        }


        // form_data2.append(`uoms[0]`,this.state.formData.uoms)

        form_data2.append(`sr_no`, this.state.formData.sr_no)
        form_data2.append(`previous_system_sr`, this.state.formData.previous_system_sr)
        form_data2.append(`previous_sr`, this.state.formData.previous_sr)
        form_data2.append(`primary_id`, this.state.formData.primary_id)
        // // form_data2.append(`conversion_facter`, this.state.formData.conversion_facter)
        // form_data2.append(`pack_quantity`, this.state.formData.pack_quantity)
        // form_data2.append(`cubic_size`, this.state.formData.cubic_size)
        // form_data2.append(`pack_weight`, this.state.formData.pack_weight)
        form_data2.append(`common_name`, this.state.formData.common_name)
        form_data2.append(`primary_wh`, this.state.formData.primary_wh)
        form_data2.append(`item_type_id`, this.state.formData.item_type_id)
        form_data2.append(`institution_id`, this.state.formData.institution_id)
        form_data2.append(`consumables`, this.state.formData.consumables)
        form_data2.append(`ven_id`, this.state.formData.ven_id)
        form_data2.append(`priority`, this.state.formData.priority)
        form_data2.append(`used_for_estimates`, this.state.formData.used_for_estimates)
        form_data2.append(`item_usage_type_id`, this.state.formData.item_usage_type_id)
        form_data2.append(`used_for_formulation`, this.state.formData.used_for_formulation)
        form_data2.append(`formulatory_approved`, this.state.formData.formulatory_approved)
        // // form_data2.append(`critical`, this.state.formData.critical)
        // form_data2.append(`nearest_round_up_value`, this.state.formData.nearest_round_up_value)
        form_data2.append(`specification`, this.state.formData.specification)
        // form_data2.append(`source_of_creation`, this.state.formData.source_of_creation)
        form_data2.append(`status`, this.state.formData.status)

        // form_data2.append(`dosage_code`, this.state.formData.dosage_code)


        // // form_data2.append(`countable`, this.state.formData.countable)
        // // form_data2.append(`reusable`, this.state.formData.reusable)
        // form_data2.append(`is_dosage_count`, this.state.formData.isDosageCount)
        // form_data2.append(`dosage_form_id`, this.state.formData.dosageForm)
        // form_data2.append(`measuring_unit_code_id`, this.state.formData.measuringUnitCode)
        // form_data2.append(`measuring_unit_id`, this.state.formData.measuringUnit)
        // form_data2.append(`display_unit_id`, this.state.formData.displayUnit)
        // form_data2.append(`default_route_id`, this.state.formData.defaultRoute)
        // form_data2.append(`default_frequency_id`, this.state.formData.defaultFrequency)
        // form_data2.append(`default_duration`, this.state.formData.defaultDuration)

        console.log("Formdata2", form_data2)
        let res = await InventoryService.editItem(itemId, form_data2)
        if (res.status == 200) {
            this.setState({
                alert: true,
                message: 'Item has been Edited Successfully.',
                severity: 'success',
            }, () => {
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
    getUOM() {
        let uoms = [];
        this.state.formData.uoms.forEach(element => {
            uoms.push(this.state.allUOMS.filter((ele) => ele.id === element.id))
        });
        this.setState({
            formData: {
                uoms: uoms
            }
        })
        setTimeout(() => {
            console.log("uom2", uoms)
        }, 2000);

        return uoms;
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        return (
            < Fragment >
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Edit Item" />

                        {this.state.loaded ?
                            <ValidatorForm
                                className="pt-2"
                                onSubmit={() => this.submit()}
                                onError={() => null}
                            >
                                <LoonsCard className="mt-3">
                                    <Typography variant="p" className="font-semibold">Item No: {this.state.formData.sr_no}</Typography>
                                    <Divider></Divider>
                                    <Grid className='mt-2' container spacing={2}>
                                        {/* Left top Section */}
                                        <Grid item xs={12} sm={12} md={9} lg={9}>
                                            <Grid container spacing={2}>
                                                <Grid className=" w-full" item lg={3} md={4} sm={12} xs={12} >
                                                    <SubTitle title="Item Group" />

                                                    <Autocomplete
                                                        disableClearable
                                                        className="w-full"
                                                        options={this.state.allGroups.filter((ele) => ele.status == "Active")}
                                                        onChange={(e, value) => {
                                                            if (value != null) {
                                                                let formData = this.state.formData;
                                                                formData.group_id = value.id
                                                                formData.sr_no = value.code + this.state.item_serial_code + this.state.item_post_fix
                                                                this.setState({ formData, group_code: value.code })

                                                            }
                                                        }}
                                                        value={this.state.allGroups.find((obj) => obj.id == this.state.formData.group_id
                                                        )}
                                                        getOptionLabel={(option) => option.name}
                                                        disabled={true}
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                value={this.state.allGroups.find((obj) => obj.id == this.state.formData.group_id)}
                                                                placeholder="Item Group"
                                                                //variant="outlined"
                                                                fullWidth
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

                                                <Grid className=" w-full" item lg={3} md={4} sm={12} xs={12} >
                                                    <SubTitle title="Subgroup" />

                                                    <Autocomplete
                                                        disableClearable
                                                        className="w-full"
                                                        options={this.state.allSerials.filter((ele) => ele.status == "Active")}
                                                        onChange={(e, value) => {
                                                            if (value != null) {
                                                                console.log("Subgroup", this.state.allSerials)
                                                                let formData = this.state.formData;
                                                                formData.serial_id = value.id
                                                                formData.sr_no = this.state.group_code + value.code + this.state.dosage_code + this.state.item_post_fix
                                                                formData.short_description = value.name2 + " "
                                                                formData.medium_description = value.name2 + " "
                                                                formData.long_description = value.name2 + "  "
                                                                this.setState({ formData, item_serial_code: value.code })

                                                            }
                                                        }}
                                                        value={this.state.allSerials.find((obj) => obj.id == this.state.formData.serial_id
                                                        )}
                                                        disabled={true}
                                                        getOptionLabel={(option) => option.name}
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Subgroup"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={this.state.allSerials.find((obj) => obj.id == this.state.formData.serial_id
                                                                )}
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
                                                <Grid className=" w-full" item lg={3} md={4} sm={12} xs={12} >
                                                    <SubTitle title="Serial Code" />
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Serial Code"
                                                        name="Item_Code"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={this.state.formData.dosage_code
                                                        }
                                                        type="number"
                                                        variant="outlined"
                                                        size="small"
                                                        disabled={true}
                                                        onChange={(e) => {
                                                            let formData = this.state.formData
                                                            formData.sr_no = this.state.group_code + this.state.item_serial_code + this.state.item_post_fix + e.target.value
                                                            formData.dosage_code = e.target.value
                                                            this.setState({ dosage_code: e.target.value })
                                                        }}
                                                    // onInput = {(e) =>{
                                                    //     e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)
                                                    // }}
                                                    // validators={[

                                                    //     'required',
                                                    //     'minNumber: 01','maxNumber: 99'

                                                    // ]}
                                                    // errorMessages={[

                                                    //     'this field is required',
                                                    //     'Code Should Greater-than: 01 ','Code Should Less-than: 99 '

                                                    // ]}
                                                    />
                                                </Grid>
                                                <Grid className=" w-full" item lg={3} md={4} sm={12} xs={12} >
                                                    <SubTitle title="UOM" />

                                                    <Autocomplete
                                                        disableClearable
                                                        className="w-full"
                                                        options={this.state.allUOMS.filter((ele) => ele.status == "Active")}
                                                        onChange={(e, value) => {
                                                            if (value != null) {
                                                                // let formData = this.state.formData;
                                                                let formData = this.state.formData;
                                                                formData.uoms = []
                                                                value.forEach(element => {
                                                                    formData.uoms.push(element)
                                                                });
                                                                //formData.uoms = value.id
                                                                this.setState({ formData }, () => {
                                                                    console.log("formdataUOM", this.state.formData.uoms)
                                                                })

                                                            }
                                                        }}

                                                        value={this.state.formData.uoms}
                                                        multiple
                                                        getOptionLabel={(option) => option.name}
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="UOM"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                <Grid className=" w-full" item lg={3} md={4} sm={12} xs={12} >
                                                    <SubTitle title="Strength/Size" />
                                                    <TextValidator
                                                        className=" w-full"
                                                        disabled={!this.state.editable}
                                                        placeholder="Strength/Size"
                                                        name="years"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={this.state.formData.strength
                                                        }

                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            let formData = this.state.formData
                                                            // formData.short_description =  formData.short_description+e.target.value
                                                            // formData.medium_description =formData.medium_description+e.target.value 
                                                            // formData.specification =  formData.specification+e.target.value
                                                            // formData.long_description =formData.long_description+e.target.value
                                                            formData.strength = e.target.value
                                                            this.setState({ formData })
                                                        }}
                                                       /*  validators={['required'
                                                        ]}
                                                        errorMessages={[
                                                            ' If not required add 0'
                                                        ]} */
                                                    />
                                                </Grid>


                                                <Grid className=" w-full" item lg={3} md={4} sm={12} xs={12} >
                                                    <SubTitle title="Previous Swastha SR" />
                                                    <TextValidator
                                                        disabled={!this.state.editable}
                                                        className=" w-full"
                                                        placeholder="Previous Swastha SR"
                                                        name="previous_sr"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={this.state.formData.previous_sr
                                                        }

                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            let formData = this.state.formData
                                                            formData.previous_sr = e.target.value
                                                            this.setState({ previous_sr: e.target.value })
                                                        }}
                                                    // onInput = {(e) =>{
                                                    //     e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)
                                                    // }}
                                                    // validators={[
                                                    //     "maxStringLength:3",
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'Maximum of 3 Digits',
                                                    //     'this field is required',
                                                    // ]}
                                                    />
                                                </Grid>
                                                <Grid className=" w-full" item lg={3} md={4} sm={12} xs={12} >
                                                    <SubTitle title="MS MIS SR" />
                                                    <TextValidator
                                                        disabled={!this.state.editable}
                                                        className=" w-full"
                                                        placeholder="MS MIS SR"
                                                        name="previous_system_sr"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={this.state.formData.previous_system_sr
                                                        }

                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            let formData = this.state.formData
                                                            formData.previous_system_sr = e.target.value
                                                            this.setState({ previous_system_sr: e.target.value })
                                                        }}
                                                    // onInput = {(e) =>{
                                                    //     e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)
                                                    // }}
                                                    // validators={[
                                                    //     "maxStringLength:3",
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'Maximum of 3 Digits',
                                                    //     'this field is required',
                                                    // ]}
                                                    />
                                                </Grid>




                                            </Grid>
                                        </Grid>
                                        <Grid item xs={3} sm={2} md={3} lg={3}>
                                            {/* <div> */}
                                            <SubTitle title="Item Number" />
                                            <Typography variant="h5" className="font-semibold">{this.state.formData.sr_no}</Typography>
                                            {/* </div> */}
                                        </Grid>
                                    </Grid>
                                    <div className='mt-3'></div>
                                    <Divider></Divider>

                                    <Grid className='mt-3' container spacing={2}>
                                        {/* <Grid className=" w-full" item lg={3} md={4} sm={12} xs={12} >
                                                <SubTitle title="Unit Size" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="unitSize"
                                                    name="unitSize"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={this.state.formData.item_unit_size
                                                    }
                                                   
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        let formData = this.state.formData
                                                        formData.item_unit_size = e.target.value
                                                        this.setState({ formData })
                                                    }}
                                               
                                                />
                                            </Grid> */}
                                        {/* Left top Section */}
                                        <Grid item xs={12} sm={12} md={4} lg={4}>
                                            <SubTitle title="Short Description" />
                                            <TextValidator
                                                disabled={!this.state.editable}
                                                className=" w-full"
                                                placeholder="Short Description"
                                                name="short_description"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={this.state.formData.short_description
                                                }

                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    let formData = this.state.formData
                                                    formData.short_description = e.target.value
                                                    // formData.medium_description =e.target.value
                                                    //formData.specification = e.target.value + formData.strength
                                                    // formData.long_description =e.target.value  + formData.strength 
                                                    this.setState({ formData })
                                                }}

                                            />
                                        </Grid>


                                        <Grid item xs={12} sm={12} md={4} lg={4}>
                                            <SubTitle title="Medium Description" />
                                            <TextValidator
                                                disabled={!this.state.editable}
                                                className=" w-full"
                                                placeholder="Medium Description"
                                                name="medium_description"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={this.state.formData.medium_description
                                                }

                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    let formData = this.state.formData
                                                    formData.medium_description = e.target.value
                                                    //formData.specification =  e.target.value + formData.strength 

                                                    this.setState({ formData })
                                                }}

                                            />
                                        </Grid>


                                        {/* <Grid item xs={12} sm={12} md={4} lg={4}>
                                        <SubTitle title="Long Description" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Long Description"
                                            name="long_description"
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            value={this.state.formData.long_description
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData = this.state.formData
                                                formData.long_description = e.target.value
                                                this.setState({ formData })
                                            }}
                                       
                                        />
                                    </Grid> */}

                                        {/* <Grid item xs={12} sm={12} md={4} lg={4}> */}
                                        {/* <SubTitle title="Nearest Round up Value " />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Nearest Round up Value"
                                            name="nearest_round_up_value"
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            value={this.state.formData.nearest_round_up_value
                                            }
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData = this.state.formData
                                                formData.nearest_round_up_value = e.target.value
                                                this.setState({ formData })
                                            }}
                                         validators={['required']}
                                     errorMessages={[
                                         'this field is required',
                                     ]} 
                                        />
                                    </Grid> */}
                                        <Grid className='mt-3' container spacing={2}
                                        >
                                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                                <SubTitle title="Specification" />

                                                <RichTextEditor
                                                    className="react-rte-itemMaster"
                                                    controls={[
                                                        'bold',
                                                        'italic',
                                                        'underline',
                                                        'strikethrough',
                                                        'link',
                                                        'numberList',
                                                        'bulletList',
                                                        'undo',
                                                        'redo',
                                                    ]}
                                                    value={this.state.value}
                                                    disabled={!this.state.editable}
                                                    onChange={(value) => {

                                                        let formData = this.state.formData
                                                        formData.specification = value.toString('html')
                                                        this.setState({ formData, value })
                                                        console.log("values", formData.specification)

                                                    }}
                                                />





                                                {/*  <TextValidator
                                                    className=" w-full"
                                                    placeholder="Specification"
                                                    name="specification"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={this.state.formData.specification
                                                    }

                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    multiline
                                                    rows={10}
                                                    onChange={(e) => {
                                                        let formData = this.state.formData
                                                        formData.specification = e.target.value
                                                        this.setState({ formData })
                                                    }}
                                                //      validators={['required']}
                                                //  errorMessages={[
                                                //      'this field is required',
                                                //  ]} 
                                                /> */}
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                                <SubTitle title="Note" />
                                                <TextValidator
                                                    disabled={!this.state.editable}
                                                    className=" w-full"
                                                    placeholder="Note"
                                                    name="note"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={this.state.formData.note
                                                    }

                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    multiline
                                                    rows={3}
                                                    onChange={(e) => {
                                                        let formData = this.state.formData
                                                        formData.note = e.target.value
                                                        this.setState({ formData })
                                                    }}

                                                />
                                            </Grid>


                                        </Grid>

                                    </Grid>
                                </LoonsCard>

                                <Grid className='mt-3' container spacing={2}>
                                    {/* <Grid item xs={12} sm={12} md={6} lg={6}> */}
                                    {/* <LoonsCard className="mt-3"> */}
                                    {/* <Typography variant="p" className="font-semibold">Stock Details</Typography>
                                        <Divider></Divider> */}
                                    {/* <Grid className='mt-3' container spacing={2}> */}
                                    {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <SubTitle title="Stock" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allStocks.filter((ele) => ele.status == "Active")}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.stock_id = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={this.state.allStocks.find((obj) => obj.id == this.state.formData.stock_id
                                                    )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Stock"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid> */}

                                    {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <SubTitle title="Condition" />

                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allConditions.filter((ele) => ele.status == "Active")}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.condition_id = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={this.state.allConditions.find((obj) => obj.id == this.state.formData.condition_id
                                                    )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Condition"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid> */}





                                    {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <SubTitle title="Batch Trace" />

                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allBatchTraces.filter((ele) => ele.status == "Active")}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.batch_trace_id = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={this.state.allBatchTraces.find((obj) => obj.id == this.state.formData.batch_trace_id
                                                    )}  
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Batch Trace"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid>
 */}
                                    {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <SubTitle title="ABC Class" />

                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allABCClasses.filter((ele) => ele.status == "Active")}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.abc_class_id = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={this.state.allABCClasses.find((obj) => obj.id == this.state.formData.abc_class_id
                                                    )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="ABC Class"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid> */}

                                    {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <SubTitle title="Cyclic Code" />

                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allCyclicCodes.filter((ele) => ele.status == "Active")}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.cyclic_code_id = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={this.state.allCyclicCodes.find((obj) => obj.id == this.state.formData.cyclic_code_id
                                                    )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Cyclic Code"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid> */}

                                    {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <SubTitle title="Movement Type" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allMovementTypes.filter((ele) => ele.status == "Active")}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            // formData.movement_type_id = value.id
                                                            this.setState({ formData })
                                                        }
                                                    }}
                                                    // value={this.state.allMovementTypes.find((obj) => obj.id == this.state.formData.movement_type_id
                                                    )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Movement Type"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid> */}

                                    {/* add checkbox */}
                                    {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <SubTitle title="Shelf Life(In Months)" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Shelf Life"
                                                    name="Shelf_Life"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={this.state.formData.shelf_life
                                                    }
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                     multiline
                                                    rows={3} 
                                                    onChange={(e) => {
                                                        let formData = this.state.formData
                                                        formData.shelf_life = e.target.value
                                                        this.setState({ formData })
                                                    }}
                                                 validators={['required']}
                                             errorMessages={[
                                                 'this field is required',
                                             ]} 
                                                />
                                            </Grid> */}



                                    {/* */}


                                    {/* </Grid> */}
                                    {/* </LoonsCard> */}
                                    {/* </Grid> */}

                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <LoonsCard className="mt-3">
                                            <Typography variant="p" className="font-semibold">Other Details</Typography>
                                            <Divider></Divider>
                                            <Grid className='mt-3' container spacing={2}>
                                                <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                    <SubTitle title="Primary WH" />

                                                    <Autocomplete
                                                        disableClearable
                                                        className="w-full"
                                                        disabled={!this.state.editable}
                                                        options={this.state.allWH}
                                                        //options={this.state.allWH.filter((ele) => ele.status == "Active")}
                                                        onChange={(e, value) => {
                                                            if (value != null) {
                                                                let formData = this.state.formData;
                                                                formData.primary_wh = value.id
                                                                this.setState({ formData })

                                                            }
                                                        }}
                                                        value={this.state.allWH.find((obj) => obj.id == this.state.formData.primary_wh
                                                        )}

                                                        getOptionLabel={(option) => option.name}
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Primary WH"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={this.state.allWH.find((obj) => obj.id == this.state.formData.primary_wh
                                                                )}
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

                                                <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                    <SubTitle title="Item Type" />

                                                    <Autocomplete
                                                        disableClearable
                                                        disabled={!this.state.editable}
                                                        className="w-full"
                                                        options={this.state.allItemTypes.filter((ele) => ele.status == "Active")}
                                                        onChange={(e, value) => {
                                                            if (value != null) {
                                                                let formData = this.state.formData;
                                                                formData.item_type_id = value.id
                                                                this.setState({ formData })

                                                            }
                                                        }}
                                                        value={this.state.allItemTypes.find((obj) => obj.id == this.state.formData.item_type_id
                                                        )}

                                                        getOptionLabel={(option) => option.name}
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Item Type"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                    <SubTitle title="Institution Level" />

                                                    <Autocomplete
                                                        disableClearable
                                                        disabled={!this.state.editable}
                                                        className="w-full"
                                                        options={this.state.allInstitution.filter((ele) => ele.status == "Active")}
                                                        onChange={(e, value) => {
                                                            if (value != null) {
                                                                let formData = this.state.formData;
                                                                formData.institution_id = value.id
                                                                this.setState({ formData })

                                                            }
                                                        }}
                                                        value={this.state.allInstitution.find((obj) => obj.id == this.state.formData.institution_id
                                                        )}

                                                        getOptionLabel={(option) => option.name}
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Institution Level"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                    <SubTitle title="Consumables" />
                                                    <RadioGroup row>
                                                        <FormControlLabel
                                                            disabled={!this.state.editable}
                                                            label={'Yes'}
                                                            name="consumables"
                                                            value={'Yes'}
                                                            onChange={() => {
                                                                let formData = this.state.formData
                                                                formData.consumables = 'Y';

                                                                this.setState({
                                                                    formData,
                                                                    shelfLife: true
                                                                })
                                                            }}
                                                            control={
                                                                <Radio color="primary" size='small' />
                                                            }

                                                            display="inline"
                                                            checked={this.state.formData.consumables == 'Y' ? true : false
                                                            }
                                                        />

                                                        <FormControlLabel
                                                            disabled={!this.state.editable}
                                                            label={'No'}
                                                            name="consumables"
                                                            value={'No'}
                                                            onChange={() => {
                                                                let formData = this.state.formData
                                                                formData.consumables = 'N'
                                                                formData.shelf_life = "No Shelf Life"
                                                                this.setState({
                                                                    formData,
                                                                    shelfLife: false
                                                                })
                                                            }}
                                                            control={
                                                                <Radio color="primary" size='small' />
                                                            }

                                                            display="inline"
                                                            checked={
                                                                this.state.formData.consumables == 'N' ? true : false
                                                            }
                                                        />
                                                    </RadioGroup>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                                    <SubTitle title="Storage" />

                                                    <Autocomplete
                                                        disableClearable
                                                        disabled={!this.state.editable}
                                                        className="w-full"
                                                        options={this.state.allStorages.filter((ele) => ele.status == "Active")}
                                                        onChange={(e, value) => {
                                                            if (value != null) {
                                                                let formData = this.state.formData;
                                                                formData.storage_id = value.id
                                                                this.setState({ formData })

                                                            }
                                                        }}
                                                        value={this.state.allStorages.find((obj) => obj.id == this.state.formData.storage_id
                                                        )}

                                                        getOptionLabel={(option) => option.name}
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Storage"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                    <SubTitle title="Used for Estimate" />
                                                    <RadioGroup row>
                                                        <FormControlLabel
                                                            label={'Yes'}
                                                            disabled={!this.state.editable}
                                                            name="used_for_estimates"
                                                            value={'Yes'}
                                                            onChange={() => {
                                                                let formData = this.state.formData
                                                                formData.used_for_estimates = 'Y';

                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }}

                                                            control={
                                                                <Radio color="primary" size='small' />
                                                            }
                                                            display="inline"
                                                            checked={this.state.formData.used_for_estimates == 'Y' ? true : false
                                                            }
                                                        />

                                                        <FormControlLabel
                                                            label={'No'}
                                                            disabled={!this.state.editable}
                                                            name="used_for_estimates"
                                                            value={'No'}
                                                            onChange={() => {
                                                                let formData = this.state.formData
                                                                formData.used_for_estimates = 'N'
                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }}

                                                            control={
                                                                <Radio color="primary" size='small' />
                                                            }
                                                            display="inline"
                                                            checked={
                                                                this.state.formData.used_for_estimates == 'N' ? true : false
                                                            }
                                                        />
                                                    </RadioGroup>
                                                </Grid>

                                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                                    <SubTitle title="Standard Cost(Tentative)" />
                                                    <TextValidator

                                                        className=" w-full"
                                                        placeholder="Standard Cost "
                                                        name="standard_cost"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={this.state.formData.standard_cost}
                                                        type="number"

                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            let formData = this.state.formData
                                                            formData.standard_cost = e.target.value
                                                            this.setState({ formData })
                                                        }}
                                                    /*  validators={['required']}
                                                 errorMessages={[
                                                     'this field is required',
                                                 ]} */
                                                    />
                                                </Grid>



                                                {/* <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                // <SubTitle title="Critical" />
                                                <RadioGroup row>
                                                    <FormControlLabel
                                                        label={'Yes'}
                                                        // name="critical"
                                                        value={true}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            // formData.critical = true;

                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.critical
                                                        }
                                                    />

                                                    <FormControlLabel
                                                        label={'No'}
                                                        // name="critical"
                                                        value={false}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            // formData.critical = false
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={
                                                            // !this.state.formData.critical
                                                        }
                                                    />
                                                </RadioGroup>
                                            </Grid> */}



                                                <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                    <SubTitle title="Formulatory Approved" />
                                                    <RadioGroup row>
                                                        <FormControlLabel
                                                            label={'Yes'}
                                                            disabled={!this.state.editable}
                                                            name="formulatory_approved"
                                                            value={'Yes'}
                                                            onChange={() => {
                                                                let formData = this.state.formData
                                                                formData.formulatory_approved = 'Y';

                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }}
                                                            control={
                                                                <Radio color="primary" size='small' />
                                                            }

                                                            display="inline"
                                                            checked={this.state.formData.formulatory_approved == 'Y' ? true : false
                                                            }
                                                        />

                                                        <FormControlLabel
                                                            label={'No'}
                                                            name="formulatory_approved"
                                                            disabled={!this.state.editable}
                                                            value={'No'}
                                                            onChange={() => {
                                                                let formData = this.state.formData
                                                                formData.formulatory_approved = 'N'
                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }}

                                                            control={
                                                                <Radio color="primary" size='small' />
                                                            }
                                                            display="inline"
                                                            checked={
                                                                this.state.formData.formulatory_approved == 'N' ? true : false
                                                            }
                                                        />
                                                    </RadioGroup>
                                                </Grid>


                                                <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                    <SubTitle title="Item Usage Type" />

                                                    <Autocomplete
                                                        disableClearable
                                                        disabled={!this.state.editable}
                                                        className="w-full"
                                                        options={this.state.allItemUsageTypes.filter((ele) => ele.status == "Active")}

                                                        onChange={(e, value) => {
                                                            if (value != null) {
                                                                let formData = this.state.formData;
                                                                formData.item_usage_type_id = value.id
                                                                this.setState({ formData })
                                                            }
                                                        }}
                                                        value={this.state.allItemUsageTypes.find((obj) => obj.id == this.state.formData.item_usage_type_id
                                                        )}

                                                        getOptionLabel={(option) => option.name}
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Item Usage Type"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                            />
                                                        )}
                                                    />
                                                </Grid>


                                                <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                    <SubTitle title="Used for Formulation" />
                                                    <RadioGroup row>
                                                        <FormControlLabel
                                                            disabled={!this.state.editable}
                                                            label={'Yes'}
                                                            name="used_for_formulation"
                                                            value={'Yes'}

                                                            onChange={() => {
                                                                let formData = this.state.formData
                                                                formData.used_for_formulation = 'Y';

                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }}
                                                            control={
                                                                <Radio color="primary" size='small' />
                                                            }
                                                            display="inline"
                                                            checked={this.state.formData.used_for_formulation == 'Y' ? true : false
                                                            }
                                                        />

                                                        <FormControlLabel

                                                            disabled={!this.state.editable}
                                                            label={'No'}
                                                            name="used_for_estimates"
                                                            value={'No'}
                                                            onChange={() => {
                                                                let formData = this.state.formData
                                                                formData.used_for_formulation = 'N'
                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }}

                                                            control={
                                                                <Radio color="primary" size='small' />
                                                            }
                                                            display="inline"
                                                            checked={
                                                                this.state.formData.used_for_formulation == 'N' ? true : false
                                                            }
                                                        />
                                                    </RadioGroup>
                                                </Grid>
                                                <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                    <SubTitle title="VEN" />

                                                    <Autocomplete
                                                        disableClearable
                                                        disabled={!this.state.editable}
                                                        className="w-full"
                                                        options={this.state.allVENS.filter((ele) => ele.status == "Active")}
                                                        onChange={(e, value) => {
                                                            if (value != null) {
                                                                let formData = this.state.formData;
                                                                formData.ven_id = value.id
                                                                this.setState({ formData })


                                                            }
                                                        }}
                                                        value={this.state.allVENS.find((obj) => obj.id == this.state.formData.ven_id
                                                        )}

                                                        getOptionLabel={(option) => option.name}
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Vital"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={this.state.allVENS.find((obj) => obj.id == this.state.formData.ven_id
                                                                )}
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
                                                <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                    <SubTitle title="Priority" />
                                                    <RadioGroup row>
                                                        <FormControlLabel
                                                            label={'Yes'}
                                                            disabled={!this.state.editable}
                                                            name="priority"
                                                            value={'Yes'}
                                                            onChange={() => {
                                                                let formData = this.state.formData
                                                                formData.priority = 'Yes';
                                                                this.setState({
                                                                    formData,

                                                                })
                                                            }}
                                                            control={
                                                                <Radio color="primary" size='small' />
                                                            }
                                                            display="inline"
                                                            checked={this.state.formData.priority == 'Yes' ? true : false
                                                            }
                                                        />

                                                        <FormControlLabel
                                                            label={'No'}
                                                            disabled={!this.state.editable}
                                                            name="priority"
                                                            value={'No'}
                                                            onChange={() => {
                                                                let formData = this.state.formData
                                                                formData.priority = 'No'
                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }}
                                                            control={
                                                                <Radio color="primary" size='small' />
                                                            }
                                                            display="inline"
                                                            checked={
                                                                this.state.formData.priority == 'No' ? true : false
                                                            }
                                                        />
                                                    </RadioGroup>
                                                </Grid>
                                                {this.state.shelfLife == true ?
                                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                                        <SubTitle title=" Shelf Life(In Months)" />
                                                        <TextValidator
                                                            disabled={!this.state.editable}
                                                            className=" w-full"
                                                            placeholder="Shelf Life(In Months)"
                                                            name="shelf_life"
                                                            InputLabelProps={{
                                                                shrink: false,
                                                            }}
                                                            value={this.state.formData.shelf_life
                                                            }
                                                            type="number"
                                                            variant="outlined"
                                                            size="small"
                                                            onChange={(e) => {
                                                                let formData = this.state.formData
                                                                formData.shelf_life = e.target.value
                                                                this.setState({ formData })
                                                            }}
                                                            validators={['required']}
                                                            errorMessages={[
                                                                'This field is required',
                                                            ]}
                                                        />
                                                    </Grid>

                                                    : null

                                                }

                                                {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <SubTitle title=" Shelf Life(In Months)" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Shelf Life(In Months)"
                                                    name="shelf_life"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={this.state.formData.shelf_life
                                                    }
                                                   
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        let formData = this.state.formData
                                                        formData.shelf_life = e.target.value
                                                        this.setState({ formData })
                                                    }} 
                                                  validators={['required']}
                                             errorMessages={[
                                                 'This field is required',
                                              ]} 
                                                 />
                                            </Grid>  */}

                                                {/* <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Item Status" />

                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={appConst.item_status}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.status = value.value
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={appConst.item_status.find((obj) => obj.value == this.state.formData.status)}
                                                    getOptionLabel={(option) => option.label}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Item Status"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid> */}
                                                {/* <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Source of Creation" />

                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={appConst.source_of_creation}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.source_of_creation = value.value
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={appConst.source_of_creation.find((obj) => obj.value == this.state.formData.source_of_creation)}
                                                    getOptionLabel={(option) => option.label}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Source of Creation"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid> */}
                                            </Grid>
                                        </LoonsCard>

                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>


                                        <LoonsCard className="mt-3">
                                            <Typography variant="p" className="font-semibold">Appearance</Typography>
                                            <Divider></Divider>
                                            <Grid className='mt-3' container spacing={2}>
                                                {/* <Grid item xs={12} sm={12} md={6} lg={6}>

                                                <SubTitle title="Conversion Factor" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Conversion Factor"
                                                    // name="conversion_facter"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    // value={this.state.formData.conversion_facter
                                                    }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        let formData = this.state.formData
                                                        // formData.conversion_facter = e.target.value
                                                        this.setState({ formData })
                                                    }}
                                               
                                                />
                                            </Grid>


                                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <SubTitle title="Pack Quantitiy" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Pack Quantity"
                                                    name="pack_quantity"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={this.state.formData.pack_quantity
                                                    }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        let formData = this.state.formData
                                                        formData.pack_quantity = e.target.value
                                                        this.setState({ formData })
                                                    }}
                                               
                                                />
                                            </Grid>


                                            <Grid item xs={12} sm={12} md={6} lg={6}>

                                                <SubTitle title="Cubic Size" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Cubic Size"
                                                    name="cubic_size"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={this.state.formData.cubic_size
                                                    }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        let formData = this.state.formData
                                                        formData.cubic_size = e.target.value
                                                        this.setState({ formData })
                                                    }}
                                               
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={6} lg={6}>

                                                <SubTitle title="Pack Weight" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Pack Weight"
                                                    name="pack_weight"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={this.state.formData.pack_weight
                                                    }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        let formData = this.state.formData
                                                        formData.pack_weight = e.target.value
                                                        this.setState({ formData })
                                                    }}
                                               
                                                />
                                            </Grid> */}

                                                <Grid item xs={12} sm={12} md={6} lg={6}>

                                                    <SubTitle title="Common Name" />
                                                    <TextValidator
                                                        disabled={!this.state.editable}
                                                        disableClearable
                                                        className=" w-full"
                                                        placeholder="Common Name"
                                                        name="common_name"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={this.state.formData.common_name
                                                        }

                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            let formData = this.state.formData
                                                            formData.common_name = e.target.value
                                                            this.setState({ formData })
                                                        }}
                                                    /*  validators={['required']}
                                                 errorMessages={[
                                                     'this field is required',
                                                 ]} */
                                                    />
                                                </Grid>

                                                <Grid
                                                    item
                                                    // className="mt-2"
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    {/* <DocumentLoader files={this.fileformat(this.state.formData.file,this.state.formData.extension,this.state.formData.path)} /> */}

                                                </Grid>
                                                <Grid container spacing={2}>

                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SwasthaFilePicker
                                                            // uploadingSectionVisibility={this.state.loginUserRoles.includes('Hospital Admin')}
                                                            id="file_public"
                                                            singleFileEnable={false}
                                                            multipleFileEnable={true}
                                                            dragAndDropEnable={true}
                                                            tableEnable={true}

                                                            documentName={true}//document name enable
                                                            documentNameValidation={['required']}
                                                            documenterrorMessages={['this field is required']}
                                                            documentNameDefaultValue={null}//document name default value. if not value set null

                                                            type={true}
                                                            types={[{ label: "Item Photo", value: "Item Photo" }]}
                                                            typeValidation={['required']}
                                                            typeErrorMessages={['this field is required']}
                                                            defaultType={null}// null

                                                            description={true}
                                                            descriptionValidation={null}
                                                            descriptionErrorMessages={null}
                                                            defaultDescription={null}//null

                                                            onlyMeEnable={false}
                                                            defaultOnlyMe={false}

                                                            source="ItemSnaps"
                                                            source_id={this.props.match.params.id}

                                                            //accept="image/png"
                                                            // maxFileSize={1048576}
                                                            // maxTotalFileSize={1048576}
                                                            maxFilesCount={1}
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
                                                            /* selectedFileList={
                                                                this.state.data.fileList
                                                            } */
                                                            label="Select Attachment"
                                                            singleFileButtonText="Upload Data"
                                                        // multipleFileButtonText="Select Files"
                                                        >
                                                        </SwasthaFilePicker>
                                                    </Grid>
                                                </Grid>



                                            </Grid>

                                        </LoonsCard>
                                    </Grid>

                                </Grid>



                                <Grid className='mt-3' container spacing={2}>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        {/* <LoonsCard className="mt-3">
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
                                                                'This field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                            <SubTitle title="Medium Description" />
                                            <Typography variant="h5">{this.state.formData.medium_description}</Typography>

                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                // <SubTitle title="Countable" />
                                                <RadioGroup row>
                                                    <FormControlLabel
                                                        label={'Yes'}
                                                        // name="Countable"
                                                        value={true}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            if(formData != null || formData == "Yes"){
                                                                // formData.countable = 'Yes';

                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.countable == 'Yes' ? true : false
                                                    }  
                                                    />

                                                    <FormControlLabel
                                                        label={'No'}
                                                        // name="Countable"
                                                        value={false}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            // formData.countable = 'No';
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.countable == 'No' ? true : false
                                                    }                                                    
                                                    />
                                                </RadioGroup>
                                            </Grid>
                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                // <SubTitle title="Reusable" />
                                                <RadioGroup row>
                                                    <FormControlLabel
                                                        label={'Yes'}
                                                        // name="Reusable"
                                                        value={'Yes'}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            // formData.reusable = 'Yes';

                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.reusable == 'Yes' ? true : false
                                                        }
                                                    />

                                                    <FormControlLabel
                                                        label={'No'}
                                                        // name="Reusable"
                                                        value={'No'}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            // formData.reusable = 'No'
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={
                                                            // this.state.formData.reusable == 'No' ? true : false
                                                        }
                                                    />
                                                </RadioGroup>
                                            </Grid>
                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                // <SubTitle title="Critical" />
                                                <RadioGroup row>
                                                    <FormControlLabel
                                                        label={'Yes'}
                                                        // name="critical"
                                                        value={true}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            // formData.critical = true;

                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.critical
                                                        }
                                                    />

                                                    <FormControlLabel
                                                        label={'No'}
                                                        // name="critical"
                                                        value={false}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            // formData.critical = false
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={
                                                            // !this.state.formData.critical
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
                                                                'This field is required',
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
                                                                'This field is required',
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
                                                            // formData.displayUnit = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    // value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
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
                                                            // value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
                                                            )}
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
                                            
                                        </Grid>
                                    </LoonsCard> */}
                                        {/* <LoonsCard className="mt-3">
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
                                                                'This field is required',
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
                                                                'This field is required',
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
                                
                                        />
                                    </Grid>


                                            
                                        </Grid>
                                    </LoonsCard> */}

                                    </Grid>
                                </Grid>


                                <Button
                                    className="mt-2 mr-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    startIcon="save"
                                //onClick={this.handleChange}
                                >
                                    <span className="capitalize">
                                        Submit
                                    </span>
                                </Button>

                            </ValidatorForm>
                            : <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress
                                    size={30}
                                />
                            </Grid>}
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

export default withStyles(styleSheet)(EditItem)
