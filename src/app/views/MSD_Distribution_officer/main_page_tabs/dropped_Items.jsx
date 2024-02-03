import {
    CircularProgress,
    Dialog,
    Grid,
    Icon,
    IconButton,
    Typography
} from '@material-ui/core'
import {LoonsCard, LoonsTable, MainContainer} from 'app/components/LoonsLabComponents'
import ChiefPharmacistServices from 'app/services/ChiefPharmacistServices'
import WarehouseServices from 'app/services/WarehouseServices'
import ReactEcharts from 'echarts-for-react'
import React, {Component, Fragment} from 'react'
import FilterComponent from '../filterComponent'
import {dateTimeParse} from "utils";
import localStorageService from "app/services/localStorageService";

class MSDAll_Dropped extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selected_warehouse:null,
            owner_id:null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            owner_id:null,
            styles: {
                height: '400px',
                width: "100%"
            },
            individualView: false,
            individualView_columns: [
                {
                    name: 'order_id',
                    label: 'Order ID',
                    options: []
                }, {
                    name: 'pharmacy_counter',
                    label: 'Counter Pharmacist ID',
                    options: []
                }, {
                    name: 'pharmacist_name',
                    label: 'Counter Pharmacist',
                    options: []
                }, {
                    name: 'priority',
                    label: 'Priority',
                    options: []
                }, {
                    name: 'orderQty',
                    label: 'Order QTY',
                    options: []
                }, {
                    name: 'order_days',
                    label: 'Order Stock Days',
                    options: []
                }, {
                    name: 'parent_stock',
                    label: 'Parent Stock QTY',
                    options: []
                }, {
                    name: 'request_date',
                    label: 'Requested Date',
                    options: []
                }, {
                    name: 'require_date',
                    label: 'Required Date',
                    options: []
                }, {
                    name: 'approve',
                    label: 'Approved Date',
                    options: []
                }, {
                    name: 'action',
                    label: 'Action',
                    options: []
                }
            ],
            data: [
                {
                    pharmacy: 'Rahul',
                    orderid: 'TESTORDR123',
                    sr_no: '12365987',
                    item_number: '16543135',
                    dosage: '120mg',
                    parentstore: 'Madhuka',
                    orderqty: '100'
                }
            ],

            option: {
                backgroundColor: "#fff",
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        magicType: {
                            show: true,
                            type: ["pie", "funnel"]
                        },
                        restore: {
                            show: true,
                            title: "Restore"
                        },
                        saveAsImage: {
                            show: true,
                            title: "Save Image"
                        }
                    }
                },
                graphic: [
                    {
                        type: "group",
                        rotation: Math.PI / 4,
                        bounding: "raw",
                        right: 200,
                        bottom: 100,
                        z: 100,
                        children: [
                            {
                                type: "rect",
                                left: "center",
                                top: "center",
                                z: 100,
                                shape: {
                                    width: 600,
                                    height: 50
                                },
                                style: {
                                    fill: "rgba(0,0,0,0)"
                                }
                            }, {
                                type: "text",
                                left: "center",
                                top: "center",
                                z: 100,
                                style: {
                                    fill: "#fff",
                                    text: "",
                                    font: "bold 26px Microsoft YaHei"
                                }
                            }
                        ]
                    }
                ],
                tooltip: {
                    trigger: "item",
                    formatter: "{a}<br/><strong>{b}</strong>: {c}"
                },
                title: {
                    text: "",
                    left: "center",
                    top: 20,
                    textStyle: {
                        color: "#ccc"
                    }
                },
                calculable: true,
                legend: {
                    icon: "circle",
                    x: "center",
                    y: "50px",
                    data: [
                        'Data 1',
                        'Data 2',
                        'Data 3',
                        'Data 4',
                        'Data 5',
                        'Data 6'
                    ],
                    textStyle: {
                        color: "#000"
                    }
                },
                series: [
                    {
                        name: "Stocks",
                        type: "pie",
                        animationDuration: 2000,
                        animationEasing: "quarticInOut",
                        radius: [
                            10, 150
                        ],
                        avoidLabelOverlap: false,
                        startAngle: 90,
                        hoverOffset: 5,
                        center: [
                            "50%", "50%"
                        ],
                        roseType: "area",
                        selectedMode: "multiple",
                        label: {
                            normal: {
                                show: true,
                                formatter: "{c}" // {c} data: [{value:},]
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                smooth: false,
                                length: 20,
                                length2: 10
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data: [
                            {
                                "value": 600.58,
                                "name": "Data Point 1",
                                "itemStyle": {
                                    "normal": {
                                        "color": "#f845f1"
                                    }
                                }
                            }, {
                                "value": 1100.58,
                                "name": "Data Point 2",
                                "itemStyle": {
                                    "normal": {
                                        "color": "#ad46f3"
                                    }
                                }
                            }, {
                                "value": 1200.58,
                                "name": "Data Point 3",
                                "itemStyle": {
                                    "normal": {
                                        "color": "#5045f6"
                                    }
                                }
                            }, {
                                "value": 1300.58,
                                "name": "Data Point 4",
                                "itemStyle": {
                                    "normal": {
                                        "color": "#4777f5"
                                    }
                                }
                            }, {
                                "value": 1400.58,
                                "name": "Data Point 5",
                                "itemStyle": {
                                    "normal": {
                                        "color": "#44aff0"
                                    }
                                }
                            }, {
                                "value": 1500.58,
                                "name": "Data Point 6",
                                "itemStyle": {
                                    "normal": {
                                        "color": "#45dbf7"
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            pieData: [
                {
                    "value": 600.58,
                    "name": "Data Point 1",
                    "itemStyle": {
                        "normal": {
                            "color": "#f845f1"
                        }
                    }
                }, {
                    "value": 1100.58,
                    "name": "Data Point 2",
                    "itemStyle": {
                        "normal": {
                            "color": "#ad46f3"
                        }
                    }
                }, {
                    "value": 1200.58,
                    "name": "Data Point 3",
                    "itemStyle": {
                        "normal": {
                            "color": "#5045f6"
                        }
                    }
                }, {
                    "value": 1300.58,
                    "name": "Data Point 4",
                    "itemStyle": {
                        "normal": {
                            "color": "#4777f5"
                        }
                    }
                }, {
                    "value": 1400.58,
                    "name": "Data Point 5",
                    "itemStyle": {
                        "normal": {
                            "color": "#44aff0"
                        }
                    }
                }, {
                    "value": 1500.58,
                    "name": "Data Point 6",
                    "itemStyle": {
                        "normal": {
                            "color": "#45dbf7"
                        }
                    }
                }, {
                    "value": 1500.58,
                    "name": "Data Point 7",
                    "itemStyle": {
                        "normal": {
                            "color": "#f6d54a"
                        }
                    }
                }, {
                    "value": 1600.58,
                    "name": "Data Point 8",
                    "itemStyle": {
                        "normal": {
                            "color": "#f69846"
                        }
                    }
                }, {
                    "value": 1800,
                    "name": "Data Point 9",
                    "itemStyle": {
                        "normal": {
                            "color": "#ff4343"
                        }
                    }
                }
            ],
            formData: {
                limit: 20,
                page: 0,
                owner_id: null,
                'order[0]': [
                    'updatedAt', 'DESC'
                ],
                pharmacy: null,
                //to: null,
                from_date: null,
                to_date: null,
                status: ['REJECTED'],
                search: null,
                //distribution_officer_id:null
            },
            columns: [
                {
                    name: 'pharmacy',
                    label: 'Pharmacy',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.loaded && this.state.data.length != 0) {
                                return (this.state.data[tableMeta.rowIndex].fromStore.name)
                            } else {
                                return null
                            }

                        }
                    }
                }, {
                    name: 'order_id',
                    label: 'Order ID',
                    options: {
                        display: true
                    }
                }, {
                    name: 'pharmacist_name',
                    label: 'Counter Pharmacist',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.loaded && this.state.data.length != 0) {
                                return (this.state.data[tableMeta.rowIndex].Employee.name)
                            } else {
                                return null
                            }

                        }
                    }
                }, {
                    name: 'number_of_items',
                    label: 'Number of Items',
                    options: {
                        display: true
                    }
                }, {
                    name: 'allocated_items',
                    label: 'Allocated Items',
                    options: {
                        display: true
                    }
                }, {
                    name: 'dropped_items',
                    label: 'Dropped Items',
                    options: {
                        display: true
                    }
                }, {
                    name: 'approved_date',
                    label: 'Approved Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.loaded && this.state.data.length != 0) {
                                let data = this
                                    .state
                                    .data[dataIndex]
                                    .approved_date;
                                return <p>{dateTimeParse(data)}</p>
                            } else {
                                return "N/A"
                            }

                        }
                    }
                }, {
                    name: 'createdAt',
                    label: 'Request Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.loaded && this.state.data.length != 0) {
                                let data = this
                                    .state
                                    .data[dataIndex]
                                    .createdAt;
                                return <p>{dateTimeParse(data)}</p>
                            } else {
                                return null
                            }

                        }
                    }
                }, {
                    name: 'required_date',
                    label: 'Required Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {

                            if (this.state.loaded && this.state.data.length != 0) {
                                let data = this
                                    .state
                                    .data[dataIndex]
                                    .required_date;
                                return <p>{dateTimeParse(data)}</p>

                            } else {
                                return null
                            }

                        }
                    }
                }, {
                    name: 'delivered_date',
                    label: 'Delivery Date',
                    options: {
                        display: true
                    }
                }, {
                    name: 'time_slot',
                    label: 'Time Slot',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.loaded && this.state.data.length != 0) {
                                let from = ''
                                let to = ''

                                if (this.state.data[dataIndex].Delivery == null) {
                                    console.log("null Delivery");
                                } else {
                                    if (this.state.data[dataIndex].Delivery.time_from != null) {
                                        from = this
                                            .state
                                            .data[dataIndex]
                                            .Delivery
                                            .time_from
                                    }

                                    if (this.state.data[dataIndex].Delivery.time_to != null) {
                                        to = this
                                            .state
                                            .data[dataIndex]
                                            .Delivery
                                            .time_to
                                    }

                                }
                                let slot = from + "-" + to
                                return slot

                            } else {
                                return null
                            }

                        }

                    }
                }, {
                    name: 'my_remarks',
                    label: 'My Remarks',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data){
                                let remarks = []
                                console.log("Delivery", this.state.data[dataIndex].Delivery);
                                if (this.state.data[dataIndex].Delivery != null || this.state.data[dataIndex].Delivery != undefined) {
                                    console.log("Delivery2", this.state.data[dataIndex].Delivery);
                                    this.state.data[dataIndex].Delivery.Remarks.map((remark) => { 
                                            if (remark != null){
                                                if (remark.Remarks != null){
                                                    remarks.push(remark.Remarks.remark+"\n")
                                                }else{
                                                    remarks.push(remark.other_remarks+"\n")
                                                }                                            
                                            }                                
                                            
                                        })
                                    console.log('array', remarks);
                                    return remarks
                                } else {
                                    return 'No Remarks'
                                }
    
                            }else{
                                return "N/A"
                            }

                        }
                    }

                }, {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true
                    }
                }, {
                    name: 'action',
                    label: 'Action',
                    options: {
                        // filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.loaded && this.state.data.length != 0) {
                                return (<> < IconButton className = "text-black" onClick = {
                                    null
                                } >   </IconButton>
                                    <IconButton
                                        className="text-black"
                                        onClick={() => 
                                            // window.location = `/distribution / order / $ {this.state.data[tableMeta.rowIndex].id}`
                                            this.setState({individualView:true})
                                        }
                                >
                                        <Icon color="primary">visibility</Icon>
                                    </IconButton>
                                </>
                                    )}
                        }
                        }
                    }
                ],
            loaded:false,
            totalItems:0,
        }
    }

    componentDidMount() {
        //this.loadWarehouses()
        this.loadData()
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            this.loadData()
        })
    }

    async loadData() {
        let formData=this.state.formData;
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        formData.distribution_officer_id = user.id;
        //this.state.formData.distribution_officer_id = id
        this.setState({ loaded: false,formData })
        let orders = await ChiefPharmacistServices.getAllOrders(this.state.formData)
        if (orders.status == 200) {
            console.log('Orders', orders.data.view.data)
            this.setState(
                {data: orders.data.view.data, totalItems: orders.data.view.totalItems,loaded:true}
            )
        }
    }

    updateFilters(ven,category,class_id,group,search){
        let formData = this.state.formData
        formData.ven_id = ven
        formData.category_id = category
        formData.class_id = class_id
        formData.group_id = group
        formData.search = search

        this.setState({formData})
        console.log("Order Filter Data", this.state.formData)
        this.loadData()
    }

    // async loadWarehouses() {
    //     this.setState({loaded: false})
    //     var user = await localStorageService.getItem('userInfo');
    //     //console.log('user', user)
    //     var id = user.id;
    //     this.state.formData.distribution_officer_id = id
    //     var all_pharmacy_dummy = [];
    //     var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
    //     if (!selected_warehouse_cache) {
            
    //     } 
    //     else {  
    //         this.state.formData.owner_id = selected_warehouse_cache.owner_id
    //         this.state.formData.to = selected_warehouse_cache.id
    //         this.setState({ owner_id: selected_warehouse_cache.owner_id,selected_warehouse:selected_warehouse_cache.id ,dialog_for_select_warehouse:false})
    //         console.log('formData',this.state.formData)
    //     }
    //     let params = { employee_id: id }
    //     let res = await WarehouseServices.getWareHouseUsers(params);
    //     if (res.status == 200) {
    //         console.log("warehouseUsers", res.data.view.data)

    //         res.data.view.data.forEach(element => {
    //             all_pharmacy_dummy.push(
    //                 {
    //                     warehouse: element.Warehouse,
    //                     name: element.Warehouse.name,
    //                     main_or_personal:element.Warehouse.main_or_personal,
    //                     owner_id:element.Warehouse.owner_id,
    //                     id: element.warehouse_id,
    //                     pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
    //                 }

    //             )
    //         });
    //         console.log("warehouse", all_pharmacy_dummy)
    //         this.loadData()
    //         this.setState({ all_warehouse_loaded: all_pharmacy_dummy})
    //     }
    // }

    render() {
        return (
            <Fragment>
                <MainContainer>
                        <Grid
                            container="container"
                            lg={12}
                            md={12}
                            xs={12}
                            className='mb-8'
                            style={{
                                alignItems: 'center'
                            }}>
                            <Grid item="item" lg={8} md={8} xs={12}>
                                <Typography variant='h6' className="font-semibold">All Dropped Items</Typography>
                            </Grid>
                            <Grid item="item" lg={4} md={4} xs={12}>
                                <Grid
                                    container="container"
                                    lg={12}
                                    md={12}
                                    xs={12}
                                    className="font-semibold"
                                    style={{
                                        alignItems: 'center',
                                        display: 'flex'
                                    }}>
                                    <Grid
                                        container="container"
                                        style={{
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            display: 'flex'
                                        }}
                                        lg={6}
                                        md={6}
                                        xs={6}>
                                        <Grid item="item" lg={5} md={5} xs={5}>No of Orders</Grid>
                                        <Grid item="item" lg={3} md={3} xs={3}>
                                            <h3>{this.state.totalItems}</h3>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container="container"
                                        style={{
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}
                                        lg={6}
                                        md={6}
                                        xs={6}>
                                        <Grid item="item" lg={5} md={5} xs={5}>No of Items</Grid>
                                        <Grid item="item" lg={3} md={3} xs={3}>
                                            <h3>4</h3>
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Grid>
                        </Grid>
                        <FilterComponent onSubmitFunc={this.updateFilters.bind(this)}/>
                        {this.state.loaded 
                        ? <LoonsTable
                            options={{
                                pagination: true,
                                serverSide: true,
                                count: this.state.totalItems,
                                rowsPerPage: this.state.formData.limit,
                                page: this.state.formData.page,
                                print: true,
                                viewColumns: true,
                                download: true,
                                onTableChange: (action, tableState) => {
                                    console.log(action, tableState)
                                    switch (action) {
                                        case 'changePage':
                                            this.setPage(tableState.page)
                                            break
                                        case 'sort':
                                            // this.sort(tableState.page, tableState.sortOrder);
                                            break
                                        default:
                                            console.log('action not handled.')
                                    }
                                }
                            }}
                            data={this.state.data}
                            columns={this.state.columns}/>
                            : (
                                //loading effect
                                <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress size={30}/>
                                </Grid>
                            )
                        }
                        
                </MainContainer>
                <Dialog
                    style={{
                        padding: '10px'
                    }}
                    maxWidth="lg"
                    fullWidth='true'
                    open={this.state.individualView}
                    onClose={() => {
                        this.setState({individualView: false})
                    }}>
                    <MainContainer>

                        <Grid
                            container="container"
                            lg={12}
                            md={12}
                            xs={12}
                            className="font-semibold"
                            style={{
                                alignItems: 'center',
                                display: 'flex'
                            }}>
                            <Grid item="item" lg={6} md={6} xs={6}></Grid>
                            <Grid item="item" lg={6} md={6} xs={6}>
                                <Grid
                                    container="container"
                                    style={{
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        display: 'flex'
                                    }}>
                                    <Grid item="item" lg={12} md={12} xs={12}>No of Orders</Grid>
                                    <Grid item="item" lg={3} md={3} xs={3}>
                                        <h3>4</h3>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>

                        <Grid container="container" lg={12} md={12} xs={12} style={{alignItems: 'center'}}>
                            <Grid item="item" lg={6} md={6} xs={6}>
                                <Grid container="container" lg={12} md={12} xs={12}>
                                    <Grid item="item" lg={6} md={6} xs={6}><img/></Grid>
                                    <Grid item="item" lg={6} md={6} xs={6}>
                                        <Grid container="container" lg={12} md={12} xs={12}>
                                            <Grid item="item" lg={6} md={6} xs={6}>SR:</Grid>
                                            <Grid item="item" lg={6} md={6} xs={6}>0000000001</Grid>
                                            <Grid item="item" lg={6} md={6} xs={6}>Item Name:</Grid>
                                            <Grid item="item" lg={6} md={6} xs={6}>XXXX</Grid>
                                            <Grid item="item" lg={6} md={6} xs={6}>Stock Days:</Grid>
                                            <Grid item="item" lg={6} md={6} xs={6}>00</Grid>
                                            <Grid item="item" lg={6} md={6} xs={6}>Stock Qty:</Grid>
                                            <Grid item="item" lg={6} md={6} xs={6}>00</Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>
                            <Grid item="item" lg={6} md={6} xs={6}><ReactEcharts
                                option={this.state.option}
                                style={this.state.styles}
                                className="pie-chart"/></Grid>
                        </Grid>
                        {
                            this.state.loaded
                            ?<LoonsTable
                            title={"All Orders"}
                            columns={this.state.individualView_columns}
                            options={{
                                filterType: 'textField',
                                pagination: false,
                                size: 'medium',
                                serverSide: true,
                                print: false,
                                viewColumns: true,
                                download: false,
                                onTableChange: (action, tableState) => {
                                    console.log(action, tableState)
                                    switch (action) {
                                        case 'changePage':
                                            this.setPage(tableState.page)
                                            break
                                        case 'sort':
                                            //this.sort(tableState.page, tableState.sortOrder);
                                            break
                                        default:
                                            console.log('action not handled.')
                                    }
                                }
                            }}></LoonsTable>
                            : (
                                //loading effect
                                <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress size={30}/>
                                </Grid>
                            )
                        }
                        
                    </MainContainer>
                </Dialog>
            </Fragment>

        )
    }
}

export default MSDAll_Dropped