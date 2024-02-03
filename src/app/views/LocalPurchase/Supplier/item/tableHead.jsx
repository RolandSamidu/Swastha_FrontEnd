import React from 'react';
import { withStyles } from '@material-ui/styles';

const styles = {
    tbleHeader: {
        height: '3em',
        border: '1px solid #eaeaea',
        borderBottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        fontWeight: 'bold',
        color: '#374151'
    },
    min: {
        width: 'calc(5%)',
    },
    medium: {
        width: 'calc(55%/6)'
    },
    medMax: {
        width: 'calc(15%)',
        textAlign: 'center'
    },
    max: {
        width: 'calc(28%)'
    }
}

const TableHead = (props) => {
    const { classes } = props;
    return <div className={classes.tbleHeader}>
        <div className={classes.min}>&nbsp;</div>
        <div className={classes.min}>No.</div>
        <div className={classes.max}>SR No</div>
        <div className={classes.medMax}>Item Name</div>
        <div className={classes.medMax}>Brand Name</div>
        <div className={classes.medMax}>Agent Name</div>
        {/* <div className={classes.medMax}>Dosser No</div> */}
        <div className={classes.medMax}>MQP (Rs)</div>
        <div className={classes.medium}>Action</div>
    </div>
}

export default withStyles(styles)(TableHead);