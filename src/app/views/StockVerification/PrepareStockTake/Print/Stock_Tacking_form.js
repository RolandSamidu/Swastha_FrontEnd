/*
Loons Lab Stock Taking Form
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";

import { dateParse, timeParse } from "utils";

class StockTakingForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      voucherId: null,
      data: [],
      user: null,
      itemData: [],
      issueQtyData: []
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
    let item_data = this.props.printData104
    console.log('ckeking item qty', this.props.issue_qty)
    console.log('ckeking item itemdtata', this.props.itemData104)
    console.log('ckeking item batch data', this.props.printData104)
    this.setState({
      data: this.props.printData104,
      user: this.props.printed_user,
      itemData: this.props.itemData104,
      issueQtyData: this.props.issue_qty
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

          .fontSize : {
            font-size : 12px;
          }
  }
`;


    return (
      <div className="hidden">
        <Grid className="w-full justify-end items-end flex ">
          <ReactToPrint
            trigger={() => <Button id="print_presc_104" color="primary" size="small" style={{ margin: '0', padding: '0' }}>Print</Button>}
            pageStyle={pageStyle}
            content={() => this.componentRef}
          />
        </Grid>
        <Grid className="bg-light-gray p-5" >
          <div className="bg-white p-5" >
            <div>

              <div ref={(el) => (this.componentRef = el)} >

                <Grid container className="mt-5">
                  {/* <Grid item lg={12} > */}
                  <table style={{ width: '100%' }}>
                    <tr>
                      <td style={{ width: '20%' }}>
                        <p></p>
                      </td>
                      <td style={{ width: '60%' }}>
                        <table style={{ textAlign: 'center', width: '100%' }}>
                          <tr>
                            <td><h4>Department of Health Services</h4></td>
                          </tr>
                          <tr>
                            <td><h4>Institution Name</h4></td>
                          </tr>
                          <tr>
                            <td><h4>Stock Taking Form</h4></td>
                          </tr>
                        </table>
                      </td>
                      <td style={{ width: '20%' }}>
                        <table className="w-full">
                          <tr>
                            <td className='fontSize'>Date</td>
                            <td className='fontSize'>: {dateParse(new Date())}</td>
                          </tr>
                          <tr>
                            <td className='fontSize'>Time</td>
                            <td className='fontSize'>: {timeParse(new Date())}</td>
                          </tr>
                          <tr>
                            <td className='fontSize'>User</td>
                            <td className='fontSize'>: {this.state.user}</td>
                          </tr>
                          <tr>
                            <td className='fontSize'>Helth</td>
                            <td className='fontSize'>: 104</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  {/* </Grid> */}
                </Grid>

                {/* <Grid container className="mt-5">
                           
                                        <table style={{width:'100%'}}>
                                          <tr>
                                            <td className='fontSize' style={{width:'10%'}}>Stock Take No</td>
                                            <td className='fontSize' style={{width:'10%'}}>:</td>

                                            <td className='fontSize' style={{width:'10%'}}>Stock Take Date & Time</td>
                                            <td className='fontSize' style={{width:'10%'}}>:</td>

                                            <td className='fontSize' style={{width:'10%'}}>Warehouse Code</td>
                                            <td className='fontSize' style={{width:'10%'}}>:</td>

                                            <td className='fontSize' style={{width:'10%'}}>Institute Code</td>
                                            <td className='fontSize' style={{width:'10%'}}>:</td>

                                            <td className='fontSize' style={{width:'10%'}}>Item Group</td>
                                            <td className='fontSize' style={{width:'10%'}}>:</td>
                                          </tr>

                                          <tr>
                                            <td className='fontSize' style={{width:'10%'}}>Starting Item Code</td>
                                            <td className='fontSize' style={{width:'10%'}}>:</td>

                                            <td className='fontSize' style={{width:'10%'}}>Ending Item Code</td>
                                            <td className='fontSize' style={{width:'10%'}}>:</td>

                                            <td className='fontSize' style={{width:'10%'}}>Item Code</td>
                                            <td className='fontSize' style={{width:'10%'}}>:</td>

                                            <td className='fontSize' style={{width:'10%'}}>Warehouse Pharmacists</td>
                                            <td className='fontSize' style={{width:'10%'}}>:</td>

                                            <td className='fontSize' style={{width:'10%'}}>Verification Officers Involved</td>
                                            <td className='fontSize' style={{width:'10%'}}>:</td>
                                          </tr>
                                        </table>
              
                                    </Grid> */}

                {/* loop start */}
                {this.state.itemData.map((item, index) => (
                  <Fragment key={index}>
                    <Grid container className="mt-5">

                      <table className="w-full" style={{ border: '1px solid white', borderCollapse: 'collapse' }}>
                        <tr>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}></td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Item Code</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>UOM</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Serviceble Quantity</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Expired Quantity</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Qulity Faild Quantity</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Freeze Quantity</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Count Quantity</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Remark</td>
                        </tr>

                        <tr>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}><strong>{index + 1}</strong></td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{item?.ItemSnap?.sr_no}</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}></td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{item?.serviceable_quantity}</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{item?.expired_quantity}</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{item?.quality_failed_quantity}</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{item?.freez_quantity}</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{item?.count_quantity}</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{item?.remark}</td>
                        </tr>


                        <tr>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Batch No</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Expiry Date</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Serviceble Quantity</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Used Quantity</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Expired Quantity</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Qulity Faild Quantity</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Freeze Quantity</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Count Quantity</td>
                          <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px', fontWeight: 'bold' }}>Remark</td>
                        </tr>

                        {this.state.data
                          .filter((x) => x?.Stock_Verification_Item?.item_id === item?.item_id)
                          .map((e, i) => (
                            <tr key={i}>
                              <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{e?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no}</td>
                              <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{dateParse(e?.ItemSnapBatchBin?.ItemSnapBatch?.exd)}</td>
                              <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{e?.Stock_Verification_Item?.serviceable_quantity}</td>
                              <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{
                                Math.abs(this.state.issueQtyData.filter((el) => el?.item_id === item?.item_id).map((el) => el.data.filter((k) => k?.item_batch_id === e?.ItemSnapBatchBin?.item_batch_id).map((j) => j?.quantity)))
                              }</td>
                              <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{e?.Stock_Verification_Item?.expired_quantity}</td>
                              <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{e?.Stock_Verification_Item?.quality_failed_quantity}</td>
                              <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{e?.Stock_Verification_Item?.freez_quantity}</td>
                              <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{e?.Stock_Verification_Item?.count_quantity}</td>
                              <td style={{ width: '11.11%', fontSize: '12px', textAlign: 'center', height: '20px' }}>{e?.Stock_Verification_Item?.remark}</td>
                            </tr>
                          ))}
                      </table>


                    </Grid>

                    {/* <Grid container>
                                        <p className="mb-3"><strong>Packing Details</strong></p>
    

                                        <table  style={{width: '100%'}}>
                                          <tr>
                                            <td style={{width: '40%'}}>
                                              <table style={{width:'100%'}}>
                                                <tr>
                                                  <td style={{width:'50%', fontSize:'12px'}}>UOM</td>
                                                  <td style={{width:'50%', fontSize:'12px'}}>Height (cm)</td>
                                                </tr>

                                                <tr>
                                                  <td style={{width:'50%', fontSize:'12px'}}>Width (cm)</td>
                                                  <td style={{width:'50%', fontSize:'12px'}}>Length (cm)</td>
                                                </tr>

                                                <tr>
                                                  <td style={{width:'50%', fontSize:'12px'}}>Net.Weight</td>
                                                  <td style={{width:'50%', fontSize:'12px'}}>Gross.Weight</td>
                                                </tr>
                                              </table>
                                            </td>
                                            <td style={{width: '60%'}}>
                                              <table className="w-full">
                                                <tr>
                                                  <td style={{width:'16.66%', fontSize:'12px', backgroundColor:'#E8E8E8'}}>Pack Size</td>
                                                  <td style={{width:'16.66%', fontSize:'12px', backgroundColor:'#E8E8E8'}}>UOM</td>
                                                  <td style={{width:'16.66%', fontSize:'12px', backgroundColor:'#E8E8E8'}}>Quantity</td>
                                                  <td style={{width:'16.66%', fontSize:'12px', backgroundColor:'#E8E8E8'}}>Conversion</td>
                                                  <td style={{width:'16.66%', fontSize:'12px', backgroundColor:'#E8E8E8'}}>Min Pack Size</td>
                                                  <td style={{width:'16.66%', fontSize:'12px', backgroundColor:'#E8E8E8'}}>Remark</td>
                                                </tr>
                                                <tr>
                                                  <td style={{width:'16.66%', fontSize:'12px'}}>Level 1</td>
                                                  <td style={{width:'16.66%', fontSize:'12px'}}></td>
                                                  <td style={{width:'16.66%', fontSize:'12px'}}></td>
                                                  <td style={{width:'16.66%', fontSize:'12px'}}></td>
                                                  <td style={{width:'16.66%', fontSize:'12px'}}></td>
                                                  <td style={{width:'16.66%', fontSize:'12px'}}></td>
                                                </tr>
                                                <tr>
                                                  <td style={{width:'16.66%', fontSize:'12px'}}>Level 2</td>
                                                  <td style={{width:'16.66%', fontSize:'12px'}}></td>
                                                  <td style={{width:'16.66%', fontSize:'12px'}}></td>
                                                  <td style={{width:'16.66%', fontSize:'12px'}}></td>
                                                  <td style={{width:'16.66%', fontSize:'12px'}}></td>
                                                  <td style={{width:'16.66%', fontSize:'12px'}}></td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                      </Grid> */}

                    <Grid container>
                      <Grid item sm={12}>
                        <hr></hr>
                      </Grid>
                    </Grid>

                  </Fragment>
                ))}
                {/* loop end */}
              </div>

            </div>
          </div>
        </Grid>
      </div>
    );
  }
}

export default StockTakingForm
  ;