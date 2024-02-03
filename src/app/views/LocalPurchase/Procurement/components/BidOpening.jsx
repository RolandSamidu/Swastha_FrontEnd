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
import CommitteAttendance from './CommitteeAttendance'
import MinuteAttendance from "./MinuteAttendance";

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ paddingBottom: 3 }}>
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

class BidOpening extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 0,
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
        this.setState({ value: newValue })
    }

    render() {
        return (
            <Grid container spacing={2} direction="row">
                {/* Filter Section */}
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    {/* Item Series Definition */}
                    <Grid container spacing={2}>
                        {/* Item Series heading */}
                        <Grid item lg={12} md={12} sm={12} xs={12} style={{ paddingTop: '8px' }}>
                            <Box sx={{ width: '100%', minHeight: '300px' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs
                                        value={this.state.value}
                                        onChange={this.handleChange}
                                        aria-label="basic tabs example"
                                        variant="fullWidth"
                                        style={{ borderCollapse: "collapse" }}
                                    >
                                        <Tab
                                            label="Bid Opening Committee Attendance"
                                            style={{ border: "1px solid rgb(229, 231, 235)" }}
                                            {...a11yProps(0)}
                                        />
                                        <Tab
                                            label="Bid Opening Minute"
                                            style={{ border: "1px solid rgb(229, 231, 235)" }}
                                            {...a11yProps(1)}
                                        />
                                    </Tabs>
                                </Box>
                                <TabPanel value={this.state.value} index={0}>
                                    <CommitteAttendance />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1}>
                                    <MinuteAttendance />
                                </TabPanel>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default BidOpening