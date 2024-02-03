import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    CircularProgress,
    InputAdornment,
    Dialog,
    MuiDialogContent,
    MuiDialogActions,
    Typography,
    //Accordion,
    AccordionDetails,
    AccordionSummary,
    Tabs,
    Tab
} from '@material-ui/core'
import * as appConst from '../../../../appconst';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiAccordion from "@material-ui/core/Accordion";
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import { MatxLayoutSettings } from "app/components/MatxLayout/settings";
import clsx from 'clsx';

import { themeColors } from "app/components/MatxTheme/themeColors";
import SearchIcon from '@material-ui/icons/Search';
import { dateParse, dateTimeParse } from "../../../../utils"
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';



import localStorageService from 'app/services/localStorageService';
import VehicleService from 'app/services/VehicleService';
import HospitalConfigServices from 'app/services/HospitalConfigServices'
import moment from "moment";

const drawerWidth = 55;
let activeTheme = MatxLayoutSettings.activeTheme;


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
        //marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: -80,
    },
})


const Accordion = withStyles({
    root: {
        "&$expanded": {
            margin: "auto"
        }
    },
    expanded: {}
})(MuiAccordion);

class VehicleCheckInOut extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: '',
            severity: "error",
            formData: {
                arrival_time: null,
                confirm_type: null,
                reg_no: null,
                required_date: null
            },
            reg_no:{
                first:null,
                mid:null,
                end:null
            },


        }
    }


    async checkIn() {
        let formData = this.state.formData;
        let nowTime = new Date();
        formData.arrival_time = dateTimeParse(nowTime)
        formData.required_date = dateParse(nowTime)
        formData.confirm_type = "Arrived"
        formData.reg_no = this.state.reg_no.first+this.state.reg_no.mid+this.state.reg_no.end

        if (formData.reg_no == null || formData.reg_no == "") {
            this.setState({
                alert: true,
                message: 'Please Enter Vehicle Registration Number',
                severity: "error"
            })
        } else {
            let res = await VehicleService.msdVehicleInOut(formData)
            console.log("res", res.response)
            if (res.status && res.status == 201) {
                this.setState({
                    formData,
                    alert: true,
                    message: 'Vehicle Check In Successfully',
                    severity: 'success',
                },()=>{window.location.reload()})

            } else {
                this.setState({
                    formData,
                    alert: true,
                    message: res.response.data.error,
                    severity: 'error',
                })
            }

        }
    }

    async checkOut() {
        let formData = this.state.formData;
        let nowTime = new Date();
        formData.arrival_time = dateTimeParse(nowTime)
        formData.required_date = dateParse(nowTime)
        formData.confirm_type = "Departured"
        if (formData.reg_no == null || formData.reg_no == "") {
            this.setState({
                alert: true,
                message: 'Please Enter Vehicle Registration Number',
                severity: "error"
            })
        } else {
            let res = await VehicleService.msdVehicleInOut(formData)
            console.log("res", res.response)
            if (res.status && res.status == 201) {
                this.setState({
                    alert: true,
                    message: 'Vehicle Check Out Successfully',
                    severity: 'success',
                }
                ,()=>{window.location.reload()}
                )

            } else {

                this.setState({
                    alert: true,
                    message: res.response.data.error,
                    severity: 'error',
                })
            }

        }
    }




    async componentDidMount() {

    }



    render() {
        let { theme } = this.props
        const { classes } = this.props
        //const elmRef = useAutocompleteInputClear(value, v => !v || !v.id)
        return (
            <Fragment>
                <div className={classes.root}>

                    <main className={clsx(classes.content, 'px-3')}>
                        <div className={classes.drawerHeader} />


                        <Grid container className='w-full flex justify-center align-middle'>


                            <Grid item lg={6} md={6} xs={6}>
                                <Grid container className='w-full flex justify-center align-middle'>
                                    <Grid item lg={6} md={6} xs={6}>
                                        <img
                                            className="w-300"
                                            src="/assets/images/swastha_logo _full_height.png"
                                            alt=""
                                        />
                                    </Grid >
                                </Grid>

                                <ValidatorForm

                                    onError={() => null}
                                    className="w-full"
                                >
                                                                     <Grid container spacing={1} className="flex ">
                                     <Grid
                                    className=" w-full mt-5" item lg={4} md={4} sm={4} xs={4}
                                >
                                    
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Eg:- 2/252/PD"
                                        name="reg_no"
                                        InputLabelProps={{shrink: false}}
                                        value={this.state.reg_no.first}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        inputProps={{
                                            maxLength: 3,
                                          }}
                                        onChange={(e) => {
                                            let reg_no =this.state.reg_no
                                            reg_no.first =e.target.value.trim()
                                            this.setState({reg_no})
                                        }}
                                        validators={['required'
                                        // , 'matchRegexp:^([a-zA-Z]{1,3}|((?!0*-)[0-9]{1,3}))-[0-9]{4}(?<!0{4})'
                                    ]}
                                        errorMessages={['This field should be required!'
                                        // ,'Please Enter in Correct number format'
                                    ]}
                                    />
                                </Grid>
                                <Grid
                                                                    className=" w-full" item lg={4} md={4} sm={4} xs={4}
                                                                 >
                                                                    <SubTitle className='ml-2' title="Vehicle Registration Number"/>
                                                                   <Autocomplete
                                        disableClearable
                                                                         className="w-full"
                                                                         options={appConst.vehicle_mid_no}
                                                                        //  value={this.state.buttonName=='update'?appConst.vehicle_mid_no.filter((e) => 
                                                                        //  e.value == this.state.reg_no.mid):this.state.reg_no.mid
                                                                             
                                                                        //  }
                                                                         onChange={(e, value, r) => {
                                                                             if (null != value) {
                                                                                let reg_no = this.state.reg_no
                                                                                reg_no.mid=value.value
                                                                                 this.setState({reg_no})
                                                                             }
                                                                         }}
                                                                         // value={this.state.vehicleTypesData.find((v) => v.id === this.state.formData.vehicle_type_id)}
                                                                         getOptionLabel={
                                                                             (option) => option.label
                                                                         }
                                                                         renderInput={(params) => (
                                                                             <TextValidator
                                                                                 {...params}
                                                                                 placeholder="Select ශ්‍රී / -"
                                                                                 fullWidth
                                                                                 variant="outlined"
                                                                                 size="small"
                                                                             />
                                                                         )}
                                                                     />
                                                                 </Grid>                               
                                                                   
                                 
                               
                                <Grid
                                   className="" item lg={4} md={4} sm={4} xs={4}
                                >
                                   
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Eg:- 3428"
                                        name="reg_no"
                                        InputLabelProps={{shrink: false}}
                                        value={this.state.reg_no.end}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        inputProps={{
                                            maxLength: 4,
                                          }}
                                        
                                        onChange={(e) => {
                                            let reg_no =this.state.reg_no
                                            reg_no.end =e.target.value.trim()
                                            this.setState({reg_no},
                                                console.log("num",this.state.reg_no.first+" "+this.state.reg_no.mid+" "+
                                                this.state.reg_no.end))
                                        }}
                                        validators={['required','isNumber',
                                        
                                        // , 'matchRegexp:^([a-zA-Z]{1,3}|((?!0*-)[0-9]{1,3}))-[0-9]{4}(?<!0{4})'
                                    ]}
                                        errorMessages={['This field should be required!','Please enter a number',
                                       
                                        // ,'Please Enter in Correct number format'
                                    ]}
                                    />
                                </Grid>


                                    </Grid>
        



                                    {/* <TextValidator
                                        className='mt--1'
                                        autoFocus={true}
                                        placeholder="Vehicle Reg No"
                                        //variant="outlined"
                                        fullWidth
                                        variant="outlined"
                                        size="Normal"
                                        value={
                                            this.state.formData.reg_no
                                        }
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            formData.reg_no = e.target.value
                                            this.setState({ formData })
                                        }}
                                   
                                    /> */}

                                </ValidatorForm>

                                <Grid container className='w-full flex justify-center align-middle mt-3'>

                                    <Grid item>
                                        <Button
                                            className="mx-1 "
                                            progress={false}
                                            scrollToTop={false}
                                            //startIcon="search"
                                            onClick={() => {
                                                this.checkIn()
                                            }}
                                        >
                                            <span className="capitalize">Check In</span>
                                        </Button>

                                    </Grid>
                                    <Grid item>
                                        <Button
                                            className="mx-1 "
                                            progress={false}
                                            scrollToTop={false}
                                            //startIcon="search"
                                            onClick={() => {
                                                this.checkOut()
                                            }}
                                        >
                                            <span className="capitalize">Check Out</span>
                                        </Button>

                                    </Grid>



                                </Grid>




                                <Grid container className='w-full flex justify-center align-middle'>
                                    {/*  <img
                className="w-130"
                style={{width:150,marginTop:50}}
                src="/assets/images/ministry_logo.png"
                alt=""

            /> */}
                                </Grid>

                            </Grid>
                        </Grid>






                    </main>
                </div>

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

export default withStyles(styleSheet)(VehicleCheckInOut)
