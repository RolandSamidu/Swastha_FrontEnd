/*
Loons Lab LoonsSnackbar component
Developed By Sandun
Loons Lab
*/
import React, { Component } from 'react'

import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import PropTypes from 'prop-types'
import { scrollToTop } from 'utils'

class LoonsSnackbar extends Component {
    static propTypes = {
        open: PropTypes.bool,
        className: PropTypes.string,
        message: PropTypes.string,
        anchorOrigin: PropTypes.object,
        children: PropTypes.node,
        severity: PropTypes.string,
        autoHideDuration: PropTypes.number,
    }

    static defaultProps = {
        open: false,
        className: "",
        message: "",
        name: "loons_snackBar",
        severity: "success",
        autoHideDuration: 3000,
        anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
        },
        elevation: 6,
        variant: "filled"
    }

    // scrollToTop() {
    //     scrollToTop()
    // }

    handleButtonClose = (event) => {
        const { onClose } = this.props
        onClose &&
            onClose({
                event,
            })
    }

    renderChildren = (message, children) => {

        if (message) {
            return message;
        }

        if (children) {
            return children;
        }
    };

    render() {
        const {
            open,
            className,
            severity,
            autoHideDuration,
            anchorOrigin,
            children,
            message,
            elevation,
            variant

        } = this.props

        return (
            <Snackbar
                name="loons_snackBar"
                open={open}
                className={className}
                anchorOrigin={anchorOrigin}
                autoHideDuration={autoHideDuration}
                onClose={this.handleButtonClose}
            >
                <Alert elevation={elevation} variant={variant} severity={severity} onClose={this.handleButtonClose}>
                    {this.renderChildren(message, children)}
                </Alert>
            </Snackbar>
        )
    }
}

export default LoonsSnackbar;
