/*
Loons Lab Sub title component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import { Divider, Typography, Grid, Card } from '@material-ui/core'
import PropTypes from "prop-types";
import FilesService from "app/services/FilesService";
import * as apiroutes from "../../../../apiroutes";
import localStorageService from "app/services/localStorageService";


import pdf from '../SwasthaFilePicker/pdf.png';
import doc from '../SwasthaFilePicker/doc.png';
import jpg from '../SwasthaFilePicker/jpg.png';
import png from '../SwasthaFilePicker/png.png';
import ppt from '../SwasthaFilePicker/ppt.png';
import other from '../SwasthaFilePicker/other.png';

class DocumentLoader extends Component {
    static propTypes = {
        files: PropTypes.array
    };

    static defaultProps = {
        files: []
    };

    async clickImage(url, extention) {

        const accessToken = await localStorageService.getItem("accessToken");
        let uri = apiroutes.COMMON_UPLOAD_FILE_VIEW + `?url=` + url + `&type=view&extension=` + extention + ``;
        console.log("file url", uri)
        fetch(uri, { headers: { Authorization: `Bearer ${accessToken}` } }) // FETCH BLOB FROM IT
            .then((response) => response.blob())
            .then((blob) => { // RETRIEVE THE BLOB AND CREATE LOCAL URL
                var _url = window.URL.createObjectURL(blob);
                window.open(_url, "_blank").focus(); // window.open + focus
            }).catch((err) => {
                console.log(err);
            });


    }

    getFileimage(extension) {
        if (extension == "image/png") {
            return png;
        } else if (extension == "image/jpg" || extension == "image/jpeg") {
            return jpg;
        } else if (extension == "application/pdf") {
            return pdf;
        } else if (extension == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || extension == "application/msword") {
            return doc;
        } else if (extension == "application/vnd.openxmlformats-officedocument.presentationml.presentation" || extension == "application/vnd.ms-powerpoint") {
            return ppt;
        } else {
            return other;
        }
    }

    render() {
        const {
            files
        } = this.props;


        return (
            <Fragment>
                {files.length > 0 ?
                    <Grid container spacing={1} >
                        <div className="mt-5 w-full">
                            <Grid
                                className="w-full"
                                container
                                //spacing={2}
                                justify="center"
                                alignItems="center"
                                direction="row"
                            >
                                <Grid className="text-center" item lg={2} md={2}>
                                    File
                                </Grid>
                                <Grid className="text-center" item lg={4} md={4}>
                                    Name
                                </Grid>

                                <Grid className="text-center" item lg={6} md={6}>
                                    description
                                </Grid>

                            </Grid>
                        </div>

                        {
                            files.map((item, i) => {/* <Grid item key={i}>
                                <Grid className="image_hover flex p-1" onClick={() => { this.clickImage(item.path, item.extension) }}>
                                    <img style={{ height: 40 }} src={this.getFileimage(item.extension)} alt="file" />
                                    <p>{item.name}</p>
                                </Grid>
                            </Grid> */
                                return (
                                    <Grid
                                        className="w-full"
                                        container
                                        //spacing={2}
                                        justify="center"
                                        alignItems="center"
                                        direction="row"
                                    >
                                        <Grid className="text-center" item lg={2} md={2}>
                                            <Grid className="image_hover flex p-1" onClick={() => { this.clickImage(item.path, item.extension) }}>
                                                <img style={{ height: 40 }} src={this.getFileimage(item.extension)} alt="file" />

                                            </Grid>
                                        </Grid>
                                        <Grid className="text-center" item lg={4} md={4}>
                                            <p>{item.name}</p>
                                        </Grid>

                                        <Grid className="text-center" item lg={6} md={6}>
                                            <p>{item.description}</p>
                                        </Grid>



                                    </Grid>

                                )

                            }






                            )

                        }
                    </Grid>
                    : <Grid className="text-center" item >
                        <p className="px-4 text-center">There is No Any Uploaded Files</p>
                        </Grid>}
            </Fragment >
        );
    }
}

export default DocumentLoader;