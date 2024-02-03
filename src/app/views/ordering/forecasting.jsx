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
import ForecastRequirement from './Tabs/forcastTab';
import StockTab from './Tabs/stockTab';
import OrderDetails from './Tabs/orderQuantityTab';
import { useLocation, useHistory, useParams } from "react-router-dom";
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import ApartmentIcon from '@material-ui/icons/Apartment';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAgents, getSingleOrderRequirementItem, revertOrerStatusToTrue } from './redux/action';
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
    const { id } = useParams();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [warehouse, setWareHouse] = React.useState("");
    const dispatch = useDispatch();
    const [radio, setRadio] = React.useState("hidden");
    const location = useLocation();
    const history = useHistory();
    const [isOpen, setIsOpen] = useState(false);
    const [strengths,setStrengths] = useState({});
    const wareHouseStatusModal = useSelector((state) => state?.returnReducer?.wareHouseStatusModal);
    const singleOrderItem = useSelector((state) => state?.orderingReducer?.singleOneOrderItemData)
    const singleOrderItemStatus = useSelector((state) => state?.orderingReducer?.singleOneOrderItemStatus);
    const strenghtStatus = useSelector((state) => state?.orderingReducer?.strengthStatus);
    const strenghtList = useSelector((state) => state?.orderingReducer?.strengthList);

    const [item, setItem] = useState({})
    const [fromDate, setFromDate] = useState(null)


    const handleChangTab = (index, fromDate) => {
        setValue(index);
        if (index === 1 && fromDate) {
            console.log(fromDate,"fromDte")
            setFromDate(fromDate)

        }

    }

    useEffect(()=>{
        if(strenghtStatus){
            let id = window.location.href.split("/")[6];
            const item = strenghtList.filter((data)=>data.id === id)[0];
            setStrengths(item);
            console.log(item,"iteemmm>>>>")
        }

    },[strenghtStatus])


    const handleChange = (event, newValue) => {
        
        setValue(newValue);
        
        if (newValue === 0) {
            getAllAgents(dispatch, id)

        }
        if (newValue == 1) {
            setRadio('visible');


        } else {
            setRadio('hidden')
        }
    };

    useEffect(() => {
        getAllAgents(dispatch, id)

    }, [])

    useEffect(() => {
        if (singleOrderItemStatus) {
            setItem(singleOrderItem)
        } else {
            setItem({})

        }

    }, [singleOrderItemStatus])

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

                                    <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                        {/* <Typography variant="h6" className="font-semibold">Order Id</Typography> */}
                                    </Grid>
                                    <Grid item="item" xs={12} sm={12} md={2} lg={2}>
                                    </Grid>
                                    <Grid item="item" xs={12} sm={12} md={6} lg={6}>
                                        <Typography variant="h6" className="font-semibold">Order Control Form</Typography>
                                    </Grid>
                                    {/* <Grid item="item" xs={12} sm={12} md={2} lg={2}>

                                        {warehouse !== "" ? <SubTitle title={`Your warehouse is ${warehouse}`}></SubTitle> : <SubTitle title={`Please select a ware house`}></SubTitle>}
                                    </Grid> */}
                                    {/* <Grid item="item" xs={12} sm={12} md={2} lg={2}>
                                        <LoonsButton
                                            color='primary'
                                            onClick={handleChangeWareHouse}
                                        >
                                            <ApartmentIcon />
                                            Change Warehouse
                                        </LoonsButton>
                                    </Grid> */}
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
                        <Grid container="container" style={{ height: "50px" }}>

                        </Grid>
                        <Grid container="container" spacing={2} direction="row">
                            <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                <Grid container="container" spacing={2}>
                                    <Grid item="item" xs={12} sm={4} md={12} lg={12}>
                                        <table style={{ border: "2px solid #B0B0B0", width: "100%", backgroundColor: "#4dac86" }}>
                                            <tr>
                                                <td>
                                                    <Typography variant="h5" className="font-semibold">&ensp;&ensp;{item.item_name ? item.item_name : ""}</Typography>
                                                     &ensp;&ensp;<span style={{fontSize:"20px"}}><b>Status : {singleOrderItem?.status || ""}</b></span>
                                                </td>
                                                <td >

                                                    <tr>
                                                        <td style={{ width: '100px' }}>
                                                            <b> Item Category</b>

                                                        </td>
                                                        <td style={{ width: '100px' }}>
                                                            {item?.category}
                                                        </td>
                                                        <td></td>
                                               
                                                        <td><b> Ven</b>
                                                           
                                                        </td>
                                                        <td style={{ width: '100px' }}>
                                                            {console.log(strenghtList,"strenghtList>>>")}
                                                            {strengths?.VEN?.name}
                                                        </td>
                                                   
                                                        <td><b> Estimated item</b>
                                                           
                                                        </td>
                                                        
                                                        <td style={{ width: '100px' }}>
                                                            {strengths?.used_for_estimates}
                                                        </td>
                                                        <td></td>

                                                 
                                                        <td>
                                                            <b>COMP/Regular </b>
                                                        </td>
                                                        <td style={{ width: '100px' }}>
                                                            {strengths?.ItemType?.name}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <b>Unit Cost</b>
                                                        </td>
                                                        <td style={{ width: '100px' }}>
                                                            {strengths?.standard_cost}
                                                        </td>
                                                        <td></td>

                                                   
                                                        <td>
                                                           <b>Formalatory Approved</b> 
                                                        </td>
                                                        <td style={{ width: '100px' }}>
                                                            {strengths?.formulatory_approved}
                                                        </td>
                                                  
                                                        <td>
                                                           <b> UFF</b>
                                                        </td>
                                                        <td style={{ width: '100px' }}>
                                                            {strengths?.used_for_formulation}
                                                        </td>
                                                        <td></td>

                                                   
                                                        <td style={{ width: '100px' }}>
                                                            <b> Item Type</b>

                                                        </td>
                                                        <td style={{ width: '100px' }}>
                                                            {item?.item_type}

                                                        </td>
                                                        {/* <td style={{ width: '100px' }}>
                                                            Essential
                                                        </td>

                                                        <td style={{ width: '100px' }}>
                                                            ABC
                                                        </td>
                                                        <td style={{ width: '100px' }}>
                                                            C
                                                        </td> */}

                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: '100px' }}>
                                                            <b> Item Group</b>

                                                        </td>
                                                        <td style={{ width: '100px' }}>
                                                            {item?.group}

                                                        </td>
                                                        {/* <td style={{ width: '100px' }}>
                                                            Essential
                                                        </td>

                                                        <td style={{ width: '100px' }}>
                                                            ABC
                                                        </td>
                                                        <td style={{ width: '100px' }}>
                                                            C
                                                        </td> */}

                                                    </tr>

                                                </td>
                                            </tr>


                                        </table>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <br />
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example">
                        <Tab label="Forecast Requirement" {...a11yProps(0)} />
                        <Tab label="Stock" {...a11yProps(1)} disabled = {singleOrderItem?.status === "Active" || singleOrderItem?.status === "AD Forecast Pending" ||  singleOrderItem?.status === "Forecast Rejected"}/>
                        <Tab label="Order details" {...a11yProps(2)} disabled = {singleOrderItem?.status === "Active" || singleOrderItem?.status === "AD Forecast Pending" || singleOrderItem?.status === "Forecast Rejected"}/>
                        {/* <Tab label="Add Delivery Details" {...a11yProps(2)}/> */}
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <ForecastRequirement handleChangTab={handleChangTab} singleObj={item} />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction} dis>
                    <>
                        <StockTab itemId={item?.item_id} handleChangTab={handleChangTab}  fromDate={fromDate} />
                    </>
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <OrderDetails itemId={item?.item_id} />
                </TabPanel>
            </LoonsCard>
        </MainContainer >
    );
}
