
import React, { Component, Fragment } from "react";
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    FilePicker,
    LoonsTable,
    ImageView,
} from 'app/components/LoonsLabComponents';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Grid, IconButton, Tooltip ,CircularProgress,Dialog } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import * as appConst from '../../../../appconst'

import Buttons from "@material-ui/core/Button";
import MUIDataTable from "mui-datatables";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { dateParse, dateTimeParse } from "utils";

import SimpleLineChart from '../SimpleLineChart';

import ComparisonChart from '../ComparisonChart';
import AlternateDrugTab from './AlternateDrugTab';

import AddIcon from '@mui/icons-material/Add';


class ConsumerLvlEsti extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reasonDialog:false,

            loaded: true,
            alert: false,
            message: '',
            severity: 'success',
            formData: {    
            },

            totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
            },
            data: [{estimation_id:"12"}],
      }
}


    render() {
        return (
            <Fragment>
                <MainContainer>
                        <CardTitle title="Forcast Yearly Requirement" />
                        <Grid container={3}> 
                        <Grid item lg={5} className=" w-full mt-2">
                        <CardTitle title='Estimation Vs Consumption'></CardTitle>
                        <ComparisonChart
                                        height="350px"
                                        color={[
                                            // theme.palette.primary.dark,
                                            // // theme.palette.primary.main,
                                            // theme.palette.primary.light,
                                        ]}>

                        </ComparisonChart>
                        </Grid>
                       
                        <Grid item lg={3} className="w-full mt-2">          
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.loadItem()}
                            onError={() => null}
                        >
                              <Grid item lg={8}  className="ml-2">
                              <SubTitle title="Standared Yearly Estimate 2023" />
                        <TextValidator
                            className=" w-full "
                            placeholder="Estimate"
                            name="estimate"
                            InputLabelProps={{ shrink: false }}
                            value={this.state.name}
                            type="number"
                            variant="outlined"
                            size="small"
                            onChange={(e) => {
                                this.setState({
                                    name: e.target.value,
                                })
                            }}
                        />    
                              </Grid>
                             <Grid item lg={8}  className="ml-2">
                              <SubTitle title="Suggested Yearly Estimate 2023" />
                        <TextValidator
                            className=" w-full"
                            placeholder="Estimate"
                            name="estimate"
                            InputLabelProps={{ shrink: false }}
                            value={this.state.name}
                            type="number"
                            variant="outlined"
                            size="small"
                            onChange={(e) => {
                                this.setState({
                                    name: e.target.value,
                                })
                            }}
                        />    
                              </Grid>
                             <Grid item lg={8}  className="ml-2">
                              <SubTitle title="Yearly Estimate 2023" />
                        <TextValidator
                            className=" w-full"
                            placeholder="Estimate"
                            name="estimate"
                            InputLabelProps={{ shrink: false }}
                            value={this.state.name}
                            type="number"
                            variant="outlined"
                            size="small"
                            onChange={(e) => {
                                this.setState({
                                    name: e.target.value,
                                })
                            }}
                        />    
                              </Grid>
                             <Grid item lg={8}  className="ml-2">
                              <SubTitle title="Duration" />
                        <TextValidator
                            className=" w-full"
                            placeholder="Duration"
                            name="duration"
                            InputLabelProps={{ shrink: false }}
                            value={this.state.name}
                            type="text"
                            variant="outlined"
                            size="small"
                            onChange={(e) => {
                                this.setState({
                                    name: e.target.value,
                                })
                            }}
                        />    
                              </Grid>
                              <Grid item lg={8}  className="ml-2">
                              <SubTitle title="Reason for Deviation" />
                              <TextValidator
                                            className=" w-full"
                                            placeholder="Deviation"
                                            name="deviation"
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            value={this.state.note
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            multiline
                                            rows={3}
                                            onChange={(e) => {
                                                let note_formDate = this.state.note_formDate
                                                note_formDate.note = e.target.value
                                                this.setState({ note_formDate })
                                            }}
                                        /*  validators={['required']}
                                     errorMessages={[
                                         'this field is required',
                                     ]} */
                                        />
                              </Grid>
                              <Button
                                className="mt-2 mr-2"
                                progress={false}
                                type="submit"
                                scrollToTop={true}
                                startIcon="save"
                            //onClick={this.handleChange}
                            >
                                <span className="capitalize">
                                    Save
                                </span>
                            </Button>
                            
                        </ValidatorForm>
                           
                        </Grid>
                        <Grid item lg={4} className="w-full mt-2">     
                         <AlternateDrugTab/>  
                         </Grid>
                        </Grid>
                        <CardTitle title="Forcast Monthly Requirement" />
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.loadItem()}
                            onError={() => null}
                        >
                       
                         <Grid item lg={4}  className="ml-2">
                         <SubTitle title="Monthly Allocation Method" />
                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={[{ label: 'Based on Consumption' }, { label: 'Based on Annual Estimation divided by 2 ' }]
                                          }
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.time_period;
                                                    filterData.status = e.target.value;
                                                    this.setState({filterData})
                                                }
                                            }}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.time_period}
                                                />
                                            )}
                                        />
                             
                              <Grid item lg={12}  className="ml-2">
                                    <SimpleLineChart />        
                                    </Grid>
                         </Grid>
                        <SubTitle title="Estimation for 2023" />
                        <Grid container={1}>                        
                                  <Grid item lg={1}  >
                                  <TextValidator
                                      className=" w-full"
                                      placeholder="JAN"
                                      name="duration"
                                      InputLabelProps={{ shrink: false }}
                                      value={this.state.name}
                                      type="text"
                                      variant="outlined"
                                      size="small"
                                      onChange={(e) => {
                                          this.setState({
                                              name: e.target.value,
                                          })
                                      }}
                                  />    
                                              </Grid>
                                   <Grid item lg={1}  >
                                  <TextValidator
                                      className=" w-full"
                                      placeholder="FEB"
                                      name="duration"
                                      InputLabelProps={{ shrink: false }}
                                      value={this.state.name}
                                      type="text"
                                      variant="outlined"
                                      size="small"
                                      onChange={(e) => {
                                          this.setState({
                                              name: e.target.value,
                                          })
                                      }}
                                  />    
                                              </Grid>
                                  <Grid item lg={1}  >
                                  <TextValidator
                                      className=" w-full"
                                      placeholder="MAR"
                                      name="duration"
                                      InputLabelProps={{ shrink: false }}
                                      value={this.state.name}
                                      type="text"
                                      variant="outlined"
                                      size="small"
                                      onChange={(e) => {
                                          this.setState({
                                              name: e.target.value,
                                          })
                                      }}
                                  />    
                                              </Grid>
                                  <Grid item lg={1}  >
                                  <TextValidator
                                      className=" w-full"
                                      placeholder="APR"
                                      name="duration"
                                      InputLabelProps={{ shrink: false }}
                                      value={this.state.name}
                                      type="text"
                                      variant="outlined"
                                      size="small"
                                      onChange={(e) => {
                                          this.setState({
                                              name: e.target.value,
                                          })
                                      }}
                                  />    
                                              </Grid>
                                  <Grid item lg={1}  >
                                  <TextValidator
                                      className=" w-full"
                                      placeholder="MAY"
                                      name="duration"
                                      InputLabelProps={{ shrink: false }}
                                      value={this.state.name}
                                      type="text"
                                      variant="outlined"
                                      size="small"
                                      onChange={(e) => {
                                          this.setState({
                                              name: e.target.value,
                                          })
                                      }}
                                  />    
                                              </Grid>
                                  <Grid item lg={1}  >
                                  <TextValidator
                                      className=" w-full"
                                      placeholder="JUNE"
                                      name="duration"
                                      InputLabelProps={{ shrink: false }}
                                      value={this.state.name}
                                      type="text"
                                      variant="outlined"
                                      size="small"
                                      onChange={(e) => {
                                          this.setState({
                                              name: e.target.value,
                                          })
                                      }}
                                  />    
                                              </Grid>
                                  <Grid item lg={1}  >
                                  <TextValidator
                                      className=" w-full"
                                      placeholder="JULY"
                                      name="duration"
                                      InputLabelProps={{ shrink: false }}
                                      value={this.state.name}
                                      type="text"
                                      variant="outlined"
                                      size="small"
                                      onChange={(e) => {
                                          this.setState({
                                              name: e.target.value,
                                          })
                                      }}
                                  />    
                                              </Grid>
                                  <Grid item lg={1}  >
                                  <TextValidator
                                      className=" w-full"
                                      placeholder="AUG"
                                      name="duration"
                                      InputLabelProps={{ shrink: false }}
                                      value={this.state.name}
                                      type="text"
                                      variant="outlined"
                                      size="small"
                                      onChange={(e) => {
                                          this.setState({
                                              name: e.target.value,
                                          })
                                      }}
                                  />    
                                              </Grid>
                                  <Grid item lg={1}  >
                                  <TextValidator
                                      className=" w-full"
                                      placeholder="SEP"
                                      name="duration"
                                      InputLabelProps={{ shrink: false }}
                                      value={this.state.name}
                                      type="text"
                                      variant="outlined"
                                      size="small"
                                      onChange={(e) => {
                                          this.setState({
                                              name: e.target.value,
                                          })
                                      }}
                                  />    
                                              </Grid>
                                  <Grid item lg={1}  >
                                  <TextValidator
                                      className=" w-full"
                                      placeholder="OCT"
                                      name="duration"
                                      InputLabelProps={{ shrink: false }}
                                      value={this.state.name}
                                      type="text"
                                      variant="outlined"
                                      size="small"
                                      onChange={(e) => {
                                          this.setState({
                                              name: e.target.value,
                                          })
                                      }}
                                  />    
                                              </Grid>
                                  <Grid item lg={1}  >
                                  <TextValidator
                                      className=" w-full"
                                      placeholder="NOV"
                                      name="duration"
                                      InputLabelProps={{ shrink: false }}
                                      value={this.state.name}
                                      type="text"
                                      variant="outlined"
                                      size="small"
                                      onChange={(e) => {
                                          this.setState({
                                              name: e.target.value,
                                          })
                                      }}
                                  />    
                                              </Grid>
                               <Grid item lg={1}  >
                                  <TextValidator
                                      className=" w-full"
                                      placeholder="DEC"
                                      name="duration"
                                      InputLabelProps={{ shrink: false }}
                                      value={this.state.name}
                                      type="text"
                                      variant="outlined"
                                      size="small"
                                      onChange={(e) => {
                                          this.setState({
                                              name: e.target.value,
                                          })
                                      }}
                                  />    
                                              </Grid>
                        </Grid>
                        <SubTitle title="Reasons" />
                        <Grid container={1}>                        
                        <IconButton
                                                onClick={() => {
                                                    this.setState({
                                                      reasonDialog : true  
                                                    })
                                                }}>
                                                <AddIcon color='primary' />
                                            </IconButton>       
                        </Grid>
                  </ValidatorForm>
                </MainContainer>
                <Dialog
                        fullWidth
                        maxWidth="lg"
                        open={this.state.reasonDialog}
                        onClose={() => {
                            this.setState({ reasonDialog: false })
                        }}>
                        <div className="w-full h-full px-5 py-5">

                            <Grid container className=''>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    
                                        <ValidatorForm
                                            className=""
                                            onSubmit={() => this.SubmitAll()}
                                            onError={() => null}>

                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <h4 className='mt-5'>Reason for Deviation </h4>
                                                <Grid container={1}>
                                                      <Grid item lg={6}>
                                                      <h5 className=''>Institute Name : backend </h5>
                                                      </Grid>
                                                      <Grid item lg={6}>
                                                      <h5 className=''>Estimation Year : </h5>
                                                      </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid container={1}>
                                                      <Grid item lg={3}>
                                                      <h5 className=''>Item Name : backend </h5>
                                                      </Grid>
                                                      <Grid item lg={6}>
                                                      <h5 className=''>Panadol </h5>
                                                      </Grid>
                                            </Grid>  
                                            <Grid container={1}>
                                                      <Grid item lg={3}>
                                                      <h5 className=''>Suggested Monthly Estimation 2023: </h5>
                                                      </Grid>
                                                      <Grid item lg={6}>
                                                      <h5 className=''>2022 </h5>
                                                      </Grid>
                                            </Grid> 
                                            <Grid container={1}>
                                                      <Grid item lg={3}>
                                                      <h5 className=''>Estimation for 2023: </h5>
                                                      </Grid>
                                                      <Grid item lg={6}>
                                                      <h5 className=''>2022 </h5>
                                                      </Grid>
                                            </Grid>  
                                            <Grid container={1}>
                                                      <Grid item lg={3}>
                                                      <h5 className=''>Deviation: </h5>
                                                      </Grid>
                                                      <Grid item lg={6}>
                                                      <h5 className=''>2022 </h5>
                                                      </Grid>
                                            </Grid>                                               
                                        <Grid>
                                        <SubTitle title="Reasons for Deviation" />
                                        <TextValidator
                                                        className="w-full"
                                                        placeholder="Remarks"
                                                        name="remarks"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .remarks
                                                        }
                                                        type="text"
                                                        multiline
                                                        rows={3}
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                        remarks:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    />
                                        </Grid>
                                    
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <Button
                                                    className="mt-3 mb-5 "
                                                    progress={false}
                                                    variant="outlined"
                                                    scrollToTop={false}
                                                    // type='submit'
                                                    // startIcon="search"
                                                    onClick={() => { this.setState({
                                                       reasonDialog:false
                                                    }) }}
                                                >
                                                    <span className="capitalize">Cancel</span>
                                                </Button>
                                                <Button
                                                    className="ml-2 mt-3 mb-5 "
                                                    progress={false}
                                                    scrollToTop={false}
                                                    // type='submit'
                                                    // startIcon="search"
                                                    onClick={() => { this.handleAddReceivedItems() }}
                                                >
                                                    <span className="capitalize">Save</span>
                                                </Button>
                                            </Grid>
                                        </ValidatorForm>
                                   
                                </Grid>
                            </Grid>

                        </div>
                    </Dialog>

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

export default ConsumerLvlEsti
