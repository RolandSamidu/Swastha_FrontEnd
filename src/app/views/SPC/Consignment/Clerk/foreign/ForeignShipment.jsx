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
} from 'app/components/LoonsLabComponents'

import ShippingDetails from './ShippingDetails'
import ShipmentVessel from './Vessel'
import ShipmentValues from './Values'
import ShipmentCharges from './Charges'
import DeliveryDetails from './DeliveryDetails'

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

class ForeignShipment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 0,

            filterData: {
                // Shipment Details
                wharf_no: null,
                wdn_no: null,
                wdn_date: null,
                indent_no: null,
                shipment_no: null,
                supplier_id: null,
                invoice_no: null,
                lc_no: null,
                invoice_date: null,
                shipment_account: null,
                wdn_table_no: null,
                shipment_table_no: null,
                wharf_table_no: null,
                wdn_recieved: null,
                wdn_recieved_id: null,
                received_date: null,

                remark: null,
                sup_remark: null,

                // Vessel
                vessel_details: [
                    {
                        flight_name: null,
                        flight_no: null,
                        weight: null,
                        dispatch_date: null,
                        clearance_date: null,

                        fcl_value: null,
                        fcl_table_values: [],

                        arrival_port: 'Colombo',
                        arrival_port_id: null,
                        arrival_date: null,

                        departure_date: null,
                        departure_port: null,
                        departure_port_id: null,

                        company: null,
                        company_id: null,
                        bl_no: null,
                        bl_date: null,

                        no_of_packages: null,
                    }
                ],


                // Values -> No Any Input
                order_amount: null,
                currency_type: null,
                currency_rate: null,
                total: null,

                // Charges
                charges: [
                    {
                        cid: null,
                        pal: null,
                        sscl: null,
                        cess: null,
                        sc: null,
                        vat: null,
                        scl: null,
                        com: null,
                        exm: null,
                        otc: null,
                        sel: null,
                        other: null,

                        transport: null,
                        storage: null,
                        detention: null,
                        type: null,
                        tax: null,
                        sub_total: null,
                        shipping_line_damage: null,
                    }
                ],

                // Delivery Details
                clerk_id: null,
                delivery_details: [{
                    lorry_no: null,
                    container_no: null,
                    delivery_point: null,
                    store_no: null,
                    good_condition: null,
                    delivery_date: null,
                    type: null,
                    port_warehouse: null,
                    port_warehouse_id: null,
                    storage_conditions: null,
                    no_of_packages: null,
                    volume: null,
                    delivered_quantity: null,
                    remark: null,
                }]
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
            filterData: {},
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

    componentDidUpdate(prevProps, prevState) {
        if (prevState.filterData !== this.state.filterData) {
            console.log("Data :", this.state.filterData)
        }
    }

    onSubmit = () => {
        this.props.storeData(this.state.filterData)
        this.props.submitOpen()
    }

    componentDidMount() {
        const { data, isEdit } = this.props
        if (data) {

            const vesselDetails = data?.ConsigmentVesselData || []
            const consignmentCharges = data?.ConsigmentCharges || []
            const consignmentItems = data?.SPCConsignmentItems || []
            const consignmentContainers = data?.ConsignmentContainers || []

            const fcl_table_values = Array.isArray(vesselDetails?.[0]?.fcl_table_values)
                ? vesselDetails?.[0]?.fcl_table_values
                : JSON.parse(vesselDetails?.[0]?.fcl_table_values || '[]');

            const fcl_value = vesselDetails?.[0]?.fcl_value ? vesselDetails?.[0]?.fcl_value : 0;

            const updatedFilterData = {
                ...data,
                ...this.state.filterData,
                wharf_no: data?.wharf_ref_no,
                wdn_no: data?.wdn_no,
                wdn_date: data.wdn_date,
                indent_no: data?.indent_no,
                shipment_no: data?.shipment_no,
                supplier_id: data?.supplier_id,
                invoice_no: data?.invoice_no,
                lc_no: data?.lc_no,
                invoice_date: data?.invoice_date,
                shipment_account: data?.shipment_account,
                wdn_recieved: data?.wdn_recieved,
                received_date: data?.received_date,
                remark: data?.remark,
                supervisor_remark: data?.supervisor_remark,

                vessel_details: [
                    {
                        ...vesselDetails[0],
                        fcl_table_values: fcl_table_values,
                        fcl_value: fcl_value
                    },
                    ...vesselDetails.slice(1),
                ],

                order_amount: data?.order_amount,
                currency_type: data?.currency_type,
                currency_rate: data?.currency_rate,
                total: data?.total,

                charges: consignmentCharges,
                consignmentItems: consignmentItems
            };

            if (!isEdit) {
                updatedFilterData.delivery_details = consignmentContainers;
            }

            this.setState({ filterData: updatedFilterData });
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
                                        label="Vessel Details"
                                        style={{ border: "1px solid rgb(229, 231, 235)" }}
                                        {...a11yProps(1)}
                                        disabled
                                    />
                                    <Tab
                                        label="Shipment Values"
                                        style={{ border: "1px solid rgb(229, 231, 235)" }}
                                        {...a11yProps(2)}
                                        disabled
                                    />
                                    <Tab
                                        label="Shipment Charges"
                                        style={{ border: "1px solid rgb(229, 231, 235)" }}
                                        {...a11yProps(3)}
                                        disabled
                                    />
                                    <Tab
                                        label="Delivery Details"
                                        style={{ border: "1px solid rgb(229, 231, 235)" }}
                                        {...a11yProps(4)}
                                        disabled
                                    />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.value} index={0}>
                                <ShippingDetails handleNext={this.handleNext} isEdit={this.props.isEdit} handleClose={this.props.handleClose} data={this.state.filterData}
                                    updateData={this.updateFilterData} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={1}>
                                <ShipmentVessel handleNext={this.handleNext} isEdit={this.props.isEdit} handleBack={this.handlePrevious} handleClose={this.props.handleClose} data={this.state.filterData} updateData={this.updateFilterData} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={2}>
                                <ShipmentValues handleNext={this.handleNext} isEdit={this.props.isEdit} handleBack={this.handlePrevious} handleClose={this.props.handleClose} data={this.state.filterData} updateData={this.updateFilterData} itemData={this.props.itemData} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={3}>
                                <ShipmentCharges handleNext={this.handleNext} isEdit={this.props.isEdit} handleBack={this.handlePrevious} handleClose={this.props.handleClose} data={this.state.filterData}
                                    updateData={this.updateFilterData} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={4}>
                                <DeliveryDetails handleBack={this.handlePrevious} isEdit={this.props.isEdit} handleClose={this.props.handleClose} data={this.state.filterData}
                                    updateData={this.updateFilterData} storeData={this.props.storeData} handleSubmit={this.onSubmit} resetData={this.resetFilterData} />
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

export default withStyles(styleSheet)(ForeignShipment)
