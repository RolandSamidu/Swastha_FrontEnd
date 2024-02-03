/*
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm, Button,SubTitle } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import {
    Divider, Grid, IconButton, CircularProgress, Tooltip, Dialog,
    RadioGroup,

    FormControlLabel,
} from '@material-ui/core'
import 'date-fns'
import PropTypes from "prop-types";
import { dateParse } from "utils";
import  InventoryService  from 'app/services/InventoryService'



class SearchForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            item_list: [],
            formData: {
                sr_no: null,
                search: null,
                name: null
            }



        }
    }
    static propTypes = {
        id: PropTypes.string,
        activeParams: PropTypes.any,
        onChange: PropTypes.func,

    };

    static defaultProps = {

    };

    submit = e => {
        const { onChange } = this.props;
        onChange &&
            onChange(
                this.state.formData
            );
    };

    async getItem(value) {

        let data = {
            search: value
        }
        let res = await InventoryService.fetchAllItems(data)

        if (res.status === 200) {
            this.setState({ item_list: res.data.view.data })
        }
    }

    render() {
        const {
            activeParams

        } = this.props;

        return (
            <div>

                <ValidatorForm
                    onSubmit={() => {
                        this.submit()
                    }}
                >

                    <Grid container spacing={2} className="w-full px-2">
                       
                            <Grid item xs={3} direction="row">
                                <SubTitle title="SR Number" />
                                <Autocomplete
                                    disableClearable className="w-full"
                                    options={this.state.item_list}
                                   
                                    onChange={(e, value) => {
                                        if (value != null) {
                                            let formData = this.state.formData
                                            formData.item_id = value.id
                                            formData.sr_no = value.id
                                            formData.name = value.medium_description
                                            formData.item_sr_no=value.sr_no

                                            this.setState({
                                                formData,
                                                loading: false,
                                            })
                                            // this.getBatchInfo(value.id)
                                        }
                                        else if (value == null) {
                                            let formData = this.state.formData
                                            formData.item = null
                                            this.setState({
                                                formData

                                            })
                                        }
                                    }}

                                    getOptionLabel={(
                                        option) => option.sr_no + ' - ' + option.medium_description}
                                    renderInput={(params) => (
                                        <TextValidator {...params}
                                            placeholder="Type SR or Name"
                                            //variant="outlined"
                                            fullWidth="fullWidth"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                if (e.target.value.length > 3) {
                                                    this.getItem(e.target.value);
                                                }
                                            }}
                                            value={this.state.formData.sr_no + ' - ' + this.state.formData.name}
                                        //validators={this.state.formData.item_id ? [] : ['required']}
                                        //errorMessages={this.state.formData.item_id ? [] : ['this field is required']}

                                        />
                                    )} />
                            </Grid>
                        
                        <Grid item xs={3} direction="row" className="mt-6">
                            <Button
                                type='submit'
                               
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </ValidatorForm>


            </div>
        );
    }
}

export default SearchForm;