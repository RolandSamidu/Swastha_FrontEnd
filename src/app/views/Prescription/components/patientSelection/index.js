import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, Radio, RadioGroup, TextField, Typography } from "@material-ui/core";
import { withStyles } from '@material-ui/styles';
import { FormControlLabel, Grid } from '@mui/material';
import LabeledInput from 'app/components/LoonsLabComponents/LabeledInput';
import PatientServices from 'app/services/PatientServices';

const styles = {
    smallText: { fontSize: '0.8em' },
    row: { background: '#fdfdf9', display: 'flex', alignItems: 'center', padding: 5, cursor: 'pointer' },
    rowSelected: { background: '#ffcbd2', display: 'flex', alignItems: 'center', padding: 5, cursor: 'pointer' }
}

const PatientSelection = (props) => {
    const { classes } = props;

    const [searchBy, setSearchBy] = useState("phn");
    const [searchText, setSearchText] = useState("");
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchText && searchText.length > 4) {
            setIsLoading(true);
            PatientServices.fetchPatientsByAttribute(searchBy === "phn" ? { phn: searchText } : { nic: searchText })
                .then((out) => {
                    setPatients(out.data.view.data);
                    setIsLoading(false);
                })
                .catch((e) => {
                    console.log("Error occured", e);
                    setIsLoading(false);
                })
        }
    }, [searchText]);

    const Row = ({ patient }) => {
        const [hovered, setHovered] = useState(false);
        return <div className={hovered ? classes.rowSelected : classes.row}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            onClick={() => {localStorage.setItem('patient',JSON.stringify(patient)); window.location.reload();}}>
            <Grid container spacing={2}>
                <Grid item xs={3} md={3}>
                    {patient.phn}
                </Grid>
                <Grid item xs={3} md={3}>
                    {patient.nic}
                </Grid>
                <Grid item xs={6} md={6}>
                    {patient.name}
                </Grid>
            </Grid>
        </div>

    }

    return <Dialog open={true}
        onClose={() => { }}>
        <div style={{ minWidth: '40vw', height: '50vh' }}>
            <DialogContent>
                <div style={{ height: '5%' }}>
                    Select patient to continue
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={6}>
                            <TextField label="" placeholder='Search' variant="outlined" size="small" style={{ width: '100%' }} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <RadioGroup row value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                                <FormControlLabel value="phn" control={<Radio size='small' color='primary' />} label={<Typography className={classes.smallText}>PHN</Typography>} />
                                <FormControlLabel value="nic" control={<Radio size='small' color='primary' />} label={<Typography className={classes.smallText}>NIC</Typography>} />
                            </RadioGroup>
                        </Grid>
                    </Grid>
                </div>
                <div style={{ height: '30vh', overflow: 'auto' }}>
                    {isLoading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </div>
                        : <>{patients.map((patient) => <Row patient={patient} />)}</>}
                </div>
            </DialogContent>
        </div>
    </Dialog>
}

PatientSelection.propTypes = {
}

export default withStyles(styles)(PatientSelection);