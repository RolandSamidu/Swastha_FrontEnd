import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    CircularProgress,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    Typography,
    Dialog,
    Box,
} from '@material-ui/core'
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import { dateTimeParse } from 'utils'
import VisibilityIcon from '@material-ui/icons/Visibility'
import ConsignmentService from 'app/services/ConsignmentService'
import DistributionCenterServices from 'app/services/DistributionCenterServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from 'app/services/WarehouseServices'
import { element } from 'prop-types'
import { dateParse } from 'utils'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import moment from 'moment'
import AddAgendas from './AddAgenda'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'

const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
        display: "flex", justifyContent: "space-between"
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
})

class NewProcurements extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            addAgendas: false,
            filterData: {
                statusSPCprocurement: '',
                methodSPC: '',
                authoritySPC: '',
                request_id: null,
                status: null
            },
            selected_id: [],
            data: [
                {
                    id: 1,
                    procurement_no: 'DHS/P/WW18/02',
                    ref_no: '1245',
                    created_date: new Date(),
                    request_id: '2022/SPC/X/R/P/00306',
                    estimated_value: '120',
                    procurement_method: "Pending",
                    authority_level: 'SPC',
                    status: "New"
                },
                {
                    id: 2,
                    procurement_no: 'DHS/P/WW18/02',
                    ref_no: '1245',
                    created_date: new Date(),
                    request_id: '2022/SPC/X/R/P/00306',
                    estimated_value: '120',
                    procurement_method: "Pending",
                    authority_level: 'SPC',
                    status: "New"
                },
            ],
            columns: [
                {
                    name: '',
                    label: '',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data) {
                                return <input
                                    type="checkbox"
                                    style={{
                                        width: "20px",
                                        height: "20px", outline: "none",
                                        cursor: "pointer"
                                    }}
                                    value={this.state.data[dataIndex].id
                                    }
                                    onChange={this.handleChange}
                                />
                            } else {
                                return "N/A"
                            }

                        }
                    }
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <IconButton
                                    className="text-black mr-2"
                                    onClick={() => {
                                        window.location = `/localpurchase/procurement/123`
                                    }}
                                >
                                    <Icon>visibility</Icon>
                                </IconButton>
                            )
                        },
                    },
                },
                {
                    name: 'procurement_no',
                    label: 'Procurement number',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'ref_no',
                    label: 'Ref No',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'created_date',
                    label: 'Created Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {value
                                        ? dateParse(
                                            moment(value).format('YYYY-MM-DD')
                                        )
                                        : ''}
                                </span>
                            )
                        },
                    },
                },
                {
                    name: 'request_id',
                    label: 'Request ID',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'estimated_value',
                    label: 'Estimated Value (LKR)',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'procurement_method',
                    label: 'Procument Method',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'authority_level',
                    label: 'Authority Level',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                    },
                },
            ],
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const { value, checked } = e.target;
        let updatedSelectedItems = [... this.state.selected_id];

        if (checked) {
            updatedSelectedItems.push(value);
        } else {
            updatedSelectedItems = updatedSelectedItems.filter(item => item !== value);
        }
        this.setState({ selected_id: updatedSelectedItems });
    }

    render() {
        return (
            <ValidatorForm onSubmit={() => { }} className="w-full">
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'left',
                        justifyContent: 'space-between',
                        marginTop: '10px',
                    }}
                >
                    <Grid
                        container
                        spacing={1}
                        className="space-between "
                    >
                        <Grid
                            item
                            lg={2.5}
                            style={{ alignItems: 'end' }}
                            sm={6}
                            md={3}
                            xs={12}
                        >
                            <SubTitle title="Request ID" />
                            <TextValidator
                                className=" w-full"
                                placeholder="Request ID"
                                name="request_id"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                value={
                                    this.state.filterData
                                        .request_id
                                }
                                type="text"
                                variant="outlined"
                                size="small"
                                onChange={(e) => {
                                    this.setState({
                                        filterData: {
                                            ...this
                                                .state
                                                .filterData,
                                            request_id:
                                                e.target
                                                    .value,
                                        },
                                    })
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon></SearchIcon>
                                        </InputAdornment>
                                    ),
                                }}
                            // validators={[
                            //     'required',
                            // ]}
                            // errorMessages={[
                            //     'this field is required',
                            // ]}
                            />
                        </Grid>
                        <Grid item lg={2.5} md={3} sm={6} xs={12}>
                            <SubTitle title="Estimated Value From" />
                            <TextValidator
                                className=" w-full"
                                name="excess"
                                InputLabelProps={{ shrink: false }}
                                type="text"
                                variant="outlined"
                                size="small"
                                placeholder="Est. Value From"
                            />
                        </Grid>
                        <Grid item lg={2.5} md={3} sm={6} xs={12}>
                            <SubTitle title="Estimated Value To" />
                            <TextValidator
                                className=" w-full"
                                name="To"
                                InputLabelProps={{ shrink: false }}
                                type="text"
                                variant="outlined"
                                size="small"
                                placeholder="Est. Value To"
                            />
                        </Grid>
                        <Grid
                            item
                            lg={2.5}
                            md={3}
                            style={{ alignItems: 'end' }}
                            sm={6}
                            xs={12}
                        >
                            <SubTitle title="Status" />
                            <Autocomplete
                                className="w-full"
                                options={appConst.lp_status}
                                onChange={(e, value) => {
                                    if (null != value) {
                                        let filterData =
                                            this.state.filterData
                                        filterData.status =
                                            e.target.value
                                        this.setState({
                                            filterData,
                                        })
                                    }
                                }}
                                getOptionLabel={(option) =>
                                    option.label
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Please choose"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={
                                            this.state.filterData
                                                .status
                                        }
                                    />
                                )}
                            />
                        </Grid>
                        {/* <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <TextValidator
                                        className=" w-full"
                                        name="Order List Number"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        placeholder="Order List Number"
                                    />
                                </Grid>

                                <Grid
                                    item
                                    lg={1}
                                    md={4}
                                    sm={6}
                                    style={{ paddingTop: '9px' }}
                                    xs={12}
                                >
                                    <LoonsButton className="w-full">
                                        Search
                                    </LoonsButton>
                                </Grid> */}
                    </Grid>
                    {/* <Grid container spacing={1} className="flex ">
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <label>Estimated Cost Between : LKR</label>
                                    <TextValidator
                                        className=" w-full"
                                        name="cost"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <label>To:</label>
                                    <TextValidator
                                        className=" w-full"
                                        name="to"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <SubTitle title="Status" />
                                    <Autocomplete
                                        className="w-half"
                                        value={
                                            this.state.filterData
                                                .statusSPCprocurement
                                        }
                                        options={appConst.statusSPCprocurement}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.statusSPCprocurement =
                                                    value
                                                this.setState({ filterData })
                                            } else {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.statusSPCprocurement =
                                                    { label: '' }
                                                this.setState({ filterData })
                                            }
                                        }}
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="All"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={
                                                    this.state.filterData
                                                        .statusSPCprocurement
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid> */}
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'left',
                        justifyContent: 'space-between',
                    }}
                >
                    <Grid container spacing={1} className="flex ">
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <SubTitle title="Procurement Method" />

                            <Autocomplete
                                className="w-half"
                                value={this.state.filterData.methodSPC}
                                options={appConst.methodSPC}
                                onChange={(e, value) => {
                                    if (null != value) {
                                        let filterData =
                                            this.state.filterData
                                        filterData.methodSPC = value
                                        this.setState({ filterData })
                                    } else {
                                        let filterData =
                                            this.state.filterData
                                        filterData.methodSPC = {
                                            label: '',
                                        }
                                        this.setState({ filterData })
                                    }
                                }}
                                getOptionLabel={(option) =>
                                    option.label
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="All"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={
                                            this.state.filterData
                                                .methodSPC
                                        }
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <SubTitle title="Authority Level" />
                            <Autocomplete
                                className="w-half"
                                value={
                                    this.state.filterData.authoritySPC
                                }
                                options={appConst.authoritySPC}
                                onChange={(e, value) => {
                                    if (null != value) {
                                        let filterData =
                                            this.state.filterData
                                        filterData.authoritySPC = value
                                        this.setState({ filterData })
                                    } else {
                                        let filterData =
                                            this.state.filterData
                                        filterData.authoritySPC = {
                                            label: '',
                                        }
                                        this.setState({ filterData })
                                    }
                                }}
                                getOptionLabel={(option) =>
                                    option.label
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="All"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={
                                            this.state.filterData
                                                .authoritySPC
                                        }
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <label>Search</label>
                            <TextValidator
                                className=" w-full"
                                name="to"
                                InputLabelProps={{ shrink: false }}
                                type="text"
                                variant="outlined"
                                size="small"
                                placeholder="Procurement Number/Ref No/Order List"
                            />
                        </Grid>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'left',
                                justifyContent: 'space-between',
                                marginTop: '30px',
                            }}
                        >
                            <Grid item lg={3} md={4} sm={6} xs={12}>
                                <LoonsButton className="w-full">
                                    Search
                                </LoonsButton>
                            </Grid>
                        </div>
                    </Grid>
                </div>
                <LoonsTable
                    id={'completed'}
                    data={this.state.data}
                    columns={this.state.columns}
                ></LoonsTable>{' '}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'left',
                        justifyContent: 'space-between',
                        marginTop: '30px',
                    }}
                >
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                        <LoonsButton
                            className="w-full"
                            disabled={!this.state.selected_id.length}
                            onClick={() => {
                                this.setState({ addAgendas: true })
                            }}
                        >
                            Add to Agenda
                        </LoonsButton>
                        <Dialog
                            fullWidth={true}
                            maxWidth={"md"}
                            open={this.state.addAgendas}
                        >
                            <MuiDialogTitle
                                disableTypography
                                className={styleSheet.Dialogroot}
                            >
                                <div style={{ display: "flex" }}>
                                    <div style={{ flex: 1 }}>
                                        <Typography variant="h6" className="font-semibold">Add to Agenda</Typography>
                                    </div>
                                    <div>
                                        <IconButton
                                            aria-label="close"
                                            className={styleSheet.Dialogroot}
                                            onClick={() => {
                                                this.setState({
                                                    addAgendas: false,
                                                })
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </div>
                                </div>
                                <Divider />
                            </MuiDialogTitle>
                            <div className="w-full h-full px-5 py-5">
                                <AddAgendas />
                            </div>
                        </Dialog>
                    </Grid>
                </div>
            </ValidatorForm>
        )
    }
}

export default NewProcurements
