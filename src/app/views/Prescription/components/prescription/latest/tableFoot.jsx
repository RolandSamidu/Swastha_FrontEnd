import React from 'react';
import { withStyles } from '@material-ui/styles';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import AddCommentOutlinedIcon from '@material-ui/icons/AddCommentOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import { Button, Dialog, Popover, TextField, Typography } from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import InventoryService from 'app/services/InventoryService';
import PrescriptionService from 'app/services/PrescriptionService';
import PharmacyService from 'app/services/PharmacyService';
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import { LoonsDialogBox, LoonsSnackbar } from 'app/components/LoonsLabComponents';
import { padLeadingZeros } from 'utils';
import { unBrackableDosageForms } from 'appconst';

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
        width: 'calc(35%)'
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


const AddInput = ({ options, onChange = (e) => e, val = "", solo = false, disabled = false, type = null, text = "Add", tail = null, filter = false, onKeyPress = (e) => e }) => (
    <Autocomplete
                                        disableClearable
        options={options}
        getOptionLabel={(option) => option.title || ""}
        id="disable-clearable"
        freeSolo={solo}
        onChange={onChange}
        value={val}
        size='small'
        type={type}
        disabled={disabled}
        autoHighlight={true}
        filterOptions={filter ? (options, { inputValue }) => {
            const temp = options.filter((item) => item.title.toLowerCase().includes(inputValue.toLowerCase()));
            return temp;
        } : (options) => options}
        renderInput={(params) => (
            <div {...params} ref={params.InputProps.ref} style={{ display: 'flex' }}>
                {filter ? <input type="text" {...params.inputProps}
                    style={
                        !tail ? { width: '98%', margin: '1%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: 5 }
                            : { width: '98%', margin: '1%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: '5px 0 0 5px', marginRight: 0, borderRight: 0 }
                    }
                    placeholder={text}
                    getOptionSelected={onChange}
                    value={val}
                    onKeyDown={onKeyPress}
                /> : <input type="text" {...params.inputProps}
                    style={
                        !tail ? { width: '98%', margin: '1%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: 5 }
                            : { width: '98%', margin: '1%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: '5px 0 0 5px', marginRight: 0, borderRight: 0 }
                    }
                    placeholder={text}
                    onChange={onChange}
                    value={val}
                    onKeyDown={onKeyPress}
                />}
                {tail ? <div style={{ display: 'flex', alignItems: 'center', background: 'white', margin: '1% 1% 1% 0', marginLeft: 0, border: '1px solid #e5e7eb', borderRadius: '0 5px 5px 0', padding: '1px' }}>{tail}</div> : null}
            </div>
        )}
    />)

const TableFoot = (props) => {
    const { classes, index, drugList, setDrugList, selectedDrug, select, warehouses, pharmacies, clinic, setDrugObj, clear, setClear } = props;
    const [commentEl, setCommentEl] = useState(null);

    const [route, setRoute] = useState(null);
    const [drug, setDrug] = useState(null);
    const [drugID, setDrugID] = useState(null);
    const [drugUom, setDrugUom] = useState("mg");
    const [sr_no, setSrNo] = useState(null);
    const [drugStrength, setDrugStrength] = useState(1);

    const remarkRef = useRef(null);
    const [params, setParams] = useState([{ id: 1, dosage: null, frequency: null, frequency_val: null, frequency_id: null, duration: null, remark: null }]);
    const [rowCount, setRowCount] = useState(1);
    const [remarkPos, setRemarkPos] = useState(0);
    const [drugs, setDrugs] = useState([]);

    const [routes, setRoutes] = useState([]);
    const [routesConst, setRoutesConst] = useState([]);
    const [frequencies, setFrequencies] = useState([]);
    const [frequenciesConst, setFrequenciesConst] = useState([]);

    const [showOS, setShowOS] = useState(null);

    const [showUnBrackable, setShowUnBrackable] = useState(null);

    const [altError, setAltError] = useState(null)

    const [viewSnack, setViewSnack] = useState("");
    var [snackMassage, setSnackMassage] = useState("");
    var [severity, setSeverity] = useState("success");
    const [submittable, setSubmittable] = useState(0);

    useEffect(() => {
        setDrugObj(drugID);
    }, [drugID]);

    useEffect(() => {
        if (selectedDrug) {
            setDrugID(selectedDrug.drug_id);
        } else {
            setDrugID("");
        }
    }, [selectedDrug]);

    useEffect(() => {
        if (clear) {
            setRoute("");
            setDrug("");
            setDrugID("");
            setParams([{ dosage: "", frequency: "", frequency_val: "", frequency_id: "", duration: "", remark: "" }]);
            select(null);
            setClear(false);
        }
    }, [clear]);

    useEffect(() => {
        if (submittable === 1) {
            submitDrug(false);
        } else if (submittable === 2) {
            submitDrug(true);
        }
    }, [submittable])

    useEffect(() => {
        if (drug && drug.length > 2) {
            InventoryService.fetchAllItems({ search: drug, is_prescrible: "true" }).then((out) => {
                console.log("item", out)
                if (out.data) {
                    const drugItems = out.data.view.data.map((item) => {
                        return {
                            title: item.medium_description,
                            uom: item.DisplayUnit ? item.DisplayUnit.name : "mg",
                            id: item.id,
                            item_unit_size: item.item_unit_size,
                            route: item.DefaultRoute ? item.DefaultRoute.name : "",
                            frequency: item.DefaultFrequency ? item.DefaultFrequency.name : "",
                            frequency_val: item.DefaultFrequency ? item.DefaultFrequency.value : "",
                            frequency_id: item.DefaultFrequency ? item.DefaultFrequency.id : "",
                            dosageForm: item.DosageForm?.name,
                            is_dosage_count: item.is_dosage_count,
                            duration: item.default_duration,
                            sr_no: item.sr_no
                        }
                    });
                    setDrugs(drugItems)
                }
            });
        }
    }, [drug]);

    useEffect(() => {
        if (selectedDrug) {
            console.log("selecting drug", selectedDrug)
            setSrNo(selectedDrug.sr_no)
            setDrugUom(selectedDrug.uom)
            setRoute(selectedDrug.route);
            setDrug(selectedDrug.drug);
            setParams(selectedDrug.params);
            setRowCount(selectedDrug.params.length)
            setDrugStrength(selectedDrug.strength);
        } else {
            setRoute("");
            setDrug("");
            setParams([{ id: 1, dosage: "", frequency: "", frequency_val: "", frequency_id: "", duration: "", remark: "" }]);
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
                setFrequenciesConst(out);
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
                setRoutesConst(out);
            }
        });
    }

    const submitDrug = (os) => {
        const arr = [...drugList];
        if (!route || !drug || !params || !drugStrength) {
            setSeverity("error");
            setSnackMassage("Please fill the fields");
            setViewSnack(true);
            setSubmittable(0);
            return;
        }
        let ok = true;
        params.forEach((param) => {
            if (!param.dosage || !param.frequency || !param.frequency_val || !param.frequency_id || !param.duration) {
                ok = false;
            }
        });
        if (!ok) {
            setSeverity("error");
            setSnackMassage("Please fill the fields");
            setViewSnack(true);
            setSubmittable(0);
            return;
        }
        if (selectedDrug !== null && arr[index] != undefined) {
            // console.log("deleted",arr[index])
            arr[index].route = route;
            arr[index].drug = drug;
            arr[index].sr_no = sr_no;
            arr[index].short_name = drug;
            arr[index].uom = drugUom;
            arr[index].params = params;
            arr[index].drug_id = drugID;
            arr[index].strength = drugStrength;
            arr[index].availability = os ? false : true;
        } else {
            arr.push({
                type: '',
                route,
                drug,
                short_name: drug,
                drug_id: drugID,
                uom: drugUom,
                sr_no: sr_no,
                strength: drugStrength,
                params,
                availability: os ? false : true
            });
        }
        setDrugList(arr);
        setRoute("");
        setDrug("");
        setDrugID("");
        setParams([{ dosage: "", frequency: "", frequency_val: "", frequency_id: "", duration: "", remark: "" }]);
        select(null);
        setSubmittable(0);
    }

    const checkAvailability = (drug) => {
        const warehouse = warehouses;
        const pharmacy = pharmacies;
        console.log("saving drug", drug)
        if (drug == null) {
            setSubmittable(1);
        } else {
            if (drug && drug !== "") {
                PharmacyService.getDrugStocks({
                    "warehouse_id": warehouse,
                    "items": [drug],
                    "zero_needed": true,
                    main_needed: true,
                    pharmacy_drugs_store_id: pharmacy
                }).then(async (stocks) => {
                    const recs = stocks.data && stocks.data.posted ? stocks.data.posted.data : [];
                    if (recs.length > 0) {
                        let qty = 0;
                        params.forEach((obj, index) => {
                            qty += ((Number(obj.duration) * Number(obj.dosage) * (obj.frequency_val ? Number(obj.frequency_val) : 1)) / Number(drugStrength));
                        });
                        const pending = await PrescriptionService.fetchPrescriptions({
                            'drug_id': drug,
                            'status[0]': 'Active',
                            'status[1]': 'Pending',
                            'clinic_id': clinic.clinic_id,
                            'pending_prescription_qty': true
                        });
                        if (pending.data && pending.data.view && pending.data.view.length > 0) {
                           // qty -= Number(pending.data.view[0].quantity);
                           qty += Number(pending.data.view[0].quantity);

                        }
                        console.log("saved drug qty",qty)
                        console.log("saved drug stoke qty",recs[0].quantity)
                        console.log("saved drug main stoke qty",recs[0].main_warehouse_quantity)
                        if (Number(recs[0].quantity) > qty || Number(recs[0].main_warehouse_quantity) > qty) {
                            setSubmittable(1);
                        } else {
                            setShowOS(drugID);
                        }
                    } else {
                        setShowOS(drugID);
                    }
                })
            } else {
                setSubmittable(2);
            }
        }
    }

    const DrugSuggest = () => {
        const [alts, setAlts] = useState([]);
        useEffect(() => {

            if (sr_no) {
                InventoryService.getInventoryFromSR({
                    is_prescrible: "true",
                    warehouse_id: warehouses,
                    main_needed: true,
                    pharmacy_drugs_store_id: pharmacies,
                    zero_needed: true,
                    item_needed: true,
                    sr_no: sr_no.slice(0, 6)
                }).then((inv) => {
                    if (inv.data && inv.data.posted && inv.data.posted.data) {
                        const items = inv.data.posted.data;
                        console.log("alternatives", items.filter(x => Number(x.quantity) > 0))
                        let availaleItems = items.filter(x => Number(x.quantity) > 0)
                        if (availaleItems.length > 0) {
                            setAlts(availaleItems);
                        } else {
                            setAlts([]);
                            setShowOS(null);
                            setSubmittable(2);
                        }
                    }
                })
            } else {
                setAlts([]);
                setShowOS(null);
                setSubmittable(2);
            }
        }

            , []);

        const DrugTable = () => <table style={{ width: '100%' }}>
            <thead>
                <th style={{ width: '40%', textAlign: 'start' }}>Drug name</th>
                <th style={{ width: '20%', textAlign: 'start' }}>Strength</th>
                <th style={{ width: '20%', textAlign: 'start' }}>Default Duration</th>
                <th style={{ width: '20%', textAlign: 'start' }}>Action</th>
            </thead>
            <tbody>
                {alts.map((alt) => alt.ItemSnap.sr_no !== sr_no ? < tr >
                    <td>{alt.ItemSnap.medium_description}</td>
                    <td>{alt.ItemSnap.strength}</td>
                    <td>{`${alt.ItemSnap.default_duration} Days`}</td>
                    <td><LoonsButton onClick={() => {

                        let selecteble = true;
                        setAltError(null)

                        for (let index = 0; index < params.length; index++) {
                            let dosage = Number(params[index].dosage);
                            let item_unit_size = Number(alt.ItemSnap.item_unit_size);
                            let mod = dosage % item_unit_size;
                            if (mod == 0) {
                                selecteble = true
                            } else {
                                selecteble = false
                                setAltError(true)
                            }
                        }

                        if (selecteble) {
                            setDrug(alt.ItemSnap.medium_description);
                            setDrugID(alt.item_id ?? alt.drug_id);
                            const arr = [...params];
                            // arr[0].dosage = alt.ItemSnap.item_unit_size.replace(/[.,]00$/, "");
                            //arr[0].frequency = alt.ItemSnap.DefaultFrequency.name;
                            //arr[0].frequency_val = alt.ItemSnap.DefaultFrequency.value;
                            //arr[0].frequency_id = alt.ItemSnap.DefaultFrequency.id;
                            setRoute(alt.ItemSnap.DefaultRoute.name);
                            setParams(arr);
                            setDrugUom(alt.ItemSnap.DisplayUnit.name)
                            setDrugStrength(alt.ItemSnap.item_unit_size ? Number(alt.ItemSnap.item_unit_size) : 1);
                            setSrNo(alt.ItemSnap.sr_no)
                            setShowOS(null);
                            setSubmittable(1);
                            setShowUnBrackable(null)
                            console.log("SELECTING", alt);
                        } else {
                            setAltError(true)
                        }

                    }}>Select</LoonsButton></td>
                </tr> : null)}
            </tbody>
        </table >

        return <Dialog open={showOS !== null} fullWidth maxWidth="md">
            <div style={{ padding: 10 }}>
                <h6>Alternatives for {drug}</h6>
                <hr />

                {altError === true && (
                    <Alert severity='error'>
                        <strong>Some Drug/s Dosage Cannot Provide From the Selected Alternative Drug.</strong>
                    </Alert>
                )}
                <DrugTable />
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <LoonsButton color="primary"
                        onClick={() => {
                            setShowOS(null);
                            if (altError != true || showUnBrackable == null) {
                                setSubmittable(2);
                                setShowUnBrackable(null)
                            }
                            setAltError(null)
                            setShowUnBrackable(null)
                        }}>
                        Continue</LoonsButton>
                </div>
            </div>
        </Dialog>
    }



    useEffect(() => {
        fetchFrequencies();
        fetchRoutes();
    }, []);

    return <><div className={classes.footerContainer}>

        <div className={classes.tbleFooter}>
            <div className={classes.min}>&nbsp;</div>
            <div className={classes.min}>{`${(index + 1).toString().padStart(2, '0')}.`}</div>
            <div className={classes.medium}>
                <AddInput options={routes} solo text="Route" val={route}
                    onChange={(e) => {
                        setRoute(e.target.textContent ? e.target.textContent : e.target.value);
                        const routeTemp = routesConst.filter((item) => item.title.toLowerCase().includes((e.target.value.toString()).toLowerCase()))
                        setRoutes([...routeTemp]);
                    }} />
            </div>
            <div className={classes.max}>
                <AddInput solo options={drugs} text="Drug Name" disabled={selectedDrug ? true : false} val={drug} onChange={(e, val) => {
                    
                    console.log("enterd val",val)
                    console.log("enterd value 2",e.target)
                    setDrug(e.target.textContent ? e.target.textContent : e.target.value);
                    if (val) {
                        setDrugID(val.id);
                        const arr = [...params];
                        //arr[0].dosage = val.item_unit_size.replace(/[.,]00$/, "");
                        arr[0].dosage = val.is_dosage_count == "1" ? val.item_unit_size.replace(/[.,]00$/, "") : 1;
                        arr[0].item_unit_size = val.item_unit_size.replace(/[.,]00$/, "");
                        arr[0].frequency = val.frequency;
                        arr[0].frequency_val = val.frequency_val;
                        arr[0].frequency_id = val.frequency_id;
                        arr[0].duration = val.duration;
                        arr[0].dosageForm = val.dosageForm;
                        arr[0].is_dosage_count = val.is_dosage_count;
                        setDrugStrength(val.item_unit_size ? Number(val.item_unit_size) : 1);
                        setRoute(val.route);
                        setParams(arr);
                        setDrugUom(val.uom)
                        setSrNo(val.sr_no)
                    } else {
                        const arr = [...params];
                        arr[0].dosage = "";
                        setDrugID(null);
                        setParams(arr);
                        setSrNo(null)
                    }
                }} />
            </div>
            <div className={classes.medMax}>
                <AddInput options={dosages} solo text="Dose" val={params[0].dosage} onChange={(e) => {
                    const arr = [...params];
                    arr[0].dosage = e.target.textContent ? e.target.textContent : e.target.value;
                    setParams(arr);
                }} tail={drugUom} />
            </div>
            <div className={classes.medium}>
                <AddInput options={frequencies} solo text="Freq" val={params[0].frequency} onChange={(e) => {
                    const arr = [...params];
                    arr[0].frequency = e.target.textContent ? e.target.textContent : e.target.value;
                    const freq = frequencies.filter((fr) => fr.title === arr[0].frequency);
                    arr[0].frequency_val = freq.length > 0 ? freq[0].value : 0;
                    arr[0].frequency_id = freq.length > 0 ? freq[0].id : 0;
                    setParams(arr);
                    const freqTemp = frequenciesConst.filter((item) => item.title.toLowerCase().includes((e.target.value.toString()).toLowerCase()))
                    setFrequencies([...freqTemp]);
                }} />

            </div>
            <div className={classes.medMax}>
                <AddInput options={durations} solo text="Duration" val={params[0].duration} onChange={(e) => {
                    const arr = [...params];
                    arr[0].duration = e.target.textContent ? ~~(e.target.textContent) : ~~(e.target.value);
                    setParams(arr);
                }} tail="Days" onKeyPress={(e) => { if (e.key === 'Enter') { checkAvailability(drugID); } else { return e } }} />
            </div>
            <div className={classes.medMax}>
                <Button aria-describedby={Boolean(commentEl) ? 'simple-popover' : undefined} className={classes.btn}
                    onClick={(e) => { setRemarkPos(0); setCommentEl(e.currentTarget); }}
                    style={{ color: '#afafaf', background: '#eeeeee' }}>
                    <AddCommentOutlinedIcon style={{ fontSize: '1.3em' }} />
                </Button>
                <Button className={classes.btn} style={{ color: '#afafaf', background: '#eeeeee' }} onClick={() => {
                    const arr = [...params];

                    console.log('drug dosageForm', params[params.length - 1])
                    //checkAvailability(drugID);
                    let dosage = Number(params[params.length - 1].dosage);
                    let item_unit_size = Number(params[params.length - 1].item_unit_size);
                    let mod = dosage % item_unit_size;

                    console.log("drug dosageForm mod", mod)

                    if ((unBrackableDosageForms.includes(params[0].dosageForm)) && mod > 0) {
                        setShowUnBrackable(drugID);
                    } else {

                        const newRow = {};
                        const newRowId = rowCount + 1;
                        setRowCount(newRowId);
                        newRow.id = newRowId;
                        newRow.dosage = params[0].dosage;
                        newRow.frequency = params[0].frequency;
                        newRow.frequency_val = params[0].frequency_val;
                        newRow.frequency_id = params[0].frequency_id;
                        newRow.item_unit_size = params[0].item_unit_size;
                        newRow.is_dosage_count = params[0].is_dosage_count;
                        //setDrugStrength(params[0].item_unit_size ? Number(params[0].item_unit_size) : 1);
                        newRow.duration = params[0].duration;
                        // newRow.quantity = (params[0].dosage / (params[0].unit_size ? Number(params[0].unit_size) : 1)) * params[0].frequency_val * params[0].duration;
                        newRow.remark = null;
                        arr.push(newRow);
                        setParams(arr);
                    }




                }}>
                    <AddRoundedIcon />
                </Button>
                <Button className={classes.btn} style={{ color: '#06b6d4', background: '#e1fbff' }}
                    onClick={() => {
                        console.log('drug dosageForm', params[0])
                        //checkAvailability(drugID);

                        let unselecteble = false;

                        for (let index = 0; index < params.length; index++) {
                            let dosage = Number(params[index].dosage);
                            let item_unit_size = Number(params[0].item_unit_size);
                            let mod = dosage % item_unit_size;
                            if (mod == 0) {
                                unselecteble = false
                            } else {
                                unselecteble = true
                            }
                        }


                        // let dosage = Number(params[0].dosage);
                        //let item_unit_size = Number(params[0].item_unit_size);
                        //let mod = dosage % item_unit_size;

                        //console.log("drug dosageForm mod", mod)

                        if ((unBrackableDosageForms.includes(params[0].dosageForm)) && unselecteble) {
                            setShowUnBrackable(drugID);
                           // checkAvailability(drugID);
                        } else {
                            if (params[0].frequency_id == "") { 
                                setSeverity("error");
                                setSnackMassage("Please fill the fields");
                                setViewSnack(true);
                            }else{
                                checkAvailability(drugID)
                            }
                        
                        }

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
                        <AddInput options={dosages} solo text="Dose" type="autocomplete" val={params[pos].dosage} onChange={(e) => {
                            const arr = [...params];
                            arr[pos].dosage = e.target.textContent ? e.target.textContent : e.target.value;
                            setParams(arr);
                        }} tail={drugUom} />
                    </div>
                    <div className={classes.medium}>
                        <AddInput options={frequencies} solo text="Freq" val={params[pos].frequency} onChange={(e) => {
                            const arr = [...params];
                            arr[pos].frequency = e.target.textContent ? e.target.textContent : e.target.value;
                            const freq = frequencies.filter((fr) => fr.title === arr[pos].frequency);
                            arr[pos].frequency_val = freq.length > 0 ? freq[0].value : 0;
                            arr[pos].frequency_id = freq.length > 0 ? freq[0].id : 0;
                            setParams(arr);
                            const freqTemp = frequenciesConst.filter((item) => item.title.toLowerCase().includes((e.target.value.toString()).toLowerCase()))
                            setFrequencies([...freqTemp]);
                        }} />
                    </div>
                    <div className={classes.medMax}>
                        <AddInput options={durations} solo text="Duration" val={params[pos].duration} onChange={(e) => {
                            const arr = [...params];
                            arr[pos].duration = e.target.textContent ? e.target.textContent : e.target.value;
                            setParams(arr);
                        }} tail="Days" />
                    </div>
                    <div className={classes.medMax}>
                        <Button aria-describedby={Boolean(commentEl) ? 'simple-popover' : undefined} className={classes.btn}
                            onClick={(e) => { setRemarkPos(pos); setCommentEl(e.currentTarget); }}
                            style={{ color: '#afafaf', background: '#eeeeee' }}>
                            <AddCommentOutlinedIcon style={{ fontSize: '1.3em' }} />
                        </Button>
                        <Button className={classes.btn} style={{ color: '#afafaf', background: '#eeeeee' }} onClick={() => {
                            const arr = [...params];
                            if (pos > 0) {
                                const filtered = arr.filter((item, dpos) => pos !== dpos);
                                setParams(filtered);
                            } else {
                                const filtered = arr.filter((item, dpos) => item.id !== arr[pos].id);
                                setParams(filtered);
                            }
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
    </div>
        {showOS ? <DrugSuggest /> : null}


        <LoonsDialogBox
            title="Drug Alert"
            show_alert={true}
            alert_severity="info"
            alert_message="The Drug You Selected is unbreakable. Please Choose the Another Dose in Drug"
            //message="testing 2"
            open={showUnBrackable}
            show_button={true}
            show_second_button={true}
            btn_label="Show Alternatives"
            onClose={() => {
                setShowOS(showUnBrackable)

            }}
            second_btn_label="Cancel"
            secondButtonAction={() => {
                setShowUnBrackable(null)
                // this.setState({ warning_alert: false })
            }}
        >

        </LoonsDialogBox>

        <LoonsSnackbar
            open={viewSnack}
            onClose={() => {
                setViewSnack(false)
            }}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            message={snackMassage}
            autoHideDuration={3000}
            severity={severity}
            elevation={2}
            variant="filled"
        ></LoonsSnackbar>

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
    </>
}

TableFoot.propTypes = {
}

export default withStyles(styles)(TableFoot);