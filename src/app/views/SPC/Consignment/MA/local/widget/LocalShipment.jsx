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

class LocalShipment extends Component {
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
                consignmentItems: consignmentItems,
                delivery_details: consignmentContainers
            };

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
                                    <Tab
                                        label="GRN Details"
                                        style={{ border: "1px solid rgb(229, 231, 235)" }}
                                        {...a11yProps(2)}
                                        disabled
                                    />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.value} index={0}>
                                <ShippingDetails handleNext={this.handleNext} isEdit={this.props.isEdit} data={this.state.filterData} updateData={this.updateFilterData} handleClose={this.props.handleClose} handleSubmit={this.onSubmit} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={1}>
                                <ShipmentValues handleNext={this.handleNext} isEdit={this.props.isEdit} handleBack={this.handlePrevious} data={this.state.filterData} updateData={this.updateFilterData} handleClose={this.props.handleClose} itemData={this.props.itemData} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={2}>
                                <Remark handleNext={this.handleNext} isEdit={this.props.isEdit} handleBack={this.handlePrevious} data={this.state.filterData} updateData={this.updateFilterData} resetData={this.resetFilterData} handleClose={this.props.handleClose} />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={3}>
                                <GRNItems handleBack={this.handlePrevious} isEdit={this.props.isEdit} data={this.state.filterData} updateData={this.updateFilterData} resetData={this.resetFilterData} handleClose={this.props.handleClose} handleSubmit={this.onSubmit} storeData={this.props.storeData} />
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
