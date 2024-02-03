import React, { Component, Fragment } from "react";
import { Button, CardTitle, LoonsCard, LoonsTable, MainContainer, SubTitle,LoonsSwitch,} from "../../components/LoonsLabComponents";
import { CircularProgress, Grid, Link, Tooltip, IconButton ,InputAdornment,Typography,TextField  } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import moment from "moment";
import * as appConst from '../../../appconst'

import WarehouseServices from "app/services/WarehouseServices";
import SearchIcon from '@material-ui/icons/Search';
import { dateParse } from 'utils'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Switch from '@material-ui/core/Switch'


class OrderConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            totalItems: 0,
            checked:false,
            daysArry:[],
            formData: {
               days:0,
               duration:null,

            },

            filterData: {
                limit: 20,
                page: 0,
                // item_id:this.props.match.params.id,
                // owner_id:'000',
                // exp_date_grater_than_zero:true
            },
            data: [],

            alert: false,
            message: "",
            severity: 'success',
        }
    }

    // Load data onto table
    async loadData() {
        // this.setState({
        //     loaded: false,
        // })

        let filterData = this.state.filterData

        const res = await WarehouseServices.getAllItemWarehouse(filterData)
        console.log("formDATA",res)

        if (200 == res.status) {
            filterData.page = res.data.view.currentPage
            this.setState(
                {
                    filterData,
                    data: res.data.view.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                    loaded: true,
                },
                () => {
                    console.log('data', this.state)
                    this.render()
                }
            )
        }
    }

    handleFilterSubmit = (val) => {
        this.loadData()
    }

    onSubmit = () => {
        this.handleFilterSubmit({
            ref_no: this.state.ref_no,
            sr_no: this.state.sr_no,
            batch_id: this.state.batch_id,
            wharf_ref_no: this.state.wharf_ref_no,
        })
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
            }
        )
    }
    handleChange = (val) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [val.target.name]: val.target.checked,
            },
        })
    }

async dayNumberArray() {
        var arr = [];
    for (var i = 1; i < 11; i++) {
        let daysArry = this.state.daysArry
        var obj = {};
        // obj.label= ;
        daysArry.push({label:i.toString()});
        console.log("array", daysArry)
        
        this.setState({
            daysArry : daysArry
        })
    }
   
    console.log("array2", this.state.daysArry)
    }

    componentDidMount() {
        this.dayNumberArray()
      //   this.loadData()
    }

    render() {
        return (
            <Fragment>
                  <LoonsCard>
                <MainContainer>
                <CardTitle title="Order Configuaration" />
                <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography >
                       Maximum Attend Time
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>
                        BA
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel disabled={this.state.checked}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Grid container={3}>
                        <Grid item lg={9}>
                            <Typography >
                            Hold Time of Allocated Orders
                            </Typography>
                        </Grid>
                        <Grid item lg={3} style={{
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}>
                        <Switch
                // checked={this.state.checked}
                onChange={()=> {
                    if(this.state.checked === true){
                        this.setState({
                            checked : false
                        })
                    }
                    if(this.state.checked === false){
                        this.setState({
                            checked : true
                        })
                    }
                   
                }}
                value="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
                        </Grid>
                    </Grid>
                    
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {this.state.checked === false ?
                    <div className="w-full">
                          <ValidatorForm
                        className="w-full"
                        id="create-course-form"
                        onSubmit={() => { this.submit() }}
                        onError={() => null}
                    >
                    <Grid container={2}>
                        <Grid item lg={3}>
                        <SubTitle title="Duration" />
                        <TextValidator
                            className="w-full"
                            name="Duration"
                            placeholder="Duration"
                            InputLabelProps={{ shrink: false }}
                            type="number"
                            variant="outlined"
                            size="small"
                            onChange={(e) => {

                                let formData = this.state.formData;
                                formData.duration = e.target.value
                                this.setState({ formData })


                            }}
                            value={this.state.formData.duration}

                             /* validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]} */
                               // InputProps={{
                                        //     endAdornment: (
                                        //         <InputAdornment position="end" >
                                        //             <p className='px-2'>mmol/L</p>
                                        //         </InputAdornment>
                                        //     )
                                        // }}                   
                                                   
                                    />                                     
                          
                        </Grid>
                        <Grid item lg={3}>
                        <Autocomplete
                                        disableClearable
                            className="w-full mt-5 ml-2"
                            options={this.state.daysArry
                                // [{'label' : '1'},{'label':'2'}]
                            }
                            
                            onChange={(e, value) => {
                                if (null != value) {
                                    this.setState({
                                        days: value.label,
                                    })
                                }
                            }}
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                                <TextValidator
                                    {...params}
                                    placeholder="DAYS"
                                    //variant="outlined"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={this.state.days}
                                />
                            )}
                        />

                        </Grid>
                            <Grid item lg={6} style={{
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}>
                                <Button
                                        className="mt-6 ml-4 flex-end"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                        startIcon="save"



                                    >
                                        <span className="capitalize">
                                            Update
                                        </span>
                                </Button>      
                            </Grid>
                    </Grid>
                  
                    </ValidatorForm>  
                    </div>: null }
                 
                </ExpansionPanelDetails>
            </ExpansionPanel>
            {/* <ExpansionPanel disabled={false}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography >
                        Disabled Expansion Panel
                    </Typography>
                </ExpansionPanelSummary>
            </ExpansionPanel> */}


                </MainContainer>
                </LoonsCard>
            </Fragment>
        )
    }
}

export default OrderConfiguration


