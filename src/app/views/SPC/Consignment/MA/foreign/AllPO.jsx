import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    InputAdornment,
    IconButton,
    Icon,
    CircularProgress,
    Tooltip,
    Dialog,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import 'date-fns'
import localStorageService from 'app/services/localStorageService'

import {
    Button,
    LoonsSnackbar,
    CardTitle,
    SubTitle,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../../../appconst'
import SearchIcon from '@mui/icons-material/Search';
import { dateParse } from 'utils'
import SPCServices from 'app/services/SPCServices'

import ForeignDetails from "./IndividualDetails"
import CloseIcon from '@material-ui/icons/Close';
import WDNPrint from '../../print/WDNPrint'
import EmployeeServices from 'app/services/EmployeeServices'

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

class AllPO extends Component {
    constructor(props) {
        super(props)
        this.state = {
            totalItems: 0,
            userRoles: [],
            approveOpen: false,

            itemList: [],
            ploaded: false,
            POData: {},
            purchaseOrderData: {},
            deliveryData: [],
            printLoaded: false,

            data: [],
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let id = this.state.data[tableMeta.rowIndex].id
                            let data = this.state.data[tableMeta.rowIndex]
                            return (
                                <>
                                    <Tooltip title="View WDN">
                                        <IconButton
                                            className="text-black mr-2"
                                            onClick={() => {
                                                this.setState({ selected_id: id, selected_data: data }, () => {
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
                    label: 'Created Date',
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

            // loading: false,
            loading: true,

            filterData: {
                po_no: null,
                wdn_no: null,
                wharf_ref_no: null,
                invoice_no: null,
                status: null,
                shipment_no: null
            },

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                type: "Foreign",
            },
        }
    }

    async loadData() {
        //function for load initial data from backend or other resources
        this.setState({ loading: false });
        // let formData = this.state.filterData;
        // const formData = { ...this.state.formData, status: ['APPROVED'], type: "FOREIGN" }
        const formData = { ...this.state.formData, ...this.state.filterData }

        let res = await SPCServices.getConsignment(formData)

        if (res.status === 200) {
            console.log('WDN Data: ', res.data.view.data);
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems })
        }

        this.setState({ loading: true, ploaded: false })
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

    async printData(id) {
        try {
            this.setState({ printLoaded: false, ploaded: false });

            const consignment_res = await SPCServices.getConsignmentByID(id);

            if (consignment_res.status !== 200) {
                console.error("Error fetching consignment:", consignment_res);
                return;
            }
            let consignmentData
            let aprovalData = await SPCServices.getConsignmentApprovals({ consignment_id: id })
            if (aprovalData.status == 200) {

                consignmentData = { approvalData: aprovalData.data.view.data[0] }
                console.error("aprovalData:", aprovalData);
            }

            const po_res = await SPCServices.getAllPurchaseOrders({ po_no: consignment_res.data.view?.po_no });
            const po_res_single = await SPCServices.getPurchaseOrderByID(po_res.data.view.data?.[0]?.id);

            // Add error handling for the po_res status
            if (po_res.status !== 200 && po_res.status !== 200) {
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
                purchaseOrderData: { ...consignment_res.data.view, ...consignmentData },
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

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New formdata", this.state.formData)
            this.loadData()
        })
    }

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState({ files: files }, () => {
            console.log('files', this.state.files)
        })
    }

    async componentDidMount() {
        let userRoles = await localStorageService.getItem('userInfo').roles
        this.setState({ userRoles: userRoles }, () => {
            this.loadData()
        })
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
                                            {/* Serial Number*/}
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
                                                            name="sr_no"
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
                                                        // validators={[
                                                        //     'required',
                                                        // ]}
                                                        // errorMessages={[
                                                        //     'this field is required',
                                                        // ]}
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
                                                <SubTitle title="Status" />
                                                <Autocomplete
                                                    className="w-full"
                                                    options={appConst.consignment_status}
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let filterData =
                                                                this.state.filterData
                                                            filterData.status =
                                                                value.label
                                                            this.setState({
                                                                filterData,
                                                            })
                                                        }
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.label
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Please choose"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state.filterData
                                                                    .status
                                                            }
                                                        />
                                                    )}
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
                                                    name="shipment_no"
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
                                                lg={4}
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
                                                        {/* Search Button */}
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
                                            id={'allAptitute'}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                count: this.state.totalItems,
                                                pagination: true,
                                                rowsPerPage: this.state.formData.limit,
                                                page: this.state.formData.page,
                                                serverSide: true,
                                                print: true,
                                                viewColumns: true,
                                                rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
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
                                                            let formaData = this.state.formData;
                                                            formaData.limit = tableState.rowsPerPage;
                                                            this.setState({ formaData })
                                                            this.setPage(0)
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
                    <div className="w-full h-full px-4">
                        <ForeignDetails isEdit={false} isResubmit={false} data={this.state.single_data} id={this.state.selected_id} handleClose={() => {
                            this.setState({ approveOpen: false }, () => {
                                this.loadData()
                            })
                        }} onSubmit={(status, remark, data) => { this.onSubmit(status, remark, data) }} handleReject={() => this.setState({ rejectOpen: true })} />
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

export default withStyles(styleSheet)(AllPO)
