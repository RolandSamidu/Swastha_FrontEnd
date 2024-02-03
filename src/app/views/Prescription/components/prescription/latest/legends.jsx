import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

const styles = {
    icoContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    ico: {
        width: '1.3em',
        height: '1.3em'
    },
    icoText: {
        margin: 0,
        padding: '0 1em'
    }
}

const Legends = (props) => {
    const { classes } = props;
    return <div className={classes.icoContainer} style={{ margin: '1em 0' }}>
        <div className={classes.icoContainer}><img className={classes.ico} src="/assets/icons/injection.svg" alt='Injection'/><p className={classes.icoText}>Injection</p></div>
        <div className={classes.icoContainer}><img className={classes.ico} src="/assets/icons/insulin.svg" alt='Insulin'/><p className={classes.icoText}>Insulin</p></div>
        <div className={classes.icoContainer}><img className={classes.ico} src="/assets/icons/lowstock.svg" alt='Out of Stock'/><p className={classes.icoText}>Out of Stock</p></div>
        <div className={classes.icoContainer}><img className={classes.ico} src="/assets/icons/remaining.svg" alt='Remaining'/><p className={classes.icoText}>Remaining</p></div>
        <div className={classes.icoContainer}><img className={classes.ico} src="/assets/icons/allergy.svg" alt='Allergic'/><p className={classes.icoText}>Allergic</p></div>
        <div className={classes.icoContainer}><img className={classes.ico} src="/assets/icons/duplicate.svg" alt='Duplicate'/><p className={classes.icoText}>Duplicate</p></div>
    </div>
}

Legends.propTypes = {
}

export default withStyles(styles)(Legends);