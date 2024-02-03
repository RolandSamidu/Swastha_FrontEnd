import React, { Component, Fragment } from "react";
import { LoonsSnackbar, MainContainer, SubTitle } from "../../../components/LoonsLabComponents";
import { Grid } from '@material-ui/core'
import { Button, } from 'app/components/LoonsLabComponents'
import { Typography, Box } from '@material-ui/core'
import VehicleService from "../../../services/VehicleService";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import LoonsTable from "../../../components/LoonsLabComponents/Table/LoonsTable";
import { Autocomplete, TimelineSeparator } from "@material-ui/lab";
import LoonsCard from "../../../components/LoonsLabComponents/LoonsCard";
import CardTitle from "../../../components/LoonsLabComponents/CardTitle";
import Tooltip from "@material-ui/core/Tooltip";
import LoonsSwitch from "../../../components/LoonsLabComponents/Switch";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import localStorageService from "app/services/localStorageService";
import * as appConst from '../../../../appconst';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';
import StockVerificationService from "../../../services/StockVerificationService";
import EstimationService from 'app/services/EstimationService';
import { dateParse } from "utils";
import { DatePicker } from 'app/components/LoonsLabComponents';
import WarehouseServices from "app/services/WarehouseServices";
import InventoryService from "app/services/InventoryService";
import AssignmentIcon from '@mui/icons-material/Assignment';


import StockTakingForm from "./Print/Stock_Tacking_form";
import Institution_Report from "./Print/institution_report";
import TallyReport from "./Print/tally_reporrt";
import { rootShouldForwardProp } from "@mui/material/styles/styled";
import LoonsDiaLogBox from "app/components/LoonsLabComponents/Dialogbox";


