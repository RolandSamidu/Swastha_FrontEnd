import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {CardTitle, LoonsCard, MainContainer} from 'app/components/LoonsLabComponents';
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
import {useEffect, useState} from 'react';
import PharmacyOrderService from 'app/services/PharmacyOrderService';

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
    return {id: `full-width-tab-${index}`, 'aria-controls': `full-width-tabpanel-${index}`};
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
    const [radio, setRadio] = React.useState("hidden")

    const handleChange = (event, newValue) => {
        setValue(newValue);
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
                                <Typography variant="h4" className="font-semibold">Individual Order</Typography>
                            </div>
                            <div>
                                <Typography variant="h5" className="font-semibold">Order ID : {props.match.params.order}</Typography>
                            </div>
                            <div>
                                <Typography variant="h6" className="font-semibold">No of Items: {props.match.params.items}</Typography>
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
                        <Tab label="All Items" {...a11yProps(0)}/>
                        <Tab label="Allocated Items" {...a11yProps(1)}/>
                        <Tab label="Dropped Items" {...a11yProps(2)}/>
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <AllItemsDistribution id={props}/>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <AllocatedItems id={props}/>
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <DroppedItems id={props}/>
                </TabPanel>
            </LoonsCard>
        </MainContainer>
    );
}