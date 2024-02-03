import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar';
import { useParams } from 'react-router';
import { withRouter } from "react-router";
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    CircularProgress,
    IconButton,
    Icon,
    Tabs,
    InputAdornment,
    Tab,
    Tooltip
} from '@material-ui/core'
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import ToBeReceivedItems from './ToBeReceivedItems'
import WarehouseServices from 'app/services/WarehouseServices'
import CategoryService from 'app/services/datasetupServices/CategoryService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import PharmacyService from 'app/services/PharmacyService'

const styleSheet = (theme) => ({})

class DroppedItems extends Component {


    constructor(props) {

        super(props)
        this.state = {

            Loaded: false,
            activeTab: 0,
            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
            all_item_drug_store: [],
            totalItems:0,

            filterData: {

                // status: 'Pending',
                status: 'DROPPED',
                ven_id: null,
                class_id: null,
                category_id: null,
                group_id: null,
                to: null,
                order_exchange_id: this.props.match.params.id,
                search: null,

                // limit: 10,
                // page: 0,
            },

            filterDataValidation: {
                ven_id: true,
                class_id: true,
                category_id: true,
                group_id: true,
                to: true,

                search: true,
                // status: true
            },

            pickUpPerson: {
                id: '789589632V',
                name: 'John Doe',
                contactNum: '0712582563'
            },
            order: [],
            data: [],



            columns: [
                // {
                //     name: 'id',
                //     label: 'id',
                //     options: {
                //         display: false,
                //     },
                // },
                {
                    name: 'SRNumber',
                    label: 'SR No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].ItemSnap.sr_no

                            )
                        }
                    },
                },
                {
                    name: 'itemName',
                    label: 'Item Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].ItemSnap.short_description

                            )
                        }
                    },
                },
                {
                    name: 'Order Receiving Date for the defined Drug Store',
                    label: 'Order Receiving Date for the defined Drug Store',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'Store Qty',
                    label: 'Store Qty',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'request_quantity',
                    label: 'Order Qty',
                    options: {
                        display: true,
                    },
                },
                // {
                //     name: 'Allocated Qty',
                //     label: 'Allocated Qty',
                //     options: {
                //         display: true,
                //     },
                // },
                {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <Tooltip title="Re-Order Item">
                                    <Button
                                        className="my-1"
                                        progress={false}
                                        scrollToTop={false}
                                    // type='submit'
                                    // startIcon="save"
                                    //onClick={() => { this.loadConsignmentList() }}
                                    >
                                        <span className="capitalize">Reorder</span>
                                    </Button>
                                    </Tooltip>

                                </>
                            )
                        },
                    },
                },
            ]



        }
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {
            console.log("New filterData", this.state.filterData)
            this.LoadOrderItemBatchDetails(this.state.filterData)
        })
    }

    handleFilterButton() {

        this.LoadOrderItemDetails(this.state.filterData);
    }

    handleSearchButton() {

        let filterData = this.state.filterData;

        if (filterData.search) {
            // alert("Sent the Request")
            this.LoadOrderItemDetails(this.state.filterData);
        }
        else {

            let filterDataValidation = this.state.filterDataValidation;

            filterDataValidation.search = false;

            this.setState({ filterDataValidation })
        }


    }

    async loadData() {

        //function for load initial data from backend or other resources
        let ven_res = await WarehouseServices.getVEN({ limit: 99999 })
        if (ven_res.status == 200) {
            // console.log('Ven', ven_res.data.view.data)
            this.setState({ all_ven: ven_res.data.view.data })
        }
        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            // console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
        let class_res = await
            ClassDataSetupService.fetchAllClass({ limit: 99999 })
        if (class_res.status == 200) {
            // console.log('Classes', class_res.data.view.data)
            this.setState({ all_item_class: class_res.data.view.data })
        }
        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        if (group_res.status == 200) {
            // console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_group: group_res.data.view.data })
        }
        let durgStore_res = await PharmacyService.fetchAllDataStorePharmacy('001', {})
        if (durgStore_res.status == 200) {
            // console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_drug_store: durgStore_res.data.view.data })
        }
    }

    async LoadOrderItemDetails(filters) {

        this.setState({ Loaded: false })
        let res = await PharmacyOrderService.getOrderItems(filters)
        if (res.status) {
            console.log("Order Item Data", res.data.view.data)
            this.setState({
                data: res.data.view.data,
                totalItems: res.data.view.totalItems,
                Loaded: true,
            }, () => {
                this.render()
                // console.log("State ", this.state.data)
            })
        }

    }

    async LoadOrderDetails() {

        console.log("this.props.match.params.id",this.props.match.params.id);
        let res = await PharmacyOrderService.getOrdersByID(this.props.match.params.id)
        if (res.status) {
            console.log("Order Data", res.data.view)
            this.setState({
                order: res.data.view,
            }, () => {
                this.render()
                // console.log("State ", this.state.order)
            })
        }

    }

    componentDidMount() {

        this.loadData()
        this.LoadOrderDetails()
        this.LoadOrderItemDetails(this.state.filterData)

    }

    render() {
        return (
            <Fragment>

                <ValidatorForm
                    className=""
                    onSubmit={() => this.SubmitAll()}
                    onError={() => null}>

                    <Grid container>
                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                            <SubTitle title={"Ven"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_ven}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */
                                getOptionLabel={(option) =>
                                    option.name ?
                                        (option.name)
                                        : ('')
                                }
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }
                                onChange={(event, value) => {

                                    let filterData = this.state.filterData
                                    if (value != null) {
                                        filterData.ven_id = value.id
                                        // filterData.ven = value.name
                                    } else {
                                        filterData.ven_id = null
                                    }
                                    this.setState({ filterData })

                                }}
                                value={this.state.all_ven.find((v) =>
                                    v.id == this.state.filterData.ven_id
                                )}



                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Ven"
                                        //variant="outlined"
                                        //value={}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        size="small"
                                        validators={[
                                            'required',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                )}
                            />

                        </Grid>
                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                            <SubTitle title={"Item Class"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_item_class}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */
                                getOptionLabel={(option) =>
                                    option.description ?
                                        (option.description)
                                        : ('')
                                }
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }
                                onChange={(event, value) => {

                                    let filterData = this.state.filterData
                                    if (value != null) {

                                        filterData.class_id = value.id


                                    } else {
                                        filterData.class_id = null
                                    }
                                    this.setState({ filterData })

                                }}
                                value={this.state.all_item_class.find((v) =>
                                    v.id == this.state.filterData.class_id
                                )}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Item Class"
                                        //variant="outlined"
                                        //value={}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        size="small"
                                        validators={[
                                            'required',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                )}
                            />

                        </Grid>
                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                            <SubTitle title={"Item Category"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_item_category}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */

                                getOptionLabel={(option) =>
                                    option.description ?
                                        (option.description)
                                        : ('')
                                }
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }
                                onChange={(event, value) => {
                                    let filterData = this.state.filterData
                                    if (value != null) {

                                        filterData.category_id = value.id


                                    } else {
                                        filterData.category_id = null
                                    }
                                    this.setState({ filterData })
                                }}
                                value={this.state.all_item_category.find((v) =>
                                    v.id == this.state.filterData.category_id
                                )}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Item Category"
                                        //variant="outlined"
                                        //value={}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        size="small"
                                        validators={[
                                            'required',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                )}
                            />

                        </Grid>
                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                            <SubTitle title={"Item Group"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_item_group}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */

                                getOptionLabel={(option) =>
                                    option.description ?
                                        (option.description)
                                        : ('')
                                }
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }
                                onChange={(event, value) => {
                                    let filterData = this.state.filterData
                                    if (value != null) {

                                        filterData.group_id = value.id


                                    } else {
                                        filterData.group_id = null
                                    }
                                    this.setState({ filterData })
                                }}
                                value={this.state.all_item_group.find((v) =>
                                    v.id == this.state.filterData.group_id
                                )}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Item Group"
                                        //variant="outlined"
                                        //value={}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        size="small"
                                        validators={[
                                            'required',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                )}
                            />

                        </Grid>

                    </Grid>
                    <Grid container>


                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                            <SubTitle title={"Drug Store"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_item_drug_store}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */
                                getOptionLabel={(option) =>
                                    option.name ?
                                        (option.name)
                                        : ('')
                                }
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }
                                onChange={(event, value) => {

                                    console.log("fromStore", value);
                                    let filterData = this.state.filterData
                                    if (value != null) {

                                        // let filterDataValidation = this.state.filterDataValidation;
                                        // filterDataValidation.from = true;

                                        filterData.to = value.id

                                        // this.setState({ filterDataValidation })


                                    } else {
                                        filterData.to = null
                                    }
                                    this.setState({ filterData })

                                }}
                                value={this.state.all_item_drug_store.find((v) =>
                                    v.id == this.state.filterData.to
                                )}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Drug Store"
                                        //variant="outlined"
                                        //value={}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        size="small"
                                        validators={[
                                            'required',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                )}
                            />

                        </Grid>
                        <Grid item lg={1} md={1} sm={1} xs={1} className="text-left px-2">
                            <Button
                                className="mt-6"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                                startIcon="search"
                                onClick={() => { this.handleFilterButton() }}
                            >
                                <span className="capitalize">Filter</span>
                            </Button>
                        </Grid>
                        <Grid item lg={5} md={5} sm={5} xs={5} className="text-left px-2 mb-2" >

                        </Grid>
                        <Grid item
                            lg={2} md={2} sm={2} xs={2}
                            className='px-2 mb-2'
                            style={{ display: 'flex', flexDirection: 'column' }}>

                            <TextValidator
                                className='w-full mt-5'
                                placeholder="SR No"
                                //variant="outlined"

                                variant="outlined"
                                size="small"
                                value={this.state.filterData.search}
                                onChange={(e, value) => {
                                    let filterData = this.state.filterData
                                    if (e.target.value) {
                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.search = true;

                                        filterData.search = e.target.value;

                                        this.setState({ filterDataValidation })
                                    } else {
                                        filterData.search = null;
                                    }

                                    this.setState({ filterData })
                                    // console.log("form dat", this.state.filterData)
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
                                            {/* <SearchIcon></SearchIcon> */}
                                        </InputAdornment>
                                    )
                                }} />
                            {
                                this.state.filterDataValidation.search ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }

                        </Grid>
                        <Grid item lg={1} md={1} sm={1} xs={1} className="text-left pl-4 pr-0" >
                            <Button
                                className="mt-6 "
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                                startIcon="search"
                                onClick={() => { this.handleSearchButton() }}
                            >
                                <span className="capitalize">Search</span>
                            </Button>
                        </Grid>
                    </Grid>

                </ValidatorForm>
                <Grid container className="mt-2 pb-5">
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        {
                            this.state.Loaded ?
                                <>
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}

                                        id={'all_items'}
                                        data={
                                            this.state.data
                                        }
                                        columns={
                                            this.state.columns
                                        }
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: this.state.filterData.limit,
                                            page: this.state.filterData.page,
                                            print: true,
                                            viewColumns: true,
                                            download: true,
                                            onTableChange: (action, tableState) => {
                                                console.log(action, tableState)
                                                switch (
                                                action
                                                ) {
                                                    case 'changePage':
                                                        this.setPage(
                                                            tableState.page
                                                        )
                                                        break
                                                    case 'sort':
                                                        // this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    ></LoonsTable>
                                </> :
                                (
                                    //loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )

                        }

                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

export default withRouter(DroppedItems)