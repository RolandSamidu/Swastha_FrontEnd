import React, { Component, Fragment } from "react";
import { LoonsSnackbar, MainContainer, SubTitle } from "../../../components/LoonsLabComponents";
import { Grid, Typography } from '@material-ui/core'
import { Button, } from 'app/components/LoonsLabComponents'
import VehicleService from "../../../services/VehicleService";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import LoonsTable from "../../../components/LoonsLabComponents/Table/LoonsTable";
import { Autocomplete } from "@material-ui/lab";
import LoonsCard from "../../../components/LoonsLabComponents/LoonsCard";
import CardTitle from "../../../components/LoonsLabComponents/CardTitle";
import Tooltip from "@material-ui/core/Tooltip";
import LoonsSwitch from "../../../components/LoonsLabComponents/Switch";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import localStorageService from "app/services/localStorageService";
import * as appConst from '../../../../appconst';
import { Box } from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import PreStockPackingDetails from "./PreStockPackingDetails";
import AddIcon from '@mui/icons-material/Add';
import StockVerificationService from "../../../services/StockVerificationService";
import { dateParse } from "utils";
import { toDate } from "date-fns";


class AllAssignVerification extends Component {
    constructor(props) {
        super(props)
        this.state = {


            actionsDisabled: false,
            loaded: false,
            stock_verification_data: [],
            fromDate: [],
            toDate: [],
            stockVerificationData: {
                page: 0,
                limit: 10,
                // type: ["Ran", "Pass"]
            },
            select_employees_data: [],
            loadedAssignEmp: false,
            institution: {
                first: null,
                mid: null,
                end: null
            },
            regno2: true,
            employee: null,


            formData: {

                institution: '',
                ending_code_item: '',
                starting_item_code: '',


            },

            filterData: {
                limit: 10,
                page: 0,
                // employee_id: null,
                'order[0]': [
                    'updatedAt', 'DESC'
                ],


            },
            columns: [
                {
                    name: 'institution_name',
                    label: 'Institution Name',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification?.Pharmacy_drugs_store?.name + ' - ' + this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification?.Pharmacy_drugs_store?.Department?.name

                        },
                    },
                },
                {
                    name: 'from_date',
                    label: 'From Date',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification?.from_date)
                        },
                    }


                },
                {
                    name: 'to_date',
                    label: 'To Date',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification?.to_date)
                        },
                    },

                },
                {
                    name: "action",
                    label: "Action",
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            const currentDate = dateParse(new Date())
                            console.log('newDate', currentDate)
                            let to_date = dateParse(this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification?.to_date)
                            console.log('newDate', to_date)
                            let colorVisibleIcon = (currentDate > to_date) ? 'info' : 'primary'

                            return (
                                <Grid className="flex items-center" >
                                    <Tooltip title="View" >
                                        <IconButton
                                            disabled={currentDate > to_date}
                                            className="px-2"
                                            onClick={() => {

                                                window.location.href = `/viewManageStock/${this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification?.id}?owner_id=${this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification?.Pharmacy_drugs_store?.owner_id}`
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <VisibilityIcon color={colorVisibleIcon} />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            );
                        }

                    }
                }

            ],



        }
    }



    // async getAssignEmployeeData() {
    //     this.setState({ loaded: false })
    //     var user = await localStorageService.getItem('userInfo');
    //     let params = this.state.filterData
    //     params.id = user.id
    //     console.log('employee', user.id)
    //     console.log('user', user)
    //     let res = await StockVerificationService.getAssignEmployeeByID(user.id);
    //     console.log('res22', res);

    //     if (res.status == 200) {

    //         console.log("data stock verification", res.data.view.data)
    //         this.setState({
    //             stock_verification_data: res.data.view.data,
    //             total_stock_verification_data: res.data.view.totalItems,
    //             loaded: true,
    //         })


    //         console.log("2nd time", res.data.view.totalItems)
    //     }
    // }

    async getAssignEmployeeData() {
        this.setState({ loaded: false })
        var user = await localStorageService.getItem('userInfo');
        let params = this.state.filterData
        params.employee_id = user.id
        console.log('employee', user.id)
        console.log('user', user)
        let res = await StockVerificationService.getAssignVerificationOfficers(params);
        console.log('res22', res);

        if (res.status == 200) {

            console.log("data stock verification", res.data.view.data)
            this.setState({
                stock_verification_data: res.data.view.data,
                total_stock_verification_data: res.data.view.totalItems,
                loaded: true,
            })


            console.log("2nd time", res.data.view.totalItems)
        }
    }

    // async DateRangeCheck() {
    //     let to_date = this.state.stock_verification_data.map(x => dateParse(x?.Stock_Verification?.to_date))
    //     console.log('todate', toDate)
    //     const currentDate = dateParse(new Date())
    //     console.log('newDate', currentDate)



    //     console.log('to_date', to_date)

    //     // this.setState({

    //     //     toDate: 
    //     // })





    //     // const toDate = this.state.toDate

    //     for (let index = 0; index < to_date.length; index++) {


    //         var date1 = new Date(currentDate);
    //         var date2 = new Date(to_date[index]);


    //         console.log('check if', date1 <= date2, currentDate, to_date[index])


    //         if (date1 <= date2) {
    //             var result =
    //                 this.setState({
    //                     actionsDisabled: false
    //                 })
    //         } else {
    //             this.setState({
    //                 actionsDisabled: true
    //             })
    //         }

    //     }


    // }

    // async getEmployee() {
    //     var user = await localStorageService.getItem('userInfo');
    //     console.log('user', user)
    //     // let res = await EmployeeServices.getEmployeeByID(user.id)
    //     // user.contact_no = res.data.view.contact_no

    //     this.setState({ employee: user.id })
    //     console.log('employee', user.id)
    // }


    componentDidMount() {
        // this.getEmployee()
        this.getAssignEmployeeData()

        // this.getSelectAssignEmployees()
        // console.log('props', this.props)


    }


    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.getAssignEmployeeData()
            }
        )
    }






    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={"All Assign Verifications"} />


                        <ValidatorForm
                            ref="form"
                            className="pt-2"
                            onSubmit={this.postDriverForm}
                        >



                            <LoonsTable
                                id={"clinicDetails"}
                                data={this.state.stock_verification_data}
                                columns={this.state.columns}
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: this.state.total_stock_verification_data,
                                    rowsPerPage: this.state.filterData.limit,
                                    page: this.state.filterData.page,

                                    onTableChange: (action, tableState) => {
                                        switch (action) {
                                            case 'changePage':
                                                this.setPage(tableState.page)
                                                break
                                            case 'sort':
                                                break
                                            default:
                                                console.log(
                                                    'action not handled.'
                                                )
                                        }
                                    },
                                }}
                            >{ }</LoonsTable>

                            <Grid className="flex mt-5">





                            </Grid>




                        </ValidatorForm>
                    </LoonsCard>






                </MainContainer>

            </Fragment>

        )

    }
}

export default AllAssignVerification