import React, { Component, Fragment } from 'react'
import {
    Stepper,
    Step,
    StepLabel,
    StepButton,
    Grid,
    ButtonGroup
} from '@material-ui/core'

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

import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'

import ConsignmentService from "app/services/ConsignmentService";
import localStorageService from 'app/services/localStorageService';
import { dateParse } from 'utils';
import SPCServices from 'app/services/SPCServices';

export default class ApproveSampleCIU extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 2,
            alert: false,
            message: "",
            severity: 'success',
            loaded: false,
            consignment_id: "",
            data: [],
            columns: [
                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        //filter: true,
                        display: true,
                    },
                },
                {
                    name: 'medium_description',
                    label: 'Name',
                    options: {
                        //filter: true,
                        display: true,
                    },
                },
                {
                    name: 'item_quantity',
                    label: 'Item Qty',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'batch_quantity',
                    label: 'Batch Qty',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                /*  {
                     name: 'manufacture',
                     label: 'Manufacture/Supplier',
                     options: {
                         filter: true,
                         display: true,
                     },
                 }, */
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
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.shelf
                            return <p>{data == 'No shelf_life' ? "" : data}</p>//changed by roshan to hide
                        },
                    },
                },
                /* {
                    name: 'item_shelf',
                    label: 'Item Shelf Life',
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     const today = mfd;
                        //     const expire_date = exd;
                        //     let remaining = today.diff(expire_date,"days");
                        //     let exact_value = Math.abs(remaining);
                        //     let weeks = Math.floor(exact_value/7);
                        //     let days = exact_value%7;
                        //     return (

                        //       <p>{weeks}{" W "}{days}{" D "}</p>

                        //     )
                        // }
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.itemData[dataIndex].batch.exd

                        //     return <p>{data}</p>
                        // },  
                    },
                }, */

            ],

            consignmentItems: {},
            debitNoteItems: [],
            criteriaList: [],
            batchId: null,

            formData: {
                sample_id: this.props.match.params.id,
                comment: "",
                comment_type: "Director",
                change_status_by: "",
                change_status: "",
                checking_details: []
            },
            filterData: { item_id: this.props.match.params.id, role: "Director" },
            filterDataForSCO: { sample_id: this.props.match.params.id, type: ["SCO"] },
            filterDataForAD: { sample_id: this.props.match.params.id, type: ["AD"] },
            filterDataForDirector: { sample_id: this.props.match.params.id, type: ["Director"] },

            validatedListOfSCO: [],
            validatedListOfAD: [],
            validatedListOfDirector: [],
            other_data: {},
            logined_user_roles: []

        }
    }

    async componentDidMount() {
        this.loadData(this.props.match.params.id);

        const query = new URLSearchParams(this.props.location.search);
        const type = query.get('type')
        if (type == 'CIU_View') {
            console.log("type", type)

        }

        var user = await localStorageService.getItem('userInfo');
        let formData = this.state.formData;
        formData.change_status_by = user.id;

        this.setState({ formData, logined_user_roles: user.roles })
        this.loadCriterias();
        this.validatedSampleBySCO();
        this.validatedSampleByAD();
        this.validatedSampleByDirector();
        // this.loadWharfRefNo();
    }

    async loadData(id) {
        this.setState({ loaded: false })

        let consignment_res = await ConsignmentService.getConsignmentSampleByIdByURL(id);
        if (consignment_res.status == 200 && consignment_res.data.view !== null) {
            this.setState({
                consignmentItems: consignment_res.data.view.item.Consignment,
                batchId: consignment_res.data.view.batch_id,
                data: [{
                    "sr_no": consignment_res.data.view.item.item_schedule.Order_item.item.sr_no,
                    "medium_description": consignment_res.data.view.item.item_schedule.Order_item.item.medium_description,
                    "item_quantity": consignment_res.data.view.item.quantity,
                    "batch_quantity": consignment_res.data.view.batch.quantity,
                    "batch_no": consignment_res.data.view.batch.batch_no,
                    "exd": dateParse(consignment_res.data.view.batch.exd),
                    "mfd": dateParse(consignment_res.data.view.batch.mfd),
                    "shelf": consignment_res.data.view.item.item_schedule.Order_item.item.shelf_life,


                }],
                other_data: {
                    "ad_comment": consignment_res.data.view.ad_comment,
                    "sco_comment": consignment_res.data.view.sco_comment,
                    "director_comment": consignment_res.data.view.director_comment,
                    "consingment_id": consignment_res.data.view.item.consignment_id
                },
                loaded: true,
            })

            console.log("consigment data", this.state.data)
        }

        let params = {
            consignment_id: consignment_res.data.view.item.consignment_id,
            is_active: true
        }
        let debitNote_res = await SPCServices.getAllDebitNotes(params);
        if (debitNote_res.status == 200) {
            console.log("Data",debitNote_res.data.view.data)
            console.log("Shipment No",debitNote_res.data.view.data?.[0]?.Consignment?.shipment_no)
            this.setState({
                debitnote_id: debitNote_res.data.view.data?.[0]?.id,
                shipment_no: debitNote_res.data.view.data?.[0]?.Consignment?.shipment_no
            }, () => {
                this.render()
            })
        }
    }

    // async loadWharfRefNo() {
    //     console.log("test1")
    //     let sampleId = this.props.match.params.id
    //     // let sampleId = this.state.consignmentItems
    //     console.log("Sample ID", sampleId)
    //     console.log("test2")
    //     let consignment_data = await ConsignmentService.getConsignmentById(sampleId)
    //     console.log('consignment ID', consignment_data)
    //     let params = {
    //         sample_id: sampleId,
    //         is_active: true
    //     }
    //     let debitNote_res = await SPCServices.getAllDebitNotes(params);
    //     // let debitNote_res = await SPCServices.getDebitNoteByID(sampleId);
    //     console.log("test3")
    //     if (debitNote_res.status == 200 && debitNote_res.data.view !== null) {
    //         console.log("Data",debitNote_res.data.view.data)
    //         console.log("Shipment No",debitNote_res.data.view.data?.[0]?.Consignment?.shipment_no)
    //         this.setState({
    //             debitnote_id: debitNote_res.data.view.data?.[0]?.id,
    //             shipment_no: debitNote_res.data.view.data?.[0]?.Consignment?.shipment_no
    //         }, () => {
    //             this.render()
    //         })
    //     }
    // }
    async loadCriterias() {
        let criteria_res = await ConsignmentService.getCheckingCriterias(this.state.filterData);
        if (criteria_res.status == 200 && criteria_res.data.view !== null) {
            this.setState({
                criteriaList: criteria_res.data.view.data
            })
        }
    }


    async sampleValidatingByDirector(status) {
        let formData = this.state.formData;
        formData.change_status = status;

        let res = await ConsignmentService.consignmentSampleValidating(formData);
        if (res.status == 201) {
            this.setState({
                alert: true,
                severity: 'success',
                message: 'Validation Successfull',
            })
            this.loadData(this.props.match.params.id);
            this.loadCriterias();
            this.validatedSampleBySCO();
            this.validatedSampleByAD();
            this.validatedSampleByDirector();
            // this.loadWharfRefNo();
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: 'Validation Unsuccessfull',
            })
        }
    }

    async validatedSampleBySCO() {
        let res = await ConsignmentService.getValidatedSamples(this.state.filterDataForSCO);
        if (res.status == 200) {
            this.setState({
                validatedListOfSCO: res.data.view.data
            })
        }
    }

    async validatedSampleByAD() {
        let res = await ConsignmentService.getValidatedSamples(this.state.filterDataForAD);
        if (res.status == 200) {
            this.setState({
                validatedListOfAD: res.data.view.data
            })
        }
    }
    async validatedSampleByDirector() {
        let res = await ConsignmentService.getValidatedSamples(this.state.filterDataForDirector);
        if (res.status == 200) {
            this.setState({
                validatedListOfDirector: res.data.view.data
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
                            <Grid className='flex justify-center' lg={4} md={8} sm={12} xs={12} >
                                <SubTitle title={`Cart chit (WDN) Number: ${this.state.consignmentItems.wdn_no}`} />
                            </Grid>
                            <Grid className='flex justify-center' lg={4} md={8} sm={12} xs={12}>
                                <SubTitle title={`Date: ${moment(this.state.consignmentItems.delivery_date).format("YYYY-MM-DD")}`} />
                            </Grid>
                            <Grid className='flex justify-center' lg={4} md={8} sm={12} xs={12}>
                                <SubTitle title={`Wharf Ref: ${this.state.shipment_no}`} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} className="flex justify-between">
                            <Grid className='flex justify-center' lg={4} md={12} sm={12} xs={12}>
                                <SubTitle title={`Indent Number: ${this.state.consignmentItems.indent_no}`} />
                            </Grid>
                            <Grid className='flex justify-center' lg={4} md={12} sm={12} xs={12}>
                                {/*  <SubTitle title={`Order List Number: ${"2021/SPC/N/C/S/00209"}`} /> */}
                            </Grid>
                        </Grid>

                        <Grid>
                            {this.state.logined_user_roles.includes("MSD CIU") ?
                                <Button
                                    className="mt-6"
                                    progress={false}
                                    //type="submit"
                                    scrollToTop={true}

                                    onClick={() => {
                                        window.location.href = `/consignments/msdCIU/view-consignment/${this.state.other_data.consingment_id}`;
                                    }}>
                                    Enter Item Details
                                </Button>
                                : null
                            }

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
                                                    id="file_public"
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
                                                    id="file_public"
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

                        {this.state.validatedListOfSCO.length > 0 && <Grid className="mt-8">
                            <LoonsCard>
                                <SubTitle title="SCO Validation Details" />
                                <Grid container className="flex m-4 justify-between w-full">
                                    {this.state.validatedListOfSCO.map((value, index) => (

                                        <Grid key={index} className='flex justify-between mb-3' lg={5} md={4} sm={12} xs={12}>
                                            <SubTitle title={value.CheckingCriterium.question} />
                                            <ButtonGroup variant="outlined" className='justify-self-start' >
                                                <Button
                                                    className={value.answer === "Yes" ? "px-5 button-success" : "px-5"}
                                                    progress={false}
                                                    scrollToTop={true}
                                                    //disabled={this.state.validatedListOfSCO.some(val => val["checking_criteria_id"] === value.id && val["answer"] !== "Yes")}
                                                    color={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "Yes") && "primary"}

                                                >
                                                    <span className="capitalize">Yes</span>
                                                </Button>

                                                <Button
                                                    className={value.answer === "No" ? "px-5 button-danger" : "px-5"}
                                                    progress={false}
                                                    scrollToTop={true}
                                                    //disabled={this.state.validatedListOfSCO.some(val => val["checking_criteria_id"] === value.id && val["answer"] !== "No")}
                                                    color={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "No") && "primary"}

                                                >
                                                    <span className="capitalize">No</span>
                                                </Button>

                                                <Button
                                                    className={value.answer === "N/A" ? "px-5 button-warning" : "px-5"}
                                                    progress={false}
                                                    scrollToTop={true}
                                                    // disabled={this.state.validatedListOfSCO.some(val => val["checking_criteria_id"] === value.id && val["answer"] !== "N/A")}
                                                    color={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "N/A") && "primary"}

                                                >
                                                    <span className="capitalize">N/A</span>
                                                </Button>

                                            </ButtonGroup>

                                        </Grid>


                                    ))}

                                    <Grid className='mb-3' lg={12} md={12} sm={12} xs={12}>
                                        <SubTitle title={"Reason From SCO"} />
                                        <SubTitle title={this.state.other_data.sco_comment} />
                                    </Grid>
                                </Grid>
                            </LoonsCard>
                        </Grid>}


                        {this.state.validatedListOfAD.length > 0 && <Grid className="mt-8">
                            <LoonsCard>
                                <SubTitle title="AD Validation Details" />
                                <Grid container className="flex m-4 justify-between w-full">
                                    {this.state.validatedListOfAD.map((value, index) => (
                                        <Grid key={index} className='flex justify-between mb-3' lg={5} md={4} sm={12} xs={12}>
                                            <SubTitle title={value.CheckingCriterium.question} />
                                            <ButtonGroup variant="outlined" className='justify-self-start' >
                                                <Button
                                                    className={value.answer === "Yes" ? "px-5 button-success" : "px-5"}
                                                    progress={false}
                                                    scrollToTop={true}
                                                    //disabled={this.state.validatedListOfSCO.some(val => val["checking_criteria_id"] === value.id && val["answer"] !== "Yes")}
                                                    color={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "Yes") && "primary"}

                                                >
                                                    <span className="capitalize">Yes</span>
                                                </Button>

                                                <Button
                                                    className={value.answer === "No" ? "px-5 button-danger" : "px-5"}
                                                    progress={false}
                                                    scrollToTop={true}
                                                    //disabled={this.state.validatedListOfSCO.some(val => val["checking_criteria_id"] === value.id && val["answer"] !== "No")}
                                                    color={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "No") && "primary"}

                                                >
                                                    <span className="capitalize">No</span>
                                                </Button>

                                                <Button
                                                    className={value.answer === "N/A" ? "px-5 button-warning" : "px-5"}
                                                    progress={false}
                                                    scrollToTop={true}
                                                    // disabled={this.state.validatedListOfSCO.some(val => val["checking_criteria_id"] === value.id && val["answer"] !== "N/A")}
                                                    color={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "N/A") && "primary"}

                                                >
                                                    <span className="capitalize">N/A</span>
                                                </Button>

                                            </ButtonGroup>

                                        </Grid>
                                    ))}

                                    <Grid className='mb-3' lg={12} md={12} sm={12} xs={12}>
                                        <SubTitle title={"Reason From AD"} />
                                        <SubTitle title={this.state.other_data.ad_comment} />
                                    </Grid>
                                </Grid>
                            </LoonsCard>
                        </Grid>}

                        {this.state.validatedListOfDirector.length > 0 && <Grid className="mt-8">
                            <LoonsCard>
                                <SubTitle title="Director Validation Details" />
                                <Grid container className="flex m-4 justify-between w-full">
                                    {this.state.validatedListOfDirector.map((value, index) => (
                                        <Grid key={index} className='flex justify-between mb-3' lg={5} md={4} sm={12} xs={12}>
                                            <SubTitle title={value.CheckingCriterium.question} />
                                            <ButtonGroup variant="outlined" className='justify-self-start' >
                                                <Button
                                                    className={value.answer === "Yes" ? "px-5 button-success" : "px-5"}
                                                    progress={false}
                                                    scrollToTop={true}
                                                    //disabled={this.state.validatedListOfSCO.some(val => val["checking_criteria_id"] === value.id && val["answer"] !== "Yes")}
                                                    color={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "Yes") && "primary"}

                                                >
                                                    <span className="capitalize">Yes</span>
                                                </Button>

                                                <Button
                                                    className={value.answer === "No" ? "px-5 button-danger" : "px-5"}
                                                    progress={false}
                                                    scrollToTop={true}
                                                    //disabled={this.state.validatedListOfSCO.some(val => val["checking_criteria_id"] === value.id && val["answer"] !== "No")}
                                                    color={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "No") && "primary"}

                                                >
                                                    <span className="capitalize">No</span>
                                                </Button>

                                                <Button
                                                    className={value.answer === "N/A" ? "px-5 button-warning" : "px-5"}
                                                    progress={false}
                                                    scrollToTop={true}
                                                    // disabled={this.state.validatedListOfSCO.some(val => val["checking_criteria_id"] === value.id && val["answer"] !== "N/A")}
                                                    color={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "N/A") && "primary"}

                                                >
                                                    <span className="capitalize">N/A</span>
                                                </Button>

                                            </ButtonGroup>

                                        </Grid>
                                    ))}
                                    <Grid className='mb-3' lg={12} md={12} sm={12} xs={12}>
                                        <SubTitle title={"Reason From Director"} />
                                        <SubTitle title={this.state.other_data.director_comment} />
                                    </Grid>
                                </Grid>
                            </LoonsCard>
                        </Grid>}

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
