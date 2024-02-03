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

const radioData = [
    {
        label: 'No',
        value: 'no',
    },
    {
        label: 'Present',
        value: 'present',
    },
]

const subRadioData_L = [
    {
        label: 'Fine',
        value: 'fine_L',
    },
    {
        label: 'Coarse',
        value: 'coarse_L',
    },
]

const subRadioData_R = [
    {
        label: 'Fine',
        value: 'fine_R',
    },
    {
        label: 'Coarse',
        value: 'coarse_R',
    },
]

const clubbingCheckBox_L = [
    {
        label: 'Grade 1',
        value: 'grade_1_L',
    },
    {
        label: 'Grade 2',
        value: 'grade_2_L',
    },
    {
        label: 'Grade 3',
        value: 'grade_3_L',
    },
    {
        label: 'Grade 4',
        value: 'grade_4_L',
    },
]

const clubbingCheckBox_R = [
    {
        label: 'Grade 1',
        value: 'grade_1_R',
    },
    {
        label: 'Grade 2',
        value: 'grade_2_R',
    },
    {
        label: 'Grade 3',
        value: 'grade_3_R',
    },
    {
        label: 'Grade 4',
        value: 'grade_4_R',
    },
]

const checkBox_L = [
    {
        label: 'Koilonychia',
        value: 'koilonychia_L',
    },
    {
        label: 'Heberden Nodes',
        value: 'heberdenNodes_L',
    },
    {
        label: 'Splinter Hemorrhages',
        value: 'splinterHemorrhages_L',
    },
    {
        label: 'Palmar Erythema',
        value: 'palmarErythema_L',
    },
    {
        label: 'Dupuytrens Contracture',
        value: 'dupuytrensContracture_L',
    },
    {
        label: 'Deformities',
        value: 'deformities_L',
    },
    {
        label: 'Joint Swelling',
        value: 'jointSwelling_L',
    },
]

const checkBox_R = [
    {
        label: 'Koilonychia',
        value: 'koilonychia_R',
    },
    {
        label: 'Heberden Nodes',
        value: 'heberdenNodes_R',
    },
    {
        label: 'Splinter Hemorrhages',
        value: 'splinterHemorrhages_R',
    },
    {
        label: 'Palmar Erythema',
        value: 'palmarErythema_R',
    },
    {
        label: 'Dupuytrens Contracture',
        value: 'dupuytrensContracture_R',
    },
    {
        label: 'Deformities',
        value: 'deformities_R',
    },
    {
        label: 'Joint Swelling',
        value: 'jointSwelling_R',
    },
]

