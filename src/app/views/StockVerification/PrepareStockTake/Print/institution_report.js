/*
Loons Lab Hospitaldirecter
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Divider, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import { dateParse, dateTimeParse, timeParse } from "utils";

class Hospitaldirecter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            user: null,
            itemData: []
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
        let data = this.props.printData167
        let user = this.props.printed_user
        let item_data = this.props.itemdata167

        this.setState({
            data: data,
            user: user,
            itemData: item_data
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
  }
`;


        return (
            <div className="hidden">
                <Grid className="w-full justify-end items-end flex ">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_167" color="primary" size="small" style={{ margin: '0', padding: '0' }}>Print</Button>}
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
                                                <h4>Institution Name</h4>
                                            </td>
                                            <td style={{ width: '20%' }}>
                                                <table style={{ width: '100%' }}>
                                                    <tr>
                                                        <td className='fontSize' style={{ width: '35%' }}>Date</td>
                                                        <td className='fontSize' style={{ width: '65%' }}>: {dateParse(new Date())}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='fontSize' style={{ width: '35%' }}>Time</td>
                                                        <td className='fontSize' style={{ width: '65%' }}>: {timeParse(new Date())}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='fontSize' style={{ width: '35%' }}>User</td>
                                                        <td className='fontSize' style={{ width: '65%' }}>: {this.state.user}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='fontSize' style={{ width: '35%' }}>Health</td>
                                                        <td className='fontSize' style={{ width: '65%' }}>: 167</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </Grid>

                                {this.state.itemData.map((item, index) => (

                                    <Fragment key={index}>

                                        <Grid container className="mt-5">
                                            <Grid item lg={12}>
                                                <Divider></Divider>
                                            </Grid>
                                        </Grid>

                                        {/* loop start */}
                                        <Grid container className="mt-5">
                                            <table style={{ width: '100%' }}>
                                                <tr>
                                                    <td className='fontSize' style={{ width: '33.33%', fontWeight: 'bold' }}>Item</td>
                                                    <td className='fontSize' style={{ width: '33.33%', fontWeight: 'bold' }}>Discription</td>
                                                    <td className='fontSize' style={{ width: '33.33%', fontWeight: 'bold' }}>UOM</td>
                                                </tr>
                                                <tr>
                                                    <td className='fontSize' style={{ width: '33.33%' }}>{item?.ItemSnap?.sr_no}</td>
                                                    <td className='fontSize' style={{ width: '33.33%' }}>{item?.ItemSnap?.medium_description}</td>
                                                    <td className='fontSize' style={{ width: '33.33%' }}>{ }</td>
                                                </tr>
                                            </table>
                                        </Grid>
                                        <Grid container className="mt-5">
                                            <table style={{ width: '100%' }}>
                                                <tr>
                                                    <td className='fontSize' style={{ width: '16.66%' }}>Book Quantity</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}> : {item?.freez_quantity}</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}>Total Verified Quantity</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}> : {item?.count_quantity}</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}>Difference Quantity</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}> : {Number(item?.freez_quantity) - Number(item?.count_quantity)}</td>
                                                </tr>
                                                <tr>
                                                    <td className='fontSize' style={{ width: '16.66%' }}>Serviceable Quantity</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}> : {item?.serviceable_quantity}</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}>Serviceable Quantity</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}> :</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}></td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}></td>
                                                </tr>
                                                <tr>
                                                    <td className='fontSize' style={{ width: '16.66%' }}>Serviceable Value</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}> :</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}>Serviceable Value</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}> :</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}></td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}></td>
                                                </tr>
                                                <tr>
                                                    <td className='fontSize' style={{ width: '16.66%' }}>Unserviceable Quantity</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}> : {Number(item?.expired_quantity) + Number(item?.quality_failed_quantity)}</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}>Unserviceable Quantity</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}> :</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}></td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}></td>
                                                </tr>
                                                <tr>
                                                    <td className='fontSize' style={{ width: '16.66%' }}>Unserviceable Value</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}> :</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}>Unserviceable Value</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}> :</td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}></td>
                                                    <td className='fontSize' style={{ width: '16.66%' }}></td>
                                                </tr>
                                            </table>
                                        </Grid>


                                        <Grid container className="mt-5">
                                            <table className="fontSize" style={{ width: '100%' }}>
                                                <tr>
                                                    <td className="fontSize" style={{ width: '25%', fontWeight: 'bold' }}>Batch No</td>
                                                    <td className="fontSize" style={{ width: '25%', fontWeight: 'bold' }}>Unit Price</td>
                                                    <td className="fontSize" style={{ width: '25%', fontWeight: 'bold' }}>Freez Quantity</td>
                                                    <td className="fontSize" style={{ width: '25%', fontWeight: 'bold' }}>Count Quantity</td>
                                                </tr>
                                                {this.state.data
                                                    .filter((x) => x?.Stock_Verification_Item?.item_id === item?.item_id)
                                                    .map((e, i) => (
                                                        <tr key={i}>
                                                            <td className="fontSize" style={{ width: '25%' }}>{e?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no}</td>
                                                            <td className="fontSize" style={{ width: '25%' }}>{e?.ItemSnapBatchBin?.ItemSnapBatch?.unit_price}</td>
                                                            <td className="fontSize" style={{ width: '25%' }}>{e?.Stock_Verification_Item?.freez_quantity}</td>
                                                            <td className="fontSize" style={{ width: '25%' }}>{e?.Stock_Verification_Item?.count_quantity}</td>
                                                        </tr>
                                                    ))}
                                            </table>
                                        </Grid>
                                        <Grid container>
                                            <Grid item sm={12}>
                                                <hr></hr>
                                            </Grid>
                                        </Grid>

                                    </Fragment>
                                ))}

                                <Grid container className="mt-5">
                                    <p>Approved By :</p>
                                </Grid>
                                {/* loop end */}
                            </div>

                        </div>
                    </div>
                </Grid>
            </div>
        );
    }
}

export default Hospitaldirecter
    ;