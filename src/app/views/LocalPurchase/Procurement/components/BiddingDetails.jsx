import React, { Component, Fragment } from "react";
import { CardTitle, LoonsCard, SubTitle } from "app/components/LoonsLabComponents";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";
import { LoonsTable, Button, DatePicker } from "app/components/LoonsLabComponents";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { CircularProgress, Grid, Tooltip, IconButton, Checkbox, Chip, Typography, Radio, RadioGroup, FormControl } from "@material-ui/core";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import VisibilityIcon from '@material-ui/icons/Visibility';
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import RichTextEditor from 'react-rte';
import DownloadIcon from '@mui/icons-material/Download';
import { dateParse } from 'utils'
import { Autocomplete } from '@material-ui/lab'

import AddIcon from '@mui/icons-material/Add';

class BiddingDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
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

            data: [
                {
                    reg_no: "45/P/P/784512",
                    bidder_name: "L. K. Perera",
                    bidder_contact: "0771155874",
                    manufacture_name: "L. K. Perera",
                    manufacture_contact: "0117845123",
                    local_name: "L. K. Perera",
                    local_contact: "0114784510",
                },
                {
                    reg_no: "45/P/P/784512",
                    bidder_name: "L. K. Perera",
                    bidder_contact: "0771155874",
                    manufacture_name: "L. K. Perera",
                    manufacture_contact: "0117845123",
                    local_name: "L. K. Perera",
                    local_contact: "0114784510",
                },
            ],

            columns: [
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            // let id = this.state.data_for_table1[dataIndex].id;
                            return (
                                <Grid className="flex items-center">
                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    // window.location.href = `/consignments/msdAd/view-consignment/${id}`
                                                }} >
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>

                                </Grid>
                            );
                        }
                    }
                },
                {
                    name: 'reg_no', // field name in the row object
                    label: 'Registration No', // column title that will be shown in table
                    options: {
                        display: true,
                    }
                },
                {
                    name: 'bidder_name', // field name in the row object
                    label: 'Bidder Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                    }
                },
                {
                    name: 'bidder_contact', // field name in the row object
                    label: 'Bidder No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                    }
                },
                {
                    name: 'manufacture_name', // field name in the row object
                    label: 'Manufacture', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                    }
                },
                {
                    name: 'manufacture_contact', // field name in the row object
                    label: 'Manufacture Contact', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                    }
                },
                {
                    name: 'local_name', // field name in the row object
                    label: 'Local Agent', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                    }
                },
                {
                    name: 'local_contact', // field name in the row object
                    label: 'Local Contact', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                    }
                },
                {
                    name: 'bidderActions', // field name in the row object
                    label: 'Bidder Details', // column title that will be shown in table
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            // let id = this.state.data_for_table1[dataIndex].id;
                            return (
                                <Grid className="flex items-center">
                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    // window.location.href = `/consignments/msdAd/view-consignment/${id}`
                                                }}>
                                                <AddIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>

                                </Grid>
                            );
                        }
                    }
                },
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

    render() {
        return (
            <Fragment>
                <ValidatorForm>
                    <div className="p-2" style={{
                        backgroundColor: "#D7B2B2",
                        display: 'flex',
                        alignItems: 'left',
                        borderRadius: "12px",
                        justifyContent: 'space-between',
                        marginTop: '15px'
                    }}>
                        <Typography variant="h6">SR Number: 1204578</Typography>
                        <Typography variant="h6">Item Name: Pentoxifylline 400g Modified Released Tablet</Typography>
                    </div>
                    {/* Table Section */}
                    <Grid container="container" className="mt-3 pb-5">
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            {
                                this.state.loading
                                    ? <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.data} columns={this.state.columns} options={{
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
                    <Grid Container="container" className="w-full my-5">
                        <CardTitle title="Bidding Details" />
                    </Grid>
                    <Grid container spacing={2} className="w-full flex my-5">
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title={"Supervisor Acknowledgement - Imports Unit"}></SubTitle>
                            <SubTitle title={"Note :"}></SubTitle>
                            <TextValidator
                                className='w-full'
                                placeholder="Note"
                                fullWidth
                                name="note1"
                                multiline
                                rows={4}
                                type="text"
                                variant="outlined"
                                size="small"
                                value={
                                    this.state
                                        .formData
                                        .note1
                                }
                                onChange={(e, value) => {
                                    let formData = this.state.formData;
                                    formData.note1 = e.target.value
                                    this.setState({ formData })

                                }}
                                validators={[
                                    'required',
                                ]}
                                errorMessages={[
                                    'this field is required',
                                ]}
                            />
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} className="w-full">
                            <Grid container spacing={2}>
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className="w-full flex justify-end"
                                >
                                    <Button
                                        className="mr-2"
                                        progress={false}
                                        // type="submit"
                                        scrollToTop={false}
                                    // endIcon="save"
                                    >
                                        <span className="capitalize">Return for Correction</span>
                                    </Button>
                                    <Button
                                        className="ml-2"
                                        progress={false}
                                        // type="submit"
                                        scrollToTop={false}
                                    >
                                        <span className="capitalize">Forward</span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} className="w-full my-5">
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title={"Procurement Officer Acknowledgement - Imports Unit"}></SubTitle>
                            <SubTitle title={"Note :"}></SubTitle>
                            <TextValidator
                                className='w-full'
                                placeholder="Note"
                                fullWidth
                                name="note1"
                                multiline
                                rows={4}
                                type="text"
                                variant="outlined"
                                size="small"
                                value={
                                    this.state
                                        .formData
                                        .note1
                                }
                                onChange={(e, value) => {
                                    let formData = this.state.formData;
                                    formData.note1 = e.target.value
                                    this.setState({ formData })
                                }}
                                validators={[
                                    'required',
                                ]}
                                errorMessages={[
                                    'this field is required',
                                ]}
                            />
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} className="w-full">
                            <Grid container spacing={2}>
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className="w-full flex justify-end"
                                >
                                    <Button
                                        className="mr-2"
                                        progress={false}
                                        // type="submit"
                                        scrollToTop={false}
                                    // endIcon="save"
                                    >
                                        <span className="capitalize">Return for Correction</span>
                                    </Button>
                                    <Button
                                        className="ml-2"
                                        progress={false}
                                        // type="submit"
                                        scrollToTop={false}
                                    >
                                        <span className="capitalize">Forward</span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} className="w-full flex my-5">
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title={"Manager Imports Acknowledgement - Imports Unit"}></SubTitle>
                            <SubTitle title={"Note :"}></SubTitle>
                            <TextValidator
                                className='w-full'
                                placeholder="Note"
                                fullWidth
                                name="note1"
                                multiline
                                rows={4}
                                type="text"
                                variant="outlined"
                                size="small"
                                value={
                                    this.state
                                        .formData
                                        .note1
                                }
                                onChange={(e, value) => {
                                    let formData = this.state.formData;
                                    formData.note1 = e.target.value
                                    this.setState({ formData })
                                }}
                                validators={[
                                    'required',
                                ]}
                                errorMessages={[
                                    'this field is required',
                                ]}
                            />
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} className="w-full">
                            <Grid container spacing={2}>
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className="w-full flex justify-end"
                                >
                                    <Button
                                        className="mr-2"
                                        progress={false}
                                        // type="submit"
                                        scrollToTop={false}
                                    // endIcon="save"
                                    >
                                        <span className="capitalize">Return for Correction</span>
                                    </Button>
                                    <Button
                                        className="ml-2"
                                        progress={false}
                                        // type="submit"
                                        scrollToTop={false}
                                    >
                                        <span className="capitalize">Forward</span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <hr />
                    <Grid container="container" className="mt-3 pb-5">
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            {
                                this.state.loading
                                    ? <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'} data={this.state.data_for_table1} columns={this.state.columns_for_table1} options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.data_for_table1.length,
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
                    <br />
                    <Grid container spacing={2} className="justify-center">
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <h3 style={{ textAlign: "center" }}>Procurement Committee Approval</h3>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <table style={{ borderCollapse: "collapse" }}>
                                    <tr className="p-2">
                                        <th colspan="2" className="p-2" style={{ border: "1px solid black", padding: "5px" }}>NATURE OF THE PROCUREMENT COMMITTEE : DPC MINOR PHARMACEUTICAL </th>
                                        <th colspan="2" className="p-2" style={{ border: "1px solid black", padding: "5px" }}>NAME OF THE PROCUREMENT ENTITY : STATE PHARMACEUTICAL CORPORATION</th>
                                    </tr>
                                    <tr className="p-2">
                                        <td style={{ border: "1px solid black", padding: "5px" }}> MEETING NO: 20</td>
                                        <td style={{ border: "1px solid black", padding: "5px" }}> DATE : 21/05/2022</td>
                                        <td style={{ border: "1px solid black", padding: "5px" }}> TIME : 08.30 AM</td>
                                        <td style={{ border: "1px solid black", padding: "5px" }}> PURPOSE</td>
                                    </tr>
                                    <tr className="p-2">
                                        <td colspan="4" style={{ border: "1px solid black", padding: "5px" }}>TITLE OF PROCUREMENT :</td>
                                    </tr>
                                    <tr className="p-2">
                                        <td colSpan="2" style={{ border: "1px solid black", padding: "5px" }}>ORDER LIST NO :</td>
                                        <td colspan="2" style={{ border: "1px solid black", padding: "5px" }}>SR NO : 0012201-31</td>
                                    </tr>
                                </table>
                            </div>
                        </Grid>
                        <Grid item lg={10} md={10} sm={12} xs={12}>
                            <RichTextEditor
                                style={{
                                    rows: 10,
                                    minHeight: '150px',
                                    marginBottom: 2
                                }}
                                value={this.state.value}
                                onChange={this.onChange}
                            />
                            {/* <MUIRichTextEditor  /> */}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{ justifyContent: "center" }}>
                        <Grid
                            className=" w-full"
                            item
                            lg={8}
                            md={8}
                            sm={8}
                            xs={12}
                        >
                            <SubTitle title="Suggested Procurement Method" />
                            <Autocomplete
                                className="w-full"
                                options={this.state.ward}
                                onChange={(e, value) => {
                                    if (null != value) {
                                        let formData =
                                            this.state.formData
                                        formData.ward_id =
                                            e.target.value
                                        this.setState({
                                            formData,
                                        })
                                    }
                                }}
                                value={this.state.ward.find((ward) => ward.id == this.state.formData.ward_id)}
                                getOptionLabel={(option) =>
                                    option.label
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Please choose"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={
                                            this.state.formData
                                                .ward_id
                                        }
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{ justifyContent: "center" }}>
                        <Grid
                            className=" w-full"
                            item
                            lg={8}
                            md={8}
                            sm={8}
                            xs={12}
                        >
                            <FormGroup>
                                <FormControlLabel control={<Checkbox defaultChecked />} label="Separate Procurement Numbers for Each Item/SR Number" />
                            </FormGroup>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{ justifyContent: "center" }}>
                        <Grid
                            className=" w-full"
                            item
                            lg={8}
                            md={8}
                            sm={8}
                            xs={12}
                        >
                            <SubTitle title="Procurement Committe Decision" />
                            <Autocomplete
                                className="w-full"
                                options={this.state.ward}
                                onChange={(e, value) => {
                                    if (null != value) {
                                        let formData =
                                            this.state.formData
                                        formData.ward_id =
                                            e.target.value
                                        this.setState({
                                            formData,
                                        })
                                    }
                                }}
                                value={this.state.ward.find((ward) => ward.id == this.state.formData.ward_id)}
                                getOptionLabel={(option) =>
                                    option.label
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Please choose"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={
                                            this.state.formData
                                                .ward_id
                                        }
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2} className="flex">
                        <Grid item className="w-full flex justify-end my-12">
                            <Button
                                className="mr-2 mt-7"
                                progress={false}
                                type="submit"
                                scrollToTop={false}
                                endIcon="save"
                            >
                                <span className="capitalize">Save</span>
                            </Button>
                            <Button
                                className="mr-2 mt-7"
                                progress={false}
                                type="submit"
                                scrollToTop={false}
                                endIcon={<DownloadIcon />}
                            >
                                <span className="capitalize">Download</span>
                            </Button>
                        </Grid>

                        {/* <Grid container spacing={2} className="space-between">
                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                    <SubTitle title={"Upload Authorized Document"}></SubTitle>
                                </Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <input type="file" />
                                </Grid>
                            </Grid> */}
                    </Grid>
                </ValidatorForm>
            </Fragment>
        )
    }
}

export default BiddingDetails