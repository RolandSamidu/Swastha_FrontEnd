/*
Loons Lab Button component
Developed By Roshan
Loons Lab
*/
import React, { Component } from "react";
import { Button } from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from "prop-types";
import { scrollToTop } from "utils";

class LoonsButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formDisable: false
        }
    }
    static propTypes = {
        onClick: PropTypes.func,
        children: PropTypes.node,
        variant: PropTypes.string,
        className: PropTypes.any,
        label: PropTypes.string,
        size: PropTypes.string,
        disabledClassName: PropTypes.string,
        disabled: PropTypes.bool,
        color: PropTypes.string,
        type: PropTypes.string,
        scrollToTop: PropTypes.bool,
        endIcon: PropTypes.string,
        startIcon: PropTypes.string,
        style: PropTypes.object,
        id: PropTypes.string
    };

    static defaultProps = {
        className: "",
        color: "primary",
        label: "",
        progress: false,
        size: "medium",
        variant: "contained",
        disabled: false,
        disabledClassName: "",
        type: 'button',
        scrollToTop: false,
        style: {}
    };

    scrollToTop() {
        scrollToTop();
    }
    handleButtonClick = event => {
        const { onClick, disabled, scrollToTop } = this.props;

        if (disabled) return;


        if (!this.state.formDisable) {
            onClick &&
            onClick({
                event
            });
        if (scrollToTop) {
            this.scrollToTop()
        }
        }
        this.setState({ formDisable: true })
        setTimeout(() => {
            this.setState({ formDisable: false })
        }, 2000);




       
    };

    renderChildren = (label, children) => {

        if (label) {
            return label;
        }

        if (children) {
            return children;
        }
    };

    render() {
        const {
            children,
            label,
            className,
            color,
            size,
            type,
            variant,
            disabled,
            progress,
            startIcon,
            endIcon,
            style,
            disabledClassName,
            id
            // icon
        } = this.props;


        return (

            <Button
                id={id}
                className={className}
                size={size}
                endIcon={endIcon == null ? null : <Icon>{endIcon}</Icon>}
                variant={variant}
                disabled={progress ? true : disabled}
                color={color}
                type={type}
                onClick={this.handleButtonClick}
                //onDoubleClick={()=>{console.log("double Clicked")}}
                style={style}
                startIcon={progress ? <CircularProgress size={24} /> : (startIcon == null ? null : <Icon>{startIcon}</Icon>)}
            >

                {this.renderChildren(label, children)}

            </Button>


        );
    }
}

export default LoonsButton;