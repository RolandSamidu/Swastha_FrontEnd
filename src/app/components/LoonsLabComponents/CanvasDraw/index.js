/*
Loons Lab Button component
Developed By Roshan
Loons Lab
*/
import React, { Component, Fragment } from "react";
import { Tooltip, Grid } from '@material-ui/core'
import { Button } from "app/components/LoonsLabComponents";
import BackspaceOutlinedIcon from '@material-ui/icons/BackspaceOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import UndoOutlinedIcon from '@material-ui/icons/UndoOutlined';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from "prop-types";
import CanvasDraw from "react-canvas-draw";
import defaultimg from '../CanvasDraw/Lungs.png';

class Canvas extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        height: PropTypes.number,
        width: PropTypes.number,

    };

    static defaultProps = {
        className: "",
        height: 400,
        width: 400,


    };

    combineDrawing(canvasRef) {
        const width = canvasRef.props.canvasWidth;
        const height = canvasRef.props.canvasHeight;
        const background = canvasRef.canvasContainer.children[0];
        const drawing = canvasRef.canvasContainer.children[1];
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // composite now
        canvas.getContext('2d').drawImage(background, 0, 0);
        canvas.getContext('2d').globalAlpha = 1.0;
        canvas.getContext('2d').drawImage(drawing, 0, 0);

        const dataUri = canvas.toDataURL('image/jpeg', 1.0);
        const data = dataUri.split(',')[1];
        const mimeType = dataUri.split(';')[0].slice(5);

        const bytes = window.atob(data);
        const buf = new ArrayBuffer(bytes.length);
        const arr = new Uint8Array(buf);

        for (let i = 0; i < bytes.length; i++) {
            arr[i] = bytes.charCodeAt(i);
        }

        const blob = new Blob([arr], { type: mimeType });
        return { blob: blob, dataUri: dataUri };
    }

    saveImage(blob, filename) {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';

        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }


    render() {
        const {
            width, height
            // icon
        } = this.props;


        return (

            <Fragment>
                <Grid className="flex justify-end" item lg={12} md={12} sm={12} xs={12}>

                    <Tooltip title="Undo">
                        <UndoOutlinedIcon
                            onClick={() => {
                                this.saveableCanvas.undo();
                            }}
                            className="cursor-pointer mx-1" color="action" />
                    </Tooltip>

                    <Tooltip title="Erase All">
                        <DeleteForeverOutlinedIcon
                            onClick={() => {
                                this.saveableCanvas.eraseAll();
                            }}
                            className="cursor-pointer mx-1" color="action" />
                    </Tooltip>

                    <Tooltip title="Download Image">
                        <SaveOutlinedIcon
                            onClick={() => {
                                const { blob, dataUri } = this.combineDrawing(this.saveableCanvas);
                                this.saveImage(blob, 'test.jpg')
                            }}
                            className="cursor-pointer mx-1" color="action" />
                    </Tooltip>







                </Grid>
                <Grid
                    style={{ width: width, height: height }}
                    container className="px-1 pt-3 px-2" >
                    {/*  <Grid className="px-1 pl-2" item lg={11} md={11} sm={10} xs={10}>

                    </Grid> */}

                    <CanvasDraw
                        style={{ width: '100%', height: '100%' }}
                        ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
                        brushColor={'red'}
                        imgSrc={defaultimg}
                        brushRadius={2}
                        lazyRadius={12}
                        enablePanAndZoom={true}

                    //canvasWidth={width}
                    //canvasHeight={height}
                    />
                </Grid>



            </Fragment>

        );
    }
}

export default Canvas;