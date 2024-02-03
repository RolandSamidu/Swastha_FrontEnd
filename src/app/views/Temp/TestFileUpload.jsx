import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import {
    Card,
    TextField,
    MenuItem,
    IconButton,
    Icon,
    Grid,
    Button,
    FormControlLabel,
    Checkbox,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import { themeColors } from "app/components/MatxTheme/themeColors";
import LoonsTable from "app/components/LoonsLabComponents/Table/LoonsTable";
import { SwasthaFilePicker } from "app/components/LoonsLabComponents";


const styleSheet = ((theme) => ({

}));

class TestFileUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: { fileList: [] }

        }
    }

    async selectedFiles(data) {
        this.setState({ data: data }, () => {

        })
    }

    render() {
        let { theme } = this.props;
        const { classes } = this.props


        return (
            <Fragment>
                <Grid container>
                    < Grid item lg={6} md={6} sm={6}>

                        <div className="pb-24 pt-7 px-main-8 ">

                            <SwasthaFilePicker

                                id="file"
                                singleFileEnable={true}
                                multipleFileEnable={false}
                                dragAndDropEnable={true}
                                tableEnable={true}

                                documentName={true}//document name enable
                                documentNameValidation={['required']}
                                documenterrorMessages={['this field is required']}
                                documentNameDefaultValue="default name"//document name default value. if not value set null

                                type={true}
                                types={[{ label: "A", value: "a" }, { label: "B", value: "b" }]}
                                typeValidation={['required']}
                                typeErrorMessages={['this field is required']}
                                defaultType="a"// null

                                description={true}
                                descriptionValidation={['required']}
                                descriptionErrorMessages={['this field is required']}
                                defaultDescription="default description"//null

                                onlyMeEnable={true}
                                defaultOnlyMe={true}

                                source="consingment"
                                source_id="6f7744da-0b31-40bf-a2a1-efb0ae7921c0"



                                accept="image/png"
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
                                selectedFileList={
                                    this.state.data.fileList
                                }
                                // label="Select Attachment"
                                singleFileButtonText="Upload Data"
                            // multipleFileButtonText="Select Files"



                            ></SwasthaFilePicker>
                        </div>
                    </Grid>
                </Grid>
            </Fragment >

        );
    }
}

export default withStyles(styleSheet)(TestFileUpload);
