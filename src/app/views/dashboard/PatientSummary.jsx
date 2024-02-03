import { Button } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import { Icon } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { CardTitle, DatePicker, LoonsCard, LoonsTable, MainContainer, SubTitle } from "app/components/LoonsLabComponents";
import localStorageService from "app/services/localStorageService";
import React, { Component, useState } from "react";
import { Fragment } from "react";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import ReactToPrint from "react-to-print";

const styleSheet = (theme) => ({})

class PatientSummary extends Component {
    constructor(props){
        super(props)
        this.state = {
            activeStep: 1,
            diagnosisTableData : [
                    {
                        diagnosis: 'Dengue',
                        duration: '5 days',
                        probable: 'OK',
                        dateOnSet: "05.08.2022",
                    },
                    
                ],
            diagnosisTableColumns : [
                    {
                        name: 'diagnosis', // field name in the row object
                        label: 'Diagnosis', // column title that will be shown in table
                        options: {
                            filter: false,
                            display: true,
                        },
                    },
                    {
                        name: 'duration',
                        label: 'Duration',
                        options: {
                            // filter: true,
                        },
                    },
                    {
                        name: 'probable',
                        label: 'Probable',
                        options: {
                            filter: true,
                            display: true,
                            customBodyRender: (value, tableMeta, updateValue) => {
                                return (
                                    <>
                                        <IconButton
                                            className="text-black"
                                            onClick={null}
                                        >
                                            <Icon>done</Icon>
                                        </IconButton>
                                    </>
                                )
                            },
                        },
                    },
                    {
                        name: 'dateOnSet',
                        label: 'Date On Set',
                        options: {
                            // filter: true,
                        },
                    },
                    {
                        name: 'action',
                        label: 'Action',
                        options: {
                            filter: true,
                            display: true,
                            customBodyRender: (value, tableMeta, updateValue) => {
                                return (
                                    <>
                                        <IconButton
                                            className="text-black"
                                            onClick={null}
                                        >
                                            <Icon>remove_circle_outline_icon</Icon>
                                        </IconButton>
                                    </>
                                )
                            },
                        },
                    },
                ],

            complaintTableData : [
                    {
                        complaint: 'Fever',
                        region: '2 days',
                        duration: '',
                        severity: "",
                    },
                    {
                        complaint: 'Fever',
                        region: '2 days',
                        duration: '',
                        severity: "",
                    },
                    {
                        complaint: 'Fever',
                        region: '2 days',
                        duration: '',
                        severity: "",
                    },
                ],
            complaintTableColumns : [
                    {
                        name: 'complaint', // field name in the row object
                        label: 'Complaint', // column title that will be shown in table
                        options: {
                            filter: false,
                            display: true,
                        },
                    },
                    {
                        name: 'region',
                        label: 'Region',
                        options: {
                            // filter: true,
                        },
                    },
                    {
                        name: 'duration',
                        label: 'Duration',
                        options: {
                            // filter: true,
                        },
                    },
                    {
                        name: 'severity',
                        label: 'Severity',
                        options: {
                            // filter: true,
                        },
                    },
                    {
                        name: 'action',
                        label: 'Action',
                        options: {
                            filter: true,
                            display: true,
                            customBodyRender: (value, tableMeta, updateValue) => {
                                return (
                                    <>
                                        <IconButton
                                            className="text-black"
                                            onClick={null}
                                        >
                                            <Icon>remove_circle_outline_icon</Icon>
                                        </IconButton>
                                    </>
                                )
                            },
                        },
                    },
                ],
            prescriptionTableData : [
                    {
                        drug: 'Co-xxxxx',
                        dosage: '32 mg',
                        frequency: '',
                        duration: 4,
                    },
                    {
                        drug: 'Co-xxxxx',
                        dosage: '32 mg',
                        frequency: '',
                        duration: 4,
                    },
                    {
                        drug: 'Co-xxxxx',
                        dosage: '32 mg',
                        frequency: '',
                        duration: 4,
                    },
                ],
            prescriptionTableColumns : [
                    {
                        name: 'drug', // field name in the row object
                        label: 'Drug', // column title that will be shown in table
                        options: {
                            filter: false,
                            display: true,
                        },
                    },
                    {
                        name: 'dosage',
                        label: 'Dosage',
                        options: {
                            // filter: true,
                        },
                    },
                    {
                        name: 'frequency',
                        label: 'Frequency',
                        options: {
                            // filter: true,
                        },
                    },
                    {
                        name: 'duration',
                        label: 'Duration',
                        options: {
                            // filter: true,
                        },
                    },
                    {
                        name: 'action',
                        label: 'Action',
                        options: {
                            filter: true,
                            display: true,
                            customBodyRender: (value, tableMeta, updateValue) => {
                                return (
                                    <>
                                        <IconButton
                                            className="text-black"
                                            onClick={null}
                                        >
                                            <Icon>remove_circle_outline_icon</Icon>
                                        </IconButton>
                                    </>
                                )
                            },
                        },
                    },
                ],
            
            alert: false,
            message: '',
            severity: 'success',

            patient_pic: null,
            all_district: [],
            all_moh: [],
            all_phm: [],
            all_gn: [],

            loading: false,
            formData: {
                seriesStartNumber: null,
                seriesEndNumber: null,
                itemGroupName: null,
                shortRef: null,
                description: null,
            },
            patientSummary: null,
            inputs: {
                diagnosis: null
            }
        }
    }

