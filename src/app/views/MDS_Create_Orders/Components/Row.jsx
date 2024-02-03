import React, {Component, Fragment, useState} from 'react'
import {withStyles} from '@material-ui/core/styles'
import Box from "@material-ui/core/Box"
import Collapse from "@material-ui/core/Collapse"
import IconButton from "@material-ui/core/IconButton"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { TextField } from '@material-ui/core'
import { LoonsSnackbar } from 'app/components/LoonsLabComponents'

const styleSheet = (theme) => ({
    table: {
        width: '100%'
    }
})

class Row extends Component {

    constructor(props) {
        super(props)
        this.state = {
            row: [],
            open: false,
            message:null,
            severity:null,
            alert:false,
        }
    }

    componentDidMount() {
        console.log("props", this.props);
    }

    exceedFunction(){
        document.getElementById(this.props.row.warehouse_id).value = this.props.row.total_quantity
        this.props.onChangeFunc(this.props.row.warehouse_id,this.props.row.total_quantity,this.props.row.warehouse_name,this.props.row.total_quantity,10)
        this.setState({
            alert:true,
            message:"Store Quantity Exceeded.",
            //  Maxumim stock of "+document.getElementById(this.props.row.warehouse_id).value+" will be added.",
            severity:"Error"
        })

    }

    render() {

        return (
            <React.Fragment>
                <TableRow>
                    <td>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => {
                                if (this.state.open) {
                                    this.setState({open: false})
                                } else {
                                    this.setState({open: true})
                                }
                            }}>
                            {
                                this.state.open
                                    ? <KeyboardArrowUpIcon/>
                                    : <KeyboardArrowDownIcon/>
                            }
                        </IconButton>
                    </td>
                    {/* <td component="th" scope="row">{this.props.row.drugstore_id}</td> */}
                    <td>{this.props.row.warehouse_name}</td>
                    <td>
                        <TableRow>
                            <td
                                style={{
                                    paddingBottom: 0,
                                    paddingTop: 0
                                }}
                                colSpan={6}>
                                <Collapse in={this.state.open} timeout="auto" unmountOnExit="unmountOnExit">
                                    <Box margin={1}>
                                        <Table aria-label="Batches" style={styleSheet.table}>
                                            <TableHead>
                                                <TableRow className='h6'>
                                                    <td className='px-4'><strong>No.</strong></td>
                                                    <td className='px-4'><strong>Invoice No.</strong></td>
                                                    <td className='px-4'><strong>Batch No.</strong></td>
                                                    <td className='px-4'><strong>Expiry Date</strong></td>
                                                    <td className='px-4'><strong>Stock Qty</strong></td>
                                                </TableRow>
                                            </TableHead>

                                            {/* <TableBody>
                                               
                                                {
                                                     this.props.row.batchDetails.length != 0 ?
                                                    this
                                                        .props
                                                        .row
                                                        .batchDetails
                                                        .map((batch) => (
                                                            <TableRow key={batch.no}>
                                                                <td component="th" scope="row" className='px-4'>{batch.no}</td>
                                                                <td className='px-4'>{batch.invoiceNo}</td>
                                                                <td className='px-4'>{batch.batchNo}</td>
                                                                <td className='px-4'>{batch.expDate}</td>
                                                                <td className='px-4'>{batch.stockQty}</td>
                                                            </TableRow>
                                                        ))
                                                        :''
                                                }
                                            </TableBody> */}
                                        </Table>
                                    </Box>
                                </Collapse>
                            </td>
                        </TableRow>
                    </td>
                    <td>{this.props.row.warehouse_main_or_personal}</td>
                    <td id={this.props.row.warehouse_id}>{this.props.row.total_quantity}</td>
                    <td>
                        <TextField variant = "outlined" size = "small" className = " w-full" placeholder = "Order Qty"  onChange={(e) => {
                            (parseInt(e.target.value) <= parseInt(this.props.row.total_quantity)) ||  e.target.value == null || e.target.value == '' ?
                            this.props.onChangeFunc(this.props.row.warehouse_id,e.target.value,this.props.row.warehouse_name,this.props.row.total_quantity,10) : 
                            this.exceedFunction()
                                                    }
                            } type='number'></TextField>
                    </td>
                </TableRow>
                <LoonsSnackbar
                open={this.state.alert}
                onClose={() => {
                    this.setState({alert: false})
                }}
                message={this.state.message}
                autoHideDuration={3000}
                severity={this.state.severity}
                elevation={2}
                variant="filled"></LoonsSnackbar>

            </React.Fragment>
        );
    }
}

export default withStyles(styleSheet)(Row)