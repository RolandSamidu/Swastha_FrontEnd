import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { CardTitle, LoonsCard, MainContainer, SubTitle } from 'app/components/LoonsLabComponents';
import {
    Radio,
    RadioGroup,
    FormLabel,
    FormControl,
    FormControlLabel,
    Divider,
    Grid
} from '@material-ui/core';
import AllocatedItems from './tabs/allocatedItems';
import DroppedItems from './tabs/droppedItems';
import AllItemsDistribution from './tabs/allItems';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import LoonsButton from "app/components/LoonsLabComponents/Button";
import { useEffect, useState, useParams } from 'react';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import localStorageService from '../../services/localStorageService';
import { dateParse, timeParse } from 'utils'
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

export default function FullWidthTabs(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [radio, setRadio] = React.useState("hidden");
    const [loading, setLoading] = React.useState(false);
    const [institiute, setInstitiute] = React.useState("");

    const [orderSummury, setorderSummury] = useState({
        orderBy: {
            name: 'N/A',
            designation: 'N/A',
            date: 'N/A',
            time: 'N/A'
        },
        approvedBy: {
            name: 'N/A',
            designation: 'N/A',
            date: 'N/A',
            time: 'N/A'
        },
        allocatedBy: {
            name: 'N/A',
            designation: 'N/A',
            date: 'N/A',
            time: 'N/A'
        },
        issuedBy: {
            name: 'N/A',
            designation: 'N/A',
            date: 'N/A',
            time: 'N/A'
        },
        receivedBy: {
            name: 'N/A',
            designation: 'N/A',
            date: 'N/A',
            time: 'N/A'
        },
        compleleBy: {
            name: 'N/A',
            designation: 'N/A',
            date: 'N/A',
            time: 'N/A'
        },
        issueSubmitedBy: {
            name: 'N/A',
            designation: 'N/A',
            date: 'N/A',
            time: 'N/A'
        }
    });
    // const params = useParams()

    const handleChange = (event, newValue) => {
        setValue(newValue);
        console.log("new val", newValue)
        if (newValue == 1) {
            setRadio('visible');
        } else {
            setRadio('hidden')
        }

    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const [data, setData] = useState([]);

    console.log(props);



    async function loadOrderSummury() {
        setLoading(false)
        let res = await PharmacyOrderService.getOrderSummuries({ order_exchange_id: props.match.params.id })
        if (res.status) {
            console.log("Order Summury Data", res.data.view.data)

            let order_summury = {
                orderBy: {
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                approvedBy: {
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                allocatedBy: {
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                issuedBy: {
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                receivedBy: {
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                compleleBy: {
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                issueSubmitedBy: {
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                }
            }

            res.data.view.data.forEach(element => {
                if (element.Employee) {
                    if (element.activity == "ORDERED") {
                        order_summury.orderBy.name = element.Employee.name
                        order_summury.orderBy.designation = element.Employee.designation
                        order_summury.orderBy.date = element.createdAt
                        order_summury.orderBy.time = element.createdAt

                    } else if (element.activity == "APPROVED") {
                        order_summury.approvedBy.name = element.Employee.name
                        order_summury.approvedBy.designation = element.Employee.designation
                        order_summury.approvedBy.date = element.createdAt
                        order_summury.approvedBy.time = element.createdAt
                    } else if (element.activity == "ALLOCATED") {
                        order_summury.allocatedBy.name = element.Employee.name
                        order_summury.allocatedBy.designation = element.Employee.designation
                        order_summury.allocatedBy.date = element.createdAt
                        order_summury.allocatedBy.time = element.createdAt
                    } else if (element.activity == "ISSUED") {
                        order_summury.issuedBy.name = element.Employee.name
                        order_summury.issuedBy.designation = element.Employee.designation
                        order_summury.issuedBy.date = element.createdAt
                        order_summury.issuedBy.time = element.createdAt
                    }
                    else if (element.activity == "RECEIVED") {
                        order_summury.receivedBy.name = element.Employee.name
                        order_summury.receivedBy.designation = element.Employee.designation
                        order_summury.receivedBy.date = element.createdAt
                        order_summury.receivedBy.time = element.createdAt
                    } else if (element.activity == "COMPLETED") {
                        order_summury.compleleBy.name = element.Employee.name
                        order_summury.compleleBy.designation = element.Employee.designation
                        order_summury.compleleBy.date = element.createdAt
                        order_summury.compleleBy.time = element.createdAt
                    } else if (element.activity == "ISSUE SUBMITTED") {
                        order_summury.issueSubmitedBy.name = element.Employee.name
                        order_summury.issueSubmitedBy.designation = element.Employee.designation
                        order_summury.issueSubmitedBy.date = element.createdAt
                        order_summury.issueSubmitedBy.time = element.createdAt
                    }
                    // setorderSummury(order_summury)
                }
            }
            );
            setorderSummury(order_summury)
            setLoading(true)
        }

    }

    async function setInitial() {
        let userRole = await localStorageService.getItem("userInfo").roles

        if (userRole.includes('MSD MSA')) {
            console.log("I have been mounted2", userRole)
            // a11yProps(1)
            // handleChange(1)
            setValue(1);
        }
        const searchParams = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        })

        console.log('get institute info', searchParams)
        setInstitiute(searchParams.institute)
        loadOrderSummury()

        
    }


    useEffect(() => {

        setInitial()
    }, [])





    return (

        <MainContainer>
            <LoonsCard>
                <Grid container="container" lg={12} md={12}>
                    <Grid item="item" lg={6} md={6} xs={6}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'column'
                            }}>
                            <div className='col'>
                                <Typography variant="h4" className="font-semibold">Individual Orders</Typography>
                            </div>
                            <div>
                                <Typography variant="h5" className="font-semibold">Order ID : {props.match.params.order}</Typography>
                            </div>
                            <div>
                                <Typography variant="h6" className="font-semibold">No of Items: {props.match.params.items}</Typography>
                            </div>
                            <div>
                                <Typography variant="h6" className="font-semibold">Institiute/Warehouse: {institiute}</Typography>
                                {/* institiute */}
                            </div>
                        </div>
                    </Grid>
                    {/* <Grid item="item" lg={3} md={3} xs={3}>
                            <Grid container="container" lg={12} md={12} xs={12}>
                                <Grid item="item" lg={12} md={12} xs={12}>
                                    <Typography variant="h6" className="font-semibold text-center">Vehicle</Typography>
                                </Grid>
                                <Grid item="item" lg={12} md={12} xs={12}>
                                    <Grid
                                        container="container"
                                        style={{
                                            alignItems: 'center'
                                        }}>
                                        <Grid item="item" lg={6} md={6} xs={6}>
                                            <Grid container="container" lg={12} md={12} xs={12}>
                                                <Grid item="item" lg={6} md={6} xs={6}>ID :</Grid>
                                                <Grid item="item" lg={6} md={6} xs={6}><Typography className="font-semibold">0004</Typography></Grid>
                                                <Grid item="item" lg={6} md={6} xs={6}>Type : </Grid>
                                                <Grid item="item" lg={6} md={6} xs={6}>
                                                    <Typography className="font-semibold">Light Truck</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item="item" lg={2} md={2} xs={2}><AirportShuttleIcon fontSize="medium"/></Grid>
                                        <Grid item="item" lg={3} md={3} xs={3}><LoonsButton>Change</LoonsButton></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid> */}
                    <Grid item="item" lg={6} md={6} xs={6}>
                        <Grid container="container" lg={12} md={12} xs={12}>
                            {/* <Grid item="item" lg={12} md={12} xs={12}>
                                    <Typography variant="h6" className="font-semibold text-center">Custodian</Typography>
                                </Grid> */}
                            <Grid item="item" lg={12} md={12} xs={12}>
                                <Grid
                                    container="container"
                                    style={{
                                        alignItems: 'self-start'
                                    }}>
                                    <Grid item="item" lg={6} md={6} xs={6}>
                                        <Grid container="container" lg={12} md={12} xs={12}>
                                            {/* <Grid item="item" lg={6} md={6} xs={6}>ID :</Grid>
                                                <Grid item="item" lg={6} md={6} xs={6}><Typography className="font-semibold">00002</Typography></Grid> */}
                                            <Grid item="item" lg={6} md={6} xs={6}>Name : </Grid>
                                            <Grid item="item" lg={6} md={6} xs={6}>
                                                <Typography className="font-semibold">{props.match.params.empname}</Typography>
                                            </Grid>
                                            <Grid item="item" lg={6} md={6} xs={6}>Contact No : </Grid>
                                            <Grid item="item" lg={6} md={6} xs={6}>
                                                <Typography className="font-semibold">{props.match.params.empcontact}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {/* <Grid item="item" lg={2} md={2} xs={2}><AccountCircleIcon fontSize="medium"/></Grid>                                        
                                        <Grid item="item" lg={3} md={3} xs={3}><LoonsButton>Change</LoonsButton></Grid> */}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider className='mb-4'></Divider>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example">
                        <Tab label="All Items" {...a11yProps(0)} />
                        <Tab label="Allocated Items" {...a11yProps(1)} />
                        <Tab label="Dropped Items" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <AllItemsDistribution id={props} />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <AllocatedItems id={props} />
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <DroppedItems id={props} />
                </TabPanel>

                {loading &&
                    <Grid container className='mb-3 mt-5 px-3 py-3' style={{ backgroundColor: "#f7e5cc" }}>
                        <h4>Order Summary</h4>
                        <Grid container>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={"Order By"} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={orderSummury?.orderBy.name} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={orderSummury?.orderBy.designation} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={dateParse(orderSummury?.orderBy.date)} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={timeParse(orderSummury?.orderBy.time)} />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={"Approved By"} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={orderSummury?.approvedBy.name} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={orderSummury?.approvedBy.designation} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={dateParse(orderSummury?.approvedBy.date)} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={timeParse(orderSummury?.approvedBy.time)} />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={"Allocated By"} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={orderSummury?.allocatedBy.name} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={orderSummury?.allocatedBy.designation} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={dateParse(orderSummury?.allocatedBy.date)} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={timeParse(orderSummury?.allocatedBy.time)} />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={"Issue Submited By"} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={orderSummury?.issueSubmitedBy.name} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={orderSummury?.issueSubmitedBy.designation} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={dateParse(orderSummury?.issueSubmitedBy.date)} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={timeParse(orderSummury?.issueSubmitedBy.time)} />
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={"Issued By"} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={orderSummury?.issuedBy.name} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={orderSummury?.issuedBy.designation} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={dateParse(orderSummury?.issuedBy.date)} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={timeParse(orderSummury?.issuedBy.time)} />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={"Received By"} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={orderSummury?.receivedBy.name} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={orderSummury?.receivedBy.designation} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={dateParse(orderSummury?.receivedBy.date)} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={timeParse(orderSummury?.receivedBy.time)} />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={"Complele By"} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={orderSummury?.compleleBy.name} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={orderSummury?.compleleBy.designation} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={dateParse(orderSummury?.compleleBy.date)} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={timeParse(orderSummury?.compleleBy.time)} />
                            </Grid>
                        </Grid>
                    </Grid>
                }

            </LoonsCard>
        </MainContainer>
    );
}