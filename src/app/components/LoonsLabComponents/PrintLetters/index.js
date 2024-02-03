/*
Loons Lab Sub title component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import { Divider, Typography, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any, string } from "prop-types";
import defaultLetterHead from '../PrintLetters/defaultLetterHead.jpg';
import defaultFooter from '../PrintLetters/defaultFooter.jpg';
import { Button } from "app/components/LoonsLabComponents";

class NewlineText extends Component {

}



class PrintLetter extends Component {
    static propTypes = {
        header: any,
        footer: any,
        refferenceSection: Boolean,
        myNo: String,
        yourNo: String,
        date: String,
        address: String,
        title: String,
        letterBody: String,
        signature: String,
        letterTitle: String
    };

    static defaultProps = {
        header: defaultLetterHead,
        footer: defaultFooter,
        refferenceSection: false,
        myNo: null,
        yourNo: null,
        date: null,
        address: null,
        title: null,
        letterBody: null,
        signature: null,
        letterTitle: null
    };

    newlineText(text) {
        return text.split('\n').map(str => <p>{str}</p>);
    }

    render() {
        const {
            header,
            footer,
            refferenceSection,
            myNo,
            yourNo,
            date,
            address,
            title,
            letterBody,
            signature,
            letterTitle,
        } = this.props;
        /*  size: 297mm 420mm; */
        const pageStyle = `
 
 @page {
    
    margin-left:10mm;
    margin-right:5mm;
    margin-bottom:5mm;
    margin-top:8mm;
  }
 

  @media print {
    .header, .header-space,
           {
            height: 2000px;
          }
.footer, .footer-space {
            height: 55px;
          }

          
          .footer {
            position: fixed;
            bottom: 0;
          }
   
  }
`;

        return (
            <div>
                <Grid className="w-full justify-end items-end flex pb-5">
                    <ReactToPrint
                        trigger={() => <Button size="small" startIcon="print">Print</Button>}
                        pageStyle={pageStyle}
                        documentTitle={letterTitle}
                        //removeAfterPrint
                        content={() => this.componentRef}
                    />
                </Grid>
                <Grid className="bg-light-gray p-5 " style={{ borderStyle: 'double', borderColor: "#a5a4a4" }} >
                    <div className="bg-white p-5" >
                        <div>

                            <div ref={(el) => (this.componentRef = el)} >

                               
                                <table>
                                    <thead><tr><td>

                                    </td></tr></thead>
                                    <tbody><tr><td>
                                        <div className="content pl-10 pr-5">
                                            {/*  Letter refferences section */}

                                            {refferenceSection ?
                                                <table style={{ width: '100%' }}>
                                                    <tbody>
                                                        <tr>
                                                            <td className="w-120  text-12">මගේ අංකය</td>
                                                            <td className="w-1 text-14">:</td>
                                                            <td className="font-bold text-14">{myNo}</td>{/**My No value */}

                                                            <td className="w-120  text-12">ඔබේ අංකය</td>
                                                            <td className="w-1 text-14">:</td>
                                                            <td className="font-bold text-14">{yourNo}</td>{/**Your No value */}


                                                            <td className="w-120 text-12">දිනය</td>
                                                            <td className="w-1 text-14">:</td>
                                                            <td className="font-bold text-14">{date}</td>{/**Date value */}
                                                        </tr>
                                                        <tr>
                                                            <td className=" text-14">My No</td>
                                                            <td className="w-1 text-14">:</td>
                                                            <td className="font-bold text-14"></td>
                                                            <td className=" text-14">Your No</td>
                                                            <td className="w-1 text-14">:</td>
                                                            <td className="font-bold text-14"></td>
                                                            <td className=" text-14">Date</td>
                                                            <td className="w-1 text-14">:</td>
                                                            <td className="font-bold text-14"></td>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                                : null}

                                            {/* Letter Address */}

                                            <Grid container className="pt-10 ">
                                                <Grid className="text-16" style={{ lineHeight: '0.5' }} >
                                                    {this.newlineText(address)}
                                                </Grid>
                                            </Grid>

                                            {/* Letter Title */}
                                            <Grid container className="pt-3  line-height-1 font-bold text-18" style={{ textDecoration: 'underline' }}>
                                                <Grid item >
                                                    {this.newlineText(title)}
                                                </Grid>
                                            </Grid>


                                            {/* Letter Boddy */}
                                            <Grid container className="pt-3  line-height-2 text-16" style={{ textAlign: 'justify' }}>
                                                <Grid item >
                                                    {this.newlineText(letterBody)}
                                                </Grid>
                                            </Grid>

                                            {/* Letter  signature */}

                                            <Grid container className="pt-10 ">
                                                <Grid className="text-16" style={{ lineHeight: '0.5' }} >
                                                    {this.newlineText(signature)}
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

export default PrintLetter;