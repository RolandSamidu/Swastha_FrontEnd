import { Dialog, Grid, Icon, IconButton, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Button, CardTitle, LoonsCard, LoonsTable, MainContainer } from "app/components/LoonsLabComponents";
import React, { Component } from "react";
import { Fragment } from "react";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst';

class GatePassDeliver extends Component {
    constructor(props){
        super(props)
        this.state = {
            activeStep: 1,
            mainTableColumns : [
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
                    name: 'orderID', // field name in the row object
                    label: 'Order ID', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'noOFItems', // field name in the row object
                    label: 'No of Items', // column title that will be shown in table
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
            ],

            mainTableData : [
                {
                    instituteID:'12345',
                    instituteName: 'ABC',
                    stvNo: '',
                },
            ],

            togglePrint: false,
        }
    }

  render (){
    return (
            <Fragment>
                <MainContainer>
                    <Grid className="flex justify-end" item xs={12} sm={12} md={12}  lg={12}>
                        <IconButton
                        className="text-black"
                        onClick = {() => {
                            this.setState({
                                togglePrint: true
                            })
                        } }
                        >
                            <Icon>print</Icon>
                        </IconButton>
                        <IconButton
                        className="text-black"
                        onClick={null}
                        >
                            <Icon>download</Icon>
                        </IconButton>
                    </Grid>

                    <LoonsCard>
                        <Grid container spacing={2} style={{ margin: '25px 0' }} >
                            <Grid className="flex" item xs={12} sm={12} md={12}  lg={8}>
                                <Typography variant="h6" className="font-semibold mr-2 ">Stock Transfer Voucher Gate Pass - Gate Pass ID</Typography>
                            </Grid>
                            <Grid className="" item xs={12} sm={12} md={12}  lg={4}>
                                <div className="flex justify-between " >
                                    <div className="flex" >
                                        <Typography variant="p" className="font-semibold mr-2 ">Order Delivery Type :</Typography>
                                        <Typography variant="p" className="font-semibold mr-2 ">Deliver</Typography>
                                    </div>
                                    <Icon>local_shipping</Icon>
                                </div>
                                <div className="" >
                                    <Typography variant="p" className="font-semibold mr-2 ">Vehicle </Typography>
                                    <ValidatorForm>
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
                                    </ValidatorForm>
                                </div>
                                <div className="flex justify-end mt-6 " >
                                    <Button
                                    color='primary'
                                    onClick="">
                                        Save
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>

                        {/* Table */}
                    <Grid className='mt-3' container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
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
                        </Grid>
                    </Grid>
                    </LoonsCard>

                    {/* Pop-Up */}
                    <Dialog
                        open={this.state.togglePrint}
                        fullWidth="fullWidth"
                        maxWidth="lg">
                        <div className="w-full p-8 " >
                            {/* Header */}
                            <div className="w-full flex justify-between" >
                                <Typography variant="p" className="font-semibold mr-2 ">Print / Download Preview </Typography>
                                <div>
                                    <IconButton
                                    className="text-black"
                                    onClick = {() => {
                                        this.setState({
                                            togglePrint: false
                                        })
                                    } }
                                    >
                                        <Icon>print</Icon>
                                    </IconButton>
                                    <IconButton
                                    className="text-black"
                                    onClick={null}
                                    >
                                        <Icon>download</Icon>
                                    </IconButton>
                                </div>
                            </div>

                            {/* Box */}
                            <Grid container spacing={2} style={{ margin: '25px 0' }} >
                                <Grid className="flex" item xs={12} sm={12} md={12}  lg={7}>
                                    <Typography variant="h6" className="font-semibold mr-2 ">Stock Transfer Voucher Gate Pass - Gate Pass ID</Typography>
                                </Grid>
                                <Grid className="" item xs={12} sm={12} md={12}  lg={2}>
                                    <div className="flex" >
                                        <Typography variant="p" className="font-semibold mr-2 ">Date :</Typography>
                                        <Typography variant="p" className="font-semibold mr-2 ">01-09-2022</Typography>
                                    </div>
                                    <div className="flex" >
                                        <Typography variant="p" className="font-semibold mr-2 ">Time :</Typography>
                                        <Typography variant="p" className="font-semibold mr-2 ">12.09.05</Typography>
                                    </div>
                                </Grid>
                                <Grid className="" item xs={12} sm={12} md={12}  lg={3}>
                                    <div className="flex" >
                                        <Typography variant="p" className="font-semibold mr-2 ">Order Delivery Type :</Typography>
                                        <Typography variant="p" className="font-semibold mr-2 ">Pick Up</Typography>
                                    </div>
                                    <div className="flex justify-between " >
                                        <Typography variant="p" className="font-semibold mr-2 ">Vehicle</Typography>
                                        <Icon>local_shipping</Icon>
                                    </div>
                                    <div className="flex" >
                                        <Typography variant="p" className="font-semibold mr-2 ">ID :</Typography>
                                        <Typography variant="p" className="font-semibold mr-2 ">#</Typography>
                                    </div>
                                    <div className="flex" >
                                        <Typography variant="p" className="font-semibold mr-2 ">Type :</Typography>
                                        <Typography variant="p" className="font-semibold mr-2 ">Light Truck</Typography>
                                    </div>
                                </Grid>
                            </Grid>

                            {/* Table */}
                            <LoonsCard>
                            <Grid className='mt-3' container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
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
                                    </Grid>
                                </Grid>   
                            </LoonsCard>

                            <Grid className='mt-3' container spacing={2}>
                                <Grid className="text-center pl-20 " style={{ margin: '50px 0' }} item xs={12} sm={12} md={6} lg={6}>
                                    <div className="flex" >
                                        <Typography variant="p" className="font-semibold mr-2 ">Name of Dispatch Officer :</Typography>
                                        <Typography variant="p" className="font-semibold mr-2 ">#</Typography>
                                    </div>
                                    <div className="flex" >
                                        <Typography variant="p" className="font-semibold mr-2 ">ID of Dispatch Officer :</Typography>
                                        <Typography variant="p" className="font-semibold mr-2 ">#</Typography>
                                    </div>
                                </Grid>
                                <Grid className="text-center " style={{ margin: '50px 0' }} item xs={12} sm={12} md={6} lg={6}>
                                    <div className="w-full flex justify-center " >
                                        <Typography variant="p" className="font-semibold mr-2 ">.....................................................</Typography>
                                    </div>
                                    <div className="w-full flex justify-center" >
                                        <Typography variant="p" className="font-semibold mr-2 ">Signature of Dispatch Officer</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                            
                        </div>
                    </Dialog>
                </MainContainer>
            </Fragment>
        )
  }
}

export default GatePassDeliver