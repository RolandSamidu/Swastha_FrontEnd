import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import {
    Card,
    TextField,
    MenuItem,
    IconButton,
    Icon,
    Grid,
    Switch,
    Typography,
    Divider,
    TableCell,
} from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar'
import { Alert, AlertTitle } from '@material-ui/lab'

import { themeColors } from 'app/components/MatxTheme/themeColors'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import DateRangeIcon from '@material-ui/icons/DateRange'

import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { LoonsTable, LoonsCard, MainContainer, CardTitle, DatePicker, FilePicker, Button, ExcelToTable, LoonsSnackbar } from "app/components/LoonsLabComponents";

import PaymentIcon from '@material-ui/icons/Payment'
import readXlsxFile from 'read-excel-file'

import WarehouseServices from 'app/services/WarehouseServices'


const styleSheet = (theme) => ({})

class ImportOrderList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: '',
            severity: 'success',

            statusfile: false,
            file: { fileList: [] },
            tableData: [],
            schema: {
                agent: {
                    prop: 'agent',
                    type: String,
                    required: true,
                },
                agent_type: {
                    prop: 'agent_type',
                    type: String,
                    required: true,
                },
                order_no: {
                    prop: 'order_no',
                    type: String,
                    required: true,
                },
                order_date: {
                    prop: 'order_date',
                    type: String,
                    required: true,
                },
                sr_no: {
                    prop: 'sr_no',
                    type: String,
                    required: true,
                },
                order_quantity: {
                    prop: 'order_quantity',
                    type: String,
                    required: true,
                },
                delivery_schedule_quantity: {
                    prop: 'delivery_schedule_quantity',
                    type: String,
                    required: true,
                },
                schedule_date: {
                    prop: 'schedule_date',
                    type: String,
                    required: true,
                },
                purchase_price: {
                    prop: 'purchase_price',
                    type: String,
                    required: true,
                },
                supplier_charges: {
                    prop: 'supplier_charges',
                    type: String,
                    required: true,
                },
                invoice_price: {
                    prop: 'invoice_price',
                    type: String,
                    required: true,
                },
            },
        }
    }

    async loadFile() {
        const schema = this.state.schema

        if (this.state.file.fileList.length > 0) {
            let file = this.state.file.fileList[0].file

            readXlsxFile(file, { schema }).then(({ rows, errors }) => {
                console.log('table data ', rows)
                console.log('error', errors)
                this.setState({ tableData: rows })
            })
        } else {
            this.setState({ tableData: [] })
        }
    }

    async selectedFiles(file) {
        this.setState({ file: file }, () => {
            this.loadFile()
        })
    }


    async submit() {

        let data={data:this.state.tableData}
        let res = await WarehouseServices.orderItemsUpload(data)
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Order Item Uploaded Successfuly',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Order Item Upload was Unsuccessful',
                severity: 'error',
            })
        }
    }


    render() {
        let { theme } = this.props


        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Add New Order List" />

                        <ValidatorForm
                                    onSubmit={() => this.submit()}
                                    onError={() => null}
                                >
                        <Grid item lg={12} md={12} xs={12}>
                            <Card
                                className="p-2"
                                elevation={5}
                                style={{
                                    // borderTop: `12px solid ${themeColors[activeTheme].palette.facultyColors.fodd.main}`,
                                }}
                            >
                                <Grid
                                    className="items-center justify-center"
                                    container
                                    item
                                    xs={12}
                                >
                                    <Typography
                                        className="font-semibold py-4"
                                        align="center"
                                    >
                                        Order List
                                    </Typography>
                                </Grid>
                              

                                    <FilePicker
                                        id="file"
                                        singleFileEnable={true}
                                        multipleFileEnable={false}
                                        dragAndDropEnable={true}
                                        tableEnable={true}
                                        // documentName={true}
                                        // documentNameValidation={['required']}
                                        //documenterrorMessages={['this field is required']}
                                        accept=".xlsx, .xls, .csv"
                                        // maxFileSize={1048576}
                                        // maxTotalFileSize={1048576}
                                        // maxFilesCount={3}
                                        validators={[
                                            //'required',
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
                                            this.state.file
                                                .fileList
                                        }
                                        // label="Select Attachment"
                                        singleFileButtonText="Upload Data"
                                        // multipleFileButtonText="Select Files"
                                        selectedFiles={(files) =>
                                            this.selectedFiles(
                                                files
                                            )

                                        }
                                    />
                                    {this.state.tableData
                                        .length != 0 ? (
                                        <ExcelToTable
                                            //file={this.state.file.fileList.length != 0 ? this.state.file.fileList[0].file : null}
                                            //filedata={(data) => this.selectedFiledata(data)}
                                            tableData={
                                                this.state.tableData
                                            }
                                            schema={
                                                this.state.schema
                                            }
                                            handleChangeCell={(data) =>
                                                // this.handleChangeCellFDD(data )
                                                console.log("change")
                                            }
                                        /*  duplicateChackColumn={[

                                             //"Registration No.",

                                             "index_no",
                                             "nic",
                                             "email",

                                         ]} */
                                        /* requiredColumn={[

                                            "index_no",
                                            "name_with_initials",
                                            "full_name",
                                            "z_score",
                                            "course",
                                            "gender",
                                            // "address_no",
                                            // "address_street",
                                            // "address_city",
                                            "nic",
                                            "email",
                                            //"mobile_no",
                                        ]} */
                                        />
                                    ) : null}
                                    <div className='mt-2' style={{ color: this.state.statusfile == 'error' ? "red" : "green" }}>{this.state.statusfile}</div>

                                
                            </Card>
                        </Grid>


                        <Button
                            className="mt-2"
                            progress={false}
                            type="submit"
                            scrollToTop={true}
                            startIcon="save"
                        //onClick={this.handleChange}
                        >
                            <span className="capitalize">Save</span>
                        </Button>
                        
                        </ValidatorForm>
                    </LoonsCard>
                </MainContainer>

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
export default withStyles(styleSheet)(ImportOrderList)