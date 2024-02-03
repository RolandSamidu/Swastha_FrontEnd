import { Grid, Icon, IconButton, Typography } from "@material-ui/core";
import { CardTitle, LoonsCard, LoonsTable, MainContainer } from "app/components/LoonsLabComponents";
import React, { Component } from "react";
import { Fragment } from "react";

class GatePassPickUp extends Component {
    constructor(props){
        super(props)
        this.state = {
            activeStep: 1,
            mainTableColumns : [
                {
                    name: 'instituteID', // field name in the row object
                    label: 'Institute ID', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'instituteName', // field name in the row object
                    label: 'Institute Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'stvNo', // field name in the row object
                    label: 'STV No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'orderID', // field name in the row object
                    label: 'Order ID', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'noOFItems', // field name in the row object
                    label: 'No of Items', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'custodian', // field name in the row object
                    label: 'Custodian Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'custodianID', // field name in the row object
                    label: 'Custodian ID', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
            ],

            mainTableData : [
                {
                    instituteID:'12345',
                    instituteName: 'ABC',
                    stvNo: '',
                },
            ]
        }
    }

  render (){
    return (
            <Fragment>
                <MainContainer>
                    <Grid className="flex justify-end" item xs={12} sm={12} md={12}  lg={12}>
                        <IconButton
                        className="text-black"
                        onClick={null}
                        >
                            <Icon>print</Icon>
                        </IconButton>
                        <IconButton
                        className="text-black"
                        onClick={null}
                        >
                            <Icon>download</Icon>
                        </IconButton>
                    </Grid>

                    <LoonsCard>
                        <Grid container spacing={2} style={{ margin: '25px 0' }} >
                            <Grid className="flex" item xs={12} sm={12} md={12}  lg={9}>
                                <Typography variant="h6" className="font-semibold mr-2 ">Stock Transfer Voucher Gate Pass - Gate Pass ID</Typography>
                            </Grid>
                            <Grid className="" item xs={12} sm={12} md={12}  lg={3}>
                                <div className="flex" >
                                    <Typography variant="p" className="font-semibold mr-2 ">Order Delivery Type :</Typography>
                                    <Typography variant="p" className="font-semibold mr-2 ">Pick Up</Typography>
                                </div>
                                <div className="flex justify-between " >
                                    <Typography variant="p" className="font-semibold mr-2 ">Vehicle</Typography>
                                    <Icon>local_shipping</Icon>
                                </div>
                                <div className="flex" >
                                    <Typography variant="p" className="font-semibold mr-2 ">ID :</Typography>
                                    <Typography variant="p" className="font-semibold mr-2 ">#</Typography>
                                </div>
                                <div className="flex" >
                                    <Typography variant="p" className="font-semibold mr-2 ">Type :</Typography>
                                    <Typography variant="p" className="font-semibold mr-2 ">Light Truck</Typography>
                                </div>
                            </Grid>
                        </Grid>

                        {/* Summary Table */}
                    <Grid className='mt-3' container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                                <LoonsTable
                                            id={'table'}
                                            data={this.state.mainTableData}
                                            columns={this.state.mainTableColumns}
                                            options={{
                                                pagination: false,
                                                serverSide: true,
                                                print: false,
                                                viewColumns: false,
                                                download: false,
                                                onTableChange: (action, tableState) => {
                                                    console.log(action, tableState)
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
                        </Grid>
                    </Grid>
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )
  }
}

export default GatePassPickUp