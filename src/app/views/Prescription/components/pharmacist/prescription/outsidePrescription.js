import React from "react";
import { Button, TextField, Tooltip } from "@material-ui/core";
import HoverableText from "app/components/HoverableText";
import { CircularProgress } from "@mui/material";
import UnarchiveIcon from '@mui/icons-material/Unarchive';

const OutsidePrescription = ({ classes, prescription, presDynamic, warehouse, setDynamic, setExchange, toInside }) => {

    return <>
        <div className={[classes.horizontal, classes.top].join(' ')}>
            <div className={[classes.min, classes.header].join(' ')}>#</div>
            <div className={[classes.min, classes.header].join(' ')}></div>
            <div className={[classes.max, classes.header].join(' ')}><HoverableText bolded text="Item Name" /></div>
            <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Dose" /></div>
            <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Frequency" /></div>
            <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Duration" /></div>
            <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Suggested Qty" /></div>
            <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Qty" /></div>
            <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Action" /></div>
            <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="My Stock" /></div>
        </div>
        <>
            {prescription && prescription.outsides.length > 0 ? prescription.outsides.map((drug, index) => <div>
                {drug.AssignItems ? drug.AssignItems.map((item, sub_index) => <div className={classes.horizontal}>
                    <div className={[classes.min, index % 2 === 0 ? classes.evenRow : classes.oddRow, sub_index > 0 ? classes.noBorder : ""].join(' ')}>{sub_index === 0 ? <HoverableText bolded text={index + 1} /> : null}</div>
                    <div className={[classes.min, index % 2 === 0 ? classes.evenRow : classes.oddRow, sub_index > 0 ? classes.noBorder : ""].join(' ')}>
                        {/* {sub_index === 0 ? <>{drug.id === 0 ? <AddIcon style={{ color: '#00efa7' }} /> : (drug.id === 1 ? <ArrowUpwardIcon style={{ color: '#00cbff' }} /> : <ArrowDownwardIcon style={{ color: '#ff005d' }} />)}</> : null} */}
                    </div>
                    <Button style={{ padding: 0 }} className={[classes.max, index % 2 === 0 ? classes.evenRow : classes.oddRow, sub_index > 0 ? classes.noBorder : ""].join(' ')}>{sub_index === 0 ? <HoverableText bolded text={drug.drug_name} /> : null}</Button>
                    <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}><HoverableText bolded text={`${item.dosage.replace(/[.,]00$/, "")} ${drug.ItemSnap && drug.ItemSnap.DisplayUnit?.name && drug.ItemSnap.DisplayUnit?.name ? drug.ItemSnap.DisplayUnit?.name : "mg"}`} /></div>
                    <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}><HoverableText bolded text={item.frequency} /></div>
                    <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}><HoverableText bolded text={item.duration} /></div>
                    <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}><HoverableText bolded text={item.quantity} /></div>
                    {/* <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}>{presDynamic === null ? <CircularProgress size={20} /> : (presDynamic[item.pos].remainder) ?? 0}</div> */}
                    <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}><HoverableText bolded text={item.quantity} /></div>
                    <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}>
                        {(prescription.status !== "ISSUED" && prescription.status !== "Rejected" && drug.drug_id !== null && drug.sr_no !== null) ? <Tooltip
                            arrow
                            title="To Inside">
                            <Button className={classes.btn} style={{ color: '#2370ed', background: '#b8d1f9' }} onClick={() => toInside(drug, prescription)}>
                                <UnarchiveIcon style={{ fontSize: '0.9em' }} />
                            </Button>
                        </Tooltip>
                            : null}
                    </div>
                    <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}>{drug.my_stock ? drug.my_stock.replace(/[.,]00$/, "") : ""}</div>
                </div>) : <HoverableText text={drug.toString()} />}
            </div>) : null}
        </>
    </>
}

export default OutsidePrescription;