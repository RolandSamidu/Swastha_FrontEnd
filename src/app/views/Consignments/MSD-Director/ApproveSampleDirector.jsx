import React, { Component, Fragment } from 'react'
import {
    Stepper,
    Step,
    StepLabel,
    StepButton,
    Grid,
    ButtonGroup,
    Typography
} from '@material-ui/core'

import {
    MainContainer,
    LoonsCard,
    SubTitle,
    LoonsTable,
    Button,
    LoonsSnackbar
} from "app/components/LoonsLabComponents";
import moment from "moment";

import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { convertTocommaSeparated, dateParse } from 'utils';

import ConsignmentService from "app/services/ConsignmentService";
import localStorageService from 'app/services/localStorageService';

export default class ApproveSampleDirector extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 2,
            alert: false,
            message: "",
            severity: 'success',
            loaded: false,
            data: [],
            columns: [
                {
                    name: 'sr_no',
                    label: 'SR No/ Name',
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
                {
                    name: 'manufacture',
                    label: 'Manufacture/Supplier',
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

            validatedListOfSCO: [],
            validatedListOfAD: [],
            other_data: {},

        }
    }

    async componentDidMount() {
        this.loadData(this.props.match.params.id);
        var user = await localStorageService.getItem('userInfo');
        let formData=this.state.formData;
        formData.change_status_by=user.id;
        this.setState({formData})
        this.loadCriterias();
        this.validatedSampleBySCO();
        this.validatedSampleByAD();
    }

    async loadData(id) {
        this.setState({ loaded: false })
        let consignment_res = await ConsignmentService.getConsignmentSampleByIdByURL(id);
        if (consignment_res.status == 200 && consignment_res.data.view !== null) {
            this.setState({
                consignmentItems: consignment_res.data.view.item.Consignment,
                data: [{
                    "sr_no": consignment_res.data.view.item.item_schedule.Order_item.item.sr_no,
                    "item_quantity": consignment_res.data.view.item.quantity,
                    "batch_quantity": consignment_res.data.view.batch.quantity,
                    "batch_no": consignment_res.data.view.batch.batch_no,
                    "exd": moment(consignment_res.data.view.batch.exd).format("YYYY-MM-DD"),
                    "mfd": moment(consignment_res.data.view.batch.mfd).format("YYYY-MM-DD"),
                    "shelf": consignment_res.data.view.item.item_schedule.Order_item.item.shelf_life,

                }],
                other_data: {
                    "ad_comment": consignment_res.data.view.ad_comment,
                    "sco_comment": consignment_res.data.view.sco_comment,
                },
                loaded: true,
            })
        }
    }

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
            },()=>{
                window.location = `/consignments/msdDirector/sample-summary`

            })
            /* this.loadData(this.props.match.params.id);
            this.loadCriterias();
            this.validatedSampleBySCO();
            this.validatedSampleByAD(); */


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
                                            <SubTitle title={value.answer} />
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
                                            <SubTitle title={value.answer} />
                                        </Grid>
                                    ))}
                                    <Grid className='mb-3' lg={12} md={12} sm={12} xs={12}>
                                        <SubTitle title={"Reason From AD"} />
                                        <SubTitle title={this.state.other_data.ad_comment} />
                                    </Grid>
                                </Grid>
                            </LoonsCard>
                        </Grid>}
                        <Grid className="mt-8">
                            <LoonsCard>
                                <Grid container className="flex m-4 justify-between w-full">
                                    {this.state.criteriaList.map((value, index) => (
                                        <Grid key={index} className='flex justify-between mb-3' lg={5} md={4} sm={12} xs={12}>
                                            <SubTitle title={value.question} />
                                            <ButtonGroup variant="outlined" className='justify-self-start' >
                                                {value.answers.includes("Yes") && <Button
                                                    className="px-5"
                                                    progress={false}
                                                    scrollToTop={true}
                                                    //disabled={this.state.validatedListOfSCO.some(val => val["checking_criteria_id"] === value.id && val["answer"] !== "Yes")}
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
                                                    className="px-5"
                                                    progress={false}
                                                    scrollToTop={true}
                                                    //disabled={this.state.validatedListOfSCO.some(val => val["checking_criteria_id"] === value.id && val["answer"] !== "No")}
                                                    color={this.state.formData.checking_details.some(val => val["checking_criteria_id"] === value.id && val["answer"] === "No") && "primary"}
                                                    onClick={() => {
                                                        // this.state.validatedListOfSCO.some(val => val["checking_criteria_id"] === value.id) &&
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
                                                    className="px-5"
                                                    progress={false}
                                                    scrollToTop={true}
                                                    //disabled={this.state.validatedListOfSCO.some(val => val["checking_criteria_id"] === value.id && val["answer"] !== "N/A")}
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
                                        <SubTitle title={"Reason from Director"} />
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
                                                className="px-10 py-2 mr-5"
                                                progress={false}
                                               // scrollToTop={true}
                                                onClick={() => {
                                                    this.sampleValidatingByDirector("Director Recommended");
                                                }}
                                            >
                                                <span className="capitalize">Approve</span>
                                            </Button>
                                            <Button
                                                className="px-5 py-2 mr-5"
                                                progress={false}
                                                scrollToTop={true}
                                                color=""
                                                //disabled={this.state.formData.checking_details.length <= this.state.criteriaList.length}
                                                onClick={() => {
                                                    this.sampleValidatingByDirector("Director Returned");
                                                }}
                                            >
                                                <span className="capitalize">{"Reject & Return"}</span>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
                            </LoonsCard>
                        </Grid>
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
