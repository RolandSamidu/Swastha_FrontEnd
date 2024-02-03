import React, { Component } from 'react';
import { TextValidator } from 'react-material-ui-form-validator';
import { Autocomplete } from '@material-ui/lab';
import CategoryService from 'app/services/datasetupServices/CategoryService'
class SrNo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            options: []
        };
    }

    async LoadData() {
        let cat_res = await CategoryService.fetchAllCategories({})
        console.log("cat_res", cat_res);
        if (cat_res.status == 200) {

            this.setState({ options: cat_res.data.view.data })
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
                getOptionLabel={(option) => option.description ? (option.description) : ('')
                }
                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        label="SR No"
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

export default SrNo;
