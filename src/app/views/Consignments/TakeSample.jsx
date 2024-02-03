import React, { Component, Fragment } from "react";
import { withStyles } from '@material-ui/styles'
import {
    Stepper,
    Step,
    StepLabel,
    StepButton,
    Grid,
    IconButton,
    Dialog,

} from '@material-ui/core'

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    Button,
    LoonsSnackbar,
    LoonsDialogBox,
    SwasthaFilePicker
} from "app/components/LoonsLabComponents";

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";
import ConsignmentService from "app/services/ConsignmentService";
import Barcode from 'react-jsbarcode';
import AssignmentIcon from '@material-ui/icons/Assignment';

import moment from "moment";

import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

import * as appConst from '../../../appconst';
import VehicleService from "app/services/VehicleService";
import localStorageService from "app/services/localStorageService";

const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },

    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: "#bad4ec"
        // backgroundColor: themeColors['whiteBlueTopBar'].palette.primary.main
    },

    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },

    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },


    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: -80,
    },
})

class TakeSample extends Component {
    constructor(props) {
        super(props)
        this.state = {
            snackbar: false,
            snackbar_message: '',
            snackbar_severity: 'success',
            submitting: false,

            infoMessage: "",
            infoMessageAlert: false,
            ref_no: null,

            activeStep: 1,
            addButton: false,
            collapseButton: 0,

            collapseButtonInBatch: 0,

            newConsignmentArray: [],
            consignmentArray: [],
            consignmentItems: [],
            consignmentContainer: [],
            allVehicles: [],

            filterData: {
                type: ['MSD SCO', 'MSD SCO Supply', 'MSD SCO QA']
            },
            sco_data: [],

            formData: {
                item_id: null,
                handing_sco_id: null,
                shelf_life: "shelf",
                container_id: null,
                cartoon_no: null,
                batch_id: null
            },

            consignmentDetails: [],
            userRoles: [],
            showUpload: false,
            selectedForUpload: null,
        }
    }

    async componentDidMount() {
        let loginUser = await localStorageService.getItem('userInfo')
        this.setState({ userRoles: loginUser.roles })

        this.loadData(this.props.match.params.id);
        this.loadSCO();
        this.loadVehicles();

    }


    async loadData(id) {
        let consignment_res = await ConsignmentService.getConsignmentById(id);
        if (consignment_res.status == 200 && consignment_res.data.view !== null) {
            this.setState({
                consignmentItems: consignment_res.data.view.ConsignmentItems,
                consignmentContainer: consignment_res.data.view.ConsignmentContainers,
            }, () => { this.getConsignmentSamples(); })
        }
        this.setbatch()
    }

    async loadVehicles() {
        let vehicle_res = await VehicleService.getAllVehicles();
        if (vehicle_res.status == 200 && vehicle_res.data.view !== null) {
            this.setState({
                allVehicles: vehicle_res.data.view.data
            })
        }
    }

    async setbatch() {
        this.state.consignmentItems.map((v) => (
            v.Batch.map((val) => (
                this.setState({
                    newConsignmentArray: [...this.state.newConsignmentArray, val]
                },
                    () => {
                        this.render()
                    })
            ))
        ))
    }

    async loadSCO() {
        let sco_res = await ConsignmentService.getScoFromEmployees(this.state.filterData);
        if (sco_res.status == 200) {
            this.setState({
                sco_data: sco_res.data.view.data,
            },
                () => {
                    this.render()
                })
        }
    }
    async saveSCO(consignmentId, batchId) {
        this.setState({ submitting: true })
        this.state.formData.batch_id = batchId
        this.state.formData.item_id = consignmentId
        let user_id = await localStorageService.getItem('userInfo').id

        // if (this.state.userRoles.includes('MSD SCO','MSD SCO Supply','MSD SCO QA'))
        if (this.state.userRoles.includes("MSD SCO") === true || this.state.userRoles.includes("MSD SCO Supply") === true || this.state.userRoles.includes("MSD SCO QA") === true) {
            this.setState({
                formData: {
                    ...this.state.formData,
                    handing_sco_id: user_id,
                    batch_id: batchId,
                    item_id: consignmentId,
                },
            })

        }

/* console.log("formData",this.state.formData)
this.setState({submitting: false}) */
         let sco_res = await ConsignmentService.saveNewSCO(this.state.formData);
        console.log("ress", sco_res)
        if (sco_res.status == 201) {
            // alert("wade ok")

            this.setState({
                //submitting: false,
                snackbar: true,
                snackbar_message: 'Data Added Successful',
                snackbar_severity: 'success',
                infoMessage: "Sample Reference No :" + sco_res?.data?.posted?.data?.ref_no,
                ref_no: sco_res?.data?.posted?.data?.ref_no,
                infoMessageAlert: true
            }, () => {


                // window.location.reload()
            })
        } else{
            this.setState({
                submitting: false,
                snackbar: true,
                snackbar_message: 'Data Added Unsuccessful',
                snackbar_severity: 'error',
               
            })
        }
    }

