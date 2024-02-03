import React, { Component } from 'react';
import { TextValidator } from 'react-material-ui-form-validator';
import { Autocomplete } from '@material-ui/lab';
import HospitalConfigServices from 'app/services/HospitalConfigServices'
class Manufacture extends Component {

    constructor(props) {
        super(props);
        this.state = {
            all_manufacturers: []
        };
    }

    async LoadData(search) {
        let params = { search: search, limit: 50, page: 0 }

        let res = await HospitalConfigServices.getAllManufacturers(params)
        if (res.status) {

            this.setState({
                all_manufacturers: res.data.view.data,

            })
        }
    }

    componentDidMount() {
        this.LoadData("")
    }
    render() {
        const { onChange, required } = this.props;

        return (

            <Autocomplete
                disableClearable
                className="w-full"
                options={
                    this.state.all_manufacturers
                }
                getOptionLabel={(option) =>
                    option.registartion_no ? (option.registartion_no + " - " + option.name) : "" + option.name
                }
                onChange={(event, value) => {
                    if (value != null) {
                        onChange(value.id)

                    }
                }}

                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        label="Manufacturer"
                        fullWidth

                        onChange={(e) => {
                            if (e.target.value.length > 2) {
                                this.LoadData(e.target.value)
                            }
                        }}
                        variant="outlined"
                        size="small"
                    // validators={required ? [
                    //     'required',
                    // ] : []}
                    // errorMessages={required ? [
                    //     'this field is required',
                    // ] : []}
                    />
                )}
            />


        );
    }
}

export default Manufacture;
