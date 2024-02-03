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

class Development extends Component {
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
                    question: "development",
                    other_answers: {
                    }
                }

                ]
            },

            columns: [
                {
                    name: 'age', // field name in the row object
                    label: 'Age', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    }
                },
                {
                    name: 'grossMotor',
                    label: 'Gross Motor',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'fineMotor', // field name in the row object
                    label: 'Fine Motor', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    }
                },
                {
                    name: 'speech_Language',
                    label: 'Speech/Language',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'cognitive_ProblemSolving', // field name in the row object
                    label: 'Cognitive/Problem Solving', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    }
                },
                {
                    name: 'social_Emotional',
                    label: 'Social/Emotional',
                    options: {
                        // filter: true,
                    },
                },
            ],
            tableData: [
                {
                    age: 'NewBorn',
                    grossMotor: 'Primitive reflexes - step,place\nMoro,Babinski,ATNR\nFlexor posture',
                    fineMotor: 'Primitive reflexes - grasp',
                    speech_Language: 'Primitive reflexes - root, suck\nAlerts to sound\nStartles to loud sounds\nVariable cries',
                    cognitive_ProblemSolving: 'Visual focus length ~10\nFix and follow slow horizontal arc Prefers\nContrast, colours, face\nPrefers high pitched voice',
                    social_Emotional: 'Bonding (parent -> child)\nSelf - Regulation/soothing'
                },
                {
                    age: '2Mos',
                    grossMotor: 'Head steady when held\nHead up 45` prone',
                    fineMotor: 'Hands open half of time\nBats at objects',
                    speech_Language: 'Turns to voice\nCooing',
                    cognitive_ProblemSolving: 'Prefers usual caregiver\nAttends to moderate novelty\nFollows past midline',
                    social_Emotional: 'Attachment (parent -> child)\nSocial smile'
                },
                {
                    age: '4Mos',
                    grossMotor: 'Sits with support\nHead up 90` prone, arms out\nRolls front -> back',
                    fineMotor: 'Palmar grasp\nReaches and obtains items\nBrings objects to midline',
                    speech_Language: 'Laugh, razz, "ga", squeal',
                    cognitive_ProblemSolving: 'Anticipates routines\nPurposeful sensory exploration of objects\n(eyes, hands, mouth)',
                    social_Emotional: 'Turn - taking conversations\nExplores parents face'
                },
                {
                    age: '6Mos',
                    grossMotor: 'Postural reflexes\nSits tripod\nRolls both ways',
                    fineMotor: 'Raking grasp\nTransfers hand to hand',
                    speech_Language: 'Babble (nonspecific)',
                    cognitive_ProblemSolving: 'Stranger anxiety\nLooks for dropped or partially hidden object',
                    social_Emotional: 'Expresses emotions: happy, sad, mad\nMemory lasts ~ 24 hrs'
                },
                {
                    age: '9Mos',
                    grossMotor: 'Gets from all 4s -> sitting\nSits well with hands free\nPulls to hand\nCreeps on hands and knees',
                    fineMotor: 'Inferior pincer grasp\nPokes at objects',
                    speech_Language: '"Mama", "Dada" (specific)\nGestures "bye, bye","up"\nGesture games("pattycake")',
                    cognitive_ProblemSolving: 'Object permenance\nUncovers toy\n"Peek-a-boo"',
                    social_Emotional: 'Separation anxiety'
                },
                {
                    age: '12Mos',
                    grossMotor: 'Walks a few steps\nWide - based Gait',
                    fineMotor: 'Fine pincer (Fingertips)\nVoluntary release\nThrows objects\nFinger - feeds self cheerios',
                    speech_Language: '1 word with meaning (besides mama, dada)\nInhibits with "no!"\nResponds to own name\n1-step command with gesture',
                    cognitive_ProblemSolving: 'Cause & effect\nTrial & error\nImitates gestures and sounds\nUses objects functionally, eg rolls toy car',
                    social_Emotional: 'Explore from secure base\nPoints at wanted items\nNarrative memory begins'
                },
                {
                    age: '15Mos',
                    grossMotor: 'Walks well',
                    fineMotor: 'Uses spoon, open top cup\nTower of 2 blocks',
                    speech_Language: 'Points to 1 body part\n1 - step command no gesture\n5 words\nJargoning',
                    cognitive_ProblemSolving: 'Looks for moved hidden objects if saw it being moved\nExperiments with toys to make them work',
                    social_Emotional: 'Shared attention: points at interesting items to show to parent\nBrings toys to parent'
                },
                {
                    age: '18Mos',
                    grossMotor: 'Stoops and recovers\nRuns',
                    fineMotor: 'Carries toys while walking\nRemoves clothing\nTower of 4 blocks\nScribbles, fisted pencil grasp',
                    speech_Language: 'Points to object, 3 body parts\n10-25 words\nEmbedded jargoning\nLabels familiar objects',
                    cognitive_ProblemSolving: 'Imitates housework\nSymbolic play with doll or bear, eg "Give teddy a drink"',
                    social_Emotional: 'Increased independence\nParallel play'
                },
                {
                    age: '2yr',
                    grossMotor: 'Jumps on two feet\nUp and down stairs "marking time"',
                    fineMotor: 'Handedness established\nUses fork\nTower of 6 blocks\nImitates vertical stroke',
                    speech_Language: 'Follows 2 - step command\n50+ words, 50% intelligible\n2 word phrases\n"I","me","you",plurals',
                    cognitive_ProblemSolving: 'New problem - solving strategies without rehearsal\nSearches for hidden object after multiple displacements',
                    social_Emotional: 'Testing limits, tantrums\nNegativism ("No!")\nPossessive ("mine!")'
                },
                {
                    age: '3yr',
                    grossMotor: 'Peals trike\nUp stairs alternating feet',
                    fineMotor: 'Undresses\nToilet trained (2.5 - 3.5 yrs)\nDraws circle, cross +\nTurns pages of books',
                    speech_Language: '3 step commands\n200 words, 75% intelligible\n3 - 44 word phrases\nW questions ("Why?")\nStates full name, age, gender',
                    cognitive_ProblemSolving: 'Simple time concepts\nIdentifies Shapes\nCompares 2 items (eg "bigger")\nCounts to 3',
                    social_Emotional: 'Separates easily, Sharing, empathy\nCooperative play\nRole play ("pretending")'
                },
                {
                    age: '4yr',
                    grossMotor: 'Hops on one foot\nDown stairs alternating feet',
                    fineMotor: 'Draws x, y, diagonals\nCuts shape with scissors\nButtons',
                    speech_Language: 'Sentences, 100% intelligible\nTells a story\nPast tense',
                    cognitive_ProblemSolving: 'Counts to 4\nOpposites\nIdentifies 4 colors',
                    social_Emotional: 'Has preferred friend\nElaborate fantasy play'
                },
                {
                    age: '5yr',
                    grossMotor: 'Balance on one foot 10 secs skips\nMay learn to ride bicycle (if available)',
                    fineMotor: 'Draw person (10 body parts)\nTripod pencil grasp\nPrints name, copies letters\nIndependent ADLs, incl tying',
                    speech_Language: '5000 words\nFuture tense\nWord play, jokes, puns\nPhonemic awareness',
                    cognitive_ProblemSolving: 'Counts to 10 accurately\nRecite ABCs by rote\nRecognizes some letters\nPre - literacy and numeracy skills',
                    social_Emotional: 'Has group of friends\nFollows group rules\nGames with rules'
                },
            ],

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
            question: 'development',
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
            console.log("Examination Data Development", res.data.view.data)
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

                        {/* Table */}
                        <Grid className='w-full' item lg={12} md={12} sm={12} xs={12}>
                            <LoonsTable
                                id={'Development'}
                                data={this.state.tableData}
                                columns={this.state.columns}
                                options={{
                                    pagination: false,
                                    serverSide: true,
                                    print: false,
                                    viewColumns: false,
                                    download: false,
                                    onTableChange: (action, tableState) => {
                                        switch (action) {
                                            case 'changePage':
                                                this.setPage(
                                                    tableState.page
                                                )
                                                break
                                            case 'sort':
                                                //this.sort(tableState.page, tableState.sortOrder);
                                                break
                                            default:
                                                break;
                                        }
                                    },
                                }}
                                ></LoonsTable>
                        </Grid>

                        {/* save */}
                        <Grid className=' flex justify-start' item lg={12} md={12} sm={12} xs={12}>
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

export default withStyles(styleSheet)(Development)
