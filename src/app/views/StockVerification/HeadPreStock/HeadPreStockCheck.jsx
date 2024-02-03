import React, { Component, Fragment } from "react";
import { LoonsSnackbar, MainContainer, SubTitle } from "../../../components/LoonsLabComponents";
import { Grid, Box } from '@material-ui/core'
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

class HeadPreStockCheck extends Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonName: 'check',



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



        }
    }





    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={"Pre Stock Check"} />

                        <ValidatorForm

                            ref="form"
                            className="pt-2"

                        >

                            <Grid container spacing={1} className="flex " >

                                <Grid

                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Warehouse Code" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={appConst.wareHouse_type}
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
                                                placeholder="Choose Warehouse"
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
                                    <SubTitle title="Item Group" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={appConst.item_usage_types}
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
                                                placeholder="Choose Item Group"
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
                                    <SubTitle title="Item Codes" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={appConst.item_usage_types}
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
                                                placeholder="Choose Item Codes"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid
                                    className="flex w-full" item lg={6} md={6} sm={12} xs={12}>

                                    <Grid
                                        className="w-full" item lg={6} md={6} sm={12} xs={12}
                                    >
                                        <SubTitle title="Starting Item Code" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Enter Starting Item Code"
                                            name="starting_item_code"
                                            InputLabelProps={{ shrink: false }}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            value={this.state.formData.starting_item_code}
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.starting_item_code =
                                                    e.target.value
                                                this.setState({ formData })
                                            }}

                                        />
                                    </Grid>

                                    &nbsp;

                                    <Grid
                                        className="w-full" item lg={6} md={6} sm={12} xs={12}
                                    >
                                        <SubTitle title="Ending Item Code" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Enter Ending Item Code"
                                            name="ending_code_item"
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





                                </Grid>
                            </Grid>










                            <Grid justifyContent="space-between" className=" w-full flex justify-end mb-3" item lg={12}
                                md={12} sm={12} xs={12}>

                                <Button
                                    className="my-5 px-4"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    onClick={() => {

                                        window.location.href = `/HeadPreStockDisplay`

                                    }}

                                >
                                    <span className="capitalize">{this.state.buttonName}</span>
                                </Button>
                            </Grid>
                        </ValidatorForm>
                    </LoonsCard>



                </MainContainer>

            </Fragment>

        )

    }
}

export default HeadPreStockCheck
