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
import { getAllMovingAndNonMovingItems, getAllCategories, getAllClasses, getAllGroups, getWareHouseDetails } from "./redux/action";
import { DatePicker } from "@material-ui/pickers";
import Changewarehouse from "./changeWareHouseComponent";
import localStorageService from "app/services/localStorageService";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

class ItemStockItems extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            updateData: {
                noOfDays: 0
            },

            loading: true,
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
                                    <RemoveRedEyeIcon onClick={() => this.props.history.push(`/item_stoke/single/${value}`)}>mode_view_outline</RemoveRedEyeIcon>
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
                    label: 'Min Pack Size', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'mystock_months', // field name in the row object
                    label: 'My Stock Months', // column title that will be shown in table
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
                    label: 'My Stock Qty', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'no_of_batches', // field name in the row object
                    label: 'No of Batches', // column title that will be shown in table

                },
                {
                    name: 'batch_no', // field name in the row object
                    label: 'Batch No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                
               
                {
                    name: 'exp_date', // field name in the row object
                    label: 'Expiry Date', // column title that will be shown in table
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
                    name: 'total_remaining_days', // field name in the row object
                    label: 'Consumable Time Period', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'moving_quantity', // field name in the row object
                    label: 'Moving Surplus Stock', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'non_moving_quantity', // field name in the row object
                    label: 'Non Moving Surplus Stock', // column title that will be shown in table
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
        let userId = localStorageService.getItem("userInfo")?.id
        this.props.getWareHouseDetails({ employee_id: userId })
        if (localStorageService.getItem("Selected_Warehouse")) {
            let warehouseId = localStorageService.getItem("Selected_Warehouse")?.id;
            this.props.getAllMovingAndNonMovingItems({ page: this.state.page, limit: this.state.rowsPerPage, warehouse_id: warehouseId });
            this.setState({ warehouse_id: warehouseId });
        }
        this.props.getAllCategories();
        this.props.getAllClasses();
        this.props.getAllGroups();

    }

    handleResetButton = () => {
        // if (this.state.currentCategory !== "" || this.state.currentClass !== "" || this.state.currentGroup !== "" || this.state.ConsumableTimePeriod !== "" || this.state.shortExpiry !== "" || this.state.page != 0 || this.state.rowsPerPage != 20) {
        let warehouseId = localStorageService.getItem("Selected_Warehouse")?.id;
        this.props.getAllMovingAndNonMovingItems({ page: 0, limit: 20, warehouse_id: warehouseId });
        this.setState({
            page: 0, rowsPerPage: 20, currentCategory: "", currentClass: "", currentGroup: "", consumabletTmePeriod: "", shortExpiry: "", consumabletTmePeriodFromDate: "",
            consumabletTmePeriodtoDate: "", search: ""
        });
        // }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps?.moving_nonmovingItemsStatus) {
            this.setState({
                totalItems: nextProps?.moving_nonmovingItemsLists?.totalItems,
                data: nextProps?.moving_nonmovingItemsLists?.data,
                page: nextProps?.returnModePagination?.page,
                limit: nextProps?.returnModePagination?.limit,
                loading: false
            });
        } else {
            this.setState({
                totalItems: 0,
                page: nextProps?.returnModePagination?.page,
                limit: nextProps?.returnModePagination?.limit,
                data: [],
                loading: false
            });
        }
        if (nextProps?.categoriesStatus) {
            this.setState({
                categories: nextProps?.categoriesList
            });
        } else {
            this.setState({
                categories: []
            });
        }
        if (nextProps?.groupStatus) {
            this.setState({
                group: nextProps?.groupList
            });
        } else {
            this.setState({
                group: []
            });
        }
        if (nextProps?.classStatus) {
            this.setState({
                classes: nextProps?.classList
            });
        } else {
            this.setState({
                classes: []
            });
        }
        if (nextProps.wareHouseStatusModal === true || nextProps.wareHouseStatusModal === false) {
            this.setState({ warehouse_id: localStorageService.getItem("Selected_Warehouse") ? localStorageService.getItem("Selected_Warehouse").id : "" })
        }
    }

    handlechange = (data, name) => {
        if (data && typeof data !== "string") {

            this.setState({ [name]: data });

        } else if (data === null || data === "") {
            if (name === "consumabletTmePeriod") {
                this.setState({ consumabletTmePeriod: "", consumabletTmePeriodFromDate: "", consumabletTmePeriodtoDate: "" });
            } else {
                this.setState({ [name]: "" });
            }

        } else if (typeof data === "string") {
            if (name === "consumabletTmePeriod") {
                let todayDate = new Date();
                this.setState({ consumabletTmePeriod: data, consumabletTmePeriodtoDate: moment(new Date()).format("YYYY-MM-DD"), consumabletTmePeriodFromDate: moment(todayDate.setMonth(todayDate.getMonth() - parseInt(data))).format("YYYY-MM-DD") });
            } else {
                this.setState({ [name]: data });
            }
        }

    }

    handleFilterButton = () => {
        this.setState({ loading: true });
        let params = {
            class_id: this.state.currentClass !== "" ? this.state.currentClass.id : null,
            category_id: this.state.currentCategory !== "" ? this.state.currentCategory.id : null,
            group_id: this.state.currentGroup !== "" ? this.state.currentGroup.id : null,
            short_expiry: this.state.shortExpiry !== "" ? this.state.shortExpiry : null,
            from_date: this.state.consumabletTmePeriodFromDate !== "" ? this.state.consumabletTmePeriodFromDate : null,
            to_date: this.state.consumabletTmePeriodtoDate !== "" ? this.state.consumabletTmePeriodtoDate : null,
            page: this.state.page,
            limit: this.state.rowsPerPage,
            warehouse_id: this.state.warehouse_id

        };
        this.props.getAllMovingAndNonMovingItems(params);

    }

    handlePaginations = (page, limit) => {
        let params = {
            class_id: this.state.currentClass !== "" ? this.state.currentClass.id : null,
            category_id: this.state.currentCategory !== "" ? this.state.currentCategory.id : null,
            group_id: this.state.currentGroup !== "" ? this.state.currentGroup.id : null,
            short_expiry: this.state.shortExpiry !== "" ? this.state.shortExpiry : null,
            from_date: this.state.consumabletTmePeriodFromDate !== "" ? this.state.consumabletTmePeriodFromDate : null,
            to_date: this.state.consumabletTmePeriodtoDate !== "" ? this.state.consumabletTmePeriodtoDate : null,
            page,
            limit,
            warehouse_id: this.state.warehouse_id

        };

        this.setState({ page, rowsPerPage: limit, loading: true }, () => this.props.getAllMovingAndNonMovingItems(params));
    }

    handleSearchButton = () => {
        if (this.state.search !== "") {
            let params = {
                search: this.state.search,
                page: 0,
                limit: 20,
            }
            this.props.getAllMovingAndNonMovingItems(params);
            this.setState({
                currentCategory: "",
                currentClass: "",
                currentGroup: "",
                shortExpiry: "",
                consumabletTmePeriod: "",
                consumabletTmePeriodFromDate: "",
                consumabletTmePeriodtoDate: "",
                page: 0,
                rowsPerPage: 20
            });
        }
    }


    render() {

        return (
            <div>
               
                    <Grid container spacing={2}>
                        <Grid item lg={3} xs={12} className='mt-5'>
                            <h4 >Filters</h4>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Divider />
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
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                                <SubTitle title={"Item Category"}></SubTitle>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.categories}
                                    getOptionLabel={(option) => option.description}
                                    value={this.state.currentCategory}
                                    onChange={(event, data) => this.handlechange(data, "currentCategory")}

                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Item Category"
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
                                />
                                {/* {
                                    this.state.filterDataValidation.status ?
                                        ("") :
                                        (<span style={{ color: 'red' }}>this field is required</span>)
                                } */}

                            </Grid>
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                                <SubTitle title={"Item Class"}></SubTitle>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.classes}

                                    getOptionLabel={(option) =>
                                        option.description
                                    }
                                    onChange={(event, data) => this.handlechange(data, "currentClass")}
                                    value={this.state.currentClass}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Item Class"
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
                                />
                                {/* {
                                    this.state.filterDataValidation.to ?
                                        ("") :
                                        (<span style={{ color: 'red' }}>this field is required</span>)
                                } */}

                            </Grid>

                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                                <SubTitle title={"Item Group"}></SubTitle>
                                <Autocomplete
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
                                />
                                {/* {
                                    this.state.filterDataValidation.to ?
                                        ("") :
                                        (<span style={{ color: 'red' }}>this field is required</span>)
                                } */}

                            </Grid>
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                                <SubTitle title={"Consumable Time period"}></SubTitle>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <TextValidator className=" w-full" placeholder="consumable time period" name="shortExpiry" InputLabelProps={{
                                                    shrink: false
                                                }}
                                                    value={this.state.consumabletTmePeriod}
                                                    InputProps={{ inputProps: { min: 1 } }}

                                                    type="number"
                                                    min={1}
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e, value) => this.handlechange(e.target.value, "consumabletTmePeriod")}

                                                />
                                            </td>
                                            <td><label>Months</label></td>
                                        </tr>
                                    </tbody>
                                </table>

                            </Grid>
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                                <SubTitle title={"Short Expiry Less than"}></SubTitle>
                                <TextValidator className=" w-full" placeholder="Short Expiry " name="shortExpiry" InputLabelProps={{
                                    shrink: false
                                }}
                                    InputProps={{ inputProps: { min: 1 } }}
                                    value={this.state.shortExpiry}
                                    min
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e, value) => this.handlechange(e.target.value, "shortExpiry")}

                                />
                            </Grid>

                            <Grid item lg={1} md={1} sm={1} xs={1} className="px-2" >
                                <Button
                                    className="mt-6"
                                    progress={false}
                                    scrollToTop={false}
                                    onClick={() => this.handleFilterButton()}
                                >
                                    <span className="capitalize">Filter</span>
                                </Button>

                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1} className="px-2" >
                                <Button
                                    className="mt-6"
                                    progress={false}
                                    scrollToTop={false}
                                    onClick={() => this.handleResetButton()}
                                >
                                    <span className="capitalize">Reset</span>
                                </Button>
                                &ensp;

                            </Grid>

                            <Grid item lg={2} md={2} sm={2} xs={2} style={{ display: 'flex', flexDirection: 'column' }}>

                                <TextValidator
                                    className='w-full mt-5 pl-2'
                                    placeholder="SR No/Item Name/Item No"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e, value) => {
                                        this.setState({
                                            search: e.target.value
                                        })
                                    }}
                                    value={this.state.search}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'This field is required',
                                    ]}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {/* <SearchIcon></SearchIcon> */}
                                            </InputAdornment>
                                        )
                                    }} />

                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1} className="text-right px-2">
                                <Button
                                    className="text-right mt-6"
                                    progress={false}
                                    scrollToTop={false}
                                    type='submit'
                                    startIcon="search"
                                    onClick={() => { this.handleSearchButton() }}
                                >
                                    <span className="capitalize">Search</span>
                                </Button>
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
                
                <Changewarehouse isOpen={this.props.isOpen} type="returnMode" />
            </div>
        )
    }


}

const mapDispatchToProps = dispatch => {
    return {
        getAllMovingAndNonMovingItems: (params) => getAllMovingAndNonMovingItems(dispatch, params),
        getAllCategories: () => getAllCategories(dispatch),
        getAllClasses: () => getAllClasses(dispatch),
        getAllGroups: () => getAllGroups(dispatch),
        getWareHouseDetails: (params) => getWareHouseDetails(dispatch, params)

    }
}

const mapStateToProps = ({ returnReducer }) => {
    return {
        moving_nonmovingItemsStatus: returnReducer.movingAndNonMovingItemsStatus,
        moving_nonmovingItemsLists: returnReducer.movingAndNonMovingItemsLists,
        categoriesStatus: returnReducer.categoriesStatus,
        categoriesList: returnReducer.categoriesList,
        groupList: returnReducer.groupList,
        groupStatus: returnReducer.groupStatus,
        classList: returnReducer.classList,
        classStatus: returnReducer.classStatus,
        wareHouseStatusModal: returnReducer.wareHouseStatusModal,
        returnModePagination: returnReducer.returnModePagination,
    }

}




export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ItemStockItems));