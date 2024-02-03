/*
Loons Lab RequisitionDocument
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { convertTocommaSeparated, dateParse, dateTimeParse } from 'utils'

class RequisitionDocument extends Component {
    constructor(props) {
        super(props)
        this.state = {
            printData:[],
            order:[],
            today: dateTimeParse(new Date()),
            pickUpPerson:[],
            vehicle_data: []

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
        console.log('loaded')
        console.log('this.props.vehicle_data',this.props.vehicle_data)
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
                        trigger={() => <Button id="print_button_006" color="primary" size="small">Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray p-5" >
                        <div className="bg-white p-5" >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                    <Grid className="w-full" >   

                                        <Grid container className="w-full">
                                    
                                            <Grid item sm={12}>
                                                <table style={{width:'100%'}}>
                                                    <tr>
                                                        <td style={{width:'50%'}}></td>
                                                        <td style={{width:'20%'}}>
                                                            <p className="p-0 m-0">Date & Time</p>
                                                            <p className="p-0 m-0">User</p>
                                                            <p className="p-0 m-0">Page No.</p>
                                                        </td>
                                                        <td style={{width:'30%'}}>
                                                            <p className="p-0 m-0">: {this.state.today}</p>
                                                            <p className="p-0 m-0">: {this.props.loginUser}</p>
                                                            <p className="p-0 m-0">: {this.props.order?.page_no}</p>
                                                        </td>
                                                    </tr>
                                                </table>

                                            </Grid>

                                            <Grid item sm={12}>
                                                <p style={{textAlign:"center", textDecoration:"underline", fontWeight:"bold"}}>Requisition Document</p>
                                            </Grid>
                                    
                                        </Grid>

                                    
                                        <Grid className="w-full" item sm={12} container direction="row" spacing={2}>

                                            <Grid  item sm={6}>
                                            <p style={{ textDecoration:"underline", fontWeight:"bold"}}>Request Details</p>
                                                <table style={{width:'100%'}}>
                                                    <tr>
                                                        <td style={{width:'30%'}}>Request Number</td>
                                                        <td style={{width:'70%'}}>: {this.props.order?.order_id}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:'30%'}}>From Werehouse</td>
                                                        <td style={{width:'70%'}}>: {this.props.order?.fromStore?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:'30%'}}>To Werehouse</td>
                                                        <td style={{width:'70%'}}>: {this.props.order?.toStore?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:'30%'}}>Collection Date</td>
                                                        <td style={{width:'70%'}}>: {dateParse(this.props.order?.required_date)}</td>
                                                    </tr>
                                                </table>
                                            </Grid>

                                            <Grid  item sm={6}>

                                                <p style={{ textDecoration:"underline", fontWeight:"bold"}}>Pick Up Person Details</p>

                                                <table style={{width:'100%'}}>
                                                    <tr>
                                                        <td style={{width:'30%'}}>Name</td>
                                                        <td style={{width:'70%'}}>: {this.props.pickUpPerson?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:'30%'}}>ID</td>
                                                        <td style={{width:'70%'}}>: {this.props.pickUpPerson?.id}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:'30%'}}>Contact No</td>
                                                        <td style={{width:'70%'}}>: {this.props.pickUpPerson?.contactNum}</td>
                                                    </tr>
                                                </table>
                                            </Grid>

                                        </Grid>

                                       

                                        <Grid container className="w-full mt-5">

                                            <Grid item sm={12} className="mt-0" >
                                                <table style={{width:'100%'}}>
                                                    <tr>
                                                        <td style={{width:'auto', textDecoration:'underline', fontWeight:'bold'}}>SR No</td>
                                                        <td style={{width:'auto', textDecoration:'underline', fontWeight:'bold'}}>Description</td>
                                                        <td style={{width:'auto', textDecoration:'underline', fontWeight:'bold'}}>UOM</td>
                                                        <td style={{width:'auto', textDecoration:'underline', fontWeight:'bold'}}>Req Qty</td>
                                                        {/* <td style={{width:'auto', textDecoration:'underline', fontWeight:'bold'}}>Months</td>
                                                        <td style={{width:'auto', textDecoration:'underline', fontWeight:'bold'}}>Days</td> */}
                                                    </tr>
                                                    {this.props.printData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td style={{width:'auto'}}>{item?.ItemSnap?.sr_no}</td>
                                                        <td style={{width:'auto'}}>{item?.ItemSnap?.medium_description}</td>
                                                        <td style={{width:'auto'}}></td>
                                                        {/* {console.log('cheking item datatta', item)} */}
                                                        <td style={{width:'auto'}}>{(item?.ItemSnap?.converted_order_uom === "EU") ? convertTocommaSeparated(item?.request_quantity * item?.ItemSnap?.item_unit_size, 2) + ' ' + item?.ItemSnap?.DisplayUnit?.name + ' (' + item?.request_quantity + ' ' + item?.ItemSnap?.MeasuringUnit?.name + " )" : convertTocommaSeparated(item?.request_quantity,2)}</td>
                                                        {/* <td style={{width:'auto'}}></td>
                                                        <td style={{width:'auto'}}></td> */}
                                                    </tr>
                                                    ))} 
                                                </table>

                                            </Grid>

                                            <Grid item sm={12} className="mt-5 mb-5">
                                                <p style={{textAlign:"center", textDecoration:"underline", fontWeight:"bold"}}>Assigned Vehicles Details</p>
                                            </Grid>

                                            <Grid item sm={12} className="mt-5">
                                                <table style={{width:'100%'}}>
                                                    <tr>
                                                        {/* <td style={{width:'auto', textDecoration:'underline', fontWeight:'bold'}}>Hospital ID</td> */}
                                                        <td style={{width:'auto', textDecoration:'underline', fontWeight:'bold'}}>Vehicle Reg No</td>
                                                        <td style={{width:'auto', textDecoration:'underline', fontWeight:'bold'}}>Max Volume</td>
                                                        {/* <td style={{width:'auto', textDecoration:'underline', fontWeight:'bold'}}>Status</td> */}
                                                        {/* <td style={{width:'auto', textDecoration:'underline', fontWeight:'bold'}}>Months</td>
                                                        <td style={{width:'auto', textDecoration:'underline', fontWeight:'bold'}}>Days</td> */}
                                                    </tr>
                                                    {this.props.vehicle_data.map((item, index) => (
                                                    <tr key={index}>
                                                        {/* <td style={{width:'auto'}}>{item?.owner_id}</td> */}
                                                        <td style={{width:'auto'}}>{item?.Vehicle?.reg_no}</td>
                                                        <td style={{width:'auto'}}>{item?.Vehicle?.max_volume}</td>
                                                        {/* <td style={{width:'auto'}}>{item?.Vehicle?.status}</td> */}
                                                        {/* <td style={{width:'auto'}}></td>
                                                        <td style={{width:'auto'}}></td> */}
                                                    </tr>
                                                    ))} 
                                                </table>

                                            </Grid>

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

export default RequisitionDocument
;