    async getConsignmentSamples() {
        let params = {
            consignment_id: this.props.match.params.id
        }
        let consignment_sample_res = await ConsignmentService.getConsignmentSampleById(params);

        console.log("consingment samples", consignment_sample_res)

        if (consignment_sample_res.status == 200) {
            this.setState({
                consignmentDetails: consignment_sample_res.data.view.data,
            })
        }
        this.compare();
    }

    async compare() {
        this.state.consignmentItems.map((v) => (
            this.state.consignmentDetails.map((value) => (
                v.id === value.item.id && this.setState({
                    consignmentArray: [...this.state.consignmentArray, {
                        "sample_id": value.id,
                        "id": value.batch_id,
                        "container_id": value.container_id,
                        "handing_sco_id": value.handing_sco_id,
                        "ref_no": value.ref_no,
                        "status": value.status,
                        "cartoon_no": value.cartoon_no
                    }]
                },
                    () => {
                        this.render()
                    })
            ))
        ))
    }

    handleClick(index) {
        if (this.state.collapseButton === index) {
            this.setState({ collapseButton: "" })
        } else {
            this.setState({ collapseButton: index })
        }
    }

    handleClickInBatch(index) {
        if (this.state.collapseButtonInBatch === index) {
            this.setState({ collapseButtonInBatch: "" })
        } else {
            this.setState({ collapseButtonInBatch: index })
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        return (<Fragment>
            <MainContainer>
                <LoonsCard>
                    <CardTitle title="Consignment Verification Process" />
                    <Stepper nonLinear activeStep={this.state.activeStep} alternativeLabel>
                        <Step key={0}>
                            <StepButton
                                onClick={() => { this.setState({ activeStep: 0 }) }}

                            >
                                <StepLabel >Fill in the Sampling Information</StepLabel>

                            </StepButton>

                        </Step>


                        <Step key={1}>
                            <StepButton
                                onClick={() => { this.setState({ activeStep: 1 }) }}

                            >
                                <StepLabel StepIconComponent={this.StepIcon}>Accept Sample Information</StepLabel>

                            </StepButton>

                        </Step>

                        <Step key={2}>
                            <StepButton
                                onClick={() => { this.setState({ activeStep: 2 }) }}

                            >
                                <StepLabel StepIconComponent={this.StepIcon}>Approved</StepLabel>

                            </StepButton>

                        </Step>
                    </Stepper>
                    <Grid
                        className="flex justify-end" item lg={12} md={12} sm={12} xs={12}
                    >
                        {/*  <Button
                            className="ml-10 p-2"
                            progress={false}
                            scrollToTop={true}
                            onClick={() => { console.log("clicked") }}
                        >
                            <span className="capitalize">Hand Over to SCO</span>
                        </Button> */}
                    </Grid>


                    {this.state.consignmentItems.map((value, indexKey) => (
                        <div>
                            <Grid container spacing={1} className="flex mt-4 justify-end ">
                                <Grid className="flex justify-around" item lg={4} md={8} sm={12} xs={12}>
                                    {/* <Grid className="flex justify-start w-full" item>
                                        <SubTitle title="SR Number: " />
                                        &nbsp;
                                        <SubTitle title={value.item_schedule.Order_item.item.sr_no} />
                                    </Grid> */}
                                </Grid>
                                <Grid className="flex justify-around" item lg={6} md={12} sm={12} xs={12} >
                                    {/* <Grid className="flex justify-start w-full" item>
                                        <SubTitle title="SR Name: " />
                                        &nbsp;
                                        <SubTitle title={value.item_schedule.Order_item.item.name} />
                                    </Grid> */}
                                </Grid>
                            </Grid>

                            <Grid
                                className="flex justify-around align-center mx-10 mt-4"
                                style={{ backgroundColor: '#ffae38' }}
                            >
                                <Grid className="flex align-center" lg={5} md={6} sm={12} xs={12}>

                                    {
                                        this.state.userRoles.includes("MSD SCO") === true || this.state.userRoles.includes("MSD SCO Supply") === true || this.state.userRoles.includes("MSD SCO QA") === true

                                            ?
                                            <Grid container>
                                                <Grid className="flex align-center" item style={{ alignItems: 'center' }}>
                                                    <SubTitle title={value.item_schedule.Order_item.item.name} />
                                                </Grid>

                                            </Grid>
                                            : <Grid container>
                                                <Grid className="flex align-center" item style={{ alignItems: 'center' }}>
                                                    <SubTitle title={value.item_schedule.Order_item.item.name} />
                                                </Grid>
                                                <Grid item>
                                                    <ValidatorForm className="w-full ml-5">
                                                        <SubTitle title="Handing over SCO:" />

                                                        <Autocomplete
                                        disableClearable
                                                            options={
                                                                this.state.sco_data
                                                            }
                                                            onChange={(e, value) => {
                                                                if (null != value) {
                                                                    this.setState({
                                                                        formData: {
                                                                            ...this.state
                                                                                .formData,
                                                                            handing_sco_id:
                                                                                value.id,

                                                                        },
                                                                    })
                                                                }
                                                            }}
                                                            getOptionLabel={(option) =>
                                                                option.name ? option.name : ''
                                                            }
                                                            renderInput={(params) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="SCO"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size="small"
                                                                />
                                                            )}
                                                        />
                                                    </ValidatorForm>
                                                </Grid>

                                            </Grid>}


                                </Grid>
                                <Grid>
                                    <IconButton aria-label="collaps" className="mt-2" >
                                        {this.state.collapseButton === indexKey ?
                                            <KeyboardArrowDownIcon onClick={() => this.handleClick(indexKey)}
                                            /> :
                                            <KeyboardArrowRightIcon onClick={() => this.handleClick(indexKey)}
                                            />
                                        }
                                    </IconButton>
                                </Grid>
                            </Grid>
                            {value.Batch.map((batchVal, index) => (
                                <Collapse in={indexKey === this.state.collapseButton}>
                                    <Grid key={index} container spacing={1} className="flex justify-center mt-4 mb-4">
                                        <Grid
                                            style={{ backgroundColor: '#fdefc8' }}
                                            className="flex justify-center" item lg={8} md={8} sm={12} xs={12}
                                        >
                                            <div className="flex-row w-full p-4" style={{ border: "1px solid gray" }}>
                                                <Grid className="flex justify-around w-full" item>
                                                    <SubTitle title={`Batch : ${batchVal.batch_no}`} />
                                                    <SubTitle title={`MFD :  ${moment(batchVal.mfd).format("YYYY-MM-DD")}`} />
                                                    <SubTitle title={`EXP : ${moment(batchVal.exd).format("YYYY-MM-DD")}`} />
                                                    <SubTitle title="Shelf Life:" />
                                                    <IconButton aria-label="add" className="p-0">
                                                        {this.state.collapseButtonInBatch === index ?
                                                            <KeyboardArrowDownIcon onClick={() => this.handleClickInBatch(index)}
                                                            /> :
                                                            <KeyboardArrowRightIcon onClick={() => this.handleClickInBatch(index)}
                                                            />
                                                        }
                                                    </IconButton>
                                                </Grid>
                                                <Collapse in={index === this.state.collapseButtonInBatch}>
                                                    <div>
                                                        {this.state.newConsignmentArray.length > 0 && this.state.newConsignmentArray.map((value) => {
                                                            return value.id == batchVal.id && (
                                                                <Grid className="w-full flex-row justify-start mt-8 p-4" style={{ border: "1px solid gray" }} item lg={12} md={12} sm={12} xs={12}>
                                                                    <ValidatorForm
                                                                        className="flex justify-start mt-8 pl-10">
                                                                        <Grid
                                                                            lg={9} md={9} sm={12} xs={12}
                                                                        >
                                                                            <SubTitle title="Container Number:" />

                                                                            <Autocomplete
                                        disableClearable
                                                                                options={
                                                                                    this.state.consignmentContainer
                                                                                }
                                                                                onChange={(e, value) => {
                                                                                    if (null != value) {
                                                                                        this.setState({
                                                                                            formData: {
                                                                                                ...this.state
                                                                                                    .formData,
                                                                                                container_id:
                                                                                                    value.id,

                                                                                            },
                                                                                        })
                                                                                    }
                                                                                }}
                                                                                getOptionLabel={(option) =>
                                                                                    option.Vehicle.reg_no ? option.Vehicle?.reg_no : ''
                                                                                }
                                                                                renderInput={(params) => (
                                                                                    <TextValidator
                                                                                        {...params}
                                                                                        placeholder="Select"
                                                                                        fullWidth
                                                                                        variant="outlined"
                                                                                        size="small"
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </Grid>
                                                                    </ValidatorForm>
                                                                    <ValidatorForm
                                                                        className="flex justify-start mt-4 pl-10">
                                                                        <Grid
                                                                            lg={9} md={9} sm={12} xs={12}
                                                                        >
                                                                            <SubTitle title="Cartoon Number:" />

                                                                            <Autocomplete
                                        disableClearable
                                                                                options={
                                                                                    appConst.remark_numbers.map((option) => option.remark_no)
                                                                                }
                                                                                freeSolo
                                                                                autoSelect
                                                                                onChange={(e, value) => {
                                                                                    if (null != value) {
                                                                                        this.setState({
                                                                                            formData: {
                                                                                                ...this.state
                                                                                                    .formData,
                                                                                                cartoon_no:
                                                                                                    value,

                                                                                            },
                                                                                        })
                                                                                    }
                                                                                }}
                                                                                onInputChange={(event, newInputValue) => {
                                                                                    this.setState({
                                                                                        formData: {
                                                                                            ...this.state
                                                                                                .formData,
                                                                                            cartoon_no:
                                                                                                newInputValue,

                                                                                        },
                                                                                    })
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <TextValidator
                                                                                        {...params}
                                                                                        placeholder="Select Option or enter a remark"
                                                                                        fullWidth
                                                                                        variant="outlined"
                                                                                        size="small"
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </Grid>
                                                                    </ValidatorForm>
                                                                    <Grid
                                                                        className="mt-4 w-full flex justify-between" item lg={12} md={12} sm={12} xs={12}
                                                                    >
                                                                        <Button
                                                                            className="ml-10 p-2"
                                                                            progress={this.state.submitting}
                                                                            scrollToTop={true}
                                                                            onClick={() => { this.saveSCO(this.state.consignmentItems[indexKey].id, batchVal.id) }}
                                                                        >
                                                                            <span className="capitalize">Submit</span>
                                                                        </Button>
                                                                        <IconButton aria-label="add">
                                                                            <AddCircleOutlineIcon onClick={() => this.setState({
                                                                                newConsignmentArray: [...this.state.newConsignmentArray, {
                                                                                    "id": value.id,
                                                                                    "mfd": value.mfd,
                                                                                    "exd": value.exd,
                                                                                    "batch_no": value.batch_no,
                                                                                    "unit_price": value.unit_price,
                                                                                    "quantity": value.quantity
                                                                                }]
                                                                            })}
                                                                            />
                                                                        </IconButton>
                                                                    </Grid>
                                                                </Grid>
                                                            )
                                                        })}
                                                        {this.state.consignmentArray.length > 0 && this.state.consignmentArray.map((value) => {
                                                            return value.id == batchVal.id && (
                                                                <Grid className="w-full flex-row justify-start mt-8 p-4" style={{ border: "1px solid gray" }} item lg={12} md={12} sm={12} xs={12}>
                                                                    <Grid
                                                                        className="flex-row justify-center" item lg={8} md={8} sm={12} xs={12}
                                                                    >
                                                                        <Grid className="flex justify-start w-full pl-10 mt-4" item>
                                                                            <SubTitle title={`Sample Ref Number : ${value.ref_no}`} />
                                                                        </Grid>
                                                                        <Grid className="flex justify-start w-full pl-10 mt-4" item>
                                                                        <SubTitle title={`Container Number: ${this.state.consignmentContainer.find((val) => value.container_id === val?.id)?.Vehicle?.reg_no || ''}`} />
                                                                        </Grid>
                                                                        <Grid className="flex justify-start w-full pl-10 mt-4" item>
                                                                            <SubTitle title={`Cartoon Number : ${value.cartoon_no || " "}`} />
                                                                        </Grid>
                                                                        <Grid className="flex justify-start w-full pl-10 mt-4" item>
                                                                            <SubTitle title={`Status : ${value.status}`} />
                                                                        </Grid>

                                                                        <Grid className="flex justify-start w-full pl-10 mt-4" item>
                                                                            <SubTitle title={`Attachments : `} />
                                                                            <IconButton
                                                                                className='mt-1'
                                                                                onClick={() => {
                                                                                    this.setState({
                                                                                        showUpload: true,
                                                                                        selectedForUpload: value.sample_id,
                                                                                    })

                                                                                }}
                                                                                size="small" aria-label="Upload">
                                                                                <AssignmentIcon />
                                                                            </IconButton>
                                                                        </Grid>


                                                                    </Grid>
                                                                </Grid>
                                                            )
                                                        })}
                                                    </div>
                                                </Collapse>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Collapse>
                            ))}
                        </div>
                    ))}
                </LoonsCard>
            </MainContainer>
            <LoonsSnackbar
                open={this.state.snackbar}
                onClose={() => {
                    this.setState({ snackbar: false })
                }}
                message={this.state.snackbar_message}
                autoHideDuration={3000}
                severity={this.state.snackbar_severity}
                elevation={2}
                variant="filled"
            ></LoonsSnackbar>

            <LoonsDialogBox
                title="Reference Number"
                show_alert={true}
                alert_severity="info"
                alert_message={this.state.infoMessage}
                body_children={
                    <Barcode
                        value={this.state.ref_no}
                        //value="15496344"
                        options={{
                            format: 'code128',
                            width: 2,
                            height: 25,
                            displayValue: true,
                            fontSize: 16
                        }}
                        renderer="svg" />
                }
                //message="testing 2"
                open={this.state.infoMessageAlert}
                //open={true}
                show_button={true}
                show_second_button={false}
                btn_label="Ok"
                onClose={() => {
                    //this.getConsignmentSamples();
                    //this.loadData(this.props.match.params.id);
                    this.setState({ infoMessageAlert: false, })
                    window.location.reload()
                }}

            >

            </LoonsDialogBox>



            <Dialog fullWidth maxWidth="lg " open={this.state.showUpload} >

                <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                    <CardTitle title="Attachments" />

                    <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ showUpload: false }) }}>
                        <CloseIcon />
                    </IconButton>

                </MuiDialogTitle>


                <SwasthaFilePicker

                    id="itemsamplefile"
                    singleFileEnable={false}
                    multipleFileEnable={true}
                    dragAndDropEnable={true}
                    tableEnable={true}

                    documentName={true}//document name enable
                    documentNameValidation={['required']}
                    documenterrorMessages={['this field is required']}
                    documentNameDefaultValue={null}//document name default value. if not value set null

                    type={false}
                    types={null}
                    typeValidation={null}
                    typeErrorMessages={null}
                    defaultType={null}// null

                    description={true}
                    //descriptionValidation={['required']}
                    //descriptionErrorMessages={['this field is required']}
                    defaultDescription={null}//null

                    onlyMeEnable={true}
                    defaultOnlyMe={false}

                    source="ConsignmentItemSample"
                    source_id={this.state.selectedForUpload}



                    //accept="image/png"
                    accept={null}

                    // maxFileSize={1048576}
                    // maxTotalFileSize={1048576}
                    // maxFilesCount={1}
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

                    // label="Select Attachment"
                    singleFileButtonText="Upload Data"
                // multipleFileButtonText="Select Files"



                ></SwasthaFilePicker>





            </Dialog>
        </Fragment>
        )
    }
}

export default withStyles(styleSheet)(TakeSample);