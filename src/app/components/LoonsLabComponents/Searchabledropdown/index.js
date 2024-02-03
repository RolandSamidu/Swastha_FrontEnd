/*
Loons Lab LoonsSnackbar component
Developed By Sandun
Loons Lab
*/
import React, { Component } from 'react'
import {
    Card,
    TextField,
    MenuItem,
    IconButton,
    Icon,
    Grid,
    Switch,
    Typography,
    Divider,
    Tooltip,
    CircularProgress,
    TableCell,
    Table,
    TableBody,
    TableRow,
    Radio,
    RadioGroup,
    FormGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Dialog
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import InputAdornment from "@material-ui/core/InputAdornment";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from "@material-ui/icons/Search";

import PropTypes from 'prop-types'
import { scrollToTop } from 'utils'

class Searchabledropdown extends Component {

    constructor(props) {
        super(props)
        this.state = {
            focus: false,
            dialogView: false
        }
    }
    static propTypes = {
        variant: PropTypes.string,
        size: PropTypes.string,
        validators: PropTypes.string,
        errorMessages: PropTypes.string,
        placeholder: PropTypes.string,
        dialogBoxComponent: Node,
        //value:PropTypes.any

    }

    static defaultProps = {
        variant: "outlined",
        size: "small",
        validators: null,
        errorMessages: null,
        placeholder: null,
        // type:"null"
        //value:null
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
    dialogBoxClose() {
        this.setState({ dialogView: false })
    }

    render() {
        const {
            open,
            variant,
            size,
            type,
            validators,
            errorMessages,
            placeholder,
            dialogBoxComponent,
            // value,
            ...rest

        } = this.props

        return (
            <Grid container className='w-full' >
                <Grid onFocus={() => this.setState({ focus: true })} onBlur={() => this.setState({ focus: false })} className='w-full' >
                    <Autocomplete
                                        disableClearable
                        {...rest}
                        forcePopupIcon={true}
                        popupIcon={
                            this.state.focus ?
                                <SearchIcon onClick={() => { this.setState({ dialogView: true }) }} />
                                : null
                        }

                        renderInput={(params) => (
                            <TextValidator
                                {...params}

                                fullWidth
                                validators={validators}
                                errorMessages={errorMessages}
                                //type={type}
                                placeholder={placeholder}
                                variant={variant}
                                size={size}
                            />
                        )}
                    />
                </Grid>


                <Dialog maxWidth="xs" open={this.state.dialogView} onClose={() => { this.setState({ dialogView: false }) }}>
                    <div className="p-8 text-center w-360 mx-auto">
                        {dialogBoxComponent}
                    </div>
                </Dialog>


            </Grid >
        )
    }
}

export default Searchabledropdown;
