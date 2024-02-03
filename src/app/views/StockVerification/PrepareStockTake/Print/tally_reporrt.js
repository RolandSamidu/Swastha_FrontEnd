/*
Loons Lab Hospitaldirecter
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import { dateParse } from "utils";

class TallyReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null,
            data: []
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
        let user = this.props.printed_user
        let data = this.props.printDataTally

        this.setState({
            user: user,
            data: data
        })
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
            height: 2000px,
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

          .fontSize {
            font-size : 12px,
          }

          .bold_font {
            font-weight : bold,
          }
  }
`;


        return (
            <div className="hidden">
                <Grid className="w-full justify-end items-end flex ">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_tally" color="primary" size="small" style={{ margin: '0', padding: '0' }}>Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                <Grid className="bg-light-gray p-5" >
                    <div className="bg-white p-5" >
                        <div>

                            <div ref={(el) => (this.componentRef = el)} >
                                <Grid className="w-full" container>
                                    <table style={{ width: '100%' }}>
                                        <tr>
                                            <td style={{ width: '20%' }}></td>
                                            <td style={{ width: '60%', textAlign: 'center' }}>
                                                <h4>Tally Report</h4>
                                            </td>
                                            <td style={{ width: '20%' }}>
                                                <table style={{ width: '100%' }}>
                                                    <tr>
                                                        <td className='fontSize' style={{ width: '30%' }}>Report No</td>
                                                        <td className='fontSize' style={{ width: '70%' }}>:</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='fontSize' style={{ width: '30%' }}>Date</td>
                                                        <td className='fontSize' style={{ width: '70%' }}>: {dateParse(new Date())}</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </Grid>

                                {/* <Grid container className="mt-5">
                                        <table style={{width:'100%'}}>
                                            <tr>
                                                <td className='fontSize' style={{width:'16.66%'}}>Stock Tack No :</td>
                                                <td className='fontSize' style={{width:'16.66%'}}></td>
                                                <td className='fontSize' style={{width:'16.66%'}}>Warehouse Code :</td>
                                                <td className='fontSize' style={{width:'16.66%'}}></td>
                                                <td className='fontSize' style={{width:'16.66%'}}>Institute :</td>
                                                <td className='fontSize' style={{width:'16.66%'}}></td>
                                            </tr>
                                            <tr>
                                                <td className='fontSize' style={{width:'16.66%'}}>Stock Tack Date :</td>
                                                <td className='fontSize' style={{width:'16.66%'}}></td>
                                                <td className='fontSize' style={{width:'16.66%'}}>Warehouse Pharmacists :</td>
                                                <td className='fontSize' style={{width:'16.66%'}}></td>
                                                <td className='fontSize' style={{width:'16.66%'}}>Verification Officers Involved :</td>
                                                <td className='fontSize' style={{width:'16.66%'}}></td>
                                            </tr>
                                        </table>
                                    </Grid> */}



                                <Grid container className="mt-5">
                                    <table style={{ width: '100%' }}>
                                        <tr>
                                            <td className='fontSize' style={{ width: '11.11%', fontWeight: 'bold' }}>Item Code</td>
                                            <td className='fontSize' style={{ width: '11.11%', fontWeight: 'bold' }}>Item Name</td>
                                            <td className='fontSize' style={{ width: '11.11%', fontWeight: 'bold' }}>Batch</td>
                                            <td className='fontSize' style={{ width: '11.11%', fontWeight: 'bold' }}>Expiry Date</td>
                                            <td className='fontSize' style={{ width: '11.11%', fontWeight: 'bold' }}>Freeze Quantity</td>
                                            <td className='fontSize' style={{ width: '11.11%', fontWeight: 'bold' }}>Expired Quantity</td>
                                            <td className='fontSize' style={{ width: '11.11%', fontWeight: 'bold' }}>Quality Faild Quantity</td>
                                            <td className='fontSize' style={{ width: '11.11%', fontWeight: 'bold' }}>Count Quantity</td>
                                            <td className='fontSize' style={{ width: '11.11%', fontWeight: 'bold' }}>Difference</td>
                                        </tr>
                                        {this.state.data.map((item, index) => (
                                            <tr key={index}>
                                                <td className='fontSize' style={{ width: '11.11%' }}>{item?.Stock_Verification_Item?.ItemSnap?.sr_no}</td>
                                                <td className='fontSize' style={{ width: '11.11%' }}>{item?.Stock_Verification_Item?.ItemSnap?.medium_description}</td>
                                                <td className='fontSize' style={{ width: '11.11%' }}>{item?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no}</td>
                                                <td className='fontSize' style={{ width: '11.11%' }}>{item?.ItemSnapBatchBin?.ItemSnapBatch?.exd}</td>
                                                <td className='fontSize' style={{ width: '11.11%' }}>{item?.Stock_Verification_Item?.freez_quantity}</td>
                                                <td className='fontSize' style={{ width: '11.11%' }}>{item?.Stock_Verification_Item?.expired_quantity}</td>
                                                <td className='fontSize' style={{ width: '11.11%' }}>{item?.Stock_Verification_Item?.quality_failed_quantity}</td>
                                                <td className='fontSize' style={{ width: '11.11%' }}>{item?.Stock_Verification_Item?.count_quantity}</td>
                                                <td className='fontSize' style={{ width: '11.11%' }}>{Number(item?.Stock_Verification_Item?.freez_quantity) - Number(item?.Stock_Verification_Item?.count_quantity)}</td>
                                            </tr>
                                        ))}
                                    </table>
                                </Grid>

                            </div>

                        </div>
                    </div>
                </Grid>
            </div>
        );
    }
}

export default TallyReport
    ;