import React, { Component, Fragment } from "react";
import {
    LoonsTable,
    LoonsCard,
    MainContainer,
    SubTitle,
    Button
} from "app/components/LoonsLabComponents";
import { Grid, InputAdornment, CircularProgress } from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import WarehouseServices from "app/services/WarehouseServices";
import { convertTocommaSeparated, dateParse, yearParse } from "utils";
import InventoryService from "app/services/InventoryService";
import EstimationService from "app/services/EstimationService";
import SearchIcon from '@material-ui/icons/Search';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';


class StockInquiryOrderList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            monthlyReq:null,
            data:[],
            tabledata:[],

            totalItems:0,
            formData :{
                item_id:null,
                search_type:'TOTALLIST2',
                // status:['APPROVED', 'PO_CREATED'],
                page:0,
                limit:10,
                search:null,
                with_pagination:true,
                // orderby_order_date: true,
                // 'order[0]': ['order_date', 'ASC'],
                order: ['order_date']
            },

            
            columns: [
                {
                    name: '',
                    label: ' ',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                   
                            return <Checkbox  defaultChecked />
                        },
                    },
                },
                {
                    name: 'orderListNumber',
                    label: 'Order List Number',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.tabledata[dataIndex]?.OrderList?.order_no
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'orderListDate',
                    label: 'Order Req date',
                    options: {
                        display: true,
                        
                        customBodyRenderLite: (dataIndex) => {
                            console.log('table dta', this.state.tabledata[dataIndex])
                            let data =
                                dateParse(this.state.tabledata[dataIndex]?.OrderList?.order_date)
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'orderListDate',
                    label: 'Order Placed date',
                    options: {
                        display: true,
                        
                        customBodyRenderLite: (dataIndex) => {
                            console.log('table dta', this.state.tabledata[dataIndex])
                            let data =dateParse(this.state.tabledata[dataIndex]?.OrderList?.order_date)
                            return <p>{(dateParse(this.state.tabledata[dataIndex]?.OrderList?.createdAt) == "2023-05-07" || dateParse(this.state.tabledata[dataIndex]?.OrderList?.createdAt) == "2023-07-09") ? data : dateParse(this.state.tabledata[dataIndex]?.OrderList?.createdAt)}</p>
                        },
                    },
                },
                {
                    name: 'qtyListOrdered',
                    label: 'Order List Qty',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                convertTocommaSeparated(this.state.tabledata[dataIndex]?.quantity || 0 ,2 )
                            return <p>{data}</p>
                        },
                    },
                },
                {  
                    name: 'mts',
                    label: 'Mts',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                            this.state.monthlyReq ? convertTocommaSeparated(((this.state.tabledata[dataIndex]?.quantity ? this.state.tabledata[dataIndex]?.quantity : 0) / this.state.monthlyReq) || 0, 2) : 0
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'qtyOrdered',
                    label: 'Qty Ordered',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                convertTocommaSeparated(this.state.tabledata[dataIndex]?.po_details?.pending_quantity || 0, 2)
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'mts',
                    label: 'Mts',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                            this.state.monthlyReq ? convertTocommaSeparated(((this.state.tabledata[dataIndex]?.po_details?.pending_quantity ? this.state.tabledata[dataIndex]?.po_details?.pending_quantity : 0) / this.state.monthlyReq) || 0, 2) : 0
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'qtyReceived',
                    label: 'Qty Received',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                            convertTocommaSeparated(this.state.tabledata[dataIndex]?.po_details?.recieved_quantity || 0 , 2)
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'mts',
                    label: 'Mts',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                            this.state.monthlyReq ? convertTocommaSeparated(((this.state.tabledata[dataIndex]?.po_details?.recieved_quantity ? this.state.tabledata[dataIndex]?.po_details?.recieved_quantity : 0) / this.state.monthlyReq) || 0, 2) : 0
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'grnQty',
                    label: 'Grn Qty',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                            convertTocommaSeparated(this.state.tabledata[dataIndex]?.consignment_data?.grn_quantity || 0 , 2)
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'mts',
                    label: 'Mts',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                            this.state.monthlyReq ? convertTocommaSeparated(((this.state.tabledata[dataIndex]?.consignment_data?.grn_quantity ? this.state.tabledata[dataIndex]?.consignment_data?.grn_quantity : 0 ) / this.state.monthlyReq) || 0 , 2) : 0
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'balance',
                    label: 'Balance',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                convertTocommaSeparated(((Number(this.state.tabledata[dataIndex]?.quantity)-Number(this.state.tabledata[dataIndex]?.consignment_data?.grn_quantity)) || 0) ,2 )
                            return <p>{data}</p>
                        },

                    },
                },
                {
                    name: 'mts',
                    label: 'Mts',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                            this.state.monthlyReq ? convertTocommaSeparated((((Number(this.state.tabledata[dataIndex]?.quantity)-Number(this.state.tabledata[dataIndex]?.consignment_data?.grn_quantity)) ? (Number(this.state.tabledata[dataIndex]?.quantity)-Number(this.state.tabledata[dataIndex]?.consignment_data?.grn_quantity)) : 0) / this.state.monthlyReq) || 0 , 2) : 0
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'orderStatus',
                    label: 'Order Status',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.tabledata[dataIndex]?.OrderList?.status
                            return <p>{data}</p>
                        },
                    },
                },
            ]
        }
    }

    async getData(){

        const currentYear = new Date().getFullYear();
        const nextYear = new Date(currentYear + 1, 0, 1);
        const lastDateOfYear = new Date(nextYear - 86400000);
        const yearFiveYearsAgo = currentYear - 5;
        const firstDateOfYearFiveYearsAgo = new Date(yearFiveYearsAgo, 0, 1);

        let id = this.props.sr_no
        console.log('checking dtaattatata id', id)
        let params = this.state.formData
        params.item_id = id
        params.to = dateParse(lastDateOfYear)
        if(yearFiveYearsAgo<2021){
            params.from = dateParse('2021-01-01')
        }else{
            params.from = dateParse(firstDateOfYearFiveYearsAgo)
        }
        
        
        let res = await WarehouseServices.getOrderPosition(params)

        if (res.status === 200) {
            console.log('checking dtaattatata', res)
            this.setState({
                tabledata:res.data.view.data,
                totalItems:res.data.view.totalItems
            },()=>{
                this.getMonthlyReq() 
                setTimeout(() => {
                    this.setState({
                        loaded:true
                    })
                }, 300);
            })
        }

        console.log('checking state', this.state.tabledata)
    }

    async getMonthlyReq(){
        const currentYear = new Date().getFullYear();
        const nextYear = new Date(currentYear + 1, 0, 1);
        const lastDateOfYear = new Date(nextYear - 86400000);
        const yearFiveYearsAgo = currentYear - 5;
        const firstDateOfYearFiveYearsAgo = new Date(yearFiveYearsAgo, 0, 1);
        let id = this.props.sr_no

        let params1 = {
            item_id: id,
            estimation_from: dateParse(firstDateOfYearFiveYearsAgo),
            estimation_to: dateParse(lastDateOfYear),
            estimation_type:'Annual',
            search_type:'EstimationGroup'

        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        console.log("Current month:", currentMonth);

        const monthList = ['', 'jan', 'feb', 'mar', 'apr', 'may', 'june', 'july', 'aug', 'sep', 'oct', 'nov', 'dec']
        console.log('monthList', monthList[currentMonth])

        let params = {
            item_id: id,
            year: yearParse(new Date())
        }

        let res = await InventoryService.monthlyRequiremnt(params)
        console.log('data monthly req', res)
        if (res.status === 200) {
            let value = res.data.view.data.map((index)=>{
                    const currentMonthName = monthList[currentMonth - 1]; 
                    return index[currentMonthName];
            })

            if (value[0]) {
                this.setState({
                    monthlyReq:value[0],
                })
            } else {
                let res2 =  await EstimationService.getAllEstimationITEMS(params1)

                if (res2.status === 200){
                    let estimation = res2.data.view[0]?.estimation / 12

                    this.setState({
                        monthlyReq:estimation,
                    })
                }
            }
        }
        console.log('monthly mts', this.state.monthlyReq)
    }


    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            this.getData()
        })
    }

    componentDidMount() { 
        this.setPage(0)
        // this.getMonthlyReq()
    }

    render() {
        return (
            <Fragment>
                <Grid container className="px-main-4 m-1">
                    <Card className="p-3 w-full" >
                    <ValidatorForm >
                       {/* <fieldset style={{ borderWidth: 1, borderRadius: 5, borderColor: '#0000FF', borderStyle: 'solid', width:'100%', margin: 2}}> */}
                            <legend style={{alignSelf: 'center', fontWeight:'bold',  border:'1px solid #105160 ', borderRadius: 10, paddingLeft:10, backgroundColor:'#105160', color:'white' }}>Order Position</legend>
                            <Grid container spacing={2}  className="mt-5 mb-5" style={{height:'350px', overflow:'auto'}}>
                                <Grid item xs={12} sm={12} md={3} >
                                    <SubTitle title='Search'/>
                                    <TextValidator className='w-full' placeholder="Search" fullWidth="fullWidth" variant="outlined" size="small"
                                        //value={this.state.formData.search} 
                                        style={{backgroundColor:'white'}}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            formData.search = e.target.value;
                                                               
                                            this.setState({formData})
                                        }}

                                        onKeyPress={(e) => {
                                            if (e.key == "Enter") {                                
                                                    this.setPage(0)            
                                            }
                
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <SearchIcon></SearchIcon>
                                                </InputAdornment>
                                            )
                                        }}/>
                                </Grid>


                                <Grid item xs={12} sm={12} md={12} className="mt-0">
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'100%'}}>
                                                {console.log('data',this.state.data)}
                                            {this.state.loaded ?
                                            // 
                                                <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    
                                                    id={'allAptitute'}
                                                    data={this.state.tabledata}
                                                    columns={this.state.columns}
                                                    options={{
                                                        
                                                        pagination: true,
                                                        serverSide: true,
                                                         count: this.state.totalItems,
                                                        rowsPerPage: 10,
                                                        page: this.state.formData.page,
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

                                                :
                                                <Grid className="justify-center text-center w-full pt-12">
                                                    <CircularProgress size={30} />
                                                </Grid>
                                                }
                                            </td>
                                        </tr>
                                    </table>                            
                                </Grid>
                          
                            </Grid>
          
                            
                        {/* </fieldset> */}
                        </ValidatorForm>
                        </Card>
                 </Grid>
                 </Fragment>
        );
    }
}

export default StockInquiryOrderList
