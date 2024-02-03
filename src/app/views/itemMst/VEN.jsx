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
import * as appConst from '../../../appconst'
import ItemMasterSerive from 'app/services/datasetupServices/ItemMasterSerive'

const styleSheet = (theme) => ({})

class VEN extends Component {
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
                    name: 'name',
                    label: 'Name',
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
                description: null,
            },
            filterData: {
                limit: 10,
                page: 0,
                'order[0]': ['updatedAt', 'DESC']
            },
            totalItems: 0,
            totalPages: 0,
            tableDataLoaded: false,
        }
    }

    clearField = () => {
        this.setState({
            formData: {
                name: '',
                description: '',
            },
            isUpdate: false,
        })
    }

    setDataToFields(rowData) {
        this.setState({
            isUpdate: true,
            id: rowData.id,
            formData: {
                name: rowData.name,
                description: rowData.description
            }
        }, () => {
            console.log('Form Data===========>', this.state.formData)

        }
        )
        this.setState({
            isUpdate: true,
        }, () => { this.render() })
    }

    handleDataSubmit = async () => {
        let { name, description } = this.state.formData

        const VENDTO = {
            name,
            description,
        }

        let id = this.state.id
        let res
        if (this.state.isUpdate) {
            res = await ItemMasterSerive.updateVEN(id, VENDTO)

            if (200 == res.status) {
                this.setState({
                    alert: true,
                    message: 'VEN Successfully Updated',
                    severity: 'success',
                })
            } else {
                this.setState({
                    alert: true,
                    message: 'VEN Updated Unsuccessful',
                    severity: 'error',
                })
            }
        }else{
        //save function
        res = await ItemMasterSerive.createVEN(VENDTO)
        

        console.log('Res===========>', res)

        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'VEN Successfully Stored',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'VEN Stored Unsuccessful',
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

        const res = await ItemMasterSerive.fetchAllVENs(filterData)

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

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="VEN Management" />

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
                                                title={'Create New VEN'}
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
                                                                () => {
                                                                    if(this.state.isUpdate !== true ){
                                                                        window.location.reload()
                                                                    }
                                                                   else{
                                                                    this.clearField()
                                                                   }
                                                                 }
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
                                                    rowsPerPage: 10,
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

export default withStyles(styleSheet)(VEN)
