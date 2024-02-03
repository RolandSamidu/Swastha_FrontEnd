/*
Loons Lab Button component
Developed By Roshan
Loons Lab
*/
import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";

import { Button } from '@material-ui/core'
import Icon from '@material-ui/core/Icon';

import PropTypes from "prop-types";
import { scrollToTop } from "utils";
import { LoonsTable } from "app/components/LoonsLabComponents";

import { ListItemAvatar } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Tooltip from '@material-ui/core/Tooltip';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const styleSheet = ((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));
class ExcelToTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            rowdata: [

            ],
            processing: true,

            columns: [],
            haserror: false,
            tableOpen: false
        }
    }
    static propTypes = {
        file: PropTypes.any,
        schema: PropTypes.object,
        duplicateChackColumn: PropTypes.array,
        requiredColumn: PropTypes.array,
        filedata: PropTypes.func
    };

    static defaultProps = {
        file: {},
        schema: {},
        tableData: [],
        duplicateChackColumn: [],
        requiredColumn: []
    };


    chackErrors() {//check table has errors

        const { file, schema, duplicateChackColumn, handleChangeCell, requiredColumn } = this.props;
        let data = this.state.rowdata;
        console.log("checking data", data)
        var haserror = false;

        duplicateChackColumn.map(function (item) {
            let result = data.map(a => a[item]);
            if (result.length !== new Set(result).size) {
                haserror = true;
            }

        });

        requiredColumn.map(function (item) {

            data.map(function (row) {
                if (row[item] == "" || row[item] == undefined || row[item] == null) {
                    haserror = true;
                }
            });

        });


        this.setState({ haserror }, () => {
            var keys = Object.keys(schema);
            console.log("has error", haserror)
            let data = { "row": 0, "column": keys[0], "data": this.state.rowdata[0][keys[0]] }
            handleChangeCell &&
                handleChangeCell({
                    data
                });
        }
        )
    }


    makeTableColumn(rowdata) {

        const { file, schema, duplicateChackColumn, requiredColumn, handleChangeCell } = this.props;
        let columns = [];
        var keys = Object.keys(schema);

        keys.map(function (item, index) {

            columns.push({
                name: item,
                label: item,
                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        // console.log("val", tableMeta.rowIndex, tableMeta.tableData.slice(1, tableMeta.rowIndex))
                        var valueArr = [];
                        const { rowIndex: r, columnIndex: c, currentTableData } = tableMeta;

                        if (requiredColumn.includes(item) && (value == "" || value == null)) {
                            return (
                                <Tooltip title="Value is empty">
                                    <TextValidator
                                        style={{ backgroundColor: '#ff8000' }}
                                        className=" w-full"
                                        //label="Instructions by"
                                        onChange={event => {
                                            //updateValue(event.target.value)
                                            let data = { "row": tableMeta.rowIndex, "column": item, "data": event.target.value }
                                            handleChangeCell &&
                                                handleChangeCell({
                                                    data
                                                });
                                        }}
                                        value={value}
                                        type="text"
                                        // name="firstName"
                                        variant="outlined"
                                        size="small"
                                        validators={['required']}
                                        errorMessages={['this field is required']}
                                    />
                                </Tooltip>

                            )
                        } else if (tableMeta.rowIndex == 0) {//first row in table
                        } else {//second row and others check
                            valueArr = tableMeta.tableData.slice(0, tableMeta.rowIndex).map(function (ite) {
                                return ite[tableMeta.columnIndex]
                            });
                        }
                        if (duplicateChackColumn.includes(item) && valueArr.includes(value)) { //check wether column is need to check or not
                            return (

                                <Tooltip title="Duplicated value">
                                    <TextValidator
                                        style={{ backgroundColor: valueArr.includes(value) ? '#ffbbbb' : '' }}
                                        className=" w-full"
                                        //label="Instructions by"
                                        onChange={event => {
                                            //updateValue(event.target.value)
                                            let data = { "row": tableMeta.rowIndex, "column": item, "data": event.target.value }
                                            handleChangeCell &&
                                                handleChangeCell({
                                                    data
                                                });
                                        }}
                                        value={value}
                                        type="text"
                                        // name="firstName"
                                        variant="outlined"
                                        size="small"
                                        validators={['required']}
                                        errorMessages={['this field is required']}
                                    />
                                </Tooltip>
                            )
                        } else {

                            return (
                                <div> {value}</div>
                            )
                        }

                    }
                }
            })

        });
        this.setState({ rowdata: rowdata, columns }, () => { })

    }


    filedataAdd = () => {
        const { filedata } = this.props;
        let dataList = this.state.rowdata;
        filedata &&
            filedata({
                dataList
            });

    }


    componentDidMount = async () => {
        const { tableData } = this.props;
        this.setState({ rowdata: tableData }, () => {
            this.chackErrors();
        })
        this.makeTableColumn(tableData)
        // if (file != null) {
        //     //this.loadFile();
        // } else {
        //     this.setState({
        //         rowdata: [],
        //         columns: []
        //     }, () => { this.filedataAdd() })
        // }


    }
    tableView(state) {
        this.chackErrors();
        this.setState({
            tableOpen: state
        })
    }


    render() {
        const { classes, tableData } = this.props
        return (

            <Fragment>
                <Button onClick={() => { this.tableView(true) }}>
                    <span className={this.state.haserror ? "text-error" : ""}>{this.state.haserror ? "Uploaded file has error(s). pleace click and check" : "Data verified. You can check by click"}</span>
                </Button>


                <Dialog fullScreen open={this.state.tableOpen} onClose={() => { this.tableView(false) }} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton onClick={() => { this.tableView(false) }} edge="start" color="inherit" aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    {this.state.rowdata.length != 0 ?

                        <LoonsTable
                            title={""}
                            id={"exceltotable"}
                            data={this.state.rowdata}
                            columns={this.state.columns}
                            options={{
                                serverSide: true,
                                pagination: false,
                            }
                            }
                        ></LoonsTable>
                        : <div className="h-150px w-full text-center"><CircularProgress size={24} /></div>}
                </Dialog>

                <TextValidator
                    className=" w-full hidden"
                    value={this.state.haserror ? "" : "ok"}
                    validators={['required']}
                    errorMessages={['this field is required']}
                />
            </Fragment>


        );
    }
}

export default withStyles(styleSheet)(ExcelToTable);