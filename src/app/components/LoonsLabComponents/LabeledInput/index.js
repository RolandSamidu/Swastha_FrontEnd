/*
Loons Lab Main label component
Developed By Sathsara
Loons Lab
*/
import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { TextValidator } from 'react-material-ui-form-validator';
import SubTitle from '../SubTitle';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import RangePicker from '../RangePicker';
import LoonsDatePicker from '../DatePicker';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'center'
    },
};

function LabeledInput(props) {
    const { classes, label, inputType, data, value, onUpdate,multiple } = props;
    return <div className={classes.container}>
        <SubTitle title={label} />
        {inputType === "text" ? <TextValidator
            className="w-full"
            placeholder={label}
            name={label}
            InputLabelProps={{
                shrink: false,
            }}
            type="text"
            variant="outlined"
            size="small"
            onChange={onUpdate}
            value={value}
        /> : null}
        {inputType === "dropdown" ? <Autocomplete
                                        disableClearable
            className="w-full"
            options={data ? data : []}
            getOptionLabel={(option) => option.label}
            onChange={onUpdate}
            value={value}
            multiple={multiple}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={label}
                    fullWidth
                    variant="outlined"
                    size="small"
                />
            )}
        /> : null}
        {inputType === "range" ? <RangePicker onComplete={(obj)=>onUpdate(obj)}/>: null}
        {inputType === "date" ? <LoonsDatePicker onChange={onUpdate} value={value}/>: null}
    </div>;
}

LabeledInput.propTypes = {
    label: PropTypes.string.isRequired,
    inputType: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default withStyles(styles)(LabeledInput);