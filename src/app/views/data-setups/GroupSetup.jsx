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
import GroupTypeSetupService from 'app/services/datasetupServices/GroupTypeSetupService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import CategoryService from 'app/services/datasetupServices/CategoryService'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'

const styleSheet = (theme) => ({})

class GroupSetup extends Component {
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
                    name: 'name',
                    label: 'Name',
                    options: {
                        display: true,
                    },
                },
                {
                    label: 'Category',
                    name: 'Category',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let data = this.state.data[tableMeta.rowIndex]?.Category?.description
                            return (
                               <p>{data}</p>
                            )
                        },
                    },
                },
                {
                    label: 'Class',
                    name: 'Class',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let data = this.state.data[tableMeta.rowIndex]?.Class?.description
                            return (
                               <p>{data}</p>
                            )
                        },
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
                    name: 'short_refferance',
                    label: 'Short Refferance',
                    options: {
                        display: true,
                    },
                }, 
                //associate tables
                // {
                //     label: 'catId',
                //     name: 'category_id',
                //     options: {
                //         display: false,
                //     },
                // },
                // {
                //     label: 'classId',
                //     name: 'class_id',
                //     options: {
                //         display: false,
                //     },
                // },
                // {
                //     label: 'groupTypeId',
                //     name: 'group_type_id',
                //     options: {
                //         display: false,
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
                name: null,
                shortRef: null,
                description: null,
                classId: null,
                catId: null,
                groupTypeId: null,
                code: null,
            },
            filterData: {
                'order[0]': ['updatedAt', 'DESC'],
                limit: 10,
                page: 0,
            },
            classData: [],
            groupTypeData: [],
            categoryData: [],
            totalItems: 0,
            totalPages: 0,
            tableDataLoaded: false,
            selectedGroupType:{}
        }
    }
   
   
    handleUpdate = (val) => {
        this.setState({
            formData: {
                    name: val.name,
                    shortRef: val.short_refferance,
                    description: val.description,
                    classId: val.class_id,
                    catId: val.category_id,
                    groupTypeId: val.group_type_id,
                    code: val.code,
                }, 
            catId: val.id,
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
                name: '',
                shortRef: '',
                description: '',
                from: '',
                to: '',
                code: '',
            },
            catId: null,
            isUpdate: false,
        })
    }

    
    handleDataSubmit = async () => {
        let { name, shortRef, description, catId, classId, groupTypeId, code } =
            this.state.formData

        let res
        let shortRefs = this.state.formData.name

        if (!this.state.isUpdate) {
            const groupDto = {
                code,
                description,
                name,
                short_refferance: shortRefs,
                category_id: catId,
                class_id: classId,
                group_type_id: groupTypeId,
            }

            //save function
            res = await GroupSetupService.createNewGroup(groupDto)
        } else {
            const groupDto = {
                description,
                category_id: catId,
                class_id: classId,
                group_type_id: groupTypeId,
            }

            res = await GroupSetupService.updateGroup(
                this.state.catId,
                groupDto
            )
        }

        if (200 == res.status) {
            this.setState({
                alert: true,
                message: 'Group Successfully Updated',
                severity: 'success',
            })
            this.clearField()
        } else if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Group Successfully Created',
                severity: 'success',
            })
            this.clearField()
        } else {
            this.setState({
                alert: true,
                message: 'System Error. Please try again',
                severity: 'error',
            })
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

        //fetch group type data
        this.fetchGroupTypeData()
        //fetch class data
        this.fetchClassData()
        //fetch cat data
        this.fetchCatData()

        let filterData = this.state.filterData

        const res = await GroupSetupService.fetchAllGroup(filterData)

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

    async fetchGroupTypeData() {
        //get all
        const maxFilterDto = {
            limit: Number.MAX_SAFE_INTEGER,
            page: 0,
        }

        const res = await GroupTypeSetupService.fetchAllGroupType(maxFilterDto)

        if (200 == res.status) {
            this.setState({
                groupTypeData: res.data.view.data,
            })
        }
    }

    async fetchCatData() {
        //get all
        const maxFilterDto = {
            limit: Number.MAX_SAFE_INTEGER,
            page: 0,
        }

        const res = await CategoryService.fetchAllCategories(maxFilterDto)

        if (200 == res.status) {
            this.setState({
                categoryData: res.data.view.data,
            })
        }
    }

    async fetchClassData() {
        //get all
        const maxFilterDto = {
            limit: Number.MAX_SAFE_INTEGER,
            page: 0,
        }

        const res = await ClassDataSetupService.fetchAllClass(maxFilterDto)

        if (200 == res.status) {
            this.setState({
                classData: res.data.view.data,
            })
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
                        <CardTitle title="Group" />

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
                                                        ? 'Update Group'
                                                        : 'Create Group'
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
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        disabled={
                                                            this.state.isUpdate
                                                        }
                                                        value={
                                                            this.state.formData
                                                                .code
                                                        }
                                                        type="number"
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
                                                        // validators={[
                                                        //     'required',
                                                        //     'minNumber:'+this.state.selectedGroupType.from,'maxNumber:'+this.state.selectedGroupType.to
                                                        // ]}
                                                        // errorMessages={[
                                                        //     'this field is required',
                                                        //     'Code Should Greater-than '+this.state.selectedGroupType.from,'Code Should Less-than '+this.state.selectedGroupType.to
                                                        // ]}
                                                    />
                                                   
                                                </Grid>
 

                                                {/* name */}
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
                                                        disabled={
                                                            this.state.isUpdate
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

                                                {/* short ref */}
                                                {/* <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Short Ref" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Short Ref"
                                                        name="shortRef"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        disabled={
                                                            this.state.isUpdate
                                                        }
                                                        value={
                                                            this.state.formData
                                                                .shortRef
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
                                                                    shortRef:
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
                                                    />
                                                </Grid> */}


                                                  {/* Class Dropdown */}
                                                  <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Class" />

                                                    {this.state.isUpdate ? (
                                                        <Autocomplete
                                        disableClearable
                                                            className="w-full"
                                                            options={this.state.classData}
                                                            onChange={( e,value) => {
                                                                if (null !=value) {
                                                                    
                                                                    this.setState({
                                                                            formData:{ ...this.state.formData,
                                                                                    classId: value.id,
                                                                                    
                                                                                },
                                                                        }
                                                                    )
                                                                }
                                                            }}
                                                            value={this.state.isUpdate
                                                                    ? this.state.classData.find((cat) =>cat.id ==this.state.formData.classId): ''
                                                            }
                                                            getOptionLabel={(option ) => option.code+"-"+option.description}
                                                            renderInput={(
                                                                params
                                                            ) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="Class"
                                                                    //variant="outlined"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size="small"
                                                                    validators={[
                                                                        'required',
                                                                    ]}
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .formData
                                                                            .classId
                                                                    }
                                                                    errorMessages={[
                                                                        'This field is required',
                                                                    ]}
                                                                />
                                                            )}
                                                        />
                                                    ) : (
                                                        <>
                                                            <Autocomplete
                                        disableClearable
                                                                className="w-full"
                                                                options={
                                                                    this.state
                                                                        .classData
                                                                }
                                                                onChange={(
                                                                    e,
                                                                    value
                                                                ) => {
                                                                    if (
                                                                        null !=
                                                                        value
                                                                    ) {
                                                                        this.setState(
                                                                            {
                                                                                formData:
                                                                                    {
                                                                                        ...this
                                                                                            .state
                                                                                            .formData,
                                                                                        classId:
                                                                                            value.id,
                                                                                    },
                                                                            }
                                                                        )
                                                                    }
                                                                }}
                                                                value={this.state.classData.find(
                                                                    (cat) =>
                                                                        cat.id ==
                                                                        this
                                                                            .state
                                                                            .formData
                                                                            .classId
                                                                )}
                                                                getOptionLabel={(
                                                                    option
                                                                ) =>
                                                                option.code+"-"+option.description
                                                                }
                                                                renderInput={(
                                                                    params
                                                                ) => (
                                                                    <TextValidator
                                                                        {...params}
                                                                        placeholder="Class"
                                                                        //variant="outlined"
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        size="small"
                                                                        validators={[
                                                                            'required',
                                                                        ]}
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .formData
                                                                                .classId
                                                                        }
                                                                        errorMessages={[
                                                                            'This field is required',
                                                                        ]}
                                                                    />
                                                                )}
                                                            />
                                                        </>
                                                    )}
                                                </Grid>

                                                {/* Category Dropdown */}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Category Code/Short Reference" />

                                                    {this.state.isUpdate ? (
                                                        <Autocomplete
                                        disableClearable
                                                            className="w-full"
                                                            options={
                                                                this.state
                                                                    .categoryData
                                                            }
                                                            onChange={(
                                                                e,
                                                                value
                                                            ) => {
                                                                if (
                                                                    null !=
                                                                    value
                                                                ) {
                                                                    this.setState(
                                                                        {
                                                                            formData:
                                                                                {
                                                                                    ...this
                                                                                        .state
                                                                                        .formData,
                                                                                    catId: value.id,
                                                                                },
                                                                        }
                                                                    )
                                                                } else {
                                                                    console.log(
                                                                        'Null Value===>',
                                                                        value
                                                                    )
                                                                }
                                                            }}
                                                            value={
                                                                this.state
                                                                    .isUpdate
                                                                    ? this.state.categoryData.find(
                                                                          (
                                                                              cat
                                                                          ) =>
                                                                              cat.id ==
                                                                              this
                                                                                  .state
                                                                                  .formData
                                                                                  .catId
                                                                      )
                                                                    : ''
                                                            }
                                                            getOptionLabel={(
                                                                option
                                                            ) => option.code+"-"+option.description}
                                                            renderInput={(
                                                                params
                                                            ) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="Category Code/Short Reference"
                                                                    //variant="outlined"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size="small"
                                                                    validators={[
                                                                        'required',
                                                                    ]}
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .formData
                                                                            .catId
                                                                    }
                                                                    errorMessages={[
                                                                        'This field is required',
                                                                    ]}
                                                                />
                                                            )}
                                                        />
                                                    ) : (
                                                        <>
                                                            {/* <SubTitle title="Category" /> */}
                                                            <Autocomplete
                                        disableClearable
                                                                className="w-full"
                                                                options={
                                                                    this.state
                                                                        .categoryData
                                                                }
                                                                onChange={(
                                                                    e,
                                                                    value
                                                                ) => {
                                                                    if (
                                                                        null !=
                                                                        value
                                                                    ) {
                                                                        this.setState(
                                                                            {
                                                                                formData:
                                                                                    {
                                                                                        ...this
                                                                                            .state
                                                                                            .formData,
                                                                                        catId: value.id,
                                                                                    },
                                                                            }
                                                                        )
                                                                    } else {
                                                                        console.log(
                                                                            'Null Value===>',
                                                                            value
                                                                        )
                                                                    }
                                                                }}
                                                                value={this.state.categoryData.find(
                                                                    (cat) =>
                                                                        cat.id ==
                                                                        this
                                                                            .state
                                                                            .formData
                                                                            .catId
                                                                )}
                                                                getOptionLabel={(
                                                                    option
                                                                ) =>
                                                                option.code+"-"+option.description
                                                                }
                                                                renderInput={(
                                                                    params
                                                                ) => (
                                                                    <TextValidator
                                                                        {...params}
                                                                        placeholder="Category"
                                                                        //variant="outlined"
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        size="small"
                                                                        validators={[
                                                                            'required',
                                                                        ]}
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .formData
                                                                                .catId
                                                                        }
                                                                        errorMessages={[
                                                                            'This field is required',
                                                                        ]}
                                                                    />
                                                                )}
                                                            />
                                                        </>
                                                    )}
                                                </Grid>

                                                {/* Group Type */}
                                                {/* <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Category" />

                                                    {this.state.isUpdate ? (
                                                        <Autocomplete
                                        disableClearable
                                                            className="w-full"
                                                            options={
                                                                this.state
                                                                    .groupTypeData
                                                            }
                                                            onChange={(
                                                                e,
                                                                value
                                                            ) => {
                                                                if (
                                                                    null !=
                                                                    value
                                                                ) {
                                                                
                                                                    this.setState(
                                                                        {
                                                                            formData:
                                                                                {
                                                                                    ...this
                                                                                        .state
                                                                                        .formData,
                                                                                    groupTypeId:
                                                                                        value.id,
                                                                                },
                                                                                selectedGroupType:value
                                                                        }
                                                                    )
                                                                }
                                                            }}
                                                            value={
                                                                this.state
                                                                    .isUpdate
                                                                    ? this.state.groupTypeData.find(
                                                                          (
                                                                              cat
                                                                          ) =>
                                                                              cat.id ==
                                                                              this
                                                                                  .state
                                                                                  .formData
                                                                                  .groupTypeId
                                                                      )
                                                                    : ''
                                                            }
                                                            getOptionLabel={(
                                                                option
                                                            ) => option.name}
                                                            renderInput={(
                                                                params
                                                            ) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="Category"
                                                                    //variant="outlined"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size="small"
                                                                    validators={[
                                                                        'required',
                                                                    ]}
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .formData
                                                                            .groupTypeId
                                                                    }
                                                                    errorMessages={[
                                                                        'This field is required',
                                                                    ]}
                                                                />
                                                            )}
                                                        />
                                                    ) : (
                                                        <>
                                                            
                                                            <Autocomplete
                                        disableClearable
                                                                className="w-full"
                                                                options={
                                                                    this.state
                                                                        .groupTypeData
                                                                }
                                                                onChange={(
                                                                    e,
                                                                    value
                                                                ) => {
                                                                    if (
                                                                        null !=
                                                                        value
                                                                    ) {
                                                                        console.log("selected",value)
                                                                        this.setState(
                                                                            {
                                                                                formData:
                                                                                    {
                                                                                        ...this
                                                                                            .state
                                                                                            .formData,
                                                                                        groupTypeId:
                                                                                            value.id,
                                                                                    },
                                                                                    selectedGroupType:value
                                                                            }
                                                                        )
                                                                    }
                                                                }}
                                                                value={this.state.groupTypeData.find(
                                                                    (cat) =>
                                                                        cat.id ==
                                                                        this
                                                                            .state
                                                                            .formData
                                                                            .groupTypeId
                                                                )}
                                                                getOptionLabel={(
                                                                    option
                                                                ) =>
                                                               option.name
                                                                }
                                                                renderInput={(
                                                                    params
                                                                ) => (
                                                                    <TextValidator
                                                                        {...params}
                                                                        placeholder="Category"
                                                                        //variant="outlined"
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        size="small"
                                                                        validators={[
                                                                            'required',
                                                                        ]}
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .formData
                                                                                .groupTypeId
                                                                        }
                                                                        errorMessages={[
                                                                            'This field is required',
                                                                        ]}
                                                                    />
                                                                )}
                                                            />
                                                        </>
                                                    )}
                                                </Grid>*/}
                                                {/* short ref */}
                                                    
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
                                                                    window.location.reload()
                                                                    this.clearField()
                                                                }
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

export default withStyles(styleSheet)(GroupSetup)
