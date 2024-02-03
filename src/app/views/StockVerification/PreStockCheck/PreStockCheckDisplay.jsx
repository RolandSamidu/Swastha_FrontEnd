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
import PreStockCheck from "./PreStockCheck";
import { Box } from "@material-ui/core";


class PreStockCheckDisplay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonName: 'check stock',
            buttonName_1: 'request details',
            buttonName_2: 'order details',



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
                            onSubmit={this.postDriverForm}

                        >
                            <Grid container spacing={1} className="flex m-5 " alignItems="center">
                                <Grid
                                    className=" w-full flex " item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Institution: " />
                                    &nbsp;
                                    <SubTitle title=" National Hospital - Kandy" />

                                </Grid>

                                <Grid
                                    className=" w-full flex " item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Warehouse Code: " />
                                    &nbsp;
                                    <SubTitle title="070" />

                                </Grid>

                                <Grid
                                    className=" w-full flex " item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Item Group: " />
                                    &nbsp;
                                    <SubTitle title="Stock Item" />

                                </Grid>

                                <Grid
                                    className=" w-full flex " item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Starting Item Code: " />
                                    &nbsp;
                                    <SubTitle title="1103456" />

                                </Grid>

                                <Grid
                                    className=" w-full flex" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Ending Item Code: " />
                                    &nbsp;
                                    <SubTitle title="1135264" />

                                </Grid>






                                <Grid

                                    className=" w-full " item lg={4} md={4} sm={12} xs={12}
                                >
                                    <SubTitle title=" Item Codes:" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        style={{
                                            width: 250,
                                        }}
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
                                                placeholder="Choose Item Code"
                                                fullWidth
                                                variant="outlined"
                                                size="small"

                                            />
                                        )}
                                    />
                                </Grid>



                            </Grid>
                            <Grid justifyContent="space-evenly" className=" w-full flex justify-space-evenly m-5" item lg={12}
                                md={12} sm={12} xs={12}>

                                <Button
                                    className="button-info px-5 mt-5"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}

                                >
                                    <span className="capitalize">{this.state.buttonName}</span>
                                </Button>

                                <Button
                                    className="button-primary px-5 mt-5"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}

                                >
                                    <span className="capitalize">{this.state.buttonName_1}</span>
                                </Button>


                                <Button
                                    className="button-success px-5 mt-5"
                                    progress={false}
                                    scrollToTop={true}
                                    type="submit"

                                >
                                    <span className="capitalize">{this.state.buttonName_2}</span>
                                </Button>

                            </Grid>
                        </ValidatorForm>
                    </LoonsCard>



                </MainContainer>

            </Fragment>

        )

    }
}

export default PreStockCheckDisplay
