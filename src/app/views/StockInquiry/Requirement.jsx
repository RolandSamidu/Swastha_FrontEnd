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


class StockInquiryRequirement extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            msdqty:[],
            monthlyReq:[],
            balanceDue:[],
            instituteQty:[],
        }

        
    }

    async getBalanceDue(){

        const currentYear = new Date().getFullYear();
        const nextYear = new Date(currentYear + 1, 0, 1);
        const lastDateOfYear = new Date(nextYear - 86400000);
        const yearFiveYearsAgo = currentYear - 5;
        const firstDateOfYearFiveYearsAgo = new Date(yearFiveYearsAgo, 0, 1);

        let params ={
            search_type: 'TOTAL',
            item_id: this.props.sr_no,
            from:dateParse(firstDateOfYearFiveYearsAgo),
            to:dateParse(lastDateOfYear)
        }

        let res = await ConsignmentService.getBalanceDueOnOrder(params)
        if (res.status === 200) {
            console.log('data checking mreq', res)
            this.setState({
                balanceDue:res.data.view
            })
        }
    }

    async getMonthlyReq(){
        const currentYear = new Date().getFullYear();
        const nextYear = new Date(currentYear + 1, 0, 1);
        const lastDateOfYear = new Date(nextYear - 86400000);
        const yearFiveYearsAgo = currentYear - 5;
        const firstDateOfYearFiveYearsAgo = new Date(yearFiveYearsAgo, 0, 1);
        let id = this.props.sr_no

        let params1 = {
            item_id: id,
            estimation_from: dateParse(firstDateOfYearFiveYearsAgo),
            estimation_to: dateParse(lastDateOfYear),
            estimation_type:'Annual',
            search_type:'EstimationGroup'

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
            let value = res.data.view.data.map((index)=>{
                    const currentMonthName = monthList[currentMonth - 1]; // Adjusting for zero-based index
                    return index[currentMonthName];
            })

            if (value[0]) {
                this.setState({
                    monthlyReq:value[0],
                })
            } else {
                let res2 =  await EstimationService.getAllEstimationITEMS(params1)

                if (res2.status === 200){
                    let estimation = res2.data.view[0]?.estimation / 12

                    this.setState({
                        monthlyReq:estimation,
                    })
                }
            }
        }
        console.log('data monthly fianal value', this.state.monthlyReq)
    }

    async getMsdStock(){

        // let owner_id = await localStorageService.getItem("owner_id")
        let item = this.props.sr_no

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

           
            let data = batch_res.data.view.data.filter((e)=>(
                e.item_id === item
            ))
            console.log('batches_inc_data filter', data)

            this.setState({
                msdqty:data,

            })

        }

    }

    async getNationalStock(){

        let item = this.props.sr_no

        let params2 = {
            search_type: 'ItemSum',
            // exd_wise: true,
            item_id: item,
            // batchwise:true,
            quantity_grater_than_zero:true,
            not_expired: true,
        }

            let batch_res2 = await WarehouseServices.getSingleItemWarehouse(params2)
            if (batch_res2.status === 200) {

                

                let data = batch_res2.data.view.data.filter((e)=>(
                    e.item_id === item
                ))

                console.log('sum22--------------dhdhdd--.>>>>>', data)
                this.setState({
                    instituteQty: data,
                })

            }
        
    }

    // async getOtherStock(){

    //     let owner_id = await localStorageService.getItem("owner_id")
    //     let item = this.props.sr_no

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

    componentDidMount() {
        this.getMsdStock()
        this.getMonthlyReq()
        this.getBalanceDue()
        this.getNationalStock()
        // this.getOtherStock()
    }

    render() {
        return (


                    // <ValidatorForm>
                    //     <Grid container spacing={2}>
                    //         <Grid item xs={12} lg={8}>
                    //             <fieldset style={{ borderWidth: 3, borderRadius: 5, borderColor: '#FFD700', borderStyle: 'solid', width:'100%', backgroundColor:'#ffffcc', margin:'2px'}}>
                    //             <table style={{width:'100%'}}>
                    //                     <tr>
                    //                         <td style={{width:'20%'}}>Monthly Requirement</td>
                    //                         <td style={{width:'5%'}}></td>
                    //                         <td style={{width:'20%'}}>Msd Stock In Hand</td>
                    //                         <td style={{width:'5%'}}></td>
                    //                         <td style={{width:'20%'}}>Balance Due</td>
                    //                         <td style={{width:'10%'}}></td>
                    //                         <td style={{width:'20%'}}>(Msd Stock + Balance Due)Total</td>
                    //                     </tr>
                    //                     <tr>
                    //                         <td style={{width:'20%'}}>
                    //                             <input
                    //                                 fullWidth
                    //                                 variant="outlined"
                    //                                 size="small"
                    //                             />
                    //                         </td>
                    //                         <td style={{width:'5%'}}></td>
                    //                         <td style={{width:'20%'}}>
                    //                             <input
                    //                                 fullWidth
                    //                                 variant="outlined"
                    //                                 size="small"
                    //                             />
                    //                         </td>
                    //                         <td style={{width:'5%'}}> + </td>
                    //                         <td style={{width:'20%'}}>
                    //                             <input
                    //                                 fullWidth
                    //                                 variant="outlined"
                    //                                 size="small"
                    //                             />
                    //                         </td>
                    //                         <td style={{width:'10%'}}> = </td>
                    //                         <td style={{width:'20%'}}>
                    //                         <input
                    //                                 fullWidth
                    //                                 variant="outlined"
                    //                                 size="small"
                    //                             />
                    //                         </td>
                    //                     </tr>
                    //                     <tr>
                    //                         <td style={{width:'20%'}}>
                    //                             Duration In Months
                    //                         </td>
                    //                         <td style={{width:'5%'}}> {'-->'} </td>
                    //                         <td style={{width:'20%'}}>
                    //                             <input
                    //                                 fullWidth
                    //                                 variant="outlined"
                    //                                 size="small"
                    //                             />
                    //                         </td>
                    //                         <td style={{width:'5%'}}> + </td>
                    //                         <td style={{width:'20%'}}>
                    //                             <input
                    //                                 fullWidth
                    //                                 variant="outlined"
                    //                                 size="small"
                    //                             />
                    //                         </td>
                    //                         <td style={{width:'10%'}}> = </td>
                    //                         <td style={{width:'20%'}}>
                    //                         <input
                    //                                 fullWidth
                    //                                 variant="outlined"
                    //                                 size="small"
                    //                             />
                    //                         </td>
                    //                     </tr>
                    //                 </table>
                    //             </fieldset>
                    //         </Grid>
                    //         <Grid item xs={12} lg={4}>
                    //             <fieldset style={{ borderWidth: 3, borderRadius: 5, borderColor: '#FFD700', borderStyle: 'solid', width:'100%', backgroundColor:'#ffffcc', margin:'2px'}}>
                    //             <table style={{width:'100%'}}>
                    //                     <tr>
                    //                         <td style={{width:'100%'}}>National Stock</td>
                    //                     </tr>
                    //                     <tr>
                    //                         <td style={{width:'100%'}}>
                    //                             <input
                    //                                 fullWidth
                    //                                 variant="outlined"
                    //                                 size="small"
                    //                             />
                    //                         </td>
                    //                     </tr>
                    //                     <tr>
                    //                         <td style={{width:'100%'}}>
                    //                             <input
                    //                                 fullWidth
                    //                                 variant="outlined"
                    //                                 size="small"
                    //                             />
                    //                         </td>
                    //                     </tr>
                    //                 </table>
                    //             </fieldset>
                    //         </Grid>
                    //     </Grid>
                    // </ValidatorForm>
            <Fragment>
                <Grid container className="px-main-4 m-1 w-full">
                 <Card className="p-3 w-full" style={{backgroundColor:'#06B6D4'}}>
                    <ValidatorForm >
                        {/* <fieldset style={{ borderWidth: 1, borderRadius: 5, borderColor: '#0000FF', borderStyle: 'solid', width:'100%',  marginBottom: 2, marginTop: 2}}> */}
                        <Grid container>
                      
                                 <Grid item xs={12} sm={12} md={10} lg={10}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'20%'}}>Monthly Requirement</td>
                                            <td style={{width:'5%'}}></td>
                                            <td style={{width:'20%'}}>Msd Stock In Hand</td>
                                            <td style={{width:'5%'}}></td>
                                            <td style={{width:'20%'}}>Balance Due</td>
                                            <td style={{width:'5%'}}></td>
                                            <td style={{width:'25%',paddingRight:'3px', borderRight:'1px solid #0000FF'}}>(Msd Stock + Balance Due)Total</td>
                                        </tr>
                                        <tr>
                                            <td style={{width:'20%'}}>
                                                <TextValidator
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    // style={{backgroundColor:'white'}} 
                                                    value={convertTocommaSeparated(this.state.monthlyReq || 0, 2)}
                                                />
                                            </td>
                                            <td style={{width:'5%'}}></td>
                                            <td style={{width:'20%'}}>
                                                <TextValidator
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    // style={{backgroundColor:'white'}}
                                                    value={convertTocommaSeparated(this.state.msdqty[0]?.quantity || 0,2)}
                                                />
                                            </td>
                                            <td style={{width:'5%', textAlign:'center'}}> + </td>
                                            <td style={{width:'20%'}}>
                                                <TextValidator
                                                    value={convertTocommaSeparated(this.state.balanceDue[0]?.quantity || 0, 2)}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    // style={{backgroundColor:'white'}}
                                                />
                                            </td>
                                            <td style={{width:'5%', textAlign:'center'}}> = </td>
                                            <td style={{width:'25%',paddingRight:'3px', borderRight:'1px solid #0000FF'}}>
                                            <TextValidator
                                                    value={convertTocommaSeparated((Number(this.state.msdqty[0]?.quantity) + Number(this.state.balanceDue[0]?.quantity) )|| 0,2)}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    // style={{backgroundColor:'white'}}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{width:'20%'}}>
                                                Duration In Months
                                            </td>
                                            <td style={{width:'5%', textAlign:'center'}}> {'-->'} </td>
                                            <td style={{width:'20%'}}>
                                                <TextValidator
                                                value={this.state.monthlyReq ? convertTocommaSeparated((this.state.msdqty[0]?.quantity / this.state.monthlyReq) || 0 , 2) : 0}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    // style={{backgroundColor:'white'}}
                                                />
                                            </td>
                                            <td style={{width:'5%'}}></td>
                                            <td style={{width:'20%'}}>
                                                <TextValidator
                                                     value={this.state.monthlyReq ? convertTocommaSeparated((this.state.balanceDue[0]?.quantity / this.state.monthlyReq) || 0 , 2): 0}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    // style={{backgroundColor:'white'}}
                                                />
                                            </td>
                                            <td style={{width:'5%'}}></td>
                                            <td style={{width:'25%',paddingRight:'3px', borderRight:'1px solid #0000FF'}}>
                                                <TextValidator
                                                    value={this.state.monthlyReq ? convertTocommaSeparated(((Number(this.state.msdqty[0]?.quantity) + Number(this.state.balanceDue[0]?.quantity)) / this.state.monthlyReq) || 0, 2) : 0}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    // style={{backgroundColor:'white'}}
                                                />
                                            </td>
                                        </tr>
                                    </table>
                                </Grid>
                                {/* </fieldset>
                                <fieldset style={{ borderWidth: 3, borderRadius: 5, borderColor: '#FFD700', borderStyle: 'solid', width:'100%', backgroundColor:'#ffffcc'}}> */}
                                <Grid item xs={12} sm={12} md={2} lg={2}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'100%'}}>National Stock</td>
                                        </tr>
                                        <tr>
                                            <td style={{width:'100%'}}>
                                                <TextValidator
                                                    // value={ convertTocommaSeparated(((this.state.instituteQty ? Number(this.state.instituteQty[0]?.quantity) : 0) + (this.state.msdqty ? Number(this.state.msdqty[0]?.quantity) : 0) + (this.state.otherQty ? Number(this.state.otherQty[0]?.quantity) : 0 ) ) || 0, 2)}
                                                    value={this.state.instituteQty ? convertTocommaSeparated(this.state.instituteQty[0]?.quantity || 0, 2) : 0}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    // style={{backgroundColor:'white'}}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{width:'100%'}}>
                                                <TextValidator
                                                    value={this.state.monthlyReq ? convertTocommaSeparated(((this.state.instituteQty ? this.state.instituteQty[0]?.quantity : 0) / this.state.monthlyReq) || 0, 2 )  : 0}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    // style={{backgroundColor:'white'}}
                                                />
                                            </td>
                                        </tr>
                                    </table>
                                </Grid>
                             

                        </Grid>
                        {/* </fieldset> */}
                        
                    </ValidatorForm>
                    </Card>
                 </Grid>
             </Fragment>

        );
    }
}

export default StockInquiryRequirement
