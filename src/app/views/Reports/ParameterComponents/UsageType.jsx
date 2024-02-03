import React, { Component } from 'react';
import { TextValidator } from 'react-material-ui-form-validator';
import { Autocomplete } from '@material-ui/lab';
import ItemMasterSerive from 'app/services/datasetupServices/ItemMasterSerive'


class UsageType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        };
    }

    async LoadData() {

        const res = await ItemMasterSerive.fetchAllItemUsageTypes({ limit: 9999 })
        console.log("Usage", res)

        this.setState({
            options: res.data.view.data
        })

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
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        label="Usage Type"
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

export default UsageType;
