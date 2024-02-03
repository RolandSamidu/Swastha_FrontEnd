import { Grid, InputAdornment } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { SubTitle } from 'app/components/LoonsLabComponents'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import React, { Component, Fragment, useState } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search';
import WarehouseServices from 'app/services/WarehouseServices';
import CategoryService from 'app/services/datasetupServices/CategoryService';
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService';
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService';
import DivisionsServices from "app/services/DivisionsServices";
import localStorageService from 'app/services/localStorageService'

class FilterComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
           
            formData: {
                ven_id: null,
                category_id: null,
                group_id: null,
                class_id: null,
                lessStock: null,
                moreStock: null,
               
                warehouse_type: null,
                search: null
            }
        }
    }




    componentDidMount() {
        this.loadData()
       
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
    render() {
        return (
            <> < ValidatorForm onSubmit={
                () => this
                    .props
                    .onSubmitFunc(
                        this.state.formData.ven_id,
                        this.state.formData.category_id,
                        this.state.formData.class_id,
                        this.state.formData.group_id,
                        this.state.formData.warehouse_type,
                        this.state.formData.search
                    )
            }
                onError={
                    () => null
                } > <Grid container="container" spacing={2}>
                    {/* Ven */}
                    {/* <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                        <SubTitle title="Ven" />
                        <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_ven} onChange={(e, value) => {
                            let formData = this.state.formData
                            if (value != null) {
                                formData.ven_id = value.id
                            } else {
                                formData.ven_id = null
                            }

                            this.setState({ formData })
                        }}
                           
                            value={this
                                .state
                                .all_ven
                                .find((v) => v.id == this.state.formData.ven_id)} getOptionLabel={(
                                    option) => option.name
                                        ? option.name
                                        : ''} renderInput={(params) => (
                                            <TextValidator {...params} placeholder="Ven"
                                                //variant="outlined"
                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                        )} />
                    </Grid> */}

                    {/* Serial/Family Number */}
                    <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                        <SubTitle title="Item Class" />
                        <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_item_class} onChange={(e, value) => {
                            let formData = this.state.formData
                            if (value != null) {
                                formData.class_id = value.id
                            } else {
                                formData.class_id = null
                            }

                            this.setState({ formData })
                        }}
                            /*  defaultValue={this.state.all_district.find(
                            (v) => v.id == this.state.formData.district_id
                            )} */
                            value={this
                                .state
                                .all_item_class
                                .find((v) => v.id == this.state.formData.item_class_id)} getOptionLabel={(
                                    option) => option.description
                                        ? option.description
                                        : ''} renderInput={(params) => (
                                            <TextValidator {...params} placeholder="Item Class"
                                                //variant="outlined"
                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                        )} />
                    </Grid>

                   

              


                    {/* <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                        <SubTitle title="Allocated Qty >= More Than" />
                        <TextValidator
                            className=" w-full"
                            placeholder="Allocated Qty >= More Than"
                            name="stockMore"
                            InputLabelProps={{
                                shrink: false
                            }}
                            value={this.state.formData.moreStock}
                            type="number"
                            variant="outlined"
                            size="small"
                            min={0}
                            onChange={(e) => {
                                this.setState({
                                    formData: {
                                        ...this.state.moreStock,
                                        moreStock: e.target.value
                                    }
                                })
                            }} />
                    </Grid> */}

                    {/* Stock Days 1 */}
                    {/* <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                        <SubTitle title="Allocated Qty <= Less Than" />
                        <TextValidator
                            className=" w-full"
                            placeholder="Allocated Qty <= Less Than"
                            name="lessStock"
                            InputLabelProps={{
                                shrink: false
                            }}
                            value={this.state.formData.lessStock}
                            type="number"
                            variant="outlined"
                            size="small"
                            onChange={(e) => {
                                this.setState({
                                    formData: {
                                        ...this.state.formData,
                                        lessStock: e.target.value
                                    }
                                })
                            }} />
                    </Grid> */}

                    {/* Serial Family Name*/}
                    <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                        <SubTitle title="Item Category" />

                        <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_item_category} onChange={(e, value) => {
                            let formData = this.state.formData
                            if (value != null) {
                                formData.category_id = value.id
                            } else {
                                formData.category_id = null
                            }

                            this.setState({ formData })
                        }}
                            /*  defaultValue={this.state.all_district.find(
                            (v) => v.id == this.state.formData.district_id
                            )} */
                            value={this
                                .state
                                .all_item_category
                                .find((v) => v.id == this.state.formData.item_category_id)} getOptionLabel={(
                                    option) => option.description
                                        ? option.description
                                        : ''} renderInput={(params) => (
                                            <TextValidator {...params} placeholder="Item Category"
                                                //variant="outlined"
                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                        )} />
                    </Grid>

                    {/* Item Group*/}
                    <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                        <SubTitle title="Item Group" />

                        <Autocomplete
                                        disableClearable
                            className="w-full"
                            options={this.state.all_item_group}
                            onChange={(e, value) => {
                                let formData = this.state.formData
                                if (value != null) {
                                    formData.group_id = value.id
                                } else {
                                    formData.group_id = null
                                }

                                this.setState({ formData })
                            }}
                            value={this
                                .state
                                .all_item_group
                                .find((v) => v.id == this.state.formData.item_group_id)}
                            getOptionLabel={(
                                option) => option.name
                                    ? option.name
                                    : ''}
                            renderInput={(params) => (
                                <TextValidator {...params} placeholder="Item Group"
                                    //variant="outlined"
                                    fullWidth="fullWidth" variant="outlined" size="small" />
                            )} />
                    </Grid>

                    {/* Drug Store Qty*/}
                    {/* <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                    <SubTitle title="Drug Store Qty"/>

                    <TextValidator
                        className=" w-full"
                        placeholder="Drug Store Qty"
                        name="drug_store_qty"
                        InputLabelProps={{
                            shrink: false
                        }}
                        value={this.state.formData.description}
                        type="text"
                        variant="outlined"
                        size="small"
                        onChange={(e) => {
                            this.setState({
                                formData: {
                                    ...this.state.formData,
                                    description: e.target.value
                                }
                            })
                        }}
                        validators={['required']}
                        errorMessages={['this field is required']}/>
                </Grid> */
                    }

                    <Grid
                        item="item"
                        lg={3}
                        md={3}
                        sm={12}
                        xs={12}
                        className=" w-full flex justify-start">
                        {/* Submit Button */}
                        <LoonsButton className="mt-5 mr-2" progress={false} type='submit'
                        //onClick={this.handleChange}
                        >
                            <span className="capitalize">
                                Filter
                            </span>
                        </LoonsButton>
                        {/* Cancel Button */}
                        {/* <LoonsButton
                        className="mt-5"
                        progress={false}
                        scrollToTop={true}
                        color="#cfd8dc"
                        onClick={this.clearField}>
                        <span className="capitalize">
                            Show Short Expo
                        </span>
                    </LoonsButton> */
                        }
                    </Grid>
                    <Grid item="item" lg={12} md={12} xs={12}></Grid>
                    <Grid
                        item="item"
                        lg={3}
                        md={3}
                        xs={3}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: '-20px'

                        }}>
                        <SubTitle title="Search" />

                        <TextValidator className='w-full' placeholder="Search" variant="outlined" size="small"
                            //value={this.state.formData.search} 
                            onChange={(e, value) => {
                                let formData = this.state.formData
                                if (e.target.value != '') {
                                    formData.search = e.target.value;
                                } else {
                                    formData.search = null
                                }
                                this.setState({ formData })
                                console.log("form dat", this.state.formData)
                            }} onKeyPress={(e) => {
                                if (e.key == "Enter") {
                                    this
                                        .props
                                        .onSubmitFunc(
                                            this.state.formData.ven_id,
                                            this.state.formData.category_id,
                                            this.state.formData.class_id,
                                            this.state.formData.group_id,
                                            this.state.formData.search
                                        )

                                }

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
                </Grid>
            </ValidatorForm>
            </>
        )
    }
}

export default FilterComponent