import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    FormControlLabel,
    Hidden,
    RadioGroup,
    Radio,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import ClinicService from 'app/services/ClinicService'
import PatientServices from 'app/services/PatientServices'
import PatientClinicService from 'app/services/PatientClinicService'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { DateTimePicker } from '@material-ui/pickers'
import localStorageService from 'app/services/localStorageService';
import DashboardServices from 'app/services/DashboardServices';
import {
    Button,
    CardTitle,
    SubTitle,
    ImageView,
    DatePicker,
    CheckboxValidatorElement,
    LoonsSnackbar,
    LoonsCard,
    SwasthaFilePicker
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import { dateParse, timeParse, dateTimeParse } from "utils";
import moment from "moment";
import DocumentLoader from 'app/components/LoonsLabComponents/DocumentLoader'

import pdf from '../RefferenceFiles/pdf.png';
import doc from '../RefferenceFiles/doc.png';
import jpg from '../RefferenceFiles/jpg.png';
import png from '../RefferenceFiles/png.png';
import ppt from '../RefferenceFiles/ppt.png';
import other from '../RefferenceFiles/other.png';


import Pdf from '../RefferenceFiles/documents/BNF_82.pdf';
import Pdf2 from '../RefferenceFiles/documents/Joint_Formulary.pdf';

import myPdf from '../RefferenceFiles/documents/hypertension-in-adults.pdf';
import mypdf2 from '../RefferenceFiles/documents/ADA-Guideline-2022.pdf';

const styleSheet = (theme) => ({})

class Refferences extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loginUserRoles: [],
            loginUserHospital: null,
            loaded: false
        }
    }

    async componentDidMount() {
        let userInfo = await localStorageService.getItem("userInfo")
        let main_hospital_id = await localStorageService.getItem("main_hospital_id")
        console.log("hospital id", main_hospital_id)

        this.setState({ loginUserRoles: userInfo.roles, loginUserHospital: main_hospital_id, loaded: true })

    }




    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>

                {this.state.loaded ?
                    <Grid className='p-10' container spacing={3}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                           <LoonsCard>
                                <CardTitle title={"Shared With Me"} />
                                <div className="pt-7 px-main-8 ">
                                    <SwasthaFilePicker
                                        uploadingSectionVisibility={this.state.loginUserRoles.includes('Hospital Admin')}
                                        id="file_public"
                                        singleFileEnable={true}
                                        multipleFileEnable={false}
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
                                        descriptionValidation={null}
                                        descriptionErrorMessages={null}
                                        defaultDescription={null}//null

                                        onlyMeEnable={false}
                                        defaultOnlyMe={false}

                                        source="public_refferences"
                                        source_id={this.state.loginUserHospital}



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
                                </div>

                            </LoonsCard>

                        </Grid>

                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <LoonsCard>
                                <CardTitle title={"My Uploads"} />
                                <div className="pt-7 px-main-8 ">
                                    <SwasthaFilePicker

                                        id="file_onlyme"
                                        only_my={true}
                                        singleFileEnable={true}
                                        multipleFileEnable={false}
                                        dragAndDropEnable={true}
                                        tableEnable={true}

                                        documentName={true}//document name enable
                                        documentNameValidation={['required']}
                                        documenterrorMessages={['this field is required']}
                                        documentNameDefaultValue={null}//document name default value. if not value set null

                                        type={false}
                                        //types={[{ label: "A", value: "a" }, { label: "B", value: "b" }]}
                                        //typeValidation={['required']}
                                        //typeErrorMessages={['this field is required']}
                                        //defaultType="a"// null

                                        description={true}
                                        descriptionValidation={null}
                                        descriptionErrorMessages={null}
                                        defaultDescription={null}//null

                                        onlyMeEnable={false}
                                        defaultOnlyMe={true}

                                        source="refferences"
                                        source_id={this.state.loginUserHospital}



                                        accept={null}
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
                                </div>
                            </LoonsCard>
                        </Grid>

                    </Grid>
                    : null}

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

            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(Refferences)
