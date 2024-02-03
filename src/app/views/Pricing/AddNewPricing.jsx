import React, { Component, Fragment } from 'react'
import { Divider, Grid, IconButton, CircularProgress,Tooltip,Dialog,DialogActions,DialogContent,
   } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete } from '@material-ui/lab'
import {
    CardTitle,
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    Button,
    MainContainer,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import EditIcon from '@material-ui/icons/Edit'
import HealingIcon from '@mui/icons-material/Healing'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import VisibilityIcon from '@material-ui/icons/Visibility'
import * as appConst from '../../../appconst'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import 'date-fns'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import WarehouseServices from 'app/services/WarehouseServices'
import ConsignmentService from 'app/services/ConsignmentService'
import InventoryService from 'app/services/InventoryService'
import localStorageService from "app/services/localStorageService";
import AddIcon from '@material-ui/icons/Add';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';

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

class AddNewPricing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            login_user_roles: [],
            addPricing:false,
            columns: [
                {
                    name: 'action',
                    label: 'Actions',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id
                            let name = this.state.data[dataIndex]?.medium_description
                            return (
                                <Grid>
                                        <Tooltip title="Allocate">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/pricing/changed_item_prices/${id}/${name}`
                                               
                                                }}>
                                                <AddIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                   
                                     <Tooltip title="View Item">
                                    <IconButton
                                        onClick={() => {
                                            window.location.href = `/item-mst/view-item-mst/${id}`
                                        }}
                                        className="px-2"
                                        size="small"
                                        aria-label="View Item"
                                    >
                                        <VisibilityIcon color='primary' />
                                    </IconButton>
                                    </Tooltip>
                                </Grid>
                            )
                        },
                    },
                },

                {
                    name: 'sr_no', // field name in the row object
                    label: 'Item Code', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'Item_Category',
                    label: 'Item Category',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex].Serial.Group.Category
                                    .description
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'ven',
                    label: 'VEN Name',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].VEN.name
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'medium_description',
                    label: 'Medium Description',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'groupName',
                    label: 'Group Name',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex].Serial.Group.name
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'warehouse_name',
                    label: 'Warehouse Name',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Warehouse.name
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'serial',
                    label: 'Serial Code',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Serial.code
                            return <p>{data}</p>
                        },
                    },
                },

            ],

            alert: false,
            message: '',
            severity: 'success',

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

            loaded: false,
            totalItems: 0,
            totalPages: 0,
            formData: {
                page: 0,
                limit: 20,
                group_id: null,
                serial_id: null,
                primary_wh: null,
                stock_id: null,
                condition_id: null,
                storage_id: null,
                batch_trace_id: null,
                abc_class_id: null,
                movement_type_id: null,
                uom_id: null,
                institution_id: null,
                item_type_id: null,
                conversion_facter: null,
                consumables: null,
                ven_id: null,
                used_for_estimates: null,
                used_for_formulation: null,
                item_usage_type_id: null,
                search: null,
                sr_no: null,
                short_description: null
            },
        }
    }

    async loadGroups() {
        let params = { limit: 99999, page: 0 }
        const res = await GroupSetupService.fetchAllGroup(params)

        if (res.status == 200) {
            this.setState({ allGroups: res.data.view.data })
        }
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

        if (res.status == 200) {
            this.setState({ allBatchTraces: res.data.view.data })
        }
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

    async loadItemUsageTypes() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getItemUsageTypes(params)

        if (res.status == 200) {
            this.setState({ allItemUsageTypes: res.data.view.data })
        }
    }

    async loadItem() {
        this.setState({ loaded: false })

        const res = await InventoryService.fetchAllItems(this.state.formData)
        let group_id = 0
        if (res.status == 200) {
            if (res.data.view.data.length != 0) {
                group_id = res.data.view.data[0]
                // .pharmacy_order_id
            }
            console.log('item Data', res.data.view)
            this.setState(
                {
                    data: res.data.view.data,
                    loaded: true,
                    totalItems: res.data.view.totalItems,
                    totalPages: res.data.view.totalPages,
                },
                () => {
                    this.render()
                    // this.getCartItems()
                }
            )
        }
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState(
            {
                formData,
            },
            () => {
                this.loadItem()
            }
        )
    }

    async componentDidMount() {

        let login_user_info = await localStorageService.getItem("userInfo");

        this.setState({ login_user_roles: login_user_info.roles })

        this.loadGroups()
        this.loadSerials()
        this.loadWH()
        this.loadVENS()
        this.loadUOMS()
        this.loadStocks()
        this.loadConditions()
        this.loadStorages()
        this.loadBatchTraces()
        this.loadABCClasses()
        this.loadCyclicCodes()
        this.loadMovementTypes()
        this.loadItemTypes()
        this.loadInstitutions()
        this.loadItemUsageTypes()
        this.loadItem()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <CardTitle title="All Items" />

                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.loadItem()}
                            onError={() => null}
                        >
                            <Grid container spacing={2}>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="SR Number" />
                                    <TextValidator
                                        className="w-full"
                                        placeholder="SR Number"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        type='number'
                                        size="small"
                                        value={this.state.formData.sr_no}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            formData.sr_no = e.target.value
                                            this.setState({ formData })
                                            console.log(
                                                'form dat',
                                                this.state.formData
                                            )
                                        }}
                                        // validators={['maxNumber:999999']}
                                        // errorMessages={[
                                        //     'Maximum of 6 Digits'
                                        // ]}
                                        InputProps={{}}

                                    />
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Short Description" />
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Short Description"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.short_description}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            formData.short_description = e.target.value
                                            this.setState({ formData })
                                            console.log(
                                                'form dat',
                                                this.state.formData
                                            )
                                        }}
                                        /* validators={[
                'required',
                ]}
                errorMessages={[
                'this field is required',
                ]} */
                                        InputProps={{}}
                                    /*  validators={['required']}
errorMessages={[
'this field is required',
]} */
                                    />
                                </Grid>

                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Item Group" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allGroups.filter(
                                            (ele) => ele.status == 'Active'
                                        )}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData =
                                                    this.state.formData
                                                formData.group_id = value.id
                                                // formData.sr_no =
                                                //     value.code +
                                                //     this.state
                                                //         .item_serial_code +
                                                //     this.state.item_post_fix
                                                this.setState({
                                                    formData,
                                                    // group_id: value.id,
                                                })
                                            }
                                            else{
                                                let formData =
                                                this.state.formData
                                            formData.group_id = null

                                            this.setState({
                                                formData,
                                            })
                                            }
                                        }}
                                        value={this.state.allGroups.find(
                                            (obj) =>
                                                obj.id ==
                                                this.state.formData.group_id
                                        )}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Item Group"
                                                //variant="outlined"
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
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Item Serial" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allSerials.filter(
                                            (ele) => ele.status == 'Active'
                                        )}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData =
                                                    this.state.formData
                                                formData.serial_id = value.id
                                                this.setState({
                                                    formData,

                                                })
                                            }
                                            else{
                                                let formData =
                                                this.state.formData
                                            formData.serial_id = null

                                            this.setState({
                                                formData,
                                            })
                                            }
                                            
                                        }}
                                        value={this.state.allSerials.find(
                                            (obj) =>
                                                obj.id ==
                                                this.state.formData.serial_id
                                        )}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Item Serial"
                                                //variant="outlined"
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
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Primary WH" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allWH}
                                        //options={this.state.allWH.filter((ele) => ele.status == "Active")}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData =
                                                    this.state.formData
                                                formData.primary_wh = value.id
                                                this.setState({ formData })
                                            }
                                            else{
                                                let formData =
                                                this.state.formData
                                            formData.primary_wh = null

                                            this.setState({
                                                formData,
                                            })
                                            }
                                        }}
                                        value={this.state.allWH.find(
                                            (obj) =>
                                                obj.id ==
                                                this.state.formData.primary_wh
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
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Storage" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allStorages.filter(
                                            (ele) => ele.status == 'Active'
                                        )}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData =
                                                    this.state.formData
                                                formData.storage_id = value.id
                                                this.setState({ formData })
                                            }
                                            else{
                                                let formData =
                                                this.state.formData
                                            formData.storage_id = null

                                            this.setState({
                                                formData,
                                            })
                                            }
                                        }}
                                        value={this.state.allStorages.find(
                                            (obj) =>
                                                obj.id ==
                                                this.state.formData.serial_id
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
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="UOM" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allUOMS.filter(
                                            (ele) => ele.status == 'Active'
                                        )}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData =
                                                    this.state.formData
                                                formData.uom_id = value
                                                this.setState({ formData })
                                            }
                                            else{
                                                let formData =
                                                this.state.formData
                                            formData.uom_id = null

                                            this.setState({
                                                formData,
                                            })
                                            }
                                        }}
                                        value={this.state.allUOMS.find(
                                            (obj) =>
                                                obj.id ==
                                                this.state.formData.uom_id
                                        )}
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

                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Institutional Level" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allInstitution.filter(
                                            (ele) => ele.status == 'Active'
                                        )}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData =
                                                    this.state.formData
                                                formData.institution_id =
                                                    value.id
                                                this.setState({ formData })
                                            }
                                            else{
                                                let formData =
                                                this.state.formData
                                            formData.institution_id = null

                                            this.setState({
                                                formData,
                                            })
                                            }
                                        }}
                                        value={this.state.allInstitution.find(
                                            (obj) =>
                                                obj.id ==
                                                this.state.formData
                                                    .institution_id
                                        )}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Institutional Level"
                                                //variant="outlined"
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
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Item Type" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allItemTypes.filter(
                                            (ele) => ele.status == 'Active'
                                        )}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData =
                                                    this.state.formData
                                                formData.item_type_id = value.id
                                                this.setState({ formData })
                                            }
                                            else{
                                                let formData =
                                                this.state.formData
                                            formData.item_type_id = null

                                            this.setState({
                                                formData,
                                            })
                                            }
                                        }}
                                        value={this.state.allItemTypes.find(
                                            (obj) =>
                                                obj.id ==
                                                this.state.formData.item_type_id
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
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="VEN" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allVENS.filter(
                                            (ele) => ele.status == 'Active'
                                        )}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData =
                                                    this.state.formData
                                                formData.ven_id = value.id
                                                this.setState({ formData })
                                            }
                                            else{
                                                let formData =
                                                this.state.formData
                                            formData.ven_id = null

                                            this.setState({
                                                formData,
                                            })
                                            }
                                        }}
                                        value={this.state.allVENS.find(
                                            (obj) =>
                                                obj.id ==
                                                this.state.formData.ven_id
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
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Issued for Estimate" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={[
                                            { value: 'Yes', label: 'Yes' },
                                            { value: 'No', label: 'No' },
                                        ]}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData =
                                                    this.state.formData
                                                formData.used_for_estimates =
                                                    value.value
                                                this.setState({ formData })
                                            }
                                            else{
                                                let formData =
                                                this.state.formData
                                            formData.used_for_estimates = null

                                            this.setState({
                                                formData,
                                            })
                                            }
                                        }}
                                        /* value={this.state.allConsumables.find((obj) => obj.value == this.state.formData.consumables
                                        )} */
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Issued for Estimate"
                                                //variant="outlined"
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
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Item Usage Type" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allItemUsageTypes.filter(
                                            (ele) => ele.status == 'Active'
                                        )}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData =
                                                    this.state.formData
                                                formData.item_usage_type_id =
                                                    value.id
                                                this.setState({ formData })
                                            }
                                            else{
                                                let formData =
                                                this.state.formData
                                            formData.item_usage_type_id = null

                                            this.setState({
                                                formData,
                                            })
                                            }
                                        }}
                                        value={this.state.allItemUsageTypes.find(
                                            (obj) =>
                                                obj.id ==
                                                this.state.formData
                                                    .item_usage_type_id
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
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Search" />
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Search"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.search}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            formData.search = e.target.value
                                            this.setState({ formData })
                                            console.log(
                                                'form dat',
                                                this.state.formData
                                            )
                                        }}
                                        /* validators={[
                                                    'required',
                                                    ]}
                                                    errorMessages={[
                                                    'this field is required',
                                                    ]} */
                                        InputProps={{}}
                                    /*  validators={['required']}
                                errorMessages={[
                                 'this field is required',
                                ]} */
                                    />
                                </Grid>

                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <Button
                                        className="mt-6 mr-2"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={false}
                                        startIcon="save"
                                    //onClick={this.handleChange}
                                    >
                                        <span className="capitalize">
                                            Search
                                        </span>
                                    </Button>
                                    <Button
                                        className="mt-6 mr-2"
                                        progress={false}
                                        scrollToTop={false}
                                        // startIcon=""
                                        onClick={() => {
                                            window.location.reload()
                                        }}
                                    >
                                        <span className="capitalize">
                                            Clear
                                        </span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>

                        {/* Table Section */}

                        {this.state.loaded ? (
                            <Grid container className="mt-5 pb-5">
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            print: false,
                                            viewColumns: true,
                                            download: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: 20,
                                            page: this.state.formData.page,
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                console.log(action, tableState)
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setPage(
                                                            tableState.page
                                                        )
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
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress size={30} />
                            </Grid>
                        )}
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

export default withStyles(styleSheet)(AddNewPricing)
