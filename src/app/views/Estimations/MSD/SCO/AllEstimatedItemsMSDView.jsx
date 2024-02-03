import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Tabs,
    Tab,
    Grid,
    IconButton,
    Icon,
    Tooltip,
    CircularProgress,
    Dialog
} from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import moment from 'moment';

import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import { yearMonthParse, dateParse, yearParse } from 'utils'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    LoonsTable,
    CardTitle,
    SubTitle,
    FilePicker,
    ImageView,
} from 'app/components/LoonsLabComponents'
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@mui/icons-material/Edit';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import * as appConst from '../../../../../appconst'
import HospitalItemsList from './HospitalItemsList'
import EstimationService from 'app/services/EstimationService'


const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    root: {
        display: 'flex',
    },
})

class AllEstimatedItemsMSDView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            EstimationData: null,
            loaded: false
        }
    }

    async loadEstimation() {
        this.setState({ loaded: false })


        let res = await EstimationService.getEstimationById(this.props.match.params.id,{})
        if (res.status == 200) {
            console.log("estimation setup data", res.data.view)
            this.setState({
                EstimationData: res.data.view,
                loaded: true
            })
        }
    }

    componentDidMount() {
        this.loadEstimation()
    }

    render() {
        const { classes } = this.props
        return (
            < Fragment >
                <MainContainer>
                    <LoonsCard className="mt-3">
                        <CardTitle title="Estimation Details" />

                        <div className='pt-5'>
                            {this.state.loaded &&
                                <HospitalItemsList id={this.props.match.params.id} warehouse_id={this.props.match.params.warehouse} EstimationData={this.state.EstimationData} ></HospitalItemsList>
                            }
                        </div>

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

export default withStyles(styleSheet)(AllEstimatedItemsMSDView)