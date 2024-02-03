import { Checkbox, Grid, Icon, IconButton, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Button, CardTitle, DatePicker, LoonsCard, LoonsTable, MainContainer } from "app/components/LoonsLabComponents";
import React, { Component } from "react";
import { Fragment } from "react";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst';

class AllGAtePasses extends Component {
    constructor(props){
        super(props)
        this.state = {
            activeStep: 1,
            mainTableColumns : [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <Checkbox
                                            size="small"
                                            color='primary'
                                            onChange=''
                                        />
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'instituteID', // field name in the row object
                    label: 'Institute ID', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'instituteName', // field name in the row object
                    label: 'Institute Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'stvNo', // field name in the row object
                    label: 'STV No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'issuedItems', // field name in the row object
                    label: 'No of Issued Items? / Pieces', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'custodian', // field name in the row object
                    label: 'Custodian Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'custodianID', // field name in the row object
                    label: 'Custodian ID', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'vehicleNo', // field name in the row object
                    label: 'Vehicle No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'vehicle', // field name in the row object
                    label: 'Vehicle', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'requiredDate', // field name in the row object
                    label: 'Required Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'issuedDate', // field name in the row object
                    label: 'Issued Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'dispatchedDate', // field name in the row object
                    label: 'Dispatched Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'orderDeliveryMode', // field name in the row object
                    label: 'Order Delivery Mode', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'instituteName', // field name in the row object
                    label: 'Institute Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <IconButton
                                        className="text-black"
                                        onClick={null}
                                    >
                                        <Icon>visibility</Icon>
                                    </IconButton>
                                </>
                            )
                        },
                    },
                },
                
            ],

            mainTableData: [
                {
                    instituteID: 1234,
                    instituteName: '',
                    stvNo: 5,
                    issuedItems: '',
                    custodian:'',
                    custodianID:'',
                    vehicleNo: '',

                },
                {
                    instituteID: 1234,
                    instituteName: '',
                    stvNo: 5,
                    issuedItems: '',
                    custodian:'',
                    custodianID:'',
                    vehicleNo: '',

                },
                {
                    instituteID: 1234,
                    instituteName: '',
                    stvNo: 5,
                    issuedItems: '',
                    custodian:'',
                    custodianID:'',
                    vehicleNo: '',

                },
            ],
        }
    }
    render () {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='mt-3' >
                            <CardTitle title='Stock Transfer Voucher Gate Pass'/>
                        </div>

                        {/* Filters */}
                        <ValidatorForm>
                            <Grid container spacing={2} style={{ margin: '25px 0' }} >
                                <Grid item xs={12} sm={12} md={12}  lg={12}>
                                    <Typography variant="h6" className="font-bold">Filters</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3} className='w-full flex' >
                                    <Typography variant="p" className="font-semibold mr-2 ">Institutes</Typography>
                                    <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            // Temporarily used the appConst.remark_types data
                                            options={appConst.remark_types}
                                            getOptionLabel={(option) => option.name}
                                            getOptionSelected={(option, value) =>
                                                console.log(value)
                                            }
                                            onChange={(event, value) => {
                                                console.log('value', value)
                                                let formData = this.state.formData;
                                                formData.type = value.name
                                                this.setState({ formData })
                                            }
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Load all institutes under MSD"
                                                    //variant="outlined"
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                />
                                            )}
                                        /> 
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3} className='w-full flex' >
                                    <Typography variant="p" className="font-semibold mr-2 ">Date Range</Typography>
                                    <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            // Temporarily used the appConst.remark_types data
                                            options={appConst.remark_types}
                                            getOptionLabel={(option) => option.name}
                                            getOptionSelected={(option, value) =>
                                                console.log(value)
                                            }
                                            onChange={(event, value) => {
                                                console.log('value', value)
                                                let formData = this.state.formData;
                                                formData.type = value.name
                                                this.setState({ formData })
                                            }
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Load all institutes under MSD"
                                                    //variant="outlined"
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                />
                                            )}
                                        /> 
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3} className='w-full flex' >
                                    <Typography variant="p" className="font-semibold mr-2 ">From</Typography>
                                    <DatePicker className="w-full" name="date" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3} className='w-full flex' >
                                    <Typography variant="p" className="font-semibold mr-2 ">To</Typography>
                                    <DatePicker className="w-full" name="date" /> 
                                </Grid>
                            </Grid>
                            <Grid item xs={11} sm={11} md={11} lg={11}>
                                <div className="w-full flex justify-end " >
                                    <Typography variant="p" className="font-bold mr-3 mt-2 ">Search</Typography>
                                    <TextValidator
                                        className=" w-full"
                                        name="search"
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        placeholder="Ins.ID, Ins.Name, STV No, Custodian"
                                    />
                                    <IconButton
                                        className="text-black"
                                        onClick={null}
                                    >
                                        <Icon>search</Icon>
                                    </IconButton>
                                </div>
                            </Grid>
                        </ValidatorForm>

                        {/*Table */}
                    <Grid className='mt-3' container spacing={2}>
                        <Grid className="mt-12" item xs={12} sm={12} md={12} lg={12}>
                            <LoonsCard>
                                {/* Task */}
                                <LoonsTable
                                            id={'table'}
                                            data={this.state.mainTableData}
                                            columns={this.state.mainTableColumns}
                                            options={{
                                                pagination: false,
                                                serverSide: true,
                                                print: false,
                                                viewColumns: false,
                                                download: false,
                                                onTableChange: (action, tableState) => {
                                                    console.log(action, tableState)
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage(
                                                                tableState.page
                                                            )
                                                            break
                                                        case 'sort':
                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                            break
                                                        default:
                                                            console.log(
                                                                'action not handled.'
                                                            )
                                                    }
                                                },
                                            }}
                                        ></LoonsTable>
                            </LoonsCard>
                            <Grid className="flex justify-end my-12" item xs={11} sm={11} md={11} lg={11}>
                                <Button
                                color='primary'
                                onClick="">
                                    Generate Gate Pass
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                            
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )
    }
}

export default AllGAtePasses