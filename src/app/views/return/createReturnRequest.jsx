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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { getBathDetailsForReturn, getDrugStoreDetails, getWareHouseDetails, getRemarks, createReturnRequests, resetCreateRequestStatus, getItemsFromWarehouse } from './redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents';
import { TextareaAutosize } from '@mui/material';
import ApartmentIcon from '@material-ui/icons/Apartment';
import localStorageService from 'app/services/localStorageService';
import moment from 'moment';
import { loginUserTypes } from "../../../../src/appconst";
export default function SingleReturnRequest() {
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const [selectedDrugStore, setSelectedDrugStore] = useState("");
  const [selectedRemarks, setSelectedRemarks] = useState("");
  const [limit, setLimit] = useState(10)
  const [remarksOptions, setRemarksOptions] = useState([])
  const [totalItems, setTotalItems] = useState(0);
  const [createStatus, setCreateStatus] = useState(false)
  const [drugStoreOptions, setDrugStoreOptions] = useState([])
  const [batchDetailsReturn, setBatchDetails] = useState([]);
  const dispatch = useDispatch();
  const [itemWarehouseDetails, setItemwarehouseDetails] = useState([])
  const history = useHistory();
  const itemFromWareHouseDetailsStatus = useSelector((state => state?.returnReducer?.getWarehouseItemsStatus))
  const itemFromWareHouseDetailsData = useSelector((state => state?.returnReducer?.getWarehouseItemsData))
  const batchDetails = useSelector((state => state?.returnReducer?.batchDetailsForReturn))
  const batchDeatilsStatus = useSelector((state => state?.returnReducer?.batchDetailsForReturnStatus))
  const drugStoreStatus = useSelector((state => state?.returnReducer?.drugStoreStatus))
  const drugStoreDetails = useSelector((state => state?.returnReducer?.drugStoreDetails))
  const remarksStatus = useSelector((state) => state.returnReducer.remarksStatus);
  const remarksDetails = useSelector((state) => state.returnReducer.remarksDetails);
  const [payload, setPayload] = useState({
    remark_id: "",
    type: "Pharmacy Return",
    created_by: "",
    return_items: [],
    item_id: "",
    total_request_quantity: "",
    other_remark: "",
    from: localStorageService.getItem("Selected_Warehouse").id,
    to: ""
  });
  const [wareHouseName, setWareHouseName] = useState("")

  const orderRequestStatus = useSelector((data) => data?.returnReducer?.orderRequestStatus)

  useEffect(() => {
    if (itemFromWareHouseDetailsStatus === true) {
      console.log(itemFromWareHouseDetailsData, "itemFromWareHouseDetailsData")
      setItemwarehouseDetails(itemFromWareHouseDetailsData);
    } else {
      setItemwarehouseDetails([]);
    }

  }, [itemFromWareHouseDetailsStatus])

  useEffect(() => {
    resetCreateRequestStatus(dispatch);
    let useDetails = localStorageService.getItem('userInfo');
    getBathDetailsForReturn(dispatch, id, { page, limit });
    getWareHouseDetails(dispatch, { employee_id: useDetails?.id });
    getRemarks(dispatch);
    const ownerId = localStorageService.getItem("userInfo")?.type !== "RMSD MSA" ? localStorageService.getItem("Selected_Warehouse")?.warehouse?.owner_id : '000';
    getDrugStoreDetails(dispatch, { clinic_id: localStorageService.getItem("Selected_Warehouse")?.pharmacy_drugs_stores_id }, localStorageService.getItem("userInfo").type,'000')
    setWareHouseName(localStorageService.getItem("Selected_Warehouse")?.name)

  }, []);

  useEffect(() => {
    if (orderRequestStatus === true || orderRequestStatus === false) {
      setCreateStatus(true);
    }

  }, [orderRequestStatus])

  const handleCreateStatus = () => {
    if (orderRequestStatus) {
      setCreateStatus(false);
      history.push({
        pathname: '/return/return-mode',
        state: { returnRequestDeliveryDetails: true }
      });
      resetCreateRequestStatus(dispatch);
    } else {
      setCreateStatus(false);
      resetCreateRequestStatus(dispatch)
    }
  }

  const handleItems = (e, data, tableMeta) => {
    let itemsArray = payload.return_items;
    let index = tableMeta?.rowIndex;
    if (itemsArray[index]?.item_batch_id) {
      itemsArray[index].request_quantity = parseInt(e.target.value);
      setPayload({ ...payload, return_items: itemsArray })
    } else {
      let obj = {};
      obj["item_batch_id"] = data;
      obj["request_quantity"] = parseInt(e.target.value);
      itemsArray.splice(index, 0, obj);
      setPayload({ ...payload, return_items: itemsArray })
    }
  }

  const handleSubmit = () => {
    let userId = localStorageService.getItem("userInfo")?.id;
    const sum = payload?.return_items?.map((data) => data.request_quantity).reduce((partialSum, a) => partialSum + a, 0);
    createReturnRequests(dispatch, { ...payload, total_request_quantity: sum, created_by: userId, item_id: batchDetailsReturn[0]?.MovingNonMovingItem?.item_id }, history)
  }
  useEffect(() => {
    if (batchDeatilsStatus === true) {
      setBatchDetails(batchDetails?.data)
      setTotalItems(batchDetails?.totalItems)
    } else {
      setBatchDetails([])
      setTotalItems(0)
      setPage({ page: 0, limit: 1 })
    }
  }, [batchDeatilsStatus])

  useEffect(() => {
    if (remarksStatus === true) {
      setRemarksOptions(remarksDetails);
    } else {
      setRemarksOptions([])
    }
  }, [remarksStatus])

  const handleChange = (data, name) => {
    let obj = payload;
    if (name === "drugStore") {
      if (data) {
        obj.to = data.id;
        getItemsFromWarehouse(dispatch, { warehouse_id: data.id, items: batchDetailsReturn[0]?.MovingNonMovingItem?.item_id });

      } else {
        obj.to = ""
        setItemwarehouseDetails([]);
      }
      setPayload(obj);
      setSelectedDrugStore(data);

    } if (name === "remarks") {
      if (data) {
        obj.remark_id = data.id;
      } else {
        obj.remark_id = ""
      }
      setPayload(obj);
      setSelectedRemarks(data);

    }

  }

  const handleInput = (e, name) => {
    if (name === "otherRemarks") {
      let obj = payload;
      obj.other_remark = e.target.value;
      setPayload(obj);
    }
  }


  useEffect(() => {
    if (drugStoreStatus === true) {
      setDrugStoreOptions(drugStoreDetails?.data?.filter((data) => data.id !== localStorageService.getItem("Selected_Warehouse")?.id))
    } else {
      setDrugStoreOptions([])
    }
    console.log(drugStoreDetails?.data?.filter((data) => data.id !== localStorageService.getItem("Selected_Warehouse")?.id), "uuuuuu")
  }, [drugStoreStatus])



  const columns = [
    {
      name: 'batch_no', // field name in the row object
      label: 'Batch No', // field name in the row object

    },
    {
      name: 'exp_date',
      label: 'Exp Date',
      options: {
        display: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (<span>{value ? moment(value).format("YYYY-MM-DD") : ''}</span>)
        }
      }

    },
    {
      name: 'batch_qty',
      label: 'Qty',
      options: {
        display: true,
        // customBodyRender: (value, tableMeta, updateValue) => {
        //   return (<span>{value?.batch_qty}</span>)
        // }
      }

    },
    {
      name: 'MovingNonMovingItem',
      label: 'Consumable time Period',
      options: {
        display: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (<span>{value?.total_remaining_days} Days</span>)
        }
      }
    },
    {
      name: 'moving_quantity',
      label: 'Moving Quantity',

    },
    {
      name: 'non_moving_quantity',
      label: 'Non Moving Quantity',

    },
    {
      name: 'item_batch_id',
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
                  <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                    <Typography variant="h5" className="font-semibold">You're On Return</Typography>
                  </Grid>
                  <Grid item="item" xs={12} sm={12} md={8} lg={8}>
                    <table className=" w-full">
                      <tbody>
                        <tr>
                          <td style={{ float: "right" }}>
                            <SubTitle title={`Your Current Warehouse is ${wareHouseName}`} />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Grid>
                  <Grid item="item" xs={12} sm={12} md={2} lg={2}><Button onClick={() => history.push("/return/return-mode")}>Go to Return</Button>
                  </Grid>
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
                <span><b>{batchDetailsReturn[0]?.MovingNonMovingItem?.item_name}</b></span>
              </Grid>
              <Grid item="item" xs={12} sm={12} md={8} lg={8}>
                <TableContainer >
                  <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="right">My Stock months</TableCell>
                        <TableCell align="right">My Stock Qty</TableCell>
                        {/* <TableCell align="right">Total Estimated Expired Qty</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>

                      <TableRow
                        key={"row"}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="right">{batchDetailsReturn[0]?.MovingNonMovingItem ? (parseFloat(batchDetailsReturn[0]?.MovingNonMovingItem?.mystock_months)).toFixed(1) : ''}</TableCell>
                        <TableCell align="right">{batchDetailsReturn[0]?.MovingNonMovingItem?.mystock_quantity}</TableCell>
                       
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

            </Grid>
          </Grid>
        </Grid>
        <Divider className='mb-3 mt-3' />
        <ValidatorForm className=""
          onSubmit={handleSubmit}
          onError={(error) => console.log(error, "error>>>>>")}>
          <Grid container="container" className="mt-3 pb-5">

            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
              <LoonsTable
                title={"Batch Details"}
                id={'allAptitute'} data={batchDetailsReturn} columns={columns} options={{
                  pagination: true,
                  serverSide: true,
                  rowsPerPage: limit,
                  count: totalItems,
                  rowsPerPageOptions: [10, 20, 50, 100],
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
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td>  <SubTitle title="Return Request to" /></td>
                        <td>
                          <Autocomplete
                                        disableClearable className="w-full" options={drugStoreOptions}
                            onChange={(e, data) => handleChange(data, "drugStore")}
                            value={selectedDrugStore}
                            getOptionLabel={(
                              option) => localStorageService.getItem("userInfo").type === 'test' ? option?.Warehouse?.name : option?.name}
                            renderInput={(params) => (
                              <TextValidator {...params}
                                placeholder="Return Request to"
                                className=" w-full" name="batchQty" InputLabelProps={{
                                  shrink: false
                                }}
                                value={payload.to || ""}
                                variant="outlined"
                                size="small"

                                validators={[
                                  'required',
                                ]}
                                errorMessages={[
                                  'This field is required',
                                ]} />
                            )}
                          /></td>
                      </tr>
                      {itemWarehouseDetails.length > 0 ?
                        <tr>
                          <td></td>
                          <td>

                            <table className="w-full">
                              <th style={{ textAlign: "left" }}>
                                BatchNo
                              </th>
                              <th style={{ textAlign: "left" }}>
                                Quantity
                              </th>
                              <th style={{ textAlign: "left" }}>
                                Latest expiry date
                              </th>
                              <tbody>
                                {itemWarehouseDetails?.map((data) =>
                                  <tr>
                                    <td>
                                      {data?.batch_no}
                                    </td>
                                    <td>
                                      {data?.quantity}
                                    </td>
                                    <td>
                                      {data?.exd ? moment(data?.exd).format("YYYY-MM-DD") : ""}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>

                          </td>
                        </tr>
                        : <tr> <td></td>
                          <td> {payload.to !== "" && itemWarehouseDetails.length === 0 ? "No available stocks" : ""}</td></tr>}
                      <tr>
                        <td>  <SubTitle title="Remarks" /></td>
                        <td>  <Autocomplete
                                        disableClearable className="w-full" options={remarksOptions}
                          getOptionLabel={(
                            option) => option.remark}
                          value={selectedRemarks}
                          onChange={(e, data) => handleChange(data, "remarks")}
                          renderInput={(params) => (
                            <TextValidator {...params} placeholder="Remarks"/>)}/></td>
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
                            onChange={(e) => handleInput(e, "otherRemarks")}
                            multiline
                            rows={8}
                            maxRows={4}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>  </td>
                        <td> <Button style={{ backgroundColor: "green", height: "50px", width: "120px", color: "white" }} type="submit" ><b>Submit</b></Button></td>
                      </tr>
                    </tbody>
                  </table>
                </Grid>
                <Grid item="item" xs={12} sm={12} md={6} lg={6}>
                  {/* <table className="w-full">
                    <tbody>
                      
                    </tbody>
                  </table> */}


                  {/* <Grid container="container" spacing={2} direction="row">
                  <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                    <Grid container="container" spacing={2}>
                      <Grid item="item" xs={12} sm={12} md={2} lg={2}>
                      </Grid>
                      <Grid item="item" xs={12} sm={12} md={6} lg={6}>
                        <Button style={{ backgroundColor: "green", height: "50px", width: "120px", color: "white" }} type="submit" ><b>Submit</b></Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid> */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ValidatorForm>
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
        open={createStatus}>

        <MuiDialogTitle disableTypography="disableTypography">
          {orderRequestStatus ? <CardTitle title="Return Request Was Created Successfully" /> : <CardTitle title="There was an error when creating the return Requests" />}

        </MuiDialogTitle>

        <div className="w-full h-full px-5 py-5" style={{ marginLeft: "40%" }}>
          <Button onClick={handleCreateStatus}>OK</Button>
        </div>
      </Dialog>
    </MainContainer >
  );
}