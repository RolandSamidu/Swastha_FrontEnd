import React, { Component, Fragment } from "react";
import { Button, CardTitle, LoonsCard, LoonsTable, MainContainer, SubTitle } from "../../../components/LoonsLabComponents";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Grid, IconButton, Tooltip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import * as appConst from "../../../../appconst";
import Paper from "@material-ui/core/Paper";
import Buttons from "@material-ui/core/Button";
import MUIDataTable from "mui-datatables";
import ConsignmentService from "../../../services/ConsignmentService";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import { dateParse, dateTimeParse } from "utils";
import localStorageService from "app/services/localStorageService";
import SPCServices from "app/services/SPCServices";

class ViewConsignmentList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            ldcn_ref_no: '',
            wdn_no: '',
            order_no: '',
            status: '',
            formData: {
                ldcn_ref_no: '',
                wdn_no: '',
                order_no: '',
                status: '',
            },
            totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
                ldcn_ref_no: '',
                invoice_no: null,
                wdn_no: '',
                order_no: '',
                status: '',
                allstatus: true,
                'order[0]': ['updatedAt', 'DESC'],
            },
            data: [],
            debitData: [],
            columns: [
                {
                    name: 'invoice_no', // field name in the row object
                    label: 'Invoice No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'ldcn_ref_no', // field name in the row object
                    label: 'LDCN ref No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'Shipment_no',
                    label: 'Wharf ref No',
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                        customBodyRenderLite: (dataIndex) => {
                            let dataId = this.state.data[dataIndex]?.id;
                            let consignmentToShipmentMap = {};
                
                            // Create a map of consignment IDs to their corresponding debit note shipment numbers
                            this.state.debitData.forEach(debitItem => {
                                let consignmentId = debitItem?.Consignment?.id;
                                if (consignmentId) {
                                    consignmentToShipmentMap[consignmentId] = debitItem?.Consignment?.shipment_no;
                                }
                            });
                
                            let shipmentNo = consignmentToShipmentMap[dataId];
                            return <p>{shipmentNo}</p>;
                        }
                    }
                },                
                {
                    name: 'order_no', // field name in the row object
                    label: 'MSD Order List No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            //let data = this.state.data[dataIndex]?.ConsignmentItems[0]?.item_schedule.Order_item.purchase_order.order;
                            let data = this.state.data[dataIndex]?.order_no;
                            return (
                                <p>{data}</p>
                            );
                        }
                    },
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'delivery_date', // field name in the row object
                    label: 'Delivery Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].delivery_date;
                            return <p>{dateTimeParse(data)}</p>

                        },
                    },
                },
                {
                    name: 'update_date', // field name in the row object
                    label: 'Updated Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].updatedAt;
                            return <p>{dateTimeParse(data)}</p>

                        },
                    },
                },
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: false,

                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id;
                            let status = this.state.data[dataIndex].status;
                            console.log("aaaa", status)
                            if (status != "Confirmed By AD" && status != "Active" && status != "Waiting For AD Approval") {
                                return (
                                    <Grid className="flex items-center">
                                        <Tooltip title=" Collect Samples">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/consignments/takeSample/${id}`
                                                }}>
                                                <PlaylistAddIcon color='primary' />
                                            </IconButton>

                                        </Tooltip>
                                        <Grid className="px-2">
                                            <Tooltip title="View">
                                                <IconButton
                                                    onClick={() => {
                                                        window.location.href = `/consignments/view-consignment/${id}`
                                                    }}>
                                                    <VisibilityIcon color='primary' />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>


                                );
                            } else {
                                return (
                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/consignments/view-consignment/${id}`
                                                }}>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                )
                            }

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
        let user_info = await localStorageService.getItem('userInfo')
        let lmParams = {}

        if (user_info?.roles.includes('Local Manufacturer') || user_info?.roles.includes('Drug Store Keeper')) {
            lmParams.created_by=user_info.id
        }

        let res = await ConsignmentService.getAllConsignments({ ...this.state.filterData,...lmParams, status: this.state.filterData?.status?.label })
        console.log('resID', res?.data?.view?.data)
        if (res.status == 200) {
            this.setState(
                {
                    loaded: true,
                    data: res?.data?.view?.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                }
            )
        }
        let consignmentData = res?.data?.view?.data || []
        // console.log('consignmentData', consignmentData)
        // console.log('test1')
        let consignmentID = consignmentData.map(a => a?.id)
        // console.log("consignmentID", consignmentID)
        // console.log('test2')
        let params = {
            consignment_id: consignmentID,
            is_active: true
        }
        let wharfRes = await SPCServices.getAllDebitNotes(params);
        // console.log('wharfRes', wharfRes)
        // console.log('test3')
        // let shipmentData = wharfRes?.data?.view?.data || [];
        // let shipmentId = shipmentData.map(a => a?.Consignment?.id)
        // console.log('shipmentId', shipmentId)
        // console.log("test4")

        if(wharfRes.status == 200){
            this.setState({
                loaded: true,
                debitData: wharfRes?.data?.view?.data || [],
            }, () => {
                this.render()
            })
        }
        this.setState({
            totalConsignment: this.state.data.length
        })

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

    reset = () => {
        this.setState({
            filterData: {
                limit: 20,
                page: 0,
                ldcn_ref_no: '',
                wdn_no: '',
                order_no: '',
                status: { label: "" },
                'order[0]': ['updatedAt', 'DESC'],
                page: 0,
                limit: 20
            }
        }, () => this.handleFilterSubmit());


    }

    componentDidMount() {
        this.loadData()
    }

    handleFilterSubmit = (val) => {
        this.loadData()
    }

    onSubmit = () => {
        this.handleFilterSubmit();
    }


    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title=" View Consignments " />

                        <Grid item lg={12} className=" w-full mt-2">
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.setPage(0)}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex">


                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Invoice No" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Please Enter"
                                            name="invoice_no"
                                            InputLabelProps={{ shrink: false }}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            value={this.state.filterData.invoice_no}
                                            onChange={(e) => {
                                                let filterData = this.state.filterData;
                                                filterData.invoice_no = e.target.value;
                                                this.setState({ filterData })
                                            }}
                                        // validators={['required']}
                                        /* errorMessages={[
                                            'this field is required',
                                        ]} */
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
                                        <SubTitle title="LDCN number" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Please Enter"
                                            name="user_id"
                                            InputLabelProps={{ shrink: false }}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            value={this.state.filterData.ldcn_ref_no}
                                            onChange={(e) => {
                                                let filterData = this.state.filterData;
                                                filterData.ldcn_ref_no = e.target.value;
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
                                        <SubTitle title="WDN number" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Please Enter"
                                            name="user_id"
                                            InputLabelProps={{ shrink: false }}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            value={this.state.filterData.wdn_no}
                                            onChange={(e) => {
                                                let filterData = this.state.filterData;
                                                filterData.wdn_no = e.target.value;
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
                                        md={3}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Order List" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Please Enter"
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
                                        <SubTitle title="Status" />
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={appConst.order_status}
                                            value={this.state.filterData.status}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.status = value;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.status}
                                                />
                                            )}
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
                                        <SubTitle title="Search" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Please Enter"
                                            name="order_list"
                                            InputLabelProps={{ shrink: false }}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            value={this.state.filterData.search}
                                            onChange={(e) => {
                                                let filterData = this.state.filterData;
                                                filterData.search = e.target.value;
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

                                        <Button
                                            style={{ marginTop: "25px" }}
                                            // className="mt-2"
                                            progress={false}
                                            type="submit"
                                            scrollToTop={true}
                                        >
                                            <span className="capitalize">Search</span>
                                        </Button>

                                        &ensp;
                                        <Button
                                            variant="outlined"
                                            style={{ marginTop: "25px" }}
                                            onClick={this.reset}
                                        >
                                            <span className="capitalize">Reset</span>
                                        </Button>
                                    </Grid>


                                </Grid>
                            </ValidatorForm>


                        </Grid>



                        <Grid className=" w-full" spacing={1} style={{ marginTop: 20, backgroundColor: 'red' }}>
                            <Paper elevation={0} square
                                style={{ backgroundColor: '#E6F6FE', border: '1px solid #DEECF3', height: 40 }}>
                                <Grid item lg={12} className=" w-full mt-2">
                                    <Grid container spacing={1} className="flex">
                                        <Grid
                                            item
                                            lg={2}
                                            md={2}
                                            sm={4}
                                            xs={4}
                                            spacing={2}
                                            style={{ marginLeft: 10 }}
                                        >
                                            <SubTitle title={`Total Consignments: ${this.state.totalConsignment}`} />
                                        </Grid>

                                        <Grid
                                            item
                                            lg={3}
                                            md={3}
                                            sm={2}
                                            xs={2}
                                            spacing={2}
                                        >
                                            <Button
                                                className=""
                                                progress={false}
                                                onClick={() => {
                                                    window.location.href = '/spc/consignment/create'
                                                    // window.open();
                                                }}
                                                scrollToTop={true}
                                                startIcon="add"
                                            >
                                                <span className="capitalize">New</span>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        {/*Table*/}
                        <Grid style={{ marginTop: 20 }}>

                            {
                                this.state.loaded ?
                                    <LoonsTable
                                        id={"CONSIGNMENT_ORDERS"}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: 20,
                                            page: this.state.filterData.page,
                                            //selectableRows: 'single',

                                            onTableChange: (action, tableState) => {
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setPage(tableState.page)
                                                        break;
                                                    case 'sort':
                                                        break;
                                                    default:
                                                        console.log('action not handled.');
                                                }
                                            }

                                        }
                                        }
                                    >
                                        <MUIDataTable
                                            title='gvrv'
                                            data={this.state.data}
                                            columns={this.state.columns}
                                        // options={merge({}, defaultOptions, data.options)}
                                        />
                                    </LoonsTable> : ' '
                            }
                        </Grid>
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )
    }
}

export default ViewConsignmentList
