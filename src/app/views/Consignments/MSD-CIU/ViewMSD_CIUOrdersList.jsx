import React, { Component, Fragment } from "react";
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle
} from "../../../components/LoonsLabComponents";
import { CircularProgress, Grid, Tooltip, IconButton } from "@material-ui/core";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";
import * as appConst from "../../../../appconst";
import Paper from "@material-ui/core/Paper";
import Buttons from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ConsignmentService from "../../../services/ConsignmentService";
import { dateParse } from "utils";

class ViewMSD_CIUOrdersList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            totalConsignment: 0,
            formData: {
                delevery_effective_date: '',
                time_period: '',
                delivery_person_id: '',
                wharf_ref_no: '',
                id: '',
                ldcn_ref_no: '',
                delivery_date: '',
                status: 'submitted',
            },
            totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
                delivery_date: null,
                agent: '',
                status: '',
                time_period: '',
                order_no: '',
                confirmed_only:true,
                'order[0]': ['updatedAt', 'DESC'],
            },
            data: [],
            columns: [
                {
                    name: 'invoice_no', // field name in the row object
                    label: 'Invoice No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'order_no', // field name in the row object
                    label: 'Order No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'po', // field name in the row object
                    label: 'PO No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'delivery_person_id', // field name in the row object
                    label: 'Agent', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: false
                    },
                },
                {
                    name: 'order_no', // field name in the row object
                    label: 'Order List No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },
                {
                    name: 'wharf_ref_no', // field name in the row object
                    label: 'Wharf ref No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },
                {
                    name: 'ldcn_ref_no', // field name in the row object
                    label: 'LDCN ref No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true
                    },
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },
                {
                    name: 'delivery_date', // field name in the row object
                    label: 'Updated Scheduled Date', // column title that will be shown in table
                    options: {

                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].delivery_date;
                            return dateParse(data)
                        }

                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id;
                            return (
                                <Grid className="flex items-center">
                                    {/*  <Tooltip title="Edit">
                                        <Buttons
                                         color="primary" style={{ fontWeight: 'bold', marginTop: -3 }}>
                                            View
                                        </Buttons>
                                    </Tooltip> */}
                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/consignments/msdCIU/view-consignment/${id}`
                                                }}>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            );
                        }
                    }
                }
            ],
            alert: false,
            message: "",
            severity: 'success',
        }
    }

    async loadData() {
        this.setState({ loaded: false })

        let res = await ConsignmentService.getAllConsignments({ ...this.state.filterData, status: this.state.filterData?.status?.value, time_period: this.state.filterData?.time_period?.value, agent: this.state.filterData?.agent?.value })
        if (res.status == 200) {
            this.setState(
                {
                    loaded: true,
                    data: res.data.view.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                }
            )
        }
        this.setState({
            totalConsignment: this.state.data.length
        })
    }

    componentDidMount() {
        this.loadData()
    }


    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title=" View Order - Consignments " />

                        <Grid item lg={12} className=" w-full mt-2">
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.setPage(0)}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex">
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Time Period" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={appConst.admission_mode}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let newFilterData = this.state.filterData;
                                                    newFilterData.time_period = value;
                                                    this.setState({ filterData: newFilterData })
                                                }
                                            }}
                                            value={this.state.filterData.time_period}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.time_period}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Delivery effective date range" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.filterData.delivery_date}
                                            placeholder="Date From"
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={date => {

                                                let filterData = this.state.filterData;
                                                filterData.delivery_date = date;
                                                this.setState({ filterData })

                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Agent" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={appConst.admission_mode}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.agent = value;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            value={this.state.filterData.agent}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.agent}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Status" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={appConst.order_status}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.status = value;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.status}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Order List" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Please Enter"
                                            name="order_list"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.filterData.order_no}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let filterData = this.state.filterData;
                                                filterData.order_no = e.target.value;
                                                this.setState({ filterData })

                                            }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid
                                            className=" flex " item lg={2} md={2} sm={12} xs={12}
                                        >
                                            <Grid
                                                style={{ marginTop: 10 }}
                                            >
                                                <Button
                                                    className="mt-2"
                                                    progress={false}
                                                    type="submit"
                                                    scrollToTop={true}
                                                >
                                                    <span className="capitalize">Search</span>
                                                </Button>
                                            </Grid>

                                            <Grid
                                                style={{ marginTop: 17, marginLeft: 4 }}
                                            >
                                                <Button
                                                    variant="outlined"
                                                    style={{ margin: 4 }}
                                                >
                                                    <span className="capitalize">Reset</span>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>

                            <Grid className=" w-full" style={{ marginTop: 20, backgroundColor: 'red' }}>
                                <Paper elevation={0} square
                                    style={{ backgroundColor: '#E6F6FE', border: '1px solid #DEECF3', height: 40 }}>
                                    <Grid item lg={12} className=" w-full mt-2">
                                        <Grid container spacing={1} className="flex">
                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                                // spacing={2}
                                                style={{ marginLeft: 10 }}
                                            >
                                                <SubTitle title={`Total Consignment: ${this.state.totalConsignment}`} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>


                        {/*Table*/}
                        <Grid lg={12} className=" w-full mt-2" spacing={2} style={{ marginTop: 20 }}>

                            {
                                this.state.loaded ?
                                    <div className="pt-0">
                                        <LoonsTable
                                            id={"DEFAULT_USER"}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: this.state.filterData.limit,
                                                page: this.state.filterData.page,

                                                onTableChange: (action, tableState) => {
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage(tableState.page)
                                                            break;
                                                        case 'sort':
                                                            break;
                                                        default:
                                                            console.log('action not handled.');
                                                    }
                                                }

                                            }
                                            }
                                        >
                                        </LoonsTable>
                                    </div>
                                    :
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                            }
                        </Grid>
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        );
    }
}

export default ViewMSD_CIUOrdersList
