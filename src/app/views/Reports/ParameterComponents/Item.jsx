import React, { Component } from 'react';
import { TextValidator } from 'react-material-ui-form-validator';
import { Autocomplete } from '@material-ui/lab';
import InventoryService from 'app/services/InventoryService'
class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            options: [],
            item_id: "",
        };
    }

    async LoadData(search) {
        let params = { "search": search, limit: 50 }
        let res = await InventoryService.fetchAllItems(params);
        if (res.status == 200) {
            let drugs = [];

            res.data.view.data.forEach(element => {
                drugs.push({
                    sr_no: element.sr_no,
                    id: element.id,
                    short_description: element.short_description,
                })
            });

            this.setState({ options: drugs })

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
                className="mb-1 w-full"
                options={this.state.options}

                onChange={(e, value) => {
                    if (value != null) {
                        onChange(value.id)
                        this.setState({
                            item_id: value.id
                        })

                    } else {
                        this.setState({
                            item_id: ""
                        })
                    }
                }}

                getOptionLabel={(option) => option.short_description}
                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        placeholder="Item"
                        //variant="outlined"
                        fullWidth
                        variant="outlined"
                        value={this.state.item_id}
                        size="small"
                        onChange={(e) => {

                            if (e.target.value.length > 3) {
                                this.LoadData(e.target.value)
                            }

                        }}
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

export default Item;
