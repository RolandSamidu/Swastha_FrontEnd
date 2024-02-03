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
import ModifiedAreaChart from 'app/views/dashboard/shared/ModifiedAreaChart'
import Allergies from './Allergies'
import PatientInfo from './PatientInfo'
import Diagnosis from './Diagnosis'
import Complaints from './Complaints'
import Complications from './Complications'
import ProblemList from './ProblemList'
import BloodPressure from './BloodPressure'
import BloodSugar from './BloodSugar'
import Prescription from 'app/views/Prescription/components/prescription'
import ExaminationServices from 'app/services/ExaminationServices'

import GlycemicControl from './Investigation/GlycemicControl'
import LipidProfile from './Investigation/LipidProfile'
import LiverProfile from './Investigation/LiverProfile'
import RenalProfile from './Investigation/RenalProfile'

import ARV from './ARV/ARV'
import Procedures from './Procedures/Procedures'
import ViewProcedures from './Procedures/ViewProcedures'
import Pulse from './Cardiovascular/Pulse'
import ChestDeformities from './Cardiovascular/ChestDeformities'
import HeartSounds from './Cardiovascular/HeartSounds'
import Apex from './Cardiovascular/Apex'
import JugularVenousPreasure from './Cardiovascular/JugularVenousPreasure'
import Murmur from './Cardiovascular/Murmur'
import Tongue from './Genaral Examination/Tongue'
import Skin from './Genaral Examination/Skin'
import Cyanosis from './Genaral Examination/Cyanosis'
import GlasgowComaScale from './Genaral Examination/GlasgowComaScale'
import BMI from './Genaral Examination/BMI'
import BodyTemperature from './Genaral Examination/BodyTemperature'
import Eyes from './Genaral Examination/Eyes'
import Mouth from './Genaral Examination/Mouth'
import Thyroid_Hyporthyroid from './Genaral Examination/Thyroid_Hyporthyroid'
import Thyroid_Hyperthyroid from './Genaral Examination/Thyroid_Hyperthyroid'

import Stridor from './Genaral Examination/Stridor'
import Odema from './Genaral Examination/Odema'
import Involuntary_Movement from './Genaral Examination/Involuntary_Movement'
import Palpation from './Respiratory/Palpation'
import BreathSounds from './Respiratory/BreathSounds'
import AddedSounds from './Respiratory/AddedSounds'
import Percussion from './Respiratory/Percussion'
import VocalResonance from './Respiratory/VocalResonance'
import BowelSounds from './Abdomen/BowelSounds'
import Kidney from './Abdomen/Kidney'
import FreeFluid from './Abdomen/FreeFluid'
import Splenomegaly from './Abdomen/Splenomegaly'
import Hepatomegaly from './Abdomen/Hepatomegaly'
import Hernia from './Abdomen/Hernia'
import GeneralAbdomen from './Abdomen/GeneralAbdomen'
import DigitalRenalRectalExamination from './Abdomen/DigitalRenalRectalExamination.jsx'
import Masses from './Abdomen/Masses'
import RespiratoryRate from './Respiratory/RespiratoryRate'
import StriaeGravidarum from './Obstetric/StriaeGravidarum'
import LineaNigra from './Obstetric/LineaNigra'
import Scars from './Obstetric/Scars'
import SymphysisFundalHeight from './Obstetric/SymphysisFundalHeight'
import NoOfFetus from './Obstetric/NoOfFetus'
import Umbilicus from './Obstetric/Umbilicus'
import Presentation from './Obstetric/Presentation'
import LiquorVolume from './Obstetric/LiquorVolume'
import HeadEngaged from './Obstetric/HeadEngaged'
import FetalLie from './Obstetric/FetalLie'
import FetalHeartSound from './Obstetric/FetalHeartSound'
import Vaccination from './Obstetric/Vaccination'
import Investigation from './Obstetric/Investigation'
import HusbandBloodGroup from './Obstetric/HusbandBloodGroup'
import Doppler from './Obstetric/Doppler'
import EFW from './Obstetric/EFW'
import Placenta from './Obstetric/Placenta'
import PresentationAFI from './Obstetric/PresentationAFI'
import ObstetricHistory from './Obstetric/ObstetricHistory'
import LMP from './Obstetric/LMP'
import USS from './Obstetric/USS'
import AddUSS from './Obstetric/AddUSS'

import Hands from './Genaral Examination/Hands'
import Thyroid from './Thyroid Examination/Thyroid'
import Thyroid_Gland from './Thyroid Examination/Thyroid_Gland'
import Clinical_Conclusion from './Thyroid Examination/Clinical_Conclusion'
import GoBy from './Obstetric/GoBy'
import InvestigationsRequests from './Investigation/InvestigationsRequests'
import Inspection from './Respiratory/Inspection'
import General from './Genaral Examination/General'

import Other from './Genaral Examination/Other'
import CRFT from './Genaral Examination/CRFT'
import Posture from './Genaral Examination/Posture'

// import Hernia from "./Genitalia(Male)_Hernia/Hernia";
import PenisGeneral from "./Genitalia(Male)_Penis/PenisGeneral";
import Ulcer from "./Genitalia(Male)_Penis/Ulcer";
import Lump from "./Genitalia(Male)_Penis/Lump";
import Scrotum from "./Genitalia(Male)_Scotum/Scrotum";
import Lump_Scrotum from "./Genitalia(Male)_Scotum/Lump_Scrotum";
import Ulcer_Scrotum from "./Genitalia(Male)_Scotum/Ulcer_Scrotum";
import Testis from "./Genitalia(Male)_Testis/Testis";
import Hydrocele from "./Genitalia(Male)_Testis/Hydrocele";
import Epididymal_Cyst from "./Genitalia(Male)_Testis/Epididymal_Cyst";
import Testis_Palpable from "./Genitalia(Male)_Testis/Testis_Palpable";
import Varicocele from "./Genitalia(Male)_Testis/Varicocele";
import Haematocele from "./Genitalia(Male)_Testis/Haematocele";
import Orchitis from "./Genitalia(Male)_Testis/Orchitis";
import Epididymo from "./Genitalia(Male)_Testis/Epididymo";
import Torsion from "./Genitalia(Male)_Testis/Torsion";
import Tumour from "./Genitalia(Male)_Testis/Tumour";
import Genitilia_Hernia from "./Genitalia(Male)_Hernia/Genitilia_Hernia";
import Development from "./Growth and Development/development";
import Growth_General from "./Growth and Development/Growth_General";
import Growth_Investigation_for_short_stature from "./Growth and Development/Growth_Investigation_for_short_stature";
import Growth_Remark from "./Growth and Development/Growth_Remark";
import DevelopmentCharts from "./Growth and Development/Charts/index";
import PatientNPDrugSummary from 'app/views/Prescription/components/npdrug/PatientNPDrugSummary'
import NPDrug from './NPDrug'
import StockPositionChart from 'app/views/dashboard/DashboardComponents/StockPositionChart'
import StockInquiryItemDetails from 'app/views/dashboard/DashboardComponents/StockInquaryComponents/StockInquiryItemDetails'
import StockInquiryRequirement from 'app/views/dashboard/DashboardComponents/StockInquaryComponents/Requirement'
import StockInquiryEstimateAndIssue from 'app/views/dashboard/DashboardComponents/StockInquaryComponents/EstimateAndIssue'
import MonthlyForecast from 'app/views/dashboard/DashboardComponents/StockInquaryComponents/MonthlyForecast'
import StockInquiryOrderList from 'app/views/dashboard/DashboardComponents/StockInquaryComponents/OrdList'
import OrdListReceived from 'app/views/dashboard/DashboardComponents/StockInquaryComponents/OrdListReceived'
import OrdListPending from 'app/views/dashboard/DashboardComponents/StockInquaryComponents/OrdListPending'
import ItemOptions from 'app/views/dashboard/DashboardComponents/StockInquaryComponents/ItemOptions'
import PriceChart from 'app/views/dashboard/DashboardComponents/StockInquaryComponents/PriceChart'

