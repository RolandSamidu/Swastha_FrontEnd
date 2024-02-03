import { Button, CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Tooltip, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { LoonsCard, LoonsTable, MainContainer, SubTitle } from "app/components/LoonsLabComponents";
import LoonsButton from "app/components/LoonsLabComponents/Button";
import React from "react";
import { Component } from "react";
import SearchIcon from '@material-ui/icons/Search';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SimpleCard  from "app/components/cards/SimpleCard"
import { InfoOutlined } from "@material-ui/icons";

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
            columns: [
                {
                    name: 'No', // field name in the row object
                    label: 'NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'item_name', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'uom', // field name in the row object
                    label: 'UOM', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'min_pack', // field name in the row object
                    label: 'Min Pack Size', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'mystock_months', // field name in the row object
                    label: 'My Stock Months', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'mystock_quantity', // field name in the row object
                    label: 'My Stock Qty', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'test', // field name in the row object
                    label: 'Expiry total batches Qty', // column title that will be shown in table
            
                },
                {
                    name: 'no_of_batches', // field name in the row object
                    label: 'No of Batches', // column title that will be shown in table
            
                },
                {
                    name: 'test', // field name in the row object
                    label: 'Invoice No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'test', // field name in the row object
                    label: 'Batch No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'test', // field name in the row object
                    label: 'Exp Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'test', // field name in the row object
                    label: 'Batch Qty', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'test', // field name in the row object
                    label: 'consumable Time Period', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'total_remaining_days', // field name in the row object
                    label: 'system Estimated consumption for consumable time period', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'test', // field name in the row object
                    label: 'non moving surplus stock', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: "action",
                    label: "Action",
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="Edit">
                                        <IconButton
                                        >
                                            <Button color="primary">Return</Button>
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            );
                        }

                    }
                },
            ],
            totalItems: 0,
            page:1,
            minStockLevel: null,
            warehouse_id:"8688da15-9f31-40a5-83e8-4a603479155a"


        }
    }


    componentDidMount() {
      
    }
       


    render() {

        return (
            <MainContainer>
                <LoonsCard>
                    {/* <Grid container spacing={2}>
                        <Grid item lg={4} xs={12}>
                            <h5>Set Minimum Stock Level</h5>
                        </Grid>
                    </Grid> */}
                    {/* <ValidatorForm
                        onSubmit={() => console.log('updated')}
                        onError={() => null}
                        className="w-full">
                        <Grid container spacing={2}>
                            <Grid item lg={3} xs={6}>
                                <SubTitle title={'Minimum Stock Days :'}></SubTitle>
                                <TextValidator
                                    className=" w-full"
                                    placeholder="Enter Min Stock Days"
                                    name="phn"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    value={this.state.updateData.noOfDays}
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {
                                        let updateData =
                                            this.state.updateData
                                        updateData.noOfDays =
                                            e.target.value
                                        this.setState({ updateData })
                                    }}
                              
                                />
                            </Grid>
                            <Grid item lg={4} xs={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <LoonsButton><span className="capitalize">Update Values</span></LoonsButton>
                            </Grid>
                        </Grid>
                    </ValidatorForm> */}
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
                            <Typography variant="h6" className="font-semibold">Non Moving surplus stock</Typography>
                        </Grid>
                        {/* <Grid item="item">
                            <RadioGroup row="row" defaultValue="order">
                                <FormControlLabel value="order" control={<Radio />} label="Order"/>
                                <FormControlLabel value="exchange" control={<Radio />} label="Exchange"/>
                                <FormControlLabel value="return" control={<Radio />} label="Return"/>
                            </RadioGroup>
                        </Grid> */}
                    </Grid>  
                    <Grid container spacing={2}>
                        <Grid item lg={3} xs={12} className='mt-5'>
                            <h4 >Filters</h4>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                    </Grid>
                    <ValidatorForm
                        className="pt-2"
                        onSubmit={() => null}
                        onError={() => null}>
                        {/* Main Grid */}
                        <Grid container="container" spacing={2} direction="row">
                            <Grid item="item" xs={6} sm={6} md={6} lg={6}>
                                <Grid container="container" spacing={2}>
                                    {/* Ven */}
                                    <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                        <SubTitle title="Consumption" />
                                        <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_ven} onChange={(e, value) => {
                                            if (value != null) {
                                                let formData = this.state.formData
                                                formData.ven_id = value.id
                                                this.setState({ formData })
                                            }
                                        }}
                                            /*  defaultValue={this.state.all_district.find(
                                            (v) => v.id == this.state.formData.district_id
                                            )} */
                                            value={this
                                                .state
                                                .all_ven
                                                .find((v) => v.id == this.state.formData.ven_id)} getOptionLabel={(
                                                    option) => option.name
                                                        ? option.name
                                                        : ''} renderInput={(params) => (
                                                            <TextValidator {...params} placeholder="Ven"
                                                                //variant="outlined"
                                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                                        )} />
                                    </Grid>

                                    {/* Serial/Family Number */}
                                    <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                        <SubTitle title="Item Class" />
                                        <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_item_class} onChange={(e, value) => {
                                            if (value != null) {
                                                let formData = this.state.formData
                                                formData.item_class_id = value
                                                    .id
                                                this
                                                    .setState({ formData })
                                            }
                                        }}
                                            /*  defaultValue={this.state.all_district.find(
                                            (v) => v.id == this.state.formData.district_id
                                            )} */
                                            value={this
                                                .state
                                                .all_item_class
                                                .find((v) => v.id == this.state.formData.item_class_id)} getOptionLabel={(
                                                    option) => option.description
                                                        ? option.description
                                                        : ''} renderInput={(params) => (
                                                            <TextValidator {...params} placeholder="Item Class"
                                                                //variant="outlined"
                                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                                        )} />
                                    </Grid>

                                  
                                    {/* Serial Family Name*/}
                                    <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                        <SubTitle title="Item Category" />

                                        <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_item_category} onChange={(e, value) => {
                                            if (value != null) {
                                                let formData = this.state.formData
                                                formData.item_category_id = value
                                                    .id
                                                this
                                                    .setState({ formData })
                                            }
                                        }}
                                            /*  defaultValue={this.state.all_district.find(
                                            (v) => v.id == this.state.formData.district_id
                                            )} */
                                            value={this
                                                .state
                                                .all_item_category
                                                .find((v) => v.id == this.state.formData.item_category_id)} getOptionLabel={(
                                                    option) => option.description
                                                        ? option.description
                                                        : ''} renderInput={(params) => (
                                                            <TextValidator {...params} placeholder="Item Category"
                                                                //variant="outlined"
                                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                                        )} />
                                    </Grid>
                                    <Grid className=" w-full" item="item" lg={6} md={6} sm={12} xs={12}>
                                        <SubTitle title="Consumable time Period" />

                                        <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_item_category} onChange={(e, value) => {
                                            if (value != null) {
                                                let formData = this.state.formData
                                                formData.item_category_id = value
                                                    .id
                                                this
                                                    .setState({ formData })
                                            }
                                        }}
                                            /*  defaultValue={this.state.all_district.find(
                                            (v) => v.id == this.state.formData.district_id
                                            )} */
                                            value={this
                                                .state
                                                .all_item_category
                                                .find((v) => v.id == this.state.formData.item_category_id)} getOptionLabel={(
                                                    option) => option.description
                                                        ? option.description
                                                        : ''} renderInput={(params) => (
                                                            <TextValidator {...params} placeholder="Item Category"
                                                                //variant="outlined"
                                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                                        )} />
                                    </Grid>
                                    <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                        <SubTitle title="Short Expiry less than" />

                                        <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_item_category} onChange={(e, value) => {
                                            if (value != null) {
                                                let formData = this.state.formData
                                                formData.item_category_id = value
                                                    .id
                                                this
                                                    .setState({ formData })
                                            }
                                        }}
                                            /*  defaultValue={this.state.all_district.find(
                                            (v) => v.id == this.state.formData.district_id
                                            )} */
                                            value={this
                                                .state
                                                .all_item_category
                                                .find((v) => v.id == this.state.formData.item_category_id)} getOptionLabel={(
                                                    option) => option.description
                                                        ? option.description
                                                        : ''} renderInput={(params) => (
                                                            <TextValidator {...params} placeholder="Item Category"
                                                                //variant="outlined"
                                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                                        )} />
                                    </Grid>

                                    {/* Item Group*/}
                                    <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                        <SubTitle title="Item Group" />

                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.all_item_group}
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData = this.state.formData
                                                    formData.item_group_id = value
                                                        .id
                                                    this
                                                        .setState({ formData })
                                                }
                                            }}
                                            value={this
                                                .state
                                                .all_item_group
                                                .find((v) => v.id == this.state.formData.item_group_id)}
                                            getOptionLabel={(
                                                option) => option.description
                                                    ? option.description
                                                    : ''}
                                            renderInput={(params) => (
                                                <TextValidator {...params} placeholder="Item Group"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth" variant="outlined" size="small" />
                                            )} />
                                    </Grid>
                                   
                                </Grid>
                            </Grid>
                            <Grid item="item" xs={6} sm={6} md={6} lg={6}>
                                <Grid container="container" spacing={2}>
                                    <Grid className=" w-full" item="item" lg={6} md={6} sm={12} xs={12}>
                                      <SimpleCard>
                                        <span style={{fontSize:"30px",textAlign:"center"}}>05</span>
                                        <SubTitle title="Non Moving Items" /> 
                                      </SimpleCard> 
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Table Section */}
                            <Grid container="container" className="mt-3 pb-5">
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    {
                                        this.state.loading
                                            ? <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'} data={this.state.data} columns={this.state.columns} options={{
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
                                                            console.log('action not handled.')
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
                        </Grid>
                       
                          
                    </ValidatorForm>
                    
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default SetMinStock;