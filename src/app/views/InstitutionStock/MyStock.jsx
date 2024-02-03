import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import ApartmentIcon from '@material-ui/icons/Apartment';
import * as appconst from '../../../appconst';



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
    IconButton,
    Icon,
    Tabs,
    InputAdornment,
    Tab,
    Dialog,
    Typography
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

import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
import LoonsButton from 'app/components/LoonsLabComponents/Button'

import ItemStock from './ItemStock'
import DetailsView from './DetailsView' 
import UnuserbleDrugs from './UnuserbleDrugs'
import ClinicService from 'app/services/ClinicService'

const styleSheet = (theme) => ({})

class MyStok extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 0,
            activeSecondaryTab: 0,
            Loaded: false,
            selected_warehouse: null,
            selected_warehouse_name: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            login_user_roles: [],
            owner_id: null,
            owner_id2: null,
            user_type: null,
            warehouse_selecteble:true,
            allRMSD:[],
            setSelectedInstituteType:null,
            hospitalList:[],
            hospitalSelected: false,
            rmsdSelecter:false,
            selected_owner_id:null,
            buttonDesable : true,
            commonInstitute:null,
            commenDeparment:null,

            selecter_hospital:{
                name: null
            },

            selected_rmsd: {
                name: null
            },

            selected_institute: {
                name:null
            }



        }

    }

    async componentDidMount() {
        this.setState({
            dialog_for_select_warehouse:true,
        })
    }

   
    // get rmsd list
    async getRmsdList(){

        this.setState({
            buttonDesable:true
        })

        let params = {
            issuance_type: ["RMSD Main"],
        };

        // get ownId list
        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status == 200) {
            console.log('rmsd_res', res.data.view.data)
            
            this.setState({
                allRMSD: res.data.view.data,
                hospitalSelected: false,
                rmsdSelecter:true,
            })
        }
    }


    // get hospital list
    async getHosapitalList() {
        this.setState({
            buttonDesable:true
        })

        
        let params = {
            issuance_type: ["Hospital"],
        };

        // get ownId list
        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status == 200) {
            console.log('hospital_res', res.data.view.data)
            this.setState({
                hospitalList: res.data.view.data,
                hospitalSelected: true,
                rmsdSelecter:false,
            })
        }
    }

    changeType(type) {
        this.setState({ type: type, Loaded: false })

        setTimeout(() => {
            this.setState({ Loaded: true })
        }, 500)
    }

    render() {

        return (

            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <Typography variant="h6" className="font-semibold">Institution Stocks</Typography>
                        
                            <div className='flex'>
                                <Grid className='pt-2 pr-3'>
                                    <Typography>{this.state.selected_warehouse_name !== null ? "You're in " + this.state.selected_warehouse_name : null}</Typography>
                                </Grid>

                                    <LoonsButton
                                        color='primary'
                                        onClick={() => {
                                            this.setState({ dialog_for_select_warehouse: true, Loaded: false, buttonDesable:true })
                                        }}>
                                        <ApartmentIcon />
                                        Change Institute
                                    </LoonsButton>

                            </div>
                        </div>
          
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant="h10" className="font-semibold mb-3">Institute : {(this.state.commonInstitute ? this.state.commonInstitute : ' ') + (this.state.commenDeparment ? (' - ' + this.state.commenDeparment) : ' ')}</Typography>
                                </Grid>
                            </Grid>
                        <Divider />
                        <AppBar position="static" color="default" className="mb-4 mt-2">
                            <Grid item lg={12} md={12} xs={12}>
                                <Tabs style={{ minHeight: 39, height: 26 }}
                                    indicatorColor="primary"
                                    variant='fullWidth'
                                    textColor="primary"
                                    value={this.state.activeTab}
                                    onChange={(event, newValue) => {
                                        console.log(newValue)
                                        this.setState({ activeTab: newValue })
                                    }} >

                                    <Tab label={<span className="font-bold text-12">Summary</span>} />
                                    <Tab label={<span className="font-bold text-12">Detail View</span>} />
                                    <Tab label={<span className="font-bold text-12">Unserviceable Drugs</span>} />

                                </Tabs>
                            </Grid>
                        </AppBar>

                        <main>

                            {this.state.Loaded ?
                                <div>
                                    {this.state.activeTab == 0 ?
                                        <div className='w-full'>

                                            <ItemStock ownerID={this.state.selected_owner_id} ></ItemStock>
                                        </div>
                                        : null
                                    }
                                    {this.state.activeTab == 1 ?
                                        <div className='w-full'>
                                            <DetailsView ownerID={this.state.selected_owner_id} ></DetailsView>
                                        </div> : null
                                    }
                                    {this.state.activeTab == 2 ?
                                        <div className='w-full'>
                                            <UnuserbleDrugs ownerID={this.state.selected_owner_id} ></UnuserbleDrugs>
                                        </div> : null
                                    }
                                </div>
                                : null}
                        </main>
                    </LoonsCard>
                   
                        <Dialog
                            fullWidth="fullWidth"
                            maxWidth="md"
                            open={this.state.dialog_for_select_warehouse}>

                            <MuiDialogTitle disableTypography="disableTypography">
                                <CardTitle title="Select Institution Type" />
                            </MuiDialogTitle>
                            <Grid item lg={12}>
                                <ValidatorForm
                                    // onSubmit={() => {
                                    //     this.initial()
                                    // }}
                                    onError={() => null} className="w-full">
                                    <Grid container spacing={1} className="w-full px-2">

                                        <Grid item className='w-full' >
                                            <Autocomplete
                                                className='w-full'
                                                disableClearable
                                                options={appconst.Institution_type}
                                                onChange={(e, value) => {

                                                    let selected_institute = this.state.selected_institute
                                                    selected_institute.name = value.value
                                                    this.setState({
                                                        setSelectedInstituteType:value,
                                                        selected_institute
                                                    })
                                                    // setSelectedWarehouseType(value)
                                                    if (value.value === "Hospital") {
                                                        // loadAllWarehouses(value.value)

                                                        this.getHosapitalList()
                                                        // rmsd
                                                    }else if (value.value === "RMSD"){
                                                        // loadAllInstitutes()
                                                        // hospital
                                                        this.getRmsdList()
                                                        
                                                    } else {
                                                        this.setState({
                                                            selected_owner_id:'000',
                                                            hospitalSelected: false,
                                                            rmsdSelecter:false,
                                                            buttonDesable:false,
                                                            commonInstitute: 'MSD',
                                                            commenDeparment: null,
                                                        })
                                                    }
                                                }}

                    
                                                // value={selectedWarehouseType}
                                                getOptionLabel={(option) => option.label ? option.label : ''}
                                                // value={this.state.selected_institute.name}
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Institution Type"
                                                        // value={selectedWarehouseType}
                                                        value={this.state.selected_institute.name}
                                                        variant="outlined"
                                                        size="small"
                                                        validators={['required']}
                                                        errorMessages={['this field is required']} 
                                                        />
                                                )} />
                                        </Grid>

                                        {this.state.hospitalSelected ?
                                            <Grid item className='w-full'>
                                                <Autocomplete
                                                    className='w-full'
                                                    disableClearable
                                                    options={this.state.hospitalList.sort((a, b) => a.name?.localeCompare(b.name))}
                                                    onChange={(e, value) => {
                                                        let selecter_hospital = this.state.selecter_hospital
                                                        selecter_hospital.name = value.name
                                                        this.setState({
                                                            hospitalSelected: true,
                                                            rmsdSelecter:false,
                                                            selected_owner_id:value.owner_id,
                                                            selecter_hospital,
                                                            buttonDesable:false,
                                                            commonInstitute:value?.name,
                                                            commenDeparment:value?.Department?.name ,
                                                        })
                                                        
                                                        // setSelectedInstitute(value)
                                                        // loadHospitalWarehouses(value)
                                                        //loadAllWarehouses(value.value)
                                                    }}
                                                    // value={this.state.selecter_hospital.name}
                                                    // value={selectedInstitute}
                                                    getOptionLabel={(option) => (option?.name ? option?.name : ' ') + ' - ' + (option?.Department?.name ? option?.Department?.name : ' ')}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Select your Hospital"
                                                            // value={selectedInstitute}
                                                            value={this.state.selecter_hospital.name}
                                                            variant="outlined"
                                                            size="small"
                                                            validators={['required']}
                                                            errorMessages={['this field is required']}
                                                             />
                                                    )} />
                                            </Grid>
                                            : null}

                                        {this.state.rmsdSelecter ?         
                                        <Grid item className='w-full'>
                                            <Autocomplete
                                                className='w-full'
                                                disableClearable
                                                options={this.state.allRMSD.sort((a, b) => a.name?.localeCompare(b.name))}
                                                
                                                onChange={(e, value) => {
                                                    // console.log('gsgggsgsgsgsgsg', value)
                                                    let selected_rmsd = this.state.selected_rmsd
                                                    selected_rmsd.name = value.name
                                                    this.setState({
                                                        hospitalSelected: false,
                                                        rmsdSelecter:true,
                                                        selected_owner_id:value.owner_id,
                                                        selected_rmsd,
                                                        buttonDesable:false,
                                                        commonInstitute:value?.name,
                                                        commenDeparment:value?.Department?.name + ' (' + value?.owner_id + ')',
                                                    })
                                                    
                                                //     console.log('mydta', all_warehouses_to)
                                                //     setLoaded(false)
                                                //     setSelectedWarehouseTo(value.id)
                                                //     setLoaded(true)
                                                }}
                                                // value={this.state.selected_rmsd.name}
                                                // value={all_warehouses_to.find((v) => v.id == selectedWarehouseTo)}
                                                // getOptionLabel={(option) => option.name ? option.name : ''}
                                                getOptionLabel={(option) => (option?.name ? option?.name : ' ') + ' - ' + (option?.Department?.name ? option?.Department?.name : ' ') + ' - ' + (option?.owner_id ? option?.owner_id : ' ')}
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Select RMSD"
                                                        variant="outlined"
                                                        size="small"
                                                        value={this.state.selected_rmsd.name}

                                                        validators={['required']}
                                                        errorMessages={['this field is required']} 
                                                        />
                                                )} />
                                        </Grid>
                                        : null}
                                    </Grid>

                                    <Grid item className='mb-4 mt-4 ml-2'>
                                        <LoonsButton
                                            color='primary'
                                            disabled = {this.state.buttonDesable}
                                            type="submit"
                                            onClick={()=>{
                                                this.setState({
                                                    dialog_for_select_warehouse:false,
                                                    Loaded: true
                                                })
                                            }}
                                        >
                                            OK
                                        </LoonsButton>
                                    </Grid>

                                </ValidatorForm>
                            </Grid>
                        </Dialog>


                </MainContainer>
            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(MyStok)