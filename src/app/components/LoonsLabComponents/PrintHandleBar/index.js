/*
Loons Lab Sub title component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from "react";
import { Divider, Typography, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any, string } from "prop-types";
import { Button } from "app/components/LoonsLabComponents";

class NewlineText extends Component {

}



class PrintHandleBar extends Component {
    static propTypes = {
        header: any,
        footer: any,
        buttonTitle: String,
        content:any,
        title: String
    };

    static defaultProps = {
        buttonTitle: null,
        content: null,
        title: null
    };

    newlineText(text) {
        return text.split('\n').map(str => <p>{str}</p>);
    }

    render() {
        const {
            buttonTitle,
            content,
            title
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
            <div className="w-full">
                <Grid className="w-full justify-end items-end flex pb-5">
                    <ReactToPrint
                        trigger={() => <Button size="small" startIcon="print">{buttonTitle}</Button>}
                        pageStyle={pageStyle}
                        documentTitle={title}
                        //removeAfterPrint
                        content={() => this.componentRef}
                    />
                </Grid>
                <Grid className="bg-light-gray p-5 w-full" style={{ borderStyle: 'double', borderColor: "#a5a4a4" }} >
                    <div className="bg-white p-5" >
                        <div  className="w-full">

                            <div ref={(el) => (this.componentRef = el)} >
                                {/*   <div class="header-space">

                                    <img alt="A test image" src={header} style={{ width: '100%' }} />
                                </div> */}
                                <table>
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                                </table>

                                {/*  <div class="footer">
                                    <img className="footer " alt="A test image" src={footer} style={{ width: '100%' }} />
                                </div> */}

                            </div>
                        </div>
                    </div>
                </Grid>
            </div>
        );
    }
}

export default PrintHandleBar;