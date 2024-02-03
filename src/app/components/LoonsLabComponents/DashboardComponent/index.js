import React, { Fragment, useState, Component, useEffect, useRef } from 'react'
import {
    Card,
    TextField,
    MenuItem,
    IconButton,
    Icon,
    Grid,
    Switch,
    Typography,
    Divider,
    Tooltip,
    CircularProgress,
    TableCell,
    Table,
    TableBody,
    TableRow,
    Radio,
    RadioGroup,
    FormGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Paper,
    Checkbox,
} from '@material-ui/core'
import { any } from 'prop-types'
import { Resizable, ResizableBox } from 'react-resizable'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { themeColors } from 'app/components/MatxTheme/themeColors'
import {
    LoonsTable,
    DatePicker,
    FilePicker,
    Button,
    ExcelToTable,
    Widget,
    SubTitle,
    Charts,
    CanvasDraw,
    LoonsSnackbar,
} from 'app/components/LoonsLabComponents'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@material-ui/icons/Visibility'
import EditIcon from '@material-ui/icons/Edit'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import {
    fullScreenRequest,
    fullScreenRequestInsideApp,
    makeid,
} from '../../../../utils'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import BackspaceIcon from '@material-ui/icons/Backspace'
import SettingsIcon from '@material-ui/icons/Settings'

import DrugConsumptionBarChart from './DrugConsumptionBarChart'
import ActivePrescription from './ActivePrescription'
import ExchangesToday from './ExchangesToday'
import IssuedPrescription from './IssuedPrescription'
import OrderSummaryPieChart from './OrderSummaryPieChart'
import PendingExchangesByMe from './PendingExchangesByMe'
import PendingExchangesFromOthers from './PendingExchangesFromOthers'
import PrescriptionSummaryPieChart from './PrescriptionSummaryPieChart'
import CPActivePrescription from './Chief Pharmacist/ActivePrescription'
import CPDrugConsumptionBarChart from './Chief Pharmacist/DrugConsumptionBarChart'
import CPIssuedPrescription from './Chief Pharmacist/IssuedPrescription'
import CPOrderSummaryPieChart from './Chief Pharmacist/OrderSummaryPieChart'
import CPPrescriptionSummaryPieChart from './Chief Pharmacist/PrescriptionSummaryPieChart'
import DSP_Order_by_me_Summary from './Drug Stock Pharmacist/Order_by_me_Summary'
import DSP_Pending_Exchanges_By_Me from './Drug Stock Pharmacist/Pending_Exchanges_By_Me'
import DSP_Pending_Exchanges_From_Others from './Drug Stock Pharmacist/Pending_Exchanges_From_Others'


