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
    CircularProgress,
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
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'

const styleSheet = (theme) => ({})

class PatientsInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 0,

            alert: false,
            message: '',
            severity: 'success',

            Loaded: false,
            filterData: {
                limit: 10,
                page: 0,
            },
            totalItems: 0,
            totalPages: 0,
            data: [],
            columns: [

                {
                    name: 'question',
                    label: 'Title',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'answer',
                    label: 'Value',
                    options: {
                        display: true,
                    },
                },


            ],
        }
    }



    async loadData() {
        //function for load initial data from backend or other resources
        let id = this.props.match.params.id;
        let params = { patient_id: id, checktype: 'snap' }
        let res = await PatientServices.getPatientInfo(params)
        if (res.status) {
            console.log("all uoms", res.data.view.data)
            if (res.data.view.data.length != 0) {
                this.setState({
                    data: res.data.view.data,
                    loaded: true,
                    totalItems: res.data.view.totalItems,
                    totalPages: res.data.view.totalPages
                })
            } else {
                this.setState({
                    loaded: true,
                })
            }
        }
    }



    componentDidMount() {
        this.loadData()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Patient Examination details" />





                        {this.state.loaded ? (
                            <div className="pt-10">
                                <LoonsTable
                                    //title={"All Aptitute Tests"}
                                    id={'patiantinfo'}
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        // count:this.state.totalPages,
                                        count: this.state.totalItems,
                                        rowsPerPage: 20,
                                        page: this.state.filterData.page,

                                        // rowsPerPageOptions: [10,20,30,40],
                                        onTableChange: (action, tableState) => {
                                            console.log(action, tableState)
                                            switch (action) {
                                                case 'changePage':
                                                    //this.setPage(tableState.page)
                                                    //this.changePage(tableState.page, tableState.sortOrder);
                                                    break
                                                case 'sort':
                                                    //this.sort(tableState.page, tableState.sortOrder);
                                                    break
                                                default:
                                                    console.log(
                                                        'action not handled.'
                                                    )
                                            }
                                        },
                                    }}
                                ></LoonsTable>
                            </div>
                        ) : (
                            <Grid className="justify-center text-center w-full pt-12">
                                {/*  <CircularProgress size={30} /> */}
                            </Grid>
                        )}

                    </LoonsCard>
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

export default withStyles(styleSheet)(PatientsInfo)
