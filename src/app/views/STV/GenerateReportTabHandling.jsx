import React, { Component, Fragment } from "react";
import { CardTitle, LoonsCard} from "app/components/LoonsLabComponents";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";

import { CircularProgress, Grid, Tabs, Tab } from "@material-ui/core";

import StvItemBaseOrder from './StvItemBaseOrder';
import StvOrderBase from './StvOrderBase';

class GenerateReportTabHandling extends Component{
    constructor(props) {
        super(props)
        this.state = {
            activeTab : 0 ,
            
        }
    }
    render(){
        return(
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                    <CardTitle title="Stock Transfer Vouchers"/>
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

                                <Tab label={<span className="font-bold text-12">Order Base</span>} />
                                <Tab label={<span className="font-bold text-12">Item Base Order</span>} />

                            </Tabs>
                        </Grid>
                        
                            <div>
                                {
                                    this.state.activeTab == 0 ?
                                        <div className='w-full'>
                                            <StvOrderBase/>
                                        </div> : null
                                }
                                {
                                    this.state.activeTab == 1 ? 
                                        <div className="w-full">
                                            <StvItemBaseOrder/>
                                        </div> : null
                                }
                            </div>
                        
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )
    }
}

export default GenerateReportTabHandling