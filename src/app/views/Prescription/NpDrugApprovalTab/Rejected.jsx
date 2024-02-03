import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { AppBar, Card, Grid, Tab, Tabs, Tooltip, Typography, Checkbox } from "@material-ui/core";
import { LoonsSnackbar, MainContainer, Widget } from 'app/components/LoonsLabComponents';
import { Button, DatePicker, LoonsTable } from 'app/components/LoonsLabComponents';
import { consultant, NPDrugApprovalStatus } from '../../../../appconst';
import localStorageService from "app/services/localStorageService";
import PrescriptionService from "app/services/PrescriptionService";
import moment from "moment";
import VisibilityIcon from '@material-ui/icons/Visibility';
import { IconButton } from "@mui/material";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm, SubTitle } from 'app/components/LoonsLabComponents'
import { dateParse } from "utils";
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@material-ui/core'
import ClinicService from "app/services/ClinicService";

import { Autocomplete } from '@material-ui/lab'

const styleSheet = ((palette, ...theme) => ({

}));

class NPDrugApprovalRejected extends Component {
    constructor(props) { 
        super(props)
        this.state = {
            remarks: [],
            suggestedQty: [],
            orderQty: [],
            owner_id: null,

            alert: false,
            severity: 'success',
            message: '',

            clinics: [],

            from: null,
            to: null,
            search: null,
            from_owner_id:null,
            priority: null,

            options: {
                color: '#1a73e9',
                xAxis: {
                    type: 'category',
                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [120, 200, 150, 80, 70, 110, 130, 55, 45, 69, 46, 100],
                        type: 'bar'
                    }
                ]
            },

            disableApprove: true,
            loaded: false,

            tablePagination: {
                'order[0]': [
                    'createdAt', 'DESC'
                ],
                limit: 20,
                page: 0,
            },


            data: [],
            // columns : [],
            columns: [
                // {
                //     name: '',
                //     label: '',
                //     options: {
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <>
                //                     <Checkbox
                //                         onChange={(e) => this.handleCheckbox(this.state.data[tableMeta.rowIndex]?.id)}

                //                         checked={this.state.selectedRows.some((data) => data === this.state.data[tableMeta.rowIndex]?.id)}

                //                     />
                //                 </>
                //             )
                //         }
                //     }
                // },
                {
                    name: 'status',
                    label: 'Action',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            { console.log("Hello: ", value) }
                            let disbaleApprove = true

                            if (value == NPDrugApprovalStatus.Pending) {
                                if (this.state.userType == "Hospital Director") {
                                    disbaleApprove = false
                                }
                            } else if (value == NPDrugApprovalStatus.Director) {
                                if (this.state.userType == "MSDCP") {
                                    disbaleApprove = false
                                }
                            } else if (value == NPDrugApprovalStatus.CP) {
                                if (this.state.userType == "MSDSCO") {
                                    disbaleApprove = false
                                }
                            } else if (value == NPDrugApprovalStatus.SCO) {
                                if (this.state.userType == "MSDAD") {
                                    disbaleApprove = false
                                }
                            } else if (value == NPDrugApprovalStatus.AD_MSD) {
                                if (this.state.userType == "MSDDirector") {
                                    disbaleApprove = false
                                }
                            } else if (value == NPDrugApprovalStatus.D_MSD) {
                                if (this.state.userType == "MSDDDG") {
                                    disbaleApprove = false
                                }
                            } else if (value == NPDrugApprovalStatus.DDG_MSD) {
                                if (this.state.userType == "MSDDDHS") {
                                    disbaleApprove = false
                                }
                            } else if (value == NPDrugApprovalStatus.DDHS) {
                                if (this.state.userType == "Secretary") {
                                    disbaleApprove = false
                                }
                            }
                            // console.log("value",value)
                            // console.log("tableMeta",tableMeta)
                            return (
                                <Grid className="w-full flex" >
                                    {this.state.data[tableMeta.rowIndex]?.ItemSnap?.sr_no !== null
                                        ?
                                        <Grid container spacing={1} style={{ display: 'contents' }}>
                                            {/* <Grid item className="mt-2">
                                                <Tooltip title="Approve">

                                                    <Button
                                                        onClick={() => this.handleApproval(tableMeta.rowIndex)}
                                                        disabled={disbaleApprove}
                                                        //startIcon="thumb_up"
                                                        variant="contained"
                                                    >
                                                        Approve
                                                    </Button>
                                                </Tooltip>
                                            </Grid> */}

                                            {/* <Grid item className="mt-2">
                                                <Tooltip title="Reject">
                                                    <Button
                                                        onClick={() => this.handleReject(tableMeta.rowIndex)}
                                                        disabled={disbaleApprove}
                                                        //startIcon="thumb_down"
                                                        variant="contained"
                                                        color="secondary"
                                                    >
                                                        Reject
                                                    </Button>
                                                </Tooltip>
                                            </Grid> */}

                                            <Grid item>
                                                <Tooltip title="view">
                                                    <IconButton
                                                        aria-label="view"
                                                        onClick={() => { window.location = `/prescription/npdrug/${this.state.data[tableMeta.rowIndex]?.id}` }}
                                                    >
                                                        <VisibilityIcon color="primary" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>




                                        :
                                        <Button
                                            // onClick={()=>this.handleApproval(tableMeta.rowIndex)}
                                            className="bg-error pl-3"
                                            disabled={disbaleApprove}
                                            // startIcon = {<ThumbUpIcon/>}
                                            variant="outlined"
                                        >
                                            Send for FR
                                        </Button>
                                    }

                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'order_qty',
                    label: 'Order Qty',
                    //  SCO
                    options: {
                        // display: true,
                        filter: false,
                        customBodyRenderLite: (dataIndex) => {

                            let quantitiy = this.state.data[dataIndex]?.suggested_quantity

                            return (quantitiy)
                            /* <Grid className="w-full" style={{ width: '150px' }}>
                               <TextValidator
                                   placeholder="Order Quantity"
                                   name="order_qty"
                                   InputLabelProps={{ shrink: false }}
                                   value={this.state.orderQty.find((x) => x.id == this.state.data[dataIndex]?.id)?.qty}
                                   type="text"
                                   variant="outlined"
                                   size="small"
                                   onChange={(e) => {
                                       let obj = {
                                           id: this.state.data[dataIndex].id,
                                           qty: e.target.value
                                       }
                                       let tempQty = this.state.orderQty
                                       let index = tempQty.findIndex((t) => t.id === this.state.data[dataIndex].id)
                                       if (index == -1) {
                                           tempQty.push(obj)
                                           this.setState({ orderQty: tempQty })
                                       } else {
                                           tempQty[index]=obj
                                           this.setState({ orderQty: tempQty })
                                       }
                                   }}
                                   validators={[
                                       'required',
                                       'matchRegexp:^[0-9]{1,40}$',
                                   ]}
                                   errorMessages={[
                                       'This field is required',
                                       'Quantity is invalid',
                                   ]}
                               />
                           </Grid>  */

                        }
                    }
                },
                // {
                //     name: 'Remark',
                //     label: 'Remark',
                //     options: {
                //         filter: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             return (
                //                 <Grid className="w-full" style={{ width: '250px' }}>
                //                     <TextValidator
                //                         placeholder="Remarks"
                //                         name="Comment"
                //                         InputLabelProps={{ shrink: false }}
                //                         // value={this.state.remarks[dataIndex] ? this.state.remarks[dataIndex].remark : null}
                //                         //value={this.state.remarks.find((x) => x.id == this.state.remarks[dataIndex]?.id)?.remark}
                //                         value={this.state.data[dataIndex].remark}

                //                         type="text"
                //                         variant="outlined"
                //                         size="small"
                //                         onChange={(e) => {
                //                             let data = this.state.data
                //                             this.state.data[dataIndex].remark = e.target.value
                //                             this.setState({ data })

                //                             /*                 let obj = {
                //                                                 id: this.state.data[dataIndex].id,
                //                                                 remark: e.target.value
                //                                             }
                //                                             let tempRemark = this.state.remarks
                //                                             let index = tempRemark.findIndex((t) => t.id === this.state.data[dataIndex].id)
                //                                             if (index == -1) {
                //                                                 tempRemark.push(obj)
                //                                                 this.setState({ remarks: tempRemark })
                //                                             } else {
                //                                                 tempRemark[index] = obj
                //                                                 this.setState({ remarks: tempRemark })
                //                                             }
                //  */

                //                         }}
                //                     />
                //                 </Grid>
                //             )
                //         }
                //     }
                // },

                {
                    name: 'ItemSnap',
                    label: 'SR',
                    options: {
                        filter: false,
                        //  SCO
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value?.sr_no : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'item_name',
                    label: 'item Name',
                    options: {
                        filter: false,
                        //  SCO AD
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid style={{ width: '250px' }}>
                                    {(value != null) ? value : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        filter: false,
                        //  SCO
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'request_id',
                    label: 'Request ID',
                    options: {
                        filter: false,
                        //  SCO
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="flex justify-center">
                                    {(value != null) ? value : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'Patient',
                    label: 'Patient ID',
                    options: {
                        filter: false,
                        //  SCO
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value?.phn : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'createdAt',
                    label: 'Requested Date',
                    width: 20,
                    options: {
                        filter: false,
                        width: 20,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="flex justify-center" style={{ width: '100px' }}>
                                    {moment(value).format('yyyy-MM-DD')}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'clinic_id',
                    label: 'BHT No/Clinic No',
                    options: {
                        filter: false,
                        customBodyRenderLite: (dataIndex) => {
                            let val = null
                            this.state.clinics.map((x) => {
                                if (x.clinic_id == this.state.data[dataIndex]?.clinic_id) {
                                    val = x.bht
                                }

                            })
                            return (
                                <Grid
                                    className="flex justify-center"
                                >
                                    {/* {(val != null) ? val : "-"} */}
                                    {this.state.data[dataIndex]?.bht_no ? this.state.data[dataIndex]?.bht_no : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                
                {
                    name: 'ItemSnap',
                    label: 'Description Name',
                    options: {
                        filter: false,
                        //  SCO AD
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid style={{ width: '250px' }}>
                                    {(value != null) ? value?.short_description : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'Strength',
                    options: {
                        filter: false,
                        //  SCO AD
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value?.strength : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'DefaultFrequency',
                    label: 'Frequency',
                    options: {
                        filter: false,
                        //  SCO
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full" style={{ width: '70px' }}>
                                    {(value != null) ? value?.name : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'approved_quantity',
                    label: 'Qty',
                    options: {
                        filter: false,
                        //  AD <
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value : "-"}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'suggested_quantity',
                    label: 'Suggested Qty',
                    options: {
                        filter: false,
                        //  SCO
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full" style={{ width: '100px' }}>
                                    {(value != null) ? value : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'duration',
                    label: 'Duration',
                    options: {
                        filter: false,
                        //  SCO
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value : null}
                                </Grid>
                            )
                        }
                    }
                },

                // {
                //     name: '',
                //     label: 'Order Qty',
                //     //  SCO
                //     display :  false,
                //     options: {
                //         filter : false,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             // {console.log(value)}
                //                 return(
                //                     <Grid className="w-full">
                //                             {/* {(value != null) ? value :null} */}
                //                     </Grid>
                //                 )
                //         }
                //     }
                // },
                {
                    name: 'dose',
                    label: 'Dose',
                    options: {
                        filter: false,
                        //  SCO
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full" style={{ width: '60px' }}>
                                    {(value != null) ? value : null}
                                </Grid>
                            )
                        }
                    }
                },
                // {
                //     name: 'Suggested_Qty',
                //     label: 'Suggested Qty',
                //     options: {
                //         filter: false,
                //         display: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             return (
                //                 <Grid className="w-full" style={{ width: '200px' }}>
                //                     <TextValidator
                //                         placeholder="Suggested Quantity"
                //                         name="suggested_quantity"
                //                         InputLabelProps={{ shrink: false }}
                //                         value={this.state.suggestedQty[dataIndex] ? this.state.suggestedQty[dataIndex].qty : null}
                //                         type="text"
                //                         variant="outlined"
                //                         size="small"
                //                         onChange={(e) => {
                //                             let obj = {
                //                                 id: this.state.data[dataIndex].id,
                //                                 qty: e.target.value
                //                             }
                //                             let tempQty = this.state.suggestedQty
                //                             tempQty[dataIndex] = obj
                //                             this.setState({ suggestedQty: tempQty })
                //                             console.log("QTY", this.state.suggestedQty)
                //                         }}
                //                         validators={[
                //                             'required',
                //                             'matchRegexp:^[0-9]{1,40}$',
                //                         ]}
                //                         errorMessages={[
                //                             'This field is required',
                //                             'Quntity is invalid',
                //                         ]}
                //                     />
                //                 </Grid>
                //             )
                //         }
                //     }
                // },


                // {
                //     name: 'Suggested_Qty',
                //     label: 'Suggested Qty',
                //     options: {
                //         filter : false,
                //         display : false,
                //         customBodyRenderLite: (dataIndex) => {
                //                 return(
                //                     <Grid className="w-full">
                //                         <TextValidator
                //                             placeholder="Suggested Quantity"
                //                             name="Comment"
                //                             InputLabelProps={{ shrink: false }}
                //                             value={this.state.suggestedQty[dataIndex] ?this.state.suggestedQty[dataIndex].qty : null}
                //                             type="text"
                //                             variant="outlined"
                //                             size="small"
                //                             onChange={(e) => {
                //                                 let obj = {
                //                                     id : this.state.data[dataIndex].id,
                //                                     qty : e.target.value
                //                                 }
                //                                 let tempQty = this.state.suggestedQty
                //                                 tempQty[dataIndex] = obj
                //                                 this.setState({suggestedQty : tempQty})
                //                                 console.log("QTY",this.state.suggestedQty)
                //                             }}
                //                             validators={[
                //                                 'required',
                //                                 'matchRegexp:^[0-9]{1,40}$',
                //                             ]}
                //                             errorMessages={[
                //                                 'This field is required',
                //                                 'Quntity is invalid',
                //                             ]}
                //                         />
                //                     </Grid>
                //                 )
                //         }
                //     }
                // },
                {
                    name: 'Employee',
                    label: 'Consultant Name',
                    options: {
                        filter: false,
                        //  SCO CP DH
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full" style={{ width: '150px' }}>
                                    {(value != null) ? value?.name : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'Institute',
                    label: 'Institute',
                    options: {
                        filter: false,
                        //  SCO
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full" style={{ width: '150px' }}>
                                    {(value != null) ? value?.name : null}
                                </Grid>
                            )
                        }
                    }
                },
                // {
                //     name: 'NewStock',
                //     label: 'New/Stock',
                //     options: {
                //         filter : false,
                //         //  CP
                //         display: false,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             // {console.log(value)}
                //                 return(
                //                     <Grid 
                //                         className="flex justify-center"
                //                     > undefined
                //                             {/* {(value != null) ? value.sr_no:null} */}
                //                     </Grid>
                //                 )
                //         }
                //     }
                // },
                {
                    name: 'ItemSnap',
                    label: 'Unit Price',
                    options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full">
                                    {(value != null) ? value?.item_unit_size : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'ItemSnap',
                    label: 'Value',
                    options: {
                        filter: false,
                        customBodyRenderLite: (dataIndex) => {
                            // {console.log(value)}
                            let val = parseInt(this.state.data[dataIndex]?.ItemSnap?.standard_cost) * parseInt(this.state.data[dataIndex]?.suggested_quantity);

                            return (
                                <Grid className="w-full">
                                    {isNaN(val) ? 0 : val}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        filter: false,
                        //  SCO
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full" style={{ width: '200px' }}>
                                    {(value != null) ? value : null}
                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'expected_treatment_date',
                    label: 'Expected Treatement Date',
                    options: {
                        filter: false,
                        //  AD
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                            return (
                                <Grid className="w-full" style={{ width: '150px' }}>
                                    {(value != null) ?
                                        moment(value).format("yyyy-MM-DD")
                                        : null}
                                </Grid>
                            )
                        }
                    }
                },

            ],

            remarkforSelectedItem: '',
            selectedRows: [],

            tabIndex: 0,
            loaded2: true,

            userType: null,

            consultantView: false,
            DirectorView: false,
            CPView: false,
            SCOView: false,
            AD_MSDView: false,
            D_MSDView: false,
            DDG_MSDView: false,
            DDHSView: false,
            SecrateryView: false,

            Pending: 0,
            Director: 0,
            CP: 0,
            SCO: 0,
            AD_MSD: 0,
            D_MSD: 0,
            DDG_MSD: 0,
            DDHS: 0,
            Secretary: 0,


            totalItems: 0,
            totalPages: 0,
        }
    }

    handleFRApproval = async (index) => {
        let id = this.state.data[index].id
        if (this.state.data[index].suggested_quantity === null || this.state.data[index].suggested_quantity === undefined) {
            console.log(this.state.userType)
            this.setState({
                message: "Enter suggested quantity",
                severity: 'error',
                alert: true
            })
        } else {
            let data = {
                "type": "FR Request",
                "remark": this.state.data[index]?.remark,
                "requested_by": this.state.data[index].requested_by,
                "status": "FR Approval",
                "owner_id": this.state.owner_id,
                "suggested_quantity": this.state.data[index].suggested_quantity
            }
            console.log("Approve Data", data)
            let res = await PrescriptionService.NPApproval(id, data)
            console.log("Approve Data Res", res)
            if (res.status == 200 || res.status == 201) {
                this.setState({
                    message: "Data status updated successfully.",
                    severity: 'success',
                    alert: true
                })
            } else {
                this.setState({
                    message: "Something went wrong.",
                    severity: 'error',
                    alert: true
                })
            }
        }
    }

    handleApproval = async (index) => {
        let owner_id = await localStorageService.getItem("owner_id")

        let id = this.state.data[index].id
        let approveStatus = ''
        if (this.state.userType == "Hospital Director") {
            approveStatus = NPDrugApprovalStatus.Director
        } else if (this.state.userType == "MSDCP") {
            approveStatus = NPDrugApprovalStatus.CP
        } else if (this.state.userType == "MSDSCO") {
            approveStatus = NPDrugApprovalStatus.SCO
        } else if (this.state.userType == "MSDAD") {
            approveStatus = NPDrugApprovalStatus.AD_MSD
        } else if (this.state.userType == "MSDDirector") {
            approveStatus = NPDrugApprovalStatus.D_MSD
        } else if (this.state.userType == "MSDDDG") {
            approveStatus = NPDrugApprovalStatus.DDG_MSD
        } else if (this.state.userType == "MSDDDHS") {
            approveStatus = NPDrugApprovalStatus.DDHS
        } else if (this.state.userType == "Secretary") {
            approveStatus = NPDrugApprovalStatus.Secretary
        }
        if (approveStatus != null) {
            if (this.state.data[index].suggested_quantity === null || this.state.data[index].suggested_quantity === undefined) {
                console.log(this.state.userType)
                this.setState({
                    message: "Enter suggested quantity",
                    severity: 'error',
                    alert: true
                })
            } else {
                console.log("Hello", data)
                let data = null
                if (this.state.userType == "MSDCP") {
                    data = {
                        "type": "Approved",
                        "remark": this.state.data[index].remark,
                        "requested_by": this.state.data[index].requested_by,
                        "status": approveStatus,
                        "owner_id": owner_id,
                        "suggested_quantity": this.state.data[index].suggested_quantity
                    }
                } else if (this.state.userType == "MSDSCO") {
                    console.log("Hello", this.state.userType, approveStatus, data)
                    data = {
                        "type": "Approved",
                        "remark": this.state.data[index]?.remark,
                        "requested_by": this.state.data[index].requested_by,
                        "status": approveStatus,
                        "owner_id": owner_id,
                        "approved_quantity": this.state.data[index].suggested_quantity
                    }
                    // approved_quantity not definde
                    console.log("Hello", this.state.userType, approveStatus, data)
                } else {
                    data = {
                        "type": "Approved",
                        "remark": this.state.data[index].remark,
                        "requested_by": this.state.data[index].requested_by,
                        "status": approveStatus,
                        "owner_id": owner_id,
                    }
                }
                console.log("Approve Data", data)
                let res = await PrescriptionService.NPApproval(id, data)
                console.log("Approve Data Res", res)
                if (res.status == 200 || res.status == 201) {
                    this.setState({
                        message: "Data status updated successfully.",
                        severity: 'success',
                        alert: true
                    })
                    window.location.reload()
                } else {
                    this.setState({
                        message: "Something went wrong.",
                        severity: 'error',
                        alert: true
                    })
                }
            }
        } else {
            this.setState({
                message: "Something went wrong.",
                severity: 'error',
                alert: true
            })
        }
        // console.log("ApproveData",data)
    }
    handleReject = async (index) => {
        let owner_id = await localStorageService.getItem("owner_id")
        let id = this.state.data[index].id
        let data = {
            "type": "Rejected",
            "remark": this.state.data[index]?.remark,
            "requested_by": this.state.data[index].requested_by,
            "status": "Rejected",
            "owner_id": owner_id,
        }

        let res = await PrescriptionService.NPApproval(id, data)
        console.log("Approve Data Res", res)
        if (res.status == 200 || res.status == 201) {
            this.setState({
                message: "Rejected successfully.",
                severity: 'success',
                alert: true
            })
            window.location.reload()
        } else {
            this.setState({
                message: "Something went wrong.",
                severity: 'error',
                alert: true
            })
        }
    }

    async getPharmacyDetails(search) {
        let params = {
            limit: 500,
            page: 0,
            issuance_type: ['Hospital', 'RMSD Main', 'MSD Main'],
            search: search
        };

        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('phar------------------>>>>> check', res);

            this.setState({
                pharmacy_list: res.data.view.data
            });
        }
    }

    approve = () => {
        console.log()
    }
    async handleCheckbox(id) {
        let selectedRows = this.state.selectedRows;
        if (selectedRows.includes(id)) {
            let index = selectedRows.indexOf(id)
            selectedRows.splice(index, 1);
        } else {
            selectedRows.push(id)
        }

        this.setState({ selectedRows })
    }

    handleBulkApproval = async () => {
        let tempOwnerId = await localStorageService.getItem("owner_id")
        let Ids = this.state.selectedRows
        /*  this.state.selectedRows.map((x) => {
             Ids.push(x.id)
         }) */

        let approveStatus = ''
        if (this.state.userType == "Hospital Director") {
            approveStatus = NPDrugApprovalStatus.Director
        } else if (this.state.userType == "MSDCP") {
            approveStatus = NPDrugApprovalStatus.CP
        } else if (this.state.userType == "MSDSCO") {
            approveStatus = NPDrugApprovalStatus.SCO
        } else if (this.state.userType == "MSDAD") {
            approveStatus = NPDrugApprovalStatus.AD_MSD
        } else if (this.state.userType == "MSDDirector") {
            approveStatus = NPDrugApprovalStatus.D_MSD
        } else if (this.state.userType == "MSDDDG") {
            approveStatus = NPDrugApprovalStatus.DDG_MSD
        } else if (this.state.userType == "MSDDDHS") {
            approveStatus = NPDrugApprovalStatus.DDHS
        } else if (this.state.userType == "Secretary") {
            approveStatus = NPDrugApprovalStatus.Secretary
        }
        // console.log("Ids",Ids)
        let tempIds = []
        let activity_data = []
        let obj = []

        Ids.map((x, index) => {
            let qty_data = this.state.data.find((y) => y.id == x)
            console.log("selected data", qty_data)
            if (qty_data.suggested_quantity) {
                activity_data.push({
                    id: x,
                    quantity: qty_data.suggested_quantity
                })
            } else {// selected but not add quantity
                /*  activity_data.push({
                     id: x,
                     quantity: null
                 }) */
            }
        })


        let data = {
            "activity_data": activity_data,
            "type": "Approved",
            "remark": this.state.remarkforSelectedItem,
            "requested_by": this.state.data[0].requested_by,
            "status": approveStatus,
            "owner_id": tempOwnerId
        }

        let res = await PrescriptionService.BulkNPApproval(data)
        console.log("Np approve res", res)
        if (res.status == 200 || res.status == 201) {
            this.setState({
                message: "Record has been added successfully.",
                severity: 'success',
                alert: true
            })
            window.location.reload()
        } else {
            this.setState({
                message: "Something went wrong.",
                severity: 'error',
                alert: true
            })
        }


        /* 
                Ids.map((x, index) => {
                    obj[index] = false
                    this.state.suggestedQty.map((y) => {
                        if (x == y.id) {
                            let temp = {
                                id: x,
                                quantity: y.qty
                            }
                            tempIds[index] = temp
                            obj[index] = true
                        }
                    })
                })
        
                Ids = tempIds
                let temp = obj.includes(false)
        
                // console.log("temp",temp)
                if (temp) {
                    this.setState({
                        message: "Enter suggested quantity for all selected items",
                        severity: 'error',
                        alert: true
                    })
                } else {
        
                    // console.log("QQQQQ", this.state.suggestedQty)
        
                    if (Ids.length > 0) {
                        let data = {
                            "activity_data": Ids,
                            "type": "Approved",
                            "remark": this.state.remarkforSelectedItem,
                            "requested_by": this.state.data[0].requested_by,
                            "status": approveStatus,
                            "owner_id": this.state.owner_id
                        }
        
                        let res = await PrescriptionService.BulkNPApproval(data)
                        console.log("Np approve res", res)
                        if (res.status == 200 || res.status == 201) {
                            this.setState({
                                message: "Record has been added successfully.",
                                severity: 'success',
                                alert: true
                            })
                        } else {
                            this.setState({
                                message: "Something went wrong. Select at least 2 items.",
                                severity: 'error',
                                alert: true
                            })
                        }
                    } else {
                        this.setState({
                            message: "Select at least 2 items first!",
                            severity: 'error',
                            alert: true
                        })
                    }
                } */

    }

    getClinicBHTNo = async () => {
        let ClinicIds = []
        let PatientIds = []

        this.state.data.map((x) => {
            if (x.Patient?.id) {
                PatientIds.push(x.Patient?.id)
            }

            if (x.clinic_id) {
                ClinicIds.push(x.clinic_id)
            }


        })

        let params = {
            clinic_id: ClinicIds,
            patient_id: PatientIds
        }


        let res = await PrescriptionService.getClinicBHTNo(params)
        this.setState({ clinics: res.data?.view?.data })
        console.log("clinics", this.state.clinics)
    }

    getStatus = async () => {
        let user = localStorageService.getItem("userInfo")
        let tempOwnerId = localStorageService.getItem("owner_id")
        let hospitalID = localStorageService.getItem("main_hospital_id")
        let loginUserHospital = localStorageService.getItem("Login_user_Hospital")
        console.log(user.type)
        let params = null

        if (
            this.state.userType == "Consultant" ||
            this.state.userType == "Hospital Director" ||
            this.state.userType == "Chief Pharmacist"
        ) {
            params = {
                search_type: "GroupByStatus",
                status: [
                    // NPDrugApprovalStatus.Pending,
                    // NPDrugApprovalStatus.Director,
                    // NPDrugApprovalStatus.CP,
                    // NPDrugApprovalStatus.SCO,
                    // NPDrugApprovalStatus.AD_MSD,
                    // NPDrugApprovalStatus.D_MSD,
                    // NPDrugApprovalStatus.DDG_MSD,
                    // NPDrugApprovalStatus.DDHS,
                    // NPDrugApprovalStatus.Secretary
                    "Rejected"
                ],
                // requested_by : user.id,
                owner_id: tempOwnerId,
                hospital_id: hospitalID,
                // clinic_id: loginUserHospital.clinic_id
                // item_id
            }
        } else {
            params = {
                search_type: "GroupByStatus",
                status: [
                    // NPDrugApprovalStatus.Pending,
                    // NPDrugApprovalStatus.Director,
                    // NPDrugApprovalStatus.CP,
                    // NPDrugApprovalStatus.SCO,
                    // NPDrugApprovalStatus.AD_MSD,
                    // NPDrugApprovalStatus.D_MSD,
                    // NPDrugApprovalStatus.DDG_MSD,
                    // NPDrugApprovalStatus.DDHS,
                    // NPDrugApprovalStatus.Secretary
                    'Rejected'
                ],
                // requested_by : user.id,
                owner_id: tempOwnerId,
                // hospital_id : hospitalID,
                // clinic_id: loginUserHospital.clinic_id
                // item_id
            }
        }
        let res = await PrescriptionService.fetchNPRrequests(params)
        console.log("statusREs", res.data.view.data)
        res.data.view.map((x) => {
            if (NPDrugApprovalStatus.Pending == x.status) {
                // this.setState({Pending:x.counts})
                this.setState({ Director: x.counts })
            }
            if (NPDrugApprovalStatus.Director == x.status) {
                this.setState({ CP: x.counts })
            }
            if (NPDrugApprovalStatus.CP == x.status) {
                this.setState({ SCO: x.counts })
            }
            if (NPDrugApprovalStatus.SCO == x.status) {
                this.setState({ AD_MSD: x.counts })
            }
            if (NPDrugApprovalStatus.AD_MSD == x.status) {
                this.setState({ D_MSD: x.counts })
            }
            if (NPDrugApprovalStatus.D_MSD == x.status) {
                this.setState({ DDG_MSD: x.counts })
            }
            if (NPDrugApprovalStatus.DDG_MSD == x.status) {
                this.setState({ DDHS: x.counts })
            }
            if (NPDrugApprovalStatus.DDHS == x.status) {
                this.setState({ Secretary: x.counts })
            }
            // if(NPDrugApprovalStatus.Secretary == x.status){
            // }

        })
    }

    getData = async () => {
        let user = localStorageService.getItem("userInfo")
        // console.log("USER TYPE", user.roles.includes("MSD SCO"))


        this.setState({
            // owner_id : tempOwnerId, 
            loaded: false
        })

        let hospitalID = await localStorageService.getItem("main_hospital_id")

        console.log("Hospital ID", hospitalID)
        let tempOwnerId = await localStorageService.getItem("owner_id")
        let loginUserHospital = await localStorageService.getItem("Login_user_Hospital")

        // COLUMN VISIBILITY SETUP
        if (user.roles[0] == "Consultant") {
            this.setState({
                // userType : "Consultant"
                // 
                userType: "Consultant",
                AD_MSDView: true
            })

        }
        if (user.roles[0] == "Hospital Director" || user.roles[0] == "Hospital Admin") {
            let cols = this.state.columns
            cols.map((x) => {
                if (x.name == 'Employee') {
                    x.options.display = true
                }
            })
            this.setState({
                userType: "Hospital Director",
                DirectorView: true,
                loaded: false,
                columns: cols,
            })
            console.log("Hospital Director logged")
        }
        if (user.roles.includes("Hospital Director") || user.roles.includes("Hospital Admin")) {
            let cols = this.state.columns
            cols.map((x) => {
                if (x.name == 'Employee') {
                    x.options.display = true
                }
            })
            this.setState({
                userType: "Hospital Director",
                DirectorView: true,
                loaded: false,
                columns: cols,
            })
            console.log("Hospital Director logged")
        }

        if (user.roles[0] == "Chief Pharmacist") {
            this.setState({
                userType: "MSDCP",
                CPView: true
            })
            let cols = this.state.columns
            cols.map((x) => {
                if (x.name == 'Employee') {
                    x.options.display = true
                }
                // if(x.name == 'NewStock'){
                //     x.options.display = true
                // }
                if (x.name == 'Suggested_Qty') {
                    x.options.display = true
                }
            })
            this.setState({
                columns: cols,
            })
        }

        // if(user.type == "MSD SCO"){
        //     console.log("MSD SCO logged")
        //     this.setState({
        //         userType : "MSDSCO",
        //         SCOView: true
        //     })
        //     let cols = this.state.columns
        //     cols.map((x)=>{
        //         if(x.name == 'Employee'){
        //             x.options.display = true
        //         }
        //         if(x.name == 'expected_treatment_date'){
        //             x.options.display = true
        //         }
        //         if(x.label == 'SR'){
        //             x.options.display = true
        //         }
        //         if(x.label == 'Description Name'){
        //             x.options.display = true
        //         }
        //         if(x.label == 'Strength'){
        //             x.options.display = true
        //         }
        //         if(x.label == 'Frequency'){
        //             x.options.display = true
        //         }
        //         if(x.label == 'Duration'){
        //             x.options.display = true
        //         }
        //         if(x.label == 'Suggested Qty'){
        //             x.options.display = true
        //         }
        //         if(x.label == 'Order Qty'){
        //             x.options.display = true
        //         }
        //         if(x.label == 'Institute'){
        //             x.options.display = true
        //         }
        //         if(x.label == 'Status'){
        //             x.options.display = true
        //         }
        //     })
        //     this.setState({
        //         columns : cols,
        //     })
        // }
        if (user.roles.includes("MSD SCO") === true || user.roles.includes("MSD SCO Supply") === true || user.roles.includes("MSD SCO QA") === true) {
            console.log("USER TYPE MSD SCO logged")
            this.setState({
                userType: "MSDSCO",
                SCOView: true
            })
            let cols = this.state.columns
            cols.map((x) => {
                if (x.name == 'expected_treatment_date') {
                    x.options.display = true
                }
                if (x.name == 'Employee') {
                    x.options.display = true
                }
                if (x.label == 'SR') {
                    x.options.display = true
                }
                if (x.label == 'Description Name') {
                    x.options.display = true
                }
                if (x.label == 'Strength') {
                    x.options.display = true
                }
                if (x.label == 'Frequency') {
                    x.options.display = true
                }
                if (x.label == 'Duration') {
                    x.options.display = true
                }
                if (x.name == 'suggested_quantity') {
                    x.options.display = true
                }
                if (x.label == 'Order Qty') {
                    x.options.display = true
                }
                if (x.label == 'Institute') {
                    x.options.display = true
                }
                if (x.label == 'Status') {
                    x.options.display = true
                }
            })
            this.setState({
                columns: cols,
                loaded: true
            })
        }

        if (user.roles[0] == "MSD AD" || user.roles.includes("MSD AD")) {
            this.setState({
                userType: "MSDAD",
                AD_MSDView: true
            })
            let cols = this.state.columns
            cols.map((x) => {
                if (x.name == 'expected_treatment_date') {
                    x.options.display = true
                }
                if (x.name == 'approved_quantity') {
                    x.options.display = true
                }
                if (x.label == 'Description Name') {
                    x.options.display = true
                }
                if (x.name == 'BHT No/Clinic No') {
                    x.options.display = false
                }
                if (x.label == 'Order Qty') {
                    x.options.display = false
                }
            })
            this.setState({
                columns: cols,
            })
        }
        if (user.roles[0] == "MSD Director") {
            this.setState({
                userType: "MSDDirector",
                D_MSDView: true
            })
            let cols = this.state.columns
            cols.map((x) => {
                if (x.name == 'approved_quantity') {
                    x.options.display = true
                }
                if (x.name == 'expected_treatment_date') {
                    x.options.display = true
                }
                if (x.label == 'Order Qty') {
                    x.options.display = false
                }
            })
            this.setState({
                columns: cols,
            })
        }
        if (user.roles[0] == "MSD DDG") {
            this.setState({
                userType: "MSDDDG",
                DDG_MSDView: true
            })
            let cols = this.state.columns
            cols.map((x) => {
                if (x.name == 'approved_quantity') {
                    x.options.display = true
                }
                if (x.name == 'expected_treatment_date') {
                    x.options.display = true
                }
                if (x.label == 'Order Qty') {
                    x.options.display = false
                }
            })
            this.setState({
                columns: cols,
            })
        }
        if (user.roles[0] == "MSD DDHS") {
            this.setState({
                userType: "MSDDDHS",
                DDHSView: true
            })
            let cols = this.state.columns
            cols.map((x) => {
                if (x.name == 'expected_treatment_date') {
                    x.options.display = true
                }
                if (x.name == 'approved_quantity') {
                    x.options.display = true
                }
                if (x.label == 'Order Qty') {
                    x.options.display = false
                }
            })
            this.setState({
                columns: cols,
            })
        }
        if (user.roles[0] == "Secretary") {
            this.setState({
                userType: "Secretary",
                SecreteryView: true
            })
            let cols = this.state.columns
            cols.map((x) => {
                if (x.name == 'approved_quantity') {
                    x.options.display = true
                }
                if (x.name == 'expected_treatment_date') {
                    x.options.display = true
                }
                if (x.label == 'Order Qty') {
                    x.options.display = false
                }
            })
            this.setState({
                columns: cols,
            })
        }

        let params = ''
        if (this.state.userType == "Consultant") {
            params = {
                owner_id: tempOwnerId,
                hospital_id: hospitalID,
                clinic_id: loginUserHospital.clinic_id,
                requested_by: user.id,
                from: this.state.from,
                to: this.state.to,
                search: this.state.search,
                from_owner_id: this.state.from_owner_id,
                priority: this.state.priority,
                status : ['Rejected', 'Order REJECTED']
                // page: this.state.page,
                // limit: this.state.limit
                // item_id:
            }
        } else {


            params = {
                owner_id: tempOwnerId,
                // hospital_id: "02086072-f418-4da2-bb4a-51a66ba76d00",
                // hospital_id:hospitalID,
                // clinic_id: loginUserHospital.clinic_id,
                // requested_by:user.id,
                from: this.state.from,
                to: this.state.to,
                search: this.state.search,
                from_owner_id: this.state.from_owner_id,
                priority: this.state.priority,
                status : ['Rejected', 'Order REJECTED']
                // page: this.state.page,
                // limit: this.state.limit
                // item_id:
            }
        }



        let res = await PrescriptionService.fetchNPRrequests({ ...params, ...this.state.tablePagination })
        console.log("Hey: ", res.data.view.data)
        this.setState({
            data: res.data.view.data,
            totalItems: res.data.view.totalItems,
            totalPages: res.data.view.totalPages,
            loaded: true
        }, () => {
            this.getClinicBHTNo()
            this.getStatus()
        })
        console.log("params", params)
    }

    componentDidMount = async () => {
        this.getData()
        
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <ValidatorForm>
                        <Grid
                            container
                            spacing={2}
                        >
                            {/* <Grid
                                item
                                xs={12}
                            >
                                <Typography variant='h5'>NP DRUG Approval</Typography>
                            </Grid> */}
                            <Grid
                            className=" w-full"
                            item
                            xs={6}
                            sm={6}
                            md={4}
                            lg={4}
                        >
                            <SubTitle title="Institution Name" /> 
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                options={this.state.pharmacy_list || []} 
                                onChange={(e, value) => {
                                    console.log('ceking val', value)
                                    if (value != null) {
                                        // let formData = this.state.formData;
                                        // formData.from_owner_id = ;
                                        this.setState({ from_owner_id: value.owner_id });
                                    } else {
                                        // let formData = this.state.formData;
                                        // formData.from_owner_id = null;
                                        this.setState({ from_owner_id: null });
                                    }
                                }}
                                value={
                                    this.state.all_pharmacy &&
                                    this.state.all_pharmacy.find((v) => v.owner_id === this.state.formData.from_owner_id)
                                }
                                getOptionLabel={(option) => (option && option.name ? (option.name + ' - ' + option?.Department?.name) : '')}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Institution Name"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            if (e.target.value.length > 3) {
                                                this.getPharmacyDetails(e.target.value);
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sm={6}
                            md={4}
                            lg={4}
                        >
                            <Typography>Start Date</Typography>
                            <DatePicker
                                className="w-full"
                                value={this.state.from}
                                format='dd-MM-yyyy'
                                // placeholder={`⊕ ${text}`}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let newDate = dateParse(date)
                                    this.setState({ from: newDate })
                                }}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sm={6}
                            md={4}
                            lg={4}
                        >
                            <Typography>To</Typography>
                            <DatePicker
                                className="w-full"
                                value={this.state.to}
                                format='dd-MM-yyyy'
                                // placeholder={`⊕ ${text}`}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let newDate = dateParse(date)
                                    this.setState({ to: newDate })
                                }}
                            />
                        </Grid>
                        <Grid
                            className=" w-full"
                            item
                            xs={6}
                            sm={6}
                            md={4}
                            lg={4}
                        >
                            <SubTitle title="Priority" /> 
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                options={[ {
                                    label: 'Yes',
                                    value: 'Yes',
                                },
                                {
                                    label: 'No',
                                    value: 'No',
                                },]} 
                                onChange={(e, value) => {
                                    console.log('ceking val', value)
                                    if (value != null) {
                                        this.setState({ priority: value.value });
                                    } else {
                                        // let formData = this.state.formData;
                                        // formData.from_owner_id = null;
                                        this.setState({ priority: null });
                                    }
                                }}
                                // value={
                                //     this.state.all_pharmacy &&
                                //     this.state.all_pharmacy.find((v) => v.owner_id === this.state.formData.from_owner_id)
                                // }
                                getOptionLabel={(option) => (option.label)}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Institution Name"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        // onChange={(e) => {
                                        //     if (e.target.value.length > 3) {
                                        //         this.getPharmacyDetails(e.target.value);
                                        //     }
                                        // }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sm={6}
                            md={4}
                            lg={3}
                            // className="ml-5"
                        >
                            <Button
                                className="mt-6"
                                startIcon="sort"
                                onClick={() => this.getData()}
                            >
                                Filter
                            </Button>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            lg={3}
                            
                        >
                            <SubTitle title="Search" /> 
                            <TextValidator
                                className=" w-full"
                                placeholder="Search"
                                name="search"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                value={
                                    this.state.search
                                }
                                type="text"
                                variant="outlined"
                                size="small"
                                onChange={(e) => {
                                    this.setState({
                                        search:e.target.value
                                    })
                                }}

                                onKeyPress={(e) => {
                                    if (e.key == "Enter") {                                            
                                        this.getData()            
                                    }
        
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon
                                            onClick={() => this.getData()}
                                            ></SearchIcon>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                    </ValidatorForm>
                    <Grid
                        className="pt-5 flex justify-center pb-5"
                        container
                        spacing={2}
                    >
                        {/* <Grid
                            item
                        >
                            <Button
                                variant="outlined"
                            >
                                Consultant : {this.state.Pending}
                            </Button>
                        </Grid> */}
                        <Grid
                            item
                        >
                            <Button
                                variant="outlined"
                            // className="bg-error "
                            >
                                Director-hospital : {this.state.Director}
                            </Button>
                        </Grid>
                        <Grid
                            item
                        >
                            <Button
                                variant="outlined"
                            >
                                CP : {this.state.CP}
                            </Button>
                        </Grid>
                        <Grid
                            item
                        >
                            <Button
                                variant="outlined"
                            >
                                SCO : {this.state.SCO}
                            </Button>
                        </Grid>
                        {/* <Grid
                            item
                        >
                            <Button
                                variant="outlined"
                            >
                                AD MSD : {this.state.AD_MSD}
                            </Button>
                        </Grid>
                        <Grid
                            item
                        >
                            <Button
                                variant="outlined"
                            >
                                Director MSD : {this.state.D_MSD}
                            </Button>
                        </Grid>
                        <Grid
                            item
                        >
                            <Button
                                variant="outlined"
                            >
                                DDG MSD : {this.state.DDG_MSD}
                            </Button>
                        </Grid>
                        <Grid
                            item
                        >
                            <Button
                                variant="outlined"
                            >
                                DDHS : {this.state.DDHS}
                            </Button>
                        </Grid>
                        <Grid
                            item
                        >
                            <Button
                                variant="outlined"
                            >
                                Secretary : {this.state.Secretary}
                            </Button>
                        </Grid> */}
                    </Grid>
                    <Grid
                        container
                    // className="pt-5"
                    >
                        {this.state.loaded ?
                            <ValidatorForm
                                onSubmit={this.approve}
                                className="w-full"
                            >
                                <LoonsTable
                                    id={"npdrug"}
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        rowsPerPage: this.state.tablePagination.limit,
                                        page: this.state.tablePagination.page,
                                        //rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                        selectableRows: false,
                                        isRowSelectable: (params) => {
                                            // console.log("ROWSTATUS", this.state.data[params].status)
                                            if (this.state.data[params]?.status == NPDrugApprovalStatus.Pending) {
                                                if (this.state.userType == "Hospital Director") {
                                                    return true
                                                }
                                            } else if (this.state.data[params]?.status == NPDrugApprovalStatus.Director) {
                                                if (this.state.userType == "MSDCP") {
                                                    return true
                                                }
                                            } else if (this.state.data[params]?.status == NPDrugApprovalStatus.CP) {
                                                if (this.state.userType == "MSDSCO") {
                                                    console.log("ROWDISABLE")
                                                    return true
                                                }
                                            } else if (this.state.data[params]?.status == NPDrugApprovalStatus.SCO) {
                                                // console.log("STATTT")
                                                if (this.state.userType == "MSDAD") {
                                                    return true
                                                }
                                            } else if (this.state.data[params]?.status == NPDrugApprovalStatus.AD_MSD) {
                                                if (this.state.userType == "MSDDirector") {
                                                    return true
                                                }
                                            } else if (this.state.data[params]?.status == NPDrugApprovalStatus.D_MSD) {
                                                if (this.state.userType == "MSDDDG") {
                                                    return true
                                                }
                                            } else if (this.state.data[params]?.status == NPDrugApprovalStatus.DDG_MSD) {
                                                if (this.state.userType == "MSDDDHS") {
                                                    return true
                                                }
                                            } else if (this.state.data[params]?.status == NPDrugApprovalStatus.DDHS) {
                                                if (this.state.userType == "Secretary") {
                                                    return true
                                                }
                                            }
                                        },
                                        onTableChange: (action, tableSate) => {
                                            // console.log("tableState", action)
                                            // console.log("tableState2", tableSate)
                                            switch (action) {
                                                /*  case 'rowSelectionChange':
                                                     let temp = []
                                                     let selectedRows = tableSate.selectedRows.data
                                                     selectedRows.map((x) => {
                                                         temp.push(this.state.data[x.dataIndex])
                                                     })
                                                     console.log("selectedRows", temp)
                                                     this.setState({ selectedRows: temp })
                                                     break; */
                                                case 'changePage':
                                                    this.setState({
                                                        tablePagination: {
                                                            ...this.state
                                                                .tablePagination,
                                                            page: tableSate.page
                                                        }
                                                    }, () => { this.getData() })
                                                    break;
                                                case 'changeRowsPerPage':

                                                    this.setState({
                                                        tablePagination: {
                                                            ...this.state
                                                                .tablePagination,
                                                            limit: tableSate.rowsPerPage,
                                                        }
                                                    }, () => { this.getData() })
                                                    break;
                                                default:
                                                // console.log('action not handled');
                                            }
                                        }

                                    }}
                                ></LoonsTable>

                            </ValidatorForm>
                            : null}
                    </Grid>
                    {/* {
                        this.state.userType === "MSDDirector" ||
                            this.state.userType === "MSDDDG" ||
                            this.state.userType === "MSDDDHS" ||
                            this.state.userType === "Secretary"

                            ?
                            <Grid
                                className="p-5 flex justify-center"
                                container
                            >
                                <Card
                                    className="p-10"
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        ld={12}
                                    >
                                        <Typography variant="h6">Month wise value allocation for for NP drug</Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        ld={12}
                                    >
                                        <ReactEcharts
                                            style={{ width: '200%' }}
                                            option={this.state.options}
                                            lazyUpdate={true}
                                            theme="echarts-theme"
                                        />
                                    </Grid>

                                </Card>
                            </Grid>
                            : null} */}
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
                    variant="filled">
                </LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(NPDrugApprovalRejected);