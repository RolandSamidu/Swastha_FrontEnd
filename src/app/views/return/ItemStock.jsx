import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { CardTitle, LoonsCard, MainContainer, SubTitle } from 'app/components/LoonsLabComponents';
import ItemStockItems from './ItemStockItems';
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    Divider,
    Grid
} from '@material-ui/core';
import ReturnDeliveryDetails from './Tabs/returnDeliveryDetails';
import AddDeliveryDetails from '../orders/AddDeliveryDetails';
import DeliveryDetailsWarehouse from "./Tabs/returnDeliveryDetailsWarehouse";
import { useLocation, useHistory } from "react-router-dom";
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import ApartmentIcon from '@material-ui/icons/Apartment';
import { useSelector } from 'react-redux';
import localStorageService from "app/services/localStorageService";
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
    const wareHouseStatusModal = useSelector((state) => state?.returnReducer?.wareHouseStatusModal);

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
        if (localStorageService.getItem("Selected_Warehouse")) {
            setWareHouse(localStorageService.getItem("Selected_Warehouse")?.name)
        }
    }, [wareHouseStatusModal])

    useEffect(() => {
        if (location.pathname) {
            history.push({ state: { returnRequestDeliveryDetails: null } })
        }

    }, [location.pathname]);

    useEffect(() => {
        if (location?.state?.returnRequestDeliveryDetails) {
            setValue(1);
        }
        if (localStorageService.getItem("Selected_Warehouse")) {
            console.log(localStorageService.getItem("Selected_Warehouse"),"uuuuu")
            setWareHouse(localStorageService.getItem("Selected_Warehouse").name)
        } else {
            setIsOpen(true)
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

                                    <Grid item="item" xs={12} sm={12} md={8} lg={8}>
                                        <Typography variant="h6" className="font-semibold">Item Stock</Typography>
                                    </Grid>
                                    <Grid className='flex justify-end' item="item" xs={12} sm={12} md={2} lg={2}>

                                        {warehouse !== "" ? <SubTitle title={`Your warehouse is ${warehouse}`}></SubTitle> : <SubTitle title={`Please select a ware house`}></SubTitle>}
                                    </Grid>
                                    <Grid className='flex justify-end' item="item" xs={12} sm={12} md={2} lg={2}>
                                        <LoonsButton
                                            color='primary'
                                            onClick={handleChangeWareHouse}
                                        >
                                            <ApartmentIcon />
                                            Change Warehouse
                                        </LoonsButton>
                                    </Grid>
                                  

                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <Divider className='mb-3' />
                <ItemStockItems isOpen={isOpen}></ItemStockItems>
            </LoonsCard>
        </MainContainer >
    );
}
