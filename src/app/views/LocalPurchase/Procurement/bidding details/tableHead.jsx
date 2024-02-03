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
        width: 'calc(25%)'
    }
}

const TableHead = (props) => {
    const { classes } = props;
    return <div className={classes.tbleHeader}>
        <div className={classes.min}>&nbsp;</div>
        <div className={classes.min}>No.</div>
        <div className={classes.max}>Supplier</div>
        <div className={classes.medium}>Criteria 1</div>
        <div className={classes.medium}>Criteria 2</div>
        <div className={classes.medium}>Criteria 3</div>
        <div className={classes.medium}>Bid Price</div>
        <div className={classes.medium}>Bid Bond</div>
        <div className={classes.medium}>Comments</div>
        <div className={classes.medium}>Remarks</div>
        <div className={classes.medium}>Action</div>
    </div>
}

export default withStyles(styles)(TableHead);