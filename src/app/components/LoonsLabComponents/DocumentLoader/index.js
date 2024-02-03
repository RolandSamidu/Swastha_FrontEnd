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


import pdf from '../DocumentLoader/pdf.png';
import doc from '../DocumentLoader/doc.png';
import jpg from '../DocumentLoader/jpg.png';
import png from '../DocumentLoader/png.png';
import ppt from '../DocumentLoader/ppt.png';
import other from '../DocumentLoader/other.png';

class DocumentLoader extends Component {
    static propTypes = {
        files: PropTypes.array
    };

    static defaultProps = {
        files: []
    };

    async clickImage(url, extention) {

        const accessToken = await localStorageService.getItem("accessToken");
        let uri = apiroutes.FILE_VIEW + `?url=` + url + `&type=view&extension=` + extention + ``;
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
                <Grid container spacing={1} >
                    {
                        files.map((item, i) =>
                            <Grid item key={i}>
                                <Grid className="image_hover flex p-1" onClick={() => { this.clickImage(item.url, item.extension) }}>
                                    <img style={{ height: 40 }} src={this.getFileimage(item.extension)} alt="file" />
                                    <p>{item.filename}</p>
                                </Grid>
                            </Grid>
                        )

                    }
                </Grid>
            </Fragment>
        );
    }
}

export default DocumentLoader;