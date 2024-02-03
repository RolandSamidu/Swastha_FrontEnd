import React, { Component } from 'react';
import { TextValidator } from 'react-material-ui-form-validator';
import { Autocomplete } from '@material-ui/lab';
import ConsignmentService from 'app/services/ConsignmentService'
import { Grid } from '@material-ui/core';

class DebitNoteTypes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            options: [],
            options2: [],
            formData: {
                debit_note_type_id: null,
                debit_note_type: null,
                debit_note_sub_type_id: null,
                debit_note_sub_type: null
            }
        };
    }

    async LoadData() {
        let params = {}
        let cat_res = await ConsignmentService.getDabitNoteTypes(params)
        console.log("cat_res", cat_res);
        if (cat_res.status == 200) {

            this.setState({ options: cat_res.data.view.data })
        }
    }

    async dabitNoteSubTypes(type_id) {

        if (type_id) {
            let params = { type_id: type_id };
            let res1 = await ConsignmentService.getDabitNoteSubTypes(params)
            if (res1.status) {
                console.log("resdebitnote", res1.data.view.data)
                this.setState({
                    options2: res1.data.view.data,
                })
            }
        } else {
            let formData = this.state.formData
            formData.debit_note_sub_type_id = null;
            formData.debit_note_sub_type = null;
            this.setState({
                options2: [],
                formData
            })
        }
    }

    componentDidMount() {
        this.LoadData()
    }
    render() {
        const { onChange, required, placeholder } = this.props;

        return (
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Autocomplete
                        disableClearable
                        className="w-full"
                        options={this.state.options}
                        getOptionLabel={(option) => option.name ? option.name : ""}
                        getOptionSelected={(option, value) =>
                            console.log("ok")
                        }
                        onChange={(event, value) => {
                            let formData = this.state.formData;
                            formData.debit_note_type_id = value.id
                            formData.debit_note_type = value.code + " - " + value.name
                            this.dabitNoteSubTypes(value.id)

                            onChange('debit_note_type', value.name)
                        }
                        }
                        renderInput={(params) => (
                            <TextValidator
                                {...params}
                                placeholder="Debit Note Type"
                                //variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                size="small"
                            // validators={[
                            //     'required',
                            // ]}
                            // errorMessages={[
                            //     'this field is required',
                            // ]}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Autocomplete
                        disableClearable
                        className="w-full"
                        options={this.state.options2}
                        getOptionLabel={(option) => option.name ? option.name : ""}
                        getOptionSelected={(option, value) =>
                            console.log("ok")
                        }
                        onChange={(event, value) => {
                            onChange('debit_note_sub_type', value.name)
                        }
                        }
                        value={this.state.debit_note_sub_types && this.state.debit_note_sub_types.find(
                            (v) => v.id == this.state.formData.debit_note_sub_type_id
                        )}
                        renderInput={(params) => (
                            <TextValidator
                                {...params}
                                placeholder="Debit Note Sub Type"
                                //variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                size="small"
                            // validators={[
                            //     'required',
                            // ]}
                            // errorMessages={[
                            //     'this field is required',
                            // ]}
                            />
                        )}
                    />
                </Grid>
            </Grid>

        );
    }
}

export default DebitNoteTypes;
