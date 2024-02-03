import {
    FormControlLabel,
    Grid,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tooltip,
    IconButton,
    InputAdornment,
    CircularProgress 
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import VisibilityIcon from '@material-ui/icons/Visibility'
import LoonsTable from '../../../components/LoonsLabComponents/Table/LoonsTable'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete } from '@material-ui/lab'
import FlowDiagramComp from 'app/components/FlowDiagramComp/FlowDiagramComp'
import {
    Button,
    CardTitle,
    CheckboxValidatorElement,
    LoonsCard,
    LoonsSnackbar,
    MainContainer,
    SubTitle,
    CheckBox,
} from 'app/components/LoonsLabComponents'
import TablePagination from '@material-ui/core/TablePagination'
import List from '@material-ui/core/List'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
//import Button from "@material-ui/core/Button";
import Divider from '@material-ui/core/Divider'

import DepartmentService from 'app/services/DepartmentService'
import DepartmentTypeService from 'app/services/DepartmentTypeService'
import PharmacyService from 'app/services/PharmacyService'
import EmployeeServices from 'app/services/EmployeeServices'
import TransferList from 'app/views/common/TransferList'
import 'date-fns'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'

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

class CreateWarehousePeople extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isUpdate: true,

            allSR: [],
            allItemName: [],
            allVEN: [],
            allCatergoryCode: [],
            allCatergoryName: [],
            allGroupCode: [],
            allShortReference: [],
            allClassName: [],
            allGroups: [],
            allSeriesCode: [],
            allSeriesName: [],

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
            // allHigherLevels: [
            //     { name: 'level1', id: 1 },
            //     { name: 'lavel2', id: 2 },
            //     { name: 'lavel3', id: 3 },
            // ],

            formData: {
                name: null,
                type: null,
                issuance_type:null,
                nic: null,
                contact_no: null,
                email: null,
                address: null,

                // user_role:null,
                // designation:null,
                // user_name:null,
                // employee_id:null,
                // reporting_userID:null,
                // reporting_userName:null,
            },

            checked: [],

            loaded: false,
            totalItems: 0,
            totalPages: 0,

            filterData: {
                limit: 20,
                page: 0,
                // pharmacy_drugs_stores_id:this.props.pharmacydrugstore.id,
                type: null,
                user_role: null,
                designation: null,
                search:null,
                reporting_userID: null,
                reporting_userName: null,
                //type: '',
                //designation: ''
            }, //employee filter data
            employeeFilterData: {
                type: null,
            },

            left: [],
            right: [],
            allEmpData: [], //drop down data
            empData: [], //table data
            confirmingDialog: false,
            empType: [
                {
                    type: 'MSD MSA',
                },
                {
                    type: 'MSD MSA',
                },
            ],
            empFormData: {
                employee_id: null,
                pharmacy_drugs_stores_id:this.props.pharmacydrugstore.id,
                    // '9650ff7e-285f-412b-a3a6-f698e8f7ec0a',
               
                type: null,
                main: true,
                personal: false,
            },
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="View">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                // console.log(this.state.data[tableMeta.rowIndex])
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <VisibilityIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )
                        },
                    },
                },
                {
                    name: 'id',
                    label: 'id',
                    options: {
                        //filter: true,
                        display: false,
                    },
                },
                {
                    name: 'name', // field name in the row object
                    label: 'Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>
                                    {
                                        this.state.empData[tableMeta.rowIndex]
                                            .Employee.name
                                    }
                                </p>
                            )
                        },
                    },
                },
                {
                    name: 'designation', // field name in the row object
                    label: 'Designation', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>
                                    {
                                        this.state.empData[tableMeta.rowIndex]
                                            .Employee.designation
                                    }
                                </p>
                            )
                        },
                    },
                },
                {
                    name: 'type', // field name in the row object
                    label: 'Type', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>
                                    {
                                        this.state.empData[tableMeta.rowIndex]
                                            .type
                                    }
                                </p>
                            )
                        },
                    },
                },
                {
                    name: 'nic', // field name in the row object
                    label: 'NIC', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>
                                    {
                                        this.state.empData[tableMeta.rowIndex]
                                            .Employee.nic
                                    }
                                </p>
                            )
                        },
                    },
                },
                {
                    name: 'contact_no', // field name in the row object
                    label: 'Contact Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>
                                    {
                                        this.state.empData[tableMeta.rowIndex]
                                            .Employee.contact_no
                                    }
                                </p>
                            )
                        },
                    },
                },
                {
                    name: 'email', // field name in the row object
                    label: 'Email', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>
                                    {
                                        this.state.empData[tableMeta.rowIndex]
                                            .Employee.email
                                    }
                                </p>
                            )
                        },
                    },
                },
                {
                    name: 'address', // field name in the row object
                    label: 'Address', // column title that will be shown in table
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>
                                    {
                                        this.state.empData[tableMeta.rowIndex]
                                            .address
                                    }
                                </p>
                            )
                        },
                    },
                },
            ],
        }
    }

    componentDidMount() {
        this.loadData()

        // this.loadAllEmployees()
        // this.loadAllItems()

        console.log('Props=============>', this.props)

        const isUpdate = this.state.props

        if (!isUpdate) {
            //this.loadAllDataStoreData()
        }
    }
    async loadData() {
        this.setState({ loaded: false })
        // const query = new URLSearchParams(this.props.location.search);
        // const owner_id = query.get('owner_id')
        // let allFrontDesks = await PharmacyService.getPharmacyById(this.props.match.params.id, owner_id, {
        //     limit: 20,
        //     page: 0,
        //     issuance_type: 'Clinic'
        // })

        // console.log("Front Desk: ", allFrontDesks);

        // if (allFrontDesks.status == 200) {
        //     console.log(allFrontDesks)
        //     this.setState({
        //         loaded: true,
        //         data: allFrontDesks.data.view,
        //         totalPages: allFrontDesks.data.view.totalPages,
        //         totalItems: allFrontDesks.data.view.totalItems,
        //     })
        //     console.log(this.state.data);
        // }
        let filterData = this.state.filterData
        filterData.issuance_type = 'MSD MSA'
        let res = await EmployeeServices.getALLAsignEmployees(filterData)
        // { pharmacy_drugs_stores_id:"9650ff7e-285f-412b-a3a6-f698e8f7ec0a", type:"Pharmacist"}
        //pharmacy_drugs_stores_id: this.props.match.params.id
        console.log('res', res)
        if (res.status == 200) {
            this.setState({
                loaded: true,
                empData: res.data.view.data,
                totalPages: res.data.view.totalPages,
                totalItems: res.data.view.totalItems,
            })
            console.log('Getting looped', this.state.empData)
        }

        // let allEmployees = await EmployeeServices.getEmployees({ type: 'consultant' })
        // if (allEmployees.status == 200) {
        //     this.setState({
        //         empLoaded: true,
        //         allEmpData: allEmployees.data.view.data
        //     })

        //     console.log(this.state.empData);
        // }
    }

    // loadAllDataStoreData = async () => {
    //     let dataStoreData = await PharmacyService.fetchAllDataStorePharmacy('001', {})
    //     if (200 == dataStoreData.status) {
    //         this.setState({
    //             drugStoreData: dataStoreData.data.view.data,
    //         })
    //     }
    // }

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
    async createNewEmployee() {
        console.log(this.state.empFormData)
        let res = await EmployeeServices.createNewAssignEmployee(this.state.empFormData);
        console.log("res",res)
        if (res.status === 201) {
            this.setState({
                alert: true,
                message: 'Employee assigned successfully!',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Employee assign was unsuccessful!',
                severity: 'error',
            })
        }
    }

    async loadAllEmployees() {
        let employeeFilterData = this.state.employeeFilterData
        this.setState({ loaded: false })
        let res = await EmployeeServices.getEmployees(employeeFilterData)
        console.log('all pharmacist', res.data.view.data)
        if (200 == res.status) {
            this.setState({
                allEmpData: res.data.view.data,
                loaded: true,
            })
        }
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
                this.loadData()
            }
        )
    }

    handleChangePage(newPage) {
        console.log('new page', newPage)
        let filterData = this.state.filterData
        filterData.page = newPage
        this.setState({ filterData }, () => {
            this.loadData()
        })
    }
    handleChangeRowsPerPage(limit) {
        console.log('limit', limit)
        let filterData = this.state.filterData
        filterData.limit = limit
        this.setState({ filterData }, () => {
            this.loadData()
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

    //******************************************************* */

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
        this.assignPharmacist(this.leftChecked())
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
                                    primary={`${value.name}`}
                                />
                            </ListItem>
                        )
                    })}

                    <ListItem />
                </List>
            </Card>
        )
    }

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
                    <LoonsCard>
                        <CardTitle title="Add User to the warehouse " />

                        <div className="w-full">
                            <ValidatorForm
                                className="pt-2"
                                onSubmit={() => this.saveStepOne()}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex ">
                                    {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                        {/* TODO - Check what is this. This is not submitted to backend */}
                                        {/* <SubTitle title="Designation" />
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
                                                            designation:
                                                                value.id,
                                                        },
                                                    })
                                                }
                                            }}
                                            value={this.state.allVEN.find(
                                                (v) =>
                                                    v.id ==
                                                    this.state.filterData
                                                        .designation
                                            )}
                                            getOptionLabel={(option) =>
                                                option.name ? option.name : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Designation"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid> */} 
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                        {/* TODO - Check what is this. This is not submitted to backend */}
                                        <SubTitle title="User Role" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={
                                                this.state.empType
                                            }
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    this.setState({
                                                        filterData: {
                                                            ...this.state
                                                                .filterData,
                                                            type: value.id,
                                                        },
                                                    })
                                                }
                                            }}
                                            value={this.state.allCatergoryCode.find(
                                                (v) =>
                                                    v.id ==
                                                    this.state.filterData.type
                                            )}
                                            getOptionLabel={(option) =>
                                                option.name ? option.name : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="User Role"
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
                                        <SubTitle title="Reporting User ID" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={
                                                this.state.allCatergoryName
                                            }
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    this.setState({
                                                        filterData: {
                                                            ...this.state
                                                                .filterData,
                                                            reporting_userID:
                                                                value.id,
                                                        },
                                                    })
                                                }
                                            }}
                                            value={this.state.allCatergoryName.find(
                                                (v) =>
                                                    v.id ==
                                                    this.state.filterData
                                                        .reporting_userID
                                            )}
                                            getOptionLabel={(option) =>
                                                option.name ? option.name : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Reporting User ID"
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
                                        <SubTitle title="Reporting User Name" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={
                                                this.state.allShortReference
                                            }
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    this.setState({
                                                        filterData: {
                                                            ...this.state
                                                                .filterData,
                                                            reporting_userName:
                                                                value.id,
                                                        },
                                                    })
                                                }
                                            }}
                                            value={this.state.allShortReference.find(
                                                (v) =>
                                                    v.id ==
                                                    this.state.filterData
                                                        .reporting_userName
                                            )}
                                            getOptionLabel={(option) =>
                                                option.name ? option.name : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Reporting User Name"
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
                                 <TextValidator className='w-full mt-5'
                                    placeholder="Search"
                                     fullWidth="fullWidth" 
                                     variant="outlined" 
                                     size="small"
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
                                           )
                                       }}/>
   
                                       
                                    </Grid>
                                    <Grid item 
                                className='justify-start'>
                                        <Button
                                        className='mt-6'
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


                                    {/* <SubTitle title="Name" />
                                    <TextValidator
                                                className=" w-full"
                                                placeholder="Name"
                                                name="name"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                // value={dataStoreObj.id}
                                                disabled={true}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                            /> */}
                                </Grid>
                            </ValidatorForm>
                        </div>
                        <Divider></Divider>

                        {/* <Grid className="mt-5" container spacing={2} justify="center" > */}

                    
                            <ValidatorForm
                                className="mt-2"
                                onSubmit={() => null}
                                onError={() => null}
                            >
                             <Grid container spacing={2} className='justify-end flex'>
                                    <Grid item 
                                     className='justify-end flex'>
                                        <Button
                                            className='mt-4'
                                            progress={false}
                                            scrollToTop={true}
                                            startIcon="add"
                                            onClick={() => {
                                                console.log('press!')
                                                this.setState({
                                                    confirmingDialog: true,
                                                })
                                            }}
                                        >
                                            <span className="capitalize">
                                                Assign employee
                                            </span>
                                        </Button>
                                    </Grid>
                                   
                                </Grid>
                            </ValidatorForm>

                            {/* {this.customList("All Items", this.state.left)} */}

                            {/* <TablePagination
                                    component="div"
                                    count={this.state.totalItems}
                                    page={this.state.filterData.page}
                                    onChangePage={(e, page) => { this.handleChangePage(page) }}
                                    rowsPerPageOptions={[]}
                                    rowsPerPage={this.state.filterData.limit}
                                    onRowsPerPageChange={(event, limit) => { this.handleChangeRowsPerPage(limit) }}
                                /> */}

                        {/* <Grid item
                                lg={2}
                                md={2}
                                sm={12}
                                xs={12}>
                                <Grid className='mt-20' container direction="column" alignItems="center" spacing={1}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        className='my-1'
                                        onClick={() => this.handleCheckedRight()}
                                        disabled={this.leftChecked().length === 0}
                                        aria-label="move selected right"
                                    >
                                        &gt;
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        className='my-1'
                                        onClick={() => this.handleCheckedLeft()}
                                        disabled={this.rightChecked().length === 0}
                                        aria-label="move selected left"
                                    >
                                        &lt;
                                    </Button>
                                </Grid>
                            </Grid> */}
                        {/* <Grid className=" w-full "
                                item
                                lg={5}
                                md={5}
                                sm={12}
                                xs={12} >{this.customList("Assigned to Questions", this.state.right)}</Grid>
                        </Grid> */}
                        {this.state.loaded && (
                            <div className="mt-0">
                                <LoonsTable
                                    id={'assignEmployees'}
                                    data={this.state.empData}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        rowsPerPage: 20,
                                        page: this.state.filterData.page,

                                        onTableChange: (action, tableState) => {
                                            switch (action) {
                                                case 'changePage':
                                                    this.setPage(
                                                        tableState.page
                                                    )
                                                    break
                                                case 'sort':
                                                    break
                                                default:
                                                    console.log(
                                                        'action not handled.'
                                                    )
                                            }
                                        },
                                    }}
                                >
                                    {}
                                </LoonsTable>
                            </div>
                        )}

                        <ValidatorForm className="pt-2">
                            <Grid container spacing={1} className="flex ">
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                >
                                    <Dialog
                                        maxWidth={'md'}
                                        fullWidth={true}
                                        open={this.state.confirmingDialog}
                                        onClose={() => {
                                            this.setState({
                                                confirmingDialog: false,
                                            })
                                        }}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">
                                            {'Add Employee'}
                                        </DialogTitle>

                                        <DialogContent>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Employee Type" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.empType}
                                                    onChange={(e, value, r) => {
                                                        if (null != value) {
                                                            let empFormData =
                                                                this.state
                                                                    .empFormData
                                                            empFormData.type =
                                                                value.type
                                                            let employeeFilterData =
                                                                this.state
                                                                    .employeeFilterData
                                                            employeeFilterData.type =
                                                                value.type

                                                            this.setState(
                                                                {
                                                                    employeeFilterData:
                                                                        employeeFilterData,
                                                                    empFormData,
                                                                },
                                                                () => {
                                                                    this.loadAllEmployees()
                                                                }
                                                            )
                                                        }
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.type
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
                                        </DialogContent>
                                        <DialogContent>
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
                                                    options={
                                                        this.state.allEmpData
                                                    }
                                                    onChange={(e, value, r) => {
                                                        console.log(
                                                            'value',
                                                            value
                                                        )
                                                        if (null != value) {
                                                            let empFormData =
                                                                this.state
                                                                    .empFormData
                                                            empFormData.employee_id =
                                                                value.id
                                                            this.setState({
                                                                empFormData,
                                                            })
                                                        }
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.name
                                                    }
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
                                        </DialogContent>
                                        <DialogActions>
                                            <Button
                                                className="mt-2"
                                                progress={false}
                                                type="submit"
                                                scrollToTop={true}
                                                onClick={() => {
                                                    this.createNewEmployee()
                                                }}
                                            >
                                                <span className="capitalize">
                                                    Save
                                                </span>
                                            </Button>
                                            <Button
                                                className="mt-2"
                                                progress={false}
                                                // type="submit"
                                                scrollToTop={true}
                                                onClick={() => {
                                                    this.setState({
                                                        confirmingDialog: false,
                                                    })
                                                }}
                                            >
                                                <span className="capitalize">
                                                    Cancel
                                                </span>
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Grid>
                            </Grid>
                        </ValidatorForm>

                        {/*  <FlowDiagramComp id="9650ff7e-285f-412b-a3a6-f698e8f7ec0a" /> */}
                    </LoonsCard>
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

export default withStyles(styleSheet)(CreateWarehousePeople)
