import { CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Button, DatePicker, LoonsCard, LoonsTable, MainContainer } from "app/components/LoonsLabComponents";
import React, { Component } from "react";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import * as appConst from '../../../../appconst'
import localStorageService from 'app/services/localStorageService';
import { dateTimeParse } from "utils";

class AllOdersPP extends Component {

    constructor(props) {
        super(props)
        this.state = {
            searchData: '',
            data: [],
            columns: [
                {

                    name: 'fromStore',
                    label: 'Drug Store (From)',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (tableMeta.rowData[tableMeta.columnIndex] == null) {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].name)
                            }
                        }
                    }

                },
                {

                    name: 'toStore',
                    label: 'Drug Store (To)',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (tableMeta.rowData[tableMeta.columnIndex] == null) {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].name)
                            }
                        }
                    }

                },
                {

                    name: 'order_id',
                    label: 'Oder ID',
                    options: {
                        display: true,
                    }

                },
                {

                    name: 'number_of_items',
                    label: 'No Of Items',
                    options: {
                        display: true,
                    }

                },
                {

                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                    }

                },
                {

                    name: 'required_date',
                    label: 'Required Date',
                    options: {
                        display: true,
                        customBodyRender : (tableMeta) =>{
                            return(<p>{dateTimeParse(tableMeta)}</p>)
                         }
                    }

                },
                {

                    name: 'issued_date',
                    label: 'Issue Date',
                    options: {
                        display: true,
                        customBodyRender : (tableMeta) =>{
                            return(<p>{tableMeta ? dateTimeParse(tableMeta) :'N/A'}</p>)
                         }
                    }

                },
                {

                    name: 'Delivery',
                    label: 'Time Slot (From)',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("rowdata", tableMeta.rowData[tableMeta.columnIndex].time_from);
                            if (tableMeta.rowData[tableMeta.columnIndex] == null) {
                                return 'N/A'
                            } else {
                                return (<p>{tableMeta.rowData[tableMeta.columnIndex].time_from ? dateTimeParse(tableMeta.rowData[tableMeta.columnIndex].time_from) : 'N/A'}</p>)
                            }
                        }
                    }

                },
                {

                    name: 'Delivery',
                    label: 'Time Slot (To)',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[tableMeta.columnIndex] == null) {
                                return 'N/A'
                            } else {
                                return (<p>{tableMeta.rowData[tableMeta.columnIndex].time_to ?dateTimeParse(tableMeta.rowData[tableMeta.columnIndex].time_to) :'N/A'}</p>)
                            }
                        }
                    }

                },
                {

                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('obj',this.state.data[tableMeta.rowIndex]);
                            return (
                                <IconButton
                                    className="text-black"
                                    onClick={() => this.viewIndividualOrder(this.state.data[tableMeta.rowIndex].order_requirement_id)}

                                >
                                    <Icon style={{ fontSize: 'large' }}>visibility</Icon>
                                </IconButton>)

                        }
                    }

                },


            ],
            totalItems: 0,
            filterData: {
                pickup_person_id: null,
                "order[0][0]": 'createdAt',
                "order[0][1]": 'DESC',
                status: null,
                order_status: null,
                required_date: null,
                from_date: null,
                to_date: null,
                allocated_date: null,
                delivered_date: null,
                recieved_date: null,
                issued_date: null,
                date_type: null,
                limit:10,
                page:0
            },
            tableDataLoaded: false,
        }
    }

    viewIndividualOrder(id) {
        window.location = `/order/ppprofile/all-items/${id}`;
    }

    async preLoadData() {
        this.setState({ tableDataLoaded: false })
        let res = await PharmacyOrderService.getPickUpPersonOrders(this.state.filterData)
        if (res.status == 200) {
            this.setState({
                data: res.data.view.data,
                tableDataLoaded: true,
                totalItems:res.data.view.totalItems
            },
                () => { console.log('data', this.state.data); this.render() })
            return;
        }


    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {
            console.log("New formdata", this.state.filterData)
            this.preLoadData()
        })
    }

    async componentDidMount() {
        let filterData = this.state.filterData
        let user = await localStorageService.getItem('userInfo');
        filterData.pickup_person_id = user.id
        this.setState({
            filterData
        })
        this.preLoadData();
    }

    render() {

        return (
            <>

                <LoonsCard>
                    <Grid container spacing={2} className="my-3">
                        <Grid item lg={12} xs={12}>
                            <Divider></Divider>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} >
                        <Grid item lg={3} xs={12}>
                            <h4 >Filters</h4>
                        </Grid>

                    </Grid>
                    <ValidatorForm
                        onSubmit={() => this.preLoadData()}
                        onError={() => null}>
                        <Grid container spacing={2}>
                            <Grid item lg={4} md={4} xs={12}>
                                <h5>Status </h5>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={appConst.order_status_types}
                                    /*  defaultValue={dummy.find(
                                         (v) => v.value == ''
                                     )} */
                                    getOptionLabel={(option) => option.value}
                                    getOptionSelected={(option, value) =>
                                        console.log(value)
                                    }
                                    onChange={(event, value) => {
                                        let filterData = this.state.filterData;
                                        filterData.status = value.value
                                        this.setState({ filterData })
                                    }

                                    }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Select status"
                                            //variant="outlined"
                                            value={this.state.filterData.status}
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
                            <Grid item lg={4} md={4} xs={12}>
                                <h5>Drug Store </h5>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={[{ value: "FCL" }, { value: "LCL" }, { value: "Airfreight" }]}
                                    /*  defaultValue={dummy.find(
                                         (v) => v.value == ''
                                     )} */
                                    getOptionLabel={(option) => option.value}
                                    getOptionSelected={(option, value) =>
                                        console.log(value)
                                    }
                                    onChange={(event, value) => {
                                        let filterData = this.state.filterData;
                                        filterData.drugStore = value.value
                                        this.setState({ filterData })
                                    }

                                    }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Select Store"
                                            //variant="outlined"
                                            value={this.state.filterData.drugStore}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            size="small"
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item lg={4} md={4} xs={12} style={{ display: 'flex', flexDirection: 'row' }}>
                                <Grid item xs={4}>
                                    <h5>Date</h5>
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={appConst.date_type}
                                        /*  defaultValue={dummy.find(
                                             (v) => v.value == ''
                                         )} */
                                        getOptionLabel={(option) => option.value}
                                        getOptionSelected={(option, value) =>
                                            console.log(value)
                                        }
                                        onChange={(event, value) => {
                                            let filterData = this.state.filterData;
                                            filterData.date_type = value.value
                                            this.setState({ filterData })
                                        }

                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Select type"
                                                //variant="outlined"
                                                value={this.state.filterData.date_type}
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                size="small"
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            />
                                        )}
                                    />

                                </Grid>
                                <Grid item xs={4} className='mx-3'>
                                    <h5 >From</h5>
                                    <DatePicker
                                        className="w-full"
                                        value={this.state.filterData.from_date}
                                        //label="Date From"
                                        placeholder="Date (from)"
                                        // minDate={new Date()}
                                        //maxDate={new Date("2020-10-20")}
                                        // required={true}
                                        // errorMessages="this field is required"
                                        onChange={date => {
                                            let filterData = this.state.filterData;
                                            filterData.from_date = date;
                                            this.setState({ filterData })

                                        }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <h5>To</h5>
                                    <DatePicker
                                        className="w-full"
                                        value={this.state.filterData.to_date}
                                        //label="Date From"
                                        placeholder="Date (from)"
                                        // minDate={new Date()}
                                        //maxDate={new Date("2020-10-20")}
                                        // required={true}
                                        // errorMessages="this field is required"
                                        onChange={date => {
                                            let filterData = this.state.filterData;
                                            filterData.to_date = date;
                                            this.setState({ filterData })

                                        }}
                                    />
                                </Grid>

                            </Grid>

                        </Grid>

                        <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Grid item lg={4} xs={12} >
                                <TextValidator className='w-full' placeholder="Search"
                                    //variant="outlined"
                                    fullWidth="fullWidth" variant="outlined" size="small" value={this.state.searchData}
                                    onChange={(e, value) => {
                                        let search = this.state.searchData
                                        search = e.target.value;
                                        this.setState({ searchData: search })
                                        console.log("form dat", this.state.searchData)
                                    }}
                                    /* validators={[
                                    'required',
                                    ]}
                                    errorMessages={[
                                    'this field is required',
                                    ]} */
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon></SearchIcon>
                                            </InputAdornment>
                                        )
                                    }} />

                            </Grid>
                            <Grid
                                className=" w-full"
                                item
                                lg={8}
                                md={8}
                                sm={12}
                                xs={12}
                            >
                                <Button
                                    className="mt-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    startIcon="search"
                                //onClick={this.handleChange}
                                >
                                    <span className="capitalize">Filter</span>
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container className="mt-3">
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                {this.state.tableDataLoaded ? (
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.data}
                                        columns={this.state.columns}
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
                                ) : (
                                    //load loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>

                    </ValidatorForm>
                </LoonsCard>

            </>
        )
    }

}

export default AllOdersPP