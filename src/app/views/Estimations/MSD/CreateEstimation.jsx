import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    IconButton,
    Icon,
    Tooltip,
    CircularProgress,
    Dialog
} from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import moment from 'moment';

import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import { yearMonthParse, dateParse, yearParse } from 'utils'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    LoonsTable,
    CardTitle,
    SubTitle,
    FilePicker,
    ImageView,
} from 'app/components/LoonsLabComponents'
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@mui/icons-material/Edit';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import * as appConst from '../../../../appconst'
import EstimationService from 'app/services/EstimationService'
import InventoryService from 'app/services/InventoryService'
import localStorageService from 'app/services/localStorageService'
import EstimationWarehousesAssign from './EstimationWarehousesAssign'
import CategoryService from 'app/services/datasetupServices/CategoryService'


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
    root: {
        display: 'flex',
    },
})

class CreateEstimation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            estimationYear: null,
            submitting: false,
            editLoad: true,
            loaded: false,
            EstimationWarehouses: false,
            selectedEstimation: null,
            alert: false,
            message: '',
            severity: 'success',
            all_item_category: [],
            filterData: {
                estimation_setup_id: this.props.match.params.id,
                page: 0,
                limit: 20,
                'order[0]': ['createdAt', 'DESC']
            },
            edit: false,
            editEstimationId: null,
            formData: {
                estimation_setup_id: this.props.match.params.id,
                from: null,
                to: null,
                consumables: null,
                all_item_category: null,
                item_priority: null,
                start_date: null,
                end_date: null,
                dp_required_date: null,
                massage: null,
                type: 'Annual',
                name: null,
                institute_category: null
            },
            data: [],

            columns: [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return <Grid className="flex ">

                                <Tooltip title="View Submitted Estimations">
                                    <IconButton
                                        onClick={() => {
                                            window.location.href = `/estimation/totalEstimationItemWise/${this.state.data[dataIndex].id}`

                                        }}>
                                        <VisibilityIcon color='primary' />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Assign Warehouse">
                                    <IconButton
                                        onClick={() => {
                                            this.setState({ selectedEstimation: this.state.data[dataIndex], EstimationWarehouses: true })

                                        }}>
                                        <AccountTreeIcon color='primary' />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Edit">
                                    <IconButton
                                        onClick={() => {
                                            this.setState({ editLoad: false })
                                            let formData = this.state.formData
                                            formData.from = this.state.data[dataIndex].from
                                            formData.to = this.state.data[dataIndex].to
                                            formData.start_date = this.state.data[dataIndex].start_date
                                            formData.end_date = this.state.data[dataIndex].end_date
                                            formData.massage = this.state.data[dataIndex].massage
                                            formData.type = this.state.data[dataIndex].type
                                            formData.name = this.state.data[dataIndex].name
                                            formData.item_priority = this.state.data[dataIndex].item_priority
                                            formData.item_category = this.state.data[dataIndex].item_category
                                            formData.dp_required_date = this.state.data[dataIndex].dp_required_date
                                            formData.institute_category = this.state.data[dataIndex].institute_category
                                            setTimeout(() => {
                                                this.setState({ edit: true, editEstimationId: this.state.data[dataIndex].id, formData, editLoad: true })
                                            
                                            }, 200);
                                            console.log("edit form data", this.state.formData)
                                        }}>
                                        <EditIcon color='primary' />
                                    </IconButton>
                                </Tooltip>
                            </Grid >
                        },
                    },
                },
                {
                    name: 'type',
                    label: 'Type',
                },
                {
                    name: 'name',
                    label: 'Name',
                },
                {
                    name: 'itemtype',
                    label: 'Item Type',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].consumables

                            return appConst.item_type.find(x => x.value == data)?.label
                        },
                    },
                },

                {
                    name: 'institute_category',
                    label: 'Institute Category',
                },

                {
                    name: 'item_category',
                    label: 'Item Category',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.all_item_category.find((v) => v.id == this.state.data[dataIndex].item_category)

                            return data?.description
                        },
                    },
                    
                },

                {
                    name: 'item_priority',
                    label: 'Item Priority',
                },

                {
                    name: 'from',
                    label: 'From',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].from
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'to',
                    label: 'To',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].to
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'start_date',
                    label: 'Submission Start Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].start_date
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'end_date',
                    label: 'Submission End Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].end_date
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'end_date',
                    label: 'Devisional Pharmacist Required Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].dp_required_date
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'massage',
                    label: 'Message',
                },
            ]
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let res = await EstimationService.getAllEstimations(this.state.filterData)
        if (res.status == 200) {
            console.log("estimation data", res.data.view.data)
            this.setState({
                data: res.data.view.data,
                loaded: true
            })
        }
    }

    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({ filterData }, () => { this.loadData() })
    }

    async loadCatogories() {

        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
    }

    async componentDidMount() {


        const query = new URLSearchParams(this.props.location.search);
        const year = query.get('year')
        let formData = this.state.formData
        formData.from = new Date(yearParse(year), 0, 1);  // January 1st of the specified year
        formData.to = new Date(yearParse(year), 11, 31);

        this.setState({
            formData,
            estimationYear: yearParse(year)
        })
        this.loadCatogories()

        this.loadData();
        //let hosID = this.props.id;
        //this.loadItemById(hosID);
    }



    async submit() {
        this.setState({ submitting: true })

        let formData = this.state.formData;

        let res = await EstimationService.createEstimation(formData)
        console.log("Estimation Data added", res)
        if (res.status === 201) {
            this.setState({
                alert: true,
                message: 'Estimation added successfully!',
                severity: 'success',
                submitting: false
            }, () => {
                this.setPage(0)
            }
            )
        } else {
            this.setState({
                alert: true,
                message: 'Estimation adding was unsuccessful!',
                severity: 'error',
                submitting: false
            })
        }



    }

    async editSubmit() {
        this.setState({ submitting: true })

        let formData = this.state.formData;

        let res = await EstimationService.EditEstimation(this.state.editEstimationId, formData)
        console.log("Estimation Data added", res)
        if (res.status === 200) {
            this.setState({
                alert: true,
                message: 'Estimation Edit Successfully!',
                severity: 'success',
                submitting: false
            }
                , () => {
                    this.setPage(0)
                }
            )
        } else {
            this.setState({
                alert: true,
                message: 'Estimation Edit Was Unsuccessful!',
                severity: 'error',
                submitting: false
            })
        }
    }

    render() {
        const { classes } = this.props
        return (
            < Fragment >
                <MainContainer>
                    <LoonsCard className="mt-3">
                        <CardTitle title="Estimation" />

                        {this.state.editLoad &&
                            <ValidatorForm
                                className="pt-2"
                                onSubmit={() => { this.state.edit ? this.editSubmit() : this.submit() }}
                                onError={() => null}
                            >

                                <Grid className='mt-3' container spacing={2}>
                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                        <SubTitle title="Estimation Type" />

                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={
                                                appConst.estimation_type
                                            }
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData = this.state.formData
                                                    formData.type = value.value
                                                    this.setState({
                                                        formData,
                                                    })
                                                }
                                            }}
                                            defaultValue={{
                                                label: this.state.formData.type,
                                            }}
                                            value={{
                                                label: this.state.formData.type,
                                            }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Estimation Type"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />

                                            )}
                                        />

                                    </Grid>
                                    <Grid item xs={6} sm={12} md={4} lg={4}>
                                        <SubTitle title="Estimation Title" />
                                        <TextValidator
                                            className="w-full"
                                            placeholder="Estimation Title"
                                            name="defaultDuration"

                                            value={this.state.formData.name
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData = this.state.formData
                                                formData.name = e.target.value
                                                this.setState({ formData })
                                            }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>

                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                        <SubTitle title="Institute Category" />

                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={appConst.institute_category}
                                            onChange={(e, value) => {
                                                let formData = this.state.formData
                                                formData.institute_category = value.value
                                                this.setState({
                                                    formData,
                                                })

                                            }}
                                            defaultValue={
                                                appConst.institute_category.find(x => x.value == this.state.formData.institute_category)
                                            }
                                            value={appConst.institute_category.find(x => x.value == this.state.formData.institute_category)
                                            }
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(
                                                params
                                            ) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Institute Category"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />

                                            )}
                                        />

                                    </Grid>
                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                        <SubTitle title="Item Type" />

                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={appConst.item_type}
                                            onChange={(e, value) => {
                                                let formData = this.state.formData
                                                formData.consumables = value.value
                                                this.setState({
                                                    formData,
                                                })

                                            }}
                                            defaultValue={
                                                appConst.item_type.find(x => x.value == this.state.formData.consumables)
                                            }
                                            value={appConst.item_type.find(x => x.value == this.state.formData.consumables)
                                            }
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(
                                                params
                                            ) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Item Type"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />

                                            )}
                                        />

                                    </Grid>
                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                        <SubTitle title="Item Category" />

                                        <Autocomplete
                                            className="w-full"
                                            options={this.state.all_item_category}
                                            onChange={(e, value) => {
                                                let formData = this.state.formData
                                                if (value == null) {
                                                    formData.item_category = null
                                                } else {
                                                    formData.item_category = value.id
                                                }
                                                this.setState({
                                                    formData,
                                                }, console.log("formData", this.state.formData))
                                            }
                                            }
                                            value={this.state.all_item_category.find((v) => v.id == this.state.formData.item_category)}
                                            getOptionLabel={(option) => option.description ? option.description : ''}
                                            renderInput={(params) => (
                                                <TextValidator {...params} placeholder="Item Category"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth" variant="outlined" size="small" />
                                            )} />

                                    </Grid>

                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                        <SubTitle title="Item Priority" />

                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={appConst.item_priority_values}
                                            onChange={(e, value) => {
                                                let formData = this.state.formData
                                                formData.item_priority = value.value
                                                this.setState({
                                                    formData,
                                                })

                                            }}
                                            defaultValue={
                                                appConst.item_priority_values.find(x => x.value == this.state.formData.item_priority)
                                            }
                                            value={appConst.item_priority_values.find(x => x.value == this.state.formData.item_priority)
                                            }
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(
                                                params
                                            ) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Item Type"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />

                                            )}
                                        />

                                    </Grid>
                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                        <SubTitle title="Duration From" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.formData.from}
                                            disabled={this.state.formData.type === null || this.state.formData.type === ' ' ? true : false}
                                            placeholder="Date From"
                                            //views={['year', 'month']}
                                            // inputFormat="yyyy-MM"
                                            //format="MM/yyyy"
                                            minDate={new Date(yearParse(this.state.estimationYear), 0, 1)}
                                            // maxDate={new Date()}
                                            required={true}
                                            errorMessages="This Field is Required"
                                            onChange={date => {
                                                let formData = this.state.formData;
                                                formData.from = dateParse(date);
                                                this.setState({ formData })

                                            }}
                                        />
                                    </Grid>
                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                        <SubTitle title="Duration To" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.formData.to}
                                            placeholder="Date To"
                                            disabled={this.state.formData.from == null || this.state.formData.from === " " ? true : false}
                                            minDate={new Date(this.state.formData.from)}

                                            maxDate={new Date(yearParse(this.state.estimationYear), 11, 31)}

                                            required={true}
                                            errorMessages="This Field is Required"
                                            //inputFormat="yyyy-MM"
                                            // format="MM/yyyy"
                                            onChange={date => {
                                                let formData = this.state.formData;
                                                formData.to = dateParse(date);
                                                this.setState({ formData })
                                            }}
                                        />
                                    </Grid>
                                    <Grid className=" w-full " item lg={4} md={4} sm={12} xs={12}  >
                                        <SubTitle title="Estimation Obtained Time Period From" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.formData.start_date}
                                            disabled={this.state.formData.type === null || this.state.formData.type === ' ' ? true : false}
                                            placeholder="Start Date"
                                            // minDate={ moment(new Date() ).add(1, 'years')}
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={date => {
                                                let formData = this.state.formData;
                                                formData.start_date = dateParse(date);
                                                this.setState({ formData })

                                            }}
                                        />
                                    </Grid>
                                    <Grid className=" w-full " item lg={4} md={4} sm={12} xs={12}  >
                                        <SubTitle title="Estimation Obtained Time Period To" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.formData.end_date}
                                            disabled={this.state.formData.start_date == null || this.state.formData.start_date === " " ? true : false}
                                            placeholder="Dead-line"
                                            maxDate={this.state.formData.type === "Annual" ?
                                                moment(this.state.formData.start_date).add(1, 'years') : null
                                            }
                                            minDate={new Date(this.state.formData.start_date)}
                                            // minDate={dateParse(this.state.formData.end_date)}
                                            // maxDate={new Date()+3}
                                            required={true}
                                            errorMessages="This Field is Required"
                                            onChange={date => {
                                                let formData = this.state.formData;
                                                formData.end_date = dateParse(date);
                                                this.setState({ formData })

                                            }}
                                        />
                                    </Grid>


                                    <Grid className=" w-full " item lg={4} md={4} sm={12} xs={12}  >
                                        <SubTitle title="Devisional Pharmacist Required Date" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.formData.dp_required_date}
                                            placeholder="Devisional Pharmacist Required Date"
                                            maxDate={this.state.formData.type === "Annual" ?
                                                moment(this.state.formData.start_date).add(1, 'years') : null
                                            }
                                            minDate={new Date(this.state.formData.start_date)}
                                            // required={true}
                                            //errorMessages="This Field is Required"
                                            onChange={date => {
                                                let formData = this.state.formData;
                                                formData.dp_required_date = dateParse(date);
                                                this.setState({ formData })

                                            }}
                                        />
                                    </Grid>


                                    <Grid item xs={6} sm={12} md={4} lg={4}>
                                        <SubTitle title="Message" />
                                        <TextValidator
                                            className="w-full"
                                            placeholder="Message"
                                            name="message"

                                            value={this.state.formData.massage
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData = this.state.formData
                                                formData.massage = e.target.value
                                                this.setState({ formData })
                                            }}
                                        /* validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]} */
                                        />
                                    </Grid>
                                </Grid>







                                <Button
                                    className="mt-2 mr-2"
                                    progress={this.state.submitting}
                                    type="submit"
                                    scrollToTop={true}
                                    startIcon="save"
                                //onClick={this.handleChange}
                                >
                                    <span className="capitalize">
                                        <span className="capitalize">
                                            {this.state.edit ? "Edit" : "Save"}
                                        </span>
                                    </span>
                                </Button>

                            </ValidatorForm>
                        }





                        <Grid className='mt-10'>

                            <CardTitle title="All Estimation" />

                            {this.state.loaded ?
                                <LoonsTable
                                    className="mt-5"
                                    //title={"All Aptitute Tests"}

                                    id={'estimationStups'}
                                    // title={'Active Prescription'}
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        // count: 10,
                                        rowsPerPage: this.state.filterData.limit,
                                        page: this.state.filterData.page,
                                        print: false,
                                        viewColumns: false,
                                        download: false,
                                        onRowClick: this.onRowClick,
                                        onTableChange: (action, tableState) => {
                                            console.log(action, tableState)
                                            switch (action) {
                                                case 'changePage':
                                                    this.setPage(tableState.page)
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
                                :
                                <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress
                                        size={30}
                                    />
                                </Grid>
                            }
                        </Grid>




                        <Grid className="justify-center text-center w-full pt-12">
                            {/* <CircularProgress
                                size={30}
                            /> */}
                        </Grid>

                    </LoonsCard>
                </MainContainer>


                <Dialog fullWidth maxWidth="lg" open={this.state.EstimationWarehouses} onClose={() => { this.setState({ EstimationWarehouses: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    EstimationWarehouses: false

                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>
                        <EstimationWarehousesAssign selectedEstimation={this.state.selectedEstimation}></EstimationWarehousesAssign>
                    </MainContainer>
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

export default withStyles(styleSheet)(CreateEstimation)

