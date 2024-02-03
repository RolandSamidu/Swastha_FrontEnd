import React, { useEffect, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Autocomplete, Divider, Select } from '@mui/material'
import { Checkbox } from '@material-ui/core'
import { CardTitle, DatePicker, LoonsTable, LoonsDialogBox, SubTitle,LoonsSnackbar } from 'app/components/LoonsLabComponents'
import { Grid } from '@mui/material'
import { MenuItem } from '@mui/material'
import { TextField } from '@mui/material'
import { Button } from '@mui/material'
import ModalLG from 'app/components/Modals/ModalLG'
import PaymentVoucher from './PaymentVoucher'
import { TextareaAutosize } from '@mui/material'
import FinanceServices from 'app/services/FinanceServices'
import HospitalConfigServices from 'app/services/HospitalConfigServices'
import { CircularProgress } from '@mui/material'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { dateParse } from 'utils'
import localStorageService from 'app/services/localStorageService'

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

const CheckPrint = () => {
    const [snackBar, setSnackBar] = React.useState({
        severity: 'success',
        alert: false,
        message: ''
    })

    const [loading, setLoading] = useState(true)
    const [filterData, setFilterData] = useState({
        status: ["APPROVED"],
        payee_id: null,
        page: 0,
        limit: 10
    })
    const [totalItems, setTotalItems] = useState(0)
    const [allSuppliers, setAllSuppliers] = useState([])

    const [selectedItems, setSelectedItems] = useState([])
    const [selectedItemsAllData, setSelectedItemsAllData] = useState([])
    const [addChequeNumber, setAddChequeNumber] = useState(false)
    const [formData, setFormData] = useState({
        cheque_no: null,
        date: dateParse(new Date()),
        name: null,
        payee: null,
        total_amount: null,
        vouchers: null,
        created_by: null


    })



    const [data, setData] = useState([])
    const columns = [
        {
            name: '',
            label: '',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let isadded = selectedItems.filter((item) => item.id == data[dataIndex].id)

                    return <ValidatorForm>
                        <Checkbox
                            //defaultChecked={isadded.length == 1 ? true : false}
                            // checked={isadded.length == 1 ? true : false}
                            size="small"
                            color='primary'
                            onChange={() => {
                                let tempSelectedItems = selectedItems
                                if (!selectedItems.includes(data[dataIndex].id)) {
                                    tempSelectedItems.push(data[dataIndex].id);
                                    setSelectedItems(tempSelectedItems)

                                    let itemsAllData = selectedItemsAllData
                                    itemsAllData.push(data[dataIndex])
                                    setSelectedItemsAllData(itemsAllData)

                                    console.log("selected", selectedItems)

                                } else {
                                    let index = selectedItems.indexOf(data[dataIndex].id)
                                    selectedItems.splice(index, 1)
                                    setSelectedItems(selectedItems)

                                    selectedItemsAllData.splice(index, 1)
                                    setSelectedItemsAllData(selectedItemsAllData)



                                    console.log("selected", selectedItems)
                                }


                            }}

                        // checked={selectedItems.indexOf(data[dataIndex].id) !== -1? true : false}
                        // defaultChecked={selectedItems.indexOf(data[dataIndex].id) !== -1? true : false}
                        />
                    </ValidatorForm>
                },
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
            name: 'supplier',
            label: 'Supplier',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.Payee.name
                }
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
                        <ModalLG
                            title={'Payment Voucher - SPC'}
                            button={<VisibilityIcon sx={{ color: '#000' }} />}
                            actions={[
                                <Button variant="contained" color="success">
                                    Recommend & Approve
                                </Button>,
                                <Button variant="contained" color="error">
                                    Send For Corrections
                                </Button>,
                            ]}
                            close={
                                <Button variant="contained" color="error">
                                    Cancel
                                </Button>
                            }
                        >
                            <div>
                                <PaymentVoucher />
                                <div className="w-full">
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        placeholder="Remark"
                                        style={{
                                            width: '100%',
                                            padding: 10,
                                            borderRadius: 10,
                                        }}
                                    />
                                </div>
                            </div>
                        </ModalLG>
                    )
                },
            },
        },
    ]
    const loadData = async () => {
        setLoading(false);
        let res = await FinanceServices.getVouchersTotalPrint(filterData)
        if (res.status === 200) {
            setData(res.data.view.data)
            setTotalItems(res.data.view.totalItems)
        }
        console.log("Cheque Print: ", res.data.view.data)
        setLoading(true)
    }

    const LoadAllSuppliers = async () => {
        let params = { owner_id: '000' }

        let res = await HospitalConfigServices.getAllSuppliers(params)
        if (res.status) {
            console.log("all Suppliers", res.data.view.data)
            setAllSuppliers(res.data.view.data)
        }
    }


    /*  useEffect(() => {
         loadData()
     }, [filterData]) */

    useEffect(() => {
        LoadAllSuppliers()
    }, [])



    const createCheque = async () => {
        let total_amount = 0

        for (let index = 0; index < selectedItemsAllData.length; index++) {
            const element = selectedItemsAllData[index];
            total_amount = Number(total_amount) + Number(element.final_amount ? element.final_amount : 0)
        }
        setFormData({ ...formData, total_amount: total_amount, name: selectedItemsAllData[0].po_no })
        console.log("formData", formData)
        setAddChequeNumber(true)
    }

    const submit = async () => {
        let user_info = await localStorageService.getItem('userInfo')
        formData.payee = filterData.payee_id ? filterData.payee_id : selectedItemsAllData[0].Payee.id
        formData.created_by = user_info.id
        formData.vouchers = selectedItems
        setAddChequeNumber(false)
        console.log("formData", formData)
        /*   name: null,
              total_amount: null, */

        let res = await FinanceServices.getVouchersTotalPrint(formData)
        if (res.status === 200) {
            setSnackBar({
                alert: true,
                message: "Cheque has been Created Successfully",
                severity: 'success'
            })
        } else {
            setSnackBar({
                alert: true,
                message: "Failed to Create Cheque",
                severity: 'error'
            })
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
                    <CardTitle title="Voucher Cheque View" />
                    <br />
                    <ValidatorForm >
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
                                {renderDetailCard(
                                    'Supplier',
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={allSuppliers}
                                        getOptionLabel={(option) => option.name}
                                        value={allSuppliers.find((v) => v.id == filterData.payee_id)}
                                        onChange={(event, value) => {

                                            setFilterData({
                                                ...filterData, // spread previous state object
                                                payee_id: value.id, // overwrite page property
                                            });
                                        }

                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Supplier"
                                                //variant="outlined"
                                                //value={}
                                                value={filterData.payee_id}
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                size="small"
                                            //validators={['required']}
                                            //errorMessages={['this field is required']}
                                            />
                                        )}
                                    />
                                )}
                            </Grid>

                            <Grid item xs={3}>
                                <Button variant="contained" onClick={() => { loadData() }}>Search</Button>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
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
                                rowsPerPage: filterData.limit,
                                page: filterData.page,
                                selectableRows: false,
                                onTableChange: (action, tableSate) => {
                                    switch (action) {
                                        case 'changePage':
                                            setFilterData({
                                                ...filterData, // spread previous state object
                                                page: tableSate.page, // overwrite page property
                                            });
                                            loadData()
                                            break;
                                        case 'changeRowsPerPage':
                                            setFilterData({
                                                ...filterData,
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
                <div
                    className="w-full"
                    style={{
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        padding: '30px',
                    }}
                >
                    <Button variant="contained" color="success" onClick={() => { createCheque() }}>
                        Create Cheque
                    </Button>
                </div>
            </div>



            <LoonsDialogBox
                title="Please Enter Cheque Number"
                show_alert={false}
                alert_severity="info"
                alert_message={"Please Enter Cheque Number"}
                body_children={


                    <ValidatorForm onSubmit={() => {
                        submit()
                    }}>

                        <SubTitle title={"Total Amount : " + formData.total_amount}></SubTitle>
                        <TextValidator
                            className="mt-2"
                            placeholder="Cheque Number"
                            //variant="outlined"
                            //value={}
                            value={formData.cheque_no}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            size="small"
                            onChange={(e, value) => {

                                setFormData({
                                    ...formData,
                                    cheque_no: e.target.value,
                                });
                            }}
                        //validators={['required']}
                        //errorMessages={['this field is required']}
                        />
                        <Button className='mt-2' type='submit' variant="outlined" color="primary">
                            Submit
                        </Button>
                    </ValidatorForm>
                }
                //message="testing 2"
                open={addChequeNumber}
                //open={true}
                show_button={false}
                show_second_button={false}
                btn_label="Ok"
                onClose={() => {
                }}

            >

            </LoonsDialogBox>

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
        </div>
    )
}

export default CheckPrint
