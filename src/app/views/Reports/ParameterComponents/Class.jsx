import React, { Component } from 'react';
import { TextValidator } from 'react-material-ui-form-validator';
import { Autocomplete } from '@material-ui/lab';
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'

class Class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        };
    }


    async LoadData() {
        let class_res = await ClassDataSetupService.fetchAllClass({
            limit: 99999,
        })
        if (class_res.status == 200) {
            console.log('Classes', class_res.data.view.data)
            this.setState({ options: class_res.data.view.data })
        }
    }

    componentDidMount() {
        this.LoadData()
    }


    render() {
        const { onChange, required } = this.props;

        return (
            <Autocomplete
                disableClearable
                className="w-full"
                options={this.state.options}
                onChange={(e, value) => {
                    onChange(value.id)
                }}
                getOptionLabel={(option) =>
                    option.description
                        ? option.description
                        : ''
                }
                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        label="Item Class"
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

export default Class;
