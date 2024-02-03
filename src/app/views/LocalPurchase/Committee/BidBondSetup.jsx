import React, { Component, Fragment } from 'react'
import {
    CardTitle,
    LoonsCard,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import MainContainer from 'app/components/LoonsLabComponents/MainContainer'
import { LoonsTable, Button } from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { CircularProgress, Grid } from '@material-ui/core'
import * as appConst from '../../../../appconst'
import { Autocomplete } from '@material-ui/lab'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'

class BidBondSetUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            filterData: {
                limit: 20,
                page: 0,
                bid_value_presentage_from: '',
            },
            columns: [
                {
                    name: 'bid_value', // field name in the row object
                    label: 'Bid Value', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                    },
                },
                {
                    name: 'from', // field name in the row object
                    label: 'From', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                    },
                },
                {
                    name: 'bid_validity_period', // field name in the row object
                    label: 'Bid Validity Period', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                    },
                },
                {
                    name: 'offer_validity_period', // field name in the row object
                    label: 'Offer Validity Period', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                    },
                },
            ],
        }
    }
    render() {
        return (
            <MainContainer>
                <LoonsCard>
                    <CardTitle title="Bid Bond Set Up" />
                    <ValidatorForm>
                        <Grid container spacing={4} className=" w-full mt-2 flex">
                            <Grid
                                className=" w-full space between"
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Bid Value:" />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            className=" w-full mt-2 flex"
                        >
                            <Grid
                                className=" w-full space-between"
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                            >
                                <RadioGroup column>
                                    <FormControlLabel
                                        value="presentage"
                                        control={<Radio />}
                                        label="Presentage"
                                    />
                                    <Grid container spacing={2} style={{ marginLeft: "24px" }}>
                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <TextValidator
                                                //className=" w-full"
                                                placeholder="Please enter"
                                                name="Comment"
                                                InputLabelProps={{ shrink: false }}
                                                //value={this.state.formData.phn}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => { }}
                                            /* validators={['matchRegexp:^\s*([0-9a-zA-Z])\s$']}
                                            errorMessages={[
                                                'Invalid Inputs',
                                            ]} */
                                            />
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item lg={2} md={2} sm={2} xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                    <SubTitle title="From :" />
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                                    <Autocomplete
                                                        className="w-full"
                                                        value={
                                                            this.state.filterData
                                                                .bid_value_presentage_from
                                                        }
                                                        options={appConst.bid_value_presentage_from}
                                                        onChange={(e, value) => {
                                                            if (null != value) {
                                                                let filterData =
                                                                    this.state.filterData
                                                                filterData.bid_value_presentage_from =
                                                                    value
                                                                this.setState({ filterData })
                                                            } else {
                                                                let filterData =
                                                                    this.state.filterData
                                                                filterData.bid_value_presentage_from =
                                                                    { label: '' }
                                                                this.setState({ filterData })
                                                            }
                                                        }}
                                                        getOptionLabel={(option) => option.label}
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Please choose"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={
                                                                    this.state.filterData
                                                                        .bid_value_presentage_from
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <FormControlLabel
                                        value="fixed_amount"
                                        control={<Radio />}
                                        label="Fixed Amount"
                                    />
                                    <Grid item lg={6} md={6} sm={12} xs={12} style={{ marginLeft: '24px' }}>
                                        <Grid container spacing={2} style={{ marginLeft: "2px" }}>
                                            <Grid item lg={2} md={2} sm={2} xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                <SubTitle title="LKR :" />
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                                <TextValidator
                                                    //className=" w-full"
                                                    placeholder="Please enter"
                                                    name="Comment"
                                                    InputLabelProps={{ shrink: false }}
                                                    //value={this.state.formData.phn}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => { }}
                                                /* validators={['matchRegexp:^\s*([0-9a-zA-Z])\s$']}
                                                errorMessages={[
                                                    'Invalid Inputs',
                                                ]} */
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </RadioGroup>
                            </Grid>

                        </Grid>
                        <br />
                        <Grid
                            container
                            spacing={1}
                            className="w-full mt-2 space between"
                        >
                            <Grid container spacing={1} className="flex">
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                    style={{ display: "flex", alignItems: "center" }}
                                >
                                    <SubTitle title="Bid Validity Period:" />
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <div>
                                        <TextValidator
                                            //className=" w-full"
                                            placeholder="Please enter"
                                            name="bid_validity_period"
                                            InputLabelProps={{ shrink: false }}
                                            //value={this.state.formData.phn}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => { }}
                                        /* validators={['matchRegexp:^\s*([0-9a-zA-Z])\s$']}
                                        errorMessages={[
                                            'Invalid Inputs',
                                        ]} */
                                        />
                                    </div>
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={1}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                    style={{ display: "flex", alignItems: "center" }}
                                >
                                    <SubTitle title="Months" />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} className="flex">
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                    style={{ display: "flex", alignItems: "center" }}
                                >
                                    <SubTitle title="Offer Validity Period:" />
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <div>
                                        <TextValidator
                                            //className=" w-full"
                                            placeholder="Please enter"
                                            name="offer_validity_period"
                                            InputLabelProps={{ shrink: false }}
                                            //value={this.state.formData.phn}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => { }}
                                        /* validators={['matchRegexp:^\s*([0-9a-zA-Z])\s$']}
                                        errorMessages={[
                                            'Invalid Inputs',
                                        ]} */
                                        />
                                    </div>
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={1}
                                    md={1}
                                    sm={12}
                                    xs={12}
                                    style={{ display: "flex", alignItems: "center" }}
                                >
                                    <SubTitle title="Months" />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className=" w-full flex justify-end"
                        >
                            {/* Submit Button */}
                            <Button
                                className="mt-2"
                                progress={false}
                                type="submit"
                                scrollToTop={
                                    true
                                }
                                startIcon="save"
                                onClick={this.handleChange}
                            >
                                <span className="capitalize">
                                    Save
                                </span>
                            </Button>
                        </Grid>

                        {/* Table Section */}
                        <Grid container="container" className="mt-3 pb-5">
                            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                {this.state.loading ? (
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: 10,
                                            page: this.state.page,
                                            onTableChange: (action, tableState) => {
                                                console.log(action, tableState)
                                                switch (action) {
                                                    case 'changePage':
                                                        // this.setPage(     tableState.page )
                                                        break
                                                    case 'sort':
                                                        //this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    ></LoonsTable>
                                ) : (
                                    //loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default BidBondSetUp
