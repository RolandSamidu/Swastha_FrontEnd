import React, { Component, Fragment } from "react";
import MainContainer from "../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../components/LoonsLabComponents/CardTitle";
import LoonsCard from "../../components/LoonsLabComponents/LoonsCard";
import {CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Tooltip, Typography } from "@material-ui/core";
import { ValidatorForm,  TextValidator} from "react-material-ui-form-validator";
import {  Button,DatePicker,LoonsTable } from "app/components/LoonsLabComponents";
import SubTitle from "../../components/LoonsLabComponents/SubTitle";
import Paper from '@material-ui/core/Paper';  
import { Autocomplete } from "@mui/material";
import { Dialog } from "@mui/material";
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import VisibilityIcon from '@material-ui/icons/Visibility'
import { dateParse } from "utils";
import * as appConst from '../../../appconst'

import WarehouseServices from "app/services/WarehouseServices";
import InventoryService from 'app/services/InventoryService'
import localStorageService from "../../services/localStorageService";

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

class AllocationLedger extends Component {

    constructor(props){
        super(props)
        this.state = {
            detailedViewNonDrugView: false,
            detailedViewDrugView: false,
            classes: styleSheet,
            loading: true,
           
            filterData: {
                limit: 20,
                page: 0,
                serach: null,
                to: null,
                from: null,
                sr_no: '',
                type:"ALLOCATED",
        
                // 'order[0]': ['createed', 'DESC'],
            },
            data:[{'sr_no':'2'}],
            columns: [
                {
                    name: 'date', // field name in the row object
                    label: 'Allocated Date', // column title that will be shown in table
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
                    name: 'name', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.medium_description
                        }
                    }
                },
                {
                    name: 'name', // field name in the row object
                    label: 'SR No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.sr_no
                        }
                    }
                },
                {
                    name: 'total_quantity', // field name in the row object
                    label: 'Order ID', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.OrderItem?.OrderExchange?.order_id
                        }
                    }
                },
                {
                    name: 'total_quantity', // field name in the row object
                    label: 'Institute', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.OrderItem?.OrderExchange?.fromStore?.name
                        }
                    }
                },
                {
                    name: 'total_quantity', // field name in the row object
                    label: 'MSD Warehouse', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.OrderItem?.OrderExchange?.toStore?.name
                        }
                    }
                },
               
                {
                    name: "action",
                    label: "Action",
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex]?.id
                            let donation_id =this.state.data[dataIndex]?.donation_id
                            return (
                                <Grid className="flex items-center">
                                    {/* <Tooltip title="Edit">
                                        <IconButton>
                                            <Button color="primary"> */}
                                                <p>{this.state.data[dataIndex]?.status}</p>
                                                {/* </Button>
                                        </IconButton>
                                    </Tooltip> */}
                                    {/* <IconButton
                                        onClick={() => {
                                            window.location.href = `/donation/ciu-view-donation-item/${id}/${donation_id}`
                                        }}
                                        className="px-2"
                                        size="small"
                                        aria-label="View Item"
                                    >
                                        <VisibilityIcon /> 
                                    </IconButton>*/}
                                </Grid>
                            );
                        }

                    }
                },
            ], 
          
        }
    }
    componentDidMount() {
       
        this.LoadData()
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
    async LoadData() {
        this.setState({ loaded: false })
        console.log("State 1:", this.state.data)
        let user_id = await localStorageService.getItem('userInfo').id
        let filterData = this.state.filterData
        filterData.remark_by = user_id  
        let res = await WarehouseServices.getAllocationLedger(filterData)
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

    render(){
        // const { classes } = this.props
        return(
            <MainContainer>
                <LoonsCard>
                    <CardTitle title="Allocation Ledger" />

                    <Grid item lg={12} className=" w-full mt-2">
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.LoadData()}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex">
                                
                                {/* <Grid
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
                                    </Grid> */}
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="From Date" />
                            <DatePicker
                                className="w-full"
                                placeholder="From Date"
                                value={
                                   this.state.filterData.from
                                }
                                // views={['year']}
                                // inputFormat="yyyy"
                                // format="yyyy"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    filterData.from = dateParse(date)
                                    this.setState({
                                        filterData,
                                    })
                                }}
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
                                        <SubTitle title="To Date" />
                                        <DatePicker
                                className="w-full"
                                placeholder="To Date"
                                value={
                                   this.state.filterData.to
                                }
                                // views={['year']}
                                // inputFormat="yyyy"
                                // format="yyyy"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    filterData.to = dateParse(date)
                                    this.setState({
                                        filterData,
                                    })
                                }}
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
                                        // value={this.state.formData.search}
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
                                            <span className="capitalize">Search</span>
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
                                        this.state.loaded
                                            ? <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'} data={this.state.data} columns={this.state.columns} options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: 20,
                                                page: this.state.filterData.page,
                                                onTableChange: (action, tableState) => {
                                                    console.log(action, tableState)
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage( tableState.page )
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
                    </ValidatorForm>
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default AllocationLedger