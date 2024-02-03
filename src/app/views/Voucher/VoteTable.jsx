import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Grid } from '@mui/material'
import SelectionTable from 'app/components/Table/SelectionTable'



import FinanceServices from 'app/services/FinanceServices'
import { CircularProgress } from '@mui/material'

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
                <Box sx={{ p: 3, pt: 6 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

const VoteTable = (props) => {
    const [data, setData] = useState([])
    const [formData, setFormData] = useState({
        page: 0,
        limit: 10,
        category: 'Standard'
    })
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
        switch (newValue) {
            case 0:
                setFormData({ ...formData, category: "Standard" })
                break;
            case 1:
                setFormData({ ...formData, category: "Medical" })
                break;
            default:
                setFormData({ ...formData, category: "Others" })
                break;
        }
    }

    const loadData = async () => {
        setLoading(false)
        let res = await FinanceServices.getFinanceVotes(formData)
        if (res.status === 200) {
            setData(res.data.view.data)
        }
        console.log('Votes: ', res.data.view.data)
        setLoading(true)
    }

    useEffect(() => {
        loadData()
    }, [formData])
    return (
        <div style={{ minWidth: '800px' }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                        variant="fullWidth"
                    >
                        <Tab label="Standard" {...a11yProps(0)} />
                        <Tab label="Medical" {...a11yProps(1)} />
                        <Tab label="Others" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    {loading ?
                        <SelectionTable consingmentData={props.consingmentData} data={data} other={props.data ? props.data : null} creditNoteAmount={props.creditNoteAmount} remark={props.remark}  setVotesView={props.setVotesView} callback={props.callback} />
                        : (
                            <Grid className='justify-center text-center w-full pt-12'>
                                <CircularProgress size={30} />
                            </Grid>
                        )}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {loading ?
                        <SelectionTable consingmentData={props.consingmentData} data={data} other={props.data ? props.data : null} creditNoteAmount={props.creditNoteAmount} remark={props.remark} setVotesView={props.setVotesView} callback={props.callback} />
                        : (
                            <Grid className='justify-center text-center w-full pt-12'>
                                <CircularProgress size={30} />
                            </Grid>
                        )}
                </TabPanel>
                <TabPanel value={value} index={2}>
                    {loading ?
                        <SelectionTable consingmentData={props.consingmentData} data={data} other={props.data ? props.data : null} creditNoteAmount={props.creditNoteAmount} remark={props.remark }  setVotesView={props.setVotesView} callback={props.callback} />
                        : (
                            <Grid className='justify-center text-center w-full pt-12'>
                                <CircularProgress size={30} />
                            </Grid>
                        )}
                </TabPanel>
            </Box>
        </div>
    )
}

export default VoteTable
