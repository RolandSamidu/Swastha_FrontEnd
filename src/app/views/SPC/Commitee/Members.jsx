import React, { useState } from 'react'
import { Tab, Tabs } from '@material-ui/core'
import { MainContainer } from 'app/components/LoonsLabComponents'
import CurrentMembers from './CurrentMembers'
import PreviouseMembers from './PreviouseMembers'

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

export default function Members() {
    const [tabStatus, setTabSatus] = useState(0)

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        }
    }

    return (
        <div>
            <Tabs
                value={tabStatus}
                onChange={(e, value) => setTabSatus(value)}
                aria-label="basic tabs example"
                variant="fullWidth"
                style={{ borderCollapse: 'collapse' }}
            >
                <Tab
                    label="Current Members"
                    style={{
                        background: '#D5E6FF',
                        color: '#383CFF',
                    }}
                    {...a11yProps(0)}
                />
                <Tab
                    label="Preivouse Members"
                    style={{
                        background: '#D5E6FF',
                        color: '#383CFF',
                    }}
                    {...a11yProps(1)}
                />
            </Tabs>
            <TabPanel value={tabStatus} index={0} style={{ p: 3 }}>
                <CurrentMembers />
            </TabPanel>
            <TabPanel value={tabStatus} index={1} style={{ p: 3 }}>
                <PreviouseMembers />
            </TabPanel>
        </div>
    )
}