const DashboardComponent = (props) => {
    const {
        fieldset,
        title,
        headerColor,
        height,
        id,
        onClickSetting,
        onClickRemove,
        onReload,
        edit,
        fullScreenVisibility,
        resizing,
        dashboardVariables,
        loadFromCloud
    } = props
    let activeTheme = MatxLayoutSettings.activeTheme

    const [change, setChange] = useState(true)
    const [alert, setAlert] = useState(false)
    var [message, setMessage] = useState('')
    var [severity, setSeverity] = useState('success')
    const [divWidth, setWidth] = useState()
    var [formData, setformData] = useState({})
    const ref = useRef(null)

    useEffect(() => {
        //console.log('width', ref.current ? ref.current.offsetWidth : 0);
        setWidth(ref.current.offsetWidth)
        setInterval(() => getSize(), 1000)
    }, [ref.current])

    const handleChange = (data) => {
        const { onChange } = props
        onChange &&
            onChange({
                data,
            })
    }

    const setFields = () => {
        var formData = Object.assign({}, formData)

        fieldset.map((item, i) => {
            formData[item.fieldName] = null
        })

        setformData(formData)
    }

    const onInputChange = async (name, value) => {
        formData[name] = value
        setformData({ ...formData })
        console.log('formData', formData)
    }

    const getSize = () => {
        //console.log('width', ref.current ? ref.current.offsetWidth : 0);
        if (ref.current) {
            setWidth(ref.current.offsetWidth)
        }
    }

    const getResponsive = (item) => {
        if (divWidth > 0 && divWidth < 600) {
            return item.otherProps.xs
        } else if (divWidth > 600 && divWidth < 900) {
            return item.otherProps.sm
        } else if (divWidth > 900 && divWidth < 1200) {
            return item.otherProps.md
        } else if (divWidth > 1200 && divWidth < 1536) {
            return item.otherProps.lg
        } else if (divWidth > 1536) {
            return item.otherProps.xl
        }
    }

    const reload = () => {
        // onReload()
    }
    const submit = async () => {
        // let data = {
        //     patient_id: window.dashboardVariables.patient_clinic_id,
        //     widget_id: id,
        //     examination_data: []
        // }
        // Object.values(formData).forEach(element => {
        //     data.examination_data.push(element)
        // });
        // console.log("submitting", data)
        // let res = await ExaminationServices.saveData(data)
        // console.log("Examination Data added", res)
        // if (res.status==201 ) {
        //     setAlert(true)
        //     setMessage('Examination Data Added Successful')
        //     setSeverity('success')
        // }
    }

    return (
        <div
            id={
                id
            } /* style={{ borderStyle: "solid", borderColor: "gray", borderWidth: 1 }} */
            //maxConstraints={[300, 300]}
            // height={this.state.height} width={this.state.width} onResize={this.onResize}
            style={{ height: 'calc(100% + -40px)' }}
        >
            <Grid
                style={{ backgroundColor: headerColor }}
                container
                className="px-1 pt-1 "
            >
                <Grid
                    className="px-1 pl-2 inline flex items-center align-middle"
                    item
                    lg={10}
                    md={10}
                    sm={9}
                    xs={9}
                >
                    <img
                        style={{
                            width: '1.3em',
                            height: '1.3em',
                            marginTop: -1,
                        }}
                        src="/assets/icons/file.svg"
                        alt="Out of Stock"
                    />
                    <Typography
                        className="font-medium ml-1"
                        variant="h6"
                        style={{
                            fontSize: 16,
                            color: '#374151' /* themeColors[activeTheme].palette.primary.main */,
                        }}
                    >
                        {title}
                    </Typography>
                </Grid>

                <Grid
                    className="flex justify-end"
                    item
                    lg={2}
                    md={2}
                    sm={3}
                    xs={3}
                >
                    {fullScreenVisibility ? (
                        <Tooltip
                            title="Full Screen"
                            className="hide-on-fullScreen"
                        >
                            <FullscreenIcon
                                onClick={() => {
                                    fullScreenRequestInsideApp(id)
                                    getSize()
                                }}
                                className="cursor-pointer"
                                color="action"
                            />
                        </Tooltip>
                    ) : null}

                    {fullScreenVisibility ? (
                        <Tooltip title="Back" className="show-on-fullScreen">
                            <BackspaceIcon
                                onClick={() => {
                                    fullScreenRequestInsideApp(id)
                                    getSize()
                                }}
                                className="cursor-pointer"
                                color="action"
                            />
                        </Tooltip>
                    ) : null}

                    {edit ? (
                        <div className="flex justify-end">
                            <Tooltip title="Setting">
                                <SettingsIcon
                                    onClick={() => {
                                        onClickSetting()
                                    }}
                                    className="cursor-pointer"
                                    color="action"
                                />
                            </Tooltip>
                            <Tooltip title="Remove">
                                <DeleteOutlineIcon
                                    onClick={() => {
                                        onClickRemove()
                                    }}
                                    className="cursor-pointer"
                                    color="action"
                                />
                            </Tooltip>
                        </div>
                    ) : null}
                </Grid>
            </Grid>
            <div
                className="px-2 pb-1 pt-2 overflow-auto widget-container h-full"
                style={{ height: height }}
            >
                <ValidatorForm>
                    <Grid container ref={ref} spacing={1}>
                        {fieldset.map((item, i) => {
                            if (item.type == 'DrugConsumptionBarChart' || item.type == "AP_DrugConsumptionBarChart" ) { 
                                return (
                                    <DrugConsumptionBarChart />
                                )
                            }
                            if (item.type == 'ActivePrescription' || item.type == "AP_ActivePrescription" ) {
                                return (
                                    <ActivePrescription />
                                )
                            }
                            if (item.type == 'ExchangesToday' || item.type == "AP_ExchangesToday") {
                                return (
                                    <ExchangesToday />
                                )
                            }
                            if (item.type == 'IssuedPrescription' || item.type == "AP_IssuedPrescription") {
                                return (
                                    <IssuedPrescription />
                                )
                            }
                            if (item.type == 'OrderSummaryPieChart' || item.type == "AP_OrderSummaryPieChart") {
                                return (
                                    <OrderSummaryPieChart />
                                )
                            }
                            if (item.type == 'PendingExchangesByMe' || item.type == "AP_PendingExchangesByMe") {
                                return (
                                    <PendingExchangesByMe />
                                )
                            }
                            if (item.type == 'PendingExchangesFromOthers' || item.type == "AP_PendingExchangesFromOthers") {
                                return (
                                    <PendingExchangesFromOthers />
                                )
                            }
                            if (item.type == 'PrescriptionSummaryPieChart' || item.type == "AP_PrescriptionSummaryPieChart") {
                                return (
                                    <PrescriptionSummaryPieChart />
                                )
                            }
                            if (item.type == 'CPActivePrescription') {
                                return (
                                    <CPActivePrescription />
                                )
                            }
                            if (item.type == 'CPDrugConsumptionBarChart') {
                                return (
                                    <CPDrugConsumptionBarChart />
                                )
                            }
                            if (item.type == 'CPIssuedPrescription') {
                                return (
                                    <CPIssuedPrescription />
                                )
                            }
                            if (item.type == 'CPOrderSummaryPieChart') {
                                return (
                                    <CPOrderSummaryPieChart /> //error
                                )
                            }
                            if (item.type == 'CPPrescriptionSummaryPieChart') {
                                return (
                                    <CPPrescriptionSummaryPieChart />
                                )
                            }
                            if (item.type == 'DSP_Order_by_me_Summary') {
                                return (
                                    <DSP_Order_by_me_Summary />
                                )
                            }
                            if (item.type == 'DSP_Pending_Exchanges_By_Me') {
                                return (
                                    <DSP_Pending_Exchanges_By_Me />
                                )
                            }
                            if (item.type == 'DSP_Pending_Exchanges_From_Others') {
                                return (
                                    <DSP_Pending_Exchanges_From_Others />
                                )
                            }
                        })}
                    </Grid>
                </ValidatorForm>
            </div>

            <LoonsSnackbar
                open={alert}
                onClose={() => {
                    setAlert(false)
                }}
                message={message}
                autoHideDuration={3000}
                severity={severity}
                elevation={2}
                variant="filled"
            ></LoonsSnackbar>
        </div>
    )
}

DashboardComponent.defaultProps = {
    props: {
        fieldset: [
            
        ]
    },
}

export default DashboardComponent
