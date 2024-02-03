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
import * as appConst from '../../../../appconst'
import DefaultItemsPharmacist from './DefaultItemsPharmacist'
import OtherItemsPharmacist from './OtherItemsPharmacist'
import AlradySubmitedItems from './AlradySubmitedItems'
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

class AddEstimationsByPharmacist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            activeTab: 0,
            EstimationData: null

        }
    }
    async loadEstimation() {
        this.setState({ loaded: false })
        let filterData = { sub_estimations_id: this.props.match.params.id, limit: 1, page: 0 }

        let res = await EstimationService.getSubHospitalEstimationById(this.props.match.params.id)
        if (res.status == 200) {
            console.log("sub estimation data", res.data.view)
            this.setState({
                EstimationData: res.data.view,
                loaded: true
            })
        }
    }


    async componentDidMount() {
        this.loadEstimation()
    }



    handleTabChange = (event, newValue) => {
        this.setState({ activeTab: newValue });
    };

    render() {
        const { classes } = this.props
        return (
            < Fragment >
                <MainContainer>
                    <LoonsCard className="mt-3">
                        <CardTitle title="Forecasted Estimation Details" />

                        <div>
                            <Tabs
                                value={this.state.activeTab}
                                onChange={this.handleTabChange}

                                style={{ minHeight: 39, height: 26 }}
                                indicatorColor="primary"
                                variant='fullWidth'
                                textColor="primary"
                            >
                                <Tooltip title="All Items" arrow>
                                    <Tab label="DEFAULT ITEMS" />
                                </Tooltip>
                                {/*  <Tab label="OTHER ITEMS" /> */}
                                <Tooltip title="You Can View And Edit Added Estimation values From Here" arrow>
                                <Tab label="ESTIMATED ITEMS" />
                                </Tooltip>
                            </Tabs>
                        </div>
                        {this.state.loaded &&
                            <div className='w-full'>
                                {
                                    this.state.activeTab == 0 &&
                                    <div className='pt-5'>
                                        <DefaultItemsPharmacist id={this.props.match.params.id} warehouse_id={this.props.match.params.warehouse} EstimationData={this.state.EstimationData}></DefaultItemsPharmacist>
                                    </div>
                                }

                                {/*  {
                                    this.state.activeTab == 1 &&
                                    <div className='pt-5'>
                                        <OtherItemsPharmacist id={this.props.match.params.id} warehouse_id={this.props.match.params.warehouse} EstimationData={this.state.EstimationData}></OtherItemsPharmacist>
                                    </div>
                                } */}

                                {
                                    this.state.activeTab == 1 &&
                                    <div className='pt-5'>
                                        <AlradySubmitedItems id={this.props.match.params.id} warehouse_id={this.props.match.params.warehouse} EstimationData={this.state.EstimationData}></AlradySubmitedItems>
                                    </div>
                                }

                            </div>
                        }
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

export default withStyles(styleSheet)(AddEstimationsByPharmacist)