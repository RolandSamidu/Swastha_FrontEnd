import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { useState } from 'react';
import { Tooltip,Icon } from '@material-ui/core';

const styles = {
    default: {
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    bolded: {
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontWeight: 'bold'
    }
}

const HoverableViewIcon = (props) => {
    const { classes, text, bold } = props;
    // const [entered, setEntered] = useState(null);
    // const [isOpen, setIsOpen] = useState(false);
    return <Tooltip
        // open={isOpen}
        arrow
        TransitionProps={{ timeout: 1000 }}
        title={text}>
       <Icon style={{color:"#767474",marginTop:5}}>visibility</Icon>
    </Tooltip>
}

HoverableViewIcon.propTypes = {
}

export default withStyles(styles)(HoverableViewIcon);