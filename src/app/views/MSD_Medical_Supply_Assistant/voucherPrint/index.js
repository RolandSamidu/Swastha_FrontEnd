/*
Loons Lab Voucher Print
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import defaultLetterHead from '../PrintIssueNote/defaultLetterHead.jpg';
import defaultFooter from '../PrintIssueNote/defaultFooter.jpg';

import { convertTocommaSeparated, dateParse, numberToName } from "utils";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import FinanceServices from "app/services/FinanceServices";
import ConsignmentService from "app/services/ConsignmentService";
// import { CardTitle, Button, LoonsSnackbar } from 'app/components/LoonsLabComponents'
import { Button } from '@material-ui/core'

class VouchePrint extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code: 'd1e73931-4587-4fd7-b9bf-a178797495a2',
            vdata: [],
            voucherId: null,
            i: null,
            totalData: []
        }
    }

    static propTypes = {
        header: any,
        footer: any,
        code: String,
        voucherId: String,
        invoice_no: String,
        topic: String,
        i: String,
        autoPrint: any,
        hidden: any
    };

    static defaultProps = {
        header: defaultLetterHead,
        footer: defaultFooter,
        code: null,
        voucherId: null,
        invoice_no: null,
        topic: null,
        i: null,
        autoPrint: false,
        hidden: true,

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

    // async getVoucherData() {
    //     console.log('this.props.voucherId',this.props)
    //     // by id
    //     let res = await FinanceServices.getVoucherPrint({}, this.props.voucherId)

    //     if (res.status == 200) {
    //          console.log('voucher data',res.data.view)
    //         this.setState({ vdata: res.data.view })

    //     }
    // }


    // async getVoucherTotalData() {
    //     // by id
    //     let res = await FinanceServices.getVouchersTotalPrint({})

    //     if (res.status == 200) {
    //         // console.log('i',this.props.i)
    //          console.log('vouchertotal',res.data.view.data[this.props.i])
    //         // this.setState({ totalData: res.data.view.data[this.props.i] }) 
    //         // if (this.props.autoPrint) {
    //         //     this.printFunction()
    //         // }

    //     }
    // }


    componentDidMount() {
        // this.getVoucherData()
        console.log('chck grn details', this.props.grnNumber)
        console.log('chck incoming data 3', this.props.voucherId)
        console.log('invoiceDate', this.props.invoiceDatepass)
        // this.getVoucherTotalData()
    }

    render() {
        const {
            // rs,
            cts,
            tlCts,
        } = this.props;
        /*  size: 297mm 420mm, */
        const pageStyle = `

        
 
 @page {
    // width:216mm
    // margin-left:12mm,
    // margin-right:12mm,
    // // margin-bottom:5mm,
    // margin-top:8mm,
    size: letter portrait; /* auto is default portrait; */
    margin: 0 !important;
  }
 
  @media all {
    .pagebreak {
      display: none,
    }
  }

  @media print {
    

    // .page-break { page-break-after: always, }
    // .header, .header-space,
    //        {
    //         height: 2000px,
    //       }
// .footer, .footer-space,{
//             height: 100px,
//           }

//           .footerImage{
//             height: 10px,
//             bottom: 0,
//             margin-bottom: 0px,
//             padding-bottom: 0px,
            
//           }
//           .footer {
//             position: fixed,
//             bottom: 0,
            
//           }
//           .page-break {
//             margin-top: 1rem,
//             display: block,
//             page-break-before: auto,
//           }

//           .downFooter {
//             bottom: 0,
//             margin-top: 0px,
//             padding-top: 0px,
//           }
  }
`;



        return (
            <div className="hidden">
                <Grid className="w-full justify-end items-end flex ">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_0045" size="small" startIcon="print">Print</Button>}
                        // trigger={() => <Button id="print_presc_004" color="primary" size="small" style={{ margin: '0', padding: '0' }}></Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                {/* {this.state.Loaded ? */}
                <Grid className={this.props.hidden ? "bg-light-gray p-5 hidden" : "bg-light-gray p-5"}>
                    <div className="bg-white p-5" >
                        <div>

                            <div ref={(el) => (this.componentRef = el)} >
                                <Grid className="w-full" container>
                                    <Grid item sm={12}>
                                        <p className="mb-0 mr-0 p-0" style={{ marginLeft: '145mm', marginTop: '15mm', fontSize: "12px", }}>{this.props.voucherId?.voucher_no}</p>
                                    </Grid>

                                    <Grid item sm={12}>
                                        <p className="p-0 mb-0 mr-0 " style={{ marginLeft: '30mm', marginTop: '14mm', fontSize: "12px", }}>Medical Supplies Division, Ministry of Health -  Sri Lanka,</p>
                                        <p className="p-0 mb-0 mr-0" style={{ marginLeft: '30mm', marginTop: '1mm', fontSize: "12px", }}>357, Ven. Baddegama Wimalawansha Therro Mawatha, Colombo 10.</p>
                                        <p className="p-0" style={{ marginLeft: '50mm', marginTop: '2mm', fontSize: "12px", }}>Debit Particulars : 111-1-3-0-1204-1</p>
                                        <p className="p-0" style={{ marginLeft: '40mm', marginTop: '4mm', fontSize: "12px", }}>{this.props.voucherId?.Payee?.name ? this.props.voucherId?.Payee?.name : this.props.voucherId?.Document?.data?.supplier_name}</p>
                                    </Grid>

                                    <Grid item sm={12}>
                                        <table className="reqtable mb-0 mr-0" style={{ textAlign: "center", width: '100%' }}>

                                            <tr style={{ height: '88mm' }}>
                                                <td className="reqtable" style={{ fontSize: "12px", width: '17mm' }}>
                                                    <p className="p-0 m-0" style={{ fontSize: "12px" }}>{dateParse(this.props.voucherId?.createdAt)}</p>

                                                </td>
                                                <td style={{ textAlign: "left", width: '135mm' }}>
                                                    <p className="p-0 m-0 pl-2" style={{ fontSize: "12px", fontWeight: "bold" }}>{this.props.voucherId?.Document?.data?.debit_note_sub_type}</p>
                                                    <p className="p-0 m-0 pl-2" style={{ fontSize: "12px" }}>Invoice No : {this.props.voucherId?.Document?.data?.invoice_no}</p>
                                                    <p className="p-0 m-0 pl-2" style={{ fontSize: "12px" }}>Invoice Date : {dateParse(this.props.invoiceDatepass)}</p>
                                                    <p className="p-0 m-0 pl-2" style={{ fontSize: "12px" }}>PO Number : {this.props.voucherId?.po_no}</p>
                                                    <p className="p-0 m-0 pl-2" style={{ fontSize: "12px" }}>Order List : {this.props.voucherId?.order_list_no}</p>
                                                    <p className="p-0 m-0 pl-2" style={{ fontSize: "12px" }}>Item Code : {this.props.sr_no + ', '}</p>
                                                    {/* <p className="pl-2" style={{ fontSize: "12px" }}>GRN No : { this.props.grnNumber + ', '}</p> */}
                                                    {this.props.grnNumber ?
                                                        <table style={{ width: '100%' }}>
                                                            <tr>
                                                                <td className="pl-2" style={{ width: '50%', fontSize: "12px" }}>GRN No : </td>
                                                                <td style={{ width: '50%', fontSize: "12px" }}></td>
                                                            </tr>
                                                            {console.log('this.props.grnNumber', this.props.grnNumber)}
                                                            {this.props.grnNumber && this.props.grnNumber.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td style={{ width: '50%', paddingLeft: 20, fontSize: "12px" }}>{item.grn_No}</td>
                                                                    <td style={{ width: '50%', fontSize: "12px" }}>{dateParse(item.grn_date)}</td>
                                                                </tr>
                                                            ))}
                                                        </table>
                                                        : null}

                                                    <p className="p-0 m-0 pl-2" style={{ fontSize: "12px" }}>GRN Qty : {convertTocommaSeparated(this.props.grnQty, 2)}</p>
                                                    <p className="p-0 m-0 pl-2" style={{ fontSize: "12px" }}>Report No : {this.props.voucherId?.report_no }</p>
                                                    <p className="p-0 m-0 pl-2" style={{ fontSize: "12px" }}>File No : {this.props.voucherId?.file_no }</p>
                                                    {/* <p className="p-0 m-0" style={{ fontSize: "12px" }}>Rate : {this.props.voucherId?.Document?.data?.transaction[0]?.rate}</p> */}
                                                    <p className="p-0 m-0 pl-2" style={{ fontSize: "12px" }}>Rate : {this.props.voucherId?.Document?.data?.exchange_rate}</p>
                                                    
                                                    
                                                </td>
                                                <td className="reqtable" style={{ fontSize: "12px", width: '18mm', }}>
                                                    
                                                </td>
                                                <td className="reqtable" style={{ textAlign: "right", fontSize: "12px", width: '21mm', }}>
                                                    <p className="p-0 m-0" style={{ fontSize: "12px" }}>{convertTocommaSeparated(this.props.voucherId?.amount, 2)}</p>
                                                </td>
                                                <td className="reqtable" style={{ fontSize: "12px", height: '10mm', }}>
                                                </td>
                                            </tr>

                                            <tr style={{ height: '11mm' }}>
                                                <td className="reqtable" style={{ fontSize: "12px", width: '17mm', textAlign: "left", }}></td>
                                                <td className="reqtable" style={{ fontSize: "12px", width: "135mm", textAlign: "left", }}></td>
                                                <td className="reqtable" style={{ fontSize: "12px", width: '18mm', }}></td>
                                                <td className="reqtable" style={{ fontSize: "12px", width: '21mm', textAlign: "right", marginTop: '4mm' }}>{this.props.voucherId?.final_amount == null ? convertTocommaSeparated(this.props.voucherId?.amount, 2) : convertTocommaSeparated(this.props.voucherId?.final_amount, 2)}</td>
                                                <td className="reqtable" style={{ fontSize: "12px", width: '10mm', }}>{tlCts}</td>
                                            </tr>

                                        </table>
                                    </Grid>

                                    <Grid item sm={12}>
                                        <p className="p-0 mr-0 mb-0" style={{ width: '110mm', marginTop: '9mm', marginLeft: '100mm' }}>{numberToName(this.props.voucherId?.final_amount == null ? this.props.voucherId?.amount : this.props.voucherId?.final_amount)}</p>
                                    </Grid>
                                    {/* <Grid item sm={12}>
                                        <p className="p-0 mr-0 mb-0" style={{marginLeft:'12mm', marginTop:'20mm'}}>{dateParse(new Date())}</p>
                                    </Grid> */}


                                </Grid>
                            </div>
                        </div>
                    </div>
                </Grid>
                {/* : null} */}
            </div>
        );
    }
}

export default VouchePrint;