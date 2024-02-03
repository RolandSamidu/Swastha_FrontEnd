import React, { Component, Fragment } from "react";
import MainContainer from "../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../components/LoonsLabComponents/CardTitle";
import LoonsCard from "../../components/LoonsLabComponents/LoonsCard";
import {CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Tooltip, Typography,DialogContent,
    DialogTitle,
    Checkbox,
    Fab,
    DialogActions,
    DialogContentText, } from "@material-ui/core";
import { ValidatorForm,  TextValidator} from "react-material-ui-form-validator";
import {  Button,DatePicker,LoonsTable } from "app/components/LoonsLabComponents";
import SubTitle from "../../components/LoonsLabComponents/SubTitle";
import Paper from '@material-ui/core/Paper';  
import { Autocomplete } from "@mui/material";
import DetailedViewNonDrug from "./DetailedViewNonDrug";
import DetailedViewDrug from "./DetailedViewDrug";
import { Dialog } from "@mui/material";
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DonarService from '../../services/DonarService'
import ReceiptIcon from '@material-ui/icons/Receipt';
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from "app/services/WarehouseServices";
import VisibilityIcon from '@material-ui/icons/Visibility'
import InventoryService from 'app/services/InventoryService'
import { dateParse } from "utils";
import * as appConst from '../../../appconst'


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

class HosViewGRN extends Component {

