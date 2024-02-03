/*
Loons Lab Sub title component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import { Divider, Typography } from '@material-ui/core'
import { any } from "prop-types";

class SubTitle extends Component {
    static propTypes = {
        title: any
    };

    static defaultProps = {
        title: null
    };



    render() {
        const {
            title
        } = this.props;


        return (
            <Typography className=" text-gray font-semibold text-13 mt-2" style={{ lineHeight: '1', }}>{title}</Typography>

        );
    }
}

export default SubTitle;