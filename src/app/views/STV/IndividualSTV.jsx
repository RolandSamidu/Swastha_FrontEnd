import { Dialog, Divider, Grid, Icon, IconButton, Typography } from "@material-ui/core";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DownloadIcon from '@mui/icons-material/Download';
import { Button, CardTitle, LoonsCard, LoonsTable, MainContainer } from "app/components/LoonsLabComponents";
import React, { Component } from "react";
import { Fragment } from "react";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";
import * as appConst from '../../../appconst'

class IndividualSTV extends Component {

    constructor(props){
        super(props)
        this.state = {
            activeStep: 1,
            mainTableColumns : [
                {
                    name: 'srNo', // field name in the row object
                    label: 'SR no', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'itemName', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'allocationTotalQuantity', // field name in the row object
                    label: 'Allocation Total Quantity', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'reason', // field name in the row object
                    label: 'Reason', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'batchNo', // field name in the row object
                    label: 'Batch No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'allocatedQuantityOfBatch', // field name in the row object
                    label: 'Allocated Quantity of Batch', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'expDate', // field name in the row object
                    label: 'Exp Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'packSize', // field name in the row object
                    label: 'Pack Size', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'unitPrice', // field name in the row object
                    label: 'Unit Price', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'value', // field name in the row object
                    label: 'Value (Rs.)', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'packed',
                    label: 'Packed',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let packed = this.state.mainTableData[tableMeta.rowIndex].packedStatus
                            return (
                                <Button
                                    className='mr-2'
                                    //color='primary'
                                    style= { { backgroundColor: packed ? '#1a72e9' : 'grey' } }
                                    onClick={() => {
                                        let mainTableData = this.state.mainTableData
                                        mainTableData[tableMeta.rowIndex].packedStatus = !mainTableData[tableMeta.rowIndex].packedStatus
                                        this.setState({
                                            mainTableData
                                    }) }} >
                                    {packed ? 'Packed' : 'Unpacked' }
                                </Button>
                            )
                        },
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

            mainTableData : [
                {
                    srNo: '0001',
                    itemName: 'Losartam 100mg',
                    allocationTotalQuantity: 10000,
                    reason: '',
                    batchNo: 50,
                    allocatedQuantityOfBatch: 0,
                    expDate: '',
                    packSize: '',
                    unitPrice: '',
                    value: '',
                    packedStatus: true,
                },
                {
                    srNo: '0001',
                    itemName: 'Losartam 100mg',
                    allocationTotalQuantity: 10000,
                    reason: '',
                    batchNo: 50,
                    allocatedQuantityOfBatch: 0,
                    expDate: '',
                    packSize: '',
                    unitPrice: '',
                    value: '',
                    packedStatus: true,
                },
            ],

            summaryTableColumns : [
                {
                    name: 'task', // field name in the row object
                    label: 'Task', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'employeeID', 
                    label: 'Employee ID', 
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'name', 
                    label: 'Name', 
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'designation', 
                    label: 'Designation', 
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'date', 
                    label: 'Date & Time', 
                    options: {
                        filter: false,
                        display: true,
                    },
                },
            ],

            summaryTableData : [
                {
                    task: 'Order Allocated By',
                    employeeID: '',
                    name: '',
                    designation: '',
                    date: '',
                },
                {
                    task: 'Order Packed By',
                    employeeID: '',
                    name: '',
                    designation: '',
                    date: '',
                },
                {
                    task: 'Order Issued By',
                    employeeID: '',
                    name: '',
                    designation: '',
                    date: '',
                },
                {
                    task: 'Order Received By',
                    employeeID: '',
                    name: '',
                    designation: '',
                    date: '',
                },
            ],

            filterData: {
                limit: 10,
                page: 0,
                type: ''
            },

            allStatus: false,

            toggleReAllocate: false,

            /*
                itemData: [
                'Item01', 'Item02',
                ]
            */

        }

        
    }

    changeAllStatus() {
        let mainTableData = this.state.mainTableData
        mainTableData.forEach( (element, index)  => {
            if( this.state.allStatus == true ){
                mainTableData[index].packedStatus = true;
            }
            else {
                mainTableData[index].packedStatus = false;
            }
            
        });
        this.setState({
            mainTableData, allStatus: !this.state.allStatus
        })
    }

  

    render () {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6" className="font-bold">Stock Transfer Voucher - STV No : Store ID/ Year/No</Typography>
                            <Button
                                color='primary'
                                onClick="">
                                Edit
                            </Button>
                        </div>

                        {/* Box */}
                        <div style={{ border: 'ridge', margin: '15px 0', padding: '5px 10px' }}>
                            <Grid container spacing={2}>
                                {/* 1st Column */}
                                <Grid item xs={12} sm={6} md={6} lg={3}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="p" className="font-semibold">Order ID:</Typography>
                                        <Typography variant="p" className="font-semibold"></Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
                                        <Typography variant="p" className="font-semibold">Invoice No:</Typography>
                                        <Typography variant="p" className="font-semibold"></Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
                                        <Typography variant="p" className="font-semibold">Issued Date & Time:</Typography>
                                        <Typography variant="p" className="font-semibold"></Typography>
                                    </div>
                                </Grid>
                                {/* 2nd Column */}
                                <Grid item xs={12} sm={6} md={6} lg={2}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="p" className="font-semibold mr-2">Order From: </Typography>
                                        <Typography variant="p" className="font-semibold">NHS</Typography>
                                    </div>
                                </Grid>
                                {/* 3rd Column */}
                                <Grid item xs={12} sm={4} md={4} lg={2} className='flex-column justify-end' >
                                    <div className="flex justify-end mr-3 mb-2" >
                                        <Typography variant="p" className="font-semibold mr-2 ">No of Issued Items </Typography>
                                        <Typography variant="h5" className="font-semibold">3</Typography>
                                    </div>
                                    <Button
                                        color='primary'
                                        onClick=""
                                        className='mb-3' >
                                        Order Composition
                                    </Button>
                                </Grid>
                                {/* 4th Column */}
                                <Grid item xs={6} sm={4} md={4} lg={3}>
                                    <div style={{ display: 'flex', alignItems: 'center'}}>
                                        <Typography variant="p" className="font-semibold mr-2">Order delivery type : </Typography>
                                        <Typography variant="p" className="font-semibold mr-2">Pick Up</Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }} className='mr-3' >
                                        <Typography variant="p" className="font-semibold mr-2">Vehicle: </Typography>
                                        <LocalShippingIcon  style={{ display: 'flex', alignItems: 'left' }}/>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="p" className="font-semibold mr-2 ">ID: </Typography>
                                        <Typography variant="p" className="font-semibold">#</Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="p" className="font-semibold mr-2 ">Type:</Typography>
                                        <Typography variant="p" className="font-semibold">Light Truck</Typography>
                                    </div>
                                </Grid>
                                {/* 5th Column */}
                                <Grid item xs={6} sm={4} md={4} lg={2}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography variant="p" className="font-semibold mr-2">Custodian: </Typography>
                                        <Typography variant="p" className="font-semibold"> </Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="p" className="font-semibold mr-2 ">ID: </Typography>
                                        <Typography variant="p" className="font-semibold">#</Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="p" className="font-semibold mr-2 ">Name:</Typography>
                                        <Typography variant="p" className="font-semibold">H.K.Wijesinghe</Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="p" className="font-semibold mr-2 ">Contact:</Typography>
                                        <Typography variant="p" className="font-semibold">0774435441</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>

