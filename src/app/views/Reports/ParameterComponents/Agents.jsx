import React, { Component } from 'react';
import { TextValidator } from 'react-material-ui-form-validator';
import { Autocomplete } from '@material-ui/lab';
import PrescriptionService from 'app/services/PrescriptionService'
class Agents extends Component {

    constructor(props) {
        super(props);
        this.state = {
            options: []
        };
    }

    async LoadData() {
        let res = await PrescriptionService.getAllAgents()

        if (res.status == 200) {

            this.setState({ options: res.data.view.data })
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
                getOptionLabel={(option) => option.name ? (option.name) : ('')
                }
                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        label="Select Agents"
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

export default Agents;
