import React, { Component, Fragment } from "react";
import { CardTitle, LoonsCard, SubTitle, DatePicker,LoonsSnackbar } from "app/components/LoonsLabComponents";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";
import { LoonsTable, Button } from "app/components/LoonsLabComponents";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { CircularProgress, Grid } from "@material-ui/core";
import * as appConst from '../../../appconst'
import { Autocomplete} from "@material-ui/lab";
import DonarService from '../../services/DonarService'
import localStorageService from 'app/services/localStorageService'

class DonorRegistration extends Component {
    constructor(props) {
        super(props)
        this.state = {
             //snackbar
             alert: false,
             message: '',
             severity: 'success',

            filterData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
            },
            formData: {
                // donor_id: null,
                name: null,
                address: null,
                country: null,
                contact_no: null,
                donor_email:null,
                description: null,
                owner_id:null
            }
        }
    }
    async componentDidMount(){
        let owner_id = await localStorageService.getItem('owner_id')

        this.setState({
            formData:{
                owner_id:owner_id
            }
        })
    }
    async createDonar() {
       let formData =  this.state.formData
       console.log('formData',formData)
        let res = await DonarService.createDonar(this.state.formData)
        if (201 == res.status) {
            
            this.setState({
                alert: true,
                message: 'Donor Created Successfully',
                severity: 'success',
            },()=>{
                // window.location.href=`/donation/donation-donar-list`
                window.location.reload()
            })
        } else {
            this.setState({
                alert: true,
                message: 'Donor Creation was Unsuccessful',
                severity: 'error',
            })
        }
    }

    render(){
        return(
            <ValidatorForm
            className="pt-2"
            onSubmit={() => this.createDonar()}
            onError={() => null}
            >
                <Grid container spacing={2}>
                {/* <Grid item lg={6} md={6} sm={12} xs={12}>
                                <SubTitle title={"Donor ID"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Donor ID"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donor_id
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donor_id = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />

                            </Grid> */}

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <SubTitle title={"Donor Name"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donor Name"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.name = e.target.value
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

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <SubTitle title={"Donor Address"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donor Address"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .address
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.address = e.target.value
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

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <SubTitle title={"Donor Country"}></SubTitle>
                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        appConst.Country_list
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let formData = this.state.formData
                                                            formData.country = value.name
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
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'This field is required',
                                                    ]}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Select Country"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .country
                                                            }
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />
                                {/* <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donor Country"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .country
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.country = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                /> */}

                            </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <SubTitle title={"Donor Contact No"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donor Contact No"
                                    fullWidth
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .contact_no
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.contact_no = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={['required', 
                                    // "matchRegexp:(^\+([0-9\b]+$"
                                    // ,'maxNumber:' + 12
                                ]}
                                    errorMessages={[
                                        'This field is required'
                                        // , "Enter a valid Contact Number(Eg:0712345678 or 712345678 or 0111234567)"
                                        // ,'Number invalid'
                                    ]}
                                />

                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <SubTitle title={"Donor Email"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donor Email"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donor_email
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donor_email = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={['required', 'isEmail']}
                                    errorMessages={[
                                        'this field is required',
                                        'Please enter a valid Email Address'
                                    ]}
                                />

                            </Grid>


                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <SubTitle title={"Description"}></SubTitle>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Description"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .description
                                    }
                                    row={3}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.description = e.target.value
                                        this.setState({ formData })

                                    }}
                                    // validators={[
                                    //     'required',
                                    // ]}
                                    // errorMessages={[
                                    //     'This field is required',
                                    // ]}
                                />

                            </Grid> 

                            <Grid item>
                            <Button
                                    className="mr-2 mt-7"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}

                                >
                                    <span className="capitalize">Add</span>
                                </Button>
                            </Grid> 

    
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
            </ValidatorForm>
             
        )
        
    }
}

export default DonorRegistration