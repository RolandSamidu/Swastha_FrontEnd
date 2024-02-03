import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {CardTitle, LoonsCard, MainContainer} from 'app/components/LoonsLabComponents';
import ReturnModeTab from './Tabs/returnModeTab';
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    Divider,
    Grid
} from '@material-ui/core';
import AllReturnRequests from "./pharmacistReturnTabs/allReturnRequests"

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

export default function FullWidthTabs() {
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

    return (

        <MainContainer>
            <LoonsCard>
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
                        <Grid item="item">
                            <Typography variant="h6" className="font-semibold">Return Requests</Typography>
                        </Grid>
                        <Grid item="item">
                            <RadioGroup row="row" defaultValue="order">
                                <FormControlLabel value="order" control={<Radio />} label="Order"/>
                                <FormControlLabel value="exchange" control={<Radio />} label="Exchange"/>
                                <FormControlLabel value="return" control={<Radio />} label="Return"/>
                            </RadioGroup>
                        </Grid>
                    </Grid>                    
                </div>
               <Divider className='mb-3' />
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example">
                        <Tab label="All Return Requests" {...a11yProps(0)}/>
                        <Tab label="To be recieved" {...a11yProps(1)}/>
                        <Tab label="Recieved" {...a11yProps(2)}/>
                        <Tab label="Rejected Return Requests" {...a11yProps(2)}/>
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0} dir={theme.direction}>
                  <AllReturnRequests/>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <>
                        {/* <ReturnDeliveryDetails></ReturnDeliveryDetails> */}
                    </>
                </TabPanel>
                {/* <TabPanel value={value} index={2} dir={theme.direction}>
                    <AddDeliveryDetails/>
                </TabPanel> */}
            </LoonsCard>
        </MainContainer>
    );
}