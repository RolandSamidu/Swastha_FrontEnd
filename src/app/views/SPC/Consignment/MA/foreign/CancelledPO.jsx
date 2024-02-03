import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Dialog,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    CircularProgress,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import 'date-fns'

import {
    Button,
    LoonsSnackbar,
    CardTitle,
    SubTitle,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import SearchIcon from '@mui/icons-material/Search';
import { dateParse } from 'utils'

import CloseIcon from '@material-ui/icons/Close';
import localStorageService from 'app/services/localStorageService'

import SPCServices from 'app/services/SPCServices'
import EmployeeServices from 'app/services/EmployeeServices'

import WDNPrint from "../../print/WDNPrint"
import ForeignShipment from './widget/ForeignShipment'
import { ConfirmationDialog } from 'app/components'

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

class CancelledPo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            role: null,
            open: false,
            consignmentOpen: false,
            approveOpen: false,
            rejectOpen: false,
            forwardOpen: false,
            isReject: false,
            isForward: false,
            selected_id: null,

            itemList: [],
            ploaded: false,
            storedData: {},
            POData: {},
            purchaseOrderData: {},
            deliveryData: [],
            printLoaded: false,
            single_data: [],
            selected_id: null,
            collapseButton: 0,
            userRoles: [],
            data: [],

            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let id = this.state.data[tableMeta.rowIndex]?.id
                            return (
                                <>
                                    <Tooltip title="View WDN">
                                        <IconButton
                                            className="text-black"
                                            onClick={() => {
                                                // window.location = `/spc/wdn_consignment_list/123`
                                                this.setState({ approveOpen: true, selected_id: id }, () => {
                                                    this.loadSingleData(id)
                                                })
                                            }}
                                        >
                                            <Icon color='primary'>visibility</Icon>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Print WDN">
                                        <IconButton
                                            className="text-black"
                                            onClick={() => {
                                                this.setState({ selected_id: id }, () => {
                                                    this.printData(id)
                                                })
                                                // window.location = `/spc/wdn_consignment_list/123`
                                                // this.setState({ approveOpen: true }, () => {
                                                //     // this.loadSingleData(id)
                                                // })
                                            }}
                                        >
                                            <Icon color='primary'>print</Icon>
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'wdn_no', // field name in the row object
                    label: 'WDN No', // column title that will be shown in table
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'wharf_ref_no', // field name in the row object
                    label: 'Shipment No', // column title that will be shown in table
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'po_no', // field name in the row object
                    label: 'PO No', // column title that will be shown in table
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'shipment_no', // field name in the row object
                    label: 'WHARF REF No', // column title that will be shown in table
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'invoice_no',
                    label: 'Invoice No',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'wdn_recieved',
                    label: 'WDN Recieved',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'createdBy',
                    label: 'Created By',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.Create ? this.state.data[tableMeta.rowIndex]?.Create?.name : 'N/A'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'createdAt',
                    label: 'Date Created',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.createdAt ? dateParse(this.state.data[tableMeta.rowIndex]?.createdAt) : 'N/A'}</p>
                            )
                        }
                    },
                },
                // {
                //     name: 'approvedBy',
                //     label: 'Approved By',
                //     options: {
                //         display: true,
                //         // filter: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <p>{this.state.data[tableMeta.rowIndex]?.Approved ? this.state.data[tableMeta.rowIndex]?.Approved?.name : 'N/A'}</p>
                //             )
                //         }
                //     },
                // },
                // {
                //     name: 'approved_on',
                //     label: 'Approved Date',
                //     options: {
                //         display: true,
                //         // filter: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <p>{this.state.data[tableMeta.rowIndex]?.approved_on ? dateParse(this.state.data[tableMeta.rowIndex]?.approved_on) : 'N/A'}</p>
                //             )
                //         }
                //     },
                // },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                        // filter: true,
                    },
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            loading: true,
            single_loading: true,

            totalItems: 0,
            filterData: {
                po_no: null,
                invoice_no: null,
                wdn_no: null,
                wharf_ref_no: null,
                shipment_no: null,
                // limit: 20,
                // page: 0,
                // 'order[0]': ['updatedAt', 'DESC'],
            },

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                type: "Foreign",
                status: ['CANCELLED']
            },

        }
        this.loadSingleData = this.loadSingleData.bind(this)
    }

    handleDataStore = (data) => {
        this.setState((prevState) => {
            // Merge the new data with the previous state
            const updatedData = { ...prevState.storedData, ...data };
            return { storedData: updatedData };
        });
    };

    loadData = async () => {
        //function for load initial data from backend or other resources
        this.setState({ loading: false });
        const formData = { ...this.state.formData, ...this.state.filterData }

        let res = await SPCServices.getConsignment(formData)

        if (res.status === 200) {
            console.log('WDN Data: ', res.data.view.data);
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems })
        }

        this.setState({ loading: true, ploaded: true, })
    }

    onSubmit = async () => {
        this.setState({ forwardOpen: false })

        const { wdn_recieved, received_date } = this.state.storedData
        const id = this.state.selected_id;

        let res = await SPCServices.changeConsignmentByID(id, { wdn_recieved: wdn_recieved, received_date: received_date })

        if (res.status) {
            this.setState({
                severity: "success",
                alert: true,
                message: "Consignment Updation was Successfull",
                isForward: true,
            })
        } else {
            this.setState({
                severity: "error",
                alert: true,
                message: "Consignment Updation was Unsuccessfull"
            })
        }
    }

    loadSingleData = async (id) => {
        this.setState({ single_loading: false, open: false, approveOpen: false });
        // let res = await LocalPurchaseServices.getLPRequestByID(this.state.selected_id)
        let res = await SPCServices.getConsignmentByID(id)

        if (res.status === 200) {
            console.log('SPC Single Data: ', res.data.view);
            this.setState({ single_data: res.data.view })
        }

        this.setState({ single_loading: true, open: true, approveOpen: true })
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New Form Data: ", this.state.formData)
            this.loadData()
        })
    }

    async submitData() {

    }

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState({ files: files }, () => {
            console.log('files', this.state.files)
        })
    }

    selectRow = (index) => {
        let single_data = this.state.single_data;

        if (single_data[index].selected) {
            single_data[index].selected = false
        } else {
            single_data[index].selected = true
        }

        this.setState({ single_data }, () => {
            // this.render()
            console.log("Selected Data :", this.state.single_data)
        })
    }

    async getUser() {
        let id = await localStorageService.getItem('userInfo').id
        if (id) {
            let user_res = await EmployeeServices.getEmployeeByID(id)
            if (user_res.status == 200) {
                console.log('User', user_res.data.view)
                this.setState({ user: user_res?.data?.view })
            }
        }
    }

    async printData(id) {
        try {
            this.setState({ printLoaded: false, ploaded: false });

            const consignment_res = await SPCServices.getConsignmentByID(id);

            if (consignment_res.status !== 200) {
                console.error("Error fetching consignment:", consignment_res);
                return;
            }

            const po_res = await SPCServices.getAllPurchaseOrders({ po_no: consignment_res.data.view?.po_no });
            const po_res_single = await SPCServices.getPurchaseOrderByID(po_res.data.view.data?.[0]?.id);

            // Add error handling for the po_res status
            if (po_res.status !== 200 && po_res_single.status !== 200) {
                console.error("Error fetching purchase orders:", po_res);
                return;
            }

            // Load item data
            await this.loadItemData(consignment_res.data.view);
            await this.getUser();

            const vesselDetails = consignment_res.data.view?.ConsigmentVesselData || []
            const fcl_table_values = Array.isArray(vesselDetails?.[0]?.fcl_table_values)
                ? vesselDetails?.[0]?.fcl_table_values
                : JSON.parse(vesselDetails?.[0]?.fcl_table_values || '[]');

            this.setState({
                ploaded: true,
                POData: po_res_single.data.view,
                purchaseOrderData: consignment_res.data.view,
                deliveryData: fcl_table_values,
                printLoaded: true,
            }, () => {
                document.getElementById('wdn_print').click();
                this.loadData()
            });
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    async loadItemData(data) {
        try {
            const spcConsignmentItems = data?.SPCConsignmentItems;

            if (Array.isArray(spcConsignmentItems)) {
                const consignmentItemIds = spcConsignmentItems.map(item => item.item_id);
                const itemResponse = await SPCServices.getAllSPCPODeliverySchedules({ spc_po_id: spcConsignmentItems[0].spc_po_id });

                const initialArray = itemResponse.data.view.data;
                const newArray = initialArray.map(item => {
                    const matchingIndex = consignmentItemIds.indexOf(item.id);

                    return {
                        ...item,
                        selected: matchingIndex !== -1,
                        transit_quantity: matchingIndex !== -1
                            ? spcConsignmentItems[matchingIndex]?.transit_quantity || '0'
                            : '0'
                    };
                });

                this.setState({ itemList: newArray });
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.setState({ alert: true, severity: "error", message: `Error: ${error}` });
        }
    }

    componentDidMount() {
        let roles = localStorageService.getItem('userInfo')?.roles
        this.setState({
            roles: roles[0],
            userRoles: roles
        }, () => {
            this.loadData()
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.storedData !== this.state.storedData) {
            console.log("Data :", this.state.storedData)
        }
    }


    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <div className="pb-8 pt-2">
                    {/* Filtr Section */}
                    <ValidatorForm
                        className="pt-2"
                        onSubmit={() => this.loadData()}
                        onError={() => null}
                    >
                        {/* Main Grid */}
                        <Grid container spacing={2} direction="row">
                            {/* Filter Section */}
                            <Grid item xs={12} className='mb-10' sm={12} md={12} lg={12}>
                                {/* Item Series Definition */}
                                <Grid container spacing={2}>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="PO Number" />
                                                        <TextValidator
                                                            className=" w-full"
                                                            placeholder="Enter PO Number"
                                                            name="po_no"
                                                            InputLabelProps={{
                                                                shrink: false,
                                                            }}
                                                            value={
                                                                this.state.filterData
                                                                    .po_no
                                                            }
                                                            type="text"
                                                            variant="outlined"
                                                            size="small"
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    filterData: {
                                                                        ...this
                                                                            .state
                                                                            .filterData,
                                                                        po_no:
                                                                            e.target
                                                                                .value,
                                                                    },
                                                                })
                                                            }}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <IconButton onClick={() => { this.loadData() }}>
                                                                            <SearchIcon />
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Invoice No" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Enter Invoice Number"
                                                    name="invoice_no"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.filterData
                                                            .invoice_no
                                                    }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                invoice_no:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="WDN No" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Enter WDN Number"
                                                    name="wdn_no"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.filterData
                                                            .wdn_no
                                                    }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                wdn_no:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Shipment No" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Enter Shipment Number"
                                                    name="wharf_ref_no"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.filterData
                                                            .wharf_ref_no
                                                    }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                wharf_ref_no:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                {/* DEV Note -> wharf_ref_no has been mapped to shipment_no */}
                                                <SubTitle title="WHARF Ref No" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Enter WHARF Ref Number"
                                                    name="wharf_ref_no"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.filterData
                                                            .shipment_no
                                                    }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                shipment_no:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid
                                                style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                item
                                                lg={8}
                                                md={8}
                                                sm={6}
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
                                                            className="mt-2"
                                                            progress={false}
                                                            type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            startIcon="search"
                                                        //onClick={this.handleChange}
                                                        >
                                                            <span className="capitalize">
                                                                Search
                                                            </span>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <br />
                            {/* Table Section */}
                            {this.state.loading ?
                                <Grid container className="mt-5 pb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allApprovedPO'}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                rowsPerPage: this.state.formData.limit,
                                                page: this.state.formData.page,
                                                serverSide: true,
                                                rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                print: true,
                                                count: this.state.totalItems,
                                                viewColumns: true,
                                                download: true,
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
                                                        case 'changeRowsPerPage':
                                                            this.setState({
                                                                formData: {
                                                                    limit: tableState.rowsPerPage,
                                                                    page: 0,
                                                                },
                                                            }, () => {
                                                                this.loadData()
                                                            })
                                                            break;
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
                                    </Grid>
                                </Grid>
                                :
                                (
                                    <Grid className='justify-center text-center w-full pt-12'>
                                        <CircularProgress size={30} />
                                    </Grid>
                                )
                            }
                        </Grid>
                    </ValidatorForm>
                </div>
                {this.state.ploaded &&
                    // <PurchaseOrderList />
                    <WDNPrint purchaseOrderData={this.state.purchaseOrderData} POData={this.state.POData} ItemData={this.state.itemList} hospital={this.state.hospital} user={this.state.user} deliveryData={this.state.deliveryData} />
                }
                <Dialog
                    fullWidth="fullWidth"
                    maxWidth="xl"
                    open={this.state.approveOpen}>
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                        <CardTitle title="WDN Individual Detail" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ approveOpen: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-4 pb-5">
                        <ForeignShipment data={this.state.single_data} isEdit={false} handleClose={() => this.setState({ approveOpen: false })} submitOpen={() => this.setState({ forwardOpen: true })} storeData={this.handleDataStore} handleReject={() => this.setState({ rejectOpen: true })} />
                    </div>
                </Dialog>
                <ConfirmationDialog
                    text={"Are you sure to save the WDN?"}
                    open={this.state.forwardOpen}
                    onConfirmDialogClose={() => { this.setState({ forwardOpen: false }) }}
                    onYesClick={() => {
                        this.setState({ forwardOpen: false }, () => {
                            this.onSubmit()
                        })
                    }}
                />
                <ConfirmationDialog
                    text={"Are you Sure you want to reject the WDN?"}
                    open={this.state.rejectOpen}
                    onConfirmDialogClose={() => { this.setState({ rejectOpen: false }) }}
                    onYesClick={() => {
                        this.setState({ rejectOpen: false, isReject: true })
                    }}
                />
                <Dialog fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.isForward}>
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                        <CardTitle title="Confirmation Message" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ isForward: false }, () => {
                                    this.loadData()
                                })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-4 pb-5">
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                You have successfully saved the WDN
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                this.setState({ isForward: false }, () => {
                                    this.loadData()
                                })
                            }}>Done</Button>
                        </DialogActions>
                    </div>
                </Dialog>
                <Dialog fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.isReject}>
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                        <CardTitle title="Confirmation Message" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ isReject: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-4 pb-5">
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                You have rejected the WDN and returned it
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                this.setState({ isReject: false })
                            }}>Done</Button>
                        </DialogActions>
                    </div>
                </Dialog>
                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={1200}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(CancelledPo)
