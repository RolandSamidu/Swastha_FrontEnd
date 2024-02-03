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
import { yearMonthParse, dateParse, yearParse, includesArrayElements } from 'utils'

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
import DefaultItemsPharmacist from './CPEstimateditemsViews/DefaultItemsPharmacist'
import OtherItemsPharmacist from './CPEstimateditemsViews/OtherItemsPharmacist'
import EstimationService from 'app/services/EstimationService'
import localStorageService from 'app/services/localStorageService'

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

class CPAllEstimatedItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            activeTab: 0,
            EstimationData: null,
            userRoles: [],
            sr_no:null,

        }
    }


    async loadEstimation() {
        this.setState({ loaded: false })


        let res = await EstimationService.getEstimationsById(this.props.match.params.id)
        if (res.status == 200) {
            console.log("estimation setup data", res.data.view)
            this.setState({
                EstimationData: res.data.view,
                loaded: true
            })
        }
    }


    async componentDidMount() {
        var user_info = await localStorageService.getItem('userInfo')
        const params = new URLSearchParams(this.props.location.search);
        let sr_no =  params.get('sr_no')
       
        this.setState({
            userRoles: user_info.roles,
            sr_no:sr_no
        })
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
                        <CardTitle title="Estimation Details" />

                        <div>
                            <Tabs
                                value={this.state.activeTab}
                                onChange={this.handleTabChange}

                                style={{ minHeight: 39, height: 26 }}
                                indicatorColor="primary"
                                variant='fullWidth'
                                textColor="primary"
                            >

                                <Tab label="INSTITUTE ITEMS" />
                                {includesArrayElements(this.state.userRoles, ['MSD AD']) ?
                                    < Tab label="OTHER ITEMS" />
                                    :null
                                }
                            </Tabs>
                        </div>

                        {this.state.loaded ?
                            <div className='w-full'>

                                {
                                    this.state.activeTab == 0 &&
                                    <div className='pt-5'>
                                        <DefaultItemsPharmacist id={this.props.match.params.id} warehouse_id={this.props.match.params.warehouse} EstimationData={this.state.EstimationData} sr_no={this.state.sr_no}></DefaultItemsPharmacist>
                                    </div>
                                }

                                {
                                    this.state.activeTab == 1 &&
                                    <div className='pt-5'>
                                        <OtherItemsPharmacist id={this.props.match.params.id} warehouse_id={this.props.match.params.warehouse} EstimationData={this.state.EstimationData} sr_no={this.state.sr_no}></OtherItemsPharmacist>
                                    </div>
                                }
                            </div>

                            :
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress
                                    size={30}
                                />
                            </Grid>
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

export default withStyles(styleSheet)(CPAllEstimatedItems)