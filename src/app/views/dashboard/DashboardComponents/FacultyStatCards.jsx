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

class FacultyStatCards extends Component {
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
            <Grid container spacing={3} className="mb-3">
                <Grid item xs={12} md={6}>
                    <Card
                        className="flex flex-wrap justify-between items-center p-sm-24 "
                        elevation={6}
                        style={{ backgroundColor: themeColors[activeTheme].palette.facultyColors.fogs.light }}
                    >
                        <div className="flex items-center">
                            <img className={classes.icon} src="/assets/images/graduate.png" />
                            <div className="ml-3">
                                <small className="text-hint font-semibold">FACULTY OF GRADUATE STUDIES</small>

                                <h3 style={{ color: themeColors[activeTheme].palette.facultyColors.fogs.main }} className="m-0 mt-1 font-medium">
                                    80
                                </h3>
                            </div>
                        </div>

                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>

                    <Card
                        className="flex flex-wrap justify-between items-center p-sm-24 "
                        elevation={6}
                        style={{ backgroundColor: themeColors[activeTheme].palette.facultyColors.fodd.light }}
                    >
                        <div className="flex items-center">
                            <img className={classes.icon} src="/assets/images/drama.png" />
                            <div className="ml-3">
                                <small className="text-hint font-semibold">FACULTY OF DANCE AND DRAMA</small>

                                <h3 style={{ color: themeColors[activeTheme].palette.facultyColors.fodd.main }} className="m-0 mt-1 font-medium">
                                    50
                                </h3>
                            </div>
                        </div>

                    </Card>



                </Grid>
                <Grid item xs={12} md={6}>
                    <Card
                        className="flex flex-wrap justify-between items-center p-sm-24 "
                        elevation={6}
                        style={{ backgroundColor: themeColors[activeTheme].palette.facultyColors.fom.light }}
                    >
                        <div className="flex items-center">
                            <img className={classes.icon} src="/assets/images/music.png" />
                            <div className="ml-3">
                                <small className="text-hint font-semibold">FACULTY OF MUSIC</small>

                                <h3 style={{ color: themeColors[activeTheme].palette.facultyColors.fom.main }} className="m-0 mt-1 font-medium">
                                    140
                                </h3>
                            </div>
                        </div>

                    </Card>




                </Grid>
                <Grid item xs={12} md={6}>
                    <Card
                        className="flex flex-wrap justify-between items-center p-sm-24 "
                        elevation={6}
                        style={{ backgroundColor: themeColors[activeTheme].palette.facultyColors.fova.light }}
                    >
                        <div className="flex items-center">
                            <img className={classes.icon} src="/assets/images/arts.png" />
                            <div className="ml-3">
                                <small className="text-hint font-semibold">FACULTY OF VISUAL ARTS</small>

                                <h3 style={{ color: themeColors[activeTheme].palette.facultyColors.fova.main }} className="m-0 mt-1 font-medium">
                                    245
                                </h3>
                            </div>
                        </div>

                    </Card>

                </Grid>
            </Grid>

        );
    }
}

export default withStyles(styleSheet)(FacultyStatCards);
