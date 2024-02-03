/*
Loons Lab Sub title component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from 'react'
import { Divider, Typography, Grid, Card } from '@material-ui/core'
import PropTypes from 'prop-types'
import FilesService from 'app/services/FilesService'
import * as apiroutes from '../../../../apiroutes'
import localStorageService from 'app/services/localStorageService'

import pdf from '../DocumentLoader/pdf.png'
import doc from '../DocumentLoader/doc.png'
import jpg from '../DocumentLoader/jpg.png'
import png from '../DocumentLoader/png.png'
import ppt from '../DocumentLoader/ppt.png'
import other from '../DocumentLoader/other.png'

class ImageView extends Component {
    /**
     how to use
     * 
     * var data = {
     *      path: '',
     *      extension: '',
     *      
     * }
     * 
     * <ImageView image_data={data} preview_width='100px'  preview_height='100px' />
     * 
     * **/
    constructor(props) {
        super(props)
        this.state = {
            image_data: this.props.image_data,
            image_url: '',
        }
    }

    static propTypes = {
        image_data: PropTypes.object,
        preview_width: PropTypes.string,
        preview_height: PropTypes.string,
        class_Name: PropTypes.string,
    }

    static defaultProps = {
        image_data: {},
        preview_width: '300px',
        preview_height: '300px',
        class_Name: '',
    }

    async componentDidMount() {

        const accessToken = await localStorageService.getItem('accessToken')
        if (this.state.image_data == null) {
            this.setState({
                image_url: '/assets/images/blank-profile.png',
            })
        } else {
            let uri =
                apiroutes.FILE_VIEW +
                `?url=` +
                this.state.image_data.path +
                `&type=view&extension=` +
                this.state.image_data.extension +
                ``
            // console.log("file url", uri)
            fetch(uri, { headers: { Authorization: `Bearer ${accessToken}` } }) // FETCH BLOB FROM IT
                .then((response) => response.blob())
                .then((blob) => {
                    // RETRIEVE THE BLOB AND CREATE LOCAL URL
                    var _url = window.URL.createObjectURL(blob)

                    this.setState({
                        image_url: _url,
                    })

                })
                .catch((err) => {
                    console.log(err)
                    this.setState({
                        image_url: '/assets/images/blank-profile.png',
                    })
                })
        }
    }

    render() {
        const { preview_width, preview_height, class_Name } = this.props

        return (
            <Fragment>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <img
                            className={class_Name}
                            src={this.state.image_url}
                            width={preview_width}
                            height={preview_height}
                        />
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

export default ImageView
