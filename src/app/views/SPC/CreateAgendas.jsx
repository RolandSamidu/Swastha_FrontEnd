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

import LoonsButton from 'app/components/LoonsLabComponents/Button';
class CreateAgendas extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,}}



render() {
  return (
   <MainContainer>
    <LoonsCard>

    <CardTitle title={" Procurement Committe No: PC/04/2021"} />
    <ValidatorForm onSubmit={() => {}} className="w-full">
    <div
                style={{
                    display: 'flex',
                    alignItems: 'left',
                    justifyContent: 'space-between',
                }}
            >
                <Grid container spacing={1} className="space-between ">
                    <Grid item lg={6} md={4} sm={6} xs={12}>
                        
                        <SubTitle title="Date" />
                                <DatePicker
                                    className="w-full"
                                    placeholder="From"/>
                    </Grid>
                    <Grid item lg={6} md={4} sm={6} xs={12}>
                    <label>Time</label>
                           
                           <TextValidator
                                           className=" w-full"
                                          
                                           name="excess"
                                           InputLabelProps={{ shrink: false }}
                                           
                                           type="text"
                                           variant="outlined"
                                           size="small"                                            
                                           
                                              
                                           
                                          
                                        
                                       />
</Grid>
</Grid>
</div>
 <div style={{
                marginTop:'25',
                }}>
                    <Grid container spacing={1} className="flex "> 
                <Grid item lg={6} md={4} sm={6} xs={12}>
                <label>Remarks :</label>
           
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
           </Grid><div
                        style={{
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'space-between',
                            marginTop: '29px'
                        }}
                    >
                            <Grid item lg={12} md={4} sm={6} xs={12}>
                            <LoonsButton className="w-full" >Save</LoonsButton>
                            </Grid>
                            
                           
                            </div>
                </Grid></div>


</ValidatorForm>
</LoonsCard>
</MainContainer>
  
  )
}



}





export default CreateAgendas