    async componentDidMount(){
        let patientSummary = await localStorageService.getItem('patientSummary')
        console.log('patient summary', patientSummary)
        this.setState({
            patientSummary,
            /* patientSummary: patientSummary.diagnosis.map((index) => (
                console.log(index)
            ) ) */
        })
    }

    async submitHandler(){
        let patientSummary = await localStorageService.getItem('patientSummary')
        if(!patientSummary.diagnosis){
            patientSummary.diagnosis = []
        }
        // patientSummary.diagnosis.push()
        console.log("hrtr");

        console.log(this.state);
    }


    render () {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard >
                        <Grid container spacing={2} direction="row">
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <ValidatorForm className="pt-20" >
                                        <div  >
                                            <SubTitle title="Date" />
                                            <DatePicker value={new Date()} className="w-full" name="date" />
                                        </div>
                                        <div>
                                            <SubTitle title="Diagnosis" />
                                                <TextValidator
                                                    className=" w-full"
                                                    name="diagnosis"
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                    onChange= {(e) => this.setState({inputs: e.target.value}) }
                                                /> 
                                        </div>
                                        <div>
                                            <SubTitle title="Problem List" />
                                                <TextValidator
                                                    className=" w-full"
                                                    name="problemList"
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let patientSummary = this.state.patientSummary;
                                                            patientSummary.examination_data[0].problemList = value;
                                                            this.setState({ patientSummary })
                    
                                                        }
                                                    }}
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                /> 
                                        </div>
                                        <div>
                                            <SubTitle title="New Complaints" />
                                                <TextValidator
                                                    className=" w-full"
                                                    name="newComplaints"
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                /> 
                                        </div>
                                        <div>
                                            <SubTitle title="Examination Finding" />
                                                <TextValidator
                                                    className=" w-full"
                                                    name="exFinding"
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                /> 
                                        </div>
                                        <div>
                                            <SubTitle title="New Investigation Result" />
                                                <TextValidator
                                                    className=" w-full"
                                                    name="investigationResult"
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                /> 
                                        </div>
                                        <div>
                                            <SubTitle title="Notes" />
                                                <TextValidator
                                                    className=" w-full"
                                                    name="notes"
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                /> 
                                        </div>
                                        <div>
                                            <SubTitle title="Signature" />
                                                <TextValidator
                                                    className=" w-full"
                                                    name="signature"
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                /> 
                                        </div>
                                        <div className="pt-8 mx-8" >
                                                <Button
                                                    className=''
                                                    variant="contained"
                                                    color="primary"
                                                    onClick= {() => {
                                                        this.submitHandler()
                                                    }}
                                                >
                                                    
                                                    Submit
                                                </Button>
                                            <ReactToPrint
                                                trigger={() => 
                                                // <IconButton>
                                                //     <Icon className="text-body" fontSize="small">
                                                //         print
                                                //     </Icon>
                                                // </IconButton> 
                                                <Button
                                                    className=''
                                                    variant="contained"
                                                    color="primary"
                                                    onClick=' '
                                                >
                                                    <Icon className="mr-2" fontSize="small">
                                                        print
                                                    </Icon>
                                                    Print
                                                </Button>
                                            }
                                                pageStyle=''
                                                documentTitle=''
                                                //removeAfterPrint
                                                content={() => this.componentRef}
                                            />
                                        </div>
                                        </ValidatorForm>
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <div  ref={(el) => (this.componentRef = el)} className="mt-8" >
                                        <h3 className="flex justify-center " >Patient Summary</h3>
                                        <div className="w-full bg-gray px-3 py-2 my-3 " >
                                            <h5>Patient Details</h5>
                                        </div>
                                        <Grid container spacing={2} direction="row">
                                        <Grid className="my-2" item xs={6} sm={6} md={6} lg={6}>
                                                <div>
                                                    <SubTitle title="PHN" />
                                                    <p>{this.state.patientSummary?.patientDetails?.phn} </p>
                                                </div>
                                                <div>
                                                    <SubTitle title="Name" />
                                                    <p>{this.state.patientSummary?.patientDetails?.name} </p>
                                                </div>
                                                <div>
                                                    <SubTitle title="Age" />
                                                        <div className="flex">
                                                            <p className="mr-2">{this.state.patientSummary?.patientDetails?.patient_age.age_years}Y</p> 
                                                            <p className="mr-2">{this.state.patientSummary?.patientDetails?.patient_age.age_months}M </p>
                                                            <p className="mr-2">{this.state.patientSummary?.patientDetails?.patient_age.age_days}D </p>
                                                        </div>
                                                </div>
                                                <div>
                                                <SubTitle title="Gender" />
                                                    <p>{this.state.patientSummary?.patientDetails?.gender} </p>
                                                </div>
                                                <div>
                                                    <SubTitle title="Blood Group" />
                                                    <p></p>
                                                </div>
                                                <div>
                                                <SubTitle title="Tel No." />
                                                    <p>{this.state.patientSummary?.patientDetails?.mobile_no} </p>
                                                </div>
                                        </Grid>
                                        <Grid className="" item xs={6} sm={6} md={6} lg={6}>
                                            <div>
                                                <SubTitle title="Consultant Name" />
                                                <p></p>
                                            </div>
                                            <div>
                                                <SubTitle title="Clinic" />
                                                <p></p>
                                            </div>
                                            <div>
                                                <SubTitle title="Clinic No" />
                                                <p></p>
                                            </div>
                                        </Grid>
                                        </Grid>

                                        <div className="w-full bg-gray px-3 py-2 my-3 " >
                                            <h5>Diagnosis</h5>
                                        </div>
                                        <Grid item xs={12} sm={12} md={12} lg={12}>
                                            <LoonsCard className="mt-3">
                                            {this.state.patientSummary?.diagnosis?.map((item, key) => (
                                                <p>{item} </p>
                                            ))}
                                            </LoonsCard>
                                        </Grid>

                                        <div className="w-full bg-gray px-3 py-2 my-3 " >
                                            <h5>Complaints</h5>
                                        </div>
                                        <Grid item xs={12} sm={12} md={12} lg={12}>
                                            <LoonsCard className="mt-3">
                                            
                                                <div>
                                                   <table className="w-full" >
                                                    <tr className="font-bold" >
                                                        <td>Complaints</td>
                                                        <td>Duration</td>
                                                    </tr>
                                                    {this.state.patientSummary?.complaints?.map((item, key) => (
                                                    <tr>
                                                        <td>{item.complaint}</td>
                                                        <td>{item.duration}</td>
                                                    </tr>
                                                    ))}
                                                   </table>
                                                </div>
                                                
                                                
                                            
                                            </LoonsCard>
                                        </Grid>

                                        <div className="w-full bg-gray px-3 py-2 my-3 " >
                                            <h5>Problem List</h5>
                                        </div>
                                        <Grid item xs={12} sm={12} md={12} lg={12}>
                                            <LoonsCard className="mt-3">
                                            {this.state.patientSummary?.problemList?.map((item, key) => (
                                                <p>{item} </p>
                                            ))}
                                            </LoonsCard>
                                        </Grid>

                                        <div className="w-full bg-gray px-3 py-2 my-3 " >
                                            <h5>Examination Finding</h5>
                                        </div>
                                        <Grid item xs={12} sm={12} md={12} lg={12}>
                                            <LoonsCard className="mt-3">
                                            {this.state.patientSummary?.problemList?.map((item, key) => (
                                                <p>{item} </p>
                                            ))}
                                            </LoonsCard>
                                        </Grid>

                                        <div className="w-full bg-gray px-3 py-2 my-3 " >
                                            <h5>New Investigation Result</h5>
                                        </div>
                                        <Grid item xs={12} sm={12} md={12} lg={12}>
                                            <LoonsCard className="mt-3">
                                            {this.state.patientSummary?.problemList?.map((item, key) => (
                                                <p>{item} </p>
                                            ))}
                                            </LoonsCard>
                                        </Grid>

                                        <div className="w-full bg-gray px-3 py-2 my-3 " >
                                            <h5>Notes</h5>
                                        </div>
                                        <Grid item xs={12} sm={12} md={12} lg={12}>
                                            <LoonsCard className="mt-3">
                                            {this.state.patientSummary?.problemList?.map((item, key) => (
                                                <p>{item} </p>
                                            ))}
                                            </LoonsCard>
                                        </Grid>

                                        
                                        <Grid item xs={12} sm={12} md={3} lg={3}>
                                            <p>Signature</p>
                                            {this.state.patientSummary?.problemList?.map((item, key) => (
                                                <p>{item} </p>
                                            ))}
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={3} lg={3}>
                                            <p>Date</p>
                                            {this.state.patientSummary?.problemList?.map((item, key) => (
                                                <p>{item} </p>
                                            ))}
                                        </Grid>
                                        
                                    </div>
                                </Grid>       
                        </Grid>
                         
                    </LoonsCard>
                    </MainContainer>
            </Fragment>
        )
    }
}

export default PatientSummary

