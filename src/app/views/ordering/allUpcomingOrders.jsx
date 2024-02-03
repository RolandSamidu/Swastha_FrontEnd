import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { CardTitle, LoonsCard, MainContainer, SubTitle, Button } from 'app/components/LoonsLabComponents';
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    Divider,
    Grid,
} from '@material-ui/core';
import { useLocation, useHistory } from "react-router-dom";
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import ApartmentIcon from '@material-ui/icons/Apartment';
import { useDispatch, useSelector } from 'react-redux';
import localStorageService from 'app/services/localStorageService';
import AllOrders from './allUpcomingOrdersTab/allOrders';
import { Autocomplete } from '@mui/material';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents';
import {
    DatePicker,
} from 'app/components/LoonsLabComponents';
import { fecthBoth, getAllUpcomingOrders } from './redux/action';
import { set } from 'lodash';
import moment from 'moment';
function TabPanel(props) {
    const {
        children,
        value,
        index,
        ...other
    } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}>
            {
                value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )
            }
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return { id: `full-width-tab-${index}`, 'aria-controls': `full-width-tabpanel-${index}` };
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper
    }
}));

export default function FullWidthTabs() {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const theme = useTheme();
    const dispatch = useDispatch();
    const [value, setValue] = React.useState(0);
    const [warehouse, setWareHouse] = React.useState("");
    const [radio, setRadio] = React.useState("hidden");
    const [statusLoading, setLoading] = useState(true);
    const [filter, setFilters] = useState([{
        agent: {
            label: "",
            value: ""
        },
        status: {
            label: "",
            value: ""
        },
        orderType: {
            label: "",
            value: ""
        },
        from: null,
        to: null
    }])
    const [status, setStatus] = useState([{
        label: "Active",
        value: "Active"
    }, {
        label: "Processing",
        value: "Processing"
    }, {
        label: "Pending",
        value: "Pending"
    }, {
        label: "Completed",
        value: "Completed"
    }]);

    const [orderType, setOrderType] = useState([{
        label: "Normal Order",
        value: "Normal Order"
    }, {
        label: "Additional Order",
        value: "Additional Order"
    }])
    const location = useLocation();
    const history = useHistory();
    const [isOpen, setIsOpen] = useState(false);
    const [agentDropDown, setDropdownAgent] = useState([{ label: "", value: "" }]);

    const agentStatus = useSelector((state) => state?.orderingReducer?.agentStatus);
    const [searchVal, setSearchVal] = useState("");

    const upcomingOrderStatus = useSelector((state) => state?.orderingReducer?.upcomingOrderStatus);
    const upcomingOrderData = useSelector((state) => state?.orderingReducer?.upcomingOrderData);

    const agentData = useSelector((state) => state?.orderingReducer?.agentData);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 1) {
            getAllUpcomingOrders(dispatch, { status: "Pending", created_by: localStorageService.getItem("userInfo").id, page: 1, limit: 20 })
            let filters = [...filter]
            filters.status = { value: "Pending,", label: "Pending" }
            setFilters(filters)
        }
        if (newValue === 2) {
            getAllUpcomingOrders(dispatch, { status: "Processing", created_by: localStorageService.getItem("userInfo").id, page: 1, limit: 20 })
            let filters = [...filter]
            filters.status = { value: "Processing,", label: "Processing" }
            setFilters(filters)

        }
        if (newValue === 3) {
            getAllUpcomingOrders(dispatch, { status: "Completed", created_by: localStorageService.getItem("userInfo").id, page: 1, limit: 20 })
            let filters = [...filter]
            filters.status = { value: "Completed,", label: "Completed" }
            setFilters(filters)

        }
        if (newValue === 4) {
            getAllUpcomingOrders(dispatch, { status: "Active", created_by: localStorageService.getItem("userInfo").id, page: 1, limit: 20 })
            let filters = [...filter]
            filters.status = { value: "Active,", label: "Active" }
            setFilters(filters)

        }
        if (newValue == 1) {
            setRadio('visible');
        } else {
            setRadio('hidden')
        }
    };

    useEffect(() => {

        // getAllAgents(dispatch);
        fecthBoth(dispatch)

    }, [])
    useEffect(() => {
        if (upcomingOrderStatus) {
            setData(upcomingOrderData);
            setLoading(false)

        } else {
            setData([])

        }


    }, [upcomingOrderStatus])

    useEffect(() => {
        if (agentStatus === true) {

            const options = agentData.map((data) => {
                return {
                    label: data?.name,
                    value: data?.id
                }
            })
            setDropdownAgent(options)

            setLoading(false)


        } else {
            setDropdownAgent([])

        }

    }, [agentStatus])

    const handlePagination = (page, limit) => {
        setLoading(true)
        handlePagination(dispatch, { page, limit, createdBy: localStorageService.getItem("userInfo").id, order_type: filter[0].orderType.value, agent: filter[0].agent.value, from: filter[0].from ? moment(filter[0].from).format("YYYY-MM-DD") : null, to: filter[0].to ? moment(filter[0].to).format("YYYY-MM-DD") : null, status: filter[0].status.value })
    }
    const handleChangeIndex = (index) => {
        setValue(index);
    };
    const handleChangeWareHouse = () => {
        setIsOpen(true)
    }

    return (

        <MainContainer>
            <LoonsCard>
                <ValidatorForm>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                        <Grid
                            container="container"
                            lg={12}
                            md={12}
                            xs={12}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                            <Grid container="container" spacing={2} direction="row">
                                <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                    <Grid container="container" spacing={2}>

                                        <Grid item="item" xs={12} sm={12} md={4} lg={4}>
                                            <Typography variant="h6" className="font-semibold">All upcoming orders</Typography>
                                        </Grid>




                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* <Typography variant="h8" className="font-semibold">Filters</Typography> */}
                            <Grid container="container" spacing={2} direction="row">
                                <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                    <Grid container="container" spacing={2}>

                                        <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                            {value === 0 && <>
                                                <SubTitle title={"Status"}></SubTitle>
                                                <Autocomplete
                                                    className="w-full"
                                                    disableClearable={true}

                                                    value={filter[0].status}
                                                    options={status}
                                                    getOptionLabel={(option) =>
                                                        option.label ?
                                                            (option.label)
                                                            : ('')
                                                    }

                                                    onChange={(data, val) => {
                                                        let vall = [...filter]
                                                        if (val) {

                                                            vall[0].status = val;
                                                        } else {
                                                            vall[0].status = {
                                                                label: "",
                                                                value: ""
                                                            }

                                                        }
                                                        setFilters(vall)

                                                    }}


                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Status"
                                                            fullWidth
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            variant="outlined"
                                                            size="small"

                                                        />
                                                    )}
                                                />
                                            </>
                                            }

                                        </Grid>
                                        <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                            <SubTitle title={"Order type"}></SubTitle>
                                            <Autocomplete
                                                disableClearable={true}

                                                className="w-full"
                                                options={orderType}
                                                value={filter[0].orderType}
                                                onChange={(data, val) => {
                                                    let vall = [...filter]
                                                    if (val) {

                                                        vall[0].orderType = val;
                                                    } else {
                                                        vall[0].orderType = {
                                                            label: "",
                                                            value: ""
                                                        }

                                                    }
                                                    setFilters(vall)

                                                }}

                                                getOptionLabel={(option) =>
                                                    option.label ?
                                                        (option.label)
                                                        : ('')
                                                }

                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Order type"
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        size="small"

                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                            <SubTitle title={"Agent"}></SubTitle>
                                            <Autocomplete
                                                className="w-full"
                                                disableClearable={true}

                                                value={filter[0].agent}
                                                onChange={(data, val) => {
                                                    let vall = [...filter]
                                                    if (val) {

                                                        vall[0].agent = val;
                                                    } else {
                                                        vall[0].agent = {
                                                            label: "",
                                                            value: ""
                                                        }

                                                    }
                                                    setFilters(vall)

                                                }}

                                                options={agentDropDown}
                                                getOptionLabel={(option) =>
                                                    option.label ?
                                                        (option.label)
                                                        : ('')
                                                }

                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="agent"
                                                        //variant="outlined"
                                                        //value={}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        size="small"

                                                    />
                                                )}
                                            />
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container="container" spacing={2} direction="row">
                                <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                    <Grid container="container" spacing={2}>
                                        <Grid item="item" xs={12} sm={12} md={4} lg={4}>
                                            <SubTitle title={"From"}></SubTitle>
                                            <DatePicker
                                                className="w-full"
                                                value={filter[0]?.from}

                                                onChange={(date) => {
                                                    let val = [...filter]

                                                    if (date) {
                                                        val[0].from = date

                                                    } else {
                                                        val[0].from = null

                                                    }
                                                    setFilters(val)

                                                }}

                                                placeholder="Date Range (From)"
                                            />
                                        </Grid>
                                        <Grid item="item" xs={12} sm={12} md={4} lg={4}>
                                            <SubTitle title={"To"}></SubTitle>
                                            <DatePicker
                                                className="w-full" onChange={(date) => {
                                                    let val = [...filter]

                                                    if (date) {
                                                        val[0].to = date

                                                    } else {
                                                        val[0].to = null

                                                    }
                                                    setFilters(val)

                                                }}

                                                value={filter[0]?.to}

                                                placeholder="Date Range (to)"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container="container" spacing={2} direction="row">
                                <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                    <Grid container="container" spacing={2}>
                                        <Grid item="item" xs={12} sm={12} md={2} lg={2}>
                                            <Button
                                                className="text-right mt-6"
                                                progress={false}
                                                scrollToTop={false}
                                                onClick={() => {
                                                    const params = {
                                                        agent: filter[0] ? filter[0].agent.value : null,
                                                        orderType: filter[0] ? filter[0].orderType.value : null,
                                                        status: value === 0 ? filter[0]?.status?.value : value === 1 ? "Pending" : value === 2 ? "Processing" : value === 3 ? "Completed" : value === 4 ? "Active" : null,
                                                        from: filter[0]?.from ? moment(filter[0]?.from).format("YYYY-MM-DD") : null,
                                                        to: filter[0]?.to ? moment(filter[0]?.to).format("YYYY-MM-DD") : null,
                                                        createdBy: localStorageService.getItem("userInfo").id,
                                                        page: 1,
                                                        limit: 20


                                                    }

                                                    getAllUpcomingOrders(dispatch, params);
                                                    setSearchVal("")

                                                }}
                                            // type='submit'
                                            >
                                                <span className="capitalize">Filter</span>
                                            </Button>&ensp;&ensp;
                                            <Button
                                                className="text-right mt-6"
                                                progress={false}
                                                scrollToTop={false}
                                                onClick={() => {
                                                    const params = {

                                                        status: value === 1 ? "Pending" : value === 2 ? "Processing" : value === 3 ? "Completed" : value === 4 ? "Active" : null,

                                                        createdBy: localStorageService.getItem("userInfo").id


                                                    }

                                                    setFilters([{
                                                        agent: {
                                                            label: "",
                                                            value: ""
                                                        },
                                                        status: {
                                                            label: "",
                                                            value: ""
                                                        },
                                                        orderType: {
                                                            label: "",
                                                            value: ""
                                                        },
                                                        from: null,
                                                        to: null
                                                    }])
                                                    getAllUpcomingOrders(dispatch, params);
                                                    setSearchVal("")



                                                }}
                                            // type='submit'
                                            >
                                                <span className="capitalize">Reset</span>
                                            </Button>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                    <Grid style={{ height: '20px', width: '100%' }}></Grid>
                    <Grid container="container" spacing={2} direction="row">
                        <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                            <Grid container="container" spacing={2}>
                                <Grid item="item" xs={12} sm={12} md={12} lg={12} >
                                    <table>
                                        <tr>
                                            {/* <td>Search</td> */}
                                            <td><TextValidator
                                                className='w-full'
                                                placeholder="Search"
                                                onChange={(e) => setSearchVal(e.target.value)}
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            /></td>
                                            <td>  <Button style={{ marginBottom: '20px' }}
                                                className="text-right mt-6"
                                                progress={false}
                                                scrollToTop={false}
                                            // type='submit'
                                            >
                                                <span className="capitalize" onClick={() => getAllUpcomingOrders(dispatch, { search: searchVal, created_by: localStorageService.getItem("userInfo").id })}>Search</span>
                                            </Button></td>
                                        </tr>
                                    </table>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid style={{ height: '20px', width: '100%' }}>

                    </Grid>

                    <AppBar position="static" color="default">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example">
                            <Tab label="ALL ORDERS" {...a11yProps(0)} />
                            <Tab label="PENDING ORDERS" {...a11yProps(1)} />
                            <Tab label="PROCESSING ORDERS" {...a11yProps(2)} />
                            <Tab label="COMPLETED ORDERS" {...a11yProps(3)} />
                            <Tab label="Active ORDERS" {...a11yProps(4)} />


                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        {console.log(statusLoading, "statusLoading>>>>")}
                        <AllOrders data={data} status={statusLoading} filter={filter} />
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <AllOrders data={data} status={statusLoading} filter={filter} />
                    </TabPanel>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        <AllOrders data={data} status={statusLoading} filter={filter} />
                    </TabPanel>
                    <TabPanel value={value} index={3} dir={theme.direction}>
                        <AllOrders data={data} status={statusLoading} filter={filter} />
                    </TabPanel>
                    <TabPanel value={value} index={4} dir={theme.direction}>
                        <AllOrders data={data} status={statusLoading} filter={filter} />
                    </TabPanel>
                </ValidatorForm>

            </LoonsCard>
        </MainContainer >
    );
}
