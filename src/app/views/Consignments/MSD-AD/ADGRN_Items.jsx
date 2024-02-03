import React, { Component, Fragment } from "react";
import * as apiroutes from '../../../../apiroutes'
import axios from 'myaxios';
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsTable,
    MainContainer,
    LoonsSnackbar,
    SubTitle
} from "../../../components/LoonsLabComponents";
import { CircularProgress, Grid, Tooltip, IconButton } from "@material-ui/core";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";
import * as appConst from "../../../../appconst";
import Paper from "@material-ui/core/Paper";
import Buttons from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ReceiptIcon from '@material-ui/icons/Receipt';
import ConsignmentService from "../../../services/ConsignmentService";
import localStorageService from "app/services/localStorageService";
import { dateParse } from "utils";
import { filter } from "lodash";
import DonationEnteredList from '../../Donations/Print/DonationEnteredList';


class GRN_Items extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            totalConsignment: 0,
            grn_type:null,
            grn_dontation_id:null,
            totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
                grn_id: this.props.match.params.id,
                'order[0]': ['updatedAt', 'DESC'],
            },
            grn_status: null,
            data: [],
            columns: [
                {
                    name: 'GrnNo', // field name in the row object
                    label: 'GRN No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.GRN?.grn_no
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'srNo', // field name in the row object
                    label: 'SR No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.ItemSnap?.sr_no
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Item Name', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.ItemSnap?.medium_description
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Batch', // field name in the row object
                    label: 'Batch', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.batch_no
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },

                {
                    name: 'MFD', // field name in the row object
                    label: 'MFD', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.mfd
                                ;
                            return (
                                <p>{dateParse(data)}</p>
                            )
                        }
                    },
                },
                {
                    name: 'exd', // field name in the row object
                    label: 'EXD', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.exd
                                ;
                            return (
                                <p>{dateParse(data)}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Pack Size', // field name in the row object
                    label: 'Pack Size', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.pack_size
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Unit Price', // field name in the row object
                    label: 'Unit Price', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.unit_price
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Order Qty', // field name in the row object
                    label: 'Order Qty', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ConsignmentItemBatch?.quantity;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Received Qty', // field name in the row object
                    label: 'Received Qty', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.quantity;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Damage', // field name in the row object
                    label: 'Damage', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.damage;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Shortage', // field name in the row object
                    label: 'Shortage', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.shortage;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Excess', // field name in the row object
                    label: 'Excess', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.excess;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },


            ],
            alert: false,
            message: "",
            severity: 'success',
        }
    }


    async loadData() {
        this.setState({ loaded: false })

        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)

        let filterData = this.state.filterData;
        filterData.grn_id = this.props.match.params.id;

        //filterData.msa_id = user.id;


        let res = await ConsignmentService.getGRNItems(filterData)
        console.log('id', filterData)
        console.log('res', res.data.view.data,)
        if (res.status == 200) {
            this.setState(
                {   grn_no2:res.data.view.data[0]?.GRN?.grn_no,
                    loaded: true,
                    data: res.data.view.data,
                    grn_status: res.data.view.data[0]?.GRN?.status,
                    grn_type: res.data.view.data[0]?.GRN?.type,
                    grn_dontation_id:res.data.view.data[0]?.GRN?.donation_id,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                }
            )
        }


    }

    componentDidMount() {
        this.loadData();
    }

    handleFilterSubmit = (val) => {
        this.loadData()
    }



    async approvedGrn(id, data) {
        let res = await ConsignmentService.editGRNStatus(id, data);
        if (res.status == 200) {
            this.setState({
                alert: true,
                severity: 'success',
                message: 'GRN Save Successfull',
            }, () => {
                this.loadData()
            })

        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: 'GRN Save Unsuccessfull',
            })
        }
    }


    async setPage(page) {
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

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="GRN Items " />

                        <Grid lg={12} className=" w-full mt-2" spacing={2} style={{ marginTop: 20 }}>

                            {
                                this.state.loaded ?
                                    <div className="pt-0">
                                        <LoonsTable
                                            id={"GRN_items"}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: false,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: 20,
                                                page: this.state.filterData.page,

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
                                        </LoonsTable>
                                    </div>
                                    :
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                            }
                        </Grid>

                        {this.state.grn_status == "PARTIALLY COMPLETED" || this.state.grn_status == "COMPLETED" ?
                            <Grid className="mt-5" container spacing={2}>
                                <Grid item>
                                    <Button
                                        color='primary'
                                        variant="contained"
                                        onClick={() => { this.approvedGrn(this.props.match.params.id, { status: this.state.grn_status == "PARTIALLY COMPLETED"?"APPROVED PARTIALLY COMPLETED":"APPROVED COMPLETED" }) }}
                                    >
                                        Approve
                                    </Button>
                                </Grid>

                                <Grid item>
                                    <Button
                                        className="button-danger"
                                        variant="contained"
                                        onClick={() => { this.approvedGrn(this.props.match.params.id, { status: "REJECTED" }) }}
                                    >
                                        Reject
                                    </Button>
                                </Grid>

                            </Grid>
                            : null}
                            {this.state.grn_type == 'Donation GRN' ? 
                           <DonationEnteredList data={this.state.data }id={this.state.grn_dontation_id} itemId={this.props.match.params.id} grn_no={this.state.grn_no2}></DonationEnteredList>

                            :null
                            }
                    </LoonsCard>
                </MainContainer>

                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>


            </Fragment >
        );
    }
}

export default GRN_Items
