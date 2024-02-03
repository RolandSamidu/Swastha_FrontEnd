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
    Dialog
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import VisibilityIcon from '@material-ui/icons/Visibility'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
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
import { dateTimeParse } from 'utils';

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

class AllIssues extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            isUpdate: false,
            data: [],
            singleView: false,
            isLoaded: false,
            columns: [

                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <div>

                                    <IconButton
                                        className="px-2"
                                        onClick={() => {
                                            this.setState({ selectedIssue: this.state.data[dataIndex], singleView: true })
                                        }}
                                        size="small"
                                        aria-label="delete"
                                    >
                                        <VisibilityIcon color="primary" />
                                    </IconButton>


                                    <IconButton
                                        className="px-2"
                                        onClick={() => {
                                            this.closeIssue(this.state.data[dataIndex].id)
                                        }}
                                        size="small"
                                        aria-label="delete"
                                    >
                                        <AssignmentTurnedInIcon color="primary" />
                                    </IconButton>

                                </div>

                            )
                        },
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'Date',
                    label: 'Date Time',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (dateTimeParse(this.state.data[dataIndex].createdAt))
                        }
                    },
                },
                {
                    name: 'subject',
                    label: 'Subject',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'text',
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
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Complainer.name;
                            return <p>{data}</p>

                        },
                    },
                },



            ],

            selectedIssue: { Complainer: { name: '', email: '' }, ComplaintUploads: [] },
            alert: false,
            message: '',
            severity: 'success',

            patient_pic: null,


            loaded: false,
            formData: { comment: '', complaint_id: null },

            filterData: {
                limit: 10,
                page: 0,
                'order[0]': ['createdAt', 'DESC'],
                status:null,
            },
            totalItems: 0,
            totalPages: 0,
            tableDataLoaded: false,
        }
    }

    async loadData() {
        this.setState({ loaded: false })

        const res = await IssueServices.getIssues(this.state.filterData)

        if (res.status == 200) {
            console.log("issue Data", res.data.view)
            this.setState({
                data: res.data.view.data,
                loaded: true,
                totalItems: res.data.view.totalItems,
                totalPages: res.data.view.totalPages
            })
        }
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





    componentDidMount() {
        this.loadData()
        this.interval = setInterval(() => this.loadData(), 60000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }



    async handleSubmit() {
        let formData = this.state.formData;
        formData.complaint_id = this.state.selectedIssue.id;
        let res = await IssueServices.commentIssue(formData)
        if (res.status == 201) {
            this.setState({
                alert: true,
                message: 'Comment Added Successful',
                severity: 'success',
            })
            window.location.reload()
        } else {
            this.setState({
                alert: true,
                message: 'Unsuccessful',
                severity: 'error',
            })
        }
    }

    async closeIssue(id) {

        let res = await IssueServices.editIssue({ status: "Closed" }, id)
        if (res.status == 200) {
            this.setState({
                alert: true,
                message: 'Successful',
                severity: 'success',
            })
            window.location.reload()
        } else {
            this.setState({
                alert: true,
                message: 'Unsuccessful',
                severity: 'error',
            })
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="All Issues" />

                        <ValidatorForm className="w-full">
                            <Grid container spacing={2} className="w-full">
                                <Grid item lg={3} md={3} sm={3} xs={3}>
                                    <Autocomplete
                                        //disableClearable
                                        className="w-full"
                                        options={[{ lable: 'Active', value: 'Active' }, { lable: 'Closed', value: 'Closed' }, { lable: 'All', value: null }]}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let filterData = this.state.filterData;
                                                filterData.status = value.value
                                                this.setState({ filterData })

                                            } else {
                                                let filterData = this.state.filterData;
                                                filterData.status = null
                                                this.setState({ filterData })
                                            }
                                        }}
                                        //value={this.state.filterData.status}
                                        getOptionLabel={(option) => option.lable}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Status"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button className='mt-1' onClick={() => { this.loadData() }}>
                                        Filter
                                    </Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>

                        {/* Main Grid */}
                        <Grid
                            container
                            spacing={2}
                            direction="row"
                            className="mt-3"
                        >

                            <Grid container className="mt-3">
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    {this.state.loaded ? (
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allIssues'}
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
                    </LoonsCard>
                </MainContainer>


                <Dialog maxWidth={"md"} fullWidth={true} open={this.state.singleView} /* onClose={() => { this.setState({ admissiondialogView: false }) }} */>

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                        <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ singleView: false }) }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        <Grid container spacing={2}>
                            {/* name */}
                            <Grid
                                className=" w-full"
                                item
                                lg={4}
                                md={4}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Subject" />

                                {this.state.selectedIssue.subject}
                            </Grid>

                            <Grid
                                className=" w-full"
                                item
                                lg={4}
                                md={4}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Complainer Name" />
                                {this.state.selectedIssue.Complainer.name}

                            </Grid>


                            <Grid
                                className=" w-full"
                                item
                                lg={4}
                                md={4}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Contact Number" />
                                {this.state.selectedIssue.Complainer.contact_no}

                            </Grid>


                            <Grid
                                className=" w-full"
                                item
                                lg={4}
                                md={4}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Email" />
                                {this.state.selectedIssue.Complainer.email}

                            </Grid>

                            {/* Description*/}
                            <Grid
                                className=" w-full"
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Description" />
                                {this.state.selectedIssue.text}
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12}>

                                {this.state.selectedIssue.ComplaintUploads.length > 0 ?
                                    <div>
                                        <SubTitle title="Image" />
                                        <Grid container spacing={2}>
                                            {this.state.selectedIssue.ComplaintUploads.map((item, ind) => (
                                                <Grid item xs={12} sm={12} md={4} lg={4}>

                                                    <ImageView
                                                        image_data={item}
                                                        preview_width='300px'
                                                        preview_height='300px'
                                                    // radius={25}
                                                    />
                                                </Grid>

                                            ))}
                                        </Grid>
                                    </div>
                                    : null}
                            </Grid>

                            <Grid
                                className=" w-full"
                                item
                                lg={6}
                                md={6}
                                sm={12}
                                xs={12}
                            >
                                <ValidatorForm
                                    className="pt-2"
                                    onSubmit={() => this.handleSubmit()}
                                    onError={() => null}
                                >
                                    <SubTitle title="Comment" />
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Comment"
                                        name="text"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        value={
                                            this.state.formData.comment
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
                                                    comment: e.target.value,
                                                },
                                            })
                                        }}
                                    /*  validators={[
                                         'required',
                                     ]}
                                     errorMessages={[
                                         'this field is required',
                                     ]} */
                                    />


                                    <Button
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                        startIcon="save"
                                    //onClick={this.handleChange}
                                    >
                                        <span className="capitalize">
                                            Save
                                        </span>
                                    </Button>

                                </ValidatorForm>
                            </Grid>


                        </Grid>
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

export default withStyles(styleSheet)(AllIssues)
