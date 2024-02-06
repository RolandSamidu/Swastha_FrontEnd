import { makeStyles } from "@material-ui/core/styles";
import SideImg from "../../../../assets/Group 108.png";
import React from "react";
const useStyles = makeStyles((theme) => ({
    widgetContainer: {
        width: "400px",
        borderRadius: "10px",
        boxShadow: "0px 0px 50px 10px rgba(0, 0, 0, 0.05)",
        padding: "20px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    mainContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

    },
    title: {
        fontFamily: 'Inter',
        fontSize: '20px',
        fontWeight: 600,
        lineHeight: '24.2px',
        letterSpacing: '0em',
        textAlign: 'left',
        color: "rgba(255, 255, 255, 1)"
    },
    timeAgo: {
        fontFamily: 'Inter',
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '14.52px',
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

const Widgets2 = ({ title, background, children, timeAgo, height }) => {
    const classes = useStyles();
    return (
        <div className={classes.widgetContainer} style={{
            background: background,
            backgroundImage: `url(${SideImg})`,
            backgroundPosition: "right",
            backgroundRepeat: "no-repeat",
            height: height ? height : "130px"
        }}
        >
            <div className={classes.mainContainer}>
                <div className={classes.title}>
                    {title}
                </div>
                <div className={classes.timeAgo}>
                    {timeAgo}
                </div>
            </div>

            {children}
        </div>
    )
}
export default Widgets2