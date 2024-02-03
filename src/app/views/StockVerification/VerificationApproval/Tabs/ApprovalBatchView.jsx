import React, { Component, Fragment } from "react";
import { MainContainer, SubTitle } from "app/components/LoonsLabComponents";
import { Grid } from '@material-ui/core'
import { Button, } from 'app/components/LoonsLabComponents'
import IconButton from "@material-ui/core/IconButton";
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import LoonsTable from "app/components/LoonsLabComponents/Table/LoonsTable";
import { Autocomplete } from "@material-ui/lab";
import LoonsCard from "app/components/LoonsLabComponents/LoonsCard";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from '@mui/icons-material/Add';
import StockVerificationService from "app/services/StockVerificationService";
import CloseIcon from '@material-ui/icons/Close';
import { dateParse } from "utils";
import InventoryService from "app/services/InventoryService";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { CircularProgress, } from '@material-ui/core'
import WarehouseServices from "app/services/WarehouseServices";
import CardTitle from "app/components/LoonsLabComponents/CardTitle";


class ApprovalBatchView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonName: 'Save',
            buttonName_1: 'Close',
            all_bin_stocks: [],
            verification_item_batches: [],
            loading: false,
            viewDailog: false,
            displayDailog: false,
            submiting: false,
            editSubmitting: false,
            actionDisabled: false,
            verification_get_by_id: [],
            stock_verification_freez_item: [],
            batchInfo: [],
            get_all_item_batches: [],
            all_item_batches: [],
            item_batch: [],
            get_receive_quantity: [],
            get_issuance_quantity: [],
            itemBinDailog: false,
            tableLoaded: false,
            edit: false,
            post: false,
            warehouse_bins: [],
            loadingWarehouseBins: false,
            item_code: [],




            institution: {
                first: null,
                mid: null,
                end: null
            },
            regno2: true,
            activeTab: 0,
            status: ['Active', 'FREEZED'],

            formData: {

                verification_item_id: null,
                freez_quantity: null,
                count_quantity: null,
                batch_status: null,
                owner_id: null,
                remark: null,
                item_batch_bin_id: null,
            },
            binStocksData: {

                warehouse_id: null,
                item_batch_id: null,
                quantity: null,
                volume: null,
                type: null,
                bin_id: null,



            },

            filterData: {
                page: 0,
                limit: 10,


            },

            newFilterData: {
                limit: 10,
                page: 0,

            },
            columns: [
                {
                    name: 'batch_no',
                    label: 'Batch No',


                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return this.state.all_bin_stocks[tableMeta.rowIndex]?.ItemSnapBatch?.batch_no;
                        }
                    }
                },

                {
                    name: 'expiry_date',
                    label: 'Expiry Date',

                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return dateParse(this.state.all_bin_stocks[tableMeta.rowIndex]?.ItemSnapBatch?.exd)

                        },
                    },
                },
                {
                    name: 'batch_status',
                    label: 'Status',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return this.state.all_bin_stocks[tableMeta.rowIndex]?.ItemSnapBatch?.status

                        },
                    },
                },
                {
                    name: 'freez_quantity',
                    label: 'Freez Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {



                            return this.state.all_bin_stocks[tableMeta.rowIndex]?.quantity

                        },
                    },

                },



                {
                    name: 'recived_quantity',
                    label: 'Recived Quantity',
                    options: {

                        customBodyRender: (value, tableMeta, updateValue) => {

                            let recived_quantity = this.state.get_receive_quantity.find((x) => x?.item_batch_id == this.state.all_bin_stocks[tableMeta.rowIndex]?.item_batch_id)
                            console.log('recived_quantity', recived_quantity)
                            return isNaN(Math.abs(recived_quantity?.quantity)) ? 'N/A' : Math.abs(recived_quantity?.quantity);

                        },
                    },
                },
                {
                    name: 'issued_quantity',
                    label: 'Issued Quantity',
                    options: {

                        customBodyRender: (value, tableMeta, updateValue) => {

                            let issued_quantity = this.state.get_issuance_quantity.find((x) => x?.item_batch_id == this.state.all_bin_stocks[tableMeta.rowIndex]?.item_batch_id)
                            console.log('issued_quantity', issued_quantity)
                            return isNaN(Math.abs(issued_quantity?.quantity)) ? 'N/A' : Math.abs(issued_quantity?.quantity);

                        },
                    },
                },

                {
                    name: 'count_quantity',
                    label: 'Count Quantity',

                    options: {
                        filter: true,

                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <TextValidator
                                        {...value}
                                        placeholder="Count Quantity"
                                        disabled={this.state.actionDisabled}
                                        fullWidth
                                        value={this.state.all_bin_stocks[tableMeta.rowIndex]?.count_quantity}
                                        onChange={(e) => {
                                            let formData = this.state.formData
                                            formData.count_quantity =
                                                e.target.value
                                            this.setState({ post: true, formData })
                                        }}
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            width: 150,
                                        }}

                                    />
                                </>
                            )
                        }

                    },
                },
                {
                    name: 'remark',
                    label: 'Remark',

                    options: {

                        filter: true,

                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <TextValidator
                                        {...value}
                                        placeholder="Remark"
                                        disabled={this.state.actionDisabled}
                                        fullWidth
                                        value={this.state.all_bin_stocks[tableMeta.rowIndex]?.remark}
                                        onChange={(e) => {
                                            let formData = this.state.formData
                                            formData.remark =
                                                e.target.value
                                            this.setState({ post: true, formData })
                                        }}
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            width: 150,
                                        }}

                                    />
                                </>
                            )
                        }

                    },
                },




                {
                    name: "action",
                    label: "Action",
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="View">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                this.setState({
                                                    displayDailog: true
                                                })




                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>

                                    {/* <Tooltip title="Save">

                                        <Button
                                            className="button-primary "
                                            disabled={this.state.actionDisabled}
                                            progress={false}
                                            type="submit"
                                            scrollToTop={true}
                                            onClick={() => {
                                                this.postDriverForm(this.state.all_bin_stocks[tableMeta.rowIndex])
                                                this.setState({ post: false })
                                            }}


                                        >
                                            <span className="capitalize">Save</span>
                                        </Button>


                                    </Tooltip> */}

                                    <Grid className="flex items-center">
                                        { }
                                        {/* <Button style={{ margin: '8px', minWidth: '10px', minHeight: '10px', color: 'black' }} name="batch_no" variant="outlined" onClick={() => { this.setState({ displayDailog: true, }) }}><VisibilityIcon /></Button> */}
                                        <Dialog open={this.state.displayDailog} >

                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <DialogTitle>Packing Details</DialogTitle>
                                                <IconButton aria-label="close" onClick={() => { this.setState({ displayDailog: false }) }}><CloseIcon /></IconButton>
                                            </div>
                                            <LoonsCard >

                                                <Grid container spacing={1} className="flex m-5 " alignItems="center">

                                                    <Grid
                                                        className=" w-full  " item lg={6} md={6} sm={12} xs={12}
                                                    >


                                                        <Grid
                                                            className=" w-full flex " >

                                                            <SubTitle title="UOM: " />
                                                            &nbsp;
                                                            <SubTitle title={this.state.all_bin_stocks[tableMeta.rowIndex]?.ItemSnapBatch?.UOM?.name} />

                                                        </Grid>

                                                        <Grid
                                                            className=" w-full flex " >

                                                            <SubTitle title="Unit Price: " />
                                                            &nbsp;
                                                            <SubTitle title={this.state.all_bin_stocks[tableMeta.rowIndex]?.ItemSnapBatch?.unit_price} />

                                                        </Grid>

                                                        <Grid
                                                            className=" w-full flex " >

                                                            <SubTitle title="Width(cm): " />
                                                            &nbsp;
                                                            <SubTitle title={this.state.all_bin_stocks[tableMeta.rowIndex]?.WarehousesBin?.width} />

                                                        </Grid>

                                                        <SubTitle title="Net.Weight " />


                                                    </Grid>

                                                    <Grid
                                                        className=" w-full  " item lg={6} md={6} sm={12} xs={12}
                                                    >


                                                        <Grid
                                                            className=" w-full flex " >

                                                            <SubTitle title="Height(cm): " />
                                                            &nbsp;
                                                            <SubTitle title={this.state.all_bin_stocks[tableMeta.rowIndex]?.WarehousesBin?.height} />

                                                        </Grid>
                                                        <Grid
                                                            className=" w-full flex " >
                                                            <SubTitle title="Length(cm): " />
                                                            &nbsp;
                                                            <SubTitle title={this.state.all_bin_stocks[tableMeta.rowIndex]?.WarehousesBin?.length} />

                                                        </Grid>
                                                        <SubTitle title="Gross.Weight " />


                                                    </Grid>





                                                </Grid>

                                                <LoonsTable

                                                    data={this.state.all_bin_stocks}
                                                    columns_inside={[
                                                        {
                                                            name: 'pack_size',
                                                            label: 'Pack Size',
                                                            options: {
                                                                customBodyRender: (value, tableMeta, updateValue) => {
                                                                    return this.state.all_bin_stocks[tableMeta.rowIndex]?.ItemSnapBatch?.pack_size

                                                                },
                                                            },
                                                        },

                                                        {
                                                            name: 'uom',
                                                            label: 'UOM',
                                                            options: {
                                                                customBodyRender: (value, tableMeta, updateValue) => {
                                                                    return this.state.all_bin_stocks[tableMeta.rowIndex]?.ItemSnapBatch?.UOM?.name

                                                                },
                                                            },

                                                        },

                                                        {
                                                            name: 'quantity',
                                                            label: 'Quantity',
                                                            options: {
                                                                customBodyRender: (value, tableMeta, updateValue) => {
                                                                    return this.state.all_bin_stocks[tableMeta.rowIndex]?.quantity

                                                                },
                                                            },

                                                        },
                                                        {
                                                            name: 'mini_pack_size',
                                                            label: 'Mini Pack Size',
                                                            options: {
                                                                filter: true,
                                                            },

                                                        },
                                                        {
                                                            name: 'conversion',
                                                            label: 'Conversion',
                                                            options: {
                                                                filter: true,
                                                            },
                                                        },
                                                        {
                                                            name: 'remark',
                                                            label: 'Remark',
                                                            options: {
                                                                filter: true,
                                                            },
                                                        },





                                                    ]}

                                                >{ }</LoonsTable>



                                            </LoonsCard>

                                        </Dialog>

                                    </Grid >
                                </Grid>
                            );
                        }

                    }
                }

            ],


            counted_column: [
                {
                    name: 'batch_no',
                    label: 'Batch No',


                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {





                            return this.state.verification_item_batches[tableMeta.rowIndex]?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no;


                        }
                    }
                },
                {
                    name: 'expiry_date',
                    label: 'Expiry Date',

                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return dateParse(this.state.verification_item_batches[tableMeta.rowIndex]?.ItemSnapBatchBin?.ItemSnapBatch?.exd)

                        },
                    },
                },
                {
                    name: 'batch_status',
                    label: 'Status',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return this.state.verification_item_batches[tableMeta.rowIndex]?.ItemSnapBatchBin?.ItemSnapBatch?.status

                        },
                    },
                },
                {
                    name: 'freez_quantity',
                    label: 'Freez Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {



                            return this.state.verification_item_batches[tableMeta.rowIndex]?.freez_quantity

                        },
                    },

                },



                {
                    name: 'recived_quantity',
                    label: 'Recived Quantity',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'issued_quantity',
                    label: 'Issued Quantity',
                    options: {
                        filter: true,



                    },
                },

                {
                    name: 'count_quantity',
                    label: 'Count Quantity',



                    options: {
                        filter: true,

                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <TextValidator
                                        {...value}
                                        placeholder="Count Quantity"
                                        fullWidth
                                        disabled={this.state.actionDisabled}
                                        value={this.state.verification_item_batches[tableMeta.rowIndex]?.count_quantity}
                                        onChange={(e) => {
                                            let verification_item_batches = this.state.verification_item_batches
                                            verification_item_batches[tableMeta.rowIndex].count_quantity = e.target.value

                                            this.setState({ edit: true, verification_item_batches })
                                        }}
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            width: 150,
                                        }}

                                    />
                                </>
                            )
                        }

                    },
                },
                {
                    name: 'remark',
                    label: 'Remark',

                    options: {

                        filter: true,

                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <TextValidator
                                        {...value}
                                        placeholder="Remark"
                                        disabled={this.state.actionDisabled}
                                        fullWidth
                                        value={this.state.verification_item_batches[tableMeta.rowIndex]?.remark}
                                        onChange={(e) => {
                                            let verification_item_batches = this.state.verification_item_batches
                                            verification_item_batches[tableMeta.rowIndex].remark = e.target.value

                                            this.setState({ edit: true, verification_item_batches })
                                        }}
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            width: 150,
                                        }}

                                    />
                                </>
                            )
                        }

                    },
                },


                {
                    name: "action",
                    label: "Action",
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="View">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                this.setState({
                                                    displayDailog: true
                                                })




                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>

                                    {/* <Tooltip title="Save">

                                        <Button
                                            className="button-primary "
                                            disabled={this.state.actionDisabled}
                                            progress={false}
                                            type="submit"
                                            scrollToTop={true}
                                            onClick={() => {
                                                this.editItemBatches(this.state.verification_item_batches[tableMeta.rowIndex])
                                                this.setState({ edit: false })

                                            }}

                                        >
                                            <span className="capitalize">Save</span>
                                        </Button>


                                    </Tooltip> */}

                                    <Grid className="flex items-center">
                                        { }
                                        {/* <Button style={{ margin: '8px', minWidth: '10px', minHeight: '10px', color: 'black' }} name="batch_no" variant="outlined" onClick={() => { this.setState({ displayDailog: true, }) }}><VisibilityIcon /></Button> */}
                                        <Dialog open={this.state.displayDailog} >

                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <DialogTitle>Packing Details</DialogTitle>
                                                <IconButton aria-label="close" onClick={() => { this.setState({ displayDailog: false }) }}><CloseIcon /></IconButton>
                                            </div>
                                            <LoonsCard >

                                                <Grid container spacing={1} className="flex m-5 " alignItems="center">

                                                    <Grid
                                                        className=" w-full  " item lg={6} md={6} sm={12} xs={12}
                                                    >


                                                        <Grid
                                                            className=" w-full flex " >

                                                            <SubTitle title="UOM: " />
                                                            &nbsp;
                                                            <SubTitle title={this.state.all_bin_stocks[tableMeta.rowIndex]?.ItemSnapBatch?.UOM?.name} />

                                                        </Grid>

                                                        <Grid
                                                            className=" w-full flex " >

                                                            <SubTitle title="Unit Price: " />
                                                            &nbsp;
                                                            <SubTitle title={this.state.all_bin_stocks[tableMeta.rowIndex]?.ItemSnapBatch?.unit_price} />

                                                        </Grid>

                                                        <Grid
                                                            className=" w-full flex " >

                                                            <SubTitle title="Width(cm): " />
                                                            &nbsp;
                                                            <SubTitle title={this.state.all_bin_stocks[tableMeta.rowIndex]?.WarehousesBin?.width} />

                                                        </Grid>

                                                        <SubTitle title="Net.Weight " />


                                                    </Grid>

                                                    <Grid
                                                        className=" w-full  " item lg={6} md={6} sm={12} xs={12}
                                                    >


                                                        <Grid
                                                            className=" w-full flex " >

                                                            <SubTitle title="Height(cm): " />
                                                            &nbsp;
                                                            <SubTitle title={this.state.all_bin_stocks[tableMeta.rowIndex]?.WarehousesBin?.height} />

                                                        </Grid>
                                                        <Grid
                                                            className=" w-full flex " >
                                                            <SubTitle title="Length(cm): " />
                                                            &nbsp;
                                                            <SubTitle title={this.state.all_bin_stocks[tableMeta.rowIndex]?.WarehousesBin?.length} />

                                                        </Grid>
                                                        <SubTitle title="Gross.Weight " />


                                                    </Grid>





                                                </Grid>

                                                <LoonsTable

                                                    data={this.state.all_bin_stocks}
                                                    columns_inside={[
                                                        {
                                                            name: 'pack_size',
                                                            label: 'Pack Size',
                                                            options: {
                                                                customBodyRender: (value, tableMeta, updateValue) => {
                                                                    return this.state.all_bin_stocks[tableMeta.rowIndex]?.ItemSnapBatch?.pack_size

                                                                },
                                                            },
                                                        },

                                                        {
                                                            name: 'uom',
                                                            label: 'UOM',
                                                            options: {
                                                                customBodyRender: (value, tableMeta, updateValue) => {
                                                                    return this.state.all_bin_stocks[tableMeta.rowIndex]?.ItemSnapBatch?.UOM?.name

                                                                },
                                                            },

                                                        },

                                                        {
                                                            name: 'quantity',
                                                            label: 'Quantity',
                                                            options: {
                                                                customBodyRender: (value, tableMeta, updateValue) => {
                                                                    return this.state.all_bin_stocks[tableMeta.rowIndex]?.quantity

                                                                },
                                                            },

                                                        },
                                                        {
                                                            name: 'mini_pack_size',
                                                            label: 'Mini Pack Size',
                                                            options: {
                                                                filter: true,
                                                            },

                                                        },
                                                        {
                                                            name: 'conversion',
                                                            label: 'Conversion',
                                                            options: {
                                                                filter: true,
                                                            },
                                                        },
                                                        {
                                                            name: 'remark',
                                                            label: 'Remark',
                                                            options: {
                                                                filter: true,
                                                            },
                                                        },





                                                    ]}

                                                >{ }</LoonsTable>



                                            </LoonsCard>

                                        </Dialog>

                                    </Grid >
                                </Grid>
                            );
                        }

                    }
                }

            ],



            post_column: [
                {
                    name: 'batch_no',
                    label: 'Batch No',


                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {





                            return this.state.get_all_item_batches[tableMeta.rowIndex]?.batch_no;


                        }
                    }
                },
                {
                    name: 'manufacture_date',
                    label: 'Manufacture Date',

                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return dateParse(this.state.get_all_item_batches[tableMeta.rowIndex]?.mfd)

                        },
                    },

                },
                {
                    name: 'expiry_date',
                    label: 'Expiry Date',

                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return dateParse(this.state.get_all_item_batches[tableMeta.rowIndex]?.exd)

                        },
                    },

                },
                {
                    name: 'batch_status',
                    label: 'Status',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return this.state.get_all_item_batches[tableMeta.rowIndex]?.ItemSnap?.status

                        },
                    },
                },
                {
                    name: 'unit_price',
                    label: 'Unit Price',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return this.state.get_all_item_batches[tableMeta.rowIndex]?.unit_price

                        },
                    },

                },



                {
                    name: 'pack_size',
                    label: 'Pack Size',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return this.state.get_all_item_batches[tableMeta.rowIndex]?.pack_size

                        },
                    },
                },

                {
                    name: 'bin_id',
                    label: 'Bin Id',

                    options: {

                        filter: true,

                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        placeholder="Batch Bin"
                                        name="item_id"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        options={this.state.warehouse_bins}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let binStocksData = this.state.binStocksData
                                                binStocksData.bin_id = value.id
                                                let formData = this.state.formData
                                                formData.item_batch_bin_id = value.id



                                                this.setState({
                                                    binStocksData,
                                                    formData,


                                                })

                                            }
                                            else if (value == null) {
                                                let binStocksData = this.state.binStocksData
                                                binStocksData.bin_id = null
                                                let formData = this.state.formData
                                                formData.item_batch_bin_id = null
                                                this.setState({
                                                    binStocksData,
                                                    formData,

                                                })
                                            }

                                        }}




                                        getOptionLabel={(option) => option.bin_id}
                                        renderInput={(params) => (
                                            <TextValidator {...params}
                                                placeholder="Type Batch bin"
                                                //variant="outlined"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                // errorMessages={[
                                                //     'this field is required',
                                                // ]}
                                                onChange={(e) => {
                                                    if (e.target.value.length > 3) {
                                                        this.selectItemBatchBinForm(e.target.value);
                                                    }
                                                }}
                                                value={this.state.binStocksData.bin_id}


                                            />
                                        )} />
                                </>
                            )
                        }

                    },
                },


                {
                    name: "action",
                    label: "Action",
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">




                                    <Tooltip title="Save">

                                        <Button
                                            className="button-primary "
                                            progress={false}
                                            type="submit"
                                            scrollToTop={true}
                                            onClick={() => {

                                                this.selectItemBatchBinForm(this.state.get_all_item_batches[tableMeta.rowIndex])

                                                this.setState({})

                                            }}

                                        >
                                            <span className="capitalize">Submit</span>
                                        </Button>


                                    </Tooltip>

                                </Grid>
                            );
                        }

                    }
                }

            ],
        }
    }


    postDriverForm = async (data) => {

        this.setState({
            submiting: true,
        })
        const searchParams = new URLSearchParams(this.props.match.url);
        const id = searchParams.get('id')
        console.log('idddddd', id)

        let formData = this.state.formData

        formData.item_batch_bin_id = data?.id
        formData.freez_quantity = data?.quantity
        formData.batch_status = data?.status
        formData.owner_id = data?.owner_id
        formData.verification_item_id = id







        let res = await StockVerificationService.createVerificationItemBatches(formData);
        console.log('formdata  eka', this.state.formData);




        console.log("res", res);

        if (res.status == 200 || res.status == 201) {
            console.log("resssss", res)
            this.setState({
                alert: true,
                message: 'Item Batche Updated',
                severity: 'success',
                submiting: false,
                viewDailog: false

            })

            setTimeout(() => {
                window.location.reload()

            }, 1000);


        } else {
            this.setState({
                alert: true,
                message: 'Item batche not Updated',
                severity: 'error',
                submiting: false,
                viewDailog: false
            })
        }



    }

    postItemBatchesForm = async (data) => {

        this.setState({
            submiting: true,
        })
        const searchParams = new URLSearchParams(this.props.match.url);
        const id = searchParams.get('id')
        console.log('idddddd', id)

        let formData = this.state.formData

        // formData.item_batch_bin_id = data?.id
        // formData.freez_quantity = data?.quantity
        // formData.batch_status = data?.status
        formData.owner_id = data?.owner_id
        formData.verification_item_id = id







        let res = await StockVerificationService.createVerificationItemBatches(formData);
        console.log('new formdata eka', this.state.formData);




        console.log("res", res);

        if (res.status == 200 || res.status == 201) {
            console.log("resssss", res)
            this.setState({
                alert: true,
                message: 'Item Batche Created',
                severity: 'success',
                submiting: false,
                viewDailog: false

            })

            setTimeout(() => {
                // window.location.reload()

            }, 1000);


        } else {
            this.setState({
                alert: true,
                message: 'Item Batche not Create',
                severity: 'error',
                submiting: false,
                viewDailog: false
            })
        }



    }



    selectItemBatchBinForm = async (data) => {

        this.setState({
            submiting: true,
        })
        const searchParams = new URLSearchParams(this.props.match.url);
        const id = searchParams.get('warehouse_id')
        console.log('idddddd', id)

        let binStocksData = this.state.binStocksData

        // binStocksData.item_batch_bin_id = data?.id
        // // formData.freez_quantity = data?.quantity
        // // formData.batch_status = data?.status
        // binStocksData.owner_id = data?.owner_id
        binStocksData.warehouse_id = id
        binStocksData.quantity = 0;
        binStocksData.volume = 0;
        binStocksData.type = 'Verification Added';
        binStocksData.item_batch_id = data.id
        let res = await StockVerificationService.selectItemBatchBin(binStocksData);
        console.log('new formdata eka', this.state.formData);

        console.log("res", res);

        if (res.status == 200 || res.status == 201) {
            console.log("resssss", res)
            this.setState({
                alert: true,
                message: 'Item Batch Bin Select',
                severity: 'success',
                submiting: false,
                viewDailog: false

            })

            setTimeout(() => {
                window.location.reload()

            }, 1000);


        } else {
            this.setState({
                alert: true,
                message: 'Item Batch bin Not Select',
                severity: 'error',
                submiting: false,
                viewDailog: false
            })
        }



    }

    async stockVerificationGetById() {
        this.setState({ loadingById: false })

        const query = new URLSearchParams(this.props.match.url);
        const freezId = query.get('freez_id')
        console.log('freez_id:', freezId);
        console.log('ggjgkhjklkkkkkkkkkkk:', this.props);


        // console.log('id', this.props.match.params.id)
        let res = await StockVerificationService.verificationGetById(freezId)
        console.log('res get by id', res);
        if (res.status == 200) {

            if (res.data.view.status == "Pending Approval") {
                this.setState({
                    actionDisabled: true,
                })
            }
            console.log("verification get by id", res.data.view)
            this.setState({
                verification_get_by_id: res.data.view,
                total_stock_verification_data: res.data.view.totalItems,
                loadingById: true,
            }, () => {
                this.getAllBinStocks()
                this.getFreezStockItem()
                this.getVerificationItemBatches()
                this.getVerificationDetailsByID()
                const searchParams = new URLSearchParams(this.props.match.url);
                const id = searchParams.get('id')
                console.log('sssss', id)
            })

            console.log("2nd time", res.data.view)
        }
    }

    async getFreezStockItem() {
        this.setState({ loading: false })

        const query = new URLSearchParams(this.props.match.url);
        const freezId = query.get('freez_id')
        let params = freezId

        console.log('freez_id:', freezId);
        // let params = { freez_id: freezId }
        console.log("svid", this.props.match.params.id)
        let res = await StockVerificationService.getStockVerificationByID(params)
        console.log('itemcodes', res);

        if (res.status == 200) {

            console.log("item codes", res.data.view.data)

            this.setState({
                stock_verification_freez_item: res.data.view.data,
                total_stock_verification_freez_item: res.data.view.totalItems,
                loading: true,

            })

            console.log("2nd time", res.data.view)
        }
    }

    async getBatchInfo(e) {

        let params = { ...this.state.formData }
        params.item_batch_bin_id = this.state.formData.item_batch_bin_id
        params.search = e

        let res = await InventoryService.fetchItemBatchByItem_Id(params)

        console.log('batchinfo', res)

        if (res.status === 200) {
            console.log('check batch info', res.data.view.data)
            this.setState({
                batchInfo: res.data.view.data
            })
        }

    }



    async getAllBinStocks() {
        this.setState({ loading: false, tableLoaded: false })

        const query = new URLSearchParams(this.props.match.url);
        const warehouseId = query.get('warehouse_id')
        console.log('warehouse_id:', warehouseId);
        const itemId = query.get('item_id')
        console.log('item_id:', itemId);
        const searchParams = new URLSearchParams(this.props.match.url);
        const id = searchParams.get('id')

        //     verification_item_id: id


        let params = this.state.filterData
        params.warehouse_id = warehouseId
        params.item_id = itemId
        params.not_in_verification = true
        params.verification_item_id = id
        params.status = ['Active', 'FREEZED']
        // { warehouse_id: warehouseId, item_id: itemId, not_in_verification: true, verification_item_id: id, status: ['Active', 'FREEZED'] }
        console.log("svid", this.props.match.params.id)
        let res = await StockVerificationService.getAllBinStocks(params)
        console.log('freezItem', res);

        if (res.status == 200) {

            console.log("freez item", res.data.view.data)

            this.setState({
                all_bin_stocks: res.data.view.data,
                total_all_bin_stocks: res.data.view.totalItems,
                loading: true,
                tableLoaded: true



            }, () => {

                this.getReceiveQuantity()
                this.getIssuanceQuantity()
            })



            console.log("2nd time", res.data.view)
        }
    }

    async getVerificationItemBatches() {
        this.setState({ loading: false, tableLoaded: false })


        const searchParams = new URLSearchParams(this.props.match.url);
        const id = searchParams.get('id')
        console.log('itembhhhatches ', id);


        let params = { verification_item_id: id }
        console.log("svid", this.props.match.params.id)
        let res = await StockVerificationService.getVerificationItemBatches(params)
        console.log('itembatches', res);

        if (res.status == 200) {

            console.log("verification item batches", res.data.view.data)

            this.setState({
                verification_item_batches: res.data.view.data,
                total_verification_item_batches: res.data.view.totalItems,
                loading: true,
                tableLoaded: true

            })

            console.log("2nd time", res.data.view)
        }
    }


    async editItemBatches(data) {
        this.setState({ editSubmitting: true })

        let formData = { remark: data.remark, count_quantity: data.count_quantity };


        let res = await StockVerificationService.editItemBatches(data.id, formData)
        console.log("edit formdata", formData)
        console.log("edit formdata id", data.id)
        console.log("edit item batches", res)
        if (res.status === 200) {
            this.setState({
                alert: true,
                message: 'Edit Item Batche Successfully!',
                severity: 'success',
                editSubmitting: false
            }
                , () => {
                    this.setPage(0)
                }
            )
        } else {
            this.setState({
                alert: true,
                message: 'Edit Item Batche Unsuccessful!',
                severity: 'error',
                editSubmitting: false
            })
        }
    }



    handleTabChange = (event, newValue) => {




        this.setState({ activeTab: newValue })
    }


    async getAllItemBatches() {
        this.setState({ loading: false })


        const searchParams = new URLSearchParams(this.props.match.url);
        const itemId = searchParams.get('item_id')
        const warehouseId = searchParams.get('warehouse_id')
        console.log('allitembatnnnnnnnnches', itemId, warehouseId);
        let params = this.state.newFilterData

        params.item_id = itemId
        params.warehouse_id = warehouseId
        params.not_in_my_warehouse = true
        console.log("svid", this.props.match.params.id)
        let res = await StockVerificationService.getAllItemBatches(params)
        console.log('allitembatches', res);

        if (res.status == 200) {

            console.log("all item batches", res.data.view.data)

            this.setState({
                get_all_item_batches: res.data.view.data,
                total_all_item_batches: res.data.view.totalItems,
                all_item_batches: res.data.view.data.map(x => x?.batch_no),
                loading: true,


            })

            console.log("totalitems", res.data.view.totalItems)
            console.log("all_item_batches", res.data.view.data.map(x => x?.batch_no))
        }
    }


    async getReceiveQuantity() {
        this.setState({ loading: false })

        const searchParams = new URLSearchParams(this.props.match.url);
        const warehouseId = searchParams.get('warehouse_id')
        const itemId = searchParams.get('item_id')
        const itemBatchId = this.state.all_bin_stocks.map((x) => x?.item_batch_id)
        console.log('receiveId', this.state.all_bin_stocks.map((x) => x?.item_batch_id))
        let param = {
            warehouse_id: warehouseId,
            item_id: itemId,
            issuance: true,
            item_batch_id: itemBatchId,
            group_by_batch: true,
            serch_type: 'SUM',
            receive: true,


        }

        console.log('param', param)
        let res = await WarehouseServices.getAdditionalData(param)

        console.log('getreceivequantity', res)


        if (res.status == 200) {

            console.log("receive quantity", res.data.view.data)

            this.setState({
                get_receive_quantity: res.data.view.data,
                total_get_receive_quantity: res.data.view.totalItems,
                loading: true,


            })

            console.log("total receive items", res.data.view.totalItems)
        }
    }

    async getIssuanceQuantity() {

        this.setState({ loading: false })

        const searchParams = new URLSearchParams(this.props.match.url);
        const warehouseId = searchParams.get('warehouse_id')
        const itemId = searchParams.get('item_id')
        const itemBatchId = this.state.all_bin_stocks.map((x) => x?.item_batch_id)
        console.log('all', this.state.all_bin_stocks)
        console.log('itembatchid', itemBatchId)
        let param = {
            warehouse_id: warehouseId,
            item_id: itemId,
            issuance: true,
            item_batch_id: itemBatchId,
            group_by_batch: true,
            serch_type: 'SUM',
            issuance: true,


        }
        let res = await WarehouseServices.getAdditionalData(param)

        console.log('getissuancequantity', res)

        if (res.status == 200) {

            console.log("receive quantity", res.data.view.data)

            this.setState({
                get_issuance_quantity: res.data.view.data,
                total_get_issuance_quantity: res.data.view.totalItems,
                loading: true,


            })

            console.log("total issuance items", res.data.view.totalItems)
        }
    }



    async warehouseBins() {
        this.setState({ loadingWarehouseBins: false })

        const query = new URLSearchParams(this.props.match.url);
        const warehouseId = query.get('warehouse_id')
        let params = { warehouse_id: warehouseId }

        console.log('warehouse_id:', warehouseId);

        console.log("svid", this.props.match.params.id)
        let res = await StockVerificationService.getWarehouseBins(params)
        console.log('warehousebins', res);

        if (res.status == 200) {

            console.log("warehouse bins", res.data.view.data)

            this.setState({
                warehouse_bins: res.data.view.data,

                loadingWarehouseBins: true,

            })

            console.log("2nd time", res.data.view)
        }
    }

    async getVerificationDetailsByID() {

        const query = new URLSearchParams(this.props.match.url);
        let params =query.get('id')
        console.log('ddddddddItems', params);
        let res = await StockVerificationService.verificationItemById(params)
        console.log('Items', res);
        this.setState({
            item_code: res.data.view,

        })
        console.log('Items', res.data.view);
    }




    componentDidMount() {

        const searchParams = new URLSearchParams(this.props.match.url);
        const id = searchParams.get('id')
        const warehouse_id = searchParams.get('warehouse_id')
        console.log('itembhhhajjjjtches ', id, warehouse_id);
        this.stockVerificationGetById()
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.getVerificationItemBatches()
            }
        )
    }

    async setAllItemBatchePage(page) {
        //Change paginations
        let newFilterData = this.state.newFilterData
        newFilterData.page = page
        this.setState(
            {
                newFilterData,
            },
            () => {
                this.getAllItemBatches()
            }
        )
    }



    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                    <CardTitle title={"Batch View"} />

                        <ValidatorForm
                            ref="form"
                            className="pt-2"
                            onSubmit={() => { this.setPage(0) }}
                        >

                            <Grid container spacing={2} className="p-2" style={{border:'1px solid #18FFFF', borderRadius:'5px', backgroundColor:'#ccebff'}}>

                                <Grid
                                    className=" w-full flex " item lg={6} md={6} sm={12} xs={12}
                                >

                                    <SubTitle title=" Stock Take No: " />
                                    &nbsp;
                                    <SubTitle title={this.state.verification_get_by_id.stock_take_no} />

                                </Grid>

                                <Grid
                                    className=" w-full flex " item lg={6} md={6} sm={12} xs={12}
                                >

                                    <SubTitle title="Institution: " />
                                    &nbsp;
                                    <SubTitle title={this.state.verification_get_by_id?.Stock_Verification?.Pharmacy_drugs_store?.name + '-' + this.state.verification_get_by_id?.Stock_Verification?.Pharmacy_drugs_store?.Department?.name} />

                                </Grid>




                                <Grid
                                    className=" w-full flex " item lg={6} md={6} sm={12} xs={12}
                                >

                                    <SubTitle title="Warehouse Code:" />
                                    &nbsp;
                                    <SubTitle title={this.state.verification_get_by_id?.Warehouse?.name} />

                                </Grid>

                                <Grid
                                    className=" w-full flex " item lg={6} md={6} sm={12} xs={12}
                                >

                                    <SubTitle title="Item Code:" />
                                    &nbsp;
                                    <SubTitle title={this.state.item_code?.ItemSnap?.medium_description} />

                                </Grid>



                            </Grid>

                            &nbsp;


                            <Tabs
                                value={this.state.activeTab}
                                onChange={this.handleTabChange}
                                style={{
                                    minHeight: 39,
                                    height: 26,
                                }}
                                indicatorColor="primary"
                                variant="fullWidth"
                                textColor="primary"
                            >
                                <Tab label="Batches" />
                                <Tab label="Counted Batches" />

                            </Tabs>



                            &nbsp;

                            {this.state.activeTab == 0 ? (
                                <div>

                                    {this.state.tableLoaded ?
                                        <LoonsTable
                                            id={"clinicDetails"}
                                            data={this.state.all_bin_stocks}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.total_all_bin_stocks,
                                                rowsPerPage: this.state.filterData.limit,
                                                page: this.state.filterData.page,

                                                onTableChange: (action, tableState) => {
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage(tableState.page)
                                                            break
                                                        case 'sort':
                                                            break
                                                        default:
                                                            console.log(
                                                                'action not handled.'
                                                            )
                                                    }
                                                },
                                            }}
                                        >{ }</LoonsTable> : (
                                            //load loading effect
                                            <Grid className="justify-center text-center w-full pt-12">
                                                <CircularProgress size={30} />
                                            </Grid>
                                        )}


                                    <Grid justifyContent="space-between" className=" w-full flex justify-start " item lg={12} md={12} sm={12} xs={12}>

                                        {/* <Button className="m-1 button-primary" disabled={this.state.actionDisabled} variant="outlined" onClick={() => { this.getAllItemBatches(); this.warehouseBins(); this.setState({ viewDailog: true }); }}>
                                            <AddIcon />
                                            Add Batch
                                        </Button>
                                        &nbsp; */}
                                        <Button
                                            className="m-1 button-danger"

                                            onClick={() => {
                                                window.history.back()

                                            }}

                                        >
                                            <span className="capitalize">Back</span>
                                        </Button>
                                    </Grid>
                                </div>

                            ) : null}



                            {this.state.activeTab == 1 ? (
                                <div>

                                    {this.state.tableLoaded ?
                                        <LoonsTable
                                            id={"clinicDetails"}
                                            data={this.state.verification_item_batches}
                                            columns={this.state.counted_column}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: 20,
                                                page: this.state.filterData.page,

                                                onTableChange: (action, tableState) => {
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage(tableState.page)
                                                            break
                                                        case 'sort':
                                                            break
                                                        default:
                                                            console.log(
                                                                'action not handled.'
                                                            )
                                                    }
                                                },
                                            }}
                                        >{ }</LoonsTable> : (
                                            //load loading effect
                                            <Grid className="justify-center text-center w-full pt-12">
                                                <CircularProgress size={30} />
                                            </Grid>
                                        )}


                                    <Grid justifyContent="space-between" className=" w-full flex justify-start " item lg={12} md={12} sm={12} xs={12}>



                                        {/* <Button
                                            className="m-1 button-primary"

                                            onClick={() => {


                                            }}

                                        >
                                            <span className="capitalize">Finish</span>
                                        </Button> */}
                                    </Grid>



                                </div>
                            ) : null}



                            <Grid className="flex mt-5">
                                <Dialog fullScreen open={this.state.viewDailog}>
                                    <DialogTitle>Add Batches</DialogTitle>
                                    <LoonsCard>



                                        <ValidatorForm
                                            ref="form"

                                            onSubmit={() => { this.setAllItemBatchePage(0) }}
                                        >
                                            &nbsp;
                                            <Grid className="flex">
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={3}
                                                    md={3}
                                                    sm={12}
                                                    xs={12}
                                                >

                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Search"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth"
                                                        variant="outlined"
                                                        size="small"
                                                        // value={this.state.formData.get_all_item_batches}
                                                        onChange={(e, value) => {
                                                            let newFilterData = this.state.newFilterData
                                                            newFilterData.batch_no = e.target.value
                                                            this.setState({ newFilterData })
                                                            console.log(
                                                                'new filter',
                                                                this.state.newFilterData
                                                            )
                                                        }}
                                                        /* validators={[
                                                                    'required',
                                                                    ]}
                                                                    errorMessages={[
                                                                    'this field is required',
                                                                    ]} */
                                                        InputProps={{}}
                                                    /*  validators={['required']}
                                            errorMessages={[
                                             'this field is required',
                                            ]} */
                                                    />
                                                </Grid>
                                                &nbsp;
                                                <Button
                                                    className="text-right  ml-1  mt-1"
                                                    progress={false}
                                                    scrollToTop={false}
                                                    type='submit'
                                                    startIcon="search"
                                                    onClick={() => {

                                                    }}
                                                >
                                                    <span className="capitalize">Search</span>
                                                </Button>
                                            </Grid>


                                            <LoonsTable
                                                id={"clinicDetails"}
                                                data={this.state.get_all_item_batches}
                                                columns={this.state.post_column}
                                                options={{
                                                    pagination: true,
                                                    serverSide: true,
                                                    count: this.state.total_all_item_batches,
                                                    rowsPerPage: 10,
                                                    page: this.state.newFilterData.page,

                                                    onTableChange: (action, tableState) => {
                                                        switch (action) {
                                                            case 'changePage':
                                                                this.setAllItemBatchePage(tableState.page)
                                                                break
                                                            case 'sort':
                                                                break
                                                            default:
                                                                console.log(
                                                                    'action not handled.'
                                                                )
                                                        }
                                                    },
                                                }}
                                            >{ }</LoonsTable>

                                            &nbsp;

                                            <Grid className="flex" justifyContent="flex-start">
                                                <Button
                                                    className="button-danger"

                                                    onClick={() => {
                                                        this.setState({ viewDailog: false })

                                                    }}

                                                >
                                                    <span className="capitalize">Close</span>
                                                </Button>

                                            </Grid>

                                        </ValidatorForm>
                                    </LoonsCard>

                                </Dialog>

                            </Grid>
                        </ValidatorForm>
                    </LoonsCard>

                </MainContainer>

            </Fragment>

        )

    }
}

export default ApprovalBatchView