import {
    FormControlLabel,
    Grid,
    Checkbox,
    InputAdornment,
    IconButton,
    CircularProgress,
    RadioGroup,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete } from '@material-ui/lab'
import FlowDiagramComp from 'app/components/FlowDiagramComp/FlowDiagramComp'
import {
    Button,
    CardTitle,
    CheckboxValidatorElement,
    LoonsCard,
    LoonsTable,
    LoonsSnackbar,
    MainContainer,
    SubTitle,
    CheckBox,
} from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import TablePagination from '@material-ui/core/TablePagination'
import List from '@material-ui/core/List'
import Card from '@material-ui/core/Card'
import EditIcon from '@material-ui/icons/Edit'
import VisibilityIcon from '@material-ui/icons/Visibility'
import CardHeader from '@material-ui/core/CardHeader'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
//import Button from "@material-ui/core/Button";
import Divider from '@material-ui/core/Divider'

import DepartmentService from 'app/services/DepartmentService'
import DepartmentTypeService from 'app/services/DepartmentTypeService'

import CategoryService from 'app/services/datasetupServices/CategoryService'
import PharmacyService from 'app/services/PharmacyService'
import InventoryService from 'app/services/InventoryService'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'

import EmployeeServices from 'app/services/EmployeeServices'
import TransferList from 'app/views/common/TransferList'
import 'date-fns'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import WarehouseServices from 'app/services/WarehouseServices'

import TabHandling from '../../MSD-warehouse/CreateWarehouse/TabHandling'

