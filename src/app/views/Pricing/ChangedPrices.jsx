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
import PricingService from "app/services/PricingService";

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

class ChangedPrices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            login_user_roles: [],
            addNewPrice:false,
            columns: [
                // {
                //     name: 'action',
                //     label: 'Actions',
                //     options: {
                //         customBodyRenderLite: (dataIndex) => {
                //             let id = this.state.data[dataIndex].id
                //             return (
                //                 <Grid>
                //                         <Tooltip title="Allocate">
                //                             <IconButton
                //                                 onClick={() => {
                //                                     // window.location.href = `/price/changed_item_prices/${id}`
                //                                     this.setState({
                //                                         addNewPrice:true
                //                                     })
                //                                 }}>
                //                                 <AddIcon color='primary' />
                //                             </IconButton>
                //                         </Tooltip>
                //                 </Grid>
                //             )
                //         },
                //     },
                // },
                {
                    name: 'value',
                    label: 'Price',
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.data[dataIndex].Warehouse.name
                        //     return <p>{data}</p>
                        // },
                    },
                },
                {
                    name: 'remark',
                    label: 'Remark',
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.data[dataIndex].Warehouse.name
                        //     return <p>{data}</p>
                        // },
                    },
                },
                {
                    name: 'version',
                    label: 'Version',
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.data[dataIndex].Serial.code
                        //     return <p>{data}</p>
                        // },
                    },
                },
                {
                    name: 'name', // field name in the row object
                    label: 'Changed By', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Employee?.name
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
                short_description: null,

                value:null,
                remark:null,
                item_id:this.props.match.params.id
            },
        }
    }


    async loadItem() {
        this.setState({ loaded: false })
        console.log('id',this.state.formData)
        let params = {
            item_id : this.props.match.params.id,
            // status:"LATEST"
            'order[0]': ['version', 'DESC'],
        }
        console.log('id',params)
        const res = await PricingService.getItemWisePrice(params)
        let group_id = 0
        if (res.status == 200) {
            // if (res.data.view.data.length != 0) {
            //     group_id = res.data.view.data[0]
            //     // .pharmacy_order_id
            // }
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

   async setNewPrice(){ 
    let formData = this.state.formData 
    if(formData.value != null && formData.remark !=null && formData.remark !== ' ' && formData.value != ' '){
        let data={
            "item_id":this.props.match.params.id,
            "value":formData.value,
            "created_by":await JSON.parse(localStorage.getItem('userInfo')).id,
            "remark":formData.remark
        }
        console.log('data',data)
        let res = await PricingService.addNewPrice(data)
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Item Price Added Successfuly',
                severity: 'success',
            },()=>{
                this.setState({
                    addNewPrice:false
                })
                this.loadItem()
            })
        } else {
            this.setState({
                alert: true,
                message: 'Item Price Added Unsuccessful',
                severity: 'error',
            })
        }
    }else{
        this.setState({
            alert: true,
            message: 'Please fill the fields',
            severity: 'error',
        })
    }
    }

    async componentDidMount() {

        let login_user_info = await localStorageService.getItem("userInfo");

        this.setState({ login_user_roles: login_user_info.roles })
        let id = this.props.match.params.id
        console.log('id',id)
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
                        <CardTitle title={`Item Name :- ${this.props.match.params.name}`} />
                        <Grid className='flex justify-end mt-4' lg={12} md={12} sm={12} xs={12}>
                                            <Button
                                                // className="px-5 py-2 mr-5"
                                                progress={false}
                                                scrollToTop={true}
                                                color="primary"
                                                onClick={() => {
                                                    this.setState({
                                                      addNewPrice:true
                                                     })
                                                }}
                                            >
                                                <span className="capitalize">{"Add New Price"}</span>
                                            </Button>
                                        </Grid>
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
                  
                <Dialog
                                maxWidth={"sm"} fullWidth={true}
                                open={this.state.addNewPrice}
                                onClose={() => {
                                    this.setState({ addNewPrice: false })
                                }}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                

                                <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                                    <CardTitle title="Add Price" />

                                    <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ addNewPrice: false }) }}>
                                        <CloseIcon />
                                    </IconButton>

                                </MuiDialogTitle>
                                <ValidatorForm
                            className="pt-2"
                            onSubmit={() => {this.setNewPrice()}}
                            onError={() => null}
                        >
                                <DialogContent>
                                    <Grid container spacing={1}>
                                    <Grid
                                    className=" w-full"
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Value" />
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Value"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                        type='number'
                                        value={this.state.formData.value}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            formData.value = e.target.value
                                            this.setState({ formData })
                                            console.log(
                                                'form dat',
                                                this.state.formData
                                            )
                                        }}
                                        validators={[
                                                    'required','matchRegexp:^[0-9\\s]+$'
                                                    ]}
                                         errorMessages={[
                                                    'this field is required','Please Enter value more than 1'
                                                    ]} 
                                        InputProps={{
                                            
                                        }}
                                
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
                                    <SubTitle title="Remark" />
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Remark"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.remark}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            formData.remark = e.target.value
                                            this.setState({ formData })
                                            console.log(
                                                'form dat',
                                                this.state.formData
                                            )
                                        }}
                                        validators={[
                                                    'required',
                                                    ]}
                                         errorMessages={[
                                                    'this field is required',
                                                    ]} 
                                        InputProps={{}}
                                
                                    />
                                </Grid>

                                    </Grid>


                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        className="mt-2"
                                        progress={false}
                                        type='submit'
                                        scrollToTop={true}
                                        // onClick={() => {
                                        //     // this.createNewEmployee()
                                        //     // this.setNewPrice()
                                        // }}
                                    >
                                        <span className="capitalize">Save</span>
                                    </Button>

                                </DialogActions>
                                </ValidatorForm>
                </Dialog>

               

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

export default withStyles(styleSheet)(ChangedPrices)
