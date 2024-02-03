import { Button, CircularProgress, Dialog, Divider, Grid, InputAdornment, Typography, IconButton, Tooltip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { CardTitle, LoonsCard, LoonsSnackbar, LoonsTable, MainContainer, SubTitle, } from "app/components/LoonsLabComponents";
import LoonsButton from "app/components/LoonsLabComponents/Button";
import React, { Fragment } from "react";
import { Component } from "react";
import SearchIcon from '@material-ui/icons/Search';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService';
import CategoryService from 'app/services/datasetupServices/CategoryService';
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService';
import WarehouseServices from '../../services/WarehouseServices';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import ApartmentIcon from '@material-ui/icons/Apartment';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import localStorageService from 'app/services/localStorageService';
import EstimationService from 'app/services/EstimationService'
import { filter } from "lodash";
import VisibilityIcon from "@material-ui/icons/Visibility";

class Filters extends Component {

    constructor(props) {
        super(props)
        this.state = {
            updateData: {
                noOfDays: 0
            },
            alert: false,
            message: '',
            severity: 'success',
            formData: {
                orderby_sr: true,
                ven_id: null,
                class_id: null,
                category_id: null,
                group_id: null,
                sr_no:null,
                search: null
            },

            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],

            allWarehouses: [],
            all_Warehouses: [],


        }
    }



    async loadData() {
        //function for load initial data from backend or other resources
        let ven_res = await WarehouseServices.getVEN({ limit: 99999 })
        if (ven_res.status == 200) {
            console.log('Ven', ven_res.data.view.data)
            this.setState({ all_ven: ven_res.data.view.data })
        }
        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
        let class_res = await
            ClassDataSetupService.fetchAllClass({ limit: 99999 })
        if (class_res.status == 200) {
            console.log('Classes', class_res.data.view.data)
            this.setState({ all_item_class: class_res.data.view.data })
        }
        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        if (group_res.status == 200) {
            console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_group: group_res.data.view.data })
        }
    }
    async submit() {
        const { onSubmit } = this.props;
            onSubmit &&
            onSubmit(this.state.formData);
        
    }

    componentDidMount() {
        this.loadData()
    }

    render() {

        return (
            <Fragment>
               
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.submit()}
                            onError={() => null}>
                            {/* Main Grid */}
                            <Grid container="container" spacing={2} direction="row">
                                <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                    <Grid container="container" spacing={2}>

                                        <Grid item xs={12} sm={12} md={3} lg={3}>
                                            <SubTitle title="SR No"></SubTitle>
                                            <TextValidator
                                                className='w-full'
                                                placeholder="SR No"
                                                variant="outlined" size="small"
                                                value={this.state.formData.sr_no}
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData
                                                    formData.sr_no = e.target.value;
                                                    this.setState({ formData })
                                                }}
                                                /* validators={[
                                                'required',
                                                ]}
                                                errorMessages={[
                                                'this field is required',
                                                ]} */
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <SearchIcon></SearchIcon>
                                                        </InputAdornment>
                                                    )
                                                }} />

                                        </Grid>
                                        {/* Ven */}
                                        <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                            <SubTitle title="Ven" />
                                            <Autocomplete
                                                className="w-full"
                                                options={this.state.all_ven}
                                                onChange={(e, value) => {
                                                    if (value != null) {
                                                        let formData = this.state.formData
                                                        formData.ven_id = value.id
                                                        this.setState({ formData })
                                                    }
                                                }}
                                                /*  defaultValue={this.state.all_district.find(
                                                (v) => v.id == this.state.formData.district_id
                                                )} */
                                                value={this
                                                    .state
                                                    .all_ven
                                                    .find((v) => v.id == this.state.formData.ven_id)}
                                                getOptionLabel={(
                                                    option) => option.name
                                                        ? option.name
                                                        : ''}
                                                renderInput={(params) => (
                                                    <TextValidator {...params} placeholder="Ven"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                                )} />
                                        </Grid>

                                        {/* Serial/Family Number */}
                                        <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title="Item Class" />
                                            <Autocomplete
                                                className="w-full"
                                                options={this.state.all_item_class}
                                                onChange={(e, value) => {
                                                    if (value != null) {
                                                        let formData = this.state.formData
                                                        formData.class_id = value.id
                                                        this.setState({ formData })
                                                    }
                                                }}
                                                /*  defaultValue={this.state.all_district.find(
                                                (v) => v.id == this.state.formData.district_id
                                                )} */
                                                value={this
                                                    .state
                                                    .all_item_class
                                                    .find((v) => v.id == this.state.formData.class_id)}
                                                getOptionLabel={(
                                                    option) => option.description
                                                        ? option.description
                                                        : ''}
                                                renderInput={(params) => (
                                                    <TextValidator {...params} placeholder="Item Class"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                                )} />
                                        </Grid>




                                        {/* Serial Family Name*/}
                                        <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title="Item Category" />

                                            <Autocomplete
                                                className="w-full"
                                                options={this.state.all_item_category}
                                                onChange={(e, value) => {
                                                    if (value != null) {
                                                        let formData = this.state.formData
                                                        formData.category_id = value
                                                            .id
                                                        this
                                                            .setState({ formData })
                                                    }
                                                }
                                                }
                                                value={this
                                                    .state
                                                    .all_item_category
                                                    .find((v) => v.id == this.state.formData.category_id)}
                                                getOptionLabel={(
                                                    option) => option.description
                                                        ? option.description
                                                        : ''}
                                                renderInput={(params) => (
                                                    <TextValidator {...params} placeholder="Item Category"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                                )} />

                                        </Grid>

                                        {/* Item Group*/}
                                        <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title="Item Group" />

                                            <Autocomplete
                                               
                                                className="w-full"
                                                options={this.state.all_item_group}
                                                onChange={(e, value) => {
                                                    if (value != null) {
                                                        let formData = this.state.formData
                                                        formData.group_id = value
                                                            .id
                                                        this
                                                            .setState({ formData })
                                                    }
                                                }}
                                                value={this
                                                    .state
                                                    .all_item_group
                                                    .find((v) => v.id == this.state.formData.group_id)}
                                                getOptionLabel={(
                                                    option) => option.name
                                                        ?option.code+' - ' +option.name
                                                        : ''}
                                                renderInput={(params) => (
                                                    <TextValidator {...params} placeholder="Item Group"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                                )} />
                                        </Grid>

                                        <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title="Search" />

                                            <TextValidator className='w-full' placeholder="Search"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth" variant="outlined" size="small" value={this.state.formData.search} onChange={(e, value) => {
                                                        let formData = this.state.formData
                                                        formData.search = e.target.value;
                                                        this.setState({ formData })
                                                        console.log("form data", this.state.formData)
                                                    }}

                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <SearchIcon></SearchIcon>
                                                            </InputAdornment>
                                                        )
                                                    }} />
                                        </Grid>
                                        

                                        <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12} style={{ display: "flex", alignItems: 'flex-end' }}>
                                            <LoonsButton color="primary" size="medium"
                                                type="submit"
                                            >Filter</LoonsButton>
                                        </Grid>

                                    </Grid>
                                </Grid>

                            </Grid>
                        </ValidatorForm>



            </Fragment>
        )
    }
}

export default Filters;