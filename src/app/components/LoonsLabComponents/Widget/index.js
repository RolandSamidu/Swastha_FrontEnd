/*
Loons Lab Date picker component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import { Icon, Badge, IconButton, Grid, Tooltip, Typography, Card, Paper } from '@material-ui/core'
import { any, bool } from "prop-types";
import { Resizable, ResizableBox } from 'react-resizable';
import { MatxLayoutSettings } from "app/components/MatxLayout/settings";
import { themeColors } from "app/components/MatxTheme/themeColors";
import { fullScreenRequest, fullScreenRequestInsideApp, makeid } from '../../../../utils'
import FullscreenIcon from '@material-ui/icons/Fullscreen';

class Widget extends Component {
    static propTypes = {
        style: any,
        title: any,
        children: Node,
        id: any,
        height: any,
        padded: bool
    };

    static defaultProps = {
        title: null,
        style: null,
        height: null,
        id: `widget-${makeid()}`,
        padded: true
    };



    render() {
        const {
            title,
            style,
            height,
            children
        } = this.props;
        let activeTheme = MatxLayoutSettings.activeTheme;
        return (
            <Paper className="border-radius-8" elevation={12} id={this.props.id} /* style={{ borderStyle: "solid", borderColor: "gray", borderWidth: 1 }} */
            //maxConstraints={[300, 300]}
            // height={this.state.height} width={this.state.width} onResize={this.onResize} 
            >
                <Grid
                    //style={{ backgroundColor: "#d2e3fc" }}
                    container className="px-1 pt-3 " >
                    <Grid className="px-1 pl-2" item lg={11} md={11} sm={10} xs={10}>
                        <Typography className="font-semibold" variant="h6" style={{...style, fontSize: 16, color: themeColors[activeTheme].palette.primary.main }}>{title}</Typography>
                    </Grid>
                    <Grid className="flex justify-end" item lg={1} md={1} sm={2} xs={2}>
                        <Tooltip title="Full Screen">
                            <FullscreenIcon
                                onClick={() => {
                                    fullScreenRequestInsideApp(this.props.id);
                                }}
                                className="cursor-pointer" color="action" />
                        </Tooltip>

                    </Grid>

                </Grid>
                <div className={`${this.props.padded ? 'px-2' : null} pb-5 overflow-auto widget-container`} style={{ height: height }}>
                    {children}
                </div>
            </Paper >

        );
    }
}

export default Widget;