                        <Grid container spacing={2} style={{ margin: '25px 0' }} >
                                <Grid item xs={6} sm={6} md={8} lg={8}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="h6" className="font-semibold">Filters</Typography>
                                        <Typography variant="p" className="font-semibold"></Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6} sm={6} md={4} lg={4}>
                                    {/* 
                                    <div className="w-full pl-20" >
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className="size-24 bg-secondary mr-2" ></div>
                                            <Typography variant="p" className="font-semibold">Items which quantity is zero in my Stock</Typography>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className="size-24 bg-green mr-2" ></div>
                                            <Typography variant="p" className="font-semibold">Alternative Items</Typography>
                                        </div>
                                    </div>
                                    */}
                                    <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
                                        <Typography variant="p" className="font-semibold mr-2">Search</Typography>
                                        <ValidatorForm>
                                             <TextValidator
                                            className=" w-full"
                                            name="search"
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        /> 
                                        </ValidatorForm>
                                    </div>
                                </Grid>
                        </Grid>
                        <Divider/>

                        {/* Main Table */}
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <LoonsTable
                                            id={'mainTable'}
                                            data={this.state.mainTableData}
                                            columns={this.state.mainTableColumns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: this.state.filterData.limit,
                                                page: this.state.filterData.page,
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

                        <div className="w-full flex justify-end my-12 " >
                            <Button
                                className='mr-2'
                                color='primary'
                                onClick = {() => {
                                    this.setState({
                                        toggleReAllocate: true
                                    })
                                } }>
                                Re-allocate
                            </Button>
                            <Button
                                className='mr-2'
                                style = {{ backgroundColor: this.state.allStatus ? 'gray' : '#1a72e9' }}
                                onClick= {() => {
                                    this.changeAllStatus();
                                } }>
                                { this.state.allStatus ? 'All Unpacked' : 'All Packed' }
                            </Button>
                            <Button
                                className='mr-2'
                                color='primary'
                                onClick="">
                                Issue
                            </Button>
                        </div>
                    </LoonsCard>

                    {/* Summary Table */}
                    <Grid className='mt-3' container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={6}>
                            <LoonsCard>
                                <CardTitle title="Order Summary"/>
                                {/* Task */}
                                <LoonsTable
                                            id={'summaryTable'}
                                            data={this.state.summaryTableData}
                                            columns={this.state.summaryTableColumns}
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
                        </Grid>
                    </Grid>

                    {/* Pop-Up */}
                    <Dialog
                        open={this.state.toggleReAllocate}
                        fullWidth="fullWidth"
                        maxWidth="sm">
                        <div className="w-full bg-light-gray py-12 px-8 " >
                            <CardTitle title='State reason to Re-Allocate'></CardTitle>
                            <ValidatorForm>
                                <Grid className='mt-3' container spacing={2}>
                                    <Grid item xs={2} sm={2} md={2} lg={2}>
                                        <Typography variant="p" className="font-semibold mr-2">Item</Typography> 
                                    </Grid>
                                    <Grid item xs={10} sm={10} md={10} lg={10}>
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
                                                placeholder="Load items which only including this STV"
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
                                    <Grid item xs={2} sm={2} md={2} lg={2}>
                                        <Typography variant="p" className="font-semibold mr-2">Reason</Typography> 
                                    </Grid>
                                    <Grid item xs={10} sm={10} md={10} lg={10}>
                                        <TextValidator
                                            className=" w-full"
                                            name="reason"
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            multiline
                                            rows={3}
                                        />   
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} className="mt-3" >
                                    <Grid item lg={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            style = {{ backgroundColor: 'gray' }}
                                            className='mr-2'
                                            type=''
                                            onClick= {() => {
                                                this.setState({
                                                    toggleReAllocate: false
                                                })
                                            } } >
                                            Cancel
                                        </Button>
                                        <Button
                                            className='mr-2'
                                            type=''>
                                            Send
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>    
                        </div>
                    </Dialog>
                    
                </MainContainer>
            </Fragment>
        )
    }
}

export default IndividualSTV