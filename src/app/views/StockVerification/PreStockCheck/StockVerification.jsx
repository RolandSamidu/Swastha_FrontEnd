import React, { Component, Fragment } from "react";
import { LoonsSnackbar, MainContainer, SubTitle } from "../../../components/LoonsLabComponents";
import { Grid } from '@material-ui/core'
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
import StockVerificationService from "../../../services/StockVerificationService";
import EstimationService from 'app/services/EstimationService';
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService';
import { dateParse } from "utils";
import WarehouseServices from "app/services/WarehouseServices";
import InventoryService from "app/services/InventoryService";
import CategoryService from "app/services/datasetupServices/CategoryService";
import ClassDataSetupService from "app/services/datasetupServices/ClassDataSetupService";


class StockVerification extends Component {
    constructor(props) {
        super(props)
        this.state = {

            buttonName_1: 'Freeze',
            loaded: false,
            loading: false,
            submiting: false,
            stockVerificationData: {

            },
            filterData: {

            },


            institution: {
                first: null,
                mid: null,
                end: null
            },
            regno2: true,
            all_ven: [],
            allWarehouses: [],
            all_item_group: [],
            data: [],
            stock_verification_data: [],
            item_list: [],
            all_item_category: [],
            all_item_class: [],


            formData: {

                // institution: '',
                stock_verification_id: null,
                warehouse_id: null,
                created_by: null,
                stock_take_date: dateParse(new Date()),
                owner_id: null,
                // item_code: null,
                conditions: {
                    item_id: null,
                    group_id: null,
                    start_sr_no: null,
                    end_sr_no: null,
                    category_id: null,
                    class_id: null,
                }


            },






        }
    }


    postDriverForm = async () => {

        this.setState({
            submiting: true
        })


        let res = await StockVerificationService.createStockVerificationFreezs(this.state.formData);
        console.log('formdata  eka', this.state.formData);




        console.log("res", res);

        if (res.status == 200 || res.status == 201) {
            console.log("resssss", res)
            this.setState({
                alert: true,
                message: 'Successful',
                severity: 'success',
                submiting: false
            })
            const query = new URLSearchParams(this.props.location.search);
            const searchOwnerId = query.get('owner_id')

            const pathname = window.location.pathname;
            const segments = pathname.split('/');
            const id = segments[segments.length - 1];
            console.log('id', id);

            setTimeout(() => {
                window.location.href = `/StockTake/${id}?owner_id=${searchOwnerId}&freez_id=${res.data.posted.res.id}`
            }, 1000);



        } else {
            this.setState({
                alert: true,
                message: 'Unsuccessful',
                severity: 'error',
                submiting: false
            })
        }



    }

    // async loadWarehouses() {
    //     this.setState({
    //         warehouse_loaded: false
    //     })
    //     // var user = await localStorageService.getItem('userInfo');
    //     // console.log('user', user)
    //     // var id = user.id;
    //     // var all_pharmacy_dummy = [];
    //     const searchParams = new URLSearchParams(this.props.location.search);
    //     let searchOwnerId = this.props.match.searchParams.owner_id;
    //     var selected_warehouse_cache = await localStorageService.getItem(id);

    //     let params = { owner_id: searchOwnerId }
    //     let res = await EstimationService.getAllWarehouses2(params);
    //     console.log("CPALLOders", res)
    //     if (res.status == 200) {
    //         console.log("CPALLOders", res.data.view)


    //         // console.log("warehouse", all_pharmacy_dummy)
    //         this.setState({
    //             allWarehouses: res.data.view
    //         })
    //     }
    // }

    // async loadItemCategory() {
    //     let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
    //     if (cat_res.status == 200) {
    //         console.log('Categories', cat_res.data.view.data)
    //         this.setState({ all_item_category: cat_res.data.view.data })
    //     }
    // }

    // async loadInstitutionsFromOwnerId(resData) {



