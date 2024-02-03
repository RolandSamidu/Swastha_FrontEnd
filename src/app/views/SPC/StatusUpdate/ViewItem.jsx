import React, { useRef, useContext, useState, useEffect } from 'react'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import Typography from '@material-ui/core/Typography'
import { Grid, Tooltip, Chip, Breadcrumbs, Link, Icon, IconButton, Divider, Dialog } from '@material-ui/core'
import StepButton from '@material-ui/core/StepButton';
import {
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    LoonsTable,
    LoonsSnackbar,
    Button,
} from 'app/components/LoonsLabComponents'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { dateFormatter } from 'globalize'
import { convertTocommaSeparated, dateParse, dateTimeParse } from 'utils'
import VisibilityIcon from '@material-ui/icons/Visibility';
// import PODetails from './Componets/PODetails'
import DebitNoteDetails from './Componets/DebitNoteDetails'
import ConsignmentDetails from './Componets/ConsignmentDetails'
import PODetails from './Componets/PODetails'
import ConfirmationDialog from 'app/components/ConfirmationDialog/ConfirmationDialog'

import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@mui/material'
import * as appconst from '../../../../appconst'
import History from './Componets/History'
import SPCServices from 'app/services/SPCServices'
import localStorageService from 'app/services/localStorageService'


