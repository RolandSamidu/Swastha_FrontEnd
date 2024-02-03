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
    Dialog
} from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { Alert, AlertTitle } from '@material-ui/lab'
import AppBar from '@material-ui/core/AppBar'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import ApartmentIcon from '@material-ui/icons/Apartment';

import { themeColors } from 'app/components/MatxTheme/themeColors'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import DateRangeIcon from '@material-ui/icons/DateRange'

import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { LoonsTable, LoonsCard, MainContainer, CardTitle, DatePicker, FilePicker, Button, ExcelToTable, LoonsSnackbar } from "app/components/LoonsLabComponents";
import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import PaymentIcon from '@material-ui/icons/Payment'
import readXlsxFile from 'read-excel-file'

import WarehouseServices from 'app/services/WarehouseServices'
import localStorageService from 'app/services/localStorageService'
import ConsignmentService from 'app/services/ConsignmentService'
import CloseIcon from '@material-ui/icons/Close';
import { dateParse } from 'utils'


const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },

    root: {
        display: 'flex',
    }

})

class GRNDataUploadNew extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: '',
            severity: 'success',

            submitting: false,

            selected_warehouse: null,
            selected_warehouse_name: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            dialog_for_return_items: false,
            warning_alert: false,
            return_data: [],
            return_columns: [
                {
                    name: 'sr_no',
                    label: 'STOCK_CODE'
                },

                {
                    name: 'unit_price',
                    label: 'STD_COST'
                },
                {
                    name: 'quantity',
                    label: 'INST_AVA'
                },
                {
                    name: 'batch_no',
                    label: 'SLM_LOT_NUMBER'
                },
                {
                    name: 'exd',
                    label: 'SLM_USE_BY_DATE'
                },

            ],
            grn_no: null,
            all_warehouse_loaded: [],

            statusfile: false,
            file: { fileList: [] },
            tableData: [],
            schema: {

                /* SO_ORDER_NO: {
                    prop: 'SO_ORDER_NO',
                    type: String,
                    required: true,
                },
                SO_CUST_CODE: {
                    prop: 'SO_CUST_CODE',
                    type: String,
                    required: true,
                },
                SO_ORDER_DATE: {
                    prop: 'SO_ORDER_DATE',
                    type: String,
                    required: true,
                },
                DELIVERY_DATE: {
                    prop: 'DELIVERY_DATE',
                    type: String,
                    required: true,
                },
                SO_WHSE_CODE: {
                    prop: 'SO_WHSE_CODE',
                    type: String,
                    required: true,
                },
                SO_WHSE_TO: {
                    prop: 'SO_WHSE_TO',
                    type: String,
                    required: true,
                }, */
                STOCK_CODE: {
                    prop: 'STOCK_CODE',
                    type: String,
                    required: true,
                },
                SOL_ITEM_COST: {
                    prop: 'SOL_ITEM_COST',
                    type: String,
                    required: true,
                },
                SOL_ORDERED_QTY: {
                    prop: 'SOL_ORDERED_QTY',
                    type: String,
                    required: true,
                },
                SOL_SHIPPED_QTY: {
                    prop: 'SOL_SHIPPED_QTY',
                    type: String,
                    required: true,
                },
                SHIPPED_AMOUNT: {
                    prop: 'SHIPPED_AMOUNT',
                    type: String,
                    required: true,
                },
                BATCH_NUMBER: {
                    prop: 'BATCH_NUMBER',
                    type: String,
                    required: true,
                },

                SOL_PICKED_QTY: {
                    prop: 'SOL_PICKED_QTY',
                    type: String,
                    required: true,
                },
                EXP_DATE: {
                    prop: 'EXP_DATE',
                    type: String,
                    required: true,
                },
                MFD_DATE: {
                    prop: 'MFD_DATE',
                    type: String,
                    required: true,
                },
                PACK_SIZE: {
                    prop: 'PACK_SIZE',
                    type: String,
                    required: true,
                },

                /*  STOCK_CODE: {
                     prop: 'STOCK_CODE',
                     type: String,
                     required: true,
                 },
                 SH_DESC: {
                     prop: 'SH_DESC',
                     type: String,
                     required: true,
                 },
                 STD_COST: {
                     prop: 'STD_COST',
                     type: String,
                     required: true,
                 },
                 INST_AVA: {
                     prop: 'INST_AVA',
                     type: String,
                     required: true,
                 },
                 SLM_LOT_NUMBER: {
                     prop: 'SLM_LOT_NUMBER',
                     type: String,
                     required: true,
                 },
                 SLM_USE_BY_DATE: {
                     prop: 'SLM_USE_BY_DATE',
                     type: String,
                     required: true,
                 },
                 SYS_DESCRIPTION: {
                     prop: 'SYS_DESCRIPTION',
                     type: String,
                     required: true,
                 }, */


                /* batch_no: {
                    prop: 'batch_no',
                    type: String,
                    required: true,
                },
                exd: {
                    prop: 'exd',
                    type: String,
                    required: true,
                },
                mfd: {
                    prop: 'mfd',
                    type: String,
                    required: true,
                },
                unit_price: {
                    prop: 'unit_price',
                    type: String,
                    required: true,
                },
                pack_size: {
                    prop: 'pack_size',
                    type: String,
                    required: true,
                },
                quantity: {
                    prop: 'quantity',
                    type: String,
                    required: true,
                },
                volume: {
                    prop: 'volume',
                    type: String,
                    required: true,
                },
                price: {
                    prop: 'price',
                    type: String,
                    required: true,
                },
                item_bin_type: {
                    prop: 'item_bin_type',
                    type: String,
                    required: true,
                },
                uom: {
                    prop: 'uom',
                    type: String,
                    required: true,
                },
                add_to_bin: {
                    prop: 'add_to_bin',
                    type: String,
                    required: true,
                }, */
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

        let data = { data: this.state.tableData }
        this.setState({ submitting: true })
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');


        /* 
                const perChunk = 500
        
                const inputArray = data.data;
                
                const result = inputArray.reduce((resultArray, item, index) => { 
                  const chunkIndex = Math.floor(index/perChunk)
                
                  if(!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = [] // start a new chunk
                  }
                
                  resultArray[chunkIndex].push(item)
                
                  return resultArray
                }, [])
                
                console.log("Chunk data",result); */


        let dataSet = data.data;

        console.log("data set", dataSet)


        for (let index = 0; index < dataSet.length; index++) {
            /*  dataSet[index].sr_no = dataSet[index].STOCK_CODE;
             dataSet[index].exd = dateParse(dataSet[index].SLM_USE_BY_DATE);
             dataSet[index].mfd = dateParse(new Date);
             dataSet[index].unit_price = dataSet[index].STD_COST;
             dataSet[index].quantity = dataSet[index].INST_AVA;
             dataSet[index].pack_size = 1;
             dataSet[index].volume = dataSet[index].INST_AVA;
             dataSet[index].price = dataSet[index].STD_COST;
             dataSet[index].batch_no = dataSet[index].SLM_LOT_NUMBER;
             dataSet[index].item_bin_type = 'Data entering';
             //dataSet[index].uom = dataSet[index].STOCK_CODE;
             dataSet[index].add_to_bin = true;
 
             delete dataSet[index].STOCK_CODE;
             delete dataSet[index].SLM_LOT_NUMBER;
             delete dataSet[index].SLM_USE_BY_DATE;
             delete dataSet[index].STD_COST;
             delete dataSet[index].INST_AVA; */


            dataSet[index].sr_no = dataSet[index].STOCK_CODE;
            dataSet[index].exd = dateParse(dataSet[index].EXP_DATE);
            //dataSet[index].mfd = dateParse(new Date);
            if(dataSet[index].MFD_DATE){
                dataSet[index].mfd=dataSet[index].MFD_DATE
            }else{
                dataSet[index].mfd = dateParse(new Date);
            }
            dataSet[index].unit_price = dataSet[index].SOL_ITEM_COST;
            dataSet[index].quantity = dataSet[index].SOL_PICKED_QTY;
            if(dataSet[index].PACK_SIZE){
                dataSet[index].pack_size=dataSet[index].PACK_SIZE
            }else{
                dataSet[index].pack_size = 1;
            }
            


            dataSet[index].volume = 1;
            dataSet[index].price = dataSet[index].SOL_ITEM_COST;
            dataSet[index].batch_no = dataSet[index].BATCH_NUMBER;
            dataSet[index].item_bin_type = 'Data entering';
            //dataSet[index].uom = dataSet[index].STOCK_CODE;
            dataSet[index].add_to_bin = true;

            delete dataSet[index].STOCK_CODE;
            delete dataSet[index].BATCH_NUMBER;
            delete dataSet[index].EXP_DATE;
            delete dataSet[index].SOL_ITEM_COST;
            delete dataSet[index].SOL_PICKED_QTY;

        }


        let formData = {
            warehouse_id: selected_warehouse_cache.id,
            grn_no: this.state.grn_no,
            type: "Data entering",
            creation_type: "Data entering",
            grn_items: dataSet
        }
        console.log("data set", formData)

        if (dataSet.length > 0) {

             let res = await ConsignmentService.createGRN(formData)
            if (201 == res.status) {
                this.setState({
                    alert: true,
                    message: 'Uploaded Successfuly',
                    severity: 'success',
                    submitting: false
                })
                if (res.data?.posted?.res?.Errolist?.length > 0) {
                    this.setState({
                        dialog_for_return_items: true,
                        return_data: res.data?.posted?.res?.Errolist

                    })
                }

            } else {
                console.log("errorr", res.response.data.error)
                this.setState({
                    alert: true,
                    //message: 'Upload was Unsuccessful',
                    message: res?.response?.data?.error,
                    severity: 'error',
                    submitting: false
                })
            } 
        } else {
            this.setState({
                alert: true,
                message: 'Upload was Unsuccessful',
                severity: 'error',
                submitting: false
            })
        }
    }

    async loadWarehouses() {
        this.setState({ Loaded: false })
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        var all_pharmacy_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        if (!selected_warehouse_cache) {
            this.setState({ dialog_for_select_warehouse: true })
        }
        else {
            this.setState({ 
                owner_id: selected_warehouse_cache.owner_id, 
                selected_warehouse: selected_warehouse_cache.id, 
                selected_warehouse_name: selected_warehouse_cache.name, 
                dialog_for_select_warehouse: false, Loaded: true 
            })
        }
        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params);
        if (res.status == 200) {
            console.log("warehouseUsers", res.data.view.data)

            res.data.view.data.forEach(element => {
                all_pharmacy_dummy.push(
                    {
                        warehouse: element.Warehouse,
                        name: element.Warehouse.name,
                        main_or_personal: element.Warehouse.main_or_personal,
                        owner_id: element.Warehouse.owner_id,
                        id: element.warehouse_id,
                        pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
                    }

                )
            });
            console.log("warehouse", all_pharmacy_dummy)
            this.setState({ all_warehouse_loaded: all_pharmacy_dummy })
        }
    }
    componentDidMount() {
        this.loadWarehouses()

    }


    render() {
        let { theme } = this.props
        const { classes } = this.props
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <Typography variant="h6" className="font-semibold">Add Stock Manually</Typography>
                            <Grid
                                className='flex'
                            >
                                <Grid
                                    className='pt-1 pr-3'
                                >
                                    <Typography>{this.state.selected_warehouse_name !== null ? "You're in "+ this.state.selected_warehouse_name : null}</Typography>
                                </Grid>
                                <Button
                                    color='primary'
                                    onClick={() => {
                                        this.setState({ dialog_for_select_warehouse: true, Loaded: false })
                                    }}>
                                    <ApartmentIcon />
                                    Change Warehouse
                                </Button>
                            </Grid>
                        </div>

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

                                        </Typography>
                                    </Grid>

                                    <Grid
                                        className=""
                                        container
                                        item
                                        xs={12}
                                        lg={4}
                                        md={4}
                                    >
                                        <TextValidator
                                            className="w-full"
                                            placeholder="STV No"
                                            name="STV No"

                                            value={this.state.grn_no}
                                            type="text"

                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                this.setState({
                                                    grn_no: e.target.value
                                                })
                                            }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>

                                    <div className='mt-10'></div>

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
                                        maxFilesCount={1}
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

                                            "STOCK_CODE"
                                        ]} */
                                        />
                                    ) : null}
                                    <div className='mt-2' style={{ color: this.state.statusfile == 'error' ? "red" : "green" }}>{this.state.statusfile}</div>


                                </Card>
                            </Grid>


                            <Button
                                className="mt-2"
                                progress={this.state.submitting}
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


                <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_warehouse} >


                    <MuiDialogTitle disableTypography>
                        <CardTitle title="Select Your Warehouse" />
                    </MuiDialogTitle>



                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            onError={() => null}
                            className="w-full">
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_warehouse_loaded.sort((a,b)=> (a.name.localeCompare(b.name)))}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        localStorageService.setItem('Selected_Warehouse', value);
                                        this.setState({ 
                                            selected_warehouse_name : value.name,
                                            dialog_for_select_warehouse: false, 
                                            Loaded: true 
                                        })
                                    }
                                }}
                                value={{
                                    name: this.state.selected_warehouse ? (this.state.all_warehouse_loaded.filter((obj) => obj.id == this.state.selected_warehouse).name) : null,
                                    id: this.state.selected_warehouse
                                }}
                                getOptionLabel={(option) => option.name != null ? option.name + " - " + option.main_or_personal : null}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Warehouse"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />

                        </ValidatorForm>
                    </div>
                </Dialog>



                <Dialog fullWidth maxWidth="lg" open={this.state.dialog_for_return_items} >


                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Return Items (Please Download and Check)" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    warning_alert: true

                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>


                    <div className="w-full h-full">
                        <LoonsTable
                            id={'returnItems'}
                            data={this.state.return_data}
                            columns={this.state.return_columns}
                            options={{
                                pagination: false,
                                serverSide: true,
                                //rowsPerPage: this.state.limit,
                                //count: this.state.totalItems,
                                // rowsPerPageOptions: [20, 50, 100],
                                //page: this.state.page,

                            }}
                        ></LoonsTable>
                    </div>
                </Dialog>

                <LoonsDiaLogBox
                    title="Are you sure?"
                    show_alert={true}
                    alert_severity="info"
                    alert_message="Please Download the Table Data Before Close"
                    //message="testing 2"
                    open={this.state.warning_alert}
                    show_button={true}
                    show_second_button={true}
                    btn_label="Need to Download"
                    onClose={() => {
                        this.setState({ warning_alert: false })
                    }}
                    second_btn_label="Yes Downloaded"
                    secondButtonAction={() => {
                        this.setState({ warning_alert: false, dialog_for_return_items: false })
                    }}
                >
                </LoonsDiaLogBox>
            </Fragment>
        )
    }



}
export default withStyles(styleSheet)(GRNDataUploadNew)