import React, { Component, Fragment } from "react";
import { LoonsSnackbar, MainContainer, SubTitle } from "../../../components/LoonsLabComponents";
import { Grid, Typography, CircularProgress, InputAdornment, } from '@material-ui/core'
import { Button } from 'app/components/LoonsLabComponents'
import VehicleService from "../../../services/VehicleService";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import LoonsTable from "../../../components/LoonsLabComponents/Table/LoonsTable";
import { Autocomplete } from "@material-ui/lab";
import LoonsCard from "../../../components/LoonsLabComponents/LoonsCard";
import CardTitle from "../../../components/LoonsLabComponents/CardTitle";
import Tooltip from "@material-ui/core/Tooltip";
import LoonsSwitch from "../../../components/LoonsLabComponents/Switch";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import localStorageService from "app/services/localStorageService";
import * as appConst from '../../../../appconst';
import { Box } from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import { dateParse } from "utils";
import { DatePicker } from 'app/components/LoonsLabComponents';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddEmployees from "./AddEmployees";
import PrintAssignEmployee from "./PrintAssignEmployee";
import StockVerificationService from "../../../services/StockVerificationService"
import DashboardServices from '../../../services/DashboardServices';
import EmployeeServices from "app/services/EmployeeServices";
import PersonIcon from '@mui/icons-material/Person';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';





class AssignEmployees extends Component {
    constructor(props) {
        super(props)
        this.viewContentRef = React.createRef();

        this.state = {
            isAssignTrue: false,
            isClickBox: true,
            submitting: false,
            confirmingDialog: false,
            loadedHospital: false,
            loadedEmp: false,
            loaded: false,
            loaded_notify: false,
            loadedAssignEmp: false,
            buttonName: 'Save',
            isUpdate: false,
            all_hospitals: [],
            stock_verification_data: [],
            data2: [],
            select_employees_data: [],
            editStockVerifcationId: null,
            edit: false,
            all_employee: [
                {

                    // name: "Samam",
                    // nic_no: "45934060V",
                    // user_type: "male",
                    // designation: "test",


                }
            ],

            patientObj: {
                address: null,
                age: null,
                citizenship: null,
                contact_no: null,
                contact_no2: null,
                createdAt: null,
                created_by: null,
                date_of_birth: null,
                district_id: 1,
                driving_license: null,
                email: null,
                ethinic_group: null,
                gender: null,
                GN: null,
                guardian_nic: null,
                id: null,
                marital_status: null,
                mobile_no: null,
                mobile_no2: null,
                Moh: null,
                name: null,
                trasfered_from_hospital: null,
                nic: null,
                passport_no: null,
                PHM: null,
                phn: null,
                religion: null,
                title: null
            },





            // institution: {
            //     first: null,
            //     mid: null,
            //     end: null
            // },
            regno2: true,

            employee: [],

            empData: {
                page: 0,
                limit: 10,
                type: ["Verification Officer", "Verification Officer Head"]
            },
            selectAssignEmpData: {
                page: 0,
                limit: 10,
            },
            stockVerificationData: {
                page: 0,
                limit: 10,
                // type: ["Helper", "Driver"]
                'order[0]': [
                    'updatedAt', 'DESC'
                ],
            },


            formData: {

                // institution: null,
                // ending_code_item: '',
                // starting_item_code: '',
                pharmacy_drugs_store_id: null,
                employee_id: [],
                select_assigned_emp: [],
                from_date: null,
                to_date: null,
                notify: null,
                limit: 5,
                page: 0,
                district: null,
                edit_institution: null,





            },

            editData: {
                page: 0,
                limit: 10,
                // issuance_type: 'pharmacy'
                'order[0]': [
                    'updatedAt', 'DESC'
                ],
            },
            columns: [
                {
                    name: 'from_date',
                    label: 'From Date',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(value)
                        },
                    },
                },
                {
                    name: 'to_date',
                    label: 'To Date',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(value)
                        },
                    },


                },
                {
                    name: 'district',
                    label: 'Institute Name',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_data[tableMeta.rowIndex]?.Pharmacy_drugs_store?.name + ' - ' + this.state.stock_verification_data[tableMeta.rowIndex]?.Pharmacy_drugs_store?.Department?.name
                        },
                    },

                },


                // {
                //     name: 'id',
                //     label: 'Assigned Employees',
                //     options: {
                //         filter: true,
                //     },
                // },
                {
                    name: 'notify',
                    label: 'Status',
                    options: {
                        filter: true,
                    },
                },

                {
                    name: "action",
                    label: "Action",
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="View Assigned Employees">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                console.log('personicon', this.state.stock_verification_data[tableMeta.rowIndex])
                                                this.getSelectAssignEmployees(this.state.stock_verification_data[tableMeta.rowIndex]?.id)
                                                this.setState({
                                                    confirmingDialog: true,
                                                    // selected_item: this.state.data[tableMeta.rowIndex]
                                                }

                                                )
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <PersonIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="View">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                console.log('eyeicon', this.state.stock_verification_data[tableMeta.rowIndex])
                                                window.location.href = `/PrintAssignEmployee/${this.state.stock_verification_data[tableMeta.rowIndex]?.id}`
                                                // var createClinicWindow = window.open(`/hospital-data-setup/assing_pharmacist/${this.state.data[tableMeta.rowIndex].id}` + "?owner_id=" + this.state.owner_id, '_blank');
                                                // createClinicWindow.data = this.state.data[tableMeta.rowIndex]
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Edit">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                // this.getSelectAssignEmployees(this.state.stock_verification_data[tableMeta.rowIndex]?.id)
                                                let formData = this.state.formData
                                                this.getSelectAssignEmployeesForEdit(this.state.stock_verification_data[tableMeta.rowIndex]?.id)
                                                // this.loadHospitalEdit(this.state.stock_verification_data[tableMeta.rowIndex]?.Pharmacy_drugs_store.name)
                                                formData.edit_institution = this.state.stock_verification_data[tableMeta.rowIndex]?.Pharmacy_drugs_store.name
                                                formData.from_date = this.state.stock_verification_data[tableMeta.rowIndex]?.from_date
                                                formData.to_date = this.state.stock_verification_data[tableMeta.rowIndex]?.to_date
                                                formData.notify = this.state.stock_verification_data[tableMeta.rowIndex]?.notify
                                                this.setState({ edit: true, editStockVerifcationId: this.state.stock_verification_data[tableMeta.rowIndex]?.id, formData, loaded_notify: true })
                                                console.log("editdata", formData)






                                                // this.state.select_employees_data.map(x => console.log('x', x));
                                            }
                                            }
                                            size="small"
                                            aria-label="view"
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>


                                </Grid>
                            );
                        }

                    }
                },

            ],

            selected_list: [],

            employee_list_column: [
                {
                    name: 'name', // field name in the row object
                    label: 'Name', // column title that will be shown in table
                    options: {
                        display: true,
                        filter: true,

                    },
                },

                // {
                //     name: 'nic', // field name in the row object
                //     label: 'Nic No', // column title that will be shown in table
                //     options: {
                //         display: true,
                //     },
                // },
                // {
                //     name: 'type', // field name in the row object
                //     label: 'User Type', // column title that will be shown in table
                //     options: {
                //         display: true,
                //     },
                // },
                {
                    name: 'designation', // field name in the row object
                    label: 'Designation', // column title that will be shown in table

                    options: {
                        display: true,
                    },
                },

                {
                    name: "select",
                    label: "Select",
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {


                            return <input
                                type="checkbox"
                                style={{
                                    width: "20px",
                                    height: "20px", outline: "none",
                                    cursor: "pointer"
                                }}

                                defaultChecked={this.state.formData?.employee_id.includes(this.state.all_employee[dataIndex]?.id)}
                                checked={this.state.formData?.employee_id.includes(this.state.all_employee[dataIndex]?.id)}
                                required={this.state.isClickBox}
                                errorMessages="this field is required"


                                onClick={() => {

                                    let formData = this.state.formData
                                    let index = formData.employee_id?.indexOf(this.state.all_employee[dataIndex]?.id)
                                    if (index == -1) {
                                        formData.employee_id.push(this.state.all_employee[dataIndex]?.id)

                                    } else {
                                        formData.employee_id.splice(index, 1)
                                    }

                                    this.setState({ formData, isClickBox: false }, () => {
                                        console.log('checked data', this.state.formData)

                                    })

                                }}
                            />


                        }
                    }
                },

            ],

            emp_columns: [
                {
                    name: 'name',
                    label: 'Name',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.select_employees_data[tableMeta.rowIndex]?.Employee?.name
                        },
                    },
                },
                {
                    name: 'contact_no',
                    label: 'Contact No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.select_employees_data[tableMeta.rowIndex]?.Employee?.contact_no
                        },
                    },

                },
                {
                    name: 'email',
                    label: 'Email',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.select_employees_data[tableMeta.rowIndex]?.Employee?.email
                        },
                    },

                },

            ],


            // lp_data_columns: [
            //     {
            //         name: 'request_id', // field name in the row object
            //         label: 'Request ID', // column title that will be shown in table
            //         options: {
            //             filter: false,
            //             display: true,
            //         },
            //     },
            //     {
            //         name: 'request_by',
            //         label: 'Requested By',
            //         options: {
            //             // filter: true,
            //             customBodyRender: (value, tableMeta, updateValue) => {
            //                 return (
            //                     <p>{this.state.lp_data[tableMeta.rowIndex]?.Employee?.name ? this.state.lp_data[tableMeta.rowIndex]?.Employee.name : 'Not Available'}</p>
            //                 )
            //             }
            //         },
            //     },
            //     {
            //         name: 'required_date',
            //         label: 'Requested Date',
            //         options: {
            //             // filter: true,
            //             customBodyRender: (value, tableMeta, updateValue) => {
            //                 return (
            //                     <p>{this.state.lp_data[tableMeta.rowIndex]?.required_date ? dateParse(this.state.lp_data[tableMeta.rowIndex]?.required_date) : 'Not Available'}</p>
            //                 )
            //             }
            //         },
            //     },
            //     {
            //         name: 'request_quantity',
            //         label: 'Requested Quantity',
            //         options: {
            //             // filter: true,
            //             customBodyRender: (value, tableMeta, updateValue) => {
            //                 return (
            //                     <p>{this.state.lp_data[tableMeta.rowIndex]?.required_quantity ? parseInt(this.state.lp_data[tableMeta.rowIndex]?.required_quantity, 10) : 'Not Available'}</p>
            //                 )
            //             }
            //         },
            //     },
            //     {
            //         name: 'cost',
            //         label: 'Amount (LKR)',
            //         options: {
            //             // filter: true,
            //             customBodyRender: (value, tableMeta, updateValue) => {
            //                 return (
            //                     <p>{this.state.lp_data[tableMeta.rowIndex]?.cost ? roundDecimal(this.state.lp_data[tableMeta.rowIndex]?.cost, 2) : 'Not Available'}</p>
            //                 )
            //             }
            //         },
            //     },
            // ],







        }
    }


    postDriverForm = async () => {


        console.log('formdata  eka', this.state.formData);

        let res = await StockVerificationService.createStockVerification(this.state.formData);

        console.log("res", res);

        if (res.status == 200 || res.status == 201) {
            this.setState({
                isAssignTrue: true,
                alert: true,
                message: 'Employee Assign Successfully',
                severity: 'success',
            }, () => { this.setPage(0) })
        } else {
            this.setState({
                alert: true,
                message: 'Employee Assign Unsuccessful',
                severity: 'error',
            })
        }



    }

    // getDriverForm = async () => {




    //     let res = await StockVerificationService.getStockVerificationDetails(this.state.formData);

    //     if (res.status == 200) {
    //         console.log("getres", res);
    //     }



    // }




    async loadHospital(name_like) {
        let params_ward = { issuance_type: ['Hospital', 'RMSD Main', 'MSD Main'], search: name_like }
        let hospitals = await DashboardServices.getAllHospitals(params_ward);
        if (hospitals.status == 200) {
            console.log("all_hospitals", hospitals.data.view.data)
            this.setState({ all_hospitals: hospitals.data.view.data })
        }
    }

    // async loadHospitalEdit(name_like) {
    //     this.setState({ loadedHospital: false })
    //     let params_ward = { issuance_type: ['Hospital', 'RMSD Main', 'MSD Main'], search: name_like }
    //     let hospitals = await DashboardServices.getAllHospitals(params_ward);
    //     if (hospitals.status == 200) {
    //         console.log("edit hospital", hospitals.data.view.data[0].name)
    //         this.setState({ all_hospitals: hospitals.data.view.data[0].name, loadedHospital: true })
    //     }
    // }

    async loadEmployees() {
        this.setState({ loadedEmp: false })
        let res = await EmployeeServices.getEmployees(this.state.empData)
        console.log('res11', res);
        if (res.status == 200) {
            console.log("emp", res.data.view.data)
            this.setState({
                all_employee: res.data.view.data,
                totalEmp: res.data.view.totalItems,
                loadedEmp: true,
            })

            console.log("employees", res.data.view)
        }
    }

    async loadStockVerificationDetails() {
        this.setState({ loaded: false })
        let res = await StockVerificationService.getStockVerificationDetails(this.state.stockVerificationData)
        console.log('res22', res);
        if (res.status == 200) {

            console.log("select emp", res.data.view.data)
            this.setState({
                stock_verification_data: res.data.view.data,
                total_stock_verification_data: res.data.view.totalItems,
                loaded: true,
            })

            console.log("2nd time", res.data.view)

        }
    }

    async getSelectAssignEmployees(id) {
        this.setState({ loadedAssignEmp: false })
        let params = { stock_verification_id: id }
        let res = await StockVerificationService.getAssignEmployees(params)
        console.log('res33', res);
        if (res.status == 200) {

            console.log("select Assign Emp", res.data.view.data)
            this.setState({
                select_employees_data: res.data.view.data,
                total_select_employees_data: res.data.view.totalItems,
                loadedAssignEmp: true,
            })

            console.log("select employees", res.data.view)

        }
    }

    async getSelectAssignEmployeesForEdit(id) {

        this.setState({ loadedEmp: false })
        let params = { stock_verification_id: id }
        let res = await StockVerificationService.getAssignEmployees(params)
        console.log('res33', res);
        if (res.status == 200) {

            console.log("select Assign Emp", res.data.view.data)
            let formData = this.state.formData

            formData.employee_id = res.data.view.data.map((x) => x?.Employee?.id)
            this.setState({
                formData,
                loadedEmp: true,
            }, () => { this.scrollToViewContent() })

            console.log("Edit Employees", formData)

            console.log("select employees", res.data.view)

        }
    }

    async editStockVerification() {
        this.setState({ submitting: true })

        let formData = this.state.formData;

        let res = await StockVerificationService.EditStockVerification(this.state.editStockVerifcationId, formData)
        console.log("edit formdata", formData)
        console.log("edit formdata id", this.state.editStockVerifcationId)
        console.log("edit stock verifcation", res)
        if (res.status === 200) {
            this.setState({
                alert: true,
                message: 'Assign Employees Edit Successfully!',
                severity: 'success',
                submitting: false
            }
                , () => {
                    this.setEditPage(0)
                }
            )
        } else {
            this.setState({
                alert: true,
                message: 'Assign Employees Edit Unsuccessful!',
                severity: 'error',
                submitting: false
            })
        }
    }

    scrollToViewContent = () => {
        console.log('clicked')
        if (this.viewContentRef.current) {
            this.viewContentRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };



    componentDidMount() {
        this.loadEmployees()
        this.loadStockVerificationDetails()


    }

    async AddEmployees() {
        const [open, setOpen] = React.useState(false)

        const handleClickOpen = () => {
            setOpen(true)
        }

        const handleClose = () => {
            setOpen(false)
        }
    }

    async setPageEmp(page) {
        //Change paginations
        let empData = this.state.empData
        empData.page = page
        this.setState(
            {
                empData,
            },
            () => {
                this.loadEmployees()
            }
        )
    }

    async setPage(page) {
        //Change paginations
        let stockVerificationData = this.state.stockVerificationData
        stockVerificationData.page = page
        this.setState(
            {
                stockVerificationData,
            },
            () => {
                this.loadStockVerificationDetails()
            }
        )
    }

    async setEditPage(page) {
        let editData = this.state.editData
        editData.page = page
        this.setState({ editData }, () => { this.loadStockVerificationDetails() })
    }

    // async setPageSelectEmp(page) {
    //     //Change paginations
    //     let selectAssignEmpData = this.state.selectAssignEmpData
    //     selectAssignEmpData.page = page
    //     this.setState(
    //         {
    //             selectAssignEmpData,
    //         },
    //         () => {
    //             this.getSelectAssignEmployees()
    //         }
    //     )
    // }


    render() {

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>


                        <ValidatorForm
                            ref="form"
                            className="pt-2"
                            onSubmit={

                                () => { this.state.edit ? this.editStockVerification() : this.postDriverForm() }


                            }
                        >

                            <Grid ref={this.viewContentRef} id="viewContent">
                                <CardTitle title={"Assign Employees"} />
                            </Grid>

                            <Grid container item lg={12} md={12} sm={12} xs={12} spacing={1} className="pt-2" alignItems="center">



                                <Grid
                                    className="w-full" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Institution" />

                                    <Autocomplete

                                        disableClearable
                                        className="w-full"
                                        options={this.state.all_hospitals}

                                        //  }
                                        // onChange={(value) => {
                                        //     if (null != value) {
                                        //         let inst = this.state.formData
                                        //         inst.pharmacy_drugs_store_id = value
                                        //         this.setState({ inst })
                                        //         console.log('inst', inst)
                                        //     }
                                        // }}

                                        onChange={(
                                            e,
                                            value

                                        ) => {
                                            if (value != null) {
                                                console.log('value', value)
                                                let inst = this.state.formData
                                                inst.pharmacy_drugs_store_id = value.id
                                                this.setState({
                                                    inst,
                                                })
                                            }
                                        }}
                                        // value={this.state.all_hospitals.find((v) => v.id == this.state.formData.pharmacy_drugs_store_id) ? this.state.all_hospitals.find((v) => v.id == this.state.formData.pharmacy_drugs_store_id) : this.state.formData.edit_institution}

                                        getOptionLabel={(option) => (option && option.name ? (option.name + ' - ' + option?.Department?.name) : '')}
                                        // getOptionLabel={(
                                        //     option
                                        // ) =>
                                        //     option.name
                                        //         ? option.name
                                        //         : ''
                                        // }



                                        //     renderInput={(params) => (
                                        //         <TextValidator
                                        //             {...params}
                                        //             placeholder="Choose Institution"
                                        //             fullWidth
                                        //             variant="outlined"
                                        //             size="small"
                                        //             onChange={(e) => {
                                        //                 if (e.target.value.length >= 3) {
                                        //                     this.loadHospital(e.target.value)
                                        //                 }
                                        //             }}

                                        //         />
                                        //     )}


                                        renderInput={(
                                            params
                                        ) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Choose Institution"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={this.state.formData.edit_institution}

                                                onChange={(e, value) => {
                                                    if (e.target.value.length >= 3) {
                                                        this.loadHospital(e.target.value)
                                                    }
                                                }}
                                                required={true}
                                                // disabled={this.state.date_selection}
                                                errorMessages="this field is required"



                                            />
                                        )}

                                    />


                                </Grid>









                                <Grid
                                    className=" w-full" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="From Date:" />

                                    <DatePicker

                                        className="w-full"
                                        value={this.state.formData.from_date}
                                        format='dd-MM-yyyy'
                                        // placeholder={`⊕ ${text}`}
                                        // errorMessages="this field is required"


                                        onChange={(date) => {
                                            let fd = this.state.formData
                                            fd.from_date = dateParse(date)
                                            this.setState({ fd })
                                            console.log("date eka", fd);
                                        }}
                                        required={true}

                                        errorMessages="this field is required"

                                    />


                                </Grid>

                                <Grid
                                    className="w-full" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="To Date:" />

                                    <DatePicker

                                        className="w-full"
                                        value={this.state.formData.to_date}
                                        format='dd-MM-yyyy'
                                        // placeholder={`⊕ ${text}`}
                                        // errorMessages="this field is required"

                                        onChange={(date) => {
                                            let td = this.state.formData
                                            td.to_date = dateParse(date)
                                            this.setState({ td })
                                            console.log("date eka", td);
                                        }}

                                        required={true}

                                        errorMessages="this field is required"
                                    />


                                </Grid>

                                <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >


                                    <SubTitle title="Notify MSA / Store Pharmacist:" />

                                    {/* <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        defaultValue={this.state.formData.notify}
                                        name="row-radio-buttons-group"
                                    >

                                        <Grid className="flex">

                                            <FormControlLabel value="yes" name="yes"
                                                onChange={() => {
                                                    let ntfy = this.state.formData
                                                    ntfy.notify = "yes"
                                                    this.setState({ ntfy })

                                                }}
                                                control={<Radio />} label={<SubTitle title="Notify" />}
                                            />
                                            <FormControlLabel value="no" name="no"
                                                onChange={() => {
                                                    let ntfy = this.state.formData
                                                    ntfy.notify = "no"
                                                    this.setState({ ntfy })

                                                }}
                                                control={<Radio />} label={<SubTitle title="Do Not Notify" />} />


                                        </Grid>

                                    </RadioGroup> */}

                                    <RadioGroup defaultValue={this.state.formData.notify} row>
                                        {console.log("notify statment", this.state.formData.notify)}

                                        <FormControlLabel
                                            label='Notify'
                                            name="yes"
                                            value={true}

                                            onChange={() => {
                                                let formData = this.state.formData;
                                                formData.notify = true
                                                this.setState({ formData, })
                                            }}
                                            control={
                                                <Radio size='small' color="primary" />
                                            }
                                            display="inline"
                                            checked={

                                                this.state.formData.notify == true ? true : false

                                            }
                                            defaultChecked={this.state.formData.notify}
                                        />

                                        <FormControlLabel
                                            label='Do Not Notify'
                                            name="no"
                                            value={false}

                                            onChange={() => {
                                                let formData = this.state.formData;
                                                formData.notify = false
                                                this.setState({ formData, })
                                            }}
                                            control={
                                                <Radio size='small' color="primary" />
                                            }
                                            display="inline"
                                            checked={
                                                this.state.formData.notify == false ? true : false
                                            }
                                            defaultChecked={this.state.formData.notify}
                                        />


                                    </RadioGroup>


                                </Grid>

                                {/* <Grid
                                    className="w-full" item lg={4} md={4} sm={12} xs={12}
                                >

                                    <SubTitle title="Employee:" />


                                    <Grid
                                        className="flex w-full m-2"
                                    >


                                        <AddEmployees

                                            onChange={(
                                                e,
                                                value
                                            ) => {
                                                if (value != null) {
                                                    let empId = this.state.formData
                                                    empId.employee_id = value.id
                                                    this.setState({ empId })
                                                    console.log('empId', empId)
                                                }
                                            }}
                                            value={this.state.all_employee.find((v) => v.id == this.state.formData.employee_id
                                            )}

                                            getOptionLabel={(
                                                option
                                            ) =>
                                                option.name
                                                    ? option.name
                                                    : ''
                                            }
                                        />

                                        &nbsp;
                                        <SubTitle title="Add Employees" />


                                    </Grid>




                                </Grid> */}


                            </Grid>

                            {this.state.loadedEmp ?
                                <LoonsTable

                                    data={this.state.all_employee}
                                    columns={this.state.employee_list_column}
                                    options={{
                                        pagination: true,
                                        count: this.state.totalEmp,
                                        rowsPerPage: this.state.empData.limit,
                                        page: this.state.empData.page,
                                        serverSide: true,
                                        print: false,
                                        viewColumns: false,
                                        download: false,

                                        onTableChange: (action, tableState) => {
                                            console.log('action', action, tableState)
                                            switch (action) {
                                                case 'changePage':
                                                    this.setPageEmp(
                                                        tableState.page
                                                    )
                                                    break

                                                case 'sort':
                                                    // this.sort(tableState.page, tableState.sortOrder);
                                                    break
                                                default:
                                                    console.log(
                                                        'action not handled.'
                                                    )
                                            }
                                        },

                                    }}

                                >{ } </LoonsTable> : (
                                    //load loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )}

                            <Grid justifyContent="space-between" className=" w-full flex justify-start mt-2" item lg={12}
                                md={12} sm={12} xs={12}>




                                <Button
                                    className="mt-6 mr-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    disabled={this.state.isAssignTrue}

                                >


                                    <span className="capitalize">{this.state.buttonName}</span>
                                </Button>

                                <Button
                                    className="mt-6 mr-2"
                                    progress={false}
                                    scrollToTop={false}
                                    // startIcon=""
                                    onClick={() => {
                                        window.location.reload()
                                    }}
                                >
                                    <span className="capitalize">
                                        Clear
                                    </span>
                                </Button>

                            </Grid>

                            <Grid className="m-5"
                                container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                                sx={{ minHeight: '100vh' }}
                                item lg={12} md={12} sm={12} xs={12}>

                                {this.state.loaded ?
                                    <LoonsTable

                                        id={"clinicDetails"}
                                        data={this.state.stock_verification_data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.total_stock_verification_data,
                                            rowsPerPage: this.state.stockVerificationData.limit,
                                            page: this.state.stockVerificationData.page,

                                            onTableChange: (action, tableState) => {
                                                console.log('action', action, tableState)
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setPage(
                                                            tableState.page
                                                        )
                                                        break
                                                    case 'sort':
                                                        // this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    >{ }</LoonsTable> : (
                                        //load loading effect
                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30} />
                                        </Grid>
                                    )}

                            </Grid>


                        </ValidatorForm>

                        <ValidatorForm>
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



                                <MuiDialogTitle className="flex" style={{ justifyContent: 'space-between' }} disableTypography >
                                    <CardTitle title="Assign Employees" />
                                    <IconButton aria-label="close"

                                        onClick={() => {
                                            this.setState({
                                                confirmingDialog: false

                                            })
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </MuiDialogTitle>

                                <DialogContent>

                                    {this.state.loadedAssignEmp ?



                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.select_employees_data}
                                            columns={this.state.emp_columns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                print: false,
                                                viewColumns: false,
                                                download: false,
                                                count: this.state
                                                    .totalItems2,
                                                rowsPerPage: this.state.total_select_employees_data.limit,
                                                page: this.state.total_select_employees_data
                                                    .page,

                                                onTableChange: (
                                                    action,
                                                    tableState
                                                ) => {
                                                    console.log(
                                                        action,
                                                        tableState
                                                    )
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPageTwo(
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

                                        : (
                                            //load loading effect
                                            <Grid className="justify-center text-center w-full pt-12">
                                                <CircularProgress size={30} />
                                            </Grid>
                                        )}

                                </DialogContent>


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
                        </ValidatorForm>
                    </LoonsCard>






                </MainContainer>

            </Fragment >

        )

    }
}

export default AssignEmployees