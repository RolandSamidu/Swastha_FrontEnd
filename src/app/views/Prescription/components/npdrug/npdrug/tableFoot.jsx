// FIXME: 135 

import React from 'react';
import { withStyles } from '@material-ui/styles';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import AddCommentOutlinedIcon from '@material-ui/icons/AddCommentOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import { Button, Grid, Popover } from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import InventoryService from 'app/services/InventoryService';
import PrescriptionService from 'app/services/PrescriptionService';
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

const dosages = [
];

const durations = [];


const AddInput = ({ options, onChange = (e) => e, val = "", solo = false, text = "Add", tail = null }) => (
    <Autocomplete
        disableClearable
        options={options}
        getOptionLabel={(option) => option.title || ""}
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
    />)

const AddInputDate = ({ onChange = (date) => date, val = null, text = "Add", tail = null }) => (
    <DatePicker
        sx={
            !tail ? { width: '98%', margin: '2%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: 5 }
                : { width: '98%', margin: '2%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: '5px 0 0 5px', marginRight: 0, borderRight: 0 }
        }
        design={true}
        size='small'
        className='w-full'
        minDate={new Date()}
        value={val}
        format='dd/MM/yyyy'
        placeholder={`⊕ ${text}`}
        // errorMessages="this field is required"
        onChange={onChange}
    />
)

const TableFoot = (props) => {
    const { classes, index, drugList, setDrugList, selectedDrug, select } = props;
    const [commentEl, setCommentEl] = useState(null);
    const [open, setOpen] = useState(false);

    const [route, setRoute] = useState(null);
    const [drug, setDrug] = useState(null);
    const [drugID, setDrugID] = useState(null);
    const [drugSR, setDrugSR] = useState(null);
    const [drugUom, setDrugUom] = useState("mg");
    const remarkRef = useRef(null);
    const [params, setParams] = useState([{ id: 1, dosage: null, frequency: null, frequency_val: null, frequency_id: null, duration: null, expectTreatmentDate: null, remark: null }]);
    const [rowCount, setRowCount] = useState(1);
    const [remarkPos, setRemarkPos] = useState(0);
    const [drugs, setDrugs] = useState([]);

    const [routes, setRoutes] = useState([]);
    const [frequencies, setFrequencies] = useState([]);

    useEffect(() => {
        if (drug && drug.length > 3) {
            InventoryService.fetchAllItems({ search: drug,/*  is_prescrible: "true" */ }).then((out) => {
                if (out.data) {
                    const drugItems = out.data.view.data.map((item) => {
                        return {
                            title: item.medium_description,
                            uom: item.ItemUOM ? item.ItemUOM.UOM.name : "mg",
                            id: item.id,
                            sr_no: item.sr_no,
                            strength: item.item_unit_size.replace(/[.,]00$/, ""),
                            route: item.DefaultRoute ? item.DefaultRoute.name : "",
                            frequency: item.DefaultFrequency ? item.DefaultFrequency.name : "",
                            frequency_id: item.DefaultFrequency ? item.DefaultFrequency.id : "",
                            frequency_val: item.DefaultFrequency ? item.DefaultFrequency.value : "",
                            duration: item.default_duration
                            // TODO:
                        }
                    });
                    setDrugs(drugItems)
                }
            });
        }
    }, [drug]);

    useEffect(() => {
        if (selectedDrug) {
            setRoute(selectedDrug.route);
            setDrug(selectedDrug.drug);
            setParams(selectedDrug.params);
            setRowCount(selectedDrug.params.length)
        } else {
            setRoute("");
            setDrug("");
            setParams([{ id: 1, dosage: "", frequency: "", frequency_val: "", duration: "", expectTreatmentDate: null, remark: "" }]);
            setRowCount(1)
        }
    }, [selectedDrug]);

    const fetchFrequencies = () => {
        PrescriptionService.fetchFrequencies({}).then((obj) => {
            if (obj.data) {
                const out = obj.data.view.data.map((fr) => ({
                    id: fr.id,
                    title: fr.name,
                    value: fr.value
                }));
                setFrequencies(out);
            }
        });
    }

    const fetchRoutes = () => {
        PrescriptionService.fetchRoutes({}).then((obj) => {
            if (obj.data) {
                const out = obj.data.view.data.map((rt) => ({
                    id: rt.id,
                    title: rt.name
                }));
                setRoutes(out);
            }
        });
    }

    useEffect(() => {
        fetchFrequencies();
        fetchRoutes();
    }, []);

    return <div className={classes.footerContainer}>
        <div className={classes.tbleFooter}>
            <div className={classes.min}>&nbsp;</div>
            <div className={classes.min}>{`${(index + 1).toString().padStart(2, '0')}.`}</div>
            <div className={classes.max}>
                <AddInput options={drugs} text="Drug Name" val={drug} onChange={(e, val) => {
                    setDrug(e.target.textContent ? e.target.textContent : e.target.value);
                    setDrugID(val ? val.id : null);
                    setDrugSR(val ? val.sr_no : null);
                    console.log("drugval", val)
                    if (val) {
                        const arr = [...params];
                        arr[0].dosage = val.strength;
                        arr[0].frequency = val.frequency;
                        arr[0].frequency_val = val.frequency_val;
                        arr[0].frequency_id = val.frequency_id;
                        arr[0].duration = val.duration;
                        arr[0].expectTreatmentDate = val.expectTreatmentDate;
                        setRoute(val.route);
                        setParams(arr);
                        setDrugUom(val.uom)
                    } else {
                        const arr = [...params];
                        arr[0].dosage = "";
                        setParams(arr);
                    }
                }} />
            </div>
            <div className={classes.medium}>
                <AddInput options={routes} text="Route" val={route} onChange={(e) => setRoute(e.target.textContent ? e.target.textContent : e.target.value)} />
            </div>
            <div className={classes.medMax}>
                <AddInput options={dosages} solo text="Dose" val={params[0].dosage} onChange={(e) => {
                    const arr = [...params];
                    console.log("enterd value",e.target.value)
                    arr[0].dosage = e.target.textContent ? e.target.textContent : e.target.value > 0 ? parseFloat(e.target.value) : "";
                    setParams(arr);
                }} tail={drugUom} />
            </div>
            <div className={classes.medium}>
                <AddInput options={frequencies} solo text="Freq" val={params[0].frequency} onChange={(e) => {
                    const arr = [...params];
                    arr[0].frequency = e.target.textContent ? e.target.textContent : e.target.value;
                    const freq = frequencies.filter((fr) => fr.title === arr[0].frequency);
                    arr[0].frequency_val = freq.length > 0 ? freq[0].value : 0;
                    arr[0].frequency_id =freq[0].id;
                    console.log("freq",arr)
                    setParams(arr);
                }} />
            </div>
            <div className={classes.medMax}>
                <AddInput options={durations} solo text="Duration" val={params[0].duration} onChange={(e) => {
                    const arr = [...params];
                    arr[0].duration = e.target.textContent ? e.target.textContent : e.target.value > 0 ? parseInt(e.target.value, 10) : "";
                    setParams(arr);
                }} tail="Days" />
            </div>
            <div className={classes.medMax} style={{}}>
                <AddInputDate
                    text="Expected treatment date"
                    val={params[0].expectTreatmentDate}
                    onChange={(date) => {
                        const arr = [...params]
                        arr[0].expectTreatmentDate = date
                        setParams(arr)
                    }}
                />
            </div>
            <div className={classes.medMax}>
                <Button aria-describedby={Boolean(commentEl) ? 'simple-popover' : undefined} className={classes.btn}
                    onClick={(e) => { setRemarkPos(0); setCommentEl(e.currentTarget); }}
                    style={{ color: '#afafaf', background: '#eeeeee' }}>
                    <AddCommentOutlinedIcon style={{ fontSize: '1.3em' }} />
                </Button>
                <Button className={classes.btn} style={{ color: '#afafaf', background: '#eeeeee' }} onClick={() => {
                    const arr = [...params];
                    const newRow = {};
                    const newRowId = rowCount + 1;
                    setRowCount(newRowId);
                    newRow.id = newRowId;
                    newRow.dosage = params[0].dosage;
                    newRow.frequency = params[0].frequency;
                    newRow.frequenc_id = params[0].frequency_id;
                    newRow.frequency_val = params[0].frequency_val;
                    newRow.duration = params[0].duration;
                    newRow.expectTreatmentDate = params[0].expectTreatmentDate;
                    newRow.quantity = params[0].dosage * params[0].frequency_val * params[0].duration;
                    newRow.remark = null;
                    arr.push(newRow);
                    setParams(arr);
                }}>
                    <AddRoundedIcon />
                </Button>
                <Button className={classes.btn} style={{ color: '#06b6d4', background: '#e1fbff' }}
                    onClick={() => {
                        const arr = [...drugList];
                        params.forEach((param, i) => params[i].quantity = params[i].dosage * params[i].frequency_val * params[i].duration)
                        if (selectedDrug !== null) {
                            arr[index].route = route;
                            arr[index].drug = drug;
                            arr[index].uom = drugUom;
                            arr[index].params = params;
                            arr[index].drug_id = drugID;
                            arr[index].sr_no = drugSR;
                        } else {
                            arr.push({
                                type: '',
                                route,
                                drug,
                                drug_id: drugID,
                                sr_no: drugSR,
                                uom: drugUom,
                                params
                            });
                        }
                        console.log("SETTING LIST", arr);
                        if ((arr[index].drug === '' && index !== -1) || arr[index].params[0].expectTreatmentDate === undefined) {
                            arr.splice(index, 1);
                            setOpen(true);
                        }
                        setDrugList(arr);
                        setRoute("");
                        setDrug("");
                        setParams([{ drug: "", dosage: "", frequency: "", frequency_val: "", duration: "", remark: "", expectTreatmentDate: null }]);
                        select(null);
                    }}>
                    <SaveOutlinedIcon />
                </Button>
            </div>
        </div>
        {params.map((item, pos) => {
            if (pos > 0) {
                return <div className={classes.tbleFooter}>
                    <div className={classes.min}>&nbsp;</div>
                    <div className={classes.min}>&nbsp;</div>
                    <div className={classes.medium}></div>
                    <div className={classes.max}></div>
                    <div className={classes.medMax}>
                        <AddInput options={dosages} solo text="Dose" val={params[pos].dosage} onChange={(e) => {
                            const arr = [...params];
                            arr[pos].dosage = e.target.textContent ? e.target.textContent : e.target.value > 0 ? parseFloat(e.target.value) : 0;
                            setParams(arr);
                        }} tail={drugUom} />
                    </div>
                    <div className={classes.medium}>
                        <AddInput options={frequencies} solo text="Freq" val={params[pos].frequency} onChange={(e) => {
                            const arr = [...params];
                            arr[pos].frequency = e.target.textContent ? e.target.textContent : e.target.value;
                            arr[pos].frequency_val = e.target.value;
                            setParams(arr);
                        }} />
                    </div>
                    <div className={classes.medMax}>
                        <AddInput options={durations} solo text="Duration" val={params[pos].duration} onChange={(e) => {
                            const arr = [...params];
                            arr[pos].duration = e.target.textContent ? e.target.textContent : e.target.value > 0 ? parseInt(e.target.value, 10) : 0;
                            setParams(arr);
                        }} tail="Days" />
                    </div>
                    <div className={classes.medMax}>
                        <AddInputDate
                            text="Expected treatment date"
                            val={params[pos].expectTreatmentDate}
                            onChange={(date) => {
                                const arr = [...params]
                                arr[pos].expectTreatmentDate = date
                                setParams(arr)
                            }}
                        />
                    </div>
                    <div className={classes.medMax}>
                        <Button aria-describedby={Boolean(commentEl) ? 'simple-popover' : undefined} className={classes.btn}
                            onClick={(e) => { setRemarkPos(pos); setCommentEl(e.currentTarget); }}
                            style={{ color: '#afafaf', background: '#eeeeee' }}>
                            <AddCommentOutlinedIcon style={{ fontSize: '1.3em' }} />
                        </Button>
                        <Button className={classes.btn} style={{ color: '#afafaf', background: '#eeeeee' }} onClick={() => {
                            const arr = [...params];
                            const filtered = arr.filter((item) => item.id !== arr[pos].id);
                            setParams(filtered);
                        }}>
                            <DeleteOutlinedIcon />
                        </Button>
                    </div>
                </div>
            }
        })}
        <Popover
            id={Boolean(commentEl) ? 'simple-popover' : undefined}
            open={Boolean(commentEl)}
            anchorEl={commentEl}
            onClose={() => {
                const arr = [...params];
                arr[remarkPos].remark = remarkRef.current.value;
                setCommentEl(null)
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <div style={{ padding: 10, background: '#f8f8f8' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Add Remark</p>
                <textarea style={{ fontFamily: 'Nunito', width: '98%', margin: '1%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: 5 }}
                    rows={5}
                    ref={remarkRef} />
            </div>
        </Popover>
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