class ViewManageStock extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allWarehouses: [],
            buttonName: 'Filter',
            newButtonName: 'New Verification',
            loading: false,
            stock_verification_data: [],
            warehouse_loaded: false,
            selectWarehouseView: false,
            verificationDetails: [],
            actionsDisabled: false,
            updateButtonDisabled: false,
            warehouseData: {

            },
            warning_msg: false,
            select_freezId: null,
            printData104: [],
            printData167: [],
            printloaded: false,
            printloaded167: false,
            printed_user: null,
            printDataTally: [],
            printloadedTally: false,
            itemData167: [],
            itemData104: [],
            issue_qty: [],
            is_data_load: false,
            updateFunction: false,

            institution: {
                first: null,
                mid: null,
                end: null
            },
            regno2: true,
            filterData: {
                stock_take_no: null,
                stock_take_date: null,
                warehouse_id: null,
                item_id: null,
                page: 0,
                limit: 10,
                // type: ["Helper", "Driver"]

                'order[0]': [
                    'updatedAt', 'DESC'
                ],
            },
            item_list: [],

            formData: {

                institution: '',
                ending_code_item: '',
                starting_item_code: '',
                warehouse_id: null,
                stock_take_date: null,
                conditions: {
                    group_id: null,
                    start_sr_no: null,
                    end_sr_no: null,
                }


            },
            data: [
                // { stock_take_no: "12", stock_take_date: "12/06/2023", warehouse_code: 'AR22', institution: 'testInstitution', status: 'test', freezed_by: 'test', verification_officers: 4, },
                // { stock_take_no: "12", stock_take_date: "12/06/2023", warehouse_code: 'AR22', institution: 'testInstitution', status: 'test', freezed_by: 'test', verification_officers: 4, },
                // { stock_take_no: "12", stock_take_date: "12/06/2023", warehouse_code: 'AR22', institution: 'testInstitution', status: 'test', freezed_by: 'test', verification_officers: 4, },
                // { stock_take_no: "12", stock_take_date: "12/06/2023", warehouse_code: 'AR22', institution: 'testInstitution', status: 'test', freezed_by: 'test', verification_officers: 4, },
                // { stock_take_no: "12", stock_take_date: "12/06/2023", warehouse_code: 'AR22', institution: 'testInstitution', status: 'test', freezed_by: 'test', verification_officers: 4, },
                // { stock_take_no: "12", stock_take_date: "12/06/2023", warehouse_code: 'AR22', institution: 'testInstitution', status: 'test', freezed_by: 'test', verification_officers: 4, }

            ],

            columns: [
                {
                    name: 'stock_take_no',
                    label: 'Stock Take No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_data[tableMeta.rowIndex]?.stock_take_no

                        },
                    },
                },
                {
                    name: 'stock_take_date',
                    label: 'Stock Take Date',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(this.state.stock_verification_data[tableMeta.rowIndex]?.stock_take_date)


                        },
                    },

                },
                {
                    name: 'warehouse_code',
                    label: 'Warehouse Code',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_data[tableMeta.rowIndex]?.Warehouse?.name

                        },
                    },

                },
                {
                    name: 'institution',
                    label: 'Institution',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification?.Pharmacy_drugs_store?.name + '-' + this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification?.Pharmacy_drugs_store?.Department?.name

                        },
                    },
                },
                {
                    name: 'freezed_by',
                    label: 'Freezed By',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_data[tableMeta.rowIndex]?.Employee?.name

                        },
                    },
                },


                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_data[tableMeta.rowIndex]?.status

                        },
                    }


                },

                {
                    name: "h104",
                    label: "H104",
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="H104">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                this.printData(this.state.stock_verification_data[tableMeta.rowIndex]?.id, 'H104')
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <DescriptionSharpIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            );
                        }

                    }
                },

                {
                    name: "h167",
                    label: "H167",
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="H167">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                this.printData(this.state.stock_verification_data[tableMeta.rowIndex]?.id, 'H167')
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <DescriptionOutlinedIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            );
                        }

                    }
                },
                {
                    name: "tally_report",
                    label: "Tally Report",
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="Tally Report">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                this.printData(this.state.stock_verification_data[tableMeta.rowIndex]?.id, 'tally')
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <AssignmentIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            );
                        }

                    }
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





                            let index = tableMeta.rowIndex
                            console.log('index', index)


                            return (
                                <Grid className="flex items-center">

                                    <Tooltip title="View">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                const query = new URLSearchParams(this.props.location.search);
                                                const searchOwnerId = query.get('owner_id')

                                                const pathname = window.location.pathname;
                                                const segments = pathname.split('/');
                                                const id = segments[segments.length - 1];
                                                console.log('id', id);

                                                window.location.href = `/StockTake/${id}?owner_id=${searchOwnerId}&freez_id=${this.state.stock_verification_data[tableMeta.rowIndex]?.id}`
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>


                                    <Tooltip title="Update">


                                        <Button


                                            progress={false}
                                            disabled={this.state.stock_verification_data[tableMeta.rowIndex]?.status !== 'APPROVED'}
                                            scrollToTop={true}
                                            onClick={() => {

                                                // this.verificationFreezUpdateStatus(index)
                                                this.setState({
                                                    warning_msg: true,
                                                    select_freezId: this.state.stock_verification_data[tableMeta.rowIndex].id
                                                })


                                                console.log('check')

                                            }}

                                        >
                                            <span className="capitalize">Unfreez</span>
                                        </Button>


                                    </Tooltip>

                                </Grid>
                            );
                        }

                    }
                },

            ],


        }
    }

    async printData(id, type) {
        console.log('cheking selected id', id, type)
        var user = await localStorageService.getItem('userInfo').name;
        this.setState({ printloaded: false, })
        const chunkSize = 500
        const chunkedArrays = [];
        let res
        if (type === 'H167' || type === 'H104') {
            res = await StockVerificationService.getStockVerificationFreezItems({ freez_id: id })  // 6fe52af5-7940-47ab-8799-fe08ee549def
        } else if (type === 'tally') {
            res = await StockVerificationService.getVerificationItemBatches({ freez_id: id })
        }

        console.log('cheking sefgdgdg', res)

        let totalItems
        if (res.status === 200) {
            totalItems = res.data.view.totalItems

            // Split the items array into smaller chunks
            const data = [];
            // Call the getPackDetails function for each chunk and merge the results
            for (let i = 0; i < totalItems / chunkSize; i++) {
                let chunkData
                if (type === 'H104') {
                    chunkData = await this.printFunc104(id, i, chunkSize);
                } else if (type === 'H167') {
                    chunkData = await this.printFunc167(id, i, chunkSize);
                } else if (type === 'tally') {
                    chunkData = await this.printFuncTally(id, i, chunkSize);
                }

                data.push(...chunkData);
                console.log('all data', data)
            }

            if (type === 'H104') {
                this.setState({ printData104: data, printed_user: user, itemData104: res.data.view.data, is_data_load: true, })
            } else if (type === 'H167') {
                this.setState({ printData167: data, printloaded167: true, printed_user: user, itemData167: res.data.view.data },
                    () => {
                        this.render()

                        console.log('printData167', this.state.printData167)
                        setTimeout(() => {
                            document.getElementById('print_presc_167').click();
                        }, 3000);

                    })
            } else if (type === 'tally') {
                this.setState({ printDataTally: data, printloadedTally: true, printed_user: user },
                    () => {
                        this.render()
                        setTimeout(() => {
                            document.getElementById('print_presc_tally').click();
                        }, 3000);

                    })
            }


        }

    }


    async printFuncTally(inc_id, page, limit) {
        console.log('cheking pass data', inc_id, page, limit)
        let params = {
            freez_id: inc_id,
            page: page,
            limit: limit
        }

        let res = await StockVerificationService.getVerificationItemBatches(params)

        if (res.status === 200) {
            console.log('cheking tally data', res)
            if (res.status == 200) {
                console.log("data", res.data.view.data);
                return res.data.view.data
            } else {
                return []

            }
        }
    }


    async printFunc104(inc_id, page, limit) {
        console.log('cheking pass data 167', inc_id, page, limit)
        let params = {
            freez_id: inc_id, // 6fe52af5-7940-47ab-8799-fe08ee549def
        }

        let res = await StockVerificationService.getVerificationItemBatches(params)
        let updatedArray = []
        if (res.status === 200) {
            console.log('cheking 167 data', res)
            if (res.status == 200) {
                let batch_data = res.data.view.data
                this.getIssuanceQuantity(batch_data)
                return res.data.view.data

            } else {
                return []

            }
        }
    }

    async printFunc167(inc_id, page, limit) {
        console.log('cheking pass data 167', inc_id, page, limit)
        let params = {
            freez_id: inc_id, // 6fe52af5-7940-47ab-8799-fe08ee549def
        }

        let res = await StockVerificationService.getVerificationItemBatches(params)

        if (res.status === 200) {
            console.log('cheking 167 data', res)
            if (res.status == 200) {
                console.log("data 167", res.data.view.data);
                return res.data.view.data
            } else {
                return []

            }
        }
    }

    // async stockVerificationGetById() {
    //     this.setState({ loadingById: false })



    //     let res = await StockVerificationService.verificationGetById(id)
    //     console.log('res get by id', res);
    //     if (res.status == 200) {


    //         console.log("verification get by id", res.data.view)
    //         this.setState({
    //             verificationDetails: res.data.view,

    //             loadingById: true,
    //         })

    //         console.log("2nd time", res.data.view)
    //     }
    // }


    async getIssuanceQuantity(batch_data) {
        let param;

        const outputArray = [];
        const resultArray = [];

        // Create an object to store the results
        const resultMap = {};

        batch_data.forEach((item) => {
            const stockVerificationItem = item.Stock_Verification_Item;
            const itemSnapBatchBin = item.ItemSnapBatchBin;

            const item_id = stockVerificationItem.item_id;
            const warehouse_id = stockVerificationItem?.Stock_Verification_Freez?.Warehouse?.id;
            const item_batch_id = itemSnapBatchBin.item_batch_id;

            if (resultMap[item_id]) {
                resultMap[item_id].batch_ids.push(item_batch_id);
            } else {
                resultMap[item_id] = { item_id, warehouse_id, batch_ids: [item_batch_id] };
            }
        });

        // Convert the resultMap into an array
        for (const item_id in resultMap) {
            outputArray.push(resultMap[item_id]);
        }

        for (let k = 0; k < outputArray.length; k++) {
            param = {
                warehouse_id: outputArray[k]?.warehouse_id,
                item_id: outputArray[k]?.item_id,
                issuance: true,
                item_batch_id: outputArray[k]?.batch_ids,
                group_by_batch: true,
                serch_type: 'SUM',
            };

            let res = await WarehouseServices.getAdditionalData(param);

            if (res.status === 200) {
                const itemData = {
                    item_id: outputArray[k]?.item_id,
                    data: res.data.view.data,
                };

                resultArray.push(itemData);
            }
        }


        this.setState({
            issue_qty: resultArray,
            printloaded: true
        },
            () => {
                this.render()
                setTimeout(() => {
                    document.getElementById('print_presc_104').click();
                }, 5000);
            })

        console.log('hfhhhfhfhfhfhfhfh', resultArray)

    }


    async getItem(value) {

        let data = {
            search: value
        }
        let res = await InventoryService.fetchAllItems(data)

        if (res.status === 200) {
            console.log("ITEM------------------------------->>", res)
            this.setState({ item_list: res.data.view.data })
        }
    }

    async getFreezStockVerification() {
        this.setState({ loading: false })
        let params = this.state.filterData
        params.stock_verification_id = this.props.match.params.id
        // let params = { stock_verification_id: this.props.match.params.id }
        console.log("svid", this.props.match.params.id)
        let res = await StockVerificationService.getStockVerificationFreezs(params)
        console.log('res22', res);
        console.log('id', this.props.match.params);
        if (res.status == 200) {

            console.log("stock verification data", res.data.view.data)
            console.log("stock verification totalItem", res.data.view.totalItems)
            this.setState({
                stock_verification_data: res.data.view.data,
                total_stock_verification_data: res.data.view.totalItems,
                loading: true,
            }, () => {
                this.DateRangeCheck()


            })

            console.log("2nd time", res.data.view)
        }
    }

    async DateRangeCheck() {

        const fromDate = dateParse(this.state.stock_verification_data[0]?.Stock_Verification?.from_date);
        const toDate = dateParse(this.state.stock_verification_data[0]?.Stock_Verification?.to_date);

        console.log('fromdate', fromDate)
        console.log('todate', toDate)
        const currentDate = dateParse(new Date())
        console.log('newDate', currentDate)


        if ((currentDate >= fromDate && currentDate <= toDate) || this.state.stock_verification_data.length == 0) {
            this.setState({
                actionsDisabled: false
            })
        } else {
            this.setState({
                actionsDisabled: true
            })
        }
    }




    async loadWarehouses() {
        this.setState({
            warehouse_loaded: false
        })
        // var user = await localStorageService.getItem('userInfo');
        // console.log('user', user)
        // var id = user.id;
        // var all_pharmacy_dummy = [];
        const query = new URLSearchParams(this.props.location.search);
        const searchOwnerId = query.get('owner_id')

        this.setState({
            searchOwnerId: searchOwnerId
        })

        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse')


        let params = { owner_id: searchOwnerId }
        let res = await WarehouseServices.getWarehoureWithOwnerId(searchOwnerId, params)
        console.log("CPALLOders", res)

        if (res.status == 200) {
            console.log("CPALLOders", res.data.view.data)

            // console.log("warehouse", all_pharmacy_dummy)
            this.setState({
                allWarehouses: res.data.view.data,
                warehouse_loaded: true
            })
        }
    }

    async verificationFreezUpdateStatus() {
        this.setState({
            warning_msg: false
        })


        let id = this.state.select_freezId

        console.log('freez id', id)




        let newstatus = {
            "status": "Updated"
        }
        let res = await StockVerificationService.updateStatus(id, newstatus)
        console.log('change status', res)
        if (res.status === 200) {
            this.setState({
                alert: true,
                severity: 'success',
                message: "Successfully Saved ",
            },
                () => {
                    window.location.reload()
                })
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Cannot Save ",
            })
        }


    }




    componentDidMount() {
        // this.loadWarehouses()
        this.getFreezStockVerification()
        this.loadWarehouses()
        // this.getFreezStockItem()
        console.log('props', this.props)
        // this.stockVerificationGetById()




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
                this.getFreezStockVerification()
            }
        )
    }






    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={"View & Manage Stock Takes"} />

                        <ValidatorForm
                            ref="form"
                            className="pt-2"
                            onSubmit={() => { this.setPage(0) }}
                        >

                            <Grid container spacing={1} className="flex " >
                                <Grid
                                    className=" w-full" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Stock Take No" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Enter Stock Take No:"
                                        name="stock_no"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.filterData.stock_take_no}
                                        onChange={(e) => {
                                            let filterData = this.state.filterData
                                            this.state.filterData.stock_take_no = e.target.value
                                            this.setState({ filterData })
                                        }}

                                    />

                                </Grid>

                                <Grid
                                    className=" w-full" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Stock Take Date" />

                                    <DatePicker

                                        className="w-full"
                                        value={this.state.filterData.stock_take_date}
                                        format='dd-MM-yyyy'
                                        // placeholder={`⊕ ${text}`}
                                        // errorMessages="this field is required"
                                        onChange={(date) => {
                                            let fd = this.state.filterData
                                            fd.stock_take_date = dateParse(date)
                                            this.setState({ fd })
                                            console.log("date eka", fd);
                                        }}

                                    />

                                    {/* <TextValidator
                                        className=" w-full"
                                        placeholder="Enter Stock Take Date:"
                                        name="stock_date"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.stock_take_date}
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.stock_take_date =
                                                e.target.value
                                            this.setState({ formData })
                                        }}

                                    /> */}

                                </Grid>


                                <Grid
                                    className=" w-full" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Warehouse Codes" />

                                    {/* <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allWarehouses}
                                        value={this.state.filterData.warehouse_id}
                                        // value={this.state.formData.allWarehouses}
                                        onChange={(e, value, r) => {
                                            if (null != value) {

                                                let filterData = this.state.filterData
                                                filterData.warehouse_id = value.value
                                                this.setState({ filterData })
                                            }
                                        }}
                                        // value={this.state.vehicleTypesData.find((v) => v.id === this.state.formData.vehicle_type_id)}
                                        getOptionLabel={
                                            (option) => option?.name
                                        }



                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Choose Warehouse Code"
                                                fullWidth
                                                variant="outlined"
                                                size="small"

                                            />
                                        )}
                                    /> */}

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        placeholder="Enter Warehouse Code"
                                        name="warehouse_id"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        options={this.state.allWarehouses}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let filterData = this.state.filterData
                                                filterData.warehouse_id = value.id



                                                this.setState({
                                                    filterData,

                                                })

                                            }
                                            else if (value == null) {
                                                let filterData = this.state.filterData
                                                filterData.warehouse_id = null
                                                this.setState({
                                                    filterData

                                                })
                                            }
                                        }}

                                        getOptionLabel={
                                            (option) => option?.name
                                        }
                                        renderInput={(params) => (
                                            <TextValidator {...params}
                                                placeholder="Enter Warehouse Code"
                                                //variant="outlined"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    if (e.target.value.length > 3) {
                                                        this.getItem(e.target.value);
                                                    }
                                                }}
                                                value={this.state.filterData.warehouse_id}


                                            />
                                        )} />

                                </Grid>



                                {/* <Grid
                                    className=" w-full " item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Item Codes:" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        placeholder="Enter Item Code"
                                        name="item_id"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        options={this.state.item_list}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let filterData = this.state.filterData
                                                filterData.item_id = value.id



                                                this.setState({
                                                    filterData,

                                                })

                                            }
                                            else if (value == null) {
                                                let filterData = this.state.filterData
                                                filterData.item_id = null
                                                this.setState({
                                                    filterData

                                                })
                                            }
                                        }}

                                        getOptionLabel={(option) => option.sr_no + ' - ' + option.medium_description}
                                        renderInput={(params) => (
                                            <TextValidator {...params}
                                                placeholder="Type SR or Name"
                                                //variant="outlined"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    if (e.target.value.length > 3) {
                                                        this.getItem(e.target.value);
                                                    }
                                                }}
                                                value={this.state.filterData.item_id}


                                            />
                                        )} />

                                </Grid> */}

                                {/* 
                                <Grid
                                    className=" w-full " item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title=" Batch No:" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Enter Batch No"
                                        name="batch_no"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.ending_code_item}
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.ending_code_item =
                                                e.target.value
                                            this.setState({ formData })
                                        }}

                                    />

                                </Grid> */}




                            </Grid>

                            <Grid justifyContent="space-between" className=" w-full flex justify-start mt-1" item lg={12}
                                md={12} sm={12} xs={12}>

                                <Button
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}

                                    className='mt-2'
                                >
                                    <span className="capitalize">{this.state.buttonName}</span>
                                </Button>

                            </Grid>


                            <Grid justifyContent="space-between" className=" w-full flex justify-start mt-5" item lg={12}
                                md={12} sm={12} xs={12}>



                                <Button
                                    // className="px-5  button"
                                    disabled={this.state.actionsDisabled}
                                    progress={false}
                                    type="button"
                                    scrollToTop={true}

                                    onClick={() => {
                                        const query = new URLSearchParams(this.props.location.search);
                                        const searchOwnerId = query.get('owner_id')
                                        window.location.href = `/mystocknew?owner_id=${searchOwnerId}`
                                    }}


                                >
                                    <span className="capitalize">{"Stock Checking"}</span>
                                </Button>
                                &nbsp;
                                <Button
                                    progress={false}
                                    disabled={this.state.actionsDisabled}
                                    type="submit"
                                    scrollToTop={true}
                                    onClick={() => {
                                        const query = new URLSearchParams(this.props.location.search);
                                        const searchOwnerId = query.get('owner_id')

                                        window.location.href = `/stockVerification/${this.props.match.params.id}?owner_id=${searchOwnerId}`

                                    }}

                                >
                                    <span className="capitalize">{this.state.newButtonName}</span>
                                </Button>
                            </Grid>





                            <Grid className="m-5" >

                                <Box sx={{ borderColor: 'button-info', border: 1, display: 'flex', justifyContent: 'space-evenly' }}>
                                    <Typography variant="title" color="inherit" noWrap>

                                        Freezed:


                                    </Typography>

                                    <Typography variant="title" color="inherit" noWrap>

                                        To be checked:


                                    </Typography>

                                    <Typography variant="title" color="inherit" noWrap>

                                        To be approved:


                                    </Typography>

                                    <Typography variant="title" color="inherit" noWrap>

                                        To be reverified:


                                    </Typography>


                                </Box>


                            </Grid>




                            <LoonsTable
                                id={"clinicDetails"}
                                data={this.state.stock_verification_data}
                                columns={this.state.columns}
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: this.state.total_stock_verification_data,
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
                            >{ }</LoonsTable>



                        </ValidatorForm>

                        <div className="hidden">


                            {this.state.printloaded && this.state.is_data_load &&
                                <Grid>
                                    {console.log('sdffffffffffffffff', this.state.issue_qty)}
                                    <StockTakingForm printed_user={this.state.printed_user} printData104={this.state.printData104} itemData104={this.state.itemData104} issue_qty={this.state.issue_qty}></StockTakingForm>
                                </Grid>
                            }

                            {this.state.printloaded167 &&
                                <Grid>
                                    <Institution_Report printed_user={this.state.printed_user} printData167={this.state.printData167} itemdata167={this.state.itemData167}></Institution_Report>
                                </Grid>
                            }

                            {this.state.printloadedTally &&
                                <Grid>
                                    <TallyReport printed_user={this.state.printed_user} printDataTally={this.state.printDataTally}></TallyReport>
                                </Grid>
                            }


                        </div>






                    </LoonsCard>


                    <LoonsDiaLogBox

                        title="Are you sure?"
                        show_alert={true}
                        alert_severity="info"
                        alert_message=" Please Add Batch details before Finish"
                        //message="testing 2"
                        open={this.state.warning_msg}
                        show_button={true}
                        show_second_button={true}
                        btn_label="No"
                        onClose={() => {
                            this.setState({ warning_msg: false })
                        }}
                        second_btn_label="Yes"
                        secondButtonAction={() => {


                            this.setState({ warning_msg: false }, () => { this.verificationFreezUpdateStatus() })


                        }}
                    >
                    </LoonsDiaLogBox>

                </MainContainer>

            </Fragment>

        )

    }
}

export default ViewManageStock
