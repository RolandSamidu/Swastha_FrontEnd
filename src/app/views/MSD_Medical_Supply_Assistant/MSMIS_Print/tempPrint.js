/*
Loons Lab Sub title component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from 'react'
import { Divider, Typography, Grid, Box } from '@material-ui/core'
import ReactToPrint from 'react-to-print'
import { any, string } from 'prop-types'
import defaultLetterHead from '../PrintIssueNote/defaultLetterHead.jpg'
import defaultFooter from '../PrintIssueNote/defaultFooter.jpg'
import { Button, SubTitle } from 'app/components/LoonsLabComponents'
import Barcode from 'react-jsbarcode'
import UtilityServices from 'app/services/UtilityServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import ChiefPharmacistServices from 'app/services/ChiefPharmacistServices'
import localStorageService from 'app/services/localStorageService'
import moment from 'moment'
import { dateParse, timeParse } from 'utils'
import { margin } from '@mui/system'
import { roundDecimal } from 'utils'
import { padding } from '@mui/system'
class NewlineText extends Component { }

class MSD_Print extends Component {
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
            userRoles: [],
            mapedData: null,
            Loaded: false,
            total_price: '0',
            userName: null,
            data2: [],
        }
    }

    static propTypes = {
        header: any,
        footer: any,
        ref: any,
        drugList: any,
        patientInfo: any,
        clinic: any,
        user_roles: any,
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
    }

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
        user_roles: [],
    }

    newlineText(text) {
        if (text) {
            return text.split('\n').map((str) => <p>{str}</p>)
        } else {
            return ''
        }
    }

    printFunction() {
        // document.getElementById('print_presc_001').click();
        console.log('okkk')
    }
    async getConsultant() {
        var user = await localStorageService.getItem('userInfo')
        console.log('user', user)
        this.setState({ consultant: user, userRoles: user.roles })
    }

    async dataMapping(data) {
        let array = []
        /*  data.forEach(element => {
             let item_id =
         }); */

        let itemslist = data.map((data) => data.OrderItem.item_id)
        let uniquitemslist = [...new Set(itemslist)]

        // console.log('pack find',itemslist)

        var selected_warehouse_cache = await localStorageService.getItem(
            'Selected_Warehouse'
        )
        let Login_user_Hospital = await localStorageService.getItem(
            'Login_user_Hospital'
        )
        let Login_user_info = await localStorageService.getItem('userInfo')

        console.log('uniqe data', uniquitemslist)
        this.setState({
            login_user_name: Login_user_info.name,
            items: [...uniquitemslist,...uniquitemslist,...uniquitemslist,...uniquitemslist,...uniquitemslist,...uniquitemslist,...uniquitemslist,...uniquitemslist],
            Login_user_Hospital: Login_user_Hospital,
            selected_warehouse_cache: selected_warehouse_cache,
            Loaded: true,
        })
    }

    async loadData() {
        let userName = await localStorageService.getItem('userInfo').name
        let filters = { order_exchange_id: this.props.order_exchange_id }
        let res = await PharmacyOrderService.getOrderBatchItems(filters)
        if (res.status) {
            console.log('Order Item Batch Data', res.data.view.data)
            this.dataMapping(res.data.view.data)
            this.setState({ data: res.data.view.data, userName: userName })
        }
        console.log('data', res)
        let res2 = await ChiefPharmacistServices.getSingleOrder(
            {},
            this.props.order_exchange_id
        )
        if (res2.status == 200) {
            console.log('Order Item single order', res2.data.view)

            this.setState(
                {
                    stv_no: res2.data.view.stv_no,
                    userName: userName,
                    data2: res2.data.view,
                },
                () => {
                    this.render()
                }
            )
        }
        console.log('data2', res2)
    }

    getBatchCount(data) {
        let batch = data?.map(
            (val) => val?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no
        )
        return batch.length
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
            user_roles,
            clinic,
        } = this.props
        /*  size: 297mm 420mm; */
        const pageStyle = `

        
 
        @page {
           
           margin-left:10mm,
           margin-right:5mm,
           margin-bottom:390px,
           margin-top:8mm,
           @bottom-left {
               content: counter(page) ' of ' counter(pages);
             }
         }
        
         @media all {
           .pagebreak {
             display: none,
           }
         }
       
         @media print {
           
       
           .page-break { page-break-after: always, }
           .header, .header-space{
             height: 200px;
           }
          .footer, .footer-space {
             height: 380px;
           }
           
           .header {
             position: fixed;
             top: 0;
           }
           .footer {
             position: fixed;
             bottom: 0;
           }
                 .page-break {
                   margin-top: 1rem,
                   display: block,
                   page-break-before: auto,
                 }
       
                 .downFooter {
                   bottom: 0,
                   margin-top: 0px,
                   padding-top: 0px,
                 }
       
                 #content {
                   display: table;
               }
               
               #pageFooter {
                   display: table-footer-group;
               }
               
               #pageFooter:after {
                   counter-increment: page;
                   content: counter(page);
               }
               #table-reset {
                   counter-reset: page;
                 }

                 .page-number::before {
                    content: counter(page);
                  }
                }
                
                .page {
                  page-break-after: always;
                }
                
                .page-number {
                  position: absolute;
                  bottom: 10px;
                  right: 10px;
                }
         }
       `;
        let sub_total = 0

        return (
            <div className="hidden">
                <Grid className="w-full justify-end items-end flex p-5">
                    <ReactToPrint
                        trigger={() => (
                            <Button
                                id="print_msd_004"
                                size="small"
                                startIcon="print"
                            >
                                Print
                            </Button>
                        )}
                        pageStyle={pageStyle}
                        documentTitle={letterTitle}
                        //removeAfterPrint
                        content={() => this.componentRef}
                    />
                </Grid>
                {this.state.Loaded ?
                    <Grid
                        className="bg-light-gray  "
                        style={{ borderStyle: 'double', borderColor: '#a5a4a4' }}
                    >
                        <div className="bg-white ">
                            <div>
                                <div ref={(el) => (this.componentRef = el)}>
                                <span className="page-number"></span>
                                    <table>
                                        <thead><tr><td>
                                            <div class="header-space w-full">
                                                <div class="header w-full">
                                                    <div class="flex ">
                                                        {/*  <div className="pl-10" style={{ width: "60%" }}>
                                        <img alt="A test image" src={header} style={{ width: '100%' }} />
                                    </div> */}
                                                        <div
                                                            className="pt-5 pl-5"
                                                            style={{ width: '40%' }}
                                                        >
                                                            <SubTitle title="Accountant Copy"></SubTitle>
                                                        </div>
                                                    </div>

                                                    <div className="w-full font-bold text-20 text-center">
                                                        Medical Supplies Division - Ministry of
                                                        Health
                                                    </div>

                                                    <div className="w-full font-bold text-16 text-center">
                                                        Stock Transfer Voucher{' '}
                                                    </div>
                                                    {/* Boxes */}
                                                    <div className="mx-0 my-0 flex w-full" style={{ padding: '0px', margin: '0px' }}>
                                                        <div className="w-full">
                                                            <div
                                                                className="p-2 m-2"
                                                                style={{
                                                                    border: '1px solid',
                                                                    borderColor: '#a5a4a4',
                                                                    width: '99%',
                                                                    borderRadius: '5px',
                                                                    margin: 0
                                                                }}
                                                            >
                                                                <div className="flex">
                                                                    <p className="text-10 line-height-1 my-0">
                                                                        Issuing Warehouse :
                                                                    </p>
                                                                    <p className="text-10 line-height-1 my-0 ml-2 ">
                                                                        {
                                                                            this.state
                                                                                .selected_warehouse_cache
                                                                                ?.name
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="flex">
                                                                    <p className="text-10 line-height-1 my-0">
                                                                        Receiving Warehouse :{' '}
                                                                        {
                                                                            this.state.data2
                                                                                ?.fromStore?.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-10 line-height-1 my-0 ml-2 "></p>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="p-2 m-2"
                                                                style={{
                                                                    border: '1px solid',
                                                                    borderColor: '#a5a4a4',
                                                                    width: '99%',
                                                                    borderRadius: '5px',
                                                                    margin: '0px',
                                                                    padding: '0px'

                                                                }}
                                                            >
                                                                <div className="flex">
                                                                    <p className="text-10 line-height-1 my-0 p-0">
                                                                        Address :{' '}
                                                                    </p>
                                                                    <p className="text-10 line-height-1 my-0 ml-2 p-0"></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="w-full">
                                                            <div
                                                                className="p-2 m-2"
                                                                style={{
                                                                    border: '1px solid',
                                                                    borderColor: '#a5a4a4',
                                                                    width: '90%',
                                                                    borderRadius: '5px',
                                                                    margin: 0
                                                                }}
                                                            >
                                                                <div className="flex">
                                                                    <p className="text-10 line-height-1 my-0">
                                                                        Request No :{' '}
                                                                        {this.state.data2?.order_id}
                                                                    </p>
                                                                    <p className="text-10 line-height-1 my-0 ml-2 "></p>
                                                                </div>
                                                                <div className="flex">
                                                                    <p className="text-10 line-height-1 my-0">
                                                                        STV No :
                                                                    </p>
                                                                    <p className="text-10 line-height-1 my-0 ml-2 ">
                                                                        {this.state.stv_no}
                                                                    </p>
                                                                </div>
                                                                <div className="flex">
                                                                    <p className="text-10 line-height-1 my-0">
                                                                        Issued Date & Time :
                                                                    </p>
                                                                    <p className="text-10 line-height-1 my-0 ml-2 ">
                                                                        {dateParse(new Date())} :{' '}
                                                                        {timeParse(new Date())}
                                                                    </p>
                                                                </div>
                                                                <div className="flex">
                                                                    <p className="text-10 line-height-1 my-0">
                                                                        User :
                                                                    </p>
                                                                    <p className="text-10 line-height-1 my-0 ml-2 ">
                                                                        {this.state.login_user_name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </td></tr></thead>
                                        <tbody><tr><td>
                                            <div class="content page w-full" >
                                                <table style={{ padding: '0px', marginTop: '-5px' }} className="w-full">
                                                
                                                    <thead>
                                                        <tr>
                                                            <td className='p-0 m-0'></td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='p-0 m-0'>
                                                                <div className="content pl-10 pr-5" style={{ padding: '0px', marginTop: '-5px' }}>
                                                                    {/*  Letter refferences section */}

                                                                    {
                                                                        // drugList?.filter((ele) => ele.availability==false).map((drug, index) =>

                                                                        this.state.items?.map(
                                                                            (item, index) => {
                                                                                let filterdData =
                                                                                    this.state.data.filter(
                                                                                        (
                                                                                            dataItem
                                                                                        ) =>
                                                                                            dataItem
                                                                                                .OrderItem
                                                                                                ?.item_id ==
                                                                                            item
                                                                                    )
                                                                                let total_qty = 0
                                                                                let total_value = 0

                                                                                return (
                                                                                    <div className='p-0 m-0'>
                                                                                        <p className="font-bold text-10 line-height-1 m-0 p-0">
                                                                                            {index +
                                                                                                1 +
                                                                                                '.' +
                                                                                                filterdData[0]
                                                                                                    ?.OrderItem
                                                                                                    ?.ItemSnap
                                                                                                    ?.medium_description + " " + filterdData[0]
                                                                                                        ?.OrderItem
                                                                                                        ?.ItemSnap
                                                                                                    ?.sr_no}
                                                                                        </p>

                                                                                        <table className="w-full px-20 ">
                                                                                            <tbody className="w-full ">
                                                                                                <tr className="w-full">
                                                                                                    <td
                                                                                                        className="text-10 line-height-1 font-bold pr-10"
                                                                                                        style={{
                                                                                                            width: '20%',
                                                                                                        }}
                                                                                                    >
                                                                                                        Batch
                                                                                                    </td>

                                                                                                    <td
                                                                                                        className="text-10 line-height-1 font-bold pr-10 "
                                                                                                        style={{
                                                                                                            width: '20%',
                                                                                                            whiteSpace:
                                                                                                                'pre',
                                                                                                        }}
                                                                                                    >
                                                                                                        Exp
                                                                                                        Date
                                                                                                    </td>
                                                                                                    <td
                                                                                                        className="text-10 line-height-1 font-bold pr-10"
                                                                                                        style={{
                                                                                                            width: '20%',
                                                                                                        }}
                                                                                                    >
                                                                                                        Qty
                                                                                                    </td>
                                                                                                    <td
                                                                                                        className="text-10 line-height-1 font-bold pr-10"
                                                                                                        style={{
                                                                                                            width: '20%',
                                                                                                            whiteSpace:
                                                                                                                'pre',
                                                                                                        }}
                                                                                                    >
                                                                                                        Pack
                                                                                                        Size
                                                                                                    </td>
                                                                                                    <td
                                                                                                        className="text-10 line-height-1 font-bold pr-10"
                                                                                                        style={{
                                                                                                            width: '20%',
                                                                                                            whiteSpace:
                                                                                                                'pre',
                                                                                                        }}
                                                                                                    >
                                                                                                        Unit
                                                                                                        Price(LKR)
                                                                                                    </td>
                                                                                                    <td
                                                                                                        className="text-10 line-height-1 font-bold pr-10 "
                                                                                                        style={{
                                                                                                            width: '20%',
                                                                                                        }}
                                                                                                    >
                                                                                                        Value(LKR)
                                                                                                    </td>
                                                                                                </tr>

                                                                                                {
                                                                                                    // drugList?.filter((ele) => ele.availability==false).map((drug, index) =>
                                                                                                    filterdData?.map(
                                                                                                        (
                                                                                                            drug,
                                                                                                            index
                                                                                                        ) => {
                                                                                                            total_qty =
                                                                                                                total_qty +
                                                                                                                parseInt(
                                                                                                                    drug?.allocated_quantity
                                                                                                                )
                                                                                                            total_value =
                                                                                                                total_value +
                                                                                                                parseFloat(
                                                                                                                    drug?.allocated_quantity
                                                                                                                ) *
                                                                                                                parseFloat(
                                                                                                                    drug
                                                                                                                        ?.ItemSnapBatchBin
                                                                                                                        ?.ItemSnapBatch
                                                                                                                        ?.unit_price
                                                                                                                )
                                                                                                            sub_total =
                                                                                                                sub_total +
                                                                                                                total_value
                                                                                                            return (
                                                                                                                <tr>
                                                                                                                    <td
                                                                                                                        className="text-10 line-height-1"
                                                                                                                        style={{
                                                                                                                            whiteSpace:
                                                                                                                                'pre',
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        {
                                                                                                                            drug
                                                                                                                                ?.ItemSnapBatchBin
                                                                                                                                ?.ItemSnapBatch
                                                                                                                                ?.batch_no
                                                                                                                        }
                                                                                                                    </td>
                                                                                                                    <td className="text-10 line-height-1 ">
                                                                                                                        {dateParse(
                                                                                                                            drug
                                                                                                                                ?.ItemSnapBatchBin
                                                                                                                                ?.ItemSnapBatch
                                                                                                                                ?.exd
                                                                                                                        )}
                                                                                                                    </td>
                                                                                                                    <td className="text-10 line-height-1 ">

                                                                                                                        {
                                                                                                                            drug?.allocated_quantity
                                                                                                                        }
                                                                                                                    </td>
                                                                                                                    <td className="text-10 line-height-1">
                                                                                                                        {
                                                                                                                            drug?.ItemSnapBatchBin?.ItemSnapBatch?.pack_size
                                                                                                                        }
                                                                                                                    </td>
                                                                                                                    <td className="text-10 line-height-1">
                                                                                                                        {
                                                                                                                            drug
                                                                                                                                ?.ItemSnapBatchBin
                                                                                                                                ?.ItemSnapBatch
                                                                                                                                ?.unit_price
                                                                                                                        }
                                                                                                                    </td>
                                                                                                                    <td className="text-10 line-height-1 ">
                                                                                                                        {roundDecimal(
                                                                                                                            parseFloat(
                                                                                                                                drug?.allocated_quantity
                                                                                                                            ) *
                                                                                                                            parseFloat(
                                                                                                                                drug
                                                                                                                                    ?.ItemSnapBatchBin
                                                                                                                                    ?.ItemSnapBatch
                                                                                                                                    ?.unit_price
                                                                                                                            ),
                                                                                                                            2
                                                                                                                        )}
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                    )
                                                                                                }

                                                                                                <tr>
                                                                                                    <td className="text-10 line-height-1 font-bold">
                                                                                                        Total
                                                                                                        Item
                                                                                                        :{' '}
                                                                                                    </td>
                                                                                                    <td className="text-10 line-height-1 "></td>
                                                                                                    <td className="text-10 line-height-1 ">
                                                                                                        {
                                                                                                            total_qty
                                                                                                        }
                                                                                                    </td>
                                                                                                    <td className="text-10 line-height-1 "></td>
                                                                                                    <td className="text-10 line-height-1  font-bold">
                                                                                                        Total
                                                                                                        Value(LKR)
                                                                                                        :{' '}
                                                                                                    </td>
                                                                                                    <td className="text-10 line-height-1">
                                                                                                        {roundDecimal(
                                                                                                            total_value,
                                                                                                            2
                                                                                                        )}
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        )
                                                                    }

                                                                    <table>
                                                                        <tr>
                                                                            <td className="text-10 line-height-1  font-bold">
                                                                                Sub Total(LKR) :{' '}
                                                                            </td>
                                                                            <td className="text-10 line-height-1">
                                                                                {sub_total}
                                                                            </td>
                                                                        </tr>
                                                                    </table>

                                                                    {/* Letter Address */}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td className='p-0 m-0'>
                                                                <div class="footer-space">
                                                                    {' '}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </td></tr></tbody>
                                        <tfoot><tr><td>
                                            <div class="footer-space w-full"> </div>
                                        </td></tr></tfoot>
                                    </table>



                                    <div class="footer w-full">

                                        {/* Below boxes */}

                                        <div className="mx-5 my-2 mt-0 flex w-full">
                                            <div className="w-full">
                                                <div
                                                    className="p-2 m-2"
                                                    style={{
                                                        border: '1px solid',
                                                        borderColor: '#a5a4a4',
                                                        width: '99%',
                                                        borderRadius: '5px',
                                                    }}
                                                >
                                                    <table className="w-full ">
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    className=" font-bold text-10 line-height-1"
                                                                    style={{width: '20%'}}
                                                                >
                                                                    Allocated by{' '}
                                                                </td>
                                                                <td
                                                                    className=" font-bold text-10 line-height-1"
                                                                    style={{width: '20%'}}
                                                                ></td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" font-bold text-10 line-height-1"
                                                                    style={{width: '20%'}}
                                                                >
                                                                    Delivery Instruction
                                                                </td>
                                                                <td
                                                                    className=" font-bold text-10 line-height-1"
                                                                    style={{width: '20%'}}
                                                                >
                                                                    Signature/Date
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" font-bold text-10 line-height-1"
                                                                    style={{ width: '20%'}}
                                                                >
                                                                    Picking slip
                                                                    prepared by :
                                                                </td>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    {
                                                                        this.state.data2
                                                                            .Employee
                                                                            ?.name
                                                                    }
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" font-bold text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    Assembled & Packed
                                                                    by :
                                                                </td>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    {
                                                                        this.state.data2
                                                                            .Delivery
                                                                            ?.Employee
                                                                            ?.name
                                                                    }
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    STV Printed by :
                                                                </td>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    {
                                                                        this.state
                                                                            .userName
                                                                    }
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div
                                                    className="p-2 m-2"
                                                    style={{
                                                        border: '1px solid',
                                                        borderColor: '#a5a4a4',
                                                        width: '99%',
                                                        borderRadius: '5px',
                                                    }}
                                                >
                                                    <table className="w-full">
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    className=" font-bold text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    Custodian Details
                                                                </td>
                                                                <td
                                                                    className=" font-bold text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    Signature/Date
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    Receiving Officer's
                                                                    Name :
                                                                </td>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                ></td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    Receiving Officer's
                                                                    Destination :
                                                                </td>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                ></td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    Receiving Officer's
                                                                    NIC No :
                                                                </td>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                ></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div
                                                    className="p-2 m-2"
                                                    style={{
                                                        border: '1px solid',
                                                        borderColor: '#a5a4a4',
                                                        width: '99%',
                                                        borderRadius: '5px',
                                                    }}
                                                >
                                                    <table className="w-full">
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    className=" font-bold text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    Despatch Section
                                                                </td>
                                                                <td
                                                                    className=" font-bold text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    Name
                                                                </td>
                                                                <td
                                                                    className=" font-bold text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    Signature/Date
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    Checked by
                                                                </td>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    ......................................
                                                                </td>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    ......................................
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    Received by (to
                                                                    dispatch)
                                                                </td>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    ......................................
                                                                </td>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '20%',
                                                                    }}
                                                                >
                                                                    ......................................
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <div
                                                    className="p-2 m-2"
                                                    style={{
                                                        border: '1px solid',
                                                        borderColor: '#a5a4a4',
                                                        width: '90%',
                                                        borderRadius: '5px',
                                                    }}
                                                >
                                                    <table className="w-full">
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '30%',
                                                                    }}
                                                                >
                                                                    No of Issued Items :{' '}
                                                                    {
                                                                        this.state.data
                                                                            .length
                                                                    }
                                                                </td>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '10%',
                                                                    }}
                                                                ></td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '30%',
                                                                    }}
                                                                >
                                                                    No of Pieces :{' '}
                                                                    {this.getBatchCount(
                                                                        this.state.data
                                                                    )}
                                                                </td>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '10%',
                                                                    }}
                                                                ></td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '30%',
                                                                    }}
                                                                >
                                                                    Estimated Weight
                                                                    (kg) :
                                                                </td>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '10%',
                                                                    }}
                                                                ></td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '30%',
                                                                    }}
                                                                >
                                                                    Estimated Volume
                                                                    (m^3) :
                                                                </td>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '10%',
                                                                    }}
                                                                ></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div
                                                    className="p-2 m-2"
                                                    style={{
                                                        border: '1px solid',
                                                        borderColor: '#a5a4a4',
                                                        width: '90%',
                                                        borderRadius: '5px',
                                                    }}
                                                >
                                                    <table className="w-full">
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '30%',
                                                                    }}
                                                                >
                                                                    ...........................................................
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '30%',
                                                                    }}
                                                                >
                                                                    Issuing Officer's
                                                                    Name/Signature/Date
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '30%',
                                                                    }}
                                                                >
                                                                    ...........................................................
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '30%',
                                                                    }}
                                                                >
                                                                    Received to Deliver
                                                                    Name/Signature/Date
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '30%',
                                                                    }}
                                                                >
                                                                    ...........................................................
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className=" text-10 line-height-1"
                                                                    style={{
                                                                        width: '30%',
                                                                    }}
                                                                >
                                                                    Receiving Officer's
                                                                    Name/Signature/Date
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Remark */}
                                        <div className="mx-5 flex w-full">
                                            <div className="w-full">
                                                <div
                                                    className="p-2 mx-2"
                                                    style={{
                                                        border: '1px solid',
                                                        borderColor: '#a5a4a4',
                                                        width: '95%',
                                                        borderRadius: '5px',
                                                    }}
                                                >
                                                    <div className="flex">
                                                        <p className="text-10 line-height-1 my-0">
                                                            Remarks :
                                                        </p>
                                                        <p className="text-10 line-height-1 my-0 ml-2 "></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>




                                    {/* 1st Page */}

                                    {/* 4th Page */}


                                    {/* Table */}



                                </div>
                            </div>
                        </div>
                    </Grid>
                    : null}
            </div>
        )
    }
}

export default MSD_Print
