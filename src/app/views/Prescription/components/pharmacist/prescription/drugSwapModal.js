import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Dialog, DialogActions, DialogContentText, FormControlLabel, TextareaAutosize, TextField } from "@material-ui/core";
import HoverableText from 'app/components/HoverableText';
import InventoryService from 'app/services/InventoryService';
import PrescriptionService from 'app/services/PrescriptionService';
import PharmacyService from 'app/services/PharmacyService';
import { LoonsSnackbar } from "app/components/LoonsLabComponents";

const DrugSwapModal = ({ open, setOpen, originalDrug, selectedIndex, classes, warehouse, pharmacy, setAlt }) => {

    const [altDrugs, setAltDrugs] = useState([]);
    const [remainingQty, setRemainingQty] = useState(0);
    const [dosageConst, setDosageConst] = useState(0);
    const [defFrequency, setDefFrequency] = useState(0);
    const [defDuration, setDefDuration] = useState(0);
    const [manualSelect, setManualSelect] = useState(false);
    const [issued, setIssued] = useState(false);
    var [errorAlert, setErrorAlert] = useState(false);
    var [message, setMessage] = useState("");

    useEffect(() => {
        PrescriptionService.fetchFrequencies().then(freq => {
            const freqs = freq.data.view.data.filter((fr) => fr.id === open?.AssignItems[0]?.frequency_id);
            setDefFrequency(freqs.length > 0 ? Number(freqs[0].value) : 0);
            setDefDuration(Number(open?.AssignItems[0]?.duration))
        })
        if (open.pres_status !== "ISSUED") {
            InventoryService.getInventoryFromSR({
                is_prescrible: "true",
                warehouse_id: warehouse,
                main_needed: true,
                pharmacy_drugs_store_id: pharmacy,
                item_needed: true,
                zero_needed: true,
                sr_no: open.ItemSnap.sr_no.slice(0, 6)
            }).then((inv) => {
                if (inv.data && inv.data.posted && inv.data.posted.data) {
                    console.log("inventory data", inv.data.posted.data)
                    const items = [...inv.data.posted.data];
                    items.forEach((obj, index) => {
                        items[index].selected = false;
                        items[index].suggested = 0;
                        items[index].my_quantity = obj.quantity;
                        delete items[index].quantity;
                        items[index].main_warehouse_quantity = obj.main_warehouse_quantity;
                        items[index].dose = obj?.ItemSnap?.item_unit_size;
                        items[index].strength = obj?.ItemSnap?.item_unit_size;
                    })
                    items.sort((a, b) => {
                        return Number(b.ItemSnap.item_unit_size) - Number(a.ItemSnap.item_unit_size);
                    });
                    console.log("Alt Drugs", items)
                    setAltDrugs(items);
                }
            })
            let rem = 0;
            open.AssignItems.forEach((itm) => rem += Number(itm.dosage))
            setRemainingQty(rem);
            setDosageConst(rem);
        } else {
            setIssued(true);
            PharmacyService.fetchIssuedDrugs({ drug_assign_id: open?.id }).then((issued) => {
                if (issued && issued.data && issued.data.view && issued.data.view.data) {
                    setAltDrugs(issued.data.view.data);
                } else {
                    setAltDrugs([]);
                }
            })
        }
    }, []);

    const selectItem = ({ checked, index }) => {
        let qty_remaining = remainingQty - (parseInt(remainingQty / Number(altDrugs[index].ItemSnap.item_unit_size)) * Number(altDrugs[index].ItemSnap.item_unit_size));
        if (checked) {
            altDrugs[index].suggested = parseInt(remainingQty / Number(altDrugs[index].ItemSnap.item_unit_size)) * defDuration * defFrequency;
            altDrugs[index].dose = parseInt(remainingQty / Number(altDrugs[index].ItemSnap.item_unit_size)) * Number(altDrugs[index].ItemSnap.item_unit_size);
        } else {
            qty_remaining += (altDrugs[index].suggested * Number(altDrugs[index].ItemSnap.item_unit_size)) / (defDuration * defFrequency);
            altDrugs[index].suggested = 0;
            altDrugs[index].dose = parseInt(remainingQty / Number(altDrugs[index].ItemSnap.item_unit_size)) * Number(altDrugs[index].ItemSnap.item_unit_size);
        }
        altDrugs[index].selected = checked;
        setRemainingQty(qty_remaining);
        setAltDrugs([...altDrugs]);
    }

    const selectManualItem = ({ checked, index }) => {
        let qty_remaining = remainingQty - (Number(remainingQty / Number(altDrugs[index].ItemSnap.item_unit_size)) * Number(altDrugs[index].ItemSnap.item_unit_size));
        if (checked) {
            altDrugs[index].suggested = Number(remainingQty / Number(altDrugs[index].ItemSnap.item_unit_size)) * defDuration * defFrequency;
            altDrugs[index].dose = Number(remainingQty / Number(altDrugs[index].ItemSnap.item_unit_size)) * Number(altDrugs[index].ItemSnap.item_unit_size);
        } else {
            qty_remaining += (altDrugs[index].suggested * Number(altDrugs[index].ItemSnap.item_unit_size)) / (defDuration * defFrequency);
            altDrugs[index].suggested = 0;
            altDrugs[index].dose = Number(remainingQty / Number(altDrugs[index].ItemSnap.item_unit_size)) * Number(altDrugs[index].ItemSnap.item_unit_size);
        }
        altDrugs[index].selected = checked;
        setRemainingQty(qty_remaining);
        setAltDrugs([...altDrugs]);
    }

    const getDose = () => {
        if (open) {
            let dose = 0;
            open.AssignItems.forEach((item) => {
                dose += Number(item.dosage);
            });
            return dose;
        }
        return 0;
    }

    const calculateRemining = () => {
        //let altDrugs
        let opeed_drug = open?.AssignItems[0]
        let total_dosage = Number(open?.AssignItems[0]?.dosage)
        altDrugs.forEach(element => {
            if (element.selected) {
                total_dosage -= Number(element.dose)
            }
            setRemainingQty(total_dosage)
        });

    }

    useEffect(() => { console.log("OPANZ", open) }, [open])

    return <Dialog open={open !== null}
        onClose={() => setOpen(null)}
        maxWidth="xl"
        fullWidth={true}>
        <div style={{ padding: '1rem', width: '100%' }}>
            {!issued ? <>
                <h4>Swap Drugs</h4>
                <div><Checkbox onChange={e => { setManualSelect(!manualSelect) }} />Manual selecting</div>
                <div className={[classes.horizontal, classes.top].join(' ')} style={{ justifyContent: 'center' }}>
                    <div className={[classes.min, classes.header].join(' ')}></div>
                    <div className={[classes.max, classes.header].join(' ')}><HoverableText bolded text="Item Name" /></div>
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Dose" /></div>
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Frequency" /></div>
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Duration" /></div>
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Quantity" /></div>
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="My Stock Qty" /></div>
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Stock Qty" /></div>
                </div>
                <div className={classes.horizontal} style={{ justifyContent: 'center' }}>
                    <div className={[classes.min, classes.oddRow].join(' ')} style={{ background: '#CDE3C0' }}>
                        {/* {sub_index === 0 ? <>{drug.id === 0 ? <AddIcon style={{ color: '#00efa7' }} /> : (drug.id === 1 ? <ArrowUpwardIcon style={{ color: '#00cbff' }} /> : <ArrowDownwardIcon style={{ color: '#ff005d' }} />)}</> : null} */}
                    </div>
                    <div className={[classes.max, classes.oddRow].join(' ')} style={{ background: '#CDE3C0' }}>{open.drug_name}</div>
                    <div className={[classes.medium, classes.oddRow].join(' ')} style={{ background: '#CDE3C0' }}><HoverableText bolded text={`${getDose()} ${open && open.ItemSnap && open.ItemSnap.DisplayUnit ? open.ItemSnap.DisplayUnit.name : "mg"}`} /></div>
                    <div className={[classes.medium, classes.oddRow].join(' ')} style={{ background: '#CDE3C0' }}><HoverableText bolded text={open?.AssignItems[0]?.frequency} /></div>
                    <div className={[classes.medium, classes.oddRow].join(' ')} style={{ background: '#CDE3C0' }}><HoverableText bolded text={open?.AssignItems[0]?.duration} /></div>
                    {/* <div className={[classes.medium, classes.oddRow].join(' ')} style={{ background: '#CDE3C0' }}><HoverableText bolded text={open.quantity} /></div> */}
                    <div className={[classes.medium, classes.oddRow].join(' ')} style={{ background: '#CDE3C0' }}><HoverableText bolded text={open?.quantity} /></div>
                    <div className={[classes.medium, classes.oddRow].join(' ')} style={{ background: '#CDE3C0' }}><HoverableText bolded text={open?.my_stock} /></div>
                    <div className={[classes.medium, classes.oddRow].join(' ')} style={{ background: '#CDE3C0' }}><HoverableText bolded text={open?.store} /></div>
                </div>
                {altDrugs.map((drug, index) => {
                    return <div className={classes.horizontal} style={{ justifyContent: 'center' }}>
                        {!manualSelect ? <div className={[classes.min, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}><Checkbox disabled={remainingQty < Number(drug.ItemSnap.item_unit_size) && drug.selected === false} onChange={e => { selectItem({ checked: e.target.checked, index }) }} /></div> : null}
                        {manualSelect ? <div className={[classes.min, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}><Checkbox disabled={false} onChange={e => { selectManualItem({ checked: e.target.checked, index }); calculateRemining() }} /></div> : null}
                        <div className={[classes.max, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}>{drug && drug.ItemSnap ? drug.ItemSnap.medium_description : ""}</div>
                        {!manualSelect ? <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}><HoverableText bolded text={drug && drug.ItemSnap ? drug.ItemSnap.strength : ""} /></div> : null}
                        {manualSelect ? <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}>
                            <TextField variant="outlined" type="number" size="small" onChange={(e) => {
                                let suggested_qty = (Number(e.target.value) / Number(altDrugs[index].strength)) * Number(defFrequency) * Number(open?.AssignItems[0]?.duration)

                                /*   console.log("editing drug", altDrugs[index])
                                  console.log("editing drug original", open?.AssignItems[0])
                                  console.log("editing drug frequency", defFrequency) */
                                altDrugs[index].dose = e.target.value;
                                altDrugs[index].suggested = Math.ceil(suggested_qty);
                                setAltDrugs([...altDrugs]);
                                calculateRemining()

                            }} placeholder={drug?.dose} value={drug?.dose} disabled={!altDrugs[index].selected} />
                        </div> : null}
                        <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}><HoverableText bolded text={open?.AssignItems[0]?.frequency} /></div>
                        <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}><HoverableText bolded text={open?.AssignItems[0]?.duration} /></div>
                        {/* <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}><HoverableText bolded text={(open?.AssignItems[0]?.dosage * open?.AssignItems[0].duration * drug?.ItemSnap?.DefaultFrequency?.value) / drug?.ItemSnap?.item_unit_size} /></div> */}
                        {/* <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}>{presDynamic === null ? <CircularProgress size={20} /> : (presDynamic[item.pos].remainder) ?? 0}</div> */}
                        <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}>
                            <TextField variant="outlined" type="number" size="small" onChange={(e) => { altDrugs[index].quantity = e.target.value; setAltDrugs([...altDrugs]); }} placeholder={altDrugs[index].suggested} disabled={!altDrugs[index].selected} />
                        </div>

                        <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')} style={{}}><HoverableText bolded text={altDrugs[index]?.my_quantity} /></div>
                        <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')} style={{}}><HoverableText bolded text={altDrugs[index]?.main_warehouse_quantity} /></div>
                    </div>
                })}
                {manualSelect ? <p>Total dosage : {dosageConst}</p> : null}
                {manualSelect ? <p>Remaining dosage : {remainingQty}{open?.ItemSnap.DisplayUnit.name}</p> : null}
            </> : <>
                <h4>Swapped Drugs</h4>
                <div className={[classes.horizontal, classes.top].join(' ')} style={{ justifyContent: 'center' }}>
                    <div className={[classes.min, classes.header].join(' ')}></div>
                    <div className={[classes.max, classes.header].join(' ')}><HoverableText bolded text="Item Name" /></div>
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Quantity" /></div>
                </div>
                <div className={classes.horizontal} style={{ justifyContent: 'center' }}>
                    <div className={[classes.min, classes.oddRow].join(' ')} style={{ background: '#CDE3C0' }}>
                        {/* {sub_index === 0 ? <>{drug.id === 0 ? <AddIcon style={{ color: '#00efa7' }} /> : (drug.id === 1 ? <ArrowUpwardIcon style={{ color: '#00cbff' }} /> : <ArrowDownwardIcon style={{ color: '#ff005d' }} />)}</> : null} */}
                    </div>
                    <div className={[classes.max, classes.oddRow].join(' ')} style={{ background: '#CDE3C0' }}><HoverableText bolded text={open.drug_name} /></div>
                    <div className={[classes.medium, classes.oddRow].join(' ')} style={{ background: '#CDE3C0' }}><HoverableText bolded text={""} /></div>
                    {/* <div className={[classes.medium, classes.oddRow].join(' ')} style={{ background: '#CDE3C0' }}><HoverableText bolded text={open?.issued_quantity} /></div> */}
                </div>
                {altDrugs.map((drug, index) => {
                    return <div className={classes.horizontal} style={{ justifyContent: 'center' }}>
                        <div className={[classes.min, classes.header].join(' ')}></div>
                        <div className={[classes.max, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}><HoverableText bolded text={drug?.drug_name} /></div>
                        <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}><HoverableText bolded text={drug?.issued_quantity} /></div>
                    </div>
                })}
            </>}
        </div>
        <DialogActions>
            <Button size="small" variant="contained" style={{ background: '#ff005d', color: 'white' }} onClick={() => setOpen(null)}>Cancel</Button>
            {!issued ? <Button size="small" variant="contained" style={{ background: '#00cbff', color: 'white' }} onClick={() => {
                let no_error = true;
                for (let i = 0; i < altDrugs.length; i++) {
                    altDrugs[i].frequency = open?.AssignItems[0]?.frequency;
                    altDrugs[i].selected_id = open?.id;
                    altDrugs[i].selected_index = selectedIndex;
                    altDrugs[i].duration = open?.AssignItems[0]?.duration;
                    altDrugs[i].sel_quantity = (altDrugs[i].suggested > 0 && !altDrugs[i].quantity) ? altDrugs[i].suggested : (Number(altDrugs[i].quantity) > 0 ? altDrugs[i].quantity : 0);
                    //altDrugs[i].sel_quantity = altDrugs[i].suggested;
                    if (altDrugs[i].selected && (altDrugs[i].sel_quantity > (Number(altDrugs[i].my_quantity) + Number(altDrugs[i]?.main_warehouse_quantity)))) {
                        no_error = false
                    }

                    if (altDrugs[i].selected && altDrugs[i].ItemSnap?.is_dosage_count == '1') {

                        altDrugs[i].sel_quantity = Math.ceil(altDrugs[i].sel_quantity)
                    }


                }
                //setAlt(open, altDrugs);
                if (no_error) {
                    setAlt(originalDrug, altDrugs);
                    setOpen(null);
                } else {
                    setErrorAlert(true)
                    setMessage("One or more lines contains out of stock items")
                }
                console.log("alt drug", altDrugs)

            }} disabled={remainingQty !== 0}>SWAP</Button> : null}
        </DialogActions>

        <LoonsSnackbar
            open={errorAlert}
            onClose={() => {
                setErrorAlert(false)
            }}
            message={message}
            autoHideDuration={3000}
            severity={'error'}
            elevation={2}
            variant="filled"
        ></LoonsSnackbar>


    </Dialog>
}

export default DrugSwapModal;