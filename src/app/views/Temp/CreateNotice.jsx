import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    Typography,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    FilePicker,
    ImageView,
} from 'app/components/LoonsLabComponents'

import RichTextEditor from 'react-rte';


const styleSheet = (theme) => ({})

class CreateNotice extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: RichTextEditor.createValueFromString('', 'html')
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        return (
            <Fragment>
                <RichTextEditor
                    className="react-rte-itemMaster"
                    value={this.state.value}
                    onChange={(value) => {

                        this.setState({  value })
                        console.log("values", value.toString('html'))

                    }}
                />
            </Fragment>
        )
    }

}
export default withStyles(styleSheet)(CreateNotice)