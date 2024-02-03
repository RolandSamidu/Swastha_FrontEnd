import React, { Component, Fragment } from 'react'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Divider,
    TextField,
    InputAdornment,
    CircularProgress,
    Checkbox,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    DatePicker,
    Button,
    MainContainer,
    LoonsCard,
    SubTitle,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import moment from 'moment'
import { withRouter } from 'react-router-dom';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { getDrugStoreDetails, getAllReturnRequests } from '../redux/action';
import { connect } from "react-redux";

class AllReturnRequests extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            checkoutItems: [],
            columns: [
                // {
                //     name: 'id', // field name in the row object
                //     label: "",
                //     hide: true,
                //     options: {
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <Checkbox
                //                     onChange={(e,) => this.handleCheckbox(e, value)}
                //                     color='primary'
                //                     icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                //                     checkedIcon={<CheckBoxIcon fontSize="small" />}
                //                 />
                //             )
                //         }

                //     },

                // },
                {
                    name: 'fromStore', // field name in the row object
                    label: 'drug store', // field name in the row object
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<span>{value?.name}</span>)
                        }
                    },
                },
                {
                    name: 'request_id',
                    label: 'Return request ID',
                    // options: {
                    //     // filter: true,
                    // },
                },
                {
                    name: 'category',
                    label: 'SR No',

                },
                {
                    name: 'ItemSnap',
                    label: 'Item Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<span>{value?.medium_description}</span>)
                        }
                    }
                },
                {
                    name: 'total_approve_quantity',
                    label: 'Approve Quantity',
                    // options: {
                    //     // filter: true,
                    // },
                },
                {
                    name: 'total_request_quantity',
                    label: 'Request Quantity',
                    // options: {
                    //     // filter: true,
                    // },
                },
                {
                    name: 'category',
                    label: 'Remarks',
                    // options: {
                    //     // filter: true,
                    // },
                },
                {
                    name: 'status',
                    label: 'Status',
                    // options: {
                    //     // filter: true,
                    // },
                },
                {
                    name: 'ApproveBy',
                    label: 'Approved person',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<span>{value?.name}</span>)
                        }
                    },
                },
                {
                    name: 'recieving_date',
                    label: 'Recieving Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<span>{moment(value).format('YYYY-MM-DD')}</span>)
                        }
                    },
                },
                {
                    name: 'id',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <RemoveRedEyeIcon onClick={(e) => this.goToSingleReturn(e, value)} style={{ cursor: "pointer" }}></RemoveRedEyeIcon>

                                </>
                            )
                        },
                    },
                },
            ],
            loading: true,
            page: 0,
            rowsPerPage: 10,
            totalItems: 0,
            options: [{ title: 'text', value: 1 },
            { title: 'The text2', year: 2 }],
            drugStoreOptions: []
        }
    }




    componentDidMount() {
        this.props.getDrugStoreDetails();
        this.props.getAllReturnRequests({ page: this.state.page, limit: this.state.rowsPerPage })
    }

    goToSingleReturn = (e, return_request_id) => {
        this.props.history.push(`/return/requests/${return_request_id}`)
    }

    handleCheckbox = (e, id) => {
        if (!this.state.checkoutItems.includes(id)) {
            let array = this.state.checkoutItems;
            array.push(id);
            this.setState({ checkoutItems: array });
        } else {
            let array = this.state.checkoutItems.filter((data) => data !== id);
            this.setState({ checkoutItems: array });
        }
    }
    handleCheckout = () => {
        console.log(this.state.checkoutItems, "testingCheckoutItems")
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.drugStoreStatus) {
            this.setState({
                drugStoreOptions: nextProps?.drugStoreDetails?.data?.map((data) => {
                    return {
                        label: data.name,
                        value: data.id
                    }
                })
            })
        } else {
            this.setState({ drugStoreOptions: [] })
        }
        if (nextProps?.allReturnRequestStatus) {
            this.setState({
                totalItems: nextProps?.allReturnRequestDetails?.totalItems,
                data: nextProps?.allReturnRequestDetails?.data,
                loading: false
            });
        } else {
            this.setState({
                totalItems: 0,
                data: [],
                loading: false
            });
        }

    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <Grid container spacing={2}>
                            <Grid item lg={3} xs={12} className='mt-5'>
                                <h4 >Filters</h4>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                        </Grid>

                        <Grid container="container" spacing={2} direction="row">
                            <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                <Grid container="container" spacing={2}>
                                    {/* Ven */}
                                    <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                        <SubTitle title="Consumption" />
                                        <Autocomplete
                                        disableClearable className="w-full" options={this.state.options} getOptionLabel={(option) => option.title} renderInput={(params) => <TextField {...params} variant="outlined" size='small' />} />
                                    </Grid>

                                    {/* Ven */}
                                    <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                        <SubTitle title="Drug store" />
                                        <Autocomplete
                                        disableClearable className="w-full" options={this.state.drugStoreOptions} getOptionLabel={(option) => option.label} renderInput={(params) => <TextField {...params} variant="outlined" size='small' />} />
                                    </Grid>
                                    <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                        <SubTitle title="Search" />
                                        <TextField className='' placeholder="Search"
                                            //variant="outlined"
                                            fullWidth="fullWidth" variant="outlined" size="small"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon></SearchIcon>
                                                    </InputAdornment>
                                                )
                                            }} />
                                    </Grid>
                                </Grid>
                                <Grid container="container" spacing={2}>
                                    <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                        <SubTitle title="Date Range" />
                                        <DatePicker />
                                    </Grid>
                                    <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                        <SubTitle title="to" />
                                        <DatePicker />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* <CardTitle title="Clinic Setup" /> */}

                        <ValidatorForm
                            className="pt-2"

                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid container spacing={2} direction="row">

                                <Grid container className="mt-3 pb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        {
                                            !this.state.loading
                                                ? <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    id={'allAptitute'} data={this.state.data} columns={this.state.columns} options={{
                                                        pagination: true,
                                                        serverSide: true,
                                                        count: this.state.totalItems,
                                                        rowsPerPage: this.state.rowsPerPage,
                                                        page: this.state.page,
                                                        onTableChange: (action, tableState) => {
                                                            console.log(action, tableState)
                                                            switch (action) {
                                                                case 'changePage':
                                                                    // this.setPage(     tableState.page )
                                                                    break
                                                                case 'sort':
                                                                    //this.sort(tableState.page, tableState.sortOrder);
                                                                    break
                                                                default:
                                                                    console.log('action not handled.')
                                                            }
                                                        }
                                                    }}></LoonsTable>
                                                : (
                                                    //loading effect
                                                    <Grid className="justify-center text-center w-full pt-12">
                                                        <CircularProgress size={30} />
                                                    </Grid>
                                                )
                                        }
                                    </Grid>

                                </Grid>
                            </Grid>
                        </ValidatorForm>
                        {/* <Button onClick={this.handleCheckout} style={{ float: "right" }}>CHECKOUT</Button> */}
                    </LoonsCard>
                </MainContainer>

            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        drugStoreStatus: state?.returnReducer?.drugStoreStatus,
        drugStoreDetails: state?.returnReducer?.drugStoreDetails,
        allReturnRequestStatus: state?.returnReducer?.allReturnRequestStatus,
        allReturnRequestDetails: state?.returnReducer?.allReturnRequestDetails
    }

}
const mapDispatchToProps = dispatch => {
    return {
        getDrugStoreDetails: () => getDrugStoreDetails(dispatch),
        getAllReturnRequests: (params) => getAllReturnRequests(dispatch, params)
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllReturnRequests));
