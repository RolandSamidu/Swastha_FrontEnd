import { Button, Grid, Icon, IconButton, TextField } from '@material-ui/core'
import React, { Component, Fragment, useState } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { LoonsTable } from '../..'
import CardTitle from '../../CardTitle'
import LabeledInput from '../../LabeledInput'
import LoonsCard from '../../LoonsCard'
import MainContainer from '../../MainContainer'
import { dateParse } from 'utils'
import { Autocomplete } from '@material-ui/lab'
import * as appConst from '../../../../../appconst'
import ExaminationServices from 'app/services/ExaminationServices'
import ViewProcedures from './ViewProcedures'





class Procedures extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [
                {
                    name: 'procedureInput', // field name in the row object
                    label: 'Procedure', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    }
                },
                {
                    name: 'remarkInput', // field name in the row object
                    label: 'Remark', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    }
                },
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        // filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <> < IconButton className = "text-black" 
                                    // onClick = {
                                    // () => {
                                    //     window.location = `/chiefPharmacist/individualOrder/${this
                                    //         .state
                                    //         .data[tableMeta.rowIndex]
                                    //         .id}/${this
                                    //             .state
                                    //             .data[tableMeta.rowIndex]
                                    //             .status}`
                                    // }
                                    // }
                                 > <Icon color="primary">delete</Icon>
                                    </IconButton>
                                </>
                            )
                        }
                    }
                },
            ],
            data: [],
            
            formData: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",
                patient_id: window.dashboardVariables.patient_clinic_id,
                widget_id: this.props.widget_id,
                examination_data: [{
                    widget_input_id: this.props.itemId,
                    question: "procedures",
                    other_answers: {
                        date: new Date(),
                        answers: []    
                    }
                }]
            },

            tempForm: {
                remarkInput: null,
                procedureInput: null
            }
            

        }
    }

    

    async submit() {
        console.log("formdata", this.state.formData)
        let formData = this.state.formData;

        let res = await ExaminationServices.saveData(formData)
        console.log("Examination Data added", res)
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Examination Data Added Successful',
                severity: 'success',
            }, () => {
                this.loadData()
                // this.onReload()
            })
        }
    }

    async loadData() {
        this.setState({
            // loaded: false,
            // data: [],
        })
        let params = {
            patient_id: window.dashboardVariables.patient_id,
            widget_input_id: this.props.itemId,
            question: 'procedures',
            'order[0]': [
                'createdAt', 'DESC'
            ],
            limit: 10
        }


        let res;
        if (this.props.loadFromCloud) {

            res = await ExaminationServices.getDataFromCloud(params)
        } else {

            res = await ExaminationServices.getData(params)
        }
        //console.log("Examination Data ", res)
        if (200 == res.status) {
            console.log("Examination Data procedures", res.data.view.data)
            this.setState({ data: [] })
            let data = [];
            let other_answers = [];

            res.data.view.data.forEach(element => {
                data.push(element.other_answers)
            });
            this.setState({ data: data, loaded: true })
        }


    }

    

    // addButtonSubmit (){
    //     window.alert(this.state.remarkInput);
    //     this.setState(
    //         //this.data[0].remark = this.state.remarkInput
    //     )
    // }

    addValue() {
        let formData = this.state.formData
        formData.examination_data[0].other_answers.answers.push(this.state.tempForm)
        this.setState(
            {
                formData
            }
        )
    }

    render () {
        return (
            <Fragment>
                        {/* form */}
                            <ValidatorForm 
                                onSubmit={() => { this.addValue() }} 
                                className='flex mx-2 mt-4' >
                                <Grid container spacing={2}>
                                    <Grid className='' item="item" lg={3} md={4} sm={4} xs={4}>
                                        <Autocomplete
                                        disableClearable
                                                        className="w-full"
                                                        options={
                                                            appConst.ProcedureData
                                                        }
                                                        onChange={(e, value) => {
                                                            if (null != value) {
                                                                let tempForm = this.state.tempForm
                                                                tempForm.procedureInput = value.value
                                                                this.setState(
                                                                    {
                                                                        tempForm
                                                                    }
                                                                )
                                                            }
                                                        }}
                                                        getOptionLabel={(option) =>
                                                            option.label
                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Procedure"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={
                                                                    this.state
                                                                        .formData
                                                                        .transportMode
                                                                }
                                                                // validators={[
                                                                //     'required',
                                                                // ]}
                                                                // errorMessages={[
                                                                //     'this field is required',
                                                                // ]}
                                                            />
                                                        )}
                                                    />    
                                    </Grid> 
                                    <Grid className='' item="item" lg={7} md={4} sm={4} xs={4}>
                                        {/* <LabeledInput label="Remark" inputType="text" onUpdate={(e)=>this.setState({ remarkInput: e.target.value })} */}
                                          
                                        <TextField
                                            variant='outlined'
                                            placeholder="Remark"
                                            className='w-full'
                                            onChange={(e) => {
                                                let tempForm = this.state.tempForm
                                                    tempForm.remarkInput = e.target.value
                                                    this.setState(
                                                        {
                                                            tempForm
                                                        }
                                                    )
                                            }}
                                            multiline
                                            rows={2}
                                            // maxRows={4}
                                        />     
                                    </Grid>
                                    <Grid className='' item="item" lg={2} md={2} sm={2} xs={2}>
                                        <Button
                                            className='mt-1'
                                            variant="contained"
                                            color="primary"
                                            type= 'submit'
                                        >
                                            Add
                                        </Button>
                                    </Grid>
                                    <Grid className='' item="item" lg={12} md={2} sm={2} xs={2}>
                                        <div className='w-full mt-8' >
                                        <LoonsTable
                                            id={'procedures'}
                                            data={this.state.formData.examination_data[0].other_answers.answers}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: false,
                                                serverSide: true,
                                                print: false,
                                                viewColumns: false,
                                                download: false,
                                            }}
                                        ></LoonsTable>
                                        <div className="flex justify-end mx-20">
                                            <Button
                                                className='mt-6'
                                                variant="contained"
                                                color="primary"
                                                onClick= {() => {this.submit()} }
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                        </div>                        
                                    </Grid> 
                                </Grid>   
                            </ValidatorForm>  
                                 
            </Fragment>
        )
    }
}



export default Procedures