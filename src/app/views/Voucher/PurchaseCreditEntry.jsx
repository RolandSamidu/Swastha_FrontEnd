import React, { useEffect, useState } from 'react'
import { Divider, Grid } from '@mui/material'
import { Stack } from '@mui/material'
import { Select } from '@mui/material'
import { MenuItem } from '@mui/material'
import { TextareaAutosize } from '@mui/material'
import { Button } from '@mui/material'
import { TextField } from '@mui/material'
import { dateParse } from 'utils'
import FinanceServices from 'app/services/FinanceServices'
import ConsignmentService from 'app/services/ConsignmentService'
import { SubTitle, LoonsTable } from 'app/components/LoonsLabComponents'
import { CircularProgress } from '@mui/material'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete, Dialog, DialogTitle } from '@mui/material'
import VoteTable from './VoteTable'
import IconButton from '@material-ui/core/IconButton'
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close'

const PurchaseCreditEntry = (props) => {
    const [remark, setRemark] = useState('')
    const [creditNoteAmount, setCreditNoteAmount] = useState(null)
    const [values, setValues] = useState({})
    const [formData, setFormData] = useState({
        consignment_id: null,
        limit: 10,
        page: 0
    })
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const [totalItems, setTotalItems] = useState(0)
    const [votesView, setVotesView] = useState(false)

    const [consingmentItemsLoaded, setConsingmentItemsLoaded] = useState(false)
    const [consingementItemsData, setConsingementItemsData] = useState(null)

    const [creditNoteAmountSuggestion, setCreditNoteAmountSuggestion] = useState(null)



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


    const consingmentItemsColumns = [
        {
            name: 'medium_description',
            label: 'Medium Description',
            options: {
                display: true,

            },
        },

        {
            name: 'sr_no',
            label: 'SR No',
            options: {
                display: true,

            },
        },
        {
            name: 'item_quantity',
            label: 'Item Quantity',
            options: {
                display: true,
                /* customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.status
                } */
            },
        },
        {
            name: 'grn_quantity',
            label: 'GRN Quantity',
            options: {
                display: true,
                /* customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.status
                } */
            },
        },
        
        {
            name: 'unit_price',
            label: 'Unit Price',
            options: {
                display: true,
                /* customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.status
                } */
            },
        },
        {
            name: 'difference',
            label: 'Difference',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {

                    let difference = Number(consingementItemsData[dataIndex]?.item_quantity) - Number(consingementItemsData[dataIndex]?.grn_quantity);
                    return isNaN(difference) ? "-" : difference

                }
            },
        },

        {
            name: 'difference in price',
            label: 'Price Difference',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {

                    let difference = (Number(consingementItemsData[dataIndex]?.item_quantity) - Number(consingementItemsData[dataIndex]?.grn_quantity)) * Number(consingementItemsData[dataIndex]?.unit_price);
                    return isNaN(difference) ? "-" : difference

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
    const renderDropdown = (name, id, options) => {
        return (
            <Select
                defaultValue={options[0]?.value}
                size="small"
                name={name}
                id={id}
            >
                {options.map((option) => {
                    return (
                        <MenuItem value={option?.value}>
                            {option?.label}
                        </MenuItem>
                    )
                })}
            </Select>
        )
    }

    const loadData = async () => {
        setLoading(false);
        if (props.id) {
            let res = await FinanceServices.getConsignmentByRefID(props.id)
            if (res.status === 200) {
                setValues(res.data.view)
                let tempFormData = formData
                tempFormData.consignment_id = res.data.view.id
                setFormData(tempFormData)
                loadGRN()
                loadConsingmentItems()

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

    const loadConsingmentItems = async () => {
        setConsingmentItemsLoaded(false)
        let params = {
            search_type: "ConsignmentGRNSum",
            //consignment_id: formData.consignment_id,
            consignment_id: 'b598a361-c7a3-4f85-8865-f9e384bbd624',
            //status:"COMPLETED",
            //grn_status: ["APPROVED COMPLETED", "APPROVED PARTIALLY COMPLETED"]
        }
        let res = await ConsignmentService.getConsignmentItems(params)
        if (res.status === 200) {
            setConsingementItemsData(res.data.view)
            calculateMismatchCost(res.data.view)
            setConsingmentItemsLoaded(true)
        }
        console.log('Consingment items', res.data.view)
    }


    const calculateMismatchCost = (data) => {
        let total_missmatch = 0

        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let difference = (Number(element?.item_quantity) - Number(element?.grn_quantity)) * Number(element?.unit_price);
            if (difference > 0) {
                total_missmatch = total_missmatch + difference
            }

        }

        let total_late_charges = props.data?.data?.total_late_charges ? Number(props.data?.data?.total_late_charges) : 0;

        setCreditNoteAmountSuggestion(total_missmatch + total_late_charges)
    }

    useEffect(() => {
        console.log("props data", props.data)
        loadData()
    }, [])
    return (
        <div>
            {loading ? (<>
                <div>PO No : {props.data.data.indent_no ? props.data.data.indent_no : "Not Available"}</div>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Stack spacing={2}>
                            {renderDetailCard('WHARF Ref No', props.data.data.warf_ref_no ? props.data.data.warf_ref_no : "Not Available")}
                            {renderDetailCard('Supplier Code', props.data.data.supplier_code ? props.data.data.supplier_code : 'Not Available')}
                        </Stack>
                    </Grid>
                    <Divider orientation="vertical" flexItem sx={{ mr: '-1px' }} />
                    <Grid item xs={4}>
                        <Stack spacing={2}>
                            {renderDetailCard('Invoice No', props.data.data.invoice_no ? props.data.data.invoice_no : 'Not Available')}
                            {renderDetailCard('Supplier Name', props.data.data.supplier_name ? props.data.data.supplier_name : 'Not Available')}
                        </Stack>
                    </Grid>
                    <Divider orientation="vertical" flexItem sx={{ mr: '-1px' }} />
                    <Grid item xs={4}>
                        <Stack spacing={2}>
                            {renderDetailCard('Invoice Date', props.data.data.date_and_time ? props.data.data.date_and_time : 'Not Available')}
                            {renderDetailCard('Supplier Address', props.data.data.supplier_address ? props.data.data.supplier_address : 'Not Available')}
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
                                    search: false,
                                    filter: false,
                                    print: false,
                                    download: false,
                                    viewColumns: false,
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


                {consingmentItemsLoaded ? (
                    <Grid container className="mt-5 pb-5" >
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="CONSINGMENT ITEMS" />
                            <Divider />
                            <LoonsTable
                                id={'completed'}
                                data={consingementItemsData}
                                columns={consingmentItemsColumns}
                                options={{
                                    pagination: false,
                                    serverSide: true,
                                    selectableRows: false,
                                    search: false,
                                    filter: false,
                                    print: false,
                                    download: false,
                                    viewColumns: false,
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


                {props.data?.data?.late_days > 0 ?
                    <Grid container alignItems={'center'} sx={{ minHeight: '40px' }} spacing={0} >
                        <Grid item > Late Days</Grid>
                        <Grid item > :</Grid>
                        <Grid item >{props.data?.data?.late_days}</Grid>
                    </Grid>
                    : null}

                {props.data?.data?.late_chrage_details?.map((item, index) => (


                    <Grid container>
                        <Grid item xs={4}>
                            <Grid container alignItems={'center'} sx={{ minHeight: '40px' }} spacing={0} >
                                <Grid item>{index + 1}. </Grid>
                                <Grid className='px-2' item > Type </Grid>
                                <Grid item > : </Grid>
                                <Grid item > {item.type} </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={4}>
                            <Grid container alignItems={'center'} sx={{ minHeight: '40px' }} spacing={0} >
                                <Grid className='px-2' item > Charge </Grid>
                                <Grid item > : </Grid>
                                <Grid item > {item.charge} </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={4}>
                            <Grid container alignItems={'center'} sx={{ minHeight: '40px' }} spacing={0} >
                                <Grid className='px-2' item> Amount </Grid>
                                <Grid item > : </Grid>
                                <Grid item > {item.amount} </Grid>
                            </Grid>
                        </Grid>



                    </Grid>

                ))}

                <Grid container className='mt-5'>

                    <Grid item xs={6}>

                        {/* <Grid container alignItems={'center'} sx={{ minHeight: '40px' }} spacing={0} >
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
                            <Grid item xs={5}> Debit Note Amount</Grid>
                            <Grid item xs={1}> :</Grid>
                            <Grid item xs={6}>{props.data?.final_value}</Grid>
                        </Grid>

                        <Grid container alignItems={'center'} sx={{ minHeight: '40px' }} spacing={0} >
                            <Grid item xs={5}> Late Charges</Grid>
                            <Grid item xs={1}> :</Grid>
                            <Grid item xs={6}>{props.data?.data?.total_late_charges}</Grid>
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
                                    <SubTitle title="Credit Note Amount"></SubTitle>
                                    <TextValidator
                                        className="w-full"
                                        //placeholder="Credit Note Amount"
                                        placeholder={creditNoteAmountSuggestion}
                                        name="creditNoteAmount"
                                        InputLabelProps={{ shrink: false }}
                                        value={creditNoteAmount}
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => setCreditNoteAmount(e.target.value)}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>

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
                                    // validators={['required']}
                                    // errorMessages={[
                                    //     'this field is required',
                                    // ]}
                                    />
                                </Grid>
                            </Grid>
                            <Button className='mt-2' variant="contained" type="submit">
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
                <VoteTable consingmentData={values} data={props.data ? props.data : null} creditNoteAmount={creditNoteAmount} remark={remark} setVotesView={setVotesView} callback={props.callback} />
            </Dialog>
        </div>
    )
}

export default PurchaseCreditEntry
