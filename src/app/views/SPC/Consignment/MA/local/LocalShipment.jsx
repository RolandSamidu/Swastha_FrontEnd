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
import ShipmentValues from './Values'
import Remarks from './Remarks'

const styleSheet = (theme) => ({})

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && <>{children}</>}
      </div>
    );
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
                shipment_no: null,
                ldcn_no: null,
                ldcn_date: new Date(),
                supplier_id: this.props.details?.supplierId,
                invoice_no: this.props.details?.invoiceNo,
                invoice_date: null,
                ldcn_received: null,
                ldcn_received_id: null,
                remarks: null,
                values_in_currency: null,
                values_in_lkr: null,
                total: null,
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

    componentDidUpdate(prevProps, prevState) {
        if (prevState.filterData !== this.state.filterData) {
            console.log("Data :", this.state.filterData)
        }
    }

    onSubmit = () => {
        this.props.storeData(this.state.filterData)
        this.props.submitOpen()
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
                                        label="Shipment Charges"
                                        style={{ border: "1px solid rgb(229, 231, 235)" }}
                                        {...a11yProps(2)}
                                        disabled
                                    />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.value} index={0}>
                                <ShippingDetails handleNext={this.handleNext} data={this.state.filterData} updateData={this.updateFilterData} handleClose={this.props.handleClose} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={1}>
                                <ShipmentValues allChargers={this.props.allChargers} totalPayable={this.props.totalPayable} total_tax={this.props.total_tax} exchangeRate={this.props.exchangeRate} handleNext={this.handleNext} handleBack={this.handlePrevious} data={this.state.filterData} updateData={this.updateFilterData} handleClose={this.props.handleClose} itemData={this.props.itemData} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={2}>
                                <Remarks handleBack={this.handlePrevious} data={this.state.filterData} updateData={this.updateFilterData} resetData={this.resetFilterData} handleClose={this.props.handleClose} handleSubmit={this.onSubmit} handlePrint={this.props.handlePrint} created={this.props.created} />
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
