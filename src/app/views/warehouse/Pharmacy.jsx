import { FormControlLabel, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete } from '@material-ui/lab'
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
import EmployeeServices from 'app/services/EmployeeServices'
import localStorageService from 'app/services/localStorageService'
import PharmacyService from 'app/services/PharmacyService'
import 'date-fns'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import LoonsTable from "../../components/LoonsLabComponents/Table/LoonsTable";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from '@material-ui/icons/Visibility';

const styleSheet = (theme) => ({})

class Pharmacy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allDataStorePharmacy: [],
            allDepartments: [],
            alert: false,
            message: '',
            severity: 'success',
            totalItems: 0,
            totalPages: 0,
            allHigherLevels: [
                { name: 'level1', id: 1 },
                { name: 'lavel2', id: 2 },
                { name: 'lavel3', id: 3 },
            ],

            formData: {
                store_id: '',
                name: '',
                department_id: null,
                store_type: 'N/A',
                issuance_type: 'pharmacy',
                location: '',
                is_admin: false,
                is_counter: true,
                is_drug_store: false,
                bin_status: false,
                //short_reference: null,

                description: null,
                levels: []
            },
            owner_id: null,
            loaded: false,
            departmentLoaded: false,
            data: [],
            filterData: {
                page: 0,
                limit: 20,
                issuance_type: 'pharmacy'
            },
            columns: [
                {
                    name: 'id',
                    label: 'id',
                    options: {
                        //filter: true,
                        display: false,
                    },
                },
                {
                    name: 'store_id',
                    label: 'Pharmacy Id',
                    options: {
                        filter: true,
                    },

                },
                {
                    name: 'name',
                    label: 'Name',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'department_id',
                    label: 'Department Name',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let id = this.state.data[tableMeta.rowIndex].department_id
                            let dep = this.state.allDepartments.filter((ele) => ele.id == id)
                            return (<p>{
                                dep[0]?.name
                            }</p>)
                        },
                    },
                },

                {
                    name: 'location',
                    label: 'Location',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'description',
                    label: 'Description',
                    options: {
                        display: false,
                        filter: true,
                    },
                },
                {
                    name: "action",
                    label: "Action",
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="View">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                console.log(this.state.data[tableMeta.rowIndex].id)
                                                window.location.href=`/hospital-data-setup/assing_pharmacist/${this.state.data[tableMeta.rowIndex].id}` + "?owner_id=" + this.state.owner_id
                                                // var createClinicWindow = window.open(`/hospital-data-setup/assing_pharmacist/${this.state.data[tableMeta.rowIndex].id}` + "?owner_id=" + this.state.owner_id, '_blank');
                                                // createClinicWindow.data = this.state.data[tableMeta.rowIndex]
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            );
                        }

                    }
                }
            ],
        }
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        console.log(page)
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }

    async loadData() {
        this.setState({
            loaded: false,
            departmentLoaded: false
        })
        //Fetch department data
        let depParams = {
            department_type_name: 'pharmacy'
        }
        let allDepartments = await DepartmentService.fetchNewAllDepartments(null, depParams)
        if (200 == allDepartments.status) {
            console.log("All dep: ", allDepartments);
            this.setState({
                departmentLoaded: true,
                allDepartments: allDepartments.data.view.data,
            },
                () => {
                    this.render()
                })
            console.log("dep", this.state.allDepartments);
        }

        //fetch Asigned employee
        const userId = await localStorageService.getItem('userInfo').id

        console.log("user id: " + userId);

        let getAsignedEmployee = await EmployeeServices.getAsignEmployees({
            employee_id: userId,
            type: ['Hospital Admin', 'Super Admin']//Hospital Admin
        })

        let hospitals = []
        let owner_id = null
        if (200 == getAsignedEmployee.status) {
            console.log("getAsignedEmployee: ", getAsignedEmployee);
            hospitals = getAsignedEmployee.data.view.data
        }

        console.log("length: ", hospitals.length);
        let formData = this.state.formData;


        if (hospitals.length > 0) {
            owner_id = hospitals[0].Pharmacy_drugs_store.owner_id
            this.setState({ owner_id: owner_id })
            let allDataStorePharmacy = await PharmacyService.fetchAllDataStorePharmacy(owner_id, { issuance_type: ['drug_store', 'Drug Store'] })
            if (200 == allDataStorePharmacy.status) {
                console.log("Dep tyepe: ", allDataStorePharmacy);
                this.setState({
                    allDataStorePharmacy: allDataStorePharmacy.data.view.data,
                })
            }
        }


        /* 
        
        
        
                if (hospitals.length > 1) {
                    //fetch department TypeData
                    let allDataStorePharmacy = await PharmacyService.fetchAllDataStorePharmacy('001', {})
        
                    if (200 == allDataStorePharmacy.status) {
                        console.log("Dep tyepe: ", allDataStorePharmacy);
                        this.setState({
                            allDataStorePharmacy: allDataStorePharmacy.data.view.data,
                        })
                    }
                } else if (hospitals.length == 1) {
                    owner_id = hospitals[0].Pharmacy_drugs_store.owner_id
                    // let allDataStorePharmacy = await PharmacyService.fetchOneById(hospitals.id)
                    let formData = this.state.formData
                    formData.levels = [hospitals[0].Pharmacy_drugs_store.id]
                    this.setState({
                        allDataStorePharmacy: [hospitals[0].Pharmacy_drugs_store],
                        owner_id: hospitals[0].Pharmacy_drugs_store.owner_id,
                        formData: formData
                    })
        
        
                } else {
                    let allDataStorePharmacy = await PharmacyService.fetchAllDataStorePharmacy('001', {})
                    if (200 == allDataStorePharmacy.status) {
                        console.log("Dep tyepe: ", allDataStorePharmacy);
                        this.setState({
                            allDataStorePharmacy: allDataStorePharmacy.data.view.data,
                        })
                    }
                } */

        let filterData = this.state.filterData;

        let allClinics = await PharmacyService.getPharmacy(owner_id, filterData)

        if (allClinics.status == 200) {
            console.log(allClinics)
            this.setState({
                loaded: true,
                data: allClinics.data.view.data,
                totalPages: allClinics.data.view.totalPages,
                totalItems: allClinics.data.view.totalItems,
            })
            console.log(this.state.data)
        }


    }

    async saveClinic() {


        let res = await PharmacyService.createPharmacy(this.state.formData, this.state.owner_id)
        if (201 == res.status) {

            this.setState({
                alert: true,
                message: 'Pharmacy Created Successfuly',
                severity: 'success',
            }, () => {
                window.location.reload()
            })
        } else {
            this.setState({
                alert: true,
                message: 'Pharmacy Creation was Unsuccessful',
                severity: 'error',
            })
        }
    }



    componentDidMount() {

        this.loadData()
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
                                onSubmit={() => this.saveClinic()}
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
                                        <SubTitle title="Pharmacy Type" />

                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.allDepartments}
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData =
                                                        this.state.formData
                                                    formData.department_id = value.id
                                                    formData.store_id = value.code
                                                    //formData.short_reference = value.code
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
                                                    placeholder="Pharmacy Type"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
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
                                        <SubTitle title="Pharmacy ID" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Ex:PH01"
                                            name="store_id"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.store_id}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e, value) => {
                                                let formData =
                                                    this.state.formData
                                                formData.store_id = e.target.value
                                                //formData.short_reference = e.target.value
                                                this.setState({ formData })
                                            }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
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
                                        <SubTitle title="Short Reference" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Ex :- ECK,JMV,VPO"
                                            name="short_reference"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.short_reference}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.short_reference = e.target.value
                                                this.setState({ formData })
                                            }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
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
                                        <SubTitle title="Location / Room" />

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
                                    {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Description" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Ex :- General Medical Clinic Pharmacy"
                                            name="description"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.description}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.description = e.target.value
                                                this.setState({ formData })
                                            }}
                                        // validators={['required']}
                                        // errorMessages={[
                                        //     'this field is required',
                                        // ]}
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
                                        <SubTitle title="Required User Types" />

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
                                                            checked={this.state.formData.is_admin}
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
                                                            checked={this.state.formData.is_counter}
                                                            name="counter"
                                                            value="counter"
                                                        />
                                                    }
                                                    label="Counter Pharmacist"
                                                />
                                            </Grid>

                                            {/* <Grid
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
                                            </Grid> */}
                                        </Grid>
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Higher Levels (Where the Drugs Come From)" />

                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            multiple={true}
                                            options={this.state.allDataStorePharmacy}
                                            /*  value={this.state.allDataStorePharmacy.find(
                                                 (v) =>
                                                     v.id ==
                                                     this.state.formData
                                                         .levels[0]
                                             )} */
                                            getOptionLabel={(option) =>
                                                option.name ? option.name : ''
                                            }
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData = this.state.formData;
                                                    //formData.answers = value.label;
                                                    formData.levels = [];
                                                    value.forEach(element => {
                                                        formData.levels.push(element.id)
                                                    });
                                                    this.setState({ formData }, () => { console.log("val", this.state.formData) })
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Higher Levels (Where the Drugs Come From)"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                            validators={['required']}
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
                    </LoonsCard>
                    <Grid style={{ marginTop: 20 }}>
                        < LoonsCard>
                            <ValidatorForm onSubmit={() => {
                                let filterData = this.state.filterData;
                                filterData.page = 0;
                                this.setState({ filterData })
                                this.loadData()
                            }}>
                                <Grid container className=" w-full" spacing={1}>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={3}
                                        sm={12}
                                        xs={12}
                                    >

                                        <TextValidator
                                            className='w-full'
                                            placeholder="Search"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.filterData.search
                                            }
                                            onChange={(e, value) => {
                                                let filterData = this.state.filterData;
                                                filterData.search = e.target.value
                                                this.setState({ filterData })

                                            }}
                                        /* validators={[
                                            'required',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                        ]} */
                                        />
                                    </Grid>

                                    <Grid item>
                                        <Button className="mt-1" type="submit">Search</Button>
                                    </Grid>

                                </Grid>
                            </ValidatorForm>
                            {this.state.loaded && this.state.departmentLoaded &&
                                <div className="mt-0">
                                    <LoonsTable
                                        id={"clinicDetails"}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: 20,
                                            page: this.state.filterData.page,

                                            onTableChange: (action, tableState) => {
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setPage(tableState.page)
                                                        break
                                                    case 'sort':
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    >{ }</LoonsTable>
                                </div>
                            }
                        </LoonsCard>
                    </Grid>
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
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(Pharmacy)
