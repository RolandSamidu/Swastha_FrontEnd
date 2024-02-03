import React, { Component, Fragment } from "react";
import MainContainer from "../../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../../components/LoonsLabComponents/CardTitle";
import { Grid, Typography, IconButton, Icon, Dialog, } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles'
import { LoonsCard, Button, SubTitle, LoonsSnackbar } from "../../../components/LoonsLabComponents";
import LoonsTable from "../../../components/LoonsLabComponents/Table/LoonsTable";

import QualityAssuranceService from "app/services/QualityAssuranceService";
import { convertTocommaSeparated, dateParse, dateTimeParse, yearParse } from "utils";
import { JSONTree } from 'react-json-tree';
import { Autocomplete } from '@material-ui/lab'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm, PrintHandleBar } from 'app/components/LoonsLabComponents'
import ConsignmentService from "app/services/ConsignmentService";
import InventoryService from "app/services/InventoryService";
import localStorageService from "app/services/localStorageService";

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';


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
    root: {
        display: 'flex',
    },
});


class ViewConsignmentSCO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: false,
            message: '',
            severity: 'success',

            totalItems: 0,
            loaded: false,
            selectedId: null,
            openSave:false,
            nmqal_log_data : [], 
            item_details: {},
            grnItemDetails: [],
            circular_no:null,
            selectedManufacturesName_list:[],
            response:{},
            remark: null,
            testResult:[],
            circular_info:[],

            nmqal_log_columns:[
                  {
                    name: 'log_report_no',
                    label: 'Log Report No',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.nmqal_log_data[dataIndex]?.log_report_no;
                            return <p>{data}</p>

                        },
                    },
                },
                {
                    name: 'log_no',
                    label: 'Log No',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.nmqal_log_data[dataIndex]?.QualityIncident?.log_no;
                            return <p>{data}</p>

                        },
                    },
                },
                {
                    name: 'batch_no',
                    label: 'Batch No',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.nmqal_log_data[dataIndex]?.QualityIncident?.ItemSnapBatch?.batch_no;
                            return <p>{data}</p>

                        },
                    },
                },
                {
                    name: 'exp_date',
                    label: 'Exp Date',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.nmqal_log_data[dataIndex]?.QualityIncident?.ItemSnapBatch?.exd;
                            return <p>{dateParse(data)}</p>

                        },
                    },
                },
            ],

            nmqal_recommendation_id : false,

            format:[],

            filterData: {
                id: null,
                template: null,
            },

            formData : {
                page: 0,
                limit:5
            },

            pre_filterData : {
                page: 0,
                limit:5
            },

            previous_data : {
                page: 0,
                limit:10,
                'order[0]': ['updatedAt', 'DESC'],
                status: 'Active'
            },

            manufacture_filterData : {
                page: 0,
                limit:10,
                status: 'Approved by Chief Pharmacist'
            },

            report_data :{
                ad_val : null,
                sco_officer_upplies_val : null,
                sco_distribution_val : null,
                msa_val : null,
            },

            tableData:[],
            columns: [
                {
                    name: 'circular_no',
                    label: 'Circular No',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'circular_date',
                    label: 'Circular Issued Date',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.tableData[dataIndex]?.circular_date;
                            return <p>{dateParse(data)}</p>

                        },
                    },
                },
                {
                    name: 'batch_no',
                    label: 'Batch No',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.tableData[dataIndex]?.data?.batch_no?.map((e)=>e)
                            return <p>{dateParse(data)}</p>

                        },
                        
                    },
                },
                {
                    name: 'decision',
                    label: 'Decision',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.tableData[dataIndex]?.NMQALRecommendation?.nmqal_recommendations;
                            return <p>{data}</p>

                        },
                    },
                },
               

            ],

            manufacture_loading:false,
            selectedManufacturesList:[],
            manufature_list:[],
            previous_data_table:[],
            manufacture_list_column: [
                {
                    name: '',
                    label: '',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            
                            if (this.state.manufature_list) {
                                return <input
                                    type="checkbox"
                                    style={{
                                        width: "20px",
                                        height: "20px", outline: "none",
                                        cursor: "pointer"
                                    }}
                                    value={this.state.manufature_list[dataIndex]?.Manufacturer?.id
                                    }
                                    // defaultChecked={this.state.manufacture_list.includes(this.state.supplier_data[dataIndex]?.id)}
                                    // checked={this.state.selectedSuppliersList.includes(this.state.supplier_data[dataIndex]?.id)}
                                    
                                    onClick={()=>{
                                        this.clickingManufacture(this.state.manufature_list[dataIndex]?.Manufacturer?.id,this.state.manufature_list[dataIndex]?.Manufacturer?.name )
                                    }}
                                />
                            } else {
                                return "N/A"
                            }

                        }
                    }
                },
                
                {
                    name: 'name',
                    label: 'Manufacture Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.manufature_list[tableMeta.rowIndex]?.Manufacturer?.name
                        },
                    }
                },
                {
                    name: 'manufacture_no',
                    label: 'Manufacture Reg No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.manufature_list[tableMeta.rowIndex]?.Manufacturer?.registartion_no
                        },
                    }
                },
            ],

            data: {},
            noOfContainer: 0,
            noOfItem: 0,
            msdOderListNo: null,
            consignmentHistoryData: [],
            printLoad:false,
            printdata:null,
            printEnale:false
        }
    }

    clickingManufacture(id, name) {
        // let selectedManufactures = this.state.selectedManufacturesList; 
        let selectedNameList = this.state.selectedManufacturesName_list; 
        let index = selectedNameList.indexOf(name);
    
        if (index === -1) {
            // selectedManufactures.push(id);
            selectedNameList.push(name);
        } else {
            // selectedManufactures.splice(index, 1);
            selectedNameList.splice(index, 1);
        }
    
        this.setState({ selectedManufacturesName_list : selectedNameList  }, ()=>{
            console.log('cheking asdadsdasdad',this.state.selectedManufacturesName_list )
        });
    }
   
    
    // load data to select format dropdown
    async getDocumentTypes() {

        let params = {
            type : 'QA Circulars'
        }
        let res = await QualityAssuranceService.GetQADocument(params)
        if (res.status === 200) {
            console.log('cheking textva data', res.data.view.data);
            this.setState({
                format : res.data.view.data
            })
             
        }

    }

    // data get from main page with props
    async loadData(){

        let res = await QualityAssuranceService.getNMQLRecommendationByID(this.state.selectedId,{})
        if (res.status === 200) {
            console.log('cheking res data', res.data.view.NMQALTests)
            const additionalData = [];
                let test_data = res.data.view.NMQALTests

                for (let index = 0; index < test_data.length; index++) {
                    const element = test_data[index];

                    additionalData.push({
                        test:element?.Test?.name,
                        specification:element?.Specification?.name,
                        result:element?.Result?.name,
                    });  
                }
                console.log('cheking res da-----------ta', additionalData)
            this.setState({
                data: res.data.view,
                testResult : additionalData
            }, ()=>{
                this.getItemDetails()
                this.getCircularData()
            })
        }
    }

    async getGrnItemDetails(data){
        console.log('cheking data', data);
        let batchList = data.map((index) => index?.QualityIncident?.item_batch_id)
        let uniqBatchDet = [...new Set(batchList)]

        let params = {
            // item_batch_id: ['7f67a52c-085f-4f11-a26a-92e832cde2db']
            item_batch_id: uniqBatchDet
        }

        let res = await ConsignmentService.getGRNItems(params)

        if (res.status === 200){
            console.log('chekinng grn item details', res)
            this.setState({
                grnItemDetails : res?.data?.view?.data
            })
        }

    }

    // get item information
    async getItemDetails(){

        // let id = data.map((e)=>e?.QualityIncident?.ItemSnapBatch?.item_id)
        let id = this.state.data?.NMQALLogs?.[0]?.QualityIncident?.ItemSnapBatch?.ItemSnap?.id

        const res = await InventoryService.fetchItemById({},id)

        if (res.status === 200){
            console.log('chekinng item info', res)

            this.setState({
                item_details: res?.data?.view
            })
        }
    }


    async getLogdata(){

        this.setState({nmqal_table_loading : false})

        let params = this.state.formData
        params.nmqal_recommendation_id = this.state.selectedId

        let res = await QualityAssuranceService.GetNMQAL_Log(params)

        if (res.status === 200){
            console.log('cheking log', res)
            this.setState({
                nmqal_log_data : res.data.view.data, 
                nmqal_table_loading : true
            },()=>{
               this.getGrnItemDetails(res.data.view.data) 
            })
        }
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        console.log(page)
        this.setState(
            {
                formData,
            },
            () => {
                this.getLogdata()
            }
        )
    }

    async setPrePage(page) {
        //Change paginations
        let pre_filterData = this.state.previous_data
        pre_filterData.page = page
        console.log(page)
        this.setState(
            {
                pre_filterData,
            },
            () => {
                this.getCircularData()
            }
        )
    }

    async componentDidMount() {
        let id = this.props.match.params.id;

        this.setState({
            selectedId : id
        }, ()=>{
            this.getDocumentTypes()
            this.loadData()
            this.getLogdata()
            this.getManufactures()
            this.getCircularInfo()
        })
    }

    async getCircularInfo(){

        let params = {nmqal_recommendation_id:this.state.selectedId }
        let res = await QualityAssuranceService.GetQaCirculars(params)

        console.log('dfghjkdfghjkdfghj', res)
        if (res.status === 200) {
            this.setState({
                circular_info:res.data.view.data
            })
        }

    }

    // get previous data
    async getCircularData(){

        let params = this.state.previous_data
        params.item_id = this.state.data?.NMQALLogs?.[0]?.QualityIncident?.ItemSnapBatch?.ItemSnap?.id

        let res = await QualityAssuranceService.GetQaCirculars(params)

        if (res.status === 200){
            console.log('checking previous info', res)

            const additionalData = [];
                let data = res.data.view.data

                for (let index = 0; index < data.length; index++) {
                    const element = data[index];

                    additionalData.push({
                        circular_no:element?.circular_no,
                        batch_no:element?.data?.batch_no?.map((e)=>e),
                        decision:element?.data?.decision,
                    });  
                }

            this.setState({
                tableData : res.data.view.data,
                pre_totalItems : res.data.view.totalItems,
                previous_data_table : additionalData
            })
        }
    }

    async getManufactures (){

        let params = {
            search_type : 'MANUFACTURE',
            nmqal_recommandation_id : this.state.selectedId
        }
       
        let res = await QualityAssuranceService.getAllNMQLRecommendations(params)

        if (res.status === 200){
            console.log('checking manuacture info', res)
            this.setState({
                manufature_list : res.data.view.data,
                manufacture_loading: true
            })
            
        }
    }

    async saveCircularReport(){

        this.setState({ openSave: false})

        var user = await localStorageService.getItem('userInfo');

        let po_noArray;
        const poSet = this.state.grnItemDetails
          .map((e) => e?.GRN?.Consignment?.pa_no)
          .every((item) => item === null || item === undefined);
        
        if (poSet) {
          po_noArray = [null];
        } else {
          po_noArray = this.state.grnItemDetails
            .map((e) => e?.GRN?.Consignment?.pa_no)
            .filter((pa_no) => pa_no !== null || pa_no !== undefined);
        } 

        let msd_orderlist_noArray;
        const orderNoSet = this.state.grnItemDetails
          .map((e) => e?.GRN?.Consignment?.order_no)
          .every((item) => item === null || item === undefined);
        
        if (orderNoSet) {
            msd_orderlist_noArray = [null];
        } else {
            msd_orderlist_noArray = this.state.grnItemDetails
            .map((e) => e?.GRN?.Consignment?.order_no)
            .filter((order_no) => order_no !== null || order_no !== undefined);
        } 

        let params = {
             nmqal_recommendation_id : this.state.selectedId,
             document_id : this.state.filterData.id,
             status : 'Active',
             data: {
                year: yearParse(new Date()) || null,
                date:dateParse(new Date()) || null,
                sample_details:null,
                po_no: po_noArray || null,
                msd_orderlist_no:msd_orderlist_noArray || null,
                quality_log_no:this.state.nmqal_log_data.map((e)=>e?.QualityIncident?.log_no) || null,
                product_name:this.state.item_details?.medium_description || null,
                sr_no:this.state.item_details?.sr_no || null,
                manufacturer_details:this.state.selectedManufacturesName_list || [],
                batch_no:this.state.nmqal_log_data.map((e)=>e.QualityIncident?.ItemSnapBatch?.batch_no) || null,
                date_of_manufacture:dateParse(this.state.nmqal_log_data.map((e)=>e.QualityIncident?.ItemSnapBatch?.mfd)) || null,
                date_of_expiary:dateParse(this.state.nmqal_log_data.map((e)=>e.QualityIncident?.ItemSnapBatch?.exd)) || null,
                nmqal_lr_no:this.state.data?.nmqal_no || null,
                analytical_report:this.state.data?.analytical_report || null,
                test_result : this.state.testResult || [],
                nmqal_recommendation:this.state.data?.nmqal_recommendations || null,
                item_category:this.state.item_details?.Serial?.Group?.Category?.code || null,
                ad_val : this.state.report_data.ad_val || null,
                sco_officer_upplies_val : this.state.report_data.sco_officer_upplies_val || null,
                sco_distribution_val : this.state.report_data.sco_distribution_val || null,
                msa_val : this.state.report_data.msa_val || null,
                previous_data : this.state.previous_data_table || null,
                decision : `<b>Discontinue to use the container which show the defect from above batch immediately.</b>`,
             },
             circular_date : dateParse(new Date()),
             created_by : user.id,
             item_category : this.state.item_details?.Serial?.Group?.Category?.code,
             remark:this.state.remark || null,
        }

        let res = await QualityAssuranceService.SaveQaCirculars(params)

        if (res.status){
            this.setState({
                alert: true,
                message: 'Circular Data Added Successful',
                severity: 'success',
                
            }, ()=>{
                window.location.reload()
                console.log('cheking incoming after save', res)
                if (res != null || res != undefined ) {
                    this.setState({
                        response : res.data.posted.res,
                        printEnale : true
                    })
                } 
                
            })
        } else {
            this.setState({
                alert: true,
                message: 'Adding Circular Report was Unsuccessful',
                severity: 'error',
            },()=>{
                window.location.reload()
            })
        }
    }

    printFunc(){
        console.log('ddggdggdgdgddddg', this.state.response)
        let data = this.state.response?.template
        // if (this.state.response != null) {
            this.setState({
                printdata: data,
                printLoad: true 
            })
        // }
        
    }


    render() {
        const { classes } = this.props
        
        // const template = this.state.filterData.template || ''
        let replacedTemplate = this.state.filterData.template || ''
        // const source = document.getElementById("test-result-template").innerHTML;
        // // Compile the template
        // const template = Handlebars.compile(source);

        replacedTemplate = replacedTemplate.replace('{{circular_no}}', this.state.response?.circular_no || null);
        replacedTemplate = replacedTemplate.replace('{{sr_no}}', this.state.item_details?.sr_no || null);
        replacedTemplate = replacedTemplate.replace('{{product_name}}', this.state.item_details?.medium_description || null);
        replacedTemplate = replacedTemplate.replace('{{batch_no}}', this.state.nmqal_log_data.map((e)=>e.QualityIncident?.ItemSnapBatch?.batch_no) || null);
        replacedTemplate = replacedTemplate.replace('{{po_no}}', this.state.grnItemDetails.map((e)=>e?.GRN?.Consignment?.po_no) || null);
        replacedTemplate = replacedTemplate.replace('{{msd_orderlist_no}}', this.state.grnItemDetails.map((e)=>e?.GRN?.Consignment?.order_no) || null);
        replacedTemplate = replacedTemplate.replace('{{date_of_expiary}}', dateParse(this.state.nmqal_log_data.map((e)=>e.QualityIncident?.ItemSnapBatch?.exd)) || null);
        replacedTemplate = replacedTemplate.replace('{{nmqal_lr_no}}', this.state.data?.nmqal_no || null);
        replacedTemplate = replacedTemplate.replace('{{analytical_report}}', this.state.data?.analytical_report || null);
        replacedTemplate = replacedTemplate.replace('{{nmqal_recommendation}}', this.state.data?.nmqal_recommendations || null);
        replacedTemplate = replacedTemplate.replace('{{quality_log_no}}', this.state.nmqal_log_data.map((e)=>e?.QualityIncident?.log_no) || null);
        replacedTemplate = replacedTemplate.replace('{{manufacturer_details}}', this.state.selectedManufacturesName_list || null);
        replacedTemplate = replacedTemplate.replace('{{year}}', yearParse(new Date()) || null);
        replacedTemplate = replacedTemplate.replace('{{date}}', dateParse(new Date()) || null);
        replacedTemplate = replacedTemplate.replace('{{date_of_manufacture}}', dateParse(this.state.nmqal_log_data.map((e)=>e.QualityIncident?.ItemSnapBatch?.mfd)) || null);
        replacedTemplate = replacedTemplate.replace('{{ad_val}}', this.state.report_data.ad_val || null);
        replacedTemplate = replacedTemplate.replace('{{sco_officer_upplies_val}}', this.state.report_data.sco_officer_upplies_val || null);
        replacedTemplate = replacedTemplate.replace('{{sco_distribution_val}}', this.state.report_data.sco_distribution_val || null);
        replacedTemplate = replacedTemplate.replace('{{msa_val}}', this.state.report_data.msa_val || null);

        if (this.state.testResult) {
        replacedTemplate = replacedTemplate
        .replace('{{#each test_result}}', '') // Remove {{#each test_result}}
        .replace('{{/each}}', ''); // Remove {{/each}}

        // Replace the {{this.test}}, {{this.specification}}, and {{this.result}} placeholders
        this.state.testResult.forEach(result => {
        replacedTemplate = replacedTemplate
            .replace('{{this.test}}', result.test)
            .replace('{{this.specification}}', result.specification)
            .replace('{{this.result}}', result.result);
        });
         }

        if (this.state.previous_data_table) {
            replacedTemplate = replacedTemplate
            .replace('{{#each previous_data}}', '') 
            .replace('{{/each}}', ''); // Remove {{/each}}
    
            this.state.testResult.forEach(result => {
            replacedTemplate = replacedTemplate
                .replace('{{this.circular_no}}', result.test)
                .replace('{{this.batch_no}}', result.specification)
                .replace('{{this.decision}}', result.result);
            });
        }

        // replacedTemplate = replacedTemplate.replace('{{test_result}}', this.state.testResult);
        replacedTemplate = replacedTemplate.replace('{{previous_data}}', this.state.previous_data_table || null);
        replacedTemplate = replacedTemplate.replace('{{decision}}', `<b>Discontinue to use the container which show the defect from above batch immediately.</b>`);

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={"Circular Report"} />

                        <Grid container spacing={2}>
                            <Grid item lg={5} md={12} sm={12} xs={12} >
                                {/* left side */}

                                <Grid container spacing={1} className="flex ">
                                    <Grid className="mt-5" xs={6}>
                                    <ValidatorForm>
                                    <SubTitle title="Select Format" />
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={this.state.format}
                                            clearOnBlur={true}
                                            clearText="clear"
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.id = value.id;
                                                    filterData.template = value.template;

                                                    this.setState({ filterData })
                                                }
                                            }} 
                                            
                                            getOptionLabel={(option) =>
                                                option.name ? option.name : ''
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    // value={this.state.filterData.vehicle_type}
                                                />
                                            )}
                                        />
                                        </ValidatorForm>
                                    </Grid>
                                </Grid>


                                <Grid container spacing={2} className="flex mt-5">

                                        <table className="w-full">
                                            {this.state.response && 
                                            <tr>
                                                <td style={{width:'38%', fontSize: '13px'}}><strong><p>Circular Number</p></strong></td>
                                                <td style={{width:'2%', fontSize: '13px'}}>:</td>
                                                <td style={{width:'60%', fontSize: '13px'}}>{this.state.circular_info?.[0]?.circular_no ? this.state.circular_info?.[0]?.circular_no  :(this.state.response?.circular_no ? this.state.response?.circular_no : null)}</td>
                                            </tr>
                                            }
                                            <tr>
                                                <td style={{width:'38%', fontSize: '13px'}}><strong><p>MSD Order List No</p></strong></td>
                                                <td style={{width:'2%', fontSize: '13px'}}>:</td>
                                                <td style={{ width: '60%', fontSize: '13px' }}>
                                                    {this.state.grnItemDetails
                                                        .filter((e) => e?.GRN?.Consignment?.order_no != null || e?.GRN?.Consignment?.order_no != undefined)
                                                        .map((e, index, filteredArray) => (
                                                        <span key={index}>
                                                            {e?.GRN?.Consignment?.order_no}
                                                            {index !== filteredArray.length - 1 && <br />}
                                                        </span>
                                                        ))}
                                                </td>

                                            </tr>
                                            <tr>
                                                <td style={{width:'38%', fontSize: '13px'}}><strong><p>PA Order No</p></strong></td>
                                                <td style={{width:'2%', fontSize: '13px'}}>:</td>
                                                <td style={{ width: '60%', fontSize: '13px' }}>
                                                    {this.state.grnItemDetails
                                                        .filter((e) => e?.GRN?.Consignment?.pa_no != null || e?.GRN?.Consignment?.pa_no != undefined)
                                                        .map((e, index, filteredArray) => (
                                                        <span key={index}>
                                                            {e?.GRN?.Consignment?.pa_no}
                                                            {index !== filteredArray.length - 1 && <br />}
                                                        </span>
                                                        ))}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{width:'38%', fontSize: '13px'}}><strong><p>SR Number</p></strong></td>
                                                <td style={{width:'2%', fontSize: '13px'}}>:</td>
                                                <td style={{width:'60%', fontSize: '13px'}}>{this.state.data?.NMQALLogs?.[0]?.QualityIncident?.ItemSnapBatch?.ItemSnap?.sr_no}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width:'38%', fontSize: '13px'}}><strong><p>Name of Product</p></strong></td>
                                                <td style={{width:'2%', fontSize: '13px'}}>:</td>
                                                <td style={{width:'60%', fontSize: '13px'}}>{this.state.item_details?.medium_description}</td>
                                            </tr>
                                        </table>

                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <div className="mb-3">
                                                {this.state.nmqal_table_loading ?
                                                    < LoonsTable
                                                        id={"consignmentDetails"}
                                                        data={this.state.nmqal_log_data}
                                                        columns={this.state.nmqal_log_columns}
                                                        options={{
                                                            pagination: true,
                                                            serverSide: true,
                                                            count: this.state.totalItems,
                                                            rowsPerPage: 5,
                                                            page: this.state.formData.page,
                                                            download: false,
                                                            print: false,
                                                            viewColumns: false,

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
                                                    ></LoonsTable>
                                                    : null}
                                            </div>
                                        </Grid>

                                        <table className="w-full">
                                            <tr>
                                                <td style={{width:'38%', fontSize: '13px'}}><strong><p>Date of Mft</p></strong></td>
                                                <td style={{width:'2%', fontSize: '13px'}}>:</td>
                                                <td style={{width:'60%', fontSize: '13px'}}>{dateParse(this.state.nmqal_log_data.map((e)=>e?.QualityIncident?.ItemSnapBatch?.mfd))}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width:'38%', fontSize: '13px'}}><strong><p>Manufacture</p></strong></td>
                                                <td style={{width:'2%', fontSize: '13px'}}>:</td>
                                                <td style={{width:'60%', fontSize: '13px'}}>{null}</td>
                                            </tr>
                                            </table>
                                            {/* manufacture table */}
                                            <Grid className="mb-5" item lg={12} md={12} sm={12} xs={12}>
                                                {this.state.manufacture_loading &&
                                                    <LoonsTable
                                                        id={'allAptitute'}
                                                        data={this.state.manufature_list}
                                                        columns={this.state.manufacture_list_column}
                                                        options={{
                                                            pagination: false,
                                                            serverSide: true,
                                                            count: this.state.totalItems,
                                                            rowsPerPage: 5,
                                                            page: this.state.formData.page,
                                                            download: false,
                                                            print: false,
                                                            viewColumns: false,
                                                        }}
                                                    >
                                                    </LoonsTable>
                                                }
                                            </Grid>
                                            <table className="w-full">
                                            <tr>
                                                <td style={{width:'38%', fontSize: '13px'}}><strong><p>NMQAL RL No</p></strong></td>
                                                <td style={{width:'2%', fontSize: '13px'}}>:</td>
                                                <td style={{width:'60%', fontSize: '13px'}}>{this.state.data?.nmqal_no}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width:'38%', fontSize: '13px'}}><strong><p>Analylical Report</p></strong></td>
                                                <td style={{width:'2%', fontSize: '13px'}}>:</td>
                                                <td style={{width:'60%', fontSize: '13px'}}>{this.state.data?.analytical_report}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width:'38%', fontSize: '13px'}}><strong><p>NMQAL Recommendation</p></strong></td>
                                                <td style={{width:'2%', fontSize: '13px'}}>:</td>
                                                <td style={{width:'60%', fontSize: '13px'}}>{this.state.data?.nmqal_recommendations}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width:'38%', fontSize: '13px'}}><strong><p>CEO - NMRA Instructions</p></strong></td>
                                                <td style={{width:'2%', fontSize: '13px'}}>:</td>
                                                <td style={{width:'60%', fontSize: '13px'}}>{this.state.nmqal_log_data.map((e)=>e?.NMQALRecommendation?.nmra_final_decision)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width:'38%', fontSize: '13px'}}><strong><p>Previous Circular on the same item</p></strong></td>
                                                <td style={{width:'2%', fontSize: '13px'}}>:</td>
                                                <td style={{width:'60%', fontSize: '13px'}}>{null}</td>
                                            </tr>
                                        </table>
                                        
                                        <Grid className="mt-5" item lg={12} md={12} sm={12} xs={12}>
                                            {/* {this.state.loaded ? */}
                                                < LoonsTable
                                                    id={"consignmentDetails"}
                                                    data={this.state.tableData}
                                                    columns={this.state.columns}
                                                    options={{
                                                        pagination: true,
                                                        serverSide: true,
                                                        count: this.state.pre_totalItems,
                                                        rowsPerPage: 5,
                                                        page: this.state.pre_filterData.page,
                                                        download: false,
                                                        print: false,
                                                        viewColumns: false,

                                                        onTableChange: (action, tableState) => {
                                                            switch (action) {
                                                                case 'changePage':
                                                                    this.setPrePage(tableState.page)
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
                                                ></LoonsTable>
                                                {/* : null} */}
                                        </Grid>
                                </Grid>

                                <ValidatorForm>
                                <Grid container spacing={2} className="mt-5">
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <SubTitle title="Relevant AD" />
                                            <TextValidator
                                                className="w-full"
                                                variant="outlined"
                                                size="small"
                                                placeholder="Relevant AD"
                                                // value={
                                                //     this.state.formData.examination_data[0]
                                                //         .other_answers[rowValue.test_name]
                                                //         ?.upper_range
                                                // }
                                                onChange={(e) => {
                                                    let data = this.state.report_data
                                                    data.ad_val = e.target.value
 
                                                    this.setState({
                                                     data
                                                    })
                                                 }}
                                                //validators={['required']}
                                                // errorMessages={['this field is required']}
                                            />
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <SubTitle title="Relevant SCO Officer Supplies" />
                                            <TextValidator
                                                className="w-full"
                                                variant="outlined"
                                                size="small"
                                                placeholder="Relevant SCO Officer Supplies"
                                                // value={
                                                //     this.state.formData.examination_data[0]
                                                //         .other_answers[rowValue.test_name]
                                                //         ?.upper_range
                                                // }
                                                onChange={(e) => {
                                                   let data = this.state.report_data
                                                   data.sco_officer_upplies_val = e.target.value

                                                   this.setState({
                                                    data
                                                   })
                                                }}
                                                //validators={['required']}
                                                // errorMessages={['this field is required']}
                                            />
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <SubTitle title="Relevant SCO Distribution" />
                                            <TextValidator
                                                className="w-full"
                                                variant="outlined"
                                                size="small"
                                                placeholder="Relevant SCO Distribution"
                                                // value={
                                                //     this.state.formData.examination_data[0]
                                                //         .other_answers[rowValue.test_name]
                                                //         ?.upper_range
                                                // }
                                                onChange={(e) => {
                                                    let data = this.state.report_data
                                                    data.sco_distribution_val = e.target.value
 
                                                    this.setState({
                                                     data
                                                    })
                                                 }}
                                                //validators={['required']}
                                                // errorMessages={['this field is required']}
                                            />
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <SubTitle title="Relevant MSA" />
                                            <TextValidator
                                                className="w-full" 
                                                variant="outlined"
                                                size="small"
                                                placeholder="Relevant MSA"
                                                // value={
                                                //     this.state.formData.examination_data[0]
                                                //         .other_answers[rowValue.test_name]
                                                //         ?.upper_range
                                                // }
                                                onChange={(e) => {
                                                    let data = this.state.report_data
                                                    data.msa_val = e.target.value
 
                                                    this.setState({
                                                     data
                                                    })
                                                 }}
                                                //validators={['required']}
                                                // errorMessages={['this field is required']}
                                            />
                                        </Grid>

                                        <Grid className="mt-5" item lg={12} md={12} sm={12} xs={12}>
                                            <SubTitle title="Remark" />
                                            <TextValidator
                                                className="w-full" 
                                                variant="outlined"
                                                size="small"
                                                placeholder="Remark"
                                                // value={
                                                //     this.state.formData.examination_data[0]
                                                //         .other_answers[rowValue.test_name]
                                                //         ?.upper_range
                                                // }
                                                onChange={(e) => {
                                                    // let data = this.state.remark
                                                    // data.msa_val = e.target.value
 
                                                    this.setState({
                                                     remark : e.target.value
                                                    })
                                                 }}
                                                //validators={['required']}
                                                // errorMessages={['this field is required']}
                                            />
                                        </Grid>
                                </Grid>
                                </ValidatorForm>
                                        
                                <Grid container spacing={2} className="flex mt-5">
                                    <Grid style={{textAlign:'right'}} item lg={12} md={12} sm={12} xs={12}>
                                        <Button onClick={()=>{this.setState({openSave:true})}}>Save</Button>
                                    </Grid>

                                </Grid>
                            </Grid>

                            <Grid className="mt-5" item lg={7} md={12} sm={12} xs={12} >
                                {/* right side */}
                                <div style={{ border: '1px solid black', minHeight: '600px', maxHeight:'1000px', padding:'10px', overflow: 'auto' }}>
                                    {this.state.filterData.template ? (
                                        <div dangerouslySetInnerHTML={{ __html: replacedTemplate }} />
                                    ) : null}
                                </div>

                                {this.state.printEnale &&
                                    <div className="mt-5" style={{display: 'flex' , alignItems: 'flex-end'}}>
                                        <Button onClick={()=>{
                                            this.printFunc()
                                        }}>Print</Button>
                                    </div>
                                }
                                {/* <PrintHandleBar  content={this.state.filterData.template} ></PrintHandleBar> */}

                            </Grid>
                        </Grid>

                        {/* <Grid container spacing={2} className="mt-5">
                                
                            <Grid
                            item
                            xs={12}
                            sm={12}
                            md={8}
                            lg={8}
                            // className="p-8"
                            > 
                            <ValidatorForm>
                                    <SubTitle title="Notes :" />
                                    <TextValidator
                                    className="w-full"
                                    placeholder="Add Notes"
                                    
                                    name="notes"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    // value={
                                    //     this.state.formData
                                    //         .notes
                                    // }
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
                                                    notes:
                                                    e.target
                                                        .value,
                                            },
                                        })
                                    }}
                                    // validators={[
                                    //     'required',
                                    // ]}
                                    // errorMessages={[
                                    //     'This field is required',
                                    // ]}
                                />
                            </ValidatorForm>
                            </Grid>

                            <Grid
                            xs={12}
                            sm={12}
                            md={4}
                            lg={4}
                             item className="mt-4">
                                <div className="mt-15">
                                    <Button className='mr-5' style={{backgroundColor:'Green'}}>Apprive</Button>
                                    <Button style={{backgroundColor:'Red'}}>Reject</Button>
                                </div>
                            </Grid>
                                
                        </Grid> */}
                    </LoonsCard>
                </MainContainer>

                <Dialog fullScreen maxWidth="lg " open={this.state.printdata} onClose={() => { this.setState({ printdata: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Circular Report" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    printdata: false

                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>

                        <Grid container>
 
                            <PrintHandleBar buttonTitle={"Print"} content={this.state.printdata} title="Circular Report"></PrintHandleBar>

                        </Grid>


                    </MainContainer>
                </Dialog>

                <Dialog
                    fullWidth
                    maxWidth="xs"
                    open={this.state.openSave}
                    onClose={() => {
                        this.setState({ openSave: false })
                    }}
                    >
                    <div className="w-full h-full px-10 py-5">
                        <Grid container className=''>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Typography className="text-center" variant="h6" >Do you want to save ?</Typography>
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
                                    color='primary'
                                    onClick={() => { this.saveCircularReport() }}
                                    >
                                        <span className="capitalize">Yes</span>
                                </Button>
                                <Button
                                    className='mt-4'
                                    progress={false}
                                    type=""
                                    scrollToTop={false}
                                    style={{backgroundColor: 'red'}}
                                    onClick={() => { 
                                        this.setState(
                                            {
                                                openSave: false
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
            </Fragment >
        )
    }
}

export default withStyles(styleSheet)(ViewConsignmentSCO)