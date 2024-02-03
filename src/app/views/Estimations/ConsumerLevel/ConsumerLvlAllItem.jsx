
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
import { Grid, IconButton, Tooltip ,CircularProgress,Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, 
    Typography} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import * as appConst from '../../../../appconst'
import Paper from "@material-ui/core/Paper";
import Buttons from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';

import MUIDataTable from "mui-datatables";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { dateParse, dateTimeParse } from "utils";

class ConsumerLvlAllItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            reasonDialogBox:false,
            requestDialog:false,
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
            estimation_type:[],
            dataRange:[],
           
            columns: [
                {
                    name: 'sr', // field name in the row object
                    label: 'SR', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'itemName', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'ven', // field name in the row object
                    label: 'VEN', // column title that will be shown in table
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
                    name: 'uom', // field name in the row object
                    label: 'UOM', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                       
                    },
                },
                {
                    name: 'unitprice', // field name in the row object
                    label: 'Unit Price', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'est_StartDate', // field name in the row object
                    label: 'Estimation 2022', // column title that will be shown in table
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
                    label: 'Actual Consumption 2022 ', // column title that will be shown in table
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
                    label: 'Standard Yearly Estimation 2023 ', // column title that will be shown in table
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
                    label: 'Estimation for 2023 ', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id;
                            return (
                                <Grid className="flex items-center">
                                    <Grid className="px-2">
                                    {/* <TextValidator
                                            className="w-full"
                                            placeholder="Estimation"
                                            name=""
                                            InputLabelProps={{shrink: false}}
                                            value={this.state.description}
                                            type="number"
                                           
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData = this.state.formData;
                                                formData.description = e.target.value;
                                                this.setState({formData})
                                            }}
                                        /> */}
                                    </Grid>
                                </Grid>
                            );
                        }
                    },
                },
                {
                    name: 'estimation_recived_insitutes', // field name in the row object
                    label: 'Monthly Allocation Method', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id;
                            return (
                                <Grid className="flex items-center">
                                    <Grid className="px-2">
                                    {/* <Autocomplete
                                        disableClearable
                                            options={this.state.redoData}
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.name = value.name
                                                this.setState({formData})
                                            }}
                                            getOptionLabel={
                                                (option) => option.name
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.formData.name}
                                                />
                                            )}/>
  */}
                                    </Grid>
                                </Grid>
                            );
                        }
                    },
                },
                {
                    name: 'deviation', // field name in the row object
                    label: 'Deviation', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        
                    },
                },
                {
                    name: 'reason_for_deviation', // field name in the row object
                    label: 'Reason for Deviation', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id;
                            return (
                                <Grid className="flex items-center">
                                    <Grid className="px-2">
                                        <Tooltip title="Add">
                                            <IconButton
                                                onClick={() => {
                                                    this.setState({
                                                        reasonDialogBox:true
                                                    })
                                                }}>
                                                <AddIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            );
                        }
                        
                    },
                },
              
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                   options: {
                        filter: false,
                       
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id;
                            return (
                                <Grid className="flex items-center">
                                     <Tooltip title="Edit">
                                        <Buttons
                                        onClick={() => {
                                            // window.location.href = `/consignments/takeSample/${id}`
                                        }}
                                         color="primary" style={{ fontWeight: 'bold', marginTop: -3 }}>
                                           All Estimations
                                        </Buttons>
                                    </Tooltip> 
                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    // window.location.href = `/consignments/view-consignment/${id}`
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
                        <CardTitle title="Annual Estimation Request for year 2023" />
                        <LoonsCard>
                        <Grid className='mt-3' container spacing={2}>
                                        <Grid
                                         className=" w-full"
                                         item
                                         lg={8}
                                         md={8}
                                         sm={12}
                                         xs={12}>
                                        <Typography variant="h6" style={{ fontSize: 16, color: 'black' }}>Time Period:</Typography>

                                         </Grid>
                                         <Grid
                                         className=" w-full"
                                         item
                                         lg={4}
                                         md={4}
                                         sm={12}
                                         xs={12}>
                                        <Typography variant="h6" style={{ fontSize: 16, color: 'black' }}> Estimation ID</Typography>

                                         </Grid>
                                         <Grid
                                         className=" w-full"
                                         item
                                         lg={8}
                                         md={8}
                                         sm={12}
                                         xs={12}>
                                        <Typography variant="h6" style={{ fontSize: 16, color: 'black' }}> Requested Date:</Typography>

                                         </Grid>
                                         <Grid
                                         className=" w-full"
                                         item
                                         lg={4}
                                         md={4}
                                         sm={12}
                                         xs={12}>
                                         </Grid>
                                         <Grid
                                         className=" w-full"
                                         item
                                         lg={6}
                                         md={6}
                                         sm={12}
                                         xs={12}>
                                         <Typography variant="h6" style={{ fontSize: 16, color: 'black' }}> Deadline</Typography>

                                         </Grid>
                                         <Grid
                                         className=" w-full"
                                         item
                                         lg={4}
                                         md={4}
                                         sm={12}
                                         xs={12}>
                                         <Typography variant="h6" style={{ fontSize: 16, color: 'black' }}> Remain Time Period: </Typography>

                                         </Grid>
                                         <Grid
                                         className=" w-full"
                                         item
                                         lg={2}
                                         md={2}
                                         sm={12}
                                         xs={12}>
                                        <Button onClick={() => {
                                            this.setState({
                                                requestDialog : true
                                            })
                                        }}>Request Extention</Button>
   
                                            </Grid>   
                                        </Grid>

                        </LoonsCard>
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
                                            <SubTitle title="Item Type" />
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
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
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
                                            <SubTitle title="Item Group" />
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
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
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
                                            <SubTitle title="Item Category" />
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
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
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
                                            <SubTitle title="VEN" />
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
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
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
                                            <SubTitle title="Price Range" />
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
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
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
                                        <SubTitle title="From" />
                                        <TextValidator
                                            className=" w-full"
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
                                        <SubTitle title="To" />
                                        <TextValidator
                                            className=" w-full"
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
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Deviation From" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Deviation From"
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
                                        lg={3}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Deviation To" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Deviation To"
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
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
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
                                        <SubTitle title="From" />
                                        <TextValidator
                                            className=" w-full"
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
                                        <SubTitle title="To" />
                                        <TextValidator
                                            className=" w-full"
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
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Typography>Item Estimated</Typography>
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Typography>Item Pending</Typography>
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Typography>Item Count</Typography>
                                    </Grid>
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
                                    {/* <Grid
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
                                                // window.open('/spc/consignment/create');
                                            }}
                                            scrollToTop={true}
                                            startIcon="add"
                                        >
                                            <span className="capitalize">Add new Estimation</span>
                                        </Button>
                                    </Grid> */}
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
                    <Dialog
                            open={this.state.requestDialog}
                            onClose={() => {
                                this.setState({requestDialog: false})
                            }}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Reason for Redo"}</DialogTitle>
                            <DialogContent>
                                <Grid className=" w-full flex " item lg={12} md={12} sm={12} xs={12} style={{marginTop: 25,}}>
                                    {/* <ValidatorForm className=" w-full" item lg={12} md={12} sm={12} xs={12}> */}
                                        {/* <Autocomplete
                                        disableClearable
                                            options={this.state.redoData}
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.name = value.name
                                                this.setState({formData})
                                            }}
                                            getOptionLabel={
                                                (option) => option.name
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.formData.name}
                                                />
                                            )}
                                        /> */}
                                    {/* </ValidatorForm> */}
                                </Grid>
                            </DialogContent>
                            <DialogContent>
                                <Grid className=" w-full flex " item lg={12}
                                      md={12} sm={12} xs={12} style={{marginTop: 25,}}>
                                    <ValidatorForm className=" w-full" item lg={12} md={12} sm={12} xs={12}
                                                   style={{marginLeft: 10}}>
                                         <SubTitle title="Reason" />   
                                      <TextValidator
                                            className="w-full"
                                            placeholder="Reason"
                                            name="reason"
                                            InputLabelProps={{shrink: false}}
                                            value={this.state.description}
                                            type="text"
                                            multiLine
                                            rows={3}
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData = this.state.formData;
                                                formData.description = e.target.value;
                                                this.setState({formData})
                                            }}
                                        />
                                    </ValidatorForm>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    className="mt-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    onClick={() => {
                                        this.createNewRedoReason()//change this
                                    }}
                                >
                                    <span className="capitalize">Send</span>
                                </Button>
                            </DialogActions>
                        </Dialog>
                    <Dialog
                            open={this.state.reasonDialogBox}
                            onClose={() => {
                                this.setState({reasonDialogBox: false})
                            }}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Reason for Redo"}</DialogTitle>
                            <DialogContent>
                                <Grid className=" w-full flex " item lg={12} md={12} sm={12} xs={12} style={{marginTop: 25,}}>
                                    {/* <ValidatorForm className=" w-full" item lg={12} md={12} sm={12} xs={12}> */}
                                        {/* <Autocomplete
                                        disableClearable
                                            options={this.state.redoData}
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.name = value.name
                                                this.setState({formData})
                                            }}
                                            getOptionLabel={
                                                (option) => option.name
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.formData.name}
                                                />
                                            )}
                                        /> */}
                                    {/* </ValidatorForm> */}
                                </Grid>
                            </DialogContent>
                            <DialogContent>
                                <Grid className=" w-full flex " item lg={12}
                                      md={12} sm={12} xs={12} style={{marginTop: 25,}}>
                                    <ValidatorForm className=" w-full" item lg={12} md={12} sm={12} xs={12}
                                                   style={{marginLeft: 10}}>
                                        <TextValidator
                                            className="w-full"
                                            placeholder="Deviation"
                                            name="deviation"
                                            InputLabelProps={{shrink: false}}
                                            value={this.state.description}
                                            type="text"
                                            multiLine
                                            rows={3}
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData = this.state.formData;
                                                formData.description = e.target.value;
                                                this.setState({formData})
                                            }}
                                        />
                                    </ValidatorForm>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    className="mt-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    onClick={() => {
                                        this.createNewRedoReason()
                                    }}
                                >
                                    <span className="capitalize">Confirm Redo</span>
                                </Button>
                            </DialogActions>
                        </Dialog>

                </MainContainer>
                
            </Fragment>
        
        )
    }
}

export default ConsumerLvlAllItem
