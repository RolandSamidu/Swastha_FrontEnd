import React, { Component, Fragment, useState } from 'react'
import { withStyles, styled } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
} from '@material-ui/core'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../../../appconst'
import SearchIcon from '@mui/icons-material/Search';
import { dateParse, roundDecimal } from 'utils'

import LocalPurchaseServices from 'app/services/LocalPurchaseServices'




const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
})





class Remarks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            role: null,

            itemList: [],

            collapseButton: 0,
            userRoles: [],

            alert: false,
            message: '',
            severity: 'success',

            submit: false,
            filterData: {},
            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                // item_id: this.props.match.params.item_id
            },

            currency_types: [
                { label: "LKR" },
                { label: "INR" },
                { label: "USD" },
            ],
        }

    }

    loadData = async () => {
        //function for load initial data from backend or other resources
        this.setState({ loading: false });
        // let formData = this.state.filterData;
        const { sr_no, item_name, ...formData } = this.state.filterData

        let res = await LocalPurchaseServices.getLPRequest({ ...formData, status: ['APPROVED'] })

        if (res.status === 200) {
            console.log('LP Data: ', res.data.view.data);
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems })
        }

        this.setState({ loading: true })
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.filterData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New Form Data: ", this.state.formData)
            this.loadData()
        })
    }

    onSubmit = async () => {
        this.setState({ submit: true })

        const data = this.state.filterData;
        this.props.updateData(data);
        this.props.handleSubmit();

        this.setState({ submit: false })
    }

    componentDidMount() {
        const { data } = this.props;
        this.setState({ filterData: data })
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <div className="pb-8 pt-2">
                    {/* Filtr Section */}
                    <ValidatorForm
                        className="pt-2"
                        onSubmit={this.onSubmit}
                        onError={() => null}
                    >
                        {/* Main Grid */}
                        <Grid container spacing={2} direction="row">
                            {/* Filter Section */}
                            <Grid item xs={12} className='mb-5' sm={12} md={12} lg={12}>
                                {/* Item Series Definition */}
                                <Grid container spacing={2}>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Remarks" />
                                                <TextValidator
                                                    multiline
                                                    minRows={10}
                                                    className=" w-full"
                                                    placeholder="Remarks"
                                                    name="description"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.filterData
                                                            .remark
                                                    }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .formData,
                                                                remark:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }}
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                // errorMessages={[
                                                //     'this field is required',
                                                // ]}
                                                />
                                            </Grid>
                                            <Grid
                                                className='mt-5'
                                                style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Grid container spacing={2}>
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
                                                            className="mr-2 py-2 px-4"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            startIcon="chevron_left"
                                                            style={{ borderRadius: "10px" }}
                                                            onClick={this.props.handleBack}
                                                        >
                                                            <span className="capitalize">
                                                                Previous
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            className="mr-2 py-2 px-4"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            startIcon="close"
                                                            style={{ backgroundColor: "white", color: "black", border: "1px solid #3B71CA", borderRadius: "10px" }}
                                                            onClick={this.props.handleClose}
                                                        >
                                                            <span className="capitalize">
                                                                Cancel
                                                            </span>
                                                        </Button>
                                                        {this.props.created ?
                                                            <Button
                                                                style={{ borderRadius: "10px" }}
                                                                className="py-2 px-4"
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                startIcon="print"
                                                                onClick={this.props.handlePrint}
                                                            >
                                                                <span className="capitalize">
                                                                    Print LDCN
                                                                </span>
                                                            </Button>
                                                            :
                                                            <Button
                                                                style={{ borderRadius: "10px" }}
                                                                className="py-2 px-4"
                                                                progress={this.state.submit}
                                                                type="submit"
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                endIcon="chevron_right"
                                                            // onClick={this.props.handleNext}
                                                            >
                                                                <span className="capitalize">
                                                                    Submit
                                                                </span>
                                                            </Button>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            {/* Submit and Cancel Button */}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </div>
                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={1200}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(Remarks)
