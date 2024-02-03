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

import LDCNOrderList from './LDCNOrderList'
import WDNOrderList from './WDNOrderList'

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

class AllOrderList extends Component {
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
                        <CardTitle title="Create Debit Note" />
                        <Grid container spacing={2} direction="row">
                            {/* Filter Section */}
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                {/* Item Series Definition */}
                                <Box sx={{ width: '100%', minHeight: '300px', marginTop: '12px' }}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Tabs
                                            value={this.state.value}
                                            onChange={this.handleChange}
                                            aria-label="basic tabs example"
                                            variant="fullWidth"
                                            style={{ borderCollapse: "collapse" }}
                                        >
                                            <Tab
                                                label="LDCN List"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(0)}
                                            />
                                            <Tab
                                                label="WDN List"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(1)}
                                            />
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={this.state.value} index={0}>
                                        <LDCNOrderList />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={1}>
                                        <WDNOrderList />
                                    </TabPanel>
                                </Box>
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

export default withStyles(styleSheet)(AllOrderList)
