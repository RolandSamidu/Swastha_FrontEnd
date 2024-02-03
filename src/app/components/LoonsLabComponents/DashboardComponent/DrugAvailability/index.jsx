import React, { Component, Fragment } from 'react'
import {
    Divider,
    Grid,
    IconButton,
    CircularProgress,
    Tooltip,
    Dialog,
    RadioGroup,
    FormControlLabel,
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
import Typography from '@material-ui/core/Typography'
import EditIcon from '@material-ui/icons/Edit'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import ApartmentIcon from '@material-ui/icons/Apartment'
import HealingIcon from '@mui/icons-material/Healing'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import VisibilityIcon from '@material-ui/icons/Visibility'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'

import MuiDialogTitle from '@material-ui/core/DialogTitle'
import 'date-fns'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import WarehouseServices from 'app/services/WarehouseServices'
import ConsignmentService from 'app/services/ConsignmentService'
import InventoryService from 'app/services/InventoryService'
import localStorageService from 'app/services/localStorageService'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import CloseIcon from '@material-ui/icons/Close'
import ListIcon from '@material-ui/icons/List'

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
})

class DrugAvailability extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            login_user_roles: [],
            individualView: false,
            selectWarehouseView: false,
            loadingSuggestedWarehoues: false,
            suggestedWareHouses: {
                item_id: null,
                warehouse_id: null,
                limit: 20,
                page: 0,
            },
            all_pharmacy_dummy: [],
            columns: [
                {
                    name: 'action',
                    label: 'Actions',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id
                            return (
                                <Grid>
                                    <Tooltip title="View Item">
                                        <IconButton
                                            onClick={() => {
                                                let suggestedWareHouses =
                                                    this.state
                                                        .suggestedWareHouses
                                                suggestedWareHouses.item_id = id
                                                this.setState(
                                                    {
                                                        suggestedWareHouses,
                                                        individualView: true,
                                                    },
                                                    () => {
                                                        this.suggestedWareHouse()
                                                    }
                                                )
                                            }}
                                            className="px-2"
                                            size="small"
                                            aria-label="View Item Stocks"
                                        >
                                            <VisibilityIcon />
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
                // {
                //     name: 'item_name', // field name in the row object
                //     label: 'Item Name', // column title that will be shown in table
                //     options: {
                //         filter: false,
                //         display: true,
                //     },
                // },

                // {
                //     name: 'category',
                //     label: 'Serial Name',
                //     options: {
                //         filter: true,
                //         display: true,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data = this.state.data[dataIndex].Serial.name;
                //             return <p>{data}</p>

                //         },
                //     },
                // },
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
                // {
                //     name: 'default_frequency',
                //     label: 'Default Frequency',
                //     options: {
                //         filter: true,
                //         display: true,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data = this.state.data[dataIndex].DefaultRoute.name;
                //             return <p>{data}</p>

                //         },
                //     },
                // },
                // {
                //     name: 'default_route',
                //     label: 'Default Route',
                //     options: {
                //         filter: true,
                //         display: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data =
                //                 this.state.data[dataIndex].DefaultRoute.name
                //             return <p>{data}</p>
                //         },
                //     },
                // },
                // {
                //     name: 'default_unit',
                //     label: 'Display Unit',
                //     options: {
                //         filter: true,
                //         display: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data =
                //                 this.state.data[dataIndex].DisplayUnit.name
                //             return <p>{data}</p>
                //         },
                //     },
                // },
                // {
                //     name: 'dosage_form',
                //     label: 'Dosage Form',
                //     options: {
                //         filter: true,
                //         display: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data =
                //                 this.state.data[dataIndex].DosageForm.name
                //             return <p>{data}</p>
                //         },
                //     },
                // },
                // {
                //     name: 'measuring_unit',
                //     label: 'Measuring Unit',
                //     options: {
                //         filter: true,
                //         display: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data =
                //                 this.state.data[dataIndex].MeasuringUnit.name
                //             return <p>{data}</p>
                //         },
                //     },
                // },
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
            suggestedWareHouseColumn: [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <IconButton
                                    onClick={() => {
                                        this.setState({
                                            item_warehouse_id:
                                                this.state.rows2[dataIndex]
                                                    .warehouse_id,
                                            showItemBatch: true,
                                        })
                                    }}
                                >
                                    <ListIcon />
                                </IconButton>
                            )
                        },
                    },
                },
                // {     name: 'uom',     label: 'UOM',     options: {} },
                {
                    name: '	Drug Store',
                    label: 'Drug Store',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.rows2[dataIndex].warehouse_name
                            return data
                        },
                    },
                },
                {
                    name: 'Type',
                    label: 'Type',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.rows2[dataIndex]
                                    .warehouse_main_or_personal
                            return data
                        },
                    },
                },
                {
                    name: 'Stock Qty',
                    label: 'Stock Qty',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.rows2[dataIndex].total_quantity
                            return data
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
                short_description: null,
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
            loadedData.forEach((element) => {
                let loadSerials = {}
                loadSerials.name = element.code + '-' + element.name
                loadSerials.name2 = element.name
                loadSerials.id = element.id
                loadSerials.code = element.code
                loadSerials.status = element.status
                loadSerial.push(loadSerials)
            })
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: res.data.error,
            })
        }
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

    async suggestedWareHouse() {
        this.setState({ loadingSuggestedWarehoues: false })
        let res = await PharmacyOrderService.getSuggestedWareHouse(
            this.state.suggestedWareHouses
        )
        if (res.status) {
            console.log('suggested', res.data)
            this.setState(
                {
                    rows2: res.data.view.data,
                    suggestedtotalItems: res.data.view.totalItems,
                    loadingSuggestedWarehoues: true,
                },
                () => {
                    this.render()
                }
            )
        }
    }
    setSuggestedPage(page) {
        let suggestedWareHouses = this.state.suggestedWareHouses
        suggestedWareHouses.page = page
        this.setState(
            {
                suggestedWareHouses,
            },
            () => {
                this.suggestedWareHouse()
            }
        )
    }

    async componentDidMount() {
        let login_user_info = await localStorageService.getItem('userInfo')

        this.setState({ login_user_roles: login_user_info.roles })
        this.loadWarehouses()
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
    async loadWarehouses() {
        this.setState({ loaded: false })
        var user = await localStorageService.getItem('userInfo')
        console.log('user', user)
        var id = user.id
        var all_pharmacy_dummy = []
        var selected_warehouse_cache = await localStorageService.getItem(
            'Selected_Warehouse'
        )
        if (!selected_warehouse_cache) {
            this.setState({ selectwarehouseView: true })
        } else {
            let suggestedWareHouses = this.state.suggestedWareHouses
            suggestedWareHouses.warehouse_id = selected_warehouse_cache.id

            this.setState({ selectwarehouseView: false, loaded: true })
        }
        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params)
        if (res.status == 200) {
            console.log('CPALLOders', res.data.view.data)

            res.data.view.data.forEach((element) => {
                all_pharmacy_dummy.push({
                    warehouse: element.Warehouse,
                    name: element.Warehouse.name,
                    main_or_personal: element.Warehouse.main_or_personal,
                    owner_id: element.Warehouse.owner_id,
                    id: element.warehouse_id,
                    pharmacy_drugs_stores_id:
                        element.Warehouse.pharmacy_drugs_store_id,
                })
            })
            console.log('warehouse', all_pharmacy_dummy)
            this.setState({ all_pharmacy_dummy })
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Grid
                                container="container"
                                lg={12}
                                md={12}
                                xs={12}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Grid item="item">
                                    <Typography
                                        variant="h6"
                                        className="font-semibold"
                                    >
                                        Drug Availability
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                        <Divider className="mb-3" />

                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.loadItem()}
                            onError={() => null}
                        >
                            <Grid container spacing={2}>
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

                <Dialog
                    style={{
                        padding: '10px',
                    }}
                    maxWidth="lg"
                    open={this.state.individualView}
                    onClose={() => {
                        // this.setState({individualView: false})
                    }}
                >
                    <div className="w-full h-full px-5 py-5">
                        <Grid container="container">
                            <Grid
                                item="item"
                                lg={12}
                                md={12}
                                xs={12}
                                className="mb-4"
                            >
                                <LoonsCard>
                                    <Grid container="container">
                                        <Grid
                                            item="item"
                                            lg={12}
                                            md={12}
                                            xs={12}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                <CardTitle title="Suggeted Ware House"></CardTitle>
                                                <IconButton
                                                    aria-label="close"
                                                    onClick={() => {
                                                        this.setState({
                                                            individualView: false,
                                                        })
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </div>
                                        </Grid>

                                        <Grid
                                            item="item"
                                            lg={12}
                                            md={12}
                                            xs={12}
                                            className="mt-10"
                                        >
                                            {this.state
                                                .loadingSuggestedWarehoues ? (
                                                <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    id={'suggested'}
                                                    data={this.state.rows2}
                                                    columns={
                                                        this.state
                                                            .suggestedWareHouseColumn
                                                    }
                                                    options={{
                                                        pagination: true,
                                                        serverSide: true,
                                                        count: this.state
                                                            .suggestedtotalItems,
                                                        rowsPerPage: 20,
                                                        page: this.state
                                                            .suggestedWareHouses
                                                            .page,
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
                                                                    this.setSuggestedPage(
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
                                            ) : null}
                                        </Grid>
                                    </Grid>
                                </LoonsCard>
                            </Grid>
                        </Grid>
                    </div>
                </Dialog>

                <Dialog
                    fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.selectWarehouseView}
                >
                    <MuiDialogTitle disableTypography="disableTypography">
                        <CardTitle title="Select Your Warehouse" />
                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm onError={() => null} className="w-full">
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                // ref={elmRef}
                                options={this.state.all_pharmacy_dummy}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        localStorageService.setItem(
                                            'Selected_Warehouse',
                                            value
                                        )
                                        let suggestedWareHouses =
                                            this.state.suggestedWareHouses
                                        suggestedWareHouses.warehouse_id =
                                            value.id
                                        this.setState({
                                            selectWarehouseView: false,
                                            suggestedWareHouses,
                                        })
                                        //this.suggestedWareHouse()
                                    }
                                }}
                                /* value={{
                                    name: selectedWarehouse
                                        ? (
                                            allWarehouses.filter((obj) => obj.id == selectedWarehouse).name
                                        )
                                        : null,
                                    id: selectedWarehouse
                                }} */
                                getOptionLabel={(option) =>
                                    option.name != null
                                        ? option.name +
                                          ' - ' +
                                          option.main_or_personal
                                        : null
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Warehouse"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />
                        </ValidatorForm>
                    </div>
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
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(DrugAvailability)
