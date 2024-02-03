/*
Loons Lab Hospitaldirecter
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Grid, Box } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import InventoryService from "app/services/InventoryService";
import SchedulesServices from "app/services/SchedulesServices";
import { dateParse, timeParse, roundDecimal, convertTocommaSeparated } from "utils";
import { intlFormat } from "date-fns";
import PrintIcon from '@mui/icons-material/Print';


class OrderList extends Component { 
    constructor(props) {
        super(props)
        this.state = {
            data:[],
            orderList: [],
            orderId:null,
            orderListId: null,
            userName: null,
            myData:[]
        }
    }

    static propTypes = {
        header: any,
        footer: any,

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
        console.log('mydata' , this.props.orderList)
    } 

    

    render() {
        
        let total=0;

        const {
            pageNo,
            priority,
            tab,
        } = this.props;
        /*  size: 297mm 420mm, */
        const pageStyle = `

        
 
 @page {
    
    margin-left:20mm,
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

// const totalQuantity = item.OrderListItemSchedules.reduce(
//     (total, element) => total + element.quantity,
//     0
//   );


        return ( 
            
            <div>
                <Grid className="w-full justify-end items-end flex ">
                    <ReactToPrint
                        trigger={() => <Button id="print_button_006" color="primary" size="small" style={{ margin:'0', padding:'0'}}>Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray p-5 hidden" >
                        <div className="bg-white p-5" >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                    <Grid className="w-full">   
                                
                                        {/* loop start */}
                                    {this.props.orderList?.OrderListItems?.map((item, index) => ( 
                                        
                                    <>
                                    <p className="hidden">{ total+= parseFloat(item.total_calculated_cost)}</p>
                                    <React.Fragment key={index}>
                                        <Grid container>

                                        {index === 0 && (
                                        <Grid item sm={12}>
                                                <table  style={{width:'100%'}}>
                                                    <tr> 
                                                        <td style={{width:"30%", fontWeight:"bold"}}><p className="m-0 p-0">Medical Supplies Division</p></td>
                                                        <td style={{width:"40%", textAlign:"center",fontWeight:"bold"}}><p className="m-0 p-0">ORDER LIST</p></td>
                                                        <td style={{width:"15%", textAlign:"right"}}><p className="m-0 p-0">User Name</p></td>
                                                        <td style={{width:"15%"}}><p className="m-0 p-0">:{this.props.userName}</p></td>
                                                    </tr>
                                                    
                                                    <tr> 
                                                        <td style={{width:"30%"}}></td>
                                                        <td style={{width:"40%"}}></td>
                                                        <td style={{width:"15%", textAlign:"right"}}><p className="m-0 p-0">Date</p></td>
                                                        <td style={{width:"15%"}}><p className="m-0 p-0">:{dateParse(item.createdAt)}</p></td>
                                                    </tr>

                                                    <tr> 
                                                        <td style={{width:"30%"}}></td>
                                                        <td style={{width:"40%", textAlign:"center", fontWeight:"bold"}}>{this.props.orderListId}</td>
                                                        <td style={{width:"15%", textAlign:"right"}}><p className="m-0 p-0">Time</p></td>
                                                        <td style={{width:"15%"}}><p className="m-0 p-0">:{timeParse(item.createdAt)}</p></td>
                                                    </tr>
                                                    {/* <tr> 
                                                        <td style={{width:"30%"}}></td>
                                                        <td style={{width:"40%", textAlign:"center"}}></td>
                                                        <td style={{width:"15%", textAlign:"right"}}><p className="m-0 p-0">Page No</p></td>
                                                        <td style={{width:"15%"}}><p className="m-0 p-0">:{pageNo}</p></td>
                                                    </tr> */}
                                                </table>
                                            </Grid>
                                        )}
                                            <Grid item sm={12}>
                                                <table style={{width:"100%"}}>
                                                    
                                                        {index === 0 && (
                                                            <tr style={{ fontWeight: "bold" }}>
                                                                <td style={{ borderBottom: "1px solid black", borderCollapse: "collapse", width:"5%" }}>Seq</td>
                                                                <td style={{ borderBottom: "1px solid black", borderCollapse: "collapse", width:"20%" }}>Item</td>
                                                                <td style={{ borderBottom: "1px solid black", borderCollapse: "collapse", width:"15%" }}>Date Scheduled</td>
                                                                <td style={{ borderBottom: "1px solid black", borderCollapse: "collapse", width:"20%" }}>Quantity</td>
                                                                <td style={{ borderBottom: "1px solid black", borderCollapse: "collapse", width:"15%" }}>Unit Price (Rs)</td>
                                                                <td style={{ borderBottom: "1px solid black", borderCollapse: "collapse", width:"25%" }}>Cost (Rs)</td>
                                                            </tr>
                                                        )}

                                                        <tr>
                                                            <td style={{width:"5%"}}>{index + 1}</td>
                                                            <td colspan="5" style={{width:"100%"}}>{item.ItemSnap.sr_no}&nbsp;&nbsp;&nbsp;{item.ItemSnap.medium_description}</td>
                                                            <td style={{width:"15%"}}></td>
                                                            <td style={{width:"20%"}}></td>
                                                            <td style={{width:"15%"}}></td>
                                                            <td style={{width:"25%"}}></td>
                                                        </tr>

                                                        {item.OrderListItemSchedules.map((element, index) => (
                                                        <tr key={index}>
                                                            <td style={{width:"5%"}}></td>
                                                            <td style={{width:"20%"}}></td>
                                                            <td style={{width:"15%"}}>{dateParse(element.schedule_date)}</td>
                                                            <td style={{width:"20%"}}>{convertTocommaSeparated(element.quantity, 0)}</td>
                                                            <td style={{width:"15%"}}>{element.standard_cost}</td>
                                                            <td style={{width:"25%"}}>{ convertTocommaSeparated(parseFloat(Number(element.quantity) * Number(element.standard_cost)),2)}</td>
                                                        </tr>
                                                        ))}
                                                        <tr>
                                                            <td style={{width:"5%"}}></td>
                                                            <td style={{width:"20%"}}></td>
                                                            <td style={{fontWeight:"bold",width:"15%"}}>Total</td>
                                                            <td style={{fontWeight:"bold",width:"15%"}}>
                                                                {convertTocommaSeparated(item.OrderListItemSchedules.reduce(function(total, element) {
                                                                return total + parseInt(element.quantity);
                                                                }, 0), 0)}
                                                            </td>
                                                            <td style={{width:"15%"}}>{item?.uom}</td>
                                                            <td style={{fontWeight:"bold"}}>
                                                            {convertTocommaSeparated(item.OrderListItemSchedules.reduce(function(total, e) {
                                                                return total + parseFloat(roundDecimal((e.quantity * e.standard_cost),2));
                                                                }, 0), 2)}
                                                                {/* {(parseFloat(item.total_calculated_cost)).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2 })}
                                                                 */}
                                                                </td>
                                                        </tr>
                                                </table>

                                                <div>
                                                    <Grid item xs={12} style={{ width: "100%" }}>
                                                        <table style={{width:"50%"}}>
                                                            {/* <thead>
                                                                <tr>
                                                                    <td style={{fontWeight:"bold"}}>Priority</td>
                                                                    <td style={{textAlign:"right"}}>TAB</td>
                                                                    <td style={{textAlign:"right"}}>PACK</td>
                                                                </tr>
                                                            </thead> */}

                                                            <tbody>
                                                            {/* {data.map((row, index) => ( */}
                                                                <tr>
                                                                    <td>{priority}</td>
                                                                    <td style={{textAlign:"right"}}>{tab}</td>
                                                                    <td style={{textAlign:"right"}}>{item.pack_size}</td>
                                                                </tr>
                                                            {/* ))} */}

                                                            </tbody>
                                                        </table>
                                                    </Grid>

                                                    <Grid item sm={12} className="mt-5">
                                                        <p style={{fontWeight:"bold"}}>Specification :</p>
                                                        <div dangerouslySetInnerHTML={{ __html: item.ItemSnap.specification }} />
                                                        
                                                    </Grid>

                                                    <Grid className="mt-5" item sm={12} style={{borderTop: "1px dotted black", margin: "20px 0"}}>

                                                    </Grid>
                                                </div>
                                            </Grid>
                                            

                                        </Grid>

                                        </React.Fragment>
                                        </>
                                        
                                        ))}
                                        <Grid container>

                                            <Grid item sm={12}>
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{width:"5%"}}></td>
                                                        <td style={{width:"20%"}}></td>
                                                        <td style={{width:"15%"}}></td>
                                                        <td style={{width:"20%"}}></td>
                                                        <td style={{width:"15%", fontWeight:'bold'}}>Total Cost:</td>
                                                        <td style={{width:"25%", fontWeight:'bold'}}>{(parseFloat(total)).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2 })}</td>
                                                        
                                                    </tr>
                                                </table>
                                                <p style={{fontWeight:"bold"}}>Total number of items: {this.props.orderList?.length} </p>
                                            </Grid>

                                        </Grid>
                                        
                                        {/* loop end */}

                                        <div className="footer"  style={{ width: '100%' }}>

                                            <Grid item sm={12}>
                                                <table style={{width:"100%"}}>
                                                    <tr className="mt-20">
                                                        <td style={{width:"50%", textAlign:"left"}}>
                                                            <p className="m-0 p-0" style={{textAlign:"center"}}>-----------------------------------------------</p>
                                                            <p className="m-0 p-0" style={{textAlign:"center"}}>Prepared by /SCO/.......: {this.props.userName}</p>
                                                            <br></br>
                                                            <br></br>
                                                            <br></br>
                                                        </td>
                                                        <td className="mt-3" style={{width:"50%", textAlign:"right"}}>
                                                            <p className="m-0 p-0" style={{textAlign:"center"}}>-----------------------------------------------</p>
                                                            <p className="m-0 p-0" style={{textAlign:"center"}}>Checked by HSCU/P/S/D</p>
                                                            <br></br>
                                                            <br></br>
                                                            <br></br>
                                                        </td>
                                                    </tr>

                                                    <tr className="mt-20">
                                                        <td style={{width:"50%", textAlign:"left"}}>
                                                            <p className="m-0 p-0" style={{textAlign:"center"}}>-----------------------------------------------</p>
                                                            <p className="m-0 p-0" style={{textAlign:"center"}}>Recommended by AD /P/S/D</p>
                                                        </td>
                                                        <td className="mt-3" style={{width:"50%", textAlign:"right"}}>
                                                            <p className="m-0 p-0" style={{textAlign:"center"}}>-----------------------------------------------</p>
                                                            <p className="m-0 p-0" style={{textAlign:"center"}}>Approved by Director / MSD</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </Grid>

                                        </div>
                                        
                                    </Grid> 
                                </div>

                            </div>
                        </div>
                    </Grid>
            </div>
        );
    }
}

export default OrderList
;