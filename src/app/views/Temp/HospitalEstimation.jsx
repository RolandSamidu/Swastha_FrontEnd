import {
    CircularProgress,
    Divider,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    Typography,
} from '@material-ui/core'
import {
    CardTitle,
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    DatePicker,
    MainContainer,
    SubTitle,
    Button
} from 'app/components/LoonsLabComponents'
import React from 'react'
import { Component } from 'react'
import EstimationService from 'app/services/EstimationService'
import { yearParse } from 'utils'
import localStorageService from 'app/services/localStorageService'
import { TextValidator } from 'react-material-ui-form-validator'
import { Alert, Autocomplete } from '@material-ui/lab';
import CategoryService from 'app/services/datasetupServices/CategoryService'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import { ValidatorForm } from 'app/components/LoonsLabComponents';


class HospitalEstimation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: '',
            severity: 'success',
            all_item_category: [],
            all_item_group: [],

            formData: {
                limit: 20,
                page: 0,
                year: yearParse(new Date()),
                'order[0]': ['estimation', 'DESC'],
                sr_no : null ,  
                short_description: null
            },

            remarks: null,
            data: [],
            columns: [
                {
                    name: 'intitute',
                    label: 'Institute',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.HosptialEstimation.Warehouse.name ? this.state.data[tableMeta.rowIndex]?.HosptialEstimation.Warehouse.name : "Not Available"
                        },
                    },
                },
                {
                    name: 'sr_no',
                    label: 'Sr No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.ItemSnap?.sr_no ? this.state.data[tableMeta.rowIndex]?.ItemSnap.sr_no : "Not Available"
                        },
                    },
                },
                {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.ItemSnap?.long_description ? this.state.data[tableMeta.rowIndex]?.ItemSnap.long_description : "Not Available"
                        },
                    },
                },
                {
                    name: 'year',
                    label: 'Year',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.HosptialEstimation.Estimation ? new Date(this.state.data[tableMeta.rowIndex]?.HosptialEstimation.Estimation.from).getFullYear() : "Not Available"
                        },
                    },
                },
                {
                    name: 'estimation',
                    label: 'Estimation',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.estimation ? this.state.data[tableMeta.rowIndex]?.estimation : "Not Available"
                        },
                    },
                },
                {
                    name: 'remaining_estimation',
                    label: 'Remaining Estimation',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.estimation ? parseInt(this.state.data[tableMeta.rowIndex]?.estimation - this.state.data[tableMeta.rowIndex]?.issued_quantity, 10) : "Not Available"
                        },
                    },
                },

            ],
            totalItems: 0,
            loaded: false,
        }
    }

    componentDidMount() {
        this.loadData()
    }

    getPreviousEstimationYear(year) {
        let currYear = year.split('-')
        return (currYear[0] - 1) + '-' + currYear[1] + '-' + currYear[2]
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New formdata", this.state.formData)
            this.loadData()
        })
    }

    async loadData() {
        this.setState({ loaded: false });
        let owner_id = await localStorageService.getItem('owner_id')

        let orders = await EstimationService.getAllEstimationITEMS({ ...this.state.formData, owner_id: owner_id })
        if (orders.status == 200) {
            console.log('Estimation Details', orders.data.view)
            this.setState({ data: orders.data.view.data, totalItems: orders.data.view.totalItems })
        }
        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        if (group_res.status == 200) {
            console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_group: group_res.data.view.data })
        }
        this.setState({ loaded: true })
    }

    render() {
        return (
            <MainContainer>
                <LoonsCard>
                    <Grid container="container">
                        <Grid item="item" lg={12} md={12} xs={12}>
                            <Grid item="item" xs={12}>
                                <div className='flex'>
                                    <Typography variant="h6" className="font-semibold" >Hospital Estimation</Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider className="mb-4"></Divider>
                    <ValidatorForm>
                    <Grid container="container" className="mt-2 pb-5"  spacing={2}>
                        
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="SR Number" />
                                    <TextValidator
                                        className="w-full"
                                        placeholder="SR Number"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        type='number'
                                        size="small"
                                        // value={this.state.formData.sr_no}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            // console.log('f1',formData)
                                            formData.sr_no = e.target.value
                                            this.setState({ formData })
                                            console.log(
                                                'form dat',
                                                this.state.formData
                                            )
                                        }}
                                        // validators={['maxNumber:999999']}   
                                        // errorMessages={[
                                        //     'Maximum of 6 Digits'
                                        // ]}
                                        InputProps={{}}

                                    />
                                </Grid>



                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Short Description" />
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Short Description"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                        // value={this.state.formData.short_description}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            formData.short_description = e.target.value
                                            this.setState({ formData })
                                            console.log(
                                                'form dat',
                                                this.state.formData
                                            )
                                        }}
                                        InputProps={{}}

                                    />
                                </Grid>

                                <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle title="Item Category" />

                                    <Autocomplete
                                        disableClearable className="w-full"
                                        options={this.state.all_item_category.sort((a, b) => (a.description?.localeCompare(b.description)))}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            if (value != null) {
                                                formData.item_category_id = value.id
                                            } else {
                                                formData.item_category_id = null
                                            }
                                            console.log(this.state.formData);
                                            this.setState({ formData })
                                        }}
                                        /*  defaultValue={this.state.all_district.find(
                                        (v) => v.id == this.state.formData.district_id
                                        )} */
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
                                        disableClearable
                                        className="w-full"
                                        options={this.state.all_item_group.sort((a, b) => (a.name?.localeCompare(b.name)))}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            if (value != null) {
                                                formData.item_group_id = value.id
                                            } else {
                                                formData.item_group_id = null
                                            }
                                            console.log(this.state.formData);
                                            this.setState({ formData })
                                        }}
                                        value={this
                                            .state
                                            .all_item_group
                                            .find((v) => v.id == this.state.formData.group_id)}
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

                                <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle title="Year" />
                                    <div style={{ height: "5px", margin: 0, padding: 0 }}></div>
                                    <DatePicker
                                        style={{ border: '1px solid #e5e7eb', borderRadius: 5 }}
                                        key={this.state.key}
                                        className="w-full"
                                        onChange={(date) => {
                                            let formData = this.state.formData
                                            formData.year = yearParse(date)
                                            this.setState({ formData })
                                            console.log("Year: ", yearParse(date))
                                        }}
                                        format="yyyy"
                                        openTo='year'
                                        views={["year"]}
                                        value={new Date(this.state.formData.year, 0, 1)}
                                        placeholder="Year"
                                    />
                                </Grid>
                                <Grid
                                    style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                    item
                                    lg={3}
                                    md={3}
                                    sm={3}
                                    xs={12}
                                >
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                            className=" w-full flex justify-end"
                                        >
                                            {/* Submit Button */}
                                            <Button
                                                className="mt-2"
                                                progress={false}
                                                // type="submit"
                                                scrollToTop={
                                                    true
                                                }
                                                startIcon="search"
                                                onClick={async () => this.setPage(0)}
                                            >
                                                <span className="capitalize">
                                                    Search
                                                </span>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>

                        

                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            {this.state.loaded ? (
                                <LoonsTable
                                    //title={"All Aptitute Tests"}
                                    id={'all_items'}
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        rowsPerPage: this.state.formData.limit,
                                        page: this.state.formData.page,
                                        print: true,
                                        viewColumns: true,
                                        download: true,
                                        rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                        onTableChange: (action, tableState) => {
                                            console.log(action, tableState)
                                            switch (action) {
                                                case 'changePage':
                                                    this.setPage(
                                                        tableState.page
                                                    )
                                                    break
                                                case 'changeRowsPerPage':
                                                    this.setState({
                                                        formData: {
                                                            limit: tableState.rowsPerPage,
                                                            page: 0,
                                                        }
                                                    }, () => {
                                                        this.loadData()
                                                    })
                                                    break;
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
                            ) : (
                                //loading effect
                                <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress size={30} />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    </ValidatorForm>
                </LoonsCard>
                {/* <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar> */}
            </MainContainer>
        )
    }
}
export default HospitalEstimation
