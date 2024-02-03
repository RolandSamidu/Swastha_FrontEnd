import {
    IconButton,
    Grid,
    Icon,
    Dialog,
    TextField,
    Tooltip,
    Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import CancelIcon from '@material-ui/icons/Cancel';
import { Autocomplete } from '@material-ui/lab'
import {
    CardTitle,
    LoonsCard,
    Button,
    LoonsSnackbar,
    LoonsTable,
    MainContainer,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import EditIcon from '@material-ui/icons/Edit'
import DivisionsServices from 'app/services/DivisionsServices'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import PatientServices from 'app/services/PatientServices'
import 'date-fns'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'

const styleSheet = (theme) => ({})

class SerialFamilySetup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            params: {
                page: 0,
                limit: 20,
                'order[0]': ['updatedAt', 'DESC']
            },
            totalItems: 0,
            totalPages: 0,
            isUpdate: false,
            serialId: null,
            orderDeleteWarning: false,
            orderToDelete: null,
            data: [] ,
            columns: [
                //how to change group
                // {
                //     name: 'group_id',
                //     label: 'Group',
                //     options: {
                //         filter: true,
                //         display: true,
                //         // customBodyRenderLite: (dataIndex) => {
                //         //     let group_id = this.state.data[dataIndex].group_id;
                //         //     let group_name = this.state.all_group.filter((ele) => ele.id == group_id)[0].name
                //         //     return <p>{group_name}</p>
                //         // },
                //     },
                // },
                {
                    name: 'code', // field name in the row object
                    label: 'Serial Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    label: 'Group',
                    name: 'Group',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let data = this.state.data[tableMeta.rowIndex]?.Group?.name
                            return (
                               <p>{data}</p>
                            )
                        },
                    },
                },
                {
                    name: 'name', // field name in the row object
                    label: 'Serial Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'description',
                    label: 'Description',
                    //chaneged from short reference to description After QA
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'action',
                    label: 'Actions',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                {/* <Button
                                    color="secondary"
                                    onClick={() => {
                                        this.handleUpdate(
                                            this.state.data[tableMeta.rowIndex]
                                        )
                                    }}
                                >
                                    {' '}
                                    Update
                                </Button> */}
                                <Tooltip title="Edit">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                this.handleUpdate(
                                                    this.state.data[tableMeta.rowIndex]
                                                )                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                             {' '}
                                            
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
            all_group: [],


            loaded: false,
            formData: {
                code: null,
                name: null,
                short_refferance: null,
                description: null,
                group_id: null,

            },
        }
    }
    // async removeEntry() {
    //     this.setState({ Loaded: false })
    //     let res = await GroupSetupService.delSerial(this.state.orderToDelete)
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
    //         this.loadOrderList(this.state.filterData)
    //     } else {
    //         this.setState(
    //             { alert: true, message: "Item Could Not be Deleted. Please Try Again",
    //              severity: 'error' }
    //         )
    //     }

    // }

    async loadData() {
        //function for load initial data from backend or other resources
        this.setState({
            loaded:false
        })
        let group = await GroupSetupService.fetchAllGroup({
            limit: 99999,
            
        })
        if (group.status == 200) {
            console.log('group', group.data.view.data)
            this.setState({
                
                all_group: group.data.view.data,
            }, () => { this.loadAllSerial() })
        }

    }

    handleUpdate = (val) => {
        console.log('val====>', val)
        this.setState({
            formData: {
                code: val.code,
                name: val.name,
                short_refferance: val.short_refferance,
                description: val.description,
                group_id: val.group_id,
            },
            serialId: val.id,
        }, () => {
            console.log('Form Data===========>', this.state.formData)

        }
        )
        this.setState({
            isUpdate: true,
        }, () => { this.render() })
    }

    async loadAllSerial() {
        let params = this.state.params
        let allData = await GroupSetupService.getAllSerial(params);
        if (allData.status == 200) {
            params.page = allData.data.view.currentPage
            this.setState(
                {
                    params,
                    data: allData.data.view.data,
                    totalPages: allData.data.view.totalPages,
                    totalItems: allData.data.view.totalItems,
                    loaded: true,
                })
            console.log('group', allData.data.view.data)
        }


    }

    async setPage(page) {
        let params = this.state.params
        params.page = page
        this.setState(
            {
                params,
            },
            () => {
                this.loadAllSerial()
            }
        )
    }



    async SubmitAll() {
        let formData = this.state.formData
        if (formData.description == null || formData.description == '' ){
         formData.description = "N/A"
        }
        // console.log("form",formData)
        if(this.state.isUpdate){
            let res = await GroupSetupService.updateSerial(this.state.serialId,formData)
            if (res.status == 200) {
                this.setState({
                    alert: true,
                    message: 'Item Serial Update Successful',
                    severity: 'success',
                })
                this.clearField()
                this.loadData()
            } else {
                this.setState({
                    alert: true,
                    message: 'Item Serial Update Unsuccessful',
                    severity: 'error',
                })
            }
        }else{
            let res = await GroupSetupService.createNewSerial(formData)
            if (res.status == 201) {
                this.setState({
                    alert: true,
                    message: 'Item Serial Setup Successful',
                    severity: 'success',
                })
                this.clearField()
                this.loadData()
            } else {
                this.setState({
                    alert: true,
                    message: 'Item Serial Setup Unsuccessful',
                    severity: 'error',
                })
            }
        }
      
    }

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState({ files: files }, () => {
            console.log('files', this.state.files)
        })
    }
    clearField = () => {
        this.setState({
            formData: {
                code: "",
                name: "",
                short_refferance: "",
                description: "",
                group_id: "",
            },
            catId: null,
            isUpdate: false,
        })
    }

    componentDidMount() {
        this.loadData()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <CardTitle title="Subgroup/Serial Setup" />

                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.SubmitAll()}
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid container spacing={2} direction="row">
                                {/* Filter Section */}
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    {/* Item Series Definition */}
                                    <Grid container spacing={2}>
                                        {/* Item Serial heading */}

                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <Grid container spacing={2}>
                                            <Grid
                                                    item
                                                    xs={12}
                                                    sm={12}
                                                    md={6}
                                                    lg={6}
                                                >
                                                    <SubTitle title="Group" />

                                                    {this.state.isUpdate ? (
                                                        <Autocomplete
                                        disableClearable
                                                            className="w-full"
                                                            options={this.state.all_group}
                                                            onChange={( e,value) => {
                                                                if (null !=value) {
                                                                    let formData = this.state.formData
                                                                    formData.name = value.name
                                                                    formData.group_id = value.id
                                                                    this.setState({
                                                                            formData
                                                                        }
                                                                    )
                                                                }
                                                            }}
                                                            value={this.state.isUpdate
                                                                    ? this.state.all_group.find((val) =>val.id ==this.state.formData.group_id): ''
                                                            }
                                                           
                                                            getOptionLabel={(
                                                                option
                                                            ) => option.name}
                                                            renderInput={(
                                                                params
                                                            ) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="Group"
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
                                                                            .group_id
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
                                                                options={this.state.all_group
                                                                }
                                                                onChange={( e,value) => {
                                                                    if (null !=value) {
                                                                        let formData = this.state.formData
                                                                        formData.name = value.name
                                                                        formData.group_id = value.id
                                                                        this.setState({
                                                                                formData
                                                                            }
                                                                        )
                                                                    }
                                                                }}
                                                                value={this.state.all_group.find(
                                                                    (cat) =>
                                                                        cat.id ==
                                                                        this
                                                                            .state
                                                                            .formData
                                                                            .group_id
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
                                                                        placeholder="Group"
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
                                                                                .group_id
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

                                           {/* Serial/Family Number */}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Subgroup/Serial Number" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Subgroup/Serial Number"
                                                        name="code"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData.code
                                                        }
                                                        disabled={
                                                            this.state.isUpdate
                                                        }
                                                        type="number"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this.state.formData,
                                                                    code: e.target.value,
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

                                               
                                             {/* Serial Family Name*/}
                                              <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Subgroup/Serial Name" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Subgroup/Serial Name"
                                                        name="name"
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
                                                            let formData =
                                                                this.state.formData
                                                            formData.name = e.target.value
                                                            this.setState({ formData })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is required',
                                                        ]}
                                                    />
                                                </Grid>

 {/* Category Item Number */}


                                                {/* Short Referenece
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Short Referenece" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Short Referenece"
                                                        name="short_refferance"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .short_refferance
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
                                                                    short_refferance:
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
                                                        className=" w-full"
                                                        placeholder="Description"
                                                        name="description"
                                                        multiline
                                                        rows={3}
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .description
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
                                                                    description:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
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
                                                        {this.state.isUpdate
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

                                {/* Table Section */}
                                {this.state.loaded ?
                                    <Grid container className="mt-3 pb-5">
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allSerial'}
                                                data={this.state.data}
                                                columns={this.state.columns}
                                                options={{
                                                    filter: false,
                                                    filterType:'textField',
                                                    responsive: 'standard',
                                                    pagination: true,
                                                    serverSide: true,
                                                    print: true,
                                                    viewColumns: true,
                                                    download: true,
                                                    count: this.state.totalItems,
                                                    rowsPerPage: 20,
                                                    page: this.state.params.page,
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
                                                                
                                                                // this.sort(tableState.page, tableState.sortOrder);
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
                                    </Grid>
                                    : null
                                }
                            </Grid>
                        </ValidatorForm>
                    </LoonsCard>
                </MainContainer>
                <Dialog
                    maxWidth="lg "
                    open={this.state.orderDeleteWarning}
                    onClose={() => {
                        this.setState({ orderDeleteWarning: false })
                    }}>
                    <div className="w-full h-full px-5 py-5">

                        <CardTitle title="Are you sure you want to delete?"></CardTitle>
                        <div>
                            <p>This order will be deleted and you will have to apply for a new order. This
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
                                            this.setState({ orderDeleteWarning: false });
                                            this.removeEntry()
                                        }}>
                                        <span className="capitalize">Delete</span>
                                    </Button>

                                    <Button
                                        className="mt-2 ml-2"
                                        progress={false}
                                        type="submit"
                                        startIcon={<CancelIcon />}
                                        onClick={() => {
                                            this.setState({ orderDeleteWarning: false });
                                        }}>
                                        <span className="capitalize">Cancel</span>
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

export default withStyles(styleSheet)(SerialFamilySetup)
