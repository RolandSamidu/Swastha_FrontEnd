import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar';
import {
    Grid,
    Typography,
    Tabs,
    Tab,
    Checkbox,
    IconButton,
    CircularProgress
} from '@material-ui/core'
import * as appConst from '../../../appconst'
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import EditIcon from '@material-ui/icons/Edit'
import TablePagination from '@material-ui/core/TablePagination'
import List from '@material-ui/core/List'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Divider from '@material-ui/core/Divider'


import WarehouseServices from "app/services/WarehouseServices";
import InventoryService from 'app/services/InventoryService'
import { filter } from 'lodash'



const styleSheet = (theme) => ({})

class TabHandling extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeTab : 0 ,
            loaded:false,
            itemLoaded:false,
            data:[],

            left: [],
            right: [],
            checked: [],

            totalListItems:0,
            totalListPages:0,
            totalItems: 0,
            totalPages: 0,

            alert: false,
            message: '',
            severity: 'success',
            filterData2: {
                warehouse_id:this.props.id,
                limit: 50,
                page: 0,
                search: null,
                // sr:null,
                // itemName:null,
                ven: null,
              //   category_code: null,
                category_name: null,
              //   group_code: null,
                group: null,
              //   class_short_ref: null,
                class_name: null,
                serial_code: null,
              //   serial_name: null,

                //type: '',
                //designation: '',
            },
            filterData: {
                  warehouse_id:this.props.id,
                  limit: 420,
                  page: 0,
                  search: null,
                  eligible_list:null,
                  countable:null,
                  // sr:null,
                  // itemName:null,
                  ven: null,
                //   category_code: null,
                  category_name: null,
                //   group_code: null,
                  group: null,
                //   class_short_ref: null,
                  class_name: null,
                  serial_code: null,
                //   serial_name: null,
  
                  //type: '',
                  //designation: '',
              },
              columns: [
                //   {
                //       name: 'action',
                //       label: 'Actions',
                //       options: {
                //           customBodyRenderLite: (dataIndex) => {
                //               let id = this.state.data[dataIndex].id
                //               return (
                //                   <Grid>
                //                       <IconButton
                //                           onClick={() => {
                //                               window.location.href = `/item-mst/edit-all-items/${id}`
                //                           }}
                //                           className="px-2"
                //                           size="small"
                //                           aria-label="delete"
                //                       >
                //                           <EditIcon />
                //                       </IconButton>
                //                   </Grid>
                //               )
                //           },
                //       },
                //   },
                  {
                      name: 'sr_no', // field name in the row object
                      label: 'Item Code', // column title that will be shown in table
                      options: {
                          filter: false,
                          display: true,
                          customBodyRenderLite: (dataIndex) => {
                              let data =
                                  this.state.data[dataIndex].ItemSnap.sr_no
                              return <p>{data}</p>
                          },
                      },
                  },
                  {
                      name: 'groupName',
                      label: 'Group Name',
                      options: {
                          filter: true,
                          display: true,
                          customBodyRenderLite: (dataIndex) => {
                              let data =
                                  this.state.data[dataIndex].ItemSnap.Serial.Group.name
                              return <p>{data}</p>
                          },
                      },
                  },
                //   {
                //       name: 'serial_name',
                //       label: 'Serial Name',
                //       options: {
                //           filter: true,
                //           display: true,
                //           customBodyRenderLite: (dataIndex) => {
                //               let data = this.state.data[dataIndex].ItemSnap.Serial.name
                //               return <p>{data}</p>
                //           },
                //       },
                //   },
                  {
                      name: 'Item_Category',
                      label: 'Item Category',
                      options: {
                          filter: true,
                          display: true,
                          customBodyRenderLite: (dataIndex) => {
                              let data =
                                  this.state.data[dataIndex].ItemSnap?.Serial?.Group?.Category.description
                                      
                              return <p>{data}</p>
                          },
                      },
                  },
                  {
                    name: 'ven',
                    label: 'VEN',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].ItemSnap?.VEN?.description;
                            return <p>{data}</p>

                        },
                    },
                },
                // {
                //     name: 'default_frequency',
                //     label: 'Default Frequency',
                //     options: {
                //         filter: true,
                //         display: true,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data = this.state.data[dataIndex].DefaultRoute.name;
                //             return <p>{data}</p>

                //         },
                //     },
                // },
                // {
                //     name: 'default_route',
                //     label: 'Default Route',
                //     options: {
                //         filter: true,
                //         display: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data = this.state.data[dataIndex].DefaultRoute.name;
                //             return <p>{data}</p>

                //         },
                //     },
                // },
                // {
                //     name: 'default_unit',
                //     label: 'Display Unit',
                //     options: {
                //         filter: true,
                //         display: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data = this.state.data[dataIndex].DisplayUnit.name;
                //             return <p>{data}</p>

                //         },
                //     },
                // },
                // {
                //     name: 'dosage_form',
                //     label: 'Dosage Form',
                //     options: {
                //         filter: true,
                //         display: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data = this.state.data[dataIndex].DosageForm.name;
                //             return <p>{data}</p>

                //         },
                //     },
                // },
                // {
                //     name: 'measuring_unit',
                //     label: 'Measuring Unit',
                //     options: {
                //         filter: true,
                //         display: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data = this.state.data[dataIndex].MeasuringUnit.name;
                //             return <p>{data}</p>

                //         },
                //     },
                // },
                {
                    name: 'warehouse_name',
                    label: 'Warehouse Name',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Warehouse.name;
                            return <p>{data}</p>

                        },
                    },
                },
                {
                    name: 'serial',
                    label: 'Serial Code',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].ItemSnap?.Serial?.Group?.code;
                            return <p>{data}</p>

                        },
                    },
                },
                {
                    name: 'short_description',
                    label: 'Short Description',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].ItemSnap?.medium_description;
                            return <p>{data}</p>

                        },

                    },
                },
                {
                    name: 'action',
                    label: 'Actions',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id
                            return (
                                <Grid>
                                     <IconButton
                                        onClick={() => {
                                            window.location.href = `/item-mst/view-item-mst/${id}`
                                        }}
                                        className="px-2"
                                        size="small"
                                        aria-label="View Item"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                   
                                </Grid>
                            )
                        },
                    },
                },
              ],
  
  

        }
    }
    async setPage(page) {
      //Change paginations
      console.log('new page1', page)
      let filterData = this.state.filterData2
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
 
  handleChangePage(newPage) {
      console.log('new page', newPage)
      let filterData = this.state.filterData
      filterData.page = newPage
      this.setState({ filterData }, () => {
          this.loadAllItems()
      })
  }
  handleChangeRowsPerPage(limit) {
      console.log('limit', limit)
      let filterData = this.state.filterData
      
      filterData.limit = limit
      this.setState({ filterData }, () => {
          this.loadAllItems()
      })
  }
  async loadData() {
    console.log("ID",this.props.id)
    this.setState({ loaded: false })
    let filterData2 = this.state.filterData2
    filterData2.page = this.state.filterData2.page
   
    console.log("FilterData2",filterData2)
    const res = await WarehouseServices.getDefaultItems(this.state.filterData2)
    let group_id = 0
    if (res.status == 200) {
        if (res.data.view.data.length != 0) {
            group_id = res.data.view.data[0]
            // .pharmacy_order_id
        }
        console.log('item Data', res.data.view)
        this.setState(
            {
                data: res.data.view.data,
                loaded: true,
                totalItems: res.data.view.totalItems,
                totalPages: res.data.view.totalPages,
            },
            () => {
                this.render()
                // this.getCartItems()
            }
        )
    }
}

  async loadAllItems() {
   
    let filterData = this.props.filterData
   
    filterData.eligible_list =true
    
    filterData.countable=this.state.filterData.countable
    filterData.page = this.state.filterData.page
    filterData.limit = this.state.filterData.limit
    console.log("FilterData",filterData)

      this.setState({ itemLoaded: false })
      let res = await InventoryService.fetchAllItems(filterData)
      console.log('all Items', res.data.view.data)

      if (res.status == 200) {
          this.setState({ 
            totalListItems: res.data.view.totalItems,
            totalListPages: res.data.view.totalPages,
            left: res.data.view.data,
            itemLoaded:true
        })
      }
      console.log('items', this.state.left)
  }

    async addingBulkItems() {
      let rightData = this.state.right
      if (rightData.length === 0) {
          this.setState({
              alert: true,
              message: 'No Items added',
              severity: 'error',
          })
      } else {
          console.log('added items', rightData)

          let newRight = []
          rightData.forEach((element) => {
              newRight.push({
                  warehouse_id: this.props.id,
                  item_id: element.id,
              })
          })
          console.log('newRight', newRight)
          let data = {data : newRight}
          let res = await WarehouseServices.addWarehouseItemBulk(data)
          if (res.status == 201) {
              this.setState({
                  alert: true,
                  message: 'Warehouse Items adding succesfull',
                  severity: 'success',
              })
              
          } else {
              this.setState({
                  alert: true,
                  message: 'Cannot add Warehouse Items',
                  severity: 'error',
              })
          }
      }
  }
  not(a, b) {
      return a.filter((value) => b.indexOf(value) === -1)
  }

  intersection(a, b) {
      return a.filter((value) => b.indexOf(value) !== -1)
  }

  union(a, b) {
      return [...a, ...this.not(b, a)]
  }

  handleToggle(value) {
      const currentIndex = this.state.checked.indexOf(value)
      const newChecked = [...this.state.checked]

      if (currentIndex === -1) {
          newChecked.push(value)
      } else {
          newChecked.splice(currentIndex, 1)
      }

      this.setState({
          checked: newChecked,
      })
  }

  numberOfChecked(items) {
      return this.intersection(this.state.checked, items).length
  }

  handleToggleAll(items) {
      if (this.numberOfChecked(items) === items.length) {
          this.setState({
              checked: this.not(this.state.checked, items),
          })
      } else {
          this.setState({
              checked: this.union(this.state.checked, items),
          })
      }
  }

  leftChecked() {
      return this.intersection(this.state.checked, this.state.left)
  }

  handleCheckedRight() {
      this.setState({
          right: this.state.right.concat(this.leftChecked()),
      })
      // this.assignPharmacist(this.leftChecked())
      //console.log("aaa",this.state.right.concat(this.leftChecked()))

      this.setState({
          left: this.not(this.state.left, this.leftChecked()),
      })

      this.setState({
          checked: this.not(this.state.checked, this.leftChecked()),
      })
  }

  rightChecked() {
      return this.intersection(this.state.checked, this.state.right)
  }

  handleCheckedLeft() {
      this.setState({
          left: this.state.left.concat(this.rightChecked()),
      })

      this.setState({
          right: this.not(this.state.right, this.rightChecked()),
      })

      this.setState({
          checked: this.not(this.state.checked, this.rightChecked()),
      })
  }

  customList(title, items) {
      return (
          <Card>
              <CardHeader
                  //className={classes.cardHeader}
                  avatar={
                      <Checkbox
                          onClick={() => this.handleToggleAll(items)}
                          checked={
                              this.numberOfChecked(items) === items.length &&
                              items.length !== 0
                          }
                          indeterminate={
                              this.numberOfChecked(items) !== items.length &&
                              this.numberOfChecked(items) !== 0
                          }
                          disabled={items.length === 0}
                          inputProps={{ 'aria-label': 'all items selected' }}
                      />
                  }
                  title={title}
                  subheader={`${this.numberOfChecked(items)}/${
                      items.length
                  } selected`}
              />
               {/* <CardHeader
               
               title={title2}
            //    subheader={`${this.numberOfChecked(items)}/${
            //        items.length
            //    } selected`}
           /> <CardHeader
               
           title={title3}
        //    subheader={`${this.numberOfChecked(items)}/${
        //        items.length
        //    } selected`}
       /> */}
              <Divider />
              <List
                  className={'overflow-auto max-h-400 w-full '}
                  dense
                  component="div"
                  role="list"
              >
                  {items.map((value) => {
                      const labelId = `transfer-list-all-item-${value}-label`

                      return (
                          <ListItem
                              key={value}
                              role="listitem"
                              button
                              onClick={() => this.handleToggle(value)}
                          >
                              <ListItemIcon>
                                  <Checkbox
                                      checked={
                                          this.state.checked.indexOf(
                                              value
                                          ) !== -1
                                      }
                                      tabIndex={-1}
                                      disableRipple
                                      inputProps={{
                                          'aria-labelledby': labelId,
                                      }}
                                  />
                              </ListItemIcon>
                              <ListItemText
                                  id={labelId}
                                  primary={`${value.medium_description}`}
                              />
                          </ListItem>
                      )
                  })}

                  <ListItem />
              </List>
          </Card>
      )
  }
    componentDidMount() {
        this.loadData()
        this.loadAllItems()
        
        let warehouse_id = this.props.id
        console.log("ware id",warehouse_id)
        
    }
    

    render() {
        return (
            <Fragment>
                <MainContainer>

                    {/* <Grid className=" w-full flex" container={2} >
                        <Grid item lg={6} md={6} xs={12} >
                        <SubTitle title="Store-ID" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.store_id}</Typography>
                        </Grid>
                        <Grid item lg={6} md={6} xs={12}>
                        <SubTitle title="Store Name" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.name}</Typography>
                        </Grid>
                    </Grid>
 */}
                    
                        <AppBar position="static" color="default" className="mb-4">
                        <Grid item lg={12} md={12} xs={12}>
                            <Tabs
                                style={{ minHeight: 39, height: 26 }}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                value={this.state.activeTab}
                                onChange={(event, newValue) => {
                                    // console.log(newValue)
                                    this.setState({ activeTab: newValue })
                                }} >
                                <Tab label={<span className="font-bold text-12">My Item List</span> } />
                                <Tab label={<span className="font-bold text-12">Eligible Item List</span>} />
                               

                            </Tabs>
                        </Grid>
                        </AppBar>

                        <main>
                                    {this.state.loaded ? 
                                    <Fragment>
                                        {
                                            this.state.activeTab == 1 ?
                                                <div className='w-full'>
                                                    {/* <WarehouseBins id ={this.props.match.params.id} pharmacydrugstore ={this.state.data.Pharmacy_drugs_store}  /> */}
                                                    <div>
                                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                                    {/* <SubTitle title="Type" /> */}
                                                    <Autocomplete
                                        disableClearable
                                                        className="w-full"
                                                        options={
                                                            appConst.countable
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            if (value != null) {
                                                                if(value.label === 'Countable'){
                                                                    // filterData.countable == 1
                                                                    this.setState({
                                                                        filterData:{
                                                                            countable:1
                                                                        }
                                                                    },() => {
                                                                        this.loadAllItems()
                                                                        console.log("countable",this.state.filterData)
                                                                    })
                                                                }
                                                                else if(value.label === 'Non-Countable') {
                                                                    // filterData.countable == 0
                                                                    this.setState({
                                                                        filterData:{
                                                                            countable:0
                                                                        }
                                                                    },() => {
                                                                        this.loadAllItems()
                                                                    })
                                                                }else{
                                                                    // filterData.countable == null
                                                                    this.setState({
                                                                        filterData:{
                                                                            countable:null
                                                                        }
                                                                    },() => {
                                                                        this.loadAllItems()
                                                                        console.log("countable",this.state.filterData)
                                                                    })
                                                                }
                                                               
                                                            }
                                                        }}
                                                        // defaultValue={{
                                                        //     label: this.state
                                                        //         .formData
                                                        //         .ethinic_group,
                                                        // }}
                                                        // value={{
                                                        //     label: this.state
                                                        //         .formData
                                                        //         .ethinic_group,
                                                        // }}
                                                        getOptionLabel={(
                                                            option
                                                        ) => option.label}
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Type"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                <Grid
                                    className="mt-5"
                                    container
                                    spacing={2}
                                    justify="center"
                                >
                                    <Grid
                                        className=" w-full "
                                        item
                                        lg={5}
                                        md={5}
                                        sm={12}
                                        xs={12}
                                    >
                                        {/* <ValidatorForm
                                            className="pt-2"
                                            onSubmit={() => null}
                                            onError={() => null}
                                        >
                                            <Grid container spacing={2}>
                                                {/* <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <Button
                                                        className="mt-2"
                                                        progress={false}
                                                        type="submit"
                                                        scrollToTop={true}
                                                        startIcon="save"
                                                        // onClick={this.onSubmit}
                                                    >
                                                        <span className="capitalize">
                                                            Search
                                                        </span>
                                                    </Button>
                                                </Grid> */}
                                            {/* </Grid> */}
                                        {/* </ValidatorForm>  */}
                                        {this.state.itemLoaded?
                                        <div>
                                            {this.customList(
                                            'All Items',
                                            this.state.left
                                        )}

                                        <TablePagination
                                            component="div"
                                            count={this.state.totalListItems}
                                            page={this.state.filterData.page}
                                            onChangePage={(e, page) => {
                                                this.handleChangePage(page)
                                            }}
                                            rowsPerPageOptions={[]}
                                            rowsPerPage={
                                                this.state.filterData.limit
                                            }
                                            onRowsPerPageChange={(
                                                event,
                                                limit
                                            ) => {
                                                this.handleChangeRowsPerPage(
                                                    limit
                                                )
                                            }}
                                        />
                                        </div>: (
                                            //load loading effect
                                            <Grid className="justify-center text-center w-full pt-12">
                                                <CircularProgress size={30} />
                                            </Grid>
                                        )}          
                                      
                                    </Grid>

                                    <Grid item lg={2} md={2} sm={12} xs={12}>
                                        <Grid
                                            className="mt-20"
                                            container
                                            direction="column"
                                            alignItems="center"
                                            spacing={1}
                                        >
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                className="my-1"
                                                onClick={() =>
                                                    this.handleCheckedRight()
                                                }
                                                disabled={
                                                    this.leftChecked()
                                                        .length === 0
                                                }
                                                aria-label="move selected right"
                                            >
                                                &gt;
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                className="my-1"
                                                onClick={() =>
                                                    this.handleCheckedLeft()
                                                }
                                                disabled={
                                                    this.rightChecked()
                                                        .length === 0
                                                }
                                                aria-label="move selected left"
                                            >
                                                &lt;
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        className=" w-full "
                                        item
                                        lg={5}
                                        md={5}
                                        sm={12}
                                        xs={12}
                                    >
                                        {this.customList(
                                            'Added Items',
                                            this.state.right
                                        )}
                                    </Grid>
                                </Grid>

                                <ValidatorForm
                                    className="pt-2"
                                    onSubmit={() => this.addingBulkItems()}
                                    onError={() => null}
                                >
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            className="justify-end flex w-full"
                                        >
                                            <Button
                                                className="mt-2"
                                                progress={false}
                                                type="submit"
                                                scrollToTop={true}
                                                startIcon="save"
                                                //onClick={this.handleChange}
                                            >
                                                <span className="capitalize">
                                                    Submit
                                                </span>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
                            </div>

                                                </div> : null
                                        }
                                        {
                                            this.state.activeTab == 0 ?
                                                <div className='w-full'>
                                                    {/* <CreateWarehouseList id ={this.props.match.params.id} pharmacydrugstore = {this.state.data.Pharmacy_drugs_store}/> */}
                                                    <div>

                        {this.state.loaded ? (
                            <Grid container className="mt-5 pb-5">
                                
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            print: true,
                                            viewColumns: true,
                                            download: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: 50,
                                            page: this.state.filterData2.page,
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                console.log(action, tableState)
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setPage(
                                                            tableState.page
                                                        )
                                                        break
                                                    case 'sort':
                                                        //this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    ></LoonsTable>
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress size={30} />
                            </Grid>
                        )}
                     </div>

                                                </div> : null
                                        }                                    
                                    </Fragment> :null }
                                   

                        </main>

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
                        variant="filled"
                    ></LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(TabHandling)