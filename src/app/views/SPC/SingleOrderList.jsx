import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import SearchIcon from '@material-ui/icons/Search'
import { Alert, Autocomplete, createFilterOptions } from '@material-ui/lab'
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
    Box,
    Tabs,
    Tab,
    Chip,
    Breadcrumbs,
    Link,
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
import * as appConst from '../../../appconst'
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
import ModalXL from 'app/components/Modals/ModalXL'
import SignedOrderList from './SignedOrderList'
import { Breadcrumb } from 'app/components'
import TextViewBox from 'app/components/SpcComponents/TextViewBox'
import { TextareaAutosize } from '@mui/material'
import SingleItemViewTabNav from './SingleItemViewTabNav'

class SingleOrderList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            loaded: false,
            textAreaValue: '',
            filterData: {
                prioritySPC: '',
                statusSPC: '',
            },
            data: [
                {
                    sr_no: '325647CGW',
                    item_name: 'Test Corp',
                    order_qty: 'Test Corp',
                    item_price: 'Test Corp',
                    estimated_cost: 'Test Corp',
                    msd_qty: 'Test Corp',
                    national_qty: 'Test Corp',
                    quality_failed_qty: 'Test Corp',
                    usable_qty: 'Test Corp',
                    priority_level: 'Test Corp',
                    status: 'Test Corp',
                },
                {
                    sr_no: '325344CGW',
                    item_name: 'Test Corp',
                    order_qty: 'Test Corp',
                    item_price: 'Test Corp',
                    estimated_cost: 'Test Corp',
                    msd_qty: 'Test Corp',
                    national_qty: 'Test Corp',
                    quality_failed_qty: 'Test Corp',
                    usable_qty: 'Test Corp',
                    priority_level: 'Test Corp',
                    status: 'Test Corp',
                },
                {
                    sr_no: '3265rCGW',
                    item_name: 'Test Corp',
                    order_qty: 'Test Corp',
                    item_price: 'Test Corp',
                    estimated_cost: 'Test Corp',
                    msd_qty: 'Test Corp',
                    national_qty: 'Test Corp',
                    quality_failed_qty: 'Test Corp',
                    usable_qty: 'Test Corp',
                    priority_level: 'Test Corp',
                    status: 'Test Corp',
                },
            ],
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let record = this.state.data[dataIndex]
                            return (
                                <Tooltip title="View Order">
                                    <div style={{ display: 'flex', flex: 1 }}>
                                        <ModalXL
                                            title={`Order : ${record?.sr_no}`}
                                            button={
                                                <VisibilityIcon
                                                    sx={{ color: '#000' }}
                                                />
                                            }
                                        >
                                            <SingleItemViewTabNav />
                                        </ModalXL>
                                    </div>
                                </Tooltip>
                            )
                        },
                    },
                },
                {
                    name: 'sr_no',
                    label: 'SR Number',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        display: true,
                    },
                },

                {
                    name: 'order_qty',
                    label: 'Order Quantity',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'item_price',
                    label: 'Item Price',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'estimated_cost',
                    label: 'Estimated Total Cost (LKR)M',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'msd_qty',
                    label: 'MSD Qty',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'national_qty',
                    label: 'National Qty',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'quality_failed_qty',
                    label: 'Quality Failed Qty ',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'usable_qty',
                    label: 'Usable Qty',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'priority_level',
                    label: 'Priority Level',
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
    }

    render() {
        return (
            <MainContainer>
                <LoonsCard>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'left',
                        }}
                    >
                        <Grid item lg={5} md={4} sm={6} xs={12}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'left',
                                }}
                            >
                                <IconButton
                                    onClick={() => {
                                        window.history.back()
                                    }}
                                    size="medium"
                                >
                                    <ArrowBackIosIcon fontSize="medium" />
                                </IconButton>
                                <CardTitle
                                    title={'Order - 2022/SPC/X/R/P/00306'}
                                />
                            </div>
                        </Grid>
                        <Grid item lg={5} md={4} sm={6} xs={12}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'left',
                                    marginTop: '15px',
                                }}
                            >
                                <Breadcrumbs aria-label="breadcrumb">
                                    <Link
                                        color="inherit"
                                        href="/spc/procurements/allOrders"
                                    >
                                        All Order Lists
                                    </Link>
                                    <Typography color="textPrimary">
                                        Single Order List
                                    </Typography>
                                </Breadcrumbs>
                            </div>
                        </Grid>
                        <Grid item lg={2} md={0} sm={6} xs={12}>
                            {/* <LoonsButton className="w-full" color={'secondary'}>
                                Surgical
                            </LoonsButton> */}
                            <Chip
                                className="w-full"
                                color="secondary"
                                label="Surgical"
                            />
                        </Grid>
                    </div>
                    <ValidatorForm onSubmit={() => {}} className="w-full">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'left',
                                justifyContent: 'space-between',
                                marginTop: '20px',
                            }}
                        >
                            <Grid container spacing={1} className="flex ">
                                <Grid container lg={12} md={12} sm={12} xs={12}>
                                    <Grid
                                        item
                                        lg={4}
                                        md={4}
                                        sm={4}
                                        xs={4}
                                        style={{ paddingLeft: '5px' }}
                                    >
                                        <SubTitle title="Estimated Cost Between" />
                                    </Grid>
                                    <Grid
                                        item
                                        lg={4}
                                        md={4}
                                        sm={4}
                                        xs={4}
                                        style={{ paddingLeft: '5px' }}
                                    >
                                        <SubTitle title="Priority Level" />
                                    </Grid>
                                    <Grid
                                        item
                                        lg={4}
                                        md={4}
                                        sm={4}
                                        xs={4}
                                        style={{ paddingLeft: '5px' }}
                                    >
                                        <SubTitle title="Status" />
                                    </Grid>
                                </Grid>
                                <Grid item lg={2} md={4} sm={6} xs={12}>
                                    {/* <label>Estimated Cost Between</label> */}
                                    <TextValidator
                                        className=" w-full"
                                        name="cost"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        placeholder="From(LKR)"
                                    />
                                </Grid>
                                <Grid item lg={2} md={4} sm={6} xs={12}>
                                    {/* <label>:</label> */}
                                    <TextValidator
                                        className=" w-full"
                                        name="to"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        placeholder="To(LKR)"
                                    />
                                </Grid>
                                <Grid item lg={2} md={4} sm={6} xs={12}>
                                    <Autocomplete
                                        disableClearable
                                        className="w-half"
                                        value={
                                            this.state.filterData.prioritySPC
                                        }
                                        options={appConst.prioritySPC}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.prioritySPC = value
                                                this.setState({ filterData })
                                            } else {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.prioritySPC = {
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
                                                        .prioritySPC
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item lg={2} md={4} sm={6} xs={12}>
                                    <Autocomplete
                                        disableClearable
                                        className="w-half"
                                        value={this.state.filterData.statusSPC}
                                        options={appConst.statusSPC}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.statusSPC = value
                                                this.setState({ filterData })
                                            } else {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.statusSPC = {
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
                                                        .statusSPC
                                                }
                                            />
                                        )}
                                    />{' '}
                                </Grid>

                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    {/* <label>Search:</label> */}

                                    <TextValidator
                                        className=" w-full"
                                        name="Order List Number"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'left',
                                        justifyContent: 'space-between',
                                        marginTop: '9px',
                                    }}
                                >
                                    <Grid item lg={12} md={4} sm={6} xs={12}>
                                        <LoonsButton className="w-full">
                                            Search
                                        </LoonsButton>
                                    </Grid>
                                </div>
                            </Grid>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'left',
                                justifyContent: 'space-between',
                                marginTop: '25px',
                            }}
                        ></div>

                        <div
                            className="w-full"
                            style={{
                                justifyContent: 'flex-end',
                                display: 'flex',
                            }}
                        >
                            <LoonsButton
                                style={{ backgroundColor: '#228b22' }}
                                onClick={() => {
                                    window.open(
                                        '/spc/procurement/createprocurement',
                                        '_self'
                                    )
                                }}
                            >
                                Create Procurement
                            </LoonsButton>
                        </div>
                        <LoonsTable
                            id={'completed'}
                            data={this.state.data}
                            columns={this.state.columns}
                        ></LoonsTable>

                        <div
                            style={{
                                marginTop: '25px',
                                justifyContent: 'center',
                            }}
                            className="w-full flex"
                        >
                            <TextViewBox
                                title={"Chairman's remark"}
                                message={'Test approved remark message'}
                                type={'success'}
                            />
                            <TextViewBox
                                title={"DG's remark"}
                                message={'Test rejected remark message'}
                                type={'error'}
                            />
                        </div>
                        <div
                            style={{
                                marginTop: '0px',
                                justifyContent: 'center',
                            }}
                            className="w-full flex"
                        >
                            {/* <TextValidator
                                className=" w-full"
                                value={this.state.textAreaValue}
                                rows={20}
                                name="excess"
                                InputLabelProps={{ shrink: false }}
                                type="text"
                                variant="outlined"
                                size="small"
                                placeholder="Remark"
                            /> */}
                            <TextareaAutosize
                                aria-label="minimum height"
                                minRows={3}
                                placeholder="Remark"
                                style={{
                                    width: 400,
                                    padding: 10,
                                    borderRadius: 10,
                                }}
                            />
                        </div>
                        <div
                            style={{
                                marginTop: '10px',
                                justifyContent: 'center',
                            }}
                            className="w-full flex"
                        >
                            <div
                                style={{
                                    width: 300,
                                    justifyContent: 'space-around',
                                    display: 'flex',
                                }}
                            >
                                <LoonsButton>Approve</LoonsButton>
                                <LoonsButton color="error">Reject</LoonsButton>
                            </div>
                        </div>
                    </ValidatorForm>
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default SingleOrderList
