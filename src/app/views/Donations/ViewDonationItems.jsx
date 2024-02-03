import React, { Component, Fragment } from "react";
import MainContainer from "../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../components/LoonsLabComponents/CardTitle";
import LoonsCard from "../../components/LoonsLabComponents/LoonsCard";
import { CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Tooltip, Typography } from "@material-ui/core";
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
import DonarService from '../../services/DonarService';

// tabs, tab
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';

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

class ViewDonations extends Component {

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
                status: '',
                donor_name: '',
                donor_country: '',
                delivery_date: '',
                approved_date: '',
            },
            reg_no: '',
            status: [],
            allDonorData:[],
            // totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
                delivery_date: null,
                name: '',
                donor_name: '',
                donor_country: '',
                description: '',
                status: '',
                sr_no: '',
                delivery_person: '',
                'sr_no[0]': ['updatedAt', 'DESC'],
            },
            data:[],
            columns: [
                // {
                //     name: 'ids', // field name in the row object
                //     label: 'Invoice No', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR No ', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 25,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.itemdata?.sr_no
                        }
                    }
                },
                {
                    name: 'name', // field name in the row object
                    label: 'Donation item Name ', // column title that will be shown in table
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
                // {
                //     name: 'statuss', // field name in the row object
                //     label: 'Status', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //         customBodyRenderLite: (dataIndex) => {
                //             let status = this.state.data[dataIndex]?.approval
                //             // 'Approve'
                //             // 
                //             // if(status === 'Approve'){
                //             //     // let status2 
                //             //     return 'To Be Approved'
                //             // }
                //             if (status === 'Approve')
                //             {
                //                 return 'Submitted to HSCO'  
                //             }
                //             else if(status === 'Approved'){
                //                 return 'Approved'  
                //             }
                //             // return dateParse(value)
                //         },
                //     },
                // },
                {
                    name: "status",
                    label: "status",
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex]?.id
                            let donar_id =this.props.match.params?.id
                            return (
                                <Grid className="flex items-center">
                                    <p>{this.state.data[dataIndex]?.status != null ?this.state.data[dataIndex]?.status : "Pending"}</p>
                                                
                                </Grid>
                            );

                            }
                        }

                },
                {
                    name: "action",
                    label: "Action",
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex]?.id
                            let donar_id =this.props.match.params?.id
                            return (
                                <Grid className="flex items-center">
                                    <IconButton
                                        onClick={() => {
                                            window.location.href = `/donation/view-donation-registration-note/${id}/${donar_id}`
                                        }}
                                        className="px-2"
                                        size="small"
                                        aria-label="View Item"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </Grid>
                            );

                            }
                        }

                    }
                
            ], 
            // totalItems: 0,
            pending: 0,
        }
    }
    componentDidMount() {
        let donar_id =this.props.match.params.donar_id
        let id = this.props.match.params.id
        console.log('NOTE ID', id)
        console.log('NOTE ID2', donar_id)
        const params = new URLSearchParams(this.props.location.search);
        let reg_no = params.get('reg_no');
        this.setState({ reg_no: reg_no })
        this.LoadData()
    }
    async LoadData() {
        this.setState({ loaded: false })
        console.log("State 1:", this.state.data)
        let filterData = this.state.filterData
        filterData.donation_id = this.props.match.params.id
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
          this.setState({ 
            sr_no: res.data.view.data, 
            status:res.data.view.data 
        })
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

// async setTab(newValue) {

//     let filterData = this.state.filterData;
//     if (newValue === 0) {
//         filterData.status = 'Pending to CIU' // status for pending
//         this.setState({ filterData, activeTabIndex: 0 }, () => { this.setpage(0) }) //setTab for pending
//     }
//     else if (newValue === 1) {
//         filterData.status = 'Submitted to CIU' // status for submitted
//         this.setState({ filterData}, () => { this.setpage(1) }) //setTab for submitted
//     }
//     else if (newValue === 2) {
//         filterData.status = 'Rejected to CIU' // status for rejected
//         this.setState({ filterData}, () => { this.setpage(2) }) //setTab for rejected
//     }
//     else {
//         filterData.status = 'All Donations to CIU' // status for all donations
//         this.setState({ filterData }, () => { this.setpage(3) }) //setTab for all donations
//         }

//     }


    render(){
        // const { classes } = this.props
        return(
            <MainContainer>
                <LoonsCard>
                    <CardTitle 
                    title=  {`Donation Register No : ${this.state.reg_no}`}
                    // `Total Items to be approved: ${this.state.totalItems}`
                    />
                    {/* <Tabs
                        value={this.state.activeTabIndex}
                        onChange={this.setPage}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example">
                        <Tab label="PENDING" />  
                        <Tab label="SUBMITED" />  
                        <Tab label="REJECTED" />  
                        <Tab label="ALL DONATIONS" />   */}
                        {/* <Tab label="Item Order Base" {...a11yProps(1)} /> */}
                    {/* </Tabs> */}

                    <Grid item lg={12} className=" w-full mt-2">
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.setPage(0)}
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
                                        <TextValidator
                                        variant="outlined"
                                        size="small"
                                    className="w-full"
                                    placeholder="Type Donation SR no"
                                    onChange={(e) => {
                                            let filterData = this.state.filterData;
                                            filterData.sr_no = e.target.value;
                                            console.log('SR no',filterData)
                                            this.setState({ 
                                                filterData,
                                                // srNo:true
                                            })
                                            // let formData = this.state.formData;
                                            // formData.sr_no = value;
                                           
                                        // else {
                                        //     let filterData = this.state.filterData;
                                        //     filterData.sr_no = null;
                                        //     this.setState({ filterData,
                                        //         srNo:false
                                        //     })
                                        // }
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
                                        <SubTitle title="Donation Item Name" />
                                        <TextValidator
                                        variant="outlined"
                                        size="small"
                                    className="w-full"
                                    placeholder="Type Donation Item Name"
                                    onChange={(e) => {
                                            let filterData = this.state.filterData;
                                            filterData.name = e.target.value;
                                            console.log('Donation Item Name',filterData)
                                            this.setState({ 
                                                filterData,
                                                // srNo:true
                                            })
                                            // let formData = this.state.formData;
                                            // formData.sr_no = value;
                                           
                                        // else {
                                        //     let filterData = this.state.filterData;
                                        //     filterData.sr_no = null;
                                        //     this.setState({ filterData,
                                        //         srNo:false
                                        //     })
                                        // }
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
                                        <SubTitle title="Status" />
                                        <TextValidator
                                        variant="outlined"
                                        size="small"
                                    className="w-full"
                                    placeholder="Type Status"
                                                    onChange={(e) => {
                                                            let filterData = this.state.filterData
                                                            filterData.status = e.target.value;
                                                            console.log('status',filterData)
                                                            this.setState(
                                                                {
                                                                    filterData
                                                                }
                                                            )
                                                        // }
                                                        // else{
                                                        //     let filterData = this.state.filterData
                                                        //     filterData.status =null
                                                        //     this.setState({
                                                        //         filterData
                                                        //     })
                                                        // }
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
                                        <SubTitle title="Donor Country" />
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

                                    {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Delivery Date" />
                            <DatePicker
                                className="w-full"
                                placeholder="Delivery Date"
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
                                    </Grid> */}

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
                                    </Grid> */}

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
                                    
                                    <Grid  item
                                        lg={4}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                        justify="flex-start">
                                              <Button
                                               className="mt-6 justify-end"
                                                progress={false}
                                                scrollToTop={true}
                                                // color=''
                                                // startIcon="save"
                                                // variant={"secondary"}
                                                // color="primary"
                                                onClick={() => {
                                                    window.location.href = `/donation/donation-registration-note/${this.props.match.params.id}`
                                                }}
                                            >
                                                <span className="capitalize">  Create New Item</span>
                                            </Button>
                                    {/* <Button
                                        className="mt-6 justify-end"
                                        color="primary"
                                        // progress={this.state.btnProgress}
                                        startIcon="add"
                                        // type="submit"
                                        onClick={() => {
                                            window.location.href = `/donation/donation-registration-note/${this.props.match.params.id}`
                                           
                                        }}
                                        scrollToTop={true}
                                    >
                                        <span className="capitalize">
                                            Create New Item
                                        </span>
                                    </Button> */}
                                </Grid>
                                </Grid>   
                              
                            </ValidatorForm>
                        </Grid>

                        {/* <Grid className=" w-full" spacing={1} style={{ marginTop: 20, backgroundColor: 'red' }}>
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
                        </Grid> */}
                       

                    <ValidatorForm>
                        {/* Table Section */}
                        <Grid container="container" className="mt-3 pb-5">
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    {
                                        this.state.loading
                                            ? <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'} 
                                            data={this.state.data} columns={this.state.columns} options={{
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
                                                        case 'changeRowsPerPage':
                                                            let filterData = this.state.filterData;
                                                            filterData.limit = tableState.rowsPerPage;
                                                            this.setState({ filterData })
                                                            this.setPage(0)
                                                            break;
                                                        case 'sort':
                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                            break
                                                        default:
                                                            console.log(
                                                                'action not handled.'
                                                            )
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

                    {/* <Button aria-label="close" className={styleSheet.Dialogroot} onClick={() => { this.setState({ detailedViewNonDrugView: true }) }}> 
                        Detailed View of Non-Drug
                    </Button> */}

                    <Dialog maxWidth="lg " open={this.state.detailedViewNonDrugView} >

                    <MuiDialogTitle disableTypography className={styleSheet.Dialogroot}>
                        <CardTitle title="Detailed View of the Donation" />

                        <IconButton aria-label="close" className={styleSheet.Dialogroot} onClick={() => { this.setState({ detailedViewNonDrugView: false }) }}> 
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>



                    <div className="w-full h-full px-5 py-5">
                        <DetailedViewNonDrug/>
                    </div>
                </Dialog>

                {/* <Button aria-label="close" className={styleSheet.Dialogroot} onClick={() => { this.setState({ detailedViewDrugView: true }) }}> 
                        Detailed View of Drug
                    </Button> */}

                    <Dialog maxWidth="lg " open={this.state.detailedViewDrugView} >

                    <MuiDialogTitle disableTypography className={styleSheet.Dialogroot}>
                        <CardTitle title="Detailed View of the Donation" />

                        <IconButton aria-label="close" className={styleSheet.Dialogroot} onClick={() => { this.setState({ detailedViewDrugView: false }) }}> 
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>



                    <div className="w-full h-full px-5 py-5">
                        <DetailedViewDrug/>
                    </div>
                </Dialog>  

                </LoonsCard>
            </MainContainer>
        )
    }
}

export default ViewDonations