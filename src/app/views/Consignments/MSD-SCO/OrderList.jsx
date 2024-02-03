import React, { Component } from "react";
import { CircularProgress, Grid, InputAdornment, IconButton, Tooltip } from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility'
import { LoonsCard, CardTitle, LoonsTable, MainContainer, SubTitle } from "../../../components/LoonsLabComponents";
import SchedulesServices from "app/services/SchedulesServices";
import { dateParse, yearParse } from 'utils'
import { Autocomplete, Button, Box } from '@material-ui/lab'
import LoonsButton from "app/components/LoonsLabComponents/Button";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search';
import * as appConst from '../../../../appconst'
import { DatePicker } from 'app/components/LoonsLabComponents';
import localStorageService from 'app/services/localStorageService'
import OrderList from '../../SPC/Print/OrderList';
import PrintIcon from '@mui/icons-material/Print';
import InventoryService from "app/services/InventoryService";

class OrderListClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            userRoles:[],
            ploaded: false,
            orderList:[],
            myData:[],
            userName: null,
            orderListId:null,

            filterData: {
                type: null,
                status: null,
                from: null,
                to: null,
                year: null
            },

            printData:{
                orderId:null, 
                orderListId:null,
                userName:null
            },

            formData: {
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
                year: null
            },

            columns: [
                {
                    name: 'order_no',
                    label: 'Action ',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let order_list_id = this.state.data[dataIndex]?.id

                            // let status = this.state.data[dataIndex].status;
                            return (
                                <Grid className="flex items-center">

                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/order/order-list/${order_list_id}`
                                                }}
                                            >
                                                <VisibilityIcon color="primary" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>

                                    {this.state.userRoles.includes("MSD SCO") || this.state.userRoles.includes("MSD SCO Supply") || this.state.userRoles.includes("MSD SCO QA") ?
                                        <Grid className="px-2">
                                            <Tooltip title="Print">  
                                                {/* <OrderList orderId={this.state.data[dataIndex].id} orderListId={this.state.data[dataIndex].order_no} userName={this.state.data[dataIndex].Employee.name} buttonClick={true} /> */}
                                                <IconButton
                                                onClick={() => this.printData(this.state.data[dataIndex]?.id, this.state.data[dataIndex]?.order_no, this.state.data[dataIndex]?.Employee.name)}
                                            >
                                                <PrintIcon color="primary" />
                                            </IconButton>
                                                
                                            </Tooltip>
                                        </Grid>
                                        : null
                                    }
                                </Grid>
                            )
                        },
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
                            return dateParse(this.state.data[dataIndex]?.order_date)
                        }
                    }
                },
                {
                    name: 'order_date_to',
                    label: 'Order Date To',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
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

    
    // async getOderListTotalData(){
    //     // get orderlist by id
    //     let res = await SchedulesServices.getOrderListByID({},this.props.orderId)
        
    //     if (res.status ==200){
    //         console.log('orderlist',res.data.view)
    //         this.setState({orderList:res.data.view.OrderListItems})
    //         this.setState({myData:res.data.view})

    //     }
    // }

    async printData(orderId, orderListId, userName) {
        this.setState({ printLoaded: false })
        console.log('clicked', orderId, orderListId, userName)
        // let params = this.state.formData
        // delete params.limit
        // delete params.page
        let res = await SchedulesServices.getOrderListByID({},orderId)

        if (res.status === 200) {  
            console.log('pdata', res.data.view)
            this.setState(
                { 
                    orderListId:orderListId,
                    userName:userName,
                    // ploaded: true,
                    // orderList:res.data.view,
                    myData:res.data.view,
                    // printLoaded: true,
                    // totalItems: res.data.view.totalItems,
                },
                () => {
                    // this.render()
                    // document.getElementById('print_button_006').click() 
                    this.getUOMByID(res.data.view)
                    // this.getCartItems()
                }
            )
            // console.log('Print Data', this.state.printData)
        }

        // this.setState({ showLoading: true });

        // setTimeout(() => {
        //  this.setState({ showLoading: false });
        // }, 5000);
    }

    async getUOMByID(data){

        console.log('jjhjjghgffdd', data)

        let list = data.OrderListItems.map((i)=>i.ItemSnap.id)

        let params={
            item_snap_id:list
        }

        console.log('jjhjjghgff15155hhhhhhhjjjjjjjjjjjdd', params)

        const res = await InventoryService.GetUomById(params)

        console.log('jjhjjghgffhhhhhhhhhhhhhjjjjjjjjjjjdd', res)

            let updatedArray = []
            if(res.status === 200) {

            updatedArray = data?.OrderListItems.filter((obj1) => {
                const obj2 = res.data.view.data.find((obj) => obj.ItemSnap?.id === obj1.ItemSnap?.id);

                obj1.uom = obj2?.UOM?.name

                 return obj1;

            });
            data.OrderListItems = updatedArray;
            }
            
            this.setState(
                {
                    ploaded: true,
                    orderList: data,
                    printLoaded: true,
                    // totalItems: res.data.view.totalItems,
                },
                () => {
                    // this.render()
                    document.getElementById('print_button_006').click() 
                }
            )

            this.setState({ showLoading: true });

        setTimeout(() => {
         this.setState({ showLoading: false });
        }, 5000);
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

    async loadData() {
        this.setState({ loaded: false })

        var user = await localStorageService.getItem('userInfo')
        let userRoles = user.roles
        let formData = this.state.formData
        formData.role = userRoles[0]
        //formData.user_id = user.id
        this.setState({ userRoles: userRoles })

        if (userRoles.includes("MSD SCO") === true || userRoles.includes("MSD SCO Supply") === true || userRoles.includes("MSD SCO QA") === true) {
           // formData.created_by = user.id
        }

        let res = await SchedulesServices.getOrderList(this.state.formData)
        // console.log("orderlist data", res.data.view.data)
        if (res.status === 200) {
            this.setState({
                loaded: true,
                data: res.data.view.data,
                totalPages: res.data.view?.totalPages,
                totalItems: res.data.view?.totalItems,
            })
        }
    }

    loadOrderList = (event) => {
        const { value } = event.target;
        const filterData = this.state.data.filter((item) =>
            item.order_no.toLowerCase().includes(value.toLowerCase())
        );
        this.setState({ search: value, filterData });
    };

/*     async loadOrder() {
        this.setState({ loaded: false, cartStatus: [] })
        this.state.formData = { ...this.state.formData }
        console.log("form data", this.state.formData)
        let res = await SchedulesServices.getOrderList(this.state.formData)
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
    } */

    componentDidMount() {
        this.loadData()
    }

    render() {

        return (
            <MainContainer>
                <LoonsCard>
                    <CardTitle title="Order List" />

                    <Grid container="container" spacing={2} direction="row">
                        <Grid item="item" xs={12} sm={12} md={12} lg={12}>

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
                                                let formData = this.state.formData
                                                if (value != null) {

                                                    formData.status = value.value

                                                } else {
                                                    formData.status = null
                                                }
                                                this.setState({ formData })
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
                                                let formData = this.state.formData
                                                if (value != null) {

                                                    formData.type = value.value

                                                } else {
                                                    formData.status = null
                                                }
                                                this.setState({ formData })
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

                                            className="w-full"
                                            value={this.state.formData.from}
                                            variant="outlined"
                                            placeholder="Date From"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.from = dateParse(date);
                                                this.setState({ formData });
                                            }}
                                        />
                                    </Grid>
                                    {/* to */}
                                    <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                        <SubTitle title="Date To" />
                                        <DatePicker

                                            className="w-full"
                                            value={this.state.formData.to}
                                            variant="outlined"
                                            placeholder="Date To"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.to = dateParse(date);
                                                this.setState({ formData });
                                            }}
                                        />
                                    </Grid>
                                    {/* year */}
                                    <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                        <SubTitle title="Year" />
                                        <DatePicker

                                            className="w-full"
                                            value={this.state.formData.year}
                                            variant="outlined"
                                            placeholder="Year"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.year = yearParse(date);
                                                this.setState({ formData });
                                            }}
                                        />
                                    </Grid>

                                    <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                    <SubTitle title="Search" />
                                        <TextValidator className='' placeholder="Search"
                                            //variant="outlined"
                                            fullWidth="fullWidth" variant="outlined" size="small"
                                            // value={this.state.formData.search}
                                            value={this.state.search}
                                            onChange={(e) => {
                                                let formData = this.state.formData;
                                                formData.search = e.target.value;
                                                this.setState({ formData });
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
                                                        <SearchIcon></SearchIcon>
                                                    </InputAdornment>
                                                )
                                            }} />

                                    </Grid>

                                    <Grid
                                        item="item" lg={3} md={3} sm={12} xs={12} className=" w-full flex justify-start p-0">
                                        {/* Submit Button */}
                                        <LoonsButton className="mt-6 mr-2" progress={false} type='submit'
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

                                    
                                </Grid>

                            </ValidatorForm>

                        </Grid>
                    </Grid>

                    <Grid container>

                        <Grid item lg={12} className=" w-full mt-2" spacing={2} style={{ marginTop: 20 }}>

                            {
                                this.state.loaded ?
                                    <div className="pt-0">
                                        <LoonsTable
                                            id={"DEFAULT_USER"}
                                            // data={this.state.data}
                                            data={this.state.filterData.length ? this.state.filterData : this.state.data}
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
                        

                        <Grid>
                            {this.state.ploaded  ?
                                
                                <OrderList orderList={this.state.orderList} myData={this.state.myData} orderListId={this.state.orderListId }userName={this.state.userName } />

                            :
                            <Grid className="justify-center text-center w-full pt-12">
                                {/* <CircularProgress size={30} /> */}
                            </Grid>
                            }
                        </Grid>

                    </Grid>

                    

                </LoonsCard >
                
            </MainContainer >
        )
    }
}

export default OrderListClass
