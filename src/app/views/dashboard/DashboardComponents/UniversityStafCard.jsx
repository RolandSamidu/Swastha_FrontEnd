import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { Grid, Card, Icon, IconButton, Tooltip } from '@material-ui/core'

import { themeColors } from "app/components/MatxTheme/themeColors";
import { MatxLayoutSettings } from "app/components/MatxLayout/settings";




const styleSheet = ((palette, ...theme) => ({
    icon: {
        height: 48
    }
}));

class UniversityStafCard extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        let { theme } = this.props;
        const { classes } = this.props;
        let { palette } = this.props;
        let activeTheme = MatxLayoutSettings.activeTheme;
        return (
            <Card className="">
                <Card
                    elevation={6}
                    className="flex flex-wrap justify-between items-center p-sm-24 bg-light-primary"
                >
                    <div className="flex items-center">
                        <img className={classes.icon} src="/assets/images/acadamic_staf.png" />
                        <div className="ml-3">
                            <small className="text-hint font-semibold">ACADEMIC STAF</small>

                            <h3 style={{ color: themeColors[activeTheme].palette.facultyColors.fodd.main }} className="m-0 mt-1 font-medium">
                                50
                            </h3>
                        </div>
                    </div>
                    <div className="flex items-center mt-18">
                        <img className={classes.icon} src="/assets/images/non-acedamic.png" />
                        <div className="ml-3">
                            <small className="text-hint font-semibold">NON-ACADEMIC STAF</small>

                            <h3 style={{ color: themeColors[activeTheme].palette.facultyColors.fodd.main }} className="m-0 mt-1 font-medium">
                                50
                            </h3>
                        </div>
                    </div>
                </Card>
            </Card>

        );
    }
}

export default withStyles(styleSheet)(UniversityStafCard);
