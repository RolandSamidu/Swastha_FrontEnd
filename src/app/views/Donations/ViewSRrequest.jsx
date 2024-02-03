import React, { Component, Fragment } from "react";
import MainContainer from "../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../components/LoonsLabComponents/CardTitle";
import LoonsCard from "../../components/LoonsLabComponents/LoonsCard";
import {CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Tooltip, Typography } from "@material-ui/core";
import { ValidatorForm,  TextValidator} from "react-material-ui-form-validator";
import { DatePicker,Button, LoonsSnackbar, LoonsTable } from "app/components/LoonsLabComponents";
import SubTitle from "../../components/LoonsLabComponents/SubTitle";
import Paper from '@material-ui/core/Paper';  
import { Autocomplete } from "@mui/material";
import DetailedViewNonDrug from "./DetailedViewNonDrug";
import DetailedViewDrug from "./DetailedViewDrug";
import { Dialog } from "@mui/material";
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DonarService from '../../services/DonarService'
import moment from "moment";

import VisibilityIcon from '@material-ui/icons/Visibility'
import { dateParse } from "utils";
import InventoryService from 'app/services/InventoryService'
import localStorageService from 'app/services/localStorageService'
import { isNull } from "lodash";
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

class ViewSRrequest extends Component {

    constructor(props){
        super(props)
        this.state = {
            //snackbar
            alert: false,
            message: '',
            severity: 'success',

            detailedViewNonDrugView: false,
            detailedViewDrugView: false,
            classes: styleSheet,
            loading: true,
            totalItems: 0,
            formData: {
                sr_no: '',
                donor_name: '',
                donor_country: '',
                delivery_date: '',
                approved_date: '',
            },
            sr_no: [],
            empData:[],
            donarName:[{'label':'Test'}],

            // totalItemsToBeApproved: 0,
            filterData: {
                limit: 20,
                page: 0,
                year: null,
                donation_reg: null,
                request_no: null,
                'order[0]': ['updatedAt', 'DESC'],
            },
            data:[{'Donation_reg_no':'2'}],
            columns: [
                {
                    name: 'created at', // field name in the row object
                    label: 'Request Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(this.state.data[tableMeta.rowIndex]?.createdAt)
                        }
                    }
                },
                {
                    name: 'donation_reg_no', // field name in the row object
                    label: 'Donation Reg No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'request_no', // field name in the row object
                    label: 'Request By', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.requestedby?.name
                        }
                    }
                },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                         customBodyRenderLite: (dataIndex) => {
                            // let id = this.state.data[dataIndex].id
                            // let donar_id = this.state.data[dataIndex]?.Donor?.id
                            if(this.state.data[dataIndex].item_id == null || this.state.data[dataIndex].item_id === '' ){
                                return (
                                    <Grid>
                                       {/* <Grid
                                           className=" w-full"
                                           item
                                           lg={2}
                                           md={2}
                                           sm={12}
                                           xs={12}
                            
                                        > */}
                                            {/* <SubTitle title="SR No" /> */}
                                            <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        // value={this.state.data[dataIndex].item_id != null || this.state.data[dataIndex].item_id != '' ? this.state.sr_no.find((v) => v.id == this.state.data[dataIndex].item_id): null}
                                        // options={this.state.sr_no}
                                        options={this.state.sr_no}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let data = this.state.data;
                                                data[dataIndex].sr_no = value.id;
                                                console.log('SR no',data)
                                                this.setState({ 
                                                    data,
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
                                                placeholder="Type more than 4 letters"
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
                                    {/* </Grid> */}
    
                                        {/* <IconButton
                                            onClick={() => {
                                                window.location.href = `/donation/sr-view-donation-items/${id}/${donar_id}`
                                            }}
                                            className="px-2"
                                            size="small"
                                            aria-label="View Item"
                                        >
                                            <VisibilityIcon />
                                        </IconButton> */}
                                        {/* <Tooltip title="Edit">
                                            <IconButton>
                                                <Button color="primary">Approved</Button>
                                            </IconButton>
                                        </Tooltip> */}
                                    </Grid>
                                );
                            }
                            else{
                                return(
                                    <Grid>
                                <TextValidator
                                    className="w-full"
                                    name="Request No"
                                    InputLabelProps={{ shrink: false }}
                                    // value={this.state.data[dataIndex]?.ItemSnap?.long_description}
                                    value={this.state.data[dataIndex]?.itemdata?.long_description}
                                    variant="outlined"
                                    disabled={true}
                                    size="small"
                                    // onChange={(e) => {
                                    //     let filterData = this.state.filterData
                                    //     filterData.request_no = e.target.value
                                    //     this.setState({
                                    //         filterData,
                                    //     })
                                    // }}
                                />
                            </Grid>
                                )
                            }
                           
                        }
                    }
                },
                {
                    name: 'item_name', // field name in the row object
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
                // {
                //     name: 'description', // field name in the row object
                //     label: 'Item Description', // column title that will be shown in table
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
                // {
                //     name: 'item_name', // field name in the row object
                //     label: 'Item Name', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //     },
                // },
                // {
                //     name: 'batch_exp_date', // field name in the row object
                //     label: 'Batch Expiry Date', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             // return (
                //             //     <span>
                //             //         {value
                //             //             ? dateParse(
                //             //                   moment(value).format('YYYY-MM-DD')
                //             //               )
                //             //             : ''}
                //             //     </span>
                //             // )
                //         },
                //     },
                // },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex]?.donation_item_id
                            let donation_id =this.state.data[dataIndex]?.id
                            // let id = this.state.data[dataIndex].id
                            // let donar_id = this.state.data[dataIndex]?.Donor?.id
                            if(this.state.data[dataIndex].status !== "SR Submitted" || this.state.data[dataIndex].item_id == null){
                                return (
                                    <Grid className="flex items-center">
                                        <Tooltip title="Approve">
                                            <IconButton>
                                                <Button color="primary"
                                                onClick={() => {
                                                this.submitSR(dataIndex)
                                            }
                                        }
                                                >Approve</Button>
                                            </IconButton>
                                        </Tooltip>
                                        <IconButton
                                        onClick={() => {
                                            window.location.href = `/donation/view-sco-donation-registration-note/${id}/${donation_id}`
                                        }}
                                        className="px-2"
                                        size="small"
                                        aria-label="View Item"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                    </Grid>
                                );
                            }else{
                                return (
                                    <Grid className="flex items-center">
                                        <Tooltip title="Approved">
                                            <IconButton>
                                                <Button color="primary"
                                                disabled={true}
                                                onClick={() => {
                                                this.submitSR(dataIndex)
                                            }
                                        }
                                                >Approved</Button>
                                            </IconButton>
                                        </Tooltip>
                                        <IconButton
                                        onClick={() => {
                                            window.location.href = `/donation/view-sco-donation-registration-note/${id}/${donation_id}`
                                        }}
                                        className="px-2"
                                        size="small"
                                        aria-label="View Item"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                        {/* <IconButton
                                            onClick={() => {
                                                window.location.href = `/donation/sr-view-donation-items/${id}/${donar_id}`
                                            }}
                                            className="px-2"
                                            size="small"
                                            aria-label="View Item"
                                        >
                                            <VisibilityIcon />
                                        </IconButton> */}
                                    </Grid>
                                );
    
                                
                            }
                        }

                    }
                },
            ], 
            // totalItemsToBeApproved: 0,
            pending: 0,
        }
    }
    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.LoadData()
            }
        )
    }
    async submitSR(rowIndex){
    console.log('rowIndex',rowIndex)
    if(this.state.data[rowIndex].sr_no == null || this.state.data[rowIndex].sr_no === ''){
        this.setState({
            alert: true,
            message: 'Please Add SR number',
            severity: 'error',
        })
    }else{
        console.log(this.state.data,"sr submitted")
        let userInfo = await localStorageService.getItem('userInfo')
    
        let data = {
            item_id:this.state.data[rowIndex].sr_no,
            donation_item_id:this.state.data[rowIndex].donation_item_id,
            approved_by:userInfo.id,
            status:"SR Submitted"
        }
        let id = this.state.data[rowIndex].id 
        console.log(data,id,"Data")
            let res = await DonarService.assignDonationSR(id,data)
            if (200 == res.status) {
                
                this.setState({
                    alert: true,
                    message: 'SR Submitted Successfuly',
                    severity: 'success',
                },()=>{
                    window.location.reload()
                })
            } else {
                this.setState({
                    alert: true,
                    message: 'SR Submission was Unsuccessful',
                    severity: 'error',
                })
            }
        
    }
    
    }
    async loadAllItems(search) {
    // this.setState({ loading: false })
    let params = { "search": search }
        let data = {
          search: search
      }
    //   let filterData = this.state.filterData
      // this.setState({ loading: false })
    //   let params = { limit: 10000, page: 0 }
      // let filterData = this.state.filterData
      let res = await InventoryService.fetchAllItems(data)
      console.log('all Items', res.data.view.data)

      if (res.status == 200) {
          this.setState({ 
            sr_no: res.data.view.data },
            // () => this.LoadData()
            )
      }
    //   console.log('items', this.state.left)
  }
    componentDidMount() {
    this.LoadData()
    // this.loadAllItems()
    }
    async LoadData() {
        this.setState({ loading: false })
        console.log("State 1:", this.state.data)
        let res = await DonarService.getSRRequests(this.state.filterData)
             if (res.status == 200) {
            this.setState({
                data: res.data.view.data,
                totalItems:res.data.view.totalItems,
                loading: true
            },
            
            //  () => this.loadAllItembyID()
            //  console.log('resdata', this.state.data)
            )
        } 
  }


