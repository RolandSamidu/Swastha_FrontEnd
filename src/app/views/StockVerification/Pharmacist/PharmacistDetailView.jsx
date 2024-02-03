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
import PackingDetails from "./PackingDetails";






class PharmacistDetailView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonName: 'Save',
            buttonName_1: 'Close',





            institution: {
                first: null,
                mid: null,
                end: null
            },
            regno2: true,


            formData: {

                institution: '',
                ending_code_item: '',
                starting_item_code: '',


            },
            data: [
                { batch_no: <PackingDetails />, },
                { batch_no: <PackingDetails />, },
                { batch_no: <PackingDetails />, },
                { batch_no: <PackingDetails />, },
                { batch_no: <PackingDetails />, },
                { batch_no: <PackingDetails />, },




            ],
            filterData: {
                page: 0,
                limit: 20,
                issuance_type: 'pharmacy'
            },
            columns: [
                {
                    name: 'batch_no',
                    label: 'Batch No',
                    options: {
                        filter: true,

                    },
                },
                {
                    name: 'expiry_date',
                    label: 'Expiry Date',

                    options: {
                        filter: true,

                    },
                },
                {
                    name: 'serviceable_quantity',
                    label: 'Serviceable Quantity',
                    options: {
                        filter: true,
                    },

                },

                {
                    name: 'used_quantity',
                    label: 'Used Quantity',
                    options: {
                        filter: true,
                    },

                },
                {
                    name: 'expired_quantity',
                    label: 'Expired Quantity',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'Issued_quantity_and_status',
                    label: 'Issued Quantity and status',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'freeze_quantity',
                    label: 'Freeze Quantity',
                    options: {
                        filter: true,



                    },
                },

                {
                    name: 'count_quantity',
                    label: 'Count Quantity',

                    options: {
                        filter: true,

                    },
                },
                {
                    name: 'remark',
                    label: 'Remark',

                    options: {

                        filter: true,

                    },
                },

            ],



        }
    }





    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>


                        <ValidatorForm
                            ref="form"
                            className="pt-2"
                            onSubmit={this.postDriverForm}
                        >

                            <Grid container spacing={1} className="flex m-5 " alignItems="center">

                                <Grid
                                    className=" w-full flex " item lg={3} md={3} sm={12} xs={12}
                                >

                                    <SubTitle title=" Stock Take No: " />
                                    &nbsp;
                                    <SubTitle title="234467" />

                                </Grid>

                                <Grid
                                    className=" w-full flex " item lg={3} md={3} sm={12} xs={12}
                                >

                                    <SubTitle title="Institution: " />
                                    &nbsp;
                                    <SubTitle title="MSD" />

                                </Grid>




                                <Grid
                                    className=" w-full flex " item lg={3} md={3} sm={12} xs={12}
                                >

                                    <SubTitle title="Warehouse Code:" />
                                    &nbsp;
                                    <SubTitle title="435645" />

                                </Grid>

                                <Grid
                                    className=" w-full flex " item lg={3} md={3} sm={12} xs={12}
                                >

                                    <SubTitle title="Item Code:" />
                                    &nbsp;
                                    <SubTitle title="3459678" />

                                </Grid>



                            </Grid>


                            <LoonsTable
                                id={"clinicDetails"}
                                data={this.state.data}
                                columns={this.state.columns}
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: this.state.totalItems,
                                    rowsPerPage: 20,
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

                            {/* <Grid className="flex mt-5">



                                <Grid justifyContent="space-between" className=" w-full flex justify-end " item lg={12}
                                    md={12} sm={12} xs={12}>







                                    <Button
                                        className="m-2 button-danger"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}

                                    >
                                        <span className="capitalize">{this.state.buttonName_1}</span>
                                    </Button>



                                </Grid>


                            </Grid> */}




                        </ValidatorForm>
                    </LoonsCard>






                </MainContainer>

            </Fragment>

        )

    }
}

export default PharmacistDetailView