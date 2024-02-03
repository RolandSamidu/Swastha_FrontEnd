import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Tooltip, Typography } from "@material-ui/core";
import { LoonsSnackbar, MainContainer, Widget,LoonsCard } from 'app/components/LoonsLabComponents';
import {  Button, DatePicker, LoonsTable, SubTitle, } from 'app/components/LoonsLabComponents';
import moment from "moment";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { IconButton } from "@mui/material";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { da } from "date-fns/locale";
import {Link} from "react-router-dom"
import { Autocomplete } from "@material-ui/lab";
import LoonsDatePicker from 'app/components/LoonsLabComponents/DatePicker'
import * as appConst from '../../../../appconst'
import { dateParse } from 'utils'

import DashboardServices from "app/services/DashboardServices";
import PatientServices from 'app/services/PatientServices'
import InventoryService from 'app/services/InventoryService'
import EmployeeServices from 'app/services/EmployeeServices';
import QualityAssuranceService from 'app/services/QualityAssuranceService'

const styleSheet = ((palette, ...theme) => ({

}));

class ADRNew extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded : false,
            data : [],
            remarks : [],
            owner_id : null,
            loading:false,
            open : false,
            selectedManufacturesList:[],

            manufacture_data:{
                page:0,
                limit:10
            },

            manufacture_list: [],
            totalManufacture:null,
            manufactureLoading: false,
            manufacture_list_column: [
                {
                    name: '',
                    label: '',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            
                            if (this.state.manufacture_list) {
                                return <input
                                    type="checkbox"
                                    style={{
                                        width: "20px",
                                        height: "20px", outline: "none",
                                        cursor: "pointer"
                                    }}
                                    value={this.state.manufacture_list[dataIndex]?.manufacture_id
                                    }
                                    // defaultChecked={this.state.manufacture_list.includes(this.state.supplier_data[dataIndex]?.id)}
                                    // checked={this.state.selectedSuppliersList.includes(this.state.supplier_data[dataIndex]?.id)}
                                    
                                    onClick={()=>{
                                        this.clickingManufacture(this.state.manufacture_list[dataIndex]?.manufacture_id)
                                    }}
                                />
                            } else {
                                return "N/A"
                            }

                        }
                    }
                },
                // {
                //     name: 'manufacture_no',
                //     label: 'Manufacture ID',
                //     options: {
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             console.log("data22",this.state.qaIncidents[tableMeta.rowIndex])
                //             return this.state.manufacture_list[tableMeta.rowIndex]?.Manufacturer?.registartion_no
                //         },
                //     }
                // },
                {
                    name: 'name',
                    label: 'Manufacture Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.manufacture_list[tableMeta.rowIndex]?.Manufacture
                        },
                    }
                },
            ],

            from : null,
            to:null,
            all_consultant: [],
            remarkforSelectedItem : '',
            selectedRows : [],
            itembatchdata:[],
            defectData:[],
            allEmpData:[],
            filterData: {
                limit: 20,
                page: 0,
                'order[0][0]':'createdAt',
                'order[0][1]':'DESC',
            },
            formData:{
                sr_no:null,
                owner_id:null,
                consultant_id:null,
                reported_date:null,
                nmra_final_decision:null,
                batch_details:[],
                nmra_remarks:null,
            },
            columns : [
                // {
                //     name: 'id',
                //     label: 'Action',
                //     options: {
                //         filter : false,
                //         customBodyRenderLite: (dataIndex) => {  
                //             // {console.log(value)}
                //                 return(
                //                     <Grid className="w-full flex">
                //                             {/* <Link to={"npdrug-order-view/" + (this.state.data[dataIndex].id)}> */}
                //                                 <Tooltip title="view">   
                //                                     <IconButton 
                //                                         aria-label="view" 
                //                                         // onClick={()=>this.setState({open: true})}
                //                                     >
                //                                         <VisibilityIcon color="primary"/>
                //                                     </IconButton>
                //                                 </Tooltip>
                //                             {/* </Link> */}
                //                     </Grid>
                //                 )
                //         }
                //     }
                // },
                // {
                //     name: 'sr_no',
                //     label: 'SR No.',
                //     options: {
                //         filter : false,
                //     }
                // },
                {
                    name: 'item_name',
                    label: 'Reported By',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.NmraReportBy?.name
                              
                        },
                    }
                },
                {
                    name: 'nmra_no',
                    label: 'NMRA No',
                    options: {
                        filter : false,
                    }
                },
                {
                    name: 'nmra_remarks',
                    label: 'Remarks',
                    options: {
                        filter : false,
                    }
                },
                {
                    name: 'nmra_final_decision',
                    label: 'Reason for sending',
                    options: {
                        filter : false,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     // {console.log(value)}
                        //         return(
                        //             <Grid className="w-full">
                        //                     {(value != null) ? moment(value).format('yyyy-MM-DD'):"-"}
                        //             </Grid>
                        //         )
                        // }
                    }
                },
                // {
                //     name: '',
                //     label: 'Manufacture Address',
                //     options: {
                //         filter : false,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             // {console.log(value)}
                //                 return(
                //                     <Grid className="w-full">
                //                             {(value != null) ? moment(value).format('yyyy-MM-DD'):"-"}
                //                     </Grid>
                //                 )
                //         }
                //     }
                // },
                // {
                //     name: ' ',
                //     label: 'Batch No.',
                //     options: {
                //         filter : false,
                //     }
                // },
                // {
                //     name: ' ',
                //     label: 'Committee',
                //     options: {
                //         filter : false,
                //         // customBodyRender: (value, tableMeta, updateValue) => {
                //         //     // {console.log(value)}
                //         //         return(
                //         //             <Grid className="w-full">
                //         //                     {(value != null) ? value.item_unit_size:null}
                //         //             </Grid>
                //         //         )
                //         // }
                //     }
                // },
                // {
                //     name: ' ',
                //     label: 'Committee Date',
                //     options: {
                //         filter : false,
                //         // customBodyRender: (value, tableMeta, updateValue) => {
                //         //     // {console.log(value)}
                //         //         return(
                //         //             <Grid className="w-full">
                //         //                     {(value != null) ? value.sr_no:null}
                //         //             </Grid>
                //         //         )
                //         // }
                //     }
                // },
                // {
                //     name: ' ',
                //     label: 'Committee Desicion',
                //     options: {
                //         filter : false,
                //     }
                // },
                // {
                //     name: ' ',
                //     label: 'NMRA Final Decision',
                //     options: {
                //         filter : false,
                //     }
                // },
            ],

            alert : false,
            severity : 'success',
            message : '',

            all_hospitals:[],
            sr_no:[],
        }
    }

    // getData = async () => {
    //     let params = {
    //         agent_type : 'SPC',
    //         type : 'Name Patient Order',
    //         from: this.state.from,
    //         to :this.state.to,
    //         'order[0]': ['createdAt', 'DESC'],
    //     }

    //     let res =  await PrescriptionService.NP_Orders(params)
    //     console.log("NP ORDERS",res)
    //     this.setState({
    //         data: res.data.view.data, 
    //         loaded: true
    //     })
    // }

    handleClose = () => {
        this.setState({BatchHold : false})
    }

    componentDidMount()  {
        this.LoadData()
        this.LoadQADefect()
        // this.getData()
        // console.log("params",params)
      
    }
    async submit(){
        let formData = this.state.formData
        formData.item_batch_id = formData.item_id
        console.log("Formdata",formData)
        // let batch_details= []
        for (let index = 0; index < formData.batch_details.length; index++) {
            formData.batch_details[index].item_batch_id = formData.batch_details[index].item_batch_id;
            formData.batch_details[index].defect_id = formData.defect_id;
        }
        
        // formData.batch_details.forEach(element => {
        //     batch_details.push({
        //         "item_batch_id":element.item_batch_id,
        //         "defect_id" : formData.defect_id
        //     })
        // });
        // formData.batch_details = batch_details
        console.log("Formdata----------------->>>>",formData)
        let res = await QualityAssuranceService.createNewNMQLRecommendation(formData)
        console.log('Res===========>', res)

        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Batch Hold request sent Successfully ',
                severity: 'success',
            },() => {
                window.location.reload()
            })
            this.LoadData()
        } else {
            this.setState({
                alert: true,
                message: 'Batch Hold request sent was Unsuccessful',
                severity: 'error',
            })
        }
    }
    async LoadQADefect() {
       
        // let filterData = this.state.filterData
        // filterData.type = 'Defects'
        const res = await QualityAssuranceService.QAAssuranceSetup({type:'Defects'})
        console.log("res",res)
        if ( res.status== 200) {
            // filterData.page = res.data.view.currentPage
            this.setState(
                {
                  defectData: res.data?.view?.data,
                },
               
            )
        }
    }
    async setPage(page) {
        let params = this.state.filterData
        params.page = page
        this.setState(
            {
                params,
            },
            () => {
                this.LoadData()
            }
        )
    }

    async LoadData() {
        this.setState({ loading: false })
        console.log("State 1:", this.state.data)
      
        let filterData = this.state.filterData
    
        let res = await QualityAssuranceService.getAllNMQLRecommendations(filterData)
             if (res.status == 200) {
            this.setState({
                data: res.data.view.data,
                loading: true
            }, () => console.log('resdata', this.state.data))
        } 
      }
    async loadAllItems(search) {
        // let params = { "search": search }
        let data = {
          search: search
      }
    //   let filterData = this.state.filterData
      // this.setState({ loaded: false })
    //   let params = { limit: 10000, page: 0 }
      // let filterData = this.state.filterData
      let res = await InventoryService.fetchAllItems(data)
      console.log('all Items', res.data.view.data)

      if (res.status == 200) {
          this.setState({ sr_no: res.data.view.data })
      }
    //   console.log('items', this.state.left)
  }

    async loadHospital(name_like) {
        let params_ward = { issuance_type: 'Hospital', department_type_name: ['Hospital', 'Training'], name_like: name_like }
        let hospitals = await DashboardServices.getAllHospitals(params_ward);
        if (hospitals.status == 200) {
            console.log("all_hospitals", hospitals.data.view.data)
            this.setState({ all_hospitals: hospitals.data.view.data })
        }
    }
   
        async loadAllEmployees(id) {
            console.log("loadAllEmployees",id)
            // let employeeFilterData = this.state.employeeFilterData
            let params = {
                type: 'Consultant',
                created_location_id: id
    
            }
            this.setState({ loaded: false })
            let res = await EmployeeServices.getEmployees(params)
            console.log('all pharmacist', res.data.view.data)
            if (200 == res.status) {
                this.setState({
                    allEmpData: res.data?.view?.data,
                    loaded: true,
                })
            }
        }


        async setManufacturePage(page) {
            let params = this.state.manufacture_data
            params.page = page
            this.setState(
                {
                    params,
                },
                () => {
                    this.selectManufactures()
                }
            )
        }


    async loadItemData(item_batch_id) {
        
        let params={
           item_id : item_batch_id 
        }
        let batch_res = await InventoryService.fetchItemBatchByItem_Id(params)
        console.log("batchres",batch_res)
        if (batch_res.status == 200) {
            this.setState({
                itembatchdata: batch_res?.data?.view?.data,
                //loaded: true,
            }
        )
            console.log('itembatchdata', this.state.itembatchdata)
            this.selectManufactures()
        }
    }

    async selectManufactures() {
        console.log('selected success')

        let params = {
            item_id: this.state.formData.item_id,
            exp_date_grater_than_zero_search:true,
            search_type:'MANUFACTURE'
        }

        let res = await InventoryService.fetchItemBatchByItem_Id(params)

        if (res.status === 200){
            console.log('cheking manufactures', res)
            this.setState({
                manufacture_list: res.data.view,
                totalManufacture:res.data.view.totalItems,
                manufactureLoading: true
            })
        }
    }

    clickingManufacture(id) {

        let formData = this.state.formData
        let selectedManufactures = this.state.selectedManufacturesList || []; // Initialize as an empty array if undefined
        let index = selectedManufactures.indexOf(id);
    
        if (index === -1) {
            selectedManufactures.push(id);
        } else {
            selectedManufactures.splice(index, 1);
        }

        formData.manufacture_ids = selectedManufactures
    
        this.setState({ formData }, () => {
            console.log('hhhhhhhhhhjkjk', this.state.selectedManufacturesList);
        });
    }

    render() {
        return (
            <Fragment>
                <LoonsCard>
                <MainContainer>
                    <Grid>
                    <ValidatorForm
                            className="pt-2"
                            onSubmit={() => null}
                            onError={() => null}
                        >
                            <Grid
                                container
                                spacing={2}
                            >
                                <Grid
                                    item
                                    xs={12}
                                >
                                    {/* <Typography variant='h5'>Create ADR</Typography> */}
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    className="mt-3 flex justify-end"
                                >
                                    <Button
                                        startIcon="add"
                                        className="bg-green"
                                        onClick={()=>this.setState({open: true})}
                                    >
                                        Create ADR
                                    </Button>
                                </Grid> 
                                 
                            </Grid>
                        </ValidatorForm>
                    </Grid>
                    <Grid
                        className="pt-5"
                    >
                        {/* //FIXME: */}
                       
                        {/* {this.state.loading ?  */}
                            <ValidatorForm
                                // onSubmit={this.approve}
                            >
                                <LoonsTable
                                    //title={"All Aptitute Tests"}
                                    id={'allAptitute'}
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    options={{
                                        filterType: 'textField',
                                        pagination: true,
                                        size: 'medium',
                                        serverSide: true,
                                        print: false,
                                        viewColumns: true,
                                        download: false,
                                        count: this.state.totalItems,
                                        rowsPerPage: this.state.filterData.limit,
                                        page: this.state.filterData.page,
                                        onTableChange: (action, tableState) => {
                                            console.log(action, tableState)
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
                              
                            </ValidatorForm>
                        {/* :null} */}
                    </Grid>
                </MainContainer>
                </LoonsCard>
              
                    <Dialog maxWidth="md"   style={{minWidth : '600px'}} open={this.state.open} onClose={this.handleClose} aria-describedby="alert-dialog-slide-description">
                        <DialogTitle>Create ADR</DialogTitle>
                        <Divider/>
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.submit()}
                            onError={() => null}
                        >
                        
                        <Grid className="flex pt-2 pl-4">
                        <h5>Requested Details</h5>
                          
                        </Grid>
                        <hr />
                        <Grid 
                            container
                          
                            className="flex p-8"
                            spacing={2}
                        > 
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    // className="p-8"
                                >
                                    <SubTitle title="Institute"/>
                                        <Autocomplete
                                            className="w-full"
                                            options={
                                                this.state.all_hospitals
                                            }

                                            onChange={(e,value) => {
                                                if (value != null) {
                                                    console.log("INST",value)
                                                    let formData = this.state.formData
                                                    formData.owner_id = value.owner_id
                                                    formData.institute_id = value.id
                                                    this.setState({
                                                        formData,
                                                    },() => {
                                                        this.loadAllEmployees(value.id)
                                                    }
                                                    )
                                                    
                                                }
                                            }}
                                            // value={this.state.all_hospitals.find((v) => v.id == this.state.formData.institute_id
                                            // )}
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
                                                    placeholder="Hospital"
                                                    //variant="outlined"
                                                    value={this.state.all_hospitals.find((v) => v.id == this.state.formData.institute_id
                                                        )}
                                                    onChange={(e) => {
                                                        if (e.target.value.length >= 3) {
                                                            this.loadHospital(e.target.value)
                                                        }
                                                    }}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
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
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={6}
                                >
                               <SubTitle title="Name" />
                                            <Autocomplete
                                                className="w-full"
                                                options={
                                                    this.state.allEmpData
                                                }
                                                onChange={(e,value) => {
                                                    if (value != null) {
                                                        console.log("INST",value)
                                                        let formData = this.state.formData
                                                        formData.created_by = value.id
                                                        formData.consultant_id = value.id
                                                        this.setState({
                                                            formData,
                                                        }
                                                        )
                                                        
                                                    }
                                                }}
                                               
                                                // value={this.state.selected_consultant}
                                                getOptionLabel={(option) =>option?.name
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        value={this.state.allEmpData.find((v) => v.id == this.state.formData.created_by
                                                            )}
                                                        placeholder="Consultant Name"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"

                                                    />
                                                    
                                                )}
                                            />

                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                >
                                     <SubTitle title="Reported Date" />
                            <LoonsDatePicker className="w-full"
                                value={this.state.formData.reported_date}
                                placeholder="Reported Date"
                                // minDate={new Date()}

                                //maxDate={new Date()}
                                required={true}
                                // disabled={this.state.date_selection}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let formData = this.state.formData
                                    formData.reported_date = dateParse(date)
                                    this.setState({ formData })
                                }}
                                validators={['required']}
                                errorMessages={[
                                    'this field is required',
                                ]}
                                format='dd/MM/yyyy'
                            />
                                </Grid>
                         </Grid>
                                <Grid className="flex pt-2 pl-4">
                        <h5>Item Details</h5>
                          
                        </Grid>
                        <hr />
                        <Grid 
                            container
                            className="flex p-8"
                            spacing={2}
                        > 
                        <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    // className="p-8"
                                >
                                <SubTitle title="SR No" />
                                        <Autocomplete
                                    className="w-full"
                                    // value={this.state.sr_no.find((v) => v.id == this.state.formData.sr_no
                                    //     )}
                                    // options={this.state.sr_no}
                                    options={this.state.sr_no}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let formData = this.state.formData;
                                            formData.sr_no = value.id;
                                            formData.item_id = value.id
                                            formData.item_name = value.long_description
                                            console.log('SR no',value)
                                            this.loadItemData(value.id)
                                            this.setState({ 
                                                formData,
                                                // srNo:true
                                            })
                                            // let formData = this.state.formData;
                                            // formData.sr_no = value;
                                           
                                        } 
                                        // else {
                                        //     let formData = this.state.formData;
                                        //     formData.sr_no = null;
                                        //     this.setState({ formData,
                                        //         srNo:false
                                        //     })
                                        // }
                                    }}
                                    getOptionLabel={(option) =>
                                       option.sr_no !== '' ? option.sr_no+'-'+option.long_description :null
                                        // let hsco =  this.state.hsco
                                        // if ( this.state.sr_no !== '' ) {
                                           
                                        // }
                                        // else{
                                        //    hsco.sr_no
                                        // }
                                        
                                        // this.state.hsco.sr_no === '' ? option.sr_no+'-'+option.long_description:this.state.hsco.sr_no
                                    }
                                    
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Type more than 4 letters"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={this.state.allEmpData.find((v) => v.id == this.state.formData.created_by
                                                )}
                                            onChange={(e) => {
                                                console.log("as", e.target.value)
                                                if (e.target.value.length > 4) {
                                                    this.loadAllItems(e.target.value)
                                                    // let hsco =this.state.hsco
                                                    // hsco.sr_no = e.target.value

                                                //     this.setState({
                                                //         hsco,
                                                //        srNo:false
                                                //    })
                                                }
                                                
                                            }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                           
                                        />
                                    )}
                                />

                                </Grid>

                      <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    // className="p-8"
                                >
                                     <SubTitle className='mb-2' title="Item Name" />
                                    <h7>{this.state.formData?.item_name}</h7>
                                </Grid>
                                {/* <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    // className="p-8"
                                >
                                <SubTitle title="Manufacture Code" />
                                        <Autocomplete
                                    className="w-full"
                                    // value={this.state.hsco.sr_no}
                                    // options={this.state.sr_no}
                                    // options={this.state.sr_no}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let formData = this.state.formData;
                                            formData.manufacture_id = value.id;
                                            // formData.item_name = value.long_description
                                            console.log('SR no',formData)
                                            this.setState({ 
                                                formData,
                                                // srNo:true
                                            })
                                            // let formData = this.state.formData;
                                            // formData.sr_no = value;
                                           
                                        } 
                                        // else {
                                        //     let formData = this.state.formData;
                                        //     formData.sr_no = null;
                                        //     this.setState({ formData,
                                        //         srNo:false
                                        //     })
                                        // }
                                    }}
                                    // getOptionLabel={(option) =>
                                    //    option.name !== '' ? option.name:null
                                    //     // let hsco =  this.state.hsco
                                    //     // if ( this.state.sr_no !== '' ) {
                                           
                                    //     // }
                                    //     // else{
                                    //     //    hsco.sr_no
                                    //     // }
                                        
                                    //     // this.state.hsco.sr_no === '' ? option.sr_no+'-'+option.long_description:this.state.hsco.sr_no
                                    // }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Type more than 4 letters"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                console.log("as", e.target.value)
                                                if (e.target.value.length > 4) {
                                                    this.loadAllItems(e.target.value)
                                                    // let hsco =this.state.hsco
                                                    // hsco.sr_no = e.target.value

                                                //     this.setState({
                                                //         hsco,
                                                //        srNo:false
                                                //    })
                                                }
                                            }}
                                        />
                                    )}
                                />

                                </Grid> */}
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    // className="p-8"
                                >
                              <SubTitle title={'Batch No'}></SubTitle>                                                                 
                         <Autocomplete
                                                    className="w-full"
                                                    options={this.state.itembatchdata}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            // let formData = this.state.formData;
                                                            let formData = this.state.formData;
                                                            formData.batch_details = []
                                                            let batch_details ={}
                                                            value.forEach(element => {
                                                                formData.batch_details.push( 
                                                                    batch_details= {
                                                                        "item_batch_id" : element.id
                                                                    }
                                                                    )
                                                            });
                                                            //formData.uoms = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    // value={this.state.itembatchdata}
                                                    multiple
                                                    getOptionLabel={(option) => option.batch_no}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Batch No"
                                                            //variant="outlined"
                                                            // value={this.state.itembatchdata.find((v) => v.id == this.state.formData.created_by
                                                            //     )}
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            // validators={['required']}
                                                            // errorMessages={[
                                                            //     'this field is required',
                                                            // ]}
                                                        />
                                                    )}
                                                />   


                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={6}
                                >
                               <SubTitle title="Defect" />
                                            <Autocomplete
                                                className="w-full"
                                                options={
                                                    this.state.defectData
                                                }
                                                onChange={(e, value) => {
                                                    if (null != value) {
                                                        let formData = this.state.formData;
                                                        formData.defect_id =  value.id
                                                        this.setState({
                                                            formData
                                                        })
                                                    }
                                                }}

                                                // value={this.state.selected_consultant}
                                                getOptionLabel={(option) =>option?.name
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Select Defect"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={this.state.defectData.find((v) => v.id == this.state.formData.defect_id
                                                                )}
                                                        validators={['required']}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    />
                                                )}
                                            />

                                </Grid>


                                {/* manufacture table */}
                                <Grid className="mt-5" item="item" lg={12} md={12} sm={12} xs={12}>
                                    
                                    {this.state.manufactureLoading === true ? (
                                        <>
                                                <SubTitle title="Select Manufacture" />
                                                <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'}
                                                data={this.state.manufacture_list}
                                                columns={this.state.manufacture_list_column}
                                                options={{
                                                    filter: false,
                                                    filterType:'textField',
                                                    responsive: 'standard',
                                                    pagination: false,
                                                    serverSide: false,
                                                    count: this.state.totalManufacture,
                                                    rowsPerPage: 10,
                                                    page: this.state.manufacture_data.page,
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
                                                                this.setManufacturePage(
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

                                        </> 
                                ) : (
                                        //loading effect
                                        null
                                    )}
                                </Grid>

        
                        </Grid>


                        <Grid className="flex pt-2 pl-4">
                        <h5>Decision Details</h5>
                          
                        </Grid>
                        <hr />
                        <Grid 
                            container
                            className="flex p-8"
                            spacing={2}
                        >
                                                    <Grid
                                                                    item
                                                                    lg={6}
                                                                    md={6}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                        <SubTitle
                                                                            title={
                                                                                'Committee'
                                                                            }
                                                                        ></SubTitle>                                                                 
                                                                    <Autocomplete
                                                                        className="w-full"
                                                                        options={
                                                                            appConst.commitee_qa
                                                                        }
                                                                        /*  defaultValue={this.setState.all_uoms.find(
                                                                                   (v) => v.value == ''
                                                                               )}  */
                                                                        getOptionLabel={(
                                                                            option
                                                                        ) =>
                                                                            option.label
                                                                        }
                                                                        // value={
                                                                        //     this.state.formData.manufacturer_id
                                                                        // }
                                                                        /*  getOptionSelected={(option, value) =>
                                                                                  console.log("ok")
                                                                              } */

                                                                        // value={this.state.all_manufacturers.find((v) =>v.id === this.state.formData.manufacturer_id
                                                                        //         )}
                                                                        onChange={(event, value ) => {
                                                                            if (value != null) {
                                                                                let formData = this.state.formData;
                                                                                formData.committee =value.label;
                                                                                // formData.item_id = value.id;
                                                                                console.log('SR no',formData)
                                                                                this.setState({ 
                                                                                    formData
                                                                                    // srNo:true
                                                                                })
                                                                                // let formData = this.state.formData;
                                                                                // formData.sr_no = value;
                                                                               
                                                                            } else if(value == null) {
                                                                                let formData = this.state.formData;
                                                                                formData.committee =null;
                                                                                this.setState({
                                                                                     formData,
                                                                                    // srNo:false
                                                                                })
                                                                            }
                                                                        }}
                                                                      
                                                                        renderInput={(
                                                                            params
                                                                        ) => (
                                                                            <TextValidator
                                                                                {...params}
                                                                                placeholder="Committee"
                                                                                //variant="outlined"
                                                                                //value={}
                                                                                value={appConst.commitee_qa.find((v) => v.label == this.state.formData.committee
                                                                                )}
                                                                                fullWidth
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                variant="outlined"
                                                                                size="small"
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

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Commitee Date" />
                            <DatePicker
                                className="w-full"
                                placeholder="Commitee Date"
                                value={
                                   this.state.formData.committee_date
                                }
                                // views={['year']}
                                // inputFormat="yyyy"
                                // format="yyyy"
                                onChange={(date) => {
                                    let formData = this.state.formData
                                    formData.committee_date = dateParse(date)
                                    this.setState({
                                        formData,
                                    })
                                }}
                            />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={6}
                                lg={6}
                                // className="p-8"
                            > 
                                <SubTitle title="Committee Decision" />
                                <TextValidator
                                                    className="w-full"
                                                    placeholder="Committee Decision"
                                                    
                                                    name="Committee Decision"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.formData
                                                            .committee_decision
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
                                                                    committee_decision:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }}
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'This field is required',
                                                    ]}
                                                />
                           

                            </Grid>


                            <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    // className="p-8"
                                >
                                   <SubTitle title={'NMRA Final Decision'}  ></SubTitle>          
                                   <Autocomplete
                                                    className="w-full"
                                                    options={appConst.nmra_final_decision
                                                    }
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            // let formData = this.state.formData;
                                                            let formData = this.state.formData;
                                                            formData.nmra_final_decision = value.label
                                                            // formData.batch_no = []
                                                            // value.forEach(element => {
                                                            //     formData.batch_no.push(element.value)
                                                            // });
                                                            //formData.uoms = value.id
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                  
                                                    // multiple
                                                    getOptionLabel={(option) => option.label}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Select NMRA Final Decision"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={appConst.nmra_final_decision.find((v) => v.label == this.state.formData.nmra_final_decision
                                                                )}
                                                            validators={['required']}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />   

                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    // className="p-8"
                                > 
                                    <SubTitle title="Remark" />
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Remarks"
                                        name="Remarks"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        value={this.state.formData.nmra_remarks}
                                        type="text"
                                        // multiline="multiline"
                                        // rows={3}
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData = this.state.formData
                                            formData.nmra_remarks = e.target.value
                                            this.setState({
                                                formData
                                            })
                                        }}
                                        // validators={['required']}
                                        // errorMessages={[
                                        //     'this field is required',
                                        // ]}
                                    />
                               

                                </Grid>
                      
                         </Grid>
                                {/* 
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Manufacture Name</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Manufacture Address</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Batch No.</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Committee</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Committee Date</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Committee Decision</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid> 
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>NMRA Final Decision</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    lg={6}
                                >
                                    <Typography>Remarks</Typography>
                                    <TextValidator
                                        className="w-full"
                                        placeholder=""
                                        name="sr"
                                        multiLine={true}
                                        rows={3}
                                        // value={this.state.formData.description}
                                        type="text"

                                        variant="outlined"
                                        size="small"
                                        // onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>

                        */}
                       
                        <Divider/>
                        <Grid container spacing={2} className="p-5">
                            <Grid item>
                                <Button type="submit" 
                                // onClick={() => this.submit} 
                                startIcon="report">Submit Request</Button>
                            </Grid>
                            <Grid item>
                                <Button onClick={()=>{this.handleClose()}} className="bg-error" startIcon="close">Close</Button>
                            </Grid>
                        </Grid>
                        </ValidatorForm>
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
                    variant="filled">
                </LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(ADRNew);