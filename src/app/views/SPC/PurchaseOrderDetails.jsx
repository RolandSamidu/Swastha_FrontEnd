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
import ConsignmentService from 'app/services/ConsignmentService'
import DistributionCenterServices from 'app/services/DistributionCenterServices'
import PrescriptionService from 'app/services/PrescriptionService'
import InventoryService from 'app/services/InventoryService'
import localStorageService from 'app/services/localStorageService'
import SchedulesServices from 'app/services/SchedulesServices'
import { dateParse, yearParse } from 'utils'
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import PurchaseOrderList from './Print/PurchesOrder'; 
import AddIcon from '@mui/icons-material/Add';


class PurchaseOrderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            ploaded: false,
            role: null,
            totalItems: 0,
            purchaseOrderData: [],
            username:null,
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
                                    {(this.state.userRoles.includes('MSD SCO') || this.state.userRoles.includes('MSD AD') || this.state.userRoles.includes('Chief Pharmacist') || this.state.userRoles.includes('Hospital Director')) ? null :
                                        <Tooltip title={this.state.userRoles.includes('Drug Store Keeper') ? 'Create GRN' : 'Create Consignment'}>
                                            <IconButton
                                                onClick={() => {
                                                    if (supplier_id) {
                                                        window.location.href = `/spc/consignment/create/?po_no=${po_no}&id=${order_list_id}&supplier_id=${supplier_id}`
                                                    } else {
                                                        window.location.href = `/spc/consignment/create/?po_no=${po_no}&id=${order_list_id}`
                                                    }
                                                }}>
                                                <AddIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                    {/* purchase order button */}
                                    {/* <PurchaseOrderList purchaseId={this.state.data[dataIndex].id} /> */}
                                    <Tooltip title="Print Data">
                                        <IconButton
                                            onClick={() => this.printData(this.state.data[dataIndex].id)}
                                        >
                                            <PrintIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
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
                    },
                },
                {
                    name: 'po_no',
                    label: 'PO No',
                    options: {
                        display: true,
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
                    },
                },
                {
                    name: 'order_for_year',
                    label: 'Order for Year',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'order_date',
                    label: 'Order Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return dateParse(this.state.data[dataIndex].order_date)
                        }
                    }
                },
                {
                    name: 'order_date_to',
                    label: 'Order Date To',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return dateParse(this.state.data[dataIndex].order_date_to)
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
        console.log("form data", this.state.filterData)
        let res = await SchedulesServices.getOrderList(this.state.filterData)
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

    async printData(purchaseId) {
        this.setState({ printLoaded: false })
        console.log('clicked', purchaseId)

        let res = await PrescriptionService.NP_Orders_By_Id({}, purchaseId)

        
        if (res.status === 200) {
            console.log('pdata', res.data.view)

            this.getUOMByID(res.data.view)
    
        }
    }


    // get uom info
    async getUOMByID(data){

        let list = data.POItem.map((i)=>i.item.id)

        let params={
            item_snap_id:list
        }

        const res = await InventoryService.GetUomById(params)

            let updatedArray = []
            if(res.status === 200) {

            updatedArray = data?.POItem.filter((obj1) => {
                const obj2 = res.data.view.data.find((obj) => obj.ItemSnap?.id === obj1.item?.id);

                obj1.uom = obj2?.UOM?.name

                 return obj1;

            });
            data.POItem = updatedArray;
            }
            
            this.setState(
                {
                    ploaded: true,
                    purchaseOrderData: data,
                    printLoaded: true,
                    // totalItems: res.data.view.totalItems,
                },
                () => {
                    // this.render()
                    document.getElementById('print_presc_004').click()
                }
            )

            this.setState({ showLoading: true });

            setTimeout(() => {
                this.setState({ showLoading: false });
            }, 5000);
}


    async loadList() {
        this.setState({ loaded: false })

        let filterData = this.state.filterData
        let owner_id = await localStorageService.getItem('owner_id')
        var user_info = await localStorageService.getItem('userInfo');

        // console.log('user_info',user_info)
        this.setState({ userRoles: user_info.roles, username:user_info.name })
        filterData.owner_id = owner_id
        if (user_info.roles.includes('Drug Store Keeper') || user_info.roles.includes('Medical Laboratory Technologist') || user_info.roles.includes('Radiographer') || user_info.roles.includes('Chief Pharmacist') || user_info.roles.includes('Hospital Director')) {
            filterData.type = 'lprequest'
            filterData.owner_id = owner_id
        } else {
            if (user_info.roles.includes('Local Manufacturer') ) {
                
            }else if (user_info.roles.includes('SPC MA') || user_info.roles.includes('SPC MA')) {
                filterData.agent_type = "SPC"
            }
            else {
                filterData.agent_type = "MSD"
            }
        }

        this.setState({ filterData })

        // let res = await SchedulesServices.getOrderList(filterData)
        let res = await PrescriptionService.NP_Orders(filterData)
        if (res.status) {
            this.setState({
                data: res.data.view.data,
                loaded: true,
                totalItems: res.data.view.totalItems
            })
        }

        this.setState({ loaded: true })
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
            this.loadList()
        })
    }

    render() {
        return (
            <MainContainer>
                <LoonsCard>
                    <CardTitle title={"Purchase Order Details"} />
                    <ValidatorForm onSubmit={() => this.setPage(0)}>
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
                                                <SearchIcon onClick={() => { this.setPage(0) }}></SearchIcon>
                                            </InputAdornment>
                                        )
                                    }} />

                            </Grid>

                            <Grid>
                                {this.state.ploaded ?

                                    <PurchaseOrderList purchaseOrderData={this.state.purchaseOrderData} userName={this.state.username} />

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


export default PurchaseOrderDetails