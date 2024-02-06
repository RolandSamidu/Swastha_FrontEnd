import { makeStyles } from "@material-ui/core/styles";
import React from "react";
const useStyles = makeStyles((theme) => ({
    count: {
        fontFamily: 'Inter',
        fontSize: '32px',
        fontWeight: 600,
        lineHeight: '38.73px',
        letterSpacing: '0em',
        textAlign: 'left',
        color: "rgba(255, 255, 255, 1)"
    },
    name: {
        fontFamily: 'Inter',
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: '14.52px',
        letterSpacing: '0em',
        textAlign: 'left',
        color: "rgba(255, 255, 255, 1)"
    }
}));

const WidgetsCounts = ({ count, name, countFontSize }) => {
    const classes = useStyles();
    return (
        <div>
            <div className={classes.count} style={{
                fontSize: countFontSize
            }}>{count}</div>
            <div className={classes.name} >{name}</div>
        </div>
    )
}
export default WidgetsCounts