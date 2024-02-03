import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Alert } from '@material-ui/lab';

import VisibilityIcon from '@material-ui/icons/Visibility'
import { CardTitle, LoonsCard, LoonsTable, MainContainer, LoonsSnackbar, SubTitle, PrintHandleBar } from 'app/components/LoonsLabComponents'
import PurchaseInvoiceEntry from './PurchaseInvoiceEntry'
import PurchaseCreditEntry from './PurchaseCreditEntry'
import { ModalXL } from 'app/components/Modals/ModalXL'
import PaymentVoucher from './PaymentVoucher'
import { Button, CircularProgress, Grid, IconButton, TextField, Autocomplete, Divider } from '@mui/material'
import ModalLG from 'app/components/Modals/ModalLG'

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { Dialog, DialogTitle } from "@material-ui/core";
import VouchePrint from '../MSD_Medical_Supply_Assistant/voucherPrint/index';

import FinanceServices from 'app/services/FinanceServices'
import { roundDecimal, scrollToTop } from 'utils'

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

const Sales_Order = () => {
    const [formData, setFormData] = useState({
        page: 0,
        limit: 10,
        reference_type: ['Sales Order'],
        is_active: true,
        'order[0]': ['createdAt', 'DESC'],
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

    const [data, setData] = useState([
        {
            no: '325647CGW',
            debit_note_no: 'DB-3254',
            invoice_no: 'Inv-435',
            wharf_ref_no: 'DFG2453',
            po_indent_no: 'PD8876',
            grn_no: 'GRN9832',
            grn_date: '2023/02/21',
            total_amount: '152,232.00',
        },
    ])
    const columns = [
        {
            name: 'recept_no',
            label: 'No',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.data.recept_no ? data[dataIndex]?.data.recept_no : "NAN"
                }
            },
        },

        {
            name: 'order_no',
            label: 'Order No',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.data?.order_no ? data[dataIndex]?.data?.order_no : "Not Available"
                }
            },
        },
        // {
        //     name: 'wharf_ref_no',
        //     label: 'WHARF Ref No',
        //     options: {
        //         display: true,
        //         customBodyRenderLite: (dataIndex) => {
        //             return data[dataIndex]?.data.warf_ref_no ? data[dataIndex]?.data.warf_ref_no : "Not Available"
        //         }
        //     },
        // },
        {
            name: 'name',
            label: 'Payer',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.Payee?.name ? data[dataIndex]?.Payee?.name : "Not Available"
                }
            },
        },
        // {
        //     name: 'po_indent_no',
        //     label: 'PO/Indent No',
        //     options: {
        //         display: true,
        //         customBodyRenderLite: (dataIndex) => {
        //             return data[dataIndex]?.data.indent_no ? data[dataIndex]?.data.indent_no : "Not Available"
        //         }
        //     },
        // },
        {
            name: 'final_value',
            label: 'Total Amount',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return roundDecimal(data[dataIndex]?.final_value, 2)
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
                            <IconButton onClick={() => {
                                if (selectedIndex === dataIndex) {
                                    //setOpen(!open)
                                } else {
                                    setOpen(false)
                                    setSelectedIndex(dataIndex)

                                    setOpen(true)

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
        setLoading(false)
        let res = await FinanceServices.getFinanceDocuments(formData)
        if (res.status === 200) {
            console.log('Votes: ', res.data.view.data)
            setData(res.data.view.data)
            setTotalItems(res.data.view.totalItems)
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
    }, [formData])

    return (
        <Fragment>
            <MainContainer>
                <LoonsCard>
                    <CardTitle title={'Sales Order'} />
                    <br />
                    <Grid container spacing={2}>
                        {/* <Grid item xs={3}>
                            {renderDetailCard(
                                'PO Number',
                                renderDropdown('po_no', 'po_no', [
                                    { label: '32445', value: '32445' },
                                    { label: '34533', value: '34533' },
                                    { label: '66554', value: '66554' },
                                ])
                            )}
                        </Grid> */}
                        <Grid item xs={3}>
                            {renderDetailCard(
                                'Voucher Number',
                                renderDropdown('po_no', 'po_no', [
                                    { label: '32445', value: '32445' },
                                    { label: '34533', value: '34533' },
                                    { label: '66554', value: '66554' },
                                ])
                            )}
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
                        <Grid item xs={3}>
                            {renderDetailCard(
                                'Status',
                                renderDropdown('po_no', 'po_no', [
                                    { label: '1', value: '1' },
                                    { label: '2', value: '2' },
                                    { label: '3', value: '3' },
                                ])
                            )}
                        </Grid>
                        <Grid item xs={3}>
                            {renderDetailCard(
                                'From',
                                <input
                                    className="w-full"
                                    style={{ padding: '8px' }}
                                    type="date"
                                    placeholder="From"
                                ></input>
                            )}
                        </Grid>
                        <Grid item xs={3}>
                            {renderDetailCard(
                                'To',
                                <input
                                    className="w-full"
                                    style={{ padding: '8px' }}
                                    type="date"
                                    placeholder="To"
                                ></input>
                            )}
                        </Grid>
                        <Grid item xs={3}>
                            {renderDetailCard(
                                'Search',
                                renderDropdown('po_no', 'po_no', [
                                    { label: '1', value: '1' },
                                    { label: '2', value: '2' },
                                    { label: '3', value: '3' },
                                ])
                            )}
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained">Search</Button>
                        </Grid>
                    </Grid>
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
                                                    break;
                                                case 'changeRowsPerPage':
                                                    setFormData({
                                                        ...formData,
                                                        page: 0,
                                                        limit: tableSate.rowsPerPage
                                                    })
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

export default Sales_Order
