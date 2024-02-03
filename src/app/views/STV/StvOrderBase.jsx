import React, { Component, Fragment } from "react";
import {SubTitle, DatePicker } from "app/components/LoonsLabComponents";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";
import { LoonsTable, Button } from "app/components/LoonsLabComponents";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { CircularProgress, Grid, Checkbox} from "@material-ui/core";
import * as appConst from '../../../appconst'
import { Autocomplete} from "@material-ui/lab";
import InputAdornment from '@mui/material/InputAdornment';

class StvOrderBase extends Component {

    constructor(props){
        super(props)
        this.state = {
            loading: true,
        
            filterData: {
                status: '',
                wareHouse_type: '',
                date_range: '',
                delivery_mode: '',
                districtList: '',
                limit: 20,
                page: 0,
                to_date: null,
                from_date: null,
                'order[0]': ['updatedAt', 'DESC'],
            },
            columns: [
                {
                    name: 'selection',
                    label: ' ',
                    options:{
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <Checkbox
                                        size="small"
                                        color="primary"
                                    />
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'institution_id', // field name in the row object
                    label: 'Institution ID', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="institution_id"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].institution_id}
                                            type="text"
                                            placeholder="Institution ID"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].institution_id = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'institution_name', // field name in the row object
                    label: 'Institution Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="institution_name"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].institution_name}
                                            type="text"
                                            placeholder=""
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].institution_name = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'stv_no', // field name in the row object
                    label: 'STV NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="stv_no"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].stv_no}
                                            type="text"
                                            placeholder=""
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].stv_no = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'no_of_pages', // field name in the row object
                    label: 'NO of Pages', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="no_of_pages"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].no_of_pages}
                                            type="text"
                                            placeholder=""
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].no_of_pages = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'order_id', // field name in the row object
                    label: 'Order ID', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="order_id"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].order_id}
                                            type="text"
                                            placeholder=""
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].order_id = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'allocated_items', // field name in the row object
                    label: 'Allocated Items', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="allocated_items"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].allocated_items}
                                            type="number"
                                            placeholder=""
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].allocated_items = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'dropped_items', // field name in the row object
                    label: 'Dropped Items', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="dropped_items"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].dropped_items}
                                            type="number"
                                            placeholder=""
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].dropped_items = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'required_date', // field name in the row object
                    label: 'Required Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <DatePicker
                                            className="w-full"
                                            value={this.state.filterData.required_date}
                                            //label="Date From"
                                            placeholder="Required Date"
                                            // minDate={new Date()}
                                            //maxDate={new Date("2020-10-20")}
                                            required={true}
                                            errorMessages="this field is required"
                                            onChange={date => {
                                                let filterData = this.state.filterData;
                                                filterData.required_date = date;
                                                this.setState({ filterData })

                                            }}
                                        />
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'time_slot', // field name in the row object
                    label: 'Time Slot', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="time_slot"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].time_slot}
                                            type="text"
                                            placeholder=""
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].time_slot = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'remarks', // field name in the row object
                    label: 'Remarks', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="remarks"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].remarks}
                                            type="text"
                                            placeholder=""
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].remarks = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'delivery_mode', // field name in the row object
                    label: 'Delivery Mode', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="delivery_mode"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].delivery_mode}
                                            type="text"
                                            placeholder=""
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].delivery_mode = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        /* filter: true, */
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="status"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].status}
                                            type="text"
                                            placeholder=""
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].status = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <Button
                                            // className="mr-2 mt-7"
                                            progress={false}
                                            type="submit"
                                            scrollToTop={false}

                                        >
                                            <span className="capitalize">STV</span>
                                        </Button>
                                </>
                            )
                        },
                    }
                },
            ],
            data: [
                {selection: '', institution_id: 'test', stv_no: '', no_of_pages: '', order_id: '', allocated_items: '', dropped_items: '', required_date: '', time_slot: '', remarks: '', delivery_mode: '', status: '', action: ''},
                {selection: '', institution_id: 'test', stv_no: '', no_of_pages: '', order_id: '', allocated_items: '', dropped_items: '', required_date: '', time_slot: '', remarks: '', delivery_mode: '', status: '', action: ''},
                {selection: '', institution_id: 'test', stv_no: '', no_of_pages: '', order_id: '', allocated_items: '', dropped_items: '', required_date: '', time_slot: '', remarks: '', delivery_mode: '', status: '', action: ''},
                {selection: '', institution_id: 'test', stv_no: '', no_of_pages: '', order_id: '', allocated_items: '', dropped_items: '', required_date: '', time_slot: '', remarks: '', delivery_mode: '', status: '', action: ''}
            ],
        }
    }

    render(){
        return(
            <Fragment>
                <MainContainer>
                    {/* <LoonsCard> */}
                        <ValidatorForm>
                            
                            <Grid container="container" className="mt-3 pb-5" spacing={1}>

                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <SubTitle title={"Status"}></SubTitle>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    value={this.state.filterData.status}
                                    options={appConst.status}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData = this.state.filterData;
                                            filterData.status = value;
                                            this.setState({ filterData })
                                        } else {
                                            let filterData = this.state.filterData;
                                            filterData.status = { label: "" };
                                            this.setState({ filterData })
                                        }
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please choose"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={this.state.filterData.status}
                                        />
                                    )}
                                />

                            </Grid>

                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <SubTitle title={"Date Range"}></SubTitle>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    value={this.state.filterData.date_range}
                                    options={appConst.date_range}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData = this.state.filterData;
                                            filterData.date_range = value;
                                            this.setState({ filterData })
                                        } else {
                                            let filterData = this.state.filterData;
                                            filterData.date_range = { label: "" };
                                            this.setState({ filterData })
                                        }
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please choose"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={this.state.filterData.date_range}
                                        />
                                    )}
                                />

                            </Grid>

                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <div className="mt-5"></div>
                                <DatePicker
                                            className="w-full"
                                            value={this.state.filterData.from_date}
                                            //label="Date From"
                                            placeholder=""
                                            // minDate={new Date()}
                                            //maxDate={new Date("2020-10-20")}
                                            required={true}
                                            errorMessages="this field is required"
                                            onChange={date => {
                                                let filterData = this.state.filterData;
                                                filterData.from_date = date;
                                                this.setState({ filterData })

                                            }}
                                        />

                            </Grid>

                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <SubTitle title={"To"}></SubTitle>
                                <DatePicker
                                            className="w-full"
                                            value={this.state.filterData.to_date}
                                            //label="Date From"
                                            placeholder=""
                                            // minDate={new Date()}
                                            //maxDate={new Date("2020-10-20")}
                                            required={true}
                                            errorMessages="this field is required"
                                            onChange={date => {
                                                let filterData = this.state.filterData;
                                                filterData.to_date = date;
                                                this.setState({ filterData })

                                            }}
                                        />

                            </Grid>

                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <SubTitle title={"Warehouse Type"}></SubTitle>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    value={this.state.filterData.wareHouse_type}
                                    options={appConst.wareHouse_type}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData = this.state.filterData;
                                            filterData.wareHouse_type = value;
                                            this.setState({ filterData })
                                        } else {
                                            let filterData = this.state.filterData;
                                            filterData.wareHouse_type = { label: "" };
                                            this.setState({ filterData })
                                        }
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please choose"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={this.state.filterData.wareHouse_type}
                                        />
                                    )}
                                />

                            </Grid>

                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <SubTitle title={"District"}></SubTitle>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    value={this.state.filterData.districtList}
                                    options={appConst.districtList}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData = this.state.filterData;
                                            filterData.districtList = value;
                                            this.setState({ filterData })
                                        } else {
                                            let filterData = this.state.filterData;
                                            filterData.districtList = { label: "" };
                                            this.setState({ filterData })
                                        }
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please choose"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={this.state.filterData.districtList}
                                />
                            )}
                        />

                            </Grid>

                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <SubTitle title={"Delivery Mode"}></SubTitle>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    value={this.state.filterData.delivery_mode}
                                    options={appConst.delivery_mode}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData = this.state.filterData;
                                            filterData.delivery_mode = value;
                                            this.setState({ filterData })
                                        } else {
                                            let filterData = this.state.filterData;
                                            filterData.delivery_mode = { label: "" };
                                            this.setState({ filterData })
                                        }
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please choose"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={this.state.filterData.delivery_mode}
                                />
                            )}
                        />

                            </Grid>

                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <div className="mt-5"></div>
                                    <TextValidator
                                            className='w-full'
                                            placeholder="Search Here"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .filterData.order_no || null
                                            }
                                            onChange={(e, value) => {
                                                let filterData = this.state.filterData
                                                filterData.order_no = e.target.value
                                                console.log(filterData, "filterData>>>")
                                                this.setState({ filterData })

                                            }}
                                            validators={['required']}
                                            errorMessages={['this field is required']}

                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Button

                                                            progress={false}
                                                            type="submit"
                                                            scrollToTop={false}
                                                            startIcon="search"
                                                        >
                                                            <span className="capitalize">SEARCH</span>
                                                        </Button>
                                                    </InputAdornment>
                                                )
                                            }}


                                        />
                            </Grid>

                            <Grid item className="w-full flex justify-end my-12">
                            <Button
                                    className="mr-2 mt-7"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={false}
                                >
                                    <span className="capitalize">Select All</span>
                                </Button>
                            </Grid>
                                
                                {/* Table Section */}
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    {
                                        this.state.loading
                                            ? <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'} data={this.state.data} columns={this.state.columns} options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
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

                                <Grid item >
                                    <Button
                                            className="mr-2 mt-7"
                                            progress={false}
                                            type="submit"
                                            scrollToTop={true}

                                        >
                                            <span className="capitalize">Generate Report</span>
                                        </Button>
                                    </Grid>

                            </Grid>
                        </ValidatorForm>
                    {/* </LoonsCard> */}
                </MainContainer>
            </Fragment>
        )
    }
}

export default StvOrderBase