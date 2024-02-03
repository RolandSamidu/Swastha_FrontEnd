import React, { Component, Fragment } from 'react'
import {
    Button,
    CardTitle,
    LoonsCard,
    MainContainer,
    SubTitle,
    LoonsTable,
    LoonsSwitch,
    LoonsSnackbar,
} from '../../components/LoonsLabComponents'
import {
    Grid,
    Tooltip,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment,
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import { withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import EditIcon from '@material-ui/icons/Edit'
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import EmployeeServices from 'app/services/EmployeeServices'

import VehicleService from 'app/services/VehicleService'

import * as appConst from '../../../appconst'
import localStorageService from 'app/services/localStorageService'
import AddIcon from '@material-ui/icons/Add'

import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import ClinicService from 'app/services/ClinicService'
import { generatePassword } from 'utils'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import { get } from 'lodash'

const drawerWidth = 270
let activeTheme = MatxLayoutSettings.activeTheme

const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    root: {
        display: 'flex',
    },
})




class HospitalUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            all_institiutes: [],
            msd_datasetup_hospital_user_type: [],
            processing: false,
            loaded: false,
            formloaded: true,
            totalItems: 0,
            totalPages: 0,
            hospitalData: [],
            filterData: {
                page: 0,
                limit: 20,
                created_location_id: null,
                'order[0]': ['createdAt', 'DESC'],
                
                // type: appConst.hospital_user_type.map((a) => a.type),
            },

            alert: false,
            message: '',
            severity: 'success',

            statusChangeRow: null,
            conformingDialog: false,
            buttonName: 'Save',
            loading: false,
            data: [],

            columns: [
              
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log(tableMeta)
                            return (
                                <Grid className="flex items-center">
                                 
                                    <Tooltip title="Edit">
                                    <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                this.setDataToFields(
                                                    tableMeta.tableData[
                                                        tableMeta.rowIndex
                                                    ]
                                                )
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>

                                    <Grid className="px-2">
                                        <Tooltip title="Change Status">
                                            <LoonsSwitch
                                                checked={
                                                    this.state.data[
                                                        tableMeta.rowIndex
                                                    ].status == 'Active'
                                                        ? true
                                                        : false
                                                }
                                                color="primary"
                                                onChange={() => {
                                                    this.toChangeStatus(
                                                        tableMeta.rowIndex
                                                    )
                                                }}
                                            />
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            )
                        },
                    },
                },
                {
                    name: 'designation',
                    label: 'Designation',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'type',
                    label: 'User Type',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'institute',
                    label: 'Institute',
                    options: {
                        
                        customBodyRender: (value, tableMeta, updateValue) => {


                            // console.log('incomming data', data)

                            let HospitalData = this.state.hospitalData.find((e)=>e?.id === this.state.data[tableMeta.rowIndex]?.created_location_id)
                            
                            return (
                                <p>{HospitalData?.name ? HospitalData?.name + '( ' + HospitalData?.Department?.name + ' )' : 'Not Available'}</p>
                            )
                        }
                    },
                },
                // {
                //     name: 'institute',
                //     label: 'Institute',
                //     options: {
                //         filter: true,
                //         display: true,
                //     },
                // },
                {
                    name: 'name',
                    label: 'Name',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'nic',
                    label: 'NIC',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'contact_no',
                    label: 'Contact Number',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'email',
                    label: 'Email',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'address',
                    label: 'Address',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'username',
                    label: 'Username',
                    options: {
                        filter: true,
                        display: true,
                    },
                },
            ],
            formData: {
                institute:'',
                name: '',
                contact_no: '',
                type: '',
                designation: '',
                nic: '',
                email: '',
                username: '', 
                password: '',
                address: '',
                status: '',
            },
           
        }
    }

    async getPharmacyDet(search) {
        let params = {
            issuance_type: ['Hospital', 'RMSD Main'],
            'order[0]': ['createdAt', 'ASC'],
            limit: 20,
            search: search,
        }

        let res = await ClinicService.fetchAllClinicsNew(params, null)
        if (res.status == 200) {
            console.log('cheking institution', res)
            this.setState({
                all_institiutes: res?.data?.view?.data,
            })
        }
    }

    

    async componentDidMount() {
        // this.getLoginedHospital()
        this.loadData()
        console.log('form data', this.state.formData)
    }


    async saveVehicleUser() {

        console.log('data',this.state.formData);
        let formData = this.state.formData;

        let res = await VehicleService.createNewVehicleUser(formData);
        if (res.status == 201) {
          
            this.setState({ alert: true, message: "User Save Successful", severity: 'success' })
            this.loadData();
            this.resetFields();
        } else {
            this.setState({ alert: true, message: "User Save Unsuccessful", severity: 'error' })
        }
    }
    async loadData() {
        this.setState({ loaded: false })
        let filterData = this.state.filterData
        this.setState({
            msd_datasetup_hospital_user_type: appConst.msd_datasetup_hospital_user_type,
            filterData,
        })
        let user_res = await VehicleService.getVehicleUsers(filterData)
        if (user_res.status == 200) {
            this.setState(
                {
                    loaded: true,
                    data: user_res.data.view.data,
                    totalPages: user_res.data.view.totalPages,
                    totalItems: user_res.data.view.totalItems,
                },
                () => {
                    this.render()
                    this.loadHospitals(user_res.data.view.data)
                }
            )
        }
    }

   
    //Change paginations
    async setPage(page) {
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

    // set table data to form when edit button
    setDataToFields(row) {
        console.log('row2', row)
        this.setState({
            formloaded: false,
        })
        let formData = {
            id: row.id,
            name: row.name,
            designation: row.designation,
            type: row.type,
            nic: row.nic,
            contact_no: row.contact_no,
            email: row.email,
            address: row.address,
            status: row.status,
            username: row.username,
            password: row.password,
            institute: row.institute,
        }
        
        setTimeout(() => {
            this.setState(
                {
                    formData: formData,
                    buttonName: 'Update',
                    formloaded: true,
                },
                () => {
                    this.render()
                }
            )
        }, 1000)
    }

    // Change user status
    async changeStatus(row) {
        console.log('comming data', this.state.data[row])
        let data = this.state.data[row]
        let statusChange = {
            status: data.status == 'Deactive' ? 'Active' : 'Deactive',
        }
        let res = await VehicleService.changeVehicleUserStatus(
            data.id,
            statusChange
        )
        console.log('res', res)
        if (res.status == 200) {
            this.setState(
                {
                    alert: true,
                    severity: 'success',
                    message: 'Successfully changed the status',
                },
                () => {
                    this.loadData()
                }
            )
        } else {
            this.setState(
                {
                    alert: true,
                    severity: 'error',
                    message: 'Cannot change the status',
                },
                () => {
                    console.log('ERROR UpDate')
                }
            )
        }
    }

    async toChangeStatus(row) {
        this.setState({
            statusChangeRow: row,
            conformingDialog: true,
        })
    }


    async agreeToChangeStatus() {
        this.changeStatus(this.state.statusChangeRow)
        this.setState({ conformingDialog: false })
    }

    //update vehicle user details
    async updateVehicleUser() {
        let formData = this.state.formData

        let res = await VehicleService.updateVehicleUser(formData)
        if (res.status == 200) {
            this.setState({
                alert: true,
                message: 'User Update Successful',
                severity: 'success',
                buttonName: 'Save',
            })
            this.loadData()
            this.resetFields()
        } else {
            this.setState({
                alert: true,
                message: 'User Update Unsuccessful',
                severity: 'error',
            })
        }
    }

    resetFields() {
        this.setState(
            {
                formData: {
                    name: '',
                    designation: '',
                    type: '',
                    employee_id: '',
                    nic: '',
                    contact_no: '',
                    email: '',
                    address: '',
                    status: '',
                    institute: '',
                    password: '',
                    created_location_id: null,
                    
                },
                buttonName: 'Save',
            },
            // () => {
            //     this.getLoginedHospital()
            // }
        )
    }


    async loadHospitals(mainData){
        console.log('checkinf min data' , mainData)

        let created_location_id_list = mainData.map((dataset) => dataset?.created_location_id)
        let uniq_created_location_id_list = [...new Set(created_location_id_list)]
        let params = { 
            issuance_type: ["Hospital", 'RMSD Main'], 
            // limit: 1, 
            // page: 0,
            'order[0]': ['createdAt', 'ASC'],
            // selected_owner_id: uniq_created_location_id_list
        };
    
        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('ceking ospital', res.data.view.data)
            this.setState({
                hospitalData:res.data.view.data
            })
        }

    }

    // async getLoginedHospital() {
    //     let hospital = await localStorageService.getItem(
    //         'login_user_pharmacy_drugs_stores'
    //     )
    //     let formData = this.state.formData
    //     let filterData = this.state.filterData
    //     formData.created_location_id = hospital[0].pharmacy_drugs_stores_id
    //     filterData.created_location_id = hospital[0].pharmacy_drugs_stores_id

    //     this.setState(
    //         { formData, filterData,  },
    //         () => {
    //             
    //         }
    //     )
    // }

    

    render() {

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={'Add Hospital User'} />
                        {this.state.formloaded ? (
                            <ValidatorForm
                                className="pt-2"
                                onSubmit={() => {
                                    this.state.buttonName == 'Save'
                                        ? this.saveVehicleUser()
                                        : this.updateVehicleUser()
                                }}
                            >
                                <Grid container spacing={1} className="flex ">
                                    

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Institute" />
                                        <Autocomplete
                                            disableClearable
                                            name="institute"
                                            className="w-full"
                                            options={this.state.all_institiutes}
                                            value={this.state.all_institiutes?.find((v) => v.owner_id == this.state.formData.owner_id)}
                                            onChange={(e, value) => {
                                                    console.log(
                                                        'formdata at institute',
                                                        e.target.value
                                                    )
                                                    let formData = this.state.formData
                                                    let filterData = this.state.filterData
                                                    formData.owner_id = value.owner_id
                                                    formData.created_location_id = value.id
                                                    filterData.created_location_id = value.id
                                                    this.setState({ formData },
                                                        console.log(
                                                            'formdata at institutte',
                                                            this.state.formData
                                                        ))
                                             
                                            }}
                                            // value={this.state.all_institiutes.find(
                                            //     (v) =>
                                            //         v.institute ===
                                            //         this.state.formData.institute
                                            // )}

                                            
                                            getOptionLabel={(option) =>
                                                option.name
                                                    ? option.name +
                                                      ' - ' +
                                                      option?.Department?.name
                                                    : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Institute"
                                                    fullWidth="fullWidth"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        if (
                                                            e.target.value
                                                                .length > 2
                                                        ) {
                                                            this.getPharmacyDet(
                                                                e.target.value
                                                            )
                                                        }
                                                    }}
                                                    
                                                    value={this.state.all_institiutes?.find((v) => v.owner_id == this.state.formData.owner_id)}

                                                   
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Name" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Name"
                                            name="name"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.name}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.name = e.target.value
                                                this.setState({ formData })
                                                console.log('name', this.state.formData.name)
                                            }}
                                            validators={[
                                                'required',
                                                'matchRegexp:^[A-z| |.]{1,}$',
                                            ]}
                                            errorMessages={[
                                                'this field is required',
                                                'Please Enter a valid Name (Eg:A.B.C Perera)',
                                            ]}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Contact Number" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Contact Number"
                                            name="contact_no"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                this.state.formData.contact_no
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.contact_no =
                                                    e.target.value
                                                this.setState({ formData })
                                            }}
                                            validators={[
                                                'required',
                                                'matchRegexp:((^|, )((0)[0-9]{9}|(7)[0-9]{8}))+$',
                                            ]}
                                            errorMessages={[
                                                'this field is required',
                                                'Please enter a valid Contact Number(Eg:0712345678 or 712345678)',
                                            ]}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="User Type" />

                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            name="usertype"
                                         
                                            options={
                                                appConst.msd_datasetup_hospital_user_type
                                            }
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let formData =
                                                        this.state.formData
                                                    formData.type = value.type
                                                    this.setState(
                                                        {
                                                            formData,
                                                        },
                                                        console.log(
                                                            'formdata at user type',
                                                            this.state.formData.type
                                                        )
                                                    )
                                                }
                                            }}
                                            value={appConst.msd_datasetup_hospital_user_type.find(
                                                (v) =>
                                                    v.type ===
                                                    this.state.formData.type
                                            )}
                                            getOptionLabel={(option) =>
                                                option.lable ? option.lable : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="User Type"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.msd_datasetup_hospital_user_type.find(
                                                        (v) =>
                                                            v.type ===
                                                            this.state.formData
                                                                .type
                                                    )}
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                />
                                            )}
                                        />
                                    </Grid>
                                   

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Designation" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Designation"
                                            name="designation"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                this.state.formData.designation
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.designation =
                                                    e.target.value
                                                this.setState({ formData })
                                                console.log(
                                                    'formdata at designation',
                                                    this.state.formData
                                                )
                                            }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="NIC" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="NIC"
                                            name="nic"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.nic}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.nic =
                                                    e.target.value.toUpperCase()
                                                formData.username =
                                                    this.state.buttonName !=
                                                    'Update'
                                                        ? e.target.value.toUpperCase()
                                                        : this.state.formData
                                                              .username
                                                this.setState({ formData })
                                            }}
                                            validators={[
                                                'required',
                                                'matchRegexp:^([0-9]{9}[x|X|v|V]|[0-9]{12})$',
                                            ]}
                                            errorMessages={[
                                                'this field is required',
                                                'Please enter a valid NIC Number(Eg:991234567v or 199981234567)',
                                            ]}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Email" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Email"
                                            name="email"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.email}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.email = e.target.value
                                                this.setState({ formData })

                                            }}
                                            validators={['required', 'isEmail']}
                                            errorMessages={[
                                                'this field is required',
                                                'Please enter a valid Email Address',
                                            ]}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Username" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Username"
                                            name="username"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.username}
                                            type="text"
                                            //disabled={this.state.buttonName == "Update"}
                                            disabled={true}
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.username =
                                                    e.target.value
                                                this.setState({ formData })
                                            }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Password" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Password"
                                            // name="password"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.password}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e, value) => {
                                                let formData =
                                                    this.state.formData
                                                formData.password =
                                                    e.target.value

                                                let filterData = 
                                                this.state.filterData
                                                    filterData.password =
                                                    e.target.value

                                                this.setState({ formData })
                                                this.setState({ filterData })

                                                console.log('password', formData.password)

                                            }}
                                            // disabled={true}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <AutorenewIcon
                                                            onClick={() => {
                                                                let formData =
                                                                    this.state
                                                                        .formData
                                                                formData.password = generatePassword()
                                                                this.setState({
                                                                    formData,
                                                                })
                                                              

                                                            }}
                                                        ></AutorenewIcon>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            // validators={['required', "matchRegexp:^[A-z| |.]{1,}$"]}
                                            // errorMessages={[
                                            //     'this field is required', "Please Enter Password"
                                            // ]}
                                        />
                                        {/* <Button
                                        className="mt-2"
                                        onClick={generatePassword}
                                        
                                        // progress={this.state.processing}
                                        // type="submit"
                                        // scrollToTop={true}
                                        // startIcon="Generate"
                                    >
                                        <span className="capitalize">Generate</span>
                                    </Button> */}
                                    </Grid>

                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <SubTitle title="Address" />
                                        <TextValidator
                                            className="w-full"
                                            placeholder="Address"
                                            name="address"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.address}
                                            type="text"
                                            multiline
                                            rows={3}
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.address =
                                                    e.target.value
                                                this.setState({ formData })

                                                console.log(
                                                    'formdata at password',
                                                    this.state.formData
                                                )
                                            }}
                                            validators={[
                                                'required',
                                                // 'matchRegexp:^[A-z| |0-9|,|/|\\n]{1,}$',
                                            ]}
                                            errorMessages={[
                                                'this field is required',
                                                // 'Please enter a valid Address',
                                            ]}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid
                                    className=" w-full flex justify-end"
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <Button
                                        className="mt-2"
                                        progress={false}
                                        scrollToTop={true}
                                        startIcon="cancel"
                                        onClick={() => {
                                            this.resetFields()
                                        }}
                                    >
                                        <span className="capitalize">
                                            Cancel
                                        </span>
                                    </Button>

                                    <Button
                                        className="mt-2 ml-2"
                                        progress={this.state.processing}
                                        type="submit"
                                        scrollToTop={true}
                                        startIcon="save"
                                    >
                                        <span className="capitalize">
                                            {this.state.buttonName}
                                        </span>
                                    </Button>
                                </Grid>
                            </ValidatorForm>
                        ) : null}
                    </LoonsCard>

                    <Grid style={{ marginTop: 20 }}>
                        <LoonsCard>
                            <ValidatorForm
                                onSubmit={() => {
                                    let filterData = this.state.filterData
                                    filterData.page = 0
                                    this.setState({ filterData })

                                    this.loadData()
                                    console.log('data', this.state.formData.owner_id)

                                }}
                            >
                                <Grid container className=" w-full" spacing={1}>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={3}
                                        sm={12}
                                        xs={12}
                                    >
                                        <TextValidator
                                            className="w-full"
                                            placeholder="Search"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={this.state.filterData.search}
                                            onChange={(e, value) => {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.search =
                                                    e.target.value
                                                this.setState({ filterData })
                                            }}
                                            
                                        />
                                    </Grid>

                                    <Grid item>
                                        <Button className="mt-1" type="submit">
                                            Search
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                            {this.state.loaded && (
                                <div className="mt-0">
                                    <LoonsTable
                                        id={'allVehicleUsers'}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: 20,
                                            page: this.state.filterData.page,

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
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    ></LoonsTable>
                                </div>
                            )}
                        </LoonsCard>
                    </Grid>
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

                <Dialog
                    open={this.state.conformingDialog}
                    onClose={() => {
                        this.setState({ conformingDialog: false })
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {'Conformation'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you Sure to change status of this User?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="text"
                            onClick={() => {
                                this.setState({ conformingDialog: false })
                            }}
                            color="primary"
                        >
                            Disagree
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => {
                                this.agreeToChangeStatus()
                            }}
                            color="primary"
                            autoFocus
                        >
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}



export default withStyles(styleSheet)(HospitalUser)
