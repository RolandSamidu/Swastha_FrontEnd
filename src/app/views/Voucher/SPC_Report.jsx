import React, { Fragment, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Alert } from '@material-ui/lab';

import VisibilityIcon from '@material-ui/icons/Visibility'
import { CardTitle, LoonsCard, LoonsTable, MainContainer, LoonsSnackbar, Button, SubTitle, PrintHandleBar, DatePicker } from 'app/components/LoonsLabComponents'
import PurchaseInvoiceEntry from './PurchaseInvoiceEntry'
import PurchaseCreditEntry from './PurchaseCreditEntry'
import { ModalXL } from 'app/components/Modals/ModalXL'
import PaymentVoucher from './PaymentVoucher'
import { CircularProgress, Grid, IconButton, TextField, Autocomplete, Divider } from '@mui/material'
import ModalLG from 'app/components/Modals/ModalLG'

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { Dialog, DialogTitle } from "@material-ui/core";
import VouchePrint from '../MSD_Medical_Supply_Assistant/voucherPrint/index';

import FinanceServices from 'app/services/FinanceServices'
import ConsignmentService from 'app/services/ConsignmentService'
import { dateParse, roundDecimal, scrollToTop } from 'utils'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SPCServices from 'app/services/SPCServices'

const renderDetailCard = (label, value) => {
    return (
        <Grid
            container
            alignItems={'center'}
            sx={{ minHeight: '40px' }}
            spacing={0}
        >
            <Grid item xs={3}>
                {label}
            </Grid>
            <Grid item xs={1}>
                :
            </Grid>
            <Grid item xs={8}>
                {value}
            </Grid>
        </Grid>
    )
}
const renderDropdown = (name, id, options) => {
    return (
        <Autocomplete
            disableClearable
            disablePortal
            id="combo-box-demo"
            size="small"
            options={options}
            renderInput={(params) => <TextField size="small" {...params} />}
        />
    )
}

