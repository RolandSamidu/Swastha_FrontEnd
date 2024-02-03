import React, { Component, Fragment } from "react";
import {
    LoonsTable,
    LoonsCard,
    MainContainer,
} from "app/components/LoonsLabComponents";
import { Grid, CircularProgress } from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'

import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
import { convertTocommaSeparated, dateParse } from "utils";
import Card from '@mui/material/Card';


class StockInquiryStockPosition extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            quantities:[],
            instituteQty:[],

            data: [],
            columns: [
                {
                    name: 'warehouse_name',
                    label: 'Whse',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'exd',
                    label: 'ExpDate',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                dateParse(this.state.instituteQty[dataIndex]?.exd)
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'qty',
                    label: 'Qty',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                convertTocommaSeparated(this.state.instituteQty[dataIndex]?.quantity || 0, 2)
                            return <p>{data}</p>
                        },
                    },
                },
            ]
        }
    }

    getAllItemWarehouse

    async loadData(){

        let item = this.props.sr_no

        let params2 = {
            item_id: item,
            search_type:'ItemSum',
            owner_id: '000',
            batchwise:true,
            exd_wise:true,
            not_expired:true,
            warehouse_wise:true,
            quantity_grater_than_zero: true,

        }

            let batch_res2 = await WarehouseServices.getSingleItemWarehouse(params2)
            if (batch_res2.status === 200) {

                console.log('nat------fgfg--------dhdhdd--.>>>>>', batch_res2)
                
                this.setState({
                    instituteQty: batch_res2.data.view.data,
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
        this.loadData()
    }

    render() {
        return (
            <Fragment>
                <Grid container className="px-main-4 m-1">
                    <Card className="p-3 w-full" >
                    {/* // <ValidatorForm > */}
                       {/* <fieldset style={{ borderWidth: 1, borderRadius: 5, borderColor: '#0000FF', borderStyle: 'solid', width:'100%', margin: 2, height:'350px', overflow:'auto'}}> */}
                       <legend style={{ alignSelf: 'center', fontWeight:'bold', border:'1px solid #90EE90 ', borderRadius: 10, paddingLeft:10, backgroundColor:'#90EE90' }}>Stock Position at MSD</legend>
                            <Grid container  style={{height:'350px', overflow:'auto'}}>
                           
                               <Grid item xs={12}>
                               {this.state.loaded ?
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.instituteQty}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: false,
                                            serverSide: false,
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

export default StockInquiryStockPosition
