import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar';
import { useParams } from 'react-router';
import { withRouter } from "react-router";
import {
    Grid,
    Stepper,
    Step,
    TextField,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    CircularProgress,
    IconButton,
    Icon,
    Tabs,
    InputAdornment,
    Tab,
    Dialog,
    Checkbox,
    Tooltip,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core'
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import ToBeReceivedItems from './ToBeReceivedItems'
import WarehouseServices from 'app/services/WarehouseServices'
import CategoryService from 'app/services/datasetupServices/CategoryService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import PharmacyService from 'app/services/PharmacyService'
import localStorageService from 'app/services/localStorageService'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import CancelIcon from '@material-ui/icons/Cancel';
import { roundDecimal } from 'utils'

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

class DroppedItems extends Component {


    constructor(props) {

        super(props)
        this.state = {
            conformingDialog:false,
            Loaded: false,
            activeTab: 0,
            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
            all_item_drug_store: [],
            item_lists:[],
            selectedRows:null,
            totalItems:0,
            required_date:null,
            selectedCheckbox:false,
            filterData: {

                // status: 'Pending',
                status:['DROPPED',"REORDERED"] ,
                // "status[0]":'DROPPED',
                // "status[1]":"REORDERED",
                ven_id: null,
                class_id: null,
                category_id: null,
                group_id: null,
                to: null,
                // 'order[0]': [
                //     'createdAt', 'DESC'
                // ],
                type:this.props.type,
                order_exchange_id: this.props.match.params.id,
                search: null,
                order_by_sr : true

                // limit: 10,
                // page: 0,
            },

            filterDataValidation: {
                ven_id: true,
                class_id: true,
                category_id: true,
                group_id: true,
                to: true,

                search: true,
                // status: true
            },

            pickUpPerson: {
                id: '789589632V',
                name: 'John Doe',
                contactNum: '0712582563'
            },
            order: [],
            data: [{"itemName":"0"}],



            columns: [
                {
                    name: '',
                    label: '',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return <Grid>
                                <Checkbox
                                    defaultChecked={this.state.data[dataIndex].selected}
                                    checked={this.state.data[dataIndex].selected}
                                    disabled={this.state.data[dataIndex].status === 'REORDERED'?true : false}
                                    // ||this.state.selectedCheckbox===true
                                    onChange={() => {
                                        this.selectRow(this.state.data[dataIndex], dataIndex)
                                        if(this.state.data[dataIndex].selected ==true){
                                            this.setState({
                                                selectedIndex:dataIndex
                                            })
                                        }else{
                                            this.setState({
                                                selectedIndex:null
                                            })
                                        }
                                       
                                        //     const item_lists = []; 
                                        //     item_lists.push({
                                        //     "request_quantity": this.state.data[dataIndex]?.approved_quantity,
                                        //     "item_id": this.state.data[dataIndex]?.item_id,
                                        //     // "to": rowData?.OrderExchange?.to,
                                        // });

                                    }}
                                    name="chkbox_confirm"
                                    color="primary"
                                />
                            </Grid>
                        },

                    },
                },
                {
                    name: 'SRNumber',
                    label: 'SR No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].ItemSnap.sr_no

                            )
                        }
                    },
                },
                {
                    name: 'itemName',
                    label: 'Item Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].ItemSnap.short_description

                            )
                        }
                    },
                },
                // {
                //     name: 'Order Receiving Date for the defined Drug Store',
                //     label: 'Order Receiving Date for the defined Drug Store',
                //     options: {
                //         display: true,
                //     },
                // },
                // {
                //     name: 'Store Qty',
                //     label: 'Store Qty',
                //     options: {
                //         display: true,
                //     },
                // },
                {
                    name: 'request_quantity',
                    label: 'Order Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EU') { 
                                return (
                                    roundDecimal(this.state.data[tableMeta.rowIndex].request_quantity * this.state.data[tableMeta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit?.name
                                )

                            } else {
                                return (
                                    this.state.data[tableMeta.rowIndex].request_quantity
                                )
                            }
                            
                        }
                    },
                },
                // {
                //     name: 'Allocated Qty',
                //     label: 'Allocated Qty',
                //     options: {
                //         display: true,
                //     },
                // },
                {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // if(this.state.data[tableMeta.rowIndex].selected===true && this.state.data[tableMeta.rowIndex].selected.length == 0){
                                return (
                                    <>
                                        {/* <Tooltip title="Re-Order Item"> */}
                                         {/* {this.state.data[tableMeta.rowIndex].selected===true? */}
                                         <SubTitle title={this.state.data[tableMeta.rowIndex].status == 'REORDERED'?"Reordered":"Dropped"} />
                                          {/* < TextField
                                          className="my-1"
                                        //   progress={false}
                                        //   scrollToTop={false}
                                        //   disabled={this.state.data[tableMeta.rowIndex].status == 'REORDERED'||this.state.data[tableMeta.rowIndex].selected !== true?true : false }
                                        //   type='submit'
                                        //   startIcon={this.state.data[tableMeta.rowIndex].status == 'REORDERED'?null: "save"}
                                          // "save"
                                        //   onClick={() => {
                                        //       this.setState({
                                        //           conformingDialog:true,
                                        //           selectedIndex:tableMeta.rowIndex
                                        //       },console.log('rowdata',this.state.data[tableMeta.rowIndex]))
                                        //       // this.RequestReOrder(this.state.data[tableMeta.rowIndex])
                                        //    }}
                                        placeholder={this.state.data[tableMeta.rowIndex].status == 'REORDERED'?"Reordered":"Dropped"}
                                      >
                                          {/* <span className="capitalize">{this.state.data[tableMeta.rowIndex].status == 'REORDERED'?"Reordered":"Dropped"}</span> */}
                                      {/* </TextField>  */}
                                         {/* :
                                        <div>
                                        </div>}    */}
                                       
                                        {/* </Tooltip> */}
    
                                    </>
                                )
                            // }
                            // else{
                            //     return(
                            //         <div>more than 1</div>
                            //     )
                            // }
                        },
                    },
                },
            ]



        }
    }
    async RequestReOrder() {
        // let item_listArray = rowData?.OrderItemActivity
        // item_listArray.forEach(element => {
        //    let item_list= {}
        //    item_list.request_quantity = element?.approved_quantity
        //    item_list.item_id = element?.item_id
        //    item_list.to = element?.OrderExchange?.to
        //    item_listArray.push(item_list)
        // });
        let selected = this.state.data.filter((data) => data.selected == true)
        console.log("sel",selected)
    
        
        const item_list = []; 
        selected.forEach(element => {
            item_list.push({
                "request_quantity": element?.approved_quantity,
                 "item_id": element?.item_id,
                 "id":element?.id
            })
        //     // "to": rowData?.OrderExchange?.to,
        });
        // this.setState({
        //     // selectedRows:item_list.length,
        //     selected:true,
        //     // selectedRows:item_list
        // })
        console.log("rows",this.state.selectedRows)
        // console.log("selectedRows",this.state.selectedRows)
        // item_list.push({
        //     "request_quantity": selected?.approved_quantity,
        //     "item_id": selected?.item_id,
        //     // "to": rowData?.OrderExchange?.to,
        // });
       
        let arraylength = null
        if(item_list.length == 0){
            arraylength=1
            
        }else{
            arraylength=item_list.length
            this.setState({
                selectedCheckbox:true
                

            })
        }
        console.log("sel",item_list)
        let data = {}
        if(selected[0]?.OrderExchange?.distribution_officer_id != null){
            data = {
                "from": selected[0]?.OrderExchange?.from,
                "created_by": JSON.parse(localStorage.getItem('userInfo')).id,
                "type": "Order",
                "required_date": this.state.required_date,
                // new Date().toISOString().split('T')[0],
                "item_list": item_list,
                "to": selected[0]?.OrderExchange?.to,
                "number_of_items":arraylength,
                "distribution_officer_id":selected[0]?.OrderExchange?.distribution_officer_id
                
                // item_list.length
                // "status":"Reorder"
            }
        }  else{
         data = {
                "from": selected[0]?.OrderExchange?.from,
                "created_by": JSON.parse(localStorage.getItem('userInfo')).id,
                "type": "Order",
                "required_date": this.state.required_date,
                // new Date().toISOString().split('T')[0],
                "item_list": item_list,
                "to": selected[0]?.OrderExchange?.to,
                "number_of_items":arraylength,
                // "distribution_officer_id":selected[0]?.OrderExchange?.distribution_officer_id
                // item_list.length
                // "status":"Reorder"
            }
    
        }

        console.log("pressed button",data);
        let res = await   WarehouseServices.requestDrugExchange(data)
        if (res.status == 201) {
            console.log("Order Data", res.data.view)
            this.setState({
                order: res.data.view,
                alert: true,
                message: 'Reorder was Successful',
                severity: 'success',
            }, () => {
                // this.render(),
                // this.updateStatus()
                 window.location.reload()
                // console.log("State ", this.state.order)
            })
        }else {
            this.setState({
                alert: true,
                message: 'Reordering was Unsuccesful',
                severity: 'error',
            })
        }
    }
    async updateStatus() {
        let id = this.state.data[this.state.selectedIndex].id

        let newstatus = {
            "status": "REORDERED"
        }
        let res = await WarehouseServices.editStatusReorderItems(id, newstatus)
        console.log("new",id,newstatus)
        if (res.status === 200) {
            this.setState({
                alert: true,
                severity: 'success',
                message: "Successfully Saved ",
            },
                () => {
                    console.log("new",id,newstatus)
                    window.location.reload()
                })
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Cannot Save ",
            })
        }

    }
    async selectRow(row, index) {
        let data = this.state.data;
        const item_lists = []; 
        let selected = [];
        let item_lists_array = []
        let uniquitemslist = []
        if (data[index].selected) {
            data[index].selected = false
        } else {
            data[index].selected = true
            // this.state.data.filter((data) => data.selected == true )
            item_lists.push({
                "request_quantity": row?.approved_quantity,
                "item_id": row?.item_id,
                // "to": rowData?.OrderExchange?.to,
            });
            // uniquitemslist = this.state.item_lists.map(() => (item_lists) )
            // item_lists_array = item_lists.map(data => data);
            // uniquitemslist = [...new Set(item_lists_array)];
            // uniquitemslist.push(item_lists)
        }
        this.setState({ 
            
            // item_lists:uniquitemslist,
            data 
        }, () => {
            this.render()
            
            console.log("data--------------------------", this.state.data)
        })
    }

    

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {
            console.log("New filterData", this.state.filterData)
            this.LoadOrderItemBatchDetails(this.state.filterData)
        })
    }

    handleFilterButton() {

        this.LoadOrderItemDetails(this.state.filterData);
    }

    handleSearchButton() {

        let filterData = this.state.filterData;

        if (filterData.search) {
            // alert("Sent the Request")
            this.LoadOrderItemDetails(this.state.filterData);
        }
        else {

            let filterDataValidation = this.state.filterDataValidation;

            filterDataValidation.search = false;

            this.setState({ filterDataValidation })
        }


    }

    async loadData() {

        //function for load initial data from backend or other resources
        let ven_res = await WarehouseServices.getVEN({ limit: 99999 })
        if (ven_res.status == 200) {
            // console.log('Ven', ven_res.data.view.data)
            this.setState({ all_ven: ven_res.data.view.data })
        }
        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            // console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
        let class_res = await
            ClassDataSetupService.fetchAllClass({ limit: 99999 })
        if (class_res.status == 200) {
            // console.log('Classes', class_res.data.view.data)
            this.setState({ all_item_class: class_res.data.view.data })
        }
        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        if (group_res.status == 200) {
            // console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_group: group_res.data.view.data })
        }
       // let durgStore_res = await PharmacyService.fetchAllDataStorePharmacy('001', {})
        
       let owner_id = await localStorageService.getItem('owner_id')
        let userInfo = await localStorageService.getItem('userInfo')

        if (userInfo.roles.includes('RMSD MSA') || userInfo.roles.includes('RMSD Distribution Officer')) {
            owner_id = null
        }
        let durgStore_res = await WarehouseServices.getAllWarehousewithOwner({ store_type: 'drug_store' }, owner_id)
       if (durgStore_res.status == 200) {
            // console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_drug_store: durgStore_res.data.view.data })
        }
    }

    async LoadOrderItemDetails(filters) {

        this.setState({ Loaded: false })
        let res = await PharmacyOrderService.getOrderItems(filters)
        if (res.status) {
            console.log("Order Item Data", res.data.view.data)
            this.setState({
                data: res.data.view.data,
                totalItems: res.data.view.totalItems,
                Loaded: true,
            }, () => {
                this.render()
                // console.log("State ", this.state.data)
            })
        }

    }

    async LoadOrderDetails() {

        console.log("this.props.match.params.id",this.props.match.params.id);
        let res = await PharmacyOrderService.getOrdersByID(this.props.match.params.id)
        if (res.status) {
            console.log("Order Data", res.data.view)
            this.setState({
                order: res.data.view,
            }, () => {
                this.render()
                // console.log("State ", this.state.order)
            })
        }

    }

    componentDidMount() {

        this.loadData()
        this.LoadOrderDetails()
        this.LoadOrderItemDetails(this.state.filterData)

    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>

                <ValidatorForm
                    className=""
                    onSubmit={() => this.SubmitAll()}
                    onError={() => null}>

                    <Grid container>
                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                            <SubTitle title={"Ven"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_ven}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */
                                getOptionLabel={(option) =>
                                    option.name ?
                                        (option.name)
                                        : ('')
                                }
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }
                                onChange={(event, value) => {

                                    let filterData = this.state.filterData
                                    if (value != null) {
                                        filterData.ven_id = value.id
                                        // filterData.ven = value.name
                                    } else {
                                        filterData.ven_id = null
                                    }
                                    this.setState({ filterData })

                                }}
                                value={this.state.all_ven.find((v) =>
                                    v.id == this.state.filterData.ven_id
                                )}



                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Ven"
                                        //variant="outlined"
                                        //value={}
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
                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                            <SubTitle title={"Item Class"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_item_class}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */
                                getOptionLabel={(option) =>
                                    option.description ?
                                        (option.description)
                                        : ('')
                                }
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }
                                onChange={(event, value) => {

                                    let filterData = this.state.filterData
                                    if (value != null) {

                                        filterData.class_id = value.id


                                    } else {
                                        filterData.class_id = null
                                    }
                                    this.setState({ filterData })

                                }}
                                value={this.state.all_item_class.find((v) =>
                                    v.id == this.state.filterData.class_id
                                )}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Item Class"
                                        //variant="outlined"
                                        //value={}
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
                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                            <SubTitle title={"Item Category"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_item_category}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */

                                getOptionLabel={(option) =>
                                    option.description ?
                                        (option.description)
                                        : ('')
                                }
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }
                                onChange={(event, value) => {
                                    let filterData = this.state.filterData
                                    if (value != null) {

                                        filterData.category_id = value.id


                                    } else {
                                        filterData.category_id = null
                                    }
                                    this.setState({ filterData })
                                }}
                                value={this.state.all_item_category.find((v) =>
                                    v.id == this.state.filterData.category_id
                                )}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Item Category"
                                        //variant="outlined"
                                        //value={}
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
                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                            <SubTitle title={"Item Group"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_item_group}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */

                                getOptionLabel={(option) =>
                                    option.description ?
                                        (option.description)
                                        : ('')
                                }
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }
                                onChange={(event, value) => {
                                    let filterData = this.state.filterData
                                    if (value != null) {

                                        filterData.group_id = value.id


                                    } else {
                                        filterData.group_id = null
                                    }
                                    this.setState({ filterData })
                                }}
                                value={this.state.all_item_group.find((v) =>
                                    v.id == this.state.filterData.group_id
                                )}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Item Group"
                                        //variant="outlined"
                                        //value={}
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

                    </Grid>
                    <Grid container>


                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                            <SubTitle title={"Drug Store"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_item_drug_store}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */
                                getOptionLabel={(option) =>
                                    option.name ?
                                        (option.name)
                                        : ('')
                                }
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }
                                onChange={(event, value) => {

                                    console.log("fromStore", value);
                                    let filterData = this.state.filterData
                                    if (value != null) {

                                        // let filterDataValidation = this.state.filterDataValidation;
                                        // filterDataValidation.from = true;

                                        filterData.to = value.id

                                        // this.setState({ filterDataValidation })


                                    } else {
                                        filterData.to = null
                                    }
                                    this.setState({ filterData })

                                }}
                                value={this.state.all_item_drug_store.find((v) =>
                                    v.id == this.state.filterData.to
                                )}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Drug Store"
                                        //variant="outlined"
                                        //value={}
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
                        <Grid item lg={1} md={1} sm={1} xs={1} className="text-left px-2">
                            <Button
                                className="mt-6"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                                startIcon="search"
                                onClick={() => { this.handleFilterButton() }}
                            >
                                <span className="capitalize">Filter</span>
                            </Button>
                        </Grid>
                        <Grid item lg={5} md={5} sm={5} xs={5} className="text-left px-2 mb-2" >

                        </Grid>
                        <Grid item
                            lg={2} md={2} sm={2} xs={2}
                            className='px-2 mb-2'
                            style={{ display: 'flex', flexDirection: 'column' }}>

                            <TextValidator
                                className='w-full mt-5'
                                placeholder="SR No"
                                //variant="outlined"

                                variant="outlined"
                                size="small"
                                value={this.state.filterData.search}
                                onChange={(e, value) => {
                                    let filterData = this.state.filterData
                                    if (e.target.value) {
                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.search = true;

                                        filterData.search = e.target.value;

                                        this.setState({ filterDataValidation })
                                    } else {
                                        filterData.search = null;
                                    }

                                    this.setState({ filterData })
                                    // console.log("form dat", this.state.filterData)
                                }}
                                /* validators={[
                                'required',
                                ]}
                                errorMessages={[
                                'this field is required',
                                ]} */
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {/* <SearchIcon></SearchIcon> */}
                                        </InputAdornment>
                                    )
                                }} />
                            {
                                this.state.filterDataValidation.search ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }

                        </Grid>
                        <Grid item lg={1} md={1} sm={1} xs={1} className="text-left pl-4 pr-0" >
                            <Button
                                className="mt-6 "
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                                startIcon="search"
                                onClick={() => { this.handleSearchButton() }}
                            >
                                <span className="capitalize">Search</span>
                            </Button>
                        </Grid>
                    </Grid>
                    <Dialog
                              maxWidth="md"
                                //  fullWidth={true}
                                open={this.state.conformingDialog}
                                onClose={() => {
                                    this.setState({ conformingDialog: false })
                                }}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">{"Reorder Confirmation"}</DialogTitle>
                                  {/* <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                                    <CardTitle title="Add Employee" />

                                    <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ conformingDialog: false }) }}>
                                        <CloseIcon />
                                    </IconButton>

                                </MuiDialogTitle> */}
 {/* <div className="w-full h-full px-5 py-5"> */}
 <DialogContent>
                                <p>Are you sure you want to Re-order</p>
                                <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Required Date" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.required_date}
                                            placeholder="Required Date"
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            required={true}
                                            errorMessages="this field is required"
                                            onChange={date => {
                                                let required_date = this.state.required_date;
                                                if(date != null){
                                                    required_date = date;
                                                    this.setState({ required_date,
                                                        datePicked:true 
                                                     })
                                               
                                                }
                                                else{
                                                    required_date = null
                                                    this.setState({ required_date,
                                                        datePicked:false 
                                                     })
                                                }
                                               

                                            }}
                                        />
                                    </Grid>
                                <Grid
                                container="container"
                                style={{
                                    justifyContent: 'flex-end'
                                }}>
      {/* {this.state.datePicked ? */}
  <Grid
  className="w-full flex justify-end"
  item="item"
  lg={8}
  md={8}
  sm={6}
  xs={6}>
 

  <Button
     
      className="mt-2 "
      progress={false}
      style={{ height: '30px', fontSize: '11px' }}
      type="submit"
      startIcon={<CancelIcon fontSize='small' />}
      onClick={() => {
          this.setState({
              conformingDialog: false,
              // selected_vehicle_id: null
          });
      }}>
      <span className="capitalize">Cancel</span>
  </Button>
  <Button
      className="ml-2 mt-2"
      progress={false}
      disabled={this.state.datePicked==true ? false : true}
      type="submit"
      style={{ height: '30px', fontSize: '11px' }}
      startIcon="save"
      onClick={() => {
          this.setState({ conformingDialog: false });
          // this.removeVehicle()
          this.RequestReOrder()
      }}>
      <span className="ml-1 capitalize">Reorder</span>
  </Button>
