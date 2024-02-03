import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Icon, IconButton } from '@material-ui/core';
import { dateParse } from 'utils';

const styles = {
    tab: {
        width: '100%',
        height: '100%',
        borderBottom: '1px solid #bababa',
        borderLeft: '0.5px solid #bababa',
        borderRight: '0.5px solid #bababa',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
    },
    selectedTab: {
        width: '100%',
        height: '100%',
        borderLeft: '0.5px solid #bababa',
        borderRight: '0.5px solid #bababa',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
    },
    btn: {
        borderBottom: '1px solid #bababa',
    },
    header: {
        margin: 0
    }
}

const PrescriptionList = (props) => {
    const { classes, prescriptions, setPrescription } = props;
    const [startingVal, setStartingVal] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if(prescriptions.length > 0){
            setPrescription(prescriptions[0]);
        }
    }, []);

    const TabItem = ({ pos }) => {
        if (prescriptions.length > pos) {
            return <div className={selectedIndex === pos ? classes.selectedTab : classes.tab}
                onClick={() => { setSelectedIndex(pos); setPrescription(prescriptions[pos]) }}>
                <h5 className={classes.header}>{prescriptions[pos].issuePoint} - {dateParse(prescriptions[pos].date)} - {prescriptions[pos].status}</h5>
                {pos === 0 ? <p style={{ margin: 0 }}>(Current)</p> : null}
            </div>
        } else {
            return null;
        }
    }

    return <div style={{ display: 'flex' }}>
        <div className={classes.btn}>
            <IconButton
                children={<Icon className="text-25 align-middle">arrow_back_ios</Icon>}
                onClick={() => setStartingVal(startingVal - 3)}
                disabled={startingVal < 1}
            />
        </div>
        <Grid container spacing={0} style={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item xs={4}><TabItem pos={startingVal} /></Grid>
            <Grid item xs={4}><TabItem pos={startingVal + 1} /></Grid>
            <Grid item xs={4}><TabItem pos={startingVal + 2} /></Grid>
        </Grid>
        <div className={classes.btn}>
            <IconButton
                children={<Icon className="text-25 align-middle">arrow_forward_ios</Icon>}
                onClick={() => setStartingVal(startingVal + 3)}
                disabled={prescriptions.length < (startingVal + 3)}
            />
        </div>
    </div>
}

PrescriptionList.propTypes = {
}

export default withStyles(styles)(PrescriptionList);