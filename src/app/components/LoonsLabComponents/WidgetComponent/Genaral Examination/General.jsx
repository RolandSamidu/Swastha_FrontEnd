import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import {
    Card,
    TextField,
    MenuItem,
    IconButton,
    Icon,
    Grid,
    Switch,
    Typography,
    Radio,
    RadioGroup,
    Divider,
    Tooltip,
    CircularProgress,
    TableCell,
    Table,
    TableBody,
    InputAdornment,
    TableRow,
    FormControlLabel,
    Checkbox,
} from '@material-ui/core'
import { themeColors } from 'app/components/MatxTheme/themeColors'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import * as appConst from '../../../../../appconst'

import {
    LoonsTable,
    DatePicker,
    Button,
    FilePicker,
    ExcelToTable,
    LoonsSnackbar,
    LoonsDialogBox,
    LoonsSwitch,
    LoonsCard,
    CardTitle,
    SubTitle,
    Charts,
}
    from "app/components/LoonsLabComponents";
// import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import { dateParse } from 'utils'
import PropTypes from "prop-types";

import ExaminationServices from 'app/services/ExaminationServices'
import { Autocomplete } from '@material-ui/lab'

const styleSheet = (theme) => ({})

const initial_form_data = {
    name: "",
    description: "",
}

const dialogBox_faculty_data = {
    id: "",
    name: "",
    description: "",
}

const facialAppearanceData = [
    {
        label: 'Thyrotoxicosis',
        value: 'thyrotoxicosis',
    },
    {
        label: 'Myxoedema',
        value: 'myxoedema',
    },
    {
        label: 'Cushings Syndrome',
        value: 'cushingsSyndrome',
    },
    {
        label: 'Acromegaly',
        value: 'acromegaly',
    },
    {
        label: 'Parkinsonism',
        value: 'parkinsonism',
    },
    {
        label: 'Tetanus',
        value: 'tetanus',
    },
    {
        label: 'Mongolism',
        value: 'mongolism',
    },
    {
        label: 'Nephrotic Syndrome',
        value: 'nephroticSyndrome',
    },
    {
        label: 'Tabes Dorsalis',
        value: 'tabesDorsalis',
    },
]

