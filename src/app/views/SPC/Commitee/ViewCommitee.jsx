import React, { useState, useContext } from 'react'
import {
    Grid,
    Tooltip,
    Typography,
    Chip,
    Breadcrumbs,
    Link,
    Tab,
    Tabs,
} from '@material-ui/core'
import {
    MainContainer,
    LoonsCard,
    CardTitle,
} from 'app/components/LoonsLabComponents'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { PageContext } from './PageContext'
import Members from './Members'
import BasicInfo from './BasicInfo'
import AssignMembers from './AssignMembers'

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
            {value === index && children}
        </div>
    )
}

export default function ViewCommitee() {
    const [pageData, setPageData] = useContext(PageContext)
    const [tabStatus, setTabSatus] = useState(0)

    const goBack = () => {
        const tempPageData = { ...pageData, slug: 'all' }
        setPageData(tempPageData)
    }

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        }
    }

    return (
        <div>
            <LoonsCard style={{ minHeight: '80vh' }}>
                <CardTitle title="Procurement Committee" />
                <Grid
                    container
                    style={{ marginTop: '1rem', marginBottom: '1rem' }}
                    spacing={2}
                >
                    <Grid
                        item
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Tooltip title="Back to All Commitee">
                            <Chip
                                size="small"
                                icon={
                                    <ArrowBackIosIcon
                                        style={{
                                            marginLeft: '5px',
                                            fontSize: '11px',
                                        }}
                                    />
                                }
                                label="Back"
                                color="primary"
                                onClick={goBack}
                                variant="outlined"
                            />
                        </Tooltip>
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                component="button"
                                color="inherit"
                                onClick={goBack}
                            >
                                All Commitees
                            </Link>
                            <Typography color="textPrimary">View</Typography>
                        </Breadcrumbs>
                    </Grid>

                    <Grid item xs={12}>
                        <Tabs
                            value={tabStatus}
                            onChange={(e, value) => setTabSatus(value)}
                            aria-label="basic tabs example"
                            variant="fullWidth"
                            style={{ borderCollapse: 'collapse' }}
                        >
                            <Tab
                                label="Basic Info"
                                style={{
                                    background: '#D5E6FF',
                                    color: '#383CFF',
                                }}
                                {...a11yProps(0)}
                            />
                            <Tab
                                label="Assign Members"
                                style={{
                                    background: '#D5E6FF',
                                    color: '#383CFF',
                                }}
                                {...a11yProps(1)}
                            />
                            <Tab
                                label="Members"
                                style={{
                                    background: '#D5E6FF',
                                    color: '#383CFF',
                                }}
                                {...a11yProps(2)}
                            />
                        </Tabs>
                        <TabPanel value={tabStatus} index={0} style={{ p: 3 }}>
                            <BasicInfo />
                        </TabPanel>
                        <TabPanel value={tabStatus} index={1} style={{ p: 3 }}>
                            <AssignMembers />
                        </TabPanel>
                        <TabPanel value={tabStatus} index={2}>
                            <Members />
                        </TabPanel>
                    </Grid>
                </Grid>
            </LoonsCard>
        </div>
    )
}
