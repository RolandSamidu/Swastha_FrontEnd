import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { MainContainer, Widget } from 'app/components/LoonsLabComponents';
import PrevDates from './dates';
import { useState } from 'react';
import Header from './header';
import Row from './row';
import { useEffect } from 'react';
import { LinearProgress } from '@mui/material';

const styles = {
    prevContainer: {
        width: '100%'
    },
}

const PreviousPrescriptions = (props) => {
    const { classes, prescription } = props;

    return prescription ? <div className={classes.prevContainer}>
        {/* <PrevDates dates={dates} selected={selected} setSelected={setSelected} page={page} fetchHistory={fetchHistory} /> */}
        <Header date={prescription.date} doctor={prescription.Doctor.name} />
        {
            prescription ? prescription.DrugAssign.map((drug, index) => <Row key={index} texts={drug} index={index} />) : null
        }
    </div> : <div>No previous prescriptions found</div>
}

PreviousPrescriptions.propTypes = {
}

export default withStyles(styles)(PreviousPrescriptions);