import CPPrescriptionSummaryPieChart from 'app/components/LoonsLabComponents/DashboardComponent/Chief Pharmacist/PrescriptionSummaryPieChart'
import CPIssuedPrescription from 'app/components/LoonsLabComponents/DashboardComponent/Chief Pharmacist/IssuedPrescription'
import CPDrugConsumptionBarChart from 'app/components/LoonsLabComponents/DashboardComponent/Chief Pharmacist/DrugConsumptionBarChart'
import CPActivePrescription from 'app/components/LoonsLabComponents/DashboardComponent/Chief Pharmacist/ActivePrescription'
import CPOrderSummaryPieChart from 'app/components/LoonsLabComponents/DashboardComponent/Chief Pharmacist/OrderSummaryPieChart'


import HospitalAttendance from '../DashboardComponent/Hospitalwidgets/HospitalAttendance'
import HospitalGeneralStatistics from '../DashboardComponent/Hospitalwidgets/HospitalGeneralStatistics'
import UnservicerbleDrugs from '../DashboardComponent/Hospitalwidgets/UnservicerbleDrugs'

// import PenisGeneral from './Genitalia(Male)_Penis/PenisGeneral';
// import Ulcer from './Genitalia(Male)_Penis/Ulcer';
// import Lump from './Genitalia(Male)_Penis/Lump'
// import Scrotum from './Genitalia(Male)_Scotum/Scrotum'
// import Lump_Scrotum from './Genitalia(Male)_Scotum/Lump_Scrotum'
// import Ulcer_Scrotum from './Genitalia(Male)_Scotum/Ulcer_Scrotum'
// import Testis from './Genitalia(Male)_Testis/Testis'
// import Hydrocele from './Genitalia(Male)_Testis/Hydrocele'
// import Epididymal_Cyst from './Genitalia(Male)_Testis/Epididymal_Cyst'
// import Testis_Palpable from './Genitalia(Male)_Testis/Testis_Palpable'
// import Varicocele from './Genitalia(Male)_Testis/Varicocele'
// import Haematocele from './Genitalia(Male)_Testis/Haematocele'
// import Orchitis from './Genitalia(Male)_Testis/Orchitis'
// import Epididymo from './Genitalia(Male)_Testis/Epididymo'
// import Torsion from './Genitalia(Male)_Testis/Torsion'
// import Tumour from './Genitalia(Male)_Testis/Tumour'
// import Genitilia_Hernia from './Genitalia(Male)_Hernia/Genitilia_Hernia'
// import Development from './Growth and Development/development'
// import Growth_General from './Growth and Development/Growth_General'
// import Growth_Investigation_for_short_stature from './Growth and Development/Growth_Investigation_for_short_stature'
// import Growth_Remark from './Growth and Development/Growth_Remark'

