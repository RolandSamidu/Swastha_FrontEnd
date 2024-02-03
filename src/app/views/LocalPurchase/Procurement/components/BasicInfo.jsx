import React, { Component, Fragment } from "react";
import { CardTitle, LoonsCard, SubTitle } from "app/components/LoonsLabComponents";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";
import { LoonsTable, Button, DatePicker, SwasthaFilePicker } from "app/components/LoonsLabComponents";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { CircularProgress, Grid, Tooltip, IconButton, Checkbox, Chip, Typography, Radio, RadioGroup, FormControl, Divider } from "@material-ui/core";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import VisibilityIcon from '@material-ui/icons/Visibility';
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import RichTextEditor from 'react-rte';
import DownloadIcon from '@mui/icons-material/Download';
import { dateParse } from 'utils'
import { Autocomplete } from '@material-ui/lab'
import FileCopyIcon from '@mui/icons-material/FileCopy';

class BasicInfo extends Component {
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
                bidValue: null,
                from: null,
                bidPeriod: null,
                offerPeriod: null,
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

    render() {
        return (
            <MainContainer>

                <ValidatorForm>
                    <Grid container spacing={2} className="w-full flex my-5">
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title={"Supervisor Acknowledgment"}></SubTitle>
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
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title={"Procurement Officer"}></SubTitle>
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
                        {/* <Grid item lg={4} md={4} sm={12} xs={12}>
                        <SubTitle title={"Manager Imports"}></SubTitle>
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
                    </Grid> */}
                    </Grid>
                    <Divider />
                    <br />
                    <Grid container spacing={2}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Grid container spacing={2}>
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <SubTitle title='Bid Bond Value' />
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Bid Bond Value"
                                                name="value"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={String(this.state.formData.bidValue)}
                                                type="number"
                                                min={0}
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    this.setState({
                                                        formData: {
                                                            ...this
                                                                .state
                                                                .formData,
                                                            bidValue:
                                                                parseFloat(e.target
                                                                    .value),
                                                        },
                                                    })
                                                }}
                                                validators={
                                                    ['minNumber:' + 0, 'required:' + true]}
                                                errorMessages={[
                                                    'Bid Percentage Should be > 0',
                                                    'this field is required'
                                                ]}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <SubTitle title='From' />
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Estimated Value"
                                                name="value"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={String(this.state.formData.from)}
                                                type="number"
                                                min={0}
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    this.setState({
                                                        formData: {
                                                            ...this
                                                                .state
                                                                .formData,
                                                            from:
                                                                parseFloat(e.target
                                                                    .value),
                                                        },
                                                    })
                                                }}
                                                validators={
                                                    ['minNumber:' + 0, 'required:' + true]}
                                                errorMessages={[
                                                    'Estimated Value Should be > 0',
                                                    'this field is required'
                                                ]}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item lg={8} md={8} sm={8} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <SubTitle title='Bid Bond Validity Period' />
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <div style={{ display: "flex" }}>
                                                <div>
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Estimated Period"
                                                        name="period"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            String(this.state.formData
                                                                .bidPeriod)
                                                        }
                                                        type="number"
                                                        min={0}
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    bidPeriod:
                                                                        parseFloat(e.target
                                                                            .value, 10),
                                                                },
                                                            })
                                                        }}
                                                        validators={
                                                            ['minNumber:' + 0, 'required:' + true]}
                                                        errorMessages={[
                                                            'Bid Period Should be > 0',
                                                            'this field is required'
                                                        ]}
                                                    />
                                                </div>
                                                <div style={{ flex: 1, display: "flex", alignItems: "center", marginLeft: "12px" }}>
                                                    <SubTitle title='Month from Bid Submitting Dated Bond Validity Period' />
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item lg={8} md={8} sm={8} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <SubTitle title='Offer Validity Period' />
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <div style={{ display: "flex" }}>
                                                <div>
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Validity Period"
                                                        name="period"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            String(this.state.formData
                                                                .offerPeriod)
                                                        }
                                                        type="number"
                                                        min={0}
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    offerPeriod:
                                                                        parseFloat(e.target
                                                                            .value, 10),
                                                                },
                                                            })
                                                        }}
                                                        validators={
                                                            ['minNumber:' + 0, 'required:' + true]}
                                                        errorMessages={[
                                                            'Offer Period Should be > 0',
                                                            'this field is required'
                                                        ]}
                                                    />
                                                </div>
                                                <div style={{ flex: 1, display: "flex", alignItems: "center", marginLeft: "12px" }}>
                                                    <SubTitle title='Months from Bid Submitting Date' />
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item lg={12} md={12} xs={12} sm={12} style={{ margin: "12px 0" }}>
                                    <SubTitle title='Bidding Document' />
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <SwasthaFilePicker
                                        uploadingSectionVisibility={true}
                                        id="file_public"
                                        singleFileEnable={true}
                                        multipleFileEnable={false}
                                        dragAndDropEnable={true}
                                        tableEnable={true}

                                        documentName={true}//document name enable
                                        documentNameValidation={['required']}
                                        documenterrorMessages={['this field is required']}
                                        documentNameDefaultValue={null}//document name default value. if not value set null
                                        label="uploads"
                                        type={false}  //req
                                        types={null}
                                        typeValidation={null}
                                        typeErrorMessages={null}
                                        defaultType={null}// null

                                        description={true}
                                        descriptionValidation={null}
                                        descriptionErrorMessages={null}
                                        defaultDescription={null}//null

                                        onlyMeEnable={false}
                                        defaultOnlyMe={false}

                                        source="OrderList"
                                        // source_id={this.props.match.params.id}

                                        //accept="image/png"
                                        // maxFileSize={1048576}
                                        // maxTotalFileSize={1048576}
                                        maxFilesCount={1}
                                        validators={[
                                            'required',
                                            // 'maxSize',
                                            // 'maxTotalFileSize',
                                            // 'maxFileCount',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                            // 'file size too lage',
                                            // 'Total file size is too lage',
                                            // 'Too many files added',
                                        ]}
                                        /* selectedFileList={
                                            this.state.data.fileList
                                        } */
                                        // label="Select Attachment"
                                        singleFileButtonText="Upload Data"
                                    // multipleFileButtonText="Select Files"



                                    ></SwasthaFilePicker>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <br />
                    <Divider />
                    <Grid container spacing={2} className="justify-center">
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <h3 style={{ textAlign: "center" }}>Procurement Committee Approval</h3>
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
                            <div style={{ display: 'flex', justifyContent: "center" }}>
                                <div style={{ marginRight: "12px" }}>
                                    <SubTitle title="Suggested Procurement Method:" />
                                </div>
                                <div>
                                    <SubTitle title="ICB" />
                                </div>
                            </div>

                        </Grid>
                    </Grid>
                    <Grid container spacing={2} >
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Signed By:' />
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12} style={{ paddingLeft: "30px" }}>
                            <SubTitle title={"Chairman ✔"}></SubTitle>
                            <p>M.P.Kumar</p>
                            <h4>MySignature</h4>
                            <p> 21/05/2022</p>
                            <p> 08.30 AM</p>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12} style={{ paddingLeft: "30px" }}>
                            <SubTitle title={"Member 01 ✔"}></SubTitle>
                            <p>M.P.Kumar</p>
                            <h4>"MySignature</h4>
                            <p> 21/05/2022</p>
                            <p> 08.30 AM</p>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12} style={{ paddingLeft: "30px" }}>
                            <SubTitle title={"Member 02 ✔"}></SubTitle>
                            <p>M.P.Kumar</p>
                            <h4>MySignature</h4>
                            <p> 21/05/2022</p>
                            <p> 08.30 AM</p>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2} >
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Authorized By:' />
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12} style={{ paddingLeft: "30px" }}>
                            <p>K.L.P.Silva</p>
                            <h4>MySignature</h4>
                            <p> 21/05/2022</p>
                            <p> 08.30 AM</p>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12} style={{ paddingLeft: "30px", marginTop: "14px" }}>
                            <div style={{ display: "flex" }}>
                                <div style={{ paddingRight: "12px" }}>
                                    <SubTitle title='Procurement Unit Confirmation:' />
                                </div>
                                <div>
                                    <FileCopyIcon />
                                </div>
                            </div>
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
                            {/* <Button
                            className="mr-2 mt-7"
                            progress={false}
                            type="submit"
                            scrollToTop={false}
                            endIcon={<DownloadIcon />}
                        >
                            <span className="capitalize">Download</span>
                        </Button> */}
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
            </MainContainer>
        )
    }
}

export default BasicInfo