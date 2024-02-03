import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Draft from './Draft/Main'
import Approval from './Approval/Main'
import Approved from './Approved/Main'
import Reject from './Reject/Main'
import Amendment from './Amendment/Main'
import Cancel from './Cancel/Main'

import { MainContainer, LoonsCard } from 'app/components/LoonsLabComponents'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>{children}</>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MainContainer>
      <LoonsCard style={{ minHeight: '80vh' }}>
        <Paper>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="PO"
            indicatorColor="primary"
            textColor="primary"
          >

            <Tab label="All" {...a11yProps(0)} />
            <Tab label="Pending Approval" {...a11yProps(1)} />
            <Tab label="Approved" {...a11yProps(2)} />
            <Tab label="Rejected" {...a11yProps(3)} />
            <Tab label="Amendments" {...a11yProps(4)} />
            <Tab label="Canceled" {...a11yProps(5)} />
          </Tabs>
        </Paper>
        <TabPanel value={value} index={0}>
          <Draft />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Approval />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Approved />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Reject />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Amendment />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Cancel />
        </TabPanel>
      </LoonsCard>
    </MainContainer>
  );
}
