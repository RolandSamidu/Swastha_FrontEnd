import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
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
} from '@material-ui/core'
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';

import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

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
import CategoryService from 'app/services/datasetupServices/CategoryService'

const styleSheet = (theme) => ({})

class Category extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            isUpdate: false,
            data: [],
            catId: null,
            isLoaded: false,
            columns: [
                // {
                //     name: 'id',
                //     label: 'id',
                //     options: {
                //         display: false,
                //     },
                // },
                {
                    name: 'code',
                    label: 'Code',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'description',
                    label: 'Description',
                    options: {
                        display: true,
                    },
                },
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
                                                this.handleUpdate(this.state.data[tableMeta.rowIndex]);
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

                        // customBodyRender: (value, res) => {
                        //     return (
                        //         <Button
                        //             color="secondary"
                        //             onClick={() => {
                        //                 this.handleUpdate(res.rowData)
                        //             }}
                        //         >
                        //             {' '}
                        //             Update
                        //         </Button>
                        //     )
                        // },
                    },
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            patient_pic: null,
            all_district: [],
            all_moh: [],
            all_phm: [],
            all_gn: [],

            loading: false,
            formData: {
                code: null,
                description: null,
            },
            filterData: {
                'order[0]': ['updatedAt', 'DESC'],
                limit: 20,
                page: 0,
            },
            totalItems: 0,
            totalPages: 0,
            tableDataLoaded: false,
        }
    }

    handleUpdate = (rowData) => {
        this.setState({
            formData: {
                code: rowData.code,
                description:rowData.description,
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

    clearField = () => {
        this.setState({
            formData: {
                code: '',
                description: '',
            },
            catId: null,
            isUpdate: false,
        })
    }

    handleDataSubmit = async () => {
        let { code, description } = this.state.formData
        let formData= this.state.formData

        const categoryDto = {
            code,
            description,
        }

        let res

        if (this.state.isUpdate) {
            res = await CategoryService.updateCategory(this.state.id, formData)

            if (200 == res.status) {
                this.setState({
                    alert: true,
                    message: 'Category Successfully Updated',
                    severity: 'success',

                })
                this.fetchDataSet()
            } else {
                this.setState({
                    alert: true,
                    message: 'Category Updated Unsuccessful',
                    severity: 'error',
                })
            }
            
        } else {
            //save function
            res = await CategoryService.createNewCategory(formData)


            console.log('Res===========>', res)

            if (201 == res.status) {
                this.setState({
                    alert: true,
                    message: 'Category Successfully Stored',
                    severity: 'success',
                })
                this.fetchDataSet()
            } else {
                this.setState({
                    alert: true,
                    message: 'Category Registration Unsuccessful',
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

        const res = await CategoryService.fetchAllCategories(filterData)

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
        let params = this.state.filterData
        params.page = page
        this.setState(
            {
                params,
            },
            () => {
                this.fetchDataSet()
            }
        )
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Category Management" />

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
                                            <SubTitle
                                                title={
                                                    this.state.isUpdate
                                                        ? 'Update Category'
                                                        : 'Create New Category'
                                                }
                                            />
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
                                                {/* code */}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Code" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Code"
                                                        name="code"
                                                        disabled={
                                                            this.state.isUpdate
                                                        }
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .code
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
                                                                    code: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required', 'matchRegexp:^\s*([A-Z]*)\s*$'
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required', 'Invalid Inputs'
                                                        ]}
                                                    />
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
                                                    <SubTitle title="Description" />
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Description"
                                                        name="Description"
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
                                                            'This field is required',
                                                        ]}
                                                    />
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
                                                                Cancel
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
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'}
                                                data={this.state.data}
                                                columns={this.state.columns}
                                                options={{
                                                    filter: false,
                                                    filterType:'textField',
                                                    responsive: 'standard',
                                                    pagination: true,
                                                    serverSide: true,
                                                    count: this.state.totalItems,
                                                    rowsPerPage: 20,
                                                    page: this.state.filterData.page,
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

export default withStyles(styleSheet)(Category)
