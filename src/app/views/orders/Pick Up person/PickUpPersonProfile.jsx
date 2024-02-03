import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { CardTitle, LoonsCard, MainContainer } from 'app/components/LoonsLabComponents';
import { Radio, RadioGroup, FormLabel, FormControl, FormControlLabel, Grid, Avatar } from '@material-ui/core';
import img from '../Pick Up person/001-man.svg'
import AllOdersPP from './AllOdersPP';
import EmployeeServices from 'app/services/EmployeeServices';
import OdersWithIsssues from './IndividualOrderPP';
import { useParams } from 'react-router-dom';
import localStorageService from 'app/services/localStorageService';

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

export default function PickUpPersonProfile() {
    const classes = useStyles();
    const params = useParams();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [radio, setRadio] = React.useState("hidden")
    const [user, setUser] = React.useState()
    const [loaded, setLoaded] = React.useState(false)

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

    // const getEmployeeData = async (id) => {
    //     setLoaded(false)
    //     let res = await EmployeeServices.getEmployeeByID(id);
    //     if (res.status && res.status == 200) {
    //         setUser(res.data.view);
    //         setLoaded(true)
    //     }
    // }

    // const getEmployeeFromLogin = async () => {
    //     setLoaded(false)
    //     let user = await localStorageService.getItem('userInfo');
    //     if (user) {
    //         console.log('user', user);
    //         getEmployeeData(user.id);
    //         setLoaded(true)
    //     }

    // }

    // useEffect(()=>{

    //         getEmployeeFromLogin();

    // })

    return (

        <MainContainer>
            <LoonsCard>
                <Grid container spacing={2} >
                    {/* <Grid item lg={6} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <h5>Employee ID : {user ? user.id ? user.id :'N/A' :"N/A"}</h5>
                            </Grid>
                            <Grid item xs={12}>
                                <h5>Employee Name : {user ? user.name ? user.name :'N/A' :"N/A"}</h5>
                            </Grid>
                            <Grid item xs={12}>
                                <h5>Employee Contact : { user ? user.contact_no ? user.contact_no : 'N/A' :"N/A"}</h5>
                            </Grid>
                        </Grid>
                    </Grid> */}
                    {/* <Grid item lg={6} xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Avatar alt="Remy Sharp" src={img} style={{ width: '20%', height: '100%' }} />
                    </Grid> */}
                </Grid>
                <AppBar position="static" color="default" >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example">
                        <Tab label="All Orders" {...a11yProps(0)} />
                        <Tab label="Orders With Issues" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <AllOdersPP />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                </TabPanel>

            </LoonsCard>
        </MainContainer>
    );
}