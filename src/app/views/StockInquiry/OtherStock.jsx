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
import Card from '@mui/material/Card';


class StockInquiryOtherStock extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            totalItems:null,
            instituteQty:[],

            data: [],
            columns: [
                {
                    name: 'exd',
                    label: 'Expiry Date',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'quantity',
                    label: 'Qty',
                    options: {
                        display: true,
                    },
                },
            ]
        }
    }

    async getNationalStock(){

        let item = this.props.sr_no

        let params2 = {
            search_type: 'ItemSum',
            exd_wise: true,
            item_id: item,
            batchwise:true,
            all_institiues:true,
            quantity_grater_than_zero:true,
            not_expired: true,

        }

            let batch_res2 = await WarehouseServices.getSingleItemWarehouse(params2)
            console.log("item sum data",batch_res2)
            if (batch_res2.status === 200) {

                let data = batch_res2.data.view.data.filter((e)=>(
                    e.item_id === item
                ))
                console.log('nat--------------dhdhdd--.>>>>>', data)
                
                this.setState({
                    instituteQty: data,
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
       this.getNationalStock()
    }

    render() {
        return (
            <Fragment>
                <Grid container className="px-main-4 m-1">
                    <Card className="p-3 w-full" >
                    {/* // <ValidatorForm > */}
                       {/* <fieldset style={{ borderWidth: 1, borderRadius: 5, borderColor: '#0000FF', borderStyle: 'solid', width:'100%', margin: 2, height:'350px', overflow:'auto'}}> */}
                            <legend style={{ alignSelf: 'center', fontWeight:'bold', border:'1px solid red ', borderRadius: 10, paddingLeft:10 , backgroundColor:'red', color:'white' }}>Other Institute</legend>
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

export default StockInquiryOtherStock
