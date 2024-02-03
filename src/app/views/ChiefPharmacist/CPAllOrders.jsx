import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {CardTitle, LoonsCard, MainContainer} from 'app/components/LoonsLabComponents';
import CPTab1 from './tabs/CPTab1';
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import localStorageService from "app/services/localStorageService";
import ApartmentIcon from '@material-ui/icons/Apartment';
import WarehouseServices from 'app/services/WarehouseServices';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {Dialog,Typography} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";

import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";


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



export default function CPAllOrders() {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [selectWarehouseView, setSelectWarehouseView] = React.useState(false);
    const [allWarehouses, setAllWarehouses] = React.useState([]);
    const [loaded, setLoaded] = React.useState(true)
    const [selectedWarehouse, setSelectedWarehouse] = React.useState();

    useEffect(() => {
        //loadWarehouses();
      },[selectedWarehouse]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    async function loadWarehouses() {
        setLoaded(false)
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        var all_pharmacy_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        if (!selected_warehouse_cache) {
            setSelectWarehouseView(true)
        } 
        else {  
            setSelectWarehouseView(false)
            setLoaded(true)
        }
        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params);
        if (res.status == 200) {
            console.log("CPALLOders", res.data.view.data)

            res.data.view.data.forEach(element => {
                all_pharmacy_dummy.push(
                    {
                        warehouse: element.Warehouse,
                        name: element.Warehouse.name,
                        main_or_personal:element.Warehouse.main_or_personal,
                        owner_id:element.Warehouse.owner_id,
                        id: element.warehouse_id,
                        pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
                    }

                )
            });
            console.log("warehouse", all_pharmacy_dummy)
            setAllWarehouses(all_pharmacy_dummy)
        }
    }


    return (<MainContainer>
        <LoonsCard>
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'10px'}}>
       {/*  <LoonsButton
                            color='primary'
                            onClick={() => {
                                setSelectWarehouseView(true)
                            }}>
                            <ApartmentIcon/>
                            Chanage Warehouse
                        </LoonsButton> */}
                </div>
                {loaded ? <><AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example">
                        <Tab label="Order Base" {...a11yProps(0)} />
                        {/* <Tab label="Item Order Base" {...a11yProps(1)} /> */}
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <CPTab1 />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>

                </TabPanel> </>: null}
            
            </LoonsCard>
           {/*  <Dialog
                                    fullWidth="fullWidth"
                                    maxWidth="sm"
                                    open={selectWarehouseView}>

                                    <MuiDialogTitle disableTypography="disableTypography">
                                        <CardTitle title="Select Your Warehouse"/> 
                                    </MuiDialogTitle>

                                    <div className="w-full h-full px-5 py-5">
                                        <ValidatorForm                                            
                                            onError={() => null} className="w-full">
                                            <Autocomplete
                                        disableClearable className="w-full"
                                                // ref={elmRef}
                                                options={allWarehouses} onChange={(e, value) => {
                                                    if (value != null) {                                                       
                                                        localStorageService.setItem('Selected_Warehouse', value);
                                                        setSelectWarehouseView(false)
                                                        loadWarehouses()
                                                        setLoaded(true)
                                                        setSelectedWarehouse(value)
                                                        
                                                    }
                                                }} value={{
                                                    name: selectedWarehouse
                                                        ? (
                                                            allWarehouses.filter((obj) => obj.id == selectedWarehouse).name
                                                        )
                                                        : null,
                                                    id: selectedWarehouse
                                                }} getOptionLabel={(option) => option.name != null ? option.name+" - "+ option.main_or_personal : null} renderInput={(params) => (
                                                    <TextValidator {...params} placeholder="Select Your Warehouse"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small"/>
                                                )}/>

                                        </ValidatorForm>
                                    </div>
                                </Dialog> */}
        </MainContainer>
    );
}