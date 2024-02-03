import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Typography,
    CircularProgress,
    Checkbox
} from '@material-ui/core'
import 'date-fns'
import moment from 'moment';
import HospitalConfigServices from 'app/services/HospitalConfigServices';
import { Autocomplete } from '@material-ui/lab'

import {
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    SwasthaFilePicker,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import { dateParse, roundDecimal } from 'utils'
import localStorageService from 'app/services/localStorageService'
import LocalPurchaseServices from 'app/services/LocalPurchaseServices'
import PharmacyService from 'app/services/PharmacyService'
import EstimationService from 'app/services/EstimationService'
import AvailableDrug from './AvailableDrug'
import PrescriptionService from 'app/services/PrescriptionService'
import TenderOpeningPrint from './LPRequest/TenderOpeningPrint'

const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
})


const renderSubsequentDetailCard = (label, value) => {
    return (
        <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={6} xs={6}>
                <SubTitle title={label} />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
                <Typography variant='body1' style={{ marginTop: '3px', textJustify: "justify" }}>{value}</Typography>
            </Grid>
        </Grid>

    )
}

const renderDetailCard = (label, value, style = {}) => {
    return (
        <Grid container spacing={2} style={style}>
            <Grid
                className=" w-full"
                item
                lg={8}
                md={8}
                sm={12}
                xs={12}
            >
                {renderSubsequentDetailCard(label, value)}
            </Grid>
        </Grid>
    )
}

const renderRadioCard = (label, value) => {
    return (
        <Grid className="w-full"
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}>
            <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{ display: "flex", alignItems: "center" }}>
                    <SubTitle title={label} />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            name="yesno"
                            aria-disabled
                            value={value}
                            // onChange={(e) => {
                            //     let formData = this.state.formData
                            //     formData.selected = e.target.value
                            //     this.setState({ formData })
                            // }}
                            style={{ display: "block", marginTop: "3px" }}
                        >
                            <FormControlLabel
                                disabled
                                value="yes"
                                control={<Radio />}
                                label="Yes"
                            />
                            <FormControlLabel
                                disabled
                                value="no"
                                control={<Radio />}
                                label="No"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
        </Grid>
    )
}

