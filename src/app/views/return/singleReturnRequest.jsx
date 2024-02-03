import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { LoonsCard, MainContainer, SubTitle, LoonsTable } from 'app/components/LoonsLabComponents';
import {
  CircularProgress,
  Divider,
  Grid
} from '@material-ui/core';

import { useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleReturnRequestItems, getSingleReturnRequestDetails, getBathDetailsForReturn } from "./redux/action"
import moment from 'moment';
import LinkButton from "./linkToOrderScreens";

export default function SingleReturnRequest() {

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totlaItems, setTotalItems] = useState(0);
  const [singleDetailedInfo, setSingleDetailedInfo] = useState([]);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const singleReturnDetails = useSelector((state) => state?.returnReducer?.singleReturnDetails);
  const singleReturnStatus = useSelector((state) => state?.returnReducer?.singleReturnStatus);
  const singleReturnDetailStatus = useSelector((state) => state?.returnReducer?.singleReturnDetailStatus);
  const singleReturnDetailsInfo = useSelector((state) => state?.returnReducer?.singleReturnDetailsInfo);
  const batchDetails = useSelector((state => state?.returnReducer?.batchDetailsForReturn))
  const batchDeatilsStatus = useSelector((state => state?.returnReducer?.batchDetailsForReturnStatus))
  const [batchDetailsVal, setBatch] = useState([])

  useEffect(() => {
    getSingleReturnRequestItems(dispatch, id, { page, limit });
    getSingleReturnRequestDetails(dispatch, id);

  }, [])

  useEffect(() => {
    if (batchDeatilsStatus === true) {
      setBatch(batchDetails?.data)
    } else {
      setBatch([]);
    }
  }, [batchDeatilsStatus])

  useEffect(() => {
    if (singleReturnDetailStatus) {
      setSingleDetailedInfo(singleReturnDetailsInfo)
    } else {
      setSingleDetailedInfo([]);
    }
  }, [singleReturnDetailStatus])


  useEffect(() => {
    if (singleReturnStatus) {
      setData(singleReturnDetails?.data);
      console.log(singleReturnDetails?.data, "lllll")
      getBathDetailsForReturn(dispatch, singleReturnDetails?.data[0]?.ItemSnapBatch?.ItemSnap?.id, { page: null, limit: null });
      setTotalItems(singleReturnDetails?.totalItems);
      setLoading(false);
      setTotalItems(singleReturnDetails?.totalItems);
    } else {
      setData([]);
      setLoading(false);
      setTotalItems(0);
    }
  }, [singleReturnStatus])



  const columns = [
    {
      name: 'ItemSnapBatch',
      label: 'Batch no', options: {
        display: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (<span>{value ? value?.batch_no : ""}</span>)
        }
      }
    },
    {
      name: 'ItemSnapBatch',
      label: 'Exp Date', options: {
        display: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (<span>{value ? moment(value.exd).format("YYYY-MM-DD") : ""}</span>)
        }
      }
    },


    // {
    //   name: 'category',
    //   label: 'Qty',

    // },
    // {
    //   name: 'ItemSnap',
    //   label: 'Consumable time Period',
    //   options: {
    //     display: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return (<span>{value?.medium_description}</span>)
    //     }
    //   }
    // },
    // {
    //   name: 'total_request_quantity',
    //   label: 'Estimated expired qty',
    //   // options: {
    //   //     // filter: true,
    //   // },
    // },
    {
      name: 'request_quantity',
      label: 'Returned qty',
      options: {
        filter: true,
        display: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (<span>{value}</span>)
        }
      },
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
            <Grid item="item">
              <Typography variant="h6" className="font-semibold">Return Request</Typography>
            </Grid>
            <Grid>

              {singleDetailedInfo?.status === "APPROVED" && <LinkButton id={id} screen="requestedToMe" />}
             
            </Grid>

          </Grid>
        </div>
        <Divider className='mb-3 mt-3' />

        <Grid container="container" spacing={2} direction="row">
          <Grid item="item" xs={12} sm={12} md={12} lg={12}>
            <Grid container="container" spacing={2}>

              <Grid item="item" xs={12} sm={12} md={4} lg={4}>
                <span><b>Return request ID: {singleDetailedInfo?.request_id}</b></span>
              </Grid>
              <Grid item="item" xs={12} sm={12} md={4} lg={4}>
                <span><b>Return to:{singleDetailedInfo?.toStore?.name}</b></span>
              </Grid>
              <Grid item="item" xs={12} sm={12} md={4} lg={4}>
                <span><b>Pick up Person</b></span>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <b>ID:</b>
                      </td>
                      <td>
                        3456
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>NAME:</b>
                      </td>
                      <td>
                        {singleDetailedInfo?.PickupPerson?.name}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Contact Number:</b>
                      </td>
                      <td>
                        3456
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider className='mb-3 mt-3' />
        <Grid container="container" spacing={2} direction="row">
          <Grid item="item" xs={12} sm={12} md={12} lg={12}>
            <Grid container="container" spacing={2}>
              <Grid item="item" xs={12} sm={12} md={10} lg={10}>
                <Typography variant="h6" className="font-semibold">{singleDetailedInfo?.ItemSnap?.sr_no}  {singleDetailedInfo?.ItemSnap?.medium_description}</Typography>
              </Grid>
              <Grid item="item" xs={12} sm={12} md={2} lg={2}>
                <Typography variant="h6" className="font-semibold">{singleDetailedInfo?.status}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container="container" spacing={2} direction="row">
          <Grid item="item" xs={12} sm={12} md={12} lg={12}>
            <Grid container="container" spacing={2}>
              <Grid item="item" xs={12} sm={12} md={4} lg={4}>

              </Grid>
              {/* <Grid item="item" xs={12} sm={12} md={8} lg={8}>
                <TableContainer >
                  <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="right">My Stock days</TableCell>
                        <TableCell align="right">My Stock Qty</TableCell>
                        <TableCell align="right">total Estimated Expired Qty</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>

                      <TableRow
                        key={"row"}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="right">20</TableCell>
                        <TableCell align="right">30</TableCell>
                        <TableCell align="right">30</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid> */}
            </Grid>
          </Grid>
        </Grid>
        <Grid container="container" spacing={2} direction="row">
          <Grid item="item" xs={12} sm={12} md={12} lg={12}>
            <Grid container="container" spacing={2}>
              {!loading ?
                <LoonsTable
                  title={"Batch Details"}
                  id={'allAptitute'} data={data} columns={columns} options={{
                    pagination: true,
                    serverSide: true,
                    rowsPerPage: limit,
                    count: totlaItems,
                    rowsPerPageOptions: [10, 20, 50, 100],
                    page: page,
                    onTableChange: (action, tableState) => {
                      switch (action) {
                        case 'changePage':
                          setPage(tableState.page)
                          setLimit(tableState.rowsPerPage)
                          getSingleReturnRequestItems(dispatch, id, { page: tableState.page, limit: tableState.rowsPerPage })
                          break
                        case 'changeRowsPerPage':
                          setPage(tableState.page)
                          setLimit(tableState.rowsPerPage)
                          getSingleReturnRequestItems(dispatch, id, { page: tableState.page, limit: tableState.rowsPerPage })
                          break
                        case 'sort':
                          break
                        default:
                      }
                    }

                  }}></LoonsTable> : <Grid className="justify-center text-center w-full pt-12">
                  <CircularProgress size={30} />
                </Grid>}
            </Grid>
          </Grid>
        </Grid>
        <Grid container="container" spacing={2} direction="row">
          <Grid item="item" xs={12} sm={12} md={12} lg={12}>
            <Grid container="container" spacing={2}>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <b>Order Rmark:</b>
                    </td>
                    <td>
                      {singleDetailedInfo?.OrderRemark?.remark}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Pick Up Remark:</b>
                    </td>
                    <td>
                      {singleDetailedInfo?.PickUpRemark?.remark}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {/* <LinkButton id={id} screen="reqestedByMe"/> */}
                    </td>

                  </tr>
                  {/* <tr>
                    <td>
                      <LinkButton id={id} screen="reqestedByMe" />
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </Grid>
          </Grid>

        </Grid>
      </LoonsCard>
    </MainContainer>
  );
}