const WidgetComponent = (props) => {
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
        loadFromCloud,
        searchParams
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

    useEffect(() => {
        console.log('searchParams', searchParams);

    }, [searchParams])

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
                <ValidatorForm
                    onSubmit={() => {
                        submit()
                    }}
                >
                    <Grid container ref={ref} spacing={1}>
                        {fieldset.map((item, i) => {
                            if (item.type == 'input') {
                                if (item.component_type == 'input') {
                                    return (
                                        <Grid
                                            key={i}
                                            item
                                            className={[
                                                item.className,
                                                item.displayInSmallView
                                                    ? ''
                                                    : 'show-on-fullScreen',
                                            ]}
                                            //className={['w-full']}
                                            lg={getResponsive(item)}
                                            md={getResponsive(item)}
                                            sm={getResponsive(item)}
                                            xs={getResponsive(item)}
                                        //style={{display:item.displayInSmallView ?'':(divWidth<)}}
                                        >
                                            <TextValidator
                                                className="w-full"
                                                placeholder={item.placeholder}
                                                name={item.id}
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                onChange={(e) => {
                                                    if (formData[item.id]) {
                                                        let value =
                                                            formData[item.id]
                                                        value = {
                                                            widget_input_id:
                                                                item.id,
                                                            question:
                                                                item.caption,
                                                            answer: e.target
                                                                .value,
                                                            other_answers: {},
                                                        }
                                                        formData[item.id] =
                                                            value

                                                        setformData(formData)
                                                    } else {
                                                        let value = {
                                                            widget_input_id:
                                                                item.id,
                                                            question:
                                                                item.caption,
                                                            answer: e.target
                                                                .value,
                                                            other_answers: {},
                                                        }
                                                        formData[item.id] =
                                                            value

                                                        setformData(formData)
                                                    }

                                                    // console.log("formData", Object.values(formData))
                                                    console.log(
                                                        'formData val',
                                                        formData[item.id]
                                                            ?.answer
                                                    )
                                                }}
                                                value={
                                                    formData[item.id]?.answer
                                                }
                                                type="text"
                                                variant="outlined"
                                                size="small"

                                            //validators={['required']}
                                            /* errorMessages={[
                                            'this field is required',
                                        ]} */
                                            />
                                        </Grid>
                                    )
                                } else if (item.component_type == 'textfield') {
                                    return (
                                        <Grid
                                            key={i}
                                            item
                                            className={[
                                                item.className,
                                                item.displayInSmallView
                                                    ? ''
                                                    : 'show-on-fullScreen',
                                            ]}
                                            //className={['w-full']}
                                            lg={getResponsive(item)}
                                            md={getResponsive(item)}
                                            sm={getResponsive(item)}
                                            xs={getResponsive(item)}
                                        //style={{display:item.displayInSmallView ?'':(divWidth<)}}
                                        >
                                            <TextValidator
                                                className="w-full"
                                                placeholder={item.placeholder}
                                                name={item.id}
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                onChange={(e) => {
                                                    if (formData[item.id]) {
                                                        let value =
                                                            formData[item.id]
                                                        value = {
                                                            widget_input_id:
                                                                item.id,
                                                            question:
                                                                item.caption,
                                                            answer: e.target
                                                                .value,
                                                            other_answers: {},
                                                        }
                                                        formData[item.id] =
                                                            value

                                                        setformData(formData)
                                                    } else {
                                                        let value = {
                                                            widget_input_id:
                                                                item.id,
                                                            question:
                                                                item.caption,
                                                            answer: e.target
                                                                .value,
                                                            other_answers: {},
                                                        }
                                                        formData[item.id] =
                                                            value

                                                        setformData(formData)
                                                    }

                                                    console.log(
                                                        'formData',
                                                        Object.values(formData)
                                                    )
                                                }}
                                                value={
                                                    formData[item.id]?.answer
                                                }
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                multiline
                                                rows={4}
                                            /*  validators={['required']}
                                         errorMessages={[
                                             'this field is required',
                                         ]} */
                                            />
                                        </Grid>
                                    )
                                } else if (
                                    item.component_type == 'autocomplete'
                                ) {
                                    return (
                                        <Grid
                                            key={i}
                                            item
                                            className={[
                                                item.className,
                                                item.displayInSmallView
                                                    ? ''
                                                    : 'show-on-fullScreen',
                                            ]}
                                            //className={['w-full']}
                                            lg={getResponsive(item)}
                                            md={getResponsive(item)}
                                            sm={getResponsive(item)}
                                            xs={getResponsive(item)}
                                        //style={{display:item.displayInSmallView ?'':(divWidth<)}}
                                        >
                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={item.ExaminationWidgetInputAnswers.filter(
                                                    (ele) =>
                                                        ele.status == 'Active'
                                                )}
                                                getOptionLabel={(option) =>
                                                    option.displayNa
                                                }
                                                onChange={(e, v) => {
                                                    if (v != null) {
                                                        console.log(
                                                            'value',
                                                            v.value
                                                        )
                                                        //onInputChange(item.id, v.value)
                                                        if (formData[item.id]) {
                                                            let value =
                                                                formData[
                                                                item.id
                                                                ]
                                                            value = {
                                                                widget_input_id:
                                                                    item.id,
                                                                question:
                                                                    item.caption,
                                                                answer: v.value,
                                                                other_answers:
                                                                    {},
                                                            }
                                                            formData[item.id] =
                                                                value

                                                            setformData(
                                                                formData
                                                            )
                                                        } else {
                                                            let value = {
                                                                widget_input_id:
                                                                    item.id,
                                                                question:
                                                                    item.caption,
                                                                answer: v.value,
                                                                other_answers:
                                                                    {},
                                                            }
                                                            formData[item.id] =
                                                                value

                                                            setformData(
                                                                formData
                                                            )
                                                        }

                                                        console.log(
                                                            'formData',
                                                            Object.values(
                                                                formData
                                                            )
                                                        )
                                                    } else {
                                                        onInputChange(
                                                            item.id,
                                                            null
                                                        )
                                                    }
                                                }}
                                                value={
                                                    item.ExaminationWidgetInputAnswers.filter(
                                                        (ele) =>
                                                            ele.value ==
                                                            formData[item.id]
                                                                ?.answer
                                                    )[0]
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder={
                                                            item.placeholder
                                                        }
                                                        name={item.id}
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    )
                                } else if (item.component_type == 'radio') {
                                    return (
                                        <Grid
                                            key={i}
                                            item
                                            className={[
                                                item.className,
                                                item.displayInSmallView
                                                    ? ''
                                                    : 'show-on-fullScreen',
                                            ]}
                                            //className={['w-full']}
                                            lg={getResponsive(item)}
                                            md={getResponsive(item)}
                                            sm={getResponsive(item)}
                                            xs={getResponsive(item)}
                                        //style={{display:item.displayInSmallView ?'':(divWidth<)}}
                                        >
                                            <SubTitle title={item.caption} />
                                            <RadioGroup
                                                row
                                                className="mt--2"
                                                defaultValue={
                                                    formData[item.id]?.answer
                                                }
                                            >
                                                {item.data.map((val, i) => {
                                                    if (val.isDefault) {
                                                        if (formData[item.id]) {
                                                            /*  let value = formData[item.id];
                                                             value.answer = val.value;
                                                             formData[item.id] = value;
                                                             setformData(formData) */
                                                        } else {
                                                            let value = {
                                                                widget_input_id:
                                                                    item.id,
                                                                question:
                                                                    item.caption,
                                                                answer: '',
                                                            }
                                                            value.answer =
                                                                val.value

                                                            formData[item.id] =
                                                                value

                                                            setformData(
                                                                formData
                                                            )
                                                        }
                                                    }
                                                    return (
                                                        <FormControlLabel
                                                            key={i}
                                                            label={
                                                                val.displayName
                                                            }
                                                            name={item.id}
                                                            value={val.value}
                                                            onClick={() => {
                                                                if (
                                                                    formData[
                                                                    item.id
                                                                    ]
                                                                ) {
                                                                    let value =
                                                                        formData[
                                                                        item
                                                                            .id
                                                                        ]
                                                                    value = {
                                                                        widget_input_id:
                                                                            item.id,
                                                                        question:
                                                                            item.caption,
                                                                        answer: val.value,
                                                                        other_answers:
                                                                            {},
                                                                    }
                                                                    formData[
                                                                        item.id
                                                                    ] = value
                                                                    setformData(
                                                                        formData
                                                                    )
                                                                    console.log(
                                                                        'formdata',
                                                                        formData
                                                                    )
                                                                } else {
                                                                    let value =
                                                                    {
                                                                        widget_input_id:
                                                                            item.id,
                                                                        question:
                                                                            item.caption,
                                                                        answer: val.value,
                                                                        other_answers:
                                                                            {},
                                                                    }
                                                                    formData[
                                                                        item.id
                                                                    ] = value

                                                                    setformData(
                                                                        formData
                                                                    )
                                                                    console.log(
                                                                        'formdata',
                                                                        formData
                                                                    )
                                                                }
                                                            }}
                                                            control={
                                                                <Radio
                                                                    color="primary"
                                                                    size="small"
                                                                />
                                                            }
                                                            //checked={val.isDefault}
                                                            display="inline"
                                                        />
                                                    )
                                                })}
                                            </RadioGroup>
                                        </Grid>
                                    )
                                } else if (item.component_type == 'checkBox') {
                                    if (formData[item.id]) {
                                    } else {
                                        let tempVal = {
                                            widget_input_id: item.id,
                                            question: item.caption,
                                            answer: '',
                                            other_answers: {},
                                        }
                                        item.data.map((val, i) => {
                                            if (val.isDefault) {
                                                tempVal.other_answers[
                                                    val.displayName
                                                ] = true
                                            } else {
                                                tempVal.other_answers[
                                                    val.displayName
                                                ] = false
                                            }
                                        })
                                        formData[item.id] = tempVal
                                        setformData(formData)
                                    }

                                    return (
                                        <Grid
                                            key={i}
                                            item
                                            className={[
                                                item.className,
                                                item.displayInSmallView
                                                    ? ''
                                                    : 'show-on-fullScreen',
                                            ]}
                                            //className={['w-full']}
                                            lg={getResponsive(item)}
                                            md={getResponsive(item)}
                                            sm={getResponsive(item)}
                                            xs={getResponsive(item)}
                                        //style={{display:item.displayInSmallView ?'':(divWidth<)}}
                                        >
                                            <SubTitle title={item.question} />
                                            <div row className="mt--2">
                                                {item.data.map((val, i) => {
                                                    return (
                                                        <FormControlLabel
                                                            key={i}
                                                            label={
                                                                val.displayName
                                                            }
                                                            name={item.id}
                                                            value={
                                                                formData[
                                                                    item.id
                                                                ].other_answers[
                                                                val
                                                                    .displayName
                                                                ]
                                                            }
                                                            onClick={() => {
                                                                formData[
                                                                    item.id
                                                                ].other_answers[
                                                                    val.displayName
                                                                ] =
                                                                    !formData[
                                                                        item.id
                                                                    ]
                                                                        .other_answers[
                                                                    val
                                                                        .displayName
                                                                    ]
                                                                setformData(
                                                                    formData
                                                                )
                                                                //console.log("formdata", formData[item.id].other_answers[val.displayName])
                                                            }}
                                                            control={
                                                                <Checkbox
                                                                    color="primary"
                                                                    size="small"
                                                                    defaultChecked={
                                                                        formData[
                                                                            item
                                                                                .id
                                                                        ]
                                                                            .other_answers[
                                                                        val
                                                                            .displayName
                                                                        ]
                                                                    }
                                                                />
                                                            }
                                                            //checked={formData[item.id]?.other_answers[val.displayName]}
                                                            display="inline"
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </Grid>
                                    )
                                } else if (
                                    item.component_type == 'datePicker'
                                ) {
                                    return (
                                        <Grid
                                            key={i}
                                            item
                                            className={[
                                                item.className,
                                                item.displayInSmallView
                                                    ? ''
                                                    : 'show-on-fullScreen',
                                            ]}
                                            //className={['w-full']}
                                            lg={getResponsive(item)}
                                            md={getResponsive(item)}
                                            sm={getResponsive(item)}
                                            xs={getResponsive(item)}
                                        //style={{display:item.displayInSmallView ?'':(divWidth<)}}
                                        >
                                            <DatePicker
                                                className="w-full"
                                                //value={this.state.filterData.from}
                                                placeholder={item.placeholder}
                                                name={item.id}
                                                // minDate={new Date()}
                                                //maxDate={new Date("2020-10-20")}
                                                // required={true}
                                                // errorMessages="this field is required"
                                                onChange={(date) => {
                                                    if (formData[item.id]) {
                                                        let value =
                                                            formData[item.id]
                                                        value = {
                                                            widget_input_id:
                                                                item.id,
                                                            question:
                                                                item.caption,
                                                            answer: date,
                                                            other_answers: {},
                                                        }
                                                        formData[item.id] =
                                                            value

                                                        setformData(formData)
                                                    } else {
                                                        let value = {
                                                            widget_input_id:
                                                                item.id,
                                                            question:
                                                                item.caption,
                                                            answer: date,
                                                            other_answers: {},
                                                        }
                                                        formData[item.id] =
                                                            value

                                                        setformData(formData)
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    )
                                } else if (
                                    item.component_type == 'submit_button'
                                ) {
                                    return (
                                        <Grid
                                            key={i}
                                            item
                                            className={[
                                                item.className,
                                                item.displayInSmallView
                                                    ? ''
                                                    : 'show-on-fullScreen',
                                            ]}
                                            //className={['w-full']}
                                            lg={getResponsive(item)}
                                            md={getResponsive(item)}
                                            sm={getResponsive(item)}
                                            xs={getResponsive(item)}
                                        //style={{display:item.displayInSmallView ?'':(divWidth<)}}
                                        >
                                            <Button
                                                className="mt-2"
                                                progress={false}
                                                type="submit"
                                                scrollToTop={true}
                                                startIcon="save"
                                            //onClick={this.handleChange}
                                            >
                                                <span className="capitalize">
                                                    Submit
                                                </span>
                                            </Button>
                                        </Grid>
                                    )
                                }
                            } else if (item.type == 'graph') {
                                return (
                                    <Grid
                                        item
                                        className={[
                                            item.className,
                                            item.displayInSmallView
                                                ? ''
                                                : 'show-on-fullScreen',
                                        ]}
                                        lg={getResponsive(item)}
                                        md={getResponsive(item)}
                                        sm={getResponsive(item)}
                                        xs={getResponsive(item)}
                                    >
                                        <Charts
                                            height="280px"
                                            type={item.component_type}
                                            data={item.data}
                                            loadFromCloud={loadFromCloud}
                                        ></Charts>
                                    </Grid>
                                )
                            } else if (item.type == 'canvas') {
                                return <CanvasDraw loadFromCloud={loadFromCloud}></CanvasDraw>
                            } else if (item.type == 'inputVariables') {
                                if (item.component_type == 'input') {
                                    return (
                                        <Grid
                                            key={i}
                                            item
                                            className={[
                                                item.className,
                                                item.displayInSmallView
                                                    ? ''
                                                    : 'show-on-fullScreen',
                                            ]}
                                            //className={['w-full']}
                                            lg={getResponsive(item)}
                                            md={getResponsive(item)}
                                            sm={getResponsive(item)}
                                            xs={getResponsive(item)}
                                        //style={{display:item.displayInSmallView ?'':(divWidth<)}}
                                        >
                                            <TextValidator
                                                className="w-full"
                                                placeholder={item.placeholder}
                                                name={item.id}
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                onChange={(e) => {
                                                    //item.otherData.globalVariableName
                                                    // window.dashboardVariables[`${item.otherData.globalVariableName}`] = e.target.value;
                                                    console.log(
                                                        'input id',
                                                        item.id
                                                    )
                                                    handleChange(e.target.value)
                                                }}
                                                value={
                                                    dashboardVariables
                                                        ? dashboardVariables[
                                                        `${item.otherData
                                                            ? item
                                                                .otherData
                                                                .globalVariableName
                                                            : null
                                                        }`
                                                        ]
                                                        : null
                                                }
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            />
                                        </Grid>
                                    )
                                }
                            } else if (item.type == 'hernia') {
                                return (
                                    <Hernia
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Hernia>
                                )
                            }
                            //obstetric
                            else if (item.type == 'go_by') {
                                return (
                                    <GoBy
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></GoBy>
                                )
                            } else if (item.type == 'allergies') {
                                return (
                                    <Allergies
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Allergies>
                                )
                            } else if (item.type == 'np_drug') {
                                return (
                                    <NPDrug
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></NPDrug>
                                )
                            } else if (item.type == 'patientInfo') {
                                return (
                                    <PatientInfo
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></PatientInfo>
                                )
                            } else if (item.type == 'diagnosis') {
                                return (
                                    <Diagnosis
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Diagnosis>
                                )
                            } else if (item.type == 'complaints') {
                                return (
                                    <Complaints
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Complaints>
                                )
                            } else if (item.type == 'complications') {
                                return (
                                    <Complications
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Complications>
                                )
                            } else if (item.type == 'problem_list') {
                                return (
                                    <ProblemList
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></ProblemList>
                                )
                            } else if (item.type == 'prescription') {
                                return (
                                    <Prescription
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Prescription>
                                )
                            } else if (item.type == 'blood_pressure') {
                                return (
                                    <BloodPressure
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></BloodPressure>
                                )
                            } else if (item.type == 'blood_sugar') {
                                return (
                                    <BloodSugar
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></BloodSugar>
                                )
                            } else if (item.type == 'glycemic_control') {
                                return (
                                    <GlycemicControl
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></GlycemicControl>
                                )
                            } else if (item.type == 'lipid_profile') {
                                return (
                                    <LipidProfile
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></LipidProfile>
                                )
                            } else if (item.type == 'liver_profile') {
                                return (
                                    <LiverProfile
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></LiverProfile>
                                )
                            } else if (item.type == 'renal_profile') {
                                return (
                                    <RenalProfile
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></RenalProfile>
                                )
                            } else if (item.type == 'investigation_request') {
                                return (
                                    <InvestigationsRequests
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></InvestigationsRequests>
                                )
                            } else if (item.type == 'arv') {
                                return (
                                    <ARV
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></ARV>
                                )
                            } else if (item.type == 'procedure') {
                                return (
                                    <Procedures
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Procedures>
                                )
                            } else if (item.type == 'procedure_history') {
                                return (
                                    <ViewProcedures
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></ViewProcedures>
                                )
                            } else if (item.type == 'pulse') {
                                return (
                                    <Pulse
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Pulse>
                                )
                            } else if (item.type == 'chestDeformities') {
                                return (
                                    <ChestDeformities
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></ChestDeformities>
                                )
                            } else if (item.type == 'heartSounds') {
                                return (
                                    <HeartSounds
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></HeartSounds>
                                )
                            } else if (item.type == 'apex') {
                                return (
                                    <Apex
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Apex>
                                )
                            } else if (item.type == 'jugularVenousPreasure') {
                                return (
                                    <JugularVenousPreasure
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></JugularVenousPreasure>
                                )
                            } else if (item.type == 'murmur') {
                                return (
                                    <Murmur
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Murmur>
                                )
                            } else if (item.type == 'general') {
                                return (
                                    <General
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></General>
                                )
                            } else if (item.type == 'tongue') {
                                return (
                                    <Tongue
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Tongue>
                                )
                            } else if (item.type == 'skin') {
                                return (
                                    <Skin
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Skin>
                                )
                            } else if (item.type == 'cyanosis') {
                                return (
                                    <Cyanosis
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Cyanosis>
                                )
                            } else if (item.type == 'glasgowComaScale') {
                                return (
                                    <GlasgowComaScale
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></GlasgowComaScale>
                                )
                            } else if (item.type == 'bmi') {
                                return (
                                    <BMI
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></BMI>
                                )
                            } else if (item.type == 'bodyTemperature') {
                                return (
                                    <BodyTemperature
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></BodyTemperature>
                                )
                            } else if (item.type == 'eyes') {
                                return (
                                    <Eyes
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Eyes>
                                )
                            } else if (item.type == 'mouth') {
                                return (
                                    <Mouth
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Mouth>
                                )
                            } else if (item.type == 'thyroid_Hyporthyroid') {
                                return (
                                    <Thyroid_Hyporthyroid
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Thyroid_Hyporthyroid>
                                )
                            } else if (item.type == 'thyroid_Hyperthyroid') {
                                return (
                                    <Thyroid_Hyperthyroid
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Thyroid_Hyperthyroid>
                                )
                            } else if (item.type == 'other') {
                                return (
                                    <Other
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Other>
                                )
                            } else if (item.type == 'crft') {
                                return (
                                    <CRFT
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></CRFT>
                                )
                            } else if (item.type == 'posture') {
                                return (
                                    <Posture
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Posture>
                                )
                            } else if (item.type == 'stridor') {
                                return (
                                    <Stridor
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Stridor>
                                )
                            } else if (item.type == 'odema') {
                                return (
                                    <Odema
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Odema>
                                )
                            } else if (item.type == 'involuntary_Movement') {
                                return (
                                    <Involuntary_Movement
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Involuntary_Movement>
                                )
                            } else if (item.type == 'inspection') {
                                return (
                                    <Inspection
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Inspection>
                                )
                            } else if (item.type == 'respiratory_rate') {
                                return (
                                    <RespiratoryRate
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></RespiratoryRate>
                                )
                            } else if (item.type == 'palpation') {
                                return (
                                    <Palpation
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Palpation>
                                )
                            } else if (item.type == 'breath_sounds') {
                                return (
                                    <BreathSounds
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></BreathSounds>
                                )
                            } else if (item.type == 'added_sounds') {
                                return (
                                    <AddedSounds
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></AddedSounds>
                                )
                            } else if (item.type == 'percussion') {
                                return (
                                    <Percussion
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Percussion>
                                )
                            } else if (item.type == 'vocal_resonance') {
                                return (
                                    <VocalResonance
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></VocalResonance>
                                )
                            } else if (item.type == 'bowel_sounds') {
                                return (
                                    <BowelSounds
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></BowelSounds>
                                )
                            } else if (item.type == 'kidney') {
                                return (
                                    <Kidney
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Kidney>
                                )
                            } else if (item.type == 'free_fluid') {
                                return (
                                    <FreeFluid
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></FreeFluid>
                                )
                            } else if (item.type == 'splenomegaly') {
                                return (
                                    <Splenomegaly
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Splenomegaly>
                                )
                            } else if (item.type == 'hepatomegaly') {
                                return (
                                    <Hepatomegaly
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Hepatomegaly>
                                )
                            } else if (item.type == 'genitilia_Hernia') {
                                return (
                                    <Genitilia_Hernia
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Genitilia_Hernia>
                                )
                            } else if (item.type == 'general_abdomen') {
                                /* else if (item.type == "hernia") {
                                return (<Abdomen_Hernia itemId={item.id} widget_id={id}
                                        loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Abdomen_Hernia>)
                            } */
                                return (
                                    <GeneralAbdomen
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></GeneralAbdomen>
                                )
                            } else if (
                                item.type == 'digital_rectal_examination'
                            ) {
                                return (
                                    <DigitalRenalRectalExamination
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></DigitalRenalRectalExamination>
                                )
                            } else if (item.type == 'masses') {
                                return (
                                    <Masses
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Masses>
                                )
                            }
                            //obstetric
                            else if (item.type == 'striae_gravidarum') {
                                return (
                                    <StriaeGravidarum
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></StriaeGravidarum>
                                )
                            } else if (item.type == 'linea_nigra') {
                                return (
                                    <LineaNigra
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></LineaNigra>
                                )
                            } else if (item.type == 'scars') {
                                return (
                                    <Scars
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Scars>
                                )
                            } else if (item.type == 'symphysis_fundal_height') {
                                return (
                                    <SymphysisFundalHeight
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></SymphysisFundalHeight>
                                )
                            } else if (item.type == 'no_of_fetus') {
                                return (
                                    <NoOfFetus
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></NoOfFetus>
                                )
                            } else if (item.type == 'umbilicus') {
                                return (
                                    <Umbilicus
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Umbilicus>
                                )
                            } else if (item.type == 'presentation') {
                                return (
                                    <Presentation
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Presentation>
                                )
                            } else if (item.type == 'liquor_volume') {
                                return (
                                    <LiquorVolume
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></LiquorVolume>
                                )
                            } else if (item.type == 'head_engaged') {
                                return (
                                    <HeadEngaged
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></HeadEngaged>
                                )
                            } else if (item.type == 'fetal_lie') {
                                return (
                                    <FetalLie
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></FetalLie>
                                )
                            } else if (item.type == 'fetal_heart_sound') {
                                return (
                                    <FetalHeartSound
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></FetalHeartSound>
                                )
                            } else if (item.type == 'other_examination') {
                                return (
                                    <FetalHeartSound
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></FetalHeartSound>
                                )
                            } else if (item.type == 'vaccination') {
                                return (
                                    <Vaccination
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Vaccination>
                                )
                            } else if (item.type == 'investigation') {
                                return (
                                    <Investigation
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Investigation>
                                )
                            } else if (item.type == 'husbands_blood_group') {
                                return (
                                    <HusbandBloodGroup
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></HusbandBloodGroup>
                                )
                            } else if (item.type == 'doppler') {
                                return (
                                    <Doppler
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Doppler>
                                )
                            } else if (item.type == 'efw') {
                                return (
                                    <EFW
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></EFW>
                                )
                            } else if (item.type == 'placenta') {
                                return (
                                    <Placenta
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Placenta>
                                )
                            } else if (item.type == 'presentation') {
                                return (
                                    <PresentationAFI
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></PresentationAFI>
                                )
                            } else if (item.type == 'obstetric_history') {
                                return (
                                    <ObstetricHistory
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></ObstetricHistory>
                                )
                            } else if (item.type == 'lmp') {
                                return (
                                    <LMP
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></LMP>
                                )
                            } else if (item.type == 'uss') {
                                return (
                                    <USS
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></USS>
                                )
                            } else if (item.type == 'add_uss') {
                                return (
                                    <AddUSS
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></AddUSS>
                                )
                            } else if (item.type == 'hands') {
                                return (
                                    <Hands
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Hands>
                                )
                            } else if (item.type == 'thyroid') {
                                return (
                                    <Thyroid
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Thyroid>
                                )
                            } else if (item.type == 'thyroid_Gland') {
                                return (
                                    <Thyroid_Gland
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Thyroid_Gland>
                                )
                            } else if (item.type == 'clinical_Conclusion') {
                                return (
                                    <Clinical_Conclusion
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Clinical_Conclusion>
                                )
                            } else if (item.type == 'genitalia_Hernia') {
                                return (
                                    <Genitilia_Hernia
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Genitilia_Hernia>
                                )
                            } else if (item.type == 'penisGeneral') {
                                return (
                                    <PenisGeneral
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></PenisGeneral>
                                )
                            } else if (item.type == 'ulcer') {
                                return (
                                    <Ulcer
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Ulcer>
                                )
                            } else if (item.type == 'lump') {
                                return (
                                    <Lump
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Lump>
                                )
                            } else if (item.type == 'scrotum') {
                                return (
                                    <Scrotum
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Scrotum>
                                )
                            } else if (item.type == 'lump_Scrotum') {
                                return (
                                    <Lump_Scrotum
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Lump_Scrotum>
                                )
                            } else if (item.type == 'ulcer_Scrotum') {
                                return (
                                    <Ulcer_Scrotum
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Ulcer_Scrotum>
                                )
                            } else if (item.type == 'testis') {
                                return (
                                    <Testis
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Testis>
                                )
                            } else if (item.type == 'hydrocele') {
                                return (
                                    <Hydrocele
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Hydrocele>
                                )
                            } else if (item.type == 'epididymal_Cyst') {
                                return (
                                    <Epididymal_Cyst
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Epididymal_Cyst>
                                )
                            } else if (item.type == 'NP Drug') {
                                return (
                                    <PatientNPDrugSummary
                                        itemId={item.id}
                                        widget_id={id}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></PatientNPDrugSummary>
                                )
                            } else if (item.type == 'testis_Palpable') {
                                return (
                                    <Testis_Palpable
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Testis_Palpable>
                                )
                            } else if (item.type == 'varicocele') {
                                return (
                                    <Varicocele
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Varicocele>
                                )
                            } else if (item.type == 'haematocele') {
                                return (
                                    <Haematocele
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Haematocele>
                                )
                            } else if (item.type == 'orchitis') {
                                return (
                                    <Orchitis
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Orchitis>
                                )
                            } else if (item.type == 'epididymo') {
                                return (
                                    <Epididymo
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Epididymo>
                                )
                            } else if (item.type == 'torsion') {
                                return (
                                    <Torsion
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Torsion>
                                )
                            } else if (item.type == 'tumour') {
                                return (
                                    <Tumour
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Tumour>
                                )
                            } else if (item.type == 'development') {
                                return (
                                    <Development
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Development>
                                )
                            } else if (item.type == 'growth_General') {
                                return (
                                    <Growth_General
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Growth_General>
                                )
                            } else if (
                                item.type == 'investigation_for_short_stature'
                            ) {
                                return (
                                    <Growth_Investigation_for_short_stature
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Growth_Investigation_for_short_stature>
                                )
                            } else if (item.type == 'growth_remark') {
                                return (
                                    <Growth_Remark
                                        itemId={item.id}
                                        widget_id={id}
                                        loadFromCloud={loadFromCloud}
                                        patient_id={
                                            dashboardVariables
                                                ? dashboardVariables.patient_id
                                                : null
                                        }
                                        onReload={reload()}
                                    ></Growth_Remark>
                                )
                            }
                            else if (item.type == "scars") {
                                return (<Scars itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Scars>)
                            }
                            else if (item.type == "symphysis_fundal_height") {
                                return (<SymphysisFundalHeight itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></SymphysisFundalHeight>)
                            }
                            else if (item.type == "no_of_fetus") {
                                return (<NoOfFetus itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></NoOfFetus>)
                            }
                            else if (item.type == "umbilicus") {
                                return (<Umbilicus itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Umbilicus>)
                            }
                            else if (item.type == "presentation") {
                                return (<Presentation itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Presentation>)
                            }
                            else if (item.type == "liquor_volume") {
                                return (<LiquorVolume itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></LiquorVolume>)
                            }
                            else if (item.type == "head_engaged") {
                                return (<HeadEngaged itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></HeadEngaged>)
                            }
                            else if (item.type == "fetal_lie") {
                                return (<FetalLie itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></FetalLie>)
                            }
                            else if (item.type == "fetal_heart_sound") {
                                return (<FetalHeartSound itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></FetalHeartSound>)
                            }
                            else if (item.type == "other_examination") {
                                return (<FetalHeartSound itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></FetalHeartSound>)
                            }
                            else if (item.type == "vaccination") {
                                return (<Vaccination itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Vaccination>)
                            }
                            else if (item.type == "investigation") {
                                return (<Investigation itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Investigation>)
                            }
                            else if (item.type == "husbands_blood_group") {
                                return (<HusbandBloodGroup itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></HusbandBloodGroup>)
                            }
                            else if (item.type == "doppler") {
                                return (<Doppler itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Doppler>)
                            }
                            else if (item.type == "efw") {
                                return (<EFW itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></EFW>)
                            }
                            else if (item.type == "placenta") {
                                return (<Placenta itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Placenta>)
                            }
                            else if (item.type == "presentation") {
                                return (<PresentationAFI itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></PresentationAFI>)
                            }
                            else if (item.type == "obstetric_history") {
                                return (<ObstetricHistory itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></ObstetricHistory>)
                            }
                            else if (item.type == "lmp") {
                                return (<LMP itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></LMP>)
                            }
                            else if (item.type == "uss") {
                                return (<USS itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></USS>)
                            }
                            else if (item.type == "add_uss") {
                                return (<AddUSS itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></AddUSS>)
                            }
                            else if (item.type == "hands") {
                                return (<Hands itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Hands>)
                            }
                            else if (item.type == "thyroid") {
                                return (<Thyroid itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Thyroid>)
                            }
                            else if (item.type == "thyroid_Gland") {
                                return (<Thyroid_Gland itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Thyroid_Gland>)
                            }
                            else if (item.type == "clinical_Conclusion") {
                                return (<Clinical_Conclusion itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Clinical_Conclusion>)
                            }
                            else if (item.type == "genitalia_Hernia") {
                                return (<Genitilia_Hernia itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Genitilia_Hernia>)
                            }
                            else if (item.type == "penisGeneral") {
                                return (<PenisGeneral itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></PenisGeneral>)
                            }
                            else if (item.type == "ulcer") {
                                return (<Ulcer itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Ulcer>)
                            }
                            else if (item.type == "lump") {
                                return (<Lump itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Lump>)
                            }
                            else if (item.type == "scrotum") {
                                return (<Scrotum itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Scrotum>)
                            }
                            else if (item.type == "lump_Scrotum") {
                                return (<Lump_Scrotum itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Lump_Scrotum>)
                            }
                            else if (item.type == "ulcer_Scrotum") {
                                return (<Ulcer_Scrotum itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Ulcer_Scrotum>)
                            }
                            else if (item.type == "testis") {
                                return (<Testis itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Testis>)
                            }
                            else if (item.type == "hydrocele") {
                                return (<Hydrocele itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Hydrocele>)
                            }
                            else if (item.type == "epididymal_Cyst") {
                                return (<Epididymal_Cyst itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Epididymal_Cyst>)
                            }
                            else if (item.type == "testis_Palpable") {
                                return (<Testis_Palpable itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Testis_Palpable>)
                            }
                            else if (item.type == "varicocele") {
                                return (<Varicocele itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Varicocele>)
                            }
                            else if (item.type == "haematocele") {
                                return (<Haematocele itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Haematocele>)
                            }
                            else if (item.type == "orchitis") {
                                return (<Orchitis itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Orchitis>)
                            }
                            else if (item.type == "epididymo") {
                                return (<Epididymo itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Epididymo>)
                            }
                            else if (item.type == "torsion") {
                                return (<Torsion itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Torsion>)
                            }
                            else if (item.type == "tumour") {
                                return (<Tumour itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Tumour>)
                            }
                            else if (item.type == "development") {
                                return (<Development itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Development>)
                            }
                            else if (item.type == "growth_General") {
                                return (<Growth_General itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Growth_General>)
                            }
                            else if (item.type == "investigation_for_short_stature") {
                                return (<Growth_Investigation_for_short_stature itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Growth_Investigation_for_short_stature>)
                            }
                            else if (item.type == "growth_remark") {
                                return (<Growth_Remark itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></Growth_Remark>)
                            }
                            else if (item.type == "development_charts") {
                                return (<DevelopmentCharts itemId={item.id} widget_id={id}
                                    loadFromCloud={loadFromCloud} patient_id={dashboardVariables ? dashboardVariables.patient_id : null} onReload={reload()}></DevelopmentCharts>)
                            }
                            //Starting user Dashboards
                            else if (item.type == "StockPosition") {
                                return (<StockPositionChart></StockPositionChart>)
                            }
                            else if (item.type == "drugItemView" && searchParams?.item_id != null) {
                                return (<StockInquiryItemDetails item_id={searchParams.item_id}></StockInquiryItemDetails>)
                            }
                            else if (item.type == "drugItemRequirement" && searchParams?.item_id != null) {
                                return (<StockInquiryRequirement item_id={searchParams.item_id}></StockInquiryRequirement>)
                            } else if (item.type == "drugItemIssues" && searchParams?.item_id != null) {
                                return (<StockInquiryEstimateAndIssue item_id={searchParams.item_id}></StockInquiryEstimateAndIssue>)
                            } else if (item.type == "monthlyForecast" && searchParams?.item_id != null) {
                                return (<MonthlyForecast item_id={searchParams.item_id}></MonthlyForecast>)
                            }else if (item.type == "orderPlacedDetails" && searchParams?.item_id != null) {
                                return (<StockInquiryOrderList item_id={searchParams.item_id}></StockInquiryOrderList>)
                            }else if (item.type == "itemOptions" && searchParams?.item_id != null) {
                                return (<ItemOptions item_id={searchParams.item_id}></ItemOptions>)
                            }else if (item.type == "itemPriceChart" && searchParams?.item_id != null) {
                                return (<PriceChart sr_no={searchParams.item_sr_no} item_id={searchParams.item_id}></PriceChart>)
                            }else if (item.type == "OrderReceivedDetails" && searchParams?.item_id != null) {
                                return (<OrdListReceived item_id={searchParams.item_id}></OrdListReceived>)
                            }else if (item.type == "OrderPendingDetails" && searchParams?.item_id != null) {
                                return (<OrdListPending item_id={searchParams.item_id}></OrdListPending>)
                            }


                            //Starting Hospital Director dashboard components
                            else if (item.type == "CPPrescriptionSummaryPieChart") {
                                return (<CPPrescriptionSummaryPieChart ></CPPrescriptionSummaryPieChart>)
                            }else if (item.type == "CPIssuedPrescription") {
                                return (<CPIssuedPrescription></CPIssuedPrescription>)
                            }else if (item.type == "CPDrugConsumptionBarChart" ) {
                                return (<CPDrugConsumptionBarChart></CPDrugConsumptionBarChart>)
                            }else if (item.type == "CPActivePrescription") {
                                return (<CPActivePrescription></CPActivePrescription>)
                            }else if (item.type == "CPOrderSummaryPieChart") {//error
                                return (<CPOrderSummaryPieChart></CPOrderSummaryPieChart>)
                            }else if (item.type == "HospitalAttendance") {
                                return (<HospitalAttendance></HospitalAttendance>)
                            }else if (item.type == "HospitalGeneralStatistics") {
                                return (<HospitalGeneralStatistics></HospitalGeneralStatistics>)
                            }else if (item.type == "UnservicerbleDrugs") {
                                return (<UnservicerbleDrugs></UnservicerbleDrugs>)
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

WidgetComponent.defaultProps = {
    props: {
        fieldset: [
            {
                id: 1,
                displayName: null,
                status: 'Active',
                style: "{{ width: '100%' }}",
                type: 'input', //autocomplete,radio,checkBox,textfield,datePicker
                className: 'w-full', //new added
                otherProps: { lg: 6, md: 6, sm: 6, xs: 6 }, //new added
                placeholder: 'Name', //new added
                fieldName: 'test_name', //new added for API data field name

                question: 'scars',
                displayInSmallView: false,
                widget_id: 1,
                createdAt: '2022-05-03T11:00:52.513Z',
                updatedAt: '2022-05-03T11:00:52.513Z',

                ExaminationWidgetInputAnswers: [
                    {
                        id: 1,
                        displayNa: 'NO',
                        status: 'Active',
                        value: 'No',
                        isDefault: true,
                        widget_in: 1,
                        createdAt: '2022-05-03T11:02:47.280Z',
                        updatedAt: '2022-05-03T11:02:47.280Z',
                    },
                ],
            },

            {
                id: 1,
                displayName: null,
                status: 'Active',
                style: "{{ width: '100%' }}",
                type: 'autocomplete',
                className: 'w-full', //new added
                otherProps: { lg: 6, md: 6, sm: 6, xs: 6 }, //new added
                placeholder: 'Name', //new added
                fieldName: 'test_name', //new added for API data field name

                question: 'scars',
                displayInSmallView: true,
                widget_id: 1,
                createdAt: '2022-05-03T11:00:52.513Z',
                updatedAt: '2022-05-03T11:00:52.513Z',

                ExaminationWidgetInputAnswers: [
                    {
                        id: 1,
                        displayNa: 'NO',
                        status: 'Active',
                        value: 'No',
                        isDefault: true,
                        widget_in: 1,
                        createdAt: '2022-05-03T11:02:47.280Z',
                        updatedAt: '2022-05-03T11:02:47.280Z',
                    },
                ],
            },
            {
                id: 1,
                displayName: null,
                status: 'Active',
                style: "{{ width: '100%' }}",
                type: 'checkBox',
                className: 'w-full mt--2', //new added
                otherProps: { lg: 6, md: 6, sm: 6, xs: 6 }, //new added
                placeholder: 'Name', //new added
                fieldName: 'test_name', //new added for API data field name

                question: 'scars',
                displayInSmallView: true,
                widget_id: 1,
                createdAt: '2022-05-03T11:00:52.513Z',
                updatedAt: '2022-05-03T11:00:52.513Z',

                ExaminationWidgetInputAnswers: [
                    {
                        id: 1,
                        displayNa: 'Yes',
                        status: 'Active',
                        value: 'Yes',
                        isDefault: true,
                        widget_in: 1,
                        createdAt: '2022-05-03T11:02:47.280Z',
                        updatedAt: '2022-05-03T11:02:47.280Z',
                    },
                    {
                        id: 1,
                        displayNa: 'No',
                        status: 'Active',
                        value: 'No',
                        isDefault: false,
                        widget_in: 1,
                        createdAt: '2022-05-03T11:02:47.280Z',
                        updatedAt: '2022-05-03T11:02:47.280Z',
                    },
                ],
            },
            {
                id: 1,
                displayName: null,
                status: 'Active',
                style: "{{ width: '100%' }}",
                type: 'datePicker',
                className: 'w-full', //new added
                otherProps: { lg: 6, md: 6, sm: 6, xs: 6 }, //new added
                placeholder: 'Date', //new added
                fieldName: 'test_date', //new added for API data field name

                question: 'scars',
                displayInSmallView: true,
                widget_id: 1,
                createdAt: '2022-05-03T11:00:52.513Z',
                updatedAt: '2022-05-03T11:00:52.513Z',

                ExaminationWidgetInputAnswers: [
                    {
                        id: 1,
                        displayNa: 'Yes',
                        status: 'Active',
                        value: 'Yes',
                        isDefault: true,
                        widget_in: 1,
                        createdAt: '2022-05-03T11:02:47.280Z',
                        updatedAt: '2022-05-03T11:02:47.280Z',
                    },
                ],
            },
        ],

        id: `widget-${makeid()}`,
        edit: false,
        fullScreenVisibility: true,
    },
}

export default WidgetComponent
