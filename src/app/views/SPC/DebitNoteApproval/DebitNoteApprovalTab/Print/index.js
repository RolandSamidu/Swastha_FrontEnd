import React, { Fragment, Component } from "react";
import { Button, Grid, Typography } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import { dateParse, timeParse  } from 'utils'

class DebitNoteApproval extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
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
        console.log("Data :", this.props.data)
    }

    render() {
        const {
            hospital,
            supplier,
            umo,
            user
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
                <Grid className="w-full justify-end items-end flex hidden ">
                    <ReactToPrint
                        trigger={() => <Button id="debit_note_print_view" color="primary" size="small" style={{ margin:'0', padding:'0'}}>Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray p-5 hidden" >
                        <div className="bg-white p-5" >
                            <div>
                                <div ref={(el) => (this.componentRef = el)} > 
                                    <Grid className="w-full" container>
                                        <Grid container>
                                            <Grid item xs={12} sm={12} lg={12} md={12} style={{ display: "flex", justifyContent: "center" }}>
                                                <div style={{ flex: 1, justifyContent: 'center', alignItems: "center", display: "flex" }}>
                                                    <Typography variant="subtitle1" style={{ textAlign: "center", fontWeight: 'bold'}}>Debit Note</Typography>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: "row" }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div><Typography variant="subtitle1">Date&nbsp;&nbsp;: </Typography></div>
                                                        <div><Typography variant="subtitle1">Time&nbsp;&nbsp;: </Typography></div>
                                                        <div><Typography variant="subtitle1">User&nbsp;&nbsp;: </Typography></div>
                                                        {/* <div><Typography variant="subtitle1">Page&nbsp;: </Typography></div> */}
                                                    </div>
                                                    <div>
                                                        <div><Typography variant="subtitle1">{dateParse(new Date())}</Typography></div>
                                                        <div><Typography variant="subtitle1">{timeParse(new Date())}</Typography></div>
                                                        <div><Typography variant="subtitle1">{this.props.user}</Typography></div>
                                                        {/* <div><Typography variant="subtitle1">{'1'}</Typography></div> */}
                                                    </div>
                                                </div>
                                            </Grid>
                                            {/* <Grid item xs={12} sm={12} lg={12} md={12}>
                                                <Typography variant="subtitle1" style={{ textAlign: "center" }}>
                                                    {hospital?.name ? `${hospital.name}, ${hospital.province} Province, ${hospital.district}` : 'Not Available'}
                                                </Typography>
                                            </Grid> */}
                                            <Grid item sm={12}>
                                                <hr/>
                                            </Grid>
                                            <Grid item sm={12} className="mt-5">
                                                <table style={{width:"100%"}}>
                                                    <tr> 
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Debit Note No</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.debit_note_no? this.state.data?.debit_note_nodebit_note_no : "Not Available"}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Debit Note Type</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.debit_note_type ? this.state.data?.debit_note_type: "Not Available"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Debit Note Sub Type</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.debit_note_sub_type}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Type</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.type}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Status</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.status}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}></td>
                                                        <td style={{width:"30%"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Remark</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.remark}</td>
                                                        {/* <td style={{width:"20%", fontWeight:"bold"}}>GRN ID</td>
                                                        <td style={{width:"30%"}}>:{this.state.consignmentData?.grn_no}</td> */}
                                                    </tr>
                                                </table>
                                            </Grid>
                                            <Grid item sm={12} className="mt-5">
                                                <table style={{width:"100%"}}>
                                                    <tr> 
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Invoice Value</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.invoice_value}</td>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Total Charges</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.total_charges}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"20%", fontWeight:"bold"}}>Final Value</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.final_value}</td>
                                                        {/* <td style={{width:"20%", fontWeight:"bold"}}>Type</td>
                                                        <td style={{width:"30%"}}>:{this.state.data?.type}</td> */}
                                                    </tr>
                                                </table>
                                            </Grid>
                                            <React.Fragment>
                                            <Grid item sm={12} className="mt-5">
                                                <Typography variant="body1" style={{fontWeight:"bold", marginTop:"8px", marginBottom:"8px"}}>Debit Note Charges</Typography>
                                            <table style={{width:"100%"}}>
                                                <thead>
                                                <tr>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"10%"}}>Type</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"25%"}}>Percentage Or Value</td>
                                                    <td style={{ borderBottom:"1px dotted black", borderCollapse: "collapse", fontWeight:"bold", width:"10%"}}>Amount</td>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.data?.DebitNoteCharges?.map((item, i)=>(
                                                <tr key={i}>
                                                    <td style={{width:"10%"}}>{item?.TransactionType?.type}</td>
                                                    <td style={{width:"25%"}}>{item?.percentage_or_value}</td>
                                                    <td style={{width:"10%"}}>{item?.amount}</td>
                                                </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                            </Grid>
                                            </React.Fragment>
                                        </Grid>
                                   
                                        {/* <Grid container>
                                            
                                            <Grid className="mt-5" item sm={12}>
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{textAlign:"center", width:"50%"}}>.............................</td>
                                                        <td style={{textAlign:"center", width:"50%"}}>.............................</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign:"center", width:"50%", fontWeight:"bold"}}>Checked By</td>
                                                        <td style={{textAlign:"center", width:"50%", fontWeight:"bold"}}>Approved By</td>
                                                    </tr>
                                                </table>
                                            </Grid>
                                        </Grid> */}
                                    </Grid> 
                                </div>
                            </div>
                        </div>
                    </Grid>
            </div>
        );
    }
}

export default DebitNoteApproval;