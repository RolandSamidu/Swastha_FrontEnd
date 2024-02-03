import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import HoverableText from 'app/components/HoverableText';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import Rating from '@mui/material/Rating';

import { Button, Tooltip } from '@material-ui/core';
import { dateParse } from 'utils'

import { useState } from 'react';
const styles = {
    row: {
        minHeight: '4em',
        marginTop: 1,
        marginBottomn: 1,
        display: 'flex',
        alignItems: 'center',
        borderLeft: '1px solid #eaeaea',
        borderRight: '1px solid #eaeaea',
    },
    rowEven: {
        background: '#f8f8f8',
        minHeight: '4em',
        marginTop: 1,
        marginBottomn: 1,
        display: 'flex',
        alignItems: 'center',
        borderLeft: '1px solid #eaeaea',
        borderRight: '1px solid #eaeaea',
    },
    min: {
        width: 'calc(5%)',
    },
    medium: {
        width: 'calc(10%)'
    },
    medMax: {
        width: 'calc(15%)',
        textAlign: 'center'
    },
    max: {
        width: 'calc(25%)'
    },
    even: {
        width: 'calc(25%)'
    },
    even2: {
        width: 'calc(32%)'
    },
    btn: {
        padding: 0,
        width: '2em',
        height: '2em',
        minWidth: 0,
        margin: 1
    },
    hovered: {
        border: '1px solid #ffbdbd'
    }
}

const Row = (props) => {
    const { classes, drug, index, remove, select, selected } = props;
    const [hovered, setHovered] = useState(false);

    return <div className={`${((index % 2 === 0) ? classes.rowEven : classes.row)} ${(hovered || selected === index ? classes.hovered : null)}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
    >
        <div className={classes.min}>&nbsp;</div>
        <div className={classes.min}>{`${(index + 1).toString().padStart(2, '0')}.`}</div>
        <div className={classes.max}><HoverableText text={drug.supplier} /></div>
        <div className={classes.medium}><HoverableText text={drug.condition1 ? "YES" : "NO"} /></div>
        <div className={classes.medium}><HoverableText text={drug.condition2 ? "YES" : "NO"} /></div>
        <div className={classes.medium}><HoverableText text={drug.condition3 ? "YES" : "NO"} /></div>
        <div className={classes.medium}><HoverableText text={drug.price} /></div>
        <div className={classes.medium}><HoverableText text={drug.bond} /></div>
        <div className={classes.medium}><HoverableText text={drug.comment} /></div>
        <div className={classes.medium}><HoverableText text={drug.remark} /></div>
        {/* <div className={classes.medMax}><HoverableText text={`${drug.rating}`} /></div> */}
        <div className={classes.medium}>
            <Button className={classes.btn} style={{ color: '#06b6d4', background: '#e1fbff' }}
                onClick={() => { index !== selected ? select(index) : select(null) }}>
                {index === selected ? <SettingsBackupRestoreIcon /> : <EditOutlinedIcon />}
            </Button>
            <Button className={classes.btn} style={{ color: '#ff3f3f', background: '#ffbdbd' }}
                onClick={() => remove(index)}>
                <DeleteOutlinedIcon />
            </Button>
        </div>
    </div>
}

export default withStyles(styles)(Row);