import React, { Component } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextValidator } from 'react-material-ui-form-validator';
import *  as appConst from './../../../../appconst'
class GrnStatus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            options: []
        };
    }

    render() {
        const { onChange, required } = this.props;

        return (
            <Autocomplete
                disableClearable

                className="w-full"
                options={appConst.GRN_Status}
                onChange={(e, value) => {
                    onChange(value.value)
                }}
                getOptionLabel={(option) => option.label ? (option.label) : ('')
                }
                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        label="Grn Status"
                        fullWidth
                        variant="outlined"
                        size="small"
                        validators={required ? [
                            'required',
                        ] : []}
                        errorMessages={[
                            'This field is required',
                        ]}
                    />
                )}
            />
        );
    }
}

export default GrnStatus;
