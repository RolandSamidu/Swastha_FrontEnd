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
import CPAllOrderss from './tabs/CPAllOderss';
import CPApproved from './tabs/CPAproved';
import CPRejected from './tabs/CPRejected';

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

export default function CPTab1() {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    return (
        <> < Grid container spacing = {
            2
        } > <Grid item="item" xs={12}>
            <Typography variant="h5" className="font-semibold">Orders</Typography>
        </Grid>
    </Grid>
    <Grid container="container" spacing={2}>
        <AppBar
            position="static"
            color="default"
            style={{
                zIndex: 0
            }}>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example">
                <Tab label="All Orders" {...a11yProps(0)}/>
                <Tab label="Approved Orders" {...a11yProps(1)}/>
                <Tab label="Rejected Orders" {...a11yProps(2)}/>
            </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} dir={theme.direction}>
            <CPAllOrderss/>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
            <CPApproved/>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
            <CPRejected/>
        </TabPanel>
    </Grid>
</>
    );
}