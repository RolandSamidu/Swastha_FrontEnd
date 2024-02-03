import React, { Component, Fragment } from "react";
import { CardTitle, LoonsCard, SubTitle, DatePicker } from "app/components/LoonsLabComponents";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";
import { LoonsTable, Button } from "app/components/LoonsLabComponents";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { CircularProgress, Grid, IconButton } from "@material-ui/core";
import * as appConst from '../../../appconst'
import { Autocomplete} from "@material-ui/lab";
import { Dialog } from "@mui/material";
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DonorRegistration from './DonorRegistration';
import DonationNote from './DonationNote';
import textarea from '@material-ui/core';
import DonarService from '../../services/DonarService'
import localStorageService from 'app/services/localStorageService'
import { withStyles } from '@material-ui/core/styles'
import EmployeeServices from 'app/services/EmployeeServices'
import { dateParse, dateTimeParse } from "utils";

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

class DonationRegistration extends Component {
    constructor(props) {
        super(props)
        this.state = {
             //snackbar
             alert: false,
             message: '',
             severity: 'success',
             
            donorRegistration: false,
            donor_name: [],
            res:null,
            resloaded:false,
            donor_country: [],
            allEmpData:[],
            allSecData:[],
            allDonorData:[],
            receiving_officer_name: [],
            security_officer_name: [],
            login_user_role:null,
            filterData: {
                limit: 20,
                page: 0,
                order_no: null,
                'order[0]': ['updatedAt', 'DESC'],


            },
            formData: {
                donor_id: null,
                received_date: null,
                delivery_person: null,
                delivery_person_contact_no: null,
                receiving_officer:null,
                donors_invoice_no: null,
                donors_invoice_date: null,
                delivered_by: null,
                description: null,
                donation_country:null
            }
        }
    }
    componentDidMount(){
        this.loadAllEmployees()
        this.loadSecurityEmployees()
        // this.loadDonors()
    }
    async loadAllEmployees() {
        // let employeeFilterData = this.state.employeeFilterData
        let userInfo = await localStorageService.getItem("userInfo")
        let owner_id = await localStorageService.getItem("owner_id")
        // let warehouse = await localStorageService.getItem('Login_user_Hospital')
        // console.log('all warehouse', warehouse)
        // console.log('all owner_id', owner_id)
        let params
        if (userInfo?.roles[0] === 'Chief Pharmacist') {
            params = {
                type: "Chief Pharmacist",
                owner_id: owner_id
            }
        } else {
            params = {
                type: "MSD MSA",
            } 
        }

        this.setState({ loaded: false })
        let res = await EmployeeServices.getEmployees(params)
        console.log('all pharmacist------------------->>>>', res.data.view.data)
        if (200 == res.status) {
            this.setState({
                allEmpData: res.data.view.data,
                loaded: true,
                login_user_role : userInfo?.roles[0]
            })
        }
    }
    async loadSecurityEmployees() {
        // let employeeFilterData = this.state.employeeFilterData
        this.setState({ loaded: false })
        let res = await EmployeeServices.getEmployees({type:"MSD Security"})
        console.log('all pharmacist', res.data.view.data)
        if (200 == res.status) {
            this.setState({
                allSecData: res.data.view.data,
                loaded: true,
            })
        }
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

    async createDonation() {
        let formData =  this.state.formData
        console.log('formData',formData)
         let res = await DonarService.createDonation(formData)
         if (201 == res.status) {
             
             this.setState({
                 res:res.data.posted.data.id,
                 alert: true,
                 message: 'Donation Created Successfuly',
                 severity: 'success',
                 resloaded:true,
             },()=>{
                console.log('ress',res)
                window.location.href = `/donation/donation-registration-note/${this.state.res}`
             })
         } else {
             this.setState({
                 alert: true,
                 message: 'Donation Creation was Unsuccessful',
                 severity: 'error',
             })
         }
     }
    render(){
        const { classes } = this.props
        return(
            <LoonsCard>
                <CardTitle title="Donation Registration"/>
                <div className="pt-7"></div>
                <ValidatorForm
                    className="pt-2"
                    onSubmit={() => this.createDonation()}
                    onError={() => null}
                 >
                    <LoonsCard>
                        <Grid container={2}>
                        {/* <Grid item lg={5} md={4} sm={12} xs={12} >
                                <SubTitle title={"Donation ID"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Donation ID"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donation_id
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donation_id = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                                'required',
                                            ]}
                                            errorMessages={[
                                                'This field is required',                                                
                                            ]}
                                />

                            </Grid> */}

                            <Grid item lg={5} md={4} sm={12} xs={12} className='ml-4'>
                                <SubTitle title={"Donor Name"}></SubTitle>
                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        this.state.allDonorData
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let formData = this.state.formData
                                                            formData.donor_name = value.name
                                                            formData.donor_id = value.id
                                                            formData.donation_country = value.country
                                                            console.log("form",formData)
                                                            this.setState(
                                                                {
                                                                    formData
                                                                }
                                                            )
                                                        }
                                                        else{
                                                            let formData = this.state.formData
                                                            formData.donor_name =null
                                                            formData.donation_country =null
                                                            this.setState({
                                                                formData
                                                            })
                                                        }
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.name
                                                    }
                                                   
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Please type 3 letters or more of the Donor name"
                                                            //variant="outlined"
                                                            value={this.state.formData.donor_name}
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
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'This field is required',                                                
                                                            ]}
                                                        />
                                                    )}
                                                />


                            </Grid>
                            <Grid item className="mt-7 ml-2">
                            <Button
                                    // className={classes.Dialogroot}
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    onClick={() => { this.setState({ donorRegistration: true }) }}
                                >
                                    <span className="capitalize">Add</span>
                                </Button>
                              
                                <Dialog maxWidth="lg " open={this.state.donorRegistration} >
                                <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                                <CardTitle title="Donor Registration" />
                        <IconButton aria-label="close" className={classes.closeButton}
                        onClick={() => {
                            this.setState({ 
                                donorRegistration: false
                               
                            })
                        }}
                           >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                                <div className="w-full h-full px-5 py-5">
                                    <DonorRegistration/>
                                </div>
                            </Dialog>
                            </Grid>


                        </Grid>

                            </LoonsCard>
                            {this.state.formData.donation_country != null? 
                                                    <Grid container spacing={2} className='mt-2'>
                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                        <SubTitle title={"Donor Country"}></SubTitle>
                                                        <Autocomplete
                                        disableClearable
                                                                            className="w-full"
                                                                            // options={
                                                                            //     appConst.Country_list
                                                                            // }
                                                                            value={appConst.Country_list.filter((obj) => obj.name === this.state.formData.donation_country)[0]}
                                                                            options={ appConst.Country_list}
                                                                            onChange={(e, value) => {
                                                                                if (null != value) {
                                                                                    let formData = this.state.formData
                                                                                    formData.donation_country = value.name
                                                                                    this.setState(
                                                                                        {
                                                                                            formData
                                                                                        }
                                                                                    )
                                                                                }
                                                                                else{
                                                                                    let formData = this.state.formData
                                                                                    formData.donation_country = null
                                                                                    this.setState(
                                                                                        {
                                                                                            formData
                                                                                        }
                                                                                    )
                                                                                }
                                                                            }}
                                                                            getOptionLabel={(option) =>
                                                                                option.name
                                                                            }
                                                                           
                                                                            renderInput={(params) => (
                                                                                <TextValidator
                                                                                    {...params}
                                                                                    placeholder="Select Country"
                                                                                    //variant="outlined"
                                                                                    // value={this.formData.donation_country}
                                                                                    fullWidth
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    value={appConst.Country_list.filter((obj) => obj.name === this.state.formData.donation_country)[0]}
                                                                                    validators={[
                                                                                        'required',
                                                                                    ]}
                                                                                    errorMessages={[
                                                                                        'This field is required',                                                
                                                                                    ]}
                                                                                />
                                                                            )}
                                                                        />
                        
                                                    </Grid>
                        
                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                        <SubTitle title={"Donation Received Date"}></SubTitle>
                                                        <DatePicker
                                                                    className="w-full"
                                                                    value={this.state.formData.received_date}
                                                                    //label="Date From"
                                                                    placeholder="Enter Donation Received Date"
                                                                    // minDate={new Date()}
                                                                    maxDate={new Date()}
                                                                    required={true}
                                                                    errorMessages="this field is required"
                                                                    onChange={date => {
                                                                        let formData = this.state.formData;
                                                                        formData.received_date =  dateParse(date);
                                                                        this.setState({ formData })
                        
                                                                    }}
                                                                />
                        
                                                    </Grid>
                        
                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                        <SubTitle title={"Delivery Person"}></SubTitle>
                                                        <TextValidator
                                                            className='w-full'
                                                            placeholder="Enter Delivery Person"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .delivery_person
                                                            }
                                                            onChange={(e, value) => {
                                                                let formData = this.state.formData;
                                                                formData.delivery_person = e.target.value
                                                                this.setState({ formData })
                        
                                                            }}
                                                            validators={[
                                                                        'required',
                                                                    ]}
                                                                    errorMessages={[
                                                                        'This field is required',                                                
                                                                    ]}
                                                        />
                        
                                                    </Grid>
                        
                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                    <SubTitle title={"Delivery Person Contact No"}></SubTitle>
                                                        <TextValidator
                                                            className='w-full'
                                                            placeholder="Enter Delivery Person Contact No"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .delivery_person_contact_no
                                                            }
                                                            onChange={(e, value) => {
                                                                let formData = this.state.formData;
                                                                formData.delivery_person_contact_no = e.target.value
                                                                this.setState({ formData })
                        
                                                            }}
                                                            validators={['required', "matchRegexp:((^|, )((0)[0-9]{9}|(7)[0-9]{8}))+$"]}
                                                            errorMessages={[
                                                                'This field is required', "Enter a valid Contact Number(Eg:0712345678 or 712345678)"
                                                            ]}
                                                        />
                        
                                                    </Grid>
                        
                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                        <SubTitle title={"Donor's Invoice No"}></SubTitle>
                                                        <TextValidator
                                                            className='w-full'
                                                            placeholder="Enter Donor's Invoice No"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .donors_invoice_no
                                                            }
                                                            onChange={(e, value) => {
                                                                let formData = this.state.formData;
                                                                formData.donors_invoice_no = e.target.value
                                                                this.setState({ formData })
                        
                                                            }}
                                                            validators={[
                                                                        'required',
                                                                    ]}
                                                                    errorMessages={[
                                                                        'This field is required',                                                
                                                                    ]}
                                                        />
                        
                                                    </Grid>
                        
                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                    <SubTitle title={"Donor's Invoice Date"}></SubTitle>
                                                    <DatePicker
                                                        className="w-full"
                                                        value={this.state.formData.donors_invoice_date}
                                                        //label="Date From"
                                                        placeholder="Enter Donation Received Date"
                                                        // minDate={new Date()}
                                                        maxDate={new Date()}
                                                        // required={true}
                                                        // errorMessages="this field is required"
                                                        onChange={date => {
                                                            let formData = this.state.formData;
                                                            formData.donors_invoice_date = dateParse(date);
                                                            this.setState({ formData })
                        
                                                        }}
                                                    />
                        
                                                    </Grid>
                        
                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                        <SubTitle title={"Receiving Officer Name"}></SubTitle>
                                                        <Autocomplete
                                        disableClearable
                                                                            className="w-full"
                                                                            options={
                                                                                this.state.allEmpData
                                                                            }
                                                                            onChange={(e, value, r) => {
                                                                                console.log(
                                                                                    'value',
                                                                                    value
                                                                                )
                                                                                if (null != value) {
                                                                                    let formData = this.state.formData
                                                                                    formData.receiving_officer = value.id
                                                                                    this.setState({
                                                                                        formData,
                                                                                    })
                                                                                }
                                                                            }}
                                                                            getOptionLabel={(option) =>
                                                                                option.name
                                                                            }
                                                                            renderInput={(params) => (
                                                                                <TextValidator
                                                                                    {...params}
                                                                                    placeholder="Receiving Officer Name"
                                                                                    fullWidth
                                                                                    value={this.state.formData.receiving_officer}
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    validators={[
                                                                                        'required',
                                                                                    ]}
                                                                                    errorMessages={[
                                                                                        'This field is required',                                                
                                                                                    ]}
                                                                                    
                                                                                />
                                                                            )}
                                                                        />
                        
                                                    </Grid>
                        
                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                        <SubTitle title={"Security Officer Name"}></SubTitle>
                                                       
                                                       {this.state.login_user_role === 'Chief Pharmacist' ?
                                                        <Autocomplete
                                                        disableClearable
                                                            className="w-full"
                                                            options={
                                                                this.state.allSecData
                                                            }
                                                            onChange={(e, value, r) => {
                                                                console.log(
                                                                    'value',
                                                                    value
                                                                )
                                                                if (null != value) {
                                                                    let formData = this.state.formData
                                                                    formData.security_officer_name = value.id
                                                                    this.setState({
                                                                        formData,
                                                                    })
                                                                }
                                                            }}
                                                            getOptionLabel={(option) =>
                                                                option.name
                                                            }
                                                            renderInput={(params) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="Security Officer Name"
                                                                    fullWidth
                                                                    value={this.state.formData.security_officer_name}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    
                                                                    
                                                                />
                                                            )}
                                                        />
                                                    
                                                        :
                                                        <Autocomplete
                                                        disableClearable
                                                            className="w-full"
                                                            options={
                                                                this.state.allSecData
                                                            }
                                                            onChange={(e, value, r) => {
                                                                console.log(
                                                                    'value',
                                                                    value
                                                                )
                                                                if (null != value) {
                                                                    let formData = this.state.formData
                                                                    formData.security_officer_name = value.id
                                                                    this.setState({
                                                                        formData,
                                                                    })
                                                                }
                                                            }}
                                                            getOptionLabel={(option) =>
                                                                option.name
                                                            }
                                                            renderInput={(params) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="Security Officer Name"
                                                                    fullWidth
                                                                    value={this.state.formData.security_officer_name}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    validators={[
                                                                        'required',
                                                                    ]}
                                                                    errorMessages={[
                                                                        'This field is required',                                                
                                                                    ]}
                                                                    
                                                                />
                                                            )}
                                                        />
                                                        
                                                        }
                                                       
                        
                                                    </Grid>
                        
                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                        <SubTitle title={"Co-ordinated By"}></SubTitle>
                                                        <TextValidator
                                                            className='w-full'
                                                            placeholder="Co-ordinated By"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .co_ordinated_by
                                                            }
                                                            onChange={(e, value) => {
                                                                let formData = this.state.formData;
                                                                formData.co_ordinated_by = e.target.value
                                                                this.setState({ formData })
                        
                                                            }}
                                                            // validators={[
                                                            //             'required',
                                                            //         ]}
                                                            //         errorMessages={[
                                                            //             'This field is required',                                                
                                                            //         ]}
                                                        />
                        
                        
                                                    </Grid>
                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                        <SubTitle title={"Co-ordinator Contact No"}></SubTitle>
                                                        <TextValidator
                                                            className='w-full'
                                                            placeholder="Co-ordinator Contact No"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .co_ordinater_contactNo
                                                            }
                                                            onChange={(e, value) => {
                                                                let formData = this.state.formData;
                                                                formData.co_ordinater_contactNo = e.target.value
                                                                this.setState({ formData })
                        
                                                            }}
                                                            // validators={[
                                                            //             'required',
                                                            //         ]}
                                                            //         errorMessages={[
                                                            //             'This field is required',                                                
                                                            //         ]}
                                                        />
                        
                        
                                                    </Grid>
                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                        <SubTitle title={"Co-ordinator Email"}></SubTitle>
                                                        <TextValidator
                                                            className='w-full'
                                                            placeholder="Co-ordinator Email"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .co_ordinater_email
                                                            }
                                                            onChange={(e, value) => {
                                                                let formData = this.state.formData;
                                                                formData.co_ordinater_email = e.target.value
                                                                this.setState({ formData })
                        
                                                            }}
                                                            // validators={['required', 'isEmail']}
                                                            // errorMessages={[
                                                            //         'This field is required',
                                                            //         'Please enter a valid Email Address'
                                                            //     ]}
                                                        />
                        
                        
                                                    </Grid>


                        
                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                        <SubTitle title={"Description"}></SubTitle>
                                                        <TextValidator
                                                            className='w-full'
                                                            placeholder="Enter Description"
                                                            fullWidth
                                                            name="description"
                                                            multiline
                                                            rows={4}
                                                            type="text"
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .description
                                                            }
                                                            onChange={(e, value) => {
                                                                let formData = this.state.formData;
                                                                formData.description = e.target.value
                                                                this.setState({ formData })
                        
                                                            }}
                                                            // validators={[
                                                            //             'required',
                                                            //         ]}
                                                            //         errorMessages={[
                                                            //             'This field is required',                                                
                                                            //         ]}
                                                        />
                        
                                                    </Grid>
                        
                                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Button
                                                            className="mr-2 mt-7"
                                                            progress={false}
                                                            type="submit"
                                                            scrollToTop={true}
                                                            
                                                            // onClick={() => 
                                                            //     {this.state.resloaded?`:null}
                                                            //     // {}
                                                            // }
                                                        >
                                                            
                                                            <span className="capitalize">Next</span>
                                                        </Button>
                                                    </Grid>  
                        
                                                </Grid>
                        
                            
                            :null}

                    </ValidatorForm>
            </LoonsCard>
        )
    }
}

export default withStyles(styleSheet)(DonationRegistration)