import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
    Grid,
    Card,
    Typography,
    Tab,
    Tabs,
    Box,
} from '@material-ui/core'
import 'date-fns'
import {
    LoonsSnackbar,
    MainContainer,
    CardTitle,
} from 'app/components/LoonsLabComponents'

import LCDNOrderList from './LCDNOrderList'
import WDNOrderList from './WDNOrderList'

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

class ApprovalList extends Component {
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
                    <Card elevation={6} className="px-main-card py-3">
                        <CardTitle title="All Consignment List" />
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
                                        <LCDNOrderList />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={1}>
                                        <WDNOrderList />
                                    </TabPanel>
                                </Box>
                            </Grid>
                        </Grid>
                    </Card>
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

export default withStyles(styleSheet)(ApprovalList)
