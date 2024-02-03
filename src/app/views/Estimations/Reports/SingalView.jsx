
import React, { Component, Fragment } from "react";
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    FilePicker,
    LoonsTable,
    ImageView,
} from 'app/components/LoonsLabComponents';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Grid, IconButton, Tooltip, CircularProgress } from "@material-ui/core";
import localStorageService from 'app/services/localStorageService';
import EstimationAndConsumptions from "./EstimationAndConsumptions";
import StockInquiryItemDetails from './StockInquiryItemDetails'
import EstimateAndIssue from './EstimateAndIssue'
import EstimateAndIssueMSD from './EstimateAndIssueMSD'
import StockAvailabilty from './StockAvailabilty'
import StockAvailabiltyMSD from './StockAvailabiltyMSD'
import OldData from "./OldData";
import { includesArrayElements } from "utils";

class SingalView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            item_id: this.props.item_id,
            sr_no: this.props.sr_no,
            owner_id: this.props.owner_id,
            login_user_owner_id: null,
            estimationYear: null,
            consumptionData: null,
            userRoles:[]
        }
    }



    async componentDidMount() {
        console.log("sr no", this.props.sr_no)
        let owner_id = await localStorageService.getItem('owner_id')
        const userRoles = await localStorageService.getItem('userInfo').roles;

        this.setState({ userRoles,login_user_owner_id: owner_id, estimationYear: Number(this.props.estimationYear) - 1 })
    }




    async loadIssuedData(data) {

        this.setState({ consumptionData: data })
        console.log("consuption data props", this.state.consumptionData)
    }

    render() {
        return (
            <Fragment>

                <Grid className="mt-5" container spacing={1}>

                    <Grid item lg={12} md={12} xs={12} >
                        <LoonsCard>
                            <Grid container spacing={1}>
                                <Grid item lg={8} md={8} xs={12} >
                                    <StockInquiryItemDetails owner_id={this.state.owner_id} item_id={this.state.item_id} sr_no={this.state.sr_no} year={Number(this.props.estimationYear) - 1} estimationData={this.props.estimationData} dpView={this.props.dpView}></StockInquiryItemDetails>
                                </Grid>

                                {this.state.login_user_owner_id != '000' ?
                                    <Grid item lg={4} md={4} xs={12} >
                                        <StockAvailabilty owner_id={this.state.owner_id} item_id={this.state.item_id}></StockAvailabilty>

                                    </Grid>
                                    :
                                    <Grid item lg={4} md={4} xs={12} >
                                        {/* <StockAvailabiltyMSD  item_id={this.state.item_id}></StockAvailabiltyMSD> */}
                                        <StockAvailabilty owner_id={this.state.owner_id} item_id={this.state.item_id}></StockAvailabilty>


                                    </Grid>
                                }

                            </Grid>

                        </LoonsCard>

                    </Grid>




                    <Grid item lg={12} md={12} xs={12} >
                        <LoonsCard>
                            <CardTitle title={"Monthly Estimations(" + this.state.estimationYear + ")"} />
                            <EstimationAndConsumptions owner_id={this.state.owner_id} item_id={this.state.item_id} year={Number(this.props.estimationYear) - 1} estimationData={this.props.estimationData} dpView={this.props.dpView}></EstimationAndConsumptions>
                        </LoonsCard>
                    </Grid>

                    {this.state.login_user_owner_id != '000' ?
                        <Grid item lg={12} md={12} xs={12} >
                            <LoonsCard>
                                <CardTitle title={"Yearly Estimations/Issues"} />
                                <EstimateAndIssue owner_id={this.state.owner_id} item_id={this.state.item_id} year={Number(this.props.estimationYear) - 1} estimationData={this.props.estimationData} dpView={this.props.dpView}></EstimateAndIssue>
                            </LoonsCard>
                        </Grid>
                        :
                        <Grid item lg={12} md={12} xs={12} >
                            <LoonsCard>
                                <CardTitle title={"Yearly Estimations/Issues"} />
                                <EstimateAndIssueMSD item_id={this.state.item_id} year={Number(this.props.estimationYear) - 1} dpView={this.props.dpView} estimationData={this.props.estimationData}></EstimateAndIssueMSD>
                            </LoonsCard>
                        </Grid>
                    }



                    {
                    !includesArrayElements(this.state.userRoles, ['Devisional Pharmacist', 'RDHS'])&&
                          <Grid item lg={12} md={12} xs={12} >
                            <LoonsCard>
                                <CardTitle title={"Old Estimations"} />
                                <OldData sr_no={this.state.sr_no} owner_id={this.state.owner_id} dpView={this.props.dpView} estimationData={this.props.estimationData}></OldData>
                            </LoonsCard>
                        </Grid>
                    }


                </Grid>


            </Fragment>
        )
    }
}

export default SingalView
