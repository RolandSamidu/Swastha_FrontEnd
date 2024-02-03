/*
Loons Lab Main title component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import { Divider, Typography } from '@material-ui/core'

class MainTitle extends Component {
    static propTypes = {
        title: String
    };

    static defaultProps = {
        title: null
    };



    render() {
        const {
            title
        } = this.props;


        return (
            <Typography variant="h6">{title}</Typography>
        );
    }
}

export default MainTitle;