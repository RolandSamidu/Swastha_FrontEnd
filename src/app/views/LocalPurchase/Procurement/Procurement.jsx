import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    CircularProgress,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    Typography,
    Box,
    Tabs,
    Tab,
} from '@material-ui/core'
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import { dateTimeParse, timeParse } from 'utils'
import VisibilityIcon from '@material-ui/icons/Visibility'
import ConsignmentService from 'app/services/ConsignmentService'
import DistributionCenterServices from 'app/services/DistributionCenterServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from 'app/services/WarehouseServices'
import { element } from 'prop-types'
import { dateParse } from 'utils'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import { Dialog } from '@mui/material'
import CloseIcon from '@material-ui/icons/Close'
import MuiDialogTitle from '@material-ui/core/DialogTitle'

import NewProcurement from './NewProcurements'
import AllProcurement from './AllProcurements'

import moment from 'moment'

const drawerWidth = 270

const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
})

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
                <Box sx={{ p: 3 }}>
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

class Procurement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createAgendas: false,
            value: 0,
            loaded: false,
            activeTab: 0,
            filterData: {
                statusAllAgendas: '',
            },
            data: [],
            columns: [
                {
                    name: 'procurement_committe_no',
                    label: 'Procurement Committe No',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'date',
                    label: 'Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {value
                                        ? dateParse(
                                            moment(value).format('YYYY-MM-DD')
                                        )
                                        : ''}
                                </span>
                            )
                        },
                    },
                },
                {
                    name: 'time',
                    label: 'Time',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {value ? timeParse(moment(value)) : ''}
                                </span>
                            )
                        },
                    },
                },
                {
                    name: 'remarks',
                    label: 'Remarks',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                    },
                },
            ],
        }
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    }

    render() {
        return (
            <MainContainer>
                <LoonsCard>
                    <CardTitle title={'Procurement'} />
                    {/* <ValidatorForm onSubmit={() => { }} className="w-full"> */}
                    <Box sx={{ width: '100%', minHeight: '300px', marginTop: "12px", marginBottom: "12px" }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={this.state.value}
                                onChange={this.handleChange}
                                aria-label="basic tabs example"
                                variant="fullWidth"
                            >
                                <Tab
                                    label="New Procurement"
                                    {...a11yProps(0)}
                                />
                                <Tab
                                    label="All Procurement"
                                    {...a11yProps(1)}
                                />
                            </Tabs>
                        </Box>
                        <TabPanel value={this.state.value} index={0}>
                            <NewProcurement />
                        </TabPanel>
                        <TabPanel value={this.state.value} index={1}>
                            <AllProcurement />
                        </TabPanel>
                    </Box>
                    {/* </ValidatorForm> */}
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default Procurement