const styleSheet = (theme) => ({
    root: {
        margin: 'auto',
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        width: 200,
        height: 230,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
})

class CreateWarehouseList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isUpdate: true,
            showList: false,
            showTable: false,
            countable:null,
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
            selectedItemList: 'My Item List',

            selectedDrugStore: {
                id: '',
                name: '',
                store_type: '',
                location: '',
                is_admin: false,
                is_counter: false,
                is_drug_store: false,
            },
            alert: false,
            message: '',
            severity: 'success',
            allHigherLevels: [
                { name: 'level1', id: 1 },
                { name: 'lavel2', id: 2 },
                { name: 'lavel3', id: 3 },
            ],

            formData: {
                // sr:null,
                // itemName:null,
                // ven:null,
                // category_code:null,
                // category_name:null,
                // group_code:null,
                // group:null,
                // class_short_ref:null,
                // class_name:null,
                // series_code:null,
                // series_name:null
            },

            checked: [],

            loaded: true,
            totalItems: 0,
            totalPages: 0,

            filterData: {
                warehouse_id:this.props.id,
                limit: 100,
                page: 0,
                search: null,
                countable:null,
                // sr:null,
                // itemName:null,
                ven: null,
                // category_code: null,
                category_name: null,
                // group_code: null,
                group: null,
                // class_short_ref: null,
                // class_name: null,
                serial_code: null,
                // serial_name: null,

                //type: '',
                //designation: '',
            },

            left: [],
            right: [],

            data: [],
            // columns: [
            //     {
            //         name: 'action',
            //         label: 'Actions',
            //         options: {
            //             customBodyRenderLite: (dataIndex) => {
            //                 let id = this.state.data[dataIndex].id
            //                 return (
            //                     <Grid>
            //                         <IconButton
            //                             onClick={() => {
            //                                 window.location.href = `/item-mst/edit-all-items/${id}`
            //                             }}
            //                             className="px-2"
            //                             size="small"
            //                             aria-label="delete"
            //                         >
            //                             <EditIcon />
            //                         </IconButton>
            //                     </Grid>
            //                 )
            //             },
            //         },
            //     },
            //     {
            //         name: 'sr_no', // field name in the row object
            //         label: 'Item Code', // column title that will be shown in table
            //         options: {
            //             filter: false,
            //             display: true,
            //             customBodyRenderLite: (dataIndex) => {
            //                 let data =
            //                     this.state.data[dataIndex].ItemSnap.sr_no
            //                 return <p>{data}</p>
            //             },
            //         },
            //     },
            //     {
            //         name: 'groupName',
            //         label: 'Group Name',
            //         options: {
            //             filter: true,
            //             display: true,
            //             customBodyRenderLite: (dataIndex) => {
            //                 let data =
            //                     this.state.data[dataIndex].ItemSnap.Serial.Group.name
            //                 return <p>{data}</p>
            //             },
            //         },
            //     },
            //     {
            //         name: 'serial_name',
            //         label: 'Serial Name',
            //         options: {
            //             filter: true,
            //             display: true,
            //             customBodyRenderLite: (dataIndex) => {
            //                 let data = this.state.data[dataIndex].ItemSnap.Serial.name
            //                 return <p>{data}</p>
            //             },
            //         },
            //     },
            //     {
            //         name: 'Item_Category',
            //         label: 'Item Category',
            //         options: {
            //             filter: true,
            //             display: true,
            //             customBodyRenderLite: (dataIndex) => {
            //                 let data =
            //                     this.state.data[dataIndex].ItemSnap.Serial.Group.Category.description
            //                         .description
            //                 return <p>{data}</p>
            //             },
            //         },
            //     },
            //     // {
            //     //     name: 'short_description',
            //     //     label: 'Short Description',
            //     //     options: {
            //     //         filter: true,
            //     //         display: true,
            //     //     },
            //     // },
            // ],
        }
    }
    async loadData() {
        console.log("ID",this.props.id)
        this.setState({ loaded: false })
        const res = await WarehouseServices.getDefaultItems(this.state.filterData)
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
    
    componentDidMount() {
        // this.loadData()
        // this.loadAllEmployees()

        // this.loadAllItems()
        this.loadVENS()
        this.loadGroups()
        this.loadSerials()
        this.loadCategories()
        this.loadClasses()

        console.log('Props=============>', this.props)
        const isUpdate = this.state.props

        if (!isUpdate) {
            //this.loadAllDataStoreData()
        }
    }

    loadAllDataStoreData = async () => {
        let dataStoreData = await PharmacyService.fetchAllDataStorePharmacy(
            '001',
            {}
        )
        if (200 == dataStoreData.status) {
            this.setState({
                drugStoreData: dataStoreData.data.view.data,
            })
        }
    }

    //Change the state based on the checkbox change
    handleChange = (val) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [val.target.name]: val.target.checked,
            },
        })
    }

    fetchDrugStoreById = async (id) => {
        let dataStoreData = await PharmacyService.fetchOneById(id, '001')
        if (200 == dataStoreData.status) {
            this.setState({
                selectedDrugStore: dataStoreData.data.view,
            })
        }
    }

    async loadAllItems() {
        let filterData = this.state.filterData
        this.setState({ loaded: false })
        let res = await InventoryService.fetchAllItems(filterData)
        console.log('all Items', res.data.view.data)

        if (res.status == 200) {
            this.setState({ left: res.data.view.data })
        }
        console.log('items', this.state.left)
    }

    // async loadAllEmployees() {
    //     let filterData = this.state.filterData
    //     this.setState({ loaded: false })
    //     let res = await EmployeeServices.getEmployees(filterData)
    //     console.log("all pharmacist", res.data.view.data)
    //     if (200 == res.status) {
    //         this.setState({
    //             left: res.data.view.data,
    //             totalPages: res.data.view.totalPages,
    //             totalItems: res.data.view.totalItems,
    //             loaded: true
    //         })
    //     }
    // }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadAllItems()
            }
        )
    }
    async loaded() {
        this.setState(
            {
                loaded:false,
            }
        )
       
        
        this.setState(
            {
               
                loaded:true
            },
           
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
    async assignPharmacist(list) {
        // let drug_store_id = this.props.location.state.id;
        // console.log("selected list", list)
        // console.log("selected drugStore id", drug_store_id)
        // let selectedEmployees = [];
        // list.forEach(element => {
        //     selectedEmployees.push(element.id)
        // });
        /*   let formData = {
              "employee_id": "de1edb22-6a9b-4ae8-889f-69cafa9bb777",
              "pharmacy_drugs_stores_id": drug_store_id,
              "type": "Pharmacist",
              "main": false,
              "personal": true
          }
  
  
          let res = await PharmacyService.assignPharmacist(formData);
          if (res.status == 201) {
              this.setState({
                  alert: true,
                  message: 'Checking Criteria Created',
                  severity: 'success',
              })
          } else {
              this.setState({
                  alert: true,
                  message: 'Checking Criteria Cannot Create',
                  severity: 'error',
              })
          } */
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
                    warehouse_id: element.Warehouse.id,
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
    // handleCheckbox = (id) => {
    //     let ids = this.state.countable;
    //     if (ids.includes(id)) {
    //         ids = ids.filter((data) => data !== id);
    //     } else {
    //         ids.push(id);
    //     }
    //     this.setState({ countable: ids });

    // }

    //******************************************************* */

    // not(a, b) {
    //     return a.filter((value) => b.indexOf(value) === -1)
    // }

    // intersection(a, b) {
    //     return a.filter((value) => b.indexOf(value) !== -1)
    // }

    // union(a, b) {
    //     return [...a, ...this.not(b, a)]
    // }

    // handleToggle(value) {
    //     const currentIndex = this.state.checked.indexOf(value)
    //     const newChecked = [...this.state.checked]

    //     if (currentIndex === -1) {
    //         newChecked.push(value)
    //     } else {
    //         newChecked.splice(currentIndex, 1)
    //     }

    //     this.setState({
    //         checked: newChecked,
    //     })
    // }

    // numberOfChecked(items) {
    //     return this.intersection(this.state.checked, items).length
    // }

    // handleToggleAll(items) {
    //     if (this.numberOfChecked(items) === items.length) {
    //         this.setState({
    //             checked: this.not(this.state.checked, items),
    //         })
    //     } else {
    //         this.setState({
    //             checked: this.union(this.state.checked, items),
    //         })
    //     }
    // }

    // leftChecked() {
    //     return this.intersection(this.state.checked, this.state.left)
    // }

    // handleCheckedRight() {
    //     this.setState({
    //         right: this.state.right.concat(this.leftChecked()),
    //     })
    //     // this.assignPharmacist(this.leftChecked())
    //     //console.log("aaa",this.state.right.concat(this.leftChecked()))

    //     this.setState({
    //         left: this.not(this.state.left, this.leftChecked()),
    //     })

    //     this.setState({
    //         checked: this.not(this.state.checked, this.leftChecked()),
    //     })
    // }

    // rightChecked() {
    //     return this.intersection(this.state.checked, this.state.right)
    // }

    // handleCheckedLeft() {
    //     this.setState({
    //         left: this.state.left.concat(this.rightChecked()),
    //     })

    //     this.setState({
    //         right: this.not(this.state.right, this.rightChecked()),
    //     })

    //     this.setState({
    //         checked: this.not(this.state.checked, this.rightChecked()),
    //     })
    // }

    // customList(title, items) {
    //     return (
    //         <Card>
    //             <CardHeader
    //                 //className={classes.cardHeader}
    //                 avatar={
    //                     <Checkbox
    //                         onClick={() => this.handleToggleAll(items)}
    //                         checked={
    //                             this.numberOfChecked(items) === items.length &&
    //                             items.length !== 0
    //                         }
    //                         indeterminate={
    //                             this.numberOfChecked(items) !== items.length &&
    //                             this.numberOfChecked(items) !== 0
    //                         }
    //                         disabled={items.length === 0}
    //                         inputProps={{ 'aria-label': 'all items selected' }}
    //                     />
    //                 }
    //                 title={title}
    //                 subheader={`${this.numberOfChecked(items)}/${
    //                     items.length
    //                 } selected`}
    //             />
    //             <Divider />
    //             <List
    //                 className={'overflow-auto max-h-400 w-full '}
    //                 dense
    //                 component="div"
    //                 role="list"
    //             >
    //                 {items.map((value) => {
    //                     const labelId = `transfer-list-all-item-${value}-label`

    //                     return (
    //                         <ListItem
    //                             key={value}
    //                             role="listitem"
    //                             button
    //                             onClick={() => this.handleToggle(value)}
    //                         >
    //                             <ListItemIcon>
    //                                 <Checkbox
    //                                     checked={
    //                                         this.state.checked.indexOf(
    //                                             value
    //                                         ) !== -1
    //                                     }
    //                                     tabIndex={-1}
    //                                     disableRipple
    //                                     inputProps={{
    //                                         'aria-labelledby': labelId,
    //                                     }}
    //                                 />
    //                             </ListItemIcon>
    //                             <ListItemText
    //                                 id={labelId}
    //                                 primary={`${value.medium_description}`}
    //                             />
    //                         </ListItem>
    //                     )
    //                 })}

    //                 <ListItem />
    //             </List>
    //         </Card>
    //     )
    // }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        const isUpdate = this.state.isUpdate
        let dataStoreObj = null

        //   if (isUpdate) {
        //       dataStoreObj = this.props.location.state
        //   }

        return (
            <Fragment>
                <MainContainer>
                
                        <CardTitle title="Add item " />

                        <div className="w-full">
                            <ValidatorForm
                                className="pt-2"
                                onSubmit={() => this.loaded()}
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
                                            getOptionLabel={(option) => (option.code+" - "+option.description)}
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
                                            getOptionLabel={(option) => (option.code+" - "+option.description)}
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
                                    <ValidatorForm
                                            className="pt-2"
                                            onSubmit={() => null}
                                            onError={() => null}
                                        >
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
                                        </ValidatorForm>

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
                                {this.state.loaded? 
                                <TabHandling id ={this.props.id} filterData={this.state.filterData}/> 
                                : null
                            }
                            </ValidatorForm>
                        </div>

                        <Grid className="mt-5"></Grid>
                        <Divider></Divider>

                        {/* {this.state.selectedItemList === 'Eligible Item List' ? 
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
                                        <ValidatorForm
                                            className="pt-2"
                                            onSubmit={() => null}
                                            onError={() => null}
                                        >
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
                                                        startIcon="save"
                                                        // onClick={this.onSubmit}
                                                    >
                                                        <span className="capitalize">
                                                            Search
                                                        </span>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </ValidatorForm>

                                        {this.customList(
                                            'All Items',
                                            this.state.left
                                        )}

                                        <TablePagination
                                            component="div"
                                            count={this.state.totalItems}
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
                         : null}
                {this.state.selectedItemList === 'My Item List' ? 
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
                                            print: false,
                                            viewColumns: false,
                                            download: false,
                                            count: this.state.totalItems,
                                            rowsPerPage: 20,
                                            page: this.state.formData.page,
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
                     </div> : null } */}
                        {/*  <FlowDiagramComp id="9650ff7e-285f-412b-a3a6-f698e8f7ec0a" /> */}
                    
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
                </MainContainer>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(CreateWarehouseList)
