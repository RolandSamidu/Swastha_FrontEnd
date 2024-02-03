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

const discharge = [
    {
        label: 'No',
        name: 'no',
    },
    {
        label: 'Serous',
        name: 'serous',
    },
    {
        label: 'Sanguineous',
        name: 'sanguineous',
    },
    {
        label: 'Serosanguinous',
        name: 'serosanguinous',
    },
    {
        label: 'Purulent',
        name: 'purulent',
    },
]

const baseData = [
    {
        label: 'Slough',
        name: 'slough',
    },
    {
        label: 'Dead Granulation Tissue',
        name: 'deadGranulationTissue',
    },
    {
        label: 'Red Granulation Tissue',
        name: 'redGranulationTissue',
    },
    {
        label: 'Bluish Granulation Tissue',
        name: 'bluishGranulationTissue',
    },
]

const edgeData = [
    {
        label: 'Sloping',
        name: 'sloping',
    },
    {
        label: 'Punched Out',
        name: 'punchedOut',
    },
    {
        label: 'Undermined',
        name: 'undermined',
    },
    {
        label: 'Rolled',
        name: 'rolled',
    },
    {
        label: 'Everted',
        name: 'everted',
    },
]


const lymphadenopathyData = [
    {
        label: 'No',
        name: 'no',
    },
    {
        label: 'Yes',
        name: 'yes',
    },
]


const inflammationData = [
    {
        label: 'Yes',
        name: 'yes',
    },
    {
        label: 'No',
        name: 'no',
    },
]

const tendernessData = [
    {
        label: 'No',
        name: 'no',
    },
    {
        label: 'Yes',
        name: 'yes',
    },
]

