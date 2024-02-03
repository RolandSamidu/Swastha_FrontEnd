import { Button, CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Tooltip, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { LoonsCard, LoonsTable, MainContainer, SubTitle } from "app/components/LoonsLabComponents";
import LoonsButton from "app/components/LoonsLabComponents/Button";
import React from "react";
import { Component } from "react";
import SearchIcon from '@material-ui/icons/Search';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SimpleCard from "app/components/cards/SimpleCard"
import { InfoOutlined } from "@material-ui/icons";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

class SetMinStock extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            updateData: {
                noOfDays: 0
            },
            formData: {
                categoryItemNumber: null,
                serialFamilyNumber: null,
                serialFamilyName: null,
                shortRef: null,
                description: null,
                lessStock: null,
                moreStock: null,
                ven_id: null,
                item_class_id: null,
                item_category_id: null,
                item_group_id: null,
                search: null
            },
            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
            loading: true,
            columnsReturn: [
                {
                    name: 'No', // field name in the row object
                    label: 'SR NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Estimate Expiry', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'item_name', // field name in the row object
                    label: 'Return Qty', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
            ],
            columnsBatch: [
                {
                    name: 'No', // field name in the row object
                    label: 'SR NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'Invoice No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Batch No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'item_name', // field name in the row object
                    label: 'Exp Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                }, {
                    name: 'item_name', // field name in the row object
                    label: 'Qty', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                }, {
                    name: 'item_name', // field name in the row object
                    label: 'Consumable Time Period', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                }, {
                    name: 'item_name', // field name in the row object
                    label: 'system Estimated consumption for consumable time period ', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                }, {
                    name: 'item_name', // field name in the row object
                    label: 'Estimated Expiry Qty', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                }, {
                    name: 'item_name', // field name in the row object
                    label: 'Returned Qty', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                }],
            totalItems: 0,
            page: 1,
            minStockLevel: null,
            warehouse_id: "8688da15-9f31-40a5-83e8-4a603479155a"


        }
    }


    componentDidMount() {

    }



    render() {

        return (
            <MainContainer>
                <LoonsCard>

                    <Grid
                        container="container"
                        lg={12}
                        md={12}
                        xs={12}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                        <Grid item="item">
                            <Typography variant="h6" className="font-semibold">Return Request ID</Typography>
                        </Grid>
                        {/* <Grid item="item">
                            <RadioGroup row="row" defaultValue="order">
                                <FormControlLabel value="order" control={<Radio />} label="Order"/>
                                <FormControlLabel value="exchange" control={<Radio />} label="Exchange"/>
                                <FormControlLabel value="return" control={<Radio />} label="Return"/>
                            </RadioGroup>
                        </Grid> */}
                    </Grid>


                    <ValidatorForm
                        className="pt-2"
                        onSubmit={() => null}
                        onError={() => null}>
                        {/* Main Grid */}
                        <Grid container="container" spacing={2} direction="row">
                            <Grid item="item" xs={6} sm={6} md={6} lg={6}>
                            </Grid>

                            <Grid item="item" xs={6} sm={6} md={6} lg={6}>
                                <Grid container="container" spacing={2}>
                                    <Grid className=" w-full" item="item" lg={12} md={12} sm={12} xs={12}>
                                        <div style={{ fontSize: "12px", float: "right" }}>
                                            <table>
                                                <tr>
                                                    <td>From:</td>
                                                    <td>Counter pharmacist</td>
                                                </tr>
                                                <tr>
                                                    <td>Requested Date:</td>
                                                    <td>12/2/2021</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Table Section */}
                            <Grid container="container" className="mt-3 pb-5">

                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'} data={this.state.data} columns={this.state.columnsReturn} options={{
                                            pagination: false,
                                            serverSide: true,

                                            onTableChange: (action, tableState) => {
                                                console.log(action, tableState)
                                                switch (action) {
                                                    case 'changePage':
                                                        // this.setPage(     tableState.page )
                                                        break
                                                    case 'sort':
                                                        //this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:
                                                        console.log('action not handled.')
                                                }
                                            }
                                        }}></LoonsTable>
                                </Grid>

                            </Grid>
                            <Grid container="container" className="mt-3 pb-5">
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    {
                                        this.state.loading
                                            ? <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'} data={this.state.data} columns={this.state.columnsBatch} options={{
                                                    pagination: true,
                                                    serverSide: true,
                                                    count: this.state.totalItems,
                                                    rowsPerPage: 10,
                                                    page: this.state.page,
                                                    onTableChange: (action, tableState) => {
                                                        console.log(action, tableState)
                                                        switch (action) {
                                                            case 'changePage':
                                                                // this.setPage(     tableState.page )
                                                                break
                                                            case 'sort':
                                                                //this.sort(tableState.page, tableState.sortOrder);
                                                                break
                                                            default:
                                                        }
                                                    }
                                                }}></LoonsTable>
                                            : (
                                                //loading effect
                                                <Grid className="justify-center text-center w-full pt-12">
                                                    <CircularProgress size={30} />
                                                </Grid>
                                            )
                                    }

                                </Grid>
                            </Grid>
                            <Grid container="container" className="mt-3 pb-5">
                                <Grid item="item" lg={6} md={6} sm={12} xs={12}>
                                </Grid>
                                <Grid item="item" lg={6} md={6} sm={12} xs={12}>
                                    <Grid container="container" className="mt-3 pb-5">
                                        <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title="Remarks" />

                                        </Grid>
                                        <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>

                                            <TextareaAutosize style={{ width: "500px", height: "150px" }} aria-label="empty textarea" placeholder="Empty" minRows={6} />

                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>


                    </ValidatorForm>

                </LoonsCard>
            </MainContainer>
        )
    }
}

export default SetMinStock;