import {
    CircularProgress,
    Dialog,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core';
import { Button } from '@material-ui/core'
import {
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    SubTitle
} from 'app/components/LoonsLabComponents';
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import 'date-fns'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents';
import FilterComponent from '../filterComponent';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import { Autocomplete } from '@material-ui/lab';
import RemarkServices from 'app/services/RemarkServices';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import localStorageService from 'app/services/localStorageService';
import DistributionCenterServices from 'app/services/DistributionCenterServices';
import { dateTimeParse,dateParse, roundDecimal } from "utils";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import InventoryService from 'app/services/InventoryService';

class HistoryAllocated extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            data: [],

            columns: [
                {
                    name: 'Issue',
                    label: 'From',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.OrderExchange?.fromStore?.name
                            
                        }
                    }
                },
                {
                    name: 'issued_quantity',
                    label: 'Issued Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('cheling data info', this.state.data[tableMeta.rowIndex])

                            if (this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EUV2') {
                                return roundDecimal(this.state.data[tableMeta.rowIndex]?.issued_quantity * this.state.data[tableMeta.rowIndex]?.ItemSnap?.item_unit_size , 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit?.name
                            } else {
                                return this.state.data[tableMeta.rowIndex]?.issued_quantity
                            }
                            
                        }
                    }
                    
                }, {
                    name: 'request_quantity',
                    label: 'Request Quantity',
                    options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EUV2') {
                            return roundDecimal(this.state.data[tableMeta.rowIndex]?.request_quantity * this.state.data[tableMeta.rowIndex]?.ItemSnap?.item_unit_size , 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit?.name
                        } else {
                            return this.state.data[tableMeta.rowIndex]?.request_quantity
                        }
                        
                    }
                }
                   
                }, {
                    name: 'Issue',
                    label: 'Issued Date',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(this.state.data[tableMeta.rowIndex].updatedAt)
                            
                        }
                    }
                },{
                    name: 'status',
                    label: 'Status',
                    options: {
                        // filter: true,
                    }
                }
            ],
            filterData: {
                page: 0,
                limit: 10,
                from:this.props.from,
                item_id:this.props.itemId,
                status:['ALL RECEIVED','ISSUE SUBMITTED',"ALL ISSUED","PARTIAL RECEIVED"],
                to_owner_id:'000'
                
            }

        }
    }

    async loadData() {
        let res = await PharmacyOrderService.getOrderItems(this.state.filterData)
        if (res.status == 200) {
            console.log("Order Item Data", res.data.view.data)
            this.setState({
                data: res.data.view.data,
                totalItems:res.data.view.totalItems,
                loaded:true
            })
        }
    }

    componentDidMount() {
        this.loadData()
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {

            this.loadData()
        })
    }

    render() {
        return (
            <> {
                this.state.loaded
                    ? <LoonsTable
                        options={{
                            pagination: true,
                            serverSide: true,
                            count: this.state.totalItems,
                            rowsPerPage: this.state.filterData.limit,
                            page: this.state.filterData.page,
                            totalItems:this.setState.totalItems,
                            print: true,
                            viewColumns: true,
                            download: true,
                            onTableChange: (action, tableState) => {
                                console.log(action, tableState)
                                switch (action) {
                                    case 'changePage':
                                        this.setPage(tableState.page)
                                        break
                                    case 'sort':
                                        // this.sort(tableState.page, tableState.sortOrder);
                                        break
                                    default:
                                        console.log('action not handled.')
                                }
                            }
                        }}
                        data={this.state.data}
                        columns={this.state.columns} />
                    : (
                        //loading effect
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress size={30} />
                        </Grid>
                    )
            }


                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"></LoonsSnackbar>
            </>
        )
    }
}

export default HistoryAllocated