class Ulcer_Scrotum extends Component {
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
                    question: "ulcer_Scrotum",
                    other_answers: {
                        sizeW: null,
                        sizeH: null,
                        depth: null,
                        no: false,
                        serous: false,
                        sanguineous: false,
                        serosanguinous: false,
                        purulent: false,
                        tenderness: 'no',
                        base: null,
                        edge: null,
                        lymphadenopathy: 'no',
                        inflammation: null,
                        note: null,
                        photo: null,
                        localTissue: null,
                        relations: null,
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
            question: 'ulcer_Scrotum',
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
            console.log("Examination Data Ulcer_Scrotum", res.data.view.data)
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
                    <Grid className='' item lg={12} md={6} sm={6} xs={6}>
                        <SubTitle title='Site' />
                    </Grid>
                    <Grid className='' item lg={6} md={6} sm={6} xs={6}>
                            {/* <SubTitle title='Size' /> */}
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
                    <Grid className='' item lg={6} md={6} sm={6} xs={6}>
                            {/* <SubTitle title='Shape' /> */}
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
                    <Grid className='' item lg={6} md={6} sm={6} xs={6}>
                            {/* <SubTitle title='Depth' /> */}
                            <TextValidator                                
                                placeholder="Depth"
                                //variant="outlined"
                                fullWidth
                                variant="outlined"
                                size="small"
                                type = 'number'
                                onChange={(e) => {
                                    let formData = this.state.formData
                                        formData.examination_data[0].other_answers.depth = e.target.value
                                        this.setState(
                                            {
                                                formData 
                                            }
                                        )
                                }}
                                value={
                                    this.state.formData.examination_data[0].other_answers.shape
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <p className='px-2'>| mm</p>
                                        </InputAdornment>
                                    )
                                }}
                                validators={[
                                    // 'required',
                                    // 'maxNumber:' + 300,
                                ]}
                                errorMessages={[
                                    // 'this field is required',
                                    // 'please enter a valid weight',
                                ]}                              
                            />  
                    </Grid>

                    {/* Base */}
                    <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Base' />
                            <RadioGroup row>
                                { baseData.map((data) => 
                                    <FormControlLabel
                                    label={data.label}
                                    name={data.name}
                                    value={data.name}
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.base = data.name
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                ) }
                            </RadioGroup>  
                    </Grid>

                    {/* Edge */}
                    <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Edge' />
                            <RadioGroup row>
                                { edgeData.map((data) => 
                                    <FormControlLabel
                                    label={data.label}
                                    name={data.name}
                                    value={data.name}
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.edge = data.name
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                ) }
                            </RadioGroup>  
                    </Grid>

                     {/* Discharge */}
                     <Grid className='' item lg={12} md={6} sm={6} xs={6}>
                        <SubTitle title='Discharge' />
                        { discharge.map((data) =>  
                                <FormControlLabel
                                // key={i}
                                label={data.label}
                                name={data.name}
                                value={data.name}
                                onChange={() => {
                                    let formData = this.state.formData;
                                    formData.examination_data[0].other_answers[data.name] = !formData.examination_data[0].other_answers[data.name]
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

                    {/* Tenderness */}
                    <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Tenderness' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.tenderness} row>
                                { tendernessData.map((data) => 
                                    <FormControlLabel
                                    label={data.label}
                                    name={data.name}
                                    value={data.name}
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.tenderness = data.name
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                ) }
                            </RadioGroup>  
                    </Grid>

                    {/* Signs of Inflammation */}
                    <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Signs of Inflammation' />
                            <RadioGroup row>
                                { inflammationData.map((data) => 
                                    <FormControlLabel
                                    label={data.label}
                                    name={data.name}
                                    value={data.name}
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.inflammation = data.name
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                ) }
                            </RadioGroup>  
                    </Grid>

                    {/* Local Tissue */}
                    <Grid className='' item lg={6} md={6} sm={6} xs={6}>
                            {/* <SubTitle title='Local Tissue' /> */}
                            <TextValidator                                
                                placeholder="Local Tissue"
                                //variant="outlined"
                                fullWidth
                                variant="outlined"
                                size="small"
                                type = 'text'
                                onChange={(e) => {
                                    let formData = this.state.formData
                                        formData.examination_data[0].other_answers.localTissue = e.target.value
                                        this.setState(
                                            {
                                                formData 
                                            }
                                        )
                                }}
                                value={
                                    this.state.formData.examination_data[0].other_answers.localTissue
                                }
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

                    {/* Relations */}
                    <Grid className='' item lg={6} md={6} sm={6} xs={6}>
                            {/* <SubTitle title='Relations' /> */}
                            <TextValidator                                
                                placeholder="Relations"
                                //variant="outlined"
                                fullWidth
                                variant="outlined"
                                size="small"
                                type = 'text'
                                onChange={(e) => {
                                    let formData = this.state.formData
                                        formData.examination_data[0].other_answers.relations = e.target.value
                                        this.setState(
                                            {
                                                formData 
                                            }
                                        )
                                }}
                                value={
                                    this.state.formData.examination_data[0].other_answers.relations
                                }
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
                           
                    {/*Lymphadenopathy */}
                    <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Lymphadenopathy' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.tenderness} row>
                                { lymphadenopathyData.map((data) => 
                                    <FormControlLabel
                                    label={data.label}
                                    name={data.name}
                                    value={data.name}
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.lymphadenopathy = data.name
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                ) }
                            </RadioGroup>  
                    </Grid>

                    {/* Note */}
                    <Grid className='' item lg={12} md={6} sm={6} xs={6}>
                            {/* <SubTitle title='Note' /> */}
                            <TextField
                                            variant='outlined'
                                            placeholder="Note"
                                            className='w-full'
                                            onChange={(e) => {
                                                let formData = this.state.formData
                                                    formData.examination_data[0].other_answers.note = e.target.value
                                                    this.setState(
                                                        {
                                                            formData
                                                        }
                                                    )
                                            }}
                                            multiline
                                            rows={2}
                                            // maxRows={4}
                                        />    
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

export default withStyles(styleSheet)(Ulcer_Scrotum)
