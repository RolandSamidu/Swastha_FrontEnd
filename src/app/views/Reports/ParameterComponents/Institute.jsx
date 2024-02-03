import React, { Component } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { Autocomplete } from '@material-ui/lab'
import ClinicService from 'app/services/ClinicService'
import localStorageService from 'app/services/localStorageService'
import { authRoles } from 'app/auth/authRoles'

class Institute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options: [],
            formData: {
                owner_id: null,
                from_owner_id: null,

            },
            isCheif: false,
        }
    }
    async LoadData(search) {
        let params = {
            limit: 500,
            page: 0,
            issuance_type: this.props.params,
            search: search,

        }
        console.log("IsCheif", this.state.isCheif)
        // set logged user owner_id if user is in cheif report users

        let res
        if (this.state.isCheif && this.props.placeholder != "To Owner ID") {
            res = await ClinicService.fetchAllClinicsNew(params, this.state.owner_id)
        } else {
            res = await ClinicService.fetchAllClinicsNew(params, null)
        }



        if (res.status == 200) {
            console.log('phar', res)

            this.setState({
                options: res.data.view.data,
            })
        }
    }

    async componentDidMount() {
        // this.LoadData()


        var user = await localStorageService.getItem('userInfo');
        var owner_id = await localStorageService.getItem('owner_id');
        console.log("user call", owner_id)
        let isCheif = authRoles.ChiefReports.some(value => user.roles.includes(value))

        console.log("IsCheif", isCheif)

        this.setState({
            isCheif: isCheif,
            owner_id: owner_id
        })
    }

    render() {
        const { onChange, required, placeholder } = this.props

        return (
            <Autocomplete
                disableClearable
                className="w-full"
                options={this.state.options}
                onChange={(e, value) => {
                    console.log('call --->')
                    if (value != null) {
                        let formData = this.state.formData
                        formData.from_owner_id = value.owner_id

                        onChange(value.owner_id)
                        this.setState({ formData })
                    } else if (value == null) {
                        let formData = this.state.formData
                        formData.from_owner_id = null
                        this.setState({ formData })
                    }
                }}
                getOptionLabel={(option) => (option.name ? option.name : '')}
                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        placeholder={placeholder ? placeholder : 'Institute'}
                        //variant="outlined"
                        value={this.state.formData.from_owner_id}
                        variant="outlined"
                        size="small"
                        onChange={(e) => {
                            if (e.target.value.length > 3) {
                                this.LoadData(e.target.value)
                            }
                        }}
                        validators={required ? ['required'] : []}
                        errorMessages={['This field is required']}
                    />
                )}
            />
        )
    }
}

export default Institute
