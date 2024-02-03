import React, { Component, Fragment } from "react";
import { Button, CardTitle, LoonsCard, LoonsTable, MainContainer, SubTitle, LoonsSnackbar } from "../../components/LoonsLabComponents";
import {
    CircularProgress, Grid, Link, Tooltip, IconButton, InputAdornment, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Icon,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import VisibilityIcon from '@material-ui/icons/Visibility';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import EditIcon from '@material-ui/icons/Edit';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'

import ConsignmentService from "../../services/ConsignmentService";
import PharmacyService from 'app/services/PharmacyService'


import moment from "moment";
import * as appConst from '../../../appconst'
import WarehouseServices from "app/services/WarehouseServices";
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import localStorageService from "app/services/localStorageService";

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
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: "#bad4ec"
        // backgroundColor: themeColors['whiteBlueTopBar'].palette.primary.main
    },

    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },

    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },


    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: -80,
    },
})

class PharmacyHigherLevel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            totalItems: 0,

            addItemDialog: false,
            orderDeleteWarning: false,
            orderToDelete: {
                child_id: this.props.id,
                parent_id: null
            },

            formData: {
                parent_id: null,
            },
            filterData: {
                limit: 20,
                page: 0,
                search: '',
                child_id: this.props.id,
                //     pharmacy_drugs_store_id:this.props.id

            },
            data: [],
            allDataStorePharmacy: [],
            allHigherLevels: [],
            columns: [

                {
                    name: 'name', // field name in the row object
                    label: 'Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.parents?.name
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'store_type', // field name in the row object
                    label: 'Store Type', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.parents?.store_type
                            return <p>{data}</p>
                        },
                    },
                },

                {
                    name: 'short_reference', // field name in the row object
                    label: 'Description', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.parents?.short_reference
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'Action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let id = this.state.data[tableMeta.rowIndex].id;
                            return (
                                <Grid className="flex items-center">
                                    {/* <Tooltip title="Edit">
                                          <IconButton
                                                  onClick={() => {
                                                      window.location.href = `/warehouse/drug-store/editwarehousetab/${id}`
                                                     
                                                  }}>
                                                 <AddIcon color="primary" />
                                              </IconButton>
                                      </Tooltip> */}
                                    <Tooltip title='Delete Order'>
                                        <IconButton
                                            className="text-black mr-1"
                                            onClick={() => {
                                                let orderToDelete = this.state.orderToDelete
                                                orderToDelete.child_id = this.state.data[tableMeta.rowIndex].child_id
                                                orderToDelete.parent_id = this.state.data[tableMeta.rowIndex].parent_id
                                                this.setState({
                                                    orderDeleteWarning: true,
                                                    orderToDelete
                                                })
                                            }}
                                        >
                                            <DeleteIcon color='error' />
                                        </IconButton>
                                    </Tooltip>
                                    {/* <Grid className="px-2">
                                          <Tooltip title="View">
                                              <IconButton
                                                  onClick={() => {
                                                      window.location.href = `/consignments/view-consignment/${id}`
                                                  }}>
                                                  <VisibilityIcon color='primary' />
                                              </IconButton>
                                          </Tooltip>
                                      </Grid> */}
                                </Grid>
                            );
                        }
                    },
                },

                // {
                //     name: 'address', // field name in the row object
                //     label: 'Address', // column title that will be shown in table
                //     options: {
                //         filter: false,
                //         display: true
                //     },
                // },
                //     {
                //         name: 'map_location', // field name in the row object
                //         label: 'Map Location', // column title that will be shown in table
                //         options: {
                //             filter: false,
                //             display: true,
                //             customBodyRenderLite: (dataIndex) => {
                //                 let data = this.state.data[dataIndex].Pharmacy_drugs_store.location
                //                 return <p>{data}</p>
                //             },
                //         },
                //     },

            ],

            alert: false,
            message: "",
            severity: 'success',
        }
    }
    async addNewLevel() {
        let child_id = this.props.id
        let parent_id = this.state.formData.parent_id
        const addItem = {
            child_id,
            parent_id,
        }
        console.log("levels", addItem)
        let res = await WarehouseServices.createNewHigherLevel(addItem);
        if (res.status === 201) {
            this.setState({
                alert: true,
                message: 'Item assigned successfully!',
                severity: 'success',
                addItemDialog: false
            }, () => {
                this.loadData()
            })
        } else {
            this.setState({
                alert: true,
                message: 'Item assign was unsuccessful!',
                severity: 'error',
            })
        }

    }

    async removeOrder() {
        this.setState({ Loaded: false })
        //id
        console.log('item details', this.state.orderToDelete)
        let { child_id, parent_id } = this.state.orderToDelete
        const deleteItem = {
            child_id,
            parent_id,
        }
        console.log("Delete", deleteItem)
        let id = this.props.id
        let res = await WarehouseServices.DeleteHigherLevel(id, deleteItem)
        console.log("res.data", res.data);
        if (res.status == 200) {
            this.setState({
                Loaded: true,
                alert: true,
                message: res.data.view,
                severity: 'success',
            })
            this.loadData(this.state.filterData)
        } else {
            console.log();
            this.setState(
                { alert: true, message: "Item Could Not be Deleted. Please Try Again", severity: 'error' }
            )
        }

    }

    // Load data onto table
    async loadData() {
        this.setState({ loaded: false })
        console.log("FilterData", this.state.filterData)
        let owner_id = await localStorageService.getItem('owner_id')
        let res = await WarehouseServices.getAllHigherLevels(this.state.filterData)
        console.log("Warehouse", res)
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

        let allDataStorePharmacy = await PharmacyService.fetchAllDataStorePharmacy(owner_id, { issuance_type: ['pharmacy', 'Pharmacy'] })
        if (200 == allDataStorePharmacy.status) {
            console.log("Dep tyepe: ", allDataStorePharmacy);
            this.setState({
                allDataStorePharmacy: allDataStorePharmacy.data.view.data,
            })
        }

    }

    handleFilterSubmit = (val) => {
        this.loadData()
    }

    //     onSubmit = () => {
    //         this.handleFilterSubmit({
    //             ref_no: this.state.ref_no,
    //             sr_no: this.state.sr_no,
    //             batch_id: this.state.batch_id,
    //             wharf_ref_no: this.state.wharf_ref_no,
    //         })
    //     }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                //this.loadConsignmentList()
            }
        )
    }


    componentDidMount() {
        this.loadData()

    }

    render() {
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        {/* <CardTitle title=" Higher Level" /> */}
                        <Grid item lg={12} className=" w-full ">
                            <ValidatorForm

                                ref={'outer-form'}
                                onSubmit={() => null}
                                onError={() => null}
                            >
                                <Grid className=" w-full"
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                >
                                    <Button
                                        className="mt-6"
                                        progress={false}
                                        scrollToTop={true}
                                        startIcon="add"
                                        onClick={() => {
                                            console.log('press!')
                                            this.setState({ addItemDialog: true })
                                        }}
                                    >
                                        <span className="capitalize">Add Pharmacy</span>
                                    </Button>
                                </Grid>


                                {/*Table*/}
                                <Grid lg={12} className="w-full " spacing={2} >

                                    {
                                        this.state.loaded ?
                                            <div >
                                                <LoonsTable
                                                    id={"DEFAULT_USER"}
                                                    data={this.state.data}
                                                    columns={this.state.columns}
                                                    options={{
                                                        pagination: true,
                                                        serverSide: true,
                                                        count: this.state.totalItems,
                                                        rowsPerPage: 20,
                                                        page: this.state.formData.page,

                                                        onTableChange: (action, tableState) => {
                                                            switch (action) {
                                                                case 'changePage':
                                                                    this.setPage(tableState.page)
                                                                    break;
                                                                case 'sort':
                                                                    break;
                                                                default:
                                                                    console.log('action not handled.');
                                                            }
                                                        }

                                                    }
                                                    }
                                                >
                                                </LoonsTable>
                                            </div>
                                            :
                                            <Grid className="justify-center text-center w-full pt-12">
                                                <CircularProgress size={30} />
                                            </Grid>
                                    }

                                </Grid>
                            </ValidatorForm>
                        </Grid>
                    </LoonsCard>
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
                                                this.removeOrder()
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
                    <Dialog
                        maxWidth={"xs"} fullWidth={true}
                        open={this.state.addItemDialog}
                        onClose={() => {
                            this.setState({ addItemDialog: false })
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <Grid
                            container="container"
                            style={{
                                alignItems: 'flex-end'
                            }}>
                            <Grid item="item" lg={11} md={9} xs={9}>
                                <Grid container="container" lg={12} md={12} xs={12} className='ml-4'>
                                    <CardTitle title="Add Pharmacy" />
                                </Grid>
                            </Grid>
                            <Grid item="item" lg={1} md={1} xs={1}><IconButton aria-label="close" onClick={() => { this.setState({ addItemDialog: false }) }}><CloseIcon /></IconButton></Grid>

                        </Grid>

                        {/* <MuiDialogTitle disableTypography className={styleSheet.Dialogroot}>
                                    

                                    <IconButton aria-label="close" className={styleSheet.closeButton} onClick={() => { this.setState({ addItemDialog: false }) }}>
                                        <CloseIcon />
                                    </IconButton>

                                </MuiDialogTitle> */}





                        {/* <DialogTitle id="alert-dialog-title">{"Add Employee"}</DialogTitle>
                                <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ addItemDialog: false }) }}>
        <CloseIcon />
    </IconButton> */}
                        <ValidatorForm
                            className="pt-2"
                            ref={'outer-form'}
                            onSubmit={() => null}
                            onError={() => null}
                        >
                            <DialogContent>

                                <Grid
                                    className=" w-full"
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Pharmacy Name" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        multiple={true}
                                        options={this.state.allDataStorePharmacy}
                                        /*  value={this.state.allDataStorePharmacy.find(
                                             (v) =>
                                                 v.id ==
                                                 this.state.formData
                                                     .levels[0]
                                         )} */
                                        getOptionLabel={(option) =>
                                            option.name ? option.name : ''
                                        }
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData = this.state.formData;
                                                //formData.answers = value.label;
                                                formData.parent_id = [];
                                                value.forEach(element => {
                                                    formData.parent_id.push(element.id)
                                                });
                                                this.setState({ formData }, () => { console.log("val", this.state.formData) })
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Pharmacy"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />

                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    className="mt-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    onClick={() => {
                                        this.addNewLevel()
                                    }}
                                >
                                    <span className="capitalize">Save</span>
                                </Button>

                            </DialogActions>
                        </ValidatorForm>
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
                        variant="filled"></LoonsSnackbar>


                </MainContainer>
            </Fragment>
        )
    }
}

export default PharmacyHigherLevel
