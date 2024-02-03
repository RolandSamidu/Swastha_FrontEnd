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

class CommitteeAttendance extends Component {
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

            loading: true,
            columns: [
                {
                    name: 'created_date', // field name in the row object
                    label: 'Created / Uploaded Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                    }
                },
                {
                    name: 'name', // field name in the row object
                    label: 'Document Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                    }
                },
                {
                    name: 'ref_no', // field name in the row object
                    label: 'Reference No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                    }
                },
                {
                    name: 'created_by', // field name in the row object
                    label: 'Uploaded / Created By', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                    }
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Document Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
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
                            // let id = this.state.data[dataIndex].id;
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
            ],
            data: [
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
            <ValidatorForm>
                <Grid container spacing={2} style={{ justifyContent: "center", display: "flex" }}>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <Grid container spacing={2} className="justify-center" style={{ marginTop: "12px" }}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <h3 style={{ textAlign: "center" }}>Bid Opening Committee Attendance</h3>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item lg={12} md={12} xs={12} sm={12} style={{ margin: "12px 0" }}>
                                        <SubTitle title='Upload Attendance' />
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
                        <Grid container spacing={2} className="w-full flex my-5">
                            <Grid item lg={6} md={6} sm={12} xs={12}>
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
                        </Grid>
                    </Grid>
                </Grid>
                <Divider />
                <br />
                <Grid container spacing={2} className="w-full flex my-5">
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <SubTitle title={"Procurement Officer - Procurement Unit"}></SubTitle>
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
                </Grid>
                <Grid container spacing={2} className="flex">
                    <Grid item className="w-full flex justify-end my-2">
                        <Button
                            className="mt-2"
                            progress={false}
                            type="submit"
                            scrollToTop={false}
                            startIcon="save"
                        >
                            <span className="capitalize">Save</span>
                        </Button>
                    </Grid>
                </Grid>
                <Divider />
                <Grid container spacing={2} className="justify-center" style={{ marginTop: "12px" }}>
                    <Grid
                        className=" w-full"
                        item
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                    >
                        {this.state.loading ?
                            <LoonsTable
                                //title={"All Aptitute Tests"}
                                id={'bidAttendanceDetails'}
                                // title={'Active Prescription'}
                                data={this.state.data}
                                columns={this.state.columns}
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: this.state.data.length,
                                    // count: 10,
                                    rowsPerPage: 10,
                                    page: 0,
                                    print: true,
                                    viewColumns: true,
                                    download: true,
                                    onTableChange: (action, tableState) => {
                                        console.log(action, tableState)
                                        switch (action) {
                                            case 'changePage':
                                                // this.setPage(tableState.page)
                                                break
                                            case 'sort':
                                                //this.sort(tableState.page, tableState.sortOrder);
                                                break
                                            default:
                                                console.log(
                                                    'action not handled.'
                                                )
                                        }
                                    },
                                }}
                            ></LoonsTable> :
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress size={30} />
                            </Grid>
                        }
                    </Grid>
                </Grid>
                {/* <Grid container spacing={2} style={{ justifyContent: "center" }}>
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
                </Grid> */}
                {/* <Grid container spacing={2} >
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
                </Grid> */}
                {/* <br />
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
                <br /> */}
            </ValidatorForm>
        )
    }
}

export default CommitteeAttendance