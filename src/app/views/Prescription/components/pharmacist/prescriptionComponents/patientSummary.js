import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { Chip, Grid, Icon, Typography } from '@material-ui/core';

const styles = {
    padded: {
        padding: '15px'
    },
    expanded: {
        padding: '5px',
        display: 'flex',
        alignItems: 'center'
    },
    text: {
        fontWeight: 'bold',
        paddingLeft: '10px'
    },
    flexGrid: {
        display: 'flex'
    },
    centered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    active: {
        width: '100%',
        backgroundColor: '#21B8CA',
        color: 'white',
        fontWeight: 'bold'
    }
}

const IconRow = ({icon, text, classes}) => {
    return <div className={classes.expanded}>
        <Icon className="text-25 align-middle">
            {icon}
        </Icon>
        <Typography className={classes.text}>{text}</Typography>
    </div>
}

const PatientSummary = (props) => {
    const { classes, clinicColor = 'grey', clinicFontColor = 'white', prescription, patient } = props;
    return <div className={classes.padded} style={{ backgroundColor: clinicColor, color: clinicFontColor }}>
        <Grid container spacing={2}>
            <Grid className={classes.flexGrid} item xs={2}><IconRow icon='qr_code' text={patient ? patient.phn : ''} classes={classes}/></Grid>
            <Grid className={classes.flexGrid} item xs={2}><IconRow icon='medication' text={prescription ? prescription.id : ''}classes={classes}/></Grid>
            <Grid className={classes.flexGrid} item xs={3}><IconRow icon='assignment_ind' text={prescription ? `${prescription.doctor} | ${prescription.clinic}` : ''} classes={classes}/></Grid>
            <Grid className={classes.flexGrid} item xs={4}><IconRow icon='person' text={patient ? `${patient.name??'-'} | ${patient.age??'-'} | ${patient.gender??'-'} | ${patient.address??'-'}` : ''} classes={classes}/></Grid>
            <Grid className={classes.flexGrid} item xs={1}><div className={classes.centered}><Chip className={classes.active} label={prescription.status} /></div></Grid>
        </Grid>
    </div>
}

PatientSummary.propTypes = {
    clinicColor: PropTypes.string,
    clinicFontColor: PropTypes.string,
    classes: PropTypes.object.isRequired,
    prescription: PropTypes.object.isRequired,
    patient: PropTypes.object.isRequired,
}

export default withStyles(styles)(PatientSummary);