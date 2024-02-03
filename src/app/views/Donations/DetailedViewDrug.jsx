import React, { Component, Fragment } from "react";
import { Grid, Button, CircularProgress } from "@material-ui/core";
import { LoonsCard, MainContainer, CardTitle, SubTitle, LoonsTable } from "app/components/LoonsLabComponents";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

class DetailedViewDrug extends Component {

    constructor(props){
        super(props)
        this.state = {
            loading: true,
            totalDonations:0,
            formData:{
                donar_name: null,
            },
            columns_for_t1: [
                {
                    name: 'pack_size', // field name in the row object
                    label: 'Pack Size', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    } 
                },
                {
                    name: 'uom', // field name in the row object
                    label: 'UOM', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    } 
                },
                {
                    name: 'qty', // field name in the row object
                    label: 'Qty', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    } 
                },
                {
                    name: 'conversion', // field name in the row object
                    label: 'Conversion', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    } 
                },
                {
                    name: 'min_pack_factor', // field name in the row object
                    label: 'Min Pack Factor', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    } 
                }
            ],
            columns_for_t2: [
                {
                    name: 'batch_no', // field name in the row object
                    label: 'Batch Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    } 
                },
                {
                    name: 'quantity', // field name in the row object
                    label: 'Quantity', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    } 
                },
                {
                    name: 'mdf', // field name in the row object
                    label: 'MDF', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    } 
                },
                {
                    name: 'exd', // field name in the row object
                    label: 'EXD', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    } 
                },
                {
                    name: 'price', // field name in the row object
                    label: 'Price', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    } 
                },
                {
                    name: 'no_of_packages', // field name in the row object
                    label: 'No of Packages', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    } 
                },
                {
                    name: 'Shelf_life', // field name in the row object
                    label: 'Shelf Life', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    } 
                },
            ]
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
                                lg={6}
                                md={6}
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
                                lg={6}
                                md={6}
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

                            <Grid className=" w-full"  style={{paddingLeft: 50}} item
                                lg={2}
                                md={2}
                                sm={6}
                                xs={6}
                            >
                                <SubTitle title="UoM" />
                            </Grid>

                            <Grid className=" w-full" item
                                lg={2}
                                md={2}
                                sm={6}
                                xs={6}
                            >
                                <SubTitle title="Height(cm)" />
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
                                lg={2}
                                md={2}
                                sm={6}
                                xs={6}
                            >
                                <SubTitle title="Width(cm)" />
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
                                lg={2}
                                md={2}
                                sm={6}
                                xs={6}
                            >
                                <SubTitle title="Length(cm)" />
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
                                lg={2}
                                md={2}
                                sm={6}
                                xs={6}
                            >
                                <SubTitle title="Net.Weight" />
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
                                lg={2}
                                md={2}
                                sm={6}
                                xs={6}
                            >
                                <SubTitle title="Gross.Weight" />
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

                    {/* Table Section */}
                    <br/>
                    <Grid container="container" className="mt-3 pb-5">
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    {
                                        this.state.loading
                                            ? <LoonsTable title="Packing Details"
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'} data={this.state.data} columns={this.state.columns_for_t1} options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalDonations,
                                                rowsPerPage: 10,
                                                page: this.state.page,
                                                onTableChange: (action, tableState) => {
                                                    console.log(action, tableState)
                                                    switch (action) {
                                                        case 'changePage':
                                                            // this.setPage(     tableState.page )
                                                            break
                                                        case 'sort':
                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                            break
                                                        default:
                                                            console.log('action not handled.')
                                                    }
                                                }
                                            }}></LoonsTable>
                                            : (
                                                //loading effect
                                                <Grid className="justify-center text-center w-full pt-12">
                                                    <CircularProgress size={30} />
                                                </Grid>  
                                            )
                                    }
                            </Grid>
                        </Grid>

                    {/* Table Section */}
                    <br/>
                    <Grid container="container" className="mt-3 pb-5">
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    {
                                        this.state.loading
                                            ? <LoonsTable title="Batch Details"
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'} data={this.state.data} columns={this.state.columns_for_t2} options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalDonations,
                                                rowsPerPage: 10,
                                                page: this.state.page,
                                                onTableChange: (action, tableState) => {
                                                    console.log(action, tableState)
                                                    switch (action) {
                                                        case 'changePage':
                                                            // this.setPage(     tableState.page )
                                                            break
                                                        case 'sort':
                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                            break
                                                        default:
                                                            console.log('action not handled.')
                                                    }
                                                }
                                            }}></LoonsTable>
                                            : (
                                                //loading effect
                                                <Grid className="justify-center text-center w-full pt-12">
                                                    <CircularProgress size={30} />
                                                </Grid>  
                                            )
                                    }
                            </Grid>
                        </Grid>
                        </ValidatorForm>
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default DetailedViewDrug;