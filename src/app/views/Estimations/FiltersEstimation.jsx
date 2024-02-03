import { Button, CircularProgress, Dialog, Divider, Grid, InputAdornment, Typography, IconButton, Tooltip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { CardTitle, LoonsCard, LoonsSnackbar, LoonsTable, MainContainer, SubTitle, DatePicker, } from "app/components/LoonsLabComponents";
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
import ClinicService from "app/services/ClinicService";
import { filter } from "lodash";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { yearMonthParse, dateParse, yearParse } from 'utils'
import * as appConst from '../../../appconst'

class FiltersEstimation extends Component {
    static propTypes = {
        disableInstitiute: Boolean,
        disableYear: Boolean,
        disableCategery: Boolean,
        disableSearch: Boolean
    };

    static defaultProps = {
        disableInstitiute: false,
        disableYear: false,
        disableCategery: false,
        disableSearch: false,
    };
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
                ven_id: null,
                class_id: null,
                category_id: null,
                consumables: null,
                group_id: null,
                sr_no: null,
                search: null
            },
            all_institiutes: [],

            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],

            allWarehouses: [],
            all_Warehouses: [],


        }
    }

    async getPharmacyDet(search) {

        let params = {
            issuance_type: ["Hospital", "RMSD Main"],
            'order[0]': ['createdAt', 'ASC'],
            limit: 20,
            search: search
        };

        let res = await ClinicService.fetchAllClinicsNew(params, null);
        if (res.status == 200) {
            this.setState({
                all_institiutes: res?.data?.view?.data
            })
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
        const {
            disableInstitiute,
            disableYear,
            disableCategery,
            disableSearch,
        } = this.props;


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


                                {!disableInstitiute &&
                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                        <SubTitle title="Institiute" />
                                        <Autocomplete
                                            className="w-full"
                                            options={this.state.all_institiutes}
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData = this.state.formData
                                                    formData.owner_id = value.owner_id
                                                    this.setState({ formData })
                                                } else {
                                                    let formData = this.state.formData
                                                    formData.owner_id = null
                                                    this.setState({ formData })
                                                }
                                            }}
                                            /*  defaultValue={this.state.all_district.find(
                                            (v) => v.id == this.state.formData.district_id
                                            )} */
                                            //value={this.state.all_institiutes?.find((v) => v.owner_id == this.state.formData.owner_id)}
                                            getOptionLabel={(option) => option.name ? option.name + " - " + option?.Department?.name : ''}
                                            renderInput={(params) => (
                                                <TextValidator {...params}
                                                    placeholder="Institiute"
                                                    onChange={(e) => {
                                                        if (e.target.value.length > 2) {
                                                            this.getPharmacyDet(e.target.value)
                                                        }
                                                    }}
                                                    //variant="outlined"
                                                    fullWidth="fullWidth" variant="outlined" size="small" />
                                            )} />
                                    </Grid>
                                }
                                {!disableYear &&
                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                        <SubTitle title="Estimation Year" />
                                        <DatePicker

                                            className="w-full"
                                            onChange={(date) => {
                                                let formData = this.state.formData
                                                if (date == null || date == "") {
                                                    formData.year = null
                                                } else {
                                                    formData.year = yearParse(date)
                                                }
                                                this.setState({ formData })
                                            }}
                                            format="yyyy"
                                            openTo='year'
                                            views={["year"]}
                                            value={this.state.formData.year}/* new Date(this.state.formData.year, 0, 1) */
                                            placeholder="Year"

                                        />
                                    </Grid>
                                }
                                {!disableCategery &&
                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                        <SubTitle title="Institute Category" />

                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={appConst.institute_category}
                                            onChange={(e, value) => {
                                                let formData = this.state.formData
                                                formData.institute_category = value.value
                                                this.setState({
                                                    formData,
                                                })

                                            }}
                                            defaultValue={
                                                appConst.institute_category.find(x => x.value == this.state.formData.institute_category)
                                            }
                                            value={appConst.institute_category.find(x => x.value == this.state.formData.institute_category)
                                            }
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(
                                                params
                                            ) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Institute Category"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />

                                            )}
                                        />

                                    </Grid>
                                }

                                {!disableSearch &&
                                    <Grid item="item" xs={12} sm={12} md={3} lg={3}>
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
                                }

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

export default FiltersEstimation;