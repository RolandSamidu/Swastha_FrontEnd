import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@material-ui/icons/Visibility'
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
    Tooltip,
    //Accordion,
    AccordionDetails,
    AccordionSummary,
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import EditIcon from '@material-ui/icons/Edit'
// import Registration from './Registration';
import MuiAccordion from '@material-ui/core/Accordion'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import clsx from 'clsx'
import { merge } from 'lodash'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import { themeColors } from 'app/components/MatxTheme/themeColors'
import SearchIcon from '@material-ui/icons/Search'
import DashboardServices from 'app/services/DashboardServices'
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
// import Admission from './Admission';

import * as appConst from '../../../appconst'
import PatientServices from 'app/services/PatientServices'
import DivisionsServices from 'app/services/DivisionsServices'
import localStorageService from 'app/services/localStorageService'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation'
import CancelIcon from '@material-ui/icons/Cancel'
// import Transfer from './Transfer';
// import Discharge from './Discharge';

import * as Util from '../../../utils'
const drawerWidth = 270
let activeTheme = MatxLayoutSettings.activeTheme

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

const Accordion = withStyles({
    root: {
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion)

class MROLoginToEIMMR extends Component {
    
    constructor(props) {
        
        super(props)
        this.state = {
            formData: {
                key: null,
                hospital_id:'b820a0ff-ea1a-4e79-af53-727e69c2042b'
            },
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
                //     this.searchPatients()
            }
        )
    }
    async submit() {
        // var user = await localStorageService.getItem('userInfo');
        console.log("formdata", this.state.formData)
        // formData.hospital_id = user
         let formData = this.state.formData
        let res = await PatientServices.sendingEMMR(formData)
        console.log("formdata", this.state.formData)
        console.log("EMMR code", res)
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'EMMR Code sent succesfully',
                severity: 'success',
            }, () => {
                window.location.href=`/mro/patients/emmrsearch`
            })
        }
    }

    componentDidMount() {}

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Send Key to EMMIR" />
                        <LoonsCard>
                            <ValidatorForm
                                className="mb-5 mt-10 pt-5 px-2 border-radius-4 w-full"
                                onSubmit={() => this.submit()}
                                onError={() => null}
                                // style={{ backgroundColor: '#f1f3f4' }}
                            >
                               <Grid className="mt-5"
                                 container
                                 spacing={0}
                                 direction="column"
                                 alignItems="center"
                                 justifyContent="center"
                                 style={{ minHeight: '20vh' }}>
                                   
                                  
                                    <SubTitle title="Session key" />
                                    <Grid
                                        className="ml-2 w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <TextValidator
                                            className="w-full"
                                            placeholder="Session key"
                                            name="session_key"
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            value={
                                                this.state.formData.key
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                this.setState({
                                                    formData: {
                                                        ...this.state.formData,
                                                        key:
                                                            e.target.value,
                                                    },
                                                })
                                            }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>
                                    <Grid item>
                            <Button
                                className="text-right ml-1 mt-4"
                                progress={false}
                                scrollToTop={false}
                                type='submit'
                              //   startIcon="search"
                                // onClick={() => { this.handleSearchButton() }}
                            >
                                <span className="capitalize">Send To EMMIR</span>
                            </Button>
                            </Grid>
                                </Grid>
                                   
                                    <Grid container={3}>
                              {/* <Grid item> */}
                               {/* <Button
                                className="text-right ml-1 mt-4"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                              //   startIcon="print"
                              //   onClick={() => { this.handleSearchButton() }}
                            >
                                <span className="capitalize"> Send To EMMIR V4</span>
                            </Button> */}
                            {/* </Grid> */}
                          
                            {/* <Grid item>
                            <Button
                                className="text-right ml-1 mt-4"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                              //   startIcon="logout"
                                onClick={() => { this.handleSearchButton() }}
                            >
                                <span className="capitalize">Reconfirm/Decline</span>
                            </Button>
                            </Grid>            */}
                                       
                         

                                    </Grid>
                                <Grid
                        className=" w-full"
                        item
                        lg={3}
                        md={3}
                        sm={12}
                        xs={12}
                    >
                    </Grid>


                             
                            </ValidatorForm>
                        </LoonsCard>
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

export default withStyles(styleSheet)(MROLoginToEIMMR)
