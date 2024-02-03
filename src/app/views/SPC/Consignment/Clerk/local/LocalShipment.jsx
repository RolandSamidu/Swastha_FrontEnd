import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
    Grid,
    Typography,
    Tab,
    Tabs,
    Box,
} from '@material-ui/core'
import 'date-fns'
import {
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
} from 'app/components/LoonsLabComponents'

import ShippingDetails from './ShippingDetails'
import ShipmentValues from './Values'
import Remark from './Remark'

const styleSheet = (theme) => ({})

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ paddingBottom: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

class LocalShipment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 0,

            filterData: {
                // Shipment Details
                ldcn_ref_no: null,
                ldcn_no: null,
                ldcn_date: null,
                supplier_id: null,
                invoice_no: null,
                ldcn_received: null,
                ldcn_received_id: null,

                supervisor_remark: null,
                remark: null,

                // Delivery Details
                delivery_details: [{
                    remark: null,
                }],

                // // Vessel
                // flight_name: null,
                // flight_no: null,
                // weight: null,
                // dispatch_date: null,
                // clearance_date: null,

                // fcl_value: null,
                // fcl_table_values: null,

                // arrival_port: null,
                // arrival_port_id: null,
                // arrival_date: null,

                // departure_date: null,
                // departure_port: null,
                // departure_port_id: null,

                // company: null,
                // company_id: null,
                // bl_no: null,
                // bl_date: null,

                // Values -> No Any Input

                // Charges
                // order_amount: null,
                // currency_type: null,
                // currency_rate: null,
                // total: null,

                // charges: [
                //     {
                //         cid: null,
                //         pal: null,
                //         sscl: null,
                //         cess: null,
                //         sc: null,
                //         vat: null,
                //         scl: null,
                //         com: null,
                //         exm: null,
                //         otc: null,
                //         sel: null,
                //         other: null,

                //         transport: null,
                //         storage: null,
                //         detention: null,
                //         type: null,
                //         tax: null,
                //         sub_total: null,
                //         shipping_line_damage: null,
                //     }
                // ]
            },

            alert: false,
            message: '',
            severity: 'success',
        }
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    }

    updateFilterData = (data) => {
        this.setState((prevState) => ({
            filterData: {
                ...prevState.filterData,
                ...data,
            },
        }));
    };

    resetFilterData = () => {
        this.setState({
            filterData: {
                wharf_no: null,
                wdn_no: null,
                // ... other initial filterData values
            },
        });
    };

    handleNext = () => {
        this.setState(prevState => ({
            value: prevState.value + 1
        }));
    }

    handlePrevious = () => {
        this.setState(prevState => ({
            value: prevState.value - 1
        }));
    }

    onSubmit = () => {
        this.props.storeData(this.state.filterData)
        this.props.submitOpen()
    }

    componentDidMount() {
        const { data, isEdit } = this.props
        if (data) {
            const consignmentItems = data?.SPCConsignmentItems || []
            const consignmentContainers = data?.ConsignmentContainers || []

            const updatedFilterData = {
                ...data,
                ...this.state.filterData,
                ldcn_ref_no: data?.ldcn_ref_no,
                ldcn_no: data?.ldcn_no,
                ldcn_date: data.ldcn_date,
                supplier_id: data?.supplier_id,
                invoice_no: data?.invoice_no,
                ldcn_received: data?.ldcn_received,
                remark: data?.remark,
                supervisor_remark: data?.supervisor_remark,

                consignmentItems: consignmentItems,
            };

            if (!isEdit) {
                updatedFilterData.delivery_details = consignmentContainers;
            }

            this.setState({ filterData: updatedFilterData });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.filterData !== this.state.filterData) {
            console.log("Data :", this.state.filterData)
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <Grid container direction="row">
                    {/* Filter Section */}
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        {/* Item Series Definition */}
                        <Box sx={{ width: '100%', minHeight: '300px' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    aria-label="basic tabs example"
                                    variant="fullWidth"
                                    style={{ borderCollapse: "collapse" }}
                                >
                                    <Tab
                                        label="Shipment Details"
                                        style={{ border: "1px solid rgb(229, 231, 235)" }}
                                        {...a11yProps(0)}
                                        disabled
                                    />
                                    <Tab
                                        label="Shipment Values"
                                        style={{ border: "1px solid rgb(229, 231, 235)" }}
                                        {...a11yProps(1)}
                                        disabled
                                    />
                                    <Tab
                                        label="Remark"
                                        style={{ border: "1px solid rgb(229, 231, 235)" }}
                                        {...a11yProps(2)}
                                        disabled
                                    />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.value} index={0}>
                                <ShippingDetails handleNext={this.handleNext} data={this.state.filterData} isEdit={this.props.isEdit} updateData={this.updateFilterData} handleClose={this.props.handleClose} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={1}>
                                <ShipmentValues handleNext={this.handleNext} handleBack={this.handlePrevious} isEdit={this.props.isEdit} data={this.state.filterData} updateData={this.updateFilterData} handleClose={this.props.handleClose} itemData={this.props.itemData} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={2}>
                                <Remark handleBack={this.handlePrevious} data={this.state.filterData} isEdit={this.props.isEdit} updateData={this.updateFilterData} resetData={this.resetFilterData} handleClose={this.props.handleClose} handleSubmit={this.onSubmit} storeData={this.props.storeData} />
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
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

export default withStyles(styleSheet)(LocalShipment)
