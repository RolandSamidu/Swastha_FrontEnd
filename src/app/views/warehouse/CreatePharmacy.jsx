import { FormControlLabel, Grid, Dialog } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete } from '@material-ui/lab'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {
    Button,
    CardTitle,
    CheckboxValidatorElement,
    LoonsCard,
    LoonsSnackbar,
    MainContainer,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import DepartmentService from 'app/services/DepartmentService'
import DepartmentTypeService from 'app/services/DepartmentTypeService'
import DivisionsServices from 'app/services/DivisionsServices'
import PharmacyService from 'app/services/PharmacyService'
import localStorageService from 'app/services/localStorageService'
import PatientServices from 'app/services/PatientServices'
import 'date-fns'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
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


class CreatePharmacy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allDepartmentTypes: [],
            allDepartments: [],
            alert: false,
            message: '',
            severity: 'success',
            allHigherLevels: [],

            login_drugStore: {},
            dialog_for_select_frontDesk: false,
            all_drugStore: [],


            all_district: [],
            formData: {
                store_id: '',
                name: '',
                department_type: null,
                department_id: null,
                store_type: null,
                issuance_type: "Pharmacy",
                is_admin: false,
                is_counter: false,
                is_designated: false,
                is_drug_store: false,
                is_clinic: false,
                address_line1: "",
                address_line2: "",
                district: "",
                province: "",
                location: '',
                higher_levels: null,

                designated: false,
            },
        }
    }

    async loadData() {
        //Fetch department data

        //fetch department TypeData
        let allDepartmentsTypes =
            await DepartmentTypeService.fetchAllDepartmentTypes()
        if (200 == allDepartmentsTypes.status) {
            this.setState({
                allDepartmentTypes: allDepartmentsTypes.data.view.data,
            })
        }



        let district_res = await DivisionsServices.getAllDistrict({
            limit: 99999,
        })
        if (district_res.status == 200) {
            console.log('district', district_res.data.view.data)
            this.setState({
                all_district: district_res.data.view.data,
            })
        }




        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)

        var id = user.id;
        var all_drugStore = [];

        let params = { employee_id: id, type:  ['Main', 'Hospital', 'Pharmacy', 'Counter Pharmacy','pharmacy', 'drug_store', 'Drug_store'] }
        let res = await PatientServices.getAllFront_Desk(params);
        if (res.status == 200) {
            console.log("frontdesk", res.data.view.data)

            res.data.view.data.forEach(element => {
                all_drugStore.push(
                    {
                        Pharmacy_drugs_store: element.Pharmacy_drugs_store,
                        name: element.Pharmacy_drugs_store.name,
                        id: element.id,
                        pharmacy_drugs_stores_id: element.pharmacy_drugs_stores_id,
                        owner_id: element.Pharmacy_drugs_store.owner_id
                    }

                )
            });

            this.setState({ all_drugStore: all_drugStore })


            var drugStore = await localStorageService.getItem('Login_user_Hospital_for_Drug_store');
            if (!drugStore) {
                this.setState({ dialog_for_select_frontDesk: false })


            } else {
                this.setState({
                    login_drugStore: drugStore
                })
            }


        }



    }

    async selectingDrugStore(value) {
        await localStorageService.setItem('Login_user_Hospital_for_Drug_store', value)
        this.setState({ dialog_for_select_frontDesk: false })
    }



    async loadDepartmets() {
        let allDepartments = await DepartmentService.fetchAllDepartments()
        if (200 == allDepartments.status) {
            this.setState({
                allDepartments: allDepartments.data.view.data,
            })
        }
    }

    async loadPharmacy() {
        let allPharmacy = await PharmacyService.getPharmacy("null", { issuance_type: ['Main', 'Hospital', 'Pharmacy', 'pharmacy', 'drug_store', 'Drug_store'] })
        if (200 == allPharmacy.status) {
            this.setState({
                allHigherLevels: allPharmacy.data.view.data,
            })
        }
    }

    async saveStepOne() {

        console.log("form Data", this.state.formData)

        /* let res = await PharmacyService.createPharmacy(this.state.formData, '001')
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Pharmacy Created Successfuly',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Pharmacy creation was Unsuccessful',
                severity: 'error',
            })
        } */
    }

    componentDidMount() {
        this.loadData()
        this.loadDepartmets();
        this.loadPharmacy();
    }

    //Change the state based on the checkbox change
    handleChange = (val) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [val.target.name]: val.target.checked,
            },
        })
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Add New Pharmacy" />

                        <div className="w-full">
                            <ValidatorForm
                                className="pt-2"
                                onSubmit={() => this.saveStepOne()}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex ">
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Pharmacy ID" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Pharmacy ID"
                                            name="store_id"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.store_id}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.store_id =
                                                    e.target.value
                                                this.setState({ formData })
                                            }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Name" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Name"
                                            name="store_name"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.name}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.name = e.target.value
                                                this.setState({ formData })
                                            }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        {/* TODO - Check what is this. This is not submitted to backend */}
                                        <SubTitle title="Department Type" />

                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={
                                                this.state.allDepartmentTypes
                                            }
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    this.setState({
                                                        formData: {
                                                            ...this.state
                                                                .formData,
                                                            department_type:
                                                                value.id,
                                                        },
                                                    })
                                                }
                                            }}
                                            value={this.state.allDepartmentTypes.find(
                                                (v) =>
                                                    v.id ==
                                                    this.state.formData
                                                        .department_type
                                            )}
                                            getOptionLabel={(option) =>
                                                option.name ? option.name : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Title"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Department" />

                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.allDepartments.filter((ele) => ele.department_types_id == this.state.formData.department_type)}
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData =
                                                        this.state.formData
                                                    formData.department_id =
                                                        value.id
                                                    this.setState({ formData })
                                                }
                                            }}
                                            value={this.state.allDepartments.find(
                                                (v) =>
                                                    v.id ==
                                                    this.state.formData
                                                        .department_id
                                            )}
                                            getOptionLabel={(option) =>
                                                option.name ? option.name : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Department"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Store Type" />

                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={appConst.storeTypes}
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData =
                                                        this.state.formData
                                                    formData.store_type =
                                                        value.value
                                                    this.setState({ formData })
                                                }
                                            }}
                                            //defaultValue={{ label: this.state.formData.store_type }}
                                            value={appConst.storeTypes.find(
                                                (v) =>
                                                    v.value ==
                                                    this.state.formData
                                                        .store_type
                                            )}
                                            getOptionLabel={(option) =>
                                                option.label ? option.label : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Store Type"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Location" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Location"
                                            name="location"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.location}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.location =
                                                    e.target.value
                                                this.setState({ formData })
                                            }}
                                        /*  validators={['required']}
                                     errorMessages={[
                                         'this field is required',
                                     ]} */
                                        />
                                    </Grid>




                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Address Line 1" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Address Line 1"
                                            name="AddressLine1"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.address_line1}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.address_line1 =
                                                    e.target.value
                                                this.setState({ formData })
                                            }}
                                        /*  validators={['required']}
                                     errorMessages={[
                                         'this field is required',
                                     ]} */
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Address Line 1" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Address Line 2"
                                            name="AddressLine2"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.address_line2}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.address_line2 =
                                                    e.target.value
                                                this.setState({ formData })
                                            }}
                                        /*  validators={['required']}
                                     errorMessages={[
                                         'this field is required',
                                     ]} */
                                        />
                                    </Grid>





                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >


                                        <SubTitle title="Province" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={appConst.provinceList}
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData = this.state.formData
                                                    formData.province = value.value
                                                    this.setState({
                                                        formData,
                                                    })
                                                }
                                            }}
                                            /*  defaultValue={this.state.all_district.find(
                                                 (v) => v.id == this.state.formData.district_id
                                             )} */


                                            /* value={{
                                                name: this.state.formData.province ? (this.state.all_district.find((obj) => obj.id == this.state.formData.district_id).name) : null,
                                                id: this.state.formData.district_id
                                            }} */

                                            getOptionLabel={(option) => option.label ? option.label : ''
                                            }
                                            renderInput={(
                                                params
                                            ) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Province"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >


                                        <SubTitle title="District" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={appConst.districtList}
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData = this.state.formData
                                                    formData.district = value.value
                                                    this.setState({
                                                        formData,
                                                    })
                                                }
                                            }}
                                            /*  defaultValue={this.state.all_district.find(
                                                 (v) => v.id == this.state.formData.district_id
                                             )} */


                                            /* value={{
                                                name: this.state.formData.district_id ? (this.state.all_district.find((obj) => obj.id == this.state.formData.district_id).name) : null,
                                                id: this.state.formData.district_id
                                            }}
 */
                                            getOptionLabel={(option) => option.label ? option.label : ''
                                            }
                                            renderInput={(
                                                params
                                            ) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="District"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>


                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        {/* TODO - Check what is this. This is not submitted to backend */}
                                        <SubTitle title="Higher Levels" />

                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.allHigherLevels}
                                            onChange={(e, value) => {
                                                //console.log("higher levels", value)

                                                let formData = this.state.formData;
                                                formData.higher_levels = [];
                                                value.forEach(element => {
                                                    formData.higher_levels.push(element.id)
                                                });
                                                this.setState({ formData })

                                            }}
                                            multiple={true}
                                            // defaultValue={[{ label: this.state.formData.higher_levels }]}
                                            //value={{ label: this.state.formData.higher_levels }}
                                            getOptionLabel={(option) =>
                                                option.name
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Higher Levels"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Pharmacists Types" />

                                        <Grid
                                            container
                                            spacing={1}
                                            className="flex"
                                        >
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={() => {
                                                                let formData = this.state.formData;
                                                                formData.is_admin = !formData.is_admin;
                                                                this.setState({ formData })
                                                            }

                                                            }
                                                            checked={this.state.is_admin}
                                                            name="admin"
                                                            value="admin"
                                                        />
                                                    }
                                                    label="Admin Pharmacist"
                                                />
                                            </Grid>

                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={() => {
                                                                let formData = this.state.formData;
                                                                formData.is_counter = !formData.is_counter;
                                                                this.setState({ formData })
                                                            }
                                                            }
                                                            checked={this.state.is_counter}
                                                            name="counter"
                                                            value="counter"
                                                        />
                                                    }
                                                    label="Counter Pharmacist"
                                                />
                                            </Grid>

                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={() => {
                                                                let formData = this.state.formData;
                                                                formData.is_designated = !formData.is_designated;
                                                                this.setState({ formData })
                                                            }}
                                                            checked={this.state.is_designated}
                                                            name="designated"
                                                            value="designated"
                                                        />
                                                    }
                                                    label="Designated Pharmacist"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid
                                    className=" w-full flex justify-end"
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <Button
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                        startIcon="save"
                                    //onClick={this.handleChange}
                                    >
                                        <span className="capitalize">Save</span>
                                    </Button>
                                </Grid>
                            </ValidatorForm>
                        </div>
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



                <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_frontDesk} >

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Select Your Drug Store" />

                        {/* <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ dialog_for_select_frontDesk: false }) }}>
<CloseIcon />
</IconButton>
*/}
                    </MuiDialogTitle>



                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            //onSubmit={() => this.searchPatients()}
                            onError={() => null}
                            className="w-full"
                        >
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                // ref={elmRef}
                                options={this.state.all_drugStore}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        this.setState({ login_drugStore: value })
                                        this.selectingDrugStore(value)
                                    }
                                }}
                                value={this.state.login_drugStore}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Drug Store"
                                        //variant="outlined"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />

                        </ValidatorForm>
                    </div>
                </Dialog>


            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(CreatePharmacy)
