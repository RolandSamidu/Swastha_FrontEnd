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
            loaded: false,
            filterData:{commiteeSPC:''},}}



render() {
  return (
   <MainContainer>
    <LoonsCard>

    <CardTitle title={"Add to agenda"} />
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
                        
                        <SubTitle title="Agenda Number :" />
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


                             </Grid></Grid></div></ValidatorForm></LoonsCard></MainContainer>

  )}}