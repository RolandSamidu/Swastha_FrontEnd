/*
Loons Lab returnOrderPrint
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { Button} from 'app/components/LoonsLabComponents'
import { dateParse, dateTimeParse } from "utils";


class ReturnOrderPrint extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataForPrint:null,
            today: dateTimeParse(new Date()),
            loginUser: null

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
        console.log('printData', this.props.dataForPrint)
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
            <div>
                <Grid className="w-full justify-end items-end flex hidden">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_015" color="primary" size="small">Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray p-5" >
                        <div className="bg-white p-5" >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                    <Grid className="w-full" container>   
                                
                                        <Grid item sm={12}>
                                            <table style={{width:'100%'}}>
                                                <tr>
                                                    <td style={{width:'50%'}}></td>
                                                    <td style={{width:'20%'}}>
                                                        <p className="p-0 m-0">Time & Date</p>
                                                        <p className="p-0 m-0">User</p>
                                                        <p className="p-0 m-0">Book No.</p>
                                                        <p className="p-0 m-0">Page No.</p>
                                                    </td>
                                                    <td style={{width:'30%'}}>
                                                        <p className="p-0 m-0">: {this.state.today}</p>
                                                        <p className="p-0 m-0">: {this.props.loginUser}</p>
                                                        <p className="p-0 m-0">: {this.props.dataForPrint?.book_no}</p>
                                                        <p className="p-0 m-0">: {this.props.dataForPrint?.page_no}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </Grid>

                                        <Grid item sm={12} className="mt-5">
                                            <p style={{textAlign:'center', fontWeight:'bold', textDecoration:'underline'}}>Order Return</p>
                                        </Grid>

                                        <Grid item sm={12} className="mt-5">
                                            <tabel style={{width:'100%'}}>
                                                <tr>
                                                    <td style={{width:'30%'}}>Order Id</td>
                                                    <td style={{width:'70%'}}>: {this.props.dataForPrint?.order_id}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:'30%'}}>To Owner ID</td>
                                                    <td style={{width:'70%'}}>: {this.props.dataForPrint?.to_owner_id}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:'30%'}}>Returned Date</td>
                                                    <td style={{width:'70%'}}>: {dateParse(this.props.dataForPrint?.returned_date)}</td>
                                                </tr>
                                                {/* <tr>
                                                    <td style={{width:'30%'}}></td>
                                                    <td style={{width:'70%'}}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{width:'30%'}}></td>
                                                    <td style={{width:'70%'}}></td>
                                                </tr> */}
                                            </tabel>
                                        </Grid>

                                        <Grid item sm={12} className="mt-5">
                                            <table style={{width:'100%'}}>
                                                    <tr>
                                                    <td style={{ width: 'auto', fontWeight:'bold' }}>SR No.</td>
                                                    <td style={{ width: 'auto', fontWeight:'bold' }}>Batch No</td>
                                                    <td style={{ width: 'auto', fontWeight:'bold' }}>Name</td>
                                                    <td style={{ width: 'auto', fontWeight:'bold' }}>Return Quantity</td>
                                                    </tr>
                                                {this.props.dataForPrint?.ReturningOrderItems.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <tr>
                                                    <td style={{ width: 'auto' }}>{item?.OrderItem?.ItemSnap?.sr_no}</td>
                                                    <td style={{ width: 'auto' }}>{item?.ItemSnapBatch?.batch_no}</td>
                                                    <td style={{ width: 'auto' }}>{item?.OrderItem?.ItemSnap?.medium_description}</td>
                                                    <td style={{ width: 'auto' }}>{item?.return_quantity}</td>
                                                    </tr>
                                                </React.Fragment>
                                                ))}

                                            </table>

                                        </Grid>
                                                                    
                                    </Grid> 
                                </div>

                            </div>
                        </div>
                    </Grid>
            </div>
        );
    }
}

export default ReturnOrderPrint
;