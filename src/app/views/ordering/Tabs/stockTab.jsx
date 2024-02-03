import {
    Box,
    CircularProgress,
    Dialog,
    Divider,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    Select,
    TextField,
    Tooltip,
    Typography,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle,
    Button,
    CardTitle,
} from 'app/components/LoonsLabComponents'
import React from 'react'
import { Component } from 'react'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import moment from 'moment'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { DatePicker } from 'app/components/LoonsLabComponents'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import Changewarehouse from "../changeWareHouseComponent";
import localStorageService from 'app/services/localStorageService'
import ReactApexChart from 'react-apexcharts'
import { dateParse } from 'utils'
//import { CheckBox } from "@mui/icons-material";
// import { returnStatusOptions } from "../../../../../src/appconst";
import { getStockItems,sendOrderQuantity,getBatch,dueOnOrder ,getAllOrderItems} from "../redux/action";
class ReturnMode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataBatch:[],
            orderItems:[],
            dataValId:[],
            dataValData:[],
            pageOrder:0,
            totalItemsDataOrder:0,
            columnsOrder:[ {
                name: 'id',
                label: 'Order No',
                options: {
                    width: 30,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <Checkbox onChange = {(e)=>this.handle(e,value,(parseFloat(this.state.orderItems[tableMeta.rowIndex].quantity)-(parseFloat(this.state.orderItems[tableMeta.rowIndex].allocated_quantity))))} checked={this.state.dataValId.includes(value)}>

                            </Checkbox>
                        )
                    },
                }
            },{
                name: 'purchase_order',
                label: 'Order No',
                options: {
                    width: 30,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span>
                                {value
                                    ? value.order_no
                                    : ""}
                            </span>
                        )
                    },
                }
            },
            {
                name: 'purchase_order',
                label: 'Order type',
                options: {
                    width: 30,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span>
                                {value
                                    ? value.type
                                    : ""}
                            </span>
                        )
                    },
                }

            },
            {
                name: 'quantity',
                label: 'Quantity',
                options: {
                    display: true,
                    width: 10,
                    // setCellProps: () => ({ style: { minWidth: "200px", maxWidth: "200px" } }),
            
                },
            },
            {
                name: 'quantity',
                label: 'Remaining Quantity',
                options: {
                    width: 30,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span>
                               {parseFloat(value)-parseFloat(this.state.orderItems[tableMeta.rowIndex].allocated_quantity)}
                            </span>
                        )
                    },
                }
            },
            {
                name: 'purchase_order',
                label: 'Order Date',
                options: {
                    width: 30,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span>
                               {value? moment(value.order_date).format("YYYY-MM-DD"):""}
                            </span>
                        )
                    },
                }
            }
            ],
            dueOrderVal:0,
            totalItemsData:null,
            page:0,
            limit:10,
            stockItems: null,
            ModalStatus:false,
            dueOrder: 0,
            dueWithExpiry: 0,
            msdStock: 0,
            singleOneOrderItemData: null,
            insitutionalStock: 0,
            msdStockWithExpiry: 0,
            insitutionalWithExpiry: 0,
            data: [],
            loading: false,
            owner_id: '',
            status: '',
            drugStore: '',
            toDate: null,
            fromDate: moment().endOf("year").format("YYYY-MM-DD"),
            drugStoreOptions: [],
            totalItems: 0,
            page: 0,
            limit: 20,
            requirementID:"",

            columns: [
                {
                    name: 'batch_no',
                    label: 'Batch no',
                    options: {
                        display: true,
                        width: 10,
                        // setCellProps: () => ({ style: { minWidth: "200px", maxWidth: "200px" } }),
                
                    },
                },

                {
                    name: 'exd', // field name in the row object
                    label: 'Exp date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {value
                                        ? dateParse(
                                            moment(value).format('YYYY-MM-DD')
                                        )
                                        : ''}
                                </span>
                            )
                        },
                    },
                },

                {
                    name: 'msd_qty', // field name in the row object
                    label: 'MSD stock quantity', // column title that will be shown in table
                    options: {
                        width: 30,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {value
                                        ? value
                                        : 0}
                                </span>
                            )
                        },
                        // setCellProps: () => ({ style: { minWidth: "100px", maxWidth: "100px" } }),
                    },
                },
                {
                    name: 'MSD stock days', // field name in the row object
                    label: 'MSD stock days', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: false,
                        width: 10,
                    },
                },
                {
                    name: 'institution_qty', // field name in the row object
                    label: 'insitutional Stock Quantity', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
              
              
                {
                    name: 'institution_qty', // field name in the row object
                    label: 'Total Stock quantity', // column title that will be shown in table,
                    options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span>

                                {this.state.dataBatch[tableMeta.rowIndex]?.msd_qty && value && parseFloat(this.state.dataBatch[tableMeta.rowIndex]?.msd_qty) + parseFloat(value) }
                                {this.state.dataBatch[tableMeta.rowIndex]?.msd_qty && !value && parseFloat(this.state.dataBatch[tableMeta.rowIndex]?.msd_qty) + 0 }
                                {!(this.state.dataBatch[tableMeta.rowIndex]?.msd_qty) && value && 0 + parseFloat(value) }

                            </span>
                        )
                    },
                 }
                },
                // {
                //     name: 'Total Stock Days', // field name in the row object
                //     label: 'Annual estimation for 2023', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //     },
                // },
            ],

            series2: [
                {
                    name: 'Consumption',
                    data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
                },
                {
                    name: 'Estimation',
                    data: [10, 41, 67, 51, 49, 1, 69, 91, 2],
                },
                {
                    name: 'Suggested Estimation',
                    data: [10, 41, 1, 20, 49, 62, 69, 92, 148],
                },
            ],
            options2: {
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: false,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    curve: 'straight',
                },
                title: {
                    text: 'Forecasted Monthly Requirement',
                    align: 'left',
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5,
                    },
                },
                xaxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                    ],
                },
            },
            series: [
                {
                    name: 'Annual estimated',
                    data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
                },
                {
                    name: 'MSD issued Qty',
                    data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
                },
                {
                    name: 'National consumption ',
                    data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
                },
            ],
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded',
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent'],
                },
                xaxis: {
                    categories: [
                        '2021',
                        '2022',
                        '2023',
                        '2024',
                        '2025',
                        '2026',
                        '2027',
                        '2028',
                        '2029',
                    ],
                },
                yaxis: {
                    title: {
                        text: 'Qty',
                    },
                },
                fill: {
                    opacity: 1,
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return '$ ' + val + ' thousands'
                        },
                    },
                },
            },
        }
    }

    handle =(e,id,val)=>{
        if(this.state.dataValId.includes(id)){
            let arr = this.state.dataValId.filter((dat)=> dat != id);
            let da =  this.state.dataValData.filter((dat)=> dat != val)
            console.log(da,arr,"daa")
           let sum = da.reduce((partialSum, a) => partialSum + a, 0);
             this.setState({
                dataValId:arr,
                dataValData:da,
                dueOrderVal:sum
            })
        }else{
            let arrr = this.state.dataValId;
            arrr.push(id)
            let valll = this.state.dataValData;
            valll.push(parseFloat(val)); 
            console.log(valll,arrr,"daa")

            let sum = valll.reduce((partialSum, a) => partialSum + a, 0);
          
            this.setState({
                dataValId:arrr,
                dataValData:valll,
                dueOrderVal:sum

            })
        }

    }
    componentDidMount() {


        this.props.getStockItems({
            item_id: this.props.itemId,
            search_type: "ItemSum",
            owner_id: "000",
            all_institiues: true,
            exp_to_date: moment(this.state.fromDate).format("YYYY-MM-DD"),
            exp_from_date: moment(new Date()).format("YYYY-MM-DD"),
        }, "insitutionalStockDate");
        this.props.getStockItems({
            item_id: this.props.itemId,
            search_type: "ItemSum",
            all_institiues: true,
        }, "insitutionalStock");
        this.props.getStockItems({
            item_id: this.props.itemId,
            search_type: "ItemSum",
            owner_id: "000",
        }, "stockMsd");
        this.props.getStockItems({
            item_id: this.props.itemId,
            search_type: "ItemSum",
            owner_id: "000",
            exp_to_date: moment(this.state.fromDate).format("YYYY-MM-DD"),
            exp_from_date: moment(new Date()).format("YYYY-MM-DD"),
        }, "stockMsdDate");

        const paramss = {
            item_id: window.location.href.split("/")[6],
            page:0,
            limit:10,
            search_type:"MSDINSTBATCHTY"
                    
        }

        this.props.getBatch(paramss);
        this.props.dueOnOrder({search_type:"TOTAL",item_id:window.location.href.split("/")[6]});
        this.props.getAllOrderItems({item_id:window.location.href.split("/")[6],status:["Pending","Active"]})

    }

    componentWillReceiveProps(nextProps) {

         const id = this.props.history.location.pathname.split("/")[3];
         this.setState({
            requirementID:id
         })

        if (nextProps?.insitutionalStatus) {


            let quantity = nextProps.insitutionalList && nextProps.insitutionalList.length ? nextProps.insitutionalList[0].quantity : 0
            this.setState({
                insitutionalStock: parseFloat(quantity),
            })
        } else {
            this.setState({
                insitutionalStock: 0
            })
        }

        if (nextProps?.insitutionalDateStatus) {
            let quantity = nextProps.insitutionalDateList && nextProps.insitutionalDateList.length ? nextProps.insitutionalDateList[0].quantity : 0

            this.setState({
                insitutionalWithExpiry: parseFloat(quantity)
            })
        } else {
            this.setState({
                insitutionalWithExpiry: 0
            })
        }


        if (nextProps?.msdStockStatus) {
            let quantity = nextProps.msdStockList && nextProps.msdStockList.length ? nextProps.msdStockList[0].quantity : 0

            this.setState({
                msdStock: parseFloat(quantity)
            })
        } else {
            this.setState({
                msdStock: 0
            })
        }

        if (nextProps?.msdStockDateStatus) {
            let quantity = nextProps.msdStockDateList && nextProps.msdStockDateList.length ? nextProps.msdStockDateList[0].quantity : 0

            this.setState({
                msdStockWithExpiry: parseFloat(quantity)
            })
        } else {
            this.setState({
                msdStockWithExpiry: 0
            })
        }

        if(nextProps?.batchStatus){

            this.setState({
                totalItemsData: nextProps?.batchData?.totalItems,
                dataBatch: nextProps?.batchData?.data
            })

        }
        if(nextProps.dueStatus && nextProps?.dueData.length){
            console.log(nextProps.dueData,"dueDatadueDatadueData")
            this.setState({
                dueOrderVal: parseFloat(nextProps?.dueData[0]?.quantity)
            })
        }

        if(nextProps.orderStatus){
            this.setState({
                totalItemsDataOrder:nextProps?.orderData?.totalItems,
                orderItems:nextProps?.orderData?.data,

            })
        }



    }


    render() {
        const children = (
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                <FormControlLabel
                    label="Lotantham 1.26mg"
                    control={<Checkbox />}
                />
                <FormControlLabel
                    label="Lotantham 1.26mg"
                    control={<Checkbox />}
                />
            </Box>
        )

        const children3 = (
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                <FormControlLabel
                    label="terimasten1.24 mg"
                    control={<Checkbox />}
                />
                <FormControlLabel
                    label="terimasten1.28 mg"
                    control={<Checkbox />}
                />
            </Box>
        )

        const children4 = (
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                <FormControlLabel
                    label="olimersatan1.24 mg"
                    control={<Checkbox />}
                />
                <FormControlLabel
                    label="olimersatan1.28 mg"
                    control={<Checkbox />}
                />
            </Box>
        )
        const children2 = (
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                <FormControlLabel label="olimersatan" control={<Checkbox />} />
                {children4}
                <FormControlLabel label="terimasten" control={<Checkbox />} />
                {children3}
            </Box>
        )

        return (
            <MainContainer>
                <LoonsCard>
                    <ValidatorForm
                        className=""
                        onSubmit={() => this.SubmitAll()}
                        onError={() => null}
                    >
                        <Grid container="container" spacing={2} direction="row">
                            <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                <Grid container="container" spacing={2}>
                                    <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                        <SubTitle title={"Select date"}></SubTitle>
                                        {/* <DatePicker
                                            className="w-full"
                                            value={this.state.fromDate}
                                            placeholder="Date Range (From)"
                                            maxDate={new Date()}
                                            onChange={(date) => {
                                                if (date) {
                                                    this.setState({
                                                        fromDate:
                                                            dateParse(date),
                                                    })
                                                } else {
                                                    this.setState({
                                                        fromDate: null,
                                                    })
                                                }
                                            }} />
                                        <br /> */}
                                        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                                            <tr style={{ borderBottom: '2px solid #e9f0ef' }} >
                                                <th style={{ width: '100px' }}></th>
                                                <th style={{ width: '100px' }}></th>
                                                <th style={{ width: '100px', textAlign: 'left' }}>MSD Availbale Stock</th>
                                                <th style={{ width: '100px' }}></th>
                                                <th style={{ width: '100px' }}></th>
                                                <th style={{ width: '100px', textAlign: 'left' }}>Insitutional Available stock</th>
                                                <th style={{ width: '100px' }}></th>
                                                <th style={{ width: '100px' }}></th>
                                                <th style={{ width: '100px', textAlign: 'left' }}><Grid>Due on Orders Quantity <br/><br/><Button   onClick={(e)=>this.setState({
                                                    ModalStatus:true
                                                })}                                              className="text-right mt-6"
                                                progress={false}
                                                scrollToTop={false}>View</Button></Grid></th>
                                                <th style={{ width: '100px' }}></th>
                                                <th style={{ width: '100px' }}></th>
                                                <th style={{ width: '100px', textAlign: 'left' }}>Total Stock Quantity</th>
                                            </tr>
                                            <tbody>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            '2px solid #e9f0ef',
                                                    }}
                                                >
                                                    <td>Stock</td>
                                                    <td></td>
                                                    <td>{this.state.msdStock  || 0 }</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>{this.state.insitutionalStock || 0}</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                      <TextValidator value={this.state.dueOrderVal}  style={{width:"300px"}} variant="outlined"
                                                        type="number" onChange={(e)=>this.setState({
                                                            dueOrderVal:parseFloat(e.target.value)
                                                        })}>

                                                      </TextValidator>
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                        {(this.state.msdStock+this.state.insitutionalStock+this.state.dueOrderVal)  }
                                                    </td>
                                                </tr>
                                                <tr style={{ borderBottom: '2px solid #e9f0ef' }} >
                                                    <td>Estimated Exp Qty at {moment(this.state.fromDate).format("YYYY-MM-DD")}</td>
                                                    <td> <DatePicker
                                                        className="w-full"
                                                        value={
                                                            this.state.fromDate
                                                        }
                                                        placeholder="Date Range (From)"
                                                        // maxDate={new Date()}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                this.setState({ fromDate: date });
                                                                this.props.getStockItems({
                                                                    item_id: this.props.itemId,
                                                                    search_type: "ItemSum",
                                                                    owner_id: "000",
                                                                    exp_to_date: moment(date).format("YYYY-MM-DD"),
                                                                    exp_from_date: moment(new Date()).format("YYYY-MM-DD"),
                                                                }, "stockMsdDate");
                                                                this.props.getStockItems({
                                                                    item_id: this.props.itemId,
                                                                    search_type: "ItemSum",
                                                                    owner_id: "000",
                                                                    all_institiues: true,
                                                                    exp_to_date: moment(date).format("YYYY-MM-DD"),
                                                                    exp_from_date: moment(new Date()).format("YYYY-MM-DD"),
                                                                }, "insitutionalStockDate");


                                                            } else {

                                                                this.setState({ fromDate: null })
                                                            }
                                                        }} /></td>
                                                    <td>{this.state.msdStockWithExpiry  || 0 }</td>
                                                    <td></td>
                                                    <td><b><span style={{ fonSize: '20px' }}> + </span></b></td>
                                                    <td>{this.state.insitutionalWithExpiry || 0 }</td>
                                                    <td></td>
                                                    <td><b><span style={{ fonSize: '20px' }}> + </span></b></td>
                                                    <td>0</td>
                                                    <td></td>
                                                    <td><b><span style={{ fonSize: '20px' }}> = </span></b></td>
                                                    {(this.state.msdStockWithExpiry+this.state.insitutionalWithExpiry+ this.state.dueWithExpiry) }
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            '2px solid #e9f0ef',
                                                    }}
                                                >
                                                    <td>
                                                        Available stock at
                                                        {moment(this.state.fromDate).format("YYYY-MM-DD")}
                                                    </td>
                                                    <td></td>
                                                    <td>{ this.state.msdStock - this.state.msdStockWithExpiry }</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>{ this.state.insitutionalStock - this.state.insitutionalWithExpiry }</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>0</td>
                                                    <td></td>
                                                    <td></td>
                                                    {((this.state.msdStock-this.state.msdStockWithExpiry)+(this.state.insitutionalStock-this.state.insitutionalWithExpiry)+(this.state.dueOrderVal-this.state.dueWithExpiry)) }
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container className='mt-5' >

                            <Button
                                style={{ marginLeft: "90%" }}
                                className="text-right mt-6"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                                onClick={(e) => { 
                                    let quantity = ((this.state.msdStock-this.state.msdStockWithExpiry)+(this.state.insitutionalStock-this.state.insitutionalWithExpiry)+(this.state.dueOrderVal-this.state.dueWithExpiry))
                                    this.props.sendOrderQuantity({"expected_availability":quantity,due_order_quantity:this.state.dueOrderVal},this.state.requirementID);this.props.handleChangTab(2) }}
                            >
                                <span className="capitalize">Next</span>
                            </Button>
                        </Grid>
                        <Grid container="container" spacing={2} direction="row">
                            <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                <SubTitle
                                    title={'Stock  With Expiry dates'}
                                ></SubTitle>
                                <br />
                                <Grid container="container" spacing={2}>
                                    <Grid
                                        item="item"
                                        xs={12}
                                        sm={12}
                                        md={4}
                                        lg={4}
                                    >
                                        {/* <SubTitle
                                            title={'Date Range From'}
                                        ></SubTitle> */}
                                        {/* <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.group}
                                            getOptionLabel={(option) =>
                                                option.name ? option.name : ''
                                            }
                                            onChange={(event, value) =>
                                                this.handlechange(
                                                    value,
                                                    'currentGroup'
                                                )
                                            }
                                            value={this.state.currentGroup}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Item Group"
                                                    //variant="outlined"
                                                    //value={}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        /> */}
                                    </Grid>
                                    <Grid
                                        item="item"
                                        xs={12}
                                        sm={12}
                                        md={4}
                                        lg={4}
                                    >
                                        {/* <SubTitle title={'To'}></SubTitle>
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.group}
                                            getOptionLabel={(option) =>
                                                option.name ? option.name : ''
                                            }
                                            onChange={(event, value) =>
                                                this.handlechange(
                                                    value,
                                                    'currentGroup'
                                                )
                                            }
                                            value={this.state.currentGroup}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Item Group"
                                                    //variant="outlined"
                                                    //value={}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        /> */}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Dialog maxWidth="lg " open={this.state.ModalStatus}>
                    <MuiDialogTitle
                        disableTypography
                    >
                        <IconButton
                            aria-label="close"
                            onClick={() => {
                                this.setState({ ModalStatus: false })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <CardTitle title="Order Items" />
                        <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.orderItems}
                                        columns={this.state.columnsOrder}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            rowsPerPage: 10,
                                            count: this.state.totalItemsDataOrder,
                                            rowsPerPageOptions: [10],
                                            page: this.state.pageOrder,
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                switch (action) {
                                                    case 'changePage':
                                                        this.handlePaginations(
                                                            tableState.page,
                                                            tableState.rowsPerPage
                                                        )
                                                        break
                                                    case 'changeRowsPerPage':
                                                        this.handlePaginations(
                                                            tableState.page,
                                                            tableState.rowsPerPage
                                                        )
                                                        break
                                                    case 'sort':
                                                        //this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:
                                                }
                                            },
                                        }}
                                    ></LoonsTable>

                        
                    </MuiDialogTitle>
                </Dialog>

                        <Grid container="container" spacing={2} direction="row">
                            <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                               
                            </Grid>
                        </Grid>

                        <Grid container="container" className="mt-3 pb-5">
                            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                {!this.state.loading ? (
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.dataBatch}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            rowsPerPage: 10,
                                            count: this.state.totalItemsData,
                                            rowsPerPageOptions: [10],
                                            page: this.state.page,
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                switch (action) {
                                                    case 'changePage':
                                                        this.handlePaginations(
                                                            tableState.page,
                                                            tableState.rowsPerPage
                                                        )
                                                        break
                                                    case 'changeRowsPerPage':
                                                        this.handlePaginations(
                                                            tableState.page,
                                                            tableState.rowsPerPage
                                                        )
                                                        break
                                                    case 'sort':
                                                        //this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:
                                                }
                                            },
                                        }}
                                    ></LoonsTable>
                                ) : (
                                    //loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </LoonsCard>
                {/* <Changewarehouse isOpen={this.props.isOpen} type="myAllReturnRequests" /> */}
            </MainContainer>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        // stockEstimates: (params) => stockEstimates(dispatch, params)
        getStockItems: (params, type) => getStockItems(dispatch, params, type),
        sendOrderQuantity:(payload,id)=>sendOrderQuantity(dispatch,payload,id),
        getBatch:(params)=>getBatch(dispatch,params),
        dueOnOrder:(params)=>dueOnOrder(dispatch,params),
        getAllOrderItems:(params)=>getAllOrderItems(dispatch,params)

    }
}

const mapStateToProps = ({ orderingReducer }) => {
    return {
        // movingNonMovingStatus: orderingReducer?.movingNonMovingStatus,
        // movingNonMovingList: orderingReducer?.movingNonMovingList,
        msdStockStatus: orderingReducer?.msdStockStatus,
        msdStockList: orderingReducer?.msdStockList,
        msdStockDateStatus: orderingReducer?.msdStockDateStatus,
        msdStockDateList: orderingReducer?.msdStockDateList,
        insitutionalStatus: orderingReducer?.insitutionalStatus,
        insitutionalDateList: orderingReducer?.insitutionalDateList,
        insitutionalDateStatus: orderingReducer?.insitutionalDateStatus,
        insitutionalList: orderingReducer?.insitutionalList,
        singleOneOrderItemData:orderingReducer?.singleOneOrderItemData,
        batchStatus:orderingReducer?.batchStatus,
        batchData:orderingReducer?.batchData,
        dueStatus:orderingReducer?.dueStatus,
        dueData:orderingReducer?.dueData,
        orderData:orderingReducer?.orderData,
        orderStatus:orderingReducer?.orderStatus

    }

}




export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReturnMode));
