import React, { Component, Fragment } from "react";
import MainContainer from "../../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../../components/LoonsLabComponents/CardTitle";
import LoonsCard from "../../../components/LoonsLabComponents/LoonsCard";
import { CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Tooltip, Typography } from "@material-ui/core";
import { ValidatorForm,  TextValidator} from "react-material-ui-form-validator";
import { Button,DatePicker,LoonsTable } from "app/components/LoonsLabComponents";
import SubTitle from "../../../components/LoonsLabComponents/SubTitle";
import Paper from '@material-ui/core/Paper';
import { Autocomplete } from "@mui/material";
import { Dialog } from "@mui/material";
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DonarService from '../../../services/DonarService'

import VisibilityIcon from '@material-ui/icons/Visibility'
import localStorageService from 'app/services/localStorageService'
import EmployeeServices from 'app/services/EmployeeServices'
import InventoryService from 'app/services/InventoryService'

import { dateParse } from "utils";
import * as appConst from '../../../../appconst'

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
        backgroundColor: '#bad4ec',
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

class QAArchivedRequests extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
            classes: styleSheet,
            loading: true,
            sr_no: [],
            totalItems: 0,
            formData: {
                sr_no: '',
                donor_name: '',
                donor_country: '',
                delivery_date: '',
                approved_date: '',
            },
            empData: [],
            allDonorData: [],
            donarName: [{ 'label': 'Test' }],
            // totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
                delivery_date: null,
                approved_date: null,
                donor_name: null,
                donor_country: null,
                description: null,
                sr_no: null,
                'sr_no[0]': ['updatedAt', 'DESC'],
            },
            data:[],
            columns: [
                {
                    name: 'log_no', // field name in the row object
                    label: 'Log No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     return this.state.data[tableMeta.rowIndex]?.Donor
                        //         ?.name
                        // },
                    },
                },
                {
                    name: 'item_name', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     return this.state.data[tableMeta.rowIndex]?.Donor
                        //         ?.country
                        // },
                    },
                },
                {
                    name: 'batch_details', // field name in the row object
                    label: 'Batch Details', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'reported_date', // field name in the row object
                    label: 'Reported Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     return dateParse(value)
                        // },
                    },
                },
                {
                    name: 'consultant_initiated', // field name in the row object
                    label: 'Consultant Initiated', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id
                            let donar_id = this.state.data[dataIndex]?.Donor?.id
                            // [dataIndex]?.Donor?.id
                            return (
                                <Grid className="flex items-center">
                                    {/* <Tooltip title="Edit">
                                        <IconButton> */}
                                            {/* <Button color="primary"> */}

                                            {/* {status} */}
                                            {/* </Button>
                                        </IconButton>
                                    </Tooltip> */}
                                    <IconButton
                                        onClick={() => {
                                            window.location.href = `/donation/view-donation-items/${id}/${donar_id}`
                                        }}
                                        className="px-2"
                                        size="small"
                                        aria-label="View Item"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </Grid>
                            )
                        },
                    },
                },
                {
                    name: 'sample_submit_status', // field name in the row object
                    label: 'Sample submit status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'certificate of quality', // field name in the row object
                    label: 'Certidicate of Quality', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'circular_report', // field name in the row object
                    label: 'Circular Report', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
            ],
            // totalItems: 0,
            pending: 0,
        }
    }
    componentDidMount() {
        // this.LoadData()
    }
    async LoadData() {
        this.setState({ loading: false })
        console.log("State 1:", this.state.data)
        let res = await DonarService.getDonations(this.state.filterData)
        if (res.status == 200) {
            this.setState({
                data: res.data.view.data,
                totalItems:res.data.view.totalItems,
                loading: true
            }
            // ,
            
            //  () => {
            //     let data = this.state.data
            //     let count = 0
            //     if(data.filter((ele) => ele.status === "Active")){
            //         // count = count + 1
                    
            //         return count = count + 1
                    
            //     }
            //     console.log("count",count)
               
            //  }
             
             )
        }   
     }    
    async getEmployees(){

        const userId = await localStorageService.getItem('userInfo').id

        let getAsignedEmployee = await EmployeeServices.getEmployees({
            // employee_id: userId,
            type: ['MSD SCO','MSD SCO Supply','MSD SCO QA'],
            // issuance_type: 'SCO' 
        })
        if (getAsignedEmployee.status == 200) {
            this.setState({
                // loaded: true,
                empData: getAsignedEmployee.data.view.data
            })

            console.log(this.state.empData);
        }
    }
    async loadAllItems(search) {
        // let params = { "search": search }
        let data = {
          search: search
      }
    //   let filterData = this.state.filterData
      // this.setState({ loaded: false })
    //   let params = { limit: 10000, page: 0 }
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
        // if(res.name == search){
            
        // }
       
    }
}


    render() {
        // const { classes } = this.props
        return (
            <MainContainer>
                <LoonsCard>
                    <CardTitle title="Archived logs" />

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
                                       lg={3}
                                       md={3}
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
                                </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={3}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Status" />
                                        <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        appConst.qa_nmqal_status
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let filterData = this.state.filterData
                                                            filterData.status = value.label
                                                            // filterData.donor_id = value.id
                                                            this.setState(
                                                                {
                                                                    filterData
                                                                }
                                                            )
                                                        }
                                                        
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.label
                                                    }
                                                    // validators={[
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
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

                                    {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Action" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={appConst.Country_list}
                                            clearOnBlur={true}
                                            clearText="clear"
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.donor_country = value.name;
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
                                    </Grid> */}
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={3}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Reported Date From" />
                            <DatePicker
                                className="w-full"
                                placeholder="Reported Date From"
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
                                        lg={3}
                                        md={3}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Reported Date to" />
                                        <DatePicker
                                className="w-full"
                                placeholder="Reported Date to"
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
                                            <SubTitle title={`Pending: ${this.state.pending}`} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                           
                        </Paper>
                    </Grid>

                    <ValidatorForm>
                        {/* Table Section */}
                        <Grid container="container" className="mt-3 pb-5">
                            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                {this.state.loading ? (
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: 10,
                                            page: this.state.page,
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                console.log(action, tableState)
                                                switch (action) {
                                                    case 'changePage':
                                                        // this.setPage(     tableState.page )
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
                                ) : (
                                    //loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </LoonsCard >
            </MainContainer >
        )
    }
}

export default QAArchivedRequests
