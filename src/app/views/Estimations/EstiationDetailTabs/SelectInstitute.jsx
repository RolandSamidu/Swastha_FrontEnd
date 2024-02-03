import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Checkbox,
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
     Dialog,
    IconButton,
    InputAdornment,
    CircularProgress,
    Tooltip,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import VisibilityIcon from '@material-ui/icons/Visibility';
import 'date-fns'
import SearchIcon from '@material-ui/icons/Search';
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    LoonsTable,
    FilePicker,
    ImageView,
} from 'app/components/LoonsLabComponents'
import AddIcon from '@mui/icons-material/Add';
import * as appConst from '../../../../appconst'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import WarehouseServices from 'app/services/WarehouseServices'
import ConsignmentService from 'app/services/ConsignmentService'
import { SimpleCard } from 'app/components'
import InventoryService from 'app/services/InventoryService'


const styleSheet = (theme) => ({})

class SelectInstitute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true, //change to false
            alert: false,
            remarksDialog:false,
            message: '',
            severity: 'success',

            //dropdown Data
            allGroups: [],
            allSerials: [],
            allWH: [],
            data:[{estimation_id:'12'}],

            files: { fileList: [] },

            group_code: '',
            item_serial_code: '',
            item_post_fix: '',
            group_class: '',
            ven: '',
            returnRequestIds: [],
            formData: {
                // sr_no: '',
                institute_type: null,
                category: null,
                level:null,
                search:null,
                remarks:null,

             

            },
            columns: [
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                   options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <Checkbox onChange={(e) => this.handleCheckbox(this.state.data[tableMeta.rowIndex]?.id)} disabled={value ? false : true} color={"primary"}
                                        checked={this.state.returnRequestIds.some((data) => data === this.state.data[tableMeta.rowIndex]?.id)}

                                    />
                                </>
                            )
                        },
                    
                    }
                },
                {
                    name: 'institute_id', // field name in the row object
                    label: 'Institute ID', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'institute_name', // field name in the row object
                    label: 'Institute Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'warehouse_type', // field name in the row object
                    label: 'Warehouse Type', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.data[dataIndex].ConsignmentItems[0].item_schedule.Order_item.purchase_order.order;
                        //     return (
                        //         <p>{data}</p>
                        //     );
                        // }
                    },
                },
                {
                    name: 'category', // field name in the row object
                    label: 'Category', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                       
                    },
                },
                {
                    name: 'level', // field name in the row object
                    label: 'Level', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'remark_for_institute', // field name in the row object
                    label: 'Remark for institute', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id;
                            return (
                                <Grid className="flex items-center">
                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    this.setState({
                                                      remarksDialog : true  
                                                    })
                                                }}>
                                                <AddIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            );
                        }
                    },
                },
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                   options: {
                        filter: false,
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id;
                            
                            return (
                                <Grid className="flex items-center">
                                    {/*  <Tooltip title="Edit">
                                        <Buttons
                                         color="primary" style={{ fontWeight: 'bold', marginTop: -3 }}>
                                            View
                                        </Buttons>
                                    </Tooltip> */}
                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/estimation/individiualrequest/${id}`
                                                }}>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            );
                        }
                       
                    }
                }
            ],

        }
    }
    handleCheckbox = (id) => {
        let ids = this.state.returnRequestIds;
        if (ids.includes(id)) {
            ids = ids.filter((data) => data !== id);
        } else {
            ids.push(id);
        }
        this.setState({ returnRequestIds: ids });

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
                   
                        <CardTitle title="Select Institutes" />

                      
                            <ValidatorForm
                                className="pt-2"
                                onSubmit={() => this.submit()}
                                onError={() => null}
                            >
                                    <LoonsCard className="mt-3">
                                        <Grid className='mt-3' container spacing={2}>
                                            <Grid className=" w-full" item lg={3} md={6} sm={12} xs={12} >
                                                <SubTitle title="Warehouse type" />

                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allDosageForms}
                                                    //options={this.state.allWH.filter((ele) => ele.status == "Active")}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.dosageForm = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                //     value={this.state.allDosageForms.find((obj) => obj.id == this.state.formData.dosageForm
                                                //     )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Warehouse type"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            // value={this.state.allDosageForms.find((obj) => obj.id == this.state.formData.dosageForm
                                                            // )}
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid className=" w-full" item lg={3} md={6} sm={12} xs={12} >
                                                <SubTitle title="Status" />

                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allDosageForms}
                                                    //options={this.state.allWH.filter((ele) => ele.status == "Active")}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.dosageForm = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                //     value={this.state.allDosageForms.find((obj) => obj.id == this.state.formData.dosageForm
                                                //     )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder=""
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            // value={this.state.allDosageForms.find((obj) => obj.id == this.state.formData.dosageForm
                                                            // )}
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Date range"/>
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
                                        lg={3}
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
                                            <Grid className=" w-full" item lg={3} md={6} sm={12} xs={12} >
                                                <SubTitle title="Level" />

                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allDosageForms}
                                                    //options={this.state.allWH.filter((ele) => ele.status == "Active")}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.dosageForm = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                //     value={this.state.allDosageForms.find((obj) => obj.id == this.state.formData.dosageForm
                                                //     )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Level"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            // value={this.state.allDosageForms.find((obj) => obj.id == this.state.formData.dosageForm
                                                            // )}
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />
                                                
                                            </Grid>
                                            <Grid className=" w-full" item lg={3} md={6} sm={12} xs={12} >
                                                <SubTitle title="Category" />

                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allDosageForms}
                                                    //options={this.state.allWH.filter((ele) => ele.status == "Active")}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.dosageForm = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                //     value={this.state.allDosageForms.find((obj) => obj.id == this.state.formData.dosageForm
                                                //     )}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Level"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            // value={this.state.allDosageForms.find((obj) => obj.id == this.state.formData.dosageForm
                                                            // )}
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />
                                                
                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                            <SubTitle title='Search'/>
                                <TextValidator className='w-full' placeholder="Search" fullWidth="fullWidth" variant="outlined" size="small"
                                    //value={this.state.formData.search} 
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        if (e.target.value != '') {
                                            formData.search = e.target.value;
                                        }else{
                                            formData.search = null
                                        }                     
                                        this.setState({formData})
                                        console.log("form dat", this.state.formData)
                                    }}

                                    onKeyPress={(e) => {
                                        if (e.key == "Enter") {                                
                                                this.LoadOrderItemDetails()            
                                        }
            
                                    }}
                                    /* validators={[
                                    'required',
                                    ]}
                                    errorMessages={[
                                    'this field is required',
                                    ]} */
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon></SearchIcon>
                                            </InputAdornment>
                                        )
                                    }}/>


                                            </Grid>

                                            
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
                                        Save & Next
                                    </span>
                                </Button>
                                <Grid container="container" spacing={2}>
                            <Grid item="item" lg={6} xs={12}>
                                <SubTitle title="Remark"/>
                                <TextValidator
                                    className="w-full"
                                    placeholder="Remarks"
                                    name="Remarks"
                                    InputLabelProps={{
                                        shrink: false
                                    }}
                                    value={this.state.remarks
}
                                    type="text"
                                    multiline="multiline"
                                    rows={3}
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {
                                        this.setState({remarks: e.target.value})
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}/>
                            </Grid>
                        </Grid>
                        </LoonsCard>
                            </ValidatorForm>
                            : 
                            
                                                {/*Table*/}
                                                <Grid style={{ marginTop: 20 }}>

                                                {this.state.loaded ?
                            <Grid container className="mt-5 pb-5">
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            print: false,
                                            viewColumns: false,
                                            download: false,
                                            count: this.state.totalItems,
                                            rowsPerPage: 20,
                                            page: this.state.formData.page,
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                console.log(
                                                    action,
                                                    tableState
                                                )
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setPage(
                                                            tableState.page
                                                        )
                                                        break
                                                    case 'sort':
                                                        //this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    ></LoonsTable>
                                </Grid>
                            </Grid>
                            :
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress
                                    size={30}
                                />
                            </Grid>
                        }
</Grid>

                        
                  
                </MainContainer>
                <Dialog
                        fullWidth
                        maxWidth="lg"
                        open={this.state.remarksDialog}
                        onClose={() => {
                            this.setState({ remarksDialog: false })
                        }}>
                        <div className="w-full h-full px-5 py-5">

                            <Grid container className=''>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    
                                        <ValidatorForm
                                            className=""
                                            onSubmit={() => this.SubmitAll()}
                                            onError={() => null}>

                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <h4 className='mt-5'>Remarks {this.state.totalReceivedItems}</h4>
                                                <h5 className=''>Institute ID : backend </h5>
                                                <h5 className=''>Institute Name : </h5>
                                            </Grid>
                                            <Grid item lg={12} md={12} sm={12} xs={12} className="mb-2 mt-5">
                                               

                                            </Grid>
                                            <Grid item lg={12} md={12} sm={12} xs={12}
                                                // style={{ visibility: `${this.state.filterData.visible}` }}
                                                className="mt-5">

                                                <h4 className=''>Remarks : </h4>
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
                                                    scrollToTop={false}
                                                    // type='submit'
                                                    // startIcon="search"
                                                    onClick={() => { this.handleAddReceivedItems() }}
                                                >
                                                    <span className="capitalize">Add Remark</span>
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

export default withStyles(styleSheet)(SelectInstitute)

