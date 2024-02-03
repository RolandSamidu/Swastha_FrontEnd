import React, { Component, Fragment } from "react";
import { CardTitle, LoonsCard, SubTitle } from "app/components/LoonsLabComponents";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";
import { LoonsTable, Button, DatePicker } from "app/components/LoonsLabComponents";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { CircularProgress, Grid, Tooltip, IconButton, Checkbox, Chip, Typography, Radio, RadioGroup, FormControl, Box, Tabs, Tab } from "@material-ui/core";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import VisibilityIcon from '@material-ui/icons/Visibility';
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import RichTextEditor from 'react-rte';
import DownloadIcon from '@mui/icons-material/Download';
import { dateParse } from 'utils'
import { Autocomplete } from '@material-ui/lab'

import BidOpening from "./components/BidOpening";
import BiddingDetails from "./components/BiddingDetails";
import Suppliers from "./components/Suppliers";
import BasicInfo from "./components/BasicInfo"
import TECReport from "./components/TECReport";
import ProcurementUnit from "./components/ProcurementUnit";

function TabPanel(props) {
    const { children, value, style, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={style}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

class SingleProcurement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabValue: 0,
            value: RichTextEditor.createEmptyValue(),
            loading: true,
            formData: {
                note1: '',
                note2: '',
                note3: '',
                selected: "yes",
                ward_id: null,
            },

            ward: [
                { id: 1, label: "W101" },
                { id: 2, label: "W102" },
                { id: 3, label: "W103" },
                { id: 4, label: "W104" },
                { id: 5, label: "W105" },
            ],

            columns_for_table1: [
                {
                    name: 'created_date', // field name in the row object
                    label: 'Created / Uploaded Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     return (
                        //         <>
                        //             <div>
                        //                 <TextValidator
                        //                     className=" w-full"

                        //                     name="sr"

                        //                     InputLabelProps={{ shrink: false }}
                        //                     value={this.state.data_for_table1[dataIndex].sr}
                        //                     type="text"
                        //                     variant="outlined"
                        //                     size="small"
                        //                     onChange={(e) => {
                        //                         let data = this.state.data_for_table1;
                        //                         data[dataIndex].sr = e.target.value;
                        //                         this.setState({
                        //                             data
                        //                         })

                        //                     }}
                        //                 />
                        //             </div>
                        //         </>
                        //     )
                        // },
                    }
                },
                {
                    name: 'name', // field name in the row object
                    label: 'Document Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     return (
                        //         <>
                        //             <div>
                        //                 <TextValidator
                        //                     className=" w-full"

                        //                     name="item_name"

                        //                     InputLabelProps={{ shrink: false }}
                        //                     value={this.state.data_for_table1[dataIndex].item_name}
                        //                     type="text"
                        //                     variant="outlined"
                        //                     size="small"
                        //                     onChange={(e) => {
                        //                         let data = this.state.data_for_table1;
                        //                         data[dataIndex].item_name = e.target.value;
                        //                         this.setState({
                        //                             data
                        //                         })

                        //                     }}
                        //                 />
                        //             </div>
                        //         </>
                        //     )
                        // },
                    }
                },
                {
                    name: 'ref_no', // field name in the row object
                    label: 'Reference No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     return (
                        //         <>
                        //             <div>
                        //                 <TextValidator
                        //                     className=" w-full"

                        //                     name="priority_level"

                        //                     InputLabelProps={{ shrink: false }}
                        //                     value={this.state.data_for_table1[dataIndex].priority_level}
                        //                     type="text"
                        //                     variant="outlined"
                        //                     size="small"
                        //                     onChange={(e) => {
                        //                         let data = this.state.data_for_table1;
                        //                         data[dataIndex].priority_level = e.target.value;
                        //                         this.setState({
                        //                             data
                        //                         })

                        //                     }}
                        //                 />
                        //             </div>
                        //         </>
                        //     )
                        // },
                    }
                },
                {
                    name: 'created_by', // field name in the row object
                    label: 'Uploaded / Created By', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     return (
                        //         <>
                        //             <div>
                        //                 <TextValidator
                        //                     className=" w-full"

                        //                     name="qty"

                        //                     InputLabelProps={{ shrink: false }}
                        //                     value={this.state.data_for_table1[dataIndex].qty}
                        //                     type="number"
                        //                     variant="outlined"
                        //                     size="small"
                        //                     onChange={(e) => {
                        //                         let data = this.state.data_for_table1;
                        //                         data[dataIndex].qty = e.target.value;
                        //                         this.setState({
                        //                             data
                        //                         })

                        //                     }}
                        //                 />
                        //             </div>
                        //         </>
                        //     )
                        // },
                    }
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Document Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     return (
                        //         <>
                        //             <div>
                        //                 <TextValidator
                        //                     className=" w-full"
                        //                     name="estimated_item_price"
                        //                     InputLabelProps={{ shrink: false }}
                        //                     value={this.state.data_for_table1[dataIndex].estimated_item_price}
                        //                     type="number"
                        //                     variant="outlined"
                        //                     size="small"
                        //                     onChange={(e) => {
                        //                         let data = this.state.data_for_table1;
                        //                         data[dataIndex].estimated_item_price = e.target.value;
                        //                         this.setState({
                        //                             data
                        //                         })
                        //                     }}
                        //                 />
                        //             </div>
                        //         </>
                        //     )
                        // },
                    }
                },
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        sort: false,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data_for_table1[dataIndex].id;
                            return (
                                <Grid className="flex items-center">

                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                /* onClick={() => {
                                                    window.location.href = `/consignments/msdAd/view-consignment/${id}`
                                                }} */>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>

                                </Grid>
                            );
                        }
                    }
                },
            ],
            data_for_table1: [
                { created_date: dateParse(new Date()), name: 'Procurement Committee Approval', ref_no: '1205512', created_by: 'L. K. Perera', status: 'Completed' },
                { created_date: dateParse(new Date()), name: 'Procurement Committee Approval', ref_no: '1205512', created_by: 'L. K. Perera', status: 'Completed' },
                { created_date: dateParse(new Date()), name: 'Procurement Committee Approval', ref_no: '1205512', created_by: 'L. K. Perera', status: 'Completed' },
            ],

            data: [
                {
                    sr_no: "S1001",
                    item_name: "Panadol",
                    required_date: dateParse(new Date()),
                    requested_quantity: "100",
                    estimated_value: "120"
                },
                {
                    sr_no: "S1002",
                    item_name: "Panadol",
                    required_date: dateParse(new Date()),
                    requested_quantity: "100",
                    estimated_value: "150"
                },
                {
                    sr_no: "S1003",
                    item_name: "Panadol",
                    required_date: dateParse(new Date()),
                    requested_quantity: "100",
                    estimated_value: "180"
                },
                {
                    sr_no: "S1004",
                    item_name: "Panadol",
                    required_date: dateParse(new Date()),
                    requested_quantity: "100",
                    estimated_value: "200"
                }
            ],
            columns: [
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'required_date',
                    label: 'Required Date',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'requested_quantity',
                    label: 'Requested Quantity',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'estimated_value',
                    label: 'Estimated Value',
                    options: {
                        // filter: true,
                    },
                },
            ],

        }
    }

    onChange = (value) => {
        this.setState({ value });
        if (this.props.onChange) {
            // Send the changes up to the parent component as an HTML string.
            // This is here to demonstrate using `.toString()` but in a real app it
            // would be better to avoid generating a string on each change.
            this.props.onChange(
                value.toString('html')
            );
        }
    };

    handleChange = (event, newValue) => {
        this.setState({ tabValue: newValue })
    }

    render() {
        return (
            <MainContainer>
                <LoonsCard>
                    <ValidatorForm>
                        <div style={{
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'space-between',
                            marginTop: '15px'
                        }}>
                            <CardTitle title={"Procurement Ref No: DHS/P/ICB18/02"} />
                            <div>
                                <Grid item lg={12} md={4} sm={6} xs={12}>
                                    <label style={{ marginTop: '30px' }}>Order List No: 2022/SPC/X/R/P/00306</label>
                                </Grid>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'left',
                                    justifyContent: 'space-between',
                                }}>
                                    <Grid item lg={12} md={4} sm={6} xs={12} style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", alignItems: "center" }}>
                                        <label >Authority Level:</label>
                                        <Chip label="DPC-Minor" style={{ background: "#B90481", width: "fit-content" }} />
                                    </Grid>
                                </div>
                            </div>
                        </div>
                        {/* Table Section */}
                        <Grid container="container" className="mt-3 pb-5">
                            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                {
                                    this.state.loading
                                        ? <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'} data={this.state.data} columns={this.state.columns} options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.data.length,
                                                rowsPerPage: 10,
                                                page: this.state.page,
                                                onTableChange: (action, tableState) => {
                                                    console.log(action, tableState)
                                                    switch (action) {
                                                        case 'changePage':
                                                            // this.setPage(     tableState.page )
                                                            break
                                                        case 'sort':
                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                            break
                                                        default:
                                                            console.log('action not handled.')
                                                    }
                                                }
                                            }}></LoonsTable>
                                        : (
                                            //loading effect
                                            <Grid className="justify-center text-center w-full pt-12">
                                                <CircularProgress size={30} />
                                            </Grid>
                                        )
                                }
                            </Grid>
                        </Grid>
                        <Box sx={{ width: '100%', minHeight: '300px', marginTop: "12px", marginBottom: "12px" }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={this.state.tabValue}
                                    onChange={this.handleChange}
                                    aria-label="basic tabs example"
                                    variant="fullWidth"
                                >
                                    <Tab
                                        label="Basic Info"
                                        {...a11yProps(0)}
                                    />
                                    <Tab
                                        label="Suppliers"
                                        {...a11yProps(1)}
                                    />
                                    <Tab
                                        label="Bid Opening"
                                        {...a11yProps(2)}
                                    />
                                    <Tab
                                        label="Bidding Details"
                                        {...a11yProps(3)}
                                    />
                                    <Tab
                                        label="TEC Report"
                                        {...a11yProps(4)}
                                    />
                                    <Tab
                                        label="Procurement Unit"
                                        {...a11yProps(5)}
                                    />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabValue} index={0} style={{ p: 3 }}>
                                <BasicInfo />
                            </TabPanel>
                            <TabPanel value={this.state.tabValue} index={1} style={{ p: 3 }}>
                                <Suppliers />
                            </TabPanel>
                            <TabPanel value={this.state.tabValue} index={2}>
                                <BidOpening />
                            </TabPanel>
                            <TabPanel value={this.state.tabValue} index={3} style={{ p: 3 }}>
                                <BiddingDetails />
                            </TabPanel>
                            <TabPanel value={this.state.tabValue} index={4} style={{ p: 3 }}>
                                <TECReport />
                            </TabPanel>
                            <TabPanel value={this.state.tabValue} index={5} style={{ p: 3 }}>
                                <ProcurementUnit />
                            </TabPanel>
                        </Box>
                        {/* <Grid container spacing={2} className="space-between">
                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                    <SubTitle title={"Upload Authorized Document"}></SubTitle>
                                </Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <input type="file" />
                                </Grid>
                            </Grid> */}
                    </ValidatorForm>
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default SingleProcurement