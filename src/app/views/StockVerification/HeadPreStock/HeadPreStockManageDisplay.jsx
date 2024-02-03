import React, { Component, Fragment } from "react";
import { LoonsSnackbar, MainContainer, SubTitle } from "../../../components/LoonsLabComponents";
import { Grid } from '@material-ui/core'
import { Button, } from 'app/components/LoonsLabComponents'
import { Typography, Box } from '@material-ui/core'
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
import VisibilityIcon from '@material-ui/icons/Visibility';


class HeadPreStockManageDisplay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonName: 'Checked',
            buttonName_1: 'Close',
            buttonName_2: 'Finish',
            buttonName_3: 'Close',
            buttonName_4: 'Filter',



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
                { item_code: "12", uom: "test", expired_quantity: 12, serviceable_quantity: 46, quality_failed_quantity: 12, freeze_quantity: 30, count_quantity: 22, remark: 'test', },
                { item_code: "12", uom: "test", expired_quantity: 12, serviceable_quantity: 46, quality_failed_quantity: 12, freeze_quantity: 30, count_quantity: 22, remark: 'test', },
                { item_code: "12", uom: "test", expired_quantity: 12, serviceable_quantity: 46, quality_failed_quantity: 12, freeze_quantity: 30, count_quantity: 22, remark: 'test', },
                { item_code: "12", uom: "test", expired_quantity: 12, serviceable_quantity: 46, quality_failed_quantity: 12, freeze_quantity: 30, count_quantity: 22, remark: 'test', },
                { item_code: "12", uom: "test", expired_quantity: 12, serviceable_quantity: 46, quality_failed_quantity: 12, freeze_quantity: 30, count_quantity: 22, remark: 'test', },
                { item_code: "12", uom: "test", expired_quantity: 12, serviceable_quantity: 46, quality_failed_quantity: 12, freeze_quantity: 30, count_quantity: 22, remark: 'test', },
            ],
            filterData: {
                page: 0,
                limit: 20,
                issuance_type: 'pharmacy'
            },
            columns: [
                {
                    name: 'item_code',
                    label: 'Item Code',
                    options: {
                        filter: true,

                    },
                },
                {
                    name: 'uom',
                    label: 'UOM',
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
                    name: 'expired_quantity',
                    label: 'Expired Quantity',
                    options: {
                        filter: true,

                    },

                },
                {
                    name: 'quality_failed_quantity',
                    label: 'Quality Failed Quantity',
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
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="View">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                console.log(this.state.data[tableMeta.rowIndex].id)
                                                window.location.href = `/hospital-data-setup/assing_pharmacist/${this.state.data[tableMeta.rowIndex].id}` + "?owner_id=" + this.state.owner_id
                                                // var createClinicWindow = window.open(`/hospital-data-setup/assing_pharmacist/${this.state.data[tableMeta.rowIndex].id}` + "?owner_id=" + this.state.owner_id, '_blank');
                                                // createClinicWindow.data = this.state.data[tableMeta.rowIndex]
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            );
                        }

                    }
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

                            <Grid container spacing={1} className="flex " >
                                <Grid
                                    className=" w-full flex" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Stock Take No:" />
                                    &nbsp;
                                    <SubTitle title="435678" />

                                </Grid>

                                <Grid
                                    className=" w-full flex" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Stock Take Date:" />
                                    &nbsp;
                                    <SubTitle title="12/05/2022" />

                                </Grid>

                                <Grid
                                    className=" w-full flex" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title=" Institute:" />
                                    &nbsp;
                                    <SubTitle title="MOH" />

                                </Grid>


                                <Grid
                                    className=" w-full flex" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Warehouse Codes:" />
                                    &nbsp;
                                    <SubTitle title="445959" />

                                </Grid>

                                <Grid
                                    className=" w-full flex" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Item Group:" />
                                    &nbsp;
                                    <SubTitle title="Test item group" />

                                </Grid>

                                <Grid
                                    className=" w-full flex" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Warehouse Pharmacists:" />
                                    &nbsp;
                                    <SubTitle title="Test Pharmacists" />

                                </Grid>



                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >

                                    <SubTitle title="Item Codes" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={appConst.institute_type}
                                        //  value={this.state.buttonName=='update'?appConst.institution.filter((e) => 
                                        //  e.value == this.state.reg_no.mid):this.state.reg_no.mid

                                        //  }
                                        onChange={(e, value, r) => {
                                            if (null != value) {
                                                let institution = this.state.institution
                                                institution.mid = value.value
                                                this.setState({ institution })
                                            }
                                        }}
                                        // value={this.state.vehicleTypesData.find((v) => v.id === this.state.formData.vehicle_type_id)}
                                        getOptionLabel={
                                            (option) => option.label
                                        }



                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Select Item Codes"
                                                fullWidth
                                                variant="outlined"
                                                size="small"

                                            />
                                        )}
                                    />

                                </Grid>

                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >

                                    <SubTitle title="Verification Officers" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={appConst.institute_type}
                                        //  value={this.state.buttonName=='update'?appConst.institution.filter((e) => 
                                        //  e.value == this.state.reg_no.mid):this.state.reg_no.mid

                                        //  }
                                        onChange={(e, value, r) => {
                                            if (null != value) {
                                                let institution = this.state.institution
                                                institution.mid = value.value
                                                this.setState({ institution })
                                            }
                                        }}
                                        // value={this.state.vehicleTypesData.find((v) => v.id === this.state.formData.vehicle_type_id)}
                                        getOptionLabel={
                                            (option) => option.label
                                        }



                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Choose Verification Officers"
                                                fullWidth
                                                variant="outlined"
                                                size="small"

                                            />
                                        )}
                                    />

                                </Grid>

                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >

                                    <SubTitle title="Starting Item Codes" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Choose Starting Item Codes"
                                        name="starting_item_code"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.ending_code_item}
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.ending_code_item =
                                                e.target.value
                                            this.setState({ formData })
                                        }}

                                    />

                                </Grid>

                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >

                                    <SubTitle title="Ending Item Codes" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Choose Ending Item Codes"
                                        name="ending_item_code"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.ending_code_item}
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.ending_code_item =
                                                e.target.value
                                            this.setState({ formData })
                                        }}

                                    />

                                </Grid>

                                <Grid justifyContent="space-between" className=" w-full flex justify-end " item lg={12} md={12} sm={12} xs={12}>

                                    <Button
                                        className="m-2 px-5 py-1 button-primary"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}

                                    >
                                        <span className="capitalize">{this.state.buttonName_4}</span>
                                    </Button>

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

                            <Grid className="flex mt-5">




                                <Grid justifyContent="space-between" className=" w-full flex justify-end " item lg={12}
                                    md={12} sm={12} xs={12}>


                                    <Button
                                        className="m-2 px-5 py-1 button-danger"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}

                                    >
                                        <span className="capitalize">{this.state.buttonName_1}</span>
                                    </Button>


                                </Grid>

                            </Grid>
                        </ValidatorForm>







                    </LoonsCard>




                </MainContainer>

            </Fragment>

        )

    }
}

export default HeadPreStockManageDisplay
