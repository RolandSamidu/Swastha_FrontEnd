import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents';
import { getPickupPersons, getAllReturnRequests, getRemarks, updatePickupPersons, createReturnDeliveryRequests } from "../redux/action";
import {
    Grid,
    IconButton,
    Icon,
    Tooltip,
    Checkbox,
    Dialog,
    TextField
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import Changewarehouse from "../changeWareHouseComponent";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    LoonsTable,
    CardTitle,
    SubTitle
} from 'app/components/LoonsLabComponents'
import CloseIcon from '@material-ui/icons/Close';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { connect } from "react-redux"
import localStorageService from 'app/services/localStorageService';
import { withRouter } from "react-router";
class AllRequestDeliveryDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            columns: [
                {
                    name: 'pickup_person_id', // field name in the row object
                    label: 'Select', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <Checkbox onChange={(e) => this.handleCheckbox(this.state.data[tableMeta.rowIndex]?.id)} 
                                    // disabled={value ? false : true} color={"primary"}
                                        checked={this.state.returnRequestIds.some((data) => data === this.state.data[tableMeta.rowIndex]?.id)}

                                    />
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'toStore', // field name in the row object
                    label: 'Warehouse', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <span>{value?.name}</span>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'request_id',
                    label: 'Return Request Id',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'ItemSnap',
                    label: 'SR No',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <span>{value?.sr_no}</span>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'ItemSnap',
                    label: 'SR Name',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <span>{value?.medium_description}</span>
                                </>
                            )
                        },
                    },
                }, {
                    name: 'total_request_quantity',
                    label: 'Return Qty',
                    options: {
                        // filter: true,
                    },
                },

                {
                    name: 'shortReference',
                    label: 'Custodian',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'shortReference',
                    label: 'Custodian contact number',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'shortReference',
                    label: 'Delivery mode',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'shortReference',
                    label: 'Remarks',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'pickup_person_id',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <IconButton
                                        // disabled={value ? true : false}
                                        onClick={() => this.setState({
                                            openPickUpPerson: true, pickUpPersonId: "",
                                            pickUpRemarksId: "",
                                            returnRequestId: this.state.data[tableMeta.rowIndex]?.id,
                                        })}
                                    >
                                        <PersonAddIcon />
                                    </IconButton>
                                </>
                            )
                        },
                    },
                },
            ],
            alert: false,
            message: '',
            severity: 'success',
            openPickUpPerson: false,
            patient_pic: null,
            all_district: [],
            all_moh: [],
            all_phm: [],
            all_gn: [],
            warehouse_id: "",
            data: [],
            page: 0,
            limit: 20,
            loading: false,
            totalItems: null,
            
            formData: {
                seriesStartNumber: null,
                seriesEndNumber: null,
                itemGroupName: null,
                shortRef: null,
                description: null, 
                // orderby_sr : true
            },
            remarksOptions: [],
            pickupPersonOptions: [],
            pickUpPersonId: "",
            pickUpRemarksId: "",
            returnRequestId: "",
            returnRequestIds: []

        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.allReturnRequestStatus) {
            this.setState({
                data: nextProps?.allReturnRequestDetails?.data,
                totalItems: nextProps?.allReturnRequestDetails?.totalItems,
                page: nextProps?.returnRequestsPagination?.page,
                limit: nextProps?.returnRequestsPagination?.limit,
            });
        } else {
            this.setState({
                data: [],
                totalItems: 0,
                page: nextProps?.returnRequestsPagination?.page,
                limit: nextProps?.returnRequestsPagination?.limit,
            });
        }

        if (nextProps?.remarksStatus) {
            this.setState({
                remarksOptions: nextProps?.remarksDetails?.map((data) => {
                    return {
                        value: data.id,
                        label: data.remark
                    }
                })
            });
        } else {
            this.setState({ remarksOptions: [] });
        }

        if (nextProps?.pickupPersonStatus) {
            this.setState({
                pickupPersonOptions: nextProps?.pickupPersonDetails?.map((data) => {
                    return {
                        value: data.id,
                        label: data.name
                    }
                })
            });
        } else {
            this.setState({ pickupPersonOptions: [] });
        }
    }

    handleCheckbox = (id) => {
        let ids = this.state.returnRequestIds;
        if (ids.includes(id)) {
            ids = ids.filter((data) => data !== id);
        } else {
            ids.push(id);
        }
        this.setState({ returnRequestIds: ids });

    }

    componentDidMount() {
        if (localStorageService.getItem("Selected_Warehouse")) {
            let warehouse_id = localStorageService.getItem("Selected_Warehouse").id;
            console.log(warehouse_id, "warehouse_id")
            this.props.getAllReturnRequests({ from: warehouse_id, page: this.state.page, limit: this.state.limit });
            this.setState({ warehouse_id });
        }
        this.props.getPickupPersons();
        this.props.getRemarks();
    }
    handleSubmitPickupPerson = () => {
        let payload = {
            "pickup_person_id": this.state.pickUpPersonId,
            "pickup_mod": "Pickup",
            "pickup_other_remark": "",
            "pickup_remark_id": this.state.pickUpRemarksId
        }
        this.props.updatePickupPersons(payload, { warehouse_id: this.state.warehouse_id, page: this.state.page, limit: this.state.limit }, this.state.returnRequestId);
        this.setState({
            openPickUpPerson: false
        })

    }

    handlePaginations = (page, limit) => {
        let params = {
            page,
            limit,
            from: this.state.warehouse_id
        };
        this.setState({ page, limit, loading: true }, () => this.props.getAllReturnRequests(params));
    }
    handleCheckout = () => {
        let payload = {
            ids: this.state.returnRequestIds,
            status: "ORDERED"
        }
        this.props.createReturnDeliveryRequests(payload, this.props.history)
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        {/* <CardTitle title="Clinic Setup" /> */}

                        <ValidatorForm
                            className="pt-2"

                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid container spacing={2} direction="row">
                                {/* Filter Section */}

                                {/* Table Section */}
                                <Grid container className="mt-3 pb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <LoonsTable
                                            id={'allAptitute'} data={this.state.data} columns={this.state.columns} options={{
                                                pagination: true,
                                                serverSide: true,
                                                rowsPerPage: this.state.limit,
                                                count: this.state.totalItems,
                                                rowsPerPageOptions: [20, 50, 100],
                                                page: this.state.page,
                                                onTableChange: (action, tableState) => {
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.handlePaginations(tableState.page, tableState.rowsPerPage)
                                                            break;
                                                        case 'changeRowsPerPage':
                                                            this.handlePaginations(tableState.page, tableState.rowsPerPage)
                                                            break
                                                        case 'sort':
                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                            break
                                                        default:

                                                    }
                                                }
                                            }}
                                        ></LoonsTable>
                                    </Grid>

                                    {/* Tempary Dashboard */}
                                    {/* Submit and Cancel Button */}
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                                className=" w-full flex justify-end"
                                            >
                                                {/* Submit Button */}
                                                <Button
                                                    className="mt-2 mr-2"
                                                    progress={false}
                                                    onClick={this.handleCheckout}
                                                    // type="submit"
                                                    disabled={this.state.returnRequestIds.length == 0 ? true : false}
                                                    scrollToTop={true}
                                                // startIcon="save"

                                                >
                                                    <span className="capitalize">
                                                        Checkout
                                                    </span>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                    </LoonsCard>
                </MainContainer>

                <LoonsSnackbar
                    open={this.state.alert}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
                <Changewarehouse isOpen={this.props.isOpen} type="returnDeliveryDetails" />
                <Dialog
                    fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.openPickUpPerson}
                    onClose={() => { this.setState({ openPickUpPerson: false }) }}>
                    <MuiDialogTitle disableTypography >
                        <CardTitle title="Select PickUp Person/Remarks " />
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => null}
                            onError={() => null}>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td> <SubTitle title="Select The Pickup Person" /></td>
                                        <td>
                                            <Autocomplete
                                        disableClearable className="w-full"
                                                options={this.state.pickupPersonOptions}
                                                // value={this.state.pickUpPersonId}
                                                validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                                onChange={(e, data) => this.setState({ pickUpPersonId: data?.value })}
                                                getOptionLabel={(
                                                    option) => option.label}
                                                renderInput={(params) => (
                                                    <TextValidator {...params} placeholder="Select The Pickup Person"
                                                        className=" w-full" name="batchQty" InputLabelProps={{
                                                            shrink: false
                                                        }}
                                                        variant="outlined"
                                                        size="small" />
                                                )}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>  <SubTitle title="Remarks" /></td>
                                        <td>  <Autocomplete
                                        disableClearable className="w-full"
                                            options={this.state.remarksOptions}
                                            // value={this.state.pickUpRemarksId}
                                            // validators={['required']}
                                            // errorMessages={[
                                            //     'this field is required',
                                            // ]}
                                            getOptionLabel={(
                                                option) => option.label}
                                            onChange={(e, data) => this.setState({ pickUpRemarksId: data?.value })}
                                            renderInput={(params) => (
                                                <TextValidator {...params} placeholder="Remarks"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth" variant="outlined" size="small" />
                                            )}
                                        /></td>
                                    </tr>
                                    <tr>
                                        <Button onClick={this.handleSubmitPickupPerson}>Save</Button>
                                    </tr>
                                </tbody>
                            </table>
                        </ValidatorForm>
                    </div>
                </Dialog>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        getAllReturnRequests: (params) => getAllReturnRequests(dispatch, params),
        getPickupPersons: () => getPickupPersons(dispatch),
        getRemarks: () => getRemarks(dispatch),
        updatePickupPersons: (payload, params, id) => updatePickupPersons(dispatch, payload, params, id),
        createReturnDeliveryRequests: (payload, history) => createReturnDeliveryRequests(dispatch, payload, history)
    }

}

const mapStateToProps = ({ returnReducer }) => {
    return {
        allReturnRequestStatus: returnReducer?.allReturnRequestStatus,
        allReturnRequestDetails: returnReducer?.allReturnRequestDetails,
        returnRequestsPagination: returnReducer?.returnRequestsPagination,
        remarksStatus: returnReducer?.remarksStatus,
        remarksDetails: returnReducer?.remarksDetails,
        pickupPersonStatus: returnReducer?.pickupPersonStatus,
        pickupPersonDetails: returnReducer?.pickupPersonDetails
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllRequestDeliveryDetails))
