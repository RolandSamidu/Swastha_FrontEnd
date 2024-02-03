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
    Tab,
    Typography,
    Button,
    Icon
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

import ConsuStock from './ConsumerLevel/ConsuStock'
import ConsumerLvlEsti from './ConsumerLevel/ConsumerLvlEsti'



const styleSheet = (theme) => ({})

class ConsumerLvlTab extends Component {

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
                    <Grid className=" w-full flex" container={5} >
                        <Grid item lg={2} md={6} xs={12} >
                        <SubTitle title="SR" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.store_id}</Typography>
                          <SubTitle title="MEDNAME" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.name}</Typography>
                        </Grid>
                        <Grid item lg={2} md={6} xs={12}>
                        <SubTitle title="Item Category" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.store_id}</Typography>
                          <SubTitle title="Item Type" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.name}</Typography>
                          <SubTitle title="Item Group" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.name}</Typography>
                        </Grid>
                        <Grid item lg={2} md={6} xs={12}>
                        <SubTitle title="VEN" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.store_id}</Typography>
                          <SubTitle title="ABC" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.name}</Typography>
                          <SubTitle title="Item Level" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.name}</Typography>
                        </Grid>
                        <Grid item lg={2} md={6} xs={12}>
                        <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.store_id}</Typography>
                          <SubTitle title="Estimated Item" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.name}</Typography>
                          <SubTitle title="Cons Item" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.name}</Typography>
                          <SubTitle title="Comp/Regular" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.name}</Typography>
                        </Grid>
                        <Grid item lg={2} md={6} xs={12}>
                        <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.store_id}</Typography>
                          <SubTitle title="Std Unit Cost(Rs.)" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.name}</Typography>
                          <SubTitle title="Formulary Approved" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.name}</Typography>
                          <SubTitle title="UOM" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.name}</Typography>
                          <SubTitle title="UFF" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.name}</Typography>
                        </Grid>
                        <Grid item lg={2} >
                        <Grid item >
                        <Button
                        className="w-full"
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                         window.location.href = '/estimation/all-estimation-items'
                        }}
                    ><span className="capitalize">
                    All Estimation of Item
                </span>
                       
                    </Button>
                        </Grid>
                        <Grid item >
                        <Button
                        className="mt-4"
                        variant="contained"
                        color="primary"
                        size="small"
                        // onClick={}
                    ><span className="capitalize">
                   Compare
                </span>
                       
                    </Button>
                        </Grid>
                        </Grid>
                        

                    </Grid>

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

                                <Tab label={<span className="font-bold text-12">Estimation</span>} />
                                <Tab label={<span className="font-bold text-12">Stock</span>} />
                            </Tabs>
                        </Grid>
                       

                        </AppBar>
                        <main>
                                    <Fragment>
                                        {
                                            this.state.activeTab == 0 ?
                                                <div className='w-full'>
                                                 <ConsumerLvlEsti id ={this.props.match.params.id}/>
                                                </div> : null
                                        }
                                          {
                                            this.state.activeTab == 1 ?
                                                <div className='w-full'>
                                                   <ConsuStock id ={this.props.match.params.id}/> 
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

export default withStyles(styleSheet)(ConsumerLvlTab)