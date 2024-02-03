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
import { Fab, Icon, Card, Grid, Divider, Button, IconButton, Tooltip } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import OutlinedDiv from "../OutlinedDiv";
import clsx from 'clsx'
import PropTypes from "prop-types";

class LoonsFilePicker extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
        selectedFileList: PropTypes.array
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
        label: "Select Attachment",
        className: '',
        validators: null,
        errorMessages: null,
        accept: null,
        documentName: false,
        documentNameValidation: null,
        documenterrorMessages: null,
        selectedFileList: null


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
        let fileList = selectedFileList;

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
        // this.setState({ files: fileList }, () => { /* console.log("files", this.state.files) */ })
        this.addValidator()
    }

    handleDragOver = (event) => {
        //event.preventDefault()
        this.setState({ dragClass: 'drag-shadow' });
    }

    //Drag event
    handleDrop = (event) => {
        const { selectedFiles, accept, selectedFileList } = this.props;
        event.preventDefault()
        event.persist()

        let files = event.dataTransfer.files
        let fileList = selectedFileList;

        if (accept !== null) {
            let acceptFilesTypes = accept.split(',');

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
        //this.setState({ files: fileList }, () => { /* console.log("files", this.state.files) */ })
        selectedFiles &&
            selectedFiles({
                fileList
            });
        this.addValidator()
        return false
    }

    handleDragStart = (event) => {
        this.setState({ dragClass: 'drag-shadow' });
    }

    //remove single file
    handleSingleRemove = (index) => {
        const { selectedFiles, selectedFileList } = this.props;
        let fileList = selectedFileList;
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
            selectedFileList.map((item, index) => {
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
            selectedFileList.map((item, index) => {

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
            if (parseInt(maxFilesCount) < selectedFileList.length) {
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
    componentDidMount() {
        this.addValidator()
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
            selectedFileList,
            id
        } = this.props;


        return (
            <OutlinedDiv
                className={className}
                label={label}
                validators={validators}
                value={selectedFileList.length == 0 ? null : selectedFileList.length}
                errorMessages={errorMessages}>
                <div>
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
                                {selectedFileList.length == 0 ? (
                                    <span>Drop your files here</span>
                                ) : (
                                    <h5 className="m-0">
                                        {selectedFileList.length} file{selectedFileList.length > 1 ? 's' : ''}{' '}
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

                                {selectedFileList.length == 0 && <p className="px-4 text-center">Que is empty</p>}

                                <div className="max-h-100 overflow-auto scroll-y">
                                    {selectedFileList.map((item, index) => {
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

                                                    {documentName ?
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
                                                        : null}

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




                </div >
            </OutlinedDiv>
        );
    }
}

export default LoonsFilePicker;