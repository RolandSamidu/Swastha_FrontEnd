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
import { Divider } from '@mui/material'

class ProcurementAck extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            filterData: {},

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
                    name: 'delivery_schedule',
                    label: 'Delivery Schedule',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'batch_qty',
                    label: 'Batch Quantity',
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
                    name: 'priority_level',
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
                            <CardTitle
                                title={'Procurement Ref No: 1245/S/2022'}
                            />
                            <div>
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
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'left',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Grid item lg={12} md={4} sm={6} xs={12}>
                                        <label>Authority Level:</label>
                                        <LoonsButton
                                            style={{
                                                width: '50%',
                                                marginLeft: '10px',
                                            }}
                                        >
                                            DPC-minor
                                        </LoonsButton>
                                    </Grid>
                                </div>
                            </div>
                        </div>

                        <LoonsTable
                            id={'completed'}
                            data={this.state.data}
                            columns={this.state.columns}
                        ></LoonsTable>
                        <h6 style={{ width: '100%', marginRight: '5px' }}>
                            Total Procurement Value : LKR 333.33M
                        </h6>
                        <Divider sx={{ mt: 4 }} />
                        <div
                            style={{
                                marginTop: '45px',
                            }}
                        >
                            <Grid container spacing={1} className="flex ">
                                <h6>Supervisor - Check</h6>
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <div
                                        style={{
                                            marginTop: '25',
                                            align: 'left',
                                        }}
                                    >
                                        <label>Note :</label>

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
                                    </div>
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
                                            Suggestion
                                        </LoonsButton>
                                    </Grid>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'left',
                                        justifyContent: 'space-between',
                                        marginTop: '29px',
                                        marginLeft: '5px',
                                    }}
                                >
                                    <Grid item lg={12} md={4} sm={6} xs={12}>
                                        <LoonsButton
                                            className="w-full"
                                            color="error"
                                        >
                                            Forward
                                        </LoonsButton>
                                    </Grid>
                                </div>
                            </Grid>

                            <div
                                style={{
                                    marginTop: '25px',
                                }}
                            >
                                <Grid container spacing={1} className="flex ">
                                    <h6>Procurement Officer - Approval</h6>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <label>Note :</label>

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
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'left',
                                            justifyContent: 'space-between',
                                            marginTop: '29px',
                                        }}
                                    >
                                        <Grid
                                            item
                                            lg={12}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <LoonsButton className="w-full">
                                                Suggestion
                                            </LoonsButton>
                                        </Grid>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'left',
                                            justifyContent: 'space-between',
                                            marginTop: '29px',
                                            marginLeft: '5px',
                                        }}
                                    >
                                        <Grid
                                            item
                                            lg={12}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <LoonsButton
                                                className="w-full"
                                                color="error"
                                            >
                                                Forward
                                            </LoonsButton>
                                        </Grid>
                                    </div>
                                </Grid>
                            </div>
                            <div
                                style={{
                                    marginTop: '25px',
                                    display: 'flex',
                                    alignItems: 'left',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <container
                                    container
                                    spacing={1}
                                    className="flex "
                                >
                                    <h6>Manage Imports - Approval </h6>

                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <label>Note :</label>

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
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'left',
                                            justifyContent: 'space-between',
                                            marginTop: '29px',
                                        }}
                                    >
                                        <Grid
                                            item
                                            lg={12}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <LoonsButton className="w-full">
                                                Suggestion
                                            </LoonsButton>
                                        </Grid>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'left',
                                            justifyContent: 'space-between',
                                            marginTop: '29px',
                                            marginLeft: '5px',
                                        }}
                                    >
                                        <Grid
                                            item
                                            lg={12}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <LoonsButton
                                                className="w-full"
                                                color="error"
                                            >
                                                Forward
                                            </LoonsButton>
                                        </Grid>
                                    </div>
                                </container>
                            </div>
                        </div>
                    </LoonsCard>
                </ValidatorForm>
            </MainContainer>
        )
    }
}

export default ProcurementAck
