import React, { useEffect, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Autocomplete, Checkbox, Divider, Select } from '@mui/material'
import { CardTitle, DatePicker, LoonsTable, LoonsSnackbar } from 'app/components/LoonsLabComponents'
import { Grid } from '@mui/material'
import { MenuItem } from '@mui/material'
import { TextField } from '@mui/material'
import { Button } from '@mui/material'
import ModalLG from 'app/components/Modals/ModalLG'
import { TextareaAutosize } from '@mui/material'
import FinanceServices from 'app/services/FinanceServices'
import { CircularProgress } from '@mui/material'
import { dateParse} from 'utils'
import { IconButton } from '@material-ui/core'
import localStorageService from 'app/services/localStorageService'
import ChequePrint from './Print/ChequePrint'


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

const CheckView = () => {


    const [selectedItem, setSelectedItem] = useState(null);
    const [remark, setRemark] = useState(null);
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState('success');
    const [loginUserRoles, setUserRoles] = useState(null);
    const [loginUserName, setUserName] = useState(null);


    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        page: 0,
        limit: 20,
        'order[0]': ['createdAt', 'DESC'],
    })

    const [totalItems, setTotalItems] = useState(0)

    const [data, setData] = useState([])
    const columns = [
        {
            name: '',
            label: '',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return <Checkbox />
                },
            },
        },
        {
            name: 'cheque_no',
            label: 'Cheque Number',
            options: {
                display: true,
            },
        },

        {
            name: 'createdAt',
            label: 'Created Date',
            options: {
              display: true,
              customBodyRenderLite: (dataIndex) => {
                return dateParse(data[dataIndex].createdAt)
                }
            },
        },
        {
            name: 'name',
            label: 'Supplier',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.Payee?.name
                    }
            },
        },

        {
            name: 'total_amount',
            label: 'Amount',
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
                            title={'Cheque Approval'}
                            button={
                                <>
                                <IconButton>
                                    <VisibilityIcon sx={{ color: '#000' }} onClick={() => {
                                        setSelectedItem(data[dataIndex])
                                    }} />
                                </IconButton>
                                </>
                            }

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
                                    <Grid item xs={3}>Cheque No</Grid>
                                    <Grid item xs={1}>:</Grid>
                                    <Grid item xs={8}>{selectedItem?.cheque_no}</Grid>
                                    
                                </Grid>

                                <Grid
                                    container
                                    alignItems={'center'}
                                    sx={{ minHeight: '40px' }}
                                    spacing={0}
                                >
                                    <Grid item xs={3}>Amount</Grid>
                                    <Grid item xs={1}>:</Grid>
                                    <Grid item xs={8}>{selectedItem?.total_amount}</Grid>
                                    
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
                                    {loginUserRoles?.includes("Chief Accountant") &&
                                        <Grid container spacing={2} >
                                            <Grid item>
                                                <Button variant="contained" className="button-success"
                                                    onClick={() => {
                                                        changeCheque(data[dataIndex]?.id, "APPROVED")
                                                    }}
                                                >
                                                    Recommend & Approve
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" className="button-warning"
                                                    onClick={() => {
                                                        changeCheque(data[dataIndex]?.id, "CORRECTIONS NEEDED")
                                                    }}
                                                >
                                                    Send For Corrections
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" className="button-danger"
                                                    onClick={() => {
                                                        changeCheque(data[dataIndex]?.id, "REJECTED")
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
                        <IconButton>
                            <ChequePrint 
                                chequeNo={data[dataIndex]?.cheque_no} 
                                amount={data[dataIndex]?.total_amount} 
                                payer={data[dataIndex]?.Payee?.name} 
                                address={data[dataIndex]?.Payee?.address}
                                createdBy={data[dataIndex]?.CreateBy?.name} 
                                approvedBy={data[dataIndex]?.AprroveBy?.name}
                                printedBy={loginUserName}
                                
                            />
                        </IconButton>
                    </div>
                    )
                },
            },
        },
    ]

    useEffect(() => {
        loadData()
    }, [formData])
    

    useEffect(() => {
        loadUser()
    }, [])

    // set user role
    const loadUser = async () => {
        let user_info = await localStorageService.getItem('userInfo')
        setUserRoles(user_info.roles)
        setUserName(user_info.name)

    }

    const changeCheque = async (id, status) => {
        let user_info = await localStorageService.getItem('userInfo')

        const body = {
            status: status,
            approve_by:user_info?.id,
            approve_remark:remark,
        }

        let res = await FinanceServices.changeCheque(id, body)
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


    const loadData = async () => {
        setLoading(false);
        let res = await FinanceServices.getFinanceCheques(formData)
        if (res.status === 200) {
            console.log('er', res.data.view.data)
            // setData(res.data.view.data)
            setData(res.data.view.data)
            
            setTotalItems(res.data.view.totalItems)
        }
        console.log("Cheque Print: ", res.data.view.data)
        setLoading(true)
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
                    <CardTitle title="Cheque View" />
                    <br />
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            {renderDetailCard(
                                'PO Number',
                                renderDropdown('po_no', 'po_no', [
                                    { label: '32445', value: '32445' },
                                    { label: '34533', value: '34533' },
                                    { label: '66554', value: '66554' },
                                ])
                            )}
                        </Grid>
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
                        <Grid item xs={3}>
                            {renderDetailCard(
                                'Cheque Number',
                                renderDropdown('po_no', 'po_no', [
                                    { label: '32445', value: '32445' },
                                    { label: '34533', value: '34533' },
                                    { label: '66554', value: '66554' },
                                ])
                            )}
                        </Grid>
                        <Grid item xs={3}>
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
                        </Grid>
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
                </div>
                <Divider />
                {loading ? <Grid container className="mt-5 pb-5">
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
                        ></LoonsTable>
                    </Grid>
                </Grid> : (
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
                {/* <div
                    className="w-full"
                    style={{
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        padding: '30px',
                    }}
                >
                    <Button variant="contained" color="success">
                        Print Cheque
                    </Button>
                </div> */}
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

export default CheckView
