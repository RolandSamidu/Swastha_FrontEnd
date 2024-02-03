/*
Loons Lab Date picker component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import { Card } from '@material-ui/core'
import { any } from "prop-types";

class LoonsCard extends Component {
    static propTypes = {
        title: any,
        style: any,
        children: Node,
    };

    static defaultProps = {
        title: null,

    };



    render() {
        const {
            title,
            children,
            style
        } = this.props;


        return (

            <Card elevation={6} style={style} className="px-main-card py-3">
                {children}
            </Card>


        );
    }
}

export default LoonsCard;