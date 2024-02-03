import React, {Component, Fragment} from "react";
import {LoonsSnackbar, MainContainer, SubTitle} from "../../components/LoonsLabComponents";
import {Grid} from '@material-ui/core'
import {Button,} from 'app/components/LoonsLabComponents'
import VehicleService from "../../services/VehicleService";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import LoonsTable from "../../components/LoonsLabComponents/Table/LoonsTable";
import {Autocomplete} from "@material-ui/lab";
import LoonsCard from "../../components/LoonsLabComponents/LoonsCard";
import CardTitle from "../../components/LoonsLabComponents/CardTitle";
import Tooltip from "@material-ui/core/Tooltip";
import LoonsSwitch from "../../components/LoonsLabComponents/Switch";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import localStorageService from "app/services/localStorageService";
import * as appConst from '../../../appconst';

class AddVehicle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            data: [],
            totalItems: 0,
            totalPages: 0,
            buttonName: 'save',
            vehicleId: '',
            filterData: {
                page: 0,
                limit: 20,
            },
            driverData: [],
            vehicleTypesData: [],
            params: {
                limit: 20,
                page: 0
            },
            regCharacter:null,
            reg_no:{
                first:null,
                mid:null,
                end:null
            },
            regno2:true,
            ownerId: '000',
            maxVolume: '',
            maxWeight: '',
            regNumber: null,
            type: '',
            make: null,
            description: null,
            averageLoadingTime: '',
            formData: {
                vehicle_type_id: '',
                pharmacy_drugs_store_id: null,
                reg_no: '',
                make: '',
                max_volume: '',
                max_weight: '',
                average_loading_time: '',
                description: ''
            },
            alert: false,
            message: '',
            severity: 'success',
            columns: [
                {
                    name: 'id',
                    label: 'id',
                    options: {
                        //filter: true,
                        display: false,
                    },
                },
                {
                    name: 'reg_no', // field name in the row object
                    label: 'Vehicle Reg.Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        //display: false
                    },
                },
                {
                    name: 'type',
                    label: 'Vehicle Type',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p> {this.state.driverData[tableMeta.rowIndex].VehicleType.name} </p>)
                        },
                    },

                },
                {
                    name: 'make',
                    label: 'Make',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'description',
                    label: 'Description',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'max_volume',
                    label: 'Max Volume',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'max_weight',
                    label: 'Max Weight',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'average_loading_time',
                    label: 'Average Loading Time',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: "action",
                    label: "Action",
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="Edit">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                console.log(tableMeta.tableData)
                                                this.setDataToFields(this.state.driverData[tableMeta.rowIndex]);
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <EditIcon color="primary"/>
                                        </IconButton>
                                    </Tooltip>
                                    <Grid className="px-2">
                                        <Tooltip title="Change Status">
                                            <LoonsSwitch
                                                checked={
                                                    this.state.driverData[tableMeta.rowIndex].status === 'Active' ? true : false
                                                }

                                                color="primary"
                                                onChange={() => {
                                                    this.toChangeStatus(tableMeta.rowIndex)
                                                }}
                                            />
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            );
                        }

                    }
                }
            ],
            statusChangeRow: null,
            conformingDialog: false,
        }
    }

    setDataToFields(row) {
        this.setState({
            regno2:false
        })
        console.log(row)
        let formData = this.state.formData
        // let row = row
        var regno 
        // let regCharacter = this.state.regCharacter
        let regNumber = this.state.reg_no
        if(row.reg_no.includes('-')){
            regno = row.reg_no.split('-')
            regNumber.mid = '-'
            regNumber.first= regno[0]
            regNumber.end = regno[1]
            // this.setState({
            //     reg_no:regNumber
            // })
            console.log("reg2",regNumber)
        }else if(row.reg_no.includes('ශ්‍රී')){
            row.reg_no.split('ශ්‍රී')
            regNumber.first= regno[0]
            regNumber.end = regno[1]
            regNumber.mid = 'ශ්‍රී'
            console.log("reg2",regNumber)
            // this.setState({
            //     reg_no:regNumber
            // })
        } else if(row.reg_no.includes(' ')){
            row.reg_no.split(' ')
            regNumber.first= regno[0]
            regNumber.end = regno[1]
            regNumber.mid = ' '
            console.log("reg2",regNumber)
            // this.setState({
            //     reg_no:regNumber
            // })
        }  
         
        formData.vehicle_type_id=row.vehicle_type_id
        formData.pharmacy_drugs_store_id=row.pharmacy_drugs_store_id
        // formData.reg_no=row.reg_no
        formData.make=row.make
        formData.max_volume=row.max_volume
        formData.max_weight=row.max_weight
        formData.average_loading_time=row.average_loading_time
        formData.description=row.description
        this.setTimeout(() => {
            this.setState({
                reg_no:regNumber,
                formData,
                buttonName: 'update',
                vehicleId: row.id,
                regno2:true
            })   
        }, 1000);
           
    }

    async toChangeStatus(row) {
        this.setState({
            statusChangeRow: row,
            conformingDialog: true
        })
    }

    async componentDidMount() {
        var pharmacy_drug_store = await localStorageService.getItem('login_user_pharmacy_drugs_stores');
        let formData = this.state.formData
        formData.pharmacy_drugs_store_id = pharmacy_drug_store[0]?.pharmacy_drugs_stores_id

        console.log("pharmadrugid", pharmacy_drug_store[0]?.pharmacy_drugs_stores_id)
        this.setState({formData})
        this.loadData();
        this.getVehicleType()
    }

    //get vehicle types
    async getVehicleType() {
        this.setState({loaded: false})

        let res = await VehicleService.getAllVehicleTypes()
        console.log('res:', res)
        this.setState({ vehicleTypesData: res.data.view.data, loaded: true })
        console.log("vdata",this.state.vehicleTypesData)
    }   

    async loadData() {
        this.setState({loaded: false})
        var ownerId = await localStorageService.getItem('owner_id');
        let drivers = await VehicleService.fetchAllVehicles(this.state.params, ownerId);
        if (drivers.status === 200) {
            this.setState({
                    loaded: true,
                    driverData: drivers.data.view.data,
                    driverTableFormData: drivers.data.view.data,
                    totalPages: drivers.data.view.totalPages,
                    totalItems: drivers.data.view.totalItems,
                },
                () => {
                    this.render()
                }
            )
        }
        console.log("driverData",drivers)
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        console.log(page)
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }

    postDriverForm = async () => {
        if (this.state.formData.pharmacy_drugs_store_id == null || this.state.formData.pharmacy_drugs_store_id == undefined) {
                this.setState({
                    alert: true,
                    message: 'User not assigned!',
                    severity: 'error',
                })
            } else {
            if (this.state.buttonName === 'save') {
                let formData = this.state.formData
                formData.reg_no = this.state.reg_no.first+this.state.reg_no.mid+this.state.reg_no.end
                console.log("form2",formData)
                var ownerId = await localStorageService.getItem('owner_id');
                // let ownerId = this.state.ownerId
            
                let res = await VehicleService.createNewVehicle(formData, ownerId);

                console.log("ress", res)
                if (res.status === 201) {
                    this.setState({
                        alert: true,
                        message: 'Vehicle Created Successfully!',
                        severity: 'success',
                    },()=>{
                        window.location.reload()
                    })
                    this.clearForm();
                } else {
                    this.setState({
                        alert: true,
                        message: 'Vehicle creation was Unsuccessful!',
                        severity: 'error',
                    })
                }
            }
                else {
                    this.updateDriver();
                }
        }
    }

    // Update vehicle
    async updateDriver() {
        let formData = this.state.formData
         var ownerId = await localStorageService.getItem('owner_id');
        // let ownerId = this.state.ownerId
        let vehicleId = this.state.vehicleId
        let res = await VehicleService.updateDriver(vehicleId, ownerId, formData);
        if (res.status === 200) {
            this.setState({
                alert: true,
                message: 'Vehicle Updated Successfully!',
                severity: 'success',
            })
            this.clearForm();
        } else {
            this.setState({
                alert: true,
                message: 'Vehicle Updated was Unsuccessful!',
                severity: 'error',
            })
        }
    }

