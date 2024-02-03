import React, { useEffect, useRef, useState } from "react";
import { Button, Popover, TextField, Tooltip, IconButton, Snackbar } from "@material-ui/core";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import HoverableText from "app/components/HoverableText";
import { Alert, CircularProgress } from "@mui/material";
import AddCommentOutlinedIcon from '@material-ui/icons/AddCommentOutlined';
import ArchiveIcon from '@mui/icons-material/Archive';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const InsidePrescriptionRow = ({ classes, prescription, warehouse, setDynamic, setExchange, drug, index, toOutside, openSwap, disabled, disabledSubItem, previous }) => {
    const remarkRef = useRef(null);
    const [commentEl, setCommentEl] = useState(null);

    const renderButtons = (item, drug) => {
        return (prescription.status !== "ISSUED" && prescription.status !== "Rejected") ? <>
            {item.doctor_remark ? <Tooltip
                arrow
                title={item.doctor_remark}>
                <IconButton size="small" className={classes.btn} style={{ color: '#009d6d', background: '#c3f7e7' }}>
                    <VisibilityOutlinedIcon style={{ fontSize: '0.9em' }} />
                </IconButton >
            </Tooltip> : null}
            <IconButton size="small" aria-describedby={Boolean(commentEl) ? 'simple-popover' : undefined} className={classes.btn}
                onClick={(e) => { setCommentEl(e.currentTarget); }}
                style={{ color: '#afafaf', background: '#eeeeee' }}>
                <AddCommentOutlinedIcon style={{ fontSize: '0.9em' }} />
            </IconButton >
            <IconButton size="small" className={classes.btn} style={{ color: '#2370ed', background: '#b8d1f9' }} onClick={() => toOutside(drug)}>
                <ArchiveIcon style={{ fontSize: '0.9em' }} />
            </IconButton >
            {/* <IconButton size="small" className={classes.btn} style={{ color: '#c9b500', background: '#f9f5ca' }} onClick={() => openSwap(drug)}>
    <SwapHorizontalCircleIcon />
</IconButton > */}
            {/* {((Number(item.quantity) > Number(drug.my_stock) && Number(item.quantity) > Number(drug.store))) ?
                <IconButton size="small" className={classes.btn} style={{ color: 'white', background: '#ff005d' }} onClick={() => {
                    setExchange(drug);
                }}>
                    <AutorenewIcon style={{ fontSize: '0.9em' }} />
                </IconButton > : null} */}

            {(drug.ItemSnap?.countable == "1") ?
                <IconButton size="small" className={classes.btn} style={{ color: 'white', background: '#ff005d' }} onClick={() => {
                    setExchange(drug);
                }}>
                    <AutorenewIcon style={{ fontSize: '0.9em' }} />
                </IconButton > : null}
        </> : null
    }


    const getRemainder = (item) => {
        if (previous) {
            const prevDrug = (previous.insides.filter((row) => row.drug_id === item.drug_id))[0];
            if (prevDrug) {
                const dayDiff = Math.round((new Date().getTime() - new Date(previous.date).getTime()) / (1000 * 3600 * 24));
                let remaining = 0;
                prevDrug.AssignItems.forEach(itm => {
                    if (Number(itm.duration) > dayDiff) {
                        const requirement = dayDiff * (1 / Number(itm.DefaultFrequency.value));
                        const qdiff = (Number(itm.issued_quantity) - requirement);
                        remaining += (qdiff > 0 ? qdiff : 0)
                    }
                });
                return remaining;
            }
        }
        return 0;
    }

    const displayDiff = (asigned_item) => {
        if (previous) {
            const filtered = previous?.DrugAssign.filter((drg) => drg.drug_id === asigned_item.drug_id);
            if (filtered) {
                if (filtered.length < 1) {
                    return <AddIcon style={{ color: '#00efa7', fontSize: '0.9em' }} />;
                } else {
                    if (Number(asigned_item.quantity) > Number(filtered[0].quantity)) {
                        return <ArrowUpwardIcon style={{ color: '#00cbff', fontSize: '0.9em' }} />;
                    } else if (Number(asigned_item.quantity) < Number(filtered[0].quantity)) {
                        return <ArrowDownwardIcon style={{ color: '#ff005d', fontSize: '0.9em' }} />;
                    }
                }
            }
        }
    }
    const allEqual = (arr, key) => {
        let firstNonNull = null;
        return arr.every((v) => {
            const value = v[key];
            if (value === null) {
                return true;
            }
            if (firstNonNull === null) {
                firstNonNull = value;
                return true;
            }
            return value === firstNonNull;
        });
    };

    return <div>
        {drug.AssignItems ? drug.AssignItems.map((item, sub_index) => {
            let isDisabled = false;
            let isSwaped = false;
            if (disabledSubItem.includes(sub_index) || allEqual(drug.AssignItems, "dosage")) {
                isDisabled = true;
            } else {
                isDisabled = false;
            }
            item.drug_id = drug.drug_id;
            let availability = Number(drug.my_stock) + Number(drug.store) - Number(item.quantity)
           // console.log("drug.AssignItems",drug.AssignItems)
            //console.log("drug.ISSUED",drug.ISSUED)
            if (drug.AssignItems.length < drug.ISSUED.length) {
                isSwaped=true
            }

            return <div className={classes.horizontal} >
                <div className={[classes.min, index % 2 === 0 ? classes.evenRow : classes.oddRow, sub_index > 0 ? classes.noBorder : "", (disabled && isDisabled) ? classes.disabled : ""].join(' ')}>{sub_index === 0 ? <HoverableText bolded text={index + 1} /> : null}</div>
                <div className={[classes.min, index % 2 === 0 ? classes.evenRow : classes.oddRow, sub_index > 0 ? classes.noBorder : "", (disabled && isDisabled) ? classes.disabled : ""].join(' ')}>
                    {displayDiff(item)}
                    {/* {sub_index === 0 ? <>{drug.id === 0 ? <AddIcon style={{ color: '#00efa7' }} /> : (drug.id === 1 ? <ArrowUpwardIcon style={{ color: '#00cbff' }} /> : <ArrowDownwardIcon style={{ color: '#ff005d' }} />)}</> : null} */}
                </div>
                <Button style={{ padding: 0 }} className={[classes.max, index % 2 === 0 ? classes.evenRow : classes.oddRow, sub_index > 0 ? classes.noBorder : "", (disabled && isDisabled) ? classes.disabled : ""].join(' ')} onClick={() => {
                    if (prescription.status !== "Rejected") {
                        openSwap(drug, prescription.status, sub_index)
                    }
                }}>{sub_index === 0 ? <HoverableText bolded text={isSwaped?drug.drug_name+" (Swaped)":drug.drug_name } /> : null}</Button>
                <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow, (disabled && isDisabled) ? classes.disabled : ""].join(' ')}><HoverableText bolded text={`${item.dosage.replace(/[.,]00$/, "")} ${drug.ItemSnap && drug.ItemSnap.DisplayUnit?.name && drug.ItemSnap.DisplayUnit?.name ? drug.ItemSnap.DisplayUnit?.name : "mg"}`} /></div>
                <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow, (disabled && isDisabled) ? classes.disabled : ""].join(' ')}><HoverableText bolded text={item.frequency} /></div>
                <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow, (disabled && isDisabled) ? classes.disabled : ""].join(' ')}><HoverableText bolded text={item.duration} /></div>
                {/* <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow, disabled ? classes.disabled : ""].join(' ')}><HoverableText bolded text={getRemainder(item)} /></div> */}
                <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow, (disabled && isDisabled) ? classes.disabled : ""].join(' ')}><HoverableText bolded text={item.quantity} /></div>
                <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow, (disabled && isDisabled) ? classes.disabled : ""].join(' ')}>
                    <TextField  InputProps={{inputProps: { min: 0}}} variant="outlined" type="number" size="small" disabled={prescription.status === "ISSUED" || disabled} placeholder={prescription.status === "ISSUED" ? item.issued_quantity : item.quantity} onChange={(e) => {
                        if (e.target.value === "") {
                            item.issuing = item.quantity;
                        } else {
                            item.issuing = e.target.value;
                        }
                    }} />
                </div>
                <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow, (disabled && isDisabled) ? classes.disabled : ""].join(' ')}>
                    {renderButtons(item, drug)}
                </div>
                <div style={{ backgroundColor: availability > 0 ? "" : '#f43178' }} className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow, (disabled && isDisabled) ? classes.disabled : ""].join(' ')}>{prescription.status !== "ISSUED" && prescription.status !== "REJECTED" && drug.my_stock ? (Number(drug.my_stock) + Number(drug.store)).toString().replace(/[.,]00$/, "") : ""}</div>
                <div style={{ backgroundColor: availability > 0 ? "" : '#f43178' }} className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow, (disabled && isDisabled) ? classes.disabled : ""].join(' ')}>{prescription.status !== "ISSUED" && prescription.status !== "REJECTED" && drug.other_stock ? drug.other_stock.toString().replace(/[.,]00$/, "") : ""}</div>

                {/* <div style={{ backgroundColor: availability >= 0 ? "" : '#f43178' }} className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow, (disabled && isDisabled) ? classes.disabled : ""].join(' ')}>{prescription.status !== "ISSUED" && prescription.status !== "REJECTED" && drug.my_stock ? drug.my_stock.replace(/[.,]00$/, "") : ""}</div>
                <div style={{ backgroundColor: availability >= 0 ? "" : '#f43178' }} className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow, (disabled && isDisabled) ? classes.disabled: ""].join(' ')}>{prescription.status !== "ISSUED" && prescription.status !== "REJECTED" && drug.store ? drug.store.toString().replace(/[.,]00$/, "") : ""}</div>
             */}
            </div>
        }) : <HoverableText text={drug.toString()} />}
        <Popover
            id={Boolean(commentEl) ? 'simple-popover' : undefined}
            open={Boolean(commentEl)}
            anchorEl={commentEl}
            onClose={() => {
                // const arr = [...params];
                // arr[remarkPos].remark = remarkRef.current.value;
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
}

export default InsidePrescriptionRow;