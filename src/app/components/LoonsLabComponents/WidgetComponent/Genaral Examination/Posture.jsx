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

class Posture extends Component {
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
                    question: "posture",
                    other_answers: {
                        posture: 'normal',
                        parkinsonismPosture: false,
                        decorticateRigidity: false,
                        derebrateRigidity: false,
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
            question: 'posture',
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
            console.log("Examination Data Posture", res.data.view.data)
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
                        {/* Posture */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Posture' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.posture} row>
                                <FormControlLabel
                                    label='Normal'
                                    name="normal"
                                    value="normal"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.posture = "normal"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />

                                <FormControlLabel
                                    label='Abnormal'
                                    name="abnormal"
                                    value="abnormal"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.posture = "abnormal"
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

                        { this.state.formData.examination_data[0].other_answers.posture == 'abnormal' ? 
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <FormControlLabel
                            // key={i}
                            label='Parkinsonism Posture'
                            name='parkinsonismPosture'
                            value='parkinsonismPosture'
                            onChange={() => {
                                let formData = this.state.formData;
                                formData.examination_data[0].other_answers.parkinsonismPosture = !formData.examination_data[0].other_answers.parkinsonismPosture
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
                            label='Decorticate Rigidity'
                            name='decorticateRigidity'
                            value='decorticateRigidity'
                            onChange={() => {
                                let formData = this.state.formData;
                                formData.examination_data[0].other_answers.decorticateRigidity = !formData.examination_data[0].other_answers.decorticateRigidity
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
                            label='Derebrate Rigidity'
                            name='derebrateRigidity'
                            value='derebrateRigidity'
                            onChange={() => {
                                let formData = this.state.formData;
                                formData.examination_data[0].other_answers.derebrateRigidity = !formData.examination_data[0].other_answers.derebrateRigidity
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

export default withStyles(styleSheet)(Posture)
