import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
    Grid,
    Typography,
    Box,
} from '@material-ui/core'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import 'date-fns'
import {
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
} from 'app/components/LoonsLabComponents'

import ApprovalItemDetails from './ApprovalItemDetails'
import ApprovedLPRequest from './ApprovedLPRequest'
import CompletedLPRequest from './CompletedLPRequest'
import RejectedLPRequest from './RejectedLPRequest'
import AllLocalPurchaseRequest from './AllLocalPurchaseRequest'
import AppBar from '@material-ui/core/AppBar';

const makeStyles = (theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper
    }
})

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
                <Box sx={{ paddingBottom: 3, paddingTop: 3 }}>
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

class LPRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 0,

            alert: false,
            message: '',
            severity: 'success',
        }
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <CardTitle title="LP Request" />
                        <Grid container spacing={2} direction="row">
                            {/* Filter Section */}
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                {/* Item Series Definition */}
                                {/* <Box sx={{ width: '100%', minHeight: '300px', marginTop: '12px' }}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}> */}
                            <><AppBar position="static" color="default">
                                        <Tabs
                                            value={this.state.value}
                                            onChange={this.handleChange}
                                            // aria-label="basic tabs example"
                                            variant="fullWidth"
                                            indicatorColor="primary"
                                            textColor="primary"
                                            aria-label="full width tabs example"

                                        >
                                            <Tab
                                                label="Pending"
                                                // style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(0)}
                                            />
                                            <Tab
                                                label="Approved"
                                                // style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(1)}
                                            />
                                            <Tab
                                                label="Completed"
                                                // style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(2)}
                                            />
                                            <Tab
                                                label="Rejected"
                                                // style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(3)}
                                            />
                                            <Tab
                                                label="All LP Request"
                                                // style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(4)}
                                            />
                                        </Tabs>
                                    </AppBar>
                                    {/* </Box> */}
                                    <TabPanel value={this.state.value} index={0}>
                                        <ApprovalItemDetails />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={1}>
                                        <ApprovedLPRequest />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={2}>
                                        <CompletedLPRequest />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={3}>
                                        <RejectedLPRequest />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={4}>
                                        <AllLocalPurchaseRequest />
                                    </TabPanel>
                             </>
                                {/* </Box> */}
                            </Grid>
                        </Grid>
                    </LoonsCard>
                </MainContainer>
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

export default withStyles(styleSheet)(LPRequest)
