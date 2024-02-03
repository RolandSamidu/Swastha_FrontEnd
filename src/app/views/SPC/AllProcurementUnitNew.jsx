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
import moment from 'moment'

class AllProcurementUnitNew extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            activeTab: 0,
            filterData: {
                commiteeSPC: '',
                categorySPC: '',
                newProcurementSPC: '',
            },

            data: [],
            columns: [
                {
                    name: 'select',
                    label: '',
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
                    name: 'procurement_number',
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
                    name: 'order_list_number',
                    label: 'Order List Number',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'total_estimated_tender_value',
                    label: 'Total Estimated Tender Value(LKR)MN',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'category',
                    label: 'Category',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'procurement_committe',
                    label: 'Procurement Committee',
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
                    <CardTitle title={'All Procument Unit (New)'} />
                    <ValidatorForm onSubmit={() => {}} className="w-full">
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} xs={12}>
                                <Tabs
                                    style={{
                                        minHeight: 39,
                                        height: 26,
                                        marginTop: '20px',
                                    }}
                                    //indicatorColor="primary"
                                    textColor="primary"
                                    value={this.state.activeTab}
                                    onChange={(event, newValue) => {
                                        console.log(newValue)
                                        this.setState({ activeTab: newValue })
                                    }}
                                >
                                    <Tab
                                        label={
                                            <span className="font-bold text-12">
                                                New Procurements
                                            </span>
                                        }
                                    />
                                    <Tab
                                        label={
                                            <span className="font-bold text-12">
                                                All Procurements
                                            </span>
                                        }
                                    />
                                </Tabs>
                            </Grid>
                        </Grid>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'left',
                                justifyContent: 'space-between',
                                marginTop: '20px',
                            }}
                        >
                            <Grid container spacing={1} className="flex ">
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
                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <label>Search</label>
                                    <TextValidator
                                        className=" w-full"
                                        name="to"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        placeholder="Ref No/Order List"
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

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'left',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Grid container spacing={1} className="flex ">
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <SubTitle title="Procurement Committee" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-half"
                                        value={
                                            this.state.filterData.commiteeSPC
                                        }
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
                                                        .commiteeSPC
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <SubTitle title="Category" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-half"
                                        value={
                                            this.state.filterData.categorySPC
                                        }
                                        options={appConst.categorySPC}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.categorySPC = value
                                                this.setState({ filterData })
                                            } else {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.categorySPC = {
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
                                                        .categorySPC
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <SubTitle title="Status" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-half"
                                        value={
                                            this.state.filterData
                                                .newProcurementSPC
                                        }
                                        options={appConst.newProcurementSPC}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.newProcurementSPC =
                                                    value
                                                this.setState({ filterData })
                                            } else {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.newProcurementSPC = {
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
                                                        .newProcurementSPC
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </div>
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
                                    Added to Agenda
                                </LoonsButton>
                            </Grid>
                        </div>

                        <LoonsTable
                            id={'completed'}
                            data={this.state.data}
                            columns={this.state.columns}
                        ></LoonsTable>
                    </ValidatorForm>
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default AllProcurementUnitNew