const SPC_Report = () => {

    const gridRef = useRef(null);
    const [formData, setFormData] = useState({
        page: 0,
        limit: 10,
        'order[0]': ['updatedAt', 'DESC'],
        po: null,
        allstatus:true,
        notrejected:true,
        // reference_type: ['IM Debit Note', 'LC Debit Note'],
        //is_active: true
    })

    const [voteData, setVoteData] = useState({
        page: 0,
        limit: 5
    })

    const [snackBar, setSnackBar] = React.useState({
        severity: 'success',
        alert: false,
        message: ''
    })

    const [totalItems, setTotalItems] = useState(0)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(null)

    const [selectedInvoiceItems, setSelectedInvoiceItems] = useState([])
    const [selectedCreditItems, setSelectedCreditItems] = useState([])

    const [loadedVotes, setLoadedVotes] = useState(false)
    const [printData, setPrintData] = useState(null)
    const [printView, setPrintView] = useState(false)

    const [consingmentStatus, setConsingmentStatus] = useState(null)
    const [report_no, setReportNo] = useState(null)
    const [file_no, setFileNo] = useState(null)

    const [data, setData] = useState([])
    const columns = [
        {
            name: 'debit_note_no',
            label: 'Debit Note No',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.data?.debit_note_no ? data[dataIndex]?.data?.debit_note_no : "Not Available"
                }
            },
        },

        {
            name: 'invoice_no',
            label: 'Invoice No',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.invoice_no ? data[dataIndex]?.invoice_no : "Not Available"
                }
            },
        },
        {
            name: 'invoice_date',
            label: 'Invoice Date',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.invoice_date ? dateParse(data[dataIndex]?.invoice_date) : "Not Available"
                }
            },
        },
        {
            name: 'po',
            label: 'PO No',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.po ? data[dataIndex]?.po : "Not Available"
                }
            },
        },
        {
            name: 'order_no',
            label: 'Order No',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.order_no ? data[dataIndex]?.order_no : "Not Available"
                }
            },
        },
        {
            name: 'wharf_ref_no',
            label: 'WHARF Ref No',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.warf_ref_no ? data[dataIndex]?.warf_ref_no : "Not Available"
                }
            },
        },
        {
            name: 'po_indent_no',
            label: 'Indent No',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.indent_no ? data[dataIndex]?.indent_no : "Not Available"
                }
            },
        },
        {
            name: 'supplier_no',
            label: 'Supplier No',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.Supplier ? data[dataIndex]?.Supplier?.registartion_no : "Not Available"
                }
            },
        },
        {
            name: 'supplier',
            label: 'Supplier Name',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.Supplier ? data[dataIndex]?.Supplier?.name : "Not Available"
                }
            },
        },
        {
            name: 'total_amount',
            label: 'Total Amount',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    if (data[dataIndex]?.final_value) {
                        return roundDecimal(data[dataIndex]?.final_value, 2)
                    } else {
                        return 'Not Available'
                    }
                }
            },
        },
        {
            name: 'starus',
            label: 'Status',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.consingmentStatus
                }
            },
        },

        {
            name: 'action',
            label: 'Action',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return (
                        <div>
                            <IconButton
                                //disabled={data[dataIndex]?.DocumentType == null ? true :data[dataIndex].consingmentStatus.toUpperCase()=='COMPLETED'?false:true}
                                disabled={data[dataIndex]?.DocumentType == null ? true : false}


                                onClick={() => {
                                    if (selectedIndex === dataIndex) {
                                        //setOpen(!open)
                                    } else {
                                        setOpen(false)
                                        setSelectedIndex(dataIndex)

                                        setOpen(true)
                                        setTimeout(() => {
                                            gridRef.current.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start',
                                                inline: 'nearest'
                                            });
                                        }, 500);


                                    }
                                }}>
                                <VisibilityIcon sx={{ color: '#000' }} />
                            </IconButton>
                        </div>
                    )
                },
            },
        },
    ]

    const voteColumns = [
        {
            name: 'po_no',
            label: 'PO No',
            options: {
                display: true,
                // customBodyRenderLite: (dataIndex) => {
                //     return data[dataIndex]?.data.debit_note_no ? data[dataIndex]?.data.debit_note_no : "NAN"
                // }
            },
        },

        {
            name: 'code',
            label: 'Vote Code',
            options: {
                display: true,
                // customBodyRenderLite: (dataIndex) => {
                //     return data[dataIndex]?.data.invoice_no ? data[dataIndex]?.data.invoice_no : "Not Available"
                // }
            },
        },
        {
            name: 'order_list_no',
            label: 'Order List No',
            options: {
                display: true,
                // customBodyRenderLite: (dataIndex) => {
                //     return data[dataIndex]?.data.indent_no ? data[dataIndex]?.data.indent_no : "Not Available"
                // }
            },
        },
        {
            name: 'amount',
            label: 'Total Amount',
            options: {
                display: true,
                // customBodyRenderLite: (dataIndex) => {
                //     return roundDecimal(data[dataIndex]?.final_value, 2)
                // }
            },
        },
        {
            name: 'sa_status',
            label: 'Status',
            options: {
                display: true,
                // customBodyRenderLite: (dataIndex) => {
                //     return roundDecimal(data[dataIndex]?.final_value, 2)
                // }
            },
        },
    ]



    function TabPanel(props) {
        const { children, value, index, ...other } = props

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        )
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        }
    }
    const [value, setValue] = React.useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }


    const loadData = async () => {

        const params = new URLSearchParams(window.location.search);

        // Retrieve specific parameter values
        const type = params.get('type');
        console.log("type", type)
        setLoading(false)
        let final_data = [];
        let spc_debit_note_data = []

        let con_res = await ConsignmentService.getAllConsignments(formData)
        if (con_res.status === 200) {
            setTotalItems(con_res.data.view.totalItems)
            let consingments = con_res?.data?.view?.data;
            let consigments_ids = con_res?.data?.view?.data?.map(x => x.id)

            console.log("data 1", consingments)
            let consigments_debitnote_ids = []

            if (consigments_ids.length > 0) {
                const params_deit = {
                    consignment_id: consigments_ids,
                    
                    // reference_type: ['IM Debit Note', 'LC Debit Note'],
                    is_active: true,

                }

                console.log("params_deit 1", params_deit)
                let res2 = await SPCServices.getAllDebitNotes(params_deit) 
                console.log('spc_debitnote_data', res2)
                if (res2.status === 200){
                    consigments_debitnote_ids = res2?.data?.view?.data?.map(x => x.id)
                    spc_debit_note_data = res2?.data?.view?.data
                } else {
                    console.log('gotcha') 
                }

           
                let ref_params
                if (consigments_debitnote_ids.length > 0) {
                    ref_params = {
                        refference_id: consigments_ids.concat(consigments_debitnote_ids),
                        // reference_type: ['IM Debit Note', 'LC Debit Note'],
                        is_active: true,
        
                    }

                } else {
                    ref_params = {
                        refference_id: consigments_ids,
                        // reference_type: ['IM Debit Note', 'LC Debit Note'],
                        is_active: true,
        
                    }
                }
           
            console.log('spc_ref_params', ref_params)

            let res = await FinanceServices.getFinanceDocuments(ref_params)
            if (res.status === 200) {
                consingments.forEach(element => {
 // console.log('spc_debitnote_data', spc_debitnote_data)
                    let document_data = res.data.view.data.find((x) => x.refference_id == element.id)
                    let spc_debitnote_data = spc_debit_note_data.find((x) => x.consignment_id == element.id)
                    console.log('spc_debitnote_data aha', spc_debitnote_data)

                    if (spc_debitnote_data) {
                        console.log('spc_debihhjjhjhha', spc_debitnote_data)
                        // if (spc_debitnote_data.length > 0){
                            let document_debitnote_data = res.data.view.data.find((x) => x.refference_id == spc_debitnote_data.id)
                            document_data = document_debitnote_data
                            console.log('spc_debjjkjkka aha', document_debitnote_data)
                        // }
                    }
                    
                    
                    
                    console.log("document data", document_data)
                    if (document_data) {
                        final_data.push({ ...document_data, ...element, ...{ consingmentStatus: element.status }, ...{ document_id: document_data.id } })//merge consingment data and document data
                    } else {

                        let empty = {
                            DocumentType: null,
                            Employee: null,
                            Payee: null,
                            Payer: null,
                            PrintTemplate: null,
                            data: null,
                            final_value: null
                        }
                        final_data.push({ ...empty, ...element })

                    }


                });
                console.log("finam data", final_data)
                setData(final_data)
                
            }
            
        }

        }
        setLoading(true)


    }

    const handleInvoiceCallback = async (data) => {
        console.log("callback", data)
        setLoadedVotes(false)
        if (data) {
            let item = selectedInvoiceItems
            item = [data]
            setSelectedInvoiceItems(item)
            setConsingmentStatus(data.consingmentData.status)
            setLoadedVotes(true)
        } else {
            console.log("Child Data: None")
        }
    }

    const handleCreditCallback = async (data) => {
        console.log("callback", data)
        setLoadedVotes(false)
        if (data) {
            let item = selectedCreditItems
            item.push(data)
            setSelectedCreditItems(item)
            setConsingmentStatus(data.consingmentData.status)
            setLoadedVotes(true)

        }
        else {
            console.log("Child Data: None")
        }
    }



    const handleCreateVoucher = async () => {
        let formData = null;

        if (value == 0) {
            formData = selectedInvoiceItems[0]

        } else if (value == 1) {
            formData = selectedCreditItems[0]

        }
        formData.consingmentData = null
        formData.amount = data[selectedIndex].final_value
        // formData.credit_note_amount=0
        formData.report_no=report_no
        formData.file_no=file_no
        formData.final_amount = Number(data[selectedIndex].final_value) - Number(formData.credit_note_amount)

        console.log("subbmitting form Data", formData)

        let res = await FinanceServices.createFinanceVouchers(formData)
        console.log("create voucher res", res.data.posted.res)
        if (res.status === 201) {
            setPrintData(res.data.posted.res)
            setPrintView(true)
            setSnackBar({
                alert: true,
                message: "Voucher has been Created Successfully",
                severity: 'success'
            })
        } else {
            setSnackBar({
                alert: true,
                message: "Failed to Create Voucher",
                severity: 'error'
            })
        }
    }

    /*     useEffect(() => {
            let isMounted = true;
            if (isMounted) {
                loadData()
            }
            return () => {    // Cleanup function to cancel any pending requests
                isMounted = false;
            };
        }, [formData]) */

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            loadData()

        }
        return () => {    // Cleanup function to cancel any pending requests
            isMounted = false;
        };
    }, [])

    return (
        <Fragment>
            <MainContainer>
                <LoonsCard>
                    <CardTitle title={'SPC Report'} />
                    <br />
                    <ValidatorForm onSubmit={loadData}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <SubTitle title="PO Number"></SubTitle>
                                <TextValidator
                                    className="w-full"
                                    variant="outlined"
                                    size="small"
                                    value={formData.po}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            po: e.target.value,
                                        });
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3}>

                                <SubTitle title="Invoice Number"></SubTitle>
                                <TextValidator
                                    className="w-full"
                                    variant="outlined"
                                    size="small"
                                    value={formData.invoice_no}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            invoice_no: e.target.value,
                                        });
                                    }}
                                />
                            </Grid>
                            {/* <Grid item xs={3}>
                                {renderDetailCard(
                                    'Category',
                                    renderDropdown('po_no', 'po_no', [
                                        { label: 'LM', value: 'LM' },
                                        { label: 'SPMC', value: 'SPMC' },
                                        {
                                            label: 'Gauze & Gloves',
                                            value: 'Gauze & Gloves',
                                        },
                                    ])
                                )}
                            </Grid> */}
                            {/* <Grid item xs={3}>
                                {renderDetailCard(
                                    'Status',
                                    renderDropdown('po_no', 'po_no', [
                                        { label: '1', value: '1' },
                                        { label: '2', value: '2' },
                                        { label: '3', value: '3' },
                                    ])
                                )}
                            </Grid> */}
                            <Grid item xs={3}>
                                <SubTitle title="From"></SubTitle>
                                <DatePicker
                                    className='w-full'
                                    value={formData.from}
                                    placeholder="From"
                                    onChange={(date) => {
                                        setFormData({
                                            ...formData,
                                            from: dateParse(date),
                                        });

                                    }}
                                />


                            </Grid>
                            <Grid item xs={3}>
                                <SubTitle title="To"></SubTitle>
                                <DatePicker
                                    className='w-full'
                                    value={formData.to}
                                    placeholder="To"
                                    onChange={(date) => {
                                        setFormData({
                                            ...formData,
                                            to: dateParse(date),
                                        });

                                    }}
                                />


                            </Grid>
                            <Grid item xs={3}>
                                <SubTitle title="Search"></SubTitle>
                                <TextValidator
                                    className="w-full "
                                    variant="outlined"
                                    size="small"
                                    value={formData.search}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            search: e.target.value,
                                        });
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Button className="mt-6" variant="contained" type="submit">Search</Button>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                    <br />
                    <Divider className='mt-2' />
                    {loading ? (
                        <Grid container className="mt-5 pb-5">
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <LoonsTable
                                    id={'completed'}
                                    data={data}
                                    columns={columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: totalItems,
                                        rowsPerPage: formData.limit,
                                        page: formData.page,
                                        rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                        selectableRows: false,
                                        onTableChange: (action, tableSate) => {
                                            switch (action) {
                                                case 'changePage':
                                                    setFormData({
                                                        ...formData, // spread previous state object
                                                        page: tableSate.page, // overwrite page property
                                                    });
                                                    loadData()
                                                    break;
                                                case 'changeRowsPerPage':
                                                    setFormData({
                                                        ...formData,
                                                        page: 0,
                                                        limit: tableSate.rowsPerPage
                                                    })
                                                    loadData()
                                                    break;
                                                default:
                                                    console.log('action not handled');
                                            }
                                        }

                                    }}
                                ></LoonsTable></Grid></Grid>
                    ) : (
                        <Grid className='justify-center text-center w-full pt-12'>
                            <CircularProgress size={30} />
                        </Grid>
                    )}
                </LoonsCard>
                {
                    open &&
                    (<div

                        className="w-full"
                        style={{
                            padding: 30,
                            backgroundColor: '#ffffff',
                            borderRadius: '15px',
                            marginTop: '20px',
                        }}
                    >
                        <Box sx={{ width: '100%', minHeight: '300px' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    aria-label="basic tabs example"
                                    variant="fullWidth"
                                >
                                    <Tab
                                        label="Purchase Invoice Entry"
                                        {...a11yProps(0)}
                                    />
                                    <Tab
                                        label="Purchase Credit Entry"
                                        {...a11yProps(1)}
                                    />
                                </Tabs>
                            </Box>
                            <TabPanel value={value} index={0}>
                                <PurchaseInvoiceEntry callback={handleInvoiceCallback} id={data ? data[selectedIndex]?.refference_id : null} data={data ? data[selectedIndex] : null} />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <PurchaseCreditEntry callback={handleCreditCallback} id={data ? data[selectedIndex]?.refference_id : null} data={data ? data[selectedIndex] : null} />
                            </TabPanel>
                        </Box>

                        {loadedVotes &&
                            <Grid container className="mt-5" style={{ padding: "24px" }}>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <SubTitle title="SELECTED VOTES" />
                                    <Divider className='mt-2' />
                                    <LoonsTable
                                        id={'completed'}
                                        data={value === 0 ? selectedInvoiceItems : selectedCreditItems}
                                        columns={voteColumns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: value === 0 ? selectedInvoiceItems.length : selectedCreditItems.length,
                                            rowsPerPage: voteData.limit,
                                            page: voteData.page,
                                            rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                            selectableRows: false,
                                            onTableChange: (action, tableState) => {
                                                switch (action) {
                                                    case 'changePage':
                                                        setVoteData({
                                                            ...voteData, // spread previous state object
                                                            page: tableState.page, // overwrite page property
                                                        });
                                                        break;
                                                    case 'changeRowsPerPage':
                                                        setVoteData({
                                                            ...voteData,
                                                            page: 0,
                                                            limit: tableState.rowsPerPage
                                                        })
                                                        break;
                                                    default:
                                                        console.log('action not handled');
                                                }
                                            }

                                        }}
                                    ></LoonsTable>
                                </Grid>
                            </Grid>

                        }

                        {(selectedInvoiceItems.length > 0 && value == 0) || (selectedCreditItems.length > 0 && value == 1) ?

                            <div className="w-full">





                                {value == 0 &&
                                    <Alert severity='info' className='mt-1'>

                                        <Typography className='mt-2'>
                                            Credit note amount is not added. Are you sure to continue!
                                        </Typography>
                                    </Alert>
                                }


                                <ValidatorForm>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <SubTitle title="Report No"></SubTitle>
                                            <TextValidator
                                                className="w-full"
                                                placeholder="Report No"
                                                name="report_no"
                                                InputLabelProps={{ shrink: false }}
                                                value={report_no}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => setReportNo(e.target.value)}
                                            /* validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]} */
                                            />
                                        </Grid>

                                        <Grid item xs={6}>
                                            <SubTitle title="File No"></SubTitle>
                                            <TextValidator
                                                className="w-full"
                                                placeholder="File No"
                                                name="file_no"
                                                InputLabelProps={{ shrink: false }}
                                                value={file_no}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => setFileNo(e.target.value)}
                                            /* validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]} */
                                            />
                                        </Grid>
                                    </Grid>

                                </ValidatorForm>


                                <Button /* disabled={consingmentStatus == "COMPLETED" ? false : true} */ className='mt-5' variant="contained" onClick={() => { handleCreateVoucher() }}>
                                    Create Voucher
                                </Button>





                                {/* <ModalLG
                                    title={'Payment Voucher - SPC'}
                                    button={
                                        <Button variant="contained" onClick={() => { handleCreateVoucher() }}>
                                            Payment Voucher Print
                                        </Button>
                                    }
                                    actions={[<Button variant="contained">Print</Button>]}
                                    close={
                                        <Button variant="contained" color="error">
                                            Cancel
                                        </Button>
                                    }
                                >
                                    <PaymentVoucher tabValue={value} />
                                    {value == 0 &&
                                        <Alert severity='info' className='mt-1'>

                                            <Typography className='mt-2'>
                                                Credit note amount is not added. Are you sure to continue!
                                            </Typography>
                                        </Alert>
                                    }
                                </ModalLG> */}
                            </div>
                            : null}
                    </div>)
                }
            </MainContainer>





            <Dialog maxWidth={"md"} fullWidth={true} open={printView} onClose={() => { setPrintView(false) }}  >

                <DialogTitle
                    style={{
                        borderBottom: '1px solid #000',
                    }}
                >
                    Voucher
                    <div
                        style={{
                            position: 'absolute',
                            right: '5px',
                            top: '5px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            display: 'flex',
                            padding: 3,
                            cursor: 'pointer',
                            transform: 'scale(1.1)',
                        }}
                        onClick={() => {
                            setPrintView(false)
                        }}
                    >
                        <CloseIcon
                            style={{ color: 'white', width: 14, height: 14 }}
                        />
                    </div>
                </DialogTitle>



                <MainContainer>

                    <Grid container>

                        <VouchePrint hidden={false} voucherId={printData?.id} i={[0]} />

                    </Grid>


                </MainContainer>
            </Dialog>




            <div ref={gridRef}>{/*  added for Scroll */}

            </div>



            <LoonsSnackbar
                open={snackBar.alert}
                onClose={() => {
                    setSnackBar({ ...snackBar, alert: false })
                }}
                message={snackBar.message}
                autoHideDuration={1000}
                severity={snackBar.severity}
                elevation={2}
                variant="filled"
            ></LoonsSnackbar>
        </Fragment>
    )
}

export default SPC_Report
