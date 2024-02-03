import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    CircularProgress,
    Dialog,
    DialogContent,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';

import {
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    LoonsTable,
    DatePicker
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../../../appconst'
import SearchIcon from '@mui/icons-material/Search';
import { convertTocommaSeparated, dateParse } from 'utils'

import LocalPurchaseServices from 'app/services/LocalPurchaseServices'
import InventoryService from 'app/services/InventoryService';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import localStorageService from 'app/services/localStorageService'
import SPCServices from 'app/services/SPCServices'

import ForeignDetails from './IndividualDetails'

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

const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", text = "Add", tail = null }) => (
    <Autocomplete
        disableClearable
        options={options}
        getOptionLabel={getOptionLabel}
        // id="disable-clearable"
        onChange={onChange}
        value={val}
        size='small'
        renderInput={(params) => (
            < div ref={params.InputProps.ref} style={{ display: 'flex', position: 'relative' }}>
                <input type="text" {...params.inputProps}
                    style={{ marginTop: '5.5px', padding: '6.5px 10px', border: '1px solid #e5e7eb', borderRadius: 4 }}
                    placeholder={`⊕ ${text}`}
                    onChange={onChange}
                    value={val}
                // required
                />
                {tail ? <div
                    style={{
                        position: 'absolute',
                        top: '7.5px',
                        right: 8,
                    }}
                    onClick={null}
                >
                    {tail}
                </div> : null}
            </div >
        )}
    />)

class RejectedPO extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            isOverflow: false,
            role: null,
            open: false,
            itemList: [],
            single_data: {},
            selected_id: null,
            collapseButton: 0,

            userRoles: [],
            data: [
                {
                    po_no: "123456",
                    supplier_code: "A101B2E",
                    order_no: "ORD101",
                    delivery_date: new Date(),
                    due_date: new Date(),
                    order_qty: "250",
                    recieved_qty: "150",
                    status: "Rejected",
                    currency: "LKR",
                    total: "125000",
                    due_amount: "5000",
                },
                {
                    po_no: "123457",
                    supplier_code: "A102B2A",
                    order_no: "ORD102",
                    delivery_date: new Date(),
                    due_date: new Date(),
                    order_qty: "300",
                    recieved_qty: "150",
                    status: "Rejected",
                    currency: "LKR",
                    total: "140000",
                    due_amount: "10000",
                },
            ],
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let id = this.state.data[tableMeta.rowIndex].id;
                            let data = this.state.data[tableMeta.rowIndex];

                            if (this.state.userRoles.includes('SPC MA')) {
                                return (
                                    <Tooltip title="Edit WDN">
                                        <IconButton
                                            className="text-black mr-2"
                                            onClick={() => {
                                                this.setState({ selected_id: id, selected_data: data }, () => {
                                                    this.loadSingleData(id)
                                                })
                                            }}
                                        >
                                            <Icon color='primary'>edit</Icon>
                                        </IconButton>
                                    </Tooltip>
                                );
                            } else {
                                return (
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
                                );
                            }
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
                    name: 'rejectedBy',
                    label: 'Rejected By',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.Rejected ? this.state.data[tableMeta.rowIndex]?.Rejected?.name : 'N/A'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'rejected_on',
                    label: 'Rejected Date',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.rejected_on ? dateParse(this.state.data[tableMeta.rowIndex]?.rejected_on) : 'N/A'}</p>
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
                status: ["REJECTED"]
                // item_id: this.props.match.params.item_id
            },

            all_Suppliers: [],
            all_manufacture: [],

            formSingleData: {
                order_qty: null,
                po_by: "HOSPITAL",
                order_no: null,
                supplier_id: null,
                manufacture_id: null,
                lp_request_id: null,
                order_date: null,
                status: "Active",
                type: "lprequest",
                created_by: null,
                order_date_to: null,
                no_of_items: null,
                estimated_value: null,
                order_for_year: null,
                order_items: [],
                agent_id: 'd13941b2-7b77-42e7-ae5a-f07f9143a5dc',
                currency: "LKR",
                indent_no: null,
                // item_id: this.props.match.params.item_id
            },
        }
    }

    loadData = async () => {
        //function for load initial data from backend or other resources
        this.setState({ loading: false });
        // let formData = this.state.filterData;
        // const formData = { ...this.state.formData, status: ['APPROVED'], type: "LOCAL" }
        const formData = { ...this.state.formData, ...this.state.filterData }

        let res = await SPCServices.getConsignment(formData)

        if (res.status === 200) {
            console.log('WDN Data: ', res.data.view.data);
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems })
        }

        this.setState({ loading: true })
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

    // loadItemData = async () => {
    //     let formData = this.state.filterData
    //     if (formData.item_name && formData.item_name.length > 3) {
    //         let res = await InventoryService.fetchAllItems({ search: formData.item_name,/*  is_prescrible: "true", limit: 10, page: 0, */ 'order[0]': ['sr_no', 'ASC'] })
    //         if (res.status === 200) {
    //             this.setState({ itemList: res.data.view.data });
    //         }
    //     } else if (formData.sr_no && formData.sr_no.length > 3) {
    //         let res = await InventoryService.fetchAllItems({ search: formData.sr_no,/*  is_prescrible: "true", limit: 10, page: 0,  */'order[0]': ['sr_no', 'ASC'] })
    //         if (res.status === 200) {
    //             this.setState({ itemList: res.data.view.data });
    //         }
    //     }
    // }

    async setPage(page) {
        //Change paginations
        let formData = this.state.filterData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New Form Data: ", this.state.formData)
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

    componentDidMount() {
        let roles = localStorageService.getItem('userInfo')?.roles
        this.setState({
            role: roles[0],
            userRoles: roles
        }, () => {
            // TODO -> Backend API
            this.loadData()
        })
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevState.filterData.item_name !== this.state.filterData.item_name || prevState.filterData.sr_no !== this.state.filterData.sr_no) {
    //         this.loadItemData();
    //     }
    // }


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
                                            {/* Submit and Cancel Button */}
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
                                            id={'allRejectedWDN'}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                rowsPerPage: this.state.filterData.limit,
                                                page: this.state.filterData.page,
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
                                                                filterData: {
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
                <Dialog
                    fullWidth="fullWidth"
                    maxWidth="xl"
                    open={this.state.approveOpen}>
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                        {/* {this.state.sequence === 0 ? */}
                        <CardTitle title="WDN Individual Detail" />
                        {/* :
                            <CardTitle title="WDN Individual Port Detail" />
                        } */}
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ approveOpen: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-4">
                        {/* <ForeignPortDetails data={this.state.single_data} handleClose={() => this.setState({ approveOpen: false })} submitOpen={() => this.setState({ forwardOpen: true })} handleReject={() => this.setState({ rejectOpen: true })} /> */}
                        {/* {this.state.sequence === 0 ? */}
                        <ForeignDetails isEdit={this.state.userRoles.includes("SPC MA")} isResubmit={true} data={this.state.single_data} id={this.state.selected_id} handleClose={() => this.setState({ approveOpen: false })} onSubmit={(status, remark, data) => { this.onSubmit(status, remark, data) }} handleReject={() => this.setState({ rejectOpen: true })} />
                        {/* } */}
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

export default withStyles(styleSheet)(RejectedPO)
