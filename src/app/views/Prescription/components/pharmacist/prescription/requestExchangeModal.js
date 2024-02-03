import React, { useState } from 'react';
import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContentText, FormControlLabel, Grid, TextareaAutosize, TextField } from "@material-ui/core";
import { LoonsTable, MainTitle } from 'app/components/LoonsLabComponents';
import { withStyles } from "@material-ui/styles";
import CloseIcon from '@material-ui/icons/Close';
import WarehouseServices from 'app/services/WarehouseServices';
import HoverableText from 'app/components/HoverableText';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents';

const RequestExchangeModal = ({ open, setOpen, setMsg, pharmacy, warehouse }) => {
    const [totalReq, setTotalReq] = useState(0);
    const [warehouses, setWarehouses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const estimate = 10;

    const fetchWarehouses = () => {
        WarehouseServices.getOtherWareHouses({
            "item_id": open.drug_id,
            "warehouse_id": warehouse,
            "select_type": "PHARMACY_EXHANGE_REQUEST"
        })
            .then((wh) => {
                if (wh.data && wh.data.view) {
                    const arr = [];
                    wh.data.view.data.forEach((item) => { item.qty = 0; arr.push(item) });
                    setWarehouses(arr);
                } else {
                    setWarehouses([]);
                }
            })
    }

    const updateQty = (e, pos) => {
        const warehouseList = warehouses;
        warehouseList[pos].qty = e.target.value;
        setWarehouses([...warehouseList]);
        let tot = 0;
        warehouseList.forEach((wh) => tot += ((wh.qty) ? parseInt(wh.qty) : 0));
        setTotalReq(tot);
    }

    const requestExchange = () => {
        setIsLoading(true);
        let valid = true;
        const item_list = [];
        for (let i = 0; i < warehouses.length; i++) {
            if (Number(warehouses[i].qty) > Number(warehouses[i].total_quantity)) {
                valid = false;
            }
            if (warehouses[i].qty > 0) {
                item_list.push({
                    "request_quantity": warehouses[i].qty,
                    "item_id": open.drug_id,
                    "to": warehouses[i].warehouse_id,
                });
            }
        }
        if (!valid) {
            setMsg("Ordering quantities should be less than stock quantity");
            setIsLoading(false);
            return;
        } else {
            WarehouseServices.requestDrugExchange({
                "from": warehouse,
                "created_by": JSON.parse(localStorage.getItem('userInfo')).id,
                "type": "EXCHANGE2",
                "required_date": new Date().toISOString().split('T')[0],
                "item_list": item_list
            })
                .then((wh) => {
                    setIsLoading(false);
                    console.log("EXCHANGE OUT", wh);
                    setMsg("Exchange request submitted.");
                    setOpen(null);
                })
                .catch((e) => setIsLoading(false))

        }
    }

    useState(() => {
        if (open) {
            fetchWarehouses();
        }
        console.log("EXCHANGING", open);
    }, []);

    return <Dialog open={open !== null}
        onClose={() => setOpen(null)}>
        {open ? <div style={{ padding: '2rem' }}>

            <ValidatorForm onSubmit={() => !isLoading ? requestExchange() : null}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <MainTitle title="Request Drug Exchange" />
                <div onClick={() => setOpen(null)} style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}><CloseIcon /></div>
            </div>
            <DialogContentText color='black'>
                <p>Drug Name : {open.drug_name}</p><br />

                <Grid container spacing={2} style={{ border: '1px solid #e0e0e0', marginBottom: '2em' }}>
                    <Grid item xs={4} style={{ borderRight: '1px solid #e0e0e0' }}>
                        <p style={{ fontSize: '0.8em' }}>Required Quantity : {open.my_stock ? (Number(open.quantity) - Number(open.my_stock)) : open.quantity}</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: '1px solid #e0e0e0' }}>
                        <p style={{ fontSize: '0.8em' }}>Quantity in Hand : {open.my_stock ?? "-"}</p>
                    </Grid>
                    <Grid item xs={4}>
                        <p style={{ fontSize: '0.8em' }}>Est. Consumption/Day : {estimate}</p>
                    </Grid>
                </Grid>

                <Grid container spacing={2} style={{ border: '1px solid #DFDFDF', background: '#F2F2F2' }}>
                    <Grid item xs={6} style={{ borderRight: '1px solid #DFDFDF' }}>
                        <HoverableText bolded text="Request Point/Counter/Store" />
                    </Grid>
                    <Grid item xs={3} style={{ borderRight: '1px solid #DFDFDF' }}>
                        <HoverableText bolded text="Overall Qty" />
                    </Grid>
                    <Grid item xs={3}>
                        <HoverableText bolded text="Request Qty" />
                    </Grid>
                </Grid>
                {warehouses.map((wh, pos) => <Grid container spacing={2} style={{ border: '1px solid #DFDFDF' }}>
                    <Grid item xs={6} style={{ borderRight: '1px solid #DFDFDF', display: 'flex', alignItems: 'center' }}>
                        <HoverableText bolded text={wh.warehouse_name} />
                    </Grid>
                    <Grid item xs={3} style={{ borderRight: '1px solid #DFDFDF', display: 'flex', alignItems: 'center' }}>
                        <HoverableText bolded text={wh.total_quantity} />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator variant="outlined" type="number" size="small" placeholder={wh.qty}
                            value={wh.qty}
                            onChange={(e) => updateQty(e, pos)}
                            validators={[`maxNumber:${wh.total_quantity}`]}
                            errorMessages={[
                                'Should less than Overall Qty'
                            ]}
                        />
                    </Grid>
                </Grid>)}

                <p>Requested Quantity : {totalReq}</p>
            </DialogContentText>
            <DialogActions>
                <Button size="small" variant="contained" style={{ background: '#ff005d', color: 'white' }} onClick={() => setOpen(null)}>Discard Request</Button>
                <Button size="small" variant="contained" style={{ background: '#00cbff', color: 'white' }} type="submit" >{isLoading ? <CircularProgress size={15} color="primary" /> : "Request"}</Button>
            </DialogActions>
        </ValidatorForm>
        </div> : null
}
    </Dialog >
}

export default RequestExchangeModal;