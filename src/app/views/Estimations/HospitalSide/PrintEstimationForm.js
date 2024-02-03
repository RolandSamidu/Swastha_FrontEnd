/*
Loons Lab GRNPrint
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Divider, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any, array } from "prop-types";
import { convertTocommaSeparated, dateParse, roundDecimal, timeParse } from "utils";


class PrintEstimationForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            today: new Date(),
            printData: [],
            itemIDs: [],
            packData: [],
            supplier: {},
            load: false,
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

    // get packing details
    // async getPackingDetails(){

    //     let params = {
    //         search_type:'UOMS',
    //         consignment_item_id: this.state.itemIDs
    //     }
    //     let res = await ConsignmentService.getConsignmentItems(params)

    //     if (res.status === 200){
    //         console.log('packingdet', res.data.view.data)

    //         this.setState({
    //             packData:res.data.view.data
    //         })

    //         // let updatedArray = res.data.view.data.map((obj1) => {
    //         //     const obj2 = this.props.printData.find((obj) => obj.ConsignmentItemBatch.item_id === obj1.item_id);

    //         //     console.log('testing', updatedArray, obj2)
    //         //     // if (obj2) {
    //         //     //     return { ...obj1, ...obj2 };
    //         //     // }
    //         //     // return obj1;
    //         // });
    //     }

    // }


    // async dataMapping() {
    //     let array = []
    //     let data = this.props.printData
    //     console.log('mydta', data)
    //     let itemslist = data.map((data) => data.ConsignmentItemBatch?.item_id)
    //     let uniquitemslist = [...new Set(itemslist)]

    //     console.log('pack find', itemslist)


    //     console.log('uniqe data-1111', uniquitemslist)
    //     this.setState({
    //         itemIDs: uniquitemslist,
    //         Loaded: true,
    //     },()=>{
    //         this.getPackingDetails()
    //     })
    // }


    componentDidMount() {
        console.log('props items', this.props.printData)
        // this.getSupplierInfo()
    }



    render() {

        let grnCount = 0
        let pageLineLimit = 33
        let pageNo = 0
        let filledLineCount = 10

        let newPage = false

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
        page-break-after: always;
      }
  }

  @media print {
    
      .page-break-after {
        page-break-after: always;
        counter-reset: page;
      }
    .header, .header-space{
      height: 11px;
    }
    .footer-space {
        height: 0px;
      }
    .header {
      position: fixed;
      top: 0;
    }
    .footer {
      position: fixed;
      bottom: 0;
    }
  }
`;

        return (
            <div className="hidden">
                <Grid className="w-full justify-end items-end flex">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_01" size="small" startIcon="print">Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                <Grid className="bg-light-gray p-5" >
                    <div className="bg-white p-5" >
                        <div>

                            <div ref={(el) => (this.componentRef = el)} >


                                <table>
                                    <thead><tr><td>
                                        <div class="header-space">&nbsp;</div>
                                    </td></tr></thead>
                                    <tbody><tr><td>
                                        <div class="content mt-3">

                                            <table>
                                                <th>
                                                </th>

                                                {this.props.data.map(item => (
                                                    <tr>
                                                        <td style={{ width: '20%', fontSize: '12px' }}>{item.ItemSnap?.sr_no}</td>
                                                        <td style={{ width: '60%', fontSize: '12px' }}>{item.ItemSnap?.medium_description}</td>
                                                        <td style={{ width: '20%', fontSize: '12px' }}>.......................................................</td>
                                                    </tr>
                                                )

                                                )}


                                            </table>








                                        </div>
                                    </td></tr></tbody>
                                    <tfoot><tr><td>
                                        <div class="footer-space">&nbsp;</div>
                                    </td></tr></tfoot>
                                </table>
                                <div class="header w-full">

                                    <Grid container>
                                        <Grid item sm={2}>
                                            <td style={{ fontWeight: 'bold', fontSize: '12px' }}>SR Number</td>
                                            
                                        </Grid>
                                        <Grid item sm={7}>
                                        <td style={{fontWeight: 'bold', fontSize: '12px' }}>Item Name</td>
                                            
                                        </Grid>
                                        <Grid item sm={3}>
                                        <td style={{fontWeight: 'bold', fontSize: '12px' }}>Estimation</td>

                                        </Grid>
                                    </Grid>

                                </div>
                                <div class="footer">

                                </div>




















                            </div>

                        </div>
                    </div>
                </Grid>
            </div>
        );
    }
}

export default PrintEstimationForm;