    //     const query = new URLSearchParams(this.props.location.search);
    //     const searchOwnerId = query.get('owner_id')
    //     console.log("searchOwnerId", searchOwnerId)

    //     let formData = this.state.formData
    //     formData.owner_id = searchOwnerId

    //     this.setState({
    //         formData
    //     })
    // }


    async loadWarehouses() {
        this.setState({
            warehouse_loaded: false
        })
        // var user = await localStorageService.getItem('userInfo');
        // console.log('user', user)
        // var id = user.id;
        // var all_pharmacy_dummy = [];
        const query = new URLSearchParams(this.props.location.search);
        const searchOwnerId = query.get('owner_id')

        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse')

        let params = { owner_id: searchOwnerId }
        let res = await WarehouseServices.getWarehoureWithOwnerId(searchOwnerId, params)
        console.log("CPALLOders", res)



        if (res.status == 200) {
            console.log("CPALLOders", res.data.view.data)


            // console.log("warehouse", all_pharmacy_dummy)
            this.setState({
                allWarehouses: res.data.view.data,
                warehouse_loaded: true
            })
        }
    }

    async loadData() {

        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        if (group_res.status == 200) {
            console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_group: group_res.data.view.data })
        }

        let class_res = await ClassDataSetupService.fetchAllClass({
            limit: 99999,
        })
        if (class_res.status == 200) {
            console.log('Classes', class_res.data.view.data)
            this.setState({ all_item_class: class_res.data.view.data })
        }

        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }

        if (class_res.status == 200) {
            const query = new URLSearchParams(this.props.location.search);
            const searchOwnerId = query.get('owner_id')
            console.log("searchOwnerId", searchOwnerId)

            let formData = this.state.formData
            formData.owner_id = searchOwnerId

            this.setState({
                formData
            })
        }





    }
    async loaduser() {
        this.setState({
            loaded: false
        })
        var user = await localStorageService.getItem('userInfo');
        let formData = this.state.formData;
        formData.created_by = user.id;

        this.setState({
            formData,
            loaded: true
        })


    }


    async stockVerification() {
        this.setState({ loading: false })

        const pathname = window.location.pathname;
        const segments = pathname.split('/');
        const id = segments[segments.length - 1];
        console.log('id', id);


        // console.log('id', this.props.match.params.id)
        let res = await StockVerificationService.getStockVerificationByID(id)
        console.log('res22', res);
        if (res.status == 200) {

            console.log("stock verification", res.data.view.data)
            this.setState({
                stock_verification_data: res.data.view.data,
                total_stock_verification_data: res.data.view.totalItems,
                loading: true,
            })

            console.log("2nd time", res.data.view)
        }
    }

    async getItem(value) {

        let data = {
            search: value
        }
        let res = await InventoryService.fetchAllItems(data)

        if (res.status === 200) {
            console.log("ITEM------------------------------->>", res)
            this.setState({ item_list: res.data.view.data })
        }
    }

    ownerId() {
        const query = new URLSearchParams(this.props.location.search);
        const searchOwnerId = query.get('owner_id')
        console.log('owner id', searchOwnerId)
        this.setState({
            owner_id: searchOwnerId
        })
    }



    componentDidMount() {

        const pathname = window.location.pathname;
        const segments = pathname.split('/');
        const id = segments[segments.length - 1];
        console.log('id', id);


        let formData = this.state.formData;
        formData.stock_verification_id = id;

        if (localStorageService.getItem(id)) {
            let warehouseId = localStorageService.getItem(id)
            let filterData = this.state.filterData
            console.log('warehouse', warehouseId)
            formData.warehouse_id = warehouseId.id
            formData.owner_id = warehouseId.owner_id
            this.setState({
                filterData

            }, () => {
                this.loadWarehouses()

            });
        }

        this.loadData()
        this.loaduser()
        this.stockVerification()
        console.log('props', this.props)
        this.ownerId()
        // this.getItem()




        this.setState({
            formData
        })

        console.log("item id", this.props.itemId)


    }





    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={"Stock Verification"} />

                        <ValidatorForm
                            ref="form"
                            className="pt-2"
                            onSubmit={() => {
                                this.postDriverForm()
                                // .props.onSubmitFunc(this.state.formData.group_id,)

                            }}
                        >

                            <Grid item lg={12} md={12} sm={12} xs={12} container spacing={1} className="flex " >


                                <Grid

                                    className="flex w-full" item lg={4} md={4} sm={12} xs={12}
                                >
                                    <SubTitle title="Institution Name:" />
                                    &nbsp;
                                    <SubTitle title={this.state.stock_verification_data[0]?.Stock_Verification?.Pharmacy_drugs_store?.name} />


                                </Grid>


                                <Grid
                                    className=" w-full" item lg={4} md={4} sm={12} xs={12}
                                >
                                    <SubTitle title="Warehouse Code" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allWarehouses}
                                        onChange={(e, value) => {
                                            console.log("value", value)
                                            if (value != null) {
                                                let formData = this.state.formData
                                                formData.warehouse_id = value?.WarehousesBins[0]?.warehouse_id

                                                this.setState({ formData })
                                                console.log('warehosue id', formData)
                                            }
                                        }}
                                        value={this
                                            .state
                                            .all_ven
                                            .find((v) => v.id == this.state.formData.warehouse_id)}

                                        getOptionLabel={
                                            (option) => option?.name + '-' + option?.Pharmacy_drugs_store?.Department?.name
                                        }

                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Choose Warehouse"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    if (e.target.value.length >= 3) {
                                                        this.loadWarehouses(e.target.value)
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid
                                    className=" w-full " item lg={4} md={4} sm={12} xs={12}
                                >
                                    <SubTitle title="Item Group" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.all_item_group}
                                        //  value={this.state.buttonName=='update'?appConst.institution.filter((e) => 
                                        //  e.value == this.state.reg_no.mid):this.state.reg_no.mid

                                        //  }
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            if (value != null) {
                                                formData.conditions.group_id = value.id
                                            } else {
                                                formData.conditions.group_id = null
                                            }

                                            this.setState({ formData })
                                        }}
                                        value={this
                                            .state
                                            .all_item_group
                                            .find((v) => v.id == this.state.formData.item_group_id)}
                                        // value={this.state.vehicleTypesData.find((v) => v.id === this.state.formData.vehicle_type_id)}
                                        getOptionLabel={(
                                            option) => option.description
                                                ? option.description
                                                : ''}
                                        renderInput={(params) => (
                                            <TextValidator {...params} placeholder="Item Group"
                                                //variant="outlined"
                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                        )}
                                    />
                                </Grid>

                                {/* <Grid
                                    className=" w-full" item lg={4} md={4} sm={12} xs={12}
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
                                </Grid> */}



                                <Grid
                                    className=" w-full" item lg={4} md={4} sm={12} xs={12}
                                >
                                    {/* <SubTitle title="Item Codes" />
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Enter Item Code"
                                        name="starting_item_code"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={
                                            this.state.formData.item_code
                                        }
                                        onChange={(e) => {
                                            this.setState({
                                                formData: {
                                                    ...this
                                                        .state
                                                        .formData,
                                                    item_code:
                                                        e.target
                                                            .value,
                                                },
                                            })
                                        }}

                                    /> */}

                                    <SubTitle title="Item Codes" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        placeholder="Enter Item Code"
                                        name="item_id"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        options={this.state.item_list}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData = this.state.formData
                                                formData.conditions.item_id = value.id



                                                this.setState({
                                                    formData,
                                                    loading: false,
                                                })

                                            }
                                            else if (value == null) {
                                                let formData = this.state.formData
                                                formData.conditions.item_id = null
                                                this.setState({
                                                    formData

                                                })
                                            }
                                        }}

                                        getOptionLabel={(option) => option.sr_no + ' - ' + option.medium_description}
                                        renderInput={(params) => (
                                            <TextValidator {...params}
                                                placeholder="Type SR or Name"
                                                //variant="outlined"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    if (e.target.value.length > 3) {
                                                        this.getItem(e.target.value);
                                                    }
                                                }}
                                                value={this.state.formData.conditions.item_id}


                                            />
                                        )} />
                                </Grid>

                                <Grid
                                    className=" w-full" item lg={4} md={4} sm={12} xs={12}
                                >
                                    <SubTitle title="Item Category" />
                                    <Autocomplete
                                        className="w-full"
                                        options={this.state.all_item_category}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            if (value != null) {
                                                formData.conditions.category_id = value.id
                                            } else {
                                                formData.conditions.category_id = null
                                            }

                                            this.setState({ formData })
                                        }}
                                        /*  defaultValue={this.state.all_district.find(
                                        (v) => v.id == this.state.formData.district_id
                                        )} */
                                        value={this.state.all_item_category.find(
                                            (v) =>
                                                v.id ==
                                                this.state.formData.conditions.category_id
                                        )}
                                        getOptionLabel={(option) =>
                                            option.description
                                                ? option.description
                                                : ''
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Item Category"
                                                //variant="outlined"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />




                                </Grid>

                                <Grid
                                    className=" w-full" item lg={4} md={4} sm={12} xs={12}
                                >
                                    <SubTitle title="Item Class" />
                                    <Autocomplete
                                        className="w-full"
                                        options={this.state.all_item_class}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            if (value != null) {
                                                formData.conditions.class_id = value.id
                                            } else {
                                                formData.conditions.class_id = null
                                            }

                                            this.setState({ formData })
                                        }}
                                        /*  defaultValue={this.state.all_district.find(
                                        (v) => v.id == this.state.formData.district_id
                                        )} */
                                        value={this.state.all_item_class.find(
                                            (v) =>
                                                v.id ==
                                                this.state.formData.conditions.class_id
                                        )}
                                        getOptionLabel={(option) =>
                                            option.description
                                                ? option.description
                                                : ''
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Item Class"
                                                //variant="outlined"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>


                                <Grid
                                    className=" w-full" item lg={4} md={4} sm={12} xs={12}
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
                                        value={
                                            this.state.formData.conditions.start_sr_no
                                        }
                                        onChange={(e, value) => {
                                            let fd = this.state.formData.conditions
                                            fd.start_sr_no = e.target.value


                                            this.setState({ fd })
                                        }}
                                    />
                                </Grid>


                                <Grid
                                    className=" w-full" item lg={4} md={4} sm={12} xs={12}
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
                                        value={
                                            this.state.formData.conditions.end_sr_no
                                        }
                                        onChange={(e, value) => {
                                            let fd = this.state.formData.conditions
                                            fd.end_sr_no = e.target.value


                                            this.setState({ fd })
                                        }}

                                    />
                                </Grid>




                                <Grid className=" w-full flex justify-left " item lg={12}
                                    md={12} sm={12} xs={12}>

                                    {/* <Button
                                        className="my-4 px-4"
                                        onClick={() => {

                                            window.location.href = `/PreStockCheck`

                                        }}
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}

                                    >
                                        <span className="capitalize">{this.state.buttonName}</span>
                                    </Button> */}
                                    &nbsp;
                                    <Button
                                        className="my-4 px-4 button-warning"
                                        progress={this.state.submiting}
                                        type="submit"
                                        scrollToTop={true}


                                    >
                                        <span className="capitalize">{this.state.buttonName_1}</span>
                                    </Button>
                                </Grid>





                            </Grid>

                            <LoonsSnackbar
                                open={this.state.alert}
                                onClose={() => {
                                    this.setState({ alert: false })
                                }}
                                message={this.state.message}
                                autoHideDuration={3000}
                                severity={this.state.severity}
                                elevation={2}
                                variant="filled"
                            ></LoonsSnackbar>







                        </ValidatorForm>
                    </LoonsCard>



                </MainContainer>

            </Fragment>

        )

    }
}

export default StockVerification
