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
import GRNItems from './GRNItems'

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

            filterData: {},

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
        const { data } = this.props
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
                vessel_details: [
                    {
                        ...vesselDetails[0],
                        fcl_table_values: fcl_table_values,
                        fcl_value: fcl_value
                    },
                    ...vesselDetails.slice(1),
                ],

                charges: consignmentCharges,
                consignmentItems: consignmentItems,
                delivery_details: consignmentContainers
            };

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
                                        label="Vessel/Payments"
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
                                    <Tab
                                        label="GRN Details"
                                        style={{ border: "1px solid rgb(229, 231, 235)" }}
                                        {...a11yProps(5)}
                                        disabled
                                    />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.value} index={0}>
                                <ShippingDetails handleNext={this.handleNext} isEdit={this.props.isEdit} handleClose={this.props.handleClose} data={this.state.filterData} updateData={this.updateFilterData} handleSubmit={this.onSubmit} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={1}>
                                <ShipmentVessel handleNext={this.handleNext} isEdit={this.props.isEdit} handleBack={this.handlePrevious} handleClose={this.props.handleClose} data={this.state.filterData} updateData={this.updateFilterData} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={2}>
                                <ShipmentValues handleNext={this.handleNext} isEdit={this.props.isEdit} handleBack={this.handlePrevious} handleClose={this.props.handleClose} data={this.state.filterData} updateData={this.updateFilterData} itemData={this.props.itemData} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={3}>
                                <ShipmentCharges handleNext={this.handleNext} isEdit={this.props.isEdit} handleBack={this.handlePrevious} handleClose={this.props.handleClose} data={this.state.filterData} updateData={this.updateFilterData} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={4}>
                                <DeliveryDetails handleNext={this.handleNext} isEdit={this.props.isEdit} handleBack={this.handlePrevious} handleClose={this.props.handleClose} data={this.state.filterData} updateData={this.updateFilterData} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={5}>
                                <GRNItems handleBack={this.handlePrevious} handleClose={this.props.handleClose} data={this.state.filterData}
                                    updateData={this.updateFilterData} isEdit={this.props.isEdit} storeData={this.props.storeData} handleSubmit={this.onSubmit} />
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