</Grid>

                                {/* : null} */}
                              
                            </Grid>
                                    
                                </DialogContent>

 {/* </div> */}
                            </Dialog>


                </ValidatorForm>
                <Grid container className="mt-2 pb-5">
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        {
                            this.state.Loaded ?
                                <>
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}

                                        id={'all_items'}
                                        data={
                                            this.state.data
                                        }
                                        columns={
                                            this.state.columns
                                        }
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: this.state.filterData.limit,
                                            page: this.state.filterData.page,
                                            print: true,
                                            viewColumns: true,
                                            download: true,
                                            onTableChange: (action, tableState) => {
                                                console.log(action, tableState)
                                                switch (
                                                action
                                                ) {
                                                    case 'changePage':
                                                        this.setPage(
                                                            tableState.page
                                                        )
                                                        break
                                                    case 'sort':
                                                        // this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    ></LoonsTable>
                                </> :
                                (
                                    //loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )

                        }

                    </Grid>
                    {this.state.data.filter((data) => data.selected == true ).length > 0 ?
                    // this.state.selectedIndex !=  null?

                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <Button
                                        className="my-1"
                                        progress={false}
                                        scrollToTop={false}
                                     //    disabled={this.state.data[tableMeta.rowIndex].status == 'REORDERED'?true : false}
                                        type='submit'
                                        // startIcon={this.state.data[tableMeta.rowIndex].status == 'REORDERED'?null: "save"}
                                        // "save"
                                        onClick={() => {
                                            this.setState({
                                                conformingDialog:true,
                                                // selectedIndex:tableMeta.rowIndex
                                            }
                                            // ,
                                            // console.log('rowdata',this.state.data[tableMeta.rowIndex])
                                            )
                                         //    this.RequestReOrder()
                                         }}
                                    >
                                         <span className="capitalize">Reorder</span>
                                    </Button>
                                     </Grid>
 
                    
                    :null}
                </Grid>
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

export default withRouter(DroppedItems)
// withStyles(styleSheet)(DroppedItems)
//