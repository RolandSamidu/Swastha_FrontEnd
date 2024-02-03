import React, { useState } from 'react';
import { Button, Checkbox, Dialog, DialogActions, DialogContentText, FormControlLabel, Grid, TextareaAutosize, TextField } from "@material-ui/core";
import { LoonsTable, MainTitle } from 'app/components/LoonsLabComponents';
import CloseIcon from '@material-ui/icons/Close';
import LabeledInput from 'app/components/LoonsLabComponents/LabeledInput';

const ExchangeAcknowledgeModal = ({ open, setOpen }) => {
    const [ackQty, setAckQty] = useState("");

    return <Dialog open={open}
        onClose={() => setOpen(false)}>
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <MainTitle title="Your Exchange Acknowledgement : Point of Initialization" />
                <div onClick={() => setOpen(false)} style={{ padding: 5, display: 'flex', justifyContent: 'center', cursor: 'pointer' }}><CloseIcon /></div>
            </div>
            {open ? <DialogContentText color='black'>
                <p>Drug Name : {open.itemName}</p>
                <p>Requested Quantity  : {open.requestedQty}</p>

                <Grid container spacing={2} style={{ border: '1px solid #e0e0e0', marginBottom: '2em' }}>
                    <Grid item xs={5} style={{ borderRight: '1px solid #e0e0e0' }}>
                        <p style={{ fontSize: '0.8em' }}>Received Quantity : {open.receivedQty}</p>
                    </Grid>
                    <Grid item xs={7} style={{ borderRight: '1px solid #e0e0e0' }}>
                        <p style={{ fontSize: '0.8em' }}>Received Batch and Expiry : {open.myStock}</p>
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <p>Acknowledge Quantity</p>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField variant="outlined" size="small" disabled value={open && open.receivedQty ? open.receivedQty.toString() : "0"} onChange={(e) => setAckQty(e)} />
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                </Grid>

            </DialogContentText> : null}
            <DialogActions>
                <Button size="small" variant="contained" style={{ background: '#ff005d', color: 'white' }} onClick={() => setOpen(false)}>Reject</Button>
                <Button size="small" variant="contained" style={{ background: '#00cbff', color: 'white' }}>Acknowledged</Button>
            </DialogActions>
        </div>
    </Dialog>
}

export default ExchangeAcknowledgeModal;