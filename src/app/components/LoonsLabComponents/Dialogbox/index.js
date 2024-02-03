/*
Loons Lab loonsDialogBox component
Developed By Sandun
Loons Lab
*/
import React, { Component } from 'react'

import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Typography,
} from '@material-ui/core'

import {
    Button 
} from 'app/components/LoonsLabComponents'

import { Alert } from '@material-ui/lab'

import { scrollToTop } from 'utils'
import PropTypes from 'prop-types'

class LoonsDiaLogBox extends Component {
    static propTypes = {
        title: PropTypes.string,
        title_text_variant: PropTypes.string,

        show_alert: PropTypes.bool,
        alert_severity: PropTypes.string,
        alert_message: PropTypes.string,

        message: PropTypes.string,

        open: PropTypes.bool,
        show_button: PropTypes.bool,

        btn_variant: PropTypes.string,
        btn_color: PropTypes.string,
        btn_type: PropTypes.string, //submit or not
        btn_label: PropTypes.string,

        btn_children: PropTypes.node,
        body_children: PropTypes.node,

        show_second_button: PropTypes.bool,
        second_btn_variant: PropTypes.string,
        second_btn_color: PropTypes.string,
        second_btn_type: PropTypes.string, //submit or not
        second_btn_label: PropTypes.string,

        second_btn_children: PropTypes.node,
        second_body_children: PropTypes.node,
    }

    static defaultProps = {
        open: false,
        name: 'loons_snackBar',
        title: '',
        title_text_variant: 'h5',

        show_alert: false,
        alert_severity: 'success',
        alert_message: '',
        message: '',

        show_button: false,
        btn_variant: 'contained',
        btn_color: 'primary',
        btn_type: '', //submit or not
        btn_label: 'OK',

        show_second_button: false,
        second_btn_variant: 'contained',
        second_btn_color: 'primary',
        second_btn_type: '', //submit or not
        second_btn_label: 'Cancel',



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

    handleSecondButtonAction = (event) => {
        const { secondButtonAction } = this.props
        secondButtonAction &&
            secondButtonAction({
                event,
            })
    }

    renderChildren = (label, children) => {
        if (label) {
            return label
        }

        if (children) {
            return children
        }
    }

    render() {
        const {

            open,

            title,
            title_text_variant,

            show_alert,
            alert_severity,
            alert_message,
            body_children,
            message,

            show_button,
            btn_variant,
            btn_color,
            btn_type,
            btn_label,
            btn_children,

            show_second_button,
            second_btn_variant,
            second_btn_color,
            second_btn_type,
            second_btn_label,
            second_btn_children,
        } = this.props

        return (
            <Dialog open={open} name="dialogBox">
                <DialogTitle>
                    <Typography variant={title_text_variant}>
                        {title}
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    {/* other body content */}
                    {this.renderChildren(message, body_children)}

                    {show_alert === true && (
                        <Alert severity={alert_severity}>
                            <strong>{alert_message}</strong>
                        </Alert>
                    )}
                </DialogContent>

                <DialogActions>
                    {show_button === true && (
                        <Button
                            variant={btn_variant}
                            color={btn_color}
                            type={btn_type}
                            onClick={this.handleButtonClose} //close dialog box
                        >
                            {this.renderChildren(btn_label, btn_children)}
                        </Button>
                    )}

                    {show_second_button === true && (
                        <Button
                            variant={second_btn_variant}
                            color={second_btn_color}
                            type={second_btn_type}
                            onClick={this.handleSecondButtonAction} //close dialog box
                        >
                            {this.renderChildren(second_btn_label, second_btn_children)}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        )
    }
}

export default LoonsDiaLogBox;
