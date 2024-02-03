import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import HoverableText from 'app/components/HoverableText';

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
        width: 'calc(35%)'
    }
}

const TableHead = (props) => {
    const { classes } = props;
    return <div className={classes.tbleHeader}>
        <div className={classes.min}>&nbsp;</div>
        <div className={classes.min}>No.</div>
        <div className={classes.medium}>Route</div>
        <div className={classes.max}>Drug Name</div>
        <div className={classes.medium}>Dose</div>
        <div className={classes.medium}>Freq</div>
        <div className={classes.medium}>Duration</div>
        <div className={classes.medium}></div>
        {/* <div className={classes.medium}>Quantity</div> */}
        <div className={classes.medium}>Action</div>
    </div>
}

TableHead.propTypes = {
}

export default withStyles(styles)(TableHead);