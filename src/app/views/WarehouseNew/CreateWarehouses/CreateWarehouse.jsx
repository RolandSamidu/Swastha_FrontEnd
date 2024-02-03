import { Grid,Dialog } from '@material-ui/core'
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
import * as appConst from 'appconst'

const styleSheet = (theme) => ({})

class CreateWarehouse extends Component {
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
                store_id: null,
                name: null,
                department_type: null,
                department_id: null,
                department_name:null,
                store_type: null,
                issuance_type: "Main",
                address_line1: null,
                address_line2: null,
                district: null,
                province: null,
                location: null,
                levels: null,
                contact_no:null,
                description_abt_warehouse:null,
                is_admin:true,
                is_counter:true,
                is_drug_store:true,
            },
            hierachy:{},
        }
    }

    async loadData() {
        //Fetch department data

        //fetch department TypeData
        let allDepartmentsTypes = await DepartmentTypeService.fetchAllDepartmentTypes()
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

        let params = { employee_id: id, type: ['Main', 'Hospital', 'Pharmacy','Counter Pharmacy', 'pharmacy', 'drug_store', 'Drug_store'] }
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
                },()=>{this.loadHierachy()})
            }


        }


    }

    async selectingDrugStore(value){
        await localStorageService.setItem('Login_user_Hospital_for_Drug_store',value)
        this.setState({dialog_for_select_frontDesk:false})
        this.loadHierachy()
    }



    async loadDepartmets() {
        let allDepartments = await DepartmentService.fetchAllDepartments()
        if (200 == allDepartments.status) {
            this.setState({
                allDepartments: allDepartments.data.view.data,
            })
        }
    }

    async loadDrugStore() {
        let allPharmacy = await PharmacyService.getPharmacy("null", { issuance_type: ["Main MSD",'Main'] })
        let formData = this.state.formData
        if (200 == allPharmacy.status) {
            if(allPharmacy.data.view.data.length > 0){
                formData.levels= [allPharmacy.data.view.data.id]
            }
            this.setState({
                formData :formData,
                allHigherLevels: allPharmacy.data.view.data,
            })
        }
    }

    async saveStepOne() {
        console.log("form Data", this.state.formData)
        let owner_id='000' //hardcoded

        let res = await PharmacyService.createPharmacy(this.state.formData, owner_id)
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Warehouse Created Successfuly',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Warehouse creation was Unsuccessful',
                severity: 'error',
            })
        }
    }


    async loadHierachy(){
        let owner_id=this.state.login_drugStore.owner_id;
        let pharmacy_drugs_stores_id=this.state.login_drugStore.pharmacy_drugs_stores_id;
        let res = await PharmacyService.fetchHierachy(pharmacy_drugs_stores_id,owner_id)
             if (200 == res.status) {
                this.setState({hierachy:res.data.view[0]})
             } else {
               console.log('Error')
            }
    }

    componentDidMount() {
        this.loadData()
        this.loadDepartmets();
        this.loadDrugStore();
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
                <LoonsCard>
                <MainContainer>
                        <CardTitle title="Add New Warehouse" />

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
                                        <SubTitle title="Drug Store ID" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Drug Store ID"
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
                                        <SubTitle title="Department Type" />

                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={
                                                this.state.allDepartmentTypes.filter((ele) => ele.name == "MSD")
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
                                        <SubTitle title="Address Line 2" />

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
                                            options={appConst.districtList.filter((ele)=> ele.province === this.state.formData.province)}
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
                                    {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Higher Levels" />

                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.allHigherLevels}
                                            onChange={(e, value) => {
                                                //console.log("higher levels", value)

                                                let formData = this.state.formData;
                                                formData.levels = [];
                                                value.forEach(element => {
                                                    formData.levels.push(element.id)
                                                });
                                                this.setState({ formData })

                                            }}
                                            multiple={true}
                                            // defaultValue={[{ label: this.state.formData.levels }]}
                                            //value={{ label: this.state.formData.levels }}
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
                                    </Grid> */}
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Main Contact Number" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Contact Number"
                                            name="store_name"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.contact_no}
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.contact_no = e.target.value
                                                this.setState({ formData })
                                            }}
                                            validators={['required', "matchRegexp:((^|, )((0)[0-9]{9}|(7)[0-9]{8}))+$"]}
                                            errorMessages={[
                                                'this field is required', "Please enter a valid Contact Number(Eg:0712345678 or 712345678)"
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
                                     <SubTitle title="Description about the Warehouse" />
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Description about the Warehouse"
                                                        name="remark"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .description_abt_warehouse
                                                        }
                                                        type="text"
                                                        multiline
                                                        rows={3}
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            let formData =
                                                                this.state.formData
                                                            formData.description_abt_warehouse = e.target.value
                                                            this.setState({ formData })

                                                        }} 
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    />
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


                        {/* <FlowDiagramComp data={this.state.hierachy} /> */}

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

                </LoonsCard>



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

export default withStyles(styleSheet)(CreateWarehouse)
