import React from 'react';
import { withStyles } from '@material-ui/styles';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import { Button, Grid, Popover } from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import { useState } from 'react';
import { useEffect } from 'react';
import { DatePicker, LoonsSnackbar } from 'app/components/LoonsLabComponents';
import moment from 'moment';
import { Snackbar } from '@material-ui/core';

const styles = {
    footerContainer: {
        border: '1px solid #eaeaea',
        borderTop: 0,
        fontWeight: 'bold',
        color: '#c6c6c6',
        background: '#f8f8f8',
        paddingTop: 10,
        paddingBottom: 10,
    },
    tbleFooter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
    },
    min: {
        width: 'calc(5%)',
    },
    medium: {
        width: 'calc(10%)'
    },
    medMax: {
        width: 'calc(15%)',
        textAlign: 'start'
    },
    max: {
        width: 'calc(30%)'
    },
    btn: {
        padding: 0,
        width: '2em',
        height: '2em',
        minWidth: 0,
        margin: 1
    },
}

const AddInput = ({ options, onChange = (e) => e, val = "", solo = false, text = "Add", tail = null }) => (
    <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label || ""}
        id="disable-clearable"
        freeSolo={solo}
        onChange={onChange}
        value={val}
        size='small'
        renderInput={(params) => (
            <div ref={params.InputProps.ref} style={{ display: 'flex' }}>
                <input type="text" {...params.inputProps}
                    style={
                        !tail ? { width: '98%', margin: '1%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: 5 }
                            : { width: '98%', margin: '1%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: '5px 0 0 5px', marginRight: 0, borderRight: 0 }
                    }
                    placeholder={`⊕ ${text}`}
                    onChange={onChange}
                    value={val}
                />
                {tail ? <div style={{ display: 'flex', alignItems: 'center', background: 'white', margin: '1% 1% 1% 0', marginLeft: 0, border: '1px solid #e5e7eb', borderRadius: '0 5px 5px 0', padding: '1px' }}>{tail}</div> : null}
            </div>
        )}
    />
)

const TableFoot = (props) => {
    const { classes, index, drugList, setDrugList, selectedDrug, select } = props;
    const [open, setOpen] = useState(false);

    const positions = [{ label: "Secretary" }, { label: "Member" }, { label: "Chairman" }]
    const types = [{ label: "Authorization" }, { label: "Internal" }, { label: "External" }]
    const [position, setPosition] = useState(null);
    const [type, setType] = useState(null);
    const [noOfPosition, setNoOfPosition] = useState(0);
    const [designation, setDesignation] = useState(null);
    const [duration, setDuration] = useState(0);

    const clearField = () => {
        setPosition('');
        setType('');
        setNoOfPosition(0);
        setDesignation('');
        setDuration(0);
    }

    useEffect(() => {
        if (selectedDrug) {
            setPosition(selectedDrug.position);
            setType(selectedDrug.type);
            setNoOfPosition(selectedDrug.noOfPosition);
            setDesignation(selectedDrug.designation);
            setDuration(selectedDrug.duration);
        } else {
            clearField()
        }
    }, [selectedDrug]);

    return <div className={classes.footerContainer}>
        <div className={classes.tbleFooter}>
            <div className={classes.min}>&nbsp;</div>
            <div className={classes.min}>{`${(index + 1).toString().padStart(2, '0')}.`}</div>
            <div className={classes.max}>
                <AddInput options={positions} text="Position" val={position} onChange={(e) => setPosition(e.target.textContent ? e.target.textContent : e.target.value)} />
            </div>
            <div className={classes.medMax}>
                <AddInput options={types} text="Type" val={type} onChange={(e) => setType(e.target.textContent ? e.target.textContent : e.target.value)} />
            </div>
            <div className={classes.medMax}>
                <AddInput options={[]} solo text="No of Positions" val={noOfPosition} onChange={(e) => {
                    setNoOfPosition(e.target.textContent ? e.target.textContent : e.target.value > 0 ? parseInt(e.target.value, 10) : "");
                }} />
            </div>
            <div className={classes.medMax}>
                <AddInput options={positions} text="Designation" val={designation} onChange={(e) => setDesignation(e.target.textContent ? e.target.textContent : e.target.value)} />
            </div>
            <div className={classes.medMax}>
                <AddInput solo text="Duration" options={[]} val={duration} tail="Months" onChange={(e) => {
                    setDuration(e.target.textContent ? e.target.textContent : e.target.value > 0 ? parseInt(e.target.value, 10) : "");
                }} />
            </div>
            <div className={classes.medium}>
                <Button className={classes.btn} style={{ color: '#06b6d4', background: '#e1fbff' }}
                    onClick={() => {
                        const arr = [...drugList];
                        if (selectedDrug !== null) {
                            arr[index].position = position;
                            arr[index].type = type;
                            arr[index].noOfPosition = noOfPosition;
                            arr[index].designation = designation;
                            arr[index].duration = duration;
                        }
                        else {
                            arr.push({ position: position, type: type, noOfPosition: noOfPosition, designation: designation, duration: duration });
                        }
                        setDrugList(arr);
                        clearField();
                        select(null);
                    }}>
                    <SaveOutlinedIcon />
                </Button>
            </div>
        </div>
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
        >
            <Alert
                onClose={() => setOpen(false)}
                severity={'warning'}
                sx={{ width: '100%' }}
            >
                Please Fill Out the Fields
            </Alert>
        </Snackbar>
    </div>
}

TableFoot.propTypes = {
}

export default withStyles(styles)(TableFoot);