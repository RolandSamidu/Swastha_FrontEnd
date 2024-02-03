import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
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
    Typography,
    CircularProgress,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    FilePicker,
    ImageView,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import WarehouseServices from 'app/services/WarehouseServices'
import ConsignmentService from 'app/services/ConsignmentService'
import { SimpleCard } from 'app/components'
import InventoryService from 'app/services/InventoryService'


const styleSheet = (theme) => ({})

class EstimationAquireDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: '',
            severity: 'success',

            //dropdown Data
            allGroups: [],
            allSerials: [],
            allWH: [],
          

            files: { fileList: [] },

            group_code: '',
            item_serial_code: '',
            item_post_fix: '',
            group_class: '',
            ven: '',

            formData: {
                // sr_no: '',
                serial_id: '',
                short_description: '',
             

            }
        }
    }


   
    async loadDefaultFrequency() {
        console.log("loadDisplyingFrequency")
        let params = { limit: 99999, page: 0 }
        const res = await InventoryService.getDefaultFrequency(params)
        if (res.status == 200) {
            this.setState({ allDefaultFrequency: res.data.view.data })
            console.log("loadDisplyingFrequency",this.state.allDefaultFrequency )
        }
    }

    async loadItemById(id) {
        let params = {};
        const res = await InventoryService.fetchItemById(params, id)
        let uoms = [];
        if (res.status == 200) {
            console.log("item Data", res.data.view)

            // res.data.view.ItemUOMs.forEach(element => {
            //     uoms.push(element.uom_id)
            // });

            let formData = {
                // sr_no: res.data.view.sr_no,
                serial_id: res.data.view.serial_id,
                short_description: res.data.view.short_description,
           
                defaultDuration:res.data.view.default_duration



            }

            this.setState({
                formData,
                loaded: true,
                group_class: res.data.view.Serial.Group.Class.code,
                ven: this.state.allVENS.filter((ele) => ele.id == res.data.view.ven_id)[0].name
            })

        }
    }


    async componentDidMount() {
      
        let hosID = this.props.id;
        this.loadItemById(hosID);
    }



    async submit() {
        console.log("Form date",this.state.formData)
        let hosID = this.props.id;

        var form_data2 = new FormData();
        // let nullCheck = Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
        // form_data2.append(`file`, this.state.files.fileList[0].file);
        // form_data2.append(`sr_no`, this.state.formData.sr_no)
        if(this.state.formData.serial_id != null ){
            form_data2.append(`serial_id`, this.state.formData.serial_id)
        }
       
        form_data2.append(`defaultDuration`, this.state.formData.defaultDuration)

        console.log("Form data2",form_data2)
        let res = await InventoryService.editItem(form_data2, hosID)
        console.log("Data" , res)
        if (res.status == 200) {
            this.setState({
                alert: true,
                message: 'Item has been Edited Successfully.',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Cannot Edit Item ',
                severity: 'error',
            })
        }




    }

    render() {
        // let { theme } = this.props
        // const { classes } = this.props
        // const zeroPad = (num, places) => String(num).padStart(places, '0')
        return (
            < Fragment >
                <MainContainer>
                   
                        <CardTitle title="Estimation Details" />

                      
                            <ValidatorForm
                                className="pt-2"
                                onSubmit={() => this.submit()}
                                onError={() => null}
                            >
                                    <LoonsCard className="mt-3">
                                        <Grid className='mt-3' container spacing={2}>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Estimation Obtain Time Period"/>
                                        <DatePicker
                                            className="w-full"
                                          //   value={this.state.filterData.delivery_date}
                                            placeholder="Date From"
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={date =>{
                                                
                                                //     let filterData = this.state.filterData;
                                                //     filterData.delivery_date = date;
                                                //     this.setState({filterData})
                                              
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        {/* <SubTitle title="Delivery effective date range"/> */}
                                        <DatePicker
                                            className="w-full mt-5"
                                          //   value={this.state.filterData.delivery_date}
                                            placeholder="Date To"
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={date =>{
                                                
                                                //     let filterData = this.state.filterData;
                                                //     filterData.delivery_date = date;
                                                //     this.setState({filterData})
                                              
                                            }}
                                        />
                                    </Grid>

                                    <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                {/* Description*/}
                                                    <SubTitle title="Notification Message" />
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Notification Message"
                                                        name="remark"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                      //   value={
                                                      //       this.state.formData
                                                      //           .remark
                                                      //   }
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
                                                                        remark:
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
                                            <Grid item xs={6} sm={12} md={6} lg={6}>
                                        <SubTitle title="Before" />
                                        <TextValidator
                                            className="w-full"
                                            placeholder="before"
                                            name="defaultDuration"
                                            InputLabelProps={{
                                                inputMode: 'numeric',
                                                pattern: '[0-9]*',
                                                shrink: false,
                                            }}
                                          //   value={this.state.formData.defaultDuration
                                          //   }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                // let formData = this.state.formData
                                                // formData.defaultDuration = e.target.value
                                                // this.setState({ formData })
                                            }}
                                        /*  validators={['required']}
                                     errorMessages={[
                                         'this field is required',
                                     ]} */
                                        />
                                          <DatePicker
                                            className="w-full mt-5"
                                          //   value={this.state.filterData.delivery_date}
                                            placeholder="before"
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={date =>{
                                                
                                                //     let filterData = this.state.filterData;
                                                //     filterData.delivery_date = date;
                                                //     this.setState({filterData})
                                              
                                            }}
                                        />

                                    </Grid>

                                            
                                        </Grid>
                                        
                                    </LoonsCard>


                                <Button
                                    className="mt-2 mr-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    startIcon="save"
                                //onClick={this.handleChange}
                                >
                                    <span className="capitalize">
                                        Save & Next
                                    </span>
                                </Button>

                            </ValidatorForm>
                           
                  
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

export default withStyles(styleSheet)(EstimationAquireDetails)

