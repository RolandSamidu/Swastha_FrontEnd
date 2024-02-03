import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { ArrowBackRounded, ArrowForwardRounded } from '@material-ui/icons';
import { Button, IconButton } from '@material-ui/core';
import { useState } from 'react';

const styles = {
    outer: {
        height: '5em'
    },
    horizontal: {
        display: 'flex',
    },
    primary: {
        color: '#06b6d4'
    },
    btnContainer: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-evenly'
    },
    btn: {
        background: '#f8f8f8',
        fontWeight: 'bold',
        borderRadius: '0.6em'
    },
    btnSelected: {
        background: '#06b6d4',
        fontWeight: 'bold',
        color: 'white',
        borderRadius: '0.6em'
    }
}

const PrevDates = (props) => {
    const { classes, dates, selected, setSelected, page, fetchHistory } = props;
    const [first, setFirst] = useState(dates.length > 1 ? 1 : 0);

    return <div className={classes.outer}>
        <div className={classes.horizontal}>
            <IconButton className={classes.primary} onClick={() => { 
                if (page === 1 && first > 0) {
                    setFirst(first - 1)
                } else {
                    fetchHistory(page - 1)
                }
                }}><ArrowBackRounded /></IconButton>
            <div className={classes.btnContainer}>
                {dates.length > first ? <Button className={selected === first ? classes.btnSelected : classes.btn} onClick={() => setSelected(first)}>{dates[first]}</Button> : null}
                {dates.length > (first + 1) ? <Button className={selected === (first + 1) ? classes.btnSelected : classes.btn} onClick={() => setSelected((first + 1))}>{dates[(first + 1)]}</Button> : null}
                {dates.length > (first + 2) ? <Button className={selected === (first + 2) ? classes.btnSelected : classes.btn} onClick={() => setSelected((first + 2))}>{dates[(first + 2)]}</Button> : null}
            </div>
            <IconButton className={classes.primary} onClick={() => { fetchHistory(page + 1) }}><ArrowForwardRounded /></IconButton>
        </div>
    </div>
}

PrevDates.propTypes = {
}

export default withStyles(styles)(PrevDates);