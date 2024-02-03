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
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'


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

const data = [
    {
        label: 'Indirect Inguinal Hernia',
        value: 'indirectInguinalHernia',
    },
    {
        label: 'Direct Inguinal Hernia',
        value: 'directInguinalHernia',
    },
    {
        label: 'Incisional Hernia',
        value: 'incisionalHernia',
    },
    {
        label: 'Epigastric Hernia',
        value: 'epigastricHernia',
    },
    {
        label: 'Femoral Hernia',
        value: 'femoralHernia',
    },
    {
        label: 'Umbilical Hernia',
        value: 'umbilicalHernia',
    },
]

class Genitalia_Hernia extends Component {
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
                    question: "genitalia_Hernia",
                    other_answers: {
                        indirectInguinalHernia: false,
                        directInguinalHernia: false,
                        incisionalHernia: false,
                        epigastricHernia: false,
                        femoralHernia: false,
                        umbilicalHernia: false,
                        obstructed: 'no',
                        tenderness: 'no',
                        reducible: 'normal',
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
            question: 'genitalia_Hernia',
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
            console.log("Examination Data Genitalia_Hernia", res.data.view.data)
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
                        {/* Type */}
                            <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                                <SubTitle title='Type' />
                                { data.map((data) =>  
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

                        {/* Obstructed */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Obstructed' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.obstructed} row>
                                <FormControlLabel
                                    label={"No"}
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.obstructed = "no"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />

                                <FormControlLabel
                                    label={"Yes"}
                                    name="yes"
                                    value="yes"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.obstructed = "yes"
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

                        {/* Tenderness */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Tenderness' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.tenderness} row>
                                <FormControlLabel
                                    label={"No"}
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.tenderness = "no"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />

                                <FormControlLabel
                                    label={"Yes"}
                                    name="yes"
                                    value="yes"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.tenderness = "yes"
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

                        {/* Reducible */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Reducible' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.reducible} row>
                                <FormControlLabel
                                    label={"Normal"}
                                    name="normal"
                                    value="normal"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.reducible = "normal"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />

                                <FormControlLabel
                                    label={"Not Reducible"}
                                    name="notReducible"
                                    value="notReducible"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.reducible = "notReducible"
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

export default withStyles(styleSheet)(Genitalia_Hernia)
