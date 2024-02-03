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
    InputAdornment,
    CircularProgress,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import HospitalConfigServices from 'app/services/HospitalConfigServices'
import { width } from '@mui/system'
import localStorageService from 'app/services/localStorageService'

const styleSheet = (theme) => ({})

class ClinicConfig extends Component {
    constructor(props) {
        super(props)
        this.state = {

            loaded: false,

            alert: false,
            message: '',
            severity: 'success',

            owner_id: null,
            clinic_no_prefix:null,
            formData: {
               
            },

        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let owner_id = await localStorageService.getItem("owner_id")
        let clinic_no_prefix=this.props.match.params.id
        let formData = this.state.formData;
        formData[`${owner_id}.prescription.${clinic_no_prefix}.rejectdate`] = null;
        this.setState({ owner_id, formData,clinic_no_prefix, loaded: true })
    }

    componentDidMount() {

        this.loadData()

    }

    handleDataSubmit = async () => {
        let formData = this.state.formData
        console.log("fromdata",formData)

        /*  let res = await HospitalConfigServices.postBHTStartNumber(formData)

         if (200 == res.status) {
             this.setState({
                 alert: true,
                 message: 'Configaration Successfully Updated',
                 severity: 'success',

             })
             this.fetchDataSet()
         } else {
             this.setState({
                 alert: true,
                 message: 'Configaration Updated Unsuccessful',
                 severity: 'error',
             })
         }  */


    }




    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>

                    <CardTitle title="Clinic Default Period" />

                    <ValidatorForm
                        className="pt-2"
                        onSubmit={() => this.handleDataSubmit()}
                        onError={() => null}
                    >
                        {/* Main Grid */}
                        {this.state.loaded &&
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                className="mt-3"
                            >

                                <Grid item xs={12} sm={12} md={4} lg={4}>
                                    <TextValidator
                                        placeholder="Days"
                                        //variant="outlined"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        type='number'
                                        onChange={(e) => {
                                            let formData = this.state.formData
                                            formData[`${this.state.owner_id}.prescription.${this.state.clinic_no_prefix}.rejectdate`] = e.target.value
                                            this.setState({ formData })
                                        }}
                                        value={
                                            this.state.formData[`${this.state.owner_id}.prescription.${this.state.clinic_no_prefix}.rejectdate`]
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end" >
                                                    <p className='px-2'>| Days</p>
                                                </InputAdornment>
                                            )
                                        }}
                                        validators={[
                                            'required',
                                            'maxNumber:' + 300,
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                            'please enter a valid weight',
                                        ]}
                                    />
                                </Grid>


                                <Button className='m-2' progress={false} type="submit" startIcon="save">
                                    <span className="capitalize">
                                        Save
                                    </span>
                                </Button>


                            </Grid>
                        }
                    </ValidatorForm>

                </MainContainer>

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

export default withStyles(styleSheet)(ClinicConfig)
