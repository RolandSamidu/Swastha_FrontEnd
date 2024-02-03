import { Grid } from '@material-ui/core'
import { LoonsCard, SubTitle, Button } from 'app/components/LoonsLabComponents'
import React, { Component } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import * as appConst from '../../../appconst'

export default class WarehouseCommonFilter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            department: '',
            category: '',
        }
    }

    onSubmit = () => {
        this.props.handleFilterSubmit({
            name: this.state.name,
            department: this.state.department,
            category: this.state.category,
        })
    }

    render() {
        return (
            <LoonsCard>
                <ValidatorForm
                    className="pt-2"
                    ref={'outer-form'}
                    onSubmit={() => this.onSubmit()}
                    onError={() => null}
                >
                    <Grid container spacing={1} className="flex">
                        <Grid
                            className=" w-full"
                            item
                            lg={2}
                            md={2}
                            sm={12}
                            xs={12}
                        >
                            <SubTitle title="Name" />
                            <TextValidator
                                className=" w-full"
                                placeholder="Name"
                                name="name"
                                InputLabelProps={{ shrink: false }}
                                value={this.state.name}
                                type="text"
                                variant="outlined"
                                size="small"
                                onChange={(e) => {
                                    this.setState({
                                        name: e.target.value,
                                    })
                                }}
                            />
                        </Grid>
                        <Grid
                            className=" w-full"
                            item
                            lg={2}
                            md={2}
                            sm={12}
                            xs={12}
                        >
                            <SubTitle title="Department" />
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={appConst.admission_mode}
                                onChange={(e, value) => {
                                    if (null != value) {
                                        this.setState({
                                            department: value.label,
                                        })
                                    }
                                }}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Admission Mode"
                                        //variant="outlined"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={this.state.department}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid
                            className=" w-full"
                            item
                            lg={2}
                            md={2}
                            sm={12}
                            xs={12}
                        >
                            <SubTitle title="Category" />
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={appConst.admission_mode}
                                onChange={(e, value) => {
                                    if (null != value) {
                                        this.setState({
                                            category: value.label,
                                        })
                                    }
                                }}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Category"
                                        //variant="outlined"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={this.state.category}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid
                            className=" w-full"
                            item
                            lg={6}
                            md={6}
                            sm={12}
                            xs={12}
                        >
                            <Grid container className="flex mt-2" spacing={1}>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <Button
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                        startIcon="save"
                                        // onClick={this.onSubmit}
                                    >
                                        <span className="capitalize">
                                            Search
                                        </span>
                                    </Button>
                                </Grid>

                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    xs={12}
                                >
                                    <Button
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                        startIcon="save"
                                        // onClick={this.onSubmit}
                                    >
                                        <span className="capitalize">
                                            Cancel
                                        </span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </LoonsCard>
        )
    }
}
