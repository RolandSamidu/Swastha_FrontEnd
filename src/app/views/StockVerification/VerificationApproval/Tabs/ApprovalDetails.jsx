import React, { Component, Fragment } from "react";
import { MainContainer, SubTitle } from "app/components/LoonsLabComponents";
import { Grid } from '@material-ui/core'
import { Button, } from 'app/components/LoonsLabComponents'
import { Typography, Box } from '@material-ui/core'
import IconButton from "@material-ui/core/IconButton";
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import LoonsTable from "app/components/LoonsLabComponents/Table/LoonsTable";
import { Autocomplete, } from "@material-ui/lab";
import LoonsCard from "app/components/LoonsLabComponents/LoonsCard";
import CardTitle from "app/components/LoonsLabComponents/CardTitle";
import Tooltip from "@material-ui/core/Tooltip";
import localStorageService from "app/services/localStorageService";

import VisibilityIcon from '@material-ui/icons/Visibility';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';
import StockVerificationService from "app/services/StockVerificationService";

import { dateParse } from "utils";
import { DatePicker } from 'app/components/LoonsLabComponents';
import WarehouseServices from "app/services/WarehouseServices";
import InventoryService from "app/services/InventoryService";
import AssignmentIcon from '@mui/icons-material/Assignment';


import StockTakingForm from "../../PrepareStockTake/Print/Stock_Tacking_form";
import Institution_Report from "../../PrepareStockTake/Print/institution_report";
import TallyReport from "../../PrepareStockTake/Print/tally_reporrt";
import { relativeTimeThreshold } from "moment";


class PendingApproval extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allWarehouses: [],
            buttonName: 'Filter',
            newButtonName: 'New',
            loading: false,
            stock_verification_data: [],
            warehouse_loaded: false,
            selectWarehouseView: false,
            warehouseData: {

            },

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

            institution: {
                first: null,
                mid: null,
                end: null
            },
            regno2: true,
            filterData: {
                page: 0,
                limit: 10,
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
            data: [],

            columns: [
                {
                    name: 'stock_take_no',
                    label: 'Stock Take No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification_Freez?.stock_take_no

                        },
                    },
                },
                {
                    name: 'stock_take_date',
                    label: 'Stock Take Date',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification_Freez?.stock_take_date)


                        },
                    },

                },
                {
                    name: 'warehouse_code',
                    label: 'Warehouse Code',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification_Freez?.Warehouse?.name

                        },
                    },

                },
                // {
                //     name: 'institution',
                //     label: 'Institution',
                //     options: {
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification?.Pharmacy_drugs_store?.name + '-' + this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification?.Pharmacy_drugs_store?.Department?.name

                //         },
                //     },
                // },
                // {
                //     name: 'freezed_by',
                //     label: 'Freezed By',
                //     options: {
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return this.state.stock_verification_data[tableMeta.rowIndex]?.Employee?.name

                //         },
                //     },
                // },
                {
                    name: 'status',
                    label: 'Status',

                    options: {
                        filter: true,
                    },
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
                                                this.printData(this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification_Freez?.id, 'H104')
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
                                                this.printData(this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification_Freez?.id, 'H167')
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
                                                this.printData(this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification_Freez?.id, 'tally')
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
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="View">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                window.location.href = `/stock_Verification/approval_item_list/${this.state.stock_verification_data[tableMeta.rowIndex]?.id}?owner_id=${this.state.stock_verification_data[tableMeta.rowIndex]?.owner_id}&freez_id=${this.state.stock_verification_data[tableMeta.rowIndex]?.Stock_Verification_Freez?.id}`
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            );
                        }

                    }
                },

            ],


        }
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


    async loadData() {
        var user = await localStorageService.getItem('owner_id')
        var userInfo = await localStorageService.getItem('userInfo')
        console.log('userinforr', userInfo)
        let params = this.state.filterData
        params.owner_id = user
        params.status = 'Pending'
        params.approval_user_type = userInfo.roles

        let res = await StockVerificationService.getStockVerificationApproval(params)

        if (res.status === 200) {

            console.log("stock verification data", res.data.view.data)
            console.log("stock verification totalItem", res.data.view.totalItems)
            this.setState({
                stock_verification_data: res.data.view.data,
                total_stock_verification_data: res.data.view.totalItems,
                loading: true,
            })
        }
    }

    componentDidMount() {
        this.loadData()
        // this.stockVerificationAccountantDetails()

    }


    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }






    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={"Pending Approval"} />

                        <ValidatorForm
                            ref="form"
                            className="pt-2"
                            onSubmit={() => { this.setPage(0) }}
                        >

                            <Grid container spacing={2} >
                                <Grid
                                    item lg={3} md={3} sm={12} xs={12}
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
                                    item lg={3} md={3} sm={12} xs={12}
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
                                </Grid>

                                <Grid
                                    item lg={3} md={3} sm={12} xs={12}
                                >

                                    <SubTitle title="Warehouse Codes" />

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

                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <Button
                                        className="mt-6 button-info"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                    >
                                        <span className="capitalize">{this.state.buttonName}</span>
                                    </Button>
                                </Grid>
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

                </MainContainer>

            </Fragment>

        )

    }
}

export default PendingApproval
