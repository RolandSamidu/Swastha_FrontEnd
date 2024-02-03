import React, { Component, Fragment } from 'react'
import { Divider, Grid, IconButton, CircularProgress } from '@material-ui/core'
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
import localStorageService from '../../services/localStorageService'

const styleSheet = (theme) => ({})

class AllItemInHospital extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            columns: [
                

                
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
                    name: 'short_description',
                    label: 'Actual Item Name',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
               
                
                {
                    name: 'medium_description',
                    label: 'Full Name',
                    options: {
                        filter: true,
                        display: true,
                    },
                },

                {
                    name: 'strength',
                    label: 'Strength',
                    options: {
                        filter: true,
                        display: true,
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
                owner_id: null,
                page: 0,
                limit: 20,
                
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

        /*  this.loadGroups()
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
         this.loadItemUsageTypes()*/
        let owner_id = localStorageService.getItem("owner_id")

        let formData = this.state.formData;
        formData.owner_id = owner_id
        this.setState({ formData }, () => {
            this.loadItem()
        })


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
                                            print: true,
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

export default withStyles(styleSheet)(AllItemInHospital)
