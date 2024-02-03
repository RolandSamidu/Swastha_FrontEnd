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
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';


class HeadViewManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonName: 'Filter',



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
                { stock_take_no: "12", stock_take_date: "12/06/2023", warehouse_code: 'AR22', institution: 'testInstitution', status: 'test', freezed_by: 'test', verification_officers: 4, item_code: 'AC23', batch_no: 21, },
                { stock_take_no: "12", stock_take_date: "12/06/2023", warehouse_code: 'AR22', institution: 'testInstitution', status: 'test', freezed_by: 'test', verification_officers: 4, item_code: 'AC23', batch_no: 21, },
                { stock_take_no: "12", stock_take_date: "12/06/2023", warehouse_code: 'AR22', institution: 'testInstitution', status: 'test', freezed_by: 'test', verification_officers: 4, item_code: 'AC23', batch_no: 21, },
                { stock_take_no: "12", stock_take_date: "12/06/2023", warehouse_code: 'AR22', institution: 'testInstitution', status: 'test', freezed_by: 'test', verification_officers: 4, item_code: 'AC23', batch_no: 21, },
                { stock_take_no: "12", stock_take_date: "12/06/2023", warehouse_code: 'AR22', institution: 'testInstitution', status: 'test', freezed_by: 'test', verification_officers: 4, item_code: 'AC23', batch_no: 21, },
                { stock_take_no: "12", stock_take_date: "12/06/2023", warehouse_code: 'AR22', institution: 'testInstitution', status: 'test', freezed_by: 'test', verification_officers: 4, item_code: 'AC23', batch_no: 21, },

            ],
            filterData: {
                page: 0,
                limit: 20,
                issuance_type: 'pharmacy'
            },
            columns: [
                {
                    name: 'stock_take_no',
                    label: 'Stock Take No',
                    options: {
                        filter: true,

                    },
                },
                {
                    name: 'stock_take_date',
                    label: 'Stock Take Date',
                    options: {
                        filter: true,

                    },

                },
                {
                    name: 'warehouse_code',
                    label: 'Warehouse Code',
                    options: {
                        filter: true,
                    },

                },
                {
                    name: 'institution',
                    label: 'Institution',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'freezed_by',
                    label: 'Freezed By',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'verification_officers',
                    label: 'Verification Officers involved',
                    options: {
                        filter: true,



                    },
                },
                {
                    name: 'item_code',
                    label: 'Item Code',
                    options: {
                        filter: true,

                    },

                },
                {
                    name: 'batch_no',
                    label: 'Batch No',
                    options: {
                        filter: true,

                    },

                },

                {
                    name: 'status',
                    label: 'Status',

                    options: {
                        filter: true,



                    },
                },

                {
                    name: "h104",
                    label: "H104",
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
                                            <DescriptionSharpIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            );
                        }

                    }
                },

                {
                    name: "h167",
                    label: "H167",
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
                                            <DescriptionOutlinedIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            );
                        }

                    }
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

                                                window.location.href = `/HeadStockTake`
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
                        <CardTitle title={"View & Manage Stock Takes"} />

                        <ValidatorForm
                            ref="form"
                            className="pt-2"
                            onSubmit={this.postDriverForm}
                        >

                            <Grid container spacing={1} className="flex " >
                                <Grid
                                    className=" w-full" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Stock Take No" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Enter Stock Take No:"
                                        name="stock_no"
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
                                    className=" w-full" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Stock Take Date" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Enter Stock Take Date:"
                                        name="stock_date"
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
                                    className=" w-full" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Warehouse Codes" />

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
                                                placeholder="Choose Warehouse Code"
                                                fullWidth
                                                variant="outlined"
                                                size="small"

                                            />
                                        )}
                                    />

                                </Grid>



                                <Grid
                                    className=" w-full " item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Item Codes:" />

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
                                    className=" w-full " item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title=" Batch No:" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Enter Batch No"
                                        name="batch_no"
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

                                <Grid justifyContent="space-between" className=" w-full flex justify-end m-5" item lg={12}
                                    md={12} sm={12} xs={12}>

                                    <Button
                                        className="px-5 button-info"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}

                                    >
                                        <span className="capitalize">{this.state.buttonName}</span>
                                    </Button>
                                </Grid>













                            </Grid>





                            <Grid className="m-5" >


                                <Box sx={{ borderColor: 'button-info', border: 1, display: 'flex', justifyContent: 'space-evenly' }}>
                                    <Typography variant="title" color="inherit" noWrap>

                                        Freezed:


                                    </Typography>

                                    <Typography variant="title" color="inherit" noWrap>

                                        To be checked:


                                    </Typography>

                                    <Typography variant="title" color="inherit" noWrap>

                                        To be approved:


                                    </Typography>

                                    <Typography variant="title" color="inherit" noWrap>

                                        To be reverified:


                                    </Typography>


                                </Box>


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
                        </ValidatorForm>







                    </LoonsCard>




                </MainContainer>

            </Fragment>

        )

    }
}

export default HeadViewManage
