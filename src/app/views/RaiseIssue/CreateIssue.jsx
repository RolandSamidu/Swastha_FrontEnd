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
    FilePicker
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import IssueServices from 'app/services/IssueServices'

const styleSheet = (theme) => ({})

class CreateIssue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            isUpdate: false,
            data: [],
            catId: null,
            isLoaded: false,
            submitting: false,
            columns: [
                {
                    name: 'id',
                    label: 'id',
                    options: {
                        display: false,
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
                    name: 'from',
                    label: 'From',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'to',
                    label: 'TO',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'short_refferance',
                    label: 'Short Refferance',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'name',
                    label: 'Name',
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
                        customBodyRender: (value, res) => {
                            return (
                                <Button
                                    color="secondary"
                                    onClick={() => {
                                        this.handleUpdate(res.rowData)
                                    }}
                                >
                                    {' '}
                                    Update
                                </Button>
                            )
                        },
                    },
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            patient_pic: null,


            loading: false,
            files: { fileList: [] },
            formData: {
                subject: null,
                text: null,
                name: null,
                contact_no: null,
                email: null,

            },
            filterData: {
                limit: 10,
                page: 0,
            },
            totalItems: 0,
            totalPages: 0,
            tableDataLoaded: false,
        }
    }




    handleDataSubmit = async () => {
        this.setState({ submitting: true })
        var form_data2 = new FormData();
        let files = []
        this.state.files.fileList.forEach(element => {

            // files.push(element.file)
            form_data2.append(`file`, element.file);
        });

        // form_data2.append(`file`, files);
        form_data2.append(`subject`, this.state.formData.subject)
        form_data2.append(`text`, this.state.formData.text)
        form_data2.append(`name`, this.state.formData.name)
        form_data2.append(`contact_no`, this.state.formData.contact_no)
        form_data2.append(`email`, this.state.formData.email)

        let res = await IssueServices.createIssue(form_data2)

        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Issue Submit Successfully',
                severity: 'success',
                submitting:false
            },()=>{window.location.reload()})
        } else {
            this.setState({
                alert: true,
                message: 'Please try again',
                severity: 'error',
                submitting:false
            })
        }

    }

    componentDidMount() {

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
                        <CardTitle title="Issue" />

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
                                            <Grid container spacing={2}>
                                                {/* name */}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Subject" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Subject"
                                                        name="subject"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .subject
                                                        }
                                                        disabled={
                                                            this.state.isUpdate
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this.state.formData,
                                                                    subject: e.target.value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
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
                                                    <SubTitle title="Your Name" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Your Name"
                                                        name="name"
                                                        disabled={
                                                            this.state.isUpdate
                                                        }
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData.name
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this.state.formData,
                                                                    name: e.target.value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
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
                                                    <SubTitle title="Contact Number" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Contact Number"
                                                        name="contact_number"
                                                        disabled={
                                                            this.state.isUpdate
                                                        }
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData.contact_no
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this.state.formData,
                                                                    contact_no: e.target.value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
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
                                                    <SubTitle title="Email" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Email"
                                                        name="email"
                                                        disabled={
                                                            this.state.isUpdate
                                                        }
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData.email
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this.state.formData,
                                                                    email: e.target.value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
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
                                                        name="text"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData.text
                                                        }
                                                        type="text"
                                                        multiline
                                                        rows={3}
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this.state.formData,
                                                                    text: e.target.value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                                    <SubTitle title="Image" />
                                                    <FilePicker
                                                        className="w-full mt-2"
                                                        singleFileEnable={true}
                                                        id="supporting_image"
                                                        multipleFileEnable={true}
                                                        dragAndDropEnable={true}
                                                        //tableEnable={false}
                                                        documentName={false}
                                                        //documentNameValidation={['required']}
                                                        //documenterrorMessages={['this field is required']}
                                                        //accept="image/png, image/gif, image/jpeg"
                                                        maxFileSize={512000}
                                                        maxTotalFileSize={512000}
                                                        maxFilesCount={5}
                                                        //validators={['required', 'maxSize', 'maxTotalFileSize', 'maxFileCount']}
                                                        // errorMessages={['this field is required', "file size too lage", "Total file size is too lage", "Too many files added"]}
                                                        // validators={['required', 'maxSize', 'maxTotalFileSize', 'maxFileCount']}
                                                        // errorMessages={['this field is required', "file size too lage", "Total file size is too lage", "Too many files added"]}
                                                        label=""
                                                        singleFileButtonText="Select File"
                                                        multipleFileButtonText="Select Files"
                                                        selectedFileList={this.state.files.fileList}
                                                        selectedFiles={(files) => {
                                                            this.setState({ files: files })
                                                        }}
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
                                                            progress={this.state.submitting}
                                                            type="submit"
                                                            scrollToTop={true}
                                                            startIcon="save"
                                                        //onClick={this.handleChange}
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

                                {/* Table Section */}
                                {/*  <Grid container className="mt-3">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        {this.state.tableDataLoaded ? (
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'}
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
                                </Grid> */}
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

export default withStyles(styleSheet)(CreateIssue)
