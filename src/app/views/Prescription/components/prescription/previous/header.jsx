import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { dateParse, dateTimeParse } from 'utils';

const styles = {
    title: {
        background: '#fff5cd',
        width: '100%',
        height: '3em',
        color: '#374151',
        fontWeight: 'bold',
        paddingLeft: '1em',
        display: 'flex',
        alignItems: 'center'
    }
}

const Header = (props) => {
    const { classes, date, doctor } = props;
    return <div className={classes.title}>
        {dateParse(date)} - {doctor.name}
    </div>
}

Header.propTypes = {
}

export default withStyles(styles)(Header);