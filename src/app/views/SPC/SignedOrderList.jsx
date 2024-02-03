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

class SignedOrderList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            textAreaValue: '',
            filterData: {
                prioritySPC: '',
                statusSPC: '',
            },
            data: [],
            columns: [
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
                    name: 'action',
                    label: 'Action',
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
                            justifyContent: 'space-between',
                        }}
                    >
                        <CardTitle title={'Order - 2022/SPC/X/R/P/00306'} />
                        <Grid item lg={2} md={4} sm={6} xs={12}>
                            <LoonsButton className="w-full" color={'secondary'}>
                                Surgical
                            </LoonsButton>
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
                                <Grid item lg={3} md={4} sm={6} xs={12}>
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
                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                
                                <SubTitle title="Priority Level" />
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
                                                value={this.state.filterData.prioritySPC}/>
                                                )}
                                                />  
                            </Grid>
                            <Grid item lg={3} md={4} sm={6} xs={12}>
                                
                                <SubTitle title="Status" />
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
                            </Grid>
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
                                    <label>Search:</label>

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

                        <div
                            style={{
                                marginTop: '50px',
                                marginLeft: '75%',
                            }}
                        >
                            <LoonsButton className="w-full" color={'secondary'}>
                                Create New Procurements
                            </LoonsButton>
                        </div>
                        <LoonsTable
                            id={'completed'}
                            data={this.state.data}
                            columns={this.state.columns}
                        ></LoonsTable>

                        <div
                            style={{
                                marginTop: '50px',
                            }}
                        >
                            {' '}
                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <label>Chairman : Approved</label>

                                <TextValidator
                                    className=" w-full"
                                    value={this.state.textAreaValue}
                                    rows={20}
                                    name="excess"
                                    InputLabelProps={{ shrink: false }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid
                                item
                                lg={4}
                                md={4}
                                sm={6}
                                xs={12}
                                style={{
                                    marginTop: '20px',
                                }}
                            >
                                <label>DGM : Approved</label>

                                <TextValidator
                                    className=" w-full"
                                    value={this.state.textAreaValue}
                                    rows={20}
                                    name="excess"
                                    InputLabelProps={{ shrink: false }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid
                                item
                                lg={4}
                                md={4}
                                sm={6}
                                xs={12}
                                style={{
                                    marginTop: '20px',
                                }}
                            >
                                <label>Manager Imports : Approved</label>

                                <TextValidator
                                    className=" w-full"
                                    value={this.state.textAreaValue}
                                    rows={20}
                                    name="excess"
                                    InputLabelProps={{ shrink: false }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                        </div>
                    </ValidatorForm>
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default SignedOrderList
