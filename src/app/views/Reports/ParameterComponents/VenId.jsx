import React, { Component } from 'react';
import { TextValidator } from 'react-material-ui-form-validator';
import { Autocomplete } from '@material-ui/lab';
import WarehouseServices from 'app/services/WarehouseServices'

class VenId extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        };
    }


    async LoadData() {
        let ven_res = await WarehouseServices.getVEN({ limit: 99999 })
        if (ven_res.status == 200) {

            this.setState({ options: ven_res.data.view.data })
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
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        label="Ven ID"
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

export default VenId;
