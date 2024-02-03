import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
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
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    Typography,
    Box,
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
import * as appConst from '../../../appconst'
import VisibilityIcon from '@material-ui/icons/Visibility';
import ConsignmentService from 'app/services/ConsignmentService'
import DistributionCenterServices from 'app/services/DistributionCenterServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import localStorageService from 'app/services/localStorageService'
import SchedulesServices from 'app/services/SchedulesServices'
import { dateParse, yearParse } from 'utils'
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import OrderList from './Print/OrderList';
import AddIcon from '@mui/icons-material/Add';

class PurchaseOrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            searchValue: '',
            filterData: {
                search: null,
                status: null,
                type: null,
                page: 0,
                limit: 20,
                'order[0]': [
                    'updatedAt', 'DESC'
                ],
                from: null,
                to: null,
                year: null,
            },

            formData: {
                search: null,
                status: null,
                type: null,
                page: 0,
                limit: 20,
                'order[0]': [
                    'updatedAt', 'DESC'
                ],
                from: null,
                to: null,
                year: null
            },

            userRoles: null,


            data: [

            ],
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let order_no = this.state.data[dataIndex]?.order_no;
                            let order_list_id = this.state.data[dataIndex]?.id;
                            return (
                                <Grid className="px-2">
                                    <IconButton
                                        onClick={() => {
                                            window.location.href = `/order/order-list/${order_list_id}`
                                        }}>
                                        <VisibilityIcon color='primary' />
                                    </IconButton>

                                    {(this.state.userRoles.includes('MSD SCO') || this.state.userRoles.includes('MSD AD')) ? null :
                                        <IconButton
                                            disabled={this.state.data[dataIndex].status == "Pending Approval"}
                                            onClick={() => {
                                                window.location.href = `/purchase_order/create/?order_no=` + order_no
                                            }}>
                                            <AddIcon color='primary' />
                                        </IconButton>
                                    }

                                    {/* {this.state.userRoles.includes('MSD AD') ? null :
                                        <IconButton>
                                            <OrderList orderId={this.state.data[dataIndex].id} orderListId={this.state.data[dataIndex].order_no} userName={this.state.data[dataIndex].Employee.name} />
                                        </IconButton>
                                    } */}
                                </Grid>
                            )

                        },
                    }
                },
                {
                    name: 'order_no',
                    label: 'Order List number',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'type',
                    label: 'Type',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'no_of_items',
                    label: 'No Of Items',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'order_for_year',
                    label: 'Order for Year',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'order_date',
                    label: 'Order Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return dateParse(this.state.data[dataIndex]?.order_date)
                        }
                    }
                },
                {
                    name: 'order_date_to',
                    label: 'Order Date To',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return dateParse(this.state.data[dataIndex]?.order_date_to)
                        }
                    }
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                    },
                }
            ]


        }
    }

    // filter function
    async loadOrder() {
        this.setState({ loaded: false, cartStatus: [] })
        this.state.filterData = { ...this.state.filterData }
        console.log("form data", this.state.filterData)
        let res = await SchedulesServices.getOrderList(this.state.filterData)
        //let order_id = 0
        if (res.status) {
            this.setState({
                data: res.data.view.data,
                loaded: true,
                totalItems: res.data.view.totalItems,
            }, () => {
                this.render()
                // this.getCartItems()
            })
        }
    }

    // search function
    loadOrderList = (event) => {
        const { value } = event.target;
        const filterData = this.state.data.filter((item) =>
            item.order_no.toLowerCase().includes(value.toLowerCase())
        );
        this.setState({ search: value, filterData });
    };


    async loadList() {

        let filterData = this.state.filterData
        var user_info = await localStorageService.getItem('userInfo');

        this.setState({ userRoles: user_info.roles })
        filterData.role = user_info.roles[0]
        //filterData.user_id = user_info.id
        //filterData.search = filterData.search ? decodeURIComponent(filterData.search):null
        if (user_info.roles.includes('SPC MA') || user_info.roles.includes('SPC MA')) {
            filterData.agent_type = "SPC"
        } else {
            filterData.agent_type = "MSD"
        }
        this.setState({ filterData })

        let res = await SchedulesServices.getOrderList(filterData)



        if (res.status) {
            this.setState({
                data: res.data.view.data,
                loaded: true,
                totalItems: res.data.view.totalItems,

            })
        }

    }


    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {
            this.loadList()
        })
    }

    componentDidMount() {
        this.loadList()
        console.log('decode values',decodeURIComponent("2024%2FSPC%2FA%2FP%2F0008"))
    }

    render() {
        return (
            <MainContainer>
                <LoonsCard>

                    <CardTitle title={"All Order Lists"} />
                    <ValidatorForm onSubmit={() => this.loadOrder()}>
                        <Grid container="container" spacing={2} className='mt-2'>
                            {/* filter by status */}
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                <SubTitle title={"Status"}></SubTitle>
                                <Autocomplete
                                    disableClearable
                                    className="w-full"
                                    options={appConst.order_list_status}
                                    /*  defaultValue={dummy.find(
                                        (v) => v.value == ''
                                    )} */
                                    getOptionLabel={(option) => option.value}
                                    getOptionSelected={(option, value) =>
                                        console.log("ok")
                                    }
                                    onChange={(event, value) => {
                                        let filterData = this.state.filterData
                                        if (value != null) {

                                            filterData.status = value.value

                                        } else {
                                            filterData.status = null
                                        }
                                        this.setState({ filterData })
                                    }}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Status"
                                            //variant="outlined"
                                            //value={}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            size="small"
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    )}
                                />

                            </Grid>
                            {/* filter by Type */}
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                <SubTitle title={"Type"}></SubTitle>
                                <Autocomplete
                                    disableClearable
                                    className="w-full"
                                    options={appConst.order_list_catogory}
                                    getOptionLabel={(option) => option.label}
                                    getOptionSelected={(option, value) =>
                                        console.log("ok")
                                    }
                                    onChange={(event, value) => {
                                        let filterData = this.state.filterData
                                        if (value != null) {

                                            filterData.type = value.value

                                        } else {
                                            filterData.status = null
                                        }
                                        this.setState({ filterData })
                                    }}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Type"
                                            //variant="outlined"
                                            //value={}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            size="small"
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    )}
                                />

                            </Grid>
                            {/* form */}
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                <SubTitle title="Date From" />
                                <DatePicker
                                    className="w-full mt-1"
                                    value={this.state.filterData.from}
                                    placeholder="Date From"
                                    onChange={(date) => {
                                        let filterData = this.state.filterData;
                                        filterData.from = dateParse(date);
                                        this.setState({ filterData });
                                    }}
                                />

                            </Grid>
                            {/* to */}
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                <SubTitle title="Date To" />
                                <DatePicker
                                    className="w-full mt-2"
                                    value={this.state.formData.to}
                                    variant="outlined"
                                    placeholder="Date To"
                                    onChange={(date) => {
                                        let filterData = this.state.filterData;
                                        filterData.to = dateParse(date);
                                        this.setState({ filterData });
                                    }}
                                />
                            </Grid>
                            {/* year */}
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                <SubTitle title="Year" />
                                <DatePicker
                                    className="w-full mt-2"
                                    value={this.state.formData.year}
                                    variant="outlined"
                                    placeholder="Year"
                                    onChange={(date) => {
                                        let filterData = this.state.filterData;
                                        filterData.year = yearParse(date);
                                        this.setState({ filterData });
                                    }}
                                />
                            </Grid>

                            <Grid

                                item="item" lg={3} md={3} sm={12} xs={12} className=" w-full flex justify-start p-0">
                                {/* Submit Button */}
                                <SubTitle />
                                <LoonsButton className="mt-8 mr-2" progress={false} type='submit'
                                    //onClick={this.handleChange}
                                    style={{ height: "30px", width: "100px" }}
                                >
                                    <span className="capitalize">
                                        {
                                            this.state.isUpdate
                                                ? 'Update'
                                                : 'Filter'
                                        }
                                    </span>
                                </LoonsButton>

                            </Grid>


                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-5 mt-5 p-0">
                                <SubTitle />
                                <TextValidator className='' placeholder="Search"
                                    //variant="outlined"
                                    fullWidth="fullWidth" variant="outlined" size="small"
                                    // value={this.state.formData.search}
                                    value={this.state.filterData.search}
                                    onChange={(e) => {
                                        let filterData = this.state.filterData;
                                        filterData.search = e.target.value;
                                        this.setState({ filterData });
                                    }}
                                    // validators={[
                                    //     'required',
                                    // ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon onClick={() => { this.loadOrder() }}></SearchIcon>
                                            </InputAdornment>
                                        )
                                    }} />

                            </Grid>

                        </Grid>
                    </ValidatorForm>

                    {/* <ValidatorForm>
                        <Grid container="container" spacing={2}>

                            

                        </Grid>
                    </ValidatorForm> */}

                    {this.state.loaded ?
                        <LoonsTable


                            id={'completed'}
                            data={this.state.filterData.length ? this.state.filterData : this.state.data}
                            columns={this.state.columns}
                            options={{
                                pagination: true,
                                serverSide: true,
                                count: this.state.totalItems,
                                // count: 10,
                                rowsPerPage: this.state.filterData.limit,
                                page: this.state.filterData.page,
                                print: false,
                                viewColumns: false,
                                download: false,
                                onTableChange: (action, tableState) => {
                                    console.log(action, tableState)
                                    switch (action) {
                                        case 'changePage':
                                            this.setPage(tableState.page)
                                            break
                                        case 'sort':
                                            //this.sort(tableState.page, tableState.sortOrder);
                                            break
                                        default:
                                            console.log(
                                                'action not handled.'
                                            )
                                    }
                                },
                            }}
                        ></LoonsTable>
                        : null}

                </LoonsCard>
            </MainContainer>
        )
    }
}







export default PurchaseOrderList