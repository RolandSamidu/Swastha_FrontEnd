import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar';
import {
    Grid,
    Typography,
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
import WarehouseBins from './CreateWarehouse/WarehouseBins'
import CreateWarehousePeople from './CreateWarehouse/CreateWarehousePeople'
import CreateWarehouseList from './CreateWarehouse/CreateWarehouseList'

import WarehouseServices from "app/services/WarehouseServices";
import HigherLevelWarehouse from './HigherLevelWarehouse'
import ItemTrasfer from './CreateWarehouse/ItemTrasfer'



const styleSheet = (theme) => ({})

class EditWarehouseTabHandling extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeTab : 0 ,
            loaded:true,
            data:[],
            filterData: {
                limit: 20,
                page: 0,
            }
        }
    }
    componentDidMount() {
        this.loadData()

        let warehouse_id = this.props.match.params.id
        console.log("ware id",warehouse_id)
        
    }
    
    async loadData() {
        this.setState({ loaded: false })

        let res = await WarehouseServices.getWarehousesBinsByIdwithParams(this.props.match.params.id,this.state.filterData)

        console.log("Warehouse",res)
        if (res.status == 200) {
            this.setState(
                {
                    loaded: true,
                    data: res.data.view,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                }
            )
        }
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                    <Grid className=" w-full flex" container={2} >
                        <Grid item lg={6} md={6} xs={12} >
                        <SubTitle title="Store-ID" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.store_id}</Typography>
                        </Grid>
                        <Grid item lg={6} md={6} xs={12}>
                        <SubTitle title="Store Name" />
                          <Typography variant="h5">{this.state.data?.Pharmacy_drugs_store?.name}</Typography>

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

                                <Tab label={<span className="font-bold text-12">Warehouse Bin</span>} />
                                <Tab label={<span className="font-bold text-12">Item List</span>} />
                                <Tab label={<span className="font-bold text-12">People</span>} />
                                <Tab label={<span className="font-bold text-12">Higher Level</span>} />
                                <Tab label={<span className="font-bold text-12">Drug Transfer</span>} />



                            </Tabs>
                        </Grid>
                        </AppBar>
                        <main>
                                    {this.state.loaded ? 
                                    <Fragment>
                                        {
                                            this.state.activeTab == 0 ?
                                                <div className='w-full'>
                                                    <WarehouseBins id ={this.props.match.params.id} pharmacydrugstore ={this.state.data.Pharmacy_drugs_store}  />
                                                </div> : null
                                        }
                                        {
                                            this.state.activeTab == 1 ?
                                                <div className='w-full'>
                                                    <CreateWarehouseList id ={this.props.match.params.id} pharmacydrugstore = {this.state.data.Pharmacy_drugs_store}/>
                                                </div> : null
                                        }
                                          {
                                            this.state.activeTab == 2 ?
                                                <div className='w-full'>
                                                    < CreateWarehousePeople id ={this.props.match.params.id} pharmacydrugstore = {this.state.data.Pharmacy_drugs_store}/>
                                                </div> : null
                                        }
                                         {
                                          this.state.activeTab == 3 ?
                                              <div className='w-full'>
                                 <HigherLevelWarehouse id ={this.props.match.params.id} owner_id={this.state.owner_id}/>                   
                   </div> : null
                                      }
                                        {
                                            this.state.activeTab == 4 ?
                                                <div className='w-full'>
                                                    < ItemTrasfer id ={this.props.match.params.id} pharmacydrugstore = {this.state.data.Pharmacy_drugs_store}/>
                                                </div> : null
                                        }
                                         


                                       
                                    </Fragment> :null }
                                   

                        </main>

                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(EditWarehouseTabHandling)