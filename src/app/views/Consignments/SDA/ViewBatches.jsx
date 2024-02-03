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
import {
    CircularProgress,
    Grid,
    Tooltip,
    IconButton,
    Checkbox,
} from '@material-ui/core'
import * as appConst from '../../../../appconst'
import { Autocomplete } from '@material-ui/lab'
import { yearParse, dateParse } from 'utils'
import moment from 'moment'
//import { DatePicker } from '@mui/x-date-pickers/DatePicker';

class ViewBatches extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            filterData: {
                year: null,
                indent_no: '',
                sr_no: '',
                expiry_date: '',
                batch_no: '',
            },
            columns: [
                {
                    name: 'indent_no', // field name in the row object
                    label: 'Indent No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'item_code', // field name in the row object
                    label: 'Item Code', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'batch_no', // field name in the row object
                    label: 'Batch No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'expiry_date', // field name in the row object
                    label: 'Expiry Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {value ? dateParse(moment(value)) : ''}
                                </span>
                            )
                        },
                    },
                },
                {
                    name: 'batch_price', // field name in the row object
                    label: 'Batch Price', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'purchase_price', // field name in the row object
                    label: 'Purchase Price', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'quantity_received', // field name in the row object
                    label: 'Quantity Received', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'suppiler_charges', // field name in the row object
                    label: 'supplier Charges', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'total_cost', // field name in the row object
                    label: 'Total Cost', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'average_cost', // field name in the row object
                    label: 'Average Cost', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
            ],
        }
    }
    /* 
    async loadData() {
        this.setState({loaded: false})

        let res = await ConsignmentService.getAllConsignments(this.state.filterData)
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
     */
    render() {
        return (
            <MainContainer>
                <LoonsCard>
                    <ValidatorForm>
                        <CardTitle title={'View Batches - Shipment Costing'} />

                        <Grid container spacing={2}>
                            <Grid item lg={2} md={2} sm={12} xs={12}>
                                <SubTitle title="Year" />

                                <DatePicker
                                    className="w-full"
                                    views={['year']}
                                    value={this.state.filterData.year}
                                    format={'yyyy'}
                                    placeholder="Enter year"
                                    required={true}
                                    errorMessages="this field is required"
                                    onChange={(year) => {
                                        let filterData = this.state.filterData
                                        filterData.year = yearParse(year)
                                        this.setState({ filterData })
                                    }}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} sm={12} xs={12}>
                                <SubTitle title="Indent No" />
                                <TextValidator
                                    className="w-full"
                                    placeholder="Enter Indent Numbers"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    /* value={
                                        this.state
                                            .filterData
                                            .indent_no
                                    } */
                                    /* onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.indent_no = e.target.value
                                        this.setState({ formData })

                                    }} */
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} sm={12} xs={12}>
                                <SubTitle title="SR No" />
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    value={this.state.filterData.sr_no}
                                    options={appConst.sr_no}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData =
                                                this.state.filterData
                                            filterData.sr_no = value
                                            this.setState({ filterData })
                                        } else {
                                            let filterData =
                                                this.state.filterData
                                            filterData.sr_no = { label: '' }
                                            this.setState({ filterData })
                                        }
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Select SR No"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={this.state.filterData.sr_no}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} sm={12} xs={12}>
                                <SubTitle title="Batch No" />
                                <TextValidator
                                    className="w-full"
                                    placeholder="Enter Batch No"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    /* value={
                                        this.state
                                            .filterData
                                            .batch_no
                                    } */
                                    /* onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.batch_no = e.target.value
                                    this.setState({ formData }) 

                                    }}*/
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} sm={12} xs={12}>
                                <SubTitle title="Expiry Date" />
                                <DatePicker
                                    className="w-full"
                                    value={this.state.filterData.from_date}
                                    placeholder="Enter Expiry date"
                                    required={true}
                                    errorMessages="this field is required"
                                    onChange={(date) => {
                                        let filterData = this.state.filterData
                                        filterData.from_date = date
                                        this.setState({ filterData })
                                    }}
                                />
                            </Grid>
                        </Grid>

                        {/* Table Section */}
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
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
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

                        <Grid item className="w-full flex justify-end my-12">
                            <Button
                                className="mr-2 mt-7"
                                progress={false}
                                type="submit"
                                scrollToTop={false}
                            >
                                <span className="capitalize">close</span>
                            </Button>
                        </Grid>
                    </ValidatorForm>
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default ViewBatches
