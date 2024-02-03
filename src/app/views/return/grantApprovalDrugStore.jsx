import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { CardTitle, LoonsCard, MainContainer, LoonsTable, Button, SubTitle } from 'app/components/LoonsLabComponents';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {
    Dialog,
    Divider,
    Grid,
    Input,
    TextField
} from '@material-ui/core';

import { useHistory, useParams } from 'react-router-dom';
import { adminApproveOrRejectReset, adminApproveOrReject, getBathDetailsForReturn, getSingleReturnRequestItems, getRemarks, getAllMovingAndNonMovingItems } from './redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents';
import localStorageService from 'app/services/localStorageService';
import moment from 'moment';
import {
    DatePicker,
} from 'app/components/LoonsLabComponents'
import LinkOrder from "./linkToOrderScreens";
export default function ApproveOrReject() {
    const { id } = useParams();
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(20)
    const [remarksOptions, setRemarksOptions] = useState([])
    const [totalItems, setTotalItems] = useState(0)
    const [singleDetails, setSingleDetails] = useState([]);
    const [dataForTable, setDataForTable] = useState([]);
    const [mvingNonMving, setMvingNonMving] = useState([])
    const dispatch = useDispatch();
    const history = useHistory();
    const singleReturnStatus = useSelector((state => state?.returnReducer?.singleReturnStatus))
    const singleReturnDetails = useSelector((state => state?.returnReducer?.singleReturnDetails))
    const movingAndNonMovingItemsStatus = useSelector((state) => state?.returnReducer?.movingAndNonMovingItemsStatus);
    const returnModePagination = useSelector((state) => state?.returnReducer?.returnModePagination)
    const movingAndNonMovingItemsLists = useSelector((state) => state?.returnReducer?.movingAndNonMovingItemsLists)
    const remarksStatus = useSelector((state) => state.returnReducer.remarksStatus);
    const remarksDetails = useSelector((state) => state.returnReducer.remarksDetails);
    const [selectedRemark, setSelectedRemark] = useState("");
    const [otherRemarks, setOtherRemarks] = useState("")
    const [wareHouseName, setWareHouseName] = useState("");
    const approveOrRejectStatus = useSelector((state) => state?.returnReducer?.approveOrRejectStatus);
    const [approveOrRejectModal, setApproveOrRejectModal] = useState(false);
    const [status, setStatus] = useState("");
    const [pharmacyRemark, setPharmacyRemart] = useState([])
    const [payload, setPayload] = useState({
    
        recieving_date: null,
        approve_other_remark: "",
        status: "",
        total_approve_quantity: null,
        approve_remark_id: "",
        return_items: [],
    });
    useEffect(() => {
        getSingleReturnRequestItems(dispatch, id, { page: null, limit: null });
        getRemarks(dispatch)
        /*  if (localStorageService.getItem("Selected_Warehouse")) {
             setWareHouseName(localStorageService.getItem("Selected_Warehouse")?.name)
         } */

       

    }, [])
    const handleSubmit = (status) => {
        setStatus(status);
        if (status === 'APPROVE') {
            let summation = payload.return_items.map((data => data.approve_quantity)).reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0,
            );
            adminApproveOrReject(dispatch, id, { ...payload, approve_other_remark: otherRemarks, total_approve_quantity: summation, status: 'APPROVED', approve_remark_id: selectedRemark.id });
        } else {
            adminApproveOrReject(dispatch, id, { approve_other_remark: otherRemarks, status: 'REJECTED', approve_remark_id: selectedRemark.id });
        }

    }


    const handleItems = (e, data, tableMeta) => {
        let itemsArray = payload.return_items;
        let index = tableMeta?.rowIndex;
        if (itemsArray[index]?.id) {
            itemsArray[index].approve_quantity = parseInt(e.target.value);
            setPayload({ ...payload, return_items: itemsArray })
        } else {
            let obj = {};
            obj["id"] = data;
            obj["approve_quantity"] = parseInt(e.target.value);
            itemsArray.splice(index, 0, obj);
            setPayload({ ...payload, return_items: itemsArray })
        }
    }
    useEffect(() => {
        const qparams = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        if (singleReturnStatus === true) {
            setSingleDetails(singleReturnDetails?.data);
            let ids = singleReturnDetails?.data?.map((data) => data?.ItemSnapBatch?.ItemSnap?.id);
            if (ids.length) {
                getAllMovingAndNonMovingItems(dispatch, { item_id: ids[0], warehouse_id: qparams.to });


            } else {
                setDataForTable([]);
            }

            let returnArray = []
            let return_quantity_value = ""
            singleReturnDetails.data.forEach((val) => {
                return_quantity_value = val?.request_quantity;
                returnArray.push({ ...val, return_quantity_value })
            })
            console.log('cheking return data', returnArray)
            setDataForTable(returnArray);
            setPage(returnModePagination?.page);
            setLimit(returnModePagination?.limit)
            setTotalItems(singleReturnDetails?.totalItems)
        } else {
            setSingleDetails([])
            setPage(0);
            setLimit(20);
        }
    }, [singleReturnStatus])

    useEffect(() => {
        if (remarksStatus === true) {
            // console.log('remarksDetails', remarksDetails)
            // console.log('dataForTable', dataForTable)
            // console.log('my remark 1', dataForTable[0]?.ReturnRequest?.remark_id)
            let myRemark = remarksDetails.filter((data)=>data.id == dataForTable[0]?.ReturnRequest?.remark_id)    //dataForTable[0]?.ReturnRequest?.remark_id
            // console.log('my remark', myRemark)
            setRemarksOptions(remarksDetails);
            setPharmacyRemart(myRemark[0]?.remark)
        } else {
            setRemarksOptions([])
        }
    }, [remarksStatus]);


    useEffect(() => {
        if (movingAndNonMovingItemsStatus === true) {


            setMvingNonMving(movingAndNonMovingItemsLists)

        }
    }, [movingAndNonMovingItemsStatus]);

    const handleOk = () => {
        setApproveOrRejectModal(false);
        adminApproveOrRejectReset(dispatch);
        if (approveOrRejectStatus) {
            history.push("/return/drugstore/return-requests");
        }
    }

    useEffect(() => {
        if (approveOrRejectStatus === true || approveOrRejectStatus === false) {
            setApproveOrRejectModal(true)
        }

    }, [approveOrRejectStatus])


    const columns = [
        {
            name: 'ItemSnapBatch', // field name in the row object
            label: 'Batch No', // field name in the row object
            options: {
                display: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (<span>{value?.batch_no || ""}</span>)
                }
            }
        },
        {
            name: 'ItemSnapBatch',
            label: 'Exp Date',
            options: {
                display: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (<span>{value.exd ? moment(value.exd).format("YYYY-MM-DD") : ""}</span>)
                }
            }
        },

        {
            name: 'return_quantity_value',
            label: 'Return quantity',
            options: {
                display: true
            }
        },
        {
            name: 'total_request_quantity',
            label: 'Estimated expired qty',
            options: {
                display: false
            }

        },
        {
            name: 'id',
            label: 'Returned qty',
            options: {
                display: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (<>
                        {/* <ValidatorForm className=""
                    onSubmit={() => handleSubmit}
                    onError={(error) => console.log(error,"newError")}> */}
                        <TextField className=" w-full"
                            // validators={[
                            //   'required',
                            // ]}
                            // errorMessages={[
                            //   'This field is required',
                            // ]}
                            value={payload?.return_items[tableMeta.rowIndex]?.return_quantity}
                            placeholder="Enter Qty "
                            name="batchQty" InputLabelProps={{
                                shrink: false
                            }}
                            onChange={(e) => handleItems(e, value, tableMeta)}
                            InputProps={{ inputProps: { min: 1 } }}
                            type="number"
                            variant="outlined"
                            size="small"
                        />
                        {/* </ValidatorForm> */}
                    </>)
                }
            }

        },
        // {
        //   name: 'MovingNonMovingItem',
        //   label: 'Approved Return qty',
        //   options: {
        //     display: true,
        //     customBodyRender: (value, tableMeta, updateValue) => {
        //       return (<> <TextField className=" w-full" placeholder="Enter Qty " name="batchQty" InputLabelProps={{
        //         shrink: false
        //       }}
        //         onChange={(e) => handleItems(e, value, tableMeta)}

        //         InputProps={{ inputProps: { min: 1 } }}
        //         min
        //         type="number"
        //         variant="outlined"
        //         size="small"
        //       /></>)
        //     }
        //   }
        // },

    ]

    return (

        <MainContainer>
            <LoonsCard>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                    <Grid
                        container="container"
                        lg={12}
                        md={12}
                        xs={12}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>

                        <Grid container="container" spacing={2} direction="row">
                            <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                <Grid container="container" spacing={2}>
                                    <Grid item="item" xs={12} sm={12} md={4} lg={4}>
                                        <Typography variant="h5" className="font-semibold">Approve/Reject Return Request</Typography>
                                    </Grid>
                                    {/*   <Grid item="item" xs={12} sm={12} md={6} lg={6}>
                                        <table className=" w-full">
                                            <tbody>
                                                <tr>
                                                    <td style={{ float: "right" }}>
                                                        <SubTitle title={`Your Current Warehouse is ${wareHouseName}`} />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Grid> */}
                                    {/* <Grid item="item" xs={12} sm={12} md={2} lg={2}><Button onClick={() => history.push("/return/return-mode")}>Go to Return</Button>
                  </Grid> */}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <Divider className='mb-3 mt-3' />

                <Grid container="container" spacing={2} direction="row">
                    <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                        <Grid container="container" spacing={2}>

                            <Grid item="item" xs={12} sm={12} md={4} lg={4}>
                                <span><b>{singleDetails[0]?.ItemSnapBatch?.ItemSnap?.medium_description}</b></span>
                            </Grid>

                            <Grid item="item" xs={12} sm={12} md={4} lg={4}>
                                <span><b>Qty : {mvingNonMving?.data?.length > 0 ? mvingNonMving?.data[0]?.mystock_quantity : ""}

                                    {console.log(mvingNonMving, "mvingNonMving")}</b></span>
                            </Grid>


                            {/* <Grid item="item" xs={12} sm={12} md={8} lg={8}>
                <TableContainer >
                  <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="right">My Stock months</TableCell>
                        <TableCell align="right">My Stock Qty</TableCell>
                        <TableCell align="right">Total Estimated Expired Qty</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>

                      <TableRow
                        key={"row"}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="right">{batchDetailsReturn[0]?.MovingNonMovingItem?.mystock_months}</TableCell>
                        <TableCell align="right">{batchDetailsReturn[0]?.MovingNonMovingItem?.mystock_quantity}</TableCell>
                        <TableCell align="right">30</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid> */}

                        </Grid>
                    </Grid>
                </Grid>
                <Divider className='mb-3 mt-3' />
                <Grid container="container" className="mt-3 pb-5">
                    <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                        <LoonsTable
                            title={"Batch Details"}
                            id={'allAptitute'} data={dataForTable} columns={columns} options={{
                                pagination: true,
                                serverSide: true,
                                rowsPerPage: limit,
                                count: totalItems,
                                rowsPerPageOptions: [20, 50, 100],
                                page: page,
                                onTableChange: (action, tableState) => {
                                    switch (action) {
                                        case 'changePage':
                                            setPage(tableState.page)
                                            setLimit(tableState.rowsPerPage)
                                            getBathDetailsForReturn(dispatch, id, { page: tableState.page, limit: tableState.rowsPerPage });
                                            break
                                        case 'changeRowsPerPage':
                                            setPage(tableState.page)
                                            setLimit(tableState.rowsPerPage)
                                            getBathDetailsForReturn(dispatch, id, { page: tableState.page, limit: tableState.rowsPerPage });
                                            break
                                        case 'sort':
                                            break
                                        default:
                                            console.log('action not handled.')
                                    }
                                }

                            }}></LoonsTable>
                    </Grid>
                </Grid>
                <Grid container="container" spacing={2} direction="row">
                    <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                        <Grid container="container" spacing={2}>

                            <Grid item="item" xs={12} sm={12} md={6} lg={6}>
                                <ValidatorForm
                                    className="pt-2"
                                    // onSubmit={() =>}
                                    onError={() => null}>
                                    <table className='mb-10'>
                                            <tr>
                                                <td><p className='m-0 p-0'>Pharmacistic Remark :</p></td>
                                                <td>
                                                    <p className='m-0 ml-5 p-0' style={{textAlign:'left'}}>{pharmacyRemark ? pharmacyRemark : dataForTable[0]?.ReturnRequest?.other_remark}</p>
                                                </td>
                                            </tr>
                                    </table>
                                    <table className="w-full">
                                        <tbody>
                                           
                                            <tr>

                                                <td>  <SubTitle title="Select Recieving Date" /></td>
                                                <td><DatePicker
                                                    className="w-full"
                                                    value={
                                                        payload?.recieving_date
                                                    }
                                                    placeholder="Date Range (From)"
                                                    maxDate={new Date()}
                                                    onChange={(date) => {
                                                        let payloads = { ...payload };
                                                        if (date) {
                                                            payloads.recieving_date = date
                                                            setPayload(payloads)
                                                        } else {
                                                            payloads.recieving_date = null
                                                            setPayload(payloads)
                                                        }
                                                    }} /></td>
                                            </tr>
                                            <tr>
                                                <td>  <SubTitle title="Remarks" /></td>
                                                <td>  <Autocomplete
                                                    disableClearable className="w-full" options={remarksOptions}
                                                    getOptionLabel={(
                                                        option) => option.remark}
                                                    onChange={(e, data) => setSelectedRemark(data)}
                                                    value={selectedRemark}
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                    renderInput={(params) => (
                                                        <TextValidator {...params} placeholder="Remarks"
                                                            //variant="outlined"
                                                            fullWidth="fullWidth" variant="outlined" size="small" />
                                                    )}
                                                /></td>
                                            </tr>
                                            <tr>

                                                <td>
                                                    <SubTitle title="Other Remarks" />
                                                </td>

                                                <td>
                                                    <TextField
                                                        variant='outlined'
                                                        placeholder="Enter remarks"
                                                        className='w-full'
                                                        onChange={(e) => setOtherRemarks(e.target.value)}
                                                        multiline
                                                        rows={8}
                                                        maxRows={4}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <br />
                                            </tr>
                                            <tr>
                                                <td>
                                                </td>
                                                <td>
                                                    <Grid container="container" spacing={2} direction="row">
                                                        <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                                            <Grid container="container" spacing={2}>

                                                                {/* <Button style={{ backgroundColor: "blue", height: "50px", width: "250px", color: "white" }} onClick={handleSubmit}><b>Show Intended Pharmacy for Distribution</b></Button> */}

                                                                <Button style={{ backgroundColor: singleDetails[0]?.ReturnRequest?.status === 'APPROVED' || singleDetails[0]?.ReturnRequest?.status === 'REJECTED' ? "grey" : "green", height: "50px", width: "120px", color: "white" }} onClick={(e) => handleSubmit("APPROVE")} disabled={singleDetails[0]?.ReturnRequest?.status === 'APPROVED' || singleDetails[0]?.ReturnRequest?.status === 'REJECTED' ? true : false} type="submit"><b>Approve</b></Button>

                                                                &ensp; <Button style={{ backgroundColor: singleDetails[0]?.ReturnRequest?.status === 'APPROVED' || singleDetails[0]?.ReturnRequest?.status === 'REJECTED' ? "grey" : "red", height: "50px", width: "120px", color: "white" }} onClick={(e) => handleSubmit("REJECT")} type="submit" disabled={singleDetails[0]?.ReturnRequest?.status === 'APPROVED' || singleDetails[0]?.ReturnRequest?.status === 'REJECTED' ? true : false}><b>Reject</b></Button>

                                                                &ensp;{singleDetails[0]?.ReturnRequest?.status === 'APPROVED' && <LinkOrder id={id} screen={"requestedByMe"}></LinkOrder>}
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </ValidatorForm>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid>
                    <br /><br />
                </Grid>
                {/* <Grid container="container" spacing={2} direction="row">
          <Grid container="container" className="mt-3 pb-5">
            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
              <Typography variant="h4" className="font-semibold">Intended Pharmacy for re-distribution of Short dated non Moving surplus stock</Typography><br></br>
              <TableContainer >
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Pharmacy ID</TableCell>
                      <TableCell align="right">Pharmacy Name</TableCell>
                      <TableCell align="right">Order ID</TableCell>\
                      <TableCell align="right">Consumption</TableCell>
                      <TableCell align="right">Order Quantity</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>

                    <TableRow
                      key={"row"}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="right">ABCD001</TableCell>
                      <TableCell align="right">Test</TableCell>
                      <TableCell align="right">ORDER003</TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="right">40</TableCell>
                      <TableCell align="right"><Button>Send Request</Button></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid> */}
            </LoonsCard >

            <Dialog
                fullWidth="fullWidth"
                maxWidth="sm"
                open={approveOrRejectModal}>

                <MuiDialogTitle disableTypography="disableTypography">
                    {status === "APPROVE" && approveOrRejectStatus === true && <CardTitle title="Return Request Was APPROVED" />}
                    {status === "APPROVE" && approveOrRejectStatus === false && <CardTitle title="There was an error when APPROVING" />}
                    {status === "REJECT" && approveOrRejectStatus === true && <CardTitle title="Return Request Was REJECTED" />}
                    {status === "REJECT" && approveOrRejectStatus === false && <CardTitle title="There was an error when REJECTING" />}
                </MuiDialogTitle>

                <div className="w-full h-full px-5 py-5" style={{ marginLeft: "40%" }}>
                    <Button onClick={handleOk}>OK</Button>
                </div>
            </Dialog>
        </MainContainer >
    );
}