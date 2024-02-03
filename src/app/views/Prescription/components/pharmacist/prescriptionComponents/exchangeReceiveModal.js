import React, { useEffect, useState } from 'react';
import { Checkbox, Dialog, DialogActions, DialogContentText, FormControlLabel, Grid, TextareaAutosize, TextField } from "@material-ui/core";
import { LoonsTable, MainTitle, Button } from 'app/components/LoonsLabComponents';
import CloseIcon from '@material-ui/icons/Close';
import WarehouseServices from 'app/services/WarehouseServices';
import DistributionCenterServices from 'app/services/DistributionCenterServices';
import ChiefPharmacistServices from 'app/services/ChiefPharmacistServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import localStorageService from 'app/services/localStorageService';
import { LoonsSnackbar } from 'app/components/LoonsLabComponents';
import { dateParse } from 'utils';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents';

const ExchangeReceiveModal = ({ open, setOpen, warehouse, pharmacy }) => {
    const [bExpiry1, setBExpiry1] = useState("");
    const [bExpiry2, setBExpiry2] = useState("");
    var [witems, setWitems] = useState([]);

    var [viewSnack, setViewSnack] = useState("");
    var [snackMassage, setSnackMassage] = useState("");
    var [severity, setSeverity] = useState("success");
    var [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        WarehouseServices.getSingleItemWarehouse({
            'warehouse_id': warehouse,
            'item_id': open.item_id,
            'exp_date_grater_than_zero': true,
            'quantity_grater_than_zero': true
        }).then((item) => {
            console.log("ALLOC", item.data.view.data);
            setWitems(item.data.view.data);
        })
    }, [open]);


    const offer = async () => {
        console.log("selected data", open)
        setSubmitting(true)
        var user = await localStorageService.getItem('userInfo');


        let formData = {

            "order_item_id": open.id,
            "activity": "ALLOCATED_ISSUED",
            "type": "ALLOCATED_ISSUED",
            "item_batch_bin_id": witems.filter(x => x.exchangequantity != undefined)[0].id,
            "volume": witems.filter(x => x.exchangequantity != undefined)[0].exchangequantity * witems.filter(x => x.exchangequantity != undefined)[0].volume,
            "remark_by": user.id,
            "quantity": 0,
            "warehouse_id": warehouse,
            "item_batch_id": witems.filter(x => x.exchangequantity != undefined)[0].item_batch_id,
            "bin_id": witems.filter(x => x.exchangequantity != undefined)[0].bin_id,
            "date": dateParse(new Date),
            "order_exchange_id": open.order_exchange_id,
            item_batch_allocation_data: []
        }

        let error = false;

        witems.forEach(element => {
            if (element.exchangequantity != undefined && element.exchangequantity != null && element.exchangequantity != 0) {
                formData.quantity = Number(formData.quantity) + Number(element.exchangequantity)

                console.log("my stock", element.quantity)
                console.log("orderd", element)
                if (Number(element.quantity) < Number(element.exchangequantity)) {
                    error = true;
                }

                formData.item_batch_allocation_data.push(
                    {
                        "quantity": element.exchangequantity,
                        "volume": element.volume,
                        "item_batch_bin_id": element.id,
                        "bin_id": element.bin_id

                    }
                )
            }
        });


        console.log("submitting form data", formData)

        if (formData.item_batch_allocation_data.length > 0) {

            if (error == false) {
                if (Number(open.request_quantity) < Number(formData.quantity)) {
                    setSeverity("error");
                    setSnackMassage("Cannot Issue More Than Ordered Qty");
                    setViewSnack(true)
                    setSubmitting(false)
                } else {
                    let res = await PharmacyOrderService.AddReceivedItemQuantity(formData);
                    if (201 == res.status) {
                        setSeverity("success");
                        setSnackMassage("Exchange Submit Success");
                        setViewSnack(true)
                        //setSubmitting(false)
                        window.location.reload()
                    } else {
                        setSeverity("error");
                        setSnackMassage("Exchange Submit Unsuccess");
                        setViewSnack(true)
                        setSubmitting(false)
                    }
                }

            } else {
                setSeverity("error");
                setSnackMassage("Cannot Issue More Than Stck Qty");
                setViewSnack(true)
                setSubmitting(false)
            }
        } else {
            setSeverity("error");
            setSnackMassage("There is no  Any Allocation");
            setViewSnack(true)
            setSubmitting(false)
        }



    }

    const rejectExchange = async () => {
        console.log("selected data", open)
        /* let formData = {
            "status": "Rejected"
        } */
        console.log("selected data", open)

        var user = await localStorageService.getItem('userInfo');


        let formData = {
            "status": "Rejected",
            "order_exchange_id": open.order_exchange_id,
            "created_by": user.id,
            "activity": "REJECTED",
            "type": "REJECTED",
            "warehouse_id": warehouse,
            "date": dateParse(new Date),
        }
        let res = await ChiefPharmacistServices.approveOrder(formData)
        if (201 == res.status) {
            setSeverity("success");
            setSnackMassage("Exchange Reject Success");
            setViewSnack(true)
        } else {
            setSeverity("error");
            setSnackMassage("Exchange Reject Unsuccess");
            setViewSnack(true)
        }

    }

    return <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={() => setOpen(false)}>
        <div style={{ padding: '2rem' }}>
            <ValidatorForm onSubmit={() => { offer() }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h6 style={{ margin: 0 }}>New Drug Exchange :</h6>
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
                        <Grid item xs={3}>
                            <p>Batch No</p>
                        </Grid>
                        <Grid item xs={3}>
                            <p>Expire date</p>
                        </Grid>
                        <Grid item xs={3}>
                            <p>My Qty</p>
                        </Grid>
                        <Grid item xs={3}>

                        </Grid>
                    </Grid>
                    {witems.map((witem, index) => <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <p>{witem.ItemSnapBatch.batch_no}</p>
                        </Grid>
                        <Grid item xs={3}>
                            <p>{dateParse(witem.ItemSnapBatch.exd)}</p>
                        </Grid>
                        <Grid item xs={3}>
                            <p>{Math.floor(witem.quantity)}</p>
                        </Grid>
                        <Grid item xs={3}>

                            <TextValidator variant="outlined" type="number" size="small"
                                // placeholder={wh.qty}
                                //value={witem.exchangequantity}
                                onChange={(e) => {
                                    console.log("editing", e.target.value)
                                    let witemstemp = witems;
                                    witemstemp[index].exchangequantity = e.target.value
                                    console.log("editing", witemstemp)
                                    setWitems(witemstemp)
                                }}
                            //validators={[`maxNumber:${witems[index].quantity}`]}
                            /*  errorMessages={[
                                 'Should less than Overall Qty'
                             ]} */
                            />

                        </Grid>
                    </Grid>)}
                </DialogContentText> : null}
                <DialogActions>
                    <Button size="small" variant="contained" style={{ background: '#ff005d', color: 'white' }} onClick={() => { rejectExchange() }}>Reject</Button>
                    <Button progress={submitting} size="small" variant="contained" style={{ background: '#00cbff', color: 'white' }} type="submit">Offer</Button>
                </DialogActions>

            </ValidatorForm>
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

export default ExchangeReceiveModal;