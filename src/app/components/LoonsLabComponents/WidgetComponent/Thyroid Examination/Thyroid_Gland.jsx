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

const checkBox_L = [
    {
        label: 'Cervical',
        value: 'cervical_L',
    },
    {
        label: 'Submandibular',
        value: 'submandibular_L',
    },
    {
        label: 'Axillary',
        value: 'axillary_L',
    },
    {
        label: 'Distal',
        value: 'distal_L',
    },
]

const checkBox_R = [
    {
        label: 'Cervical',
        value: 'cervical_R',
    },
    {
        label: 'Submandibular',
        value: 'submandibular_R',
    },
    {
        label: 'Axillary',
        value: 'axillary_R',
    },
    {
        label: 'Distal',
        value: 'distal_R',
    },
]

class Thyroid_Gland extends Component {
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
                    question: "thyroid_Gland",
                    other_answers: {
                        size: 'normal',
                        symmetry: 'symmetry',
                        consistency: 'firm',
                        thyroid_masses: 'no',
                        rightLobe: false,
                        leftLobe: false,
                        retrosternal: 'no',
                        thyroid_bruit: 'no',
                        thyroglossal_cyst: 'no',
                        lymphademopathy: 'no',
                        lymphademopathy_left: null,
                        lymphademopathy_right: null,
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
            question: 'thyroid_Gland',
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
            console.log("Examination Data Thyroid_Gland", res.data.view.data)
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
                        {/* Size */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Size' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.size} row>
                                <FormControlLabel
                                    label='Normal'
                                    name="normal"
                                    value="normal"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.size = "normal"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label='Enlarged'
                                    name="enlarged"
                                    value="enlarged"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.size = "enlarged"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>  
                        </Grid>

                        {/* Symmetry */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Symmetry' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.symmetry} row>
                                <FormControlLabel
                                    label='Symmetric'
                                    name="symmetric"
                                    value="symmetric"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.symmetry = "symmetric"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label='Asymmetric'
                                    name="asymmetric"
                                    value="asymmetric"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.symmetry = "asymmetric"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>  
                        </Grid>

                         {/* Consistency */}
                         <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Consistency' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.consistency} row>
                                <FormControlLabel
                                    label='Firm'
                                    name="firm"
                                    value="firm"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.consistency = "firm"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label='Soft'
                                    name="soft"
                                    value="soft"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.consistency = "soft"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label='Hard'
                                    name="hard"
                                    value="hard"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.consistency = "hard"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>  
                        </Grid>

                        {/* Thyroid Masses */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Thyroid Masses' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.thyroid_masses} row>
                                <FormControlLabel
                                    label='No'
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.thyroid_masses = "no"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label='Present'
                                    name="present"
                                    value="present"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.thyroid_masses = "present"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>  
                        </Grid>

                        {/* If clicked on present */}
                        { this.state.formData.examination_data[0].other_answers.thyroid_masses == 'present' ?
                            <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            {/* <SubTitle title='Thyroid Masses' /> */}
                            <FormControlLabel
                                                    // key={i}
                                                    label='Right Lobe'
                                                    name='rightLobe'
                                                    value='rightLobe'
                                                    onChange={() => {
                                                        let formData = this.state.formData;
                                                        formData.examination_data[0].other_answers.rightLobe = !formData.examination_data[0].other_answers.rightLobe
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
                                                    label='Left Lobe'
                                                    name='leftLobe'
                                                    value='leftLobe'
                                                    onChange={() => {
                                                        let formData = this.state.formData;
                                                        formData.examination_data[0].other_answers.leftLobe = !formData.examination_data[0].other_answers.leftLobe
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

                        {/* Retrosternal Extension */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Retrosternal Extension' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.retrosternal} row>
                                <FormControlLabel
                                    label='No'
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.retrosternal = "no"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label='Yes'
                                    name="yes"
                                    value="yes"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.retrosternal = "yes"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>  
                        </Grid>

                        {/* Thyroid Bruit */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Thyroid Bruit' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.thyroid_bruit} row>
                                <FormControlLabel
                                    label='No'
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.thyroid_bruit = "no"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label='Yes'
                                    name="yes"
                                    value="yes"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.thyroid_bruit = "yes"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>  
                        </Grid>

                        {/* Thyroglossal Cyst */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Thyroglossal Cyst' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.thyroglossal_cyst} row>
                                <FormControlLabel
                                    label='No'
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.thyroglossal_cyst = "no"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label='Yes'
                                    name="yes"
                                    value="yes"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.thyroglossal_cyst = "yes"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>  
                        </Grid>

                        {/* Lymphadenopathy */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Lymphadenopathy' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.lymphademopathy} row>
                                <FormControlLabel
                                    label='No'
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.lymphademopathy = "no"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label='Present'
                                    name="present"
                                    value="present"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.lymphademopathy = "present"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>  
                        </Grid>

                        {/* If clicked on present */}
                        { this.state.formData.examination_data[0].other_answers.lymphademopathy == 'present' ?
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <Grid container spacing={2}>
                                {/* 1st Row */}
                                <Grid className='' item lg={6} md={12} sm={12} xs={12}>
                                     <Typography className="" variant="h6" style={{ fontSize: 14, }}>Left</Typography>
                                </Grid>
                                <Grid className='' item lg={6} md={12} sm={12} xs={12}>
                                     <Typography className="mr-4" variant="h6" style={{ fontSize: 14, }}>Right</Typography>
                                </Grid>

                                {/* 2nd Row */}
                                <Grid className='' item lg={6} md={12} sm={12} xs={12}>
                                    { checkBox_L.map((data) =>  
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
                                <Grid className='' item lg={6} md={12} sm={12} xs={12}>
                                    { checkBox_R.map((data) =>  
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
                            </Grid>
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

export default withStyles(styleSheet)(Thyroid_Gland)
