import React, { Component, Fragment } from "react";
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    LoonsTable,
    CardTitle,
    SubTitle,
    FilePicker,
    ImageView,
} from 'app/components/LoonsLabComponents'
import { CircularProgress, Grid, Tooltip, IconButton , FormControlLabel,
    Radio,RadioGroup } from "@material-ui/core";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";
import * as appConst from "../../../appconst";
import Paper from "@material-ui/core/Paper";
import Buttons from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { dateParse } from "utils";
import ClinicService from "app/services/ClinicService";

class RegisterExternalCustomers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            submitting: false,
            loaded: true,
            formloaded: true,
            processing: false,
            totalItems: 0,
            totalPages: 0,
            formData: {
                name: '',
                description: '',
                location: '',
                province: '',
                district:'',
                store_id : "XP1295",
                department_id :"ce3e49be-d87c-4723-b8c4-f3cec537b72e",
                store_type :"N/A",
                issuance_type :"sales_store",
                is_admin: false,
                is_counter: false,
                is_drug_store:false,
                bin_status: false,
            },
            owner_id: 'EC00001',

            filterData: {
                search: null,
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],

                // type: appConst.allProvince.map(a => a.type),
                // type: appConst.allDistrict.map(a => a.type)

            },
            data: [],
            columns: [
                {
                    name: 'name',
                    label:'Name',
                    options: {
                        filter: false,
                        display: true,
                    }
                },
                {
                    name: 'location',
                    label:'Location',
                    options: {
                        filter: false,
                        display: true,
                    }
                },
                {
                    name: 'province',
                    label:'Province',
                    options: {
                        filter: false,
                        display: true,
                    }
                },
                {
                    name: 'district',
                    label:'District',
                    options: {
                        filter: false,
                        display: true,
                    }
                },
                {
                    name: 'description',
                    label:'Description',
                    options: {
                        filter: false,
                        display: true,
                    }
                },

            ],

            alert: false,
            message: '',
            severity: 'success',
        }
    }


    async loadData() {
        this.setState({ loaded: false })
        let res = await ClinicService.fetchAllClinicsNew(this.state.filterData,this.state.owner_id)
        if (res.status == 200) {
            console.log("estimation data", res.data.view.data)
            this.setState({
                loaded: true,
                data: res.data.view.data,
                totalPages: res.data.view.totalPages, 
                totalItems: res.data.view.totalItems

            })
        }
    }


    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()

            }
        )
    }

    async componentDidMount() {
      
        this.loadData();

    }
   
