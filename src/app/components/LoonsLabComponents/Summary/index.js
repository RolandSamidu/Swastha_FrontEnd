/*
Loons Lab Main title component
Developed By Sathsara
Loons Lab
*/
import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        textAlign: 'center',
        height: '3em',
    },
    value: {
        fontWeight: 'bold'
    }
};

function Summary(props) {
    const { classes, title, value } = props;
    return <div className={classes.container}>
        <Typography className={classes.title} variant="p">{title}</Typography>
        <Typography className={classes.value} variant="h4">{value}</Typography>
    </div>;
}

Summary.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Summary);