import React, { Component, Fragment } from "react";
import {
    Button,
    CardTitle,
    LoonsCard,
    LoonsSnackbar,
    MainContainer,
    SubTitle
} from "../../../components/LoonsLabComponents";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Step,
    StepButton,
    StepLabel,
    Stepper
} from "@material-ui/core";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";
import ConsignmentService from "../../../services/ConsignmentService";
import moment from "moment";
import { dateParse, getDiffInDays } from "utils";

class ConfirmSamples extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            redoStep: 1,

            statusChangeRow: null,
            conformingDialog: false,

            ref_no: '',
            batch_no: '',
            exd: '',
            mfd: '',

            shelf_life: '',
            container_id: '',
            cartoon_no: '',

            status: {
                "status": "SCO Sample Collected"
            },

            all_samples: [],
            redoData: [],

            formData: {
                name: '',
                description: '',
            },

            data: [],

            snackbar: true,
            snackbar_severity: 'success',
            snackbar_message: "Successfully Saved ",
        }
    }

    async createNewRedoReason() {
        let formData = this.state.formData;
        let res = await ConsignmentService.createNewRedoReason(formData);
        if (res.status === 201) {
            this.setState({ alert: true, message: "Redo Reason Saved Successful", severity: 'success' })
        } else {
            this.setState({ alert: true, message: "Redo Reason Saved Unsuccessful", severity: 'error' })
        }
    }

    async loadAllConsignmentSamples() {
        let params = { limit: 1, id: this.props.match.params.id, page: 0 }
        let id = this.props.match.params.id;
        let res = await ConsignmentService.fetchConsignmentSamples(params)
        if (res.status) {
            console.log("ress", res.data.view.data)
            this.matchingId(id, res.data.view.data)
            this.setState({
                all_samples: res.data.view.data,
            },
            )
        }
    }

    matchingId(id, data) {
        data.map(value => {
            if (id === value.id) {
                this.setState({
                    ref_no: value.ref_no,
                    batch_no: value.batch.batch_no,
                    exd: dateParse(value.batch.exd),
                    mfd: dateParse(value.batch.mfd),

                    shelf_life: value.item.item_schedule.Order_item.item.shelf_life,
                    container_id: value.ConsignmentContainer?.Vehicle?.reg_no,
                    cartoon_no: value.cartoon_no,
                })
            }
        })
    }




    async fetchRedoReason() {
        let samples = await ConsignmentService.fetchRedoReason();
        if (samples.status === 200) {
            this.setState({
                redoData: samples.data.view.data
            })
        }
    }

    async confirmSampleCollected() {
        let id = this.props.match.params.id;
        let res = await ConsignmentService.confirmSampleCollected(id, this.state.status)
        if (res.status === 200) {
            this.setState({
                snackbar: true,
                snackbar_severity: 'success',
                message: "Successfully Saved ",
                alert: true
            },
                () => {
                    //window.history.back()
                    window.location = `/consignments/sample-summary`

                })
        }
    }

    async componentDidMount() {
        this.loadAllConsignmentSamples();
        this.fetchRedoReason();
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title=" Consignment Verification Process " />

                        <Stepper nonLinear activeStep={this.state.activeStep} alternativeLabel>
                            <Step key={0}>
                                <StepButton
                                    onClick={() => {
                                        this.setState({ activeStep: 0 })
                                    }}
                                >
                                    <StepLabel>Confirm Sampling </StepLabel>
                                </StepButton>
                            </Step>

                            <Step key={1}>
                                <StepButton
                                    onClick={() => {
                                        this.setState({ activeStep: 1 })
                                    }}
                                >
                                    <StepLabel>Accept Sampling Information</StepLabel>
                                </StepButton>
                            </Step>

                            <Step key={2}>
                                <StepButton
                                    onClick={() => {
                                        this.setState({ activeStep: 2 })
                                    }}
                                >
                                    <StepLabel>Approved</StepLabel>
                                </StepButton>
                            </Step>
                        </Stepper>

                        {this.state.activeStep === 0 &&
                            <div className="w-full">
                                <ValidatorForm
                                    className="pt-2"
                                    onError={() => null}
                                >

                                    {this.state.all_samples != null &&
                                        <Grid className=" w-full" container lg={12} md={12} sm={12} xs={12}>

                                            <Grid className=" w-full text-center" item lg={3} md={3} sm={12} xs={12}>
                                                <SubTitle title={"Ref No : " + this.state.ref_no} />
                                            </Grid>

                                            <Grid className=" w-full text-center" item lg={3} md={3} sm={12} xs={12}>
                                                <SubTitle title={"Batch : " + this.state.batch_no} />
                                            </Grid>

                                            <Grid className=" w-full text-center" item lg={3} md={3} sm={12} xs={12}>
                                                <SubTitle title={"EXD : " + this.state.exd} />
                                            </Grid>

                                            <Grid className=" w-full text-center" item lg={3} md={3} sm={12} xs={12}>
                                                <SubTitle title={"MFD : " + this.state.mfd} />
                                            </Grid>
                                        </Grid>
                                    }


                                    <Grid className=" w-full" container lg={12} md={12} sm={12} xs={12}>

                                        <Grid className=" w-full text-center" item lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title={"Default shelf life: " } />
                                        </Grid>

                                        <Grid className=" w-full text-center" item lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title={"Sample shelf life : " + getDiffInDays(this.state.exd,this.state.mfd)} />
                                        </Grid>

                                        <Grid className=" w-full text-center" item lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title={"Container Number : " + this.state.container_id} />
                                        </Grid>

                                        <Grid className=" w-full text-center" item lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title={"Cartoon Number : " + this.state.cartoon_no} />
                                        </Grid>
                                    </Grid>


                                   

                                    <Grid className=" w-full flex " item lg={6} md={6} sm={12} xs={12}
                                        style={{ marginTop: 25, }}>
                                        <Grid className=" w-full" item lg={4} md={4} sm={4} xs={4}>
                                            <Button
                                                className="mt-2"
                                                progress={false}
                                                type="submit"
                                                scrollToTop={true}
                                                onClick={() => {
                                                    this.confirmSampleCollected()
                                                }}
                                            >
                                                <span className="capitalize">Confirm Sample Collected</span>
                                            </Button>
                                        </Grid>

                                        <Grid className=" w-full" item lg={4} md={4} sm={4} xs={4}>
                                            <Button
                                                variant="outlined"
                                                className="mt-2"
                                                progress={false}
                                                type="submit"
                                                scrollToTop={true}
                                                onClick={() => {
                                                    this.setState({
                                                        conformingDialog: true
                                                    })
                                                }}
                                            >
                                                <span className="capitalize">Redo</span>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
                            </div>
                        }
                    </LoonsCard>
                </MainContainer>

                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    // elevation={2}
                    variant="filled"
                >
                </LoonsSnackbar>

                <Dialog
                    open={this.state.conformingDialog}
                    onClose={() => {
                        this.setState({ conformingDialog: false })
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Reason for Redo"}</DialogTitle>
                    <DialogContent>
                        <Grid className=" w-full flex " item lg={12} md={12} sm={12} xs={12} style={{ marginTop: 25, }}>
                            <ValidatorForm className=" w-full" item lg={12} md={12} sm={12} xs={12}>
                                <Autocomplete
                                        disableClearable
                                    options={this.state.redoData}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.name = value.name
                                        this.setState({ formData })
                                    }}
                                    getOptionLabel={
                                        (option) => option.name
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please choose"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={this.state.formData.name}
                                        />
                                    )}
                                />
                            </ValidatorForm>
                        </Grid>
                    </DialogContent>
                    <DialogContent>
                        <Grid className=" w-full flex " item lg={12}
                            md={12} sm={12} xs={12} style={{ marginTop: 25, }}>
                            <ValidatorForm className=" w-full" item lg={12} md={12} sm={12} xs={12}
                                style={{ marginLeft: 10 }}>
                                <TextValidator
                                    className="w-full"
                                    placeholder="Comment"
                                    name="comment"
                                    InputLabelProps={{ shrink: false }}
                                    value={this.state.description}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {
                                        let formData = this.state.formData;
                                        formData.description = e.target.value;
                                        this.setState({ formData })
                                    }}
                                />
                            </ValidatorForm>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            className="mt-2"
                            progress={false}
                            type="submit"
                            scrollToTop={true}
                            onClick={() => {
                                this.createNewRedoReason()
                            }}
                        >
                            <span className="capitalize">Confirm Redo</span>
                        </Button>
                    </DialogActions>
                </Dialog>

            </Fragment>
        )
    }
}

export default ConfirmSamples
