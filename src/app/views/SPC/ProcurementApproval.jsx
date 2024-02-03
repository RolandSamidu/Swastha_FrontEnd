import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
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
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    Typography,
    Box,
    Tabs,
    Tab
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
//import MUIRichTextEditor from 'mui-rte'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import * as appConst from '../../../appconst'
import { dateTimeParse } from 'utils'
import VisibilityIcon from '@material-ui/icons/Visibility';
import ConsignmentService from 'app/services/ConsignmentService'
import DistributionCenterServices from 'app/services/DistributionCenterServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from 'app/services/WarehouseServices'
import { element } from 'prop-types'
import { dateParse } from 'utils'
import LoonsButton from 'app/components/LoonsLabComponents/Button';

class ProcurementApproval extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            filterData:{commiteeSPC:''},
            data: [
                
            ],
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                    }},
                    {
                        name: 'sr_no',
                        label: 'SR Number',
                        options: {
                            display: true,
                        }},
                        {
                            name: 'item_name',
                            label: 'Item Name',
                            options: {
                                display: true,
                            }},
                            {
                                name: 'priority_leave',
                                label: 'Priority Level',
                                options: {
                                    display: true,
                                }},
                                {
                                    name: 'qty',
                                    label: 'Quantity',
                                    options: {
                                        display: true,
                                    }},
                                    {
                                        name: 'estimated_item_price',
                                        label: 'Estimated Item Price',
                                        options: {
                                            display: true,
                                        }},
                                        {
                                            name: 'estimated_total_cost',
                                            label: 'Estimated Total Cost',
                                            options: {
                                                display: true,
                                            }},
                    
                    
                    
                    
                    ],
                    columns2: [
                        {
                            name: 'created/uploaded_date',
                            label: 'Created/Uploaded date',
                            options: {
                                display: true,
                            }},
                        
                            {
                                name: 'doc_name',
                                label: 'Document Name',
                                options: {
                                    display: true,
                                }},
                                {
                                    name: 'ref_no',
                                    label: 'Reference Number',
                                    options: {
                                        display: true,
                                    }},
                                     {
                                        name: 'uploaded/created_by',
                                        label: 'Uploaded/Created By',
                                        options: {
                                            display: true,
                                        }},
                                         {
                                            name: 'doc_status',
                                            label: 'Document Status',
                                            options: {
                                                display: true,
                                            }},  
                        
                                            {
                                                name: 'action',
                                                label: 'Action',
                                                options: {
                                                    display: true,
                                                }},  
                        
                        
                        
                        
                        
                        ]
                    
                    
                    
                    
                    }}
        
        
        
        
        
        
        
        
        
        
        
        
        
        
  render() {
    return (
        <MainContainer>
       <ValidatorForm>
        <LoonsCard>
            <div  style={{
                    display: 'flex',
                    alignItems: 'left',
                    justifyContent: 'space-between',
                    marginTop:'15px'
                }}>
        <CardTitle title={"Procurement Ref No: 1245/S/2022"} />
        <div>
        <Grid item lg={12} md={4} sm={6} xs={12}>
            <label style={{marginTop:'30px'}}>Order List No:2022/SPC/X/R/P/0306</label>
        </Grid>
        
        <div style={{
                    display: 'flex',
                    alignItems: 'left',
                    justifyContent: 'space-between',
                }}> 
        <Grid item lg={12} md={4} sm={6} xs={12}>
            <label >Authority Level:</label>
            <LoonsButton style={{width:'50%' ,marginLeft:'10px'}}>DPC-minor</LoonsButton>
        </Grid>
        </div>
        </div>
        </div>
        <LoonsTable
                                            

                                            id={'completed'}
                                            data={this.state.data}
                                            columns={this.state.columns}></LoonsTable>                                        
                                            <h6 style={{width:'100%' , marginRight:'5px'}}>Total Procurement Value : LKR 333.33M</h6>
                             <hr></hr>
                                            

<div style={{
                                marginTop:'50px',
                                }}>
                                    <Grid container spacing={1} className="flex "> 
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <h6>Supervisor Acknowledgement</h6>
                                <label>Note :</label>
                           
                            <TextValidator
                                            className=" w-full"
                                            value={this.state.textAreaValue}
                                            rows={20}
                                            name="excess"
                                            InputLabelProps={{ shrink: false }}
                                            
                                            type="text"
                                            variant="outlined"
                                            size="small"                                            
                                            
                                               
                                            
                                           
                                         
                                        />
                           </Grid>
                           <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <h6>Procurement Officer</h6>
                                <label>Note :</label>
                           
                            <TextValidator
                                            className=" w-full"
                                            value={this.state.textAreaValue}
                                            rows={20}
                                            name="excess"
                                            InputLabelProps={{ shrink: false }}
                                            
                                            type="text"
                                            variant="outlined"
                                            size="small"                                            
                                            
                                               
                                            
                                           
                                         
                                        />
                           </Grid>
                           <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <h6>Manager Imports</h6>
                                <label>Note :</label>
                           
                            <TextValidator
                                            className=" w-full"
                                            value={this.state.textAreaValue}
                                            rows={20}
                                            name="excess"
                                            InputLabelProps={{ shrink: false }}
                                            
                                            type="text"
                                            variant="outlined"
                                            size="small"                                            
                                            
                                               
                                            
                                           
                                         
                                        />
                           </Grid></Grid></div><hr></hr>
        
                           <LoonsTable
                                            

                                            id={'completed'}
                                            data={this.state.data}
                                            columns={this.state.columns2}></LoonsTable> 
                                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                    
                                    <SubTitle title="Select Format" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-half"
                                        value={this.state.filterData.commiteeSPC}
                                        options={appConst.commiteeSPC}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData = this.state.filterData;
                                                filterData.commiteeSPC = value;
                                                this.setState({ filterData })
                                            } else {
                                                let filterData = this.state.filterData;
                                                filterData.commiteeSPC = { label: "" };
                                                this.setState({ filterData })
                                            }
                                        }}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="All"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={this.state.filterData.commiteeSPC}/>
                                                )}
                                                />  
                                </Grid>
                                <hr></hr>
                                <h2><center>Procurement Committe Approval</center></h2>
                                <Grid item lg={12} md={4} sm={6} xs={12}>
                                <div
                style={{
                    display: 'flex',
                    alignItems: 'left',
                    justifyContent: 'space-between',
                }}
            >
<table>
<tr>
    <th colspan="2">NATURE OF THE PROCUREMENT COMMITTEE : DPC MINOR PHARMACEUTICAL </th>
    <th colspan="2">NAME OF THE PROCUREMENT ENTITY : STATE PHARMACEUTICAL CORPORATION</th>
    </tr>
    <tr>
<td> MEETING NO: 20</td>
<td> DATE : 21/05/2022</td>
<td> TIME : 08.30 AM</td>
<td> PURPOSE</td>

    </tr>
    <tr>
        <td colspan="4">TITLE OF PROCUREMENT</td>
    </tr>
    <tr>
        <td colSpan="2">ORDER LIST NO :</td>
        <td colspan="2">SR NO : 0012201-31</td>
    </tr>
</table>
</div>

{/* <MUIRichTextEditor  /> */}

                                </Grid>
                                </LoonsCard>
        </ValidatorForm></MainContainer>
    )
  }      
}



export default ProcurementApproval           