import React, { useEffect, useState } from 'react';
import { Checkbox, Dialog, DialogActions, DialogContentText, FormControlLabel, Grid, TextareaAutosize, TextField } from "@material-ui/core";
import { LoonsTable, MainTitle, Button } from 'app/components/LoonsLabComponents';
import CloseIcon from '@material-ui/icons/Close';
import WarehouseServices from 'app/services/WarehouseServices';
import DistributionCenterServices from 'app/services/DistributionCenterServices';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import localStorageService from 'app/services/localStorageService';
import { LoonsSnackbar } from 'app/components/LoonsLabComponents';
import { dateParse } from 'utils';

const ExchangeReceiveByMe = ({ open, setOpen, warehouse, pharmacy }) => {
    const [bExpiry1, setBExpiry1] = useState("");
    const [bExpiry2, setBExpiry2] = useState("");
    const [witems, setWitems] = useState([]);
    const [orderBatch, setOrderBatch] = useState([]);
    const [warehouseBin, setWarhouseBin] = useState(null);

    const [viewSnack, setViewSnack] = useState("");
    var [snackMassage, setSnackMassage] = useState("");
    var [severity, setSeverity] = useState("success");
    var [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        /*  WarehouseServices.getSingleItemWarehouse({
             'warehouse_id': warehouse,
             'item_id': open.item_id
         }).then((item) => {
             console.log("ALLOC", item.data.view.data);
             setWitems(item.data.view.data);
         }) */

        let filterData = {
            warehouse_id: warehouse
        }

        WarehouseServices.getAllWarehouseBins({
            'warehouse_id': warehouse
        }).then((item) => {
            console.log("warehouse bin", item.data.view.data[0].id);
            setWarhouseBin(item.data.view.data[0].id);
        })


        PharmacyOrderService.getOrderBatchItems({
            'warehouse_id': warehouse,
            order_exchange_id: open.order_exchange_id
        }).then((res) => {
            console.log("Order Item Batch Data", res.data.view.data)
            setOrderBatch(res.data.view.data);
        })


    }, [open]);


    const receive = async (item_batch) => {
        console.log("selected data", item_batch)

        var user = await localStorageService.getItem('userInfo');
        let formData = {

            "order_item_id": item_batch.order_item_id,
            "activity": "EXCHANGE RECEIVED",
            "type": "EXCHANGE RECEIVED",
            "item_batch_bin_id": item_batch.item_batch_bin_id,
            "volume": item_batch.volume,
            "remark_by": user.id,
            "quantity": item_batch.allocated_quantity,
            "warehouse_id": warehouse,
            "item_batch_id": item_batch.ItemSnapBatchBin.ItemSnapBatch.id,//not comming
            "bin_id": warehouseBin,
            "date": dateParse(new Date),
            "order_exchange_id": item_batch.OrderItem.order_exchange_id,
        }



        console.log("submitting form data", formData)

        let res = await PharmacyOrderService.AddReceivedItemQuantity(formData);
        if (201 == res.status) {
            setSeverity("success");
            setSnackMassage("Exchange Submit Success");
            setViewSnack(true)
            // window.location.reload()
        } else {
            setSeverity("error");
            setSnackMassage("Exchange Submit Unsuccess");
            setViewSnack(true)
        }

    }



    const receiveAll = async () => {
        setSubmitting(true)
        var user = await localStorageService.getItem('userInfo');
        let formData = {


            "order_exchange_id": open.order_exchange_id,
            "warehouse_id": warehouse,
            "type": "ALL RECEIVED",
            "date": dateParse(new Date),
            "createdBy": user.id

        }



        console.log("submitting form data", formData)

        let res = await DistributionCenterServices.issueOrder(formData);
        if (201 == res.status) {
            setSeverity("success");
            setSnackMassage("Exchange Receive Success");
            setViewSnack(true)
            setSubmitting(false)
            window.location.reload()
        } else {
            setSeverity("error");
            setSnackMassage("Exchange Receive Unsuccess");
            setViewSnack(true)
            setSubmitting(false)
        }

    }



    return <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={() => setOpen(false)}>
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h6 style={{ margin: 0 }}>New Drug Exchange Receiving :</h6>
                <MainTitle title={open?.OrderExchange?.fromStore?.name} />
                <div onClick={() => setOpen(false)} style={{ padding: 5, display: 'flex', justifyContent: 'center', cursor: 'pointer' }}><CloseIcon /></div>
            </div>
            {open ? <DialogContentText color='black'>
                <p>Drug Name : {open?.ItemSnap?.short_description}</p>
                {/* <p>Requesters Present Quantity  : {open.myStock}</p> */}

                <Grid container spacing={2} style={{ border: '1px solid #e0e0e0', marginBottom: '2em' }}>
                    <Grid item xs={6} style={{ borderRight: '1px solid #e0e0e0' }}>
                        <p style={{ fontSize: '0.8em' }}>Required Quantity : {open.request_quantity}</p>
                    </Grid>
                    <Grid item xs={6} style={{ borderRight: '1px solid #e0e0e0' }}>
                        <p style={{ fontSize: '0.8em' }}>Quantity in Hand : {open.my_stock}</p>
                    </Grid>
                    {/* <Grid item xs={4}>
                        <p style={{ fontSize: '0.8em' }}>Est. Consumption for Day : {open.optimalStock}</p>
                    </Grid> */}
                </Grid>

                <p>Offering Quantity</p>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <p>Batch No</p>
                    </Grid>
                    <Grid item xs={6}>
                        <p>Expire date</p>
                    </Grid>
                    <Grid item xs={2}>
                        <p>Issued Qty</p>
                    </Grid>
                    <Grid item xs={2}>
                        <p>Status</p>
                    </Grid>
                    {/*  <Grid item xs={1}>
                        <p>Action</p>
                    </Grid> */}
                </Grid>
                {orderBatch.map((witem, index) => <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <p>{witem.ItemSnapBatchBin.ItemSnapBatch.batch_no}</p>
                    </Grid>
                    <Grid item xs={6}>
                        <p>{dateParse(witem.ItemSnapBatchBin.ItemSnapBatch.exd)}</p>
                    </Grid>
                    <Grid item xs={2}>
                        <p>{witem.allocated_quantity}</p>
                    </Grid>
                    <Grid item xs={2}>
                        <p>{witem.OrderItem.status}</p>
                    </Grid>
                    {/* <Grid item xs={1}>
                        <Button className='mt-2' size="small" variant="contained" style={{ background: '#00cbff', color: 'white' }} onClick={() => { receive(witem) }}>Receive</Button>
                    </Grid> */}

                </Grid>)}
            </DialogContentText> : null}
            <DialogActions>
                {/*  <Button size="small" variant="contained" style={{ background: '#ff005d', color: 'white' }} onClick={() => { rejectExchange() }}>Reject</Button>
                <Button size="small" variant="contained" style={{ background: '#00cbff', color: 'white' }} onClick={() => { offer() }}>Offer</Button>
            */}

                <Button size="small" progress={submitting} variant="contained" style={{ background: '#00cbff', color: 'white' }} onClick={() => { receiveAll() }}>Receive All</Button>

            </DialogActions>
        </div>


        <LoonsSnackbar
            open={viewSnack}
            onClose={() => {
                setViewSnack(false)
            }}
            message={snackMassage}
            autoHideDuration={3000}
            severity={severity}
            elevation={2}
            variant="filled"
        ></LoonsSnackbar>
    </Dialog>
}

export default ExchangeReceiveByMe;