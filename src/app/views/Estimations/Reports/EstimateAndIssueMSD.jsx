import React, { Component, Fragment } from "react";
import {
    ProgressbarWithColor
} from "app/components/LoonsLabComponents";
import { Grid, CircularProgress } from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import EstimationService from "app/services/EstimationService";
import InventoryService from "app/services/InventoryService";
import { convertTocommaSeparated, dateParse, yearParse } from "utils";
import WarehouseServices from "app/services/WarehouseServices";
import Card from '@mui/material/Card';


class EstimateAndIssueMSD extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            dataout: [],
            mainData: [],

            data: [],

        }
    }

    async dataLoad() {

        //const currentYear = new Date().getFullYear();
        const currentYear = this.props.year;
        const lastDateOfYear = new Date(this.props.year+1, 0, 0);
        
        const yearFiveYearsAgo = currentYear - 5;
        const firstDateOfYearFiveYearsAgo = new Date(yearFiveYearsAgo, 0, 1);
        let id = this.props.item_id
        let updatedArray = []

        let params = {
            item_id: id,
            from: dateParse(firstDateOfYearFiveYearsAgo),
            to: dateParse(lastDateOfYear),
            type: 'Yearly',
            search_type: 'Consumption'

        }
        let res = await WarehouseServices.getConsumptionDetails(params)

        // if(res.status === 200){
        //     console.log('inc data------------------>>>>',res.data.view)
        //     // this.getMonthlyReq(res.data.view)
        // }


        let par = {
            item_id: id,
            estimation_from: dateParse(firstDateOfYearFiveYearsAgo),
            estimation_to: dateParse(lastDateOfYear),
            estimation_type: 'Annual',
            search_type: 'EstimationGroup'
        }

        let resp = await EstimationService.getAllEstimationITEMS(par)

        if (resp.status === 200 && res.status === 200) {
            console.log('inc data---------jjjbjbjbj--------->>>> 1', res.data.view)
            console.log('inc data---------jjjbjbjbj--------->>>>', resp.data.view)


            updatedArray = resp.data.view.map((obj1) => {
                const obj2 = res.data.view.find((obj) => (obj.item_id === obj1.item_id && obj.year == obj1.year));

                obj1.msd_issuance = obj2?.msd_issuance
                //obj1.fr = obj2?.fr

                return obj1;
            });
        }

        this.setState({
            mainData: updatedArray,
           // dataout:updatedArray,
            //loaded:true

        }, () => {
            this.getMonthlyReq()
        })
    }

     async getMonthlyReq() {

        console.log('check shs data------->>>>', this.state.mainData)
        let yearlist = this.state.mainData.map((dataset) => dataset.year)
        let params = {
            item_id: this.props.item_id,
            year: yearlist
        }

        let updatedArray = []
        let res = await InventoryService.monthlyRequiremnt(params)


        if (res.status === 200) {
            console.log('year data------->>>>', res.data.view)

            updatedArray = this.state.mainData.map((obj1) => {
                const obj2 = res.data.view.data.find((obj) => (obj.item_id === obj1.item_id && yearParse(obj.createdAt)==obj1.year));

                obj1.fr = obj2?.annual_quantity

                return obj1;
            });
            this.setState({
                dataout: updatedArray.reverse(),


            }, () => {
                setTimeout(() => {
                    this.setState({
                        loaded: true
                    })
                }, 300);
            })
        }

    } 

    componentDidMount() {
        this.dataLoad()
    }

    render() {
        return (
            <Fragment>


                {this.state.loaded ?
                    <table className="w-full" border="1" cellpadding="1" cellspacing="1" style={{ borderColor: 'white' }} >
                        <thead>
                            <tr style={{ width: '100%' }}>
                                <td style={{ width: '15%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Year</td>
                                <td style={{ width: '20%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Annual Estimate</td>
                                {/* <td style={{ width: '15%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>F.R</td> */}
                                <td style={{ width: '20%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Issued QTY</td>
                                <td style={{ width: '45%', textAlign: 'center', backgroundColor: '#9C27B0', fontWeight: 600 }}>Issued / Estimate</td>
                            </tr>
                        </thead>
                        <tbody>

                            {this.state.dataout.map((item) => {
                                return (
                                    <tr style={{ width: '100%' }}>
                                        <td style={{ textAlign: 'center', backgroundColor: '#5d97ff' }}>{item.year}</td>
                                        <td style={{ textAlign: 'center' }}>{convertTocommaSeparated(item?.estimation || 0, 2)}</td>
                                        {/* <td style={{ textAlign: 'center' }}>{convertTocommaSeparated(item?.fr || 0, 2)}</td> */}
                                        <td style={{ textAlign: 'center' }}>{convertTocommaSeparated(Math.abs(item?.msd_issuance || 0), 2)}</td>
                                        <td className="px-2" style={{ textAlign: 'center' }}>
                                            <ProgressbarWithColor value={Math.abs(item?.msd_issuance || 0) / (item?.estimation || 1) * 100}></ProgressbarWithColor>

                                        </td>
                                    </tr>
                                )
                            })}



                        </tbody>
                    </table>
                    :
                    <Grid className="justify-center text-center w-full pt-12">
                        <CircularProgress size={30} />
                    </Grid>
                }





            </Fragment>
        );
    }
}

export default EstimateAndIssueMSD
