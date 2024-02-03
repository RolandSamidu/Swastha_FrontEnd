/*
Loons Lab Main Container component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
class MainContainer extends Component {
    static propTypes = {
        children: Node,
    };

    static defaultProps = {
        title: null,

    };



    render() {
        const {
            children
        } = this.props;


        return (

            <div className="pb-8 pt-2 px-main-8">
                {children}
            </div>


        );
    }
}

export default MainContainer;