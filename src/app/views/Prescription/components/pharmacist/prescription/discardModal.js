import React, { useRef } from 'react';
import { Button, Checkbox, Dialog, DialogActions, DialogContentText, FormControlLabel, TextareaAutosize } from "@material-ui/core";
import PharmacyService from 'app/services/PharmacyService';

const DiscardModal = ({ open, setOpen, prescription, showSuccess }) => {

    const remarkRef = useRef(null);

    const discardPrescription = () => {
        PharmacyService.referPrescription(prescription?.id, {
            pharmacist_remark: remarkRef.current.value,
            status: "Reffered Back"
        })
        .then((out)=>{ 
            console.log("Prescription refered",out); 
            setOpen(false); 
            showSuccess(); 
        })
        .catch((e)=>console.log("Discard error",e))
    }

    return <Dialog open={open}
        onClose={() => setOpen(false)}>
        <div style={{ padding: '2rem' }}>
            <DialogContentText>
                You are about to refer the Prescription!<br />
                Please state a valid reason in order to refer the prescription to doctors.
            </DialogContentText>
            <TextareaAutosize ref={remarkRef} aria-label="Description" placeholder="Description" style={{ width: '100%', minHeight: '5rem' }} />
            <div style={{ display: 'flex' }}>
                <FormControlLabel label='Inform Doctor' style={{ marginLeft: '0.1em', paddingRight: '1em', border: '1px solid #00A8F4' }} control={
                    <Checkbox defaultChecked size='small' color='#00A8F4' />} />
                <p>{prescription?.doctor}</p>
            </div>
            <DialogActions>
                <Button size="small" variant="contained" style={{ background: '#ff005d', color: 'white' }} onClick={() => setOpen(false)}>Cancel</Button>
                <Button size="small" variant="contained" style={{ background: '#00cbff', color: 'white' }} onClick={() => discardPrescription()}>Refer the DR</Button>
            </DialogActions>
            <p style={{ fontSize: '0.8em' }}>Please note refered prescriptions can be viewed by the top management</p>
        </div>
    </Dialog>
}

export default DiscardModal;