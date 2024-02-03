/*
Loons Lab Hospitaldirecter
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import {  Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import {
    LoonsTable,
    DatePicker,
    Button,
    FilePicker,
    ExcelToTable,
    LoonsSnackbar,
    LoonsDialogBox,
    LoonsSwitch,
    LoonsCard,
    CardTitle,
    SubTitle,
    Charts,
}
    from "app/components/LoonsLabComponents";
import { dateParse,dateTimeParse } from '../../../../utils'
    
class MSDPrintLab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:[]
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
        let data = this.props.data
        console.log('data234',data)
        this.setState({
            data:data
        })
    }

    render() {
        const {
            date,
            time,
            user,
            authority,
            institutionCode,
            UnDate,
            batchNo,
            expDate,
            manufacturers,
            defects,
            storageCondition,
            remarks
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
                <Grid className="w-full justify-end items-end flex mt-6">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_004" >Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray p-5" hidden  >
                        <div className="bg-white p-5" >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                    <Grid className="w-full">   
                                
                                        <Grid container>

                                            <Grid item sm={12}>
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{width:"60%", fontWeight:"bold"}}><p className="m-0 p-0">Log Deatils</p></td>
                                                        <td style={{width:"10%"}}>
                                                            <p className="m-0 p-0">Date</p>
                                                        </td>
                                                        <td style={{width:"30%"}}>
                                                            <p className="m-0 p-0">:{dateParse(this.state.data?.Log_by?.createdAt)}</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"60%"}}></td>
                                                        <td style={{width:"10%"}}>
                                                            <p className="m-0 p-0">Time</p>
                                                        </td>
                                                        <td style={{width:"30%"}}>
                                                            <p className="m-0 p-0">:{dateTimeParse(this.state.data?.Log_by?.createdAt)}</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{width:"60%"}}></td>
                                                        <td style={{width:"10%"}}>
                                                            <p className="m-0 p-0">User</p>
                                                        </td>
                                                        <td style={{width:"30%"}}>
                                                            <p className="m-0 p-0">:{this.state.data?.Log_by?.name}</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </Grid>

                                            <Grid item sm={12}>
                                                <p style={{fontWeight:"bold"}}>Director National Drug Quality Assuarance Lab</p>
                                            </Grid>

                                            <Grid item sm={12}>
                                                <hr/>
                                            </Grid>

                                            <Grid item sm={12}>
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{width:"40%"}}>
                                                            <p>____Unlire</p>
                                                            <p>Authority</p>
                                                            <p>Institution Code</p>
                                                            <p>Date</p>
                                                            <p>____Unlire</p>
                                                        </td>
                                                        <td style={{width:"60%"}}>
                                                            <p>: ____Unlire</p>
                                                            <p>: {this.state.data?.SampleLocation?.name}</p>
                                                            <p>: {this.state.data?.SampleLocation?.owner_id}</p>
                                                            <p>: {dateParse(this.state.data?.SampleLocation?.createdAt)}</p>
                                                            <p>: ____Unlire</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </Grid>

                                            <Grid item sm={12}>
                                                <p style={{fontWeight:"bold"}}>Details</p>
                                            </Grid>

                                            <Grid item sm={12}>
                                                <table style={{width:"100%"}}>
                                                    <tr>
                                                        <td style={{width:"40%"}}>
                                                            <p>____Unlire__item</p>
                                                            <p>Batch No.</p>
                                                            <p>Exp. Date</p>
                                                            <p>Manufacturer</p>
                                                            <p>Defects</p>
                                                            <p>Storege Condition</p>
                                                            <p>Remarks</p>
                                                        </td>
                                                        <td style={{width:"60%"}}>
                                                            <p>: ____Unlire</p>
                                                            <p>: {this.state.data?.ItemSnapBatch?.batch_no}</p>
                                                            <p>: {this.state.data?.ItemSnapBatch?.exd}</p>
                                                            <p>: {this.state.data?.ItemSnapBatch?.manufacture_id}</p>
                                                            <p>: {this.state.data?.defects}</p>
                                                            <p>: {this.state.data?.storage_conditions}</p>
                                                            <p>: {this.state.data?.remarks}</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </Grid>

                                            <Grid item sm={12} className="mt-20">
                                                 <p style={{fontWeight:"bold"}}>{this.state.data?.Head?.name}</p>
                                                <p style={{fontWeight:"bold"}}>-----------------------------------</p>
                                                <p style={{fontWeight:"bold"}}>Head of Institution</p>
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

export default MSDPrintLab
;