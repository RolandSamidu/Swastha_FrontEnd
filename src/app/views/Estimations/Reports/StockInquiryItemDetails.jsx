import React, { Component, Fragment } from "react";
import {
    LoonsTable,
    LoonsCard,
    MainContainer,
    SubTitle,
} from "app/components/LoonsLabComponents";
import { Grid, CircularProgress, Typography, Chip, Tooltip, Icon } from '@material-ui/core'
import AirplayIcon from '@material-ui/icons/Airplay';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import WarehouseServices from 'app/services/WarehouseServices'
import { Warehouse } from "@mui/icons-material";
import InventoryService from 'app/services/InventoryService'
import Card from '@mui/material/Card';
import { withStyles } from '@material-ui/styles';
import EstimationService from "app/services/EstimationService";
import { convertTocommaSeparated, dateParse, includesArrayElements } from "utils";
import localStorageService from "app/services/localStorageService";

const styles = {
    textValue: {
        fontWeight: 600,
        fontSize: '13px'
    },
    card: {
        padding: 2,
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#c1c1be',
        height: '100%'
    },
    cardRoot: {
        padding: 2,
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#c1c1be',
        height: '100%'
    },
    cardCenterAlign: {
        padding: 2,
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#c1c1be',
        height: '100%',
        color: '#fdfdfd',
        textAlign: 'center',
        justifyContent: 'center',
        display: 'flex'
    },
    cardCenterAlignFixHeight: {
        padding: 2,
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#c1c1be',
        height: '100%',
        color: '#c10000',
        textAlign: 'center',
        justifyContent: 'center',
        display: 'flex',
        width: 20,
        height: 20,
        marginLeft: 1,
        marginRight: 1,
        alignItems: 'center'
    }

}

class StockInquiryItemDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            totalItems: null,
            final_forcast: 0,
            dataObj: {},

            formData: {
                page: 0,
            },

            data: [],
            consumptionFilterData: {
                sr_no: this.props.sr_no,
                year: null,
                owner_id: this.props.owner_id,
                page: 0,
                limit: 20,
            }
        }
    }

    async getItemDetails() {

        let id = this.props.item_id

        let res = await InventoryService.fetchItemById({}, id)

        if (res.status === 200) {
            console.log('cheking info', res)

            this.setState({
                data: [res.data.view],
                dataObj: res.data.view
            }, () => {
                setTimeout(() => {
                    this.setState({
                        loaded: true
                    })
                }, 300);
            })
        }
    }

    async loadForcastData() {
        const userRoles = await localStorageService.getItem('userInfo').roles;
        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')

        let consumptionFilterData = this.state.consumptionFilterData
        if (includesArrayElements(userRoles, ['Devisional Pharmacist', 'RDHS']) && this.props.dpView) {
            consumptionFilterData = {
                sr_no: this.props.sr_no,
                owner_id: null,
                district: login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district,
                provincial: this.props.estimationData.institute_category == "Provincial" ? true : null,
            }
        }



        let consupm_res = await EstimationService.getTempConsumption(consumptionFilterData)
        if (consupm_res.status == 200) {
            console.log("consumption data", consupm_res)
            this.setState({
                consumptionData: consupm_res.data.view.data,
                conTotalItems: consupm_res.data.view.totalItems,
                conLoaded: true
            })
        }

        const lastDateOfYear = new Date(this.props.year + 1, 0, 0);
        const currentYear = this.props.year;
        const yearFiveYearsAgo = currentYear - 5;
        const firstDateOfYearFiveYearsAgo = new Date(yearFiveYearsAgo, 0, 1);

        let params

        if (includesArrayElements(userRoles, ['Devisional Pharmacist', 'RDHS']) && this.props.dpView) {

            params = {
                item_id: this.props.item_id,
                district: login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district,
                provincial: this.props.estimationData.institute_category == "Provincial" ? true : null,
                from: dateParse(firstDateOfYearFiveYearsAgo),
                to: dateParse(lastDateOfYear),
                type: 'Yearly',
                search_type: 'CONSUMPTION'

            }
        } else {
            params = {
                item_id: this.props.item_id,
                owner_id: this.props.owner_id,
                from: dateParse(firstDateOfYearFiveYearsAgo),
                to: dateParse(lastDateOfYear),
                type: 'Yearly',
                search_type: 'CONSUMPTION'

            }
        }


        let res = await WarehouseServices.getWarehouseHistories(params)

        console.log('issued qty', res)
        if (res.status === 200 && consupm_res.status == 200) {
            this.calculateForecastedAdjustedConsumption(consupm_res.data.view.data, res.data.view)
        }


    }

    async calculateForecastedAdjustedConsumption(prontoConsumtionData, swasthaData) {

        let swastha_impliment_month = 7
        const d = new Date();
        let currentMonth = d.getMonth() + 1;

        //let 2023 data from pronto , swastha data
        let specificYearData_pronto = prontoConsumtionData.filter((x) => (x.year == '2023' && x.consumption != 0))
        let specificYearData_swastha = swasthaData.filter((x) => (x.year == '2023' && x.consumption != 0))

        //let without 2023 data
        let pronto_other = prontoConsumtionData.filter((x) => (x.year != '2023' && x.consumption != 0))
        let swastha_other = swasthaData.filter((x) => (x.year != '2023' && x.consumption != 0))

        console.log('data 1', specificYearData_pronto)
        console.log('data 2', specificYearData_swastha)

        console.log('data 3', pronto_other)
        console.log('data 4', swastha_other)


        let otherMonths_pronto = pronto_other.length * 12
        let otherMonths_swastha = swastha_other.length * 12

        let specificYearsMonths_pronto = specificYearData_pronto.length * swastha_impliment_month
        let specificYearsMonths_swastha = specificYearData_swastha.length * Math.abs(currentMonth - swastha_impliment_month)

        console.log('pronto months others', otherMonths_pronto)
        console.log('swastha months others', otherMonths_swastha)

        console.log('pronto months in 2023', specificYearsMonths_pronto)
        console.log('swastha months in 2023', specificYearsMonths_swastha)

        let totalConsumption_pronto = pronto_other.reduce((acc, curr) => acc + Math.abs(curr.consumption), 0) +
            specificYearData_pronto.reduce((acc, curr) => acc + Math.abs(curr.consumption), 0);

        let totalConsumption_swastha = swastha_other.reduce((acc, curr) => acc + Math.abs(Number(curr.consumption || 0)), 0) +
            specificYearData_swastha.reduce((acc, curr) => acc + Math.abs(Number(curr.quantity || 0)), 0)


        console.log("consumption total", totalConsumption_pronto);
        console.log("consumption total swastha", totalConsumption_swastha);

        let total_months = (specificYearsMonths_pronto || 0) + (specificYearsMonths_swastha || 0) + (otherMonths_pronto || 0) + (otherMonths_swastha || 0)

        console.log("total months", total_months)
        let final_forcast = convertTocommaSeparated(Math.round((((totalConsumption_pronto + totalConsumption_swastha) / (total_months || 1)) * 13)), 2, 0)
        console.log("final_forcast", final_forcast)
        this.setState({
            final_forcast
        })

    }


    componentDidMount() {
        this.getItemDetails()
        this.loadForcastData()
    }

    renderSubTitle(title) {
        return <Typography className="font-semibold text-12 mt-1 mb-1" style={{ lineHeight: '1', color: 'gray' }}>{title}</Typography>
    }

    render() {
        const { classes } = this.props
        return (
            <Fragment>
                {this.state.loaded ?
                    <div className="w-full">
                        <Grid container spacing={1}>
                            <Grid className="px-1 py-1" item lg={2} md={2} xs={12}  >
                                <div className={classes.card} style={{ backgroundColor: '#ffeb00' }}>
                                    {this.renderSubTitle("SR Number")}
                                    <Typography className={classes.textValue} variant="p">{this.state.data[0]?.sr_no}</Typography>
                                </div>

                            </Grid>


                            <Grid className="px-1 py-1" item lg={6} md={6} xs={12} >
                                <div className={classes.card} style={{ backgroundColor: '#a3d3b1' }}>
                                    {this.renderSubTitle("Item Name")}
                                    <Typography className={classes.textValue} variant="p">{this.state.data[0]?.medium_description}</Typography>
                                </div>
                            </Grid>

                            <Grid className="px-1 py-1" item lg={1} md={1} xs={12} >
                                <div className={classes.card} style={{ backgroundColor: '#b0b9e9' }}>
                                    {this.renderSubTitle("UOM")}
                                    <Typography className={classes.textValue} variant="p">{this.state.data[0]?.ItemUOM[0]?.UOM?.description}</Typography>
                                </div>
                            </Grid>

                            <Grid className="px-1 py-1 h-full" item lg={3} md={3} xs={3} >
                                <div className={classes.cardRoot} style={{ backgroundColor: '#dfdfdf' }}>
                                    <Grid container>

                                        <Grid className="px-1 py-1" item lg={4} md={4} xs={12} >
                                            <Tooltip
                                                arrow
                                                TransitionProps={{ timeout: 1000 }}
                                                title='VEN'
                                            >
                                                <div className={classes.cardCenterAlign} style={{ backgroundColor: '#cb0f0f' }}>
                                                    <Typography variant="h6">{this.state.data[0]?.VEN?.name}</Typography>
                                                </div>
                                            </Tooltip>
                                        </Grid>

                                        <Grid className="px-1 py-1" item lg={4} md={4} xs={12} >
                                            <Tooltip
                                                arrow
                                                TransitionProps={{ timeout: 1000 }}
                                                title='ABC Class'

                                            >
                                                <div className={classes.cardCenterAlign} style={{ backgroundColor: '#076c00' }}>
                                                    <Typography variant="h6">{this.state.data[0]?.AbcClass?.name}</Typography>
                                                </div>
                                            </Tooltip>
                                        </Grid>
                                        <Grid className="px-1 py-1" item lg={4} md={4} xs={12} >
                                            <Tooltip
                                                arrow
                                                TransitionProps={{ timeout: 1000 }}
                                                title='Item Type'

                                            >
                                                <div className={classes.cardCenterAlign} style={{ backgroundColor: '#f5c206' }}>
                                                    <Typography variant="h6">{this.state.data[0]?.ItemType?.name}</Typography>
                                                </div>
                                            </Tooltip>
                                        </Grid>
                                        
                                    </Grid>
                                </div>
                            </Grid>

                        </Grid>


                        <Grid container className="w-full" spacing={1}>

                            <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography className={classes.textValue} variant="p">Priority</Typography>

                                <div className={classes.cardCenterAlignFixHeight} style={{ backgroundColor: '#d5d3c5' }}>
                                    <Typography className={classes.textValue} variant="p">{this.state.dataObj?.priority == 'No' ? "N" : "Y"}</Typography>
                                </div>
                            </Grid>

                            <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography className={classes.textValue} variant="p">Estimated Item</Typography>

                                <div className={classes.cardCenterAlignFixHeight} style={{ backgroundColor: '#d5d3c5' }}>
                                    <Typography className={classes.textValue} variant="p">{this.state.dataObj?.used_for_estimates}</Typography>
                                </div>
                            </Grid>
                            <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography className={classes.textValue} variant="p">Formulary Approved </Typography>

                                <div className={classes.cardCenterAlignFixHeight} style={{ backgroundColor: '#d5d3c5' }}>
                                    <Typography className={classes.textValue} variant="p">{this.state.dataObj?.formulatory_approved}</Typography>
                                </div>
                            </Grid>
                            <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography className={classes.textValue} variant="p">Used for Formulary </Typography>

                                <div className={classes.cardCenterAlignFixHeight} style={{ backgroundColor: '#d5d3c5' }}>
                                    <Typography className={classes.textValue} variant="p">{this.state.dataObj?.used_for_formulation}</Typography>
                                </div>
                            </Grid>
                            <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography className={classes.textValue} variant="p">Consumable </Typography>

                                <div className={classes.cardCenterAlignFixHeight} style={{ backgroundColor: '#d5d3c5' }}>
                                    <Typography className={classes.textValue} variant="p">{this.state.dataObj?.consumables}</Typography>
                                </div>
                            </Grid>

                            <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Chip
                                    icon={<AirplayIcon />}
                                    label="Item Details"
                                    onClick={() => { window.open(`/item-mst/view-item-mst/${this.props.item_id}`, "_blank").focus(); }}
                                    color="secondary"
                                />
                            </Grid>
                        </Grid>


                        <Grid container className="w-full" spacing={1}>
                            <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography style={{ fontSize: 16, fontWeight: 600, color: '#c00000' }} variant="p">Annual Forecasted Adjusted Consumption : </Typography>

                                <div >
                                    <Typography style={{ fontSize: 16, fontWeight: 600, color: '#c00000' }} variant="p">{this.state.final_forcast}</Typography>
                                </div>
                            </Grid>

                        </Grid>

                    </div>

                    :
                    <Grid className="justify-center text-center w-full pt-12">
                        <CircularProgress size={30} />
                    </Grid>
                }



            </Fragment>
        );
    }
}

export default withStyles(styles)(StockInquiryItemDetails)
