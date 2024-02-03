import React, { Component, Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Divider,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    Button,
    LoonsSnackbar,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../../../appconst'
import { roundDecimal } from 'utils'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';



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

const AddNumberInput = ({ type = 'number', onChange = (e) => e, val = "", text = "Add", tail = null, disable = false, require = false }) => (
    <TextValidator
        className=" w-full"
        placeholder={`⊕ ${text}`}
        // name="issued_amount"
        InputLabelProps={{
            shrink: false,
        }}
        disabled={disable}
        value={val ? String(val) : String(0)}
        type="number"
        variant="outlined"
        size="small"
        min={0}
        onChange={onChange}
        validators={require ? ['minNumber:' + 0,] :
            ['minNumber:' + 0, 'required:' + true]}
        errorMessages={disable ? [
            'Value Should be > 0',
        ] : [
            'Value Should be > 0',
            'this field is required'
        ]}
    />
)

const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", text = "Add", tail = null, disable = false, require = false }) => {
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => {
        setIsFocused(true);
    };
    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <Autocomplete
            disableClearable
            onFocus={handleFocus}
            onBlur={handleBlur}
            options={options}
            getOptionLabel={getOptionLabel}
            // id="disable-clearable"
            disabled={disable}
            onChange={onChange}
            value={val}
            size='small'
            renderInput={(params) => (
                < div ref={params.InputProps.ref} style={{ display: 'flex', position: 'relative' }}>
                    <input type="text" {...params.inputProps}
                        style={{ marginTop: '5.5px', padding: '6.5px 10px', border: '1px solid #e5e7eb', borderRadius: 4 }}
                        placeholder={`⊕ ${text}`}
                        onChange={onChange}
                        value={val}
                        required={require}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '7.5px',
                            right: 8,
                        }}
                        onClick={null}
                    >
                        {isFocused ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </div>
                </div >
            )}
        />);
}

class ShipmentCharges extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: '',
            severity: 'success',
            submit: false,
            filterData: {},

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
            },

            total: 0,
            currency_rate: 1,
        }

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
        this.setState({ submit: true });
        const data = { ...this.state.filterData, values_in_lkr: parseFloat(this.state.filterData?.order_amount ?? 0) * parseFloat(this.state.filterData?.currency_rate ?? 1) }
        this.props.updateData(data);
        // this.props.storeData(data);
        this.props.handleSubmit();
        this.setState({ submit: false });
    }

    onBack = async () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleBack();
    }

    componentDidMount() {
        const { data } = this.props;
        const exchangeRate = parseFloat(data?.currency_rate ?? 1);


        console.log("Incoming Data", data)
        this.setState({
            filterData: data,
            currency_rate: exchangeRate
        });
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
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title={`Order Amount (${this.state.filterData?.currency_type ? this.state.filterData?.currency_type : ""}).`} />
                                                <AddNumberInput
                                                    disable={true}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                order_amount: roundDecimal(parseFloat(e.target
                                                                    .value), 4),
                                                            },
                                                        })
                                                    }} val={this.state.filterData?.order_amount ? roundDecimal(this.state.filterData?.order_amount, 4) : 0} text='Enter Order Amount' type='number' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Currency Type" />
                                                <AddInput
                                                    disable={true}
                                                    require={false}
                                                    options={appConst.all_currencies}
                                                    val={this.state.filterData?.currency_type ? this.state.filterData?.currency_type : ''}
                                                    getOptionLabel={(option) => option.cc || ''}
                                                    text='Currency Type'
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let updatedFilterData = {
                                                                ...this.state.filterData,
                                                                currency_type: value?.cc,
                                                            };
                                                            // Update the state with the modified filterData object
                                                            this.setState({
                                                                filterData: updatedFilterData,
                                                            });
                                                        }
                                                    }}
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
                                                <SubTitle title="Enter Currency Rate" />
                                                <AddNumberInput onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            currency_rate: roundDecimal(parseFloat(e.target
                                                                .value), 4),
                                                        },
                                                    })
                                                }} val={this.state.filterData?.currency_rate ? this.state.filterData?.currency_rate : 0} text='Enter Currency Rate' type='number' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Total (LKR)" />
                                                <AddNumberInput
                                                    disable={true}
                                                    require={false}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            total: roundDecimal(parseFloat(e.target.value), 4),
                                                        })
                                                    }}
                                                    val={roundDecimal(parseFloat(this.state.filterData?.currency_rate ?? 1) * parseFloat(this.state.filterData?.order_amount ?? 0), 4)}
                                                    text='Enter Currency Rate'
                                                    type='number'
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Divider className='mt-2 mb-2' />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Grid container spacing={2} direction='row'>
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="CID" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            cid:
                                                                                roundDecimal(parseFloat(e.target.value), 4),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges[0].cid : 0} text='Enter CID' type='number' />
                                                    </Grid>
                                                    {/* </Grid> */}
                                                    {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="PAL" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            pal:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 4),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges[0].pal : 0} text='Enter PAL' type='number' />
                                                    </Grid>
                                                    {/* </Grid> */}
                                                    {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="SSL" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            ssl:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 4),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges[0].ssl : 0} text='Enter SSL' type='number' />
                                                    </Grid>
                                                    {/* </Grid> */}
                                                    {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="CESS" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            cess:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 4),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges[0].cess : 0} text='Enter CESS' type='number' />
                                                    </Grid>
                                                    {/* </Grid> */}
                                                    {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="SC" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            sc:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 4),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges[0].sc : 0} text='Enter SC' type='number' />
                                                    </Grid>
                                                    {/* </Grid> */}
                                                    {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="VAT" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            vat:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 4),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges[0].vat : 0} text='Enter SC' type='number' />
                                                    </Grid>
                                                    {/* </Grid> */}
                                                    {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="SCL" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            scl:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 4),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges[0].scl : 0} text='Enter SCL' type='number' />
                                                    </Grid>
                                                    {/* </Grid> */}
                                                    {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="COM" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            com:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 4),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges[0].com : 0} text='Enter COM' type='number' />
                                                    </Grid>
                                                    {/* </Grid> */}
                                                    {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="EXM" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            exm:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 4),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges[0].exm : 0} text='Enter EXM' type='number' />
                                                    </Grid>
                                                    {/* </Grid> */}
                                                    {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="OTC" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            otc:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 4),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges[0].otc : 0} text='Enter OTC' type='number' />
                                                    </Grid>
                                                    {/* </Grid> */}
                                                    {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="SEL" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            sel:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 4),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges[0].sel : 0} text='Enter SCL' type='number' />
                                                    </Grid>
                                                    {/* </Grid> */}
                                                    {/* <Grid container spacing={2}> */}
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <SubTitle title="OTHER" />
                                                        <AddNumberInput onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    charges: [
                                                                        {
                                                                            ...this.state.filterData.charges[0],
                                                                            other:
                                                                                roundDecimal(parseFloat(e.target
                                                                                    .value), 4),
                                                                        }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges[0].other : 0} text='Enter Other' type='number' />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Remarks" />
                                                <TextValidator
                                                    multiline
                                                    rows={4}
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
                                                                    .filterData,
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
                                                            onClick={this.onBack}
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
                                                        {
                                                            this.props.created ?
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
                                                                        Print WDN
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

export default withStyles(styleSheet)(ShipmentCharges)
