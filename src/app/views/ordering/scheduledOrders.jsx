import { CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Select, TextField, Tooltip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { LoonsCard, LoonsTable, MainContainer, SubTitle, Button } from "app/components/LoonsLabComponents";
import React from "react";
import { Component } from "react";
import SearchIcon from '@material-ui/icons/Search';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SimpleCard from "app/components/cards/SimpleCard"
import moment from "moment";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { DatePicker } from "@material-ui/pickers";
// import Changewarehouse from "../changeWareHouseComponent";
// import localStorageService from "app/services/localStorageService";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

class ReturnMode extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            updateData: {
                noOfDays: 0
            },

            loading: false,
            columns: [
                {
                    name: "id",
                    label: "Action",
                    options: {
                        display: true,
                        width: 10,
                        // setCellProps: () => ({ style: { minWidth: "200px", maxWidth: "200px" } }),
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <IconButton
                                    className="text-black mr-2"
                                    onClick={null}
                                >
                                    <RemoveRedEyeIcon onClick={() => this.props.history.push(`/create/return/${value}`)}>mode_view_outline</RemoveRedEyeIcon>
                                </IconButton>
                            );
                        }

                    }
                },

                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },

                {
                    name: 'item_name', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        width: 30,
                        // setCellProps: () => ({ style: { minWidth: "100px", maxWidth: "100px" } }),

                    }
                },
                {
                    name: 'uom', // field name in the row object
                    label: 'UOM', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: false,
                        width: 10
                    }
                },
                {
                    name: 'min_pack', // field name in the row object
                    label: 'Item type', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'mystock_months', // field name in the row object
                    label: 'ven', // column title that will be shown in table
                    options: {
                        display: false,
                        filter: true,
                        width: 30,
                        setCellProps: () => ({ style: { minWidth: "200px", maxWidth: "200px" } }),
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    {value ? (parseFloat(value)).toFixed(1) : ''}
                                </>
                            );
                        }

                    }
                },
                {
                    name: 'mystock_quantity', // field name in the row object
                    label: 'Procuement agent', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'no_of_batches', // field name in the row object
                    label: 'Standard unit costs', // column title that will be shown in table

                },
                {
                    name: 'batch_no', // field name in the row object
                    label: `Annual estimation for ${new Date().getFullYear()}`, // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'test', // field name in the row object
                    label: 'MSD stock', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'test', // field name in the row object
                    label: 'Due on order stock', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'exp_date', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {value ? moment(value).format("YYYY-MM-DD") : ""}
                                </span>
                            );
                        }
                    }
                },

                {
                    name: 'test', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
            ],
            totalItems: 0,
            rowsPerPage: 20,
            page: 0,
            categories: [],
            currentCategory: "",
            currentClass: "",
            currentGroup: "",
            shortExpiry: "",
            consumabletTmePeriodFromDate: "",
            consumabletTmePeriodtoDate: "",
            group: [],
            classes: [],
            warehouse_id: "",
            search: "",
            consumptionOptions: [{
                label: "Non Moving surplus stock",
                value: "Non Moving surplus stock"
            }, {
                label: "Moving surplus stock",
                value: "Moving surplus stock"
            }],
            ConsumableTimePeriod: ""
        }
    }


    componentDidMount() {


    }

    handleResetButton = () => {

    }

    componentWillReceiveProps(nextProps) {

    }

    handlechange = (data, name) => {


    }

    handleFilterButton = () => {

    }

    handlePaginations = (page, limit) => {

    }

    handleSearchButton = () => {

    }


    render() {

        return (
            <MainContainer>
                <LoonsCard>

                    <Grid container spacing={2}>
                        <Grid item lg={6} xs={12} className='mt-5'>
                            <h4 >All Scheduled Orders- Purchase Requiations</h4>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item lg={8} md={8} sm={3} xs={3} className="px-2">
                        </Grid>



                    </Grid>
                    <ValidatorForm
                        className=""
                        onSubmit={() => this.SubmitAll()}
                        onError={() => null}>

                        <Grid container>

                            {/* <Grid item lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
                                <h2>No of All Orders : {this.state.all_orders}</h2>
                            </Grid> */}

                        </Grid>
                        <Grid container className='mt-5'>
                            <Grid item lg={12} md={12} sm={3} xs={3} className="px-2">
                                <ValidatorForm>
                                    <table>
                                        <tr>
                                            <td>total order quantity</td>
                                            <td></td>
                                            <td>from</td>
                                            <td><TextValidator
                                                className='w-full'
                                                placeholder="Net.Weight"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"


                                            />
                                            </td>
                                            <td> to</td>
                                            <td><TextValidator
                                                className='w-full'
                                                placeholder="Net.Weight"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"


                                            />
                                            </td>

                                        </tr>
                                        <tr>
                                            <td>Price range</td>
                                            <td> <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={this.state.group}

                                                getOptionLabel={(option) =>
                                                    option.name ?
                                                        (option.name)
                                                        : ('')
                                                }

                                                onChange={(event, value) => this.handlechange(value, "currentGroup")}
                                                value={this.state.currentGroup}
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Item Group"
                                                        //variant="outlined"
                                                        //value={}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        size="small"

                                                    />
                                                )}
                                            /></td>
                                            <td>from</td>
                                            <td><ValidatorForm> <TextValidator
                                                className='w-full'
                                                placeholder="Net.Weight"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"


                                            />
                                            </ValidatorForm></td>
                                            <td> to</td>
                                            <td><ValidatorForm> <TextValidator
                                                className='w-full'
                                                placeholder="Net.Weight"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"


                                            />
                                            </ValidatorForm></td>

                                        </tr>
                                        <tr>
                                            <td>Date range</td>
                                            <td> <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={this.state.group}

                                                getOptionLabel={(option) =>
                                                    option.name ?
                                                        (option.name)
                                                        : ('')
                                                }

                                                onChange={(event, value) => this.handlechange(value, "currentGroup")}
                                                value={this.state.currentGroup}
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Item Group"
                                                        //variant="outlined"
                                                        //value={}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        size="small"

                                                    />
                                                )}
                                            /></td>
                                            <td>from</td>
                                            <td><ValidatorForm> <TextValidator
                                                className='w-full'
                                                placeholder="Net.Weight"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"


                                            />
                                            </ValidatorForm></td>
                                            <td> to</td>
                                            <td><ValidatorForm> <TextValidator
                                                className='w-full'
                                                placeholder="Net.Weight"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                            </ValidatorForm></td>

                                        </tr>
                                        <tr>
                                            <td>Status</td>
                                            <td><Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={this.state.group}

                                                getOptionLabel={(option) =>
                                                    option.name ?
                                                        (option.name)
                                                        : ('')
                                                }

                                                onChange={(event, value) => this.handlechange(value, "currentGroup")}
                                                value={this.state.currentGroup}
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Item Group"
                                                        //variant="outlined"
                                                        //value={}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        size="small"

                                                    />
                                                )}
                                            /></td>
                                            <td><Button
                                                style={{ marginBottom: '20px' }}
                                                className="text-right mt-6"
                                                progress={false}
                                                scrollToTop={false}
                                                type='submit'
                                                onClick={() => { this.handleSearchButton() }}
                                            >
                                                <span className="capitalize">Filter</span>
                                            </Button></td>
                                            <td><Button
                                                style={{ marginBottom: '20px' }}
                                                className="text-right mt-6"
                                                progress={false}
                                                scrollToTop={false}
                                                type='submit'
                                                onClick={() => { this.handleSearchButton() }}
                                            >
                                                <span className="capitalize">Reset</span>
                                            </Button></td>
                                        </tr>

                                        <tr>
                                            <td>Search </td>
                                            <td><ValidatorForm> <TextValidator
                                                className='w-full'
                                                placeholder="Net.Weight"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"


                                            /></ValidatorForm></td>
                                            <td><Button style={{ marginBottom: '20px' }}
                                                className="text-right mt-6"
                                                progress={false}
                                                scrollToTop={false}
                                                type='submit'
                                                onClick={() => { this.handleSearchButton() }}
                                            >
                                                <span className="capitalize">Search</span>
                                            </Button></td>
                                        </tr>
                                    </table>
                                </ValidatorForm>
                            </Grid>

                        </Grid>

                    </ValidatorForm>

                    <Grid container="container" className="mt-3 pb-5">
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            {
                                !this.state.loading
                                    ? <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'} data={this.state.data} columns={this.state.columns} options={{
                                            pagination: true,
                                            serverSide: true,
                                            rowsPerPage: this.state.rowsPerPage,
                                            count: this.state.totalItems,
                                            rowsPerPageOptions: [20, 50, 100],
                                            page: this.state.page,
                                            onTableChange: (action, tableState) => {
                                                switch (action) {

                                                    case 'changePage':
                                                        this.handlePaginations(tableState.page, tableState.rowsPerPage)
                                                        break;
                                                    case 'changeRowsPerPage':
                                                        this.handlePaginations(tableState.page, tableState.rowsPerPage)
                                                        break
                                                    case 'sort':
                                                        //this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:

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
                </LoonsCard>
                {/* <Changewarehouse isOpen={this.props.isOpen} type="returnMode" /> */}
            </MainContainer>
        )
    }


}

const mapDispatchToProps = dispatch => {

}

const mapStateToProps = ({ returnReducer }) => {

}




export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReturnMode));