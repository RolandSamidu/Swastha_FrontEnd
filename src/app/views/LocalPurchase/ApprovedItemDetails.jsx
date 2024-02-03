import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    InputAdornment,
    IconButton,
    Icon,
    Typography,
    CircularProgress
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import localStorageService from 'app/services/localStorageService'
import LocalPurchaseServices from 'app/services/LocalPurchaseServices'
import HospitalConfigServices from 'app/services/HospitalConfigServices'
import InventoryService from 'app/services/InventoryService'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import POPrintView from './LPRequest/POPrintView'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import SearchIcon from '@mui/icons-material/Search';
import { dateParse } from 'utils'
import PharmacyService from 'app/services/PharmacyService'
import PrescriptionService from 'app/services/PrescriptionService'

import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import EmployeeServices from 'app/services/EmployeeServices'

const styleSheet = (theme) => ({})

const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", text = "Add", tail = null }) => (
    <Autocomplete
        disableClearable
        options={options}
        getOptionLabel={getOptionLabel}
        // id="disable-clearable"
        onChange={onChange}
        value={val}
        size='small'
        renderInput={(params) => (
            < div ref={params.InputProps.ref} style={{ display: 'flex', position: 'relative' }}>
                <input type="text" {...params.inputProps}
                    style={{ marginTop: '5.5px', padding: '6.5px 10px', border: '1px solid #e5e7eb', borderRadius: 4 }}
                    placeholder={`⊕ ${text}`}
                    onChange={onChange}
                    value={val}
                // required
                />
                {tail ? <div
                    style={{
                        position: 'absolute',
                        top: '7.5px',
                        right: 8,
                    }}
                    onClick={null}
                >
                    {tail}
                </div> : null}
            </div >
        )}
    />)

class ApprovedItemDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            role: null,
            userRoles: [],
            data: [],
            hospital: {},
            supplier: {},
            user: {},

            totalItems: 0,
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            // let po_no = this.state.data[dataIndex].MSDPurchaseOrder.po_no;
                            let order_list_id = this.state.data[dataIndex].purchase_order_id;
                            let table_id = this.state.data[dataIndex].id
                            let sequence = this.state.data[dataIndex].sequence
                            return (
                                <Grid className="px-2">
                                    <IconButton
                                        onClick={() => {
                                            {
                                                window.location.href = `/purchase/purchase-details/${order_list_id}?approve=true&table_id=${table_id}&sequence=${sequence}`
                                            }
                                        }}>
                                        <VisibilityIcon color='primary' />
                                    </IconButton>
                                    {/* purchase order button */}
                                    {/* <PurchaseOrderList purchaseId={this.state.data[dataIndex].id} /> */}
                                    <IconButton
                                        onClick={() => this.printData(order_list_id)}
                                    >
                                        <PrintIcon color="primary" />
                                    </IconButton>
                                </Grid>
                            )

                        },
                    }
                },
                {
                    name: 'order_no',
                    label: 'Order List number',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.MSDPurchaseOrder.order_no;

                            return (
                                <p>{data}</p>
                            );
                        }
                    },
                },
                {
                    name: 'type',
                    label: 'Type',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'no_of_items',
                    label: 'No Of Items',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.MSDPurchaseOrder.no_of_items;

                            return (
                                <p>{data}</p>
                            );
                        }
                    },
                },
                {
                    name: 'order_for_year',
                    label: 'Order for Year',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.MSDPurchaseOrder.order_for_year;

                            return (
                                <p>{data}</p>
                            );
                        }
                    },
                },
                {
                    name: 'order_date',
                    label: 'Order Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.MSDPurchaseOrder.order_date;

                            return data ? dateParse(data) : "Not Available"
                        }
                    }
                },
                {
                    name: 'order_date_to',
                    label: 'Order Date To',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.MSDPurchaseOrder.order_date_to;
                            return data ? dateParse(data) : "Not Available"
                        }
                    }
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.MSDPurchaseOrder.status;

                            return (
                                <p>{data}</p>
                            );
                        }
                    },
                }
            ],

            alert: false,
            message: '',
            severity: 'success',

            patient_pic: null,
            all_district: [],
            all_moh: [],
            all_phm: [],
            all_gn: [],

            loading: false,
            filterData: {
                sr_no: null,
                item_id: null,
                item_name: null,
                request_id: null,
                supplier_id: null,
                procurement_no: null,
            },

            all_Consultants: [],
            all_Suppliers: [],

            itemList: [],

            formData: {
                page: 0,
                limit: 20,
                'order[0]': ['updatedAt', 'DESC'],
                // item_id: this.props.match.params.item_id
            },
        }
    }

    async getHospital(owner_id) {
        let params = { issuance_type: 'Hospital' }
        if (owner_id) {
            let durgStore_res = await PharmacyService.fetchAllDataStorePharmacy(owner_id, params)
            if (durgStore_res.status == 200) {
                console.log('hospital', durgStore_res.data.view.data)
                this.setState({ hospital: durgStore_res?.data?.view?.data[0] })
            }
        }
    }

    async getSupplier(id) {
        if (id) {
            let supplier_res = await HospitalConfigServices.getAllSupplierByID(id)
            if (supplier_res.status == 200) {
                console.log('supplier', supplier_res.data.view)
                this.setState({ supplier: supplier_res?.data?.view })
            }
        }
    }

    async getUser() {
        let id = await localStorageService.getItem('userInfo').id
        if (id) {
            let user_res = await EmployeeServices.getEmployeeByID(id)
            if (user_res.status == 200) {
                console.log('User', user_res.data.view)
                this.setState({ user: user_res?.data?.view })
            }
        }
    }

    async printData(purchaseId) {
        this.setState({ printLoaded: false })
        console.log('clicked', purchaseId)

        let res = await PrescriptionService.NP_Orders_By_Id({}, purchaseId)

        if (res.status === 200) {
            console.log('pdata', res.data.view)
            await this.getHospital(res.data.view.owner_id)
            await this.getSupplier(res.data.view.supplier_id)
            await this.getUser()
            this.setState(
                {
                    ploaded: true,
                    purchaseOrderData: res.data.view,
                    printLoaded: true,
                    // totalItems: res.data.view.totalItems,
                },
                () => {
                    // this.render()
                    document.getElementById('print_presc_004').click()
                    // this.getCartItems()
                }
            )
            // console.log('Print Data', this.state.printData)
        }
    }

    async loadAllSuppliers(search) {
        let params = { search: search }

        let res = await HospitalConfigServices.getAllSuppliers(params)
        if (res.status) {
            console.log("all Suppliers", res.data.view.data)
            this.setState({
                all_Suppliers: res.data.view.data,
            })
        }
    }

    async loadAllConsultant(search) {
        let params = { search: search, type: "Consultant" }

        let res = await EmployeeServices.getEmployees(params)
        if (res.status) {
            console.log("All Consultants", res.data.view.data)
            this.setState({
                all_Consultants: res.data.view.data,
            })
        }
    }

    loadItemData = async () => {
        let formData = this.state.filterData
        if (formData.item_name && formData.item_name.length > 3) {
            let res = await InventoryService.fetchAllItems({ search: formData.item_name,/*  is_prescrible: "true", limit: 10, page: 0, */ 'order[0]': ['sr_no', 'ASC'] })
            if (res.status === 200) {
                this.setState({ itemList: res.data.view.data });
            }
        } else if (formData.sr_no && formData.sr_no.length > 3) {
            let res = await InventoryService.fetchAllItems({ search: formData.sr_no,/*  is_prescrible: "true", limit: 10, page: 0,  */'order[0]': ['sr_no', 'ASC'] })
            if (res.status === 200) {
                this.setState({ itemList: res.data.view.data });
            }
        }
    }

    async loadData() {
        //function for load initial data from backend or other resources
        let owner_id = await localStorageService.getItem('owner_id')
        this.setState({ loading: false });
        const newFormData = { ...this.state.formData, role: this.state.userRoles[0], owner_id: owner_id }

        let res = await LocalPurchaseServices.getLPPOApprovals(newFormData)

        if (res.status === 200) {
            console.log('LP Data: ', res.data.view.data);
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems })
        }

        this.setState({ loading: true })
    }

    async saveStepOneSubmit() { }

    async SubmitAll() {
        // let formData = this.state.formData
        // formData.age =
        //     formData.age_all.years +
        //     '-' +
        //     formData.age_all.months +
        //     '-' +
        //     formData.age_all.days

        // let res = await PatientServices.createNewPatient(formData)
        // if (res.status == 201) {
        //     this.setState({
        //         alert: true,
        //         message: 'Patient Registration Successful',
        //         severity: 'success',
        //     })
        // } else {
        //     this.setState({
        //         alert: true,
        //         message: 'Patient Registration Unsuccessful',
        //         severity: 'error',
        //     })
        // }
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New formdata", this.state.formData)
            this.loadData()
        })
    }

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState({ files: files }, () => {
            console.log('files', this.state.files)
        })
    }

    async componentDidMount() {
        let role = await localStorageService.getItem('userInfo').roles
        this.setState({
            userRoles: role
        }, () => {
            this.loadData()
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.filterData.item_name !== this.state.filterData.item_name || prevState.filterData.sr_no !== this.state.filterData.sr_no) {
            this.loadItemData();
        }
        // if (prevState.filterData.item_name !== this.state.filterData.item_name || prevState.filterData.sr_no !== this.state.filterData.sr_no) {
        //     this.loadItemData();
        // }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <CardTitle title="View All Local Purchases" />
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.SubmitAll()}
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid container spacing={2} direction="row">
                                {/* Filter Section */}
                                <Grid item xs={12} className='mb-10' sm={12} md={12} lg={12}>
                                    {/* Item Series Definition */}
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <Grid container spacing={2}>
                                                {/* Serial Number*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Request ID" />
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Request ID"
                                                        name="request_id"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.filterData
                                                                .request_id
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    request_id:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <SearchIcon></SearchIcon>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    // validators={[
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                    />
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="SR Number" />
                                                    <AddInput
                                                        options={this.state.itemList}
                                                        val={this.state.filterData.sr_no}
                                                        getOptionLabel={(option) => option.sr_no || ""}
                                                        text='Sr No'
                                                        tail={<ArrowDropDownIcon />}
                                                        onChange={(e, value) => {
                                                            const newFormData = {
                                                                ...this.state.filterData,
                                                                sr_no: e.target.textContent ? e.target.textContent : e.target.value,
                                                                item_id: value ? value.id : null,
                                                                item_name: value ? value.medium_description : '',

                                                            };
                                                            // formData.item_id = value ? value.id : null;
                                                            this.setState({ filterData: newFormData }, () => {
                                                                console.log("DATA :", this.state.filterData)
                                                            });

                                                            // if (e.target.value === '') {
                                                            //     let formData = this.state.formData;
                                                            //     formData.sr_no = null;
                                                            //     formData.item_id = null;
                                                            //     console.log("Value: 0")

                                                            //     this.setState({ formData })
                                                            //     // if (formData.item_id) {
                                                            //     //     formData.item_name = value ? value.medium_description : null;
                                                            //     // }
                                                            // }
                                                        }
                                                        }
                                                    />
                                                </Grid>
                                                {/* Name*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Item Name" />
                                                    <AddInput
                                                        options={this.state.itemList}
                                                        val={this.state.filterData.item_name}
                                                        getOptionLabel={(option) => option.medium_description || ""}
                                                        text='Item Name'
                                                        tail={<ArrowDropDownIcon />}
                                                        onChange={(e, value) => {
                                                            const newFormData = {
                                                                ...this.state.filterData,
                                                                item_name: e.target.textContent ? e.target.textContent : e.target.value,
                                                                item_id: value ? value.id : null,
                                                                sr_no: value ? value.sr_no : '',

                                                            };
                                                            // formData.item_id = value ? value.id : null;
                                                            this.setState({ filterData: newFormData }, () => {
                                                                console.log("DATA :", this.state.filterData)
                                                            });

                                                            // if (e.target.value === '') {
                                                            //     let formData = this.state.formData;
                                                            //     formData.sr_no = null;
                                                            //     formData.item_id = null;
                                                            //     console.log("Value: 0")

                                                            //     this.setState({ formData })
                                                            //     // if (formData.item_id) {
                                                            //     //     formData.item_name = value ? value.medium_description : null;
                                                            //     // }
                                                            // }
                                                        }
                                                        }
                                                    />
                                                </Grid>
                                                {/* Short Reference*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Supplier Name" />
                                                    <Autocomplete
                                                        disableClearable
                                                        className="w-full"
                                                        options={this.state.all_Suppliers}
                                                        getOptionLabel={(option) => option.name}
                                                        value={this.state.all_Suppliers.find((v) => v.id == this.state.filterData.supplier_id)}
                                                        onChange={(event, value) => {
                                                            let formData = this.state.filterData
                                                            if (value != null) {
                                                                formData.supplier_id = value.id
                                                            } else {
                                                                formData.supplier_id = null
                                                            }
                                                            this.setState({ formData })
                                                        }

                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Supplier"
                                                                //variant="outlined"
                                                                //value={}
                                                                onChange={(e) => {
                                                                    if (e.target.value.length > 2) {
                                                                        this.loadAllSuppliers(e.target.value)
                                                                    }
                                                                }}
                                                                value={this.state.all_Suppliers.find((v) => v.id == this.state.filterData.supplier_id)}
                                                                fullWidth
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                variant="outlined"
                                                                size="small"
                                                                validators={['required']}
                                                                errorMessages={['this field is required']}
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                {/* Description*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Procurement No" />
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Procurement No"
                                                        name="procurement_no"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.filterData
                                                                .procurement_no
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    procurement_no:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <SearchIcon></SearchIcon>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    // validators={[
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                    />
                                                </Grid>
                                                {/* Submit and Cancel Button */}
                                                <Grid
                                                    style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <Grid container spacing={2}>
                                                        <Grid
                                                            item
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            xs={12}
                                                            className=" w-full flex justify-end"
                                                        >
                                                            {/* Submit Button */}
                                                            <Button
                                                                className="mt-2"
                                                                progress={false}
                                                                type="submit"
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                startIcon="search"
                                                            //onClick={this.handleChange}
                                                            >
                                                                <span className="capitalize">
                                                                    Search
                                                                </span>
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <br />
                                {/* Table Section */}
                                {this.state.loading ?
                                    <Grid container className="mt-5 pb-5">
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'}
                                                data={this.state.data}
                                                columns={this.state.columns}
                                                options={{
                                                    pagination: true,
                                                    count: this.state.totalItems,
                                                    rowsPerPage: this.state.formData.limit,
                                                    page: this.state.formData.page,
                                                    serverSide: true,
                                                    print: true,
                                                    viewColumns: true,
                                                    download: true,
                                                    rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
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
                                                                this.setPage(
                                                                    tableState.page
                                                                )
                                                                break
                                                            case 'changeRowsPerPage':
                                                                let formaData = this.state.formData;
                                                                formaData.limit = tableState.rowsPerPage;
                                                                this.setState({ formaData })
                                                                this.setPage(0)
                                                                break;
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
                                    :
                                    (
                                        <Grid className='justify-center text-center w-full pt-12'>
                                            <CircularProgress size={30} />
                                        </Grid>
                                    )
                                }
                            </Grid>
                        </ValidatorForm>
                        <Grid>
                            {this.state.ploaded ?
                                // <PurchaseOrderList />
                                <POPrintView purchaseOrderData={this.state.purchaseOrderData} hospital={this.state.hospital} supplier={this.state.supplier} user={this.state.user} />
                                :
                                <Grid className="justify-center text-center w-full pt-12">
                                    {/* <CircularProgress size={30} /> */}
                                </Grid>
                            }
                        </Grid>
                    </LoonsCard>
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

export default withStyles(styleSheet)(ApprovedItemDetails)
