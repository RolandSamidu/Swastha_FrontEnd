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
    Tab,
    Checkbox,
    IconButton,
    CircularProgress
} from '@material-ui/core'
import * as appConst from '../../../appconst'
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import EditIcon from '@material-ui/icons/Edit'
import TablePagination from '@material-ui/core/TablePagination'
import List from '@material-ui/core/List'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Divider from '@material-ui/core/Divider'

import RMSDSetItemEstimations from './RMSDSetItemEstimations'
import RMSDItemWarehouse from './RMSDItemWarehouse'

import WarehouseServices from "app/services/WarehouseServices";
import InventoryService from 'app/services/InventoryService'
import { filter } from 'lodash'



const styleSheet = (theme) => ({})

class RMSDEstimationabHandling extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeTab : 0 ,
            loaded:false,
            itemLoaded:false,
            data:[],
            totalListItems:0,
            totalListPages:0,
            totalItems: 0,
            totalPages: 0,

            alert: false,
            message: '',
            severity: 'success',
           
            filterData: {
                  warehouse_id:this.props.id,
                  limit: 420,
                  page: 0,
                 
              },
            }
        }
    
    componentDidMount() {
        let warehouse_id = this.props.id
        console.log("ware id",warehouse_id)
        
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
                                <Tab label={<span className="font-bold text-12">All Items</span> } />
                                <Tab label={<span className="font-bold text-12">Warehouse</span>} />
                               

                            </Tabs>
                        </Grid>
                        </AppBar>
                        <main>
                                   
                                    <Fragment>
                                        {
                                            this.state.activeTab === 0 ?
                                                <div className='w-full'>
                                                    <RMSDSetItemEstimations id ={this.props.match.params.id} item_id={this.props.match.params.item_id} />

                                                </div> : null
                                        }
                                        {
                                            this.state.activeTab === 1?
                                                <div className='w-full'>
                                                    <RMSDItemWarehouse id ={this.props.match.params.id} item_id={this.props.match.params.item_id} />
                                                    </div>:null
                                               
                                        }                                    
                                    </Fragment> 
                                   

                        </main>
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

export default withStyles(styleSheet)(RMSDEstimationabHandling)