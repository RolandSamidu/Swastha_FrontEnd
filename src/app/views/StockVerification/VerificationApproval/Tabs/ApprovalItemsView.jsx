import React, { Component, Fragment } from "react";
import { LoonsSnackbar, MainContainer, SubTitle } from "app/components/LoonsLabComponents";
import {
    CircularProgress,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core'
import { Button, } from 'app/components/LoonsLabComponents'
import IconButton from "@material-ui/core/IconButton";
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import LoonsTable from "app/components/LoonsLabComponents/Table/LoonsTable";
import { Autocomplete } from "@material-ui/lab";
import LoonsCard from "app/components/LoonsLabComponents/LoonsCard";
import CardTitle from "app/components/LoonsLabComponents/CardTitle";
import Tooltip from "@material-ui/core/Tooltip";
import VisibilityIcon from '@material-ui/icons/Visibility';
import StockVerificationService from "app/services/StockVerificationService"
import { dateParse } from "utils";
import InventoryService from "app/services/InventoryService";
import GroupSetupService from "app/services/datasetupServices/GroupSetupService";
import localStorageService from "app/services/localStorageService";




class ApprovalItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonName: 'Back',
            buttonName_1: 'Approval',
            buttonName_2: 'Filter',
            is_new: false,
            stock_verification_freez_item: [],
            submiting: false,
            verification_get_by_id: [],
            loading: false,
            loadingById: false,
            tableLoaded: false,
            item_list: [],
            all_item_group: [],
            viewDailog: false,
            editId: null,
            editSubmitting: false,
            edit: false,
            buttonLoad: false,
            itemViseData: {},
            userRole: null,
            remark: null,
            statusData: {
                status: null,
            },
            formData: {
                freez_id: null,
                item_id: null,
                serviceable_quantity: null,
                expired_quantity: null,
                quality_failed_quantity: null,
                freez_quantity: null,
                count_quantity: null,
                owner_id: null,
                remark: null,
            },

            accountant_details: [],

            warning_msg: false,
            actionDisabled: false,
            institution: {
                first: null,
                mid: null,
                end: null
            },
            regno2: true,
            selected_id: null,
            openConformation: false,

            approvalParams: {
                page: 0,
                limit: 10,
            },

            single_approval: [{
                accountant_remark: null,
            }],

            desable_Button: false,

            filterData: {
                limit: 10,
                page: 0,
                starting_item_code: null,
                ending_item_code: null,
                item_id: null,
                group_id: null,
                sr_no: null,
                'order[0]': ['updatedAt', 'DESC'],

            },

            accountat_filter: {
                starting_item_code: null,
                ending_item_code: null,
                item_id: null,
                group_id: null,
                sr_no: null,
                'order[0]': ['updatedAt', 'DESC'],
                search_type: 'GROUP',
                group_by_status: true
            },



            columns: [
                {
                    name: 'item_code',
                    label: 'Item Code',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_freez_item[tableMeta.rowIndex]?.ItemSnap?.sr_no + '-' + this.state.stock_verification_freez_item[tableMeta.rowIndex]?.ItemSnap?.medium_description


                        },
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_freez_item[tableMeta.rowIndex]?.status


                        },
                    },
                },
                {
                    name: 'accountant_remark',
                    label: 'Accountant Remark',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_freez_item[tableMeta.rowIndex]?.accountant_remark


                        },
                    },
                },

                {
                    name: 'serviceable_quantity',
                    label: 'Serviceable Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_freez_item[tableMeta.rowIndex]?.serviceable_quantity


                        },
                    },

                },
                {
                    name: 'expired_quantity',
                    label: 'Expired Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_freez_item[tableMeta.rowIndex]?.expired_quantity


                        },
                    },
                },
                {
                    name: 'quality_failed_quantity',
                    label: 'Quality failed Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_freez_item[tableMeta.rowIndex]?.quality_failed_quantity


                        },
                    },
                },
                {
                    name: 'freeze_quantity',
                    label: 'Freeze Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.stock_verification_freez_item[tableMeta.rowIndex]?.freez_quantity


                        },
                    },
                },

                {
                    name: 'count_quantity',
                    label: 'Count Quantity',

                    options: {
                        filter: true,

                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <TextValidator
                                        {...value}
                                        placeholder="Count Quantity"
                                        fullWidth
                                        value={this.state.stock_verification_freez_item[tableMeta.rowIndex]?.count_quantity}
                                        disabled={true}
                                        onChange={(e) => {
                                            let stock_verification_freez_item = this.state.stock_verification_freez_item
                                            stock_verification_freez_item[tableMeta.rowIndex].count_quantity = e.target.value

                                            this.setState({ edit: true, stock_verification_freez_item })
                                        }}
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            width: 150,
                                        }}

                                    />
                                </>
                            )
                        }

                    },
                },
                {
                    name: 'remark',
                    label: 'Remark',

                    options: {

                        filter: true,

                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <TextValidator
                                        {...value}
                                        placeholder="Remark"
                                        disabled={true}
                                        fullWidth
                                        value={this.state.stock_verification_freez_item[tableMeta.rowIndex]?.remark}
                                        onChange={(e) => {
                                            let stock_verification_freez_item = this.state.stock_verification_freez_item
                                            stock_verification_freez_item[tableMeta.rowIndex].remark = e.target.value

                                            this.setState({ edit: true, stock_verification_freez_item })
                                        }}
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            width: 150,
                                        }}

                                    />
                                </>
                            )
                        }

                    },
                },
                {
                    name: "action",
                    label: "Action",
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let id = this.state.stock_verification_freez_item[tableMeta.rowIndex]?.id

                            const isApproved = this.state.stock_verification_freez_item[tableMeta.rowIndex]?.status === 'APPROVED';
                            const isRejected = this.state.stock_verification_freez_item[tableMeta.rowIndex]?.status === 'REJECTED';

                            return (
                                <>
                                    {(this.state.userRole === 'Accounts Clerk RMSD' || this.state.userRole === 'Accounts Clerk Hospital') && this.state.stock_verification_freez_item[tableMeta.rowIndex]?.status === 'Pending' &&
                                        <Grid>
                                            <ValidatorForm>
                                                <TextValidator
                                                    {...value}
                                                    placeholder="Remark"
                                                    // disabled={this.state.actionDisabled}
                                                    fullWidth
                                                    // value={this.state.stock_verification_freez_item[tableMeta.rowIndex]?.accountant_remark}
                                                    // onChange={(e) => {
                                                    //     let single_approval = this.state.single_approval
                                                    //     single_approval[tableMeta.rowIndex].accountant_remark = e.target.value

                                                    //     this.setState({single_approval })
                                                    // }}
                                                    onChange={(e) => {
                                                        const { name, value } = e.target;
                                                        this.setState((prevState) => {
                                                            const updatedSingleApproval = prevState.single_approval.map((item, index) => {
                                                                if (index === tableMeta.rowIndex && typeof item === 'object') {
                                                                    // Make sure item is an object before modifying it
                                                                    return {
                                                                        ...item,
                                                                        accountant_remark: value,
                                                                    };
                                                                }
                                                                return item;
                                                            });

                                                            return { single_approval: updatedSingleApproval };
                                                        });
                                                    }}

                                                    variant="outlined"
                                                    size="small"
                                                    style={{
                                                        width: 150,
                                                    }}

                                                />
                                            </ValidatorForm>
                                        </Grid>
                                    }
                                    <Grid className="flex items-center">
                                        {this.state.userRole === 'Accounts Clerk RMSD' || this.state.userRole === 'Accounts Clerk Hospital' &&
                                            this.state.buttonLoad ? (

                                            this.state.itemViseData?.MSDApprovalConfig?.available_actions?.map((action) => {
                                                console.log(action?.name); // Print the value
                                                return <Button
                                                    className="m-1 "
                                                    progress={this.state.progress}
                                                    type="submit"
                                                    disabled={
                                                        (action.name === 'Approved' && isApproved) ||
                                                        (action.name === 'Reject' && isRejected)
                                                    }
                                                    // color="#d8e4bc"
                                                    // startIcon={action.name === 'REJECTED' ? 'checklist' : 'save'}
                                                    style={action.name === 'Approved' ? { backgroundColor: '#00A9FF' } : { backgroundColor: 'orange' }}
                                                    scrollToTop={
                                                        true
                                                    }
                                                    onClick={() => this.setState({ progress: true }, () => { this.saveApprovalOnebyOne(action.action, id, [tableMeta.rowIndex]) })}
                                                >
                                                    <span className="capitalize">
                                                        {action.name}
                                                    </span>
                                                </Button>
                                            })
                                        ) : null}
                                        <Tooltip title="View">
                                            <IconButton
                                                className="px-2"
                                                onClick={() => {
                                                    const query = new URLSearchParams(this.props.location.search);
                                                    const freezId = query.get('freez_id')

                                                    window.location.href = `/stock_Verification/approval_item_batch_list/id=${this.state.stock_verification_freez_item[tableMeta.rowIndex]?.id}&warehouse_id=${this.state.stock_verification_freez_item[tableMeta.rowIndex]?.Stock_Verification_Freez?.warehouse_id}&item_id=${this.state.stock_verification_freez_item[tableMeta.rowIndex]?.item_id}&freez_id=${freezId}&id=${this.state.stock_verification_freez_item[tableMeta.rowIndex]?.id}`

                                                }}
                                                size="small"
                                                aria-label="view"
                                            >
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>

                                        {/* <Tooltip title="Edit">
                                            <IconButton
                                                className="px-2"
                                                onClick={() => {

                                                    let formData = this.state.formData
                                                    formData.count_quantity = this.state.stock_verification_freez_item[tableMeta.rowIndex]?.count_quantity
                                                    formData.remark = this.state.stock_verification_freez_item[tableMeta.rowIndex]?.remark
                                                    this.setState({ edit: true, editId: this.state.stock_verification_freez_item[tableMeta.rowIndex]?.id, formData })
                                                    console.log("editdata", formData)


                                                }
                                                }
                                                size="small"
                                                aria-label="view"
                                            >
                                                <EditIcon color="primary" />
                                            </IconButton>
                                        </Tooltip> */}

                                        {/* <Tooltip title="Save">

                                            <Button
                                                className="button-primary "
                                                progress={false}
                                                disabled={this.state.actionDisabled}
                                                scrollToTop={true}
                                                onClick={() => {

                                                    this.editStockTakeVerification(this.state.stock_verification_freez_item[tableMeta.rowIndex])
                                                    this.setState({
                                                        tableLoaded: true,
                                                        editId: this.state.stock_verification_freez_item[tableMeta.rowIndex]?.id,
                                                        edit: false,

                                                    })




                                                }}

                                            >
                                                <span className="capitalize">Save</span>
                                            </Button>


                                        </Tooltip> */}
                                    </Grid>
                                </>
                            );
                        }

                    }
                }
            ],



        }
    }


    postDriverForm = async () => {

        this.setState({
            submiting: true
        })


        let res = await StockVerificationService.createVerificationItems(this.state.formData);
        console.log('formdata  eka', this.state.formData);




        console.log("res", res);

        if (res.status == 200 || res.status == 201) {
            console.log("resssss", res)
            this.setState({
                alert: true,
                message: 'Employee Updated',
                severity: 'success',
                submiting: false,
                is_new: true,

            })

            setTimeout(() => {
                this.setState({
                    viewDailog: false
                })

            }, 1000);


        } else {


            // console.log("response error", res.response.data.error)
            this.setState({
                alert: true,
                message: res.response.data.error,
                severity: 'error',
                submiting: false,
                viewDailog: false
            })
        }



    }

    async editStockTakeVerification(data) {
        this.setState({ editSubmitting: true })

        let formData = { remark: data.remark, count_quantity: data.count_quantity };


        let res = await StockVerificationService.editStockTake(data.id, formData)
        console.log("edit formdata", formData)
        console.log("edit formdata id", data.id)
        console.log("edit stock take", res)
        if (res.status === 200) {
            this.setState({
                alert: true,
                message: 'Edit Stock Take Successfully!',
                severity: 'success',
                editSubmitting: false
            }
                , () => {
                    this.setPage(0)
                }
            )
        } else {
            this.setState({
                alert: true,
                message: 'Edit Stock Take Unsuccessful!',
                severity: 'error',
                editSubmitting: false
            })
        }
    }


    async stockVerificationGetById() {
        this.setState({ loadingById: false })


        const query = new URLSearchParams(this.props.location.search);
        const freezId = query.get('freez_id')
        console.log('freez_id:', freezId);


        // console.log('id', this.props.match.params.id)
        let res = await StockVerificationService.verificationGetById(freezId)
        console.log('res get by id', res);
        if (res.status == 200) {

            if (res.data.view.status == "Pending Approval") {
                this.setState({
                    actionDisabled: true,
                })
            }

            console.log("verification get by id", res.data.view)
            this.setState({
                verification_get_by_id: res.data.view,
                total_stock_verification_data: res.data.view.totalItems,
                loadingById: true,
            }, () => {
                this.getFreezStockItem()
                // this.getItem()
                this.loadData()
            })

            console.log("2nd time", res.data.view)
        }
    }




    async getFreezStockItem() {
        this.setState({ tableLoaded: false })

        const query = new URLSearchParams(this.props.location.search);
        const freezId = query.get('freez_id')
        let params = this.state.filterData
        params.freez_id = freezId
        console.log('freez_id:', freezId);
        // let params = { freez_id: freezId }
        console.log("svid", this.props.match.params.id)
        let res = await StockVerificationService.getStockVerificationFreezItems(params)
        console.log('freezItem', res);

        if (res.status == 200) {

            console.log("freez item", res.data.view.data)

            this.setState({
                stock_verification_freez_item: res.data.view.data,
                total_stock_verification_freez_item: res.data.view.totalItems,
                tableLoaded: true,
            })

            console.log("2nd time", res.data.view)
        }
    }


    async getItem(value) {

        let data = {
            search: value
        }
        let res = await InventoryService.fetchAllItems(data)

        if (res.status === 200) {
            console.log("ITEM------------------------------->>", res)
            this.setState({ item_list: res.data.view.data })
        }
    }


    async loadData() {
        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        if (group_res.status == 200) {
            console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_group: group_res.data.view.data })
        }

        const query = new URLSearchParams(this.props.location.search);
        const freezId = query.get('freez_id')
        const ownerId = query.get('owner_id')

        let formData = this.state.formData
        formData.freez_id = freezId

        let owner = this.state.formData
        owner.owner_id = ownerId
        this.setState({
            formData,
            owner
        })



    }



    // get accountant details 
    async stockVerificationAccountantDetails() {
        this.setState({ tableLoaded: false })

        const query = new URLSearchParams(this.props.location.search);
        const freezId = query.get('freez_id')
        let params = this.state.accountat_filter
        params.freez_id = freezId
        console.log('freez_id:===========================', freezId);
        // let params = { freez_id: freezId }
        console.log("svid", this.props.match.params.id)
        let res = await StockVerificationService.getStockVerificationFreezItems(params)

        if (res.status === 200) {

            console.log("freez dhdhd hdhdhd dhhd", res)

            if (this.state.userRole === 'Accounts Clerk RMSD' || this.state.userRole === 'Accounts Clerk Hospital') {
                if (res.data.view[1]?.count == 0) {
                    this.setState({
                        desable_Button: true
                    })
                }
            } else {
                this.setState({
                    desable_Button: true
                })
            }



            this.setState({
                accountant_details: res.data.view,
            })
        }
    }




    async verificationFreezChangeStatus() {
        this.setState({
            warning_msg: false
        })

        const query = new URLSearchParams(this.props.location.search);
        const freezId = query.get('freez_id')
        const ownerId = query.get('owner_id')
        let id = freezId
        console.log('change ownerId', ownerId)

        let newstatus = {
            "status": "Pending Approval",
            owner_id: ownerId
        }
        let res = await StockVerificationService.changeStatus(id, newstatus)
        console.log('change status', res)
        if (res.status === 200) {
            this.setState({
                alert: true,
                severity: 'success',
                message: "Successfully Saved ",
            },
                () => {
                    window.location.reload()
                })
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Cannot Save ",
            })
        }


    }

    async getDataItemVise() {

        console.log("stock  data", this.state.selected_id)

        let res = await StockVerificationService.getStockVerificationApprovalById({}, this.state.selected_id)

        if (res.status === 200) {

            console.log("stock verification data", res)
            this.setState({
                itemViseData: res.data.view,
                buttonLoad: true
            })
        }

    }

    async saveAllApproval(action) {

        this.setState({
            progress: false
        })


        let parans = {
            stock_verification_freez_id: this.state.itemViseData?.Stock_Verification_Freez.id,
            owner_id: this.state.itemViseData?.owner_id,
            approval_type: this.state.itemViseData?.approval_type,
            remark: this.state?.remark,
            approval_user_type: this.state.itemViseData?.approval_user_type,
            sequence: this.state.itemViseData?.sequence,
            status: action,
            approval_config_id: this.state.itemViseData?.approval_config_id
        }

        console.log('checking status', parans)
        let res = await StockVerificationService.editStockVerificatinAppproval(this.state.itemViseData?.id, parans)

        if (res.status === 200 || res.status === 201) {

            if (action === "APPROVED") {
                this.setState({
                    alert: true,
                    severity: 'success',
                    message: "Appoval process success ",
                },
                    () => {
                        window.location = `/stock_verification_approval`
                    })
            } else {

                this.setState({
                    alert: true,
                    severity: 'success',
                    message: "Rejected success ",
                },
                    () => {
                        window.location = `/stock_verification_approval`
                    })
            }
        } else {
            if (action === "APPROVED") {
                this.setState({
                    alert: true,
                    severity: 'error',
                    message: "Appoval process faild ",
                })
            } else {
                this.setState({
                    alert: true,
                    severity: 'error',
                    message: "Rejected faild ",
                })
            }
        }
    }

    async saveApprovalOnebyOne(action, id, index) {

        this.setState({
            progress: false
        })


        let parans = {
            accountant_remark: this.state.single_approval[index]?.accountant_remark,
            status: action
        }

        console.log('checking status', parans)
        let res = await StockVerificationService.editStockTake(id, parans)

        if (res.status === 200 || res.status === 201) {

            if (action === "APPROVED") {
                this.setState({
                    alert: true,
                    severity: 'success',
                    message: "Appoval process success ",
                },
                    () => {
                        window.location.reload()
                    })
            } else {

                this.setState({
                    alert: true,
                    severity: 'success',
                    message: "Rejected success ",
                },
                    () => {
                        window.location.reload()
                    })
            }
        } else {
            if (action === "APPROVED") {
                this.setState({
                    alert: true,
                    severity: 'error',
                    message: "Appoval process faild ",
                })
            } else {
                this.setState({
                    alert: true,
                    severity: 'error',
                    message: "Rejected faild ",
                })
            }
        }
    }



    async componentDidMount() {
        let login_user_info = await localStorageService.getItem('userInfo').roles[0]

        this.setState({
            selected_id: this.props?.match?.params?.id,
            userRole: login_user_info

        }, () => {
            this.stockVerificationGetById()
            this.getDataItemVise()
            this.stockVerificationAccountantDetails()
        })

        console.log("stock verifi props", this.props?.match?.params?.id)

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
                this.stockVerificationGetById()
            }
        )
    }





    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={"View Item"} />

                        <ValidatorForm
                            ref="form"
                            className="pt-2"
                            onSubmit={() => { this.setPage(0) }}
                        >
                            &nbsp;
                            <Grid container spacing={2} className="flex p-2" style={{ border: '1px solid #18FFFF', borderRadius: '5px', backgroundColor: '#ccebff' }} >


                                <Grid
                                    className="flex w-full  " item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title=" Stock Take No: " />
                                    &nbsp;
                                    <SubTitle title={this.state.verification_get_by_id?.stock_take_no} />

                                </Grid>


                                <Grid
                                    className="flex w-full  " item lg={6} md={6} sm={12} xs={12}
                                >

                                    <SubTitle title=" Status: " />
                                    &nbsp;
                                    <SubTitle title={this.state.verification_get_by_id?.status} />

                                </Grid>


                                <Grid
                                    className="flex w-full  " item lg={6} md={6} sm={12} xs={12}
                                >

                                    <SubTitle title="Stock Take Date & Time: " />
                                    &nbsp;
                                    <SubTitle title={dateParse(this.state.verification_get_by_id?.stock_take_date)} />

                                </Grid>


                                <Grid
                                    className=" w-full flex " item lg={6} md={6} sm={12} xs={12}
                                >

                                    <SubTitle className='m-0 p-0' title="Institute:" />
                                    &nbsp;
                                    <SubTitle title={this.state.verification_get_by_id?.Stock_Verification?.Pharmacy_drugs_store?.name + '-' + this.state.verification_get_by_id?.Stock_Verification?.Pharmacy_drugs_store?.Department?.name} />

                                </Grid>


                                <Grid
                                    className=" w-full flex " item lg={6} md={6} sm={12} xs={12}
                                >

                                    <SubTitle title="Warehouse Code:" />
                                    &nbsp;
                                    <SubTitle title={this.state.verification_get_by_id?.Warehouse?.name} />

                                </Grid>


                            </Grid>

                            &nbsp;


                            <Grid item lg={12} md={12} sm={12} xs={12} container spacing={1} className="flex m-1" >

                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Starting Item Code" />
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Enter Starting Item Code"
                                        name="starting_item_code"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.filterData.starting_item_code}
                                        onChange={(e) => {
                                            let filterData =
                                                this.state.filterData
                                            filterData.starting_item_code =
                                                e.target.value
                                            this.setState({ filterData })
                                        }}

                                    />
                                </Grid>


                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >

                                    <SubTitle title="Ending Item Code" />

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Enter Ending Item Code"
                                        name="ending_code_item"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.filterData.ending_item_code}
                                        onChange={(e) => {
                                            let filterData =
                                                this.state.filterData
                                            filterData.ending_item_code =
                                                e.target.value
                                            this.setState({ filterData })
                                        }}

                                    />

                                </Grid>

                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >

                                    <SubTitle title="Item Codes" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        placeholder="Enter Item Code"
                                        name="item_id"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        options={this.state.item_list}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let filterData = this.state.filterData
                                                filterData.item_id = value.id



                                                this.setState({
                                                    filterData,

                                                })

                                            }
                                            else if (value == null) {
                                                let filterData = this.state.filterData
                                                filterData.item_id = null
                                                this.setState({
                                                    filterData

                                                })
                                            }
                                        }}

                                        getOptionLabel={(option) => option.sr_no + ' - ' + option.medium_description}
                                        renderInput={(params) => (
                                            <TextValidator {...params}
                                                placeholder="Type SR or Name"
                                                //variant="outlined"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    if (e.target.value.length > 3) {
                                                        this.getItem(e.target.value);
                                                    }
                                                }}
                                                value={this.state.filterData.item_id}


                                            />
                                        )} />


                                </Grid>


                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Item Group:" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.all_item_group}
                                        //  value={this.state.buttonName=='update'?appConst.institution.filter((e) => 
                                        //  e.value == this.state.reg_no.mid):this.state.reg_no.mid

                                        //  }
                                        onChange={(e, value) => {
                                            let filterData = this.state.filterData
                                            if (value != null) {
                                                filterData.group_id = value.id
                                            } else {
                                                filterData.group_id = null
                                            }

                                            this.setState({ filterData })
                                        }}
                                        value={this
                                            .state
                                            .all_item_group
                                            .find((v) => v.id == this.state.filterData.item_group_id)}
                                        // value={this.state.vehicleTypesData.find((v) => v.id === this.state.formData.vehicle_type_id)}
                                        getOptionLabel={(
                                            option) => option.description
                                                ? option.description
                                                : ''}
                                        renderInput={(params) => (
                                            <TextValidator {...params} placeholder="Item Group"
                                                //variant="outlined"
                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                        )}
                                    />


                                </Grid>

                                <Grid justifyContent="flex-start" className=" w-full flex  justify-start mt-2" item lg={12}
                                    md={12} sm={12} xs={12}>




                                    <Button
                                        className="button-primary "
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}

                                    >
                                        <span className="capitalize">{this.state.buttonName_2}</span>
                                    </Button>

                                </Grid>

                            </Grid>

                            <Grid container justify="center" alignItems="center">
                                <Grid item sm={12} className="text-center">
                                    <SubTitle title="Accountatnt Details" />
                                </Grid>
                            </Grid>
                            <Grid className="mt-3" container justify="center" alignItems="center">

                                <Grid className="text-center" item sx={12} sm={12} md={3} lg={3} >

                                </Grid>
                                <Grid className="text-center" item sx={12} sm={12} md={6} lg={6} >
                                    <table className="w-full" style={{ border: '1px solid #8AFF8A', backgroundColor: '#8AFF8A', borderRadius: '5px' }}>
                                        <tr>
                                            <td style={{ width: '16.66%' }}>Pending</td>
                                            <td style={{ width: '16.66%' }}>: {this.state.accountant_details[1]?.count}</td>
                                            <td style={{ width: '16.66%' }}>Approved</td>
                                            <td style={{ width: '16.66%' }}>: {this.state.accountant_details[0]?.count}</td>
                                            <td style={{ width: '16.66%' }}>Rejected</td>
                                            <td style={{ width: '16.66%' }}>: {this.state.accountant_details[2]?.count}</td>
                                        </tr>
                                    </table>
                                </Grid>
                                <Grid className="text-center" item sx={12} sm={12} md={3} lg={3} >

                                </Grid>
                            </Grid>


                            {this.state.tableLoaded ?
                                <LoonsTable
                                    id={"clinicDetails"}
                                    data={this.state.stock_verification_freez_item}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.total_stock_verification_freez_item,
                                        rowsPerPage: this.state.filterData.limit,
                                        page: this.state.filterData.page,

                                        onTableChange: (action, tableState) => {
                                            switch (action) {
                                                case 'changePage':
                                                    this.setPage(tableState.page)
                                                    break
                                                case 'sort':
                                                    break
                                                default:
                                                    console.log(
                                                        'action not handled.'
                                                    )
                                            }
                                        },
                                    }}
                                >{ }</LoonsTable> : (
                                    //load loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )}

                            {this.state.userRole === 'Accounts Clerk RMSD' || this.state.userRole === 'Accounts Clerk Hospital' || this.state.userRole === 'Drug Store Keeper' &&
                                <Grid container>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <ValidatorForm>
                                            <TextValidator
                                                className="w-full"

                                                name="remark"
                                                placeholder="Remark"
                                                InputLabelProps={{ shrink: false }}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    this.setState({ remark: e.target.value })
                                                }}
                                                multiline={true}
                                                rows={3}

                                            // valid
                                            />
                                        </ValidatorForm>
                                    </Grid>
                                </Grid>
                            }


                            <Grid className="flex mt-5">

                                <Grid justifyContent="flex-start" className=" w-full flex justify-start " item lg={12}
                                    md={12} sm={12} xs={12}>
                                    {/* <Button className="m-1 button-primary" disabled={this.state.actionDisabled} variant="outlined" onClick={() => { this.setState({ viewDailog: true, }) }}>
                                        <AddIcon />
                                        Add Item
                                    </Button> */}
                                    {this.state.userRole === 'Accounts Clerk RMSD' || this.state.userRole === 'Accounts Clerk Hospital' || this.state.userRole === 'Drug Store Keeper' &&
                                        this.state.buttonLoad ? (
                                        this.state.itemViseData?.MSDApprovalConfig?.available_actions.map((action) => {
                                            console.log(action?.name); // Print the value
                                            return <Button
                                                className="m-1 "
                                                progress={this.state.progress}
                                                type="submit"
                                                disabled={!this.state.desable_Button}
                                                // color="#d8e4bc"
                                                // startIcon={action.name === 'REJECTED' ? 'checklist' : 'save'}
                                                style={action.name === 'Approved' ? { backgroundColor: '#00A9FF' } : { backgroundColor: 'orange' }}
                                                scrollToTop={
                                                    true
                                                }
                                                onClick={() => this.setState({ progress: true }, () => {
                                                    this.saveAllApproval(action.action)
                                                })}
                                            >
                                                <span className="capitalize">
                                                    {action.name}
                                                </span>
                                            </Button>
                                        })
                                    ) : null}



                                    <Button
                                        className="m-1 button-danger"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                        onClick={() => {
                                            window.history.back()
                                        }}

                                    >
                                        <span className="capitalize">{this.state.buttonName}</span>
                                    </Button>
                                </Grid>

                                {/* 
                                <Dialog
                                    open={this.state.openConformation}
                                    onClose={() => {
                                        this.setState({ openConformation: false })
                                    }}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                        {'Conformation'}
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Are you Sure to change status of this User?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                    <Button
                                            variant="text"
                                            onClick={() => {
                                                
                                            }}
                                            color="primary"
                                            autoFocus
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            variant="text"
                                            onClick={() => {
                                                this.setState({ openConformation: false })
                                            }}
                                            color="danger"
                                        >
                                            NO
                                        </Button>
                                        
                                    </DialogActions>
                                </Dialog>

                                {/* <LoonsDiaLogBox
                                    title="Are you sure?"
                                    show_alert={true}
                                    alert_severity="info"
                                    alert_message=" Please Add Batch details before Finish"
                                    //message="testing 2"
                                    open={this.state.warning_msg}
                                    show_button={true}
                                    show_second_button={true}
                                    btn_label="No"
                                    onClose={() => {
                                        this.setState({ warning_msg: false })
                                    }}
                                    second_btn_label="Yes"
                                    secondButtonAction={() => {
                                        this.verificationFreezChangeStatus()
                                    }}
                                >
                                </LoonsDiaLogBox> */}




                            </Grid>
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

                        </ValidatorForm>
                    </LoonsCard>






                </MainContainer>

            </Fragment>

        )

    }
}

export default ApprovalItems