import React, { Component } from 'react';
import { TextValidator } from 'react-material-ui-form-validator';
import { Autocomplete } from '@material-ui/lab';
import WarehouseServices from 'app/services/WarehouseServices'
import { element } from 'prop-types';
import localStorageService from 'app/services/localStorageService';
import { authRoles } from 'app/auth/authRoles';
class Warehouse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isCheif: false,
            fixed_owner_id: null
        };
    }

    async LoadData() {

        let res

        if (this.props.estimation) {

            res = await WarehouseServices.getWarehoureWithOwnerId(this.state.fixed_owner_id, { is_estimated: true })

        } else {
            if (this.state.isCheif) {
                res = await WarehouseServices.getWarehoureWithOwnerId(this.state.fixed_owner_id)
            } else {
                res = await WarehouseServices.getWarehoureWithOwnerId(this.props.owner_id)
            }

        }



        if (res.status == 200) {
            let data = res.data.view.data
            this.setState({ options: data })
        }


    }

    async componentDidMount() {

        var user = await localStorageService.getItem('userInfo');
        var owner_id = await localStorageService.getItem('owner_id');

        let isCheif = authRoles.ChiefReports.some(value => user.roles.includes(value))
        this.setState({
            isCheif: isCheif,
            fixed_owner_id: owner_id
        })
        console.log("owner_id updated", this.props.owner_id, this.props.estimation)
        this.LoadData()
    }
    render() {
        const { onChange, required, estimation } = this.props;

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
                        label="Warehouse"
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

export default Warehouse;
