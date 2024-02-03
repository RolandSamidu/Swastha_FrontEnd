import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { CardTitle, LoonsCard, MainContainer, LoonsTable } from 'app/components/LoonsLabComponents';
import {
    Radio,
    RadioGroup,
    FormLabel,
    FormControl,
    FormControlLabel,
    Divider,
    Grid,
    IconButton,
    Icon,
} from '@material-ui/core';
import AllocatedItems from './tabs/allocatedItems';
import DroppedItems from './tabs/droppedItems';
import AllItemsDistribution from './tabs/allItems';
import { useEffect, useState } from 'react';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import ClinicService from 'app/services/ClinicService';
import ChiefPharmacistServices from 'app/services/ChiefPharmacistServices';

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

export default function FullWidthTabs(props) {



    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [radio, setRadio] = React.useState("hidden")
    const [pharmacy, setPharmacy] = useState(0);

    const [splitData, setSplitData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    const splitOrderColumns = [
        {
        name: 'name',
        label: 'Drug Store',
        options: {
            display: true,
            customBodyRender: (value, tableMeta, updateValue) => {
            // console.log('ssssssssssssssssssssssssssssssssss', splitData[tableMeta.columnIndex].toStore?.name)
            return splitData[tableMeta.rowIndex].toStore?.name;
            }
        }
        },
        {
        name: 'order_id',
        label: 'Order ID',
        options: {
            display: true,
            // customBodyRender: (value, tableMeta, updateValue) => {
            //     // console.log('data', tableMeta);
            //     return (tableMeta.rowData[tableMeta.columnIndex].reg_no)
            // }
        }
        },
        {
        name: 'status',
        label: 'Status',
        options: {
            display: true,
            // customBodyRender: (value, tableMeta, updateValue) => {
            //     // console.log('data', tableMeta);
            //     return (tableMeta.rowData[tableMeta.columnIndex].max_volume)
            // }
        }
        },
        {
        name: 'number_of_items',
        label: 'Number Of Items',
            options: {
                display: true,
                // customBodyRender: (value, tableMeta, updateValue) => {
                //     // console.log('data', tableMeta);
                //     return (tableMeta.rowData[tableMeta.columnIndex].status)
                // }
            }
        },
        {
            name: 'action',
            label: 'Action',
            options: {
                // filter: true,
                display: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (<> < IconButton className = "text-black" onClick = {
                        null
                    } >  </IconButton>
                            <IconButton
                                className="text-black"
                                onClick={() => window.location = `/distribution/order/${splitData[tableMeta.rowIndex]
                            ?.id
                    }/${
                        splitData[tableMeta.rowIndex]
                            ?.number_of_items
                    }/${
                        splitData[tableMeta.rowIndex]
                            ?.order_id
                    }/${
                        splitData[tableMeta.rowIndex]
                            ?.Employee
                            ?.name
                    }/${
                        splitData[tableMeta.rowIndex]
                            ?.status
                    }/${
                        splitData[tableMeta.rowIndex]
                            ?.type
                    }
                    `}>
                                <Icon color="primary">visibility</Icon>
                            </IconButton>
                        </>
                            )}
                }
            }
        
    ];

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

        const [data, setData] = useState({});
        

        console.log(props);

        const loadData = async () => {
            
            let res = await PharmacyOrderService.getOrdersByID(props.match.params.id)
            if (res.status) {
                // console.log("Order Data Order Data", res.data)
                setData(res.data.view)
                //getPharmacyDet()
                
                console.log("Order exchange data", res.data.view)
            }
        };


    const getPharmacyDet = async () => {

        let params = { 
            issuance_type: ["Hospital", "RMSD Main"], 
            limit: 1, 
            page: 0,
            'order[0]': ['createdAt', 'ASC'],
            // owner_id:data?.from_owner_id
            owner_id:data?.from_owner_id
        }
        console.log("from ownrerId",data)
        let res = await ClinicService.fetchAllClinicsNew(params,data.from_owner_id);

        if (res.status == 200) {
            console.log('okghghghghggh---------------------------------------------------->>>', res.data.view.data)
            setPharmacy(res.data.view.data)
        }
    }
    const getSplitOrder = async () => {

        let params ={
            splited_from: props.match.params.id,
            page: 0,
            limit: 10,
        }
        let res = await ChiefPharmacistServices.getAllOrders(params);
        // console.log('splitdata', res)
    
        if (res.status === 200) {
          console.log('splitdata', res.data.view.data);
          setSplitData(res.data.view.data);
          setTotalItems(res.data.view.totalItems);
        }
      };
    
      const setPage = async (page) => {
        //Change paginations
        let split_data = this.state.split_data;
        split_data.page = page;
        this.setState({ split_data }, async () => {
          await getSplitOrder();
        });
      };


    useEffect(() => {

        loadData()
        // getPharmacyDet()
        getSplitOrder()

    }, [])
    useEffect(() => {

        getPharmacyDet()

    }, [data])


    return (

        <MainContainer>
            <LoonsCard>
                <Grid container="container" lg={12} md={12}>
                    <Grid item="item" lg={7} md={7} xs={7}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'column'
                            }}>
                            <div className='col'>
                                <div className='flex'>
                                    <Typography variant="h6" className="font-semibold" >Individual Order</Typography>
                                    <Typography variant="h6" className="font-semibold" style={{ color:data?.special_normal_type == "SUPPLEMENTARY" ? "red" : "green" }}> ({data?.special_normal_type})</Typography> 
                                    <Typography variant="h6" className="font-semibold" > - {data?.approval_status}</Typography>

                                </div>
                            </div>
                            <div>
                                <Typography variant="h5" className="font-semibold">Order ID : {props.match.params.order}</Typography>
                            </div>
                            <div>
                                <Typography variant="h6" className="font-semibold">No of Items: {props.match.params.items}</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item="item" lg={5} md={5} xs={5}>
                        <Grid container="container"  direction='column' >
                            {/* <Grid item="item" lg={6} md={6} xs={6}>Counter Pharmacist ID</Grid>
                            <Grid item="item" lg={6} md={6} xs={6}>00002</Grid> */}
                            <Grid item="item">
                                <table className='w-full mt-3'>
                                    <tr>
                                        <td style={{width:'40%', fontWeight:'bold'}}>Requested Offecer</td>
                                        <td style={{width:'60%'}}>: {props.match.params.empname}</td>
                                    </tr>
                                    <tr>
                                        <td style={{width:'40%', fontWeight:'bold'}}>Requested Store</td>
                                        <td style={{width:'60%'}}>: {data?.fromStore?.name}</td>
                                    </tr>
                                    <tr>
                                        <td style={{width:'40%', fontWeight:'bold'}}>Requested Institute</td>
                                        <td style={{width:'60%'}}>: {pharmacy?.[0]?.name == undefined ? data?.fromStore?.name :  pharmacy?.[0]?.name + ' (' + pharmacy?.[0]?.Department?.name + ')'}</td>  
                                        {/* pharmacy?.[0]?.name == undefined ? data :    pharmacy?.[0]?.name + ' (' + pharmacy?.[0]?.Department?.name + ')' */}
                                    </tr>
                                </table>
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
                        <Tab label="All Items" {...a11yProps(0)} />
                        <Tab label="Allocated Items" {...a11yProps(1)} />
                        <Tab label="Dropped Items" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <AllItemsDistribution id={props} />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <AllocatedItems id={props} />
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <DroppedItems id={props} />
                </TabPanel>
            </LoonsCard>


            <Grid container className='w-full mt-5'>
            <Grid item xs={12} style={{ border: '3px solid #6495ED', backgroundColor: 'rgba(64, 224, 208, 0.3)', borderRadius: '5px' }}>
                <div className='p-3 m-3 mb-0'>
                <p className='m-0 p-0' style={{ fontWeight: 'bold' }}>Splitted Orders</p>
                <hr style={{ borderColor: '#6495ED', width: '100%', borderWidth: '1px', borderStyle: 'solid' }}></hr>
                <div className='mt-3'>
                    <LoonsTable
                    id={'split_order'}
                    data={splitData}
                    columns={splitOrderColumns}
                    options={{
                        pagination: true,
                        serverSide: true,
                        print: false,
                        viewColumns: false,
                        download: false,
                        onTableChange: (action, tableState) => {
                        console.log(action, tableState);
                        switch (action) {
                            case 'changePage':
                            setPage(tableState.page);
                            break;
                            case 'sort':
                            // this.sort(tableState.page, tableState.sortOrder);
                            break;
                            default:
                            console.log('action not handled.');
                        }
                        },
                    }}
                    ></LoonsTable>
                </div>
                </div>
            </Grid>
        </Grid>
        </MainContainer>
    );
}