import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar';
// import { useTheme } from '@material-ui/styles'
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
import ComparisonChart from '../ComparisonChart';

const styleSheet = (theme) => ({
    
})



class AlternateDrugTab extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeTab : 0 ,
            activeStep: 0
            
        }
    }

    render() {
        // const theme = useTheme()
        return (
            <Fragment>
                <MainContainer>
                                  
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

                                <Tab label={<span className="font-bold text-small">Alternate Drugs Consumption</span>} />
                                <Tab label={<span className="font-bold text-small">Different Strengths Consumption</span>} />


                            </Tabs>
                        </Grid>
                        </AppBar>
  
                        <main>

                                    <Fragment>
                                        {
                                            this.state.activeTab == 0 ?
                                                <div className='w-full'>
                                                    <ComparisonChart
                                        height="350px"
                                        color={[
                                            // theme.palette.primary.dark,
                                            // // theme.palette.primary.main,
                                            // theme.palette.primary.light,
                                        ]}>

                                        </ComparisonChart>
                       
                                                </div> : null
                                        }
                                          {
                                            this.state.activeTab == 1 ?
                                                <div className='w-full'>
                                                      <h3>add charts and tabs</h3>
                                                    {/* <DSItemConfig id ={this.props.match.params.id}/> */}
                                                </div> : null
                                        }
                                          
                                       
                                    </Fragment>

                        </main>
                                       
                   
                </MainContainer>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(AlternateDrugTab)