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
import VisibilityIcon from '@material-ui/icons/Visibility'
import EditIcon from '@material-ui/icons/Edit'
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
} from 'app/components/LoonsLabComponents'
// import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import { dateParse } from 'utils'
import PropTypes from 'prop-types'

import ExaminationServices from 'app/services/ExaminationServices'
import { Autocomplete } from '@material-ui/lab'

const styleSheet = (theme) => ({})

const initial_form_data = {
    name: '',
    description: '',
}

const dialogBox_faculty_data = {
    id: '',
    name: '',
    description: '',
}

class DigitalRenalRectalExamination extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: 'Complications is added Successfull',
            severity: 'success',
            data: [],
            digital_rectal: false,

            formData: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",
                patient_id: window.dashboardVariables.patient_clinic_id,
                widget_id: this.props.widget_id,
                examination_data: [
                    {
                        widget_input_id: this.props.itemId,
                        question: 'digital_rectal_examination',
                        other_answers: {
                            digital_renal_rectal_examination: 'no',
                            sphincter: 'normal',
                            prostate: 'normal',
                            abnormal_masses: 'no',
                            position: null,
                            size: null,
                            haemorrhoids: 'no',
                            papillae: 'no',
                            contact_bleeding: 'no',
                            comment: null,
                        },
                    },
                ],
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
            question: 'digital_rectal_examination',
            'order[0]': ['createdAt', 'DESC'],
            limit: 10,
        }

        let res;
        if (this.props.loadFromCloud) {

            res = await ExaminationServices.getDataFromCloud(params)
        } else {

            res = await ExaminationServices.getData(params)
        }
        //console.log("Examination Data ", res)
        if (200 == res.status) {
            console.log('Examination Data Inspection', res.data.view.data)
            this.setState({ data: [] })
            let data = []
            let other_answers = []

            res.data.view.data.forEach((element) => {
                data.push(element.other_answers)
            })
            this.setState({ data: data, loaded: true })
        }
    }

    async submit() {
        console.log('formdata', this.state.formData)
        let formData = this.state.formData

        let res = await ExaminationServices.saveData(formData)
        console.log('Examination Data added', res)
        if (201 == res.status) {
            this.setState(
                {
                    alert: true,
                    message: 'Examination Data Added Successful',
                    severity: 'success',
                },
                () => {
                    this.loadData()
                    //this.onReload()
                }
            )
        }
    }

    async onReload() {
        const { onReload } = this.props

        onReload && onReload()
    }

    //set input value changes
    componentDidMount() {
        console.log('item id', this.props.itemId)
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
                <ValidatorForm
                    onSubmit={() => {
                        this.submit()
                    }}
                    className="flex mx-2 mt-1"
                >
                    <Grid container spacing={2}>
                        {/* Digital Renal Rectal Examination   */}
                        <Grid className="" item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="Digital Rectal Examination" />
                            <RadioGroup
                                defaultValue={
                                    this.state.formData.examination_data[0]
                                        .other_answers
                                        .digital_renal_rectal_examination
                                }
                                row
                            >
                                <FormControlLabel
                                    label={'No'}
                                    name="no"
                                    value="no"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.digital_renal_rectal_examination =
                                            'no'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label={'Yes'}
                                    name="yes"
                                    value="yes"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.digital_renal_rectal_examination =
                                            'moderate'
                                        this.setState({
                                            digital_rectal: true,
                                            formData,
                                        })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                            </RadioGroup>
                        </Grid>
                        {this.state.digital_rectal ? (
                            <div>
                                <Grid
                                    className=""
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Sphincter" />
                                    <RadioGroup
                                        defaultValue={
                                            this.state.formData
                                                .examination_data[0]
                                                .other_answers.sphincter
                                        }
                                        row
                                    >
                                        <FormControlLabel
                                            label={'Normal'}
                                            name="normal"
                                            value="normal"
                                            size="small"
                                            onChange={() => {
                                                let formData =
                                                    this.state.formData
                                                formData.examination_data[0].other_answers.sphincter =
                                                    'no'
                                                this.setState({ formData })
                                            }}
                                            control={<Radio color="primary" />}
                                            display="inline"
                                            // checked={
                                            //     !this.state.formData.examination_data[0].other_answers.probable
                                            // }
                                        />
                                        <FormControlLabel
                                            label={'Lax'}
                                            name="lax"
                                            value="lax"
                                            size="small"
                                            onChange={() => {
                                                let formData =
                                                    this.state.formData
                                                formData.examination_data[0].other_answers.sphincter =
                                                    'lax'
                                                this.setState({ formData })
                                            }}
                                            control={<Radio color="primary" />}
                                            display="inline"
                                            // checked={this.state.formData.examination_data[0].other_answers.probable}
                                        />
                                    </RadioGroup>
                                </Grid>
                                <Grid
                                    className=""
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Prostate" />
                                    <RadioGroup
                                        defaultValue={
                                            this.state.formData
                                                .examination_data[0]
                                                .other_answers.prostate
                                        }
                                        row
                                    >
                                        <FormControlLabel
                                            label={'Normal'}
                                            name="normal"
                                            value="normal"
                                            size="small"
                                            onChange={() => {
                                                let formData =
                                                    this.state.formData
                                                formData.examination_data[0].other_answers.prostate =
                                                    'normal'
                                                this.setState({ formData })
                                            }}
                                            control={<Radio color="primary" />}
                                            display="inline"
                                            // checked={
                                            //     !this.state.formData.examination_data[0].other_answers.probable
                                            // }
                                        />
                                        <FormControlLabel
                                            label={'Enlarged'}
                                            name="enlarged"
                                            value="enlarged"
                                            size="small"
                                            onChange={() => {
                                                let formData =
                                                    this.state.formData
                                                formData.examination_data[0].other_answers.prostate =
                                                    'enlarged'
                                                this.setState({ formData })
                                            }}
                                            control={<Radio color="primary" />}
                                            display="inline"
                                            // checked={this.state.formData.examination_data[0].other_answers.probable}
                                        />
                                        <FormControlLabel
                                            label={'Hard Prostatomegaly'}
                                            name="hard_prostatomegaly"
                                            value="hard_prostatomegaly"
                                            size="small"
                                            onChange={() => {
                                                let formData =
                                                    this.state.formData
                                                formData.examination_data[0].other_answers.prostate =
                                                    'hard_prostatomegaly'
                                                this.setState({ formData })
                                            }}
                                            control={<Radio color="primary" />}
                                            display="inline"
                                            // checked={
                                            //     !this.state.formData.examination_data[0].other_answers.probable
                                            // }
                                        />
                                        <FormControlLabel
                                            label={'Nodular Prostate'}
                                            name="nodular_prostate"
                                            value="nodular_prostate"
                                            size="small"
                                            onChange={() => {
                                                let formData =
                                                    this.state.formData
                                                formData.examination_data[0].other_answers.prostate =
                                                    'nodular_prostate'
                                                this.setState({ formData })
                                            }}
                                            control={<Radio color="primary" />}
                                            display="inline"
                                            // checked={this.state.formData.examination_data[0].other_answers.probable}
                                        />
                                    </RadioGroup>
                                </Grid>
                            </div>
                        ) : null}
                        <Grid className="" item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="Abnormal Masses" />
                            <RadioGroup
                                defaultValue={
                                    this.state.formData.examination_data[0]
                                        .other_answers.abnormal_masses
                                }
                                row
                            >
                                <FormControlLabel
                                    label={'No'}
                                    name="no"
                                    value="no"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.abnormal_masses =
                                            'no'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                                <FormControlLabel
                                    label={'Yes'}
                                    name="yes"
                                    value="yes"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.abnormal_masses =
                                            'yes'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>
                        </Grid>

                        <Grid className="" item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="Position" />
                            <RadioGroup
                                defaultValue={
                                    this.state.formData.examination_data[0]
                                        .other_answers.position
                                }
                                row
                            >
                                <FormControlLabel
                                    label={"3 o'clock"}
                                    name="3_o_clock"
                                    value="3_o_clock"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.position =
                                            '3_o_clock'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                                <FormControlLabel
                                    label={"6 o'clock"}
                                    name="6_o_clock"
                                    value="6_o_clock"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.position =
                                            '6_o_clock'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label={"9 o'clock"}
                                    name="9_o_clock"
                                    value="9_o_clock"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.position =
                                            '9_o_clock'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                                <FormControlLabel
                                    label={"12 o'clock"}
                                    name="12_o_clock"
                                    value="12_o_clock"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.prostate =
                                            'nodular_prostate'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid className="" item lg={8} md={6} sm={6} xs={6}>
                            <SubTitle title="Size" />
                            <TextValidator
                                placeholder=""
                                //variant="outlined"
                                fullWidth
                                variant="outlined"
                                size="small"
                                type="number"
                                onChange={(e) => {
                                    let formData = this.state.formData
                                    formData.examination_data[0].other_answers.size =
                                        e.target.value
                                    this.setState({ formData })
                                }}
                                value={
                                    this.state.formData.examination_data[0]
                                        .other_answers.size
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <p className="px-2">| cm * cm</p>
                                        </InputAdornment>
                                    ),
                                }}
                                validators={['required', 'maxNumber:' + 300]}
                                errorMessages={[
                                    'this field is required',
                                    'please enter a valid size',
                                ]}
                            />
                        </Grid>
                        <Grid className="" item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="Haemorrhoids" />
                            <RadioGroup
                                defaultValue={
                                    this.state.formData.examination_data[0]
                                        .other_answers.haemorrhoids
                                }
                                row
                            >
                                <FormControlLabel
                                    label={'No'}
                                    name="no"
                                    value="no"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.haemorrhoids =
                                            'no'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                                <FormControlLabel
                                    label={'Yes'}
                                    name="yes"
                                    value="yes"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.abnormal_masses =
                                            'yes'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid className="" item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="Papillae" />
                            <RadioGroup
                                defaultValue={
                                    this.state.formData.examination_data[0]
                                        .other_answers.papillae
                                }
                                row
                            >
                                <FormControlLabel
                                    label={'No'}
                                    name="no"
                                    value="no"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.papillae =
                                            'no'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                                <FormControlLabel
                                    label={'Yes'}
                                    name="yes"
                                    value="yes"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.papillae =
                                            'yes'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid className="" item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="Contact Bleeding" />
                            <RadioGroup
                                defaultValue={
                                    this.state.formData.examination_data[0]
                                        .other_answers.contact_bleeding
                                }
                                row
                            >
                                <FormControlLabel
                                    label={'No'}
                                    name="no"
                                    value="no"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.contact_bleeding =
                                            'no'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                                <FormControlLabel
                                    label={'Yes'}
                                    name="yes"
                                    value="yes"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.contact_bleeding =
                                            'yes'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid
                            className="flex justify-start"
                            item
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                        >
                            <TextValidator
                                placeholder="Commments"
                                //variant="outlined"
                                fullWidth
                                variant="outlined"
                                size="small"
                                type="text"
                                onChange={(e) => {
                                    let formData = this.state.formData
                                    formData.examination_data[0].other_answers.comment =
                                        e.target.value

                                    this.setState({
                                        formData,
                                    })
                                }}
                                value={
                                    this.state.formData.examination_data[0]
                                        .other_answers.comment
                                }
                            />
                        </Grid>
                        {/* save */}
                        <Grid
                            className="flex justify-start"
                            item
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                        >
                            <Button
                                className="mt-1"
                                progress={false}
                                type="submit"
                                startIcon="save"
                            >
                                <span className="capitalize">Save</span>
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

export default withStyles(styleSheet)(DigitalRenalRectalExamination)
