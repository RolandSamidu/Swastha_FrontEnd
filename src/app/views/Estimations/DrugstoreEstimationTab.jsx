import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar';
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    Tabs,
    Tab
} from '@material-ui/core'
import {
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import DSEstimationDetails from './DrugStoreEstimationDetailTabs/DSEstimationDetails'
import DSItemConfig from './DrugStoreEstimationDetailTabs/DSItemConfig'
import DSSelectInstitute from './DrugStoreEstimationDetailTabs/DSSelectInstitute'



const styleSheet = (theme) => ({})

class DrugstoreEstimationTab extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeTab : 0 ,
            activeStep: 0
            
        }
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                    <Stepper nonLinear activeStep={this.state.activeTab} alternativeLabel>
                        <Step key={0}>
                            <StepButton
                                onClick={() => { this.setState({ activeTab: 0 }) }}

                            >
                                <StepLabel >Estimation Details</StepLabel>

                            </StepButton>

                        </Step>


                        <Step key={1}>
                            <StepButton
                                onClick={() => { this.setState({ activeTab: 1 }) }}

                            >
                                <StepLabel StepIconComponent={this.StepIcon}>Item List</StepLabel>

                            </StepButton>

                        </Step>

                        <Step key={2}>
                            <StepButton
                                onClick={() => { this.setState({ activeTab: 2 }) }}

                            >
                                <StepLabel StepIconComponent={this.StepIcon}>Select Units</StepLabel>

                            </StepButton>

                        </Step>
                    </Stepper>

                    
                        <AppBar position="static" color="default" className="mb-4">
                        <Grid item lg={12} md={12} xs={12}>
                            <Tabs
                                style={{ minHeight: 39, height: 26 }}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                value={this.state.activeTab}
                                onChange={(event, newValue) => {
                                    // console.log(newValue)
                                    this.setState({ activeTab: newValue })
                                }} >

                                <Tab label={<span className="font-bold text-12">Estimation Details</span>} />
                                {/* <Tab label={<span className="font-bold text-12">Estimation Aquire Details</span>} /> */}
                                <Tab label={<span className="font-bold text-12">Item List</span>} />
                                <Tab label={<span className="font-bold text-12">Select Units</span>} />


                            </Tabs>
                        </Grid>
                        </AppBar>
                        <main>

                                    <Fragment>
                                        {
                                            this.state.activeTab == 0 ?
                                                <div className='w-full'>
                                                    <DSEstimationDetails id ={this.props.match.params.id}/>
                                                </div> : null
                                        }
                                        {/* {
                                            this.state.activeTab == 1 ?
                                                <div className='w-full'>
                                                    <EstimationAquireDetails id ={this.props.match.params.id}/>
                                                </div> : null
                                        } */}
                                          {
                                            this.state.activeTab == 1 ?
                                                <div className='w-full'>
                                                    <DSItemConfig id ={this.props.match.params.id}/>
                                                </div> : null
                                        }
                                          {
                                            this.state.activeTab == 2 ?
                                                <div className='w-full'>
                                                    <DSSelectInstitute id ={this.props.match.params.id}/>
                                                </div> : null
                                        }
                                       
                                    </Fragment>

                        </main>
                                        
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(DrugstoreEstimationTab)