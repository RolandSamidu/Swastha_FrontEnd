
import React, { Component, Fragment } from "react";
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    FilePicker,
    LoonsTable,
    ImageView,
} from 'app/components/LoonsLabComponents';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Grid, IconButton, Tooltip ,CircularProgress } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import * as appConst from '../../../../appconst'
import Paper from "@material-ui/core/Paper";
import Buttons from "@material-ui/core/Button";
import MUIDataTable from "mui-datatables";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { dateParse, dateTimeParse } from "utils";

class AllEstimationReq extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
           
            formData: {
                estimation_id:'',
                estimation_type:'',
                title:'',
                duration:'',
                est_StartDate:'',
                est_EndDate:'',
                no_totalItem:'',
                no_selectedIns:'',
                
            },

            totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
            },

            data: [{estimation_id:"12"}],
            data2: [{estimation_2022:"12"}],
            estimation_type:[],
            dataRange:[],
           
            columns: [
                {
                    name: 'estimation_id', // field name in the row object
                    label: 'Estimation ID', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'unit_id', // field name in the row object
                    label: 'Unit ID', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'unit_name', // field name in the row object
                    label: 'Unit Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.data[dataIndex].ConsignmentItems[0].item_schedule.Order_item.purchase_order.order;
                        //     return (
                        //         <p>{data}</p>
                        //     );
                        // }
                    },
                },
                {
                    name: 'warehouse_type', // field name in the row object
                    label: 'Warehouse Type', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                       
                    },
                },
                {
                    name: 'estimation 2022', // field name in the row object
                    label: 'Estimation 2022', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'est_StartDate', // field name in the row object
                    label: 'Actual Consumption Estimation 2023', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.data[dataIndex].delivery_date;
                        //     return <p>{dateTimeParse(data)}</p>

                        // },
                    },
                },
                {
                    name: 'est_EndDate', // field name in the row object
                    label: 'Suggested Yearly Estimation 2023', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.data[dataIndex].updatedAt;
                        //     return <p>{dateTimeParse(data)}</p>

                        // },
                    },
                },
                {
                    name: 'no_totalItem', // field name in the row object
                    label: 'Estimation for 2023 ', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.data[dataIndex].updatedAt;
                        //     return <p>{dateTimeParse(data)}</p>

                        // },
                    },
                },
                {
                    name: 'no_selectedIns', // field name in the row object
                    label: 'Number of Selected Institutes ', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.data[dataIndex].updatedAt;
                        //     return <p>{dateTimeParse(data)}</p>

                        // },
                    },
                },
                {
                    name: 'estimation_recived_insitutes', // field name in the row object
                    label: 'Deviation', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        
                    },
                },
                {
                    name: 'estimation_pending_insitutes', // field name in the row object
                    label: 'Reason for deviation', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        
                    },
                },
            //     {
            //         name: 'status', // field name in the row object
            //         label: 'act', // column title that will be shown in table
            //         options: {
            //             filter: true,
            //             display: true,
                        
            //         },
            //     },
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                   options: {
                        filter: false,
                       
                        // customBodyRenderLite: (dataIndex) => {
                        //     let id = this.state.data[dataIndex].id;
                        //     return (
                        //         <Grid className="flex items-center">
                        //              <Tooltip title="Edit">
                        //                 <Buttons
                        //                 onClick={() => {
                        //                     // window.location.href = `/consignments/takeSample/${id}`
                        //                 }}
                        //                  color="primary" style={{ fontWeight: 'bold', marginTop: -3 }}>
                        //                    Create Est.Request
                        //                 </Buttons>
                        //             </Tooltip> 
                        //             <Grid className="px-2">
                        //                 <Tooltip title="View">
                        //                     <IconButton
                        //                         onClick={() => {
                        //                             // window.location.href = `/consignments/view-consignment/${id}`
                        //                         }}>
                        //                         <VisibilityIcon color='primary' />
                        //                     </IconButton>
                        //                 </Tooltip>
                        //             </Grid>
                        //         </Grid>
                        //     );
                        // }
                    }
                }
            ],
            columns2: [
                  {
                      name: 'estimation_2022', // field name in the row object
                      label: 'Estimation 2022', // column title that will be shown in table
                      options: {
                          filter: true,
                          display: true,
                          selectableRows: 'ht',
                      },
                  },
                  {
                      name: 'actual_consumption_2022', // field name in the row object
                      label: 'Actual Consumption 2022', // column title that will be shown in table
                      options: {
                          filter: true,
                          display: true,
                          selectableRows: 'ht',
                      },
                  },
                  {
                      name: 'standard_yearly_estimation_2023', // field name in the row object
                      label: 'Standard Yearly Estimation 2023', // column title that will be shown in table
                      options: {
                          filter: true,
                          display: true,
                          // customBodyRenderLite: (dataIndex) => {
                          //     let data = this.state.data[dataIndex].ConsignmentItems[0].item_schedule.Order_item.purchase_order.order;
                          //     return (
                          //         <p>{data}</p>
                          //     );
                          // }
                      },
                  },
                  {
                      name: 'warehouse_type', // field name in the row object
                      label: 'Estimation for 2023', // column title that will be shown in table
                      options: {
                          filter: true,
                          display: true,
                         
                      },
                  },
                  {
                      name: 'estimation 2022', // field name in the row object
                      label: 'Deviation', // column title that will be shown in table
                      options: {
                          filter: true,
                          display: true,
                          selectableRows: 'ht',
                      },
                  },
                 
              ],
  

            totalConsignment: 0

        }
    }

    // Load data onto table
    async loadData() {
        // this.setState({ loaded: false })

        // let res = await ConsignmentService.getAllConsignments(this.state.filterData)
        // if (res.status == 200) {
        //     this.setState(
        //         {
        //             loaded: true,
        //             data: res.data.view.data,
        //             totalPages: res.data.view.totalPages,
        //             totalItems: res.data.view.totalItems,
        //         },
        //         () => {
        //             this.render()
        //         }
        //     )
        // }
        // this.setState({
        //     totalConsignment: this.state.data.length
        // })

    }
    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState(
            {
                formData,
            },
            () => {
                this.loadData()
            }
        )
    }

    componentDidMount() {
        this.loadData()
    }

    handleFilterSubmit = (val) => {
        this.loadData()
    }

    onSubmit = () => {
        this.handleFilterSubmit({
            ldcn_ref_no: this.state.ldcn_ref_no,
            wdn_no: this.state.wdn_no,
            order_no: this.state.order_no,
            status: this.state.status,
        })
    }


    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        {/* <CardTitle title=" All Estimation Requests " /> */}

                        <Grid item lg={12} className=" w-full mt-2">
                        <h4>MED BAR get from estimate after fixing the backend</h4>
                        {this.state.loaded ?
                            <Grid container className="mt-5 pb-5">
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.data2}
                                        columns={this.state.columns2}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            print: false,
                                            viewColumns: false,
                                            download: false,
                                            count: this.state.totalItems,
                                            rowsPerPage: 20,
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
                                </Grid>
                            </Grid>
                            :
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress
                                    size={30}
                                />
                            </Grid>
                        }
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.onSubmit()}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex">
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                            <SubTitle title="Warehouse Type" />
                                            <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allDisplayingUnit}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.displayUnit = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    // value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
                                                    // )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Annual"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            // value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
                                                            // )}
                                                            // validators={[
                                                            //     'required',
                                                            // ]}
                                                            // errorMessages={[
                                                            //     'this field is required',
                                                            // ]}
                                                        />
                                                    )}
                                                />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                            <SubTitle title="Sub-Warehouse Type" />
                                            <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allDisplayingUnit}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.displayUnit = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    // value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
                                                    // )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Annual"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            // value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
                                                            // )}
                                                            // validators={[
                                                            //     'required',
                                                            // ]}
                                                            // errorMessages={[
                                                            //     'this field is required',
                                                            // ]}
                                                        />
                                                    )}
                                                />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                            <SubTitle title="Category" />
                                            <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allDisplayingUnit}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.displayUnit = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    // value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
                                                    // )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Annual"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            // value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
                                                            // )}
                                                            // validators={[
                                                            //     'required',
                                                            // ]}
                                                            // errorMessages={[
                                                            //     'this field is required',
                                                            // ]}
                                                        />
                                                    )}
                                                />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                            <SubTitle title="Level" />
                                            <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allDisplayingUnit}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.displayUnit = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    // value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
                                                    // )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Annual"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            // value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
                                                            // )}
                                                            // validators={[
                                                            //     'required',
                                                            // ]}
                                                            // errorMessages={[
                                                            //     'this field is required',
                                                            // ]}
                                                        />
                                                    )}
                                                />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                            <SubTitle title="Estimation Range" />
                                            <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allDisplayingUnit}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.displayUnit = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    // value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
                                                    // )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Annual"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            // value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
                                                            // )}
                                                            // validators={[
                                                            //     'required',
                                                            // ]}
                                                            // errorMessages={[
                                                            //     'this field is required',
                                                            // ]}
                                                        />
                                                    )}
                                                /></Grid>
                                                 <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                                <TextValidator
                                            className=" w-full mt-5"
                                            placeholder="From"
                                            name="order_list"
                                            InputLabelProps={{ shrink: false }}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            value={this.state.filterData.order_no}
                                            onChange={(e) => {
                                                let filterData = this.state.filterData;
                                                filterData.order_no = e.target.value;
                                                this.setState({ filterData })
                                            }}
                                            // validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        /></Grid>
                                          <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    ><TextValidator
                                        className=" w-full mt-5"
                                        placeholder="To"
                                        name="order_list"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.filterData.order_no}
                                        onChange={(e) => {
                                            let filterData = this.state.filterData;
                                            filterData.order_no = e.target.value;
                                            this.setState({ filterData })
                                        }}
                                        // validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                    </Grid>
                                    
                                </Grid>
                                <Grid container spacing={1} className="flex">
                                <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Search" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Search"
                                            name="order_list"
                                            InputLabelProps={{ shrink: false }}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            value={this.state.filterData.order_no}
                                            onChange={(e) => {
                                                let filterData = this.state.filterData;
                                                filterData.order_no = e.target.value;
                                                this.setState({ filterData })
                                            }}
                                            // validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />

                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid
                                            className=" flex " item lg={2} md={2} sm={12} xs={12}
                                        >
                                            <Grid
                                                style={{ marginTop: 10 }}
                                            >
                                                <Button
                                                    className="mt-4"
                                                    progress={false}
                                                    type="submit"
                                                    scrollToTop={true}
                                                >
                                                    <span className="capitalize">Search</span>
                                                </Button>
                                            </Grid>

                                          
                                        </Grid>
                                    </Grid>
                                  
                                </Grid>

                            </ValidatorForm>
                        </Grid>

                        {/*Table*/}
                        <Grid style={{ marginTop: 20 }}>

                        {this.state.loaded ?
                            <Grid container className="mt-5 pb-5">
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            print: false,
                                            viewColumns: false,
                                            download: false,
                                            count: this.state.totalItems,
                                            rowsPerPage: 20,
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
                                </Grid>
                            </Grid>
                            :
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress
                                    size={30}
                                />
                            </Grid>
                        }
                        
                        </Grid>
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )
    }
}

export default AllEstimationReq
