import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Icon,
    Dialog,
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
} from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel';
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';

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

import InventoryService from 'app/services/InventoryService'

const styleSheet = (theme) => ({})

class MeasuringUnit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            isUpdate: false,
            data: [],
            catId: null,
            isLoaded: false,
            columns: [
            //     {
            //         name: 'id',
            //         label: 'ID',
            //         options: {
            //             display: false,
            //         },
            //     },
                {
                    name: 'name',
                    label: 'Name',
                    options: {
                        display: true,
                    },
                },
            //     {
            //         name: 'value',
            //         label: 'Quantity per day',
            //         options: {
            //             display: true,
            //         },
            //     },
                // {
                //     name: 'description',
                //     label: 'Description',
                //     options: {
                //         display: true,
                //     },
                // },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="Edit">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                console.log(this.state.data[tableMeta.rowIndex])
                                                this.setDataToFields(this.state.data[tableMeta.rowIndex]);
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )
                        },
                    },
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            loading: false,
            formData: {
                name: null,
                value:null,
                // description: null,
            },
            filterData: {
                'order[0]': ['updatedAt', 'DESC'],
                limit: 20,
                page: 0,
            },
            totalItems: 0,
            totalPages: 0,
            tableDataLoaded: false,
            id: '',
            // batchTraceWarning: false,
            // batchTraceDelete: null,
        }
    }

    clearField = () => {
        this.setState({
            formData: {
                name: "",
                value:"",
                // description: "",
            },
            isUpdate: false,

        })
    }

    handleDataSubmit = async () => {
        let formData= this.state.formData

        // const batchTraceDTO = {
        //     name,
        //     description,
        // }

        // let id = this.state.id
        let res
        if (this.state.isUpdate) {
            res = await InventoryService.updateMeasuringUnit(this.state.id, formData)

            if (200 == res.status) {
                this.setState({
                    alert: true,
                    message: 'Measuring Unit Successfully Updated',
                    severity: 'success',

                })
                this.fetchDataSet()
            } else {
                this.setState({
                    alert: true,
                    message: 'Measuring Unit Updated Unsuccessful',
                    severity: 'error',
                })
            }
            
        } else {
            //save function
            res = await InventoryService.createMeasuringUnit(formData)


            console.log('Res===========>', res)

            if (201 == res.status) {
                this.setState({
                    alert: true,
                    message: 'Measuring Unit Successfully Stored',
                    severity: 'success',
                })
                this.fetchDataSet()
            } else {
                this.setState({
                    alert: true,
                    message: 'Measuring Unit Registration Unsuccessful',
                    severity: 'error',
                })
            }
        }
        this.clearField()
        this.fetchDataSet()
    }

    componentDidMount() {
        this.fetchDataSet()
    }

    async fetchDataSet() {
        //Reset load
        this.setState({
            tableDataLoaded: false,
        })

        let filterData = this.state.filterData

        const res = await InventoryService.fetchAllMeasuringUnit(filterData)
        console.log("Data",res)
        if (200 == res.status) {
            filterData.page = res.data.view.currentPage
            this.setState(
                {
                    filterData,
                    data: res.data.view.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                    tableDataLoaded: true,
                },
                () => {
                    console.log('data', this.state)
                    this.render()
                }
            )
        }
    }

    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.fetchDataSet()
            }
        )
    }

    setDataToFields(rowData) {
        this.setState({
            formData: {
                name: rowData.name,
                value:rowData.value,
                // description: rowData.description
            },
            id: rowData.id,
        }, () => {
            console.log('Form Data===========>', this.state.formData)

        })
        
        this.setState({
            isUpdate: true,
        }, () => { this.render() })
    }
    // async removeEntry() {
    //     this.setState({ Loaded: false })
    //     let res = await ItemMasterSerive.delBatchtrace(this.state.batchTraceDelete)
    //     console.log("res.data", res.data);
    //     if (res.status) {
    //         if (res.data.view == "data deleted successfully.") {
    //             this.setState({
    //                 Loaded: true,
    //                 alert: true,
    //                 message: res.data.view,
    //                 severity: 'success',
    //             })
    //         }
    //         this.fetchDataSet(this.state.filterData)
    //     } else {
    //         this.setState(
    //             { alert: true, message: "Item Could Not be Deleted. Please Try Again",
    //              severity: 'error' }
    //         )
    //     }

    // }


    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Item Measuring Unit Management" />

                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.handleDataSubmit()}
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                className="mt-3"
                            >
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Grid container spacing={2}>
                                        {/* heading */}
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            
                                            <Divider className="mt-2" />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <Grid container spacing={2}>
                                                {/* frequency */}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Name" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Name"
                                                        name="name"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .name
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    name: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                        ]}
                                                    />
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    {/* <SubTitle title="Quentity per day" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="qtyPerDay"
                                                        name="qtyPerDay"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .value
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                        value: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    /> */}
                                                </Grid>


                                                {/* Description*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    {/* <SubTitle title="Description" />
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Description"
                                                        name="escription"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .description
                                                        }
                                                        type="text"
                                                        multiline
                                                        rows={3}
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    description:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    /> */}
                                                </Grid>
                                            </Grid>

                                            <Grid
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
                                                            className="mt-2 mr-2"
                                                            progress={false}
                                                            type="submit"
                                                            scrollToTop={true}
                                                            startIcon="save"
                                                        //onClick={this.handleChange}
                                                        >
                                                            <span className="capitalize">
                                                                {this.state
                                                                    .isUpdate
                                                                    ? 'Update'
                                                                    : 'Submit'}
                                                            </span>
                                                        </Button>
                                                        {/* Cancel Button */}
                                                        <Button
                                                            className="mt-2"
                                                            progress={false}
                                                            scrollToTop={true}
                                                            color="#cfd8dc"
                                                            onClick={
                                                                this.clearField
                                                            }
                                                        >
                                                            <span className="capitalize">
                                                                Clear
                                                            </span>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Table Section */}
                                <Grid container className="mt-3">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        {this.state.tableDataLoaded ? (
                                            <LoonsTable
                                                id={'batchTrace'}
                                                data={this.state.data}
                                                columns={this.state.columns}
                                                options={{
                                                    pagination: true,
                                                    serverSide: true,
                                                    count: this.state
                                                        .totalItems,
                                                    rowsPerPage: 20,
                                                    page: this.state.filterData
                                                        .page,
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
                                            //load loading effect
                                            <Grid className="justify-center text-center w-full pt-12">
                                                <CircularProgress size={30} />
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                    </LoonsCard>
                </MainContainer>
                <Dialog
                    maxWidth="lg "
                    open={this.state.batchTraceWarning}
                    onClose={() => {
                        this.setState({ batchTraceWarning: false })
                    }}>
                    <div className="w-full h-full px-5 py-5">

                        <CardTitle title="Are you sure you want to delete?"></CardTitle>
                        <div>
                            <p>This Batch will be deleted and you will have to apply for a new batch. This
                                cannot be undone.</p>
                            <Grid
                                container="container"
                                style={{
                                    justifyContent: 'flex-end'
                                }}>
                                <Grid
                                    className="w-full flex justify-end"
                                    item="item"
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}>
                                    <Button
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        startIcon="delete"
                                        onClick={() => {
                                            this.setState({ batchTraceWarning: false });
                                            this.clearField()
                                        }}>
                                        <span className="capitalize">Delete</span>
                                    </Button>

                                    <Button
                                        className="mt-2 ml-2"
                                        progress={false}
                                        type="submit"
                                        startIcon={<CancelIcon />}
                                        onClick={() => {
                                            this.setState({ batchTraceWarning: false });
                                        }}>
                                        <span className="capitalize">Clear</span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Dialog>

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
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(MeasuringUnit)
