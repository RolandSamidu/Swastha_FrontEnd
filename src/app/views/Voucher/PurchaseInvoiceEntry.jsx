import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { Stack } from '@mui/material'
import { Select } from '@mui/material'
import { MenuItem } from '@mui/material'
import { TextareaAutosize } from '@mui/material'
import { Divider } from '@mui/material'
import ModalXL from 'app/components/Modals/ModalXL'
import ModalLG from './../../components/Modals/ModalLG'
import VoteTable from './VoteTable'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'

import FinanceServices from 'app/services/FinanceServices'
import ConsignmentService from 'app/services/ConsignmentService'
import { CircularProgress } from '@mui/material'
import { dateParse } from 'utils'
import { LoonsTable, SubTitle, Button } from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Typography,
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const PurchaseInvoiceEntry = (props) => {
    const [remark, setRemark] = useState('')
    const [values, setValues] = useState({})
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const [formData, setFormData] = useState({
        consignment_id: null,
        limit: 10,
        page: 0
    })
    const [totalItems, setTotalItems] = useState(0)
    const [votesView, setVotesView] = useState(false)

    const columns = [
        {
            name: 'grn_no',
            label: 'GRN No',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.grn_no
                }
            },
        },

        {
            name: 'grn_date',
            label: 'GRN Date',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return dateParse(data[dataIndex]?.createdAt)
                }
            },
        },
        {
            name: 'status',
            label: 'Status',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.status
                }
            },
        },
        {
            name: 'Action',
            label: 'Action',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return (
                        <Grid container spacing={2} className="mt-5">
                            <IconButton
                                onClick={() => {
                                    window.open(`/consignments/grn-items/${data[dataIndex].id}`, "_blank").focus();

                                }}>
                                <VisibilityIcon color='primary' />
                            </IconButton>
                        </Grid>
                    )
                }
            },
        },
    ]

    const renderDetailCard = (label, value) => {
        return (
            <Grid
                container
                alignItems={'center'}
                sx={{ minHeight: '40px' }}
                spacing={0}
            >
                <Grid item xs={5}>
                    {label}
                </Grid>
                <Grid item xs={1}>
                    :
                </Grid>
                <Grid item xs={6}>
                    {value}
                </Grid>
            </Grid>
        )
    }

    const loadData = async () => {
        setLoading(false);
        console.log('props data print', props.data.data)
        if (props.id) {
            let res = await FinanceServices.getConsignmentByRefID(props.id)
            if (res.status === 200) {
                setValues(res.data.view)
                console.log("consingment Data", res.data.view)

                let tempFormData = formData
                tempFormData.consignment_id = res.data.view?.id
                setFormData(tempFormData)
                loadGRN()
            }
            console.log('DATA: ', res.data.view)
        }
        setLoading(true)
    }

    const loadGRN = async () => {
        setTableLoading(false);
        let res = await ConsignmentService.getGRN(formData)
        if (res.status === 200) {
            setData(res.data.view.data)
            setTotalItems(res.data.view.totalItems)
        }
        console.log('GRN: ', res.data.view.data)
        setTableLoading(true)
    }


    useEffect(() => {
        //loadGRN()
    }, [formData])

    useEffect(() => {
        loadData()
    }, [])

    return (
        <div>
            {loading ? (<>
                <div>PO No : {props.data.data?.po ? props.data?.data?.po : "Not Available"}</div>
                <div>Order List No : {props.data.data?.order_list_no ? props.data?.data?.order_list_no : "Not Available"}</div>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Stack spacing={2}>
                            {renderDetailCard('WHARF Ref No', props.data.data?.warf_ref_no ? props.data?.data?.warf_ref_no : "Not Available")}
                            {renderDetailCard('Supplier Code', props.data?.data?.supplier_code ? props.data?.data?.supplier_code : 'Not Available')}
                            {renderDetailCard('debit Note No', props.data?.data?.debit_note_no ? props.data?.data?.debit_note_no : 'Not Available')}
                            {renderDetailCard('Value(' + props.data?.data?.currency + ')', props.data?.data?.values_in_currency ? props.data?.data?.values_in_currency : 'Not Available')}

                        </Stack>
                    </Grid>
                    <Divider orientation="vertical" flexItem sx={{ mr: '-1px' }} />
                    <Grid item xs={4}>
                        <Stack spacing={2}>
                            {renderDetailCard('Invoice No', props.data?.data?.invoice_no ? props.data?.data?.invoice_no : 'Not Available')}
                            {renderDetailCard('Supplier Name', props.data?.data?.supplier_name ? props.data?.data?.supplier_name : 'Not Available')}
                            {renderDetailCard('WDN No', props.data.data?.wdn_no ? props.data?.data?.wdn_no : "Not Available")}
                            {renderDetailCard('Exchange Rate', props.data?.data?.exchange_rate ? props.data?.data?.exchange_rate : 'Not Available')}


                        </Stack>
                    </Grid>
                    <Divider orientation="vertical" flexItem sx={{ mr: '-1px' }} />
                    <Grid item xs={4}>
                        <Stack spacing={2}>
                            {renderDetailCard('Invoice Date', props.data?.data?.date_and_time ? props.data?.data?.date_and_time : 'Not Available')}
                            {renderDetailCard('Supplier Address', props.data?.data?.supplier_address ? props.data?.data?.supplier_address : 'Not Available')}
                            {renderDetailCard('Indent No', props.data?.data?.indent_no ? props.data?.data?.indent_no : 'Not Available')}
                            {renderDetailCard('Value(LKR)', props.data?.data?.values_in_lkr ? props.data?.data?.values_in_lkr : 'Not Available')}

                        </Stack>
                    </Grid>
                </Grid>
                <br />
                {tableLoading ? (
                    <Grid container className="mt-5 pb-5">
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="GRN INFO" />
                            <Divider className='mt-2' />
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
                    </Grid>
                ) :
                    (
                        <Grid className='justify-center text-center w-full pt-12'>
                            <CircularProgress size={30} />
                        </Grid>
                    )
                }
                <Divider />




                <Grid container className='mt-5'>

                    <Grid item xs={6}>

                        {/*  <Grid container alignItems={'center'} sx={{ minHeight: '40px' }} spacing={0} >
                            <Grid item xs={5}> Return PO</Grid>
                            <Grid item xs={1}> :</Grid>
                            <Grid item xs={6}>0</Grid>
                        </Grid>

                        <Grid container alignItems={'center'} sx={{ minHeight: '40px' }} spacing={0} >
                            <Grid item xs={5}> Return PO Value</Grid>
                            <Grid item xs={1}> :</Grid>
                            <Grid item xs={6}>0</Grid>
                        </Grid> */}

                        <Grid container alignItems={'center'} sx={{ minHeight: '40px' }} spacing={0} >
                            <Grid item xs={5}> Consingment Status</Grid>
                            <Grid item xs={1}> :</Grid>
                            <Grid item xs={6}>{values.status}</Grid>
                        </Grid>
                        <Grid container alignItems={'center'} sx={{ minHeight: '40px' }} spacing={0} >
                            <Grid item xs={5}> Debit Note Amount</Grid>
                            <Grid item xs={1}> :</Grid>
                            <Grid item xs={6}>{props.data?.final_value}</Grid>
                        </Grid>



                    </Grid>

                    <Grid item xs={6}>
                        <ValidatorForm
                            onSubmit={() => setVotesView(true)}
                            onError={() => null}
                            className="w-full"
                        >
                            <Grid container>
                                {/* <Grid item xs={12}>

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        // ref={elmRef}
                                        options={["Yes", "No"]}
                                        onChange={(e, value) => {

                                        }}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Discount Applicable"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />

                                </Grid> */}

                                <Grid item xs={12}>
                                    <SubTitle title="Remark"></SubTitle>
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Remark"
                                        name="remark"
                                        InputLabelProps={{ shrink: false }}
                                        value={remark}
                                        type="text"
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => setRemark(e.target.value)}
                                    /* validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]} */
                                    />
                                </Grid>
                            </Grid>
                            <Button className="mt-2" variant="contained" type="submit">
                                Add Votes
                            </Button>
                        </ValidatorForm>
                    </Grid>
                </Grid>
                <Grid>

                </Grid>
            </>)
                : (
                    <Grid className='justify-center text-center w-full pt-12'>
                        <CircularProgress size={30} />
                    </Grid>
                )}
            <Dialog maxWidth="lg " open={votesView}>
                <DialogTitle
                    style={{
                        borderBottom: '1px solid #000',
                    }}
                >
                    Votes
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
                            setVotesView(false)
                        }}
                    >
                        <CloseIcon
                            style={{ color: 'white', width: 14, height: 14 }}
                        />
                    </div>
                </DialogTitle>
                <VoteTable consingmentData={values} data={props.data ? props.data : null} remark={remark} setVotesView={setVotesView} callback={props.callback} />
            </Dialog>
        </div>
    )
}

export default PurchaseInvoiceEntry
