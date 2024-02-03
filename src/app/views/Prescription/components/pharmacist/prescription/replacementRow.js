import React, { useEffect, useRef, useState } from "react";
import { Button, Popover, TextField, Tooltip, IconButton } from "@material-ui/core";
import HoverableText from "app/components/HoverableText";
import { CircularProgress } from "@mui/material";

const ReplacementRow = ({ classes, item }) => {
    return <div>
        <div className={classes.horizontal}>
            <div className={[classes.min, classes.evenRow].join(' ')}><HoverableText bolded text={item.index} /></div>
            <div className={[classes.min, classes.evenRow].join(' ')}>
                {/* {sub_index === 0 ? <>{drug.id === 0 ? <AddIcon style={{ color: '#00efa7' }} /> : (drug.id === 1 ? <ArrowUpwardIcon style={{ color: '#00cbff' }} /> : <ArrowDownwardIcon style={{ color: '#ff005d' }} />)}</> : null} */}
            </div>
            <Button className={[classes.max, classes.evenRow].join(' ')}>{item.name}</Button>
            <div className={[classes.medium, classes.evenRow].join(' ')}><HoverableText bolded text={item.dosage} /></div>
            <div className={[classes.medium, classes.evenRow].join(' ')}><HoverableText bolded text={item.frequency} /></div>
            <div className={[classes.medium, classes.evenRow].join(' ')}><HoverableText bolded text={item.duration} /></div>
            <div className={[classes.medium, classes.evenRow].join(' ')}><HoverableText bolded text={item.quantity} /></div>
            {/* <div className={[classes.medium, index % 2 === 0 ? classes.evenRow : classes.oddRow].join(' ')}>{presDynamic === null ? <CircularProgress size={20} /> : (presDynamic[item.pos].remainder) ?? 0}</div> */}
            <div className={[classes.medium, classes.evenRow].join(' ')}>{item.quantity}</div>
            <div className={[classes.medium, classes.evenRow].join(' ')}></div>
            <div className={[classes.medium, classes.evenRow].join(' ')}></div>
            <div className={[classes.medium, classes.evenRow].join(' ')}></div>
        </div>
    </div>
}

export default ReplacementRow;