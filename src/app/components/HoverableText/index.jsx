import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { useState } from 'react';
import { Tooltip } from '@material-ui/core';

const styles = {
    default: {
        padding: 0,
        margin: 0,
        fontSize: '0.9em',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    bolded: {
        padding: 0,
        margin: 0,
        fontSize: '0.9em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontWeight: 'bold'
    }
}

const HoverableText = (props) => {
    const { classes, text, bold } = props;
    // const [entered, setEntered] = useState(null);
    // const [isOpen, setIsOpen] = useState(false);
    return <Tooltip
        // open={isOpen}
        arrow
        TransitionProps={{ timeout: 1000 }}
        title={text}>
            
        <p
            // onMouseEnter={() => {
            //     setEntered(new Date().getTime());
            //     setTimeout(()=>{
            //     if(entered) {
            //         setIsOpen(true);
            //     }
            // },2000)}}
            // onMouseLeave={() => setEntered(null)}
            InputProps={{
                inputProps: { min: 0},
               
              }}
            className={bold ? classes.bolded : classes.default}>{text}</p>
    </Tooltip>
}

HoverableText.propTypes = {
}

export default withStyles(styles)(HoverableText);