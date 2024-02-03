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

import DraftPO from './MA/local/DraftPO'
import ApprovedPO from './MA/local/ApprovedPO'
import RejectedPO from './MA/local/RejectedPO'
import CompletedPO from './MA/local/CompletedPO'
import SubmissionPO from './MA/local/SubmissionPO'
import AllPO from './MA/local/AllPO'

import ToBeClearedPO from './Clerk/local/ToBeClearedPO'
import PortCompletedPO from './Clerk/local/PortCompletedPO'

import localStorageService from 'app/services/localStorageService'
import CancelledPO from './MA/local/CancelledPO'

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

class LCDNOrderList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 0,

            userRoles: [],
            alert: false,
            message: '',
            severity: 'success',
        }
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    }

    async componentDidMount() {
        let roles = await localStorageService.getItem('userInfo')?.roles
        this.setState({
            userRoles: roles,
        })
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                {/* <CardTitle title="LCDN Order List" /> */}
                <Grid container spacing={2} direction="row">
                    {/* Roles */}
                    {
                        this.state.userRoles.includes('MSD Clerk') ?
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
                                                label="To Be Cleared"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(0)}
                                            />
                                            <Tab
                                                label="DELIVERED"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(1)}
                                            />
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={this.state.value} index={0}>
                                        <ToBeClearedPO />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={1}>
                                        <PortCompletedPO />
                                    </TabPanel>
                                </Box>
                            </Grid>
                            :
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
                                                label="All"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(0)}
                                            />
                                            <Tab
                                                label="Pending"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(1)}
                                            />
                                            <Tab
                                                label="Approved"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(2)}
                                            />
                                            <Tab
                                                label="Rejected"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(3)}
                                            />
                                            <Tab
                                                label="Re-Submission"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(4)}
                                            />
                                            {/* <Tab
                                                label="Delivered"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(5)}
                                            /> */}
                                            <Tab
                                                label="Cancelled"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(5)}
                                            />
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={this.state.value} index={0}>
                                        <AllPO />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={1}>
                                        <DraftPO />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={2}>
                                        <ApprovedPO />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={3}>
                                        <RejectedPO />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={4}>
                                        <SubmissionPO />
                                    </TabPanel>
                                    {/* <TabPanel value={this.state.value} index={5}>
                                        <CompletedPO />
                                    </TabPanel> */}
                                    <TabPanel value={this.state.value} index={5}>
                                        <CancelledPO />
                                    </TabPanel>
                                </Box>
                            </Grid>
                    }
                </Grid>
                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(LCDNOrderList)
