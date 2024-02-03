/*
Loons Lab Button component
Developed By Roshan
Loons Lab
*/
import React, { Component } from "react";
import { Button } from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ValidatorForm } from 'react-material-ui-form-validator'
import PropTypes from "prop-types";
import { scrollToTop } from "utils";
import { debounce } from "lodash";

class ValidatorFormExted extends Component {


    constructor(props) {
        super(props)
        this.state = {
            formDisable: false
        }
    }
    static propTypes = {
        onSubmit: PropTypes.func,
        children: PropTypes.node,
        variant: PropTypes.string,
        className: PropTypes.any,
        disabled: PropTypes.bool,
        color: PropTypes.string,
        type: PropTypes.string,
        style: PropTypes.object,
        id: PropTypes.string
    };

    static defaultProps = {
        className: "",
        style: {}
    };


    onSubmit = event => {
        const { onSubmit, disabled } = this.props;

        if (disabled) return;

        onSubmit &&
            onSubmit({ event });

    };

    renderChildren = (label, children) => {

        if (label) {
            return label;
        }

        if (children) {
            return children;
        }
    };

    handleSubmit(e) {
        if (!this.state.formDisable) {
            this.onSubmit()
            //console.log("submitting")
        }
        this.setState({ formDisable: true })
        setTimeout(() => {
            this.setState({ formDisable: false })
        }, 2000);


    }

    render() {
        const {
            children,
            label,
            className,
            style,
            ...props
        } = this.props;


        return (
            <ValidatorForm className={className} style={style}
                {...props}
                onSubmit={(e) => this.handleSubmit(e)}

            >
                {children}

            </ValidatorForm>


        );
    }
}

export default ValidatorFormExted;