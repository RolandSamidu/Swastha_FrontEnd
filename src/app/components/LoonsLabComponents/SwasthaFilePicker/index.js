/*
Loons Lab File picker component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import { Breadcrumb, SimpleCard, MatxProgressBar } from 'app/components'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import {
    Fab, Icon, Card, Grid, Divider, IconButton, Tooltip, Button, FormControlLabel,
    Checkbox, Typography
} from '@material-ui/core'
import { Autocomplete } from "@material-ui/lab";
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import { LoonsSnackbar, SubTitle } from "app/components/LoonsLabComponents";
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import OutlinedDiv from "../OutlinedDiv";
import clsx from 'clsx'
import PropTypes from "prop-types";
import localStorageService from "app/services/localStorageService";
import CloudServices from "app/services/CloudServices"
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import DocumentLoader from "./DocumentLoader";

class SwasthaFilePicker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: '',
            severity: 'success',

            data: {
                name: this.props.documentNameDefaultValue != null ? this.props.documentNameDefaultValue : null,
                type: this.props.defaultType != null ? this.props.defaultType : null,
                description: this.props.defaultDescription != null ? this.props.defaultDescription : null,
                only_me: this.props.defaultOnlyMe,
                upload_by: null,
                source: this.props.source,
                source_id: this.props.source_id,
                owner_id: null,

                file: []
            },
            files: [],
            queProgress: 0,
            dragClass: '',
        }
    }
    static propTypes = {
        selectedFiles: PropTypes.func,
        singleFileEnable: PropTypes.bool,
        multipleFileEnable: PropTypes.bool,
        dragAndDropEnable: PropTypes.bool,
        tableEnable: PropTypes.bool,
        singleFileButtonText: PropTypes.string,
        multipleFileButtonText: PropTypes.string,
        label: PropTypes.string,
        className: PropTypes.string,
        maxFileSize: PropTypes.number,
        maxTotalFileSize: PropTypes.number,
        maxFilesCount: PropTypes.number,
        validators: PropTypes.array,
        errorMessages: PropTypes.array,
        accept: PropTypes.string,
        documentName: PropTypes.bool,
        documentNameValidation: PropTypes.array,
        documenterrorMessages: PropTypes.array,

        type: PropTypes.bool,
        typeValidation: PropTypes.array,
        typeErrorMessages: PropTypes.array,
        types: PropTypes.any,

        description: PropTypes.bool,
        descriptionValidation: PropTypes.array,
        descriptionErrorMessages: PropTypes.array,

        selectedFileList: PropTypes.array,
        only_my:PropTypes.bool
    };

    static defaultProps = {
        singleFileEnable: true,
        multipleFileEnable: true,
        dragAndDropEnable: true,
        tableEnable: true,
        singleFileButtonText: "Select File",
        multipleFileButtonText: "Select Files",
        maxFileSize: null,
        maxTotalFileSize: null,
        maxFilesCount: null,
        label: "Attachment",
        className: '',
        validators: null,
        errorMessages: null,
        accept: null,
        documentName: false,
        documentNameValidation: null,
        documenterrorMessages: null,

        type: false,
        typeValidation: null,
        typeErrorMessages: null,
        types: null,

        description: false,
        descriptionValidation: null,
        descriptionErrorMessages: null,

        onlyMeEnable: false,

        selectedFileList: null,

        uploadProcess: false,

        uploadedFiles: null,
        uploadingSectionVisibility: true,
        only_my:false


    };

    addDocumentName = (value, index) => {
        const { selectedFiles, selectedFileList } = this.props;
        let fileList = selectedFileList;

        fileList[index].document_name = value;

        selectedFiles &&
            selectedFiles({
                fileList
            });
        this.setState({ files: fileList }, () => { })
    }

    handleDateChange = date => {
        const { onChange } = this.props;
        onChange &&
            onChange({
                date
            });
    };

    //File select function
    handleFileSelect = event => {
        const { selectedFiles, selectedFileList } = this.props;
        let files = event.target.files
        let fileList = this.state.files;

        console.log("files", fileList)
        for (const iterator of files) {
            fileList.push({
                file: iterator,
                uploading: false,
                error: false,
                document_name: "",
            })
        }
        selectedFiles &&
            selectedFiles({
                fileList
            });
        this.setState({ files: fileList }, () => { /* console.log("files", this.state.files) */ })
        this.addValidator()
    }

    handleDragOver = (event) => {
        event.preventDefault()
        this.setState({ dragClass: 'drag-shadow' });
    }

    //Drag event
    handleDrop = (event) => {
        const { selectedFiles, accept, selectedFileList } = this.props;
        event.preventDefault()
        event.persist()

        let files = event.dataTransfer.files
        let fileList = this.state.files;
        console.log("file", files)
        if (accept !== null) {
            let acceptFilesTypes = accept.split(',');
            console.log("file", acceptFilesTypes)
            for (const iterator of files) {


                if (acceptFilesTypes.find((r) => r === iterator.type)) {
                    fileList.push({
                        file: iterator,
                        uploading: false,
                        error: false,
                        document_name: "",
                    })
                }

            }
        } else {
            for (const iterator of files) {
                fileList.push({
                    file: iterator,
                    uploading: false,
                    error: false,
                    document_name: "",
                })
            }
        }


        this.setState({ dragClass: '' })
        this.setState({ files: fileList }, () => { /* console.log("files", this.state.files) */ })
        selectedFiles &&
            selectedFiles({
                fileList
            });
        this.addValidator()
        return false
    }

    handleDragStart = (event) => {
        console.log("okk")
        this.setState({ dragClass: 'drag-shadow' });
    }

    //remove single file
    handleSingleRemove = (index) => {
        const { selectedFiles, selectedFileList } = this.props;
        let fileList = this.state.files;
        fileList.splice(index, 1)
        this.setState({ files: fileList })
        selectedFiles &&
            selectedFiles({
                fileList
            });


        this.addValidator()
    }

    //Remove all files
    handleAllRemove = () => {
        const { selectedFiles } = this.props;
        let fileList = [];
        this.setState({ files: [], queProgress: 0 })
        selectedFiles &&
            selectedFiles({
                fileList
            });
        this.addValidator()
    }

    renderChildren = (label, children) => {

        if (label) {
            return label;
        }

        if (children) {
            return children;
        }
    };

    addValidator = () => {
        const { maxFileSize, maxTotalFileSize, maxFilesCount, selectedFileList } = this.props;
        var requiredValidation = true;
        var validation = true;
        var totalFileValidation = true;
        var tooManyValidation = true;
        var totalFilesSize = 0;


        //Validate file single file size
        ValidatorForm.addValidationRule('maxSize', (value) => {
            this.state.files.map((item, index) => {
                let { file, uploading, error, progress } = item

                //console.log("file size", file.size)
                //console.log("max file size", maxFileSize)
                totalFilesSize = totalFilesSize + parseInt(file.size);
                if (parseInt(maxFileSize) < parseInt(file.size)) {
                    validation = false;
                }
            })
            return validation;

            /* if (value !== "") {
                return false
            }
            return true */
        })

        //Validate total file size
        ValidatorForm.addValidationRule('maxTotalFileSize', (value) => {
            this.state.files.map((item, index) => {

                let { file, uploading, error, progress } = item
                //console.log("file size", file.size)
                //console.log("max file size", maxFileSize)
                totalFilesSize = totalFilesSize + parseInt(file.size);
                if (parseInt(maxTotalFileSize) < totalFilesSize) {
                    totalFileValidation = false;
                }
            })
            return totalFileValidation;
        })


        //For validate max file cout 
        ValidatorForm.addValidationRule('maxFileCount', (value) => {
            if (parseInt(maxFilesCount) < this.state.files.length) {
                tooManyValidation = false;
            }
            return tooManyValidation;
        })

        //return () => ValidatorForm.removeValidationRule('maxSize');
    }

    componentWillUnmount() {
        // remove rule when it is not needed
        ValidatorForm.removeValidationRule('maxSize');
        ValidatorForm.removeValidationRule('maxTotalFileSize');
        ValidatorForm.removeValidationRule('maxFileCount');

    }


    async loadUploadedFiles() {
        let userInfo = await localStorageService.getItem("userInfo")
        let owner_id = await localStorageService.getItem("owner_id")
        let userId = userInfo.id

        let data = this.state.data;

        let params = { source: data.source, source_id: data.source_id,only_my:this.props.only_my}
        if(this.props.only_my){
            params.upload_by =userId 
        }
        //let params = {}

        let res = await CloudServices.getDocouments(params)
        console.log("doc", res)
        let uplodedDoc = []
        if (res.status == 200) {
            res.data.view.data.forEach(element => {
                uplodedDoc.push({
                    extension: element.extension,
                    file_name: element.file_name,
                    path: element.path,
                    name: element.FileUpload.name,
                    description: element.FileUpload.description,
                    uploadedBy: element.FileUpload.Employee.name

                })
            });
        }

        this.setState({ uploadedFiles: uplodedDoc })

    }




    componentDidMount() {
        this.addValidator()
        this.loadUploadedFiles()
    }
    async submit() {
        this.setState({ uploadProcess: true })
        let userInfo = await localStorageService.getItem("userInfo")
        let owner_id = await localStorageService.getItem("owner_id")
        let userId = userInfo.id
        let data = this.state.data;
        let files = this.state.files



        var form_data = new FormData();
        form_data.append(`name`, data.name)
        form_data.append(`type`, data.type)
        form_data.append(`description`, data.description)
        form_data.append(`upload_by`, userId)
        form_data.append(`only_me`, data.only_me)
        form_data.append(`owner_id`, owner_id)
        form_data.append(`source`, data.source)
        form_data.append(`source_id`, data.source_id)

        if (files.length > 0) {

            files.map((element) => (
                form_data.append('file', element.file)
            ))

        }

        let res = await CloudServices.uploadFiles(form_data)
        console.log("Data", res)
        if (res.status == 201) {
            this.setState({
                alert: true,
                message: 'File has been Uploaded Successfully.',
                severity: 'success',
                uploadProcess: false
            }, () => { this.loadUploadedFiles() })
        } else {
            this.setState({
                alert: true,
                message: 'Cannot Upload File ',
                severity: 'error',
                uploadProcess: false
            })
        }

    }

    render() {
        const {
            singleFileEnable,
            multipleFileEnable,
            dragAndDropEnable,
            tableEnable,
            label,
            singleFileButtonText,
            multipleFileButtonText,
            className,
            validators,
            errorMessages,
            accept,
            documentName,
            documentNameValidation,
            documenterrorMessages,

            type,
            typeValidation,
            typeErrorMessages,
            types,

            description,
            descriptionValidation,
            descriptionErrorMessages,

            onlyMeEnable,

            selectedFileList,
            uploadingSectionVisibility,
            id
        } = this.props;


        return (
            <ValidatorForm onSubmit={() => this.submit()} onError={() => null}>
                <OutlinedDiv
                    className={className}
                    label={label}
                    validators={validators}
                    value={this.state.files.length == 0 ? null : this.state.files.length}
                    errorMessages={errorMessages}>
                    <Grid container>
                        {uploadingSectionVisibility ?
                            < Grid className="mt-1" item lg={6} md={6} sm={6}>

                                <Grid container spacing={1}>
                                    {documentName ?
                                        < Grid className="mt-1" item lg={6} md={6} sm={6}>
                                            <TextValidator
                                                className=" w-full"
                                                label="Document Name"
                                                onChange={(e) => {
                                                    let data = this.state.data
                                                    data.name = e.target.value
                                                    this.setState({ data })
                                                }}
                                                type="text"
                                                value={this.state.data.name}
                                                name="document_name"
                                                variant="outlined"
                                                size="small"
                                                validators={documentNameValidation}
                                                errorMessages={documenterrorMessages}
                                            />
                                        </Grid>
                                        : null
                                    }

                                    {type ?
                                        < Grid className="mt-1" item lg={6} md={6} sm={6}>
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={types}
                                                value={types.find((v) => v.value === this.state.data.type)}
                                                onChange={(e, value) => {
                                                    if (null != value) {
                                                        this.setState({
                                                            data: {
                                                                ...this.state.data,
                                                                type: value.value
                                                            },
                                                        })
                                                    }
                                                }}

                                                getOptionLabel={(option) =>
                                                    option.label ? option.label : ''
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        value={types.find((v) => v.value === this.state.data.type)}
                                                        {...params}
                                                        placeholder="Type"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        validators={typeValidation}
                                                        errorMessages={typeErrorMessages}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        : null}

                                    {description ?
                                        < Grid className="mt-1" item lg={6} md={6} sm={6}>
                                            <TextValidator
                                                className=" w-full"
                                                label="Description"
                                                onChange={(e) => {
                                                    let data = this.state.data
                                                    data.description = e.target.value
                                                    this.setState({ data })
                                                }}
                                                type="text"
                                                value={this.state.data.description}
                                                multiline
                                                rows={3}
                                                name="description"
                                                variant="outlined"
                                                size="small"
                                                validators={descriptionValidation}
                                                errorMessages={descriptionErrorMessages}
                                            />
                                        </Grid>
                                        : null
                                    }

                                    {onlyMeEnable ?
                                        < Grid className="mt-1" item lg={6} md={6} sm={6}>
                                            <FormControlLabel
                                                label="Only Me"
                                                name="only_me"
                                                value={false}
                                                onChange={() => {
                                                    let data = this.state.data
                                                    data.only_me = !data.only_me;
                                                    this.setState({ data })
                                                }}
                                                //defaultValue = 'normal'
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={this.state.data.only_me}
                                                        size="small"
                                                    />
                                                }
                                                display="inline"
                                            />
                                        </Grid>
                                        : null}

                                </Grid>

                                <div className="mt-5"></div>
                                {/* File Drag and drop ******************************************** */}

                                {
                                    dragAndDropEnable ?
                                        <div
                                            className={clsx(
                                                ' w-full border-radius-4 bg-light-gray mb-2 flex justify-center items-center border-color-primary',
                                                this.state.dragClass
                                            )}
                                            style={{ borderStyle: 'dashed', borderWidth: 1, height: 92 }}
                                            onDragEnter={this.handleDragStart}
                                            onDragOver={this.handleDragOver}
                                            onDrop={this.handleDrop}
                                        >
                                            {this.state.files.length == 0 ? (
                                                <span>Drop your files here</span>
                                            ) : (
                                                <h5 className="m-0">
                                                    {this.state.files.length} file{this.state.files.length > 1 ? 's' : ''}{' '}
                                                    selected...
                                                </h5>
                                            )}
                                        </div>
                                        : null
                                }


                                <div className="flex flex-wrap mb-2">
                                    {/* Single file select ******************************************** */}
                                    {singleFileEnable ?
                                        <div>
                                            <label htmlFor={"single" + id}>
                                                <Button component="span" variant="outlined" color="primary">
                                                    <div className="flex items-center">
                                                        <Icon className="pr-8">cloud_upload</Icon>
                                                        <span>{singleFileButtonText}</span>
                                                    </div>
                                                </Button>
                                            </label>


                                            <input
                                                className="hidden"
                                                onChange={this.handleFileSelect}
                                                id={"single" + id}
                                                type="file"
                                                accept={accept}
                                            />


                                        </div>
                                        : null}

                                    {singleFileEnable ?
                                        <div className="px-2"></div>
                                        : null
                                    }
                                    {/* Multiple file select ********************************* */}
                                    {multipleFileEnable ?
                                        <div>
                                            <label htmlFor={"multiple" + id}>
                                                <Button component="span" variant="outlined" color="primary">
                                                    <div className="flex items-center">
                                                        <Icon className="pr-8">cloud_upload</Icon>
                                                        <span>{multipleFileButtonText}</span>
                                                    </div>
                                                </Button>
                                            </label>
                                            <input
                                                className="hidden"
                                                onChange={this.handleFileSelect}
                                                id={"multiple" + id}
                                                type="file"
                                                multiple
                                                accept={accept}
                                            />
                                        </div>
                                        : null}
                                </div>



                                {/* Table ********************************* */}

                                {
                                    tableEnable ?
                                        <Card className="mb-0" elevation={2}>
                                            <div className="p-1">
                                                <Grid
                                                    container
                                                    //spacing={2}
                                                    justify="center"
                                                    alignItems="center"
                                                    direction="row"
                                                >
                                                    <Grid className="text-center" item lg={documentName ? 4 : 6} md={documentName ? 4 : 6}>
                                                        File
                                                    </Grid>
                                                    <Grid className="text-center" item lg={documentName ? 2 : 3} md={documentName ? 2 : 3}>
                                                        Size
                                                    </Grid>
                                                    {documentName ?
                                                        <Grid className="text-center" item lg={4} md={4}>
                                                            document name
                                                        </Grid>
                                                        : null
                                                    }

                                                    <Grid className="text-center" item lg={documentName ? 1 : 2} md={documentName ? 1 : 2}>
                                                        Action
                                                    </Grid>
                                                </Grid>
                                            </div>
                                            <Divider></Divider>

                                            {this.state.files.length == 0 && <p className="px-4 text-center">Que is empty</p>}

                                            <div className="max-h-100 overflow-auto scroll-y">
                                                {this.state.files.map((item, index) => {
                                                    let { file, uploading, error, document_name } = item
                                                    return (
                                                        <div className="px-2 py-2" key={file.name}>
                                                            <Grid
                                                                container
                                                                spacing={2}
                                                                justify="center"
                                                                alignItems="center"
                                                                direction="row"
                                                            >
                                                                <Grid className="text-center overflow-hidden" item lg={documentName ? 4 : 6} md={documentName ? 4 : 6} sm={documentName ? 4 : 6} >
                                                                    {file.name}
                                                                </Grid>
                                                                <Grid className="text-center" item lg={documentName ? 2 : 3} md={documentName ? 2 : 3} sm={documentName ? 2 : 3}>
                                                                    {(file.size / 1024 / 1024).toFixed(1)}{' '}
                                                                    MB
                                                                </Grid>

                                                                {/*  {documentName ?
                                                        <Grid item lg={4} md={4} sm={4}>
                                                            <TextValidator
                                                                className=" w-full"
                                                                label="Document Name"
                                                                onChange={(e) => this.addDocumentName(e.target.value, index)}
                                                                type="text"
                                                                value={document_name}
                                                                name="document_name"
                                                                variant="outlined"
                                                                size="small"
                                                                validators={documentNameValidation}
                                                                errorMessages={documenterrorMessages}
                                                            />
                                                        </Grid>
                                                        : null} */}

                                                                <Grid item lg={documentName ? 1 : 2} md={documentName ? 1 : 2} sm={documentName ? 1 : 2}>
                                                                    <Grid container justify="center"  >
                                                                        <Grid item>
                                                                            <Tooltip title="Delete selected file">
                                                                                <IconButton
                                                                                    onClick={() => this.handleSingleRemove(index)}
                                                                                    size="small" aria-label="delete">
                                                                                    <DeleteForeverOutlinedIcon className="text-error" />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </Grid>


                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>

                                                            {/**End of File picker */}
























                                                        </div>
                                                    )
                                                })}

                                            </div>
                                        </Card>
                                        : null
                                }


                                <LoonsButton
                                    className="mt-2 mr-2"
                                    progress={this.state.uploadProcess}
                                    type="submit"
                                    scrollToTop={true}
                                    startIcon="save"
                                //onClick={this.handleChange}
                                >
                                    Submit
                                </LoonsButton>



                            </Grid>
                            : null}

                        < Grid className="mt-1 px-3" item lg={uploadingSectionVisibility?6:12} md={uploadingSectionVisibility?6:12} sm={12}>

                            <Typography variant="h6" className="font-semibold">Uploaded Files</Typography>
                            <Divider />
                            <DocumentLoader files={this.state.uploadedFiles}></DocumentLoader>
                        </Grid>





                    </Grid >
                </OutlinedDiv>

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
            </ValidatorForm >
        );
    }
}

export default SwasthaFilePicker;