import React, { Component, Fragment } from 'react'
import {
    Stepper,
    Step,
    StepLabel,
    StepButton,
    Grid,
    ButtonGroup,
    IconButton,
    Icon,
    Typography
} from '@material-ui/core'

import { useHistory } from "react-router-dom";

import {
    MainContainer,
    LoonsCard,
    SubTitle,
    LoonsTable,
    Button,
    LoonsSnackbar,
    SwasthaFilePicker
} from "app/components/LoonsLabComponents";
import moment from "moment";
import SampleRejectReport from "../Consignments/Print/sampleRejectReport";

import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";

import ConsignmentService from "app/services/ConsignmentService";
import localStorageService from 'app/services/localStorageService';
import { convertTocommaSeparated, dateParse } from 'utils';
import * as appConst from '../../../appconst'
export default class ApproveSample extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: null,
            divContent: "",
            activeStep: 2,

            loaded: false,
            data: [],
            columns: [
                {
                    name: 'ref_no',
                    label: 'Sample Ref Number',
                    options: {
                        //filter: true,
                        display: true,
                    },
                },
                {
                    name: 'sr_no',
                    label: 'SR No/ Name',
                    options: {
                        //filter: true,
                        display: true,
                    },
                },
                {
                    name: 'sr_name',
                    label: 'SR Name',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                /* {
                    name: 'manufacture',
                    label: 'Manufacture/Supplier',
                    options: {
                        filter: true,
                        display: true,
                    },
                }, */
                {
                    name: 'invoice_qty',
                    label: 'Invoice Item Quantitiy',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'invoice_batch_qty',
                    label: 'Invoice Batch Quantitiy',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'batch_no',
                    label: 'Batch Number',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'exd',
                    label: 'Date of EXP',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'mfd',
                    label: 'Date of Manufacture',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'shelf',
                    label: 'Shelf Life',
                    options: {
                        filter: true,
                        display: true,
                    },
                }
            ],

            consignmentItems: {},
            criteriaList: [],
            batchId: null,

            formData: {
                sample_id: this.props.match.params.id,
                comment: "",
                comment_type: "SCO",
                change_status_by: "",
                change_status: "",
                sco_decision: null,
                checking_details: []
            },
            item_id: '',

            filterDataForSCO: { sample_id: this.props.match.params.id, type: ["SCO"] },

            validatedListOfSCO: [],
            other_data: {},
            submitting: false,

        }
        this.componentRef = React.createRef();


    }


    // handlePrintClick = () => {
    //     let data = {}
    //     data.wdnNumber = 
    //     this.setState({

    //     })
    //     console.log(this.state.formData.comment_type)

    //     const divContent = this.componentRef.current.innerHTML;
    //     this.setState({ divContent });
    // };


    async componentDidMount() {
        console.log(this.props.match.params.id);
        var user = await localStorageService.getItem('userInfo');

        let formData = this.state.formData;
        formData.change_status_by = user.id;
        this.setState({ sco: user.name })
        this.setState({ formData })
        this.loadData(this.props.match.params.id);

    }

    cuttentDate() {
        let newDate = new Date();
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        this.setState({
            toDate: date,
            toMonth: month,
            toYear: year
        })
    }

    async loadData(id) {
        this.setState({ loaded: false })
        let consignment_res = await ConsignmentService.getConsignmentSampleByIdByURL(id);
        console.log("consingment res", consignment_res.data);
        if (consignment_res.status == 200 && consignment_res.data.view !== null) {

            let formData = this.state.formData
            formData.comment = consignment_res.data.view.sco_comment
            formData.sco_decision = consignment_res.data.view.sco_decision

            this.setState({
                consignmentItems: consignment_res.data.view.item.Consignment,
                batchId: consignment_res.data.view.batch_id,
                data: [{
                    "ref_no": consignment_res.data.view.ref_no,
                    "sr_no": consignment_res.data.view.item.item_schedule.Order_item.item.sr_no,
                    "sr_name": consignment_res.data.view.item.item_schedule.Order_item.item.short_description,
                    //"manufacture": consignment_res.data.view.batch.batch_no,
                    "invoice_batch_qty": convertTocommaSeparated(consignment_res?.data?.view?.batch?.quantity, 2),
                    "invoice_qty": convertTocommaSeparated(consignment_res?.data?.view?.item?.quantity, 2),
                   
                    "batch_no": consignment_res.data.view.batch.batch_no,
                    "exd": dateParse(consignment_res.data.view.batch.exd),
                    "mfd": dateParse(consignment_res.data.view.batch.mfd),
                    "shelf": "shelf lif"
                }],
                formData: formData,
                item_id: consignment_res?.data?.view?.item_id,
                loaded: true,
            }, () => {
                this.loadCriterias();
                this.cuttentDate();
            })

            // this.setState({
            //     item_id: consignment_res.data.view.item.item_schedule.Order_item.item.id
            // })
        }

    }

    async validatedSampleBySCO() {
        let res = await ConsignmentService.getValidatedSamples(this.state.filterDataForSCO); // should remove thiss id
        if (res.status == 200) {
            this.setState({
                validatedListOfSCO: res.data.view.data
            }, () => {
                this.fillAlradyAnswers()
            })
        }
    }

    async loadCriterias() {
        console.log(this.state.item_id)
        let user_role = await localStorageService.getItem('userInfo').roles[0]
        let criteria_res = await ConsignmentService.getCheckingCriterias({ item_id: this.state.item_id, role: user_role });
        if (criteria_res.status == 200 && criteria_res.data.view !== null) {
            this.setState({
                criteriaList: criteria_res.data.view.data
            }, () => {
                this.validatedSampleBySCO()
            })
        }
    }


    async fillAlradyAnswers() {

        this.state.validatedListOfSCO.forEach(element => {
            let formData = this.state.formData;
            let temp = this.state.formData.checking_details.filter(criteria => criteria.checking_criteria_id != element.checking_criteria_id);
            let checking_details = formData.checking_details

            checking_details.push(
                { "checking_criteria_id": element.checking_criteria_id, "answer": element.answer }
            )

            formData.checking_details = checking_details
            this.setState({
                formData: formData
            })


        });


    }

    async sampleValidatingBySCO(status) {
        let formData = this.state.formData;
        formData.change_status = status;
        this.setState({ submitting: true })

        let res = await ConsignmentService.consignmentSampleValidating(formData);
        if (res.status == 201) {
            this.setState({
                alert: true,
                severity: 'success',
                message: 'Validation Successfull',
                submitting: false,
            }, () => {
                //window.location.reload()
                window.location = `/consignments/sample-summary`

            })
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: 'Validation Unsuccessfull',
                submitting: false,
            })
        }
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <Stepper nonLinear activeStep={this.state.activeStep} alternativeLabel>
                            <Step key={0}>
                                <StepButton
                                    onClick={() => { this.setState({ activeStep: 0 }) }}

                                >
                                    <StepLabel >Confirm Sampling</StepLabel>

                                </StepButton>

                            </Step>


                            <Step key={1}>
                                <StepButton
                                    onClick={() => { this.setState({ activeStep: 1 }) }}

                                >
                                    <StepLabel StepIconComponent={this.StepIcon}>Confirm Sample Information</StepLabel>

                                </StepButton>

                            </Step>

                            <Step key={2}>
                                <StepButton
                                    onClick={() => { this.setState({ activeStep: 2 }) }}

                                >
                                    <StepLabel StepIconComponent={this.StepIcon}>Approve</StepLabel>

                                </StepButton>

                            </Step>
                        </Stepper>

                        <Grid container className="flex m-4 justify-around">
                           
                            
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Cart chit (WDN) Number:  ${this.state.consignmentItems.wdn_no ?this.state.consignmentItems.wdn_no : ""}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Date: ${dateParse(this.state.consignmentItems.delivery_date)}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Wharf Ref: ${this.state.consignmentItems.wharf_ref_no}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`HS Code: ${this.state.consignmentItems.hs_code ? this.state.consignmentItems.hs_code : ""}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Invoice no: ${this.state.consignmentItems.invoice_no ? this.state.consignmentItems.invoice_no : ''}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Invoice Date: ${this.state.consignmentItems.invoice_date ? dateParse(this.state.consignmentItems.invoice_date) : ''}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`LDCN Ref No: ${this.state.consignmentItems.ldcn_ref_no ? this.state.consignmentItems.ldcn_ref_no : ''}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`PA No: ${this.state.consignmentItems.pa_no ? this.state.consignmentItems.pa_no : ''}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`PO No: ${this.state.consignmentItems.po ? this.state.consignmentItems.po : ''}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Exchange Rate: ${convertTocommaSeparated(this.state.consignmentItems.exchange_rate, 2)}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Value(${this.state.consignmentItems.currency}): ${convertTocommaSeparated(this.state.consignmentItems.values_in_currency, 2)}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Value(LKR): ${convertTocommaSeparated(this.state.consignmentItems.values_in_lkr, 2)}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Indent Number: ${this.state.consignmentItems.indent_no}`}</Typography>
                            </Grid>

                            
                        </Grid>








                        <Grid container spacing={1} className="flex justify-between">
                           
                            <Grid className='flex justify-center' lg={4} md={12} sm={12} xs={12}>
                                {/*  <SubTitle title={`Order List Number: ${"2021/SPC/N/C/S/00209"}`} /> */}
                            </Grid>
                        </Grid>


                        <Grid className='mt-20'>
                            < LoonsCard >
                                {this.state.loaded &&
                                    <div className="mt-0" >
                                        <LoonsTable
                                            id={'tableConsignment'}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: false,
                                                serverSide: true,
                                                print: false,
                                                viewColumns: false,
                                                download: false,
                                                // count: this.state.totalItems,
                                                rowsPerPage: 1,
                                                //  page: this.state.filterData.page,

                                                onTableChange: (action, tableState) => {
                                                    console.log(action, tableState)
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage(tableState.page)
                                                            break
                                                        case 'sort':
                                                            break
                                                        default:
                                                            console.log(
                                                                'action not handled.'
                                                            )
                                                    }
                                                },
                                            }}
                                        ></LoonsTable>


                                        <Grid container spacing={2} className="mt-8">
                                            <Grid className='px-1' lg={12} md={12} sm={12} xs={12}>
                                                <SwasthaFilePicker
                                                    uploadingSectionVisibility={true}
                                                    id="ConsignmentItemsBatch"
                                                    singleFileEnable={true}
                                                    multipleFileEnable={false}
                                                    dragAndDropEnable={true}
                                                    tableEnable={true}

                                                    documentName={true}//document name enable
                                                    documentNameValidation={['required']}
                                                    documenterrorMessages={['this field is required']}
                                                    documentNameDefaultValue={null}//document name default value. if not value set null
                                                    label="Consignment Batch uploads"
                                                    type={false}
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

                                                    source="ConsignmentItemsBatch"
                                                    source_id={this.state.batchId}

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

                                            <Grid className='px-1 mt-5' lg={12} md={12} sm={12} xs={12}>
                                                <SwasthaFilePicker
                                                    uploadingSectionVisibility={true}
                                                    id="file_samples"
                                                    singleFileEnable={true}
                                                    multipleFileEnable={false}
                                                    dragAndDropEnable={true}
                                                    tableEnable={true}

                                                    documentName={true}//document name enable
                                                    documentNameValidation={['required']}
                                                    documenterrorMessages={['this field is required']}
                                                    documentNameDefaultValue={null}//document name default value. if not value set null
                                                    label="Item Samples uploads"


                                                    type={false}
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

                                                    source="ConsignmentItemSample"
                                                    source_id={this.props.match.params.id}

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
                                    </div>
                                }
                            </LoonsCard>
                        </Grid>
                        <Grid className="mt-8">
                            <LoonsCard>



                                <Grid container className="flex m-4 justify-between w-full">
                                    {this.state.criteriaList.map((value, index) => (
                                        <Grid key={index} className='flex justify-between mb-3' lg={5} md={4} sm={12} xs={12}>
                                            <SubTitle title={value.question} />
                                            <ButtonGroup variant="outlined" className='justify-self-start' >
                                                {value.answers.includes("Yes") && <Button
                                                    className={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "Yes") ? "px-5 button-success" : "px-5"}
                                                    progress={false}
                                                    scrollToTop={true}
                                                    color={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "Yes") && "primary"}
                                                    onClick={() => {
                                                        let temp = this.state.formData.checking_details.filter(criteria => criteria.checking_criteria_id != value.id);
                                                        this.setState({
                                                            formData: {
                                                                ...this.state
                                                                    .formData,
                                                                checking_details: [...temp, { "checking_criteria_id": value.id, "answer": "Yes" }],
                                                            },
                                                        })
                                                    }}
                                                >
                                                    <span className="capitalize">Yes</span>
                                                </Button>}
                                                {value.answers.includes("No") && <Button
                                                    className={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "No") ? "px-5 button-danger" : "px-5"}
                                                    progress={false}
                                                    scrollToTop={true}
                                                    color={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "No") && "primary"}
                                                    onClick={() => {
                                                        let temp = this.state.formData.checking_details.filter(criteria => criteria.checking_criteria_id != value.id);
                                                        this.setState({
                                                            formData: {
                                                                ...this.state
                                                                    .formData,
                                                                checking_details: [...temp, { "checking_criteria_id": value.id, "answer": "No" }],

                                                            },
                                                        })
                                                    }}
                                                >
                                                    <span className="capitalize">No</span>
                                                </Button>}
                                                {value.answers.includes("N/A") && <Button
                                                    className={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "N/A") ? "px-5 button-warning" : "px-5"}
                                                    progress={false}
                                                    scrollToTop={true}
                                                    color={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "N/A") && "primary"}
                                                    onClick={() => {
                                                        let temp = this.state.formData.checking_details.filter(criteria => criteria.checking_criteria_id != value.id);
                                                        this.setState({
                                                            formData: {
                                                                ...this.state
                                                                    .formData,
                                                                checking_details: [...temp, { "checking_criteria_id": value.id, "answer": "N/A" }],

                                                            },
                                                        })
                                                    }}
                                                >
                                                    <span className="capitalize">N/A</span>
                                                </Button>}
                                            </ButtonGroup>
                                        </Grid>
                                    ))}
                                </Grid>

                                <ValidatorForm className=' m-4 '>
                                    <Grid>

                                        <SubTitle title={"SCO Decision"} />
                                        <Grid item lg={8} md={6} sm={12} xs={12}>
                                            <Autocomplete
                                                disableClearable
                                                options={appConst.sco_decision}
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData;
                                                    formData.sco_decision = value.value
                                                    this.setState({ formData })
                                                }}
                                                value={appConst.sco_decision.find((v) => v.value == this.state.formData.sco_decision)}
                                                getOptionLabel={
                                                    (option) => option.label
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Please choose"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={this.state.formData.sco_decision}
                                                    />
                                                )}
                                            />

                                        </Grid>

                                        <SubTitle title={"Reason from SCO"} />
                                        <Grid item lg={8} md={6} sm={12} xs={12}>
                                            <TextValidator
                                                className="w-full"
                                                placeholder="Comment"
                                                name="comment"
                                                InputLabelProps={{ shrink: false }}
                                                value={this.state.formData.comment}
                                                type="text"
                                                multiline
                                                rows={3}
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    this.setState({
                                                        formData: {
                                                            ...this.state
                                                                .formData,
                                                            comment: e.target.value,
                                                        },
                                                    })

                                                }}
                                                validators={'required'}
                                                errorMessages={
                                                    'this field is required'
                                                }
                                            />
                                        </Grid>
                                        <Grid className='flex justify-end mt-4' lg={8} md={6} sm={12} xs={12}>
                                            <Button
                                                className="px-5 py-2 mr-5"
                                                progress={this.state.submitting}
                                                scrollToTop={true}
                                                color=""
                                                onClick={() => {
                                                    this.sampleValidatingBySCO("SCO Not Checked");
                                                }}
                                            >
                                                <span className="capitalize">{"Not Check"}</span>
                                            </Button>
                                            <Button
                                                className="px-10 py-2 mr-5"
                                                progress={this.state.submitting}
                                                scrollToTop={true}
                                                onClick={() => {
                                                    this.sampleValidatingBySCO("SCO Checked");
                                                }}
                                            >
                                                <span className="capitalize">{"Check & Send for AD Approval"}</span>
                                            </Button>

                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
                            </LoonsCard>
                        </Grid>
                        <div className='mt-5'>
                            <Grid>
                                <LoonsCard>
                                    <Grid>
                                        {/* <Button onClick={this.handlePrintClick} size="small" startIcon="print">Print</Button>   */}
                                        <div ref={this.componentRef}></div>
                                        {this.state.loaded && <SampleRejectReport
                                            wdnNumber={this.state.wdnNumber}
                                            wharfRef={this.state.wharfRef}
                                            indentNo={this.state.indentNo}
                                            orderListNo={this.state.orderListNo}
                                            toDate={this.state.toDate}
                                            toMonth={this.state.toMonth}
                                            toYear={this.state.toYear}
                                            sco={this.state.sco}
                                            date={this.state.date}
                                            srNo={this.state.srNo}
                                        />}
                                    </Grid>
                                </LoonsCard>
                            </Grid>
                        </div>


                    </LoonsCard>
                    <LoonsSnackbar
                        open={this.state.alert}
                        onClose={() => {
                            this.setState({ alert: false })
                        }}
                        message={this.state.message}
                        autoHideDuration={3000}
                        severity={this.state.severity}
                        elevation={2}
                        variant="filled"
                    ></LoonsSnackbar>
                </MainContainer>
            </Fragment>
        )
    }
}