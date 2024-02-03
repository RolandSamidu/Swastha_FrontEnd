/*
Loons Lab Date picker component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import Icon from '@material-ui/core/Icon';
import PropTypes from "prop-types";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@material-ui/core";
import { dateParse } from "utils";

const defaultMaterialTheme = createTheme({
    overrides: {
        MuiInputBase: {
            root: {
                height: "36px",
                fontSize: "inherit"
            }
        },
        MuiOutlinedInput: {
            root: {
                border: "1px solid rgb(229, 231, 235)",
                margin: '1.67px',
                backgroundColor: "white",
            },
            adornedEnd: {
                paddingRight: 0,
                color: "black"
            }
        }
    },
})


class LoonsDatePicker extends Component {
    static propTypes = {
        id: PropTypes.string,
        onChange: PropTypes.func,
        children: PropTypes.node,
        variant: PropTypes.string,
        className: PropTypes.string,
        label: PropTypes.string,
        style: PropTypes.any,
        size: PropTypes.string,
        clearable: PropTypes.any,
        value: PropTypes.any,
        views: PropTypes.any,
        openTo: PropTypes.any,
        placeholder: PropTypes.string,
        minDate: PropTypes.any,
        maxDate: PropTypes.any,
        required: PropTypes.bool,
        errorMessages: PropTypes.string,
        format: PropTypes.string,
        disabled: PropTypes.bool,
        design: PropTypes.bool,
    };

    static defaultProps = {
        id: null,
        clearable: true,
        className: "mb-4 w-full",
        color: "primary",
        label: "",
        size: "small",
        variant: "outlined",
        value: null,

        disabled: false,
        design: false,
        //minDate: null,//new Date("2020-10-20")
        //maxDate: null,
        required: false,
        errorMessages: "",
        disabledClassName: "",
        placeholder: "DD/MM/YYYY",
        style: null,
        format: "dd/MM/yyyy"
    };

    handleDateChange = date => {
        const { onChange } = this.props;
        onChange &&
            onChange(
                dateParse(date)
            );
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
            id,
            clearable,
            className,
            value,
            label,
            placeholder,
            variant,
            size,
            openTo,
            minDate,
            maxDate,
            format,
            required,
            disabled,
            design,
            views,
            errorMessages,
            style

        } = this.props;

        return (
            <div>
                {design ?
                    <ThemeProvider theme={defaultMaterialTheme}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                id={id}
                                openTo={openTo}
                                clearable
                                className={className}
                                inputVariant={variant}
                                value={value}
                                label={label}
                                // style={style}
                                size={size}
                                views={views}
                                placeholder={placeholder}
                                onChange={date => this.handleDateChange(date)}
                                minDate={minDate}
                                maxDate={maxDate}
                                format={format}
                                autoOk={true}
                                required={required}
                                disabled={disabled}
                                //error={required ? (value == null ? true : false) : false}
                                //helperText={this.props.StartDate ? "Some error message" : errorMessages}
                                KeyboardButtonProps={{
                                    'aria-label': { label },
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </ThemeProvider> :
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            id={id}
                            openTo={openTo}
                            clearable
                            className={className}
                            inputVariant={variant}
                            value={value}
                            label={label}
                            // style={style}
                            size={size}
                            views={views}
                            placeholder={placeholder}
                            onChange={date => this.handleDateChange(date)}
                            minDate={minDate}
                            maxDate={maxDate}
                            format={format}
                            autoOk={true}
                            required={required}
                            disabled={disabled}
                            //error={required ? (value == null ? true : false) : false}
                            //helperText={this.props.StartDate ? "Some error message" : errorMessages}
                            KeyboardButtonProps={{
                                'aria-label': { label },
                            }}
                        />
                    </MuiPickersUtilsProvider>
                }
            </div>
        );
    }
}

export default LoonsDatePicker;