/*
Loons Lab Sub title component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import { Divider, Typography, Grid, Box } from '@material-ui/core'
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
import { dateParse, timeParse } from "utils";
import { margin } from "@mui/system";
class NewlineText extends Component {

}



class PrintIssueNote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            consultant: null,
            stv_no:'',
            items: [],
            data: [],
            selected_warehouse_cache: null,
            Login_user_Hospital:null,
            login_user_name:null,
            mapedData: null,
            Loaded: false
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
        letterTitle: String
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
        letterTitle: null
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

    async dataMapping(data) {
        let array = [];
        /*  data.forEach(element => {
             let item_id =
         }); */

        let itemslist = data.map(data => data.OrderItem.item_id);
        let uniquitemslist = [...new Set(itemslist)];

        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        let Login_user_Hospital = await localStorageService.getItem("Login_user_Hospital");
        let Login_user_info= await localStorageService.getItem("userInfo");


        console.log("uniqe data", uniquitemslist)
        this.setState({ login_user_name:Login_user_info.name,items: uniquitemslist, Login_user_Hospital: Login_user_Hospital, selected_warehouse_cache: selected_warehouse_cache, Loaded: true })
    }

    async loadData() {

        let filters = { order_exchange_id: this.props.order_exchange_id }
        let res = await PharmacyOrderService.getOrderBatchItems(filters)
        if (res.status) {
            console.log("Order Item Batch Data", res.data.view.data)
            this.dataMapping(res.data.view.data)
            this.setState({ data: res.data.view.data })

        }

        let res2=await ChiefPharmacistServices.getSingleOrder({},this.props.order_exchange_id)
        if (res2.status==200) {
            console.log("Order Item single order", res2.data.view.stv_no)
            
            this.setState({ stv_no: res2.data.view.stv_no})

        }
    }

    componentDidMount() {

        this.getConsultant()
        this.loadData()
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
            clinic
        } = this.props;
        /*  size: 297mm 420mm; */
        const pageStyle = `
 
 @page {
    
    margin-left:5mm;
    margin-right:5mm;
    margin-bottom:5mm;
    margin-top:8mm;
  }

//   @table, th, td {
//     width: 100%;
//     border: 1px solid;
//     border-collapse: collapse;
//   }
 

  @media print {
    .page-break {
        margin-top: 1rem;
        display: block;
        page-break-after: always;
      }
    .header, .header-space,
           {
            height: 2000px;
          }
.footer, .footer-space {
            height: 100px;
          }

          .footerImage{
            height: 50px;
            bottom: 0;
          }
          .footer {
            position: fixed;
            bottom: 0;
          }

        //   table, th, td {
        //     width: 100%;
        //     border: 1px solid;
        //     border-collapse: collapse;
        //   }
   
  }
`;


        return (
            <div className="">
                <Grid className="w-full justify-end items-end flex p-5">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_004" size="small" startIcon="print">Print</Button>}
                        pageStyle={pageStyle}
                        documentTitle={letterTitle}
                        //removeAfterPrint
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray  " style={{ borderStyle: 'double', borderColor: "#a5a4a4" }} >
                        <div className="bg-white " >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                    {/* 1st Page */}
                                    <div class="header-space flex ">

                                        {/*  <div className="pl-10" style={{ width: "60%" }}>
                                        <img alt="A test image" src={header} style={{ width: '100%' }} />
                                    </div> */}
                                        <div className="pt-5 pl-5" style={{ width: "40%" }} >
                                            <SubTitle title="Accountant Copy"></SubTitle>
                                        </div>
                                    {/* topic */}
                                    </div>
                                    <div className="w-full font-bold text-20 text-center">Medical Supplies Division - Ministry of Health</div>
                                    <div className="w-full  text-12 text-center">No. 357, Rev.Baddegama Wimalawansha Thero Mawatha, Colombo 10.</div>
                                    <div className="w-full font-bold text-16 text-center">Stock Transfer Voucher/Invoice </div>
                                    {/* <div className="w-full flex" >
                                        <Grid container lg={5} spacing={2} className="px-7 my-5" >
                                            <Grid item lg={12} className="w-full p-1 flex" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '50%', borderRadius: '5px' }}   spacing={2}>
                                                <p className="text-12 my-0">Issuing Warehouse :</p>
                                                <p className="text-12 my-0 ml-2 "></p>
                                            </Grid>
                                        </Grid>
                                        <Grid container lg={5} spacing={2} className="px-7 my-5" >
                                            <Grid item lg={12} className="w-full p-1" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '50%', borderRadius: '5px' }}   spacing={2}>
                                                <p className="text-12 my-0">Issuing Warehouse :</p>
                                                <p className="text-12 my-0 ml-2 "></p>
                                            </Grid>
                                            <Grid item lg={12} className="w-full p-1" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '50%', borderRadius: '5px' }}  spacing={2}>
                                                <p className="text-12 my-0">Issuing Warehouse :</p>
                                                <p className="text-12 my-0 ml-2 ">Hiiii</p>
                                                <p className="text-12 my-0">Issuing Warehouse :</p>
                                                <p className="text-12 my-0 ml-2 ">Hiiii</p>
                                            </Grid>
                                        </Grid>
                                    </div> */}
                                        
                                    {/* Boxes */}
                                    <div className="mx-5 my-2 flex w-full" >
                                        <div className="w-full" >
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '99%', borderRadius: '5px' }} >
                                                <div className="flex" >
                                                    <p className="text-12 my-0">Issuing Warehouse :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                                <div className="flex" >
                                                    <p className="text-12 my-0">Receiving Warehouse :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                            </div>
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '99%', borderRadius: '5px' }} >
                                                <div className="flex" >
                                                    <p className="text-12 my-0">Address :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full" >
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '90%', borderRadius: '5px' }} >
                                                <div className="flex" >
                                                    <p className="text-12 my-0">Request No :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                                <div className="flex" >
                                                    <p className="text-12 my-0">STV No :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                                <div className="flex" >
                                                    <p className="text-12 my-0">Invoice No :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                                <div className="flex" >
                                                    <p className="text-12 my-0">Issued Date & Time :</p>
                                                    <p className="text-12 my-0 ml-2 ">{dateParse(new Date)} : {timeParse(new Date)}</p>
                                                </div>
                                                <div className="flex" >
                                                    <p className="text-12 my-0">User :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>

                                    {/* Table */}
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="content p-5">
                                                        {/* table 01 */}
                                                        <table className="w-full px-5 my-1" >
                                                                    <tbody className="w-full ">
                                                                        <tr className="w-full py-10 text-center border-1" >
                                                                            <td className="text-12 font-bold " style={{ width: '1%' }} >Seq</td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}>Item Code</td>
                                                                            <td className="text-12 font-bold" style={{ width: '50%' }}>
                                                                                Description Duration
                                                                                <table className="w-full px-10 my-3 ">
                                                                                    <tbody className="w-full ">
                                                                                        <td className="text-12 font-bold " style={{ width: '25%' }}>Qyt</td>
                                                                                        <td className="text-12 font-bold" style={{ width: '25%' }}>Batch</td>
                                                                                        <td className="text-12 font-bold " style={{ width: '25%' }}>Ex. Date</td>
                                                                                        <td className="text-12 font-bold " style={{ width: '25%' }}>Pack Size</td>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}>UOM</td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}>Quantity</td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}>Value (Rs)</td>
                                                                        </tr>
                                                                        <tr>
                                                                            {/* Table Body */}
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="text-12 font-bold " style={{ width: '1%' }} ></td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}></td>
                                                                            <td className="text-12 font-bold" style={{ width: '50%' }}>
                                                                                <table className="w-full px-10 my-3 ">
                                                                                    <tbody className="w-full ">
                                                                                        <td className="text-12 font-bold " style={{ width: '25%' }}></td>
                                                                                        <td className="text-12 font-bold" style={{ width: '25%' }}></td>
                                                                                        <td className="text-12 font-bold " style={{ width: '25%' }}></td>
                                                                                        <td className="text-12 font-bold " style={{ width: '25%' }}></td>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}></td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}>Total</td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}></td>
                                                                        </tr>
                                                                    </tbody>
                                                        </table>
                                                    </div>
                                        </td>
                                        </tr>
                                        </tbody>
                                        <tfoot><tr><td>
                                            <div class="footer-space"> </div>
                                        </td></tr></tfoot>
                                    </table>

                                    {/* Below boxes */}
                                    <div className="mx-5 my-2 flex w-full" >
                                        <div className="w-full" >
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '99%', borderRadius: '5px' }} >
                                                <table className="w-full">
                                                    <tbody>
                                                            <tr>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Delivery Instruction</td>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Signature/Date</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Picking slip prepared by (Sco) :</td>
                                                                <td className=" text-12" style={{ width: '20%' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Assembled & Packed by (Storeman) :</td>
                                                                <td className=" text-12" style={{ width: '20%' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '20%' }}>STV Printed by :</td>
                                                                <td className=" text-12" style={{ width: '20%' }}></td>
                                                            </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '99%', borderRadius: '5px' }} >
                                                <table className="w-full">
                                                    <tbody>
                                                            <tr>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Custodian Details</td>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Signature/Date</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '20%' }}>Receiving Officer's Name :</td>
                                                                <td className=" text-12" style={{ width: '20%' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '20%' }}>Receiving Officer's Destination :</td>
                                                                <td className=" text-12" style={{ width: '20%' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '20%' }}>Receiving Officer's NIC No :</td>
                                                                <td className=" text-12" style={{ width: '20%' }}></td>
                                                            </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '99%', borderRadius: '5px' }} >
                                                <table className="w-full">
                                                    <tbody>
                                                            <tr>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Despatch Section</td>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Name</td>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Signature/Date</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '20%' }}>Checked by (MA/Storeman)</td>
                                                                <td className=" text-12" style={{ width: '20%' }}>......................................</td>
                                                                <td className=" text-12" style={{ width: '20%' }}>......................................</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '20%' }}>Received by (to dispatch)</td>
                                                                <td className=" text-12" style={{ width: '20%' }}>......................................</td>
                                                                <td className=" text-12" style={{ width: '20%' }}>......................................</td>
                                                            </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="w-full" >
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '90%', borderRadius: '5px' }} >
                                                <table className="w-full">
                                                    <tbody>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>No of Issued Items :</td>
                                                                <td className=" text-12" style={{ width: '10%' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>No of Pieces :</td>
                                                                <td className=" text-12" style={{ width: '10%' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>Estimated Weight (kg) :</td>
                                                                <td className=" text-12" style={{ width: '10%' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>Estimated Volume (m^3) :</td>
                                                                <td className=" text-12" style={{ width: '10%' }}></td>
                                                            </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '90%', borderRadius: '5px' }} >
                                                <table className="w-full">
                                                    <tbody>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>...........................................................</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>Issuing Officer's Name/Signature/Date</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>...........................................................</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>Received to Deliver Name/Signature/Date</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>...........................................................</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>Receiving Officer's Name/Signature/Date</td>
                                                            </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remark */}
                                    <div className="mx-5 flex w-full page-break" >
                                        <div className="w-full" >
                                            <div className="p-2 mx-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '95%', borderRadius: '5px' }} >
                                                <div className="flex" >
                                                    <p className="text-12 my-0">Remarks :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                    {/* 2nd Page */}
                                    <div className="m-5 p-2 " style={{ border: '1px solid', borderColor: "#a5a4a4", width: '97%', borderRadius: '5px' }}>
                                        <div class="header-space flex ">
                                        {/*  <div className="pl-10" style={{ width: "60%" }}>
                                        <img alt="A test image" src={header} style={{ width: '100%' }} />
                                        </div> */}
                                        <div className=" pl-5" style={{ width: "40%" }} >
                                            <SubTitle title="Original Copy : Receiving Officer"></SubTitle>
                                        </div>
                                        </div>
                                        <div className="w-full font-bold text-20 text-center">Medical Supplies Division - Ministry of Health</div>
                                        <div className="w-full  text-12 text-center">No. 357, Rev.Baddegama Wimalawansha Thero Mawatha, Colombo 10.</div>
                                        <div className="w-full font-bold text-16 text-center">Damage Return Note </div>
                                    </div>
                                    
                                    <div className="mx-5 my-0 p-2 page-break" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '97%', borderRadius: '5px' }}>
                                        <div className="" style={{ height: '500px' }}></div>
                                        <div className="content p-5">
                                            <table className="w-full my-3">
                                                                <tbody>
                                                                <tr>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}>Damage Stock returned / Prepared by</td>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}>Checked by</td>
                                                                    <td className=" font-bold text-12" style={{ width: '30%' }}>Damage stock received by</td>
                                                                    <td className=" font-bold text-12" style={{ width: '10%' }}>Authorized by</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}>Name</td>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '30%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '10%' }}></td>
                                                                </tr>
                                                                <tr>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}>Designation</td>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '30%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '10%' }}></td>
                                                                </tr> 
                                                                <tr>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}>Signature</td>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '30%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '10%' }}></td>
                                                                </tr> 
                                                                <tr>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}>Date</td>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '20%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '30%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '10%' }}></td>
                                                                </tr>      
                                                            </tbody>
                                            </table>
                                            <div>
                                                <p className=" font-bold text-12">This document duly completed mut be forwarded as indicated above withing 3 days of receipt of goods </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    

                                    {/* 3rd Page */}
                                    <div className="m-5 p-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '97%', borderRadius: '5px' }}>
                                        <div class="header-space flex ">

                                        {/*  <div className="pl-10" style={{ width: "60%" }}>
                                        <img alt="A test image" src={header} style={{ width: '100%' }} />
                                        </div> */}
                                        <div className="pt-5 px-5 flex justify-between" style={{ width: "100%" }} >
                                            <SubTitle title="Original Copy : Accountant - Ledger Section"></SubTitle>
                                            <SubTitle title="Health 954"></SubTitle>
                                        </div>
                                        </div>
                                        <div className="w-full font-bold text-20 text-center">Medical Supplies Division - Ministry of Health</div>
                                        <div className="w-full  text-12 text-center">No. 357, Rev.Baddegama Wimalawansha Thero Mawatha, Colombo 10.</div>
                                        <div className="w-full font-bold text-16 text-center">Goods Received Note (GRN)</div>
                                    </div>
                                    <div className="mx-5 my-0 p-2 page-break" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '97%', borderRadius: '5px' }}>
                                        <div className="" style={{ height: '500px' }}></div>
                                        <div className="content p-5">
                                            <table className="w-full my-3">
                                                                <tbody>
                                                                <tr>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}>Stock Received / Prepared by</td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}>Checked by</td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}>Authorized by</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}>Name</td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}></td>
                                                                </tr>
                                                                <tr>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}>Designation</td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}></td>
                                                                </tr> 
                                                                <tr>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}>Signature</td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}></td>
                                                                </tr> 
                                                                <tr>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}>Date</td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}></td>
                                                                    <td className=" font-bold text-12" style={{ width: '25%' }}></td>
                                                                </tr>      
                                                            </tbody>
                                            </table>
                                            <div>
                                                <p className=" font-bold text-12">This document duly completed mut be forwarded as indicated above withing 3 days of receipt of goods </p>
                                            </div>
                                        </div>
                                    </div>
                                        
                                    
                                    {/* 4th Page */}
                                    <div class="header-space flex ">

                                        {/*  <div className="pl-10" style={{ width: "60%" }}>
                                        <img alt="A test image" src={header} style={{ width: '100%' }} />
                                    </div> */}
                                        <div className="pt-5 pl-5" style={{ width: "40%" }} >
                                            <SubTitle title="Accountant Copy"></SubTitle>
                                        </div>

                                    </div>
                                    <div className="w-full font-bold text-20 text-center">Regional Medical Supplies Division - Ministry of Health</div>
                                    <div className="w-full font-bold text-16 text-center">Stock Transfer Voucher </div>
                                    {/* Boxes */}
                                    <div className="mx-5 my-2 flex w-full" >
                                        <div className="w-full" >
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '99%', borderRadius: '5px' }} >
                                                <div className="flex" >
                                                    <p className="text-12 my-0">Issuing Warehouse :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                                <div className="flex" >
                                                    <p className="text-12 my-0">Receiving Warehouse :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                            </div>
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '99%', borderRadius: '5px' }} >
                                                <div className="flex" >
                                                    <p className="text-12 my-0">Address :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full" >
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '90%', borderRadius: '5px' }} >
                                                <div className="flex" >
                                                    <p className="text-12 my-0">Request No :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                                <div className="flex" >
                                                    <p className="text-12 my-0">STV No :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                                <div className="flex" >
                                                    <p className="text-12 my-0">Issued Date & Time :</p>
                                                    <p className="text-12 my-0 ml-2 ">{dateParse(new Date)} : {timeParse(new Date)}</p>
                                                </div>
                                                <div className="flex" >
                                                    <p className="text-12 my-0">User :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>

                                    {/* Table */}
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="content p-5">
                                                        {/* table 01 */}
                                                        <table className="w-full px-5 my-1" >
                                                                    <tbody className="w-full ">
                                                                        <tr className="w-full py-10 text-center border-1" >
                                                                            <td className="text-12 font-bold " style={{ width: '1%' }} >Seq</td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}>Item Code</td>
                                                                            <td className="text-12 font-bold" style={{ width: '50%' }}>
                                                                                Description Duration
                                                                                <table className="w-full px-10 my-3 ">
                                                                                    <tbody className="w-full ">
                                                                                        <td className="text-12 font-bold " style={{ width: '25%' }}>Qyt</td>
                                                                                        <td className="text-12 font-bold" style={{ width: '25%' }}>Batch</td>
                                                                                        <td className="text-12 font-bold " style={{ width: '25%' }}>Ex. Date</td>
                                                                                        <td className="text-12 font-bold " style={{ width: '25%' }}>Pack Size</td>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}>UOM</td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}>Quantity</td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}>Value (Rs)</td>
                                                                        </tr>
                                                                        <tr>
                                                                            {/* Table Body */}
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="text-12 font-bold " style={{ width: '1%' }} ></td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}></td>
                                                                            <td className="text-12 font-bold" style={{ width: '50%' }}>
                                                                                <table className="w-full px-10 my-3 ">
                                                                                    <tbody className="w-full ">
                                                                                        <td className="text-12 font-bold " style={{ width: '25%' }}></td>
                                                                                        <td className="text-12 font-bold" style={{ width: '25%' }}></td>
                                                                                        <td className="text-12 font-bold " style={{ width: '25%' }}></td>
                                                                                        <td className="text-12 font-bold " style={{ width: '25%' }}></td>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}></td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}>Total</td>
                                                                            <td className="text-12 font-bold " style={{ width: '10%' }}></td>
                                                                        </tr>
                                                                    </tbody>
                                                        </table>
                                                    </div>
                                        </td>
                                        </tr>
                                        </tbody>
                                        <tfoot><tr><td>
                                            <div class="footer-space"> </div>
                                        </td></tr></tfoot>
                                    </table>

                                    {/* Below boxes */}
                                    <div className="mx-5 my-2 flex w-full" >
                                        <div className="w-full" >
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '99%', borderRadius: '5px' }} >
                                                <table className="w-full">
                                                    <tbody>
                                                            <tr>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Delivery Instruction</td>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Signature/Date</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Picking slip prepared by :</td>
                                                                <td className=" text-12" style={{ width: '20%' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Assembled & Packed by :</td>
                                                                <td className=" text-12" style={{ width: '20%' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '20%' }}>STV Printed by :</td>
                                                                <td className=" text-12" style={{ width: '20%' }}></td>
                                                            </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '99%', borderRadius: '5px' }} >
                                                <table className="w-full">
                                                    <tbody>
                                                            <tr>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Custodian Details</td>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Signature/Date</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '20%' }}>Receiving Officer's Name :</td>
                                                                <td className=" text-12" style={{ width: '20%' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '20%' }}>Receiving Officer's Destination :</td>
                                                                <td className=" text-12" style={{ width: '20%' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '20%' }}>Receiving Officer's NIC No :</td>
                                                                <td className=" text-12" style={{ width: '20%' }}></td>
                                                            </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '99%', borderRadius: '5px' }} >
                                                <table className="w-full">
                                                    <tbody>
                                                            <tr>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Despatch Section</td>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Name</td>
                                                                <td className=" font-bold text-12" style={{ width: '20%' }}>Signature/Date</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '20%' }}>Checked by</td>
                                                                <td className=" text-12" style={{ width: '20%' }}>......................................</td>
                                                                <td className=" text-12" style={{ width: '20%' }}>......................................</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '20%' }}>Received by (to dispatch)</td>
                                                                <td className=" text-12" style={{ width: '20%' }}>......................................</td>
                                                                <td className=" text-12" style={{ width: '20%' }}>......................................</td>
                                                            </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="w-full" >
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '90%', borderRadius: '5px' }} >
                                                <table className="w-full">
                                                    <tbody>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>No of Issued Items :</td>
                                                                <td className=" text-12" style={{ width: '10%' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>No of Pieces :</td>
                                                                <td className=" text-12" style={{ width: '10%' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>Estimated Weight (kg) :</td>
                                                                <td className=" text-12" style={{ width: '10%' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>Estimated Volume (m^3) :</td>
                                                                <td className=" text-12" style={{ width: '10%' }}></td>
                                                            </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '90%', borderRadius: '5px' }} >
                                                <table className="w-full">
                                                    <tbody>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>...........................................................</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>Issuing Officer's Name/Signature/Date</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>...........................................................</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>Received to Deliver Name/Signature/Date</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>...........................................................</td>
                                                            </tr>
                                                            <tr>
                                                                <td className=" text-12" style={{ width: '30%' }}>Receiving Officer's Name/Signature/Date</td>
                                                            </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remark */}
                                    <div className="mx-5 flex w-full" >
                                        <div className="w-full" >
                                            <div className="p-2 mx-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '95%', borderRadius: '5px' }} >
                                                <div className="flex" >
                                                    <p className="text-12 my-0">Remarks :</p>
                                                    <p className="text-12 my-0 ml-2 "></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Grid>
            </div>
        );
    }
}

export default PrintIssueNote;