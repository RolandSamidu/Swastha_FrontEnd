import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import SideImg from "../../../../assets/Group 108.png";
const useStyles = makeStyles((theme) => ({
    widgetContainer: {
        minWidth: "400px",
        height: "130px",
        borderRadius: "10px",
        boxShadow: "0px 0px 50px 10px rgba(0, 0, 0, 0.05)",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    title: {
        fontFamily: 'Inter',
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: '19.36px',
        letterSpacing: '0em',
        textAlign: 'left',
        color: "rgba(255, 255, 255, 1)"
    },
    children: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
}));

const Widgets1 = ({ title, background, children }) => {
    const classes = useStyles();
    return (
        <div className={classes.widgetContainer} style={{
            background: background,
            backgroundImage: `url(${SideImg})`,
            backgroundPosition: "right",
            backgroundRepeat: "no-repeat",
        }}
        >
            <div className={classes.title}>
                {title}
            </div>
            <div className={classes.children}>
                {children}
            </div>
        </div>
    )
}
export default Widgets1