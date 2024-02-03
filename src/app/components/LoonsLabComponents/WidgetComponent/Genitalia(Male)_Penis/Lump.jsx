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

const data = [
    {
        label: 'Balanitis Xerotica Obliterans (BXO)',
        value: 'balanitisXeroticaObliterans',
    },
    {
        label: 'Recurrent Balanitis',
        value: 'recurrentBalanitis',
    },
    {
        label: 'Discomfort with Erection',
        value: 'discomfortWithErection',
    },
]

class Lump extends Component {
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
                    question: "lump",
                    other_answers: {
                        lump: 'no',
                        sizeW: null,
                        sizeH: null,
                        pain: 'no',
                        discharge: 'no',
                        deformity: 'no',
                        consistance: null,
                        retation: null,
                        lymphadenophathy: 'no',
                        photo: null,
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
            question: 'lump',
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
            console.log("Examination Data Lump", res.data.view.data)
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

                        {/* Lump */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Lump' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.lump} row>
                                <FormControlLabel
                                    label={"No"}
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.lump = "no"
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
                                        formData.examination_data[0].other_answers.lump = "present"
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

                        { this.state.formData.examination_data[0].other_answers.lump == 'present' ?
                            <Grid className='' item lg={6} md={6} sm={6} xs={6}>
                            {/* <SubTitle title='' /> */}
                            <TextValidator                                
                                placeholder="Size"
                                //variant="outlined"
                                fullWidth
                                variant="outlined"
                                size="small"
                                type = 'number'
                                onChange={(e) => {
                                    let formData = this.state.formData
                                        formData.examination_data[0].other_answers.sizeW = e.target.value
                                        this.setState(
                                            {
                                                formData 
                                            }
                                        )
                                }}
                                value={
                                    this.state.formData.examination_data[0].other_answers.sizeW
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <p className='px-2'>| cm *</p>
                                        </InputAdornment>
                                    )
                                }}
                                validators={[
                                    'required',
                                    // 'maxNumber:' + 300,
                                ]}
                                errorMessages={[
                                    'this field is required',
                                    // 'please enter a valid weight',
                                ]}                              
                            />  
                            </Grid>
                        : null
                        }

                        { this.state.formData.examination_data[0].other_answers.lump == 'present' ?
                            <Grid className='' item lg={6} md={6} sm={6} xs={6}>
                            <TextValidator                                
                                placeholder=""
                                //variant="outlined"
                                fullWidth
                                variant="outlined"
                                size="small"
                                type = 'number'
                                onChange={(e) => {
                                    let formData = this.state.formData
                                        formData.examination_data[0].other_answers.sizeH = e.target.value
                                        this.setState(
                                            {
                                                formData 
                                            }
                                        )
                                }}
                                value={
                                    this.state.formData.examination_data[0].other_answers.sizeH
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <p className='px-2'>| cm</p>
                                        </InputAdornment>
                                    )
                                }}
                                validators={[
                                    'required',
                                    // 'maxNumber:' + 300,
                                ]}
                                errorMessages={[
                                    'this field is required',
                                    // 'please enter a valid weight',
                                ]}                              
                            />  
                        </Grid>
                        : null
                        }
                        
                        {/* Pain */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Pain' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.pain} row>
                                <FormControlLabel
                                    label={"No"}
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.pain = "no"
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
                                        formData.examination_data[0].other_answers.pain = "yes"
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

                        {/* Discharge */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Discharge' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.discharge} row>
                                <FormControlLabel
                                    label={"No"}
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.discharge = "no"
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
                                        formData.examination_data[0].other_answers.discharge = "yes"
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

                        {/* Deformity */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Deformity' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.deformity} row>
                                <FormControlLabel
                                    label={"No"}
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.deformity = "no"
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
                                        formData.examination_data[0].other_answers.deformity = "yes"
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

                        {/* Consistence */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Consistence' />
                            <RadioGroup row>
                                <FormControlLabel
                                    label={"Soft"}
                                    name="soft"
                                    value="soft"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.consistance = "soft"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />

                                <FormControlLabel
                                    label={"Firm"}
                                    name="firm"
                                    value="firm"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.consistance = "firm"
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
                                    label={"Hard"}
                                    name="hard"
                                    value="hard"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.consistance = "hard"
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

                        {/* Retation */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Retation' />
                            <RadioGroup row>
                                <FormControlLabel
                                    label={"Confined to Skin"}
                                    name="confinedToSkin"
                                    value="confinedToSkin"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.retation = "confinedToSkin"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />

                                <FormControlLabel
                                    label={"Invaded"}
                                    name="invaded"
                                    value="invaded"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.retation = "invaded"
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

                        {/* Lymphadenophathy */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Lymphadenophathy' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.lymphadenophathy} row>
                                <FormControlLabel
                                    label={"No"}
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.lymphadenophathy = "no"
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
                                        formData.examination_data[0].other_answers.lymphadenophathy = "yes"
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

                        {/* Upload Photo */}
                        <Grid className='' item lg={12} md={6} sm={6} xs={6}>
                            <SubTitle title='Upload Photo' />
                            <TextValidator                                
                                placeholder=""
                                //variant="outlined"
                                fullWidth
                                variant="outlined"
                                size="small"
                                type = 'file'
                                onChange={(e) => {
                                    let formData = this.state.formData
                                        formData.examination_data[0].other_answers.photo = e.target.value
                                        this.setState(
                                            {
                                                formData 
                                            }
                                        )
                                }}
                                value={
                                    this.state.formData.examination_data[0].other_answers.photo
                                }                              
                            />  
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

export default withStyles(styleSheet)(Lump)
