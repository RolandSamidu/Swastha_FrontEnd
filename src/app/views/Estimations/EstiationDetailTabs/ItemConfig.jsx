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
    Checkbox,
    InputAdornment,
    CircularProgress,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
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
import * as appConst from '../../../../appconst'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import WarehouseServices from 'app/services/WarehouseServices'
import ConsignmentService from 'app/services/ConsignmentService'
import { SimpleCard } from 'app/components'
import InventoryService from 'app/services/InventoryService'


const styleSheet = (theme) => ({})

class ItemConfig extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            alert: false,
            message: '',
            severity: 'success',

            //dropdown Data
            allGroups: [],
            allSerials: [],
            allWH: [],
            
            data: [{sr_no:"12"}],

            files: { fileList: [] },

            group_code: '',
            item_serial_code: '',
            item_post_fix: '',
            group_class: '',
            ven: '',
            returnRequestIds: [],
            formData: {
                // sr_no: '',
                serial_id: '',
                short_description: '',
             

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
                    name: 'sr_no', // field name in the row object
                    label: 'SR NO', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'item_name', // field name in the row object
                    label: 'Item name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        selectableRows: 'ht',
                    },
                },
                {
                    name: 'ven', // field name in the row object
                    label: 'Ven', // column title that will be shown in table
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
                    name: 'level', // field name in the row object
                    label: 'Level', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                       
                    },
                },
                
               
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
                   
                        <CardTitle title="Item Configuration" />

                            <ValidatorForm
                                className="pt-2"
                                onSubmit={() => this.submit()}
                                onError={() => null}
                            >
                                    <LoonsCard className="mt-3">
                                        <Grid className='mt-3' container spacing={2}>
                                            <Grid className=" w-full" item lg={3} md={6} sm={12} xs={12} >
                                                <SubTitle title="Item Class" />

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
                                                            placeholder="Item Class"
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
                                                <SubTitle title="Item Group" />

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
                                                            placeholder="Item Group"
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
                                                <SubTitle title="Item Category" />

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
                                                            placeholder="Item Category"
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
                                                <SubTitle title="VEN" />

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
                                                            placeholder="VEN"
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
                                        Save & Finish
                                    </span>
                                </Button>

                            </ValidatorForm>
                            : 
                            <Grid className="justify-center text-center w-full pt-12">
                            {/* <CircularProgress
                                size={30}
                            /> */}
                        </Grid>
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

export default withStyles(styleSheet)(ItemConfig)

