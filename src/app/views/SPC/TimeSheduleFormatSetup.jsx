import React, { Component, Fragment } from "react";
import { CardTitle, LoonsCard, SubTitle } from "app/components/LoonsLabComponents";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";
import { LoonsTable, Button } from "app/components/LoonsLabComponents";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { CircularProgress, Grid } from "@material-ui/core";
import * as appConst from '../../../appconst'
import { Autocomplete} from "@material-ui/lab";

class TimeSheduleFormatSetup extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            filterData: {
                limit: 20,
                page: 0,
                valid_from: '21/05/2022',
                amount_from: '100M to 200M',
                order_category: '',
                procurement_method: '',
                no_of_days: '',
                no_of_steps: '',
                status: '',
                'order[0]': ['updatedAt', 'DESC'],
            },
            columns_table1: [
                {
                    name: 'step_no', // field name in the row object
                    label: 'Step No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'procurement_step', // field name in the row object
                    label: 'Procurement Step', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'time_duration', // field name in the row object
                    label: 'Time Duration(W/D)', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'from_step', // field name in the row object
                    label: 'From Step', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'responsible_person', // field name in the row object
                    label: 'Responsible Person', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'reminder_by', // field name in the row object
                    label: 'Reminder By', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                }
            ],
            columns_table2: [
                {
                    name: 'category', // field name in the row object
                    label: 'Category', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'procurement_method', // field name in the row object
                    label: 'Procurement Method', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
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
                    <CardTitle title="Time Shedule Format Set up"/>

                    <ValidatorForm>
                        <Grid container spacing={4} className=" w-full mt-2 space between">
                            <Grid container spacing={1} className="flex">
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Order Category:" />
                                
                                </Grid>
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        value={this.state.filterData.order_category}
                                        options={appConst.order_category}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData = this.state.filterData;
                                                filterData.order_category = value;
                                                this.setState({ filterData })
                                            } else {
                                                let filterData = this.state.filterData;
                                                filterData.order_category = { label: "" };
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
                                                value={this.state.filterData.order_category}
                                    />
                                )}
                            />
                                
                                </Grid>
                            </Grid>

                            <Grid container spacing={1} className="flex">
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Procurement Method:" />
                                
                                </Grid>
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        value={this.state.filterData.procurement_method}
                                        options={appConst.procurement_method}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData = this.state.filterData;
                                                filterData.procurement_method = value;
                                                this.setState({ filterData })
                                            } else {
                                                let filterData = this.state.filterData;
                                                filterData.procurement_method = { label: "" };
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
                                                value={this.state.filterData.procurement_method}
                                    />
                                )}
                            />
                                
                                </Grid>
                            </Grid>

                            <Grid container spacing={1} className="flex">
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Step Number:" />
                                
                                </Grid>
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <div>
                                            <TextValidator
                                                className="w-full"
                                                //className=" w-full"
                                                placeholder="step 1"
                                                name="Comment"
                                                InputLabelProps={{ shrink: false }}
                                                //value={this.state.formData.phn}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {}}
                                                /* validators={['matchRegexp:^\s*([0-9a-zA-Z])\s$']}
                                        errorMessages={[
                                            'Invalid Inputs',
                                        ]} */
                                            />
                                </div>
                                
                                </Grid>
                            </Grid>

                            <Grid container spacing={1} className="flex">
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Procurement Step:" />
                                
                                </Grid>
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <div>
                                            <TextValidator
                                                className="w-full"
                                                //className=" w-full"
                                                placeholder="Please enter"
                                                name="Comment"
                                                InputLabelProps={{ shrink: false }}
                                                //value={this.state.formData.phn}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {}}
                                                /* validators={['matchRegexp:^\s*([0-9a-zA-Z])\s$']}
                                        errorMessages={[
                                            'Invalid Inputs',
                                        ]} */
                                            />
                                </div>
                                
                                </Grid>
                            </Grid>

                            <Grid container spacing={1} className="flex">
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Time Duration:" />
                                
                                </Grid>
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Number of Days:" />
                                
                                </Grid>
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={1}
                                    md={1}
                                    sm={12}
                                    xs={12}
                                >
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        value={this.state.filterData.no_of_days}
                                        options={appConst.no_of_days}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData = this.state.filterData;
                                                filterData.no_of_days = value;
                                                this.setState({ filterData })
                                            } else {
                                                let filterData = this.state.filterData;
                                                filterData.no_of_days = { label: "" };
                                                this.setState({ filterData })
                                            }
                                        }}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="1"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={this.state.filterData.no_of_days}
                                    />
                                )}
                            />
                                
                                </Grid>
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Number of Steps:" />
                                
                                </Grid>
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={1}
                                    md={1}
                                    sm={12}
                                    xs={12}
                                >
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        value={this.state.filterData.no_of_steps}
                                        options={appConst.no_of_steps}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData = this.state.filterData;
                                                filterData.no_of_steps = value;
                                                this.setState({ filterData })
                                            } else {
                                                let filterData = this.state.filterData;
                                                filterData.no_of_steps = { label: "" };
                                                this.setState({ filterData })
                                            }
                                        }}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="1"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={this.state.filterData.no_of_steps}
                                    />
                                )}
                            />
                                
                                </Grid>
                            </Grid>

                            <Grid container spacing={1} className="flex">
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Responsible Person:" />
                                
                                </Grid>
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        value={this.state.filterData.procurement_method}
                                        options={appConst.procurement_method}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData = this.state.filterData;
                                                filterData.procurement_method = value;
                                                this.setState({ filterData })
                                            } else {
                                                let filterData = this.state.filterData;
                                                filterData.procurement_method = { label: "" };
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
                                                value={this.state.filterData.procurement_method}
                                    />
                                )}
                            />
                                
                                </Grid>
                            </Grid>

                            <Grid container spacing={1} className="flex">
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Reminder By:" />
                                
                                </Grid>
                                <Grid 
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <div>
                                            <TextValidator
                                                className="w-full"
                                                //className=" w-full"
                                                placeholder="Please enter"
                                                name="Comment"
                                                InputLabelProps={{ shrink: false }}
                                                //value={this.state.formData.phn}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {}}
                                                /* validators={['matchRegexp:^\s*([0-9a-zA-Z])\s$']}
                                        errorMessages={[
                                            'Invalid Inputs',
                                        ]} */
                                            />
                                </div>
                                
                                </Grid>
                            </Grid>

                            <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Button
                                            className="mt-2"
                                            progress={false}
                                            /* onClick={() => {
                                                window.open('/');
                                            }} */
                                            scrollToTop={true}
                                        >
                                            <span className="capitalize">Add</span>
                                        </Button>
                                    </Grid>

                        </Grid>
                    </ValidatorForm>

                    <ValidatorForm>
                        {/* Table Section */}
                        <Grid container="container" className="mt-3 pb-5">
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    {
                                        this.state.loading
                                            ? <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'} data={this.state.data} columns={this.state.columns_table1} options={{
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
                            <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Button
                                            className="mt-2"
                                            progress={false}
                                            /* onClick={() => {
                                                window.open('/');
                                            }} */
                                            scrollToTop={true}
                                        >
                                            <span className="capitalize">Add</span>
                                        </Button>
                                    </Grid>
                        </Grid>
                    </ValidatorForm>

                    <ValidatorForm>
                        {/* Table Section */}
                        <Grid container="container" className="mt-3 pb-5">
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    {
                                        this.state.loading
                                            ? <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'} data={this.state.data} columns={this.state.columns_table2} options={{
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
                        </Grid>
                    </ValidatorForm>

                </LoonsCard>
            </MainContainer>
        )
    }
}

export default TimeSheduleFormatSetup