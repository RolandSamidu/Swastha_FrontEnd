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

import PendingDebitNotes from './local/PendingDebitNotes'
import ApprovedDebitNotes from './local/ApprovedDebitNotes'
import RejectedDebitNotes from './local/RejectedDebitNotes'
import CanceledDebitNotes from './local/CanceledDebitNotes'
// import ReinstatedDebitNotes from './local/ReinstatedDebitNotes'
import AllDebitNotes from './local/AllDebitNotes'

import localStorageService from 'app/services/localStorageService'

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

class LDCNDebitList extends Component {
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
                {/* <CardTitle title="WDN Order List" /> */}
                <Grid container spacing={2} direction="row">
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
                                                label="Canceled"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(4)}
                                            />
                                            {/* <Tab
                                                label="Reinstated"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(5)}
                                            /> */}
                                            {/* <Tab
                                                label="Cleared"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(6)}
                                            /> */}
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={this.state.value} index={0}>
                                        <AllDebitNotes />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={1}>
                                        <PendingDebitNotes />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={2}>
                                        <ApprovedDebitNotes />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={3}>
                                        <RejectedDebitNotes />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={4}>
                                        <CanceledDebitNotes />
                                    </TabPanel>
                                    {/* <TabPanel value={this.state.value} index={5}>
                                        <ReinstatedDebitNotes />
                                    </TabPanel> */}
                                    {/* <TabPanel value={this.state.value} index={6}>
                                        <ClearedPO />
                                    </TabPanel> */}
                                </Box>
                            </Grid>
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

export default withStyles(styleSheet)(LDCNDebitList)
