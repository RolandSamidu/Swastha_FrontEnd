import { CircularProgress, Divider, Grid, TextField } from "@material-ui/core";
import { CardTitle, LoonsCard, LoonsTable, MainContainer } from "app/components/LoonsLabComponents";
import React, { Component } from "react";
import PharmacyOrderService from 'app/services/PharmacyOrderService'

class IndividualOrderPP extends Component {

    constructor(props) {
        super(props)
        this.state = {
            order: {
                id: '1',
                drugStore: '',
                noOfItems: '60',
                receivedDate: '',
                issuedDate: '',
                time: '',
                content: [],


            },
            columns: [
                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        display: true,
                    }
                },
                {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        display: true,
                    }
                },
                {
                    name: 'drug_store_name',
                    label: 'Drug Store',
                    options: {
                        display: true,
                    }
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                    }
                },
                {
                    name: 'order_quantity',
                    label: 'Order Qty',
                    options: {
                        display: true,
                    }
                },
                {
                    name: 'issuedQty',
                    label: 'Issued Qty',
                    options: {
                        display: true,
                    }
                },
                {
                    name: 'pickedUpQty',
                    label: 'Picked Up Qty',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <TextField id="standard-basic" />
                                </>
                            )
                        },
                    },
                },
            ],
            tableDataLoaded: false,
            totalItems: 0,
            filterData: {
                limit: 10,
                page: 0,
            },
        }
    }

    async preLoadData(){
        let res = await PharmacyOrderService.getOrderList(this.props.match.params.id)
        if(res.status && res.status == 200){
            console.log('data',res)
            this.setState({
                tableDataLoaded:true,
                order:res.data.view.data
            }, ()=> console.log('data',this.state.order))
        }
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {
            console.log("New formdata", this.state.filterData)
            this.preLoadData()
        })
    }

    componentDidMount(){

        this.preLoadData();
        this.render()
    }


    render() {

        return (
           
            <MainContainer>
                <LoonsCard>
                    <Grid container spacing={2} style={{ display: 'flex' ,alignContent: 'center' ,flexWrap: 'wrap' }}>
                        <Grid item lg={3} xs={12} style={{ display: 'flex', alignContent: 'center' }}>
                            <h5>Drug Store : </h5>
                            <h5> {this.state.order.drug_store_name? this.state.order.drug_store_name : 'N/A'}</h5>
                        </Grid>
                        <Grid item lg={3} xs={12} style={{ display: 'flex', alignContent: 'center' }}>
                            <h5>Order ID : </h5>
                            <h5>{this.props.match.params.id? this.props.match.params.id : 'N/A'}</h5>
                        </Grid>
                        <Grid item lg={3} xs={12} style={{ display: 'flex', alignContent: 'center' }}>
                            <h5>No Of Items : </h5>
                            <h5>{this.state.order.order_quantity? this.state.order.order_quantity : 'N/A'}</h5>
                        </Grid>


                        <Grid item lg={3} xs={12} style={{ display: 'flex', alignContent: 'center' }}>
                            <h5>Received Date : </h5>
                            <h5>{this.state.order.createdAt? this.state.order.createdAt : 'N/A'}</h5>
                        </Grid>
                        <Grid item lg={3} xs={12} style={{ display: 'flex', alignContent: 'center' }}>
                            <h5>Issued Date : </h5>
                            <h5>{this.state.order.issuedDate ? this.state.order.issuedDate : 'N/A'}</h5>
                        </Grid>
                        <Grid item lg={3} xs={12} style={{ display: 'flex', alignContent: 'center' }}>
                            <h5>Time : </h5>
                            <h5>{this.state.order.createdAt? this.state.order.createdAt : 'N/A'}</h5>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} className='my-3'>
                            <Divider></Divider>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item lg={3} xs={12}>
                            <h4>Order Content</h4>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            {this.state.tableDataLoaded ? (
                                <LoonsTable
                                    //title={"All Aptitute Tests"}
                                    id={'allAptitute'}
                                    data={this.state.order}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        rowsPerPage: 10,
                                        page: this.state.filterData.page,
                                        onTableChange: (action, tableState) => {
                                            console.log(action, tableState)
                                            switch (action) {
                                                case 'changePage':
                                                    // this.setPage(
                                                    //     tableState.page
                                                    // )
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
                            ) : (
                                //load loading effect
                                <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress size={30} />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </LoonsCard>
                </MainContainer>
        )
    }

}

export default IndividualOrderPP