    constructor(props){
        super(props)
        this.state = {
            detailedViewNonDrugView: false,
            detailedViewDrugView: false,
            classes: styleSheet,
            loading: true,
            creatingGrn:false,
            totalItems: 0,
            // formData: {
            //     sr_no: '',
            //     donor_name: '',
            //     donor_country: '',
            //     delivery_date: '',
            //     approved_date: '',
            // },
            grnCreation:false,
            sr_no:[],
            allDonorData:[],
            // totalItemsToBeApproved: 0,
            filterData: {
                limit: 20,
                page: 0,
                delivery_date: null,
                donor_name: '',
                donor_country: '',
                description: '',
                sr_no: '',
                delivery_person: '',
                'sr_no[0]': ['updatedAt', 'DESC'],
            },
            data:[{'sr_no':'2'}],
            columns: [
                {
                    name: 'ids', // field name in the row object
                    label: 'Invoice No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: false,
                        width: 10
                    }
                },
                {
                    name: 'name', // field name in the row object
                    label: 'Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.name
                        }
                    }
                },
                {
                    name: 'name', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.itemdata?.long_description
                        }
                    }
                },
                {
                    name: 'total_quantity', // field name in the row object
                    label: 'Total Quantity', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.total_quantity
                        }
                    }
                },
                // {
                //     name: 'description', // field name in the row object
                //     label: 'Description', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
                // {
                //     name: 'delivery_date', // field name in the row object
                //     label: 'Delivery Date', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
                // {
                //     name: 'delivery_person', // field name in the row object
                //     label: 'Delivery Person', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
                {
                    name: "action",
                    label: "Action",
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex]?.id
                            let donation_id =this.state.data[dataIndex]?.donation_id
                            return (
                                <Grid className="flex items-center">

                                 <Grid className="px-2">
                                 <Tooltip title="View">
                                     <IconButton
                                         onClick={() => {
                                            window.location.href = `/donation/view-sco-donation-registration-note/${id}/${donation_id}`
                                         }}>
                                         <VisibilityIcon color='primary' />
                                     </IconButton>
                                 </Tooltip>
                             </Grid>
                                 <Grid className="px-2">
                                 <Tooltip title="View GRN">
                                     <IconButton
                                         onClick={() => {
                                            this.loadDonationItem(this.state.data[dataIndex]?.id)
                                             this.LoadDataByID(this.state.data[dataIndex]?.donation_id)
                                            //  window.location.href = `/consignments/msdMSA/view-consignment/${id}`
                                            this.setState({
                                                grnCreation:true,
                                                rowIndex:dataIndex
                                            })
                                         }}>
                                         <ReceiptIcon color='primary' />
                                     </IconButton>
                                 </Tooltip>
                             </Grid>
                             </Grid>
                            );
                        }

                    }
                },
            ], 
            // totalItemsToBeApproved: 0,
            rowIndex:null,
            pending: 0,
            backendData:null,
            itemBatches: [],
            drugStoreData:null,
            warehouse_id:null,
            formData: {
                sr_no: '',
                donor_name: '',
                donor_country: '',
                delivery_date: '',
                approved_date: '',
                item_id:null,
            },

        }
    }
    async loadDonationItem(id){
        this.setState({ loaded: true })
        // console.log("State 1:", this.state.data)
        // let id =  this.state.data[this.state.rowIndex]?.id
        // let id = '986ff19a-cbbb-4076-9258-eddfa5300419'
        let res = await DonarService.getDonationItembyID(id)
        if (res.status == 200) {
            console.log('RES',res.data?.view)
            // let itemBatches = {
            //     donation_itemBatches : res.data?.view?.DonationItemsBatches
            // }
            let formData = this.state.formData
            formData.name =res.data?.view?.name
            formData.total_quantity =res.data?.view?.total_quantity
            formData.approval = res.data?.view?.approval
            formData.sco_remark = res.data?.view?.sco_remark
            formData.item_name = res.data?.view?.itemdata?.long_description
            formData.status = res.data?.view?.status
            formData.item_id = res.data?.view?.item_id
            let itemBatch = this.state.itemBatches
            console.log('itemb',this.state.itemBatches)
            // let packageDetails = this.state.itemBatches.packaging_details

            res.data.view.DonationItemsBatches.forEach(element => {
                let backend = {}
                backend.batch_no = element?.batch_no
                backend.mfd = element?.Manufacture_date
                backend.exd= element?.expiary_date
                backend.quantity=element?.received_quantity
                backend.donation_item_id=element?.donation_item_id
                // backend.invoice_quantity=element?.invoice_quantity
                // backend.short_excess_quantity=element?.short_excess_quantity
                // backend.damage_quantity=element?.damage_quantity
                // backend.unit_value=element?.unit_value
                // backend.item_id=element?.item_id 
                backend.item_snap_id = res.data.view?.item_id 
                // backend.item_id=element?.item_id 
                backend.price=element?.value_usd
                // backend.item_id= element?.id
                backend.uom_id= element?.uom_id
                // backend.pack_size='100'
                // backend.width=element?.width
                // backend.height=element?.height
                // backend.length=element?.length
                // backend.net_weight=element?.net_weight
                // backend.gross_weight=element?.gross_weight
                // backend.packaging_details=element?.PackagingItemsUOMs
                backend.packaging_details=element?.PackagingItemsUOMs?.forEach(element2 => {
                    if(element2.packet_size != null){
                        backend.pack_size= element2.packet_size
                    }
                    console.log('PackagingItemsUOMs',element2)
                });
                itemBatch.push(backend)
            });
            this.setState({
                formData,
                itemBatches:itemBatch
            },
            console.log('itemb2',res.data.view,this.state.itemBatches),
           
            )    
        }

    }

    async LoadDataByID(donation_id) {
        this.setState({ loaded: true })
        // console.log("State 1:", this.state.data)
        // let donation_id =this.state.data[this.state.rowIndex]?.donation_id
        let res = await DonarService.getDonationbyID(donation_id)
        if (res.status == 200) {
            let backendData = {
                donation_id: res.data.view?.donor_gen_id,
                address: res.data.view?.Donor?.address,
                donor_invoice_no: res.data.view?.donors_invoice_no,
                recevied_date: res.data.view?.received_date,
                donation_reg_no: res.data.view?.donation_reg_no,
                donors_invoice_date: res.data.view?.donors_invoice_date,
                donor_contact_no: res.data.view?.Donor?.contact_no,
                donor_name: res.data.view?.Donor?.name,
                donor_country: res.data.view?.Donor?.country,
                description: res.data.view?.Donor?.description,
                delivery_person: res.data.view?.delivery_person,
                delivery_person_contact_no:res.data.view?.delivery_person_contact_no,
            }
            this.setState(
                {
                    backendData: backendData,
                    loaded: true,
                },
              
                () => console.log('resdata', this.state.donation),
               
            )
        }
    }
    async createDonationGRN() {
        this.setState({creatingGrn:true})
        // let id = this.state.data[this.state.rowIndex]?.id
        let donation_id =this.state.data[this.state.rowIndex]?.donation_id
        let owner_id = "000"
        // if(JSON.parse(localStorage?.getItem('owner_id')) == null){
        //     owner_id = "000"
        // }
        // item_id
        // donation_item_id
        let data={
            "donation_id": donation_id,
            "type": "Donation GRN",
            "created_by":JSON.parse(localStorage?.getItem('userInfo')).id,
            "owner_id": owner_id,
            "warehouse_id": this.state.warehouse_id,
            "grn_items":this.state.itemBatches,
            // "item_id":this.state.formData?.item_id
        }
        console.log("data",data)
        let res = await DonarService.createDonationGRN(data);
        console.log("res",res)
        if (res.status === 201) {
            this.setState({
                creatingGrn:false,
                alert: true,
                message: 'Donation GRN Created successfully!',
                severity: 'success',
            })
        } else {
            this.setState({
                creatingGrn:false,
                alert: true,
                message: 'Donation GRN Creation was unsuccessful!',
                severity: 'error',
            })
        }
    }


    componentDidMount() {
        this.loadDrugStoreData()
        this.LoadData()
    }
    async LoadData() {
        this.setState({ loaded: false })
        var userRole = await localStorageService.getItem("userInfo")
        let filterData = this.state.filterData
        if(userRole.type === 'Drug Store Keeper' || userRole.type === 'Medical Laboratory Technologist' || userRole.type === 'Radiographer'){
            filterData.status = "Submitted to HSCO"
        }else{
            filterData.status = "Approved by SCO"
        }

        console.log("State 1:", this.state.data)
        
        // filterData.donation_id = this.props.match.params.id
       
        // let id = this.props.match.params.id
        let res = await DonarService.getDonationItem(filterData)
             if (res.status == 200) {
            this.setState({
                data: res.data.view.data,
                totalItems:res.data.view.totalItems,
                loaded: true
            }, () => console.log('resdata', res))
        }  
      }
      async loadAllItems(search) {
        // let params = { "search": search }
        let data = {
          search: search
      }
      let filterData = this.state.filterData
      // this.setState({ loaded: false })
      let params = { limit: 10000, page: 0 }
      // let filterData = this.state.filterData
      let res = await InventoryService.fetchAllItems(data)
      console.log('all Items', res.data.view.data)

      if (res.status == 200) {
          this.setState({ sr_no: res.data.view.data })
      }
    //   console.log('items', this.state.left)
  }
  async loadDonors(search) {
    console.log('donor',search)
    // let employeeFilterData = this.state.employeeFilterData
    let data = {
        search: search
    }
    this.setState({ loaded: false })
    let res = await DonarService.getDonors(data)
    console.log('all pharmacist', res.data.view.data)
    if (200 == res.status) {
        this.setState({
            allDonorData: res.data.view.data,
            loaded: true,
        })
    }
}
async loadDrugStoreData() {
    let owner_id=await localStorageService.getItem('owner_id')
    let userInfo = await localStorageService.getItem('userInfo')

    // if (userInfo.roles.includes('RMSD MSA') || userInfo.roles.includes('RMSD Distribution Officer')) {
    //     owner_id = null
    // }

    let res=await WarehouseServices.getAllWarehousewithOwner(
        {}
        ,owner_id)

    console.log("warehouses",res)
    if (200 == res.status) {
        this.setState({
            drugStoreData: res.data.view.data,
        })
        console.log("this.state.drugStoreData", this.state.drugStoreData);
    }
}



    render(){
        // const { classes } = this.props
        return(
            <MainContainer>
                <LoonsCard>
                    <CardTitle title="View Donations GRN" />

                    <Grid item lg={12} className=" w-full mt-2">
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.LoadData()}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex">
                                
                                <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="SR No" />
                                        <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    // value={this.state.hsco.sr_no}
                                    // options={this.state.sr_no}
                                    options={this.state.sr_no}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData = this.state.filterData;
                                            filterData.sr_no = value.id;
                                            console.log('SR no',filterData)
                                            this.setState({ 
                                                filterData,
                                                // srNo:true
                                            })
                                            // let formData = this.state.formData;
                                            // formData.sr_no = value;
                                           
                                        } 
                                        // else {
                                        //     let filterData = this.state.filterData;
                                        //     filterData.sr_no = null;
                                        //     this.setState({ filterData,
                                        //         srNo:false
                                        //     })
                                        // }
                                    }}
                                    getOptionLabel={(option) =>
                                       option.sr_no !== '' ? option.sr_no+'-'+option.long_description :null
                                        // let hsco =  this.state.hsco
                                        // if ( this.state.sr_no !== '' ) {
                                           
                                        // }
                                        // else{
                                        //    hsco.sr_no
                                        // }
                                        
                                        // this.state.hsco.sr_no === '' ? option.sr_no+'-'+option.long_description:this.state.hsco.sr_no
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please type SR No"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                console.log("as", e.target.value)
                                                if (e.target.value.length > 4) {
                                                    this.loadAllItems(e.target.value)
                                                    // let hsco =this.state.hsco
                                                    // hsco.sr_no = e.target.value

                                                //     this.setState({
                                                //         hsco,
                                                //        srNo:false
                                                //    })
                                                }
                                            }}
                                        />
                                    )}
                                />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Donor Name" />
                                        <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        this.state.allDonorData
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let filterData = this.state.filterData
                                                            filterData.donor_name = value.name
                                                            filterData.donor_id = value.id
                                                            this.setState(
                                                                {
                                                                    filterData
                                                                }
                                                            )
                                                        }
                                                        else{
                                                            let filterData = this.state.filterData
                                                            filterData.donor_name =null
                                                            this.setState({
                                                                filterData
                                                            })
                                                        }
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.name
                                                    }
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Type more than 3 letters"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            // value={
                                                            //     this.state
                                                            //         .formData
                                                            //         .donor_name
                                                            // }
                                                            onChange={(e) => {
                                                                if(e.target.value.length > 3){
                                                                    this.loadDonors(e.target.value)
                                                                }
                                                              
                                                            }
                                                            }
                                                            // validators={[
                                                            //     'required',
                                                            // ]}
                                                            // errorMessages={[
                                                            //     'this field is required',
                                                            // ]}
                                                        />
                                                    )}
                                                />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Status" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={[{name:"Draft"},{name:"Partial"},{name:"Approved"},{name:"Completed"}]}
                                            clearOnBlur={true}
                                            clearText="clear"
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.status = value.name;
                                                    this.setState({ filterData })
                                                }
                                            }} 
                                            
                                            getOptionLabel={(option) =>
                                                option.name ? option.name : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    // value={this.state.filterData.vehicle_type}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="GRN Date" />
                            <DatePicker
                                className="w-full"
                                placeholder="GRN Date"
                                value={
                                   this.state.filterData.delivery_date
                                }
                                // views={['year']}
                                // inputFormat="yyyy"
                                // format="yyyy"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    filterData.delivery_date = dateParse(date)
                                    this.setState({
                                        filterData,
                                    })
                                }}
                            />
                                    </Grid>

                                    {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Approved Date" />
                                        <DatePicker
                                className="w-full"
                                placeholder="Approved Date"
                                value={
                                   this.state.filterData.approved_date
                                }
                                // views={['year']}
                                // inputFormat="yyyy"
                                // format="yyyy"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    filterData.approved_date = dateParse(date)
                                    this.setState({
                                        filterData,
                                    })
                                }}
                            />
                                    </Grid>*/}
                                    <Grid
                                        className=" w-full flex-end mt-1"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Button
                                            className="mt-5 flex-end"
                                            progress={false}
                                            // onClick={() => {
                                            //     window.open('/estimation/all-estimation-items');
                                            // }}
                                            color="primary" style={{ fontWeight: 'bold', marginTop: -3 }}
                                            type="submit"
                                            scrollToTop={true}
                                            startIcon="search"
                                        >
                                            <span className="capitalize">Filter</span>
                                        </Button>
                                    </Grid>
                                </Grid>   
                            </ValidatorForm>
                        </Grid>

                        <Grid className=" w-full" spacing={1} style={{ marginTop: 20, backgroundColor: 'red' }}>
                            <Paper elevation={0} square
                                style={{ backgroundColor: '#E6F6FE', border: '1px solid #DEECF3', height: 40 }}>
                                <Grid item lg={12} className=" w-full mt-2">
                                    <Grid container spacing={1} className="flex">
                                        <Grid className="flex"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                            spacing={2}
                                            justify="space-between"
                                            style={{ marginLeft: 10, paddingLeft: 30, paddingRight: 50 }}>

                                            <SubTitle title={`Total Items to be approved: ${this.state.totalItems}`} />
                                            {/* <SubTitle title={`Pending: ${this.state.pending}`} /> */}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                    <ValidatorForm>
                        {/* Table Section */}
                        <Grid container="container" className="mt-3 pb-5">
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    {
                                        this.state.loading
                                            ? <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'} data={this.state.data} columns={this.state.columns} options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: 10,
                                                page: this.state.page,
                                                onTableChange: (action, tableState) => {
                                                    console.log(action, tableState)
                                                    switch (action) {
                                                        case 'changePage':
                                                            // this.setPage(     tableState.page )
                                                            break
                                                        case 'sort':
                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                            break
                                                        default:
                                                            console.log('action not handled.')
                                                    }
                                                }
                                            }}></LoonsTable>
                                            : (
                                                //loading effect
                                                <Grid className="justify-center text-center w-full pt-12">
                                                    <CircularProgress size={30} />
                                                </Grid>  
                                            )
                                    }
                            </Grid>
                        </Grid>
                        <Dialog
                    open={this.state.grnCreation}
                    onClose={() => { this.setState({ grnCreation: false }) }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Donation Details"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {/* Donation Details */}
                        </DialogContentText>
                        <h5>Details of Donation</h5>
                        <Grid container spacing={1} className="flex ">
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Donation Invoice Date: ${dateParse(this.state.backendData?.donors_invoice_date)}`}</Typography>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Donation Reg No: ${this.state.backendData?.donation_reg_no}`}</Typography>
                            </Grid>
                            {/* <Grid item lg={6} md={6} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`No of containers: ${this.state.noOfContainer}`}</Typography>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`MSD order list no: ${this.state.msdOderListNo}`}</Typography>
                            </Grid> */}
                              <Grid item lg={6} md={6} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Donar Name: ${this.state.backendData?.donor_name}`}</Typography>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Donar Country: ${this.state.backendData?.donor_country}`}</Typography>
                            </Grid>
                            </Grid>
                            <br />
                             <hr />
                             <h5>Details of Items</h5>
                             <Grid container spacing={1} className="flex ">
                            <Grid item lg={12} md={12} sm={12} xs={12}>

                                <Typography className="mt-5"
                                    variant="subtitle1">{`Item Name: ${this.state.formData?.item_name}`}</Typography>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Total Quantity: ${this.state.formData?.total_quantity}`}</Typography>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                {/* <Typography className="mt-5"
                                    variant="subtitle1">{`Total Quantity: ${this.state.formData?.total_quantity}`}</Typography> */}
                            </Grid>
                             
                            </Grid>
                        <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Warehouse" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.drugStoreData}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let warehouse_id = this.state.warehouse_id;
                                                    warehouse_id = value.id;
                                                    this.setState({ warehouse_id })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Select Warehouse"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.warehouse_id}
                                                />
                                            )}
                                        />
                                    </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button variant="text" onClick={() => { this.setState({ grnCreation: false }) }} color="primary">
                            Close
                        </Button>
                        <Button variant="text" progress={this.state.creatingGrn} onClick={() => {  this.createDonationGRN() }} color="primary" autoFocus>
                            Create GRN
                        </Button>
                    </DialogActions>
                </Dialog>

                    </ValidatorForm>

    

                </LoonsCard>
            </MainContainer>
        )
    }
}

export default HosViewGRN