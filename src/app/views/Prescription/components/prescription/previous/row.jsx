import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import HoverableText from 'app/components/HoverableText';
import HoverableViewIcon from 'app/components/HoverableViewIcon';
const styles = {
    row: {
        height: '4em',
        paddingLeft: '1em',
        paddingRight: '1em',
        display: 'flex',
        alignItems: 'center'
    },
    col: {
        width: 'calc(100%/3)',
    }
}

const Row = (props) => {
    const { classes, texts, index } = props;
    console.log("row pre",texts)
    return <div style={{ height: `${texts.height * 4}em`, background: index%2 === 0 ? '#dbbd96' : 'rgb(252 238 219)',
    marginTop: 1,
    marginBottomn: 1, }}>
        {
            texts.rows.length > 0 ? texts.rows.map((item,index) => <div key={index} className={classes.row}>
                <div className={classes.col}><HoverableViewIcon text={item.drug} /></div>
                <div className={classes.col}><HoverableText text={item.dosage} /></div>
                <div className={classes.col}><HoverableText text={item.frequency} /></div>
                <div className={classes.col}><HoverableText text={`${item.duration} Days`} /></div>
            </div>) : <div className={classes.row}></div>
        }
    </div>
}

Row.propTypes = {
}

export default withStyles(styles)(Row);