class Hands extends Component {
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
                    question: "hands",
                    other_answers: {
                        hands : 'normal',
                        grade_1_L: false,
                        grade_2_L: false,
                        grade_3_L: false,
                        grade_4_L: false,
                        grade_1_R: false,
                        grade_2_R: false,
                        grade_3_R: false,
                        grade_4_R: false,
                        koilonychia_L: false,
                        heberdenNodes_L: false,
                        splinterHemorrhages_L: false,
                        palmarErythema_L: false,
                        dupuytrensContracture_L: false,
                        deformities_L: false,
                        jointSwelling_L: false,
                        koilonychia_R: false,
                        heberdenNodes_R: false,
                        splinterHemorrhages_R: false,
                        palmarErythema_R: false,
                        dupuytrensContracture_R: false,
                        deformities_R: false,
                        jointSwelling_R: false,
                        clubbing_left: 'no',
                        clubbing_right: 'no',
                        tremors_left: 'no',
                        tremors_right: 'no',
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
            question: 'hands',
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
            console.log("Examination Data Hands", res.data.view.data)
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
                        {/* Hands */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Hands' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.hands} row>
                                <FormControlLabel
                                    label={"Normal"}
                                    name="normal"
                                    value="normal"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.hands = "normal"
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
                                        formData.examination_data[0].other_answers.hands = "abnormal"
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
                        { this.state.formData.examination_data[0].other_answers.hands == 'abnormal' ?
                            <Grid className='mt-2' item lg={12} md={12} sm={12} xs={12}>
                                <Grid container spacing={2}>
                                    {/* 1st Row */}
                                    <Grid className='mt-2' item lg={2} md={12} sm={12} xs={12}>
                                    </Grid>
                                    <Grid className='mt-2' item lg={5} md={12} sm={12} xs={12}>
                                        <Typography className="" variant="h6" style={{ fontSize: 14, }}>Left</Typography>
                                    </Grid>
                                    <Grid className='mt-2' item lg={5} md={12} sm={12} xs={12}>
                                        <Typography className="" variant="h6" style={{ fontSize: 14, }}>Right</Typography>
                                    </Grid>

                                    {/* 2nd Row */}
                                    <Grid className='mt-2' item lg={2} md={12} sm={12} xs={12}>
                                     <Typography className="" variant="h6" style={{ fontSize: 14, }}>Clubbing</Typography>
                                    </Grid>
                                    <Grid className='mt-2' item lg={5} md={12} sm={12} xs={12}>
                                        <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.clubbing_left} row>
                                            { radioData.map((data) => 
                                                <FormControlLabel
                                                    label={data.label}
                                                    name={data.value}
                                                    value={data.value}
                                                    onChange={() => {
                                                        let formData = this.state.formData;
                                                        formData.examination_data[0].other_answers.clubbing_left = data.value
                                                        this.setState({ formData })
                                                    }}
                                                    control={
                                                        <Radio size='small' color="primary" />
                                                    }
                                                    display="inline"
                                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                />
                                            )}
                                        </RadioGroup>
                                    </Grid>
                                    <Grid className='mt-2' item lg={5} md={12} sm={12} xs={12}>
                                        <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.clubbing_right} row>
                                            { radioData.map((data) => 
                                                <FormControlLabel
                                                    label={data.label}
                                                    name={data.value}
                                                    value={data.value}
                                                    onChange={() => {
                                                        let formData = this.state.formData;
                                                        formData.examination_data[0].other_answers.clubbing_right = data.value
                                                        this.setState({ formData })
                                                    }}
                                                    control={
                                                        <Radio size='small' color="primary" />
                                                    }
                                                    display="inline"
                                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                />
                                            )}
                                        </RadioGroup>
                                    </Grid>

                                    {/* 3rd Row */}
                                    <Grid className='mt-2' item lg={2} md={12} sm={12} xs={12}>
                                         {/* <Typography className="" variant="h6" style={{ fontSize: 14, }}>Clubbing</Typography> */}
                                    </Grid>
                                    <Grid className='mt-2' item lg={5} md={12} sm={12} xs={12}>
                                        { this.state.formData.examination_data[0].other_answers.clubbing_left == 'present' ?
                                            <Grid className='mt-2' item lg={12} md={12} sm={12} xs={12}>
                                                { clubbingCheckBox_L.map((data) =>  
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
                                    </Grid>
                                    <Grid className='mt-2' item lg={5} md={12} sm={12} xs={12}>
                                        { this.state.formData.examination_data[0].other_answers.clubbing_right == 'present' ?
                                            <Grid className='mt-2' item lg={12} md={12} sm={12} xs={12}>
                                                { clubbingCheckBox_R.map((data) =>  
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
                                    </Grid>

                                    {/* 4th Row */}
                                    <Grid className='mt-2' item lg={2} md={12} sm={12} xs={12}>
                                         {/* <Typography className="" variant="h6" style={{ fontSize: 14, }}>Clubbing</Typography> */}
                                    </Grid>
                                    <Grid className='mt-2' item lg={5} md={12} sm={12} xs={12}>
                                            <Grid className='mt-2' item lg={12} md={12} sm={12} xs={12}>
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
                                    </Grid>
                                    <Grid className='mt-2' item lg={5} md={12} sm={12} xs={12}>
                                            <Grid className='mt-2' item lg={12} md={12} sm={12} xs={12}>
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

                                    {/* 5th Row */}
                                    <Grid className='mt-2' item lg={2} md={12} sm={12} xs={12}>
                                     <Typography className="" variant="h6" style={{ fontSize: 14, }}>Tremors</Typography>
                                    </Grid>
                                    <Grid className='mt-2' item lg={5} md={12} sm={12} xs={12}>
                                        <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.tremors_left} row>
                                            { radioData.map((data) => 
                                                <FormControlLabel
                                                    label={data.label}
                                                    name={data.value}
                                                    value={data.value}
                                                    onChange={() => {
                                                        let formData = this.state.formData;
                                                        formData.examination_data[0].other_answers.tremors_left = data.value
                                                        this.setState({ formData })
                                                    }}
                                                    control={
                                                        <Radio size='small' color="primary" />
                                                    }
                                                    display="inline"
                                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                />
                                            )}
                                        </RadioGroup>
                                    </Grid>
                                    <Grid className='mt-2' item lg={5} md={12} sm={12} xs={12}>
                                        <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.tremors_right} row>
                                            { radioData.map((data) => 
                                                <FormControlLabel
                                                    label={data.label}
                                                    name={data.value}
                                                    value={data.value}
                                                    onChange={() => {
                                                        let formData = this.state.formData;
                                                        formData.examination_data[0].other_answers.tremors_right = data.value
                                                        this.setState({ formData })
                                                    }}
                                                    control={
                                                        <Radio size='small' color="primary" />
                                                    }
                                                    display="inline"
                                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                />
                                            )}
                                        </RadioGroup>
                                    </Grid>

                                    {/* 6th Row */}
                                    <Grid className='mt-2' item lg={2} md={12} sm={12} xs={12}>
                                        {/* <Typography className="" variant="h6" style={{ fontSize: 14, }}>Tremors</Typography> */}
                                    </Grid>
                                    <Grid className='mt-2' item lg={5} md={12} sm={12} xs={12}>
                                    { this.state.formData.examination_data[0].other_answers.tremors_left == 'present' ?
                                        <Grid className='mt-2' item lg={12} md={12} sm={12} xs={12}>
                                            <RadioGroup row>
                                                { subRadioData_L.map((data) => 
                                                    <FormControlLabel
                                                        label={data.label}
                                                        name={data.value}
                                                        value={data.value}
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.tremors_sub_left = data.value
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                )}
                                            </RadioGroup>
                                        </Grid>
                                        : null
                                    }
                                    </Grid>

                                    <Grid className='mt-2' item lg={5} md={12} sm={12} xs={12}>
                                    { this.state.formData.examination_data[0].other_answers.tremors_right == 'present' ?
                                        <Grid className='mt-2' item lg={12} md={12} sm={12} xs={12}>
                                            <RadioGroup row>
                                                { subRadioData_R.map((data) => 
                                                    <FormControlLabel
                                                        label={data.label}
                                                        name={data.value}
                                                        value={data.value}
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.tremors_sub_right = data.value
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                )}
                                            </RadioGroup>
                                        </Grid>
                                        : null
                                    }
                                    </Grid>   
                                </Grid>
                            </Grid>
                            : null
                        }
                        <Grid className='flex justify-start' item lg={12} md={12} sm={12} xs={12}>
                            <Button
                                progress={false} type="submit" startIcon="save"
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

export default withStyles(styleSheet)(Hands)
