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
import { dateTimeParse, timeParse } from 'utils'
import VisibilityIcon from '@material-ui/icons/Visibility'
import ConsignmentService from 'app/services/ConsignmentService'
import DistributionCenterServices from 'app/services/DistributionCenterServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from 'app/services/WarehouseServices'
import { element } from 'prop-types'
import { dateParse } from 'utils'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import { Dialog } from '@mui/material'
import CloseIcon from '@material-ui/icons/Close'
import MuiDialogTitle from '@material-ui/core/DialogTitle'

import CreateAgendas from './CreateAgendas'
import moment from 'moment'

const drawerWidth = 270

const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
})

class AllAgendas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createAgendas: false,
            loaded: false,
            activeTab: 0,
            filterData: {
                statusAllAgendas: '',
            },
            data: [],
            columns: [
                {
                    name: 'procurement_committe_no',
                    label: 'Procurement Committe No',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'date',
                    label: 'Date',
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
                    name: 'time',
                    label: 'Time',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {value ? timeParse(moment(value)) : ''}
                                </span>
                            )
                        },
                    },
                },
                {
                    name: 'remarks',
                    label: 'Remarks',
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
                {
                    name: 'action',
                    label: 'Action',
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
                    <CardTitle title={'All Agendas'} />
                    <ValidatorForm onSubmit={() => {}} className="w-full">
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} xs={12}>
                                <Tabs
                                    style={{
                                        minHeight: 39,
                                        height: 26,
                                        marginTop: '20px',
                                        marginLeft: '1',
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
                                                Procurement Committee Meeting
                                            </span>
                                        }
                                    />
                                    <Tab
                                        label={
                                            <span className="font-bold text-12">
                                                Bid Open Committe
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
                            }}
                        >
                            <Grid
                                container
                                spacing={1}
                                className="space-between "
                            >
                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <SubTitle title="Date From" />
                                    <DatePicker
                                        className="w-full"
                                        placeholder="From"
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <SubTitle title="To" />
                                    <DatePicker
                                        className="w-full"
                                        placeholder="To"
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <SubTitle title="Status" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-half"
                                        value={
                                            this.state.filterData
                                                .statusAllAgendas
                                        }
                                        options={appConst.statusAllAgendas}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.statusAllAgendas =
                                                    value
                                                this.setState({ filterData })
                                            } else {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.statusAllAgendas = {
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
                                                        .statusAllAgendas
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item lg={2} md={4} sm={6} xs={12}>
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
                                    <Grid item lg={2} md={4} sm={6} xs={12}>
                                        <LoonsButton className="w-full">
                                            Search
                                        </LoonsButton>
                                    </Grid>
                                </div>
                            </Grid>
                            /
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
                                <LoonsButton
                                    className="w-full"
                                    onClick={() => {
                                        this.setState({ createAgendas: true })
                                    }}
                                >
                                    Create New
                                </LoonsButton>
                                <Dialog
                                    maxWidth="lg "
                                    open={this.state.createAgendas}
                                >
                                    <MuiDialogTitle
                                        disableTypography
                                        className={styleSheet.Dialogroot}
                                    >
                                        <CardTitle title="" />

                                        <IconButton
                                            aria-label="close"
                                            className={styleSheet.Dialogroot}
                                            onClick={() => {
                                                this.setState({
                                                    createAgendas: false,
                                                })
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </MuiDialogTitle>

                                    <div className="w-full h-full px-5 py-5">
                                        <CreateAgendas />
                                    </div>
                                </Dialog>
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

export default AllAgendas
