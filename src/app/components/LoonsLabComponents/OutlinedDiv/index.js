import React from "react";

import TextField from "@material-ui/core/TextField";
import { TextValidator } from 'react-material-ui-form-validator'

const InputComponent = ({ inputRef, ...other }) => <div {...other} />;
const OutlinedDiv = ({ children, label, validators, errorMessages, value }) => {
    return (
        <TextValidator
            className="w-full"
            variant="outlined"
            label={label}
            value={value}
            multiline
            validators={validators}
            errorMessages={errorMessages}
            InputLabelProps={{ shrink: true }}
            InputProps={{
                inputComponent: InputComponent
            }}
            inputProps={{ children: children }}
        />
    );
};
export default OutlinedDiv;