import React, { Fragment, useContext, useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core/styles';
import {
    MainContainer,
    LoonsCard,
    CardTitle,
    LoonsTable,
    SubTitle,
    LoonsSnackbar,
    Button,
} from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import {
    Grid,
    CircularProgress,
    IconButton,
    Tooltip,
    FormControl,

    InputAdornment,
    Dialog,

    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    Divider,
    Chip,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit';
import SortIcon from '@mui/icons-material/Sort';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import * as appConst from '../../../../../../appconst'
import CloseIcon from '@material-ui/icons/Close';
import SPCServices from 'app/services/SPCServices';
import HospitalConfigServices from 'app/services/HospitalConfigServices';
import ConsignmentService from 'app/services/ConsignmentService';
import { dateParse, convertTocommaSeparated } from 'utils'
import BlockIcon from '@material-ui/icons/Block';
import { ConfirmationDialog } from 'app/components';
import { parse } from 'date-fns';
const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon className='text-primary' />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);


export default function EditPurchaseOrder() {

    const [dataIsLoading, setDataIsLoading] = useState(false)
    const [noOfData, setNoOfData] = useState(0)
    const [tableData, setTableData] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const [PONo, setPONo] = useState('')
    const [OrderListNumber, setOrderListNumber] = useState('')
    const [open, setOpen] = useState(false)
    const [currentPOData, setcurrentPOData] = useState()
    const [ItemOpen, setItemOpen] = useState(false)
    const [filterData, setfilterData] = useState({
        limit: 50, page: 0,
        po_no: null,
        order_no: null,
        'order[0]': ['updatedAt', 'ASC'],
    })
    const [formData, setFormData] = useState({ currency: '', po_type: null, status: "SPC APPROVED" })
    const [EditTableData, setEditTableData] = useState([])
    const [itemload, setItemload] = useState(true)
    const [itemfilterData, setItemfilterData] = useState({
        limit: 10, page: 0,
        'order[0]': ['createdAt', 'ASC'],
    })
    const [itemTotalItems, setItemTotalItems] = useState(0)
    const [currentItemDetails, setCurrentItemDetails] = useState()
    const [itemFormData, setItemFormData] = useState()
    const [manufactureList, setManufactureList] = useState([])
    const [selectedValue, setSelectedValue] = useState('Percentage'); // Default value
    const [discount, setDiscount] = useState(0.00)
    const [allUOMS, setallUOMS] = useState([])
    const [snackbar, setSnackbar] = useState({ alert: false, severity: "success", message: "" })
    const [itemDetailsLoad, setItemDetailsLoad] = useState(false)
    const [itemButtonLoading, setItemButtonLoading] = useState(false)
    const [poButtonLoading, setPOButtonLoading] = useState(false)
    const [confirmationOpen, setConfirmationOpen] = useState(false)
    const [manufacture, setManufacture] = useState('')

    const tableColumns = [
        {
            name: 'action',
            label: 'Action',
            options: {
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = tableData[dataIndex]
                    return (
                        <Grid className="px-2">
                            {/* <Tooltip title="Print Data">
                                <IconButton
                                    onClick={() => null}
                                >
                                    <PrintIcon color="primary" />
                                </IconButton>
                            </Tooltip> */}
                            <Tooltip title="View">
                                {tempTableData.status != "SPC APPROVED" ?
                                    <IconButton onClick={() => { setcurrentPOData(tempTableData); setMainFormData(tempTableData); }}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    :
                                    <IconButton >
                                        <BlockIcon />
                                    </IconButton>
                                }
                            </Tooltip>
                        </Grid>
                    )
                },
            },
        },
        {
            name: 'po_no',
            label: 'PO Number',
            options: {
                display: true,
            },
        },
        {
            name: 'order_no',
            label: 'Order List Number',
            options: {
                display: true,
            },
        },
        {
            name: 'indent_no',
            label: 'Indent No',
            options: {
                display: true,
            },
        },
        {
            name: 'tender_no',
            label: 'Tender No',
            options: {
                display: true,
            },
        },
        {
            name: 'order_date',
            label: 'Created On',
            options: {
                display: true,
            },
        },
        {
            name: 'status',
            label: 'Status',
            options: {
                display: true,
            },
        },

    ]
    const EditTableColumns = [
        {
            name: 'action',
            label: 'Action',
            options: {
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = EditTableData[dataIndex]
                    return (
                        <Grid className="px-2 flex justify-center">

                            <Tooltip title="Edit">


                                <Chip
                                    size='small'
                                    className='px-2'
                                    color="primary"
                                    label="Assigned"
                                    onClick={() => {
                                        const tempDiscount = parseFloat(tempTableData.discount);
                                        const tempDiscountPercentage = parseFloat(tempTableData.discount_precentage ?? 0);
                                        const tempTaxAmount = parseFloat(tempTableData.tax_amount);
                                        const tempTaxPercentage = parseFloat(tempTableData.tax_percentage);

                                        setState({
                                            ...state,
                                            checkedA: tempDiscount > 0,
                                            checkedB: tempTaxAmount > 0,
                                        });

                                        if (parseFloat(tempTableData.discount) > 0) {
                                            setSelectedValue(tempDiscountPercentage > 0 ? "Percentage" : "Value");
                                            setItemFormData({
                                                ...itemFormData,
                                                discount: parseFloat(tempTableData.discount) ?? 0,
                                                discount_precentage: parseFloat(tempTableData.discount_precentage ?? 0),
                                            });
                                        } else {
                                            setItemFormData({ ...itemFormData, discount: 0, discount_precentage: 0 });
                                        }

                                        if (tempTaxAmount > 0) {
                                            setItemFormData({
                                                ...itemFormData,
                                                tax_percentage: tempTaxPercentage,
                                                tax_amount: tempTaxAmount,
                                            });
                                        } else {
                                            setItemFormData({ ...itemFormData, tax_percentage: 0, tax_amount: 0 });
                                        }

                                        setCurrentItemDetails(tempTableData);
                                        setItemOpen(true);
                                    }}
                                    icon={<EditIcon />}
                                />


                            </Tooltip>
                        </Grid>
                    )
                },
            },
        },
        {
            name: 'po_no',
            label: 'SR Number',
            options: {
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = EditTableData[dataIndex]
                    return (
                        <Grid className="px-2 flex justify-start">

                            <Typography>{tempTableData?.ItemSnap.sr_no}</Typography>
                        </Grid>
                    )
                },
            },
        },
        {
            name: 'po_type',
            label: 'SR Description',
            options: {
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = EditTableData[dataIndex]
                    return (
                        <Grid className="px-2 flex justify-start">

                            <Typography>{tempTableData?.ItemSnap.short_description}</Typography>
                        </Grid>
                    )
                },
            },
        },
        {
            name: 'order_quantity',
            label: 'Order Quantity',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = EditTableData[dataIndex]
                    return (
                        <Grid className="px-2 flex justify-start">

                            <Typography>{convertTocommaSeparated(tempTableData?.order_quantity ?? "0", 0)}</Typography>
                        </Grid>
                    )
                },
            },
        },
        {
            name: 'allocated_quantity',
            label: 'Allocatted Quantity',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = EditTableData[dataIndex]
                    return (
                        <Grid className="px-2 flex justify-center">

                            <Typography>{convertTocommaSeparated(tempTableData?.OrderListItem.allocated_quantity ?? "0", 0)}</Typography>
                        </Grid>
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

    ]

    function handleClose() {
        setfilterData({
            limit: 50, page: 0,
            'order[0]': ['updatedAt', 'ASC'],
        })
        setOpen(false)
        setItemload(false)
        loadData()

    }


    const [state, setState] = React.useState({
        checkedA: false,
        checkedB: false,
    });


    const handleChangeCheck = (event) => {
        if (event.target.name == "checkedA") {
            setItemFormData({ ...itemFormData, discount: 0, discount_precentage: 0, })
            setDiscount(0)

        } else {
            setItemFormData({ ...itemFormData, tax_percentage: 0, tax_amount: 0 })

        }

        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const loadData = async () => {

        setDataIsLoading(true)
        let res = await SPCServices.getAllPurchaseOrders(filterData)

        if (res.status === 200) {
            console.log('SPC Purchase Data: ', res.data.view.data);

            // Filter incompleted data
            let filteredData = res.data.view.data.filter((el) => el.po_no.length < 17)
            console.log('filteredData ', filteredData);
            setTableData(res.data.view.data)
            setTotalItems(res.data.view.totalItems)
            setTotalPages(res.data.view.totalPages)
            setDataIsLoading(false)
        }


    }

    const loadAllManufacture = (search) => {
        let params = { search: search, limit: 20, page: 0 }
        if (search.length > 2) {
            HospitalConfigServices.getAllManufacturers(params)
                .then((res) => {
                    setManufactureList(res.data.view.data)
                })
                .catch((err) => {
                    console.log(
                        '🚀 ~ file: OrderDetails.jsx:78 ~ HospitalConfigServices.getAllSuppliers ~ err:',
                        err
                    )
                })
        }
    }

    useEffect(() => {
        loadData();
        loadUOMS();
    }, [])

    function setPage(page) {
        filterData.page = page
        setfilterData(filterData)
        loadData()
    }
    function setItemPage(page) {
        itemfilterData.page = page
        setItemfilterData(itemfilterData)
        LoadItemDetails(currentPOData?.id)
    }
    useEffect(() => {

        setItemload(false)
        console.log("current data", currentPOData)
        LoadItemDetails(currentPOData?.id)


    }, [currentPOData])

    function setMainFormData(data) {
        let sub_total = parseFloat(data?.grand_total ?? 0) + parseFloat(data?.handl_and_packaging_charge ?? 0) +
            parseFloat(data?.freight_chargers ?? 0) + parseFloat(data?.other_charge ?? 0)
        setFormData({
            ...formData,
            po_type: data?.po_type,
            tender_no: data?.tender_no,
            indent_no: data?.indent_no,
            currency: data?.currency,
            exchange_rate: data?.exchange_rate,
            currency_short: data?.currency_short,
            handl_and_packaging_charge: data?.handl_and_packaging_charge,
            freight_chargers: data?.freight_chargers,
            other_charge: data?.other_charge,
            commission: data?.commission,
            commission_precentage: data?.commission_precentage,
            sub_total: parseFloat(sub_total)


        })

        setOpen(true)


    }
    async function LoadItemDetails(po_id) {
        setItemload(false)
        const result = await SPCServices.getAllSPCPOItem({ ...itemfilterData, spc_po_id: po_id });
        console.log('results', result)
        if (result.status == 200) {
            setEditTableData(result.data.view.data)
            setItemTotalItems(result.data.view.totalItems)
            const subTot = result.data.view.data.reduce((accumulator, currentValue) => {
                console.log('results currentValue', currentValue, accumulator)
                return accumulator + parseFloat(((currentValue?.total ?? 0) * ((currentValue?.price ?? 0) / (currentValue?.unit ?? 1))) ?? 0, 10);
            }, 0)

            const totTax = result.data.view.data.reduce((accumulator, currentValue) => {
                return accumulator + parseFloat((currentValue.tax_amount ?? 0), 10);
            }, 0)

            const totDis = result.data.view.data.reduce((accumulator, currentValue) => {
                return accumulator + parseFloat((currentValue.discount ?? 0), 10);
            }, 0)
            console.log('results subTot', subTot)
            const grandTot = (subTot + totTax) - totDis
            console.log(subTot, totTax, totDis)
            setFormData({
                ...formData,
                sub_total: subTot,
                total_tax: totTax,
                total_discount: totDis,
                grand_total: grandTot,
                final_tot: grandTot,
                commission: result.data.view.data.commission ?? 0,
                commission_precentage: result.data.view.data.commission_precentage ?? 0,
                total_payable: result.data.view.data.total_payable ?? grandTot

            })

            setItemload(true)
        } else {

            setItemload(true)
        }
    }


    function setData(data) {
        setItemDetailsLoad(false)

        console.log("data----------------------------------->>>>")
        console.log(data)
        if (parseInt(data?.discount) > 0) {

            if (data?.discount) {
                setSelectedValue('Value')
            } else {
                setSelectedValue('Percentage')
            }

            setItemFormData({
                ...itemFormData, discount_precentage: data?.discount_precentage, discount: data?.discount, price: data?.price,

            })
            setDiscount(data.discount)
            setState({ ...state, checkedA: true });
        } else {
            setState({ ...state, checkedA: false });
        }

        if (data?.tax_amount) {

            setItemFormData({
                ...itemFormData, tax_percentage: data?.tax_percentage, tax_amount: data?.tax_amount, price: data?.price,

            })
            setDiscount(data.discount)
            setState({ ...state, checkedB: true });
        } else {
            setState({ ...state, checkedB: false });
        }

        setItemFormData({
            ...itemFormData,
            unit_type: data?.unit_type,
            unit: data?.unit,
            price: data?.price,
            total: (parseInt(currentItemDetails?.order_quantity || 0) - parseInt(currentItemDetails?.allocated_quantity || 0)),
            manufacturer_name: data?.Manufacturer ? data?.Manufacturer.name : null,
            manufacture_id: data?.Manufacturer ? data?.Manufacturer.id : null,
            tax_amount: data?.tax_amount,

        })


        console.log("current Item details itemFormData", currentItemDetails)

        setTimeout(() => {
            setItemDetailsLoad(true)
            console.log("current Item details itemFormData", currentItemDetails)
            console.log("current Item details itemFormData", itemFormData)
        }, 1000);



    }

    useEffect(() => {
        console.log("current Item details useEffects", currentItemDetails)
        setData(currentItemDetails)
    }, [currentItemDetails])


    async function loadSinglePOItemDetails() {
        console.log("current Item details", currentItemDetails)
        let itemResponse = await SPCServices.getAllSPCPODeliverySchedules({ spc_po_item_id: currentItemDetails?.id });
        if (itemResponse.status == 200) {
            // setCurrentItemDetails({...currentItemDetails,full_order_quantity })

        }
    }

    const radioChange = (e) => {

        setItemFormData({ ...itemFormData, discount: 0, discount_precentage: 0, })
        setDiscount(0)

        setSelectedValue(e.target.value);
    };
    async function loadUOMS() {
        let params = { limit: 99999, page: 0 }
        const res = await ConsignmentService.getUoms(params)

        if (res.status == 200) {
            setallUOMS(res.data.view.data)
        }
    }

    async function updatePOItemDetails() {

        console.log("update data", itemFormData)

        let updated

        if (itemFormData.manufacture) {
            updated = { ...itemFormData, manufacture_id: itemFormData.manufacture.id, manufacturer_name: itemFormData.manufacture.name }
        } else {
            updated = itemFormData
        }

        const filteredObject = Object.keys(updated).reduce((acc, key) => {
            if (updated[key] !== null && updated[key] !== "") {
                acc[key] = updated[key];
            }
            return acc;
        }, {});


        setItemButtonLoading(true)

        try {
            let res = await SPCServices.changeSPCPOItem(currentItemDetails?.id, filteredObject);
            if (res.status) {
                setSnackbar({ alert: true, severity: "success", message: "Item Data was Updated Successfully" })
                setItemButtonLoading(false)
                setItemOpen(false)
                LoadItemDetails(currentPOData?.id)
            }
        } catch (error) {
            setSnackbar({ alert: true, severity: "error", message: `Error in updating for item ${currentItemDetails?.id}: ${error.message}` })
            console.error(`Error for item ${currentItemDetails?.id}: ${error.message}`);
            setItemOpen(false)
            LoadItemDetails(currentPOData?.id)
            setItemButtonLoading(false)
        } finally {
            setItemOpen(false)
            setCurrentItemDetails();
            setItemButtonLoading(false)
            LoadItemDetails(currentPOData?.id)
        }

    }
    async function updatePOOrder() {

        console.log("update data", formData)
        setPOButtonLoading(true)

        try {
            let res = await SPCServices.changePurchaseOrder(currentPOData?.id, formData);
            if (res.status) {
                setSnackbar({ alert: true, severity: "success", message: "Item Data was Updated Successfully" })
                setPOButtonLoading(false)
                setConfirmationOpen(false)
                setOpen(false)
                loadData();
            }
        } catch (error) {
            setSnackbar({ alert: true, severity: "error", message: `Error in updating for item ${currentPOData?.id}: ${error.message}` })
            console.error(`Error for item ${currentPOData?.id}: ${error.message}`);
            setPOButtonLoading(false)
            setConfirmationOpen(false)
        } finally {
            setItemOpen(false)
            setCurrentItemDetails();
            setPOButtonLoading(false)
            setConfirmationOpen(false)
        }

    }
    function clearItemData() {

        setItemFormData(
            {
                total: 0,
                manufacturer_name: "",
                manufacture_id: null,
                price: 0,
                unit_type: '',
                unit: '',
                discount: "",
                discount_precentage: 0,
                tax_percentage: 0,
                tax_amount: 0
            }
        )

        setDiscount(0)
        setItemOpen(false)
        LoadItemDetails(currentPOData?.id)


    }




    return (
        <Fragment>
            <MainContainer>
                <LoonsCard>
                    <CardTitle title={"Edit PO Details"} />

                    <ValidatorForm onSubmit={loadData}>
                        <Grid container spacing={2} className="py-3 ">

                            <Grid item lg={3} md={3} sm={6} xs={12}>

                                <SubTitle title="Purchase Order No" />
                                <TextValidator
                                    className=""
                                    placeholder="Purchase Order No"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={filterData.po_no || ''}
                                    onChange={(e) => {
                                        setfilterData({ ...filterData, po_no: e.target.value });

                                    }}

                                />

                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>

                                <SubTitle title="Order List No" />
                                <TextValidator
                                    className=""
                                    placeholder="Order List No"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={filterData.order_no || ''}
                                    onChange={(e) => {
                                        setfilterData({ ...filterData, order_no: e.target.value });
                                    }}
                                />

                            </Grid>
                            <Grid
                                item
                                lg={3} md={3} sm={6}
                                xs={12}
                                className=" w-full flex justify-start items-end"
                                style={{ paddingRight: 0 }}
                            >

                                <FormControl className='px-2 pt-2'>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<SortIcon />}
                                    >
                                        Search
                                    </Button>
                                </FormControl>
                            </Grid>

                        </Grid>
                    </ValidatorForm>

                    {/* Load All Order List : Pre Procument */}
                    {!dataIsLoading && (
                        <LoonsTable
                            id={'allPurchaseOrder'}
                            data={tableData}
                            columns={tableColumns}

                            options={{
                                pagination: true,
                                serverSide: true,
                                count: totalItems,
                                rowsPerPage: filterData.limit,
                                page: filterData.page,
                                onTableChange: (action, tableState) => {
                                    switch (action) {
                                        case 'changePage':
                                            setPage(
                                                tableState.page
                                            )
                                            break
                                        case 'sort':
                                            //this.sort(tableState.page, tableState.sortOrder);
                                            break
                                        default:
                                        // TODO: Acction not hanled
                                    }
                                },
                            }}
                        ></LoonsTable>
                    )}
                    {/* loader effect : loading table data  */}
                    {dataIsLoading && (
                        <div
                            className="justify-center text-center w-full pt-12"
                            style={{ height: '50vh' }}
                        >
                            <CircularProgress size={30} />
                        </div>
                    )}
                </LoonsCard>
            </MainContainer>

            <Dialog maxWidth="lg" fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Edit Po Details
                </DialogTitle>
                <DialogContent className='bg-light-gray'>
                    <ValidatorForm>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={2}>
                                        <Typography className='text-15 font-bold'> PO Number:</Typography>

                                    </Grid>
                                    <Grid item xs={12} md={10} className='flex justify-start'>
                                        <Typography> {currentPOData?.po_no ? currentPOData?.po_no : "-"}</Typography>
                                    </Grid>
                                </Grid>

                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Typography className='text-15 font-bold'> Order List Number:</Typography>

                                    </Grid>
                                    <Grid item xs={12} md={4} className='flex justify-start'>
                                        <Typography>  {currentPOData?.order_no ? currentPOData?.order_no : "-"}</Typography>
                                    </Grid>
                                </Grid>

                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography className='text-18 font-bold'> Order Details</Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        {/* <SubTitle title={'PO Type'}></SubTitle> */}
                                        <Autocomplete
                                            className="w-full"
                                            // value={POType ? { label: POType } : null}
                                            options={appConst.po_type}
                                            onChange={(event, value) => {
                                                if (value == null) {
                                                    setFormData({ ...formData, po_type: null })
                                                } else {
                                                    setFormData({ ...formData, po_type: value.label })
                                                }

                                            }}
                                            getOptionLabel={(option) => option.label}
                                            getOptionSelected={(option, value) =>
                                                option.label === value.label
                                            }
                                            value={{ label: formData.po_type }}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    label="PO Type"
                                                    placeholder="PO Type"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={formData.po_type || ''}
                                                    InputLabelProps={{
                                                        shrink: formData.po_type ? true : false,
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextValidator
                                            className=""
                                            label="Tender No"
                                            placeholder="Tender No"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={formData.tender_no || ''}
                                            onChange={(e) => {
                                                setFormData({ ...formData, tender_no: e.target.value })
                                            }}
                                            InputLabelProps={{
                                                shrink: formData.tender_no ? true : false,
                                            }}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextValidator
                                            label="Indent No"
                                            className=""
                                            placeholder="Indent No"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={formData.indent_no || ''}
                                            onChange={(e) => {
                                                setFormData({ ...formData, indent_no: e.target.value })
                                            }}
                                            InputLabelProps={{
                                                shrink: formData.indent_no ? true : false,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={appConst.all_currencies}
                                            getOptionLabel={(option) => option.cc}
                                            value={appConst.all_currencies.find((value) => value.cc == formData.currency)}
                                            onChange={(event, value) => {

                                                formData.currency = value.cc
                                                formData.currency_short = value.cc
                                                if (value.cc == "LKR") {
                                                    formData.exchange_rate = 1
                                                } else {
                                                    formData.exchange_rate = null
                                                }
                                                setFormData(formData)
                                            }

                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Currency"
                                                    //variant="outlined"
                                                    label="Currency"
                                                    value={formData.currency}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: formData.currency ? true : false,
                                                    }}
                                                    variant="outlined"
                                                    size="small"

                                                /*  validators={['required']}
                                                 errorMessages={['this field is required']} */
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextValidator
                                            label="Exchange Rate"
                                            className=""
                                            placeholder="Exchange Rate"
                                            fullWidth
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            value={formData.exchange_rate || ''}
                                            onChange={(e) => {
                                                setFormData({ ...formData, exchange_rate: e.target.value })
                                            }}
                                            InputLabelProps={{
                                                shrink: formData.exchange_rate ? true : false,
                                            }}

                                        />
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider className='my-2' />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography className='text-18 font-bold'> Item Details</Typography>
                            </Grid>
                            {itemload ? <>
                                <Grid item xs={12} className='px-3'>

                                    <LoonsTable
                                        id={'allPurchaseOrder'}
                                        data={EditTableData}
                                        columns={EditTableColumns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: itemTotalItems,
                                            rowsPerPage: itemfilterData.limit,
                                            page: itemfilterData.page,
                                            onTableChange: (action, tableState) => {
                                                switch (action) {
                                                    case 'changePage':
                                                        setItemPage(
                                                            tableState.page
                                                        )
                                                        break
                                                    case 'sort':
                                                        //this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:
                                                    // TODO: Acction not hanled
                                                }
                                            },
                                        }}
                                    ></LoonsTable>

                                </Grid>



                                <Grid item xs={12}>
                                    <Divider className='my-2' />
                                </Grid>

                                <Grid item xs={6}>
                                    <Grid container spacing={2}>

                                        <Grid item xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={2}>
                                                    <Typography className='text-15 font-bold'>Sub Total</Typography>

                                                </Grid>
                                                <Grid item xs={12} md={10} className='flex justify-end'>
                                                    <Typography> {convertTocommaSeparated(formData?.sub_total ?? 0.00, 1, 4)}</Typography>
                                                </Grid>
                                            </Grid>

                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={2}>
                                                    <Typography className='text-15 font-bold'>Total Tax</Typography>

                                                </Grid>
                                                <Grid item xs={12} md={10} className='flex justify-end'>
                                                    <Typography>{convertTocommaSeparated(formData?.total_tax ?? 0.00, 1, 4)}</Typography>
                                                </Grid>
                                            </Grid>

                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={2}>
                                                    <Typography className='text-15 font-bold'>Total Discount</Typography>

                                                </Grid>
                                                <Grid item xs={12} md={10} className='flex justify-end'>
                                                    <Typography> {convertTocommaSeparated(formData?.total_discount ?? 0.00, 1, 4)}</Typography>
                                                </Grid>
                                            </Grid>

                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={2}>
                                                    <Typography className='text-15 font-bold'>Grand Total</Typography>

                                                </Grid>
                                                <Grid item xs={12} md={10} className='flex justify-end'>
                                                    <Typography>  {convertTocommaSeparated(formData?.grand_total ?? 0.00, 1, 4)}</Typography>
                                                </Grid>
                                            </Grid>

                                        </Grid>

                                    </Grid>
                                </Grid>
                            </> :
                                <CircularProgress />}


                            <Grid item xs={12}>
                                <Divider className='my-2' />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography className='text-18 font-bold'> Other Charges</Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={2}>


                                    <Grid item xs={12} md={4}>
                                        <TextValidator
                                            type='number'
                                            className=""
                                            label="Handling and Packing Charges"
                                            placeholder="Handling and Packing Charges"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={formData.handl_and_packaging_charge || ''}
                                            onChange={(e) => {
                                                let subTot = parseFloat(currentPOData?.grand_total || 0) +
                                                    parseFloat(formData.freight_chargers || 0) +
                                                    parseFloat(formData.other_charge || 0) + parseFloat(e.target.value || 0)

                                                console.log("log", subTot, parseFloat(currentPOData?.grand_total || 0), parseFloat(formData.freight_chargers || 0), parseFloat(formData.other_charge || 0))
                                                setFormData({ ...formData, handl_and_packaging_charge: parseFloat(e.target.value), final_tot: parseFloat((formData?.grand_total + subTot)), commission_precentage: 0, commission: 0, total_payable: (parseFloat((formData?.grand_total + subTot))), })
                                            }}
                                            InputLabelProps={{
                                                shrink: formData.handl_and_packaging_charge ? true : false,
                                            }}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextValidator
                                            className=""
                                            type='number'
                                            label="Freight Charges"
                                            placeholder="Freight Charges"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={formData.freight_chargers || ''}
                                            onChange={(e) => {
                                                let subTot = parseFloat(currentPOData?.grand_total || 0) +
                                                    parseFloat(formData.handl_and_packaging_charge || 0) +
                                                    parseFloat(formData.other_charge || 0) + parseInt(e.target.value ? e.target.value : 0)
                                                setFormData({ ...formData, freight_chargers: parseFloat(e.target.value), final_tot: parseFloat((formData?.grand_total + subTot)), commission_precentage: 0, commission: 0, total_payable: (parseFloat((formData?.grand_total + subTot))), })
                                            }}
                                            InputLabelProps={{
                                                shrink: formData.freight_chargers ? true : false,
                                            }}

                                        />
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <TextValidator
                                            className=""
                                            type='number'
                                            label="Other Charges"
                                            placeholder="Other Charges"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={formData.other_charge || ''}
                                            onChange={(e) => {
                                                let subTot = parseFloat(currentPOData?.grand_total || 0) +
                                                    parseFloat(formData.handl_and_packaging_charge || 0) +
                                                    parseFloat(formData.freight_chargers || 0) + parseInt(e.target.value ? e.target.value : 0)
                                                setFormData({ ...formData, other_charge: parseFloat(e.target.value), final_tot: parseFloat((formData?.grand_total + subTot)), total_payable: (parseFloat((formData?.grand_total + subTot))), commission_precentage: 0, commission: 0, })
                                            }}
                                            InputLabelProps={{
                                                shrink: formData.other_charge ? true : false,
                                            }}

                                        />
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider className='my-2' />
                            </Grid>
                            <Grid item xs={12} md={6}>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Typography className='text-15 font-bold'>Final Total</Typography>

                                    </Grid>
                                    <Grid item xs={12} md={4} className='flex justify-start'>
                                        <Typography> {convertTocommaSeparated((formData.final_tot || 0.00), 1, 4)}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4} className='flex items-center'>
                                        <Typography className='text-15 font-bold'>Commission</Typography>

                                    </Grid>
                                    <Grid item xs={12} md={4} className='flex justify-start align-center'>
                                        <RadioGroup value={selectedValue} onChange={(e) => {
                                            radioChange(e)

                                            console.log(e.target.value)
                                            if (e.target.value == "Percentage") {
                                                setFormData({
                                                    ...formData, commission_precentage: 0, total_payable: formData.final_tot
                                                })
                                            } else {
                                                setFormData({
                                                    ...formData, commission: 0, total_payable: formData.final_tot
                                                })
                                            }
                                            setFormData({
                                                ...formData, total_payable: formData.final_tot
                                            })



                                        }} row aria-label="position" name="position" defaultValue="top" className='flex'>
                                            <div className='flex'>
                                                <FormControlLabel
                                                    value="Percentage"
                                                    control={<Radio color="primary" />}
                                                    label="Percentage"
                                                // labelPlacement="top"
                                                />
                                                <FormControlLabel
                                                    value="Value"
                                                    control={<Radio color="primary" />}
                                                    label="Value"
                                                // labelPlacement="start"
                                                />

                                            </div>


                                        </RadioGroup>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>


                                    </Grid>
                                    <Grid item xs={12} md={4} className='flex justify-start'>
                                        <TextValidator
                                            className=""
                                            // label="Other Charges"
                                            placeholder="Other Charges"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={selectedValue == "Value" ? formData.commission : formData.commission_precentage}
                                            onChange={(e) => {

                                                if (selectedValue == "Value") {
                                                    let totPayble = formData.final_tot - e.target.value
                                                    setFormData({ ...formData, commission: e.target.value, total_payable: totPayble })
                                                } else {
                                                    let totPayble = formData.final_tot - (formData.final_tot * ((e.target.value ?? 1) / 100))
                                                    setFormData({ ...formData, commission_precentage: e.target.value, total_payable: totPayble, commission: (formData.final_tot * ((e.target.value ?? 1) / 100)), })
                                                }

                                            }}
                                            InputLabelProps={{
                                                shrink: selectedValue == "Value" ? (formData.commission ? true : false) : (formData.commission_precentage ? true : false),
                                            }}

                                        />
                                    </Grid>
                                    {selectedValue == "Percentage" &&
                                        <Grid item xs={12} md={4} className='flex justify-start items-center'>
                                            <Typography className='text-15 font-bold'>{"Commission : " + convertTocommaSeparated(formData.commission, 0, 4)}</Typography>

                                        </Grid>
                                    }

                                </Grid>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Typography className='text-15 font-bold'>Total Payable to Supplier</Typography>

                                    </Grid>
                                    <Grid item xs={12} md={4} className='flex justify-start'>
                                        <Typography>  {convertTocommaSeparated(formData?.total_payable ?? 0.00, 1, 4)}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                    </ValidatorForm>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' size='large' onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button variant='contained' size='large' onClick={() => setConfirmationOpen(true)} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog maxWidth="md" fullWidth open={ItemOpen} onClose={() => { clearItemData(); }} aria-labelledby="form-dialog-title">
                <DialogTitle id="customized-dialog-title" onClose={() => { clearItemData(); }}>
                    Add Item Details
                </DialogTitle>


                <DialogContent className='bg-light-gray'>

                    {itemDetailsLoad ?
                        <ValidatorForm>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} >
                                            <Typography className='text-15 font-bold'> SR Number</Typography>

                                        </Grid>
                                        <Grid item xs={12} className='flex justify-start'>
                                            <Typography> {currentItemDetails?.ItemSnap.sr_no}</Typography>
                                        </Grid>
                                    </Grid>

                                </Grid>
                                {/* <Grid item xs={12} md={4}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} >
                                        <Typography className='text-15 font-bold'> Schedule Date</Typography>

                                    </Grid>
                                    <Grid item xs={12} className='flex justify-start'>
                                        <Typography> {"which date"}</Typography>
                                    </Grid>
                                </Grid>

                            </Grid> */}
                                <Grid item xs={12} md={4}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} >
                                            <Typography className='text-15 font-bold'> Order Quantity</Typography>

                                        </Grid>
                                        <Grid item xs={12} className='flex justify-start'>
                                            <Typography> {convertTocommaSeparated(currentItemDetails?.order_quantity ?? '0', 0)}</Typography>
                                        </Grid>
                                    </Grid>

                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} >
                                            <Typography className='text-15 font-bold'> Allocated Quantity</Typography>

                                        </Grid>
                                        <Grid item xs={12} className='flex justify-start'>
                                            <Typography>  {convertTocommaSeparated(currentItemDetails?.allocated_quantity ?? '0', 0)}</Typography>
                                        </Grid>
                                    </Grid>

                                </Grid>
                                <Grid item xs={12} >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} >
                                            <Typography className='text-15 font-bold'> SR Description</Typography>

                                        </Grid>
                                        <Grid item xs={12} className='flex justify-start'>
                                            <Typography>  {currentItemDetails?.ItemSnap.short_description}</Typography>
                                        </Grid>
                                    </Grid>

                                </Grid>
                                <Grid item xs={12}>
                                    <Divider className='my-2' />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} >
                                            <Typography className='text-15 font-bold'> Order Quantity</Typography>

                                        </Grid>
                                        <Grid item xs={12} className='flex justify-start'>
                                            <Typography> {convertTocommaSeparated(itemFormData?.total ?? '0', 0)}</Typography>

                                        </Grid>


                                    </Grid>

                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} >
                                            <Typography className='text-15 font-bold'> Manufacturer</Typography>

                                        </Grid>
                                        <Grid item xs={12} className='flex justify-start'>
                                            {/* <SubTitle title={'PO Type'}></SubTitle> */}
                                            <Autocomplete

                                                className="w-full"
                                                options={manufactureList}
                                                value={itemFormData?.manufacturer ? itemFormData?.manufacturer : null}
                                                onChange={(event, value) => {
                                                    setManufacture(value)
                                                    setItemFormData({ ...itemFormData, manufacturer: value })
                                                }}
                                                getOptionLabel={(option) => option?.name}
                                                getOptionSelected={(option, value) =>
                                                    option.name === value.name
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator

                                                        {...params}
                                                        placeholder="Manufacture Name (Type 3 Letters)"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={itemFormData?.manufacturer?.name}
                                                        onChange={(event) => {
                                                            loadAllManufacture(
                                                                event.target.value
                                                            )
                                                        }}
                                                        validators={['required']}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    />
                                                )}
                                            />
                                            {/* <Autocomplete

                                                className="w-full"
                                                options={manufactureList}
                                                value={{ name: itemFormData?.manufacturer_name, id: itemFormData?.manufacture_id }}
                                                onChange={(event, value) => {
                                                    if (value !== null) {
                                                        setItemFormData({ ...itemFormData, manufacture_id: value.id, manufacturer_name: value.name })
                                                    } else {
                                                        setItemFormData({ ...itemFormData, manufacture_id: null, manufacturer_name: null })
                                                    }


                                                }}
                                                getOptionLabel={(option) => option?.name}
                                                getOptionSelected={(option, value) =>
                                                    option.name === value.name
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator

                                                        {...params}
                                                        placeholder="Manufacture Name (Type 3 Letters)"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={itemFormData?.manufacturer_name}
                                                        onChange={(event) => {
                                                            loadAllManufacture(
                                                                event.target.value
                                                            )
                                                        }}
                                                        validators={['required']}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    />
                                                )}
                                            /> */}
                                        </Grid>


                                    </Grid>

                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} >
                                                    <Typography className='text-15 font-bold'> Unit Price</Typography>

                                                </Grid>
                                                <Grid item xs={12} className='flex justify-start'>
                                                    <TextValidator
                                                        className=""
                                                        placeholder="Unit Price"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={itemFormData?.price || ''}
                                                        onChange={(e) =>
                                                            setItemFormData({ ...itemFormData, price: e.target.value })
                                                        }

                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} >
                                                    <Typography className='text-15 font-bold'>UOM</Typography>

                                                </Grid>
                                                <Grid item xs={12} className='flex justify-start'>

                                                    <Autocomplete
                                                        disableClearable
                                                        className="w-full"
                                                        options={allUOMS.filter(
                                                            (ele) => ele.status == 'Active'
                                                        )}
                                                        onChange={(e, value) => {
                                                            if (value != null) {
                                                                setItemFormData({ ...itemFormData, unit_type: value.name, unit_type_id: value.id })

                                                            }
                                                            else {
                                                                setItemFormData({ ...itemFormData, unit_type: null, unit_type_id: null })
                                                            }
                                                        }}
                                                        value={allUOMS.find(
                                                            (obj) =>
                                                                obj.name ==
                                                                itemFormData?.unit_type
                                                        )}
                                                        getOptionLabel={(option) => option.name}
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="UOM"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={itemFormData?.unit_type}
                                                            />
                                                        )}
                                                    />

                                                </Grid>

                                            </Grid>

                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} >
                                                    <Typography className='text-15 font-bold'> Pack Size</Typography>

                                                </Grid>
                                                <Grid item xs={12} className='flex justify-start'>
                                                    <TextValidator
                                                        type="number"
                                                        className=""
                                                        placeholder="Pack Size"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={itemFormData?.unit || ''}
                                                        onChange={(e) =>
                                                            setItemFormData({ ...itemFormData, unit: e.target.value })
                                                        }

                                                    />
                                                </Grid>

                                            </Grid>

                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={4}>
                                                    <Typography className='text-15 font-bold'> Total</Typography>

                                                </Grid>
                                                <Grid item xs={12} md={6} className='flex justify-start'>
                                                    <Typography className='text-15 font-bold'> {convertTocommaSeparated(((itemFormData?.total ?? 0) * ((itemFormData?.price ?? 0) / (itemFormData?.unit ?? 1))), 1, 4)}</Typography>
                                                </Grid>

                                            </Grid>

                                        </Grid>

                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider className='my-2' />
                                </Grid>


                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={state.checkedA}
                                                        onChange={handleChangeCheck}
                                                        name="checkedA"
                                                        color="primary"
                                                    />
                                                }
                                                label="Add Discount"
                                            />
                                        </Grid>
                                        {state.checkedA &&
                                            <Grid item xs={12}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12}>
                                                        <RadioGroup value={selectedValue} onChange={(e) => radioChange(e)} row aria-label="position" name="position" defaultValue="top" className='flex'>
                                                            <div className='flex'>
                                                                <FormControlLabel
                                                                    value="Percentage"
                                                                    control={<Radio color="primary" />}
                                                                    label="Percentage"
                                                                // labelPlacement="top"
                                                                />
                                                                <FormControlLabel
                                                                    value="Value"
                                                                    control={<Radio color="primary" />}
                                                                    label="Value"
                                                                // labelPlacement="start"
                                                                />

                                                            </div>


                                                        </RadioGroup>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <TextValidator
                                                            type="number"
                                                            className=""
                                                            placeholder="Discount"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={selectedValue == "Value" ? itemFormData.discount : itemFormData?.discount_precentage}
                                                            onChange={(e) => {
                                                                if (selectedValue == "Value") {
                                                                    setItemFormData({ ...itemFormData, discount: parseFloat(e.target.value) })
                                                                    setDiscount(e.target.value)
                                                                } else {
                                                                    setItemFormData({ ...itemFormData, discount_precentage: parseFloat(e.target.value) })

                                                                    let dis = parseFloat((itemFormData?.total * itemFormData?.price) * (parseFloat(e.target.value) / 100))
                                                                    setDiscount(dis)
                                                                }
                                                            }}

                                                        />
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={4}>
                                                                <Typography className='text-15 font-bold'> Disount Amount</Typography>

                                                            </Grid>
                                                            <Grid item xs={12} md={6} className='flex justify-end'>
                                                                <Typography className='text-15 font-bold'> {convertTocommaSeparated(discount ?? 0, 1, 4)}</Typography>
                                                            </Grid>

                                                        </Grid>

                                                    </Grid>

                                                </Grid>

                                            </Grid>
                                        }



                                    </Grid>

                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={state.checkedB}
                                                        onChange={handleChangeCheck}
                                                        name="checkedB"
                                                        color="primary"
                                                    />
                                                }
                                                label="Add Tax"
                                            />
                                        </Grid>
                                        {state.checkedB &&
                                            <Grid item xs={12}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Typography className='text-15 font-bold'> Tax Percentage</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <TextValidator
                                                            type="number"
                                                            className=""
                                                            placeholder="Tax Percentage"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={itemFormData?.tax_percentage || ''}
                                                            onChange={(e) => {
                                                                const tax_amount = ((itemFormData?.total * itemFormData?.price) - discount) * (e.target.value ?? 1) / 100
                                                                setItemFormData({ ...itemFormData, tax_percentage: e.target.value, tax_amount: tax_amount })
                                                            }
                                                            }

                                                        />
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={4}>
                                                                <Typography className='text-15 font-bold'> Tax Amount</Typography>

                                                            </Grid>
                                                            <Grid item xs={12} md={6} className='flex justify-start'>
                                                                <Typography className='text-15 font-bold'> {convertTocommaSeparated(itemFormData?.tax_amount, 1, 4)}</Typography>
                                                            </Grid>

                                                        </Grid>

                                                    </Grid>

                                                </Grid>

                                            </Grid>
                                        }



                                    </Grid>

                                </Grid>



                            </Grid>
                        </ValidatorForm> :

                        <CircularProgress />

                    }

                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' size='large' onClick={() => setItemOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        progress={itemButtonLoading}
                        variant='contained' size='large' onClick={updatePOItemDetails} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
            <ConfirmationDialog
                text="Are you sure to Update?"
                open={confirmationOpen}
                onConfirmDialogClose={() => { setConfirmationOpen(false) }}
                onYesClick={updatePOOrder}
            />


            <LoonsSnackbar
                open={snackbar.alert}
                onClose={() => {
                    setSnackbar({ alert: false })
                }}
                message={snackbar.message}
                autoHideDuration={1200}
                severity={snackbar.severity}
                elevation={2}
                variant="filled"
            ></LoonsSnackbar>

        </Fragment>
    )
}
