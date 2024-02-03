import React, { useEffect, useRef } from 'react';
import { Button, Checkbox, Dialog, DialogActions, DialogContentText, FormControlLabel, TextareaAutosize } from "@material-ui/core";
import ChiefPharmacistServices from "app/services/ChiefPharmacistServices";
import localStorageService from "app/services/localStorageService";
import { dateParse } from "utils";

const DispatchModal = ({ open, setOpen, selected_id, showSuccess, showError }) => {

    const remarkRef = useRef(null);

    const approveOrder = async (type) => {
        Promise.all(selected_id.map(async (id) => {
        const user = await localStorageService.getItem('userInfo');

        const approveOrder = {
            order_exchange_id: id,
            created_by: user.id,
            date: dateParse(new Date()),
            type: type,
        };

        const approve = await ChiefPharmacistServices.approveOrder(approveOrder);

        return approve;
        }))
        .then((results) => {
            console.log(`Success: ${results}`)
            setOpen(false);
            showSuccess();
        })
        .catch((error) => {
            console.log(`Error: ${error}`)
            setOpen(false);
            showError();
        });
    }

    return <Dialog open={open}
        onClose={() => setOpen(false)}>
        <div style={{ padding: '2rem' }}>
            <DialogContentText>
                Dispatch Order<br />
                Are you Sure to Dispatch this Order?
            </DialogContentText>
            <DialogActions>
                <Button size="small" variant="contained" style={{ background: '#ff005d', color: 'white' }} onClick={() => setOpen(false)}>Cancel</Button>
                <Button size="small" variant="contained" style={{ background: '#00cbff', color: 'white' }} onClick={() => approveOrder("DISPATCHED")}>Dispatch</Button>
            </DialogActions>
            <p style={{ fontSize: '0.8em' }}>Please note that dispatch orders will be removed from this context</p>
        </div>
    </Dialog>
}

export default DispatchModal;