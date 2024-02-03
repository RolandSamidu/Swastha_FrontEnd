import React, { Component, Fragment } from "react";
import {
    LoonsTable,
    LoonsCard,
    MainContainer,
} from "app/components/LoonsLabComponents";
import { Grid, CircularProgress } from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import EstimationService from "app/services/EstimationService";
import InventoryService from "app/services/InventoryService";
import { convertTocommaSeparated, dateParse, yearParse } from "utils";
import WarehouseServices from "app/services/WarehouseServices";
import Card from '@mui/material/Card';


class StockInquiryEstimateAndIssue extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            dataout:[],
            mainData:[],

            data: [],
            columns: [
                {
                    name: 'year',
                    label: 'Year',
                    options: {
                        display: true,
                       
                    },
                },
                {
                    name: 'annualEstimate',
                    label: 'Annual Estimate',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                convertTocommaSeparated(this.state.dataout[dataIndex]?.estimation || 0, 2)
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'fr',
                    label: 'F.R.',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                convertTocommaSeparated(this.state.dataout[dataIndex]?.fr || 0, 2)
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'qtyIssue',
                    label: 'Qty Issued form MSD',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                convertTocommaSeparated(Math.abs(this.state.dataout[dataIndex]?.msd_issuance) || 0, 2)
                            return <p>{data}</p>
                        },
                    },
                },
            ]
        }
    }

    async dataLoad(){
        
        const currentYear = new Date().getFullYear();
        const nextYear = new Date(currentYear + 1, 0, 1);
        const lastDateOfYear = new Date(nextYear - 86400000);
        const yearFiveYearsAgo = currentYear - 5;
        const firstDateOfYearFiveYearsAgo = new Date(yearFiveYearsAgo, 0, 1);
        let id = this.props.sr_no
        let updatedArray = []

        let params = {
            item_id: id,
            from: dateParse(firstDateOfYearFiveYearsAgo),
            to: dateParse(lastDateOfYear),
            type:'Yearly',
            search_type:'Consumption'

        }
        let res =  await WarehouseServices.getConsumptionDetails(params)
        
        // if(res.status === 200){
        //     console.log('inc data------------------>>>>',res.data.view)
        //     // this.getMonthlyReq(res.data.view)
        // }

        
     let par ={  
        item_id:id,
        estimation_from:dateParse(firstDateOfYearFiveYearsAgo),
        estimation_to:dateParse(lastDateOfYear),
        estimation_type:'Annual',
        search_type:'EstimationGroup'}

        let resp = await EstimationService.getAllEstimationITEMS(par)

        if (resp.status === 200 && res.status === 200) {
            console.log('inc data---------jjjbjbjbj--------->>>> 1', res.data.view)
            console.log('inc data---------jjjbjbjbj--------->>>>', resp.data.view)


            updatedArray = resp.data.view.map((obj1) => {
                const obj2 = res.data.view.find((obj) => (obj.item_id === obj1.item_id && obj.year == obj1.year));

                obj1.msd_issuance = obj2?.msd_issuance
                //obj1.fr = obj2?.fr

                return obj1;
            });
        }

        this.setState({
            mainData:updatedArray,
            
        },()=>{
            this.getMonthlyReq()
        })
    }

    async getMonthlyReq(){

        console.log('check shs data------->>>>',this.state.mainData)
        let yearlist = this.state.mainData.map((dataset) => dataset.year)
        let params = {
            item_id: this.props.sr_no,
            year: yearlist
        }

        let updatedArray = []
        let res = await InventoryService.monthlyRequiremnt(params)
        

        if (res.status === 200) {
            console.log('year data------->>>>',res.data.view)

            updatedArray = this.state.mainData.map((obj1) => {
                const obj2 = res.data.view.data.find((obj) => (obj.item_id === obj1.item_id && yearParse(obj.createdAt)==obj1.year));

                obj1.fr = obj2?.annual_quantity

                return obj1;
            });
            this.setState({
                dataout:updatedArray.reverse(),
                
                
            },()=>{
                setTimeout(() => {
                    this.setState({
                        loaded:true
                    })
                }, 300);
            })
        }

    }

    componentDidMount() {
        this.dataLoad()
    }

    render() {
        return (
            <Fragment>
                <Grid container className="px-main-4 m-1">
                    <Card className="p-3 w-full" >
                    {/* <ValidatorForm > */}
                       {/* <fieldset style={{ borderWidth: 1, borderRadius: 5, borderColor: '#0000FF', borderStyle: 'solid', width:'100%', margin: 2,}}> */}
                            <legend style={{ alignSelf: 'center', fontWeight:'bold', border:'1px solid #660000 ', borderRadius: 10, paddingLeft:10, backgroundColor:'#660000', color:'white' }}>Estimates and Issues form MSD</legend>
                            <Grid container>
                               <Grid item xs={12}>
                                {this.state.loaded ?
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.dataout}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: false,
                                            serverSide: true,
                                            // count: this.state
                                            //     .totalItems,
                                            // rowsPerPage: 10,
                                            // page: this.state.filterData
                                                // .page,
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
                               </Grid>
                            </Grid>                         
                        {/* </fieldset> */}
                        {/* // </ValidatorForm> */}
                        </Card>
                 </Grid>
                </Fragment>
        );
    }
}

export default StockInquiryEstimateAndIssue
