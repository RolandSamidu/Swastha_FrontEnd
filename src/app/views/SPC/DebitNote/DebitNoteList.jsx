import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
    Grid,
    Typography,
    Tab,
    Tabs,
    Box,
    Card,
} from '@material-ui/core'
import 'date-fns'
import {
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
} from 'app/components/LoonsLabComponents'

import LDCNDebitList from './LDCNDebitList'
import WDNDebitList from './WDNDebitList'

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

class DebitNoteList extends Component {
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
                <div className='pb-8 pt-2 px-main-8'>

                     {/* Filtr Section */}
                     <Card elevation={12} className="px-main-8 py-5">
                        <CardTitle title="Debit Note List" />
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
                                                label="Local Debit Notes"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(0)}
                                            />
                                            <Tab
                                                label="Foreign Debit Notes"
                                                style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                {...a11yProps(1)}
                                            />
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={this.state.value} index={0}>
                                        <LDCNDebitList />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={1}>
                                        <WDNDebitList />
                                    </TabPanel>
                                </Box>
                            </Grid>
                        </Grid>
                    </Card>

                </div>
                       
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

export default withStyles(styleSheet)(DebitNoteList)