class AddPrices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            estimationData: [],
            hospital: {},
            open: false,
            userRoles: [],
            userInfo:null,
            retenderArray:[],
            createQuotation: false,
            isShopping: false,
            isNormal: false,
            isSave: false,
            totalItems:null,
            buttenEnable:true,
            singleUnitPrice : [
            ],
            numbersList:[],
            UnitPrice:[],
            list:null,
            alredySaved: true,
            supplier_search: null,
            priceLoaded:false,
            
            saveUnitPrice : {
                data_type: 'Bulk',
                data:[
                //     {
                //     lp_request_id: this.props.match.params.id,
                //     supplier_id: null,
                //     rating: null,
                //     unit_price: null,
                //     cost: null,
                //     owner_id: null,
                //     remark: null,
                // }
            ]
                
            },

            supplire_list_data :{
                lp_request_id: null,
                page: 0,
                limit: 10,
                quotation_no:null
            },


            supplier_id: null,
            supplier_loading: true,
            supplier_data: [
                
                // {
                //     id: "A1001",
                //     name: "Samam",
                //     unit_price: null,
                // },
                // {
                //     id: "A1002",
                //     name: "Gayan",
                //     unit_price: null,
                // },
            ],
            supplier_column: [
                {
                    name: '',
                    label: '',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let unit_price_list = this.state.UnitPrice.find((e)=>e?.Supplier?.id === this.state.supplier_data[dataIndex]?.Supplier?.id)
                            return (
                                <Grid>
                                    <Checkbox
                                        // disabled={this.state.alredySaved}
                                        disabled={unit_price_list?.unit_price != null}
                                        defaultChecked={this.state.supplier_data[dataIndex]?.selected}
                                        checked={this.state.supplier_data[dataIndex]?.selected}
                                        onChange={() => {
                                            this.selectRow(dataIndex)
                                        }}
                                        name="chkbox_confirm"
                                        color="primary"
                                    />
                                </Grid>
                            )
                        }
                    }
                },
                // {
                //     name: '',
                //     label: '',
                //     options: {
                //         display: true,
                //         customBodyRenderLite: (dataIndex) => {  
                
                //             return (
                //                 <Grid>
                //                     <Checkbox
                                        
                //                         defaultChecked={this.scheckExistingSuplierInfo(dataIndex)}
                //                         checked={this.state.supplier_data[dataIndex]?.selected}
                //                         onChange={() => {
                //                             this.selectRow(dataIndex)
                //                         }}
                //                         name="chkbox_confirm"
                //                         color="primary"
                //                     />
                //                 </Grid>
                //             );
                //         }
                //     }
                // },
                
                
                
                {
                    name: 'id',
                    label: 'Supplier ID',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                this.state.supplier_data[dataIndex]?.Supplier.registartion_no
                            )
                        }
                    }
                },
                {
                    name: 'name',
                    label: 'Supplier Name',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                this.state.supplier_data[dataIndex]?.Supplier.name
                            )
                        }
                    }
                },
                {
                    name: 'unit_price',
                    label: 'Unit Price (LKR)',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            const supplierSelected = this.state.supplier_data[dataIndex]?.selected;
                            // console.log('ckeking sup list', this.state.supplier_data[dataIndex])
                            // console.log('ckeking price list', this.state.UnitPrice[dataIndex])

                            // let unit_price = this.state.UnitPrice.map((e)=>{
                            //     if(e?.Supplier?.id == this.state.supplier_data[dataIndex]?.Supplier?.id) {
                            //         return e.unit_price
                            //     }
                            //     })
                            let unit_price_list = {
                                unit_price: ''
                            }
                            unit_price_list = this.state.UnitPrice.find((e)=>e?.Supplier?.id === this.state.supplier_data[dataIndex]?.Supplier?.id)
                            // console.log('ckeking price list', unit_price_list)
                            let up
                            if (unit_price_list?.unit_price == null || unit_price_list?.unit_price == undefined) {
                                console.log('ckeking price list-------------------------->>', this.state?.saveUnitPrice)
                                // up = this.state.saveUnitPrice[dataIndex]?.unit_price
                                if (this.state?.saveUnitPrice.data.length > 0) {
                                    up = this.state?.saveUnitPrice?.data.filter((e) => e?.supplier_id == this.state.supplier_data[dataIndex]?.supplier_id)[0]?.unit_price
                                    
                                }
                                
                            } else {
                                up = unit_price_list?.unit_price
                            }
                            
                
                            return (
                                <ValidatorForm>
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            {/* {console.log('cjdhdjd djdhd djdhd', this.state?.saveUnitPrice )} */}
                                            <TextValidator
                                                className='w-full'
                                                placeholder={"Unit Price"}
                                                fullWidth
                                                disabled={!supplierSelected}
                                                variant="outlined"
                                                size="small"
                                                type='number'
                                                style={{color:'black'}}
                                                min={0}
                                                // value={this.state.priceLoaded ? this.state?.saveUnitPrice.filter((e) => e?.supplier_id == this.state.supplier_data[dataIndex]?.supplier_id)[0]?.unit_price : null}
                                                value={up}
                                                
                                                onChange={(e) => {
                                                    this.setState({ buttenEnable: false})
                                                    this.handleChange(dataIndex, e)
                                                }}

                                                validators={[
                                                    'required', 'minNumber: 0'
                                                ]}
                                                errorMessages={[
                                                    'this field is required', 'Unit Price Should be > 0'
                                                ]}
                                            />
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
                            );
                        }
                    }
                },
                {
                    name: 'total_price',
                    label: 'Total Cost (LKR)',
                    options: {
                        
                        customBodyRenderLite: (dataIndex) => {
                            let unit_price_list = this.state.UnitPrice.find((e)=>e?.Supplier?.id === this.state.supplier_data[dataIndex]?.Supplier?.id)
                            // const supplierSelected = this.state.supplier_data[tableMeta.rowIndex]?.selected;
                            return (
                                // <span>{unit_price_list?.cost ? unit_price_list?.cost : (this.state.saveUnitPrice[dataIndex]?.unit_price * parseFloat(this.state.data?.approved_qty))}</span>
                                <span>{(unit_price_list?.cost ? unit_price_list?.cost : (this.state?.saveUnitPrice?.data.filter((e) => e?.supplier_id == this.state.supplier_data[dataIndex]?.supplier_id)[0]?.unit_price ? (parseFloat(this.state?.saveUnitPrice?.data.filter((e) => e?.supplier_id == this.state.supplier_data[dataIndex]?.supplier_id)[0]?.unit_price) * parseFloat(this.state.data?.approved_qty)) : '')  )}</span>
                            )
                        }
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     // const supplierSelected = this.state.supplier_data[tableMeta.rowIndex]?.selected;
                        //     return (
                        //         <span>{(this.state.UnitPrice[tableMeta.rowIndex]?.cost ? this.state.UnitPrice[tableMeta.rowIndex]?.cost : (this.state.saveUnitPrice.data[tableMeta.rowIndex]?.unit_price ? String(parseFloat(this.state.saveUnitPrice.data[tableMeta.rowIndex]?.unit_price) * parseFloat(this.state.data?.approved_qty)) : '')  )}</span>
                        //     )
                        // }
                    }
                },
                // {
                //     name: 'action',
                //     label: 'Action',
                //     options: {
                //         // filter: true,
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <IconButton
                //                     className="text-black"
                //                     onClick={() => { }
                //                     }>
                //                     <Icon color="primary">visibility</Icon>
                //                 </IconButton>
                //             )
                //         }
                //     }
                // }
            ],

            role: null,
            bht: null,

            alert: false,
            message: '',
            severity: 'success',

            loading: false,
        }
    }

    // handleChange = (dataIndex, e) => {
    //     console.log('dataIndex', dataIndex)

    //     const unit_price = e.target.value;
    
    //     const { saveUnitPrice, supplier_data, data } = this.state
    
    //     saveUnitPrice.data[dataIndex] = {
    //       unit_price: unit_price,
    //       supplier_id: supplier_data[dataIndex]?.Supplier?.id,
    //       owner_id: supplier_data[dataIndex]?.owner_id,
    //       lp_request_id: this.props.match.params.id,
    //       cost: unit_price * parseFloat(data?.approved_qty) || 0,
    //     };

    //     this.setState({ saveUnitPrice });

    //     console.log('saveUnitPrice--------------------', this.state.saveUnitPrice)

    // };

    handleChange = (dataIndex, e) => {
        console.log('dataIndex', dataIndex, e);
        console.log('this.state.supplier_data[dataIndex]', this.state.supplier_data[dataIndex]);
        // console.log('saveUnitPrice----------efour----------', this.state.saveUnitPrice);
    
        const unit_price = e.target.value;
    
        // Copy the existing state
        const updatedSaveUnitPrice = { ...this.state.saveUnitPrice };
        let retenderArray = { ...this.state.retenderArray }
    
        // Update the unit_price for the specified index
        updatedSaveUnitPrice.data[dataIndex] = {
          unit_price: unit_price,
          supplier_id: this.state.supplier_data[dataIndex]?.Supplier?.id,
          owner_id: this.state.supplier_data[dataIndex]?.owner_id,
          lp_request_id: this.props.match.params.id,
          cost: unit_price * parseFloat(this.state.data?.approved_qty) || 0,
        };

        // retenderArray.push(
        //     {
        //         unit_price: unit_price,
        //         supplier_id: this.state.supplier_data[dataIndex]?.Supplier?.id,
        //         owner_id: this.state.supplier_data[dataIndex]?.owner_id,
        //         lp_request_id: this.props.match.params.id,
        //         cost: unit_price * parseFloat(this.state.data?.approved_qty) || 0,
        //     }
        // )
        // Update the state with the updated value
        this.setState({ saveUnitPrice: updatedSaveUnitPrice, priceLoaded : true });
    
        console.log('saveUnitPrice--------------------', this.state.saveUnitPrice);
    };
    

    handleOpen = (value) => {
        this.setState({
            open: value
        })
    };

    loadData = async () => {
        //function for load initial data from backend or other resources
        this.setState({UnitPrice:[]})
        let hospital_id = await localStorageService.getItem('main_hospital_id');
        let owner_id = await localStorageService.getItem('owner_id')

        this.setState({ loading: false });

        let id = this.props.match.params.id;
        let res = await LocalPurchaseServices.getLPRequestByID(id)

        if (res.status === 200) {
            this.setState({ data: res.data.view });
            console.log("LP Data: ", res.data.view)
        }

        let hospital_res = await PharmacyService.getPharmacyById(hospital_id, owner_id, { limit: 1 })
        if (hospital_res.status === 200) {
            this.setState({ hospital: hospital_res.data.view }, () => {
                this.getHospitalEstimation()// for get hospital estimation
                this.getHospital(res.data.view.owner_id)
                this.getClinicData(res.data.view.patient_id)
            })
        }

        this.setState({ loading: true });
    }

    async scheckExistingSuplierInfo(index){

        let incData = this.state.supplier_data[index]

        console.log('dsdfsdfsdfsdfsdfsdfsd indata', index)

        let id = {
            lp_request_id : this.props.match.params.id,
            supplier_id : this.state.saveUnitPrice.supplier_id
        }

        const res = await LocalPurchaseServices.getLPSupplierDet(id);

        if (res.status === 200) {
            console.log('dsdfsdfsdfsdfsdfsdfsd', res)
            this.setState({
                list : res.data.view.data
            })
        }
    }

    // async loadAllSuppliers() {
    //     let params = { limit: 10, page: 0 }

    //     let res = await HospitalConfigServices.getAllSuppliers(params)
    //     if (res.status) {
    //         console.log("All Suppliers", res.data.view.data)
    //         // this.setState({
    //         //     all_Suppliers: res.data.view.data,
    //         // })
    //     }
    // }

    async getUnitPriceIfAvailble(mainData){
        this.setState({UnitPrice:[]})

        let id = {
            lp_request_id : this.props.match.params.id,
            supplier_id: mainData?.map(x=>x.Supplier?.id)
        }
        const res = await LocalPurchaseServices.getLPSupplierDet(id);

        if (res.status === 200) {
            console.log('params unit pricece', res.data.view.data);
            this.setState({
                UnitPrice: res.data.view.data,
                supplier_loading:true
            })

            if (res.data.view.data.length > 0){
                this.setState({
                    alredySaved: true,
                })
            } else {
                this.setState({
                    alredySaved: false
                })
            }
        }
    }

    async SubmitAll() {

        console.log('saveUnitPrice-number', this.state.numbersList)
        const { saveUnitPrice, supplier_data, numbersList } = this.state

        let final_owner_id

        
        // console.log('paramsto submit', params);

        let id = {
            lp_request_id : this.props.match.params.id,
            // supplier_id : this.state.saveUnitPrice.supplier_id
        }

        const existingData = await LocalPurchaseServices.getLPSupplierDet(id);
        console.log('params existingData', existingData);
        //  check alredy exist
        if (existingData.data.view.data.length !== 0) {

            for (let i = 0; i < supplier_data.length; i++) {

                if (this.state.role === 'RDHS'){
                    final_owner_id = this.state.data?.owner_id
                } else {
                    final_owner_id = supplier_data[i]?.owner_id
                }
              }
    
            let params = this.state.saveUnitPrice;
            let filterdData = this.state.saveUnitPrice.data.filter((e)=> e != null)
            params.data = filterdData
            console.log('cheking paras ffofofofof 1', params)

            const res = await LocalPurchaseServices.createLPUnitPrice(params);
        
                if (res.status === 201) {
                    // Unit price creation successful
                    this.setState({
                        alert: true,
                        message: 'Adding Local Purchase was Successful',
                        severity: 'success',
                        isSave: true,
                    }, ()=> {
                        window.location.reload()
                    });
                } else {
                    // Unit price creation unsuccessful
                    this.setState({
                        alert: true,
                        message: 'Adding Local Purchase was Unsuccessful',
                        severity: 'error',
                    });
                }
            
        }
        else {
            try {

                for (let i = 0; i < supplier_data.length; i++) {

                    if (this.state.role === 'RDHS'){
                        final_owner_id = this.state.data?.owner_id
                    } else {
                        final_owner_id = supplier_data[i]?.owner_id
                    }
        
                    if (!numbersList.includes(i)) {
                        console.log('saveUnitPrice-number-1', i)
        
                        saveUnitPrice.data[i] = {
                            unit_price: 0,
                            supplier_id: supplier_data[i]?.Supplier?.id,
                            owner_id: final_owner_id,
                            lp_request_id: this.props.match.params.id,
                            cost: 0,
                            };
        
                            this.setState({
                            saveUnitPrice
                        })
                    }
                  }
        
                let params = this.state.saveUnitPrice; 
                
                console.log('cheking paras ffofofofof 2', params)
                const res = await LocalPurchaseServices.createLPUnitPrice(params);
        
                if (res.status === 201) {
                    // Unit price creation successful
                    this.setState({
                        alert: true,
                        message: 'Adding Local Purchase was Successful',
                        severity: 'success',
                        isSave: true,
                    }, ()=>{
                        window.location.reload()
                    });
                } else {
                    // Unit price creation unsuccessful
                    this.setState({
                        alert: true,
                        message: 'Adding Local Purchase was Unsuccessful',
                        severity: 'error',
                    });
                }
            } catch (error) {
                console.error('Error creating unit price:', error);
                this.setState({
                    alert: true,
                    message: 'An error occurred while creating the unit price.',
                    severity: 'error',
                });
            }
        }
       
    }
    

    async getHospital(owner_id) {
        let params = { issuance_type: ['Hospital', 'RMSD Main'] }
        let durgStore_res = await PharmacyService.fetchAllDataStorePharmacy(owner_id, params)
        if (durgStore_res.status == 200) {
            console.log('hospital', durgStore_res.data.view.data)
            this.setState({ hospital: durgStore_res?.data?.view?.data[0] })
        }
    }

    async getHospitalEstimation() {
        let owner_id = await localStorageService.getItem('owner_id')
        let itemId = this.state.data?.ItemSnap?.id
        let params = {
            owner_id: owner_id,
            item_id: [itemId],
            estimation_status: 'Active',
            available_estimation: 'Active',
            status: 'Active',
            hospital_estimation_status: 'Active',
            //'order[0]': ['createdAt', 'DESC'],
            from: dateParse(moment().startOf('year')),
            to: dateParse(moment().endOf('year')),
            'order[0]': ['estimation', 'DESC'],
        }

        let res = await EstimationService.getAllEstimationITEMS(params)
        if (res.status == 200) {
            console.log("loaded data estimation", res.data)
            this.setState({
                estimationData: res.data?.view?.data
            })
        }
    }

    getClinicData = async (patient_id) => {
        let res = await PrescriptionService.fetchPatientClinics({ 'type': 'Clinic', 'patient_id': patient_id, limit: 1 })
        if (res.status === 200) {
            console.log("Clinic Details: ", res.data.view.data)
            this.setState({ bht: res.data.view.data[0]?.bht })
        }
    }

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState({ files: files }, () => {
            console.log('files', this.state.files)
        })
    }



    loadSuplierList = async(search) => {
        this.setState({
            supplier_loading:false
        })

        console.log('supplier search ===============>>>>>', search)

        let params = this.state.supplire_list_data
        params.lp_request_id = this.props.match.params.id
        params.search = search

            let res = await await LocalPurchaseServices.getLPQuotationInfo(params)
    
            if (res.status === 200){
                console.log('supplier id det ===============>>>>>', res)
                this.setState({
                    supplier_data: res.data.view.data,
                    totalItems:res.data.view.totalItems,
                    
                }, ()=>{
                this.getUnitPriceIfAvailble(res.data.view.data)
                })
            }
    
    }

    selectRow = (index) => {

        this.setState(prevState => ({
            numbersList: [...prevState.numbersList, index],
          }));


        let supplier_data = this.state.supplier_data;

        if (supplier_data[index].selected) {
            supplier_data[index].selected = false
        } else {
            supplier_data[index].selected = true
        }

        this.setState({ supplier_data })
    }


    display() {
        alert(this.state.selected_id.join(','));
        console.log(this.state.selected_id)
    }

    async componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        let roles = await localStorageService.getItem('userInfo')?.roles
        let user = await localStorageService.getItem('userInfo')

        console.log('supplier id det ====ddddddddddd===========>>>>>', user)
        this.setState({
            userInfo: user.name,
            userRoles: roles,
            role: roles[0],
            createQuotation: params.get('create_quotation') ? params.get('create_quotation') : false,
            isShopping: params.get('is_shopping') ? params.get('is_shopping') : false,
            isNormal: params.get('is_normal') ? params.get('is_normal') : false,
        }, () => {
            this.loadData()
            // this.loadAllSuppliers()
            this.loadSuplierList(null)
            // this.scheckExistingSuplierInfo()
        })
    }

    setPage = (page)=>{
        let filterData = this.state.supplire_list_data
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadSuplierList(null)
            }
        )
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <CardTitle title="Local Purchase Details" />
                        {/* Main Grid */}
                        <Grid container spacing={2} direction="row" style={{ marginLeft: "12px", marginTop: "12px" }}>
                            {/* Filter Section */}
                            <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginRight: "12px" }}>
                                {/* Item Series Definition */}
                                <Grid container spacing={2}>
                                    {/* Item Series heading */}
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <SubTitle title="Local Purchase Initial Details" />
                                        <Divider className='mt-2' />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <Grid container spacing={2}>
                                            {/* Serial Number*/}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('LP Request ID :', this.state.loading ? this.state.data?.request_id ? this.state.data.request_id : 'Not Available' : 'Loading')}
                                            </Grid>
                                            {/* Name*/}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Institute :', this.state.loading ? this.state.hospital?.name ? this.state.hospital.name : 'Not Available' : 'Loading')}
                                            </Grid>
                                            {/* Short Reference*/}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Ward Name :', this.state.loading ? this.state.data?.Pharmacy_drugs_store?.short_reference
                                                    ? this.state.data?.Pharmacy_drugs_store.short_reference : 'Not Available' : 'Loading')}
                                            </Grid>
                                            <Grid item lg={12} xs={12} md={12} sm={12}>
                                                <Grid container spacing={2}>
                                                    {renderRadioCard("Patient Basis or Not :", this.state.loading ? this.state.data.is_patient_base === true ? 'yes' : 'no' : null)}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {/* Patient Details*/}
                                    {
                                        this.state.loading && this.state.data?.is_patient_base &&
                                        <>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                lg={12}
                                            >
                                                <SubTitle title="Patient Details" />
                                                <Divider className='mt-2' />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                lg={12}
                                            >
                                                <Grid container spacing={2}>
                                                    {/* Serial Number*/}
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('Name of the Patient :', this.state.loading ? this.state.data?.Patient ? this.state.data.Patient.name : 'Not Available' : 'Loading')}
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                <Grid container spacing={2}>
                                                    {/* Serial Number*/}
                                                    {/* Name*/}
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('BHT / Clinic No :', this.state.loading ? this.state?.bht ? this.state.bht : 'Not Available' : 'Loading')}
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('PHN No :', this.state.loading ? this.state.data?.Patient ? this.state.data.Patient.phn : 'Not Available' : 'Loading')}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </>
                                    }
                                    <br />
                                    {/* Item Details */}
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <SubTitle title="Item Details" />
                                        <Divider className='mt-2' />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={2}>
                                            {/* Serial Number*/}
                                            {/* Name*/}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Sr No :', this.state.loading ? this.state.data?.ItemSnap ? this.state.data.ItemSnap.sr_no : 'Not Available' : 'Loading')}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Grid container spacing={2}>
                                                    <Grid item lg={3} md={3} sm={6} xs={6}>
                                                        <SubTitle title='Item Name' />
                                                    </Grid>
                                                    <Grid item lg={9} md={9} sm={6} xs={6}>
                                                        <Typography variant='body1' style={{ marginTop: '3px', textJustify: "justify" }}>{this.state.loading ? this.state.data?.ItemSnap?.medium_description ? this.state.data?.ItemSnap?.medium_description : 'Not Available' : 'Loading'}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br />
                                    {/* Serial Number*/}
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Required Quantity :', this.state.loading ? this.state.data ? parseInt(this.state.data?.required_quantity, 10) : 'Not Available' : 'Loading')}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Required Date: ', this.state.loading ? this.state.data ? dateParse(this.state.data.required_date) : 'Not Available' : 'Loading')}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Estimated Unit Price (LKR) :', this.state.loading ? this.state.data ? parseFloat(this.state.data?.unit_price, 10) : 'Not Available' : 'Loading')}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Estimated Total Price (LKR) : ', this.state.loading ? this.state.data ? parseFloat(this.state.data?.cost) : 'Not Available' : 'Loading')}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        {renderSubsequentDetailCard('Justification :', this.state.loading ? this.state.data ? this.state.data.justification : 'Not Available' : 'Loading')}
                                    </Grid>
                                    {this.state.userRoles.includes('Drug Store Keeper') || this.state.userRoles.includes('Chief Pharmacist') &&
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <SubTitle title="Attachments :" />
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SwasthaFilePicker
                                                        // uploadingSectionVisibility={this.state.loginUserRoles.includes('Hospital Admin')}
                                                        id="file_public"
                                                        singleFileEnable={true}
                                                        multipleFileEnable={false}
                                                        dragAndDropEnable={true}
                                                        tableEnable={true}

                                                        documentName={true}//document name enable
                                                        documentNameValidation={['required']}
                                                        documenterrorMessages={['this field is required']}
                                                        documentNameDefaultValue={null}//document name default value. if not value set null

                                                        type={false}
                                                        types={null}
                                                        typeValidation={null}
                                                        typeErrorMessages={null}
                                                        defaultType={null}// null

                                                        description={true}
                                                        descriptionValidation={null}
                                                        descriptionErrorMessages={null}
                                                        defaultDescription={null}//null

                                                        onlyMeEnable={false}
                                                        defaultOnlyMe={false}

                                                        source="local_purchase"
                                                        source_id={this.props.match.params.id}

                                                        //accept="image/png"
                                                        // maxFileSize={1048576}
                                                        // maxTotalFileSize={1048576}
                                                        maxFilesCount={1}
                                                        validators={[
                                                            'required',
                                                            // 'maxSize',
                                                            // 'maxTotalFileSize',
                                                            // 'maxFileCount',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                            // 'file size too lage',
                                                            // 'Total file size is too lage',
                                                            // 'Too many files added',
                                                        ]}
                                                        /* selectedFileList={
                                                            this.state.data.fileList
                                                        } */
                                                        label="Select Attachment"
                                                        singleFileButtonText="Upload Data"
                                                    // multipleFileButtonText="Select Files"
                                                    >
                                                    </SwasthaFilePicker>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    }
                                    <br />
                                    {/* {renderRadioCard('Alternative Drug Availability :', 'yes')}
                                                {renderDetailCard('Hospital Available Stock :', 0)}
                                                <br />
                                                {renderDetailCard('Hospital Serviceable Stock :', 0)}
                                                <br />
                                                {renderDetailCard('MSD Available Stock :', 0)} */}
                                    {/* Available Drug List */}
                                    {
                                        this.state.loading && this.state.data?.ItemSnap?.id &&
                                        <Grid
                                            className="w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <AvailableDrug items={this.state.data?.ItemSnap?.id ? [{
                                                id: this.state.data?.ItemSnap?.id, code: this.state.data?.ItemSnap?.sr_no, name: this.state.data?.ItemSnap?.medium_description
                                            }] : []} owner_id={this.state.data?.owner_id} role={this.state.role} />
                                        </Grid>
                                    }
                                    {renderRadioCard('Formulate at MSD :', this.state.loading ? this.state.data?.ItemSnap?.formulatory_approved ? this.state.data.ItemSnap.formulatory_approved === 'Y' ? 'yes' : "no" : null : null)}
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={6}
                                                xs={6}>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ display: "flex", alignItems: "center" }}>
                                                        <SubTitle title={'Category'} />
                                                    </Grid>
                                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                                        <FormControl component="fieldset">
                                                            <RadioGroup
                                                                name="complementaryregular"
                                                                aria-disabled
                                                                value={'complementary'}
                                                                // onChange={(e) => {
                                                                //     let formData = this.state.formData
                                                                //     formData.selected = e.target.value
                                                                //     this.setState({ formData })
                                                                // }}
                                                                style={{ display: "block", marginTop: "3px" }}
                                                            >
                                                                <FormControlLabel
                                                                    disabled
                                                                    value="complementary"
                                                                    control={<Radio />}
                                                                    label="Complementary"
                                                                />
                                                                <FormControlLabel
                                                                    disabled
                                                                    value="regular"
                                                                    control={<Radio />}
                                                                    label="Regular"
                                                                />
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid item xs={3} sm={3}>
                                                <SubTitle title="Estimation :" />
                                            </Grid>
                                            <Grid item xs={9} sm={9} style={{ border: "1px solid #000", borderRadius: "12px", padding: "8px", paddingBottom: "40px" }}>
                                                {this.state.loading ?
                                                    <Grid container spacing={2}>
                                                        <Grid item lg={6} md={6} sm={6} xs={6}>
                                                            <FormControl component="fieldset">
                                                                <RadioGroup
                                                                    name="yesno"
                                                                    aria-disabled
                                                                    value={this.state.estimationData.length > 0 ? 'yes' : 'no'}
                                                                    // onChange={(e) => {
                                                                    //     let formData = this.state.formData
                                                                    //     formData.selected = e.target.value
                                                                    //     this.setState({ formData })
                                                                    // }}
                                                                    style={{ display: "block", marginTop: "3px" }}
                                                                >
                                                                    <FormControlLabel
                                                                        style={{ marginRight: "12px" }}
                                                                        disabled
                                                                        value="yes"
                                                                        control={<Radio />}
                                                                        label="Yes"
                                                                    />
                                                                    <FormControlLabel
                                                                        style={{ marginLeft: "12px" }}
                                                                        disabled
                                                                        value="no"
                                                                        control={<Radio />}
                                                                        label="No"
                                                                    />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </Grid>
                                                        <br />
                                                        {this.state.estimationData.length > 0 ?
                                                            <>
                                                                {renderDetailCard('Annual Estimation :', this.state.estimationData[0] ? this.state.estimationData[0].estimation : "Not Available", { marginLeft: "4px" })}
                                                                <br />
                                                                {renderDetailCard('Monthly Requirement :', this.state.estimationData[0] ? roundDecimal(parseInt(this.state.estimationData[0].estimation, 10) / 12, 2) : "Not Available", { marginLeft: "4px" })}
                                                            </>
                                                            :
                                                            null
                                                        }
                                                        <br />
                                                    </Grid>
                                                    :
                                                    (
                                                        <Grid className='justify-center text-center w-full pt-12'>
                                                            <CircularProgress size={30} />
                                                        </Grid>
                                                    )
                                                }
                                                {/* <div style={{ height: '20px', backgroundColor: 'grey' }}></div> */}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <Divider className='mt-2' />
                                    </Grid>
                                    <br />
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={2}>
                                            {/* Serial Number*/}
                                            {/* Name*/}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >

                                                {renderSubsequentDetailCard('MQP (LKR) :', this.state.loading ? this.state.data?.unit_price ? parseFloat(this.state.data.unit_price).toLocaleString("en-US") : 'Not Available' : 'Loading')}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Approved Qty :', this.state.loading ? this.state.data?.approved_qty ? parseInt(this.state.data?.approved_qty) : parseInt(this.state.data?.required_quantity) : 'Loading')}
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <Grid container spacing={2}>
                                            {/* Serial Number*/}
                                            {/* Name*/}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Total Value (LKR) :', this.state.loading ? this.state.data?.approved_qty ? parseFloat(this.state.data?.unit_price * this.state.data?.approved_qty).toLocaleString('en-US') : parseFloat(this.state.data?.unit_price * this.state.data?.required_quantity).toLocaleString('en-US') : "Loading")}
                                            </Grid>
                                        </Grid>
                                        <br />
                                    </Grid>
                                  
                                    <br />
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={2} style={{ marginTop: "12px", marginBottom: '25px', padding: "24px", background: "#B3ACAC", borderRadius: "12px" }}>
                                            <CardTitle title='Add Prices' style={{ marginLeft: "8px" }} />
                                            <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: '12px', backgroundColor: "#fff", borderRadius: "12px" }}>
                                            <ValidatorForm>
                                                    <Grid container spacing={2}>
                                                        <Grid item  lg={3} md={3} sm={12} xs={12}>
                                                                <SubTitle title="Search Here" />
                                                                <TextValidator
                                                                    placeholder="Search"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    value={this.state.supplier_search}
                                                                    size="small"
                                                                    // value={this.state.supplier_filters.search}
                                                                    onChange={(e)=>{

                                                                        if (e.target.value.length  > 3) {
                                                                            this.loadSuplierList(e.target.value)

                                                                            this.setState({
                                                                                supplier_search : e.target.value
                                                                            })
                                                                        }
                                                                    }}
                                                                />
                                                        </Grid>
                                                        <Grid item  lg={3} md={3} sm={12} xs={12}>
                                                                <Button
                                                                    className="mt-6"
                                                                    progress={false}
                                                                    type="submit"
                                                                    scrollToTop={
                                                                        true
                                                                    }
                                                                    startIcon="close"
                                                                    onClick={()=>{
                                                                        this.setState({
                                                                            supplier_search : ''
                                                                        },()=>{
                                                                            this.loadSuplierList(null)
                                                                        })
                                                                        // this.loadAllSuppliers(null)
                                                                    }}
                                                                >
                                                                    <span className="capitalize">
                                                                        Clear
                                                                    </span>
                                                                </Button>
                                                        </Grid>
                                                    </Grid>
                                            </ValidatorForm>
                                                {this.state.supplier_loading ?
                                                    <>
                                                        
                                                    
                                                    <LoonsTable
                                                        //title={"All Aptitute Tests"}
                                                        id={'all_items'} data={this.state.supplier_data} columns={this.state.supplier_column}
                                                        options={{
                                                            pagination: true,
                                                            serverSide: true,
                                                            count: this.state.totalItems,
                                                            rowsPerPage: 10,
                                                            limit:this.state.supplire_list_data.limit,
                                                            page: this.state.supplire_list_data.page,
                                                            print: true,
                                                            viewColumns: true,
                                                            download: true,
                                                            onTableChange: (action, tableState) => {
                                                                console.log(action, tableState)
                                                                switch (action) {
                                                                    case 'changePage':
                                                                        this.setPage(tableState.page)
                                                                        break
                                                                    case 'sort':
                                                                        // this.sort(tableState.page, tableState.sortOrder);
                                                                        break
                                                                    default:
                                                                        console.log('action not handled.')
                                                                }
                                                            }
                                                        }}></LoonsTable>
                                                    </>
                                                    : (
                                                        //loading effect
                                                        <Grid className="justify-center text-center w-full pt-12">
                                                            <CircularProgress size={30} />
                                                        </Grid>
                                                    )
                                                
                                                }
                                            </Grid>
                                            {}
                                            {/* {(this.state.supplier_data.filter((supplier) => supplier.selected === true && (this.state.saveUnitPrice.unit_price != null && this.state.saveUnitPrice.unit_price.unit_price > 0)).length === this.state.supplier_data.filter((supplier) => supplier.selected == true).length && this.state.supplier_data.filter((supplier) => supplier.selected == true).length > 0)
                                                && */}
                                                <Grid
                                                    item="item"
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                    style={{
                                                        display: 'flex',
                                                        marginTop: '24px',
                                                        paddingRight: 0,
                                                        justifyContent: 'flex-end'
                                                    }}>
                                                            <Button disabled={this.state.buttenEnable} className='mt-1' type='submit' onClick={() => { this.SubmitAll() }}>Save</Button>

                                                </Grid>
                                                {this.state.isSave || this.state.alredySaved ? 
                                                <Grid
                                                    item="item"
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                    style={{
                                                        display: 'flex',
                                                        marginTop: '24px',
                                                        paddingRight: 0,
                                                        justifyContent: 'flex-end'
                                                    }}>
                                                    
                                                   
                                                        <Button
                                                            // type="submit"
                                                            // disabled={!this.state.selected_id.length}
                                                            onClick={() => {
                                                                document.getElementById('tender_print_view').click();
                                                            }}
                                                            startIcon='print'
                                                        >
                                                            <span className="capitalize">Tender Evolution Report</span>
                                                        </Button>
                                                    
                                                    {/* <Button
                                                        // type="submit"
                                                        // disabled={!this.state.selected_id.length}
                                                        className='ml-2'
                                                        onClick={() => {
                                                            if (this.state.isNormal) {
                                                                this.SubmitAll()
                                                                
                                                            } else {
                                                                this.setState({ open: true })
                                                            }
                                                        }}
                                                        startIcon='save'
                                                    >
                                                        <span className="capitalize">Save</span>
                                                    </Button> */}
                                                </Grid>
                                                :null}
                                            {/* } */}
                                        </Grid>
                                    </Grid>
                                    {/* {  
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                            style={{ marginBottom: "24px" }}
                                        >
                                            <ValidatorForm>
                                                <Grid container>
                                                    <Grid
                                                        item
                                                        lg={8}
                                                        md={8}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SubTitle title='Select the Supplier' />
                                                        <Autocomplete
                                                            className="w-full"
                                                            options={this.state.supplier_data}
                                                            onChange={(e, value) => {
                                                                if (null != value) {
                                                                    this.setState({
                                                                        supplier_id: value.id,
                                                                    })
                                                                }
                                                            }}
                                                            getOptionLabel={(option) =>
                                                                option?.Supplier?.name
                                                            }
                                                            renderInput={(params) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="Please choose"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size="small"
                                                                    value={
                                                                        this.state.supplier_id
                                                                    }
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                        item
                                                        lg={4}
                                                        md={4}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <Grid container spacing={2}>
                                                            <Grid
                                                                item
                                                                lg={12}
                                                                md={12}
                                                                sm={12}
                                                                xs={12}
                                                                className=" w-full flex justify-end"
                                                            >
                                                                {/* Submit Button */}
                                                                {/* <Button
                                                                    className="mt-2"
                                                                    progress={false}
                                                                    // type="submit"
                                                                    scrollToTop={
                                                                        true
                                                                    }
                                                                    startIcon="save" */}
                                                                {/* //onClick={this.handleChange} */}
                                                                {/* >
                                                                    <span className="capitalize">
                                                                        Save
                                                                    </span>
                                                                </Button>
                                            //                 </Grid> */}
                                            {/* //             </Grid>
                                            //         </Grid>
                                            //     </Grid>
                                            // </ValidatorForm>
                                        </Grid> */}
                               
                                    {
                                        this.state.isSave || this.state.alredySaved ?
                                        <Grid
                                            className="w-full hidden"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <TenderOpeningPrint data={this.state.data} handleOpen={this.handleOpen} id={this.props.match.params.id} userInfo={this.state.userInfo} />
                                        </Grid>
                                        : null
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </LoonsCard>
                </MainContainer>
                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={1200}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(AddPrices)



                                          