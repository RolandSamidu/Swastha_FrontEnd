import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { CardTitle, LoonsCard, MainContainer } from 'app/components/LoonsLabComponents';
import { Radio, RadioGroup, FormLabel, FormControl, FormControlLabel, Grid, Avatar } from '@material-ui/core';
import img from '../MSD Custodian/001-man.svg'
import MDS_AllOdersCustodian from './MDS_AllOrdersCustodian';
// import OdersWithIsssues from './IndividualOrderPP';
import { useParams } from 'react-router-dom';

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

export default function MDS_PickUpPersonProfile() {
    const classes = useStyles();
    const params = useParams();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [radio, setRadio] = React.useState("hidden")
    const [user, setUser] = React.useState({ id: '1', name: "john Doe", contact: '0715491826' })

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
                <Grid container spacing={2} >
                    <Grid item lg={6} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <h5>Employee ID : {params.id}</h5>
                            </Grid>
                            <Grid item xs={12}>
                                <h5>Employee Name : {user.name}</h5>
                            </Grid>
                            <Grid item xs={12}>
                                <h5>Employee Contact : {user.contact}</h5>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item lg={6} xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Avatar alt="Remy Sharp" src={img} style={{ width: '20%', height: '100%' }} />
                    </Grid>
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
                        <MDS_AllOdersCustodian id={params.id}/>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                    </TabPanel>
            </LoonsCard>
        </MainContainer>
    );
}