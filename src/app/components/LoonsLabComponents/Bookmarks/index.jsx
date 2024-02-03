import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

const styles = {
    wrapper: {
        position: 'relative',
    },
    bookmarkTag: {
        width: 25,
        height: 50,
        backgroundColor: 'red',
        borderRadius: '0px 10px 10px 0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 15px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04)',
        position: 'absolute',
        right: -25,
        cursor: 'pointer'
    },
    rotated: {
        transform: 'rotate(90deg)',
        margin: 0
    }
}

const Bookmarks = (props) => {
    const { classes, children, data, setSelected, selected } = props;
    return <div className={classes.wrapper}>
        {
            data.map((dat, index) => {
                const splitDat = dat?.id?.split(" ");
                if(splitDat){
                return <div key={index} className={classes.bookmarkTag}
                    style={{
                        top: `${(index * 50) - (index * 10) + 170}px`,
                        color: selected && selected.id === dat.id ? '#fcfcfc' : '#707070',
                        background: selected && selected.id === dat.id ? '#1bbfa4' : '#F4F5F9',
                        zIndex: selected && selected.id === dat.id ? 999 : (index + 1)
                    }}
                    onClick={() => setSelected(dat)}>
                    <h5 className={classes.rotated}>{splitDat?.length > 1 ? `${splitDat[0]?.charAt(0)}${splitDat[1]?.charAt(0)}` : `${splitDat[0]?.charAt(0)}${splitDat[0]?.charAt(1)}`}</h5>
                </div>
                }else{
                    return null
                }
            })
        }
        {children}
    </div>
}

Bookmarks.propTypes = {
}

export default withStyles(styles)(Bookmarks);