// Change vehicle status
    async changeStatus(row) {
        let data = this.state.driverData[row]
        let statusChange = {
            "status": data.status === "Deactive" ? "Active" : "Deactive"
        }
        let res = await VehicleService.changeVehicleStatus(data.id, this.state.ownerId, statusChange)
        if (res.status === 200) {
            this.setState(
                {
                    alert: true,
                    severity: 'success',
                    message: 'Successfully changed the status',
                },
                () => {
                    this.loadData()
                }
            )
        } else {
            this.setState(
                {
                    alert: true,
                    severity: 'error',
                    message: 'Cannot change the status',
                },
                () => {
                    console.log('ERROR UpDate')
                }
            )
        }
    }

    async agreeToChangeStatus() {
        this.changeStatus(this.state.statusChangeRow)
        this.setState({conformingDialog: false})
    }

    clearForm() {
        this.setState({
            formData: {
                vehicle_type_id: '',
                pharmacy_drugs_store_id: 'b5af4187-2a04-4608-8951-54630550adaa',
                reg_no: '',
                make: '',
                max_volume: '',
                max_weight: '',
                average_loading_time: '',
                description: ''
            },
            buttonName: 'Save'
        })

    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={"Vehicle Details"}/>

                        <ValidatorForm
                            ref="form"
                            className="pt-2"
                            onSubmit={this.postDriverForm}
                        >
                            <Grid container spacing={1} className="flex ">
                            <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                     <Grid container spacing={1} className="flex ">
                                     <Grid
                                    className=" w-full" item lg={4} md={4} sm={4} xs={4}
                                >
                                    <SubTitle title="Vehicle Registration Number"/>
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Eg:- 2/252/PD"
                                        name="reg_no"
                                        InputLabelProps={{shrink: false}}
                                        value={this.state.reg_no.first}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        inputProps={{
                                            maxLength: 5,
                                          }}
                                        onChange={(e) => {
                                            let reg_no =this.state.reg_no
                                            reg_no.first =e.target.value.trim()
                                            this.setState({reg_no})
                                        }}
                                        validators={['required'
                                        // , 'matchRegexp:^([a-zA-Z]{1,3}|((?!0*-)[0-9]{1,3}))-[0-9]{4}(?<!0{4})'
                                    ]}
                                        errorMessages={['This field should be required!'
                                        // ,'Please Enter in Correct number format'
                                    ]}
                                    />
                                </Grid>
                                {this.state.regno2==true? 
                                                                    <Grid
                                                                    className=" w-full mt-5" item lg={4} md={4} sm={4} xs={4}
                                                                 >
                                                                   <Autocomplete
                                        disableClearable
                                                                         className="w-full"
                                                                         options={appConst.vehicle_mid_no}
                                                                        //  value={this.state.buttonName=='update'?appConst.vehicle_mid_no.filter((e) => 
                                                                        //  e.value == this.state.reg_no.mid):this.state.reg_no.mid
                                                                             
                                                                        //  }
                                                                         onChange={(e, value, r) => {
                                                                             if (null != value) {
                                                                                let reg_no = this.state.reg_no
                                                                                reg_no.mid=value.value
                                                                                 this.setState({reg_no})
                                                                             }
                                                                         }}
                                                                         // value={this.state.vehicleTypesData.find((v) => v.id === this.state.formData.vehicle_type_id)}
                                                                         getOptionLabel={
                                                                             (option) => option.label
                                                                         }
                                                                         renderInput={(params) => (
                                                                             <TextValidator
                                                                                 {...params}
                                                                                 placeholder="Select ශ්‍රී / -"
                                                                                 fullWidth
                                                                                 variant="outlined"
                                                                                 size="small"
                                                                             />
                                                                         )}
                                                                     />
                                                                 </Grid>
                                 
                                :null}
                                <Grid
                                   className="w-full mt-5" item lg={4} md={4} sm={4} xs={4}
                                >
                                   
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Eg:- 3428"
                                        name="reg_no"
                                        InputLabelProps={{shrink: false}}
                                        value={this.state.reg_no.end}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        inputProps={{
                                            maxLength: 4,
                                          }}
                                        
                                        onChange={(e) => {
                                            let reg_no =this.state.reg_no
                                            reg_no.end =e.target.value.trim()
                                            this.setState({reg_no},
                                                console.log("num",this.state.reg_no.first+" "+this.state.reg_no.mid+" "+
                                                this.state.reg_no.end))
                                        }}
                                        validators={['required','isNumber',
                                        
                                        // , 'matchRegexp:^([a-zA-Z]{1,3}|((?!0*-)[0-9]{1,3}))-[0-9]{4}(?<!0{4})'
                                    ]}
                                        errorMessages={['This field should be required!','Please enter a number',
                                       
                                        // ,'Please Enter in Correct number format'
                                    ]}
                                    />
                                </Grid>


                                    </Grid>
                            </Grid>
                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Vehicle Type" />
                                    
                                    {(this.state.vehicleTypesData.length != 0) ? <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.vehicleTypesData}
                                        onChange={(e, value, r) => {
                                            if (null != value) {
                                                let formData = this.state.formData
                                                formData.vehicle_type_id = value.id
                                                this.setState({formData})
                                            }
                                        }}
                                        value={this.state.vehicleTypesData.find((v) => v.id === 
                                        this.state.formData.vehicle_type_id)}
                                        getOptionLabel={
                                            (option) => option.name
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Vehicle Type"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />:null}


                                </Grid>
                                <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12}>
                                    <SubTitle title="Vehicle Make"/>
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Vehicle Make"
                                        name="make"
                                        InputLabelProps={{shrink: false}}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.make}
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.make =
                                                e.target.value
                                            this.setState({formData})
                                        }}
                                        validators={['required', 
                                        'matchRegexp:^([a-zA-Z]{1,50})$'
                                        ]}
                                        errorMessages={['This field should be required!']} 
                                    />
                                </Grid>

                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Average Loading Time(Min)"/>
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Average Loading Time(Min)"
                                        name="avg_loading_time"
                                        InputLabelProps={{shrink: false}}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.average_loading_time}
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.average_loading_time =
                                                e.target.value
                                            this.setState({formData})
                                        }}
                                        validators={['required', 'isFloat', 'isPositive']}
                                        errorMessages={['This field should be required!', 'Wrong input!', 'Value should positive!']}
                                    />
                                </Grid>

                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Max Volume (m3)"/>

                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Max Volume"
                                        name="maxVolume"
                                        InputLabelProps={{shrink: false}}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.max_volume}
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.max_volume =
                                                e.target.value
                                            this.setState({formData})
                                        }}
                                        validators={['required', 'isFloat', 'isPositive']}
                                        errorMessages={['This field should be required!', 'Wrong input!', 'Value should positive!']}
                                    />
                                </Grid>

                                <Grid
                                    className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                >
                                    <SubTitle title="Max Weight(kg)"/>
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Max Weight"
                                        name="maxWeight"
                                        InputLabelProps={{shrink: false}}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.max_weight}
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.max_weight =
                                                e.target.value
                                            this.setState({formData})
                                        }}
                                        validators={['required', 'isFloat', 'isPositive']}
                                        errorMessages={['This field should be required!', 'Wrong input!', 'Value should positive!']}
                                    />
                                </Grid>

                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <SubTitle title="Description"/>
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Description"
                                        name="description"
                                        InputLabelProps={{shrink: false}}
                                        type="text"
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.description}
                                        onChange={(e) => {
                                            let formData =
                                                this.state.formData
                                            formData.description =
                                                e.target.value
                                            this.setState({formData})
                                        }}
                                        validators={['required']}
                                        errorMessages={['This field should be required!']}
                                    />
                                </Grid>

                            </Grid>
                            <Grid justifyContent="space-between" className=" w-full flex justify-end" item lg={12}
                                  md={12} sm={12} xs={12}>
                                <Button
                                    className="mr-2 mt-2"
                                    progress={false}
                                    scrollToTop={true}
                                    startIcon="clear"
                                    color="secondary"
                                    onClick={() => {
                                        this.clearForm();
                                    }}
                                >
                                    <span className="capitalize">clear</span>
                                </Button>
                                <Button
                                    className="mt-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    startIcon="save"
                                >
                                    <span className="capitalize">{this.state.buttonName}</span>
                                </Button>
                            </Grid>
                        </ValidatorForm>
                    </LoonsCard>

                    <Grid style={{marginTop: 20}}>
                        < LoonsCard>
                            {this.state.loaded &&
                            <div className="mt-0">
                                <LoonsTable
                                    id={"driverDetails"}
                                    data={this.state.driverData}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        rowsPerPage: 5,
                                        page: this.state.filterData.page,

                                        onTableChange: (action, tableState) => {
                                            switch (action) {
                                                case 'changePage':
                                                    this.setPage(tableState.page)
                                                    break
                                                case 'sort':
                                                    break
                                                default:
                                                    console.log(
                                                        'action not handled.'
                                                    )
                                            }
                                        },
                                    }}
                                >{}</LoonsTable>
                            </div>
                            }
                        </LoonsCard>
                    </Grid>
                    <LoonsSnackbar
                        open={this.state.alert}
                        onClose={() => {
                            this.setState({alert: false})
                        }}
                        // np
                        message={this.state.message}
                        autoHideDuration={3000}
                        severity={this.state.severity}
                        elevation={2}
                        variant="filled"
                    >{}</LoonsSnackbar>
                </MainContainer>
                <Dialog
                    open={this.state.conformingDialog}
                    onClose={() => {
                        this.setState({conformingDialog: false})
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Conformation"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you Sure to change status of this Driver?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="text" onClick={() => {
                            this.setState({conformingDialog: false})
                        }} color="primary">
                            Disagree
                        </Button>
                        <Button variant="text" onClick={() => {
                            this.agreeToChangeStatus()
                        }} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>

        )

    }
}

export default AddVehicle
