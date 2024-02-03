import React, { Component } from 'react';
import { TextValidator } from 'react-material-ui-form-validator';
import { Autocomplete } from '@material-ui/lab';
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'

class Groups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        };
    }
    async LoadData() {
        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        console.log("Groups", group_res)
        if (group_res.status == 200) {

            this.setState({ options: group_res.data.view.data })
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
                    option.name
                        ? (option.code + " - " + option.name)
                        : ''
                }

                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        label="Group"
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

export default Groups;
