
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
import * as appConst from '../../../appconst'
import Paper from "@material-ui/core/Paper";
import Buttons from "@material-ui/core/Button";
import MUIDataTable from "mui-datatables";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { dateParse, dateTimeParse } from "utils";
import EstimationService from 'app/services/EstimationService'
import localStorageService from 'app/services/localStorageService';

class RMSDAllEstimationRequests extends Component {
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
            role:null,
            totalItems: 0,
            filterData: {
                to:null,
                from:null,
                type:null,
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
            },

            data: [{estimation_id:"12"}],
            estimation_type:[],
            dataRange:[],
           
            columns: [
                {
                    name: 'code', // field name in the row object
                    label: 'Estimation ID', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'type', // field name in the row object
                    label: 'Estimation Type', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'massage', // field name in the row object
                    label: 'Title', // column title that will be shown in table
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
                    name: 'from', // field name in the row object
                    label: 'Time Period', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].from;
                            return <p>{dateParse(data)}</p>

                        },
                       
                    },
                },
                {
                    name: 'duration', // field name in the row object
                    label: 'Duration', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                        
                    },
                },
                {
                    name: 'start_date', // field name in the row object
                    label: 'Estimated Start Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].start_date;
                            return <p>{dateParse(data)}</p>

                        },
                    },
                },
                {
                    name: 'end_date', // field name in the row object
                    label: 'Estimated End Date ', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].end_date;
                            return <p>{dateParse(data)}</p>

                        },
                    },
                },
                // {
                //     name: 'no_totalItem', // field name in the row object
                //     label: 'Number of Total Items ', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         // customBodyRenderLite: (dataIndex) => {
                //         //     let data = this.state.data[dataIndex].updatedAt;
                //         //     return <p>{dateTimeParse(data)}</p>

                //         // },
                //     },
                // },
                // {
                //     name: 'no_selectedIns', // field name in the row object
                //     label: 'Number of Selected Institutes ', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         // customBodyRenderLite: (dataIndex) => {
                //         //     let data = this.state.data[dataIndex].updatedAt;
                //         //     return <p>{dateTimeParse(data)}</p>

                //         // },
                //     },
                // },
                // {
                //     name: 'estimation_recived_insitutes', // field name in the row object
                //     label: 'Estimation Recived Insititutes', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                        
                //     },
                // },
                // {
                //     name: 'estimation_pending_insitutes', // field name in the row object
                //     label: 'Estimation Pending Insititutes', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                        
                //     },
                // },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        
                    },
                },
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                   options: {
                        filter: false,
                       
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id;
                            let warehouse_id =this.state.data[dataIndex].warehouse_id
                            return (
                                <Grid className="flex items-center">
                                     {/* <Tooltip title="Edit">
                                        <Buttons
                                        onClick={() => {
                                            // window.location.href = `/consignments/takeSample/${id}`
                                        }}
                                         color="primary" style={{ fontWeight: 'bold', marginTop: -3 }}>
                                           Create Est.Request
                                        </Buttons>
                                    </Tooltip>  */}
                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/estimation/rmsd-set-item-estimation/${id}`
                                                }}>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            );
                        }
                    }
                }
            ],

            totalConsignment: 0

        }
    }

    // Load data onto table
    async loadData() {
        this.setState({ loaded: false })

        let res = await EstimationService.getAllEstimations(this.state.filterData)
        if (res.status == 200) {
            this.setState(
                {
                    loaded: true,
                    data: res.data.view.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                }
            )
        }
       
    }
    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }

    async componentDidMount() {
        this.loadData()

        let role = await localStorageService.getItem('login_user_pharmacy_drugs_stores')
        console.log('role',role.type)
        this.setState({
            role:role
        })
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
                        <CardTitle title=" All Estimation Requests " />

                        <Grid item lg={12} className=" w-full mt-2">
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
                                            <SubTitle title="Estimation Type" />
                                            <Autocomplete
                                        disableClearable
                                                        className="w-full"
                                                        options={
                                                            appConst.estimation_type
                                                        }
                                                        onChange={(
                                                            e,
                                                            value
                                                        ) => {
                                                            if (value != null) {
                                                                let filterData =
                                                                    this.state
                                                                        .filterData
                                                                filterData.type =
                                                                    value.label
                                                                this.setState({
                                                                    filterData,
                                                                })
                                                            }
                                                        }}
                                                        defaultValue={{
                                                            label: this.state
                                                                .filterData
                                                                .type,
                                                        }}
                                                        value={{
                                                            label: this.state
                                                                .filterData
                                                                .type,
                                                        }}
                                                        validators={['required']}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]} 
                                                        getOptionLabel={(
                                                            option
                                                        ) => option.label}
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Estimation Type"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                            />
                                                            
                                                        )}
                                                    />
                                    </Grid>
                                    {/* <Grid  item
                                        lg={3}
                                        md={2}
                                        sm={12}
                                        xs={12}>
                                    <SubTitle title="Date Range" />
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
                                                            placeholder="Date Range"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            // value={this.state.allDisplayingUnit.find((obj) => obj.id == this.state.formData.displayUnit
                                                            // )}
                                                           
                                                        />
                                                    )}
                                                />


                                    </Grid> */}
  

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                       <SubTitle title="From" />
                                            <DatePicker
                                                className="w-full"
                                                value={
                                                    this.state.filterData
                                                        .from
                                                }
                                                placeholder="From"
                                                // minDate={new Date()}
                                                maxDate={new Date()}
                                                // required={true}
                                                // errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let filterData =
                                                        this.state
                                                            .filterData
                                                    filterData.from =dateParse(date)
                                                        
                                                    this.setState({
                                                        filterData,
                                                    })
                                                }}
                                            />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={3}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="To" />
                                            <DatePicker
                                                className="w-full"
                                                value={
                                                    this.state.filterData
                                                        .dateParse
                                                }
                                                placeholder="To"
                                                // minDate={new Date()}
                                                maxDate={new Date()}
                                                // required={true}
                                                // errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let filterData =
                                                        this.state
                                                            .filterData
                                                    filterData.dateParse =
                                                    dateParse(date)
                                                    this.setState({
                                                        filterData,
                                                    })
                                                }}
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

                                            {/* <Grid
                                                style={{ marginTop: 17, marginLeft: 4 }}
                                            >
                                                <Button
                                                    variant="outlined"
                                                    style={{ margin: 4 }}
                                                >
                                                    <span className="capitalize">Reset</span>
                                                </Button>
                                            </Grid> */}
                                        </Grid>
                                    </Grid>
                                    {this.state.role === 'MSD MSA'|| this.state.role === 'MSD Distribution Officer'|| this.state.role === 'MSD Director'||this.state.role === 'Distribution Officer'  ?<div>
                                    <Grid
                                        className=" w-full flex-end"
                                        item
                                        lg={6}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Button
                                            className="mt-6 flex-end"
                                            progress={false}
                                            onClick={() => {
                                                window.open('/estimation/estimation-detailsTab');
                                            }}
                                            scrollToTop={true}
                                            startIcon="add"
                                        >
                                            <span className="capitalize">Add new Estimation</span>
                                        </Button>
                                    </Grid>

                                    </div> : null}
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
                                            page: this.state.filterData.page,
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

export default RMSDAllEstimationRequests
