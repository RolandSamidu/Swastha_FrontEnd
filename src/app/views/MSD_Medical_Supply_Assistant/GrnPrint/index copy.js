/*
Loons Lab GRNPrint
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Divider, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import { convertTocommaSeparated, dateParse, roundDecimal, timeParse } from "utils";
import ConsignmentService from "app/services/ConsignmentService";


class GRNPrint extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            today: new Date(),
            printData: [],
            itemIDs: [],
            packData: []
        }
    }

    static propTypes = {
    };

    static defaultProps = {

    };

    newlineText(text) {
        if (text) {
            return text.split('\n').map(str => <p>{str}</p>);
        } else {
            return ""
        }

    }

    // get packing details
    // async getPackingDetails(){

    //     let params = {
    //         search_type:'UOMS',
    //         consignment_item_id: this.state.itemIDs
    //     }
    //     let res = await ConsignmentService.getConsignmentItems(params)

    //     if (res.status === 200){
    //         console.log('packingdet', res.data.view.data)

    //         this.setState({
    //             packData:res.data.view.data
    //         })

    //         // let updatedArray = res.data.view.data.map((obj1) => {
    //         //     const obj2 = this.props.printData.find((obj) => obj.ConsignmentItemBatch.item_id === obj1.item_id);

    //         //     console.log('testing', updatedArray, obj2)
    //         //     // if (obj2) {
    //         //     //     return { ...obj1, ...obj2 };
    //         //     // }
    //         //     // return obj1;
    //         // });
    //     }

    // }


    // async dataMapping() {
    //     let array = []
    //     let data = this.props.printData
    //     console.log('mydta', data)
    //     let itemslist = data.map((data) => data.ConsignmentItemBatch?.item_id)
    //     let uniquitemslist = [...new Set(itemslist)]

    //     console.log('pack find', itemslist)


    //     console.log('uniqe data-1111', uniquitemslist)
    //     this.setState({
    //         itemIDs: uniquitemslist,
    //         Loaded: true,
    //     },()=>{
    //         this.getPackingDetails()
    //     })
    // }


    componentDidMount() {
        console.log('props', this.props.items)
        // this.dataMapping()
    }

    render() {

        let grnCount = 0

        const {
        } = this.props;
        /*  size: 297mm 420mm, */
        const pageStyle = `

 @page {
    
    margin-left:10mm,
    margin-right:5mm,
    margin-bottom:5mm,
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
    .header, .header-space,
           {
            position: fixed;
            height: 20px,
            top:0
          }
.footer, .footer-space,{
            height: 100px,
          }

          .footerImage{
            height: 10px,
            bottom: 0,
            margin-bottom: 0px,
            padding-bottom: 0px,
            
          }
          .footer {
            position: fixed,
            bottom: 0,
            
          }
          .page-break {
            margin-top: 1rem,
            display: block,
            page-break-before: auto,
          }

          .page-break-after {
            display: block !important;
            page-break-after: always;
            counter-reset: page;
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
  }
`;
        let filedLineCount = 0;
        let pageLineLimit = 7;
        let pageNo = 0;
        let pageItemCount = 0;

        let pageRemineHeight = 340;

        const firstPageLineLimit = 5;
        const otherPagesLineLimit = 15;

        return (
            <div className="hidden">
                <Grid className="w-full justify-end items-end flex">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_01" size="small" startIcon="print">Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                <Grid className="bg-light-gray p-5" >
                    <div className="bg-white p-5" >
                        <div>

                            <div ref={(el) => (this.componentRef = el)} >


                                <table className="w-full" id="table-reset">
                                    <thead><tr><td>
                                        <div class="header-space">
                                            <div className="header">

                                                <Grid container style={{ borderBottom: '1px solid black' }}>
                                                    <Grid item xs={12} >
                                                        <table style={{ width: '100%' }}>
                                                            <tr>
                                                                <td style={{ fontSize: '12px', textAlign: 'left', width: '50%' }}></td>
                                                                <td style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'right', width: '50%' }}>Health 954</td>
                                                            </tr>
                                                        </table>
                                                    </Grid>

                                                    <Grid item xs={12} style={{ textAlign: 'center', width: '100%' }} >
                                                        <table style={{ textAlign: 'center', width: '100%' }}>
                                                            <tr>
                                                                <td>
                                                                    <p className="p-0 m-0" style={{ fontSize: '15px', fontWeight: 'bold' }}>MEDICAL SUPPLIES DIVISION - MINISTORY OF HEALTH</p>
                                                                    <p className="m-0 p-0" style={{ fontSize: '12px' }}>NO : 357, Rev. Baddegama Wimalawansha Thero Mawatha</p>
                                                                    <p className="m-0 p-0" style={{ fontSize: '12px' }}>Colombo 10.</p>
                                                                    <p style={{ fontSize: '13px', fontWeight: 'bold' }}><spam style={{ border: '1px solid black', padding: '5px', borderRadius: '3px' }}>GOODS RECEIVED NOTE (GRN)</spam></p>
                                                                </td>
                                                            </tr>
                                                        </table>

                                                    </Grid>
                                                </Grid>

                                            </div>
                                        </div>
                                    </td></tr></thead>
                                    {/* <div style={{border:'1px solid black', width:'100%'}}> */}
                                    <tbody><tr><td>
                                        <div className="content">
                                            <Grid className="w-full" container>

                                                <Grid item xs={12}>
                                                    <table style={{ width: '100%' }}>
                                                        <tr>
                                                            <td style={{ width: '70%' }}></td>
                                                            <td style={{ width: '10%' }}>
                                                                <p className="p-0 m-0" style={{ fontWeight: 'bold', fontSize: '12px' }}>Date</p>
                                                                <p className="p-0 m-0" style={{ fontWeight: 'bold', fontSize: '12px' }}>Time</p>
                                                                <p className="p-0 m-0" style={{ fontWeight: 'bold', fontSize: '12px' }}>User</p>
                                                                <p className="p-0 m-0" style={{ fontWeight: 'bold', fontSize: '12px' }}>{ }</p>
                                                            </td>
                                                            <td style={{ width: '20%' }}>
                                                                <p className="p-0 m-0" style={{ fontSize: '12px' }}>: {dateParse(this.state.today)}</p>
                                                                <p className="p-0 m-0" style={{ fontSize: '12px' }}>: {timeParse(this.state.today)}</p>
                                                                <p className="p-0 m-0" style={{ fontSize: '12px' }}>: {this.props.userName}</p>
                                                                <p className="p-0 m-0" style={{ fontSize: '12px' }}> { }</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </Grid>

                                                <Grid item xs={12} className="mt-5">
                                                    <table style={{ width: '100%' }}>
                                                        <tr>
                                                            <td style={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>GRN No</td>
                                                            <td style={{ width: '30%', fontSize: '12px' }}>: {this.props.printData?.[0]?.GRN?.grn_no}</td>
                                                            <td style={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>WDN / LDCN No</td>
                                                            <td style={{ width: '30%', fontSize: '12px' }}>: {this.props.printData?.[0]?.GRN?.Consignment?.wdn_no}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>Date</td>
                                                            <td style={{ width: '30%', fontSize: '12px' }}>: {dateParse(this.props.printData?.[0]?.createdAt)}</td>
                                                            <td style={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>Stores No</td>
                                                            <td style={{ width: '30%', fontSize: '12px' }}>: {this.props.warehouse}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>PA / Indent No</td>
                                                            <td style={{ width: '30%', fontSize: '12px' }}>: {this.props.printData?.[0]?.GRN?.Consignment?.indent_no}</td>
                                                            <td style={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>Po No</td>
                                                            <td style={{ width: '30%', fontSize: '12px' }}>: {this.props.printData?.[0]?.GRN?.Consignment?.po}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>Invoice No</td>
                                                            <td style={{ width: '30%', fontSize: '12px' }}>: {this.props.printData?.[0]?.GRN?.Consignment?.invoice_no}</td>
                                                            <td style={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>Invoice Date</td>
                                                            <td style={{ width: '30%', fontSize: '12px' }}>:</td>
                                                        </tr>
                                                        {/* <tr>
                                                            <td style={{width:'20%', fontWeight:'bold', fontSize:'12px'}}>Supplier Name</td>
                                                            <td style={{width:'30%', fontSize:'12px'}}>: {console.log('testing_testing', this.props)}</td>
                                                            {/* <td style={{width:'20%', fontWeight:'bold', fontSize:'12px'}}>Invoice Date</td>
                                                            <td style={{width:'30%', fontSize:'12px'}}>:</td> */}
                                                        {/* </tr> */}
                                                    </table>
                                                </Grid>

                                                {
                                                    this.props.items.map((item, index) => {
                                                        let printDataLoop = this.props.printData
                                                            .filter((dataItem) => dataItem.ItemSnapBatch?.ItemSnap?.id == item);


                                                        const grnCount = printDataLoop.reduce((sum, element) => sum + Number(element.quantity), 0);

                                                        const itemLineCount = Math.ceil(printDataLoop.length / 4) + 4;

                                                        let newPage = false;
                                                        let lineLimit = pageNo === 0 ? firstPageLineLimit : otherPagesLineLimit;



                                                        if (filedLineCount + itemLineCount > lineLimit) {
                                                            filedLineCount = 0;
                                                            pageNo = pageNo + 1;
                                                            newPage = true;
                                                        }
                                                        console.log('itemLineCount', printDataLoop)

                                                        pageRemineHeight = pageRemineHeight - 25;
                                                        pageItemCount = pageItemCount + itemLineCount;

                                                        if (pageItemCount > lineLimit) {
                                                            filedLineCount = 0;
                                                            pageNo = pageNo + 1;
                                                            newPage = true;
                                                            pageItemCount = itemLineCount;
                                                        }

                                                        return (
                                                            <div className={newPage ? "w-full page-break-after" : "w-full"}>

                                                                <Grid item xs={12} className="mt-5">
                                                                    <table style={{ width: '100%' }}>
                                                                        <tr>
                                                                            <td style={{ width: '10%', fontWeight: 'bold', fontSize: '12px' }}>No</td>
                                                                            <td style={{ width: '30%', fontWeight: 'bold', fontSize: '12px' }}>Item Code</td>
                                                                            <td style={{ width: '50%', fontWeight: 'bold', fontSize: '12px' }}>Description</td>
                                                                            <td style={{ width: '10%', fontWeight: 'bold', fontSize: '12px' }}>UOM</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ width: '10%', fontSize: '12px' }}>{index + 1}</td>
                                                                            <td style={{ width: '30%', fontSize: '12px' }}>{printDataLoop[0].ItemSnapBatch?.ItemSnap?.sr_no}</td>
                                                                            <td style={{ width: '50%', fontSize: '12px' }}>{printDataLoop[0].ItemSnapBatch?.ItemSnap?.medium_description}</td>
                                                                            <td style={{ width: '10%', fontSize: '12px' }}>{ }</td>
                                                                        </tr>
                                                                    </table>
                                                                </Grid>
                                                                {/* {filedLineCount = filedLineCount + 2} */}
                                                                <Grid item xs={12}>
                                                                    <table style={{ width: '100%' }}>
                                                                        <tr>
                                                                            <td style={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>GRN qty</td>
                                                                            <td style={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>Damage</td>
                                                                            <td style={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>Shortage Qty</td>
                                                                            <td style={{ width: '40%', fontWeight: 'bold', fontSize: '12px' }}>Order List No</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ width: '20%', fontSize: '12px' }}>{convertTocommaSeparated(grnCount, 2)}</td>
                                                                            <td style={{ width: '20%', fontSize: '12px' }}>{printDataLoop[0].damage}</td>
                                                                            <td style={{ width: '20%', fontSize: '12px' }}>{printDataLoop[0].shortage}</td>
                                                                            <td style={{ width: '40%', fontSize: '12px' }}>{printDataLoop[0].GRN?.Consignment?.order_no}</td>
                                                                        </tr>
                                                                    </table>
                                                                </Grid>
                                                                {console.log('check data index', printDataLoop)}
                                                                {/* {filedLineCount = filedLineCount + 2} */}
                                                                <Grid item xs={12}>
                                                                    <table style={{ width: '100%' }} className="mt-2">
                                                                        <tr>
                                                                            <td style={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>Batch No</td>
                                                                            <td style={{ width: '30%', fontWeight: 'bold', fontSize: '12px' }}>Expiry Date</td>
                                                                            <td style={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>Qty</td>
                                                                            <td style={{ width: '30%', fontWeight: 'bold', fontSize: '12px' }}>Packing Details</td>
                                                                        </tr>
                                                                        {/* {filedLineCount = filedLineCount + 1} */}
                                                                        {printDataLoop.map((element, i) => {
                                                                            filedLineCount = filedLineCount + 1;
                                                                            return (
                                                                                <tr key={i}>
                                                                                    <td style={{ width: '20%', fontSize: '12px' }}>{element.ItemSnapBatch?.batch_no}</td>
                                                                                    <td style={{ width: '30%', fontSize: '12px' }}>{dateParse(element.ItemSnapBatch?.exd)}</td>
                                                                                    <td style={{ width: '20%', fontSize: '12px' }}>{convertTocommaSeparated(element.quantity, 2)}</td>
                                                                                    <td style={{ width: '30%', fontSize: '12px' }}>{element.packingdetails.split(',').map((data, index) => {
                                                                                        if (index != 0) {
                                                                                            filedLineCount = filedLineCount + 1;
                                                                                        }

                                                                                        return (<div key={index}>{data}</div>)
                                                                                    })}</td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </table>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <hr></hr>
                                                                </Grid>
                                                            </div>
                                                        );
                                                    })
                                                }

                                            </Grid>
                                        </div>
                                    </td></tr></tbody>
                                    <tfoot style={{ width: '100%', position: 'fixed', bottom: 0 }} ><tr><td>
                                        <div className="footer-space">
                                            <div className="footer">
                                                <Grid container>
                                                    <Grid item xs={12} >
                                                        <table style={{ width: '100%' }}>
                                                            <tr>
                                                                <td style={{ width: '20%', fontSize: '12px' }}>Prepared By</td>
                                                                <td style={{ width: '80%', fontSize: '12px' }}>:</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ width: '20%', fontSize: '12px' }}></td>
                                                                <td style={{ width: '80%', fontSize: '12px' }}>Remarks:....................................................</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ width: '20%', fontSize: '12px' }}></td>
                                                                <td style={{ width: '80%', fontSize: '12px' }}>....................................................................</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ width: '20%', fontSize: '12px' }}></td>
                                                                <td style={{ width: '80%', fontSize: '12px' }}>....................................................................</td>
                                                            </tr>
                                                        </table>
                                                    </Grid>

                                                    <Grid item xs={12} className="mt-5">
                                                        <table style={{ width: '100%', border: '1px solid black', borderCollapse: 'collapse' }}>
                                                            <tr>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse' }}></td>
                                                                <td style={{ width: '25%', fontWeight: 'bold', textAlign: 'center', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}>Stock Received / Prepared by</td>
                                                                <td style={{ width: '25%', fontWeight: 'bold', textAlign: 'center', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}>Checked by</td>
                                                                <td style={{ width: '25%', fontWeight: 'bold', textAlign: 'center', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}>Authorized by</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}>Name</td>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}></td>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}></td>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}>Designation</td>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}></td>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}></td>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}>Signature</td>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}></td>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}></td>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}>Date</td>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}></td>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}></td>
                                                                <td style={{ width: '25%', border: '1px solid black', borderCollapse: 'collapse', fontSize: '12px' }}></td>
                                                            </tr>
                                                        </table>

                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <p className="m-0 p-0">This document duly completed must be foewarded as indicated above within 3 days of receipt of goods</p>
                                                    </Grid>

                                                </Grid>
                                            </div>
                                        </div>
                                    </td></tr></tfoot>

                                    {/* </div> */}
                                </table>
                            </div>

                        </div>
                    </div>
                </Grid>
            </div>
        );
    }
}

export default GRNPrint;