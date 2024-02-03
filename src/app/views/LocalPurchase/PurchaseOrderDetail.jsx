import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import PrintIcon from '@mui/icons-material/Print';
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
    CircularProgress,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    Typography,
    Box,
} from '@material-ui/core'
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
import { dateTimeParse } from 'utils'
import VisibilityIcon from '@material-ui/icons/Visibility';
import PharmacyService from 'app/services/PharmacyService';
import PrescriptionService from 'app/services/PrescriptionService'
import HospitalConfigServices from 'app/services/HospitalConfigServices';
import localStorageService from 'app/services/localStorageService'
import SchedulesServices from 'app/services/SchedulesServices'
import { dateParse, yearParse } from 'utils'
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import POPrintView from './LPRequest/POPrintView';
import AddIcon from '@mui/icons-material/Add';
import EmployeeServices from 'app/services/EmployeeServices';
import LocalPurchaseServices from 'app/services/LocalPurchaseServices';
import ConsignmentService from 'app/services/ConsignmentService';
import ClinicService from 'app/services/ClinicService'
import InventoryService from 'app/services/InventoryService'


class PurchaseOrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            ploaded: false,
            role: null,
            totalItems: 0,
            purchaseOrderData: [],
            hospital: {},
            supplier: {},
            user: {},
            dpInstitution:[],

            filterData1: {
                limit: 20,
                page: 0,
                po_no: null,
                'order[0]': ['updatedAt', 'DESC'],
            },

            filterData: {
                search: null,
                status: null,
                type: null,
                page: 0,
                limit: 20,
                'order[0]': [
                    'updatedAt', 'DESC'
                ],
                from: null,
                to: null,
                year: null,
            },

            formData: {
                page: 0,
                limit: 20,
                'order[0]': [
                    'updatedAt', 'DESC'
                ],
            },

            userRoles: null,
            data: [],
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            console.log('chekin reqre data', this.state.data)
                            let po_no = this.state.data[dataIndex].po_no;
                            let order_list_id = this.state.data[dataIndex].id;
                            let supplier_id = this.state.data[dataIndex].supplier_id ? this.state.data[dataIndex].supplier_id : null
                            return (
                                <Grid className="px-2">
                                    <Tooltip title="View PO">
                                        <IconButton
                                            onClick={() => {
                                                {
                                                    window.location.href = `/purchase/purchase-details/${order_list_id}`
                                                }
                                            }}>
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                    {(this.state.userRoles.includes('MSD SCO') || this.state.userRoles.includes('MSD AD') || this.state.userRoles.includes('Chief Pharmacist') || this.state.userRoles.includes('Hospital Director') || this.state.userRoles.includes('RDHS') || this.state.userRoles.includes('Accounts Clerk RMSD') || this.state.userRoles.includes('Accounts Clerk Hospital')) ? null :
                                        <Tooltip title={(this.state.userRoles.includes('Drug Store Keeper') || this.state.userRoles.includes('RMSD OIC')) ? 'Create GRN' : 'Create Consignment'}>
                                            <IconButton
                                                onClick={() => {
                                                    if (supplier_id) {
                                                        window.location.href = `/spc/consignment/create/?po_no=${po_no}&id=${order_list_id}&supplier_id=${supplier_id}`
                                                    } else {
                                                        window.location.href = `/spc/consignment/create/?po_no=${po_no}&id=${order_list_id}`
                                                    }
                                                }}
                                                disabled={this.state.data[dataIndex]?.quantity - this.state.data[dataIndex]?.allocated_quantity <= 0}
                                                >
                                                {this.state.data[dataIndex]?.quantity - this.state.data[dataIndex]?.allocated_quantity <= 0 ? (
                                                    <AddIcon color='gray' /> 
                                                ) : (
                                                    <AddIcon color='primary' /> 
                                                )}
                                                {/* <AddIcon color='primary' />  */}
                                                {/* disabled={(this.state.data[dataIndex]?.quantity - this.state.data[dataIndex]?.allocated_quantity) >= 0} */}
                                                {/* this.state.data[dataIndex]?.quantity - this.state.data[dataIndex]?.allocated_quantity */}
                                            </IconButton>
                                        </Tooltip>
                                    }
                                    {/* purchase order button */}
                                    {/* <PurchaseOrderList purchaseId={this.state.data[dataIndex].id} /> */}
                                    { this.state.userRoles.includes('RMSD OIC') ? null :
                                    <Tooltip title="Print Data">
                                        <IconButton
                                            onClick={() => this.printData(dataIndex)}
                                        >
                                            <PrintIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                    }
                                </Grid>
                            )

                        },
                    }
                },
                {
                    name: 'po_no',
                    label: 'PO number',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'order_no',
                    label: 'Order List number',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'type',
                    label: 'Type',
                    options: {
                        display: false,
                    },
                },
                {
                    name: 'no_of_items',
                    label: 'No Of Items',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'order_qty',
                    label: 'Order Qty',
                    options: {
                        
                        customBodyRenderLite: (dataIndex) => {
                            return (this.state.data[dataIndex]?.quantity)
                        }
                    }
                },
                {
                    name: 'pending_qty',
                    label: 'Pending Qty',
                    options: {
                        
                        customBodyRenderLite: (dataIndex) => {
                            return (this.state.data[dataIndex]?.quantity - this.state.data[dataIndex]?.allocated_quantity)
                        }
                    }
                },
                {
                    name: 'order_for_year',
                    label: 'Order for Year',
                    options: {
                        display: false,
                    },
                },
                {
                    name: 'order_date',
                    label: 'Requested Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return dateParse(this.state.data[dataIndex]?.order_date)
                        }
                    }
                },
                {
                    name: 'order_date_to',
                    label: 'Required Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            // console.log('checking data',this.state.data )
                            return dateParse(this.state.data[dataIndex]?.order_date_to)
                        }
                    }
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                    },
                }
            ]


        }
    }


    // filter function
    async loadOrder() { 
        this.setState({ loaded: false, cartStatus: [] })
        this.state.filterData = { ...this.state.filterData }
        
        let res = await SchedulesServices.getOrderList(this.state.filterData)
        console.log("form data", res)
        //let order_id = 0
        if (res.status) {
            this.setState({
                data: res.data.view.data,
                loaded: true,
                totalItems: res.data.view.totalItems,
            }, () => {
                this.render()
                // this.getCartItems()
            })
        }
    }


    // search function
    loadOrderList = (event) => {
        const { value } = event.target;
        const filterData = this.state.data.filter((item) =>
            item.order_no.toLowerCase().includes(value.toLowerCase())
        );
        this.setState({ search: value, filterData });
    };


    // async getPurchaseOrderById(){

    //     // let id = "0ce64050-7ccc-4f89-a7fa-338a1b6248ba"
    //     let res = await PrescriptionService.NP_Orders_By_Id({},this.props.purchaseId)

    //     if (res.status === 200) {
    //         console.log("purchesOrder", res.data.view)
    //         // console.log("po", res.data.view.POItem[0].item)

    //         this.setState({data:res.data.view})
    //     }
    // }

    async getHospital(owner_id) {
        let params = { issuance_type: 'Hospital' }
        let durgStore_res = await PharmacyService.fetchAllDataStorePharmacy(owner_id, params)
        if (durgStore_res.status == 200) {
            console.log('hospital', durgStore_res.data.view.data)
            this.setState({ hospital: durgStore_res?.data?.view?.data[0] })
        }
    }

    async getSupplier(sup_id, order_id) {

            // let supplier_res = await HospitalConfigServices.getAllSupplierByID(id)
            console.log('supplier-id', sup_id, order_id)

            let params = {
                lp_request_id:order_id,
                supplier_id : sup_id
            }
            let supplier_res = await LocalPurchaseServices.getLPSupplierDet(params)
            if (supplier_res.status === 200) {
                console.log('supplier', supplier_res.data.view)
                this.setState({ supplier: supplier_res?.data?.view.data })
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

    async printData(id) {

        let data = this.state.data[id].id
        let lpLequestId = this.state.data[id].lp_request_id
        let supplierId = this.state.data[id].supplier_id
        this.setState({ printLoaded: false })
        console.log('clicked', data)

        let res = await PrescriptionService.NP_Orders_By_Id({}, data)

        if (res.status === 200) {
            console.log('pdata', res.data.view)
            await this.getHospital(res.data.view?.owner_id)
            await this.getSupplier(supplierId, lpLequestId)
            await this.getUser()
            await this.getUOMByID(res.data.view)
           
            // console.log('Print Data', this.state.printData)
        }

        
    }

    async getUOMByID(data){
        // console.log('item-sssssssssssss----data', data)
        let id = data?.POItem?.map((e)=>e?.item?.id)

        let params={
            item_id:id
        }

        const res = await InventoryService.GetUomById(params)

        let updatedArray = []
        if(res.status === 200) {
            console.log('item-----data', res)

            updatedArray = data?.POItem.filter((obj1) => {
                const obj2 = res.data.view.data.find((obj) => obj.ItemSnap?.id === obj1.item?.id);

                obj1.uom = obj2?.UOM?.name

                 return obj1;

            });
            data.POItem = updatedArray;
            console.log('item-sssssssssssss----data', data)
            this.setState({
                ploaded: true,
                printLoaded: true,
                purchaseOrderData: data
            },
            () => {
                // this.render()
                document.getElementById('print_presc_004').click()
                // this.getCartItems()
            })
            
        }
        this.setState({ showLoading: true });

        setTimeout(() => {
            this.setState({ showLoading: false, ploaded: false,printLoaded: false, });
        }, 5000);
    }


    async detDPInstitution (){

        var info = await localStorageService.getItem('login_user_pharmacy_drugs_stores');
        let login_user_district = info[0]?.Pharmacy_drugs_store?.district

        let params = {
            issuance_type: ["RMSD Main"],
            'order[0]': ['createdAt', 'ASC'],
            district: login_user_district,
            // limit:1,
        };

        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('cheking institjhjj', res)
            this.setState({
                dpInstitution:res.data.view.data
            }, ()=>{
                this.loadList()
            })
            
        }
    }

    async loadList() {
        this.setState({ loaded: false })

        let filterData = this.state.filterData
        let owner_id = await localStorageService.getItem('owner_id')
        var user_info = await localStorageService.getItem('userInfo');
        console.log('gdgdggdgdgdgdg',owner_id )

        this.setState({ userRoles: user_info.roles })

        if (user_info.roles.includes('Drug Store Keeper') || user_info.roles.includes('Medical Laboratory Technologist') || user_info.roles.includes('Radiographer') || user_info.roles.includes('Chief Pharmacist') || user_info.roles.includes('Hospital Director') || user_info.roles.includes('RMSD OIC')){
            // filterData.type = 'lprequest'
            filterData.owner_id = owner_id
        } else if (user_info.roles.includes('RDHS')){
            let owner_id_list = this.state.dpInstitution.map((dataset) => dataset?.owner_id)
            let uniquOwnerrIds = [...new Set(owner_id_list)]
            filterData.owner_id = uniquOwnerrIds
        }
        filterData.type = 'lprequest'
        this.setState({ filterData })

        // let res = await SchedulesServices.getOrderList(filterData)
        let res = await PrescriptionService.NP_Orders(filterData)
        
        console.log('cheking reds data', res)
        if (res.status === 200) {
            this.setState({
                // data: res.data.view.data,
                // loaded: true,
                totalItems: res.data.view.totalItems
            })

            let itemslist = res.data.view.data.map((dataset) => dataset.id)
            this.getQty(itemslist, res.data.view.data)
        }

        // this.setState({ loaded: true })
    }

      // this is made for get order qty and pending qty for table
      async getQty (po, mainData){

        let filterData = this.state.filterData1; 
        filterData.po_id = po

        let res = await ConsignmentService.getConsignmentOrderList(filterData)
        let updatedArray = []
        if (res.status === 200){
            console.log('checking po qty')
            updatedArray = mainData.map((obj1) => {
            const obj2 = res.data.view.data.find((obj) => obj?.Order_item?.purchase_order?.id === obj1.id);

                 obj1.allocated_quantity = obj2?.allocated_quantity
                 obj1.quantity = obj2?.quantity
                
                return obj1;
            });
        }

        this.setState(
            {
                data: updatedArray,
                loaded: true,
            }
        )

        console.log('dhddhhdggd gdggd gdgdgd gdgdg', this.state.data )
    }


    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {
            this.loadList()
        })
    }

    async componentDidMount() {
        let role = await localStorageService.getItem('userInfo').roles
        this.setState({
            userRoles: role
        }, () => {
            // this.loadList()
            this.detDPInstitution()
        })
    }

    render() {
        return (
            <MainContainer>
                <LoonsCard>
                    <CardTitle title={"Purchase Order Details"} />
                    <ValidatorForm onSubmit={() => this.loadList()}>
                        <Grid container="container" spacing={2} className='mt-2'>
                            {/* filter by status */}
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                <SubTitle title={"Status"}></SubTitle>
                                <Autocomplete
                                    disableClearable
                                    className="w-full"
                                    options={appConst.order_list_status}
                                    /*  defaultValue={dummy.find(
                                        (v) => v.value == ''
                                    )} */
                                    getOptionLabel={(option) => option.value}
                                    getOptionSelected={(option, value) =>
                                        console.log("ok")
                                    }
                                    onChange={(event, value) => {
                                        let filterData = this.state.filterData
                                        if (value != null) {

                                            filterData.status = value.value

                                        } else {
                                            filterData.status = null
                                        }
                                        this.setState({ filterData })
                                    }}
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
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    )}
                                />

                            </Grid>
                            {/* filter by Type */}
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                <SubTitle title={"Type"}></SubTitle>
                                <Autocomplete
                                    disableClearable
                                    className="w-full"
                                    options={appConst.order_list_catogory}
                                    getOptionLabel={(option) => option.label}
                                    getOptionSelected={(option, value) =>
                                        console.log("ok")
                                    }
                                    onChange={(event, value) => {
                                        let filterData = this.state.filterData
                                        if (value != null) {

                                            filterData.type = value.value

                                        } else {
                                            filterData.status = null
                                        }
                                        this.setState({ filterData })
                                    }}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Type"
                                            //variant="outlined"
                                            //value={}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            size="small"
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    )}
                                />

                            </Grid>
                            {/* form */}
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                <SubTitle title="Date From" />
                                <DatePicker
                                    className="w-full mt-1"
                                    value={this.state.filterData.from}
                                    variant="outlined"
                                    placeholder="Date From"
                                    onChange={(date) => {
                                        let filterData = this.state.filterData;
                                        filterData.from = dateParse(date);
                                        this.setState({ filterData });
                                    }}
                                />
                            </Grid>
                            {/* to */}
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                <SubTitle title="Date To" />
                                <DatePicker
                                    className="w-full mt-2"
                                    value={this.state.formData.to}
                                    variant="outlined"
                                    placeholder="Date To"
                                    onChange={(date) => {
                                        let filterData = this.state.filterData;
                                        filterData.to = dateParse(date);
                                        this.setState({ filterData });
                                    }}
                                />
                            </Grid>
                            {/* year */}
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                <SubTitle title="Year" />
                                <DatePicker
                                    className="w-full mt-2"
                                    value={this.state.formData.year}
                                    variant="outlined"
                                    placeholder="Year"
                                    onChange={(date) => {
                                        let filterData = this.state.filterData;
                                        filterData.year = yearParse(date);
                                        this.setState({ filterData });
                                    }}
                                />
                            </Grid>

                            <Grid
                                item="item" lg={3} md={3} sm={12} xs={12} className=" w-full flex justify-start p-0">
                                {/* Submit Button */}
                                <LoonsButton className="mt-8 mr-2" progress={false} type='submit'
                                    //onClick={this.handleChange}
                                    style={{ height: "30px", width: "100px" }}
                                >
                                    <span className="capitalize">
                                        {
                                            this.state.isUpdate
                                                ? 'Update'
                                                : 'Filter'
                                        }
                                    </span>
                                </LoonsButton>

                            </Grid>

                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-5 mt-5 p-0">

                                <TextValidator className='' placeholder="Search"
                                    //variant="outlined"
                                    fullWidth="fullWidth" variant="outlined" size="small"
                                    // value={this.state.formData.search}
                                    value={this.state.filterData.search}
                                    onChange={(e) => {
                                        let filterData = this.state.filterData;
                                        filterData.search = e.target.value;
                                        this.setState({ filterData });
                                    }}
                                    // validators={[
                                    //     'required',
                                    // ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon onClick={() => { this.loadList() }}></SearchIcon>
                                            </InputAdornment>
                                        )
                                    }} />

                            </Grid>

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
                        </Grid>
                    </ValidatorForm>

                    {this.state.loaded ?
                        <LoonsTable
                            id={'completed'}
                            data={this.state.filterData.length ? this.state.filterData : this.state.data}
                            columns={this.state.columns}
                            options={{
                                pagination: true,
                                serverSide: true,
                                count: this.state.totalItems,
                                // count: 10,
                                rowsPerPage: this.state.filterData.limit,
                                page: this.state.filterData.page,
                                print: true,
                                viewColumns: true,
                                download: true,
                                rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                onTableChange: (action, tableState) => {
                                    console.log(action, tableState)
                                    switch (action) {
                                        case 'changePage':
                                            this.setPage(tableState.page)
                                            break
                                        case 'changeRowsPerPage':
                                            let formData = this.state.filterData;
                                            formData.limit = tableState.rowsPerPage;
                                            this.setState({ formData })
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
                        : (
                            //load loading effect
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress size={30} />
                            </Grid>
                        )}

                </LoonsCard>
            </MainContainer>
        )
    }
}

export default PurchaseOrderDetail