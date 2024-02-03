import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
} from '@material-ui/core'
import 'date-fns'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    SubTitle,
    LoonsTable,
} from 'app/components/LoonsLabComponents'

import ConsignmentService from 'app/services/ConsignmentService'


const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
})

const AddInputDate = ({ onChange = (date) => date, val = null, text = "Add", tail = null, require = false, disable = true }) => (
    <DatePicker
        className="w-full"
        value={val}
        disabled={disable}
        //label="Date From"
        placeholder={`⊕ ${text}`}
        // minDate={new Date()}
        format='dd/MM/yyyy'
        //maxDate={new Date("2020-10-20")}
        required={require}
        // errorMessages="this field is required"
        onChange={onChange}
    />
)

const AddTextInput = ({ type = 'text', onChange = (e) => e, val = "", text = "Add", tail = null, disable = true, require = false }) => (
    <TextValidator
        className=" w-full"
        placeholder={`⊕ ${text}`}
        // name="sr_no"
        InputLabelProps={{
            shrink: false,
        }}
        value={val}
        type="text"
        variant="outlined"
        size="small"
        disabled={disable}
        onChange={onChange}
        validators={require ? [
            'required',
        ] : []}
        errorMessages={require ? [
            'this field is required',
        ] : []}
    />
)

class GRNItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: '',
            severity: 'success',

            grnData: {
                grn_no: null,
                grn_date: null
            },

            data: [],
            columns: [
                {
                    name: 'sequence',
                    label: 'Sequence',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{tableMeta.rowIndex + 1}</p>
                            )
                        },
                    },
                },
                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap ? this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.sr_no : "N/A"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'description',
                    label: 'Description',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap ? this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.medium_description : "N/A"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'price',
                    label: 'Price',
                    options: {

                    },
                },
                {
                    name: 'quantity',
                    label: 'Ordered Quantity',
                    options: {
                    },

                },
                {
                    name: 'consignment_quantity',
                    label: 'Consignment Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.ConsignmentItemBatch ? this.state.data[tableMeta.rowIndex]?.ConsignmentItemBatch?.quantity : "N/A"}</p>
                            )
                        },
                    },

                },
                {
                    name: 'grn_quantity',
                    label: 'GRN Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.ConsignmentItemBatch ? this.state.data[tableMeta.rowIndex]?.ConsignmentItemBatch?.grn_quantity : "N/A"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'recieved_quantity',
                    label: 'Recieved Quantity',
                    options: {

                    },

                },
                {
                    name: 'damage',
                    label: 'Damage',
                    options: {

                    },
                },
                {
                    name: 'shortage',
                    label: 'Shortage',
                    options: {

                    },
                },
                {
                    name: 'excess',
                    label: 'Excess',
                    options: {

                    },
                },
            ],

            filterData: {},
            totalItems: 0,

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
            },
        }

    }

    loadData = async () => {
        this.setState({ loading: false });
        const formData = this.state.formData
        let res = await ConsignmentService.getGRNItems({ ...formData, consignment_id: this.state.filterData?.id })

        if (res.status === 200) {
            console.log('GRN Data: ', res.data.view.data);
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems })
        }

        this.setState({ loading: true })
    }

    async setPage(page) {
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            this.loadData()
        })
    }

    onSubmit = async () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleSubmit();
        // this.props.handleClose();
    }

    onBack = () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleBack();
    };

    componentDidMount() {
        const { data } = this.props
        if (data) {
            this.setState({ filterData: data }, () => {
                this.loadData()
            });
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <div className="pb-8 pt-2">
                    {/* Filtr Section */}
                    <ValidatorForm
                        className="pt-2"
                        onSubmit={this.onSubmit}
                        onError={() => null}
                    >
                        {/* Main Grid */}
                        <Grid container spacing={2} direction="row">
                            {/* Filter Section */}
                            <Grid item xs={12} className='mb-5' sm={12} md={12} lg={12}>
                                {/* Item Series Definition */}
                                <Grid container spacing={2}>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={3}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="GRN No" />
                                                <AddTextInput
                                                    disable={false}
                                                    require={false}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            grnData: {
                                                                ...this
                                                                    .state
                                                                    .grnData,
                                                                grn_no: e.target.value,
                                                            },
                                                        })
                                                    }} val={this.state.grnData.grn_no} text='Enter GRN Number' type='text' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={3}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="GRN Date" />
                                                <AddInputDate
                                                    disable={false}
                                                    require={false}
                                                    onChange={(date) => {
                                                        let filterData = this.state.grnData
                                                        filterData.grn_date = date
                                                        this.setState({ grnData: filterData })
                                                    }} val={this.state.grnData.grn_date} text='Enter GRN Date' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                item
                                                lg={6}
                                                md={4}
                                                sm={12}
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
                                                            className="mx-2"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            startIcon="search"
                                                            style={{ borderRadius: "10px" }}
                                                        // onClick={this.onBack}
                                                        >
                                                            <span className="capitalize">
                                                                Search
                                                            </span>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    id={'allApprovedPO'}
                                                    data={this.state.data}
                                                    columns={this.state.columns}
                                                    options={{
                                                        pagination: true,
                                                        rowsPerPage: this.state.formData.limit,
                                                        page: this.state.formData.page,
                                                        serverSide: true,
                                                        rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                        print: true,
                                                        count: this.state.totalItems,
                                                        viewColumns: true,
                                                        download: true,
                                                        onTableChange: (
                                                            action,
                                                            tableState
                                                        ) => {
                                                            console.log(
                                                                action,
                                                                tableState
                                                            )
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
                                                                        },
                                                                    }, () => {
                                                                        this.loadData()
                                                                    })
                                                                    break;
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
                                            </Grid>
                                            <Grid
                                                className='mt-5'
                                                style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
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
                                                            className="mr-2 py-2 px-4"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            startIcon="chevron_left"
                                                            style={{ borderRadius: "10px" }}
                                                            onClick={this.onBack}
                                                        >
                                                            <span className="capitalize">
                                                                Previous
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            className="mr-2 py-2 px-4"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            startIcon="close"
                                                            style={{ backgroundColor: "white", color: "black", border: "1px solid #3B71CA", borderRadius: "10px" }}
                                                            onClick={this.props.handleClose}
                                                        >
                                                            <span className="capitalize">
                                                                Cancel
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            style={{ borderRadius: "10px" }}
                                                            className="py-2 px-4"
                                                            progress={false}
                                                            type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            endIcon="chevron_right"
                                                        // onClick={this.props.handleNext}
                                                        >
                                                            <span className="capitalize">
                                                                Submit
                                                            </span>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </div>
                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={1200}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(GRNItems)