export default function ViewItem({ data, onClose }) {

    const [updateStatus, setUpdateStatus] = useState(false)
    const [selectedStatus, setselectedStatus] = useState("")
    const [remark, setremark] = useState("")
    const [alert, setAlert] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState('success')

    const [loading, setloading] = useState(false)

    const [history, setHistory] = useState()

    const [historyLoaded, sethistoryLoaded] = useState(false)


    async function updateItem() {
        var user = await localStorageService.getItem('userInfo')

        var id = user.id
        setloading(true)
        SPCServices.updatePoOrderListItem(data.id, { status: selectedStatus, change_by: id, spc_remark: remark })
            .then((res) => {
                console.log('res', res)
                if (res.status == 200 || res.status == 201) {

                    setMessage("Order List item Updated  Successfully")
                    setSeverity('success')
                    setAlert(true)
                    setUpdateStatus(false)
                    setTimeout(() => {
                        onClose()
                    }, 1000);
                    setloading(false)
                } else {
                    setMessage(res.error ?? "Order List item Update Unsuccessful")
                    setSeverity('error')
                    setAlert(true)
                    setUpdateStatus(false)
                    setloading(false)
                }

            }).catch(err => {
                console.log("error ***", err)
                setMessage("Order List Update Unsuccessful")
                setSeverity('error')
                setAlert(true)
                setloading(false)
            })



    }

    useEffect(() => {
        loadHistory()
    }, [data])

    async function loadHistory() {
        sethistoryLoaded(false)
        SPCServices.getPOItemHistory({ order_list_item_id: data.id })
            .then((res) => {
                console.log('res', res)
                if (res.status == 200 || res.status == 201) {

                    const sortedArray = res.data.view.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));


                    setHistory(sortedArray)
                    sethistoryLoaded(true)

                } else {
                    setMessage(res.error ?? "History Load eror")
                    setSeverity('error')
                    setAlert(true)
                    setUpdateStatus(false)
                    setloading(false)
                }

            }).catch(err => {
                console.log("error ***", err)
                setMessage("History Load eror")
                setSeverity('error')
                setAlert(true)
                setloading(false)
            })
    }



    return (

        <Grid
            container
            style={{ marginTop: '1rem', marginBottom: '1rem' }}
        >
            <Grid
                className=" w-full"
                item
                lg={3}
                md={4}
                sm={12}
                xs={12}
            >
                <SubTitle title="SR Number" />
                <Typography className='text-12 text-black font-normal my-2'>{data ? data.ItemSnap.sr_no : "-"}</Typography>

            </Grid>
            <Grid
                className=" w-full"
                item
                lg={3}
                md={4}
                sm={12}
                xs={12}
            >
                <SubTitle title="SR Name" />
                <Typography className='text-12 text-black font-normal my-2'>{data ? data.ItemSnap.short_description : "-"}</Typography>

            </Grid>
            <Grid
                className=" w-full"
                item
                lg={3}
                md={4}
                sm={12}
                xs={12}
            >
                <SubTitle title="SR Status" />
                <Typography className='text-12 text-black font-normal my-2'>{data ? data.status : "-"}</Typography>

            </Grid>
            <Grid
                className=" flex flex-column justify-end"
                item
                lg={3}
                md={4}
                sm={12}
                xs={12}
            >
                <Button
                    className='py-2'
                    variant="contained"
                    color="primary"
                    type="submit"
                    size='large'
                    startIcon={<Icon>system_update_alt</Icon>}
                    onClick={() => {
                        setUpdateStatus(true)
                    }}
                >
                    Update
                </Button>

                {historyLoaded &&
                    <div className='flex w-full justify-end mt-2 items-center ' >
                        <Tooltip title="Click to view history">
                            <History data={history} />
                        </Tooltip>
                    </div>
                }






            </Grid>


            <Grid item xs={12}>
                <Typography className='text-18 font-bold mt-3'>Order List Details</Typography>
            </Grid>

            {/* <Grid item xs={12}>
                <LoonsTable
                    id={'allPurchaseOrder'}
                    // title="Order List Details"
                    data={tableData}
                    columns={columns}

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
            </Grid> */}

            <Grid item xs={12}>

                <Divider className='my-4' />

            </Grid>

            <Grid item xs={12}>
                <div className='bg-light-primary border-radius-8 p-4 w-full'>
                    <Grid container spacing={2}>
                        <Grid
                            className=" w-full"
                            item
                            lg={3}
                            md={4}
                            sm={12}
                            xs={12}
                        >
                            <SubTitle title="Order List Number" />
                            <Typography className='text-12 text-primary font-normal my-2'>{data ? data.OrderList.order_no : "-"}</Typography>

                        </Grid>
                        <Grid
                            className=" w-full"
                            item
                            lg={3}
                            md={4}
                            sm={12}
                            xs={12}
                        >
                            <SubTitle title="Order Type" />
                            <Typography className='text-12 text-primary font-normal my-2'>{data ? data.OrderList.type : "-"}</Typography>

                        </Grid>
                        <Grid
                            className=" w-full"
                            item
                            lg={3}
                            md={4}
                            sm={12}
                            xs={12}
                        >
                            <SubTitle title="Order for Year" />
                            <Typography className='text-12 text-primary font-normal my-2'>{data ? data.OrderList.order_for_year : "-"}</Typography>

                        </Grid>
                        <Grid
                            className=" w-full"
                            item
                            lg={3}
                            md={4}
                            sm={12}
                            xs={12}
                        >
                            <SubTitle title="Order Date" />
                            <Typography className='text-12 text-primary font-normal my-2'>{data ? dateParse(data.OrderList.order_date) : "-"}</Typography>

                        </Grid>
                        <Grid
                            className=" w-full"
                            item
                            lg={3}
                            md={4}
                            sm={12}
                            xs={12}
                        >
                            <SubTitle title="Order Date to" />
                            <Typography className='text-12 text-primary font-normal my-2'>{data ? dateParse(data.OrderList.order_date_to) : "-"}</Typography>

                        </Grid>
                        <Grid
                            className=" w-full"
                            item
                            lg={3}
                            md={4}
                            sm={12}
                            xs={12}
                        >
                            <SubTitle title="Order Quantity" />
                            <Typography className='text-12 text-primary font-normal my-2'>{data ? convertTocommaSeparated(data.quantity, 2) : "-"}</Typography>

                        </Grid>
                        <Grid
                            className=" w-full"
                            item
                            lg={3}
                            md={4}
                            sm={12}
                            xs={12}
                        >
                            <SubTitle title="Status" />
                            <Typography className='text-12 text-primary font-normal my-2'>{data ? data.OrderList.status : "-"}</Typography>

                        </Grid>


                    </Grid>


                </div>

            </Grid>
            <Grid item xs={12} className='mt-3'>

            </Grid>
            <Grid item xs={12}>
                <Typography className='text-18 font-bold mt-3'>PO Details</Typography>
                <Divider />
                <PODetails order_no={data?.OrderList.order_no} />
            </Grid>
            <Grid item xs={12} className='mt-3'>

            </Grid>
            <Grid item xs={12}>
                <Typography className='text-18 font-bold mt-3'>Consignment Details</Typography>
                <Divider />
                <ConsignmentDetails order_no={data?.OrderList.order_no} />
            </Grid>
            <Grid item xs={12} className='mt-3'>

            </Grid>
            <Grid item xs={12}>
                <Typography className='text-18 font-bold mt-3'>Debit Note Details</Typography>
                <Divider />
                <DebitNoteDetails order_no={data?.OrderList.order_no} />
            </Grid>

            <Dialog maxWidth="md" open={updateStatus} onClose={() => setUpdateStatus(false)}>
                <ValidatorForm
                    className="pt-2"
                    onSubmit={() => updateItem()}
                    onError={() => null}
                >
                    <div className="p-8 text-left min-w-750 mx-auto">
                        <h4 className="capitalize m-0 mb-4">Update Status</h4>
                        <div className='flex flex-column w-full'>
                            <Autocomplete
                                // disableClearable
                                options={appconst.common_status_of_items}
                                getOptionLabel={(option) => option}
                                // id="disable-clearable"
                                onChange={(e, val) => { setselectedStatus(val) }}
                                value={selectedStatus}
                                size='small'
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Please type Status Name for search"
                                        fullWidth
                                        variant="outlined"
                                        size="small"

                                    />
                                )}

                            />
                            <TextValidator
                                multiline
                                rows={4}
                                className=" w-full"
                                placeholder="Remark"
                                name="remark"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                value={
                                    remark
                                }
                                type="text"
                                variant="outlined"
                                size="small"
                                onChange={(e) => {
                                    setremark((e.target.value == "" || e.target.value == null) ? "" : e.target.value)
                                }}

                            />

                        </div>

                        <div className="flex justify-end pt-2 m-1">
                            <Button
                                progress={loading}
                                className=" rounded hover-bg-primary px-6"
                                variant="outlined"
                                color="primary"
                                type='submit'
                            >
                                Change Status
                            </Button>
                            <Button
                                className="ml-1 rounded hover-bg-secondary px-6"
                                variant="outlined"
                                color="secondary"
                                onClick={() => { setUpdateStatus(false) }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </ValidatorForm>
            </Dialog>

            <LoonsSnackbar
                open={alert}
                onClose={() => {
                    setAlert(false)
                }}
                message={message}
                autoHideDuration={1200}
                severity={severity}
                elevation={2}
                variant="filled"
            ></LoonsSnackbar>


        </Grid>


    )
}