class General extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: "Complications is added Successfull",
            severity: 'success',
            data: [],

            formData: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",
                patient_id: window.dashboardVariables.patient_clinic_id,
                widget_id: this.props.widget_id,
                examination_data: [{
                    widget_input_id: this.props.itemId,
                    question: "general",
                    other_answers: {
                        appearance: 'normal',
                        illLooking: false,
                        wasted: false,
                        facialAppearance: 'normal',
                        thyrotoxicosis: false,
                        myxoedema: false,
                        cushingsSyndrome: false,
                        acromegaly: false,
                        parkinsonism: false,
                        tetanus: false,
                        mongolism: false,
                        nephroticSyndrome: false,
                        tabesDorsalis: false,
                        dehydrated: 'no',
                        dehydratedPresent: null,

                    }
                }

                ]
            },
        }
    }

    static propTypes = {
        onReload: PropTypes.func,
    }

    async loadData() {
        this.setState({
            // loaded: false,
            // data: [],
        })
        let params = {
            patient_id: window.dashboardVariables.patient_id,
            widget_input_id: this.props.itemId,
            question: 'general',
            'order[0]': [
                'createdAt', 'DESC'
            ],
            limit: 10
        }


        let res;
        if (this.props.loadFromCloud) {

            res = await ExaminationServices.getDataFromCloud(params)
        } else {

            res = await ExaminationServices.getData(params)
        }
        //console.log("Examination Data ", res)
        if (200 == res.status) {
            console.log("Examination Data blood pressure", res.data.view.data)
            this.setState({ data: [] })
            let data = [];
            let other_answers = [];

            res.data.view.data.forEach(element => {
                data.push(element.other_answers)
            });
            this.setState({ data: data, loaded: true })
        }


    }


    async submit() {
        console.log("formdata", this.state.formData)
        let formData = this.state.formData;

        let res = await ExaminationServices.saveData(formData)
        console.log("Examination Data added", res)
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Examination Data Added Successful',
                severity: 'success',
            }, () => {
                this.loadData()
                //this.onReload()
            })
        }
    }

    async onReload() {
        const { onReload } = this.props;

        onReload &&
            onReload();
    }

    //set input value changes
    componentDidMount() {
        console.log("item id", this.props.itemId)
        this.loadData()
        //this.interval = setInterval(() => this.loadData(), 5000);
    }
    componentWillUnmount() {
        // clearInterval(this.interval);
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        let activeTheme = MatxLayoutSettings.activeTheme

        return (


            <Fragment>
                <ValidatorForm onSubmit={() => { this.submit() }} className='flex mx-2' >
                    <Grid container spacing={1}>
                        {/* Appearance */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Appearance' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.appearance} row>
                                <FormControlLabel
                                    label={"Normal"}
                                    name="normal"
                                    value="normal"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.appearance = "normal"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />

                                <FormControlLabel
                                    label={"Abnormal"}
                                    name="abnormal"
                                    value="abnormal"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.appearance = "abnormal"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                            </RadioGroup>  
                        </Grid>
                        {/* If select Abnormal */}
                        { this.state.formData.examination_data[0].other_answers.appearance == 'abnormal' ?
                            <Grid className='mt-2' item lg={12} md={12} sm={12} xs={12}>
                                <FormControlLabel
                                    // key={i}
                                    label='Ill Looking'
                                    name='illLooking'
                                    value='illLooking'
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.illLooking = !formData.examination_data[0].other_answers.illLooking
                                        this.setState({ formData })
                                    }}
                                    defaultValue = 'normal'
                                    control={
                                        <Checkbox
                                            color="primary"
                                            // checked={field.displayInSmallView}
                                            size="small"
                                        />
                                    }
                                    display="inline"
                                    />
                                    <FormControlLabel
                                    // key={i}
                                    label='Wasted'
                                    name='wasted'
                                    value='wasted'
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.wasted = !formData.examination_data[0].other_answers.wasted
                                        this.setState({ formData })
                                    }}
                                    defaultValue = 'normal'
                                    control={
                                        <Checkbox
                                            color="primary"
                                            // checked={field.displayInSmallView}
                                            size="small"
                                        />
                                    }
                                    display="inline"
                                    />
                            </Grid>
                            : null
                        }

                        {/* Facial Appearance */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Facial Appearance' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.facialAppearance} row>
                                <FormControlLabel
                                    label={"Normal"}
                                    name="normal"
                                    value="normal"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.facialAppearance = "normal"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />

                                <FormControlLabel
                                    label={"Abnormal"}
                                    name="abnormal"
                                    value="abnormal"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.facialAppearance = "abnormal"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                            </RadioGroup>  
                        </Grid>
                        {/* If select Abnormal */}
                        { this.state.formData.examination_data[0].other_answers.facialAppearance == 'abnormal' ?
                            <Grid className='mt-2' item lg={12} md={12} sm={12} xs={12}>
                                { facialAppearanceData.map((data) =>  
                                    <FormControlLabel
                                    // key={i}
                                    label={data.label}
                                    name={data.value}
                                    value={data.value}
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers[data.value] = !formData.examination_data[0].other_answers[data.value]
                                        this.setState({ formData })
                                    }}
                                    defaultValue = 'normal'
                                    control={
                                        <Checkbox
                                            color="primary"
                                            // checked={field.displayInSmallView}
                                            size="small"
                                        />
                                    }
                                    display="inline"
                                />
                                )}
                            </Grid>
                            : null
                        }

                        {/* Dehydrated */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Dehydrated' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.dehydrated} row>
                                <FormControlLabel
                                    label={"No"}
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.dehydrated = "no"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />

                                <FormControlLabel
                                    label={"Present"}
                                    name="present"
                                    value="present"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.dehydrated = "present"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                            </RadioGroup>  
                        </Grid>
                        {/* If select Present */}
                        { this.state.formData.examination_data[0].other_answers.dehydrated == 'present' ?
                            <Grid className='mt-2' item lg={12} md={12} sm={12} xs={12}>
                                <RadioGroup row>
                                    <FormControlLabel
                                        label={"Mild"}
                                        name="mild"
                                        value="mild"
                                        onChange={() => {
                                            let formData = this.state.formData;
                                            formData.examination_data[0].other_answers.dehydratedPresent = "mild"
                                            this.setState({ formData })
                                        }}
                                        control={
                                            <Radio size='small' color="primary" />
                                        }
                                        display="inline"
                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                    />

                                    <FormControlLabel
                                        label={"Moderates"}
                                        name="moderates"
                                        value="moderates"
                                        onChange={() => {
                                            let formData = this.state.formData;
                                            formData.examination_data[0].other_answers.dehydratedPresent = "moderates"
                                            this.setState({ formData })
                                        }}
                                        control={
                                            <Radio size='small' color="primary" />
                                        }
                                        display="inline"
                                        // checked={
                                        //     !this.state.formData.examination_data[0].other_answers.probable
                                        // }
                                    />
                                    <FormControlLabel
                                        label={"Severe"}
                                        name="severe"
                                        value="severe"
                                        onChange={() => {
                                            let formData = this.state.formData;
                                            formData.examination_data[0].other_answers.dehydratedPresent = "severe"
                                            this.setState({ formData })
                                        }}
                                        control={
                                            <Radio size='small' color="primary" />
                                        }
                                        display="inline"
                                        // checked={
                                        //     !this.state.formData.examination_data[0].other_answers.probable
                                        // }
                                    />
                                </RadioGroup>
                            </Grid>
                            : null
                        }

                        {/* save */}
                        <Grid className='flex justify-start' item lg={12} md={12} sm={12} xs={12}>
                            <Button
                                className='' progress={false} type="submit" startIcon="save"
                            >
                                <span className="capitalize">
                                    Save
                                </span>
                            </Button>
                        </Grid>
                    </Grid>
                </ValidatorForm>
                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(General)
