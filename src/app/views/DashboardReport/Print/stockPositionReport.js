/*
Loons Lab StockPositionReport
Developed By Dinusha
Loons Lab
*/
import React, { Fragment, Component } from "react";
import { Button, Grid } from '@material-ui/core'
import ReactToPrint from "react-to-print";
import { any } from "prop-types";
import { dateParse, timeParse } from "utils";

class StockPositionReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
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

    }

    render() {
        const {
        } = this.props;
        /*  size: 297mm 420mm, */
        const pageStyle = `

        
 
 @page {
    size: letter portrait; /* auto is default portrait; */
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

          .tableHead {
            border: '1px solid #ffffff', 
            border-collapse: 'collapse', 
            font-size: '14px', 
            text-align: 'center', 
            padding: '5px', 
            background: '#006666', 
            color: 'white' 
          }
  }
`; 


        return (
            <div className="hidden">
                <Grid className="w-full justify-end items-end flex ">
                    <ReactToPrint
                        trigger={() => <Button id="print_presc_00514" color="primary" size="small" style={{ margin:'0', padding:'0'}}>Print</Button>}
                        pageStyle={pageStyle}
                        content={() => this.componentRef}
                    />
                </Grid>
                    <Grid className="bg-light-gray p-5" >
                        <div className="bg-white p-5" >
                            <div>

                                <div ref={(el) => (this.componentRef = el)} >
                                    <Grid className="w-full" container>   

                                    <Grid item xs={12} >
                                        <table style={{width:'100%'}}>
                                            <tr style={{width:'70%'}}>
                                                <td></td>
                                                <td style={{width:'10%'}}>
                                                    <p className="m-0 p-0" style={{fontSize:'12px'}}>Date</p>
                                                    <p className="m-0 p-0" style={{fontSize:'12px'}}>Time</p>
                                                </td>
                                                <td style={{width:'20%'}}>
                                                    <p className="m-0 p-0" style={{fontSize:'12px'}}>: {dateParse(new Date())}</p>
                                                    <p className="m-0 p-0" style={{fontSize:'12px'}}>: {timeParse(new Date())}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </Grid>

                                    <Grid item xs={12} className="mt-5" >
                                        <p style={{textAlign:'center', fontWeight: 'bold'}}>Stock Position Report</p>
                                    </Grid>
                                
                                    <Grid item xs={12} className="mt-5">
                                    <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#D4E0FF', color: 'black' }}>Ven</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#D4E0FF', color: 'black' }}>Stock Position</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#D4E0FF', color: 'black' }}>MSD</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#D4E0FF', color: 'black' }}>Institutes</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#D4E0FF', color: 'black' }}>National</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px',fontWeight: '600', textAlign: 'center', padding: '5px', background: '#D4E0FF', color: 'black' }}>% Stock availability at MSD</td>
                                            </tr>
                                        </thead>
                                    </table>

                                </Grid>

                                <Grid item xs={12} className='mt-5' >
                                    <table style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '100%' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#00cc00' }}>Available Stock</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }} >{this.props.data?.six_months_more[0]?.msd?.V + this.props.data?.three_to_six_months[0]?.msd?.V + this.props.data?.two_to_three_months[0]?.msd?.V + this.props.data?.one_to_two_months[0]?.msd?.V + this.props.data?.one_months[0]?.msd?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }} >{this.props.data?.six_months_more[0]?.institute?.V + this.props.data?.three_to_six_months[0]?.institute?.V + this.props.data?.two_to_three_months[0]?.institute?.V + this.props.data?.one_to_two_months[0]?.institute?.V + this.props.data?.one_months[0]?.institute?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }} >{this.props.data?.six_months_more[0]?.national?.V + this.props.data?.three_to_six_months[0]?.national?.V + this.props.data?.two_to_three_months[0]?.national?.V + this.props.data?.one_to_two_months[0]?.national?.V + this.props.data?.one_months[0]?.national?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{(((this.props.data?.six_months_more[0]?.msd?.V + this.props.data?.three_to_six_months[0]?.msd?.V + this.props.data?.two_to_three_months[0]?.msd?.V + this.props.data?.one_to_two_months[0]?.msd?.V + this.props.data?.one_months[0]?.msd?.V) / (this.props.data?.v_stocks?.count) * 100)).toFixed(2)}%</td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#66ff66' }}>More than 6 months</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('V', 'msd', 'moreSix')}>{this.props.data?.six_months_more[0]?.msd?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('V', 'ins', 'moreSix')}>{this.props.data?.six_months_more[0]?.institute?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('V', 'nat', 'moreSix')}>{this.props.data?.six_months_more[0]?.national?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>3 to 6 months</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'msd', 'threeSix')}>{this.props.data?.three_to_six_months[0]?.msd?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'ins', 'threeSix')}>{this.props.data?.three_to_six_months[0]?.institute?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'nat', 'threeSix')}>{this.props.data?.three_to_six_months[0]?.national?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}>Vital ({this.props.data?.v_stocks?.count})</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>2 to 3 months</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'msd', 'twoThree')}>{this.props.data?.two_to_three_months[0]?.msd?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'ins', 'twoThree')}>{this.props.data?.two_to_three_months[0]?.institute?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'nat', 'twoThree')}>{this.props.data?.two_to_three_months[0]?.national?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>1 to 2 months</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'msd', 'oneTwo')}>{this.props.data?.one_to_two_months[0]?.msd?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'ins', 'oneTwo')}>{this.props.data?.one_to_two_months[0]?.institute?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('V', 'nat', 'oneTwo')}>{this.props.data?.one_to_two_months[0]?.national?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffff66' }}>1 month</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('V', 'msd', 'one')}>{this.props.data?.one_months[0]?.msd?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('V', 'ins', 'one')}>{this.props.data?.one_months[0]?.institute?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('V', 'nat', 'one')}>{this.props.data?.one_months[0]?.national?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', fontWeight: '600', padding: '5px', background: '#ff704d' }}>Out of Stocks</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d'}} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('V', 'msd', 'os')}>{this.props.data?.os[0]?.msd?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('V', 'ins', 'os')}>{this.props.data?.os[0]?.institute?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('V', 'nat', 'os')}>{this.props.data?.os[0]?.national?.V}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }}>{(((this.props.data?.os[0]?.msd?.V) / (this.props.data?.v_stocks?.count) * 100)).toFixed(2)}%</td>
                                            </tr>

                                        </tbody>
                                    </table>

                                </Grid>

                                <Grid item xs={12} className='mt-5' >
                                    <table style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '100%' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#00cc00' }}>Available Stock</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{this.props.data?.six_months_more[0]?.msd?.E + this.props.data?.three_to_six_months[0]?.msd?.E + this.props.data?.two_to_three_months[0]?.msd?.E + this.props.data?.one_to_two_months[0]?.msd?.E + this.props.data?.one_months[0]?.msd?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{this.props.data?.six_months_more[0]?.institute?.E + this.props.data?.three_to_six_months[0]?.institute?.E + this.props.data?.two_to_three_months[0]?.institute?.E + this.props.data?.one_to_two_months[0]?.institute?.E + this.props.data?.one_months[0]?.institute?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{this.props.data?.six_months_more[0]?.national?.E + this.props.data?.three_to_six_months[0]?.national?.E + this.props.data?.two_to_three_months[0]?.national?.E + this.props.data?.one_to_two_months[0]?.national?.E + this.props.data?.one_months[0]?.national?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{(((this.props.data?.six_months_more[0]?.msd?.E + this.props.data?.three_to_six_months[0]?.msd?.E + this.props.data?.two_to_three_months[0]?.msd?.E + this.props.data?.one_to_two_months[0]?.msd?.E + this.props.data?.one_months[0]?.msd?.E) / (this.props.data?.E_stocks?.count) * 100)).toFixed(2)}%</td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#66ff66' }}>More than 6 months</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('E', 'msd', 'moreSix')}>{this.props.data?.six_months_more[0]?.msd?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('E', 'ins', 'moreSix')}>{this.props.data?.six_months_more[0]?.institute?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('E', 'nat', 'moreSix')}>{this.props.data?.six_months_more[0]?.national?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>3 to 6 months</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'msd', 'threeSix')}>{this.props.data?.three_to_six_months[0]?.msd?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'ins', 'threeSix')}>{this.props.data?.three_to_six_months[0]?.institute?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'nat', 'threeSix')}>{this.props.data?.three_to_six_months[0]?.national?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}>Essential ({this.props.data?.E_stocks?.count})</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>2 to 3 months</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'msd', 'twoThree')}>{this.props.data?.two_to_three_months[0]?.msd?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'ins', 'twoThree')}>{this.props.data?.two_to_three_months[0]?.institute?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'nat', 'twoThree')}>{this.props.data?.two_to_three_months[0]?.national?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>1 to 2 months</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'msd', 'oneTwo')}>{this.props.data?.one_to_two_months[0]?.msd?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'ins', 'oneTwo')}>{this.props.data?.one_to_two_months[0]?.institute?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('E', 'nat', 'oneTwo')}>{this.props.data?.one_to_two_months[0]?.national?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffff66' }}>1 month</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('E', 'msd', 'one')}>{this.props.data?.one_months[0]?.msd?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('E', 'ins', 'one')}>{this.props.data?.one_months[0]?.institute?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('E', 'nat', 'one')}>{this.props.data?.one_months[0]?.national?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', fontWeight: '600', padding: '5px', background: '#ff704d' }}>Out of Stocks</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('E', 'msd', 'os')}>{this.props.data?.os[0]?.msd?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('E', 'ins', 'os')}>{this.props.data?.os[0]?.institute?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('E', 'nat', 'os')}>{this.props.data?.os[0]?.national?.E}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }}>{(((this.props.data?.os[0]?.msd?.E) / (this.props.data?.E_stocks?.count) * 100)).toFixed(2)}%</td>
                                            </tr>

                                        </tbody>
                                    </table>

                                </Grid>

                                <Grid item xs={12} className='mt-5' >
                                    <table style={{ border: '1px solid #ffffff', borderCollapse: 'collapse', width: '100%' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffd066' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#00cc00' }}>Available Stock</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{this.props.data?.six_months_more[0]?.msd?.N + this.props.data?.three_to_six_months[0]?.msd?.N + this.props.data?.two_to_three_months[0]?.msd?.N + this.props.data?.one_to_two_months[0]?.msd?.N + this.props.data?.one_months[0]?.msd?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{this.props.data?.six_months_more[0]?.institute?.N + this.props.data?.three_to_six_months[0]?.institute?.N + this.props.data?.two_to_three_months[0]?.institute?.N + this.props.data?.one_to_two_months[0]?.institute?.N + this.props.data?.one_months[0]?.institute?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{this.props.data?.six_months_more[0]?.national?.N + this.props.data?.three_to_six_months[0]?.national?.N + this.props.data?.two_to_three_months[0]?.national?.N + this.props.data?.one_to_two_months[0]?.national?.N + this.props.data?.one_months[0]?.national?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#00cc00' }}>{(((this.props.data?.six_months_more[0]?.msd?.N + this.props.data?.three_to_six_months[0]?.msd?.N + this.props.data?.two_to_three_months[0]?.msd?.N + this.props.data?.one_to_two_months[0]?.msd?.N + this.props.data?.one_months[0]?.msd?.N) / (this.props.data?.N_stocks?.count) * 100)).toFixed(2)}%</td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffd066' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#66ff66' }}>More than 6 months</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('N', 'msd', 'moreSix')}>{this.props.data?.six_months_more[0]?.msd?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('N', 'ins', 'moreSix')}>{this.props.data?.six_months_more[0]?.institute?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#66ff66')} onClick={() => this.reloadData('N', 'nat', 'moreSix')}>{this.props.data?.six_months_more[0]?.national?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#66ff66' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffd066' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>3 to 6 months</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'msd', 'threeSix')}>{this.props.data?.three_to_six_months[0]?.msd?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'ins', 'threeSix')}>{this.props.data?.three_to_six_months[0]?.institute?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'nat', 'threeSix')}>{this.props.data?.three_to_six_months[0]?.national?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffd066' }}>Non-Essential ({this.props.data?.N_stocks?.count})</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>2 to 3 months</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'msd', 'twoThree')}>{this.props.data?.two_to_three_months[0]?.msd?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'ins', 'twoThree')}>{this.props.data?.two_to_three_months[0]?.institute?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'nat', 'twoThree')}>{this.props.data?.two_to_three_months[0]?.national?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffd066' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffffe6' }}>1 to 2 months</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'msd', 'oneTwo')}>{this.props.data?.one_to_two_months[0]?.msd?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'ins', 'oneTwo')}>{this.props.data?.one_to_two_months[0]?.institute?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffffe6')} onClick={() => this.reloadData('N', 'nat', 'oneTwo')}>{this.props.data?.one_to_two_months[0]?.national?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffffe6' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderBottom: 0, borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffd066' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', padding: '5px', background: '#ffff66' }}>1 month</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('N', 'msd', 'one')}>{this.props.data?.one_months[0]?.msd?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('N', 'ins', 'one')}>{this.props.data?.one_months[0]?.institute?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ffff66')} onClick={() => this.reloadData('N', 'nat', 'one')}>{this.props.data?.one_months[0]?.national?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffff66' }}></td>
                                            </tr>
                                            <tr>
                                                <td style={{ border: '1px solid black', borderTop: 0, borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ffd066' }}></td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '25%', fontSize: '14px', fontWeight: '600', padding: '5px', background: '#ff704d' }}>Out of Stocks</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('N', 'msd', 'os')}>{this.props.data?.os[0]?.msd?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('N', 'ins', 'os')}>{this.props.data?.os[0]?.institute?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }} onMouseOver={(e) => (e.target.style.background = '#cbfffb')} onMouseOut={(e) => (e.target.style.background = '#ff704d')} onClick={() => this.reloadData('N', 'nat', 'os')}>{this.props.data?.os[0]?.national?.N}</td>
                                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', width: '15%', fontSize: '14px', textAlign: 'center', padding: '5px', background: '#ff704d' }}>{(((this.props.data?.os[0]?.msd?.N) / (this.props.data?.N_stocks?.count) * 100)).toFixed(2)}%</td>
                                            </tr>

                                        </tbody>
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

export default StockPositionReport
;