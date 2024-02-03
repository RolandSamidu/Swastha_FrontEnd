import React, { Component } from "react";
import { Button } from "app/components/LoonsLabComponents";
import { Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
// import { dateParse } from 'utils'

class SampleRejectReport extends Component {
    

    constructor(props) {
        super(props)
        this.state = {

            // today : Date(),
            // wdnNumber:this.props.wdnNumber,
            // wharfRef:this.props.wharfRef,
            // indentNo:this.props.indentNo,
            // orderListNo:this.props.orderListNo,
        }}

    static propTypes = {
        myNo: String,
        wdnNumber: String,
        date: String,
        wharfRef: String,
        indentNo: String,
        orderListNo: String,
        item: String,
        srNo:String,
        suplier:String,
        physicalDefects: String,
        otherObservation: String,
        instructions:String,
        toDate:String,
        toMonth: String,
        toYear:String,
        // today:String,
        assistDirector:String,
        sco:String
    };

    static defaultProps = {
        myNo:null,
        wdnNumber: null,
        date:null,
        wharfRef:null,
        indentNo:null,
        orderListNo: null,
        item:null,
        srNo:null,
        suplier:null,
        physicalDefects:null,
        otherObservation:null,
        instructions:null,
        toDate:null,
        toMonth: null,
        toYear:null,
        // today:null,
        assistDirector:null,
        sco:null
    };

    // cuttentDate(){
    //     let newDate = new Date();
    //     let date = newDate.getDate();
    //     let month = newDate.getMonth() + 1;
    //     let year = newDate.getFullYear();
    //     this.setState({
    //         toDate:date,
    //         toMonth:month,
    //         toYear:year
    //     })
    // }

    

    // componentDidMount(){
    //     this.cuttentDate()
    // }

    render() {

        // SampleRejectReport.propTypes = {
        //     myNo: PropTypes.string.isRequired,
        //     wdnNumber: PropTypes.string.isRequired,
        //     date: PropTypes.string.isRequired,
        //     wharfRef: PropTypes.string.isRequired,
        //     indentNo: PropTypes.string.isRequired,
        //     orderListNo: PropTypes.string.isRequired,
        //     item: PropTypes.string.isRequired,
        //     srNo: PropTypes.string.isRequired,
        //     supplier: PropTypes.string.isRequired,
        //     physicalDefects: PropTypes.string.isRequired,
        //     otherObservation: PropTypes.string.isRequired,
        //     instructions: PropTypes.string.isRequired,
        //     toDate: PropTypes.string.isRequired,
        //     toMonth: PropTypes.string.isRequired,
        //     toYear: PropTypes.string.isRequired,
        //     assistDirector: PropTypes.string.isRequired,
        //   };

        const {
            myNo,
            wdnNumber,
            date,
            wharfRef,
            indentNo,
            orderListNo,
            item,
            srNo,
            suplier,
            physicalDefects,
            otherObservation,
            instructions,
            toDate,
            toMonth,
            toYear,
            // today,
            assistDirector,
            sco
        } = this.props;


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
                        // documentTitle={letterTitle}
                        //removeAfterPrint
                        content={() => this.componentRef}
                    />
                </Grid>
                <Grid className="bg-light-gray p-5 hidden" style={{ borderStyle: 'double', borderColor: "#a5a4a4" }} >
                    <div className="bg-white p-5" >
                        <div>
                            <div ref={(el) => (this.componentRef = el)} >

                                <Grid container>
                                    <div>
                                        <h4 className="mb-5">ATTACHMENT 01</h4>
                                        {/* <br></br> */}
                                        {/* <p className="mb-5">My No: MSD / CIU /....{this.state.printData.myNo}....</p> */}
                                        {/* <br></br> */}
                                        <p className="m-0 p-0">Medical Supplies Division, </p>
                                        <p className="m-0 p-0">Rev. BaddegamaWimalawansaThero Mw, </p>
                                        <p className="m-0 p-0">Colombo 10. </p>
                                        {/* <p className="m-0 p-0 mb-5">..{today}..</p> */}
                                        <p className="m-0 p-0 mb-5">{toDate}/{toMonth}/{toYear}</p>
                                        {/* <br></br> */}
                                        <p>AD(P)/AD(S)/AD(L)/AD(QA)</p>
                                    </div>
                                </Grid>

                                <Grid container>
                                    <Grid sm={12}>
                                        <div>
                                            <p className="text-center" style={{fontWeight:"bold", textDecoration: 'underline'}}>REPORT ON CONSIGNMENTS / ITEMS NOT CONFORMING TO SPECIFICATIONS / CONDITIONS</p>
                                        </div>
                                    </Grid>
                                </Grid>


                                <Grid container>
                                    <div>
                                        <p>1. WDN No .....{wdnNumber}..... Date .....{date}.... Wharf Ref ....{wharfRef}.....</p>
                                        <p>2. Indent No .....{indentNo}..... Order List No ....{orderListNo}....</p>
                                        <p>3. Item / Items .....{item}......</p>
                                        <p>&nbsp;&nbsp;&nbsp;&nbsp;SR No .....{srNo}......</p>
                                        <p>4. Supplier .....{suplier}......</p>
                                        <p>5. Above consigment is not acceptable as item/s do not conform to specifications / cnditions with respect to following</p>
                                        <div className="ml-5">
                                            <p className="m-0 p-0"><span>i&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>Invoiced items <span style={{fontWeight:'bold'}}>do not tally</span> with the description in SPC indent/specification </p>
                                            <p className="m-0 p-0"><span>ii&nbsp;&nbsp;&nbsp;&nbsp;</span>Invoiced items <span style={{fontWeight:'bold'}}>do not tally</span> with the lable of the item</p>
                                            <p className="m-0 p-0"><span>iii&nbsp;&nbsp;&nbsp;</span>Physical defects..........{physicalDefects}................. </p>
                                            <p className="m-0 p-0"><span>iv&nbsp;&nbsp;&nbsp;</span><span style={{fontWeight:'bold'}}>Any other observation........{otherObservation}...................</span> </p>
                                        </div>
                                        <p>Forwarded for your information and instructions plese.</p>
                                        <p>.....{instructions}.....</p>
                                        <p className="p-0 m-0">SCO ( {sco} )</p>
                                        <p>D / MSD</p>
                                        <p className="mb-5">Consigment is not accetable for reasons indicated above. For your instructions please.</p>
                                        <p>..........{assistDirector}.............</p>
                                        <p className="mb-5" style={{fontWeight:'bold'}} >Asst Director (P/S/L/QA)</p>
                                        <hr></hr>
                                    </div>
                                </Grid>


                                <Grid container>
                                    <div>
                                        <p className="m-0 p-0">Managing Director / SPC</p>
                                        <p>Above detailed consignment is not acceptable for reasons stated at para above.</p>
                                        <p>Kindle do the needful and send back the items / consignment immediately.</p>
                                        <br></br>
                                    </div>
                                </Grid>

                                <Grid container>
                                    <div>
                                        <p className="m-0 p-0" style={{fontWeight:'bold'}}>Director</p>
                                        <p className="m-0 p-0" style={{fontWeight:'bold'}}>Medical Supplies Division</p>
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
 
export default SampleRejectReport;