//   async loadAllItembyID() {
//     let params = { }
//     let ids = this.state.data.map(a => a.id);
//     console.log('ids',ids)
//     // let filterData = this.state.filterData
//     let res = await InventoryService.fetchItemById(params,ids)
//     console.log('Single Items', res.data.view)
//     if (res.status == 200) {
//       let sr_no = this.state.sr_no
//        sr_no.push(res.data.view)
//       this.setState({
//           sr_no: sr_no,
//           loading:true
//        },
//     //    () => this.LoadData()
//     )
//     }
    
//   }


    render(){
        // const { classes } = this.props
        return(
            <MainContainer>
                <LoonsCard>
                    <CardTitle title="View SR Requests" />

                    <Grid item lg={12} className=" w-full mt-2">
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.LoadData()}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex">
                                <Grid item lg={3} md={12} sm={3} xs={12}>
                                    <SubTitle title="SR Status" />
                                    <Autocomplete
                                        // disableClearable
                                                    className="w-full"
                                                    options={appConst.donationSR_status}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let filterData = this.state.filterData;
                                                            filterData.status = value.value
                                                            this.setState({ filterData })

                                                        }
                                                    }}
                                                   
                                                    getOptionLabel={(option) => option.label}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Status"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                </Grid>
                                {/* <Grid item lg={3} md={12} sm={3} xs={12}>
                                    <SubTitle title="Request No" />
                                    <TextValidator
                                        className="w-full"
                                        name="Request No"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.filterData.request_no}
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let filterData = this.state.filterData
                                            filterData.request_no = e.target.value
                                            this.setState({
                                                filterData,
                                            })
                                        }}
                                    />
                                </Grid>
                                <Grid className="" item lg={3} md={3} sm={12} xs={12}>

                            <SubTitle title="Year" />
                            <DatePicker
                                className="w-full"
                                placeholder="Year"
                                value={
                                   this.state.filterData.year
                                }
                                views={['year']}
                                inputFormat="yyyy"
                                format="yyyy"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    filterData.year = dateParse(date)
                                    this.setState({
                                        filterData,
                                    })
                                }}
                            /> */}
                        {/* </Grid> */}
                                    <Grid
                                        className=" w-full flex-end mt-1"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Button
                                            className="mt-6 flex-end"
                                            progress={false}
                                            // onClick={() => {
                                            //     window.open('/estimation/all-estimation-items');
                                            // }}
                                            color="primary" style={{ fontWeight: 'bold', marginTop: -3 }}
                                            type="submit"
                                            scrollToTop={true}
                                            // startIcon="search"
                                        >
                                            <span className="capitalize">Filter</span>
                                        </Button>  <Button
                                            className="mt-6 flex-end"
                                            progress={false}
                                            onClick={() => {
                                               window.location.reload()
                                            }}
                                            color="primary" style={{ fontWeight: 'bold', marginTop: -3 }}
                                            // type="submit"
                                            scrollToTop={true}
                                            // startIcon="search"
                                        >
                                            <span className="capitalize">Reset</span>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                            </Grid>
                    <ValidatorForm>
                        {/* Table Section */}
                        <Grid container="container" className="mt-3 pb-5">
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    {
                                        this.state.loading
                                            ?  <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'all_items'} data={this.state.data} columns={this.state.columns} options={{
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
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage(tableState.page)
                                                            break
                                                        case 'sort':
                                                            // this.sort(tableState.page, tableState.sortOrder);
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
                        
                    </ValidatorForm>
                </LoonsCard>
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
            </MainContainer>
        )
    }
}

export default ViewSRrequest