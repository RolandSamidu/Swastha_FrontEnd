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
    Box,
    Tabs,
    Tab,
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

class CreateProcurement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            filterData: { commiteeSPC: '' },
            data: [],
            columns1: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'order_list',
                    label: 'Order List',
                    options: {
                        display: true,
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
                    name: 'mobile',
                    label: 'Mobile',
                    options: {
                        display: true,
                    },
                },
            ],

            columns2: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
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
                    name: 'delivery_schedule ',
                    label: 'Delivery Schedule',
                    options: {
                        display: true,
                    },
                },

                {
                    name: 'batch_qty',
                    label: 'Batch Quantity ',
                    options: {
                        display: true,
                    },
                },

                {
                    name: 'total_qty',
                    label: 'Total Quantity',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'estimated_item_price',
                    label: 'Estimated Item Price',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'priority_leave',
                    label: 'Priority Level',
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
                <ValidatorForm>
                    <LoonsCard>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'left',
                                justifyContent: 'space-between',
                                marginTop: '15px',
                            }}
                        >
                            <CardTitle title={'Create Procurement'} />
                            <div>
                                {' '}
                                <Grid item lg={12} md={4} sm={6} xs={12}>
                                    <label style={{ marginTop: '30px' }}>
                                        Order List No:2022/SPC/X/R/P/0306
                                    </label>
                                </Grid>
                                <Grid item lg={12} md={4} sm={6} xs={12}>
                                    <label style={{ marginTop: '30px' }}>
                                        Order List No:2022/SPC/X/R/P/0305
                                    </label>
                                </Grid>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'left',
                                justifyContent: 'space-between',
                                marginTop: '25px',
                            }}
                        >
                            <Grid container spacing={1} className="flex ">
                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <label>Order List Number:</label>

                                    <TextValidator
                                        className=" w-full"
                                        name="Order List Number"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        placeholder="2022/SPC/X/R/P0021254"
                                    />
                                </Grid>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'left',
                                        justifyContent: 'space-between',
                                        marginTop: '29px',
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
                        <LoonsTable
                            id={'completed'}
                            data={this.state.data}
                            columns={this.state.columns1}
                        ></LoonsTable>
                        <div
                            className="w-full"
                            style={{
                                justifyContent: 'flex-end',
                                display: 'flex',
                            }}
                        >
                            <LoonsButton
                                style={{ backgroundColor: '##0047ab' }}
                            >
                                Add
                            </LoonsButton>
                        </div>

                        <Grid container spacing={1} className="flex ">
                            <Grid item lg={3} md={4} sm={6} xs={12}>
                                <label>SR Number/Item Name:</label>

                                <TextValidator
                                    className=" w-full"
                                    name="sr_number"
                                    InputLabelProps={{ shrink: false }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    placeholder="1235648"
                                />
                            </Grid>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'left',
                                    justifyContent: 'space-between',
                                    marginTop: '29px',
                                }}
                            >
                                <Grid item lg={12} md={4} sm={6} xs={12}>
                                    <LoonsButton className="w-full">
                                        Search
                                    </LoonsButton>
                                </Grid>
                            </div>
                        </Grid>
                        <LoonsTable
                            marginTop={'20px'}
                            id={'completed'}
                            data={this.state.data}
                            columns={this.state.columns2}
                        ></LoonsTable>
                        <div
                            className="w-full"
                            style={{
                                justifyContent: 'flex-end',
                                display: 'flex',
                            }}
                        >
                            <LoonsButton style={{ backgroundColor: '#228b22' }}>
                                Create New Procurement
                            </LoonsButton>
                        </div>

                        {/* <Grid container spacing={1} className="flex ">
                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <SubTitle title="Search for Order List" />
                                <Autocomplete
                                        disableClearable
                                    className="w-half"
                                    value={this.state.filterData.commiteeSPC}
                                    options={appConst.commiteeSPC}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData =
                                                this.state.filterData
                                            filterData.commiteeSPC = value
                                            this.setState({ filterData })
                                        } else {
                                            let filterData =
                                                this.state.filterData
                                            filterData.commiteeSPC = {
                                                label: '',
                                            }
                                            this.setState({ filterData })
                                        }
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="All"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.filterData
                                                    .commiteeSPC
                                            }
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid> */}
                    </LoonsCard>
                </ValidatorForm>
            </MainContainer>
        )
    }
}

export default CreateProcurement
