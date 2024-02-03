import React, { Component, Fragment } from "react";
import {
    LoonsTable,
    LoonsCard,
    MainContainer,
} from "app/components/LoonsLabComponents";
import {
    Grid,

} from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import PharmacyService from "app/services/PharmacyService";
import { convertTocommaSeparated, dateParse, yearParse } from "utils";
import InventoryService from "app/services/InventoryService";
import ConsignmentService from "app/services/ConsignmentService";
import localStorageService from "app/services/localStorageService";
import WarehouseServices from "app/services/WarehouseServices";
import EstimationService from "app/services/EstimationService";
import Card from '@mui/material/Card';


class StockAvailabilty extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            msdqty: null,
            monthlyReq: null,
            balanceDue: null,
            instituteQty: null,
        }


    }

    async getBalanceDue() {

        const currentYear = new Date().getFullYear();
        const nextYear = new Date(currentYear + 1, 0, 1);
        const lastDateOfYear = new Date(nextYear - 86400000);
        const yearFiveYearsAgo = currentYear - 5;
        const firstDateOfYearFiveYearsAgo = new Date(yearFiveYearsAgo, 0, 1);

        let params = {
            search_type: 'TOTAL',
            item_id: this.props.item_id,
            from: dateParse(firstDateOfYearFiveYearsAgo),
            to: dateParse(lastDateOfYear)
        }

        let res = await ConsignmentService.getBalanceDueOnOrder(params)
        if (res.status === 200) {
            console.log('data checking mreq', res)
            this.setState({
                balanceDue: res.data.view
            }, () => { return "ok" })
        }
    }

    async getMonthlyReq() {
        const currentYear = new Date().getFullYear();
        const nextYear = new Date(currentYear + 1, 0, 1);
        const lastDateOfYear = new Date(nextYear - 86400000);
        const yearFiveYearsAgo = currentYear - 5;
        const firstDateOfYearFiveYearsAgo = new Date(yearFiveYearsAgo, 0, 1);
        let id = this.props.item_id

        let params1 = {
            item_id: id,
            estimation_from: dateParse(firstDateOfYearFiveYearsAgo),
            estimation_to: dateParse(lastDateOfYear),
            estimation_type: 'Annual',
            search_type: 'EstimationGroup'

        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        console.log("Current month:", currentMonth);

        const monthList = ['', 'jan', 'feb', 'mar', 'apr', 'may', 'june', 'july', 'aug', 'sep', 'oct', 'nov', 'dec']
        console.log('monthList', monthList[currentMonth])

        let params = {
            item_id: id,
            year: yearParse(new Date())
        }

        let res = await InventoryService.monthlyRequiremnt(params)
        console.log('data monthly req', res)
        if (res.status === 200) {
            let value = res.data.view.data.map((index) => {
                const currentMonthName = monthList[currentMonth - 1]; // Adjusting for zero-based index
                return index[currentMonthName];
            })

            if (value[0]) {
                this.setState({
                    monthlyReq: value[0],
                }, () => { return "ok" })
            } else {
                let res2 = await EstimationService.getAllEstimationITEMS(params1)

                if (res2.status === 200) {
                    let estimation = res2.data.view[0]?.estimation / 12

                    this.setState({
                        monthlyReq: estimation,
                    }, () => { return "ok" })
                }
            }
        }
        console.log('data monthly fianal value', this.state.monthlyReq)
    }

    async getMsdStock() {

        // let owner_id = await localStorageService.getItem("owner_id")
        let item = this.props.item_id

        let params = {
            search_type: 'ItemSum',
            owner_id: "000",
            not_expired: true,
            quantity_grater_than_zero: true,
            item_id: item

        }

        let batch_res = await WarehouseServices.getSingleItemWarehouse(params)
        console.log('batches_inc_data', batch_res)

        if (batch_res.status === 200) {


            let data = batch_res.data.view.data.filter((e) => (
                e.item_id === item
            ))
            console.log('batches_inc_data filter', data)

            this.setState({
                msdqty: data,

            }, () => { return "ok" })

        }

    }

    async getNationalStock() {

        let item = this.props.item_id

        let params2 = {
            search_type: 'ItemSum',
            // exd_wise: true,
            item_id: item,
            // batchwise:true,
            quantity_grater_than_zero: true,
            not_expired: true,
        }

        let batch_res2 = await WarehouseServices.getSingleItemWarehouse(params2)
        if (batch_res2.status === 200) {



            let data = batch_res2.data.view.data.filter((e) => (
                e.item_id === item
            ))

            console.log('sum22--------------dhdhdd--.>>>>>', data)
            this.setState({
                instituteQty: data,
            }, () => { return "ok" })

        }

    }

    // async getOtherStock(){

    //     let owner_id = await localStorageService.getItem("owner_id")
    //     let item = this.props.item_id

    //     let params3 = {
    //         search_type: 'SUM',
    //         owner_id: owner_id,
    //         other_warehouses: true,
    //         exp_date_grater_than_zero: true,
    //         items: [item]

    //     }
    //     if (owner_id != null) {
    //         let batch_res3 = await PharmacyService.getDrugStocks(params3)
    //         if (batch_res3.status === 201) {

    //             this.setState({
    //                 otherQty: batch_res3.data.posted.data,
    //             })



    //         }
    //     }

    // }

    async componentDidMount() {
        await this.getMsdStock()
        await this.getMonthlyReq()
        await this.getBalanceDue()
        await this.getNationalStock()

        this.setState({loaded:true})
        // this.getOtherStock()
    }

    render() {
        return (



            <Fragment>

                {this.state.loaded &&
                    <table className="w-full" border="1" cellpadding="1" cellspacing="1" style={{borderColor:'white'}} >
                        <thead>
                            <tr style={{width:'100%'}}> 
                                <td style={{width:'33%',textAlign:'center'}}>&nbsp;</td>
                                <td style={{width:'33%',textAlign:'center',backgroundColor:'#fdd870',fontWeight:600}}>QTY</td>
                                <td style={{width:'33%',textAlign:'center',backgroundColor:'#fdd870',fontWeight:600}}>Months</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{width:'100%'}}>
                                <td style={{textAlign:'center',backgroundColor:'#5d97ff',fontWeight:600}}>National</td>
                                <td style={{textAlign:'center'}}>{this.state.instituteQty ? convertTocommaSeparated(this.state.instituteQty[0]?.quantity || 0, 2) : 0}</td>
                                <td style={{textAlign:'center'}}>{this.state.monthlyReq ? convertTocommaSeparated((this.state.instituteQty[0]?.quantity / this.state.monthlyReq) || 0, 2) : 0}</td>
                            </tr>
                            <tr style={{width:'100%'}}>
                                <td style={{textAlign:'center',backgroundColor:'#5d97ff',fontWeight:600}}>MSD</td>
                                <td style={{textAlign:'center'}}>{this.state.msdqty ? convertTocommaSeparated(this.state.msdqty[0]?.quantity || 0, 2) : 0}</td>
                                <td style={{textAlign:'center'}}>{this.state.monthlyReq ? convertTocommaSeparated((this.state.msdqty[0]?.quantity / this.state.monthlyReq) || 0, 2) : 0}</td>
                            </tr>
                            <tr style={{width:'100%'}}>
                                <td style={{textAlign:'center',backgroundColor:'#5d97ff',fontWeight:600}}>Institutional</td>
                                <td style={{textAlign:'center'}}>{this.state.instituteQty ? convertTocommaSeparated((Number(this.state.instituteQty[0]?.quantity) - Number(this.state.msdqty.length>0? this.state.msdqty[0]?.quantity:0)) || 0, 2) : 0}</td>
                                <td style={{textAlign:'center'}}>{this.state.monthlyReq ? convertTocommaSeparated(((Number(this.state.instituteQty[0]?.quantity) - Number(this.state.msdqty.length>0? this.state.msdqty[0]?.quantity:0)) / this.state.monthlyReq) || 0, 2) : 0}</td>
                            </tr>
                            <tr style={{width:'100%'}}>
                                <td style={{textAlign:'center',backgroundColor:'#5d97ff',fontWeight:600}}>Balance Due</td>
                                <td style={{textAlign:'center'}}>{this.state.balanceDue ? convertTocommaSeparated(this.state.balanceDue[0]?.quantity || 0, 2) : 0}</td>
                                <td style={{textAlign:'center'}}>{this.state.monthlyReq ? convertTocommaSeparated((this.state.balanceDue[0]?.quantity / this.state.monthlyReq) || 0, 2) : 0}</td>
                            </tr>
                        </tbody>
                    </table>

                }





            </Fragment>

        );
    }
}

export default StockAvailabilty
