import React, { Component, Fragment } from "react";
import { Button, CardTitle, LoonsCard, LoonsTable, MainContainer, SubTitle} from "../../components/LoonsLabComponents";
import { CircularProgress, Grid, Link, Tooltip, IconButton ,InputAdornment,Typography  } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import VisibilityIcon from '@material-ui/icons/Visibility';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import EditIcon from '@material-ui/icons/Edit';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import ConsignmentService from "../../services/ConsignmentService";
import moment from "moment";
import * as appConst from '../../../appconst'
import WarehouseServices from "app/services/WarehouseServices";
import SearchIcon from '@material-ui/icons/Search';
import { dateParse } from 'utils'

class DSWarehouseItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            totalItems: 0,
            ref_no: '',
            sr_no: '',
            batch_id: '',
            wharf_ref_no: '',
            mas_remark: '',

            formData: {
                ref_no: '',
                sr_no: '',
                batch_id: '',
                wharf_ref_no: '',
                mas_remark: '',
                items: []
            },

            filterData: {
                limit: 20,
                page: 0,
                warehouse_id:this.props.match.params.id,
                item_id:null,
                exp_date_grater_than_zero:true,
                /* ref_no: '',
                sr_no: '',
                batch_id: '',
                mas_remark: '',
                wharf_ref_no: '', */
            },
            alltypes:[],
            allStid:[],
            sampleData: [],

            sampleItemData: [],

            data: [],
            columns: [
            //     {
            //         name: 'Action', // field name in the row object
            //         label: 'Action', // column title that will be shown in table
            //         options: {
            //             filter: true,
            //             display: true,
            //             customBodyRenderLite: (dataIndex) => {
            //                   let id = this.state.data[dataIndex].id;
            //                   return (
            //                       <Grid className="flex items-center">
            //                            <Tooltip title="Edit">
            //                               <IconButton
            //                                       onClick={() => {
            //                                           window.location.href = `/warehouse/drug-store/editwarehousetab/${id}`
                                                     
            //                                       }}>
            //                                      <EditIcon color="primary" />
            //                                   </IconButton>
            //                           </Tooltip> 
            //                           {/* <Grid className="px-2">
            //                               <Tooltip title="View">
            //                                   <IconButton
            //                                       onClick={() => {
            //                                           window.location.href = `/consignments/view-consignment/${id}`
            //                                       }}>
            //                                       <VisibilityIcon color='primary' />
            //                                   </IconButton>
            //                               </Tooltip>
            //                           </Grid> */}
            //                       </Grid>
            //                   );
            //               }
            //           },
            //     },
                // {
                //     name: 'department_id', // field name in the row object
                //     label: 'Department ID', // column title that will be shown in table
                //     options: {
                //         filter: false,
                //         display: true,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data = this.state.data[dataIndex].Pharmacy_drugs_store.Department.id
                //             return <p>{data}</p>
                //         },
                //     },
                // },
            //     {
            //         name: 'department_name', // field name in the row object
            //         label: 'Department Name', // column title that will be shown in table
            //         options: {
            //             filter: false,
            //             display: true,
            //             customBodyRenderLite: (dataIndex) => {
            //                 let data = this.state.data[dataIndex].Pharmacy_drugs_store.Department.name
            //                 return <p>{data}</p>
            //             },
            //         },
            //     },
            //     {
            //         name: 'store_id', // field name in the row object
            //         label: 'Store ID', // column title that will be shown in table
            //         options: {
            //             filter: false,
            //             display: true,
            //             customBodyRenderLite: (dataIndex) => {
            //                 let data = this.state.data[dataIndex].Pharmacy_drugs_store.store_id
            //                 return <p>{data}</p>
            //             },
            //         },
            //     },
                {
                    name: 'batch_no', // field name in the row object
                    label: 'Batch No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].ItemSnapBatch.batch_no
                            return <p>{data}</p>
                        },
                    },
                },
                {
                  name: 'quantity', // field name in the row object
                  label: 'Quantity', // column title that will be shown in table
                  options: {
                      filter: false,
                      display: true,
                  //     customBodyRenderLite: (dataIndex) => {
                  //         let data = this.state.data[dataIndex].quantity
                  //         return <p>{data}</p>
                  //     },
                  },
              },
                {
                    name: 'pack_size', // field name in the row object
                    label: 'Pack Size', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].ItemSnapBatch.pack_size
                            return <p>{data}</p>
                        },
                    },
                },
                {
                  name: 'expiry_date', // field name in the row object
                  label: 'Expiry Date', // column title that will be shown in table
                  options: {
                      filter: false,
                      display: true,
                      customBodyRenderLite: (dataIndex) => {
                          let data = this.state.data[dataIndex].ItemSnapBatch.exd
                          return <p>{dateParse(data)}</p>
                      },
                  },
              },
                // {
                //     name: 'address', // field name in the row object
                //     label: 'Address', // column title that will be shown in table
                //     options: {
                //         filter: false,
                //         display: true
                //     },
                // },
            //     {
            //         name: 'map_location', // field name in the row object
            //         label: 'Map Location', // column title that will be shown in table
            //         options: {
            //             filter: false,
            //             display: true,
            //             customBodyRenderLite: (dataIndex) => {
            //                 let data = this.state.data[dataIndex].Pharmacy_drugs_store.location
            //                 return <p>{data}</p>
            //             },
            //         },
            //     },

            ],

            alert: false,
            message: "",
            severity: 'success',
        }
    }

    // async fetchConsignmentSamples() {
    //     let samples = await ConsignmentService.fetchConsignmentSamples();
    //     if (samples.status === 200) {
    //         this.setState({
    //             sampleData: samples.data.view.data
    //         })
    //     }
    // }

    // async fetchConsignmentSamplesItem() {
    //     let samples = await ConsignmentService.fetchConsignmentSamples();
    //     if (samples.status === 200) {
    //         this.setState({
    //             sampleItemData: samples.data.view.data.item
    //         })
    //     }
    // }

    // Load data onto table
    async loadData() {
        this.setState({ loaded: false })
        console.log("FilterData",this.state.filterData)
        let res = await WarehouseServices.getSingleItemWarehouse(this.state.filterData)
        console.log("Warehouse",res)
        
        if (res.status == 200) {
            this.setState(
                {
                    loaded: true,
                    data: res.data.view.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                }
            )
        }
        console.log("Warehouse2",this.state.data)
    }

    handleFilterSubmit = (val) => {
        this.loadData()
    }

    onSubmit = () => {
        this.handleFilterSubmit({
            ref_no: this.state.ref_no,
            sr_no: this.state.sr_no,
            batch_id: this.state.batch_id,
            wharf_ref_no: this.state.wharf_ref_no,
        })
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
                //this.loadConsignmentList()
            }
        )
    }
    async loadGroups() {
      let params = { limit: 99999, page: 0 }
      const res = await ConsignmentService.getOrderDeliveryVehicleTypes(params)

      let loadVehicleTypes = this.state.alltypes
      if (res.status == 200) {
          var loadedData = res.data.view.data
          loadedData.forEach(element => {
              let loadType = {}
              loadType.name =element.name 
              loadType.id = element.id
              loadType.status = element.status
              loadVehicleTypes.push(loadType)
          });
      }
          else {
              this.setState({
                  alert: true,
                  severity: 'error',
                  message: res.data.error,
              })
          };
          this.setState({
              alltypes : loadVehicleTypes
          }) 
          console.log("Store Name",this.state.alltypes)      
  }


    componentDidMount() {
        const qparams = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        let filterData =this.state.filterData
        filterData.item_id = qparams.item_id
        this.setState({filterData})
        //  this.fetchConsignmentSamples()
        this.loadData()
        this.loadGroups()
        //this.fetchConsignmentSamplesItem()
    }

    render() {
        return (
            <Fragment>
                  <LoonsCard>
                <MainContainer>
                  {this.state.loaded?<div>
                        <CardTitle title="Inventory Console" />
                        <Grid className=" w-full flex" container={2} >
                        <Grid item lg={6} md={6} xs={12} >
                        <SubTitle title="SR No:" />
                          <Typography variant="h5">{this.state.data[0]?.ItemSnapBatch?.ItemSnap?.sr_no}</Typography>
                        </Grid>
                        <Grid item lg={6} md={6} xs={12}>
                        <SubTitle title="Description" />
                        <Typography variant="h5">{this.state.data[0]?.ItemSnapBatch?.ItemSnap?.medium_description}</Typography>
                        </Grid>
                        {/* <Grid item lg={6} md={6} xs={12} >
                        <SubTitle title="UOM:" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.store_id}</Typography>
                        </Grid> */}
                        <Grid item lg={6} md={6} xs={12}>
                        <SubTitle title="Total Quantity" />
                        <Typography variant="h5">{this.state.data[0]?.quantity}</Typography>

                        </Grid>
                    </Grid>

                  </div> :null}
                        
                        <Grid item lg={12} className=" w-full mt-2">
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.onSubmit()}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex">
                                {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Store Name" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.ç}
                                            clearOnBlur={true}
                                            clearText="clear"
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.vehicle_type = value.id;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            // value={{
                                            //     name: this.state.filterData.vehicle_type ? (this.state.alltypes.find((obj) => obj.id == this.state.filterData.vehicle_type).name) : null,
                                            //     id: this.state.filterData.vehicle_type
                                            // }}
                                            // getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.vehicle_type}
                                                />
                                            )}
                                        />
                                    </Grid> */}
                                    {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Store Type" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={appConst.phamacistsTypes}
                                            clearOnBlur={true}
                                            clearText="clear"
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.vehicle_type = value.id;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            // value={{
                                            //     name: this.state.filterData.vehicle_type ? (this.state.alltypes.find((obj) => obj.id == this.state.filterData.vehicle_type).name) : null,
                                            //     id: this.state.filterData.vehicle_type
                                            // }}
                                            getOptionLabel={(option) =>
                                                option.label ? option.label : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.vehicle_type}
                                                />
                                            )}
                                        />
                                    </Grid> */}
                                    {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                    <SubTitle title="Search" />
                                    <TextValidator className='w-full' placeholder="Type here" fullWidth="fullWidth" variant="outlined" size="small"
                                    //value={this.state.formData.search} 
                                    onChange={(e, value) => {
                                        let filterData = this.state.filterData
                                        if (e.target.value != '') {
                                            filterData.search = e.target.value;
                                        } else {
                                            filterData.search = null
                                        }
                                        this.setState({filterData})
                                        console.log("form dat", this.state.filterData)
                                    }} onKeyPress={(e) => {
                                        if (e.key == "Enter") {
                                            this.loadData()
                                        }
                                    }}

                                   
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon></SearchIcon>
                                            </InputAdornment>
                                        )
                                    }}/>
                                    </Grid> */}
                                    {/* <ValidatorForm
                                            
                                            onSubmit={() => this.loadData()}
                                            onError={() => null}
                                        >
                                            <Grid container spacing={1}>
                                                <Grid
                                                    className="w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <Button
                                                        className="mt-7"
                                                        progress={false}
                                                        type="submit"
                                                        scrollToTop={true}
                                                        startIcon="search"
                                                        // onClick={this.onSubmit}
                                                    >
                                                        <span className="capitalize">
                                                            Search
                                                        </span>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </ValidatorForm> */}

                

                                </Grid>
                                {/* <Grid  item
                                        lg={4}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                        justify="flex-start">
                                    <Button
                                        className="mt-6 justify-end"
                                        color="primary"
                                        // progress={this.state.btnProgress}
                                        startIcon="note_add"
                                        // type="submit"
                                        onClick={() => {
                                            window.location.href = '/msd_warehouse/createwarehouse'
                                           
                                        }}
                                        scrollToTop={true}
                                    >
                                        <span className="capitalize">
                                            Create New Warehouse
                                        </span>
                                    </Button>
                                </Grid> */}

                                
                            </ValidatorForm>
                        </Grid>

                        {/*Table*/}
                        <Grid lg={12} className=" w-full mt-2" spacing={2} style={{ marginTop: 20 }}>

                            {
                                this.state.loaded ?
                                    <div className="pt-0">
                                        <LoonsTable
                                            id={"DEFAULT_USER"}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: 20,
                                                page: this.state.formData.page,

                                                onTableChange: (action, tableState) => {
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage(tableState.page)
                                                            break;
                                                        case 'sort':
                                                            break;
                                                        default:
                                                            console.log('action not handled.');
                                                    }
                                                }

                                            }
                                            }
                                        >
                                        </LoonsTable>
                                    </div>
                                    :
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                            }
                        </Grid>
                </MainContainer>
                </LoonsCard>
            </Fragment>
        )
    }
}

export default DSWarehouseItem

