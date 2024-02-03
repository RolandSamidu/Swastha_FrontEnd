import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar';
import {
    Grid,
   
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
import EditItem from './EditItem'
import HospitalItem from './HospitalItem'



const styleSheet = (theme) => ({})

class AllitemTabHandling extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeTab : 0 ,
            
        }
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                      
                    
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

                                <Tab label={<span className="font-bold text-12">ALL ITEMS</span>} />
                                {/* <Tab label={<span className="font-bold text-12">HOSPITAL ITEMS</span>} /> */}

                            </Tabs>
                        </Grid>
                        </AppBar>
                        <main>

                                    <Fragment>
                                        {
                                            this.state.activeTab == 0 ?
                                                <div className='w-full'>
                                                    <EditItem id ={this.props.match.params.id}/>
                                                </div> : null
                                        }
                                        {/* {
                                            this.state.activeTab == 1 ?
                                                <div className='w-full'>
                                                    <HospitalItem id ={this.props.match.params.id}/>
                                                </div> : null
                                        } */}
                                       
                                    </Fragment>

                        </main>

                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(AllitemTabHandling)