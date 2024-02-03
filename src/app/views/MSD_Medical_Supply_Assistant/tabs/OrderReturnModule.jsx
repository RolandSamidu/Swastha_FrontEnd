import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import ApartmentIcon from '@material-ui/icons/Apartment';



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
    CircularProgress,
    IconButton,
    Icon,
    Tabs,
    InputAdornment,
    Tab,
    Dialog,
    Typography
} from '@material-ui/core'
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


import OrderReturn from './tab/OrderReturn'
import OrderReturnView from './tab/OrderReturnView'


const styleSheet = (theme) => ({})

class OrderReturnModule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 0,
            activeSecondaryTab: 0,
            Loaded: false,
            selected_warehouse: null,
            selected_warehouse_name: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            login_user_roles: [],
            owner_id: null,
            owner_id2:null,
            user_type:null

        }

    }

    componentDidMount() {
        console.log('props',this.props)
    }

    changeType(type) {
        this.setState({ type: type, Loaded: false })

        setTimeout(() => {
            this.setState({ Loaded: true })
        }, 500)
        //this.setState({Loaded:true})
    }

    render() {

        return (

            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <Typography variant="h6" className="font-semibold">Order Return</Typography>
                        </div>
                        <Divider />
                        <AppBar position="static" color="default" className="mb-4 mt-2">
                            <Grid item lg={12} md={12} xs={12}>
                                <Tabs style={{ minHeight: 39, height: 26 }}
                                    indicatorColor="primary"
                                    variant='fullWidth'
                                    textColor="primary"
                                    value={this.state.activeTab}
                                    onChange={(event, newValue) => {
                                        console.log(newValue)
                                        this.setState({ activeTab: newValue })
                                    }} >

                                    <Tab label={<span className="font-bold text-12">Order Return</span>} />
                                    <Tab label={<span className="font-bold text-12">Order Return View</span>} />

                                </Tabs>
                            </Grid>
                        </AppBar>

                        <main>

                            {/* {this.state.Loaded ? */}
                                <div>
                                    {this.state.activeTab == 0 ?
                                        <div className='w-full'>
                                                <OrderReturn id={this.props.match.params.id} />
                                        </div>
                                        : null
                                    }
                                    {this.state.activeTab == 1 ?
                                        <div className='w-full'>
                                            <OrderReturnView/>  
                                        </div> : null
                                    }

                                </div>
                                {/* : null} */}
                        </main>
                    </LoonsCard>
        
                </MainContainer>
            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(OrderReturnModule)