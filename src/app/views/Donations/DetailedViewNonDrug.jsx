import React, { Component, Fragment } from "react";
import { Button, Grid } from "@material-ui/core";
import { LoonsCard, MainContainer, CardTitle, SubTitle } from "app/components/LoonsLabComponents";
import { Autocomplete } from "@mui/material";
import { ValidatorForm,  TextValidator} from "react-material-ui-form-validator";

class DetailedViewDrug extends Component {

    constructor(props){
        super(props)
        this.state = {
            filterData: {
                donor_name: '',
                donor_contact_no: '',
                delivery_date: '',
                donor_agency: '',
                donor_country: '',
                donor_person: '',
                description: '',
                manufacturer: '',
            },
            formData: {
                donor_name: null,
            }
        }
    }

    render(){
        return(
            <MainContainer>
                <LoonsCard>
                    <ValidatorForm>
                    <Grid item lg={12} className="w-full mt-2">
                        <Grid container spacing={1} className="flex">
                            <Grid className=" w-full" item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Donor Name" />
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donar Name"
                                    fullWidth
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donar_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donar_name = e.target.value
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

                            <Grid className=" w-full" item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Donor Contact No" />
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donar Name"
                                    fullWidth
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donar_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donar_name = e.target.value
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

                            <Grid className=" w-full" item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Delivery Date" />
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donar Name"
                                    fullWidth
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donar_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donar_name = e.target.value
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

                            <Grid className=" w-full" item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Donor Agency" />
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donar Name"
                                    fullWidth
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donar_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donar_name = e.target.value
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

                            <Grid className=" w-full" item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Donor Country" />
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donar Name"
                                    fullWidth
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donar_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donar_name = e.target.value
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

                            <Grid className=" w-full" item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Delivery Person" />
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donar Name"
                                    fullWidth
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donar_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donar_name = e.target.value
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

                            <Grid className=" w-full" item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Description" />
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donar Name"
                                    fullWidth
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donar_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donar_name = e.target.value
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

                            <Grid className=" w-full" item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Manufacturer" />
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donar Name"
                                    fullWidth
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donar_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donar_name = e.target.value
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
                    </Grid> 
                    </ValidatorForm>
                </LoonsCard><br/>

                <LoonsCard>
                <ValidatorForm>
                <Grid item lg={12} className="w-full mt-2">
                        <Grid container spacing={1} className="flex">
                            <Grid className=" w-full" item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="SR No" />
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donar Name"
                                    fullWidth
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donar_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donar_name = e.target.value
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

                            <Grid className=" w-full" item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Item Name" />
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donar Name"
                                    fullWidth
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donar_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donar_name = e.target.value
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

                            <Grid className=" w-full" item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Item Description" />
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donar Name"
                                    fullWidth
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donar_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donar_name = e.target.value
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

                            <Grid className=" w-full" item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Quantity" />
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donar Name"
                                    fullWidth
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donar_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donar_name = e.target.value
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

                            <Grid className=" w-full" item
                                lg={6}
                                md={6}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Manufacturer" />
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donar Name"
                                    fullWidth
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donar_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donar_name = e.target.value
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

                            <Grid className=" w-full" item
                                lg={6}
                                md={6}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Note" />
                                <TextValidator
                                    className='w-full'
                                    placeholder="Enter Donar Name"
                                    fullWidth
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .donar_name
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.donar_name = e.target.value
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
                    </Grid>
                    </ValidatorForm>
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default DetailedViewDrug;