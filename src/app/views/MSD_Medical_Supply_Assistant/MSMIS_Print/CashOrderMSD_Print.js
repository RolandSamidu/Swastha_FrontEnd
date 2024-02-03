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
import { convertTocommaSeparated, dateParse, msdServiceChargesCal, msdTotalChagesCal, timeParse } from 'utils'
import { margin } from '@mui/system'
import { roundDecimal } from 'utils'
import { padding } from '@mui/system'
import ClinicService from 'app/services/ClinicService'
import { caseSaleCharges } from 'appconst';
import { getPackDetails } from 'app/services/GetPacksize'
class NewlineText extends Component { }

class CashOrderMSD_Print extends Component {
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
            pickingSlipEmp: null,
            packedByEmp: null,
            hospital: null,
            packData: null
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
        total_batches: 0
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

        console.log('pack find', itemslist)

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
            items: uniquitemslist,
            Login_user_Hospital: Login_user_Hospital,
            selected_warehouse_cache: selected_warehouse_cache,

        })
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

    async loadData() {
        let userName = await localStorageService.getItem('userInfo').name
        let filters = { order_exchange_id: this.props.order_exchange_id }
        let res = await PharmacyOrderService.getOrderBatchItems(filters)
        if (res.status) {
            console.log('Order Item Batch Data', res.data.view.data)
            this.dataMapping(res.data.view.data)
            this.loadInstitute(res?.data?.view?.data[0]?.from_owner_id)
            this.setState({ data: res.data.view.data, userName: userName }, () => {
                this.getPacksizeDetails(this.state.data)
            })
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

    async loadOrderSummuries() {
        let filterData = {
            order_exchange_id: this.props.order_exchange_id,
            limit: 20,
            page: 0,
            orderby_sr: true
        }
        let res = await PharmacyOrderService.getOrderSummuries(filterData)
        if (res.status == 200) {
            console.log("mydata", res.data.view.data)
            this.setState({
                pickingSlipEmp: res.data?.view?.data?.filter(x => x.activity == "Picking Slip Prepared")[0]?.Employee,
                packedByEmp: res.data?.view?.data?.filter(x => x.activity == "Assembled")[0]?.Employee,
            })
        }
    }

    async loadInstitute(owner_id) {
        let params = {
            issuance_type: ["Hospital", 'RMSD Main'],
            'order[0]': ['createdAt', 'ASC']
        };

        let res = await ClinicService.fetchAllClinicsNew(params, owner_id);

        if (res.status == 200) {
            console.log("all hospitals", res?.data?.view?.data)
            this.setState({ hospital: res?.data?.view?.data[0] })

        }
    }
    componentDidMount() {
        this.getConsultant()
        this.loadData()
        this.loadOrderSummuries()
    }


    footer(pageRemineHeight, pageItemCount) {
        return (
            <div class="w-full" style={{ marginTop: `${pageRemineHeight}px` }}  >

                <div className=" mt-0 flex w-full">
                    <div className="w-full">
                        <div
                            className="m-1"
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
                                            className=" font-bold text-12 line-height-1"
                                            style={{ width: '20%' }}
                                        >
                                            Allocated by{' '}
                                        </td>
                                        <td
                                            className=" font-bold text-12 line-height-1"
                                            style={{ width: '20%' }}
                                        ></td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" font-bold text-12 line-height-1"
                                            style={{ width: '20%' }}
                                        >
                                            Delivery Instruction
                                        </td>
                                        <td
                                            className=" font-bold text-12 line-height-1"
                                            style={{ width: '20%' }}
                                        >
                                            Signature/Date
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" font-bold text-12 line-height-1"
                                            style={{ width: '20%' }}
                                        >
                                            Picking slip
                                            prepared by(SCO) :
                                        </td>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            {
                                                this.state.pickingSlipEmp?.name
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" font-bold text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            Assembled & Packed
                                            by(Storeman) :
                                        </td>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            {
                                                this.state.packedByEmp?.name
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            STV Printed by :
                                        </td>
                                        <td
                                            className=" text-12 line-height-1"
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
                            className="m-1"
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
                                            className=" font-bold text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            Custodian Details
                                        </td>
                                        <td
                                            className=" font-bold text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            Signature/Date
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            Receiving Officer's
                                            Name :
                                        </td>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >                                                                    {
                                                this.state.data2
                                                    .Delivery
                                                    ?.Employee
                                                    ?.name
                                            }</td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            Receiving Officer's
                                            Destination :
                                        </td>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >                                                                    {
                                                this.state.data2
                                                    .Delivery
                                                    ?.Employee
                                                    ?.type
                                            }</td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            Receiving Officer's
                                            NIC No :
                                        </td>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >                                                                    {
                                                this.state.data2
                                                    .Delivery
                                                    ?.Employee
                                                    ?.nic
                                            }</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div
                            className="m-1"
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
                                            className=" font-bold text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            Despatch Section
                                        </td>
                                        <td
                                            className=" font-bold text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            Name
                                        </td>
                                        <td
                                            className=" font-bold text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            Signature/Date
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            Checked by
                                        </td>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            ......................................
                                        </td>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            ......................................
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            Received by (to
                                            dispatch)
                                        </td>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '20%',
                                            }}
                                        >
                                            ......................................
                                        </td>
                                        <td
                                            className=" text-12 line-height-1"
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
                            className="m-1"
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
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '30%',
                                            }}
                                        >
                                            No of Issued Items :{' '}
                                            {
                                                pageItemCount + " of " + this.state.items.length
                                            }
                                        </td>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '10%',
                                            }}
                                        ></td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" text-12 line-height-1"
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
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '10%',
                                            }}
                                        ></td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '30%',
                                            }}
                                        >
                                            Estimated Weight
                                            (kg) :
                                        </td>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '10%',
                                            }}
                                        ></td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '30%',
                                            }}
                                        >
                                            Estimated Volume
                                            (m^3) :
                                        </td>
                                        <td
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '10%',
                                            }}
                                        ></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div
                            className="m-1"
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
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '30%',
                                            }}
                                        >
                                            ...........................................................
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" text-12 line-height-1"
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
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '30%',
                                            }}
                                        >
                                            ...........................................................
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" text-12 line-height-1"
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
                                            className=" text-12 line-height-1"
                                            style={{
                                                width: '30%',
                                            }}
                                        >
                                            ...........................................................
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            className=" text-12 line-height-1"
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
                <div className="flex w-full">
                    <div className="w-full">
                        <div
                            className=""
                            style={{
                                border: '1px solid',
                                borderColor: '#a5a4a4',
                                width: '95%',
                                borderRadius: '5px',
                            }}
                        >
                            <div className="flex p-2">
                                <p className="text-12 line-height-1 my-0">
                                    Remarks :
                                </p>
                                <p className="text-12 line-height-1 my-0 ml-2 "></p>
                            </div>
                        </div>
                    </div>
                </div>


            </div>)
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

        const batch_count_perPage = 16;

        const pageStyle = `

        @media print {
            @page {
                size: letter portrait; /* auto is default portrait; */
                margin: 0 !important;
           
            }
            .item_break{
                border-top: 1px solid #a5a4a4;
                
                }
            .page-break-after {
                display: block !important;
                page-break-after: always;
                counter-reset: page;
              }

            
            .page-number::after {
                counter-increment: page;
                content: counter(page);
              }
            .header {
                counter-reset: section;
                list-style-type: none;
              }
              
           
          
              .header, .header-space {
                height: 220px;
              }
             
              .footer, .footer-space {
                height: 340px;
              }
              .header {
                position: fixed;
                top: 0;
              }
              .footer {
                position: fixed;
                bottom: 0;
              }
             
              .row { display:flex;}
              .cell {display:inline-block;}
            
              .row-height{height:18px !important}
          }
          
       `;
        let sub_total = 0



        let reminder_batch_count = this.state.data.length;
        let filedLineCount = 0;
        let pageLineLimit = 15;
        let pageNo = 1;
        let pageItemCount = 0;
        let netSubTotal = 0;

        let pageRemineHeight = 340;

        return (
            <div className="hidden" >
                <Grid >
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
                        <div className="bg-white px-3" ref={(el) => (this.componentRef = el)} >


                            {
                                this.state.items?.map((item, index) => {
                                    let filterdData = this.state.data.filter((dataItem) => dataItem.OrderItem?.item_id == item)
                                    let total_qty = 0
                                    let total_value = 0

                                    filedLineCount = filedLineCount + 1
                                    pageRemineHeight = pageRemineHeight - 20;
                                    pageItemCount = pageItemCount + 1

                                  


                                    return (

                                        <div className="w-full" >


                                            {/* Starting Batches section */}
                                            {
                                                filterdData?.map((drug, batchIndex) => {
                                                    total_qty = total_qty + parseInt(drug?.allocated_quantity)
                                                    total_value = parseFloat(drug?.allocated_quantity) * parseFloat(roundDecimal(drug?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price, 3))
                                                    sub_total = sub_total + total_value

                                                    reminder_batch_count = reminder_batch_count - 1
                                                    filedLineCount = filedLineCount + 1
                                                    pageRemineHeight = pageRemineHeight - 25;
                                                    let newPage = false

                                                    if (filedLineCount + 1 >= pageLineLimit) {
                                                        newPage = true
                                                        filedLineCount = 0
                                                        pageRemineHeight = 340;
                                                        pageNo = pageNo + 1
                                                        //pageItemCount=0
                                                    }

                                                    if (reminder_batch_count == 0) {
                                                        pageRemineHeight = pageRemineHeight - 30;
                                                    }

                                                    let unitPrice = 0;
                                                    let totalPrice = 0;
                
                                                    unitPrice = roundDecimal(msdTotalChagesCal(drug?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price), 3)
                                                    totalPrice = roundDecimal((parseFloat(drug?.allocated_quantity) * parseFloat(unitPrice)), 3)
                                                    netSubTotal = netSubTotal + parseFloat(totalPrice)
                
                

                                                    return (
                                                        <div className={newPage ? "w-full" : "w-full"}>

                                                            {(newPage) &&
                                                                this.footer(50, pageItemCount - 1)
                                                            }
                                                            <div className={newPage ? "w-full page-break-after" : "w-full"}></div>
                                                            {/* Header */}
                                                            {(newPage || (index == 0 && batchIndex == 0)) &&
                                                                <div className="w-full">

                                                                    <div class="flex ">

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
                                                                                    <p className="text-12 l my-0">
                                                                                        Issuing Warehouse :
                                                                                    </p>
                                                                                    <p className="text-12 l my-0 ml-2 ">
                                                                                        {
                                                                                            this.state
                                                                                                .selected_warehouse_cache
                                                                                                ?.name
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex">
                                                                                    <p className="text-12 l my-0">
                                                                                        Receiving Warehouse :{' '}
                                                                                        {
                                                                                            this.state.data2
                                                                                                ?.fromStore?.name
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-12 l my-0 ml-2 "></p>
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
                                                                                    <p className="text-12 l my-0 p-0">
                                                                                        Address :{this.state.hospital?.name}
                                                                                    </p>
                                                                                    <p className="text-12 l my-0 ml-2 p-0"></p>
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
                                                                                    <p className="text-12 l my-0">
                                                                                        Request No :{' '}
                                                                                        {this.state.data2?.order_id}
                                                                                    </p>
                                                                                    <p className="text-12 l my-0 ml-2 "></p>
                                                                                </div>
                                                                                <div className="flex">
                                                                                    <p className="text-12 l my-0">
                                                                                        STV No :
                                                                                    </p>
                                                                                    <p className="text-12 l my-0 ml-2 ">
                                                                                        {this.state.selected_warehouse_cache?.name + "-" + this.state.stv_no}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex">
                                                                                    <p className="text-12 l my-0">
                                                                                        Issued Date & Time :
                                                                                    </p>
                                                                                    <p className="text-12 l my-0 ml-2 ">
                                                                                        {dateParse(new Date())} :{' '}
                                                                                        {timeParse(new Date())}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex">
                                                                                    <p className="text-12 l my-0">
                                                                                        User :
                                                                                    </p>
                                                                                    <p className="text-12 l my-0 ml-2 ">
                                                                                        {this.state.login_user_name}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex">
                                                                                    <p className="text-12 l my-0">
                                                                                        Page No :
                                                                                    </p>
                                                                                    <p className="text-12 l my-0 ml-2 ">
                                                                                        {pageNo}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            }

                                                            {(newPage || (index == 0 && batchIndex == 0)) &&
                                                                <Grid container spacing={1} className="w-full px-3">
                                                                    <Grid item lg={3} xs={3}>Batch</Grid>
                                                                    <Grid item lg={2} xs={2}>Exp Date</Grid>
                                                                    <Grid item lg={1} xs={1}>Qty</Grid>
                                                                    <Grid item lg={2} xs={2}>Unit Price(LKR)</Grid>
                                                                    <Grid item lg={2} xs={2}>Value(LKR)</Grid>
                                                                    <Grid item lg={2} xs={2}>Pack Size</Grid>
                                                                </Grid>
                                                            }



                                                            {/* Item Description and SR No section */}
                                                            <div className='w-full' >
                                                                {batchIndex == 0 &&
                                                                    <p style={{ verticalAlign: 'top' }} className={index == 0 ? "font-bold mt-3 px-3 row-height" : "font-bold  mt-3 px-3 item_break row-height"} >
                                                                        {index + 1 + '.    ' + filterdData[0]?.OrderItem?.ItemSnap?.sr_no + "  -  " +
                                                                            filterdData[0]?.OrderItem?.ItemSnap?.medium_description}
                                                                    </p>
                                                                }
                                                                {/* ----------------------------------------------------------- */}


                                                                <div className="row px-3 ">
                                                                    <div className="cell" style={{ width: '25%' }}>
                                                                        {drug?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no}
                                                                    </div>
                                                                    <div className="cell" style={{ width: '15%' }}>
                                                                        {dateParse(drug?.ItemSnapBatchBin?.ItemSnapBatch?.exd)}
                                                                    </div>
                                                                    <div className="cell" style={{ width: '15%' }}>
                                                                        {convertTocommaSeparated(drug?.allocated_quantity, 0)}
                                                                    </div>

                                                                    <div className="cell" style={{ width: '15%' }}>
                                                                        {/*  {convertTocommaSeparated(msdTotalChagesCal(drug?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price), 3)} */}
                                                                        {convertTocommaSeparated(unitPrice, 3)}
                                                                    </div>
                                                                    <div className="cell" style={{ width: '15%' }}>
                                                                        {/*  {convertTocommaSeparated(parseFloat(drug?.allocated_quantity) * parseFloat(msdTotalChagesCal(roundDecimal(drug?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price, 3))), 3)} */}
                                                                        {convertTocommaSeparated(totalPrice, 3)}
                                                                    </div>
                                                                    <div className="cell" style={{ width: '15%' }}>
                                                                        {/* {drug?.ItemSnapBatchBin?.ItemSnapBatch?.pack_size} */}
                                                                        {/*  {(this.state.packData?.find((x) => (x.item_id == drug?.OrderItem.item_id && x.batch_no == drug?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no && x.quantity == drug?.allocated_quantity))).packingdetails.join(', ')}
 */}
                                                                        {(this.state.packData?.find((x) => (x.item_id == drug?.OrderItem.item_id && x.batch_no == drug?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no && x.quantity == drug?.allocated_quantity)))?.packingdetails.map((x, packIndex) => {
                                                                            if (packIndex != 0) {
                                                                                filedLineCount = filedLineCount + 1
                                                                            }
                                                                            return <div>{x}</div>;
                                                                        })}



                                                                    </div>
                                                                </div>

                                                            </div>
                                                            {/* Footer */}


                                                            {(reminder_batch_count == 0) &&
                                                                <div className='w-full'>
                                                                    <table className='mt-5 ml-3'>
                                                                        <tr>
                                                                            <td className=" font-bold">
                                                                                Sub Total + Service Charge (10%) (LKR) :{' '}
                                                                            </td>
                                                                            <td className="">
                                                                                {/* {convertTocommaSeparated(msdTotalChagesCal(sub_total), 2)} */}
                                                                                {convertTocommaSeparated(netSubTotal, 2)}
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                    {this.footer(pageRemineHeight - 30, pageItemCount)}
                                                                </div>
                                                            }




                                                        </div>
                                                    )

                                                })

                                            }

                                        </div>

                                    )


                                })
                            }




                        </div>


                    </Grid >
                    : null
                }
            </div>
        )
    }
}

export default CashOrderMSD_Print
