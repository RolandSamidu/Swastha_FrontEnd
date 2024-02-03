/*
Loons Lab Sub title component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import { Divider, Typography, Grid, Icon } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any, string } from "prop-types";
import defaultLetterHead from '../PrintIssueNote/defaultLetterHead.jpg';
import defaultFooter from '../PrintIssueNote/defaultFooter.jpg';
import { Button, SubTitle } from "app/components/LoonsLabComponents";
import Barcode from 'react-jsbarcode';
import UtilityServices from "app/services/UtilityServices";
import PharmacyOrderService from "app/services/PharmacyOrderService";
import ChiefPharmacistServices from 'app/services/ChiefPharmacistServices'
import localStorageService from "app/services/localStorageService";
import moment from "moment";
import { dateParse, timeParse, dateTimeParse, convertTocommaSeparated, msdServiceChargesCal, msdTotalChagesCal, roundDecimal, includesArrayElements } from "utils";
import { getPackDetails } from 'app/services/GetPacksize'

class NewlineText extends Component {

}



class PrintIssueNote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            consultant: null,
            stv_no: '',
            items: [],
            data: [],
            selected_warehouse_cache: null,
            Login_user_Hospital: null,
            login_user_name: null,
            mapedData: null,
            Loaded: false,
            today: dateTimeParse(new Date()),
            book_no: null,
            page_no: null,
            issuringOffiser: null,
            orderingOfficer: null,
            order_id: null,
            order_date_time: null,
            PharmacyCode: null,
            packData: [],
            isSalesOrder: false
        }
    }

    static propTypes = {
        header: any,
        footer: any,
        ref: any,
        drugList: any,
        patientInfo: any,
        clinic: any,
        printFunction: Function,
        refferenceSection: Boolean,
        myNo: String,
        yourNo: String,
        date: String,
        address: String,
        title: String,
        letterBody: String,
        signature: String,
        letterTitle: String,
        today: String,
        book_no: String,
        page_no: String,
        issuringOffiser: String,
        orderingOfficer: String,
        order_id: String,
        order_date_time: String,
        PharmacyCode: String
    };

    static defaultProps = {
        header: defaultLetterHead,
        footer: defaultFooter,
        refferenceSection: false,
        myNo: null,
        yourNo: null,
        date: null,
        address: null,
        title: null,
        letterBody: null,
        signature: null,
        letterTitle: null,
        today: null,
        book_no: null,
        page_no: null,
        issuringOffiser: null,
        orderingOfficer: null,
        order_id: null,
        order_date_time: null,
        PharmacyCode: null
    };

    newlineText(text) {
        if (text) {
            return text.split('\n').map(str => <p>{str}</p>);
        } else {
            return ""
        }

    }

    printFunction() {
        // document.getElementById('print_presc_001').click();
        console.log("okkk")
    }
    async getConsultant() {
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        this.setState({ consultant: user })
    }
    async getPacksizeDetails(data) {

        let items = data
        let packData = await getPackDetails(items)
        this.setState({
            packData,
            Loaded: true,
        })
        // console.log('checking item packData', packData)


    }

    async dataMapping(data) {
        let array = [];
        /*  data.forEach(element => {
             let item_id =
         }); */

        let itemslist = data.map(data => data.OrderItem.item_id);
        let uniquitemslist = [...new Set(itemslist)];

        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        let Login_user_Hospital = await localStorageService.getItem("Login_user_Hospital");
        let Login_user_info = await localStorageService.getItem("userInfo");

        console.log("Login_user_Hospital", Login_user_Hospital)
        console.log("uniqe data", uniquitemslist)
        this.setState({ login_user_name: Login_user_info.name, items: uniquitemslist, Login_user_Hospital: Login_user_Hospital, selected_warehouse_cache: selected_warehouse_cache, Loaded: true })
    }

    async loadData() {

        let filters = { order_exchange_id: this.props.order_exchange_id, orderby_sr: true }
        let res = await PharmacyOrderService.getOrderBatchItems(filters)
        if (res.status) {
            console.log("Order Item Batch Data", res.data.view.data)
            this.dataMapping(res.data.view.data)
            this.setState({ data: res.data.view.data })
            this.getPacksizeDetails(res.data.view.data)

        }

        let res2 = await ChiefPharmacistServices.getSingleOrder({}, this.props.order_exchange_id)
        if (res2.status == 200) {
            console.log("Order Item single order", res2.data.view.stv_no)

            this.setState({ stv_no: res2.data.view.stv_no })

        }

        // console.log('bbb',this.props.book_no)
    }

    // getTodayDate(){
    //     var date = dateTimeParse(new Date())
    //     this.setState({today: date})
    // }

    async activeSellsOrder() {
        let Login_user_info = await localStorageService.getItem("userInfo");
        if (includesArrayElements(Login_user_info.roles, ['Sales Officer', 'Drugstore Pharmacist(S)'])) {
            this.setState({ isSalesOrder: true })
        }


    }

    componentDidMount() {

        this.activeSellsOrder()
        this.getConsultant()
        this.loadData()
        // this.getTodayDate()

    }

    render() {
        const {
            header,
            footer,
            refferenceSection,
            myNo,
            yourNo,
            date,
            address,
            title,
            letterBody,
            signature,
            letterTitle,
            drugList,
            patientInfo,
            clinic,
            today,
            book_no,
            page_no,
            issuringOffiser,
            orderingOfficer,
            order_id,
            order_date_time,
            PharmacyCode
        } = this.props;
        /*  size: 297mm 420mm; */
        const pageStyle = `
 
    @page {
        size: letter portrait; /* auto is default portrait; */
        margin: 0 !important;
    }
 
  @media all {
    .pagebreak {
      display: none;
    }
  }

  @media print {
    

    .page-break { page-break-after: always; }
    .header, .header-space,
           {
            height: 200px;
          }
.footer, .footer-space,{
            height: 200px;
          }

          .footerImage{
            height: 10px;
            bottom: 0;
            margin-bottom: 0px;
            padding-bottom: 0px;
            
          }
          .footer {
            position: fixed;
            bottom: 0;
            
          }
          .page-break {
            margin-top: 1rem;
            display: block;
            page-break-before: auto;
          }

          .downFooter {
            bottom: 0;
            margin-top: 0px;
            padding-top: 0px;
          }
  }
`;


        let pageLineLimit = 15;


        // const itemsPerPage = 5;
        // const start = (currentPage - 1) * itemsPerPage;
        // const end = start + itemsPerPage;

        return (
            <div className="hidden">
                <Grid className="w-full justify-end items-end flex pb-5">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_004" size="small" startIcon="print">Print</Button>}
                        pageStyle={pageStyle}
                        documentTitle={letterTitle}
                        //removeAfterPrint
                        content={() => this.componentRef}
                    />
                </Grid>
                {this.state.Loaded ?
                    <Grid className="bg-light-gray p-5 " style={{ borderStyle: 'double', borderColor: "#a5a4a4" }} >
                        <div className="bg-white p-5" >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                    <div class="header-space flex ">

                                        {/*  <div className="pl-10" style={{ width: "60%" }}>
                                        <img alt="A test image" src={header} style={{ width: '100%' }} />
                                    </div> */}
                                        <div className="pt-5 pl-5" style={{ width: "40%" }} >
                                            <SubTitle title=""></SubTitle>
                                        </div>

                                    </div>

                                    <table className="w-full">
                                        <thead><tr><td>

                                        </td></tr></thead>
                                        <tbody><tr><td>
                                            <div className="content pl-10 pr-5">
                                                {/*  Letter refferences section */}

                                                <table className="w-full">
                                                    <tbody>
                                                        <tr>
                                                            <td className="font-bold  text-10" style={{ width: '70%' }}></td>
                                                            <td className="w-1 text-12"></td>
                                                            <td className="text-12"></td>{/**My No value */}

                                                            <td className="w-70 font-bold text-10">Issue No</td>
                                                            <td className="w-1 text-12">:</td>
                                                            <td className="w-150 text-12">{this.state.stv_no}</td>{/**Your No value */}

                                                        </tr>

                                                        <tr>
                                                            <td className="w-70 font-bold text-10"></td>
                                                            <td className="w-1 text-12"></td>
                                                            <td className="w-150 text-12"></td>{/**My No value */}

                                                            <td className="w-70 font-bold text-10">User </td>
                                                            <td className="w-1 text-12">:</td>
                                                            <td className="w-150 text-12">{this.state.login_user_name}</td>{/**Your No value */}

                                                        </tr>

                                                        <tr>
                                                            <td className="w-70 font-bold text-10"></td>
                                                            <td className="w-1 text-12"></td>
                                                            <td className="text-12"></td>{/**My No value */}

                                                            <td className="w-700 font-bold text-10">Date </td>
                                                            <td className="w-1 text-12">:</td>
                                                            <td className="w-150 text-12">{dateParse(new Date)}</td>{/**Your No value */}

                                                        </tr>
                                                        <tr>
                                                            <td className="w-100 font-bold text-10"></td>
                                                            <td className="w-1 text-12"></td>
                                                            <td className="text-12"></td>{/**My No value */}

                                                            <td className="w-70 font-bold text-10">Time </td>
                                                            <td className="w-1 text-12">:</td>
                                                            <td className="w-150 text-12">{timeParse(new Date)}</td>{/**Your No value */}

                                                        </tr>
                                                    </tbody>
                                                </table>



                                                <div className="w-full font-bold text-16 text-center">Issue Note</div>


                                                <table className="w-full">
                                                    <tbody>
                                                        <tr>
                                                            <td className=" font-bold text-10" style={{ width: '25%' }}>Warehouse Code/Name</td>
                                                            <td className="w-1 text-12">:</td>
                                                            <td className="text-12"> {this.state.selected_warehouse_cache?.name}</td>{/**My No value */}

                                                        </tr>

                                                        <tr>
                                                            <td className=" font-bold text-10">Pharmacy Code/Name</td>
                                                            <td className="w-1 text-12">:</td>
                                                            <td className="text-12">{PharmacyCode}</td>{/**My No value */}

                                                        </tr>
                                                        <tr>
                                                            <td className=" font-bold text-10">Order Number</td>
                                                            <td className="w-1 text-12">:</td>
                                                            <td className="text-12">{order_id}</td>{/**My No value */}

                                                        </tr>

                                                        <tr>
                                                            <td className=" font-bold text-10">Order Date</td>
                                                            <td className="w-1 text-12">:</td>
                                                            <td className="text-12">{order_date_time}</td>{/**My No value */}

                                                        </tr>
                                                        <tr>
                                                            <td className="w-100 font-bold text-10">Book Reference No</td>
                                                            <td className="w-1 text-12">:</td>
                                                            <td className="text-12">BK {book_no} / F {page_no}</td>{/**My No value */}

                                                        </tr>


                                                    </tbody>
                                                </table>

                                                <Divider></Divider>


                                                {
                                                    // drugList?.filter((ele) => ele.availability==false).map((drug, index) =>
                                                    this.state.items?.map((item, index) => {

                                                        let filterdData = this.state.data.filter(dataItem => dataItem.OrderItem?.item_id == item)
                                                        let total_qty = 0;
                                                        let total_value = 0;

                                                        return (
                                                            <div style={{ pageBreakAfter: index % 6 === 5 ? 'always' : 'auto' }}>
                                                                <p className="font-bold text-10 m-0 p-0 mt-3">{index + 1 + "." + filterdData[0]?.OrderItem?.ItemSnap?.medium_description + '( ' + filterdData[0]?.OrderItem?.ItemSnap?.sr_no + ' )'}</p>

                                                                <table className="w-full px-20 ">
                                                                    <tbody className="w-full ">
                                                                        <tr className="w-full pb-11" >
                                                                            <td className="text-11 font-bold " style={{ width: '20%' }} >Batch</td>
                                                                            <td className="text-11 font-bold pr-11 " style={{ width: '20%' }}>Exp Date</td>
                                                                            <td className="text-11 font-bold pr-11" style={{ width: '20%' }}>Qty</td>
                                                                            <td className="text-11 font-bold pr-11 " style={{ width: '20%' }}>Unit Price</td>
                                                                            <td className="text-11 font-bold pr-11 " style={{ width: '20%' }}>Value</td>
                                                                            <td className="text-11 font-bold pr-11 " style={{ width: '20%' }}>Pack Details</td>
                                                                        </tr>




                                                                        {filterdData?.map((drug, index) => {
                                                                            // total_qty = total_qty + parseInt(drug?.allocated_quantity)
                                                                            //  total_value = total_value + parseFloat(drug?.allocated_quantity) * parseFloat(roundDecimal(drug?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price,3))
                                                                            if (this.state.isSalesOrder) {
                                                                                total_qty = total_qty + parseInt(drug?.allocated_quantity)
                                                                                total_value = total_value + parseFloat(drug?.allocated_quantity) * parseFloat(msdTotalChagesCal(drug?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price, 3))

                                                                            } else {
                                                                                total_qty = total_qty + parseInt(drug?.allocated_quantity)
                                                                                total_value = total_value + parseFloat(drug?.allocated_quantity) * parseFloat(roundDecimal(drug?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price, 3))

                                                                            }


                                                                            return (
                                                                                <tr>
                                                                                    <td className="text-11 ">{drug?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no}</td>
                                                                                    <td className="text-11 ">{dateParse(drug?.ItemSnapBatchBin?.ItemSnapBatch?.exd)}</td>
                                                                                    {/* {console.log('chiningg dggdggddgd',drug )} */}
                                                                                    <td className="text-11 ">{(drug?.OrderItem?.ItemSnap?.converted_order_uom === 'EU') ? convertTocommaSeparated(drug?.allocated_quantity * drug?.OrderItem?.ItemSnap?.item_unit_size, 2) + ' ' + drug?.OrderItem?.ItemSnap?.DisplayUnit?.name + ' (' + drug?.allocated_quantity + ' ' + drug?.OrderItem?.ItemSnap?.MeasuringUnit?.name + ' )' : drug?.allocated_quantity}</td>
                                                                                    <td className="text-11">{this.state.isSalesOrder ? msdTotalChagesCal(drug?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price, 3) : convertTocommaSeparated(drug?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price, 3)}</td>
                                                                                    <td className="text-11 ">{convertTocommaSeparated(parseFloat(drug?.allocated_quantity) * parseFloat(this.state.isSalesOrder ? msdTotalChagesCal(drug?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price, 3) : drug?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price), 2)}</td>
                                                                                    <td className="text-11 ">{(this.state.packData?.find((x) => (x.item_id == drug?.OrderItem.item_id && x.batch_no == drug?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no && x.quantity == drug?.allocated_quantity)))?.packingdetails.map((x, packIndex) => {

                                                                                        return <div>{x}</div>;
                                                                                    })}
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })}

                                                                        <tr>
                                                                            <td className="text-11 font-bold">Total Item : </td>
                                                                            <td className="text-11 "></td>
                                                                            <td className="text-11 ">{total_qty}</td>
                                                                            <td className="text-11  font-bold">Total Value : </td>
                                                                            <td className="text-11">{convertTocommaSeparated(total_value, 2)}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )

                                                        // return (
                                                        //     <>
                                                        //       {[...Array(10)].map((_, index) => (
                                                        //         <div
                                                        //           key={index}
                                                        //         //   style={{ pageBreakAfter: index % 6 === 5 ? 'always' : 'auto' }}
                                                        //         >
                                                        //           <p className="font-bold text-10 m-0 p-0 mt-3">
                                                        //             {index + 1 + '.' + filterdData[0]?.OrderItem?.ItemSnap?.medium_description + ' (' + filterdData[0]?.OrderItem?.ItemSnap?.sr_no + ')'}
                                                        //           </p>

                                                        //           <table className="w-full px-20">
                                                        //             <tbody className="w-full">
                                                        //               <tr className="w-full pb-11">
                                                        //                 <td className="text-11 font-bold" style={{ width: '20%' }}>
                                                        //                   Batch
                                                        //                 </td>
                                                        //                 <td className="text-11 font-bold pr-11" style={{ width: '20%' }}>
                                                        //                   Exp Date
                                                        //                 </td>
                                                        //                 <td className="text-11 font-bold pr-11" style={{ width: '20%' }}>
                                                        //                   Qty
                                                        //                 </td>
                                                        //                 <td className="text-11 font-bold pr-11" style={{ width: '20%' }}>
                                                        //                   Unit Price
                                                        //                 </td>
                                                        //                 <td className="text-11 font-bold pr-11" style={{ width: '20%' }}>
                                                        //                   Value
                                                        //                 </td>
                                                        //               </tr>

                                                        //               {filterdData?.map((drug, innerIndex) => {
                                                        //                 total_qty =
                                                        //                   total_qty + parseInt(drug?.allocated_quantity);
                                                        //                 total_value =
                                                        //                   total_value +
                                                        //                   parseFloat(drug?.allocated_quantity) *
                                                        //                     parseFloat(
                                                        //                       drug?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price
                                                        //                     );
                                                        //                 return (
                                                        //                   <tr key={innerIndex}>
                                                        //                     <td className="text-11 ">
                                                        //                       {drug?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no}
                                                        //                     </td>
                                                        //                     <td className="text-11 ">
                                                        //                       {dateParse(drug?.ItemSnapBatchBin?.ItemSnapBatch?.exd)}
                                                        //                     </td>
                                                        //                     <td className="text-11 ">{drug?.allocated_quantity}</td>
                                                        //                     <td className="text-11 ">
                                                        //                       {drug?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price}
                                                        //                     </td>
                                                        //                     <td className="text-11 ">
                                                        //                       {convertTocommaSeparated(
                                                        //                         parseFloat(drug?.allocated_quantity) *
                                                        //                           parseFloat(
                                                        //                             drug?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price
                                                        //                           ),
                                                        //                         2
                                                        //                       )}
                                                        //                     </td>
                                                        //                   </tr>
                                                        //                 );
                                                        //               })}

                                                        //               <tr>
                                                        //                 <td className="text-11 font-bold">Total Item : </td>
                                                        //                 <td className="text-11 "></td>
                                                        //                 <td className="text-11 ">{total_qty}</td>
                                                        //                 <td className="text-11 font-bold">Total Value : </td>
                                                        //                 <td className="text-11">
                                                        //                   {convertTocommaSeparated(total_value, 2)}
                                                        //                 </td>
                                                        //               </tr>
                                                        //             </tbody>
                                                        //           </table>
                                                        //         </div>
                                                        //       ))}
                                                        //     </>
                                                        //   );

                                                    }
                                                    )
                                                }
                                                {/* Letter Address */}



                                            </div>
                                        </td></tr></tbody>
                                        <tfoot><tr><td>
                                            <div class="footer-space">
                                                <div class="footer">
                                                    <table className="w-full pl-20">
                                                        <tbody>
                                                            <tr>
                                                                <td className="w-100 font-bold  text-11">Checked By :</td>
                                                                <td className="w-1 text-12"></td>
                                                                <td className="text-12"></td>{/**My No value */}

                                                                <td className="w-100 font-bold text-11"></td>
                                                                <td className="w-1 text-12"></td>
                                                                <td className="text-12"></td>{/**Your No value */}

                                                            </tr>

                                                            <tr>
                                                                <td className="w-100 font-bold  text-11">{issuringOffiser}</td>
                                                                <td className="w-1 text-12"></td>
                                                                <td className="text-12"></td>{/**My No value */}

                                                                <td className="w-1 text-12"></td>
                                                                <td className="text-12"></td>{/**Your No value */}
                                                                <td className="w-100 font-bold text-11">{/* orderingOfficer */}</td>


                                                            </tr>

                                                            <tr>
                                                                <td className="w-200 font-bold  text-11">{"........................................................"}</td>
                                                                <td className="w-1 text-12"></td>
                                                                <td className="text-12"></td>{/**My No value */}

                                                                <td className="w-1 text-12"></td>
                                                                <td className="text-12"></td>{/**Your No value */}
                                                                <td className="w-200 font-bold text-11"><p className="m-0 p-0">{"........................................................"}</p><p className="m-0 p-0">Pharmacist</p></td>


                                                            </tr>

                                                            <tr>
                                                                <td className="w-200 font-bold  text-11">{"(Issuing Officer's Name and Signature)"}</td>
                                                                <td className="w-1 text-12"></td>
                                                                <td className="text-12"></td>{/**My No value */}

                                                                <td className="w-1 text-12"></td>
                                                                <td className="text-12"></td>{/**Your No value */}
                                                                <td className="w-200 font-bold text-11">{"(Receiving Officer's Name,Signature and Designation)"}</td>


                                                            </tr>

                                                        </tbody>
                                                    </table>

                                                    <img className="footerImage " alt="A test image" src={footer} style={{ width: '100%' }} />

                                                    <div className="downFooter">
                                                        <p className="ml-5">
                                                            Printed by {this.state.login_user_name} {this.state.today}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </td></tr></tfoot>
                                    </table>






                                </div>
                            </div>
                        </div>
                    </Grid>
                    : null}
            </div>
        );
    }
}

export default PrintIssueNote;