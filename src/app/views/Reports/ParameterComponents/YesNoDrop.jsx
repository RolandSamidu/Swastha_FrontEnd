import React, { Component } from 'react';
import { TextValidator } from 'react-material-ui-form-validator';
import { Autocomplete } from '@material-ui/lab';
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'

class YesNo extends Component {
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
        const { onChange, required, label, placeholder } = this.props;

        return (
            <Autocomplete
                disableClearable
                className="w-full"
                options={["Yes", "No"]}
                onChange={(e, value) => {
                    onChange(value)
                }}
                getOptionLabel={(option) =>
                    option
                        ? option
                        : ''
                }
                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        label={label}
                        placeholder={placeholder}
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

export default YesNo;
