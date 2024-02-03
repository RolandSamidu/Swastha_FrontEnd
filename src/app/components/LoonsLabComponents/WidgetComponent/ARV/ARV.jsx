import { Checkbox, Dialog, FormControlLabel, Grid, Input, Radio, RadioGroup, Typography } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import React, { Component, Fragment, useState } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents';
import { LoonsTable, Button, LoonsSnackbar } from "app/components/LoonsLabComponents";
import LoonsDatePicker from '../../DatePicker';
import LabeledInput from '../../LabeledInput';
import LoonsCard from '../../LoonsCard';
import MainContainer from '../../MainContainer';
import SubTitle from '../../SubTitle';
import * as appConst from '../../../../../appconst'
import moment from "moment";
import { Autocomplete } from '@material-ui/lab';
import DivisionsServices from 'app/services/DivisionsServices';


class ARV extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: 'Data Added Successfull',
            severity: 'success',
            formData:
            {
                dateOfIncident: null,
                dateOfTreatment: null,
                immunoCompromise: false,
                previousTreatmentDate: null,
                date: null,
                patientCategory: 'newPatient',
                animal: 'strayDog',
                animalVaccination: 'yes',
                typeOfWound: 'superficial',
                categoryOfTheBite: 'minor',
                siteOfTheBite: 'faceHead',
                treatmentType: 'partialTreatment',
                managementCategory: 'ObserveFo14Days',
                IDScheduleCategory: '',
                IDScheduleCategoryLable: '',
                AnimalStatus: 'animalAlive',
                BrainOfAnimal: 'Positive',
                category03: '',
                otherAnimal: '',
                information: '',
                ARV2SiteTwoDosesD0: null,
                ARV2SiteTwoDosesD3: null,
                ARV2SiteD0: null,
                ARV2SiteD3: null,
                ARV2SiteD7: null,
                ARV2SiteD14: null,
                ARV2SiteD30: null,
                ARV_ERIG_ARV2SiteD0: null,
                ARV_ERIG_ARV2SiteD3: null,
                ARV_ERIG_ARV2SiteD7: null,
                ARV_ERIG_ARV2SiteD14: null,
                ARV_ERIG_ARV2SiteD30: null,
                ARVModified4SiteSingleDoseD0: null,
                IMScheduleCategory: null,
                IMSingleDoseDate: null,
                category2WithoutRIGD0: null,
                category2WithoutRIGD7: null,
                category2WithoutRIGD21: null,
                category3D0: null,
                category3D3: null,
                category3D7: null,
                category3D14: null,
                category3D30: null,
                moh_id: null,
            },
            all_moh: [],
            all_phm: [],
            all_gn: [],

            tableColumns: [

                {
                    name: 'day', // field name in the row object
                    label: 'Day', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    }
                },
                {
                    name: 'modified2SitedID',
                    label: 'Modified 2 Sited ID',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'year',
                    label: 'Date/Year',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'orderingDoctor',
                    label: 'Ordering Doctor',
                    options: {
                        // filter: true,
                    },
                },

            ],
            tableData: [

            ],
            remarksDialog: true,
        }
    }

    submit() {
        this.setState({
            alert: true,
            message: 'Data Added Successful',
            severity: 'success',
        })
    }

    async loadData() {

        let district_res = await DivisionsServices.getAllDistrict({
            limit: 99999,
        })
        if (district_res.status == 200) {
            console.log('district', district_res.data.view.data)
            this.setState({
                all_district: district_res.data.view.data,
            })
        }

        let moh_res = await DivisionsServices.getAllMOH({ limit: 99999 })
        if (moh_res.status == 200) {
            console.log('moh', moh_res.data.view.data)
            this.setState({
                all_moh: moh_res.data.view.data,
            })
        }

        let phm_res = await DivisionsServices.getAllPHM({ limit: 99999 })
        if (phm_res.status == 200) {
            console.log('phm', phm_res.data.view.data)
            this.setState({
                all_phm: phm_res.data.view.data,
            })
        }

        let gn_res = await DivisionsServices.getAllGN({ limit: 99999 })
        if (gn_res.status == 200) {
            console.log('gn', gn_res.data.view.data)
            this.setState({
                all_gn: gn_res.data.view.data,
            })
        }



        // let params_ward = { issuance_type: 'Hospital' }
        // let hospitals = await DashboardServices.getAllHospitals(params_ward);
        // if (hospitals.status == 200) {
        //     console.log("all_hospitals", hospitals.data.view.data)
        //     this.setState({ all_hospitals: hospitals.data.view.data })
        // }
        //function for load initial data from backend or other resources
        /* let id = this.props.match.params.id;
        let params = { patient_id: id, checktype: 'snap' }
        let res = await PatientServices.getPatientInfo(params)
        if (res.status) {
            console.log("all uoms", res.data.view.data)
            if (res.data.view.data.length != 0) {
                this.setState({
                    data: res.data.view.data,
                    loaded: true,
                    totalItems: res.data.view.totalItems,
                    totalPages: res.data.view.totalPages
                })
            } else {
                this.setState({
                    loaded: true,
                })
            }
        } */
    }

    async componentDidMount() {

        // this.loadFrontDesk()
        this.loadData()
        // this.getAllClinics()

        //this.searchPatients()
    }
    

    render() {
        return (
            <Fragment>
                <MainContainer>

                    <Typography className="font-semibold" variant="h5" >Anti-Rabies Post Exposure Therapy</Typography>

                    {/* Patient Category */}
                    <div className='flex justify-between py-4' >
                        <Typography className="text-[8px]" variant="h6" >Patient Category</Typography>
                        <RadioGroup defaultValue={this.state.formData.patientCategory} row>
                            <FormControlLabel
                                label={"New Patient Registration"}
                                name="newPatient"
                                value='newPatient'
                                onChange={() => {
                                    let formData = this.state.formData;
                                    formData.patientCategory = 'newPatient';
                                    this.setState({ formData })
                                }}
                                control={
                                    <Radio size='small' color="primary" />
                                }
                                display="inline"
                            // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                            />
                            <FormControlLabel
                                label={"Continuation Patient Registration"}
                                name="continuation"
                                value='continuationPatient'
                                onChange={() => {
                                    let formData = this.state.formData;
                                    formData.patientCategory = 'continuationPatient';
                                    this.setState({ formData })
                                }}
                                control={
                                    <Radio size='small' color="primary" />
                                }
                                display="inline"
                            // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                            />
                        </RadioGroup>
                        <FormControlLabel
                            // key={i}
                            label='Immuno Compromise'
                            name='Immuno Compromise'
                            value={false}
                            onChange={() => {
                                let formData = this.state.formData;
                                formData.immunoCompromise = !formData.immunoCompromise
                                this.setState(
                                    formData
                                )
                            }}
                            control={
                                <Checkbox
                                    color="primary"
                                    // checked={field.displayInSmallView}
                                    size="small"
                                />
                            }
                            display="inline"
                        />
                        <FormControlLabel
                            // key={i}
                            label='Foreigner'
                            //name={field.}
                            //value={val.value}
                            // onChange={() => {
                            //     this.handleVisibilityOfField(this.state.editingWidget, field)
                            // }}
                            control={
                                <Checkbox
                                    color="primary"
                                    // checked={field.displayInSmallView}
                                    size="small"
                                />
                            }
                            display="inline"
                        />
                    </div>

                    {/* Registration Number */}
                    <div className='flex justify-between py-4' >
                        <div className="flex">
                            <p className='mx-2' >Registration No :</p>
                            <ValidatorForm>
                                <TextValidator
                                    className=" w-full"
                                    placeholder=""
                                    name="registrationNo"
                                    // InputLabelProps={{ shrink: false }}

                                    // value={"it"}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {

                                        let formData = this.state.formData;
                                        formData.registrationNo = e.target.value
                                        this.setState({ formData })


                                    }}
                                /* validators={['required']}
                                errorMessages={[
                                    'this field is required',
                                ]} */
                                />
                            </ValidatorForm>
                        </div>
                        <div className='flex' >
                            <SubTitle title="Date of Incident" />
                            <LoonsDatePicker className="w-full"
                                value={this.state.formData.dateOfIncident}
                                placeholder=""
                                // minDate={new Date()}

                                //maxDate={new Date()}
                                required={true}
                                // disabled={this.state.date_selection}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let formData = this.state.formData
                                    formData.dateOfIncident = date
                                    this.setState({ formData })
                                }}
                                format='dd/MM/yyyy'
                            />
                        </div>
                        <div className='flex' >
                            <SubTitle title="Date of Treatment" />
                            <LoonsDatePicker className="w-full"
                                value={this.state.formData.dateOfTreatment}
                                placeholder=""
                                // minDate={new Date()}

                                //maxDate={new Date()}
                                // required={!this.state.date_selection}
                                // disabled={this.state.date_selection}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let formData = this.state.formData
                                    formData.dateOfTreatment = date
                                    this.setState({ formData })
                                }}
                                format='dd/MM/yyyy'
                            />
                        </div>
                    </div>

                    {/* Animal */}
                    <Grid className='pt-4' container="container" spacing={2}>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <Typography className="" variant="h6" >Animal</Typography>
                        </Grid>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <RadioGroup defaultValue={this.state.formData.animal} row>
                                {appConst.animal.map((data, i) =>
                                    <Grid item="item" lg={2} md={2} sm={4} xs={6}>
                                        <FormControlLabel
                                            label={data.label}
                                            name={data.value}
                                            value={data.value}
                                            onChange={() => {
                                                let formData = this.state.formData;
                                                formData.animal = data.value;
                                                this.setState({ formData })
                                            }}
                                            control={
                                                <Radio size='small' color="primary" />
                                            }
                                            display="inline"
                                        // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                        />
                                    </Grid>
                                )}
                            </RadioGroup>
                        </Grid>
                        { this.state.formData.animal == 'other' ? 
                            <Grid item="item" lg={6} md={12} sm={12} xs={12}>
                            <ValidatorForm>
                                <TextValidator
                                    className=" w-full"
                                    placeholder=""
                                    name="otherAnimal"
                                    // InputLabelProps={{ shrink: false }}

                                    // value={"it"}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {

                                        let formData = this.state.formData;
                                        formData.otherAnimal = e.target.value
                                        this.setState({ formData })


                                    }}
                                /* validators={['required']}
                                errorMessages={[
                                    'this field is required',
                                ]} */
                                />
                            </ValidatorForm>
                        </Grid>
                        : null
                        }
                        


                    </Grid>

                    { this.state.formData.animal == 'strayDog' || this.state.formData.animal == 'strayCat' || this.state.formData.animal == 'domesticDog' || this.state.formData.animal == 'domesticCat' ? 
                        <Grid className='pt-4' container="container" spacing={2}>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <Typography className="" variant="h6" >Animal Vaccinated</Typography>
                        </Grid>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <RadioGroup defaultValue={this.state.formData.animalVaccination} row>
                                {appConst.animalVaccinated.map((data, i) =>
                                    <Grid item="item" lg={2} md={2} sm={4} xs={6}>
                                        <FormControlLabel
                                            label={data.label}
                                            name={data.value}
                                            value={data.value}
                                            onChange={() => {
                                                let formData = this.state.formData;
                                                formData.animalVaccination = data.value;
                                                this.setState({ formData })
                                            }}
                                            control={
                                                <Radio size='small' color="primary" />
                                            }
                                            display="inline"
                                        // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                        />
                                    </Grid>
                                )}
                            </RadioGroup>
                        </Grid>
                        </Grid>
                        : null
                    }
                    

                    {/* Site of the Bite */}
                    <Grid className='pt-4' container="container" spacing={2}>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <Typography className="" variant="h6" >Site of the Bite</Typography>
                        </Grid>
                        {appConst.siteOfTheBite.map((data, i) =>
                            <Grid item="item" lg={2} md={2} sm={4} xs={6}>
                                <FormControlLabel
                                    // key={i}
                                    label={data.label}
                                    name={data.value}
                                    value={data.value}
                                    // onChange={() => {
                                    //     this.handleVisibilityOfField(this.state.editingWidget, field)
                                    // }}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            // checked={field.displayInSmallView}
                                            size="small"
                                        />
                                    }
                                    display="inline"
                                />
                            </Grid>
                        )}
                    </Grid>

                    {/* Type of Wound */}
                    <Grid className='pt-4' container="container" spacing={2}>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <Typography className="" variant="h6" >Type of Wound</Typography>
                        </Grid>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <RadioGroup defaultValue={this.state.formData.typeOfWound} row>
                                {appConst.typeOfWound.map((data, i) =>
                                    <Grid item="item" lg={2} md={2} sm={4} xs={6}>
                                        <FormControlLabel
                                            label={data.label}
                                            name={data.value}
                                            value={data.value}
                                            onChange={() => {
                                                let formData = this.state.formData;
                                                formData.typeOfWound = data.value;
                                                this.setState({ formData })
                                            }}
                                            control={
                                                <Radio size='small' color="primary" />
                                            }
                                            display="inline"
                                        // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                        />
                                    </Grid>
                                )}
                            </RadioGroup>
                        </Grid>
                    </Grid>

                    {/* Category of Bite */}
                    <Grid className='pt-4' container="container" spacing={2}>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <Typography className="" variant="h6" >Category of Bite (exposure)</Typography>
                        </Grid>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <RadioGroup defaultValue={this.state.formData.categoryOfTheBite} row>
                                {appConst.categoryOfTheBite.map((data, i) =>
                                    <Grid item="item" lg={2} md={2} sm={4} xs={6}>
                                        <FormControlLabel
                                            label={data.label}
                                            name={data.value}
                                            value={data.value}
                                            onChange={() => {
                                                let formData = this.state.formData;
                                                formData.categoryOfTheBite = data.value;
                                                this.setState({ formData })
                                            }}
                                            control={
                                                <Radio size='small' color="primary" />
                                            }
                                            display="inline"
                                        // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                        />
                                    </Grid>
                                )}
                            </RadioGroup>
                        </Grid>
                    </Grid>

                    {/* Address Bar */}
                    <Grid className='pt-4 flex' container="container" spacing={2}>
                        <Grid className='' item="item" lg={6} md={12} sm={12} xs={12}>
                            <Typography className="" variant="h6" >Address of the owner/Location of the Animal</Typography>
                            <ValidatorForm>
                                <TextValidator
                                    className=" w-full"

                                    placeholder="Address"
                                    name="address"
                                    // InputLabelProps={{ shrink: false }}

                                    // value={"it"}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {

                                        // let formData = this.state.formData;
                                        // formData.examination_data[0].answer = e.target.value
                                        // this.setState({ formData })


                                    }}
                                /* validators={['required']}
                                errorMessages={[
                                    'this field is required',
                                ]} */
                                />
                            </ValidatorForm>
                        </Grid>
                        <div className='w-full pt-4' >
                            <ValidatorForm className='flex mx-2' >
                                <Grid className='mr-4' item="item" lg={12} md={12} sm={3} xs={12}>
                                <SubTitle title="MOH Division" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        this.state.all_moh
                                                    }
                                                    onChange={(
                                                        e,
                                                        value
                                                    ) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData
                                                            formData.moh_id =
                                                                value.id
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }
                                                    }}

                                                    value={{
                                                        name: this.state.formData.moh_id ? (this.state.all_moh.find((obj) => obj.id == this.state.formData.moh_id).name) : null,
                                                        id: this.state.formData.moh_id
                                                    }}

                                                    getOptionLabel={(
                                                        option
                                                    ) =>
                                                        option.name
                                                            ? option.name
                                                            : ''
                                                    }
                                                    renderInput={(
                                                        params
                                                    ) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="MOH Division"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                </Grid>
                                <Grid className='mr-4' item="item" lg={12} md={3} sm={3} xs={12}>
                                <SubTitle title="PHM Division" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        this.state.all_phm
                                                    }
                                                    onChange={(
                                                        e,
                                                        value
                                                    ) => {
                                                        if (value != null) {
                                                            let formData =
                                                                this.state
                                                                    .formData
                                                            formData.phm_id =
                                                                value.id
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }
                                                    }}
                                                    value={{
                                                        name: this.state.formData.phm_id ? (this.state.all_phm.find((obj) => obj.id == this.state.formData.phm_id).name) : null,
                                                        id: this.state.formData.phm_id
                                                    }}

                                                    getOptionLabel={(
                                                        option
                                                    ) =>
                                                        option.name
                                                            ? option.name
                                                            : ''
                                                    }
                                                    renderInput={(
                                                        params
                                                    ) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="PHM Division"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                </Grid>
                                <Grid className='' item="item" lg={12} md={3} sm={3} xs={12}>
                                <SubTitle title="GN Division" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        this.state.all_gn
                                                    }
                                                    onChange={(
                                                        e,
                                                        value
                                                    ) => {
                                                        if (value != null) {
                                                            let formData =
                                                                this.state
                                                                    .formData
                                                            formData.gn_id =
                                                                value.id
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }
                                                    }}
                                                    value={{
                                                        name: this.state.formData.gn_id ? (this.state.all_gn.find((obj) => obj.id == this.state.formData.gn_id).name) : null,
                                                        id: this.state.formData.gn_id
                                                    }}

                                                    getOptionLabel={(
                                                        option
                                                    ) =>
                                                        option.name
                                                            ? option.name
                                                            : ''
                                                    }
                                                    renderInput={(
                                                        params
                                                    ) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="GN Division"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                </Grid>
                            </ValidatorForm>
                        </div>
                    </Grid>

                    {/* Any Other Information */}
                    <Grid className='pt-4 flex' container="container" spacing={2}>
                        <Grid className='' item="item" lg={12} md={12} sm={12} xs={12}>
                            <Typography className="" variant="h6" >Other Relevant Information</Typography>
                            <SubTitle title='Any Other Information'/>
                            <ValidatorForm>
                                <TextValidator
                                    className=" w-full"

                                    placeholder=""
                                    name="information"
                                    // InputLabelProps={{ shrink: false }}

                                    // value={"it"}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {

                                        let formData = this.state.formData;
                                        formData.information = e.target.value
                                        this.setState({ formData })


                                    }}
                                /* validators={['required']}
                                errorMessages={[
                                    'this field is required',
                                ]} */
                                />
                            </ValidatorForm>
                        </Grid>
                    </Grid>

                    <Typography className="font-semibold pt-8" variant="h5" >History of Previous Rabies Treatment</Typography>
                    {/* Patient Category */}
                    <div className='flex justify-between py-4' >
                        <div className='flex' >
                            <SubTitle title="Previous Treatment Date" />
                            <LoonsDatePicker className="w-full"
                                value={this.state.formData.previousTreatmentDate}
                                placeholder=""
                                // minDate={new Date()}

                                //maxDate={new Date()}
                                required={true}
                                // disabled={this.state.date_selection}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let formData = this.state.formData;
                                    formData.previousTreatmentDate = date;
                                    this.setState({ formData })
                                }}
                                format='dd/MM/yyyy'
                            />
                        </div>
                        <RadioGroup defaultValue={this.state.formData.treatmentType} row>
                            <p className='mx-8 text-[20px]' >Treatment Type</p>
                            <FormControlLabel
                                label={"Partial Treatment"}
                                name="partialTreatment"
                                value='partialTreatment'
                                onChange={() => {
                                    let formData = this.state.formData;
                                    formData.treatmentType = 'partialTreatment';
                                    this.setState({ formData })
                                }}
                                control={
                                    <Radio size='small' color="primary" />
                                }
                                display="inline"
                            // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                            />
                            <FormControlLabel
                                label={"Full course of vaccination"}
                                name="fullCourseOfVaccination"
                                value='fullCourseOfVaccination'
                                onChange={() => {
                                    let formData = this.state.formData;
                                    formData.treatmentType = 'fullCourseOfVaccination';
                                    this.setState({ formData })
                                }}
                                control={
                                    <Radio size='small' color="primary" />
                                }
                                display="inline"
                            // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                            />
                        </RadioGroup>
                    </div>

                    {/* Management Category */}
                    <Grid className='pt-4' container="container" spacing={2}>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <Typography className="" variant="h6" >Management Category</Typography>
                        </Grid>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <RadioGroup defaultValue={this.state.formData.managementCategory} row>
                                {appConst.managementCategory.map((data, i) =>
                                    <Grid item="item" lg={2} md={2} sm={4} xs={6}>
                                        <FormControlLabel
                                            label={data.label}
                                            name={data.value}
                                            value={data.value}
                                            onChange={() => {
                                                let formData = this.state.formData;
                                                formData.managementCategory = data.value;
                                                this.setState({ formData })
                                            }}
                                            control={
                                                <Radio size='small' color="primary" />
                                            }
                                            display="inline"
                                        // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                        />
                                    </Grid>
                                )}
                            </RadioGroup>
                        </Grid>

                    </Grid>

                    {/* Category 03 (Rabies Immunoglobulin) */}
                    {
                        this.state.formData.IDScheduleCategory == "ARV(ERIG)+ARV2Site(ID)" ?
                            <Grid className='pt-4' container="container" spacing={2}>
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    <Typography className="" variant="h6" >Category 03 (Rabies Immunoglobulin)</Typography>
                                </Grid>
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    <RadioGroup row>
                                            <Grid item="item" lg={2} md={2} sm={4} xs={6}>
                                                <FormControlLabel
                                                    label={appConst.category03[1].label}
                                                    name={appConst.category03[1].value}
                                                    value={appConst.category03[1].value}
                                                    onChange={() => {
                                                        let formData = this.state.formData;
                                                        formData.category03 = appConst.category03[1].value;
                                                        this.setState({ formData })
                                                    }}
                                                    control={
                                                        <Radio size='small' color="primary" />
                                                    }
                                                    display="inline"
                                                // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                />
                                            </Grid>
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                            : null
                    }

                    { this.state.formData.IDScheduleCategory == "ARV(HRIG)+ARV2Site(ID)" ?
                            <Grid className='pt-4' container="container" spacing={2}>
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    <Typography className="" variant="h6" >Category 03 (Rabies Immunoglobulin)</Typography>
                                </Grid>
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    <RadioGroup row>
                                    <Grid item="item" lg={2} md={2} sm={4} xs={6}>
                                                <FormControlLabel
                                                    label={appConst.category03[0].label}
                                                    name={appConst.category03[0].value}
                                                    value={appConst.category03[0].value}
                                                    onChange={() => {
                                                        let formData = this.state.formData;
                                                        formData.category03 = appConst.category03[0].value;
                                                        this.setState({ formData })
                                                    }}
                                                    control={
                                                        <Radio size='small' color="primary" />
                                                    }
                                                    display="inline"
                                                // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                />
                                            </Grid>
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                            : null
                    }

                    { this.state.formData.managementCategory == 'IDSchedule' ?
                        // {/* ID Schedule Category */}
                    <Grid className='pt-4' container="container" spacing={2}>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <Typography className="" variant="h6" >ID Schedule Category</Typography>
                        </Grid>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <RadioGroup
                            // defaultValue={this.state.formData.IDScheduleCategory} 
                            row>
                            {appConst.IDScheduleCategory.map((data, i) =>
                                <Grid item="item" lg={2} md={2} sm={4} xs={6}>
                                    <FormControlLabel
                                        label={data.label}
                                        name={data.value}
                                        value={data.value}
                                        onChange={() => {
                                            let formData = this.state.formData;
                                            formData.IDScheduleCategory = data.value;
                                            //console.log(data.label);
                                            formData.IDScheduleCategoryLable = data.label;
                                            this.setState({ formData })
                                        }}
                                        control={
                                            <Radio size='small' color="primary" />
                                        }
                                        display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                    />
                                </Grid>
                            )}
                        </RadioGroup>
                    </Grid>

                    </Grid>
                    : null
                    }

                    { this.state.formData.managementCategory == 'IDSchedule' ?
                        // {/* ARV Modified 4 Site Single Dose (ID) */}
                    <Grid className='pt-4' container="container" spacing={2}>
                    {this.state.formData.IDScheduleCategoryLable != '' ?
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            <Typography className="" variant="h6" >{this.state.formData.IDScheduleCategoryLable} Schedule</Typography>
                        </Grid>
                        : null
                    }

                    {
                        this.state.formData.IDScheduleCategory == "ARV2SiteTwoDoses(ID)" ?
                            <Grid className='pt-4' container="container" spacing={2}>
                                {/* Heading Row */}
                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                    <p>Day</p>
                                </Grid>
                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                    <p>2 Sited ID</p>
                                </Grid>
                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                    <p>Date/Year</p>
                                </Grid>
                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                    <p>Ordering Doctor</p>
                                </Grid>

                                {/* 1st Row */}
                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                    <p>D0</p>
                                </Grid>
                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                    <p>2 Doses</p>
                                </Grid>
                                <Grid className='pr-2' item="item" lg={3} md={3} sm={3} xs={3}>
                                    <LoonsDatePicker className="w-full"
                                        value={this.state.formData.ARV2SiteTwoDosesD0}
                                        placeholder=""
                                        // minDate={new Date()}

                                        //maxDate={new Date()}
                                        required={true}
                                        // disabled={this.state.date_selection}
                                        errorMessages="this field is required"
                                        onChange={(date) => {
                                            let formData = this.state.formData;
                                            formData.ARV2SiteTwoDosesD0 = date;
                                            formData.ARV2SiteTwoDosesD3 = moment(date).add(3, 'days')
                                            this.setState({ formData })
                                        }}
                                        format='dd/MM/yyyy'
                                    />
                                </Grid>
                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                    <p>OPDDOC</p>
                                </Grid>

                                {/* 2nd Row */}
                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                    <p>D3</p>
                                </Grid>
                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                    <p>2 Doses</p>
                                </Grid>
                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                    <LoonsDatePicker className="w-full"
                                        value={this.state.formData.ARV2SiteTwoDosesD3}
                                        placeholder=""
                                        // minDate={new Date()}

                                        //maxDate={new Date()}
                                        required={true}
                                        // disabled={this.state.date_selection}
                                        errorMessages="this field is required"
                                        onChange={(date) => {
                                            let formData = this.state.formData;
                                            formData.ARV2SiteTwoDosesD3 = date;
                                            this.setState({ formData })
                                        }}
                                        format='dd/MM/yyyy'
                                    />
                                </Grid>
                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                    <p>OPDDOC</p>
                                </Grid>
                            </Grid>
                            : this.state.formData.IDScheduleCategory == "ARV2Site(ID)" ?
                                <Grid className='pt-4' container="container" spacing={2}>
                                    {/* Heading Row */}
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>Day</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>2 Sited ID</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>Date/Year</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>Ordering Doctor</p>
                                    </Grid>

                                    {/* 1st Row */}
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>D0</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>2 Doses</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.ARV2SiteD0}
                                            placeholder=""
                                            // minDate={new Date()}

                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.ARV2SiteD0 = date;
                                                formData.ARV2SiteD3 = moment(date).add(3, 'days')
                                                formData.ARV2SiteD7 = moment(date).add(7, 'days')
                                                formData.ARV2SiteD14 = moment(date).add(14, 'days')
                                                formData.ARV2SiteD30 = moment(date).add(30, 'days')
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>OPDDOC</p>
                                    </Grid>

                                    {/* 2nd Row */}
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>D3</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>2 Doses</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.ARV2SiteD3}
                                            placeholder=""
                                            // minDate={new Date()}

                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.ARV2SiteD3 = date;
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>OPDDOC</p>
                                    </Grid>

                                    {/* 3rd Row */}
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>D7</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>2 Doses</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.ARV2SiteD7}
                                            placeholder=""
                                            // minDate={new Date()}

                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.ARV2SiteD7 = date;
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>OPDDOC</p>
                                    </Grid>

                                    {/* 4th Row */}
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>D14</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <div className="flex">
                                            <RadioGroup defaultValue={this.state.formData.AnimalStatus} row>
                                                <FormControlLabel
                                                    label="Animal Alive"
                                                    name='animalAlive'
                                                    value='animalAlive'
                                                    onChange={() => {
                                                        let formData = this.state.formData;
                                                        formData.AnimalStatus = 'animalAlive';
                                                        this.setState({ formData })
                                                    }}
                                                    control={
                                                        <Radio size='small' color="primary" />
                                                    }
                                                    display="inline"
                                                // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                />
                                                <FormControlLabel
                                                    label="Animal Died"
                                                    name='animalDied'
                                                    value='animalDied'
                                                    onChange={() => {
                                                        let formData = this.state.formData;
                                                        formData.AnimalStatus = 'animalDied';
                                                        this.setState({ formData })
                                                    }}
                                                    control={
                                                        <Radio size='small' color="primary" />
                                                    }
                                                    display="inline"
                                                // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                />
                                            </RadioGroup>
                                        </div>
                                        <div className='flex px-2 ' >
                                            <p className='font-bold mr-2' >Date</p>
                                            <LoonsDatePicker className="w-full"
                                                value={this.state.formData.ARV2SiteD14}
                                                placeholder=""
                                                // minDate={new Date()}

                                                //maxDate={new Date()}
                                                required={true}
                                                // disabled={this.state.date_selection}
                                                errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let formData = this.state.formData;
                                                    formData.ARV2SiteD14 = date;
                                                    this.setState({ formData })
                                                }}
                                                format='dd/MM/yyyy'
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <div className='w-full px-2' >
                                            <p className='font-bold' >Brain of Animal for Rabies</p>
                                            <div>
                                                <RadioGroup defaultValue={this.state.formData.BrainOfAnimal} row>
                                                    <FormControlLabel
                                                        label="Positive"
                                                        name='positive'
                                                        value='Positive'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.BrainOfAnimal = 'Positive';
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                    // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                    />
                                                    <FormControlLabel
                                                        label="Negative"
                                                        name='negative'
                                                        value='Negative'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.BrainOfAnimal = 'Negative';
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                    // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                    />
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>OPDDOC</p>
                                    </Grid>

                                    {/* 5th Row */}
                                    { this.state.formData.AnimalStatus == 'animalDied' ? 
                                        <Grid spacing={2} className='flex' item="item" lg={12} md={12} sm={12} xs={12}>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>D30</p>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>2 Doses</p>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <LoonsDatePicker className="w-full"
                                                value={this.state.formData.ARV2SiteD30}
                                                placeholder=""
                                                // minDate={new Date()}

                                                //maxDate={new Date()}
                                                required={true}
                                                // disabled={this.state.date_selection}
                                                errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let formData = this.state.formData;
                                                    formData.ARV2SiteD30 = date;
                                                    this.setState({ formData })
                                                }}
                                                format='dd/MM/yyyy'
                                            />
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p className='ml-2' >OPDDOC</p>
                                        </Grid>
                                    </Grid>
                                    : null
                                    }
                                    
                                </Grid>
                                : this.state.formData.IDScheduleCategory == "ARV(ERIG)+ARV2Site(ID)" ?
                                    <Grid className='pt-4' container="container" spacing={2}>
                                        {/* Heading Row */}
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>Day</p>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>2 Sited ID</p>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>Date/Year</p>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>Ordering Doctor</p>
                                        </Grid>

                                        {/* 1st Row */}
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>D0</p>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>2 Doses</p>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <LoonsDatePicker className="w-full"
                                                value={this.state.formData.ARV_ERIG_ARV2SiteD0}
                                                placeholder=""
                                                // minDate={new Date()}

                                                //maxDate={new Date()}
                                                required={true}
                                                // disabled={this.state.date_selection}
                                                errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let formData = this.state.formData;
                                                    formData.ARV_ERIG_ARV2SiteD0 = date;
                                                    formData.ARV_ERIG_ARV2SiteD3 = moment(date).add(3, 'days')
                                                    formData.ARV_ERIG_ARV2SiteD7 = moment(date).add(7, 'days')
                                                    formData.ARV_ERIG_ARV2SiteD14 = moment(date).add(14, 'days')
                                                    formData.ARV_ERIG_ARV2SiteD30 = moment(date).add(30, 'days')
                                                    this.setState({ formData })
                                                }}
                                                format='dd/MM/yyyy'
                                            />
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>OPDDOC</p>
                                        </Grid>

                                        {/* 2nd Row */}
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>D3</p>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>2 Doses</p>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <LoonsDatePicker className="w-full"
                                                value={this.state.formData.ARV_ERIG_ARV2SiteD3}
                                                placeholder=""
                                                // minDate={new Date()}

                                                //maxDate={new Date()}
                                                required={true}
                                                // disabled={this.state.date_selection}
                                                errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let formData = this.state.formData;
                                                    formData.ARV_ERIG_ARV2SiteD3 = date;
                                                    this.setState({ formData })
                                                }}
                                                format='dd/MM/yyyy'
                                            />
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>OPDDOC</p>
                                        </Grid>

                                        {/* 3rd Row */}
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>D7</p>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>2 Doses</p>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <LoonsDatePicker className="w-full"
                                                value={this.state.formData.ARV_ERIG_ARV2SiteD7}
                                                placeholder=""
                                                // minDate={new Date()}

                                                //maxDate={new Date()}
                                                required={true}
                                                // disabled={this.state.date_selection}
                                                errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let formData = this.state.formData;
                                                    formData.ARV_ERIG_ARV2SiteD7 = date;
                                                    this.setState({ formData })
                                                }}
                                                format='dd/MM/yyyy'
                                            />
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>OPDDOC</p>
                                        </Grid>

                                        {/* 4th Row */}
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>D14</p>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <div className="flex">
                                                <RadioGroup defaultValue={this.state.formData.AnimalStatus} row>
                                                    <FormControlLabel
                                                        label="Animal Alive"
                                                        name='animalAlive'
                                                        value='animalAlive'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.AnimalStatus = 'animalAlive';
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                    // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                    />
                                                    <FormControlLabel
                                                        label="Animal Died"
                                                        name='animalDied'
                                                        value='animalDied'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.AnimalStatus = 'animalDied';
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                    // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                    />
                                                </RadioGroup>
                                            </div>
                                            <div className='flex px-2 ' >
                                                <p className='font-bold mr-2' >Date</p>
                                                <LoonsDatePicker className="w-full"
                                                    value={this.state.formData.ARV_ERIG_ARV2SiteD14}
                                                    placeholder=""
                                                    // minDate={new Date()}

                                                    //maxDate={new Date()}
                                                    required={true}
                                                    // disabled={this.state.date_selection}
                                                    errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let formData = this.state.formData;
                                                        formData.ARV_ERIG_ARV2SiteD14 = date;
                                                        this.setState({ formData })
                                                    }}
                                                    format='dd/MM/yyyy'
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <div className='w-full px-2' >
                                                <p className='font-bold' >Brain of Animal for Rabies</p>
                                                <div>
                                                    <RadioGroup defaultValue={this.state.formData.BrainOfAnimal} row>
                                                        <FormControlLabel
                                                            label="Positive"
                                                            name='positive'
                                                            value='Positive'
                                                            onChange={() => {
                                                                let formData = this.state.formData;
                                                                formData.BrainOfAnimal = 'Positive';
                                                                this.setState({ formData })
                                                            }}
                                                            control={
                                                                <Radio size='small' color="primary" />
                                                            }
                                                            display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                        />
                                                        <FormControlLabel
                                                            label="Negative"
                                                            name='negative'
                                                            value='Negative'
                                                            onChange={() => {
                                                                let formData = this.state.formData;
                                                                formData.BrainOfAnimal = 'Negative';
                                                                this.setState({ formData })
                                                            }}
                                                            control={
                                                                <Radio size='small' color="primary" />
                                                            }
                                                            display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                        />
                                                    </RadioGroup>
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>OPDDOC</p>
                                        </Grid>

                                        {/* 5th Row */}
                                        { this.state.formData.AnimalStatus == 'animalDied' ? 
                                            <Grid className='flex' item="item" lg={12} md={12} sm={12} xs={12}>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>D30</p>
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>2 Doses</p>
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <LoonsDatePicker className="w-full"
                                                    value={this.state.formData.ARV_ERIG_ARV2SiteD30}
                                                    placeholder=""
                                                    // minDate={new Date()}

                                                    //maxDate={new Date()}
                                                    required={true}
                                                    // disabled={this.state.date_selection}
                                                    errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let formData = this.state.formData;
                                                        formData.ARV_ERIG_ARV2SiteD30 = date;
                                                        this.setState({ formData })
                                                    }}
                                                    format='dd/MM/yyyy'
                                                />
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p className='ml-4' >OPDDOC</p>
                                            </Grid>
                                            </Grid>
                                            :null
                                        }
                                        <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                            <p>Admit Patient for Further Treatments</p>
                                        </Grid>
                                        <Grid item="item" lg={6} md={6} sm={6} xs={6}>
                                            <Button
                                                className='mt-2'
                                                // progress={false}
                                                // type="submit"
                                                // scrollToTop={false}
                                                // startIcon="save"
                                                // onClick={() => { this.submit() }}
                                            >
                                                <span className="capitalize">Admission</span>
                                            </Button>
                                        </Grid>   
                                    </Grid>
                                    : this.state.formData.IDScheduleCategory == "ARV(HRIG)+ARV2Site(ID)" ?
                                    <Grid className='pt-4' container="container" spacing={2}>
                                    {/* Heading Row */}
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>Day</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>2 Sited ID</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>Date/Year</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>Ordering Doctor</p>
                                    </Grid>

                                    {/* 1st Row */}
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>D0</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>2 Doses</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.ARV_ERIG_ARV2SiteD0}
                                            placeholder=""
                                            // minDate={new Date()}

                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.ARV_ERIG_ARV2SiteD0 = date;
                                                formData.ARV_ERIG_ARV2SiteD3 = moment(date).add(3, 'days')
                                                formData.ARV_ERIG_ARV2SiteD7 = moment(date).add(7, 'days')
                                                formData.ARV_ERIG_ARV2SiteD14 = moment(date).add(14, 'days')
                                                formData.ARV_ERIG_ARV2SiteD30 = moment(date).add(30, 'days')
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>OPDDOC</p>
                                    </Grid>

                                    {/* 2nd Row */}
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>D3</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>2 Doses</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.ARV_ERIG_ARV2SiteD3}
                                            placeholder=""
                                            // minDate={new Date()}

                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.ARV_ERIG_ARV2SiteD3 = date;
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>OPDDOC</p>
                                    </Grid>

                                    {/* 3rd Row */}
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>D7</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>2 Doses</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.ARV_ERIG_ARV2SiteD7}
                                            placeholder=""
                                            // minDate={new Date()}

                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.ARV_ERIG_ARV2SiteD7 = date;
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>OPDDOC</p>
                                    </Grid>

                                    {/* 4th Row */}
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>D14</p>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <div className="flex">
                                            <RadioGroup defaultValue={this.state.formData.AnimalStatus} row>
                                                <FormControlLabel
                                                    label="Animal Alive"
                                                    name='animalAlive'
                                                    value='animalAlive'
                                                    onChange={() => {
                                                        let formData = this.state.formData;
                                                        formData.AnimalStatus = 'animalAlive';
                                                        this.setState({ formData })
                                                    }}
                                                    control={
                                                        <Radio size='small' color="primary" />
                                                    }
                                                    display="inline"
                                                // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                />
                                                <FormControlLabel
                                                    label="Animal Died"
                                                    name='animalDied'
                                                    value='animalDied'
                                                    onChange={() => {
                                                        let formData = this.state.formData;
                                                        formData.AnimalStatus = 'animalDied';
                                                        this.setState({ formData })
                                                    }}
                                                    control={
                                                        <Radio size='small' color="primary" />
                                                    }
                                                    display="inline"
                                                // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                />
                                            </RadioGroup>
                                        </div>
                                        <div className='flex px-2 ' >
                                            <p className='font-bold mr-2' >Date</p>
                                            <LoonsDatePicker className="w-full"
                                                value={this.state.formData.ARV_ERIG_ARV2SiteD14}
                                                placeholder=""
                                                // minDate={new Date()}

                                                //maxDate={new Date()}
                                                required={true}
                                                // disabled={this.state.date_selection}
                                                errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let formData = this.state.formData;
                                                    formData.ARV_ERIG_ARV2SiteD14 = date;
                                                    this.setState({ formData })
                                                }}
                                                format='dd/MM/yyyy'
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <div className='w-full px-2' >
                                            <p className='font-bold' >Brain of Animal for Rabies</p>
                                            <div>
                                                <RadioGroup defaultValue={this.state.formData.BrainOfAnimal} row>
                                                    <FormControlLabel
                                                        label="Positive"
                                                        name='positive'
                                                        value='Positive'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.BrainOfAnimal = 'Positive';
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                    // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                    />
                                                    <FormControlLabel
                                                        label="Negative"
                                                        name='negative'
                                                        value='Negative'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.BrainOfAnimal = 'Negative';
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                    // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                    />
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                        <p>OPDDOC</p>
                                    </Grid>

                                    {/* 5th Row */}
                                    { this.state.formData.AnimalStatus == 'animalDied' ? 
                                        <Grid className='flex' item="item" lg={12} md={12} sm={12} xs={12}>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>D30</p>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p>2 Doses</p>
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <LoonsDatePicker className="w-full"
                                                value={this.state.formData.ARV_ERIG_ARV2SiteD30}
                                                placeholder=""
                                                // minDate={new Date()}

                                                //maxDate={new Date()}
                                                required={true}
                                                // disabled={this.state.date_selection}
                                                errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let formData = this.state.formData;
                                                    formData.ARV_ERIG_ARV2SiteD30 = date;
                                                    this.setState({ formData })
                                                }}
                                                format='dd/MM/yyyy'
                                            />
                                        </Grid>
                                        <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                            <p className='ml-4' >OPDDOC</p>
                                        </Grid>
                                        
                                        </Grid>
                                        :null
                                    }  
                                    <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                            <p>Admit Patient for Further Treatments</p>
                                        </Grid>
                                        <Grid item="item" lg={6} md={6} sm={6} xs={6}>
                                            <Button
                                                className='mt-2'
                                                // progress={false}
                                                // type="submit"
                                                // scrollToTop={false}
                                                // startIcon="save"
                                                // onClick={() => { this.submit() }}
                                            >
                                                <span className="capitalize">Admission</span>
                                            </Button>
                                        </Grid> 
                                    </Grid>
                                        : this.state.formData.IDScheduleCategory == "ARVModified4SiteSingleDose(ID)" ?
                                            <Grid className='pt-4' container="container" spacing={2}>
                                                {/* Heading Row */}
                                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                    <p>Day</p>
                                                </Grid>
                                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                    <p>2 Sited ID</p>
                                                </Grid>
                                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                    <p>Date/Year</p>
                                                </Grid>
                                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                    <p>Ordering Doctor</p>
                                                </Grid>

                                                {/* 1st Row */}
                                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                    <p>D0</p>
                                                </Grid>
                                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                    <p>4 Doses</p>
                                                </Grid>
                                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                    <LoonsDatePicker className="w-full"
                                                        value={this.state.formData.ARVModified4SiteSingleDoseD0}
                                                        placeholder=""
                                                        // minDate={new Date()}
    
                                                        //maxDate={new Date()}
                                                        required={true}
                                                        // disabled={this.state.date_selection}
                                                        errorMessages="this field is required"
                                                        onChange={(date) => {
                                                            let formData = this.state.formData;
                                                            formData.ARVModified4SiteSingleDoseD0 = date;
                                                            this.setState({ formData })
                                                        }}
                                                        format='dd/MM/yyyy'
                                                    />
                                                </Grid>
                                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                    <p>OPDDOC</p>
                                                </Grid>
                                            </Grid>
                                            : this.state.formData.IDScheduleCategory == "ARVModified4SiteDose(ID)" ?
                                            <Grid className='pt-4' container="container" spacing={2}>
                                            {/* Heading Row */}
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>Day</p>
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>Modified  Sited ID</p>
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>Date/Year</p>
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>Ordering Doctor</p>
                                            </Grid>
    
                                            {/* 1st Row */}
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>D0</p>
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>4 Doses</p>
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <LoonsDatePicker className="w-full"
                                                    value={this.state.formData.ARV_ERIG_ARV2SiteD0}
                                                    placeholder=""
                                                    // minDate={new Date()}
    
                                                    //maxDate={new Date()}
                                                    required={true}
                                                    // disabled={this.state.date_selection}
                                                    errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let formData = this.state.formData;
                                                        formData.ARV_ERIG_ARV2SiteD0 = date;
                                                        this.setState({ formData })
                                                    }}
                                                    format='dd/MM/yyyy'
                                                />
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>OPDDOC</p>
                                            </Grid>
    
                                            {/* 2nd Row */}
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>D3</p>
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>2 Doses</p>
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <LoonsDatePicker className="w-full"
                                                    value={this.state.formData.ARV_ERIG_ARV2SiteD3}
                                                    placeholder=""
                                                    // minDate={new Date()}
    
                                                    //maxDate={new Date()}
                                                    required={true}
                                                    // disabled={this.state.date_selection}
                                                    errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let formData = this.state.formData;
                                                        formData.ARV_ERIG_ARV2SiteD3 = date;
                                                        this.setState({ formData })
                                                    }}
                                                    format='dd/MM/yyyy'
                                                />
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>OPDDOC</p>
                                            </Grid>
    
                                            {/* 3rd Row */}
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>D7</p>
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>2 Doses</p>
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <LoonsDatePicker className="w-full"
                                                    value={this.state.formData.ARV_ERIG_ARV2SiteD7}
                                                    placeholder=""
                                                    // minDate={new Date()}
    
                                                    //maxDate={new Date()}
                                                    required={true}
                                                    // disabled={this.state.date_selection}
                                                    errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let formData = this.state.formData;
                                                        formData.ARV_ERIG_ARV2SiteD7 = date;
                                                        this.setState({ formData })
                                                    }}
                                                    format='dd/MM/yyyy'
                                                />
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>OPDDOC</p>
                                            </Grid>
    
                                            {/* 4th Row */}
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>D14</p>
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <div className="flex">
                                                    <RadioGroup defaultValue={this.state.formData.AnimalStatus} row>
                                                        <FormControlLabel
                                                            label="Animal Alive"
                                                            name='animalAlive'
                                                            value='animalAlive'
                                                            onChange={() => {
                                                                let formData = this.state.formData;
                                                                formData.AnimalStatus = 'animalAlive';
                                                                this.setState({ formData })
                                                            }}
                                                            control={
                                                                <Radio size='small' color="primary" />
                                                            }
                                                            display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                        />
                                                        <FormControlLabel
                                                            label="Animal Died"
                                                            name='animalDied'
                                                            value='animalDied'
                                                            onChange={() => {
                                                                let formData = this.state.formData;
                                                                formData.AnimalStatus = 'animalDied';
                                                                this.setState({ formData })
                                                            }}
                                                            control={
                                                                <Radio size='small' color="primary" />
                                                            }
                                                            display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                        />
                                                    </RadioGroup>
                                                </div>
                                                <div className='flex px-2 ' >
                                                    <p className='font-bold mr-2' >Date</p>
                                                    <LoonsDatePicker className="w-full"
                                                        value={this.state.formData.ARV_ERIG_ARV2SiteD14}
                                                        placeholder=""
                                                        // minDate={new Date()}
    
                                                        //maxDate={new Date()}
                                                        required={true}
                                                        // disabled={this.state.date_selection}
                                                        errorMessages="this field is required"
                                                        onChange={(date) => {
                                                            let formData = this.state.formData;
                                                            formData.ARV_ERIG_ARV2SiteD14 = date;
                                                            this.setState({ formData })
                                                        }}
                                                        format='dd/MM/yyyy'
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <div className='w-full px-2' >
                                                    <p className='font-bold' >Brain of Animal for Rabies</p>
                                                    <div>
                                                        <RadioGroup defaultValue={this.state.formData.BrainOfAnimal} row>
                                                            <FormControlLabel
                                                                label="Positive"
                                                                name='positive'
                                                                value='Positive'
                                                                onChange={() => {
                                                                    let formData = this.state.formData;
                                                                    formData.BrainOfAnimal = 'Positive';
                                                                    this.setState({ formData })
                                                                }}
                                                                control={
                                                                    <Radio size='small' color="primary" />
                                                                }
                                                                display="inline"
                                                            // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                            />
                                                            <FormControlLabel
                                                                label="Negative"
                                                                name='negative'
                                                                value='Negative'
                                                                onChange={() => {
                                                                    let formData = this.state.formData;
                                                                    formData.BrainOfAnimal = 'Negative';
                                                                    this.setState({ formData })
                                                                }}
                                                                control={
                                                                    <Radio size='small' color="primary" />
                                                                }
                                                                display="inline"
                                                            // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                                            />
                                                        </RadioGroup>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                <p>OPDDOC</p>
                                            </Grid>
    
                                            {/* 5th Row */}
                                            { this.state.formData.AnimalStatus == 'animalDied' ? 
                                                <Grid className='flex' item="item" lg={12} md={12} sm={12} xs={12}>
                                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                    <p>D30</p>
                                                </Grid>
                                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                    <p>2 Doses</p>
                                                </Grid>
                                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                    <LoonsDatePicker className="w-full"
                                                        value={this.state.formData.ARV_ERIG_ARV2SiteD30}
                                                        placeholder=""
                                                        // minDate={new Date()}
    
                                                        //maxDate={new Date()}
                                                        required={true}
                                                        // disabled={this.state.date_selection}
                                                        errorMessages="this field is required"
                                                        onChange={(date) => {
                                                            let formData = this.state.formData;
                                                            formData.ARV_ERIG_ARV2SiteD30 = date;
                                                            this.setState({ formData })
                                                        }}
                                                        format='dd/MM/yyyy'
                                                    />
                                                </Grid>
                                                <Grid item="item" lg={3} md={3} sm={3} xs={3}>
                                                    <p className='ml-4' >OPDDOC</p>
                                                </Grid>
                                                </Grid>
                                                :null
                                            }   
                                            </Grid>
                                                : null
                    }

                    </Grid>
                    : null
                    }

                    {/* Im Schedule */}
                    { this.state.formData.managementCategory == 'IMSchedule' ? 
                        <Grid className='pt-4' container="container" spacing={2}>
                            {/* IM Schedule Radio Buttons */}
                            <Grid className='pt-4' container="container" spacing={2}>
                                <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                    <Typography className="ml-2" variant="h6" >IM Schedule Category</Typography>
                                </Grid>
                                <Grid item="item" lg={8} md={8} sm={8} xs={8}>
                                    <RadioGroup row>
                                    { appConst.IMScheduleCategory.map((data) => 
                                        <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                            <FormControlLabel
                                                label={data.label}
                                                name={data.value}
                                                value={data.value}
                                                onChange={() => {
                                                    let formData = this.state.formData;
                                                    formData.IMScheduleCategory = data.value;
                                                    this.setState({ formData })
                                                }}
                                                control={
                                                    <Radio size='small' color="primary" />
                                                }
                                                display="inline"
                                            // checked={this.state.formData.examination_data[0].other_answers.comobilites}
                                            />
                                    </Grid>
                                    )}
                                    </RadioGroup>
                                </Grid>
                            </Grid>

                            {/* When click on the IM Single Dose */}
                            { this.state.formData.IMScheduleCategory == 'iMSingleDose' ?
                                <Grid className='pt-4' container="container" spacing={2}>
                                    <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                        <p className='font-semi-bold' >ARV IM Schedule Single Dose</p>
                                    </Grid>
                                    {/* Heading Row */}
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>Day</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>No of Injections</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>Date/Year</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>Ordering Doctor</p>
                                    </Grid>

                                    {/* 1st Row */}
                                    <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>D0</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>2 Doses</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.IMSingleDoseDate}
                                            placeholder=""
                                            // minDate={new Date()}
                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.IMSingleDoseDate = date;
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>OPDDOC</p>
                                    </Grid> 
                            </Grid>
                                : null
                            }

                            {/* When click on the Category 2 */}
                            { this.state.formData.IMScheduleCategory == 'category2WithoutRIG' ?
                                <Grid className='pt-4' container="container" spacing={2}>
                                    <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                        <p className='font-semi-bold' >ARV IM Schedule Category 2 without RIG</p>
                                    </Grid>
                                    {/* Heading Row */}
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>Day</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>No of Injections</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>Date/Year</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>Ordering Doctor</p>
                                    </Grid>

                                    {/* 1st Row */}
                                    <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>D0</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>2 Doses</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.category2WithoutRIGD0}
                                            placeholder=""
                                            // minDate={new Date()}
                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.category2WithoutRIGD0 = date;
                                                formData.category2WithoutRIGD7 = moment(date).add(7, 'days');
                                                formData.category2WithoutRIGD21 = moment(date).add(21, 'days')
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>OPDDOC</p>
                                    </Grid> 

                                    {/* 2nd Row */}
                                    <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>D7</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>1 Doses</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.category2WithoutRIGD7}
                                            placeholder=""
                                            // minDate={new Date()}
                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.category2WithoutRIGD7 = date;
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>OPDDOC</p>
                                    </Grid>

                                    {/* 3rd Row */}
                                    <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>D21</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>1 Doses</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.category2WithoutRIGD21}
                                            placeholder=""
                                            // minDate={new Date()}
                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.category2WithoutRIGD21 = date;
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>OPDDOC</p>
                                    </Grid>
                            </Grid>
                                : null
                            }

                            {/* When click on the Category 3 */}
                            { this.state.formData.IMScheduleCategory == 'Category3' ?
                                <Grid className='pt-4' container="container" spacing={2}>
                                    <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                        <p className='font-semi-bold' >ARV IM Schedule Category 3 Category 3 with RIG</p>
                                    </Grid>
                                    {/* Heading Row */}
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>Day</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>Date/Year</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>Ordering Doctor</p>
                                    </Grid>

                                    {/* 1st Row */}
                                    <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>D0</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.category3D0}
                                            placeholder=""
                                            // minDate={new Date()}
                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.category3D0 = date;
                                                formData.category3D3 = moment(date).add(3, 'days')
                                                formData.category3D7 = moment(date).add(7, 'days')
                                                formData.category3D14 = moment(date).add(14, 'days')
                                                formData.category3D30 = moment(date).add(1, 'months')
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>OPDDOC</p>
                                    </Grid> 

                                    {/* 2nd Row */}
                                    <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>D3</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.category3D3}
                                            placeholder=""
                                            // minDate={new Date()}
                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.category3D3 = date;
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>OPDDOC</p>
                                    </Grid>

                                    {/* 3rd Row */}
                                    <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>D7</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.category3D7}
                                            placeholder=""
                                            // minDate={new Date()}
                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.category3D7 = date;
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>OPDDOC</p>
                                    </Grid>

                                    {/* 4th Row */}
                                    <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>D14</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.category3D14}
                                            placeholder=""
                                            // minDate={new Date()}
                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.category3D14 = date;
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>OPDDOC</p>
                                    </Grid>

                                    {/* 5th Row */}
                                    <Grid item="item" lg={4} md={4} sm={4} xs={4}>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>D30</p>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <LoonsDatePicker className="w-full"
                                            value={this.state.formData.category3D30}
                                            placeholder=""
                                            // minDate={new Date()}
                                            //maxDate={new Date()}
                                            required={true}
                                            // disabled={this.state.date_selection}
                                            errorMessages="this field is required"
                                            onChange={(date) => {
                                                let formData = this.state.formData;
                                                formData.category3D30 = date;
                                                this.setState({ formData })
                                            }}
                                            format='dd/MM/yyyy'
                                        />
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} sm={2} xs={2}>
                                        <p>OPDDOC</p>
                                    </Grid>
                            </Grid>
                                : null
                            }
                        </Grid>
                        :null
                    }
                    
                        <Dialog
                            fullWidth
                            maxWidth="xs"
                            open={this.state.formData.immunoCompromise == true && this.state.formData.managementCategory == 'IDSchedule' && this.state.remarksDialog }
                            onClose={() => {
                                this.setState({ remarksDialog: false })
                            }}
                            >
                            <div className="w-full h-full px-10 py-5">
                                <Grid container className=''>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography className="text-center" variant="h6" >Are You Sure to Continue With This Management ?</Typography>
                                    </Grid>
                                    <Grid item lg={3} md={12} sm={12} xs={12}>
                                    </Grid>
                                    <Grid className='flex justify-between' item lg={6} md={12} sm={12} xs={12}>
                                        <Button
                                            className='mt-4'
                                            progress={false}
                                            type=""
                                            scrollToTop={false}
                                            startIcon="save"
                                            onClick={() => { this.setState({ remarksDialog : false }) }}
                                            >
                                                <span className="capitalize">Yes</span>
                                        </Button>
                                        <Button
                                            className='mt-4'
                                            progress={false}
                                            type=""
                                            scrollToTop={false}
                                            // startIcon="save"
                                            onClick={() => { 
                                                let formData = this.state.formData
                                                formData.managementCategory = 'IMSchedule'
                                                this.setState(
                                                    {
                                                        formData
                                                    }
                                                ) 
                                            }}
                                            >
                                                <span className="capitalize">No</span>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </Dialog>
                
                   

                    {/* Submit Button */}
                    <Grid className='pt-4' container="container" spacing={2}>
                        <Grid className=' flex justify-start' item="item" lg={11} md={11} sm={11} xs={11}>
                            <Button
                            className='mt-2'
                            progress={false}
                            type="submit"
                            scrollToTop={false}
                            startIcon="save"
                            onClick={() => { this.submit() }}
                            >
                                <span className="capitalize">Submit</span>
                            </Button>
                        </Grid>
                    </Grid>
                    

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

export default ARV;