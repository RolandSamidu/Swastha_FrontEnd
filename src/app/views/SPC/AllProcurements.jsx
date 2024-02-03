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

class AllProcurements extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            filterData: {
                statusSPCprocurement: '',
                methodSPC: '',
                authoritySPC: '',
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
                    name: 'procument_method',
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
                    name: 'Status',
                    label: 'status',
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
                    <CardTitle title={'All Procuments'} />
                    <ValidatorForm onSubmit={() => {}} className="w-full">
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
                                    {/* <SubTitle title="From" /> */}

                                    <DatePicker
                                        className="w-full"
                                        placeholder="From"
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
                                    {/* <SubTitle title="" /> */}

                                    <DatePicker
                                        className="w-full"
                                        placeholder="To"
                                    />
                                </Grid>
                                <Grid item lg={2.5} md={3} sm={6} xs={12}>
                                    {/* <SubTitle title="Estimated Value Between" /> */}

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
                                    <ValidatorForm
                                        onSubmit={() => {}}
                                        className="w-full"
                                    >
                                        <TextValidator
                                            className=" w-full"
                                            name="To"
                                            InputLabelProps={{ shrink: false }}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            placeholder="Est. Value To"
                                        />
                                    </ValidatorForm>
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
                                        disableClearable
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
                                        disableClearable
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
                                        disableClearable
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
                    </ValidatorForm>
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default AllProcurements
