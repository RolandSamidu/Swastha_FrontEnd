/*
Loons Lab StockPositionDetailsReport
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Divider, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import { convertTocommaSeparated, dateParse, roundDecimal, timeParse } from "utils";


class StockPositionDetailsReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            today: new Date()
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


    componentDidMount() {
        console.log('props', this.props)
    }

    render() {
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




        return (
            <div className="hidden">
                <Grid className="w-full justify-end items-end flex">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_0041" size="small" startIcon="print">Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                <Grid className="bg-light-gray p-5" >
                    <div className="bg-white p-5" >
                        <div>

                            <div ref={(el) => (this.componentRef = el)} >

                            <table id="table-reset">
                                    <thead><tr><td>
                                    <div class="header-space">
                                        <div id="content">
                                           {/*  <div id="pageFooter">Page </div> */}
                                        </div>
                                    </div>
                                    </td></tr></thead>
                                    <tbody><tr><td>
                                        <div class="content">

                                

                                <Grid className="w-full" container>
                                    
                                    <Grid item xs={12}>
                                        <table style={{ width: '100%' }}>
                                            <tr>
                                                <td style={{ width: '60%' }}>
                                                    <p className="p-0 m-0" style={{ fontWeight: 'bold', fontSize:'10px' }}>Medical Supplies Division</p>
                                                    <p className="p-0 m-0" style={{ fontWeight: 'bold', fontSize:'10px' }}>Warehouse Wise Stock Position Detail Report</p>
                                                </td>
                                                <td style={{ width: '15%' }}>
                                                    <p style={{ fontSize:'10px' }} className="p-0 m-0">Date</p>
                                                    <p style={{ fontSize:'10px' }} className="p-0 m-0">Time</p>
                                                    <p style={{ fontSize:'10px' }} className="p-0 m-0">User</p>
                                                    <p style={{ fontSize:'10px' }} className="p-0 m-0">Page No</p>
                                                </td>
                                                <td style={{ width: '25%' }}>
                                                    <p style={{ fontSize:'10px' }} className="p-0 m-0">: {dateParse(this.state.today)}</p>
                                                    <p style={{ fontSize:'10px' }} className="p-0 m-0">: {timeParse(this.state.today)}</p>
                                                    <p style={{ fontSize:'10px' }} className="p-0 m-0">: {this.props.loginUser}</p>
                                                    <p style={{ fontSize:'10px' }} className="p-0 m-0">:

                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </Grid>

                                    <Grid item xs={12} className="mt-7">
                                        <table style={{ width: '100%' }}>
                                            <tr>
                                                <td style={{ width: '15%', fontWeight: 'bold', fontSize:'10px' }}>Item Code</td>
                                                <td style={{ width: '55%', fontWeight: 'bold', fontSize:'10px' }}>Item Description</td>
                                                <td style={{ width: '40%', fontWeight: 'bold', fontSize:'10px' }}>UOM</td>
                                                {/* <td style={{width:'5%',fontWeight:'bold'}}>NMR</td> */}
                                                {/* <td style={{width:'30%',fontWeight:'bold'}}>On Hand</td> */}
                                            </tr>
                                        </table>
                                        <table style={{ width: '100%', fontWeight: 'bold' }}>
                                            <tr>
                                                <td style={{ width: '30%', fontWeight: 'bold', fontSize:'10px' }}>Batch</td>
                                                <td style={{ width: '10%', fontWeight: 'bold', fontSize:'10px' }}>Status</td>
                                                <td style={{ width: '15%', fontWeight: 'bold', fontSize:'10px' }}>Exp. Date</td>
                                                <td style={{ width: '15%', fontWeight: 'bold', fontSize:'10px' }}>Qty</td>
                                                {/* <td style={{width:'10%',fontWeight:'bold'}}>Duration MM</td>
                                                    <td style={{width:'10%',fontWeight:'bold'}}>In DD</td> */}
                                                <td style={{ width: '5%', fontWeight: 'bold', fontSize:'10px' }}>Min. Pack Size</td>
                                                <td style={{ width: '15%', fontWeight: 'bold', fontSize:'10px' }}>Packing Details</td>
                                            </tr>
                                        </table>
                                        <hr></hr>
                                        {/* loop */}
                                        {this.props.printReportData.map((item, index) => {
                                            // Check if it's the last occurrence of sr_no
                                            const isLastOccurrence = (index === this.props.printReportData.length - 1) ||
                                                (item?.ItemSnapBatch?.ItemSnap?.sr_no !== this.props.printReportData[index + 1]?.ItemSnapBatch?.ItemSnap?.sr_no);

                                            let total = 0;
                                            let balance = 0;
                                            let remaining = 0;

                                            const quantity = Number(item?.quantity);

                                            if (index === 0 || item?.ItemSnapBatch?.ItemSnap?.sr_no !== this.props.printReportData[index - 1]?.ItemSnapBatch?.ItemSnap?.sr_no) {
                                                total = quantity;
                                            } else {
                                                total = this.props.printReportData[index - 1].total + quantity;
                                            }

                                            item.total = total;

                                            item.balance = Number(item?.quantity) / Number(item?.ItemSnapBatch?.pack_size)
                                                ? Number(item?.quantity) / Number(item?.ItemSnapBatch?.pack_size)
                                                : 0;
                                            item.remaining = Number(item?.quantity) % Number(item?.ItemSnapBatch?.pack_size)
                                                ? Number(item?.quantity) % Number(item?.ItemSnapBatch?.pack_size)
                                                : 0;

                                            console.log("Item balance:", balance);
                                            console.log("remaining:", remaining);
                                            // console.log("Is Last Occurrence:", isLastOccurrence);

                                            return (
                                                <Fragment key={index}>
                                                    {index === 0 || item?.ItemSnapBatch?.ItemSnap?.sr_no !== this.props.printReportData[index - 1]?.ItemSnapBatch?.ItemSnap?.sr_no ? (
                                                        <Fragment>
                                                            <table style={{ width: '100%' }}>
                                                                <tr>
                                                                    <td style={{ width: '15%', textDecoration: 'underline', fontSize:'10px' }}>{item?.ItemSnapBatch?.ItemSnap?.sr_no}</td>
                                                                    <td style={{ width: '55%', fontSize:'10px' }}>{item?.ItemSnapBatch?.ItemSnap?.medium_description}</td>
                                                                    <td style={{ width: '5%', fontSize:'10px' }}>{item?.ItemSnapBatch?.UOM?.name}</td>  {/*  error    item?.ItemSnapBatch?.UOM */}
                                                                    <td style={{ width: '5%', fontSize:'10px' }}>{ }</td>
                                                                    <td style={{ width: '30%', fontSize:'10px' }}>{ }</td>
                                                                </tr>
                                                            </table>
                                                            <table style={{ width: '100%' }}>
                                                                <tr>
                                                                    <td style={{ width: '30%', fontSize:'10px' }}>{item?.ItemSnapBatch?.batch_no}</td>
                                                                    <td style={{ width: '10%', fontSize:'10px' }}>{dateParse(this.state.today) > dateParse(item?.ItemSnapBatch?.exd) ? 'Exp' : item?.ItemSnapBatch?.status}</td>
                                                                    <td style={{ width: '15%', fontSize:'10px' }}>{dateParse(item?.ItemSnapBatch?.exd)}</td>
                                                                    <td style={{ width: '15%', fontSize:'10px' }}>{convertTocommaSeparated(item?.quantity)}</td>
                                                                    <td style={{ width: '5%', fontSize:'10px' }}>{item?.ItemSnapBatch?.pack_size}</td>
                                                                    <td style={{ width: '15%', fontSize:'10px', textAlign: 'right' }}><>{roundDecimal(item?.ItemSnapBatch?.pack_size, 0) !== 1 ? <p className="m-0 p-0">{item.balance + ' X ' + roundDecimal(item?.ItemSnapBatch?.pack_size, 0) + ' X 1'}</p> : <p className="m-0 p-0">{item.balance + ' X 1'}</p>}{item.remaining !== 0 && (<p className="m-0 p-0">{item.remaining + ' X 1'}</p>)}</></td>
                                                                </tr>
                                                            </table>
                                                        </Fragment>
                                                    ) : (
                                                        <table style={{ width: '100%' }}>
                                                            <tr>
                                                                <td style={{ width: '30%', fontSize:'10px' }}>{item?.ItemSnapBatch?.batch_no}</td>
                                                                <td style={{ width: '10%', fontSize:'10px' }}>{dateParse(this.state.today) > dateParse(item?.ItemSnapBatch?.exd) ? 'Exp' : item?.ItemSnapBatch?.status}</td>
                                                                <td style={{ width: '15%', fontSize:'10px' }}>{dateParse(item?.ItemSnapBatch?.exd)}</td>
                                                                <td style={{ width: '15%', fontSize:'10px' }}>{convertTocommaSeparated(item?.quantity)}</td>
                                                                <td style={{ width: '5%', fontSize:'10px' }}>{item?.ItemSnapBatch?.pack_size}</td>
                                                                <td style={{ width: '15%', fontSize:'10px', textAlign: 'right' }}><>{roundDecimal(item?.ItemSnapBatch?.pack_size, 0) !== 1 ? <p className="m-0 p-0">{item.balance + ' X ' + roundDecimal(item?.ItemSnapBatch?.pack_size, 0) + ' X 1'}</p> : <p className="m-0 p-0">{item.balance + ' X 1'}</p>}{item.remaining !== 0 && (<p className="m-0 p-0">{item.remaining + ' X 1'}</p>)}</></td>
                                                            </tr>
                                                        </table>
                                                    )}
                                                    {isLastOccurrence && (
                                                        <Fragment>
                                                            <table style={{ width: '100%' }}>
                                                                <tr>
                                                                    <td style={{ width: '30%' }}>{ }</td>
                                                                    <td style={{ width: '10%' }}>{ }</td>
                                                                    <td style={{ width: '15%', fontWeight: 'bold', fontSize:'10px' }}>{'Total : '}</td>
                                                                    <td style={{ width: '20%', fontSize:'10px', textAlign: 'right', fontWeight: 'bold' }}>{convertTocommaSeparated(item.total)}</td>
                                                                    <td style={{ width: '15%' }}>{ }</td>
                                                                    <td style={{ width: '10%' }}></td>

                                                                </tr>
                                                            </table>
                                                            <p style={{ borderBottom: '1px dotted black', width: '100%' }}></p>
                                                        </Fragment>
                                                    )}
                                                </Fragment>
                                            );
                                        })}
                                        {/* loop */}
                                    </Grid>

                                </Grid>
                                </div>
                                    </td></tr></tbody>
                                    <tfoot><tr><td>
                                        <div class="footer-space"> </div>
                                    </td></tr></tfoot>
                                </table>
                            </div>

                        </div>
                    </div>
                </Grid>
            </div>
        );
    }
}

export default StockPositionDetailsReport
    ;