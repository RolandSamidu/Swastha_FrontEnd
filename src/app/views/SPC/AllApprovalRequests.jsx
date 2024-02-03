import React, { Component, Fragment } from 'react'
import {
    CardTitle,
    LoonsCard,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import MainContainer from 'app/components/LoonsLabComponents/MainContainer'
import {
    LoonsTable,
    Button,
    DatePicker,
} from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { CircularProgress, Grid } from '@material-ui/core'
import * as appConst from '../../../appconst'
import { Autocomplete } from '@material-ui/lab'
import { dateParse } from 'utils'
import moment from 'moment'

class AllApprovalRequests extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            filterData: {
                limit: 20,
                page: 0,
                status: '',
                from_date: null,
                to_date: null,
                unit: '',
                all_approval_request_status: '',
                'order[0]': ['updatedAt', 'DESC'],
            },
            columns: [
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'received_date', // field name in the row object
                    label: 'Received Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {value
                                        ? dateParse(
                                              moment(value).format('YYYY-MM-DD')
                                          )
                                        : ''}
                                </span>
                            )
                        },
                    },
                },
                {
                    name: 'received_from', // field name in the row object
                    label: 'Received From', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'request_for', // field name in the row object
                    label: 'Request For', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
            ],
        }
    }

    render() {
        return (
            <LoonsCard>
                <CardTitle title="All Approval Requests" />

                <Grid item lg={12} className=" w-full mt-2">
                    <ValidatorForm
                        className="pt-2"
                        ref={'outer-form'}
                        onSubmit={() => this.onSubmit()}
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
                                <SubTitle title="From" />
                                <DatePicker
                                    className="w-full"
                                    value={this.state.filterData.from_date}
                                    //label="Date From"
                                    placeholder="From Date"
                                    // minDate={new Date()}
                                    //maxDate={new Date("2020-10-20")}
                                    required={true}
                                    errorMessages="this field is required"
                                    onChange={(date) => {
                                        let filterData = this.state.filterData
                                        filterData.from_date = date
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
                                <SubTitle title="To" />
                                <DatePicker
                                    className="w-full"
                                    value={this.state.filterData.to_date}
                                    //label="Date From"
                                    placeholder="To Date"
                                    // minDate={new Date()}
                                    //maxDate={new Date("2020-10-20")}
                                    required={true}
                                    errorMessages="this field is required"
                                    onChange={(date) => {
                                        let filterData = this.state.filterData
                                        filterData.to_date = date
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
                                <SubTitle title="Received From" />
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    value={this.state.filterData.unit}
                                    options={appConst.unit}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData =
                                                this.state.filterData
                                            filterData.unit = value
                                            this.setState({ filterData })
                                        } else {
                                            let filterData =
                                                this.state.filterData
                                            filterData.unit = { label: '' }
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
                                            value={this.state.filterData.unit}
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
                                <SubTitle title="Request For" />
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    value={this.state.filterData.unit}
                                    options={appConst.unit}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData =
                                                this.state.filterData
                                            filterData.unit = value
                                            this.setState({ filterData })
                                        } else {
                                            let filterData =
                                                this.state.filterData
                                            filterData.unit = { label: '' }
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
                                            value={this.state.filterData.unit}
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
                                    value={
                                        this.state.filterData
                                            .all_approval_request_status
                                    }
                                    options={
                                        appConst.all_approval_request_status
                                    }
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData =
                                                this.state.filterData
                                            filterData.all_approval_request_status =
                                                value
                                            this.setState({ filterData })
                                        } else {
                                            let filterData =
                                                this.state.filterData
                                            filterData.all_approval_request_status =
                                                { label: '' }
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
                                            value={
                                                this.state.filterData
                                                    .all_approval_request_status
                                            }
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </Grid>
                <Grid container="container" className="mt-3 pb-5">
                    <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                        {this.state.loading ? (
                            <LoonsTable
                                //title={"All Aptitute Tests"}
                                id={'allAptitute'}
                                data={this.state.data}
                                columns={this.state.columns}
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: this.state.totalItems,
                                    rowsPerPage: 10,
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
            </LoonsCard>
        )
    }
}

export default AllApprovalRequests
