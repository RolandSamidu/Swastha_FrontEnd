import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { Chip, Grid, Icon, Typography } from '@material-ui/core';
import { dateParse } from 'utils';
import moment from 'moment';
import UtilityServices from 'app/services/UtilityServices'

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

const IconRow = ({ icon, text, classes }) => {
    return <div className={classes.expanded}>
        <Icon className="text-25 align-middle">
            {icon}
        </Icon>
        <Typography className={classes.text}>{text}</Typography>
    </div>
}

const PatientSummary = (props) => {
    const { classes, clinicColor = 'grey', clinicFontColor = 'white', prescription, patient } = props;

    var stillUtc = moment.utc(patient.date_of_birth).toDate();
    var date2 = moment(stillUtc).local().format('YYYY-MM-DD');
    
    var today = moment();

    var diffDuration = moment.duration(today.diff(date2));

    var age = { "age_years": ("0" + diffDuration.years()).slice(-2), "age_months": ("0" + diffDuration.months()).slice(-2), "age_days": ("0" + diffDuration.days()).slice(-2) };
    console.log('age', age)
    let patientAge = age.age_years + "Y - " + age.age_months + "M - " + age.age_days + "D";

    console.log("patient age", patientAge)
    return <div className={classes.padded} style={{ backgroundColor: clinicColor, color: clinicFontColor }}>
        <Grid container spacing={2}>
            <Grid className={classes.flexGrid} item xs={4}><IconRow icon='person' text={patient ? `${patient.name ?? '-'} | ${patientAge ?? '-'} | ${patient.gender ?? '-'} | ${patient.address ?? '-'}` : ''} classes={classes} /></Grid>
            <Grid className={classes.flexGrid} item xs={2}><IconRow icon='qr_code' text={patient ? patient.phn : ''} classes={classes} /></Grid>
            {/* <Grid className={classes.flexGrid} item xs={2}><IconRow icon='phone' text={patient ? (patient.mobile_no ? patient.mobile_no : patient.mobile_no2 ? patient.mobile_no2 : patient.contact_no ? patient.contact_no : patient.contact_no2) : ''} classes={classes} /></Grid> */}
            {/*  <Grid className={classes.flexGrid} item xs={2}><IconRow icon='cake' text={patient ? dateParse(patient.date_of_birth) : ''} classes={classes} /></Grid>
            */} <Grid className={classes.flexGrid} item xs={2}><IconRow icon='medication' text={prescription ? prescription.prescription_no : ''} classes={classes} /></Grid> 
            <Grid className={classes.flexGrid} item xs={3}><IconRow icon='assignment_ind' text={prescription ? `${prescription.Doctor ? prescription.Doctor.name : ''} | ${prescription.Clinic ? prescription.Clinic.name : ''}` : ''} classes={classes} /></Grid>
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