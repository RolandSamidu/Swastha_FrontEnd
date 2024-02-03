import { CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Select, TextField, Tooltip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { LoonsCard, LoonsTable, MainContainer, SubTitle, Button } from "app/components/LoonsLabComponents";
import React from "react";
import { Component } from "react";
import SearchIcon from '@material-ui/icons/Search';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import moment from "moment";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { getAllReturnRequests } from "../redux/action";
import {
  DatePicker,
} from 'app/components/LoonsLabComponents'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Changewarehouse from "../changeWareHouseComponent";
import localStorageService from "app/services/localStorageService";
import { returnStatusOptions } from "../../../../../src/appconst";
import { getDrugStoreDetails } from "../redux/action";
class ReturnMode extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: true,
      columns: [
        {
          name: 'toStore', // field name in the row object
          label: 'Warehouse', // column title that will be shown in table
          options: {
            filter: true,
            display: true,
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                <>
                  <span>{value?.name}</span>
                </>
              )
            },
          },
        },
        {
          name: 'request_id',
          label: 'Return Request Id',
          options: {
            // filter: true,
          },
        },
        {
          name: 'ItemSnap',
          label: 'SR No',
          options: {
            filter: true,
            display: true,
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                <>
                  <span>{value?.sr_no}</span>
                </>
              )
            },
          },
        },
        {
          name: 'ItemSnap',
          label: 'SR Name',
          options: {
            filter: true,
            display: true,
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                <>
                  <span>{value?.medium_description}</span>
                </>
              )
            },
          },
        }, {
          name: 'total_request_quantity',
          label: 'Return Qty',
          options: {
            // filter: true,
          },
        },
        {
          name: 'shortReference',
          label: 'Custodian',
          options: {
            // filter: true,
          },
        },
        {
          name: 'status',
          label: 'Status',
          options: {
            display: true,
            filter: true,
            customBodyRender: (value, tableMeta, updateValue) =>
              <span>{value.toUpperCase()}</span>

          },
        },

        {
          name: 'id',
          label: 'Action',
          options: {
            filter: true,
            display: true,
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                <IconButton
                  className="text-black mr-2"
                  onClick={null}
                >
                  <RemoveRedEyeIcon onClick={() => this.props.history.push(`/return/grant/approval/${value}`)}>mode_view_outline</RemoveRedEyeIcon>
                </IconButton>
              )
            },
          },
        },
      ],
      owner_id: "",
      status: "",
      drugStore: "",
      toDate: null,
      fromDate: null,
      drugStoreOptions: [],
      totalItems: 0,
      page: 0,
      limit: 20,
    }
  }
  componentDidMount() {
    if (localStorage.getItem("Selected_Warehouse")) {
      let warehouse_id = localStorageService.getItem("Selected_Warehouse")?.id;
      this.props.getAllReturnRequests({ page: this.state.page, limit: this.state.limit, to: warehouse_id, status: "ADMIN_ACCEPT" });
      this.setState({ warehouse_id });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.allReturnRequestStatus) {
      this.setState({
        data: nextProps?.allReturnRequestDetails?.data,
        totalItems: nextProps?.allReturnRequestDetails?.totalItems,
        page: nextProps?.returnRequestsPagination?.page,
        limit: nextProps?.returnRequestsPagination?.limit,
        loading: false
      });
    } else {
      this.setState({
        data: [],
        totalItems: 0,
        page: nextProps?.returnRequestsPagination?.page,
        limit: nextProps?.returnRequestsPagination?.limit,
        loading: false
      });
    }
    if (nextProps.wareHouseStatusModal === true || nextProps.wareHouseStatusModal === false) {
      this.setState({ warehouse_id: localStorageService.getItem("Selected_Warehouse") ? localStorageService.getItem("Selected_Warehouse").id : "" })
    }
    if (nextProps?.drugStoreStatus) {
      console.log(nextProps?.drugStoreDetails, "testing>>>>>")
      this.setState({
        drugStoreOptions: nextProps?.drugStoreDetails?.data
      })
    }
  }
  handlechange = (data, name) => {
    if (data && typeof data !== "string") {

      this.setState({ [name]: data.value });

    } else if (data === null || data === "") {
      if (name === "consumabletTmePeriod") {
        this.setState({ consumabletTmePeriodFromDate: "", consumabletTmePeriodtoDate: "" });

      } else {
        this.setState({ [name]: "" });
      }

    } else if (typeof data === "string") {
      if (name === "consumabletTmePeriod") {
        let todayDate = new Date();
        this.setState({ consumabletTmePeriodtoDate: moment(new Date()).format("YYYY-MM-DD"), consumabletTmePeriodFromDate: moment(todayDate.setMonth(todayDate.getMonth() - parseInt(data))).format("YYYY-MM-DD") });
      } else {
        this.setState({ [name]: data });
      }
    }

  }

  handleFilterButton = () => {
    this.setState({ loading: true });
    let params = {
      from_date: this.state.fromDate ? moment(this.state.fromDate).format("YYYY-MM-DD") : null,
      to_date: this.state.toDate ? moment(this.state.toDate).format("YYYY-MM-DD") : null,
      page: this.state.page,
      limit: this.state.limit,
      status: "ADMIN_ACCEPT",
      to: this.state.warehouse_id,
    };
    this.props.getAllReturnRequests(params);
  }



  handlePaginations = (page, limit) => {
    let params = {
      from_date: this.state.fromDate ? moment(this.state.fromDate).format("YYYY-MM-DD") : null,
      to_date: this.state.toDate ? moment(this.state.toDate).format("YYYY-MM-DD") : null,
      page,
      limit,
      to: this.state.warehouse_id,
      status: "ADMIN_ACCEPT"
    };

    this.setState({ page, limit, loading: true }, () => this.props.getAllReturnRequests(params));
  }


  render() {

    return (
      <MainContainer>
        <LoonsCard>

          {/* <Grid container spacing={2}>
            <Grid item lg={3} xs={12} className='mt-5'>
              <h4 >Filters</h4>
            </Grid>
          </Grid> */}
          {/* <Grid container spacing={1}>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid> */}
          <ValidatorForm
            className=""
            onSubmit={() => this.SubmitAll()}
            onError={() => null}>
            <Grid container className='mt-5'>
              {/* <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                <SubTitle title={"Status"}></SubTitle>
                <Autocomplete
                                        disableClearable
                  className="w-full"
                  options={returnStatusOptions}
                  value={this.state.status}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, data) => { if (data) { this.setState({ status: data }) } else { this.setState({ status: "" }) } }}
                  renderInput={(params) => (
                    <TextValidator
                      {...params}
                      placeholder="Status"
                      //variant="outlined"
                      //value={}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      size="small"

                    />
                  )}
                />
              </Grid> */}
              <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                <SubTitle title={"Date Range"}></SubTitle>
                <DatePicker
                  className="w-full"
                  value={
                    this.state.fromDate
                  }
                  placeholder="Date Range (From)"
                  maxDate={new Date()}
                  onChange={(date) => {
                    if (date) {
                      this.setState({ fromDate: date })
                    } else {

                      this.setState({ fromDate: null })
                    }
                  }} />
              </Grid>
              <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                <SubTitle title={"Date Range"}></SubTitle>
                <DatePicker
                  className="w-full"
                  value={
                    this.state.toDate
                  }
                  placeholder="Date Range (to)"
                  maxDate={new Date()}
                  onChange={(date) => {
                    if (date) {
                      this.setState({ toDate: date })
                    } else {

                      this.setState({ toDate: null })
                    }
                  }} />
              </Grid>
              <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                <Button
                  className="text-right mt-6"
                  progress={false}
                  scrollToTop={false}
                  // type='submit'
                  onClick={() => { this.handleFilterButton() }}
                >
                  <span className="capitalize">Filter</span>
                </Button>
                &ensp;<Button
                  className="text-right mt-6"
                  progress={false}
                  scrollToTop={false}
                  // type='submit'
                  onClick={() => {
                    this.setState({
                      status: "", drugStore: "", fromDate: null, toDate: null, loading: true
                    }, () => this.props.getAllReturnRequests({ page: this.state.page, limit: this.state.limit, to: this.state.warehouse_id, status: "ADMIN_ACCEPT" }))
                  }}
                >
                  <span className="capitalize">Reset</span>
                </Button>
              </Grid>
            </Grid>
            <Grid container className='mt-5'>
              <Grid item lg={2} md={2} sm={3} xs={3} className="px-2">
                <TextValidator
                  className='w-full mt-5 pl-2'
                  placeholder="Search"
                  //variant="outlined"
                  // fullWidth="fullWidth" 
                  variant="outlined"
                  size="small"
                  // value={this.state.filterData.search}
                  onChange={(e, value) => {
                    let filterData = this.state.filterData
                    if (e.target.value) {
                      let filterDataValidation = this.state.filterDataValidation;
                      filterDataValidation.search = true;
                      filterData.search = e.target.value;
                      this.setState({ filterDataValidation })
                    } else {
                      filterData.search = null
                    }

                    this.setState({ filterData })

                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {/* <SearchIcon></SearchIcon> */}
                      </InputAdornment>
                    )
                  }} />

              </Grid>
              <Grid item lg={1} md={1} sm={1} xs={1} className="text-right px-2">
                <Button
                  className="text-right mt-6"
                  progress={false}
                  scrollToTop={false}
                  // type='submit'
                  startIcon="search"
                  onClick={() => { this.handleSearchButton() }}
                >
                  <span className="capitalize">Search</span>
                </Button>
              </Grid>
            </Grid>
          </ValidatorForm>

          <Grid container="container" className="mt-3 pb-5">
            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
              {
                !this.state.loading
                  ? <LoonsTable
                    //title={"All Aptitute Tests"}
                    id={'allAptitute'} data={this.state.data} columns={this.state.columns} options={{
                      pagination: true,
                      serverSide: true,
                      rowsPerPage: this.state.limit,
                      count: this.state.totalItems,
                      rowsPerPageOptions: [20, 50, 100],
                      page: this.state.page,
                      onTableChange: (action, tableState) => {
                        switch (action) {

                          case 'changePage':
                            this.handlePaginations(tableState.page, tableState.rowsPerPage)
                            break;
                          case 'changeRowsPerPage':
                            this.handlePaginations(tableState.page, tableState.rowsPerPage)
                            break
                          case 'sort':
                            //this.sort(tableState.page, tableState.sortOrder);
                            break
                          default:

                        }
                      }
                    }}></LoonsTable>
                  : (
                    //loading effect
                    <Grid className="justify-center text-center w-full pt-12">
                      <CircularProgress size={30} />
                    </Grid>
                  )
              }

            </Grid>
          </Grid>
        </LoonsCard>
        <Changewarehouse isOpen={this.props.isOpen} type="myAllReturnRequests" />
      </MainContainer>
    )
  }


}

const mapDispatchToProps = dispatch => {
  return {
    getAllReturnRequests: (params) => getAllReturnRequests(dispatch, params),
    getDrugStoreDetails: (id) => getDrugStoreDetails(dispatch, id)
  }
}

const mapStateToProps = ({ returnReducer }) => {
  return {
    allReturnRequestStatus: returnReducer?.allReturnRequestStatus,
    allReturnRequestDetails: returnReducer?.allReturnRequestDetails,
    returnRequestsPagination: returnReducer?.returnRequestsPagination,
    drugStoreStatus: returnReducer?.drugStoreStatus,
    drugStoreDetails: returnReducer?.drugStoreDetails
  }

}




export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReturnMode));