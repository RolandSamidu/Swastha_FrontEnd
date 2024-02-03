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
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import { dateParse } from "utils";
import WarehouseServices from "app/services/WarehouseServices";
import ClinicService from "app/services/ClinicService";
class ReturnMode extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: true,
      payload: {
        recieving_date: "",
        approve_other_remark: "Pharmacy Return",
        status: "",
        return_items: [],
        total_approve_quantity: "",
        approve_remark_id: "",
      },
      columns: [
        {
          name: 'fromStore', // field name in the row object
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
              let row= this.state.data[tableMeta.rowIndex]
             
              //console.log("selected data",row)
              return (
                <IconButton
                  className="text-black mr-2"
                  onClick={null}
                >
                  <RemoveRedEyeIcon onClick={() =>  window.location.href = `/return/drugstore/grant/approval/${value}?to=${this.state.user_roles?.includes('MSD AD') ? row.to : this.state.warehouse_id}`}>mode_view_outline</RemoveRedEyeIcon>
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
      search:null,
      warehouse_id:null,
      drugStoreOptions: [],
      all_pharmacy: [],
      warehouseId: null,
      all_drug_stores:[],

      filterData : {

      },
      totalItems: 0,
      page: 0,
      limit: 20,
    }
  }
  async componentDidMount() {
    let user_info = await localStorageService.getItem('userInfo')

    this.setState({
      userRole : user_info?.roles[0]
    }, ()=>{
      this.dataLoad()
    })
   
  }

  async dataLoad() {
    let selected_Warehouse = await localStorageService.getItem("Selected_Warehouse")
    let user_info = await localStorageService.getItem('userInfo')
    let owner_id = await localStorageService.getItem('owner_id')
    this.setState({user_roles:user_info?.roles}) 

    if (selected_Warehouse) {
      let warehouse_id = selected_Warehouse?.id;

      this.props.getAllReturnRequests({
        page: 0,
        limit:10,
        to: user_info?.roles?.includes('MSD AD') ? this.state.warehouseId : warehouse_id,
        to_owner_id: user_info?.roles?.includes('MSD AD') ? '000' : null,
        request_id : this.state.requestId
      });
      this.setState({ warehouse_id });
    } else if (user_info?.roles?.includes('MSD AD')) {
      this.props.getAllReturnRequests({
        page: 0,
        limit: 10,
        to: this.state.warehouseId,
        to_owner_id: '000',
        request_id : this.state.requestId
      });
    }
  }

  handleItems = (e, data, tableMeta) => {
    let itemsArray = this.state.payload.return_items;
    let index = tableMeta?.rowIndex;
    if (itemsArray[index]?.id) {
      itemsArray[index].approve_quantity = parseInt(e.target.value);
      this.setState({ payload: { ...this.state.payload, return_items: itemsArray } })
    } else {
      let obj = {};
      obj["id"] = data;
      obj["approve_quantity"] = parseInt(e.target.value);
      itemsArray.splice(index, 0, obj);
      this.setState({ payload: { ...this.state.payload, return_items: itemsArray } })
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
      from_date: this.state.fromDate ? dateParse(this.state.fromDate) : null,
      to_date: this.state.toDate ? dateParse(this.state.toDate) : null,
      page: this.state.page,
      limit: this.state.limit,
      status: this.state.status !== "" ? this.state.status.value : null,
      to: this.state.warehouse_id,
      search:this.state.search
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
      status: this.state.status !== "" ? this.state.status.value : null
    };

    this.setState({ page, limit, loading: true }, () => this.props.getAllReturnRequests(params));
  }


async loadWarehouses(search) {
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
        all_drug_stores: res.data.view.data
      });
  }
}


  render() {

    return (
      <MainContainer>
       

         {/*  <Grid container spacing={2}>
            <Grid item lg={3} xs={12} className='mt-5'>
              <h4 >Filters</h4>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid> */}
          {/* <ValidatorForm
            className=""
            onSubmit={() => this.SubmitAll()}
            onError={() => null}>
            <Grid container className='mt-5'>
              <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
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
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      size="small"

                    />
                  )}
                />
              </Grid>
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
                    }, () => this.props.getAllReturnRequests({ page: this.state.page, limit: this.state.limit, to: this.state.warehouse_id }))
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
                  variant="outlined"
                  size="small"
                  onChange={(e, value) => {
                    let filterData = this.state.filterData
                    if (e.target.value) {
                      let filterDataValidation = this.state.filterDataValidation;
                      filterDataValidation.search = true;
                      this.setState({ filterDataValidation,search:e.target.value })
                    } else {
                     
                    }

                    this.setState({ filterData,search:e.target.value })

                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
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
                  onClick={() => { this.handleFilterButton() }}
                >
                  <span className="capitalize">Search</span>
                </Button>
              </Grid>
            </Grid>
          </ValidatorForm> */}
                        {console.log('dhdd hdhd hdhd', this.state.userRole )}
                        {this.state.userRole === 'MSD AD' &&
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.dataLoad()}
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid
                                container="container"
                                spacing={2}
                                direction="row"
                            >
                                <Grid
                                    item="item"
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                >
                                    <Grid container="container" spacing={2}>

                                        <Grid
                                            className=" w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Return Request ID" />
                                            <TextValidator
                                                className="w-full"
                                                placeholder="Return Request ID"
                                                fullWidth={true}
                                                variant="outlined"
                                                size="small"
                                                // type="number"
                                                // minLength={8}
                                                // value={this.state.formData.start_sr}
                                                onChange={(e) => {
                                                    // let formData = this.state.formData;
                                                    // formData.start_sr = e.target.value;
                                                    this.setState({ requestId : e.target.value });
                                                }}
                                                // validators={this.state.formData.start_sr ? ['minStringLength:8', 'matchRegexp:^[0-9]+$'] : null}
                                                // errorMessages={[
                                                //     'Number must be at least 8 digits',
                                                //     'Only numbers are allowed',
                                                // ]}
                                            />

                                        </Grid>


                                        {/* Item Group*/}
                                        <Grid
                                            className="w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Warehouse" />
                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_drug_stores}
                                                placeholder="Warehouse"

                                                onChange={(e, values) => {
                                                    this.setState({ warehouseId : values?.id });
                                                }}

                                                // value={this.state.all_item_group.filter((option) =>
                                                //     this.state.formData.group_id.includes(option.id)
                                                // )}

                                                getOptionLabel={(option) => (option?.name)}

                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Item Group"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"

                                                        onChange={(e)=>{

                                                          if (e.target.value.length > 3) {
                                                            this.loadWarehouses(e.target.value)
                                                          }
                                                          
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>


                                        <Grid
                                            className=" w-full mt-6"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <LoonsButton
                                                color="primary"
                                                size="medium"
                                                type="submit"
                                            >
                                                Filter
                                            </LoonsButton>
                                        </Grid>


                                    </Grid>


                                </Grid>

                            </Grid>
                        </ValidatorForm> 
                        }

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