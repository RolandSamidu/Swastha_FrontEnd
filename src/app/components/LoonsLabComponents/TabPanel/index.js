/*
Loons Lab Sub title component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import { Divider, Typography } from '@material-ui/core'
import { any } from "prop-types";
import PropTypes from "prop-types";

class TabPanel extends Component {
    static propTypes = {
        title: any,
        children: PropTypes.node,
        value: any,
        index: any,

    };

    static defaultProps = {

    };
    renderChildren = (children) => {

        return children;

    };


    render() {
        const {
            title, children, value, index, ...other
        } = this.props;


        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`scrollable-auto-tabpanel-${index}`}
                aria-labelledby={`scrollable-auto-tab-${index}`}
                {...other}
            >
                {value === index && (
                    this.renderChildren(children)
                )}
            </div>
        );
    }
}

export default TabPanel;