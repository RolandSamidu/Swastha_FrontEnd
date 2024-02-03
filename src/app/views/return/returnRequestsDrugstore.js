import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { CardTitle, LoonsCard, MainContainer, SubTitle } from 'app/components/LoonsLabComponents';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Grid
} from '@material-ui/core';
import { useLocation, useHistory } from "react-router-dom";
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import ApartmentIcon from '@material-ui/icons/Apartment';
import { useSelector } from 'react-redux';
import localStorageService from 'app/services/localStorageService';
import MyAllReturnRequests from "./Tabs/myAllReturnRequestDrugstoreTab";
import MyAllReturnRequestAdminToBeRecieved from "./Tabs//myAllReturnRequestDrugStorePending";
import MyAllReturnRequestAdminAccept from "./Tabs/myAllReturnRequestDrugStoreAccept";
import MyAllReturnRequestAdminReject from "./Tabs/myAllReturnRequestDrugStoreReject";

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
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [warehouse, setWareHouse] = React.useState("");
  const [radio, setRadio] = React.useState("hidden");
  const location = useLocation();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [userRoles, setUserRoles] = useState(null);
  const wareHouseStatusModal = useSelector((state) => state?.returnReducer?.wareHouseStatusModal);
  const wareHouseNames = useSelector((state) => state?.returnReducer?.wareHouseName);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue == 1) {
      setRadio('visible');
    } else {
      setRadio('hidden')
    }
  };

  useEffect(() => {
    setIsOpen(false)
    setWareHouse(wareHouseNames)
  }, [wareHouseStatusModal])

  useEffect(() => {
    if (location.pathname) {
      history.push({ state: { returnRequestDeliveryDetails: null } })
    }

  }, [location.pathname]);

  useEffect(async () => {
    let user_info = await localStorageService.getItem('userInfo')
    setUserRoles(user_info.roles)
    if (location?.state?.returnRequestDeliveryDetails) {
      setValue(1);
    }
    if (localStorageService.getItem("Selected_Warehouse")) {
      setWareHouse(localStorageService.getItem("Selected_Warehouse")?.name)
    } else {

      if (!user_info.roles.includes('MSD AD')) {
        setIsOpen(true)
      }

    }
  }, [])

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const handleChangeWareHouse = () => {
    setIsOpen(true)
  }

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
            <Grid container="container" spacing={2} direction="row">
              <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                <Grid container="container" spacing={2}>

                  <Grid item="item" xs={12} sm={12} md={4} lg={4}>
                    <Typography variant="h6" className="font-semibold">My All Return Requests</Typography>
                  </Grid>
                  {!userRoles?.includes('MSD AD') &&
                    <Grid item="item" xs={12} sm={12} md={2} lg={2}>

                      {warehouse !== "" ? <SubTitle title={`Your warehouse is ${warehouse}`}></SubTitle> : <SubTitle title={`Please select a ware house`}></SubTitle>}
                    </Grid>
                  }
                  <Grid item="item" xs={12} sm={12} md={2} lg={2}>

                    {!userRoles?.includes('MSD AD') &&
                      <LoonsButton
                        color='primary'
                        onClick={handleChangeWareHouse}
                      >
                        <ApartmentIcon />
                        Change Warehouse
                      </LoonsButton>
                    }


                  </Grid>
                  {/* <Grid item="item" xs={12} sm={12} md={4} lg={4}>
                    <RadioGroup row="row" defaultValue="return">
                      <FormControlLabel value="order" control={<Radio />} label="Order" />
                      <FormControlLabel value="exchange" control={<Radio />} label="Exchange" />
                      <FormControlLabel value="return" control={<Radio />} label="Return" />
                    </RadioGroup>
                  </Grid> */}

                </Grid>
              </Grid>
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
            <Tab label="All Return Requests" {...a11yProps(0)} />
           {/*  <Tab label="To be recieved" {...a11yProps(1)} />
            <Tab label="Recieved" {...a11yProps(2)} />
            <Tab label="Rejected" {...a11yProps(3)} /> */}
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <MyAllReturnRequests isOpen={isOpen}></MyAllReturnRequests>
        </TabPanel>
       {/*  <TabPanel value={value} index={1} dir={theme.direction}>
          <>
            <MyAllReturnRequestAdminToBeRecieved isOpen={isOpen}></MyAllReturnRequestAdminToBeRecieved>
          </>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <>
            <MyAllReturnRequestAdminAccept isOpen={isOpen}></MyAllReturnRequestAdminAccept>
          </>
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <>
            <MyAllReturnRequestAdminReject isOpen={isOpen}></MyAllReturnRequestAdminReject>
          </>
        </TabPanel> */}
      </LoonsCard>
    </MainContainer >
  );
}
