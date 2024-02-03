import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Card,
    Icon,
    Box,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
    Typography,
    TextField,
    Fab,
    Drawer,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactGridLayout from 'react-grid-layout'
import { Responsive, WidthProvider } from "react-grid-layout";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import FaceIcon from '@material-ui/icons/Face';

/* import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout"; */



import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings'
import DoneIcon from '@material-ui/icons/Done';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import 'date-fns'
import { Resizable } from 'react-resizable';
import { ResizableBox } from 'react-resizable';

import { LoonsTable, Charts, DatePicker, FilePicker, Button, ExcelToTable, LoonsSnackbar, SubTitle, Widget, WidgetComponent, CanvasDraw } from "app/components/LoonsLabComponents";

import WidgetService from "app/services/WidgetService";
import DashboardServices from "app/services/DashboardServices";
import localStorageService from "app/services/localStorageService";
import EmployeeServices from "app/services/EmployeeServices";

const styleSheet = ((theme) => ({
    drawer: {

        [theme.breakpoints.down('sm')]: {
            width: 300
        },
        [theme.breakpoints.up('md')]: {
            width: 500
        },
        [theme.breakpoints.up('lg')]: {
            width: 600
        },
    },
}));


const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 6,
        slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 4,
        slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
    }
};

const ResponsiveGridLayout = WidthProvider(Responsive);
class SmartDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: 250,
            height: 200,
            isEdit: false,
            speedDialOpen: false,
            resizeActioning: false,
            panelOpen: false,
            widgetTypes: [],
            all_Dashboard: [],
            all_clinics: [],
            widgetSet_forSelect: [],
            selectedWidgets: [],
            layoutDatSet: {
                lg: [],
                /* sm: [
                    { i: "a", x: 0, y: 0, w: 1, h: 1, static: true },
                    { i: "b", x: 1, y: 0, w: 1, h: 1, minW: 2, maxW: 4 },
                    { i: "c", x: 4, y: 0, w: 1, h: 1 }
                ], */
            },
            filterData: { clinic_id: null, clinic_doctor_id: null },
            selected_dashboard: null,
            fieldEditingDialog: false,
            editingWidget: null,

            snackbar: false,
            snackbar_severity: '',
            snackbar_message: '',

            newDashboardDialogBox: false,
            dashboardName: '',
            dashboardVariables: {},
            loading: true,
            loadFromCloud: false,

            newDashboardFromClinicDialogBox: false,
            editedDashboardName: null,
        }
    }


    // On top layout
    onResize = (event, { element, size, handle }) => {
        this.setState({ width: size.width, height: size.height });
    };
    handleDrawerToggle() {
        this.setState({ panelOpen: !this.state.panelOpen, isEdit: true })
    }
    handleSpeedDial() {
        this.setState({ speedDialOpen: !this.state.speedDialOpen })
    }
    async save() {
        this.setState({
            isEdit: false
        })

        console.log('dash', this.state.selected_dashboard)
        //
        let data = { "component": [{ widgets: this.state.selectedWidgets, layout: this.state.layoutDatSet }] }

        if (this.state.selected_dashboard.clinic_doctor_id == null) {
            this.setState({
                newDashboardFromClinicDialogBox: true,
            })
        } else {
            let res = await DashboardServices.editDashboard(data, this.state.selected_dashboard.dashboard_id);
            console.log("res", res)
            if (res.status == 200) {
                console.log("res", res)
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'success',
                    snackbar_message: "Successfully Saved Dashboard"
                })
            }
        }


    }


    handleNewDashboard() {
        if (this.state.filterData.clinic_id == null) {

            this.setState({
                snackbar: true,
                snackbar_severity: 'error',
                snackbar_message: "Please Select Clinic First"
            })
        } else {
            this.setState({
                newDashboardDialogBox: true
            })
        }
    }

    async createNewDashboardFromClinic() {
        var user = await localStorageService.getItem('userInfo');
        var owner_id = await localStorageService.getItem('owner_id');
        var login_user_Clinic_prescription = await localStorageService.getItem('Login_user_Clinic_prescription');

        console.log('user', user)

        var id = user.id
        let data = {
            "displayName": this.state.editedDashboardName,
            "type": "clinic",
            "clinic_id": '',
            "owner_id": owner_id,
            //"clinic_doctor_id":id,
            "isDefault": false,
            "component": [{ widgets: this.state.selectedWidgets, layout: this.state.layoutDatSet }]
        }
        data.displayName = this.state.editedDashboardName;
        data.clinic_id = this.state.filterData.clinic_id;

        var doctor_id = user.id
        if (user.roles.includes('Clinic Admin')) {
        } else {
            data.clinic_doctor_id = login_user_Clinic_prescription.clinic_doctor_id
        }
        console.log("save data", data)
        let res = await DashboardServices.createDashboard(data);
        console.log("res", res)
        if (res.status == 201) {
            console.log("res", res)
            this.setState({
                snackbar: true,
                snackbar_severity: 'success',
                snackbar_message: "Successfully Saved Dashboard",
                newDashboardFromClinicDialogBox: false
            }, () => {
                this.getAllDashboards(this.state.filterData.clinic_id)
            })
        }

    }



    async createNewDashboard() {
        var user = await localStorageService.getItem('userInfo');
        var owner_id = await localStorageService.getItem('owner_id');
        var login_user_Clinic_prescription = await localStorageService.getItem('Login_user_Clinic_prescription');

        console.log('user', user)

        var id = user.id
        let data = {
            "displayName": '',
            "type": "clinic",
            "clinic_id": '',
            "owner_id": owner_id,
            //"clinic_doctor_id":id,
            "isDefault": false,
            // "component": [{ widgets: this.state.selectedWidgets, layout: this.state.layoutDatSet }]
        }
        data.displayName = this.state.dashboardName;
        data.clinic_id = this.state.filterData.clinic_id;

        var doctor_id = user.id
        if (user.roles.includes('Clinic Admin')) {
        } else {
            data.clinic_doctor_id = login_user_Clinic_prescription.clinic_doctor_id
        }
        let res = await DashboardServices.createDashboard(data);
        console.log("res", res)
        if (res.status == 201) {
            console.log("res", res)
            this.setState({
                snackbar: true,
                snackbar_severity: 'success',
                snackbar_message: "Successfully Saved Dashboard",
                newDashboardDialogBox: false
            }, () => {
                this.getAllDashboards(this.state.filterData.clinic_id)
            })
        }

    }


    async getAllWidgetTypes() {
        let params = { limit: 1000, type: 'clinic' }
        let widgetTypes = await WidgetService.getAllWidgetTypes(params);
        if (widgetTypes.status == 200) {
            console.log("widgets types", widgetTypes.data.view.data)
            this.setState({ widgetTypes: widgetTypes.data.view.data })
        }

    }

    async getWidgetsSet(val) {
        let params = { limit: 1000, widget_type_id: val.id }
        let widgets = await WidgetService.getAllWidget(params);
        if (widgets.status == 200) {
            console.log("widgets", widgets.data.view.data)
            this.setState({ widgetSet_forSelect: widgets.data.view.data })
        }
    }

    async selectingWidget(widget) {
        let selectedWidgets = this.state.selectedWidgets;


        if (!selectedWidgets.includes(widget)) {
            selectedWidgets.push(widget)

            setTimeout(() => {
                this.addLayout(widget.id)
            }, 500);

        } else {
            this.setState({
                snackbar: true,
                snackbar_severity: 'error',
                snackbar_message: "Selected Widget is Exit on Dashboard"
            })
        }

        this.setState({ selectedWidgets })
    }



    async removeWidget(widget) {
        let selectedWidgets = this.state.selectedWidgets;
        if (selectedWidgets.includes(widget)) {
            let index = selectedWidgets.indexOf(widget)
            selectedWidgets.splice(index, 1)

            setTimeout(() => {
                this.removeLayout(widget.id)
            }, 500);

        } else {
            this.setState({
                snackbar: true,
                snackbar_severity: 'error',
                snackbar_message: "Selected Widget is not Exit on Dashboard"
            })
        }

        this.setState({ selectedWidgets })
    }

    async addLayout(widgetId) {
        let layoutDatSet = this.state.layoutDatSet;
        const index = layoutDatSet.lg.findIndex(object => {
            return object.i === widgetId.toString();
        });
        //layoutDatSet.lg.push({ i: widgetId.toString(), x: 0, y: 0, w: 50, h: 20 })

        layoutDatSet.lg[index] = { i: widgetId.toString(), x: 0, y: 0, w: 9, h: 4 }
        this.setState({ layoutDatSet })
        console.log("layput", this.state.layoutDatSet)
    }

    async removeLayout(widgetId) {
        let layoutDatSet = this.state.layoutDatSet;
        const index = layoutDatSet.lg.findIndex(object => {
            return object.i === widgetId.toString();
        });
        //layoutDatSet.lg.push({ i: widgetId.toString(), x: 0, y: 0, w: 50, h: 20 })

        layoutDatSet.lg.splice(index, 1);
        this.setState({ layoutDatSet })
        console.log("layput", this.state.layoutDatSet)
    }

    async handleVisibilityOfField(widget, field) {
        let selectedWidgets = this.state.selectedWidgets;
        let selectedWidgetIndex = selectedWidgets.indexOf(widget);
        let selectedFieldIndex = selectedWidgets[selectedWidgetIndex].component.indexOf(field);

        selectedWidgets[selectedWidgetIndex].component[selectedFieldIndex].displayInSmallView = !selectedWidgets[selectedWidgetIndex].component[selectedFieldIndex].displayInSmallView;

        this.setState({ selectedWidgets }, () => {
            console.log("selec", this.state.selectedWidgets);
        })
    }

    async getAllClinics() {

        let params = { limit: 1000 }
        let clinics = await DashboardServices.getAllClinics(params, '001');
        if (clinics.status == 200) {
            console.log("clinics", clinics.data.view.data)
            this.setState({ all_clinics: clinics.data.view.data })
        }

    }


    async getAllDashboards(clinic_id) {
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var owner_id = await localStorageService.getItem('owner_id');
        var login_user_Clinic_prescription = await localStorageService.getItem('Login_user_Clinic_prescription');
        console.log('cheking login_user_Clinic_prescription', login_user_Clinic_prescription)
        let doctor_id = user.id;

        let params = { limit: 1000, clinic_id: clinic_id, owner_id: owner_id, clinic_doctor_id: login_user_Clinic_prescription?.clinic_doctor_id }
        console.log('cheking params', params)
        let dashboards = await DashboardServices.getAllDashboardsAssignings(params);
        console.log("dashboards-1", dashboards)
        if (dashboards.status == 200) {
            console.log("dashboards", dashboards)
            this.setState({
                all_Dashboard: dashboards.data.view.data,
                selected_dashboard: dashboards.data.view.data.filter((ele) => ele.isDefault == true)[0]
            }, () => {
                this.getSingleDashboard()
            })


        }

    }

    async getSingleDashboard() {

        console.log('cheking data', this.state.selected_dashboard)
        let dashboard = await DashboardServices.getDashboardByID(this.state.selected_dashboard?.id);
        this.setState({
            selectedWidgets: [],
            layoutDatSet: { lg: [] },
            isEdit: false
        })
        if (dashboard.status == 200) {
            // console.log("dashboard widget", dashboard.data.view.component[0].widgets)
            // console.log("dashboard layout", dashboard.data.view.component[0].layout)
            if (dashboard.data.view != null && dashboard.data.view.ExaminationDashboard.component != null) {
                if (dashboard.data.view.ExaminationDashboard.component[0].widgets && dashboard.data.view.ExaminationDashboard.component[0].layout)
                    this.setState({
                        selectedWidgets: dashboard.data.view.ExaminationDashboard.component[0].widgets,
                        layoutDatSet: dashboard.data.view.ExaminationDashboard.component[0].layout,
                        isEdit: false
                    })
            }
        }
    }



    async componentDidMount() {
        let patientSummary = await localStorageService.getItem('patientSummary')
        if (patientSummary == null) {
            let patientSummaryDummy = {
                diagnosis: [],
                complaints: [],
                problemList: [],
                patientDetails: {},
            }
            localStorageService.setItem('patientSummary', patientSummaryDummy)
        }

        const query = new URLSearchParams(this.props.location.search);
        const patient_clinic_id = query.get('patient_clinic_id')
        const clinic_id = query.get('clinic_id')
        const patient_id = query.get('patient_id')

        this.getAllDashboards(clinic_id)

        let dashboardVariables = {
            'patient_id': patient_id,
            'clinic_id': clinic_id,
            'patient_clinic_id': patient_clinic_id
        }
        window.dashboardVariables = dashboardVariables;
        this.getAllWidgetTypes()
        this.getAllClinics()
        /*    let dashboard = {
               id: "69b2a0a7-844e-4441-ac6d-4b366f31690d",
               dashboard_id: "d0865518-530d-47ec-8f39-5f338f5c3874",
               status: "Active",
               type: "clinic",
               isDefault: false,
               clinic_id: "49e820de-6582-4f48-9121-8a507d5d1efc",
               clinic_doctor_id: null,
               createdAt: "2022-05-26T07:16:31.868Z",
               updatedAt: "2022-05-26T07:16:31.868Z",
               ExaminationDashboard: {
                   id: "d0865518-530d-47ec-8f39-5f338f5c3874",
                   displayName: "test2"
               }
           } */

        let filterData = this.state.filterData;
        filterData.clinic_id = clinic_id
        this.setState({
            //selected_dashboard: dashboard,
            filterData
        }, () => {
            // this.getSingleDashboard()
        })


    }
    handleLayoutChange = (layout) => {
        console.log('Layout ===>', layout)
        let layoutDatSet = this.state.layoutDatSet;
        layoutDatSet.lg = layout;
        this.setState({ layoutDatSet, resizeActioning: true }, () => {
            console.log("layout after", this.state.layoutDatSet)

        })


    }
    fieldEditingDialogClose() {
        this.setState({ fieldEditingDialog: false })
    }
    cowMounted(callbacks) {
        console.log("call", callbacks)
    }

    isUpdate() {

    }
    async loadFromChange() {

        let res = await EmployeeServices.userLoginCloud()
        console.log("cloud login res", res)
        if (res) {
            this.setState({ loading: false })
            setTimeout(() => {
                this.setState({ loadFromCloud: !this.state.loadFromCloud, loading: true })
            }, 500);
        } else {
            this.setState({
                snackbar: true,
                snackbar_severity: 'error',
                snackbar_message: "Cannot Connect to the EHR"
            })
        }


    }

    render() {
        let { theme } = this.props;
        const { classes } = this.props


        return (
            <Fragment >
                <div className="px-2 py-2">

                    <ValidatorForm>
                        <Grid container spacing={1}>

                            {/*  <Grid item lg={6} md={6} sm={12} xs={12}>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.all_clinics.filter((ele) => ele.status == "Active")}
                                    onChange={(e, value) => {
                                        if (value != null) {
                                            let filterData = this.state.filterData;
                                            filterData.clinic_id = value.id
                                            this.setState({ filterData })
                                            this.getAllDashboards(value.id)
                                        }
                                    }}
                                    value={this.state.all_clinics.find((obj) => obj.id == this.state.filterData.clinic_id
                                    )}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Clinic"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </Grid> */}

                            <Grid item lg={10} md={10} sm={10} xs={10} className="px-5">

                                <Carousel
                                    swipeable={true}
                                    draggable={true}
                                    showDots={false}
                                    responsive={responsive}
                                    ssr={false} // means to render carousel on server-side.
                                    infinite={false}
                                    autoPlay={false}
                                    arrows={false}
                                    //autoPlaySpeed={1000}
                                    keyBoardControl={true}
                                    customTransition="all .5"
                                    //transitionDuration={500}
                                    containerClass="carousel-container"
                                    removeArrowOnDeviceType={["tablet", "mobile"]}
                                    //deviceType={this.props.deviceType}
                                    dotListClass="custom-dot-list-style"
                                    itemClass="carousel-item-padding-2-px"
                                >

                                    {this.state.all_Dashboard.filter((ele) => ele.status == "Active").map((item, key) => (
                                        <Chip
                                            //icon={<FaceIcon />}
                                            label={item.ExaminationDashboard.displayName}
                                            clickable
                                            color={this.state.selected_dashboard?.id === item.id ? "primary" : "default"}
                                            //onDelete={handleDelete}
                                            onClick={() => {
                                                this.setState({ selected_dashboard: item }, () => {
                                                    this.getSingleDashboard()
                                                })

                                            }}
                                            deleteIcon={<DoneIcon />}
                                            variant="outlined"
                                        />


                                    ))
                                    }
                                </Carousel>





                                {/* <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.all_Dashboard.filter((ele) => ele.status == "Active")}
                                    onChange={(e, value) => {
                                        if (value != null) {
                                            //console.log("dashb", value)
                                            this.setState({ selected_dashboard: value }, () => {
                                                this.getSingleDashboard()
                                            })
                                        }
                                    }}
                                    value={this.state.selected_dashboard}
                                    getOptionLabel={(option) => option.ExaminationDashboard.displayName}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Dashboard"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                /> */}
                            </Grid>

                            <Grid item lg={2} md={2} sm={2} xs={2} className="px-5 flex justify-end ">
                                <Button
                                    //className="mt-2"
                                    progress={false}
                                    scrollToTop={true}
                                    //startIcon="save"
                                    onClick={() => {
                                        this.loadFromChange()

                                    }}
                                >
                                    <span className="capitalize">{this.state.loadFromCloud ? "Load From Local" : "Load From EHR"}</span>
                                </Button>

                            </Grid>




                        </Grid>

                    </ValidatorForm>


                    {/* <Charts
                        height="280px"
                        type="line"
                        data="http:dff"

                    >

                    </Charts>
 */}



























                    <ResponsiveGridLayout
                        className="layout"
                        layouts={this.state.layoutDatSet}
                        cols={{ lg: 50, md: 1, sm: 1, xs: 1, xxs: 1 }}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        isDraggable={this.state.isEdit}
                        isResizable={this.state.isEdit}
                        isBounded={this.state.isEdit}
                        rowHeight={20}
                        width={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        //autoSize={true}
                        onLayoutChange={this.handleLayoutChange}

                    >


                        {

                            this.state.selectedWidgets.map((item, i) => (

                                <Paper className="border-radius-8 w-full overflow-hidden" elevation={12} key={item.id.toString()} item  >
                                    {this.state.loading ?
                                        <WidgetComponent
                                            id={item.id}
                                            title={item.displayName}
                                            fieldset={item.component}
                                            edit={this.state.isEdit}
                                            headerColor={item.otherProps.bar_color}
                                            dashboardVariables={this.state.dashboardVariables}
                                            fullScreenVisibility={true}
                                            loadFromCloud={this.state.loadFromCloud}
                                            onClickSetting={() => {
                                                console.log("selecting", item)
                                                this.setState({
                                                    fieldEditingDialog: true,
                                                    editingWidget: item
                                                })
                                            }}
                                            onClickRemove={() => {
                                                console.log("selecting", item)
                                                this.removeWidget(item)
                                            }}
                                            onReload={() => {
                                                console.log("reload")
                                                this.setState({ loading: false })
                                                this.setState({ loading: true })
                                            }}
                                            onChange={(e) => {
                                                console.log('value', e)
                                                this.setState({ dashboardVariables: window.dashboardVariables }
                                                    , () => {
                                                        console.log("state", this.state.dashboardVariables)
                                                    })

                                            }}
                                            resizing={this.state.resizeActioning}
                                        />
                                        : null}
                                </Paper>
                            ))
                        }
                    </ResponsiveGridLayout>
                </div >




                <Drawer

                    variant="temporary"
                    anchor={'right'}
                    open={this.state.panelOpen}
                    onClose={() => { this.handleDrawerToggle() }}
                    ModalProps={{
                        keepMounted: true,
                    }}
                >
                    <Box className={classes.drawer}>
                        <div className="notification__topbar elevation-z6 flex items-center p-4">
                            <Icon color="primary">settings</Icon>
                            <h5 className="ml-2 my-0 font-medium">
                                Dashboard Setting
                            </h5>
                        </div>


                        <Grid className="px-2" item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="Dashboard Category" />
                            <ValidatorForm>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.widgetTypes.filter((ele) => ele.status == "Active")}
                                    onChange={(e, value) => {
                                        if (value != null) {
                                            this.getWidgetsSet(value)
                                        }
                                    }}
                                    /* value={dashBoardCategories.find((obj) =>obj.id ==this.state.formData.dashboardCatId
                                    )} */
                                    getOptionLabel={(option) => option.displayName}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Dashboard Category"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </ValidatorForm>
                        </Grid>

                        <div className="px-2" >
                            <SubTitle title="Widgets Set" />

                            <Grid container className="mt-2" spacing={1}>
                                {this.state.widgetSet_forSelect.map((item, i) => (
                                    <Grid key={i} item lg={6} md={6} sm={12} xs={12}>
                                        {/*  <Chip
                                            size="small"
                                            label={item.displayName}
                                            onClick={() => { this.selectingWidget(item) }}
                                            onDelete={() => { this.selectingWidget(item) }}
                                            deleteIcon={<DoneIcon />}
                                        /> */}


                                        <Paper
                                            onClick={() => { this.selectingWidget(item) }}
                                            className="border-radius-8 w-full hover_point " elevation={12} item  >

                                            <WidgetComponent
                                                id={item.id}
                                                title={item.displayName}
                                                fieldset={item.component}
                                                headerColor={item.otherProps.bar_color}
                                                edit={false}
                                                fullScreenVisibility={false}
                                                onClickSetting={() => {

                                                }}
                                            />

                                        </Paper>


                                    </Grid>
                                ))}
                            </Grid>
                        </div>



                    </Box>
                </Drawer>


                <SpeedDial
                    ariaLabel="SpeedDial"
                    //className={classes.speedDial}
                    size="small"
                    //style={{ position: 'absolute', bottom: 2, right: 2 }}
                    style={{ position: 'fixed', bottom: 60, right: 11 }}
                    //hidden={hidden}
                    FabProps={{ size: "small" }}
                    icon={<SettingsIcon size="small" openIcon={<EditIcon size="small" />} />}
                    onClose={() => { this.setState({ speedDialOpen: false }) }}
                    onClick={() => { this.handleSpeedDial() }}
                    open={this.state.speedDialOpen}
                >

                    <SpeedDialAction

                        icon={<AddCircleIcon></AddCircleIcon>}
                        tooltipTitle={"Add New Dashboard"}
                        onClick={() => { this.handleNewDashboard() }}
                    />

                    <SpeedDialAction

                        icon={<EditIcon></EditIcon>}
                        tooltipTitle={"Edit"}
                        onClick={() => { this.handleDrawerToggle() }}
                    />
                    <SpeedDialAction

                        icon={<SaveIcon></SaveIcon>}
                        tooltipTitle={"Save"}
                        onClick={() => { this.save() }}
                    />
                </SpeedDial>
                {/* <Fab
                    // variant="extended"
                    size="small"
                    color="primary"
                    aria-label="expand"
                    className=""
                    style={{ position: 'absolute', bottom: 2, right: 2 }}
                    onClick={() => { this.handleDrawerToggle() }}
                >
                    <Icon>settings</Icon>
                </Fab> */}

                <LoonsSnackbar
                    open={this.state.snackbar}
                    onClose={() => {
                        this.setState({ snackbar: false })
                    }}
                    message={this.state.snackbar_message}
                    autoHideDuration={3000}
                    severity={this.state.snackbar_severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>

                {
                    this.state.editingWidget ?
                        <Dialog maxWidth={"md"} fullWidth={true} open={this.state.fieldEditingDialog} onClose={this.fieldEditingDialogClose.bind(this)} aria-labelledby="form-dialog-title">

                            <DialogContent>
                                <Typography className="font-semibold text-15">
                                    Select Visible Field in Minimize Screen
                                </Typography>
                                <Grid container>
                                    {this.state.editingWidget.component.map((field, i) => (
                                        <Grid key={i} item>
                                            <FormControlLabel
                                                key={i}
                                                label={field.placeholder}
                                                //name={field.}
                                                //value={val.value}
                                                onChange={() => {
                                                    this.handleVisibilityOfField(this.state.editingWidget, field)
                                                }}
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={field.displayInSmallView}
                                                        size="small"
                                                    />
                                                }
                                                display="inline"

                                            />
                                        </Grid>
                                    ))}
                                </Grid>

                            </DialogContent>

                        </Dialog>
                        : null
                }



                <Dialog maxWidth={"sm"} fullWidth={true} open={this.state.newDashboardDialogBox} onClose={() => { this.setState({ newDashboardDialogBox: false }) }} aria-labelledby="form-dialog-title">

                    <DialogContent>
                        <Typography className="font-semibold text-15">
                            Add New Dashboard
                        </Typography>
                        <Grid container>
                            <ValidatorForm id="newDashboard2"
                                onSubmit={() => this.createNewDashboard()}
                            >
                                <TextValidator
                                    className=" w-full"

                                    placeholder="Dashboard Name"
                                    name="dashboard_name"
                                    InputLabelProps={{ shrink: false }}

                                    value={this.state.dashboardName}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={(v) => {

                                        this.setState({
                                            dashboardName: v.target.value
                                        })

                                    }}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />

                                <Alert severity='info' className='mt-1'>

                                    <Typography className='mt-2'>
                                        Please Select dashboard After Save the New Dashboard and add Widgets.
                                    </Typography>
                                </Alert>

                                <Button
                                    className="mt-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    startIcon="save"
                                //onClick={this.handleChange}
                                >
                                    <span className="capitalize">Submit</span>
                                </Button>
                            </ValidatorForm>
                        </Grid>

                    </DialogContent>

                </Dialog>



                <Dialog maxWidth={"sm"} fullWidth={true} open={this.state.newDashboardFromClinicDialogBox} onClose={() => { this.setState({ newDashboardFromClinicDialogBox: false }) }} aria-labelledby="form-dialog-title">

                    <DialogContent>
                        <Typography className="font-semibold text-15">
                            Add New Dashboard Name
                        </Typography>
                        <Grid container>
                            <ValidatorForm id="newDashboard2"
                                onSubmit={() => this.createNewDashboardFromClinic()}
                            >
                                <TextValidator
                                    className=" w-full"

                                    placeholder="Dashboard Name"
                                    name="dashboard_name"
                                    InputLabelProps={{ shrink: false }}

                                    value={this.state.editedDashboardName}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={(v) => {

                                        this.setState({
                                            editedDashboardName: v.target.value
                                        })

                                    }}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />

                                <Alert severity='info' className='mt-1'>

                                    <Typography className='mt-2'>
                                        You are Changed Clinic Dashboard.Please Select dashboard After Save the Dashboard.
                                    </Typography>
                                </Alert>

                                <Button
                                    className="mt-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    startIcon="save"
                                //onClick={this.handleChange}
                                >
                                    <span className="capitalize">Submit</span>
                                </Button>
                            </ValidatorForm>
                        </Grid>

                    </DialogContent>

                </Dialog>


            </Fragment >

        );
    }
}

export default withStyles(styleSheet)(SmartDashboard);
