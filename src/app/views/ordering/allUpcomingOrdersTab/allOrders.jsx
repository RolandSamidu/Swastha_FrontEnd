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
import { getAllUpcomingOrders } from "../redux/action";
import localStorageService from "app/services/localStorageService";
import { filter } from "lodash";

class ReturnMode extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: [{
                label: "Active",
                value: "Active"
            }, {
                label: "Processing",
                value: "Processing"
            }, {
                label: "Pending",
                value: "Pending"
            }, {
                label: "Completed",
                value: "Completed"
            }],
            data: this.props.data,
            updateData: {
                noOfDays: 0
            },

            loading: false,
            columns: [
                // {
                //     name: "id",
                //     label: "Action",
                //     options: {
                //         display: true,
                //         width: 10,
                //         // setCellProps: () => ({ style: { minWidth: "200px", maxWidth: "200px" } }),
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <IconButton
                //                     className="text-black mr-2"
                //                     onClick={null}
                //                 >
                //                     <RemoveRedEyeIcon onClick={() => this.props.history.push(`/create/return/${value}`)}>mode_view_outline</RemoveRedEyeIcon>
                //                 </IconButton>
                //             );
                //         }

                //     }
                // },

                {
                    name: 'Order_item', // field name in the row object
                    label: 'SR NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    {value ?.item?.sr_no}
                                </>
                            );
                        }
                    }
                },

                {
                    name: 'Order_item', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        width: 30,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    {value ?.item?.medium_description}
                                </>
                            );
                        }
                        // setCellProps: () => ({ style: { minWidth: "100px", maxWidth: "100px" } }),

                    }
                },
                // {
                //     name: 'uom', // field name in the row object
                //     label: 'UOM', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: false,
                //         width: 10
                //     }
                // },
                {
                    name: 'Order_item', // field name in the row object
                    label: 'Item Type', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    {value ?.item?.type}
                                </>
                            );
                        }
                    }
                },
                {
                    name: 'mystock_months', // field name in the row object
                    label: 'VEN', // column title that will be shown in table
                    options: {
                        display: false,
                        filter: true,
                        width: 30,
                        setCellProps: () => ({ style: { minWidth: "200px", maxWidth: "200px" } }),
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     return (
                        //         <>
                        //             {value ? (parseFloat(value)).toFixed(1) : ''}
                        //         </>
                        //     );
                        // }

                    }
                },
                // {
                //     name: 'mystock_quantity', // field name in the row object
                //     label: 'Procuement agent', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
                {
                    name: 'Order_item', // field name in the row object
                    label: 'Standard Unit Cost', // column title that will be shown in table,
                    options: {
                        filter: true,
                        display: true,
                        width: 10,

                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    {value?.item?.standard_cost}
                                </>
                            );
                        }
                    }

                },
                // {
                //     name: 'batch_no', // field name in the row object
                //     label: 'Annual estimation for 2023', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
                {
                    name: 'quantity ', // field name in the row object
                    label: 'MSD Stock', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                // {
                //     name: 'test', // field name in the row object
                //     label: 'Due on order stock', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,

                    }
                },

                // {
                //     name: 'test', // field name in the row object
                //     label: 'Action', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
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

        const params = {
            page,
            limit,
            created_by: localStorageService.getItem("userInfo").id,
            form: this.props.filter[0]?.from ? moment(this.props.filter[0]?.from).format("YYYY-MM-DD") : null,
            to: this.props.filter[0]?.to ? moment(this.props.filter[0]?.to).format("YYYY-MM-DD") : null,
            agent: this.props.filter[0]?.agent?.value,
            order_type: this.props.filter[0]?.orderType?.value,
            status: this.props.filter[0]?.status?.value,

        }
        this.props.getAllUpcomingOrders(params)

    }

    handleSearchButton = () => {

    }


    render() {

        return (
            <MainContainer>
                {console.log(this.props.status, this.props.data?.currentPage, this.props.data, "sttaus>>>>")}

                <Grid container="container" className="mt-3 pb-5">
                    <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                        {
                            !this.props.status
                                ? <LoonsTable
                                    //title={"All Aptitute Tests"}
                                    id={'allAptitute'} data={this.props.data?.data || []} columns={this.state.columns} options={{
                                        pagination: true,
                                        serverSide: true,
                                        rowsPerPage: 20,
                                        count: this.props.data?.totalItems || 0,
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
                {/* <Changewarehouse isOpen={this.props.isOpen} type="returnMode" /> */}
            </MainContainer>
        )
    }


}

const mapDispatchToProps = dispatch => {
    return {
        getAllUpcomingOrders: (params) => getAllUpcomingOrders(dispatch, params)
    }
}

const mapStateToProps = ({ returnReducer }) => {

}




export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReturnMode));