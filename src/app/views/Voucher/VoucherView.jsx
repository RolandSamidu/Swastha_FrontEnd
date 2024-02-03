import React, { useEffect, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Autocomplete, Checkbox, Divider, Select } from '@mui/material'
import { DatePicker, LoonsTable } from 'app/components/LoonsLabComponents'
import { Grid } from '@mui/material'
import { MenuItem } from '@mui/material'
import { TextField } from '@mui/material'
import ModalLG from 'app/components/Modals/ModalLG'
import PaymentVoucher from './PaymentVoucher'
import { TextareaAutosize } from '@mui/material'
import FinanceServices from 'app/services/FinanceServices'
import { CircularProgress } from '@mui/material'
import { CardTitle, Button, LoonsSnackbar } from 'app/components/LoonsLabComponents'
import { dateParse } from 'utils'
import localStorageService from 'app/services/localStorageService'
import VouchePrint from '../MSD_Medical_Supply_Assistant/voucherPrint/index';
import ReactToPrint from "react-to-print";
import PrintIcon from '@material-ui/icons/Print';
import { IconButton } from '@material-ui/core'
import ConsignmentService from 'app/services/ConsignmentService'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm, SubTitle } from 'app/components/LoonsLabComponents'
import LoonsDatePicker from 'app/components/LoonsLabComponents/DatePicker'
import * as appConst from '../../../appconst'

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

// const renderDropdown = (name, id, options) => {
//     return (
//         <Select
//             fullWidth
//             defaultValue={options[0]?.value}
//             size="small"
//             name={name}
//             id={id}
//         >
//             {options.map((option) => {
//                 return (
//                     <MenuItem value={option?.value}>{option?.label}</MenuItem>
//                 )
//             })}
//         </Select>
//     )
// }

const VoucherView = () => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        page: 0,
        limit: 10,
        'order[0]': ['createdAt','DESC'],
        po_no: null,
        search: null,
        to: null,
        from: null,
        status: null,
        voucher_no: null,
        invoice_no:null
    })
    const [filterData, setFilter] = useState({
        page: 0,
        limit: 10,
        'order[0]': ['createdAt','DESC'],
        po_no: null,
        search: null,
        to: null,
        from: null,
        status: null,
        voucher_no: null,
        invoice_no:null
    })
    const [totalItems, setTotalItems] = useState(0);
    const [loginUserRoles, setUserRoles] = useState(null);
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState('success');

    const [remark, setRemark] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [printLoad, setPrintLoad] = useState(false);
    var [voucher, setVoucher] = useState(null);
    const [grnNo, setGrnNumber] = useState(null);
    const [invoiceDate, setInvoiceDate] = useState(null);
    const [srNo, setSrNoList] = useState(null);
    const [grnQty, setgrnQty] = useState(null);




    const [data, setData] = useState([
        {
            no: '325647CGW',
            created_date: 'DB-3254',
            order_list_no: 'Inv-435',
            po_number: 'DFG2453',
            supplier_code: 'PD8876',
            item_code: 'GRN9832',
            payment_amount: '133,232.00',
            status: 'Pending',
        },
        {
            no: '325647CGW',
            created_date: 'DB-3254',
            order_list_no: 'Inv-435',
            po_number: 'DFG2453',
            supplier_code: 'PD8876',
            item_code: 'GRN9832',
            payment_amount: '133,232.00',
            status: 'Pending',
        },
        {
            no: '325647CGW',
            created_date: 'DB-3254',
            order_list_no: 'Inv-435',
            po_number: 'DFG2453',
            supplier_code: 'PD8876',
            item_code: 'GRN9832',
            payment_amount: '133,232.00',
            status: 'Pending',
        },
    ])
    const columns = [
        {
            name: 'voucher_no',
            label: 'Voucher No',
            options: {
                display: true,
            },
        },
        {
            name: 'created_date',
            label: 'Created Date',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return dateParse(data[dataIndex]?.createdAt)
                }
            },
        },

        {
            name: 'order_list_no',
            label: 'Order List No',
            options: {
                display: true,
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
            name: 'supplier_code',
            label: 'Supplier Code',
            options: {
                display: true,
            },
        },
        {
            name: 'amount',
            label: 'Payment Amount',
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

        {
            name: 'action',
            label: 'Action',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        
                        <ModalLG
                            title={'Payment Voucher - SPC'}
                            button={
                                <>
                                <IconButton>
                                    <VisibilityIcon sx={{ color: '#000' }} onClick={() => {
                                        setSelectedItem(data[dataIndex])
                                    }} />
                                </IconButton>
                                
                                </>
                            }
                            // print button

                            actions={[]}
                        //close={ }
                        >
                            <div>
                                {/*  <PaymentVoucher /> */}
                                <Grid
                                    container
                                    alignItems={'center'}
                                    sx={{ minHeight: '40px' }}
                                    spacing={0}
                                >
                                    <Grid item xs={3}>Voucher No</Grid>
                                    <Grid item xs={1}>:</Grid>
                                    <Grid item xs={8}>{selectedItem?.voucher_no}</Grid>
                                    
                                </Grid>

                                <Grid
                                    container
                                    alignItems={'center'}
                                    sx={{ minHeight: '40px' }}
                                    spacing={0}
                                >
                                    <Grid item xs={3}>Supplier</Grid>
                                    <Grid item xs={1}>:</Grid>
                                    <Grid item xs={8}>{selectedItem?.Payee?.name}</Grid>
                                    
                                </Grid>

                            
                                <div className="w-full">
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        placeholder="Remark"
                                        value={remark}
                                        onChange={(e) => {
                                            setRemark(e.target.value)
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: 10,
                                            borderRadius: 10,
                                        }}
                                    />
                                    {loginUserRoles.includes("Chief Accountant") &&
                                        <Grid container spacing={2} >
                                            <Grid item>
                                                <Button variant="contained" className="button-success"
                                                    onClick={() => {
                                                        changeStatus(data[dataIndex]?.id, "APPROVED")
                                                    }}
                                                >
                                                    Recommend & Approve
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" className="button-warning"
                                                    onClick={() => {
                                                        changeStatus(data[dataIndex]?.id, "CORRECTIONS NEEDED")
                                                    }}
                                                >
                                                    Send For Corrections
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" className="button-danger"
                                                    onClick={() => {
                                                        changeStatus(data[dataIndex]?.id, "REJECTED")
                                                    }}
                                                >
                                                    Reject
                                                </Button>
                                            </Grid>


                                        </Grid>

                                    }

                                </div>
                            </div>
                        </ModalLG>
                        <IconButton >              
                            {/* <VouchePrint voucherId={data[dataIndex].id} i={[dataIndex]} /> */}
                            <PrintIcon color='primary' onClick={() => {
                                printFunc(data[dataIndex].id)
                            }} />
                        </IconButton>
                    </div>
                    )
                },
            },
        },
    ]



    
    const loadData = async () => {
        setLoading(false);
        let res = await FinanceServices.getFinanceVouchers(formData)
        if (res.status === 200) {
            setData(res.data.view.data)
            setTotalItems(res.data.view.totalItems)
        }
        console.log("Vouchers: ", res.data.view.data)
        setLoading(true)
    }

    const handleSubmit = () =>{
        setFormData({
            ...formData, 
            po_no: filterData.po_no,
            search: filterData.search,
            to: filterData.to,
            from: filterData.from,
            status: filterData.status,
            voucher_no: filterData.voucher_no,
            invoice_no:filterData.invoice_no
        }, ()=>{
            loadData()
        });
    }

    const printFunc = async (voucherId) => {

        console.log('chck incoming data',voucherId)

        let res = await FinanceServices.getVoucherPrint({}, voucherId)

        if(res.status === 200){
            console.log('chck incoming data 5',res.data.view)
            setVoucher(res.data.view) 
            getGrnforVoucher(res.data.view?.Document?.refference_id)
        }
    }

    const getGrnforVoucher = async(id) =>{

        console.log('chck incoming data 6',id)
        let params ={
            consignment_id: id,
            status:['APPROVED PARTIALLY COMPLETED', 'APPROVED COMPLETED']
        }

        let res = await ConsignmentService.getGRN(params)

        if (res.status === 200){
            console.log('check grn', res)
            let invoice_date = res.data.view.data[0]?.Consignment?.invoice_date
            let itemslist = res.data.view.data.map((dataset) => {
                return {
                    grn_No: dataset.grn_no,
                    grn_date: dataset.createdAt,
                  }
            })
            let uniquitemslist = [...new Set(itemslist)]

            // get uniq grn id s
            let grnIdList = res.data.view.data.map((dataset) => dataset.id )
            let uniqGrnId = [...new Set(grnIdList)]

            getGRNItemDetails(uniqGrnId)

            setGrnNumber(uniquitemslist)
            console.log('check invoice_date', res.data.view.data[0])
            console.log('checkgrn number det', uniqGrnId)
            setInvoiceDate(invoice_date)
        }
    }


    const getGRNItemDetails = async(idlist) =>{

        let params = {
            grn_id : idlist
        }

        let res = await ConsignmentService.getGRNItems(params)

        if (res.status === 200){
            console.log('checkgrn details', res)
            let item_code = res.data.view.data.map((dataset) => dataset?.ItemSnapBatch?.ItemSnap?.sr_no )
            let uniqSrNo = [...new Set(item_code)]
            let total_item_qty = res.data.view.data.reduce((accumulator, currentObject) => parseFloat(accumulator) + parseFloat(currentObject.quantity), 0)
            console.log('checkgrn sr no list', uniqSrNo)
            setSrNoList(uniqSrNo)
            setgrnQty(total_item_qty)
        }
    } 


    useEffect(() => {
        loadData()
    }, [formData])


    useEffect(() => {
        if(voucher) {
            console.log('chck incoming data 2',voucher)
            setPrintLoad(true);

            setTimeout(() => {
                document.getElementById('print_presc_0045').click()
                setPrintLoad(false)
            }, 3000);
        }
    }, [voucher])

    useEffect(() => {
        loadUser()
    }, [])

    const loadUser = async () => {
        let user_info = await localStorageService.getItem('userInfo')
        setUserRoles(user_info.roles)

    }


    const changeStatus = async (id, status) => {
        let user_info = await localStorageService.getItem('userInfo')

        const body = {
            status: status,
            ca_status: status,
            ca_remark: remark,
            ca_action_by: user_info.id,
            remark: remark
        }

        let res = await FinanceServices.FinanceVouchersUpdate(id, body)
        if (res.status && res.status == 200) {
            setAlert(true)
            setMessage('Submit Successfully')
            setSeverity('success')
            loadData()
        } else {
            setAlert(true)
            setMessage('Submit Unsuccessfull')
            setSeverity('error')

        }

    }

    return (
        <div className="w-full" style={{ padding: 30 }}>
            {/* <div className="w-full" style={{ marginBottom: 2, height: '40px' }}>
                Voucher View
            </div> */}
            <div
                className="w-full"
                style={{
                    paddingRight: 30,
                    paddingLeft: 30,
                    paddingBottom: 10,
                    backgroundColor: '#ffffff',
                    borderRadius: '15px',
                }}
            >
                <div className="w-full" style={{ paddingBottom: '40px', paddingTop: "20px" }}>
                    <CardTitle title={'Voucher View'} />
                    <br />
                    <ValidatorForm
                        // onSubmit ={()=>{
                        //     loadData()
                        // }}
                    >
                    <Grid container spacing={2}>
                        <Grid item xs={3} md={6} lg={3}>
                            <SubTitle title="Po Number" />
                            <TextValidator
                                className="w-full"
                                variant="outlined"
                                size="small"
                                placeholder='Po Number'
                              
                                onChange={(e) => {
                                    setFilter({
                                        ...filterData, 
                                        po_no:e.target.value,
                                    });
                                }}
                            />
                        </Grid>
                        <Grid item xs={3} md={6} lg={3}>
                            <SubTitle title="Voucher Number" />
                            <TextValidator
                                className="w-full"
                                variant="outlined"
                                size="small"
                                placeholder='Voucher Number'
                              
                                onChange={(e) => {
                                    setFilter({
                                        ...filterData, 
                                        voucher_no:e.target.value,
                                    });
                                }}
                            />
                        </Grid>
                        <Grid item xs={3} md={6} lg={3}>
                            <SubTitle title="Invoice Number" />
                            <TextValidator
                                className="w-full"
                                variant="outlined"
                                size="small"
                                placeholder='Invoice Number'
                              
                                onChange={(e) => {
                                    setFilter({
                                        ...filterData, 
                                        invoice_no:e.target.value,
                                    });
                                }}
                            />
                        </Grid>
                        {/* <Grid item xs={3} md={6} lg={3}>
                            <SubTitle title="Category" />
                            <TextValidator
                                className="w-10 "
                                variant="outlined"
                                size="small"
                                placeholder='Category'
                              
                                onChange={(e) => {
                                    setFormData({
                                        ...formData, 
                                        voucher_no:e.target.value,
                                    });
                                }}
                            />
                        </Grid> */}
                        <Grid item xs={3} md={6} lg={3}>
                            <SubTitle title="Status" />
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                size="small"
                                // ref={elmRef}
                                options={appConst.voucher_status_list}
                                onChange={(e, value) => {
                                    setFilter({
                                        ...filterData, 
                                        status:value.value,
                                    });
                                }}
                                
                                getOptionLabel={(option) =>
                                    option.label 
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Status"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={3} md={6} lg={3}>
                            <SubTitle title="From Date" />
                            <LoonsDatePicker className="w-full"
                                placeholder="From Date"
                                onChange={(date) => {
                                    setFilter({
                                        ...filterData, 
                                        from:date,
                                    });
                                }}
                                value={filterData.from}
                                format='dd/MM/yyyy'
                            />
                        </Grid>
                        <Grid item xs={3} md={6} lg={3}>
                            <SubTitle title="To Date" />
                            <LoonsDatePicker className="w-full"
                                placeholder="To Date"
                                onChange={(date) => {
                                    setFilter({
                                        ...filterData, 
                                        to:date,
                                    });
                                }}
                                value={filterData.to}
                                format='dd/MM/yyyy'
                            />
                        </Grid>
                        <Grid item xs={3} md={6} lg={3}>
                            <SubTitle title="Search" />
                            <TextValidator
                                className="w-full"
                                variant="outlined"
                                size="small"
                                placeholder='Search'
                              
                                onChange={(e) => {
                                    setFilter({
                                        ...filterData, 
                                        search:e.target.value,
                                    });
                                }}
                            />
                        </Grid>
                        <Grid item xs={3} className='mt-6'>
                            <Button type='submit' variant="contained" onClick={()=>{handleSubmit()}}>Search</Button>
                        </Grid>
                    </Grid>

                    </ValidatorForm>

                    {printLoad ?
                    <Grid>
                        {console.log('chck incoming data 1',invoiceDate)}
                        <VouchePrint voucherId={voucher} grnNumber={grnNo} invoiceDatepass={invoiceDate} sr_no={srNo}  grnQty={grnQty} />
                    </Grid>
                    : null} 
                </div>
                <Divider />
                {loading ?
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
                            ></LoonsTable></Grid></Grid> : (
                        <Grid className='justify-center text-center w-full pt-12'>
                            <CircularProgress size={30} />
                        </Grid>
                    )}
                {/* {data && (
                    <LoonsTable
                        id={'completed'}
                        data={data}
                        columns={columns}
                        
                    ></LoonsTable>
                )} */}
            </div>

            <LoonsSnackbar
                open={alert}
                onClose={() => {
                    setAlert(false)
                }}
                message={message}
                autoHideDuration={3000}
                severity={severity}
                elevation={2}
                variant="filled"
            ></LoonsSnackbar>
        </div>
    )
}

export default VoucherView
