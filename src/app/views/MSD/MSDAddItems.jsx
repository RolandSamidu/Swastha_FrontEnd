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
    CircularProgress,
    Tooltip,
    Icon,
    InputAdornment,
    Dialog
} from '@material-ui/core'
import * as appConst from './../../../appconst'
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
import CategoryService from 'app/services/datasetupServices/CategoryService'
import PharmacyService from 'app/services/PharmacyService'
import InventoryService from 'app/services/InventoryService'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import EmployeeServices from 'app/services/EmployeeServices'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import { filter } from 'lodash'
import CancelIcon from '@material-ui/icons/Cancel';
import localStorageService from 'app/services/localStorageService'


const styleSheet = (theme) => ({})

class MSDAddItems extends Component {

    constructor(props) {
        super(props)
        this.state = {

            selectingEmployee: false,
            empType: [
                {
                    type: ['HSCO', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA'],
                    label: 'SCO'
                },

                {
                    type: ["Distribution Officer", "MSD Distribution Officer", "RMSD Distribution Officer"],
                    label: 'Distribution Officer'
                }

            ],

            employeeFilterData: { type: null },
            allEmpData: [],

            selectedEmployee: null,

            activeTab: 0,
            loaded: false,
            itemLoaded: false,
            data: [],

            left: [],
            right: [],
            checked: [],


            allSR: [],
            allItemName: [],
            allVEN: [],
            allCatergoryCode: [],
            all_item_category: [],
            allGroupCode: [],
            allShortReference: [],
            all_item_class: [],
            allGroups: [],
            allSerials: [],
            allSeriesName: [],

            totalListItems: 0,
            totalListPages: 0,
            totalItems: 0,
            totalPages: 0,
            orderDeleteWarning: false,
            orderToDelete: null,

            alert: false,
            message: '',
            severity: 'success',
            filterData2: {

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
                limit: 420,
                page: 0,
                search: null,
                eligible_list: null,
                countable: null,

                ven: null,
                category_name: null,
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
                                this.state.data[dataIndex].ItemSnap?.sr_no
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
                                this.state.data[dataIndex].ItemSnap?.Serial?.Group?.name
                            return <p>{data}</p>
                        },
                    },
                },

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
                            let id = this.state.data[dataIndex].ItemSnap?.id
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
                                    <Tooltip title='Delete Order'>
                                        <IconButton
                                            className="text-black mr-1"
                                            onClick={() => {
                                                this.setState({
                                                    orderDeleteWarning: true,
                                                    orderToDelete: this.state.data[dataIndex].id
                                                })
                                            }}
                                        >
                                            <Icon>delete</Icon>
                                        </IconButton>
                                    </Tooltip>

                                </Grid>
                            )
                        },
                    },
                },
            ],



        }
    }

    async removeEntry() {
        this.setState({ Loaded: false })
        let res = await WarehouseServices.DeleteWarehouseItem(this.state.orderToDelete)
        console.log("res.data", res.data);
        if (res.status) {
            if (res.data.view == "data deleted successfully.") {
                this.setState({
                    Loaded: true,
                    alert: true,
                    message: res.data.view,
                    severity: 'success',
                })
            }
            this.loadData(this.state.filterData2)
        } else {
            this.setState(
                {
                    alert: true, message: "Item Could Not be Deleted. Please Try Again",
                    severity: 'error'
                }
            )
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
        this.setState({ loaded: false })
        let filterData2 = this.state.filterData2
        let user_info = await localStorageService.getItem('userInfo')

        filterData2.employee_id = this.state.selectedEmployee.id;
        filterData2.type = this.state.selectedEmployee.type

        //filterData2.page = this.state.filterData2.page

        console.log("FilterData2", filterData2)
        const res = await WarehouseServices.getDefaultUserItems(this.state.filterData2)
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

        let filterData = this.state.filterData

        filterData.eligible_list = true

        filterData.countable = this.state.filterData.countable
        filterData.page = this.state.filterData.page
        filterData.limit = this.state.filterData.limit
        console.log("FilterData", filterData)

        this.setState({ itemLoaded: false })
        let res = await InventoryService.fetchAllItems(filterData)
        console.log('all Items', res.data.view.data)

        if (res.status == 200) {
            this.setState({
                totalListItems: res.data.view.totalItems,
                totalListPages: res.data.view.totalPages,
                left: res.data.view.data,
                itemLoaded: true
            })
        }
        console.log('items', this.state.left)
    }




    //Drop Down Data

    async loadVENS() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getVEN(params)

        if (res.status == 200) {
            this.setState({ allVEN: res.data.view.data })
        }
    }
    async loadGroups() {
        let params = { limit: 99999, page: 0 }
        const res = await GroupSetupService.fetchAllGroup(params)

        let loadGroup = this.state.allGroups
        if (res.status == 200) {
            var loadedData = res.data.view.data
            loadedData.forEach((element) => {
                let loadGroups = {}
                loadGroups.name = element.code + '-' + element.name
                loadGroups.id = element.id
                loadGroups.code = element.code
                loadGroups.status = element.status
                loadGroup.push(loadGroups)
            })
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: res.data.error,
            })
        }
        this.setState({ allGroups: loadGroup })
    }

    async loadSerials() {
        let params = { limit: 99999, page: 0 }
        const res = await GroupSetupService.getAllSerial(params)

        let loadSerial = this.state.allSerials
        if (res.status == 200) {
            var loadedData = res.data.view.data
            loadedData.forEach((element) => {
                let loadSerials = {}
                loadSerials.name = element.code + '-' + element.name
                loadSerials.name2 = element.name
                loadSerials.id = element.id
                loadSerials.code = element.code
                loadSerials.status = element.status
                loadSerial.push(loadSerials)
            })
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: res.data.error,
            })
        }
        this.setState({ allSerials: loadSerial })
    }
    async loadCategories() {
        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
    }
    async loadClasses() {
        let class_res = await ClassDataSetupService.fetchAllClass({
            limit: 99999,
        })
        if (class_res.status == 200) {
            console.log('Classes', class_res.data.view.data)
            this.setState({ all_item_class: class_res.data.view.data })
        }
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
            let user_info = await localStorageService.getItem('userInfo')

            let newRight = []
            rightData.forEach((element) => {
                newRight.push({
                    //employee_id: user_info.id,
                    //type: user_info.type,
                    employee_id: this.state.selectedEmployee.id,
                    type: this.state.selectedEmployee.type,
                    item_id: element.id,
                    'higher levels' :'parents strores'
                })
            })
            console.log('newRight', newRight)
            let data = { data: newRight }
            let res = await WarehouseServices.addUserItemsBulk(data)
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
                    subheader={`${this.numberOfChecked(items)}/${items.length
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




    async loadAllEmployees() {
        let hospital = await localStorageService.getItem("login_user_pharmacy_drugs_stores")
        let employeeFilterData = this.state.employeeFilterData
        // employeeFilterData.created_location_id=hospital[0].pharmacy_drugs_stores_id;

        //this.setState({ loaded: false })
        let res = await EmployeeServices.getEmployees(employeeFilterData)
        console.log('all employees', res.data.view.data)
        if (200 == res.status) {
            this.setState({
                allEmpData: res.data.view.data,
            })
        }
    }





    componentDidMount() {
        this.loadVENS()
        this.loadGroups()
        this.loadSerials()
        this.loadCategories()
        this.loadClasses()


        this.setState({ selectingEmployee: true })





    }


    render() {
        return (
            <Fragment>
                <MainContainer>

                    <div className="w-full">
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.loadAllItems()}
                            onError={() => null}
                        >
                            <Grid container spacing={1} className="flex ">
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    xs={12}
                                >
                                    {/* TODO - Check what is this. This is not submitted to backend */}
                                    <SubTitle title="VEN" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allVEN}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                this.setState({
                                                    filterData: {
                                                        ...this.state
                                                            .filterData,
                                                        ven: value.id,
                                                    },
                                                })
                                            }
                                        }}
                                        value={this.state.allVEN.find(
                                            (v) =>
                                                v.id ==
                                                this.state.filterData.ven
                                        )}
                                        getOptionLabel={(option) =>
                                            option.name ? option.name : ''
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="VEN"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    xs={12}
                                >
                                    {/* TODO - Check what is this. This is not submitted to backend */}
                                    <SubTitle title="Category Name" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={
                                            this.state.all_item_category
                                        }
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                this.setState({
                                                    filterData: {
                                                        ...this.state
                                                            .filterData,
                                                        category_name:
                                                            value.id,
                                                    },
                                                })
                                            }
                                        }}
                                        value={this.state.all_item_category.find(
                                            (v) =>
                                                v.id ==
                                                this.state.filterData
                                                    .category_name
                                        )}
                                        getOptionLabel={(option) => (option.code + " - " + option.description)}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Category Name"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    xs={12}
                                >
                                    {/* TODO - Check what is this. This is not submitted to backend */}
                                    <SubTitle title="Class Name" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.all_item_class}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                this.setState({
                                                    filterData: {
                                                        ...this.state
                                                            .filterData,
                                                        className: value.id,
                                                    },
                                                })
                                            }
                                        }}
                                        value={this.state.all_item_class.find(
                                            (v) =>
                                                v.id ==
                                                this.state.filterData
                                                    .className
                                        )}
                                        getOptionLabel={(option) => (option.code + " - " + option.description)}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Class Name"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    xs={12}
                                >
                                    {/* TODO - Check what is this. This is not submitted to backend */}
                                    <SubTitle title="Group" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allGroups}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                this.setState({
                                                    filterData: {
                                                        ...this.state
                                                            .filterData,
                                                        group: value.id,
                                                    },
                                                })
                                            }
                                        }}
                                        value={this.state.allGroups.find(
                                            (v) =>
                                                v.id ==
                                                this.state.filterData.group
                                        )}
                                        getOptionLabel={(option) =>
                                            option.name ? option.name : ''
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Group"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    xs={12}
                                >
                                    {/* TODO - Check what is this. This is not submitted to backend */}
                                    <SubTitle title="Serial Code" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.allSerials}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                this.setState({
                                                    filterData: {
                                                        ...this.state
                                                            .filterData,
                                                        serial_code:
                                                            value.id,
                                                    },
                                                })
                                            }
                                        }}
                                        value={this.state.allSerials.find(
                                            (v) =>
                                                v.id ==
                                                this.state.filterData
                                                    .serial_code
                                        )}
                                        getOptionLabel={(option) =>
                                            option.name ? option.name : ''
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Serial Code"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>


                                <Grid
                                    item="item"
                                    lg={4}
                                    md={4}
                                    xs={4}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <TextValidator
                                        className="w-full mt-5"
                                        placeholder="Search"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                        //value={this.state.filterData.search}
                                        onChange={(e, value) => {
                                            let filterData =
                                                this.state.filterData
                                            if (e.target.value != '') {
                                                filterData.search =
                                                    e.target.value
                                            } else {
                                                filterData.search = null
                                            }
                                            this.setState({ filterData })
                                            console.log(
                                                'form dat',
                                                this.state.filterData
                                            )
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key == 'Enter') {
                                                this.loadAllItems()
                                            }
                                        }}
                                        /* validators={[
                                'required',
                                ]}
                                errorMessages={[
                                'this field is required',
                                ]} */
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <SearchIcon></SearchIcon>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid>

                                    <Grid container spacing={2}>
                                        <Grid
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
                                                startIcon="search"
                                            // onClick={this.onSubmit}
                                            >
                                                <span className="capitalize">
                                                    Search
                                                </span>
                                            </Button>
                                        </Grid>
                                    </Grid>


                                </Grid>

                                {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                       
                                        <SubTitle title="Group Name" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={
                                                this.state.allgro
                                            }
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    this.setState({
                                                        formData: {
                                                            ...this.state
                                                                .formData,
                                                            department_type:
                                                                value.id,
                                                        },
                                                    })
                                                }
                                            }}
                                            value={this.state.allGroups.find(
                                                (v) =>
                                                    v.id ==
                                                    this.state.formData
                                                        .department_type
                                            )}
                                            getOptionLabel={(option) =>
                                                option.name ? option.name : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Group Name"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                </Grid>  */}

                                {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid
                                            container
                                            spacing={2}
                                            className="flex"
                                        >
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    disabled={false}
                                                    checked={
                                                        this.state
                                                            .selectedItemList ===
                                                        'My Item List'
                                                            ? true
                                                            : false
                                                    }
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={() => {
                                                                this.setState(
                                                                    {
                                                                        selectedItemList:
                                                                            'My Item List'
                                                                    }
                                                                )
                                                            }                                                                
                                                            }
                                                            name="admin"
                                                            value="admin"
                                                        />
                                                    }
                                                    label="My Item List"
                                                />
                                            </Grid>
{/* 
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    disabled={false}
                                                    checked={
                                                        this.state
                                                            .selectedItemList ===
                                                        'Eligible Item List'
                                                            ? true
                                                            : false
                                                    }
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={() => {
                                                                this.setState(
                                                                    {
                                                                        selectedItemList:
                                                                            'Eligible Item List',
                                                                    }
                                                                )
                                                            }
                                                        }
                                                            name="counter"
                                                            value="counter"
                                                        />
                                                    }
                                                    label="Eligible Item List"
                                                />
                                            </Grid>

                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    disabled={true}
                                                //     checked={
                                                //         isUpdate
                                                //             ? dataStoreObj.is_drug_store
                                                //             : this.state
                                                //                 .selectedDrugStore
                                                //                 .is_drug_store
                                                //     }
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            name="designated"
                                                            value="designated"
                                                        />
                                                    }
                                                    label="Designated Pharmacist"
                                                />
                                            </Grid> */}
                                {/* </Grid>
                                    </Grid>  */}
                            </Grid>


                        </ValidatorForm>
                    </div>

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
                                <Tab label={<span className="font-bold text-12">My Item List</span>} />
                                <Tab label={<span className="font-bold text-12">Eligible Item List</span>} />


                            </Tabs>
                        </Grid>
                    </AppBar>

                    <main>
                        {this.state.loaded && !this.state.selectingEmployee ?
                            <Fragment>
                                {
                                    this.state.activeTab == 1 ?
                                        <div className='w-full'>
                                            {/* <WarehouseBins id ={this.props.match.params.id} pharmacydrugstore ={this.state.data.Pharmacy_drugs_store}  /> */}
                                            <div>


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
                                                        {this.state.itemLoaded ?
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
                                                            </div> : (
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
                            </Fragment> : null}


                    </main>

                </MainContainer>
                <Dialog
                    maxWidth="lg "
                    open={this.state.orderDeleteWarning}
                    onClose={() => {
                        this.setState({ orderDeleteWarning: false })
                    }}>
                    <div className="w-full h-full px-5 py-5">

                        <CardTitle title="Are you sure you want to delete?"></CardTitle>
                        <div>
                            <p>Are you really want to delete this item?</p>
                            <Grid
                                container="container"
                                style={{
                                    justifyContent: 'flex-end'
                                }}>
                                <Grid
                                    className="w-full flex justify-end"
                                    item="item"
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}>
                                    <Button
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        startIcon="delete"
                                        onClick={() => {
                                            this.setState({ orderDeleteWarning: false });
                                            this.removeEntry()
                                        }}>
                                        <span className="capitalize">Delete</span>
                                    </Button>

                                    <Button
                                        className="mt-2 ml-2"
                                        progress={false}
                                        type="submit"
                                        startIcon={<CancelIcon />}
                                        onClick={() => {
                                            this.setState({ orderDeleteWarning: false });
                                        }}>
                                        <span className="capitalize">Cancel</span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Dialog>




                <Dialog
                    maxWidth="lg "
                    open={this.state.selectingEmployee}
                    onClose={() => {
                        this.setState({ selectingEmployee: false })
                    }}>
                    <div className="w-full h-full px-5 py-5">

                        <CardTitle title="Select Employee"></CardTitle>
                        <div>

                            <ValidatorForm onSubmit={() => {
                                this.setState({ selectingEmployee: false });
                                this.loadData()
                                this.loadAllItems()
                            }}>
                                <Grid
                                    container="container"
                                    style={{
                                        justifyContent: 'flex-end'
                                    }}>



                                    <Grid className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}>
                                        <SubTitle title="Employee Type" />
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={this.state.empType}
                                            onChange={(e, value, r) => {
                                                if (null != value) {

                                                    let employeeFilterData = this.state.employeeFilterData
                                                    employeeFilterData.type = value.type

                                                    this.setState(
                                                        {
                                                            employeeFilterData: employeeFilterData
                                                        },
                                                        () => {
                                                            this.loadAllEmployees()
                                                        }
                                                    )
                                                }
                                            }}
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Employee Type"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>




                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Employee Name" />
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={this.state.allEmpData}
                                            onChange={(e, value, r) => {

                                                if (null != value) {

                                                    this.setState({
                                                        selectedEmployee: value
                                                    })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Employee"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>


                                    <Grid
                                        className="w-full flex justify-end"
                                        item="item"
                                        lg={6}
                                        md={6}
                                        sm={6}
                                        xs={6}>
                                        <Button
                                            className="mt-2"
                                            progress={false}
                                            type="submit"
                                        >
                                            <span className="capitalize">OK</span>
                                        </Button>


                                    </Grid>
                                </Grid>

                            </ValidatorForm>
                        </div>
                    </div>
                </Dialog>


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

export default withStyles(styleSheet)(MSDAddItems)