import React, { Component, Fragment } from "react";
import {
    CardTitle,
    LoonsCard,
    MainContainer,
    Button,
    SubTitle
} from "app/components/LoonsLabComponents";
import {  Grid } from '@material-ui/core'
import StockInquiryItemDetails from './ItemDetails'
import StockInquiryRequirement from './Requirement'
import StockInquiryStockPosition from './StockPosition'
import StockInquiryNationalStock from './NationalStock'
import StockInquiryEstimateAndIssue from './EstimateAndIssue'
// import StockInquiryMsdStock from './MsdStock'
import StockInquiryOrderList from './OrdList'
import StockInquiryOtherStock from './OtherStock'

import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import  InventoryService  from 'app/services/InventoryService'



class StockInquiryDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            alert: false,
            message: "",
            severity: 'success',
            visible:false,
            loading:false,
            selectedSR:null,
            data:[],
            item_list:[],

            formData:{
                sr_no:null,
                search:null,
                name:null
            }
        }
    }

    async dataLoad(){

            this.setState({
                loading:true,
                visible:true
            },()=>{
                this.render()
            })
            
    }

    async getItem(value) {

        let data = {
            search: value
        }
        let res = await InventoryService.fetchAllItems(data)

        if (res.status === 200) {
            console.log("ITEM------------------------------->>", res)
            this.setState({ item_list: res.data.view.data })
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <Fragment>
                <Grid  className="px-main-8 m-1 w-full">
                    <ValidatorForm
                        onSubmit={() => {
                        this.dataLoad()
                    }}
                    >

                            <Grid container spacing={2} className="w-full mb-5">
                                <Grid item xs={3} direction="row">
                                    <SubTitle title="SR Number" />
                                    <Autocomplete
                                        disableClearable className="w-full"
                                        options={this.state.item_list}
                                        style={{backgroundColor:'white'}}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let formData = this.state.formData
                                                formData.item_id = value.id
                                                formData.sr_no = value.id
                                                formData.name = value.medium_description

                                                this.setState({
                                                    formData,
                                                    loading:false,
                                                })
                                                // this.getBatchInfo(value.id)
                                            }
                                            else if (value == null) {
                                                let formData = this.state.formData
                                                formData.item = null
                                                this.setState({
                                                    formData

                                                })
                                            }
                                        }}

                                        getOptionLabel={(
                                            option) => option.sr_no + ' - ' + option.medium_description}
                                        renderInput={(params) => (
                                            <TextValidator {...params}
                                                placeholder="Type SR or Name"
                                                //variant="outlined"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    if (e.target.value.length > 3) {
                                                        this.getItem(e.target.value);
                                                    }
                                                }}
                                                value={this.state.formData.sr_no + ' - ' + this.state.formData.name}
                                                validators={this.state.formData.item_id ? [] : ['required']}
                                                errorMessages={this.state.formData.item_id ? [] : ['this field is required']}
                                              
                                            />
                                        )} />
                                </Grid>
                                <Grid item xs={3} direction="row" className="mt-6">
                                    <Button 
                                        type='submit'
                                        onClick={() => {
                                            this.dataLoad()
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                    {/* </LoonsCard> */}
                </Grid>

            {this.state.visible ?
            <Grid className="px-main-8 m-1">
                        
                        <Fragment>
                            <Grid container>
                                <Grid item sm={12}>
                                    {this.state.loading ?
                                    <StockInquiryItemDetails sr_no={this.state.formData.sr_no}></StockInquiryItemDetails>
                                    :null}
                                </Grid>
                                <Grid item sm={12}>
                                    {this.state.loading ?
                                        <StockInquiryRequirement sr_no={this.state.formData.sr_no}></StockInquiryRequirement>
                                    :null}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={4} lg={4}> 
                                    {this.state.loading ?
                                        <StockInquiryStockPosition sr_no={this.state.formData.sr_no}></StockInquiryStockPosition>
                                    :null}
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                    {this.state.loading ?
                                        <StockInquiryOtherStock sr_no={this.state.formData.sr_no}></StockInquiryOtherStock>
                                    :null}
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                    {this.state.loading ?
                                        <StockInquiryNationalStock sr_no={this.state.formData.sr_no}></StockInquiryNationalStock>
                                    :null}
                                </Grid>
                                
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    {this.state.loading ?
                                        <StockInquiryEstimateAndIssue sr_no={this.state.formData.sr_no}></StockInquiryEstimateAndIssue>
                                    :null}
                                </Grid>
                                <Grid item sm={12}>
                                    {this.state.loading ?
                                        <StockInquiryOrderList sr_no={this.state.formData.sr_no}></StockInquiryOrderList>
                                    :null}
                                </Grid>
                            </Grid>
                        </Fragment>

                                 

                
                </Grid>
                 :null}     
            </Fragment>
        );
    }
}

export default StockInquiryDashboard