async submit() {
    this.setState({ submitting: true })

    let formData = this.state.formData;

    let res = await ClinicService.createAllClinicsNew(formData, this.state.owner_id)
    console.log("Estimation Data added", res)
    if (res.status === 201) {
        this.setState({
            alert: true,
            message: 'User creation was successful!',
            severity: 'success',
            submitting: false,
            
        }
            , () => {
                this.setPage(0)
            },
        )
    } else {
        this.setState({
            alert: true,
            message: 'User creation was unsuccessful!',
            severity: 'error',
            submitting: false
        })
    }
        window.location.reload();  
}



    render() {
        return (
           
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title = "Register External Customers" />

                       {this.state.formloaded ? 
                          <ValidatorForm
                            className="pt-2" 
                            onSubmit={()=>{this.submit()}}
                            // onSubmit={() => this.setPage(0)}
                            >
                            <Grid container spacing={1} className="flex">
                                
                                <Grid  className=" w-full"
                                    item lg={6} md={6} sm={12} xs={12} >
                                        <SubTitle title = "Name" />
                                        <TextValidator
                                        className= "w-full"
                                        placeholder="Please Enter Name"
                                        name= "name"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.name}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData =
                                                    this.state.formData
                                                formData.name =
                                                    e.target.value
                                                this.setState({ formData })
                                        }}
                                        validators={['required', "matchRegexp:^[A-z| |.]{1,}$"]}
                                        errorMessages={[
                                            'This field is required',
                                        ]}

                                        />
                                </Grid>
                               
                                <Grid  className=" w-full"
                                    item lg={6} md={6} sm={12} xs={12} >
                                        <SubTitle title = "Location" />
                                        <TextValidator
                                        className= "w-full"
                                        placeholder="Please Enter Location"
                                        name= "location"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.location}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData = this.state.formData;
                                            formData.location = e.target.value;
                                            this.setState({formData})
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'This field is required',
                                        ]}

                                        />
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={6} md={6} sm={12} xs={12}
                                    >
                                    <SubTitle title= "Province" />
                                    <Autocomplete 
                                    disableClearable
                                    className="w-full"
                                    options={appConst.allProvince}
                                    onChange={(e, value) => {           
                                        console.log('dropped value', e, value)
                                        if (value != null) {
                                            let formData = this.state.formData;
                                            formData.province = value.value;

                                            this.setState({
                                                formData,
                                        
                                            });
                                            console.log('form data', this.state.formData)
                                        } 
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please select Province"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}      
                                    />
                                    
                                    
                                </Grid>

                                {/* district */}
                                <Grid
                                    className="w-full"
                                    item
                                    lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title= "District" />
                                    <Autocomplete 
                                    disableClearable
                                    className="w-full"
                                    options={appConst.districtList}
                                    onChange={(e, value) => {           
                                        console.log('dropped value', e, value)
                                        if (value != null) {
                                            let formData = this.state.formData;
                                            formData.district = value.value;

                                            this.setState({
                                                formData,
                                        
                                            });
                                            console.log('form data', this.state.formData)
                                        } 
                                    }}                             
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please select District"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}      
                                    />
                                    
                                    
                                </Grid>
                                <Grid  className=" w-full"
                                    item lg={6} md={6} sm={12} xs={12} >
                                        <SubTitle title = "Description" />
                                        <TextValidator
                                        className= "w-full"
                                        placeholder="Please Enter Description"
                                        name= "description"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.description}
                                        type="text"
                                        multiline rows={3}
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData = this.state.formData;
                                            formData.description = e.target.value;
                                            this.setState({formData})
                                        }}
                                        // validators={['required']}
                                        // errorMessages={[
                                        //     'This field is required',
                                        // ]}

                                        />
                                </Grid>

                            </Grid>

                            <Grid className=" w-full flex justify-start" item lg={12} md={12} sm={12} xs={12}>
                                <Button 
                                    className="text-left mt-2"
                                    progress={this.state.processing}
                                    type="submit"
                                    scrollToTop={true}
                                    startIcon="save">

                                    <span className="capitalize">Save</span>
                                </Button>
                            </Grid>
                          </ValidatorForm>
                       : null}  
                    </LoonsCard>

                     {/* Table */}
                     <Grid style={{marginTop: 20}}>
                        <LoonsCard>
                            <ValidatorForm onSubmit={() => {
                                let filterData = this.state.filterData;
                                filterData.page = 0;
                                this.setState({ filterData })

                               
                            }}>

                                <Grid container className="w-full" spacing={1}>
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
                                        <Button className="mt-1" type="submit" onClick={() => { this.setPage(0) }}>
                                        <span className="capitalize">Search</span>
                                        </Button>
                                    </Grid>
                                </Grid>

                            </ValidatorForm>
                            {this.state.loaded &&
                                <div className="mt-0">
                                    <LoonsTable 
                                id={'all'}
                                data={this.state.data}
                                columns={this.state.columns}
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: this.state.totalItems,
                                    rowsPerPage: this.state.filterData.limit,
                                    page: this.state.filterData.page,

                                    onTableChange: (action, tableState) => {
                                        switch (action) {
                                            case 'changePage':
                                                this.setPage(
                                                    tableState.page
                                                )
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
                                >
                                    
                                </LoonsTable>
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
        );
    }
}

export default RegisterExternalCustomers
