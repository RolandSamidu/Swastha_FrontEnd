/*
Loons Lab Hospitaldirecter
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";

import { dateParse, dateTimeParse, timeParse } from "utils";
import DonarService from "app/services/DonarService";
import EmployeeServices from 'app/services/EmployeeServices'

class HospitalIssueNote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data : null,
            approve:null,
            dateTime: dateTimeParse(new Date()),
            id:null,
            itemId:null,
            Itemdata:null,
            approvedBy:null,
            filterData:{
                donation_id:null
            }
        }
    }

    static propTypes = {
        topic :String
    };

    static defaultProps = {
        topic : null

    };

    newlineText(text) {
        if (text) {
            return text.split('\n').map(str => <p>{str}</p>);
        } else {
            return ""
        }

    }

    async loadDate() {
   

    }
    async LoadEnteredBy(id) {
        let res = await EmployeeServices.getEmployeeByID(id)
        console.log("pickUpPerson Data", res)
        if (res.status) {
            console.log("pickUpPerson Data", res.data.view)
            this.setState({
                employeeName:res.data.view.name
                // pickUpPerson: {
                //     id: res.data.view.employee_id,
                //     name: res.data.view.name,
                //     contactNum: res.data.view.contact_no,
                // },viewLoaded: true,
            })
        }
    
}

  


    componentDidMount() {
        let data= this.props.data
        let quantity = this.props.quantity
        console.log('datanew',data)
        this.setState({
            data:data,
            quantity:quantity
        })
        // this.loadDate()
    }

    render() {
        const {
            sr,
            item,
            qty
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
                <Grid className="w-full mt-5 items-end flex ">
                    <ReactToPrint
                        trigger={() => <Button id="qa_print_button_001" variant="contained" color="primary" size="small">Issue Note</Button>}
                        
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray p-5 hidden" >    {/*hidden*/}
                        <div className="bg-white p-5" >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                    <Grid className="w-full">   
                                
                                        <Grid container>
                                            <Grid item sm={12}>
                                                <p style={{textAlign:"center", fontWeight:"bold"}}>Issue Note</p>
                                            </Grid>

                                            <Grid item sm={12} className="mt-5">
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{width:"55%"}}></td>
                                                        <td style={{width:"15%"}}>Date</td>
                                                        <td style={{width:"20%"}}>:{dateParse(this.state.data?.createdAt)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"55%"}}></td>
                                                        <td style={{width:"15%"}}>Time</td>
                                                        <td style={{width:"20%"}}>:{timeParse(this.state.data?.createdAt)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"55%"}}></td>
                                                        <td style={{width:"15%"}}>Log No</td>
                                                        <td style={{width:"20%"}}>:{this.state.data?.log_no}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"55%"}}></td>
                                                        <td style={{width:"15%"}}>Log Date</td>
                                                        <td style={{width:"20%"}}>:{dateParse(this.state.data?.log_created_by)}</td>
                                                    </tr>
                                                    
                                                </table>
                                            </Grid>

                                            <Grid item sm={12} className="mt-5">
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Complain By</td>
                                                        <td style={{width:"80%"}}>:{this.state.data?.Complaint_by?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Log By</td>
                                                        <td style={{width:"80%"}}>:{this.state.data?.Log_by?.name}</td>
                                                    </tr>
                                                    <br></br>
                                                   
                                                    
                                                </table>

                                                {/* <table className="ml-10" style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{width:"20%"}}>Name</td>
                                                        <td style={{width:"80%"}}>: {this.state.data?.Donor?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%"}}>Address</td>
                                                        <td style={{width:"80%"}}>: {this.state.data?.Donor?.address}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%"}}>Contact</td>
                                                        <td style={{width:"80%"}}>: {this.state.data?.Donor?.contact_no}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%"}}>Contact</td>
                                                        <td style={{width:"80%"}}>: {this.state.data?.Donor?.country}</td>
                                                    </tr>
                                                </table> */}
                                            </Grid>

                                            <Grid item sm={12} className="mt-5">
                                                <hr></hr>
                                            </Grid>

                                            <Grid item sm={12} className="mt-5">
                                                <table style={{width:"100%", border:"1px solid black", borderCollapse:"collapse"}}>
                                                    <tr>
                                                        <th style={{width:"10%", textAlign:"center", fontWeight:"bold", border:"1px solid black", borderCollapse:"collapse"}}>SR</th>
                                                        <th style={{width:"50%",textAlign:"center", fontWeight:"bold", border:"1px solid black", borderCollapse:"collapse"}}>Item Name</th>
                                                        <th style={{width:"15%", textAlign:"center", fontWeight:"bold", border:"1px solid black", borderCollapse:"collapse"}}>Batch No</th>
                                                        <th style={{width:"15%", textAlign:"center", fontWeight:"bold", border:"1px solid black", borderCollapse:"collapse"}}>Quantity</th>

                                                    </tr>
                                                     <tr>
                                                        <td style={{width:"auto", border:"1px solid black", borderCollapse:"collapse", textAlign:"center"}}>{this.state.data?.ItemSnapBatch?.ItemSnap?.sr_no}</td>
                                                        <td style={{width:"auto", border:"1px solid black", borderCollapse:"collapse", textAlign:"center"}}>{this.state.data?.ItemSnapBatch?.ItemSnap?.long_description}</td>
                                                        <td style={{width:"auto", border:"1px solid black", borderCollapse:"collapse", textAlign:"center"}}>{this.state.data?.ItemSnapBatch?.batch_no}</td>
                                                        <td style={{width:"auto", border:"1px solid black", borderCollapse:"collapse", textAlign:"center"}}>{this.state.quantity}</td>
                                                    </tr>
                                                     
                                                    {/* {this.state.Itemdata?.map((item,index)=> (
                                                    <tr key={index}>
                                                        <td style={{width:"10%", border:"1px solid black", borderCollapse:"collapse", textAlign:"center"}}>{item?.itemdata?.sr_no}</td>
                                                        <td style={{width:"50%", border:"1px solid black", borderCollapse:"collapse", textAlign:"center"}}>{item?.name}</td>
                                                      
                                                      <table style={{width:"200%" , borderCollapse:"collapse"}}>
                                                        {item?.DonationItemsBatches.map((item2,i)=>(
                                                             <tr style={{width:"100%", borderCollapse:"collapse"}}>
                                                                 <td style={{width:"50%", border:"0.5px solid black", textAlign:"center"}} >{item2?.batch_no}</td>
                                                                 <td style={{width:"50%", border:"0.5px solid black", textAlign:"center"}} >{item2?.received_quantity}</td>
                                                            </tr>
                                                        )
                                                        )}
                                                        </table>
                                                    </tr>                                                  

                                                    )
                                                )} */}
                                                   {this.state.Itemdata?.map((item,index)=> {
                                                        return(
                                                    <tr>
                                                    <td style={{width:"10%", border:"1px solid black", borderCollapse:"collapse", textAlign:"center"}}>{this.state.Itemdata[index]?.itemdata?.sr_no}</td>
                                                    <td style={{width:"50%", border:"1px solid black", borderCollapse:"collapse", textAlign:"center"}}>{this.state.Itemdata[index]?.name}</td>
                                                    {this.state.Itemdata[index]?.DonationItemsBatches.map((item2,i)=>{
                                                        return(
                                                            <tr>
                                                             <td style={{width:"15%",borderCollapse:"collapse", border:"1px solid black", textAlign:"center"}} >{this.state.Itemdata[index]?.DonationItemsBatches[i]?.batch_no}</td>
                                                            <td style={{width:"15%",borderCollapse:"collapse", border:"1px solid black", textAlign:"center"}} >{this.state.Itemdata[index]?.DonationItemsBatches[i]?.received_quantity}</td>
                                                            </tr> 
                                                        )
                                                    })}
                                                    </tr>                                                  

                                                    )
                                                })} 
                                                   
                                                </table>
                                            </Grid>

                                        </Grid>

                                        <Grid container alignItems="flex-end" style={{ position: 'absolute', bottom: 0, width: '100%' }} >
                                            <Grid item sm={12} className="mt-2" style={{ marginTop: '0px', paddingTop: '0px' }}>
                                                <hr />
                                                <p style={{ textAlign: "right" }}>System generated no. sign req.&nbsp;&nbsp;&nbsp; <span>Print</span> &nbsp;&nbsp;&nbsp; {this.state.dateTime} </p>
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

export default HospitalIssueNote
;